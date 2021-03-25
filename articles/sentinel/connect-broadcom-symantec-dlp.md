---
title: Connect Broadcom Symantec Data Loss Prevention (DLP) data to Azure Sentinel | Microsoft Docs
description: Learn how to use the Broadcom Symantec DLP data connector to pull Symantec DLP logs into Azure Sentinel. View Symantec DLP data in workbooks, create alerts, and improve investigation.
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
ms.date: 03/02/2021
ms.author: yelevin
---
# Connect your Broadcom Symantec Data Loss Prevention (DLP) to Azure Sentinel

> [!IMPORTANT]
> The Broadcom Symantec DLP connector is currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

This article explains how to connect your Broadcom Symantec DLP appliance to Azure Sentinel. The Broadcom Symantec DLP data connector allows you to easily connect your Symantec DLP logs with Azure Sentinel, to view dashboards, create custom alerts, and improve investigation. This capability gives you more insight into your organization’s information, where it travels, and improves your security operation capabilities. Integration between Broadcom Symantec DLP and Azure Sentinel makes use of CEF-formatted Syslog, a Linux-based log forwarder, and the Log Analytics agent. It also uses a custom-built log parser based on a Kusto function.

> [!NOTE]
> Data will be stored in the geographic location of the workspace on which you are running Azure Sentinel.

## Prerequisites

- You must have read and write permissions on your Azure Sentinel workspace.

- You must have read permissions to shared keys for the workspace. [Learn more about workspace keys](../azure-monitor/agents/log-analytics-agent.md#workspace-id-and-key).

## Send Broadcom Symantec DLP logs to Azure Sentinel

To get its logs into Azure Sentinel, configure your Broadcom Symantec DLP appliance to send Syslog messages in CEF format to a Linux-based log forwarding server (running rsyslog or syslog-ng). This server will have the Log Analytics agent installed on it, and the agent forwards the logs to your Azure Sentinel workspace.

1. In the Azure Sentinel navigation menu, select **Data connectors**.

1. From the **Data connectors** gallery, select the **Broadcom Symantec DLP (Preview)** connector, and then **Open connector page**.

1. Follow the instructions in the **Instructions** tab, under **Configuration**:

    1. Under **1. Linux Syslog agent configuration** - Do this step if you don't already have a log forwarder running, or if you need another one. See [STEP 1: Deploy the log forwarder](connect-cef-agent.md) in the Azure Sentinel documentation for more detailed instructions and explanation.

    1. Under **2. Forward Symantec DLP logs to a Syslog agent** - Follow Broadcom's instructions to [configure Symantec DLP](https://help.symantec.com/cs/DLP15.7/DLP/v27591174_v133697641/Configuring-the-Log-to-a-Syslog-Server-action?locale=EN_US). This configuration should include the following elements:
        - Log destination – the hostname and/or IP address of your log forwarding server
        - Protocol and port – TCP 514 (if recommended otherwise, be sure to make the parallel change in the syslog daemon on your log forwarding server)
        - Log format – CEF
        - Log types – all available or all appropriate

    1. Under **3. Validate connection** - Verify data ingestion by copying the command on the connector page and running it on your log forwarder. See [STEP 3: Validate connectivity](connect-cef-verify.md) in the Azure Sentinel documentation for more detailed instructions and explanation.

        It may take up to 20 minutes until your logs start to appear in Log Analytics.

## Find your data

After a successful connection is established, the data appears in **Logs**, under the **Azure Sentinel** section, in the *CommonSecurityLog* table.

This data connector depends on a parser based on a Kusto Function to work as expected. [Follow these steps](https://aka.ms/sentinel-symantecdlp-parser) to create the **SymantecDLP** Kusto function alias.

Then, to query Broadcom Symantec DLP data in Log Analytics, enter `SymantecDLP` at the top of the query window.

See the **Next steps** tab in the connector page for some useful query samples.

## Next steps

In this document, you learned how to connect Symantec DLP to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:

- Learn how to [get visibility into your data and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats-built-in.md).
- [Use workbooks](tutorial-monitor-your-data.md) to monitor your data.