---
title: Overview of the developer portal in Azure API Management
titleSuffix: Azure API Management
description: Learn about the developer portal in API Management - a customizable website, where API consumers can explore your APIs.
services: api-management
documentationcenter: API Management
author: dlepow

ms.service: api-management
ms.topic: article
ms.date: 02/10/2022
ms.author: danlep 
ms.custom: devx-track-azurepowershell
---

# Overview of the developer portal

Developer portal is an automatically generated, fully customizable website with the documentation of your APIs. It is where API consumers can discover your APIs, learn how to use them, request access, and try them out.

As introduced in this article, you can customize and extend the developer portal for your specific scenarios. 

![API Management developer portal](media/api-management-howto-developer-portal/cover.png)

[!INCLUDE [premium-dev-standard-basic.md](../../includes/api-management-availability-premium-dev-standard-basic.md)]

## Migration from the legacy portal

> [!IMPORTANT]
> The legacy developer portal is now deprecated and it will receive security updates only. You can continue to use it, as per usual, until its retirement in October 2023, when it will be removed from all API Management services.

Migration to the new developer portal is described in the [dedicated documentation article](developer-portal-deprecated-migration.md).

## Customization and styling of the managed portal

Your API Management service includes a built-in, always up-to-date, **managed** developer portal. You can access it from the Azure portal interface.

Customize and style the managed portal through the built-in, drag-and-drop visual editor: 

* Use the visual editor to modify pages, media, layouts, menus, styles, or website settings. 

* Take advantage of built-in widgets to add text, images, buttons, and other objects that the portal supports out-of-the-box. 

* [Add custom HTML](developer-portal-faq.md#how-do-i-add-custom-html-to-my-developer-portal) - for example, add HTML for a form or to embed a video player. The custom code is rendered in an inline frame (iframe).

See [this tutorial](api-management-howto-developer-portal-customize.md) for example customizations.

> [!NOTE]
> The managed developer portal receives and applies updates automatically. Changes that you've saved but not published to the developer portal remain in that state during an update.

## <a name="managed-vs-self-hosted"></a> Extensibility

In some cases you might need functionality beyond the customization and styling options supported in the managed developer portal.  If you need to implement custom logic, which isn't supported out-of-the-box, you can modify the portal's codebase, available on [GitHub](https://github.com/Azure/api-management-developer-portal). For example, you could create a new widget to integrate with a third-party support system. When you implement new functionality, you can choose one of the following options:

- **Self-host** the resulting portal outside of your API Management service. When you self-host the portal, you become its maintainer and you are responsible for its upgrades. Azure Support's assistance is limited only to the [basic setup of self-hosted portals](developer-portal-self-host.md).
- Open a pull request for the API Management team to merge new functionality to the **managed** portal's codebase.

For extensibility details and instructions, refer to the [GitHub repository](https://github.com/Azure/api-management-developer-portal) and the tutorial to [implement a widget](developer-portal-implement-widgets.md). The tutorial to [customize the managed portal](api-management-howto-developer-portal-customize.md) walks you through the portal's administrative panel, which is common for **managed** and **self-hosted** versions.


## Next steps

Learn more about the developer portal:

- [Access and customize the managed developer portal](api-management-howto-developer-portal-customize.md)
- [Set up self-hosted version of the portal](developer-portal-self-host.md)
- [Implement your own widget](developer-portal-implement-widgets.md)

Browse other resources:

- [GitHub repository with the source code](https://github.com/Azure/api-management-developer-portal)
- [Frequently asked questions about the developer portal](developer-portal-faq.md)
