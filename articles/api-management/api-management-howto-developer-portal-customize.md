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

This article shows you how to access the managed version of the Azure API Management developer portal. It walks you through the visual editor experience - adding and editing content - as well as customizing the look of the website.

![New API Management developer portal](media/api-management-howto-developer-portal/cover.png)

## Prerequisites

- Read the [Azure API Management developer portal overview](api-management-howto-developer-portal.md)
- Complete the following quickstart: [Create an Azure API Management instance](get-started-create-service-instance.md)
- Import and publish an Azure API Management instance. For more information, see [Import and publish](import-and-publish.md)

[!INCLUDE [premium-dev-standard-basic.md](../../includes/api-management-availability-premium-dev-standard-basic.md)]

## Access the managed version of the portal

Follow the steps below to access the managed version of the portal.

1. Go to your API Management service instance in the Azure portal.
1. Click on the **Developer portal** button in the top navigation bar. A new browser tab with an administrative version of the portal will open. If you're accessing the portal for the first time, the default content will be automatically provisioned.

## Edit and customize the portal

In the video below we demonstrate how to edit the content of the portal, customize the website's look, and publish the changes.

> [!VIDEO https://www.youtube.com/embed/5mMtUSmfUlw]

> [!TIP]
> A *layout* gets applied to a page by matching its URL template to the *page's* URL. For example, *layout* with a URL template of `/wiki/*` will be applied to every *page* with the `/wiki/` segment: `/wiki/getting-started`, `/wiki/styles`, and so on.

> [!NOTE]
> Due to integration considerations, the following pages can't be removed or moved under a different URL (but you can still customize them): 
> `TODO`

## Publish the portal

TODO

## Next steps

Learn more about the new developer portal:

- [GitHub repository with the source code][1]
- [Instructions on self-hosting the portal and portal API reference][2]
- [Public roadmap of the project][3]

[1]: https://aka.ms/apimdevportal
[2]: https://github.com/Azure/api-management-developer-portal/wiki
[3]: https://github.com/Azure/api-management-developer-portal/projects