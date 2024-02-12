---
title: "How to prepare HTML content for Immersive Reader"
titleSuffix: Azure AI services
description: Learn how to launch the Immersive reader using HTML, JavaScript, Python, Android, or iOS. Immersive Reader uses proven techniques to improve reading comprehension for language learners, emerging readers, and students with learning differences.
author: rwallerms
manager: nitinme
ms.service: azure-ai-immersive-reader
ms.custom: devx-track-js, devx-track-python
ms.topic: how-to
ms.date: 03/04/2021
ms.author: rwaller
---

# How to prepare HTML content for Immersive Reader

This article shows you how to structure your HTML and retrieve the content, so that it can be used by Immersive Reader.

## Prepare the HTML content

Place the content that you want to render in the Immersive Reader inside of a container element. Be sure that the container element has a unique `id`. The Immersive Reader provides support for basic HTML elements, see the [reference](reference.md#html-support) for more information.

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

* Explore the [Immersive Reader SDK Reference](reference.md)
