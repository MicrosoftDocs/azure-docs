---
author: msmimart
ms.service: active-directory-b2c
ms.subservice: B2C
ms.topic: include
ms.date: 03/19/2020
ms.author: mimart
---
## Use custom page content

By using the page UI customization feature, you can customize the look and feel of any custom policy. You can also maintain brand and visual consistency between your application and Azure AD B2C.

### How it works

Azure AD B2C runs code in your customer's browser by using [Cross-Origin Resource Sharing (CORS)](https://www.w3.org/TR/cors/). At runtime, content is loaded from a URL you specify in your user flow or custom policy. Each page in the user experience loads its content from the URL you specify for that page. After content is loaded from your URL, it's merged with an HTML fragment inserted by Azure AD B2C, and then the page is displayed to your customer.

![Custom page content margin](./media/active-directory-b2c-html-templates/html-content-merging.png)

## Custom HTML page content

Create an HTML page with your own branding to serve your custom page content. This page can be a static `*.html` page, or a dynamic page like .NET, Node.js, or PHP.

Your custom page content can contain any HTML elements, including CSS and JavaScript, but cannot include insecure elements like iframes. The only required element is a div element with `id` set to `api`, such as this one `<div id="api"></div>` within your HTML page.

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

### Customize the default Azure AD B2C pages

Instead of creating your custom page content from scratch, you can customize Azure AD B2C's default page content.

The following table lists the default page content provided by Azure AD B2C. Download the files and use them as a starting point for creating your own custom pages.

| Default page | Description | Content definition ID<br/>(custom policy only) |
|:-----------------------|:--------|-------------|
| [exception.html](https://login.microsoftonline.com/static/tenant/default/exception.cshtml) | **Error page**. This page is displayed when an exception or an error is encountered. | *api.error* |
| [selfasserted.html](https://login.microsoftonline.com/static/tenant/default/selfAsserted.cshtml) |  **Self-Asserted page**. Use this file as a custom page content for a social account sign-up page, a local account sign-up page, a local account sign-in page, password reset, and more. The form can contain various input controls, such as: a text input box, a password entry box, a radio button, single-select drop-down boxes, and multi-select check boxes. | *api.localaccountsignin*, *api.localaccountsignup*, *api.localaccountpasswordreset*, *api.selfasserted* |
| [multifactor-1.0.0.html](https://login.microsoftonline.com/static/tenant/default/multifactor-1.0.0.cshtml) | **Multi-factor authentication page**. On this page, users can verify their phone numbers (by using text or voice) during sign-up or sign-in. | *api.phonefactor* |
| [updateprofile.html](https://login.microsoftonline.com/static/tenant/default/updateProfile.cshtml) | **Profile update page**. This page contains a form that users can access to update their profile. This page is similar to the social account sign-up page, except for the password entry fields. | *api.selfasserted.profileupdate* |
| [unified.html](https://login.microsoftonline.com/static/tenant/default/unified.cshtml) | **Unified sign-up or sign-in page**. This page handles the user sign-up and sign-in process. Users can use enterprise identity providers, social identity providers such as Facebook or Google+, or local accounts. | *api.signuporsignin* |

## Hosting the page content

When using your own HTML and CSS files to customize the UI, host your UI content on any publicly available HTTPS endpoint that supports CORS. For example, [Azure Blob storage](../articles/storage/blobs/storage-blobs-introduction.md), [Azure App Services](/azure/app-service/), web servers, CDNs, AWS S3, or file sharing systems.

## Guidelines for using custom page content

- Use an absolute URL when you include external resources like media, CSS, and JavaScript files in your HTML file.
- Using [page layout version](../articles/active-directory-b2c/page-layout.md) 1.2.0 and above, you can add the `data-preload="true"` attribute in your HTML tags to control the load order for CSS and JavaScript. With `data-preload=true`, the page is constructed before being shown to the user. This attribute helps prevent the page from "flickering" by preloading the CSS file, without the un-styled HTML being shown to the user. The following HTML code snippet shows the use of the `data-preload` tag.
  ```HTML
  <link href="https://path-to-your-file/sample.css" rel="stylesheet" type="text/css" data-preload="true"/>
  ```
- We recommend that you start with the default page content and build on top of it.
- You can include JavaScript in your custom content for both [user flows](../articles/active-directory-b2c/user-flow-javascript-overview.md) and [custom policies](../articles/active-directory-b2c/javascript-samples.md).
- Supported browser versions are:
  - Internet Explorer 11, 10, and Microsoft Edge
  - Limited support for Internet Explorer 9 and 8
  - Google Chrome 42.0 and above
  - Mozilla Firefox 38.0 and above
  - Safari for iOS and macOS, version 12 and above
- Due to security restrictions, Azure AD B2C doesn't support `frame`, `iframe`, or `form` HTML elements.

## Custom page content walkthrough

Here's an overview of the process:

1. Prepare a location to host your custom page content (a publicly accessible, CORS-enabled HTTPS endpoint).
1. Download and customize a default page content file, for example `unified.html`.
1. Publish your custom page content your publicly available HTTPS endpoint.
1. Set cross-origin resource sharing (CORS) for your web app.
1. Point your policy to your custom policy content URI.

### 1. Create your HTML content

Create a custom page content with your product's brand name in the title.

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

1. Paste the copied snippet in a text editor, and then save the file as *customize-ui.html*.

> [!NOTE]
> HTML form elements will be removed due to security restrictions if you use login.microsoftonline.com. If you want to use HTML form elements in your custom HTML content, [use b2clogin.com](../articles/active-directory-b2c/b2clogin.md).

### 2. Create an Azure Blob storage account

In this article, we use Azure Blob storage to host our content. You can choose to host your content on a web server, but you must [enable CORS on your web server](https://enable-cors.org/server.html).

To host your HTML content in Blob storage, perform the following steps:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. On the **Hub** menu, select **New** > **Storage** > **Storage account**.
1. Select a **Subscription** for your storage account.
1. Create a **Resource group** or select an existing one.
1. Enter a unique **Name** for your storage account.
1. Select the **Geographic location** for your storage account.
1. **Deployment model** can remain **Resource Manager**.
1. **Performance** can remain **Standard**.
1. Change **Account Kind** to **Blob storage**.
1. **Replication** can remain **RA-GRS**.
1. **Access tier** can remain **Hot**.
1. Select **Review + create** to create the storage account.
    After the deployment is completed, the **Storage account** page opens automatically.

#### 2.1 Create a container

To create a public container in Blob storage, perform the following steps:

1. Under **Blob service** in the left-hand menu, select **Blobs**.
1. Select **+Container**.
1. For **Name**, enter *root*. The name can be a name of your choosing, for example *contoso*, but we use *root* in this example for simplicity.
1. For **Public access level**, select **Blob**, then **OK**.
1. Select **root** to open the new container.

#### 2.2 Upload your custom page content files

1. Select **Upload**.
1. Select the folder icon next to **Select a file**.
1. Navigate to and select **customize-ui.html**, which you created earlier in the Page UI customization section.
1. If you want to upload to a subfolder, expand **Advanced** and enter a folder name in **Upload to folder**.
1. Select **Upload**.
1. Select the **customize-ui.html** blob that you uploaded.
1. To the right of the **URL** text box, select the **Copy to clipboard** icon to copy the URL to your clipboard.
1. In web browser, navigate to the URL you copied to verify the blob you uploaded is accessible. If it is inaccessible, for example if you encounter a `ResourceNotFound` error, make sure the container access type is set to **blob**.

### 3. Configure CORS

Configure Blob storage for Cross-Origin Resource Sharing by performing the following steps:

1. In the menu, select **CORS**.
1. For **Allowed origins**, enter `https://your-tenant-name.b2clogin.com`. Replace `your-tenant-name` with the name of your Azure AD B2C tenant. For example, `https://fabrikam.b2clogin.com`. Use all lowercase letters when entering your tenant name.
1. For **Allowed Methods**, select both `GET` and `OPTIONS`.
1. For **Allowed Headers**, enter an asterisk (*).
1. For **Exposed Headers**, enter an asterisk (*).
1. For **Max age**, enter 200.
1. Select **Save**.

#### 3.1 Test CORS

Validate that you're ready by performing the following steps:

1. Repeat the configure CORS step. For **Allowed origins**, enter `https://www.test-cors.org`
1. Navigate to [www.test-cors.org](https://www.test-cors.org/) 
1. For the **Remote URL** box, paste the URL of your HTML file. For example, `https://your-account.blob.core.windows.net/azure-ad-b2c/unified.html`
1. Select **Send Request**.
    The result should be `XHR status: 200`. 
    If you receive an error, make sure that your CORS settings are correct. You might also need to clear your browser cache or open an in-private browsing session by pressing Ctrl+Shift+P.
