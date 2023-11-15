---
title: 'Quickstart: Deploy using Terraform'
description: 'In this article, you create an Azure AI Search service using Terraform.'
ms.topic: quickstart
ms.date: 4/14/2023
ms.custom:
  - devx-track-terraform
  - ignite-2023
author: TomArcherMsft
ms.author: tarcher
ms.service: cognitive-search
content_well_notification: 
  - AI-contribution
---

# Quickstart: Deploy Azure AI Search service using Terraform

This article shows how to use Terraform to create an [Azure AI Search service](./search-what-is-azure-search.md) using [Terraform](/azure/developer/terraform/quickstart-configure).

[!INCLUDE [Terraform abstract](~/azure-dev-docs-pr/articles/terraform/includes/abstract.md)]

In this article, you learn how to:

> [!div class="checklist"]
> * Create a random pet name for the Azure resource group name using [random_pet](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/pet)
> * Create an Azure resource group using [azurerm_resource_group](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/resource_group)
> * Create a random string using [random_string](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/string)
> * Create an Azure AI Search service using [azurerm_search_service](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/search_service)

## Prerequisites

- [Install and configure Terraform](/azure/developer/terraform/quickstart-configure)

## Implement the Terraform code

> [!NOTE]
> The sample code for this article is located in the [Azure Terraform GitHub repo](https://github.com/Azure/terraform/tree/main/quickstart/101-azure-cognitive-search). You can view the log file containing the [test results from current and previous versions of Terraform](https://github.com/Azure/terraform/blob/main/quickstart/101-azure-cognitive-search/TestRecord.md).
> 
> See more [articles and sample code showing how to use Terraform to manage Azure resources](/azure/terraform)

1. Create a directory in which to test and run the sample Terraform code and make it the current directory.

1. Create a file named `main.tf` and insert the following code:

    [!code-terraform[master](~/terraform_samples/quickstart/101-azure-cognitive-search/main.tf)]

1. Create a file named `outputs.tf` and insert the following code:

    [!code-terraform[master](~/terraform_samples/quickstart/101-azure-cognitive-search/outputs.tf)]

1. Create a file named `providers.tf` and insert the following code:

    [!code-terraform[master](~/terraform_samples/quickstart/101-azure-cognitive-search/providers.tf)]

1. Create a file named `variables.tf` and insert the following code:

    [!code-terraform[master](~/terraform_samples/quickstart/101-azure-cognitive-search/variables.tf)]

## Initialize Terraform

[!INCLUDE [terraform-init.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-init.md)]

## Create a Terraform execution plan

[!INCLUDE [terraform-plan.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-plan.md)]

## Apply a Terraform execution plan

[!INCLUDE [terraform-apply-plan.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-apply-plan.md)]

## Verify the results

1. Get the Azure resource name in which the Azure AI Search service was created.

    ```console
    resource_group_name=$(terraform output -raw resource_group_name)
    ```

1. Get the Azure AI Search service name.

    ```console
    azurerm_search_service_name=$(terraform output -raw azurerm_search_service_name)
    ```

1. Run [az search service show](/cli/azure/search/service#az-search-service-show) to show the Azure AI Search service you created in this article.

    ```azurecli
    az search service show --name $azurerm_search_service_name \
                           --resource-group $resource_group_name
    ```

## Clean up resources

[!INCLUDE [terraform-plan-destroy.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-plan-destroy.md)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](/azure/developer/terraform/troubleshoot)

## Next steps

> [!div class="nextstepaction"]
> [Create an Azure AI Search index using the Azure portal](./search-get-started-portal.md)
