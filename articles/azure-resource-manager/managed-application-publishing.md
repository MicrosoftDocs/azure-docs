---
title: Create and publish an Azure managed application | Microsoft Docs
description: Shows how an ISV or partner creates an Azure managed application
services: azure-resource-manager
author: ravbhatnagar
manager: rjmax


ms.service: azure-resource-manager
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.date: 07/09/2017
ms.author: gauravbh; tomfitz

---
# Create and publish a Service Catalog managed application

There are two scenarios in the Azure managed application end-to-end experience. One is the publisher or ISV who wants to create a managed application for use by customers. The second is the customer or consumer who wants to use the managed application. This article focuses on the first scenario and explains how an ISV can create and publish a managed application. For more information, see [Managed application overview](managed-application-overview.md).

To create a managed application, you must create:

* A package that contains the template files.
* The user, group, or application that has access to the resource group in the customer's subscription.
* The appliance definition.

For examples of the files, see [Managed application samples](https://github.com/Azure/azure-managedapp-samples/tree/master/samples).

## Create a managed application package

The first step is to create the managed application package that contains the main template files. The publisher or ISV creates three files. Package all three files into a .zip file, and upload it to an accessible location.

* **applianceMainTemplate.json**: This first template file defines the actual resources that are provisioned as part of the managed application. For example, to create a storage account by using a managed application, applianceMainTemplate.json contains: 

  ```json
  {
      "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
      "contentVersion": "1.0.0.0",
      "parameters": {
  	      "storageAccountName": {
		  	  "type": "String"
    	  }
      },
      "resources": [{
    	  "type": "Microsoft.Storage/storageAccounts",
    	  "name": "[parameters('storageAccountName')]",
    	  "apiVersion": "2016-01-01",
    	  "location": "westus",
    	  "sku": {
    		  "name": "Standard_LRS"
    	  },
    	  "kind": "Storage",
    	  "properties": {		
    	  }
      }],
      "outputs": {		
      }
  }
  ```

* **mainTemplate.json**: This second template file contains only the appliance resource, Microsoft.Solutions/appliances. It also contains all the parameters you need for the resources in applianceMainTemplate.json. 

  You need two important properties as input to create the managed application:

  * **managedResourceGroupId**: This property is the ID of the resource group where the resources defined in applianceMainTemplate.json are created. The format of the ID is
  `/subscriptions/{subscriptionId}/resourceGroups/{resoureGroupName}`.
  * **applianceDefinitionId**: This property is the ID of the managed application definition resource. The ID is in the format
  `/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Solutions/applianceDefinitions/{applianceDefinitionName}`.

  Provide parameters for these two values so that the consumer can specify them when the managed application is created. The two parameters that correspond to these properties are managedByResourceGroup and applianceDefinitionId, as shown in the following example:

  ```json
  {
	  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
	  "contentVersion": "1.0.0.0",
	  "parameters": {
		  "storageAccountName": {
			  "type": "String"
		  },
		  "applianceDefinitionId": {
			  "type": "String"
		  },
		  "managedByResourceGroup": {
			  "type": "String"
		  },
		  "applianceName": {
			  "type": "String"
		  },
	  },
	  "variables": {			
	  },
	  "resources": [{
		  "type": "Microsoft.Solutions/appliances",
		  "name": "[parameters('applianceName')]",
		  "apiVersion": "2016-09-01-preview",
		  "location": "[resourceGroup().location]",
		  "kind": "ServiceCatalog",
		  "properties": {
			  "ManagedResourceGroupId": "[parameters('managedByResourceGroup')]",
			  "applianceDefinitionId": "[parameters('applianceDefinitionId')]",
			  "Parameters": {
				  "storageAccountName": {
					  "value": "[parameters('storageAccountName')]"
				  }				
			  }
		  }
	  }]
  }
  ```

* **createUiDefinition.json**: This template file is the third file you need in the package. The Azure portal uses this file to generate the user interface for consumers who create the managed application. You define the parameters for the managed application and how consumers can get the input for each parameter. You can use options like a drop-down list, text box, password box, and other input tools. To learn how to create a UI definition file for a managed application, see [Get started with CreateUiDefinition](managed-application-createuidefinition-overview.md).

After all the needed files are ready, upload the package to an accessible location from where it can be consumed.


## Create an Azure Active Directory user group or application
The second step is to create a user group or application that you want to use to manage the resources on behalf of the customer. This user group or application has permissions on the managed resource group as described by the role. The role can be any built-in Role-Based Access Control (RBAC) role like Owner or Contributor. You also can give an individual user permission to manage the resources, but typically you assign this permission to a user group. To create a new Active Directory user group, use:

```azurecli
az ad group create --display-name "name" --mail-nickname "nickname"
```

You also can use an existing group. You need the object ID of the newly created or an existing user group. The following example shows how to get the object ID from the display name that was used to create the group:

```azurecli
az ad group show --group "groupName"
```

Example:

```azurecli
az ad group show --group ravAppliancetestADgroup
```

The example command returns the following output:

```json 
{
    "displayName": "ravAppliancetestADgroup",
    "mail": null,
    "objectId": "9aabd3ad-3716-4242-9d8e-a85df479d5d9",
    "objectType": "Group",
    "securityEnabled": true
}
```
    
You need the objectId value from the preceding example. 

## Get the role definition ID

Next, you need the role definition ID of the RBAC built-in role you want to grant access to the user, user group, or application. Typically, you use the Owner or Contributor or Reader role. The following command shows how to get the role definition ID for the Owner role:

```azurecli
az role definition list --name Owner
```

That command returns the following output:

```json
{
    "id": "/subscriptions/{subscription-id}/providers/Microsoft.Authorization/roleDefinitions/8e3af657-a8ff-443c-a75c-2fe8c4bcb635",
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

You need the value of the "name" property from the preceding example.


## Create the managed application definition

The third step is to create the managed application definition resource. After you create the appliance package and the authorizations, create the appliance definition by using the following command: 

```azurecli
az managedapp definition create -n ravtestAppDef4 -l "westcentralus" 
	--resource-group ravApplianceDefRG3 --lock-level ReadOnly 
	--display-name ravtestappdef --description ravtestdescription  
	--authorizations "9aabd3ad-3716-4242-9d8e-a85df479d5d9:8e3af657-a8ff-443c-a75c-2fe8c4bcb635" 
	--package-file-uri "{path to package}" --debug 
```

The parameters used in the preceding example are:

- **resource-group**: The name of the resource group where the appliance definition is created.
- **lock-level**: The type of lock placed on the managed resource group. It prevents the customer from performing undesirable operations on this resource group. Currently, ReadOnly is the only supported lock level. When ReadOnly is specified, the customer can only read the resources present in the managed resource group.
- **authorizations**: Describes the principal ID and the role definition ID that are used to grant permission to the managed resource group. It's specified in the format of `<principalId>:<roleDefinitionId>`. Multiple values also can be specified for this property. If multiple values are needed, they should be specified in the form `<principalId1>:<roleDefinitionId1> <principalId2>:<roleDefinitionId2>`. Multiple values are separated by a space.
- **package-file-uri**: The location of the appliance package that contains the template files, which can be an Azure Storage blob. 


## Next steps

* For an introduction to managed applications, see [Managed application overview](managed-application-overview.md).
* For examples of the files, see [Managed application samples](https://github.com/Azure/azure-managedapp-samples/tree/master/samples).
* For information about consuming a Service Catalog managed application, see [Consume a Service Catalog managed application](managed-application-consumption.md).
* For information about publishing managed applications to the Azure Marketplace, see [Azure managed applications in the Marketplace](managed-application-author-marketplace.md).
* For information about consuming a managed application from the Marketplace, see [Consume Azure managed applications in the Marketplace](managed-application-consume-marketplace.md).
* To learn how to create a UI definition file for a managed application, see [Get started with CreateUiDefinition](managed-application-createuidefinition-overview.md).
