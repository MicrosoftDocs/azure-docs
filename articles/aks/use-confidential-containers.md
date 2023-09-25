---
title: Confidential Containers (preview) with Azure Kubernetes Service (AKS)
description: Learn about and deploy confidential Containers (preview) on an Azure Kubernetes Service (AKS) cluster to maintain security and protect sensitive information.
ms.topic: article
ms.date: 09/25/2023
---

# Confidential Containers (preview) with Azure Kubernetes Service (AKS)

To help secure and protect your container workloads from untrusted or potentially malicious code, as part of our Zero trust cloud architecture, AKS includes Confidential Containers (preview) on Azure Kubernetes Service. Confidential Containers is based on Kata Confidential Containers to encrypt container memory, and prevent data in memory during computation from being in clear text, readable format. Together with [Pod Sandboxing][pod-sandboxing-overview], you can run sensitive workloads at this isolation level in Azure to achieve the following security goals:

* Helps application owners protect data by enforcing application security requirements (for example, deny access to Azure tenant admin, Kubernetes admin, etc).
* Help protects your data from Cloud Service Providers (CSPs)

Together with other security measures or data protection controls, as part of your overall architecture, helps you meet regulatory, industry, or governance compliance requirements for securing sensitive information.

This article helps you understand this new feature, and how to implement and configure the following:

* Deploy or upgrade an AKS cluster using the Azure CLI
* Create an Azure Active Directory (Azure AD) workload identity and Kubernetes service account.
* Configure the managed identity for token federation.
* Grant access to the Azure Key Vault Managed HSM and secret
* Configure an application to be deployed as a Confidential container.

## Supported scenarios

Confidential Containers (preview) are appropriate for deployment scenarios that involve sensitive data, for instance, personally identifiable information (PII) or any data with strong security needed for regulatory compliance. Some examples of common scenarios with containers are:

- Privacy preserving big data analytics using Apache Spark analytics job for fraud pattern recognition in the financial sector.
- Running self-hosted GitHub runners to secure code signing as part of Continuous Integration and Continuous Deployment (CI/CD) DevOps practices.
- Machine Learning inferencing and training of ML models, using an encrypted data set from a trusted source and only decrypting inside a confidential container environment, for purposes of privacy preserving ML inference.
- Building big data clean rooms for ID matching as part of multi-party computation in industries like retail with digital advertising.
- Building confidential computing zero trust landing zones to meet privacy regulations for application migrations to cloud.

## Prerequisites

- The Azure CLI version 2.44.1 or later. Run `az --version` to find the version, and run `az upgrade` to upgrade the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].

- The `aks-preview` Azure CLI extension version 0.5.123 or later.

- Register the `Preview` feature in your Azure subscription.

- AKS supports Confidential Containers (preview) on version 1.24.0 and higher.

- To manage a Kubernetes cluster, use the Kubernetes command-line client [kubectl][kubectl]. Azure Cloud Shell comes with `kubectl`. You can install kubectl locally using the [az aks install-cli][az-aks-install-cmd] command.

- An [Azure Key Vault Managed HSM][azure-key-vault-managed-hardware-security-module] (Hardware Security Module). See [Provision and activate a Managed HSM][create-managed-hsm].

### Install the aks-preview Azure CLI extension

[!INCLUDE [preview features callout](includes/preview/preview-callout.md)]

To install the aks-preview extension, run the following command:

```azurecli-interactive
az extension add --name aks-preview
```

Run the following command to update to the latest version of the extension released:

```azurecli-interactive
az extension update --name aks-preview
```

### Register the KataCcIsolationPreview feature flag

Register the `KataCcIsolationPreview` feature flag by using the [az feature register][az-feature-register] command, as shown in the following example:

```azurecli-interactive
az feature register --namespace "Microsoft.ContainerService" --name "KataCcIsolationPreview"
```

It takes a few minutes for the status to show *Registered*. Verify the registration status by using the [az feature show][az-feature-show] command:

```azurecli-interactive
az feature show --namespace "Microsoft.ContainerService" --name KataCcIsolationPreview"
```

When the status reflects *Registered*, refresh the registration of the *Microsoft.ContainerService* resource provider by using the [az provider register][az-provider-register] command:

```azurecli-interactive
az provider register --namespace "Microsoft.ContainerService"
```

## Limitations

The following are constraints with this preview of Confidential Containers (preview):

* List of limitation(s)

## Export environmental variables

To help simplify steps to configure the identities required, the steps below define environmental variables for reference on the cluster.

Create these variables using the following commands. Replace the default values for `RESOURCE_GROUP`, `LOCATION`, `SERVICE_ACCOUNT_NAME`, `SUBSCRIPTION`, `USER_ASSIGNED_IDENTITY_NAME`, `FEDERATED_IDENTITY_CREDENTIAL_NAME`, `KEYVAULT_NAME`, and `KEYVAULT_SECRET_NAME`.

```bash
export RESOURCE_GROUP="myResourceGroup"
export LOCATION="westcentralus"
export SERVICE_ACCOUNT_NAMESPACE="default"
export SERVICE_ACCOUNT_NAME="workload-identity-sa"
export SUBSCRIPTION="$(az account show --query id --output tsv)"
export USER_ASSIGNED_IDENTITY_NAME="myIdentity"
export FEDERATED_IDENTITY_CREDENTIAL_NAME="myFedIdentity"
export KEYVAULT_NAME="azwi-kv-tutorial"
export KEYVAULT_SECRET_NAME="my-secret"
```

## Deploy a new cluster

Create an AKS cluster using the [az aks create][az-aks-create] command and specifying the following parameters:

   * **--workload-runtime**: Specify *KataCcIsolation* to enable the Confidential Containers feature on the node pool. With this parameter, these other parameters shall satisfy the following requirements. Otherwise, the command fails and reports an issue with the corresponding parameter(s).
    * **--os-sku**: *AzureLinux*. Only the Azure Linux os-sku supports this feature in this preview release.
    * **--node-vm-size**: Any Azure VM size that is a generation 2 VM and supports nested virtualization works. For example, [Dsv3][dv3-series] VMs.

   The following example creates a cluster named *myAKSCluster* with one node in the *myResourceGroup*:

    ```azurecli-interactive
    az aks create --resource-group myResourceGroup --name myManagedCluster –kubernetes-version <1.24.0 and above> --os-sku AzureLinux –-node-vm-size <VM sizes capable of nested SNP VM> --workload-runtime <kataCcIsolation> --enable-oidc-issuer --enable-workload-identity --generate-ssh-keys
    ```

After a few minutes, the command completes and returns JSON-formatted information about the cluster.

## Deploy to an existing cluster

To use this feature with an existing AKS cluster, the following requirements must be met:

* Follow the steps to [register the KataCcIsolationPreview](#register-the-kataccisolationpreview-feature-flag) feature flag.
* Verify the cluster is running Kubernetes version 1.24.0 and higher.
* [Enable workload identity][upgrade-cluster-enable-workload-identity] on the cluster if it isn't already.

Use the following command to enable Confidential Containers (preview) by creating a node pool to host it.

1. Add a node pool to your AKS cluster using the [az aks nodepool add][az-aks-nodepool-add] command. Specify the following parameters:

   * **--resource-group**: Enter the name of an existing resource group to create the AKS cluster in.
   * **--cluster-name**: Enter a unique name for the AKS cluster, such as *myAKSCluster*.
   * **--name**: Enter a unique name for your clusters node pool, such as *nodepool2*.
   * **--workload-runtime**: Specify *kataCcIsolation* to enable the feature on the node pool. Along with the `--workload-runtime` parameter, these other parameters shall satisfy the following requirements. Otherwise, the command fails and reports an issue with the corresponding parameter(s).
     * **--os-sku**: **AzureLinux*. Only the Azure Linux os-sku supports this feature in this preview release.

   The following example adds a node pool to *myAKSCluster* with one node in *nodepool2* in the *myResourceGroup*:

    ```azurecli-interactive
    az aks nodepool add --resource-group myResourceGroup --name myManagedCluster –-cluster-name myCluster --os-sku Azurelinux SKU
    ```

    After a few minutes, the command completes and returns JSON-formatted information about the cluster.

2. Run the [az aks update][az-aks-update] command to enable Confidential Containers (preview) on the cluster.

    ```azurecli-interactive
    az aks update --name myAKSCluster --resource-group myResourceGroup
    ```

    After a few minutes, the command completes and returns JSON-formatted information about the cluster.

## Configure container

Perform the following steps to complete the configuration of the workload identity, key vault, and deploy an application as a Confidential container (preview).

1. Get the OIDC Issuer URL and save it to an environmental variable using the following command. Replace the default value for the arguments `-n`, which is the name of the cluster.

    ```azurecli-interactive
    export AKS_OIDC_ISSUER="$(az aks show -n myAKSCluster -g "${RESOURCE_GROUP}" --query "oidcIssuerProfile.issuerUrl" -otsv)"
    ```

1. Set a specific subscription as the current active subscription using the [`az account set`][az-account-set] command.

    ```azurecli-interactive
    az account set --subscription "${SUBSCRIPTION}"
    ```

1. Create a managed identity using the [`az identity create`][az-identity-create] command.

    ```azurecli-interactive
    az identity create --name "${USER_ASSIGNED_IDENTITY_NAME}" --resource-group "${RESOURCE_GROUP}" --location "${LOCATION}" --subscription "${SUBSCRIPTION}"
    ```

1. Set an access policy for the managed identity to access the Key Vault secret using the following commands.

    ```azurecli-interactive
    export USER_ASSIGNED_CLIENT_ID="$(az identity show --resource-group "${RESOURCE_GROUP}" --name "${USER_ASSIGNED_IDENTITY_NAME}" --query 'clientId' -otsv)"
    ```

    ```azurecli-interactive
    az keyvault set-policy --name "${KEYVAULT_NAME}" --secret-permissions get --spn "${USER_ASSIGNED_CLIENT_ID}"
    ```

1. Create a Kubernetes service account and annotate it with the client ID of the managed identity created in the previous step using the [`az aks get-credentials`][az-aks-get-credentials] command. Replace the default value for the cluster name and the resource group name.

    ```azurecli-interactive
    az aks get-credentials -n myAKSCluster -g "${RESOURCE_GROUP}"
    ```

1. Copy the following multi-line input into your terminal and run the command to create the service account.

    ```bash
    cat <<EOF | kubectl apply -f -
    apiVersion: v1
    kind: ServiceAccount
    metadata:
      annotations:
        azure.workload.identity/client-id: ${USER_ASSIGNED_CLIENT_ID}
      labels:
        azure.workload.identity/use: "true"
      name: ${SERVICE_ACCOUNT_NAME}
      namespace: ${SERVICE_ACCOUNT_NAMESPACE}
    EOF
    ```

    The following output resembles successful creation of the identity:

    ```output
    Serviceaccount/workload-identity-sa created
    ```

1. Create the federated identity credential between the managed identity, service account issuer, and subject using the [`az identity federated-credential create`][az-identity-federated-credential-create] command.

    ```azurecli-interactive
    az identity federated-credential create --name ${FEDERATED_IDENTITY_CREDENTIAL_NAME} --identity-name ${USER_ASSIGNED_IDENTITY_NAME} --resource-group ${RESOURCE_GROUP} --issuer ${AKS_OIDC_ISSUER} --subject system:serviceaccount:${SERVICE_ACCOUNT_NAMESPACE}:${SERVICE_ACCOUNT_NAME}
    ```

    > [!NOTE]
    > It takes a few seconds for the federated identity credential to propagate after it's initially added. If a token request is immediately available after adding the federated identity credential, you may experience failure for a couple minutes, as the cache is populated in the directory with old data. To avoid this issue, you can add a slight delay after adding the federated identity credential.

1. Configure the application to be deployed as a Confidential container (preview) by copying the following YAML file and save it as `myapplication.yml`.

    ```yml
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: nginx-deployment
      labels:
        azure.workload.identity/use: "true"
    spec:
      runtimeClassName: kata-cc
      serviceAccountName: workload-identity-sa
      selector:
        matchLabels:
          app: nginx
      replicas: 1
      template:
        metadata:
          labels:
            app: nginx
        spec:
          labels:
            azure.workload.identity/use: "true"
          serviceAccountName: workload-identity-sa
          containers:
          - name: nginx
            image: nginx:1.14.2
            resources:
              requests:
                memory: "512Mi"
              limits:
                memory: "512Mi"
                cpu: "60m"
            ports:
            - containerPort: 80
          - name: SecretKeyRelease
            image: <tbd>/aasp:1
            command:
              - "/skr.sh"
            env: 
              - name: SkrSideCarArgs
                value: ewogICAiY2VydGNhY2hlIjogewogICAgICAiZW5kcG9pbnQiOiAiYW1lcmljYXMuYWNjY2FjaGUuYXp1cmUubmV0IiwKICAgICAgInRlZV90eXBlIjogIlNldlNucFZNIiwKICAgICAgImFwaV92ZXJzaW9uIjogImFwaS12ZXJzaW9uPTIwMjAtMTAtMTUtcHJldmlldyIKICAgfSAgICAgIAp9
            resources:
              requests:
                memory: "512Mi"
              limits:
                memory: "512Mi"
                cpu: "60m"
    ```

1. Generate the deployment policy by running the following command. Replace `<path to pod yaml>` with the name of the manifest saved in the previous step.

    ```bash
    az confcom katapolicygen -y <path to pod yaml>
    ```

1. Upload keys to your Managed HSM instance with key release policy

1. Deploy the application by running the following command:

    ```bash
    Kubectl apply -f myapplication
    ```

1. To verify the application is running in isolation from parent and any other pods deployed on the cluster, run the following command.

## Cleanup

When you're finished evaluating this feature, to avoid Azure charges, clean up your unnecessary resources. If you deployed a new cluster as part of your evaluation or testing, you can delete the cluster using the [az aks delete][az-aks-delete] command.

```azurecli-interactive
az aks delete --resource-group myResourceGroup --name myAKSCluster 
```

If you enabled Confidential Containers (preview) on an existing cluster, you can remove the pod(s) using the [kubectl delete pod][kubectl-delete-pod] command.

```bash
kubectl delete pod pod-name
```

## Next steps

* Learn more about [Azure Dedicated hosts][azure-dedicated-hosts] for nodes with your AKS cluster to use hardware isolation and control over Azure platform maintenance events.

<!-- EXTERNAL LINKS -->
[kata-containers-overview]: https://katacontainers.io/
[kubectl]: https://kubernetes.io/docs/reference/kubectl/
[azurerm-azurelinux]: https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/kubernetes_cluster_node_pool#os_sku
[kubectl-get-pods]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get
[kubectl-exec]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#exec
[container-resource-manifest]: https://kubernetes.io/docs/tasks/configure-pod-container/assign-cpu-resource/
[kubectl-delete-pod]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#delete
[kubectl-apply]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply
[kata-network-limitations]: https://github.com/kata-containers/kata-containers/blob/main/docs/Limitations.md#host-network
[cloud-hypervisor]: https://www.cloudhypervisor.org
[kata-container]: https://katacontainers.io 

<!-- INTERNAL LINKS -->
[pod-sandboxing-overview]: use-pod-sandboxing.md
[azure-key-vault-managed-hardware-security-module]: ../key-vault/managed-hsm/overview.md
[create-managed-hsm]: ../azure/key-vault/managed-hsm/quick-create-cli.md
[upgrade-cluster-enable-workload-identity]: workload-identity-deploy-cluster.md#update-an-existing-aks-cluster