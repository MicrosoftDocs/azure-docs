---
title: Connect to GitHub
description: Use GitHub to specify your Common Data Model entity references
author: linda33wj
ms.service: data-factory
ms.topic: conceptual
ms.date: 06/03/2020
ms.author: jingwang
---


# Use GitHub to read Common Data Model entity references

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

The GitHub connector in Azure Data Factory is only used to receive the entity reference schema for the [Common Data Model](format-common-data-model.md) format in mapping data flow.

## Linked service properties

The following properties are supported for the GitHub linked service.

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to **GitHub**. | yes
| userName | GitHub username | yes |
| password | GitHub password | yes |

## Next Steps

Create a [source dataset](data-flow-source.md) in mapping data flow.