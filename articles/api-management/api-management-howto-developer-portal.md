---
title: Overview of Azure API Management developer portal - Azure API Management | Microsoft Docs
description: Learn about the developer portal in API Management.
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

Developer portal is an automatically generated, fully customizable website with the documentation of your APIs. It is where API consumers can discover your APIs, learn how to use them, request access, and try them out.

This article describes the differences between self-hosted and managed versions of the developer portal in API Management. It also explains its architecture and provides answers to frequently asked questions.

> [!IMPORTANT]
> [Learn how to migrate from the preview version to the generally available version](#preview-to-ga) of the developer portal.

![API Management developer portal](media/api-management-howto-developer-portal/cover.png)

[!INCLUDE [premium-dev-standard-basic.md](../../includes/api-management-availability-premium-dev-standard-basic.md)]

## <a name="managed-vs-self-hosted"></a> Managed and self-hosted versions

You can build your developer portal in two ways:

- **Managed version** - by editing and customizing the portal, which is built into your API Management instance and is accessible through the URL `<your-api-management-instance-name>.developer.azure-api.net`. Refer to [this documentation article](api-management-howto-developer-portal-customize.md) to learn how to access and customize the managed portal.
- **Self-hosted version** - by deploying and self-hosting your portal outside of an API Management instance. This approach allows you to edit the portal's codebase and extend the provided core functionality. You also need to upgrade the portal to the latest version yourself. For details and instructions, refer to the [GitHub repository with the source code of the portal][1]. The [tutorial for the managed version](api-management-howto-developer-portal-customize.md) walks through the portal's administrative panel, which is also featured in the self-hosted version.

## Portal architectural concepts

The portal components can be logically divided into two categories: *code* and *content*.

*Code* is maintained in [the GitHub repository][1] and includes:

- Widgets - which represent visual elements and combine HTML, JavaScript, styling ability, settings, and content mapping. Examples are an image, a text paragraph, a form, a list of APIs etc.
- Styling definitions - which specify how widgets can be styled
- Engine - which generates static webpages from portal content and is written in JavaScript
- Visual editor - which allows for in-browser customization and authoring experience

*Content* is divided into two subcategories: *portal content* and *API Management content*.

*Portal content* is specific to the portal and includes:

- Pages - for example, landing page, API tutorials, blog posts
- Media - images, animations, and other file-based content
- Layouts - templates, which are matched against a URL and define how pages are displayed
- Styles - values for styling definitions, e.g. fonts, colors, borders
- Settings - configuration, e.g. favicon, website metadata

*Portal content*, except for media, is expressed as JSON documents.

*API Management content* includes entities such as APIs, Operations, Products, Subscriptions.

The portal is based on an adapted fork of the [Paperbits framework](https://paperbits.io/). The original Paperbits functionality has been extended to provide API Management-specific widgets (e.g., a list of APIs, a list of Products) and a connector to API Management service for saving and retrieving content.

## <a name="faq"></a> Frequently asked questions

In this section, we answer common questions about the new developer portal, which are of general nature. For questions specific to the self-hosted version, refer to [the wiki section of the GitHub repository](https://github.com/Azure/api-management-developer-portal/wiki).

### <a id="preview-to-ga"/> How can I migrate from the preview version of the portal?

By using the preview version of the developer portal, you provisioned the preview content in your API Management service. The default content has been significantly modified in the generally available version for better user experience. It also includes new widgets.

If you're using the managed version, reset the content of the portal by clicking **Reset content** in the **Operations** menu section. Confirming this operation will remove all the content of the portal and provision the new default content. The portal's engine has been automatically updated in your API Management service.

![Reset portal content](media/api-management-howto-developer-portal/reset-content.png)

If you're using the self-hosted version, use the `scripts/cleanup.bat` and `scripts/generate.bat` from the GitHub repository to remove existing content and provision new content. Make sure you upgrade your portal's code to the latest release from the GitHub repository beforehand.

If you don't want to reset the content of the portal, you may consider using newly available widgets throughout your pages. Existing widgets have been automatically updated to the latest versions.

If your portal was provisioned after the general availability announcement, it should already feature the new default content. No action is required from your side.

### How can I migrate from the old developer portal to the new developer portal?

Portals are incompatible and you need to migrate the content manually.

### Does the new portal have all the features of the old portal?

The new developer portal doesn't support *Applications* and *Issues*. If you have used *Issues* in the old portal and need them in the new one, post a comment in [a dedicated GitHub issue](https://github.com/Azure/api-management-developer-portal/issues/122).

### Has the old portal been deprecated?

The old developer and publisher portals are now *legacy* features - they will be receiving security updates only. New features will be implemented in the new developer portal only.

Deprecation of the legacy portals will be announced separately. If you have questions, concerns, or comments, raise them [in a dedicated GitHub issue](https://github.com/Azure/api-management-developer-portal/issues/121).

### How can I automate portal deployments?

You can programmatically access and manage the developer portal's content through the REST API, regardless if you're using a managed or a self-hosted version.

The API is documented in [the GitHub repository's wiki section][2]. It can also be used for automating migrations of portal content between environments - for example from a test environment to the production environment. You can learn more about this process [in this documentation article](https://aka.ms/apimdocs/migrateportal) on GitHub.

### Does the portal support Azure Resource Manager templates and/or is it compatible with API Management DevOps Resource Kit?

No.

### Do I need to enable additional VNET connectivity for the managed portal dependencies?

No.

### I'm getting a CORS error when using the interactive console. What should I do?

The interactive console makes a client-side API request from the browser. You can resolve the CORS problem by adding [a CORS policy](https://docs.microsoft.com/azure/api-management/api-management-cross-domain-policies#CORS) on your API(s). You can either specify all the parameters manually (for example, origin as https://contoso.com) or use a wildcard `*` value.

## Next steps

Learn more about the new developer portal:

- [Access and customize the managed developer portal](api-management-howto-developer-portal-customize.md)
- [Set up self-hosted version of the portal][2]

Browse other resources:

- [GitHub repository with the source code][1]
- [Public roadmap of the project][3]

[1]: https://aka.ms/apimdevportal
[2]: https://github.com/Azure/api-management-developer-portal/wiki
[3]: https://github.com/Azure/api-management-developer-portal/projects