---
title: Azure Security Center Data Security | Microsoft Docs
description: This document explains how data is managed and safeguarded in Azure Security Center.
services: security-center
documentationcenter: na
author: YuriDio
manager: mbaldwin
editor: ''

ms.assetid: 33f2c9f4-21aa-4f0c-9e5e-4cd1223e39d7
ms.service: security-center
ms.devlang: na
ms.topic: hero-article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 02/06/2017
ms.author: yurid

---
# Azure Security Center Data Security
To help customers prevent, detect, and respond to threats, Azure Security Center collects and processes security-related data, including configuration information, metadata, event logs, crash dump files, and more. Microsoft adheres to strict compliance and security guidelines—from coding to operating a service.

This article explains how data is managed and safeguarded in Azure Security Center.


## Data sources
Azure Security Center analyzes data from the following sources to provide visibility into your security state, identify vulnerabilities and recommend mitigations, and detect active threats:

- Azure Services: Uses information about the configuration of Azure services you have deployed by communicating with that service’s resource provider.
- Network Traffic: Uses sampled network traffic metadata from Microsoft’s infrastructure, such as source/destination IP/port, packet size, and network protocol.
- Partner Solutions: Uses security alerts from integrated partner solutions, such as firewalls and antimalware solutions.
- Your Virtual Machines: Uses configuration information and information about security events, such as Windows event and audit logs, IIS logs, syslog messages, and crash dump files from your virtual machines.


## Data protection
**Data segregation**: Data is kept logically separate on each component throughout the service. All data is tagged per organization. This tagging persists throughout the data lifecycle, and it is enforced at each layer of the service.

**Data access**: In order to provide security recommendations and investigate potential security threats, Microsoft personnel may access information collected or analyzed by Azure services, including crash dump files, process creation events, VM disk snapshots and artifacts, which may unintentionally include Customer Data or personal data from your virtual machines. We adhere to the [Microsoft Online Services Terms and Privacy Statement](http://www.microsoftvolumelicensing.com/DocumentSearch.aspx?Mode=3&DocumentTypeId=31), which state that Microsoft will not use Customer Data or derive information from it for any advertising or similar commercial purposes. We only use Customer Data as needed to provide you with Azure services, including purposes compatible with providing those services. You retain all rights to Customer Data.

**Data use**: Microsoft uses patterns and threat intelligence seen across multiple tenants to enhance our prevention and detection capabilities; we do so in accordance with the privacy commitments described in our [Privacy Statement](https://www.microsoft.com/privacystatement/en-us/OnlineServices/Default.aspx).

## Data location
**Your Storage Account(s)**: A storage account is specified for each region where virtual machines are running. This enables you to store data in the same region as the virtual machine from which the data is collected. This data, including crash dump files, will be persistently stored in your storage account. VM disk snapshots are stored in the same storage account as the VM disk.

**Azure Security Center Storage**: Information about security alerts, including partner alerts, recommendations, and security health status is stored centrally, currently in the United States. This information may include related configuration information and security events collected from your virtual machines as needed to provide you with the security alert, recommendation, or security health status.

Azure Security Center collects ephemeral copies of your crash dump files and analyzes them for evidence of exploit attempts and successful compromises. Azure Security Center performs this analysis within the same Geo as the workspace, and deletes the ephemeral copies when analysis is complete.

Machine artifacts are stored centrally in the same region as the VM.


## Managing data collection from virtual machines
When you choose to enable Azure Security Center, data collection is turned on for each of your subscriptions. You can also turn on data collection in the Security Policy section of Azure Security Center. When Data collection is turned on, Azure Security Center provisions the Azure Monitoring Agent on all existing supported virtual machines and any new ones that are created. The Azure Security Monitoring extension scans for various security related configurations and events it into [Event Tracing for Windows (ETW)](https://msdn.microsoft.com/library/windows/desktop/bb968803.aspx) traces. In addition, the operating system will raise event log events during the course of running the machine. Examples of such data are: operating system type and version, operating system logs (Windows event logs), running processes, machine name, IP addresses, logged in user, and tenant ID. The Azure Monitoring Agent reads event log entries and ETW traces and copies them to your storage account for analysis.

You can disable data collection from virtual machines at any time, which will remove any Monitoring Agents previously installed by Azure Security Center. VM disk snapshots and artifact collection will still be enabled even if data collection has been disabled.


## See also
In this document, you learned how data is managed and safeguarded in Azure Security Center. To learn more about Azure Security Center, see:

* [Azure Security Center Planning and Operations Guide](security-center-planning-and-operations-guide.md) — Learn how to plan and understand the design considerations to adopt Azure Security Center.
* [Security health monitoring in Azure Security Center](security-center-monitoring.md) — Learn how to monitor the health of your Azure resources
* [Managing and responding to security alerts in Azure Security Center](security-center-managing-and-responding-alerts.md) — Learn how to manage and respond to security alerts
* [Monitoring partner solutions with Azure Security Center](security-center-partner-solutions.md) — Learn how to monitor the health status of your partner solutions.
* [Azure Security Center FAQ](security-center-faq.md) — Find frequently asked questions about using the service
* [Azure Security Blog](http://blogs.msdn.com/b/azuresecurity/) — Find blog posts about Azure security and compliance
