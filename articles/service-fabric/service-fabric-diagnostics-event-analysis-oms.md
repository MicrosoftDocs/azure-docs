---
title: Azure Service Fabric Event Analysis with Log Analytics | Microsoft Docs
description: Learn about visualizing and analyzing events using Log Analytics for monitoring and diagnostics of Azure Service Fabric clusters.
services: service-fabric
documentationcenter: .net
author: srrengar
manager: timlt
editor: ''

ms.assetid:
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 04/16/2018
ms.author: dekapur; srrengar

---

# Event analysis and visualization with Log Analytics

Log Analytics, also known as OMS (Operations Management Suite), is a collection of management services that help with monitoring and diagnostics for applications and services hosted in the cloud. This article outlines how to run queries in Log Analytics to gain insights and troubleshoot what is happening in your cluster. The following common questions are addressed:

* How do I troubleshoot health events?
* How do I know when a node goes down?
* How do I know if my application's services have started or stopped?

## Log Analytics workspace

Log Analytics collects data from managed resources, including an Azure storage table or an agent, and maintains it in a central repository. The data can then be used for analysis, alerting, and visualization, or further exporting. Log Analytics supports events, performance data, or any other custom data. Check out [steps to configure the diagnostics extension to aggregate events](service-fabric-diagnostics-event-aggregation-wad.md) and [steps to create a Log Analytics workspace to read from the events in storage](service-fabric-diagnostics-oms-setup.md) to make sure data is flowing into Log Analytics.

After data is received by Log Analytics, Azure has several *Management Solutions* that are prepackaged solutions to monitor incoming data, customized to several scenarios. These include a *Service Fabric Analytics* solution and a *Containers* solution, which are the two most relevant ones to diagnostics and monitoring when using Service Fabric clusters. This article describes how to use the Service Fabric Analytics solution, which is created with the workspace.

## Access the Service Fabric Analytics solution

1. Go to the resource group in which you created the Service Fabric Analytics solution. Select the resource**ServiceFabric\<nameOfOMSWorkspace\>** and go to its overview page.

2. In the overview page, click the link near the top to go to the OMS portal

    ![OMS Portal link](media/service-fabric-diagnostics-event-analysis-oms/oms-portal-link.png)

3. You're now in the OMS portal and can see the solutions you have enabled. Click on the graph titled Service Fabric (first image below) to get taken to the Service Fabric solution (second image below)

    ![OMS SF solution](media/service-fabric-diagnostics-event-analysis-oms/oms-workspace-all-solutions.png)

    ![OMS SF solution](media/service-fabric-diagnostics-event-analysis-oms/service-fabric-analytics-new.png)

The image above is the home page of the Service Fabric Analytics solution. This is a snapshot view of what's happening in your cluster. If you enabled diagnostics upon cluster creation, you can see events for 

* [Operational channel](service-fabric-diagnostics-event-generation-operational.md): higher-level operations that the Service Fabric platform (collection of system services) performs.
* [Reliable Actors programming model events](service-fabric-reliable-actors-diagnostics.md)
* [Reliable Services programming model events](service-fabric-reliable-services-diagnostics.md)

>[!NOTE]
>In addition to the operational channel, more detailed system events can be collected by [updating the config of your diagnostics extension](service-fabric-diagnostics-event-aggregation-wad.md#log-collection-configurations)

### View operational events including actions on nodes

1. On the Service Fabric Analytics page on the OMS portal, click on the graph for Operational Channel

    ![OMS SF Solution Operational Channel](media/service-fabric-diagnostics-event-analysis-oms/service-fabric-analytics-new-operational.png)

2. Click Table to view the events in a list. 
Once here you will see all the system events that have been collected. For reference, these are from the WADServiceFabricSystemEventsTable in the Azure Storage account, and similarly the reliable services and actors events you see next are from those respective tables.
    
    ![OMS Query Operational Channel](media/service-fabric-diagnostics-event-analysis-oms/oms-query-operational-channel.png)

Alternatively you can click the magnifying glass on the left and use the Kusto query language to find what you're looking for. For example, to find all events related to actions taken on nodes by the cluster, you can use the following query. The event IDs used below are found in the [operational channel events reference](service-fabric-diagnostics-event-generation-operational.md)

```kusto
ServiceFabricOperationalEvent
| where EventId < 29627 and EventId > 29619 
```
You can query on many more fields such as the specific nodes (Computer) the system service (TaskName) and more

### View Service Fabric Reliable Service and Actor events

1. On the Service Fabric Analytics page on the OMS portal, click the graph for Reliable Services

    ![OMS SF Solution Reliable Services](media/service-fabric-diagnostics-event-analysis-oms/service-fabric-analytics-reliable-services.png)

2. Click Table to view the events in a list. Here you can see events from the reliable services. You can see different events for when the service runasync is started and completed which typically happens on deployments and upgrades. 

    ![OMS Query Reliable Services](media/service-fabric-diagnostics-event-analysis-oms/oms-query-reliable-services.png)

Reliable actor events can be viewed in a similar fashion. To configure more detailed events for reliable actors, you need to change the `scheduledTransferKeywordFilter` in the config for the diagnostic extension (shown below). Details on the values for these are in the [reliable actors events reference](service-fabric-reliable-actors-diagnostics.md#keywords)

```json
"EtwEventSourceProviderConfiguration": [
                {
                    "provider": "Microsoft-ServiceFabric-Actors",
                    "scheduledTransferKeywordFilter": "1",
                    "scheduledTransferPeriod": "PT5M",
                    "DefaultEvents": {
                    "eventDestination": "ServiceFabricReliableActorEventTable"
                    }
                },
```

The Kusto query language is powerful. Another valuable query you can run is to find out which nodes are generating the most events. The query in the screenshot below shows reliable services event aggregated with the specific service and node

![OMS Query Events per Node](media/service-fabric-diagnostics-event-analysis-oms/oms-query-events-per-node.png)

## Next steps

* To enable infrastructure monitoring i.e. performance counters, head over to [adding the OMS agent](service-fabric-diagnostics-oms-agent.md). The agent collects performance counters and adds them to your existing workspace.
* For on-premises clusters, OMS offers a Gateway (HTTP Forward Proxy) that can be used to send data to OMS. Read more about that in [Connecting computers without Internet access to OMS using the OMS Gateway](../log-analytics/log-analytics-oms-gateway.md)
* Configure OMS to set up [automated alerting](../log-analytics/log-analytics-alerts.md) to aid in detection and diagnostics
* Get familiarized with the [log search and querying](../log-analytics/log-analytics-log-searches.md) features offered as part of Log Analytics
* Get a more detailed overview of Log Analytics and what it offers, read [What is Log Analytics?](../operations-management-suite/operations-management-suite-overview.md)
