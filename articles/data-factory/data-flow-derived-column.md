---
title: Derived column transformation in mapping data flow
description: Learn how to transform data at scale in Azure Data Factory with the mapping data flow Derived Column transformation.
author: kromerm
ms.author: makromer
ms.service: data-factory
ms.topic: conceptual
ms.custom: seo-lt-2019
ms.date: 10/15/2019
---

# Derived column transformation in mapping data flow

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

Use the derived column transformation to generate new columns in your data flow or to modify existing fields.

## Derived column settings

To override an existing column, select it via the column dropdown. Otherwise, use the column selection field as a textbox and type in the new column's name. To build the derived column's expression, click on the 'Enter expression' box to open up the [Data Flow Expression Builder](concepts-data-flow-expression-builder.md).

![Derived column settings](media/data-flow/dc1.png "Derived column settings")

To add additional derived columns, hover over an existing derived column and click the plus icon. Choose either **Add column** or **Add column pattern**. Column patterns may come in handy if your column names are variable from your sources. For more information, see [Column Patterns](concepts-data-flow-column-pattern.md).

![New derived column selection](media/data-flow/columnpattern.png "New derived column selection")

## Build schemas in Output Schema pane

The columns you're modifying and adding to your schema are listed in the Output Schema pane,. You can interactively build simple and complex data structures here. To add additional fields, select **Add column**. To build hierarchies, select **Add subcolumn**.

![Add subcolumn](media/data-flow/addsubcolumn.png "Add Subcolumn")

For more information on handling complex types in data flow, see [JSON handling in mapping data flow](format-json.md#mapping-data-flow-properties).

![Add complex column](media/data-flow/complexcolumn.png "Add columns")

## Data flow script

### Syntax

```
<incomingStream>
    derive(
           <columnName1> = <expression1>,
           <columnName2> = <expression2>,
           each(
                match(matchExpression),
                <metadataColumn1> = <metadataExpression1>,
                <metadataColumn2> = <metadataExpression2>
               )
          ) ~> <deriveTransformationName>
```

### Example

The below example is a derived column named `CleanData` that takes an incoming stream `MoviesYear` and creates two derived columns. The first derived column replaces column `Rating` with Rating's value as an integer type. The second derived column is a pattern that matches each column whose name starts with 'movies'. For each matched column, it creates a column `movie` that is equal to the value of the matched column prefixed with 'movie_'. 

In the Data Factory UX, this transformation looks like the below image:

![Derive example](media/data-flow/derive-script1.png "Derive example")

The data flow script for this transformation is in the snippet below:

```
MoviesYear derive(
                Rating = toInteger(Rating),
		        each(
                    match(startsWith(name,'movies')),
                    'movie' = 'movie_' + toString($$)
                )
            ) ~> CleanData
```

## Next steps

- Learn more about the [Mapping Data Flow expression language](data-flow-expression-functions.md).
