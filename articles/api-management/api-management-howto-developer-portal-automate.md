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

The developer portal supports programmatic access to content. This article explains where to find more information on this topic.

## <a name="prerequisites"></a> Prerequisites

- Read the [Azure API Management developer portal overview](api-management-howto-developer-portal.md)
- Complete the following quickstart: [Create an Azure API Management instance](get-started-create-service-instance.md)
- Import and publish an Azure API Management instance. For more information, see [Import and publish](import-and-publish.md)
- Complete the [Access and customize the managed developer portal in Azure API Management](api-management-howto-developer-portal-customize.md) tutorial

[!INCLUDE [premium-dev-standard-basic.md](../../includes/api-management-availability-premium-dev-standard-basic.md)]

## Automating portal deployments

You can programmatically access and manage the developer portal's content through the REST API, regardless if you're using a managed or a self-hosted portal.

The API is documented in [the GitHub repository's wiki section][2]. It can also be used for automating migrations of portal content between environments - for example from a test environment to the production environment. You can learn more about this process [in the migration documentation article](https://aka.ms/apimdocs/migrateportal) on GitHub.
 
## Next steps

Learn more about the new developer portal:

- [GitHub repository with the source code][1]
- [Instructions on self-hosting the portal and portal API reference][2]
- [Public roadmap of the project][3]

[1]: https://aka.ms/apimdevportal
[2]: https://github.com/Azure/api-management-developer-portal/wiki
[3]: https://github.com/Azure/api-management-developer-portal/projects