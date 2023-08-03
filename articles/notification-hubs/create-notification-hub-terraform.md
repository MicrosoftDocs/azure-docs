---
title: 'Quickstart: Create an Azure notification hub using Terraform'
description: In this article, you create an Azure notification hub using Terraform
services: notification-hubs
author: TomArcherMsft
ms.topic: quickstart
ms.custom: devx-track-terraform
ms.service: notification-hubs
ms.author: tarcher
ms.date: 4/14/2023
content_well_notification: 
  - AI-contribution
---

# Quickstart: Create an Azure notification hub using Terraform

This article uses Terraform to create an Azure Notification Hubs namespace and a notification hub. The name of each resource is randomly generated to avoid naming conflicts.

Azure Notification Hubs provides an easy-to-use and scaled-out push engine that enables you to send notifications to any platform (iOS, Android, Windows, Kindle, etc.) from any backend (cloud or on-premises). For more information about the service, see [What is Azure Notification Hubs](notification-hubs-push-notification-overview.md).

[!INCLUDE [Terraform abstract](~/azure-dev-docs-pr/articles/terraform/includes/abstract.md)]

In this article, you learn how to:

> [!div class="checklist"]
> * Create a random value for the Azure resource group name using [random_pet](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/pet).
> * Create an Azure resource group using [azurerm_resource_group](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/resource_group).
> * Create a random value for the Azure Notification Hub namespace name using [random_string](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/string).
> * Create an Azure Notification Hub namespace using [azurerm_notification_hub_namespace](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/notification_hub_namespace).
> * Create a random value for the Azure Notification Hub name using [random_string](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/string).
> * Create an Azure Notification Hub using [azurerm_notification_hub](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/notification_hub).

## Prerequisites

- [Install and configure Terraform](/azure/developer/terraform/quickstart-configure)

## Implement the Terraform code

> [!NOTE]
> The sample code for this article is located in the [Azure Terraform GitHub repo](https://github.com/Azure/terraform/tree/master/quickstart/101-notification-hub). You can view the log file containing the [test results from current and previous versions of Terraform](https://github.com/Azure/terraform/tree/master/quickstart/101-notification-hub\TestRecord.md).
> 
> See more [articles and sample code showing how to use Terraform to manage Azure resources](/azure/terraform)

1. Create a directory in which to test and run the sample Terraform code and make it the current directory.

1. Create a file named `providers.tf` and insert the following code:

    [!code-terraform[master](~/terraform_samples/quickstart/101-notification-hub/providers.tf)]

1. Create a file named `main.tf` and insert the following code:

    [!code-terraform[master](~/terraform_samples/quickstart/101-notification-hub/main.tf)]

1. Create a file named `variables.tf` and insert the following code:

    [!code-terraform[master](~/terraform_samples/quickstart/101-notification-hub/variables.tf)]

1. Create a file named `outputs.tf` and insert the following code:

    [!code-terraform[master](~/terraform_samples/quickstart/101-notification-hub/outputs.tf)]

## Initialize Terraform

[!INCLUDE [terraform-init.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-init.md)]

## Create a Terraform execution plan

[!INCLUDE [terraform-plan.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-plan.md)]

## Apply a Terraform execution plan

[!INCLUDE [terraform-apply-plan.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-apply-plan.md)]

## Verify the results

#### [Azure CLI](#tab/azure-cli)

1. Get the Azure resource group name.

    ```console
    resource_group_name=$(terraform output -raw resource_group_name)
    ```

1. Get the namespace name.

    ```console
    notification_hub_namespace_name=$(terraform output -raw notification_hub_namespace_name)
    ```

1. Run [az notification-hub list](/cli/azure/notification-hub#az-notification-hub-list) to display the hubs for the specified namespace.

    ```azurecli
    az notification-hub list \
        --resource-group $resource_group_name \
        --namespace-name $notification_hub_namespace_name
    ```

#### [Azure PowerShell](#tab/azure-powershell)

1. Get the Azure resource group name.

    ```console
    $resource_group_name=$(terraform output -raw resource_group_name)
    ```

1. Get the namespace name.

    ```console
    $notification_hub_namespace_name=$(terraform output -raw notification_hub_namespace_name)
    ```

1. Run [Get-AzNotificationHub](/powershell/module/az.notificationhubs/get-aznotificationhub) to display the hubs for the specified namespace.

    ```azurepowershell
    Get-AzNotificationHub -ResourceGroup $resource_group_name `
                          -Namespace $notification_hub_namespace_name
    ```

---

## Clean up resources

[!INCLUDE [terraform-plan-destroy.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-plan-destroy.md)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](/azure/developer/terraform/troubleshoot)

## Next steps

> [!div class="nextstepaction"] 
> [Set up push notifications in Azure Notification Hubs](configure-notification-hub-portal-pns-settings.md)
