---
# Mandatory fields.
title: Azure Digital Twins APIs and SDKs
titleSuffix: Azure Digital Twins
description: Understand the Azure Digital Twins API and SDK options.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 04/30/2021
ms.topic: conceptual
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Azure Digital Twins APIs and SDKs

Azure Digital Twins comes equipped with both **control plane APIs** and **data plane APIs** for managing your instance and its elements. 
* The control plane APIs are [Azure Resource Manager (ARM)](../azure-resource-manager/management/overview.md) APIs, and cover resource management operations like creating and deleting your instance. 
* The data plane APIs are Azure Digital Twins APIs, and are used for data management operations like managing models, twins, and the graph.

This article gives an overview of the APIs available, and the methods for interacting with them. You can either use the REST APIs directly with their associated Swaggers (through a tool like [Postman](how-to-use-postman.md)), or through an SDK.

## Overview: control plane APIs

The control plane APIs are [ARM](../azure-resource-manager/management/overview.md) APIs used to manage your Azure Digital Twins instance as a whole, so they cover operations like creating or deleting your entire instance. You'll also use these APIs to create and delete endpoints.

The most current control plane API version is _**2020-12-01**_.

To use the control plane APIs:
* You can call the APIs directly by referencing the latest Swagger folder in the [control plane Swagger repo](https://github.com/Azure/azure-rest-api-specs/tree/master/specification/digitaltwins/resource-manager/Microsoft.DigitalTwins/stable). This folder also includes a folder of examples that show the usage.
* You can currently access SDKs for control APIs in...
  - [.NET (C#)](https://www.nuget.org/packages/Microsoft.Azure.Management.DigitalTwins/) ([reference [auto-generated]](/dotnet/api/overview/azure/digitaltwins/management?view=azure-dotnet&preserve-view=true)) ([source](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/digitaltwins/Microsoft.Azure.Management.DigitalTwins))
  - [Java](https://search.maven.org/search?q=a:azure-mgmt-digitaltwins) ([reference [auto-generated]](/java/api/overview/azure/digitaltwins?view=azure-java-stable&preserve-view=true)) ([source](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/digitaltwins))
  - [JavaScript](https://www.npmjs.com/package/@azure/arm-digitaltwins) ([source](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/digitaltwins/arm-digitaltwins))
  - [Python](https://pypi.org/project/azure-mgmt-digitaltwins/) ([source](https://github.com/Azure/azure-sdk-for-python/tree/release/v3/sdk/digitaltwins/azure-mgmt-digitaltwins))
  - [Go](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/services/digitaltwins/mgmt) ([source](https://github.com/Azure/azure-sdk-for-go/tree/master/services/digitaltwins/mgmt))

You can also exercise control plane APIs by interacting with Azure Digital Twins through the [Azure portal](https://portal.azure.com) and [CLI](/cli/azure/dt?view=azure-cli-latest&preserve-view=true).

## Overview: data plane APIs

The data plane APIs are the Azure Digital Twins APIs used to manage the elements within your Azure Digital Twins instance. They include operations like creating routes, uploading models, creating relationships, and managing twins, and can be broadly divided into the following categories:
* **DigitalTwinModels** - The DigitalTwinModels category contains APIs to manage the [models](concepts-models.md) in an Azure Digital Twins instance. Management activities include upload, validation, retrieval, and deletion of models authored in DTDL.
* **DigitalTwins** - The DigitalTwins category contains the APIs that let developers create, modify, and delete [digital twins](concepts-twins-graph.md) and their relationships in an Azure Digital Twins instance.
* **Query** - The Query category lets developers [find sets of digital twins in the twin graph](how-to-query-graph.md) across relationships.
* **Event Routes** - The Event Routes category contains APIs to [route data](concepts-route-events.md), through the system and to downstream services.

The most current data plane API version is _**2020-10-31**_.

To use the data plane APIs:
* You can call the APIs directly, by...
   - referencing the latest Swagger folder in the [data plane Swagger repo](https://github.com/Azure/azure-rest-api-specs/tree/master/specification/digitaltwins/data-plane/Microsoft.DigitalTwins). This folder also includes a folder of examples that show the usage. 
   - viewing the [API reference documentation](/rest/api/azure-digitaltwins/).
* You can use the **.NET (C#) SDK**. To use the .NET SDK...
   - you can view and add the package from NuGet: [Azure.DigitalTwins.Core](https://www.nuget.org/packages/Azure.DigitalTwins.Core). 
   - you can view the [SDK reference documentation](/dotnet/api/overview/azure/digitaltwins/client?view=azure-dotnet&preserve-view=true).
   - you can find the SDK source, including a folder of samples, in GitHub: [Azure IoT Digital Twins client library for .NET](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/digitaltwins/Azure.DigitalTwins.Core). 
   - you can see detailed information and usage examples by continuing to the [.NET (C#) SDK (data plane)](#net-c-sdk-data-plane) section of this article.
* You can use the **Java SDK**. To use the Java SDK...
   - you can view and install the package from Maven: [`com.azure:azure-digitaltwins-core`](https://search.maven.org/artifact/com.azure/azure-digitaltwins-core/1.0.0/jar)
   - you can view the [SDK reference documentation](/java/api/overview/azure/digitaltwins/client?view=azure-java-stable&preserve-view=true)
   - you can find the SDK source in GitHub: [Azure IoT Digital Twins client library for Java](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/digitaltwins/azure-digitaltwins-core)
* You can use the **JavaScript SDK**. To use the JavaScript SDK...
   - you can view and install the package from npm: [Azure Azure Digital Twins Core client library for JavaScript](https://www.npmjs.com/package/@azure/digital-twins-core).
   - you can view the [SDK reference documentation](/javascript/api/@azure/digital-twins-core/?view=azure-node-latest&preserve-view=true).
   - you can find the SDK source in GitHub: [Azure Azure Digital Twins Core client library for JavaScript](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/digitaltwins/digital-twins-core)
* You can use the **Python SDK**. To use the Python SDK...
   - you can view and install the package from PyPi: [Azure Azure Digital Twins Core client library for Python](https://pypi.org/project/azure-digitaltwins-core/).
   - you can view the [SDK reference documentation](/python/api/azure-digitaltwins-core/azure.digitaltwins.core?view=azure-python&preserve-view=true).
   - you can find the SDK source in GitHub: [Azure Azure Digital Twins Core client library for Python](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/digitaltwins/azure-digitaltwins-core)

You can also exercise date plane APIs by interacting with Azure Digital Twins through the [CLI](/cli/azure/dt?view=azure-cli-latest&preserve-view=true).

## .NET (C#) SDK (data plane)

The Azure Digital Twins .NET (C#) SDK is part of the Azure SDK for .NET. It's open source, and is based on the Azure Digital Twins data plane APIs.

> [!NOTE]
> For more information on SDK design, see the general [design principles for Azure SDKs](https://azure.github.io/azure-sdk/general_introduction.html) and the specific [.NET design guidelines](https://azure.github.io/azure-sdk/dotnet_introduction.html).

To use the SDK, include the NuGet package **Azure.DigitalTwins.Core** with your project. You'll also need the latest version of the **Azure.Identity** package. In Visual Studio, you can add these packages using the NuGet Package Manager (accessed through *Tools > NuGet Package Manager > Manage NuGet Packages for Solution*). You can also use the .NET command-line tool with the commands found in the NuGet package links below to add these to your project:
* [Azure.DigitalTwins.Core](https://www.nuget.org/packages/Azure.DigitalTwins.Core): The package for the [Azure Digital Twins SDK for .NET](/dotnet/api/overview/azure/digitaltwins/client?view=azure-dotnet&preserve-view=true). 
* [Azure.Identity](https://www.nuget.org/packages/Azure.Identity): The library that provides tools to help with authentication against Azure.

For a detailed walk-through of using the APIs in practice, see [Code a client app](tutorial-code.md). 

### Serialization helpers

Serialization helpers are helper functions available within the SDK for quickly creating or deserializing twin data for access to basic information. Since the core SDK methods return twin data as JSON by default, it can be helpful to use these helper classes to break down the twin data further.

The available helper classes are:
* `BasicDigitalTwin`: Generically represents the core data of a digital twin
* `BasicDigitalTwinComponent`: Generically represents a component in the `Contents` properties of a `BasicDigitalTwin`
* `BasicRelationship`: Generically represents the core data of a relationship
* `DigitalTwinsJsonPropertyName`: Contains the string constants for use in JSON serialization and deserialization for custom digital twin types

## General API/SDK usage notes

> [!NOTE]
> Please note that Azure Digital Twins doesn't currently support **Cross-Origin Resource Sharing (CORS)**. For more info about the impact and resolution strategies, see the [Cross-Origin Resource Sharing (CORS)](concepts-security.md#cross-origin-resource-sharing-cors) section of *Concepts: Security for Azure Digital Twins solutions*.

The following list provides more detail and general guidelines for using the APIs and SDKs.

* You can use an HTTP REST-testing tool like Postman to make direct calls to the Azure Digital Twins APIs. For more information about this process, see [Make API requests with Postman](how-to-use-postman.md).
* To use the SDK, instantiate the `DigitalTwinsClient` class. The constructor requires credentials that can be obtained with different kinds of authentication methods in the `Azure.Identity` package. For more on `Azure.Identity`, see its [namespace documentation](/dotnet/api/azure.identity?view=azure-dotnet&preserve-view=true). 
* You may find the `InteractiveBrowserCredential` useful while getting started, but there are several other options, including credentials for [managed identity](/dotnet/api/azure.identity.interactivebrowsercredential?view=azure-dotnet&preserve-view=true), which you'll likely use to authenticate [Azure functions set up with MSI](../app-service/overview-managed-identity.md?tabs=dotnet) against Azure Digital Twins. For more about `InteractiveBrowserCredential`, see its [class documentation](/dotnet/api/azure.identity.interactivebrowsercredential?view=azure-dotnet&preserve-view=true).
* Requests to the Azure Digital Twins APIs require a user or service principal that is a part of the same [Azure Active Directory](../active-directory/fundamentals/active-directory-whatis.md) (Azure AD) tenant where the Azure Digital Twins instance exists. To prevent malicious scanning of Azure Digital Twins endpoints, requests with access tokens from outside the originating tenant will be returned a "404 Sub-Domain not found" error message. This error will be returned *even if* the user or service principal was given an Azure Digital Twins Data Owner or Azure Digital Twins Data Reader role through [Azure AD B2B](../active-directory/external-identities/what-is-b2b.md) collaboration. For information on how to achieve access across multiple tenants, see [Write app authentication code](how-to-authenticate-client.md#authenticate-across-tenants).
* All service API calls are exposed as member functions on the `DigitalTwinsClient` class.
* All service functions exist in synchronous and asynchronous versions.
* All service functions throw an exception for any return status of 400 or above. Make sure you wrap calls into a `try` section, and catch at least `RequestFailedExceptions`. For more about this type of exception, see its [reference documentation](/dotnet/api/azure.requestfailedexception?view=azure-dotnet&preserve-view=true).
* Most service methods return `Response<T>` or (`Task<Response<T>>` for the asynchronous calls), where `T` is the class of return object for the service call. The [Response](/dotnet/api/azure.response-1?view=azure-dotnet&preserve-view=true) class encapsulates the service return and presents return values in its `Value` field.  
* Service methods with paged results return `Pageable<T>` or `AsyncPageable<T>` as results. For more about the `Pageable<T>` class, see its [reference documentation](/dotnet/api/azure.pageable-1?view=azure-dotnet&preserve-view=true); for more about `AsyncPageable<T>`, see its [reference documentation](/dotnet/api/azure.asyncpageable-1?view=azure-dotnet&preserve-view=true).
* You can iterate over paged results using an `await foreach` loop. For more about this process, see the [relevant documentation](/archive/msdn-magazine/2019/november/csharp-iterating-with-async-enumerables-in-csharp-8).
* The underlying SDK is `Azure.Core`. See the [Azure namespace documentation](/dotnet/api/azure?view=azure-dotnet&preserve-view=true) for reference on the SDK infrastructure and types.


Service methods return strongly typed objects wherever possible. However, because Azure Digital Twins is based on models custom-configured by the user at runtime (via DTDL models uploaded to the service), many service APIs take and return twin data in JSON format.

## Monitor API metrics

API metrics such as requests, latency, and failure rate can be viewed in the [Azure portal](https://portal.azure.com/). 

From the portal homepage, search for your Azure Digital Twins instance to pull up its details. Select the **Metrics** option from the Azure Digital Twins instance's menu to bring up the *Metrics* page.

:::image type="content" source="media/troubleshoot-metrics/azure-digital-twins-metrics.png" alt-text="Screenshot showing the metrics page for Azure Digital Twins.":::

From here, you can view the metrics for your instance and create custom views.

## Next steps

See how to make direct requests to the APIs using Postman:
* [Make API requests with Postman](how-to-use-postman.md)

Or, practice using the .NET SDK by creating a client app with this tutorial:
* [Code a client app](tutorial-code.md)
