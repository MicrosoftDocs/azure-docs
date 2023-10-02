---
title: Azure Monitor workbooks - Transform JSON data with JSONPath
description: Use JSONPath in Azure Monitor workbooks to transform the JSON data results to a different data format. 
services: azure-monitor
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.topic: conceptual
ms.date: 06/21/2023
---

# Use JSONPath to transform JSON data in workbooks

Workbooks can query data from many sources. Some endpoints, such as [Azure Resource Manager](../../azure-resource-manager/management/overview.md) or custom endpoints can return results in JSON. If the JSON data returned by the queried endpoint is in a format that you don't want, you can use JSONPath transformation to convert the JSON to a table structure. You can then use the table to plot [workbook visualizations](./workbooks-overview.md#visualizations).

JSONPath is a query language for JSON that's similar to XPath for XML. Like XPath, JSONPath allows for the extraction and filtration of data out of the JSON structure.

## Use JSONPath

In this example, the JSON object represents a store's inventory. We're going to create a table of the store's available books listing their titles, authors, and prices.

1. Switch the workbook to edit mode by selecting **Edit**.
1. Use the **Add** > **Add query** link to add a query control to the workbook.
1. Select the data source as **JSON**.
1. Use the JSON editor to enter the following JSON snippet:

    ```json
    { "store": {
        "books": [ 
          { "category": "reference",
            "author": "Nigel Rees",
            "title": "Sayings of the Century",
            "price": 8.95
          },
          { "category": "fiction",
            "author": "Evelyn Waugh",
            "title": "Sword of Honour",
            "price": 12.99
          },
          { "category": "fiction",
            "author": "Herman Melville",
            "title": "Moby Dick",
            "isbn": "0-553-21311-3",
            "price": 8.99
          },
          { "category": "fiction",
            "author": "J. R. R. Tolkien",
            "title": "The Lord of the Rings",
            "isbn": "0-395-19395-8",
            "price": 22.99
          }
        ],
        "bicycle": {
          "color": "red",
          "price": 19.95
        }
      }
    }
    ```  
1. Select the **Result Settings** tab and switch the result format to **JSON Path**.
1. Apply the following JSON path settings:

    - **JSON Path Table**: `$.store.books`. This field represents the path of the root of the table. In this case, we care about the store's book inventory. The table path filters the JSON to the book information.

       | Column IDs | Column JSON paths |
       |:-----------|:-----------------|
       | Title      | `$.title`        |
       | Author     | `$.author`       |
       | Price      | `$.price`        |

    Column IDs are the column headers. Column JSON paths fields represent the path from the root of the table to the column value.

1. Select **Run Query**.

    :::image type="content" source="media/workbooks-jsonpath/query-jsonpath.png" alt-text="Screenshot that shows editing a query item with JSON data source and JSON path result format.":::

## Use regular expressions to covert values

You may have some data that isn't in a standard format. To use that data effectively, you would want to convert that data into a standard format.

In this example, the published date is in YYYMMMDD format. The code interprets this value as a numeric value, not text, resulting in right-justified numbers, instead of as a date.

You can use the **Type**, **RegEx Match** and **Replace With** fields in the result settings to convert the result into true dates.

|Result setting field  |Description  |
|---------|---------|
|Type|Allows you to explicitly change the type of the value returned by the API. This field us usually left unset, but you can use this field to force the value to a different type. |
|Regex Match|Allows you to enter a regular expression to take part (or parts) of the value returned by the API instead of the whole value. This field is usually combined with the **Replace With** field. |
|Replace With|Use this field to create the new value along with the regular expression. If this value is empty, the default is `$&`, which is the match result of the expression. See string.replace documentation to see other values that you can use to generate other output.|


To convert YYYMMDD format into YYYY-MM-DD format:

1. Select the Published row in the grid.
1. In the **Type** field, select Date/Time so that the column is usable in charts.
1. In the **Regex Match** field, use this regular expression: `([0-9]{4})([0-9]{2})([0-9]{2})`. This regular expression:
    - matches a four digit number, then a two digit number, then another two digit number.
    - The parentheses form capture groups to use in the next step.
1. In the **Replace With**, use this regular expression: `$1-$2-$3`. This expression creates a new string with each captured group, with a hyphen between them, turning "12345678" into "1234-56-78").
1. Run the query again. 

    :::image type="content" source="media/workbooks-jsonpath/workbooks-jsonpath-convert-date-time.png" alt-text="Screenshot that shows JSONpath converted to date-time format.":::
## Next steps

- [Workbooks overview](./workbooks-overview.md)
- [Groups in Azure Monitor Workbooks](workbooks-groups.md)
