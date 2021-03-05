---
title: Provision an Azure Spring Cloud instance with terraform
description: Provision an Azure Spring Cloud instance with Terraform.
author:  MikeDodaro
ms.author: brendm
ms.service: spring-cloud
ms.topic: how-to
ms.date: 06/26/2020
ms.custom: devx-track-java
---

# Provision an Azure Spring Cloud instance with Terraform

**This article applies to:** ✔️ Java ✔️ C#

This example creates an Azure Spring Cloud instance using Terraform. The procedures walk you through creation of the following resources:

> [!div class="checklist"]
> * Resource Group
> * Azure Spring Cloud Instance
> * Azure Storage for Log Analytics

> [!NOTE]
> For Terraform-specific support, use one of HashiCorp's community support channels to Terraform:
>
> * Questions, use-cases, and useful patterns: [Terraform section of the HashiCorp community portal](https://discuss.hashicorp.com/c/terraform-core)
> * Provider-related questions: [Terraform Providers section of the HashiCorp community portal](https://discuss.hashicorp.com/c/terraform-providers)

## Prerequisites

- **Azure subscription**: If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.

## Create configuration file

1. Sign in to the [Azure portal](https://go.microsoft.com/fwlink/p/?LinkID=525040).

1. Open the [Azure Cloud Shell](../app-service/quickstart-java.md#use-azure-cloud-shell).

1. Start the Cloud Shell editor:

    ```bash
    code main.tf
    ```

1. The configuration in this step models Azure resources, including an Azure resource group and an Azure Spring Cloud instance.

    ```hcl
    provider "azurerm" {
        features {}
    }

    resource "azurerm_resource_group" "example" {
      name     = "username"
      location = "eastus"
    }

    resource "azurerm_spring_cloud_service" "example" {
      name                = "usernamesp"
      resource_group_name = azurerm_resource_group.example.name
      location            = azurerm_resource_group.example.location

      config_server_git_setting {
        uri          = "https://github.com/Azure-Samples/piggymetrics-config"
        label        = "master"
        search_paths = ["."]
      }
    }
    ```

1. Save the file (**&lt;Ctrl>S**) and exit the editor (**&lt;Ctrl>Q**).

## Apply the configuration

In this section, you use several Terraform commands to run the configuration.

1. The [terraform init](https://www.terraform.io/docs/commands/init.html) command initializes the working directory. Run the following command in Cloud Shell:

    ```bash
    terraform init
    ```

1. The command [terraform plan](https://www.terraform.io/docs/commands/plan.html) is used to validate the configuration syntax. The `-out` parameter directs the results to a file. The output file can be used later to apply the configuration. Run the following command in Cloud Shell:

    ```bash
    terraform plan --out plan.out
    ```

1. The command [terraform apply](https://www.terraform.io/docs/commands/apply.html) is used to apply the configuration. The command specifies the output file from the previous step. This command creates the Azure resources. Run the following command in Cloud Shell:

    ```bash
    terraform apply plan.out
    ```

1. To verify the results within the Azure portal, browse to the new resource group. The new **Azure Spring Cloud** instance shows in the new resource group.

## Update configuration to config logs and metrics

This section shows how to update the configuration to enable log and metrics for Azure Spring Cloud with an Azure Storage account.

1. Start the Cloud Shell editor:

    ```bash
    code main.tf
    ```

1. Add the following configuration at the end of file:

    ```hcl
    resource "azurerm_storage_account" "example" {
      name                     = "usernamest"
      resource_group_name      = azurerm_resource_group.example.name
      location                 = azurerm_resource_group.example.location
      account_tier             = "Standard"
      account_replication_type = "GRS"
    }

    resource "azurerm_monitor_diagnostic_setting" "example" {
      name               = "example"
      target_resource_id = "${azurerm_spring_cloud_service.example.id}"
      storage_account_id = "${azurerm_storage_account.example.id}"

      log {
        category = "SystemLogs"
        enabled  = true

        retention_policy {
          enabled = false
        }
      }

      metric {
        category = "AllMetrics"

        retention_policy {
          enabled = false
        }
      }
    }
    ```

1. Save the file (**&lt;Ctrl>S**), and exit the editor (**&lt;Ctrl>Q**).

1. As in the previous section, run the following command to make the changes:

    ```bash
    terraform plan --out plan.out
    ```

1. Run the `terraform apply` command to apply the configuration.

    ```bash
    terraform apply plan.out
    ```

## Clean up resources

When no longer needed, delete the resources created in this article.

Run the [terraform destroy](https://www.terraform.io/docs/commands/destroy.html) command to remove the Azure resources created in this exercise:

```bash
terraform destroy -auto-approve
```

## Next steps

> [!div class="nextstepaction"]
> [Install and configure Terraform to provision Azure resources](/azure/developer/terraform/getting-started-cloud-shell).