---
title: Create and publish Azure Managed Application | Microsoft Docs
description: Shows how an ISV or partner creates an Azure Managed Application
services: azure-resource-manager
author: ravbhatnagar
manager: rjmax


ms.service: azure-resource-manager
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.date: 05/08/2017
ms.author: gauravbh; tomfitz

---
# Create and publish an Azure Managed Application 

As described in the [Managed Application overview](managed-application-overview.md) article, there are two scenarios in the end to end experience. One is the publisher or ISV who wants to create a managed application for use by customers. The second is the customer or the consumer of the managed application. This article focuses on the first scenario and explains how an ISV can create and publish a managed application. 

To create a managed application, you must create:

* a package that contains the template files
* the user, group, or application that has access to the resource group in the customer's subscription
* the appliance definition

For examples of the files, see [Managed Application samples](https://github.com/Azure/azure-managedapp-samples/tree/master/samples).

## Create managed application package

The first step is to create the managed application package that contains the main template files. The publisher or ISV creates three files. 

* The first file is called **applianceMainTemplate.json**. This template file defines the actual resources that are provisioned as part of the managed application. For example, to create a storage account using a managed application, the applianceMainTemplate.json contains: 

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

* The second file that the publisher needs to create is the **mainTemplate.json**. The template file contains only the appliance resource (Microsoft.Solutions/appliances). It also contains all the parameters that are needed for the resources in the applianceMainTemplate.json. 

  There are two important properties that are needed as input during the creation of the managed application. The **managedResourceGroupId** property is the ID of the resource group where the resources defined in the applianceMainTemplate.json are created. The format of the ID is:
  `/subscriptions/{subscriptionId}/resourceGroups/{resoureGroupName}`

  The **applianceDefinitionId** property is the ID of the managed application definition resource. The ID is in the format:
  `/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Solutions/applianceDefinitions/{applianceDefinitionName}`

  Provide parameters for these two values, so the consumer can specify them when creating a managed application. In the example below, the two parameters that correspond to these properties are managedByResourceGroup and applianceDefinitonId.

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

* The third file needed in the package is the **createUiDefinition.json**. The Azure portal uses this file to generate the user interface for consumers creating the managed application. You define the parameters for the managed application, and how consumers can get the input for each parameter. You can use options like a drop-down selector, text box, password box, and other input tools. To learn about creating a UI definition file for a managed application, see [Getting started with CreateUiDefinition](managed-application-createuidefinition-overview.md).

Once all the needed files are ready, you upload the package to an accessible location from where it can be consumed.


## Create Azure AD User group or Application
Next create a user group or application that you want to use to manage the resources on behalf of the customer. This user group or application has permissions on the managed resource group as described by the role. The role could be any built-in RBAC role like **Owner** or **Contributor**. An individual user can also be given permissions to manage the resources, but typically you assign this permission to use a user group. To create a new active directory user group, use:

```azurecli
az ad group create –display-name "name" –mail-nickname "nickname"
```

You can also use an existing group. You need the object Id of the newly created or an existing user group. The following example shows how to get the object ID from the display name that was used for creating the group.

```azurecli
az ad group show –group "groupName"
```

Example:

```azurecli
az ad group show --group ravAppliancetestADgroup
```

Which returns the following output:

```json 
{
    "displayName": "ravAppliancetestADgroup",
    "mail": null,
    "objectId": "9aabd3ad-3716-4242-9d8e-a85df479d5d9",
    "objectType": "Group",
    "securityEnabled": true
}
```
    
You need the objectId value from above. 

## Get the Role Definition ID

Next, you need the role definition ID of the RBAC built-in role you want to grant access to the user, user group, or application. Typically you would want to use the "Owner" or "Contributor" or "Reader" role. The following command shows how to get the role definition ID for the "Owner" role:

```azurecli
az role definition list --name owner
```

Which returns the following output:

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

You need the value of the "name" property from preceding example.


## Create the Managed Application definition

The final step is to create the managed application definition resource. Once you have created the appliance package and the authorizations, create the appliance definition using the following command: 

```azurecli
az managedapp definition create -n ravtestAppDef4 -l "westcentralus" 
	--resource-group ravApplianceDefRG3 --lock-level ReadOnly 
	--display-name ravtestappdef --description ravtestdescription  
	--authorizations "9aabd3ad-3716-4242-9d8e-a85df479d5d9:8e3af657-a8ff-443c-a75c-2fe8c4bcb635" 
	--package-file-uri "{path to package}" --debug 
```

The parameters used in the preceding example are:

- resource-group - The name of the resource group where the appliance definition is created.
- lock-level - The type of lock placed on the managed resource group. It prevents the customer from performing undesirable operations on this resource group. Currently, **ReadOnly** is the only supported lock level. When ReadOnly is specified, the customer can only read the resources present in the managed resource group.
- authorizations - Describes the principal ID and the role definition ID that are used for granting permission to the managed resource group. It is specified in the format of `<principalId>:<roleDefinitionId>`. Multiple values can also be specified for this property. If multiple values are needed, it should be specified in this form `<principalId1>:<roleDefinitionId1> <principalId2>:<roleDefinitionId2>`. Multiple values are separated by a space.
- package-file-uri - The location of the appliance package that contains the template files, which can be an Azure Storage blob. 


## Next steps

* For an introduction to managed applications, see [Azure Managed Application overview](managed-application-overview.md).
* For examples of the files, see [Managed Application samples](https://github.com/Azure/azure-managedapp-samples/tree/master/samples).
* To understand the consumer experience, see [Consume an Azure Managed Application](managed-application-consumption.md).
* To learn about creating a UI definition file for a managed application, see [Getting started with CreateUiDefinition](managed-application-createuidefinition-overview.md).