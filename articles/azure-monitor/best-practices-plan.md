---
title: Azure Monitor best practices - Planning
description: Guidance and recommendations for planning and design before deploying Azure Monitor.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 05/31/2023
ms.reviewer: bwren
---

# Azure Monitor best practices - Planning your monitoring strategy and configuration
This article is part of the scenario [Recommendations for configuring Azure Monitor](best-practices.md). It describes planning that you should consider before starting your implementation. This ensures that the configuration options you choose meet your particular business requirements.

If you're not already familiar with monitoring concepts, start with the [Cloud monitoring guide](/azure/cloud-adoption-framework/manage/monitor) which is part of the [Microsoft Cloud Adoption Framework for Azure](/azure/cloud-adoption-framework/). That guide defines high-level concepts of monitoring and provides guidance for defining requirements for your monitoring environment and supporting processes. This article will refer to sections of that guide that are relevant to particular planning steps.
## Understand Azure Monitor costs
A core goal of your monitoring strategy will be minimizing costs. Some data collection and features in Azure Monitor have no cost while other have costs based on their particular configuration, amount of data collected, or frequency that they're run. The articles in this scenario will identify any recommendations that include a cost, but you should be familiar with Azure Monitor pricing as you design your implementation for cost optimization. See the following for details and guidance on Azure Monitor pricing:

- [Azure Monitor pricing](https://azure.microsoft.com/pricing/details/monitor/)
- [Monitor usage and estimated costs in Azure Monitor](usage-estimated-costs.md)


## Define strategy
Before you design and implement any monitoring solution, you should establish a monitoring strategy so that you understand the goals and requirements of your plan. The strategy defines your particular requirements, the configuration that best meets those requirements, and processes to leverage the monitoring environment to maximize your applications' performance and reliability. The configuration options that you choose for Azure Monitor should be consistent with your strategy.

See [Cloud monitoring guide: Formulate a monitoring strategy](/azure/cloud-adoption-framework/strategy/monitoring-strategy) for a number of factors that you should consider when developing a monitoring strategy. You should also refer to [Monitoring strategy for cloud deployment models](/azure/cloud-adoption-framework/manage/monitor/cloud-models-monitor-overview) which will assist in comparing completely cloud based monitoring with a hybrid model. 

## Gather required information
Before you determine the details of your implementation, you should gather information required to define those details. The following sections described information typically required for a complete implementation of Azure Monitor.

 ### What needs to be monitored?
 You won't necessarily configure complete monitoring for all of your cloud resources but instead focus on your critical applications and the components they depend on. This will not only reduce your monitoring costs but also reduce the complexity of your monitoring environment. See [Cloud monitoring guide: Collect the right data](/azure/cloud-adoption-framework/manage/monitor/data-collection) for guidance on defining the data that you require.

### Who needs to have access and be notified
As you configure your monitoring environment, you need to determine which users should have access to monitoring data and which users need to be notified when an issue is detected. These may be application and resource owners, or you may have a centralized monitoring team. This information will determine how you configure permissions for data access and notifications for alerts. You may also require custom workbooks to present particular sets of information to different users.

### Service level agreements 
Your organization may have SLAs that define your commitments for performance and uptime of your applications. These SLAs may determine how you need to configure time sensitive features of Azure Monitor such as alerts. You will also need to understand [data latency in Azure Monitor](logs/data-ingestion-time.md) since this will affect the responsiveness of monitoring scenarios and your ability to meet SLAs.

## Identify monitoring services and products
Azure Monitor is designed to address Health and Status monitoring. A complete monitoring solution will typically involve multiple Azure services and potentially other products. Other monitoring objectives, which may require additional solutions, are described in the Cloud Monitoring Guide in [primary monitoring objectives](/azure/cloud-adoption-framework/strategy/monitoring-strategy#formulate-monitoring-requirements). 

The following sections describe other services and products that you may use in conjunction with Azure Monitor. This scenario currently doesn't include guidance on implementing these solutions so you should refer to their documentation.

### Security monitoring
While the operational data stored in Azure Monitor might be useful for investigating security incidents, other services in Azure were designed to monitor security. Security monitoring in Azure is performed by Microsoft Defender for Cloud and Microsoft Sentinel.

- [Microsoft Defender for Cloud](../security-center/security-center-introduction.md) collects information about Azure resources and hybrid servers. Although it can collect security events, Defender for Cloud focuses on collecting inventory data, assessment scan results, and policy audits to highlight vulnerabilities and recommend corrective actions. Noteworthy features include an interactive network map, just-in-time VM access, adaptive network hardening, and adaptive application controls to block suspicious executables.

- [Microsoft Defender for servers](../security-center/azure-defender.md) is the server assessment solution provided by Defender for Cloud. Defender for servers can send Windows Security Events to Log Analytics. Defender for Cloud doesn't rely on Windows Security Events for alerting or analysis. Using this feature allows centralized archival of events for investigation or other purposes.

- [Microsoft Sentinel](../sentinel/overview.md) is a security information event management (SIEM) and security orchestration automated response (SOAR) solution. Sentinel collects security data from a wide range of Microsoft and third-party sources to provide alerting, visualization, and automation. This solution focuses on consolidating as many security logs as possible, including Windows Security Events. Microsoft Sentinel can also collect Windows Security Event Logs and commonly shares a Log Analytics workspace with Defender for Cloud. Security events can only be collected from Microsoft Sentinel or Defender for Cloud when they share the same workspace. Unlike Defender for Cloud, security events are a key component of alerting and analysis in Microsoft Sentinel.

- [Defender for Endpoint](/microsoft-365/security/defender-endpoint/microsoft-defender-endpoint) is an enterprise endpoint security platform designed to help enterprise networks prevent, detect, investigate, and respond to advanced threats. It was designed with a primary focus on protecting Windows user devices. Defender for Endpoint monitors workstations, servers, tablets, and cellphones with various operating systems for security issues and vulnerabilities. Defender for Endpoint is closely aligned with Microsoft Intune to collect data and provide security assessments. Data collection is primarily based on ETW trace logs and is stored in an isolated workspace.


### System Center Operations Manager
You may have an existing investment in System Center Operations Manager for monitoring on-premises resources and workloads running on your virtual machines. You may choose to [migrate this monitoring to Azure Monitor](azure-monitor-operations-manager.md) or continue to use both products together in a hybrid configuration. See  [Cloud monitoring guide: Monitoring platforms overview](/azure/cloud-adoption-framework/manage/monitor/platform-overview) for a comparison of the two products. See [Monitoring strategy for cloud deployment models](/azure/cloud-adoption-framework/manage/monitor/cloud-models-monitor-overview) for guidance on using the two in a hybrid configuration and on determining the most appropriate model for your environment.



## Next steps

- See [Configure data collection](best-practices-data-collection.md) for steps and recommendations to configure data collection in Azure Monitor.
