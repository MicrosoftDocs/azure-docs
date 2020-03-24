---
title: Business continuity and disaster recovery
description: Design your strategy to protect data, recover quickly from disruptive events, restore resources required by critical business functions, and maintain business continuity for Azure Logic Apps
services: logic-apps
ms.suite: integration
ms.reviewer: klam, logicappspm
ms.topic: conceptual
ms.date: 03/31/2020
---

# Business continuity and disaster recovery for Azure Logic Apps

To help reduce the impact and effects that unpredictable events have on your business and customers, make sure that you have a [*disaster recovery* (DR)](https://en.wikipedia.org/wiki/Disaster_recovery) solution in place so that you can protect data, quickly restore the resources that support critical business functions, and keep operations running to maintain [*business continuity* (BC)](https://en.wikipedia.org/wiki/Business_continuity_planning). For example, disruptions can include outages, losses in underlying infrastructure or components such as storage, network, or compute resources, unrecoverable application failures, or even a full datacenter loss. By having a BCDR solution ready, your enterprise or organization can more respond faster to interruptions, planned or unplanned, and reduce downtime for your customers.

This article provides BCDR guidance and strategies that you can apply when you build automated workflows by using [Azure Logic Apps](../logic-apps/logic-apps-overview.md). Logic app workflows help you more easily integrate and orchestrate data between apps, cloud services, and on-premises systems by reducing how much code that you have to write. When you plan for BCDR, make sure that you consider not just your logic apps, but also these resources that you use with your logic apps:

* [Integration accounts](../logic-apps/logic-apps-enterprise-integration-create-integration-account.md) where you define and store the artifacts that logic apps use for [business-to-business (B2B) enterprise integration](../logic-apps/logic-apps-enterprise-integration-overview.md) scenarios. For example, you can [set up cross-region disaster recovery for integration accounts](../logic-apps/logic-apps-enterprise-integration-b2b-business-continuity.md).

* [Integration service environments (ISEs)](../logic-apps/connect-virtual-network-vnet-isolated-environment-overview.md) where you create logic apps that run in an isolated Logic Apps runtime instance within an Azure virtual network. These logic apps can then access resources that are protected behind a firewall in that virtual network.

<a name="primary-secondary-locations"></a>

## Primary and secondary locations

Each logic app has to specify a location that you want to use for deployment. This location is either a public region in global multi-tenant Azure such as "West US" or an ISE that you previously created and deployed into an Azure virtual network. Running logic apps in an ISE is similar to running logic apps in a public Azure region, so your disaster recovery strategy can apply to both scenarios. However, an ISE might require that you consider additional or other elements, such as network configuration.

> [!NOTE]
> If your logic app also uses B2B artifacts, which are stored in an integration account, 
> both your integration account and logic apps must use the same location.

This disaster recovery strategy focuses on setting up your primary logic app to [*failover*](https://en.wikipedia.org/wiki/Failover) onto a standby or backup logic app in an alternate location where Azure Logic Apps is available. That way, if the primary suffers losses, disruptions, or failures, the secondary can handle the work. For this strategy, you need to have your secondary logic app and dependent resources already deployed and ready to run in the alternate location.

If you follow good DevOps practices, you already use [Azure Resource Manager templates](../azure-resource-manager/management/overview.md) to define and deploy your logic apps and their dependent resources. Resource Manager templates give you the capability to specify a single deployment definition and then use parameter files to vary the configuration values to use based on the deployment environment, for example, different regions or environments, such as build, test, and production.

This example shows primary and secondary logic app instances, which are deployed to separate locations in the global multi-tenant Azure for this scenario. A single [Resource Manager template](../logic-apps/logic-apps-azure-resource-manager-templates-overview.md) defines both the logic app instances and the dependent resources required by those logic apps. Separate parameter files specify the configuration values to use for each deployment location:

![Primary and secondary logic app instances in separate locations](./media/business-continuity-disaster-recovery-guidance/primary-secondary-locations.png)

This example shows the same primary and secondary logic app instances but deployed to separate ISEs for this scenario. A single Resource Manager template defines both the logic app instances, the dependent resources required by those logic apps, and the ISEs as the deployment locations. Separate parameter files define the configuration values to use for deployment in each location:

![Primary and secondary logic apps in different locations](./media/business-continuity-disaster-recovery-guidance/primary-secondary-locations-ise.png)

To support disaster recovery strategies, your logic apps and locations must meet these requirements:

* Your secondary logic app in the alternate location can handle incoming requests and automated workloads, either recurring or polling.

* Both logic app instances have the same host type, which means either both are deployed to public regions in multi-tenant Azure, or both are deployed to ISEs.

  For example, this scenario requires that both locations are ISEs:

  * Your primary logic app runs in an ISE, uses ISE-versioned connectors, and integrates with resources in the associated virtual network.

  * Your secondary logic app instance must also use a similar configuration in the secondary location.

  In more advanced scenarios, you can mix both multi-tenant Azure and an ISE as locations. However, make that you consider and understand the differences between how logic apps, built-in triggers and actions, and managed connectors run in each location.

<a name="managed-connections"></a>

## Connections to resources

If your logic app needs access to services, systems, and resources such as Azure Storage accounts, SQL Server databases, Office 365 Outlook email accounts, and so on, you can create connections that authenticate access to these resources. Azure Logic Apps provides [built-in triggers and actions plus hundreds of Microsoft-managed REST API connectors](../connectors/apis-list.md) that your logic app can use to work with these resources.

From a disaster recovery perspective, when you set up your secondary instance in an alternate location, consider whether or not this instance should have its own connections and entities, rather than share the same connections with the primary instance.

For example, suppose that your logic app connects to an external service such as Salesforce. Your logic app's availability in a specific location is usually independent from that service's availability and location. In this case, you could use the same API connection to that service.

However, suppose that your logic app connects to a service that's also in the same location or region, for example, Azure SQL Database. If that entire region becomes unavailable, Azure SQL Database in that region is most likely unavailable. In this case, you'd want your secondary location to have a replicated or backup database, and you'd also want to use a separate API connection to that database.

<a name="on-premises-data-gateways"></a>

## On-premises data gateways

If your logic app runs in multi-tenant Azure and needs access to on-premises resources such as SQL Server databases, you need to install the [on-premises data gateway](../logic-apps/logic-apps-gateway-install.md) on a local computer. You can then create a data gateway resource in the Azure portal so that your logic app can use the gateway when you create a connection to the resource.

The data gateway resource is associated with a location or Azure region, just like your logic app resource. In your disaster recovery strategy, make sure that the data gateway remains available for your logic app to use. You can [enable high availability for your gateway](../logic-apps/logic-apps-gateway-install.md#high-availability) when you have multiple gateway installations.

> [!NOTE]
> If your logic app runs in an integration service environment (ISE) and uses only 
> ISE-versioned connectors for on-premises data sources, you don't need the data 
> gateway because ISE connectors provide direct access to the the on-premises resource.
>
> If no ISE-versioned connector is available for the resource that you want, 
> your logic app can still create the connection by using a non-ISE connector, 
> which runs in multi-tenant Azure, not your ISE. However, this connection 
> requires the on-premises data gateway.

<a name="roles"></a>

## Active-active and active-passive roles

You can set up your primary and secondary locations so that your logic app instances in these locations play these roles:

| Primary-secondary role | Description |
|------------------------|-------------|
| *Active-active* | Both logic app instances in both locations actively handle requests, for example: <p><p>- You can have the secondary instance listen to an HTTP endpoint and then load balance traffic between the two instances as necessary. <p>- Or, you can have the second instance act as a competing consumer so that both instances compete for messages from a queue. If one instance fails, the other instance takes over the workload. |
| *Active-passive* | The primary logic app instance handles the entire workload, while the secondary instance stays passive or inactive. The secondary waits for a signal that when the primary can no longer function due to disruption, the secondary can take over as the active instance. |
| Combination | Some logic apps play an active-active role, while other logic apps play an active-passive role. |
|||

For example, here is an active-active setup where both logic app instances actively handle requests. These instances can use either a load balancer to distribute these requests, or they can "compete" for requests from a message queue:

!["Active-active" pattern - ](./media/business-continuity-disaster-recovery-guidance/active-active-setup-load-balancer.png)

<a name="state-history"></a>

## Logic app state and history

When your logic app is triggered and starts running, the app's state is stored in the same location where the app started and is non-transferable to another location. If a failure or disruption happens, any in-progress workflow instances are abandoned. When you have a primary and secondary locations set up, new workflow instances start running at the secondary location.

> [!NOTE]
> The Sliding Window trigger, which is a schedule-based trigger, has the capability for you to 
> move that trigger's state to an alternate region, but the API for this task is undocumented.

<a name="reduce-abandoned-in-progress"></a>

### Reduce abandoned in-progress instances

To minimize the number of abandoned in-progress workflow instances, you have various patterns that you can implement. For example, the [fixed routing slip pattern](https://www.enterpriseintegrationpatterns.com/patterns/messaging/RoutingTable.html) is an enterprise message pattern that splits a business process into smaller stages. You can the set up a logic app to handle the workload for each stage. To communicate with each other, these logic apps use an asynchronous messaging protocol, such as Azure Service Bus queues or topics. So, by dividing a process into smaller stages, you can reduce the number of stages that might get stuck in a failed workflow instance.

If you have these logic apps in both primary and secondary locations, you can implement the competing consumer pattern by setting up [active-active roles](#roles) for the instances in the primary and secondary locations.

![Business process split into stages that communicate with each other by using Azure Service Bus queues](./media/business-continuity-disaster-recovery-guidance/fixed-routing-slip-pattern.png)

<a name="access-trigger-runs-history"></a>

### Access to trigger and runs history

To get more information about your logic app's past workflow executions, you can review the app's trigger and runs history. A logic app's history execution history is stored in the same location or region where that logic app ran, which means you can't migrate this history to a different location. If your primary instance fails over to a secondary instance, you can only access each instance's trigger and runs history in the respective locations where those instances ran. However, you can get location-agnostic information about your logic app's history by setting up your logic apps to send diagnostic events to an Azure Log Analytics workspace. You can then review the health and history across logic apps that run in multiple locations.

<a name="trigger-types-guidance"></a>

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

From a disaster recovery perspective, when you set up your logic app's primary and secondary instances, make sure that you account for these behaviors based on whether your logic app tracks state on the client side or on the server side:

* For a logic app that tracks client-side state, make sure that your logic app doesn't read the same message more than one time. Only one location can have an active logic app instance at any specific time. Make sure that the logic app instance in the alternate location is inactive or disabled until the primary instance fails over to the alternate location.

* For a logic app that tracks server side state, you can set up your logic app instances to play either [active-active roles](#roles) where they work as competing consumers or [active-passive roles](#roles) where the alternate instance waits until the primary instance fails over to the alternate location.

  > [!NOTE]
  > If your logic app needs to read messages in a specific order, for example, from a Service Bus queue, 
  > you can use the competing consumer pattern but only when combined with Service Bus sessions, 
  > which is also known as the *sequential convoy* pattern. Otherwise, you must set up your logic 
  > app instances with the active-passive roles.

<a name="request-trigger"></a>

### Request trigger

The **Request** trigger makes your logic app callable from other apps, services, and systems and is typically used to provide these capabilities:

* A direct REST API for your logic app that others can call

  For example, use this trigger when you want to call your logic app from other logic apps by using the **Call workflow - Logic Apps** action.

* A [webhook](#webhook-trigger) or callback mechanism for your logic app

* A mechanism for user operation routines to manually call your logic app

From a disaster recovery perspective, the Request trigger plays a passive role because the logic app doesn't do any work and waits until something explicitly calls the trigger. As a passive endpoint, you can set up your primary and secondary instances to play either of these roles:

* Active-passive where the caller or router determines when to enable or activate those instances
* Active-active when you use the load balancer pattern

As a recommended architecture, you can use Azure API Management as a proxy for the logic apps that use Request triggers. API Management provides [built-in cross-regional resiliency and the capability to route traffic across multiple endpoints](https://docs.microsoft.com/azure/api-management/api-management-howto-deploy-multi-region).

<a name="webhook-trigger"></a>

### Webhook trigger

A *webhook* trigger provides the capability for your logic app to subscribe to a service by passing a *callback URL* to that service. Your logic app can then listen and wait for a specific event to happen at that service endpoint. When the event happens, the service calls the webhook trigger by using the callback URL, which then runs the logic app. When enabled, the webhook trigger subscribes to the service. When disabled, the trigger unsubscribes from the service.

From a disaster recovery perspective, set up primary and secondary instances that use webhook triggers to play active-passive roles because only one instance should receive events or messages from the subscribed endpoint.

## Assess primary instance health

For your disaster recovery strategy to work, your solution needs ways to perform these tasks:

* [Check the primary instance's availability](#check-primary-availability)
* [Monitor the primary instance's health](#monitor-primary-health)
* [Enable the secondary instance](#enable-secondary)

This section describes one solution that you can use outright or as a foundation for your own design. Here's a high-level visual overview for this solution:

![Create watchdog logic app that monitors a health-check logic app in the primary location](./media/business-continuity-disaster-recovery-guidance/check-location-health-watchdog.png)

<a name="check-primary-availability"></a>

### Check primary instance availability

To determine whether the primary instance is available, running, and able to work, you can create a "health-check" logic app that's in the same location as the primary instance. You can then call this health- check app from an alternate location. If the health-check app successfully responds, the underlying infrastructure for the Azure Logic Apps service in that region is available and working. If the health-check app fails to respond, you can assume that the location is no longer healthy.

For this task, create a basic health-check logic app that performs these tasks:

1. Receives a call from the watchdog app by using the Request trigger.

1. Respond with a status indicating whether the checked logic app still works by using the Response action.

   > [!IMPORTANT]
   > The health-check logic app must use a Response action so that the app responds synchronously, not asynchronously.

* Optionally, to further determine whether the primary location is healthy, you can factor in the health of any other services that interact with the target logic app in this location. Just expand the health-check logic app to assess the health for these other services too.

<a name="monitor-primary-health"></a>

### Create a watchdog logic app

To monitor the primary instance's health and call the health-check logic app, create a "watchdog" logic app in an *alternate location*. For example, you can set up the watchdog logic app so that if calling the health-check logic fails, the watchdog can send an alert to your operations team so that they can investigate the failure and why the primary instance doesn't respond.

> [!IMPORTANT]
> Make sure that your watchdog logic app is in a *location that differs from primary location*. If the 
> Logic Apps service in the primary location experiences problems, your watchdog logic app might not run.

For this task, in the secondary location, create a watchdog logic app that performs these tasks:

1. Run based on a fixed or scheduled recurrence by using the Recurrence trigger.

   You can set the recurrence to a value that below the tolerance level for your recovery time objective (RTO).

1. Call the health-check logic app in the primary location by using the HTTP action, for example:

<a name="enable-secondary"></a>

### Enable your secondary instance

To automatically enable or activate the secondary location, create a logic app that calls the appropriate logic apps in the secondary location. Expand your watchdog app to call this activation logic app after a specific number of failures happen.

<a name="collect-diagnostic-data"></a>

## Collect diagnostic data

You can set up logging for your logic app runs and send the resulting diagnostic data to services such as Azure Storage, Azure Event Hubs, and Azure Log Analytics for further handling and processing.

* If you want to use this data with Azure Log Analytics, you can make the data available for both the primary and secondary locations by setting up your logic app's **Diagnostic settings** and sending the data to multiple Log Analytics workspaces.

* If you want to send the data to Azure Storage or Azure Event Hubs, you can make the data available for both the primary and secondary locations by setting up geo-redundancy. For more information, see these articles:

  * [Azure Blob Storage disaster recovery and account failover](../storage/common/storage-disaster-recovery-guidance.md)

  * [Azure Event Hubs geo-disaster recovery](../event-hubs/event-hubs-geo-dr.md)

## Next steps

* [Resiliency overview for Azure](https://docs.microsoft.com/azure/architecture/framework/resiliency/overview)
* [Resiliency checklist for specific Azure services](https://docs.microsoft.com/azure/architecture/checklist/resiliency-per-service)
* [Data management for resiliency in Azure](https://docs.microsoft.com/azure/architecture/framework/resiliency/data-management)
* [Backup and disaster recovery for Azure applications](https://docs.microsoft.com/azure/architecture/framework/resiliency/backup-and-recovery.md)
* [Recover from a region-wide service disruption](https://docs.microsoft.com/azure/architecture/resiliency/recovery-loss-azure-region)
* [Microsoft Service Level Agreements (SLAs) for Azure services](https://azure.microsoft.com/support/legal/sla/)