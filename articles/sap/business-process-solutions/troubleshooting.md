---
title: Troubleshoot Common Issues
description: Identify and track common Business Process Solutions issues and workarounds.
author: mohitmakhija1
ms.author: momakhij
ms.service: sap-on-azure
ms.subservice: center-sap-solutions
ms.topic: troubleshooting
ms.date: 02/11/2026
---

# Troubleshoot known issues

This article helps you to quickly diagnose and remediate known issues that you might encounter in Business Process Solutions. Each section summarizes symptoms, root cause, and the exact steps to fix and validate.

## Issue with semantic model refresh

For some semantic models, the refresh might fail with the following error message:

`Data source error: Expression.Error: The column 'MANDT' of the table wasn't found. MANDT. Microsoft.Data.Mashup.ErrorCode = 10224.`

:::image type="content" source="./media/troubleshooting/semantic-model-refresh-error.png" alt-text="Screenshot that shows the semantic model refresh error." lightbox="./media/troubleshooting/semantic-model-refresh-error.png":::

To resolve this issue, you need to use the Power BI desktop to refresh the semantic model. Follow these steps:

1. Install the latest version of the Power BI desktop from Microsoft Marketplace.
1. Go to your workspace.
1. Open the semantic model that fails to refresh. Select **File** > **Download this file**.

    :::image type="content" source="./media/troubleshooting/download-semantic-model.png" alt-text="Screenshot that shows how to download the semantic model." lightbox="./media/troubleshooting/download-semantic-model.png":::

1. Open the downloaded file on the Power BI desktop and select **Refresh**. You might be prompted to sign in. After you sign in, the refresh finishes successfully.
1. Publish the semantic model back to the workspace. Select the publish button on the Power BI desktop, and select the workspace to publish.

## Gold view creation notebook failing for vtPURGDOCUMENTCATEGORYTEXT view creation

When you run the Gold view creation notebook for the first time from the orchestration pipeline, it might fail while it creates the `vtPURGDOCUMENTCATEGORYTEXT` view with the following error message:

`Notebook execution failed at Notebook service with http status code - '200', please check the Run logs on Notebook, additional details - 'Error name - ProgrammingError, Error value - ('ID - 43bd12c2-6e77-4466-a33e-25facde8939d | traceid = 729aa4f3-f4b1-4046-9717-466d58a41af9 42S02', "[42S02] [Microsoft][ODBC Driver 18 for SQL Server][SQL Server] Invalid object name 'I_PURGDOCUMENTCATEGORYTEXT'. (208) (SQLExecDirectW)")'`

This error occurs because the view `vtPURGDOCUMENTCATEGORYTEXT` depends on the tables `SAPLANGUAGE`, `I_PURGDOCUMENTCATEGORYTEXT`, and `I_PURCHASINGDOCUMENTCATEGORY`, but the check for the existence of these tables is incorrect in the notebook.

To solve this issue, follow these steps:

1. Go to your workspace.
1. Open the notebook **bps_gold_view_creation**.

   :::image type="content" source="./media/troubleshooting/gold-view-notebook.png" alt-text="Screenshot that shows how to open the bps_gold_view_creation notebook." lightbox="./media/troubleshooting/gold-view-notebook.png":::

1. Open the search bar in the notebook and search for `vtPURGDOCUMENTCATEGORYTEXT`.
1. You find a cell with the SQL code that creates the view. In that cell, you need to change the code to check for the existence of the tables `SAPLANGUAGE`, `I_PURGDOCUMENTCATEGORYTEXT`, and `I_PURCHASINGDOCUMENTCATEGORY`. You can see the part of the code that needs to be changed in the following image.

   :::image type="content" source="./media/troubleshooting/gold-view-notebook-error.png" alt-text="Screenshot that shows the SQL code to create the vtPURGDOCUMENTCATEGORYTEXT view." lightbox="./media/troubleshooting/gold-view-notebook-error.png":::

## Related content

- [Introduction to Business Process Solutions](about-business-process-solutions.md)
- [Run extraction and data processing in Business Process Solutions](run-extraction-data-processing.md)
