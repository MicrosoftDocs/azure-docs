---
title: Connect WireX Systems Network Forensics Platform (NFP) to Azure Sentinel | Microsoft Docs
description: Learn how to use the WireX Systems NFP data connector to pull WireX NFP logs into Azure Sentinel. View WireX NFP data in workbooks, create alerts, and improve investigation.
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
ms.date: 01/12/2021
ms.author: yelevin

---
# Connect your WireX Systems Network Forensics Platform (NFP) appliance to Azure Sentinel

WireX Systems' Network Forensics Platform (NFP) **\<description\>**.

The WireX Systems NFP data connector allows you to easily connect your WireX Systems NFP logs with Azure Sentinel, to view dashboards, create custom alerts, and improve investigation. 

> [!IMPORTANT]
> The WireX Systems NFP connector is currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.


> [!NOTE] Data will be stored in the geographic location of the workspace on which you are running Azure Sentinel.

## Forward WireX Systems NFP logs to the Syslog agent  

Configure WireX Systems NFP to forward Syslog messages in CEF format to your Azure workspace via the Syslog agent.
1. Contact support for the proper configuration of your WireX Systems Network forensics platform.
2. To use the relevant schema in Log Analytics for the WireX Systems NFP search for CommonSecurityLog.
3. Continue to [STEP 3: Validate connectivity](connect-cef-verify.md).


## Next steps
In this document, you learned how to connect WireX Systems NFP to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats-built-in.md).
- [Use workbooks](tutorial-monitor-your-data.md) to monitor your data.