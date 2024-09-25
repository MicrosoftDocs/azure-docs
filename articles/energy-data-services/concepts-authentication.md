---
title: Authentication concepts in Microsoft Azure Data Manager for Energy 
description: This article describes various concepts of authentication in Azure Data Manager for Energy.
author: shikhagarg1
ms.author: shikhagarg
ms.service: energy-data-services
ms.topic: conceptual
ms.date: 02/10/2023
ms.custom: template-concept
---

# Authentication concepts in Azure Data Manager for Energy

Authentication confirms the identity of users. The access flows can be user triggered, system triggered, or system API communication. In this article, you learn about service principals and authorization tokens.

## Service principals

In an Azure Data Manager for Energy instance:

- No service principals are created.
- The app ID is used for API access. The same app ID is used to provision an Azure Data Manager for Energy instance.
- The app ID doesn't have access to infrastructure resources.
- The app ID also gets added as OWNER to all OSDU groups by default.
- For service-to-service communication, Azure Data Manager for Energy uses Managed Service Identity.

In an OSDU instance:

- Terraform scripts create two service principals:
   - The first service principal is used for API access. It can also manage infrastructure resources.
   - The second service principal is used for service-to-service communications.

## Generate an authorization token

To generate the authorization token, follow the steps in [Generate auth token](how-to-generate-auth-token.md).
