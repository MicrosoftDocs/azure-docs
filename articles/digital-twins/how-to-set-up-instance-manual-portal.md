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

In this section, you will **create a new instance of Azure Digital Twins** using the Azure portal.

After you are logged into [Azure portal](https://ms.portal.azure.com/), you can create your instance by selecting _Create a resource_ in the Azure services home page menu.

:::image type="content" source= "media/how-to-set-up-instance/azure-portal-home-page.png" alt-text="Selecting 'Create a resource' from the home page of the Azure portal":::

Search for *Azure Digital Twins* in the search box, and choose the **Azure Digital Twins (Preview)** service from the results. Select the _Create_ button to create a new instance of the service.

:::image type="content" source= "media/how-to-set-up-instance/create-new-resource-ADT.png" alt-text="Selecting 'Create' from the Azure Digital Twins service page":::

On the following *Create Resource* page, fill in the values given below:
* _Subscription_: The Azure subscription you'd like to use
  - _Resource group_: A resource group in which to deploy the instance. If you don't already have an existing resource group in mind, you can create one now by selecting the *Create new* link and entering a new name for a resource group
* _Location_: A region for the deployment. To see what regions support Azure Digital Twins, visit [Azure products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=digital-twins).
* _Resource name_: A name for your instance. The name of the new instance must be unique within the region (meaning that if another Azure Digital Twins instance in that region is already using the name you choose, you'll be asked to pick a different name).

:::image type="content" source= "media/how-to-set-up-instance/review+create-resource.png" alt-text="Selecting 'Create a resource' from the home page of the Azure portal":::

Create your instance by selecting _Review + create_ button. Then in the summary page, review your instance details and select _create_ button. 

### Verify success

After selecting *create*, you can view the status of your instance deployment in your Azure notifications along the portal icon bar. The notification will indicate when deployment has succeeded, and you'll be able to hit the _Go to resource_ button to view the details of your created instance.

:::image type="content" source="media/how-to-set-up-instance/notifications-for-resource-deployment.png" alt-text="View of Azure notifications showing a successful deployment and highlighting the 'Go to resource' button":::

Alternatively, if deployment fails, the notification will indicate why. Observe the advice from the error message and retry creating the instance.

>[!TIP]
>Once you are able to open the details of your instance in the portal, you can return to this page at any time by searching for the name of your instance in the search bar at the top of the Azure portal.

From the instance's *Overview* page, note its *hostName*, *name*, and *resourceGroup*. These are all important values that you may need as you continue working with your Azure Digital Twins instance, to set up authentication and related Azure resources.

You now have an Azure Digital Twins instance ready to go. Next, you'll give the appropriate Azure user permissions to manage it.

## Set up your user's access permissions

[!INCLUDE [digital-twins-setup-role-assignment.md](../../includes/digital-twins-setup-role-assignment.md)]

First, open the details page for your Azure Digital Twins instance in the Azure portal. From the instance menu, select *Access control (IAM)*. Hit the  _Add_ button under _Add a role assignment_.

:::image type="content" source="media/how-to-set-up-instance/access-control-role-assignment.png" alt-text="Filling the listed fields into the 'Add role assignment' dialog":::

On the following *Add role assignment* page, fill in the values (must be completed by an owner of the Azure subscription):
* _Role_: Select *Azure Digital Twins Owner (Preview)* from the dropdown menu
* _Assign access to_: Select *Azure AD user, group or service principal* from the dropdown menu
* _Select_: Enter the name or email address of the user to assign

When you're finished entering your details, hit the *Save* button.

### Verify success

You can view the role assignment you've set up under *Access control (IAM) > Role assignments*. The user should show up in the list with a role of *Azure Digital Twins Owner (Preview)*. 

:::image type="content" source="media/how-to-set-up-instance/verify-role-assignment.png" alt-text="View of the role assignments for an Azure Digital Twins instance in Azure portal":::

You now have an Azure Digital Twins instance ready to go, and have assigned permissions to manage it. Next, you'll set up permissions for a client app to access it.

## Set up access permissions for client applications

[!INCLUDE [digital-twins-setup-app-registration.md](../../includes/digital-twins-setup-app-registration.md)]

In your working directory, open a new file and enter the following JSON snippet to configure these details: 

```json
[{
    "resourceAppId": "0b07f429-9f4b-4714-9392-cc5e8e80c8b0",
    "resourceAccess": [
     {
       "id": "4589bd03-58cb-4e6c-b17f-b580e39652f8",
       "type": "Scope"
     }
    ]
}]
``` 

Save this file as *manifest.json*.

> [!NOTE] 
> There are some places where a "friendly," human-readable string `https://digitaltwins.azure.net` can be used for the Azure Digital Twins resource app ID instead of the GUID `0b07f429-9f4b-4714-9392-cc5e8e80c8b0`. For instance, many examples throughout this documentation set use authentication with the MSAL library, and the friendly string can be used for that. However, during this step of creating the app registration, the GUID form of the ID is required as it is shown above. 

In your Cloud Shell window, click the "Upload/Download files" icon and choose "Upload".

:::image type="content" source="media/how-to-set-up-instance/cloud-shell-upload.png" alt-text="Cloud Shell window showing selection of the Upload option":::
Navigate to the *manifest.json* you just created and hit "Open."

Next, run the following command to create an app registration (replacing placeholders as needed):

```azurecli
az ad app create --display-name <name-for-your-app> --native-app --required-resource-accesses manifest.json --reply-url http://localhost
```

Here is an excerpt of the output from this command, showing information about the registration you've created:

:::image type="content" source="media/how-to-set-up-instance/new-app-registration.png" alt-text="Cloud Shell output of new AAD app registration":::

### Verify success

[!INCLUDE [digital-twins-setup-verify-app-registration-1.md](../../includes/digital-twins-setup-verify-app-registration-1.md)]

First, verify that the settings from your uploaded *manifest.json* were properly set on the registration. To do this, select *Manifest* from the menu bar to view the app registration's manifest code. Scroll to the bottom of the code window and look for the fields from your *manifest.json* under `requiredResourceAccess`:

[!INCLUDE [digital-twins-setup-verify-app-registration-2.md](../../includes/digital-twins-setup-verify-app-registration-2.md)]

### Collect important values

Next, select *Overview* from the menu bar to see the details of the app registration:

:::image type="content" source="media/how-to-set-up-instance/app-important-values.png" alt-text="Portal view of the important values for the app registration":::

Take note of the *Application (client) ID* and *Directory (tenant) ID* shown on **your** page. These values will be needed later to [authenticate a client app against the Azure Digital Twins APIs](how-to-authenticate-client.md). If you are not the person who will be writing code for such applications, you'll need to share these values with the person who will be.

### Other possible steps for your organization

[!INCLUDE [digital-twins-setup-additional-requirements.md](../../includes/digital-twins-setup-additional-requirements.md)]

## Next steps

See how to connect your client application to your instance by writing the client app's authentication code:
* [*How-to: Write app authentication code*](how-to-authenticate-client.md)

 

