---
title: 'Azure Active Directory B2C: Customize a UI by using custom policies | Microsoft Docs'
description: Learn about customizing a user interface (UI) while you use custom policies in Azure AD B2C.
services: active-directory-b2c
documentationcenter: ''
author: SaeedAkhter-MSFT
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
# Azure Active Directory B2C: Configure UI customization in a custom policy

[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

After you complete this article, you will have a sign-up and sign-in custom policy with your brand and appearance. With Azure Active Directory B2C (Azure AD B2C), you get nearly full control of the HTML and CSS content that's presented to users. When you use a custom policy, you configure UI customization in XML instead of using controls in the Azure portal. 

## Prerequisites

Before you begin, complete [Getting started with custom policies](active-directory-b2c-get-started-custom.md). You should have a working custom policy for sign-up and sign-in with local accounts.

## Page UI customization

By using the page UI customization feature, you can customize the look and feel of any custom policy. You can also maintain brand and visual consistency between your application and Azure AD B2C.

Here's how it works: Azure AD B2C runs code in your customer's browser and uses a modern approach called [Cross-Origin Resource Sharing (CORS)](http://www.w3.org/TR/cors/). First, you specify a URL in the custom policy with customized HTML content. Azure AD B2C merges UI elements with the HTML content that's loaded from your URL and then displays the page to the customer.

## Create your HTML5 content

Create HTML content with your product's brand name in the title.

1. Copy the following HTML snippet. It is well-formed HTML5 with an empty element called *\<div id="api"\>\</div\>* located within the *\<body\>* tags. This element indicates where Azure AD B2C content is to be inserted.

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

2. Paste the copied snippet in a text editor, and then save the file as *customize-ui.html*.

## Create an Azure Blob storage account

>[!NOTE]
> In this article, we use Azure Blob storage to host our content. You can choose to host your content on a web server, but you must [enable CORS on your web server](https://enable-cors.org/server.html).

To host this HTML content in Blob storage, do the following:

1. Sign in to the [Azure portal](https://portal.azure.com).
2. On the **Hub** menu, select **New** > **Storage** > **Storage account**.
3. Enter a unique **Name** for your storage account.
4. **Deployment model** can remain **Resource Manager**.
5. Change **Account Kind** to **Blob storage**.
6. **Performance** can remain **Standard**.
7. **Replication** can remain **RA-GRS**.
8. **Access tier** can remain **Hot**.
9. **Storage service encryption** can remain **Disabled**.
10. Select a **Subscription** for your storage account.
11. Create a **Resource group** or select an existing one.
12. Select the **Geographic location** for your storage account.
13. Click **Create** to create the storage account.  
    After the deployment is completed, the **Storage account** blade opens automatically.

## Create a container

To create a public container in Blob storage, do the following:

1. Click the **Overview** tab.
2. Click **Container**.
3. For **Name**, type **$root**.
4. Set **Access type** to **Blob**.
5. Click **$root** to open the new container.
6. Click **Upload**.
7. Click the folder icon next to **Select a file**.
8. Go to **customize-ui.html**, which you created earlier in the [Page UI customization](#the-page-ui-customization-feature) section.
9. Click **Upload**.
10. Select the customize-ui.html blob that you uploaded.
11. Next to **URL**, click **Copy**.
12. In a browser, paste the copied URL, and go to the site. If the site is inaccessible, make sure the container access type is set to **blob**.

## Configure CORS

Configure Blob storage for Cross-Origin Resource Sharing by doing the following:

>[!NOTE]
>Want to try out the UI customization feature by using our sample HTML and CSS content? We've provided [a simple helper tool](active-directory-b2c-reference-ui-customization-helper-tool.md) that uploads and configures our sample content on your Blob storage account. If you use the tool, skip ahead to [Modify your sign-up or sign-in custom policy](#modify-your-sign-up-or-sign-in-custom-policy).

1. On the **Storage** blade, under **Settings**, open **CORS**.
2. Click **Add**.
3. For **Allowed origins**, type an asterisk (\*).
4. In the **Allowed verbs** drop-down list, select both **GET** and **OPTIONS**.
5. For **Allowed headers**, type an asterisk (\*).
6. For **Exposed headers**, type an asterisk (\*).
7. For **Maximum age (seconds)**, type **200**.
8. Click **Add**.

## Test CORS

Validate that you're ready by doing the following:

1. Go to the [test-cors.org](http://test-cors.org/) website, and then paste the URL in the **Remote URL** box.
2. Click **Send Request**.  
    If you receive an error, make sure that your [CORS settings](#configure-cors) are correct. You might also need to clear your browser cache or open an in-private browsing session by pressing Ctrl+Shift+P.

## Modify your sign-up or sign-in custom policy

Under the top-level *\<TrustFrameworkPolicy\>* tag, you should find *\<BuildingBlocks\>* tag. Within the *\<BuildingBlocks\>* tags, add a *\<ContentDefinitions\>* tag by copying the following example. Replace *your_storage_account* with the name of your storage account.

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

1. In the [Azure portal](https://portal.azure.com), [switch into the context of your Azure AD B2C tenant](active-directory-b2c-navigate-to-b2c-context.md), and then open the **Azure AD B2C** blade.
2. Click **All Policies**.
3. Click **Upload Policy**.
4. Upload `SignUpOrSignin.xml` with the *\<ContentDefinitions\>* tag that you added previously.

## Test the custom policy by using **Run now**

1. On the **Azure AD B2C** blade, go to **All polices**.
2. Select the custom policy that you uploaded, and click the **Run now** button.
3. You should be able to sign up by using an email address.

## Reference

You can find sample templates for UI customization here:

```
git clone https://github.com/azureadquickstarts/b2c-azureblobstorage-client
```

The sample_templates/wingtip folder contains the following HTML files:

| HTML5 template | Description |
|----------------|-------------|
| *phonefactor.html* | Use this file as a template for a multi-factor authentication page. |
| *resetpassword.html* | Use this file as a template for a forgot password page. |
| *selfasserted.html* | Use this file as a template for a social account sign-up page, a local account sign-up page, or a local account sign-in page. |
| *unified.html* | Use this file as a template for a unified sign-up or sign-in page. |
| *updateprofile.html* | Use this file as a template for a profile update page. |

In the [Modify your sign-up or sign-in custom policy section](#modify-your-sign-up-or-sign-in-custom-policy), you configured the content definition for `api.idpselections`. The full set of content definition IDs that are recognized by the Azure AD B2C identity experience framework and their descriptions are in the following table:

| Content definition ID | Description | 
|-----------------------|-------------|
| *api.error* | **Error page**. This page is displayed when an exception or an error is encountered. |
| *api.idpselections* | **Identity provider selection page**. This page contains a list of identity providers that the user can choose from during sign-in. These options are either enterprise identity providers, social identity providers such as Facebook and Google+, or local accounts. |
| *api.idpselections.signup* | **Identity provider selection for sign-up**. This page contains a list of identity providers that the user can choose from during sign-up. These options are either enterprise identity providers, social identity providers such as Facebook and Google+, or local accounts. |
| *api.localaccountpasswordreset* | **Forgot password page**. This page contains a form that the user must complete to initiate a password reset.  |
| *api.localaccountsignin* | **Local account sign-in page**. This page contains a sign-in form for signing in with a local account that is based on an email address or a user name. The form can contain a text input box and password entry box. |
| *api.localaccountsignup* | **Local account sign-up page**. This page contains a sign-up form for signing up for a local account that is based on an email address or a user name. The form can contain various input controls, such as a text input box, a password entry box, a radio button, single-select drop-down boxes, and multi-select check boxes. |
| *api.phonefactor* | **Multi-factor authentication page**. On this page, users can verify their phone numbers (by using text or voice) during sign-up or sign-in. |
| *api.selfasserted* | **Social account sign-up page**. This page contains a sign-up form that users must complete when they sign up by using an existing account from a social identity provider such as Facebook or Google+. This page is similar to the preceding social account sign-up page, except for the password entry fields. |
| *api.selfasserted.profileupdate* | **Profile update page**. This page contains a form that users can use to update their profile. This page is similar to the social account sign-up page, except for the password entry fields. |
| *api.signuporsignin* | **Unified sign-up or sign-in page**. This page handles both the sign-up and sign-in of users, who can use enterprise identity providers, social identity providers such as Facebook or Google+, or local accounts.  |

## Next steps

For additional information about UI elements that can be customized, see [reference guide for UI customization for built-in policies](active-directory-b2c-reference-ui-customization.md).
