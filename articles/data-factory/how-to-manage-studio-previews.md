---
title: Managing Azure Data Factory Studio preview updates
description: Learn how to enable/disable Azure Data Factory studio preview updates.
author: n0elleli
ms.author: noelleli
ms.reviewer: 
ms.service: data-factory
ms.subservice: tutorials
ms.topic: tutorial
ms.custom: seo-lt-2019
ms.date: 06/21/2022
---

# Manage Azure Data Factory studio preview experience

[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

You can choose whether you would like to enable preview experiences in your data factory studio.


## How to enable/disable preview experience

There are two ways to enable preview experiences. 

1. In the banner seen at the top of the screen, you can click **Open settings to learn more and opt in**. 

	:::image type="content" source="media/solution-template-pii-detection-and-masking/pii-detection-and-masking-1.png" alt-text="Screenshot of template set up page where you can create a new connection or select an existing connection to the source from a drop down menu.":::

2. Alternatively, you can click the **Settings** button. 

	:::image type="content" source="media/solution-template-pii-detection-and-masking/pii-detection-and-masking-2.png" alt-text="Screenshot of template set up page to create a new connection or select an existing connection to Cognitive Services from a drop down menu.":::

   After opening **Settings**, you will see an option to turn on **Azure Data Factory Studio preview update**. 
	
  :::image type="content" source="media/solution-template-pii-detection-and-masking/pii-detection-and-masking-2.png" alt-text="Screenshot of template set up page to create a new connection or select an existing connection to Cognitive Services from a drop down menu.":::

  Your data factory will refresh to show the preview features. 
  Similarly, you can disable preview features with the same steps. Click **Open settings to opt out** or click the **Settings** button and unselect **Azure Data Factory Studio preview update**. 

> [!NOTE]
> Enabling/disabling preview updates will discard any unsaved changes.

## Current Preview Updates

### Dataflow Data first experimental view

UI (user interfaces) changes have been made to mapping data flows. These changes were made to simplify and streamline the dataflow creation process so that you can focus on what your data looks like. 
The dataflow authoring experience remains the same as detailed [here](https://docs.microsoft.com/en-us/azure/data-factory/concepts-data-flow-overview), except for certain areas detailed below. 

#### Configuration panel

The configuration panel for transformations has now been simplified. Previously, the configuration panel showed settings specific to the selected transformation. 
Now, for each transformation, the configuration panel will only have **Data Preview** that will automatically refresh when changes are made to transformations. 

	:::image type="content" source="media/solution-template-pii-detection-and-masking/pii-detection-and-masking-2.png" alt-text="Screenshot of template set up page to create a new connection or select an existing connection to Cognitive Services from a drop down menu.":::
  
 If no transformation is selected, the panel will show the pre-existing data flow configurations: **Parameters** and **Settings**.  
 
 
#### Transformation settings

Settings specific to a transformation will now show in a pop up instead of the configuration panel. With each new transformation, a corresponding pop-up will automatically appear. 
 
 	:::image type="content" source="media/solution-template-pii-detection-and-masking/pii-detection-and-masking-2.png" alt-text="Screenshot of template set up page to create a new connection or select an existing connection to Cognitive Services from a drop down menu.":::
  
 You can also find the settings by clicking the gear button in the top right corner of the transformation activity. 
 
 	:::image type="content" source="media/solution-template-pii-detection-and-masking/pii-detection-and-masking-2.png" alt-text="Screenshot of template set up page to create a new connection or select an existing connection to Cognitive Services from a drop down menu.":::
 
#### Data preview

If debug mode is on, **Data Preview** in the configuration panel will give you an interactive snapshot of the data at each transform. 
**Data preview** now includes Elapsed time (seconds) to show how long your data preview took to load. 
Columns can be rearranged by dragging a column by its header. You can also sort columns using the arrows next to the column titles and you can export data preview data using **Export to CSV** on the banner above column headers. 

 	:::image type="content" source="media/solution-template-pii-detection-and-masking/pii-detection-and-masking-2.png" alt-text="Screenshot of template set up page to create a new connection or select an existing connection to Cognitive Services from a drop down menu.":::
  
### Pipeline experimental view

UI changes have been made to activities in the pipeline editor canvas. These changes were made to simplify and streamline the pipeline creation process so that you can focus on transforming your data. 

#### Adding activities

You now have the option to add an activity using the add button in the bottom right corner of an activity in the pipeline editor canvas. Clicking the button will open a drop-down list of all activities that you can add. Select an activity by using the search box or scrolling through the listed activities. The selected activity will be added to the canvas and automatically linked with the previous activity on success. 

	:::image type="content" source="media/solution-template-pii-detection-and-masking/pii-detection-and-masking-2.png" alt-text="Screenshot of template set up page to create a new connection or select an existing connection to Cognitive Services from a drop down menu.":::
  
#### ForEach activity container

You can now view the activities contained in your ForEach loop. 
	:::image type="content" source="media/solution-template-pii-detection-and-masking/pii-detection-and-masking-2.png" alt-text="Screenshot of template set up page to create a new connection or select an existing connection to Cognitive Services from a drop down menu.":::
  
You have two options to add activities to your ForEach loop.
1.	Use the + button in your ForEach container to add an activity. 

		:::image type="content" source="media/solution-template-pii-detection-and-masking/pii-detection-and-masking-2.png" alt-text="Screenshot of template set up page to create a new connection or select an existing connection to Cognitive Services from a drop down menu.":::
    
	  Clicking this button will bring up a drop-down list of all activities that you can add.

	:::image type="content" source="media/solution-template-pii-detection-and-masking/pii-detection-and-masking-2.png" alt-text="Screenshot of template set up page to create a new connection or select an existing connection to Cognitive Services from a drop down menu.":::
    
    Select an activity by using the search box or scrolling through the listed activities. The selected activity will be added to the canvas inside of the ForEach container.


	:::image type="content" source="media/solution-template-pii-detection-and-masking/pii-detection-and-masking-2.png" alt-text="Screenshot of template set up page to create a new connection or select an existing connection to Cognitive Services from a drop down menu.":::

> [!NOTE]
> If your ForEach container includes more than 5 activities, only the first 4 will be shown in the container preview.

2.	Use the + button in your ForEach container to add an activity. 

    :::image type="content" source="media/solution-template-pii-detection-and-masking/pii-detection-and-masking-2.png" alt-text="Screenshot of template set up page to create a new connection or select an existing connection to Cognitive Services from a drop down menu.":::
    
	  Use the edit button in your ForEach container to see everything within the container. You can use the canvas to edit or add to your pipeline.

    :::image type="content" source="media/solution-template-pii-detection-and-masking/pii-detection-and-masking-2.png" alt-text="Screenshot of template set up page to create a new connection or select an existing connection to Cognitive Services from a drop down menu.":::
    
    Add additional activities by dragging new activities to the canvas or click the add button on the right most activity to bring up a drop-down list of activities. 

    :::image type="content" source="media/solution-template-pii-detection-and-masking/pii-detection-and-masking-2.png" alt-text="Screenshot of template set up page to create a new connection or select an existing connection to Cognitive Services from a drop down menu.":::
 
    :::image type="content" source="media/solution-template-pii-detection-and-masking/pii-detection-and-masking-2.png" alt-text="Screenshot of template set up page to create a new connection or select an existing connection to Cognitive Services from a drop down menu.":::
    
    Select an activity by using the search box or scrolling through the listed activities. The selected activity will be added to the canvas inside of the ForEach container.
    
## Provide feedback
We want to hear from you! If you see this pop-up, please provide feedback, and let us know your thoughts. 
 :::image type="content" source="media/solution-template-pii-detection-and-masking/pii-detection-and-masking-2.png" alt-text="Screenshot of template set up page to create a new connection or select an existing connection to Cognitive Services from a drop down menu.":::
