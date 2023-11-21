---
title: Overview of the developer portal in Azure API Management
titleSuffix: Azure API Management
description: Learn about the developer portal in API Management - a customizable website, where API consumers can explore your APIs.
services: api-management
author: dlepow

ms.service: api-management
ms.topic: conceptual
ms.date: 09/18/2023
ms.author: danlep 
---

# Overview of the developer portal

The API Management *developer portal* is an automatically generated, fully customizable website with the documentation of your APIs. It's where API consumers can discover your APIs, learn how to use them, request access, and try them out.

This article introduces features of the developer portal, the types of content the portal presents, and ways to customize and extend the developer portal for your specific users and scenarios.

[!INCLUDE [developer-portal-editor-refresh](../../includes/developer-portal-editor-refresh.md)] 

:::image type="content" source="media/developer-portal-overview/cover.png" alt-text="Screenshot of the API Management developer portal.":::

[!INCLUDE [premium-dev-standard-basic.md](../../includes/api-management-availability-premium-dev-standard-basic.md)]

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

## Customize and style the portal

Out of the box, the developer portal is already populated with your published APIs and products and ready to be customized for your needs. As an API publisher, you use the developer portal's administrative interface to customize the appearance and functionality of the developer portal. 

If you're accessing the portal for the first time, the portal includes placeholder pages, content, and navigation menus. The placeholder content you see has been designed to showcase the portal's capabilities and minimize the customizations needed to personalize your portal. 

For a step-by-step walkthrough of customizing the developer portal, see [Tutorial: Access and customize the developer portal](api-management-howto-developer-portal-customize.md).

### Visual editor

The developer portal's administrative interface provides a visual editor for customizing the portal's content and styling. You can add, remove, and rearrange pages, sections, and widgets. You can also change the styling of the portal's elements, such as fonts, colors, and spacing.

[!INCLUDE [api-management-developer-portal-editor](../../includes/api-management-developer-portal-editor.md)]

[!INCLUDE [api-management-developer-portal-add](../../includes/api-management-developer-portal-add.md)]


### Layouts and pages

Layouts define how pages are displayed. For example, in the default content, there are two layouts: one applies to the home page, and the other to all remaining pages. You can modify these layouts and add more layouts to suit your needs.

A layout gets applied to a page by matching its URL template to the page's URL. For example, a layout with a URL template of `/wiki/*` is applied to every page with the `/wiki/` segment in the URL: `/wiki/getting-started`, `/wiki/styles`, etc.

In the following image, content belonging to the layout is outlined in blue, while the page-specific content is outlined in red. The menu sections are marked respectively.

:::image type="content" source="media/developer-portal-overview/pages-layouts.png" alt-text="Screenshot of layout content in the developer portal." :::

The preprovisioned content in the developer portal showcases pages with commonly used features. You can modify the content of these pages or add new ones to suit your needs.

> [!NOTE]
> Due to integration considerations, the following pages can't be removed or moved under a different URL: `/404`, `/500`, `/captcha`, `/change-password`, `/config.json`, `/confirm/invitation`, `/confirm-v2/identities/basic/signup`, `/confirm-v2/password`, `/internal-status-0123456789abcdef`, `/publish`, `/signin`, `/signin-sso`, `/signup`.

### Styles

:::image type="content" source="media/developer-portal-overview/styling-guide.png" alt-text="Screenshot of the styling guide in the developer portal.":::

The Styles panel is created with designers in mind. Use styles to manage and customize all the visual elements in your portal, such as fonts used in headings and menus and button colors. The styling is hierarchical - many elements inherit properties from other elements. For example, button elements use colors for text and background. To change a button's color, you need to change the original color variant.

To edit a variant, select it and select **Edit style** in the options that appear on top of it. After you make the changes in the pop-up window, close it.


## Extend portal functionality

In some cases you might need functionality beyond the customization and styling options provided in the managed developer portal. If you need to implement custom logic, which isn't supported out-of-the-box, you have [several options](developer-portal-extend-custom-functionality.md):
* [Add custom HTML](developer-portal-extend-custom-functionality.md#use-custom-html-code-widget) directly through a developer portal widget designed for small customizations - for example, add HTML for a form or to embed a video player. The custom code is rendered in an inline frame (IFrame).
* [Create and upload a custom widget](developer-portal-extend-custom-functionality.md#create-and-upload-custom-widget) to develop and add more complex custom portal features.
* [Self-host the portal](developer-portal-self-host.md), only if you need to make modifications to the core of the developer portal [codebase](https://github.com/Azure/api-management-developer-portal). This option requires advanced configuration. Azure Support's assistance is limited only to the basic setup of self-hosted portals.

> [!NOTE]
> Because the API Management developer portal codebase is maintained on [GitHub](https://github.com/Azure/api-management-developer-portal), you can open issues and make pull requests for the API Management team to merge new functionality at any time.
>


## API Management content

The developer portal synchronizes with your API Management instance to display content such as the APIs, operations, products, subscriptions, and user profiles. APIs and products must be in a *published* state to be visible in the developer portal.

### Content visibility and access

In API Management, [groups of users](api-management-howto-create-groups.md) are used to manage the visibility of products and their associated APIs to developers. Products are first made visible to groups, and then developers in those groups can view and subscribe to the products that are associated with the groups.

You can also control how other portal content (such as pages and sections) appears to different users, based on their identity. For example, you might want to display certain pages only to users who have access to a specific product or API. Or, make a section of a page appear only for certain [groups of users](api-management-howto-create-groups.md). The developer portal has built-in controls for these needs.

> [!NOTE]
> Visibility and access controls are supported only in the managed developer portal. They aren't supported in the [self-hosted portal](developer-portal-self-host.md).

<!-- I don't see this Access tab or know where to find it -->

* When you add or edit a page, select the **Access** tab to control the users or groups that can access the page
    
    :::image type="content" source="media/developer-portal-overview/page-access-control.png" alt-text="Screenshot of the page access control settings in the developer portal.":::

* When you customize page content such as a page section, menu, or button, select the **Change access** icon to control the users or groups that can see the element on the page

    :::image type="content" source="media/developer-portal-overview/change-visibility-button.png" alt-text="Screenshot of the change visibility button in the developer portal.":::

    * You can change the visibility of the following page content: sections, menus, buttons, and sign-in for OAuth authorization.    

    * Media files such as images on a page inherit the visibility of the elements that contain them.

When a user visits the developer portal with visibility and access controls applied:

* The developer portal automatically hides buttons or navigation items that point to pages that a user doesn't have access to.

* An attempt by a user to access a page they aren't authorized to will result in a 404 Not Found error.

> [!TIP]
> Using the administrative interface, you can preview pages as a user associated with any built-in or custom group by selecting **View as** in the menu at the top. 
> 

### Interactive test console
<!-- I don't find a way to disable -->
By default, the developer portal also provides a "Try it" capability on the API reference pages so that portal visitors can test your APIs directly through an interactive console. You can disable this feature in the portal's settings.

:::image type="content" source="media/developer-portal-overview/try-it.png" alt-text="Screenshot of the test console in the API Management developer portal.":::

The test console supports APIs with different authorization models - for example, APIs that require no authorization, or that require a subscription key or OAuth 2.0 authorization. In the latter case, you can configure the test console to generate a valid OAuth token on behalf of the test console user. For more information, see [How to authorize test console of developer portal by configuring OAuth 2.0 user authorization](api-management-howto-oauth2.md).

> [!IMPORTANT]
> To let the visitors of your portal test the APIs through the built-in interactive console, enable CORS (cross-origin resource sharing) on your APIs. For details, see [Enable CORS for interactive console in the API Management developer portal](enable-cors-developer-portal.md).

## Manage portal access

By default, the developer portal enables anonymous access. This means that anyone can view the portal and its content without signing in, although functionality such as using the test console may be restricted. You can enable a developer setting to require users to sign-in to access the portal. 

The portal supports several options for user sign-up and sign-in:

*  The portal provides a basic authentication mechanism for developers to sign-in with credentials for API Management [user accounts](api-management-howto-create-or-invite-developers.md). Developers can sign-up for an account directly through the portal, or you can create accounts for them.

* Depending on your scenarios, you can also restrict access to the portal by requiring users to sign-up or sign-in with an [Azure Active Directory](api-management-howto-aad.md) (Azure AD) or [Azure AD B2C](api-management-howto-aad-b2c.md) account.

* If you already manage developer sign-up and sign-in through an existing website, you can [delegate authentication](api-management-howto-setup-delegation.md) instead of using the developer portal's built-in authentication.

[Learn more](secure-developer-portal-access.md) about options to secure user sign-up and sign-in to the developer portal.

## Manage portal content

After you update the developer portal content or configuration, you need to save and publish your changes to make them available to portal visitors. The developer portal maintains a record of the content you've published, and you can revert to a previous portal *revision* when you need to.

### Save the portal
:::image type="content" source="media/developer-portal-overview/save-button.png" alt-text="Screenshot of the Save button in the developer portal." :::

Whenever you make a change in the portal, you need to save it manually by selecting the **Save** button in the menu at the top, or press [Ctrl]+[S]. If you need to, you can **Undo** your last saved changes. Saved changes are visible only to you and aren't visible to portal visitors until you publish them.

> [!NOTE]
> The managed developer portal receives and applies updates automatically. Changes that you've saved but not published to the developer portal remain in that state during an update.

## Publish the portal

To make your portal and its latest changes available to visitors, you need to *publish* it. You publish the portal within the portal's administrative interface or from the Azure portal.

> [!IMPORTANT]
> You need to publish the portal any time you make changes to the portal's content or styling. The portal also needs to be republished after API Management service configuration changes. For example, republish the portal after assigning a custom domain, updating the identity providers, setting delegation, or specifying sign-in and product terms.


### Publish from the administrative interface

[!INCLUDE [api-management-developer-portal-publish](../../includes/api-management-developer-portal-publish.md)]

### Publish from the Azure portal

1. In the [Azure portal](https://portal.azure.com), navigate to your API Management instance.
1. In the left menu, under **Developer portal**, select **Portal overview**.
1. In the **Portal overview** window, select **Publish**.

    :::image type="content" source="media/developer-portal-overview/pubish-portal-azure-portal.png" alt-text="Publish portal from Azure portal":::

## Migrate from the legacy portal

An earlier version of the developer portal ("legacy portal") is also provided with your API Management service. If you've previously customized the legacy portal, you should plan to migrate to the new developer portal. For more information, see the [migration guide](developer-portal-deprecated-migration.md).

> [!IMPORTANT]
> The legacy developer portal is now deprecated and it will receive security updates only. You can continue to use it, as per usual, until its retirement in October 2023, when it will be removed from all API Management services.

## Next steps

Learn more about the developer portal:

- [Access and customize the managed developer portal](api-management-howto-developer-portal-customize.md)
- [Extend functionality of the managed developer portal](developer-portal-extend-custom-functionality.md)
- [Set up self-hosted version of the portal](developer-portal-self-host.md)

Browse other resources:

- [GitHub repository with the source code](https://github.com/Azure/api-management-developer-portal)
- [Frequently asked questions about the developer portal](developer-portal-faq.md)
