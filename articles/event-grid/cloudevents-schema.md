---
title: Use Azure Event Grid with events in CloudEvents schema
description: Describes how to use the CloudEvents schema for events in Azure Event Grid. The service supports events in the JSON implementation of CloudEvents. 
ms.topic: conceptual
ms.date: 12/02/2022
ms.devlang: csharp, javascript
ms.custom: devx-track-csharp, devx-track-azurecli, devx-track-azurepowershell, ignite-2022
---

# Use CloudEvents v1.0 schema with Event Grid

In addition to its [default event schema](event-schema.md), Azure Event Grid natively supports events in the [JSON implementation of CloudEvents v1.0](https://github.com/cloudevents/spec/blob/v1.0/json-format.md) and [HTTP protocol binding](https://github.com/cloudevents/spec/blob/v1.0/http-protocol-binding.md). [CloudEvents](https://cloudevents.io/) is an [open specification](https://github.com/cloudevents/spec/blob/v1.0/spec.md) for describing event data.

CloudEvents simplifies interoperability by providing a common event schema for publishing and consuming cloud-based events. This schema allows for uniform tooling, standard ways of routing and handling events, and universal ways of deserializing the outer event schema. With a common schema, you can more easily integrate work across platforms.

CloudEvents is being built by several [collaborators](https://github.com/cloudevents/spec/blob/main/docs/contributors.md), including Microsoft, through the [Cloud Native Computing Foundation](https://www.cncf.io/). It's currently available as version 1.0.

This article describes how to use the CloudEvents schema with Event Grid.

## CloudEvent schema

Here's an example of an Azure Blob Storage event in CloudEvents format:

```json
{
    "specversion": "1.0",
    "type": "Microsoft.Storage.BlobCreated",  
    "source": "/subscriptions/{subscription-id}/resourceGroups/{resource-group}/providers/Microsoft.Storage/storageAccounts/{storage-account}",
    "id": "9aeb0fdf-c01e-0131-0922-9eb54906e209",
    "time": "2019-11-18T15:13:39.4589254Z",
    "subject": "blobServices/default/containers/{storage-container}/blobs/{new-file}",
    "dataschema": "#",
    "data": {
        "api": "PutBlockList",
        "clientRequestId": "4c5dd7fb-2c48-4a27-bb30-5361b5de920a",
        "requestId": "9aeb0fdf-c01e-0131-0922-9eb549000000",
        "eTag": "0x8D76C39E4407333",
        "contentType": "image/png",
        "contentLength": 30699,
        "blobType": "BlockBlob",
        "url": "https://gridtesting.blob.core.windows.net/testcontainer/{new-file}",
        "sequencer": "000000000000000000000000000099240000000000c41c18",
        "storageDiagnostics": {
            "batchId": "681fe319-3006-00a8-0022-9e7cde000000"
        }
    }
}
```

For a detailed description of the available fields, their types, and definitions, see [CloudEvents v1.0](https://github.com/cloudevents/spec/blob/v1.0/spec.md#required-attributes).

The headers values for events delivered in the CloudEvents schema and the Event Grid schema are the same except for `content-type`. For the CloudEvents schema, that header value is `"content-type":"application/cloudevents+json; charset=utf-8"`. For the Event Grid schema, that header value is `"content-type":"application/json; charset=utf-8"`.

## Configure for CloudEvents

You can use Event Grid for both input and output of events in the CloudEvents schema. The following table describes the possible transformations:

 Event Grid resource | Input schema       | Delivery schema
|---------------------|-------------------|---------------------
| System topics       | Event Grid schema | Event Grid schema or CloudEvents schema
| Custom topics/domains | Event Grid schema | Event Grid schema or CloudEvents schema
| Custom topics/domains | CloudEvents schema | CloudEvents schema
| Custom topics/domains | Custom schema     | Custom schema, Event Grid schema, or CloudEvents schema
| Partner topics       | CloudEvents schema | CloudEvents schema

For all event schemas, Event Grid requires validation when you're publishing to an Event Grid topic and when you're creating an event subscription.

For more information, see [Event Grid security and authentication](security-authentication.md).

### Input schema

You set the input schema for a custom topic when you create the custom topic.

For the Azure CLI, use:

```azurecli-interactive
az eventgrid topic create \
  --name <topic_name> \
  -l westcentralus \
  -g gridResourceGroup \
  --input-schema cloudeventschemav1_0
```

For PowerShell, use:

```azurepowershell-interactive
New-AzEventGridTopic `
  -ResourceGroupName gridResourceGroup `
  -Location westcentralus `
  -Name <topic_name> `
  -InputSchema CloudEventSchemaV1_0
```

### Output schema

You set the output schema when you create the event subscription.

For the Azure CLI, use:

```azurecli-interactive
topicID=$(az eventgrid topic show --name <topic-name> -g gridResourceGroup --query id --output tsv)

az eventgrid event-subscription create \
  --name <event_subscription_name> \
  --source-resource-id $topicID \
  --endpoint <endpoint_URL> \
  --event-delivery-schema cloudeventschemav1_0
```

For PowerShell, use:
```azurepowershell-interactive
$topicid = (Get-AzEventGridTopic -ResourceGroupName gridResourceGroup -Name <topic-name>).Id

New-AzEventGridSubscription `
  -ResourceId $topicid `
  -EventSubscriptionName <event_subscription_name> `
  -Endpoint <endpoint_URL> `
  -DeliverySchema CloudEventSchemaV1_0
```

 ## Endpoint validation with CloudEvents v1.0

If you're already familiar with Event Grid, you might be aware of the endpoint validation handshake for preventing abuse. CloudEvents v1.0 implements its own [abuse protection semantics](webhook-event-delivery.md) by using the HTTP OPTIONS method. To read more about it, see [HTTP 1.1 Web Hooks for event delivery - Version 1.0](https://github.com/cloudevents/spec/blob/v1.0/http-webhook.md#4-abuse-protection). When you use the CloudEvents schema for output, Event Grid uses the CloudEvents v1.0 abuse protection in place of the Event Grid validation event mechanism.

<a name="azure-functions"></a>

## Use with Azure Functions

### Visual Studio or Visual Studio Code

If you're using Visual Studio or Visual Studio Code, and C# programming language to develop functions, make sure that you're using the latest [Microsoft.Azure.WebJobs.Extensions.EventGrid](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.EventGrid/) NuGet package (version **3.2.1** or above).

In Visual Studio, use the **Tools** -> **NuGet Package Manager** -> **Package Manager Console**, and run the `Install-Package` command (`Install-Package Microsoft.Azure.WebJobs.Extensions.EventGrid -Version 3.2.1`). Alternatively, right-click the project in the Solution Explorer window, and select **Manage NuGet Packages** menu to browse for the NuGet package, and install or update it to the latest version.

In VS Code, update the version number for the **Microsoft.Azure.WebJobs.Extensions.EventGrid** package in the **csproj** file for your Azure Functions project. 

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net6.0</TargetFramework>
    <AzureFunctionsVersion>v4</AzureFunctionsVersion>
  </PropertyGroup>
  <ItemGroup>
    <PackageReference Include="Microsoft.Azure.WebJobs.Extensions.EventGrid" Version="3.2.1" />
    <PackageReference Include="Microsoft.NET.Sdk.Functions" Version="4.1.1" />
  </ItemGroup>
  <ItemGroup>
    <None Update="host.json">
      <CopyToOutputDirectory>PreserveNewest</CopyToOutputDirectory>
    </None>
    <None Update="local.settings.json">
      <CopyToOutputDirectory>PreserveNewest</CopyToOutputDirectory>
      <CopyToPublishDirectory>Never</CopyToPublishDirectory>
    </None>
  </ItemGroup>
</Project>
```

The following example shows an Azure Functions version 3.x function that's developed in either Visual Studio or Visual Studio Code. It  uses a `CloudEvent` binding parameter and `EventGridTrigger`. 

```csharp
using Azure.Messaging;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.EventGrid;
using Microsoft.Extensions.Logging;

namespace Company.Function
{
    public static class CloudEventTriggerFunction
    {
        [FunctionName("CloudEventTriggerFunction")]
        public static void Run(
            ILogger logger,
            [EventGridTrigger] CloudEvent e)
        {
            logger.LogInformation("Event received {type} {subject}", e.Type, e.Subject);
        }
    }
}
```

### Azure portal development experience

If you're using the Azure portal to develop an Azure function, follow these steps:

1. Update the name of the parameter in `function.json` file to `cloudEvent`.

    ```json
    {
      "bindings": [
        {
          "type": "eventGridTrigger",
          "name": "cloudEvent",
          "direction": "in"
        }
      ]
    }    
    ```
1. Update the `run.csx` file as shown in the following sample code. 
    
    ```csharp
    #r "Azure.Core"
    
    using Azure.Messaging;
    
    public static void Run(CloudEvent cloudEvent, ILogger logger)
    {
        logger.LogInformation("Event received {type} {subject}", cloudEvent.Type, cloudEvent.Subject);
    }
    ```

> [!NOTE]
> For more information, see [Azure Event Grid trigger for Azure Functions](../azure-functions/functions-bindings-event-grid-trigger.md?tabs=in-process%2Cextensionv3&pivots=programming-language-csharp). 


## Next steps

* For information about monitoring event deliveries, see [Monitor Event Grid message delivery](monitor-event-delivery.md).
* We encourage you to test, comment on, and [contribute to CloudEvents](https://github.com/cloudevents/spec/blob/main/docs/CONTRIBUTING.md).
* For more information about creating an Azure Event Grid subscription, see [Event Grid subscription schema](subscription-creation-schema.md).
