---
title: Use Bicep to create and publish an Azure Managed Application definition
description: Describes how to use Bicep to create and publish an Azure Managed Application definition in your service catalog.
ms.topic: quickstart
ms.custom: devx-track-azurecli, devx-track-azurepowershell, devx-track-bicep
ms.date: 05/12/2023
---

# Quickstart: Use Bicep to create and publish an Azure Managed Application definition

This quickstart describes how to use Bicep to create and publish an Azure Managed Application definition in your service catalog. The definition's in your service catalog are available to members of your organization.

To create and publish a managed application definition to your service catalog, do the following tasks:

- Use Bicep to develop your template and convert it to an Azure Resource Manager template (ARM template). The template defines the Azure resources deployed by the managed application.
- Convert Bicep to JSON with the Bicep `build` command. After the file is converted to JSON, it's recommended to verify the code for accuracy.
- Define the user interface elements for the portal when deploying the managed application.
- Create a _.zip_ package that contains the required JSON files. The _.zip_ package file has a 120-MB limit for a service catalog's managed application definition.
- Publish the managed application definition so it's available in your service catalog.

If your managed application definition is more than 120 MB or if you want to use your own storage account for your organization's compliance reasons, go to [Quickstart: Bring your own storage to create and publish an Azure Managed Application definition](publish-service-catalog-bring-your-own-storage.md).

You can also use Bicep deploy a managed application definition from your service catalog. For more information, go to [Quickstart: Use Bicep to deploy an Azure Managed Application definition](deploy-bicep-definition.md).

## Prerequisites

To complete the tasks in this article, you need the following items:

- An Azure account with an active subscription and permissions to Microsoft Entra resources like users, groups, or service principals. If you don't have an account, [create a free account](https://azure.microsoft.com/free/) before you begin.
- [Visual Studio Code](https://code.visualstudio.com/) with the latest [Azure Resource Manager Tools extension](https://marketplace.visualstudio.com/items?itemName=msazurermtools.azurerm-vscode-tools). For Bicep files, install the [Bicep extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-bicep).
- Install the latest version of [Azure PowerShell](/powershell/azure/install-az-ps) or [Azure CLI](/cli/azure/install-azure-cli).

## Create a Bicep file

Every managed application definition includes a file named _mainTemplate.json_. The template defines the Azure resources to deploy and is no different than a regular ARM template. You can develop the template using Bicep and then convert the Bicep file to JSON.

Open Visual Studio Code, create a file with the case-sensitive name _mainTemplate.bicep_ and save it.

Add the following Bicep code and save the file. It defines the managed application's resources to deploy an App Service, App Service plan, and a storage account.

```bicep
param location string = resourceGroup().location

@description('App Service plan name.')
@maxLength(40)
param appServicePlanName string

@description('App Service name prefix.')
@maxLength(47)
param appServiceNamePrefix string

@description('Storage account name prefix.')
@maxLength(11)
param storageAccountNamePrefix string

@description('Storage account type allowed values')
@allowed([
  'Premium_LRS'
  'Standard_LRS'
  'Standard_GRS'
])
param storageAccountType string

var appServicePlanSku = 'F1'
var appServicePlanCapacity = 1
var appServiceName = '${appServiceNamePrefix}${uniqueString(resourceGroup().id)}'
var storageAccountName = '${storageAccountNamePrefix}${uniqueString(resourceGroup().id)}'
var appServiceStorageConnectionString = 'DefaultEndpointsProtocol=https;AccountName=${storageAccount.name};EndpointSuffix=${environment().suffixes.storage};Key=${storageAccount.listKeys().keys[0].value}'

resource appServicePlan 'Microsoft.Web/serverfarms@2022-03-01' = {
  name: appServicePlanName
  location: location
  sku: {
    name: appServicePlanSku
    capacity: appServicePlanCapacity
  }
}

resource appServiceApp 'Microsoft.Web/sites@2022-03-01' = {
  name: appServiceName
  location: location
  properties: {
    serverFarmId: appServicePlan.id
    httpsOnly: true
    siteConfig: {
      appSettings: [
        {
          name: 'AppServiceStorageConnectionString'
          value: appServiceStorageConnectionString
        }
      ]
    }
  }
}

resource storageAccount 'Microsoft.Storage/storageAccounts@2022-09-01' = {
  name: storageAccountName
  location: location
  sku: {
    name: storageAccountType
  }
  kind: 'StorageV2'
  properties: {
    accessTier: 'Hot'
  }
}

output appServicePlan string = appServicePlan.name
output appServiceApp string = appServiceApp.properties.defaultHostName
output storageAccount string = storageAccount.properties.primaryEndpoints.blob
```

## Convert Bicep to JSON

Use PowerShell or Azure CLI to build the _mainTemplate.json_ file. Go to the directory where you saved your Bicep file and run the `build` command.

# [PowerShell](#tab/azure-powershell)

```powershell
bicep build mainTemplate.bicep
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az bicep build --file mainTemplate.bicep
```

---

To learn more, go to Bicep [build](../bicep/bicep-cli.md#build).

After the Bicep file is converted to JSON, your _mainTemplate.json_ file should match the following example. You might have different values in the `metadata` properties for `version` and `templateHash`.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "metadata": {
    "_generator": {
      "name": "bicep",
      "version": "0.17.1.54307",
      "templateHash": "1234567891234567890"
    }
  },
  "parameters": {
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]"
    },
    "appServicePlanName": {
      "type": "string",
      "maxLength": 40,
      "metadata": {
        "description": "App Service plan name."
      }
    },
    "appServiceNamePrefix": {
      "type": "string",
      "maxLength": 47,
      "metadata": {
        "description": "App Service name prefix."
      }
    },
    "storageAccountNamePrefix": {
      "type": "string",
      "maxLength": 11,
      "metadata": {
        "description": "Storage account name prefix."
      }
    },
    "storageAccountType": {
      "type": "string",
      "allowedValues": [
        "Premium_LRS",
        "Standard_LRS",
        "Standard_GRS"
      ],
      "metadata": {
        "description": "Storage account type allowed values"
      }
    }
  },
  "variables": {
    "appServicePlanSku": "F1",
    "appServicePlanCapacity": 1,
    "appServiceName": "[format('{0}{1}', parameters('appServiceNamePrefix'), uniqueString(resourceGroup().id))]",
    "storageAccountName": "[format('{0}{1}', parameters('storageAccountNamePrefix'), uniqueString(resourceGroup().id))]"
  },
  "resources": [
    {
      "type": "Microsoft.Web/serverfarms",
      "apiVersion": "2022-03-01",
      "name": "[parameters('appServicePlanName')]",
      "location": "[parameters('location')]",
      "sku": {
        "name": "[variables('appServicePlanSku')]",
        "capacity": "[variables('appServicePlanCapacity')]"
      }
    },
    {
      "type": "Microsoft.Web/sites",
      "apiVersion": "2022-03-01",
      "name": "[variables('appServiceName')]",
      "location": "[parameters('location')]",
      "properties": {
        "serverFarmId": "[resourceId('Microsoft.Web/serverfarms', parameters('appServicePlanName'))]",
        "httpsOnly": true,
        "siteConfig": {
          "appSettings": [
            {
              "name": "AppServiceStorageConnectionString",
              "value": "[format('DefaultEndpointsProtocol=https;AccountName={0};EndpointSuffix={1};Key={2}', variables('storageAccountName'), environment().suffixes.storage, listKeys(resourceId('Microsoft.Storage/storageAccounts', variables('storageAccountName')), '2022-09-01').keys[0].value)]"
            }
          ]
        }
      },
      "dependsOn": [
        "[resourceId('Microsoft.Web/serverfarms', parameters('appServicePlanName'))]",
        "[resourceId('Microsoft.Storage/storageAccounts', variables('storageAccountName'))]"
      ]
    },
    {
      "type": "Microsoft.Storage/storageAccounts",
      "apiVersion": "2022-09-01",
      "name": "[variables('storageAccountName')]",
      "location": "[parameters('location')]",
      "sku": {
        "name": "[parameters('storageAccountType')]"
      },
      "kind": "StorageV2",
      "properties": {
        "accessTier": "Hot"
      }
    }
  ],
  "outputs": {
    "appServicePlan": {
      "type": "string",
      "value": "[parameters('appServicePlanName')]"
    },
    "appServiceApp": {
      "type": "string",
      "value": "[reference(resourceId('Microsoft.Web/sites', variables('appServiceName')), '2022-03-01').defaultHostName]"
    },
    "storageAccount": {
      "type": "string",
      "value": "[reference(resourceId('Microsoft.Storage/storageAccounts', variables('storageAccountName')), '2022-09-01').primaryEndpoints.blob]"
    }
  }
}
```

## Define your portal experience

As a publisher, you define the portal experience to create the managed application. The _createUiDefinition.json_ file generates the portal's user interface. You define how users provide input for each parameter using [control elements](create-uidefinition-elements.md) like drop-downs and text boxes.

In this example, the user interface prompts you to input the App Service name prefix, App Service plan's name, storage account prefix, and storage account type. During deployment, the variables in _mainTemplate.json_ use the `uniqueString` function to append a 13-character string to the name prefixes so the names are globally unique across Azure.

Open Visual Studio Code, create a file with the case-sensitive name _createUiDefinition.json_ and save it.

Add the following JSON code to the file and save it.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/0.1.2-preview/CreateUIDefinition.MultiVm.json#",
  "handler": "Microsoft.Azure.CreateUIDef",
  "version": "0.1.2-preview",
  "parameters": {
    "basics": [
      {}
    ],
    "steps": [
      {
        "name": "webAppSettings",
        "label": "Web App settings",
        "subLabel": {
          "preValidation": "Configure the web app settings",
          "postValidation": "Completed"
        },
        "elements": [
          {
            "name": "appServicePlanName",
            "type": "Microsoft.Common.TextBox",
            "label": "App Service plan name",
            "placeholder": "App Service plan name",
            "defaultValue": "",
            "toolTip": "Use alphanumeric characters or hyphens with a maximum of 40 characters.",
            "constraints": {
              "required": true,
              "regex": "^[a-z0-9A-Z-]{1,40}$",
              "validationMessage": "Only alphanumeric characters or hyphens are allowed, with a maximum of 40 characters."
            },
            "visible": true
          },
          {
            "name": "appServiceName",
            "type": "Microsoft.Common.TextBox",
            "label": "App Service name prefix",
            "placeholder": "App Service name prefix",
            "defaultValue": "",
            "toolTip": "Use alphanumeric characters or hyphens with minimum of 2 characters and maximum of 47 characters.",
            "constraints": {
              "required": true,
              "regex": "^[a-z0-9A-Z-]{2,47}$",
              "validationMessage": "Only alphanumeric characters or hyphens are allowed, with a minimum of 2 characters and maximum of 47 characters."
            },
            "visible": true
          }
        ]
      },
      {
        "name": "storageConfig",
        "label": "Storage settings",
        "subLabel": {
          "preValidation": "Configure the storage settings",
          "postValidation": "Completed"
        },
        "elements": [
          {
            "name": "storageAccounts",
            "type": "Microsoft.Storage.MultiStorageAccountCombo",
            "label": {
              "prefix": "Storage account name prefix",
              "type": "Storage account type"
            },
            "toolTip": {
              "prefix": "Enter maximum of 11 lowercase letters or numbers.",
              "type": "Available choices are Standard_LRS, Standard_GRS, and Premium_LRS."
            },
            "defaultValue": {
              "type": "Standard_LRS"
            },
            "constraints": {
              "allowedTypes": [
                "Premium_LRS",
                "Standard_LRS",
                "Standard_GRS"
              ]
            },
            "visible": true
          }
        ]
      }
    ],
    "outputs": {
      "location": "[location()]",
      "appServicePlanName": "[steps('webAppSettings').appServicePlanName]",
      "appServiceNamePrefix": "[steps('webAppSettings').appServiceName]",
      "storageAccountNamePrefix": "[steps('storageConfig').storageAccounts.prefix]",
      "storageAccountType": "[steps('storageConfig').storageAccounts.type]"
    }
  }
}
```

To learn more, go to [Get started with CreateUiDefinition](create-uidefinition-overview.md).

## Package the files

Add the two files to a package file named _app.zip_. The two files must be at the root level of the _.zip_ file. If the files are in a folder, when you create the managed application definition, you receive an error that states the required files aren't present.

Upload _app.zip_ to an Azure storage account so you can use it when you deploy the managed application's definition. The storage account name must be globally unique across Azure and the length must be 3-24 characters with only lowercase letters and numbers. In the command, replace the placeholder `<demostorageaccount>` including the angle brackets (`<>`), with your unique storage account name.

# [PowerShell](#tab/azure-powershell)

In Visual Studio Code, open a new PowerShell terminal and sign in to your Azure subscription.

```azurepowershell
Connect-AzAccount
```

The command opens your default browser and prompts you to sign in to Azure. For more information, go to [Sign in with Azure PowerShell](/powershell/azure/authenticate-azureps).

After you connect, run the following commands.

```azurepowershell
New-AzResourceGroup -Name packageStorageRG -Location westus3

$storageAccount = New-AzStorageAccount `
  -ResourceGroupName packageStorageRG `
  -Name "<demostorageaccount>" `
  -Location westus3 `
  -SkuName Standard_LRS `
  -Kind StorageV2 `
  -AllowBlobPublicAccess $true

$ctx = $storageAccount.Context

New-AzStorageContainer -Name appcontainer -Context $ctx -Permission blob

Set-AzStorageBlobContent `
  -File "app.zip" `
  -Container appcontainer `
  -Blob "app.zip" `
  -Context $ctx
```

Use the following command to store the package file's URI in a variable named `packageuri`. You use the variable's value when you deploy the managed application definition.

```azurepowershell
$packageuri=(Get-AzStorageBlob -Container appcontainer -Blob app.zip -Context $ctx).ICloudBlob.StorageUri.PrimaryUri.AbsoluteUri
```

# [Azure CLI](#tab/azure-cli)

In Visual Studio Code, open a new Bash terminal session and sign in to your Azure subscription. For example, if you have Git installed, select Git Bash.

```azurecli
az login
```

The command opens your default browser and prompts you to sign in to Azure. For more information, go to [Sign in with Azure CLI](/cli/azure/authenticate-azure-cli).

After you connect, run the following commands.

```azurecli
az group create --name packageStorageRG --location westus3

az storage account create \
    --name <demostorageaccount> \
    --resource-group packageStorageRG \
    --location westus3 \
    --sku Standard_LRS \
    --kind StorageV2 \
    --allow-blob-public-access true
```

After you create the storage account, add the role assignment _Storage Blob Data Contributor_ to the storage account scope. Assign access to your Microsoft Entra user account. Depending on your access level in Azure, you might need other permissions assigned by your administrator. For more information, go to [Assign an Azure role for access to blob data](../../storage/blobs/assign-azure-role-data-access.md).

After you add the role to the storage account, it takes a few minutes to become active in Azure. You can then use the parameter `--auth-mode login` in the commands to create the container and upload the file.

```azurecli
az storage container create \
    --account-name <demostorageaccount> \
    --name appcontainer \
    --auth-mode login \
    --public-access blob

az storage blob upload \
    --account-name <demostorageaccount> \
    --container-name appcontainer \
    --auth-mode login \
    --name "app.zip" \
    --file "app.zip"
```

For more information about storage authentication, go to [Choose how to authorize access to blob data with Azure CLI](../../storage/blobs/authorize-data-operations-cli.md).

Use the following command to store the package file's URI in a variable named `packageuri`. You use the variable's value when you deploy the managed application definition.

```azurecli
packageuri=$(az storage blob url \
  --account-name <demostorageaccount> \
  --container-name appcontainer \
  --auth-mode login \
  --name app.zip --output tsv)
```

---

## Create the managed application definition

In this section, you get identity information from Microsoft Entra ID, create a resource group, and deploy the managed application definition.

### Get group ID and role definition ID

The next step is to select a user, security group, or application for managing the resources for the customer. This identity has permissions on the managed resource group according to the assigned role. The role can be any Azure built-in role like Owner or Contributor.

This example uses a security group, and your Microsoft Entra account should be a member of the group. To get the group's object ID, replace the placeholder `<managedAppDemo>` including the angle brackets (`<>`), with your group's name. You use the variable's value when you deploy the managed application definition.

To create a new Microsoft Entra group, go to [Manage Microsoft Entra groups and group membership](../../active-directory/fundamentals/how-to-manage-groups.md).

# [PowerShell](#tab/azure-powershell)

```azurepowershell
$principalid=(Get-AzADGroup -DisplayName <managedAppDemo>).Id
```

# [Azure CLI](#tab/azure-cli)

```azurecli
principalid=$(az ad group show --group <managedAppDemo> --query id --output tsv)
```

---

Next, get the role definition ID of the Azure built-in role you want to grant access to the user, group, or application. You use the variable's value when you deploy the managed application definition.

# [PowerShell](#tab/azure-powershell)

```azurepowershell
$roleid=(Get-AzRoleDefinition -Name Owner).Id
```

# [Azure CLI](#tab/azure-cli)

```azurecli
roleid=$(az role definition list --name Owner --query [].name --output tsv)
```

---

## Create the definition deployment template

Use a Bicep file to deploy the managed application definition in your service catalog.

Open Visual Studio Code, create a file with the name _deployDefinition.bicep_ and save it.

Add the following Bicep code and save the file.

```bicep
param location string = resourceGroup().location

@description('Name of the managed application definition.')
param managedApplicationDefinitionName string

@description('The URI of the .zip package file.')
param packageFileUri string

@description('Publishers Principal ID that needs permissions to manage resources in the managed resource group.')
param principalId string

@description('Role ID for permissions to the managed resource group.')
param roleId string

var definitionLockLevel = 'ReadOnly'
var definitionDisplayName = 'Sample Bicep managed application'
var definitionDescription = 'Sample Bicep managed application that deploys web resources'

resource managedApplicationDefinition 'Microsoft.Solutions/applicationDefinitions@2021-07-01' = {
  name: managedApplicationDefinitionName
  location: location
  properties: {
    lockLevel: definitionLockLevel
    description: definitionDescription
    displayName: definitionDisplayName
    packageFileUri: packageFileUri
    authorizations: [
      {
        principalId: principalId
        roleDefinitionId: roleId
      }
    ]
  }
}
```

For more information about the template's properties, go to [Microsoft.Solutions/applicationDefinitions](/azure/templates/microsoft.solutions/applicationdefinitions).

The `lockLevel` on the managed resource group prevents the customer from performing undesirable operations on this resource group. Currently, `ReadOnly` is the only supported lock level. `ReadOnly` specifies that the customer can only read the resources present in the managed resource group. The publisher identities that are granted access to the managed resource group are exempt from the lock level.

## Create the parameter file

The managed application definition's deployment template needs input for several parameters. The deployment command prompts you for the values or you can create a parameter file for the values. In this example, we use a parameter file to pass the parameter values to the deployment command.

In Visual Studio Code, create a new file named _deployDefinition.parameters.json_ and save it.

Add the following to your parameter file and save it. Then, replace the `<placeholder values>` including the angle brackets (`<>`), with your values.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "managedApplicationDefinitionName": {
      "value": "sampleBicepManagedApplication"
    },
    "packageFileUri": {
      "value": "<placeholder for the packageFileUri>"
    },
    "principalId": {
      "value": "<placeholder for principalid value>"
    },
    "roleId": {
      "value": "<placeholder for roleid value>"
    }
  }
}
```

The following table describes the parameter values for the managed application definition.

| Parameter | Value |
| ---- | ---- |
| `managedApplicationDefinitionName` | Name of the managed application definition. For this example, use  _sampleBicepManagedApplication_.|
| `packageFileUri` | Enter the URI for your _.zip_ package file. Use your `packageuri` variable's value. The format is `https://yourStorageAccountName.blob.core.windows.net/appcontainer/app.zip`. |
| `principalId` | The publishers principal ID that needs permissions to manage resources in the managed resource group. Use your `principalid` variable's value. |
| `roleId` | Role ID for permissions to the managed resource group. For example Owner, Contributor, Reader. Use your `roleid` variable's value. |

To get your variable values:
- Azure PowerShell: In PowerShell, type `$variableName` to display a variable's value.
- Azure CLI: In Bash, type `echo $variableName` to display a variable's value.

## Deploy the definition

When you deploy the managed application's definition, it becomes available in your service catalog. This process doesn't deploy the managed application's resources.

Create a resource group named _bicepDefinitionRG_ and deploy the managed application definition.

# [PowerShell](#tab/azure-powershell)

```azurepowershell
New-AzResourceGroup -Name bicepDefinitionRG -Location westus3

New-AzResourceGroupDeployment `
  -ResourceGroupName bicepDefinitionRG `
  -TemplateFile deployDefinition.bicep `
  -TemplateParameterFile deployDefinition.parameters.json
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az group create --name bicepDefinitionRG --location westus3

az deployment group create \
  --resource-group bicepDefinitionRG \
  --template-file deployDefinition.bicep \
  --parameters @deployDefinition.parameters.json
```

---

## Verify the results

Run the following command to verify the definition is published in your service catalog.

# [PowerShell](#tab/azure-powershell)

```azurepowershell
Get-AzManagedApplicationDefinition -ResourceGroupName bicepDefinitionRG
```

`Get-AzManagedApplicationDefinition` lists all the available definitions in the specified resource group, like _sampleBicepManagedApplication_.

# [Azure CLI](#tab/azure-cli)

```azurecli
az managedapp definition list --resource-group bicepDefinitionRG
```

The command lists all the available definitions in the specified resource group, like _sampleBicepManagedApplication_.

---

## Make sure users can access your definition

You have access to the managed application definition, but you want to make sure other users in your organization can access it. Grant them at least the Reader role on the definition. They may have inherited this level of access from the subscription or resource group. To check who has access to the definition and add users or groups, go to [Assign Azure roles using the Azure portal](../../role-based-access-control/role-assignments-portal.md).

## Clean up resources

If you're going to deploy the definition, continue with the **Next steps** section that links to the article to deploy the definition with Bicep.

If you're finished with the managed application definition, you can delete the resource groups you created named _packageStorageRG_ and _bicepDefinitionRG_.

# [PowerShell](#tab/azure-powershell)

The command prompts you to confirm that you want to remove the resource group.

```azurepowershell
Remove-AzResourceGroup -Name packageStorageRG

Remove-AzResourceGroup -Name bicepDefinitionRG
```

# [Azure CLI](#tab/azure-cli)

The command prompts for confirmation, and then returns you to command prompt while resources are being deleted.

```azurecli
az group delete --resource-group packageStorageRG --no-wait

az group delete --resource-group bicepDefinitionRG --no-wait
```

---

## Next steps

You've published the managed application definition. The next step is to learn how to deploy an instance of that definition.

> [!div class="nextstepaction"]
> [Quickstart: Use Bicep to deploy an Azure Managed Application definition](deploy-bicep-definition.md).
