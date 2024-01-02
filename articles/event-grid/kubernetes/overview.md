---
title: Azure Event Grid on Kubernetes - overview
description: This article provides an overview about Event Grid on Kubernetes with Azure Arc.
author: jfggdl
ms.author: jafernan
ms.subservice: kubernetes
ms.date: 05/25/2021
ms.topic: overview
---

# Event Grid on Kubernetes with Azure Arc (Preview) - overview
This article provides an overview of Event Grid on Kubernetes, use cases for its use, features it offers, and how it differs from Azure Event Grid.

[!INCLUDE [preview-feature-note.md](../includes/preview-feature-note.md)]

## What is Event Grid?
Event Grid is an event broker used to integrate workloads that use event-driven architectures. An event-driven architecture uses events to communicate occurrences in system state changes and is a common integration approach in decoupled architectures such as those that use microservices. Event Grid offers a pub-sub, which is also described as a push-push, communication model where subscribers are sent (pushed) events and those subscribers aren't necessarily aware of the publisher that is sending the events. This model contrasts with classic push-pull models, such as the ones used by Azure Service Bus or Azure Event Hubs, where clients pull messages from message brokers and as a consequence, there's a stronger coupling between message brokers and consuming clients.

Event Grid is offered in two editions: **Azure Event Grid**, a fully managed PaaS service on Azure, and Event Grid on Kubernetes with Azure Arc, which lets you use Event Grid on your Kubernetes cluster wherever that is deployed, on-premises or on the cloud. 

For clarity, in this article we use the term **Event Grid** when referring to the general service capabilities regardless of the edition used. We refer to **Azure Event Grid** to refer to the managed service hosted on Azure. For conciseness, we refer also to **Event Grid on Kubernetes with Azure Arc** as **Event Grid on Kubernetes**.

Regardless of the edition of Event Grid you use, there's an **event publisher** that sends events to Event Grid and one or more **event subscribers** that expose endpoints where they receive events delivered by Event Grid. Not all events published to Event Grid need to be delivered to all event subscribers. Event Grid allows you to select the events that should be routed to specific destination(s) through a set of configuration settings defined in an **event subscription**. You can use filters in event subscriptions to route specific events to one endpoint or multicast to multiple endpoints. Event Grid offers a reliable delivery mechanism with retry logic too. Event Grid is also based on open standards and supports the [Cloud Events 1.0 schema specification](https://github.com/cloudevents/spec/blob/main/cloudevents/spec.md).


## Event Grid on Kubernetes with Azure Arc
Event Grid on Kubernetes with Azure Arc is an offering that allows you to run Event Grid on your own Kubernetes cluster. This capability is enabled by the use of [Azure Arc-enabled Kubernetes](../../azure-arc/kubernetes/overview.md). Through Azure Arc-enabled Kubernetes, a [supported Kubernetes cluster](install-k8s-extension.md#supported-kubernetes-distributions) connects to Azure. Once connected, you're able to [install Event Grid](install-k8s-extension.md) on it. 

### Use case
Event Grid on Kubernetes supports various event-driven integration scenarios. However, the main encompassing scenario supported and expressed as a user story is:

"As an owner of a system deployed to a Kubernetes cluster, I want to communicate my system's state changes by publishing events and configuring routing of those events so that event handlers, under my control or otherwise, can process my system's events in a way they see fit."

**Feature** that helps you realize above requirement: [Event Grid topics](/rest/api/eventgrid/controlplane-preview/topics).

### Event Grid on Kubernetes at a glance
From the user perspective, Event Grid on Kubernetes is composed of the following resources in blue:

:::image type="content" source="./media/overview/topics.png" alt-text="Resources" lightbox="./media/overview/topics.png":::

* A **topic** is a kind of input channel that exposes an endpoint to which publishers send events to Event Grid.
* An **event subscription** is a resource that contains configuration settings to filter and route events to a destination where events are delivered.
* An **event** is the announcement of state change.
* An **event handler** is an application or service that receives events and react or process the events in some way. Sometimes we also refer to event handlers as **event subscribers**. In the diagram, event handlers are the API deployed to a Kubernetes cluster (K8s) and the Azure Service Bus service.

For more information about these concepts, see [Concepts in Azure Event Grid](concepts.md).

### Sample workload integration scenarios and destinations

You can integrate workloads running on your cluster. Your publisher can be any service running on your Kubernetes cluster or any workload that has access to the topic endpoint (hosted by the Event Grid broker) to which your publisher sends events.

:::image type="content" source="./media/overview/intra-cluster-integration.png" alt-text="Intra-cluster integration" lightbox="./media/overview/intra-cluster-integration.png":::


You can also have a publisher deployed elsewhere in your network that sends events to Event Grid deployed to one of your Kubernetes clusters:

:::image type="content" source="./media/overview/network-integration.png" alt-text="In-network integration" lightbox="./media/overview/network-integration.png":::

With Event Grid on Kubernetes, you can forward events to Azure for further processing, storage, or visualization:

:::image type="content" source="./media/overview/forward-events.png" alt-text="Forward events to Azure":::

#### Destinations
Event handler destinations can be any HTTPS or HTTP endpoint to which Event Grid can reach through the network, public or private, and has access (not protected with some authentication mechanism). You define event delivery destinations when you create an event subscription. For more information, see [event handlers](event-handlers.md). 

## Features
Event Grid on Kubernetes supports [Event Grid topics](/rest/api/eventgrid/controlplane-preview/topics), which is a feature also offered by [Azure Event Grid](../custom-topics.md). Event Grid topics help you realize the [primary integration use case](#use-case) where your requirements call for integrating your system with another workload that you own or otherwise is made accessible to your system.

Some of the capabilities you get with Azure Event Grid on Kubernetes are:

* **[Event filtering](filter-events.md)**: Filter on event type, event subject, or event data to make sure event handlers only receive relevant events.
* **Fan-out**: Subscribe several endpoints to the same event to send copies of the event to many places.
* **Based on open standards**: Define your events using the CNCF's [Cloud Events 1.0 schema specification](https://github.com/cloudevents/spec/blob/main/cloudevents/spec.md).
* **Reliability**: Event Grid features a retry event delivery logic that makes sure events get to their destination.

For more information, see [features supported by Event Grid on Kubernetes](features.md).

## Pricing 
Event Grid on Kubernetes with Azure Arc is offered without charge during its preview version.

## Next steps
Follow these steps in the order to start routing events using Event Grid on Kubernetes.

1. [Connect your cluster to Azure Arc](../../azure-arc/kubernetes/quickstart-connect-cluster.md).
1. [Install an Event Grid extension](install-k8s-extension.md), which is the actual resource that deploys Event Grid to a Kubernetes cluster. To learn more about the extension, see [Event Grid Extension](install-k8s-extension.md#event-grid-extension) section to learn more. 
1. [Create a custom location](../../azure-arc/kubernetes/custom-locations.md). A custom location represents a namespace in the cluster and it's the place where topics and event subscriptions are deployed.
1. [Create a topic and one or more event subscriptions](create-topic-subscription.md).
1. [Publish events](create-topic-subscription.md).

Here are more resources that you can use:

* [Data plane SDKs](../sdk-overview.md#data-plane-sdks).
* [Publish events examples using the Data plane SDKs](https://devblogs.microsoft.com/azure-sdk/event-grid-ga/).
* [Event Grid CLI](/cli/azure/eventgrid).
* [Management SDKs](../sdk-overview.md#management-sdks).
