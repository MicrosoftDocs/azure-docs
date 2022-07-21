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
ms.date: 07/08/2022
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

   After opening **Settings**, you will see an option to turn on **Azure Data Factory Studio preview update**. 
	
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
	
   [**Pipeline experimental view**](#pipeline-experimental-view)
   * [Adding activities](#adding-activities)
   * [Iteration & conditionals container view](#iteration-and-conditionals-container-view)

### Dataflow data first experimental view

UI (user interfaces) changes have been made to mapping data flows. These changes were made to simplify and streamline the dataflow creation process so that you can focus on what your data looks like. 
The dataflow authoring experience remains the same as detailed [here](https://aka.ms/adfdataflows), except for certain areas detailed below. 

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

### Pipeline experimental view

UI (user interface) changes have been made to activities in the pipeline editor canvas. These changes were made to simplify and streamline the pipeline creation process. 

#### Adding activities

You now have the option to add an activity using the Add button in the bottom right corner of an activity in the pipeline editor canvas. Clicking the button will open a drop-down list of all activities that you can add. 

Select an activity by using the search box or scrolling through the listed activities. The selected activity will be added to the canvas and automatically linked with the previous activity on success. 

:::image type="content" source="media/how-to-manage-studio-preview-exp/data-factory-preview-exp-10.png" alt-text="Screenshot of new pipeline activity adding experience with a drop-down list to select activities.":::

#### Iteration and conditionals container view

You can now view the activities contained iteration and conditional activities.

:::image type="content" source="media/how-to-manage-studio-preview-exp/data-factory-preview-exp-11.png" alt-text="Screenshot of all iteration and conditional activity containers.":::
  
You have two options to add activities to your iteration and conditional activities.

1. Use the + button in your container to add an activity. 

   :::image type="content" source="media/how-to-manage-studio-preview-exp/data-factory-preview-exp-12.png" alt-text="Screenshot of new activity container with the add button highlighted on the left side of the center of the screen.":::
    
   Clicking this button will bring up a drop-down list of all activities that you can add.

   :::image type="content" source="media/how-to-manage-studio-preview-exp/data-factory-preview-exp-13.png" alt-text="Screenshot of a drop-down list in the activity container with all the activities listed.":::
    
    Select an activity by using the search box or scrolling through the listed activities. The selected activity will be added to the canvas inside of the container.

   :::image type="content" source="media/how-to-manage-studio-preview-exp/data-factory-preview-exp-14.png" alt-text="Screenshot of the container with three activities in the center of the container.":::

> [!NOTE]
> If your container includes more than 5 activities, only the first 4 will be shown in the container preview.

2. Use the edit button in your container to see everything within the container. You can use the canvas to edit or add to your pipeline.

   :::image type="content" source="media/how-to-manage-studio-preview-exp/data-factory-preview-exp-15.png" alt-text="Screenshot of the container with the edit button highlighted on the right side of a box in the center of the screen.":::

   :::image type="content" source="media/how-to-manage-studio-preview-exp/data-factory-preview-exp-16.png" alt-text="Screenshot of the inside of the container with three activities linked together.":::
    
    Add additional activities by dragging new activities to the canvas or click the add button on the right-most activity to bring up a drop-down list of all activities. 

    :::image type="content" source="media/how-to-manage-studio-preview-exp/data-factory-preview-exp-17.png" alt-text="Screenshot of the Add activity button in the bottom left corner of the right-most activity.":::
 
    :::image type="content" source="media/how-to-manage-studio-preview-exp/data-factory-preview-exp-18.png" alt-text="Screenshot of the drop-down list of activities in the right-most activity.":::
    
    Select an activity by using the search box or scrolling through the listed activities. The selected activity will be added to the canvas inside of the container.
    
## Provide feedback

We want to hear from you! If you see this pop-up, please let us know your thoughts by providing feedback on the updates you've tested.  

:::image type="content" source="media/how-to-manage-studio-preview-exp/data-factory-preview-exp-19.png" alt-text="Screenshot of the feedback survey where user can select between one and five stars.":::
