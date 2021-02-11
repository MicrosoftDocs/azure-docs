---
title: Parse data transformation in mapping data flow
description: Parse embedded column documents
author: kromerm
ms.author: makromer
ms.service: data-factory
ms.topic: conceptual
ms.date: 02/08/2021
---

# Parse transformation in mapping data flow

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

Use the Parse transformation to parse columns in your data that are in document form. The current supported types of embedded documents that can be parsed are JSON and delimited text.

## Configuration

The flatten transformation contains the following configuration settings

### Unroll by

Select an array to unroll. The output data will have one row per item in each array. If the unroll by array in the input row is null or empty, there will be one output row with unrolled values as null.

### Unroll root

By default, the flatten transformation unrolls an array to the top of the hierarchy it exists in. You can optionally select an array as your unroll root. The unroll root must be an array of complex objects that either is or contains the unroll by array. If an unroll root is selected, the output data will contain at least one row per items in the unroll root. If the input row doesn't have any items in the unroll root, it will be dropped from the output data. Choosing an unroll root will always output a less than or equal number of rows than the default behavior.

### Flatten mapping

Similar to the select transformation, choose the projection of the new structure from incoming fields and the denormalized array. If a denormalized array is mapped, the output column will be the same data type as the array. If the unroll by array is an array of complex objects that contains subarrays, mapping an item of that subarry will output an array.

Refer to the inspect tab and data preview to verify your mapping output.

## Examples

```
source(output(
		name as string,
		location as string,
		satellites as string[],
		goods as (trade as boolean, customers as string[], orders as (orderId as string, orderTotal as double, shipped as (orderItems as (itemName as string, itemQty as string)[]))[])
	),
	allowSchemaDrift: true,
	validateSchema: false,
	ignoreNoFilesFound: false,
	documentForm: 'documentPerLine') ~> JsonSource
source(output(
		movieId as string,
		title as string,
		genres as string
	),
	allowSchemaDrift: true,
	validateSchema: false,
	ignoreNoFilesFound: false) ~> CsvSource
JsonSource derive(jsonString = toString(goods)) ~> StringifyJson
StringifyJson parse(json = jsonString ? (trade as boolean,
		customers as string[]),
	format: 'json',
	documentForm: 'arrayOfDocuments') ~> ParseJson
CsvSource derive(csvString = 'Id|name|year\n\'1\'|\'test1\'|\'1999\'') ~> CsvString
CsvString parse(csv = csvString ? (id as integer,
		name as string,
		year as string),
	format: 'delimited',
	columnNamesAsHeader: true,
	columnDelimiter: '|',
	nullValue: '',
	documentForm: 'documentPerLine') ~> ParseCsv
ParseJson select(mapColumn(
		jsonString,
		json
	),
	skipDuplicateMapInputs: true,
	skipDuplicateMapOutputs: true) ~> KeepStringAndParsedJson
ParseCsv select(mapColumn(
		csvString,
		csv
	),
	skipDuplicateMapInputs: true,
	skipDuplicateMapOutputs: true) ~> KeepStringAndParsedCsv
```

## Data flow script

### Syntax

### Examples

```
parse(json = jsonString ? (trade as boolean,
                                customers as string[]),
                format: 'json',
                documentForm: 'singleDocument') ~> ParseJson

parse(csv = csvString ? (id as integer,
                                name as string,
                                year as string),
                format: 'delimited',
                columnNamesAsHeader: true,
                columnDelimiter: '|',
                nullValue: '',
                documentForm: 'documentPerLine') ~> ParseCsv
```    

## Next steps

* Use the [Flatten transformation](data-flow-flatten.md) to pivot rows to columns.
* Use the [Derived column transformation](data-flow-derived-column.md) to pivot columns to rows.
