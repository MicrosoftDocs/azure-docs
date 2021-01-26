---
title: 'ML Studio (classic): Migrate to Azure Machine Learning - Rebuild web service'
description: describe how to rebuild ML Studio(classic) web service in Azure Machine Learning
services: machine-learning
ms.service: machine-learning
ms.subservice: studio
ms.topic: how-to

author: xiaoharper
ms.author: zhanxia
ms.date: 1/19/2020
---

# Rebuild web services in Azure Machine Learning

In this article, you learn how to rebuild a Studio (classic) web service in Azure Machine Learning. For more information on migrating from Studio (classic), see [the migration overview article](migrate-overview.md).

Studio (classic) web services have been replaced by **endpoints** in Azure Machine Learning. The following table shows the mapping between web service types and their endpoint replacements:

|Studio (classic) web service| Azure Machine Learning replacement
|---|---|
|Request/respond web service (real-time prediction)|Real-time endpoint|
|Batch web service (batch prediction)|Pipeline endpoint|
|Retraining web service (retraining)|Pipeline endpoint| 

This article shows you how to recreate web services using both [real-time endpoints](#deploy-realtime-endpoint-for-realtime-prediction) and [pipeline endpoints](#publish-pipeline-endpoint-for-batch-prediction-or-retraining).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An Azure Machine Learning workspace. [Create an Azure Machine Learning workspace](../how-to-manage-workspace.md#create-a-workspace).
- Complete part one of migrating experiments from Studio (classic): [Rebuild your experiment](migrate-rebuild-experiment.md).

## Deploy a real-time endpoint

In Studio (classic), you use a REQUEST/RESPOND web service to deploy a model for real-time predictions. In Azure Machine Learning, you use a **real-time endpoint**.

There are multiple ways to deploy a model in Azure Machine Learning. However, one of the simplest ways is to use the designer to deploy a model from an existing training pipeline.

1. Run your completed training pipeline at least once.
1. After the run completes, at the top of the canvas, select **Create inference pipeline** > **Real-time inference pipeline**.

    ![create realtime inference pipeline](./media/migrate-rebuild-web-service/create-inference-pipeline.png)
        
    The designer converts the training pipeline into a real-time inference pipeline. This conversion is the same as the conversion that occurs in Studio (classic) when you create a web service. 

    In the designer, this step also registers the trained model to your Azure Machine Learning workspace.

1. Select **Submit** to run the real-time inference pipeline to make sure it works as expected.

1. After you verify the inference pipeline, select **Deploy**.

1. Enter a name for your endpoint and a compute type.

    If you choose to deploy to Azure Kubernetes Service (AKS), make sure you have an AKS cluster in your workspace. For more information, see [Create compute targets](../how-to-create-attach-compute-studio.md#inference-clusters).

    If you choose to deploy to Azure Container Instances (ACI), Azure Machine Learning will create an ACI and deploy the model on it for you.

    | Compute target | Used for | Description |
    | ----- |  ----- | ----- |
    |[Azure Kubernetes Service (AKS)](../how-to-deploy-azure-kubernetes-service.md) |Real-time inference|Large-scale production deployments. Fast response time and service autoscaling.|
    |[Azure Container Instances ](../articles/machine-learning/how-to-deploy-azure-container-instance.md)|Testing or development | Small-scale, CPU-based workloads that require less than 48 GB of RAM.|


1. After deployment completes, go the **Endpoints** tab.  You can test your endpoint by selecting the endpoint and going to the **Test** tab.
    
    ![Screenshot showing the Endpoints tab with the Test endpoint button](./media/migrate-rebuild-web-service/test-realtime-endpoint.png)

## Publish a pipeline endpoint for batch prediction or retraining

In Studio (classic), you use batch execution endpoints to perform batch predictions, and retraining web services to perform retraining.

In Azure Machine Learning, both batch prediction and retraining are performed by **pipeline endpoints**.

If the original pipeline is set up for prediction, the pipeline endpoint can be used for batch prediction. If the original pipeline is set up for training, the pipeline endpoint can be used for retraining. You can call pipeline endpoints from any HTTP library.

For more detailed information, see [how to run batch prediction in designer](../how-to-run-batch-predictions-designer.md) and [how to retrain in designer](../how-to-retrain-designer.md).


### Publish pipeline endpoint for batch prediction

The process for publishing a pipeline endpoint for batch prediction is similar to the real-time endpoint process. You must already have a pipeline draft that trains a model. For more information on building a training pipeline, see [Rebuild a Studio (classic) experiment](migrate-rebuild-experiment.md).

Once you have a training pipeline, use the following steps to publish it as a pipeline endpoint for batch prediction:


1. Run your completed training pipeline at least once.

1. After the run completes, at the top of the canvas, select **Create inference pipeline** > **Batch inference pipeline**.

    ![Screenshot showing the create inference pipeline button on a training pipeline](./media/migrate-rebuild-web-service/create-inference-pipeline.png)
        
    The designer converts the training pipeline into a batch inference pipeline. This conversion is the same as the conversion that occurs in Studio (classic) when you create a web service. 

    In the designer, this step also registers the trained model to your Azure Machine Learning workspace.

1. Select **Submit** to run the batch inference pipeline to make sure it works as expected.

1. After you verify the inference pipeline, select **Publish**.
 
1. Create a new pipeline endpoint or select an existing one.
    
    Pipeline endpoints are versioned so you can publish multiple pipelines to a single pipeline endpoint and call on different pipelines by providing the version number.

 ### Publish pipeline endpoint for retraining

To publish a pipeline endpoint for retraining, you must already have a pipeline draft that trains a model. For more information on building a training pipeline, see [Rebuild a Studio (classic) experiment](migrate-rebuild-experiment.md).

Once you have a training pipeline, use the following steps to publish it as a retraining pipeline endpoint:

1. Run your completed training pipeline at least once to confirm that your training pipeline works.
1. After the run completes, select the dataset module.
1. In the module details pane, select **Set as pipeline parameter**.
1. Provide a descriptive name like "InputDataset".    

    ![Screenshot highlighting how to create a pipeline parameter](./media/migrate-rebuild-web-service/create-pipeline-parameter.png)

    This creates a pipeline parameter for your input dataset. When you call your pipeline endpoint for training, you can specify a new dataset to retrain the model by using the pipeline parameter.

1. Select **Publish**.

![Screenshot highlighting the Publish button on a training pipeline](./media/migrate-rebuild-web-service/create-retraining-pipeline.png)


### Call your pipeline endpoint from the studio

After you create your batch inference or retraining pipeline endpoint, you can call your endpoint directly from your browser.

1. Go to the **Pipelines** tab, and select **Pipeline endpoints**.
1. Select the pipeline endpoint name you want to run.
1. Select **Submit**.

    You can set any pipeline parameters you created before publishing your endpoint.

For more information on triggering endpoints using a REST call, see [Integrate endpoint with client app](migrate-rebuild-integrate-with-client-app.md).