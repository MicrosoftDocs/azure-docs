---
title: Connect Darktrace Cyber AI Analyst data to Azure Sentinel | Microsoft Docs
description: Learn how to use the Darktrace Cyber AI Analyst connector to pull Cyber AI Analyst logs into Azure Sentinel. View Cyber AI Analyst data in workbooks, create alerts, and improve investigation.
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
ms.date: 01/26/2021
ms.author: yelevin
---
# Connect your Darktrace Cyber AI Analyst to Azure Sentinel

> [!IMPORTANT]
> The Darktrace Cyber AI Analyst connector is currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

This article explains how to connect your Darktrace Cyber AI Analyst appliance to Azure Sentinel. The Darktrace Cyber AI Analyst data connector allows you to easily connect your Cyber AI Analyst logs with Azure Sentinel, so that you can view the data in workbooks, use it to create custom alerts, and incorporate it to improve investigation. Integration between Darktrace Cyber AI Analyst and Azure Sentinel makes use of CEF-formatted Syslog, a Linux-based log forwarder, and the Log Analytics agent. 

> [!NOTE]
> Data will be stored in the geographic location of the workspace on which you are running Azure Sentinel.

## Prerequisites

- You must have read and write permissions on your Azure Sentinel workspace.

- </IF REQUIRED> You must have read permissions to shared keys for the workspace.

- </OTHERS IF REQUIRED>

## Send Darktrace Cyber AI Analyst logs to Azure Sentinel  

To get its logs into Azure Sentinel, configure your Darktrace Cyber AI Analyst appliance to send Syslog messages in CEF format to a Linux-based log forwarding server (running rsyslog or syslog-ng). This server will have the Log Analytics agent installed on it, and the agent forwards the logs to your Azure Sentinel workspace.

1. In the Azure Sentinel navigation menu, select **Data connectors**.

1. From the **Data connectors** gallery, select **</CONNECTOR NAME AS DISPLAYED> (Preview)**, and then **Open connector page**.

1. Follow the instructions in the **Instructions** tab, under **Configuration**:

    1. Under **1. Linux Syslog agent configuration** - Do this step if you don't already have a log forwarder running, or if you need another one. See [STEP 1: Deploy the log forwarder](connect-cef-agent.md) in the Azure Sentinel documentation for more detailed instructions and explanation.

    1. Under **2. </COPIED FROM UI INSTRUCTIONS>** - Follow </MFR NAME>'s instructions to [configure </PRODUCT NAME>](</LINK-TO-WEBPAGE>).This configuration should include the following elements:
        - Within the Darktrace Threat Visualizer, navigate to the **System Config** page in the main menu under **Admin**.

        - From the left-hand menu, select **Modules** and choose **Azure Sentinel** from the available **Workflow Integrations**.

        - A conﬁguration window will open. Locate **Azure Sentinel Syslog CEF** and click “New” to reveal the conﬁguration settings, unless already exposed.

        - In the **Server** ﬁeld, enter the location of the log forwarder and optionally modify the communication port. Ensure that the port selected is set to 514 and is allowed by any intermediary ﬁrewalls.

        - Conﬁgure any alert thresholds, time offsets or additional settings as required.

        - Review any additional conﬁguration options you may wish to enable that alter the Syslog syntax.

        - Enable **Send Alerts** and save your changes.

        - You can send a test model breach to force send an example breach ***(((WTF???)))***

        > [!NOTE]
        > For more information consult the Darktrace Azure Sentinel Integration section of the Threat Visualizer Guide

    1. Under **3. Validate connection** - Verify data ingestion by copying the command on the connector page and running it on your log forwarder. See [STEP 3: Validate connectivity](connect-cef-verify.md) in the Azure Sentinel documentation for more detailed instructions and explanation.

        It may take up to 20 minutes until your logs start to appear in Log Analytics.

## Find your data

After a successful connection is established, the data appears in **Logs**, under the **Azure Sentinel** section, in the *CommonSecurityLog* table.

To query Cyber AI Analyst data in Log Analytics, copy the following into the query window, applying other filters as you choose:

```kusto
CommonSecurityLog 
| where DeviceVendor == "<VENDOR/PRODUCT AS APPEARS IN QUERY>"
```

See the **Next steps** tab in the connector page for more query samples.

## Next steps
In this document, you learned how to connect Darktrace Cyber AI Analyst to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:

- Learn how to [get visibility into your data and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats-built-in.md).
- [Use workbooks](tutorial-monitor-your-data.md) to monitor your data.
