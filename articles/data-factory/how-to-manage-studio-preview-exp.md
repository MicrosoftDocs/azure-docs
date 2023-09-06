---
title: Managing Azure Data Factory studio preview experience
description: Learn more about the Azure Data Factory studio preview experience.
author: n0elleli
ms.author: noelleli
ms.reviewer: 
ms.service: data-factory
ms.subservice: tutorials
ms.topic: tutorial
ms.custom: seo-lt-2019
ms.date: 06/06/2023
---

# Manage Azure Data Factory studio preview experience

[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

You can choose whether you would like to enable preview experiences in your Azure Data Factory.

## How to enable/disable preview experience

There are two ways to enable preview experiences. 

1. In the banner seen at the top of the screen, you can click **Open settings to learn more and opt in**. 

	:::image type="content" source="media/how-to-manage-studio-preview-exp/data-factory-preview-exp-1.png" alt-text="Screenshot of Azure Data Factory home page with an Opt-in option in a banner at the top of the screen.":::

2. Alternatively, you can click the **Settings** button. 

	:::image type="content" source="media/how-to-manage-studio-preview-exp/data-factory-preview-exp-2.png" alt-text="Screenshot of Azure Data Factory home page highlighting Settings gear in top right corner.":::

   After opening **Settings**, you'll see an option to turn on **Azure Data Factory Studio preview update**. 
	
  	:::image type="content" source="media/how-to-manage-studio-preview-exp/data-factory-preview-exp-3.png" alt-text="Screenshot of Settings panel highlighting button to turn on Azure Data Factory Studio preview update.":::
  
   Toggle the button so that it shows **On** and click **Apply**.
     	
	:::image type="content" source="media/how-to-manage-studio-preview-exp/data-factory-preview-exp-4.png" alt-text="Screenshot of Settings panel showing Azure Data Factory Studio preview update turned on and the Apply button in the bottom left corner.":::
  
   Your data factory will refresh to show the preview features. 
  
   Similarly, you can disable preview features with the same steps. Click **Open settings to opt out** or click the **Settings** button and unselect **Azure Data Factory Studio preview update**. 
   
   	:::image type="content" source="media/how-to-manage-studio-preview-exp/data-factory-preview-exp-5.png" alt-text="Screenshot of Azure Data Factory home page with an Opt-out option in a banner at the top of the screen and Settings gear in the top right corner of the screen.":::

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

   [**Monitoring experimental view**](#monitoring-experimental-view)
   * [Error message relocation to Status column](#error-message-relocation-to-status-column)
   * [Container view](#container-view)
   * [Simplified default monitoring view](#simplified-default-monitoring-view)

### Dataflow data-first experimental view

UI (user interfaces) changes have been made to mapping data flows. These changes were made to simplify and streamline the dataflow creation process so that you can focus on what your data looks like. 

The dataflow authoring experience remains the same as detailed [here](https://aka.ms/adfdataflows), except for certain areas detailed below. 

To see the data-first experimental view, you need to follow these steps to enable it. By default, users see the **Classic** style. 

> [!NOTE]
> To enable the data-first view, you'll need to enable the preview experience in your settings and you'll need an active Data flow debug session. 

In your data flow editor, you can find several canvas tools on the right side like the **Search** tool, **Zoom** tool, and **Multi-select** tool. 

:::image type="content" source="media/how-to-manage-studio-preview-exp/data-factory-preview-exp-28.png" alt-text="Screenshot of the data flow editing canvas.":::

You'll see a new icon under the **Multi-select** tool. This is how you can toggle between the **Classic** and the **Data-first** views. 

:::image type="content" source="media/how-to-manage-studio-preview-exp/data-factory-preview-exp-29.png" alt-text="Screenshot of data flow canvas options with button to switch views highlighted.":::

#### Configuration panel

The configuration panel for transformations has now been simplified. Previously, the configuration panel showed settings specific to the selected transformation. 
Now, for each transformation, the configuration panel will only have **Data Preview** that will automatically refresh when changes are made to transformations. 

:::image type="content" source="media/how-to-manage-studio-preview-exp/data-factory-preview-exp-6.png" alt-text="Screenshot of the configuration panel with only a Data preview tab.":::
  
If no transformation is selected, the panel will show the pre-existing data flow configurations: **Parameters** and **Settings**.  

#### Transformation settings

Settings specific to a transformation will now show in a pop-up instead of the configuration panel. With each new transformation, a corresponding pop-up will automatically appear. 
 
:::image type="content" source="media/how-to-manage-studio-preview-exp/data-factory-preview-exp-7.png" alt-text="Screenshot of a pop-up with settings specific to the data flow transformation.":::
  
 You can also find the settings by clicking the gear button in the top right corner of the transformation activity.
 
:::image type="content" source="media/how-to-manage-studio-preview-exp/data-factory-preview-exp-8.png" alt-text="Screenshot of a data flow source transformation with the settings gear in the top right corner highlighted.":::
 
#### Data preview

If debug mode is on, **Data Preview** in the configuration panel will give you an interactive snapshot of the data at each transform. 
**Data preview** now includes Elapsed time (seconds) to show how long your data preview took to load. 
Columns can be rearranged by dragging a column by its header. You can also sort columns using the arrows next to the column titles and you can export data preview data using **Export to CSV** on the banner above column headers. 

:::image type="content" source="media/how-to-manage-studio-preview-exp/data-factory-preview-exp-9.png" alt-text="Screenshot of Data preview with Export button in the top right corner of the banner and Elapsed Time highlighted in the bottom left corner of the screen.":::

### CI/CD experimental view

#### Auto Save

You now have the option to enable **Auto Save** when you have a Git repository configured for your factory. This allows you to save changes to your factory automatically while developing.

To enable **Auto save**, click the toggle button found in the top banner of your screen. 

:::image type="content" source="media/how-to-manage-studio-preview-exp/data-factory-preview-exp-42.png" alt-text="Screenshot of the Auto Save toggle button in the top banner of the screen.":::

Review the pop-up and click **Yes**.

:::image type="content" source="media/how-to-manage-studio-preview-exp/data-factory-preview-exp-43.png" alt-text="Screenshot of the Auto Save confirmation pop-up.":::

When **Auto Save** is enabled, the toggle button shows as blue.

:::image type="content" source="media/how-to-manage-studio-preview-exp/data-factory-preview-exp-44.png" alt-text="Screenshot of the enabled Auto Save toggle button in the top banner of the screen.":::

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

In supported activities, you'll see an icon next to the setting. Clicking this will open up the flyout where you can choose your dynamic content. 

:::image type="content" source="media/how-to-manage-studio-preview-exp/data-factory-preview-exp-32.png" alt-text="Screenshot of the new dynamic content flyout icon.":::

:::image type="content" source="media/how-to-manage-studio-preview-exp/data-factory-preview-exp-33.png" alt-text="Screenshot of the new dynamic content flyout with dynamic content options to choose.":::

### Monitoring experimental view

UI (user interfaces) changes have been made to the monitoring page. These changes were made to simplify and streamline your monitoring experience.
The monitoring experience remains the same as detailed [here](monitor-visually.md), except for items detailed below. 

#### Error message relocation to Status column

> [!NOTE]
> This feature is now generally available in the ADF studio.  

To make it easier for you to view errors when you see a **Failed** pipeline run, error messages have been relocated to the **Status** column.

Find the error icon in the pipeline monitoring page and in the pipeline **Output** tab after debugging your pipeline. 

:::image type="content" source="media/how-to-manage-studio-preview-exp/data-factory-preview-exp-31.png" alt-text="Screenshot of the new error message location in pipeline debug output.":::

:::image type="content" source="media/how-to-manage-studio-preview-exp/data-factory-preview-exp-30.png" alt-text="Screenshot of the new error message location in pipeline monitoring details.":::

#### Container view

> [!NOTE]
> This feature is now generally available in the ADF studio.  

When monitoring your pipeline run, you have the option to enable the container view, which will provide a consolidated view of the activities that ran.
This view is available in the output of your pipeline debug run and in the detailed monitoring view found in the monitoring tab. 

##### How to enable the container view in pipeline debug output

In the **Output** tab in your pipeline, there's a new dropdown to select your monitoring view. 

:::image type="content" source="media/how-to-manage-studio-preview-exp/data-factory-preview-exp-35.png" alt-text="Screenshot of the drop-down menu to select the monitoring view.":::

Select **Hierarchy** to see the new hierarchy view. If you have iteration or conditional activities, the nested activities are grouped under the parent activity.

:::image type="content" source="media/how-to-manage-studio-preview-exp/data-factory-preview-exp-36.png" alt-text="Screenshot of the container monitoring view.":::

Click the button next to the iteration or conditional activity to collapse the nested activities for a more consolidated view. 

:::image type="content" source="media/how-to-manage-studio-preview-exp/data-factory-preview-exp-37.png" alt-text="Screenshot of the container monitoring  collapsed view.":::

##### How to enable the container view in pipeline monitoring

In the detailed view of your pipeline run, there's a new dropdown to select your monitoring view next to the Status filter. 

:::image type="content" source="media/how-to-manage-studio-preview-exp/data-factory-preview-exp-38.png" alt-text="Screenshot of the drop-down menu to select the monitoring view in pipeline monitoring view.":::

Select **Container** to see the new container view. If you have iteration or conditional activities, the nested activities will be grouped under the parent activity. 

:::image type="content" source="media/how-to-manage-studio-preview-exp/data-factory-preview-exp-39.png" alt-text="Screenshot of the container monitoring view in pipeline monitoring.":::

Click the button next to the iteration or conditional activity to collapse the nested activities for a more consolidated view. 

:::image type="content" source="media/how-to-manage-studio-preview-exp/data-factory-preview-exp-40.png" alt-text="Screenshot of the collapsed container monitoring view.":::

#### Simplified default monitoring view 

The default monitoring view has been simplified with fewer default columns. You can add/remove columns if you’d like to personalize your monitoring view. Changes to the default will be cached.

:::image type="content" source="media/how-to-manage-studio-preview-exp/data-factory-preview-exp-20.png" alt-text="Screenshot of the new default column view on the monitoring page.":::

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

:::image type="content" source="media/how-to-manage-studio-preview-exp/data-factory-preview-exp-21.png" alt-text="Screenshot of the Edit Columns button in the center of the top row.":::

Add columns by clicking **Add column** or remove columns by clicking the trashcan icon. 

:::image type="content" source="media/how-to-manage-studio-preview-exp/data-factory-preview-exp-22.png" alt-text="Screenshot of the Add column button and trashcan icon to edit column view.":::

You can also now view **Pipeline run details** in a new pane in the detailed pipeline monitoring view by clicking **View run detail**.

:::image type="content" source="media/how-to-manage-studio-preview-exp/data-factory-preview-exp-41.png" alt-text="Screenshot of the new Pipeline run details pane in the detailed monitoring view.":::

## Provide feedback

We want to hear from you! If you see this pop-up, please let us know your thoughts by providing feedback on the updates you've tested.  

:::image type="content" source="media/how-to-manage-studio-preview-exp/data-factory-preview-exp-19.png" alt-text="Screenshot of the feedback survey where user can select between one and five stars.":::


## Next steps

- [What's New in Azure Data Factory](whats-new.md)
- [How to manage Azure Data Factory Settings](how-to-manage-settings.md)
