---
title: "Display math in the Immersive Reader"
titleSuffix: Azure AI services
description: Learn how to display math in the Immersive Reader app.
author: sharmas
manager: nitinme

ms.service: azure-ai-immersive-reader
ms.topic: how-to
ms.date: 02/26/2024
ms.author: sharmas
ms.custom:
---

# How to display math in the Immersive Reader

The Immersive Reader can display math expressions when provided in the form of Mathematical Markup Language ([MathML](https://developer.mozilla.org/docs/Web/MathML)).

## Send math to the Immersive Reader

In order to display math in the Immersive Reader app, supply a [chunk](../reference.md#chunk) that contains MathML, and set the MIME type to `application/mathml+xml`. To learn more, see [supported MIME types](../reference.md#supported-mime-types).

For example, see the following content:

```html
<div id='ir-content'>
    <math xmlns='http://www.w3.org/1998/Math/MathML'>
        <mfrac>
            <mrow>
                <msup>
                    <mi>x</mi>
                    <mn>2</mn>
                </msup>
                <mo>+</mo>
                <mn>3</mn>
                <mi>x</mi>
                <mo>+</mo>
                <mn>2</mn>
            </mrow>
            <mrow>
                <mi>x</mi>
                <mo>−</mo>
                <mn>3</mn>
            </mrow>
        </mfrac>
        <mo>=</mo>
        <mn>4</mn>
    </math>
</div>
```

You can then display your content by using the following JavaScript.

```javascript
const data = {
    title: 'My Math',
    chunks: [{
        content: document.getElementById('ir-content').innerHTML.trim(),
        mimeType: 'application/mathml+xml'
    }]
};

ImmersiveReader.launchAsync(YOUR_TOKEN, YOUR_SUBDOMAIN, data, YOUR_OPTIONS);
```

When you launch the Immersive Reader, you should see:

:::image type="content" source="../media/how-tos/1-math.png" alt-text="Screenshot of the rendered math equation in Immersive Reader.":::

## Next step

> [!div class="nextstepaction"]
> [Explore the Immersive Reader SDK reference](../reference.md)
