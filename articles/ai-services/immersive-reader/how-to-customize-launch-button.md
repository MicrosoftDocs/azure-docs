---
title: "Edit the Immersive Reader launch button"
titleSuffix: Azure AI services
description: This article will show you how to customize the button that launches the Immersive Reader.
#services: cognitive-services
author: rwallerms
manager: nitinme

ms.service: azure-ai-immersive-reader
ms.topic: how-to
ms.date: 03/08/2021
ms.author: rwaller
---

# How to customize the Immersive Reader button

This article demonstrates how to customize the button that launches the Immersive Reader to fit the needs of your application.

## Add the Immersive Reader button

The Immersive Reader SDK provides default styling for the button that launches the Immersive Reader. Use the `immersive-reader-button` class attribute to enable this styling.

```html
<div class='immersive-reader-button'></div>
```

## Customize the button style

Use the `data-button-style` attribute to set the style of the button. The allowed values are `icon`, `text`, and `iconAndText`. The default value is `icon`.

### Icon button

```html
<div class='immersive-reader-button' data-button-style='icon'></div>
```

This renders the following:

![This is the rendered Text button](./media/button-icon.png)

### Text button

```html
<div class='immersive-reader-button' data-button-style='text'></div>
```

This renders the following:

![This is the rendered Immersive Reader button.](./media/button-text.png)

### Icon and text button

```html
<div class='immersive-reader-button' data-button-style='iconAndText'></div>
```

This renders the following:

![Icon button](./media/button-icon-and-text.png)

## Customize the button text

Configure the language and the alt text for the button using the `data-locale` attribute. The default language is English.

```html
<div class='immersive-reader-button' data-locale='fr-FR'></div>
```

## Customize the size of the icon

The size of the Immersive Reader icon can be configured using the `data-icon-px-size` attribute. This sets the size of the icon in pixels. The default size is 20px.

```html
<div class='immersive-reader-button' data-icon-px-size='50'></div>
```

## Next steps

* Explore the [Immersive Reader SDK Reference](./reference.md)
