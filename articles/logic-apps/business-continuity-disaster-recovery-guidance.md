---
title: Business continuity and disaster recovery
description: Design a strategy to help you protect data, recover quickly from disruptive events, restore resources required by critical business functions, and maintain business continuity for Azure Logic Apps
services: logic-apps
ms.suite: integration
author: kevinlam1
ms.author: klam
ms.reviewer: estfan, logicappspm
ms.topic: conceptual
ms.date: 03/31/2020
---

# Business continuity and disaster recovery for Azure Logic Apps

To help reduce the impact and effects that unpredictable events can have on your business, you need a *disaster recovery* (DR) solution that helps you protect data, restore resources that support critical and important business functions, and keep operations running so that you can maintain *business continuity* (BC). Disruptions can include outages, losses in underlying infrastructure or components such as storage, network, or compute resources, unrecoverable application failures, or even a full datacenter loss. By having a BCDR solution ready, your business or organization can more respond more quickly to interruptions, planned or unplanned, and keep workloads running.

This article provides guidance for planning and creating a disaster recovery solution for the automated workflows that you can build and run using [Azure Logic Apps](../logic-apps/logic-apps-overview.md). These logic app workflows help you more easily integrate and orchestrate data between various apps, cloud-based services, and on-premises systems.

When you design a disaster recovery strategy, consider not only your logic apps but also any [integration accounts](../logic-apps/logic-apps-enterprise-integration-create-integration-account.md) that you use for defining and storing B2B artifacts used in [enterprise integration scenarios](../logic-apps/logic-apps-enterprise-integration-overview.md), and any [integration service environments (ISEs)](../logic-apps/connect-virtual-network-vnet-isolated-environment-overview.md) that you use for running logic apps in an isolated instance of the Logic Apps runtime.

Each logic app specifies a location to use for deployment. This location is either a public region in global multi-tenant Azure or a previously created ISE that's deployed into an Azure virtual network. If your logic apps need to use B2B artifacts that are stored in an integration account, both your integration account and logic apps must use the same location. Running logic apps in an ISE is similar to running logic apps in a public Azure region, so your disaster recovery strategy can apply to both scenarios. However, an ISE might require that you consider additional or other elements, such as network configuration.

## Primary and secondary locations

This disaster recovery strategy focuses on setting up your primary logic app to *failover* onto a standby or backup logic app in an alternate location where Azure Logic Apps is available. That way, if the primary suffers losses or failures, the secondary can perform the work instead. For this strategy, you need to have your logic app and dependent resources already deployed and ready to run in the alternate location.

If you follow good DevOps practices, you already use Azure Resource Manager templates to define and deploy logic apps and their dependent resources These templates give you the capability to use parameter files that specify different configuration values to use for deployment, based on the destination region or environment, such as build, test, and production.

For example, this illustration shows primary and secondary logic apps, which are deployed to separate ISEs in this scenario. A single Resource Manager template defines both logic apps and the dependent resources for deployment. Separate parameter files define the configuration values to use for deployment to each location:

![Primary and secondary logic apps in different locations](./media/business-continuity-disaster-recovery-guidance/primary-secondary-locations.png)

Your logic apps and locations must meet these requirements:

* You need to set up the secondary logic app instance to handle incoming requests and automated workloads, either recurring or polling.

* Both locations should have the same host type. You can deploy a logic app to either a public region in multi-tenant Azure or to an ISE. However, to support a disaster recovery strategy, both locations should be in either multi-tenant Azure or ISEs.

  For example, this scenario requires that both locations are ISEs:

  * Your primary logic app runs in an ISE, uses ISE-versioned connectors, and integrates with resources in the associated virtual network.

  * You expect this same logic app to run with a similar configuration in the secondary location.

  In more advanced scenarios, you can mix both multi-tenant Azure and an ISE as locations. However, make that you consider and understand the differences between how logic apps, built-in triggers and actions, and managed connectors run in each location.

<a name="roles"></a>

## Active-active and active-passive roles

You can set up your primary and secondary locations so that the logic app instances in those locations play these roles.

| Primary-secondary role | Description |
|------------------------|-------------|
| *Active-active* | Logic app instances in both locations actively handle requests, for example: <p><p>- You can have the secondary instance listen to an HTTP endpoint, and then load balance traffic between the two instances as necessary. <p>- You can have the secondary instance act as a competing consumer so that both instances compete for messages from a queue. If one instance fails, the other instance takes over the workload. |
| *Active-passive* | The primary instance handles the entire workload, while the secondary instance is passive, or inactive. The secondary waits for a signal that the primary can no longer function due to a disruption. Upon receiving the signal, the secondary takes over as the active instance. |
| Some combination of both | For example, some logic apps play an active-active role, while other logic apps play an active-passive role. |
|||

## Logic app state and history

When your logic app is triggered and starts running, the app's state is stored in the same location where the app started and is non-transferable to another location. If a failure or disruption happens, any in-progress workflow instances are abandoned. When you have a primary and secondary locations set up, new workflow instances start running at the secondary location.

> [!NOTE]
> The Sliding Window trigger, which is a schedule-based trigger, has the capability for you to 
> move that trigger's state to an alternate region, but the API for this task is undocumented.

### Reduce abandoned in-progress instances

To minimize the number of abandoned in-progress workflow instances, you have various patterns that you can implement. For example, the [fixed routing slip pattern](https://www.enterpriseintegrationpatterns.com/patterns/messaging/RoutingTable.html) is an enterprise message pattern that splits a business process into smaller stages. You can the set up a logic app to handle the workload for each stage. To communicate with each other, these logic apps use an asynchronous messaging protocol, such as Azure Service Bus queues or topics. So, by dividing a process into smaller stages, you can reduce the number of stages that might get stuck in a failed workflow instance.

If you have these logic apps in both primary and secondary locations, you can implement the competing consumer pattern by setting up [active-active roles](#roles) for the instances in the primary and secondary locations.

![Business process split into stages that communicate with each other by using Azure Service Bus queues](./media/business-continuity-disaster-recovery-guidance/fixed-routing-slip-pattern.png)

### Access to trigger and runs history

To get more information about your logic app's past workflow executions, you can review the app's trigger and runs history. A logic app's history execution history is stored in the same location or region where that logic app ran, which means you can't migrate this history to a different location. If your primary instance fails over to a secondary instance, you can only access each instance's trigger and runs history in the respective locations where those instances ran. However, you can get location-agnostic information about your logic app's history by setting up your logic apps to send diagnostic events to an Azure Log Analytics workspace. You can then review the health and history across logic apps that run in multiple locations.

## Trigger type guidance

The trigger type that you use in your logic apps determine your options for how you can set up logic apps across locations in your disaster recovery strategy. You can use these trigger types in logic apps:

* [Recurrence trigger](#recurrence-trigger)
* [Polling trigger](#polling-trigger)
* [Request trigger](#request-trigger)
* [Webhook trigger](#webhook-trigger)

<a name="recurrence-trigger"></a>

### Recurrence trigger

The **Recurrence** trigger is independent from any specific service or endpoint, and fires solely based a specified schedule and no other criteria, for example:

* A fixed frequency and interval, such as every 10 minutes
* A more advanced schedule, such as the last Monday of every month at 5:00 PM

If your logic app starts with a Recurrence trigger, you need to set up the primary and secondary instances as active-passive in their respective locations. To reduce the *recovery time objective* (RTO), which refers to the target duration for restoring a business process after a disruption or disaster, you can set up logic apps that use Recurrence triggers either as active-passive or passive-active. In this setup, you split the schedule across locations.

For example, if you have a logic app that needs to run every 10 minutes, set up your logic apps and locations as follows:

* Active-passive

  * In the primary location, set the *active* logic app's Recurrence trigger to a 20-minute recurrence that starts at the top of the hour, for example, 9:00 AM.

  * In the secondary location, set the *passive* logic app's Recurrence trigger to a 20-minute recurrence that starts at 10 minutes past the hour that's set in the other location, for example, 9:10 AM.

* Passive-active

  * In the secondary location, set the *active* logic app's Recurrence trigger to a 20-minute recurrence that starts at 10 minutes past the hour, for example, 9:10 AM.

  * In the primary location, set the *passive* logic app's Recurrence trigger to a 20-minute recurrence that starts at the top of the hour that's set in the other location, for example, 9:00 AM.

  When a disruptive event happens in one location, enable the passive logic app. That way, if discovering the failure takes time, this configuration limits the number of missed recurrences during that delay.

<a name="polling-trigger"></a>

### Polling trigger

To regularly check whether new data for processing is available from a specific service or endpoint, your logic app can use a *polling* trigger that repeatedly calls the service or endpoint based on a fixed recurrence schedule. The data that the service or endpoint provides can have either of these types:

* Static data, which describes data that is always available for reading
* Volatile data, which describes data that is no longer available after reading

To avoid repeatedly reading the same data, your logic app needs to remember which data was previously read. Logic apps track their state either on the client side or on the server side.

* Logic apps track their state on the client side when they run based on their trigger state.

  For example, a trigger that reads a new message from an email inbox requires that the trigger can remember the most recently read message. That way, the trigger starts the logic app only when the next unread message arrives.

* Logic apps track their state on the server side when they run based a property value or setting that's on the server or system side.

  For example, a query-based trigger that reads a row from a database requires that the row has an `isRead` column that's set to `FALSE`. Every time that the trigger reads a row, the logic app updates that row by changing the `isRead` column from `FALSE` to `TRUE`.

  This server-side approach works similarly for Service Bus queues or topics that have queuing semantics where a trigger can read and lock a message while the logic app processes the message. When the logic app finishes processing, the trigger deletes the message from the queue or topic.

When you design your disaster recovery strategy using primary and secondary instances, make sure that you've accounted for these behaviors based on whether your logic app tracks state on the client side or on the server side:

* For a logic app that tracks client-side state, make sure that your logic app doesn't read the same message more than one time. Only one location can have an active logic app instance at any specific time. Make sure that the logic app instance in the alternate location is inactive or disabled until the primary instance fails over to the alternate location.

* For a logic app that tracks server side state, you can set up your logic app instances with either [active-active roles](#roles) where they work as competing consumers, or with [active-passive roles](#roles) where the alternate instance waits until the primary instance fails over to the alternate location.

  > [!NOTE]
  > If your logic app has to read messages in a specific order from a Service Bus queue, 
  > you can use the competing consumer pattern but only when combined with Service Bus sessions, 
  > which is also known as the *sequential convoy* pattern. Otherwise, you must set up the 
  > logic app instances with the active-passive roles.

<a name="request-trigger"></a>

### Request trigger

A logic app can use a Request trigger  provide a logic app with a direct REST API that can be invoked remotely. Request triggers are typically used in the following ways:

  * REST API for other services to call either as part of an app or as a callback (webhook) mechanism

  * Allow the logic app to be called by another logic app using the call workflow action

  * Manual invocation for more user-operations types of routines

Request triggers are passive where the logic app will not do any work until the request trigger is explicitly invoked. As a passive endpoint it can be configured as either active-active using a load balancer or active-passive where the calling system or router determines when to deem it as active.

A recommended architecture would be to use API Management as a proxy for the logic apps with request triggers. API Management provides the built-in cross-regional resiliency and capability to route across multiple endpoints (https://docs.microsoft.com/en-us/azure/api-management/api-management-howto-deploy-multi-region).

<a name="webhook-trigger"></a>

### Webhook trigger

Webhook triggers subscribe to a service by passing an endpoint that the logic app is listening to. Webhook triggers will subscribe when enabled and unsubscribe when disabled. Logic apps with webhook triggers should be configured as active-passive so that only one logic app is getting the messages/events from the subscribed endpoint.

## Assess primary location health

To determine whether or not a primary is no longer available there needs to be a mechanism that makes the determination of its health and another service to monitor it to know if the primary is down and the secondary should now become active.

### Check logic app health

A simple way to determine if a location is up and running and able to process work is by calling a logic app in the same location. If this logic app successfully responds that means the underlying infrastructure for the logic apps service in that region is working properly. [NOTE: Laveesh was working on enabling a data-plane health check endpoint on a given logic app that will explicitly indicate whether or not the scale unit it is running on is not having issues]. To accomplish this you can create a simple health-check logic app with a request trigger and a response action (note that it's important that the logic app has a response action to ensure that it responds synchronously). If this health-check logic app fails to respond successfully then we can assume that this location is no longer healthy. This health-check logic app can be enhanced to determine the health of other services that the workflows interact with at this location and their health can then be factored into determining whether or not this location is no longer available.

### Set up a watchdog logic app

In the alternate location create a watchdog logic app that has a recurrence trigger and uses the HTTP action to call the health-check logic app in the primary region. The recurrence interval can be set to some value below your RTO tolerance. It's important that the watchdog logic app not run in the same location as the primary because the if the logic apps service in the primary location is having issues, then the watchdog may not run. The watchdog logic app can be constructed so that if the call to the health-check logic fails it can send an alert to operations to investigate that something has gone wrong with the primary. A more sophisticated watchdog can be configured such that after a number of failures it will call another logic app that will automatically handle making the secondary location as the primary by enabling the appropriate set of logic apps.

## Other components

## API connections

API Connections provide authentication and configuration to the resource that a connector used in a logic app is accessing. Each location should have its own set of API Connections. When configuring logic apps in alternate region you need to take into consideration whether or not the secondary is going to utilize the same entity or if it will utilize a distinct entity that is part of the secondary location. If the logic app is referencing an external service, like Salesforce, then the availability of a logic app in a region is likely orthogonal to the referenced service's availability. In this case you can have the API Connection reference the same service endpoint. If the logic app is referencing a service in the same region, like an Azure SQL Database, and that entire region becomes unavailable, then the SQL Database is likely no longer available and in the secondary region you would likely have a replicated or backup database. In this case the API Connection in the secondary should reference the secondary database.

## Integration accounts

[Set up cross-region disaster recovery for integration accounts in Azure Logic Apps](../logic-apps/logic-apps-enterprise-integration-b2b-business-continuity.md)

### Data gateways

* [High availability for on-premises data gateways](../logic-apps/logic-apps-gateway-install.md#high-availability)

## Diagnostic data

Diagnostic data for logic apps can be ingested to multiple destinations such as Azure Log Analytics, Azure Event Hubs, or Azure Storage. If you choose Log Analytics for diagnostics data and the intent is to have this data available in the secondary region as well, then through Diagnostic settings you can ingest the data to multiple Log Analytics workspaces, for both primary and secondary locations. If your choice of data ingestion is Event Hubs or Storage, then you can configure them for geo-redundancy.

* [Azure Event Hubs geo-disaster recovery](../event-hubs/event-hubs-geo-dr.md)
* [Azure Blob Storage disaster recovery and account failover](../storage/common/storage-disaster-recovery-guidance.md)

## Next steps

* [Resiliency overview for Azure](https://docs.microsoft.com/azure/architecture/framework/resiliency/overview)
* [Resiliency checklist for specific Azure servcies](https://docs.microsoft.com/azure/architecture/checklist/resiliency-per-service)
* [Data management for resiliency in Azure](https://docs.microsoft.com/azure/architecture/framework/resiliency/data-management)
* [Backup and disaster recovery for Azure applications](https://docs.microsoft.com/azure/architecture/framework/resiliency/backup-and-recovery.md)
* [Recover from a region-wide service disruption](https://docs.microsoft.com/azure/architecture/resiliency/recovery-loss-azure-region)
* [Microsoft Service Level Agreements (SLAs) for Azure services](https://azure.microsoft.com/support/legal/sla/)
