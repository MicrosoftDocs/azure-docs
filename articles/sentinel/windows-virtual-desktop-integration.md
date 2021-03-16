---
title: Windows Virtual Desktop integration with Azure Sentinel | Microsoft Docs
description: Learn how the Windows Virtual Desktop integration with Azure Sentinel enables you to monitor your Windows 10 virtual desktops and ensure your organization's security posture. 
services: sentinel
documentationcenter: na
author: batamig
manager: rkarlin
editor: ''

ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/16/2021
ms.author: bagol

---
# Windows Virtual Desktop integration with Azure Sentinel


Windows Virtual Desktop (WVD) enables organizations to quickly provision Windows 10 virtual desktops. Make sure to monitor your new endpoints using Azure Sentinel to maintain your organization's security posture.

Windows Virtual Desktop integrates with Azure Sentinel via diagnostics data pushed into the Log Analytics for your workspace.

For example, once your data is pushed into Log Analytics, you can view Windows event logs, Microsoft Defender Advanced Threat Protection (MDATP) alerts, and diagnostic logs from the WVD PaaS service itself, in Azure Sentinel.

For more information, see:

- [Use Azure Monitor for Windows Virtual Desktop to monitor your deployment](/azure/virtual-desktop/azure-monitor)
- [Use Log Analytics for the diagnostics feature](/azure/virtual-desktop/diagnostics-log-analytics)
- [Azure Monitor for Windows Virtual Desktop glossary](/azure/virtual-desktop/azure-monitor-glossary)

To query your Windows Virtual Desktop logs in Sentinel, go to **General** > **Logs**, and then scroll down to the **WINDOWS VIRTUAL DESKTOP** built-in queries.

:::image type="content" source="media/windows-virtual-desktop-integration/windows-virtual-desktop-queries-small.png" alt-text="Windows Virtual Desktop built-in queries in Azure Sentinel" lightbox="media/windows-virtual-desktop-integration/windows-virtual-desktop-queries.png":::