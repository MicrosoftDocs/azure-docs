---
title: Debug issues with the SAP CDC connector by sending logs
titleSuffix: Azure Data Factory
description: Learn how to debug issues with the Azure Data Factory SAP CDC (change data capture) connector by sending self-hosted integration runtime logs to Microsoft.
author: ukchrist
ms.service: data-factory
ms.subservice: data-movement
ms.custom: ignite-2022
ms.topic: conceptual
ms.date: 07/20/2023
ms.author: ulrichchrist
---

# Debug issues with the SAP CDC connector by sending self-hosted integration runtime logs

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

If you want Microsoft to debug Azure Data Factory issues with your SAP CDC connector, send us your self-hosted integration runtime logs, and then contact us.

## Send logs to Microsoft

1. On the computer running the self-hosted integration runtime, open Microsoft Integration Runtime Configuration Manager.

1. Select the **Diagnostics** tab. Under **Logging**, select **Send logs**.

   :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-shir-diagnostics-send-logs.png" alt-text="Screenshot of the Integration Runtime Configuration Manager Diagnostics tab, with Send logs highlighted.":::

1. Enter or select the information that's requested, and then select **Send logs**.

## Contact Microsoft support

After you've uploaded and sent your self-hosted integration runtime logs, contact Microsoft support. In your support request, include the Report ID and Timestamp values that are shown in the confirmation:

:::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-diagnostics-report-id.png" alt-text="Screenshot of the self-hosted integration runtime's diagnostic log confirmation, with Report ID and Timestamp highlighted.":::

## Next steps

[SAP CDC (Change Data Capture) Connector](connector-sap-change-data-capture.md)
