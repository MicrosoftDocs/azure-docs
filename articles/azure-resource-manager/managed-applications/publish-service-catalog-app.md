---
title: Create and publish Azure Managed Application in service catalog
description: Describes how to create and publish an Azure Managed Application in your service catalog using Azure PowerShell, Azure CLI, or Azure portal.
ms.topic: quickstart
ms.custom: subject-armqs, devx-track-azurecli, devx-track-azurepowershell, subject-rbac-steps, mode-api, mode-arm, devx-track-arm-template, engagement-fy23
ms.date: 09/22/2024
---

# Quickstart: Create and publish an Azure Managed Application definition

This quickstart provides an introduction to working with [Azure Managed Applications](overview.md). You create and publish a managed application definition that's stored in your service catalog and is intended for members of your organization.

To publish a managed application to your service catalog, do the following tasks:

- Create an Azure Resource Manager template (ARM template) that defines the resources that deploy with the managed application.
- Define the user interface elements for the portal when deploying the managed application.
- Create a _.zip_ package that contains the required JSON files. The _.zip_ package file has a 120-MB limit for a service catalog's managed application definition.
- Publish the managed application definition so it's available in your service catalog.

If your managed application definition is more than 120 MB or if you want to use your own storage account for your organization's compliance reasons, go to [Quickstart: Bring your own storage to create and publish an Azure Managed Application definition](publish-service-catalog-bring-your-own-storage.md).

You can use Bicep to develop a managed application definition but it must be converted to ARM template JSON before you can publish the definition in Azure. For more information, go to [Quickstart: Use Bicep to create and publish an Azure Managed Application definition](publish-bicep-definition.md#convert-bicep-to-json).

You can also use Bicep deploy a managed application definition from your service catalog. For more information, go to [Quickstart: Use Bicep to deploy an Azure Managed Application definition](deploy-bicep-definition.md).

## Prerequisites

To complete this quickstart, you need the following items:

- An Azure account with an active subscription and permissions to Microsoft Entra resources like users, groups, or service principals. If you don't have an account, [create a free account](https://azure.microsoft.com/free/) before you begin.
- [Visual Studio Code](https://code.visualstudio.com/) with the latest [Azure Resource Manager Tools extension](https://marketplace.visualstudio.com/items?itemName=msazurermtools.azurerm-vscode-tools). For Bicep files, install the [Bicep extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-bicep).
- Install the latest version of [Azure PowerShell](/powershell/azure/install-azure-powershell) or [Azure CLI](/cli/azure/install-azure-cli).

## Create the ARM template

Every managed application definition includes a file named _mainTemplate.json_. The template defines the Azure resources to deploy and is no different than a regular ARM template.

Open Visual Studio Code, create a file with the case-sensitive name _mainTemplate.json_ and save it.

Add the following JSON and save the file. It defines the resources to deploy an App Service and App Service plan. The template uses the App Service Basic plan (B1) that has pay-as-you-go costs. For more information, see [Azure App Service on Linux pricing](https://azure.microsoft.com/pricing/details/app-service/linux/).

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
    }
  },
  "variables": {
    "appServicePlanSku": "B1",
    "appServicePlanCapacity": 1,
    "appServiceName": "[format('{0}{1}', parameters('appServiceNamePrefix'), uniqueString(resourceGroup().id))]",
    "linuxFxVersion": "DOTNETCORE|8.0"
  },
  "resources": [
    {
      "type": "Microsoft.Web/serverfarms",
      "apiVersion": "2023-01-01",
      "name": "[parameters('appServicePlanName')]",
      "location": "[parameters('location')]",
      "sku": {
        "name": "[variables('appServicePlanSku')]",
        "capacity": "[variables('appServicePlanCapacity')]"
      },
      "kind": "linux",
      "properties": {
        "zoneRedundant": false,
        "reserved": true
      }
    },
    {
      "type": "Microsoft.Web/sites",
      "apiVersion": "2023-01-01",
      "name": "[variables('appServiceName')]",
      "location": "[parameters('location')]",
      "properties": {
        "serverFarmId": "[resourceId('Microsoft.Web/serverfarms', parameters('appServicePlanName'))]",
        "httpsOnly": true,
        "redundancyMode": "None",
        "siteConfig": {
          "linuxFxVersion": "[variables('linuxFxVersion')]",
          "minTlsVersion": "1.2",
          "ftpsState": "Disabled"
        }
      },
      "dependsOn": [
        "[resourceId('Microsoft.Web/serverfarms', parameters('appServicePlanName'))]"
      ]
    }
  ],
  "outputs": {
    "appServicePlan": {
      "type": "string",
      "value": "[parameters('appServicePlanName')]"
    },
    "appServiceApp": {
      "type": "string",
      "value": "[reference(resourceId('Microsoft.Web/sites', variables('appServiceName')), '2023-01-01').defaultHostName]"
    }
  }
}
```

## Define your portal experience

As a publisher, you define the portal experience to create the managed application. The _createUiDefinition.json_ file generates the portal's user interface. You define how users provide input for each parameter using [control elements](create-uidefinition-elements.md) like drop-downs and text boxes.

In this example, the user interface prompts you to input the App Service name prefix and App Service plan's name. During deployment of _mainTemplate.json_ the `appServiceName` variables uses the `uniqueString` function to append a 13-character string to the name prefix so the name is globally unique across Azure.

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
      }
    ],
    "outputs": {
      "location": "[location()]",
      "appServicePlanName": "[steps('webAppSettings').appServicePlanName]",
      "appServiceNamePrefix": "[steps('webAppSettings').appServiceName]"
    }
  }
}
```

To learn more, see [Get started with CreateUiDefinition](create-uidefinition-overview.md).

## Package the files

Add the two files to a package file named _app.zip_. The two files must be at the root level of the _.zip_ file. If the files are in a folder, when you create the managed application definition, you receive an error that states the required files aren't present.

Upload _app.zip_ to an Azure storage account so you can use it when you deploy the managed application's definition. The storage account name must be globally unique across Azure and the length must be 3-24 characters with only lowercase letters and numbers. In the command, replace the placeholder `<pkgstorageaccountname>` including the angle brackets (`<>`), with your unique storage account name.

# [Azure PowerShell](#tab/azure-powershell)

In Visual Studio Code, open a new PowerShell terminal and sign in to your Azure subscription.

```azurepowershell
Connect-AzAccount
```

The command opens your default browser and prompts you to sign in to Azure. For more information, go to [Sign in with Azure PowerShell](/powershell/azure/authenticate-azureps).

```azurepowershell
New-AzResourceGroup -Name packageStorageGroup -Location westus

$pkgstorageparms = @{
  ResourceGroupName = "packageStorageGroup"
  Name = "<pkgstorageaccountname>"
  Location = "westus"
  SkuName = "Standard_LRS"
  Kind = "StorageV2"
  MinimumTlsVersion = "TLS1_2"
  AllowBlobPublicAccess = $true
  AllowSharedKeyAccess = $false
}

$pkgstorageaccount = New-AzStorageAccount @pkgstorageparms
```

The `$pkgstorageparms` variable uses PowerShell [splatting](/powershell/module/microsoft.powershell.core/about/about_splatting) to improve readability for the parameter values used in the command to create the new storage account. Splatting is used in other PowerShell commands that use multiple parameter values.

After you create the storage account, add the role assignment _Storage Blob Data Contributor_ to the storage account scope. Assign access to your Microsoft Entra user account. Depending on your access level in Azure, you might need other permissions assigned by your administrator. For more information, see [Assign an Azure role for access to blob data](../../storage/blobs/assign-azure-role-data-access.md) and [Assign Azure roles using the Azure portal](../../role-based-access-control/role-assignments-portal.yml).

After you add the role to the storage account, it takes a few minutes to become active in Azure. You can then create the context needed to create the container and upload the file.

```azurepowershell
$pkgstoragecontext = New-AzStorageContext -StorageAccountName $pkgstorageaccount.StorageAccountName -UseConnectedAccount

New-AzStorageContainer -Name appcontainer -Context $pkgstoragecontext -Permission blob

$blobparms = @{
  File = "app.zip"
  Container = "appcontainer"
  Blob = "app.zip"
  Context = $pkgstoragecontext
}

Set-AzStorageBlobContent @blobparms
```

# [Azure CLI](#tab/azure-cli)

In Visual Studio Code, open a new Bash terminal session and sign in to your Azure subscription. If you have Git installed, select Git Bash.

```azurecli
az login
```

The command opens your default browser and prompts you to sign in to Azure. For more information, go to [Sign in with Azure CLI](/cli/azure/authenticate-azure-cli).

```azurecli
az group create --name packageStorageGroup --location westus

az storage account create \
  --name <pkgstorageaccountname> \
  --resource-group packageStorageGroup \
  --location westus \
  --sku Standard_LRS \
  --kind StorageV2 \
  --min-tls-version TLS1_2 \
  --allow-blob-public-access true \
  --allow-shared-key-access false

pkgstgacct=$(az storage account show \
  --resource-group packageStorageGroup \
  --name <pkgstorageaccountname> \
  --query name \
  --output tsv)
```

The backslash (`\`) is a line continuation character to improve readability of the command's parameters and is used in many of the Azure CLI commands. The `pkgstgacct` variable contains the storage account name for use in other commands.

After you create the storage account, add the role assignment _Storage Blob Data Contributor_ to the storage account scope. Assign access to your Microsoft Entra user account. Depending on your access level in Azure, you might need other permissions assigned by your administrator. For more information, see [Assign an Azure role for access to blob data](../../storage/blobs/assign-azure-role-data-access.md).

After you add the role to the storage account, it takes a few minutes to become active in Azure. You can then use the parameter `--auth-mode login` in the commands to create the container and upload the file.

```azurecli
az storage container create \
  --account-name $pkgstgacct \
  --name appcontainer \
  --auth-mode login \
  --public-access blob

az storage blob upload \
  --account-name $pkgstgacct \
  --container-name appcontainer \
  --auth-mode login \
  --name "app.zip" \
  --file "app.zip"
```

For more information about storage authentication, see [Choose how to authorize access to blob data with Azure CLI](../../storage/blobs/authorize-data-operations-cli.md).

# [Portal](#tab/azure-portal)

Create a storage account in a new resource group:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select **Create a resource** from the portal's **Home** page.

   :::image type="content" source="./media/publish-service-catalog-app/create-resource.png" alt-text="Screenshot of Azure portal home page with create a resource highlighted.":::

1. Search for _storage account_ and select it from the available options.
1. Select **Create** on the **Storage accounts** page.

   :::image type="content" source="./media/publish-service-catalog-app/create-storage-account.png" alt-text="Screenshot of the storage accounts page with the create button highlighted.":::

1. On the **Basics** tab, enter the required information.

   :::image type="content" source="./media/publish-service-catalog-app/create-storage-account-basics.png" alt-text="Screenshot of the Basics tab on the Azure form to create a storage account.":::

   - **Resource group**: Select **Create new** to create the _packageStorageGroup_ resource group.
   - **Storage account name**: Enter a unique storage account name. The storage account name must be globally unique across Azure and the length must be 3-24 characters with only lowercase letters and numbers.
   - **Region**: _West US_
   - **Performance**: _Standard_
   - **Redundancy**: _Locally-redundant storage (LRS)_.

1. On the **Advanced** tab, use the following settings.

   - Select **Require secure transfer for REST API operations**.
   - Select **Allow enabling anonymous access on individual containers**.
   - Uncheck the box **Enable storage account key access**.
   - Verify **Minimum TLS version** is _Version 1.2_.

1. Accept the defaults on the other tabs.
1. Select **Review + create** and then select **Create**.
1. Select **Go to resource** to go to the storage account.

After you create the storage account, add the role assignment _Storage Blob Data Contributor_ to the storage account scope. Assign access to your Microsoft Entra user account. Depending on your access level in Azure, you might need other permissions assigned by your administrator. For more information, see [Assign an Azure role for access to blob data](../../storage/blobs/assign-azure-role-data-access.md). After you add the role to the storage account, it takes a few minutes to become active in Azure.

Create a container and upload the _app.zip_ file:

1. Go to **Data storage** and select **Containers**.

   :::image type="content" source="./media/publish-service-catalog-app/create-new-container.png" alt-text="Screenshot of the storage account's screen to create a new container.":::

1. Configure the container's properties and select **Create**.

   :::image type="content" source="./media/publish-service-catalog-app/create-new-container-properties.png" alt-text="Screenshot of the new container screen to enter a name and public access level.":::

   - **Name**: _appcontainer_.
   - **Public access level**: Select _Blob_.

1. Select _appcontainer_.
1. Select **Upload** and follow the prompts to upload your _app.zip_ file to the container.

   :::image type="content" source="./media/publish-service-catalog-app/upload-zip-file.png" alt-text="Screenshot of the appcontainer to upload the zip file to your storage account.":::

   You can drag and drop the file to the portal or browse to the file's location on your computer.

1. After the file is uploaded, select _app.zip_ in the container.
1. Copy the _app.zip_ file's URL from the **Overview** > **URL**.

   :::image type="content" source="./media/publish-service-catalog-app/copy-file-url.png" alt-text="Screenshot of the zip file's URL with copy button highlighted.":::

Make a note of the _app.zip_ file's URL because you need it to create the managed application definition.

---

## Create the managed application definition

In this section, you get identity information from Microsoft Entra ID, create a resource group, and deploy the managed application definition.

### Get group ID and role definition ID

The next step is to select a user, security group, or application for managing the resources for the customer. This identity has permissions on the managed resource group according to the assigned role. The role can be any Azure built-in role like Owner or Contributor.


# [Azure PowerShell](#tab/azure-powershell)

This example uses a security group, and your Microsoft Entra account should be a member of the group. To get the group's object ID, replace the placeholder `<managedAppDemo>` including the angle brackets (`<>`), with your group's name. You use this variable's value when you deploy the managed application definition.

To create a new Microsoft Entra group, go to [Manage Microsoft Entra groups and group membership](../../active-directory/fundamentals/how-to-manage-groups.md).

```azurepowershell
$principalid=(Get-AzADGroup -DisplayName <managedAppDemo>).Id
```

Next, get the role definition ID of the Azure built-in role you want to grant access to the user, group, or application. You use this variable's value when you deploy the managed application definition.

```azurepowershell
$roleid=(Get-AzRoleDefinition -Name Owner).Id
```

# [Azure CLI](#tab/azure-cli)

This example uses a security group, and your Microsoft Entra account should be a member of the group. To get the group's object ID, replace the placeholder `<managedAppDemo>` including the angle brackets (`<>`), with your group's name. You use this variable's value when you deploy the managed application definition.

To create a new Microsoft Entra group, go to [Manage Microsoft Entra groups and group membership](../../active-directory/fundamentals/how-to-manage-groups.md).

```azurecli
principalid=$(az ad group show --group <managedAppDemo> --query id --output tsv)
```

Next, get the role definition ID of the Azure built-in role you want to grant access to the user, group, or application. You use this variable's value when you deploy the managed application definition.

```azurecli
roleid=$(az role definition list --name Owner --query [].name --output tsv)
```

# [Portal](#tab/azure-portal)

In the portal, the group ID and role ID are configured when you publish the managed application definition.

---

### Publish the managed application definition

# [Azure PowerShell](#tab/azure-powershell)

Create a resource group for your managed application definition.

```azurepowershell
New-AzResourceGroup -Name appDefinitionGroup -Location westus
```

The `blob` command creates a variable to store the URL for the package _.zip_ file. That variable is used in the command that creates the managed application definition.

```azurepowershell
$blob = Get-AzStorageBlob -Container appcontainer -Blob app.zip -Context $pkgstoragecontext

$publishparms = @{
  Name = "sampleManagedApplication"
  Location = "westus"
  ResourceGroupName = "appDefinitionGroup"
  LockLevel = "ReadOnly"
  DisplayName = "Sample managed application"
  Description = "Sample managed application that deploys web resources"
  Authorization = "${principalid}:$roleid"
  PackageFileUri = $blob.ICloudBlob.StorageUri.PrimaryUri.AbsoluteUri
}

New-AzManagedApplicationDefinition @publishparms
```

When the command completes, you have a managed application definition in your resource group.

Some of the parameters used in the preceding example are:

- `ResourceGroupName`: The name of the resource group where the managed application definition is created.
- `LockLevel`: The `lockLevel` on the managed resource group prevents the customer from performing undesirable operations on this resource group. Currently, `ReadOnly` is the only supported lock level. `ReadOnly` specifies that the customer can only read the resources present in the managed resource group. The publisher identities that are granted access to the managed resource group are exempt from the lock level.
- `Authorization`: Describes the principal ID and the role definition ID that are used to grant permission to the managed resource group.
  - `"${principalid}:$roleid"` or you can use curly braces for each variable `"${principalid}:${roleid}"`.
  - Use a comma to separate multiple values: `"${principalid1}:$roleid1", "${principalid2}:$roleid2"`.
- `PackageFileUri`: The location of a _.zip_ package file that contains the required files.

# [Azure CLI](#tab/azure-cli)

Create a resource group for your managed application definition.

```azurecli
az group create --name appDefinitionGroup --location westus
```

The `blob` command creates a variable to store the URL for the package _.zip_ file. That variable is used in the command that creates the managed application definition.

```azurecli
blob=$(az storage blob url \
  --account-name $pkgstgacct \
  --container-name appcontainer \
  --auth-mode login \
  --name app.zip --output tsv)

az managedapp definition create \
  --name "sampleManagedApplication" \
  --location "westus" \
  --resource-group appDefinitionGroup \
  --lock-level ReadOnly \
  --display-name "Sample managed application" \
  --description "Sample managed application that deploys web resources" \
  --authorizations "$principalid:$roleid" \
  --package-file-uri "$blob"
```

When the command completes, you have a managed application definition in your resource group.

Some of the parameters used in the preceding example are:

- `resource-group`: The name of the resource group where the managed application definition is created.
- `lock-level`: The `lockLevel` on the managed resource group prevents the customer from performing undesirable operations on this resource group. Currently, `ReadOnly` is the only supported lock level. `ReadOnly` specifies that the customer can only read the resources present in the managed resource group. The publisher identities that are granted access to the managed resource group are exempt from the lock level.
- `authorizations`: Describes the principal ID and the role definition ID that are used to grant permission to the managed resource group.
  - `"$principalid:$roleid"` or you can use curly braces like `"${principalid}:${roleid}"`.
  - Use a space to separate multiple values: `"$principalid1:$roleid1" "$principalid2:$roleid2"`.
- `package-file-uri`: The location of a _.zip_ package file that contains the required files.

# [Portal](#tab/azure-portal)

To publish a managed application definition from the Azure portal, use the following steps.

1. Select **Create a resource** from the portal's **Home** page.
1. Search for _Service Catalog Managed Application Definition_ and select it from the available options.
1. Select **Create** from the **Service Catalog Managed Application Definition** page.

   :::image type="content" source="./media/publish-service-catalog-app/create-service-catalog-definition.png" alt-text="Screenshot of the Service Catalog Managed Application Definition page with the create button highlighted.":::

1. On the **Basics** tab, enter the following information and select **Next**.

   :::image type="content" source="./media/publish-service-catalog-app/create-service-catalog-definition-basics.png" alt-text="Screenshot of the Basics tab on the form to create a service catalog definition. ":::

   - **Project details**:
     - Select your subscription name.
     - Create a new resource group named _appDefinitionGroup_.
   - **Instance details**:
      - **Name**: Enter a name like _instance-name_. The name isn't used in the definition but the form requires an entry.
      - **Region**: _West US_
   - **Application details**:
      - **Name**: _sampleManagedApplication_
      - **Display name**: _Sample managed application_
      - **Description**: _Sample managed application that deploys web resources_

1. On the **Package** tab, enter the **Package file uri** for your _app.zip_ file.
1. Ignore the **Management settings** tab.
1. On the **Authentication and lock level** tab, enter the following information and then select **Review + create**.

   :::image type="content" source="./media/publish-service-catalog-app/create-service-catalog-definition-authentication.png" alt-text="Screenshot of the authentication and lock level for the managed application definition.":::

   - **Lock level**: Select _Read Only_.
   - Select **Add members**.
     - **Roles**: Select _Owner_.
     - **Select principals**: Select your group's name like _managedAppDemo_.

     The **Lock level** on the managed resource group prevents the customer from performing undesirable operations on this resource group. `Read Only` specifies that the customer can only read the resources present in the managed resource group. The publisher identities that are granted access to the managed resource group are exempt from the lock level.

1. After **Validation Passed** is displayed, select **Create**.

   :::image type="content" source="./media/publish-service-catalog-app/create-service-catalog-definition-validation.png" alt-text="Screenshot of portal that shows validation passed for the managed application definition.":::

When the deployment is complete, you have a managed application definition in your resource group.

---

## Make sure users can see your definition

You have access to the managed application definition, but you want to make sure other users in your organization can access it. Grant them at least the Reader role on the definition. They might have inherited this level of access from the subscription or resource group. To check who has access to the definition and add users or groups, see [Assign Azure roles using the Azure portal](../../role-based-access-control/role-assignments-portal.yml).

## Clean up resources

If you're going to deploy the definition, continue with the **Next steps** section that links to the article to deploy the definition.

If you're finished with the managed application definition, you can delete the resource groups you created named _packageStorageGroup_ and _appDefinitionGroup_.

# [Azure PowerShell](#tab/azure-powershell)

The command prompts you to confirm that you want to remove the resource group.

```azurepowershell
Remove-AzResourceGroup -Name packageStorageGroup

Remove-AzResourceGroup -Name appDefinitionGroup
```

# [Azure CLI](#tab/azure-cli)

The command prompts for confirmation, and then returns you to command prompt while resources are being deleted.

```azurecli
az group delete --resource-group packageStorageGroup --no-wait

az group delete --resource-group appDefinitionGroup --no-wait
```

# [Portal](#tab/azure-portal)

1. From Azure portal **Home**, in the search field, enter _resource groups_.
1. Select **Resource groups**.
1. Select _packageStorageGroup_ and **Delete resource group**.
1. To confirm the deletion, enter the resource group name and select **Delete**.

Use the same steps to delete _appDefinitionGroup_.

---

## Next steps

You published the managed application definition. The next step is to learn how to deploy an instance of that definition.

> [!div class="nextstepaction"]
> [Quickstart: Deploy a service catalog managed application](deploy-service-catalog-quickstart.md)
