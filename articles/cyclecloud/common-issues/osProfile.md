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

Azure CycleCloud allows you to use [custom images](~/how-to/create-custom-image.md) but the custom image must use a generalized image. Since specialized images do not use waagent, errors are encountered when parameters meant for waagent are passed to the custom image.

Recreate your custom image using a generalized image to resolve.
