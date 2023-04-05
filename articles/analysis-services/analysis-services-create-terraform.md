---
title: 'Quickstart: Create an Azure Analysis Services server using Terraform'
description: 'In this article, you create an Azure Analysis Services server using Terraform'
ms.topic: quickstart
ms.service: analysis-services
ms.date: 3/10/2023
ms.custom: devx-track-terraform
author: TomArcherMsft
ms.author: tarcher
---

# Quickstart: Create an Azure Analysis Services server using Terraform

This article shows how to use [Terraform](/azure/terraform) to create an [Azure Analysis Services](./analysis-services-overview.md) server.

In this article, you learn how to:

> [!div class="checklist"]
> * Create a random pet name for the Azure resource group name using [random_pet](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/pet)
> * Create an Azure resource group using [azurerm_resource_group](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/resource_group)
> * Create a random string for the Azure Analysis Services server name using [random_string](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/string)
> * Create an Azure Analysis Services server using [azurerm_analysis_services_server](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/analysis_services_server)

[!INCLUDE [AI attribution](../../includes/ai-generated-attribution.md)]

## Prerequisites

- [Install and configure Terraform](/azure/developer/terraform/quickstart-configure)

## Implement the Terraform code

> [!NOTE]
> The sample code for this article is located in the [Azure Terraform GitHub repo](https://github.com/Azure/terraform/tree/master/quickstart/101-analysis-services-create). You can view the log file containing the [test results from current and previous versions of Terraform](https://github.com/Azure/terraform/tree/master/quickstart/101-analysis-services-create/TestRecord.md).
> 
> See more [articles and sample code showing how to use Terraform to manage Azure resources](/azure/terraform)

1. Create a directory in which to test and run the sample Terraform code and make it the current directory.

1. Create a file named `main.tf` and insert the following code:

    [!code-terraform[master](~/terraform_samples/quickstart/101-analysis-services-create/main.tf)]

1. Create a file named `outputs.tf` and insert the following code:

    [!code-terraform[master](~/terraform_samples/quickstart/101-analysis-services-create/outputs.tf)]

1. Create a file named `providers.tf` and insert the following code:

    [!code-terraform[master](~/terraform_samples/quickstart/101-analysis-services-create/providers.tf)]

1. Create a file named `variables.tf` and insert the following code:

    [!code-terraform[master](~/terraform_samples/quickstart/101-analysis-services-create/variables.tf)]

## Initialize Terraform

[!INCLUDE [terraform-init.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-init.md)]

## Create a Terraform execution plan

[!INCLUDE [terraform-plan.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-plan.md)]

## Apply a Terraform execution plan

[!INCLUDE [terraform-apply-plan.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-apply-plan.md)]

## Verify the results

1. Open a PowerShell command prompt.

1. Get the Azure resource group name.

    ```console
    $resource_group_name=$(terraform output -raw resource_group_name)
    ```

1. Get the server name.

    ```console
    $analysis_services_server_name=$(terraform output -raw analysis_services_server_name)
    ```

1. Run [Get-AzAnalysisServicesServer](/powershell/module/az.analysisservices/get-azanalysisservicesserver) to display information about the new server.

    ```azurepowershell
    Get-AzAnalysisServicesServer -ResourceGroupName $resource_group_name `
                                 -Name $analysis_services_server_name
    ```

## Clean up resources

[!INCLUDE [terraform-plan-destroy.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-plan-destroy.md)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](/azure/developer/terraform/troubleshoot)

## Next steps

> [!div class="nextstepaction"]
> [Quickstart: Configure server firewall - Portal](analysis-services-qs-firewall.md)