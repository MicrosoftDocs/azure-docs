---
title: 'Monitor virtual machines with Azure Monitor: Security'
description: Learn about services for monitoring security of virtual machines and how they relate to Azure Monitor. 
ms.service: azure-monitor
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 06/21/2021

---

# Monitor virtual machines with Azure Monitor: Security monitoring
This article is part of the scenario [Monitor virtual machines and their workloads in Azure Monitor](monitor-virtual-machine.md). It describes the Azure services for monitoring security for your virtual machines and how they relate to Azure Monitor. Azure Monitor was designed to monitor the availability and performance of your virtual machines and other cloud resources. While the operational data stored in Azure Monitor might be useful for investigating security incidents, other services in Azure were designed to monitor security. 

> [!IMPORTANT]
> The security services have their own cost independent of Azure Monitor. Before you configure these services, refer to their pricing information to determine your appropriate investment in their usage.

## Azure services for security monitoring
Azure Monitor focuses on operational data like Activity logs, Metrics, and Log Analytics supported sources, including Windows Events (excluding security events), performance counters, logs, and Syslog. Security monitoring in Azure is performed by Azure Security Center and Azure Sentinel. These services each have additional cost, so you should determine their value in your environment before you implement them.

[Azure Security Center](../../security-center/security-center-introduction.md) collects information about Azure resources and hybrid servers. Although Security Center can collect security events, Security Center focuses on collecting inventory data, assessment scan results, and policy audits to highlight vulnerabilities and recommend corrective actions. Noteworthy features include an interactive network map, just-in-time VM access, adaptive network hardening, and adaptive application controls to block suspicious executables.

[Azure Defender for Servers](../../security-center/azure-defender.md) is the server assessment solution provided by Security Center. Defender for Servers can send Windows Security Events to Log Analytics. Security Center doesn't rely on Windows Security Events for alerting or analysis. Using this feature allows centralized archival of events for investigation or other purposes.

[Azure Sentinel](../../sentinel/overview.md) is a security information event management (SIEM) and security orchestration automated response (SOAR) solution. Sentinel collects security data from a wide range of Microsoft and third-party sources to provide alerting, visualization, and automation. This solution focuses on consolidating as many security logs as possible, including Windows Security Events. Azure Sentinel can also collect Windows Security Event Logs and commonly shares a Log Analytics workspace with Security Center. Security events can only be collected from Azure Sentinel or Security Center when they share the same workspace. Unlike Security Center, security events are a key component of alerting and analysis in Azure Sentinel.

[Defender for Endpoint](/microsoft-365/security/defender-endpoint/microsoft-defender-endpoint) is an enterprise endpoint security platform designed to help enterprise networks prevent, detect, investigate, and respond to advanced threats. It was designed with a primary focus on protecting Windows user devices. Defender for Endpoint monitors workstations, servers, tablets, and cellphones with various operating systems for security issues and vulnerabilities. Defender for Endpoint is closely aligned with Microsoft Endpoint Manager to collect data and provide security assessments. Data collection is primarily based on ETW trace logs and is stored in an isolated workspace.

## Integration with Azure Monitor
The following table lists the integration points for Azure Monitor with the security services. All the services use the same Log Analytics agent, which reduces complexity because there are no other components being deployed to your virtual machines. Security Center and Azure Sentinel store their data in a Log Analytics workspace so that you can use log queries to correlate data collected by the different services. Or you can create a custom workbook that combines security data and availability and performance data in a single view.

| Integration point       | Azure Monitor | Azure Security Center | Azure Sentinel | Defender for Endpoint |
|:---|:---|:---|:---|:---|
| Collects security events     |   | X | X | X |
| Stores data in Log Analytics workspace | X | X | X |   | 
| Uses Log Analytics agent     | X | X | X | X | 


## Workspace design considerations
As described in [Monitor virtual machines with Azure Monitor: Configure monitoring](monitor-virtual-machine-configure.md#create-and-prepare-a-log-analytics-workspace), Azure Monitor and the security services require a Log Analytics workspace. Depending on your particular requirements, you might choose to share a common workspace or separate your availability and performance data from your security data. For complete details on logic that you should consider for designing a workspace configuration, see [Designing your Azure Monitor Logs deployment](../logs/design-logs-deployment.md).

## Agent deployment
You can configure Security Center to automatically deploy the Log Analytics agent to Azure virtual machines. While this might seem redundant with Azure Monitor deploying the same agent, you'll most likely want to enable both because they'll each perform their own configuration. For example, if Security Center attempts to provision a machine that's already being monitored by Azure Monitor, it will use the agent that's already installed and add the configuration for the Security Center workspace.

## Next steps

* [Analyze monitoring data collected for virtual machines](monitor-virtual-machine-analyze.md)
* [Create alerts from collected data](monitor-virtual-machine-alerts.md)
