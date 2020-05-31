---
title: Connect Fortinet data to Azure Sentinel| Microsoft Docs
description: Learn how to connect Fortinet data to Azure Sentinel.
services: sentinel
documentationcenter: na
author: yelevin
manager: rkarlin
editor: ''

ms.assetid: add92907-0d7c-42b8-a773-f570f2d705ff
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 12/30/2019
ms.author: yelevin

---
# Connect Fortinet to Azure Sentinel



This article explains how to connect your Fortinet appliance to Azure Sentinel. The Fortinet data connector allows you to easily connect your Fortinet logs with Azure Sentinel, to view dashboards, create custom alerts, and improve investigation. Using Fortinet on Azure Sentinel will provide you more insights into your organization’s Internet usage, and will enhance its security operation capabilities.​ 


 
## Forward Fortinet logs to the Syslog agent

Configure Fortinet to forward Syslog messages in CEF format to your Azure workspace via the Syslog agent.

1. Open the CLI on your Fortinet appliance and run the following commands:

        config log syslogd setting
        set format cef
        set port 514
        set server <ip_address_of_Receiver>
        set status enable
        end

    - Replace the server **ip address** with the IP address of the agent.
    - Set the **syslog port** to **514** or the port set on the agent.
    - To enable CEF format in early FortiOS versions, you might need to run the command set **csv disable**.
 
   > [!NOTE] 
   > For more information, go to the [Fortinet document library](https://aka.ms/asi-syslog-fortinet-fortinetdocumentlibrary). Select your version, and use the **Handbook** and **Log Message Reference**.

1. To use the relevant schema in Azure Monitor Log Analytics for the Fortinet events, search for `CommonSecurityLog`.

1. Continue to [STEP 3: Validate connectivity](connect-cef-verify.md).


## Next steps
In this article, you learned how to connect Fortinet appliances to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats-built-in.md).
- [Use workbooks](tutorial-monitor-your-data.md) to monitor your data.


