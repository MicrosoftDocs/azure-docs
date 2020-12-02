---
title: Connect Windows Defender Firewall data to Azure Sentinel | Microsoft Docs
description: Enable the Windows firewall connector in Azure Sentinel to easily stream firewall events from Windows machines that have Log Analytics agents installed.
services: sentinel
documentationcenter: na
author: yelevin
manager: rkarlin
editor: ''

ms.assetid: 0e41f896-8521-49b8-a244-71c78d469bc3
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 08/05/2020
ms.author: yelevin

---
# Connect Windows Defender Firewall with Advanced Security to Azure Sentinel

The [Windows Defender Firewall with Advanced Security](/windows/security/threat-protection/windows-firewall/windows-firewall-with-advanced-security) connector allows Azure Sentinel to easily ingest Windows Defender Firewall with Advanced Security logs from any Windows machines in your workspace. This connection enables you to view and analyze Windows Firewall events in your workbooks, to use them in creating custom alerts, and to incorporate them in your security investigations, giving you more insight into your organization’s network and improving your security operations capabilities. 

The solution collects Windows firewall events from the Windows machines on which a Log Analytics agent is installed. 

> [!NOTE]
> - Data will be stored in the geographic location of the workspace on which you are running Azure Sentinel.
>
> - If Azure Defender alerts from Azure Security Center are already collected to the Azure Sentinel workspace, there is no need to enable the Windows Firewall solution through this connector. However, if you did enable it, it will not cause duplicated data. 

## Prerequisites

- You must have read and write permissions on the workspace to which the machines you wish to monitor are connected.

- You must be assigned the **Log Analytics Contributor** role on the SecurityInsights solution on that workspace, in addition to any **Azure Sentinel** roles. [Learn more](../role-based-access-control/built-in-roles.md#log-analytics-contributor)

## Enable the connector 

1. In the Azure Sentinel portal, select **Data connectors** from the navigation menu.

1. Select **Windows Firewall** from the connectors gallery and click **Open connector page**.

### Instructions tab

- **If your Windows machines are in Azure:**

    1. Select **Install agent on Azure Windows Virtual Machine**.

    1. Click the **Download & install agent for Azure Windows Virtual machines >** link that appears.

    1. In the **Virtual machines** list, select the Windows machine you want to stream into Azure Sentinel. (You can select **Windows** in the OS column filter to ensure that only Windows VMs are displayed).

    1. In the window that opens for that VM, click **Connect**.

    1. Return to the **Virtual Machines** pane and repeat the previous two steps for any other VMs you want to connect. When you're done, return to the **Windows Firewall** pane.

- **If your Windows machine is not an Azure VM:**

    1. Select **Install agent on non-Azure Windows Machine**.

    1. Click the **Download & install agent for non-Azure Windows machines >** link that appears.

    1. In the **Agents management** pane, select either **Download Windows Agent (64 bit)** or **Download Windows Agent (32 bit)**, as needed.

    1. Copy the **Workspace ID**, **Primary key**, and **Secondary key** strings to a text file. Copy that file and the downloaded installation file to your Windows machine. Run the installation file, and when prompted, enter the ID and key strings in the text file during the installation.

    1. Return to the **Windows Firewall** pane.

1. Click **Install solution**.

### Next steps tab

- See the available recommended workbooks and query samples bundled with the **Windows Firewall** data connector to get insight into your Windows Firewall log data.

- To query Windows firewall data in **Logs**, type **WindowsFirewall** in the query window.

## Validate connectivity
 
Because Windows Firewall logs are sent to Azure Sentinel only when the local log file reaches capacity, leaving the log at its default size of 4096 KB will most likely result in high collection latency. You can lower the latency by lowering the log file size. See the instructions to [configure the Windows Firewall log](/windows/security/threat-protection/windows-firewall/configure-the-windows-firewall-log). Note that while defining the minimum possible log size (1 KB) will virtually eliminate collection latency, it might also negatively impact the local machine's performance. 

## Next steps
In this document, you learned how to connect Windows firewall to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats-built-in.md).