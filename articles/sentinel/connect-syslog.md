---
title: Connect Syslog data to Azure Sentinel | Microsoft Docs
description: Connect any machine or appliance that supports Syslog to Azure Sentinel by using an agent on a Linux machine between the appliance and Azure Sentinel.
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
ms.date: 07/21/2021
ms.author: yelevin

---
# Collect data from Linux-based sources using Syslog

[!INCLUDE [reference-to-feature-availability](includes/reference-to-feature-availability.md)]

You can stream events from Linux-based, Syslog-supporting machines or appliances into Azure Sentinel, using the Log Analytics agent for Linux (formerly known as the OMS agent). You can do this for any machine that allows for you to install the Log Analytics agent directly on the machine. The machine's native Syslog daemon will collect local events of the specified types, and forward them locally to the agent, which will stream them to your Log Analytics workspace.

> [!NOTE]
> - If your appliance supports **Common Event Format (CEF) over Syslog**, a more complete data set is collected, and the data is parsed at collection. You should choose this option and follow the instructions in [Connect your external solution using CEF](connect-common-event-format.md).
>
> - Log Analytics supports collection of messages sent by the **rsyslog** or **syslog-ng** daemons, where rsyslog is the default. The default syslog daemon on version 5 of Red Hat Enterprise Linux (RHEL), CentOS, and Oracle Linux version (**sysklog**) is not supported for syslog event collection. To collect syslog data from this version of these distributions, the rsyslog daemon should be installed and configured to replace sysklog.

## How it works

**Syslog** is an event logging protocol that is common to Linux. When the **Log Analytics agent for Linux** is installed on your VM or appliance, the installation routine configures the local Syslog daemon to forward messages to the agent on TCP port 25224. The agent then sends the message to your Log Analytics workspace over HTTPS, where it is parsed into an event log entry in the Syslog table in **Azure Sentinel > Logs**.

For more information, see [Syslog data sources in Azure Monitor](../azure-monitor/agents/data-sources-syslog.md).

## Configure Syslog collection

### Configure your Linux machine or appliance

1. In Azure Sentinel, select **Data connectors** and then select the **Syslog** connector.

1. On the **Syslog** blade, select **Open connector page**.

1. Install the Linux agent. Under **Choose where to install the agent:**

    **For an Azure Linux VM:**

    1. Select **Install agent on Azure Linux virtual machine**.

    1. Click the **Download & install agent for Azure Linux Virtual machines >** link.

    1. In the **Virtual machines** blade, click a virtual machine to install the agent on, and then click **Connect**. Repeat this step for each VM you wish to connect.

    **For any other Linux machine:**

    1. Select **Install agent on a non-Azure Linux Machine**

    1. Click the **Download & install agent for non-Azure Linux machines >** link.

    1. In the **Agents management** blade, click the **Linux servers** tab, then copy the command for **Download and onboard agent for Linux** and run it on your Linux machine.

   > [!NOTE]
   > Make sure you configure security settings for these computers according to your organization's security policy. For example, you can configure the network settings to align with your organization's network security policy, and change the ports and protocols in the daemon to align with the security requirements.

### Configure the Log Analytics agent

1. At the bottom of the Syslog connector blade, click the **Open your workspace agents configuration >** link.

1. On the **Agents configuration** blade, select the **Syslog** tab. Then add the facilities for the connector to collect. Select **Add facility** and choose from the drop-down list of facilities.

    - Add the facilities that your syslog appliance includes in its log headers.

    - If you want to use anomalous SSH login detection with the data that you collect, add **auth** and **authpriv**. See the [following section](#configure-the-syslog-connector-for-anomalous-ssh-login-detection) for additional details.

1. When you have added all the facilities that you want to monitor, verify that the check boxes for all the desired severities are marked.

1. Select **Apply**.

1. On your VM or appliance, make sure you're sending the facilities that you specified.

1. To query the syslog log data in **Logs**, type `Syslog` in the query window.

1. You can use the query parameters described in [Using functions in Azure Monitor log queries](../azure-monitor/logs/functions.md) to parse your Syslog messages. You can then save the query as a new Log Analytics function and use it as a new data type.

> [!NOTE]
> **Using the same machine to forward both plain Syslog *and* CEF messages**
>
> You can use your existing [CEF log forwarder machine](connect-cef-agent.md) to collect and forward logs from plain Syslog sources as well. However, you must perform the following steps to avoid sending events in both formats to Azure Sentinel, as that will result in duplication of events.
>
>    Having already set up [data collection from your CEF sources](connect-common-event-format.md), and having configured the Log Analytics agent as above:
>
> 1. On each machine that sends logs in CEF format, you must edit the Syslog configuration file to remove the facilities that are being used to send CEF messages. This way, the facilities that are sent in CEF won't also be sent in Syslog. See [Configure Syslog on Linux agent](../azure-monitor/agents/data-sources-syslog.md#configure-syslog-on-linux-agent) for detailed instructions on how to do this.
>
> 1. You must run the following command on those machines to disable the synchronization of the agent with the Syslog configuration in Azure Sentinel. This ensures that the configuration change you made in the previous step does not get overwritten.<br>
> `sudo su omsagent -c 'python /opt/microsoft/omsconfig/Scripts/OMS_MetaConfigHelper.py --disable'`

### Configure the Syslog connector for anomalous SSH login detection

> [!IMPORTANT]
> Anomalous SSH login detection is currently in public preview.
> This feature is provided without a service level agreement, and it's not recommended for production workloads.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Azure Sentinel can apply machine learning (ML) to the syslog data to identify anomalous Secure Shell (SSH) login activity. Scenarios include:

- Impossible travel – when two successful login events occur from two locations that are impossible to reach within the timeframe of the two login events.
- Unexpected location – the location from where a successful login event occurred is suspicious. For example, the location has not been seen recently.

This detection requires a specific configuration of the Syslog data connector:

1. For step 2 under [Configure the Log Analytics agent](#configure-the-log-analytics-agent) above, make sure that both **auth** and **authpriv** are selected as facilities to monitor, and that all the severities are selected.

2. Allow sufficient time for syslog information to be collected. Then, navigate to **Azure Sentinel - Logs**, and copy and paste the following query:

    ```kusto
    Syslog
    | where Facility in ("authpriv","auth")
    | extend c = extract( "Accepted\\s(publickey|password|keyboard-interactive/pam)\\sfor ([^\\s]+)",1,SyslogMessage)
    | where isnotempty(c)
    | count
    ```

    Change the **Time range** if required, and select **Run**.

    If the resulting count is zero, confirm the configuration of the connector and that the monitored computers do have successful login activity for the time period you specified for your query.

    If the resulting count is greater than zero, your syslog data is suitable for anomalous SSH login detection. You enable this detection from **Analytics** >  **Rule templates** > **(Preview) Anomalous SSH Login Detection**.

## Troubleshooting

Azure Virtual Machine as a Syslog Collector
Azure Security Center auto-provisioning settings in the subscription should not be enabled for auto-provisioning of the MMA/OMS agent during this configuration, it can be reenabled after the install and setup is complete.
The Virtual Machine is not connected to an existing workspace before deploying the Common Event Format Data Connector python script.
Sentinel has the selected workspace with the SecurityInsights solution installed.
sudo wget -O cef_installer.py https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/DataConnectors/CEF/cef_installer.py&&sudo python cef_installer.py <WorkspaceId> <Primary Key>

The Virtual machine should be sized with a minimum of 4 Virtual Cores and 8 gigabytes of memory (allows 8500 EPS)

Enable Syslog Facility and Log severity collection
The rsyslog server will forward syslog data that is defined in the /etc/rsyslod.d/95.omsagent.conf files which is populated automatically from the settings in the Log Analytics Workspace - Agent Configuration - Syslog. You will need to add the facilities and Severity Log levels to be ingested. This process of settings and populated the file takes around 20 minutes. You can find more information our syslog documentation .

To review the changes you can display the current settings in your VM

cat /etc/rsyslog.d/95-omsagent.conf

OMS Syslog collection for workspace c69fa733-da2e-4cf9-8d92-eee3bd23fe81
auth.=alert;auth.=crit;auth.=debug;auth.=emerg;auth.=err;auth.=info;auth.=notice;auth.=warning  @127.0.0.1:25224
authpriv.=alert;authpriv.=crit;authpriv.=debug;authpriv.=emerg;authpriv.=err;authpriv.=info;authpriv.=notice;authpriv.=warning  @127.0.0.1:25224
cron.=alert;cron.=crit;cron.=debug;cron.=emerg;cron.=err;cron.=info;cron.=notice;cron.=warning  @127.0.0.1:25224
local0.=alert;local0.=crit;local0.=debug;local0.=emerg;local0.=err;local0.=info;local0.=notice;local0.=warning  @127.0.0.1:25224
local4.=alert;local4.=crit;local4.=debug;local4.=emerg;local4.=err;local4.=info;local4.=notice;local4.=warning  @127.0.0.1:25224
syslog.=alert;syslog.=crit;syslog.=debug;syslog.=emerg;syslog.=err;syslog.=info;syslog.=notice;syslog.=warning  @127.0.0.1:25224

## Next steps
In this document, you learned how to connect Syslog on-premises appliances to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats-built-in.md).
- [Use workbooks](tutorial-monitor-your-data.md) to monitor your data.

If your CEF data connector is not working as expected, try the troubleshooting solutions listed in [Troubleshoot a CEF or Syslog data connector](cef-syslog-troubleshooting.md).
