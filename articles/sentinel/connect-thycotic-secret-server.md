---
title: Connect Thycotic Secret Server to Azure Sentinel| Microsoft Docs
description: Learn how to use the Thycotic Secret Server data connector to pull Thycotic Secret Server logs into Azure Sentinel. View Thycotic Secret Server data in workbooks, create alerts, and improve investigation.
services: sentinel
documentationcenter: na
author: yelevin
manager: rkarlin
editor: ''

ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 12/13/2020
ms.author: yelevin

---
# Connect your Thycotic Secret Server to Azure Sentinel

> [!IMPORTANT]
> The Thycotic Secret Server connector is currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

[!INCLUDE [reference-to-feature-availability](includes/reference-to-feature-availability.md)]

This article explains how to connect your Thycotic Secret Server appliance to Azure Sentinel. The Thycotic Secret Server data connector allows you to easily connect your Thycotic Secret Server logs with Azure Sentinel, so that you can view the data in workbooks, use it to create custom alerts, and incorporate it to improve investigation. Integration between Thycotic and Azure Sentinel makes use of the CEF Data Connector to properly parse and display Secret Server Syslog messages.

> [!NOTE]
> Data will be stored in the geographic location of the workspace on which you are running Azure Sentinel.

## Prerequisites

- You must have read and write permissions on your Azure Sentinel workspace.

- You must have read permissions to shared keys for the workspace.

- Your Thycotic Secret Server must be configured to export logs via Syslog.

## Send Thycotic Secret Server logs to Azure Sentinel

To get its logs into Azure Sentinel, configure your Thycotic Secret Server to send Syslog messages in CEF format to your Linux-based log forwarding server (running rsyslog or syslog-ng). This server will have the Log Analytics agent installed on it, and the agent forwards the logs to your Azure Sentinel workspace.

1. In the Azure Sentinel navigation menu, select **Data connectors**.

1. From the **Data connectors** gallery, select **Thycotic Secret Server (Preview)**, and then **Open connector page**.

1. Follow the instructions in the **Instructions** tab, under **Configuration**:

    1. Under **1. Linux Syslog agent configuration** - Do this step if you don't already have a log forwarder running, or if you need another one. See [STEP 1: Deploy the log forwarder](connect-cef-agent.md) in the Azure Sentinel documentation for more detailed instructions and explanation.

    1. Under **2. Forward Common Event Format (CEF) logs to Syslog agent** - Follow Thycotic's instructions to [configure Secret Server](https://docs.thycotic.com/ssi/1.0.0/splunk/splunk-on-prem/config/syslog-events.md). This configuration should include the following elements:
        - Log destination – the hostname and/or IP address of your log forwarding server
        - Protocol and port – **TCP 514** (if recommended otherwise, be sure to make the parallel change in the syslog daemon on your log forwarding server)
        - Log format – CEF
        - Log types – all available

    1. Under **3. Validate connection** - Verify data ingestion by copying the command on the connector page and running it on your log forwarder. See [STEP 3: Validate connectivity](connect-cef-verify.md) in the Azure Sentinel documentation for more detailed instructions and explanation.

        It may take up to 20 minutes until your logs start to appear in Log Analytics.

## Find your data

After a successful connection is established, the data appears in **Logs**, under the **Azure Sentinel** section, in the *CommonSecurityLog* table.

To query Thycotic Secret Server data in Log Analytics, copy the following into the query window, applying other filters as you choose:

```kusto
CommonSecurityLog 
| where DeviceVendor == "Thycotic Software"
```

See the **Next steps** tab in the connector page for some useful workbooks and query samples.

## Next steps

In this document, you learned how to connect Thycotic Secret Server to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:

- Learn how to [get visibility into your data, and potential threats](get-visibility.md).
- Get started [detecting threats with Azure Sentinel](detect-threats-built-in.md).
- [Use workbooks](monitor-your-data.md) to monitor your data.
