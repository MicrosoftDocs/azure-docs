---
title: Access and customize the managed developer portal - Azure API Management | Microsoft Docs
description: Learn how to use the managed version of the developer portal in API Management.
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

# Access and customize the managed developer portal

Developer portal is an automatically generated, fully customizable website with the documentation of your APIs. It is where API consumers can discover your APIs, learn how to use them, request access, and try them out.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Access the managed version of the developer portal
> * Navigate its administrative interface
> * Customize the content
> * Publish the changes
> * View the published portal

If you're looking for more information on the developer portal, refer to the [Azure API Management developer portal overview](api-management-howto-developer-portal.md).

![New API Management developer portal](media/api-management-howto-developer-portal/cover.png)

## Prerequisites

- Complete the following quickstart: [Create an Azure API Management instance](get-started-create-service-instance.md)
- Import and publish an Azure API Management instance. For more information, see [Import and publish](import-and-publish.md)

[!INCLUDE [premium-dev-standard-basic.md](../../includes/api-management-availability-premium-dev-standard-basic.md)]

## Step 1: access the portal as an administrator

Follow the steps below to access the managed version of the portal.

1. Go to your API Management service instance in the Azure portal.
1. Click on the **Developer portal** button in the top navigation bar. A new browser tab with an administrative version of the portal will open.

## Step 2: understand the portal's administrative interface

### Default content 

If you're accessing the portal for the first time, the default content will be automatically provisioned in the background. Default content has been designed to showcase portal's capabilities and minimize the amount of customizations you need to perform to personalize your portal. You can learn more about what is included in the portal content by reading the [Azure API Management developer portal overview](api-management-howto-developer-portal.md).

### Visual editor

You can customize the content of the portal with the visual editor. The menu sections on the left let you modify or create pages, media, layouts, menus, styles, or website settings. The menu items on the bottom let you switch between viewports (for example, mobile or desktop), view the elements of the portal visible to authenticated or anonymous users, or save or undo actions.

### Layouts and pages

TODO: image

Layouts define how pages are displayed. For example, in the default content, there are two layouts with top navigation bars and footers - one applies to the landing page, and the other to all other pages.

A layout gets applied to a page by matching its URL template to the page's URL. For example, layout with a URL template of `/wiki/*` will be applied to every page with the `/wiki/` segment: `/wiki/getting-started`, `/wiki/styles`, etc.

### Styling guide

TODO: image

Styling guide is a panel created with designers in mind. It allows for styling all the visual elements and creating their variants. 

### Save button

Whenever you make a change in the portal, you need to save it manually by pressing the **Save** button (floppy disk) in the menu on the bottom. When you click the button, the modified content is automatically uploaded to your API Management service.

### Demonstration

In the video below we demonstrate how to edit the content of the portal, customize the website's look, and publish the changes.

> [!VIDEO https://www.youtube.com/embed/5mMtUSmfUlw]

## Step 3: customize the default content

### Landing page

TODO

### Styles

TODO

### Locked-down pages

Due to integration considerations, the following pages can't be removed or moved under a different URL (but you can still customize them): 
TODO

## Step 4: publish the portal

TODO

## Step 5: visit the portal

TODO

## Next steps

Learn more about the developer portal:

- [Azure API Management developer portal overview](api-management-howto-developer-portal.md)