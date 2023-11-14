---
title: Status of asynchronous operations
description: Describes how to track asynchronous operations in Azure. It shows the values you use to get the status of a long-running operation.
ms.topic: conceptual
ms.date: 01/31/2022
ms.custom: seodec18
---
# Track asynchronous Azure operations

Some Azure REST operations run asynchronously because the operation can't be completed quickly. This article describes how to track the status of asynchronous operations through values returned in the response.  

## Status codes for asynchronous operations

An asynchronous operation initially returns an HTTP status code of either:

* 201 (Created)
* 202 (Accepted)

However, that status code doesn't necessarily mean the operation is asynchronous. An asynchronous operation also returns a value for `provisioningState` that indicates the operation hasn't finished. The value can vary by operation but won't include **Succeeded**, **Failed**, or **Canceled**. Those three values indicate the operation has finished. If no value is returned for `provisioningState`, the operation has finished and succeeded.

When the operation successfully completes, it returns either:

* 200 (OK)
* 204 (No Content)

Refer to the [REST API documentation](/rest/api/azure/) to see the responses for the operation you're executing.

After getting the 201 or 202 response code, you're ready to monitor the status of the operation.

## URL to monitor status

There are two different ways to monitor the status the asynchronous operation. You determine the correct approach by examining the header values that are returned from your original request. First, look for:

* `Azure-AsyncOperation` - URL for checking the ongoing status of the operation. If your operation returns this value, use it to track the status of the operation.
* `Retry-After` - The number of seconds to wait before checking the status of the asynchronous operation.

If `Azure-AsyncOperation` isn't one of the header values, then look for:

* `Location` - URL for determining when an operation has completed. Use this value only when `Azure-AsyncOperation` isn't returned.
* `Retry-After` - The number of seconds to wait before checking the status of the asynchronous operation.

> [!NOTE]
> Your REST client must accept a minimum URL size of 4 KB for `Azure-AsyncOperation` and `Location`.

## Azure-AsyncOperation request and response

If you have a URL from the `Azure-AsyncOperation` header value, send a GET request to that URL. Use the value from `Retry-After` to schedule how often to check the status. You'll get a response object that indicates the status of the operation. A different response is returned when checking the status of the operation with the `Location` URL. For more information about the response from a location URL, see [Create storage account (202 with Location and Retry-After)](#create-storage-account-202-with-location-and-retry-after).

The response properties can vary but always include the status of the asynchronous operation.

```json
{
    "status": "{status-value}"
}
```

The following example shows other values that might be returned from the operation:

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

The error object is returned when the status is Failed or Canceled. All other values are optional. The response you receive may look different than the example.

## provisioningState values

Operations that create, update, or delete (PUT, PATCH, DELETE) a resource typically return a `provisioningState` value. When an operation has completed, one of following three values is returned:

* Succeeded
* Failed
* Canceled

All other values indicate the operation is still running. The resource provider can return a customized value that indicates its state. For example, you may receive **Accepted** when the request is received and running.

## Example requests and responses

### Start virtual machine (202 with Azure-AsyncOperation)

This example shows how to determine the status of [start operation for virtual machines](/rest/api/compute/virtualmachines/start). The initial request is in the following format:

```HTTP
POST 
https://management.azure.com/subscriptions/{subscription-id}/resourceGroups/{resource-group}/providers/Microsoft.Compute/virtualMachines/{vm-name}/start?api-version=2019-12-01
```

It returns status code 202. Among the header values, you see:

```HTTP
Azure-AsyncOperation : https://management.azure.com/subscriptions/{subscription-id}/providers/Microsoft.Compute/locations/{region}/operations/{operation-id}?api-version=2019-12-01
```

To check the status of the asynchronous operation, sending another request to that URL.

```HTTP
GET 
https://management.azure.com/subscriptions/{subscription-id}/providers/Microsoft.Compute/locations/{region}/operations/{operation-id}?api-version=2019-12-01
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

This example shows how to determine the status of [deployments operation for deploying resources](/rest/api/resources/deployments/createorupdate) to Azure. The initial request is in the following format:

```HTTP
PUT
https://management.azure.com/subscriptions/{subscription-id}/resourcegroups/{resource-group}/providers/microsoft.resources/deployments/{deployment-name}?api-version=2020-06-01
```

It returns status code 201. The body of the response includes:

```json
"provisioningState":"Accepted",
```

Among the header values, you see:

```HTTP
Azure-AsyncOperation: https://management.azure.com/subscriptions/{subscription-id}/resourcegroups/{resource-group}/providers/Microsoft.Resources/deployments/{deployment-name}/operationStatuses/{operation-id}?api-version=2020-06-01
```

To check the status of the asynchronous operation, sending another request to that URL.

```HTTP
GET 
https://management.azure.com/subscriptions/{subscription-id}/resourcegroups/{resource-group}/providers/Microsoft.Resources/deployments/{deployment-name}/operationStatuses/{operation-id}?api-version=2020-06-01
```

The response body contains the status of the operation:

```json
{
    "status": "Running"
}
```

When the deployment is finished, the response contains:

```json
{
    "status": "Succeeded"
}
```

### Create storage account (202 with Location and Retry-After)

This example shows how to determine the status of the [create operation for storage accounts](/rest/api/storagerp/storageaccounts/create). The initial request is in the following format:

```HTTP
PUT
https://management.azure.com/subscriptions/{subscription-id}/resourceGroups/{resource-group}/providers/Microsoft.Storage/storageAccounts/{storage-name}?api-version=2019-06-01
```

And the request body contains properties for the storage account:

```json
{
    "location": "South Central US",
    "properties": {},
    "sku": {
        "name": "Standard_LRS"
    },
    "kind": "Storage"
}
```

It returns status code 202. Among the header values, you see the following two values:

```HTTP
Location: https://management.azure.com/subscriptions/{subscription-id}/providers/Microsoft.Storage/operations/{operation-id}?monitor=true&api-version=2019-06-01
Retry-After: 17
```

After waiting for number of seconds specified in Retry-After, check the status of the asynchronous operation by sending another request to that URL.

```HTTP
GET 
https://management.azure.com/subscriptions/{subscription-id}/providers/Microsoft.Storage/operations/{operation-id}?monitor=true&api-version=2019-06-01
```

If the request is still running, you receive a status code 202. If the request has completed, your receive a status code 200. The body of the response contains the properties of the storage account that was created.

## Next steps

* For documentation about each REST operation, see [REST API documentation](/rest/api/azure/).
* For information about deploying templates through the Resource Manager REST API, see [Deploy resources with Resource Manager templates and Resource Manager REST API](../templates/deploy-rest.md).
