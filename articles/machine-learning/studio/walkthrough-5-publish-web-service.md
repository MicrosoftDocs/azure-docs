---
title: 'Step 5: Deploy the Machine Learning web service | Microsoft Docs'
description: 'Step 5 of the Develop a predictive solution walkthrough: Deploy a predictive experiment in Machine Learning Studio as a web service.'
services: machine-learning
documentationcenter: ''
author: YasinMSFT
ms.author: yahajiza
manager: hjerez
editor: cgronlun

ms.assetid: 3fca74a3-c44b-4583-a218-c14c46ee5338
ms.service: machine-learning
ms.component: studio
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/23/2017

---
# Walkthrough Step 5: Deploy the Azure Machine Learning web service
This is the fifth step of the walkthrough, [Develop a predictive analytics solution in Azure Machine Learning](walkthrough-develop-predictive-solution.md)

1. [Create a Machine Learning workspace](walkthrough-1-create-ml-workspace.md)
2. [Upload existing data](walkthrough-2-upload-data.md)
3. [Create a new experiment](walkthrough-3-create-new-experiment.md)
4. [Train and evaluate the models](walkthrough-4-train-and-evaluate-models.md)
5. **Deploy the web service**
6. [Access the web service](walkthrough-6-access-web-service.md)

- - -
To give others a chance to use the predictive model we've developed in this walkthrough, we can deploy it as a web service on Azure.

Up to this point we've been experimenting with training our model. But the deployed service is no longer going to do training - it's going to generate new predictions by scoring the user's input based on our model. So we're going to do some preparation to convert this experiment from a ***training*** experiment to a ***predictive*** experiment. 

This is a three-step process:  

1. Remove one of the models
2. Convert the *training experiment* we've created into a *predictive experiment*
3. Deploy the predictive experiment as a web service

## Remove one of the models

First, we need to trim this experiment down a little. We currently have two different models in the experiment, but we only want to use one model when we deploy this as a web service.  

Let's say we've decided that the boosted tree model performed better than the SVM model. So the first thing to do is remove the [Two-Class Support Vector Machine][two-class-support-vector-machine] module and the modules that were used for training it. You may want to make a copy of the experiment first by clicking **Save As** at the bottom of the experiment canvas.

We need to delete the following modules:  

* [Two-Class Support Vector Machine][two-class-support-vector-machine]
* [Train Model][train-model] and [Score Model][score-model] modules that were connected to it
* [Normalize Data][normalize-data] (both of them)
* [Evaluate Model][evaluate-model] (because we're finished evaluating the models)

Select each module and press the Delete key, or right-click the module and select **Delete**. 

![Removed the SVM model][3a]

Our model should now look something like this:

![Removed the SVM model][3]

Now we're ready to deploy this model using the [Two-Class Boosted Decision Tree][two-class-boosted-decision-tree].

## Convert the training experiment to a predictive experiment

To get this model ready for deployment, we need to convert this training experiment to a predictive experiment. This involves three steps:

1. Save the model we've trained and then replace our training modules
2. Trim the experiment to remove modules that were only needed for training
3. Define where the web service will accept input and where it generates the output

We could do this manually, but fortunately all three steps can be accomplished by clicking **Set Up Web Service** at the bottom of the experiment canvas (and selecting the **Predictive Web Service** option).

> [!TIP]
> If you want more details on what happens when you convert a training experiment to a predictive experiment, see [How to prepare your model for deployment in Azure Machine Learning Studio](convert-training-experiment-to-scoring-experiment.md).

When you click **Set Up Web Service**, several things happen:

* The trained model is converted to a single **Trained Model** module and stored in the module palette to the left of the experiment canvas (you can find it under **Trained Models**)
* Modules that were used for training are removed; specifically:
  * [Two-Class Boosted Decision Tree][two-class-boosted-decision-tree]
  * [Train Model][train-model]
  * [Split Data][split]
  * the second [Execute R Script][execute-r-script] module that was used for test data
* The saved trained model is added back into the experiment
* **Web service input** and **Web service output** modules are added (these identify where the user's data will enter the model, and what data is returned, when the web service is accessed)

> [!NOTE]
> You can see that the experiment is saved in two parts under tabs that have been added at the top of the experiment canvas. The original training experiment is under the tab **Training experiment**, and the newly created predictive experiment is under **Predictive experiment**. The predictive experiment is the one we'll deploy as a web service.

We need to take one additional step with this particular experiment.
We added two [Execute R Script][execute-r-script] modules to provide a weighting function to the data. That was just a trick we needed for training and testing, so we can take out those modules in the final model.
Machine Learning Studio removed one [Execute R Script][execute-r-script] module when it removed the [Split][split] module. Now we can remove the other and connect [Metadata Editor][metadata-editor] directly to [Score Model][score-model].    

Our experiment should now look like this:  

![Scoring the trained model][4]  

> [!NOTE]
> You may be wondering why we left the UCI German Credit Card Data dataset in the predictive experiment. The service is going to score the user's data, not the original dataset, so why leave the original dataset in the model?
> 
> It's true that the service doesn't need the original credit card data. But it does need the schema for that data, which includes information such as how many columns there are and which columns are numeric. This schema information is necessary to interpret the user's data. We leave these components connected so that the scoring module has the dataset schema when the service is running. The data isn't used, just the schema.  
> 
>One important thing to note is that if your original dataset contained the label, then the expected schema from the web input will also expect a column with the label! A way around this is to remove the label, and any other data that was in the training dataset, but will not be in the web inputs, before connecting the web input and training dataset into a common module. 
> 

Run the experiment one last time (click **Run**.) If you want to verify that the model is still working, click the output of the [Score Model][score-model] module and select **View Results**. You can see that the original data is displayed, along with the credit risk value ("Scored Labels") and the scoring probability value ("Scored Probabilities".) 

## Deploy the web service
You can deploy the experiment as either a Classic web service, or as a New web service that's based on Azure Resource Manager.

### Deploy as a Classic web service
To deploy a Classic web service derived from our experiment, click **Deploy Web Service** below the canvas and select **Deploy Web Service [Classic]**. Machine Learning Studio deploys the experiment as a web service and takes you to the dashboard for that web service. From this page you can return to the experiment (**View snapshot** or **View latest**) and run a simple test of the web service (see **Test the web service** below). There is also information here for creating applications that can access the web service (more on that in the next step of this walkthrough).

![Web service dashboard][6]

You can configure the service by clicking the **CONFIGURATION** tab. Here you can modify the service name (it's given the experiment name by default) and give it a description. You can also give more friendly labels for the input and output data.  

![Configure the web service][5]  

### Deploy as a New web service

> [!NOTE] 
> To deploy a New web service you must have sufficient permissions in the subscription to which you are deploying the web service. For more information, see [Manage a web service using the Azure Machine Learning Web Services portal](manage-new-webservice.md). 

To deploy a New web service derived from our experiment:

1. Click **Deploy Web Service** below the canvas and select **Deploy Web Service [New]**. Machine Learning Studio transfers you to the Azure Machine Learning web services **Deploy Experiment** page.

2. Enter a name for the web service. 

3. For **Price Plan**, you can select an existing pricing plan, or select "Create new" and give the new plan a name and select the monthly plan option. The plan tiers default to the plans for your default region and your web service is deployed to that region.

4. Click **Deploy**.

After a few minutes, the **Quickstart** page for your web service opens.

You can configure the service by clicking the **Configure** tab. Here you can modify the service title and give it a description. 

To test the web service, click the **Test** tab (see **Test the web service** below). For information on creating applications that can access the web service, click the **Consume** tab (the next step in this walkthrough will go into more detail).

> [!TIP]
> You can update the web service after you've deployed it. For example, if you want to change your model, then you can edit the training experiment, tweak the model parameters, and click **Deploy Web Service**, selecting **Deploy Web Service [Classic]** or **Deploy Web Service [New]**. When you deploy the experiment again, it replaces the web service, now using your updated model.  
> 
> 

## Test the web service

When the web service is accessed, the user's data enters through the **Web service input** module where it's passed to the [Score Model][score-model] module and scored. The way we've set up the predictive experiment, the model expects data in the same format as the original credit risk dataset.
The results are returned to the user from the web service through the **Web service output** module.

> [!TIP]
> The way we have the predictive experiment configured, the entire results from the [Score Model][score-model] module are returned. This includes all the input data plus the credit risk value and the scoring probability. But you can return something different if you want - for example, you could return just the credit risk value. To do this, insert a [Project Columns][project-columns] module between [Score Model][score-model] and the **Web service output** to eliminate columns you don't want the web service to return. 
> 
> 

You can test a Classic web service either in **Machine Learning Studio** or in the **Azure Machine Learning Web Services** portal.
You can test a New web service only in the **Machine Learning Web Services** portal.

> [!TIP]
> When testing in the Azure Machine Learning Web Services portal, you can have the portal create sample data that you can use to test the Request-Response service. On the **Configure** page, select "Yes" for **Sample Data Enabled?**. When you open the Request-Response tab on the **Test** page, the portal fills in sample data taken from the original credit risk dataset.

### Test a Classic web service

You can test a Classic web service in Machine Learning Studio or in the Machine Learning Web Services portal. 

#### Test in Machine Learning Studio

1. On the **DASHBOARD** page for the web service, click the **Test** button under **Default Endpoint**. A dialog pops up and asks you for the input data for the service. These are the same columns that appeared in the original credit risk dataset.  

2. Enter a set of data and then click **OK**. 

#### Test in the Machine Learning Web Services portal

1. On the **DASHBOARD** page for the web service, click the **Test preview** link under **Default Endpoint**. The test page in the Azure Machine Learning Web Services portal for the web service endpoint opens and asks you for the input data for the service. These are the same columns that appeared in the original credit risk dataset.

2. Click **Test Request-Response**. 

### Test a New web service

You can test a New web service only in the Machine Learning Web Services portal.

1. In the [Azure Machine Learning Web Services](https://services.azureml.net/quickstart) portal, click **Test** at the top of the page. The **Test** page opens and you can input data for the service. The input fields displayed correspond to the columns that appeared in the original credit risk dataset. 

2. Enter a set of data and then click **Test Request-Response**.

The results of the test are displayed on the right-hand side of the page in the output column. 


## Manage the web service

Once you've deployed your web service, whether Classic or New, you can manage it from the [Microsoft Azure Machine Learning Web Services](https://services.azureml.net/quickstart) portal.

To monitor the performance of your web service:

1. Sign in to the [Microsoft Azure Machine Learning Web Services](https://services.azureml.net/quickstart) portal
2. Click **Web services**
3. Click your web service
4. Click the **Dashboard**

- - -
**Next: [Access the web service](walkthrough-6-access-web-service.md)**

[3]: ./media/walkthrough-5-publish-web-service/publish3.png
[3a]: ./media/walkthrough-5-publish-web-service/publish3a.png
[4]: ./media/walkthrough-5-publish-web-service/publish4.png
[5]: ./media/walkthrough-5-publish-web-service/publish5.png
[6]: ./media/walkthrough-5-publish-web-service/publish6.png


<!-- Module References -->
[evaluate-model]: https://msdn.microsoft.com/library/azure/927d65ac-3b50-4694-9903-20f6c1672089/
[execute-r-script]: https://msdn.microsoft.com/library/azure/30806023-392b-42e0-94d6-6b775a6e0fd5/
[metadata-editor]: https://msdn.microsoft.com/library/azure/370b6676-c11c-486f-bf73-35349f842a66/
[normalize-data]: https://msdn.microsoft.com/library/azure/986df333-6748-4b85-923d-871df70d6aaf/
[score-model]: https://msdn.microsoft.com/library/azure/401b4f92-e724-4d5a-be81-d5b0ff9bdb33/
[split]: https://msdn.microsoft.com/library/azure/70530644-c97a-4ab6-85f7-88bf30a8be5f/
[train-model]: https://msdn.microsoft.com/library/azure/5cc7053e-aa30-450d-96c0-dae4be720977/
[two-class-boosted-decision-tree]: https://msdn.microsoft.com/library/azure/e3c522f8-53d9-4829-8ea4-5c6a6b75330c/
[two-class-support-vector-machine]: https://msdn.microsoft.com/library/azure/12d8479b-74b4-4e67-b8de-d32867380e20/
[project-columns]: https://msdn.microsoft.com/library/azure/1ec722fa-b623-4e26-a44e-a50c6d726223/
