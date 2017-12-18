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
ms.date: 12/16/2017
ms.author: dekapur

---

# Monitoring and diagnostics for Azure Service Fabric

This article provides an overview of setting up monitoring and diagnostics for your applications running in Service Fabric clusters. Monitoring and diagnostics are critical to developing, testing, and deploying workloads in any cloud environment. Monitoring enables you to track the way in which your applications are being used, your resource utilization, and the overall health of your cluster and applications. You can use this information to diagnose and correct any issues in the cluster, and to help prevent issues from occurring in the future. 

The main goals of monitoring and diagnostics are to:
* Detect and diagnose infrastructure issues
* Detect issues with your application
* Understand resource consumption
* Track application, service, and infrastructure performance

In a Service Fabric cluster, monitoring and diagnostics data comes from three levels: application, platform (cluster), or infrastructure. 
* The [application level](service-fabric-diagnostics-event-generation-app.md) includes data about the performance of your applications and any additional custom logging that you have added. Application monitoring data should end up in Application Insights (AI) directly from the application itself, through the AI SDK (C# and Java applications) or via Log Analytics.
* The [platform level](service-fabric-diagnostics-event-generation-infra.md) includes events from actions being taken on your cluster, related to the management of the cluster and the applications running on it. Platform monitoring data should be sent to OMS Log Analytics, with the Service Fabric Analytics solution to help visualize the incoming events. 
* The infrastructure level focuses on performance monitoring, looking at key metrics and performance counters to determine resource utilization and load. Performance monitoring can be achieved by using an agent - we recommend using the OMS (Microsoft Monitoring) Agent, so that your performance data ends up in the same place as your platform events, which allows for a better diagnostics experience as you correlate changes across a cluster. 

![Diagnostics overview chart](media/service-fabric-diagnostics-overview/diagnostics-overview.png)

## Monitoring scenarios

This section discusses the key scenarios for monitoring a Service Fabric cluster. We cover the intent and overall approach for each of these scenarios here. More details on these and other general monitoring recommendations for Azure resources can be found at [Monitoring and diagnostics](../architecture/best-practices/monitoring.md). 

### Cluster monitoring
Monitoring your Service Fabric cluster is critical in ensuring that the platform and all workloads running on it are running as intended. One of Service Fabric's goals is to keep applications running through hardware failures. This is achieved through the platform's system services' ability to detect infrastructure issues and rapidly failover workloads to other nodes in the cluster. But in this particular case, what if the system services themselves have issues? Or if in attempting to move a workload, rules for the placement of services are violated? Monitoring the cluster allows you to stay informed about activity taking place in your cluster, which helps in diagnosing issues and fixing them effectively. Some key things you want to be looking out for are:
* Is Service Fabric behaving the way you expect, in terms of placing your applications and balancing work around the cluster? 
* Are actions being taken to modify the configuration of your cluster being acknowledged and acted on as expected? This is especially relevant when scaling a cluster.
* Is Service Fabric handling your data and your service-service communication inside the cluster correctly?

Service Fabric provides a comprehensive set of events out of the box, through the Operational and the Data & Messaging channels. These channels contain curated, structured events that can be used to better understand the state of your cluster. "Diagnostics" is enabled by default at the cluster creation time, which set you up with an Azure Storage table where the events from these channels are sent for you to query in the future. You can read more about monitoring your cluster at [Platform level event and log generation](service-fabric-diagnostics-event-generation-infra.md). We recommend that you use OMS Log Analytics to monitor your cluster. OMS Log Analytics offers a Service Fabric specific solution, Service Fabric Analytics, which provides a custom dashboard for monitoring Service Fabric clusters, and allows you to query your cluster's events and set up alerts. Read more about this at [Event analysis with OMS](service-fabric-diagnostics-event-analysis-oms.md).   

### Application monitoring
Application monitoring tracks how features and components of an application that you have built, are being used. You want to monitor your applications to make sure issues that impact users are caught. Monitoring your applications can be useful in:
* determining application load and user traffic - do you need to scale your services to meet user demands or address a potential bottleneck in your application?
* identifying issues with service communication and remoting across your cluster
* figuring out what your users are doing with your application - instrumenting your applications can help guide future feature development and better diagnostics for app errors

For monitoring at the application level in Service Fabric, we recommend that you use Application Insights (AI). AI's integration with Service Fabric includes tooling experiences for Visual Studio and Azure portal and an understanding of Service Fabric service context and remoting in the AI dashboard and AppMap, leading to a comprehensive out-of-the-box logging experience. Though many logs are automatically created and collected for you when using AI, we recommend that you add further custom logging to your applications, and have that show up in AI alongside what is provided to create a richer diagnostics experience for handling issues in the future. See more about using AI with Service Fabric at [Event analysis with Application Insights](service-fabric-diagnostics-event-analysis-appinsights.md). 

To get started with instrumenting your code to monitor your applications, head over to [Application level event and log generation](service-fabric-diagnostics-event-generation-app.md). 

#### Monitoring application availability
It is possible that everything in your cluster seems to be running as expected and is reporting as healthy, but your applications seem unaccessible or unreachable. Though there are not many cases in which this would happen, it is important to know when this happens to be able to mitigate it as soon as possible. Availability monitoring is broadly concerned with tracking the availability of your system's components to understand the overall "uptime" of the system. In a cluster, we focus on availability from the perspective of your application - the platform does a lot of work to ensure that application lifecycle management scenarios do not cause downtime. Nonetheless, various issues in the cluster can result in impacting your application's uptime, and in these cases, as an application owner, you typically want to know right away. We recommend that alongside all your other applications, you deploy a watchdog in your cluster. The purpose of such a watchdog would be to check the appropriate endpoints for your application at a set time interval, and report back that they are accessible. You can also do this by using an external service that pings the endpoint and returns a report at the given time interval ()

#### Watchdogs
Generally, a watchdog is a separate service that can watch health and load across services, ping endpoints, and report health for anything in the cluster. This can help prevent errors that would not be detected based on the view of a single service. Watchdogs are also a good place to host code that performs remedial actions without user interaction (for example, cleaning up log files in storage at certain time intervals). You can find a sample watchdog service implementation [here](https://github.com/Azure-Samples/service-fabric-watchdog-service).


### Health monitoring
The Service Fabric platform includes a health model, which provides extensible health reporting for the status of entities in a cluster. Each node, application, service, partition, replica, or instance, has a continuously updatable health status. The health status can either be "OK", "Warning", or "Error". The health status is changed through health reports that are emitted for each entity, based on any issues in the cluster. The health status of your entities can be checked at any time in Service Fabric Explorer (SFX) as shown below, or can be queried via the platforms's Health API. You can also customize health reports and modify the health status of an entity by adding your own health reports or using the Health API. More details on the health model can be found at [Introduction to Service Fabric health monitoring](service-fabric-health-introduction.md).

![SFX health dashboard](media/service-fabric-diagnostics-overview/sfx-healthstatus.png)

Service Fabric automatically provides a large set of health reports for your applications and for the cluster that inform you if anything seems to be going wrong at the platform level. The data from these reports is also stored as events, which you can collect and store for alerting and querying in the future. This data helps you detect issues that may impact your application availability, so we recommend that you set up alerts for appropriate error states and failure scenarios. This can be achieved through OMS as well, as long as you have configured collecting these health events (see [Event aggregation with Azure Diagnostics](service-fabric-diagnostics-event-aggregation-wad#collect-health-and-load-events.md))

### Performance monitoring
Monitoring your underlying infrastructure is a key part of understanding the state of your cluster and your resource utilization. Measuring system performance depends on several factors, each of which is typically measured through a Key Performance Indicators (KPIs). Service Fabric relevant KPIs can be mapped to metrics that can be collected from the nodes in your cluster, as performance counters. These KPIs can help with:
* understanding resource utilization and load - for the purpose of scaling your cluster, or optimizing your service processes
* predicting infrastructure issues - many issues are preceded by sudden changes (drops) in performance, so you can use KPIs such as network I/O and CPU utilization, for predicting and diagnosing infrastructural issues

Service Fabric also provides a set of performance counters for the Reliable Services and Actors programming models. If you are using either of these models, these counters can provide KPIs that help ensure that your actors are spinning up and down correctly, or that your reliable service requests are being handled fast enough. The performance counters that we recommend you collect are listed in [Performance metrics](service-fabric-diagnostics-event-generation-perf.md). You should use the OMS agent to collect and view these KPIs. You can also use the Azure Diagnostics agent to do this, or any other similar agent that can be configured to collect specific performance counters. 

## Monitoring workflow 

The overall workflow of monitoring and diagnostics consists of three steps:

1. **Event generation**: this includes events (logs, traces, custom events) at the infrastructure, platform (cluster), and application / service level
2. **Event aggregation**: generated events need to be collected and aggregated before they can be displayed
3. **Analysis**: events need to be visualized and accessible in some format, to allow for analysis and display as needed

Multiple products are available that cover these three areas, and you are free to choose different technologies for each. It is important to make sure that the various pieces work together to deliver an end-to-end monitoring solution for your cluster.

## Event generation

The first step in the monitoring and diagnostics workflow is to set up creation and generation of event and log data. These events, logs, and performance counters are emitted on all three levels: the platform level (including the cluster, the machines, or Service Fabric actions), the application level (any instrumentation added to apps and services deployed to the cluster), and the infrastructure level (performance metrics from each node). Diagnostics data that is collected at each of these levels are customizable, though Service Fabric does enable some default instrumentation. 

Read more about [platform level events](service-fabric-diagnostics-event-generation-infra.md) and [application level events](service-fabric-diagnostics-event-generation-app.md) to understand what is provided and how to add further instrumentation.

After making a decision on the logging provider you would like to use, you need to make sure your logs are being aggregated and stored correctly.

## Event aggregation

For collecting the logs and events being generated by your applications and your cluster, we typically recommend using [Azure Diagnostics](service-fabric-diagnostics-event-aggregation-wad.md) (more similar to agent-based log collection) or [EventFlow](service-fabric-diagnostics-event-aggregation-eventflow.md) (in-process log collection).

Collecting application logs using Azure Diagnostics extension is a good option for Service Fabric services if the set of log sources and destinations does not change often and there is a straightforward mapping between the sources and their destinations. The reason for this is configuring Azure Diagnostics happens at the Resource Manager layer, so making significant changes to the configuration requires updating/redeploying the cluster. Additionally, it is best utilized in making sure your logs are being stored somewhere a little more permanent, from where they can be accessed by various analysis platforms. This means that it ends up being less efficient of a pipeline than going with an option like EventFlow.

Using [EventFlow](https://github.com/Azure/diagnostics-eventflow) allows you to have services send their logs directly to an analysis and visualization platform, and/or to storage. Other libraries (ILogger, Serilog, etc.) might be used for the same purpose, but EventFlow has the benefit of having been designed specifically for in-process log collection and to support Service Fabric services. This tends to have several potential advantages:

* Easy configuration and deployment
    * The configuration of diagnostic data collection is just part of the service configuration. It is easy to always keep it "in sync" with the rest of the application
    * Per-application or per-service configuration is easily achievable
    * Configuring data destinations through EventFlow is just a matter of adding the appropriate NuGet package and changing the *eventFlowConfig.json* file
* Flexibility
    * The application can send the data wherever it needs to go, as long as there is a client library that supports the targeted data storage system. New destinations can be added as desired
    * Complex capture, filtering, and data-aggregation rules can be implemented
* Access to internal application data and context
    * The diagnostic subsystem running inside the application/service process can easily augment the traces with contextual information

One thing to note is that these two options are not mutually exclusive and while it is possible to get a similar job done with using one or the other, it could also make sense for you to set up both. In most situations, combining an agent with in-process collection could lead to a more reliable monitoring workflow. The Azure Diagnostics extension (agent) could be your chosen path for platform level logs while you could use EventFlow (in-process collection) for your application level logs. Once you have figured out what works best for you, it is time to think about how you want your data to be displayed and analyzed.

## Event analysis

There are several great platforms that exist in the market when it comes to the analysis and visualization of monitoring and diagnostics data. The two that we recommend are [OMS](service-fabric-diagnostics-event-analysis-oms.md) and [Application Insights](service-fabric-diagnostics-event-analysis-appinsights.md) due to their integration with Service Fabric, but you should also look into the [Elastic Stack](https://www.elastic.co/products) (especially if you are considering running a cluster in an offline environment), [Splunk](https://www.splunk.com/), or any other platform of your preference.

The key points for any platform you choose should include how comfortable you are with the user interface and querying options, the ability to visualize data and create easily readable dashboards, and the additional tools they provide to enhance your monitoring, such as automated alerting.

<!-- In addition to the platform you choose, when you set up a Service Fabric cluster as an Azure resource, you also get access to Azure's out-of-the-box monitoring for machines, which can be useful for specific performance and metric monitoring.

### Azure Monitor

You can use [Azure Monitor](../monitoring-and-diagnostics/monitoring-overview.md) to monitor many of the Azure resources on which a Service Fabric cluster is built. A set of metrics for the [virtual machine scale set](../monitoring-and-diagnostics/monitoring-supported-metrics.md#microsoftcomputevirtualmachinescalesets) and individual [virtual machines](../monitoring-and-diagnostics/monitoring-supported-metrics.md#microsoftcomputevirtualmachinescalesetsvirtualmachines) is automatically collected and displayed in the Azure portal. To view the collected information, in the Azure portal, select the resource group that contains the Service Fabric cluster. Then, select the virtual machine scale set that you want to view. In the **Monitoring** section, select **Metrics** to view a graph of the values.

![Azure portal view of collected metric information](media/service-fabric-diagnostics-overview/azure-monitoring-metrics.png)

To customize the charts, follow the instructions in [Metrics in Microsoft Azure](../monitoring-and-diagnostics/insights-how-to-customize-monitoring.md). You also can create alerts based on these metrics, as described in [Create alerts in Azure Monitor for Azure services](../monitoring-and-diagnostics/insights-alerts-portal.md). You can send alerts to a notification service by using web hooks, as described in [Configure a web hook on an Azure metric alert](../monitoring-and-diagnostics/insights-webhooks-alerts.md). Azure Monitor supports only one subscription. If you need to monitor multiple subscriptions, or if you need additional features, [Log Analytics](https://azure.microsoft.com/documentation/services/log-analytics/), part of Microsoft Operations Management Suite, provides a holistic IT management solution both for on-premises and cloud-based infrastructure. You can route data from Azure Monitor directly to Log Analytics, so you can see metrics and logs for your entire environment in a single place. -->

## Next steps

