---
title: Connect Cisco Umbrella to Azure Sentinel | Microsoft Docs
description: Learn how to use the Cisco Umbrella data connector to pull Umbrella data into Azure Sentinel. View Umbrella data in workbooks, create alerts, and improve investigation.
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
ms.date: 02/03/2021
ms.author: yelevin

---
# Connect your Cisco Umbrella to Azure Sentinel

> [!IMPORTANT]
> The Cisco Umbrella connector is currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

The Cisco Umbrella connector allows you to easily connect all your Cisco Umbrella security solution logs with your Azure Sentinel, to view dashboards, create custom alerts, and improve investigation. Integration between Cisco Umbrella and Azure Sentinel makes use of REST API.

> [!NOTE]
> Data will be stored in the geographic location of the workspace on which you are running Azure Sentinel.

## Configure and connect Cisco Umbrella

Cisco Umbrella can integrate and export logs directly to Azure Sentinel.

1. In the Azure Sentinel navigation menu, select **Data connectors**.

1. From the **Data connectors** gallery, select **Cisco Umbrella (Preview)** and then **Open connector page**.

1. Follow the steps described in the **Configuration** section of the connector page.

## Find your data

After a successful connection is established, the data appears in **Logs**, under the **CustomLogs** section, in one or more of the following tables:
- `Cisco_Umbrella_dns_CL`
- `Cisco_Umbrella_proxy_CL`
- `Cisco_Umbrella_ip_CL`
- `Cisco_Umbrella_cloudfirewall_CL`

## Validate connectivity

It may take up to 20 minutes until your logs start to appear in Log Analytics.

## Next steps

In this document, you learned how to connect Cisco Umbrella data to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:

- Learn how to [get visibility into your data and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats-built-in.md).
- [Use workbooks](tutorial-monitor-your-data.md) to monitor your data.
