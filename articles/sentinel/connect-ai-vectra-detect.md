---
title: Connect AI Vectra Detect data to Azure Sentinel| Microsoft Docs
description: Learn how to connect AI Vectra Detect data to Azure Sentinel.
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
ms.date: 06/21/2020
ms.author: yelevin

---
# Connect AI Vectra Detect to Azure Sentinel

This article explains how to connect your [AI Vectra Detect](https://www.vectra.ai/product/cognito-detect) appliance to Azure Sentinel. The AI Vectra Detect data connector allows you to easily bring your AI Vectra Detect data into Azure Sentinel, so that you can view it in workbooks, use it to create custom alerts, and incorporate it to improve investigation.

> [!NOTE]
> Data will be stored in the geographic location of the workspace on which you are running Azure Sentinel.

## Configure your AI Vectra Detect appliance to send CEF messages  

Configure AI Vectra Detect to forward CEF-formatted Syslog messages to your Log Analytics workspace via the Syslog forwarder you set up in [STEP 1: Deploy the log forwarder](connect-cef-agent.md).

1. From the Vectra interface, navigate to Settings > Notifications and choose Edit Syslog configuration. Follow the instructions below to set up the connection:

    - Add a new Destination (the hostname of the [log forwarder](connect-cef-agent.md))
    - Set the Port as **514**
    - Set the Protocol as **UDP**
    - Set the format to **CEF**
    - Set Log types (select all log types available)
    - Click on **Save**

2. You can click the **Test** button to force the sending of some test events to the log forwarder.

3. To use the relevant schema in Log Analytics for the AI Vectra Detect events, search for **CommonSecurityLog**.

4. Continue to [STEP 3: Validate connectivity](connect-cef-verify.md).

## Next steps

In this document, you learned how to connect AI Vectra Detect appliances to Azure Sentinel. To take full advantage of the capabilities built in to this data connector, click on the **Next steps** tab on the data connector page. There you'll find some ready-made sample queries so you can get started finding useful information.

To learn more about Azure Sentinel, see the following articles:

- Learn how to [get visibility into your data, and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats-built-in.md).
- [Use workbooks](tutorial-monitor-your-data.md) to monitor your data.
