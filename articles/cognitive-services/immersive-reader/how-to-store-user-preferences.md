---
title: "Store user preferences"
titleSuffix: Azure Cognitive Services
description: This article will show you how to store the user's preferences.
author: metanMSFT
manager: guillasi

ms.service: cognitive-services
ms.subservice: immersive-reader
ms.topic: conceptual
ms.date: 06/29/2020
ms.author: metan
---

# How to store user preferences

This article demonstrates how to store the user's UI settings, formally known as **user preferences** via the `preferences` option. The `preferences` option provides a way for applications to use their own mechanism to store a string that contains **user preferences** to be persisted across multiple sessions and devices. When the Immersive Reader SDK [launchAsync](./reference.md#launchasync) method is called its `preferences` option is assigned a value by its `onPreferencesChanged` callback option, is sent to the [Immersive Reader SDK](./reference.md), and ensures that **user preferences** (text size, theme color, font, and so on) are persisted. This functionality may also be used as an alternate means to storing **user preferences** in the case where using cookies is not desirable or feasible as it's the responsibility of the host application to obtain any necessary user consent in accordance with EU Cookie Compliance Policy. See [Cookie Policy Options](./reference.md#cookiepolicy-options).

> [!CAUTION]
> **IMPORTANT** Do not attempt to programmatically change the values of the `preferences` string sent to and from the Immersive Reader application as this may cause unexpected behavior resulting in a degraded user experience for your customers. Host applications should never assign a custom value to the `preferences` option, and should defer the assignment to the return value of the `onPreferencesChanged` callback option.

## How to enable storing user preferences

the Immersive Reader SDK [launchAsync](./reference.md#launchasync) `options` parameter contains the `onPreferencesChanged` callback. This function will be called anytime the user changes their preferences (for example, they change the text size, theme color, font, and so on). The `value` parameter contains a string, which represents the user's current preferences. This string can be stored using whatever mechanism you prefer.

```typescript
const options = {
    onPreferencesChanged: (value: string) => {
        // Store user preferences here
    }
};

ImmersiveReader.launchAsync(YOUR_TOKEN, YOUR_SUBDOMAIN, YOUR_DATA, options);
```

## How to load user preferences into the Immersive Reader

Pass in the user's preferences to the Immersive Reader using the `preferences` option. A trivial example to store and load the user's preferences is as follows:

```typescript
const ltPrefs = localStorage.getItem('USER_PREFERENCES');
let userPreferences = ltPrefs === null ? null : ltPrefs;
const options = {
    preferences: userPreferences,
    onPreferencesChanged: (value: string) => {
        userPreferences = value;
        localStorage.setItem('USER_PREFERENCES', userPreferences);
    }
};
```

## Next steps

* Explore the [Immersive Reader SDK Reference](./reference.md)