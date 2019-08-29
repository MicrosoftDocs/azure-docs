---
title: Authoring a RESTful endpoint for custom providers
description: This tutorial will go over how to author a RESTful endpoint for custom providers. It will go into detail on how to handle requests and responses for the supported RESTful HTTP methods.
author: jjbfour
ms.service: managed-applications
ms.topic: tutorial
ms.date: 06/19/2019
ms.author: jobreen
---

# Authoring a RESTful endpoint for custom providers

Custom providers allow you to customize workflows on Azure. A custom provider is a contract between Azure and an `endpoint`. This tutorial will go through the process of authoring a custom provider RESTful `endpoint`. If you are unfamiliar with Azure Custom Providers, see [the overview on custom resource providers](./custom-providers-overview.md).

This tutorial is broken into the following steps:

- Working with custom actions and custom resources
- How to partition custom resources in storage
- Support custom provider RESTful methods
- Integrate RESTful operations

This tutorial will build on the following tutorials:

- [Setup Azure Functions for Azure Custom Providers](./tutorial-custom-providers-function-setup.md)

> [!NOTE]
> This tutorial builds off the previous tutorial. Some of the steps in the tutorial will only work if an Azure Function has been setup to work with custom providers.

## Working with custom actions and custom resources

In this tutorial, we will update the function to work as a RESTful endpoint for our custom provider. In Azure resources and actions are modeled after the basic RESTful specification: PUT - creates a new resource, GET (instance) - retrieves an existing resource, DELETE - removes an existing resource, POST - trigger an action, and GET (collection) - lists all existing resources. For this tutorial, we will be using Azure Tables as our storage, but any database or storage service can work.

## How to partition custom resources in storage

Since we are creating a RESTful service, we need to store the created resources in storage. For Azure Table storage, we need to generate partition and row keys for our data. For custom providers, data should be partitioned to the custom provider. When an incoming request is sent to the custom provider, the custom provider will add the `x-ms-customproviders-requestpath` header to outgoing request to the `endpoint`.

sample `x-ms-customproviders-requestpath` header for a custom resource:

```
X-MS-CustomProviders-RequestPath: /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.CustomProviders/resourceProviders/{resourceProviderName}/{myResourceType}/{myResourceName}
```

Based on the above sample `x-ms-customproviders-requestpath` header, we can create the partitionKey and rowKey for our storage as the following:

Parameter | Template | Description
---|---
partitionKey | '{subscriptionId}:{resourceGroupName}:{resourceProviderName}' | The partitionKey is how the data is partitioned. For most cases, the data should be partitioned by the custom provider instance.
rowKey | '{myResourceType}:{myResourceName}' | The rowKey is the individual identifier for the data. Most of the time this is the name of the resource.

In addition, we also need to create a new class to model our custom resource. In this tutorial, we will add the `CustomResource` class to our function, which is a generic class that accepts any inputted data:

```csharp
// Custom Resource Table Entity
public class CustomResource : TableEntity
{
    public string Data { get; set; }
}
```

This creates a basic class based on `TableEntity`, which is used to store data. The `CustomResource` class inherits two properties from `TableEntity`: partitionKey and rowKey.

## Support custom provider RESTful methods

> [!NOTE]
> If you are not copying the code directly from the tutorial, the response content should be valid JSON and sets the `Content-Type` header as `application/json`.

Now that we have data partitioning setup, let's scaffold out the basic CRUD and trigger methods for custom resources and custom actions. Since custom providers act as a proxy, the request and response must be modeled and handled by the RESTful `endpoint`. Follow the below snippets for handling the basic RESTful operations:

### Trigger custom action

For custom providers, a custom action is triggered through `POST` requests. A custom action can optionally accept a request body that contains a set of input parameters. The action should then return back a response signally the result of the action as well as whether it succeeded or failed. In this tutorial, we will add the method `TriggerCustomAction` to our function:

```csharp
/// <summary>
/// Triggers a custom action with some side effect.
/// </summary>
/// <param name="requestMessage">The http request message.</param>
/// <returns>The http response result of the custom action.</returns>
public static async Task<HttpResponseMessage> TriggerCustomAction(HttpRequestMessage requestMessage)
{
    var myCustomActionRequest = await requestMessage.Content.ReadAsStringAsync();

    var actionResponse = requestMessage.CreateResponse(HttpStatusCode.OK);
    actionResponse.Content = myCustomActionRequest != string.Empty ? 
        new StringContent(JObject.Parse(myCustomActionRequest).ToString(), System.Text.Encoding.UTF8, "application/json") :
        null;
    return actionResponse;
}
```

The `TriggerCustomAction` method accepts an incoming request and simply echos back the response with a success status code. 

### Create custom resource

For custom providers, a custom resource is created through `PUT` requests. The custom provider will accept a JSON request body, which contains a set of properties for the custom resource. In Azure, resources follow a RESTful model. The same request URL that was used to create a resource should also be able to retrieve and delete the resource. In this tutorial, we will add the method `CreateCustomResource` to create new resources:

```csharp
/// <summary>
/// Creates a custom resource and saves it to table storage.
/// </summary>
/// <param name="requestMessage">The http request message.</param>
/// <param name="tableStorage">The Azure Storage Account table.</param>
/// <param name="azureResourceId">The parsed Azure resource Id.</param>
/// <param name="partitionKey">The partition key for storage. This is the custom provider id.</param>
/// <param name="rowKey">The row key for storage. This is '{resourceType}:{customResourceName}'.</param>
/// <returns>The http response containing the created custom resource.</returns>
public static async Task<HttpResponseMessage> CreateCustomResource(HttpRequestMessage requestMessage, CloudTable tableStorage, ResourceId azureResourceId, string partitionKey, string rowKey)
{
    // Adds the Azure top-level properties.
    var myCustomResource = JObject.Parse(await requestMessage.Content.ReadAsStringAsync());
    myCustomResource["name"] = azureResourceId.Name;
    myCustomResource["type"] = azureResourceId.FullResourceType;
    myCustomResource["id"] = azureResourceId.Id;

    // Save the resource into storage.
    var insertOperation = TableOperation.InsertOrReplace(
        new CustomResource
        {
            PartitionKey = partitionKey,
            RowKey = rowKey,
            Data = myCustomResource.ToString(),
        });
    await tableStorage.ExecuteAsync(insertOperation);

    var createResponse = requestMessage.CreateResponse(HttpStatusCode.OK);
    createResponse.Content = new StringContent(myCustomResource.ToString(), System.Text.Encoding.UTF8, "application/json");
    return createResponse;
}
```

The `CreateCustomResource` method updates the incoming request to include the Azure specific fields: `id`, `name`, and `type`. These are top-level properties that are used by services across Azure. They will enable the custom provider to integrate with other services such as Azure Policy, Azure Resource Manager Templates, and Azure Activity Logs.

Property | Sample | Description
---|---|---
name | '{myCustomResourceName}' | The name of the custom resource.
type | 'Microsoft.CustomProviders/resourceProviders/{resourceTypeName}' | The resource type namespace.
id | '/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/<br>providers/Microsoft.CustomProviders/resourceProviders/{resourceProviderName}/<br>{resourceTypeName}/{myCustomResourceName}' | The resource ID.

In addition to adding the properties, we also save the document to Azure Table Storage. 

### Retrieve custom resource

For custom providers, a custom resource is retrieved through `GET` requests. The custom provider will *not* accept a JSON request body. In the case of `GET` requests, the **endpoint** should use the `x-ms-customproviders-requestpath` header to return the already created resource. In this tutorial, we will add the method `RetrieveCustomResource` to retrieve existing resources:

```csharp
/// <summary>
/// Retrieves a custom resource.
/// </summary>
/// <param name="requestMessage">The http request message.</param>
/// <param name="tableStorage">The Azure Storage Account table.</param>
/// <param name="partitionKey">The partition key for storage. This is the custom provider id.</param>
/// <param name="rowKey">The row key for storage. This is '{resourceType}:{customResourceName}'.</param>
/// <returns>The http response containing the existing custom resource.</returns>
public static async Task<HttpResponseMessage> RetrieveCustomResource(HttpRequestMessage requestMessage, CloudTable tableStorage, string partitionKey, string rowKey)
{
    // Attempt to retrieve the Existing Stored Value
    var tableQuery = TableOperation.Retrieve<CustomResource>(partitionKey, rowKey);
    var existingCustomResource = (CustomResource)(await tableStorage.ExecuteAsync(tableQuery)).Result;

    var retrieveResponse = requestMessage.CreateResponse(
        existingCustomResource != null ? HttpStatusCode.OK : HttpStatusCode.NotFound);

    retrieveResponse.Content = existingCustomResource != null ?
            new StringContent(existingCustomResource.Data, System.Text.Encoding.UTF8, "application/json"):
            null;
    return retrieveResponse;
}
```

In Azure, resources should follow a RESTful model. The request URL that created the resource should also return the resource if a `GET` request is performed.

### Remove custom resource

For custom providers, a custom resource is removed through `DELETE` requests. The custom provider will *not* accept a JSON request body. In the case of `DELETE` requests, the **endpoint** should use the `x-ms-customproviders-requestpath` header to delete the already created resource. In this tutorial, we will add the method `RemoveCustomResource` to remove existing resources:

```csharp
/// <summary>
/// Removes an existing custom resource.
/// </summary>
/// <param name="requestMessage">The http request message.</param>
/// <param name="tableStorage">The Azure Storage Account table.</param>
/// <param name="partitionKey">The partition key for storage. This is the custom provider id.</param>
/// <param name="rowKey">The row key for storage. This is '{resourceType}:{customResourceName}'.</param>
/// <returns>The http response containing the result of the delete.</returns>
public static async Task<HttpResponseMessage> RemoveCustomResource(HttpRequestMessage requestMessage, CloudTable tableStorage, string partitionKey, string rowKey)
{
    // Attempt to retrieve the Existing Stored Value
    var tableQuery = TableOperation.Retrieve<CustomResource>(partitionKey, rowKey);
    var existingCustomResource = (CustomResource)(await tableStorage.ExecuteAsync(tableQuery)).Result;

    if (existingCustomResource != null) {
        var deleteOperation = TableOperation.Delete(existingCustomResource);
        await tableStorage.ExecuteAsync(deleteOperation);
    }

    return requestMessage.CreateResponse(
        existingCustomResource != null ? HttpStatusCode.OK : HttpStatusCode.NoContent);
}
```

In Azure, resources should follow a RESTful model. The request URL that created the resource should also delete the resource if a `DELETE` request is performed.

### List all custom resources

For custom providers, a list of existing custom resources can be enumerated through collection `GET` requests. The custom provider will *not* accept a JSON request body. In the case of collection `GET` requests, the `endpoint` should use the `x-ms-customproviders-requestpath` header to enumerate the already created resources. In this tutorial, we will add the method `EnumerateAllCustomResources` to enumerate the existing resources.

```csharp
/// <summary>
/// Enumerates all the stored custom resources for a given type.
/// </summary>
/// <param name="requestMessage">The http request message.</param>
/// <param name="tableStorage">The Azure Storage Account table.</param>
/// <param name="partitionKey">The partition key for storage. This is the custom provider id.</param>
/// <param name="resourceType">The resource type of the enumeration.</param>
/// <returns>The http response containing a list of resources stored under 'value'.</returns>
public static async Task<HttpResponseMessage> EnumerateAllCustomResources(HttpRequestMessage requestMessage, CloudTable tableStorage, string partitionKey, string resourceType)
{
    // Generate upper bound of the query.
    var rowKeyUpperBound = new StringBuilder(resourceType);
    rowKeyUpperBound[rowKeyUpperBound.Length - 1]++;

    // Create the enumeration query.
    var enumerationQuery = new TableQuery<CustomResource>().Where(
        TableQuery.CombineFilters(
            TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.Equal, partitionKey),
            TableOperators.And,
            TableQuery.CombineFilters(
                TableQuery.GenerateFilterCondition("RowKey", QueryComparisons.GreaterThan, resourceType),
                TableOperators.And,
                TableQuery.GenerateFilterCondition("RowKey", QueryComparisons.LessThan, rowKeyUpperBound.ToString()))));
    
    var customResources = (await tableStorage.ExecuteQuerySegmentedAsync(enumerationQuery, null))
        .ToList().Select(customResource => JToken.Parse(customResource.Data));

    var enumerationResponse = requestMessage.CreateResponse(HttpStatusCode.OK);
    enumerationResponse.Content = new StringContent(new JObject(new JProperty("value", customResources)).ToString(), System.Text.Encoding.UTF8, "application/json");
    return enumerationResponse;
}
```

> [!NOTE]
> The row key greater than and less than is Azure Table syntax to perform a query "startswith" for strings. 

For listing all existing resources, we generate a Azure Table query that ensures that the resources exist under our custom provider partition. The query then checks that the row key starts with the same `{myResourceType}`.

## Integrate RESTful operations

Once all the RESTful methods are added to the function, we can update the main `Run` method to call the functions to handle the different REST requests:

```csharp
/// <summary>
/// Entry point for the Azure Function webhook and acts as the service behind a custom provider.
/// </summary>
/// <param name="requestMessage">The http request message.</param>
/// <param name="log">The logger.</param>
/// <param name="tableStorage">The Azure Storage Account table.</param>
/// <returns>The http response for the custom Azure API.</returns>
public static async Task<HttpResponseMessage> Run(HttpRequestMessage req, ILogger log, CloudTable tableStorage)
{
    // Get the unique Azure request path from request headers.
    var requestPath = req.Headers.GetValues("x-ms-customproviders-requestpath").FirstOrDefault();

    if (requestPath == null)
    {
        var missingHeaderResponse = req.CreateResponse(HttpStatusCode.BadRequest);
        missingHeaderResponse.Content = new StringContent(
            new JObject(new JProperty("error", "missing 'x-ms-customproviders-requestpath' header")).ToString(),
            System.Text.Encoding.UTF8, 
            "application/json");
    }

    log.LogInformation($"The Custom Provider Function received a request '{req.Method}' for resource '{requestPath}'.");

    // Determines if it is a collection level call or action.
    var isResourceRequest = requestPath.Split('/').Length % 2 == 1;
    var azureResourceId = isResourceRequest ? 
        ResourceId.FromString(requestPath) :
        ResourceId.FromString($"{requestPath}/");

    // Create the Partition Key and Row Key
    var partitionKey = $"{azureResourceId.SubscriptionId}:{azureResourceId.ResourceGroupName}:{azureResourceId.Parent.Name}";
    var rowKey = $"{azureResourceId.FullResourceType.Replace('/', ':')}:{azureResourceId.Name}";

    switch (req.Method)
    {
        // Action request for an custom action.
        case HttpMethod m when m == HttpMethod.Post && !isResourceRequest:
            return await TriggerCustomAction(
                requestMessage: req);

        // Enumerate request for all custom resources.
        case HttpMethod m when m == HttpMethod.Get && !isResourceRequest:
            return await EnumerateAllCustomResources(
                requestMessage: req,
                tableStorage: tableStorage,
                partitionKey: partitionKey,
                resourceType: rowKey);

        // Retrieve request for a custom resource.
        case HttpMethod m when m == HttpMethod.Get && isResourceRequest:
            return await RetrieveCustomResource(
                requestMessage: req,
                tableStorage: tableStorage,
                partitionKey: partitionKey,
                rowKey: rowKey);

        // Create request for a custom resource.
        case HttpMethod m when m == HttpMethod.Put && isResourceRequest:
            return await CreateCustomResource(
                requestMessage: req,
                tableStorage: tableStorage,
                azureResourceId: azureResourceId,
                partitionKey: partitionKey,
                rowKey: rowKey);

        // Remove request for a custom resource.
        case HttpMethod m when m == HttpMethod.Delete && isResourceRequest:
            return await RemoveCustomResource(
                requestMessage: req,
                tableStorage: tableStorage,
                partitionKey: partitionKey,
                rowKey: rowKey);

        // Invalid request received.
        default:
            return req.CreateResponse(HttpStatusCode.BadRequest);
    }
}
``` 

The updated `Run` method will now include the `tableStorage` input binding that was added for Azure Table storage. The first part of the method will now read the `x-ms-customproviders-requestpath` header and use the `Microsoft.Azure.Management.ResourceManager.Fluent` library to parse the value as a resource ID. The `x-ms-customproviders-requestpath` header is sent by the custom provider and designates the path of the incoming request. Using the parsed resource ID, we can now generate the partitionKey and rowKey for the data to lookup or store custom resources.

In addition to adding the methods and classes, we need to update the using methods for the function. Add the following to the top of the file:

```csharp
#r "Newtonsoft.Json"
#r "Microsoft.WindowsAzure.Storage"
#r "../bin/Microsoft.Azure.Management.ResourceManager.Fluent.dll"

using System;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Configuration;
using System.Text;
using System.Threading;
using System.Globalization;
using System.Collections.Generic;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Host;
using Microsoft.WindowsAzure.Storage.Table;
using Microsoft.Azure.Management.ResourceManager.Fluent.Core;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
```

If you got lost during any point of this tutorial, the completed code sample can be found at the [custom provider C# RESTful endpoint reference](./reference-custom-providers-csharp-endpoint.md). Once the function is complete, save the function URL that can be used to trigger the function as it will be used in later tutorials.

## Next steps

In this article, we authored a RESTful endpoint to work with Azure Custom Provider `endpoint`. Go to the next article to learn how to create a custom provider.

- [Tutorial: Creating a custom provider](./tutorial-custom-providers-create.md)
