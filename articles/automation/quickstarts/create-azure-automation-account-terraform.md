---
title: 'Quickstart: Use Terraform to create an Azure Automation account'
description: In this quickstart, you use Terraform to create an Azure resource group, create an Azure Automation account with a system-assigned identity, and assign a "Reader" role to the Automation account.
ms.topic: quickstart
ms.date: 01/15/2025
ms.custom: devx-track-terraform
ms.service: azure-automation
ms.author: v-jasmineme
author: jasminemehndir
#customer intent: As a Terraform user, I want to learn how to create an Azure resource group, create an Azure Automation account with a system-assigned identity, and assign a "Reader" role to the account.
content_well_notification: 
  - AI-contribution
---

# Quickstart: Use Terraform to create an Azure Automation account

In this quickstart, you create an Azure Automation account and use Terraform to assign a "Reader" role to the account. An Automation account is a cloud-based service that provides a secure environment for running runbooks, which are scripts that automate processes. The account can automate frequent, time-consuming, and error-prone tasks that are managed in the cloud. This Automation account is created within an Azure resource group, which is a container that holds related resources for an Azure solution. Additionally, a "Reader" role is assigned to the Automation account, granting the subscription permission to view all resources in an Automation account but not make any changes.

[!INCLUDE [About Terraform](~/azure-dev-docs-pr/articles/terraform/includes/abstract.md)]

In this article, you learn how to:

> [!div class="checklist"]
> * Create an Azure resource group with a unique name.
> * Generate a random string for unique naming of the Azure resources.
> * Create an Automation account, and enable public network access.
> * Retrieve the current Azure subscription.
> * Retrieve the role definition for "Reader".
> * Assign the "Reader" role to the Automation account.
> * Output the names of the created resource group and Automation account.

## Prerequisites

- Create an Azure account with an active subscription. You can [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). Options for your new Automation account are organized into tabs in the **Create an Automation Account** page of the Azure portal.

- [Install and configure Terraform](/azure/developer/terraform/quickstart-configure).

## Implement the Terraform code

> [!NOTE]
> The sample code for this article is located in the [Azure Terraform GitHub repo](https://github.com/Azure/terraform/tree/master/quickstart/101-azure-automation). You can view the log file containing the [test results from current and previous versions of Terraform](https://github.com/Azure/terraform/tree/master/quickstart/101-azure-automation/TestRecord.md).
> 
> See more [articles and sample code showing how to use Terraform to manage Azure resources](/azure/terraform).

1. Create a directory in which to test and run the sample Terraform code, and make it the current directory.

1. Create a file named `main.tf`, and insert the following code:
    :::code language="Terraform" source="~/terraform_samples/quickstart/101-azure-automation/main.tf":::

1. Create a file named `outputs.tf`, and insert the following code:
    :::code language="Terraform" source="~/terraform_samples/quickstart/101-azure-automation/outputs.tf":::

1. Create a file named `providers.tf`, and insert the following code:
    :::code language="Terraform" source="~/terraform_samples/quickstart/101-azure-automation/providers.tf":::

1. Create a file named `variables.tf`, and insert the following code:
    :::code language="Terraform" source="~/terraform_samples/quickstart/101-azure-automation/variables.tf":::

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

1. Get the Automation account name.

    ```console
    automation_account_name=$(terraform output -raw automation_account_name)
    ```

1. Run [`az automation account show`](/cli/azure/automation/account#az-automation-account-show) to view the Automation account.

    ```azurecli
    az automation account show --name $automation_account_name --resource-group $resource_group_name
    ```

### [Azure PowerShell](#tab/azure-powershell)

1. Get the Azure resource group name.

    ```console
    $resource_group_name=$(terraform output -raw resource_group_name)
    ```

1. Get the Automation account name.

    ```console
    $automation_account_name=$(terraform output -raw automation_account_name)
    ```

1. Run [`Get-AzAutomationAccount`](/powershell/module/az.automation/get-azautomationaccount#example-2-get-an-account) to view the Automation account.

    ```azurepowershell
    Get-AzAutomationAccount -ResourceGroupName $resource_group_name -Name $automation_account_name
    ```

---

## Clean up resources

[!INCLUDE [terraform-plan-destroy.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-plan-destroy.md)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](/azure/developer/terraform/troubleshoot).

## Next steps

In this Quickstart, you created an Automation account. [Explore articles about Automation accounts](/search/?terms=Azure%20automation%20account%20and%20terraform) to learn more.

To use managed identities with your Automation account, continue to:

> [!div class="nextstepaction"]
> [Tutorial: Create Automation PowerShell runbook using managed identity](../learn/powershell-runbook-managed-identity.md)
