---
title: Copy new and changed files by LastModifiedDate
description: Learn how to use a solution template to copy new and changed files by LastModifiedDate with Azure Data Factory.
author: dearandyxu
ms.author: yexu
ms.service: data-factory
ms.subservice: tutorials
ms.topic: conceptual
ms.date: 08/10/2023
---

# Copy new and changed files by LastModifiedDate with Azure Data Factory

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article describes a solution template that you can use to copy new and changed files only by LastModifiedDate from a file-based store to a destination store. 

## About this solution template

This template first selects the new and changed files only by their attributes **LastModifiedDate**, and then copies those selected files from the data source store to the data destination store.

The template contains one activity:
- **Copy** to copy new and changed files only by LastModifiedDate from a file store to a destination store.

The template defines six parameters:
-  *FolderPath_Source* is the folder path where you can read the files from the source store. You need to replace the default value with your own folder path.
-  *Directory_Source* is the subfolder path where you can read the files from the source store. You need to replace the default value with your own subfolder path.
-  *FolderPath_Destination* is the folder path where you want to copy files to the destination store. You need to replace the default value with your own folder path.
-  *Directory_Destination* is the subfolder path where you want to copy files to the destination store. You need to replace the default value with your own subfolder path.
-  *LastModified_From* is used to select the files whose LastModifiedDate attribute is after or equal to this datetime value.  In order to select the new files only, which hasn't been copied last time, this datetime value can be the time when the pipeline was triggered last time. You can replace the default value '2019-02-01T00:00:00Z' to your expected LastModifiedDate in UTC timezone. 
-  *LastModified_To* is used to select the files whose LastModifiedDate attribute is before this datetime value. In order to select the new files only, which weren't copied in prior runs, this datetime value can be the present time.  You can replace the default value '2019-02-01T00:00:00Z' to your expected LastModifiedDate in UTC timezone.

## How to use this solution template

1. Navigate to the **Template Gallery** from the **Author** tab in Azure Data Factory, then choose the **+** button, **Pipeline**, and finally **Template Gallery**.

   :::image type="content" source="media/solution-template-copy-new-files-last-modified-date/open-template-gallery.png" alt-text="Screenshot showing how to open the Template gallery from the Azure Data Factory Studio's Author tab.":::

1. Search for the template **Copy new files only by LastModifiedDate**, select it, and then select **Continue**.

   :::image type="content" source="media/solution-template-copy-new-files-last-modified-date/select-last-modified-date-template.png" alt-text="Screenshot showing how to find and select the Copy new files only by LastModifiedDate template.":::

1. Create a **New** connection to your destination store. The destination store is where you want to copy files to.

    :::image type="content" source="media/solution-template-copy-new-files-last-modified-date/copy-new-files-last-modified-date-1.png" alt-text="Create a new connection to the source":::
	
1. Create a **New** connection to your source storage store. The source storage store is where you want to copy files from. 

    :::image type="content" source="media/solution-template-copy-new-files-last-modified-date/copy-new-files-last-modified-date-3.png" alt-text="Create a new connection to the destination":::

1. Select **Use this template**.

    :::image type="content" source="media/solution-template-copy-new-files-last-modified-date/copy-new-files-last-modified-date-4.png" alt-text="Use this template":::
	
1. You see the pipeline available in the panel, as shown in the following example:

    :::image type="content" source="media/solution-template-copy-new-files-last-modified-date/copy-new-files-last-modified-date-5.png" alt-text="Show the pipeline":::

1. Select **Debug**, write the value for the **Parameters**, and select **Finish**.  In the picture that follows, we set the parameters as following.
   - **FolderPath_Source** = sourcefolder
   - **Directory_Source** = subfolder
   - **FolderPath_Destination** = destinationfolder
   - **Directory_Destination** = subfolder
   - **LastModified_From** =  2019-02-01T00:00:00Z
   - **LastModified_To** = 2019-03-01T00:00:00Z
	
    The example is indicating that the files, which were last modified within the timespan (**2019-02-01T00:00:00Z** to **2019-03-01T00:00:00Z**) will be copied from the source path **sourcefolder/subfolder** to the destination path **destinationfolder/subfolder**.  You can replace these times or folders with your own parameters.

    :::image type="content" source="media/solution-template-copy-new-files-last-modified-date/copy-new-files-last-modified-date-6.png" alt-text="Run the pipeline":::

1. Review the result. You see only the files last modified within the configured timespan are copied to the destination store.

    :::image type="content" source="media/solution-template-copy-new-files-last-modified-date/copy-new-files-last-modified-date-7.png" alt-text="Review the result":::
	
1. Now you can add a tumbling windows trigger to automate this pipeline, so that the pipeline can always copy new and changed files only by LastModifiedDate periodically.  Select **Add trigger**, and select **New/Edit**.

    :::image type="content" source="media/solution-template-copy-new-files-last-modified-date/copy-new-files-last-modified-date-8.png" alt-text="Screenshot that highlights the New/Edit menu option that appears when you select Add trigger.":::
	
1. In the **Add Triggers** window, select **+ New**.

1. Select **Tumbling Window** for the trigger type, set **Every 15 minute(s)** as the recurrence (you can change to any interval time). Select **Yes** for Activated box, and then select **OK**.

    :::image type="content" source="media/solution-template-copy-new-files-last-modified-date/copy-new-files-last-modified-date-10.png" alt-text="Create trigger":::	
	
1. Set the value for the **Trigger Run Parameters** as following, and select **Finish**.
    - **FolderPath_Source** = **sourcefolder**.  You can replace with your folder in source data store.
    - **Directory_Source** = **subfolder**.  You can replace with your subfolder in source data store.
    - **FolderPath_Destination** = **destinationfolder**.  You can replace with your folder in destination data store.
    - **Directory_Destination** = **subfolder**.  You can replace with your subfolder in destination data store.
    - **LastModified_From** =  **\@trigger().outputs.windowStartTime**.  It's a system variable from the trigger determining the time when the pipeline was triggered last time.
    - **LastModified_To** = **\@trigger().outputs.windowEndTime**.  It's a system variable from the trigger determining the time when the pipeline is triggered this time.
	
    :::image type="content" source="media/solution-template-copy-new-files-last-modified-date/copy-new-files-last-modified-date-11.png" alt-text="Input parameters":::
	
1. Select **Publish All**.
	
    :::image type="content" source="media/solution-template-copy-new-files-last-modified-date/copy-new-files-last-modified-date-12.png" alt-text="Publish All":::

1. Create new files in your source folder of data source store.  You're now waiting for the pipeline to be triggered automatically and only the new files are copied to the destination store.

1. Select **Monitor** tab in the left navigation panel, and wait for about 15 minutes if the recurrence of trigger was set to every 15 minutes.

1. Review the result. You see your pipeline is triggered automatically every 15 minutes, and only the new or changed files from source store are copied to the destination store in each pipeline run.

    :::image type="content" source="media/solution-template-copy-new-files-last-modified-date/copy-new-files-last-modified-date-15.png" alt-text="Screenshot that shows the results that return when the pipeline is triggered.":::
	
## Related content

- [Introduction to Azure Data Factory](introduction.md)
