---
title: Azure Event Grid SDKs
description: Describes the SDKs for Azure Event Grid. These SDKs provide management, publishing and consumption.
ms.topic: reference
ms.date: 07/07/2019
---

# Event Grid SDKs for management and publishing

Event Grid provides SDKs that enable you to programmatically manage your resources and post events.

## Management SDKs

The management SDKs enable you to create, update, and delete event grid topics and subscriptions. Currently, the following SDKs are available:

* [.NET](https://www.nuget.org/packages/Microsoft.Azure.Management.EventGrid)
* [Go](https://github.com/Azure/azure-sdk-for-go)
* [Java](https://search.maven.org/#search%7Cga%7C1%7Cazure-mgmt-eventgrid)
* [Node](https://www.npmjs.com/package/@azure/arm-eventgrid)
* [Python](https://pypi.python.org/pypi/azure-mgmt-eventgrid)
* [Ruby](https://rubygems.org/gems/azure_mgmt_event_grid)

## Data plane SDKs

The data plane SDKs enable you to post events to topics by taking care of authenticating, forming the event, and asynchronously posting to the specified endpoint. They also enable you to consume first party events. Currently, the following SDKs are available:

| Programming language | SDK | 
| -------------------- | ---------- | ---------- | 
| .NET | Stable SDK: [Microsoft.Azure.EventGrid](https://www.nuget.org/packages/Microsoft.Azure.EventGrid)<p>Preview SDK: [Azure.Messaging.EventGrid](https://www.nuget.org/packages/Azure.Messaging.EventGrid/) |
| Java | Stable SDK: [azure-eventgrid](https://mvnrepository.com/artifact/com.microsoft.azure/azure-eventgrid)<p>Preview SDK: [azure-messaging-eventgrid](https://search.maven.org/artifact/com.azure/azure-messaging-eventgrid/)</p> |  
| Python | [azure-eventgrid](https://pypi.org/project/azure-eventgrid/#history) (see the latest stable and pre-release versions on the **Release history** page) |
| JavaScript | [@azure/eventgrid](https://www.npmjs.com/package/@azure/eventgrid/) (switch to the **Versions** tab to see the latest stable and beta version packages). | 
| Go | [Azure SDK for Go](https://github.com/Azure/azure-sdk-for-go) | | 
| Ruby | [azure_event_grid](https://rubygems.org/gems/azure_event_grid) | | 


## Next steps

* For example applications, see [Event Grid code samples](https://azure.microsoft.com/resources/samples/?sort=0&service=event-grid).
* For an introduction to Event Grid, see [What is Event Grid?](overview.md)
* For Event Grid commands in Azure CLI, see [Azure CLI](/cli/azure/eventgrid).
* For Event Grid commands in PowerShell, see [PowerShell](/powershell/module/az.eventgrid).
