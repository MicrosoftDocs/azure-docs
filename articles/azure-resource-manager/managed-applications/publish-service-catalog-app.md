---
title: Publish Azure Managed Application in service catalog
description: Describes how to publish an Azure Managed Application in your service catalog that's intended for members of your organization.
author: davidsmatlak
ms.author: davidsmatlak
ms.topic: quickstart
ms.custom: subject-armqs, devx-track-azurecli, devx-track-azurepowershell, subject-rbac-steps, mode-api, mode-arm
ms.date: 02/21/2023
---

# Quickstart: Create and publish an Azure Managed Application definition

This quickstart provides an introduction to working with [Azure Managed Applications](overview.md). You create and publish a managed application that's stored in your service catalog and is intended for members of your organization.

To publish a managed application to your service catalog, do the following tasks:

- Create an Azure Resource Manager template (ARM template) that defines the resources to deploy with the managed application.
- Define the user interface elements for the portal when deploying the managed application.
-Create a _.zip_ package that contains the required JSON files. The _.zip_ package file has a 120-MB limit for a service catalog's managed application definition.
- Deploy the managed application definition so it's available in your service catalog.

If your managed application definition is more than 120 MB or if you want to use your own storage account for your organization's compliance reasons, go to [Quickstart: Bring your own storage to create and publish an Azure Managed Application definition](publish-service-catalog-bring-your-own-storage.md).

> [!NOTE]
> You can use Bicep to develop a managed application definition but it must be converted to ARM template JSON before you can publish the definition in Azure. To convert Bicep to JSON, use the Bicep [build](../bicep/bicep-cli.md#build) command. After the file is converted to JSON it's recommended to verify the code for accuracy.
>
> Bicep files can be used to deploy an existing managed application definition.

## Prerequisites

To complete this quickstart, you need the following items:

- An Azure account with an active subscription and permissions to Azure Active Directory resources like users, groups, or service principals. If you don't have an account, [create a free account](https://azure.microsoft.com/free/) before you begin.
- [Visual Studio Code](https://code.visualstudio.com/) with the latest [Azure Resource Manager Tools extension](https://marketplace.visualstudio.com/items?itemName=msazurermtools.azurerm-vscode-tools). For Bicep files, install the [Bicep extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-bicep).
- Install the latest version of [Azure PowerShell](/powershell/azure/install-az-ps) or [Azure CLI](/cli/azure/install-azure-cli).

## Create the ARM template

Every managed application definition includes a file named _mainTemplate.json_. The template defines the Azure resources to deploy and is no different than a regular ARM template.

Open Visual Studio Code, create a file with the case-sensitive name _mainTemplate.json_ and save it.

Add the following JSON and save the file. It defines the resources to deploy an App Service, App Service plan, and storage account for the application. This storage account isn't used to store the managed application definition.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]"
    },
    "appServicePlanNamePrefix": {
      "type": "string",
      "maxLength": 27,
      "metadata": {
        "description": "App Service plan name prefix."
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
    "appServicePlanName": "[format('{0}{1}', parameters('appServicePlanNamePrefix'), uniqueString(resourceGroup().id))]",
    "appServicePlanSku": "F1",
    "appServicePlanCapacity": 1,
    "appServiceName": "[format('{0}{1}', parameters('appServiceNamePrefix'), uniqueString(resourceGroup().id))]",
    "storageAccountName": "[format('{0}{1}', parameters('storageAccountNamePrefix'), uniqueString(resourceGroup().id))]"
  },
  "resources": [
    {
      "type": "Microsoft.Web/serverfarms",
      "apiVersion": "2022-03-01",
      "name": "[variables('appServicePlanName')]",
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
        "serverFarmId": "[resourceId('Microsoft.Web/serverfarms', variables('appServicePlanName'))]",
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
        "[resourceId('Microsoft.Web/serverfarms', variables('appServicePlanName'))]",
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
      "value": "[variables('appServicePlanName')]"
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

Open Visual Studio Code, create a file with the case-sensitive name _createUiDefinition.json_ and save it. The user interface allows the user to input the App Service name, App Service plan's name, storage account prefix, and storage account type. During deployment, the `uniqueString` function appends a 13 character string to the name prefixes so the names are globally unique across Azure.

Add the following JSON to the file and save it.

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
            "label": "App Service plan name prefix",
            "placeholder": "App Service plan name prefix",
            "defaultValue": "",
            "toolTip": "Use alphanumeric characters or hyphens with a maximum of 27 characters.",
            "constraints": {
              "required": true,
              "regex": "^[a-z0-9A-Z-]{1,27}$",
              "validationMessage": "Only alphanumeric characters or hyphens are allowed, with a maximum of 27 characters."
            },
            "visible": true
          },
          {
            "name": "appServiceName",
            "type": "Microsoft.Common.TextBox",
            "label": "App Service name prefix",
            "placeholder": "App Service name prefix",
            "defaultValue": "",
            "toolTip": "Use alphanumeric characters or hyphens with a maximum of 47 characters.",
            "constraints": {
              "required": true,
              "regex": "^[a-z0-9A-Z-]{1,47}$",
              "validationMessage": "Only alphanumeric characters or hyphens are allowed, with a maximum of 47 characters."
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
      "appServicePlanNamePrefix": "[steps('webAppSettings').appServicePlanName]",
      "appServiceNamePrefix": "[steps('webAppSettings').appServiceName]",
      "storageAccountNamePrefix": "[steps('storageConfig').storageAccounts.prefix]",
      "storageAccountType": "[steps('storageConfig').storageAccounts.type]"
    }
  }
}
```

To learn more, see [Get started with CreateUiDefinition](create-uidefinition-overview.md).

## Package the files

Add the two files to a package file named _app.zip_. The two files must be at the root level of the _.zip_ file. If the files are in a folder, when you create the managed application definition, you receive an error that states the required files aren't present.

Upload _app.zip_ to an Azure storage account so you can use it when you deploy the managed application's definition. The storage account name must be globally unique across Azure and the length must be 3-24 characters with only lowercase letters and numbers. In the `Name` parameter, replace the placeholder `demostorageaccount` with your unique storage account name.

# [PowerShell](#tab/azure-powershell)

```azurepowershell
New-AzResourceGroup -Name packageStorageGroup -Location westus3

$storageAccount = New-AzStorageAccount `
  -ResourceGroupName packageStorageGroup `
  -Name "demostorageaccount" `
  -Location westus3 `
  -SkuName Standard_LRS `
  -Kind StorageV2

$ctx = $storageAccount.Context

New-AzStorageContainer -Name appcontainer -Context $ctx -Permission blob

Set-AzStorageBlobContent `
  -File "app.zip" `
  -Container appcontainer `
  -Blob "app.zip" `
  -Context $ctx
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az group create --name packageStorageGroup --location westus3

az storage account create \
    --name demostorageaccount \
    --resource-group packageStorageGroup \
    --location westus3 \
    --sku Standard_LRS \
    --kind StorageV2
```

After you create the storage account, add the role assignment _Storage Blob Data Contributor_ to the storage account scope. Assign access to your Azure Active Directory user account. Depending on your access level in Azure, you might need other permissions assigned by your administrator. For more information, see [Assign an Azure role for access to blob data](../../storage/blobs/assign-azure-role-data-access.md).

After you add the role to the storage account, it takes a few minutes to become active in Azure. You can then use the parameter `--auth-mode login` in the commands to create the container and upload the file.

```azurecli
az storage container create \
    --account-name demostorageaccount \
    --name appcontainer \
    --auth-mode login \
    --public-access blob

az storage blob upload \
    --account-name demostorageaccount \
    --container-name appcontainer \
    --auth-mode login \
    --name "app.zip" \
    --file "app.zip"
```

For more information about storage authentication, see [Choose how to authorize access to blob data with Azure CLI](../../storage/blobs/authorize-data-operations-cli.md).

---

## Create the managed application definition

In this section you'll get identity information from Azure Active Directory, create a resource group, and create the managed application definition.

### Get group ID and role definition ID

The next step is to select a user, security group, or application for managing the resources for the customer. This identity has permissions on the managed resource group according to the assigned role. The role can be any Azure built-in role like Owner or Contributor.

This example uses a security group, and your Azure Active Directory account should be a member of the group. To get the group's object ID, replace the placeholder `managedAppDemo` with your group's name. You'll use this variable's value when you deploy the managed application definition.

To create a new Azure Active Directory group, go to [Manage Azure Active Directory groups and group membership](../../active-directory/fundamentals/how-to-manage-groups.md).

# [PowerShell](#tab/azure-powershell)

```azurepowershell
$principalid=(Get-AzADGroup -DisplayName managedAppDemo).Id
```

# [Azure CLI](#tab/azure-cli)

```azurecli
principalid=$(az ad group show --group managedAppDemo --query id --output tsv)
```

---

Next, get the role definition ID of the Azure built-in role you want to grant access to the user, group, or application. You'll use this variable's value when you deploy the managed application definition.

# [PowerShell](#tab/azure-powershell)

```azurepowershell
$roleid=(Get-AzRoleDefinition -Name Owner).Id
```

# [Azure CLI](#tab/azure-cli)

```azurecli
roleid=$(az role definition list --name Owner --query [].name --output tsv)
```

---

### Create the managed application definition

Create a resource group for your managed application definition.

# [PowerShell](#tab/azure-powershell)

```azurepowershell
New-AzResourceGroup -Name appDefinitionGroup -Location westus3
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az group create --name appDefinitionGroup --location westus3
```

---

Create the managed application definition in the resource group.

The `blob` command that's run from Azure PowerShell or Azure CLI creates a variable that's used to get the URL for the package _.zip_ file. That variable is used in the command that creates the managed application definition.

# [PowerShell](#tab/azure-powershell)

```azurepowershell
$blob = Get-AzStorageBlob -Container appcontainer -Blob app.zip -Context $ctx

New-AzManagedApplicationDefinition `
  -Name "sampleManagedApplication" `
  -Location "westus3" `
  -ResourceGroupName appDefinitionGroup `
  -LockLevel ReadOnly `
  -DisplayName "Sample managed application" `
  -Description "Sample managed application that deploys web resources" `
  -Authorization "${principalid}:$roleid" `
  -PackageFileUri $blob.ICloudBlob.StorageUri.PrimaryUri.AbsoluteUri
```

# [Azure CLI](#tab/azure-cli)

In the `blob` command's `account-name` parameter, replace the placeholder `demostorageaccount` with your unique storage account name.

```azurecli
blob=$(az storage blob url \
  --account-name demostorageaccount \
  --container-name appcontainer \
  --auth-mode login \
  --name app.zip --output tsv)

az managedapp definition create \
  --name "sampleManagedApplication" \
  --location "westus3" \
  --resource-group appDefinitionGroup \
  --lock-level ReadOnly \
  --display-name "Sample managed application" \
  --description "Sample managed application that deploys web resources" \
  --authorizations "$principalid:$roleid" \
  --package-file-uri "$blob"
```

---

When the command completes, you have a managed application definition in your resource group.

Some of the parameters used in the preceding example are:

- **resource group**: The name of the resource group where the managed application definition is created.
- **lock level**: The `lockLevel` on the managed resource group prevents the customer from performing undesirable operations on this resource group. Currently, `ReadOnly` is the only supported lock level. `ReadOnly` specifies that the customer can only read the resources present in the managed resource group. The publisher identities that are granted access to the managed resource group are exempt from the lock level.
- **authorizations**: Describes the principal ID and the role definition ID that are used to grant permission to the managed resource group.

  - **Azure PowerShell**: `"${principalid}:$roleid"` or you can use curly braces for each variable `"${principalid}:${roleid}"`. Use a comma to separate multiple values: `"${principalid1}:$roleid1", "${principalid2}:$roleid2"`.
  - **Azure CLI**: `"$principalid:$roleid"` or you can use curly braces as shown in PowerShell. Use a space to separate multiple values: `"$principalid1:$roleid1" "$principalid2:$roleid2"`.

- **package file URI**: The location of a _.zip_ package file that contains the required files.

## Make sure users can see your definition

You have access to the managed application definition, but you want to make sure other users in your organization can access it. Grant them at least the Reader role on the definition. They may have inherited this level of access from the subscription or resource group. To check who has access to the definition and add users or groups, see [Assign Azure roles using the Azure portal](../../role-based-access-control/role-assignments-portal.md).

## Next steps

You've published the managed application definition. Now, learn how to deploy an instance of that definition.

> [!div class="nextstepaction"]
> [Quickstart: Deploy service catalog app](deploy-service-catalog-quickstart.md)
