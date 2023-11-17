---
title: 'Quickstart: Deploy a static website on Azure Storage using Terraform'
description: Learn how to deploy an Azure Storage account with static website hosting enabled.
author: normesta
ms.service: azure-blob-storage
ms.topic: quickstart
ms.date: 11/17/2021
ms.author: normesta
ms.custom: devx-track-terraform
content_well_notification: 
  - AI-contribution
---

# Quickstart: Deploy a static website on Azure Storage using Terraform

In this quickstart, you learn how to deploy an [Azure Storage account](https://www.terraform.io/docs/providers/azurerm/r/storage_account.html) with static website hosting enabled. 

[!INCLUDE [About Terraform](~/azure-dev-docs-pr/articles/terraform/includes/abstract.md)]

In this article, you learn how to:

> [!div class="checklist"]
> * Create a random value (to be used in the resource group name) using [random_pet](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/pet)
> * Create an Azure resource group using [azurerm_resource_group](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/resource_group)
> * Create a random value (to be used in the storage acccount name) using [random_string](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/string)
> * Create a storage account with a static website using [azurerm_storage_account](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/storage_account)
> * Create a storage account blob in the using [azurerm_storage_blob](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/storage_blob)

## Prerequisites

- [Install and configure Terraform](/azure/developer/terraform/quickstart-configure)

## Implement the Terraform code

> [!NOTE]
> The sample code for this article is located in the [Azure Terraform GitHub repo](https://github.com/Azure/terraform/tree/master/quickstart/101-storage-account-with-static-website). You can view the log file containing the [test results from current and previous versions of Terraform](https://github.com/Azure/terraform/tree/master/quickstart/101-storage-account-with-static-website/TestRecord.md).
>
> See more [articles and sample code showing how to use Terraform to manage Azure resources](/azure/terraform)

1. Create a directory in which to test the sample Terraform code and make it the current directory.

1. Create a file named `providers.tf` and insert the following code:

    :::code language="Terraform" source="~/terraform_samples/quickstart/101-storage-account-with-static-website/providers.tf":::

1. Create a file named `main.tf` and insert the following code:

    :::code language="Terraform" source="~/terraform_samples/quickstart/101-storage-account-with-static-website/main.tf":::

1. Create a file named `variables.tf` and insert the following code:

    :::code language="Terraform" source="~/terraform_samples/quickstart/101-storage-account-with-static-website/variables.tf":::

1. Create a file named `outputs.tf` and insert the following code:

    :::code language="Terraform" source="~/terraform_samples/quickstart/101-storage-account-with-static-website/outputs.tf":::

1. Create a file named `index.html` and insert the following code:

    :::code language="html" source="~/terraform_samples/quickstart/101-storage-account-with-static-website/index.html":::

## Initialize Terraform

[!INCLUDE [terraform-init.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-init.md)]

## Create a Terraform execution plan

[!INCLUDE [terraform-plan.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-plan.md)]

## Apply a Terraform execution plan

[!INCLUDE [terraform-apply-plan.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-apply-plan.md)]

## Verify the results

#### [Azure CLI](#tab/azure-cli)

1. Get the URL to the static web site.

    ```console
    primary_web_host=$(terraform output -raw primary_web_host)
    ```

1. Open a browser and enter the URL in your browser's address bar.

    :::image type="content" source="./media/storage-quickstart-static-website-terraform/static-website-running-in-storage-account.png" alt-text="Screenshot of the static web site stored in an Azure storage account":::

#### [Azure PowerShell](#tab/azure-powershell)

1. Get the URL to the static web site.

    ```console
    $primary_web_host=$(terraform output -raw primary_web_host)
    ```

1. Open a browser and enter the URL in your browser's address bar.

    :::image type="content" source="./media/storage-quickstart-static-website-terraform/static-website-running-in-storage-account.png" alt-text="Screenshot of the static web site stored in an Azure storage account":::

---

## Clean up resources

[!INCLUDE [terraform-plan-destroy.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-plan-destroy.md)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](/azure/developer/terraform/troubleshoot)

## Next steps

> [!div class="nextstepaction"]
> [Introduction to Azure Blob Storage](./storage-blobs-introduction.md)
