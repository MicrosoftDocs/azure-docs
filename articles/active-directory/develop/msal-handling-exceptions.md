---
title: Claims challenge exceptions (MSAL.NET) | Azure
description: Learn how to handle claims challenge exceptions in MSAL.NET applications.
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
---

## Handling exceptions and errors using MSAL:
Exceptions in Microsoft Authentication Library (MSAL) are intended for app developers to troubleshoot and not for displaying to end-users. Exception messages are not localized.

When processing exceptions and errors, you can use the exception type itself and the error code to distinguish between exceptions.  For a list of error codes, see [Authentication and authorization error codes](reference-aadsts-error-codes.md).

### .NET
When processing exceptions, you can use the exception type itself and the `ErrorCode` member to distinguish between exceptions. The values of `ErrorCode` are constants of type [MsalError](/dotnet/api/microsoft.identity.client.msalerror?view=azure-dotnet#fields).

You can also have a look at the fields of [MsalClientException](/dotnet/api/microsoft.identity.client.msalexception?view=azure-dotnet#fields), [MsalServiceException](/dotnet/api/microsoft.identity.client.msalserviceexception?view=azure-dotnet#fields), [MsalUIRequiredException](/dotnet/api/microsoft.identity.client.msaluirequiredexception?view=azure-dotnet#fields).

In the case of `MsalServiceException`, the error code might contain a code which you can find in [Authentication and authorization error codes](reference-aadsts-error-codes.md).

## Handling conditional access and claims challenges
When getting tokens silently, your application may receive errors when a [conditional access claims challenge](conditional-access-dev-guide.md#scenario-single-page-app-spa-using-adaljs) such as MFA policy is required by an API you are trying to access.

The pattern to handle this error is to interactively aquire a token using MSAL. This prompts the user and gives them the opportunity to satisfy the required CA policy.

For examples, see how to handle claims challenge exceptions using [MSAL JS](msaljs-handle-conditional-access.md).

In certain cases when calling an API requiring conditional access, you can receive a claims challenge in the error from the API. For instance if the conditional access policy is to have a managed device (Intune) the error will be something like [AADSTS53000: Your device is required to be managed to access this resource](reference-aadsts-error-codes.md) or something similar. In this case, you can pass the claims in the acquire token call so that the user is prompted to satisfy the appropriate policy.

### .NET
When calling an API requiring conditional access from MSAL.NET, your application will need to handle claim challenge exceptions. This will appear as an `MsalServiceException` where the `Claims` property won't be empty. 

To handle the claim challenge, you will need to use the `.WithClaim()` method of the `PublicClientApplicationBuilder` class.

### JavaScript
When getting tokens silently (using `acquireTokenSilent`) using MSAL.js, your application may receive errors when a [conditional access claims challenge](conditional-access-dev-guide.md#scenario-single-page-app-spa-using-adaljs) such as MFA policy is required by an API you are trying to access.

The pattern to handle this error is to make an interactive `acquireToken` call in MSAL.js such as `acquireTokenPopup` or `acquireTokenRedirect` as in the following example:

```javascript
this.acquireTokenSilent(applicationConfig.graphScopes).then(function (accessToken) {
    updateUI();
}, function (error) {
    console.log(error);
    this.acquireTokenPopup(applicationConfig.graphScopes).then(function (accessToken) {
        updateUI();
    }, function (error) {
        console.log(error);
    });
});
```

This prompts the user and gives them the opportunity to satisfy the required CA policy.

When calling an API requiring conditional access, you can receive a claims challenge in the error from the API. In this case, you can pass the claims as `extraQueryParameters` in the `acquireToken` call so that the user is prompted to satisfy the appropriate policy:

```javascript
acquireTokenPopup(applicationConfig.graphScopes, null, null, "&claims=" + claims);
```
