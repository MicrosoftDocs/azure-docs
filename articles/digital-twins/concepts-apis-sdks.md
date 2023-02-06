---
# Mandatory fields.
title: Azure Digital Twins APIs and SDKs
titleSuffix: Azure Digital Twins
description: Learn about the Azure Digital Twins API and SDK options, including information about SDK helper classes and general usage notes.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 12/16/2022
ms.topic: conceptual
ms.service: digital-twins
ms.custom: engagement-fy23

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Azure Digital Twins APIs and SDKs

This article gives an overview of the Azure Digital Twins APIs available, and the methods for interacting with them. You can either use the REST APIs directly with their associated Swaggers (through a tool like [Postman](how-to-use-postman-with-digital-twins.md)), or through an SDK.

Azure Digital Twins comes equipped with control plane APIs, data plane APIs, and SDKs for managing your instance and its elements. 
* The control plane APIs are [Azure Resource Manager (ARM)](../azure-resource-manager/management/overview.md) APIs, and cover resource management operations like creating and deleting your instance. 
* The data plane APIs are Azure Digital Twins APIs, and are used for data management operations like managing models, twins, and the graph.
* The SDKs take advantage of the existing APIs to allow for ease of development of custom applications making use of Azure Digital Twins.

## Control plane APIs

The control plane APIs are [ARM](../azure-resource-manager/management/overview.md) APIs used to manage your Azure Digital Twins instance as a whole, so they cover operations like creating or deleting your entire instance. You'll also use these APIs to create and delete endpoints.

To call the APIs directly, reference the latest Swagger folder in the [control plane Swagger repo](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/digitaltwins/resource-manager/Microsoft.DigitalTwins/stable). This folder also includes a folder of examples that show the usage.

Here are the SDKs currently available for the Azure Digital Twins control APIs.

| SDK language | Package link | Reference documentation | Source code |
| --- | --- | --- | --- |
| .NET (C#) | [Azure.ResourceManager.DigitalTwins on NuGet](https://www.nuget.org/packages/Azure.ResourceManager.DigitalTwins) | [Reference for Azure DigitalTwins SDK for .NET](/dotnet/api/overview/azure/digitaltwins) | [Microsoft Azure Digital Twins management client library for .NET on GitHub](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/digitaltwins/Azure.ResourceManager.DigitalTwins) |
| Java | [azure-resourcemanager-digitaltwins on Maven](https://repo1.maven.org/maven2/com/azure/resourcemanager/azure-resourcemanager-digitaltwins/) | [Reference for Resource Management - Digital Twins](/java/api/overview/azure/digital-twins) | [Azure Resource Manager AzureDigitalTwins client library for Java on GitHub](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/digitaltwins) |
| JavaScript | [AzureDigitalTwinsManagement client library for JavaScript on npm](https://www.npmjs.com/package/@azure/arm-digitaltwins) | | [AzureDigitalTwinsManagement client library for JavaScript on GitHub](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/digitaltwins/arm-digitaltwins) |
| Python | [azure-mgmt-digitaltwins on PyPI](https://pypi.org/project/azure-mgmt-digitaltwins/) | | [Microsoft Azure SDK for Python on GitHub](https://github.com/Azure/azure-sdk-for-python/tree/release/v3/sdk/digitaltwins/azure-mgmt-digitaltwins) |
| Go | [azure-sdk-for-go/services/digitaltwins/mgmt](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/services/digitaltwins/mgmt) | | [Azure SDK for Go on GitHub](https://github.com/Azure/azure-sdk-for-go)

You can also exercise control plane APIs by interacting with Azure Digital Twins through the [Azure portal](https://portal.azure.com) and [CLI](/cli/azure/dt).

## Data plane APIs

The data plane APIs are the Azure Digital Twins APIs used to manage the elements within your Azure Digital Twins instance. They include operations like creating routes, uploading models, creating relationships, and managing twins, and can be broadly divided into the following categories:
* `DigitalTwinModels` - The DigitalTwinModels category contains APIs to manage the [models](concepts-models.md) in an Azure Digital Twins instance. Management activities include upload, validation, retrieval, and deletion of models authored in DTDL.
* `DigitalTwins` - The DigitalTwins category contains the APIs that let developers create, modify, and delete [digital twins](concepts-twins-graph.md) and their relationships in an Azure Digital Twins instance.
* `Query` - The Query category lets developers [find sets of digital twins in the twin graph](how-to-query-graph.md) across relationships.
* `Event Routes` - The Event Routes category contains APIs to [route data](concepts-route-events.md), through the system and to downstream services.

To call the APIs directly, reference the latest Swagger folder in the [data plane Swagger repo](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/digitaltwins/data-plane/Microsoft.DigitalTwins). This folder also includes a folder of examples that show the usage. You can also view the [data plane API reference documentation](/rest/api/azure-digitaltwins/).

Here are the SDKs currently available for the Azure Digital Twins control APIs.

| SDK language | Package link | Reference documentation | Source code |
| --- | --- | --- | --- |
| .NET (C#) | [Azure.DigitalTwins.Core on NuGet](https://www.nuget.org/packages/Azure.DigitalTwins.Core) | [Reference for Azure IoT Digital Twins client library for .NET](/dotnet/api/overview/azure/digitaltwins.core-readme) | [Azure IoT Digital Twins client library for .NET on GitHub](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/digitaltwins/Azure.DigitalTwins.Core) |
| Java | [com.azure:azure-digitaltwins-core on Maven](https://search.maven.org/artifact/com.azure/azure-digitaltwins-core/1.0.0/jar) | [Reference for Azure Digital Twins SDK for Java](/java/api/overview/azure/digital-twins) | [Azure IoT Digital Twins client library for Java on GitHub](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/digitaltwins/azure-digitaltwins-core) |
| JavaScript | [Azure Azure Digital Twins Core client library for JavaScript on npm](https://www.npmjs.com/package/@azure/digital-twins-core) | [Reference for @azure/digital-twins-core](/javascript/api/@azure/digital-twins-core) | [Azure Azure Digital Twins Core client library for JavaScript on GitHub](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/digitaltwins/digital-twins-core) |
| Python | [Azure Azure Digital Twins Core client library for Python on PyPI](https://pypi.org/project/azure-digitaltwins-core/) | [Reference for azure-digitaltwins-core](/python/api/azure-digitaltwins-core/azure.digitaltwins.core) | [Azure Azure Digital Twins Core client library for Python on GitHub](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/digitaltwins/azure-digitaltwins-core) |

You can also exercise date plane APIs by interacting with Azure Digital Twins through the [CLI](/cli/azure/dt).

## Usage notes

This section contains more detailed information about using the APIs and SDKs.

Here's some general information:
* The underlying SDK is `Azure.Core`. See the [Azure namespace documentation](/dotnet/api/azure?view=azure-dotnet&preserve-view=true) for reference on the SDK infrastructure and types.
* You can use an HTTP REST-testing tool like Postman to make direct calls to the Azure Digital Twins APIs. For more information about this process, see [Call the Azure Digital Twins APIs with Postman](how-to-use-postman-with-digital-twins.md).
* Azure Digital Twins doesn't currently support Cross-Origin Resource Sharing (CORS). For more info about the impact and resolution strategies, see [Cross-Origin Resource Sharing (CORS) for Azure Digital Twins](concepts-security.md#cross-origin-resource-sharing-cors).

Here are some details about authentication:
* To use the SDK, instantiate the `DigitalTwinsClient` class. The constructor requires credentials that can be obtained with different kinds of authentication methods in the `Azure.Identity` package. For more on `Azure.Identity`, see its [namespace documentation](/dotnet/api/azure.identity?view=azure-dotnet&preserve-view=true). 
* You may find the `InteractiveBrowserCredential` useful while getting started, but there are several other options, including credentials for [managed identity](/dotnet/api/azure.identity.interactivebrowsercredential?view=azure-dotnet&preserve-view=true), which you'll likely use to authenticate [Azure functions set up with MSI](../app-service/overview-managed-identity.md?tabs=dotnet) against Azure Digital Twins. For more about `InteractiveBrowserCredential`, see its [class documentation](/dotnet/api/azure.identity.interactivebrowsercredential?view=azure-dotnet&preserve-view=true).
* Requests to the Azure Digital Twins APIs require a user or service principal that is a part of the same [Azure Active Directory](../active-directory/fundamentals/active-directory-whatis.md) (Azure AD) tenant where the Azure Digital Twins instance exists. To prevent malicious scanning of Azure Digital Twins endpoints, requests with access tokens from outside the originating tenant will be returned a "404 Sub-Domain not found" error message. This error will be returned even if the user or service principal was given an Azure Digital Twins Data Owner or Azure Digital Twins Data Reader role through [Azure AD B2B](../active-directory/external-identities/what-is-b2b.md) collaboration. For information on how to achieve access across multiple tenants, see [Write app authentication code](how-to-authenticate-client.md#authenticate-across-tenants).

Here are some details about functions and returned data:
* All service API calls are exposed as member functions on the `DigitalTwinsClient` class.
* All service functions exist in synchronous and asynchronous versions.
* All service functions throw an exception for any return status of 400 or above. Make sure you wrap calls into a `try` section, and catch at least `RequestFailedExceptions`. For more about this type of exception, see its [reference documentation](/dotnet/api/azure.requestfailedexception?view=azure-dotnet&preserve-view=true).
* Most service methods return `Response<T>` or (`Task<Response<T>>` for the asynchronous calls), where `T` is the class of return object for the service call. The [Response](/dotnet/api/azure.response-1?view=azure-dotnet&preserve-view=true) class encapsulates the service return and presents return values in its `Value` field.  
* Service methods with paged results return `Pageable<T>` or `AsyncPageable<T>` as results. For more about the `Pageable<T>` class, see its [reference documentation](/dotnet/api/azure.pageable-1?view=azure-dotnet&preserve-view=true); for more about `AsyncPageable<T>`, see its [reference documentation](/dotnet/api/azure.asyncpageable-1?view=azure-dotnet&preserve-view=true).
* You can iterate over paged results using an `await foreach` loop. For more about this process, see [Iterating with Async Enumerables in C# 8](/archive/msdn-magazine/2019/november/csharp-iterating-with-async-enumerables-in-csharp-8).
* Service methods return strongly typed objects wherever possible. However, because Azure Digital Twins is based on models custom-configured by the user at runtime (via DTDL models uploaded to the service), many service APIs take and return twin data in JSON format.

### Serialization helpers in the .NET (C#) SDK

Serialization helpers are helper functions available within the [.NET (C#) SDK](/dotnet/api/overview/azure/digitaltwins.core-readme) for quickly creating or deserializing twin data for access to basic information. Since the core SDK methods return twin data as JSON by default, it can be helpful to use these helper classes to break down the twin data further.

The available helper classes are:
* `BasicDigitalTwin`: Generically represents the core data of a digital twin
* `BasicDigitalTwinComponent`: Generically represents a component in the `Contents` properties of a `BasicDigitalTwin`
* `BasicRelationship`: Generically represents the core data of a relationship
* `DigitalTwinsJsonPropertyName`: Contains the string constants for use in JSON serialization and deserialization for custom digital twin types

## Monitor API metrics

API metrics such as requests, latency, and failure rate can be viewed in the [Azure portal](https://portal.azure.com/). 

For information about viewing and managing metrics with Azure Monitor, see [Get started with metrics explorer](../azure-monitor/essentials/metrics-getting-started.md). For a full list of API metrics available for Azure Digital Twins, see [Azure Digital Twins API request metrics](how-to-monitor.md#api-request-metrics).

## Next steps

See how to make direct requests to the Azure Digital Twins APIs using Postman:
* [Call the Azure Digital Twins APIs with Postman](how-to-use-postman-with-digital-twins.md)

Or, practice using the .NET SDK by creating a client app with this tutorial:
* [Code a client app](tutorial-code.md)
