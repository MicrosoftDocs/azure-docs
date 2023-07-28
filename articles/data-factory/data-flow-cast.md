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
ms.date: 07/13/2023
---

# Cast transformation in mapping data flow 

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

[!INCLUDE[data-flow-preamble](includes/data-flow-preamble.md)]

Use the cast transformation to easily modify the data types of individual columns in a data flow. The cast transformation also enables an easy way to check for casting errors.

## Configuration

:::image type="content" source="media/data-flow/cast-transformation-001.png" alt-text="Cast settings":::

To modify the data type for columns in your data flow, add columns to "Cast settings" using the plus (+) sign.

**Column name:** Pick the column you wish to cast from your list of metadata columns.

**Type:** Choose the data type to cast your column to. If you pick "complex", you can then select "Define complex type" and define structures, arrays, and maps inside the expression builder.

> [!NOTE]
> Support for complex data type casting from the Cast transformation is currently unavailable. Use a Derived Column transformation instead. In the Derived Column, type conversion errors always result in NULL and require explicity error handling using an Assert. The Cast transformation can automatically trap conversion errors using the "Assert type check" property.

**Format:** Some data types, like decimal and dates, will allow for additional formatting options.

**Assert type check:** The cast transformation allows for type checking. If the casting fails, the row will be marked as an assertion error that you can trap later in the stream.

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
