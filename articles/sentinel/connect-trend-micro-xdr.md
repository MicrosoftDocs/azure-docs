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
# Connect your Trend Micro XDR to Azure Sentinel

> [!IMPORTANT]
> The <PRODUCT NAME> connector is currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

Trend Micro XDR connector allows you to easily connect your Trend Micro XDR workbench alert logs with your Azure Sentinel, to view dashboards, create custom alerts, and improve investigation. Integration between Trend Micro XDR and Azure Sentinel makes use of REST API.

> [!NOTE]
> Data will be stored in the geographic location of the workspace on which you are running Azure Sentinel.

## Configure and connect Trend Micro XDR 

Trend Micro XDR can integrate and export logs directly to Azure Sentinel.

1. In the Azure Sentinel portal, click Data connectors and select Trend Micro XDR and then Open connector page.

1. Select Open connector Page.

1. Follow the instuctions on the Trend Micro XDR page. 

## Find your data

After a successful connection is established, the data appears in Log Analytics under CustomLogs TrendMicro_XDR_CL.
To use the relevant schema in Log Analytics for the Trend Micro XDR, search for TrendMicro_XDR_CL.

## Validate connectivity

It may take up to 15 minutes until your logs start to appear in Log Analytics. 

## Next steps

In this document, you learned how to connect Trend Micro XDR to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:

- Learn how to [get visibility into your data and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats-built-in.md).
- [Use workbooks](tutorial-monitor-your-data.md) to monitor your data.
