---
title: 'Tutorial: Deploy a machine learning model with the visual interface'
titleSuffix: Azure Machine Learning service
description: Learn how to build a predictive analytics solution in the Azure Machine Learning service visual interface. Train, score, and deploy a machine learning model using drag and drop modules. This tutorial is part two of a two-part series on predicting automobiles prices using linear regression.

author: peterlu
ms.author: peterlu
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: tutorial
ms.date: 04/06/2019
---

# Tutorial: Deploy a machine learning model with the visual interface

In this tutorial, you take an extended look at developing a predictive analytics solution in the Azure Machine Learning service visual interface. You'll learn how to create a machine learning model, deploy a model as an Azure web service, and consume your web service to make predictions on new data.

This tutorial is **part two of a two-part tutorial series**. In [part one of the tutorial](ui-tutorial-automobile-price-train-score.md), you trained, scored, and evaluated a model to predict car prices. In this part of the tutorial, you will:

> [!div class="checklist"]
> * Prepare a model for deployment
> * Deploy a web service
> * Test a web service
> * Manage a web service
> * Consume the web service

## Prerequisites

Complete [part one of the tutorial](ui-tutorial-automobile-price-train-score.md).

## Prepare for deployment

To give others a chance to use the predictive model developed in this tutorial, you can deploy it as an Azure web service.

So far, you've been experimenting with training your model. Now, it's going to generate new predictions based on user input.

Preparation for deployment is a two-step process:  

1. Convert the *training experiment* that you've created into a *predictive experiment*
1. Deploy the predictive experiment as a web service

You may want to make a copy of the experiment first by clicking **Save As** at the bottom of the experiment canvas.

### Convert the training experiment to a predictive experiment

To get this model ready for deployment, convert this training experiment to a predictive experiment. This typically involves three steps:

1. Save the model you've trained and replace your training modules
1. Trim the experiment to remove modules that were only needed for training
1. Define where the web service will accept input data and where it generates the output

You could do these steps manually or you could click **Set Up Web Service** at the bottom of the experiment canvas to have them done automatically.

When you click **Set Up Web Service**, several things happen:

* The trained model is converted to a single **Trained Model** module. It's stored in the module palette to the left of the experiment canvas. You can find it under **Trained Models**.
* Modules that were used for training are removed; specifically:
  * Train Model
  * Split Data
  * Evaluate Model
* The saved trained model is added back into the experiment
* **Web service input** and **Web service output** modules are added. These modules identify where the user's data will enter the model, and where data is returned.

You can see that the experiment is saved in two parts under the new tabs at the top of the experiment canvas. The original training experiment is under the tab **Training experiment**, and the newly created predictive experiment is under **Predictive experiment**. The predictive experiment is the one you'll deploy as a web service.

Your experiment should now look like this:  

![predictive-graph](./media/ui-tutorial-automobile-price-deploy/predictive-graph.png)

Run the experiment one last time (click **Run**). Choose the compute target you want the experiment to run on in the popup dialog. To verify the model is still working, click the output of the [Score Model][score-model] module and select **View Results**. You can see the original data is displayed, along with the predicted price("Scored Labels").

## Deploy The web service

To deploy a New web service derived from your experiment:

1. Select **Deploy Web Service** below the canvas.
1. Select the **Compute Target** that you'd like to run your web service.

    Currently, Studio V2 only supports deployment to Azure Kubernetes Service (AKS) compute targets. You can choose from available AKS compute targets in your machine learning service workspace or configure a new AKS environment in the dialog that appears. Creating a new AKS compute target may take several minutes.

    ![deploy-compute](./media/ui-tutorial-automobile-price-deploy/deploy-compute.png)

1. Select **Deploy Web Service**. You'll see the following notification when deployment completes. Deployment may take a few minutes.

    ![deploy-success](./media/ui-tutorial-automobile-price-deploy/deploy-succeed.png)

## Test the web service

User input data enters your deployed model through the **Web service input** module. The input is then scored in the  **Score Model** module. The way you've set up the predictive experiment, the model expects data in the same format as the original automobile price dataset. Finally, the results are returned to the user through the **Web service output** module.

You can test a web service in the web service tab in the visual interface.

1. Go to the web service section. You'll see the web service you deployed with the name **Tutorial - Predict Automobile Price[Predictive Exp]**.

     ![web-services](./media/ui-tutorial-automobile-price-deploy/web-services.png)

1. Select the web service name to view additional details.

     ![web-services-detail](./media/ui-tutorial-automobile-price-deploy/web-service-detail.png)

1. Select **Test**.

    ![test](./media/ui-tutorial-automobile-price-deploy/test.png)

1. Input testing data or use the autofilled sample data and click **Test** at the bottom. The test request is submitted to the web service and the results are shown on page.

     ![test-result](./media/ui-tutorial-automobile-price-deploy/test-result.png)

## Manage the web service

Once you've deployed your web service, you can manage it from the **Web Services** tab in the visual interface.

You can delete a web service by selecting **Delete** in the web service detail page.

   ![delete](./media/ui-tutorial-automobile-price-deploy/delete.png)

## Consume the web service

In the previous steps of this tutorial, you deployed an automobile prediction model as an Azure web service. Now users can send data to it and receive results via REST API.

**Request/Response** - The user sends one or more rows of automobile data to the service by using an HTTP protocol. The service responds with one or more sets of results.

You can find sample REST calls in the **Consume** tab of the web service details page.

   ![consume](./media/ui-tutorial-automobile-price-deploy/consume.png)

Navigate to the **API Doc** tab, to find more API details.

  ![API](./media/ui-tutorial-automobile-price-deploy/API.png)

## Clean up resource

[!INCLUDE aml-ui-cleanup]

## Next Steps

In this tutorial, you learned the key steps in creating, deploying, and consuming a machine learning model in the visual interface. To see how you can use the visual interface to solve other types of problems, checkout our [sample credit risk classification experiment](ui-sample-classification-predict-credit-risk-basic.md).