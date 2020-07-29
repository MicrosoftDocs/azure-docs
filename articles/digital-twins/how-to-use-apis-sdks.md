---
# Mandatory fields.
title: Use the Azure Digital Twins APIs and SDKs
titleSuffix: Azure Digital Twins
description: See how to work with the Azure Digital Twins APIs, including via SDK.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 06/04/2020
ms.topic: how-to
ms.service: digital-twins
ROBOTS: NOINDEX, NOFOLLOW

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Use the Azure Digital Twins APIs and SDKs

[!INCLUDE [Azure Digital Twins current preview status](../../includes/digital-twins-preview-status.md)]

Azure Digital Twins comes equipped with both **control plane APIs** and **data plane APIs** for managing your instance and its elements. This article gives an overview of the APIs available, and the methods for interacting with them. You can either use the REST APIs directly with their associated Swaggers, or through an SDK.

## Overview: control plane APIs

The control plane APIs are used to manage your Azure Digital Twins instance as a whole, so they cover operations like creating or deleting your entire instance. You will also use these to create and delete endpoints.

The most current control plane API version for public preview is _**2020-03-01-preview**_.

To use the control plane APIs:
* You can call the APIs directly by referencing the latest [Swagger folder](https://github.com/Azure/azure-rest-api-specs/tree/master/specification/digitaltwins/resource-manager/Microsoft.DigitalTwins). This repo also includes a folder of examples that show the usage.
* You can currently access SDKs for control APIs in [Go](https://github.com/Azure/azure-sdk-for-go/releases).

You can also exercise control plane APIs by interacting with Azure Digital Twins through the [Azure portal](https://portal.azure.com) and [CLI](how-to-use-cli.md).

## Overview: data plane APIs

The data plane APIs are used to manage the elements within your Azure Digital Twins instance. They include operations like creating routes, uploading models, creating relationships, and managing twins. They can be broadly divided into the following categories:
* **DigitalTwinsModels** - The DigitalTwinsModels category contains APIs to manage the [models](concepts-models.md) in an Azure Digital Twins instance. Management activities include upload, validation, retrieval, and deletion of models authored in DTDL.
* **DigitalTwins** - The DigitalTwins category contains the APIs that let developers create, modify, and delete [digital twins](concepts-twins-graph.md) and their relationships in an Azure Digital Twins instance.
* **Query** - The Query category lets developers [find sets of digital twins in the twin graph](how-to-query-graph.md) across relationships.
* **EventRoutes** - The EventRoutes category contains APIs to [route data](concepts-route-events.md), through the system and to downstream services.

The most current data plane API version for public preview is _**2020-05-31-preview**_.

To use the data plane APIs:
* You can call the APIs directly, by...
   - referencing the latest [Swagger folder](https://github.com/Azure/azure-rest-api-specs/tree/master/specification/digitaltwins/data-plane/Microsoft.DigitalTwins). This repo also includes a folder of examples that show the usage. 
   - viewing the [API reference documentation](https://docs.microsoft.com/rest/api/azure-digitaltwins/).
* You can use the .NET (C#) SDK. Currently, this is the only published SDK for interacting with these APIs. To use the .NET SDK...
   - you can find the SDK source, including a folder of samples, in GitHub: [Azure IoT Digital Twins client library for .NET](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/digitaltwins/Azure.DigitalTwins.Core). 
   - you can view the package on NuGet: [Azure.DigitalTwins.Core](https://www.nuget.org/packages/Azure.DigitalTwins.Core). 
   - you can view the [SDK reference documentation](https://docs.microsoft.com/dotnet/api/overview/azure/digitaltwins?view=azure-dotnet-preview).
   - you can see detailed information and usage examples by continuing to the [.NET (C#) SDK (data plane)](#net-c-sdk-data-plane) section of this article.
* You can generate an SDK for another language using AutoRest. Follow the instructions in [How-to: Create custom SDKs for Azure Digital Twins with AutoRest](how-to-create-custom-sdks.md).

You can also exercise date plane APIs by interacting with Azure Digital Twins through the [CLI](how-to-use-cli.md).

## .NET (C#) SDK (data plane)

The Azure Digital Twins .NET (C#) SDK is part of the Azure SDK for .NET. It is open source, and is based on the Azure Digital Twins data plane APIs.

> [!NOTE]
> For in-depth information on SDK design, see the general [design principles for Azure SDKs](https://azure.github.io/azure-sdk/general_introduction.html) and the specific [.NET design guidelines](https://azure.github.io/azure-sdk/dotnet_introduction.html).

To use the SDK, include the NuGet package **Azure.DigitalTwins.Core** with your project. You will also need the **Azure.Identity** package.

* In Visual Studio, you can add packages with the NuGet Package Manager (accessed through *Tools > NuGet Package Manager > Manage NuGet Packages for Solution*). 
* Using the .NET command-line tool, you can run:

    ```cmd/sh
    dotnet add package Azure.DigitalTwins.Core --version 1.0.0-preview.2
    dotnet add package Azure.identity
    ```

For a detailed walk-through of using the APIs in practice, see the [Tutorial: Code a client app](tutorial-code.md). 

### .NET SDK usage examples

Here are some code samples illustrating use of the .NET SDK.

Authenticate against the service:

```csharp
// Authenticate against the service and create a client
var credentials = new InteractiveBrowserCredential(tenantId, clientId);
DigitalTwinsClient client = new DigitalTwinsClient(new Uri(adtInstanceUrl), credentials);
```

Upload a model and list models:

```csharp
// Upload a model
var typeList = new List<string>();
string dtdl = File.ReadAllText("SampleModel.json");
typeList.Add(dtdl);
try {
    await client.CreateModelsAsync(typeList);
} catch (RequestFailedException rex) {
    Console.WriteLine($"Load model: {rex.Status}:{rex.Message}");
}
// Read a list of models back from the service
AsyncPageable<ModelData> modelDataList = client.GetModelsAsync();
await foreach (ModelData md in modelDataList)
{
    Console.WriteLine($"Type name: {md.DisplayName}: {md.Id}");
}
```

Create and query twins:

```csharp
// Initialize twin metadata
var meta = new Dictionary<string, object>
{
    { "$model", "dtmi:com:contoso:SampleModel;1" },
};
// Initialize the twin properties
var initData = new Dictionary<string, object>
{
    { "$metadata", meta },
    { "data", "Hello World!" }
};
try {
    await client.CreateDigitalTwinAsync($"firstTwin", JsonSerializer.Serialize(initData));
} catch(RequestFailedException rex) {
    Console.WriteLine($"Create twin error: {rex.Status}:{rex.Message}");  
}

// Run a query    
AsyncPageable<string> result = client.QueryAsync("Select * From DigitalTwins");
await foreach (string twin in result)
{
    object jsonObj = JsonSerializer.Deserialize<object>(twin);
    string prettyTwin = JsonSerializer.Serialize(jsonObj, new JsonSerializerOptions { WriteIndented = true });
    Console.WriteLine(prettyTwin);
}
```

See the [Tutorial: Code a client app](tutorial-code.md) for a walk-through of this sample app code. 

You can also find additional samples in the [GitHub repo for the .NET (C#) SDK](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/digitaltwins/Azure.DigitalTwins.Core/samples).

#### Serialization Helpers

As described earlier, the core SDK methods return twin data as JSON. However, the SDK also contains helper classes for serialization. These helper functions let you quickly create or deserialize twin data for access to basic information.

The available helper classes are:
* `BasicDigitalTwin`: Represents the core data of a digital twin
* `BasicRelationship`: Represents the core data of a relationship
* `UpdateOperationUtility`: Represents JSON Patch information used in update calls
* `WriteableProperty`: Represents property metadata

##### Deserialize a digital twin

You can always deserialize twin data using the JSON library of your choice, like `System.Test.Json` or `Newtonsoft.Json`. For basic access to a twin, the helper classes make this a bit more convenient.

```csharp
Response<string> res = client.GetDigitalTwin(twin_id);
BasicDigitalTwin twin = JsonSerializer.Deserialize<BasicDigitalTwin>(res.Value);
Console.WriteLine($"Model id: {twin.Metadata.ModelId}");
```

The `BasicDigitalTwin` helper class also gives you access to properties defined on the twin, through a `Dictionary<string, object>`. To list properties of the twin, you can use:

```csharp
Response<string> res = client.GetDigitalTwin(twin_id);
BasicDigitalTwin twin = JsonSerializer.Deserialize<BasicDigitalTwin>(res.Value);
Console.WriteLine($"Model id: {twin.Metadata.ModelId}");
foreach (string prop in twin.CustomProperties.Keys)
{
    if (twin.CustomProperties.TryGetValue(prop, out object value))
        Console.WriteLine($"Property '{prop}': {value}");
}
```

##### Create a digital twin

Using the `BasicDigitalTwin` class, you can prepare data for creating a twin instance:

```csharp
BasicDigitalTwin twin = new BasicDigitalTwin();
twin.Metadata = new DigitalTwinMetadata();
twin.Metadata.ModelId = "dtmi:example:Room;1";
// Initialize properties
Dictionary<string, object> props = new Dictionary<string, object>();
props.Add("Temperature", 25.0);
twin.CustomProperties = props;

client.CreateDigitalTwin("myNewRoomID", JsonSerializer.Serialize<BasicDigitalTwin>(twin));
```

The code above is equivalent to the following "manual" variant:

```csharp
Dictionary<string, object> meta = new Dictionary<string, object>()
{
    { "$model", "dtmi:example:Room;1"}
};
Dictionary<string, object> twin = new Dictionary<string, object>()
{
    { "$metadata", meta },
    { "Temperature", 25.0 }
};
client.CreateDigitalTwin("myNewRoomID", JsonSerializer.Serialize<Dictionary<string, object>>(twin));
```

##### Deserialize a relationship

You can always deserialize relationship data using the JSON library of your choice, like `System.Test.Json` or `Newtonsoft.Json`. For basic access to a relationship, the helper classes make this a bit more convenient.

```csharp
Response<string> res = client.GetRelationship(twin_id, rel_id);
BasicRelationship rel = JsonSerializer.Deserialize<BasicRelationship>(res.Value);
Console.WriteLine($"Relationship Name: {rel.Name}");
```

The `BasicRelationship` helper class also gives you access to properties defined on the relationship, through a `Dictionary<string, object>`. To list properties, you can use:

```csharp
Response<string> res = client.GetRelationship(twin_id, rel_id);
BasicRelationship rel = JsonSerializer.Deserialize<BasicRelationship>(res.Value);
Console.WriteLine($"Relationship Name: {rel.Name}");
foreach (string prop in rel.CustomProperties.Keys)
{
    if (twin.CustomProperties.TryGetValue(prop, out object value))
        Console.WriteLine($"Property '{prop}': {value}");
}
```

##### Create a relationship

Using the `BasicDigitalTwin` class, you can also prepare data for creating relationships on a twin instance:

```csharp
BasicRelationship rel = new BasicRelationship();
rel.TargetId = "myTargetTwin";
rel.Name = "contains"; // a relationship with this name must be defined in the model
// Initialize properties
Dictionary<string, object> props = new Dictionary<string, object>();
props.Add("active", true);
rel.CustomProperties = props;
client.CreateRelationship("mySourceTwin", "rel001", JsonSerializer.Serialize<BasicRelationship>(rel));
```

##### Create a patch for twin update

Update calls for twins and relationships use [JSON Patch](http://jsonpatch.com/) structure. To create lists of JSON Patch operations, you can use the `UpdateOperationsUtility` class as shown below.

```csharp
UpdateOperationsUtility uou = new UpdateOperationsUtility();
uou.AppendAddOp("/Temperature", 25.0);
uou.AppendAddOp("/myComponent/Property", "Hello");
// Un-set a property
uou.AppendRemoveOp("/Humidity");
client.UpdateDigitalTwin("myTwin", uou.Serialize());
```

## General API/SDK usage notes

This section contains general information about and guidelines for using the APIs and SDKs.

* To use the SDK, instantiate the `DigitalTwinsClient` class. The constructor requires credentials that can be obtained with a variety of authentication methods in the `Azure.Identity` package. For more on `Azure.Identity`, see its [namespace documentation](https://docs.microsoft.com/dotnet/api/azure.identity?view=azure-dotnet). 
* You may find the `InteractiveBrowserCredential` useful while getting started, but there are several other options, including credentials for [managed identity](https://docs.microsoft.com/dotnet/api/azure.identity.interactivebrowsercredential?view=azure-dotnet), which you will likely use to authenticate [Azure functions set up with MSI](https://docs.microsoft.com/azure/app-service/overview-managed-identity?tabs=dotnet) against Azure Digital Twins. For more about `InteractiveBrowserCredential`, see its [class documentation](https://docs.microsoft.com/dotnet/api/azure.identity.interactivebrowsercredential?view=azure-dotnet).
* All service API calls are exposed as member functions on the `DigitalTwinsClient` class.
* All service functions exist in synchronous and asynchronous versions.
* All service functions throw an exception for any return status of 400 or above. Make sure you wrap calls into a `try` section, and catch at least `RequestFailedExceptions`. For more about this type of exception, see [here](https://docs.microsoft.com/dotnet/api/azure.requestfailedexception?view=azure-dotnet).
* Most service methods return `Response<T>` or (`Task<Response<T>>` for the asynchronous calls), where `T` is the class of return object for the service call. The [`Response`](https://docs.microsoft.com/dotnet/api/azure.response-1?view=azure-dotnet) class encapsulates the service return and presents return values in its `Value` field.  
* Service methods with paged results return `Pageable<T>` or `AsyncPageable<T>` as results. For more about the `Pageable<T>` class, see [here](https://docs.microsoft.com/dotnet/api/azure.pageable-1?view=azure-dotnet-preview); for more about `AsyncPageable<T>`, see [here](https://docs.microsoft.com/dotnet/api/azure.asyncpageable-1?view=azure-dotnet-preview).
* You can iterate over paged results using an `await foreach` loop. For more about this process, see [here](https://docs.microsoft.com/archive/msdn-magazine/2019/november/csharp-iterating-with-async-enumerables-in-csharp-8).
* The underlying SDK is `Azure.Core`. See the [Azure namespace documentation](https://docs.microsoft.com/dotnet/api/azure?view=azure-dotnet-preview) for reference on the SDK infrastructure and types.

Service methods return strongly-typed objects wherever possible. However, because Azure Digital Twins is based on models custom-configured by the user at runtime (via DTDL models uploaded to the service), many service APIs take and return twin data in JSON format.

## Monitor API metrics

API metrics such as requests, latency, and failure rate can be viewed in the [Azure portal](https://portal.azure.com/). 

From the portal homepage, search for your Azure Digital Twins instance to pull up its details. Select the **Metrics** option from the Azure Digital Twins instance's menu to bring up the *Metrics* page.

:::image type="content" source="media/how-to-use-apis-sdks/metrics.png" alt-text="Metrics page of an Azure Digital Twins instance in the Azure portal":::

From here, you can view the metrics for your instance and create custom views.

## Next steps

See how to use the APIs to create an Azure Digital Twins instance:
* [How-to: Create an Azure Digital Twins instance](how-to-set-up-instance.md)

Or, walk through the steps to create a client app like the one used in this how-to:
* [Tutorial: Code a client app](tutorial-code.md)
