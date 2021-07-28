---
title: Connect Beyond Security beSECURE data to Azure Sentinel | Microsoft Docs
description: Learn how to use the Beyond Security beSECURE data connector to pull beSECURE logs into Azure Sentinel. View beSECURE data in workbooks, create alerts, and improve investigation.
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

# Connect your Beyond Security beSECURE to Azure Sentinel

> [!IMPORTANT]
> The Beyond Security beSECURE connector is currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

[!INCLUDE [reference-to-feature-availability](includes/reference-to-feature-availability.md)]

The Beyond Security beSECURE connector allows you to easily connect all your beSECURE security solution logs with your Azure Sentinel, to view dashboards, create custom alerts, and improve investigation. Integration between beSECURE and Azure Sentinel makes use of REST API.

> [!NOTE]
> Data will be stored in the geographic location of the workspace on which you are running Azure Sentinel.

## Configure and connect beSECURE

beSECURE can integrate with and export logs directly to Azure Sentinel.

1. In the Azure Sentinel navigation menu, select **Data connectors**.

1. From the **Data connectors** gallery, select **Beyond Security beSECURE (Preview)** and then **Open connector page**.

1. Follow the steps below to configure your beSECURE solution to send out scan results, scan status and audit trail logs to Azure Sentinel.

    **Access the Integration menu:**
    1. Click on the 'More' menu option

    1. Select Server

    1. Select Integration

    1. Enable Azure Sentinel

    **Provide beSECURE with Azure Sentinel settings:**

      Copy the *Workspace ID* and *Primary Key* values from the Azure Sentinel connector page, paste them in the beSECURE configuration, and click **Modify**.
      
      :::image type="content" source="media/connectors/workspace-id-primary-key.png" alt-text="{Workspace ID and primary key}":::

## Find your data

After a successful connection is established, the data appears in **Logs**, under the **CustomLogs** section, in one or more of the following tables:
  - `beSECURE_ScanResults_CL`
  - `beSECURE_ScanEvents_CL`
  - `beSECURE_Audit_CL`

To query the beSECURE logs in analytics rules, hunting queries, investigations, or anywhere else in Azure Sentinel, enter one of the above table names at the top of the query window.

## Validate connectivity
It may take up to 20 minutes until your logs start to appear in Log Analytics.

## Next steps
In this document, you learned how to connect beSECURE to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:
- Learn how to [get visibility into your data and potential threats](get-visibility.md).
- Get started [detecting threats with Azure Sentinel](detect-threats-built-in.md).
- [Use workbooks](tutorial-monitor-your-data.md) to monitor your data.
