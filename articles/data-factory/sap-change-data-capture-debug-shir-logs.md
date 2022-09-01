---
title: SAP change data capture solution (Preview) - Debug issues using SHIR logs
titleSuffix: Azure Data Factory
description: This article describes how to debug issues with Copy activity for SAP change data capture (Preview) using self-hosted integration runtime logs in Azure Data Factory.
author: ukchrist
ms.service: data-factory
ms.subservice: data-movement
ms.topic: conceptual
ms.date: 06/01/2022
ms.author: ulrichchrist
---

# Debug Data Factory copy activity issues by sending self-hosted integration runtime logs

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

If you want us to debug your Data Factory copy activity issues, send Microsoft your self-hosted integration runtime logs. To do so, complete the following steps.

## Send logs to Microsoft

On the computer running the self-hosted integration runtime, open the Microsoft Integration Runtime Configuration Manager app, select the Diagnostics tab, select the Send logs button, and select the Send Logs button again on dialog window that pops up.

:::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-shir-diagnostics-send-logs.png" alt-text="Screenshot of the self-hosted integration runtime configuration manager's Diagnostics tab highlighting the send logs button.":::

## Contact support

When self-hosted integration runtime logs have been uploaded/sent to us and you are contacting support, provide the Report ID and Timestamp values displayed on the dialog window.

:::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-diagnostics-report-id.png" alt-text="Screenshot of the self-hosted integration runtime's diagnostic log dialog with the Report ID and Timestamp highlighted.":::

## Next steps

[Auto-generate ADF pipeline from SAP data partitioning template](sap-change-data-capture-data-partitioning-template.md)
