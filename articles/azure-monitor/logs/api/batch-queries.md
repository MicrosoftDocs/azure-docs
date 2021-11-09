---
title: Batch Queries
description: Batch queries currently require AAD authentication.
author: bwren
ms.author: bwren
ms.date: 08/18/2021
ms.topic: article
---
# Batch Queries

The API supports batching queries together, against the endpoint <https://api.loganalytics.io/v1/$batch>. Batch queries currently require AAD authentication.

## Request Format

The batch request itself includes normal headers for other operations:

```
    Content-Type: application/json
    Authorization: Bearer <user token>
```

The body of the request is an array of objects, where object contains the following properties: id, headers, body, method, path, and workspace. If no method is included, batch defaults to GET.

Example:

```
    POST https://api.loganalytics.io/v1/$batch
    Content-Type: application/json
    Authorization: Bearer <user token>
    Cache-Control: no-cache
    {
        "requests": 
        [
            {
                "id": "1",
                "headers": {
                    "Content-Type": "application/json"
                },
                "body": {
                    "query": "AzureActivity | summarize count()",
                    "timespan": "PT1H"
                },
                "method": "POST",
                "path": "/query",
                "workspace": "workspace-1"
            },
            {
                "id": "2",
                "headers": {
                    "Content-Type": "application/json"
                },
                "body": {
                    "query": "ApplicationInsights | limit 10",
                    "timespan": "PT1H"
                },
                "method": "POST",
                "path": "/fakePath",
                "workspace": "workspace-2"
            }
        ]
    }
```

## Response Format

The response format is a similarly shaped array of objects, where each object contains the id, the HTTP status code of the particular query, and the body of the returned response for that query. The body will contain the relevant error messages if a query does not successfully return. This only applies to the individual queries in the batch: the batch itself returns a status code independent of the return values of its members. As long as a well-formed, authenticated, authorized batch is received, the batch itself will return successfully even when the results of its member queries may be a mix of success and failure.

Example

```
    {
        "responses":
        [
            {
                "id": "2",
                "status": 404,
                "body": {
                    "error": {
                        "message": "The requested path does not exist",
                        "code": "PathNotFoundError"
                    }
                }
            },
            {
                "id": "1",
                "status": 200,
                "body": {
                    "tables": [
                        {
                            "name": "PrimaryResult",
                            "columns": [
                                {
                                    "name": "Count",
                                    "type": "long"
                                }
                            ],
                            "rows": [
                                [
                                    7240
                                ]
                            ]
                        }
                    ]
                }
            }
        ]
    }
```

## Behavior and Errors

Batch responses make no guarantees about ordering responses relative to the requests that made them. The order of responses inside the returned object is determined by time to completion of each individual query. One should use IDs to map the contained query response objects to the original requests. One should not iterate over the query responses assuming they are in order.

On GET requests, the API ignores the body parameter of the request object.

An entire batch request only fails under specific conditions:

1.  The shape of the outer payload is malformed, e.g. it's not JSON.
2.  User provides no authentication token, or token is invalid.
3.  Individual request objects in the batch do not all have the necessary properties, or there are duplicate IDs.

Under these conditions, the shape of the response will be different from the normal container. See below for an example. The objects contained within the batch object may each fail or succeed independently, and the batch will return 200 assuming above conditions are not met.

## Example Errors

The following is a non exhaustive list of examples of possible errors and their meanings.

1.  400 - Malformed request. The outer request object was not valid JSON.

```
    {
        "error": {
            "message": "The request had some invalid properties",
            "code": "BadArgumentError",
            "innererror": {
                "code": "QueryValidationError",
                "message": "Failed parsing the query",
                "details": [
                    {
                        "code": "InvalidJsonBody",
                        "message": "Unexpected end of JSON input",
                        "target": null
                    }
                ]
            }
        }
    }
```

2.  403 - Forbidden. The token provided does not have access to the resource you are trying to access. Make sure that your token request has the correct resource, and you have granted permissions for your AAD application.

```
    {
        "error": {
            "message": "The provided authentication is not valid for this resource",
            "code": "InvalidTokenError",
            "innererror": {
                "code": "SignatureVerificationFailed",
                "message": "Could not validate the request"
            }
        }
    }
```

3.  204 - Not Placed. You have no data for the API to pull in the backing store. As a 2xx this is technically a successful request, however in a batch it is useful to note the error.

```
    {
        "responses": [
            {
                "id": "2",
                "status": 204,
                "body": {
                    "error": {
                        "code": "WorkspaceNotPlacedError"
                    }
                }
            }
        ]
    }
```

4.  404 - Not found. The query path does not exist. This can also occur in a batch if you specify an invalid HTTP method in the individual request.

```
    {
        "responses": [
            {
                "id": "1",
                "status": 404,
                "body": {
                    "error": {
                        "message": "The requested path does not exist",
                        "code": "PathNotFoundError"
                    }
                }
            }
        ]
    }
```

5.  400 - Failed to resolve resource. The GUID representing the workspace is incorrect.

```
    {
        "responses": [
            {
                "id": "1",
                "status": 400,
                "body": {
                    "error": {
                        "code": "FailedToResolveResource",
                        "message": "Resource identity could not be resovled"
                    }
                }
            }
        ]
    }
```
