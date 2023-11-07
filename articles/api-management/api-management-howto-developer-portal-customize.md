---
title: Tutorial - Access and customize the developer portal - Azure API Management | Microsoft Docs
description: In this tutorial, customize the API Management developer portal, an automatically generated, fully customizable website with the documentation of your APIs. 
services: api-management
author: dlepow

ms.service: api-management
ms.topic: tutorial
ms.date: 09/06/2023
ms.author: danlep
ms.custom: engagement-fy23
---

# Tutorial: Access and customize the developer portal

The *developer portal* is an automatically generated, fully customizable website with the documentation of your APIs. It is where API consumers can discover your APIs, learn how to use them, and request access.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Access the managed version of the developer portal
> * Navigate its administrative interface
> * Customize the content
> * Publish the changes
> * View the published portal

You can find more details on the developer portal in the [Azure API Management developer portal overview](api-management-howto-developer-portal.md).

:::image type="content" source="media/api-management-howto-developer-portal-customize/cover.png" alt-text="Screenshot of the API Management developer portal - administrator mode." border="false":::

## Prerequisites

- Complete the following quickstart: [Create an Azure API Management instance](get-started-create-service-instance.md)
- Import and publish an API. For more information, see [Import and publish](import-and-publish.md)

[!INCLUDE [premium-dev-standard-basic.md](../../includes/api-management-availability-premium-dev-standard-basic.md)]

## Access the portal as an administrator

Follow the steps below to access the managed version of the portal.

1. In the [Azure portal](https://portal.azure.com), navigate to your API Management instance.
1. If you created your instance in a v2 service tier that supports the developer portal, first enable the developer portal. 
    1. In the left menu, under **Developer portal**, select **Portal settings**. 
    1. In the **Portal settings** window, select **Enabled**. Select **Save**. 
    
    It might take a few minutes to enable the developer portal.
1. In the left menu, under **Developer portal**, select **Portal overview**. Then select the **Developer portal** button in the top navigation bar. A new browser tab with an administrative version of the portal will open.

## Developer portal architectural concepts

The portal components can be logically divided into two categories: *code* and *content*.

### Code

Code is maintained in the API Management developer portal [GitHub repository](https://github.com/Azure/api-management-developer-portal) and includes:

- **Widgets** - represent visual elements and combine HTML, JavaScript, styling ability, settings, and content mapping. Examples are an image, a text paragraph, a form, a list of APIs etc.
- **Styling definitions** - specify how widgets can be styled
- **Engine** - which generates static webpages from portal content and is written in JavaScript
- **Visual editor** - allows for in-browser customization and authoring experience

### Content

Content is divided into two subcategories: *portal content* and *API Management content*.

*Portal content* is specific to the portal and includes:

- **Pages** - for example, landing page, API tutorials, blog posts
- **Media** - images, animations, and other file-based content
- **Layouts** - templates, which are matched against a URL and define how pages are displayed
- **Styles** - values for styling definitions, such as fonts, colors, borders
- **Settings** - configurations such as favicon, website metadata

    Portal content, except for media, is expressed as JSON documents.

*API Management content* includes entities such as APIs, Operations, Products, Subscriptions.
## Understand the portal's administrative interface

### Default content 

If you're accessing the portal for the first time, the default content is automatically provisioned in the background. Default content has been designed to showcase the portal's capabilities and minimize the customizations needed to personalize your portal. You can learn more about what is included in the portal content in the [Azure API Management developer portal overview](api-management-howto-developer-portal.md).

### Visual editor

You can customize the content of the portal with the visual editor. 
* The menu sections on the left let you create or modify pages, media, layouts, menus, styles, or website settings. 
* The menu items on the bottom let you switch between viewports (for example, mobile or desktop), view the elements of the portal visible to users in different groups, or save or undo actions.
* Add sections to a page by clicking on a blue icon with a plus sign. 
* Widgets (for example, text, images, or APIs list) can be added by pressing a grey icon with a plus sign.
* Rearrange items in a page with the drag-and-drop interaction. 

### Layouts and pages

:::image type="content" source="media/api-management-howto-developer-portal-customize/pages-layouts.png" alt-text="Screenshot of the visual editor in the developer portal." border="false":::

Layouts define how pages are displayed. For example, in the default content, there are two layouts: one applies to the home page, and the other to all remaining pages.

A layout gets applied to a page by matching its URL template to the page's URL. For example, a layout with a URL template of `/wiki/*` will be applied to every page with the `/wiki/` segment in the URL: `/wiki/getting-started`, `/wiki/styles`, etc.

In the preceding image, content belonging to the layout is marked in blue, while the page is marked in red. The menu sections are marked respectively.

### Styling guide

:::image type="content" source="media/api-management-howto-developer-portal-customize/styling-guide.png" alt-text="Screenshot of the styling guide in the developer portal." border="false":::

Styling guide is a panel created with designers in mind. It allows for overseeing and styling all the visual elements in your portal. The styling is hierarchical - many elements inherit properties from other elements. For example, button elements use colors for text and background. To change a button's color, you need to change the original color variant.

To edit a variant, select it and select the pencil icon that appears on top of it. After you make the changes in the pop-up window, close it.

### Save button

:::image type="content" source="media/api-management-howto-developer-portal-customize/save-button.png" alt-text="Screenshot of the Save button in the developer portal." :::

Whenever you make a change in the portal, you need to save it manually by selecting the **Save** button in the menu at the bottom, or press [Ctrl]+[S]. When you save your changes, the modified content is automatically uploaded to your API Management service.

## Customize the portal's content

Before you make your portal available to the visitors, you should personalize the automatically generated content. Recommended changes include the layouts, styles, and the content of the home page. You can also make certain content elements accessible only to selected users or groups.

> [!NOTE]
> Due to integration considerations, the following pages can't be removed or moved under a different URL: `/404`, `/500`, `/captcha`, `/change-password`, `/config.json`, `/confirm/invitation`, `/confirm-v2/identities/basic/signup`, `/confirm-v2/password`, `/internal-status-0123456789abcdef`, `/publish`, `/signin`, `/signin-sso`, `/signup`.

### Home page

The default **Home** page is filled with placeholder content. You can either remove entire sections containing this content or keep the structure and adjust the elements one by one. Replace the generated text and images with your own and make sure the links point to desired locations. You can edit the structure and content of the home page by:
* Dragging and dropping page elements to the desired placement on the site.
* Selecting text and heading elements to edit and format content. 
* Verifying your buttons point to the right locations.

### Layouts

Replace the automatically generated logo in the navigation bar with your own image.

1. In the developer portal, select the default **Contoso** logo in the top left of the navigation bar. 
1. Select the **Edit** icon. 
1. Under the **Main** section, select **Source**.
1. In the **Media** pop-up, either select:
    * An image already uploaded in your library, or
    * **Upload file** to upload a new image file to use, or
    * Select **None** to forego using a logo.
1. The logo updates in real-time.
1. Select outside the pop-up windows to exit the media library.
1. Click **Save**.

### Styling

Although you don't need to adjust any styles, you may consider adjusting particular elements. For example, change the primary color to match your brand's color. You can do this in two ways:

#### Overall site style

1. In the developer portal, select the **Styles** icon from the left tool bar.
1. Under the **Colors** section, select the color style item you want to edit.
1. Click the **Edit** icon for that style item.
1. Select the color from the color-picker, or enter the hex color code.
1. Add and name another color item by clicking **Add color**.  
1. Click **Save**.

#### Container style

1. On the main page of the developer portal, select the container background.
1. Click the **Edit** icon.
1. In the pop-up, set:
    * The background to clear, an image, a specific color, or a gradient.
    * The container size, margin, and padding.
    * Container position and height.
1. Select outside the pop-up windows to exit the container settings.
1. Click **Save**.

### Visibility and access controls

You can control which portal content appears to different users, based on their identity. For example, you might want to display certain pages only to users who have access to a specific product or API. Or, make a section of a page appear only for certain [groups of users](api-management-howto-create-groups.md). The developer portal has built-in controls for these needs.

> [!NOTE]
> Visibility and access controls are supported only in the managed developer portal. They are not supported in the [self-hosted portal](developer-portal-self-host.md).

* When you add or edit a page, select the **Access** tab to control the users or groups that can access the page
    
    :::image type="content" source="media/api-management-howto-developer-portal-customize/page-access-control.png" alt-text="Screenshot of the page access control settings in the developer portal.":::

* When you customize page content such as a page section, menu, or button, select the **Change visibility** icon to control the users or groups that can see the element on the page

    :::image type="content" source="media/api-management-howto-developer-portal-customize/change-visibility-button.png" alt-text="Screenshot of the change visibility button in the developer portal.":::

    * You can change the visibility of the following page content: sections, menus, buttons, and sign-in for OAuth authorization.    

    * Media files such as images on a page inherit the visibility of the elements that contain them.

When a user visits the developer portal with visibility and access controls applied:

* The developer portal automatically hides buttons or navigation items that point to pages that a user doesn't have access to.

* An attempt by a user to access a page they aren't authorized to will result in a 404 Not Found error.

> [!TIP]
> Using the administrative interface, you can preview pages as a user associated with any built-in or custom group by selecting the **Impersonate** icon in the menu at the bottom. 
> 

### Customization example

In the following video, we demonstrate how to edit the content of the portal, customize the website's look, and publish the changes.

> [!VIDEO https://www.youtube.com/embed/5mMtUSmfUlw]

## <a name="publish"></a> Publish the portal

To make your portal and its latest changes available to visitors, you need to *publish* it. You can publish the portal within the portal's administrative interface or from the Azure portal.

### Publish from the administrative interface

1. Make sure you saved your changes by selecting the **Save** icon.
1. In the **Operations** section of the menu, select **Publish website**. This operation may take a few minutes.  

    :::image type="content" source="media/api-management-howto-developer-portal-customize/publish-portal.png" alt-text="Screenshot of the Publish website button in the developer portal." border="false":::

### Publish from the Azure portal

1. In the [Azure portal](https://portal.azure.com), navigate to your API Management instance.
1. In the left menu, under **Developer portal**, select **Portal overview**.
1. In the **Portal overview** window, select **Publish**.

    :::image type="content" source="media/api-management-howto-developer-portal-customize/pubish-portal-azure-portal.png" alt-text="Publish portal from Azure portal":::

> [!NOTE]
> The portal needs to be republished after API Management service configuration changes. For example, republish the portal after assigning a custom domain, updating the identity providers, setting delegation, or specifying sign-in and product terms.


## Visit the published portal

After you publish the portal, you can access it at the same URL as the administrative panel, for example `https://contoso-api.developer.azure-api.net`. View it in a separate browser session (using incognito or private browsing mode) as an external visitor.

## Apply the CORS policy on APIs

To let the visitors of your portal test the APIs through the built-in interactive console, enable CORS (cross-origin resource sharing) on your APIs. For details, see the [Azure API Management developer portal FAQ](developer-portal-faq.md#cors).

## Next steps

Learn more about the developer portal:

- [Azure API Management developer portal overview](api-management-howto-developer-portal.md)
- [Migrate to the new developer portal](developer-portal-deprecated-migration.md) from the deprecated legacy portal.
- Configure authentication to the developer portal with [usernames and passwords](developer-portal-basic-authentication.md), [Microsoft Entra ID](api-management-howto-aad.md), or [Azure AD B2C](api-management-howto-aad-b2c.md).
- Learn more about [customizing and extending](developer-portal-extend-custom-functionality.md) the functionality of the developer portal.
