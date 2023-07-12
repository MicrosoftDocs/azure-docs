---
title: Get CEF-formatted logs from your device or appliance into Microsoft Sentinel | Microsoft Docs
description: Use the Log Analytics agent, installed on a Linux-based log forwarder, to ingest logs sent in Common Event Format (CEF) over Syslog into your Microsoft Sentinel workspace.
author: yelevin
ms.topic: conceptual
ms.date: 11/09/2021
ms.author: yelevin
ms.custom: ignite-fall-2021
---

# Get CEF-formatted logs from your device or appliance into Microsoft Sentinel

[!INCLUDE [reference-to-feature-availability](includes/reference-to-feature-availability.md)]

Many networking and security devices and appliances send their system logs over the Syslog protocol in a specialized format known as Common Event Format (CEF). This format includes more information than the standard Syslog format, and it presents the information in a parsed key-value arrangement. The Log Analytics Agent accepts CEF logs and formats them especially for use with Microsoft Sentinel, before forwarding them on to your Microsoft Sentinel workspace.

Learn how to [collect Syslog with the AMA](../azure-monitor/agents/data-collection-syslog.md), including how to configure Syslog and create a DCR.

> [!IMPORTANT]
>
> Upcoming changes:
> - On **February 28th 2023**, we introduced changes to the CommonSecurityLog table schema. 
>    - Following this change, you might need to review and update custom queries. For more details, see the [recommended actions section](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/upcoming-changes-to-the-commonsecuritylog-table/ba-p/3643232) in this blog post. Out-of-the-box content (detections, hunting queries, workbooks, parsers, etc.) has been updated by Microsoft Sentinel.
>    - Data that has been streamed and ingested before the change will still be available in its former columns and formats. Old columns will therefore remain in the schema.
> - On **31 August, 2024**, the [Log Analytics agent will be retired](https://azure.microsoft.com/updates/were-retiring-the-log-analytics-agent-in-azure-monitor-on-31-august-2024/). If you are using the Log Analytics agent in your Microsoft Sentinel deployment, we recommend that you start [planning your migration to the AMA](ama-migrate.md). Review the [options for streaming logs in the CEF and Syslog format to Microsoft Sentinel](connect-cef-syslog-options.md).

This article describes the process of using CEF-formatted logs to connect your data sources. For information about data connectors that use this method, see [Microsoft Sentinel data connectors reference](data-connectors-reference.md).

There are two main steps to making this connection, that will be explained below in detail:

- Designating a Linux machine or VM as a dedicated log forwarder, installing the Log Analytics agent on it, and configuring the agent to forward the logs to your Microsoft Sentinel workspace. The installation and configuration of the agent are handled by a deployment script.

- Configuring your device to send its logs in CEF format to a Syslog server.

> [!NOTE]
> Data is stored in the geographic location of the workspace on which you are running Microsoft Sentinel.

## Supported architectures

The following diagram describes the setup in the case of a Linux VM in Azure:

 ![CEF in Azure](./media/connect-cef/cef-syslog-azure.png)

Alternatively, you'll use the following setup if you use a VM in another cloud, or an on-premises machine:

 ![CEF on premises](./media/connect-cef/cef-syslog-onprem.png)

## Prerequisites

A Microsoft Sentinel workspace is required in order to ingest CEF data into Log Analytics.

- You must have read and write permissions on this workspace.

- You must have read permissions to the shared keys for the workspace. [Learn more about workspace keys](../azure-monitor/agents/agent-windows.md).

## Designate a log forwarder and install the Log Analytics agent

This section describes how to designate and configure the Linux machine that will forward the logs from your device to your Microsoft Sentinel workspace.

Your Linux machine can be a physical or virtual machine in your on-premises environment, an Azure VM, or a VM in another cloud.

Use the link provided on the **Common Event Format (CEF) data connector page** to run a script on the designated machine and perform the following tasks:

- **Installs the Log Analytics agent for Linux** (also known as the OMS agent) and configures it for the following purposes:
    - listening for CEF messages from the built-in Linux Syslog daemon on TCP port 25226
    - sending the messages securely over TLS to your Microsoft Sentinel workspace, where they are parsed and enriched

- **Configures the built-in Linux Syslog daemon** (rsyslog.d/syslog-ng) for the following purposes:
    - listening for Syslog messages from your security solutions on TCP port 514
    - forwarding only the messages it identifies as CEF to the Log Analytics agent on localhost using TCP port 25226

For more information, see [Deploy a log forwarder to ingest Syslog and CEF logs to Microsoft Sentinel](connect-log-forwarder.md).

### Security considerations

Make sure to configure the machine's security according to your organization's security policy. For example, you can configure your network to align with your corporate network security policy and change the ports and protocols in the daemon to align with your requirements.

For more information, see [Secure VM in Azure](../virtual-machines/security-policy.md) and [Best practices for Network security](../security/fundamentals/network-best-practices.md).

If your devices are sending Syslog and CEF logs over TLS, such as when your log forwarder is in the cloud, you will need to configure the Syslog daemon (rsyslog or syslog-ng) to communicate in TLS. 

For more information, see:

- [Encrypting Syslog traffic with TLS – rsyslog](https://www.rsyslog.com/doc/v8-stable/tutorials/tls_cert_summary.html)
- [Encrypting log messages with TLS – syslog-ng](https://support.oneidentity.com/technical-documents/syslog-ng-open-source-edition/3.22/administration-guide/60#TOPIC-1209298)

## Configure your device

Locate and follow your device vendor's configuration instructions for sending logs in CEF format to a SIEM or log server. 

If your product appears in the data connectors gallery, you can consult the [Microsoft Sentinel data connectors reference](data-connectors-reference.md) for assistance, where the configuration instructions should include the settings in the list below.

   - Protocol = TCP
   - Port = 514
   - Format = CEF
   - IP address - make sure to send the CEF messages to the IP address of the virtual machine you dedicated for this purpose.

This solution supports Syslog RFC 3164 or RFC 5424.

> [!TIP]
> Define a different protocol or port number in your device as needed, as long as you also make the same changes in the Syslog daemon on the log forwarder.
>

## Find your data

It may take up to 20 minutes after the connection is made for data to appear in Log Analytics.

To search for CEF events in Log Analytics, query the `CommonSecurityLog` table in the query window.

Some products listed in the data connectors gallery require the use of additional parsers for best results. These parsers are implemented through the use of Kusto functions. For more information, see the section for your product on the [Microsoft Sentinel data connectors reference](data-connectors-reference.md) page.

To find CEF events for these products, enter the name of the Kusto function as your query subject, instead of "CommonSecurityLog."

You can find helpful sample queries, workbooks, and analytics rule templates made especially for your product on the **Next steps** tab of your product's data connector page in the Microsoft Sentinel portal.

If you're not seeing any data, see the [CEF troubleshooting](./troubleshooting-cef-syslog.md) page for guidance.

### Changing the source of the TimeGenerated field

By default, the Log Analytics agent populates the *TimeGenerated* field in the schema with the time the agent received the event from the Syslog daemon. As a result, the time at which the event was generated on the source system is not recorded in Microsoft Sentinel.

You can, however, run the following command, which will download and run the `TimeGenerated.py` script. This script configures the Log Analytics agent to populate the *TimeGenerated* field with the event's original time on its source system, instead of the time it was received by the agent.

```bash
wget -O TimeGenerated.py https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/DataConnectors/CEF/TimeGenerated.py && python TimeGenerated.py {ws_id}
```

## Next steps

In this document, you learned how Microsoft Sentinel collects CEF logs from devices and appliances. To learn more about connecting your product to Microsoft Sentinel, see the following articles:

- [Deploy a Syslog/CEF forwarder](connect-log-forwarder.md)
- [Microsoft Sentinel data connectors reference](data-connectors-reference.md)
- [Troubleshoot log forwarder connectivity](troubleshooting-cef-syslog.md#validate-cef-connectivity)

To learn more about what to do with the data you've collected in Microsoft Sentinel, see the following articles:

- Learn about [CEF and CommonSecurityLog field mapping](cef-name-mapping.md).
- Learn how to [get visibility into your data and potential threats](get-visibility.md).
- Get started [detecting threats with Microsoft Sentinel](./detect-threats-built-in.md).
