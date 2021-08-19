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

[!INCLUDE [reference-to-feature-availability](includes/reference-to-feature-availability.md)]


## Forward Cisco ASA logs to the Syslog agent

Cisco ASA doesn't support CEF, so the logs are sent as Syslog and the Azure Sentinel agent knows how to parse them as if they are CEF logs. Configure Cisco ASA to forward Syslog messages to your Azure workspace via the Syslog agent:

1. Go to [Send Syslog messages to an external Syslog server](https://aka.ms/asi-syslog-cisco-forwarding), and follow the instructions to set up the connection. Use these parameters when prompted:
    - Set **port** to 514 or the port you set in the agent.
    - Set **syslog_ip** to the IP address of the agent.

1. To use the relevant schema in Log Analytics for the Cisco events, search for `CommonSecurityLog`.

1. Continue to [STEP 3: Validate connectivity](connect-cef-verify.md).


## Supported Cisco ASA Events

Below is a table of the Cisco ASA event IDs that will be fully parsed by the Azure Sentinel agent. If an event is not found on this list it doesn't mean that it won't be sent to the workspace successfully by the Azure Sentinel agent, but it will not be parsed as if it were CEF.

| Event ID   | | |
| :------------- | :----------: | :----------: |
| %ASA-2-106001 | %ASA-2-106016|%ASA-6-302014|
| %ASA-2-106002 |%ASA-2-106017|%ASA-6-302015|
| %ASA-2-106006| %ASA-2-106018|%ASA-6-302016|
| %ASA-2-106007| %ASA-2-106020|%ASA-6-302020|
| %ASA-3-106010|%ASA-1-106021|%ASA-6-302021|
| %ASA-6-106012|%ASA-1-106022|%ASA-7-710002|
| %ASA-2-106013|%ASA-4-106023|%ASA-3-710003|
| %ASA-3-106014|%ASA-6-106100|%ASA-7-710005|
| %ASA-6-106015|%ASA-6-302013|%ASA-7-710006|


## Next steps
In this document, you learned how to connect Cisco ASA appliances to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](get-visibility.md).
- Get started [detecting threats with Azure Sentinel](detect-threats-built-in.md).
- [Use workbooks](monitor-your-data.md) to monitor your data.
