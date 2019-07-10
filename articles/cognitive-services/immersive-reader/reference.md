---
title: "Immersive Reader SDK Reference"
titleSuffix: Azure Cognitive Services
description: Reference for the Immersive Reader SDK
services: cognitive-services
author: metanMSFT
manager: nitinme

ms.service: cognitive-services
ms.subservice: immersive-reader
ms.topic: reference
ms.date: 06/20/2019
ms.author: metan
---

# Immersive Reader SDK Reference

The Immersive Reader SDK is a JavaScript library that allows you to integrate the Immersive Reader into your web application.

## Functions

The SDK exposes a single function, `ImmersiveReader.launchAsync(token, resourceName, content, options)`.

### launchAsync

Launches the Immersive Reader within an `iframe` in your web application.

```typescript
launchAsync(token: string, resourceName: string, content: Content, options?: Options): Promise<HTMLDivElement>;
```

#### Parameters

| Name | Type | Description |
| ---- | ---- |------------ |
| `token` | string | The access token acquired from the call to the `issueToken` endpoint. |
| `resourceName` | string | Reserved. Must be set to `null`. |
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
        mimeType?: string; // MIME type of the content (optional). Defaults to 'text/plain' if not specified.
    } ];
}
```

#### Supported MIME types

| MIME Type | Description |
| --------- | ----------- |
| text/plain | Plain text. |
| application/mathml+xml | Mathematical Markup Language (MathML). [Learn more](https://developer.mozilla.org/en-US/docs/Web/MathML).

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

#### Error codes

| Code | Description |
| ---- | ----------- |
| BadArgument | Supplied argument is invalid, see `message` for details. |
| Timeout | The Immersive Reader failed to load within the specified timeout. |
| TokenExpired| The supplied token is expired. |

## Launching the Immersive Reader

The SDK provides default styling for the button for launching the Immersive Reader. Use the `immersive-reader-button` class attribute to enable this styling.

```html
<div class='immersive-reader-button'></div>
```

### Optional attributes

Use the following attributes to configure the look and feel of the button.

| Attribute | Description |
| --------- | ----------- |
| `data-button-style` | Sets the style of the button. Can be `icon`, `text`, or `iconAndText`. Defaults to `icon`. |
| `data-locale` | Sets the locale, e.g. `en-US`, `fr-FR`. Defaults to English. |
| `data-icon-px-size` | Sets the size of the icon in pixels. Defaults to 20px. |

## Browser support

Use the most recent versions of the following browsers for the best experience with the Immersive Reader.

* Microsoft Edge
* Internet Explorer 11
* Google Chrome
* Mozilla Firefox
* Apple Safari

## Next steps

* Explore the [Immersive Reader SDK on GitHub](https://github.com/Microsoft/immersive-reader-sdk)
* [Quickstart: Create a web app that launches the Immersive Reader (C#)](./quickstart.md)