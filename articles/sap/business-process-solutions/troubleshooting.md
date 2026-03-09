---
title: Troubleshooting common issues
description: Identify and track common Business Process Solutions issues and workarounds.
author: mohitmakhija1
ms.author: momakhij
ms.service: sap-on-azure
ms.subservice: center-sap-solutions
ms.topic: troubleshooting
ms.date: 02/11/2026
---

# Troubleshooting known issues

Within the Business Process Solutions, we recognize that there are many moving parts. This article is intended to help you troubleshoot known issues that you can encounter. Use this article to quickly diagnose and remediate known issues. Each section summarizes symptoms, root cause, and the exact steps to fix and validate.

## Issue with semantic model refresh

For some semantic models, the refresh might fail with the following error message:
Data source error: Expression.Error: The column 'MANDT' of the table wasn't found. MANDT. Microsoft.Data.Mashup.ErrorCode = 10224.

:::image type="content" source="./media/troubleshooting/semantic-model-refresh-error.png" alt-text="Screenshot showing the semantic model refresh error." lightbox="./media/troubleshooting/semantic-model-refresh-error.png":::

To resolve this issue, you need to refresh this semantic model using Power BI desktop. Follow these steps:

1. Install the latest version of Power BI desktop from Microsoft store.
2. Navigate to your workspace.
3. Open the semantic model that's failing to refresh. Click on File -> Download this file.
    :::image type="content" source="./media/troubleshooting/download-semantic-model.png" alt-text="Screenshot showing how to download the semantic model." lightbox="./media/troubleshooting/download-semantic-model.png":::
4. Open the downloaded file in Power BI desktop and click on Refresh. You might be prompted to sign in. Once you sign in, the refresh should complete successfully.
5. After the refresh is successful, publish the semantic model back to the workspace. Click on the publish button in Power BI desktop and select the workspace to publish.

## Gold view creation notebook failing for vtPURGDOCUMENTCATEGORYTEXT view creation

When you run the gold view creation notebook for the first time from the orchestration pipeline, it might fail while creating the vtPURGDOCUMENTCATEGORYTEXT view with the following Error Message:

'Notebook execution failed at Notebook service with http status code - '200', please check the Run logs on Notebook, additional details - 'Error name - ProgrammingError, Error value - ('ID - 43bd12c2-6e77-4466-a33e-25facde8939d | traceid = 729aa4f3-f4b1-4046-9717-466d58a41af9 42S02', "[42S02] [Microsoft][ODBC Driver 18 for SQL Server][SQL Server] Invalid object name 'I_PURGDOCUMENTCATEGORYTEXT'. (208) (SQLExecDirectW)")''

This error occurs because the view vtPURGDOCUMENTCATEGORYTEXT depends on the tables SAPLANGUAGE, I_PURGDOCUMENTCATEGORYTEXT, I_PURCHASINGDOCUMENTCATEGORY, but the check for the existence of these tables is incorrect in the notebook.

To solve this issue, you can follow these steps:

1. Navigate to your workspace.
2. Open the notebook **bps_gold_view_creation**.
   :::image type="content" source="./media/troubleshooting/gold-view-notebook.png" alt-text="Screenshot showing how to open the bps_gold_view_creation notebook." lightbox="./media/troubleshooting/gold-view-notebook.png":::
3. Open the search bar in the notebook and search for 'vtPURGDOCUMENTCATEGORYTEXT'.
4. You find a cell with the SQL code that creates the view. In that cell, you need to change the code to check for the existence of the tables SAPLANGUAGE, I_PURGDOCUMENTCATEGORYTEXT, I_PURCHASINGDOCUMENTCATEGORY. In the following image you can see the part of the code that needs to be changed:
   :::image type="content" source="./media/troubleshooting/gold-view-notebook-error.png" alt-text="Screenshot showing the SQL code to create the vtPURGDOCUMENTCATEGORYTEXT view." lightbox="./media/troubleshooting/gold-view-notebook-error.png":::

## Next steps

- [Introduction to Business Process Solutions](about-business-process-solutions.md)
- [Run extraction and data processing in Business Process Solutions](run-extraction-data-processing.md)
