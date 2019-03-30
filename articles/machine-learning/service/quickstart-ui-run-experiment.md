---
title: "Quickstart: Create  your first data science experiment without writing code"
titleSuffix: Azure Machine Learning Studio
description: Create a machine learning experiment to prepare and visualize your data with a drag-and-drop user interface.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: quickstart
author: sdgilley
ms.author: sgilley
ms.date: 04/15/2019
# Customer intent: As a data scientist, I want to create machine learning models without writing any code.
---

# Quickstart: Create your first data science experiment without writing code

Create a machine learning experiment to prepare and visualize your data with a drag-and-drop user interface.

In this quickstart you'll explore and prepare data:

- Create your first experiment
- Add data
- Visualize the data
- Prepare the data
- Run an experiment
- Visualize the results

After you complete this quickstart, you can use this experiment to [train a model]().

If you're brand new to machine learning, the video series [Data Science for Beginners](https://docs.microsoft.com/en-us/azure/machine-learning/studio/data-science-for-beginners-the-5-questions-data-science-answers) is a great introduction to machine learning using everyday language and concepts.

## Prerequisite

1. [Create an Azure Machine Learning workspace](setup-create-workspace.md#portal) if you don't have one.

1. Open your workspace in the [Azure portal](https://portal.azure.com/).  If you're not sure how to locate your workspace in the portal, see [how to find your workspace](how-to-manage-workspace.md#view).

## Create your first experiment

1. In your workspace, click on some section whose name I do not yet know.  Then click on some button whose name I also do not know.  This will open up some page whose title I do not know.  When I do know these things they will be added here, along with a screenshot.

1. Select  **Add New**  in the left bottom corner.
![Add new experiment](./media/quickstart-ui-run-experiment/add-new.png)

1. Select **Blank Experiment**.

1. Your experiment is given a default name. Select this text and rename it to something meaningful, for example, "Quickstart-explore data." This name doesn't need to be unique.

1. The **Mini Map** at the bottom of the screen is useful for viewing large experiments.  You won't need it in this quickstart so click on the arrow at the top to close it.  

![Rename experiment](./media/quickstart-ui-run-experiment/rename.png)

## Add data

The first thing you need for machine learning is data. There are several sample datasets included with Studio that you can use, or you can import data from many sources. For this example, you'll use the sample dataset **Automobile price data (Raw)**. This dataset includes entries for various individual automobiles, including information such as make, model, technical specifications, and price.  

1. To the left of the experiment canvas is a palette of datasets and modules. Select **Saved Datasets** then select **Samples** to view the available sample datasets.

1. Select the third dataset, **Automobile price data (raw)**, and drag it onto the canvas.

   ![Drag data to canvas](./media/quickstart-ui-run-experiment/drag-data.png)

 > [!TIP]
 > If you know the name of the data or module you want, use the search bar at the top of the palette to find it quickly.  The rest of this quickstart will use this shortcut.

## Visualize the data

Visualize your data to understand more about the information you have to work with.

1. Click the output port at the bottom of the automobile dataset then select **Visualize**.

    > [!TIP]
    > Datasets and modules have input and output ports represented by small circles - input ports at the top, output ports at the bottom. To create a flow of data through your experiment, you'll connect an output port of one module to an input port of another. 

     In this dataset, each row represents an automobile, and the variables associated with each automobile appear as columns.  In the [Develop a predictive solution tutorial](), you'll predict the price of an automobile, found in far-right column (column 26, titled "price").

     Each time you click a column of data, the **Statistics** information and **Visualization** image of that column appears on the left. 

1. Click on **make**.  This column is String Feature, with 22 unique values in 205 rows and no missing values. The histogram shows the distribution of **make** in the dataset. 

     ![visualization-result](./media/quickstart-ui-run-experiment/make.png)

1. Click on each column to understand more about this dataset. 

## Prepare data

A dataset usually requires some preprocessing before it can be analyzed. You might have noticed the missing values present in the columns of various rows. These missing values need to be cleaned so the model can analyze the data correctly. You'll remove any rows that have missing values. Also, the normalized-losses column has a large proportion of missing values, so you'll exclude that column from the model altogether.

> [!TIP]
> Cleaning the missing values from input data is a prerequisite for using most of the modules.  

### Remove normalized-losses

First,  remove the **normalized-losses** column completely.

1. Type **Select** in the Search box to find the **Select Columns in Dataset** module.

1. Click and drag the **Select Columns in Dataset** onto the canvas. Drop this module below the dataset you added earlier.

1. Connect the dataset to the **Select Columns in Dataset**: click the output port of the dataset (the small circle at the bottom of the dataset), drag to the input port of **Select Columns in Dataset** (the small circle at the top of the module), then release the mouse button. The dataset and module remain connected even if you move either around on the canvas.

    > [!TIP]
    > If you have trouble connecting modules, try dragging all the way into the node you are connecting.  


    The experiment should now look something like this:

    ![select-column](./media/quickstart-ui-run-experiment/select-columns.png)

    The red exclamation mark indicates that you haven't set the properties for this module yet. You'll do that next.


1. Select **Select Columns in Dataset**, and in the **Properties** pane to the right of the canvas, click **Launch column selector**.

    * On the left, select **With rules**.

    * Select **ALL COLUMNS**.
        
    * From the drop-downs, select **Exclude** and **column names**, and then click inside the text box. Type **normalized-losses**.
        
    * Click the check mark (OK) button to close the column selector (on the lower-right).
        
    ![Exclude a column](./media/quickstart-ui-run-experiment/exclude-column.png)
        
    Now the properties pane for Select Columns in Dataset indicates that it will pass through all columns from the dataset except **normalized-losses**.
        
    The properties pane shows that the **normalized-losses** column is excluded.
        
    ![Property pane](./media/quickstart-ui-run-experiment/property-pane.png)
        
    > [!TIP]
    > You can add a comment to a module by double-clicking the module and entering text. This can help you see at a glance what the module is doing in your experiment. In this case double-click the **Select Columns in Dataset** module and type the comment "Exclude normalized losses."
        
    ![Comments](./media/quickstart-ui-run-experiment/comments.png)

### Clean missing data

Now add another module that removes any row that has missing data.

1. Type **Clean** in the Search box to find the **Clean Missing Data** module.

1. Drag the **Clean Missing Data** module to the experiment canvas and connect it to the **Select Columns in Dataset** module. 

1. In the Properties pane, select **Remove entire row** under **Cleaning mode**.

    These options direct **Clean Missing Data** to clean the data by removing rows that have any missing values.

1. Double-click the module and type the comment "Remove missing value rows."
 
     ![Remove rows](./media/quickstart-ui-run-experiment/remove-rows.png)


## Run the experiment

At any time, you can click the output port of a dataset or module to see what the data looks like at that point in the data flow.  However, if the module doesn't yet know its data, the **Visualize** option will be disabled.  In this case, you need to first run the experiment. By running the experiment, the column definitions for your data pass from the dataset, through the **Select Columns in Dataset** module, and through the **Clean Missing Data** module.  After the run, you will be able to visualize the results of your cleaning steps.

An experiment runs on a compute target, a compute resource that is attached to your workspace.  Once you create a compute target, you can reuse it for future runs.

1. Click **Run** at the bottom to run the experiment.

     ![Run experiment](./media/quickstart-ui-run-experiment/run-experiment.png)

1. In the **Setup Compute Targets** dialog, if your workspace already has a compute target, you can select it now.  Otherwise, select **Create new**.

1. Provide a name for your compute target.

1. Select **Run**.

    ![Setup compute target](./media/quickstart-ui-run-experiment/set-compute.png)

    Your compute resource will now be created. This step takes approximately 10 minutes. Once the resource has been created, you can reuse it and skip this wait. View the status in the top-right corner of the experiment.

    After the compute target is available, the experiment runs. When the run is complete, a green checkmark appears on each module.

    ![View status](./media/quickstart-ui-run-experiment/status.png)
  

## Visualize the results

Now that you have run the experiment, right-click on the **Clean Missing Data** module to visualize the new clean data.  

![Visualize clean data](./media/quickstart-ui-run-experiment/visualize-cleaned.png)

## Clean up resources

[!INCLUDE [aml-delete-resource-group](../../../includes/aml-delete-resource-group.md)]

## Next steps

In this quickstart, you learned how to:

- Create your first experiment
- Add data
- Visualize the data
- Prepare the data
- Run an experiment
- Visualize the results

Continue to the tutorial to use this data to predict the price of an automobile.

> [!div class="nextstepaction"]
> [Tutorial: Develop a predictive solution in Studio]()
