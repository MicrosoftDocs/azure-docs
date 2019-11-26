---
title: Customize the user interface in Azure Active Directory B2C
description: Learn how to customize the user interface for your applications that use Azure Active Directory B2C.
services: active-directory-b2c
author: mmacy
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 09/25/2019
ms.author: marsma
ms.subservice: B2C
---

# Customize the user interface in Azure Active Directory B2C

Branding and customizing the user interface that Azure Active Directory B2C (Azure AD B2C) displays to your customers helps provide a seamless user experience in your application. These experiences include signing up, signing in, profile editing, and password resetting. This article introduces the methods of user interface (UI) customization for both user flows and custom policies.

## UI customization in different scenarios

There are several ways to customize the UI of the user experiences your application, each appropriate for different scenarios.

### User flows

If you use [user flows](active-directory-b2c-reference-policies.md), you can change the look of your user flow pages by using built-in *page layout templates*, or by using your own HTML and CSS. Both methods are discussed later in this article.

You use the [Azure portal](tutorial-customize-ui.md) to configure the UI customization for user flows.

### Custom policies

If you're using [custom policies](active-directory-b2c-overview-custom.md) to provide sign-up or sign-in, password reset, or profile-editing in your application, use [policy files to customize the UI](active-directory-b2c-ui-customization-custom.md).

If you need to provide dynamic content based on a customer's decision, use custom policies that can [change page content dynamically](active-directory-b2c-ui-customization-custom-dynamic.md) depending on a parameter that's sent in a query string. For example, you can change the background image on the Azure AD B2C sign-up or sign-in page based on a parameter that you pass from your web or mobile application.

### JavaScript

You can enable client-side JavaScript code in both [user flows](user-flow-javascript-overview.md) and [custom policies](page-layout.md).

### Sign in-only UI customization

If you're providing sign-in only, along with its accompanying password reset page and verification emails, use the same customization steps that are used for an [Azure AD sign-in page](../active-directory/fundamentals/customize-branding.md).

If customers try to edit their profile before signing in, they're redirected to a page that you customize by using the same steps that are used for customizing the Azure AD sign-in page.

## Page layout templates

User flows provide several built-in templates you can choose from to give your user experience pages a professional look. These layout templates can also and serve as starting point for your own customization.

Under **Customize** in the left menu, select **Page layouts** and then select **Template**.

![Template selection drop-down in user flow page of Azure portal](media/customize-ui-overview/template-selection.png)

Next, select a template from the list. Here are examples of the sign-in pages for each template:

| Ocean Blue | Slate Gray | Classic |
|:-:|:-:|:-:|
|![Example of the Ocean Blue template rendered on sign up sign in page](media/customize-ui-overview/template-ocean-blue.png)|![Example of the Slate Gray template rendered on sign up sign in page](media/customize-ui-overview/template-slate-gray.png)|![Example of the Classic template rendered on sign up sign in page](media/customize-ui-overview/template-classic.png)|

When you choose a template, the selected layout is applied to all pages in your user flow, and the URI for each page is visible in the **Custom page URI** field.

## Custom HTML and CSS

Azure AD B2C runs code in your customer's browser by using an approach called [Cross-Origin Resource Sharing (CORS)](https://www.w3.org/TR/cors/).

At runtime, content is loaded from a URL that you specify in your user flow or custom policy. Each page in the user experience loads its content from the URL you specify for that page. After content is loaded from your URL, it's merged with an HTML fragment inserted by Azure AD B2C, and then the page is displayed to your customer.

Review the following guidance before using your own HTML and CSS files to customize the UI:

- Azure AD B2C **merges** HTML content into your pages. Don't copy and try to change the default content that Azure AD B2C provides. It's best to build your HTML content from scratch and use the default content as reference.
- **JavaScript** can be included in your custom content for both [user flows](user-flow-javascript-overview.md) and [custom policies](javascript-samples.md).
- Supported **browser versions** are:
  - Internet Explorer 11, 10, and Microsoft Edge
  - Limited support for Internet Explorer 9 and 8
  - Google Chrome 42.0 and above
  - Mozilla Firefox 38.0 and above
- Don't include **form tags** in your HTML. Form tags interfere with the POST operations generated by the HTML injected by Azure AD B2C.

### Where do I store UI content?

When using your own HTML and CSS files to customize the UI, you can host your UI content on any publicly available HTTPS endpoint that supports CORS. For example, [Azure Blob storage](../storage/blobs/storage-blobs-introduction.md), web servers, CDNs, AWS S3, or file sharing systems.

The important point is that you host the content on a publicly available HTTPS endpoint with CORS enabled. You must use an absolute URL when you specify it in your content.

## Get started with custom HTML and CSS

Get started using your own HTML and CSS in your user experience pages by following these guidelines.

- Create well-formed HTML content with an empty `<div id="api"></div>` element located somewhere in the `<body>`. This element marks where the Azure AD B2C content is inserted. The following example shows a minimal page:

    ```html
    <!DOCTYPE html>
    <html>
      <head>
        <title>!Add your title here!</title>
        <link rel="stylesheet" href="https://mystore1.blob.core.windows.net/b2c/style.css">
      </head>
      <body>
        <h1>My B2C Application</h1>
        <div id="api"></div>   <!-- Leave this element empty because Azure AD B2C will insert content here. -->
      </body>
    </html>
    ```

- Use CSS to style the UI elements that Azure AD B2C inserts into your page. The following example shows a simple CSS file that also includes settings for the sign-up injected HTML elements:

    ```css
    h1 {
      color: blue;
      text-align: center;
    }
    .intro h2 {
      text-align: center;
    }
    .entry {
      width: 400px ;
      margin-left: auto ;
      margin-right: auto ;
    }
    .divider h2 {
      text-align: center;
    }
    .create {
      width: 400px ;
      margin-left: auto ;
      margin-right: auto ;
    }
    ```

- Host your content on an HTTPS endpoint (with CORS allowed). Both GET and OPTIONS request methods must be enabled when configuring CORS.
- Create or edit a user flow or custom policy to use the content that you created.

### HTML fragments from Azure AD B2C

The following table lists the HTML fragments that Azure AD B2C merges into the `<div id="api"></div>` element located in your content.

| Inserted page | Description of HTML |
| ------------- | ------------------- |
| Identity provider selection | Contains a list of buttons for identity providers that the customer can choose from during sign-up or sign-in. These buttons include social identity providers such as Facebook, Google, or local accounts (based on email address or user name). |
| Local account sign-up | Contains a form for local account sign-up based on an email address or a user name. The form can contain different input controls such as text input box, password entry box, radio button, single-select drop-down boxes, and multi-select check boxes. |
| Social account sign-up | May appear when signing up using an existing account from a social identity provider such as Facebook or Google. It's used when additional information must be collected from the customer using a sign-up form. |
| Unified sign-up or sign-in | Handles both sign-up and sign-in of customers who can use social identity providers such as Facebook, Google, or local accounts. |
| Multi-factor authentication | Customers can verify their phone numbers (using text or voice) during sign-up or sign-in. |
| Error | Provides error information to the customer. |

## Localize content

You localize your HTML content by enabling [language customization](active-directory-b2c-reference-language-customization.md) in your Azure AD B2C tenant. Enabling this feature allows Azure AD B2C to forward the OpenID Connect parameter `ui-locales` to your endpoint. Your content server can use this parameter to provide language-specific HTML pages.

Content can be pulled from different places based on the locale that's used. In your CORS-enabled endpoint, you set up a folder structure to host content for specific languages. You'll call the right one if you use the wildcard value `{Culture:RFC5646}`.

For example, your custom page URI might look like:

```HTTP
https://contoso.blob.core.windows.net/{Culture:RFC5646}/myHTML/unified.html
```

You can load the page in French by pulling content from:

```HTTP
https://contoso.blob.core.windows.net/fr/myHTML/unified.html
```

## Examples

You can find several sample template files in the [B2C-AzureBlobStorage-Client](https://github.com/azureadquickstarts/b2c-azureblobstorage-client) repository on GitHub.

The sample HTML and CSS files in the templates are located in the [/sample_templates](https://github.com/AzureADQuickStarts/B2C-AzureBlobStorage-Client/tree/master/sample_templates) directory.

## Next steps

- If you're using **user flows**, you can start customizing your UI with the tutorial:

    [Customize the user interface of your applications in Azure Active Directory B2C](tutorial-customize-ui.md).
- If you're using **custom policies**, you can start customizing the UI with the article:

    [Customize the user interface of your application using a custom policy in Azure Active Directory B2C](active-directory-b2c-ui-customization-custom.md).
