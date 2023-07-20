---
title: Monitor Kubernetes clusters using Azure services and cloud native tools
description: Describes how to monitor the health and performance of the different layers of your Kubernetes environment using Azure Monitor and cloud native services in Azure.
ms.service:  azure-monitor
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 07/07/2023
---

# Monitor Kubernetes clusters using Azure services and cloud native tools

This set of articles describes how to monitor the health and performance of your Kubernetes clusters and the workloads running on them using Azure Monitor and related Azure and cloud native services. This includes clusters running in Azure Kubernetes Service (AKS) or other clouds such as [AWS](https://aws.amazon.com/kubernetes/) and [GCP](https://cloud.google.com/kubernetes-engine). Different sets of guidance are provided for the different roles that typically manage different aspects of a Kubernetes environment. 


> [!IMPORTANT]
> These articles provides complete guidance on monitoring the different layers of your Kubernetes environment based on Azure Kubernetes Service (AKS) or Kubernetes clusters in other clouds using services in Azure. If you're just getting started with AKS, see [Monitoring AKS](../../aks/monitor-aks.md) for basic information for getting started monitoring an AKS cluster.

## Layers and roles of Kubernetes environment

Following is an illustration of a common bottoms-up model of a typical Kubernetes environment, starting from infrastructure up through applications. Each layer has distinct monitoring requirements that are addressed by different Azure services and managed by different roles in the organization.

:::image type="content" source="media/monitor-containers/layers-with-roles.png" alt-text="Diagram of layers of Kubernetes environment with related administrative roles." lightbox="media/monitor-containers/layers-with-roles.png"  border="false":::

Responsibility for the [different layers of a a Kubernetes environment and the applications that depend on it](monitor-kubernetes-analyze.md) are typically shared by multiple roles. Depending on the size of your organization, these roles may be performed by different people or even different teams. The following table describes the different roles while the sections below provide different monitoring scenarios that each will typically encounter.

| Roles | Description |
|:---|:---|
| [Cluster administrator](#cluster-administrator) | Responsible for kubernetes cluster. Provisions and maintains platform used by developer. |
| [Developer](#developer) | Develop and maintain the application running on the cluster. Responsible for application specific traffic including application performance and failures. Maintains reliability of the application according to SLAs. |
| [Network engineer](#network-engineer) | Responsible for traffic between workloads and any ingress/egress with the cluster. Analyzes network traffic and performs threat analysis. |

## Azure services

Azure provides a complete set of services for monitoring the different layers of your Kubernetes infrastructure and the applications that depend on it. These services work in conjunction with each other to provide a complete monitoring solution, or you may integrate them with your existing monitoring tools. 


## Cluster administrator
See [Monitor Kubernetes environment - cluster administrator](monitor-kubernetes-cluster-administrator.md) for services, configuration, and common monitoring scenarios for the cluster administrator.

## Network engineer
The Network Engineer is responsible for traffic between workloads and any ingress/egress with the cluster. They analyze network traffic and perform threat analysis.

### Azure services

The following table lists the services that are commonly used by the network engineer to monitor the health and performance of the Kubernetes cluster and its components.  


| Service | Description |
|:---|:---|
| [Network Watcher](../../network-watcher/network-watcher-monitoring-overview.md) | Suite of tools in Azure to monitor the virtual networks used by your Kubernetes clusters and diagnose detected issues. |
| [Network insights](../../network-watcher/network-insights-overview.md) | Feature of Azure Monitor that includes a visual representation of the performance and health of different network components and provides access to the network monitoring tools that are part of Network Watcher. |

### Configure network monitoring

[Network insights](../../network-watcher/network-insights-overview.md) is enabled by default and requires no configuration. Network Watcher is also typically [enabled by default in each Azure region](../../network-watcher/network-watcher-create.md). 

Create [flow logs](../../network-watcher/network-watcher-nsg-flow-logging-overview.md) to log information about the IP traffic flowing through network security groups used by your cluster and then use [traffic analytics](../../network-watcher/traffic-analytics.md) to analyze and provide insights on this data. You'll most likely use the same Log Analytics workspace for traffic analytics that you use for Container insights and your control plane logs.

### Common network monitoring scenarios
This section provides solutions to a variety of common scenarios that may be encountered by the network engineer using the configuration described above.

**How can I detect any data exfiltration for my cluster?**

 - Use traffic analytics to determine if any traffic is flowing to either to or from any unexpected ports used by the cluster.

**How can I detect if any unnecessary public IPs are exposed?**

- Use traffic analytics to identify traffic flowing over public IPs. Provide this information to security engineers to ensure that no unnecessary public IPs are exposed.

**How can I verify that my network rules are configured correctly?**
- Follow the previous guidance for detecting any unexpected activity and then analyze your network rules to determine why such traffic is allowed.

## Developer

The following table lists the services that are commonly used by the network engineer to monitor the health and performance of the Kubernetes cluster and its components.  

| Service | Description |
|:---|:---|
| [Application insights](../app/app-insights-overview.md) |  Feature of Azure Monitor that provides application performance monitoring (APM) to monitor applications running on your Kubernetes cluster from development, through test, and into production. Quickly identify and mitigate latency and reliability issues using distributed traces. Supports [OpenTelemetry](../app/opentelemetry-overview.md#opentelemetry) for vendor-neutral instrumentation. |

### Enable Application insights to monitor your application

See [Data Collection Basics of Azure Monitor Application Insights](../app/opentelemetry-overview.md) for options on configuring data collection from the application running ion your cluster and decision criteria on the best method for your particular requirements. Once you have your application instrumented, create an [Availability test](../app/availability-overview.md) to create a recurring test to monitor its availability and responsiveness.


### Common application monitoring scenarios

**How do I get started with Application insights?**

- See [Data Collection Basics of Azure Monitor Application Insights](../app/opentelemetry-overview.md) for options on configuring data collection from your application and decision criteria on the best method for your particular requirements.

**Where are my application logs stored?**

- Container insights sends stdout/stderr logs to a Log Analytics workspace. See [Resource logs](../../aks/monitor-aks-reference.md#resource-logs) for a description of the different logs and [Kubernetes Services](https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/tables-resourcetype#kubernetes-services) for a list of the tables each is sent to.
- App insights for additional logging including iLogger.

**How do I identify poor performing apis or database queries?**

- Use [Profiler](../profiler/profiler-overview.md) to capture and view performance traces for your application.

**How do I identify my application bottleneck?**

- Use [Application Map](../app/app-map.md) to view the dependencies between your application components and identify any bottlenecks.
- Use [Profiler](../profiler/profiler-overview.md) to capture and view performance traces for your application.
- Use the **Performance** view in Application insights to view the performance of different operations in your application.

**How do I determine if my application is meeting its service-level agreement (SLA)?**

- Use the [SLA report](../app/sla-report.md) to calculate and report SLA for web tests.
- Use [annotations](../app/annotations.md) to identify when a new build is deployed so that you can visually inspect any change in performance after the update.

**How do I determine if my application is generating errors?**

- See the **Failures** tab of Application insights to view the number of failed requests and the most common exceptions.
- Ensure that alerts for [failure anomalies](../alerts/proactive-failure-diagnostics.md) identified with [smart detection](../alerts/proactive-diagnostics.md) are configured properly.


**How can I to gain better observability into the interaction between services?**

- Enable [distributed tracing](../app/distributed-tracing-telemetry-correlation.md), which provides a performance profiler that works like call stacks for cloud and microservices architectures.

**How should I set up health monitoring for my application?**

- Create an [Availability test](../app/availability-overview.md) in Application insights to create a recurring test to monitor the availability and responsiveness of your application.
- 
## See also

- See [Monitoring AKS](../../aks/monitor-aks.md) for guidance on monitoring specific to Azure Kubernetes Service (AKS).

