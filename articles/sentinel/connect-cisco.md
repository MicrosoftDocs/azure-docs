---
title: Connect Cisco data to Azure Sentinel| Microsoft Docs
description: Learn how to connect your Cisco ASA appliance to Azure Sentinel to view dashboards, create custom alerts, and improve investigation.
services: sentinel
documentationcenter: na
author: yelevin
manager: rkarlin
editor: ''

ms.assetid: 62029b5c-29d3-4336-8a22-a9db8214eb7e
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 12/30/2019
ms.author: yelevin

---
# Connect Cisco ASA to Azure Sentinel



This article explains how to connect your Cisco ASA appliance to Azure Sentinel. The Cisco ASA data connector allows you to easily connect your Cisco ASA logs with Azure Sentinel, to view dashboards, create custom alerts, and improve investigation. Using Cisco ASA on Azure Sentinel will provide you more insights into your organization’s Internet usage, and will enhance its security operation capabilities.​ 



## Forward Cisco ASA logs to the Syslog agent

Cisco ASA doesn't support CEF, so the logs are sent as Syslog and the Azure Sentinel agent knows how to parse them as if they are CEF logs. Configure Cisco ASA to forward Syslog messages to your Azure workspace via the Syslog agent:

1. Go to [Send Syslog messages to an external Syslog server](https://aka.ms/asi-syslog-cisco-forwarding), and follow the instructions to set up the connection. Use these parameters when prompted:
    - Set **port** to 514 or the port you set in the agent.
    - Set **syslog_ip** to the IP address of the agent.

1. To use the relevant schema in Log Analytics for the Cisco events, search for `CommonSecurityLog`.

1. Continue to [STEP 3: Validate connectivity](connect-cef-verify.md).




## Next steps
In this document, you learned how to connect Cisco ASA appliances to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats-built-in.md).
- [Use workbooks](tutorial-monitor-your-data.md) to monitor your data.


