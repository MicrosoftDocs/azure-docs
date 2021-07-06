---
title: Connect NXLog Windows DNS Logs data to Azure Sentinel | Microsoft Docs
description: Learn how to use the NXLog DNS Logs data connector to pull Windows DNS events into Azure Sentinel. View Windows DNS data in workbooks, create alerts, and improve investigation.
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
ms.date: 03/02/2021
ms.author: yelevin

---
# Connect your NXLog Windows DNS Logs to Azure Sentinel

> [!IMPORTANT]
> The NXLog DNS Logs connector is currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

[!INCLUDE [reference-to-feature-availability](includes/reference-to-feature-availability.md)]

The [NXLog DNS Logs](https://nxlog.co/documentation/nxlog-user-guide/windows-dns-server.html) connector allows you to easily export all your Windows DNS Server events to Azure Sentinel in real time, giving you insight into domain name server activity throughout your organization. It employs high performance [Event Tracing for Windows (ETW)](https://nxlog.co/documentation/nxlog-user-guide/windows-dns-server.html#dns_windows_etw) for collecting both Audit and Analytical DNS Server events in real-time and supports event enrichment with custom fields. Integration between NXLog DNS Logs and Azure Sentinel is facilitated via REST API.

> [!NOTE]
> Data will be stored in the geographic location of the workspace on which you are running Azure Sentinel.

## Configure and connect NXLog DNS Logs

NXLog can be configured to send events in JSON format directly to Azure Sentinel.

1. In the Azure Sentinel portal, click **Data connectors** and select **NXLog DNS Logs** connector.

1. Select **Open connector page**.

1. Follow the step-by-step instructions in the *NXLog User Guide* Integration topic [Microsoft Azure Sentinel](https://nxlog.co/documentation/nxlog-user-guide/sentinel.html) to configure forwarding via REST API.

## Find your data

After a successful connection is established, the data appears in **Logs** under the  **Custom Logs** section, in the *DNS_Logs_CL* table.

## Validate connectivity

It may take up to 20 minutes until your logs start to appear in Log Analytics.

## Next steps

In this document, you learned how to use NXLog to ingest Windows DNS logs into Azure Sentinel. To learn more about Azure Sentinel, see the following articles:

- Learn how to [get visibility into your data and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats-built-in.md).
- [Use workbooks](tutorial-monitor-your-data.md) to monitor your data.
