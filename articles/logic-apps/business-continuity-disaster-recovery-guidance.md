---
title: Business continuity and disaster recovery
description: Design a strategy to help you protect data, restore resources that support critical business functions, and maintain business continuity for Azure Logic Apps
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

This article provides guidance for planning and creating a disaster recovery solution for the automated workflows that you can build and run by using [Azure Logic Apps](../logic-apps/logic-apps-overview.md). These logic app workflows help you integrate and orchestrate data between various apps, cloud-based services, and on-premises systems.

When you design a disaster recovery strategy, consider not only your logic apps but also any [integration accounts](../logic-apps/logic-apps-enterprise-integration-create-integration-account.md) that you have for defining and storing B2B artifacts used in [enterprise integration scenarios](../logic-apps/logic-apps-enterprise-integration-overview.md), and any [integration service environments (ISEs)](../logic-apps/connect-virtual-network-vnet-isolated-environment-overview.md) that you have for running logic apps in an isolated Logic Apps runtime instance.

Each logic app specifies a location to use for deployment. This location is either a public region in global multi-tenant Azure or a previously created ISE that's deployed into an Azure virtual network. If your logic apps need to use B2B artifacts that are stored in an integration account, both your integration account and logic apps must use the same location. Running logic apps in an ISE is similar to running logic apps in a public Azure region, so your disaster recovery strategy can apply to both scenarios. However, an ISE might require that you consider additional or other elements, such as network configuration.

## Primary and secondary locations

This disaster recovery strategy focuses on setting up your primary logic app instance to *failover* onto a standby or backup instance in an alternate location where Azure Logic Apps is available. That way, if the primary instance suffers losses or failures, the secondary instance can take on the load from the primary instance. For this strategy, you need to have your logic app and dependent resources already deployed and ready to run in the alternate location.

If you follow good DevOps practices, you already use Azure Resource Manager templates to define and deploy logic apps and their dependent resources These templates give you the capability to use parameter files that specify different configuration values to use for deployment, based on the destination region or environment, such as build, test, and production.

For example, this illustration shows primary and secondary logic app instances, which are hosted in separate ISEs in this scenario. A single Resource Manager template defines the logic app and the dependent resources for deployment. Separate parameter files contain the configuration values to use for deployment to each location:

![Primary and secondary instances in different locations](./media/business-continuity-disaster-recovery-guidance/primary-secondary-locations.png)

Your instances and locations must meet these requirements:

* You need to set up the secondary instance to handle incoming requests and automated workloads, either recurring or polling.

* Both locations should have the same host type. You can deploy a logic app to either a public region in multi-tenant Azure or to an ISE. To support a disaster recovery strategy, both locations should be either multi-tenant Azure or ISEs.

  For example, both locations must be ISEs in this scenario:

  * Your primary logic app runs in an ISE, uses ISE-versioned connectors, and integrates with resources in the associated virtual network.

  * You expect this same logic app to run with a similar configuration in the secondary location.

  In more advanced scenarios, you can have locations in both multi-tenant Azure and an ISE. However, make that you consider and understand the differences between how a logic app and its connections run in each location.

## Active-active and active-passive roles

You can set up your primary and secondary locations so that the instances in those locations play these roles: *active-active*, *active-passive*, or some combination of both.

| Primary-secondary role | Description |
|------------------------|-------------|
| Active-active | Both instances actively handle requests. <p>- You can have the secondary instance listen to an HTTP endpoint, and load balance traffic between the two instances. <p>- Or, you can have the secondary instance act as a competing consumer so that both instances compete for messages from a queue. If one instance fails, the other instance takes over the workload. |
| Active-passive | The primary instance handles the entire workload, while the secondary instance is passive and doesn't do any work. However, the secondary waits for a signal that the primary can't do any work due to disruption. When this signal happens, the secondary takes over as the active instance. |
| Combination | One instance is set up as active-active, while other instance is set up as active-passive. |
|||

## Logic app state

When a logic app is invoked and runs, its state is persisted in the location where it started. The state of a running logic app is non-transferable to an alternate location. When a failure occurs, the in-flight instances would be abandoned and new instances would execute on the secondary location.

Patterns can be implemented to mitigate the number of abandoned in-flight instances when a disaster occurs. One pattern that can be implemented is the fixed routing-slip enterprise message pattern (https://www.enterpriseintegrationpatterns.com/patterns/messaging/RoutingTable.html) where the business process would be split into several smaller logic apps stages where the inter-communication between the stages uses an asynchronous messaging protocol like Service Bus queues or topics. Having these logic apps executing on both the primary and secondary would allow for a competing consumer pattern in an active-active configuration. By splitting up the logic apps into smaller stages can reduce the number of in-flight business processes that could be stuck running on the failed instance.
 
[PICTURE: A business process broken up into a series of stages that transition between the stages using queues]

Logic Apps provides the ability to interrogate the details of previous executions through the run history. That run history is stored in the location where the logic app had executed and is non-transferable. When you need to fail over to the secondary location you will only be able to access the history of logic apps that have executed in that location. To provide insight of the executions of logic apps that is location agnostic configure your logic apps to emit diagnostic events to log analytics which can provide cross logic app and cross location insights into the health of your logic apps.

## Considerations for different trigger types

Depending on the type of trigger used in a logic app will determine the options you have for configuring logic apps across locations for disaster recovery. There are 4 classes of triggers: 

* [Request trigger](#request-trigger)
* [Polling trigger](#polling-trigger)
* [Recurrence or scheduled trigger](#recurrence-trigger)
* [Webhook trigger](#webhook-trigger)

<a name="request-trigger"></a>

### Request trigger

Request triggers provide a logic app with a direct REST API that can be invoked remotely. Request triggers are typically used in the following ways:

  * REST API for other services to call either as part of an app or as a callback (webhook) mechanism

  * Allow the logic app to be called by another logic app using the call workflow action 

  * Manual invocation for more user-operations types of routines 

Request triggers are passive where the logic app will not do any work until the request trigger is explicitly invoked. As a passive endpoint it can be configured as either active-active using a load balancer or active-passive where the calling system or router determines when to deem it as active.

A recommended architecture would be to use API Management as a proxy for the logic apps with request triggers. API Management provides the built-in cross-regional resiliency and capability to route across multiple endpoints (https://docs.microsoft.com/en-us/azure/api-management/api-management-howto-deploy-multi-region).

<a name="polling-trigger"></a>

### Polling trigger

Polling triggers allows a logic app to repeatedly call a service on a fixed recurrence to determine if there's new data to be processed. The polled service can provide either static data (after reading the data it is still available for someone else to read) and volatile data (once read the data is no longer available).

To ensure that the same data isn't read multiple times state needs to be maintained to remember what data has already be read. This state can either be maintained in the client, for logic apps that will be called trigger state, or at the system or service. An example of client-side state is a trigger that reads new messages in an inbox which requires that the trigger remember the last message that was read so that it only activates the logic app when a new message arrives. An example of server-side state is a trigger that reads rows from a database based on a query where it only reads rows that don't have a isRead column set to FALSE. Each time a row is read, the logic app updates the row to set the isRead column to TRUE. This works similarly for queues or topics that have queuing semantics where a message can be read and locked and when the logic app is finished handling the message it can delete the message from the queue or topic. 

When configuring logic apps that have client-side trigger state, to ensure that the same message is not read more than once, then only one location can have the logic app active at any given time. Therefore, the logic app in the alternate location must be disabled until the primary fails over to the alternate location. Logic apps with server-side state can either be configure as active-active, where they are working as competing consumers or active-passive, or as active-passive, where the alternate is waiting until a fail over occurs. Note that if you are reading messages from queues that need to be read in order, then competing consumer can only be used in combination with sessions (aka sequential convoy message pattern) otherwise they must be configured as active-passive.

<a name="recurrence-trigger"></a>

### Recurrence trigger

Recurrence triggers will fire either on a fixed interval (e.g. every 5 minutes) or, with more advanced configurations, will fire on a specific schedule (e.g. last Monday of every month at 5:00 pm). Logic apps with recurrence triggers must be configured in an active-passive across the two locations.

To reduce the RTO you can also configure logic apps with recurrence triggers in an active-passive/passive-active configuration. In this configuration you would split the schedule across to the two locations. For example, if you have a logic app that needs to run every 10 minutes then have one location with an active logic app that has a 20 minute recurrence starting at the top of the hour (e.g. 9:00 am) and a passive (disabled) logic app configured with a recurrence trigger that also recurs every 20 minutes but with the start time at ten minutes past the hour (e.g. 9:10 am). The inverse configuration is setup at the alternate location (i.e. the logic app with the 9:10am start time is active and the logic app with the 9:00am start time is disabled). With this configuration, when a disaster occurs in one location, enable the passive logic app in the secondary location. If it takes some time to discover the failure, then this configuration limits the missed recurrences during that time window.

[NOTE: Sliding window triggers have the ability to allow the user to move the trigger state to an alternate region but the API is not documented]

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
