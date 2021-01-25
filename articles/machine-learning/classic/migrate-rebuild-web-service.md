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

## Deploy a real time endpoint

In Studio (classic), you use a REQUEST/RESPOND web service to deploy a model for real-time predictions. In Azure Machine Learning, you use a **real-time endpoint**.

There are multiple ways to deploy a model in Azure Machine Learning. However, one of the simplest ways is to use the designer to deploy a model from an existing training pipeline.

1. Run your completed training pipeline at least once.
1. After the run completes, at the top .of the canvas, select **Create inference pipeline** > **Real-time inference pipeline** 

    ![create realtime inference pipeline](./media/migrate-rebuild-web-service/create-inference-pipeline.png)
        
    The designer converts the training pipeline into a real-time inference pipeline. This conversion is the same as the conversion that occurs in Studio (classic) when you create a web service. 

    In Azure Machine Learning designer, this step also registers your trained model to your Azure Machine Learing workspace.

1. At the top of your inference pipeline, select **Submit** to run the real-time inference pipeline to make sure it works as expected.

1. After you have verified the inference pipeline, select **Deploy**.
1. Choose compute target and set deployment settings.

    If you choose to deploy to Azure Kubernetes Service, make sure you have an ASK cluster in your workspace. See section [create-aks-in-studio](../how-to-create-attach-compute-studio.md#inference-clusters) for how to create AKS cluster.

    If you choose to deploy to ACI, just select ACI in the dialog then Azure Machine Learning will create an ACI and deploy the model on it.
    ![set up realtime endpoint](./media/migrate-to-AML/deploy-realtime-endpoint.png)
1. Test the resulting endpoint.
    
    After deploy finish, you will see the deployed real-time endpoint in Endpoints tab in Azure Machine Learning Studio. And you can test the endpoint by click the endpoint name to enter endpoint detail page, then click **Test** tab.
    
    ![test-realtime-endpoint](./media/migrate-to-AML/test-realtime-endpoint.png)

[This article](../how-to-deploy-and-where.md) explains how model deployment works in Azure Machine Learning. The deployment workflow can be summarized as:
1. Register the model.
1. Prepare an inference configuration.
1. Prepare an entry script.
1. Choose a compute target.
1. Deploy the model to the compute target.
1. Test the resulting web service. 

Designer further simplifies the process by doing register model, prepare inference configuration and prepare entry script automatically when customer clicks **Deploy** button. Customer needs to select the compute target then designer will deploy the model to the compute target. Designer supports deploy to ACI and AKS as compute target and below table summarize when to use for each. 

| Compute target | Used for | Description |
| ----- |  ----- | ----- |
|[Azure Kubernetes Service (AKS)](../how-to-deploy-azure-kubernetes-service.md) |Real-time inference|Use for high-scale production deployments. Provides fast response time and autoscaling of the deployed service. Cluster autoscaling isn't supported through the Azure Machine Learning SDK. To change the nodes in the AKS cluster, use the UI for your AKS cluster in the Azure portal.|
|[Azure Container Instances](../articles/machine-learning/how-to-deploy-azure-container-instance.md)|Testing or development|Use for low-scale CPU-based workloads that require less than 48 GB of RAM.|

In short, deploy real-time endpoint in designer have following steps:


    

[This tutorial](../tutorial-designer-automobile-price-deploy.md) has more detailed step-by-step guidance on how to deploy a model in designer.  



## Publish pipeline endpoint for batch prediction or retraining

In ML Studio(classic), the web service has two REST endpoints -  batch execution endpoint and request/respond endpoint. Batch execution endpoint is for batch prediction purpose. It takes path of a file as input, make prediction for all data in the file, then write the prediction to the output file. 

In ML Studio(classic), customer can also deploy a retraining web service to retrain the model with new set of parameters. The retraining web service will save the trained model to Blob Storage. More detail in [this article](./retrain-machine-learning-model.md).

In Azure Machine Learning, both batch prediction and retraining are done through machine learning pipeline. Customer can publish a pipeline to get a REST endpoint(pipeline endpoint). The pipeline endpoint can be used to run the pipeline from any HTTP library on any platform.  If the original pipeline is set up for prediction, the pipeline endpoint can be used for batch prediction purpose. If the original pipeline is set up for training, the pipeline endpoint can be used for retraining purpose. This section will explain how to publish a pipeline with Azure Machine Learning designer.

In previous section, you already migrated the ML Studio(classic) experiment as pipeline draft for training. Now we will start with a pipeline draft to publish it as a pipeline endpoint. In generate it takes following steps:

1. Create batch inference pipeline (optional, for batch prediction)
![create-batch-inference-pipeline](./media/migrate-to-AML/create-batch-inference-pipeline.png)
    
    After click the **Create Batch inference pipeline** button, designer will save the trained model and replace the training module in batch inference pipeline. 
1. Publish the pipeline
    
    For batch prediction purpose, publish the batch inference pipeline created in previous step. For retraining purpose, skip previous step and publish the training pipeline directly.

    ![publish pipeline](./media/migrate-to-AML/publish-pipeline.png)


1. Set up published pipeline

    ![set-up-pipeline-endpoint](./media/migrate-to-AML/set-up-published-pipeline.png)
    
    Select create new PipelineEndpoint, which will generate a new endpoint to trigger the pipeline. You can set dataset or module parameter as pipeline parameter, then you can trigger the pipeline with new data or module parameter. Check [this article](https://docs.microsoft.com/en-us/azure/machine-learning/how-to-retrain-designer#create-a-pipeline-parameter) to learn how to set pipeline parameter.

1. Invoke the pipeline endpoint with UI or REST call

    After publish a pipeline, you can see the pipeline endpoint under **Pipelines -> Pipeline endpoints** tab in Azure Machine Learning Studio. 
    ![pipeline-endpoints](./media/migrate-to-AML/pipeline-endpoints.png)
    
    Click a pipeline endpoint name you will enter the detail page for this pipeline endpoint, below screenshot shows what a pipeline endpoint detail page looks like.

    ![pipeline endpoint detail](./media/migrate-to-AML/pipeline-endpoint-detail.png)

    By click the **Submit** button on the top left, you can submit a new run for this pipeline in the UI. It's also possible to trigger the pipeline through a REST call. How to trigger through REST endpoint will be described in next section.
    

 
Check [how to run batch prediction in designer](../how-to-run-batch-predictions-designer.md) and [how to retrain in designer](../how-to-retrain-designer.md) with more detailed guidance.