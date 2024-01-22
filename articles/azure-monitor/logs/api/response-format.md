---
title: Azure Monitor Log Analytics API response format
description: The Azure Monitor Log Analytics API response is JSON that contains an array of table objects.
ms.date: 11/21/2021
author: guywi-ms
ms.author: guywild
ms.topic: article
---
# Azure Monitor Log Analytics API response format

The Azure Monitor Log Analytics API response is a JSON string that contains an array of table objects.

The `tables` property is an array of tables that represent the query result. Each table contains `name`, `columns`, and `rows` properties:

 - The `name` property is the name of the table.
 - The `columns` property is an array of objects that describe the schema of each column.
 - The `rows` property is an array of values. Each item in the array represents a row in the result set.

In the following example, we can see that the result contains two columns: `Category` and `count_`. The first column, `Category`, represents the value of the `Category` column in the `AzureActivity` table. The second column, `count_` is the count of the number of events in the `AzureActivity` table for the specific category.

```
    HTTP/1.1 200 OK
    Content-Type: application/json; charset=utf-8
    
    {
        "tables": [
            {
                "name": "PrimaryResult",
                "columns": [
                    {
                        "name": "Category",
                        "type": "string"
                    },
                    {
                        "name": "count_",
                        "type": "long"
                    }
                ],
                "rows": [
                    [
                        "Administrative",
                        20839
                    ],
                    [
                        "Recommendation",
                        122
                    ],
                    [
                        "Alert",
                        64
                    ],
                    [
                        "ServiceHealth",
                        11
                    ]
                ]
            }
        ]
    }
```

## Azure Monitor Log Analytics API errors

If a fatal error occurs during query execution, an error status code is returned with a [OneAPI](https://github.com/Microsoft/api-guidelines/blob/vNext/Guidelines.md#errorresponse--object) error object that describes the error.

If a non-fatal error occurs during query execution, the response status code is `200 OK`. It contains the query results in the `tables` property as described. The response also contains an `error` property, which is a OneAPI error object with the code `PartialError`. Details of the error are included in the `details` property.

## Next steps

Get more information about using the [API options](batch-queries.md).
