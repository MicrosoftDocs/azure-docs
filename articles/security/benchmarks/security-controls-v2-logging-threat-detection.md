---
title: Azure Security Benchmark V2 - Logging and Threat Detection
description: Azure Security Benchmark V2 Logging and Threat Detection
author: msmbaldwin
ms.service: security
ms.topic: conceptual
ms.date: 09/20/2020
ms.author: mbaldwin
ms.custom: security-benchmark

---

# Security Control V2: Logging and Threat Detection

Logging and Threat Detection covers controls for detecting threats on Azure and enabling, collecting, and storing audit logs for Azure services. This includes enabling detection, investigation, and remediation processes with controls to generate high quality alerts with native threat detection in Azure services; it also includes collecting logs with Azure Monitor, centralizing security analysis with Azure Sentinel, time synchronization, and log retention. 

## LT-1: Enable threat detection for Azure resources

| Azure ID | CIS Controls v7.1 ID(s) | NIST SP800-53 r4 ID(s) |
|--|--|--|--|
| LT-1 | 6.7 | AU-3, AU-6, AU-12, SI-4 |

Ensure you are monitoring different types of Azure assets for potential threats and anomalies. Focus on getting high quality alerts to reduce false positives for analysts to sort through. Alerts can be sourced from log data, agents, or other data.

Use the Azure Security Center built-in threat detection capability, which is based on monitoring Azure service telemetry and analyzing service logs. Data is collected using the Log Analytics agent, which reads various security-related configurations and event logs from the system and copies the data to your workspace for analysis. 

In addition, use Azure Sentinel to build analytics rules, which hunt threats that match  specific criteria across your environment. The rules generate incidents when the criteria are matched, so that you can investigate each incident. Azure Sentinel can also import third party threat intelligence to enhance its threat detection capability. 

- [Threat protection in Azure Security Center](../../security-center/threat-protection.md)

- [Azure Security Center security alerts reference guide](../../security-center/alerts-reference.md)

- [Create custom analytics rules to detect threats](../../sentinel/tutorial-detect-threats-custom.md)

- [Cyber threat intelligence with Azure Sentinel](/azure/architecture/example-scenario/data/sentinel-threat-intelligence)

**Responsibility**: Customer

**Customer Security Stakeholders** ([Learn more](/azure/cloud-adoption-framework/organize/cloud-security#security-functions)):

- [Infrastructure and endpoint security](/azure/cloud-adoption-framework/organize/cloud-security-infrastructure-endpoint)

- [Security operations](/azure/cloud-adoption-framework/organize/cloud-security-operations-center)

- [Posture management](/azure/cloud-adoption-framework/organize/cloud-security-posture-management)   

- [Application Security and DevOps](/azure/cloud-adoption-framework/organize/cloud-security-application-security-devsecops) 

- [Threat intelligence](/azure/cloud-adoption-framework/organize/cloud-security-threat-intelligence)

## LT-2: Enable threat detection for Azure identity and access management

| Azure ID | CIS Controls v7.1 ID(s) | NIST SP800-53 r4 ID(s) |
|--|--|--|--|
| LT-2 | 6.8 | AU-3, AU-6, AU-12, SI-4 |

Azure AD provides the following user logs that can be viewed in Azure AD reporting or integrated with Azure Monitor, Azure Sentinel or other SIEM/monitoring tools for more sophisticated monitoring and analytics use cases: 
-	Sign-ins – The sign-ins report provides information about the usage of managed applications and user sign-in activities.

-	Audit logs - Provides traceability through logs for all changes done by various features within Azure AD. Examples of audit logs include changes made to any resources within Azure AD like adding or removing users, apps, groups, roles and policies.

-	Risky sign-ins - A risky sign-in is an indicator for a sign-in attempt that might have been performed by someone who is not the legitimate owner of a user account.

-	Users flagged for risk - A risky user is an indicator for a user account that might have been compromised.

Azure Security Center can also alert on certain suspicious activities such as an excessive number of failed authentication attempts, and deprecated accounts in the subscription. In addition to the basic security hygiene monitoring, Azure Security Center’s Threat Protection module can also collect more in-depth security alerts from individual Azure compute resources (such as virtual machines, containers, app service), data resources (such as SQL DB and storage), and Azure service layers. This capability allows you to see account anomalies inside the individual resources.

- [Audit activity reports in Azure AD](../../active-directory/reports-monitoring/concept-audit-logs.md)

- [Enable Azure Identity Protection](../../active-directory/identity-protection/overview-identity-protection.md)

- [Threat protection in Azure Security Center](../../security-center/threat-protection.md)

**Responsibility**: Customer

**Customer Security Stakeholders** ([Learn more](/azure/cloud-adoption-framework/organize/cloud-security#security-functions)):

- [Infrastructure and endpoint security](/azure/cloud-adoption-framework/organize/cloud-security-infrastructure-endpoint)

- [Security operations](/azure/cloud-adoption-framework/organize/cloud-security-operations-center)

- [Posture management](/azure/cloud-adoption-framework/organize/cloud-security-posture-management)   

- [Application Security and DevOps](/azure/cloud-adoption-framework/organize/cloud-security-application-security-devsecops) 

- [Threat intelligence](/azure/cloud-adoption-framework/organize/cloud-security-threat-intelligence)

## LT-3: Enable logging for Azure network activities

| Azure ID | CIS Controls v7.1 ID(s) | NIST SP800-53 r4 ID(s) |
|--|--|--|--|
| LT-3 | 9.3, 12.2, 12.5, 12.8 | AU-3, AU-6, AU-12, SI-4 |

Enable and collect network security group (NSG) resource logs, NSG flow logs, Azure Firewall logs, and Web Application Firewall (WAF) logs for security analysis to support incident investigations, threat hunting, and security alert generation. You can send the flow logs to an Azure Monitor Log Analytics workspace and then use Traffic Analytics to provide insights. 
Ensure you are collecting DNS query logs to assist in correlating other network data.

- [How to enable network security group flow logs](../../network-watcher/network-watcher-nsg-flow-logging-portal.md)

- [Azure Firewall logs and metrics](../../firewall/logs-and-metrics.md)

- [How to enable and use Traffic Analytics](../../network-watcher/traffic-analytics.md)

- [Monitoring with Network Watcher](../../network-watcher/network-watcher-monitoring-overview.md)

- [Azure networking monitoring solutions in Azure Monitor](../../azure-monitor/insights/azure-networking-analytics.md)

- [Gather insights about your DNS infrastructure with the DNS Analytics solution](../../azure-monitor/insights/dns-analytics.md)

**Responsibility**: Customer

**Customer Security Stakeholders** ([Learn more](/azure/cloud-adoption-framework/organize/cloud-security#security-functions)):

- [Infrastructure and endpoint security](/azure/cloud-adoption-framework/organize/cloud-security-infrastructure-endpoint)

- [Security operations](/azure/cloud-adoption-framework/organize/cloud-security-operations-center)

- [Posture management](/azure/cloud-adoption-framework/organize/cloud-security-posture-management)   

- [Application Security and DevOps](/azure/cloud-adoption-framework/organize/cloud-security-application-security-devsecops) 

- [Threat intelligence](/azure/cloud-adoption-framework/organize/cloud-security-threat-intelligence)

## LT-4: Enable logging for Azure resources

| Azure ID | CIS Controls v7.1 ID(s) | NIST SP800-53 r4 ID(s) |
|--|--|--|--|
| LT-4 | 6.2, 6.3, 8.8 | AU-3, AU-12 |

Enable logging for Azure resources to meet the requirements for compliance, threat detection, hunting, and incident investigation. 

You can use Azure Security Center and Azure Policy to enable resource logs and log data collecting on Azure resources for access to audit, security, and resource logs. Activity logs, which are automatically available, include event source, date, user, timestamp, source addresses, destination addresses, and other useful elements. 

- [Understand logging and different log types in Azure](../../azure-monitor/platform/platform-logs-overview.md)

- [Understand Azure Security Center data collection](../../security-center/security-center-enable-data-collection.md)

- [Enable and configure antimalware monitoring](../fundamentals/antimalware.md#enable-and-configure-antimalware-monitoring-using-powershell-cmdlets)

**Responsibility**: Shared

**Customer Security Stakeholders** ([Learn more](/azure/cloud-adoption-framework/organize/cloud-security#security-functions)):

- [Security operations](/azure/cloud-adoption-framework/organize/cloud-security-operations-center)

Infrastructure and endpoint security 

- [Application security and DevOps](/azure/cloud-adoption-framework/organize/cloud-security-application-security-devsecops) 

- [Threat intelligence](/azure/cloud-adoption-framework/organize/cloud-security-threat-intelligence)

## LT-5: Centralize security log management and analysis

| Azure ID | CIS Controls v7.1 ID(s) | NIST SP800-53 r4 ID(s) |
|--|--|--|--|
| LT-5 | 6.5, 6.6 | AU-3, SI-4 |

Centralize logging storage and analysis to enable correlation. For each log source, ensure you have assigned a data owner, access guidance, storage location, what tools are used to process and access the data, and data retention requirements.

Ensure you are integrating Azure activity logs into your central logging. Ingest logs via Azure Monitor to aggregate security data generated by endpoint devices, network resources, and other security systems. In Azure Monitor, use Log Analytics workspaces to query and perform analytics, and use Azure Storage accounts for long term and archival storage.

In addition, enable and onboard data to Azure Sentinel or a third-party SIEM.

Many organizations choose to use Azure Sentinel for “hot” data that is used frequently and Azure Storage for “cold” data that is used less frequently. 

- [How to collect platform logs and metrics with Azure Monitor](../../azure-monitor/platform/diagnostic-settings.md)

- [How to onboard Azure Sentinel](../../sentinel/quickstart-onboard.md)

**Responsibility**: Customer

**Customer Security Stakeholders** ([Learn more](/azure/cloud-adoption-framework/organize/cloud-security#security-functions)):

- [Security architecture](/azure/cloud-adoption-framework/organize/cloud-security-architecture)

- [Application Security and DevOps](/azure/cloud-adoption-framework/organize/cloud-security-application-security-devsecops) 

- [Infrastructure and endpoint security](/azure/cloud-adoption-framework/organize/cloud-security-infrastructure-endpoint)

## LT-6: Configure log storage retention

| Azure ID | CIS Controls v7.1 ID(s) | NIST SP800-53 r4 ID(s) |
|--|--|--|--|
| LT-6 | 6.4 | AU-3, AU-11 |

Configure your log retention according to your compliance, regulation, and business requirements. 

In Azure Monitor, you can set your Log Analytics workspace retention period according to your organization's compliance regulations. Use Azure Storage, Data Lake or Log Analytics workspace accounts for long-term and archival storage.

- [Change the data retention period in Log Analytics](../../azure-monitor/platform/manage-cost-storage.md#change-the-data-retention-period)

- [How to configure retention policy for Azure Storage account logs](../../storage/common/storage-monitor-storage-account.md#configure-logging)

- [Azure Security Center alerts and recommendations export](../../security-center/continuous-export.md)

**Responsibility**: Customer

**Customer Security Stakeholders** ([Learn more](/azure/cloud-adoption-framework/organize/cloud-security#security-functions)):

- [Security architecture](/azure/cloud-adoption-framework/organize/cloud-security-architecture)

- [Application Security and DevOps](/azure/cloud-adoption-framework/organize/cloud-security-application-security-devsecops) 

- [Security operations](/azure/cloud-adoption-framework/organize/cloud-security-operations-center) 

- [Security compliance management](/azure/cloud-adoption-framework/organize/cloud-security-compliance-management)

## LT-7: Use approved time synchronization sources

| Azure ID | CIS Controls v7.1 ID(s) | NIST SP800-53 r4 ID(s) |
|--|--|--|--|
| LT-7 | 6.1 | AU-8 |

Microsoft maintains time sources for most Azure PaaS and SaaS services. For your virtual machines, use Microsoft default NTP server for time synchronization unless you have a specific requirement.  If you need to stand up your own network time protocol (NTP) server, ensure you secure the UDP service port 123.

All logs generated by resources within Azure provide time stamps with the time zone specified by default.

- [How to configure time synchronization for Azure Windows compute resources](../../virtual-machines/windows/time-sync.md)

- [How to configure time synchronization for Azure Linux compute resources](../../virtual-machines/linux/time-sync.md)

- [How to disable inbound UDP for Azure services](https://support.microsoft.com/help/4558520/how-to-disable-inbound-udp-for-azure-services)

**Responsibility**: Shared

**Customer Security Stakeholders** ([Learn more](/azure/cloud-adoption-framework/organize/cloud-security#security-functions)):

- [Policy and standards](/azure/cloud-adoption-framework/organize/cloud-security-policy-standards)

- [Application Security and DevOps](/azure/cloud-adoption-framework/organize/cloud-security-application-security-devsecops) 

- [Infrastructure and endpoint security](/azure/cloud-adoption-framework/organize/cloud-security-infrastructure-endpoint)

