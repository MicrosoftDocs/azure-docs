---
title: Connect </MFR NAME> </PRODUCT NAME> data to Azure Sentinel| Microsoft Docs
description: Learn how to use the </MFR NAME> </PRODUCT NAME> data connector to pull </PRODUCT NAME> logs into Azure Sentinel. View </PRODUCT NAME> data in workbooks, create alerts, and improve investigation.
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
ms.date: 01/27/2021
ms.author: yelevin

---
# Connect your SonicWall Firewall to Azure Sentinel

This article explains how to connect your SonicWall Firewall appliance to Azure Sentinel. The SonicWall Firewall data connector allows you to easily connect your SonicWall Firewall logs with Azure Sentinel, to view dashboards, create custom alerts, and improve investigation. Using SonicWall Firewall on Azure Sentinel will provide you more insights into your organization’s data usage, and will enhance its security operation capabilities.


> [!NOTE]
> Data will be stored in the geographic location of the workspace on which you are running Azure Sentinel.

## Forward SonicWall Firewall logs to the Syslog agent  

Configure SonicWall Firewall to forward Syslog messages in CEF format to your Azure workspace via the Syslog agent.
1. Go to http://help.sonicwall.com/help/sw/eng/7020/26/2/3/content/Log_Syslog.120.2.htm. Follow all the instructions in the guide to set up your SonicWall Firewall to collect CEF events. Make sure to use Local Use 4 as the syslog facility.
a.	Make sure to set the syslog format as ArcSight.
2. To use the relevant schema in Log Analytics for the SonicWall Firewall, search for CommonSecurityLog.
3. Continue to [STEP 3: Validate connectivity](connect-cef-verify.md).


## Next steps
In this document, you learned how to connect SonicWall Firewall to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats-built-in.md).
- [Use workbooks](tutorial-monitor-your-data.md) to monitor your data.
