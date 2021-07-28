---
title: Connect Trend Micro TippingPoint to Azure Sentinel | Microsoft Docs
description: Learn how to use the Trend Micro TippingPoint data connector to pull TippingPoint SMS logs into Azure Sentinel. View TippingPoint data in workbooks, create alerts, and improve investigation.
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
# Connect your Trend Micro TippingPoint solution to Azure Sentinel

> [!IMPORTANT]
> The Trend Micro TippingPoint connector is currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

[!INCLUDE [reference-to-feature-availability](includes/reference-to-feature-availability.md)]

This article explains how to connect your Trend Micro TippingPoint Threat Protection System solution to Azure Sentinel. The Trend Micro TippingPoint data connector allows you to easily connect your TippingPoint Security Management System (SMS) logs with Azure Sentinel, so that you can view the data in workbooks, use it to create custom alerts, and incorporate it to improve investigation.

> [!NOTE]
> Data will be stored in the geographic location of the workspace on which you are running Azure Sentinel.

## Prerequisites

- You must have read and write permissions on your Azure Sentinel workspace.

- You must have read permissions to shared keys for the workspace.

## Send Trend Micro TippingPoint logs to Azure Sentinel

To get its logs into Azure Sentinel, configure your TippingPoint TPS solution to send Syslog messages in CEF format to a Linux-based log forwarding server (running rsyslog or syslog-ng). This server will have the Log Analytics agent installed on it, and the agent forwards the logs to your Azure Sentinel workspace. The connector uses a parser function to convert the data it receives into a normalized schema. 

1. In the Azure Sentinel navigation menu, select **Data connectors**.

1. From the **Data connectors** gallery, select **Trend Micro TippingPoint (Preview)**, and then **Open connector page**.

1. Follow the instructions in the **Instructions** tab, under **Configuration**:

    1. Under **1. Linux Syslog agent configuration** - Do this step if you don't already have a log forwarder running, or if you need another one. See [STEP 1: Deploy the log forwarder](connect-cef-agent.md) in the Azure Sentinel documentation for more detailed instructions and explanation.

    1. Under **2. Forward Trend Micro TippingPoint SMS logs to Syslog agent** - This configuration should include the following elements:
        - Log destination – the hostname and/or IP address of your log forwarding server
        - Protocol and port – **TCP 514** (if recommended otherwise, be sure to make the parallel change in the syslog daemon on your log forwarding server)
        - Log format – **ArcSight CEF Format v4.2**
        - Log types – all available

    1. Under **3. Validate connection** - Verify data ingestion by copying the command on the connector page and running it on your log forwarder. See [STEP 3: Validate connectivity](connect-cef-verify.md) in the Azure Sentinel documentation for more detailed instructions and explanation.

        It may take up to 20 minutes until your logs start to appear in Log Analytics.

## Find your data

After a successful connection is established, the data appears in **Logs**, under the **Azure Sentinel** section, in the *CommonSecurityLog* table.

To get Trend Micro TippingPoint data in Log Analytics, you'll query the parser function instead of the table. Copy the following into the query window, applying other filters as you choose:

```kusto
TrendMicroTippingPoint
| sort by TimeGenerated
```

See the **Next steps** tab in the connector page for more query samples.

## Next steps

In this document, you learned how to connect Trend Micro TippingPoint to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:

- Learn how to [get visibility into your data, and potential threats](get-visibility.md).
- Get started [detecting threats with Azure Sentinel](detect-threats-built-in.md).
- [Use workbooks](tutorial-monitor-your-data.md) to monitor your data.
