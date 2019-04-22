---
title: Azure Data Factory Mapping Data Flow Lookup Transformation
description: Azure Data Factory Mapping Data Flow Lookup Transformation
author: kromerm
ms.author: makromer
ms.reviewer: douglasl
ms.service: data-factory
ms.topic: conceptual
ms.date: 02/03/2019
---

# Azure Data Factory Mapping Data Flow Lookup Transformation

[!INCLUDE [notes](../../includes/data-factory-data-flow-preview.md)]

Use Lookup to add reference data from another source to your Data Flow. The Lookup transform requires a defined source that points to your reference table and matches on key fields.

![Lookup Transformation](media/data-flow/lookup1.png "Lookup")

Select the key fields that you wish to match on between the incoming stream fields and the fields from the reference source. You must first have created a new source on the Data Flow design canvas to use as the right-side for the lookup.

When matches are found, the resulting rows and columns from the reference source will be added to your data flow. You can choose which fields of interest that you wish to include in your Sink at the end of your Data Flow.
