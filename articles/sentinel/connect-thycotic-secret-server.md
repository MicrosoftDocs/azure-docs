---
title: Connect Dynamics 365 logs to Azure Sentinel | Microsoft Docs
description: Learn to use the Dynamics 365 Common Data Service (CDS) activities connector to bring in information about ongoing admin, user, and support activities.
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
ms.date: 12/13/2020
ms.author: yelevin

---
# Connect your Thycotic Secret Server to Azure Sentinel

> [!IMPORTANT]
> The Thycotic Secret Server connector is currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

This article explains how to connect your Thycotic Secret Server appliance to Azure Sentinel. The Thycotic Secret Server data connector allows you to easily connect your Thycotic Secret Server logs with Azure Sentinel, to view dashboards, create custom alerts, and improve investigation. Integration between Thycotic and Azure Sentinel makes use of the CEF Data Connector to properly parse and display Secret Server Syslog messages.

> [!NOTE]
> Data will be stored in the geographic location of the workspace on which you are running Azure Sentinel.

## Configure and connect Thycotic Secret Server logs to the Syslog agent  

Configure Thycotic Secret Server to forward Syslog messages in CEF format to your Azure workspace via the Syslog agent. If you don't have such a log forwarding server, see [these instructions](https://docs.microsoft.com/en-us/azure/sentinel/connect-cef-agent) to get one up and running.


1. In the Azure Sentinel portal, click Data connectors, select Thycotic Secret Server and then Open connector page.
2. Follow the [configure Secret Server](https://thy.center/ss/link/syslog) instructions to configure sending syslog data to the log forwarding server.
3. Validate your connection and verify data ingestion using these [instructions](https://docs.microsoft.com/en-us/azure/sentinel/connect-cef-verify). It may take up to 20 minutes until your logs start to appear in Log Analytics.

## Find your data

After a successful connection is established, the data appears in Logs, under the Azure Sentinel section, in the CommonSecurityLog table.

To query the Thycotic logs in Log Analytics, enter CommonSecurityLog at the top of the query window.


## Next steps
In this document, you learned how to connect Thycotic Secret Server to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats-built-in.md).
- [Use workbooks](tutorial-monitor-your-data.md) to monitor your data.