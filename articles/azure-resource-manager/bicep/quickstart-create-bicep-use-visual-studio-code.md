---
title: Create Bicep files - Visual Studio Code
description: Use Visual Studio Code and the Bicep extension to Bicep files for deploy Azure resources
ms.date: 11/03/2022
ms.topic: quickstart
ms.custom: mode-ui, devx-track-bicep
#Customer intent: As a developer new to Azure deployment, I want to learn how to use Visual Studio Code to create and edit Bicep files, so I can use them to deploy Azure resources.
---

# Quickstart: Create Bicep files with Visual Studio Code

This quickstart guides you through the steps to create a [Bicep file](overview.md) with Visual Studio Code. You'll create a storage account and a virtual network. You'll also learn how the Bicep extension simplifies development by providing type safety, syntax validation, and autocompletion.

Similar authoring experience is also supported in Visual Studio.  See [Quickstart: Create Bicep files with Visual Studio](./quickstart-create-bicep-use-visual-studio.md).

## Prerequisites

If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

To set up your environment for Bicep development, see [Install Bicep tools](install.md). After completing those steps, you'll have [Visual Studio Code](https://code.visualstudio.com/) and the [Bicep extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-bicep). You also have either the latest [Azure CLI](/cli/azure/) or the latest [Azure PowerShell module](/powershell/azure/new-azureps-module-az).

## Add resource snippet

Launch Visual Studio Code and create a new file named *main.bicep*.

VS Code with the Bicep extension simplifies development by providing pre-defined snippets. In this quickstart, you'll add a snippet that creates a virtual network.

In *main.bicep*, type **vnet**. Select **res-vnet** from the list, and then Tab or Enter.

:::image type="content" source="./media/quickstart-create-bicep-use-visual-studio-code/add-snippet.png" alt-text="Add snippet for virtual network":::

> [!TIP]
> If you don't see those intellisense options in VS Code, make sure you've installed the Bicep extension as specified in [Prerequisites](#prerequisites). If you have installed the extension, give the Bicep language service some time to start after opening your Bicep file. It usually starts quickly, but you will not have intellisense options until it starts. A notification in the lower right corner indicates that the service is starting. When that notification disappears, the service is running.

Your Bicep file now contains the following code:

```bicep
resource virtualNetwork 'Microsoft.Network/virtualNetworks@2019-11-01' = {
  name: 'name'
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

This snippet contains all of the values you need to define a virtual network. However, you can modify this code to meet your requirements. For example, `name` isn't a great name for the virtual network. Change the `name` property to `examplevnet`.

```bicep
name: 'examplevnet'
```

You could deploy this Bicep file, but we'll add a parameter and storage account before deploying.

## Add parameter

Now, we'll add a parameter for the storage account name. At the top of file, add:

```bicep
param storageName
```

When you add a space after **storageName**, notice that intellisense offers the data types that are available for the parameter. Select **string**.

:::image type="content" source="./media/quickstart-create-bicep-use-visual-studio-code/add-param.png" alt-text="Add string type to parameter":::

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

Your parameter is ready to use.

## Add resource

Instead of using a snippet to define the storage account, we'll use intellisense to set the values. Intellisense makes this step much easier than having to manually type the values.

To define a resource, use the `resource` keyword.  Below your virtual network, type **resource exampleStorage**:

```bicep
resource exampleStorage
```

**exampleStorage** is a symbolic name for the resource you're deploying. You can use this name to reference the resource in other parts of your Bicep file.

When you add a space after the symbolic name, a list of resource types is displayed. Continue typing **storage** until you can select it from the available options.

:::image type="content" source="./media/quickstart-create-bicep-use-visual-studio-code/select-resource-type.png" alt-text="Select storage accounts for resource type":::

After selecting **Microsoft.Storage/storageAccounts**, you're presented with the available API versions. Select **2021-02-01**.

:::image type="content" source="./media/quickstart-create-bicep-use-visual-studio-code/select-api-version.png" alt-text="Select API version for resource type":::

After the single quote for the resource type, add `=` and a space. You're presented with options for adding properties to the resource. Select **required-properties**.

:::image type="content" source="./media/quickstart-create-bicep-use-visual-studio-code/select-required-properties.png" alt-text="Add required properties":::

This option adds all of the properties for the resource type that are required for deployment. After selecting this option, your storage account has the following properties:

```bicep
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

Again, intellisense helps you. Set `name` to `storageName`, which is the parameter that contains a name for the storage account. For `location`, set it to `'eastus'`. When adding SKU name and kind, intellisense presents the valid options.

When you've finished, you have:

```bicep
@minLength(3)
@maxLength(24)
param storageName string

resource virtualNetwork 'Microsoft.Network/virtualNetworks@2019-11-01' = {
  name: 'examplevnet'
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
  name: storageName
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

:::image type="content" source="./media/quickstart-create-bicep-use-visual-studio-code/bicep-visualizer.png" alt-text="Bicep Visualizer":::

The visualizer shows the resources defined in the Bicep file with the resource dependency information. The two resources defined in this quickstart don't have dependency relationship, so you don't see a connector between the two resources.

## Deploy the Bicep file

1. Right-click the Bicep file inside the VSCode, and then select **Deploy Bicep file**.

    :::image type="content" source="./media/quickstart-create-bicep-use-visual-studio-code/vscode-bicep-deploy.png" alt-text="Screenshot of Deploy Bicep file.":::

1. From the **Select Resource Group** listbox on the top, select **Create new Resource Group**.
1. Enter **exampleRG** as the resource group name, and then press **[ENTER]**.
1. Select a location for the resource group, and then press **[ENTER]**.
1. From **Select a parameter file**, select **None**.

    :::image type="content" source="./media/quickstart-create-bicep-use-visual-studio-code/vscode-bicep-select-parameter-file.png" alt-text="Screenshot of Select parameter file.":::

1. Enter a unique storage account name, and then press **[ENTER]**. If you get an error message indicating the storage account is already taken, the storage name you provided is in use. Provide a name that is more likely to be unique.
1. From **Create parameters file from values used in this deployment?**, select **No**.

It takes a few moments to create the resources. For more information, see [Deploy Bicep files with visual Studio Code](./deploy-vscode.md).

You can also deploy the Bicep file by using Azure CLI or Azure PowerShell:

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
