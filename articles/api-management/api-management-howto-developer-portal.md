---
title: Access and customize the new developer portal - Azure API Management | Microsoft Docs
description: Learn how to use the new developer portal in API Management.
services: api-management
documentationcenter: API Management
author: mikebudzynski
manager: cfowler
editor: ''

ms.service: api-management
ms.workload: mobile
ms.tgt_pltfrm: na
ms.topic: article
ms.date: 11/04/2019
ms.author: apimpm
---

# Azure API Management developer portal overview

Developer portal is an automatically generated, fully customizable website with the documentation of your APIs. It's a place, where API consumers can discover your APIs, learn how to use them, request access, and try them out interactively.

This article describes the differences between the self-hosted and managed versions of the developer portal in API Management. It also explains its architecture and provides answers to frequently asked questions.

![New API Management developer portal](media/api-management-howto-developer-portal/cover.png)

[!INCLUDE [premium-dev-standard-basic.md](../../includes/api-management-availability-premium-dev-standard-basic.md)]

## <a name="managed-vs-self-hosted"></a> Managed and self-hosted versions

You can build your developer portal in two ways:

- **Managed version** - by editing and customizing the portal, which is built into your API Management instance and is accessible through the URL `<your-api-management-instance-name>.developer.azure-api.net`. Refer to [this documentation article](api-management-howto-developer-portal-customize.md) to learn how to access and customize the managed portal.
- **Self-hosted version** - by deploying and self-hosting your portal outside of an API Management instance. This approach allows you to edit the portal's codebase and extend the provided core functionality. For details and instructions, refer to the [GitHub repository with the source code of the portal][1].

## Architectural concepts

The portal components can be logically divided into two categories: *code* and *content*.

*Code* is maintained in [the GitHub repository][1] and includes:

- Widgets - which represent visual elements and combine HTML, JavaScript, styling ability, settings, and content mapping. Examples are an image, a text paragraph, a form, a list of APIs etc.
- Styling definitions - which specify how widgets can be styled
- Engine - which generates static webpages from portal content and is written in JavaScript
- Visual editor - which allows for in-browser customization and authoring experience

*Content* is divided into two subcategories: *portal content* and *API Management content*.

*Portal content* is specific to the portal and includes:

- Pages - for example, landing page, API tutorials, blog posts
- Media - images, animations and other file-based content
- Layouts - templates, which are matched against a URL and define how pages are displayed
- Styles - values for styling definitions, e.g. fonts, colors, borders
- Settings - configuration, e.g. favicon, website metadata

*Portal content*, except for media, is expressed as JSON documents.

*API Management content* includes entities such as APIs, Operations, Products, Subscriptions.

The portal is based on an adapted fork of the [Paperbits framework](http://paperbits.io/). The original Paperbits functionality has been extended to provide API Management-specific widgets (e.g., a list of APIs, a list of Products) and a connector to API Management service for saving and retrieving content.

## <a name="faq"></a> Frequently asked questions

In this section we answer common questions about the new developer portal, which are of general nature. For questions specific to the self-hosted version, refer to [the wiki section of the GitHub repository](https://github.com/Azure/api-management-developer-portal/wiki).

### How can I migrate from the old developer portal to the new one?

Portals are incompatible and the content needs to be migrated manually.

### Has the old portal been deprecated?

The old developer portal and publisher portal are now *legacy* features - they will be receiving security updates only and new features will be implemented in the new developer portal only.

Deprecation of the legacy portals will be announced separately. If you have questions, concerns, or comments, raise them [in a dedicated GitHub issue](https://github.com/Azure/api-management-developer-portal/issues/121).

### Does the new portal have all the features of the previous developer portal?

The new developer portal doesn't support *Applications* and *Issues*. If you have used *Issues* in the old portal and need them in the new one, post a comment in [a dedicated GitHub issue](https://github.com/Azure/api-management-developer-portal/issues/122).

### I've found bugs and/or I'd like to request a feature

You can **report bugs** through [the GitHub repository Issues section](https://github.com/Azure/api-management-developer-portal/issues).

If you'd like to provide feedback and help us shape the product, we're looking for your opinion on [the Issues marked with the `community` label](https://github.com/Azure/api-management-developer-portal/issues?q=is%3Aopen+is%3Aissue+label%3Acommunity).

**Feature requests** can be raised [on the Azure Feedback Forum for API Management](https://aka.ms/apimwish).

For **assistance requests**, you can submit a post [on Stack Overflow](http://aka.ms/apimso) or contact Azure support for help.

### Does the portal support ARM templates and/or is it compatible with API Management Dev-Ops Resource Kit?

No.

### Do I need to enable additional VNET connectivity for the managed portal dependencies?

No.

### I'm getting a CORS error when using the interactive console. What should I do?

The interactive console makes a client-side API request from the browser. You can resolve the CORS problem by adding [a CORS policy](https://docs.microsoft.com/azure/api-management/api-management-cross-domain-policies#CORS) on your API(s). You can either specify all the parameters manually (for example, origin as https://contoso.com) or use a wildcard `*` value.

## Next steps

Learn more about the new developer portal:

- [GitHub repository with the source code][1]
- [Instructions on self-hosting the portal and portal API reference][2]
- [Public roadmap of the project][3]

[1]: https://aka.ms/apimdevportal
[2]: https://github.com/Azure/api-management-developer-portal/wiki
[3]: https://github.com/Azure/api-management-developer-portal/projects