---
title: Azure Maps Long-Running Operation API
description: Learn about long-running asynchronous background processing in Azure Maps
author: faterceros
ms.author: aterceros
ms.date: 12/07/2020
ms.topic: how-to
ms.service: azure-maps
ms.subservice: creator
ms.custom: mvc
---

# Creator Long-Running Operation API

> [!NOTE]
>
> **Azure Maps Creator retirement**
>
> The Azure Maps Creator indoor map service is now deprecated and will be retired on 9/30/25. For more information, see [End of Life Announcement of Azure Maps Creator](https://aka.ms/AzureMapsCreatorDeprecation).

Some APIs in Azure Maps use an [Asynchronous Request-Reply pattern]. This pattern allows Azure Maps to provide highly available and responsive services. This article explains Azure Map's specific implementation of long-running asynchronous background processing.

## Submitting a request

A client application starts a long-running operation through a synchronous call to an HTTP API. Typically, this call is in the form of an HTTP POST request. When an asynchronous workload is successfully created, the API returns an HTTP `202` status code, indicating that the request has been accepted. This response contains a `Location` header pointing to an endpoint that the client can poll to check the status of the long-running operation.

### Example of a success response

```HTTP
Status: 202 Accepted
Location: https://atlas.microsoft.com/service/operations/{operationId}

```

If the call doesn't pass validation, the API returns an HTTP `400` response for a Bad Request. The response body provides the client more information on why the request was invalid.

### Monitoring the operation status

The location endpoint provided in the accepted response headers can be polled to check the status of the long-running operation. The response body from operation status request contains the `status` and the `createdDateTime` properties. The `status` property shows the current state of the long-running operation. Possible states include `"NotStarted"`, `"Running"`, `"Succeeded"`, and `"Failed"`. The `createdDateTime` property shows the time the initial request was made to start the long-running operation. When the state is either `"NotStarted"` or `"Running"`, a `Retry-After` header is also provided with the response. The `Retry-After` header, measured in seconds, can be used to determine when the next polling call to the operation status API should be made.

### Example of running a status response

```HTTP
Status: 200 OK
Retry-After: 30
{
    "operationId": "c587574e-add9-4ef7-9788-1635bed9a87e",
    "createdDateTime": "3/11/2020 8:45:13 PM +00:00",
    "status": "Running"
}
```

## Handling operation completion

Once the long-running operation completes, the status of the response is either `"Succeeded"` or `"Failed"`. When a new resource has been created from a long-running operation, the success response returns an HTTP `201 Created` status code. The response also contains a `Location` header that points to metadata about the resource. When no new resource has been created, the success response returns an HTTP `200 OK` status code. Upon a failure, the response status code is also `200 OK`. However, the response has an `error` property in the body. The error data adheres to the OData error specification.

### Example of success response

```HTTP
Status: 201 Created
Location: "https://atlas.microsoft.com/tileset/{tileset-id}"
 {
    "operationId": "c587574e-add9-4ef7-9788-1635bed9a87e",
    "createdDateTime": "3/11/2020 8:45:13 PM +00:00",
    "status": "Succeeded",
    "resourceLocation": "https://atlas.microsoft.com/tileset/{tileset-id}"
}
```

### Example of failure response

```HTTP
Status: 200 OK

{
    "operationId": "c587574e-add9-4ef7-9788-1635bed9a87e",
    "createdDateTime": "3/11/2020 8:45:13 PM +00:00",
    "status": "Failed",
    "error": {
        "code": "InvalidFeature",
        "message": "The provided feature is invalid.",
        "details": {
            "code": "NoGeometry",
            "message": "No geometry was provided with the feature."
        }
    }
}
```

[Asynchronous Request-Reply pattern]: /azure/architecture/patterns/async-request-reply
