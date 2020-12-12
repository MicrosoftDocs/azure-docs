---
title: "Tutorial: Create the predictive model using automated ML (part 1 of 2)"
titleSuffix: Azure Machine Learning
description: Learn how to build and deploy automated ML models, so you can use the best model to predict outcomes in Microsoft Power BI.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: tutorial
ms.author: samkemp
author: samuel100
ms.reviewer: sdgilley
ms.date: 12/11/2020
---

# Tutorial: Power BI integration - create the predictive model using automated machine learning (part 1 of 2)

In the first part of this tutorial, you train and deploy a predictive machine learning model using automated machine learning in the Azure Machine Learning studio.  In part 2, you'll then use the best performing model to predict outcomes in Microsoft Power BI.

In this tutorial, you:

> [!div class="checklist"]
> * Create an Azure Machine Learning compute cluster
> * Create a dataset
> * Create an automated ML run
> * Deploy the best model to a real-time scoring endpoint


There are three different ways to create and deploy the model you'll use in Power BI.  This article covers Option C: Train and deploy models using automated ML in the studio.  This option shows a no-code authoring experience that fully automates the data preparation and model training. 

You could instead use:

* [Option A: Train and deploy models using Notebooks](tutorial-power-bi-custom-model.md) -  a code-first authoring experience using Jupyter notebooks hosted in Azure Machine Learning studio.
* [Option B: Train and deploy models using designer](tutorial-power-bi-designer-model.md)- a low-code authoring experience using Designer (a drag-and-drop user interface).

## Prerequisites

- An Azure subscription ([a free trial is available](https://aka.ms/AMLFree)). 
- An Azure Machine Learning workspace. If you do not already have a workspace, follow [how to create an Azure Machine Learning Workspace](./how-to-manage-workspace.md#create-a-workspace).

## Create compute cluster

Automated ML automatically trains lots of different machine learning models to find the "best" algorithm and parameters. Azure Machine Learning parallelizes the execution of the model training over a compute cluster.

In the [Azure Machine Learning Studio](https://ml.azure.com), select **Compute** in the left-hand menu followed by **Compute Clusters** tab. Select **New**:

:::image type="content" source="media/tutorial-power-bi/create-compute-cluster.png" alt-text="Screenshot showing how to create a compute cluster":::

In the **Create compute cluster** screen:

1. Select a VM size (for the purposes of this tutorial a `Standard_D11_v2` machine is fine).
1. Select **Next**
1. Provide a valid compute name
1. Keep **Minimum number of nodes** at 0
1. Change **Maximum number of nodes** to 4
1. Select **Create**

You can see that the status of your cluster has changed to **Creating**.

>[!NOTE]
> When the cluster is created it will have 0 nodes, which means no compute costs are incurred. You only incur costs when the automated ML job runs. The cluster will scale back to 0 automatically for you after 120 seconds of idle time.


## Create dataset

In this tutorial, you use the [Diabetes dataset](https://www4.stat.ncsu.edu/~boos/var.select/diabetes.html), which is made available in [Azure Open Datasets](https://azure.microsoft.com/services/open-datasets/).

To create the dataset, select **Datasets** left-hand menu followed by **Create Dataset** - you will see the following options:

:::image type="content" source="media/tutorial-power-bi/create-dataset.png" alt-text="Screenshot showing how to create a new dataset":::

Select **From Open Datasets**, and then in **Create dataset from Open Datasets** screen:

1. Search for *diabetes* using the search bar
1. Select **Sample: Diabetes**
1. Select **Next**
1. Provide a name for your dataset - *diabetes*
1. Select **Create**

You can explore the data by selecting the Dataset followed by **Explore**:

:::image type="content" source="media/tutorial-power-bi/explore-dataset.png" alt-text="Screenshot showing how to explore dataset":::

The data has 10 baseline input variables (such as age, sex, body mass index, average blood pressure, and six blood serum measurements), and one target variable named **Y** (a quantitative measure of diabetes progression one year after baseline).

## Create automated ML run

In the [Azure Machine Learning Studio](https://ml.azure.com) select **Automated ML** in the left-hand menu followed by **New Automated ML Run**:

:::image type="content" source="media/tutorial-power-bi/create-new-run.png" alt-text="Screenshot showing how to create a new automated ML run":::

Next, select the **diabetes** dataset you created earlier and select **Next**:

:::image type="content" source="media/tutorial-power-bi/select-dataset.png" alt-text="Screenshot showing how to select a dataset":::
 
In the **Configure run** screen:

1. Under **Experiment name,** select **Create new**
1. Provide an experiment a name
1. In the Target column field, select **Y**
1. In the **Select compute cluster** field select the compute cluster you created earlier. 

Your completed form should look similar to:

:::image type="content" source="media/tutorial-power-bi/configure-automated.png" alt-text="Screenshot showing how to configure automated ML":::

Finally, you need to select the machine learning task to perform, which is **Regression**:

:::image type="content" source="media/tutorial-power-bi/configure-task.png" alt-text="Screenshot showing how to configure task":::

Select **Finish**.

> [!IMPORTANT]
> It will take around 30 minutes for automated ML to finish training the 100 different models.

## Deploy the best model

Once the automated ML run has completed, you can see the list of all the different machine learning models that have been tried by selecting the **Models** tab. The models are ordered in performance order - the best performing model will be shown first. When you select the best model, the **Deploy** button will be enabled:

:::image type="content" source="media/tutorial-power-bi/list-models.png" alt-text="Screenshot showing the list of models":::

Selecting **Deploy**, will present a **Deploy a model** screen:

1. Provide a name for your model service - use **diabetes-model**
1. Select **Azure Container Service**
1. Select **Deploy**

You should see a message that states the model has been deployed successfully.

## Next steps

In this tutorial, you saw how to train and deploy a machine learning model using automated ML. In the next tutorial you are shown how to consume (score) this model from Power BI.

> [!div class="nextstepaction"]
> [Tutorial: Consume model in Power BI](/power-bi/connect-data/service-aml-integrate?context=azure/machine-learning/context/ml-context)
