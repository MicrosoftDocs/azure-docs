---
title: Connect DNS data in Azure Sentinel Preview| Microsoft Docs
description: Learn how to connect DNS data in Azure Sentinel.
services: sentinel
documentationcenter: na
author: rkarlin
manager: rkarlin
editor: ''

ms.assetid: 77af84f9-47bc-418e-8ce2-4414d7b58c0c
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 06/17/2019
ms.author: rkarlin

---
# Connect your domain name server

> [!IMPORTANT]
> Azure Sentinel is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

You can connect any Domain Name Server (DNS) running on Windows to Azure Sentinel. This is done by installing an agent on the DNS machine. Using DNS logs, you can gain security, performance, and operations-related insights into the DNS infrastructure of your organization by collecting, analyzing, and correlating analytic and audit logs and other related data from the DNS servers.

When you enable DNS log connection you can:
- Identify clients that try to resolve malicious domain names
- Identify stale resource records
- Identify frequently queried domain names and talkative DNS clients
- View request load on DNS servers
- View dynamic DNS registration failures

## Connected sources

The following table describes the connected sources that are supported by this solution:

| **Connected source** | **Support** | **Description** |
| --- | --- | --- |
| [Windows agents](../azure-monitor/platform/agent-windows.md) | Yes | The solution collects DNS information from Windows agents. |
| [Linux agents](../azure-monitor/learn/quick-collect-linux-computer.md) | No | The solution does not collect DNS information from direct Linux agents. |
| [System Center Operations Manager management group](../azure-monitor/platform/om-agents.md) | Yes | The solution collects DNS information from agents in a connected Operations Manager management group. A direct connection from the Operations Manager agent to Azure Monitor is not required. Data is forwarded from the management group to the Log Analytics workspace. |
| [Azure storage account](../azure-monitor/platform/collect-azure-metrics-logs.md) | No | Azure storage isn't used by the solution. |

### Data collection details

The solution collects DNS inventory and DNS event-related data from the DNS servers where a Log Analytics agent is installed. Inventory-related data, such as the number of DNS servers, zones, and resource records, is collected by running the DNS PowerShell cmdlets. The data is updated once every two days. The event-related data is collected near real time from the [analytic and audit logs](https://technet.microsoft.com/library/dn800669.aspx#enhanc) provided by enhanced DNS logging and diagnostics in Windows Server 2012 R2.


## Connect your DNS appliance

1. In the Azure Sentinel portal, select **Data connectors** and choose the **DNS** tile.
1. If your DNS machines are in Azure:
    1. Click **Install agent on Azure Windows virtual machine**.
    1. In the **Virtual machines** list, select the DNS machine you want to stream into Azure Sentinel. Make sure this is a Windows VM.
    1. In the window that opens for that VM, click **Connect**.  
    1. Click **Enable** in the **DNS connector** window. 

2. If your DNS machine is not an Azure VM:
    1. Click **Install agent on non-Azure machines**.
    1. In the **Direct agent** window, select either **Download Windows agent (64 bit)** or **Download Windows agent (32 bit)**.
    1. Install the agent on your DNS machine. Copy the **Workspace ID**, **Primary key**, and **Secondary key** and use them when prompted during the installation.

3. To use the relevant schema in Log Analytics for the DNS logs, search for **DnsEvents**.

## Validate 

In Log Analytics, search for the schema **DnsEvents** and make sure there are events.

## Next steps
In this document, you learned how to connect DNS on-premises appliances to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats.md).
