---
title: 'Create infrastructure for deploying a highly available PostgreSQL database on AKS'
description: Create the infrastructure needed to deploy a highly available PostgreSQL database on AKS using the CloudNativePG operator.
ms.topic: how-to
ms.date: 06/07/2024
author: kenkilty
ms.author: kkilty
ms.custom: innovation-engine, aks-related-content
---

# Create infrastructure for deploying a highly available PostgreSQL database on AKS

In this article, you create the infrastructure needed to deploy a highly available PostgreSQL database on AKS using the [CloudNativePG (CNPG)](https://cloudnative-pg.io/) operator.

[!INCLUDE [open source disclaimer](./includes/open-source-disclaimer.md)]

## Before you begin

* Review the deployment overview and make sure you meet all the prerequisites in [How to deploy a highly available PostgreSQL database on AKS with Azure CLI][postgresql-ha-deployment-overview].
* [Set environment variables](#set-environment-variables) for use throughout this guide.
* [Install the required extensions](#install-required-extensions).

## Set environment variables

Set the following environment variables for use throughout this guide:

```bash
export SUFFIX=$(cat /dev/urandom | LC_ALL=C tr -dc 'a-z0-9' | fold -w 8 | head -n 1)
export LOCAL_NAME="cnpg"
export TAGS="owner=user"
export RESOURCE_GROUP_NAME="rg-${LOCAL_NAME}-${SUFFIX}"
export PRIMARY_CLUSTER_REGION="westus3"
export AKS_PRIMARY_CLUSTER_NAME="aks-primary-${LOCAL_NAME}-${SUFFIX}"
export AKS_PRIMARY_MANAGED_RG_NAME="rg-${LOCAL_NAME}-primary-aksmanaged-${SUFFIX}"
export AKS_PRIMARY_CLUSTER_FED_CREDENTIAL_NAME="pg-primary-fedcred1-${LOCAL_NAME}-${SUFFIX}"
export AKS_PRIMARY_CLUSTER_PG_DNSPREFIX=$(echo $(echo "a$(openssl rand -hex 5 | cut -c1-11)"))
export AKS_UAMI_CLUSTER_IDENTITY_NAME="mi-aks-${LOCAL_NAME}-${SUFFIX}"
export AKS_CLUSTER_VERSION="1.29"
export PG_NAMESPACE="cnpg-database"
export PG_SYSTEM_NAMESPACE="cnpg-system"
export PG_PRIMARY_CLUSTER_NAME="pg-primary-${LOCAL_NAME}-${SUFFIX}"
export PG_PRIMARY_STORAGE_ACCOUNT_NAME="hacnpgpsa${SUFFIX}"
export PG_STORAGE_BACKUP_CONTAINER_NAME="backups"
export ENABLE_AZURE_PVC_UPDATES="true"
export MY_PUBLIC_CLIENT_IP=$(dig +short myip.opendns.com @resolver3.opendns.com)
```

## Install required extensions

The `aks-preview`, `k8s-extension` and `amg` extensions provide more functionality for managing Kubernetes clusters and querying Azure resources. Install these extensions using the following [`az extension add`][az-extension-add] commands:

```bash
az extension add --upgrade --name aks-preview --yes --allow-preview true
az extension add --upgrade --name k8s-extension --yes --allow-preview false
az extension add --upgrade --name amg --yes --allow-preview false
```

As a prerequisite for utilizing kubectl, it is essential to first install [Krew][install-krew], followed by the installation of the [CNPG plugin][cnpg-plugin]. This will enable the management of the PostgreSQL operator using the subsequent commands.

```bash
(
  set -x; cd "$(mktemp -d)" &&
  OS="$(uname | tr '[:upper:]' '[:lower:]')" &&
  ARCH="$(uname -m | sed -e 's/x86_64/amd64/' -e 's/\(arm\)\(64\)\?.*/\1\2/' -e 's/aarch64$/arm64/')" &&
  KREW="krew-${OS}_${ARCH}" &&
  curl -fsSLO "https://github.com/kubernetes-sigs/krew/releases/latest/download/${KREW}.tar.gz" &&
  tar zxvf "${KREW}.tar.gz" &&
  ./"${KREW}" install krew
)

export PATH="${KREW_ROOT:-$HOME/.krew}/bin:$PATH"

kubectl krew install cnpg
```

## Create a resource group

Create a resource group to hold the resources you create in this guide using the [`az group create`][az-group-create] command.

```bash
az group create \
    --name $RESOURCE_GROUP_NAME \
    --location $PRIMARY_CLUSTER_REGION \
    --tags $TAGS \
    --query 'properties.provisioningState' \
    --output tsv
```

## Create a user-assigned managed identity

In this section, you create a user-assigned managed identity (UAMI) to allow the CNPG PostgreSQL to use an AKS workload identity to access Azure Blob Storage. This configuration allows the PostgreSQL cluster on AKS to connect to Azure Blob Storage without a secret.

1. Create a user-assigned managed identity using the [`az identity create`][az-identity-create] command.

    ```bash
    AKS_UAMI_WI_IDENTITY=$(az identity create \
        --name $AKS_UAMI_CLUSTER_IDENTITY_NAME \
        --resource-group $RESOURCE_GROUP_NAME \
        --location $PRIMARY_CLUSTER_REGION \
        --output json)
    ```

1. Enable AKS workload identity and generate a service account to use later in this guide using the following commands:

    ```bash
    export AKS_UAMI_WORKLOAD_OBJECTID=$( \
        echo "${AKS_UAMI_WI_IDENTITY}" | jq -r '.principalId')
    export AKS_UAMI_WORKLOAD_RESOURCEID=$( \
        echo "${AKS_UAMI_WI_IDENTITY}" | jq -r '.id')
    export AKS_UAMI_WORKLOAD_CLIENTID=$( \
        echo "${AKS_UAMI_WI_IDENTITY}" | jq -r '.clientId')

    echo "ObjectId: $AKS_UAMI_WORKLOAD_OBJECTID"
    echo "ResourceId: $AKS_UAMI_WORKLOAD_RESOURCEID"
    echo "ClientId: $AKS_UAMI_WORKLOAD_CLIENTID"
    ```

The object ID is a unique identifier for the client ID (also known as the application ID) that uniquely identifies a security principal of type *Application* within the Microsoft Entra ID tenant. The resource ID is a unique identifier to manage and locate a resource in Azure. These values are required to enabled AKS workload identity.

The CNPG operator automatically generates a service account called *postgres* that you use later in the guide to create a federated credential that enables OAuth access from PostgreSQL to Azure Storage.

## Create a storage account in the primary region

1. Create an object storage account to store PostgreSQL backups in the primary region using the [`az storage account create`][az-storage-account-create] command.

    ```bash
    az storage account create \
        --name $PG_PRIMARY_STORAGE_ACCOUNT_NAME \
        --resource-group $RESOURCE_GROUP_NAME \
        --location $PRIMARY_CLUSTER_REGION \
        --sku Standard_ZRS \
        --kind StorageV2 \
        --query 'provisioningState' \
        --output tsv
    ```

1. Create the storage container to store the Write Ahead Logs (WAL) and regular PostgreSQL on-demand and scheduled backups using the [`az storage container create`][az-storage-container-create] command.

    ```bash
    az storage container create \
        --name $PG_STORAGE_BACKUP_CONTAINER_NAME \
        --account-name $PG_PRIMARY_STORAGE_ACCOUNT_NAME \
        --auth-mode login
    ```

    Example output:

    ```output
    {
        "created": true
    }
    ```

    > [!NOTE]
    > If you encounter the error message: `The request may be blocked by network rules of storage account. Please check network rule set using 'az storage account show -n accountname --query networkRuleSet'. If you want to change the default action to apply when no rule matches, please use 'az storage account update'`. Please verify user permissions for Azure Blob Storage and, if **necessary**, elevate your role to `Storage Blob Data Owner` using the commands provided below and after retry the [`az storage container create`][az-storage-container-create] command.

    ```bash
    export USER_ID=$(az ad signed-in-user show --query id --output tsv)

    export STORAGE_ACCOUNT_PRIMARY_RESOURCE_ID=$(az storage account show \
        --name $PG_PRIMARY_STORAGE_ACCOUNT_NAME \
        --resource-group $RESOURCE_GROUP_NAME \
        --query "id" \
        --output tsv)
    
    az role assignment list --scope $STORAGE_ACCOUNT_PRIMARY_RESOURCE_ID --output table

    az role assignment create \
        --assignee-object-id $USER_ID \
        --assignee-principal-type User \
        --scope $STORAGE_ACCOUNT_PRIMARY_RESOURCE_ID \
        --role "Storage Blob Data Owner" \
        --output tsv
    ```

## Assign RBAC to storage accounts

To enable backups, the PostgreSQL cluster needs to read and write to an object store. The PostgreSQL cluster running on AKS uses a workload identity to access the storage account via the CNPG operator configuration parameter [`inheritFromAzureAD`][inherit-from-azuread].

1. Get the primary resource ID for the storage account using the [`az storage account show`][az-storage-account-show] command.

    ```bash
    export STORAGE_ACCOUNT_PRIMARY_RESOURCE_ID=$(az storage account show \
        --name $PG_PRIMARY_STORAGE_ACCOUNT_NAME \
        --resource-group $RESOURCE_GROUP_NAME \
        --query "id" \
        --output tsv)

    echo $STORAGE_ACCOUNT_PRIMARY_RESOURCE_ID
    ````

1. Assign the "Storage Blob Data Contributor" Azure built-in role to the object ID with the storage account resource ID scope for the UAMI associated with the managed identity for each AKS cluster using the [`az role assignment create`][az-role-assignment-create] command.

    ```bash
    az role assignment create \
        --role "Storage Blob Data Contributor" \
        --assignee-object-id $AKS_UAMI_WORKLOAD_OBJECTID \
        --assignee-principal-type ServicePrincipal \
        --scope $STORAGE_ACCOUNT_PRIMARY_RESOURCE_ID \
        --query "id" \
        --output tsv
    ```

## Set up monitoring infrastructure

In this section, you deploy an instance of Azure Managed Grafana, an Azure Monitor workspace, and an Azure Monitor Log Analytics workspace to enable monitoring of the PostgreSQL cluster. You also store references to the created monitoring infrastructure to use as input during the AKS cluster creation process later in the guide. This section might take some time to complete.

> [!NOTE]
> Azure Managed Grafana instances and AKS clusters are billed independently. For more pricing information, see [Azure Managed Grafana pricing][azure-managed-grafana-pricing].

1. Create an Azure Managed Grafana instance using the [`az grafana create`][az-grafana-create] command.

    ```bash
    export GRAFANA_PRIMARY="grafana-${LOCAL_NAME}-${SUFFIX}"

    export GRAFANA_RESOURCE_ID=$(az grafana create \
        --resource-group $RESOURCE_GROUP_NAME \
        --name $GRAFANA_PRIMARY \
        --location $PRIMARY_CLUSTER_REGION \
        --zone-redundancy Enabled \
        --tags $TAGS \
        --query "id" \
        --output tsv)

    echo $GRAFANA_RESOURCE_ID
    ```

1. Create an Azure Monitor workspace using the [`az monitor account create`][az-monitor-account-create] command.

    ```bash
    export AMW_PRIMARY="amw-${LOCAL_NAME}-${SUFFIX}"

    export AMW_RESOURCE_ID=$(az monitor account create \
        --name $AMW_PRIMARY \
        --resource-group $RESOURCE_GROUP_NAME \
        --location $PRIMARY_CLUSTER_REGION \
        --tags $TAGS \
        --query "id" \
        --output tsv)

    echo $AMW_RESOURCE_ID
    ```

1. Create an Azure Monitor Log Analytics workspace using the [`az monitor log-analytics workspace create`][az-monitor-log-analytics-workspace-create] command.

    ```bash
    export ALA_PRIMARY="ala-${LOCAL_NAME}-${SUFFIX}"

    export ALA_RESOURCE_ID=$(az monitor log-analytics workspace create \
        --resource-group $RESOURCE_GROUP_NAME \
        --workspace-name $ALA_PRIMARY \
        --location $PRIMARY_CLUSTER_REGION \
        --query "id" \
        --output tsv)

    echo $ALA_RESOURCE_ID
    ```

## Create the AKS cluster to host the PostgreSQL cluster

In this section, you create a multizone AKS cluster with a system node pool. The AKS cluster hosts the PostgreSQL cluster primary replica and two standby replicas, each aligned to a different availability zone to enable zonal redundancy.

You also add a user node pool to the AKS cluster to host the PostgreSQL cluster. Using a separate node pool allows for control over the Azure VM SKUs used for PostgreSQL and enables the AKS system pool to optimize performance and costs. You apply a label to the user node pool that you can reference for node selection when deploying the CNPG operator later in this guide. This section might take some time to complete.

1. Create an AKS cluster using the [`az aks create`][az-aks-create] command.

    ```bash
    export SYSTEM_NODE_POOL_VMSKU="standard_d2s_v3"
    export USER_NODE_POOL_NAME="postgres"
    export USER_NODE_POOL_VMSKU="standard_d4s_v3"
    
    az aks create \
        --name $AKS_PRIMARY_CLUSTER_NAME \
        --tags $TAGS \
        --resource-group $RESOURCE_GROUP_NAME \
        --location $PRIMARY_CLUSTER_REGION \
        --generate-ssh-keys \
        --node-resource-group $AKS_PRIMARY_MANAGED_RG_NAME \
        --enable-managed-identity \
        --assign-identity $AKS_UAMI_WORKLOAD_RESOURCEID \
        --network-plugin azure \
        --network-plugin-mode overlay \
        --network-dataplane cilium \
        --nodepool-name systempool \
        --enable-oidc-issuer \
        --enable-workload-identity \
        --enable-cluster-autoscaler \
        --min-count 2 \
        --max-count 3 \
        --node-vm-size $SYSTEM_NODE_POOL_VMSKU \
        --enable-azure-monitor-metrics \
        --azure-monitor-workspace-resource-id $AMW_RESOURCE_ID \
        --grafana-resource-id $GRAFANA_RESOURCE_ID \
        --api-server-authorized-ip-ranges $MY_PUBLIC_CLIENT_IP \
        --tier standard \
        --kubernetes-version $AKS_CLUSTER_VERSION \
        --zones 1 2 3 \
        --output table
    ```

2. Add a user node pool to the AKS cluster using the [`az aks nodepool add`][az-aks-node-pool-add] command.

    ```bash
    az aks nodepool add \
        --resource-group $RESOURCE_GROUP_NAME \
        --cluster-name $AKS_PRIMARY_CLUSTER_NAME \
        --name $USER_NODE_POOL_NAME \
        --enable-cluster-autoscaler \
        --min-count 3 \
        --max-count 6 \
        --node-vm-size $USER_NODE_POOL_VMSKU \
        --zones 1 2 3 \
        --labels workload=postgres \
        --output table
    ```

> [!NOTE]
> If you receive the error message `"(OperationNotAllowed) Operation is not allowed: Another operation (Updating) is in progress, please wait for it to finish before starting a new operation."` when adding the AKS node pool, please wait a few minutes for the AKS cluster operations to complete and then run the `az aks nodepool add` command.

## Connect to the AKS cluster and create namespaces

In this section, you get the AKS cluster credentials, which serve as the keys that allow you to authenticate and interact with the cluster. Once connected, you create two namespaces: one for the CNPG controller manager services and one for the PostgreSQL cluster and its related services.

1. Get the AKS cluster credentials using the [`az aks get-credentials`][az-aks-get-credentials] command.

    ```bash
    az aks get-credentials \
        --resource-group $RESOURCE_GROUP_NAME \
        --name $AKS_PRIMARY_CLUSTER_NAME \
        --output none
     ```

2. Create the namespace for the CNPG controller manager services, the PostgreSQL cluster, and its related services by using the [`kubectl create namespace`][kubectl-create-namespace] command.

    ```bash
    kubectl create namespace $PG_NAMESPACE --context $AKS_PRIMARY_CLUSTER_NAME
    kubectl create namespace $PG_SYSTEM_NAMESPACE --context $AKS_PRIMARY_CLUSTER_NAME
    ```

## Update the monitoring infrastructure

The Azure Monitor workspace for Managed Prometheus and Azure Managed Grafana are automatically linked to the AKS cluster for metrics and visualization during the cluster creation process. In this section, you enable log collection with AKS Container insights and validate that Managed Prometheus is scraping metrics and Container insights is ingesting logs.

1. Enable Container insights monitoring on the AKS cluster using the [`az aks enable-addons`][az-aks-enable-addons] command.

    ```bash
    az aks enable-addons \
        --addon monitoring \
        --name $AKS_PRIMARY_CLUSTER_NAME \
        --resource-group $RESOURCE_GROUP_NAME \
        --workspace-resource-id $ALA_RESOURCE_ID \
        --output table
    ```

2. Validate that Managed Prometheus is scraping metrics and Container insights is ingesting logs from the AKS cluster by inspecting the DaemonSet using the [`kubectl get`][kubectl-get] command and the [`az aks show`][az-aks-show] command.

    ```bash
    kubectl get ds ama-metrics-node \
        --context $AKS_PRIMARY_CLUSTER_NAME \
        --namespace=kube-system

    kubectl get ds ama-logs \
        --context $AKS_PRIMARY_CLUSTER_NAME \
        --namespace=kube-system

    az aks show \
        --resource-group $RESOURCE_GROUP_NAME \
        --name $AKS_PRIMARY_CLUSTER_NAME \
        --query addonProfiles
    ```

    Your output should resemble the following example output, with *six* nodes total (three for the system node pool and three for the PostgreSQL node pool) and the Container insights showing `"enabled": true`:

    ```output
    NAME               DESIRED   CURRENT   READY   UP-TO-DATE   AVAILABLE   NODE SELECTOR
    ama-metrics-node   6         6         6       6            6           <none>       

    NAME               DESIRED   CURRENT   READY   UP-TO-DATE   AVAILABLE   NODE SELECTOR
    ama-logs           6         6         6       6            6           <none>       

    {
      "omsagent": {
        "config": {
          "logAnalyticsWorkspaceResourceID": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/rg-cnpg-9vbin3p8/providers/Microsoft.OperationalInsights/workspaces/ala-cnpg-9vbin3p8",
          "useAADAuth": "true"
        },
        "enabled": true,
        "identity": null
      }
    }
    ```

## Create a public static IP for PostgreSQL cluster ingress

To validate deployment of the PostgreSQL cluster and use client PostgreSQL tooling, such as *psql* and *PgAdmin*, you need to expose the primary and read-only replicas to ingress. In this section, you create an Azure public IP resource that you later supply to an Azure load balancer to expose PostgreSQL endpoints for query.

1. Get the name of the AKS cluster node resource group using the [`az aks show`][az-aks-show] command.

    ```bash
    export AKS_PRIMARY_CLUSTER_NODERG_NAME=$(az aks show \
        --name $AKS_PRIMARY_CLUSTER_NAME \
        --resource-group $RESOURCE_GROUP_NAME \
        --query nodeResourceGroup \
        --output tsv)

    echo $AKS_PRIMARY_CLUSTER_NODERG_NAME
    ```

2. Create the public IP address using the [`az network public-ip create`][az-network-public-ip-create] command.

    ```bash
    export AKS_PRIMARY_CLUSTER_PUBLICIP_NAME="$AKS_PRIMARY_CLUSTER_NAME-pip"

    az network public-ip create \
        --resource-group $AKS_PRIMARY_CLUSTER_NODERG_NAME \
        --name $AKS_PRIMARY_CLUSTER_PUBLICIP_NAME \
        --location $PRIMARY_CLUSTER_REGION \
        --sku Standard \
        --zone 1 2 3 \
        --allocation-method static \
        --output table
    ```

3. Get the newly created public IP address using the [`az network public-ip show`][az-network-public-ip-show] command.

    ```bash
    export AKS_PRIMARY_CLUSTER_PUBLICIP_ADDRESS=$(az network public-ip show \
        --resource-group $AKS_PRIMARY_CLUSTER_NODERG_NAME \
        --name $AKS_PRIMARY_CLUSTER_PUBLICIP_NAME \
        --query ipAddress \
        --output tsv)

    echo $AKS_PRIMARY_CLUSTER_PUBLICIP_ADDRESS
    ```

4. Get the resource ID of the node resource group using the [`az group show`][az-group-show] command.

    ```bash
    export AKS_PRIMARY_CLUSTER_NODERG_NAME_SCOPE=$(az group show --name \
        $AKS_PRIMARY_CLUSTER_NODERG_NAME \
        --query id \
        --output tsv)

    echo $AKS_PRIMARY_CLUSTER_NODERG_NAME_SCOPE
    ```

5. Assign the "Network Contributor" role to the UAMI object ID using the node resource group scope using the [`az role assignment create`][az-role-assignment-create] command.

    ```bash
    az role assignment create \
        --assignee-object-id ${AKS_UAMI_WORKLOAD_OBJECTID} \
        --assignee-principal-type ServicePrincipal \
        --role "Network Contributor" \
        --scope ${AKS_PRIMARY_CLUSTER_NODERG_NAME_SCOPE}
    ```

## Install the CNPG operator in the AKS cluster

In this section, you install the CNPG operator in the AKS cluster using Helm or a YAML manifest.

### [Helm](#tab/helm)

1. Add the CNPG Helm repo using the [`helm repo add`][helm-repo-add] command.

    ```bash
    helm repo add cnpg https://cloudnative-pg.github.io/charts
    ```

2. Upgrade the CNPG Helm repo and install it on the AKS cluster using the [`helm upgrade`][helm-upgrade] command with the `--install` flag.

    ```bash
    helm upgrade --install cnpg \
        --namespace $PG_SYSTEM_NAMESPACE \
        --create-namespace \
        --kube-context=$AKS_PRIMARY_CLUSTER_NAME \
        cnpg/cloudnative-pg
    ```

3. Verify the operator installation on the AKS cluster using the [`kubectl get`][kubectl-get] command.

    ```bash
    kubectl get deployment \
        --context $AKS_PRIMARY_CLUSTER_NAME \
        --namespace $PG_SYSTEM_NAMESPACE cnpg-cloudnative-pg
    ```

### [YAML](#tab/yaml)

1. Install the CNPG operator on the AKS cluster using the [`kubectl apply`][kubectl-apply] command.

    ```bash
    kubectl apply --context $AKS_PRIMARY_CLUSTER_NAME \
        --namespace $PG_SYSTEM_NAMESPACE \
        --server-side -f \
        https://raw.githubusercontent.com/cloudnative-pg/cloudnative-pg/release-1.23/releases/cnpg-1.23.1.yaml
    ```

2. Verify the operator installation on the AKS cluster using the [`kubectl get`][kubectl-get] command.

    ```bash
    kubectl get deployment \
        --namespace $PG_SYSTEM_NAMESPACE cnpg-controller-manager \
        --context $AKS_PRIMARY_CLUSTER_NAME
    ```

---

## Next steps

> [!div class="nextstepaction"]
> [Deploy a highly available PostgreSQL database on the AKS cluster][deploy-postgresql]

## Contributors

*This article is maintained by Microsoft. It was originally written by the following contributors*:

* Ken Kilty | Principal TPM
* Russell de Pina | Principal TPM
* Adrian Joian | Senior Customer Engineer
* Jenny Hayes | Senior Content Developer
* Carol Smith | Senior Content Developer
* Erin Schaffer | Content Developer 2

<!-- LINKS -->
[az-identity-create]: /cli/azure/identity#az-identity-create
[az-grafana-create]: /cli/azure/grafana#az-grafana-create
[postgresql-ha-deployment-overview]: ./postgresql-ha-overview.md
[az-extension-add]: /cli/azure/extension#az_extension_add
[az-group-create]: /cli/azure/group#az_group_create
[az-storage-account-create]: /cli/azure/storage/account#az_storage_account_create
[az-storage-container-create]: /cli/azure/storage/container#az_storage_container_create
[inherit-from-azuread]: https://cloudnative-pg.io/documentation/1.23/appendixes/object_stores/#azure-blob-storage
[az-storage-account-show]: /cli/azure/storage/account#az_storage_account_show
[az-role-assignment-create]: /cli/azure/role/assignment#az_role_assignment_create
[az-monitor-account-create]: /cli/azure/monitor/account#az_monitor_account_create
[az-monitor-log-analytics-workspace-create]: /cli/azure/monitor/log-analytics/workspace#az_monitor_log_analytics_workspace_create
[azure-managed-grafana-pricing]: https://azure.microsoft.com/pricing/details/managed-grafana/
[az-aks-create]: /cli/azure/aks#az_aks_create
[az-aks-node-pool-add]: /cli/azure/aks/nodepool#az_aks_nodepool_add
[az-aks-get-credentials]: /cli/azure/aks#az_aks_get_credentials
[kubectl-create-namespace]: https://kubernetes.io/docs/reference/kubectl/generated/kubectl_create/kubectl_create_namespace/
[az-aks-enable-addons]: /cli/azure/aks#az_aks_enable_addons
[kubectl-get]: https://kubernetes.io/docs/reference/kubectl/generated/kubectl_get/
[az-aks-show]: /cli/azure/aks#az_aks_show
[az-network-public-ip-create]: /cli/azure/network/public-ip#az_network_public_ip_create
[az-network-public-ip-show]: /cli/azure/network/public-ip#az_network_public_ip_show
[az-group-show]: /cli/azure/group#az_group_show
[helm-repo-add]: https://helm.sh/docs/helm/helm_repo_add/
[helm-upgrade]: https://helm.sh/docs/helm/helm_upgrade/
[kubectl-apply]: https://kubernetes.io/docs/reference/kubectl/generated/kubectl_apply/
[deploy-postgresql]: ./deploy-postgresql-ha.md
[install-krew]: https://krew.sigs.k8s.io/
[cnpg-plugin]: https://cloudnative-pg.io/documentation/current/kubectl-plugin/#using-krew
