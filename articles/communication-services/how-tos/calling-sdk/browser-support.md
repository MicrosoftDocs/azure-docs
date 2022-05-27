---
title: How to verify if your application is running on a environment supported by Azure Communication Services
description: Learn how to get current browser environment details using the Azure Communication Services Calling SDK for JavaScript 
author: micahvivion
ms.author: micahvivion
ms.date: 05/27/2022
ms.topic: include
ms.service: azure-communication-services
---

# How to verify if your applicaiton is running on a Web browser environment supported by Azure Communication Services

There are many different browsers available in the market today, but not all of them can properly support ACS audio and video calling. To determine if the browser your application is running on is a supported browser you can use the ACS method of getEnvironmentInfo to check for browser support

A CallClient instance is required for this operation. When you have a CallClient instance, you can use the getEnvironmentInfo method on the CallClient instance to obtain details about the current environment of your app.

Here's a JavaScript sample code:

```javascript
const callClient = new CallClient(options);
const environmentInfo = await callClient.getEnvironmentInfo();
```

The getEnvironmentInfo method asynchronously returns an object of type EnvironmentInfo.

- The EnvironmentInfo type is defined as:

```javascript
{
  environment: Environment;
  isSupportedPlatform: boolean;
  isSupportedBrowser: boolean;
  isSupportedBrowserVersion: boolean;
  isSupportedEnvironment: boolean;
}
```
- The Environment type within the EnvironmentInfo type is defined as:

```javascript
{
  platform: string;
  browser: string;
  browserVersion: string;
}
```

A supported environment is a combination of an operating system, a browser, and the minimum version required for that browser.

For more information about the environments currently supported by Azure Communication Services, see the [JavaScript Calling SDK support by OS and browser](../../../concepts/voice-video-calling/calling-sdk-features#javascript-calling-sdk-support-by-os-and-browser) section.
