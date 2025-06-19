---
title: 'Quickstart: Create and deploy Azure Functions resources from Terraform'
description: In this quickstart article, you create a function app in a Flex Consumption plan, along with the resource group, storage account, and blob storage container required by the app.
ms.topic: quickstart
ms.date: 05/01/2025
ms.custom: devx-track-terraform
ms.service: azure-functions
author: ggailey777
ms.author: glenga
#customer intent: As a Terraform user, I want to learn how to create a function app in a Flex Consumption plan along with required storage account and blob storage container used for deployments.
content_well_notification: 
  - AI-contribution
---

# Quickstart: Create and deploy Azure Functions resources from Terraform

In this quickstart, you use Terraform to create a function app in a Flex Consumption plan in Azure Functions, along with other required Azure resources. The Flex Consumption plan provides serverless hosting that lets you run your code on demand without explicitly provisioning or managing infrastructure. It's used for processing data, integrating systems, internet-of-things computing, and building simple APIs and microservices. The resources created in this configuration include a unique resource group, a storage account, a blob storage container, the Flex Consumption plan, and the function app itself. The function app runs on Linux and is configured to use blob storage for code deployments.

[!INCLUDE [About Terraform](~/azure-dev-docs-pr/articles/terraform/includes/abstract.md)]

> [!div class="checklist"]
> * Create an Azure resource group with a unique name.
> * Generate a random string of 13 lowercase letters to name resources.
> * Create a storage account in Azure.
> * Create a blob storage container in the storage account.
> * Create a Flex Consumption plan in Azure Functions.
> * Create a function app with a Flex Consumption plan in Azure.
> * Output the names of the resource group, storage account, service plan, function app, and Azure Functions Flex Consumption plan.

## Prerequisites

- Create an Azure account with an active subscription. You can [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Install and configure Terraform](/azure/developer/terraform/quickstart-configure).

## Implement the Terraform code

The sample code for this article is located in the [Azure Terraform GitHub repo](https://github.com/Azure/terraform/tree/master/quickstart/101-azure-functions). You can view the log file containing the [test results from current and previous versions of Terraform](https://github.com/Azure/terraform/tree/master/quickstart/101-azure-functions/TestRecord.md). See more [articles and sample code showing how to use Terraform to manage Azure resources](/azure/terraform).

1. Create a directory in which to test and run the sample Terraform code, and make it the current directory.

1. Create a file named `main.tf`, and insert the following code:
    :::code language="Terraform" source="~/terraform_samples/quickstart/101-azure-functions/main.tf":::

1. Create a file named `outputs.tf`, and insert the following code:
    :::code language="Terraform" source="~/terraform_samples/quickstart/101-azure-functions/outputs.tf":::

1. Create a file named `providers.tf`, and insert the following code:
    :::code language="Terraform" source="~/terraform_samples/quickstart/101-azure-functions/providers.tf":::

1. Create a file named `variables.tf`, and insert the following code:
    :::code language="Terraform" source="~/terraform_samples/quickstart/101-azure-functions/variables.tf":::

> [!IMPORTANT]
> If you are using the 4.x azurerm provider, you must [explicitly specify the Azure subscription ID](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/guides/4.0-upgrade-guide#specifying-subscription-id-is-now-mandatory) to authenticate to Azure before running the Terraform commands.
>
> One way to specify the Azure subscription ID without putting it in the `providers` block is to specify the subscription ID in an environment variable named `ARM_SUBSCRIPTION_ID`.
>
> For more information, see the [Azure provider reference documentation](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs#argument-reference).

## Initialize Terraform

[!INCLUDE [terraform-init.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-init.md)]

## Create a Terraform execution plan

[!INCLUDE [terraform-plan.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-plan.md)]

## Apply a Terraform execution plan

[!INCLUDE [terraform-apply-plan.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-apply-plan.md)]

## Verify the results

### [Azure CLI](#tab/azure-cli)

1. Get the Azure resource group name.

    ```console
    resource_group_name=$(terraform output -raw resource_group_name)
    ```

1. Get the storage account name.

    ```console
    sa_name=$(terraform output -raw sa_name)
    ```

1. Get the service plan name.

    ```console
    asp_name=$(terraform output -raw asp_name)
    ```

1. Get the function app plan name.

    ```console
    fa_name=$(terraform output -raw fa_name)
    ```

1. Run `az functionapp show` to view the Azure Functions Flex Consumption plan.

    ```azurecli
    az functionapp show --name $function_app_name --resource-group $resource_group_name  
    ```

### [Azure PowerShell](#tab/azure-powershell)

1. Get the Azure resource group name.

    ```console
    $resource_group_name=$(terraform output -raw resource_group_name)
    ```

1. Get the storage account name.

    ```console
    $sa_name=$(terraform output -raw sa_name)
    ```

1. Get the service plan name.

    ```console
    $asp_name=$(terraform output -raw asp_name)
    ```

1. Get the function app plan name.

    ```console
    $fa_name=$(terraform output -raw fa_name)
    ```

1. Run `Get-AzFunctionApp` to view the Azure Functions Flex Consumption plan.

    ```azurepowershell
    Get-AzFunctionApp -Name $function_app_name -ResourceGroupName $resource_group_name 
    ```

---

Open a browser and enter the following URL: **https://<fa_name>.azurewebsites.net**. Replace the placeholder `<fa_name>` with the value output by Terraform.

:::image type="content" source="media/functions-create-first-function-terraform/function-app-terraform.png" alt-text="Screenshot of Azure Functions app 'Welcome page'." border="false":::

## Clean up resources

[!INCLUDE [terraform-plan-destroy.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-plan-destroy.md)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](/azure/developer/terraform/troubleshoot).

## Next steps

[!INCLUDE [functions-quickstarts-infra-next-steps](../../includes/functions-quickstarts-infra-next-steps.md)]
