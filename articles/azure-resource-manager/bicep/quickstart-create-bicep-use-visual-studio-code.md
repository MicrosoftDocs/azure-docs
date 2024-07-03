---
title: Create Bicep files - Visual Studio Code
description: Use Visual Studio Code and the Bicep extension to Bicep files for deploy Azure resources
ms.date: 03/20/2024
ms.topic: quickstart
ms.custom: mode-ui, devx-track-bicep
#Customer intent: As a developer new to Azure deployment, I want to learn how to use Visual Studio Code to create and edit Bicep files, so I can use them to deploy Azure resources.
---

# Quickstart: Create Bicep files with Visual Studio Code

This quickstart guides you through the steps to create a [Bicep file](overview.md) with Visual Studio Code. You create a storage account and a virtual network. You also learn how the Bicep extension simplifies development by providing type safety, syntax validation, and autocompletion.

Similar authoring experience is also supported in Visual Studio.  See [Quickstart: Create Bicep files with Visual Studio](./quickstart-create-bicep-use-visual-studio.md).

## Prerequisites

If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

To set up your environment for Bicep development, see [Install Bicep tools](install.md). After completing those steps, you have [Visual Studio Code](https://code.visualstudio.com/) and the [Bicep extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-bicep). You also have either the latest [Azure CLI](/cli/azure/) or the latest [Azure PowerShell module](/powershell/azure/new-azureps-module-az).

## Add resource snippet

VS Code with the Bicep extension simplifies development by providing predefined snippets. In this quickstart, you add a snippet that creates a virtual network.

Launch Visual Studio Code and create a new file named **main.bicep**.

In *main.bicep*, type **vnet**, and then select **res-vnet** from the list, and then press [TAB] or [ENTER].

:::image type="content" source="./media/quickstart-create-bicep-use-visual-studio-code/add-snippet.png" alt-text="Screenshot of adding snippet for virtual network.":::

> [!TIP]
> If you don't see those intellisense options in VS Code, make sure you've installed the Bicep extension as specified in [Prerequisites](#prerequisites). If you have installed the extension, give the Bicep language service some time to start after opening your Bicep file. It usually starts quickly, but you don't have intellisense options until it starts. A notification in the lower right corner indicates that the service is starting. When that notification disappears, the service is running.

Your Bicep file now contains the following code:

```bicep
resource virtualNetwork 'Microsoft.Network/virtualNetworks@2019-11-01' = {
  name: 'name'
  location: location
  properties: {
    addressSpace: {
      addressPrefixes: [
        '10.0.0.0/16'
      ]
    }
    subnets: [
      {
        name: 'Subnet-1'
        properties: {
          addressPrefix: '10.0.0.0/24'
        }
      }
      {
        name: 'Subnet-2'
        properties: {
          addressPrefix: '10.0.1.0/24'
        }
      }
    ]
  }
}
```

Within this snippet, you find all the necessary values for defining a virtual network. You may notice two curly underlines. A yellow one denotes a warning related to an outdated API version, while a red curly underline signals an error caused by a missing parameter definition.

Remove `@2019-11-01`, and replace it with `@`. Select the latest API version.

:::image type="content" source="./media/quickstart-create-bicep-use-visual-studio-code/update-api-version.png" alt-text="Screenshot of updating API version.":::

You'll fix the missing parameter definition error in the next section.

You can also modify this code to meet your requirements. For example, `name` isn't a great name for the virtual network. Change the `name` property to `examplevnet`.

```bicep
name: 'exampleVNet'
```

## Add parameter

The code snippet you added in the last section misses a parameter definition.

At the top of the file, add:

```bicep
param location
```

When you add a space after **location**, notice that intellisense offers the data types that are available for the parameter. Select **string**.

:::image type="content" source="./media/quickstart-create-bicep-use-visual-studio-code/add-param.png" alt-text="Screenshot of adding string type to parameter.":::

Give the parameter a default value:

```bicep
param location string = resourceGroup().location
```

For more information about the function used in the default value, see [resourceGroup()](./bicep-functions-scope.md#resourcegroup).

Add another parameter for the storage account name with a default value:

```bicep
param storageAccountName string = 'store${uniqueString(resourceGroup().id)}'
```

For more information, see [Interpolation](./data-types.md#strings) and [uniqueString()](./bicep-functions-string.md#uniquestring).

This parameter works fine, but storage accounts have limits on the length of the name. The name must have at least three characters and no more than 24 characters. You can specify those requirements by adding decorators to the parameter.

Add a line above the parameter, and type **@**. You see the available decorators. Notice there are decorators for both **minLength** and **maxLength**.

:::image type="content" source="./media/quickstart-create-bicep-use-visual-studio-code/add-decorators.png" alt-text="Screenshot of adding decorators to parameter.":::

Add both decorators and specify the character limits:

```bicep
@minLength(3)
@maxLength(24)
param storageAccountName string = 'store${uniqueString(resourceGroup().id)}'
```

You can also add a description for the parameter. Include information that helps people deploying the Bicep file understand the value to provide.

```bicep
@minLength(3)
@maxLength(24)
@description('Provide a name for the storage account. Use only lower case letters and numbers. The name must be unique across Azure.')
param storageAccountName string = 'store${uniqueString(resourceGroup().id)}'
```

Your parameters are ready to use.

## Add resource

Instead of using a snippet to define the storage account, you use intellisense to set the values. Intellisense makes this step easier than having to manually type the values.

To define a resource, use the `resource` keyword.  Below your virtual network, type **resource exampleStorage**:

```bicep
resource exampleStorage
```

**exampleStorage** is a symbolic name for the resource you're deploying. You can use this name to reference the resource in other parts of your Bicep file.

When you add a space after the symbolic name, a list of resource types is displayed. Continue typing **storageacc** until you can select it from the available options.

:::image type="content" source="./media/quickstart-create-bicep-use-visual-studio-code/select-resource-type.png" alt-text="Screenshot of selecting storage accounts for resource type.":::

After selecting **Microsoft.Storage/storageAccounts**, you're presented with the available API versions. Select the latest version. For the following screenshot, it is **2023-01-01**.

:::image type="content" source="./media/quickstart-create-bicep-use-visual-studio-code/select-api-version.png" alt-text="Screenshot of select API version for resource type.":::

After the single quote for the resource type, add **=** and a space. You're presented with options for adding properties to the resource. Select **required-properties**.

:::image type="content" source="./media/quickstart-create-bicep-use-visual-studio-code/select-required-properties.png" alt-text="Screenshot of adding required properties.":::

This option adds all of the properties for the resource type that are required for deployment. After selecting this option, your storage account has the following properties:

```bicep
resource exampleStorage 'Microsoft.Storage/storageAccounts@2023-01-01' =  {
  name:
  location:
  sku: {
    name:
  }
  kind:
}
```

You're almost done. Just provide values for those properties.

Again, intellisense helps you. Set `name` to `storageAccountName`, which is the parameter that contains a name for the storage account. For `location`, set it to `location`, which is a parameter you created earlier. When adding `sku.name` and `kind`, intellisense presents the valid options.

When finished, you have:

```bicep
@minLength(3)
@maxLength(24)
param storageAccountName string = 'store${uniqueString(resourceGroup().id)}'

resource virtualNetwork 'Microsoft.Network/virtualNetworks@2019-11-01' = {
  name: 'exampleVNet'
  location: resourceGroup().location
  properties: {
    addressSpace: {
      addressPrefixes: [
        '10.0.0.0/16'
      ]
    }
    subnets: [
      {
        name: 'Subnet-1'
        properties: {
          addressPrefix: '10.0.0.0/24'
        }
      }
      {
        name: 'Subnet-2'
        properties: {
          addressPrefix: '10.0.1.0/24'
        }
      }
    ]
  }
}

resource exampleStorage 'Microsoft.Storage/storageAccounts@2021-02-01' = {
  name: storageAccountName
  location: 'eastus'
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
}
```

For more information about the Bicep syntax, see [Bicep structure](./file.md).

## Visualize resources

You can view a representation of the resources in your file.

From the upper right corner, select the visualizer button to open the Bicep Visualizer.

:::image type="content" source="./media/quickstart-create-bicep-use-visual-studio-code/bicep-visualizer.png" alt-text="Screenshot of Bicep Visualizer.":::

The visualizer shows the resources defined in the Bicep file with the resource dependency information. The two resources defined in this quickstart don't have dependency relationship, so you don't see a connector between the two resources.

:::image type="content" source="./media/quickstart-create-bicep-use-visual-studio-code/bicep-visualizer-visual.png" alt-text="Screenshot of Bicep Visualizer diagram.":::

## Deploy the Bicep file

1. Right-click the Bicep file inside the VS Code, and then select **Deploy Bicep file**.

    :::image type="content" source="./media/quickstart-create-bicep-use-visual-studio-code/vscode-bicep-deploy.png" alt-text="Screenshot of Deploy Bicep file.":::

1. In the **Please enter name for deployment** text box, type **deployStorageAndVNet**, and then press **[ENTER]**.
1. From the **Select Resource Group** listbox on the top, select **Create new Resource Group**.
1. Enter **exampleRG** as the resource group name, and then press **[ENTER]**.
1. Select a location for the resource group, select **Central US** or a location of your choice, and then press **[ENTER]**.
1. From **Select a parameter file**, select **None**.

    :::image type="content" source="./media/quickstart-create-bicep-use-visual-studio-code/vscode-bicep-select-parameter-file.png" alt-text="Screenshot of Select parameter file.":::

It takes a few moments to create the resources. For more information, see [Deploy Bicep files with Visual Studio Code](./deploy-vscode.md).

You can also deploy the Bicep file by using Azure CLI or Azure PowerShell:

# [CLI](#tab/CLI)

```azurecli
az group create --name exampleRG --location eastus

az deployment group create --resource-group exampleRG --template-file main.bicep --parameters storageAccountName=uniquename
```

# [PowerShell](#tab/PowerShell)

```azurepowershell
New-AzResourceGroup -Name exampleRG -Location eastus

New-AzResourceGroupDeployment -ResourceGroupName exampleRG -TemplateFile ./main.bicep -storageAccountName "uniquename"
```

---

When the deployment finishes, you should see a message indicating the deployment succeeded.

## Clean up resources

When the Azure resources are no longer needed, use the Azure CLI or Azure PowerShell module to delete the quickstart resource group.

# [CLI](#tab/CLI)

```azurecli
az group delete --name exampleRG
```

# [PowerShell](#tab/PowerShell)

```azurepowershell
Remove-AzResourceGroup -Name exampleRG
```

---

## Next steps

> [!div class="nextstepaction"]
> [Learn modules for Bicep](learn-bicep.md)
