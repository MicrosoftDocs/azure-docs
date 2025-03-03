---
title: Common Issues - os.Profile
description: Azure CycleCloud common issue - os.Profile
author: adriankjohnson
ms.date: 07/24/2021
ms.author: adjohnso
---
# Common Issues: Parameter os.Profile

## Possible Error Messages

- `Parameter "os.Profile" is not allowed`

## Resolution

Azure CycleCloud allows you to use [custom images](~/articles/cyclecloud/how-to/create-custom-image.md) but the custom image must be created from a generalized image. Since specialized images do not have an `osProfile` associated with them, errors are encountered when the osProfile parameter is passed to the custom image.

Recreate your custom image using a generalized image to resolve.
