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

## Active-active and active-passive roles

You can set up your primary and secondary locations so that the logic app instances in those locations play these roles.

| Primary-secondary role | Description |
|------------------------|-------------|
| *Active-active* | Logic app instances in both locations actively handle requests, for example: <p><p>- You can have the secondary instance listen to an HTTP endpoint, and then load balance traffic between the two instances as necessary. <p>- You can have the secondary instance act as a competing consumer so that both instances compete for messages from a queue. If one instance fails, the other instance takes over the workload. |
| *Active-passive* | The primary instance handles the entire workload, while the secondary instance is passive, or inactive. The secondary waits for a signal that the primary can no longer function due to a disruption. On receiving this signal happens, the secondary takes over as the active instance. |
| Some combination of both | For example, some logic apps play an active-active role, while other logic apps play an active-passive role. |
|||

## Logic app state and history

When your logic app is triggered and starts running, the app's state is stored in the same location where the app started and is non-transferable to another location. If a failure or disruption happens, any in-progress workflow instances are abandoned. When you have a primary and secondary locations set up, new workflow instances start running at the secondary location.

### Reduce abandoned in-progress instances

To minimize the number of abandoned in-progress workflow instances, you have various patterns that you can implement. For example, the [fixed routing slip pattern](https://www.enterpriseintegrationpatterns.com/patterns/messaging/RoutingTable.html) is an enterprise message pattern that splits a business process into smaller stages. You can the set up a logic app to handle the workload for each stage. To communicate with each other, these logic apps use an asynchronous messaging protocol, such as Azure Service Bus queues or topics. So, by dividing a process into smaller stages, you can reduce the number of stages that might get stuck in a failed workflow instance.

If you have these logic apps in both primary and secondary locations, you can implement the competing consumer pattern by setting up active-active roles for the instances in the primary and secondary locations.

![Business process split into stages that communicate with each other by using Azure Service Bus queues](./media/business-continuity-disaster-recovery-guidance/fixed-routing-slip-pattern.png)

### Access to trigger and runs history

To learn more about your logic app's past workflow executions, you can review your app's trigger and runs history. This history is stored in the same location where the logic app ran and is non-transferable to another location. So, if your primary instance fails over to the secondary instance, you can access the trigger and runs history, but only for the executions in each location, not as a whole.

However, you can get location-agnostic information about your logic app's history when you set up your logic apps to send diagnostic events to an Azure Log Analytics workspace. You can then review the health and history across logic apps in multiple locations.

## Trigger type guidance

The trigger type that you use in your logic apps determine your options for how you can set up logic apps across locations in your disaster recovery strategy. You can use these trigger types in logic apps:

* [Recurrence trigger](#recurrence-trigger)
* [Polling trigger](#polling-trigger)
* [Request trigger](#request-trigger)
* [Webhook trigger](#webhook-trigger)

<a name="recurrence-trigger"></a>

### Recurrence trigger

A Recurrence trigger fires solely based a specified schedule and no other criteria, for example:

* A fixed frequency and interval, such as every 10 minutes
* A more advanced schedule, such as the last Monday of every month at 5:00 PM

If your logic app starts with a Recurrence trigger, you need to set up the primary and secondary instances as active-passive in their respective locations. To reduce the *recovery time objective* (RTO), which refers to the target duration for restoring a business process after a disruption or disaster, you can set up logic apps that use Recurrence triggers either as active-passive or passive-active. In this setup, you split the schedule across locations.

For example, if you have a logic app that needs to run every 10 minutes, set up your logic apps and locations as follows:

* Active-passive

  * In the primary location, set the active logic app's Recurrence trigger to a 20-minute recurrence that starts at the top of the hour, for example, 9:00 AM.

  * In the secondary location, set the passive logic app's Recurrence trigger to a 20-minute recurrence that starts at 10 minutes past the hour that's set in the other location, for example, 9:10 AM.

* Passive-active

  * In the secondary location, set the active logic app's Recurrence trigger to a 20-minute recurrence that starts at 10 minutes past the hour, for example, 9:10 AM.
  
  * In the primary location, set the passive logic app's Recurrence trigger to a 20-minute recurrence that starts at the top of the hour that's set in the other location, for example, 9:00 AM.
  
  When a disruptive event happens in one location, enable the passive logic app. That way, if discovering the failure takes time, this configuration limits the number of missed recurrences during that delay.

> [!NOTE]
> Although the Sliding Window trigger has the capability for you to move the 
> trigger state to an alternate region, the API for this task is undocumented.

<a name="polling-trigger"></a>

### Polling trigger

Polling triggers allows a logic app to repeatedly call a service on a fixed recurrence to determine if there's new data to be processed. The polled service can provide either static data (after reading the data it is still available for someone else to read) and volatile data (once read the data is no longer available).

To ensure that the same data isn't read multiple times state needs to be maintained to remember what data has already be read. This state can either be maintained in the client, for logic apps that will be called trigger state, or at the system or service. An example of client-side state is a trigger that reads new messages in an inbox which requires that the trigger remember the last message that was read so that it only activates the logic app when a new message arrives. An example of server-side state is a trigger that reads rows from a database based on a query where it only reads rows that don't have a isRead column set to FALSE. Each time a row is read, the logic app updates the row to set the isRead column to TRUE. This works similarly for queues or topics that have queuing semantics where a message can be read and locked and when the logic app is finished handling the message it can delete the message from the queue or topic. 

When configuring logic apps that have client-side trigger state, to ensure that the same message is not read more than once, then only one location can have the logic app active at any given time. Therefore, the logic app in the alternate location must be disabled until the primary fails over to the alternate location. Logic apps with server-side state can either be configure as active-active, where they are working as competing consumers or active-passive, or as active-passive, where the alternate is waiting until a fail over occurs. Note that if you are reading messages from queues that need to be read in order, then competing consumer can only be used in combination with sessions (aka sequential convoy message pattern) otherwise they must be configured as active-passive.

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
