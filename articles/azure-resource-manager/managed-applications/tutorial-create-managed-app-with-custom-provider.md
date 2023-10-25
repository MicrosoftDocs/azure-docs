---
title: Tutorial - custom actions & resources
description: This tutorial describes how to create an Azure Managed Application with an Azure Custom Provider.
ms.topic: tutorial
ms.date: 06/20/2019
ms.custom: devx-track-azurecli, devx-track-azurepowershell
---

# Tutorial: Create managed application with custom actions and resources

In this tutorial, you create your own managed application with custom actions and resources. The managed application will contain a custom action on the `Overview` page, a custom resource type displayed as a separate menu item in `Table of Content` and a custom context action on the custom resource page.

This tutorial includes the following steps:

> [!div class="checklist"]
> * Author user interface definition file for creating a managed application instance
> * Author deployment template with [Azure Custom Provider](../custom-providers/overview.md), Azure Storage Account and Azure Function
> * Author view definition artifact with custom actions and resources
> * Deploy a managed application definition
> * Deploy an instance of managed application
> * Perform custom actions and create custom resources

## Prerequisites

To complete this tutorial, you need to know:

* How to [Create and publish a managed application definition](publish-service-catalog-app.md).
* How to [Deploy Service Catalog app through Azure portal](deploy-service-catalog-quickstart.md).
* How to [Create Azure portal user interface for your managed application](create-uidefinition-overview.md).
* [View definition artifact](concepts-view-definition.md) capabilities.
* [Azure Custom Provider](../custom-providers/overview.md) capabilities.

## User interface definition

In this tutorial, you create a managed application and its managed resource group will contain custom provider instance, storage account, and function. The Azure Function used in this example implements an API that handles custom provider operations for actions and resources. Azure Storage Account is used as basic storage for your custom provider resources.

The user interface definition for creating a managed application instance includes `funcname` and `storagename` input elements. Storage account name and function name must be globally unique. By default function files will be deployed from [sample function package](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.customproviders/custom-rp-with-function/artifacts/functionzip), but you can change it by adding an input element for a package link in *createUiDefinition.json*:

```json
{
  "name": "funcname",
  "type": "Microsoft.Common.TextBox",
  "label": "Name of the function to be created",
  "toolTip": "Name of the function to be created",
  "visible": true,
  "constraints": {
    "required": true
  }
},
{
  "name": "storagename",
  "type": "Microsoft.Common.TextBox",
  "label": "Name of the storage to be created",
  "toolTip": "Name of the storage to be created",
  "visible": true,
  "constraints": {
    "required": true
  }
},
{
  "name": "zipFileBlobUri",
  "type": "Microsoft.Common.TextBox",
  "defaultValue": "https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.customproviders/custom-rp-with-function/artifacts/functionzip/functionpackage.zip",
  "label": "The Uri to the uploaded function zip file",
  "toolTip": "The Uri to the uploaded function zip file",
  "visible": true
}
```

and output in *createUiDefinition.json*:

```json
  "funcname": "[steps('applicationSettings').funcname]",
  "storageName": "[steps('applicationSettings').storagename]",
  "zipFileBlobUri": "[steps('applicationSettings').zipFileBlobUri]"
```

The complete *createUiDefinition.json* sample can be found at [Reference: User interface elements artifacts](reference-createuidefinition-artifact.md).

## Template with custom provider

To create a managed application instance with custom provider, you need to define custom provider resource with name **public** and type **Microsoft.CustomProviders/resourceProviders** in your **mainTemplate.json**. In that resource, you define the resource types and actions for your service. To deploy Azure Function and Azure Storage Account instances define resources of type `Microsoft.Web/sites` and `Microsoft.Storage/storageAccounts` respectively.

In this tutorial, you will create one `users` resource type, `ping` custom action, and `users/contextAction` custom action that will be performed in a context of a `users` custom resource. For each resource type and action provide an endpoint pointing to the function with name provided in [createUiDefinition.json](#user-interface-definition). Specify the **routingType** as `Proxy,Cache` for resource types and `Proxy` for actions:

```json
{
  "apiVersion": "[variables('customrpApiversion')]",
  "type": "Microsoft.CustomProviders/resourceProviders",
  "name": "[variables('customProviderName')]",
  "location": "[parameters('location')]",
  "properties": {
    "actions": [
      {
        "name": "ping",
        "routingType": "Proxy",
        "endpoint": "[listSecrets(resourceId('Microsoft.Web/sites/functions', parameters('funcname'), 'HttpTrigger1'), '2018-02-01').trigger_url]"
      },
      {
        "name": "users/contextAction",
        "routingType": "Proxy",
        "endpoint": "[listSecrets(resourceId('Microsoft.Web/sites/functions', parameters('funcname'), 'HttpTrigger1'), '2018-02-01').trigger_url]"
      }
    ],
    "resourceTypes": [
      {
        "name": "users",
        "routingType": "Proxy,Cache",
        "endpoint": "[listSecrets(resourceId('Microsoft.Web/sites/functions', parameters('funcname'), 'HttpTrigger1'), '2018-02-01').trigger_url]"
      }
    ]
  },
  "dependsOn": [
    "[concat('Microsoft.Web/sites/',parameters('funcname'))]"
  ]
}
```

The complete *mainTemplate.json* sample can be found at [Reference: Deployment template artifact](reference-main-template-artifact.md).

## View definition artifact

To define user interface that includes custom actions and custom resources in your managed application, you need to author **viewDefinition.json** artifact. For more information about view definition artifact, see [View definition artifact in Azure Managed Applications](concepts-view-definition.md).

In this tutorial, you define:
* An *Overview* page with toolbar button that represents a custom action `TestAction` with basic text input.
* A *Users* page that represents a custom resource type `users`.
* A custom resource action `users/contextAction` in *Users* page that will be performed in a context of custom resource of type `users`.

The following example shows view configuration for an "Overview" page:

```json
{
    "kind": "Overview",
    "properties": {
      "header": "Welcome to your Demo Azure Managed Application",
      "description": "This Managed application with Custom Provider is for demo purposes only.",
      "commands": [{
          "displayName": "Ping Action",
          "path": "/customping",
          "icon": "LaunchCurrent"
      }]
    }
  }
```

The example below includes "Users" resources page configuration with custom resource action:

```json
{
    "kind": "CustomResources",
    "properties": {
      "displayName": "Users",
      "version": "1.0.0.0",
      "resourceType": "users",
      "createUIDefinition": {
      },
      "commands": [{
        "displayName": "Custom Context Action",
        "path": "users/contextAction",
        "icon": "Start"
      }],
      "columns": [
        { "key": "properties.FullName", "displayName": "Full Name" },
        { "key": "properties.Location", "displayName": "Location", "optional": true }
      ]
    }
  }
```

The complete *viewDefinition.json* sample can be found at [Reference: View definition artifact](reference-view-definition-artifact.md).

## Managed application definition

Package the following managed application artifacts to zip archive and upload it to storage:

* createUiDefinition.json
* mainTemplate.json
* viewDefinition.json

All files must be at root level. The package with artifacts can be stored in any storage, for example GitHub blob or Azure Storage Account blob. Here is a script to upload the application package to storage account:

```powershell
$resourceGroup="appResourcesGroup"
$storageName="mystorageaccount$RANDOM"

# Sign in to your Azure subscription
Connect-AzAccount
# Create resource group for managed application definition and application package
New-AzResourceGroup -Name $resourceGroup -Location eastus

# Create storage account for a package with application artifacts
$storageAccount=New-AzStorageAccount `
  -ResourceGroupName $resourceGroup `
  -Name $storageName `
  -SkuName Standard_LRS `
  -Location eastus `
$ctx=$storageAccount.Context

# Create storage container and upload zip to blob
New-AzStorageContainer -Name appcontainer -Context $ctx -Permission blob
Set-AzStorageBlobContent `
  -File "path_to_your_zip_package" `
  -Container appcontainer `
  -Blob app.zip `
  -Context $ctx

# Get blob absolute uri
$blobUri=(Get-AzureStorageBlob -Container appcontainer -Blob app.zip -Context $ctx).ICloudBlob.uri.AbsoluteUri
```

Run the Azure CLI script below or follow the steps in Azure portal to deploy a Service Catalog managed application definition:

[!INCLUDE [sample-cli-install](../../../includes/sample-cli-install.md)]

# [Azure CLI](#tab/azurecli-interactive)

```azurecli-interactive
resourceGroup="appResourcesGroup"
# Select subscription and create resource group (if you have not created yet)
az account set --subscription <subscriptionID>
az group create --name $resourceGroup --location eastus

# Get object ID of your identity
userid=$(az ad user show --upn-or-object-id example@contoso.org --query objectId --output tsv)
# Get role definition ID for the Owner role
roleid=$(az role definition list --name Owner --query [].name --output tsv)

# Create managed application definition resource
az managedapp definition create \
  --name "ManagedUsersAppDefinition" \
  --location "eastus" \
  --resource-group $resourceGroup \
  --lock-level ReadOnly \
  --display-name "Managed users app definition" \
  --description "Managed application with Azure Custom Provider" \
  --authorizations "$userid:$roleid" \
  --package-file-uri "path to your app.zip package"
```

# [Portal](#tab/azure-portal)

1. In the Azure portal, select **All services**. In the list of resources, type and select **Managed Applications Center**.
2. On the **Managed Applications Center**, choose **Service Catalog application definition** and click **Add**.

    ![Add Service Catalog](./media/tutorial-create-managed-app-with-custom-provider/service-catalog-managed-application.png)

3. Provide values for creating a Service Catalog definition:

    * Provide a unique **Name** for the Service Catalog definition, **Display Name** and *Description*(optional).
    * Select the **Subscription**, **Resource group**, and **Location** where application definition will be created. You can use the same resource group that is used for zip package or create a new resource group.
    * For a **Package File Uri**, provide the path to the zip file you created in previous step.

    ![Provide values](./media/tutorial-create-managed-app-with-custom-provider/add-service-catalog-managed-application.png)

4. When you get to the Authentication and Lock Level section, select **Add Authorization**.

    ![Add authorization](./media/tutorial-create-managed-app-with-custom-provider/add-authorization.png)

5. Select a Microsoft Entra group to manage the resources, and select **OK**.

   ![Add authorization group](./media/tutorial-create-managed-app-with-custom-provider/add-auth-group.png)

6. When you have provided all the values, select **Create**.

   ![Create managed application definition](./media/tutorial-create-managed-app-with-custom-provider/create-service-catalog-definition.png)

---

## Managed application instance

When managed application definition is deployed, run the script below or follow the steps in Azure portal to deploy your managed application instance with custom provider:

# [Azure CLI](#tab/azurecli-interactive)

```azurecli-interactive
appResourcesGroup="appResourcesGroup"
applicationGroup="usersApplicationGroup"

# Create resource group for managed application instance
az group create --name $applicationGroup --location eastus

# Get ID of managed application definition
appid=$(az managedapp definition show --name ManagedUsersAppDefinition --resource-group $appResourcesGroup --query id --output tsv)

# Create the managed application
az managedapp create \
  --name ManagedUsersApp \
  --location "eastus" \
  --kind "Servicecatalog" \
  --resource-group $applicationGroup \
  --managedapp-definition-id $appid \
  --managed-rg-id "managedResourcesGroup" \
  --parameters "{\"funcname\": {\"value\": \"managedusersappfunction\"}, \"storageName\": {\"value\": \"managedusersappstorage\"}}"
```

# [Portal](#tab/azure-portal)

1. In the Azure portal, select **All services**. In the list of resources, type and select **Managed Applications Center**.
2. On the **Managed Applications Center**, choose **Service Catalog applications** and click **Add**.

    ![Add managed application](./media/tutorial-create-managed-app-with-custom-provider/add-managed-application.png)

3. On the **Service Catalog applications** page type Service Catalog definition display name in search box. Select the definition created in previous step and click **Create**.

    ![Select service catalog](./media/tutorial-create-managed-app-with-custom-provider/select-service-catalog-definition.png)

4. Provide values for creating a managed application instance from Service Catalog definition:

    * Select the **Subscription**, **Resource group**, and **Location** where application instance will be created.
    * Provide a unique Azure Function name and Azure Storage Account name.

    ![Application settings](./media/tutorial-create-managed-app-with-custom-provider/application-settings.png)

5. When validation passed, click **OK** to deploy an instance of a managed application.

    ![Deploy managed application](./media/tutorial-create-managed-app-with-custom-provider/deploy-managed-application.png)

---

## Custom actions and resources

After the service catalog application instance has been deployed, you have two new resource groups. First resource group `applicationGroup` contains an instance of the managed application, second resource group `managedResourceGroup` holds the resources for the managed application, including **custom provider**.

![Application resource groups](./media/tutorial-create-managed-app-with-custom-provider/application-resource-groups.png)

You can go to managed application instance and perform **custom action** in "Overview" page, create **users** custom resource in "Users" page and run **custom context action** on custom resource.

* Go to "Overview" page and click "Ping Action" button:

![Perform custom action](./media/tutorial-create-managed-app-with-custom-provider/perform-custom-action.png)

* Go to "Users" page and click "Add" button. Provide inputs for creating a resource and submit the form:

![Screenshot shows the Add button selected from Users.](./media/tutorial-create-managed-app-with-custom-provider/create-custom-resource.png)

* Go to "Users" page, select a "users" resource and click "Custom Context Action":

![Screenshot shows Custom Context Action selected.](./media/tutorial-create-managed-app-with-custom-provider/perform-custom-resource-action.png)

[!INCLUDE [clean-up-section-portal](../../../includes/clean-up-section-portal.md)]

## Looking for help

If you have questions about Azure Managed Applications, you can try asking on [Stack Overflow](https://stackoverflow.com/questions/tagged/azure-managed-app) with tag azure-managed-app or [Microsoft Q&A](/answers/topics/azure-managed-applications.html) with tag azure-managed-application. A similar question may have already been asked and answered, so check first before posting. Please use respective tags for faster response.

## Next steps

To publish your managed application to the Azure Marketplace, see [Azure managed applications in the Marketplace](../../marketplace/azure-app-offer-setup.md).

Learn more about [Azure Custom Providers](../custom-providers/overview.md).
