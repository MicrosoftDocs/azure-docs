---
title: Mapping data flow transformation overview
titleSuffix: Azure Data Factory & Azure Synapse
description: An overview of the different transformations available in mapping data flow
author: kromerm
ms.author: makromer
ms.service: data-factory
ms.subservice: data-flows
ms.custom: synapse
ms.topic: conceptual
ms.date: 07/17/2023
---

# Mapping data flow transformation overview

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)] 

[!INCLUDE[data-flow-preamble](includes/data-flow-preamble.md)]

Below is a list of the transformations currently supported in mapping data flow. Click on each transformations to learn its configuration details.

| Name | Category | Description |
| ---- | -------- | ----------- |
| [Aggregate](data-flow-aggregate.md) | Schema modifier | Define different types of aggregations such as SUM, MIN, MAX, and COUNT grouped by existing or computed columns. | 
| [Alter row](data-flow-alter-row.md) | Row modifier | Set insert, delete, update, and upsert policies on rows. |
| [Assert](data-flow-assert.md) | Row modifier | Set assert rules for each row. |
| [Cast](data-flow-cast.md) | Schema modifier | Change column data types with type checking. |
| [Conditional split](data-flow-conditional-split.md) | Multiple inputs/outputs | Route rows of data to different streams based on matching conditions. |
| [Derived column](data-flow-derived-column.md) | Schema modifier | Generate new columns or modify existing fields using the data flow expression language. | 
| [External call](data-flow-external-call.md) | Schema modifier | Call external endpoints inline row-by-row. | 
| [Exists](data-flow-exists.md) | Multiple inputs/outputs | Check whether your data exists in another source or stream. | 
| [Filter](data-flow-filter.md) | Row modifier | Filter a row based upon a condition. |
| [Flatten](data-flow-flatten.md) | Formatters |  Take array values inside hierarchical structures such as JSON and unroll them into individual rows. |
| [Flowlet](concepts-data-flow-flowlet.md) | Flowlets |  Build and include custom re-usable transformation logic. |
| [Join](data-flow-join.md) | Multiple inputs/outputs |  Combine data from two sources or streams. |
| [Lookup](data-flow-lookup.md) | Multiple inputs/outputs | Reference data from another source. |
| [New branch](data-flow-new-branch.md) | Multiple inputs/outputs | Apply multiple sets of operations and transformations against the same data stream. |
| [Parse](data-flow-parse.md) | Formatters |  Parse text columns in your data stream that are strings of JSON, delimited text, or XML formatted text. |
| [Pivot](data-flow-pivot.md) | Schema modifier | An aggregation where one or more grouping columns has its distinct row values transformed into individual columns. |
| [Rank](data-flow-rank.md) | Schema modifier | Generate an ordered ranking based upon sort conditions |
| [Select](data-flow-select.md) | Schema modifier | Alias columns and stream names, and drop or reorder columns |
| [Sink](data-flow-sink.md) | - | A final destination for your data |
| [Sort](data-flow-sort.md) | Row modifier | Sort incoming rows on the current data stream |
| [Source](data-flow-source.md) | - | A data source for the data flow |
| [Stringify](data-flow-stringify.md) | Formatters | Turn complex types into plain strings |
| [Surrogate key](data-flow-surrogate-key.md) | Schema modifier | Add an incrementing non-business arbitrary key value |
| [Union](data-flow-union.md) | Multiple inputs/outputs | Combine multiple data streams vertically |
| [Unpivot](data-flow-unpivot.md) | Schema modifier | Pivot columns into row values |
| [Window](data-flow-window.md) | Schema modifier |  Define window-based aggregations of columns in your data streams. |
