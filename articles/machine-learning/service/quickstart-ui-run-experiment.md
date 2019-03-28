---
title: "Quickstart: Create  your first data science experiment without writing code"
titleSuffix: Azure Machine Learning Studio
description: Use Azure Machine Learning service without writing any code.  Use a drag-and-drop user interface to create a machine learning experiment to prepare and visualize your data.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: quickstart
author: sdgilley
ms.author: sgilley
ms.date: 04/15/2019
---

# Quickstart: Create your first data science experiment without writing code

Use the drag-and-drop user interface to create your first machine learning experiment without writing any code.

In this quickstart you will explore and prepare data in order to train a model:

- Create your first experiment
- Add data
- Visualize the data
- Prepare the data
- Run an experiment
- Visualize the results

After you complete this quickstart, you can use this experiment to [train a model]().

If you're brand new to machine learning, the video series [Data Science for Beginners](https://docs.microsoft.com/en-us/azure/machine-learning/studio/data-science-for-beginners-the-5-questions-data-science-answers) is a great introduction to machine learning using everyday language and concepts.

## Create your first experiment

To create your experiment, open your Machine Learning workspace in the [Azure portal](https://portal.azure.com). If you don't have a Machine Learning service workspace yet, [create your workspace](setup-create-workspace.md) now.

After you open your Machine Learning service workspace in the Azure portal, you see **Machine Learning Studio(Preview)** on the left side. Click  **Launch Studio Workspace**, then click **Launch Workspace in Studio**.   Studio V2 will open in a new browser tab.

Select  **Add New**  in the left bottom corner. 

Select **Experiment** -> **Blank Experiment**

Your experiment is given a default name. Select this text and rename it to something meaningful, for example, **Quickstart-explore data**. This name doesn't need to be unique.

![rename](./media/quickstart-ui-run-experiment/rename.PNG)

## Add data

The first thing you need in machine learning is data. There are several sample datasets included with Studio that you can use, or you can import data from many sources. For this example, you'll use the sample dataset **Automobile price data (Raw)**. This dataset includes entries for various individual automobiles, including information such as make, model, technical specifications, and price.  

1. To the left of the experiment canvas is a palette of datasets and modules. Type **automobile** in the Search box at the top of this palette to find the dataset labeled **Automobile price data (Raw)**. Drag this dataset to the experiment canvas.

   ![search-data](./media/quickstart-ui-run-experiment/search-data.PNG)

## Visualize the data

Visualize your data to understand more about the information you have to work with.

Click the output port at the bottom of the automobile dataset then select **Visualize**.

 > [!TIP]
 > Datasets and modules have input and output ports represented by small circles - input ports at the top, output ports at the bottom. To create a flow of data through your experiment, you'll connect an output port of one module to an input port of another. At any time, you can click the output port of a dataset or module to see what the data looks like at that point in the data flow.

 In this dataset, each row represents an automobile, and the variables associated with each automobile appear as columns.  In the [Develop a predictive solution tutorial](), you'll predict the price of an automobile, found in far-right column (column 26, titled "price").

 ![visualization-result](./media/quickstart-ui-run-experiment/visualize-result.PNG)

 Each time you click a column of data, the **Statistics** information and **Visualization** image of that column appears on the left. Click on **make**.  You see that it is a String Feature, with 22 unique values in 205 rows and no missing values. The histogram shows the distribution of **make** in the dataset. Click on each column to understand more about this dataset.

 ![visualization-result](./media/quickstart-ui-run-experiment/make.PNG)

## Prepare data

A dataset usually requires some preprocessing before it can be analyzed. You might have noticed the missing values present in the columns of various rows. These missing values need to be cleaned so the model can analyze the data correctly. You'll remove any rows that have missing values. Also, the normalized-losses column has a large proportion of missing values, so you'll exclude that column from the model altogether. 

> [!TIP]
> Cleaning the missing values from input data is a prerequisite for using most of the modules.

### Remove normalized-losses

First,  remove the normalized-losses column completely. 

1. Type **Select** in the Search box to find **Select Columns in Dataset** module.

1. Click and drag the **Select Columns in Dataset** onto the canvas. Drop this module below the dataset you added earlier.

1. Connect the dataset to the **Select Columns in Dataset**: click the output port of the dataset (the small circle at the bottom of the dataset), drag to the input port of **Select Columns in Dataset** (the small circle at the top of the module), then release the mouse button. The dataset and module remain connected even if you move either around on the canvas.

    The experiment should now look something like this:

    ![select-column](./media/quickstart-ui-run-experiment/select-columns.PNG)

    The red exclamation mark indicates that you haven't set the properties for this module yet. You'll do that next.


1. Select **Select Columns in Dataset**, and in the Properties pane to the right of the canvas, click **Launch column selector**.

    * On the left, click **With rules**.
        
    * From the drop-downs, select **Exclude** and **column names**, and then click inside the text box. Type **normalized-losses**.
        
    * Click the check mark (OK) button to close the column selector (on the lower right).
        
    ![column-selector](./media/quickstart-ui-run-experiment/exclude-column.PNG)
        
    Now the properties pane for Select Columns in Dataset indicates that it will pass through all columns from the dataset except normalized-losses.
        
    The properties pane shows that the "normalized-losses" column is excluded.
        
    ![property-pane](./media/quickstart-ui-run-experiment/property-pane.PNG)
        
    > [!TIP]
    > You can add a comment to a module by double-clicking the module and entering text. This can help you see at a glance what the module is doing in your experiment. In this case double-click the **Select Columns in Dataset** module and type the comment "Exclude normalized losses."
        
    ![comments](./media/quickstart-ui-run-experiment/comments.PNG)

### Clean missing data

Now add another module that removes any row that has missing data.

1. Drag the **Clean Missing Data** module to the experiment canvas and connect it to the **Select Columns in Dataset** module. 

1. In the Properties pane, select **Remove entire row** under **Cleaning mode**. These options direct **Clean Missing Data** to clean the data by removing rows that have any missing values. Double-click the module and type the comment "Remove missing value rows."
 
     ![remove-rows](./media/quickstart-ui-run-experiment/remove-rows.PNG)

## Run the experiment

To run the experiment you first need to create a compute target. A compute target is the compute resource that you use to run your experiment.  Once you have created a compute target, future runs automatically use the same resource.

1. Click **Run** > **Run all** at the bottom to run the experiment. 

1. In the **Setup Compute Targets** dialog, provide a name for your compute target.

1. Select **Run**.

    Your compute resource will now be created. View the status in the top right corner of your experiment. After the compute target is available, the experiment runs. 
    
    When the run is complete, a green checkmark appears on each module.
    
> [!TIP]
> Why did you run the experiment now? By running the experiment, the column definitions for your data pass from the dataset, through the **Select Columns in Dataset** module, and through the **Clean Missing Data** module. This means that any modules you connect to **Clean Missing Data** will also have this same information.

## Visualize the results

Right click on the **Clean Missing Data** module to visualize the new clean data.  


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
