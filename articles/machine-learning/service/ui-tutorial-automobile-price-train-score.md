---
title: 'Tutorial: Predict automobile price with the visual interface'
titleSuffix: Azure Machine Learning
description: Learn how to train, score, and deploy a machine learning model using a drag and drop visual interface. This tutorial is part one of a two-part series on predicting automobile prices using linear regression.

author: peterclu
ms.author: peterlu
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: tutorial
ms.date: 10/09/2019
---

# Tutorial: Predict automobile price with the visual interface

In this two-part tutorial, you learn how to use Azure Machine Learning's visual interface to develop and deploy a predictive analytic solution that predicts the price of any car. 

In part one, you set up your environment, drag-and-drop datasets and analysis modules onto an interactive canvas, and connect them together to create a pipeline. 

In part one of the tutorial you learn how to:

> [!div class="checklist"]
> * Create a new pipeline
> * Import data
> * Prepare data
> * Train a machine learning model
> * Evaluate a machine learning model

In [part two](ui-tutorial-automobile-price-deploy.md) of the tutorial, you learn how to deploy your predictive model as an Azure web service to predict the price of any car based on technical specifications you send it. 

A completed version of this tutorial is available as a sample pipeline.

To find it, go to the **Visual interface in your workspace**. In the **New pipeline** section, select **Sample 1 - Regression: Automobile Price Prediction(Basic)**.

## Create a new pipeline

To create a visual interface pipeline, you first need  an Azure Machine Learning service workspace. In this section, you learn how to create both these resources.

### Create a new workspace

If you have an Azure Machine Learning workspace, skip to the next section.

[!INCLUDE [aml-create-portal](../../../includes/aml-create-in-portal.md)]

### Create a pipeline

1. Open [Azure Machine Learning studio](https://ml.azure.com), sign-in if you are prompted to, and select the workspace you want to work with.

1. In the studio, select **Visual Interface**.

    ![Screenshot of the Azure portal showing how to access the Visual interface from a Machine Learning service workspace](./media/ui-tutorial-automobile-price-train-score/launch-visual-interface.png)

1. Select **Blank Pipeline**.

1. Select the default pipeline name **"Pipeline-Created-on ...**" at the top of the canvas and rename it to something meaningful. For example, **"Automobile price prediction"**. The name doesn't need to be unique.

## Import data

Machine learning depends on data. Luckily, there are several sample datasets included in this interface available for you to experiment with. For this tutorial, use the sample dataset **Automobile price data (Raw)**. 

1. To the left of the pipeline canvas is a palette of datasets and modules. Select **Datasets** then view the **Samples** section to view the available sample datasets.

1. Select the dataset, **Automobile price data (Raw)**, and drag it onto the canvas.

   ![Drag data to canvas](./media/ui-tutorial-automobile-price-train-score/drag-data.gif)

1. Select which columns of data to work with. Type **Select** in the Search box at the top of the palette to find the **Select Columns in Dataset** module.

1. Click and drag the **Select Columns in Dataset** module onto the canvas. Drop the module below the dataset module.

1. Connect the dataset you added earlier to the **Select Columns in Dataset** module by clicking and dragging. Drag from the dataset's output port, which is the small circle at the bottom of the dataset on the canvas, to the input port of **Select Columns in Dataset**, which is the small circle at the top of the module.

    > [!TIP]
    > You create a flow of data through your pipeline when you connect the output port of one module to an input port of another.
    >

    ![Connect modules](./media/ui-tutorial-automobile-price-train-score/connect-modules.gif)

1. Select the **Select Columns in Dataset** module.

1. In the **Properties** pane to the right of the canvas, select **Edit column**.

    In the **Select Columns** dialog, select **All columns** and include **All features**.

1. On the lower right, select **Save** to close the column selector.

### Run the pipeline

At any time, click the output port of a dataset or module to see what the data looks like at that point in the data flow. If the **Visualize** option is disabled, you first need to run the pipeline.

[!INCLUDE [aml-ui-create-training-compute](../../../includes/aml-ui-create-training-compute.md)]

After the compute target is available, the pipeline runs. When the run is complete, a green check mark appears on each module.

### Visualize the data

Now that you have run your initial pipeline, you can visualize the data to understand more about the dataset you have.

1. Select the **Select Columns in Dataset**.

1. In the **Properties** pane to the right of the canvas, select **Outputs**.

1. Select the graph icon to visualize the data.



1. Select the different columns in the data window to view information about that column.

    In this dataset, each row represents an automobile, and the variables associated with each automobile appear as columns. There are 205 rows and 26 columns in this dataset.

    Each time you click a column of data, the **Statistics** information and **Visualization** image of that column appears on the right.

    [![Preview the data](./media/ui-tutorial-automobile-price-train-score/preview-data.gif)](./media/ui-tutorial-automobile-price-train-score/preview-data.gif#lightbox)

1. Click each column to understand more about your dataset, and think about whether these columns will be useful to predict the price of an automobile.

## Prepare data

Typically, a dataset requires some preprocessing before it can be analyzed. You might have noticed some missing values when visualizing the dataset. These missing values need to be cleaned so the model can analyze the data correctly. You'll remove any rows that have missing values. Also, the **normalized-losses** column has a large number of missing values, so you'll exclude that column from the model altogether.

> [!TIP]
> Cleaning the missing values from input data is a prerequisite for using most of the modules in the visual interface.

### Remove column

First, remove the **normalized-losses** column completely.

1. Select the **Select Columns in Dataset** module.

1. In the **Properties** pane to the right of the canvas, select **Parameters** > **Edit column**.

    * Select the **+** to add a new rule.

    * From the drop-downs, select **Exclude** and **Column names**, and then click inside the text box. Type **normalized-losses**.

    * On the lower right, select **Save** to close the column selector.

    ![Exclude a column](./media/ui-tutorial-automobile-price-train-score/exclude-column.png)
        
    Now the properties pane for Select Columns in Dataset indicates that it will pass through all columns from the dataset except **normalized-losses**.
        
    The properties pane shows that the **normalized-losses** column is excluded.

1. Select the **Select Columns in Dataset** 

1. In the **Properties** pane type "Exclude normalized losses." in the **Comment** box.

### Clean missing data

When you train a model, you have to do something about the data that is missing. In this case, you'll add a module to remove any remaining row that has missing data.

1. Type **Clean** in the Search box to find the **Clean Missing Data** module.

1. Drag the **Clean Missing Data** module to the pipeline canvas and connect it to the **Select Columns in Dataset** module. 

1. In the Properties pane, select **Remove entire row** under **Cleaning mode**.

1. In the **Properties** pane type "Remove missing value rows." in the **Comment** box.  

    Your pipeline should now look something like this:
    
    ![select-column](./media/ui-tutorial-automobile-price-train-score/pipeline-clean.png)

## Train a machine learning model

Now that the data is ready, you can construct a predictive model. You'll use your data to train the model. Then you'll test the model to see how closely it's able to predict prices.

### Select an algorithm

**Classification** and **regression** are two types of supervised machine learning algorithms. **Classification** predicts an answer from a defined set of categories, such as a color (red, blue, or green). **Regression** is used to predict a number.

Because you want to predict price, which is a number, you can use a regression algorithm. For this example, you'll use a linear regression model.

### Split the data

Use your data for both training the model and testing it by splitting the data into separate training and testing datasets.

1. Type **split data** in the search box to find the **Split Data** module and connect it to the left port of the **Clean Missing Data** module.

1. Select the **Split Data** module. In the Properties pane, set the **Fraction of rows in the first output dataset** to 0.7. This way, we'll use 70 percent of the data to train the model, and hold back 30 percent for testing.

1. In the **Properties** pane type "Split the dataset into training set(0.7) and test set(0.3)" in the **Comment** box.

### Train the model

Train the model by giving it a set of data that includes the price. The model scans the data and looks for correlations between a car's features and its price.

1. To select the learning algorithm, clear your module palette search box.

1. Expand the **Machine Learning**. This displays several categories of modules that can be used to initialize machine learning algorithms.

1. For this pipeline, select **Regression** > **Linear Regression** and drag it to the pipeline canvas.

1. Find and drag the **Train Model** module to the pipeline canvas. Connect the output of the Linear Regression module to the left input of the Train Model module, and connect the training data output (left port) of the **Split Data** module to the right input of the **Train Model** module.

    ![Screenshot showing the correct configuration of the Train Model module. The Linear Regression module connects to left port of Train Model module and the Split Data module connects to right port of Train Model](./media/ui-tutorial-automobile-price-train-score/pipeline-train-model.png)

1. Select the **Train Model** module. In the Properties pane, select **Edit column** selector and then type **price** next to **Column names**. Price is the value that your model is going to predict

    Your pipeline should look like this:

    ![Screenshot showing the correct configuration of the pipeline after adding the Train Model module.](./media/ui-tutorial-automobile-price-train-score/pipeline-train-graph.png)

## Evaluate a machine learning model

Now that you've trained the model using 70 percent of your data, you can use it to score the other 30 percent of the data to see how well your model functions.

1. Type **score model** in the search box to find the **Score Model** module and drag the module to the pipeline canvas. Connect the output of the **Train Model** module to the left input port of **Score Model**. Connect the test data output (right port) of the **Split Data** module to the right input port of **Score Model**.

1. Type **evaluate** in the search box to find the **Evaluate Model** and drag the module to the pipeline canvas. Connect the output of the **Score Model** module to the left input of **Evaluate Model**. The final pipeline should look something like this:

    ![Screenshot showing the correct configuration of the pipeline.](./media/ui-tutorial-automobile-price-train-score/pipeline-final-graph.png)

1. Run the pipeline using the compute resource you created earlier.

1. View the output from the **Score Model** module by selecting the **Score Model** module. Then, in the **Properties** pane, select **Output** > **Visualize**. The output shows the predicted values for price and the known values from the test data.

    ![Screenshot of the output visualization highlighting the "Scored Label" column](./media/ui-tutorial-automobile-price-train-score/score-result.png)

1. To view the output from the **Evaluate Model** module select the **Score Model** module. Then, in the **Properties** pane, select **Output** > **Visualize**, and then select **Visualize**.

    ![Screenshot showing the evaluation results for the final pipeline.](./media/ui-tutorial-automobile-price-train-score/evaluate-result.png)

The following statistics are shown for your model:

* **Mean Absolute Error (MAE)**: The average of absolute errors (an error is the difference between the predicted value and the actual value).
* **Root Mean Squared Error (RMSE)**: The square root of the average of squared errors of predictions made on the test dataset.
* **Relative Absolute Error**: The average of absolute errors relative to the absolute difference between actual values and the average of all actual values.
* **Relative Squared Error**: The average of squared errors relative to the squared difference between the actual values and the average of all actual values.
* **Coefficient of Determination**: Also known as the R squared value, this is a statistical metric indicating how well a model fits the data.

For each of the error statistics, smaller is better. A smaller value indicates that the predictions more closely match the actual values. For Coefficient of Determination, the closer its value is to one (1.0), the better the predictions.

## Clean up resources

[!INCLUDE [aml-ui-cleanup](../../../includes/aml-ui-cleanup.md)]

## Next steps

In part one of this tutorial, you completed these steps:

* Created a pipeline
* Prepared the data
* Trained the model
* Scored and evaluated the model

In part two, you'll learn how to deploy your model as a pipeline endpoint.

> [!div class="nextstepaction"]
> [Continue to deploying models](ui-tutorial-automobile-price-deploy.md)
