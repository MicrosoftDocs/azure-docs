---
title: Store user preferences for Immersive Reader
titleSuffix: Azure AI services
description: Learn how to store user preferences via the Immersive Reader SDK options.
author: sharmas
manager: nitinme

ms.service: azure-ai-immersive-reader
ms.topic: how-to
ms.date: 02/23/2024
ms.author: sharmas
---

# How to store user preferences

This article demonstrates how to store the user's UI settings, or *user preferences*, via the [-preferences](./reference.md#options) and [-onPreferencesChanged](./reference.md#options) Immersive Reader SDK options.

When the [CookiePolicy](./reference.md#cookiepolicy-options) SDK option is set to *Enabled*, the Immersive Reader application stores user preferences, such as text size, theme color, and font, by using cookies. These cookies are local to a specific browser and device. Each time the user launches the Immersive Reader on the same browser and device, it opens with the user's preferences from their last session on that device. However, if the user opens the Immersive Reader app on a different browser or device, the settings are initially configured with the Immersive Reader's default settings, and the user needs to set their preferences again for each device they use. The `-preferences` and `-onPreferencesChanged` Immersive Reader SDK options provide a way for applications to roam a user's preferences across various browsers and devices, so that the user has a consistent experience wherever they use the application.

First, by supplying the `-onPreferencesChanged` callback SDK option when launching the Immersive Reader application, the Immersive Reader sends a `-preferences` string back to the host application each time the user changes their preferences during the Immersive Reader session. The host application is then responsible for storing the user preferences in their own system. Then, when that same user launches the Immersive Reader again, the host application can retrieve that user's preferences from storage, and supply them as the `-preferences` string SDK option when launching the Immersive Reader application, so that the user's preferences are restored.

This functionality can be used as an alternate means to storing user preferences when using cookies isn't desirable or feasible.

> [!CAUTION]
> Don't attempt to programmatically change the values of the `-preferences` string sent to and from the Immersive Reader application because this might cause unexpected behavior resulting in a degraded user experience. Host applications should never assign a custom value to or manipulate the `-preferences` string. When using the `-preferences` string option, use only the exact value that was returned from the `-onPreferencesChanged` callback option.

## Enable storing user preferences

The Immersive Reader SDK [launchAsync](reference.md#function-launchasync) `options` parameter contains the `-onPreferencesChanged` callback. This function will be called anytime the user changes their preferences. The `value` parameter contains a string, which represents the user's current preferences. This string is then stored, for that user, by the host application.

```typescript
const options = {
    onPreferencesChanged: (value: string) => {
        // Store user preferences here
    }
};

ImmersiveReader.launchAsync(YOUR_TOKEN, YOUR_SUBDOMAIN, YOUR_DATA, options);
```

## Load user preferences

Pass in the user's preferences to the Immersive Reader app by using the `-preferences` option. A trivial example to store and load the user's preferences is as follows:

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

## Next step

> [!div class="nextstepaction"]
> [Explore the Immersive Reader SDK reference](reference.md)
