<properties
	pageTitle="How a Machine Learning model progresses from an experiment to an operationalized web service | Microsoft Azure"
	description="An overview of the mechanics of how your Azure Machine Learning model progresses from a development experiment to an operationalized web service."
	services="machine-learning"
	documentationCenter=""
	authors="garyericson"
	manager="paulettm"
	editor="cgronlun"/>

<tags
	ms.service="machine-learning"
	ms.workload="data-services"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/06/2016"
	ms.author="garye"/>


# How a Machine Learning model progresses from an experiment to an operationalized web service

An ***experiment*** is a canvas in Azure Machine Learning Studio that allows
you to interactively develop, run, test, and iterate as you create a
predictive analysis model. A wide variety of modules are available that
you can use to bring data into your experiment, manipulate the data,
train a model using machine learning algorithms, score the model,
evaluate the results, and output final values.

Once you’re satisfied with your experiment, you can deploy it as a
***Classic Azure web service*** or a ***New Azure web service*** so that users can send it new data and receive back
results.

In this article we’ll give an overview of the mechanics of how your
Machine Learning model progresses from a development experiment to an
operationalized web service.

>[AZURE.NOTE] There are other ways to develop and deploy machine learning
models, but this article is focused on how you use Machine Learning
Studio. For a discussion of how to create a classic predictive web service with
R, see the blog post [Build & Deploy Predictive Web Apps Using RStudio
and Azure
ML](http://blogs.technet.com/b/machinelearning/archive/2015/09/25/build-and-deploy-a-predictive-web-app-using-rstudio-and-azure-ml.aspx).

While Azure Machine Learning Studio is designed primarily to help you
develop and deploy a *predictive analysis model*, it’s possible to use
Studio to develop an experiment that doesn’t include a predictive
analysis model. For example, an experiment might just input data,
manipulate it, and then output the results. Just like a predictive
analysis experiment, you can deploy this non-predictive experiment as a
web service, but it’s a simpler process because the experiment isn’t
training or scoring a machine learning model. While that’s not the
typical use of Studio, we’ll include it in the discussion below so that
we can give a complete explanation of how Studio works.

## Developing and deploying a predictive web service

Here are the stages that a typical solution follows as you develop and
deploy it using Machine Learning Studio:

![](media\machine-learning-model-progression-experiment-to-web-service\model-stages-from-experiment-to-web-service.png)

*Figure 1 - Stages of a typical predictive analysis model*

### The training experiment

The ***training experiment*** is the initial experiment canvas in Machine
Learning Studio. The purpose of the training experiment is to give you a
place to develop, test, iterate, and eventually train a machine learning
model. You can even train multiple models simultaneously as you look for
the best solution, but once you’re done experimenting you’ll select a
single trained model and eliminate the rest from the experiment. For an
example of developing a predictive analysis experiment, see [Develop a
predictive analytics solution for credit risk assessment in Azure
Machine
Learning](machine-learning-walkthrough-develop-predictive-solution.md).

### The predictive experiment

Once you have a trained model in your training experiment, you click
**Set Up Web Service** in Machine Learning Studio and Studio goes
through the process of converting your training experiment to a
***predictive experiment***. The purpose of the predictive experiment is to
use your trained model to score new data, with the goal of eventually
becoming operationalized as an Azure web service.

This conversion is done for you through the following steps:

-   Convert the set of modules used for training into a single module
    and save it as a trained model

-   Eliminate any extraneous modules not related to scoring

-   Add input and output ports that the eventual web service will use

There may be more changes you want to make to get your predictive
experiment ready to deploy as a web service. For example, if you want
the web service to output only a subset of results, you can add a
filtering module before the output port.

In this conversion process the training experiment is not discarded.
When the process is complete you’ll have two tabs in Studio: one for the
training experiment and one for the predictive experiment. This way,
before you deploy your web service, you can make changes to the training
experiment and rebuild the predictive experiment. Or you can save a copy
of the training experiment to start another line of experimentation.

>[AZURE.NOTE] When you click **Set Up Web Service** you start an automatic
process to convert your training experiment to a predictive experiment,
and this works well in most cases. But if your training experiment is
complex (for example, you have multiple paths for training that you join
together), you might prefer to do this conversion manually. For more
details on how this conversion process works, see [Convert a Machine
Learning training experiment to a predictive
experiment](machine-learning-convert-training-experiment-to-scoring-experiment.md).

### The web service

Once you’re satisfied that your predictive experiment is ready, you can deploy your service as either a classic web service or a new web service based on Azure Resource Manager.
To operationalize your model by deploying it as a *classic web service*, click **Deploy Web Service** and select **Deploy Web Service [Classic]**. To deploy as *new web service*, click **Deploy Web Service** and select **Deploy Web Service [New]**. Users can now send data to your model using
the web service REST API and receive back the results. For more
information on how to do this, see [How to consume an Azure Machine
Learning web service that has been deployed from a Machine Learning
experiment](machine-learning-consume-web-services.md).

Once you deploy the web service, the predictive experiment and web
service remain connected, and you can go back-and-forth between them:

| ***From this page…*** | ***click this…*** | ***to open this page…*** |
| ------------------- | --------------- | ---------------------- |
|experiment canvas in Studio|**Go to web service**|web service configuration in Studio|
|web service configuration in Studio|**View latest**|experiment canvas in Studio|
|web service configuration in Studio (Classic Web Service Only)|**Manage endpoints…**|endpoint management in Azure Classic Portal|
|endpoint management in Azure Classic Portal (Classic Web Service Only)|**Edit in Studio**|experiment canvas in Studio|

![](media\machine-learning-model-progression-experiment-to-web-service\connections-between-experiment-and-web-service.png)

*Figure 2 - Connections between an experiment and the web service*

## The non-typical case: creating a non-predictive web service

If your experiment does not train a predictive analysis model, then you
don’t need to create both a training experiment and a scoring experiment - there’s
just one experiment, and you can deploy it as a web service
(Machine Learning Studio detects whether your experiment contains a
predictive model by analyzing the modules you’ve used).

After you’ve iterated on your experiment and are satisfied with it:

1.  Click **Set Up Web Service** - input and output nodes are added
    automatically

2.  Click **Run**

3. Click **Deploy Web Service** and select **Deploy Web Service [Classic]** or **Deploy Web Service [New]** depending on the environment to which you want to deploy.

Your web service is now deployed, and you can access and manage it just
like a predictive web service.

## The web service buttons

In Machine Learning Studio, the web service buttons - **Set Up Web Service** and **Deploy Web Service** - change name and function
depending on where you’re at in the development process.

**Experiment contains a predictive model**

If the experiment trains and scores a predictive model, then the web
service buttons perform these functions:

|**Type of experiment**|**Button**|**What it does**|
| -------------------- | -------- | -------------- |
|Experiment under development|**Set Up Web Service**|Gives two options|
|&nbsp;|- **Predictive Web Service**|Converts the experiment into both a training experiment and a scoring experiment|
|&nbsp;|- **Retraining Web Service**|Converts the experiment into a retraining experiment (see the "Updating" section below)|
|Training experiment|**Set Up Web Service**|Gives two options|
|&nbsp;|- **Update Predictive Experiment**|Updates the associated predictive experiment with changes you’ve made to the training experiment|
|&nbsp;|- **Retraining Web Service**|Converts the training experiment into a retraining experiment (see the "Updating" section below)|
|&nbsp;|-*or*- **Deploy Web Service [Classic]** |If you have set up the retraining experiment for deployment, then this deploys it as a classic web service|
|&nbsp;|-*or*- **Deploy Web Service [New]** |If you have set up the retraining experiment for deployment, then this deploys it as a new web service|
|Predictive experiment|**Deploy Web Service [Classic]** |Deploys the predictive experiment as a classic web service|
|Predictive experiment|**Deploy Web Service [New]** |Deploys the predictive experiment as a new web service|

**Experiment does *not* contain a predictive model**

If the experiment does not train and score a predictive model, then the
web service buttons are much simpler:

|**Type of experiment**|**Button**|**What it does**|
| -------------------- | -------- | -------------- |
|Experiment under development|**Set Up Web Service**|Prepares the experiment for deploying as a web service|
|Experiment prepared for deployment|***Deploy Web Service [Classic]**|Deploys the experiment as a web service, opens classic web service configuration page|
|&nbsp;|-*or*- **Deploy Web Service [New]**| Deploys as a new web service|

## Updating your web service

Now that you’ve deployed your experiment as a web service, what if you
need to update it?

That depends on what you need to update:

**You want to change the input or output, or you want to modify how the
web service manipulates data**

If you’re not changing the model but are just changing how the web
service handles data, you can edit the predictive experiment and then
click **Deploy Web Service** and select **Deploy Web Service [Classic]** or **Deploy Web Service [New]** again. The web service will be stopped, the
updated predictive experiment will be deployed, and the web service will
start up again.

Here’s an example: Suppose your predictive experiment returns the entire
row of input data with the predicted result. You may decide that you
want the web service to just return the result. So you can add a
**Project Columns** module in the predictive experiment, right before
the output port, to exclude columns other than the result. When you
click **Deploy Web Service** and select **Deploy Web Service [Classic]** or **Deploy Web Service [New]** again, the web service is updated.

**You want to retrain the model with new data**

If you want to keep your machine learning model, but you would like to
retrain it with new data, you have two choices:

1.  **Retrain the model while the web service is running** - If you want
    to retrain your model while the predictive web service is running,
    you can do this by making a couple modifications to the training
    experiment to make it a ***retraining experiment***, then you can
    deploy it as a ***retraining web* service**. For instructions on how
    to do this, see [Retrain Machine Learning models
    programmatically](machine-learning-retrain-models-programmatically.md).

2.  **Go back to the original training experiment and use different
    training data to develop your model** - Your predictive experiment
    is linked to the web service, but the training experiment is not
    directly linked in this way. If you modify the original training
    experiment and click **Set Up Web Service**, it will create a *new*
    predictive experiment which, when deployed, will create a *new*
    web service. It doesn’t just update the original web service.

    So if you need to modify the training experiment, open it and click
    **Save As** to make a copy. This will leave intact the original
    training experiment, predictive experiment, and web service. You can
    now create a new web service with your changes. Once you’ve deployed
    the new web service you can then decide whether to stop the previous
    web service or keep it running alongside the new one.

**You want to train a different model**

If you want to make changes to
your original predictive experiment, such as selecting a different
machine learning algorithm, trying a different training method, etc.,
then you need to follow the second procedure described above for
retraining your model: open the training experiment, click **Save As**
to make a copy, and then start down the new path of developing your
model, creating the predictive experiment, and deploying the web
service. This will create a new web service unrelated to the original
one - you can decide which one, or both, to keep running.

## For further reading

For more details on this process, see the following articles:

-   converting the experiment - [Convert a Machine Learning training
    experiment to a predictive experiment](machine-learning-convert-training-experiment-to-scoring-experiment.md)

-   deploying the web service - [Deploy an Azure Machine Learning web
    service](machine-learning-publish-a-machine-learning-web-service.md)

-   retraining the model - [Retrain Machine Learning models
    programmatically](machine-learning-retrain-models-programmatically.md)

For examples of the whole process, see:

-   [Machine learning tutorial: Create your first experiment in Azure
    Machine Learning
    Studio](machine-learning-create-experiment.md)

-   [Walkthrough: Develop a predictive analytics solution for credit
    risk assessment in Azure Machine
    Learning](machine-learning-walkthrough-develop-predictive-solution.md)
