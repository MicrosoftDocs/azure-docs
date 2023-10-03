---
title: Azure Event Grid on Kubernetes - Features
description: This article compares features of Event Grid on Kubernetes with Event Grid on Azure.
author: jfggdl
ms.subservice: kubernetes
ms.author: jafernan
ms.date: 05/25/2021
ms.topic: conceptual
---

# Event Grid on Kubernetes with Azure Arc features
Event Grid on Kubernetes offers a rich set of features that help you integrate your Kubernetes workloads and realize hybrid architectures. It shares the same [rest API](/rest/api/eventgrid/controlplane-preview/topics) (starting with version 2020-10-15-preview), [Event Grid CLI](/cli/azure/eventgrid), Azure portal experience, [management SDKs](../sdk-overview.md#management-sdks), and [data plane SDKs](../sdk-overview.md#data-plane-sdks) with Azure Event Grid, the other edition of the same service. When you're ready to publish events, you can use the [data plane SDK examples provided in different languages](https://devblogs.microsoft.com/azure-sdk/event-grid-ga/) that work for both editions of Event Grid.

Although Event Grid on Kubernetes and Azure Event Grid share many features and the goal is to provide the same user experience, there are some differences given the unique requirements they seek to meet and the stage in which they are on their software lifecycle. For example, the only type of topic available in Event Grid on Kubernetes are Event Grid topics that sometimes are also referred as custom topics. Other types of topics are either not applicable or support for them isn't yet available. The main differences between the two editions of Event Grid are presented in the following table.

[!INCLUDE [preview-feature-note.md](../includes/preview-feature-note.md)]


## Event Grid on Kubernetes vs. Event Grid on Azure

| Feature | Event Grid on Kubernetes | Azure Event Grid |
|:--|:-:|:-:|
| [Event Grid topics](/rest/api/eventgrid/controlplane-preview/topics) | ✔ | ✔ |
| [CNCF Cloud Events schema](https://github.com/cloudevents/spec/blob/main/cloudevents/spec.md) | ✔ | ✔ |
| Event Grid and custom schemas | ✘* | ✔ |
| Reliable delivery | ✔ | ✔ |
| Metrics  | ✔** | ✔ |
| Azure Monitor  | ✘ | ✔ |
| [Dead-letter location](../manage-event-delivery.md#set-dead-letter-location) | ✘ | ✔ |
| [Forward events to another Event Grid topic](event-handlers.md#azure-event-grid) | ✔ | ✘ |
| [System Topics](../system-topics.md) | ✘ | ✔ |
| [Domain Topics](../event-domains.md) | ✘ | ✔ |
| [Partner Events](../partner-events-overview.md) | ✘ | ✔ |
| [Destination endpoint validation](../webhook-event-delivery.md#endpoint-validation-with-event-grid-events) | ✘ | ✔ |
| [Azure Event Grid trigger for Azure Functions](../../azure-functions/functions-bindings-event-grid-trigger.md) | ✘ | ✔ |
| Azure Relay's Hybrid Connections as a destination | ✘ | ✔ |
| [Advanced filtering](filter-events.md) | ✔*** | ✔ |
| [Webhook AuthN/AuthZ with Azure AD](../secure-webhook-delivery.md) | ✘ | ✔ |
| [Event delivery with resource identity](/rest/api/eventgrid/controlplane-preview/event-subscriptions/create-or-update) | ✘ | ✔ |
| Same set of data plane SDKs | ✔ | ✔ |
| Same set of management SDKs | ✔ | ✔ |
| Same Event Grid CLI | ✔ | ✔ |

\* Cloud Events 1.0 schema provides an extensibility mechanism and is an open standard. Those qualities or features aren't provided by the Event Grid or custom schemas. Cloud Events 1.0 schema is an evolution from the Event Grid schema.

\** Metrics for topics and event subscriptions is provided using the [Prometheus exposition format](https://prometheus.io/docs/instrumenting/exposition_formats/). Metrics or other Monitoring features on the Azure portal aren't currently available in the preview version.

\*** Event Grid on Kubernetes supports advanced filtering of events based on values in event data as Event Grid on Azure does, but there are a few features and operators that Event Grid on Kubernetes doesn't support. For more information, see [Advanced filtering](filter-events.md#filter-by-values-in-event-data).

## Next steps
To learn more about Event Grid on Kubernetes, see [Event Grid on Kubernetes with Azure Arc (Preview) - overview](overview.md).
