---
title: "Launch the Immersive Reader with HTML content"
titleSuffix: Azure Cognitive Services
description: This article will show you how to launch the Immersive Reader with HTML content.
author: metanMSFT
manager: guillasi

ms.service: cognitive-services
ms.subservice: immersive-reader
ms.topic: conceptual
ms.date: 01/14/2020
ms.author: metan
---

# How to launch the Immersive Reader with HTML content

This article demonstrates how to launch the Immersive Reader with HTML content.

## Prepare the HTML content

Place the content that you want to render in the Immersive Reader inside of a container element. Be sure that the container element has a unique `id`. The Immersive Reader provides support for basic HTML elements, see the [reference](./reference.md#html-support) for more information.

```html
<div id='immersive-reader-content'>
    <b>Bold</b>
    <i>Italic</i>
    <u>Underline</u>
    <strike>Strikethrough</strike>
    <code>Code</code>
    <sup>Superscript</sup>
    <sub>Subscript</sub>
    <ul><li>Unordered lists</li></ul>
    <ol><li>Ordered lists</li></ol>
</div>
```

## Get the HTML content in JavaScript

Use the `id` of the container element to get the HTML content in your JavaScript code.

```javascript
const htmlContent = document.getElementById('immersive-reader-content').innerHTML;
```

## Launch the Immersive Reader with your HTML content

When calling `ImmersiveReader.launchAsync`, set the chunk's `mimeType` property to `text/html` to enable rendering HTML.

```javascript
const data = {
    chunks: [{
        content: htmlContent,
        mimeType: 'text/html'
    }]
};

ImmersiveReader.launchAsync(YOUR_TOKEN, YOUR_SUBDOMAIN, data, YOUR_OPTIONS);
```

## Next steps

* Explore the [Immersive Reader SDK Reference](./reference.md)