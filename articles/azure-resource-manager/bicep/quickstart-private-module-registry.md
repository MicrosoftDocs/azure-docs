---
title: Publish modules to private module registry
description: Publish Bicep modules to private module registry and use the modules.
ms.date: 04/18/2023
ms.topic: quickstart
ms.custom: mode-api, devx-track-bicep
#Customer intent: As a developer new to Azure deployment, I want to learn how to publish Bicep modules to private module registry.
---

# Quickstart: Publish Bicep modules to private module registry

Learn how to publish Bicep modules to private modules registry, and how to call the modules from your Bicep files. Private module registry allows you to share Bicep modules within your organization.  To learn more, see [Create private registry for Bicep modules](./private-module-registry.md). To contribute to the public module registry, see the [contribution guide](https://github.com/Azure/bicep-registry-modules/blob/main/CONTRIBUTING.md).

## Prerequisites

If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

To work with module registries, you must have [Bicep CLI](./install.md) version **0.4.1008** or later. To use with [Azure CLI](/cli/azure/install-azure-cli), you must also have Azure CLI version **2.31.0** or later; to use with [Azure PowerShell](/powershell/azure/install-azure-powershell), you must also have Azure PowerShell version **7.0.0** or later.

A Bicep registry is hosted on [Azure Container Registry (ACR)](../../container-registry/container-registry-intro.md). To create one, see [Quickstart: Create a container registry by using a Bicep file](../../container-registry/container-registry-get-started-bicep.md).

To set up your environment for Bicep development, see [Install Bicep tools](install.md). After completing those steps, you'll have [Visual Studio Code](https://code.visualstudio.com/) and the [Bicep extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-bicep), or [Visual Studio](https://visualstudio.microsoft.com/) and the [Bicep extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.visualstudiobicep).

## Create Bicep modules

A module is a Bicep file that is deployed from another Bicep file. Any Bicep file can be used as a module. You can use the following Bicep file in this quickstart.  It creates a storage account:

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

Save the Bicep file as **storage.bicep**.

## Publish modules

If you don't have an Azure container registry (ACR), see [Prerequisites](#prerequisites) to create one.  The login server name of the ACR is needed. The format of the login server name is: `<registry-name>.azurecr.io`. To get the login server name:

# [Azure CLI](#tab/azure-cli)

```azurecli
az acr show --resource-group <resource-group-name> --name <registry-name> --query loginServer
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
Get-AzContainerRegistry -ResourceGroupName "<resource-group-name>" -Name "<registry-name>"  | Select-Object LoginServer
```

---

Use the following syntax to publish a Bicep file as a module to a private module registry.

# [Azure CLI](#tab/azure-cli)

```azurecli
az bicep publish --file storage.bicep --target br:exampleregistry.azurecr.io/bicep/modules/storage:v1 --documentationUri https://www.contoso.com/exampleregistry.html
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
Publish-AzBicepModule -FilePath ./storage.bicep -Target br:exampleregistry.azurecr.io/bicep/modules/storage:v1 -DocumentationUri https://www.contoso.com/exampleregistry.html
```

---

In the preceding sample, **./storage.bicep** is the Bicep file to be published. Update the file path if needed.  The module path has the following syntax:

```bicep
br:<registry-name>.azurecr.io/<file-path>:<tag>
```

- **br** is the schema name for a Bicep registry.
- **file path** is called `repository` in Azure Container Registry. The **file path** can contain segments that are separated by the `/` character. This file path is created if it doesn't exist in the registry.
- **tag** is used for specifying a version for the module.

To verify the published modules, you can list the ACR repository:

# [Azure CLI](#tab/azure-cli)

```azurecli
az acr repository list --name <registry-name> --output table
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
Get-AzContainerRegistryRepository -RegistryName <registry-name>
```

---

## Call modules

To call a module, create a new Bicep file in Visual Studio Code. In the new Bicep file, enter the following line.

```bicep
module stgModule 'br:<registry-name>.azurecr.io/bicep/modules/storage:v1'
```

Replace **&lt;registry-name>** with your ACR registry name.  It takes a short moment to restore the module to your local cache. After the module is restored, the red curly line underneath the module path will go away. At the end of the line,  add **=** and a space, and then select **required-properties** as shown in the following screenshot.  The module structure is automatically populated.

:::image type="content" source="./media/quickstart-private-module-registry/visual-studio-code-required-properties.png" alt-text="Visual Studio Code Bicep extension required properties":::

The following example is a completed Bicep file.

```bicep
@minLength(3)
@maxLength(11)
param namePrefix string
param location string = resourceGroup().location

module stgModule 'br:ace1207.azurecr.io/bicep/modules/storage:v1' = {
  name: 'stgStorage'
  params: {
    location: location
    storagePrefix: namePrefix
  }
}
```

Save the Bicep file locally, and then use Azure CLI or Azure PowerShell to deploy the Bicep file:

# [Azure CLI](#tab/azure-cli)

```azurecli
resourceGroupName = "{provide-a-resource-group-name}"
templateFile="{provide-the-path-to-the-bicep-file}"

az group create --name $resourceGroupName --location eastus

az deployment group create --resource-group $resourceGroupName --template-file $templateFile
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
$resourceGroupName = "{provide-a-resource-group-name}"
$templateFile = "{provide-the-path-to-the-bicep-file}"

New-AzResourceGroup -Name $resourceGroupName -Location eastus

New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName -TemplateFile $templateFile
```

---

From the Azure portal, verify the storage account has been created successfully.

## Clean up resources

When the Azure resources are no longer needed, use the Azure CLI or Azure PowerShell module to delete the quickstart resource group.

# [Azure CLI](#tab/azure-cli)

```azurecli
resourceGroupName = "{provide-the-resource-group-name}"

az group delete --name $resourceGroupName
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
$resourceGroupName = "{provide-the-resource-group-name}"

Remove-AzResourceGroup -Name $resourceGroupName
```

---

## Next steps

> [!div class="nextstepaction"]
> [Learn modules for Bicep](learn-bicep.md)
