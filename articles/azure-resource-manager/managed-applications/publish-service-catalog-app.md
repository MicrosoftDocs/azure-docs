---
title: Publish Azure Managed Application in service catalog
description: Describes how to publish an Azure Managed Application in your service catalog that's intended for members of your organization.
author: davidsmatlak
ms.author: davidsmatlak
ms.topic: quickstart
ms.custom: subject-armqs, devx-track-azurecli, devx-track-azurepowershell, subject-rbac-steps, mode-api, mode-arm
ms.date: 09/29/2022
---

# Quickstart: Create and publish an Azure Managed Application definition

This quickstart provides an introduction to working with [Azure Managed Applications](overview.md). You create and publish a managed application that's stored in your service catalog and is intended for members of your organization.

To publish a managed application to your service catalog, do the following tasks:

- Create an Azure Resource Manager template (ARM template) that defines the resources to deploy with the managed application.
- Define the user interface elements for the portal when deploying the managed application.
- Create a _.zip_ package that contains the required template files. The _.zip_ package file has a 120-MB limit for a service catalog's managed application definition.
- Decide which user, group, or application needs access to the resource group in the user's subscription.
- Create the managed application definition that points to the _.zip_ package and requests access for the identity.

**Optional**: If you want to deploy your managed application definition with an ARM template in your own storage account, see [bring your own storage](#bring-your-own-storage-for-the-managed-application-definition).

> [!NOTE]
> Bicep files can't be used in a managed application. You must convert a Bicep file to ARM template JSON with the Bicep [build](../bicep/bicep-cli.md#build) command.

## Prerequisites

To complete this quickstart, you need the following items:

- An Azure account with an active subscription. If you don't have an account, [create a free account](https://azure.microsoft.com/free/) before you begin.
- [Visual Studio Code](https://code.visualstudio.com/) with the latest [Azure Resource Manager Tools extension](https://marketplace.visualstudio.com/items?itemName=msazurermtools.azurerm-vscode-tools).
- Install the latest version of [Azure PowerShell](/powershell/azure/install-az-ps) or [Azure CLI](/cli/azure/install-azure-cli).

## Create the ARM template

Every managed application definition includes a file named _mainTemplate.json_. The template defines the Azure resources to deploy and is no different than a regular ARM template.

Open Visual Studio Code, create a file with the case-sensitive name _mainTemplate.json_ and save it.

Add the following JSON and save the file. It defines the parameters for creating a storage account, and specifies the properties for the storage account.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "storageAccountNamePrefix": {
      "type": "string",
      "maxLength": 11,
      "metadata": {
        "description": "Storage prefix must be maximum of 11 characters with only lowercase letters or numbers."
      }
    },
    "storageAccountType": {
      "type": "string"
    },
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]"
    }
  },
  "variables": {
    "storageAccountName": "[concat(parameters('storageAccountNamePrefix'), uniqueString(resourceGroup().id))]"
  },
  "resources": [
    {
      "type": "Microsoft.Storage/storageAccounts",
      "apiVersion": "2021-09-01",
      "name": "[variables('storageAccountName')]",
      "location": "[parameters('location')]",
      "sku": {
        "name": "[parameters('storageAccountType')]"
      },
      "kind": "StorageV2",
      "properties": {}
    }
  ],
  "outputs": {
    "storageEndpoint": {
      "type": "string",
      "value": "[reference(resourceId('Microsoft.Storage/storageAccounts/', variables('storageAccountName')), '2021-09-01').primaryEndpoints.blob]"
    }
  }
}
```

## Define your create experience

As a publisher, you define the portal experience for creating the managed application. The _createUiDefinition.json_ file generates the portal interface. You define how users provide input for each parameter using [control elements](create-uidefinition-elements.md) including drop-downs, text boxes, and password boxes.

Open Visual Studio Code, create a file with the case-sensitive name _createUiDefinition.json_ and save it.

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
        "name": "storageConfig",
        "label": "Storage settings",
        "subLabel": {
          "preValidation": "Configure the infrastructure settings",
          "postValidation": "Done"
        },
        "bladeTitle": "Storage settings",
        "elements": [
          {
            "name": "storageAccounts",
            "type": "Microsoft.Storage.MultiStorageAccountCombo",
            "label": {
              "prefix": "Storage account name prefix",
              "type": "Storage account type"
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
            }
          }
        ]
      }
    ],
    "outputs": {
      "storageAccountNamePrefix": "[steps('storageConfig').storageAccounts.prefix]",
      "storageAccountType": "[steps('storageConfig').storageAccounts.type]",
      "location": "[location()]"
    }
  }
}
```

To learn more, see [Get started with CreateUiDefinition](create-uidefinition-overview.md).

## Package the files

Add the two files to a file named _app.zip_. The two files must be at the root level of the _.zip_ file. If you put the files in a folder, you receive an error that states the required files aren't present when you create the managed application definition.

Upload the package to an accessible location from where it can be consumed. The storage account name must be globally unique across Azure and the length must be 3-24 characters with only lowercase letters and numbers. In the `Name` parameter, replace the placeholder `demostorageaccount` with your unique storage account name.

# [PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
New-AzResourceGroup -Name storageGroup -Location eastus

$storageAccount = New-AzStorageAccount `
  -ResourceGroupName storageGroup `
  -Name "demostorageaccount" `
  -Location eastus `
  -SkuName Standard_LRS `
  -Kind StorageV2

$ctx = $storageAccount.Context

New-AzStorageContainer -Name appcontainer -Context $ctx -Permission blob

Set-AzStorageBlobContent `
  -File "D:\myapplications\app.zip" `
  -Container appcontainer `
  -Blob "app.zip" `
  -Context $ctx
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az group create --name storageGroup --location eastus

az storage account create \
    --name demostorageaccount \
    --resource-group storageGroup \
    --location eastus \
    --sku Standard_LRS \
    --kind StorageV2
```

After you create the storage account, add the role assignment _Storage Blob Data Contributor_ to the storage account scope. Assign access to your Azure Active Directory user account. Depending on your access level in Azure, you might need other permissions assigned by your administrator. For more information, see [Assign an Azure role for access to blob data](../../storage/blobs/assign-azure-role-data-access.md).

After you add the role to the storage account, it takes a few minutes to become active in Azure. You can then use the parameter `--auth-mode login` in the commands to create the container and upload the file.

```azurecli-interactive
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
    --file "./app.zip"
```

For more information about storage authentication, see [Choose how to authorize access to blob data with Azure CLI](../../storage/blobs/authorize-data-operations-cli.md).

---

## Create the managed application definition

In this section you'll get identity information from Azure Active Directory, create a resource group, and create the managed application definition.

### Create an Azure Active Directory user group or application

The next step is to select a user group, user, or application for managing the resources for the customer. This identity has permissions on the managed resource group according to the role that's assigned. The role can be any Azure built-in role like Owner or Contributor. To create a new Active Directory user group, see [Create a group and add members in Azure Active Directory](../../active-directory/fundamentals/active-directory-groups-create-azure-portal.md).

This example uses a user group, so you need the object ID of the user group to use for managing the resources. Replace the placeholder `mygroup` with your group's name.

# [PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
$groupID=(Get-AzADGroup -DisplayName mygroup).Id
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
groupid=$(az ad group show --group mygroup --query id --output tsv)
```

---

### Get the role definition ID

Next, you need the role definition ID of the Azure built-in role you want to grant access to the user, user group, or application. Typically, you use the Owner, Contributor, or Reader role. The following command shows how to get the role definition ID for the Owner role:

# [PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
$roleid=(Get-AzRoleDefinition -Name Owner).Id
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
roleid=$(az role definition list --name Owner --query [].name --output tsv)
```

---

### Create the managed application definition

If you don't already have a resource group for storing your managed application definition, create a new resource group.

**Optional**: If you want to deploy your managed application definition with an ARM template in your own storage account, see [bring your own storage](#bring-your-own-storage-for-the-managed-application-definition).

# [PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
New-AzResourceGroup -Name appDefinitionGroup -Location westcentralus
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az group create --name appDefinitionGroup --location westcentralus
```

---

Create the managed application definition resource. In the `Name` parameter, replace the placeholder `demostorageaccount` with your unique storage account name.

The `blob` command that's run from Azure PowerShell or Azure CLI creates a variable that's used to get the URL for the package _.zip_ file. That variable is used in the command that creates the managed application definition.

# [PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
$blob = Get-AzStorageBlob -Container appcontainer -Blob app.zip -Context $ctx

New-AzManagedApplicationDefinition `
  -Name "ManagedStorage" `
  -Location "westcentralus" `
  -ResourceGroupName appDefinitionGroup `
  -LockLevel ReadOnly `
  -DisplayName "Managed Storage Account" `
  -Description "Managed Azure Storage Account" `
  -Authorization "${groupID}:$roleid" `
  -PackageFileUri $blob.ICloudBlob.StorageUri.PrimaryUri.AbsoluteUri
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
blob=$(az storage blob url \
  --account-name demostorageaccount \
  --container-name appcontainer \
  --auth-mode login \
  --name app.zip --output tsv)

az managedapp definition create \
  --name "ManagedStorage" \
  --location "westcentralus" \
  --resource-group appDefinitionGroup \
  --lock-level ReadOnly \
  --display-name "Managed Storage Account" \
  --description "Managed Azure Storage Account" \
  --authorizations "$groupid:$roleid" \
  --package-file-uri "$blob"
```

---

When the command completes, you have a managed application definition in your resource group.

Some of the parameters used in the preceding example are:

- **resource group**: The name of the resource group where the managed application definition is created.
- **lock level**: The type of lock placed on the managed resource group. It prevents the customer from performing undesirable operations on this resource group. Currently, `ReadOnly` is the only supported lock level. When `ReadOnly` is specified, the customer can only read the resources present in the managed resource group. The publisher identities that are granted access to the managed resource group are exempt from the lock.
- **authorizations**: Describes the principal ID and the role definition ID that are used to grant permission to the managed resource group.

  - **Azure PowerShell**: `"${groupid}:$roleid"` or you can use curly braces for each variable `"${groupid}:${roleid}"`. Use a comma to separate multiple values: `"${groupid1}:$roleid1", "${groupid2}:$roleid2"`.
  - **Azure CLI**: `"$groupid:$roleid"` or you can use curly braces as shown in PowerShell. Use a space to separate multiple values: `"$groupid1:$roleid1" "$groupid2:$roleid2"`.

- **package file URI**: The location of a _.zip_ package file that contains the required files.

## Bring your own storage for the managed application definition

This section is optional. You can store your managed application definition in your own storage account so that its location and access can be managed by you for your regulatory needs. The _.zip_ package file has a 120-MB limit for a service catalog's managed application definition.

> [!NOTE]
> Bring your own storage is only supported with ARM template or REST API deployments of the managed application definition.

### Create your storage account

You must create a storage account that will contain your managed application definition for use with a service catalog. The storage account name must be globally unique across Azure and the length must be 3-24 characters with only lowercase letters and numbers.

This example creates a new resource group named `byosStorageRG`. In the `Name` parameter, replace the placeholder `definitionstorage` with your unique storage account name.

# [PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
New-AzResourceGroup -Name byosStorageRG -Location eastus

New-AzStorageAccount `
  -ResourceGroupName byosStorageRG `
  -Name "definitionstorage" `
  -Location eastus `
  -SkuName Standard_LRS `
  -Kind StorageV2
```

Use the following command to store the storage account's resource ID in a variable named `storageId`. You'll use this variable when you deploy the managed application definition.

```azurepowershell-interactive
$storageId = (Get-AzStorageAccount -ResourceGroupName byosStorageRG -Name definitionstorage).Id
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az group create --name byosStorageRG --location eastus

az storage account create \
    --name definitionstorage \
    --resource-group byosStorageRG \
    --location eastus \
    --sku Standard_LRS \
    --kind StorageV2
```

Use the following command to store the storage account's resource ID in a variable named `storageId`. You'll use the variable's value when you deploy the managed application definition.

```azurecli-interactive
storageId=$(az storage account show --resource-group byosStorageRG --name definitionstorage --query id)
```

---

### Set the role assignment for your storage account

Before your managed application definition can be deployed to your storage account, assign the **Contributor** role to the **Appliance Resource Provider** user at the storage account scope. This assignment lets the identity write definition files to your storage account's container.

# [PowerShell](#tab/azure-powershell)

In PowerShell, you can use variables for the role assignment. This example uses the `$storageId` you created in a previous step and creates the `$arpId` variable.

```azurepowershell-interactive
$arpId = (Get-AzADServicePrincipal -SearchString "Appliance Resource Provider").Id

New-AzRoleAssignment -ObjectId $arpId `
-RoleDefinitionName Contributor `
-Scope $storageId
```

# [Azure CLI](#tab/azure-cli)

In Azure CLI, you need to use the string values to create the role assignment. This example gets string values from the `storageId` variable you created in a previous step and gets the object ID value for the Appliance Resource Provider. The command has placeholders for those values `arpGuid` and `storageId`. Replace the placeholders with the string values and use the quotes as shown.

```azurecli-interactive
echo $storageId
az ad sp list --display-name "Appliance Resource Provider" --query [].id --output tsv

az role assignment create --assignee "arpGuid" \
--role "Contributor" \
--scope "storageId"
```

If you're running CLI commands with Git Bash for Windows, you might get an `InvalidSchema` error because of the `scope` parameter's string. To fix the error, run `export MSYS_NO_PATHCONV=1` and then rerun your command to create the role assignment.

---

The **Appliance Resource Provider** is a service principal in your Azure Active Directory's tenant. From the Azure portal, you can see if it's registered by going to **Azure Active Directory** > **Enterprise applications** and change the search filter to **Microsoft Applications**. Search for _Appliance Resource Provider_. If it's not found, [register](../troubleshooting/error-register-resource-provider.md) the `Microsoft.Solutions` resource provider.

### Deploy the managed application definition with an ARM template

Use the following ARM template to deploy your packaged managed application as a new managed application definition in your service catalog. The definition files are stored and maintained in your storage account.

Open Visual Studio Code, create a file with the name _azuredeploy.json_ and save it.

Add the following JSON and save the file.

```json
{
  "$schema": "http://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]"
    },
    "applicationName": {
      "type": "string",
      "metadata": {
        "description": "Managed Application name."
      }
    },
    "definitionStorageResourceID": {
      "type": "string",
      "metadata": {
        "description": "Storage account's resource ID where you're storing your managed application definition."
      }
    },
    "packageFileUri": {
      "type": "string",
      "metadata": {
        "description": "The URI where the .zip package file is located."
      }
    }
  },
  "variables": {
    "lockLevel": "None",
    "description": "Sample Managed application definition",
    "displayName": "Sample Managed application definition",
    "managedApplicationDefinitionName": "[parameters('applicationName')]",
    "packageFileUri": "[parameters('packageFileUri')]",
    "defLocation": "[parameters('definitionStorageResourceID')]"
  },
  "resources": [
    {
      "type": "Microsoft.Solutions/applicationDefinitions",
      "apiVersion": "2021-07-01",
      "name": "[variables('managedApplicationDefinitionName')]",
      "location": "[parameters('location')]",
      "properties": {
        "lockLevel": "[variables('lockLevel')]",
        "description": "[variables('description')]",
        "displayName": "[variables('displayName')]",
        "packageFileUri": "[variables('packageFileUri')]",
        "storageAccountId": "[variables('defLocation')]"
      }
    }
  ],
  "outputs": {}
}
```

For more information about the ARM template's properties, see [Microsoft.Solutions/applicationDefinitions](/azure/templates/microsoft.solutions/applicationdefinitions?pivots=deployment-language-arm-template). Managed applications only use ARM template JSON.

### Deploy the definition

Create a resource group named _byosDefinitionRG_ and deploy the managed application definition to your storage account.

# [PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
New-AzResourceGroup -Name byosDefinitionRG -Location eastus

$storageId

New-AzResourceGroupDeployment `
  -ResourceGroupName byosDefinitionRG `
  -TemplateFile .\azuredeploy.json
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az group create --name byosDefinitionRG --location eastus

echo $storageId

az deployment group create \
  --resource-group byosDefinitionRG \
  --template-file ./azuredeploy.json
```

---

You'll be prompted for three parameters to deploy the definition.

| Parameter | Value |
| ---- | ---- |
| `applicationName` | Choose a name for your managed application definition. For this example, use  _sampleManagedAppDefintion_.|
| `definitionStorageResourceID` | Enter your storage account's resource ID. You created the `storageId` variable with this value in an earlier step. Don't wrap the resource ID with quotes. |
| `packageFileUri` | Enter the URI to your _.zip_ package file. Use the URI for the _.zip_ [package file](#package-the-files) you created in an earlier step. The format is `https://yourStorageAccountName.blob.core.windows.net/appcontainer/app.zip`. |

### Verify definition files storage

During deployment, the template's `storageAccountId` property uses your storage account's resource ID and creates a new container with the case-sensitive name `applicationdefinitions`. The files from the _.zip_ package you specified during the deployment are stored in the new container.

You can use the following commands to verify that the managed application definition files are saved in your storage account's container. In the `Name` parameter, replace the placeholder `definitionstorage` with your unique storage account name.

# [PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Get-AzStorageAccount -ResourceGroupName byosStorageRG -Name definitionstorage |
Get-AzStorageContainer -Name applicationdefinitions |
Get-AzStorageBlob | Select-Object -Property *
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az storage blob list \
  --container-name applicationdefinitions \
  --account-name definitionstorage \
  --query "[].{container:container, name:name}"
```

When you run the Azure CLI command, you might see a warning message similar to the CLI command in [package the files](#package-the-files).

---

> [!NOTE]
> For added security, you can create a managed applications definition and store it in an [Azure storage account blob where encryption is enabled](../../storage/common/storage-service-encryption.md). The definition contents are encrypted through the storage account's encryption options. Only users with permissions to the file can see the definition in your service catalog.

## Make sure users can see your definition

You have access to the managed application definition, but you want to make sure other users in your organization can access it. Grant them at least the Reader role on the definition. They may have inherited this level of access from the subscription or resource group. To check who has access to the definition and add users or groups, see [Assign Azure roles using the Azure portal](../../role-based-access-control/role-assignments-portal.md).

## Next steps

You've published the managed application definition. Now, learn how to deploy an instance of that definition.

> [!div class="nextstepaction"]
> [Quickstart: Deploy service catalog app](deploy-service-catalog-quickstart.md)
