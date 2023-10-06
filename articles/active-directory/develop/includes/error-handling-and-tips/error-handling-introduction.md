---
author: cilwerner
ms.author: cwerner
ms.date: 11/25/2020
ms.service: active-directory
ms.subservice: develop
ms.topic: include
# Purpose:
# Ingested by Microsoft identity platform articles in /articles/active-directory/develop/* that document the error handling intro for the different platforms.
---
This article gives an overview of the different types of errors and recommendations for handling common sign-in errors.

## MSAL error handling basics

Exceptions in Microsoft Authentication Library (MSAL) are intended for app developers to troubleshoot, not for displaying to end users. Exception messages are not localized.

When processing exceptions and errors, you can use the exception type itself and the error code to distinguish between exceptions. For a list of error codes, see [Microsoft Entra authentication and authorization error codes](../../reference-error-codes.md).

During the sign-in experience, you may encounter errors about consents, Conditional Access (MFA, Device Management, Location-based restrictions), token issuance and redemption, and user properties.

The following section provides more details about error handling for your app.
