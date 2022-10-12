---
title: Azure API Management access restriction policies | Microsoft Docs
description: Reference for the access restriction policies available for use in Azure API Management. 
services: api-management
documentationcenter: ''
author: dlepow

ms.service: api-management
ms.topic: reference
ms.date: 09/28/2022
ms.author: danlep
---

# API Management access restriction policies

This article provides a reference for API Management access restriction policies. 

[!INCLUDE [api-management-policy-intro-links](../../includes/api-management-policy-intro-links.md)]


-   [Check HTTP header](check-header-policy.md) - Enforces existence and/or value of an HTTP header.
- [Get authorization context](get-authorization-context-policy.md) - Gets the authorization context of a specified [authorization](authorizations-overview.md) configured in the API Management instance.
-   [Limit call rate by subscription](rate-limit-policy.md) - Prevents API usage spikes by limiting call rate, on a per subscription basis.
-   [Limit call rate by key](rate-limit-by-key-policy.md) - Prevents API usage spikes by limiting call rate, on a per key basis.
-   [Restrict caller IPs](ip-filter-policy.md) - Filters (allows/denies) calls from specific IP addresses and/or address ranges.
-   [Set usage quota by subscription](quota-policy.md) - Allows you to enforce a renewable or lifetime call volume and/or bandwidth quota, on a per subscription basis.
-   [Set usage quota by key](quota-by-key-policy.md) - Allows you to enforce a renewable or lifetime call volume and/or bandwidth quota, on a per key basis.
-   [Validate JWT](validate-jwt-policy.md) - Enforces existence and validity of a JWT extracted from either a specified HTTP header or a specified query parameter.
-  [Validate client certificate](validate-client-certificate-policy.md) - Enforces that a certificate presented by a client to an API Management instance matches specified validation rules and claims.

> [!TIP]
> You can use access restriction policies in different scopes for different purposes. For example, you can secure the whole API with AAD authentication by applying the `validate-jwt` policy on the API level or you can apply it on the API operation level and use `claims` for more granular control.

[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]
