---
title: Migrate from the metrics API to the getBatch API
description: How to migrate from the metrics API to the getBatch API
author: EdB-MSFT
services: azure-monitor
ms.topic: how-to
ms.date: 05/07/2023
ms.author: edbaynash

#customer-intent: As a customer, I want to understand how to migrate from the metrics API to the getBatch API
---
# How to migrate from the metrics API to the getBatch API

Heavy use of the [metrics API](/rest/api/monitor/metrics/list?tabs=HTTP) can result in throttling or performance problems. Migrating to the [metrics:getBatch](/rest/api/monitor/metrics-data-plane/batch?tabs=HTTP) API allows you to query multiple resources in a single REST request. The two APIs share a common set of query parameter and response formats that make migration easy.

## Request format 
 The metrics:getBatch API request has the following format:
 ```http
POST /subscriptions/<subscriptionId>/metrics:getBatch?metricNamespace=<resource type namespace>&api-version=2023-03-01-preview
Host: <region>.metrics.monitor.azure.com
Content-Type: application/json
Authorization: Bearer <token>
{
    "resourceids":[<comma separated list of resource IDs>]
}

```

For example,
```http
POST /subscriptions/12345678-1234-1234-1234-123456789abc/metrics:getBatch?metricNamespace=microsoft.compute/virtualMachines&api-version=2023-03-01-preview
Host: eastus.metrics.monitor.azure.com
Content-Type: application/json
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhb...TaXzf6tmC4jhog
{
    "resourceids":["/subscriptions/12345678-1234-1234-1234-123456789abc/resourceGroups/rg-vms-01/providers/Microsoft.Compute/virtualMachines/vmss-001_41df4bb9",
    "/subscriptions/12345678-1234-1234-1234-123456789abc/resourceGroups/rg-vms-02/providers/Microsoft.Compute/virtualMachines/vmss-001_c1187e2f"
]
}
 ```

## Batching restrictions

Consider the following restrictions on which resources can be batched together when deciding if the metrics:getBatch API is the correct choice for your scenario.

- All resources in a batch must be in the same subscription.
- All resources in a batch must be in the same Azure region.
- All resources in a batch must be the same resource type.

To help identify groups of resources that meet these criteria, run the following Azure Resource Graph query using the [Azure Resource Graph Explorer](https://portal.azure.com/#view/HubsExtension/ArgQueryBlade), or via the [Azure Resource Manager Resources query API](/rest/api/azureresourcegraph/resourcegraph(2021-03-01)/resources/resources?tabs=HTTP).

```
    resources
    | project id, subscriptionId, ['type'], location
    | order by subscriptionId, ['type'], location
```

## Request conversion steps

To convert an existing metrics API call to a metric:getBatch API call, follow these steps:

Assume the following API call is being used to request metrics:

```http
GET https://management.azure.com/subscriptions/12345678-1234-1234-1234-123456789abc/resourceGroups/sample-test/providers/Microsoft.Storage/storageAccounts/testaccount/providers/microsoft.Insights/metrics?timespan=2023-04-20T12:00:00.000Z/2023-04-22T12:00:00.000Z&interval=PT6H&metricNamespace=microsoft.storage%2Fstorageaccounts&metricnames=Ingress,Egress&aggregation=total,average,minimum,maximum&top=10&orderby=total desc&$filter=ApiName eq '*'&api-version=2019-07-01
```

1. Change the hostname.  
 Replace  `management.azure.com` with a regional endpoint for the Azure Monitor Metrics data plane using the following format: `<region>.metrics.monitor.azure.com` where `region` is region of the resources you're requesting metrics for.  For the example, if the resources are in westus2, the hostname is  `westus2.metrics.monitor.azure.com`.

1. Change the API name and path.  
 The metrics:getBatch API is a subscription level POST API. The resources for which the metrics are requested, are specified in the request body rather than in the URL path.  
 Change the url path as follows:  
    from `/subscriptions/12345678-1234-1234-1234-123456789abc/resourceGroups/sample-test/providers/Microsoft.Storage/storageAccounts/testaccount/providers/microsoft.Insights/metrics`  
     to `/subscriptions/12345678-1234-1234-1234-123456789abc/metrics:getBatch`

1. The `metricNamespace` query param is required for metrics:getBatch. For Azure standard metrics, the namespace name is usually the resource type of the resources you've specified. To check the namespace value to use, see the [metrics namespaces API](/rest/api/monitor/metric-namespaces/list?tabs=HTTP)
1. Update the api-version query parameter as follows: `&api-version=2023-03-01-preview`
1. The filter query param isn't prefixed with a `$` in the metrics:getBatch API. Change the query param from `$filter=` to `filter=`.
1.  The metrics:getBatch API is a POST call with a body that contains a comma-separated list of resourceIds in the following format:
    For example:
    ```http
        {
          "resourceids": [
            <comma separated list of resource ids>
          ]
        }
    ```
    
    For example:
    ```http
        {
          "resourceids": [
            "/subscriptions/12345678-1234-1234-1234-123456789abc/resourceGroups/sample-test/providers/Microsoft.Storage/storageAccounts/testaccount"
          ]
        }
    ```

  Up to 50 unique resource IDs may be specified in each call. Each resource must belong to the same subscription, region, and be of the same resource type.  

> [!IMPORTANT] 
> + The `resourceids` object property in the body must be lower case. 
> + Ensure that there are no trailing commas on your last resourceid in the array list.

### Converted batch request

The following example shows the converted batch request.
```http
    POST https://westus2.metrics.monitor.azure.com/subscriptions/12345678-1234-1234-1234-123456789abc/metrics:getBatch?timespan=2023-04-20T12:00:00.000Z/2023-04-22T12:00:00.000Z&interval=PT6H&metricNamespace=microsoft.storage%2Fstorageaccounts&metricnames=Ingress,Egress&aggregation=total,average,minimum,maximum&top=10&orderby=total desc&filter=ApiName eq '*'&api-version=2023-03-01-preview
        
    {
      "resourceids": [
        "/subscriptions/12345678-1234-1234-1234-123456789abc/resourceGroups/sample-test/providers/Microsoft.Storage/storageAccounts/testaccount",
        "/subscriptions/12345678-1234-1234-1234-123456789abc/resourceGroups/sample2-test-rg/providers/Microsoft.Storage/storageAccounts/eax252qtemplate",
        "/subscriptions/12345678-1234-1234-1234-123456789abc/resourceGroups/sample3/providers/Microsoft.Storage/storageAccounts/sample3diag",
        "/subscriptions/12345678-1234-1234-1234-123456789abc/resourceGroups/sample3/providers/Microsoft.Storage/storageAccounts/sample3prefile",
        "/subscriptions/12345678-1234-1234-1234-123456789abc/resourceGroups/sample3/providers/Microsoft.Storage/storageAccounts/sample3tipstorage",
        "/subscriptions/12345678-1234-1234-1234-123456789abc/resourceGroups/sample3backups/providers/Microsoft.Storage/storageAccounts/pod01account1"
      ]
    }
```

## Response Format

The response format of the metrics:getBatch API encapsulates a list of individual metrics call responses in the following format:
```http
    {
        "values": [
            <One individual metrics response per requested resourceId>
        ]
    }
```

A `resourceid` property has been added to each resources' metrics list in the metrics:getBatch API response.

 The following show sample response formats.

### [Individual response](#tab/individual-response)

 ```http
    {
        "cost": 11516,
        "timespan": "2023-04-20T12:00:00Z/2023-04-22T12:00:00Z",
        "interval": "P1D",
        "value": [
          {
            "id": "/subscriptions/12345678-1234-1234-1234-123456789abc/resourceGroups/sample-test/providers/Microsoft.Storage/storageAccounts/testaccount/providers/Microsoft.Insights/metrics/Ingress",
            "type": "Microsoft.Insights/metrics",
            "name": {
              "value": "Ingress",
              "localizedValue": "Ingress"
            },
            "displayDescription": "The amount of ingress data, in bytes. This number includes ingress from an external client into Azure Storage as well as ingress within Azure.",
            "unit": "Bytes",
            "timeseries": [
              {
                "metadatavalues": [
                  {
                    "name": {
                      "value": "apiname",
                      "localizedValue": "apiname"
                    },
                    "value": "EntityGroupTransaction"
                  }
                ],
                "data": [
                  {
                    "timeStamp": "2023-04-20T12:00:00Z",
                    "total": 1737897,
                    "average": 5891.17627118644,
                    "minimum": 1674,
                    "maximum": 10976
                  },
                  {
                    "timeStamp": "2023-04-21T12:00:00Z",
                    "total": 1712543,
                    "average": 5946.329861111111,
                    "minimum": 1674,
                    "maximum": 10980
                  }
                ]
              },
              {
                "metadatavalues": [
                  {
                    "name": {
                      "value": "apiname",
                      "localizedValue": "apiname"
                    },
                    "value": "GetBlobServiceProperties"
                  }
                ],
                "data": [
                  {
                    "timeStamp": "2023-04-20T12:00:00Z",
                    "total": 1284,
                    "average": 321,
                    "minimum": 321,
                    "maximum": 321
                  },
                  {
                    "timeStamp": "2023-04-21T12:00:00Z",
                    "total": 1926,
                    "average": 321,
                    "minimum": 321,
                    "maximum": 321
                  }
                ]
              }
            ],
            "errorCode": "Success"
          },
          {
            "id": "/subscriptions/12345678-1234-1234-1234-123456789abc/resourceGroups/sample-test/providers/Microsoft.Storage/storageAccounts/testaccount/providers/Microsoft.Insights/metrics/Egress",
            "type": "Microsoft.Insights/metrics",
            "name": {
              "value": "Egress",
              "localizedValue": "Egress"
            },
            "displayDescription": "The amount of egress data. This number includes egress to external client from Azure Storage as well as egress within Azure. As a result, this number does not reflect billable egress.",
            "unit": "Bytes",
            "timeseries": [
              {
                "metadatavalues": [
                  {
                    "name": {
                      "value": "apiname",
                      "localizedValue": "apiname"
                    },
                    "value": "EntityGroupTransaction"
                  }
                ],
                "data": [
                  {
                    "timeStamp": "2023-04-20T12:00:00Z",
                    "total": 249603,
                    "average": 846.1118644067797,
                    "minimum": 839,
                    "maximum": 1150
                  },
                  {
                    "timeStamp": "2023-04-21T12:00:00Z",
                    "total": 244652,
                    "average": 849.4861111111111,
                    "minimum": 839,
                    "maximum": 1150
                  }
                ]
              },
              {
                "metadatavalues": [
                  {
                    "name": {
                      "value": "apiname",
                      "localizedValue": "apiname"
                    },
                    "value": "GetBlobServiceProperties"
                  }
                ],
                "data": [
                  {
                    "timeStamp": "2023-04-20T12:00:00Z",
                    "total": 3772,
                    "average": 943,
                    "minimum": 943,
                    "maximum": 943
                  },
                  {
                    "timeStamp": "2023-04-21T12:00:00Z",
                    "total": 5658,
                    "average": 943,
                    "minimum": 943,
                    "maximum": 943
                  }
                ]
              }
            ],
            "errorCode": "Success"
          }
        ],
        "namespace": "microsoft.storage/storageaccounts",
        "resourceregion": "westus2"
      }
```
### [metrics:getBatch Response](#tab/batch-response)

```http
    {
        "values": [
          {
            "cost": 11516,
            "timespan": "2023-04-20T12:00:00Z/2023-04-22T12:00:00Z",
            "interval": "P1D",
            "value": [
              {
                "id": "/subscriptions/12345678-1234-1234-1234-123456789abc/resourceGroups/sample-test/providers/Microsoft.Storage/storageAccounts/testaccount/providers/Microsoft.Insights/metrics/Ingress",
                "type": "Microsoft.Insights/metrics",
                "name": {
                  "value": "Ingress",
                  "localizedValue": "Ingress"
                },
                "displayDescription": "The amount of ingress data, in bytes. This number includes ingress from an external client into Azure Storage as well as ingress within Azure.",
                "unit": "Bytes",
                "timeseries": [
                  {
                    "metadatavalues": [
                      {
                        "name": {
                          "value": "apiname",
                          "localizedValue": "apiname"
                        },
                        "value": "EntityGroupTransaction"
                      }
                    ],
                    "data": [
                      {
                        "timeStamp": "2023-04-20T12:00:00Z",
                        "total": 1737897,
                        "average": 5891.17627118644,
                        "minimum": 1674,
                        "maximum": 10976
                      },
                      {
                        "timeStamp": "2023-04-21T12:00:00Z",
                        "total": 1712543,
                        "average": 5946.329861111111,
                        "minimum": 1674,
                        "maximum": 10980
                      }
                    ]
                  },
                  {
                    "metadatavalues": [
                      {
                        "name": {
                          "value": "apiname",
                          "localizedValue": "apiname"
                        },
                        "value": "GetBlobServiceProperties"
                      }
                    ],
                    "data": [
                      {
                        "timeStamp": "2023-04-20T12:00:00Z",
                        "total": 1284,
                        "average": 321,
                        "minimum": 321,
                        "maximum": 321
                      },
                      {
                        "timeStamp": "2023-04-21T12:00:00Z",
                        "total": 1926,
                        "average": 321,
                        "minimum": 321,
                        "maximum": 321
                      }
                    ]
                  }
                ],
                "errorCode": "Success"
              },
              {
                "id": "/subscriptions/12345678-1234-1234-1234-123456789abc/resourceGroups/sample-test/providers/Microsoft.Storage/storageAccounts/testaccount/providers/Microsoft.Insights/metrics/Egress",
                "type": "Microsoft.Insights/metrics",
                "name": {
                  "value": "Egress",
                  "localizedValue": "Egress"
                },
                "displayDescription": "The amount of egress data. This number includes egress to external client from Azure Storage as well as egress within Azure. As a result, this number does not reflect billable egress.",
                "unit": "Bytes",
                "timeseries": [
                  {
                    "metadatavalues": [
                      {
                        "name": {
                          "value": "apiname",
                          "localizedValue": "apiname"
                        },
                        "value": "EntityGroupTransaction"
                      }
                    ],
                    "data": [
                      {
                        "timeStamp": "2023-04-20T12:00:00Z",
                        "total": 249603,
                        "average": 846.1118644067797,
                        "minimum": 839,
                        "maximum": 1150
                      },
                      {
                        "timeStamp": "2023-04-21T12:00:00Z",
                        "total": 244652,
                        "average": 849.4861111111111,
                        "minimum": 839,
                        "maximum": 1150
                      }
                    ]
                  },
                  {
                    "metadatavalues": [
                      {
                        "name": {
                          "value": "apiname",
                          "localizedValue": "apiname"
                        },
                        "value": "GetBlobServiceProperties"
                      }
                    ],
                    "data": [
                      {
                        "timeStamp": "2023-04-20T12:00:00Z",
                        "total": 3772,
                        "average": 943,
                        "minimum": 943,
                        "maximum": 943
                      },
                      {
                        "timeStamp": "2023-04-21T12:00:00Z",
                        "total": 5658,
                        "average": 943,
                        "minimum": 943,
                        "maximum": 943
                      }
                    ]
                  }
                ],
                "errorCode": "Success"
              }
            ],
            "namespace": "microsoft.storage/storageaccounts",
            "resourceregion": "westus2",
            "resourceid": "/subscriptions/12345678-1234-1234-1234-123456789abc/resourceGroups/sample-test/providers/Microsoft.Storage/storageAccounts/testaccount"
          },
          {
            "cost": 11516,
            "timespan": "2023-04-20T12:00:00Z/2023-04-22T12:00:00Z",
            "interval": "P1D",
            "value": [
              {
                "id": "/subscriptions/12345678-1234-1234-1234-123456789abc/resourceGroups/sample3/providers/Microsoft.Storage/storageAccounts/sample3diag/providers/Microsoft.Insights/metrics/Ingress",
                "type": "Microsoft.Insights/metrics",
                "name": {
                  "value": "Ingress",
                  "localizedValue": "Ingress"
                },
                "displayDescription": "The amount of ingress data, in bytes. This number includes ingress from an external client into Azure Storage as well as ingress within Azure.",
                "unit": "Bytes",
                "timeseries": [
                  {
                    "metadatavalues": [
                      {
                        "name": {
                          "value": "apiname",
                          "localizedValue": "apiname"
                        },
                        "value": "EntityGroupTransaction"
                      }
                    ],
                    "data": [
                      {
                        "timeStamp": "2023-04-20T12:00:00Z",
                        "total": 867509,
                        "average": 5941.842465753424,
                        "minimum": 1668,
                        "maximum": 10964
                      },
                      {
                        "timeStamp": "2023-04-21T12:00:00Z",
                        "total": 861018,
                        "average": 5979.291666666667,
                        "minimum": 1668,
                        "maximum": 10964
                      }
                    ]
                  },
                  {
                    "metadatavalues": [
                      {
                        "name": {
                          "value": "apiname",
                          "localizedValue": "apiname"
                        },
                        "value": "GetBlobServiceProperties"
                      }
                    ],
                    "data": [
                      {
                        "timeStamp": "2023-04-20T12:00:00Z",
                        "total": 1268,
                        "average": 317,
                        "minimum": 312,
                        "maximum": 332
                      },
                      {
                        "timeStamp": "2023-04-21T12:00:00Z",
                        "total": 1560,
                        "average": 312,
                        "minimum": 312,
                        "maximum": 312
                      }
                    ]
                  }
                ],
                "errorCode": "Success"
              },
              {
                "id": "/subscriptions/12345678-1234-1234-1234-123456789abc/resourceGroups/sample3/providers/Microsoft.Storage/storageAccounts/sample3diag/providers/Microsoft.Insights/metrics/Egress",
                "type": "Microsoft.Insights/metrics",
                "name": {
                  "value": "Egress",
                  "localizedValue": "Egress"
                },
                "displayDescription": "The amount of egress data. This number includes egress to external client from Azure Storage as well as egress within Azure. As a result, this number does not reflect billable egress.",
                "unit": "Bytes",
                "timeseries": [
                  {
                    "metadatavalues": [
                      {
                        "name": {
                          "value": "apiname",
                          "localizedValue": "apiname"
                        },
                        "value": "EntityGroupTransaction"
                      }
                    ],
                    "data": [
                      {
                        "timeStamp": "2023-04-20T12:00:00Z",
                        "total": 124316,
                        "average": 851.4794520547945,
                        "minimum": 839,
                        "maximum": 1150
                      },
                      {
                        "timeStamp": "2023-04-21T12:00:00Z",
                        "total": 122943,
                        "average": 853.7708333333334,
                        "minimum": 839,
                        "maximum": 1150
                      }
                    ]
                  },
                  {
                    "metadatavalues": [
                      {
                        "name": {
                          "value": "apiname",
                          "localizedValue": "apiname"
                        },
                        "value": "GetBlobServiceProperties"
                      }
                    ],
                    "data": [
                      {
                        "timeStamp": "2023-04-20T12:00:00Z",
                        "total": 3384,
                        "average": 846,
                        "minimum": 846,
                        "maximum": 846
                      },
                      {
                        "timeStamp": "2023-04-21T12:00:00Z",
                        "total": 4230,
                        "average": 846,
                        "minimum": 846,
                        "maximum": 846
                      }
                    ]
                  }
                ],
                "errorCode": "Success"
              }
            ],
            "namespace": "microsoft.storage/storageaccounts",
            "resourceregion": "westus2",
            "resourceid": "/subscriptions/12345678-1234-1234-1234-123456789abc/resourceGroups/sample3/providers/Microsoft.Storage/storageAccounts/sample3diag"
          }
        ]
      }
```
---

## Error response changes

In the metrics:getBatch error response, the error content is wrapped inside a top level "error" property on the response. For example,

+ Metrics API error response

    ```http
    {
      "code": "BadRequest",
      "message": "Metric: Ingress does not support requested dimension combination: apiname2, supported ones are: GeoType,ApiName,Authentication, TraceId: {ab11d9c2-b17e-4f75-8986-b314ecacbe11}"
    }
    ```

+ Batch API error response:

    ```http
    {
      "error": {
        "code": "BadRequest",
        "message": "Metric: Egress does not support requested dimension combination: apiname2, supported ones are: GeoType,ApiName,Authentication, TraceId: {cd77617d-5f11-e50d-58c5-ba2f2cdc38ce}"
      }
    }
    ```

## Troubleshooting

+ No returned data can be due to the wrong region being specified.  
    The batch API verifies that all of the resource IDs specified belong to the same subscriptionId and resource type. The batch API doesn't verify that all of the specified resource IDs are in the same region specified in the hostname. The only indicator that the region may be wrong for a given resource is getting empty time series data for all that resource.
    for example,`"timeseries": [],`

+ Custom metrics aren't currently supported.  
    The metrics:getBatch API doesn't support querying custom metrics, or queries where the metric namespace name isn't a resource type. This is the case for VM Guest OS metrics that use the namespace "azure.vm.windows.guestmetrics" or "azure.vm.linux.guestmetrics".

+ The top parameter applies per resource ID specified.  
How the top parameter works in the context of the batch API can be a little confusing. Rather than enforcing a limit on the total time series returned by the entire call, it rather enforces the total time series returned *per metric per resource ID*. If you have a batch query with many '*' filters specified, two metrics, and four resource IDs with a top of 5. The maximum possible time series returned by that query is 40, that is 2x4x5 time series.

### 401 authorization errors

The individual metrics API requires a user have the [Monitoring Reader](/azure/role-based-access-control/built-in-roles#monitoring-reader) permission on the resource being queried. Because the metrics:getBatch API is a subscription level API, users must have the Monitoring Reader permission for the queried subscription to use the batch API. Even if users have Monitoring Reader on all the resources being queried in the batch API, the request fails if the user doesn't have Monitoring Reader on the subscription itself.

### 529 throttling errors

While the data plane batch API is designed to help mitigate throttling problems, 529 error codes can still occur which indicates that the metrics backend is currently throttling some customers. The recommended action is to implement an exponential backoff retry scheme.

## Paging 
Paging is not supported by the metrics:getBatch API. The most common use-case for this API is frequently calling every few minutes for the same metrics and resources for the latest timeframe. Low latency is an important consideration so many customers parallelize their queries as much as possible. Paging forces customers into a sequential calling pattern that introduces additional query latency. In scenarios where requests return volumes of metric data where paging would be beneficial, it's recommended to split the query into multiple parallel queries.

## Billing
Yes all metrics data plane and batching calls are billed. For more information, see the **Azure Monitor native metrics** section in [Basic Log Search Queries](https://azure.microsoft.com/pricing/details/monitor/#pricing)
