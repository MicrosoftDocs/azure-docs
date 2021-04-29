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
        - [Logging in MSAL.NET](../articles/active-directory/develop/msal-logging-dotnet.md)
        - [Logging in MSAL for Android](../articles/active-directory/develop/msal-logging-android.md)
        - [Logging in MSAL.js](../articles/active-directory/develop/msal-logging-js.md)
    :::column-end:::
    :::column:::
        - [Logging in MSAL for iOS/macOS](../articles/active-directory/develop/msal-logging-ios.md)
        - [Logging in MSAL for Java](../articles/active-directory/develop/msal-logging-java.md)
        - [Logging in MSAL for Python](../articles/active-directory/develop/msal-logging-python.md)
    :::column-end:::
:::row-end:::

Here are some suggestions for data collection:

- Users might ask for help when they have problems. A best practice is to capture and temporarily store logs. Provide a location where users can upload the logs. MSAL provides logging extensions to capture detailed information about authentication.

- If telemetry is available, enable it through MSAL to gather data about how users sign in to your app.


## Validate your integration

Test your integration by following the [Microsoft identity platform integration checklist](../articles/active-directory/develop/identity-platform-integration-checklist.md).

## Build for resilience

Learn how to increase resiliency in your app. For details, see [Increase resilience of authentication and authorization applications you develop](../articles/active-directory/fundamentals/resilience-app-development-overview.md)
