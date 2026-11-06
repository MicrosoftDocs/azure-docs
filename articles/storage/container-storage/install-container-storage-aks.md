---
title: Install Azure Container Storage with AKS
description: Learn how to install Azure Container Storage for use with Azure Kubernetes Service (AKS). Create an AKS cluster and install Azure Container Storage.
author: khdownie
ms.service: azure-container-storage
ms.topic: tutorial
ms.date: 10/30/2026
ms.author: kendownie
ms.custom: devx-track-azurecli, references_regions
zone_pivot_groups: azure-cli-or-terraform
# Customer intent: "As a cloud administrator, I want to install Azure Container Storage on an AKS cluster so that I can efficiently manage storage for containerized applications."
---

# Install Azure Container Storage for use with Azure Kubernetes Service

[Azure Container Storage](container-storage-introduction.md) is a cloud-based volume management, deployment, and orchestration service built for containers. Use this tutorial to install the latest production version of Azure Container Storage on an [Azure Kubernetes Service (AKS)](/azure/aks/intro-kubernetes) cluster, whether you create a new cluster or enable the service on an existing cluster.

This article explains how to install Azure Container Storage using two supported flows (installer-only or installer + capability), how component installation is triggered, and how to verify and troubleshoot your deployment. Persistent-volume storage types install drivers that implement the Container Storage Interface (CSI). Azure Container Storage can also enable and manage distributed accelerator for cloud storage (DACS), which installs a separate extension and doesn't create a StorageClass.

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

[!INCLUDE [container-storage-prerequisites](../../../includes/container-storage-prerequisites.md)]

- Plan your node pool configuration:
  - Use Linux as the OS type (Windows isn't supported).
  - Select a virtual machine (VM) SKU that supports local NVMe data disks if you plan to use the local NVMe storage type, such as [storage-optimized](/azure/virtual-machines/sizes/overview#storage-optimized) or [GPU-accelerated](/azure/virtual-machines/sizes/overview#gpu-accelerated) VMs.
  - For existing clusters, ensure node pools already use a supported VM SKU before enabling Azure Container Storage.

- If you use Elastic SAN for the first time in the subscription, run this one-time registration command:
  ```azurecli-interactive
  az provider register --namespace Microsoft.ElasticSan
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

The deployment can take up to 5 minutes. CSI driver installation is deferred until you create a storage class or enable a storage type later.

Follow the instructions for creating a [local NVMe](use-container-storage-with-local-disk.md) storage class or [Elastic SAN](use-container-storage-with-elastic-san.md) storage class.

### Installer + storage type installation

Run the following command to create a new AKS cluster and install Azure Container Storage. Replace `<cluster-name>` and `<resource-group>` with your own values, and specify which VM type you want to use.

```azurecli
az aks create -n <cluster-name> -g <resource-group> --node-vm-size Standard_L8s_v3 --enable-azure-container-storage ephemeralDisk --generate-ssh-keys
```

This command installs the installer, deploys the local NVMe CSI driver, and creates a default storage class called `local-csi`. You can install and use both local NVMe and Elastic SAN by providing a list such as `ephemeralDisk elasticSan`.

## Install Azure Container Storage on an existing AKS cluster

### Installer-only installation

Run the following command to enable Azure Container Storage on an existing AKS cluster. Replace `<cluster-name>` and `<resource-group>` with your own values.

```azurecli
az aks update -n <cluster-name> -g <resource-group> --enable-azure-container-storage
```

The deployment can take up to 5 minutes. When it completes, the cluster has the Azure Container Storage installer component installed. CSI driver installation is deferred until you create a storage class or enable a storage type later. Follow the instructions for creating a [local NVMe](use-container-storage-with-local-disk.md) storage class or [Elastic SAN](use-container-storage-with-elastic-san.md) storage class.

### Installer + storage type installation

Run the following command to enable Azure Container Storage on an existing AKS cluster. Replace `<cluster-name>` and `<resource-group>` with your own values, and specify which storage type you want to use.

```azurecli
az aks update -n <cluster-name> -g <resource-group> --enable-azure-container-storage elasticSan
```

This command installs the installer, deploys the Elastic SAN CSI driver, and creates a default storage class called `azuresan-csi`. You can install and use both local NVMe and Elastic SAN by providing a list such as `ephemeralDisk elasticSan`.

### Install distributed accelerator for cloud storage (preview)

Enable distributed accelerator for cloud storage on an existing AKS cluster by using the `distributedAccelerator` value. The uppercase `A` is required. The extension installs on the AKS managed-cluster resource; you don't need to Arc-connect the cluster.

Use `aks-preview` version `22.0.0b9` or later. Install or upgrade the extension, verify its version, and install or upgrade `connectedk8s` and `k8s-extension` to manage and inspect the DACS extension:

```azurecli
az extension add --name aks-preview --upgrade --yes
az extension show --name aks-preview --query version --output tsv
az extension add --name connectedk8s --upgrade --yes
az extension add --name k8s-extension --upgrade --yes
```

Before enabling DACS, select a Linux node pool with local NVMe data disks dedicated to the cache. Apply the `dacs.azure.com/processing-unit=cpu` label through the node-pool configuration, preserving any existing custom labels. Follow [Verify the cache node pool](distributed-accelerator-for-cloud-storage-quickstart.md#verify-the-cache-node-pool).

> [!CAUTION]
> Enabling DACS installs a prerequisite DaemonSet that discovers, formats, and mounts local NVMe disks on labeled cache nodes. Label only nodes with disks that aren't claimed by another storage component.

Run the following command, replacing `<cluster-name>` and `<resource-group>` with your values:

```azurecli
az aks update \
  --name <cluster-name> \
  --resource-group <resource-group> \
  --enable-azure-container-storage distributedAccelerator
```

This command installs the `distributedaccelerator` extension, the DACS controller and NVMe prerequisite DaemonSet in `kube-system`, and the `caches.storage.azure.com` custom resource definition (CRD). You don't install a separate prerequisite chart or manage the extension's Helm release yourself. It doesn't create a StorageClass or provision a Cache resource and cache-server pods by default. Successful extension installation doesn't by itself mean that a cache is ready for application traffic.

Pass `distributedAccelerator` on its own in this command rather than combining it with the persistent-volume storage options shown earlier. Before provisioning cache servers, verify that the managed prerequisites are ready on every labeled cache node. For the cache setup and application workflow, see [Get started with distributed accelerator for cloud storage on AKS](distributed-accelerator-for-cloud-storage-quickstart.md).

To remove DACS, follow [Remove distributed accelerator for cloud storage](remove-container-storage.md#remove-distributed-accelerator-for-cloud-storage). Delete Cache resources while the controller is running, then disable DACS. Disablement removes the controller and managed prerequisite DaemonSet; don't remove those prerequisites separately.

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

[!INCLUDE [container-storage-prerequisites](../../../includes/container-storage-prerequisites.md)]

- Plan your node pool configuration:
  - Use Linux as the OS type (Windows isn't supported).
  - Select a virtual machine (VM) SKU that supports local NVMe data disks, such as [storage-optimized](/azure/virtual-machines/sizes/overview#storage-optimized) or [GPU-accelerated](/azure/virtual-machines/sizes/overview#gpu-accelerated) VMs.
  - For existing clusters, ensure node pools already use a supported VM SKU before enabling Azure Container Storage.

- Install [Terraform](https://developer.hashicorp.com/terraform/install) version 1.5 or later and confirm the installation with `terraform version`. Terraform can reuse your Azure CLI authentication.

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

If you deploy with Terraform for the first time in the subscription, run this one-time registration command:
```azurecli
az provider register --namespace Microsoft.KubernetesConfiguration

# Wait for registration to complete (can take a few minutes)
az provider show --namespace Microsoft.KubernetesConfiguration --query "registrationState" -o tsv
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
          version = "~> 4.0"
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
    }
    ```

1. Initialize the working directory to download the AzureRM provider.

    ```bash
    terraform init
    ```

1. Review the planned changes.

    ```bash
    terraform plan
    ```

1. Apply the configuration to create the resource group, AKS cluster, and Azure Container Storage extension. Deployment typically takes 5 minutes. 

    ```bash
    terraform apply
    ```

When it completes, the cluster has the Azure Container Storage installer component installed. CSI driver installation is deferred until you create a storage class. Follow the instructions for creating a [local NVMe](use-container-storage-with-local-disk.md) storage class or [Elastic SAN](use-container-storage-with-elastic-san.md) storage class.

## Install Azure Container Storage on an existing AKS cluster

If your AKS cluster already exists and you manage it outside of Terraform, you can still enable Azure Container Storage by authoring only the extension resource. Use a data source to look up the cluster ID.

```tf
terraform {
  required_version = ">= 1.5.0"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.0"
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
}
```

Run `terraform init` (if this is a new working directory) followed by `terraform apply` to install Azure Container Storage on the targeted cluster. Deployment typically takes 5 minutes. 

When it completes, the cluster has the Azure Container Storage installer component installed. CSI driver installation is deferred until you create a storage class. Follow the instructions for creating a [local NVMe](use-container-storage-with-local-disk.md) storage class or [Elastic SAN](use-container-storage-with-elastic-san.md) storage class.

::: zone-end

## Verify installation

### Connect to the AKS cluster

Before running the verification commands, make sure your local kubeconfig is set to the target cluster:

```azurecli
az aks get-credentials --resource-group <resource-group-name> --name <cluster-name>
```

If you manage multiple clusters, add `--overwrite-existing` to replace an existing context or use `--context` to set a unique context name.

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

### Verify distributed accelerator for cloud storage

For a DACS installation, check the extension rather than looking for a StorageClass:

```azurecli
az k8s-extension show \
  --cluster-type managedClusters \
  --cluster-name <cluster-name> \
  --resource-group <resource-group> \
  --name distributedaccelerator \
  --query '{extensionType:extensionType,provisioningState:provisioningState,currentVersion:currentVersion,releaseTrain:releaseTrain}' \
  --output table
```

Confirm that the extension type is `microsoft.distributedaccelerator` and its provisioning state is `Succeeded`. The `currentVersion` field shows the installed version. The extension resource name is lowercase `distributedaccelerator`, unlike the CLI storage option `distributedAccelerator`.

After connecting to the cluster, verify the controller, prerequisite DaemonSet, and CRD:

```bash
kubectl rollout status deployment/dacs-manager --namespace kube-system --timeout=5m
kubectl get deployment dacs-manager --namespace kube-system
kubectl rollout status daemonset/dacs-prereq --namespace kube-system --timeout=10m
kubectl get daemonset dacs-prereq --namespace kube-system
kubectl get pods --namespace kube-system --selector app.kubernetes.io/name=dacs-prereq --output wide
kubectl get crd caches.storage.azure.com
```

Continue only after the extension is in the `Succeeded` state, the controller has a ready replica, and the prerequisite DaemonSet has a Ready pod on every labeled cache node. A DaemonSet with zero desired replicas doesn't verify NVMe preparation. If a check fails, see [Troubleshoot distributed accelerator for cloud storage](troubleshoot-distributed-accelerator-for-cloud-storage.md).

The storage-class and CSI-driver verification steps that follow apply to persistent-volume storage types, not DACS.

### Verify storage class presence

After you create a storage class or enable a storage type, verify the storage class:

```azurecli
kubectl get sc
```

Example output:

```output
NAME                    PROVISIONER               RECLAIMPOLICY   VOLUMEBINDINGMODE      ALLOWVOLUMEEXPANSION   AGE
azuresan-csi            san.csi.azure.com         Delete          Immediate              false                  4d7h
local-csi               localdisk.csi.acstor.io   Delete          WaitForFirstConsumer   true                   4d5h
```

### Verify driver installation

Verify the components expected after storage class creation or storage type installation:

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
- [Use Azure Container Storage with Elastic SAN](use-container-storage-with-elastic-san.md)
- [Get started with distributed accelerator for cloud storage on AKS (preview)](distributed-accelerator-for-cloud-storage-quickstart.md)
- [Overview of deploying a highly available PostgreSQL database on Azure Kubernetes Service (AKS)](/azure/aks/postgresql-ha-overview#storage-considerations)
- [Frequently asked questions (FAQ) about Azure Container Storage](container-storage-faq.md)
