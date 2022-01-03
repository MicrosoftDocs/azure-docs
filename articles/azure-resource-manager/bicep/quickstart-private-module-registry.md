---
title: Publish modules to private module registry
description: Publish Bicep modules to private module registry and use the modules.
ms.date: 01/03/2022
ms.topic: quickstart
ms.custom: mode-api
#Customer intent: As a developer new to Azure deployment, I want to learn how to publish Bicep modules to private module registry.
---

# Quickstart: Publish Bicep modules to private module registry

Learn how to publish Bicep modules to private modules registry, and how to call the modules from your Bicep files.

## Prerequisites

If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

To work with module registries, you must have Bicep CLI version **0.4.1008** or later. To use with Azure CLI, you must also have version **2.31.0** or later; to use with Azure PowerShell, you must also have version **7.0.0** or later.

A Bicep registry is hosted on [Azure Container Registry (ACR)](../../container-registry/container-registry-intro.md). To create one, see [Quickstart: Create a container registry by using a Bicep file](../../container-registry/container-registry-get-started-bicep.md).

To set up your environment for Bicep development, see [Install Bicep tools](install.md). After completing those steps, you'll have [Visual Studio Code](https://code.visualstudio.com/) and the [Bicep extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-bicep). You also have either the latest [Azure CLI](/cli/azure/) or the latest [Azure PowerShell module](/powershell/azure/new-azureps-module-az).

## Create Bicep module

A module is just a Bicep file that is deployed from another Bicep file. Any Bicep file can be used as a module. The following Bicep file creates a storage account:

```bicep
@minLength(3)
@maxLength(11)
param storagePrefix string

@allowed([
  'Standard_LRS'
  'Standard_GRS'
  'Standard_RAGRS'
  'Standard_ZRS'
  'Premium_LRS'
  'Premium_ZRS'
  'Standard_GZRS'
  'Standard_RAGZRS'
])
param storageSKU string = 'Standard_LRS'
param location string

var uniqueStorageName = '${storagePrefix}${uniqueString(resourceGroup().id)}'

resource stg 'Microsoft.Storage/storageAccounts@2021-06-01' = {
  name: uniqueStorageName
  location: location
  sku: {
    name: storageSKU
  }
  kind: 'StorageV2'
  properties: {
    supportsHttpsTrafficOnly: true
  }
}

output storageEndpoint object = stg.properties.primaryEndpoints
```

## Publish modules

The login server name of the Azure container registry (ACR) is needed.  The format of the login server name is: `<registry-name>.azurecr.io`. To get the name:

Get the login server name. You need this name when linking to the registry from your Bicep files.

# [PowerShell](#tab/azure-powershell)

To get the login server name, use [Get-AzContainerRegistry](/powershell/module/az.containerregistry/get-azcontainerregistry).

```azurepowershell
Get-AzContainerRegistry -ResourceGroupName "<resource-group-name>" -Name "<registry-name>"  | Select-Object LoginServer
```

# [Azure CLI](#tab/azure-cli)

To get the login server name, use [az acr show](/cli/azure/acr#az_acr_show).

```azurecli
az acr show --resource-group <resource-group-name> --name <registry-name> --query loginServer
```

---

Use the following syntax to publish a Bicep file as a module to a private module registry.  In the sample, **./storage.bicep** is the Bicep file to be published.

# [PowerShell](#tab/azure-powershell)

```azurepowershell
Publish-AzBicepModule -FilePath ./storage.bicep -Target br:exampleregistry.azurecr.io/bicep/modules/storage:v1
```

# [Azure CLI](#tab/azure-cli)

To run this deployment command, you must have the [latest version](/cli/azure/install-azure-cli) of Azure CLI.

```azurecli
az bicep publish --file storage.bicep --target br:exampleregistry.azurecr.io/bicep/modules/storage:v1
```

---



-----------------------

## Create a single instance

In this section, you define a Bicep file for creating a storage account, and then deploy the Bicep file. The subsequent sections provide the Bicep samples for different `for` syntaxes. You can use the same deployment method to deploy and experiment those samples. If your deployment fails, it is likely one of the two causes:

- The storage account name is too long. Storage account names must be between 3 and 24 characters in length and may contain numbers and lowercase letters only.
- The storage account name is not unique. Your storage account name must be unique within Azure.

The following Bicep file defines one storage account:

:::code language="bicep" source="~/azure-docs-bicep-samples/samples/loops-quickstart/createStorage.bicep":::

Save the Bicep file locally, and then use Azure CLI or Azure PowerShell to deploy the Bicep file:

# [CLI](#tab/CLI)

```azurecli
resourceGroupName = "{provide-a-resource-group-name}"
templateFile="{provide-the-path-to-the-bicep-file}"

az group create --name $resourceGroupName --location eastus

az deployment group create --resource-group $resourceGroupName --template-file $templateFile
```

# [PowerShell](#tab/PowerShell)

```azurepowershell
$resourceGroupName = "{provide-a-resource-group-name}"
$templateFile = "{provide-the-path-to-the-bicep-file}"

New-AzResourceGroup -Name $resourceGroupName -Location eastus

New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName -TemplateFile $templateFile
```

---

## Use integer index

A for loop with an index is used in the following sample to create two storage accounts:

:::code language="bicep" source="~/azure-docs-bicep-samples/samples/loops-quickstart/loopNumbered.bicep" highlight="2,4-5":::

The index number is used as a part of the storage account name. After deploying the Bicep file, you get two storage accounts that are similar to:

:::image type="content" source="./media/quickstart-loops/bicep-loop-number-0-2.png" alt-text="Use integer index with 0 as the starting number":::

Inside range(), the first number is the starting number, and the second number is the number of times the loop will run. So if you change it to **range(3,2)**, you will also get two storage accounts:

:::image type="content" source="./media/quickstart-loops/bicep-loop-number-3-2.png" alt-text="Use integer index with 3 as the starting number":::

The output of the preceding sample shows how to reference the resources created in a loop. The output is similar to:

```json
"outputs": {
  "names": {
    "type": "Array",
    "value": [
      {
        "name": "0storage52iyjssggmvue"
      },
      {
        "name": "1storage52iyjssggmvue"
      }
    ]
  }
},
```

## Use array elements

You can loop through an array. The following sample shows an array of strings.

:::code language="bicep" source="~/azure-docs-bicep-samples/samples/loops-quickstart/loopArrayString.bicep" highlight="2-5,7-8":::

The loop uses all the strings in the array as a part of the storage account names. In this case, it creates two storage accounts:

:::image type="content" source="./media/quickstart-loops/bicep-loop-array-string.png" alt-text="Use an array of strings":::

You can also loop through an array of objects. The loop not only customizes the storage account names, but also configures the SKUs.

:::code language="bicep" source="~/azure-docs-bicep-samples/samples/loops-quickstart/loopArrayObject.bicep" highlight="2-11,13-14,17":::

The loop creates two storage accounts. The SKU of the storage account with the name starting with **fabrikam** is **Premium_LRS**.

:::image type="content" source="./media/quickstart-loops/bicep-loop-array-string.png" alt-text="Use an array of strings":::

## Use array and index

In same cases, you might want to combine an array loop with an index loop. The following sample shows how to use the array and the index number for the naming convention.

:::code language="bicep" source="~/azure-docs-bicep-samples/samples/loops-quickstart/loopArrayStringAndNumber.bicep" highlight="2-5,7-8":::

After deploying the preceding sample, you create two storage accounts that are similar to:

:::image type="content" source="./media/quickstart-loops/bicep-loop-array-string-number.png" alt-text="Use an array of strings and index number":::

## Use dictionary object

To iterate over elements in a dictionary object, use the [items function](./bicep-functions-array.md#items), which converts the object to an array. Use the `value` property to get properties on the objects.

:::code language="bicep" source="~/azure-docs-bicep-samples/samples/loops-quickstart/loopObject.bicep" highlight="3-12,14,15,18":::

The loop creates two storage accounts. The SKU of the storage account with the name starting with **fabrikam** is **Premium_LRS**.

:::image type="content" source="./media/quickstart-loops/bicep-loop-dictionary-object.png" alt-text="Use a dictionary object":::

## Loop with condition

For resources and modules, you can add an `if` expression with the loop syntax to conditionally deploy the collection.

:::code language="bicep" source="~/azure-docs-bicep-samples/samples/loops-quickstart/loopWithCondition.bicep" highlight="3,5":::

For more information, see [conditional deployment in Bicep](./conditional-resource-deployment.md).

## Clean up resources

When the Azure resources are no longer needed, use the Azure CLI or Azure PowerShell module to delete the quickstart resource group.

# [CLI](#tab/CLI)

```azurecli
resourceGroupName = "{provide-the-resource-group-name}"

az group delete --name $resourceGroupName
```

# [PowerShell](#tab/PowerShell)

```azurepowershell
$resourceGroupName = "{provide-the-resource-group-name}"

Remove-AzResourceGroup -Name $resourceGroupName
```

---

## Next steps

> [!div class="nextstepaction"]
> [Bicep in Microsoft Learn](learn-bicep.md)
