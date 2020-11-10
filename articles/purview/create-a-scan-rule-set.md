---
title: Create a scan rule set
description: Create a scan rule set in Azure Purview to quickly scan data sources in your organization.
author: chandrakavya
ms.author: kchandra
ms.service: data-catalog
ms.subservice: data-catalog-gen2
ms.topic: overview
ms.date: 10/09/2020
---

# Create a scan rule set

In an Azure Purview catalog, you can create scan rule sets to enable you to quickly scan data sources in your organization.

A scan rule set is a container for grouping a set of scan rules together so that you can easily associate them with a scan. For example, you might create a default scan rule set for each of your data source types, and then use these scan rule sets by default for all scans within your company. You might also want users with the right permissions to create other scan rule sets with different configurations based on business need.

## Steps to create a scan rule set

To create a scan rule set:

1. From your Azure Purview catalog, select **Management Center**.

   :::image type="content" source="./media/create-a-scan-rule-set/select-management-center.png" alt-text="Screenshot showing how to select Management Center.":::

1. Select **Scan rule sets** from the left pane, and then select **New**.

   :::image type="content" source="./media/create-a-scan-rule-set/select-scan-rule-sets.png" alt-text="Screenshot showing how to select Scan rule sets.":::

1. From the **New scan rule set** page, select the data sources that the catalog scanner supports from the **Source Type** drop-down list.

   You can create a scan rule set for each type of data source you intend to scan.

1. Give your scan rule set a **Name**. The maximum length is 63 characters, with no spaces allowed. Optionally, enter a **Description**. The maximum length is 256 characters.

   :::image type="content" source="./media/create-a-scan-rule-set/new-scan-rule-set.png" alt-text="Screenshot showing the Scan rule set page.":::

1. Select **Continue**.

   The **Select file types** page appears. Notice that the file type options on this page vary based on the data source type that you chose on the previous page. All the file types are enabled by default.

      :::image type="content" source="./media/create-a-scan-rule-set/select-file-types-page.png" alt-text="Screenshot showing the Select file types page.":::

   The **Document file types** selection on this page allows you to include or exclude the following office file types: .doc, .docm, .docx, .dot, .odp, .ods, .odt, .pdf, .pot, .pps, .ppsx, .ppt, .pptm, .pptx, .xlc, .xls, .xlsb, .xlsm, .xlsx, and .xlt.

1. Enable or disable a file type tile by selecting or clearing its check box. If you choose a Data Lake type data source (for example, Azure Data Lake Storage Gen2 or Azure Blob), enable the file types for which you want to have schema extracted and classified.

1. For certain data source types, you can also [Create a custom file type](#create-a-custom-file-type).

1. Select **Continue**.

   The **Select classification rules** page appears. This page displays the selected **System rules** and **Custom rules**, and the total number of classification rules selected. By default, all the **System rules** check boxes are selected

1. For the rules you want to include or exclude, you can select or clear the **System rules** classification rule check boxes globally by category.

   :::image type="content" source="./media/create-a-scan-rule-set/select-classification-rules.png" alt-text="Screenshot showing the Select classification rules page.":::

1. You can expand the category node and select or clear individual check boxes. For example, if the rule for **Argentina.DNI Number** has high false positives, you can clear that specific check box.

   :::image type="content" source="./media/create-a-scan-rule-set/select-system-rules.png" alt-text="Screenshot showing how to select system rules.":::

1. Select **Create** to finish creating the scan rule set.

### Create a custom file type

Azure Purview supports adding a custom extension and defining a custom column delimiter in a scan rule set.

To create a custom file type:

1. Follow steps 1–5 in [Steps to create a scan rule set](#steps-to-create-a-scan-rule-set) or edit an existing scan rule set.

1. On the **Select file types** page, select **New file type** to create a new custom file type.

   :::image type="content" source="./media/create-a-scan-rule-set/select-new-file-type.png" alt-text="Screenshot showing how to select New file type from the Select file types page.":::

1. Enter a **File Extension** and an optional **Description**.

   :::image type="content" source="./media/create-a-scan-rule-set/new-custom-file-type-page.png" alt-text="Screenshot showing the New custom file type page." lightbox="./media/create-a-scan-rule-set/new-custom-file-type-page.png":::

1. Make one of the following selections for **File contents within** to specify the type of file contents within your file:

   - Select **Custom Delimiter** and enter your own **Custom delimiter** (single character only).

      :::image type="content" source="./media/create-a-scan-rule-set/select-custom-delimiter.png" alt-text="Screenshot showing how to select the Custom Delimiter option on the New custom file type page." lightbox="./media/create-a-scan-rule-set/select-custom-delimiter.png":::

   - Select **System File Type** and choose a system file type (for example XML) from the **System file type** drop-down list.

      :::image type="content" source="./media/create-a-scan-rule-set/select-system-file-type.png" alt-text="Screenshot showing how to select the System File Type option for the New custom file type page." lightbox="./media/create-a-scan-rule-set/select-system-file-type.png":::

1. Select **Create** to save the custom file.

   The system returns to the **Select file types** page and inserts the new custom file type as a new tile.

   :::image type="content" source="./media/create-a-scan-rule-set/new-custom-file-type-tile.png" alt-text="Screenshot showing the new custom file type tile on the Select file types page.":::

1. Select **edit** in the new file type tile if you want to change or delete it.

1. Select **Continue** to finish configuring the scan rule set.

## System scan rule sets

System scan rule sets are Microsoft-defined scan rule sets that are automatically created for each Azure Purview catalog. Each system scan rule set is associated with a specific data source type. When you create a scan, you can associate it with a system scan rule set. Every time Microsoft makes an update to these system rule sets, you can update them in your catalog, and apply the update to all the associated scans.

1. To view the list of system scan rule sets, select **Scan rule sets** in the **Management Center** and choose the **System** tab.

   :::image type="content" source="./media/create-a-scan-rule-set/system-scan-rule-sets.jpg" alt-text="Screenshot showing the list of system scan rule sets." lightbox="./media/create-a-scan-rule-set/system-scan-rule-sets.jpg":::

1. Each system scan rule set has a **Name**, **Source type**, and a **Version**. If you select the version number of a scan rule set in the **Version** column, you see the rules associated with the current version and the previous versions (if any).

   :::image type="content" source="./media/create-a-scan-rule-set/system-scan-rule-set-page.jpg" alt-text="Screenshot showing a system scan rule set page." lightbox="./media/create-a-scan-rule-set/system-scan-rule-set-page.jpg":::

1. If an update is available for a system scan rule set, you can select **Update** in the **Version** column. In the system scan rule page, choose from a version from the **Select a new version to update** drop-down list. The page provides a list of system classification rules associated with the new version and current version.

   :::image type="content" source="./media/create-a-scan-rule-set/system-scan-rule-set-version.jpg" alt-text="Screenshot showing how to change the version of a system scan rule set." lightbox="./media/create-a-scan-rule-set/system-scan-rule-set-version.jpg":::

### Associate a scan with a system scan rule set

When you [create a scan](starter-kit-tutorial-1.md#scan-data-into-the-catalog), you can choose to associate it with a system scan rule set as follows:

1. On the **Select a scan rule set** page, select the system scan rule set.

   :::image type="content" source="./media/create-a-scan-rule-set/set-system-scan-rule-set.jpg" alt-text="Screenshot showing how to select a system scan rule set for a scan." lightbox="./media/create-a-scan-rule-set/set-system-scan-rule-set.jpg":::

1. Select **Continue**, and then select **Save and Run**.
