<properties
   pageTitle="Azure Security Center Data Security | Microsoft Azure"
   description="This document explains how data is managed and safeguarded in Azure Security Center."
   services="security-center"
   documentationCenter="na"
   authors="YuriDio"
   manager="swadhwa"
   editor=""/>

<tags
   ms.service="security-center"
   ms.devlang="na"
   ms.topic="hero-article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="08/08/2016"
   ms.author="yurid"/>

# Azure Security Center Data Security
To help customers prevent, detect, and respond to threats, Azure Security Center collects and processes data about your Azure resources, including configuration information, metadata, event logs, crash dump files, and more. We make strong commitments to protect the privacy and security of this data. Microsoft adheres to strict compliance and security guidelines—from coding to operating a service. 

This article explains how data is managed and safeguarded in Azure Security Center.

## Data Sources
Azure Security Center analyzes data from the following sources:

- Azure Services: Reads information about the configuration of Azure services you have deployed by communicating with that service’s resource provider.
- Network Traffic: Reads sampled network traffic metadata from Microsoft’s infrastructure, such as source/destination IP/port, packet size, and network protocol.
- Partner Solutions: Collects security alerts from integrated partner solutions, such as firewalls and antimalware solutions. This data is stored in Azure Security Center storage, currently located in the United States.
- Your Virtual Machines: Azure Security Center can collect configuration information and information about security events, such as Windows event and audit logs, IIS logs, syslog messages, and crash dump files from your virtual machines using data collection agents. See the “Managing Data Collection” section below for additional details.  

In addition, information about security alerts, recommendations, and security health status is stored in Azure Security Center storage, currently located in the United States. This information may include related configuration information and security events collected from your virtual machines as needed to provide you with the security alert, recommendation, or security health status.

## Data Protection
**Data segregation**: Data is kept logically separate on each component throughout the service. All data is tagged per organization. This tagging persists throughout the data lifecycle, and it is enforced at each layer of the service. In addition, data collected from your virtual machines is stored in your storage account(s).

**Data access**: In order to provide security recommendations and investigate potential security threats, Microsoft personnel may access information collected or analyzed by Azure services, including crash dump files. Crash dump files and process creation events may unintentionally include Customer Data or personal data from your virtual machines. We adhere to the [Microsoft Online Services Terms](http://www.microsoftvolumelicensing.com/DocumentSearch.aspx?Mode=3&DocumentTypeId=31) and [Privacy Statement](https://www.microsoft.com/privacystatement/en-us/OnlineServices/Default.aspx), which state that Microsoft will not use Customer Data or derive information from it for any advertising or similar commercial purposes. We only use Customer Data as needed to provide you with Azure services, including purposes compatible with providing those services. You retain all rights to Customer Data.

**Data use**: Microsoft uses patterns and threat intelligence seen across multiple tenants to enhance our prevention and detection capabilities; we do so in accordance with the privacy commitments described in our [Privacy Statement](https://www.microsoft.com/privacystatement/en-us/OnlineServices/Default.aspx).

**Data location**: A storage account is specified for each region where virtual machines are running. This enables you to store data in the same region as the virtual machine from which the data is collected. This data, including crash dump files, will be persistently stored in your storage account. The service also stores information about security alerts, including alerts from integrated partner solutions, recommendations, and security health status in Azure Security Center storage, currently located in the United States.

## Managing Data Collection from Virtual Machines

When you choose to enable Azure Security Center, data collection is turned on for each of your subscriptions. You can turn off data collection in the “Security Policy” section of your Azure Security Center Dashboard. When Data collection is turned on, Azure Security Center provisions the Azure Monitoring Agent on all existing supported virtual machines and any new ones that are created. The Azure Security Monitoring extension scans for various security related configurations and events it into [Event Tracing for Windows](https://msdn.microsoft.com/library/windows/desktop/bb968803.aspx) (ETW) traces. In addition, the operating system will raise event log events during the course of running the machine. Examples of such data are: operating system type and version, operating system logs (Windows event logs), running processes, machine name, IP addresses, logged in user, and tenant ID. The Azure Monitoring Agent reads event log entries and ETW traces and copies them to your storage account for analysis. 

A storage account is specified for each region in which you have virtual machines running, where data collected from virtual machines in that same region is stored. This makes it easy for you to keep data in the same geographic area for privacy and data sovereignty purposes. You can configure storage accounts for each region in the “Security Policy” section of your Azure Security Center Dashboard.

The Azure Monitoring Agent also copies crash dump files to your storage account.  Azure Security Center collects ephemeral copies of your crash dump files and analyzes them for evidence of exploit attempts and successful compromises.  Azure Security Center performs this analysis within the same geographic region as the storage account, and deletes the ephemeral copies when analysis is complete.

You can disable data collection from virtual machines at any time, which will remove any Monitoring Agents previously installed by Azure Security Center.


## Next steps

In this document, you learned how data is managed and safeguarded in Azure Security Center. To learn more about Azure Security Center, see:

- [Azure Security Center Planning and Operations Guide](security-center-planning-and-operations-guide.md) — Learn how to plan and understand the design considerations to adopt Azure Security Center.
- [Security health monitoring in Azure Security Center](security-center-monitoring.md) — Learn how to monitor the health of your Azure resources
- [Managing and responding to security alerts in Azure Security Center](security-center-managing-and-responding-alerts.md) — Learn how to manage and respond to security alerts
- [Monitoring partner solutions with Azure Security Center](security-center-partner-solutions.md) — Learn how to monitor the health status of your partner solutions.
- [Azure Security Center FAQ](security-center-faq.md) — Find frequently asked questions about using the service
- [Azure Security Blog](http://blogs.msdn.com/b/azuresecurity/) — Find blog posts about Azure security and compliance
