---
title: Understanding tokens, claims, endpoints in CIAM
description: Learn about tokens, claims, and endpoints in customer tenants.
services: active-directory
author: csmulligan
manager: celestedg
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: conceptual
ms.date: 03/09/2023
ms.author: cmulligan
ms.custom: it-pro

#Customer intent: As a dev, devops, or it admin, I want to learn about tokens, claims, and endpoints in customer tenants.
---
<!--   The content is mostly copied from https://learn.microsoft.com/en-us/azure/active-directory/develop/id-tokens . For now the text  is used as a placeholder in the release branch, until further notice. -->

# CIAM tenant ID tokens

The ID token is the core extension that OpenID Connect makes to OAuth 2.0. ID tokens are issued by the authorization server and contain claims that carry information about the user. They can be sent alongside or instead of an access token. Information in ID Tokens allows the client to verify that a user is who they claim to be. ID tokens are intended to be understood by third-party applications. ID tokens shouldn't be used for authorization purposes. Access tokens are used for authorization. The claims provided by ID tokens can be used for UX inside your application, as keys in a database, and providing access to the client application.

## Next steps
- [Planning for CIAM](concept-planning-your-solution.md)