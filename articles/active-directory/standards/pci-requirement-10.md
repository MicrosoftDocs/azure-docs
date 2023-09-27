---
title: Microsoft Entra ID and PCI-DSS Requirement 10
description: Learn PCI-DSS defined approach requirements about logging and monitoring all access to system components and CHD
services: active-directory 
ms.service: active-directory
ms.subservice: standards
ms.workload: identity
ms.topic: how-to
author: jricketts
ms.author: jricketts
manager: martinco
ms.reviewer: martinco
ms.date: 04/18/2023
ms.custom: it-pro
ms.collection: 
---

# Microsoft Entra ID and PCI-DSS Requirement 10

**Requirement 10: Log and Monitor All Access to System Components and Cardholder Data**
</br>**Defined approach requirements**

## 10.1 Processes and mechanisms for logging and monitoring all access to system components and cardholder data are defined and documented.

|PCI-DSS Defined approach requirements|Microsoft Entra guidance and recommendations|
|-|-|
|**10.1.1** All security policies and operational procedures that are identified in Requirement 10 are: </br> Documented </br> Kept up to date </br> In use </br> Known to all affected parties|Use the guidance and links herein to produce the documentation to fulfill requirements based on your environment configuration.|
|**10.1.2** Roles and responsibilities for performing activities in Requirement 10 are documented, assigned, and understood.|Use the guidance and links herein to produce the documentation to fulfill requirements based on your environment configuration.|

## 10.2 Audit logs are implemented to support the detection of anomalies and suspicious activity, and the forensic analysis of events.

|PCI-DSS Defined approach requirements|Microsoft Entra guidance and recommendations|
|-|-|
|**10.2.1** Audit logs are enabled and active for all system components and cardholder data.|Archive Microsoft Entra audit logs to obtain changes to security policies and Microsoft Entra tenant configuration. </br> Archive Microsoft Entra activity logs in a security information and event management (SIEM) system to learn about usage. [Microsoft Entra activity logs in Azure Monitor](../reports-monitoring/concept-activity-logs-azure-monitor.md)|
|**10.2.1.1** Audit logs capture all individual user access to cardholder data.|Not applicable to Microsoft Entra ID.|
|**10.2.1.2** Audit logs capture all actions taken by any individual with administrative access, including any interactive use of application or system accounts.|Not applicable to Microsoft Entra ID.|
|**10.2.1.3** Audit logs capture all access to audit logs.|In Microsoft Entra ID, you can’t wipe or modify logs. Privileged users can query logs from Microsoft Entra ID. [Least privileged roles by task in Microsoft Entra ID](../roles/delegate-by-task.md) </br> When audit logs are exported to systems such as Azure Log Analytics Workspace, storage accounts, or third-party SIEM systems, monitor them for access.|
|**10.2.1.4** Audit logs capture all invalid logical access attempts.|Microsoft Entra ID generates activity logs when a user attempts to sign in with invalid credentials. It generates activity logs when access is denied due to Conditional Access policies. |
|**10.2.1.5** Audit logs capture all changes to identification and authentication credentials including, but not limited to:  </br> Creation of new accounts </br> Elevation of privileges </br> All changes, additions, or deletions to accounts with administrative access|Microsoft Entra ID generates audit logs for the events in this requirement. |
|**10.2.1.6** Audit logs capture the following: </br> All initialization of new audit logs, and </br> All starting, stopping, or pausing of the existing audit logs.|Not applicable to Microsoft Entra ID.|
|**10.2.1.7** Audit logs capture all creation and deletion of system-level objects.|Microsoft Entra ID generates audit logs for events in this requirement.|
|**10.2.2** Audit logs record the following details for each auditable event: </br> User identification. </br> Type of event. </br> Date and time. </br> Success and failure indication. </br> Origination of event. </br> Identity or name of affected data, system component, resource, or service (for example, name and protocol).|See, [Audit logs in Microsoft Entra ID](../reports-monitoring/concept-audit-logs.md)|

## 10.3 Audit logs are protected from destruction and unauthorized modifications.

|PCI-DSS Defined approach requirements|Microsoft Entra guidance and recommendations|
|-|-|
|**10.3.1** Read access to audit logs files is limited to those with a job-related need.|Privileged users can query logs from Microsoft Entra ID. [Least privileged roles by task in Microsoft Entra ID](../roles/delegate-by-task.md)|
|**10.3.2** Audit log files are protected to prevent modifications by individuals.|In Microsoft Entra ID, you can’t wipe or modify logs. </br> When audit logs are exported to systems such as Azure Log Analytics Workspace, storage accounts, or third-party SIEM systems, monitor them for access.|
|**10.3.3** Audit log files, including those for external-facing technologies, are promptly backed up to a secure, central, internal log server(s) or other media that is difficult to modify.|In Microsoft Entra ID, you can’t wipe or modify logs. </br> When audit logs are exported to systems such as Azure Log Analytics Workspace, storage accounts, or third-party SIEM systems, monitor them for access.|
|**10.3.4** File integrity monitoring or change-detection mechanisms is used on audit logs to ensure that existing log data can't be changed without generating alerts.|In Microsoft Entra ID, you can’t wipe or modify logs. </br> When audit logs are exported to systems such as Azure Log Analytics Workspace, storage accounts, or third-party SIEM systems, monitor them for access.|

## 10.4 Audit logs are reviewed to identify anomalies or suspicious activity.

|PCI-DSS Defined approach requirements|Microsoft Entra guidance and recommendations|
|-|-|
|**10.4.1** The following audit logs are reviewed at least once daily: </br> All security events. </br> Logs of all system components that store, process, or transmit cardholder data (CHD) and/or sensitive authentication data (SAD). Logs of all critical system components. </br> Logs of all servers and system components that perform security functions (for example, network security controls, intrusion-detection systems/intrusion-prevention systems (IDS/IPS), authentication servers).|Include Microsoft Entra ID logs in this process.|
|**10.4.1.1** Automated mechanisms are used to perform audit log reviews.|Include Microsoft Entra ID logs in this process. Configure automated actions and alerting when Microsoft Entra ID logs are integrated with Azure Monitor. [Deploy Azure Monitor: Alerts and automated actions](/azure/azure-monitor/best-practices-alerts)|
|**10.4.2** Logs of all other system components (those not specified in Requirement 10.4.1) are reviewed periodically.|Not applicable to Microsoft Entra ID.|
|**10.4.2.1** The frequency of periodic log reviews for all other system components (not defined in Requirement 10.4.1) is defined in the entity’s targeted risk analysis, which is performed according to all elements specified in Requirement 12.3.1|Not applicable to Microsoft Entra ID.|
|**10.4.3** Exceptions and anomalies identified during the review process are addressed.|Not applicable to Microsoft Entra ID.|

## 10.5 Audit log history is retained and available for analysis.

|PCI-DSS Defined approach requirements|Microsoft Entra guidance and recommendations|
|-|-|
|**10.5.1** Retain audit log history for at least 12 months, with at least the most recent three months immediately available for analysis.|Integrate with Azure Monitor and export the logs for long term archival. [Integrate Microsoft Entra ID logs with Azure Monitor logs](../reports-monitoring/howto-integrate-activity-logs-with-log-analytics.md) </br> Learn about Microsoft Entra ID logs data retention policy. [Microsoft Entra data retention](../reports-monitoring/reference-reports-data-retention.md)|

## 10.6 Time-synchronization mechanisms support consistent time settings across all systems.

|PCI-DSS Defined approach requirements|Microsoft Entra guidance and recommendations|
|-|-|
|**10.6.1** System clocks and time are synchronized using time-synchronization technology.|Learn about the time synchronization mechanism in Azure services. [Time synchronization for financial services in Azure](https://azure.microsoft.com/blog/time-synchronization-for-financial-services-in-azure/)|
|**10.6.2** Systems are configured to the correct and consistent time as follows: </br> One or more designated time servers are in use. </br> Only the designated central time server(s) receives time from external sources. </br> Time received from external sources is based on International Atomic Time or Coordinated Universal Time (UTC). </br> The designated time server(s) accept time updates only from specific industry-accepted external sources. </br> Where there's more than one designated time server, the time servers peer with one another to keep accurate time. </br> Internal systems receive time information only from designated central time server(s).|Learn about the time synchronization mechanism in Azure services. [Time synchronization for financial services in Azure](https://azure.microsoft.com/blog/time-synchronization-for-financial-services-in-azure/)|
|**10.6.3** Time synchronization settings and data are protected as follows: </br> Access to time data is restricted to only personnel with a business need. </br> Any changes to time settings on critical systems are logged, monitored, and reviewed.|Microsoft Entra ID relies on time synchronization mechanisms in Azure. </br> Azure procedures synchronize servers and network devices with NTP Stratum 1-time servers synchronized to global positioning system (GPS) satellites. Synchronization occurs every five minutes. Azure ensures service hosts sync time. [Time synchronization for financial services in Azure](https://azure.microsoft.com/blog/time-synchronization-for-financial-services-in-azure/) </br> Hybrid components in Microsoft Entra ID, such as Microsoft Entra Connect servers, interact with on-premises infrastructure. The customer owns time synchronization of on-premises servers. |

## 10.7 Failures of critical security control systems are detected, reported, and responded to promptly.

|PCI-DSS Defined approach requirements|Microsoft Entra guidance and recommendations|
|-|-|
|**10.7.2** *Additional requirement for service providers only*: Failures of critical security control systems are detected, alerted, and addressed promptly, including but not limited to failure of the following critical security control systems: </br> Network security controls </br> IDS/IPS </br> File integrity monitoring (FIM) </br> Anti-malware solutions </br> Physical access controls </br> Logical access controls </br> Audit logging mechanism </br> Segmentation controls (if used)|Microsoft Entra ID relies on time synchronization mechanisms in Azure. </br> Azure supports real-time event analysis in its operational environment. Internal Azure infrastructure systems generate near real-time event alerts about potential compromise.|
|**10.7.2** Failures of critical security control systems are detected, alerted, and addressed promptly, including but not limited to failure of the following critical security control systems: </br> Network security controls </br> IDS/IP </br> Change-detection mechanisms </br> Anti-malware solutions </br> Physical access controls </br> Logical access controls </br> Audit logging mechanisms </br> Segmentation controls (if used) </br> Audit log review mechanisms </br> Automated security testing tools (if used)|See, [Microsoft Entra security operations guide](../architecture/security-operations-introduction.md) |
|**10.7.3**  Failures of any critical security controls systems are responded to promptly, including but not limited to: </br> Restoring security functions. </br> Identifying and documenting the duration (date and time from start to end) of the security failure. </br> Identifying and documenting the cause(s) of failure and documenting required remediation. </br> Identifying and addressing any security issues that arose during the failure. </br> Determining whether further actions are required as a result of the security failure. </br> Implementing controls to prevent the cause of failure from reoccurring. </br> Resuming monitoring of security controls.|See, [Microsoft Entra security operations guide](../architecture/security-operations-introduction.md)|

## Next steps

PCI-DSS requirements **3**, **4**, **9**, and **12** aren't applicable to Microsoft Entra ID, therefore there are no corresponding articles. To see all requirements, go to pcisecuritystandards.org: [Official PCI Security Standards Council Site](https://docs-prv.pcisecuritystandards.org/PCI%20DSS/Standard/PCI-DSS-v4_0.pdf).

To configure Microsoft Entra ID to comply with PCI-DSS, see the following articles. 

* [Microsoft Entra PCI-DSS guidance](pci-dss-guidance.md) 
* [Requirement 1: Install and Maintain Network Security Controls](pci-requirement-1.md) 
* [Requirement 2: Apply Secure Configurations to All System Components](pci-requirement-2.md)
* [Requirement 5: Protect All Systems and Networks from Malicious Software](pci-requirement-5.md) 
* [Requirement 6: Develop and Maintain Secure Systems and Software](pci-requirement-6.md) 
* [Requirement 7: Restrict Access to System Components and Cardholder Data by Business Need to Know](pci-requirement-7.md) 
* [Requirement 8: Identify Users and Authenticate Access to System Components](pci-requirement-8.md) 
* [Requirement 10: Log and Monitor All Access to System Components and Cardholder Data](pci-requirement-10.md) (You're here)
* [Requirement 11: Test Security of Systems and Networks Regularly](pci-requirement-11.md)
* [Microsoft Entra PCI-DSS Multi-Factor Authentication guidance](pci-dss-mfa.md)
