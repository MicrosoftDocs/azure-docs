---
title: Migrate away from using email claims for authorization
description: Learn how to migrate your application away from using insecure claims, such as email, for authorization purposes. 
services: active-directory
author: medhir

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.tgt_pltfrm: 
ms.workload: identity
ms.date: 05/11/2023
ms.author: medhir
ms.reviewer: 
ms.custom: 

---

# Migrate away from using email claims for authorization

This article is meant to provide guidance to developers whose applications are currently using a pattern where [unverified emails are used for authorization](). 

## Migrate applications to more secure configurations

You should never use mutable claims (such as `email`, `preferred_username`, etc) as identifiers to perform authorization checks or index users in a database. These values are re-usable and could expose your application to privilege escalation attacks. 

If your application is currently using a mutable value for indexing users, you should migrate to a globally unique identifier, such as the object ID (referred to as `oid` in the token claims). Doing so ensures that each user is indexed on a value that can't be re-used (or abused to impersonate another user). 


If your application uses email (or any other mutable claim) for authorization purposes, you should read through the [Secure applications and APIs by validating claims](./claims-validation) and implement the appropriate checks. 

## Short-term risk mitigation

To mitigate the risk of unauthorized access before updating application code, you can use the `replace_unverified_email_with_upn` property for the optional `email` claim, which replaces (or removes) email claims, depending on account type, according to the following table: 

| **User type** | **Replaced with** |
|---------------|-------------------|
| On Premise | Home tenant UPN |
| Cloud Managed | Home tenant UPN |
| Microsoft Account (MSA) | Email address the user signed up with |
| Email OTP | Email address the user signed up with |
| Social IDP: Google | Email address the user signed up with | 
| Social IDP: Facebook | Email claim isn't issued |
| Direct Fed | Email claim will not be issued |

Enabling `replace_unverified_email_with_upn` eliminates the most significant risk of cross-tenant privilege by ensuring authorization does not occur against an arbitrarily set email value.  It should be noted that while enabling this property prevents unauthorized access, it can also break access to users with unverified emails. Internal data suggests the overall percentage of users with unverified emails is low and this tradeoff is appropriate to secure applications in the short term. 

The `replace_unverified_email_with_upn` option is also documented under the documentation for [additional properties of optional claims](./active-directory-optional-claims.md#additional-properties-of-optional-claims).

Microsoft views enabling `replace_unverified_email_with_upn` mainly as a short-term risk mitigation strategy while migrating applications away from email claims, and **not as a permanent solution** for resolving account escalation risk related to email usage. 

