---
title: "Set Immersive Reader Cookie Policy"
titleSuffix: Azure AI services
description: This article will show you how to set the cookie policy for the Immersive Reader.
services: cognitive-services
author: rwallerms
manager: nitinme

ms.service: azure-ai-immersive-reader
ms.topic: how-to
ms.date: 01/06/2020
ms.author: rwaller
ms.custom:
---

# How to set the cookie policy for the Immersive Reader

The Immersive Reader will disable cookie usage by default. If you enable cookie usage, then the Immersive Reader may use cookies to maintain user preferences and track feature usage. If you enable cookie usage in the Immersive Reader, please consider the requirements of EU Cookie Compliance Policy. It is the responsibility of the host application to obtain any necessary user consent in accordance with EU Cookie Compliance Policy.

The cookie policy can be set through the Immersive Reader [options](../reference.md#options).

## Enable Cookie Usage

```javascript
var options = {
    'cookiePolicy': ImmersiveReader.CookiePolicy.Enable
};

ImmersiveReader.launchAsync(YOUR_TOKEN, YOUR_SUBDOMAIN, YOUR_DATA, options);
```

## Disable Cookie Usage

```javascript
var options = {
    'cookiePolicy': ImmersiveReader.CookiePolicy.Disable
};

ImmersiveReader.launchAsync(YOUR_TOKEN, YOUR_SUBDOMAIN, YOUR_DATA, options);
```

## Next steps

* View the [Node.js quickstart](../quickstarts/client-libraries.md?pivots=programming-language-nodejs) to see what else you can do with the Immersive Reader SDK using Node.js
* View the [Android tutorial](../how-to-launch-immersive-reader.md) to see what else you can do with the Immersive Reader SDK using Java or Kotlin for Android
* View the [iOS tutorial](../how-to-launch-immersive-reader.md) to see what else you can do with the Immersive Reader SDK using Swift for iOS
* View the [Python tutorial](../how-to-launch-immersive-reader.md) to see what else you can do with the Immersive Reader SDK using Python
* Explore the [Immersive Reader SDK](https://github.com/microsoft/immersive-reader-sdk) and the [Immersive Reader SDK Reference](../reference.md)
