---
title: Response format
description: The response is JSON that contains an array of table objects.
author: bwren
ms.author: bwren
ms.date: 08/18/2021
ms.topic: article
---
# Response format

The response is JSON that contains an array of table objects.

The `tables` property is an array of tables representing the query result. Each table contains `name`, `columns` and `rows` properties.

The `name` property is the name of the table. The `columns` property is an array of objects describing the schema of each column and the `rows` property is an array of values where each item in the array represents a row in the result set.

In the following example, we can see the result contains two columns, `Category` and `count_`. The first column, `Category`, represents the value of the `Category` column in the `AzureActivity` table, and the second column, `count_` is count of the number of events in the `AzureActivity` table for the given Category value.

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

## Errors

If there are any fatal errors errors during query execution, an error status code will be returned with a [OneAPI](https://github.com/Microsoft/api-guidelines/blob/vNext/Guidelines.md#errorresponse--object) error object describing the error. See the [reference](https://dev.loganalytics.io/reference/post-query) for a list of error status codes.

A non fatal error may occur during query execution. In such cases, the response status code will be `200 OK` and contain query results in the `tables` property as described above. The response will also contain an `error` property which is OneAPI error object with code `PartialError`. Details of the error will be in the `details` property.
