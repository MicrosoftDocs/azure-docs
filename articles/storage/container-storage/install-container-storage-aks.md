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

# Install Azure Container Storage for use with Azure Kubernetes Service

[Azure Container Storage](container-storage-introduction.md) is a cloud-based volume management, deployment, and orchestration service built for containers. Use this tutorial to install the latest production version of Azure Container Storage on an [Azure Kubernetes Service (AKS)](/azure/aks/intro-kubernetes) cluster, whether you create a new cluster or enable the service on an existing cluster.

This article explains how to install Azure Container Storage using two supported flows (installer-only or installer + storage type), how driver installation is triggered, and how to verify and troubleshoot your deployment. Azure Container Storage installs drivers that implement the Container Storage Interface (CSI).

If you prefer the open-source version of Azure Container Storage, see the [local-csi-driver](https://github.com/Azure/local-csi-driver) repository for alternate installation instructions.

By the end of this tutorial, you can:

::: zone pivot="azurecli"

> [!div class="checklist"]
> - Prepare your Azure CLI environment
> - Create or select a resource group for your cluster
> - Confirm your node pool virtual machine types meet the installation criteria
> - Install Azure Container Storage by creating a new AKS cluster or enabling it on an existing cluster

> [!IMPORTANT]
> This article applies to [Azure Container Storage (version 2.x.x)](container-storage-introduction.md). For earlier versions, see [Azure Container Storage (version 1.x.x) documentation](container-storage-introduction-version-1.md). If you already have Azure Container Storage (version 1.x.x) installed on your AKS cluster, remove it by following [these steps](remove-container-storage-version-1.md).

## Prerequisites

- Create an Azure subscription if you don't already have one by signing up for a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- Confirm that your target region is supported by reviewing the [Azure Container Storage regional availability](container-storage-introduction.md#regional-availability).
- Plan your node pool configuration:
  - Use Linux as the OS type (Windows isn't supported).
  - Select a virtual machine (VM) SKU that supports local NVMe data disks if you plan to use the local NVMe storage type, such as [storage-optimized](/azure/virtual-machines/sizes/overview#storage-optimized) or [GPU-accelerated](/azure/virtual-machines/sizes/overview#gpu-accelerated) VMs.
  - For existing clusters, ensure node pools already use a supported VM SKU before enabling Azure Container Storage.
- Install the latest version of the [Azure CLI](/cli/azure/install-azure-cli) (2.83.0 or later), then sign in with `az login`. Avoid Azure Cloud Shell because `az upgrade` isn't available there. Disable conflicting extensions such as `aks-preview` if issues occur.
- Install the Kubernetes command-line client, `kubectl`. You can install it locally by running `az aks install-cli`.
- If you use Elastic SAN for the first time in the subscription, run this one-time registration command:

```azurecli-interactive
az provider register --namespace Microsoft.ElasticSan
```

## Install the required extension

Add or upgrade to the latest version of the `k8s-extension` extension:

```azurecli
az extension add --upgrade --name k8s-extension
```

## Set subscription context

Set your Azure subscription context using the `az account set` command. You can view subscription IDs by running `az account list --output table`. Replace `<subscription-id>` with your subscription ID.

```azurecli
az account set --subscription <subscription-id>
```

## Create a resource group

An Azure resource group is a logical container for resources. When you create a resource group, you specify a location. That location stores resource group metadata and serves as the default region for resources you create without an explicit region.

Create a resource group using `az group create`. Replace `<resource-group-name>` with your resource group name and `<location>` with an Azure region such as `eastus`, `westus2`, `westus3`, or `westeurope`. If you enable Azure Container Storage on an existing AKS cluster, use the resource group that already hosts the cluster.

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

## Install Azure Container Storage on a new AKS cluster

Choose the scenario that matches your environment.

> [!IMPORTANT]
> Azure Container Storage installs the latest major version by default. You can pin a major version with `--container-storage-version`. You can't pin minor or patch versions.

### Installer-only installation

Run the following command to create a new AKS cluster and install Azure Container Storage. Replace `<cluster-name>` and `<resource-group>` with your own values, and specify which VM type you want to use.

```azurecli
az aks create -n <cluster-name> -g <resource-group> --node-vm-size Standard_L8s_v3 --enable-azure-container-storage --generate-ssh-keys
```

The deployment can take up to 5 minutes. CSI driver installation is deferred until you create a StorageClass or enable a storage type later.

Follow the instructions for creating a [local NVMe](use-container-storage-with-local-disk.md) StorageClass or [Elastic SAN](use-container-storage-with-elastic-san.md) StorageClass.

### Installer + storage type installation

Run the following command to create a new AKS cluster and install Azure Container Storage. Replace `<cluster-name>` and `<resource-group>` with your own values, and specify which VM type you want to use.

```azurecli
az aks create -n <cluster-name> -g <resource-group> --node-vm-size Standard_L8s_v3 --enable-azure-container-storage ephemeralDisk --generate-ssh-keys
```

This command installs the installer, deploys the `ephemeralDisk` driver, and creates a default StorageClass. You can install and use both local NVMe and Elastic SAN by providing comma-separated values such as `ephemeralDisk,elasticSan`.

## Install Azure Container Storage on an existing AKS cluster

### Installer-only installation

Run the following command to enable Azure Container Storage on an existing AKS cluster. Replace `<cluster-name>` and `<resource-group>` with your own values.

```azurecli
az aks update -n <cluster-name> -g <resource-group> --enable-azure-container-storage
```

The deployment can take up to 5 minutes. When it completes, the cluster has the Azure Container Storage installer component installed. CSI driver installation is deferred until you create a StorageClass or enable a storage type later. Follow the instructions for creating a [local NVMe](use-container-storage-with-local-disk.md) StorageClass or [Elastic SAN](use-container-storage-with-elastic-san.md) StorageClass.

### Installer + storage type installation

Run the following command to enable Azure Container Storage on an existing AKS cluster. Replace `<cluster-name>` and `<resource-group>` with your own values, and specify which storage type you want to use.

```azurecli
az aks update -n <cluster-name> -g <resource-group> --enable-azure-container-storage elasticSan
```

This command installs the installer, deploys the Elastic SAN CSI driver, and creates a default StorageClass. You can install and use both local NVMe and Elastic SAN by providing comma-separated values such as `ephemeralDisk,elasticSan`.

::: zone-end

::: zone pivot="terraform"

> [!div class="checklist"]
> - Prepare Terraform and authenticate to Azure
> - Define your resource group and AKS cluster configuration
> - Confirm your node pool virtual machine types meet the installation criteria
> - Apply Terraform to deploy Azure Container Storage or enable it on an existing cluster

> [!IMPORTANT]
> This article applies to [Azure Container Storage (version 2.x.x)](container-storage-introduction.md). For earlier versions, see [Azure Container Storage (version 1.x.x) documentation](container-storage-introduction-version-1.md). If you already have Azure Container Storage (version 1.x.x) installed on your AKS cluster, remove it by following [these steps](remove-container-storage-version-1.md).

## Prerequisites

- Create an Azure subscription if you don't already have one by signing up for a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- Verify that your target region is supported by checking the [Azure Container Storage regional availability](container-storage-introduction.md#regional-availability).
- Plan your node pool configuration:
  - Use Linux as the OS type (Windows isn't supported).
  - Select a virtual machine (VM) SKU that supports local NVMe data disks, such as [storage-optimized](/azure/virtual-machines/sizes/overview#storage-optimized) or [GPU-accelerated](/azure/virtual-machines/sizes/overview#gpu-accelerated) VMs.
  - For existing clusters, ensure node pools already use a supported VM SKU before enabling Azure Container Storage.
- Install the [Azure CLI](/cli/azure/install-azure-cli) version 2.77.0 or later, then sign in with `az login`.
- Install [Terraform](https://developer.hashicorp.com/terraform/install) version 1.5 or later and confirm the installation with `terraform version`. Terraform can reuse your Azure CLI authentication.
- Install `kubectl` so you can validate the cluster after deployment. If needed, run `az aks install-cli` to install it locally.
- If you use Elastic SAN for the first time in the subscription, run this one-time registration command:

```azurecli
az provider register --namespace Microsoft.ElasticSan
```

## Set subscription context

Terraform can determine a target Azure subscription via multiple methods:

- `subscription_id` in the provider block
- `ARM_SUBSCRIPTION_ID` environment variable
- Azure CLI default subscription
- Managed identity (when running in Azure)

For local use, set the Azure CLI context:

```azurecli
az account set --subscription <subscription-id>
```

## Install Azure Container Storage on a new AKS cluster

> [!IMPORTANT]
> Azure Container Storage installs the latest available version and updates itself automatically. Manual version selection isn't supported.

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

    To install Elastic SAN during deployment, set `enable-azure-container-storage` to `elasticSan` or a comma-separated list:

    ```tf
    configuration_settings = {
      enable-azure-container-storage = "elasticSan"
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

4. Apply the configuration to create the resource group, AKS cluster, and Azure Container Storage extension. Deployment typically takes 5 to 10 minutes.

    ```bash
    terraform apply
    ```

## Install Azure Container Storage on an existing AKS cluster

If your AKS cluster already exists and you manage it outside of Terraform, you can still enable Azure Container Storage by authoring only the extension resource. Use a data source to look up the cluster ID.

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

To install Elastic SAN or local NVMe during deployment, set `enable-azure-container-storage` to a storage type or comma-separated list (for example, `elasticSan` or `ephemeralDisk,elasticSan`).

Run `terraform init` (if this is a new working directory) followed by `terraform apply` to install Azure Container Storage on the targeted cluster.

::: zone-end

## Verify installation

### Verify installer (installer-only mode)

After an installer-only enable, verify that the installer is present:

```azurecli
kubectl get deploy -n kube-system | grep acstor
```

Expected output:

```output
acstor-cluster-manager                2/2     2            2           4d9h
acstor-geneva                         2/2     2            2           4d9h
```

### Verify StorageClass presence

After you create a StorageClass or enable a storage type, verify the StorageClass:

```azurecli
kubectl get sc
```

Example output:

```output
NAME                    PROVISIONER               RECLAIMPOLICY   VOLUMEBINDINGMODE      ALLOWVOLUMEEXPANSION   AGE
azuresan                san.csi.azure.com         Delete          Immediate              false                  4d7h
local                   localdisk.csi.acstor.io   Delete          WaitForFirstConsumer   true                   4d5h
```

### Verify driver installation

Verify the components expected after StorageClass creation or storage type installation:

```azurecli
kubectl get pod -n kube-system | grep acstor
```

Example output:

```output
pod/acstor-azuresan-csi-driver-jrqd2                       7/7     Running   0               142m
pod/acstor-azuresan-csi-driver-tcdp8                       7/7     Running   0               142m
pod/acstor-cluster-manager-76c67496f9-8ln5d                2/2     Running   0               3h54m
pod/acstor-cluster-manager-76c67496f9-b4c8q                2/2     Running   0               3h54m
pod/acstor-geneva-588bcbcc67-4tr5d                         3/3     Running   0               3h54m
pod/acstor-geneva-588bcbcc67-k7j7k                         3/3     Running   0               3h54m
pod/acstor-node-agent-46v47                                1/1     Running   0               142m
pod/acstor-node-agent-6c99m                                1/1     Running   0               142m
pod/acstor-otel-collector-4lfgz                            1/1     Running   0               142m
pod/acstor-otel-collector-hw9nd                            1/1     Running   0               142m
```

### Debugging

For debugging, watch the system as components roll out:

```azurecli
kubectl get events -n kube-system --watch
kubectl get pod -n kube-system --watch
```

Inspect the HelmRelease and OCIRepository custom resources used by the installer:

```azurecli
kubectl describe helmreleases.helm.installer.acstor.io -n kube-system
kubectl describe ocirepositories.source.installer.acstor.io -n kube-system
```

## Next steps

- [Use Azure Container Storage with local NVMe](use-container-storage-with-local-disk.md)
- [Overview of deploying a highly available PostgreSQL database on Azure Kubernetes Service (AKS)](/azure/aks/postgresql-ha-overview#storage-considerations)
- [Frequently asked questions (FAQ) about Azure Container Storage](container-storage-faq.md)
