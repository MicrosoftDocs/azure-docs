---
title: Automate developer portal deployments - Azure API Management | Microsoft Docs
description: Learn how to use DevOps processes to programmatically deploy the developer portal in API Management.
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

# Automate developer portal deployments

This article shows you how to access the managed version of the Azure API Management developer portal. It walks you through the visual editor experience - adding and editing content - as well as customizing the look of the website.

![New API Management developer portal](media/api-management-howto-developer-portal/cover.png)

## <a name="prerequisites"></a> Prerequisites

- Read the [Azure API Management developer portal overview](api-management-howto-developer-portal.md)
- [Access and customize the managed developer portal in Azure API Management](api-management-howto-developer-portal-customize.md)
- Complete the following quickstart: [Create an Azure API Management instance](get-started-create-service-instance.md)
- Import and publish an Azure API Management instance. For more information, see [Import and publish](import-and-publish.md)

[!INCLUDE [premium-dev-standard-basic.md](../../includes/api-management-availability-premium-dev-standard-basic.md)]

## Automating portal deployments

The portal supports DevOps scenarios in both managed and self-hosted versions. You can extract content through the management API of your API Management service. The APIs are documented [in the wiki section of the GitHub repository](https://github.com/Azure/api-management-developer-portal/wiki/). We have also written [a script](https://github.com/Azure/api-management-developer-portal/blob/master/scripts/migrate.bat), which might help you get started.

## Next steps

Learn more about the new developer portal:

- [GitHub repository with the source code][1]
- [Instructions on self-hosting the portal and portal API reference][2]
- [Public roadmap of the project][3]

[1]: https://aka.ms/apimdevportal
[2]: https://github.com/Azure/api-management-developer-portal/wiki
[3]: https://github.com/Azure/api-management-developer-portal/projects