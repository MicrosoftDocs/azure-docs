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

This article demonstrates how to store the user's preferences. This functionality is meant as an alternate means to storing the user's preferences in the case where using cookies is not desirable or feasible.

## How to enable storing user preferences

The `options` parameter contains the `onPreferencesChanged` callback. This function will be called anytime the user changes their preferences (for example, they change the text size, theme color, font, and so on). The `value` parameter contains a string, which represents the user's current preferences. This string can be stored using whatever mechanism you prefer.

```typescript
const options = {
    onPreferencesChanged: (value: string) => {
        // Store user preferences here
    }
};

ImmersiveReader.launchAsync(YOUR_TOKEN, YOUR_SUBDOMAIN, YOUR_DATA, options);
```

## How to load user preferences into the Immersive Reader

Pass in the user's preferences to the Immersive Reader using the `preferences` parameter. A trivial example to store and load the user's preferences is as follows:

```typescript
let userPreferences = null;
const options = {
    preferences: userPreferences,
    onPreferencesChanged: (value: string) => {
        userPreferences = value;
    }
};
```

## Next steps

* Explore the [Immersive Reader SDK Reference](./reference.md)