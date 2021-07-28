---
title: Connect Illusive Attack Management System data to Azure Sentinel| Microsoft Docs
description: Learn how to connect Illusive Attack Management System data to Azure Sentinel.
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
ms.date: 07/17/2020
ms.author: yelevin

---
# Connect your Illusive Attack Management System to Azure Sentinel

> [!IMPORTANT]
> The Illusive Attack Management System data connector in Azure Sentinel is currently in public preview.
> This feature is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

[!INCLUDE [reference-to-feature-availability](includes/reference-to-feature-availability.md)]

This article explains how to connect your [Illusive Attack Management System](https://www.illusivenetworks.com/technology/platform/attack-detection-system) to Azure Sentinel. The Illusive Attack Management System data connector allows you to share Illusive’s attack surface analysis data and incident logs with Azure Sentinel and view this information in dedicated dashboards that offer insight into your organization’s attack surface risk (ASM Dashboard) and track unauthorized lateral movement in your organization’s network (ADS Dashboard).

> [!NOTE]
> Data will be stored in the geographic location of the workspace on which you are running Azure Sentinel.

## Forward Illusive Attack Management System logs to the Syslog agent  

Configure Attack Management System to forward Syslog messages in CEF format to your Azure workspace via the Syslog agent.

1. Log onto the Illusive Console, and navigate to Settings->Reporting.

1. Find Syslog servers.

1. Supply the following information:
   - Host name: Linux Syslog agent IP address or FQDN host name
   - Port: 514
   - Protocol: TCP
   - Audit messages: Send audit messages to server

1. To add the syslog server, click Add.

1. To use the relevant schema in **Logs** for the Illusive Attack Management System, search for **CommonSecurityLog**.

## Next steps

In this document, you learned how to connect Illusive Attack Management System to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:

- Learn how to [get visibility into your data, and potential threats](get-visibility.md).
- Get started [detecting threats with Azure Sentinel](detect-threats-built-in.md).
- [Use workbooks](tutorial-monitor-your-data.md) to monitor your data.
