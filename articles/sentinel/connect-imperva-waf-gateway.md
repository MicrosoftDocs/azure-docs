---
title: Connect your Imperva WAF Gateway appliance to Azure Sentinel | Microsoft Docs
description: Learn how to use the Imperva WAF Gateway connector to pull Imperva WAF logs into Azure Sentinel. View Imperva WAF data in workbooks, create alerts, and improve investigation.
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
ms.date: 02/03/2021
ms.author: yelevin
---
# Connect your Imperva WAF Gateway appliance to Azure Sentinel

> [!IMPORTANT]
> The Imperva WAF Gateway connector is currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

[!INCLUDE [reference-to-feature-availability](includes/reference-to-feature-availability.md)]

This article explains how to connect your Imperva WAF Gateway appliance to Azure Sentinel. The Imperva WAF Gateway data connector allows you to easily connect your Imperva WAF Gateway logs with Azure Sentinel, so that you can view the data in workbooks, use it to create custom alerts, and incorporate it to improve investigation. Integration between Imperva WAF Gateway and Azure Sentinel makes use of CEF-formatted Syslog, a Linux-based log forwarder, and the Log Analytics agent.

> [!NOTE]
> Data will be stored in the geographic location of the workspace on which you are running Azure Sentinel.

## Prerequisites

- You must have read and write permissions on your Azure Sentinel workspace.

- You must have read permissions to shared keys for the workspace. [Learn more about workspace keys](../azure-monitor/agents/log-analytics-agent.md#workspace-id-and-key).

## Send Imperva WAF Gateway logs to Azure Sentinel

To get its logs into Azure Sentinel, configure your Imperva WAF Gateway appliance to send Syslog messages in CEF format to a Linux-based log forwarding server (running rsyslog or syslog-ng). This server will have the Log Analytics agent installed on it, and the agent forwards the logs to your Azure Sentinel workspace.

1. In the Azure Sentinel navigation menu, select **Data connectors**.

1. From the **Data connectors** gallery, select **Imperva WAF Gateway (Preview)**, and then **Open connector page**.

1. Follow the instructions in the **Instructions** tab, under **Configuration**:

    1. Under **1. Linux Syslog agent configuration** - Do this step if you don't already have a log forwarder running, or if you need another one. See [STEP 1: Deploy the log forwarder](connect-cef-agent.md) in the Azure Sentinel documentation for more detailed instructions and explanation.

    1. Under **2. Forward Common Event Format (CEF) logs to Syslog agent** - This connector requires an **Action Interface** and **Action Set** to be created on the **Imperva SecureSphere MX** management console. Follow Imperva's instructions to [enable Imperva WAF Gateway alert logging to Azure Sentinel](https://community.imperva.com/blogs/craig-burlingame1/2020/11/13/steps-for-enabling-imperva-waf-gateway-alert). This configuration should include the following elements:
        - Log destination – the hostname and/or IP address of your log forwarding server
        - Protocol and port – TCP 514
        - Log format – CEF
        - Log types – all available

    1. Under **3. Validate connection** - Verify data ingestion by copying the command on the connector page and running it on your log forwarder. See [STEP 3: Validate connectivity](connect-cef-verify.md) in the Azure Sentinel documentation for more detailed instructions and explanation.

        It may take up to 20 minutes until your logs start to appear in Log Analytics.

## Find your data

After a successful connection is established, the data appears in **Logs**, under the **Azure Sentinel** section, in the *CommonSecurityLog* table.

To query Imperva WAF Gateway data in Log Analytics, copy the following into the query window, applying other filters as you choose:

```kusto
CommonSecurityLog 
| where DeviceVendor == "Imperva Inc." 
| where DeviceProduct == "WAF Gateway" 
| where TimeGenerated == ago(5m)
```

See the **Next steps** tab in the connector page for more useful query samples.

## Next steps
In this document, you learned how to connect Imperva WAF Gateway to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:

- Learn how to [get visibility into your data and potential threats](get-visibility.md).
- Get started [detecting threats with Azure Sentinel](detect-threats-built-in.md).
- [Use workbooks](monitor-your-data.md) to monitor your data.