---
title: Tutorial - Deploy a local Azure Resource Manager template
description: Learn how to deploy an Azure Resource Manager template from your local computer
ms.date: 02/26/2020
ms.topic: tutorial
ms.author: jgao
---

# Tutorial: Deploy a local Azure Resource Manager template

Learn how to deploy an Azure Resource Manager template from your local machine. It takes about **8 minutes** to complete.

This tutorial is the first of a series. As you progress through the series, you deploy a remote template, you modularize the template by creating a linked template, and you learn how to secure the linked template by using SAS token. This series focuses on template deployment.  If you want to learn template development, see the [beginner tutorials](./template-tutorial-create-first-template.md).

## Get tools

Let's start by making sure you have the tools you need to deploy templates.

### Command-line deployment

You  need either Azure PowerShell or Azure CLI to deploy the template. For the installation instructions, see:

- [Install Azure PowerShell](/powershell/azure/install-az-ps)
- [Install Azure CLI on Windows](/cli/azure/install-azure-cli-windows)
- [Install Azure CLI on Linux](/cli/azure/install-azure-cli-linux)

After installing either Azure PowerShell or Azure CLI, make sure you sign in for the first time. For help, see [Sign in - PowerShell](/powershell/azure/install-az-ps#sign-in) or [Sign in - Azure CLI](/cli/azure/get-started-with-azure-cli#sign-in).

### Editor (Optional)

Templates are JSON files. To review/edit templates, you need a good JSON editor. We recommend Visual Studio Code with the Resource Manager Tools extension. If you need to install these tools, see [Use Visual Studio Code to create Azure Resource Manager templates](use-vs-code-to-create-template.md).

## Review template

The template used in this tutorial is similar to the template used in the [tutorial about Quickstart templates](template-tutorial-quickstart-template.md). If you are interested in creating the template, you can go through that tutorial. However it's not required for completing this tutorial.

The template deploys a storage account, app service plan, and web app.

:::code language="json" source="~/resourcemanager-templates/get-started-deployment/local-template/azuredeploy.json":::

Save a copy of the template to your local computer. You will deploy this template.

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

## Create resource group

When you deploy a template, you specify a resource group that will contain the resources. Before running the deployment command, create the resource group with either Azure CLI or Azure PowerShell. Select the tabs in the following code section to choose between Azure PowerShell and Azure CLI. The CLI examples in this article are written for the Bash shell.

# [PowerShell](#tab/azure-powershell)

```azurepowershell
New-AzResourceGroup `
  -Name myResourceGroup `
  -Location "Central US"
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az group create \
  --name myResourceGroup \
  --location "Central US"
```

---

## Deploy template

Use one or both deployment options to deploy the template.

# [PowerShell](#tab/azure-powershell)

```azurepowershell
$projectName = Read-Host -Prompt "Enter a project name that is used to generate resource names"
$templateFile = Read-Host -Prompt "Enter the template file path and file name"

New-AzResourceGroupDeployment `
  -Name DeployLocalTemplate `
  -ResourceGroupName myResourceGroup `
  -TemplateFile $templateFile `
  -projectName $projectName `
  -verbose
```

To learn more about deploying template by using Azure PowerShell, see [Deploy resources with Resource Manager templates and Azure PowerShell](./deploy-powershell.md).

# [Azure CLI](#tab/azure-cli)

```azurecli
echo "Enter a project name that is used to generate resource names:"
read projectName
echo "Enter the template file path and file name:"
read templateFile

az group deployment create \
  --name DeployLocalTemplate \
  --resource-group myResourceGroup \
  --template-file $templateFile \
  --parameters projectname=$projectName \
  --verbose
```

To learn more about deploying template by using Azure CLI, see [Deploy resources with Resource Manager templates and Azure CLI](./deploy-cli.md).

---

## Clean up resources

If you're moving on to the next tutorial, you don't need to delete the resource group.

If you're stopping now, you might want to clean up the resources you deployed by deleting the resource group.

1. From the Azure portal, select **Resource group** from the left menu.
2. Enter the resource group name in the **Filter by name** field.
3. Select the resource group name.
4. Select **Delete resource group** from the top menu.

## Next steps

You learned how to deploy a local template. In the next tutorial, you upload the template to an Azure storage account, and then deploy the remote template.

> [!div class="nextstepaction"]
> [Deploy a remote template](./deployment-tutorial-remote-template.md)
