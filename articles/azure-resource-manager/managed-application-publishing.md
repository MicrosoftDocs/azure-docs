---
title: Create and publish an Azure service catalog managed application | Microsoft Docs
description: Shows how to create an Azure managed application that is intended for members of your organization.
services: azure-resource-manager
author: ravbhatnagar
manager: rjmax

ms.service: azure-resource-manager
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.date: 08/23/2017
ms.author: gauravbh; tomfitz
---
# Publish a managed application for internal consumption

You can create and publish Azure [managed applications](managed-application-overview.md) that are intended for members of your organization. For example, an IT department can publish managed applications that ensure compliance with organizational standards. These managed applications are available through the service catalog, not the Azure Marketplace.

To publish a managed application for the service catalog, you must:

* Create a .zip package that contains the three required template files.
* Decide which user, group, or application needs access to the resource group in the user's subscription.
* Create the managed application definition that points to the .zip package and requests access for the identity.

## Create a managed application package

The first step is to create the three required template files. Package all three files into a .zip file, and upload it to an accessible location, such as a storage account. You pass a link to this .zip file when creating the managed application definition.

* **applianceMainTemplate.json**: This file defines the Azure resources that are provisioned as part of the managed application. The template is no different than a regular Resource Manager template. For example, to create a storage account through a managed application, applianceMainTemplate.json contains:

  ```json
  {
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "storageAccountNamePrefix": {
            "type": "string"
        }
    },
    "resources": [
        {
            "type": "Microsoft.Storage/storageAccounts",
            "name": "[concat(parameters('storageAccountNamePrefix'), uniqueString(resourceGroup().id))]",
            "apiVersion": "2016-01-01",
            "location": "[resourceGroup().location]",
            "sku": {
                "name": "Standard_LRS"
            },
            "kind": "Storage",
            "properties": {}
        }
    ],
    "outputs": {}
  }
  ```

* **mainTemplate.json**: Users deploy this template when creating the managed application. It defines the managed application resource, which is a Microsoft.Solutions/appliances resource type. This file contains all the parameters you need for the resources in applianceMainTemplate.json.

  You set two important properties in this template. First, the **applianceDefinitionId** property is the ID of the managed application definition. You create the definition later in this topic. When setting this value, you must decide which subscription and resource group to use for storing the managed application definitions. And, you must decide on a name for the definition. The ID is in the format:

  `/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.Solutions/applianceDefinitions/<definition-name>`

  Second, the **managedResourceGroupId** property is the ID of the resource group where the Azure resources are created. You can assign a value for this resource group name or let the user provide a name. The format of the ID is:

  `/subscriptions/<subscription-id>/resourceGroups/<resoure-group-name>`.

  The following example shows a mainTemplate.json file. It specifies a resource group for the deployed resources. The definition ID is set to use a definition named **storageApp** in a resource group named **managedApplicationGroup**. You can change these values to use different names. Provide your own subscription ID in the definition ID.

  ```json
  {
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "storageAccountNamePrefix": {
            "type": "string"
        }
    },
    "variables": {
        "managedRGId": "[concat(resourceGroup().id,'-application-resources')]",
        "managedAppName": "[concat('managedStorage', uniqueString(resourceGroup().id))]"
    },
    "resources": [
        {
            "type": "Microsoft.Solutions/appliances",
            "name": "[variables('managedAppName')]",
            "apiVersion": "2016-09-01-preview",
            "location": "[resourceGroup().location]",
            "kind": "ServiceCatalog",
            "properties": {
                "managedResourceGroupId": "[variables('managedRGId')]",
                "applianceDefinitionId": "/subscriptions/<subscription-id>/resourceGroups/managedApplicationGroup/providers/Microsoft.Solutions/applianceDefinitions/storageApp",
                "parameters": {
                    "storageAccountNamePrefix": {
                        "value": "[parameters('storageAccountNamePrefix')]"
                    }
                }
            }
        }
    ]
  }
  ```

* **applianceCreateUiDefinition.json**: The Azure portal uses this file to generate the user interface for users who create the managed application. You define how users provide input for each parameter. You can use options like a drop-down list, text box, password box, and other input tools. To learn how to create a UI definition file for a managed application, see [Get started with CreateUiDefinition](managed-application-createuidefinition-overview.md).

  The following example shows an applianceCreateUiDefinition.json file that enables users to specify the storage account name prefix through a textbox.

  ```json
  {
    "$schema": "https://schema.management.azure.com/schemas/0.1.2-preview/CreateUIDefinition.MultiVm.json",
    "handler": "Microsoft.Compute.MultiVm",
    "version": "0.1.2-preview",
    "parameters": {
        "basics": [
            {
                "name": "storageAccounts",
                "type": "Microsoft.Common.TextBox",
                "label": "Storage account name prefix",
                "defaultValue": "storage",
                "toolTip": "Provide a value that is used for the prefix of your storage account. Limit to 11 characters.",
                "constraints": {
                    "required": true,
                    "regex": "^[a-z0-9A-Z]{1,11}$",
                    "validationMessage": "Only alphanumeric characters are allowed, and the value must be 1-11 characters long."
                },
                "visible": true
            }
        ],
        "steps": [],
        "outputs": {
            "storageAccountNamePrefix": "[basics('storageAccounts')]"
        }
    }
  }
  ```

After all the needed files are ready, package them as a .zip file. The three files must be at the root level of the .zip file. If you put them in a folder, you receive an error when creating the managed application definition that states the required files are not present. Upload the package to an accessible location from where it can be consumed. The remainder of this article assumes the .zip file exists in a publicly accessible storage blob container.

## Create an Azure Active Directory user group or application

The second step is to select a user group or application for managing the resources on behalf of the customer. This user group or application has permissions on the managed resource group according to the role that is assigned. The role can be any built-in Role-Based Access Control (RBAC) role like Owner or Contributor. You also can give an individual user permission to manage the resources, but typically you assign this permission to a user group. To create a new Active Directory user group, see [Create a group and add members in Azure Active Directory](../active-directory/active-directory-groups-create-azure-portal.md).

You need the object ID of the user group to use for managing the resources. The following example shows how to get the object ID from the group's display name:

```azurecli-interactive
az ad group show --group exampleGroupName
```

The example command returns the following output:

```azurecli
{
    "displayName": "exampleGroupName",
    "mail": null,
    "objectId": "9aabd3ad-3716-4242-9d8e-a85df479d5d9",
    "objectType": "Group",
    "securityEnabled": true
}
```

To retrieve just the object ID, use:

```azurecli-interactive
groupid=$(az ad group show --group exampleGroupName --query objectId --output tsv)
```

## Get the role definition ID

Next, you need the role definition ID of the RBAC built-in role you want to grant access to the user, user group, or application. Typically, you use the Owner or Contributor or Reader role. The following command shows how to get the role definition ID for the Owner role:


```azurecli-interactive
az role definition list --name owner
```

That command returns the following output:

```azurecli
{
    "id": "/subscriptions/<subscription-id>/providers/Microsoft.Authorization/roleDefinitions/8e3af657-a8ff-443c-a75c-2fe8c4bcb635",
    "name": "8e3af657-a8ff-443c-a75c-2fe8c4bcb635",
    "properties": {
      "assignableScopes": [
        "/"
      ],
      "description": "Lets you manage everything, including access to resources.",
      "permissions": [
        {
          "actions": [
            "*"
         ],
         "notActions": []
        }
      ],
      "roleName": "Owner",
      "type": "BuiltInRole"
    },
    "type": "Microsoft.Authorization/roleDefinitions"
}
```

You need the value of the "name" property from the preceding example. You can retrieve just that property with:

```azurecli-interactive
roleid=$(az role definition list --name Owner --query [].name --output tsv)
```

## Create the managed application definition

If you do not already have a resource group for storing your managed application definition, create one now:

```azurecli-interactive
az group create --name managedApplicationGroup --location westcentralus
```

Now, create the managed application definition resource.

```azurecli-interactive
az managedapp definition create \
  --name storageApp \
  --location "westcentralus" \
  --resource-group managedApplicationGroup \
  --lock-level ReadOnly \
  --display-name myteststorageapp \
  --description storageapp \
  --authorizations "$groupid:$roleid" \
  --package-file-uri <uri-path-to-zip-file>
```

The parameters used in the preceding example are:

* **resource-group**: The name of the resource group where the managed application definition is created.
* **lock-level**: The type of lock placed on the managed resource group. It prevents the customer from performing undesirable operations on this resource group. Currently, ReadOnly is the only supported lock level. When ReadOnly is specified, the customer can only read the resources present in the managed resource group.
* **authorizations**: Describes the principal ID and the role definition ID that are used to grant permission to the managed resource group. It's specified in the format of `<principalId>:<roleDefinitionId>`. Multiple values also can be specified for this property. If multiple values are needed, they should be specified in the form `<principalId1>:<roleDefinitionId1> <principalId2>:<roleDefinitionId2>`. Multiple values are separated by a space.
* **package-file-uri**: The location of the managed application package that contains the template files, which can be an Azure Storage blob.

## Next steps

* For an introduction to managed applications, see [Managed application overview](managed-application-overview.md).
* For examples of the files, see [Managed application samples](https://github.com/Azure/azure-managedapp-samples/tree/master/samples).
* For information about consuming a Service Catalog managed application, see [Consume a Service Catalog managed application](managed-application-consumption.md).
* For information about publishing managed applications to the Azure Marketplace, see [Azure managed applications in the Marketplace](managed-application-author-marketplace.md).
* For information about consuming a managed application from the Marketplace, see [Consume Azure managed applications in the Marketplace](managed-application-consume-marketplace.md).
* To learn how to create a UI definition file for a managed application, see [Get started with CreateUiDefinition](managed-application-createuidefinition-overview.md).
