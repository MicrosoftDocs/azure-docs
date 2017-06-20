---
title: 'Azure Active Directory B2C: UI Customization With Custom Policies | Microsoft Docs'
description: A topic on user interface (UI) customization while using custom policies in Azure AD B2C
services: active-directory-b2c
documentationcenter: ''
author: saeeda
manager: krassk
editor: gsacavdm

ms.assetid: 658c597e-3787-465e-b377-26aebc94e46d
ms.service: active-directory-b2c
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: article
ms.devlang: na
ms.date: 04/04/2017
ms.author: saeeda
---
# Azure Active Directory B2C: UI Customization in a Custom Policy

[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

After completing this article, you will have a sign-up and sign-in custom policy with your brand and appearance.  Azure AD B2C allows for nearly full control of the HTML and CSS presented to the end user.  When using a custom policy, UI customization is configured in XML instead of using controls in the Azure portal.

## Prerequisites

Before proceeding, you must complete [Getting started with custom policies](active-directory-b2c-get-started-custom.md).  You should have a working custom policy for sign-up and sign-in with local accounts.

## The page UI customization feature

With the page UI customization feature, you can customize the look and feel of any custom policy.  Maintain brand and visual consistency between your application and Azure AD B2C.

Here's how it works: Azure AD B2C runs code in your consumer's browser and uses a modern approach called [Cross-Origin Resource Sharing (CORS)](http://www.w3.org/TR/cors/).  First, you specify a URL in the custom policy with customized HTML content.  Azure AD B2C merges UI elements with the HTML content loaded from your URL, and displays the page to your consumer.

## Creating your HTML5 content

Let's create HTML content with your product's brand name in the title.

1. Click **Copy** on this html snippet.  It is well-formed HTML5 with an empty element called `<div id="api"></div>` located somewhere in the `<body>`. This element marks where Azure AD B2C content is inserted.

   ```html
   <!DOCTYPE html>
   <html>
   <head>
       <title>My Product Brand Name</title>
   </head>
   <body>
       <div id="api"></div>
   </body>
   </html>
   ```

   >[!NOTE]
   >For security reasons, the use of JavaScript is currently blocked for customization.

1. Paste in a text editor and save the file as `customize-ui.html`

## Create a blob storage account

>[!NOTE]
> In this guide, we use Azure Blob Storage to host our content.  You could also host your content on a webserver, but it is required that you [enable Cross-Origin Resource Sharing (CORS) on your webserver](https://enable-cors.org/server.html).

Let's host this HTML on Azure blob storage.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. On the Hub menu, select **New** -> **Storage** -> **Storage account**.
1. Enter a unique **name** for your storage account.
1. **Deployment model** can be left as **Resource Manager**.
1. Change **Account Kind** to **Blob storage**.
1. **Performance** can be left as **Standard**.
1. **Replication** can be left as **RA-GRS**.
1. **Access tier** can be left as **Hot**.
1. **Storage service encryption** can be left as **Disabled**.
1. Select a **subscription** for your storage account.
1. Create a **resource group** or select an existing one.
1. Select the **geographic location** for your storage account.
1. Click **Create** to create the storage account.
1. Wait for the deployment to finish and the storage account blade opens automatically.

## Create a Container

Let's create a public container on Azure blob storage.

1. Switch to the left-hand tab called **Overview**.
1. Click **+ Container**.
1. For **Name** type `$root`
1. Set **Access type** to **Blob**.
1. Click '$root' to open the new container.
1. Click **Upload**.
1. Click the folder icon next to `Select a file`.
1. Browse to `customize-ui.html` that we created in [the earlier section](#the-page-ui-customization-feature).
1. Click **Upload**.
1. Select the blob that we uploaded called `customize-ui.html`.
1. Next to the **URL** click the copy button.
1. Open a browser and navigate to this URL.  If it is inaccessible, make sure the container access type is set to blob.

## Configure CORS

Next we configure Azure blob storage for Cross-Origin Resource Sharing (CORS).

>[!NOTE]
>Want to try out the UI customization feature by using our sample HTML and CSS content?  We've provided [a simple helper tool](active-directory-b2c-reference-ui-customization-helper-tool.md) that uploads and configures our sample content on your Azure blob storage account.  If you use the tool, skip ahead to [Modify your sign-up or sign-in custom policy](#modify-your-sign-up-or-sign-in-custom-policy)

1. In the storage blade under settings, open **CORS**.
1. Click **+ Add**.
1. Set `Allowed origins` to `*`.
1. In the drop-down called `Allowed verbs`, select both `GET` and `OPTIONS`.
1. Set `Allowed headers` to `*`.
1. Set `Exposed headers` to `*`.
1. Set `Maximum age (seconds)` to `200`.
1. Click **Add**.

## Testing CORS

Let's validate that we are ready.

1. Navigate to http://test-cors.org/ and paste the URL into the `Remote URL` field.
1. Click **Send Request**
1. If you receive an error, make sure your [CORS settings](#configure-cors) are correct.  You may also need to clear your browser cache or try an in-private browsing session `CTRL-SHIFT-P`.

## Modify your sign-up or sign-in custom policy

1. Under the top-level `<TrustFrameworkPolicy>` tag, you should find `<BuildingBlocks>` tag.  Inside the `<BuildingBlocks>` tag, add a `ContentDefinitions` tag by copying this example.  Replace `{your_storage_account}` with the name of your storage account.

  ```xml
  <BuildingBlocks>
    <ContentDefinitions>
      <ContentDefinition Id="api.idpselections">
        <LoadUri>https://{your_storage_account}.blob.core.windows.net/customize-ui.html</LoadUri>
      </ContentDefinition>
    </ContentDefinitions>
  </BuildingBlocks>
  ```

## Upload your updated custom policy

1. In the [Azure portal](https://portal.azure.com), [switch into the context of your Azure AD B2C tenant](active-directory-b2c-navigate-to-b2c-context.md) and open the Azure AD B2C blade.
1. Click **All Policies**.
1. Click **Upload Policy**
1. Upload `SignUpOrSignin.xml` with the `ContentDefinitions` tag that we added.

## Test the custom policy using "Run Now"

1. Open the **Azure AD B2C Blade** and navigate to **All polices**.
1. Select the custom policy that you uploaded, and click the **Run now** button.
1. You should be able to sign-up using an email address.

## Reference

You can find sample templates for UI customization here:

```
git clone https://github.com/azureadquickstarts/b2c-azureblobstorage-client
```

The `sample_templates/wingtip` folder contains the following html files:

| HTML5 template | Description |
|----------------|-------------|
| *phonefactor.html* | This page can be used as a template for a multi-factor authentication page. |
| *resetpassword.html* | This page can be used as a template for a forgot password page. |
| *selfasserted.html* | This page can be used as a template for a social account sign-up page, a local account sign-up page, or a local account sign-in page. |
| *unified.html* | This page can be used as a template for a unified sign-up or sign-in page. |
| *updateprofile.html* | This page can be used as a template for a profile update page. |

In the [Modify your sign-up or sign-in custom policy section](#modify-your-sign-up-or-sign-in-custom-policy), we configured the content definition for `api.idpselections`.  The full set of content definition IDs recognized by the Azure AD B2C identity experience framework and how each page is used is described in the following table:

| Content definition id | Description | 
|-----------------------|-------------|
| *api.error* | **Error page**. This page is displayed when an exception or an error is encountered. |
| *api.idpselections* | **Identity provider selection page**. This page contains a list of identity providers that the user can choose from during sign-in. These options are either enterprise identity providers, social identity providers such as Facebook and Google+, or local accounts. |
| *api.idpselections.signup* | **Identity provider selection for sign-up**. This page contains a list of identity providers that the user can choose from during sign-up. These options are either enterprise identity providers, social identity providers such as Facebook and Google+, or local accounts. |
| *api.localaccountpasswordreset* | **Forgot password page**. This page contains a form that the user has to fill to initiate their password reset.  |
| *api.localaccountsignin* | **Local account sign-in page**. This page contains a sign-in form for signing in with a local account that is based on an email address or a user name. The form can contain a text input box and password entry box. |
| *api.localaccountsignup* | **Local account sign-up page**. This page contains a sign-up form for signing up for a local account that is based on an email address or a user name. The form can contain different input controls such as text input box, password entry box, radio button, single-select drop-down boxes, and multi-select check boxes. |
| *api.phonefactor* | **Multi-factor authentication page**. On this page, users can verify their phone numbers (using text or voice) during sign-up or sign-in. |
| *api.selfasserted* | **Social account sign-up page**. This page contains a sign-up form that the user has to fill in when signing up using an existing account from a social identity provider such as Facebook or Google+. This page is similar to the above social account sign-up page except for the password entry fields. |
| *api.selfasserted.profileupdate* | **Profile update page**. This page contains a form that the user can use to update their profile. This page is similar to the social account sign-up page except for the password entry fields. |
| *api.signuporsignin* | **Unified sign-up or sign-in page**.  This page handles both sign-up & sign-in of users, who can use enterprise identity providers, social identity providers such as Facebook or Google+, or local accounts.  |

## Next steps

This [reference guide for UI customization for built-in policies](active-directory-b2c-reference-ui-customization.md) contains additional information about what UI elements can be customized.
