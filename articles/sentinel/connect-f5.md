---
title: Connect F5 data to Azure Sentinel| Microsoft Docs
description: Learn how to connect F5 data to Azure Sentinel.
services: sentinel
documentationcenter: na
author: yelevin
manager: rkarlin
editor: ''

ms.assetid: 0001cad6-699c-4ca9-b66c-80c194e439a5
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 12/30/2019
ms.author: yelevin

---
# Connect F5 to Azure Sentinel

This article explains how to connect your F5 appliance to Azure Sentinel. The F5 data connector allows you to easily connect your F5 logs with Azure Sentinel, to view dashboards, create custom alerts, and improve investigation. Using F5 on Azure Sentinel will provide you more insights into your organization’s Internet usage, and will enhance its security operation capabilities.​ 

## Configure your F5 to send CEF messages

1. Go to [F5 Configuring Application Security Event Logging](https://techdocs.f5.com/kb/en-us/products/big-ip_asm/manuals/product/asm-implementations-11-5-0/12.html), and follow the instructions to set up remote logging, using the following guidelines:
   - Set the **Remote storage type** to **CEF**.
   - Set the **Protocol** to **TCP**.
   - Set the **IP address** to the Syslog server IP address.
   - Set the **port number** to **514**, or the port you set your agent to use.
   - You can set the **Maximum Query String Size** to the size you set in your agent.

1. To use the relevant schema in Log Analytics for the CEF events, search for `CommonSecurityLog`.

1. Continue to [STEP 3: Validate connectivity](connect-cef-verify.md).


## Next steps
In this document, you learned how to connect F5 to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats.md).
- [Use workbooks](tutorial-monitor-your-data.md) to monitor your data.

