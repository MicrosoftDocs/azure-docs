---
title: Ingest Syslog and CEF messages to Microsoft Sentinel with the Azure Monitor Agent 
description: Ingest and filter Syslog messages, including those in Common Event Format (CEF), from Linux machines and from network and security devices and appliances to your Microsoft Sentinel workspace, using data connectors based on the Azure Monitor Agent (AMA).
author: yelevin
ms.author: yelevin
ms.topic: how-to
ms.custom: linux-related-content
ms.date: 02/19/2024
#Customer intent: As a security operator, I want to ingest and filter Syslog and CEF messages from Linux machines and from network and security devices and appliances to my Microsoft Sentinel workspace, so that security analysts can monitor activity on these systems and detect security threats.
---

# Ingest Syslog and CEF messages to Microsoft Sentinel with the Azure Monitor Agent

This article describes how to use the **Syslog via AMA** and **Common Event Format (CEF) via AMA** connectors to quickly filter and ingest Syslog messages, including those in Common Event Format (CEF), from Linux machines and from network and security devices and appliances.

These connectors install the Azure Monitor Agent (AMA) on any Linux machine from which you want to collect Syslog and/or CEF messages. This machine could be the originator of the messages, or it could be a forwarder that collects messages from other machines, such as network or security devices and appliances. The connector sends the agents instructions based on [Data Collection Rules (DCRs)](../azure-monitor/essentials/data-collection-rule-overview.md) that you define. DCRs specify the systems to monitor and the types of logs or messages to collect, and they define filters to apply to the messages before they're ingested, for better performance and more efficient querying and analysis.

- [Set up the connector](#set-up-the-data-connectors)
- [Learn more about the connector](#how-microsoft-sentinel-collects-syslog-and-cef-messages-with-the-azure-monitor-agent)
- [Learn more about Data Collection Rules](../azure-monitor/essentials/data-collection-rule-overview.md)

> [!IMPORTANT]
>
> On **February 28th 2023**, we introduced changes to the CommonSecurityLog table schema. Following these changes, you might need to review and update custom queries. For more details, see the **"Recommended actions"** section in [this blog post](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/upcoming-changes-to-the-commonsecuritylog-table/ba-p/3643232). Out-of-the-box content (detections, hunting queries, workbooks, parsers, etc.) has been updated by Microsoft Sentinel.   

## Overview 

Syslog and CEF are two common formats for logging data from different devices and applications. They help system administrators and security analysts to monitor and troubleshoot the network and identify potential threats or incidents.

### What is Syslog?

Syslog is a standard protocol for sending and receiving messages between different devices or applications over a network. It was originally developed for Unix systems, but it is now widely supported by various platforms and vendors. Syslog messages have a predefined structure that consists of a priority, a timestamp, a hostname, an application name, a process ID, and a message text. Syslog messages can be sent over UDP, TCP, or TLS, depending on the configuration and the security requirements.

### What is Common Event Format (CEF)?

CEF, or Common Event Format, is a vendor-neutral format for logging data from network and security devices and appliances, such as firewalls, routers, detection and response solutions, and intrusion detection systems, as well as from other kinds of systems such as web servers. An extension of Syslog, it was developed especially for security information and event management (SIEM) solutions. CEF messages have a standard header that contains information such as the device vendor, the device product, the device version, the event class, the event severity, and the event ID. CEF messages also have a variable number of extensions that provide additional details about the event, such as the source and destination IP addresses, the username, the file name, or the action taken.

### How Microsoft Sentinel collects Syslog and CEF messages with the Azure Monitor Agent

The following diagrams illustrate the architecture of Syslog and CEF message collection in Microsoft Sentinel, using the **Syslog via AMA** and **Common Event Format (CEF) via AMA** connectors.

# [Single machine (Syslog)](#tab/single)

This diagram shows Syslog messages being collected from a single individual Linux virtual machine, on which the Azure Monitor Agent (AMA) is installed.

:::image type="content" source="media/connect-cef-ama/syslog-diagram.png" alt-text="Diagram of Syslog collection from single source.":::

The data ingestion process using the Azure Monitor Agent uses the following components and data flows:

- **Log sources:** These are your various Linux VMs in your environment that produce Syslog messages. These messages are collected by the local Syslog daemon on TCP or UDP port 514 (or another port per your preference).

- The local **Syslog daemon** (either `rsyslog` or `syslog-ng`) collects the log messages on TCP or UDP port 514 (or another port per your preference). The daemon then sends these logs to the **Azure Monitor Agent** (see note below).

- The **Azure Monitor Agent** that you install on each Linux VM you want to collect Syslog messages from, by [setting up the data connector according to the instructions below](?tabs=single%2Csyslog%2Cportal#set-up-the-syslog-via-ama-connector). The agent parses the logs and then sends them to your **Microsoft Sentinel (Log Analytics) workspace**.

- Your **Microsoft Sentinel (Log Analytics) workspace:** Syslog messages sent here end up in the *Syslog* table, where you can query the logs and perform analytics on them to detect and respond to security threats.

# [Log forwarder (Syslog/CEF)](#tab/forwarder)

This diagram shows Syslog and CEF messages being collected from a Linux-based log forwarding machine on which the Azure Monitor Agent (AMA) is installed. This log forwarder collects Syslog and CEF messages from their originating machines, devices, or appliances.

:::image type="content" source="media/connect-cef-ama/cef-forwarder-diagram.png" alt-text="Diagram of Syslog and CEF collection from a log forwarder." lightbox="media/connect-cef-ama/cef-forwarder-diagram.png":::

The data ingestion process using the Azure Monitor Agent uses the following components and data flows:

- **Log sources:** These are your various security devices and appliances in your environment that produce log messages in CEF format, or in plain Syslog. These devices are [configured](#run-the-installation-script) to send their log messages over TCP or UDP port 514 (or another port per your preference), *not* to their local Syslog daemon, but instead to the **Syslog daemon on the Log forwarder**.

- **Log forwarder:** This is a dedicated Linux VM that your organization sets up to collect the log messages from your Syslog and CEF log sources. The VM can be on-premises, in Azure, or in another cloud. This log forwarder itself has two components:
    - The **Syslog daemon** (either `rsyslog` or `syslog-ng`) collects the log messages on TCP or UDP port 514 (or another port per your preference). The daemon then sends these logs to the **Azure Monitor Agent** (see note below).

    - The **Azure Monitor Agent** that you install on the log forwarder by setting up the Syslog and/or CEF data connectors according to the instructions below ([Syslog](?tabs=forwarder%2Csyslog%2Cportal#set-up-the-syslog-via-ama-connector) | [CEF](?tabs=forwarder%2Ccef%2Cportal#set-up-the-common-event-format-cef-via-ama-connector)). The agent parses the logs and then sends them to your **Microsoft Sentinel (Log Analytics) workspace**.

- Your **Microsoft Sentinel (Log Analytics) workspace:** CEF logs sent here end up in the *CommonSecurityLog* table, and Syslog messages in the *Syslog* table. There you can query the logs and perform analytics on them to detect and respond to security threats.

---

> [!NOTE]
> 
> - The Azure Monitor Agent supports Syslog RFCs 3164 and 5424.
>
> - If you want to use a port other than 514 for receiving Syslog/CEF messages, make sure that the port configuration on the Syslog daemon matches that of the application generating the messages.
>
> - The Syslog daemon sends logs to the Azure Monitor Agent in two different ways, depending on the AMA version:
>    - AMA versions **1.28.11** and above receive logs on **TCP port 28330**.
>    - Earlier versions of AMA receive logs via Unix domain socket.

## Set up the data connectors

# [Syslog](#tab/syslog)

### Set up the Syslog via AMA connector

The setup process for the Syslog via AMA connector has two parts:

1. **Install the Azure Monitor Agent and create a Data Collection Rule (DCR)**.
    - [Using the Azure portal](?tabs=syslog%2Cportal#install-the-ama-and-create-a-data-collection-rule-dcr)
    - [Using the Azure Monitor Logs Ingestion API](?tabs=syslog%2Capi#install-the-ama-and-create-a-data-collection-rule-dcr)

1. If you're collecting logs from other machines using a log forwarder, [**run the "installation" script**](#run-the-installation-script) on the log forwarder to configure the Syslog daemon to listen for messages from other machines, and to open the necessary local ports.

# [CEF](#tab/cef)

### Set up the Common Event Format (CEF) via AMA connector

The setup process for the CEF via AMA connector has two parts:

1. **Install the Azure Monitor Agent and create a Data Collection Rule (DCR)**.
    - [Using the Azure portal](?tabs=cef%2Cportal#install-the-ama-and-create-a-data-collection-rule-dcr)
    - [Using the Azure Monitor Logs Ingestion API](?tabs=cef%2Capi#install-the-ama-and-create-a-data-collection-rule-dcr)

1. [**Run the "installation" script**](#run-the-installation-script) on the log forwarder to configure the Syslog daemon to listen for messages from other machines, and to open the necessary local ports.

---

### Prerequisites

- You must have the appropriate Microsoft Sentinel solution enabled&mdash;**Syslog** and/or **Common Event Format**.

- Your Azure account must have the following roles/permissions:

  | Built-in role | Scope | Reason |
  | ------------- | ----- | ------ |
  | - [Virtual Machine Contributor](../role-based-access-control/built-in-roles/compute.md#virtual-machine-contributor)<br>- [Azure Connected Machine<br>&nbsp;&nbsp;&nbsp;Resource Administrator](../role-based-access-control/built-in-roles/management-and-governance.md#azure-connected-machine-resource-administrator) | <li>Virtual machines<li>Virtual Machine Scale Sets<li>Azure Arc-enabled servers | To deploy the agent |
  | Any role that includes the action<br>*Microsoft.Resources/deployments/\** | <li>Subscription<li>Resource group<li>Existing data collection rule | To deploy Azure Resource Manager templates |
  | [Monitoring Contributor](../role-based-access-control/built-in-roles/monitor.md#monitoring-contributor) | <li>Subscription<li>Resource group<li>Existing data collection rule | To create or edit data collection rules |

#### Log forwarder prerequisites

If you're collecting messages from a log forwarder, the following additional prerequisites apply:

- You must have a designated Linux VM (your **Log forwarder**) to collect logs.
    - [Create a Linux VM in the Azure portal](../virtual-machines/linux/quick-create-portal.md).
    - [Supported Linux operating systems for Azure Monitor Agent](../azure-monitor/agents/agents-overview.md#linux).

- If your log forwarder *isn't* an Azure virtual machine, it must have the Azure Arc [Connected Machine agent](../azure-arc/servers/overview.md) installed on it.

- The Linux log forwarder VM must have Python 2.7 or 3 installed. Use the ``python --version`` or ``python3 --version`` command to check. If using Python 3 make sure it's set as the default command on the machine, or run the scripts below with the 'python3' command instead of 'python'.

- The log forwarder must have either the `syslog-ng` or `rsyslog` daemon enabled.

- For space requirements for your log forwarder, refer to the [Azure Monitor Agent Performance Benchmark](../azure-monitor/agents/azure-monitor-agent-performance.md). You can also review [this blog post](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/designs-for-accomplishing-microsoft-sentinel-scalable-ingestion/ba-p/3741516), which includes designs for scalable ingestion.

- Your log sources (your security devices and appliances) must be configured to send their log messages to the log forwarder's Syslog daemon instead of to their local Syslog daemon.

#### Avoid data ingestion duplication

Using the same facility for both Syslog and CEF messages may result in data ingestion duplication between the CommonSecurityLog and Syslog tables. 

To avoid this scenario, use one of these methods:

- **If the source device enables configuration of the target facility**: On each source machine that sends logs to the log forwarder in CEF format, edit the Syslog configuration file to remove the facilities used to send CEF messages. This way, the facilities sent in CEF won't also be sent in Syslog. Make sure that each DCR you configure in the next steps uses the relevant facility for CEF or Syslog respectively.

    To see an example of how to arrange a DCR to ingest both Syslog and CEF messages from the same agent, go to [Syslog and CEF streams in the same DCR](#syslog-and-cef-streams-in-the-same-dcr) later in this article.

- **If changing the facility for the source appliance isn't applicable**: Use an ingest time transformation to filter out CEF messages from the Syslog stream to avoid duplication, as shown in the query example below. The data will be sent twice from the collector machine to the workspace.

    ```kusto
    source |
    where ProcessName !contains "CEF"
    ```

#### Log forwarder security considerations

Make sure to configure the machine's security according to your organization's security policy. For example, you can configure your network to align with your corporate network security policy and change the ports and protocols in the daemon to align with your requirements. To improve your machine security configuration, [secure your VM in Azure](../virtual-machines/security-policy.md), or review these [best practices for network security](../security/fundamentals/network-best-practices.md).

If your devices are sending Syslog and CEF logs over TLS (because, for example, your log forwarder is in the cloud), you need to configure the Syslog daemon (`rsyslog` or `syslog-ng`) to communicate in TLS:

- [Encrypt Syslog traffic with TLS – rsyslog](https://www.rsyslog.com/doc/v8-stable/tutorials/tls_cert_summary.html)
- [Encrypt log messages with TLS – syslog-ng](https://support.oneidentity.com/technical-documents/syslog-ng-open-source-edition/3.22/administration-guide/60#TOPIC-1209298)

### Install the AMA and create a Data Collection Rule (DCR)

# [Syslog](#tab/syslog)

You can perform this step in one of two ways:
- Deploy and configure the **Syslog via AMA** data connector in the [Microsoft Sentinel portal](?tabs=syslog%2Cportal#install-the-ama-and-create-a-data-collection-rule-dcr). With this setup, you can create, manage, and delete DCRs per workspace. The AMA will be installed automatically on the VMs you select in the connector configuration.  
    **&mdash;OR&mdash;**
- Send HTTP requests to the [Logs Ingestion API](?tabs=syslog%2Capi#install-the-ama-and-create-a-data-collection-rule-dcr). With this setup, you can create, manage, and delete DCRs. This option is more flexible than the portal. For example, with the API, you can filter by specific log levels, where with the UI, you can only select a minimum log level. The downside is that you have to manually install the Azure Monitor Agent on the log forwarder before creating a DCR.

# [CEF](#tab/cef)

You can perform this step in one of two ways:
- Deploy and configure the **Common Event Format (CEF) via AMA** data connector in the [Microsoft Sentinel portal](?tabs=cef%2Cportal#install-the-ama-and-create-a-data-collection-rule-dcr). With this setup, you can create, manage, and delete DCRs per workspace. The AMA will be installed automatically on the VMs you select in the connector configuration.  
    **&mdash;OR&mdash;**
- Send HTTP requests to the [Logs Ingestion API](?tabs=cef%2Capi#install-the-ama-and-create-a-data-collection-rule-dcr). With this setup, you can create, manage, and delete DCRs. This option is more flexible than the portal. For example, with the API, you can filter by specific log levels, where with the UI, you can only select a minimum log level. The downside is that you have to manually install the Azure Monitor Agent on the log forwarder before creating a DCR.

---

Select the appropriate tab below to see the instructions for each way.

# [Microsoft Sentinel portal](#tab/portal/syslog)

#### Open the connector page and start the DCR wizard

1. Open the [Azure portal](https://portal.azure.com/) and navigate to the **Microsoft Sentinel** service.

1. Select **Data connectors** from the navigation menu

1. Type *Syslog* in the **Search** box. From the results, select the **Syslog via AMA** connector.

1. Select **Open connector page** on the details pane.

1. In the **Configuration** area, select **+Create data collection rule**. 

    :::image type="content" source="media/connect-cef-ama/syslog-connector-page-create-dcr.png" alt-text="Screenshot showing the CEF via AMA connector page." lightbox="media/connect-cef-ama/cef-connector-page-create-dcr.png":::

1. In the **Basic** tab: 
    - Type a DCR name.
    - Select your subscription.
    - Select the resource group where you want to locate your DCR.

    :::image type="content" source="media/connect-cef-ama/dcr-basics-tab.png" alt-text="Screenshot showing the DCR details in the Basic tab." lightbox="media/connect-cef-ama/dcr-basics-tab.png":::

1. Select **Next: Resources >**.

#### Define resources (VMs)

In the **Resources** tab, select the machines on which you want to install the AMA&mdash;in this case, your log forwarder machine. (If your log forwarder doesn't appear in the list, it might not have the Azure Connected Machine agent installed.)

1. Use the available filters or search box to find your log forwarder VM. You can expand a subscription in the list to see its resource groups, and a resource group to see its VMs.

1. Select the log forwarder VM that you want to install the AMA on. (The check box will appear next to the VM name when you hover over it.)

   :::image type="content" source="media/connect-cef-ama/dcr-select-resources.png" alt-text="Screenshot showing how to select resources when setting up the DCR." lightbox="media/connect-cef-ama/dcr-select-resources.png":::

1. Review your changes and select **Next: Collect >**. 

#### Select facilities and severities and create the DCR

> [!NOTE]
> Using the same facility for both Syslog and CEF messages may result in data ingestion duplication. Learn how to [avoid data ingestion duplication](#avoid-data-ingestion-duplication).

1. In the **Collect** tab, select the minimum log level for each facility. When you select a log level, Microsoft Sentinel collects logs for the selected level and other levels with higher severity. For example, if you select **LOG_ERR**, Microsoft Sentinel collects logs for the **LOG_ERR**, **LOG_CRIT**, **LOG_ALERT**, and **LOG_EMERG** levels.

   :::image type="content" source="media/connect-cef-ama/dcr-log-levels.png" alt-text="Screenshot showing how to select log levels when setting up the DCR.":::

1. Review your selections and select **Next: Review + create**. 

1. In the **Review and create** tab, select **Create**.

   :::image type="content" source="media/connect-cef-ama/dcr-review-create.png" alt-text="Screenshot showing how to review the configuration of the DCR and create it.":::

- The connector will install the Azure Monitor Agent on the machines you selected when creating your DCR.

- You will see notifications from the Azure portal when the DCR is created and the agent is installed.

- Select **Refresh** on the connector page to see the DCR displayed in the list.

# [Microsoft Sentinel portal](#tab/portal/cef)

#### Open the connector page and start the DCR wizard

1. Open the [Azure portal](https://portal.azure.com/) and navigate to the **Microsoft Sentinel** service.

1. Select **Data connectors** from the navigation menu

1. Type *CEF* in the **Search** box. From the results, select the **Common Event Format (CEF) via AMA** connector.

1. Select **Open connector page** on the details pane.

1. In the **Configuration** area, select **+Create data collection rule**. 

    :::image type="content" source="media/connect-cef-ama/cef-connector-page-create-dcr.png" alt-text="Screenshot showing the CEF via AMA connector page." lightbox="media/connect-cef-ama/cef-connector-page-create-dcr.png":::

1. In the **Basic** tab: 
    - Type a DCR name.
    - Select your subscription.
    - Select the resource group where you want to locate your DCR.

    :::image type="content" source="media/connect-cef-ama/dcr-basics-tab.png" alt-text="Screenshot showing the DCR details in the Basic tab." lightbox="media/connect-cef-ama/dcr-basics-tab.png":::

1. Select **Next: Resources >**.

#### Define resources (VMs)

In the **Resources** tab, select the machines on which you want to install the AMA&mdash;in this case, your log forwarder machine. (If your log forwarder doesn't appear in the list, it might not have the Azure Connected Machine agent installed.)

1. Use the available filters or search box to find your log forwarder VM. You can expand a subscription in the list to see its resource groups, and a resource group to see its VMs.

1. Select the log forwarder VM that you want to install the AMA on. (The check box will appear next to the VM name when you hover over it.)

   :::image type="content" source="media/connect-cef-ama/dcr-select-resources.png" alt-text="Screenshot showing how to select resources when setting up the DCR." lightbox="media/connect-cef-ama/dcr-select-resources.png":::

1. Review your changes and select **Next: Collect >**. 

#### Select facilities and severities and create the DCR

> [!NOTE]
> Using the same facility for both Syslog and CEF messages may result in data ingestion duplication. Learn how to [avoid data ingestion duplication](#avoid-data-ingestion-duplication).

1. In the **Collect** tab, select the minimum log level for each facility. When you select a log level, Microsoft Sentinel collects logs for the selected level and other levels with higher severity. For example, if you select **LOG_ERR**, Microsoft Sentinel collects logs for the **LOG_ERR**, **LOG_CRIT**, **LOG_ALERT**, and **LOG_EMERG** levels.

   :::image type="content" source="media/connect-cef-ama/dcr-log-levels.png" alt-text="Screenshot showing how to select log levels when setting up the DCR.":::

1. Review your selections and select **Next: Review + create**. 

1. In the **Review and create** tab, select **Create**.

   :::image type="content" source="media/connect-cef-ama/dcr-review-create.png" alt-text="Screenshot showing how to review the configuration of the DCR and create it.":::

- The connector will install the Azure Monitor Agent on the machines you selected when creating your DCR.

- You will see notifications from the Azure portal when the DCR is created and the agent is installed.

- Select **Refresh** on the connector page to see the DCR displayed in the list.

# [Logs Ingestion API](#tab/api)

#### Install the Azure Monitor Agent

Follow these instructions, from the Azure Monitor documentation, to install the Azure Monitor Agent on your log forwarder. Remember to use the instructions for Linux, not those for Windows.
- [Install the AMA using PowerShell](../azure-monitor/agents/azure-monitor-agent-manage.md?tabs=azure-powershell)
- [Install the AMA using the Azure CLI](../azure-monitor/agents/azure-monitor-agent-manage.md?tabs=azure-cli)
- [Install the AMA using an Azure Resource Manager template](../azure-monitor/agents/azure-monitor-agent-manage.md?tabs=azure-resource-manager)

You can create Data Collection Rules (DCRs) using the [Azure Monitor Logs Ingestion API](/rest/api/monitor/data-collection-rules). Learn more about [DCRs](../azure-monitor/essentials/data-collection-rule-overview.md).

#### Create the Data Collection Rule

1. Prepare a DCR file in JSON format. The contents of this file will be the request body in your API request.

    For an example, see [Syslog/CEF DCR creation request body](api-dcr-reference.md#syslogcef-dcr-creation-request-body).

    - Verify that the `streams` field is set to `Microsoft-Syslog` for Syslog messages, or to `Microsoft-CommonSecurityLog` for CEF messages.
    - Add the filter and facility log levels in the `facilityNames` and `logLevels` parameters. See [examples below](#examples-of-facilities-and-log-levels-sections).

1. Create an API request in a REST API client of your choosing.
    1. For the **request URL and header**, copy the request URL and header below by selecting the *copy* icon in the upper right corner of the frame.

        ```http
        PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Insights/dataCollectionRules/{dataCollectionRuleName}?api-version=2022-06-01
        ```

        - Substitute the appropriate values for the `{subscriptionId}` and `{resourceGroupName}` placeholders. 
        - Enter a name of your choice for the DCR in place of the `{dataCollectionRuleName}` placeholder.

    1. For the **request body**, copy and paste the contents of the DCR JSON file that you created (in step 1 above) into the request body.

1. Send the request.
 
    For an example of the response you should receive, see [Syslog/CEF DCR creation response](api-dcr-reference.md#syslogcef-dcr-creation-response)

#### Associate the DCR with the log forwarder

Now you need to create a DCR Association (DCRA) that ties the DCR to the VM resource that hosts your log forwarder.

1. Create an API request in a REST API client of your choosing.

1. For the **request URL and header**, copy the request URL and header below by selecting the *copy* icon in the upper right corner of the frame.

    ```http
    PUT 
    https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachines/{virtualMachineName}/providers/Microsoft.Insights/dataCollectionRuleAssociations/{dataCollectionRuleAssociationName}?api-version=2022-06-01
    ```
    - Substitute the appropriate values for the `{subscriptionId}`, `{resourceGroupName}`, and `{virtualMachineName}` placeholders. 
    - Enter a name of your choice for the DCR in place of the `{dataCollectionRuleAssociationName}` placeholder.

1. For the **request body**, copy the request body below by selecting the *copy* icon in the upper right corner of the frame.

    ```json
    {
      "properties": {
        "dataCollectionRuleId": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Insights/dataCollectionRules/{dataCollectionRuleName}"
      }
    }
    ```

    - Substitute the appropriate values for the `{subscriptionId}` and `{resourceGroupName}` placeholders. 
    - Enter a name of your choice for the DCR in place of the `{dataCollectionRuleName}` placeholder.

1. Send the request.

---

#### Examples of facilities and log levels sections

Review these examples of the facilities and log levels settings. The `name` field includes the filter name.

For CEF message ingestion, the value for `"streams"` should be `"Microsoft-CommonSecurityLog"` instead of `"Microsoft-Syslog"`.

This example collects events from the `cron`, `daemon`, `local0`, `local3` and `uucp` facilities, with the `Warning`, `Error`, `Critical`, `Alert`, and `Emergency` log levels:

```json
    "dataSources": {
      "syslog": [
        {
        "name": "SyslogStream0",
        "streams": [
          "Microsoft-Syslog"
        ],
        "facilityNames": [ 
          "cron",
          "daemon",
          "local0",
          "local3", 
          "uucp"
        ],
        "logLevels": [ 
          "Warning", 
          "Error", 
          "Critical", 
          "Alert", 
          "Emergency"
        ]
      }
    ]
  }
```

##### Syslog and CEF streams in the same DCR

This example shows how you can collect **Syslog and CEF** messages in the same DCR.

See [Avoid data ingestion duplication](#avoid-data-ingestion-duplication) earlier in this article for more information about steps to take when ingesting Syslog and CEF messages using a single agent and DCR.

The DCR collects CEF event messages for:
- The `authpriv` and `mark` facilities with the `Info`, `Notice`, `Warning`, `Error`, `Critical`, `Alert`, and `Emergency` log levels 
- The `daemon` facility with the `Warning`, `Error`, `Critical`, `Alert`, and `Emergency` log levels 

It collects Syslog event messages for:
- The `kern`, `local0`, `local5`, and `news` facilities with the `Critical`, `Alert`, and `Emergency` log levels 
- The `mail` and `uucp` facilities with the `Emergency` log level

```json
    "dataSources": {
      "syslog": [
        {
          "name": "CEFStream1",
          "streams": [ 
            "Microsoft-CommonSecurityLog"
          ],
          "facilityNames": [ 
            "authpriv", 
            "mark"
          ],
          "logLevels": [
            "Info",
            "Notice", 
            "Warning", 
            "Error", 
            "Critical", 
            "Alert", 
            "Emergency"
          ]
        },
        {
          "name": "CEFStream2",
          "streams": [ 
            "Microsoft-CommonSecurityLog"
          ],
          "facilityNames": [ 
            "daemon"
          ],
          "logLevels": [ 
            "Warning", 
            "Error", 
            "Critical", 
            "Alert", 
            "Emergency"
          ]
        },
        {
          "name": "SyslogStream3",
          "streams": [ 
            "Microsoft-Syslog"
          ],
          "facilityNames": [ 
            "kern",
            "local0",
            "local5", 
            "news"
          ],
          "logLevels": [ 
            "Critical", 
            "Alert", 
            "Emergency"
          ]
        },
        {
          "name": "SyslogStream4",
          "streams": [ 
            "Microsoft-Syslog"
          ],
          "facilityNames": [ 
            "mail",
            "uucp"
          ],
          "logLevels": [ 
            "Emergency"
          ]
        }
      ]
    }

```

### Run the "installation" script

The "installation" script doesn't actually install anything, but it configures the Syslog daemon on your log forwarder properly to collect the logs.

1. From the connector page, copy the command line that appears under **Run the following command to install and apply the CEF collector:** by selecting the *copy* icon next to it.

    :::image type="content" source="media/connect-cef-ama/run-install-script.png" alt-text="Screenshot of command line on connector page.":::

    You can also copy it from here:
    ```python
    sudo wget -O Forwarder_AMA_installer.py https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/DataConnectors/Syslog/Forwarder_AMA_installer.py&&sudo python Forwarder_AMA_installer.py
    ```

1. Log in to the log forwarder machine where you just installed the AMA.

1. Paste the command you copied in the last step to launch the installation script.  
    The script configures the `rsyslog` or `syslog-ng` daemon to use the required protocol and restarts the daemon. The script opens port 514 to listen to incoming messages in both UDP and TCP protocols. To change this setting, refer to the Syslog daemon configuration file according to the daemon type running on the machine:
    - Rsyslog: `/etc/rsyslog.conf`
    - Syslog-ng: `/etc/syslog-ng/syslog-ng.conf`

    > [!NOTE] 
    > To avoid [Full Disk scenarios](../azure-monitor/agents/azure-monitor-agent-troubleshoot-linux-vm-rsyslog.md) where the agent can't function, we recommend that you set the `syslog-ng` or `rsyslog` configuration not to store unneeded logs. A Full Disk scenario disrupts the function of the installed AMA.
    > Read more about [RSyslog](https://www.rsyslog.com/doc/master/configuration/actions.html) or [Syslog-ng](https://www.syslog-ng.com/technical-documents/doc/syslog-ng-open-source-edition/3.26/administration-guide/34#TOPIC-1431029).

## Test the connector

1. To validate that the syslog daemon is running on the UDP port and that the AMA is listening, run this command:

    ```
    netstat -lnptv
    ```

    You should see the `rsyslog` or `syslog-ng` daemon listening on port 514. 

1. To capture messages sent from a logger or a connected device, run this command in the background:

    ```
    tcpdump -i any port 514 -A -vv &
    ```
1. After you complete the validation, we recommend that you stop the `tcpdump`: Type `fg` and then select <kbd>Ctrl</kbd>+<kbd>C</kbd>.
1. To send demo messages, do one of the following: 
    - Use the netcat utility. In this example, the utility reads data posted through the `echo` command with the newline switch turned off. The utility then writes the data to UDP port `514` on the localhost with no timeout. To execute the netcat utility, you might need to install an additional package.
    
        ```
        echo -n "<164>CEF:0|Mock-test|MOCK|common=event-format-test|end|TRAFFIC|1|rt=$common=event-formatted-receive_time" | nc -u -w0 localhost 514
        ```
    - Use the logger. This example writes the message to the `local 4` facility, at severity level `Warning`, to port `514`, on the local host, in the CEF RFC format. The `-t` and `--rfc3164` flags are used to comply with the expected RFC format.
    
        ```
        logger -p local4.warn -P 514 -n 127.0.0.1 --rfc3164 -t CEF "0|Mock-test|MOCK|common=event-format-test|end|TRAFFIC|1|rt=$common=event-formatted-receive_time"
        ```    

1. To verify that the connector is installed correctly, run the troubleshooting script with one of these commands:

    - For CEF logs, run:
        
        ```python
         sudo wget -O Sentinel_AMA_troubleshoot.py https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/DataConnectors/Syslog/Sentinel_AMA_troubleshoot.py&&sudo python Sentinel_AMA_troubleshoot.py --cef
        ```

    - For Cisco Adaptive Security Appliance (ASA) logs, run:

        ```python
        sudo wget -O Sentinel_AMA_troubleshoot.py https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/DataConnectors/Syslog/Sentinel_AMA_troubleshoot.py&&sudo python Sentinel_AMA_troubleshoot.py --asa
        ```
 
    - For Cisco Firepower Threat Defense (FTD) logs, run:
    
        ```python
        sudo wget -O Sentinel_AMA_troubleshoot.py https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/DataConnectors/Syslog/Sentinel_AMA_troubleshoot.py&&sudo python Sentinel_AMA_troubleshoot.py --ftd
        ```
