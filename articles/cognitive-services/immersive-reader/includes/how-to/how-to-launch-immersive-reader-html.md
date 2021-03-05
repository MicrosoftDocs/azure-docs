---
author: erhopf
manager: nitinme
ms.service: cognitive-services
ms.subservice: immersive-reader
ms.topic: include
ms.date: 03/04/2021
ms.author: erhopf
---


## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)
* An Immersive Reader resource configured for Azure Active Directory authentication. Follow [these instructions](../../how-to-create-immersive-reader.md) to get set up.  You will need some of the values created here when configuring the environment properties. Save the output of your session into a text file for future reference.

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