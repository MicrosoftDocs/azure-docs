---
title: 'ML Studio (classic): Migrate to Azure Machine Learning - Rebuild web service'
description: Rebuild Studio (classic) web services as pipeline endpoints in Azure Machine Learning
services: machine-learning
ms.service: machine-learning
ms.subservice: studio-classic
ms.custom: UpdateFrequency5, event-tier1-build-2022
ms.topic: how-to
ms.reviewer: larryfr
author: xiaoharper
ms.author: zhanxia
ms.date: 03/08/2021
---

# Rebuild a Studio (classic) web service in Azure Machine Learning

[!INCLUDE [ML Studio (classic) retirement](../../../includes/machine-learning-studio-classic-deprecation.md)]

In this article, you learn how to rebuild an ML Studio (classic) web service as an **endpoint** in Azure Machine Learning.

Use Azure Machine Learning pipeline endpoints to make predictions, retrain models, or run any generic pipeline. The REST endpoint lets you run pipelines from any platform. 

This article is part of the Studio (classic) to Azure Machine Learning migration series. For more information on migrating to Azure Machine Learning, see the [migration overview article](migrate-overview.md).

> [!NOTE]
> This migration series focuses on the drag-and-drop designer. For more information on deploying models programmatically, see [Deploy machine learning models in Azure](how-to-deploy-and-where.md).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An Azure Machine Learning workspace. [Create workspace resources](../quickstart-create-resources.md).
- An Azure Machine Learning training pipeline. For more information, see [Rebuild a Studio (classic) experiment in Azure Machine Learning](migrate-rebuild-experiment.md).

## Real-time endpoint vs pipeline endpoint

Studio (classic) web services have been replaced by **endpoints** in Azure Machine Learning. Use the following table to choose which endpoint type to use:

|Studio (classic) web service| Azure Machine Learning replacement
|---|---|
|Request/respond web service (real-time prediction)|Real-time endpoint|
|Batch web service (batch prediction)|Pipeline endpoint|
|Retraining web service (retraining)|Pipeline endpoint| 


## Deploy a real-time endpoint

In Studio (classic), you used a **REQUEST/RESPOND web service** to deploy a model for real-time predictions. In Azure Machine Learning, you use a **real-time endpoint**.

There are multiple ways to deploy a model in Azure Machine Learning. One of the simplest ways is to use the designer to automate the deployment process. Use the following steps to deploy a model as a real-time endpoint:

1. Run your completed training pipeline at least once.
1. After the job completes, at the top of the canvas, select **Create inference pipeline** > **Real-time inference pipeline**.

    ![Create realtime inference pipeline](./media/migrate-rebuild-web-service/create-inference-pipeline.png)
        
    The designer converts the training pipeline into a real-time inference pipeline. A similar conversion also occurs in Studio (classic).

    In the designer, the conversion step also [registers the trained model to your Azure Machine Learning workspace](how-to-deploy-and-where.md#registermodel).

1. Select **Submit** to run the real-time inference pipeline, and verify that it runs successfully.

1. After you verify the inference pipeline, select **Deploy**.

1. Enter a name for your endpoint and a compute type.

    The following table describes your deployment compute options in the designer:

    | Compute target | Used for | Description | Creation |
    | ----- |  ----- | ----- | -----  |
    |[Azure Kubernetes Service (AKS)](how-to-deploy-azure-kubernetes-service.md) |Real-time inference|Large-scale, production deployments. Fast response time and service autoscaling.| User-created. For more information, see [Create compute targets](../how-to-create-attach-compute-studio.md). |
    |[Azure Container Instances](how-to-deploy-azure-container-instance.md)|Testing or development | Small-scale, CPU-based workloads that require less than 48 GB of RAM.| Automatically created by Azure Machine Learning.

### Test the real-time endpoint

After deployment completes, you can see more details and test your endpoint:

1. Go the **Endpoints** tab.
1. Select your endpoint.
1. Select the **Test** tab.
    
    ![Screenshot showing the Endpoints tab with the Test endpoint button](./media/migrate-rebuild-web-service/test-realtime-endpoint.png)

## Publish a pipeline endpoint for batch prediction or retraining

You can also use your training pipeline to create a **pipeline endpoint** instead of a real-time endpoint. Use **pipeline endpoints** to perform either batch prediction or retraining.

Pipeline endpoints replace Studio (classic) **batch execution endpoints**  and **retraining web services**.

### Publish a pipeline endpoint for batch prediction

Publishing a batch prediction endpoint is similar to the real-time endpoint.

Use the following steps to publish a pipeline endpoint for batch prediction:

1. Run your completed training pipeline at least once.

1. After the job completes, at the top of the canvas, select **Create inference pipeline** > **Batch inference pipeline**.

    ![Screenshot showing the create inference pipeline button on a training pipeline](./media/migrate-rebuild-web-service/create-inference-pipeline.png)
        
    The designer converts the training pipeline into a batch inference pipeline. A similar conversion also occurs in Studio (classic).

    In the designer, this step also [registers the trained model to your Azure Machine Learning workspace](how-to-deploy-and-where.md#registermodel).

1. Select **Submit** to run the batch inference pipeline and verify that it successfully completes.

1. After you verify the inference pipeline, select **Publish**.
 
1. Create a new pipeline endpoint or select an existing one.
    
    A new pipeline endpoint creates a new REST endpoint for your pipeline.

    If you select an existing pipeline endpoint, you don't overwrite the existing pipeline. Instead, Azure Machine Learning versions each pipeline in the endpoint. You can specify which version to run in your REST call. You must also set a default pipeline if the REST call doesn't specify a version.


 ### Publish a pipeline endpoint for retraining

To publish a pipeline endpoint for retraining, you must already have a pipeline draft that trains a model. For more information on building a training pipeline, see [Rebuild a Studio (classic) experiment](migrate-rebuild-experiment.md).

To reuse your pipeline endpoint for retraining, you must create a **pipeline parameter** for your input dataset. This lets you dynamically set your training dataset, so that you can retrain your model.

Use the following steps to publish retraining pipeline endpoint:

1. Run your training pipeline at least once.
1. After the run completes, select the dataset module.
1. In the module details pane, select **Set as pipeline parameter**.
1. Provide a descriptive name like "InputDataset".    

    ![Screenshot highlighting how to create a pipeline parameter](./media/migrate-rebuild-web-service/create-pipeline-parameter.png)

    This creates a pipeline parameter for your input dataset. When you call your pipeline endpoint for training, you can specify a new dataset to retrain the model.

1. Select **Publish**.

    ![Screenshot highlighting the Publish button on a training pipeline](./media/migrate-rebuild-web-service/create-retraining-pipeline.png)


## Call your pipeline endpoint from the studio

After you create your batch inference or retraining pipeline endpoint, you can call your endpoint directly from your browser.

1. Go to the **Pipelines** tab, and select **Pipeline endpoints**.
1. Select the pipeline endpoint you want to run.
1. Select **Submit**.

    You can specify any pipeline parameters after you select **Submit**.

## Next steps

In this article, you learned how to rebuild a Studio (classic) web service in Azure Machine Learning. The next step is to [integrate your web service with client apps](migrate-rebuild-integrate-with-client-app.md).


See the other articles in the Studio (classic) migration series:

1. [Migration overview](migrate-overview.md).
1. [Migrate dataset](migrate-register-dataset.md).
1. [Rebuild a Studio (classic) training pipeline](migrate-rebuild-experiment.md).
1. **Rebuild a Studio (classic) web service**.
1. [Integrate an Azure Machine Learning web service with client apps](migrate-rebuild-integrate-with-client-app.md).
1. [Migrate Execute R Script](migrate-execute-r-script.md).
