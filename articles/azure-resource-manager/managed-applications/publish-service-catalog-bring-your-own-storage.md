---
title: Bring your own storage to create and publish an Azure Managed Application definition
description: Describes how to bring your own storage to create and publish an Azure Managed Application definition in your service catalog.
ms.topic: quickstart
ms.custom: subject-armqs, devx-track-azurecli, devx-track-azurepowershell, subject-rbac-steps, mode-api, mode-arm, devx-track-arm-template, engagement-fy23
ms.date: 05/12/2023
---

# Quickstart: Bring your own storage to create and publish an Azure Managed Application definition

This quickstart provides an introduction to bring your own storage (BYOS) for an [Azure Managed Application](overview.md). You create and publish a managed application definition in your service catalog for members of your organization. When you use your own storage account, your managed application definition can exceed the service catalog's 120-MB limit.

To publish a managed application definition to your service catalog, do the following tasks:

- Create an Azure Resource Manager template (ARM template) that defines the Azure resources deployed by the managed application.
- Define the user interface elements for the portal when deploying the managed application.
- Create a _.zip_ package that contains the required JSON files.
- Create a storage account where you store the managed application definition.
- Deploy the managed application definition to your own storage account so it's available in your service catalog.

If your managed application definition is less than 120 MB and you don't want to use your own storage account, go to [Quickstart: Create and publish an Azure Managed Application definition](publish-service-catalog-app.md).

You can use Bicep to develop a managed application definition but it must be converted to ARM template JSON before you can publish the definition in Azure. For more information, go to [Quickstart: Use Bicep to create and publish an Azure Managed Application definition](publish-bicep-definition.md#convert-bicep-to-json).

You can also use Bicep deploy a managed application definition from your service catalog. For more information, go to [Quickstart: Use Bicep to deploy an Azure Managed Application definition](deploy-bicep-definition.md).

## Prerequisites

To complete this quickstart, you need the following items:

- An Azure account with an active subscription and permissions to Azure Active Directory resources like users, groups, or service principals. If you don't have an account, [create a free account](https://azure.microsoft.com/free/) before you begin.
- [Visual Studio Code](https://code.visualstudio.com/) with the latest [Azure Resource Manager Tools extension](https://marketplace.visualstudio.com/items?itemName=msazurermtools.azurerm-vscode-tools). For Bicep files, install the [Bicep extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-bicep).
- Install the latest version of [Azure PowerShell](/powershell/azure/install-azure-powershell) or [Azure CLI](/cli/azure/install-azure-cli).

## Create the ARM template

Every managed application definition includes a file named _mainTemplate.json_. The template defines the Azure resources to deploy and is no different than a regular ARM template.

Open Visual Studio Code, create a file with the case-sensitive name _mainTemplate.json_ and save it.

Add the following JSON and save the file. It defines the managed application's resources to deploy an App Service, App Service plan, and a storage account.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
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

```azurepowershell
New-AzResourceGroup -Name packageStorageGroup -Location westus3

$storageAccount = New-AzStorageAccount `
  -ResourceGroupName packageStorageGroup `
  -Name "<demostorageaccount>" `
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

Use the following command to store the package file's URI in a variable named `packageuri`. You use the variable's value when you deploy the managed application definition.

```azurepowershell
$packageuri=(Get-AzStorageBlob -Container appcontainer -Blob app.zip -Context $ctx).ICloudBlob.StorageUri.PrimaryUri.AbsoluteUri
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az group create --name packageStorageGroup --location westus3

az storage account create \
    --name <demostorageaccount> \
    --resource-group packageStorageGroup \
    --location westus3 \
    --sku Standard_LRS \
    --kind StorageV2
```

After you create the storage account, add the role assignment _Storage Blob Data Contributor_ to the storage account scope. Assign access to your Azure Active Directory user account. Depending on your access level in Azure, you might need other permissions assigned by your administrator. For more information, go to [Assign an Azure role for access to blob data](../../storage/blobs/assign-azure-role-data-access.md).

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

## Bring your own storage for the managed application definition

You store your managed application definition in your own storage account so that its location and access can be managed by you for your organization's regulatory needs. Using your own storage account allows you to have an application that exceeds the 120-MB limit for a service catalog's managed application definition.

> [!NOTE]
> Bring your own storage is only supported with ARM template or REST API deployments of the managed application definition.

### Create the storage account

Create the storage account for your managed application definition. The storage account name must be globally unique across Azure and the length must be 3-24 characters with only lowercase letters and numbers.

This example creates a new resource group named `byosDefinitionStorageGroup`. In the command, replace the placeholder `<definitionstorage>` including the angle brackets (`<>`), with your unique storage account name.

# [PowerShell](#tab/azure-powershell)

```azurepowershell
New-AzResourceGroup -Name byosDefinitionStorageGroup -Location westus3

New-AzStorageAccount `
  -ResourceGroupName byosDefinitionStorageGroup `
  -Name "<definitionstorage>" `
  -Location westus3 `
  -SkuName Standard_LRS `
  -Kind StorageV2
```

Use the following command to store the storage account's resource ID in a variable named `storageid`. You use the variable's value when you deploy the managed application definition.

```azurepowershell
$storageid = (Get-AzStorageAccount -ResourceGroupName byosDefinitionStorageGroup -Name <definitionstorage>).Id
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az group create --name byosDefinitionStorageGroup --location westus3

az storage account create \
    --name <definitionstorage> \
    --resource-group byosDefinitionStorageGroup \
    --location westus3 \
    --sku Standard_LRS \
    --kind StorageV2
```

Use the following command to store the storage account's resource ID in a variable named `storageid`. You use the variable's value to set up the storage account's role assignment and when you deploy the managed application definition.

```azurecli
storageid=$(az storage account show --resource-group byosDefinitionStorageGroup --name <definitionstorage> --query id --output tsv)
```

---

### Set the role assignment for your storage account

Before you deploy your managed application definition to your storage account, assign the **Contributor** role to the **Appliance Resource Provider** user at the storage account scope. This assignment lets the identity write definition files to your storage account's container.

# [PowerShell](#tab/azure-powershell)

You can use variables to set up the role assignment. This example uses the `$storageid` variable you created in the previous step and creates the `$arpid` variable.

```azurepowershell
$arpid = (Get-AzADServicePrincipal -SearchString "Appliance Resource Provider").Id

New-AzRoleAssignment -ObjectId $arpid `
-RoleDefinitionName Contributor `
-Scope $storageid
```

# [Azure CLI](#tab/azure-cli)

You can use variables to set up the role assignment. This example uses the `$storageid` variable you created in the previous step and creates the `$arpid` variable.

```azurecli
arpid=$(az ad sp list --display-name "Appliance Resource Provider" --query [].id --output tsv)

az role assignment create --assignee $arpid \
--role "Contributor" \
--scope $storageid
```

If you're running CLI commands with Git Bash for Windows, you might get an `InvalidSchema` error because of the `scope` parameter's string. To fix the error, run `export MSYS_NO_PATHCONV=1` and then rerun your command to create the role assignment.

---

The _Appliance Resource Provider_ is a service principal in your Azure Active Directory's tenant. From the Azure portal, you can verify if it's registered by going to **Azure Active Directory** > **Enterprise applications** and change the search filter to **Microsoft Applications**. Search for _Appliance Resource Provider_. If it isn't found, [register](../troubleshooting/error-register-resource-provider.md) the `Microsoft.Solutions` resource provider.

## Get group ID and role definition ID

The next step is to select a user, security group, or application for managing the resources for the customer. This identity has permissions on the managed resource group according to the assigned role. The role can be any Azure built-in role like Owner or Contributor.

This example uses a security group, and your Azure Active Directory account should be a member of the group. To get the group's object ID, replace the placeholder `<managedAppDemo>` including the angle brackets (`<>`), with your group's name. You use the variable's value when you deploy the managed application definition.

To create a new Azure Active Directory group, go to [Manage Azure Active Directory groups and group membership](../../active-directory/fundamentals/how-to-manage-groups.md).

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

Use a Bicep file to deploy the managed application definition in your service catalog. After the deployment, the definition files are stored in your own storage account.

Open Visual Studio Code, create a file with the name _deployDefinition.bicep_ and save it.

Add the following Bicep code and save the file.

```bicep
param location string = resourceGroup().location

@description('Name of the managed application definition.')
param managedApplicationDefinitionName string

@description('Resource ID for the bring your own storage account where the definition is stored.')
param definitionStorageResourceID string

@description('The URI of the .zip package file.')
param packageFileUri string

@description('Publishers Principal ID that needs permissions to manage resources in the managed resource group.')
param principalId string

@description('Role ID for permissions to the managed resource group.')
param roleId string

var definitionLockLevel = 'ReadOnly'
var definitionDisplayName = 'Sample BYOS managed application'
var definitionDescription = 'Sample BYOS managed application that deploys web resources'

resource managedApplicationDefinition 'Microsoft.Solutions/applicationDefinitions@2021-07-01' = {
  name: managedApplicationDefinitionName
  location: location
  properties: {
    lockLevel: definitionLockLevel
    description: definitionDescription
    displayName: definitionDisplayName
    packageFileUri: packageFileUri
    storageAccountId: definitionStorageResourceID
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
      "value": "<placeholder for managed application name>"
    },
    "definitionStorageResourceID": {
      "value": "<placeholder for you storage account ID>"
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
| `managedApplicationDefinitionName` | Name of the managed application definition. For this example, use  _sampleByosManagedApplication_.|
| `definitionStorageResourceID` | Resource ID for the storage account where the definition is stored. Use your `storageid` variable's value. |
| `packageFileUri` | Enter the URI for your _.zip_ package file. Use your `packageuri` variable's value. The format is `https://yourStorageAccountName.blob.core.windows.net/appcontainer/app.zip`. |
| `principalId` | The publishers Principal ID that needs permissions to manage resources in the managed resource group. Use your `principalid` variable's value. |
| `roleId` | Role ID for permissions to the managed resource group. For example Owner, Contributor, Reader. Use your `roleid` variable's value. |

To get your variable values:
- Azure PowerShell: In PowerShell, type `$variableName` to display a variable's value.
- Azure CLI: In Bash, type `echo $variableName` to display a variable's value.

## Deploy the definition

When you deploy the managed application's definition, it becomes available in your service catalog. This process doesn't deploy the managed application's resources.

Create a resource group named _byosAppDefinitionGroup_ and deploy the managed application definition to your storage account.

# [PowerShell](#tab/azure-powershell)

```azurepowershell
New-AzResourceGroup -Name byosAppDefinitionGroup -Location westus3

New-AzResourceGroupDeployment `
  -ResourceGroupName byosAppDefinitionGroup `
  -TemplateFile deployDefinition.bicep `
  -TemplateParameterFile deployDefinition.parameters.json
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az group create --name byosAppDefinitionGroup --location westus3

az deployment group create \
  --resource-group byosAppDefinitionGroup \
  --template-file deployDefinition.bicep \
  --parameters @deployDefinition.parameters.json
```

---

## Verify definition files storage

During deployment, the template's `storageAccountId` property uses your storage account's resource ID and creates a new container with the case-sensitive name `applicationdefinitions`. The files from the _.zip_ package you specified during the deployment are stored in the new container.

You can use the following commands to verify that the managed application definition files are saved in your storage account's container. In the command, replace the placeholder `<definitionstorage>` including the angle brackets (`<>`), with your unique storage account name.

# [PowerShell](#tab/azure-powershell)

```azurepowershell
Get-AzStorageAccount -ResourceGroupName byosDefinitionStorageGroup -Name <definitionstorage> |
Get-AzStorageContainer -Name applicationdefinitions |
Get-AzStorageBlob | Select-Object -Property Name | Format-List
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az storage blob list \
  --container-name applicationdefinitions \
  --account-name <definitionstorage> \
  --query "[].{Name:name}"
```

When you run the Azure CLI command, a credentials warning message might be displayed similar to the CLI command in [package the files](#package-the-files). To clear the warning message, you can assign yourself _Storage Blob Data Contributor_ or _Storage Blob Data Reader_ to the storage account's scope, and then include the `--auth-mode login` parameter in the command.

---

> [!NOTE]
> For added security, you can create a managed applications definition and store it in an [Azure storage account blob where encryption is enabled](../../storage/common/storage-service-encryption.md). The definition contents are encrypted through the storage account's encryption options. Only users with permissions to the file can access the definition in your service catalog.

## Make sure users can access your definition

You have access to the managed application definition, but you want to make sure other users in your organization can access it. Grant them at least the Reader role on the definition. They may have inherited this level of access from the subscription or resource group. To check who has access to the definition and add users or groups, go to [Assign Azure roles using the Azure portal](../../role-based-access-control/role-assignments-portal.md).

## Clean up resources

If you're going to deploy the definition, continue with the **Next steps** section that links to the article to deploy the definition.

If you're finished with the managed application definition, you can delete the resource groups you created named _packageStorageGroup_, _byosDefinitionStorageGroup_, and _byosAppDefinitionGroup_.

# [PowerShell](#tab/azure-powershell)

The command prompts you to confirm that you want to remove the resource group.

```azurepowershell
Remove-AzResourceGroup -Name packageStorageGroup

Remove-AzResourceGroup -Name byosAppDefinitionGroup

Remove-AzResourceGroup -Name byosDefinitionStorageGroup
```

# [Azure CLI](#tab/azure-cli)

The command prompts for confirmation, and then returns you to command prompt while resources are being deleted.

```azurecli
az group delete --resource-group packageStorageGroup --no-wait

az group delete --resource-group byosAppDefinitionGroup --no-wait

az group delete --resource-group byosDefinitionStorageGroup --no-wait
```

---

## Next steps

You've published the managed application definition. Now, learn how to deploy an instance of that definition.

> [!div class="nextstepaction"]
> [Quickstart: Deploy a service catalog managed application](deploy-service-catalog-quickstart.md)
