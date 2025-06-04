---
title: Quickstart - Configure backup for Azure Database for PostgreSQL - Flexible Server using a Terraform template
description: Learn how to configure backup for Azure Database for PostgreSQL - Flexible Server with a Terraform template.
ms.devlang: terraform
ms.custom:
  - ignite-2024
ms.topic: quickstart
ms.date: 02/18/2025
ms.service: azure-backup
author: jyothisuri
ms.author: jsuri
# Customer intent: "As a database administrator, I want to configure automated backups for Azure Database for PostgreSQL - Flexible Server using a Terraform template, so that I can ensure data protection and streamline management of backup policies."
---

#  Quickstart: Configure backup for Azure Database for PostgreSQL - Flexible Server using a Terraform template

This quickstart describes how to configure backup for the Azure Database for PostgreSQL - Flexible Server using the Terraform template. 

[Azure Backup](backup-azure-database-postgresql-flex-overview.md) allows you to back up your Azure PostgreSQL - Flexible servers using multiple clients, such as Azure portal, PowerShell, CLI, Azure Resource Manager, Bicep, and so on.

## Prerequisites

Before you configure backup for Azure Database for PostgreSQL - Flexible Server, ensure that the following prerequisites are met:

* You need an Azure account with an active subscription. If you don't have one, [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* [Install and configure Terraform](/azure/developer/terraform/quickstart-configure).

* Sign in to your Azure account and [authenticate to Azure](/azure/developer/terraform/authenticate-to-azure). 

  >[!Note]
  >Terraform only supports authenticating to Azure with the Azure CLI. Authenticating using Azure PowerShell isn't supported. Therefore, while you can use the Azure PowerShell module when doing your Terraform work, you first need to authenticate to Azure.

## Implement the Terraform code

> [!NOTE]
> See more [articles and sample code showing how to use Terraform to manage Azure resources](/azure/terraform).

1. Create a directory you can use to test the sample Terraform code and make it your current directory.

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

    # Step 1: Create the Backup Vault
    resource "azurerm_data_protection_backup_vault" "backup_vault" {
      name                = var.backup_vault_name
      resource_group_name = var.backup_vault_resource_group
      location            = var.region

      identity {
        type = "SystemAssigned"
      }

      storage_settings {
        datastore_type = "VaultStore"
        type           = "LocallyRedundant"
      }
    }

    # Step 2: Create Backup Policy for PostgreSQL
    resource "azurerm_data_protection_backup_policy" "postgresql_backup_policy" {
      name                = var.policy_name
      resource_group_name = var.backup_vault_resource_group
      vault_name          = azurerm_data_protection_backup_vault.backup_vault.name

      rule {
        name = "BackupSchedule"

        backup_parameters {
          object_type = "AzureBackupParams"
        }

        trigger {
          schedule {
            recurrence_rule {
              frequency = "Weekly"
              interval  = var.backup_schedule_frequency
            }
          }
        }

        data_store {
          datastore_type = "VaultStore"
        }
      }

      retention_rule {
        name       = "RetentionRule"
        is_default = true

        lifecycle {
          delete_after {
            object_type = "AbsoluteDeleteOption"
            duration    = format("P%dM", var.retention_duration_in_months)
          }
        }
      }

      depends_on = [
        azurerm_data_protection_backup_vault.backup_vault
      ]
    }

    # Step 3: Role Assignment for PostgreSQL Flexible Server Long Term Retention Backup Role
    data "azurerm_postgresql_flexible_server" "postgresql_server" {
      name                = var.postgresql_server_name
      resource_group_name = var.postgresql_resource_group
    }

    resource "azurerm_role_assignment" "backup_role" {
      principal_id         = azurerm_data_protection_backup_vault.backup_vault.identity[0].principal_id
      role_definition_name = "PostgreSQL Flexible Server Long Term Retention Backup Role"
      scope                = data.azurerm_postgresql_flexible_server.PostgreSQL_server.id

      depends_on = [
        azurerm_data_protection_backup_policy.postgresql_backup_policy
      ]
    }

    # Step 4: Role Assignment for Reader on Resource Group
    data "azurerm_resource_group" "postgresql_resource_group" {
      name = var.postgresql_resource_group
    }

    resource "azurerm_role_assignment" "reader_role" {
      principal_id         = azurerm_data_protection_backup_vault.backup_vault.identity[0].principal_id
      role_definition_name = "Reader"
      scope                = data.azurerm_resource_group.postgresql_resource_group.id

      depends_on = [
        azurerm_role_assignment.backup_role
      ]
    }

    # Step 5: Create Backup Instance for PostgreSQL
    resource "azurerm_data_protection_backup_instance" "postgresql_backup_instance" {
      name                = "PostgreSQLBackupInstance"
      resource_group_name = var.backup_vault_resource_group
      vault_name          = azurerm_data_protection_backup_vault.backup_vault.name
      location            = var.region

      datasource {
        object_type     = "Datasource"
        datasource_type = "AzureDatabaseForPostgreSQLFlexibleServer"
        resource_id     = data.azurerm_PostgreSQL_flexible_server.postgresql_server.id
      }

      policy_id = azurerm_data_protection_backup_policy.postgresql_backup_policy.id

      depends_on = [
        azurerm_role_assignment.reader_role
      ]
    }

    ```

4. Create a file named `variables.tf` and insert the following code:

```code-terraform

variable "backup_vault_name" {
      type        = string
      default     = "BackupVaultTF"
      description = "Name of the Backup Vault"
}
variable "backup_vault_resource_group" {
      type        = string
      default     = "Contoso_TF_RG"
      description = "Name of the resource group to which backup vault belongs to"
}

variable "postgresql_server_name" {
      type        = string
      default     = "Contoso_PostgreSQL_TF"
      description = "Name of the PostgreSQL server"
}

variable "postgresql_resource_group" {
      type        = string
      default     = "Contoso_TF_RG"
      description = "Name of the resource group to which PostgreSQL server belongs to"
}

variable "region" {
      type        = string
      default     = "eastus"
      description = "Location of the PostgreSQL server"
}

variable "policy_name" {
      type        = string
      default     = "PostgreSQLbackuppolicytfv1"
      description = "Name of the backup policy"
}

variable "backup_schedule_frequency" {
      type        = string
      default     = "1"
      description = "Schedule frequency for backup"
}
variable "retention_duration_in_months" {
      type        = string
      default     = "3"
      description = "Retention duration for backup in month"
}

```


## Initialize Terraform

[!INCLUDE [terraform-init.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-init.md)]

## Create a Terraform execution plan

[!INCLUDE [terraform-plan.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-plan.md)]

## Apply a Terraform execution plan

[!INCLUDE [terraform-apply-plan.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-apply-plan.md)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](/azure/developer/terraform/troubleshoot).


## Next steps

[Restore Azure Database for PostgreSQL - Flexible server using Azure CLI](backup-azure-database-postgresql-flex-restore-cli.md).

