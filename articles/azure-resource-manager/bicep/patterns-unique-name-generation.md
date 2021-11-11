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

In Azure, the name you give a resource is important. Names help you and your team to identify the resource. For many services, the resource name forms part of the DNS name you use to access the resource.

When planning a resource's name, you need to ensure it is:

- **Unique:** TODO
- **Deterministic:** TODO
- **Meaningful:** TODO
- **Distinct for each environment:** TODO
- **Following the rules for the specific resource:** TODO [see here](../management/resource-name-rules.md)

## Solution

Use uniqueString() and/or guid()

## Example

TODO

## Considerations

- Scope the uniqueueness appropriately. Consider any factors that should differ. e.g. use RGID rather than RG name.
- Don't change the seed values after deploying the resource

## Next steps

[Learn about the shared variable file pattern.](patterns-shared-variable-file.md)
