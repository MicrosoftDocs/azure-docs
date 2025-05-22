---
title: Quickstart - Configure vaulted backup for Azure Files using Azure Terraform
description: Learn how to configure vaulted backup for Azure Files using Azure Terraform.
ms.devlang: azurecli
ms.custom:
  - ignite-2024
ms.topic: quickstart
ms.date: 05/22/2025
ms.service: azure-backup
author: jyothisuri
ms.author: jsuri
---

#  Quickstart: Configure vaulted backup for Azure Files using Azure Terraform

This quickstart describes how to configure vaulted backup for Azure Files using Azure Terraform template.

[Azure Backup](backup-overview.md) supports configuring [snapshot](azure-file-share-backup-overview.md?tabs=snapshot) and [vaulted](azure-file-share-backup-overview.md?tabs=vault-standard) backups for Azure Files in your storage accounts. Vaulted backup offers an offsite solution, storing data in a general v2 storage account to protect against ransomware and malicious admin actions.

[Terraform](https://www.terraform.io/) enables the definition, preview, and deployment of cloud infrastructure.

## Prerequisites

Before you configure vaulted backup for Azure Files, ensure that  the following prerequisites are met:

- Use an Azure account with an active subscription. If you don't have one, [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Install and configure Terraform](/azure/developer/terraform/quickstart-configure).

## Log in to Azure account

Log in to your Azure account and authenticate using one of these clients - Azure CLI or Azure PowerShell.

Terraform supports Azure authentication only with the Azure CLI, not Azure PowerShell. You must first [authenticate to Azure](/azure/developer/terraform/authenticate-to-azure) before using the Azure PowerShell module for your Terraform tasks.

## Implement the Terraform code
Before you implement the Terraform code, learn how to [use Terraform sample codes to manage Azure resources](/azure/terraform).

To implement the Terraform code for File Share backup flow, run the following scripts:

1. Create a directory that you can use to test the sample Terraform code and make it your current directory.
2. Create a file named **providers.tf** and add the following code:
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

3. Create a file named **main.tf** and add the following code:

    ```code-terraform
    Get Subscription and Tenant Id from Config

    data "azurerm_client_config" "current" {
    }

    ## Create a Resource Group for Storage and vault
    resource "azurerm_resource_group" "rg" {
      location = var.resource_group_location
      name     = var.resource_group_name
    }

    ## Azure Recovery Services vault
    resource "azurerm_recovery_services_vault" "vault" {
      name                = var.vault_name
      location            = azurerm_resource_group.rg.location
      resource_group_name      = azurerm_resource_group.rg.name
      sku                 = "Standard"
      depends_on = [azurerm_resource_group.rg]
    }

    # generate a random string (consisting of four characters)
    # https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/string
    resource "random_string" "random" {
      length  = 4
      upper   = false
      special = false
    }

    ## Create a File Storage Account 
    resource "azurerm_storage_account" "storage" {
      name                     = "stor${random_string.random.id}"
      resource_group_name      = azurerm_resource_group.rg.name
      location                 = azurerm_resource_group.rg.location
      account_tier             = "Standard"
      account_replication_type = "LRS"
      depends_on = [azurerm_resource_group.rg]
    }

    ## Create a File Share 
    resource "azurerm_storage_share" "fsshare" {
      name                 = var.FS_name
      storage_account_name = azurerm_storage_account.storage.name
    quota                = 1
      depends_on           = [azurerm_storage_account.storage]
    }

    resource "azurerm_backup_container_storage_account" "protection-container" {
      resource_group_name = azurerm_resource_group.rg.name
      recovery_vault_name = azurerm_recovery_services_vault.vault.name
      storage_account_id  = azurerm_storage_account.storage.id
    }

    resource "azurerm_backup_policy_file_share" "example" {
      name                = var.FSPol_name
      resource_group_name = azurerm_resource_group.rg.name
      recovery_vault_name = azurerm_recovery_services_vault.vault.name

      backup {
        frequency = "Daily"
        time      = "23:00"
      }

      retention_daily {
        count = 10
      }
    }

    resource "azurerm_backup_protected_file_share" "share1" {
      resource_group_name       = azurerm_resource_group.rg.name
      recovery_vault_name       = azurerm_recovery_services_vault.vault.name
      source_storage_account_id = azurerm_backup_container_storage_account.protection-container.storage_account_id
      source_file_share_name    = azurerm_storage_share.fsshare.name
      backup_policy_id          = azurerm_backup_policy_file_share.example.id
    }

    ```

4. Create a file named **variables.tf** and add the following code:

    ```code-terraform
    variable "resource_group_name" {
      type        = string
      default     = "Contoso_TF_RG"
      description = "Name of the resource group."
    }

    variable "resource_group_location" {
      type        = string
      default     = "eastus"
      description = "Location of the resource group."
    }

    variable "vault_name" {
      type        = string
      default     = "Contoso-RSV"
      description = "Name of the Recovery services vault."
    }

    variable "FS_name" {
      type        = string
      default     = "fs01"
      description = "Name of the Storage Account."
    }

    variable "FSPol_name" {
      type        = string
      default     = "AFS-Policy"
      description = "Name of the Storage Account."

    ```

5. Create a file named **outputs.tf** and add the following code:

    ```code-terraform
    output "resource_group" {
      value = azurerm_resource_group.rg.name
    }

    output "location" {
      description = "The Azure region"
      value       = azurerm_resource_group.rg.location
    }

    output "storage_account" {
      description = "Storage account for Profiles"
      value       = azurerm_storage_account.storage.name
    }

    output "storage_account_share" {
      description = "Name of the Azure File Share created"
      value       = azurerm_storage_share.fsshare.name
    }

    output "backup_instance_id" {
      description = "backup instance"
      value       = azurerm_backup_protected_file_share.share1.id
    }

    ```

## Initialize Terraform

To initialize the Terraform deployment, run the [`terraform init`](https://www.terraform.io/docs/commands/init.html) command. 

This command downloads the Azure provider required to manage your Azure resources.

```Console
terraform init -upgrade
```

The `-upgrade` parameter upgrades the necessary provider plugins to the newest version that complies with the configuration's version constraints.

## Create a Terraform execution plan

To create an execution plan, run the [terraform plan](https://www.terraform.io/docs/commands/plan.html) command.

```Console
terraform plan -out main.tfplan
```

**Key points**:

- The `terraform plan` command creates an execution plan without executing it, allowing you to verify the actions needed to match your configuration before making changes.

- The `-out` parameter specifies an output file for the plan, ensuring the reviewed plan is applied.

## Apply a Terraform execution plan

To apply the execution plan to your cloud infrastructure, run the [`terraform apply`](https://www.terraform.io/docs/commands/apply.html) command.

```Console
terraform apply main.tfplan
```

**Key points**:

- The example `terraform apply` command assumes you've previously run terraform plan `-out main.tfplan`.
- If you used a different filename for the `-out` parameter, use that filename in the `terraform apply` command.
- If you didn't use the `-out` parameter, run `terraform apply`.

## Troubleshoot Terraform on Azure

If you encounter issues while using Terraform on Azure, see the [troubleshooting guide](/azure/developer/terraform/troubleshoot).

## Next steps

- [Restore Azure Files using Azure portal](restore-afs.md).
- Restore Azure Files using [Azure PowerShell](restore-afs-powershell.md), [Azure CLI](restore-afs-cli.md), [REST API](restore-azure-file-share-rest-api.md).
- Manage Azure Files backups using [Azure portal](manage-afs-backup.md), [Azure PowerShell](manage-afs-powershell.md), [Azure CLI](manage-afs-backup-cli.md), [REST API](manage-azure-file-share-rest-api.md).