---
title: CloudEvents v1.0 schema with Azure Event Grid
description: Describes how to use the CloudEvents v1.0 schema for events in Azure Event Grid. The service supports events in the JSON implementation of Cloud Events. 
ms.topic: how-to
ms.date: 09/24/2024
#customer intent: As a developer, I want to know how to use Cloud Events schema with Azure Event Grid.
---

# CloudEvents v1.0 schema with Azure Event Grid

Azure Event Grid natively supports events in the [JSON implementation of CloudEvents v1.0](https://github.com/cloudevents/spec/blob/v1.0/json-format.md) and [HTTP protocol binding](https://github.com/cloudevents/spec/blob/v1.0/http-protocol-binding.md). [CloudEvents](https://cloudevents.io/) is an [open specification](https://github.com/cloudevents/spec/blob/v1.0/spec.md) for describing event data. CloudEvents simplifies interoperability by providing a common event schema for publishing, and consuming cloud based events. This schema allows for uniform tooling, standard ways of routing & handling events, and universal ways of deserializing the outer event schema. With a common schema, you can more easily integrate work across platforms.

CloudEvents is being built by several [collaborators](https://github.com/cloudevents/spec/blob/main/docs/contributors.md), including Microsoft, through the [Cloud Native Computing Foundation](https://www.cncf.io/). It's currently available as version 1.0.

This article describes using CloudEvents schema with Event Grid.

## Sample event using CloudEvents schema

Here's an example of an Azure Blob Storage event in the CloudEvents format:

```json
{
    "specversion": "1.0",
    "type": "Microsoft.Storage.BlobCreated",  
    "source": "/subscriptions/{subscription-id}/resourceGroups/{resource-group}/providers/Microsoft.Storage/storageAccounts/{storage-account}",
    "id": "9aeb0fdf-c01e-0131-0922-9eb54906e209",
    "time": "2019-11-18T15:13:39.4589254Z",
    "subject": "blobServices/default/containers/{storage-container}/blobs/{new-file}",    
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

A detailed description of the available fields, their types, and definitions in CloudEvents v1.0 is [available here](https://github.com/cloudevents/spec/blob/v1.0/spec.md#required-attributes).

The headers values for events delivered in the CloudEvents schema and the Event Grid schema are the same except for `content-type`. For CloudEvents schema, that header value is `"content-type":"application/cloudevents+json; charset=utf-8"`. For Event Grid schema, that header value is `"content-type":"application/json; charset=utf-8"`.

## Configuration for CloudEvents

You can use Event Grid for both input and output of events in CloudEvents schema. You can use CloudEvents for system events, like Blob Storage events and IoT Hub events, and custom events. In addition to supporting CloudEvents, Event Grid supports a proprietary, nonextensible, yet fully functional [Event Grid event format](event-schema.md). The following table describes the transformation supported when using CloudEvents and Event Grid formats as an input schema in topics and as an output schema in event subscriptions. An Event Grid output schema can't be used when using CloudEvents as an input schema because CloudEvents supports [extension attributes](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/primer.md#cloudevent-attribute-extensions) that aren't supported by the Event Grid schema.

| Input schema       | Output schema
|--------------------|---------------------
| CloudEvents format | CloudEvents format
| Event Grid format  | CloudEvents format
| Event Grid format  | Event Grid format


For all event schemas, Event Grid requires validation when publishing to an Event Grid topic and when creating an event subscription. For more information, see [Event Grid security and authentication](security-authentication.md).

### Input schema

You set the input schema for a custom topic when you create the custom topic by using the `input-schema` parameter.

For the Azure CLI, use:

```azurecli-interactive
az eventgrid topic create --name demotopic -l westcentralus -g gridResourceGroup --input-schema cloudeventschemav1_0
```

For PowerShell, use:

```azurepowershell-interactive
New-AzEventGridTopic -ResourceGroupName gridResourceGroup -Location westcentralus -Name demotopic -InputSchema CloudEventSchemaV1_0
```

### Output schema

You set the output schema when you create the event subscription by using the `event-delivery-schema` parameter.

For the Azure CLI, use:

```azurecli-interactive
topicID=$(az eventgrid topic show --name demotopic -g gridResourceGroup --query id --output tsv)

az eventgrid event-subscription create --name demotopicsub --source-resource-id $topicID --endpoint <endpoint_URL> --event-delivery-schema cloudeventschemav1_0
```

For PowerShell, use:
```azurepowershell-interactive
$topicid = (Get-AzEventGridTopic -ResourceGroupName gridResourceGroup -Name <topic-name>).Id

New-AzEventGridSubscription -ResourceId $topicid -EventSubscriptionName <event_subscription_name> -Endpoint <endpoint_URL> -DeliverySchema CloudEventSchemaV1_0
```

<a name="azure-functions"></a>

## Use with Azure Functions

### Visual Studio or Visual Studio Code

If you're using Visual Studio or Visual Studio Code, and C# programming language to develop functions, make sure that you're using the latest [Microsoft.Azure.WebJobs.Extensions.EventGrid](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.EventGrid/) NuGet package (version **3.3.1** or above).

In Visual Studio, use the **Tools** -> **NuGet Package Manager** -> **Package Manager Console**, and run the `Install-Package` command (`Install-Package Microsoft.Azure.WebJobs.Extensions.EventGrid -Version 3.3.1`). Alternatively, right-click the project in the Solution Explorer window, and select **Manage NuGet Packages** menu to browse for the NuGet package, and install or update it to the latest version.

In VS Code, update the version number for the **Microsoft.Azure.WebJobs.Extensions.EventGrid** package in the **csproj** file for your Azure Functions project. 

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net6.0</TargetFramework>
    <AzureFunctionsVersion>v4</AzureFunctionsVersion>
  </PropertyGroup>
  <ItemGroup>
    <PackageReference Include="Microsoft.Azure.WebJobs.Extensions.EventGrid" Version="3.3.1" />
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
        public static void Run(ILogger logger, [EventGridTrigger] CloudEvent e)
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


## Related content
For information about endpoint validation with Cloud Events, see [Endpoint validation with CloudEvents 1.0](end-point-validation-cloud-events-schema.md).