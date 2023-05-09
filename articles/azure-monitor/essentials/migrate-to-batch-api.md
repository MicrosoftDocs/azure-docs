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

For customers running into throttling or performance problems with the existing (metrics API)[https://learn.microsoft.com/en-us/rest/api/monitor/metrics/list?
tabs=HTTP], consider migrating to the (metrics batch API)[https://learn.microsoft.com/en-us/rest/api/monitor/metrics-data-plane/batch?tabs=HTTP]. The two APIs share a common set of query parameter and response formats that make migration easy.

# Request format 
 The batch API request format is a as follows:
 ```http
POST /subscriptions/subscriptionId/metrics:getBatch?metricNamespace=<resource type namespace>&api-version=2023-03-01-preview
Host: <region>.metrics.monitor.azure.com
Content-Type: application/json
Authorization: Bearer <token>
{
    "resourceids":["/subscriptions/<subscriptionId>/resourceGroups/<resource group name>/providers/<respource namespace>/<resource name>",
                   "/subscriptions/<subscriptionId>/resourceGroups/<resource group name>/providers/<respource namespace>/<resource name>"]
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

Consider the following restrictions on what resources can be batched together when deciding if the metrics:getBatch API is the correct choice for your scenario.

1. All resources in a batch must be in the same subscription.
1. All resources in a batch must be in the same Azure region.
1. All resources in a batch must be the same resource type.

To help identify groups of resources that meet these criteria, run the following Azure Resource Graph query using the (Azure Resource Graph Explorer)[https://portal.azure.com/#view/HubsExtension/ArgQueryBlade], or via the (Azure Resource Manager Resources query API)[https://learn.microsoft.com/en-us/rest/api/azureresourcegraph/resourcegraph(2021-03-01)/resources/resources?tabs=HTTP].

```
    resources
    | project id, subscriptionId, ['type'], location
    | order by subscriptionId, ['type'], location
```

## Request conversion steps

To convert an existing metrics API call to a metrics:getBatch API call, follow these steps:

Assume the following API call is being used to request metrics:

```http
GET https://management.azure.com/subscriptions/12345678-1234-1234-1234-123456789abc/resourceGroups/sample-test/providers/Microsoft.Storage/storageAccounts/testaccount/providers/microsoft.Insights/metrics?timespan=2023-04-20T12:00:00.000Z/2023-04-22T12:00:00.000Z&interval=PT6H&metricNamespace=microsoft.storage%2Fstorageaccounts&metricnames=Ingress,Egress&aggregation=total,average,minimum,maximum&top=10&orderby=total desc&$filter=ApiName eq '*'&api-version=2019-07-01
```

1. Change the hostname.  
 Replace  `management.azure.com` with a regional endpoint for the Azure Monitor Metrics data plane using the following format: `<region>.metrics.monitor.azure.com` where `region` is region of the resources you are requesting metrics for.  For the example, if the resources are in westus2, the hostname is  `westus2.metrics.monitor.azure.com`.

1. Change the API name and path.  
 The metrics:getBatch API is a subscription level POST API. The resource metrics requested are specified in the request body rather than in the URL path. 
 Change the url path as follows:  
    from `/subscriptions/12345678-1234-1234-1234-123456789abc/resourceGroups/sample-test/providers/Microsoft.Storage/storageAccounts/testaccount/providers/microsoft.Insights/metrics`  
     to `/subscriptions/12345678-1234-1234-1234-123456789abc/metrics:getBatch`

1. The `metricNamespace` query param is required for metrics:getBatch. For Azure standard metrics, the namespace name is usually the resource type of the resources you've specified. To check the namespace value to use, see the (metrics namespaces API)[https://learn.microsoft.com/en-us/rest/api/monitor/metric-namespaces/list?tabs=HTTP]
1. Use the api-version query parameter as follows: `&api-version=2023-03-01-preview`
1. In the metrics:getBatch API, the filter query param is not prefixed with a `$`.  Change the query param from `$filter=` to `filter=`
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

  Specify up to 50 unique resourceIds in each call. Each resource must belong to the same subscription, region, and of the same resource type.  

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

## Response conversion

The response format of the metrics:getBatch API encapsulates a list of individual metrics call responses in the following format:

    {
        "values": [
            <One individual metrics response per requested resourceId>
        ]
    }

A `resourceid` property has been added to each resources' metrics list in the metrics:getBatch API response.

 The follwoing show sample response formats.

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

## Error response changes

In the metrics:getBatch error response, the error content is wrapped inside a top level "error" property on the response. See the below examples to see the difference.

### metrics API erorr response:
```http
    {
      "code": "BadRequest",
      "message": "Metric: Ingress does not support requested dimension combination: apiname2, supported ones are: GeoType,ApiName,Authentication, TraceId: {ab11d9c2-b17e-4f75-8986-b314ecacbe11}"
    }
```
### batch API error response:

```http
    {
      "error": {
        "code": "BadRequest",
        "message": "Metric: Egress does not support requested dimension combination: apiname2, supported ones are: GeoType,ApiName,Authentication, TraceId: {cd77617d-5f11-e50d-58c5-ba2f2cdc38ce}"
      }
    }
```

## Trouble shooting steps and FAQ

+ No returned data can be due to the wrong region being specified.

    The batch API verifes that all of the resourceids specified belong to the same subscriptionId and resource type. The batch API doesn't verify that all of the specified resourceids are in the same region specified in the hostname. The only indicator that the region may be wrong for a given resource is getting empty timeseries data for all that resource.
    for example,`"timeseries": [],`

### Custom metrics are not currently supported.

The metrics:getBatch API does not support querying custom metrics, or queries where the metricnamespace name is not a resource type. This is probably most acutely felt for VM Guest OS metrics which use the namespace "azure.vm.windows.guestmetrics" or "azure.vm.linux.guestmetrics".

### The top parameter applies per resourceid specified.

How the top parameter works in the context of the batch API can be a little confusing. Rather than enforcing a limit on the total timeseries returned by the entire call, it rather enforces the total timeseries returned *per metric per resourceid*. If you have a batch query with many '*' filters specified, 2 metrics, and 4 resourceids with a top of 5. The maximum possible timeseries returned by that query is 40, that is 2x4x5 timeserie.

### 401 authorization errors.

The individual metrics API requires a user have the [Monitoring Reader](https://learn.microsoft.com/en-us/azure/role-based-access-control/built-in-roles#monitoring-reader) permission on the resource being queried. Because the metrics:getBatch API is a subscription level API, users must have the Monitoring Reader permission for the queried subscription to use the batch API. Even if users have Monitoring Reader on all the resources being queried in the batch API, the request will fail if that user doesn't have Monitoring Reader on the subscription itself.

### 529 throttling errors.

While the dataplane batch API is designed to help mitigate throttling problems, 529 error codes still occur which indicates that the metrics backend is currently throttling some customers. The recommended action to take, is to implement an exponential backoff retry scheme.

### Paging 
The main scenario for customers calling this API is to frequently keep calling it every few minutes for the same metrics and resources with just the latest time stamps specified. Often getting these results back in a timely fashion is an important consideration so many customers try to parallelize their queries as much as possible. A paging pattern forces customers into a sequential calling pattern that introduces additional query latency. In scenarios where requests return volumes of metric data where paging would be beneficial, it is recommended to split the query into multiple parallel.

### Billing
Yes all metrics dataplane and batching calls are billed. For more information, see [Basic Log Search Queries](https://azure.microsoft.com/pricing/details/monitor/#pricing)
