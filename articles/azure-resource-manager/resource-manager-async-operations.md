---
title: Status of asynchronous operations - Azure Resource Manager
description: Describes how to track asynchronous operations in Azure. It shows the values you use to get the status of a long-running operation.
author: tfitzmac
ms.service: azure-resource-manager
ms.topic: conceptual
ms.date: 12/09/2018
ms.author: tomfitz
ms.custom: seodec18
---
# Track asynchronous Azure operations
Some Azure REST operations run asynchronously because the operation can't be completed quickly. This article describes how to track the status of asynchronous operations through values returned in the response.  

## Status codes for asynchronous operations
An asynchronous operation initially returns an HTTP status code of either:

* 201 (Created)
* 202 (Accepted) 

When the operation successfully completes, it returns either:

* 200 (OK)
* 204 (No Content) 

Refer to the [REST API documentation](/rest/api/) to see the responses for the operation you're executing.

## Monitor status of operation
The asynchronous REST operations return header values, which you use to determine the status of the operation. There are potentially three header values to examine:

* `Azure-AsyncOperation` - URL for checking the ongoing status of the operation. If your operation returns this value, always use it (instead of Location) to track the status of the operation.
* `Location` - URL for determining when an operation has completed. Use this value only when Azure-AsyncOperation isn't returned.
* `Retry-After` - The number of seconds to wait before checking the status of the asynchronous operation.

However, not every asynchronous operation returns all these values. For example, you may need to evaluate the Azure-AsyncOperation header value for one operation, and the Location header value for another operation. 

You retrieve the header values as you would retrieve any header value for a request. For example, in C#, you retrieve the header value from an `HttpWebResponse` object named `response` with the following code:

```cs
response.Headers.GetValues("Azure-AsyncOperation").GetValue(0)
```

## Azure-AsyncOperation request and response

To get the status of the asynchronous operation, send a GET request to the URL in Azure-AsyncOperation header value.

The body of the response from this operation contains information about the operation. The following example shows the possible values returned from the operation:

```json
{
    "id": "{resource path from GET operation}",
    "name": "{operation-id}", 
    "status" : "Succeeded | Failed | Canceled | {resource provider values}", 
    "startTime": "2017-01-06T20:56:36.002812+00:00",
    "endTime": "2017-01-06T20:56:56.002812+00:00",
    "percentComplete": {double between 0 and 100 },
    "properties": {
        /* Specific resource provider values for successful operations */
    },
    "error" : { 
        "code": "{error code}",  
        "message": "{error description}" 
    }
}
```

Only `status` is returned for all responses. The error object is returned when the status is Failed or Canceled. All other values are optional; therefore, the response you receive may look different than the example.

## provisioningState values

Operations that create, update, or delete (PUT, PATCH, DELETE) a resource typically return a `provisioningState` value. When an operation has completed, one of following three values is returned: 

* Succeeded
* Failed
* Canceled

All other values indicate the operation is still running. The resource provider can return a customized value that indicates its state. For example, you may receive **Accepted** when the request is received and running.

## Example requests and responses

### Start virtual machine (202 with Azure-AsyncOperation)
This example shows how to determine the status of **start** operation for virtual machines. The initial request is in the following format:

```HTTP
POST 
https://management.azure.com/subscriptions/{subscription-id}/resourceGroups/{resource-group}/providers/Microsoft.Compute/virtualMachines/{vm-name}/start?api-version=2016-03-30
```

It returns status code 202. Among the header values, you see:

```HTTP
Azure-AsyncOperation : https://management.azure.com/subscriptions/{subscription-id}/providers/Microsoft.Compute/locations/{region}/operations/{operation-id}?api-version=2016-03-30
```

To check the status of the asynchronous operation, sending another request to that URL.

```HTTP
GET 
https://management.azure.com/subscriptions/{subscription-id}/providers/Microsoft.Compute/locations/{region}/operations/{operation-id}?api-version=2016-03-30
```

The response body contains the status of the operation:

```json
{
  "startTime": "2017-01-06T18:58:24.7596323+00:00",
  "status": "InProgress",
  "name": "9a062a88-e463-4697-bef2-fe039df73a02"
}
```

### Deploy resources (201 with Azure-AsyncOperation)

This example shows how to determine the status of **deployments** operation for deploying resources to Azure. The initial request is in the following format:

```HTTP
PUT
https://management.azure.com/subscriptions/{subscription-id}/resourcegroups/{resource-group}/providers/microsoft.resources/deployments/{deployment-name}?api-version=2016-09-01
```

It returns status code 201. The body of the response includes:

```json
"provisioningState":"Accepted",
```

Among the header values, you see:

```HTTP
Azure-AsyncOperation: https://management.azure.com/subscriptions/{subscription-id}/resourcegroups/{resource-group}/providers/Microsoft.Resources/deployments/{deployment-name}/operationStatuses/{operation-id}?api-version=2016-09-01
```

To check the status of the asynchronous operation, sending another request to that URL.

```HTTP
GET 
https://management.azure.com/subscriptions/{subscription-id}/resourcegroups/{resource-group}/providers/Microsoft.Resources/deployments/{deployment-name}/operationStatuses/{operation-id}?api-version=2016-09-01
```

The response body contains the status of the operation:

```json
{"status":"Running"}
```

When the deployment is finished, the response contains:

```json
{"status":"Succeeded"}
```

### Create storage account (202 with Location and Retry-After)

This example shows how to determine the status of the **create** operation for storage accounts. The initial request is in the following format:

```HTTP
PUT
https://management.azure.com/subscriptions/{subscription-id}/resourceGroups/{resource-group}/providers/Microsoft.Storage/storageAccounts/{storage-name}?api-version=2016-01-01
```

And the request body contains properties for the storage account:

```json
{ "location": "South Central US", "properties": {}, "sku": { "name": "Standard_LRS" }, "kind": "Storage" }
```

It returns status code 202. Among the header values, you see the following two values:

```HTTP
Location: https://management.azure.com/subscriptions/{subscription-id}/providers/Microsoft.Storage/operations/{operation-id}?monitor=true&api-version=2016-01-01
Retry-After: 17
```

After waiting for number of seconds specified in Retry-After, check the status of the asynchronous operation by sending another request to that URL.

```HTTP
GET 
https://management.azure.com/subscriptions/{subscription-id}/providers/Microsoft.Storage/operations/{operation-id}?monitor=true&api-version=2016-01-01
```

If the request is still running, you receive a status code 202. If the request has completed, your receive a status code 200, and the body of the response contains the properties of the storage account that has been created.

## Next steps

* For documentation about each REST operation, see [REST API documentation](/rest/api/).
* for information about deploying templates through the Resource Manager REST API, see [Deploy resources with Resource Manager templates and Resource Manager REST API](resource-group-template-deploy-rest.md).