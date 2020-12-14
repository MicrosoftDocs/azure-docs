---
title: "Tutorial: Drag-and-drop to create the predictive model (part 1 of 2)"
titleSuffix: Azure Machine Learning
description: Learn how to build and deploy a machine learning predictive model with designer, so you can use it to predict outcomes in Microsoft Power BI.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: tutorial
ms.author: samkemp
author: samuel100
ms.reviewer: sdgilley
ms.date: 12/11/2020
---

# Tutorial:  Power BI integration - drag-and-drop to create the predictive model (part 1 of 2)

In the first part of this tutorial, you train and deploy a predictive machine learning model using Azure Machine Learning designer - a low-code drag-and-drop user interface. In part 2, you'll then use the model to predict outcomes in Microsoft Power BI.

In this tutorial, you:

> [!div class="checklist"]
> * Create an Azure Machine Learning compute instance
> * Create an Azure Machine Learning inference cluster
> * Create a dataset
> * Train a regression model
> * Deploy the model to a real-time scoring endpoint


There are three different ways to create and deploy the model you'll use in Power BI.  This article covers Option B: Train and deploy models using designer.  This option shows a low-code authoring experience using designer (a drag-and-drop user interface).  

You could instead use:

* [Option A: Train and deploy models using Notebooks](tutorial-power-bi-custom-model.md) -  a code-first authoring experience using Jupyter notebooks hosted in Azure Machine Learning studio.
* [Option C: Train and deploy models using automated ML](tutorial-power-bi-automated-model.md) - a no-code authoring experience that fully automates the data preparation and model training.

## Prerequisites

- An Azure subscription ([a free trial is available](https://aka.ms/AMLFree)). 
- An Azure Machine Learning workspace. If you do not already have a workspace, follow [how to create an Azure Machine Learning Workspace](./how-to-manage-workspace.md#create-a-workspace).
- Introductory knowledge of machine learning workflows.


## Create compute for training and scoring

In this section, you create a *compute instance*, which is used for training machine learning models. Also, you create an *inference cluster* that will be used to host the deployed model for real-time scoring.

Log into the [Azure Machine Learning studio](https://ml.azure.com) and select **Compute** from the left-hand menu followed by **New**:

:::image type="content" source="media/tutorial-power-bi/create-new-compute.png" alt-text="Screenshot showing how to create compute instance":::

On the resulting **Create compute instance** screen, select a VM size (for this tutorial, select a `Standard_D11_v2`) followed by **Next**. In the Setting page, provide a valid name for your compute instance followed by selecting **Create**. 

>[!TIP]
> The compute instance can also be used to create and execute notebooks.

You can now see your compute instance **Status** is **Creating** - it will take around 4 minutes for the machine to be provisioned. While you are waiting, select **Inference Cluster** tab on the compute page followed by **New**:

:::image type="content" source="media/tutorial-power-bi/create-cluster.png" alt-text="Screenshot showing how to create an inference cluster":::

In the resulting **Create inference cluster** page, select a region followed by a VM size (for this tutorial, select a `Standard_D11_v2`), then select **Next**. On the **Configure Settings** page:

1. Provide a valid compute name
1. Select **Dev-test** as the cluster purpose (creates a single node to host the deployed model)
1. Select **Create**

You can now see your inference cluster **Status** is **Creating** - it will take around 4 minutes for your single node cluster to deploy.

## Create a dataset

In this tutorial, you use the [Diabetes dataset](https://www4.stat.ncsu.edu/~boos/var.select/diabetes.html), which is made available in [Azure Open Datasets](https://azure.microsoft.com/services/open-datasets/).

To create the dataset, in the left-hand menu select **Datasets**, then **Create Dataset** - you will see the following options:

:::image type="content" source="media/tutorial-power-bi/create-dataset.png" alt-text="Screenshot showing how to create a new dataset":::

Select **From Open Datasets**, and then in **Create dataset from Open Datasets** screen:

1. Search for *diabetes* using the search bar
1. Select **Sample: Diabetes**
1. Select **Next**
1. Provide a name for your dataset - *diabetes*
1. Select **Create**

You can explore the data by selecting the Dataset followed by **Explore**:

:::image type="content" source="media/tutorial-power-bi/explore-dataset.png" alt-text="Screenshot showing how to dataset explore":::

The data has 10 baseline input variables (such as age, sex, body mass index, average blood pressure, and six blood serum measurements), and one target variable named **Y** (a quantitative measure of diabetes progression one year after baseline).

## Create a Machine Learning model using designer

Once you have created the compute and datasets, you can move on to creating the machine learning model using designer. In the Azure Machine Learning studio, select **Designer** followed by **New Pipeline**:

:::image type="content" source="media/tutorial-power-bi/create-designer.png" alt-text="Screenshot showing how to create a new pipeline":::

You see a blank *canvas* where you can also see a **Settings menu**:

:::image type="content" source="media/tutorial-power-bi/select-compute.png" alt-text="Screenshot showing how to select a compute target":::

On the **Settings menu**, **Select compute target** and then select the compute instance you created earlier followed by **Save**. Rename your **Draft name** to something more memorable (for example *diabetes-model*) and enter a description.

Next, in listed assets expand **Datasets** and locate the **diabetes** dataset - drag-and-drop this module onto the canvas:

:::image type="content" source="media/tutorial-power-bi/drag-component.png" alt-text="Screenshot showing how to drag a component on":::

Next, drag-and-drop the following components on to the canvas:

1. Linear regression (located in **Machine Learning Algorithms**)
1. Train model (located in **Model Training**)

Your canvas should look like (notice that the top-and-bottom of the components has little circles called ports - highlighted in red below):

:::image type="content" source="media/tutorial-power-bi/connections.png" alt-text="Screenshot showing how unconnected components":::
 
Next, you need to *wire* these components together. Select the port at the bottom of the **diabetes** dataset and drag it to the right-hand port at the top of the **Train model** component. Select the port at the bottom of the **Linear regression** component and drag onto the left-hand port at the top of the **Train model** port.

Choose the column in the dataset to be used as the label (target) variable to predict. Select the **Train model** component followed by **Edit column**. From the dialog box - Select the **Enter Column name** followed by **Y** in the drop-down list:

:::image type="content" source="media/tutorial-power-bi/label-columns.png" alt-text="Screenshot select label column":::

Select **Save**. Your machine learning *workflow* should look as follows:

:::image type="content" source="media/tutorial-power-bi/connected-diagram.png" alt-text="Screenshot showing how connected components":::

Select **Submit** and then **Create new** under experiment. Provide a name for the experiment followed by **Submit**.

>[!NOTE]
> It should take around 5-minutes for your experiment to complete on the first run. Subsequent runs are much quicker - designer caches already run components to reduce latency.

When the experiment is completed, you see:

:::image type="content" source="media/tutorial-power-bi/completed-run.png" alt-text="Screenshot showing completed run":::

You can inspect the logs of the experiment by selecting **Train model** followed by **Outputs + logs**.

## Deploy the model

To deploy the model, select **Create Inference Pipeline** (located at the top of the canvas) followed by **Real-time inference pipeline**:

:::image type="content" source="media/tutorial-power-bi/pipeline.png" alt-text="Screenshot showing real-time inference pipeline":::
 
The pipeline condenses to just the components necessary to do the model scoring. When you score the data you will not know the target variable values, therefore we can remove **Y** from the dataset. To remove, add to the canvas a **Select columns in Dataset** component. Wire the component so the diabetes dataset is the input, and the results are the output into the **Score Model** component:

:::image type="content" source="media/tutorial-power-bi/remove-column.png" alt-text="Screenshot showing removal of a column":::

Select the **Select Columns in Dataset** component on the canvas followed by **Edit Columns**. In the Select columns dialog, select **By name** and then ensure all the input variables are selected but **not** the target:

:::image type="content" source="media/tutorial-power-bi/removal-settings.png" alt-text="Screenshot showing removal of a column settings":::

Select **Save**. Finally, select the **Score Model** component and ensure the **Append score columns to output** checkbox is unchecked (only the predictions are sent back, rather than the inputs *and* predictions, reducing latency):

:::image type="content" source="media/tutorial-power-bi/score-settings.png" alt-text="Screenshot showing score model component settings":::

Select **Submit** at the top of the canvas.

When you have successfully run the inference pipeline, you can then deploy the model to your inference cluster. Select **Deploy**, which will show the **Set-up real-time endpoint** dialog box. Select **Deploy new real-time endpoint**, name the endpoint **my-diabetes-model**, select the inference you created earlier, select **Deploy**:

:::image type="content" source="media/tutorial-power-bi/endpoint-settings.png" alt-text="Screenshot showing real-time endpoint settings":::
## Next steps

In this tutorial, you saw how to train and deploy a designer model. In the next part, you learn how to consume (score) this model from Power BI.

> [!div class="nextstepaction"]
> [Tutorial: Consume model in Power BI](/power-bi/connect-data/service-aml-integrate?context=azure/machine-learning/context/ml-context)
