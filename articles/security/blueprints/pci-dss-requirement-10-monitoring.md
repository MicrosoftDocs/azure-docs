---

title: Azure Payment Processing Blueprint - Monitoring requirements
description: PCI DSS Requirement 10
services: security
documentationcenter: na
author: simorjay
manager: mbaldwin
editor: tomsh

ms.assetid: 293a1673-54bc-478c-9400-231074004eee
ms.service: security
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 11/15/2017
ms.author: frasim

---

# Monitoring requirements for PCI DSS-compliant environments 
## PCI DSS Requirement 10

**Track and monitor all access to network resources and cardholder data**

> [!NOTE]
> These requirements are defined by the [Payment Card Industry (PCI) Security Standards Council](https://www.pcisecuritystandards.org/pci_security/) as part of the [PCI Data Security Standard (DSS) Version 3.2](https://www.pcisecuritystandards.org/document_library?category=pcidss&document=pci_dss). Please refer to the PCI DSS for information on testing procedures and guidance for each requirement.

Logging mechanisms and the ability to track user activities are critical in preventing, detecting, or minimizing the impact of a data compromise. The presence of logs in all environments allows thorough tracking, alerting, and analysis when something does go wrong. Determining the cause of a compromise is very difficult, if not impossible, without system activity logs.

## PCI DSS Requirement 10.1

**10.1** Implement audit trails to link all access to system components to each individual user.

**Responsibilities:&nbsp;&nbsp;`Shared`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Microsoft Azure restricts access to administrative and diagnostic tools to authorized personnel with relevant job responsibility. Microsoft Azure restricts privileged access to the tools used in the production environment based on least privilege principles. Microsoft Azure records and maintains a log of all individual user access to Microsoft Azure system components in the platform environment.<br /><br />Microsoft Azure platform components (including OS, CloudNet, Fabric, and so on) are configured to log and collect security events. Administrator activity in the Microsoft Azure platform is logged. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | The Contoso Webstore has extensive logging of all system, and user activity (Including CHD logging). For more information, see [PCI Guidance - Logging](payment-processing-blueprint.md#logging-and-auditing).|



## PCI DSS Requirement 10.2

**10.2** Implement automated audit trails for all system components to reconstruct the following events:
- **10.2.1** All individual user accesses to cardholder data
- **10.2.2** All actions taken by any individual with root or administrative privileges
- **10.2.3** Access to all audit trails
- **10.2.4** Invalid logical access attempts
- **10.2.5** Use of and changes to identification and authentication mechanisms — including but not limited to creation of new accounts and elevation of privileges — and all changes, additions, or deletions to accounts with root or administrative privileges
- **10.2.6** Initialization, stopping, or pausing of the audit logs
- **10.2.7** Creation and deletion of system-level objects

**Responsibilities:&nbsp;&nbsp;`Shared`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Microsoft Azure restricts access to administrative and diagnostic tools to authorized personnel with relevant job responsibility. Microsoft Azure restricts privileged access to the tools used in the production environment based on least privilege principles. Microsoft Azure records and maintains a log of all individual user access to Microsoft Azure system components in the platform environment.<br /><br />Microsoft Azure platform components (including OS, CloudNet, Fabric, and so on) are configured to log and collect security events. Administrator activity in the Microsoft Azure platform is logged. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | The Contoso Webstore has extensive logging of all system and user activity, including CHD logging. For more information, see [PCI Guidance - Logging](payment-processing-blueprint.md#logging-and-auditing).|



## PCI DSS Requirement 10.3

**10.3** Record at least the following audit trail entries for all system components for each event:
- **10.3.1** User identification
- **10.3.2** Type of event
- **10.3.3** Date and time
- **10.3.4** Success or failure indication
- **10.3.5** Origination of event
- **10.3.6** Identity or name of affected data, system component, or resource

**Responsibilities:&nbsp;&nbsp;`Shared`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Microsoft Azure has established procedures to synchronize servers and network devices in the Microsoft Azure environment with NTP Stratum 1 time servers synchronized to Global Positioning System (GPS) satellites. Synchronization is performed automatically every five minutes. Microsoft Azure is responsible for ensuring service hosts properly sync time. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | The Contoso Webstore records user identification, event type, date time stamp, success failed events, source of event, and name of resource as required by the 10.3 control.|



## PCI DSS Requirement 10.4

**10.4** Using time-synchronization technology, synchronize all critical system clocks and times and ensure that the following is implemented for acquiring, distributing, and storing time. 
> [!NOTE]
> One example of time synchronization technology is Network Time Protocol (NTP).

**Responsibilities:&nbsp;&nbsp;`Shared`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Microsoft Azure has established procedures to synchronize servers and network devices in the Microsoft Azure environment with NTP Stratum 1 time servers synchronized to Global Positioning System (GPS) satellites. Synchronization is performed automatically every five minutes. Microsoft Azure is responsible for ensuring service hosts properly sync time. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | Time synchronization for the PaaS service is performed by Azure.|



### PCI DSS Requirement 10.4.1

**10.4.1** Critical systems have the correct and consistent time.

**Responsibilities:&nbsp;&nbsp;`Shared`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | See "Microsoft Azure" section for [Requirement 10.4](#pci-dss-requirement-10-4). |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | Time synchronization for the PaaS service is performed by Azure.|



### PCI DSS Requirement 10.4.2

**10.4.2** Time data is protected.

**Responsibilities:&nbsp;&nbsp;`Shared`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | See "Microsoft Azure" section for [Requirement 10.4](#pci-dss-requirement-10-4). |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | Time synchronization for the PaaS service is performed by Azure.|



### PCI DSS Requirement 10.4.3

**10.4.3** Time settings are received from industry-accepted time sources.

**Responsibilities:&nbsp;&nbsp;`Shared`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | See "Microsoft Azure" section for [Requirement 10.4](#pci-dss-requirement-10-4). |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | Time synchronization for the PaaS service is performed by Azure.|



## PCI DSS Requirement 10.5

**10.5** Secure audit trails so they cannot be altered.

**Responsibilities:&nbsp;&nbsp;`Shared`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | FIM and IDS tools are implemented within the Microsoft Azure environment. Microsoft Azure uses EWS to support real-time analysis of events within its operational environment. MAs and AIMS generate near real-time alerts about events that could potentially compromise the system. <br /><br />Logging of service, user, and security events (web server logs, FTP server logs, and so on) is enabled and retained centrally. Azure restricts access to audit logs to authorized personnel based on job responsibilities. Event logs are archived on the Azure secure archival infrastructure and are retained for 180 days. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | The Contoso Webstore provides for auditing of all elements to OMS. Backing up to an external source can be performed by [Azure Backup](https://azure.microsoft.com/services/backup/).|



### PCI DSS Requirement 10.5.1

**10.5.1** Limit viewing of audit trails to those with a job-related need.

**Responsibilities:&nbsp;&nbsp;`Shared`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | See "Microsoft Azure" section for [Requirement 10.5](#pci-dss-requirement-10-5). |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | The Contoso Webstore provides for auditing of all elements to OMS. Backing up to an external source can be performed by [Azure Backup](https://azure.microsoft.com/services/backup/).|



### PCI DSS Requirement 10.5.2

**10.5.2** Protect audit trail files from unauthorized modifications.

**Responsibilities:&nbsp;&nbsp;`Shared`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | See "Microsoft Azure" section for [Requirement 10.5](#pci-dss-requirement-10-5). |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | The Contoso Webstore provides for auditing of all elements to OMS. Backing up to an external source can be performed by [Azure Backup](https://azure.microsoft.com/services/backup/).|



### PCI DSS Requirement 10.5.3

**10.5.3** Promptly back up audit trail files to a centralized log server or media that is difficult to alter.

**Responsibilities:&nbsp;&nbsp;`Shared`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | See "Microsoft Azure" section for [Requirement 10.5](#pci-dss-requirement-10-5). |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | The Contoso Webstore provides for auditing of all elements to OMS. Backing up to an external source can be performed by [Azure Backup](https://azure.microsoft.com/services/backup/).|



### PCI DSS Requirement 10.5.4

**10.5.4** Write logs for external-facing technologies onto a secure, centralized, internal log server or media device.

**Responsibilities:&nbsp;&nbsp;`Shared`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | See "Microsoft Azure" section for [Requirement 10.5](#pci-dss-requirement-10-5). |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | The Contoso Webstore provides for auditing of all elements to OMS. Backing up to an external source can be performed by [Azure Backup](https://azure.microsoft.com/services/backup/).|



### PCI DSS Requirement 10.5.5

**10.5.5** Use file-integrity monitoring or change-detection software on logs to ensure that existing log data cannot be changed without generating alerts (although new data being added should not cause an alert).

**Responsibilities:&nbsp;&nbsp;`Shared`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | See "Microsoft Azure" section for [Requirement 10.5](#pci-dss-requirement-10-5). |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | The Contoso Webstore provides for auditing of all elements to OMS. Backing up to an external source can be performed by [Azure Backup](https://azure.microsoft.com/services/backup/).|



## PCI DSS Requirement 10.6

**10.6** Review logs and security events for all system components to identify anomalies or suspicious activity.
 
> [!NOTE]
> Log harvesting, parsing, and alerting tools may be used to meet this Requirement.

**Responsibilities:&nbsp;&nbsp;`Shared`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | FIM and IDS tools are implemented within the Microsoft Azure environment. Microsoft Azure uses EWS to support real-time analysis of events within its operational environment. MAs and AIMS generate near real-time alerts about events that could potentially compromise the system. <br /><br />Logging of service, user, and security events (web server logs, FTP server logs, and so on) is enabled and retained centrally. Azure restricts access to audit logs to authorized personnel based on job responsibilities. Event logs are archived on the Azure secure archival infrastructure and are retained for 180 days. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | The Contoso Webstore uses [Azure Security Center](https://azure.microsoft.com/services/security-center/) to monitor, report, and prevent anomalies. [Azure Advisor](/azure/advisor/advisor-security-recommendations) provides a consistent, consolidated view of recommendations for all your Azure resources.|



### PCI DSS Requirement 10.6.1

**10.6.1** Review the following at least daily:
- All security events
- Logs of all system components that store, process, or transmit CHD and/or SAD
- Logs of all critical system components
- Logs of all servers and system components that perform security functions (for example, firewalls, intrusion-detection systems/intrusion-prevention systems (IDS/IPS), authentication servers, e-commerce redirection servers, and so on).

**Responsibilities:&nbsp;&nbsp;`Shared`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | See "Microsoft Azure" section for [Requirement 10.6](#pci-dss-requirement-10-6). |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | The Contoso Webstore uses [Azure Security Center](https://azure.microsoft.com/services/security-center/) to monitor, report, and prevent anomalies. [Azure Advisor](/azure/advisor/advisor-security-recommendations) provides a consistent, consolidated view of recommendations for all your Azure resources.|



### PCI DSS Requirement 10.6.2

**10.6.2** Review logs of all other system components periodically based on the organization’s policies and risk management strategy, as determined by the organization’s annual risk assessment.

**Responsibilities:&nbsp;&nbsp;`Shared`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | See "Microsoft Azure" section for [Requirement 10.6](#pci-dss-requirement-10-6). |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | The Contoso Webstore uses [Azure Security Center](https://azure.microsoft.com/services/security-center/) to monitor, report, and prevent anomalies. [Azure Advisor](/azure/advisor/advisor-security-recommendations) provides a consistent, consolidated view of recommendations for all your Azure resources.|



### PCI DSS Requirement 10.6.3

**10.6.3** Follow up exceptions and anomalies identified during the review process.

**Responsibilities:&nbsp;&nbsp;`Shared`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | See the "Microsoft Azure" section for [Requirement 10.6](#pci-dss-requirement-10-6). |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | The Contoso Webstore uses [Azure Security Center](https://azure.microsoft.com/services/security-center/) to monitor, report, and prevent anomalies. [Azure Advisor](/azure/advisor/advisor-security-recommendations) provides a consistent, consolidated view of recommendations for all your Azure resources.|



## PCI DSS Requirement 10.7

**10.7** Retain audit trail history for at least one year, with a minimum of three months immediately available for analysis (for example, online, archived, or restorable from backup).

**Responsibilities:&nbsp;&nbsp;`Shared`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Microsoft Azure retains audit logs for one year, with the most recent 3 months immediately accessible through their internal portal. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | The Contoso Webstore has extensive logging of all system, and user activity (Including CHD logging). For more information, see [PCI Guidance - Logging](payment-processing-blueprint.md#logging-and-auditing).|



## PCI DSS Requirement 10.8

**10.8** **Additional requirement for service providers only:** Implement a process for the timely detection and reporting of failures of critical security control systems, including but not limited to failure of:
- Firewalls
- IDS/IPS
- FIM
- Anti-virus
- Physical access controls
- Logical access controls
- Audit logging mechanisms
- Segmentation controls (if used) 

> [!NOTE]
> This requirement is a best practice until January 31, 2018, after which it becomes a requirement.



**Responsibilities:&nbsp;&nbsp;`Shared`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Microsoft Azure uses EWS to support real-time analysis of events within its operational environment. MAs and AIMS generate near real-time alerts about events that could potentially compromise the system. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | The Contoso Webstore has extensive logging of all system, and user activity (Including CHD logging). For more information, see [PCI Guidance - Logging](payment-processing-blueprint.md#logging-and-auditing).|



### PCI DSS Requirement 10.8.1

**10.8.1** **Additional requirement for service providers only:** Respond to failures of any critical security controls in a timely manner. Processes for responding to failures in security controls must include:
- Restoring security functions
- Identifying and documenting the duration (date and time start to end) of the security failure
- Identifying and documenting cause(s) of failure, including root cause, and documenting
remediation required to address root cause
- Identifying and addressing any security issues that arose during the failure
- Performing a risk assessment to determine whether further actions are required as a result of the security failure
- Implementing controls to prevent cause of failure from reoccurring
-Resuming monitoring of security controls 

> [!NOTE]
> This requirement is a best practice until January 31, 2018, after which it becomes a requirement.


**Responsibilities:&nbsp;&nbsp;`Shared`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Microsoft Azure uses EWS to support real-time analysis of events within its operational environment. MAs and AIMS generate near real-time alerts about events that could potentially compromise the system. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | The Contoso Webstore has extensive logging of all system, and user activity (Including CHD logging). For more information, see [PCI Guidance - Logging](payment-processing-blueprint.md#logging-and-auditing).|



## PCI DSS Requirement 10.9

**10.9** Ensure that security policies and operational procedures for monitoring all access to network resources and cardholder data are documented, in use, and known to all affected parties.


**Responsibilities:&nbsp;&nbsp;`Customer Only`**

|||
|---|---|
| **Provider<br />(Microsoft&nbsp;Azure)** | Not applicable. |
| **Customer<br />(PCI&#8209;DSS&nbsp;Blueprint)** | The Contoso Webstore provides a use case and a description about how the CHD is managed and protected.|




