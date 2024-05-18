---
title: 'Quickstart: Deploy your first container app using Terraform'
description: Deploy your first application to Azure Container Apps using Terraform.
services: container-apps
author: ravick4u
ms.service: container-apps
ms.topic: quickstart
ms.date: 04/30/2024
ms.author: cshoe
ms.custom: mode-ui
---

# Quickstart: Deploy your first container app using Terraform

In this quickstart, you learn how to deploy an [Azurer Container App](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/container_app) with [Azure Container App Environment](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/container_app_environment). 

[!INCLUDE [About Terraform](~/azure-dev-docs-pr/articles/terraform/includes/abstract.md)]

In this article, you learn how to:

> [!div class="checklist"]
> * Create a random value (to be used in the resource group name) using [random_pet](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/pet)
> * Create an Azure resource group using [azurerm_resource_group](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/resource_group)
> * Create a storage account blob in the using [azurerm_storage_blob](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/storage_blob)
> * Create a container app environment [azurerm_container_app_environment](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/container_app_environment)
> * Create a container app [azurerm_container_app](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/container_app)

## Prerequisites

- [Install and configure Terraform](/azure/developer/terraform/quickstart-configure)

## Implement the Terraform code

[!NOTE]
> The sample code for this article is located in the [Azure Terraform GitHub repo](https://github.com/Azure/terraform/tree/master/quickstart/101-azure-container-app). You can view the log file containing the [test results from current and previous versions of Terraform](https://github.com/Azure/terraform/tree/master/quickstart/101-azure-container-app/TestRecord.md).
>
> See more [articles and sample code showing how to use Terraform to manage Azure resources](/azure/terraform)

1. Create a directory in which to test the sample Terraform code and make it the current directory.

1. Create a file named `providers.tf` and insert the following code:

    :::code language="Terraform" source="~/terraform_samples/quickstart/101-azure-container-app/providers.tf":::
    
1. Create a file named `main.tf` and insert the following code:

    :::code language="Terraform" source="~/terraform_samples/quickstart/101-azure-container-app/main.tf":::

1. Create a file named `variables.tf` and insert the following code:

    :::code language="Terraform" source="~/terraform_samples/quickstart/101-azure-container-app/variables.tf":::

1. Create a file named `outputs.tf` and insert the following code:

    :::code language="Terraform" source="~/terraform_samples/quickstart/101-azure-container-app/outputs.tf":::

## Initialize Terraform

[!INCLUDE [terraform-init.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-init.md)]

## Create a Terraform execution plan

[!INCLUDE [terraform-plan.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-plan.md)]

## Apply a Terraform execution plan

[!INCLUDE [terraform-apply-plan.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-apply-plan.md)]

## Verify the results

#### [Azure CLI](#tab/azure-cli)

1. Get the URL of web site hosted in azure container app.

    ```console
    resource_group_name=$(terraform output -raw resource_group_name)
    container_app_name=$(terraform output -raw container_app_name)

    az containerapp show \
        --resource-group resource_group_name \
        --name container_app_name \
        --query properties.configuration.ingress.fqdn
    ```

1. Open a browser and enter the URL in your browser's address bar.

    :::image type="content" source="./media/connect-apps/azure-container-apps-quickstart-terraform.png" alt-text="Screenshot of the web site hosted in azure container app.":::

#### [Azure PowerShell](#tab/azure-powershell)

1. Get the URL of web site hosted in azure container app.

    ```console
    $resource_group_name=$(terraform output -raw resource_group_name)
    $container_app_name=$(terraform output -raw container_app_name)

    az containerapp show \
        --resource-group $resource_group_name \
        --name $container_app_name \
        --query properties.configuration.ingress.fqdn
    ```

1. Open a browser and enter the URL in your browser's address bar.

    :::image type="content" source="./media/connect-apps/azure-container-apps-quickstart-terraform" alt-text="Screenshot of the web site hosted in azure container app.":::

---

## Clean up resources

[!INCLUDE [terraform-plan-destroy.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-plan-destroy.md)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](/azure/developer/terraform/troubleshoot)

## Next steps

> [!div class="nextstepaction"]
> [Communication between microservices](communicate-between-microservices.md)