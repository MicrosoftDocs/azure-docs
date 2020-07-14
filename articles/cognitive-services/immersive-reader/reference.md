---
title: "Immersive Reader SDK Reference"
titleSuffix: Azure Cognitive Services
description: The Immersive Reader SDK contains a JavaScript library that allows you to integrate the Immersive Reader into your application.
services: cognitive-services
author: metanMSFT
manager: nitinme

ms.service: cognitive-services
ms.subservice: immersive-reader
ms.topic: reference
ms.date: 06/20/2019
ms.author: metan
---

# Immersive Reader SDK Reference Guide

The Immersive Reader SDK contains a JavaScript library that allows you to integrate the Immersive Reader into your application.

## Functions

The SDK exposes the functions:

- [`ImmersiveReader.launchAsync(token, subdomain, content, options)`](#launchasync)

- [`ImmersiveReader.close()`](#close)

- [`ImmersiveReader.renderButtons(options)`](#renderbuttons)

## launchAsync

Launches the Immersive Reader within an `iframe` in your web application.

```typescript
launchAsync(token: string, subdomain: string, content: Content, options?: Options): Promise<LaunchResponse>;
```

### Parameters

| Name | Type | Description |
| ---- | ---- |------------ |
| `token` | string | The Azure AD authentication token. |
| `subdomain` | string | The custom subdomain of your Immersive Reader resource in Azure. |
| `content` | [Content](#content) | An object containing the content to be shown in the Immersive Reader. |
| `options` | [Options](#options) | Options for configuring certain behaviors of the Immersive Reader. Optional. |

### Returns

Returns a `Promise<LaunchResponse>`, which resolves when the Immersive Reader is loaded. The `Promise` resolves to a [`LaunchResponse`](#launchresponse) object.

### Exceptions

The returned `Promise` will be rejected with an [`Error`](#error) object if the Immersive Reader fails to load. For more information, see the [error codes](#error-codes).

## close

Closes the Immersive Reader.

An example use case for this function is if the exit button is hidden by setting ```hideExitButton: true``` in [options](#options). Then, a different button (for example a mobile header's back arrow) can call this ```close``` function when it is clicked.

```typescript
close(): void;
```

## renderButtons

This function styles and updates the document's Immersive Reader button elements. If ```options.elements``` is provided, then this function will render buttons within ```options.elements```. Otherwise, the buttons will be rendered within the document's elements which have the class ```immersive-reader-button```.

This function is automatically called by the SDK when the window loads.

See [Optional Attributes](#optional-attributes) for more rendering options.

```typescript
renderButtons(options?: RenderButtonsOptions): void;
```

### Parameters

| Name | Type | Description |
| ---- | ---- |------------ |
| `options` | [RenderButtonsOptions](#renderbuttonsoptions) | Options for configuring certain behaviors of the renderButtons function. Optional. |

## Types

### Content

Contains the content to be shown in the Immersive Reader.

```typescript
{
    title?: string;    // Title text shown at the top of the Immersive Reader (optional)
    chunks: Chunk[];   // Array of chunks
}
```

### Chunk

A single chunk of data, which will be passed into the Content of the Immersive Reader.

```typescript
{
    content: string;        // Plain text string
    lang?: string;          // Language of the text, e.g. en, es-ES (optional). Language will be detected automatically if not specified.
    mimeType?: string;      // MIME type of the content (optional). Currently 'text/plain', 'application/mathml+xml', and 'text/html' are supported. Defaults to 'text/plain' if not specified.
}
```

### LaunchResponse

Contains the response from the call to `ImmersiveReader.launchAsync`.

```typescript
{
    container: HTMLDivElement;    // HTML element which contains the Immersive Reader iframe
    sessionId: string;            // Globally unique identifier for this session, used for debugging
}
```

### CookiePolicy enum

An enum used to set the policy for the Immersive Reader's cookie usage. See [options](#options).

```typescript
enum CookiePolicy { Disable, Enable }
```

#### Supported MIME types

| MIME Type | Description |
| --------- | ----------- |
| text/plain | Plain text. |
| text/html | HTML content. [Learn more](#html-support)|
| application/mathml+xml | Mathematical Markup Language (MathML). [Learn more](./how-to/display-math.md).
| application/vnd.openxmlformats-officedocument.wordprocessingml.document | Microsoft Word .docx format document.

### HTML Support

| HTML | Supported Content |
| --------- | ----------- |
| Font Styles | Bold, Italic, Underline, Code, Strikethrough, Superscript, Subscript |
| Unordered Lists | Disc, Circle, Square |
| Ordered Lists | Decimal, Upper-Alpha, Lower-Alpha, Upper-Roman, Lower-Roman |

Unsupported tags will be rendered comparably. Images and tables are currently not supported.

### Options

Contains properties that configure certain behaviors of the Immersive Reader.

```typescript
{
    uiLang?: string;           // Language of the UI, e.g. en, es-ES (optional). Defaults to browser language if not specified.
    timeout?: number;          // Duration (in milliseconds) before launchAsync fails with a timeout error (default is 15000 ms).
    uiZIndex?: number;         // Z-index of the iframe that will be created (default is 1000)
    useWebview?: boolean;      // Use a webview tag instead of an iframe, for compatibility with Chrome Apps (default is false).
    onExit?: () => any;        // Executes when the Immersive Reader exits
    customDomain?: string;     // Reserved for internal use. Custom domain where the Immersive Reader webapp is hosted (default is null).
    allowFullscreen?: boolean; // The ability to toggle fullscreen (default is true).
    hideExitButton?: boolean;  // Whether or not to hide the Immersive Reader's exit button arrow (default is false). This should only be true if there is an alternative mechanism provided to exit the Immersive Reader (e.g a mobile toolbar's back arrow).
    cookiePolicy?: CookiePolicy; // Setting for the Immersive Reader's cookie usage (default is CookiePolicy.Disable). It's the responsibility of the host application to obtain any necessary user consent in accordance with EU Cookie Compliance Policy.
}
```

### RenderButtonsOptions

Options for rendering the Immersive Reader buttons.

```typescript
{
    elements: HTMLDivElement[];    // Elements to render the Immersive Reader buttons in
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
| TokenExpired | The supplied token is expired. |
| Throttled | The call rate limit has been exceeded. |

## Launching the Immersive Reader

The SDK provides default styling for the button for launching the Immersive Reader. Use the `immersive-reader-button` class attribute to enable this styling. See [this article](./how-to-customize-launch-button.md) for more details.

```html
<div class='immersive-reader-button'></div>
```

### Optional attributes

Use the following attributes to configure the look and feel of the button.

| Attribute | Description |
| --------- | ----------- |
| `data-button-style` | Sets the style of the button. Can be `icon`, `text`, or `iconAndText`. Defaults to `icon`. |
| `data-locale` | Sets the locale. For example, `en-US` or `fr-FR`. Defaults to English `en`. |
| `data-icon-px-size` | Sets the size of the icon in pixels. Defaults to 20px. |

## Browser support

Use the most recent versions of the following browsers for the best experience with the Immersive Reader.

* Microsoft Edge
* Internet Explorer 11
* Google Chrome
* Mozilla Firefox
* Apple Safari

## Next steps

* Explore the [Immersive Reader SDK on GitHub](https://github.com/microsoft/immersive-reader-sdk)
* [Quickstart: Create a web app that launches the Immersive Reader (C#)](./quickstarts/client-libraries.md?pivots=programming-language-csharp)
