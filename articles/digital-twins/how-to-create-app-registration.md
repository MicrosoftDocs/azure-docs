---
# Mandatory fields.
title: Create an app registration
titleSuffix: Azure Digital Twins
description: See how to create an Azure AD app registration, as an authentication option for client apps.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 10/13/2020
ms.topic: how-to
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Create an app registration to use with Azure Digital Twins

When working with an Azure Digital Twins instance, it is common to interact with that instance through client applications, such as a custom client app or a sample like [ADT Explorer](quickstart-adt-explorer.md). Those applications need to authenticate with Azure Digital Twins in order to interact with it, and some of the [authentication mechanisms](how-to-authenticate-client.md) that apps can use involve an [Azure Active Directory (Azure AD)](../active-directory/fundamentals/active-directory-whatis.md) **app registration**.

This is not required for all authentication scenarios. However, if you are using an authentication strategy or code sample that does require an app registration, including a **client ID** and **tenant ID**, this article shows you how to set one up.

## Using Azure Active Directory app registrations

[Azure Active Directory (Azure AD)](../active-directory/fundamentals/active-directory-whatis.md) is Microsoft's cloud-based identity and access management service,

Setting up an **app registration** in Azure AD is one way to grant a client app access to Azure Digital Twins.

This app registration is where you configure access permissions to the [Azure Digital Twins APIs](how-to-use-apis-sdks.md). Later, client apps will authenticate against the app registration using the registration's **client and tenant ID values**, and as a result it is granted the configured access permissions to the APIs.

>[!TIP]
> As a subscription Owner/administrator, you may prefer to set up a new app registration every time you need one, *or* to do this only once, establishing a single app registration that will be shared among all scenarios that require it.

## Create the registration

Start by navigating to [Azure Active Directory](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/Overview) in the Azure portal (you can use this link or find it with the portal search bar). Select *App registrations* from the service menu, and then *+ New registration*.

:::image type="content" source="media/how-to-create-app-registration/new-registration.png" alt-text="View of the Azure AD service page in the Azure portal, highlighting the 'App registrations' menu option and '+ New registration' button":::

In the *Register an application* page that follows, fill in the requested values:
* **Name**: An Azure AD application display name to associate with the registration
* **Supported account types**: Select *Accounts in this organizational directory only (Default Directory only - Single tenant)*
* **Redirect URI**: An *Azure AD application reply URL* for the Azure AD application. Add a *Public client/native (mobile & desktop)* URI for `http://localhost`.

When you are finished, hit the *Register* button.

:::image type="content" source="media/how-to-create-app-registration/register-an-application.png" alt-text="View of the 'Register an application' page with the described values filled in":::

When the registration is finished setting up, the portal will redirect you to its details page.

## Provide Azure Digital Twins API permission

Next, configure the app registration you've created with baseline permissions to the Azure Digital Twins APIs.

From the portal page for your app registration, select *API permissions* from the menu. On the following permissions page, hit the *+ Add a permission* button.

:::image type="content" source="media/how-to-create-app-registration/add-permission.png" alt-text="View of the app registration in the Azure portal, highlighting the 'API permissions' menu option and '+ Add a permission' button":::

In the *Request API permissions* page that follows, switch to the *APIs my organization uses* tab and search for *azure digital twins*. Select _**Azure Digital Twins**_ from the search results to proceed with assigning permissions for the Azure Digital Twins APIs.

:::image type="content" source="media/how-to-create-app-registration/request-api-permissions-1.png" alt-text="View of the 'Request API Permissions' page search result showing Azure Digital Twins, with an Application (client) ID of 0b07f429-9f4b-4714-9392-cc5e8e80c8b0.":::

>[!NOTE]
> If your subscription still has an existing Azure Digital Twins instance from the previous public preview of the service (before July 2020), you'll need to search for and select _**Azure Smart Spaces Service**_ instead. This is an older name for the same set of APIs (notice that the *Application (client) ID* is the same as in the screenshot above), and your experience won't be changed beyond this step.
> :::image type="content" source="media/how-to-create-app-registration/request-api-permissions-1-smart-spaces.png" alt-text="View of the 'Request API Permissions' page search result showing Azure Smart Spaces Service":::

Next, you'll select which permissions to grant for these APIs. Expand the **Read (1)** permission and check the box that says *Read.Write* to grant this app registration reader and writer permissions.

:::image type="content" source="media/how-to-create-app-registration/request-api-permissions-2.png" alt-text="View of the 'Request API Permissions' page selecting 'Read.Write' permissions for the Azure Digital Twins APIs":::

Hit *Add permissions* when finished.

## Verify success and collect important values

Back on the *API permissions* page, verify that there is now an entry for Azure Digital Twins reflecting Read/Write permissions:

:::image type="content" source="media/how-to-create-app-registration/verify-api-permissions.png" alt-text="Portal view of the API permissions for the Azure AD app registration, showing 'Read/Write Access' for Azure Digital Twins":::

You can also verify the connection to Azure Digital Twins within the app registration's *manifest.json*, which was automatically updated with the Azure Digital Twins information when you added the API permissions.

To do this, select *Manifest* from the menu to view the app registration's manifest code. Scroll to the bottom of the code window and look for these fields under `requiredResourceAccess`. The values should match those in the screenshot below:

:::image type="content" source="media/how-to-create-app-registration/verify-manifest.png" alt-text="Portal view of the manifest for the Azure AD app registration. Nested under 'requiredResourceAccess', there's a 'resourceAppId' value of 0b07f429-9f4b-4714-9392-cc5e8e80c8b0, and a 'resourceAccess > id' value of 4589bd03-58cb-4e6c-b17f-b580e39652f8":::

### Collect Client ID and tenant ID

Next, select *Overview* from the menu bar to see the details of the app registration:

:::image type="content" source="media/how-to-create-app-registration/app-important-values.png" alt-text="Portal view of the important values for the app registration":::

Take note of the _**Application (client) ID**_ and _**Directory (tenant) ID**_ shown on **your** page. These are the values a client app will need to use this registration to authenticate with Azure Digital Twins.

## Other possible steps for your organization

It's possible that your organization requires additional actions from subscription Owners/administrators to successfully set up an app registration. The steps required may vary depending on your organization's specific settings.

Here are some common potential activities that an Owner/administrator on the subscription may need to perform. These and other operations can be performed from the [*Azure AD App registrations*](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/RegisteredApps) page in the Azure portal.
* Grant admin consent for the app registration. Your organization may have *Admin Consent Required* globally turned on in Azure AD for all app registrations within your subscription. If so, the Owner/administrator will need to select this button for your company on the app registration's *API permissions* page for the app registration to be valid:

    :::image type="content" source="how-to-create-app-registration/portal/grant-admin-consent.png" alt-text="Portal view of the 'Grant admin consent' button under API permissions":::
  - If consent was granted successfully, the entry for Azure Digital Twins should then show a *Status* value of _Granted for **(your company)**_
   
    :::image type="content" source="how-to-create-app-registration/portal/granted-admin-consent-done.png" alt-text="Portal view of the admin consent granted for the company under API permissions":::
* Activate public client access
* Set specific reply URLs for web and desktop access
* Allow for implicit OAuth2 authentication flows

For more information about app registration and its different setup options, see [*Register an application with the Microsoft identity platform*](/graph/auth-register-app-v2).

## Next steps

In this article, you set up an Azure AD app registration that can be used to authenticate client applications with the Azure Digital Twins APIs.

Next, read about authentication mechanisms, including one that uses app registrations and others that do not:
* [*How-to: Write app authentication code*](how-to-authenticate-client.md)