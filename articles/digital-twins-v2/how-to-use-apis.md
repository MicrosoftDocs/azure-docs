---
# Mandatory fields.
title: Use the Azure Digital Twins APIs
titleSuffix: Azure Digital Twins
description: Understand details of the Azure Digital Twins API surface
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 3/5/2020
ms.topic: how-to
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Developer overview of Azure Digital Twins APIs

This section gives a brief overview of the API surface of Azure Digital Twins, as provided by the C# SDK. 

## C# SDK overview

Like all Azure Digital Twins language SDKs, the C# SDK follows the latest iteration of the Azure API guidelines (documented [here](https://azure.github.io/azure-sdk/general_introduction.html)). The guidelines specific to C# can be found [here](https://azure.github.io/azure-sdk/dotnet_introduction.html).

For C#, all SDK calls are available in synchronous and asynchronous versions.

> [!NOTE]
> API code samples in this documentation favor the synchronous calls for brevity. Error checking code is also omitted for this reason.

### Responses from the SDK

Response objects from the SDK follow these conventions:

* All SDK functions that correspond to service calls return an object that represents the service response. This object is of type: `Response`, `Response<T>`.
* For service methods that return data, the response type is a generic type that is parameterized with the expected return type. For example, if the return type is string, the response would be of type `Response<string>`.
* For asynchronous methods, the response object is wrapped in a Task: `Task<Response>`, `Task<Response<T>>`.
* SDK functions that return paginated results from the server deliver: `IEnumerable<Response<T>>`, `IAsyncEnumerable<Response<T>>`.

All service calls in the C# service SDK for Azure Digital Twins will throw `ResponseFailedExceptions` on return of a non-success status code. 

### Returning twin data

Most SDKs for strongly-typed languages in Azure return strongly-typed objects when REST APIs retrieve data. Azure Digital Twins follows this standard for statically defined classes. 

However, most data in Azure Digital Twins is based on types that are defined dynamically in [Digital Twin Definition Language (DTDL)](https://github.com/Azure/IoTPlugandPlay/tree/master/DTDL). These types are not known to the SDK. Thus, in all cases where DTDL-defined twin data is returned by the Azure Digital Twins APIs, the C# SDK for Azure Digital Twins returns JSON data, in the form of JSON documents (`System.Text.Json.JsonDocument`). 

> [!TIP]
> For more information on `System.Text.Json.JsonDocument`, see documentation on the [`System.Text.Json` namespace](https://docs.microsoft.com/dotnet/api/system.text.json?view=netcore-3.0) or [JSON serialization](https://docs.microsoft.com/dotnet/standard/serialization/system-text-json-how-to?view=netcore-3.0).

For the same reason, any twin information that you provide to the SDK must be in the form of JSON or [JSON Patch](http://jsonpatch.com/) documents.

## API surface summary

The Azure Digital Twins SDK surface can be broadly divided into the following categories: 

* **Model Management APIs** — The Model Management APIs are used to manage the [models](concepts-models.md) in an Azure Digital Twins instance. Management activities include upload, validation, and retrieval of twin models authored in DTDL.
* **Twin APIs** — The Twin APIs let developers create, modify, and delete [twins](concepts-twins-graph.md) and their relationships in an Azure Digital Twins instance.
* **Query APIs** — The Query APIs let developers [find sets of twins in the graph](concepts-query-graph.md) across relationships and applying filters.
* **Event and Routing APIs** — The Event APIs let developers [wire up event flow](concepts-route-events.md) through the system, as well as to downstream services.

## Next steps

See how to use the APIs to manage models, twins, and graphs:
* [Manage an object model](how-to-manage-model.md)
* [Manage an individual twin](how-to-manage-twin.md)
* [Manage an Azure Digital Twins graph](how-to-manage-graph.md)