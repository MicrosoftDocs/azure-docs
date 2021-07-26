---
title: "Tutorial: Drag and drop to create the predictive model (part 1 of 2)"
titleSuffix: Azure Machine Learning
description: Learn how to build and deploy a machine learning predictive model by using the designer. Later, you can use it to predict outcomes in Microsoft Power BI.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: tutorial
ms.author: samkemp
author: samuel100
ms.reviewer: sdgilley
ms.date: 12/11/2020
ms.custom: designer
---

# Tutorial: Power BI integration - Drag and drop to create the predictive model (part 1 of 2)

In part 1 of this tutorial, you train and deploy a predictive machine learning model by using the Azure Machine Learning designer. The designer is a low-code drag-and-drop user interface. In part 2, you'll use the model to predict outcomes in Microsoft Power BI.

In this tutorial, you:

> [!div class="checklist"]
> * Create an Azure Machine Learning compute instance.
> * Create an Azure Machine Learning inference cluster.
> * Create a dataset.
> * Train a regression model.
> * Deploy the model to a real-time scoring endpoint.


There are three ways to create and deploy the model you'll use in Power BI.  This article covers "Option B: Train and deploy models by using the designer."  This option is a low-code authoring experience that uses the designer interface.  

But you could instead use one of the other options:

* [Option A: Train and deploy models by using Jupyter Notebooks](tutorial-power-bi-custom-model.md). This code-first authoring experience uses Jupyter Notebooks that are hosted in Azure Machine Learning Studio.
* [Option C: Train and deploy models by using automated machine learning](tutorial-power-bi-automated-model.md). This no-code authoring experience fully automates data preparation and model training.

## Prerequisites

- An Azure subscription. If you don't already have a subscription, you can use a [free trial](https://azure.microsoft.com/free/). 
- An Azure Machine Learning workspace. If you don't already have a workspace, see [Create and manage Azure Machine Learning workspaces](./how-to-manage-workspace.md#create-a-workspace).
- Introductory knowledge of machine learning workflows.


## Create compute to train and score

In this section, you create a *compute instance*. Compute instances are used to train machine learning models. You also create an *inference cluster* to host the deployed model for real-time scoring.

Sign in to [Azure Machine Learning Studio](https://ml.azure.com). In the menu on the left, select **Compute** and then **New**:

:::image type="content" source="media/tutorial-power-bi/create-new-compute.png" alt-text="Screenshot showing how to create a compute instance.":::

On the **Create compute instance** page, select a VM size. For this tutorial, select a **Standard_D11_v2** VM. Then select **Next**. 

On the **Settings** page, name your compute instance. Then select **Create**. 

>[!TIP]
> You can also use the compute instance to create and run notebooks.

Your compute instance **Status** is now **Creating**. The machine takes around 4 minutes to provision. 

While you wait, on the **Compute** page, select the **Inference clusters** tab. Then select **New**:

:::image type="content" source="media/tutorial-power-bi/create-cluster.png" alt-text="Screenshot showing how to create an inference cluster.":::

On the **Create inference cluster** page, select a region and a VM size. For this tutorial, select a **Standard_D11_v2** VM. Then select **Next**. 

On the **Configure Settings** page:

1. Provide a valid compute name.
1. Select **Dev-test** as the cluster purpose. This option creates a single node to host the deployed model.
1. Select **Create**.

Your inference cluster **Status** is now **Creating**. Your single node cluster takes around 4 minutes to deploy.

## Create a dataset

In this tutorial, you use the [Diabetes dataset](https://www4.stat.ncsu.edu/~boos/var.select/diabetes.html). This dataset is  available in [Azure Open Datasets](https://azure.microsoft.com/services/open-datasets/).

To create the dataset, in the menu on the left, select **Datasets**. Then select **Create dataset**. You see the following options:

:::image type="content" source="media/tutorial-power-bi/create-dataset.png" alt-text="Screenshot showing how to create a new dataset.":::

Select **From Open Datasets**. On the **Create dataset from Open Datasets** page:

1. Use the search bar to find *diabetes*.
1. Select **Sample: Diabetes**.
1. Select **Next**.
1. Name your dataset *diabetes*.
1. Select **Create**.

To explore the data, select the dataset and then select **Explore**:

:::image type="content" source="media/tutorial-power-bi/explore-dataset.png" alt-text="Screenshot showing how to explore a dataset.":::

The data has 10 baseline input variables, such as age, sex, body mass index, average blood pressure, and six blood serum measurements. It also has one target variable, named **Y**. This target variable is a quantitative measure of diabetes progression one year after the baseline.

## Create a machine learning model by using the designer

After you create the compute and datasets, you can use the designer to create the machine learning model. In Azure Machine Learning Studio, select **Designer** and then **New pipeline**:

:::image type="content" source="media/tutorial-power-bi/create-designer.png" alt-text="Screenshot showing how to create a new pipeline.":::

You see a blank *canvas* and a **Settings** menu:

:::image type="content" source="media/tutorial-power-bi/select-compute.png" alt-text="Screenshot showing how to select a compute target.":::

On the **Settings** menu, choose **Select compute target**. Select the compute instance you created earlier, and then select **Save**. Change the **Draft name** to something more memorable, such as *diabetes-model*. Finally, enter a description.

In list of assets, expand **Datasets** and locate the **diabetes** dataset. Drag this component onto the canvas:

:::image type="content" source="media/tutorial-power-bi/drag-component.png" alt-text="Screenshot showing how to drag a component onto the canvas.":::

Next, drag the following components onto the canvas:

1. **Linear Regression** (located in **Machine Learning Algorithms**)
1. **Train Model** (located in **Model Training**)

On your canvas, notice the circles at the top and bottom of the components. These circles are ports.

:::image type="content" source="media/tutorial-power-bi/connections.png" alt-text="Screenshot showing the ports on unconnected components.":::
 
Now *wire* the components together. Select the port at the bottom of the **diabetes** dataset. Drag it to the port on the upper-right side of the **Train Model** component. Select the port at the bottom of the **Linear Regression** component. Drag it to the port on the upper-left side of the **Train Model** component.

Choose the dataset column to use as the label (target) variable to predict. Select the **Train Model** component and then select **Edit column**. 

In the dialog box, select **Enter column name** > **Y**:

:::image type="content" source="media/tutorial-power-bi/label-columns.png" alt-text="Screenshot showing how to select a label column.":::

Select **Save**. Your machine learning *workflow* should look like this:

:::image type="content" source="media/tutorial-power-bi/connected-diagram.png" alt-text="Screenshot showing connected components.":::

Select **Submit**. Under **Experiment**, select **Create new**. Name the experiment, and then select **Submit**.

>[!NOTE]
> Your experiment's first run should take around 5 minutes. Subsequent runs are much quicker because the designer caches components that have been run to reduce latency.

When the experiment finishes, you see this view:

:::image type="content" source="media/tutorial-power-bi/completed-run.png" alt-text="Screenshot showing a completed run.":::

To inspect the experiment logs, select **Train Model** and then select **Outputs + logs**.

## Deploy the model

To deploy the model, at the top of the canvas, select **Create inference pipeline** > **Real-time inference pipeline**:

:::image type="content" source="media/tutorial-power-bi/pipeline.png" alt-text="Screenshot showing where to select a real-time inference pipeline.":::
 
The pipeline condenses to just the components necessary to score the model. When you score the data, you won't know the target variable values. So you can remove **Y** from the dataset. 

To remove **Y**, add a **Select Columns in Dataset** component to the canvas. Wire the component so the diabetes dataset is the input. The results are the output into the **Score Model** component:

:::image type="content" source="media/tutorial-power-bi/remove-column.png" alt-text="Screenshot showing how to remove a column.":::

On the canvas, select the **Select Columns in Dataset** component, and then select **Edit Columns**. 

In the **Select columns** dialog box, choose **By name**. Then ensure that all the input variables are selected but the target is *not* selected:

:::image type="content" source="media/tutorial-power-bi/removal-settings.png" alt-text="Screenshot showing how to remove column settings.":::

Select **Save**. 

Finally, select the **Score Model** component and ensure the **Append score columns to output** check box is cleared. To reduce latency, the predictions are sent back without the inputs.

:::image type="content" source="media/tutorial-power-bi/score-settings.png" alt-text="Screenshot showing settings for the Score Model component.":::

At the top of the canvas, select **Submit**.

After you successfully run the inference pipeline, you can deploy the model to your inference cluster. Select **Deploy**. 

In the **Set-up real-time endpoint** dialog box, select **Deploy new real-time endpoint**. Name the endpoint *my-diabetes-model*. Select the inference you created earlier, and then select **Deploy**:

:::image type="content" source="media/tutorial-power-bi/endpoint-settings.png" alt-text="Screenshot showing real-time endpoint settings.":::
## Next steps

In this tutorial, you saw how to train and deploy a designer model. In the next part, you learn how to consume (score) this model in Power BI.

> [!div class="nextstepaction"]
> [Tutorial: Consume a model in Power BI](/power-bi/connect-data/service-aml-integrate?context=azure/machine-learning/context/ml-context)
