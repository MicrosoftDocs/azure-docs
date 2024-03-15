---
title: Azure Event Grid SDKs
description: Describes the SDKs for Azure Event Grid. These SDKs provide management, publishing and consumption.
ms.topic: reference
ms.date: 07/06/2023
ms.devlang: csharp
# ms.devlang: csharp, golang, java, javascript, python
---

# Event Grid SDKs for management and publishing

Event Grid provides SDKs that enable you to programmatically manage your resources and post events.

## Management SDKs

The management SDKs enable you to create, update, and delete Event Grid topics and subscriptions. Currently, the following SDKs are available:

| SDK | Package | Reference documentation |  Samples | 
| -------- | ------- | ----------------------- | ---- | 
| REST API | | [REST reference](/rest/api/eventgrid/controlplane-preview/ca-certificates) | |
| .NET | [Azure.ResourceManager.EventGrid](https://www.nuget.org/packages/Azure.ResourceManager.EventGrid/). The beta package has the latest `Namespaces` API. | .NET reference: [Preview](/dotnet/api/overview/azure/resourcemanager.eventgrid-readme?view=azure-dotnet-preview&preserve-view=true), [GA](/dotnet/api/overview/azure/event-grid) | [.NET samples](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/eventgrid/Azure.ResourceManager.EventGrid/samples) |
| Java | [azure-resourcemanager-eventgrid](https://central.sonatype.com/artifact/com.azure.resourcemanager/azure-resourcemanager-eventgrid/). The beta package has the latest `Namespaces` API. | Java reference: [Preview](/java/api/overview/azure/resourcemanager-eventgrid-readme?view=azure-java-preview&preserve-view=true), [GA](/java/api/overview/azure/event-grid) | [Java samples](https://github.com/azure/azure-sdk-for-java/tree/main/sdk/eventgrid/azure-resourcemanager-eventgrid/src/samples) |
| JavaScript | [@azure/arm-eventgrid](https://www.npmjs.com/package/@azure/arm-eventgrid). The beta package has the latest `Namespaces` API. | JavaScript reference: [Preview](/javascript/api/overview/azure/arm-eventgrid-readme?view=azure-node-preview&preserve-view=true), [GA](/javascript/api/overview/azure/event-grid) | [JavaScript and TypeScript samples](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/eventgrid/arm-eventgrid) |
| Python | [azure-mgmt-eventgrid](https://pypi.org/project/azure-mgmt-eventgrid/). The beta package has the latest `Namespaces` API. | Python reference: [Preview](/python/api/azure-mgmt-eventgrid/?view=azure-python-preview&preserve-view=true), [GA](/python/api/overview/azure/event-grid) | [Python samples](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/eventgrid/azure-mgmt-eventgrid/generated_samples)
| Go | [Azure SDK for Go](https://github.com/Azure/azure-sdk-for-go) | | [Go samples](https://github.com/Azure-Samples/azure-sdk-for-go-samples/tree/main/sdk/resourcemanager/eventgrid) |


## Data plane SDKs

> [!NOTE]
> For MQTT messaging, you can use your favorite MQTT SDK.  Currently Azure Event Grid doesn't provide data plane SDK for MQTT.

The data plane SDKs enable you to post events to topics by taking care of authenticating, forming the event, and asynchronously posting to the specified endpoint. They also enable you to consume first party events. Currently, the following SDKs are available:

| Programming language | Package | Reference documentation |  Samples | 
| -------------------- | ---------- | ------------------- | -------- |
| REST API | | [REST reference](/rest/api/eventgrid/dataplane-preview/publish-cloud-events) |
| .NET | [Azure.Messaging.EventGrid](https://www.nuget.org/packages/Azure.Messaging.EventGrid/). The beta package has the latest `Namespaces` API. | [.NET reference](/dotnet/api/overview/azure/messaging.eventgrid-readme?view=azure-dotnet-preview&preserve-view=true) | [.NET samples](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/eventgrid/Azure.Messaging.EventGrid/samples) |
|Java | [azure-messaging-eventgrid](https://central.sonatype.com/artifact/com.azure/azure-messaging-eventgrid/). The beta package has the latest `Namespaces` API. |  [Java reference](/java/api/overview/azure/messaging-eventgrid-readme?view=azure-java-preview&preserve-view=true) | [Java samples](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/eventgrid/azure-messaging-eventgrid/src/samples/java) |
| JavaScript | [@azure/eventgrid](https://www.npmjs.com/package/@azure/eventgrid). The beta package has the latest `Namespaces` API. | [JavaScript reference](/javascript/api/overview/azure/eventgrid-readme?view=azure-node-preview&preserve-view=true) | [JavaScript and TypeScript samples](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/eventgrid/eventgrid) |
| Python | [azure-eventgrid](https://pypi.org/project/azure-eventgrid/). The beta package has the latest `Namespaces` API. | [Python reference](/python/api/overview/azure/eventgrid-readme?view=azure-python-preview&preserve-view=true) | [Python samples](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/eventgrid/azure-eventgrid/samples) |
| Go | [Azure SDK for Go](https://github.com/Azure/azure-sdk-for-go) | | |


## Next steps

* For example applications, see [Event Grid code samples](https://azure.microsoft.com/resources/samples/?sort=0&service=event-grid).
* For an introduction to Event Grid, see [What is Event Grid?](overview.md)
* For Event Grid commands in Azure CLI, see [Azure CLI](/cli/azure/eventgrid).
* For Event Grid commands in PowerShell, see [PowerShell](/powershell/module/az.eventgrid).
