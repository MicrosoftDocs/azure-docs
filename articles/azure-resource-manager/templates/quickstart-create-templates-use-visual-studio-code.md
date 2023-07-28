---
title: Create template - Visual Studio Code
description: Use Visual Studio Code and the Azure Resource Manager tools extension to work on Azure Resource Manager templates (ARM templates).
ms.date: 07/28/2023
ms.topic: quickstart
ms.custom: mode-ui, devx-track-arm-template
#Customer intent: As a developer new to Azure deployment, I want to learn how to use Visual Studio Code to create and edit Resource Manager templates, so I can use the templates to deploy Azure resources.
---

# Quickstart: Create ARM templates with Visual Studio Code

The Azure Resource Manager Tools for Visual Studio Code provide language support, resource snippets, and resource autocompletion. These tools help create and validate Azure Resource Manager templates (ARM templates), and are therefore the recommended method of ARM template creation and configuration. In this quickstart, you use the extension to create an ARM template from scratch. While doing so you experience the extensions capabilities such as ARM template snippets, validation, completions, and parameter file support.

To complete this quickstart, you need [Visual Studio Code](https://code.visualstudio.com/), with the [Azure Resource Manager tools extension](https://marketplace.visualstudio.com/items?itemName=msazurermtools.azurerm-vscode-tools) installed. You also need either the [Azure CLI](/cli/azure/) or the [Azure PowerShell module](/powershell/azure/new-azureps-module-az) installed and authenticated.

If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

> [!TIP]
> We recommend [Bicep](../bicep/overview.md) because it offers the same capabilities as ARM templates and the syntax is easier to use. To learn more, see [Quickstart: Create Bicep files with Visual Studio Code](../bicep/quickstart-create-bicep-use-visual-studio-code.md).

## Create an ARM template

Create and open with Visual Studio Code a new file named *azuredeploy.json*. Enter `arm` into the code editor, which initiates Azure Resource Manager snippets for scaffolding out an ARM template.

Select `arm!` to create a template scoped for an Azure resource group deployment.

:::image type="content" source="./media/quickstart-create-templates-use-visual-studio-code/1.png" alt-text="Screenshot showing Azure Resource Manager scaffolding snippets.":::

This snippet creates the basic building blocks for an ARM template.

:::image type="content" source="./media/quickstart-create-templates-use-visual-studio-code/2.png" alt-text="Screenshot showing a fully scaffolded ARM template.":::

Notice that the Visual Studio Code language mode has changed from *JSON* to *Azure Resource Manager Template*. The extension includes a language server specific to ARM templates that provides ARM template-specific validation, completion, and other language services.

:::image type="content" source="./media/quickstart-create-templates-use-visual-studio-code/3.png" alt-text="Screenshot showing Azure Resource Manager as the Visual Studio Code language mode.":::

## Add an Azure resource

The extension includes snippets for many Azure resources. These snippets can be used to easily add resources to your template deployment.

Place the cursor in the template **resources** block, type in `storage`, and select the *arm-storage* snippet.

:::image type="content" source="./media/quickstart-create-templates-use-visual-studio-code/4.png" alt-text="Screenshot showing a resource being added to the ARM template.":::

This action adds a storage resource to the template.

:::image type="content" source="./media/quickstart-create-templates-use-visual-studio-code/5.png" alt-text="Screenshot showing an Azure Storage resource in an ARM template.":::

The **tab** key can be used to tab through configurable properties on the storage account.

:::image type="content" source="./media/quickstart-create-templates-use-visual-studio-code/6.png" alt-text="Screenshot showing how the tab key can be used to navigate through resource configuration.":::

## Completion and validation

One of the most powerful capabilities of the extension is its integration with Azure schemas. Azure schemas provide the extension with validation and resource-aware completion capabilities. Let's modify the storage account to see validation and completion in action.

First, update the storage account kind to an invalid value such as `megaStorage`. Notice that this action produces a warning indicating that `megaStorage` isn't a valid value.

:::image type="content" source="./media/quickstart-create-templates-use-visual-studio-code/7.png" alt-text="Screenshot showing an invalid storage configuration.":::

To use the completion capabilities, remove `megaStorage`, place the cursor inside of the double quotes, and press `ctrl` + `space`. This action presents a completion list of valid values.

:::image type="content" source="./media/quickstart-create-templates-use-visual-studio-code/8.png" alt-text="Screenshot showing extension auto-completion.":::

## Add template parameters

Now create and use a parameter to specify the storage account name.

Place your cursor in the parameters block, add a carriage return, type `"`, and then select the `new-parameter` snippet. This action adds a generic parameter to the template.

:::image type="content" source="./media/quickstart-create-templates-use-visual-studio-code/9.png" alt-text="Screenshot showing a parameter being added to the ARM template.":::

Update the name of the parameter to `storageAccountName` and the description to `Storage Account Name`.

:::image type="content" source="./media/quickstart-create-templates-use-visual-studio-code/10.png" alt-text="Screenshot showing the completed parameter in an ARM template.":::

Azure storage account names have a minimum length of 3 characters and a maximum of 24. Add both `minLength` and `maxLength` to the parameter and provide appropriate values.

:::image type="content" source="./media/quickstart-create-templates-use-visual-studio-code/11.png" alt-text="Screenshot showing minLength and maxLength being added to an ARM template parameter.":::

Now, on the storage resource, update the name property to use the parameter. To do so, remove the current name. Enter a double quote and an opening square bracket `[`, which produces a list of ARM template functions. Select *parameters* from the list.

:::image type="content" source="./media/quickstart-create-templates-use-visual-studio-code/12.png" alt-text="Screenshot showing auto-completion when using parameters in ARM template resources.":::

Entering a single quote `'` inside of the round brackets produces a list of all parameters defined in the template, in this case, *storageAccountName*. Select the parameter.

:::image type="content" source="./media/quickstart-create-templates-use-visual-studio-code/13.png" alt-text="Screenshot showing completed parameter in an ARM template resource.":::

## Create a parameter file

An ARM template parameter file allows you to store environment-specific parameter values and pass these values in as a group at deployment time. For example, you may have a parameter file with values specific to a test environment and another for a production environment.

The extension makes it easy to create a parameter file from your existing templates. To do so, right-click on the template in the code editor and select `Select/Create Parameter File`.

:::image type="content" source="./media/quickstart-create-templates-use-visual-studio-code/14.png" alt-text="Screenshot showing the right-click process for creating a parameter file from an ARM template.":::

Select `New` > `All Parameters` > Select a name and location for the parameter file.

This action creates a new parameter file and maps it with the template from which it was created. You can see and modify the current template/parameter file mapping in the Visual Studio Code status bar while the template is selected.

:::image type="content" source="./media/quickstart-create-templates-use-visual-studio-code/16.png" alt-text="Screenshot showing the template/parameter file mapping in the Visual Studio Code status bar.":::

Now that the parameter file has been mapped to the template, the extension validates both the template and parameter file together. To see this validation in practice, add a two-character value to the `storageAccountName` parameter in the parameter file and save the file.

:::image type="content" source="./media/quickstart-create-templates-use-visual-studio-code/17.png" alt-text="Screenshot showing an invalidated template due to parameter file issue.":::

Navigate back to the ARM template and notice that an error has been raised indicating that the value doesn't meet the parameter criteria.

:::image type="content" source="./media/quickstart-create-templates-use-visual-studio-code/18.png" alt-text="Screenshot showing a valid ARM template.":::

Update the value to something appropriate, save the file, and navigate back to the template. Notice that the error on the parameter has been resolved.

## Deploy the template

Open the integrated Visual Studio Code terminal using the `ctrl` + ```` ` ```` key combination and use either the Azure CLI or Azure PowerShell module to deploy the template.

# [CLI](#tab/CLI)

```azurecli
az group create --name arm-vscode --location eastus

az deployment group create --resource-group arm-vscode --template-file azuredeploy.json --parameters azuredeploy.parameters.json
```

# [PowerShell](#tab/PowerShell)

```azurepowershell
New-AzResourceGroup -Name arm-vscode -Location eastus

New-AzResourceGroupDeployment -ResourceGroupName arm-vscode -TemplateFile ./azuredeploy.json -TemplateParameterFile ./azuredeploy.parameters.json
```
---

## Clean up resources

When the Azure resources are no longer needed, use the Azure CLI or Azure PowerShell module to delete the quickstart resource group.

# [CLI](#tab/CLI)

```azurecli
az group delete --name arm-vscode
```

# [PowerShell](#tab/PowerShell)

```azurepowershell
Remove-AzResourceGroup -Name arm-vscode
```
---

## Next steps

> [!div class="nextstepaction"]
> [Beginner tutorials](./template-tutorial-create-first-template.md)
