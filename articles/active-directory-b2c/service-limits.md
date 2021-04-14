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
ms.date: 04/08/2021
ms.author: mimart
ms.subservice: B2C
---

# Azure Active Directory B2C service limits and restrictions

This article contains the usage constraints and other service limits for the Azure Active Directory B2C (Azure AD B2C) service.

## End user/consumption related limits

The following end-user related service limits apply to all authentication requests to Azure AD B2C. Below illustrates the peak token issuances per journey type.

|User Journey      | Limit    |
|---------|---------|
|Sign in  | 12,000/min |
|Sign up  | 7,680/min |
|Password reset  | 12,000/min|
|Profile edit  | 12,000/min|

When multiple User Journey's are in use, they contribute to the overall limits below.

|Category     | Limit    |
|---------|---------|
|Number of requests per IP address per Azure AD B2C tenant     |1,200/min          |
|Total number of requests per Azure AD B2C tenant   |12,000/min          |

Using the above limits, you can arrive at the following throughput for the **Combined Sign up or Sign in policy**:
- Perform Sign up's at a rate of 7,000/min
- Perform Sign in's at a rate of 5,000/min
- All authentications originate from a unique client IP address
- This will reach the total token issuance rate of 12,000/min


## Azure AD B2C configuration limits

The following table lists the administrative configuration limits in the Azure AD B2C service.

|Category  |Type  |Limit  |
|---------|---------|---------|
|String Limit per Attribute      |User|250 Chars          |
|Maximum number of `Identities` in a User Create operation      | User|7          |
|Number of scopes per application        |Application|1000          |
|Number of [custom attributes](user-profile-attributes.md#extension-attributes) per user <sup>1</sup>       |Application|100         |
|Number of redirect URLs per application       |Application|100         |
|Number of sign-out URLs per application        |Application|1          |
|Levels of policy [inheritance](custom-policy-overview.md#inheritance-model)     |Custom policy|10         |
|Maximum policy file size      |Custom policy|400 KB          |
|Number of B2C tenants per subscription      |Azure Subscription|20         |
|Number of policies per Azure AD B2C tenant      | Tenant|200          |

<sup>1</sup> See also [Azure AD service limits and restrictions](../active-directory/enterprise-users/directory-service-limits-restrictions.md).

## Next steps

- Learn about [Microsoft Graph’s throttling guidance](/graph/throttling) 
- Learn about the [validation differences for Azure AD B2C applications](../active-directory/develop/supported-accounts-validation.md)













