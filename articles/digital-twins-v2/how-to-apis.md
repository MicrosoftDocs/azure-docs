---
# Mandatory fields.
title: Use the ADT APIs
description: See details about using the Azure Digital Twins API surface
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 2/21/2020
ms.topic: conceptual
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Developer overview of Azure Digital Twins APIs

This section gives a brief overview of the API surface of ADT as provided by the C# SDK. 

> [!NOTE]
> Include reference documentation link for additional details.

> [!NOTE]
> Documentation needs to be extended with examples and snippets in all SDK languages

## SDK Overview
Like all ADT language SDKs, the C# SDK follows the latest iteration of the Azure API guidelines. These are documented here:
* https://azure.github.io/azure-sdk/general_introduction.html
The specific documentation for C# is here:
* https://azure.github.io/azure-sdk/dotnet_introduction.html

As a summary:
* For C#, all SDK calls are available in synchronous and asynchronous versions. This overview documentations mostly uses the synchronous versions for brevity.
* All SDK functions that correspond to service calls return an object that represents the service response. This object is of type: `Response`, `Response<T>`.
* For service methods that return data, the Response type is a generic type that is parameterized with the expected return type. For example, if the return type is string: `Response<string>`
* For asynchronous methods, the response object is wrapped in a Task: `Task<Response>`, `Task<Response<T>>`.
* SDK functions that return paginated results from the server deliver: `IEnumerable<Response<T>>`, `IAsyncEnumerable<Response<T>>`
* All service calls in the C# service SDK for ADT will throw ResponseFailedExceptions on return of a non-success status code. 

In the code snippets below, we have omitted try/catch clauses for clarity and brevity.

> [!NOTE]
> Add a reference to user guidelines for APIs following the SDK guidelines

## Twin Data Returned from ADT APIs

In general, SDKs for strongly typed languages in Azure should return strongly typed objects for data returned by REST APIs. ADT follows these guidelines for statically defined classes. However, in ADT most data is based on types you dynamically define in DTDL. These types are not known to the SDK. In all cases where DTDL-defined twin data is returned by the ADT APIs, the C# SDK for ADT will return JSON data in form of a JsonDocument (System.Text.Json.JsonDocument). 
See the following links for more information on System.Text.Json.JsonDocument:
* https://docs.microsoft.com/en-us/dotnet/api/system.text.json?view=netcore-3.0
* https://docs.microsoft.com/en-us/dotnet/standard/serialization/system-text-json-how-to?view=netcore-3.0

In the same way, you will need to provide twin information to the SDK in form of JSON or JSON Patch documents.

## API Surface

The ADT SDK surface broadly can be divided into the following categories: 
* Model Management APIs. These are APIs used to manage the models (types of twins and relationships) that a given ADT instance knows about. This includes upload, validation and retrieval of twin models authored in DTDL. 
* Twin APIs. The Twin APIs let developers create, modify and delete twins and their relationships in an ADT instance
* Query APIs. The Query APIs let developers find sets of twins in the graph across relationships and applying filters
* Event and Routing APIs. The Event APIs let developers wire-up event flow throughout the system, as well as to downstream services.
