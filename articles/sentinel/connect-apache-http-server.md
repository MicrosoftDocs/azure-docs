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
# Connect your Apache HTTP Server to Azure Sentinel

> [!IMPORTANT]
> The <PRODUCT NAME> connector is currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

Apache HTTP Server connector allows you to easily connect all your Apache HTTP Server logs with your Azure Sentinel, to view dashboards, create custom alerts, and improve investigation. Integration between Apache HTTP Server and Azure Sentinel makes use of file processing.

> [!NOTE]
> Data will be stored in the geographic location of the workspace on which you are running Azure Sentinel.

## Configure and integrate Apache HTTP Server logs via Log Analytics agent

Configure Apache HTTP Server log files location to forward data to your Azure workspace via the Log Analytics agent.
Configure Log Analytics agent to read Apache HTTP Server log files.

1. Follow instructions at https://httpd.apache.org/docs/2.4/logs.html to set up log files location in Apache HTTP Server.

1. In the Azure portal, navigate to Azure Sentinel > Data connectors and then select the Apache HTTP Server connector.

1. Select Open connector page.

1. Follow the instructions on the Apache HTTP Server page.

## Find your data

After a successful connection is established, the data appears in Log Analytics under ApacheHTTPServer_CL.

## Validate connectivity

It may take up to 20 minutes until your logs start to appear in Log Analytics.

## Next steps

In this document, you learned how to connect Apache HTTP Server to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:

- Learn how to [get visibility into your data and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats-built-in.md).
- [Use workbooks](tutorial-monitor-your-data.md) to monitor your data.
