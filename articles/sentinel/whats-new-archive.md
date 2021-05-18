---
title: Archive for What's new in Azure Sentinel
description: A description of what's new and changed in Azure Sentinel from six months ago and earlier.
services: sentinel
author: batamig
ms.author: bagol
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.topic: conceptual
ms.date: 05/13/2021
---

# Archive for What's new in Azure Sentinel

The primary [What's new in Azure Sentinel](whats-new.md) release notes page contains updates for the last six months, while this page contains older items.

For information about earlier features delivered, see our [Tech Community blogs](https://techcommunity.microsoft.com/t5/azure-sentinel/bg-p/AzureSentinelBlog/label-name/What's%20New).

Noted features are currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.


> [!TIP]
> Our threat hunting teams across Microsoft contribute queries, playbooks, workbooks, and notebooks to the [Azure Sentinel Community](https://github.com/Azure/Azure-Sentinel), including specific [hunting queries](https://github.com/Azure/Azure-Sentinel) that your teams can adapt and use.
>
> You can also contribute! Join us in the [Azure Sentinel Threat Hunters GitHub community](https://github.com/Azure/Azure-Sentinel/wiki).
>

## November 2020

- [Monitor your Playbooks' health in Azure Sentinel](#monitor-your-playbooks-health-in-azure-sentinel)
- [Microsoft 365 Defender connector (Public preview)](#microsoft-365-defender-connector-public-preview)

### Monitor your Playbooks' health in Azure Sentinel

Azure Sentinel playbooks are based on workflows built in [Azure Log Apps](../logic-apps/index.yml), a cloud service that helps you schedule, automate, and orchestrate tasks, business processes, and workflows. Playbooks can be automatically invoked when an incident is created, or when triaging and working with incidents. 

To provide insights into the health, performance, and usage of your playbooks, we've added a [workbook](../azure-monitor/visualize/workbooks-overview.md) named **Playbooks health monitoring**. 

Use the **Playbooks health monitoring** workbook to monitor the health of your playbooks, or look for anomalies in the amount of succeeded or failed runs. 

The **Playbooks health monitoring** workbook is now available in the Azure Sentinel Templates gallery:

:::image type="content" source="media/whats-new/playbook-monitoring-workbook.gif" alt-text="Sample Playbooks health monitoring workbook":::

For more information, see:

- [Logic Apps documentation](../logic-apps/monitor-logic-apps-log-analytics.md#set-up-azure-monitor-logs)

- [Azure Monitor documentation](../azure-monitor/essentials/activity-log.md#send-to-log-analytics-workspace)

### Microsoft 365 Defender connector (Public preview)
 
The Microsoft 365 Defender connector for Azure Sentinel enables you to stream advanced hunting logs (a type of raw event data) from Microsoft 365 Defender into Azure Sentinel. 

With the integration of [Microsoft Defender for Endpoint (MDATP)](/windows/security/threat-protection/) into the [Microsoft 365 Defender](/microsoft-365/security/mtp/microsoft-threat-protection) security umbrella, you can now collect your Microsoft Defender for Endpoint advanced hunting events using the Microsoft 365 Defender connector, and stream them straight into new purpose-built tables in your Azure Sentinel workspace. 

The Azure Sentinel tables are built on the same schema that's used in the Microsoft 365 Defender portal, and provide you with complete access to the full set of advanced hunting logs. 

For more information, see [Connect data from Microsoft 365 Defender to Azure Sentinel](connect-microsoft-365-defender.md).

> [!NOTE]
> Microsoft 365 Defender was formerly known as Microsoft Threat Protection or MTP. Microsoft Defender for Endpoint was formerly known as Microsoft Defender Advanced Threat Protection or MDATP.
> 

## Next steps

> [!div class="nextstepaction"]
>[On-board Azure Sentinel](quickstart-onboard.md)

> [!div class="nextstepaction"]
>[Get visibility into alerts](quickstart-get-visibility.md)
