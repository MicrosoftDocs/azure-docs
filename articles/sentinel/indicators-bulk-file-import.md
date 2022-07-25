---
title: Add indicators in bulk to threat intelligence by file
titleSuffix: Microsoft Sentinel
description: Learn how to bulk add indicators to threat intelligence from flat files in Microsoft Sentinel. 
author: austinmccollum
ms.author: austinmc
ms.service: microsoft-sentinel
ms.topic: how-to
ms.date: 07/26/2022
ms.custom: template-how-to
#Customer intent: As a security analyst, I want to bulk import indicators from common file types to my threat intelligence (TI), so I can more effectively share TI during an investigation.
---

# Add indicators in bulk to Microsoft Sentinel threat intelligence from a CSV or JSON file

> [!IMPORTANT]
> The Import indicators in bulk by file feature is currently in PREVIEW. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

In this how-to guide, you'll add indicators from a CSV or JSON file into Microsoft Sentinel threat intelligence. A lot of threat intelligence sharing still happens across emails and other informal channels during an ongoing investigation. The ability to import indicators directly into Microsoft Sentinel threat intelligence allows you to quickly socialize emerging threats for your team and make them available to power other analytics such as producing security alerts, incidents, and automated responses.

## Prerequisites
- You must have read and write permissions to the Microsoft Sentinel workspace to store your threat indicators.

## Import indicators from a flat file
You've got a list of indicators ready to contribute, and inputting them [one by one in the UI](work-with-threat-indicators.md#create-a-new-indicator) isn't efficient. You can add multiple indicators to your threat intelligence by using a specially crafted CSV or JSON file. Download the file templates to get familiar with the fields and how they map to the data you have. Review the required fields for each template type to validate your data before importing.

1. From the [Azure portal](https://portal.azure.com), go to **Microsoft Sentinel**.

2. Select the workspace you want to import threat indicators into.

3. Go to **Threat Intelligence** under the **Threat Management** heading.

:::image type="content" source="media/indicators-bulk-file-import/import-using-file-menu-small.png" alt-text="Screenshot of the menu options to import indicators using a file menu." lightbox="media/indicators-bulk-file-import/import-using-file-menu-large.png":::

4. Select **Import** > **Import using a file**.

5. Choose CSV or JSON from the **File Format** drop down menu.

:::image type="content" source="media/indicators-bulk-file-import/format-select-and-download.png" alt-text="Screenshot of the menu flyout to upload a CSV or JSON file, choose a template to download, and specify a source highlighting the file format selection.":::


## Understand the templates

Download the bulk upload template of your choice. The templates provide all the fields you need to create a single valid indicator, including required fields and validation parameters. Replicate that structure to populate additional indicators in a single file.

### CSV template structure  

If you select the **CSV** file format, you'll need to choose between the **File indicators** or **All other indicator types** option from the **Indicator type** drop down menu. Because file indicators can have multiple hash types like MD5, SHA256, and more, the CSV template needs multiple columns to accommodate this indicator type. All other indicator types like IP addresses only require a type and the observable value.

:::image type="content" source="media/indicators-bulk-file-import/csv-example.png" alt-text="Screenshot of the CSV template highlighting the guidance in cell A1 and including example indicator data filled in.":::

The column headings for the CSV **All other indicator types** template include fields such as `threatTypes`, single or multiple `tags`, `confidence`, and `tlpLevel` or [Traffic Light Protocol](https://en.wikipedia.org/wiki/Traffic_Light_Protocol) level. Only the `validFrom`, `observableType` and `observableValue` fields are required.

### JSON template structure

The JSON template is the same for all indicator types.

> [!TIP]
> Each file upload requires a source. Consider grouping your import files by source.
>

## Upload the file

1. After entering your indicators to the template, consider changing the name of the file but keep the file extension as .csv or .json. When you create a unique file name, it will be easier to monitor your different file imports from the **Manage file imports** pane. 

2. Upload your indicator file to the **Upload a file** section. You can browse for the file or drag it to this area to upload.

3. Enter a source for the indicators in the **Source** text box. This value will be stamped on all the indicators included in that file. You can view this property as the **SourceSystem** field by [finding the indicators in the Logs](work-with-threat-indicators.md#find-and-view-your-indicators-in-logs). The source will also display in the **Manage file imports** pane.

4. Choose how you want Microsoft Sentinel to handle invalid indicator entries by selecting one of the radio buttons at the bottom of the **Import using a file** pane. 
-Import only the valid indicators and leave aside any invalid indicators from the file.
-Don't import any indicators if a single indicator in the file is invalid.

:::image type="content" source="media/indicators-bulk-file-import/upload-file-blade-small.png" alt-text="Screenshot of the menu flyout to upload a CSV or JSON file, choose a template to download, and specify a source highlighting the Import button." lightbox="media/indicators-bulk-file-import/upload-file-blade-large.png":::

5. Select the **Import** button.


## Manage file imports

After importing indicators from CSV or JSON files, you can monitor your imports and view error reports for partially imported or failed imports. 

1. Select the **Import** > **Manage file imports**.

:::image type="content" source="media/indicators-bulk-file-import/manage-file-imports-small.png" alt-text="Screenshot of the menu option to manage file imports.":::

2. The **Manage file imports** pane shows the imported files with their status, including the number of invalid indicator entries.

3. Here you'll be able to view and sort imports by **Source**, indicator file **Name**, the number **Imported**, the **Total** number of indicators in each file, or the **Created** date.

4. You can view a preview of the error file or download the error file containing the errors about invalid indicators.

Microsoft Sentinel maintains the status of the file import for 30 days. The actual file and the associated error file are maintained in the system for 24 hours. After 24 hours the file and the error file are deleted, and the ingested indicators will continue to show in the Threat Intelligence menu. 

## Next steps

This article has shown you how to manually bolster your threat intelligence by importing indicators gathered in flat files. Check out these links to learn how indicators power other analytics in Microsoft Sentinel.
- [Work with threat indicators in Microsoft Sentinel](work-with-threat-indicators.md)
- [Threat indicators for cyber threat intelligence in Microsoft Sentinel](/azure/architecture/example-scenario/data/sentinel-threat-intelligence.md)
- [Detect threats quickly with near-real-time (NRT) analytics rules in Microsoft Sentinel](near-real-time-rules.md)