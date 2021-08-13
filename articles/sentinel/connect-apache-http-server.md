---
title: Connect your Apache HTTP Server to Azure Sentinel | Microsoft Docs
description: Learn how to use the Apache HTTP Server connector to pull Apache logs into Azure Sentinel. View Apache data in workbooks, create alerts, and improve investigation.
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
ms.date: 02/03/2021
ms.author: yelevin
---
# Connect your Apache HTTP Server to Azure Sentinel

> [!IMPORTANT]
> The Apache HTTP Server connector is currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

[!INCLUDE [reference-to-feature-availability](includes/reference-to-feature-availability.md)]

This article explains how to connect your Apache HTTP Server to Azure Sentinel. The Apache HTTP Server connector allows you to easily ingest your Apache HTTP Server logs to Azure Sentinel, so that you can view the data in workbooks, query it to create custom alerts, and incorporate it to improve investigation. Integration between Apache HTTP Server and Azure Sentinel makes use of local file processing by the Log Analytics agent.

> [!NOTE]
> Data will be stored in the geographic location of the workspace on which you are running Azure Sentinel.

## Prerequisites

- You must have write permission on the Azure Sentinel workspace.

## Configure and integrate Apache HTTP Server logs via Log Analytics agent

Configure Apache HTTP Server to send log files to your Azure workspace via the Log Analytics agent.
Configure Log Analytics agent to read Apache HTTP Server log files.

1. Follow instructions at https://httpd.apache.org/docs/2.4/logs.html to set up log files location in Apache HTTP Server.

1. In the Azure Sentinel navigation menu, select **Data connectors** and then select **Apache HTTP Server (Preview)**.

1. Select **Open connector page**.

1. Follow the instructions on the Apache HTTP Server page.

## Find your data

After a successful connection is established, the data appears in Log Analytics under ApacheHTTPServer_CL.

## Validate connectivity

It may take up to 20 minutes until your logs start to appear in Log Analytics.

## Next steps

In this document, you learned how to connect Apache HTTP Server to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:

- Learn how to [get visibility into your data and potential threats](get-visibility.md).
- Get started [detecting threats with Azure Sentinel](detect-threats-built-in.md).
- [Use workbooks](/azure/sentinel/articles/sentinel/monitor-your-data.md) to monitor your data.