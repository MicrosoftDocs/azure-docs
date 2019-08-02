---
title: Connect Windows firewall data to Azure Sentinel Preview| Microsoft Docs
description: Learn how to connect Windows firewall data to Azure Sentinel.
services: sentinel
documentationcenter: na
author: rkarlin
manager: rkarlin
editor: ''

ms.assetid: 0e41f896-8521-49b8-a244-71c78d469bc3
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 06/17/2019
ms.author: rkarlin

---
# Connect Windows firewall

> [!IMPORTANT]
> Azure Sentinel is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

The Windows firewall connector allows you to easily connect your Windows firewalls logs, if they are connected to your Azure Sentinel workspace. This connection enables you to view dashboards, create custom alerts, and improve investigation. This gives you more insight into your organization’s network and improves your security operation capabilities. The solution collects Windows firewall events from the Windows machines on which a Log Analytics agent is installed. 


> [!NOTE]
> Data will be stored in the geographic location of the workspace on which you are running Azure Sentinel.

## Enable the connector 

1. In the Azure Sentinel portal, select **Data connectors** and then click on the **Windows firewall** tile. 
1.  If your Windows machines are in Azure:
    1. Click **Install agent on Azure Windows virtual machine**.
    1. In the **Virtual machines** list, select the Windows machine you want to stream into Azure Sentinel. Make sure this is a Windows VM.
    1. In the window that opens for that VM, click **Connect**.  
    1. Click **Enable** in the **Windows firewall connector** window. 

2. If your Windows machine is not an Azure VM:
    1. Click **Install agent on non-Azure machines**.
    1. In the **Direct agent** window, select either **Download Windows agent (64 bit)** or **Download Windows agent (32 bit)**.
    1. Install the agent on your Windows machine. Copy the **Workspace ID**, **Primary key**, and **Secondary key** and use them when prompted during the installation.

4. Select which data types you want to stream.
5. Click **Install solution**.
6. To use the relevant schema in Log Analytics for the Windows firewall, search for **SecurityEvent**.

## Validate connectivity

It may take upwards of 20 minutes until your logs start to appear in Log Analytics. 



## Next steps
In this document, you learned how to connect Windows firewall to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats.md).

