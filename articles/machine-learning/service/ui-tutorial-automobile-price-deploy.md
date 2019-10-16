---
title: 'Tutorial: Deploy a machine learning model with the visual interface'
titleSuffix: Azure Machine Learning
description: Learn how to build a predictive analytics solution in the Azure Machine Learning visual interface. Train, score, and deploy a machine learning model using drag and drop modules.

author: peterclu
ms.author: peterlu
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: tutorial
ms.date: 10/09/2019
---

# Tutorial: Deploy a machine learning model with the visual interface

To give others a chance to use the predictive model developed in [part one of the tutorial](ui-tutorial-automobile-price-train-score.md), you can deploy it as a web service. In part 1, you trained your model. Now, it's time to generate new predictions based on user input. In this part of the tutorial, you:

> [!div class="checklist"]
> * Prepare a pipeline for deployment
> * Deploy a web service
> * Test a web service

## Prerequisites

Complete [part one of the tutorial](ui-tutorial-automobile-price-train-score.md) to learn how to train and score a machine learning model in the visual interface.

## Prepare for deployment

Before you deploy your pipeline as a web service, you first have to prepare it. You will publish your pipeline, and convert your *training pipeline* into a *real-time inference pipeline*.

### Publish the pipeline

So far, you have been working on a *pipeline draft*. Publishing a pipeline to a Pipeline Endpoint confirms the configuration of your pipeline and starts version tracking. Pipeline Endpoints let you organize similar pipelines together for management and encapsulation.

1. Select **Publish** at the top of the pipeline canvas.

1. In the Setup **Pipeline Run** dialog, expand the **PipelineEndpoint** drop-down menu and select **+New PipelineEndpoint**

1. Select **Publish**

    ![Screenshot showing how to publish a pipeline](./media/ui-tutorial-automobile-price-deploy/publish-pipeline.png)

### Create a real-time inference pipeline

Converting the training pipeline into a *real-time inference pipeline* modifies your pipeline to prepare it for deployment. It removes training modules and adds an input and output for web service requests.

1. At the top of the pipeline canvas, select **Create inference pipeline** > **Real-time inference pipeline**

    When you select **Create Predictive Pipeline**, several things happen:
    
    * The trained model is stored as a **Dataset** module in the module palette. You can find it under **My Datasets**.
    * Modules, like **Train Model** and **Split Data**, that were used for training are removed.
    * The saved trained model is added back into the pipeline.
    * **Web Service Input** and **Web Service Output** modules are added. These modules identify where user data will enter the model, and where data is returned.

    > [!Note]
    > The **training pipeline** is saved under the new tab at the top of the pipeline canvas. It can also be found as a published pipeline in the visual interface.
    >

    Your pipeline should now look like this:  

   ![Screenshot showing the expected configuration of the pipeline after preparing it for deployment](./media/ui-tutorial-automobile-price-deploy/predictive-graph.png)

1. Select **Run** and use the same compute target and experiment you used in part 1.

1. Select the **Score Model** module.

1. In the properties pane, select **Outputs** > **Visualize** to verify the model is still working. You can see the original data is displayed along with the predicted price ("Scored Labels").

1. Select **Deploy**.

## Create the inferencing cluster

In the dialog that appears, you can select from existing Azure Kubernetes Service (AKS) clusters in your workspace to deploy your model. If you don't have an AKS cluster, use the following steps to create one.

1. Select **Compute** in the dialog to navigate to the **Compute** page.

1. In the navigation ribbon, select **Inference Clusters** > **+ New**.

1. In the inference cluster pane, configure a new Kubernetes Service.

1. Enter "aks-compute" for the **Compute name**.
    
1. Select a nearby available **Region**.

1. Select **Create**.

    > [!Note]
    > It takes approximately 15 minutes to create a new AKS service. You can check the provisioning state on the **Inference Clusters** page
    >

## Deploy the web service

After your AKS service has finished provisioning, return to the real-time inferencing pipeline to complete deployment.

1. Select **Deploy** above the canvas.

1. Select **Deploy new real-time endpoint**. 

1. Select the AKS cluster you created.

1. Select **Deploy**.

    A success notification above the canvas will appear when deployment completes, it may take a few minutes.

## Test the web service

You can test your web services by navigating to the **Endpoints** page in the workspace navigation pane on the left.

1. On the **Endpoints** page, select the web service you deployed.

    ![Screenshot showing the real-time endpoints tab with the recently created web service highlighted](./media/ui-tutorial-automobile-price-deploy/web-services.png)

1. Select **Test**.

1. Input testing data or use the autofilled sample data and select **Test**.

    The test request is submitted to the web service and the results are shown on page. Although a price value is generated for the input data, it is not used to generate the prediction value.

## Clean up resources

[!INCLUDE [aml-ui-cleanup](../../../includes/aml-ui-cleanup.md)]

## Next steps

In this tutorial, you learned the key steps in creating, deploying, and consuming a machine learning model in the visual interface. To learn more about how you can use the visual interface to solve other types of problems, see out our other sample pipelines.

> [!div class="nextstepaction"]
> [Credit risk classification sample](how-to-ui-sample-classification-predict-credit-risk-cost-sensitive.md)
