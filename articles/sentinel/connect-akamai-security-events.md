---
title: Connect your Akamai Security Events collector to Azure Sentinel | Microsoft Docs
description: Learn how to use the Akamai Security Events connector to pull Akamai solutions' security logs into Azure Sentinel. View Akamai data in workbooks, create alerts, and improve investigation.
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
# Connect your Akamai Security Events collector to Azure Sentinel

> [!IMPORTANT]
> The Akamai Security Events connector is currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

This article explains how to connect your Akamai Security Events collector to Azure Sentinel. The Akamai Security Events data connector allows you to easily connect your Akamai logs with Azure Sentinel, so that you can view the data in workbooks, query it to create custom alerts, and incorporate it to improve investigation. Integration between the Akamai Security Events collector and Azure Sentinel makes use of CEF-formatted Syslog, a Linux-based log forwarder, and the Log Analytics agent. It also uses a custom-built log parser based on a Kusto function.

> [!NOTE]
> Data will be stored in the geographic location of the workspace on which you are running Azure Sentinel.

## Prerequisites

- You must have read and write permissions on your Azure Sentinel workspace.

- You must have read permissions to shared keys for the workspace. [Learn more about workspace keys](../azure-monitor/platform/log-analytics-agent.md#workspace-id-and-key).

## Send Akamai Security Events logs to Azure Sentinel

To get its logs into Azure Sentinel, configure your Akamai Security Events collector to send Syslog messages in CEF format to a Linux-based log forwarding server (running rsyslog or syslog-ng). This server will have the Log Analytics agent installed on it, and the agent forwards the logs to your Azure Sentinel workspace.

1. In the Azure Sentinel navigation menu, select **Data connectors**.

1. From the **Data connectors** gallery, select **Akamai Security Events (Preview)**, and then **Open connector page**.

1. Follow the instructions in the **Instructions** tab, under **Configuration**:

    1. Under **1. Linux Syslog agent configuration** - Do this step if you don't already have a log forwarder running, or if you need another one. See [STEP 1: Deploy the log forwarder](connect-cef-agent.md) in the Azure Sentinel documentation for sizing information, more detailed instructions, and in-depth explanation.

    1. Under **2. Forward Common Event Format (CEF) logs to Syslog agent** - Follow Akamai's instructions to [configure SIEM integration](https://developer.akamai.com/tools/integrations/siem) and to [set up a CEF connector](https://developer.akamai.com/tools/integrations/siem/siem-cef-connector). This connector receives security events from your Akamai solutions in near real time using the SIEM OPEN API, and converts them from JSON into CEF format.
    
        This configuration should include the following elements:
    
        - Log destination – the hostname and/or IP address of your log forwarding server
        - Protocol and port – TCP 514 (if recommended otherwise, be sure to make the parallel change in the syslog daemon on your log forwarding server)
        - Log format – CEF
        - Log types – all available

    1. Under **3. Validate connection** - Verify data ingestion by copying the command on the connector page and running it on your log forwarder. See [STEP 3: Validate connectivity](connect-cef-verify.md) in the Azure Sentinel documentation for more detailed instructions and explanation.

        It may take up to 20 minutes until your logs start to appear in Log Analytics.

## Next steps

In this document, you learned how to connect Akamai Security Events to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:

- Learn how to [get visibility into your data and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats-built-in.md).
- [Use workbooks](tutorial-monitor-your-data.md) to monitor your data.
