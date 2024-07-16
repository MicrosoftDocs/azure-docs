---
title: 'Use Terraform to create an Azure AI Studio hub'
description: In this article, you create an Azure AI hub, an AI project, an AI services resource, and more resources.
ms.topic: how-to
ms.date: 07/12/2024
titleSuffix: Azure AI Studio 
ms.service: azure-ai-studio 
manager: scottpolly 
ms.reviewer: andyaviles 
ms.author: larryfr 
author: Blackmist 
ms.custom: devx-track-terraform
content_well_notification: 
  - AI-contribution
ai-usage: ai-assisted
#customer intent: As a Terraform user, I want to see how to create an Azure AI Studio hub and its associated resources.
---

# Use Terraform to create an Azure AI Studio hub

In this article, you use Terraform to create an Azure AI Studio hub, a project, and AI services connection. A hub is a central place for data scientists and developers to collaborate on machine learning projects. It provides a shared, collaborative space to build, train, and deploy machine learning models. The hub is integrated with Azure Machine Learning and other Azure services, making it a comprehensive solution for machine learning tasks. The hub also allows you to manage and monitor your AI deployments, ensuring they're performing as expected.

[!INCLUDE [About Terraform](~/azure-dev-docs-pr/articles/terraform/includes/abstract.md)]

> [!div class="checklist"]
> * Create a resource group
> * Set up a storage account
> * Establish a key vault
> * Configure AI services
> * Build an Azure AI hub
> * Develop an AI project
> * Establish an AI services connection

## Prerequisites

- Create an Azure account with an active subscription. You can [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- [Install and configure Terraform](/azure/developer/terraform/quickstart-configure)

## Implement the Terraform code

> [!NOTE]
> The sample code for this article is located in the [Azure Terraform GitHub repo](https://github.com/Azure/terraform/tree/master/quickstart/101-ai-studio). You can view the log file containing the [test results from current and previous versions of Terraform](https://github.com/Azure/terraform/tree/master/quickstart/101-ai-studio/TestRecord.md).
> 
> See more [articles and sample code showing how to use Terraform to manage Azure resources](/azure/terraform)

1. Create a directory in which to test and run the sample Terraform code and make it the current directory.

1. Create a file named `providers.tf` and insert the following code.

    :::code language="Terraform" source="~/terraform_samples/quickstart/101-ai-studio/providers.tf":::

1. Create a file named `main.tf` and insert the following code.

    :::code language="Terraform" source="~/terraform_samples/quickstart/101-ai-studio/main.tf":::

1. Create a file named `variables.tf` and insert the following code.

    :::code language="Terraform" source="~/terraform_samples/quickstart/101-ai-studio/variables.tf":::

1. Create a file named `outputs.tf` and insert the following code.
    
    :::code language="Terraform" source="~/terraform_samples/quickstart/101-ai-studio/outputs.tf":::

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

1. Get the workspace name.

    ```console
    workspace_name=$(terraform output -raw workspace_name)
    ```

1. Run [az ml workspace show](/cli/azure/ml/workspace#az-ml-workspace-show) to display information about the new workspace.

    ```azurecli
    az ml workspace show --resource-group $resource_group_name \
                         --name $workspace_name
    ```

### [Azure PowerShell](#tab/azure-powershell)

1. Get the Azure resource group name.

    ```console
    $resource_group_name=$(terraform output -raw resource_group_name)
    ```

1. Get the workspace name.

    ```console
    $workspace_name=$(terraform output -raw workspace_name)
    ```

1. Run [Get-AzMLWorkspace](/powershell/module/az.machinelearningservices/get-azmlworkspace) to display information about the new workspace.

    ```azurepowershell
    Get-AzMLWorkspace -ResourceGroupName $resource_group_name `
                      -Name $workspace_name
    ```

---

## Clean up resources

[!INCLUDE [terraform-plan-destroy.md](~/azure-dev-docs-pr/articles/terraform/includes/terraform-plan-destroy.md)]

## Troubleshoot Terraform on Azure

[Troubleshoot common problems when using Terraform on Azure](/azure/developer/terraform/troubleshoot).

## Next steps

> [!div class="nextstepaction"]
> [See more articles about Azure AI Studio hub](/search/?terms=Azure%20ai%20hub%20and%20terraform)

