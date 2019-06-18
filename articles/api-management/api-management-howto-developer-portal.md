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
ms.devlang: na
ms.topic: article
ms.date: 06/12/2019
ms.author: apimpm
---

# Access and customize the new developer portal in Azure API Management

This article shows you how to access the new Azure API Management developer portal. It walks you through the visual editor experience - adding and editing content - as well as customizing the look of the website.

![New API Management developer portal](media/api-management-howto-developer-portal/cover.png)

## Prerequisites

- Complete the following quickstart: [Create an Azure API Management instance](get-started-create-service-instance.md).
- Import and publish an Azure API Management instance. For more information, see [Import and publish](import-and-publish.md).

[!INCLUDE [premium-dev-standard-basic.md](../../includes/api-management-availability-premium-dev-standard-basic.md)]

> [!NOTE]
> The new developer portal is currently in preview.

## Managed and self-hosted versions

You can build your developer portal in two ways:

- **Managed version** - by editing and customizing the portal built-into your API Management instance and accessible through the URL `<your-api-management-instance-name>.developer.azure-api.net`.
- **Self-hosted version** - by deploying and self-hosting your portal outside of an API Management instance. This approach allows you to edit the portal's codebase and extend the provided core functionality. For details and instructions, refer to the [GitHub repository with the source code of the portal][1].

## Access the managed version of the portal

Follow the steps below to access the managed version of the portal.

1. Go to your API Management service instance in the Azure portal.
1. Click on the **New developer portal (preview)** button in the top navigation bar. A new browser tab with an administrative version of the portal will open. If you're accessing the portal for the first time, the default content will be automatically provisioned.

## Edit and customize the managed version of the portal

In the video below we demonstrate how to edit the content of the portal, customize the website's look, and publish the changes.

> [!VIDEO https://www.youtube.com/embed/5mMtUSmfUlw]

## Next steps

Learn more about the new developer portal:

- [GitHub repository with the source code][1]
- [Instructions on self-hosting the portal][2]
- [Public roadmap of the project][3]

[1]: https://aka.ms/apimdevportal
[2]: https://github.com/Azure/api-management-developer-portal/wiki
[3]: https://github.com/Azure/api-management-developer-portal/projects