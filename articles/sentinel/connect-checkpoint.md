---
title: Connect Check Point data to Azure Sentinel| Microsoft Docs
description: Configure your Check Point appliance to forward Syslog messages in CEF format to your Azure Sentinel workspace via the Syslog agent.
services: sentinel
documentationcenter: na
author: yelevin
manager: rkarlin
editor: ''

ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 12/30/2019
ms.author: yelevin

---
# Connect Check Point to Azure Sentinel



This article explains how to connect your Check Point appliance to Azure Sentinel. The Check Point data connector allows you to easily connect your Check Point logs with Azure Sentinel, to view dashboards, create custom alerts, and improve investigation. Using Check Point on Azure Sentinel will provide you more insights into your organization’s Internet usage, and will enhance its security operation capabilities.​ 

## Forward Check Point logs to the Syslog agent

Configure your Check Point appliance to forward Syslog messages in CEF format to your Azure workspace via the Syslog agent.

1. Go to [Check Point Log Export](https://aka.ms/asi-syslog-checkpoint-forwarding).
1. Scroll down to **Basic Deployment** and follow the instructions to set up the connection, using the following guidelines:
   - Set the **Syslog port** to **514** or the port you set on the agent.
     - Replace the **name** and **target-server IP address** in the CLI with the Syslog agent name and IP address.
     - Set the format to **CEF**.
1. If you are using version R77.30 or R80.10, scroll up to **Installations** and follow the instructions to install a Log Exporter for your version.
1. Continue to [STEP 3: Validate connectivity](connect-cef-verify.md).
 

## Next steps
In this document, you learned how to connect Check Point appliances to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:
- [Validate connectivity](connect-cef-verify.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats-built-in.md).
- [Use workbooks](tutorial-monitor-your-data.md) to monitor your data.


