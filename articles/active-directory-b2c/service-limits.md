---
title: Azure AD B2C service limits and restrictions
titleSuffix: Azure AD B2C
description: Reference for service limits and restrictions for Azure Active Directory B2C service.
services: active-directory-b2c
author: msmimart
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: reference
ms.date: 06/02/2021
ms.author: mimart
ms.subservice: B2C
---

# Azure Active Directory B2C service limits and restrictions

This article contains the usage constraints and other service limits for the Azure Active Directory B2C (Azure AD B2C) service.

## End user/consumption related limits

The following end-user related service limits apply to all authentication and authorization protocols supported by Azure AD B2C, including SAML, Open ID Connect, OAuth2, and ROPC.

|Category |Limit    |
|---------|---------|
|Number of requests per IP address per Azure AD B2C tenant       |6,000/5min          |
|Total number of requests per Azure AD B2C tenant     |12,000/min          |

The number of requests can vary depending on the number of directory reads and writes that occur during the Azure AD B2C user journey. For example, a simple sign-in journey that reads from the directory consists of 1 request. If the sign-in journey must also update the directory, this operation is counted as an additional request.

## Azure AD B2C configuration limits

The following table lists the administrative configuration limits in the Azure AD B2C service.

|Category  |Limit  |
|---------|---------|
|Number of scopes per application        |1000          |
|Number of [custom attributes](user-profile-attributes.md#extension-attributes) per user <sup>1</sup>       |100         |
|Number of redirect URLs per application       |100         |
|Number of sign out URLs per application        |1          |
|String Limit per Attribute      |250 Chars          |
|Number of B2C tenants per subscription      |20         |
|Levels of [inheritance](custom-policy-overview.md#inheritance-model) in custom policies     |10         |
|Number of policies per Azure AD B2C tenant      |200          |
|Maximum policy file size      |400 KB          |

<sup>1</sup> See also [Azure AD service limits and restrictions](../active-directory/enterprise-users/directory-service-limits-restrictions.md).

## Next steps

- Learn about [Microsoft Graph’s throttling guidance](/graph/throttling) 
- Learn about the [validation differences for Azure AD B2C applications](../active-directory/develop/supported-accounts-validation.md)
