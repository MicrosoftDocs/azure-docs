---
title: Connect Syslog data to Microsoft Sentinel
description: Connect any machine or appliance that supports Syslog to Microsoft Sentinel by using an agent on a Linux machine between the appliance and Microsoft Sentinel.
author: yelevin
ms.topic: how-to
ms.date: 06/14/2023
ms.author: yelevin
---

# Collect data from Linux-based sources using Syslog

[!INCLUDE [reference-to-feature-availability](includes/reference-to-feature-availability.md)]

**Syslog** is an event logging protocol that is common to Linux. You can use the Syslog daemon built into Linux devices and appliances to collect local events of the types you specify, and have it send those events to Microsoft Sentinel using the **Log Analytics agent for Linux** (formerly known as the OMS agent).

This article describes how to connect your data sources to Microsoft Sentinel using Syslog. For more information about supported connectors for this method, see [Data connectors reference](data-connectors-reference.md).

Learn how to [collect Syslog with the Azure Monitor Agent](../azure-monitor/agents/data-collection-syslog.md), including how to configure Syslog and create a DCR.

> [!IMPORTANT]
> The Log Analytics agent will be [retired on **31 August, 2024**](https://azure.microsoft.com/updates/were-retiring-the-log-analytics-agent-in-azure-monitor-on-31-august-2024/). If you are using the Log Analytics agent in your Microsoft Sentinel deployment, we recommend that you start planning your migration to the AMA. For more information, see [AMA migration for Microsoft Sentinel](ama-migrate.md).
>
> For information about deploying Syslog logs with the Azure Monitor Agent, review the [options for streaming logs in the CEF and Syslog format to Microsoft Sentinel](connect-cef-syslog-options.md).

## Architecture

When the Log Analytics agent is installed on your VM or appliance, the installation script configures the local Syslog daemon to forward messages to the agent on UDP port 25224. After receiving the messages, the agent sends them to your Log Analytics workspace over HTTPS, where they are ingested into the Syslog table in **Microsoft Sentinel > Logs**.

For more information, see [Syslog data sources in Azure Monitor](../azure-monitor/agents/data-sources-syslog.md).

:::image type="content" source="media/connect-syslog/syslog-diagram.png" alt-text="This diagram shows the data flow from syslog sources to the Microsoft Sentinel workspace, where the Log Analytics agent is installed directly on the data source device.":::

For some device types that don't allow local installation of the Log Analytics agent, the agent can be installed instead on a dedicated Linux-based log forwarder. The originating device must be configured to send Syslog events to the Syslog daemon on this forwarder instead of the local daemon. The Syslog daemon on the forwarder sends events to the Log Analytics agent over UDP. If this Linux forwarder is expected to collect a high volume of Syslog events, its Syslog daemon sends events to the agent over TCP instead. In either case, the agent then sends the events from there to your Log Analytics workspace in Microsoft Sentinel.

:::image type="content" source="media/connect-syslog/syslog-forwarder-diagram.png" alt-text="This diagram shows the data flow from syslog sources to the Microsoft Sentinel workspace, where the Log Analytics agent is installed on a separate log-forwarding device.":::

> [!NOTE]
> - If your appliance supports **Common Event Format (CEF) over Syslog**, a more complete data set is collected, and the data is parsed at collection. You should choose this option and follow the instructions in [Get CEF-formatted logs from your device or appliance into Microsoft Sentinel](connect-common-event-format.md).
>
> - Log Analytics supports collection of messages sent by the **rsyslog** or **syslog-ng** daemons, where rsyslog is the default. The default syslog daemon on version 5 of Red Hat Enterprise Linux (RHEL), CentOS, and Oracle Linux version (**sysklog**) is *not supported* for syslog event collection. To collect syslog data from this version of these distributions, the rsyslog daemon should be installed and configured to replace sysklog.

There are three steps to configuring Syslog collection:

- **Configure your Linux device or appliance**. This refers to the device on which the Log Analytics agent will be installed, whether it is the same device that originates the events or a log collector that will forward them.

- **Configure your application's logging settings** corresponding to the location of the Syslog daemon that will be sending events to the agent.

- **Configure the Log Analytics agent itself**. This is done from within Microsoft Sentinel, and the configuration is sent to all installed agents.

## Prerequisites

Before you begin, install the solution for **Syslog** from the **Content Hub** in Microsoft Sentinel. For more information, see [Discover and manage Microsoft Sentinel out-of-the-box content](sentinel-solutions-deploy.md).

## Configure your Linux machine or appliance

1. From the Microsoft Sentinel navigation menu, select **Data connectors**.

1. From the connectors gallery, select **Syslog** and then select **Open connector page**.

    If your device type is listed in the Microsoft Sentinel **Data connectors gallery**, choose the connector for your device instead of the generic Syslog connector. If there are extra or special instructions for your device type, you will see them, along with custom content like workbooks and analytics rule templates, on the connector page for your device.

1. Install the Linux agent. Under **Choose where to install the agent:**

    |Machine type  |Instructions  |
    |---------|---------|
    |**For an Azure Linux VM**     |    1. Expand **Install agent on Azure Linux virtual machine**. <br><br>2. Select the **Download & install agent for Azure Linux Virtual machines >** link.<br><br>3. In the **Virtual machines** blade, select a virtual machine to install the agent on, and then select **Connect**. Repeat this step for each VM you wish to connect.     |
    |**For any other Linux machine**     |     1. Expand **Install agent on a non-Azure Linux Machine** <br><br>2. Select the **Download & install agent for non-Azure Linux machines >** link.<br><br>3. In the **Agents management** blade, select the **Linux servers** tab, then copy the command for **Download and onboard agent for Linux** and run it on your Linux machine.<br><br>        If you want to keep a local copy of the Linux agent installation file, select the **Download Linux Agent** link above the "Download and onboard agent" command. |


   > [!NOTE]
   > Make sure you configure security settings for these devices according to your organization's security policy. For example, you can configure the network settings to align with your organization's network security policy, and change the ports and protocols in the daemon to align with the security requirements.

### Using the same machine to forward both plain Syslog *and* CEF messages

You can use your existing [CEF log forwarder machine](connect-log-forwarder.md) to collect and forward logs from plain Syslog sources as well. However, you must perform the following steps to avoid sending events in both formats to Microsoft Sentinel, as that will result in duplication of events.

Having already set up [data collection from your CEF sources](connect-common-event-format.md), and having configured the Log Analytics agent:

1. On each machine that sends logs in CEF format, you must edit the Syslog configuration file to remove the facilities that are being used to send CEF messages. This way, the facilities that are sent in CEF won't also be sent in Syslog. See [Configure Syslog on Linux agent](../azure-monitor/agents/data-sources-syslog.md#configure-syslog-on-linux-agent) for detailed instructions on how to do this.

1. You must run the following command on those machines to disable the synchronization of the agent with the Syslog configuration in Microsoft Sentinel. This ensures that the configuration change you made in the previous step does not get overwritten.

    ```bash
    sudo -u omsagent python /opt/microsoft/omsconfig/Scripts/OMS_MetaConfigHelper.py --disable
    ```

## Configure your device's logging settings

Many device types have their own data connectors appearing in the **Data connectors** gallery. Some of these connectors require special additional instructions to properly set up log collection in Microsoft Sentinel. These instructions can include the implementation of a parser based on a Kusto function.

All connectors listed in the gallery will display any specific instructions on their respective connector pages in the portal, as well as in their sections of the [Microsoft Sentinel data connectors reference](data-connectors-reference.md) page.

If the instructions on your data connector's page in Microsoft Sentinel indicate that the Kusto functions are deployed as [Advanced Security Information Model (ASIM)](normalization.md) parsers, make sure that you have the ASIM parsers deployed to your workspace.

Use the link in the data connector page to deploy your parsers, or follow the instructions from the [Microsoft Sentinel GitHub repository](https://github.com/Azure/Azure-Sentinel/tree/master/ASIM).

For more information, see [Advanced Security Information Model (ASIM) parsers](normalization-parsers-overview.md).

## Configure the Log Analytics agent

1. At the bottom of the Syslog connector blade, select the **Open your workspace agents configuration >** link.

1. In the **Legacy agents management** page, add the facilities for the connector to collect. Select **Add facility** and choose from the drop-down list of facilities.

    - Add the facilities that your syslog appliance includes in its log headers.

    - If you want to use anomalous SSH login detection with the data that you collect, add **auth** and **authpriv**. See the [following section](#configure-the-syslog-connector-for-anomalous-ssh-login-detection) for additional details.

1. When you have added all the facilities that you want to monitor, clear the check boxes for any severities you don't want to collect. By default they are all marked.

1. Select **Apply**.

1. On your VM or appliance, make sure you're sending the facilities that you specified.

## Find your data

1. To query the syslog log data in **Logs**, type `Syslog` in the query window.

    (Some connectors using the Syslog mechanism might store their data in tables other than `Syslog`. Consult your connector's section in the [Microsoft Sentinel data connectors reference](data-connectors-reference.md) page.)

1. You can use the query parameters described in [Using functions in Azure Monitor log queries](../azure-monitor/logs/functions.md) to parse your Syslog messages. You can then save the query as a new Log Analytics function and use it as a new data type.

### Configure the Syslog connector for anomalous SSH login detection

> [!IMPORTANT]
> Anomalous SSH login detection is currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

Microsoft Sentinel can apply machine learning (ML) to the syslog data to identify anomalous Secure Shell (SSH) login activity. Scenarios include:

- Impossible travel – when two successful login events occur from two locations that are impossible to reach within the timeframe of the two login events.

- Unexpected location – the location from where a successful login event occurred is suspicious. For example, the location has not been seen recently.
 
This detection requires a specific configuration of the Syslog data connector: 

1. For step 2 under [Configure the Log Analytics agent](#configure-the-log-analytics-agent) above, make sure that both **auth** and **authpriv** are selected as facilities to monitor, and that all the severities are selected. 

2. Allow sufficient time for syslog information to be collected. Then, navigate to **Microsoft Sentinel - Logs**, and copy and paste the following query:
    
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

## Next steps
In this document, you learned how to connect Syslog on-premises appliances to Microsoft Sentinel. To learn more about Microsoft Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](get-visibility.md).
- Get started [detecting threats with Microsoft Sentinel](detect-threats-built-in.md).
- [Use workbooks](monitor-your-data.md) to monitor your data.
