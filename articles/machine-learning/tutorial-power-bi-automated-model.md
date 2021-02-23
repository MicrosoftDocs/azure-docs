---
title: "Tutorial: Create the predictive model by using automated ML (part 1 of 2)"
titleSuffix: Azure Machine Learning
description: Learn how to build and deploy automated machine learning models so you can use the best model to predict outcomes in Microsoft Power BI.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: tutorial
ms.author: samkemp
author: samuel100
ms.reviewer: sdgilley
ms.date: 12/11/2020
---

# Tutorial: Power BI integration - Create the predictive model by using automated machine learning (part 1 of 2)

In part 1 of this tutorial, you train and deploy a predictive machine learning model. You use automated machine learning (ML) in Azure Machine Learning Studio.  In part 2, you'll use the best-performing model to predict outcomes in Microsoft Power BI.

In this tutorial, you:

> [!div class="checklist"]
> * Create an Azure Machine Learning compute cluster.
> * Create a dataset.
> * Create an automated machine learning run.
> * Deploy the best model to a real-time scoring endpoint.


There are three ways to create and deploy the model you'll use in Power BI.  This article covers "Option C: Train and deploy models by using automated machine learning in the studio."  This option is a no-code authoring experience. It fully automates data preparation and model training. 

But you could instead use one of the other options:

* [Option A: Train and deploy models by using Jupyter Notebooks](tutorial-power-bi-custom-model.md). This code-first authoring experience uses Jupyter Notebooks that are hosted in Azure Machine Learning Studio.
* [Option B: Train and deploy models by using the Azure Machine Learning designer](tutorial-power-bi-designer-model.md). This low-code authoring experience uses a drag-and-drop user interface.

## Prerequisites

- An Azure subscription. If you don't already have a subscription, you can use a [free trial](https://aka.ms/AMLFree). 
- An Azure Machine Learning workspace. If you don't already have a workspace, see [Create and manage Azure Machine Learning workspaces](./how-to-manage-workspace.md#create-a-workspace).

## Create a compute cluster

Automated machine learning trains many machine learning models to find the "best" algorithm and parameters. Azure Machine Learning parallelizes the running of the model training over a compute cluster.

To begin, in [Azure Machine Learning Studio](https://ml.azure.com), in the menu on the left, select **Compute**. Open the **Compute clusters** tab. Then select **New**:

:::image type="content" source="media/tutorial-power-bi/create-compute-cluster.png" alt-text="Screenshot showing how to create a compute cluster.":::

On the **Create compute cluster** page:

1. Select a VM size. For this tutorial, a **Standard_D11_v2** machine is fine.
1. Select **Next**.
1. Provide a valid compute name.
1. Keep **Minimum number of nodes** at `0`.
1. Change **Maximum number of nodes** to `4`.
1. Select **Create**.

The status of your cluster changes to **Creating**.

>[!NOTE]
> The new cluster has 0 nodes, so no compute costs are incurred. You incur costs only when the automated machine learning job runs. The cluster scales back to 0 automatically after 120 seconds of idle time.


## Create a dataset

In this tutorial, you use the [Diabetes dataset](https://www4.stat.ncsu.edu/~boos/var.select/diabetes.html). This dataset is available in [Azure Open Datasets](https://azure.microsoft.com/services/open-datasets/).

To create the dataset, in the menu on the left, select **Datasets**. Then select **Create dataset**. You see the following options:

:::image type="content" source="media/tutorial-power-bi/create-dataset.png" alt-text="Screenshot showing how to create a new dataset.":::

Select **From Open Datasets**. Then on the **Create dataset from Open Datasets** page:

1. Use the search bar to find *diabetes*.
1. Select **Sample: Diabetes**.
1. Select **Next**.
1. Name your dataset *diabetes*.
1. Select **Create**.

To explore the data, select the dataset and then select **Explore**:

:::image type="content" source="media/tutorial-power-bi/explore-dataset.png" alt-text="Screenshot showing how to explore a dataset.":::

The data has 10 baseline input variables, such as age, sex, body mass index, average blood pressure, and six blood serum measurements. It also has one target variable, named **Y**. This target variable is a quantitative measure of diabetes progression one year after the baseline.

## Create an automated machine learning run

In [Azure Machine Learning Studio](https://ml.azure.com), in the menu on the left, select **Automated ML**. Then select **New Automated ML run**:

:::image type="content" source="media/tutorial-power-bi/create-new-run.png" alt-text="Screenshot showing how to create a new automated machine learning run.":::

Next, select the **diabetes** dataset you created earlier. Then select **Next**:

:::image type="content" source="media/tutorial-power-bi/select-dataset.png" alt-text="Screenshot showing how to select a dataset.":::
 
On the **Configure run** page:

1. Under **Experiment name**, select **Create new**.
1. Name the experiment.
1. In the **Target column** field, select **Y**.
1. In the **Select compute cluster** field, select the compute cluster you created earlier. 

Your completed form should look like this:

:::image type="content" source="media/tutorial-power-bi/configure-automated.png" alt-text="Screenshot showing how to configure automated machine learning.":::

Finally, select a machine learning task. In this case, the task is **Regression**:

:::image type="content" source="media/tutorial-power-bi/configure-task.png" alt-text="Screenshot showing how to configure a task.":::

Select **Finish**.

> [!IMPORTANT]
> Automated machine learning takes around 30 minutes to finish training the 100 models.

## Deploy the best model

When automated machine learning finishes, you can see all the machine learning models that have been tried by selecting the **Models** tab. The models are ordered by performance; the best-performing model is shown first. After you select the best model, the **Deploy** button is enabled:

:::image type="content" source="media/tutorial-power-bi/list-models.png" alt-text="Screenshot showing the list of models.":::

Select **Deploy** to open a **Deploy a model** window:

1. Name your model service *diabetes-model*.
1. Select **Azure Container Service**.
1. Select **Deploy**.

You should see a message that states that the model was deployed successfully.

## Next steps

In this tutorial, you saw how to train and deploy a machine learning model by using automated machine learning. In the next tutorial, you'll learn how to consume (score) this model in Power BI.

> [!div class="nextstepaction"]
> [Tutorial: Consume a model in Power BI](/power-bi/connect-data/service-aml-integrate?context=azure/machine-learning/context/ml-context)
