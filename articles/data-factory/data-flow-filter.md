---
title: Azure Data Factory Mapping Data Flow Filter Transformation
description: Azure Data Factory Mapping Data Flow Filter Transformation
author: kromerm
ms.author: makromer
ms.reviewer: douglasl
ms.service: data-factory
ms.topic: conceptual
ms.date: 02/03/2019
---

# Azure data factory filter transformation

[!INCLUDE [notes](../../includes/data-factory-data-flow-preview.md)]

The Filter transforms provides row filtering. Build an expression that defines the filter condition. Click in the text box to launch the Expression Builder. Inside the expression builder, build a filter expression to control which rows from current data stream are allowed to pass through (filter) to the next transformation. Think of the Filter transformation as the WHERE clause of a SQL statement.

## Filter on loan_status column:

```
in([‘Default’, ‘Charged Off’, ‘Fully Paid’], loan_status).
```

Filter on the year column in the Movies demo:

```
year > 1980
```

## Next steps

Try a column filtering transformation, the [Select transformation](data-flow-select.md)
