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

To help reduce the impact that unpredictable and disruptive events can have on your business, having a *disaster recovery* (DR) solution in place helps you protect data, restore resources that support critical and important business functions, and keep operations running so that you can maintain *business continuity* (BC). Disruptions can include outages, losses in underlying infrastructure or components such as storage, network, or compute resources, unrecoverable application failures, or even a full datacenter loss. By having a BCDR solution ready, your business can more respond more quickly to interruptions, planned and unplanned, and keep workloads running.

This article provides guidance around planning and creating a disaster recovery solution for the automated workflows that you create and run by using [Azure Logic Apps](../logic-apps/logic-apps-overview.md). These workflows help your business integrate and orchestrate data between apps, cloud-based services, and on-premises systems.

## Considerations

When you design a disaster recovery strategy, consider not only your logic apps but also any [integration accounts](../logic-apps/logic-apps-enterprise-integration-create-integration-account.md) that you have for defining and storing B2B artifacts used in [enterprise integration scenarios](../logic-apps/logic-apps-enterprise-integration-overview.md), and any [integration service environments (ISEs)](../logic-apps/connect-virtual-network-vnet-isolated-environment-overview.md) that you have for running logic apps in an isolated Logic Apps runtime instance.

When you create a logic app in the [Azure portal](https://portal.azure.com), you select a location to use for deployment. This location is either a public region in global multi-tenant Azure or a previously created ISE, which is deployed into an Azure virtual network. If your logic apps need to use B2B artifacts in an integration account, both your integration account and logic apps must use the same location. Running logic apps in an ISE is similar to running logic apps in a public Azure region, so your disaster recovery strategy can apply to both scenarios. However, an ISE might require that you consider additional or other elements, such as network configuration.

## Primary and secondary locations

This disaster recovery strategy describes setting up the capability for your primary instance to *failover* onto a standby or backup instance in an alternate location where Azure Logic Apps can run. That way, if the primary instance suffers losses or failures, the secondary instance can take on the workloads from the primary instance. For the secondary instance to take over when necessary, you need to have your logic app and dependent resources already deployed and ready to run in the alternate location.

For example, this illustration shows primary and secondary logic app instances, which are hosted in separate ISEs for this particular scenario. A single Azure Resource Manager template defines the logic app and dependent resources that are necessary for deployment. Separate parameter files contain the configuration values to use for deployment in each location:

![Primary and secondary instances in different locations](./media/business-continuity-disaster-recovery-guidance/primary-secondary-locations.png)

Here are the requirements that these location must meet:

* Although you can use either a public region in multi-tenant Azure or an ISE as your deployment location, both the primary and secondary locations for your logic apps should have the same host type, which is either both multi-tenant locations or both ISEs. 

This is required if you are leveraging the ISE connectors and/or VNET integration in one and expect the same logic app to run in both locations with a similar configuration. In a more advanced configuration, it is possible to have them be of each type of host but you must be aware of the differences when logic apps run in each location.


The secondary instance needs to be configured to handle incoming requests and automated workloads, either recurring or polling.





This backup requires that you hFailover requires that you have an alternate instance that's appropriately configured to handle incoming requests and automated workloads, such as recurrence or polling.

The two locations can be configured with logic apps being active-active, active-passive or a combination of the two types. Active-active means that both locations are actively handling requests. This can be done when the active service is listening on an HTTP endpoint and can have traffic load balanced to it, or if it is a competing consumer where logic apps in each location are competing for messages on a queue, for example. In an active-active configuration when a failure occurs the alternate just takes more of the workload.

Active-passive means that a primary location is handling all of the workload and a secondary location is passive, not doing any work, waiting for a signal for when the primary is no longer able to do its work in the case of a disaster and it should take over as the active instance.

A combination of both active-active and active-passive means that some of the logic apps are configured as active-active and some of the logic apps are configured as active-passive.

If you follow good DevOps practices, you're already using Azure Resource Manager templates for deploying your logic apps. These templates provide the capability for you to create and use parameters files so that you can easily specify different configuration values to use when deploying your logic app to other regions or environments, such as build, test, and production. 

### Logic App state 

When a logic app is invoked and runs, its state is persisted in the location where it started. The state of a running logic app is non-transferable to an alternate location. When a failure occurs, the in-flight instances would be abandoned and new instances would execute on the secondary location.

Patterns can be implemented to mitigate the number of abandoned in-flight instances when a disaster occurs. One pattern that can be implemented is the fixed routing-slip enterprise message pattern (https://www.enterpriseintegrationpatterns.com/patterns/messaging/RoutingTable.html) where the business process would be split into several smaller logic apps stages where the inter-communication between the stages uses an asynchronous messaging protocol like Service Bus queues or topics. Having these logic apps executing on both the primary and secondary would allow for a competing consumer pattern in an active-active configuration. By splitting up the logic apps into smaller stages can reduce the number of in-flight business processes that could be stuck running on the failed instance.
 
[PICTURE: A business process broken up into a series of stages that transition between the stages using queues]

Logic Apps provides the ability to interrogate the details of previous executions through the run history. That run history is stored in the location where the logic app had executed and is non-transferable. When you need to fail over to the secondary location you will only be able to access the history of logic apps that have executed in that location. To provide insight of the executions of logic apps that is location agnostic configure your logic apps to emit diagnostic events to log analytics which can provide cross logic app and cross location insights into the health of your logic apps.

Considerations for different types of triggers 

Depending on the type of trigger used in a logic app will determine the options you have for configuring logic apps across locations for disaster recovery. There are 4 classes of triggers: 

* Request triggers
* Polling triggers
* Recurrence/Scheduled triggers
* Webhook triggers
* Request trigger

  Request triggers provide a logic app with a direct REST API that can be invoked remotely. Request triggers are typically used in the following ways:

  * REST API for other services to call either as part of an app or as a callback (webhook) mechanism

  * Allow the logic app to be called by another logic app using the call workflow action 

  * Manual invocation for more user-operations types of routines 

Request triggers are passive where the logic app will not do any work until the request trigger is explicitly invoked. As a passive endpoint it can be configured as either active-active using a load balancer or active-passive where the calling system or router determines when to deem it as active.

A recommended architecture would be to use API Management as a proxy for the logic apps with request triggers. API Management provides the built-in cross-regional resiliency and capability to route across multiple endpoints (https://docs.microsoft.com/en-us/azure/api-management/api-management-howto-deploy-multi-region).

### Polling triggers 

Polling triggers allows a logic app to repeatedly call a service on a fixed recurrence to determine if there's new data to be processed. The polled service can provide either static data (after reading the data it is still available for someone else to read) and volatile data (once read the data is no longer available).

To ensure that the same data isn't read multiple times state needs to be maintained to remember what data has already be read. This state can either be maintained in the client, for logic apps that will be called trigger state, or at the system or service. An example of client-side state is a trigger that reads new messages in an inbox which requires that the trigger remember the last message that was read so that it only activates the logic app when a new message arrives. An example of server-side state is a trigger that reads rows from a database based on a query where it only reads rows that don't have a isRead column set to FALSE. Each time a row is read, the logic app updates the row to set the isRead column to TRUE. This works similarly for queues or topics that have queuing semantics where a message can be read and locked and when the logic app is finished handling the message it can delete the message from the queue or topic. 

When configuring logic apps that have client-side trigger state, to ensure that the same message is not read more than once, then only one location can have the logic app active at any given time. Therefore, the logic app in the alternate location must be disabled until the primary fails over to the alternate location. Logic apps with server-side state can either be configure as active-active, where they are working as competing consumers or active-passive, or as active-passive, where the alternate is waiting until a fail over occurs. Note that if you are reading messages from queues that need to be read in order, then competing consumer can only be used in combination with sessions (aka sequential convoy message pattern) otherwise they must be configured as active-passive.

Recurrence triggers

Recurrence triggers will fire either on a fixed interval (e.g. every 5 minutes) or, with more advanced configurations, will fire on a specific schedule (e.g. last Monday of every month at 5:00 pm). Logic apps with recurrence triggers must be configured in an active-passive across the two locations.

To reduce the RTO you can also configure logic apps with recurrence triggers in an active-passive/passive-active configuration. In this configuration you would split the schedule across to the two locations. For example, if you have a logic app that needs to run every 10 minutes then have one location with an active logic app that has a 20 minute recurrence starting at the top of the hour (e.g. 9:00 am) and a passive (disabled) logic app configured with a recurrence trigger that also recurs every 20 minutes but with the start time at ten minutes past the hour (e.g. 9:10 am). The inverse configuration is setup at the alternate location (i.e. the logic app with the 9:10am start time is active and the logic app with the 9:00am start time is disabled). With this configuration, when a disaster occurs in one location, enable the passive logic app in the secondary location. If it takes some time to discover the failure, then this configuration limits the missed recurrences during that time window.

[NOTE: Sliding window triggers have the ability to allow the user to move the trigger state to an alternate region but the API is not documented]

Webhook triggers

Webhook triggers subscribe to a service by passing an endpoint that the logic app is listening to. Webhook triggers will subscribe when enabled and unsubscribe when disabled. Logic apps with webhook triggers should be configured as active-passive so that only one logic app is getting the messages/events from the subscribed endpoint.

Determine the health of primary location

To determine whether or not a primary is no longer available there needs to be a mechanism that makes the determination of its health and another service to monitor it to know if the primary is down and the secondary should now become active.

Health Check Logic App 

A simple way to determine if a location is up and running and able to process work is by calling a logic app in the same location. If this logic app successfully responds that means the underlying infrastructure for the logic apps service in that region is working properly. [NOTE: Laveesh was working on enabling a data-plane health check endpoint on a given logic app that will explicitly indicate whether or not the scale unit it is running on is not having issues]. To accomplish this you can create a simple health-check logic app with a request trigger and a response action (note that it's important that the logic app has a response action to ensure that it responds synchronously). If this health-check logic app fails to respond successfully then we can assume that this location is no longer healthy. This health-check logic app can be enhanced to determine the health of other services that the workflows interact with at this location and their health can then be factored into determining whether or not this location is no longer available.

Watchdog Logic App 

In the alternate location create a watchdog logic app that has a recurrence trigger and uses the HTTP action to call the health-check logic app in the primary region. The recurrence interval can be set to some value below your RTO tolerance. It's important that the watchdog logic app not run in the same location as the primary because the if the logic apps service in the primary location is having issues, then the watchdog may not run. The watchdog logic app can be constructed so that if the call to the health-check logic fails it can send an alert to operations to investigate that something has gone wrong with the primary. A more sophisticated watchdog can be configured such that after a number of failures it will call another logic app that will automatically handle making the secondary location as the primary by enabling the appropriate set of logic apps.

Other Components

How to configure the other related components: 

API Connections 

API Connections provide authentication and configuration to the resource that a connector used in a logic app is accessing. Each location should have its own set of API Connections. When configuring logic apps in alternate region you need to take into consideration whether or not the secondary is going to utilize the same entity or if it will utilize a distinct entity that is part of the secondary location. If the logic app is referencing an external service, like Salesforce, then the availability of a logic app in a region is likely orthogonal to the referenced service's availability. In this case you can have the API Connection reference the same service endpoint. If the logic app is referencing a service in the same region, like an Azure SQL Database, and that entire region becomes unavailable, then the SQL Database is likely no longer available and in the secondary region you would likely have a replicated or backup database. In this case the API Connection in the secondary should reference the secondary database.

Integration Accounts

See https://docs.microsoft.com/en-us/azure/logic-apps/logic-apps-enterprise-integration-b2b-business-continuity  

On-premises data gateways 

See https://docs.microsoft.com/en-us/azure/logic-apps/logic-apps-gateway-install#high-availability  

Diagnostics

Diagnostic data for logic apps can be ingested to multiple destinations such as Log Analytics, Even Hubs or Storage. If you choose Log Analytics for diagnostics data and the intent is to have this data available in the secondary region as well, then through Diagnostic settings you can ingest the data to multiple Log Analytics workspaces, for both primary and secondary locations. If your choice of data ingestion is Event Hubs or Storage, then you can configure them for geo-redundancy.

Event Hub geo-disaster recovery: https://docs.microsoft.com/azure/event-hubs/event-hubs-geo-dr

Storage disaster recovery: https://docs.microsoft.com/azure/storage/common/storage-disaster-recovery-guidance

## Next steps

* [Set up cross-region disaster recovery for integration accounts in Azure Logic Apps](../logic-apps/logic-apps-enterprise-integration-b2b-business-continuity.md)
* Learn about [backup and disaster recovery for Azure applications](https://docs.microsoft.com/azure/architecture/framework/resiliency/backup-and-recovery.md)
* Learn about [Microsoft Service Level Agreements (SLAs) for Azure services](https://azure.microsoft.com/support/legal/sla/)
