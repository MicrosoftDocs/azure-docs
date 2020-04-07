---
title: Retrain models by using Azure Machine Learning designer (preview)
titleSuffix: Azure Machine Learning
description: Learn how to retrain models with published pipelines in Azure Machine Learning designer (preview).
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to
ms.author: keli19
author: likebupt
ms.date: 02/24/2020
---

# Retrain models with Azure Machine Learning designer (preview)
[!INCLUDE [applies-to-skus](../../includes/aml-applies-to-enterprise-sku.md)]

In this how-to article, you learn how to use Azure Machine Learning designer to retrain a machine learning model. Find out how to use published pipelines to automate machine learning workflows for retraining.

In this article, you learn how to:

> [!div class="checklist"]
> * Train a machine learning model.
> * Create a pipeline parameter.
> * Publish your training pipeline.
> * Retrain your model.

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, create a [free account](https://aka.ms/AMLFree).
* An Azure Machine Learning workspace with the Enterprise SKU.

This article assumes that you have basic knowledge of building pipelines in the designer. For a guided introduction to the designer, complete the [tutorial](tutorial-designer-automobile-price-train-score.md). 

### Sample pipeline

The pipeline used in this article is an altered version of the one found in [Sample 3: Income prediction](how-to-designer-sample-classification-predict-income.md). It uses the [Import Data](algorithm-module-reference/import-data.md) module instead of the sample dataset to show you how to train a model by using your own data.

![Screenshot that shows the modified sample pipeline with a box highlighting the Import Data module](./media/how-to-retrain-designer/modified-sample-pipeline.png)

## Train a machine learning model

To retrain a model, you need an initial model. In this section, you learn how to train a model and access the saved model by using the designer.

1. Select the **Import Data** module.
1. On the properties pane, specify a data source.

   ![Screenshot that shows a sample configuration of the Import Data module](./media/how-to-retrain-designer/import-data-settings.png)

   For this example, the data is stored in an [Azure datastore](how-to-access-data.md). If you don't already have a datastore, you can create one now by selecting **New datastore**.

1. Specify the path to your data. You can also select **Browse path** to browse to your datastore. 
1. Select **Submit** at the top of the canvas.
    
   > [!NOTE]
   > If you have already set a default compute for this pipeline draft, the pipeline will run automatically. Otherwise, you can follow the prompts on the settings pane to set one now.

### Find your trained model

The designer saves all pipeline outputs, including trained models, to the default storage account. However, you can also access trained models directly in the designer:

1. Wait for the pipeline to finish running.
1. Select the **Train Model** module.
1. On the settings pane, select **Outputs+logs**.
1. Select the **View output** icon, and follow the instruction in the pop-up window to find the trained model.

![Screenshot that shows how to download the trained model](./media/how-to-retrain-designer/trained-model-view-output.png)

## Create a pipeline parameter

Add pipeline parameters to dynamically set variables at runtime. For this pipeline, add a parameter for the training data path so that you can retrain your model on a new dataset.

1. Select the **Import Data** module.
1. In the settings pane, select the ellipses above the **Path** field.
1. Select  **Add to pipeline parameter**.
1. Provide a parameter name and a default value.

   > [!NOTE]
   > You can inspect and edit your pipeline parameters by selecting the **Settings** gear icon next to the title of your pipeline draft. 

![Screenshot that shows how to create a pipeline parameter](media/how-to-retrain-designer/add-pipeline-parameter.png)

## Publish a training pipeline

When you publish a pipeline, it creates a pipeline endpoint. Pipeline endpoints let you reuse and manage your pipelines for repeatability and automation. In this example, you have set up your pipeline for retraining.

1. Select **Publish** above the designer canvas.
1. Select or create a pipeline endpoint.

   > [!NOTE]
   > You can publish multiple pipelines to a single endpoint. Each pipeline in the endpoint is given a version number, which you can specify when you call the pipeline endpoint.

1. Select **Publish**.

## Retrain your model

Now that you have a published training pipeline, you can use it to retrain your model by using new data. You can submit runs from a pipeline endpoint from the Azure portal or submit them programmatically.

### Submit runs by using the designer

Use the following steps to submit a pipeline endpoint run from the designer:

1. Go to the **Endpoints** page.
1. Select the **Pipeline endpoints** tab.
1. Select your pipeline endpoint.
1. Select the **Published pipelines** tab.
1. Select the pipeline that you want to run.
1. Select **Submit**.
1. In the setup dialog box, you can specify a new value for the input data path value. This value points to your new dataset.

![Screenshot that shows how to set up a parameterized pipeline run in the designer](./media/how-to-retrain-designer/published-pipeline-run.png)

### Submit runs by using code

You can find the REST endpoint of a published pipeline in the overview panel. By calling the endpoint, you can retrain the published pipeline.

To make a REST call, you need an OAuth 2.0 bearer-type authentication header. For information about setting up authentication to your workspace and making a parameterized REST call, see [Build an Azure Machine Learning pipeline for batch scoring](tutorial-pipeline-batch-scoring-classification.md#publish-and-run-from-a-rest-endpoint).

## Next steps

Follow the [designer tutorial](tutorial-designer-automobile-price-train-score.md) to train and deploy a regression model.
