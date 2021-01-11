---
title: include file
description: include file
services: active-directory
documentationcenter: dev-center-name
author: jmprieur
manager: CelesteDG
editor: ''

ms.service: active-directory
ms.devlang: na
ms.topic: include
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 05/07/2019
ms.author: jmprieur
ms.custom: include file
---

## Enable logging

To help in debugging and authentication failure troubleshooting scenarios, the Microsoft Authentication Library provides built-in logging support. Logging is each library is covered in the following articles:

:::row:::
    :::column:::
        - [Logging in MSAL.NET](msal-logging-dotnet.md)
        - [Logging in MSAL for Android](msal-logging-android.md)
        - [Logging in MSAL.js](msal-logging-js.md)
    :::column-end:::
    :::column:::
        - [Logging in MSAL for iOS/macOS](msal-logging-ios.md)
        - [Logging in MSAL for Java](msal-logging-java.md)
        - [Logging in MSAL for Python](msal-logging-python.md)
    :::column-end:::
:::row-end:::

## Test your integration

Test your integration by following the [Microsoft identity platform integration checklist](identity-platform-integration-checklist.md).
Make your application great:

- Enable [logging](../articles/active-directory/develop/msal-logging.md).
- Enable telemetry.
- Enable [proxies and customize HTTP clients](../articles/active-directory/develop/msal-net-provide-httpclient.md).

Test your integration:

- Use the [integration checklist for Microsoft identity platform](../articles/active-directory/develop/identity-platform-integration-checklist.md).
