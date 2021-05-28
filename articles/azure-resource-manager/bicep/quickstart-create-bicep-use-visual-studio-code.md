---
title: Create Bicep files - Visual Studio Code
description: Use Visual Studio Code and the Bicep extension to Bicep files for deploy Azure resources
ms.date: 06/01/2021
ms.topic: quickstart
ms.custom: devx-track-azurepowershell

#Customer intent: As a developer new to Azure deployment, I want to learn how to use Visual Studio Code to create and edit Bicep files, so I can use them to deploy Azure resources.

---

# Quickstart: Create Bicep files with Visual Studio Code

This quickstart guides you through the steps to create a [Bicep file](overview.md) with Visual Studio Code. You'll create a storage account and a virtual network. You'll see how an extension simplifies development by providing type safety, syntax validation, and autocompletion.

## Prerequisites

If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

To set up your environment for Bicep development, see [Install Bicep tools](install.md). After completing those steps, you'll have [Visual Studio Code](https://code.visualstudio.com/) and the [Bicep extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-bicep). You also have either the latest [Azure CLI](/cli/azure/) or the latest [Azure PowerShell module](/powershell/azure/new-azureps-module-az).

## Add parameter

Launch Visual Studio Code and create a new file named *main.bicep*.

Let's start with something simple. We'll add a parameter. In *main.bicep*, type:

```bicep
param storageName
```

When you add a space after **storageName**, notice that intellisense offers the data types that are available for the parameter.

:::image type="content" source="./media/quickstart-create-bicep-use-visual-studio-code/add-param.png" alt-text="Add string type to parameter":::

Select **string** and Tab or Enter.

You have the following parameter:

```bicep
param storageName string
```

This parameter works fine, but storage accounts have limits on the length of the name. The name must have at least 3 characters and no more than 24 characters. You can specify those requirements by adding decorators to the parameter.

Add a line above the parameter, and type **@**. You see the available decorators. Notice there are decorators for both **minLength** and **maxLength**.

:::image type="content" source="./media/quickstart-create-bicep-use-visual-studio-code/add-decorators.png" alt-text="Add decorators to parameter":::

Add both decorators and specify the character limits, as shown below:

```bicep
@minLength(3)
@maxLength(24)
param storageName string
```

You can also add a description for the parameter. Include information that helps people deploying the Bicep file understand the value to provide.

```bicep
@minLength(3)
@maxLength(24)
@description('Provide a name for the storage account. Use only lower case letters and numbers. The name must be unique across Azure.')
param storageName string
```

Okay, your parameter is ready to use.

Add another parameter for getting the virtual network name:

```bicep
param vnetName string
```

## Add resources

Now, we'll add a storage account. Intellisense makes this step much easier than having to manually type all of the values.

You define a resource with the `resource` keyword.  Below your parameter, type **resource exampleStorage**:

```bicep
@minLength(3)
@maxLength(24)
@description('Provide a name for the storage account. Use only lower case letters and numbers. The name must be unique across Azure.')
param storageName string

param vnetName string

resource exampleStorage
```

**exampleStorage** is a symbolic name for the resource you're deploying. It makes it easy to reference the resource in other parts of your Bicep file.

When you add a space after the symbolic name, a list of resource types is displayed. Continue typing **storage** until you can select it from the available options.

:::image type="content" source="./media/quickstart-create-bicep-use-visual-studio-code/select-resource-type.png" alt-text="Select storage accounts for resource type":::

After selecting **Microsoft.Storage/storageAccounts**, you're presented with the available API versions. Select the latest version.

:::image type="content" source="./media/quickstart-create-bicep-use-visual-studio-code/select-api-version.png" alt-text="Select API version for resource type":::

You have the following syntax in your file, but you're not done defining the resource.

```bicep
@minLength(3)
@maxLength(24)
@description('Provide a name for the storage account. Use only lower case letters and numbers. The name must be unique across Azure.')
param storageName string

param vnetName string

resource exampleStorage 'Microsoft.Storage/storageAccounts@2021-02-01'
```

After the single quote for the resource type, add **=** and a space. You're presented with options for adding properties to the resource. Select **required-properties**.

:::image type="content" source="./media/quickstart-create-bicep-use-visual-studio-code/select-required-properties.png" alt-text="Add required properties":::

This option adds all of the properties for the resource type that are required for deployment. After selecting this option, you have:

```bicep
@minLength(3)
@maxLength(24)
@description('Provide a name for the storage account. Use only lower case letters and numbers. The name must be unique across Azure.')
param storageName string

param vnetName string

resource exampleStorage 'Microsoft.Storage/storageAccounts@2021-02-01' = {
  name:
  location:
  sku: {
    name:
  }
  kind:

}
```

You're almost done. Just provide values for those properties.

Again, intellisense helps you. For `name`, provide the parameter that contains a name for the storage account. For `location`, set it to `eastus`. When adding SKU name and kind, intellisense presents the valid options. When you've finished, you have:

```bicep
@minLength(3)
@maxLength(24)
@description('Provide a name for the storage account. Use only lower case letters and numbers. The name must be unique across Azure.')
param storageName string

param vnetName string

resource exampleStorage 'Microsoft.Storage/storageAccounts@2021-02-01' = {
  name: storageName
  location: 'eastus'
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
}
```

For more information about the Bicep syntax, see [Bicep structure](./file.md).

Now, let's add another virtual network resource by using resource snippets.

After the *exampleStorage* storage account, type **vnet**, select **res-vnet** from the list, and then Tab.

:::image type="content" source="./media/quickstart-create-bicep-use-visual-studio-code/add-vnet.png" alt-text="Add virtual network resource":::

Change the virtual machine resource identifier from **virtualNetwork** to **exampleVnet**. And replace the **name** property of the virtual network resource to **vnetName**.

The completed template looks like:

```bicep
@minLength(3)
@maxLength(24)
@description('Provide a name for the storage account. Use only lower case letters and numbers. The name must be unique across Azure.')
param storageName string

param vnetName string

resource exampleStorage 'Microsoft.Storage/storageAccounts@2021-02-01' = {
  name: storageName
  location: 'eastus'
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
}

resource exampleVnet 'Microsoft.Network/virtualNetworks@2019-11-01' = {
  name: vnetName
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
```

From the upper left corner, select the visualizer button to open the Bicep Visualizer.

:::image type="content" source="./media/quickstart-create-bicep-use-visual-studio-code/bicep-visualizer.png" alt-text="Bicep Visualizer":::

The visualizer shows the resources defined in the Bicep file with the resource dependency information.  The two resources defined in this quickstart doesn't have dependency relationship. So you don't see a connector between the two resources. 

## Deploy the Bicep file

To deploy the file you've created, open PowerShell or Azure CLI. If you want to use the integrated Visual Studio Code terminal, select the `ctrl` + ```` ` ```` key combination. Change the current directory to where the Bicep file is located.

# [CLI](#tab/CLI)

```azurecli
az group create --name exampleRG --location eastus

az deployment group create --resource-group exampleRG --template-file main.bicep --parameters storageName={your-unique-name}
```

# [PowerShell](#tab/PowerShell)

```azurepowershell
New-AzResourceGroup -Name exampleRG -Location eastus

New-AzResourceGroupDeployment -ResourceGroupName exampleRG -TemplateFile ./main.bicep -storageName "{your-unique-name}"
```

---

When the deployment finishes, you should see a message indicating the deployment succeeded. If you get an error message indicating the storage account is already taken, the storage name you provided is in use. Provide a name that is more likely to be unique.

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
> [Deploy Azure resources by using Bicep templates](/learn/modules/deploy-azure-resources-by-using-bicep-templates/)
