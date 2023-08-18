---
title: Create Bicep files - Visual Studio
description: Use Visual Studio and the Bicep extension to create Bicep files for deploy Azure resources.
ms.date: 09/12/2022
ms.topic: quickstart
ms.custom: devx-track-bicep
#Customer intent: As a developer new to Azure deployment, I want to learn how to use Visual Studio to create and edit Bicep files, so I can use them to deploy Azure resources.
---

# Quickstart: Create Bicep files with Visual Studio

This quickstart guides you through the steps to create a [Bicep file](overview.md) with Visual Studio. You'll create a storage account and a virtual network. You'll also learn how the Bicep extension simplifies development by providing type safety, syntax validation, and autocompletion.

Similar authoring experience is also supported in Visual Studio Code.  See [Quickstart: Create Bicep files with Visual Studio Code](./quickstart-create-bicep-use-visual-studio-code.md).

## Prerequisites

- Azure Subscription. If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.
- Visual Studio version 17.3.0 preview 3 or newer.  See [Visual Studio Preview](https://visualstudio.microsoft.com/vs/preview/).
- Visual Studio Bicep extension.  See [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.visualstudiobicep).
- Bicep file deployment requires either the latest [Azure CLI](/cli/azure/) or the latest [Azure PowerShell module](/powershell/azure/new-azureps-module-az).

## Add resource snippet

Launch Visual Studio and create a new file named **main.bicep**.

Visual Studio with the Bicep extension simplifies development by providing pre-defined snippets. In this quickstart, you'll add a snippet that creates a virtual network.

In *main.bicep*, type **vnet**. Select **res-vnet** from the list, and then press **[TAB]** or **[ENTER]**.

:::image type="content" source="./media/quickstart-create-bicep-use-visual-studio/add-snippet.png" alt-text="Screenshot of adding snippet for virtual network.":::

> [!TIP]
> If you don't see those intellisense options in Visual Studio, make sure you've installed the Bicep extension as specified in [Prerequisites](#prerequisites). If you have installed the extension, give the Bicep language service some time to start after opening your Bicep file. It usually starts quickly, but you will not have intellisense options until it starts.

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

This snippet contains all of the values you need to define a virtual network. However, you can modify this code to meet your requirements. For example, `name` isn't a great name for the virtual network. Change the `name` property to `exampleVnet`.

```bicep
name: 'exampleVnet'
```

Notice **location** has a red curly underline. This indicates a problem. Hover your cursor over **location**. The error message is - *The name "location" doesn't exist in the current context.*  We'll create a location parameter in the next section.

## Add parameters

Now, we'll add two parameters for the storage account name and the location. At the top of file, add:

```bicep
param storageName
```

When you add a space after **storageName**, notice that intellisense offers the data types that are available for the parameter. Select **string**.

:::image type="content" source="./media/quickstart-create-bicep-use-visual-studio/add-param.png" alt-text="Screenshot of adding string type to parameter.":::

You have the following parameter:

```bicep
param storageName string
```

This parameter works fine, but storage accounts have limits on the length of the name. The name must have at least 3 characters and no more than 24 characters. You can specify those requirements by adding decorators to the parameter.

Add a line above the parameter, and type **@**. You see the available decorators. Notice there are decorators for both **minLength** and **maxLength**.

:::image type="content" source="./media/quickstart-create-bicep-use-visual-studio/add-decorators.png" alt-text="Screenshot of adding decorators to parameter.":::

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

The storage account name parameter is ready to use.

Add another location parameter:

```bicep
param location string = resourceGroup().location
```

## Add resource

Instead of using a snippet to define the storage account, we'll use intellisense to set the values. Intellisense makes this step much easier than having to manually type the values.

To define a resource, use the `resource` keyword.  Below your virtual network, type **resource exampleStorage**:

```bicep
resource exampleStorage
```

**exampleStorage** is a symbolic name for the resource you're deploying. You can use this name to reference the resource in other parts of your Bicep file.

When you add a space after the symbolic name, a list of resource types is displayed. Continue typing **storage** until you can select it from the available options.

:::image type="content" source="./media/quickstart-create-bicep-use-visual-studio/select-resource-type.png" alt-text="Screenshot of selecting storage accounts for resource type.":::

After selecting **Microsoft.Storage/storageAccounts**, you're presented with the available API versions. Select **2021-09-01** or the latest API version. We recommend using the latest API version.

:::image type="content" source="./media/quickstart-create-bicep-use-visual-studio/select-api-version.png" alt-text="Screenshot of selecting API version for resource type.":::

After the single quote for the resource type, add `=` and a space. You're presented with options for adding properties to the resource. Select **required-properties**.

:::image type="content" source="./media/quickstart-create-bicep-use-visual-studio/select-required-properties.png" alt-text="Screenshot of adding required properties.":::

This option adds all of the properties for the resource type that are required for deployment. After selecting this option, your storage account has the following properties:

```bicep
resource exampleStorage 'Microsoft.Storage/storageAccounts@2021-09-01' = {
	name: 1
	location: 2
	sku: {
		name: 3
	}
	kind: 4
}
```

There are four placeholders in the code. Use [TAB] to go through them and enter the values. Again, intellisense helps you. Set `name` to **storageName**, which is the parameter that contains a name for the storage account. For `location`, set it to `location`. When adding SKU name and kind, intellisense presents the valid options.

When you've finished, you have:

```bicep
@minLength(3)
@maxLength(24)
@description('Provide a name for the storage account. Use only lower case letters and numbers. The name must be unique across Azure.')
param storageName string
param location string = resourceGroup().location

resource virtualNetwork 'Microsoft.Network/virtualNetworks@2019-11-01' = {
  name: storageName
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

resource exampleStorage 'Microsoft.Storage/storageAccounts@2021-09-01' = {
  name: storageName
  location: location
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
}
```

For more information about the Bicep syntax, see [Bicep structure](./file.md).

## Deploy the Bicep file

Bicep file deployment can't be done from Visual Studio yet.  You can deploy the Bicep file by using Azure CLI or Azure PowerShell:

# [CLI](#tab/CLI)

```azurecli
az group create --name exampleRG --location eastus

az deployment group create --resource-group exampleRG --template-file main.bicep --parameters storageName=uniquename
```

# [PowerShell](#tab/PowerShell)

```azurepowershell
New-AzResourceGroup -Name exampleRG -Location eastus

New-AzResourceGroupDeployment -ResourceGroupName exampleRG -TemplateFile ./main.bicep -storageName "uniquename"
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
