---
title: Unique name generation pattern
description: Describes the unique name generation pattern.
author: johndowns
ms.author: jodowns
ms.topic: conceptual
ms.date: 11/11/2021
---
# Unique name generation pattern

Within your Bicep files, create resource names that are unique, deterministic, meaningful, and different for each environment that you deploy to.

## Context and problem

Resource names need to be:

- Unique
- Deterministic
- Meaningful
- Different for different environments

## Solution

Use uniqueString() and/or guid()

## Example

TODO

## Considerations

- Scope the uniqueueness appropriately. Consider any factors that should differ. e.g. use RGID rather than RG name.
- Don't change the seed values after deploying the resource

## Next steps

[Learn about the shared variable file pattern.](patterns-shared-variable-file.md)
