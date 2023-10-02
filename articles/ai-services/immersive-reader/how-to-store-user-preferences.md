---
title: "Store user preferences"
titleSuffix: Azure AI services
description: This article will show you how to store the user's preferences.
author: rwallerms
manager: nitinme

ms.service: azure-ai-immersive-reader
ms.topic: how-to
ms.date: 06/29/2020
ms.author: rwaller
---

# How to store user preferences

This article demonstrates how to store the user's UI settings, formally known as **user preferences**, via the [-preferences](./reference.md#options) and [-onPreferencesChanged](./reference.md#options) Immersive Reader SDK options.

When the [CookiePolicy](./reference.md#cookiepolicy-options) SDK option is set to *Enabled*, the Immersive Reader application stores the **user preferences** (text size, theme color, font, and so on) in cookies, which are local to a specific browser and device. Each time the user launches the Immersive Reader on the same browser and device, it will open with the user's preferences from their last session on that device. However, if the user opens the Immersive Reader on a different browser or device, the settings will initially be configured with the Immersive Reader's default settings, and the user will have to set their preferences again, and so on for each device they use. The `-preferences` and `-onPreferencesChanged` Immersive Reader SDK options provide a way for applications to roam a user's preferences across various browsers and devices, so that the user has a consistent experience wherever they use the application.

First, by supplying the `-onPreferencesChanged` callback SDK option when launching the Immersive Reader application, the Immersive Reader will send a `-preferences` string back to the host application each time the user changes their preferences during the Immersive Reader session. The host application is then responsible for storing the user preferences in their own system. Then, when that same user launches the Immersive Reader again, the host application can retrieve that user's preferences from storage, and supply them as the `-preferences` string SDK option when launching the Immersive Reader application, so that the user's preferences are restored.

This functionality may be used as an alternate means to storing **user preferences** in the case where using cookies is not desirable or feasible.

> [!CAUTION]
> **IMPORTANT** Do not attempt to programmatically change the values of the `-preferences` string sent to and from the Immersive Reader application as this may cause unexpected behavior resulting in a degraded user experience for your customers. Host applications should never assign a custom value to or manipulate the `-preferences` string. When using the `-preferences` string option, use only the exact value that was returned from the `-onPreferencesChanged` callback option.

## How to enable storing user preferences

the Immersive Reader SDK [launchAsync](./reference.md#launchasync) `options` parameter contains the `-onPreferencesChanged` callback. This function will be called anytime the user changes their preferences. The `value` parameter contains a string, which represents the user's current preferences. This string is then stored, for that user, by the host application.

```typescript
const options = {
    onPreferencesChanged: (value: string) => {
        // Store user preferences here
    }
};

ImmersiveReader.launchAsync(YOUR_TOKEN, YOUR_SUBDOMAIN, YOUR_DATA, options);
```

## How to load user preferences into the Immersive Reader

Pass in the user's preferences to the Immersive Reader using the `-preferences` option. A trivial example to store and load the user's preferences is as follows:

```typescript
const storedUserPreferences = localStorage.getItem("USER_PREFERENCES");
let userPreferences = storedUserPreferences === null ? null : storedUserPreferences;
const options = {
    preferences: userPreferences,
    onPreferencesChanged: (value: string) => {
        userPreferences = value;
        localStorage.setItem("USER_PREFERENCES", userPreferences);
    }
};
```

## Next steps

* Explore the [Immersive Reader SDK Reference](./reference.md)
