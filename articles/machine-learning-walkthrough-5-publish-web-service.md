<properties 
	pageTitle="Step 5: Publish the Machine Learning web service | Azure" 
	description="Solution walkthrough step 5: Publish a scoring experiment in Azure Machine Learning Studio as an Azure Machine Learning web service" 
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
	ms.date="02/18/2015" 
	ms.author="garye"/>


This is the fifth step of the walkthrough, [Developing a Predictive Solution with Azure ML][develop]:

[develop]: machine-learning-walkthrough-develop-predictive-solution.md


1.	[Create an ML workspace][create-workspace]
2.	[Upload existing data][upload-data]
3.	[Create a new experiment][create-new]
4.	[Train and evaluate the models][train-models]
5.	**Publish the web service**
6.	[Access the web service][access-ws]

[create-workspace]: machine-learning-walkthrough-1-create-ml-workspace.md
[upload-data]: machine-learning-walkthrough-2-upload-data.md
[create-new]: machine-learning-walkthrough-3-create-new-experiment.md
[train-models]: machine-learning-walkthrough-4-train-and-evaluate-models.md
[publish]: machine-learning-walkthrough-5-publish-web-service.md
[access-ws]: machine-learning-walkthrough-6-access-web-service.md

----------

# Step 5: Publish the Azure Machine Learning web service

To make this predictive model useful to others, we'll publish it as a web service on Azure. 

Up to this point we've been experimenting with training our model. But the published service is no longer going to do training - it will be scoring the user's input. So we're going to do some preparation and then publish this experiment as a working web service that users can access. A user will be able to send a set of credit application data to the service, and the service will return the prediction of credit risk.

To do this, we need to:  

- Convert the *training experiment* we've created into a *scoring experiment*
- Publish the scoring experiment as a web service

But first, we need to trim this experiment down a little. We currently have two different models in the experiment, but we now need to select one model to publish.  
Let's say we've decided that the boosted tree model was the better model to use. So the first thing to do is remove the **Two-Class Support Vector Machine** module and the modules that were used for training it. You may want to make a copy of the experiment first by clicking **Save As** at the bottom of the experiment canvas.

We need to delete the following modules:  

1.	**Two-Class Support Vector Machine**
2.	**Train Model** and **Score Model** modules that were connected to it
3.	**Normalize Data** (both of them)
4.	**Evaluate Model**

Now we're ready to publish this model. 

##Convert the training experiment to a scoring experiment

Converting to a scoring experiment involves three steps:

1. Save the model we've trained and replace our training modules with it
2. Trim the experiment to remove modules that were only needed for training
3. Define where the web service input and output nodes should be

Fortunately, all three steps can be accomplished by just clicking **Create Scoring Experiment** at the bottom of the experiment canvas.

When you click **Create Scoring Experiment**, several things happen:

- The model we trained is saved as a **Trained Model** module in the module palette to the left of the experiment canvas (you can find it in the palette under **Trained Models**).
- Modules that were used for training are removed. Specifically:
  - **Two-Class Boosted Decision Tree**
  - **Train Model** 
  - **Split**
  - the second **Execute R Script** module that was used for test data
- The saved trained model is added to the experiment.
- **Web service input** and **Web service output** modules are added.

> [AZURE.NOTE] The experiment has been saved in two parts: the original training experiment, and the new scoring experiment. You can access either one using the tabs at the top of the experiment canvas.

We need to take an additional step with our experiment. 
Machine Learning Studio removed one **Execute R Script** module when it removed the **Split** module, but it left the other **Execute R Script** module. 
Since that module was only used for training and testing (it provided a weighting function on the sample data), we can now remove it and connect **Metadata Editor** to **Score Model**.    

Our experiment should now look like this:  

![Scoring the trained model][4]  


You may be wondering why we left the UCI German Credit Card Data dataset in the scoring experiment. The service is going to use the user's data, not the original dataset, so why leave them connected?

It's true that the service doesn't need the original credit card data. But it does need the schema for that data, which includes information such as how many columns there are and which columns are numeric. This schema information is necessary in order to interpret the user's data. We leave these components connected so that the scoring module will have the dataset schema when the service is running. The data isn't used, just the schema.  

Run the experiment one last time (click **RUN**). If you want to verify that the model is still working, right-click the output of the **Score Model** module and select **Visualize**. You'll see that the original data is displayed, along with the credit risk value ("Scored Labels") and the scoring probability value ("Scored Probabilities").  

##Publish the web service

To publish a web service derived from our experiment, click **PUBLISH WEB SERVICE** below the canvas and click **YES** when prompted. Machine Learning Studio publishes the experiment as a web service on the Machine Learning staging server, and takes you to the service dashboard.   

> [AZURE.TIP] You can update the web service after you've published it. For example, if you want to change your model, just edit the training experiment, tweak the model parameters, and click **UPDATE SCORING EXPERIMENT**. When you publish the experiment again, it will replace the web service, now using your updated model.  

You can configure the service by clicking the **CONFIGURATION** tab. Here you can modify the service name (it's given the experiment name by default) and give it a description. You can also give more friendly labels for the input and output columns.  

##Test the web service
On the **DASHBOARD** page, click the **Test** link under **Default Endpoint**. A dialog will pop up and ask you for the input data for the service. These are the same columns that appeared in the original German credit risk dataset.  

Enter a set of data and then click **OK**.  

The results generated by the web service are displayed at the bottom of the dashboard. The way we have the service configured, the results you see are generated by the scoring module.   


----------

**Next: [Access the web service][access-ws]**

[1]: ./media/machine-learning-walkthrough-5-publish-web-service/publish1.png
[2]: ./media/machine-learning-walkthrough-5-publish-web-service/publish2.png
[3]: ./media/machine-learning-walkthrough-5-publish-web-service/publish3.png
[4]: ./media/machine-learning-walkthrough-5-publish-web-service/publish4.png
