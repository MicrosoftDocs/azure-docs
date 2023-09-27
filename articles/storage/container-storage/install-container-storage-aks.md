---
title: Install Azure Container Storage Preview for use with Azure Kubernetes Service (AKS)
description: Learn how to install Azure Container Storage Preview for use with Azure Kubernetes Service. Create an AKS cluster, label the node pool, and install the Azure Container Storage extension.
author: khdownie
ms.service: azure-container-storage
ms.topic: how-to
ms.date: 09/26/2023
ms.author: kendownie
ms.custom: devx-track-azurecli
---

# Install Azure Container Storage Preview for use with Azure Kubernetes Service
[Azure Container Storage](container-storage-introduction.md) is a cloud-based volume management, deployment, and orchestration service built natively for containers. This article shows you how to create an [Azure Kubernetes Service (AKS)](../../aks/intro-kubernetes.md) cluster and install Azure Container Storage Preview on the cluster.

## Prerequisites

[!INCLUDE [container-storage-prerequisites](../../../includes/container-storage-prerequisites.md)]

> [!NOTE]
> If you already have an AKS cluster deployed, you can proceed to [Connect to the cluster](#connect-to-the-cluster). Alternatively, you can install Azure Container Storage Preview [using an automated installation script](container-storage-aks-quickstart.md) instead of following the manual steps outlined in this article.

## Getting started

- Take note of your Azure subscription ID. We recommend using a subscription on which you have an [Owner](../../role-based-access-control/built-in-roles.md#owner) role. If you don't have access to one, you can still proceed, but you'll need admin assistance to complete the steps in this article.

- [Launch Azure Cloud Shell](https://shell.azure.com), or if you're using a local installation, sign in to the Azure CLI by using the [az login](/cli/azure/reference-index#az-login) command.

- If you're using Azure Cloud Shell, you might be prompted to mount storage. Select the Azure subscription where you want to create the storage account and select **Create**.

## Set subscription context

Set your Azure subscription context using the `az account set` command. You can view the subscription IDs for all the subscriptions you have access to by running the `az account list --output table` command. Remember to replace `<subscription-id>` with your subscription ID.

```azurecli-interactive
az account set --subscription <subscription-id>
```

## Register resource providers

The `Microsoft.ContainerService` and `Microsoft.KubernetesConfiguration` resource providers must be registered on your Azure subscription. To register these providers, run the following command:

```azurecli-interactive
az provider register --namespace Microsoft.ContainerService --wait 
az provider register --namespace Microsoft.KubernetesConfiguration --wait 
```

## Create a resource group

An Azure resource group is a logical group that holds your Azure resources that you want to manage as a group. When you create a resource group, you're prompted to specify a location. This location is:

* The storage location of your resource group metadata.
* Where your resources will run in Azure if you don't specify another region during resource creation.

Create a resource group using the `az group create` command. Replace `<resource-group-name>` with the name of the resource group you want to create, and replace `<location>` with an Azure region such as *eastus*, *westus2*, *westus3*, or *westeurope*.

```azurecli-interactive
az group create --name <resource-group-name> --location <location>
```

If the resource group was created successfully, you'll see output similar to this:

```json
{
  "id": "/subscriptions/<guid>/resourceGroups/myContainerStorageRG",
  "location": "eastus",
  "managedBy": null,
  "name": "myContainerStorageRG",
  "properties": {
    "provisioningState": "Succeeded"
  },
  "tags": null
}
```

## Choose a data storage option and virtual machine type

Before you create your cluster, you should understand which back-end storage option you'll ultimately choose to create your storage pool. This is because different storage services work best with different virtual machine (VM) types as cluster nodes, and you'll deploy your cluster before you create the storage pool.

### Data storage options

- **[Azure Elastic SAN Preview](../elastic-san/elastic-san-introduction.md)**: Azure Elastic SAN preview is a good fit for general purpose databases, streaming and messaging services, CD/CI environments, and other tier 1/tier 2 workloads. Storage is provisioned on demand per created volume and volume snapshot. Multiple clusters can access a single SAN concurrently, however persistent volumes can only be attached by one consumer at a time.

- **[Azure Disks](../../virtual-machines/managed-disks-overview.md)**: Azure Disks are a good fit for databases such as MySQL, MongoDB, and PostgreSQL. Storage is provisioned per target container storage pool size and maximum volume size.

- **Ephemeral Disk**: This option uses local NVMe drives on the AKS nodes and is extremely latency sensitive (low sub-ms latency), so it's best for applications with no data durability requirement or with built-in data replication support such as Cassandra. AKS discovers the available ephemeral storage on AKS nodes and acquires the drives for volume deployment.

### VM types

To use Azure Container Storage, you'll need a node pool of at least three Linux VMs. Each VM should have a minimum of four virtual CPUs (vCPUs). Azure Container Storage will consume one core for I/O processing on every VM the extension is deployed to.

If you intend to use Azure Elastic SAN Preview or Azure Disks with Azure Container Storage, then you should choose a [general purpose VM type](../../virtual-machines/sizes-general.md) such as **standard_d4s_v5** for the cluster nodes. 

If you intend to use Ephemeral Disk, choose a [storage optimized VM type](../../virtual-machines/sizes-storage.md) with NVMe drives such as **standard_l8s_v3**. In order to use Ephemeral Disk, the VMs must have NVMe drives.

> [!IMPORTANT]
> You must choose a VM type that supports [Azure premium storage](../../virtual-machines/premium-storage-performance.md).

## Create AKS cluster

Run the following command to create a Linux-based AKS cluster and enable a system-assigned managed identity. If you already have an AKS cluster you want to use, you can skip this step.

Replace `<resource-group>` with the name of the resource group you created, `<cluster-name>` with the name of the cluster you want to create, and `<vm-type>` with the VM type you selected in the previous step. In this example, we'll create a cluster with three nodes. Increase the `--node-count` if you want a larger cluster.

```azurecli-interactive
az aks create -g <resource-group> -n <cluster-name> --node-count 3 -s <vm-type> --generate-ssh-keys
```

The deployment will take a few minutes to complete.

> [!NOTE]
> When you create an AKS cluster, AKS automatically creates a second resource group to store the AKS resources. This second resource group follows the naming convention `MC_YourResourceGroup_YourAKSClusterName_Region`. For more information, see [Why are two resource groups created with AKS?](../../aks/faq.md#why-are-two-resource-groups-created-with-aks).

## Connect to the cluster

To connect to the cluster, use the Kubernetes command-line client, `kubectl`.

1. Configure `kubectl` to connect to your cluster using the `az aks get-credentials` command. The following command:

    * Downloads credentials and configures the Kubernetes CLI to use them.
    * Uses `~/.kube/config`, the default location for the Kubernetes configuration file. You can specify a different location for your Kubernetes configuration file using the *--file* argument.

    ```azurecli-interactive
    az aks get-credentials --resource-group <resource-group> --name <cluster-name>
    ```

2. Verify the connection to your cluster using the `kubectl get` command. This command returns a list of the cluster nodes.

    ```azurecli-interactive
    kubectl get nodes
    ```

3. The following output example shows the nodes in your cluster. Make sure the status for all nodes shows *Ready*:

    ```output
    NAME                                STATUS   ROLES   AGE   VERSION
    aks-nodepool1-34832848-vmss000000   Ready    agent   80m   v1.25.6
    aks-nodepool1-34832848-vmss000001   Ready    agent   80m   v1.25.6
    aks-nodepool1-34832848-vmss000002   Ready    agent   80m   v1.25.6
    ```
    
    Take note of the name of your node pool. In this example, it would be **nodepool1**.

## Label the node pool

Next, you must update your node pool label to associate the node pool with the correct IO engine for Azure Container Storage.

> [!IMPORTANT]
> **If you created your AKS cluster using the Azure portal:** The cluster will likely have a user node pool and a system/agent node pool. Before you can install Azure Container Storage, you must update the user node pool label as described in this section. However, if your cluster consists of only a system node pool, which is the case with test/dev clusters created with the Azure portal, you'll need to first [add a new user node pool](../../aks/create-node-pools.md#add-a-node-pool) and then label it. This is because when you create an AKS cluster using the Azure portal, a taint `CriticalAddOnsOnly` is added to the agent/system nodepool, which blocks installation of Azure Container Storage on the system node pool. This taint isn't added when an AKS cluster is created using Azure CLI.

Run the following command to update the node pool label. Remember to replace `<resource-group>` and `<cluster-name>` with your own values, and replace `<nodepool-name>` with the name of your node pool.

```azurecli-interactive
az aks nodepool update --resource-group <resource group> --cluster-name <cluster name> --name <nodepool name> --labels acstor.azure.com/io-engine=acstor
```

You can verify that the node pool is correctly labeled by signing into the [Azure portal](https://portal.azure.com?azure-portal=true) and navigating to your AKS cluster. Go to **Settings > Node pools**, select your node pool, and under **Taints and labels** you should see `Labels: acstor.azure.com/io-engine:acstor`.

## Assign Contributor role to AKS managed identity

Azure Container Service is a separate service from AKS, so you'll need to grant permissions to allow Azure Container Storage to provision storage for your cluster. Specifically, you must assign the [Contributor](../../role-based-access-control/built-in-roles.md#contributor) Azure RBAC built-in role to the AKS managed identity. You can do this using the Azure portal or Azure CLI. You'll need an [Owner](../../role-based-access-control/built-in-roles.md#owner) role for your Azure subscription in order to do this. If you don't have sufficient permissions, ask your admin to perform these steps.

# [Azure portal](#tab/portal)

1. Sign in to the [Azure portal](https://portal.azure.com?azure-portal=true), and search for and select **Kubernetes services**.
1. Locate and select your AKS cluster. Select **Settings** > **Properties** from the left navigation.
1. Under **Infrastructure resource group**, you should see a link to the resource group that AKS created when you created the cluster. Select it.
1. Select **Access control (IAM)** from the left pane.
1. Select **Add > Add role assignment**.
1. Under **Assignment type**, select **Privileged administrator roles** and then **Contributor**, then select **Next**. If you don't have an Owner role on the subscription, you won't be able to add the Contributor role.
   
   :::image type="content" source="media/install-container-storage-aks/add-role-assignment.png" alt-text="Screenshot showing how to use the Azure portal to add Contributor role to the AKS managed identity." lightbox="media/install-container-storage-aks/add-role-assignment.png":::
   
1. Under **Assign access to**, select **Managed identity**.
1. Under **Members**, click **+ Select members**. The **Select managed identities** menu will appear.
1. Under **Managed identity**, select **User-assigned managed identity**.
1. Under **Select**, search for and select the managed identity with your cluster name and `-agentpool` appended.
1. Click **Select**, then **Review + assign**.

# [Azure CLI](#tab/cli)

Run the following commands to assign Contributor role to AKS managed identity. Remember to replace `<resource-group>`, `<cluster-name>`, and `<azure-subscription-id>` with your own values. You can also narrow the scope to your resource group, for example `/subscriptions/<azure-subscription-id>/resourceGroups/<resource-group>`.

```azurecli-interactive
export AKS_MI_OBJECT_ID=$(az aks show --name <cluster-name> --resource-group <resource-group> --query "identityProfile.kubeletidentity.objectId" -o tsv)
az role assignment create --assignee $AKS_MI_OBJECT_ID --role "Contributor" --scope "/subscriptions/<azure-subscription-id>"
```
---

## Install Azure Container Storage

The initial install uses Azure Arc CLI commands to download a new extension. Replace `<cluster-name>` and `<resource-group>` with your own values. The `<name>` value can be whatever you want; it's just a label for the extension you're installing.

During installation, you might be asked to install the `k8s-extension`. Select **Y**.

```azurecli-interactive
az k8s-extension create --cluster-type managedClusters --cluster-name <cluster name> --resource-group <resource group name> --name <name of extension> --extension-type microsoft.azurecontainerstorage --scope cluster --release-train stable --release-namespace acstor
```

Installation takes 10-15 minutes to complete. You can check if the installation completed correctly by running the following command and ensuring that `provisioningState` says **Succeeded**:

```azurecli-interactive
az k8s-extension list --cluster-name <cluster-name> --resource-group <resource-group> --cluster-type managedClusters
```

Congratulations, you've successfully installed Azure Container Storage. You now have new storage classes that you can use for your Kubernetes workloads.

## Next steps

Now you can create a storage pool and persistent volume claim, and then deploy a pod and attach a persistent volume. Follow the steps in the appropriate how-to article.

- [Use Azure Container Storage Preview with Azure Elastic SAN Preview](use-container-storage-with-elastic-san.md)
- [Use Azure Container Storage Preview with Azure Disks](use-container-storage-with-managed-disks.md)
- [Use Azure Container Storage with Azure Ephemeral disk (NVMe)](use-container-storage-with-local-disk.md)
