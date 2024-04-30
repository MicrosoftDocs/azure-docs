---
title: "How to prepare HTML content for Immersive Reader"
titleSuffix: Azure AI services
description: Learn how to structure HTML and retrieve your content for use with Immersive Reader.
author: sharmas
manager: nitinme
ms.service: azure-ai-immersive-reader
ms.custom: devx-track-js
ms.topic: how-to
ms.date: 02/23/2024
ms.author: sharmas
---

# How to prepare HTML content for Immersive Reader

This article shows you how to structure your HTML and retrieve the content, so that your Immersive Reader application can use it.

## Prepare the HTML content

Place the content that you want to render in the Immersive Reader inside of a container element. Be sure that the container element has a unique `id`. To learn more about how the Immersive Reader provides support for basic HTML elements, see the [SDK reference](reference.md#html-support).

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

## Next step

> [!div class="nextstepaction"]
> [Explore the Immersive Reader SDK reference](reference.md)
