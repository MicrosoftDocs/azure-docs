---
title: Tutorial - Access and customize the developer portal - Azure API Management | Microsoft Docs
description: Follow this tutorial to learn how to customize the API Management developer portal, an automatically generated, fully customizable website with the documentation of your APIs. 
services: api-management
author: dlepow

ms.service: api-management
ms.topic: tutorial
ms.date: 11/20/2023
ms.author: danlep
ms.custom: engagement-fy23
---

# Tutorial: Access and customize the developer portal

In this tutorial, you'll get started with customizing the API Management *developer portal*. The developer portal is an automatically generated, fully customizable website with the documentation of your APIs. It's where API consumers can discover your APIs, learn how to use them, and request access.

[!INCLUDE [developer-portal-editor-refresh](../../includes/developer-portal-editor-refresh.md)] 

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Access the managed version of the developer portal
> * Navigate its administrative interface
> * Customize the content
> * Publish the changes
> * View the published portal

For more information about developer portal features and options, see [Azure API Management developer portal overview](api-management-howto-developer-portal.md).

:::image type="content" source="media/api-management-howto-developer-portal-customize/cover.png" alt-text="Screenshot of the API Management developer portal - administrator mode." border="false":::

## Prerequisites

- Complete the following quickstart: [Create an Azure API Management instance](get-started-create-service-instance.md).
- [Import and publish](import-and-publish.md) an API.

[!INCLUDE [premium-dev-standard-basic.md](../../includes/api-management-availability-premium-dev-standard-basic.md)]

## Access the portal as an administrator

Follow these steps to access the managed version of the developer portal.

1. In the [Azure portal](https://portal.azure.com), navigate to your API Management instance.
1. If you created your instance in a v2 service tier that supports the developer portal, first enable the developer portal. 
    1. In the left menu, under **Developer portal**, select **Portal settings**. 
    1. In the **Portal settings** window, select **Enabled**. Select **Save**. 
    
    It might take a few minutes to enable the developer portal.
1. In the left menu, under **Developer portal**, select **Portal overview**. Then select the **Developer portal** button in the top navigation bar. A new browser tab with an administrative version of the portal will open.

## Understand the portal's administrative interface

[!INCLUDE [api-management-developer-portal-editor](../../includes/api-management-developer-portal-editor.md)]

## Add an image to the media library

You'll want to use your own images and other media content in the developer portal to reflect your organization's branding. If an image that you want to use isn't already in the portal's media library, add it in the developer portal:

1. In the left menu of the visual editor, select **Media**.
1. Do one of the following:
    * Select **Upload file** and select a local image file on your computer.
    * Select **Link file**. Enter a **Reference URL** to the image file and other details. Then select **Download**.
1. Select **Close** to exit the media library.

> [!TIP]
> You can also add an image to the media library by dragging and dropping it directly in the visual editor window.

## Replace the default logo on the home page

A placeholder logo is provided in the top left corner of the navigation bar. You can replace it with your own logo to match your organization's branding.

1. In the developer portal, select the default **Contoso** logo in the top left of the navigation bar. 
1. Select **Edit**. 
1. In the **Picture** pop-up, under **Main**, select **Source**.
1. In the **Media** pop-up, select one of the following:
    * An image already uploaded in your media library
    * **Upload file** to upload a new image file to your media library
    * **None** if you don't want to use a logo
1. The logo updates in real time.
1. Select outside the pop-up windows to exit the media library.
1. In the top bar, select **Save**.

## Edit content on the home page

The default **Home** page and other pages are provided with placeholder text and other images. You can either remove entire sections containing this content or keep the structure and adjust the elements one by one. Replace the generated text and images with your own and make sure any links point to desired locations. 

Edit the structure and content of the generated pages in several ways. For example:

[!INCLUDE [api-management-developer-portal-add](../../includes/api-management-developer-portal-add.md)]

## Edit the site's primary color

To change colors, gradients, typography, buttons, and other user interface elements in the developer portal, edit the site styles. For example, change the primary color in the navigation bar, buttons, and other elements to match your organization's branding.

1. In the developer portal, in the left menu of the visual editor, select **Styles**. 
1. Under the **Colors** section, select the color style item you want to edit. For example, select **Primary**.
1. Select **Edit color**.
1. Select the color from the color-picker, or enter the color hex code.
1. In the top bar, elect **Save**.

The updated color is applied to the site in real time.

> [!TIP]
> If you want, add and name another color item by selecting **+ Add color** on the **Styles** page.

## Change the background image on the home page

You can change the background on your home page to an image or color that matches your organization's branding. If you haven't already uploaded a different image to the media library, upload it before changing the background image, or when you change the background image.

1. On the home page of the developer portal, click in the top right corner so that the top section is highlighted at the corners and a pop-up menu appears.
1. To the right of **Edit article** in the pop-up menu, select the up-down arrow (**Switch to parent**). 
1. Select **Edit section**.
1. In the **Section** pop-up, under **Background**, select one of the icons:

    :::image type="content" source="media/api-management-howto-developer-portal-customize/background.png" alt-text="Screenshot of background settings in the developer portal.":::
    * **Clear background**, to remove a background image
    * **Background image**, to select an image from the media library, or to upload a new image
    * **Background color**, to select a color from the color picker, or to clear a color
    * **Background gradient**, to select a gradient from your site styles page, or to clear a gradient
1. In the top bar, select **Save**.

## Change the default layout

The developer portal uses *layouts* to define common content elements such as navigation bars and footers on groups of related pages. Each page is automatically matched with a layout based on a URL template. 

By default, the developer portal comes with two layouts:

* **Home** - used for the home page (URL template `/`)

* **Default** - used for all other pages (URL template `/*`). 

:::image type="content" source="media/api-management-howto-developer-portal-customize/layouts.png" alt-text="Screenshot of default layouts in the developer portal.":::

You can change the layout for any page in the developer portal and define new layouts to apply to pages that match other URL templates.

For example, to change the logo that's used in the navigation bar of the Default layout to match your organization's branding:

1. In the left menu of the visual editor, select **Pages**.
1. Select the **Layouts** tab, and select **Default**.
1. Select the picture of the logo in the upper left corner and select **Edit**.
1. Under **Main**, select **Source**.
1. In the **Media** pop-up windows, select one of the following:
    * An image already uploaded in your media library
    * **Upload file** to upload a new image file to your media file that you can select
    * **None** if you don't want to use a logo
1. The logo updates in real time.
1. Select outside the pop-up windows to exit the media library.
1. In the top bar, select **Save**.

## Edit navigation menus

You can edit the navigation menus at the top of the developer portal pages to change the order of menu items, add items, or remove items. You can also change the name of menu items and the URL or other content they point to.

For example, the **Default** and **Home** layouts for the developer portal show two menus to guest users of the developer portal: 

* a main menu with links to **Home**, **APIs**, and **Products**
* an anonymous user menu with links to **Sign in** and **Sign up** pages. 

However, you might want to customize them. For example, if you want to independently invite users to your site, you could disable the **Sign up** link in the anonymous user menu.

:::image type="content" source="media/api-management-howto-developer-portal-customize/navigation-menus.png" alt-text="Screenshot of default navigation menus in the developer portal.":::

1. In the left menu of the visual editor, select **Site menu**.
1. On the left, expand **Anonymous user menu**.
1. Select the settings (gear icon) next to **Sign up**, and select **Delete**. 
1. Select **Save**.

## Edit site settings

Edit the site settings for the developer portal to change the site name, description, and other details. 

1. In the left menu of the visual edit, select **Settings**.
1. In the **Settings** pop-up, enter the site metadata you want to change. Optionally, setup a favicon for the site from an image in your media library.
1. In the top bar, **Save**.

> [!TIP]
> If you want to change the site's domain name, you must first set up a custom domain in your API Management instance. [Learn more about custom domain names](configure-custom-domain.md) in API Management.


## Publish the portal

To make your portal and its latest changes available to visitors, you need to *publish* it.

To publish from the adminstrative interface of the developer portal:

[!INCLUDE [api-management-developer-portal-publish](../../includes/api-management-developer-portal-publish.md)]

Publishing the portal can take a few minutes to complete.

> [!TIP]
> Another option is to publish the site from the Azure portal. On the **Portal overview** page of your API Management instance in the Azure portal, select **Publish**. 

## Visit the published portal

To view your changes after you publish the portal, access it at the same URL as the administrative panel, for example `https://contoso-api.developer.azure-api.net`. View it in a separate browser session (using incognito or private browsing mode) as an external visitor.

## Apply the CORS policy on APIs

To let the visitors of your portal test the APIs through the built-in interactive console, enable CORS (cross-origin resource sharing) on your APIs, if you haven't already done so. On the **Portal overview** page of your API Management instance in the Azure portal, select **Enable CORS**. [Learn more](enable-cors-developer-portal.md).

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Access the managed version of the developer portal
> * Navigate its administrative interface
> * Customize the content
> * Publish the changes
> * View the published portal

Advance to the next tutorial:

> [!div class="nextstepaction"]
> [Import and manage APIs using Visual Studio Code](visual-studio-code-tutorial.md)

- [Azure API Management developer portal overview](api-management-howto-developer-portal.md)
- Configure authentication to the developer portal with [usernames and passwords](developer-portal-basic-authentication.md), [Microsoft Entra ID](api-management-howto-aad.md), or [Azure AD B2C](api-management-howto-aad-b2c.md).
- Learn more about [customizing and extending](developer-portal-extend-custom-functionality.md) the functionality of the developer portal.
