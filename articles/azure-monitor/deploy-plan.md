---
title: Deploy Azure Monitor
description: Describes the different steps required for a complete implementation of Azure Monitor to monitor all of the resources in your Azure subscription.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 07/27/2020

---

# Deploy Azure Monitor - Planning
Before implementing Azure Monitor, you should determine the configuration that will best support your monitoring requirements. This article defines planning that you should consider before starting your implementation. This ensures that the configuration options you choose meet your particular requirements.

If you're not already familiar with monitoring concepts, start with the [Cloud monitoring guide](/azure/cloud-adoption-framework/manage/monitor/) which is part of the [Microsoft Cloud Adoption Framework for Azure](/cloud-adoption-framework/). This guide defines high level concepts of monitoring and provides guidance for defining your monitoring environment and supporting processes.
## Understand Azure Monitor costs
A core goal of your monitoring strategy will be minimizing costs. Some data collection and features in Azure Monitor have no cost while other have costs based on their particular configuration, amount of data collected, or frequency that they're run. This guide will identify any recommendations that include a cost, but you should be familiar with Azure Monitor pricing as you design your implementation for cost optimization. See [Azure Monitor pricing](https://azure.microsoft.com/pricing/details/monitor/) for a list of of all Azure Monitor costs. 

## Define strategy
Before you design and implement any monitoring solution, you should have a monitoring strategy so that you understand the goals and requirements of your plan. The configuration options that you choose for Azure Monitor should be consistent with that strategy. The strategy defines your particular requirements, the configuration that best meets those requirements, and processes to leverage the monitoring environment to maximize your applications' performance and reliability.

See [Cloud monitoring guide: Formulate a monitoring strategy](/azure/cloud-adoption-framework/strategy/monitoring-strategy) for a number of factors that you should consider when developing a monitoring strategy. You should also refer to [Monitoring strategy for cloud deployment models](/azure/cloud-adoption-framework/manage/monitor/cloud-models-monitor-overview) which will assist in comparing completely cloud based monitoring with a hybrid model. 

## Gather required information
Before you determine the details of your implementation, you should gather the information required to define those details.

 ### What needs to be monitored?
 You won't necessarily configure complete monitoring for all of your cloud resources but instead focus on those applications and components they depend on. This will not only reduce your monitoring costs but also reduce the complexity of your monitoring environment. See [Cloud monitoring guide: Collect the right data](/azure/cloud-adoption-framework/manage/monitor/data-collection) for guidance on defining the data that you require.

### Who needs to have access and be notified
As you configure your monitoring environment, you need to determine which users should have access to monitoring data and which users need to be notified when an issue is detected. These may be application and resource owners, or you may have a centralized monitoring team. This information will determine how you configure permissions for data access and notifications for alerts. You may also require custom workbooks to present particular sets of information to different users.

### Service level agreements 
Your organization may have SLAs that define your commitments for performance and uptime of your applications. These SLAs may determine how you need to configure time sensitive features of Azure Monitor such as alerts. You will also need to understand [data latency in Azure Monitor](logs/data-ingestion-time.md) since this will affect the responsiveness of monitoring scenarios and your ability to meet SLAs.

## Identify monitoring services and products
Azure Monitor is the preferred solution for monitoring Azure and hybrid cloud resources, but a complete solution will typically involve multiple Azure services and potentially other products. 


### Security monitoring
The [Cloud Monitoring Guide](/azure/cloud-adoption-framework/manage/monitor/) defines the [primary monitoring objectives](/azure/cloud-adoption-framework/strategy/monitoring-strategy#formulate-monitoring-requirements) you should focus on for your Azure resources. Azure Monitor is designed to address Health and Status monitoring. Security monitoring in Azure is performed by Azure Security Center and Azure Sentinel. These services each have additional cost, so you should determine their value in your environment before you implement them.

- [Azure Security Center](../../security-center/security-center-introduction.md) collects information about Azure resources and hybrid servers. Although Security Center can collect security events, Security Center focuses on collecting inventory data, assessment scan results, and policy audits to highlight vulnerabilities and recommend corrective actions. Noteworthy features include an interactive network map, just-in-time VM access, adaptive network hardening, and adaptive application controls to block suspicious executables.

- [Azure Defender for Servers](../../security-center/azure-defender.md) is the server assessment solution provided by Security Center. Defender for Servers can send Windows Security Events to Log Analytics. Security Center doesn't rely on Windows Security Events for alerting or analysis. Using this feature allows centralized archival of events for investigation or other purposes.

- [Azure Sentinel](../../sentinel/overview.md) is a security information event management (SIEM) and security orchestration automated response (SOAR) solution. Sentinel collects security data from a wide range of Microsoft and third-party sources to provide alerting, visualization, and automation. This solution focuses on consolidating as many security logs as possible, including Windows Security Events. Azure Sentinel can also collect Windows Security Event Logs and commonly shares a Log Analytics workspace with Security Center. Security events can only be collected from Azure Sentinel or Security Center when they share the same workspace. Unlike Security Center, security events are a key component of alerting and analysis in Azure Sentinel.

- [Defender for Endpoint](/microsoft-365/security/defender-endpoint/microsoft-defender-endpoint) is an enterprise endpoint security platform designed to help enterprise networks prevent, detect, investigate, and respond to advanced threats. It was designed with a primary focus on protecting Windows user devices. Defender for Endpoint monitors workstations, servers, tablets, and cellphones with various operating systems for security issues and vulnerabilities. Defender for Endpoint is closely aligned with Microsoft Endpoint Manager to collect data and provide security assessments. Data collection is primarily based on ETW trace logs and is stored in an isolated workspace.


### System Center Operations Manager
You many have an existing investment in System Center Operations Manager for monitoring on-premises resources and workloads running on your virtual machines. You may choose to [migrate this monitoring to Azure Monitor](azure-monitor-operations-manager.md) or continue to use both products together in a hybrid configuration. See  [Cloud monitoring guide: Monitoring platforms overview](/azure/cloud-adoption-framework/manage/monitor/platform-overview) for a comparison of the two products. See [Monitoring strategy for cloud deployment models](/azure/cloud-adoption-framework/manage/monitor/cloud-models-monitor-overview) for guidance on using the two in a hybrid configuration and on determining the most appropriate model for you environment.



## Evaluate need for Custom Instrumentation & Data Collection
Understand out-of-the-box & on-by-default data collection already available for Azure Resources
Configure Agents & Diagnostic Settings for additional logs/perf counters as needed 
Consider collecting and integrating additional AKS workload metrics from Prometheus
Consider manually instrumenting apps with custom telemetry to gain valuable logs, distributed tracing & usage insights

## Design decisions
Following are design decisions that you should consider as you start planning your Azure Monitor implementation.
### Log Analytics workspace
You require at least one Log Analytics workspace to enable [Azure Monitor Logs](logs/data-platform-logs.md), which is required for collecting such data as logs from Azure resources, collecting data from the guest operating system of Azure virtual machines, and for most Azure Monitor insights. 

Other services such as Azure Sentinel and Azure Security Center also use a Log Analytics workspace and can share the same one that you use for Azure Monitor. You can start with a single workspace to support this monitoring, but see  [Designing your Azure Monitor Logs deployment](logs/design-logs-deployment.md) for guidance on when to use multiple workspaces. Depending on your particular requirements, you might choose to share a common workspace or separate your availability and performance data from your security data. For complete details on logic that you should consider for designing a workspace configuration, see [Designing your Azure Monitor Logs deployment](../logs/design-logs-deployment.md).

There is no cost for creating a Log Analytics workspace, but there is a potential charge once you configure data to be collected into it. See [Manage usage and costs with Azure Monitor Logs](logs/manage-cost-storage.md) for details.  

See [Create a Log Analytics workspace in the Azure portal](logs/quick-create-workspace.md) to create an initial Log Analytics workspace. See [Manage access to log data and workspaces in Azure Monitor](logs/manage-access.md) to configure access. 


### Separate or single Application Insights Resource 
Application Insights is the feature of Azure Monitor for monitoring your cloud native and hybrid applications. A fundamental design decision is whether to use separate or single application resource for multiple applications. Separate resources can save costs and prevent mixing data from different applications, but a single resource can simplify your monitoring by keeping all relevant telemetry together. See [How many Application Insights resources should I deploy](app/separate-resources.md) for detailed criteria on making this design decision.


## Next steps

- See [Configure data collection](deploy-data-collection.md) for steps and recommendations to configure data collection in Azure Monitor.