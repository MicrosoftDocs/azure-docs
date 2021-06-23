---
title: Monitor virtual machines with Azure Monitor - Security
description: Describes services for monitoring security of virtual machines and how they relate to Azure Monitor. 
ms.service:  azure-monitor
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 06/21/2021

---

# Monitor virtual machines with Azure Monitor - Security monitoring
This article is part of the [Monitoring virtual machines and their workloads in Azure Monitor scenario](monitor-virtual-machine.md). It describes the Azure services for monitoring security for your virtual machines and how they relate to Azure Monitor. Azure Monitor was designed to monitor the availability and performance of your virtual machines and other cloud resources. While the operational data stored in Azure Monitor may be useful for investigating security incidents, other services in Azure were designed to monitor security. 

> [!IMPORTANT]
> The security services have their own cost independent of Azure Monitor. Before configuring these services, refer to their pricing information to determine your appropriate investment in their usage.

## Azure services for security monitoring
Azure Monitor focuses on operational data including Activity Logs, Metrics, and Log Analytics supported sources including Windows Events (excluding security events), performance counters, logs, and Syslog. Security monitoring in Azure is performed by Azure Security Center and Azure Sentinel. These services each have additional cost, so you should determine their value in your environment before implementing them. 

[Azure Security Center](../../security-center/security-center-introduction.md) collects information about Azure resources and hybrid servers. Though capable of collecting security events, Azure Security Center focuses on collecting inventory data, assessment scan results, and policy audits to highlight vulnerabilities and recommend corrective actions. Noteworthy features include an interactive Network Map, Just-in-Time VM Access, Adaptive Network hardening, and Adaptive Application Controls to block suspicious executables.

[Defender for Servers](../../security-center/azure-defender.md) is the server assessment solution provided by Azure Security Center. Defender for Servers can send Windows Security Events to Log Analytics. Azure Security Center does not rely on Windows Security Events for alerting or analysis. Using this feature allow centralized archival of events for investigation or other purposes. 

[Azure Sentinel](../../sentinel/overview.md) is a security information event management (SIEM) and security orchestration automated response (SOAR) solution. Sentinel collects security data from a wide range of Microsoft and 3rd party sources to provide alerting, visualization, and automation. This solution focuses on consolidating as many security logs as possible, including Windows security events. Sentinel can also collect Windows Security Event Logs and commonly shares a Log Analytics workspace with Azure Security Center. Security events can only be collected from Sentinel or Azure Security Center when they share the same workspace. Unlike Azure Security Center, security events are a key component of alerting and analysis in Azure Sentinel.

[Defender for Endpoint](/microsoft-365/security/defender-endpoint/microsoft-defender-endpoint) is an enterprise endpoint security platform designed to help enterprise networks prevent, detect, investigate, and respond to advanced threats. Designed with a primary focus on protecting Windows end-user devices. Defender for Endpoint monitors workstations, servers, tablets, and cellphones with a variety of operating systems for security issues and vulnerabilities. Defender for Endpoint is closely aligned with Microsoft Endpoint Manager to collect data and provide security assessments. Data collection is primarily based on ETW trace logs and is stored in an isolated workspace.

## Integration with Azure Monitor
The following table lists the integration points for Azure Monitor with the security services. All the services use the same Log Analytics agent, which reduces complexity since there are no additional components being deployed to your virtual machines. Azure Security Center and Azure Sentinel store their data in a Log Analytics workspace so that you can use log queries to correlate data collected by the different services. Or create a custom workbook that combines security data and availability and performance data in a single view.

| Integration point       | Azure Monitor | Azure Security Center | Azure Sentinel | Defender for Endpoint |
|:---|:---|:---|:---|:---|
| Collects security events     |   | X | X | X |
| Stores data in Log Analytics workspace | X | X | X |   | 
| Uses Log Analytics agent     | X | X | X | X | 


## Workspace design considerations
As described in [Monitor virtual machines with Azure Monitor - Configure monitoring](monitor-virtual-machine-configure.md#create-and-prepare-log-analytics-workspace), Azure Monitor and the security services require a Log Analytics workspace. Depending on your particular requirements, you may choose to share a common workspace or separate your availability and performance data from your security data. See [Designing your Azure Monitor Logs deployment](../logs/design-logs-deployment.md) for complete details on logic that you should consider for designing a workspace configuration.
## Agent deployment
You can configure Azure Security Center to automatically deploy the Log Analytics agent to Azure virtual machines. While this may seem redundant with Azure Monitor deploying the same agent, you will most likely want to enable both since they'll each perform their own configuration. For example, if Azure Security Center attempts provision a machine that's already being monitored by Azure Monitor, it will use the agent that's already installed and add the configuration for the Azure Security Center workspace.


## Next steps

* [Analyze monitoring data collected for virtual machines.](monitor-virtual-machine-analyze.md)
* [Create alerts from collected data.](monitor-virtual-machine-alerts.md)
