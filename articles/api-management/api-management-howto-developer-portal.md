---
title: Overview of the developer portal in Azure API Management
titleSuffix: Azure API Management
description: Learn about the developer portal in API Management - a customizable website, where API consumers can explore your APIs.
services: api-management
documentationcenter: API Management
author: mikebudzynski

ms.service: api-management
ms.topic: article
ms.date: 04/15/2021
ms.author: apimpm
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

## Customization and styling

The developer portal can be customized and styled through the built-in, drag-and-drop visual editor. See [this tutorial](api-management-howto-developer-portal-customize.md) for more details.

## <a name="managed-vs-self-hosted"></a> Extensibility

Your API Management service includes a built-in, always up-to-date, **managed** developer portal. You can access it from the Azure portal interface.

If you need to extend it with custom logic, which isn't supported out-of-the-box, you can modify its codebase. The portal's codebase is [available in a GitHub repository](https://github.com/Azure/api-management-developer-portal). For example, you could implement a new widget, which integrates with a third-party support system. When you implement new functionality, you can choose one of the following options:

- **Self-host** the resulting portal outside of your API Management service. When you self-host the portal, you become its maintainer and you are responsible for its upgrades. Azure Support's assistance is limited only to the [basic setup of self-hosted portals](developer-portal-self-host.md).
- Open a pull request for the API Management team to merge new functionality to the **managed** portal's codebase.

For extensibility details and instructions, refer to the [GitHub repository](https://github.com/Azure/api-management-developer-portal) and the tutorial to [implement a widget](developer-portal-implement-widgets.md). The tutorial to [customize the managed portal](api-management-howto-developer-portal-customize.md) walks you through the portal's administrative panel, which is common for **managed** and **self-hosted** versions.


## Next steps

Learn more about the new developer portal:

- [Access and customize the managed developer portal](api-management-howto-developer-portal-customize.md)
- [Set up self-hosted version of the portal](developer-portal-self-host.md)
- [Implement your own widget](developer-portal-implement-widgets.md)

Browse other resources:

- [GitHub repository with the source code](https://github.com/Azure/api-management-developer-portal)
- [Frequently asked questions about the developer portal](developer-portal-faq.md)
