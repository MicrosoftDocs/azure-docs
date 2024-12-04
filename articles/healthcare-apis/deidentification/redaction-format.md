---
title: "Use a custom redaction format with the de-identification service"
description: "Learn how to redact using a custom format with the de-identification service."
author: GrahamMThomas
ms.author: gthomas
ms.service: azure-health-data-services
ms.subservice: deidentification-service
ms.topic: tutorial
ms.date: 12/05/2024
---

# Tutorial: Use a custom redaction format with the de-identification service

In this tutorial, you:

> [!div class="checklist"]
> * Learn how to specify a custom redaction format
> * Learn how to create your desired redaction format

## Usage

1. Must select `Redact` as `Operation`. `RedactionFormat` is only supported for `Redact` operation.
2. Pass `RedactionFormat` parameter within the `CustomizationOptions` model to the API or Job parameters.


## Variables

Redaction format variables refer to special placeholders that can be used to create a custom redaction format.

The following variables are supported:

### Type

`{type} => patient`

```text
    Text = "Hi my name is John Smith"
    RedactionFormat = "<{type}>"

    # Output:
    Hi my name is <patient>
```

Also supports Upper and Title cases

```text
    {Type} => {Patient}
    {TYPE} => {PATIENT}
```

### Length

`*{len} => ******(length of entity)`

This will allow you to create a string matching the length of the PHI. 

It will duplicate the previous character to match the length of the tagged entity.

```text
    Text = "Hi my name is John Smith"
    RedactionFormat = "*{len}"

    # Output:
    Hi my name is **********
```

## Limits

1. RedactionFormat supports up to 16 characters.
2. Each variable type can only be used once in the format.