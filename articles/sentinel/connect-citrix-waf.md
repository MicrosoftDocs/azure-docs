---
title: Connect Citrix WAF data to Azure Sentinel| Microsoft Docs
description: Learn how to use the Citrix WAF data connector to pull its logs into Azure Sentinel. View Citrix WAF data in workbooks, create alerts, and improve investigation.
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
ms.date: 10/25/2020
ms.author: yelevin

---

# Connect your Citrix WAF to Azure Sentinel

> [!IMPORTANT]
> The Citrix Web Application Firewall (WAF) data connector in Azure Sentinel is currently in public preview. This feature is provided without a service level agreement. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

[!INCLUDE [reference-to-feature-availability](includes/reference-to-feature-availability.md)]

This article explains how to connect your Citrix Web Application Firewall (WAF) appliance to Azure Sentinel. The Citrix WAF data connector allows you to easily connect your Citrix WAF logs with Azure Sentinel, to view dashboards, create custom alerts, and improve investigation. By connecting Citrix WAF CEF logs to Azure Sentinel, you can take advantage of search and correlation, alerting, and threat intelligence enrichment for each log.

> [!NOTE]
> Data will be stored in the geographic location of the workspace on which you are running Azure Sentinel.

## Forward Citrix WAF logs to the Syslog agent  

Citrix WAF sends Syslog messages in CEF format to a Linux-based log forwarding server (running rsyslog or syslog-ng) with the Log Analytics agent installed on it, which forwards the logs to your Azure Sentinel workspace.

1. If you don't have such a log forwarding server, see [these instructions](connect-cef-agent.md) to get one up and running.

1. Follow Citrix's supplied instructions to [configure the WAF](https://support.citrix.com/article/CTX234174), [configure CEF logging](https://support.citrix.com/article/CTX136146), and [configure sending the logs to your log forwarder](https://docs.citrix.com/en-us/citrix-adc/13/system/audit-logging/configuring-audit-logging.html). Make sure you send the logs to TCP port 514 on the log forwarder machine's IP address.

1. Validate your connection and verify data ingestion using [these instructions](connect-cef-verify.md). It may take up to 20 minutes until your logs start to appear in Log Analytics.

## Find your data

After a successful connection is established, the data appears in **Logs**, under the **Azure Sentinel** section, in the *CommonSecurityLog* table.

To query the Citrix WAF logs in Log Analytics, enter `CommonSecurityLog` at the top of the query window.

## Next steps

In this document, you learned how to connect Citrix WAF to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](get-visibility.md).
- Get started [detecting threats with Azure Sentinel](detect-threats-built-in.md).
- [Use workbooks](/azure/sentinel/articles/sentinel/monitor-your-data.md) to monitor your data.