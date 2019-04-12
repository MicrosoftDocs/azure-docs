---
title: Learn about Microsoft Authentication Library (MSAL) | Azure
description: Microsoft Authentication Library (MSAL) enables application developers to acquire tokens in order to call secured Web APIs. These Web APIs can be the Microsoft Graph, other Microsoft APIS, third party Web APIs, or your own Web API. MSAL supports multiple application architectures and platforms.
services: active-directory
documentationcenter: dev-center-name
author: rwike77
manager: celested
editor: ''

ms.service: active-directory
ms.subservice: develop
ms.devlang: na
ms.topic: overview
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 04/10/2019
ms.author: ryanwi
ms.reviewer: saeeda
ms.custom: aaddev
#Customer intent: As an application developer, I want to understand about the v2.0 endpoint and platform so I can decide if this platform meets my application development needs and requirements.
ms.collection: M365-identity-device-management
---

# Overview of Microsoft Authentication Library (MSAL)
Microsoft Authentication Library (MSAL) enables developers to acquire tokens in order to call secured Web APIs. These Web APIs can be the Microsoft Graph, other Microsoft APIS, 3rd party Web APIs, or your own Web API.

## Supported languages and frameworks

## Differences between ADAL and MSAL
MSAL integrates with the Azure AD v2.0 endpoint, whereas ADAL integrates with the Azure AD v1.0 endpoint. The v1.0 endpoint supports work accounts, but not personal accounts. The v2.0 endpoint is the unification of Microsoft personal accounts and work accounts into a single authentication system. Additionally, with MSAL you can also get authentications for Azure AD B2C.

For more specific information, read about the differences between [ADAL.NET and MSAL.NET](msal-compare-msaldotnet-and-adaldotnet.md) and [ADAL.js and MSAL.js](msal-compare-msaljs-and-adaljs.md).

## Ways to authenticate (interactive, integrated Windows, username/pw, device code flow)

## Acquiring and caching tokens

## Client applications

## Exceptions and errors
Exceptions in MSAL are intended for app developers to troubleshoot and not for displaying to end-users. Exception messages are not localized.

When processing exceptions and errors, you can use the exception type itself and the error code to distinguish between exceptions.  For a list of error codes, see [Authentication and authorization error codes](reference-aadsts-error-codes.md).

### Handling conditional access and claims challenges
When getting tokens silently, your application may receive errors when a [conditional access claims challenge](conditional-access-dev-guide.md#scenario-single-page-app-spa-using-adaljs) such as MFA policy is required by an API you are trying to access.

The pattern to handle this error is to interactively aquire a token using MSAL. This prompts the user and gives them the opportunity to satisfy the required CA policy.

For examples, see how to handle claims challenge exceptions using [MSAL JS](msaljs-handle-conditional-access.md).

In certain cases when calling an API requiring conditional access, you can receive a claims challenge in the error from the API. For instance if the conditional access policy is to have a managed device (Intune) the error will be something like [AADSTS53000: Your device is required to be managed to access this resource](reference-aadsts-error-codes.md) or something similar. In this case, you can pass the claims in the acquire token call so that the user is prompted to satisfy the appropriate policy.

For examples, see how to handle claims challenge exceptions using [MSAL.NET](msaldotnet-handle-claims-challenge.md) and [MSAL JS](msaljs-handle-claims-challenge.md).

## Single sign-on
## Prompt behavior
## Logging               


## Next steps
* Learn about the [application scenarios](v2-scenarios-overview.md) where you can use MSAL.