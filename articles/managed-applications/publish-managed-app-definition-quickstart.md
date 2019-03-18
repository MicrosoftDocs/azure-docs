---
title: Create Azure managed application definition | Microsoft Docs
description: Shows how to create an Azure managed application that is intended for members of your organization.
services: managed-applications
author: tfitzmac

ms.service: managed-applications
ms.devlang: na
ms.topic: quickstart
ms.tgt_pltfrm: na
ms.date: 10/04/2018
ms.author: tomfitz
---
# Publish an Azure managed application definition

This quickstart provides an introduction to working with managed applications. You add a managed application definition to an internal catalog for users in your organization. To simplify the introduction, we have already built the files for your managed application. Those files are available through GitHub. You learn how to build those files in the [Create service catalog application](publish-service-catalog-app.md) tutorial.

When you're finished, you have a resource group named **appDefinitionGroup** that has the managed application definition.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

## Create a resource group for definition

Your managed application definition exists in a resource group. The resource group is a logical collection into which Azure resources are deployed and managed.

To create a resource group, use the following command:

```azurecli-interactive
az group create --name appDefinitionGroup --location westcentralus
```

## Create the managed application definition

When defining the managed application, you select a user, group, or application that manages the resources for the consumer. This identity has permissions on the managed resource group according to the role that is assigned. Typically, you create an Azure Active Directory group to manage the resources. However, for this article, use your own identity.

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
* **authorizations**: Describes the principal ID and the role definition ID that are used to grant permission to the managed resource group. It's specified in the format of `<principalId>:<roleDefinitionId>`. If more than one value is needed, specify them in the form `<principalId1>:<roleDefinitionId1> <principalId2>:<roleDefinitionId2>`. The values are separated by a space.
* **package-file-uri**: The location of a .zip package that contains the required files. The package must have the **mainTemplate.json** and **createUiDefinition.json** files. **mainTemplate.json** defines the Azure resources that are created as part of the managed application. The template is no different than a regular Resource Manager template. **createUiDefinition.json** generates the user interface for users who create the managed application through the portal.

## Next steps

You've published the managed application definition. Now, learn how to deploy an instance of that definition.

> [!div class="nextstepaction"]
> [Quickstart: Deploy service catalog app](deploy-service-catalog-quickstart.md)