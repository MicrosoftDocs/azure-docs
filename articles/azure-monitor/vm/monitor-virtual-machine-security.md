---
title: Monitor virtual machines with Azure Monitor - Security
description: Describes how to collect and analyze monitoring data from virtual machines in Azure using Azure Monitor.
ms.service:  azure-monitor
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 05/26/2021

---

# Monitor virtual machines with Azure Monitor - Security monitoring
Azure Monitor was not designed for security monitoring. Though the operational data stored in Azure Monitor may be useful during security incident investigations. Security monitoring data collected from Windows and Linux servers may include event logs, log files, IIS logs, Linux facilities, Syslog, Event Tracing for Windows (ETW), and configuration sources like registry settings and WMI. Because security monitoring is required in addition to the availability and performance monitoring provided by Azure Monitor, this article provides a description of the services required to monitor the security of virtual machines and their relationship and integration with Azure Monitor.


## Azure services for security monitoring
Security monitoring in Azure is performed by Azure Security Center and Azure Sentinel. These services each have additional cost, so you should determine their value in your environment before implementing them. Azure Monitor focuses on operational data including Activity Logs, Metrics, and Log Analytics supported sources including Windows Events (excluding security events), performance counters, logs, and Syslog.

[Azure Security Center]() collects information about Azure resources and hybrid servers. This solution focuses on securing Azure resources and connected servers. Though capable of collecting security events, Azure Security Center focuses on collecting inventory data, assessment scan results, and policy audits to highlight vulnerabilities and recommend corrective actions. Noteworthy features include an interactive Network Map, Just-in-Time VM Access, Adaptive Network hardening, and Adaptive Application Controls to block suspicious executables.

[Defender for Servers]() is the server assessment solution provided by Azure Security Center. Defender for Servers can send Windows Security Events to Log Analytics. Azure Security Center does not rely on Windows Security Events for alerting or analysis. Using this feature allow centralized archival of events for investigation or other purposes. 

[Azure Sentinel]() is a security information event management (SIEM) and security orchestration automated response (SOAR) solution. Sentinel collects security data from a wide range of Microsoft and 3rd party sources to provide alerting, visualization, and automation. This solution focuses on consolidating as many security logs as possible (including Windows security events). Sentinel can also collect Windows Security Event Logs and commonly shares a Log Analytics workspace with Azure Security Center. Security events can only be collected from Sentinel or Azure Security Center when they share the same workspace. Unlike, Azure Security Center, security events are a key component of alerting and analysis in Azure Sentinel.

[Defender for Endpoint]() is an enterprise endpoint security platform designed to help enterprise networks prevent, detect, investigate, and respond to advanced threats. Designed with a primary focus on protecting Windows end-user devices. Defender for Endpoint monitors workstations, servers, tablets, and cellphones with a variety of operating systems for security issues and vulnerabilities. Defender for Endpoint is closely aligned with Microsoft Endpoint Manager to collect data and provide security assessments. Data collection is primarily based on ETW trace logs and is stored in an isolated workspace. Defender for Endpoint cannot share the same workspace as Azure Monitor, Azure Sentinel, or Azure Security Center. 


|                           | Azure Monitor | Azure Security Center | Azure Sentinel | Defender for Endpoint |
|:---|:---|:---|:---|:---|
| Security events         |   | X | X |   |
| Server monitoring       | X | X | X | X | 
| Log Analytics workspace | X | X | X |   | 
| Log Analytics agent     | X | X | X | X | 

## Integration with Azure Monitor

- Azure Security Center and Azure Sentinel store data in a Log Analytics workspace and use the same KQL language for log queries. Even if you choose to use a [different workspace for these services](), you can still use [cross resource queries]() to combine availability and performance data with security data in log queries or workbooks.
- Create log query alerts combining security data with availability and performance data.
- Azure Security Center and Azure Sentinel the same Log Analytics agent meaning that you can collect security data without deploying additional agents to the machine.


## Next steps

* [Analyze monitoring data collected for virtual machines.](monitor-virtual-machine-analyze.md)
* [Create alerts from collected data.](monitor-virtual-machine-alerts.md)
* [Monitor workloads running on virtual machines.](monitor-virtual-machine-workloads.md)