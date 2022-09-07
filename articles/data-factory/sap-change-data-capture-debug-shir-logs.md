---
title: Debug copy activity issues in your SAP CDC solution by using self-hosted integration runtime logs
titleSuffix: Azure Data Factory
description: Learn how to debug issues with the Azure Data Factory copy activity for your SAP change data capture (CDC) solution by using self-hosted integration runtime logs.
author: ukchrist
ms.service: data-factory
ms.subservice: data-movement
ms.topic: conceptual
ms.date: 06/01/2022
ms.author: ulrichchrist
---

# Debug Data Factory copy activity by sending self-hosted integration runtime logs

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

If you want Microsoft to debug Azure Data Factory copy activity issues in your SAP change data capture (CDC) solution, send us your self-hosted integration runtime logs.

## Send logs to Microsoft

On the computer running the self-hosted integration runtime, open Microsoft Integration Runtime Configuration Manager. Select the **Diagnostics** tab. Under **Logging**, select **Send logs**. Enter or select the information that's requested, and then select **Send Logs**.

:::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-shir-diagnostics-send-logs.png" alt-text="Screenshot of self-hosted integration runtime configuration manager's Diagnostics tab, with Send logs highlighted.":::

## Contact support

After you've uploaded and sent your self-hosted integration runtime logs, contact Microsoft support. In your support request, include the Report ID and Timestamp values that are shown in the confirmation:

:::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-diagnostics-report-id.png" alt-text="Screenshot of the self-hosted integration runtime's diagnostic log confirmation, with Report ID and Timestamp highlighted.":::

## Next steps

[Auto-generate a Data Factory pipeline from an SAP ODP data partitioning template](sap-change-data-capture-data-partitioning-template.md)
