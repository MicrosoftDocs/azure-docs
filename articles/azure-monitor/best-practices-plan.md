---
title: Plan your Azure Monitor implementation
description: Guidance and recommendations for planning and design before deploying Azure Monitor.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 02/11/2024
ms.reviewer: bwren
---

# Plan your Azure Monitor implementation
This article describes the things that you should consider before starting your implementation. Proper planning helps you choose the configuration options to meet your business requirements.

To start learning about high-level monitoring concepts and guidance about defining requirements for your monitoring environment, see the [Cloud monitoring guide](/azure/cloud-adoption-framework/manage/monitor), which is part of the [Microsoft Cloud Adoption Framework for Azure](/azure/cloud-adoption-framework/). 


## Define a strategy
First, [formulate a monitoring strategy](/azure/cloud-adoption-framework/strategy/monitoring-strategy) to clarify the goals and requirements of your plan. The strategy defines your particular requirements, the configuration that best meets those requirements, and processes to use the monitoring environment to maximize your applications' performance and reliability.

See [Monitoring strategy for cloud deployment models](/azure/cloud-adoption-framework/manage/monitor/cloud-models-monitor-overview), which assist in comparing completely cloud based monitoring with a hybrid model. 

## Gather required information
Before you determine the details of your implementation, gather this information:

 ### What needs to be monitored?
Focus on your critical applications and the components they depend on to reduce monitoring and the complexity of your monitoring environment. See [Cloud monitoring guide: Collect the right data](/azure/cloud-adoption-framework/manage/monitor/data-collection) for guidance on defining the data that you require.

### Who needs to have access and who needs be notified?
Determine which users need access to monitoring data and which users need to be notified when an issue is detected. These may be application and resource owners, or you may have a centralized monitoring team. This information determines how you configure permissions for data access and notifications for alerts. You may also decide to configure custom workbooks to present particular sets of information to different users.

### Consider service level agreement (SLA) requirements
Your organization may have SLAs that define your commitments for performance and uptime of your applications. Take these SLAs into consideration when configuring time sensitive features of Azure Monitor such as alerts. Learn about [data latency in Azure Monitor](logs/data-ingestion-time.md) which affects the responsiveness of monitoring scenarios and your ability to meet SLAs.

## Identify supporting monitoring services and products
Azure Monitor is designed to address health and status monitoring. A complete monitoring solution usually involves multiple Azure services and may include other products to achieve other [monitoring objectives](/azure/cloud-adoption-framework/strategy/monitoring-strategy#formulate-monitoring-requirements). 

Consider using these other products and services along with Azure Monitor:

### Security monitoring solutions
While the operational data stored in Azure Monitor might be useful for investigating security incidents, other services in Azure were designed to monitor security. Security monitoring in Azure is performed by Microsoft Defender for Cloud and Microsoft Sentinel.

|Security monitoring solution  |Description  |
|---------|---------|
|[Microsoft Defender for Cloud](../security-center/security-center-introduction.md)     |Collects information about Azure resources and hybrid servers. Although it can collect security events, Defender for Cloud focuses on collecting inventory data, assessment scan results, and policy audits to highlight vulnerabilities and recommend corrective actions. Noteworthy features include an interactive network map, just-in-time VM access, adaptive network hardening, and adaptive application controls to block suspicious executables.         |
|[Microsoft Defender for servers](../security-center/azure-defender.md)     |The server assessment solution provided by Defender for Cloud. Defender for servers can send Windows Security Events to Log Analytics. Defender for Cloud doesn't rely on Windows Security Events for alerting or analysis. Using this feature allows centralized archival of events for investigation or other purposes.        |
|[Microsoft Sentinel](../sentinel/overview.md)     |A security information event management (SIEM) and security orchestration automated response (SOAR) solution. Sentinel collects security data from a wide range of Microsoft and third-party sources to provide alerting, visualization, and automation. This solution focuses on consolidating as many security logs as possible, including Windows Security Events. Microsoft Sentinel can also collect Windows Security Event Logs and commonly shares a Log Analytics workspace with Defender for Cloud. Security events can only be collected from Microsoft Sentinel or Defender for Cloud when they share the same workspace. Unlike Defender for Cloud, security events are a key component of alerting and analysis in Microsoft Sentinel.         |
|[Defender for Endpoint](/microsoft-365/security/defender-endpoint/microsoft-defender-endpoint)     |An enterprise endpoint security platform designed to help enterprise networks prevent, detect, investigate, and respond to advanced threats. It was designed with a primary focus on protecting Windows user devices. Defender for Endpoint monitors workstations, servers, tablets, and cellphones with various operating systems for security issues and vulnerabilities. Defender for Endpoint is closely aligned with Microsoft Intune to collect data and provide security assessments. Data collection is primarily based on ETW trace logs and is stored in an isolated workspace.         |

### System Center Operations Manager
If you have an existing investment in System Center Operations Manager for monitoring on-premises resources and workloads running on your virtual machines, you may choose to [migrate this monitoring to Azure Monitor](azure-monitor-operations-manager.md) or continue to use both products together in a hybrid configuration. 

See [Cloud monitoring guide: Monitoring platforms overview](/azure/cloud-adoption-framework/manage/monitor/platform-overview) for a comparison of products. See [Monitoring strategy for cloud deployment models](/azure/cloud-adoption-framework/manage/monitor/cloud-models-monitor-overview) for how to use the two products in a hybrid configuration and determine the most appropriate model for your environment.


## Next steps

- See [Configure data collection](best-practices-data-collection.md) for steps and recommendations to configure data collection in Azure Monitor.
