---
title: Prepare your Kubernetes cluster
description: Prepare an Azure Arc-enabled Kubernetes cluster before you deploy Azure IoT Operations. This article includes guidance for both Ubuntu and Windows machines.
author: kgremban
ms.author: kgremban
ms.topic: how-to
ms.custom: ignite-2023, devx-track-azurecli
ms.date: 10/02/2024

#CustomerIntent: As an IT professional, I want prepare an Azure-Arc enabled Kubernetes cluster so that I can deploy Azure IoT Operations to it.
---

# Prepare your Azure Arc-enabled Kubernetes cluster

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

An Azure Arc-enabled Kubernetes cluster is a prerequisite for deploying Azure IoT Operations Preview. This article describes how to prepare a cluster before you [Deploy Azure IoT Operations Preview to an Arc-enabled Kubernetes cluster](howto-deploy-iot-operations.md). This article includes guidance for both Ubuntu and Windows.

> [!TIP]
> The steps in this article prepare your cluster for a secure settings deployment, which is a longer but production-ready process. If you want to deploy Azure IoT Operations quickly and run a sample workload with only test settings, see the [Quickstart: Run Azure IoT Operations Preview in GitHub Codespaces with K3s](../get-started-end-to-end-sample/quickstart-deploy.md) instead.
>
> For more information about test settings and secure settings, see [Deployment details > Choose your features](./overview-deploy.md#choose-your-features).

## Prerequisites

Azure IoT Operations should work on any Arc-enabled Kubernetes cluster that meets the [Azure Arc-enabled Kubernetes system requirements](/azure/azure-arc/kubernetes/system-requirements). Currently Azure IoT Operations doesn't support Arm64 architectures.

Microsoft supports Azure Kubernetes Service (AKS) Edge Essentials for deployments on Windows and K3s for deployments on Ubuntu. For a list of specific hardware and software combinations that are tested and validated, see [Validated environments](../overview-iot-operations.md#validated-environments).

If you want to deploy Azure IoT Operations to a multi-node solution, use K3s on Ubuntu.

To prepare your Azure Arc-enabled Kubernetes cluster, you need:

### [AKS Edge Essentials](#tab/aks-edge-essentials)

* An Azure subscription. If you don't have an Azure subscription, [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

* Azure CLI version 2.64.0 or newer installed on your development machine. Use `az --version` to check your version and `az upgrade` to update if necessary. For more information, see [How to install the Azure CLI](/cli/azure/install-azure-cli).

* The latest version of the following extensions for Azure CLI:

  ```bash
  az extension add --upgrade --name azure-iot-ops
  az extension add --upgrade --name connectedk8s
  ```

* Hardware that meets the system requirements:

  * Ensure that your machine has a minimum of 16-GB available RAM, 8 available vCPUs, and 52-GB free disk space reserved for Azure IoT Operations.
  * [Azure Arc-enabled Kubernetes system requirements](/azure/azure-arc/kubernetes/system-requirements).
  * [AKS Edge Essentials requirements and support matrix](/azure/aks/hybrid/aks-edge-system-requirements).
  * [AKS Edge Essentials networking guidance](/azure/aks/hybrid/aks-edge-concept-networking).

### [Ubuntu](#tab/ubuntu)

* An Azure subscription. If you don't have an Azure subscription, [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

* Azure CLI version 2.64.0 or newer installed on your development machine. Use `az --version` to check your version and `az upgrade` to update if necessary. For more information, see [How to install the Azure CLI](/cli/azure/install-azure-cli).

* The latest version of the following extensions for Azure CLI:

  ```bash
  az extension add --upgrade --name azure-iot-ops
  az extension add --upgrade --name connectedk8s
  ```

* Hardware that meets the system requirements:

  * Ensure that your machine has a minimum of 16-GB available RAM and 8 available vCPUs reserved for Azure IoT Operations.
  * [Azure Arc-enabled Kubernetes system requirements](/azure/azure-arc/kubernetes/system-requirements).
  * [K3s requirements](https://docs.k3s.io/installation/requirements).

* If you're going to deploy Azure IoT Operations to a multi-node cluster with fault tolerance enabled, review the hardware and storage requirements in [Prepare Linux for Edge Volumes](/azure/azure-arc/container-storage/prepare-linux-edge-volumes).

---

## Create a cluster

This section provides steps to create clusters in validated environments on Linux and Windows.

### [AKS Edge Essentials](#tab/aks-edge-essentials)

[Azure Kubernetes Service Edge Essentials](/azure/aks/hybrid/aks-edge-overview) is an on-premises Kubernetes implementation of Azure Kubernetes Service (AKS) that automates running containerized applications at scale. AKS Edge Essentials includes a Microsoft-supported Kubernetes platform that includes a lightweight Kubernetes distribution with a small footprint and simple installation experience that supports PC-class or "light" edge hardware.

The [AksEdgeQuickStartForAio.ps1](https://github.com/Azure/AKS-Edge/blob/main/tools/scripts/AksEdgeQuickStart/AksEdgeQuickStartForAio.ps1) script automates the process of creating and connecting a cluster, and is the recommended path for deploying Azure IoT Operations on AKS Edge Essentials.

1. Open an elevated PowerShell window and change the directory to a working folder.

1. Get the `objectId` of the Microsoft Entra ID application that the Azure Arc service uses in your tenant. Run the following command exactly as written, without changing the GUID value.

   ```azurecli
   az ad sp show --id bc313c14-388c-4e7d-a58e-70017303ee3b --query id -o tsv
   ```

1. Run the following commands, replacing the placeholder values with your information:

   | Placeholder | Value |
   | ----------- | ----- |
   | SUBSCRIPTION_ID | The ID of your Azure subscription. If you don't know your subscription ID, see [Find your Azure subscription](/azure/azure-portal/get-subscription-tenant-id#find-your-azure-subscription). |
   | TENANT_ID | The ID of your Microsoft Entra tenant. If you don't know your tenant ID, see [Find your Microsoft Entra tenant](/azure/azure-portal/get-subscription-tenant-id#find-your-microsoft-entra-tenant). |
   | RESOURCE_GROUP_NAME | The name of an existing resource group or a name for a new resource group to be created. |
   | LOCATION | An Azure region close to you. For the list of currently supported Azure regions, see [Supported regions](../overview-iot-operations.md#supported-regions). |
   | CLUSTER_NAME | A name for the new cluster to be created. |
   | ARC_APP_OBJECT_ID | The object ID value that you retrieved in the previous step. |

   ```powershell
   $url = "https://raw.githubusercontent.com/Azure/AKS-Edge/main/tools/scripts/AksEdgeQuickStart/AksEdgeQuickStartForAio.ps1"
   Invoke-WebRequest -Uri $url -OutFile .\AksEdgeQuickStartForAio.ps1
   Unblock-File .\AksEdgeQuickStartForAio.ps1
   Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process -Force
   .\AksEdgeQuickStartForAio.ps1 -SubscriptionId "<SUBSCRIPTION_ID>" -TenantId "<TENANT_ID>" -ResourceGroupName "<RESOURCE_GROUP_NAME>"  -Location "<LOCATION>"  -ClusterName "<CLUSTER_NAME>" -CustomLocationOid "<ARC_APP_OBJECT_ID>"
   ```

   If there are any issues during deployment, including if your machine reboots as part of this process, run the whole set of commands again.

1. Run the following commands to check that the deployment was successful:

   ```powershell
   Import-Module AksEdge
   Get-AksEdgeDeploymentInfo
   ```

   In the output of the `Get-AksEdgeDeploymentInfo` command, you should see that the cluster's Arc status is `Connected`.

### [Ubuntu](#tab/ubuntu)

To prepare a K3s Kubernetes cluster on Ubuntu:

1. Install K3s following the instructions in the [K3s quick-start guide](https://docs.k3s.io/quick-start).

1. Check to see that kubectl was installed as part of K3s. If not, follow the instructions to [Install kubectl on Linux](https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/).

   ```bash
   kubectl version --client
   ```

1. Follow the instructions to [Install Helm](https://helm.sh/docs/intro/install/).

1. Create a K3s configuration yaml file in `.kube/config`:

    ```bash
    mkdir ~/.kube
    sudo KUBECONFIG=~/.kube/config:/etc/rancher/k3s/k3s.yaml kubectl config view --flatten > ~/.kube/merged
    mv ~/.kube/merged ~/.kube/config
    chmod  0600 ~/.kube/config
    export KUBECONFIG=~/.kube/config
    #switch to k3s context
    kubectl config use-context default
    sudo chmod 644 /etc/rancher/k3s/k3s.yaml
    ```

1. Run the following command to increase the [user watch/instance limits](https://www.suse.com/support/kb/doc/?id=000020048).

   ```bash
   echo fs.inotify.max_user_instances=8192 | sudo tee -a /etc/sysctl.conf
   echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf

   sudo sysctl -p
   ```

1. For better performance, increase the file descriptor limit:

   ```bash
   echo fs.file-max = 100000 | sudo tee -a /etc/sysctl.conf

   sudo sysctl -p
   ```

### Configure multi-node clusters for Azure Container Storage

On multi-node clusters with at least three nodes, you have the option of enabling fault tolerance for storage with [Azure Container Storage enabled by Azure Arc](/azure/azure-arc/container-storage/overview) when you deploy Azure IoT Operations. If you want to enable that option, prepare your multi-node cluster with the following steps:

1. Install the required NVME over TCP module for your kernel using the following command:

   ```bash
   sudo apt install linux-modules-extra-`uname -r`
   ```

   > [!NOTE]
   > The minimum supported Linux kernel version is 5.1. At this time, there are known issues with 6.4 and 6.2. For the latest information, refer to [Azure Container Storage release notes](/azure/azure-arc/edge-storage-accelerator/release-notes)

1. On each node in your cluster, set the number of **HugePages** to 512 using the following command:

   ```bash
   HUGEPAGES_NR=512
   echo $HUGEPAGES_NR | sudo tee /sys/devices/system/node/node0/hugepages/hugepages-2048kB/nr_hugepages
   echo "vm.nr_hugepages=$HUGEPAGES_NR" | sudo tee /etc/sysctl.d/99-hugepages.conf
   ```

---

## Arc-enable your cluster

Connect your cluster to Azure Arc so that it can be managed remotely.

### [AKS Edge Essentials](#tab/aks-edge-essentials)

The **AksEdgeQuickStartForAio.ps1** script that you ran in the previous section handled the steps to connect your cluster. You don't need to take any extra steps to Arc-enable.

### [Ubuntu](#tab/ubuntu)

To connect your cluster to Azure Arc:

1. On the machine where you deployed the Kubernetes cluster, sign in with Azure CLI:

   ```azurecli
   az login
   ```

   If at any point you get an error that says *Your device is required to be managed to access your resource*, run `az login` again and make sure that you sign in interactively with a browser.

1. Set environment variables for your Azure subscription, location, a new resource group, and the cluster name as you want it to show up in your resource group.

   For the list of currently supported Azure regions, see [Supported regions](../overview-iot-operations.md#supported-regions).

   ```bash
   # Id of the subscription where your resource group and Arc-enabled cluster will be created
   export SUBSCRIPTION_ID=<SUBSCRIPTION_ID>

   # Azure region where the created resource group will be located
   export LOCATION=<REGION>

   # Name of a new resource group to create which will hold the Arc-enabled cluster and Azure IoT Operations resources
   export RESOURCE_GROUP=<NEW_RESOURCE_GROUP_NAME>

   # Name of the Arc-enabled cluster to create in your resource group
   export CLUSTER_NAME=<NEW_CLUSTER_NAME>
   ```

1. After signing in, Azure CLI displays all of your subscriptions and indicates your default subscription with an asterisk `*`. To continue with your default subscription, select `Enter`. Otherwise, type the number of the Azure subscription that you want to use.

1. Register the required resource providers in your subscription:

   >[!NOTE]
   >This step only needs to be run once per subscription. To register resource providers, you need permission to do the `/register/action` operation, which is included in subscription Contributor and Owner roles. For more information, see [Azure resource providers and types](../../azure-resource-manager/management/resource-providers-and-types.md).

   ```azurecli
   az provider register -n "Microsoft.ExtendedLocation"
   az provider register -n "Microsoft.Kubernetes"
   az provider register -n "Microsoft.KubernetesConfiguration"
   az provider register -n "Microsoft.IoTOperations"
   az provider register -n "Microsoft.DeviceRegistry"
   az provider register -n "Microsoft.SecretSyncController"
   ```

1. Use the [az group create](/cli/azure/group#az-group-create) command to create a resource group in your Azure subscription to store all the resources:

   ```azurecli
   az group create --location $LOCATION --resource-group $RESOURCE_GROUP --subscription $SUBSCRIPTION_ID
   ```

1. Use the [az connectedk8s connect](/cli/azure/connectedk8s#az-connectedk8s-connect) command to Arc-enable your Kubernetes cluster and manage it as part of your Azure resource group:

   ```azurecli
   az connectedk8s connect --name $CLUSTER_NAME -l $LOCATION --resource-group $RESOURCE_GROUP --subscription $SUBSCRIPTION_ID --enable-oidc-issuer --enable-workload-identity
   ```

1. Get the cluster's issuer URL.

   ```azurecli
   az connectedk8s show --resource-group $RESOURCE_GROUP --name $CLUSTER_NAME --query oidcIssuerProfile.issuerUrl --output tsv
   ```

   Save the output of this command to use in the next steps.

1. Create a k3s config file.

   ```bash
   sudo nano /etc/rancher/k3s/config.yaml
   ```

1. Add the following content to the `config.yaml` file, replacing the `<SERVICE_ACCOUNT_ISSUER>` placeholder with your cluster's issuer URL.

   ```yml
   kube-apiserver-arg:
    - service-account-issuer=<SERVICE_ACCOUNT_ISSUER>
    - service-account-max-token-expiration=24h
   ```

1. Save the file and exit the nano editor.

1. Get the `objectId` of the Microsoft Entra ID application that the Azure Arc service uses in your tenant and save it as an environment variable. Run the following command exactly as written, without changing the GUID value.

   ```azurecli
   export OBJECT_ID=$(az ad sp show --id bc313c14-388c-4e7d-a58e-70017303ee3b --query id -o tsv)
   ```

1. Use the [az connectedk8s enable-features](/cli/azure/connectedk8s#az-connectedk8s-enable-features) command to enable custom location support on your cluster. This command uses the `objectId` of the Microsoft Entra ID application that the Azure Arc service uses. Run this command on the machine where you deployed the Kubernetes cluster:

    ```azurecli
    az connectedk8s enable-features -n $CLUSTER_NAME -g $RESOURCE_GROUP --custom-locations-oid $OBJECT_ID --features cluster-connect custom-locations
    ```

1. Restart K3s.

   ```bash
   systemctl restart k3s
   ```

---

## Verify your cluster

To verify that your cluster is ready for Azure IoT Operations deployment, you can use the [verify-host](/cli/azure/iot/ops#az-iot-ops-verify-host) helper command in the Azure IoT Operations extension for Azure CLI. When run on the cluster host, this helper command checks connectivity to Azure Resource Manager and Microsoft Container Registry endpoints.

```azurecli
az iot ops verify-host
```

To verify that your Kubernetes cluster is Azure Arc-enabled, run the following command:

```console
kubectl get deployments,pods -n azure-arc
```

The output looks like the following example:

```output
NAME                                         READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/clusterconnect-agent         1/1     1            1           10m
deployment.apps/extension-manager            1/1     1            1           10m
deployment.apps/clusteridentityoperator      1/1     1            1           10m
deployment.apps/controller-manager           1/1     1            1           10m
deployment.apps/flux-logs-agent              1/1     1            1           10m
deployment.apps/cluster-metadata-operator    1/1     1            1           10m
deployment.apps/extension-events-collector   1/1     1            1           10m
deployment.apps/config-agent                 1/1     1            1           10m
deployment.apps/kube-aad-proxy               1/1     1            1           10m
deployment.apps/resource-sync-agent          1/1     1            1           10m
deployment.apps/metrics-agent                1/1     1            1           10m

NAME                                              READY   STATUS    RESTARTS        AGE
pod/clusterconnect-agent-5948cdfb4c-vzfst         3/3     Running   0               10m
pod/extension-manager-65b8f7f4cb-tp7pp            3/3     Running   0               10m
pod/clusteridentityoperator-6d64fdb886-p5m25      2/2     Running   0               10m
pod/controller-manager-567c9647db-qkprs           2/2     Running   0               10m
pod/flux-logs-agent-7bf6f4bf8c-mr5df              1/1     Running   0               10m
pod/cluster-metadata-operator-7cc4c554d4-nck9z    2/2     Running   0               10m
pod/extension-events-collector-58dfb78cb5-vxbzq   2/2     Running   0               10m
pod/config-agent-7579f558d9-5jnwq                 2/2     Running   0               10m
pod/kube-aad-proxy-56d9f754d8-9gthm               2/2     Running   0               10m
pod/resource-sync-agent-769bb66b79-z9n46          2/2     Running   0               10m
pod/metrics-agent-6588f97dc-455j8                 2/2     Running   0               10m
```

## Next steps

Now that you have an Azure Arc-enabled Kubernetes cluster, you can [deploy Azure IoT Operations](howto-deploy-iot-operations.md).
