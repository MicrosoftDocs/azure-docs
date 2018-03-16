---
title: Azure Service Fabric Monitoring and Diagnostics Overview | Microsoft Docs
description: Learn about monitoring and diagnostics for Azure Service Fabric clusters, applications, and services.
services: service-fabric
documentationcenter: .net
author: dkkapur
manager: timlt
editor: ''

ms.assetid:
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 01/10/2018
ms.author: dekapur

---

# Monitoring and diagnostics for Azure Service Fabric

This article provides an overview of setting up monitoring and diagnostics for your applications running in Service Fabric clusters. Monitoring and diagnostics are critical to developing, testing, and deploying workloads in any cloud environment. Monitoring enables you to track how your applications are used, your resource utilization, and the overall health of your cluster. You can use this information to diagnose and correct any issues in the cluster, and to help prevent issues from occurring in the future. 

The main goals of monitoring and diagnostics are to:
* Detect and diagnose infrastructure issues
* Detect issues with your application
* Understand resource consumption
* Track application, service, and infrastructure performance

In a Service Fabric cluster, monitoring and diagnostics data comes from three levels: application, platform (cluster), and infrastructure. 
* The [application level](service-fabric-diagnostics-event-generation-app.md) includes data about the performance of your applications and any additional custom logging that you have added. Application monitoring data should end up in Application Insights (AI) from the application itself. It can come via the AI SDK, EventFlow, or another pipeline of your choice.
* The [platform level](service-fabric-diagnostics-event-generation-infra.md) includes events from actions being taken on your cluster, related to the management of the cluster and the applications running on it. Platform monitoring data should be sent to OMS Log Analytics, with the Service Fabric Analytics solution to help visualize the incoming events. This data is typically sent to a storage account via the Windows or Linux Azure Diagnostics extension, from where it is accessed by OMS Log Analytics. 
* The infrastructure level focuses on [performance monitoring](service-fabric-diagnostics-event-generation-perf.md), looking at key metrics and performance counters to determine resource utilization and load. Performance monitoring can be achieved by using an agent - we recommend using the OMS (Microsoft Monitoring) Agent, so that your performance data ends up in the same place as your platform events, which allows for a better diagnostics experience as you correlate changes across a cluster. 

![Diagnostics overview chart](media/service-fabric-diagnostics-overview/diagnostics-overview.png)

## Monitoring scenarios

This section discusses key scenarios for monitoring a Service Fabric cluster - application, cluster, performance, and health monitoring. For each scenario, the intent and overall approach for monitoring is discussed. More details on these and other general monitoring recommendations for Azure resources can be found at [Best Practices - Monitoring and diagnostics](https://docs.microsoft.com/azure/architecture/best-practices/monitoring). 

These scenarios are also loosely mapped to the three levels of monitoring and diagnostics data as discussed above, i.e. for each scenario to be appropriately handled in the cluster, you should have monitoring and diagnostics data coming in at the corresponding level. The health monitoring scenario is an exception, since it spans the cluster and everything running in it.

## Application monitoring
Application monitoring tracks how features and components of an application that you have built, are being used. You want to monitor your applications to make sure issues that impact users are caught. Monitoring your applications can be useful in:
* determining application load and user traffic - do you need to scale your services to meet user demands or address a potential bottleneck in your application?
* identifying issues with service communication and remoting across your cluster
* figuring out what your users are doing with your application - instrumenting your applications can help guide future feature development and better diagnostics for app errors

For monitoring at the application level in Service Fabric, we recommend that you use Application Insights (AI). AI's integration with Service Fabric includes tooling experiences for Visual Studio and Azure portal and an understanding of Service Fabric service context and remoting in the AI dashboard and Application Map, leading to a comprehensive out-of-the-box logging experience. Though many logs are automatically created and collected for you when using AI, we recommend that you add further custom logging to your applications, and have that show up in AI alongside what is provided to create a richer diagnostics experience for handling issues in the future. See more about using AI with Service Fabric at [Event analysis with Application Insights](service-fabric-diagnostics-event-analysis-appinsights.md). 

To get started with instrumenting your code to monitor your applications, head over to [Application level event and log generation](service-fabric-diagnostics-event-generation-app.md). 

### Monitoring application availability
It is possible that everything in your cluster seems to be running as expected and is reporting as healthy, but your applications seem unaccessible or unreachable. Though there are not many cases in which this would happen, it is important to know when this happens to be able to mitigate it as soon as possible. Availability monitoring is broadly concerned with tracking the availability of your system's components to understand the overall "uptime" of the system. In a cluster, we focus on availability from the perspective of your application - the platform works to ensure that application lifecycle management scenarios do not cause downtime. Nonetheless, various issues in the cluster can result in impacting your application's uptime, and in these cases, as an application owner, you typically want to know right away. We recommend that alongside all your other applications, you deploy a watchdog in your cluster. The purpose of such a watchdog would be to check the appropriate endpoints for your application at a set time interval, and report back that they are accessible. You can also do this by using an external service that pings the endpoint and returns a report at the given time interval.

## Cluster monitoring
Monitoring your Service Fabric cluster is critical in ensuring that the platform and all workloads running on it are running as intended. One of Service Fabric's goals is to keep applications running through hardware failures. This is achieved through the platform's system services' ability to detect infrastructure issues and rapidly failover workloads to other nodes in the cluster. But in this particular case, what if the system services themselves have issues? Or if in attempting to move a workload, rules for the placement of services are violated? Monitoring the cluster allows you to stay informed about activity taking place in your cluster, which helps in diagnosing issues and fixing them effectively. Some key things you want to be looking out for are:
* Is Service Fabric behaving the way you expect, in terms of placing your applications and balancing work around the cluster? 
* Are actions being taken to modify the configuration of your cluster being acknowledged and acted on as expected? This is especially relevant when scaling a cluster.
* Is Service Fabric handling your data and your service-service communication inside the cluster correctly?

Service Fabric provides a comprehensive set of events out of the box, through the Operational and the Data & Messaging channels. In Windows, these are in the form of a single ETW provider with a set of relevant `logLevelKeywordFilters` used to pick between different channels. On Linux, all of the platform events come through LTTng and are put into one table, from where they can be filtered as needed. 

These channels contain curated, structured events that can be used to better understand the state of your cluster. "Diagnostics" is enabled by default at the cluster creation time, which set you up with an Azure Storage table where the events from these channels are sent for you to query in the future. You can read more about monitoring your cluster at [Platform level event and log generation](service-fabric-diagnostics-event-generation-infra.md). We recommend that you use OMS Log Analytics to monitor your cluster. OMS Log Analytics offers a Service Fabric specific solution, Service Fabric Analytics, which provides a custom dashboard for monitoring Service Fabric clusters, and allows you to query your cluster's events and set up alerts. Read more about this at [Event analysis with OMS](service-fabric-diagnostics-event-analysis-oms.md). 

### Watchdogs
Generally, a watchdog is a separate service that can watch health and load across services, ping endpoints, and report health for anything in the cluster. This can help prevent errors that would not be detected based on the view of a single service. Watchdogs are also a good place to host code that performs remedial actions without user interaction (for example, cleaning up log files in storage at certain time intervals). You can find a sample watchdog service implementation [here](https://github.com/Azure-Samples/service-fabric-watchdog-service).

## Performance monitoring
Monitoring your underlying infrastructure is a key part of understanding the state of your cluster and your resource utilization. Measuring system performance depends on several factors, each of which is typically measured through a Key Performance Indicators (KPIs). Service Fabric relevant KPIs can be mapped to metrics that can be collected from the nodes in your cluster, as performance counters.
These KPIs can help with:
* understanding resource utilization and load - for the purpose of scaling your cluster, or optimizing your service processes
* predicting infrastructure issues - many issues are preceded by sudden changes (drops) in performance, so you can use KPIs such as network I/O and CPU utilization, for predicting and diagnosing infrastructural issues

A list of performance counters that should be collected at the infrastructure level can be found at [Performance metrics](service-fabric-diagnostics-event-generation-perf.md). 

For application level performance monitoring, Service Fabric provides a set of performance counters for the Reliable Services and Actors programming models. If you are using either of these models, these performance counters can provide KPIs that help ensure that your actors are spinning up and down correctly, or that your reliable service requests are being handled fast enough. See [Monitoring for Reliable Service Remoting](service-fabric-reliable-serviceremoting-diagnostics.md#performance-counters) and [Performance monitoring for Reliable Actors](service-fabric-reliable-actors-diagnostics.md#performance-counters) for more information on these. In addition to this, Application Insights also has a set of performance metrics it will collect, if configured with your application.

Use the OMS agent to collect the appropriate performance counters, and view these KPIs in OMS Log Analytics. You can also use the Azure Diagnostics agent extension (or any other similar agent) to collect and store the metrics for analysis. 

## Health monitoring
The Service Fabric platform includes a health model, which provides extensible health reporting for the status of entities in a cluster. Each node, application, service, partition, replica, or instance, has a continuously updatable health status. The health status can either be "OK", "Warning", or "Error". The health status is changed through health reports that are emitted for each entity, based on issues in the cluster. The health status of your entities can be checked at any time in Service Fabric Explorer (SFX) as shown below, or can be queried via the platforms's Health API. You can also customize health reports and modify the health status of an entity by adding your own health reports or using the Health API. More details on the health model can be found at [Introduction to Service Fabric health monitoring](service-fabric-health-introduction.md).

![SFX health dashboard](media/service-fabric-diagnostics-overview/sfx-healthstatus.png)

In addition to seeing latest health reports in SFX, each report is also available as an event. Health events can be collected through the operational channel (see [Event aggregation with Azure Diagnostics](service-fabric-diagnostics-event-aggregation-wad.md#collect-health-and-load-events)), and stored in OMS Log Analytics for alerting and querying in the future. This helps detect issues that may impact your application availability, so we recommend that you set up alerts for appropriate failure scenarios (custom alerts through OMS).

## Monitoring workflow 

The overall workflow of monitoring and diagnostics consists of three steps:

1. **Event generation**: this includes events (logs, traces, custom events) at the infrastructure, platform (cluster), and application level
2. **Event aggregation**: this stage is effectively the pipeline for your events to end up in a tool where you can analyze them, which includes the Azure Diagnostics extension or EventFlow
3. **Analysis**: events need to be accessible in a tool, to allow for analysis - visualization, querying, alerting, etc.

Multiple products are available that cover these three areas, and you are free to choose different technologies for each. It is important to make sure that the various pieces work together to deliver an end-to-end monitoring solution for your cluster.

## Event generation

The first step in the monitoring and diagnostics workflow is to set up creation and generation of event and log data. These events, logs, and performance counters are emitted on all three levels: the application level (any instrumentation added to apps and services deployed to the cluster), platform (events emitted from the cluster based on the operation of Service Fabric), and the infrastructure level (performance metrics from each node). Diagnostics data that is collected at each of these levels is customizable, though Service Fabric does enable some default instrumentation. 

Read more about [platform level events](service-fabric-diagnostics-event-generation-infra.md) and [application level events](service-fabric-diagnostics-event-generation-app.md) to understand what is provided and how to add further instrumentation. The main decision you have to make here is how you want to instrument your application. For .NET applications, we recommend using ILogger, but you can also explore EventSource, Serilog, and other similar libraries. For Java, we recommend using Log4j. Beyond these, there are several other options available that can be used based on the nature of the application. Feel free to explore what would be best for your specific use case, or pick one that you are most comfortable using. 

After making a decision on the logging provider you would like to use, you need to make sure your logs are being aggregated and stored correctly.

## Event aggregation

For collecting the logs and events being generated by your applications and your cluster, we generally recommend using the [Azure Diagnostics extension](service-fabric-diagnostics-event-aggregation-wad.md) (more similar to agent-based log collection) or [EventFlow](service-fabric-diagnostics-event-aggregation-eventflow.md) (in-process log collection). If you are using Application Insights and are developing in .NET or Java, then using the Application Insights SDK in place of EventFlow is recommended.

While it is possible to get a similar job done with using just one of these, in most situations, combining the Azure Diagnostics extension agent with an in-process collection pipeline (AI SDK or EventFlow) leads to a more reliable, comprehensive, monitoring workflow. The Azure Diagnostics extension agent will be your path for platform level events, while you use AI SDK or EventFlow (in-process collection) for your application level logs. 

In the case that you want to use just one of these, here are some key points to keep in mind.
* Collecting application logs using the Azure Diagnostics extension is a good option for Service Fabric services if the set of log sources and destinations does not change often and there is a straightforward mapping between the sources and their destinations. The reason for this is configuring Azure Diagnostics happens at the Resource Manager layer, so making significant changes to the configuration requires updating the entire cluster. This means that it often ends up being less efficient than going with AI SDK or EventFlow.
* Using EventFlow allows you to have services send their logs directly to an analysis and visualization platform, and/or to storage. Other libraries (ILogger, Serilog, etc.) might also be used for the same purpose, but EventFlow has the benefit of having been designed specifically for in-process log collection and to support Service Fabric services. This tends to have several advantages in terms of ease of configuration and deployment, and offers more flexibility for supporting different logging libraries and analysis tools. 

## Event analysis

There are several great platforms that exist in the market when it comes to the analysis and visualization of monitoring and diagnostics data. The two that we recommend are [OMS](service-fabric-diagnostics-event-analysis-oms.md) and [Application Insights](service-fabric-diagnostics-event-analysis-appinsights.md) due to their integration with Service Fabric. You should also look into the [Elastic Stack](https://www.elastic.co/products) (especially if you are considering running a cluster in an offline environment), [Splunk](https://www.splunk.com/), or any other platform of your preference. 

The key points for any platform you choose should include how comfortable you are with the user interface and querying options, the ability to visualize data and create easily readable dashboards, and the additional tools they provide to enhance your monitoring, such as automated alerting.

In addition to the platform you choose, when you set up a Service Fabric cluster as an Azure resource, you also get access to Azure's out-of-the-box performance monitoring for your machines.

### Azure Monitor

You can use [Azure Monitor](../monitoring-and-diagnostics/monitoring-overview.md) to monitor many of the Azure resources on which a Service Fabric cluster is built. A set of metrics for the [virtual machine scale set](../monitoring-and-diagnostics/monitoring-supported-metrics.md#microsoftcomputevirtualmachinescalesets) and individual [virtual machines](../monitoring-and-diagnostics/monitoring-supported-metrics.md#microsoftcomputevirtualmachinescalesetsvirtualmachines) is automatically collected and displayed in the Azure portal. To view the collected information, in the Azure portal, select the resource group that contains the Service Fabric cluster. Then, select the virtual machine scale set that you want to view. In the **Monitoring** section (on the left nav), select **Metrics** to view a graph of the values.

![Azure portal view of collected metric information](media/service-fabric-diagnostics-overview/azure-monitoring-metrics.png)

To customize the charts, follow the instructions in [Metrics in Microsoft Azure](../monitoring-and-diagnostics/insights-how-to-customize-monitoring.md). You also can create alerts based on these metrics, as described in [Create alerts in Azure Monitor for Azure services](../monitoring-and-diagnostics/monitoring-overview-alerts.md). 

## Next steps

* Learn more about monitoring the platform and the events Service Fabric provides for you at [Platform level event and log generation](service-fabric-diagnostics-event-generation-infra.md)
* For getting started with instrumenting your applications, see [Application level event and log generation](service-fabric-diagnostics-event-generation-app.md)
* Go through the steps to set up AI for your application with [Monitor and diagnose an ASP.NET Core application on Service Fabric](service-fabric-tutorial-monitoring-aspnet.md)
* Learn how to set up OMS Log Analytics for monitoring containers - [Monitoring and Diagnostics for Windows Containers in Azure Service Fabric](service-fabric-tutorial-monitoring-wincontainers.md)

