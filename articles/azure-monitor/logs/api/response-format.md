---
title: Response format
description: The Azure Monitor Log Analytics API response is JSON that contains an array of table objects.
author: AbbyMSFT
ms.author: abbyweisberg
ms.date: 11/21/2021
ms.topic: article
---
# Azure Monitor Log Analytics API response format

The response is JSON string that contains an array of table objects.

- The `tables` property is an array of tables representing the query result. Each table contains `name`, `columns`, and `rows` properties.

 - The `name` property is the name of the table.
 - The `columns` property is an array of objects describing the schema of each column.
 - The `rows` property is an array of values. Each item in the array represents a row in the result set.

In the following example, we can see the result contains two columns, `Category` and `count_`. The first column, `Category`, represents the value of the `Category` column in the `AzureActivity` table, and the second column, `count_` is count of the number of events in the `AzureActivity` table for the given Category.

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

If a fatal error occurs during query execution, an error status code is returned with a [OneAPI](https://github.com/Microsoft/api-guidelines/blob/vNext/Guidelines.md#errorresponse--object) error object describing the error. See the [reference](https://dev.loganalytics.io/reference/post-query) for a list of error status codes.

If a non-fatal error occurs during query execution, the response status code is `200 OK` and contains the query results in the `tables` property as described above. The response will also contain an `error` property, which is OneAPI error object with code `PartialError`. Details of the error are included in the `details` property.

## Next Steps
Get detailed information about using the [API options](batch-queries.md). 