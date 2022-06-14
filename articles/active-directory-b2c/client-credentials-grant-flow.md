---
title: Set up OAuth 2.0 client credentials flow
titleSuffix: Azure AD B2C
description: Learn how to set up the OAuth 2.0 client credentials flow in Azure Active Directory B2C.
services: active-directory-b2c
author: kengaderdus
manager: CelesteDG

ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 06/14/2022
ms.custom: project-no-code
ms.author: kengaderdus
ms.subservice: B2C
zone_pivot_groups: b2c-policy-type
---

# Set up OAuth 2.0 client credentials flow in Azure Active Directory B2C

[!INCLUDE [active-directory-b2c-choose-user-flow-or-custom-policy](../../includes/active-directory-b2c-choose-user-flow-or-custom-policy.md)]

The OAuth 2.0 client credentials grant flow permits an app (confidential client) to use its own credentials, instead of impersonating a user, to authenticate when calling web resource, such as REST API. This type of grant is commonly used for server-to-server interactions that must run in the background, without immediate interaction with a user. These types of applications are often referred to as daemons or service accounts.
