---
title: "Immersive Reader SDK Reference"
titlesuffix: Azure Cognitive Services
description: Reference for the Immersive Reader SDK
services: cognitive-services
author: metanMSFT

ms.service: cognitive-services
ms.subservice: immersive-reader
ms.topic: reference
ms.date: 07/01/2019
ms.author: metan
---

# Immersive Reader SDK Reference

The Immersive Reader SDK is a JavaScript library that allows you to integrate the Immersive Reader into your web application.

## Functions

The SDK exposes a single function, `ImmersiveReader.launchAsync(token, data, options)`.

### launchAsync

Launches the Immersive Reader within an `iframe` in your web application.

```typescript
launchAsync(token: string, content: Content, options?: Options): Promise<HTMLDivElement>;
```

#### Parameters

| Name | Type | Description |
| ---- | ---- |------------ |
| `token` | string | The access token acquired from the call to the `issueToken` endpoint. |
| `content` | [Content](#content) | An object containing the content to be shown in the Immersive Reader. |
| `options` | [Options](#options) | Options for configuring certain behaviors of the Immersive Reader. Optional. |

#### Returns

Returns a `Promise<HTMLDivElement>` which resolves when the Immersive Reader is loaded. The `Promise` resolves to a `div` element whose only child is an `iframe` element that contains the Immersive Reader page.

#### Exceptions

The returned `Promise` will be rejected with an [`Error`](#error) object if the Immersive Reader fails to load. For more information, see the [error codes](#error-codes).

## Types

### Content

Contains the content to be shown in the Immersive Reader.

```typescript
{
    title?: string;      // Title text shown at the top of the Immersive Reader (optional)
    chunks: [ {          // Array of chunks
        content: string; // Plain text string
        lang?: string;   // Language of the text, e.g. en, es-ES (optional). Language will be detected automatically if not specified.
        mimeType?: string; // MIME type of the content (optional). Only 'text/plain' and 'application/mathml+xml' are supported. Defaults to 'text/plain' if not specified.
    } ];
}
```

### Options

Contains properties that configure certain behaviors of the Immersive Reader.

```typescript
{
    uiLang?: string;   // Language of the UI, e.g. en, es-ES (optional). Defaults to browser language if not specified.
    timeout?: number;  // Duration (in milliseconds) before launchAsync fails with a timeout error (default is 15000 ms).
    uiZIndex?: number; // Z-index of the iframe that will be created (default is 1000)
    useWebview?: boolean; // Use a webview tag instead of an iframe, for compatibility with Chrome Apps (default is false).
}
```

### Error

Contains information about the error.

```typescript
{
    code: string;    // One of a set of error codes
    message: string; // Human-readable representation of the error
}
```

#### Error Codes

| Code | Description |
| ---- | ----------- |
| BadArgument | Supplied argument is invalid, see `message` for details. |
| Timeout | The Immersive Reader failed to load within the specified timeout. |

## Launching the Immersive Reader

The Immersive Reader should be invoked in one of the following ways:

| Button Type | Example | Notes
|--|--|--|
| Text | Immersive Reader | Simple text button. Immersive Reader should be capitalized.
| Icon | ![Immersive Reader](./media/icon.png) | Button without text. Must include "Immersive Reader" as alt text.
| Icon with text | ![Immersive Reader](./media/icon.png) Immersive Reader | Button with text. Image must include alt text.
| Context menu | Immersive Reader _or_ Show in Immersive Reader | Text can vary to match your UI.

To use the Immersive Reader icon, use the following SVG:

```xml
<svg viewBox="0 0 40 37" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g fill-rule="nonzero">
            <path d="M37.4,0.9 L37.4,9.6 L35.4,9.6 L35.4,2.9 L24.4,2.9 C22.9,3.3 20,4.5 20,6 L20,17.2 L18,17.2 L18,6 C18,5 15.6,3.6 13.8,2.9 L2,2.9 L2,29 L12.4,29 L12.4,31 L0,31 L0,0.9 L14.1,0.9 L14.3,1 C15,1.2 17.5,2.2 18.9,3.7 C20.5,1.9 23.5,1.1 23.9,1 L24.1,1 L37.4,1 L37.4,0.9 Z" fill="#000000"></path>
            <path d="M27.4,37 L25.8,37 L18.4,29.4 L14,29.4 L14,21 L18.4,20.9 L26.1,13 L27.4,13 L27.4,37 Z M16,27.4 L19.2,27.4 L25.3,33.7 L25.3,16.6 L19.2,22.9 L15.9,22.9 L15.9,27.4 L16,27.4 Z" fill="#0197F2"></path>
            <path d="M31.3,32.7 L29.6,31.7 C29.6,31.7 31.7,28.3 31.7,25.2 C31.7,21.9 29.6,18.5 29.6,18.4 L31.3,17.4 C31.4,17.6 33.7,21.3 33.7,25.2 C33.7,28.8 31.4,32.6 31.3,32.7 Z" fill="#0197F2"></path>
            <path d="M36.4,36.2 L34.8,35 C34.8,35 38,30.8 38,25.2 C38,19.6 34.8,15.4 34.8,15.4 L36.4,14.2 C36.5,14.4 40,19 40,25.3 C40,31.5 36.5,36 36.4,36.2 Z" fill="#0197F2"></path>
        </g>
    </g>
</svg>
```

## Next steps

* Explore the [Immersive Reader SDK on GitHub](https://github.com/Microsoft/immersive-reader-sdk)
* [Quickstart: Create a web app that launches the Immersive Reader (C#)](./quickstart.md)