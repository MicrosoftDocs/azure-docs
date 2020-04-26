---
title: Mapping data flow transformation overview
description: An overview of the different transformations available in mapping data flow
author: djpmsft
ms.author: daperlov
manager: anandsub
ms.service: data-factory
ms.topic: conceptual
ms.date: 03/10/2020
---

# Mapping data flow transformation overview

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)] 

Below is a list of the transformations currently supported in mapping data flow. Click on each transformations to learn its configuration details.

| Name | Category | Description |
| ---- | -------- | ----------- |
| [Aggregate](data-flow-aggregate.md) | Schema modifier | Define different types of aggregations such as SUM, MIN, MAX, and COUNT grouped by existing or computed columns. | 
| [Alter row](data-flow-alter-row.md) | Row modifier | Set insert, delete, update, and upsert policies on rows. |
| [Conditional split](data-flow-conditional-split.md) | Multiple inputs/outputs | Route rows of data to different streams based on matching conditions. |
| [Derived column](data-flow-derived-column.md) | Schema modifier | generate new columns or modify existing fields using the data flow expression language. | 
| [Exists](data-flow-exists.md) | Multiple inputs/outputs | Check whether your data exists in another source or stream. | 
| [Filter](data-flow-filter.md) | Row modifier | Filter a row based upon a condition. |
| [Flatten](data-flow-flatten.md) | Schema modifier |  Take array values inside hierarchical structures such as JSON and unroll them into individual rows. |
| [Join](data-flow-join.md) | Multiple inputs/outputs |  Combine data from two sources or streams. |
| [Lookup](data-flow-lookup.md) | Multiple inputs/outputs | Reference data from another source. |
| [New branch](data-flow-new-branch.md) | Multiple inputs/outputs | Apply multiple sets of operations and transformations against the same data stream. |
| [Pivot](data-flow-pivot.md) | Schema modifier | An aggregation where one or more grouping columns has its distinct row values transformed into individual columns. |
| [Select](data-flow-select.md) | Schema modifier | Alias columns and stream names, and drop or reorder columns |
| [Sink](data-flow-sink.md) | - | A final destination for your data |
| [Sort](data-flow-sort.md) | Row modifier | Sort incoming rows on the current data stream |
| [Source](data-flow-source.md) | - | A data source for the data flow |
| [Surrogate key](data-flow-surrogate-key.md) | Schema modifier | Add an incrementing non-business arbitrary key value |
| [Union](data-flow-union.md) | Multiple inputs/outputs | Combine multiple data streams vertically |
| [Unpivot](data-flow-unpivot.md) | Schema modifier | Pivot columns into row values |
| [Window](data-flow-window.md) | Schema modifier |  Define window-based aggregations of columns in your data streams. |
