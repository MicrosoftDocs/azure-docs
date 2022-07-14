---
title: Cast transformation in mapping data flow 
description: Learn how to use a mapping data flow cast transformation to easily change column data types in Azure Data Factory or Synapse Analytics pipelines.
titleSuffix: Azure Data Factory & Azure Synapse
author: kromerm
ms.author: makromer
ms.reviewer: makromer
ms.service: data-factory
ms.subservice: data-flows
ms.topic: conceptual
ms.custom: synapse
ms.date: 07/13/2022
---

# Cast transformation in mapping data flow 

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

[!INCLUDE[data-flow-preamble](includes/data-flow-preamble.md)]

Use the cast transformation to easily modify the data types of individual columns in a data flow.

## Configuration

:::image type="content" source="media/data-flow/cast-transformation-001.png" alt-text="Rank settings":::

**Column name:** If a sort column is of type string, case will be factored into the ranking. 

**Type:** If enabled, the rank column will be dense ranked. Each rank count will be a consecutive number and rank values won't be skipped after a tie.

**Format:** The name of the rank column generated. This column will be of type long.

**Assert type check:** Choose which columns you're sorting by and in which order the sort happens. The order determines sorting priority.

The above configuration takes incoming basketball data and creates a rank column called 'pointsRanking'. The row with the highest value of the column *PTS* will have a *pointsRanking* value of 1.

## Data flow script

### Syntax

```
<incomingStream>
    cast(output(
		AddressID as integer,
		AddressLine1 as string,
		AddressLine2 as string,
		City as string
	),
	errors: true) ~> <castTransformationName<>
```
## Next steps

Modify existing columns and new columns using the [derived column transformation](data-flow-derived-column.md).
