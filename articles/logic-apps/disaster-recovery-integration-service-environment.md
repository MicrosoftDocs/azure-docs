---
title: Disaster recovery for integration service environments (ISE)
description: Learn how to set up your integration service environment (ISE) for disaster recovery scenarios in Azure Logic Apps
services: logic-apps
ms.suite: integration
author: kevinlam1
ms.author: klam
ms.reviewer: estfan, logicappspm
ms.topic: conceptual
ms.date: 03/31/2020
---

# Disaster recovery for integration service environments in Azure Logic Apps

This article describes how to set up a disaster recovery solution for your [integration service environment (ISE)](../logic-apps/connect-) in Azure Logic Apps.

Disaster recovery provides business continuity in the face of a disaster. Disaster can entail either a full datacenter loss, an underlying relying component loss (e.g. storage, network or compute) or an unrecoverable application issue.

Disaster recovery provides the ability to fail over to an alternate instance in the case that the primary instance fails. Fail over requires that the alternate instance be appropriately configured and can handle incoming requests and automated workloads (e.g. recurrence or polling).

A logic app can either be deployed to the multi-tenant service in an Azure public region or to your own instance of an Integration Service Environment (ISE). Integration Service Environments (ISE) are private instances of the logic apps runtime running in a location (region) that executes logic apps workloads. Running a logic app in an ISE instance is like running the logic app in a public region. Many of the disaster recovery points will apply to logic apps running in both public regions as to ISE. When using an ISE there may be other considerations such as network configuration.

Primary and secondary locations for your logic apps should be of the same host type, either both multi-tenant locations or both ISE. This is required if you are leveraging the ISE connectors and/or VNET integration in one and expect the same logic app to run in both locations with a similar configuration. In a more advanced configuration, it is possible to have them be of each type of host but you must be aware of the differences when logic apps run in each location.

The two locations can be configured with logic apps being active-active, active-passive or a combination of the two types. Active-active means that both locations are actively handling requests. This can be done when the active service is listening on an HTTP endpoint and can have traffic load balanced to it, or if it is a competing consumer where logic apps in each location are competing for messages on a queue, for example. In an active-active configuration when a failure occurs the alternate just takes more of the workload.

Active-passive means that a primary location is handling all of the workload and a secondary location is passive, not doing any work, waiting for a signal for when the primary is no longer able to do its work in the case of a disaster and it should take over as the active instance.

A combination of both active-active and active-passive means that some of the logic apps are configured as active-active and some of the logic apps are configured as active-passive.

## Set up disaster recovery

To configure for disaster recovery, you need to have a secondary location that's ready to take on the work in case the primary location goes down. This backup location can either be a Logic Apps service multi-tenant region or an instance of an ISE. That will require that the logic apps and their dependent resources are deployed and ready to run. If you are following good DevOps practices, then you would be utilizing ARM deployment templates to deploy the logic apps. Using ARM deployment templates allows for multiple parameters files where each parameter file can represent the configuration for a particular location allowing you to easily deploy the logic apps to multiple locations.

[PICTURE: Two pictures of regions and ISE pairs each with a single ARM deployment template and separate parameter files]

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
