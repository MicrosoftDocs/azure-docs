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

# Set up an Azure Digital Twins instance using the Azure portal

This article will walk you through the steps to set up a new Azure Digital Twins instance. There are two parts to setting up an instance:
1. Creating the instance
2. Assigning yourself [Azure Active Directory (AAD)](../active-directory/fundamentals/active-directory-whatis.md) permissions to manage the instance

This version of the article uses the [Azure portal](https://portal.azure.com). The Azure portal is a web-based, unified console that provides an alternative to command-line tools.

## Prerequisites

To proceed, you will need an Azure subscription, which you can set up for free [here](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
Log in to the [Azure portal](https://ms.portal.azure.com/) with your credentials.

## Create the Azure Digital Twins instance

In this section, you will create a new Azure resource group for use in this how-to. Then, you can **create a new instance of Azure Digital Twins** inside that resource group. 

You'll also need to provide a name for your instance and choose a region for the deployment. To see what regions support Azure Digital Twins, visit [Azure products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=digital-twins).

>[!NOTE]
> The name of the new instance must be unique within the region (meaning that if another Azure Digital Twins instance in that region is already using the name you choose, you'll have to pick a different name).

 Log in to [Azure portal](https://ms.portal.azure.com/) with your credentials. 
Select _Create a resource_ in the Azure Services menu, then type 'Azure Digital Twins' in the search box to search for the service in the Azure Services market place and select _create_ button.

:::image type="content" source= "media/how-to-set-up-instance/azure-portal-home-page.png" alt-text="Selecting 'Create a resource' from the home page of the Azure portal":::

To create an instance, you'll need the following values:
* Subscription: select your existing _Azure-Subscription_ from the dropdown menu
* Resource Group: create a new _resource-group_ by selecting _create new_ link and choose your wished name for the resource group
* Location: choose a _location_ for your resources from the dropdown
* Resource Name: choose a wished name for your resource
On the home page of the portal, select _Create a resource_ in the Azure Services menu, then type *Azure Digital Twins* into the search box to search for the Azure Digital Twins service in the Azure Services marketplace.

:::image type="content" source= "media/how-to-set-up-instance/azure-portal-home-page.png" alt-text="Selecting 'Create a resource' from the home page of the Azure portal":::

Choose *Azure Digital Twins (Preview) from the results. Select the _Create_ button to create a new instance of the service.

:::image type="content" source= "media/how-to-set-up-instance/digital-twins-create.png" alt-text="Selecting 'Create' from the Azure Digital Twins service page":::

On the following *Create Resource* page, fill in the following values:
* Subscription: select your existing Azure subscription from the dropdown menu
  - Resource group: Create a new resource group by selecting the _Create new_ link and entering your desired name for the resource group
* Location: Choose a location for your resource from the dropdown menu
* Resource name: Enter the desired name for your Azure Digital Twins instance

> [!IMPORTANT]
> Make a note of the resource group and resource name. These are important values that you will need as you continue working with your Azure Digital Twins instance.

Review your instance details and create your instance by selecting _Review + create_ button. Status of deployment of your instance can be seen under notifications. If deployment succeeds, you can view your resource details by selecting _Go to resource_ button as shown below.
 
If deployment fails, contact your subscription administrator to resolve the issue.
:::image type="content" source="media/how-to-set-up-instance/create-new-resource.png" alt-text="Filling the listed fields into the 'Create Resource' dialog":::

Review your instance details and create your instance by selecting _Review + create_. 

After this, you can view the status of your instance deployment in your Azure notifications along the portal icon bar. Once deployment succeeds, you can view your resource details by selecting the _Go to resource_ button as shown below:

:::image type="content" source="media/how-to-set-up-instance/notifications-for-resource-deployment.png" alt-text="View of Azure notifications showing a successful deployment and highlighting the 'Go to resource' button":::

If deployment fails, you can resolve any listed errors and attempt to retry.

## Assign Azure Active Directory Permissions

Azure Digital Twins uses [Azure Active Directory (AAD)](../active-directory/fundamentals/active-directory-whatis.md) for role-based access control (RBAC). This means that before you can make data plane calls to your Azure Digital Twins instance, you must first assign yourself a role with these permissions.

In order to use Azure Digital Twins with a client application, you'll also need to make sure your client app can authenticate against Azure Digital Twins. This is done by setting up an Azure Active Directory (AAD) app registration, which you can read about in [*How-to: Authenticate a client application*](how-to-authenticate-client.md).

### Assign yourself a role

Create a role assignment for yourself in the Azure Digital Twins instance, using your email associated with the AAD tenant on your Azure subscription. 

To be able to do this, you need to be classified as an owner in your Azure subscription. You can check this by viewing your [Subscriptions page](https://portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade) in the Azure portal. Look for the subscription name you are using, and view your role under the *My role* column.

:::image type="content" source="media/how-to-set-up-instance/check-role-owner.png" alt-text="View of the Subscriptions page in the Azure portal, showing user as an owner":::

If you find that _My role_ is _Contributor_ or something other than _Owner_, please contact your subscription administrator with the power to grant permissions in your subscription. They can either elevate your role on the entire subscription so that you can run the following command, or an owner can run the following command on your behalf to set up your Azure Digital Twins permissions for you.

To assign your user "owner" permissions in your Azure Digital Twins instance, go to the instance in the Azure portal. You can do this by searching for the instance's name in the portal search bar.

Select *Access control (IAM)* from the instance's menu, and choose the  _Add_ button under _Add a role assignment_.

On the following *Add role assignment* page, fill in the following values:
* Role: Select *Azure Digital Twins Owner (Preview)* from the dropdown menu
* Assign access to: Select *Azure AD user, group or service principal*
* Select: Enter the name or email address associated with your Azure account

When you're finished entering your details, hit the *Save* button.

:::image type="content" source="media/how-to-set-up-instance/access-control-role-assignment.png" alt-text="Filling the listed fields into the 'Add role assignment' dialog":::

You now have an Azure Digital Twins instance ready to go, and permissions to manage it.

You can verify your role assignments in the _Role assignments_ tab for your instance by searching with your email address or name.

>[!TIP]
>You can search for your resource/resource_group anytime in the top search bar on [Azure portal](https://ms.portal.azure.com/)

## Next steps

See how to set up and authenticate a client app to work with your instance:
* [*How-to: Authenticate a client application*](how-to-authenticate-client.md)



 

