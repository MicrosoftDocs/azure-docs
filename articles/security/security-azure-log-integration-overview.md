<properties
   pageTitle="Introduction to Microsoft Azure log integration | Microsoft Azure"
   description="Learn about Azure log integration, its key capabilities, and how it works."
   services="security"
   documentationCenter="na"
   authors="TomShinder"
   manager="MBaldwin"
   editor="TerryLanfear"/>

<tags
   ms.service="security"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="08/24/2016"
   ms.author="TomSh"/>

# Introduction to Microsoft Azure log integration (Preview)

Learn about Azure log integration, its key capabilities, and how it works.

## Overview

Platform as a Service (PaaS) and Infrastructure as a Service (IaaS) hosted in Azure generate a large amount of data in security logs. These logs contain vital information that can provide intelligence and powerful insights into policy violations, internal and external threats, regulatory compliance issues, and anomalies in network, host, and user activity.

Azure log integration enables you to integrate raw logs from your Azure resources into your on-premises Security Information and Event Management (SIEM) systems. Azure log integration collects Azure Diagnostics from your Windows *(WAD)* virtual machines, as well as diagnostics from partner solutions such as a Web Application Firewall (WAF). This integration provides a unified dashboard for all your assets, on-premises or in the cloud, so that you can aggregate, correlate, analyze, and alert for security events.

![Azure log integration][1]

## What logs can I integrate?

Azure produces extensive logging for every Azure service. These logs are categorized by two main types:

- **Control/management logs**, which give visibility into the Azure Resource Manager CREATE, UPDATE, and DELETE operations. Azure Audit Logs is an example of this type of log.
- **Data plane logs**, which give visibility into the events raised as part of the usage of an Azure resource. Examples of this type of log are the Windows event System, Security, and Application logs in a virtual machine.

Azure log integration currently supports integration of Azure Audit Logs, virtual machine logs, and Azure Security Center alerts.

If you have questions about Azure Log Integration, please send an email to [AzSIEMteam@microsoft.com] (mailto:AzSIEMteam@microsoft.com)

## Next steps

In this document, you were introduced to Azure log integration. To learn more about Azure log integration and the types of logs supported, see the following:

- [Microsoft Azure Log Integration for Azure logs (Preview)](https://www.microsoft.com/download/details.aspx?id=53324) – Download Center for details, system requirements, and install instructions on Azure log integration.
- [Get started with Azure log integration](security-azure-log-integration-get-started.md) - This tutorial walks you through installation of Azure log integration and integrating logs from Azure storage, Azure Audit Logs, and Security Center alerts.
- [Partner configuration steps](https://blogs.msdn.microsoft.com/azuresecurity/2016/08/23/azure-log-siem-configuration-steps/) – This blog post shows you how to configure Azure log integration to work with partner solutions Splunk, HP ArcSight, and IBM QRadar.
- [Azure log Integration frequently asked questions (FAQ)](security-azure-log-integration-faq.md) - This FAQ answers questions about Azure log integration.
- [Integrating Security Center alerts with Azure log Integration](../security-center/security-center-integrating-alerts-with-log-integration.md) – This document shows you how to sync Security Center alerts, along with virtual machine security events collected by Azure Diagnostics and Azure Audit Logs, with your log analytics or SIEM solution.
- [New features for Azure diagnostics and Azure Audit Logs](https://azure.microsoft.com/blog/new-features-for-azure-diagnostics-and-azure-audit-logs/) – This blog post introduces you to Azure Audit Logs and other features that help you gain insights into the operations of your Azure resources.

<!--Image references-->
[1]: ./media/security-azure-log-integration-overview/azure-log-integration.png
