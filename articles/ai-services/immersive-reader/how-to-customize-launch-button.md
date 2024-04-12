---
title: "Edit the Immersive Reader launch button"
titleSuffix: Azure AI services
description: Learn how to customize the button that launches the Immersive Reader app.
#services: cognitive-services
author: sharmas
manager: nitinme

ms.service: azure-ai-immersive-reader
ms.topic: how-to
ms.date: 02/23/2024
ms.author: sharmas
---

# How to customize the Immersive Reader button

This article demonstrates how to customize the button that launches the Immersive Reader, to fit the needs of your application.

## Add the Immersive Reader button

The [Immersive Reader SDK](https://github.com/microsoft/immersive-reader-sdk) provides default styling for the button that launches the Immersive Reader. To enable this styling, use the `immersive-reader-button` class attribute.

```html
<div class='immersive-reader-button'></div>
```

## Customize the button style

To set the style of the button, use the `data-button-style` attribute. The allowed values are `icon`, `text`, and `iconAndText`. The default value is `icon`.

### Icon button

Use the following code to render the icon button.

```html
<div class='immersive-reader-button' data-button-style='icon'></div>
```

:::image type="content" source="media/button-icon.png" alt-text="Screenshot of the rendered button icon.":::

### Text button

Use the following code to render the button text.

```html
<div class='immersive-reader-button' data-button-style='text'></div>
```

:::image type="content" source="media/button-text.png" alt-text="Screenshot of the text in the button.":::

### Icon and text button

Use the following code to render both the button and the text.

```html
<div class='immersive-reader-button' data-button-style='iconAndText'></div>
```

:::image type="content" source="media/button-icon-and-text.png" alt-text="Screenshot of the icon and text together.":::

## Customize the button text

To configure the language and the alt text for the button, use the `data-locale` attribute. The default language is English.

```html
<div class='immersive-reader-button' data-locale='fr-FR'></div>
```

## Customize the size of the icon

To configure the size of the Immersive Reader icon, use the `data-icon-px-size` attribute. This sets the size of the icon in pixels. The default size is 20 px.

```html
<div class='immersive-reader-button' data-icon-px-size='50'></div>
```

## Next step

> [!div class="nextstepaction"]
> [Explore the Immersive Reader SDK reference](reference.md)
