---
author: mmacy
ms.service: active-directory-b2c
ms.subservice: B2C
ms.topic: include
ms.date: 02/12/2020
ms.author: marsma
---
## Use custom page content

By using the page UI customization feature, you can customize the look and feel of any custom policy. You can also maintain brand and visual consistency between your application and Azure AD B2C.

Here's how it works: Azure AD B2C runs code in your customer's browser and uses a modern approach called [Cross-Origin Resource Sharing (CORS)](https://www.w3.org/TR/cors/). At runtime, content is loaded from a URL that you specify in your user flow or custom policy. Each page in the user experience loads its content from the URL you specify for that page. After content is loaded from your URL, it's merged with an HTML fragment inserted by Azure AD B2C, and then the page is displayed to your customer.
 
![HTML template margin](https://raw.githubusercontent.com/wiki/azure-ad-b2c/ief-wiki/media/ui-customization.png)


##  Custom HTML page content

Create an HTML page with your own branding. This page can be a static one `*.html`, or a dynamic HTML page (e.g .NET, Node.js, PHP) which will serve the content. The HTML template can contain any HTML elements (except insecure elements, such as iframes) CSS styling, and JavaScript. The only required element is a div element with id set to 'api', such as this one <div id="api"></div> within your HTML page.

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

### Azure AD B2C custom page contents

You can use Azure AD B2C out of the box HTM files. The following table lists the default content that Azure AD B2C provides. You can download those files and use them as a starting point to create your own HTML template.

| Default HTML content | Content definition ID (custom policy)| Description |
|-----------------------|--------|-------------|
| [exception.html](https://login.microsoftonline.com/static/tenant/default/exception.cshtml) | *api.error* |  **Error page**. This page is displayed when an exception or an error is encountered. |
| [selfasserted.html](https://login.microsoftonline.com/static/tenant/default/selfAsserted.cshtml) | *api.localaccountsignin*, *api.localaccountsignup* , *api.localaccountpasswordreset*, *api.selfasserted*, |  **Self-Asserted page**. Use this file as a template for a social account sign-up page, a local account sign-up page, a local account sign-in page, password reset, and more. The form can contain various input controls, such as: a text input box, a password entry box, a radio button, single-select drop-down boxes, and multi-select check boxes.|
| [multifactor-1.0.0.html](https://login.microsoftonline.com/static/tenant/default/multifactor-1.0.0.cshtml) | *api.phonefactor* | **Multi-factor authentication page**. On this page, users can verify their phone numbers (by using text or voice) during sign-up or sign-in. |
| [updateprofile.html](https://login.microsoftonline.com/static/tenant/default/updateProfile.cshtml) | *api.selfasserted.profileupdate* | **Profile update page**. This page contains a form that users can access to update their profile. This page is similar to the social account sign-up page, except for the password entry fields. |
| [unified.html](https://login.microsoftonline.com/static/tenant/default/unified.cshtml) | *api.signuporsignin* | **Unified sign-up or sign-in page**. This page handles the user sign-up and sign-in process. Users can use enterprise identity providers, social identity providers such as Facebook or Google+, or local accounts.  |

## Hosting the page content

When using your own HTML and CSS files to customize the UI, you can host your UI content on any publicly available HTTPS endpoint that supports CORS. For example, [Azure Blob storage](../storage/blobs/storage-blobs-introduction.md), [Azure App Services](azure/app-service/), web servers, CDNs, AWS S3, or file sharing systems. The important point is that you host the content on a publicly available HTTPS endpoint with CORS enabled. 

## Guidelines for using custom page content

- You must use an absolute URL when you include external resources, such as media, CSS and JavaScript files.
- Add `data-preload="true"` attribute in your HTML tags to control the load order for CSS and JavaScript. With `data-preload=true`, a page is constructed before being shown to the user. This means that first the broser downloas the HTML file, then all of its references before constructing the page and displaying it. This helps getting rid of the ‘flicker’ that may occur on a page by ‘preloading’ the CSS file, without the unstyled HTML being shown to the user. Following HTML code snippent ilustate the user of preload
  ```HTML
  <link href="https://path-to-your-file/sample.css" rel="stylesheet" type="text/css" data-preload="true"/>
  ```
- Azure AD B2C merges HTML content into your pages. You can copy and try to change the default content that Azure AD B2C provides. 
- JavaScript can be included in your custom content for both [user flows](user-flow-javascript-overview.md) and [custom policies](javascript-samples.md).
- Supported browser versions are:
  - Internet Explorer 11, 10, and Microsoft Edge
  - Limited support for Internet Explorer 9 and 8
  - Google Chrome 42.0 and above
  - Mozilla Firefox 38.0 and above
- Due to security restrictions, Azure AD B2C doesn't support `frame`, `iframe` and `form` HTML elements.

## custom page content walkthrough

1. Prepare a place where you can hosts your custom page content.
1. Download and customize an HTML template, such as `unified.html`.
1. Publish your custom page content to a publicly available HTTPS endpoint.
1. Set cross-origin resource sharing (CORS) for your web app.
1. Point your policy to your custom page content.

## 1. Create your HTML content

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
> HTML form elements will be removed due to security restrictions if you use login.microsoftonline.com. Please use b2clogin.com if you want to use HTML form elements in your custom HTML content. See [Use b2clogin.com](b2clogin.md) for other benefits.

## 2. Create an Azure Blob storage account

>[!NOTE]
> In this article, we use Azure Blob storage to host our content. You can choose to host your content on a web server, but you must [enable CORS on your web server](https://enable-cors.org/server.html).

To host this HTML content in Blob storage, perform the following steps:

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
1. Click **Review + create** to create the storage account.
    After the deployment is completed, the **Storage account** page opens automatically.

### 2.1 Create a container

To create a public container in Blob storage, perform the following steps:

1. Under **Blob service** in the left-hand menu, select **Blobs**.
1. Click **+Container**.
1. For **Name**, enter *root*. This can be a name of your choosing, for example *wingtiptoys*, but we use *root* in this example for simplicity.
1. For **Public access level**, select **Blob**, then **OK**.
1. Click **root** to open the new container.

### 2.2 Upload your custom page content files

1. Click **Upload**.
1. Click the folder icon next to **Select a file**.
1. Navigate to and select **customize-ui.html** which you created earlier in the Page UI customization section.
1. If you want to upload to a subfolder, expand **Advanced** and enter a folder name in **Upload to folder**.
1. Select **Upload**.
1. Select the **customize-ui.html** blob that you uploaded.
1. To the right of the **URL** text box, select the **Copy to clipboard** icon to copy the URL to your clipboard.
1. In web browser, navigate to the URL you copied to verify the blob you uploaded is accessible. If it is inaccessible, for example if you encounter a `ResourceNotFound` error, make sure the container access type is set to **blob**.

## 3. Configure CORS

Configure Blob storage for Cross-Origin Resource Sharing by performing the following steps:

1. In the menu, select **CORS**.
1. For **Allowed origins**, enter `https://your-tenant-name.b2clogin.com`. Replace `your-tenant-name` with the name of your Azure AD B2C tenant. For example, `https://fabrikam.b2clogin.com`. You need to use all lowercase letters when entering your tenant name.
1. For **Allowed Methods**, select both `GET` and `OPTIONS`.
1. For **Allowed Headers**, enter an asterisk (*).
1. For **Exposed Headers**, enter an asterisk (*).
1. For **Max age**, enter 200.
1. Click **Save**.

### 3.1 Test CORS

Validate that you're ready by performing the following steps:

1. Go to the [www.test-cors.org](https://www.test-cors.org/) website, and then paste the URL in the **Remote URL** box.
1. Click **Send Request**.
    If you receive an error, make sure that your [CORS settings](#configure-cors) are correct. You might also need to clear your browser cache or open an in-private browsing session by pressing Ctrl+Shift+P.

