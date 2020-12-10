---
title: Architectural concepts
titleSuffix: Azure API Management
description: "Learn about these two portal architectural components: code and content."
author: erikadoyle
ms.author: apimpm
ms.date: 11/30/2020
ms.service: api-management
ms.topic: how-to
---

# Portal architectural concepts

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

## Next steps

- Review the [FAQs](dev-portal-faq.md).
