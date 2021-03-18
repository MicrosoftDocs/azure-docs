---
title: Connect BETTER Mobile Threat Defense (MTD) to Azure Sentinel | Microsoft Docs
description: Learn how to use the BETTER Mobile Threat Defense (MTD) data connector to pull MTD logs into Azure Sentinel. View MTD data in workbooks, create alerts, and improve investigation.
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

# Connect your BETTER Mobile Threat Defense (MTD) to Azure Sentinel

> [!IMPORTANT]
> The BETTER Mobile Threat Defense (MTD) connector is currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

The BETTER Mobile Threat Defense (MTD) connector allows you to easily connect all your BETTER MTD security solution logs with your Azure Sentinel, to view dashboards, create custom alerts, and improve investigation. Integration between BETTER Mobile Threat Defense and Azure Sentinel makes use of REST API.

> [!NOTE]
> Data will be stored in the geographic location of the workspace on which you are running Azure Sentinel.

## Configure and connect BETTER Mobile Threat Defense

BETTER MTD can integrate and export logs directly to Azure Sentinel.

1. In the Azure Sentinel navigation menu, select **Data connectors**.

1. From the **Data connectors** gallery, select **BETTER Mobile Threat Defense (MTD) (Preview)** and then **Open connector page**.

1. Follow the steps on the connector page and on [this page from the BETTER MTD Documentation](https://mtd-docs.bmobi.net/integrations/azure-sentinel/setup-integration#mtd-integration-configuration) to finalize the integration on BETTER MTD Console.

    When requested to enter the **Workspace ID** and **Primary Key** values, copy them from the Azure Sentinel connector page and paste them into the BETTER MTD configuration.

    :::image type="content" source="media/connectors/workspace-id-primary-key.png" alt-text="{Workspace ID and primary key}":::

## Find your data

After a successful connection is established, the data appears in **Logs**, under the **CustomLogs** section, in one or more of the following tables:
- `BetterMTDDeviceLog_CL`
- `BetterMTDIncidentLog_CL`
- `BetterMTDAppLog_CL`
- `BetterMTDNetflowLog_CL`

To query the BETTER MTD logs in analytics rules, hunting queries, or anywhere else in Azure Sentinel, enter one of the above table names at the top of the query window.

## Validate connectivity

It may take up to 20 minutes until your logs start to appear in Log Analytics. 

## Next steps

In this document, you learned how to connect BETTER Mobile Threat Defense (MTD) to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:
- Learn how to [get visibility into your data and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats-built-in.md).
- [Use workbooks](tutorial-monitor-your-data.md) to monitor your data.
