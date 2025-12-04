---
title: Partner Events overview for system owners who desire to become partners
description: Learn how Azure Event Grid's Partner Events enables seamless event-driven solutions across platforms, helping partners publish and subscribe to events securely and at scale.
#customer intent: As a SaaS provider, I want to learn how to publish events to Azure Event Grid so that my customers can subscribe to them.
ms.topic: concept-article
ms.date: 12/04/2025
---

# Partner Events overview for partners - Azure Event Grid
Event Grid's **Partner Events** feature allows customers to **subscribe to events** that originate in a registered system by using the same mechanism they use for any other event source on Azure, such as an Azure service. Registered systems that integrate with Event Grid are known as partners. This feature also enables customers to **send events** to partner systems that support receiving and routing events to customer's solutions or endpoints in their platform. Typically, partners are software-as-a-service (SaaS) or [Enterprise Resource Planning (ERP)](https://en.wikipedia.org/wiki/Enterprise_resource_planning) providers, but they might be corporate platforms that make their events available to internal teams. They purposely integrate with Event Grid to realize end-to-end customer use cases that end on Azure (customers subscribe to events sent by partner) or end on a partner system (customers subscribe to Microsoft events sent by Azure Event Grid). Customers rely on Azure Event Grid to send events published by a partner to supported destinations such as webhooks, Azure Functions, Azure Event Hubs, or Azure Service Bus, to name a few. Customers also rely on Azure Event Grid to route events that originate in Microsoft services, such as Outlook, Teams, or Microsoft Entra ID, so that customer's solutions can react to them. With Partner Events, customers can build event-driven solutions across platforms and network boundaries to receive or send events reliably, securely, and at scale.

> [!NOTE]
> This article is a conceptual article that you should read before you decide to onboard as a partner to Azure Event Grid. For step-by-step instructions on how to onboard as an Event Grid partner using the Azure portal, see [How to onboard as an Event Grid partner (Azure portal)](onboard-partner.md). 

## Partner Events: How it works

As a partner, you create Event Grid resources that enable you to publish events to Azure Event Grid so that customers on Azure can subscribe to them. For most partners, such as SaaS providers, it's the only integration capability that they use.

You can also create Event Grid resources to receive events from Azure Event Grid. This use case is for organizations that own or manage a platform that enables their customers to receive events by exposing endpoints. Some of those organizations are ERP systems that also have event routing capabilities within their platform, which sends the incoming Azure events to a customer application hosted on their platform. 

For either publishing events or receiving events, you create the same kind of Event Grid [resources](#resources-managed-by-partners) by following these general steps. 

1. Contact the Event Grid team at [askgrid@microsoft.com](mailto:askgrid@microsoft.com?subject=Interested&nbsp;in&nbsp;onboarding&nbsp;as&nbsp;an&nbsp;Event&nbsp;Grid&nbsp;partner) to express your interest in becoming a partner. Once you contact us, we guide you through the onboarding process and help your service get an entry card on our [Azure Event Grid gallery](https://portal.azure.com/#create/Microsoft.EventGridPartnerTopic) so that your service can be found on the Azure portal. 
1. Create a [partner registration](#partner-registration). This resource is a global resource and you usually need to create it once.
1. Create a [partner namespace](#partner-namespace). This resource exposes an endpoint to which you can publish events to Azure. When creating the partner namespace, provide the partner registration you created. 
1. Customer authorizes you to create a [partner topic](concepts.md#partner-topics) in customer's Azure subscription. 
1. Customer accesses your web page or executes a command. You define the user experience, to request either the flow of your events to Azure or the ability to receive Microsoft events into your system. In response to that request, you set up your system to do so with input from the customer. For example, the customer might have the option to select certain events from your system that should be forwarded to Azure.
1. Create a partner topic in customer's Azure subscription and resource group by using channels. [Channels](#channel) are resources contained by partner namespaces.
1. Customer activates the partner topic that you created in their Azure subscription and resource group.
1. Start publishing events to your partner namespace. 

    >[!NOTE]
    > You must [register the Azure Event Grid resource provider](subscribe-to-partner-events.md#register-the-event-grid-resource-provider) to every Azure subscription where you want to create Event Grid resources. Otherwise, operations to create resources fail.


## Why should I use Partner Events?
Use the Partner Events feature if you have one or more of the following requirements.

### Partners as event publishers

- You want a mechanism to make your events available to your customers on Azure. Your users can filter and route those events by using partner topics and event subscriptions they own and manage. You could use other integration approaches such as [topics](custom-topics.md) and [domains](event-domains.md). However, those approaches don't allow for a clean separation of resource ownership, management, and billing between you and your customer. The Partner Events feature also provides a more intuitive user experience that makes it easy to discover your service.
- You need a simple multitenant model where you publish events to a single regional endpoint, the namespace’s endpoint, to route the events to different customers.  
- You want to have visibility into metrics related to published events.
- You want to use [Cloud Events 1.0](https://cloudevents.io/) schema for your events.

### For partners as a subscriber

- You want your service to react to customer events that originate in Microsoft Azure.
- You want your customer to react to Microsoft Azure service events by using their applications hosted by your platform. You use your platform's event routing capabilities to deliver events to the right customer solution.
- You want a simple model where your customers just select your service name as a destination without the need for them to know technical details like your platform endpoints.
- Your system/platform supports [Cloud Events 1.0](https://cloudevents.io/) schema.

## Resources managed by partners
As a partner, you manage the following types of resources.

### Partner registration
A registration holds general information related to a partner. A registration is required when creating a partner namespace. That is, you must have a partner registration to create the necessary Azure resources to integrate with Azure Event Grid. 

Registrations are global. That is, they're not associated with a particular Azure region. You might create a single partner registration and use that registration when creating your partner namespaces.
  
### Channel
A channel is a nested resource to a partner namespace. A channel has two main purposes:
  - It's the resource type that allows you to create partner resources on a customer's Azure subscription. When you create a channel of type `partner topic`, you create a partner topic on a customer's Azure subscription. A partner topic is a customer's resource to which events are routed when a partner system publishes events. 
  
      A channel has the same lifecycle as its associated customer partner topic or destination. When you delete a channel of type `partner topic`, you also delete the associated customer's partner topic. Similarly, if the customer deletes the partner topic, you delete the associated channel on your Azure subscription.
  - It's a resource that routes events. A channel of type `partner topic` routes events to a customer's partner topic. It supports two types of routing modes: 
      - **Channel name routing**. With this kind of routing, you publish events by using an HTTP header called `aeg-channel-name` where you provide the name of the channel to which events should be routed. As channels are a partner's representation of partner topics, the events routed to the channel show on the customer's partner topic. This kind of routing is a new capability not present in `event channels`, which support only source-based routing. Channel name routing enables more use cases than the source-based routing and it's the recommended routing mode to choose. For example, with channel name routing a customer can request events that originate in different event sources to land on a single partner topic.
      - **Source-based routing**. This routing approach is based on the value of the `source` context attribute in the event. Sources are mapped to channels and when an event comes with a source, such as a value "A", the event is routed to the partner topic associated to the channel that contains "A" in its source property.

      You might want to declare the event types that are routed to the channel and to its associated partner topic. Event types are shown to customers when creating event subscriptions on the partner topic and are used to select the specific event types to send to an event handler destination. [Learn more](onboard-partner.md#create-a-channel).

      >[!IMPORTANT]
      >You can manage event types on the channel. Once you update the values, the changes are reflected immediately on the associated partner topic.

### Partner namespace
A partner namespace is a regional resource that has an endpoint to publish events to Azure Event Grid. Partner namespaces contain either channels or event channels (legacy resource). You must create partner namespaces in regions where customers request partner topics or destinations because channels and their corresponding partner resources must reside in the same region. You can't have a channel in a given region with its related partner topic, for example, located in a different region. 

Partner namespaces contain either channels or event channels. The property **partner topic routing mode** in the namespace determines the type of resource. If you set it to **Channel name header**, you can only create channels under the namespace. If you set partner topic routing mode to **Source attribute in event**, then the namespace can only contain event channels. This decision isn't about choosing between channel name or source-based routing. Channels support both. It's about choosing between the new type of routing resource, the channels, and a legacy resource, the event channels.

### Event channel

An event channel is the resource that was first released with partner events to route incoming events to partner topics. Event channels only support source-based routing and they always represent a customer partner topic. 

>[!IMPORTANT]
>Event channels are being deprecated. Use channels instead.

## Verified partners

A verified partner is a partner organization whose identity Microsoft validates. It's strongly encouraged that your organization gets verified. Customers seek to engage with partners that are verified as such verification provides greater assurances that they're dealing with a legitimate organization. Once verified, you benefit from having a presence on the [Event Grid Gallery](https://portal.azure.com/#create/Microsoft.EventGridPartnerTopic) where customers can discover your service easily and have a first-party experience when subscribing to your events, for example.

## Customer authorization to create partner topics

Customers authorize you to create partner topics in their Azure subscription. The authorization is granted for a given resource group in a customer Azure subscription and it's time bound. You must create the channel before the expiration date set by the customer. You should have documentation suggesting the customer an adequate window of time for configuring your system to send or receive events and to create the channel before the authorization expires. If you attempt to create a channel without authorization or after it expires, the channel creation fails and no resource is created on the customer's Azure subscription. 

> [!NOTE]
> Event Grid started **enforcing authorization checks to create partner topics** around June 30, 2022. Your documentation should ask your customers to grant you the authorization as a prerequisite before you create a channel.

>[!IMPORTANT]
> **A verified partner isn't an authorized partner**. Even if a partner is vetted by Microsoft, you still need authorization before you can create a partner topic in the customer's Azure subscription. 

## Partner topic activation

Customer activates the partner topic or destination you created for them. At that point, the channel's activation status changes to **Activated**. Once a channel is activated, you can start publishing events to the partner namespace endpoint that contains the channel. 

### How do you automate the process to know when you can start publishing events for a given partner topic?

You have two options:
- Read (poll) the channel state periodically to check if the activation status transitioned from **NeverActivated** to **Activated**. This operation can be computationally intensive.
- Create an [event subscription](subscribe-through-portal.md)  for the [Azure subscription](event-schema-subscriptions.md#available-event-types) or [resource group](event-schema-resource-groups.md#available-event-types) that contains one or more channels you want to monitor. You receive `Microsoft.Resources.ResourceWriteSuccess` events whenever a channel is updated. You then need to read the state of the channel with the Azure Resource Manager ID provided in the event to ascertain that the update is related to a change in the activation status to **Activated**.

## References

  * [Swagger](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/eventgrid/resource-manager/Microsoft.EventGrid)
  * [ARM template](/azure/templates/microsoft.eventgrid/allversions)
  * [ARM template schema](https://github.com/Azure/azure-resource-manager-schemas/blob/main/schemas/2022-06-15/Microsoft.EventGrid.json)
  * [REST APIs](/rest/api/eventgrid/controlplane-preview/partner-namespaces)
  * [CLI extension](/cli/azure/eventgrid)

### SDKs
  * [.NET](https://www.nuget.org/packages/Microsoft.Azure.Management.EventGrid/5.3.1-preview)
  * [Python](https://pypi.org/project/azure-mgmt-eventgrid/)
  * [Java](https://central.sonatype.com/search?q=azure-mgmt-eventgrid)
  * [Ruby](https://rubygems.org/gems/azure_mgmt_event_grid/)
  * [JS](https://www.npmjs.com/package/@azure/arm-eventgrid)
  * [Go](https://github.com/Azure/azure-sdk-for-go)


## Next steps
- [How to onboard as an Event Grid partner (Azure portal)](onboard-partner.md)
- [Partner topics onboarding form](https://aka.ms/gridpartnerform)
- [Partner topics overview](partner-events-overview.md)
- [Auth0 partner topic](auth0-overview.md)
- [How to use the Auth0 partner topic](auth0-how-to.md)
