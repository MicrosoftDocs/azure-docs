---
# Mandatory fields.
title: Use the Azure Digital Twins C# SDK
titleSuffix: Azure Digital Twins
description: Understand details of the Azure Digital Twins SDK for C#
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 3/10/2020
ms.topic: how-to
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Azure Digital Twins SDK overview - C#

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

## Next steps

Learn about the types of Azure Digital Twins APIs:
* [Use the Azure Digital Twins APIs](how-to-use-apis.md)