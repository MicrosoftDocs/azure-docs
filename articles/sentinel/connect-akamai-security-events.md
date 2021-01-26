---
title: Connect <PRODUCT NAME> data to Azure Sentinel | Microsoft Docs
description: Learn how to use the <PRODUCT NAME> connector to pull <PRODUCT NAME> logs into Azure Sentinel. View <PRODUCT NAME> data in workbooks, create alerts, and improve investigation.
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
ms.date: 01/26/2021
ms.author: yelevin
---
# Connect your Akamai Page Integrity to Azure Sentinel

> [!IMPORTANT]
> The <PRODUCT NAME> connector is currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

This article explains how to connect your Akamai Page Integrity appliance to Azure Sentinel. The Akamai Page Integrity data connector allows you to easily connect your Akamai Page Integrity logs with Azure Sentinel, to view dashboards, create custom alerts, and improve investigation.

> [!NOTE]
> Data will be stored in the geographic location of the workspace on which you are running Azure Sentinel.

## Forward Akamai Page Integrity logs to the Syslog agent  

Configure Akamai Page Integrity to forward Syslog messages in CEF format to your Azure workspace via the Syslog agent.

1. Follow the instructions at https://developer.akamai.com/tools/integrations/siem/siem-cef-connector to set up sample CEF connector which receives security events in near real time using the SIEM OPEN API and converts them from JSON into CEF format.

1. To use the relevant schema in Log Analytics for the Akamai Page Integrity, search for CommonSecurityLog.

1. Continue to [STEP 3: Validate connectivity](connect-cef-verify.md).

## Next steps

In this document, you learned how to connect Akamai Page Integrity to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:

- Learn how to [get visibility into your data and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats-built-in.md).
- [Use workbooks](tutorial-monitor-your-data.md) to monitor your data.
