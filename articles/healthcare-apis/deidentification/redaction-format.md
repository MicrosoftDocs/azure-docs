---
title: "Use a custom redaction format with the Azure Health De-identification service"
description: "Learn how to redact using a custom format with the Azure Health De-identification service."
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
> * Learn how to use variables in a custom redaction format

## Usage

Within the de-identification service, we support an operation called `Redact` that allows you to redact PHI from a text document. You can specify
what that redaction looks like using a custom format.

For example:

| Text                   | RedactedText       |
| ---------------------- | ------------------ |
| My name is John Smith. | My name is [name]. |

### Specify a custom redaction format

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

Also supports Upper and Title cases.

```text
    {type} => patient
    {Type} => Patient
    {TYPE} => PATIENT
```

### Length

This variable allows you to create a string matching the length of the PHI. 

It duplicates the previous character to match the length of the tagged entity.

```text
    Text = "Hi my name is John Smith"
    RedactionFormat = "*{len}"

    # Output:
    Hi my name is **********
```

## Limits

- The redaction format can be up to 16 characters long.
- Each variable type can only be used once in the format.