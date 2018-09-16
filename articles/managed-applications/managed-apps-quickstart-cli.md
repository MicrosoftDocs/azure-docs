---
title: Create Azure managed application with Azure CLI | Microsoft Docs
description: Shows how to create an Azure managed application that is intended for members of your organization.
services: managed-applications
author: tfitzmac
manager: timlt

ms.service: managed-applications
ms.devlang: na
ms.topic: quickstart
ms.tgt_pltfrm: na
ms.date: 04/13/2018
ms.author: tomfitz
---
# Create and deploy an Azure managed application with Azure CLI

This article provides an introduction to working with managed applications. You add a managed application definition to an internal catalog for users in your organization. Then, you deploy that managed application to your subscription. To simplify the introduction, we have already built the files for your managed application. One file defines the infrastructure for your solution. A second file that defines the user interface for deploying the managed application through the portal. Those files are available through GitHub. You learn how to build those files in the [Create service catalog application](publish-service-catalog-app.md) tutorial.

When you are finished, you have three resource groups containing different parts of the managed application.

| Resource group | Contains | Description |
| -------------- | -------- | ----------- |
| appDefinitionGroup | The managed application definition. | The publisher creates this resource group and the managed application definition. Anyone with access to the managed application definition can deploy it. |
| applicationGroup | The managed application instance. | The consumer creates this resource group and the managed application instance. The consumer can update the managed application through this instance. |
| infrastructureGroup | The resources for the managed application. | This resource group is automatically created when the managed application is created. The publisher has access to this resource group to manage the application. The consumer has limited access to the resource group. |

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

## Create a resource group for definition

Your managed application definition exists in a resource group. The resource group is a logical collection into which Azure resources are deployed and managed.

To create a resource group, use the following command:

```azurecli-interactive
az group create --name appDefinitionGroup --location westcentralus
```

## Create the managed application definition

When defining the managed application, you select a user, group, or application that manages the resources on behalf of the consumer. This identity has permissions on the managed resource group according to the role that is assigned. Typically, you create an Azure Active Directory group to manage the resources. However, for this article, use your own identity.

To get the object ID of your identity, provide your user principal name in the following command:

```azurecli-interactive
userid=$(az ad user show --upn-or-object-id example@contoso.org --query objectId --output tsv)
```

Next, you need the role definition ID of the RBAC built-in role you want to grant access to the user. The following command shows how to get the role definition ID for the Owner role:

```azurecli-interactive
roleid=$(az role definition list --name Owner --query [].name --output tsv)
```

Now, create the managed application definition resource. The managed application contains only a storage account.

```azurecli-interactive
az managedapp definition create \
  --name "ManagedStorage" \
  --location "westcentralus" \
  --resource-group appDefinitionGroup \
  --lock-level ReadOnly \
  --display-name "Managed Storage Account" \
  --description "Managed Azure Storage Account" \
  --authorizations "$userid:$roleid" \
  --package-file-uri "https://raw.githubusercontent.com/Azure/azure-managedapp-samples/master/samples/201-managed-storage-account/managedstorage.zip"
```

When the command completes, you have a managed application definition in your resource group. 

Some of the parameters used in the preceding example are:

* **resource-group**: The name of the resource group where the managed application definition is created.
* **lock-level**: The type of lock placed on the managed resource group. It prevents the customer from performing undesirable operations on this resource group. Currently, ReadOnly is the only supported lock level. When ReadOnly is specified, the customer can only read the resources present in the managed resource group. The publisher identities that are granted access to the managed resource group are exempt from the lock.
* **authorizations**: Describes the principal ID and the role definition ID that are used to grant permission to the managed resource group. It's specified in the format of `<principalId>:<roleDefinitionId>`. Multiple values also can be specified for this property. If multiple values are needed, they should be specified in the form `<principalId1>:<roleDefinitionId1> <principalId2>:<roleDefinitionId2>`. Multiple values are separated by a space.
* **package-file-uri**: The location of a .zip package that contains the required files. At a minimum, the package contains the **mainTemplate.json** and **createUiDefinition.json** files. **mainTemplate.json** defines the Azure resources that are provisioned as part of the managed application. The template is no different than a regular Resource Manager template. **createUiDefinition.json** generates the user interface for users who create the managed application through the portal.

## Create resource group for managed application

Now, you are ready to deploy the managed application. 

To contain the deployed managed application, you need a resource group. Use **westcentralus** for the location.

```azurecli-interactive
az group create --name applicationGroup --location westcentralus
```

## Deploy the managed application

You deploy the application with the following commands:

```azurecli-interactive
appid=$(az managedapp definition show --name ManagedStorage --resource-group appDefinitionGroup --query id --output tsv)
subid=$(az account show --query id --output tsv)
managedGroupId=/subscriptions/$subid/resourceGroups/infrastructureGroup

az managedapp create \
  --name storageApp \
  --location "westcentralus" \
  --kind "Servicecatalog" \
  --resource-group applicationGroup \
  --managedapp-definition-id $appid \
  --managed-rg-id $managedGroupId \
  --parameters "{\"storageAccountNamePrefix\": {\"value\": \"storage\"}, \"storageAccountType\": {\"value\": \"Standard_LRS\"}}"
```

Some of the parameters used in the preceding example are:

* **managedapp-definition-id**: The ID of the definition you created earlier in this article.
* **managed-rg-id**: The ID of the resource group for the resources associated with the managed application. The command creates this resource group. It **must not exist prior to running the command**. This resource group is managed by the publisher. 
* **resource-group**: The resource group where the managed application resource is created.
* **parameters**: The parameters that are needed for the resources associated with the managed application.

After the deployment finishes successfully, you see the managed application is created in applicationGroup. The storageAccount resource is created in infrastructureGroup.

## Next steps

* For an introduction to managed applications, see [Managed application overview](overview.md).
* For examples of the files, see [Managed application samples](https://github.com/Azure/azure-managedapp-samples/tree/master/samples).
* To learn how to create a UI definition file for a managed application, see [Get started with CreateUiDefinition](create-uidefinition-overview.md).
