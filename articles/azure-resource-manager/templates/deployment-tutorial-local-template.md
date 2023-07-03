---
title: Tutorial - Deploy a local Azure Resource Manager template
description: Learn how to deploy an Azure Resource Manager template (ARM template) from your local computer
ms.date: 05/22/2023
ms.topic: tutorial
ms.custom: devx-track-arm-template
---

# Tutorial: Deploy a local ARM template

Learn how to deploy an Azure Resource Manager template (ARM template) from your local machine. It takes about **8 minutes** to complete.

This tutorial is the first of a series. As you progress through the series, you modularize the template by creating a linked template, you store the linked template in a storage account, and secure the linked template by using SAS token, and you learn how to create a DevOps pipeline to deploy templates. This series focuses on template deployment. If you want to learn template development, see the [beginner tutorials](./template-tutorial-create-first-template.md).

## Get tools

Let's start by making sure you have the tools you need to deploy templates.

### Command-line deployment

You  need either Azure PowerShell or Azure CLI to deploy the template. For the installation instructions, see:

- [Install Azure PowerShell](/powershell/azure/install-azure-powershell)
- [Install Azure CLI on Windows](/cli/azure/install-azure-cli-windows)
- [Install Azure CLI on Linux](/cli/azure/install-azure-cli-linux)
- [Install Azure CLI on macOS](/cli/azure/install-azure-cli-macos)

After installing either Azure PowerShell or Azure CLI, make sure you sign in for the first time. For help, see [Sign in - PowerShell](/powershell/azure/install-az-ps#sign-in) or [Sign in - Azure CLI](/cli/azure/get-started-with-azure-cli#sign-in).

### Editor (Optional)

Templates are JSON files. To review/edit templates, you need a good JSON editor. We recommend Visual Studio Code with the Resource Manager Tools extension. If you need to install these tools, see [Quickstart: Create ARM templates with Visual Studio Code](quickstart-create-templates-use-visual-studio-code.md).

## Review template

The template deploys a storage account, app service plan, and web app. If you're interested in creating the template, you can go through [tutorial about Quickstart templates](template-tutorial-quickstart-template.md). However it's not required for completing this tutorial.

:::code language="json" source="~/resourcemanager-templates/get-started-deployment/local-template/azuredeploy.json":::

> [!IMPORTANT]
> Storage account names must be unique, between 3 and 24 characters in length, and use **numbers** and **lowercase** letters only. The sample template's `storageAccountName` variable combines the `projectName` parameter's maximum of 11 characters with a [uniqueString](./template-functions-string.md#uniquestring) value of 13 characters.

Save a copy of the template to your local computer with the _.json_ extension, for example, _azuredeploy.json_. You deploy this template later in the tutorial.

## Sign in to Azure

To start working with Azure PowerShell/Azure CLI to deploy a template, sign in with your Azure credentials.

# [PowerShell](#tab/azure-powershell)

```azurepowershell
Connect-AzAccount
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az login
```

---

If you have multiple Azure subscriptions, select the subscription you want to use. Replace `[SubscriptionID/SubscriptionName]` and the square brackets `[]` with your subscription information:

# [PowerShell](#tab/azure-powershell)

```azurepowershell
Set-AzContext [SubscriptionID/SubscriptionName]
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az account set --subscription [SubscriptionID/SubscriptionName]
```

---

## Create resource group

When you deploy a template, you specify a resource group that will contain the resources. Before running the deployment command, create the resource group with either Azure CLI or Azure PowerShell. Select the tabs in the following code section to choose between Azure PowerShell and Azure CLI. The CLI examples in this article are written for the Bash shell.

# [PowerShell](#tab/azure-powershell)

```azurepowershell
$projectName = Read-Host -Prompt "Enter a project name that is used to generate resource and resource group names"
$resourceGroupName = "${projectName}rg"

New-AzResourceGroup `
  -Name $resourceGroupName `
  -Location "Central US"
```

# [Azure CLI](#tab/azure-cli)

```azurecli
echo "Enter a project name that is used to generate resource and resource group names:"
read projectName
resourceGroupName="${projectName}rg"

az group create \
  --name $resourceGroupName \
  --location "Central US"
```

---

## Deploy template

Use one or both deployment options to deploy the template.

# [PowerShell](#tab/azure-powershell)

```azurepowershell
$projectName = Read-Host -Prompt "Enter the same project name"
$templateFile = Read-Host -Prompt "Enter the template file path and file name"
$resourceGroupName = "${projectName}rg"

New-AzResourceGroupDeployment `
  -Name DeployLocalTemplate `
  -ResourceGroupName $resourceGroupName `
  -TemplateFile $templateFile `
  -projectName $projectName `
  -verbose
```

To learn more about deploying template by using Azure PowerShell, see [Deploy resources with ARM templates and Azure PowerShell](./deploy-powershell.md).

# [Azure CLI](#tab/azure-cli)

```azurecli
echo "Enter the same project name:"
read projectName
echo "Enter the template file path and file name:"
read templateFile
resourceGroupName="${projectName}rg"

az deployment group create \
  --name DeployLocalTemplate \
  --resource-group $resourceGroupName \
  --template-file $templateFile \
  --parameters projectName=$projectName \
  --verbose
```

To learn more about deploying template by using Azure CLI, see [Deploy resources with ARM templates and Azure CLI](./deploy-cli.md).

---

## Clean up resources

Clean up the resources you deployed by deleting the resource group.

1. From the Azure portal, select **Resource group** from the left menu.
2. Enter the resource group name in the **Filter by name** field.
3. Select the resource group name.
4. Select **Delete resource group** from the top menu.

## Next steps

You learned how to deploy a local template. In the next tutorial, you separate the template into a main template and a linked template, and learn how to store and secure the linked template.

> [!div class="nextstepaction"]
> [Deploy a linked template](./deployment-tutorial-linked-template.md)
