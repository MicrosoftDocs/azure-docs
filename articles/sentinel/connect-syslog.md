---
title: Connect Syslog data to Azure Sentinel Preview| Microsoft Docs
description: Learn how to connect Syslog data to Azure Sentinel.
services: sentinel
documentationcenter: na
author: rkarlin
manager: rkarlin
editor: ''

ms.assetid: 5dd59729-c623-4cb4-b326-bb847c8f094b
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 07/10/2019
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

Syslog is an event logging protocol that is common to Linux. Applications will send messages that may be stored on the local machine or delivered to a Syslog collector. When the Log Analytics agent for Linux is installed, it configures the local Syslog daemon to forward messages to the agent. The agent then sends the message to Azure Monitor where a corresponding record is created.

For more information see [Syslog data sources in Azure Monitor](../azure-monitor/platform/data-sources-syslog.md).

> [!NOTE]
> The agent can collect logs from multiple sources, but must be installed on dedicated proxy machine.

## Connect your Syslog appliance

1. In the Azure Sentinel portal, select **Data connectors** and select the **Syslog** line in the table and in the Syslog pane to the right, click **Open connector page**.
2. If your Linux machine is within Azure, select **Download and install agent on Azure Linux virtual machine**. In the Virtual machines window, select the machines on which you want to install the agent and click **Connect** at the top.
1. If your Linux machine not within Azure, select **Download and install agent on Linux non-Azure machine**. In the **Direct agent** window, copy the command under **Download and onboard agent for Linux** and run it on your machine. 
1. Under **Configure the logs to be connected** in the Syslog connector setup window, follow the instructions:
    1. Click the link to **Open your workspace advanced settings configuration**. 
    1. Select **Data**, followed by **Syslog**.
    1. Then, in the table set which facilities you want Syslog to collect. You should either add or select the facilities that your Syslog appliance includes in its log headers. You can see this configuration in your Syslog appliance in Syslog-d in the folder: /etc/rsyslog.d/security-config-omsagent.conf, and in r-Syslog under /etc/syslog-ng/security-config-omsagent.conf. 
       > [!NOTE]
       > If you select the checkbox to **Apply below configuration to my machines**, then this configuration will apply to all the Linux machines connected to this workspace. You can see this configuration in your Syslog machine under 
1. Click **Press here to open the configuration blade**.
1. Select **Data** and then **Syslog**.
   - Make sure each facility that you're sending by Syslog is in the table. For each facility you are going to monitor, set a severity. Click **Apply**.
1. In your Syslog machine, make sure you're sending those facilities. 

1. To use the relevant schema in Log Analytics for the Syslog logs, search for **Syslog**.
1. You can use the Kusto function described in [Using functions in Azure Monitor log queries](../azure-monitor/log-query/functions.md) to parse your Syslog messages and then save them as a new Log Analytics function and then use the function as a new data type.




## Next steps
In this document, you learned how to connect Syslog on-premises appliances to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats.md).
