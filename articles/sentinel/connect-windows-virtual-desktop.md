---
title: Connect Windows Virtual Desktop to Azure Sentinel | Microsoft Docs
description: Learn to connect your Windows Virtual Desktop data to Azure Sentinel.
services: sentinel
documentationcenter: na
author: batamig
manager: rkarlin
editor: ''

ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/22/2021
ms.author: bagol

---
# Connect Windows Virtual Desktop data to Azure Sentinel

This article describes how you can monitor your Windows Virtual Desktop (WVD) environments using Azure Sentinel.

For example, monitoring your Windows Virtual Desktop environments can enable you to provide more remote work using virtualized desktops, while maintaining your organization's security posture.

## Windows Virtual Desktop data in Azure Sentinel

Windows Virtual Desktop data in Azure Sentinel includes the following types:


|Data  |Description  |
|---------|---------|
|**Windows event logs**     |  Windows event logs from the WVD environment are streamed into an Azure Sentinel-enabled Log Analytics workspace in the same manner as Windows event logs from other Windows machines, outside of the WVD environment. <br><br>Install the Log Analytics agent onto your Windows machine and configure the Windows event logs to be sent to the Log Analytics workspace.<br><br>For more information, see:<br>- [Install Log Analytics agent on Windows computers](../azure-monitor/agents/agent-windows.md)<br>- [Collect Windows event log data sources with Log Analytics agent](../azure-monitor/agents/data-sources-windows-events.md)<br>- [Connect Windows security events](connect-windows-security-events.md)       |
|**Microsoft Defender for Endpoint alerts**     |  To configure Defender for Endpoint for Windows Virtual Desktop, use the same procedure as you would for any other Windows endpoint. <br><br>For more information, see: <br>- [Set up Microsoft Defender for Endpoint deployment](/windows/security/threat-protection/microsoft-defender-atp/production-deployment)<br>- [Connect data from Microsoft 365 Defender to Azure Sentinel](connect-microsoft-365-defender.md)       |
|**Windows Virtual Desktop diagnostics**     | Windows Virtual Desktop diagnostics is a feature of the Windows Virtual Desktop PaaS service, which logs information whenever someone assigned Windows Virtual Desktop role uses the service. <br><br>Each log contains information about which Windows Virtual Desktop role was involved in the activity, any error messages that appear during the session, tenant information, and user information. <br><br>The diagnostics feature creates activity logs for both user and administrative actions. <br><br>For more information, see [Use Log Analytics for the diagnostics feature in Windows Virtual Desktop](../virtual-desktop/virtual-desktop-fall-2019/diagnostics-log-analytics-2019.md).        |
|     |         |

## Connect Windows Virtual Desktop data

To start ingesting Windows Virtual Desktop data into Azure Sentinel, use the instructions from the Windows Virtual Desktop documentation.

For more information, see [Push Windows Virtual Desktop data to your Log Analytics workspace](../virtual-desktop/diagnostics-log-analytics.md).

## Find your data

After a successful connection is established, run queries in Azure Sentinel against your Log Analytics data.

For example, see sample queries from the [Windows Virtual Desktop documentation](../virtual-desktop/diagnostics-log-analytics.md).


Azure Sentinel also provides built-in queries in the **General** > **Logs** > **WINDOWS VIRTUAL DESKTOP** area:

[![Windows Virtual Desktop built-in queries in Azure Sentinel.](media/connect-windows-virtual-desktop/windows-virtual-desktop-queries.png) ](media/connect-windows-virtual-desktop/windows-virtual-desktop-queries.png#lightbox)

## Next steps


For more information, see the [Azure Monitor for Windows Virtual Desktop glossary](../virtual-desktop/azure-monitor-glossary.md).