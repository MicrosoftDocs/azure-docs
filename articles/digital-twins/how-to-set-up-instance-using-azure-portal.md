---
# Mandatory fields.
title: Create an Azure Digital Twins instance using the Azure portal
titleSuffix: Azure Digital Twins
description: See how to set up an instance of the Azure Digital Twins service using the Azure portal
author: v-lakast
ms.author: v-lakast # Microsoft employees only
ms.date: 7/16/2020
ms.topic: how-to
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Set up an Azure Digital Twins instance using Azure portal

This article walks you through the steps to set up a new Azure Digital Twins instance using Azure portal. There are two parts to setting up an instance:
1. Creating the instance
2. Assigning yourself [Azure Active Directory (AAD)](../active-directory/fundamentals/active-directory-whatis.md) permissions to manage the instance

Azure subscription is required and you can set up for free [here](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)).

## Create the Azure Digital Twins instance
Instances/resources are part of resource groups that can build connected solutions that model the real world. Instances are deployed in [ADT (Azure Digital Twins) enabled locations](https://azure.microsoft.com/global-infrastructure/services/?products=digital-twins) to organize and manage the resources.

**Prerequisites**: 
* Azure account \
    If you are a new user, you can create your Azure account [here](https://azure.microsoft.com/account/)
* Azure subscription \
    If you need a subscription or have any questions on your existing subscription, please contact your subscription administrator.

 Log in to [Azure portal](https://ms.portal.azure.com/) with your credentials. 
Select _Create a resource_ in the Azure Services menu, then type 'Azure Digital Twins' in the search box to search for the service in the Azure Services market place and select _create_ button.

:::image type="content" source= "media/how-to-set-up-instance/azure-portal-home-page.png" alt-text="Selecting 'Create a resource' from the home page of the Azure portal":::

To create an instance, you'll need the following values:
* Subscription: select your existing _Azure-Subscription_ from the dropdown menu
* Resource Group: create a new _resource-group_ by selecting _create new_ link and choose your wished name for the resource group
* Location: choose a _location_ for your resources from the dropdown
* Resource Name: choose a wished name for your resource

:::image type="content" source="media/how-to-set-up-instance/create-new-resource.png" alt-text="Alt text here.":::

> [!IMPORTANT]
>Make a note of resource-name and resource-group to search and view its details later.

Review your instance details and create your instance by selecting _Review + create_ button. Status of deployment of your instance can be seen under notifications. If deployment succeeds, you can view your resource details by selecting _Go to resource_ button as shown below.
 
If deployment fails, contact your subscription administrator to resolve the issue.

:::image type="content" source="media/how-to-set-up-instance/notifications-for-resource-deployment.png" alt-text="Alt text here.":::

This article walks you through the process of creating a new resource group. You can create new resources to your existing resource group.

>[!NOTE]
> The name of the new instance must be unique within the region (meaning that if another Azure Digital Twins instance in that region is already using the name you choose, you'll have to pick a different name).


### Assign Azure Active Directory Permissions

Assign Azure Active Directory permissions
Azure Digital Twins uses Azure Active Directory (AAD) for role-based access control (RBAC). It means that you'll need to assign yourself a role to make calls to your ADT instance.

In order to use Azure Digital Twins with a client application, you'll also need to make sure your client app can authenticate against Azure Digital Twins. It is done by setting up an Azure Active Directory (AAD) app registration, which you can read about in [*How-to: Authenticate a client application*](how-to-authenticate-client.md)

###### Assign yourself a role

Create a role assignment for yourself in the Azure Digital Twins instance, using your email associated with the AAD tenant on your Azure subscription. To be able to do it, you need to be classified as an _owner_ in your Azure subscription.

You can check your role by going to the home page of Azure portal and then selecting subscriptions. 



You can check your role by searching with your email address. \
_Access control_ -> _check access_ -> search by your email address, or name -> check your role. 

:::image type="content" source="media/how-to-set-up-instance/check-role-owner-in-subscriptions.png" alt-text="Alt text here.":::

>[!NOTE]
> If you find that _role_ is _Contributor_ or something other than _Owner_, contact your subscription administrator with the power to grant permissions in your subscription. They can either elevate your role on the entire subscription so that you can run the following command, or an owner can run the following command on your behalf to set up your Azure Digital Twins permissions for you.

You can now add your role assignment by selecting _Add_ button under _Add a role assignment_. Following values can be used:
* _role_ is required to be 'Azure Digital Twins Owner (Preview)'
* _Assign access to_ 'Azure AD user, group, or service principal'
* _select_ your name or email address associated to your Azure account and save your details.

:::image type="content" source="media/how-to-set-up-instance/access-control-role-assignment.png" alt-text="Alt text here.":::

You can verify your role assignments under _Role assignments_ tab by searching with your email address or name.

>[!TIP]
>You can search for your resource/resource_group anytime in the top search bar on [Azure portal](https://ms.portal.azure.com/)

## Next steps

See how to set up and authenticate a client app to work with your instance:
* [*How-to: Authenticate a client application*](how-to-authenticate-client.md)



 

