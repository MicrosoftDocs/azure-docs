---
title: Connect Syslog data to Azure Sentinel Preview| Microsoft Docs
description: Learn how to connect Syslog data to Azure Sentinel.
services: sentinel
documentationcenter: na
author: rkarlin
manager: barbkess
editor: ''

ms.assetid: 5dd59729-c623-4cb4-b326-bb847c8f094b
ms.service: sentinel
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 04/07/2019
ms.author: rkarlin

---
# Connect your external solution using Syslog

> [!IMPORTANT]
> Azure Sentinel is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

You can connect any on-premises appliance that supports Syslog to Azure Sentinel. This is done by using an agent based on a Linux machine between the appliance and Azure Sentinel. If your Linux machine is in Azure, you can stream the logs from your appliance or application to a dedicated workspace you create in Azure and connect it. If your Linux machine is not in Azure, you can stream the logs from your appliance to a dedicated on premises VM or machine onto which you install the Agent for Linux. 

> [!NOTE]
> If your appliance supports Syslog CEF, the connection is more complete and you should choose this option and follow the instructions in [Connecting data from CEF](connect-common-event-format.md).

## How it works

Syslog connection is accomplished using an agent for Linux. By default, the agent for Linux receives events from the Syslog daemon over UDP, but in cases where a Linux machine is expected to collect a high volume of Syslog events, such as when a Linux agent is receiving events from other devices, the configuration is modified to use TCP transport between the Syslog daemon and the agent.

## Connect your Syslog appliance

1. In the Azure Sentinel portal, select **Data connectors** and choose the **Syslog** tile.
2. If your Linux machine is not within Azure, download and install the Azure Sentinel **Agent for Linux** on your appliance. 
1. If you are working in Azure, select or create a VM that within the Azure Sentinel workspace that is dedicated to receiving Syslog messages. Select the VM in Azure Sentinel Workspaces and click **Connect** at the top of the left pane.
3. Click **Configure the logs to be connected** back in the Syslog connector setup. 
4. Click **Press here to open the configuration blade**.
1. Select **Data** and then **Syslog**.
   - Make sure each facility that you're sending by Syslog is in the table. For each facility you are going to monitor, set a severity. Click **Apply**.
1. In your Syslog machine, make sure you're sending those facilities. 

3. To use the relevant schema in Log Analytics for the Syslog logs, search for **Syslog**.




## Next steps
In this document, you learned how to connect Syslog on-premises appliances to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats.md).
