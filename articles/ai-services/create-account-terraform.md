---
title: 'Quickstart: Create an Azure AI services resource using Terraform'
description: 'In this article, you create an Azure AI services resource using Terraform'
keywords: Azure AI services, cognitive solutions, cognitive intelligence, cognitive artificial intelligence
services: cognitive-services
ms.service: azure-ai-services
ms.topic: quickstart
ms.date: 4/14/2023
ms.custom: devx-track-terraform
author: TomArcherMsft
ms.author: tarcher
content_well_notification: 
  - AI-contribution
---

# Quickstart: Create an Azure AI services resource using Terraform

This article shows how to use Terraform to create an [Azure AI services account](multi-service-resource.md?pivots=azportal) using [Terraform](/azure/developer/terraform/quickstart-configure).

Azure AI services are cloud-based artificial intelligence (AI) services that help developers build cognitive intelligence into applications without having direct AI or data science skills or knowledge. They are available through REST APIs and client library SDKs in popular development languages. Azure AI services enables developers to easily add cognitive features into their applications with cognitive solutions that can see, hear, speak, and analyze.

[!INCLUDE [Terraform abstract](~/azure-dev-docs-pr/articles/terraform/includes/abstract.md)]

In this article, you learn how to:

> [!div class="checklist"]
> * Create a random pet name for the Azure resource group name using [random_pet](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/pet)
> * Create an Azure resource group using [azurerm_resource_group](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/resource_group)
> * Create a random string using [random_string](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/string)
> * Create an Azure AI services account using [azurerm_cognitive_account](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/cognitive_account)

## Prerequisites

- [Install and configure Terraform](/azure/developer/terraform/quickstart-configure)

## Implement the Terraform code

> [!NOTE]
> The sample code for this article is located in the [Azure Terraform GitHub repo](https://github.com/Azure/terraform/tree/master/quickstart/101-cognitive-services-account). You can view the log file containing the [test results from current and previous versions of Terraform](https://github.com/Azure/terraform/tree/master/quickstart/101-cognitive-services-account/TestRecord.md).
> 
> See more [articles and sample code showing how to use Terraform to manage Azure resources](/azure/terraform)

1. Create a directory in which to test and run the sample Terraform code and make it the current directory.

1. Create a file named `main.tf` and insert the following code:

    [!code-terraform[master](~/terraform_samples/quickstart/101-cognitive-services-account/main.tf)]

1. Create a file named `outputs.tf` and insert the following code:

    [!code-terraform[master](~/terraform_samples/quickstart/101-cognitive-services-account/outputs.tf)]

1. Create a file named `providers.tf` and insert the following code:

    [!code-terraform[master](~/terraform_samples/quickstart/101-cognitive-services-account/providers.tf)]

1. Create a file named `variables.tf` and insert the following code:

    [!code-terraform[master](~/terraform_samples/quickstart/101-cognitive-services-account/variables.tf)]

## Initialize Terraform

[!INCLUDE [terraform-init.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-init.md)]

## Create a Terraform execution plan

[!INCLUDE [terraform-plan.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-plan.md)]

## Apply a Terraform execution plan

[!INCLUDE [terraform-apply-plan.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-apply-plan.md)]

## Verify the results

#### [Azure CLI](#tab/azure-cli)

1. Get the Azure resource name in which the Azure AI services account was created.

    ```console
    resource_group_name=$(terraform output -raw resource_group_name)
    ```

1. Get the Azure AI services account name.

    ```console
    azurerm_cognitive_account_name=$(terraform output -raw azurerm_cognitive_account_name)
    ```

1. Run [az cognitiveservices account show](/cli/azure/cognitiveservices/account#az-cognitiveservices-account-show) to show the Azure AI services account you created in this article.

    ```azurecli
    az cognitiveservices account show --name $azurerm_cognitive_account_name \
                                      --resource-group $resource_group_name
    ```

#### [Azure PowerShell](#tab/azure-powershell)

1. Get the Azure resource name in which the Azure AI services account was created.

    ```console
    $resource_group_name=$(terraform output -raw resource_group_name)
    ```

1. Get the Azure AI services account name.

    ```console
    $azurerm_cognitive_account_name=$(terraform output -raw azurerm_cognitive_account_name)
    ```

1. Run [Get-AzCognitiveServicesAccount](/powershell/module/az.cognitiveservices/get-azcognitiveservicesaccount) to display information about the new service.

    ```azurepowershell
    Get-AzCognitiveServicesAccount -ResourceGroupName $resource_group_name `
                                   -Name $azurerm_cognitive_account_name
    ```

---

## Clean up resources

[!INCLUDE [terraform-plan-destroy.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-plan-destroy.md)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](/azure/developer/terraform/troubleshoot)

## Next steps

- [Learn more about Azure AI resources](./multi-service-resource.md)
