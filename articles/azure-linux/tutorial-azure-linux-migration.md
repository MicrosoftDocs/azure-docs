---
title: Azure Linux Container Host for AKS tutorial - Migrating to Azure Linux
description: In this Azure Linux Container Host for AKS tutorial, you learn how to migrate your nodes to Azure Linux nodes.
author: htaubenfeld
ms.author: htaubenfeld
ms.reviewer: schaffererin
ms.service: microsoft-linux
ms.custom: devx-track-azurecli, linux-related-content
ms.topic: tutorial
ms.date: 01/19/2024
---

# Tutorial: Migrate nodes to Azure Linux

In this tutorial, part three of five, you migrate your existing nodes to Azure Linux. You can migrate your existing nodes to Azure Linux using one of the following methods:

* Remove existing node pools and add new Azure Linux node pools.
* In-place OS SKU migration.

If you don't have any existing nodes to migrate to Azure Linux, skip to the [next tutorial](./tutorial-azure-linux-telemetry-monitor.md). In later tutorials, you learn how to enable telemetry and monitoring in your clusters and upgrade Azure Linux nodes.

## Prerequisites

* In previous tutorials, you created and deployed an Azure Linux Container Host for AKS cluster. To complete this tutorial, you need to add an Azure Linux node pool to your existing cluster. If you haven't done this step and would like to follow along, start with [Tutorial 2: Add an Azure Linux node pool to your existing AKS cluster](./tutorial-azure-linux-add-nodepool.md).

    > [!NOTE]
    > When adding a new Azure Linux node pool, you need to add at least one as `--mode System`. Otherwise, AKS won't allow you to delete your existing node pool.

* You need the latest version of Azure CLI. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli).

## Add Azure Linux node pools and remove existing node pools

1. Add a new Azure Linux node pool using the `az aks nodepool add` command. This command adds a new node pool to your cluster with the `--mode System` flag, which makes it a system node pool. System node pools are required for Azure Linux clusters.

    ```azurecli-interactive
    az aks nodepool add --resource-group <resource-group-name> --cluster-name <cluster-name> --name <node-pool-name> --mode System --os-sku AzureLinux
    ```

2. Remove your existing nodes using the `az aks nodepool delete` command.

    ```azurecli-interactive
    az aks nodepool delete --resource-group <resource-group-name> --cluster-name <cluster-name> --name <node-pool-name>
    ```

## In-place OS SKU migration

You can now migrate your existing Ubuntu node pools to Azure Linux by changing the OS SKU of the node pool, which rolls the cluster through the standard node image upgrade process. This new feature doesn't require the creation of new node pools.

### Limitations

There are several settings that can block the OS SKU migration request. To ensure a successful migration, review the following guidelines and limitations:

* The OS SKU migration feature isn't available through PowerShell or the Azure portal.
* The OS SKU migration feature isn't able to rename existing node pools.
* Ubuntu and Azure Linux are the only supported Linux OS SKU migration targets.
* An Ubuntu OS SKU with `UseGPUDedicatedVHD` enabled can't perform an OS SKU migration.
* An Ubuntu OS SKU with CVM 20.04 enabled can't perform an OS SKU migration.
* Node pools with Kata enabled can't perform an OS SKU migration.
* Windows OS SKU migration isn't supported.

### Prerequisites

* An existing AKS cluster with at least one Ubuntu node pool.
* We recommend that you ensure your workloads configure and run successfully on the Azure Linux container host before attempting to use the OS SKU migration feature by [deploying an Azure Linux cluster](./quickstart-azure-cli.md) in dev/prod and verifying your service remains healthy.
* Ensure the migration feature is working for you in test/dev before using the process on a production cluster.
* Ensure that your pods have enough [Pod Disruption Budget](/azure/aks/operator-best-practices-scheduler#plan-for-availability-using-pod-disruption-budgets) to allow AKS to move pods between VMs during the upgrade.
* You need Azure CLI version [2.61.0](/cli/azure/release-notes-azure-cli#may-21-2024) or higher. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli).
* If you are using Terraform, you must have [v3.111.0](https://github.com/hashicorp/terraform-provider-azurerm/releases/tag/v3.111.0) or greater of the AzureRM Terraform module. 

### [Azure CLI](#tab/azure-cli)

#### Migrate the OS SKU of your Ubuntu node pool

* Migrate the OS SKU of your node pool to Azure Linux using the `az aks nodepool update` command. This command updates the OS SKU for your node pool from Ubuntu to Azure Linux. The OS SKU change triggers an immediate upgrade operation, which takes several minutes to complete.

    ```azurecli-interactive
    az aks nodepool update --resource-group <resource-group-name> --cluster-name <cluster-name> --name <node-pool-name> --os-sku AzureLinux
    ```

    > [!NOTE]
    > If you experience issues during the OS SKU migration, you can [roll back to your previous OS SKU](#rollback).

### [ARM template](#tab/arm-template)

#### Example ARM templates

##### 0base.json

```json
 {
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "resources": [
    {
      "type": "Microsoft.ContainerService/managedClusters",
      "apiVersion": "2023-07-01",
      "name": "akstestcluster",
      "location": "[resourceGroup().location]",
      "tags": {
        "displayname": "Demo of AKS Nodepool Migration"
      },
      "identity": {
        "type": "SystemAssigned"
      },
      "properties": {
        "enableRBAC": true,
        "dnsPrefix": "testcluster",
        "agentPoolProfiles": [
          {
            "name": "testnp",
            "count": 3,
            "vmSize": "Standard_D4a_v4",
            "osType": "Linux",
            "osSku": "Ubuntu",
            "mode": "System"
          }
        ]
      }
    }
  ]
}
```

##### 1mcupdate.json

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "resources": [
    {
      "type": "Microsoft.ContainerService/managedClusters",
      "apiVersion": "2023-07-01",
      "name": "akstestcluster",
      "location": "[resourceGroup().location]",
      "tags": {
        "displayname": "Demo of AKS Nodepool Migration"
      },
      "identity": {
        "type": "SystemAssigned"
      },
      "properties": {
        "enableRBAC": true,
        "dnsPrefix": "testcluster",
        "agentPoolProfiles": [
          {
            "name": "testnp",
            "osType": "Linux",
            "osSku": "AzureLinux",
            "mode": "System"
          }
        ]
      }
    }
  ]
} 
```

##### 2apupdate.json

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "resources": [
    {
      "apiVersion": "2023-07-01",
      "type": "Microsoft.ContainerService/managedClusters/agentPools",
      "name": "akstestcluster/testnp",
      "location": "[resourceGroup().location]",
      "properties": {
        "osType": "Linux",
        "osSku": "Ubuntu",
        "mode": "System"
      }
    }
  ]
}
```

#### Deploy a test cluster

1. Create a resource group for the test cluster using the `az group create` command.

    ```azurecli-interactive
    az group create --name testRG --location eastus
    ```

2. Deploy a baseline Ubuntu OS SKU cluster with three nodes using the `az deployment group create` command and the [0base.json example ARM template](#0basejson).

    ```azurecli-interactive
    az deployment group create --resource-group testRG --template-file 0base.json
    ```

3. Migrate the OS SKU of your system node pool to Azure Linux using the `az deployment group create` command.

    ```azurecli-interactive
    az deployment group create --resource-group testRG --template-file 1mcupdate.json
    ```

4. Migrate the OS SKU of your system node pool back to Ubuntu using the `az deployment group create` command.

    ```azurecli-interactive
    az deployment group create --resource-group testRG --template-file 2apupdate.json
    ```

### [Terraform](#tab/terraform)

#### Example Terraform template

1. Confirm that your `providers.tf` file is updated to pick up the required version of the Azure provider. 

##### providers.tf

```terraform
terraform {
      required_version = ">=1.0"

      required_providers {
        azurerm = {
          source  = "hashicorp/azurerm"
          version = "~>3.111.0"
        }
        random = {
          source  = "hashicorp/random"
          version = "~>3.0"
        }
      }
    }

    provider "azurerm" {
      features {}
    }
```

2. For brevity, only the snippet of the Terraform template that is of interest is displayed below. In this initial configuration, an AKS cluster with a nodepool of **os_sku** with **Ubuntu** is deployed. 

##### base.tf

```terraform
resource "azurerm_kubernetes_cluster" "k8s" {
  location            = azurerm_resource_group.rg.location
  name                = var.cluster_name
  resource_group_name = azurerm_resource_group.rg.name
  dns_prefix          = var.dns_prefix
  tags                = {
    Environment = "Development"
  }

  default_node_pool {
    name       = "azurelinuxpool"
    vm_size    = "Standard_D2_v2"
    node_count = var.agent_count
    os_sku = "Ubuntu"
  }
  linux_profile {
    admin_username = "azurelinux"

    ssh_key {
      key_data = file(var.ssh_public_key)
    }
  }
  network_profile {
    network_plugin    = "kubenet"
    load_balancer_sku = "standard"
  }
  service_principal {
    client_id     = var.aks_service_principal_app_id
    client_secret = var.aks_service_principal_client_secret
  }
}
```

3. To run an in-place OS SKU migration, just replace the **os_sku** to **AzureLinux** and re-apply the Terraform plan. 

##### update.tf

```terraform
resource "azurerm_kubernetes_cluster" "k8s" {
  location            = azurerm_resource_group.rg.location
  name                = var.cluster_name
  resource_group_name = azurerm_resource_group.rg.name
  dns_prefix          = var.dns_prefix
  tags                = {
    Environment = "Development"
  }

  default_node_pool {
    name       = "azurelinuxpool"
    vm_size    = "Standard_D2_v2"
    node_count = var.agent_count
    os_sku = "AzureLinux"
  }
  linux_profile {
    admin_username = "azurelinux"

    ssh_key {
      key_data = file(var.ssh_public_key)
    }
  }
  network_profile {
    network_plugin    = "kubenet"
    load_balancer_sku = "standard"
  }
  service_principal {
    client_id     = var.aks_service_principal_app_id
    client_secret = var.aks_service_principal_client_secret
  }
}
```

---

### Verify the OS SKU migration

Once the migration is complete on your test clusters, you should verify the following to ensure a successful migration:

* If your migration target is Azure Linux, run the `kubectl get nodes -o wide` command. The output should show `CBL-Mariner/Linux` as your OS image and `.cm2` at the end of your kernel version.
* Run the `kubectl get pods -o wide -A` command to verify that all of your pods and daemonsets are running on the new node pool.
* Run the `kubectl get nodes --show-labels` command to verify that all of the node labels in your upgraded node pool are what you expect.

> [!TIP]
> We recommend monitoring the health of your service for a couple weeks before migrating your production clusters.

### Run the OS SKU migration on your production clusters

1. Update your existing templates to set `OSSKU=AzureLinux`. In ARM templates, you use `"OSSKU: "AzureLinux"` in the `agentPoolProfile` section. In Bicep, you use `osSku: "AzureLinux"` in the `agentPoolProfile` section. Lastly, for Terraform, you use `"os_sku = "AzureLinux"` in the `default_node_pool` section. Make sure that your `apiVersion` is set to `2023-07-01` or later.
2. Redeploy your ARM, Bicep, or Terraform template for the cluster to apply the new `OSSKU` setting. During this deploy, your cluster behaves as if it's taking a node image upgrade. Your cluster surges capacity, and then reboots your existing nodes one by one into the latest AKS image from your new OS SKU.

### Rollback

If you experience issues during the OS SKU migration, you can roll back to your previous OS SKU. To do this, you need to change the OS SKU field in your template and resubmit the deployment, which triggers another upgrade operation and restores the node pool to its previous OS SKU.

* Roll back to your previous OS SKU using the `az aks nodepool update` command. This command updates the OS SKU for your node pool from Azure Linux back to Ubuntu.

    ```azurecli-interactive
    az aks nodepool update --resource-group myResourceGroup --cluster-name myAKSCluster --name mynodepool --os-sku Ubuntu
    ```

## Next steps

In this tutorial, you migrated existing nodes to Azure Linux using one of the following methods:

* Remove existing node pools and add new Azure Linux node pools.
* In-place OS SKU migration.

In the next tutorial, you learn how to enable telemetry to monitor your clusters.

> [!div class="nextstepaction"]
> [Enable telemetry and monitoring](./tutorial-azure-linux-telemetry-monitor.md)
