---
title: 'Quickstart: Create an Azure CDN profile and endpoint using Terraform'
titleSuffix: Azure Content Delivery Network
description: 'In this article, you create an Azure CDN profile and endpoint using Terraform'
services: cdn
ms.service: azure-cdn
ms.topic: quickstart
ms.date: 4/14/2023
ms.custom: devx-track-terraform
author: TomArcherMsft
ms.author: tarcher
content_well_notification: 
  - AI-contribution
---

# Quickstart: Create an Azure CDN profile and endpoint using Terraform

This article shows how to use Terraform to create an [Azure CDN profile and endpoint](/azure/cdn/cdn-overview) using [Terraform](/azure/developer/terraform/quickstart-configure).

[!INCLUDE [Terraform abstract](~/azure-dev-docs-pr/articles/terraform/includes/abstract.md)]

In this article, you learn how to:

> [!div class="checklist"]
> * Create a random pet name for the Azure resource group name using [random_pet](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/pet)
> * Create an Azure resource group using [azurerm_resource_group](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/resource_group)
> * Create a random string for the CDN endpoint name using [random_string](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/string)
> * Create an Azure CDN profile using [azurerm_cdn_profile](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/cdn_profile)
> * Create an Azure CDN endpoint using [azurerm_cdn_endpoint](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/cdn_endpoint)

## Prerequisites

- [Install and configure Terraform](/azure/developer/terraform/quickstart-configure)

## Implement the Terraform code

> [!NOTE]
> The sample code for this article is located in the [Azure Terraform GitHub repo](https://github.com/Azure/terraform/tree/master/quickstart/101-cdn-with-custom-origin). You can view the log file containing the [test results from current and previous versions of Terraform](https://github.com/Azure/terraform/blob/master/quickstart/101-cdn-with-custom-origin/TestRecord.md).
> 
> See more [articles and sample code showing how to use Terraform to manage Azure resources](/azure/terraform)

1. Create a directory in which to test and run the sample Terraform code and make it the current directory.

1. Create a file named `main.tf` and insert the following code:

    [!code-terraform[master](~/terraform_samples/quickstart/101-cdn-with-custom-origin/main.tf)]

1. Create a file named `outputs.tf` and insert the following code:

    [!code-terraform[master](~/terraform_samples/quickstart/101-cdn-with-custom-origin/outputs.tf)]

1. Create a file named `providers.tf` and insert the following code:

    [!code-terraform[master](~/terraform_samples/quickstart/101-cdn-with-custom-origin/providers.tf)]

1. Create a file named `variables.tf` and insert the following code:

    [!code-terraform[master](~/terraform_samples/quickstart/101-cdn-with-custom-origin/variables.tf)]

## Initialize Terraform

[!INCLUDE [terraform-init.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-init.md)]

## Create a Terraform execution plan

[!INCLUDE [terraform-plan.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-plan.md)]

## Apply a Terraform execution plan

[!INCLUDE [terraform-apply-plan.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-apply-plan.md)]

## Verify the results

#### [Azure CLI](#tab/azure-cli)

1. Get the Azure resource group name in which the Azure CDN profile and endpoint were created.

    ```console
    resource_group_name=$(terraform output -raw resource_group_name)
    ```

1. Get the CDN profile name.

    ```console
    cdn_profile_name=$(terraform output -raw cdn_profile_name)
    ```

1. Get the CDN endpoint name.

    ```console
    cdn_endpoint_endpoint_name=$(terraform output -raw cdn_endpoint_endpoint_name)
    ```

1. Run [az cdn custom-domain show](/cli/azure/cdn/custom-domain#az-cdn-custom-domain-show) to show details of the custom domain you created in this article.

    ```azurecli
    az cdn endpoint show --resource-group $resource_group_name \
                         --profile-name $cdn_profile_name \
                         --name $cdn_endpoint_endpoint_name
    ```

#### [Azure PowerShell](#tab/azure-powershell)

1. Get the Azure resource group name in which the Azure CDN profile and endpoint were created.

    ```console
    $resource_group_name=$(terraform output -raw resource_group_name)
    ```

1. Get the CDN profile name.

    ```console
    $cdn_profile_name=$(terraform output -raw cdn_profile_name)
    ```

1. Get the CDN endpoint name.

    ```console
    $cdn_endpoint_endpoint_name=$(terraform output -raw cdn_endpoint_endpoint_name)
    ```

1. Run [Get-AzCdnEndpoint](/powershell/module/az.cdn/get-azcdnendpoint) to show details of the custom domain you created in this article.

    ```console
    Get-AzCdnEndpoint -ResourceGroupName $resource_group_name `
                      -ProfileName $cdn_profile_name `
                      -Name $cdn_endpoint_endpoint_name
    ```

---

## Clean up resources

[!INCLUDE [terraform-plan-destroy.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-plan-destroy.md)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](/azure/developer/terraform/troubleshoot)

## Next steps

> [!div class="nextstepaction"]
> [Tutorial: Use CDN to serve static content from a web app](cdn-add-to-web-app.md)
