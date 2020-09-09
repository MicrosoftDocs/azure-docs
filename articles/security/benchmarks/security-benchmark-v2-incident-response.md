---
title: Azure Security Control - Incident Response
description: Azure Security Control Incident Response
author: msmbaldwin
ms.service: security
ms.topic: conceptual
ms.date: 09/09/2020
ms.author: mbaldwin
ms.custom: security-benchmark

---

# Security Control: Incident Response

Incident response focuses on activities related to the preparation, detection and analysis, containment and post incident activities in the incident response life cycle. This includes using different services such as Azure Security Center and Sentinel to automate the process.

## IR-1: Preparation – update incident response process for Azure

| Azure ID | CIS IDs | NIST IDs |
|--|--|--|--|
| IR-1 | 19 | IR-4, IR-8 |

Ensure your organization has processes to respond to security incidents, has updated these processes for Azure, and is regularly exercising these to ensure readiness.

- [Updating Incident Response for Cloud (Azure Security Best Practice)](https://aka.ms/AzSec4)

- [Incident Response Reference Guide](https://aka.ms/IRRG) 

**Responsibility**: Customer

**Customer Security Stakeholders**:

Security operations (SecOps)

Incident preparation

Threat intelligence

## IR-2: Preparation – setup incident notification

| Azure ID | CIS IDs | NIST IDs |
|--|--|--|--|
| IR-2 | 19.5 | IR-4, IR-5, IR-6, IR-8 |

Setup security incident contact information in Azure Security Center. This contact information will be used by Microsoft to contact you if the Microsoft Security Response Center (MSRC) discovers that your data has been accessed by an unlawful or unauthorized party. You also have options to customize incident alert and notification in different Azure services based on your incident response needs. 

- [How to set the Azure Security Center security contact](../../security-center/security-center-provide-security-contact-details.md)

**Responsibility**: Customer

**Customer Security Stakeholders**:

Security operations (SecOps)

Incident preparation

## IR-3: Detection and analysis – create incidents based on high quality alerts

| Azure ID | CIS IDs | NIST IDs |
|--|--|--|--|
| IR-3 | 19.6 | IR-4, IR-5 |

Ensure you have a process to create high quality alerts and measure the quality of alerts. This allows you to learn lessons from past incidents and prioritize alerts for analysts so they don’t waste time on false positives. 

High quality alerts can be built from experience on your past incidents, validated community sources, and tools designed to generate and clean up alerts by fusing and correlating diverse signal sources. 

Azure Security Center (ASC) provides high quality alerts across many Azure assets. You can use the ASC data connector to stream the alerts to Azure Sentinel. Azure Sentinel lets you create advanced alert rules to generate incidents automatically for the investigation. 

Export your Azure Security Center alerts and recommendations using the continuous export feature to help identify risks to Azure resources. Continuous export allows you to export alerts and recommendations either manually or in an ongoing, continuous fashion.

- [How to configure continuous export](../../security-center/continuous-export.md)

- [How to stream alerts into Azure Sentinel](../../sentinel/connect-azure-security-center.md)

**Responsibility**: Customer

**Customer Security Stakeholders**:

Security operations (SecOps)

Incident preparation

Threat intelligence

## IR-4: Detection and analysis – investigate an incident

| Azure ID | CIS IDs | NIST IDs |
|--|--|--|--|
| IR-4 | 19 | IR-4 |

Ensure analysts have the capability to query and pivot diverse data sources as they investigate incidents and build a full view of what happened during a potential incident. Ensure insights and learnings are captured for other analysts and future historical reference. 

The data sources for investigation include the centralized logging sources that are already being collected, but can also include:

-	Network data – use network security groups’ flow logs, Azure Network Watcher, and Azure Monitor to capture network flow logs and other analytics information 

-	Snapshots of running systems 

a)	Use Azure virtual machine’s snapshot to create a snapshot of the running system’s disk. 

b)	Use operating system’s native memory dump capability to create a snapshot of the running system’s memory

c)	Use the snapshot feature of Azure service or software’s own capability to create snapshots of the running systems

Azure Sentinel provides extensive data analytics across virtually any log source and case management portal to manage the full lifecycle of incidents. Intelligence information during an investigation can be associated to the incident for tracking and reporting purposes. 

- [Snapshot a Windows machine’s disk](../../virtual-machines/windows/snapshot-copy-managed-disk.md)

- [Snapshot a Linux machine’s disk](../../virtual-machines/linux/snapshot-copy-managed-disk.md)

- [Microsoft Azure Support diagnostic information and memory dump collection](https://azure.microsoft.com/support/legal/support-diagnostic-information-collection/) 

- [Investigate incidents with Azure Sentinel](../../sentinel/tutorial-investigate-cases.md)

**Responsibility**: Customer

**Customer Security Stakeholders**:

None

## IR-5: Detection and analysis – prioritize incidents

| Azure ID | CIS IDs | NIST IDs |
|--|--|--|--|
| IR-5 | 19.8 | CA-2, IR-4 |

Provide context to analysts on which incidents to focus on first based on alert severity and asset sensitivity. 

Security Center assigns a severity to each alert to help you prioritize which alerts should be investigated first. The severity is based on how confident Security Center is in the finding or the analytic used to issue the alert as well as the confidence level that there was malicious intent behind the activity that led to the alert.

Additionally, mark subscriptions using tags and create a naming system to identify and categorize Azure resources, especially those processing sensitive data.  It is your responsibility to prioritize the remediation of alerts based on the criticality of the Azure resources and environment where the incident occurred.

- [Security alerts in Azure Security Center](../../security-center/security-center-alerts-overview.md)

- [Use tags to organize your Azure resources](/azure/azure-resource-manager/resource-group-using-tags)

**Responsibility**: Customer

**Customer Security Stakeholders**:

Security operations (SecOps)

Incident preparation

Threat intelligence

## IR-6: Containment, eradication and recovery – automate the incident handling

| Azure ID | CIS IDs | NIST IDs |
|--|--|--|--|
| IR-6 | 19 | IR-4, IR-5, IR-6 |

Automate manual repetitive tasks to speed up response time and reduce the burden on analysts. Manual tasks take longer to execute, slowing each incident and reducing how many incidents they can handle. Manual tasks also increase analyst fatigue, which increases the risk of human error that causes delays, and also degrade the ability of analysts to focus effectively on complex tasks. 
Use workflow automation feature in Azure Security Center and Azure Sentinel to automatically trigger actions or playbook to respond to incoming security alerts. The playbook actions, such as sending notification, disable accounts, or isolating network, etc. 

- [How to configure workflow automation in Security Center](../../security-center/workflow-automation.md)

- [Set up automated threat responses in Azure Security Center](../../security-center/tutorial-security-incident.md#triage-security-alerts)

- [Set up automated threat responses in Azure Sentinel](../../sentinel/tutorial-respond-threats-playbook.md)

**Responsibility**: Customer

**Customer Security Stakeholders**:

None

