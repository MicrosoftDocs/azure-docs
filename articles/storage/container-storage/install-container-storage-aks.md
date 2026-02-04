---
title: Install Azure Container Storage with AKS
description: Learn how to install Azure Container Storage for use with Azure Kubernetes Service (AKS). Create an AKS cluster and install Azure Container Storage.
author: khdownie
ms.service: azure-container-storage
ms.topic: tutorial
ms.date: 09/10/2025
ms.author: kendownie
ms.custom: devx-track-azurecli, references_regions
zone_pivot_groups: azure-cli-or-terraform
# Customer intent: "As a cloud administrator, I want to install Azure Container Storage on an AKS cluster so that I can efficiently manage storage for containerized applications."
---

# Tutorial: Install Azure Container Storage for use with Azure Kubernetes Service

[Azure Container Storage](container-storage-introduction.md) is a cloud-based volume management, deployment, and orchestration service built natively for containers. Use this tutorial to install the latest production version of Azure Container Storage on an [Azure Kubernetes Service (AKS)](/azure/aks/intro-kubernetes) cluster, whether you're creating a new cluster or enabling the service on an existing deployment.

If you prefer the open-source version of Azure Container Storage, visit the [local-csi-driver](https://github.com/Azure/local-csi-driver) repository for alternate installation instructions.

By the end of this tutorial, you will:

::: zone pivot="azurecli"

> [!div class="checklist"]
> * Prepare your Azure CLI environment
> * Create or select a resource group for your cluster
> * Confirm your node pool virtual machine types meet the installation criteria
> * Install Azure Container Storage by creating a new AKS cluster or enabling it on an existing cluster

> [!IMPORTANT]
> This article applies to [Azure Container Storage (version 2.x.x)](container-storage-introduction.md). For earlier versions, see [Azure Container Storage (version 1.x.x) documentation](container-storage-introduction-version-1.md). If you already have Azure Container Storage (version 1.x.x) installed on your AKS cluster, remove it by following [these steps](remove-container-storage-version-1.md).

## Prerequisites

- Create an Azure subscription if you don’t already have one by signing up for a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

- Confirm that your target region is supported by reviewing the [Azure Container Storage regional availability](container-storage-introduction.md#regional-availability).

- Plan your node pool configuration:
  - Use Linux as the OS type (Windows is not supported).
  - Select a VM SKU that supports local NVMe data disks, such as [storage-optimized](/azure/virtual-machines/sizes/overview#storage-optimized) or [GPU-accelerated](/azure/virtual-machines/sizes/overview#gpu-accelerated) VMs.
  - For existing clusters, ensure node pools already use a supported VM SKU before enabling Azure Container Storage.

- Install the latest version of the [Azure CLI](/cli/azure/install-azure-cli) (2.77.0 or later), then sign in with `az login`. Avoid using Azure Cloud Shell (since `az upgrade` isn’t available), and disable conflicting extensions such as `aks-preview` if issues occur.

- Install the Kubernetes command-line client, `kubectl`. You can install it locally by running `az aks install-cli`.

## Install the required extension

Add or upgrade to the latest version of `k8s-extension` by running the following command.

```azurecli
az extension add --upgrade --name k8s-extension
```

## Set subscription context

Set your Azure subscription context using the `az account set` command. You can view the subscription IDs for all the subscriptions you have access to by running the `az account list --output table` command. Remember to replace `<subscription-id>` with your subscription ID.

```azurecli
az account set --subscription <subscription-id>
```

## Create a resource group

An Azure resource group is a logical group that holds your Azure resources that you want to manage as a group. When you create a resource group, you're prompted to specify a location. This location is:

* The storage location of your resource group metadata.
* Where your resources run in Azure if you don't specify another region during resource creation.

Create a resource group using the `az group create` command. Replace `<resource-group-name>` with the name of the resource group you want to create, and replace `<location>` with an Azure region such as *eastus*, *westus2*, *westus3*, or *westeurope*. If you're enabling Azure Container Storage on an existing AKS cluster, use the resource group that already hosts the cluster.

```azurecli
az group create --name <resource-group-name> --location <location>
```

If the resource group is created successfully, you see output similar to this example:

```output
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

## Install Azure Container Storage on an AKS cluster

Choose the scenario that matches your environment.

> [!IMPORTANT]
> Azure Container Storage installs the latest available version and updates itself automatically. Manual version selection is not supported.

### Option 1: Creating a new AKS cluster with Azure Container Storage enabled

Run the following command to create a new AKS cluster and install Azure Container Storage. Replace `<cluster-name>` and `<resource-group>` with your own values, and specify which VM type you want to use.

```azurecli
az aks create -n <cluster-name> -g <resource-group> --node-vm-size Standard_L8s_v3 --enable-azure-container-storage --generate-ssh-keys
```

The deployment takes 5-10 minutes. When it completes, you have an AKS cluster with Azure Container Storage installed and the components for local NVMe storage type deployed.

### Option 2: Enabling Azure Container Storage on an existing AKS cluster

Run the following command to enable Azure Container Storage on an existing AKS cluster. Replace `<cluster-name>` and `<resource-group>` with your own values.

```azurecli
az aks update -n <cluster-name> -g <resource-group> --enable-azure-container-storage
```

The deployment takes 5-10 minutes. When it completes, the targeted AKS cluster has Azure Container Storage installed and the components for local NVMe storage type deployed.

::: zone-end

::: zone pivot="terraform"

> [!div class="checklist"]
> * Prepare Terraform and authenticate to Azure
> * Define your resource group and AKS cluster configuration
> * Confirm your node pool virtual machine types meet the installation criteria
> * Apply Terraform to deploy Azure Container Storage or enable it on an existing cluster

> [!IMPORTANT]
> This article applies to [Azure Container Storage (version 2.x.x)](container-storage-introduction.md). For earlier versions, see [Azure Container Storage (version 1.x.x) documentation](container-storage-introduction-version-1.md). If you already have Azure Container Storage (version 1.x.x) installed on your AKS cluster, remove it by following [these steps](remove-container-storage-version-1.md).

## Prerequisites

- Create an Azure subscription if you don’t already have one by signing up for a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

- Verify that your target region is supported by checking the [Azure Container Storage regional availability](container-storage-introduction.md#regional-availability).

- Plan your node pool configuration:
  - Use Linux as the OS type (Windows is not supported).
  - Select a VM SKU that supports local NVMe data disks, such as [storage-optimized](/azure/virtual-machines/sizes/overview#storage-optimized) or [GPU-accelerated](/azure/virtual-machines/sizes/overview#gpu-accelerated) VMs.
  - For existing clusters, ensure node pools already use a supported VM SKU before enabling Azure Container Storage.

- Install the [Azure CLI](/cli/azure/install-azure-cli) version 2.77.0 or later, then sign in with `az login`.

- Install [Terraform](https://developer.hashicorp.com/terraform/install) version 1.5 or later and confirm the installation with `terraform version`. Terraform can reuse your Azure CLI authentication.

- Install `kubectl` so you can validate the cluster after deployment. If needed, run `az aks install-cli` to install it locally.

## Set subscription context

Terraform can determine a target Azure subscription via various means:

- `subscription_id` in the provider block 
- `ARM_SUBSCRIPTION_ID` environment variable
- Azure CLI default subscription
- Managed identity (when running in Azure)

For local use, set the Azure CLI context:

```azurecli
az account set --subscription <subscription-id>
```

## Install Azure Container Storage on an AKS cluster

Choose the scenario that matches your environment.

> [!IMPORTANT]
> Azure Container Storage installs the latest available version and updates itself automatically. Manual version selection is not supported.

### Option 1: Creating a new AKS cluster with Azure Container Storage enabled

1. In an empty working directory, create a `main.tf` file with the following minimal configuration of an AKS cluster. Update the resource names, locations, and VM sizes to meet your requirements.

    ```tf
    terraform {
      required_version = ">= 1.5.0"
      required_providers {
        azurerm = {
          source  = "hashicorp/azurerm"
          version = "~> 4.x"
        }
      }
    }

    provider "azurerm" {
      features {}
    }

    resource "azurerm_resource_group" "rg" {
      name     = "demo-aks-rg"
      location = "eastus"
    }

    resource "azurerm_kubernetes_cluster" "aks" {
      name                = "demo-aks-cluster"
      dns_prefix          = "demo-aks"
      location            = azurerm_resource_group.rg.location
      resource_group_name = azurerm_resource_group.rg.name

      default_node_pool {
        name       = "systempool"
        vm_size    = "Standard_L8s_v3"
        node_count = 3
      }

      identity {
        type = "SystemAssigned"
      }
    }

    resource "azurerm_kubernetes_cluster_extension" "container_storage" {
      # NOTE: the `name` parameter must be "acstor" for Azure CLI compatibility
      name           = "acstor"
      cluster_id     = azurerm_kubernetes_cluster.aks.id
      extension_type = "microsoft.azurecontainerstoragev2"

      configuration_settings = {
        enable-azure-container-storage = "true"
      }
    }
    ```

2. Initialize the working directory to download the AzureRM provider.

    ```bash
    terraform init
    ```

3. Review the planned changes.

    ```bash
    terraform plan
    ```

4. Apply the configuration to create the resource group, AKS cluster, and Azure Container Storage extension. Deployment typically takes 5-10 minutes.

    ```bash
    terraform apply
    ```

### Option 2: Enabling Azure Container Storage on an existing AKS cluster

If your AKS cluster already exists and you're managing it outside of Terraform, you can still enable Azure Container Storage by authoring only the extension resource. Use a data source to look up the cluster ID.

```tf
terraform {
  required_version = ">= 1.5.0"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.x"
    }
  }
}

provider "azurerm" {
  features {}
}

data "azurerm_kubernetes_cluster" "existing" {
  name                = "existing-aks"
  resource_group_name = "existing-aks-rg"
}

resource "azurerm_kubernetes_cluster_extension" "container_storage" {
  # NOTE: the `name` parameter must be "acstor" for Azure CLI compatibility
  name           = "acstor"
  cluster_id     = data.azurerm_kubernetes_cluster.existing.id
  extension_type = "microsoft.azurecontainerstoragev2"

  configuration_settings = {
    enable-azure-container-storage = "true"
  }
}
```

Run `terraform init` (if this is a new working directory) followed by `terraform apply` to install Azure Container Storage on the targeted cluster.

::: zone-end


## Connect to the cluster and verify status

After installation, configure `kubectl` to connect to your cluster and verify the nodes are ready.

1. Download the cluster credentials and configure the Kubernetes CLI to use them. By default, credentials are stored in `~/.kube/config`. Provide a different path by using the `--file` argument if needed.

    ```azurecli
    az aks get-credentials --resource-group <resource-group> --name <cluster-name>
    ```

2. Verify the connection by listing the cluster nodes.

    ```azurecli
    kubectl get nodes
    ```

3. Make sure all nodes report a status of `Ready`, similar to the following output:

    ```output
    NAME                                STATUS   ROLES   AGE   VERSION
    aks-nodepool1-34832848-vmss000000   Ready    agent   80m   v1.32.6
    aks-nodepool1-34832848-vmss000001   Ready    agent   80m   v1.32.6
    aks-nodepool1-34832848-vmss000002   Ready    agent   80m   v1.32.6
    ```

## Next steps

- [Use Azure Container Storage with local NVMe](use-container-storage-with-local-disk.md)
- [Overview of deploying a highly available PostgreSQL database on Azure Kubernetes Service (AKS)](/azure/aks/postgresql-ha-overview#storage-considerations)
