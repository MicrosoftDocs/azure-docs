---
title: Stringify data transformation in mapping data flow
description: Stringify complex data types
author: kromerm
ms.author: makromer
ms.service: data-factory
ms.subservice: data-flows
ms.topic: conceptual
ms.date: 07/17/2023
---

# Stringify transformation in mapping data flow

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

Use the stringify transformation to turn complex data types into strings. This can be useful when you need to store or send column data as a single string entity that may originate as a structure, map, or array type.

> [!VIDEO https://www.microsoft.com/en-us/videoplayer/embed/RWMTs9]

## Configuration

In the stringify transformation configuration panel, you'll first pick the type of data contained in the columns that you wish to parse inline. The stringify transformation also contains the following configuration settings.

:::image type="content" source="media/data-flow/stringify.png" alt-text="Stringify settings":::

### Column

Similar to derived columns and aggregates, this is where you'll either modify an exiting column by selecting it from the drop-down picker. Or you can type in the name of a new column here. ADF will store the stringifies source data in this column. In most cases, you'll want to define a new column that stringifies the incoming complex field type.

### Expression

Use the expression builder to set the source complex field that is to be stringified. This can be as simple as just selecting the source column with the self-contained data that you wish to stringify, or you can create complex expressions to parse.

:::image type="content" source="media/data-flow/stringify-2.png" alt-text="Stringify expressions":::

#### Example expression

In this example, ```body.properties.periods``` is an array inside a structure returned from a REST source.

```
body.properties.periods
```

## Data flow script

```
stringify(mydata = body.properties.periods ? string,
	format: 'json') ~> Stringify1
```

## Next steps

* Use the [Flatten transformation](data-flow-flatten.md) to pivot rows to columns.
* Use the [Parse transformation](data-flow-parse.md) to convert complex embedded types to separate columns.
* Use the [Derived column transformation](data-flow-derived-column.md) to pivot columns to rows.
