---
title: Verify if a web browser is supported
titleSuffix: An Azure Communication Services how-to guide
description: Learn how to get current browser environment details using the Azure Communication Services Calling SDK for JavaScript 
author: sloanster
ms.author: micahvivion
ms.service: azure-communication-services
ms.subservice: calling
ms.topic: how-to 
ms.date: 05/18/2023
ms.custom: template-how-to, devx-track-js
#Customer intent: As a developer, I can verify that a browser an end user is trying to do a call on is supported by Azure Communication Services.
---

# How to verify if your application is running in a web browser supported by Azure Communication Services

There are many different browsers available in the market today, but not all of them can properly support audio and video calling. To determine if the browser your application is running on is a supported browser, you can use the `getEnvironmentInfo` to check for browser support.

A `CallClient` instance is required for this operation. When you have a `CallClient` instance, you can use the `getEnvironmentInfo` method on the `CallClient` instance to obtain details about the current environment of your app:


```javascript
const callClient = new CallClient(options);
const environmentInfo = await callClient.feature(Features.DebugInfo).getEnvironmentInfo();
```

The `getEnvironmentInfo` method asynchronously returns an object of type `EnvironmentInfo`.

- The `EnvironmentInfo` type is defined as:

```javascript
{
  environment: Environment;
  isSupportedPlatform: boolean;
  isSupportedBrowser: boolean;
  isSupportedBrowserVersion: boolean;
  isSupportedEnvironment: boolean;
}
```
- The `Environment` type within the `EnvironmentInfo` type is defined as:

```javascript
{
  platform: string;
  browser: string;
  browserVersion: string;
}
```

A supported environment is a combination of an operating system, a browser, and the minimum version required for that browser. For more information on the browsers that are supported, see [here](../../concepts/voice-video-calling/calling-sdk-features.md#javascript-calling-sdk-support-by-os-and-browser).
