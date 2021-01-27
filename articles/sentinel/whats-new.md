---
title: What's new in Azure Sentinel
description: This article describes new features in Azure Sentinel from the past few months.
services: sentinel
author: batamig
ms.author: bagol
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.topic: conceptual
ms.date: 01/27/2021
---

# What's new in Azure Sentinel

This article lists recent features added for Azure Sentinel. 

For information about earlier features delivered , see our [Tech Community blogs](https://techcommunity.microsoft.com/t5/azure-sentinel/bg-p/AzureSentinelBlog/label-name/What's%20New).

## Dedicated clusters for Azure Sentinel

**Released**: Jan 18, 2021

## Managed Identity for the Azure Sentinel Logic Apps connector

**Released** Jan 17, 2021

## Improved Analytics Preview graph (public preview)

**Released** Jan 5, 2021


## Log Analytics agent improvements

**Released** Dec 13, 2020


## 80 new out-of-the-box hunting queries

**Released** Dec 7, 2020



## Monitor your Logic Apps Playbooks in Azure Sentinel

**Released** Nov 10, 2020

Azure Sentinel now integrates with [Azure Log Apps](/azure/logic-apps/), a cloud service that helps you schedule, automate, and orchestrate tasks, business processes, and workflows.

Use an Azure Logic App in Azure Sentinel as a playbook, which can be automatically invoked when an incident is created, or when triaging and working with incidents. 

To provide insights into the health, performance, and usage of your playbooks, including any that you add with Azure Logic Apps, we've added an [Azure Workbook](/azure/azure-monitor/platform/workbooks-overview) named **Playbooks health monitoring**. 

Use the **Playbooks health monitoring** workbook to monitor the health of your playbooks, or look for anomalies in the amount of succeeded or failed runs. 

Spot out-of-the-ordinary playbooks that may run unexpectedly long, and monitor and manage changes made by users, especially for critical playbooks. View runtimes at a glace for specific logic apps, giving you a quick estimate for usage costs.

The **Playbooks health monitoring** workbook is now available in the Azure Sentinel Templates gallery:

For example:

:::image type="content" source="media/whats-new/playbook-monitoring-workbook.gif" alt-text="Sample Playbooks health monitoring workbook":::

## Microsoft 365 Defender connector (Public preview)
 
**Released** Nov 9, 2020

The Microsoft 365 Defender connector for Azure Sentinel enables you to stream advanced hunting logs (a type of raw event data) from Microsoft 365 Defender into Azure Sentinel. 

With the integration of [Microsoft Defender for Endpoint (MDATP)](/windows/security/threat-protection/) into the [Microsoft 365 Defender](/microsoft-365/security/mtp/microsoft-threat-protection) security umbrella, you can now collect your Microsoft Defender for Endpoint advanced hunting events using the Microsoft 365 Defender connector, and stream them straight into new purpose-built tables in your Azure Sentinel workspace. 

The Azure Sentinel tables are built on the same schema that's used in the Microsoft 365 Defender portal, and provide you with complete access to the full set of advanced hunting logs. 

**Access to advanced hunting logs enables you to**:

- Copy your existing Microsoft Defender ATP advanced hunting queries directly into Azure Sentinel.

- Use the raw event logs to provide more insights for your alerts, hunting, and investigations, and correlate events with data from other data sources in Azure Sentinel.

- Store the logs with increased retention, beyond Microsoft Defender for Endpoint or Microsoft 365 Defender’s default retention of 30 days. 

    Configuring the retention for your workspace, or configure per-table retention in Log Analytics.

For more information, see [Connect data from Microsoft 365 Defender to Azure Sentinel](connect-microsoft-365-defender.md).

> [!NOTE]
> Microsoft 365 Defender was formerly known as Microsoft Threat Protection or MTP. Microsoft Defender for Endpoint was formerly known as Microsoft Defender Advanced Threat Protection or MDATP.
> 



## Next steps

> [!div class="nextstepaction"]
>[On-board Azure Sentinel](quickstart-onboard.md)

> [!div class="nextstepaction"]
>[Get visibility into alerts](quickstart-get-visibility.md)
