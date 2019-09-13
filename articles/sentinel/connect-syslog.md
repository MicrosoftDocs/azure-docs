---
title: Connect Syslog data to Azure Sentinel | Microsoft Docs
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
ms.date: 09/24/2019
ms.author: rkarlin

---
# Connect your external solution using Syslog

You can connect any on-premises appliance that supports Syslog to Azure Sentinel. This is done by using an agent based on a Linux machine between the appliance and Azure Sentinel. If your Linux machine is in Azure, you can stream the logs from your appliance or application to a dedicated workspace you create in Azure and connect it. If your Linux machine is not in Azure, you can stream the logs from your appliance to a dedicated on premises VM or machine onto which you install the Agent for Linux. 

> [!NOTE]
> If your appliance supports Syslog CEF, the connection is more complete and you should choose this option and follow the instructions in [Connecting data from CEF](connect-common-event-format.md).

## How it works

Syslog is an event logging protocol that is common to Linux. Applications will send messages that may be stored on the local machine or delivered to a Syslog collector. When the Log Analytics agent for Linux is installed, it configures the local Syslog daemon to forward messages to the agent. The agent then sends the message to Azure Monitor where a corresponding record is created.

For more information, see [Syslog data sources in Azure Monitor](../azure-monitor/platform/data-sources-syslog.md).

> [!NOTE]
> The agent can collect logs from multiple sources, but must be installed on dedicated proxy machine.

## Connect your Syslog appliance

1. In the Azure Sentinel portal, select **Data connectors** and select the **Syslog** line in the table and in the Syslog pane to the right, click **Open connector page**.
2. If your Linux machine is within Azure, select **Download and install agent on Azure Linux virtual machine**. In the Virtual machines window, select the machines on which you want to install the agent and click **Connect** at the top.
1. If your Linux machine not within Azure, select **Download and install agent on Linux non-Azure machine**. In the **Direct agent** window, copy the command under **Download and onboard agent for Linux** and run it on your machine. 
   > [!NOTE]
   > Make sure to configure the machine's security according to your organization's security policy. For example, you can configure your network to align with your corporate network security policy and change the ports and protocols in the daemon to align with your requirements. 

1. Under **Configure the logs to be connected** in the Syslog connector setup window, follow the instructions:
    1. Click the link to **Open your workspace advanced settings configuration**. 
    1. Select **Data**, followed by **Syslog**.
    1. Then, in the table set which facilities you want Syslog to collect. You should either add or select the facilities that your Syslog appliance includes in its log headers. You can see this configuration in your Syslog appliance in Syslog-d in the folder: /etc/rsyslog.d/security-config-omsagent.conf, and in r-Syslog under /etc/syslog-ng/security-config-omsagent.conf.
        
        If you want to use anomalous SSH login detection with the data that you collect, specify both **auth** and **authpriv**. See the [following section](#configure-the-syslog-connector-for-anomalous-ssh-login-detection) for additional details.
        
       > [!NOTE]
       > If you select the checkbox to **Apply below configuration to my machines**, then this configuration will apply to all the Linux machines connected to this workspace. You can see this configuration in your Syslog machine under 
1. Click **Press here to open the configuration blade**.
1. Select **Data** and then **Syslog**.
   - Make sure each facility that you're sending by Syslog is in the table. For each facility, you are going to monitor, set a severity. Click **Apply**.
1. In your Syslog machine, make sure you're sending those facilities. 

1. To use the relevant schema in Log Analytics for the Syslog logs, search for **Syslog**.
1. You can use the Kusto function described in [Using functions in Azure Monitor log queries](../azure-monitor/log-query/functions.md) to parse your Syslog messages and then save them as a new Log Analytics function and then use the function as a new data type.

### Configure the Syslog connector for anomalous SSH login detection

> [!IMPORTANT]
> This anomalous SSH login detection is currently in public preview.
> This feature is provided without a service level agreement, and it's not recommended for production workloads.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

The syslog data that you collect can be used with machine learning (ML) to identify anomalous Secure Shell (SSH) login activity. Scenarios include:

- Impossible travel – when two successful login events occur from two locations that are impossible to reach within the timeframe of the two login events.
- Unexpected location – the location from where a successful login event occurred is suspicious. For example, the location has not been seen recently.
 
This detection requires a specific configuration of the Syslog data connector: 

1. For step 6 in the previous procedure, make sure that both **auth** and **authpriv** are selected as facilities to monitor. For example:
    
    > [!div class="mx-imgBorder"]
    > ![Facilities required for anomalous SSH login detection](./media/connect-syslog/facilities-ssh-detection.png)

2. Allow sufficient time for syslog information to be collected. Then, navigate to **Azure Sentinel - Logs**, and copy and paste the following query:
    
    	Syslog |  where Facility in ("authpriv","auth")| extend c = extract( "Accepted\\s(publickey|password|keyboard-interactive/pam)\\sfor ([^\\s]+)",1,SyslogMessage)| where isnotempty(c) | count 
    
    Change the **Time range** if required, and select **Run**.
    
    If the resulting count is zero, confirm the configuration of the connector and that the monitored computers do have successful login activity for the time period you specified for your query.
    
    If the resulting count is greater than zero, your syslog data is suitable for anomalous SSH login detection. You enable this detection from **Analytics** >  **Rule templates** > **(Preview) Anomalous SSH Login Detection**.

## Next steps
In this document, you learned how to connect Syslog on-premises appliances to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats.md).
