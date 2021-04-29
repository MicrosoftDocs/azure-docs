---
title: Connect WireX Network Forensics Platform (NFP) to Azure Sentinel | Microsoft Docs
description: Learn how to use the WireX Systems NFP data connector to pull WireX NFP logs into Azure Sentinel. View WireX NFP data in workbooks, create alerts, and improve investigation.
services: sentinel
documentationcenter: na
author: yelevin
manager: rkarlin
editor: ''

ms.assetid: 0001cad6-699c-4ca9-b66c-80c194e439a5
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 01/12/2021
ms.author: yelevin

---
# Connect your WireX Network Forensics Platform (NFP) appliance to Azure Sentinel

> [!IMPORTANT]
> The WireX Systems NFP connector is currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

This article explains how to connect your WireX Systems Network Forensics Platform (NFP) appliance to Azure Sentinel. The WireX NFP data connector allows you to easily connect your NFP logs with Azure Sentinel, so that you can view the data in workbooks, use it to create custom alerts, and incorporate it to improve investigation. 

> [!NOTE] 
> Data will be stored in the geographic location of the workspace on which you are running Azure Sentinel.

## Prerequisites

- You must have read and write permissions on your Azure Sentinel workspace.

- You must have read permissions to shared keys for the workspace.

## Send WireX NFP logs to Azure Sentinel

To get its logs into Azure Sentinel, configure your WireX Systems NFP appliance to send Syslog messages in CEF format to a Linux-based log forwarding server (running rsyslog or syslog-ng). This server will have the Log Analytics agent installed on it, and the agent forwards the logs to your Azure Sentinel workspace.

1. In the Azure Sentinel navigation menu, select **Data connectors**.

1. From the **Data connectors** gallery, select **WireX Network Forensics Platform (Preview)**, and then **Open connector page**.

1. Follow the instructions in the **Instructions** tab, under **Configuration**:

    1. **1. Linux Syslog agent configuration** - Do this step if you don't already have a log forwarder running, or if you need another one. See [STEP 1: Deploy the log forwarder](connect-cef-agent.md) in the Azure Sentinel documentation for more detailed instructions and explanation.

    1. **2. Forward Common Event Format (CEF) logs to Syslog agent** - Contact [WireX support](https://wirexsystems.com/contact-us/) for the proper configuration of your WireX NFP solution. This configuration should include the following elements:
        - Log destination – the hostname and/or IP address of your log forwarding server
        - Protocol and port – TCP 514 (if recommended otherwise, be sure to make the parallel change in the syslog daemon on your log forwarding server)
        - Log format – CEF
        - Log types – all recommended by WireX

    1. **3. Validate connection** - Verify data ingestion by copying the command on the connector page and running it on your log forwarder. See [STEP 3: Validate connectivity](connect-cef-verify.md) in the Azure Sentinel documentation for more detailed instructions and explanation.

        It may take up to 20 minutes until your logs start to appear in Log Analytics.

## Find your data

After a successful connection is established, the data appears in **Logs**, under the **Azure Sentinel** section, in the *CommonSecurityLog* table.

To query WireX NFP data in Log Analytics, copy the following into the query window, applying other filters as you choose:

```kusto
CommonSecurityLog 
| where DeviceVendor == "WireX"
```

See the **Next steps** tab in the connector page for more query samples.

## Next steps
In this document, you learned how to connect WireX Systems NFP to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats-built-in.md).
- [Use workbooks](tutorial-monitor-your-data.md) to monitor your data.