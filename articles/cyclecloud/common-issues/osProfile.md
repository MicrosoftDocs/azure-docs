---
title: Common Issues - os.Profile
description: Troubleshoot the 'Parameter os.Profile is not allowed' error in Azure CycleCloud and how to resolve it.
author: adriankjohnson
ms.date: 06/19/2026
ms.topic: troubleshooting-problem-resolution
ms.author: adjohnso
---
# Common issues: Parameter os.Profile

## Possible error messages

- `Parameter "os.Profile" is not allowed`

## Resolution

Azure CycleCloud allows you to use [custom images](~/articles/cyclecloud/how-to/create-custom-image.md), but you must create the custom image from a generalized image. Since specialized images don't have an `osProfile` associated with them, you encounter errors when you pass the osProfile parameter to the custom image.

Recreate your custom image using a generalized image to resolve the issue.
