---
title: Managing Azure Data Factory studio preview experience
description: Learn more about the Azure Data Factory studio preview experience.
author: n0elleli
ms.author: noelleli
ms.topic: tutorial
ms.date: 01/05/2024
ms.subservice: authoring
---

# Manage Azure Data Factory studio preview experience

[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

You can choose whether you would like to enable preview experiences in your Azure Data Factory.

## How to enable/disable preview experience

There are two ways to enable preview experiences. 

1. In the banner seen at the top of the screen, you can click **Open settings to learn more and opt in**. 

	:::image type="content" source="media/how-to-manage-studio-preview-exp/data-factory-preview-experience-1.png" alt-text="Screenshot of Azure Data Factory home page with an Opt-in option in a banner at the top of the screen.":::

2. Alternatively, you can click the **Settings** button. 

	:::image type="content" source="media/how-to-manage-studio-preview-exp/data-factory-preview-experience-2.png" alt-text="Screenshot of Azure Data Factory home page highlighting Settings gear in top right corner.":::

   After opening **Settings**, you'll see an option to turn on **Azure Data Factory Studio preview update**. 
	
  	:::image type="content" source="media/how-to-manage-studio-preview-exp/data-factory-preview-experience-3.png" alt-text="Screenshot of Settings panel highlighting button to turn on Azure Data Factory Studio preview update.":::
  
   Toggle the button so that it shows **On** and click **Apply**.
     	
	:::image type="content" source="media/how-to-manage-studio-preview-exp/data-factory-preview-experience-4.png" alt-text="Screenshot of Settings panel showing Azure Data Factory Studio preview update turned on and the Apply button in the bottom left corner.":::
  
   Your data factory refreshes to show the preview features. 
  
   Similarly, you can disable preview features with the same steps. Click **Open settings to opt out** or click the **Settings** button and unselect **Azure Data Factory Studio preview update**. 
   
   	:::image type="content" source="media/how-to-manage-studio-preview-exp/data-factory-preview-experience-5.png" alt-text="Screenshot of Azure Data Factory home page with an Opt-out option in a banner at the top of the screen and Settings gear in the top right corner of the screen.":::

> [!NOTE]
> Enabling/disabling preview updates will discard any unsaved changes.

## Current Preview Updates

   [**Dataflow data first experimental view**](#dataflow-data-first-experimental-view)
   * [Configuration panel](#configuration-panel)
   * [Transformation settings](#transformation-settings)
   * [Data preview](#data-preview)

   [**CI/CD experimental view**](#cicd-experimental-view)
   * [Autosave](#auto-save)
	
   [**Pipeline experimental view**](#pipeline-experimental-view)
   * [Dynamic content flyout](#dynamic-content-flyout)
   * [Linked service for Web activity] (#linked-service-web-activity)

   [**Monitoring experimental view**](#monitoring-experimental-view)
   * [Error message relocation to Status column](#error-message-relocation-to-status-column)
   * [Simplified default monitoring view](#simplified-default-monitoring-view)

### Dataflow data-first experimental view

UI (user interfaces) changes have been made to mapping data flows. These changes were made to simplify and streamline the dataflow creation process so that you can focus on what your data looks like. 

The dataflow authoring experience remains the same as detailed [here](https://aka.ms/adfdataflows), except for certain areas detailed below. 

To see the data-first experimental view, you need to follow these steps to enable it. By default, users see the **Classic** style. 

> [!NOTE]
> To enable the data-first view, you'll need to enable the preview experience in your settings and you'll need an active Data flow debug session. 

In your data flow editor, you can find several canvas tools on the right side like the **Search** tool, **Zoom** tool, and **Multi-select** tool. 

:::image type="content" source="media/how-to-manage-studio-preview-exp/data-factory-preview-experience-28.png" alt-text="Screenshot of the data flow editing canvas.":::

You'll see a new icon under the **Multi-select** tool. This is how you can toggle between the **Classic** and the **Data-first** views. 

:::image type="content" source="media/how-to-manage-studio-preview-exp/data-factory-preview-experience-29.png" alt-text="Screenshot of data flow canvas options with button to switch views highlighted.":::

#### Configuration panel

The configuration panel for transformations has now been simplified. Previously, the configuration panel showed settings specific to the selected transformation. 
Now, for each transformation, the configuration panel will only have **Data Preview** that will automatically refresh when changes are made to transformations. 

:::image type="content" source="media/how-to-manage-studio-preview-exp/data-factory-preview-experience-6.png" alt-text="Screenshot of the configuration panel with only a Data preview tab.":::
  
If no transformation is selected, the panel will show the pre-existing data flow configurations: **Parameters** and **Settings**.  

#### Transformation settings

Settings specific to a transformation will now show in a pop-up instead of the configuration panel. With each new transformation, a corresponding pop-up will automatically appear. 
 
:::image type="content" source="media/how-to-manage-studio-preview-exp/data-factory-preview-experience-7.png" alt-text="Screenshot of a pop-up with settings specific to the data flow transformation.":::
  
 You can also find the settings by clicking the gear button in the top right corner of the transformation activity.
 
:::image type="content" source="media/how-to-manage-studio-preview-exp/data-factory-preview-experience-8.png" alt-text="Screenshot of a data flow source transformation with the settings gear in the top right corner highlighted.":::
 
#### Data preview

If debug mode is on, **Data Preview** in the configuration panel will give you an interactive snapshot of the data at each transform. 
**Data preview** now includes Elapsed time (seconds) to show how long your data preview took to load. 
Columns can be rearranged by dragging a column by its header. You can also sort columns using the arrows next to the column titles and you can export data preview data using **Export to CSV** on the banner above column headers. 

:::image type="content" source="media/how-to-manage-studio-preview-exp/data-factory-preview-experience-9.png" alt-text="Screenshot of Data preview with Export button in the top right corner of the banner and Elapsed Time highlighted in the bottom left corner of the screen.":::

### CI/CD experimental view

#### Auto Save

You now have the option to enable **Auto Save** when you have a Git repository configured for your factory. This allows you to save changes to your factory automatically while developing.

To enable **Auto save**, click the toggle button found in the top banner of your screen. 

:::image type="content" source="media/how-to-manage-studio-preview-exp/data-factory-preview-experience-42.png" alt-text="Screenshot of the Auto Save toggle button in the top banner of the screen.":::

Review the pop-up and click **Yes**.

:::image type="content" source="media/how-to-manage-studio-preview-exp/data-factory-preview-experience-43.png" alt-text="Screenshot of the Auto Save confirmation pop-up.":::

When **Auto Save** is enabled, the toggle button shows as blue.

:::image type="content" source="media/how-to-manage-studio-preview-exp/data-factory-preview-experience-44.png" alt-text="Screenshot of the enabled Auto Save toggle button in the top banner of the screen.":::

### Pipeline experimental view

UI (user interface) changes have been made to activities in the pipeline editor canvas. These changes were made to simplify and streamline the pipeline creation process. 

#### Dynamic content flyout

A new flyout has been added to make it easier to set dynamic content in your pipeline activities without having to use the expression builder. The dynamic content flyout is currently supported in these activities and settings: 

| **Activity** | **Setting name** |
| --- | --- |
| Azure Function | Function Name |
| Databricks-Notebook | Notebook path |
| Databricks-Jar | Main class name |
| Databricks-Python | Python file |
| Fail | Fail message |
| Fail | Error code |
| Web | Url |
| Webhook | Url |
| Wait | Wait time in seconds |
| Filter | Items |
| Filter | Conditions |
| ForEach | Items |
| If/Switch/Until | Expression |

In supported activities, you'll see an icon next to the setting. Clicking this icon opens up the flyout where you can choose your dynamic content. 

:::image type="content" source="media/how-to-manage-studio-preview-exp/data-factory-preview-experience-32.png" alt-text="Screenshot of the new dynamic content flyout icon.":::

:::image type="content" source="media/how-to-manage-studio-preview-exp/data-factory-preview-experience-33.png" alt-text="Screenshot of the new dynamic content flyout with dynamic content options to choose.":::

#### Linked service for Web activity

There are new settings available for the Web activity. 

By default, the **Connection type** will be set to **Inline**, but you can choose to select **Linked service**. Doing so allows you to reference a REST linked service for authentication purposes.

:::image type="content" source="media/how-to-manage-studio-preview-exp/data-factory-preview-experience-45.png" alt-text="Screenshot of the new Web activity settings.":::

After selecting **Linked service**, use the drop-down menu to select an existing linked service or click **New** to create a new linked service. 

:::image type="content" source="media/how-to-manage-studio-preview-exp/data-factory-preview-experience-46.png" alt-text="Screenshot of the Web activity settings with Linked service selected.":::

:::image type="content" source="media/how-to-manage-studio-preview-exp/data-factory-preview-experience-47.png" alt-text="Screenshot of the fly-out for setting up a new linked service.":::


### Monitoring experimental view

UI (user interfaces) changes have been made to the monitoring page. These changes were made to simplify and streamline your monitoring experience.
The monitoring experience remains the same as detailed [here](monitor-visually.md), except for items detailed in the following section. 

#### Error message relocation to Status column

> [!NOTE]
> This feature is now generally available in the ADF studio.  

To make it easier for you to view errors when you see a **Failed** pipeline run, error messages have been relocated to the **Status** column.

Find the error icon in the pipeline monitoring page and in the pipeline **Output** tab after debugging your pipeline. 

:::image type="content" source="media/how-to-manage-studio-preview-exp/data-factory-preview-experience-31.png" alt-text="Screenshot of the new error message location in pipeline debug output.":::

:::image type="content" source="media/how-to-manage-studio-preview-exp/data-factory-preview-experience-30.png" alt-text="Screenshot of the new error message location in pipeline monitoring details.":::

#### Simplified default monitoring view 

The default monitoring view has been simplified with fewer default columns. You can add/remove columns if you’d like to personalize your monitoring view. Changes to the default will be cached.

:::image type="content" source="media/how-to-manage-studio-preview-exp/data-factory-preview-experience-20.png" alt-text="Screenshot of the new default column view on the monitoring page.":::

**Default columns**

| **Column name** | **Description** |
| --- | --- |
| Pipeline Name | Name of the pipeline |
| Run Start | Start date and time for the pipeline run (MM/DD/YYYY, HH:MM:SS AM/PM) |
| Duration | Run duration (HH:MM:SS) |
| Triggered By | The name of the trigger that started the pipeline |
| Status | **Failed**, **Succeeded**, **In Progress**, **Cancelled**, or **Queued** |
| Parameters | Parameters for the pipeline run (name/value pairs) |
| Error | If the pipeline failed, the run error |
| Run ID | ID of the pipeline run |

You can edit your default view by clicking **Edit Columns**. 

:::image type="content" source="media/how-to-manage-studio-preview-exp/data-factory-preview-experience-21.png" alt-text="Screenshot of the Edit Columns button in the center of the top row.":::

Add columns by clicking **Add column** or remove columns by clicking the trashcan icon. 

:::image type="content" source="media/how-to-manage-studio-preview-exp/data-factory-preview-experience-22.png" alt-text="Screenshot of the Add column button and trashcan icon to edit column view.":::

You can also now view **Pipeline run details** in a new pane in the detailed pipeline monitoring view by clicking **View run detail**.

:::image type="content" source="media/how-to-manage-studio-preview-exp/data-factory-preview-experience-41.png" alt-text="Screenshot of the new Pipeline run details pane in the detailed monitoring view.":::

## Provide feedback

We want to hear from you! If you see this pop-up, let us know your thoughts by providing feedback on the updates you tested.  

:::image type="content" source="media/how-to-manage-studio-preview-exp/data-factory-preview-experience-19.png" alt-text="Screenshot of the feedback survey where user can select between one and five stars.":::


## Related content

- [What's New in Azure Data Factory](whats-new.md)
- [How to manage Azure Data Factory Settings](how-to-manage-settings.md)
