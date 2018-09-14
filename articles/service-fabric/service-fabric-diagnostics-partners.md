---
title: Azure Service Fabric Monitoring Partners | Microsoft Docs
description: Learn how to monitor Azure Service Fabric with partner monitoring solutions
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
ms.date: 09/14/2018
ms.author: srrengar

---

# Azure Service Fabric Monitoring Partners

This article illustrates how one can monitor their Service Fabric applications, clusters, and infrastructure with a handful of partner solutions. We have worked with each of the partners below to create integrated offerings for Service Fabric. 


## Dynatrace

Dynatrace has a great integration with Azure services

## DataDog

## AppDynamics

## NewRelic

<!-- Need sections for Prometheus and ELK -->

## How do I view which HTTP calls are used in my services?

1. In the same Application Insights resource, you can filter on "requests" instead of exceptions and view all requests made
2. If you are using the Service Fabric Application Insights SDK, you can see a visual representation of your services connected to one another, and the number of succeeded and failed requests. On the left click "Application Map"

    ![AI App Map Blade](media/service-fabric-diagnostics-common-scenarios/app-map-blade.png)
    ![AI App Map](media/service-fabric-diagnostics-common-scenarios/app-map-new.png)

    For more information on the application map, visit the [Application Map documentation](../application-insights/app-insights-app-map.md)

## How do I create an alert when a node goes down

1. Node events are tracked by your Service Fabric cluster. Navigate to the Service Fabric Analytics solution resource named **ServiceFabric(NameofResourceGroup)**
2. Click on the graph on the bottom of the blade titled "Summary"

    ![OMS Solution](media/service-fabric-diagnostics-common-scenarios/oms-solution-azure-portal.png)

3. Here you have many graphs and tiles displaying various metrics. Click on one of the graphs and it will take you to the Log Search. Here you can query for any cluster events or performance counters.
4. Enter the following query. These event IDs are found in the [Node events reference](service-fabric-diagnostics-event-generation-operational.md#application-events)

    ```kusto
    ServiceFabricOperationalEvent
    | where EventId >= 25623 or EventId <= 25626
    ```

5. Click "New Alert Rule" at the top and now anytime an event arrives based on this query, you will receive an alert in your chosen method of communication.

    ![OMS New Alert](media/service-fabric-diagnostics-common-scenarios/oms-create-alert.png)

## How can I be alerted of application upgrade rollbacks?

1. On the same Log Search window as before enter the following query for upgrade rollbacks. These event IDs are found under [Application events reference](service-fabric-diagnostics-event-generation-operational.md#application-events)

    ```kusto
    ServiceFabricOperationalEvent
    | where EventId == 29623 or EventId == 29624
    ```

2. Click "New Alert Rule" at the top and now anytime an event arrives based on this query, you will receive an alert.

## How do I see container metrics?

In the same view with all the graphs, you will see some tiles for the performance of your containers. You need the OMS Agent and [Container Monitoring solution](service-fabric-diagnostics-oms-containers.md) for these tiles to populate.

![OMS Container Metrics](media/service-fabric-diagnostics-common-scenarios/containermetrics.png)

>[!NOTE]
>To instrument telemetry from **inside** your container you will need to add the [Application Insights nuget package for containers](https://github.com/Microsoft/ApplicationInsights-servicefabric#microsoftapplicationinsightsservicefabric--for-service-fabric-lift-and-shift-scenarios).

## How can I monitor performance counters?

1. Once you have added the OMS Agent to your cluster you need to add the specific performance counters you want to track. Navigate to the OMS Workspace’s page in the portal – from the solution’s page the workspace tab is on the left menu.

    ![OMS Workspace Tab](media/service-fabric-diagnostics-common-scenarios/workspacetab.png)

2. Once you’re on the workspace’s page, click on “Advanced settings” in the same left menu.

    ![OMS Advanced Settings](media/service-fabric-diagnostics-common-scenarios/advancedsettingsoms.png)

3. Click on Data > Windows Performance Counters (Data > Linux Performance Counters for Linux machines) to start collecting specific counters from your nodes via the OMS Agent. Here are examples of the format for counters to add

    * `.NET CLR Memory(<ProcessNameHere>)\\# Total committed Bytes`
    * `Processor(_Total)\\% Processor Time`
    * `Service Fabric Service(*)\\Average milliseconds per request`

    In the quickstart, VotingData and VotingWeb are the process names used, so tracking these counters would look like

    * `.NET CLR Memory(VotingData)\\# Total committed Bytes`
    * `.NET CLR Memory(VotingWeb)\\# Total committed Bytes`

    ![OMS Perf Counters](media/service-fabric-diagnostics-common-scenarios/omsperfcounters.png)

4. This will allow you to see how your infrastructure is handling your workloads, and set relevant alerts based on resource utilization. For example – you may want to set an alert if the total Processor utilization goes above 90% or below 5%. The counter name you would use for this is “% Processor Time.” You could do this by creating an alert rule for the following query:

    ```kusto
    Perf | where CounterName == "% Processor Time" and InstanceName == "_Total" | where CounterValue >= 90 or CounterValue <= 5.
    ```

## How do I track performance of my Reliable Services and Actors?

For tracking performance of Reliable Services or Actors in your applications, you should add the Service Fabric Actor, Actor Method, Service, and Service Method counters as well. You can add these counters in a similar fashion as the scenario above, here are examples of reliable service and actor performance counters to add in OMS

* `Service Fabric Service(*)\\Average milliseconds per request`
* `Service Fabric Service Method(*)\\Invocations/Sec`
* `Service Fabric Actor(*)\\Average milliseconds per request`
* `Service Fabric Actor Method(*)\\Invocations/Sec`

Check these links for the full list of performance counters on Reliable [Services](service-fabric-reliable-serviceremoting-diagnostics.md) and [Actors](service-fabric-reliable-actors-diagnostics.md)

## Next steps

* [Set up Alerts in AI](../application-insights/app-insights-alerts.md) to be notified about changes in performance or usage
* [Smart Detection in Application Insights](../application-insights/app-insights-proactive-diagnostics.md) performs a proactive analysis of the telemetry being sent to AI to warn you of potential performance problems
* Learn more about OMS Log Analytics [alerting](../log-analytics/log-analytics-alerts.md) to aid in detection and diagnostics.
* For on-premises clusters, OMS offers a Gateway (HTTP Forward Proxy) that can be used to send data to OMS. Read more about that in [Connecting computers without Internet access to OMS using the OMS Gateway](../log-analytics/log-analytics-oms-gateway.md)
* Get familiarized with the [log search and querying](../log-analytics/log-analytics-log-searches.md) features offered as part of Log Analytics
* Get a more detailed overview of Log Analytics and what it offers, read [What is Log Analytics?](../operations-management-suite/operations-management-suite-overview.md)
