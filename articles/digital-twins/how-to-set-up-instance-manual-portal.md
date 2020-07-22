---
# Mandatory fields.
title: Set up an instance and authentication (manual, portal)
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

# Set up an Azure Digital Twins instance and authentication (manual, portal)

[!INCLUDE [digital-twins-setup-selector.md](../../includes/digital-twins-setup-selector.md)]

This article covers the steps to **set up a new Azure Digital Twins instance**, including creating the instance and setting up authentication. After completing this article, you will have an Azure Digital Twins instance ready to start programming against.

This version of this article goes through these steps manually, one by one, using the Azure portal. The Azure portal is a web-based, unified console that provides an alternative to command-line tools.
* To go through these steps manually using the CLI, see the CLI version of this article: [*How-to: Set up an instance and authentication (manual, CLI)*](how-to-set-up-instance-manual.md).
* To run through an automated setup using a deployment script sample, see the scripted version of this article: [*How-to: Set up an instance and authentication (scripted)*](how-to-set-up-instance-scripted.md).

[!INCLUDE [digital-twins-setup-steps.md](../../includes/digital-twins-setup-steps.md)]
 
Log in to the [Azure portal](https://ms.portal.azure.com/) with your credentials.

## Prerequisites: Permission requirements

To be able to complete all the steps in this article, you need to be classified as an Owner in your Azure subscription. 

You can check your permission level in the [subscriptions page](https://portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade) in the Azure portal. Look for the subscription name you are using, and view your role under the *My role* column:

:::image type="content" source="media/how-to-set-up-instance/check-role-owner-in-subscriptions.png" alt-text="View of the Subscriptions page in the Azure portal, showing user as an owner":::

If you are an owner, the *My role* value is *Owner*.

If you find that the value is *Contributor* or something other than *Owner*, you can contact your subscription Owner and proceed in one of the following ways:
* Request for the Owner to complete the steps in this article on your behalf
* Request for the Owner to elevate you to Owner on the subscription as well, so that you will have the permissions to proceed yourself. Whether this is appropriate depends on your organization and your role within it.

## Create the Azure Digital Twins instance

In this section of how-to, you will create a new Azure resource group for use. Then, you can **create a new instance of Azure Digital Twins** inside that resource group. 

You'll also need to provide a name for your instance and choose a region for the deployment. To see what regions support Azure Digital Twins, visit [Azure products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=digital-twins).

>[!NOTE]
> The name of the new instance must be unique within the region (meaning that if another Azure Digital Twins instance in that region is already using the name you choose, you'll have to pick a different name).

After you are logged into [Azure portal](https://ms.portal.azure.com/), you can create your instance by selecting _Create a resource_ in the Azure services menu. Then, choose the service by typing 'Azure Digital Twins' in the search box and choose **Azure Digital Twins (Preview)** from the results, then select the _Create_ button to create a new instance of the service.

:::image type="content" source= "media/how-to-set-up-instance/azure-portal-home-page.png" alt-text="Selecting 'Create a resource' from the home page of the Azure portal":::

:::image type="content" source= "media/how-to-set-up-instance/create-new-resource-ADT.png" alt-text="Selecting 'Create' from the Azure Digital Twins service page":::

On the following *Create Resource* page, fill in the values given below:
* _Subscription_: select your existing Azure subscription from the dropdown menu
  - _Resource group_: Create a new resource group by selecting the _Create new_ link and entering your desired name for the resource group
* _Location_: Choose a location for your resource from the dropdown menu
* _Resource name_: Enter the desired name for your Azure Digital Twins instance
> [!IMPORTANT]
> Make a note of the resource group and resource name. These are important values that you will need as you continue working with your Azure Digital Twins instance.

:::image type="content" source= "media/how-to-set-up-instance/review+create-resource.png" alt-text="Selecting 'Create a resource' from the home page of the Azure portal":::

Create your instance by selecting _Review + create_ button. Then in the summary page, review your instance details and select _create_ button. You can now view the status of your instance deployment in your Azure notifications along the portal icon bar. Once deployment succeeds, you can view your resource details by selecting the _Go to resource_ button as shown below:

:::image type="content" source="media/how-to-set-up-instance/notifications-for-resource-deployment.png" alt-text="View of Azure notifications showing a successful deployment and highlighting the 'Go to resource' button":::

If deployment fails, you can resolve any listed errors and attempt to retry.

## Assign Azure Active Directory Permissions

Azure Digital Twins uses [Azure Active Directory (AAD)](../active-directory/fundamentals/active-directory-whatis.md) for role-based access control (RBAC). This means that before you can make data plane calls to your Azure Digital Twins instance, you must first assign yourself a role with these permissions.

In order to use Azure Digital Twins with a client application, you'll also need to make sure your client app can authenticate against Azure Digital Twins. This is done by setting up an Azure Active Directory (AAD) app registration, which you can read about in [*How-to: Authenticate a client application*](how-to-authenticate-client.md).

### Assign yourself a role

Create a role assignment for yourself in the Azure Digital Twins instance, using your email associated with the AAD tenant on your Azure subscription. 

To assign your user "owner" permissions in your Azure Digital Twins instance, go to your resource in the Azure portal. You can do this by searching with the resource name at the top of the Azure portal home page search bar, then select *Access control (IAM)* from the instance's menu, and choose the  _Add_ button under _Add a role assignment_.

On the following *Add role assignment* page, fill in the values:
* _Role_: Select Azure Digital Twins Owner (Preview) from the dropdown menu
* _Assign access to_: Select Azure AD user, group or service principal from the dropdown menu
* _Select_: Enter the name or email address associated with your Azure account

When you're finished entering your details, hit the *Save* button.

:::image type="content" source="media/how-to-set-up-instance/access-control-role-assignment.png" alt-text="Filling the listed fields into the 'Add role assignment' dialog":::

You now have an Azure Digital Twins instance ready to go, and permissions to manage it. You can verify your role assignments in the _Role assignments_ tab for your instance by searching with your email address or name.

>[!TIP]
>You can search for your resource or resource group details at any time in the top search bar on [Azure portal](https://ms.portal.azure.com/)

## Next steps

See how to set up and authenticate a client app to work with your instance:
* [*How-to: Authenticate a client application*](how-to-authenticate-client.md)



 

