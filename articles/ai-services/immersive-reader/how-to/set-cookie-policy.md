---
title: "Set Immersive Reader cookie policy"
titleSuffix: Azure AI services
description: Learn how to set the cookie policy for the Immersive Reader app.
#services: cognitive-services
author: sharmas
manager: nitinme

ms.service: azure-ai-immersive-reader
ms.topic: how-to
ms.date: 02/26/2024
ms.author: sharmas
ms.custom:
---

# How to set the cookie policy for the Immersive Reader

The Immersive Reader disables cookie usage by default. If you enable cookie usage, then the Immersive Reader can use cookies to maintain user preferences and track feature usage. If you enable cookie usage in the Immersive Reader, consider the requirements of the EU Cookie Compliance Policy. It's the responsibility of the host application to obtain any necessary user consent in accordance with the EU Cookie Compliance Policy.

The cookie policy can be set through the Immersive Reader [options](../reference.md#options).

## Enable cookie usage

```javascript
const options = {
    'cookiePolicy': ImmersiveReader.CookiePolicy.Enable
};

ImmersiveReader.launchAsync(YOUR_TOKEN, YOUR_SUBDOMAIN, YOUR_DATA, options);
```

## Disable cookie usage

```javascript
const options = {
    'cookiePolicy': ImmersiveReader.CookiePolicy.Disable
};

ImmersiveReader.launchAsync(YOUR_TOKEN, YOUR_SUBDOMAIN, YOUR_DATA, options);
```

## Next step

> [!div class="nextstepaction"]
> [View the quickstart guides](../quickstarts/client-libraries.md?pivots=programming-language-nodejs)
