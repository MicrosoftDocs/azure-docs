---
title: Connect Zscaler data to Azure Sentinel| Microsoft Docs
description: Learn how to connect Zscaler data to Azure Sentinel.
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
# Connect Zscaler Internet Access to Azure Sentinel

> [!IMPORTANT]
> The Zscaler data connector in Azure Sentinel is currently in public preview.
> This feature is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

This article explains how to connect your Zscaler Internet Access appliance to Azure Sentinel. The Zscaler data connector allows you to easily connect your Zscaler Internet Access (ZIA) logs with Azure Sentinel, to view dashboards, create custom alerts, and improve investigation. Using Zscaler on Azure Sentinel will provide you more insights into your organization’s Internet usage, and will enhance its security operation capabilities.​ 


## Configure your Zscaler to send CEF messages

1. On the Zscaler appliance you need to set these values so that the appliance sends the necessary logs in the necessary format to the Azure Sentinel Syslog agent, based on the Log Analytics agent. You can modify these parameters in your appliance, as long as you also modify them in the Syslog daemon on the Azure Sentinel agent.
    - Protocol = TCP
    - Port = 514
    - Format = CEF
    - IP address - make sure to send the CEF messages to the IP address of the virtual machine you dedicated for this purpose.
 For more information, see the [Zscaler and Azure Sentinel Deployment Guide](https://aka.ms/ZscalerCEFInstructions).
 
   > [!NOTE]
   > This solution supports Syslog RFC 3164 or RFC 5424.


1. To use the relevant schema in Log Analytics for the CEF events, search for `CommonSecurityLog`.
1. Continue to [STEP 3: Validate connectivity](connect-cef-verify.md).


## Next steps
In this document, you learned how to connect Zscaler Internet Access to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats.md).
- [Use workbooks](tutorial-monitor-your-data.md) to monitor your data.


