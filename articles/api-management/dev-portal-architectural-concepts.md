---
title: "Architectural concepts - developer portal"
titleSuffix: Azure API Management
description: "Learn about these two portal architectural components: code and content."
author: erikadoyle
ms.author: apimpm
ms.date: 02/10/2021
ms.service: api-management
ms.topic: how-to
---

# Portal architectural concepts

The portal components can be logically divided into two categories: **Code** and **Content**.

## Code concept

**Code** is maintained in the GitHub repository and includes:

- Widgets - Represent visual elements and combine HTML, JavaScript, styling ability, settings, and content mapping. Examples include an image, a text paragraph, a form, a list of APIs, and so on.

- Styling definitions - Specify how widgets can be styled.

- Engine - Generates static webpages from portal content and is written in JavaScript.

- Visual editor - Allows for in-browser customization and authoring experience.

## Content concept

**Content** is divided into two subcategories: **Portal content** and **API Management content**.

**Portal content** is specific to the portal and includes:

   > [!NOTE]
   > **Portal content**, except for content in media files, is expressed as JSON documents.

- Pages - For example, landing page, API tutorials, blog posts.

- Media - Images, animations, and other file-based content.

- Layouts - Templates that are matched against a URL and define how pages are displayed.

- Styles - Values for styling definitions like fonts, colors, and borders.

- Settings - Configuration settings. For example, favicon, website metadata, and so on.

**API Management content** includes entities such as APIs, Operations, Products, Subscriptions.

## Next steps

- Review the [FAQs](dev-portal-faq.yml).
