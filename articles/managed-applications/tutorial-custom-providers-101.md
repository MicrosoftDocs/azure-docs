---
title: Create custom actions and resources in Azure Resource Manager
description: This tutorial will go over how to create custom actions and resources in Azure Resource Manager and how to integrate them into custom workflows for Azure Resource Manager Templates, Azure CLI, Azure Policy, and Activity Log.
author: jjbfour
ms.service: managed-applications
ms.topic: tutorial
ms.date: 06/19/2019
ms.author: jobreen
---

# Create custom actions and resources in Azure Resource Manager

Custom resource providers allow you to customize workflows on Azure. A custom resource provider is a contract between Azure and an **endpoint**. It allows the addition of new custom APIs into the Azure Resource Manager to enable new deployment and management capabilities. This tutorial will go through a simple example of how to add new actions and resources to Azure and how to integrate them.

This tutorial is broken into the following steps:

- Modeling custom actions and custom resources
- Creating a simple service endpoint
- Creating the custom resource provider
- Using custom actions and resources in existing workflows

This tutorial will build on the following tutorials:

- [creating your first Azure Function through the Azure portal](../azure-functions/functions-create-first-azure-function.md)

## Modeling custom actions and custom resources

Custom resource providers act as a proxy between Azure REST clients and an **endpoint**. This means that the **endpoint** will directly handle every request and response. Although the only requirement is that **endpoint** accept and returns content-type `application/json`, in order to ensure that the new API can integrate with existing Azure services, it should follow the standard Azure REST specification.

# [Custom actions](#tab/model-custom-action)

For a more detailed guide on building custom actions and their requirements, see [building custom actions on Azure](./custom-providers-action-endpoint-how-to.md)

- The **endpoint** accepts and returns with JSON. It should also set the `Content-Type` header to `application/json` on the response.

# [Custom resources](#tab/model-custom-resources)

For a more detailed guide on building custom resources and their requirements, see [building custom resources on Azure](./custom-providers-resources-endpoint-how-to.md)

- The **endpoint** accepts and returns with JSON. It should also set the `Content-Type` header to `application/json` on the response.
- The API should follow the Azure RESTful specification: PUT - Create or updates the resource, GET - retrieves an existing resource, and DELETE - removes the resource.
- The `name`, `id`, and `type` properties should be returned at the top-level and all additional properties should be placed under the `properties` property.

<br>
<details>
<summary>Show sample valid custom resource:</summary>

``` JSON
{
    "name": "{myResourceName}",
    "type": "Microsoft.CustomProviders/resourceProviders/{myResourceType}",
    "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.CustomProviders/resourceProviders/{resourceProviderName}/{myResourceType}/{myResourceName}",
    "properties": {
        ...
    }
}
```

Parameter | Description
--- | ---
myResourceName | The name of the resource. This should be the same as what is defined in the request URI.
myResourceType | The name of the custom resource provider endpoint. This is the resource type, which is also from the request URI.
subscriptionId | The subscription ID of the custom resource provider.
resourceGroupName | The resourceGroup name of the custom resource provider.
resourceProviderName | The name of the custom resource provider.

</details>

---

## Creating a simple service endpoint

In this guide, we will be creating a simple service endpoint using an Azure Function, but a custom resource provider can be any public accessible **endpoint**. Azure Logic Apps, Azure API Management, and Azure Web Apps are some great alternatives.

To start this tutorial, you should follow the tutorial, [creating your first Azure Function in the Azure portal](../azure-functions/functions-create-first-azure-function.md). The tutorial will create a .NET core webhook function that can be modified in the Azure portal. The trigger URL of the Azure Function will be used as our **endpoint** for the custom resource provider that will be created later in the tutorial.

### Setting up the function

Before we start programming our custom resource provider, there are several setup steps that will get the Azure Function ready to work with our custom resource provider.

#### Install Azure Table bindings

This section will go through quick steps for installing the Azure Table storage bindings.

1. Navigate to the `Integrate` tab for the HttpTrigger.
2. Hit the `+ New Input`.
3. Select `Azure Table Storage`.
4. Install the `Microsoft.Azure.WebJobs.Extensions.Storage` if it is not already installed.
5. Update the `Table parameter name` to "tableStorage" and the `Table name` to "myCustomResources".
6. Save the updated input parameter.

![Custom provider overview](./media/create-custom-providers/azure-functions-table-bindings.png)

#### Update the HTTP methods

Update the `Selected HTTP methods` to: GET, POST, DELETE, and PUT.

![Custom provider overview](./media/create-custom-providers/azure-functions-http-methods.png)

#### Modifying the csproj

> [!NOTE]
> If the csproj is missing from the directory, it can be added manually or it will appear once the `Microsoft.Azure.WebJobs.Extensions.Storage` extension is installed on the function.

Next, we will update the csproj file to include helpful NuGet libraries that will make it easier to parse incoming requests from custom resource providers. Follow the steps at [add extensions from the portal](../azure-functions/install-update-binding-extensions-manual.md) and update the csproj to include the following package references:

```xml
<PackageReference Include="Microsoft.Azure.WebJobs.Extensions.Storage" Version="3.0.4" />
<PackageReference Include="Microsoft.Azure.Management.ResourceManager.Fluent" Version="1.22.2" />
<PackageReference Include="Microsoft.Azure.WebJobs.Script.ExtensionsMetadataGenerator" Version="1.1.*" />
```

<br>
<details>
<summary>Show sample .csproj file:</summary>

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>netstandard2.0</TargetFramework>
    <WarningsAsErrors />
  </PropertyGroup>
  <ItemGroup>
    <PackageReference Include="Microsoft.Azure.WebJobs.Extensions.Storage" Version="3.0.4" />
    <PackageReference Include="Microsoft.Azure.Management.ResourceManager.Fluent" Version="1.22.2" />
    <PackageReference Include="Microsoft.Azure.WebJobs.Script.ExtensionsMetadataGenerator" Version="1.1.*" />
  </ItemGroup>
</Project>
```

</details>

### Working with custom actions and custom resources

> [!NOTE]
> The response content should be valid JSON and sets the `Content-Type` header as `application/json`.

In this step, we will update the function to work as a RESTful endpoint for our custom provider. In Azure resources and actions are modeled after the basic RESTful specification: PUT - creates a new resource, GET (instance) - retrieves an existing resource, DELETE - removes an existing resource, POST - trigger an action, and GET (collection) - lists all existing resources. For this tutorial, we will be using Azure Tables as our storage, but any database or storage service can work.

#### Create partition and row keys

Since we are creating a RESTful service, we need to store the created resources in storage. For Azure Table storage, we need to generate partition and row keys for our data. For custom providers, data should be partitioned to the custom provider. When an incoming request is sent to the custom provider, the custom provider will add the `x-ms-customproviders-requestpath` header to outgoing request to the *endpoint*.

sample `x-ms-customproviders-requestpath` header for a custom resource:

```
X-MS-CustomProviders-RequestPath: /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.CustomProviders/resourceProviders/{resourceProviderName}/{myResourceType}/{myResourceName}
```

Based on the above sample `x-ms-customproviders-requestpath` header, we can create the partitionKey and rowKey for our storage as the following:

Parameter | Template | Description
---|---
partitionKey | '{subscriptionId}:{resourceGroupName}:{resourceProviderName}' | The partitionKey is how the data is partitioned. For most cases, the data should be partitioned by the custom resource provider instance.
rowKey | '{myResourceType}:{myResourceName}' | The rowKey is the individual identifier for the data. Most of the time this is the name of the resource.

In addition, we also need to add in the new type for our storage. In this tutorial, we will add the `CustomResource` class to our function:

```csharp
// Custom Resource Table Entity
public class CustomResource : TableEntity
{
    public string Data { get; set; }
}
```

This creates a basic class based on `TableEntity`, which is used to store data. The `CustomResource` class inherits two properties from `TableEntity`: partitionKey and rowKey.

#### Add custom provider RESTful methods

# [Trigger custom action](#tab/function-trigger-action)

For custom providers, a custom action is triggered through `POST` requests. A custom action can optionally accept a request body that contains a set of input parameters. The action should then return back a response signally the result of the action as well as whether it succeeded or failed. In this tutorial, we will add the method `TriggerCustomAction` to our function:

<br>
<details>
<summary>Show <code>TriggerCustomAction</code> method:</summary>

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

</details>

The `TriggerCustomAction` method accepts an incoming request and simply echos back the response with a success status code. 

# [Create custom resource](#tab/function-create-resource)

For custom providers, a custom resource is created through `PUT` requests. The custom provider will accept a JSON request body, which contains a set of properties for the custom resource. In Azure, resources follow a RESTful model. The same request URL that was used to create a resource should also be able to retrieve and delete the resource. In this tutorial, we will add the method `CreateCustomResource` to create new resources:

<br>
<details>
<summary>Show <code>CreateCustomResource</code> method:</summary>

```csharp
/// <summary>
/// Creates a custom resource and saves it to table storage.
/// </summary>
/// <param name="requestMessage">The http request message.</param>
/// <param name="tableStorage">The Azure Storage Account table.</param>
/// <param name="azureResourceId">The parsed Azure resource Id.</param>
/// <param name="partitionKey">The partition key for storage. This is the custom resource provider id.</param>
/// <param name="rowKey">The row key for storage. This is '{resourceType}:{customResourceName}'.</param>
/// <returns>The http response containing the created custom resource.</returns>
public static async Task<HttpResponseMessage> CreateCustomResource(HttpRequestMessage requestMessage, CloudTable tableStorage, ResourceId azureResourceId, string partitionKey, string rowKey)
{
    // Construct the new resource from the request body and adds the Azure Resource Manager fields.
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

</details>

The `CreateCustomResource` method updates the incoming request to include the Azure specific fields: `id`, `name`, and `type`. These are top-level properties that are used by services across Azure. They will enable the custom provider to integrate with other services such as Azure Policy, Azure Resource Manager Templates, and Azure Activity Logs.

Property | Sample | Description
---|---|---
name | '{myCustomResourceName}' | The name of the custom resource.
type | 'Microsoft.CustomProviders/resourceProviders/{resourceTypeName}' | The resource type namespace.
id | '/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/<br>providers/Microsoft.CustomProviders/resourceProviders/{resourceProviderName}/<br>{resourceTypeName}/{myCustomResourceName}' | The resource ID.

In addition to adding the properties, we also save the document to Azure Table Storage. 

# [Retrieve custom resource](#tab/function-retrieve-resource)

For custom providers, a custom resource is retrieved through `GET` requests. The custom provider will *not* accept a JSON request body. In the case of `GET` requests, the *endpoint* should use the `x-ms-customproviders-requestpath` header to return the already created resource. In this tutorial, we will add the method `RetrieveCustomResource` to retrieve existing resources:

<br>
<details>
<summary>Show <code>RetrieveCustomResource</code> method:</summary>

```csharp
/// <summary>
/// Retrieves a custom resource.
/// </summary>
/// <param name="requestMessage">The http request message.</param>
/// <param name="tableStorage">The Azure Storage Account table.</param>
/// <param name="partitionKey">The partition key for storage. This is the custom resource provider id.</param>
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

</details>

In Azure, resources should follow a RESTful model. The request URL that created the resource should also return the resource if a `GET` request is performed.

# [Remove custom resource](#tab/function-remove-resource)

For custom providers, a custom resource is removed through `DELETE` requests. The custom provider will *not* accept a JSON request body. In the case of `DELETE` requests, the *endpoint* should use the `x-ms-customproviders-requestpath` header to delete the already created resource. In this tutorial, we will add the method `RemoveCustomResource` to remove existing resources:

<br>
<details>
<summary>Show <code>RemoveCustomResource</code> method:</summary>

```csharp
/// <summary>
/// Removes an existing custom resource.
/// </summary>
/// <param name="requestMessage">The http request message.</param>
/// <param name="tableStorage">The Azure Storage Account table.</param>
/// <param name="partitionKey">The partition key for storage. This is the custom resource provider id.</param>
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

</details>

In Azure, resources should follow a RESTful model. The request URL that created the resource should also delete the resource if a `DELETE` request is performed.

# [List all custom resources](#tab/function-list-resource)

For custom providers, a list of existing custom resources can be enumerated through collection `GET` requests. The custom provider will *not* accept a JSON request body. In the case of collection `GET` requests, the *endpoint* should use the `x-ms-customproviders-requestpath` header to enumerate the already created resources. In this tutorial, we will add the method `EnumerateAllCustomResources` to enumerate the existing resources.

<br>
<details>
<summary>Show <code>EnumerateAllCustomResources</code> method:</summary>

```csharp
/// <summary>
/// Enumerates all the stored custom resources for a given type.
/// </summary>
/// <param name="requestMessage">The http request message.</param>
/// <param name="tableStorage">The Azure Storage Account table.</param>
/// <param name="partitionKey">The partition key for storage. This is the custom resource provider id.</param>
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

</details>

> [!NOTE]
> The row key greater than and less than is Azure Table syntax to perform a query "startswith" for strings. 

For listing all existing resources, we generate a Azure Table query that ensures that the resources exist under our custom resource provider partition. The query then checks that the row key starts with the same `{myResourceType}`.

---

#### Updating the webhook execute

Once all the RESTful methods are added to the function, we can update the main `Run` method to call the functions to handle the different REST requests.

<br>
<details>
<summary>Show <code>Run</code> method:</summary>

```csharp
/// <summary>
/// Entry point for the Azure Function webhook and acts as the service behind a custom resource provider.
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

</details>

The updated `Run` method will now include the `tableStorage` input binding that was added for Azure Table storage. The first part of the method will now read the `x-ms-customproviders-requestpath` header and use the `Microsoft.Azure.Management.ResourceManager.Fluent` library to parse the value as a resource ID. The `x-ms-customproviders-requestpath` header is sent by the custom resource provider and designates the path of the incoming request. Using the parsed resource ID, we can now generate the partitionKey and rowKey for the data to lookup or store custom resources.

#### Final code sample

The Azure Function should now support the Azure RESTful API operations for both custom resources and custom actions.

<br>
<details>
<summary>Show complete function:</summary>

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

// Custom Resource Table Entity
public class CustomResource : TableEntity
{
    public string Data { get; set; }
}

/// <summary>
/// Entry point for the Azure Function webhook and acts as the service behind a custom resource provider.
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

/// <summary>
/// Enumerates all the stored custom resources for a given type.
/// </summary>
/// <param name="requestMessage">The http request message.</param>
/// <param name="tableStorage">The Azure Storage Account table.</param>
/// <param name="partitionKey">The partition key for storage. This is the custom resource provider id.</param>
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

/// <summary>
/// Retrieves a custom resource.
/// </summary>
/// <param name="requestMessage">The http request message.</param>
/// <param name="tableStorage">The Azure Storage Account table.</param>
/// <param name="partitionKey">The partition key for storage. This is the custom resource provider id.</param>
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

/// <summary>
/// Creates a custom resource and saves it to table storage.
/// </summary>
/// <param name="requestMessage">The http request message.</param>
/// <param name="tableStorage">The Azure Storage Account table.</param>
/// <param name="azureResourceId">The parsed Azure resource Id.</param>
/// <param name="partitionKey">The partition key for storage. This is the custom resource provider id.</param>
/// <param name="rowKey">The row key for storage. This is '{resourceType}:{customResourceName}'.</param>
/// <returns>The http response containing the created custom resource.</returns>
public static async Task<HttpResponseMessage> CreateCustomResource(HttpRequestMessage requestMessage, CloudTable tableStorage, ResourceId azureResourceId, string partitionKey, string rowKey)
{
    // Construct the new resource from the request body and adds the Azure Resource Manager fields.
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

/// <summary>
/// Removes an existing custom resource.
/// </summary>
/// <param name="requestMessage">The http request message.</param>
/// <param name="tableStorage">The Azure Storage Account table.</param>
/// <param name="partitionKey">The partition key for storage. This is the custom resource provider id.</param>
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

</details>

When you have finished the Azure Function, grab the trigger function URL. This URL will act as our endpoint.

## Creating a custom resource provider

Once the **endpoint** is created, you can generate the create a custom resource provider to generate a contract between it and the **endpoint**. A custom resource provider allows you specify a list of endpoint definitions.

Sample Endpoint:

```JSON
{
  "name": "{endpointDefinitionName}",
  "routingType": "Proxy",
  "endpoint": "https://{endpointURL}/"
}
```

Property | Required | Description
---|---|---
name | *yes* | The name of the endpoint definition. Azure will expose this name through its API under '/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.CustomProviders/<br>resourceProviders/{resourceProviderName}/{endpointDefinitionName}'
routingType | *no* | Determines the contract type with the **endpoint**. If not specified, it will default to "Proxy".
endpoint | *yes* | The endpoint to route the requests to. This will handle the response as well as any side effects of the request.

> [!NOTE]
> The endpoint URL can include query strings and path parts.

### Defining custom actions and resources

The custom resource provider contains a list of `actions` and `resourceTypes`. `actions` map to the custom actions exposed by the custom resource provider, while `resourceTypes` are the custom resources. For this tutorial we will define a custom resource provider will an `action` called `myCustomAction` and a `resourceType` called `myCustomResource`.

Sample custom resource provider:

```JSON
{
  "properties": {
    "actions": [
      {
        "name": "myCustomAction",
        "routingType": "Proxy",
        "endpoint": "{myFunctionTriggerURL}"
      }
    ],
    "resourceTypes": [
      {
        "name": "myCustomResources",
        "routingType": "Proxy",
        "endpoint": "{myFunctionTriggerURL}"
      }
    ]
  },
  "location": "eastus"
}
```

Replace `{myFunctionTriggerURL}` with the **endpoint** URL from the function we created earlier in the tutorial.

### Deploying the custom resource provider

The above custom resource provider can be deployed using an Azure Resource Manager Template.

Sample template:

```JSON
{
    "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "resources": [
        {
            "type": "Microsoft.CustomProviders/resourceProviders",
            "name": "{resourceProviderName}",
            "apiVersion": "2018-09-01-preview",
            "location": "eastus",
            "properties": {
                "actions": [
                    {
                    "name": "myCustomAction",
                    "routingType": "Proxy",
                    "endpoint": "{myFunctionTriggerURL}"
                    }
                ],
                "resourceTypes": [
                    {
                    "name": "myCustomResources",
                    "routingType": "Proxy",
                    "endpoint": "{myFunctionTriggerURL}"
                    }
                ]
            }
        }
    ]
}
```

## Using custom actions and resources

### Custom actions

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az resource invoke-action --action myCustomAction \
                          --ids /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.CustomProviders/resourceProviders/{resourceProviderName} \
                          --request-body \
                            '{
                                "hello": "world"
                            }'
```

Parameter | Required | Description
---|---|---
action | *yes* | The name of the action defined in the **ResourceProvider**.
ids | *yes* | The resource ID of the **ResourceProvider**.
request-body | *no* | The request body that will be sent to the **endpoint**.

# [Template](#tab/template)

None.

---

### Custom resources

# [Azure CLI](#tab/azure-cli)

Create a custom resource:

```azurecli-interactive
az resource create --is-full-object \
                   --id /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.CustomProviders/resourceProviders/{resourceProviderName}/myCustomResources/{customResourceName} \
                   --properties \
                    '{
                        "location": "eastus",
                        "properties": {
                            "hello" : "world"
                        }
                    }'
```

Parameter | Required | Description
---|---|---
is-full-object | *yes* | Indicates that the properties object includes other options such as location, tags, sku, and/or plan.
id | *yes* | The resource ID of the custom resource. This should exist off of the **ResourceProvider**
properties | *yes* | The request body that will be sent to the **endpoint**.

Delete an Azure Custom Resource:

```azurecli-interactive
az resource delete --id /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.CustomProviders/resourceProviders/{resourceProviderName}/myCustomResources/{customResourceName}
```

Parameter | Required | Description
---|---|---
id | *yes* | The resource ID of the custom resource. This should exist off of the **ResourceProvider**.

Retrieve an Azure Custom Resource:

```azurecli-interactive
az resource show --id /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.CustomProviders/resourceProviders/{resourceProviderName}/myCustomResources/{customResourceName}
```

Parameter | Required | Description
---|---|---
id | *yes* | The resource ID of the custom resource. This should exist off of the **ResourceProvider**

# [Template](#tab/template)

Sample Azure Resource Manager Template:

```JSON
{
    "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "resources": [
        {
            "type": "Microsoft.CustomProviders/resourceProviders/myCustomResources",
            "name": "{resourceProviderName}/{customResourceName}",
            "apiVersion": "2018-09-01-preview",
            "location": "eastus",
            "properties": {
                "hello": "world"
            }
        }
    ]
}
```

Parameter | Required | Description
---|---|---
resourceTypeName | *yes* | The **name** of the **resourceType** defined in the custom provider.
resourceProviderName | *yes* | The custom resource provider instance name.
customResourceName | *yes* | The custom resource name.

---

## Next steps

In this article, you learned about custom providers. Go to the next article to create a custom provider.

- [Tutorial: Create Azure Custom Resource Provider and deploy custom resources](./create-custom-provider.md)
- [How To: Adding Custom Actions to Azure REST API](./custom-providers-action-endpoint-how-to.md)
- [How To: Adding Custom Resources to Azure REST API](./custom-providers-resources-endpoint-how-to.md)
