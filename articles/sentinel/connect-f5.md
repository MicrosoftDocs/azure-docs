---
title: Connect F5 ASM data to Azure Sentinel| Microsoft Docs
description: Learn how to use the F5 ASM data connector to pull F5 ASM logs into Azure Sentinel. View F5 ASM data in workbooks, create alerts, and improve investigation.
services: sentinel
documentationcenter: na
author: yelevin
manager: rkarlin
editor: ''

ms.assetid: 0001cad6-699c-4ca9-b66c-80c194e439a5
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 05/20/2020
ms.author: yelevin

---
# Connect F5 ASM to Azure Sentinel

This article explains how to use the F5 ASM data connector to easily pull your F5 ASM logs into Azure Sentinel. This allows you to view F5 ASM data in workbooks, use it to create custom alerts, and incorporate it to improve investigation. Having F5 ASM data in Azure Sentinel will provide you more insights into your organization’s web application security, and will enhance your security operations capabilities.​ 

## Configure your F5 ASM to send CEF messages

1. Follow the instructions in [F5 Configuring Application Security Event Logging](https://techdocs.f5.com/kb/en-us/products/big-ip_asm/manuals/product/asm-implementations-11-5-0/12.html) to set up remote logging, using the following guidelines:
   - Set the **Remote storage type** to **CEF**.
   - Set the **Protocol** to **TCP**.
   - Set the **IP address** to the Syslog server IP address.
   - Set the **port number** to **514**, or the port you set your agent to use.
   - You can set the **Maximum Query String Size** to the size you set in your agent.

1. To use the relevant schema in Log Analytics for CEF events, search for `CommonSecurityLog`.

1. Continue to [STEP 3: Validate connectivity](connect-cef-verify.md).


## Next steps
In this document, you learned how to connect F5 ASM to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats.md).
- [Use workbooks](tutorial-monitor-your-data.md) to monitor your data.

