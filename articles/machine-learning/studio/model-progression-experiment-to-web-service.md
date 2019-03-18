---
title: How a model becomes a web service
titleSuffix: Azure Machine Learning Studio
description: An overview of the mechanics of how your Azure Machine Learning Studio model progresses from a development experiment to a Web service.
services: machine-learning
ms.service: machine-learning
ms.subservice: studio
ms.topic: conceptual

author: xiaoharper
ms.author: amlstudiodocs
ms.custom: previous-ms.author=yahajiza, previous-author=YasinMSFT
ms.date: 03/20/2017
---

# How a Machine Learning Studio model progresses from an experiment to a Web service
Azure Machine Learning Studio provides an interactive canvas that allows you to develop, run, test, and iterate an ***experiment*** representing a predictive analysis model. There are a wide variety of modules available that can:

* Input data into your experiment
* Manipulate the data
* Train a model using machine learning algorithms
* Score the model
* Evaluate the results
* Output final values

Once you’re satisfied with your experiment, you can deploy it as a ***Classic Azure Machine Learning Web service*** or a ***New Azure Machine Learning Web service*** so that users can send it new data and receive back results.

In this article, we give an overview of the mechanics of how your Machine Learning model progresses from a development experiment to an operationalized Web service.

> [!NOTE]
> There are other ways to develop and deploy machine learning models, but this article is focused on how you use Machine Learning Studio. For example, to read a description of how to create a classic predictive Web service with R, see the blog post [Build & Deploy Predictive Web Apps Using RStudio and Azure Machine Learning studio](https://blogs.technet.com/b/machinelearning/archive/2015/09/25/build-and-deploy-a-predictive-web-app-using-rstudio-and-azure-ml.aspx).
>
>

While Azure Machine Learning Studio is designed to help you develop and deploy a *predictive analysis model*, it’s possible to use Studio to develop an experiment that doesn’t include a predictive analysis model. For example, an experiment might just input data, manipulate it, and then output the results. Just like a predictive analysis experiment, you can deploy this non-predictive experiment as a Web service, but it’s a simpler process because the experiment isn’t training or scoring a machine learning model. While it’s not the typical to use Studio in this way, we’ll include it in the discussion so that we can give a complete explanation of how Studio works.

## Developing and deploying a predictive Web service
Here are the stages that a typical solution follows as you develop and deploy it using Machine Learning Studio:

![Deployment flow](./media/model-progression-experiment-to-web-service/model-stages-from-experiment-to-web-service.png)

*Figure 1 - Stages of a typical predictive analysis model*

### The training experiment
The ***training experiment*** is the initial phase of developing your Web service in Machine Learning Studio. The purpose of the training experiment is to give you a place to develop, test, iterate, and eventually train a machine learning model. You can even train multiple models simultaneously as you look for the best solution, but once you’re done experimenting you’ll select a single trained model and eliminate the rest from the experiment. For an example of developing a predictive analysis experiment, see [Develop a predictive analytics solution for credit risk assessment in Azure Machine Learning Studio](tutorial-part1-credit-risk.md).

### The predictive experiment
Once you have a trained model in your training experiment, click **Set Up Web Service** and select **Predictive Web Service** in Machine Learning Studio to initiate the process of converting your training experiment to a ***predictive experiment***. The purpose of the predictive experiment is to use your trained model to score new data, with the goal of eventually becoming operationalized as an Azure Web service.

This conversion is done for you through the following steps:

* Convert the set of modules used for training into a single module and save it as a trained model
* Eliminate any extraneous modules not related to scoring
* Add input and output ports that the eventual Web service will use

There may be more changes you want to make to get your predictive experiment ready to deploy as a Web service. For example, if you want the Web service to output only a subset of results, you can add a filtering module before the output port.

In this conversion process, the training experiment is not discarded. When the process is complete, you have two tabs in Studio: one for the training experiment and one for the predictive experiment. This way you can make changes to the training experiment before you deploy your Web service and rebuild the predictive experiment. Or you can save a copy of the training experiment to start another line of experimentation.

> [!NOTE]
> When you click **Predictive Web Service** you start an automatic process to convert your training experiment to a predictive experiment, and this works well in most cases. If your training experiment is complex (for example, you have multiple paths for training that you join together), you might prefer to do this conversion manually. For more information, see [How to prepare your model for deployment in Azure Machine Learning Studio](convert-training-experiment-to-scoring-experiment.md).
>
>

### The Web service
Once you’re satisfied that your predictive experiment is ready, you can deploy your service as either a Classic Web service or a New Web service based on Azure Resource Manager. To operationalize your model by deploying it as a *Classic Machine Learning Web service*, click **Deploy Web Service** and select **Deploy Web Service [Classic]**. To deploy as *New Machine Learning Web service*, click **Deploy Web Service** and select **Deploy Web Service [New]**. Users can now send data to your model using the Web service REST API and receive back the results. For more information, see [How to consume an Azure Machine Learning Web service](consume-web-services.md).

## The non-typical case: creating a non-predictive Web service
If your experiment does not train a predictive analysis model, then you don’t need to create both a training experiment and a scoring experiment - there’s just one experiment, and you can deploy it as a Web service. Machine Learning Studio detects whether your experiment contains a predictive model by analyzing the modules you’ve used.

After you’ve iterated on your experiment and are satisfied with it:

1. Click **Set Up Web Service** and select **Retraining Web Service** - input and output nodes are added
   automatically
2. Click **Run**
3. Click **Deploy Web Service** and select **Deploy Web Service [Classic]** or **Deploy Web Service [New]** depending on the environment to which you want to deploy.

Your Web service is now deployed, and you can access and manage it just like a predictive Web service.

## Updating your Web service
Now that you’ve deployed your experiment as a Web service, what if you need to update it?

That depends on what you need to update:

**You want to change the input or output, or you want to modify how the Web service manipulates data**

If you’re not changing the model, but are just changing how the Web service handles data, you can edit the predictive experiment and then click **Deploy Web Service** and select **Deploy Web Service [Classic]** or **Deploy Web Service [New]** again. The Web service is stopped, the updated predictive experiment is deployed, and the Web service is restarted.

Here’s an example: Suppose your predictive experiment returns the entire row of input data with the predicted result. You may decide that you want the Web service to just return the result. So you can add a **Project Columns** module in the predictive experiment, right before the output port, to exclude columns other than the result. When you click **Deploy Web Service** and select **Deploy Web Service [Classic]** or **Deploy Web Service [New]** again, the Web service is updated.

**You want to retrain the model with new data**

If you want to keep your machine learning model, but you would like to retrain it with new data, you have two choices:

1. **Retrain the model while the Web service is running** - If you want to retrain your model while the predictive Web service is running, you can do this by making a couple modifications to the training experiment to make it a ***retraining experiment***, then you can deploy it as a ***retraining web* service**. For instructions on how to do this, see [Retrain Machine Learning models programmatically](/azure/machine-learning/studio/retrain-machine-learning-model).
2. **Go back to the original training experiment and use different training data to develop your model** - Your predictive experiment is linked to the Web service, but the training experiment is not directly linked in this way. If you modify the original training experiment and click **Set Up Web Service**, it will create a *new*     predictive experiment which, when deployed, will create a *new* Web service. It doesn’t just update the original Web service.

   If you need to modify the training experiment, open it and click **Save As** to make a copy. This will leave intact the original training experiment, predictive experiment, and Web service. You can now create a new Web service with your changes. Once you’ve deployed the new Web service you can then decide whether to stop the previous Web service or keep it running alongside the new one.

**You want to train a different model**

If you want to make changes to your original predictive experiment, such as selecting a different machine learning algorithm, trying a different training method, etc., then you need to follow the second procedure described above for retraining your model: open the training experiment, click **Save As** to make a copy, and then start down the new path of developing your model, creating the predictive experiment, and deploying the web service. This will create a new Web service unrelated to the original one - you can decide which one, or both, to keep running.

## Next steps
For more details on the process of developing and experiment, see the following articles:

* converting the experiment - [How to prepare your model for deployment in Azure Machine Learning Studio](convert-training-experiment-to-scoring-experiment.md)
* deploying the Web service - [Deploy an Azure Machine Learning web service](publish-a-machine-learning-web-service.md)
* retraining the model - [Retrain Machine Learning models programmatically](/azure/machine-learning/studio/retrain-machine-learning-model)

For examples of the whole process, see:

* [Machine learning tutorial: Create your first experiment in Azure Machine Learning Studio](create-experiment.md)
* [Walkthrough: Develop a predictive analytics solution for credit risk assessment in Azure Machine     Learning](tutorial-part1-credit-risk.md)

