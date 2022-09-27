---
title: Quickstart - Use Terraform to create a DPS instance
description: Learn how to deploy an Azure IoT Device Provisioning Service (DPS) resource with Terraform in this quickstart.
keywords: azure, devops, terraform, device provisioning service, DPS, IoT, IoT Hub DPS
ms.topic: quickstart
ms.date: 09/27/2022
ms.custom: devx-track-terraform
author: kgremban
ms.author: kgremban
ms.service: iot-dps
services: iot-dps
---

# Quickstart: Use Terraform to create an Azure IoT Device Provisioning Service

In this quickstart, you will learn how to deploy an Azure IoT Hub Device Provisioning Service (DPS) resource with a hashed allocation policy using Terraform.

This quickstart was tested with the following Terraform and Terraform provider versions:

- [Terraform v1.2.8](https://releases.hashicorp.com/terraform/)
- [AzureRM Provider v.3.20.0](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs)

[Terraform](https://www.terraform.io/) enables the definition, preview, and deployment of cloud infrastructure. Using Terraform, you create configuration files using HCL syntax. The [HCL syntax](https://www.terraform.io/language/syntax/configuration) allows you to specify the cloud provider - such as Azure - and the elements that make up your cloud infrastructure. After you create your configuration files, you create an execution plan that allows you to preview your infrastructure changes before they're deployed. Once you verify the changes, you apply the execution plan to deploy the infrastructure.

In this article, you learn how to:

- Create a Storage Account & Storage Container
- Create an Event Hub, Namespace, & Authorization Rule
- Create an IoT Hub
- Link IoT Hub to Storage Account endpoint & Event Hub endpoint
- Create an IoT Hub Shared Access Policy
- Create a DPS Resource
- Link DPS & IoT Hub

## Prerequisites

- **Azure subscription**: If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- [Install and configure Terraform](/azure/developer/terraform/quickstart-configure)

> [!NOTE]
> The example code in this article is located in the [Azure Terraform GitHub repo](https://github.com/Azure/terraform/tree/master/). See more [articles and sample code showing how to use Terraform to manage Azure resources](/azure/developer/terraform/)

## Implement the Terraform code

1. Create a directory in which to test and run the sample Terraform code and make it the current directory.

1. Create a file named `providers.tf` and insert the following code:

    [!code-terraform[master](<!-- ~/terraform_samples/<path-to-file>/providers.tf-->)]

   ```terraform
   terraform {
     required_version = ">=0.12"

     required_providers {
       azurerm = {
         source  = "hashicorp/azurerm"
         version = "~>2.0"
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

1. Create a file named `main.tf` and insert the following code:

    [!code-terraform[master](<!-- ~/terraform_samples/<path-to-file>/main.tf-->)]

   ```terraform
   resource "random_pet" "rg_name" {
     prefix = var.resource_group_name_prefix
   }

   resource "azurerm_resource_group" "rg" {
     location = var.resource_group_location
     name     = random_pet.rg_name.id
   }

   # Create storage account & container
   resource "random_string" "sa_name" {
     length = 12
     special = false
     upper = false
   }

   resource "azurerm_storage_account" "sa" {
     name                     = random_string.sa_name.id
     resource_group_name      = azurerm_resource_group.rg.name
     location                 = azurerm_resource_group.rg.location
     account_tier             = "Standard"
     account_replication_type = "LRS"
   }

   resource "azurerm_storage_container" "my_terraform_container" {
     name                  = "mycontainer"
     storage_account_name  = azurerm_storage_account.sa.name
     container_access_type = "private"
   }


   # Create an Event Hub & Authorization Rule
   resource "random_pet" "eventhubnamespace_name" {
     prefix = var.eventhub_namespace_name_prefix
   }

   resource "azurerm_eventhub_namespace" "namespace" {
     name                = random_pet.eventhubnamespace_name.id
     resource_group_name = azurerm_resource_group.rg.name
     location            = azurerm_resource_group.rg.location
     sku                 = "Basic"
   }

   resource "azurerm_eventhub" "my_terraform_eventhub" {
     name                = "myEventHub"
     resource_group_name = azurerm_resource_group.rg.name
     namespace_name      = azurerm_eventhub_namespace.namespace.name
     partition_count     = 2
     message_retention   = 1
   }

   resource "azurerm_eventhub_authorization_rule" "my_terraform_authorization_rule" {
     resource_group_name = azurerm_resource_group.rg.name
     namespace_name      = azurerm_eventhub_namespace.namespace.name
     eventhub_name       = azurerm_eventhub.my_terraform_eventhub.name
     name                = "acctest"
     send                = true
   }


   # Create an IoT Hub
   resource "random_pet" "iothub_name" {
     prefix = var.iothub_name_prefix
     length = 1
   }

   resource "azurerm_iothub" "iothub" {
     name                = random_pet.iothub_name.id
     resource_group_name = azurerm_resource_group.rg.name
     location            = azurerm_resource_group.rg.location

     sku {
       name     = "S1"
       capacity = "1"
     }

     endpoint {
       type                       = "AzureIotHub.StorageContainer"
       connection_string          = azurerm_storage_account.sa.primary_blob_connection_string
       name                       = "export"
       batch_frequency_in_seconds = 60
       max_chunk_size_in_bytes    = 10485760
       container_name             = azurerm_storage_container.my_terraform_container.name
       encoding                   = "Avro"
      file_name_format           = "{iothub}/{partition}_{YYYY}_{MM}_{DD}_{HH}_{mm}"
     }

     endpoint {
       type              = "AzureIotHub.EventHub"
       connection_string = azurerm_eventhub_authorization_rule.my_terraform_authorization_rule.primary_connection_string
       name              = "export2"
     }

     route {
       name           = "export"
       source         = "DeviceMessages"
       condition      = "true"
       endpoint_names = ["export"]
       enabled        = true
     }

     route {
       name           = "export2"
       source         = "DeviceMessages"
       condition      = "true"
       endpoint_names = ["export2"]
       enabled        = true
     }

     enrichment {
       key            = "tenant"
       value          = "$twin.tags.Tenant"
       endpoint_names = ["export", "export2"]
     }

     cloud_to_device {
       max_delivery_count = 30
       default_ttl        = "PT1H"
       feedback {
         time_to_live       = "PT1H10M"
         max_delivery_count = 15
         lock_duration      = "PT30S"
       }
     }

     tags = {
       purpose = "testing"
     }
   }

   #Create IoT Hub Access Policy
   resource "azurerm_iothub_shared_access_policy" "hubaccesspolicy" {
     name                = "terraform-policy"
     resource_group_name = azurerm_resource_group.rg.name
     iothub_name         = azurerm_iothub.iothub.name

     registry_read  = true
     registry_write = true
     service_connect = true
   }

   # Create IoT Hub DPS
   resource "random_pet" "dps_name" {
     prefix = var.dps_name_prefix
     length = 1
   }

   resource "azurerm_iothub_dps" "dps" {
     name                = random_pet.dps_name.id
     resource_group_name = azurerm_resource_group.rg.name
     location            = azurerm_resource_group.rg.location
     allocation_policy   = "Hashed"

     sku {
       name     = "S1"
       capacity = "1"
     }

     linked_hub {
       connection_string       = azurerm_iothub_shared_access_policy.hubaccesspolicy.primary_connection_string
       location                = azurerm_resource_group.rg.location
       allocation_weight       = 150
       apply_allocation_policy = true
     }
   }
   ```

1. Create a file named `variables.tf` and insert the following code:

   ```terraform
   variable "resource_group_location" {
     default     = "eastus"
     description = "Location of the resource group."
   }

   variable "resource_group_name_prefix" {
     default     = "rg"
     description = "Prefix of the resource group name that's combined with a random ID so name is unique in your Azure subscription."
   }

   variable "storage_account_name_prefix" {
     default     = "sa"
     description = "Prefix of the storage account name that's combined with a random ID so name is unique in your Azure subscription."
   }

   variable "eventhub_namespace_name_prefix" {
     default     = "namespace"
     description = "Prefix of the event hub namespace name that's combined with a random ID so name is unique in your Azure subscription."
   }

   variable "iothub_name_prefix" {
     default     = "iothub"
     description = "Prefix of the iot hub name that's combined with a random ID so name is unique in your Azure subscription."
   }

   variable "dps_name_prefix" {
     default     = "dps"
     description = "Prefix of the dps name that's combined with a random ID so name is unique in your Azure subscription."
   }
   ```

1. Create a file named `outputs.tf` and insert the following code:

   ```terraform
   output "azurerm_iothub_name" {
     value = azurerm_iothub.iothub.name
   }

   output "azurerm_iothub_dps_name" {
     value = azurerm_iothub_dps.dps.name
   }

   output "resource_group_name" {
     value = azurerm_resource_group.rg.name
   }
   ```

## Initialize Terraform

Run [terraform init](https://www.terraform.io/cli/commands/init) to initialize the Terraform deployment. This command downloads the Azure modules required to manage your Azure resources.

   ```cmd
   terraform init
   ```

## Create a Terraform execution plan

Run [terraform plan](https://www.terraform.io/cli/commands/plan) to create an execution plan.

   ```cmd
   terraform plan -out main.tfplan
   ```

The `terraform plan` command creates an execution plan, but doesn't execute it. Instead, it determines what actions are necessary to create the configuration specified in your configuration files. This pattern allows you to verify whether the execution plan matches your expectations before making any changes to actual resources.

The optional `-out` parameter allows you to specify an output file for the plan. Using the `-out` parameter ensures that the plan you reviewed is exactly what is applied.

To read more about persisting execution plans and security, see the [security warning section](https://www.terraform.io/cli/commands/plan#security-warning).

## Apply a Terraform execution plan

Run [terraform apply](https://www.terraform.io/cli/commands/apply) to apply the execution plan to your cloud infrastructure.

   ```cmd
   terraform apply main.tfplan
   ```

The `terraform apply` command above assumes you previously ran `terraform plan -out main.tfplan`.

If you specified a different filename for the `-out` parameter, use that same filename in the call to `terraform apply`. If you didn't use the `-out` parameter, call `terraform apply` without any parameters.

## Verify the results

**Azure CLI**
Run [az iot dps show](/cli/azure/iot/dps?view=azure-cli-latest#az-iot-dps-show) to display the Azure DPS resource.

   ```azurecli
   az iot dps show \
      --name my_terraform_dps \
      --resource-group rg
   ```

**Azure PowerShell**
Run [Get-AzIoTDeviceProvisioningService](/powershell/module/az.deviceprovisioningservices/get-aziotdeviceprovisioningservice?view=azps-8.3.0) to display the Azure DPS resource.

   ```powershell
   Get-AzIoTDeviceProvisioningService `
       -ResourceGroupName "rg" `
       -Name "my_terraform_dps"
   ```

The names of the resource group and the DPS instance are displayed in the terraform apply output. You can also run the [terraform output](https://www.terraform.io/cli/commands/output) command to view these output values.

## Clean up resources

[!INCLUDE [terraform-plan-destroy.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-plan-destroy.md)]

1. Run [terraform plan](https://www.terraform.io/cli/commands/plan) and specify the `destroy` flag.

   ```cmd
   terraform plan -destroy -out main.destroy.tfplan
   ```

2. Run [terraform apply](https://www.terraform.io/cli/commands/apply) to apply the execution plan.

   ```cmd
   terraform apply main.destroy.tfplan
   ```

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](/azure/developer/terraform/troubleshoot)

## Next steps

Now that you have an instance of the Device Provisioning Service, continue to the next quickstart to provision a simulated device to IoT hub:

> [!div class="nextstepaction"]
> [Quickstart: Provision a simulated symmetric key device](./quick-create-simulated-device-symm-key.md)
