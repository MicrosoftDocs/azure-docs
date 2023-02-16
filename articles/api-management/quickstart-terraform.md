---
title: 'Quickstart: Create an Azure API Management service using Terraform'
description: 'In this article, you create an Azure API Management service using Terraform'
ms.topic: quickstart
ms.service: api-management
ms.date: 2/15/2023
ms.custom: devx-track-terraform
author: TomArcherMsft
ms.author: tarcher
---

# Quickstart: Create an Azure API Management service using Terraform

> [!NOTE]
> View the log file containing the [test results from current and previous versions of Terraform](https://github.com/Azure/terraform/tree/master/quickstart/101-azure-api-management-create/TestRecord.md).

This article shows how to use [Terraform](/azure/terraform) to create an [API Management (APIM) service instance](/azure/api-management/api-management-key-concepts) on Azure. APIM helps organizations publish APIs to external, partner, and internal developers to unlock the potential of their data and services. API Management provides the core competencies to ensure a successful API program through developer engagement, business insights, analytics, security, and protection. APIM enables you to create and manage modern API gateways for existing backend services hosted anywhere. For more information, see the [Azure API Management - Overview and key concepts](api-management-key-concepts.md).

[!INCLUDE [Terraform abstract](~/azure-dev-docs-pr/articles/terraform/includes/abstract.md)]

In this article, you learn how to:

> [!div class="checklist"]

> * Create a random pet name for the Azure resource group name using [random_pet](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/resource_group/pet)
> * Create an Azure resource group using [azurerm_resource_group](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/resource_group)
> * Create an Azure API Management service using [azurerm_api_management](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/api_management)

## Prerequisites

- [Install and configure Terraform](/azure/developer/terraform/quickstart-configure)

<!-- TODO: Add bullets for any article-specific includes or download/install URLs and commands. -->

## Implement the Terraform code

> [!NOTE]
> The example code for this article is located in the [Azure Terraform GitHub repo](https://github.com/Azure/terraform/tree/master/quickstart/101-azure-api-management-create). See more [articles and sample code showing how to use Terraform to manage Azure resources](/azure/terraform)

1. Create a directory in which to test and run the sample Terraform code and make it the current directory.

1. Create a file named `main.tf` and insert the following code:

    [!code-terraform[master](~/terraform_samples/quickstart/101-azure-api-management-create/main.tf)]

1. Create a file named `outputs.tf` and insert the following code:

    [!code-terraform[master](~/terraform_samples/quickstart/101-azure-api-management-create/outputs.tf)]

1. Create a file named `providers.tf` and insert the following code:

    [!code-terraform[master](~/terraform_samples/quickstart/101-azure-api-management-create/providers.tf)]

1. Create a file named `variables.tf` and insert the following code:

    [!code-terraform[master](~/terraform_samples/quickstart/101-azure-api-management-create/variables.tf)]

## Initialize Terraform

[!INCLUDE [terraform-init.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-init.md)]

## Create a Terraform execution plan

[!INCLUDE [terraform-plan.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-plan.md)]

## Apply a Terraform execution plan

[!INCLUDE [terraform-apply-plan.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-apply-plan.md)]

## Verify the results

Use [terraform state show](https://developer.hashicorp.com/terraform/cli/commands/state/show) to display the current state of the specified resource.

```console
terraform state show azurerm_api_management.api
```

## Clean up resources

[!INCLUDE [terraform-plan-destroy.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-plan-destroy.md)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](/azure/developer/terraform/troubleshoot)

## Next steps

> [!div class="nextstepaction"] 
> [Tutorial: Import and publish your first API](import-and-publish.md)
