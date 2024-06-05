---
title: Quickstart - Configure backup for an Azure Kubernetes Service (AKS) cluster using Azure Backup via Terraform
description: Learn how to quickly configure backup for a Kubernetes cluster using Terraform.
ms.service: backup
ms.topic: quickstart
ms.date: 05/31/2024
ms.custom: devx-track-terraform, devx-track-extended-azdevcli
ms.reviewer: rajats
ms.author: v-abhmallick
author: AbhishekMallick-MS
content_well_notification: 
 - AI-contribution
#Customer intent: As a developer or backup operator, I want to quickly configure backup for an Azure Kubernetes Cluster using Azure Backup for AKS.
---

# Quickstart: Configure backup for an Azure Kubernetes Service (AKS) cluster using Terraform

This quickstart describes how to configure backup for an Azure Kubernetes Service (AKS) cluster using Terraform.

Azure Backup for AKS is a cloud-native, enterprise-ready, application-centric backup service that lets you quickly configure backup for AKS clusters.

>[!NOTE]
>Steps included in this article on how to deploy a cluster and protect it with AKS Backup are for evaluation purposes only.
>
>Before deploying a production-ready cluster and utilize advance backup settings, we recommend that you familiarize yourself with our [baseline reference architecture](/azure/architecture/reference-architectures/containers/aks/baseline-aks) to consider how it aligns with your business requirements.

## Prerequisites

Things to ensure before you configure AKS backup:

* This quickstart assumes a basic understanding of Kubernetes concepts. For more information, see [Kubernetes core concepts for Azure Kubernetes Service (AKS)][kubernetes-concepts].

* You need an Azure account with an active subscription. If you don't have one, [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* [Install and configure Terraform](/azure/developer/terraform/quickstart-configure).

* [Download kubectl](https://kubernetes.io/releases/download/).

* [Create a random value for the Azure resource group name](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/pet) using random_pet.

* [Create an Azure resource group](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/resource_group) using azurerm_resource_group.

* [Access the configuration of the AzureRM provider to get the Azure Object ID](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/data-sources/client_config) using `azurerm_client_config`.

* [Create a Kubernetes cluster](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/kubernetes_cluster) using `azurerm_kubernetes_cluster`.

* [Create an AzAPI resource](https://registry.terraform.io/providers/Azure/azapi/latest/docs/resources/azapi_resource) using `azapi_resource`.

* [Create a Storage Account](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/storage_account) using `azurerm_storage_account`.

* [Create a Blob Container](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/storage_container) using `azurerm_storage_container`.

* [Install Backup Extension in the AKS cluster](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/kubernetes_cluster_extension) using `azurerm_kubernetes_c`luster_extension`.

* [Create a Backup Vault](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/data-sources/data_protection_backup_vault) using `azurerm_data_protection_backup_vault`.

* [Create a Backup Policy for AKS cluster](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/data_protection_backup_policy_kubernetes_cluster) using `azurerm_data_protection_backup_vault`.

* [Enable Trusted Access between AKS cluster and Backup vault](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/kubernetes_cluster_trusted_access_role_binding) using `azurerm_kubernetes_cluster_trusted_access_role_binding`.

* [Enable Role Assignments](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/role_assignment) using `azurerm_role_assignment`.

* [Configure Backup for an AKS Cluster](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/data_protection_backup_instance_kubernetes_cluster) using `azurerm_data_protection_backup_policy_kubernetes_cluster`.


## Log in to Azure account

Log in to your Azure account and authenticate using one of the following methods:

[!INCLUDE [authenticate-to-azure.md](~/azure-dev-docs-pr/articles/terraform/includes/authenticate-to-azure.md)]

## Implement the Terraform code

To implement the Terraform code for AKS backup flow, run the following scripts:

>[!NOTE]
>Learn more [how to use Terraform sample codes to manage Azure resources](/azure/terraform).

1. Create a directory you can use to test the sample Terraform code, and make it your current directory.

2. Create a file named `providers.tf` and insert the following code:

    ```code-terraform
    terraform {
      required_providers {
        azurerm = {
          source = "hashicorp/azurerm"
          version = "3.99.0"
        }
      }
    }

    provider "azurerm" {
       features {}
       subscription_id   = "<azure_subscription_id>"
       tenant_id = "<azure_subscription_tenant_id>"
    }
    ```

3. Create a file named `main.tf` and insert the following code:

    ```code-terraform
     #Get Subscription and Tenant Id from Config
 
    data "azurerm_client_config" "current" {
    }

    #Create a Resource Group where Backup Vault and AKS Cluster will be created
    resource "azurerm_resource_group" "rg" {
      location = var.resource_group_location
      name     = var.resource_group_name
    }

    #Create a Resource Group where Storage Account and Snapshots related to backup will be created
    resource "azurerm_resource_group" "backuprg" {
      location = var.backup_resource_group_location
      name = var.backup_resource_group_name
    }
 
    #Create an AKS Cluster 
    resource "azurerm_kubernetes_cluster" "akscluster" {
      resource_group_name = azurerm_resource_group.rg.name
      name           = var.aks_cluster_name
      location       = azurerm_resource_group.rg.location
      dns_prefix     = var.dns_prefix

      identity {
        type = "SystemAssigned"
      }

      default_node_pool {
        name       = "agentpool"
        vm_size    = "Standard_D2_v2"
        node_count = var.node_count
      }

      network_profile {
        network_plugin    = "kubenet"
        load_balancer_sku = "standard"
      }

      depends_on = [azurerm_resource_group.rg,azurerm_resource_group.backuprg]
    }

    #Create a Backup Vault
    resource "azurerm_data_protection_backup_vault" "backupvault" {
      name                = var.backupvault_name
      resource_group_name = resource.azurerm_resource_group.rg.name
      location            = resource.azurerm_resource_group.rg.location
      datastore_type      = var.datastore_type
      redundancy          = var.redundancy

      identity {
        type = "SystemAssigned"
      }
      depends_on = [azurerm_kubernetes_cluster.akscluster]
    }

    #Create a Backup Policy with 4 hourly backups and 7 day retention duration
    resource "azurerm_data_protection_backup_policy_kubernetes_cluster" "policy" {
      name                = var.backuppolicy_name
      resource_group_name = var.resource_group_name
      vault_name          = var.backupvault_name

      backup_repeating_time_intervals = ["R/2024-04-14T06:33:16+00:00/PT4H"]
      default_retention_rule {
        life_cycle {
          duration        = "P7D"
          data_store_type = "OperationalStore"
        }
      }
    depends_on = [resource.azurerm_data_protection_backup_vault.backupvault]
    }

    #Create a Trusted Access Role Binding between AKS Cluster and Backup Vault
    resource "azurerm_kubernetes_cluster_trusted_access_role_binding" "trustedaccess" {
      kubernetes_cluster_id = azurerm_kubernetes_cluster.akscluster.id
      name                  = "backuptrustedaccess"
      roles                 = ["Microsoft.DataProtection/backupVaults/backup-operator"]
      source_resource_id    = azurerm_data_protection_backup_vault.backupvault.id
      depends_on = [resource.azurerm_data_protection_backup_vault.backupvault, azurerm_kubernetes_cluster.akscluster]
    }

    #Create a Backup Storage Account provided in input for Backup Extension Installation
    resource "azurerm_storage_account" "backupsa" {
      name                     = "tfaksbackup1604"
      resource_group_name      = azurerm_resource_group.backuprg.name
      location                 = azurerm_resource_group.backuprg.location
      account_tier             = "Standard"
      account_replication_type = "LRS"
      depends_on = [azurerm_kubernetes_cluster_trusted_access_role_binding.trustedaccess]
    }

    #Create a Blob Container where backup items will stored
    resource "azurerm_storage_container" "backupcontainer" {
      name                  = "tfbackup"
      storage_account_name  = azurerm_storage_account.backupsa.name
      container_access_type = "private"
      depends_on = [azurerm_storage_account.backupsa]
    }

    #Create Backup Extension in AKS Cluster
    resource "azurerm_kubernetes_cluster_extension" "dataprotection" {
      name = var.backup_extension_name
      cluster_id = azurerm_kubernetes_cluster.akscluster.id
      extension_type = var.backup_extension_type
      configuration_settings = {
        "configuration.backupStorageLocation.bucket" = azurerm_storage_container.backupcontainer.name
         "configuration.backupStorageLocation.config.storageAccount" = azurerm_storage_account.backupsa.name
         "configuration.backupStorageLocation.config.resourceGroup" = azurerm_storage_account.backupsa.resource_group_name
         "configuration.backupStorageLocation.config.subscriptionId" =  data.azurerm_client_config.current.subscription_id
         "credentials.tenantId" = data.azurerm_client_config.current.tenant_id
        }
      depends_on = [azurerm_storage_container.backupcontainer]
    }

    #Assign Role to Extension Identity over Storage Account
    resource "azurerm_role_assignment" "extensionrole" {
      scope                = azurerm_storage_account.backupsa.id
      role_definition_name = "Storage Blob Data Contributor"
      principal_id         = azurerm_kubernetes_cluster_extension.dataprotection.aks_assigned_identity[0].principal_id
      depends_on = [azurerm_kubernetes_cluster_extension.dataprotection]
    }

    #Assign Role to Backup Vault over AKS Cluster
    resource "azurerm_role_assignment" "vault_msi_read_on_cluster" {
      scope                = azurerm_kubernetes_cluster.akscluster.id
      role_definition_name = "Reader"
      principal_id         = azurerm_data_protection_backup_vault.backupvault.identity[0].principal_id
      depends_on = [azurerm_kubernetes_cluster.akscluster,resource.azurerm_data_protection_backup_vault.backupvault]
    }

    #Assign Role to Backup Vault over Snapshot Resource Group
    resource "azurerm_role_assignment" "vault_msi_read_on_snap_rg" {
      scope                = azurerm_resource_group.backuprg.id
      role_definition_name = "Reader"
      principal_id         = azurerm_data_protection_backup_vault.backupvault.identity[0].principal_id
      depends_on = [azurerm_kubernetes_cluster.akscluster,resource.azurerm_data_protection_backup_vault.backupvault]
    }

    #Assign Role to AKS Cluster over Snapshot Resource Group
    resource "azurerm_role_assignment" "cluster_msi_contributor_on_snap_rg" {
      scope                = azurerm_resource_group.backuprg.id
      role_definition_name = "Contributor"
      principal_id         = try(azurerm_kubernetes_cluster.akscluster.identity[0].principal_id,null)
      depends_on = [azurerm_kubernetes_cluster.akscluster,resource.azurerm_kubernetes_cluster.akscluster,resource.azurerm_resource_group.backuprg]
    }

    #Create Backup Instance for AKS Cluster
    resource "azurerm_data_protection_backup_instance_kubernetes_cluster" "akstfbi" {
      name                         = "example"
      location                     = azurerm_resource_group.backuprg.location
      vault_id                     = azurerm_data_protection_backup_vault.backupvault.id
      kubernetes_cluster_id        = azurerm_kubernetes_cluster.akscluster.id
      snapshot_resource_group_name = azurerm_resource_group.backuprg.name
      backup_policy_id             = azurerm_data_protection_backup_policy_kubernetes_cluster.policy.id

      backup_datasource_parameters {
        excluded_namespaces              = []
        excluded_resource_types          = []
        cluster_scoped_resources_enabled = true
        included_namespaces              = []
        included_resource_types          = []
        label_selectors                  = []
        volume_snapshot_enabled          = true
      }

      depends_on = [
        resource.azurerm_data_protection_backup_vault.backupvault,
        azurerm_data_protection_backup_policy_kubernetes_cluster.policy,
        azurerm_role_assignment.extensionrole,
        azurerm_role_assignment.vault_msi_read_on_cluster,
        azurerm_role_assignment.vault_msi_read_on_snap_rg,
        azurerm_role_assignment.cluster_msi_contributor_on_snap_rg
      ]
    }
    ```    


4. Create a file named `variables.tf` and insert the following code:

    ```code-terraform
    variable "aks_cluster_name" {
      type        = string
      default     = "Contoso_AKS_TF"
      description = "Name of the AKS Cluster."
    }

    variable "backup_extension_name" {
      type        = string
      default     = "azure-aks-backup"
      description = "Name of the AKS Cluster Extension."
    }

    variable "backup_extension_type" {
      type        = string
      default     = "microsoft.dataprotection.kubernetes"
      description = "Type of the AKS Cluster Extension."
    }

    variable "dns_prefix" {
      type        = string
      default     = "contoso-aks-dns-tf"
      description = "DNS Name of AKS Cluster made with Terraform"
    }

    variable "node_count" {
      type        = number
      description = "The initial quantity of nodes for the node pool."
      default     = 3
    }

    variable "resource_group_location" {
      type        = string
      default     = "eastus"
      description = "Location of the resource group."
    }

    variable "backup_resource_group_name" {
      type        = string
      default     = "Contoso_TF_Backup_RG"
      description = "Location of the resource group."
    }

    variable "backup_resource_group_location" {
      type        = string
      default     = "eastus"
      description = "Location of the resource group."
    }

    variable "resource_group_name" {
      type        = string
      default     = "Contoso_TF_RG"
      description = "Location of the resource group."
    }

    variable "cluster_id" {
      type        = string
      default     = "/subscriptions/c3d3eb0c-9ba7-4d4c-828e-cb6874714034/resourceGroups/Contoso_TF_RG/providers/Microsoft.ContainerService/managedClusters/Contoso_AKS_TF"
      description = "Location of the resource group."
    }

    variable "backupvault_name" {
      type        = string
      default     = "BackupVaultTF"
      description = "Name of the Backup Vault"
    }

    variable "datastore_type" {
      type        = string
      default     = "OperationalStore"
    }

    variable "redundancy" {
      type        = string
      default     = "LocallyRedundant"
    }

    variable "backuppolicy_name" {
      type        = string
      default     = "aksbackuppolicytfv1"
    }
    ```
5. Create a file named `outputs.tf` and insert the following code:

   ```code-terraform
    output "aks_resource_group" {
      value = azurerm_resource_group.rg.name
    }

    output "snapshot_resource_group" {
      value = azurerm_resource_group.backuprg.name
    }

    output "kubernetes_cluster_name" {
      value = azurerm_kubernetes_cluster.akscluster.name
    }

    output "backup_vault_name" {
      value = azurerm_data_protection_backup_vault.backupvault.name
    }

    output "backup_instance_id" {
      value = azurerm_data_protection_backup_instance_kubernetes_cluster.akstfbi.id
    }
   ```
## Initialize Terraform

[!INCLUDE [terraform-init.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-init.md)]

## Create a Terraform execution plan

[!INCLUDE [terraform-plan.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-plan.md)]

## Apply a Terraform execution plan

[!INCLUDE [terraform-apply-plan.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-apply-plan.md)]

## Troubleshoot Terraform on Azure

When you use Terraform on Azure, you can encounter common issues. Learn   [how to troubleshoot](/azure/developer/terraform/troubleshoot).

## Next step

In this quickstart, you learned how to deploy a Kubernetes cluster, create a Backup vault, and configure backup for the Kubernetes cluster.

Learn more about:

> [!div class="nextstepaction"]
> [Overview of AKS backup](azure-kubernetes-service-backup-overview.md).
> [How to use Azure Backup for AKS.][aks-home]

<!-- LINKS - internal -->
[aks-home]: /azure/aks

