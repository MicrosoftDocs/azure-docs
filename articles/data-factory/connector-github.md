---
title: Connect to Github
description: Use Github to specify your Common Data Model entity references
author: djpmsft
ms.service: data-factory
ms.workload: data-services
ms.topic: conceptual
ms.date: 06/03/2020
ms.author: daperlov
---


# Use Github to read Common Data Model entity references

The Github connector in Azure Data Factory is only used to receive the entity reference schema for the [Common Data Model](format-common-data-model.md) format in mapping data flow.

## Linked service properties

The following properties are supported for the Github linked service.

| Property | Description | Required |
|:--- |:--- |:--- |
| type | he type property must be set to **GitHub**. | yes
| userName | Github username | yes |
| password | Github password | yes |

## Next Steps

Create a [source dataset](data-flow-source.md) in mapping data flow.