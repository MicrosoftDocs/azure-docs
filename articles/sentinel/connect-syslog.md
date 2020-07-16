---
title: Connect Syslog data to Azure Sentinel | Microsoft Docs
description: Connect any machine or appliance that supports Syslog to Azure Sentinel by using an agent on a Linux machine between the appliance and Sentinel. 
services: sentinel
documentationcenter: na
author: yelevin
manager: rkarlin
editor: ''

ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 07/17/2020
ms.author: yelevin

---
# Collect data from Linux-based sources using Syslog

You can stream events from any Linux-based, Syslog-supporting machine or appliance into Azure Sentinel, using the Log Analytics agent for Linux (formerly known as the OMS agent). There are two ways to use this solution:

- For Linux-based VMs, whether on-premises or in the cloud, you can install the Log Analytics agent directly on the VM and have it stream the events directly to your Azure Sentinel workspace.

- For external appliances or networking equipment, you should install the agent onto a dedicated Syslog-based log collector VM. The syslog daemon will collect the events from the appliances and forward them locally to the agent, which will stream them to your workspace.

> [!NOTE]
> If your appliance supports **Common Event Format (CEF) over Syslog**, a more complete data set is collected, and the data is parsed at collection. You should choose this option and follow the instructions in [Connect your external solution using CEF](connect-common-event-format.md).

## How it works

Syslog is an event logging protocol that is common to Linux. When the Log Analytics agent for Linux is installed, whether on the Linux VM originating the events or on a log collector VM, the installation routine configures the local Syslog daemon to forward messages to the agent. The agent then sends the message to your Log Analytics workspace where it is parsed into an Azure Sentinel event log entry.

For more information, see [Syslog data sources in Azure Monitor](../azure-monitor/platform/data-sources-syslog.md).

> [!NOTE]
>
> - The Log Analytics agent can stream logs from multiple sources, but to do so, it must be installed on a dedicated collector machine. A single collector machine can collect from several sources.
>
> - If you want to collect data from both CEF and Syslog sources on the same VM, perform the following steps to avoid sending duplicate events to Azure Sentinel:
>
>    1.	Follow the instructions to [collect data from your CEF sources](connect-common-event-format.md).
>
>    2.	To collect the Syslog data, go to **Settings** > **Workspace settings** > **Advanced settings** > **Data** > **Syslog** and set the facilities and their severities so that they are not the same facilities and severities you used in your CEF configuration. <br></br>If you select **Apply below configuration to my machines**, it applies these settings to all VMs connected to this workspace.

## Configure your Linux machine

1. In Azure Sentinel, select **Data connectors** and then select the **Syslog** connector.

2. On the **Syslog** blade, select **Open connector page**.

3. Install the Linux agent. Under **Choose where to install the agent:**
    
    **If your Linux virtual machine is in Azure**
      
    1. Select **Install agent on Azure Linux virtual machine**.
    
    1. Click the **Download & install agent for Azure Linux Virtual machines >** link. 
    
    1. In the **Virtual machines** blade, click a virtual machine to install the agent on, and then click **Connect**. Repeat this step for each VM you wish to connect.
    
    **If your Linux machine isn't in Azure**

    1. Select **Install agent on a non-Azure Linux Machine**

    1. Click the **Download & install agent for non-Azure Linux machines >** link. 

    1. In the **Agents management** blade, click the **Linux servers** tab, then copy the command for **Download and onboard agent for Linux** and run it on your Linux machine. 
    
   > [!NOTE]
   > Make sure you configure security settings for these computers according to your organization's security policy. For example, you can configure the network settings to align with your organization's network security policy, and change the ports and protocols in the daemon to align with the security requirements.

4. Select **Open your workspace advanced settings configuration**.

5. On the **Advanced settings** blade, select **Data** > **Syslog**. Then add the facilities for the connector to collect.
    
    Add the facilities that your syslog appliance includes in its log headers. 
    
    If you want to use anomalous SSH login detection with the data that you collect, add **auth** and **authpriv**. See the [following section](#configure-the-syslog-connector-for-anomalous-ssh-login-detection) for additional details.

6. When you have added all the facilities that you want to monitor, and adjusted any severity options for each one, select the checkbox **Apply below configuration to my machines**.

7. Select **Save**. 

8. On your VM or appliance, make sure you're sending the facilities that you specified.

9. To query the syslog log data in **Logs**, type `Syslog` in the query window.

10. You can use the query parameters described in [Using functions in Azure Monitor log queries](../azure-monitor/log-query/functions.md) to parse your Syslog messages. You can then save the query as a new Log Analytics function and use it as a new data type.

### Configure the Syslog connector for anomalous SSH login detection

> [!IMPORTANT]
> Anomalous SSH login detection is currently in public preview.
> This feature is provided without a service level agreement, and it's not recommended for production workloads.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Azure Sentinel can apply machine learning (ML) to the syslog data to identify anomalous Secure Shell (SSH) login activity. Scenarios include:

- Impossible travel – when two successful login events occur from two locations that are impossible to reach within the timeframe of the two login events.
- Unexpected location – the location from where a successful login event occurred is suspicious. For example, the location has not been seen recently.
 
This detection requires a specific configuration of the Syslog data connector: 

1. For step 5 in the previous procedure, make sure that both **auth** and **authpriv** are selected as facilities to monitor. Keep the default settings for the severity options, so that they are all selected. For example:
    
    > [!div class="mx-imgBorder"]
    > ![Facilities required for anomalous SSH login detection](./media/connect-syslog/facilities-ssh-detection.png)

2. Allow sufficient time for syslog information to be collected. Then, navigate to **Azure Sentinel - Logs**, and copy and paste the following query:
    
    ```console
    Syslog |  where Facility in ("authpriv","auth")| extend c = extract( "Accepted\\s(publickey|password|keyboard-interactive/pam)\\sfor ([^\\s]+)",1,SyslogMessage)| where isnotempty(c) | count 
    ```
    
    Change the **Time range** if required, and select **Run**.
    
    If the resulting count is zero, confirm the configuration of the connector and that the monitored computers do have successful login activity for the time period you specified for your query.
    
    If the resulting count is greater than zero, your syslog data is suitable for anomalous SSH login detection. You enable this detection from **Analytics** >  **Rule templates** > **(Preview) Anomalous SSH Login Detection**.

## Next steps
In this document, you learned how to connect Syslog on-premises appliances to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats-built-in.md).
- [Use workbooks](tutorial-monitor-your-data.md) to monitor your data.

