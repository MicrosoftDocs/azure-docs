<properties
	pageTitle="Retrain Machine Learning models programmatically | Microsoft Azure"
	description="Learn how to programmatically retrain a model and update the Web service to use the newly trained model in Azure Machine Learning."
	services="machine-learning"
	documentationCenter=""
	authors="raymondlaghaeian"
	manager="paulettm"
	editor="cgronlun"/>

<tags
	ms.service="machine-learning"
	ms.workload="data-services"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="08/29/2016"
	ms.author="raymondl;garye;v-donglo"/>


#Retrain Machine Learning models programmatically  

As part of the process of operationalization of machine learning models in Azure Machine Learning, your model is trained and saved. You then use it to create a predicative Web service. The Web service can then be consumed in web sites, dashboards, and mobile apps. 

Models you create using Machine Learning are typically not static. As new data becomes available or when the consumer of the API has their own data the model needs to be retrained. Or, you may need to apply filters obtain a subset of the data and retrain the model. 

Retraining may occur frequently. With the Programmatic Retraining API feature, you can programmatically retrain the model using the Retraining APIs and update the Web service with the newly trained model. 

This document describes the retraining process, and shows you how to use the Retraining APIs.

## Why retrain: defining the problem  

As part of the machine learning training process, a model is trained using a set of data. Models you create using Machine Learning are typically not static. As new data becomes available or when the consumer of the API has their own data the model needs to be retrained. Additional scenarios may require you to apply filters obtain a subset of the data and retrain the model. 

In these scenarios, a programmatic API provides a convenient way to allow you or the consumer of your APIs to create a client that can, on a one-time or regular basis, retrain the model using their own data. They can then evaluate the results of retraining, and update the Web service API to use the newly trained model.  

##How to retrain: the end to end process  

To start, the process involves the following components: A Training Experiment and a Predictive Experiment published as a Web service. To enable retraining of a trained model, the Training Experiment must be published as a Web service with the output of a trained model. This enables API access to the model for retraining. 

The process for setting up retraining for a Classic Web service involves the following steps:

![Retraining process overview][1]

Diagram 1: Retraining process for a Classic Web service overview  

The process for setting up retraining for a New Web service involves the following steps:

![Retraining process overview][7]

Diagram 1: Retraining process for a New Web service overview  

## Create a Training Experiment
 
For this example, you will use "Sample 5: Train, Test, Evaluate for Binary Classification: Adult Dataset" from the Microsoft Azure Machine Learning samples. 
	
To create the experiment:

1.	Sign into to Microsoft Azure Machine Learning Studio. 
2.	On the bottom right corner of the dashboard, click **New**.
3.	From the Microsoft Samples, select Sample 5.
4.	To rename the experiment, at the top of the experiment canvas, select the experiment name "Sample 5: Train, Test, Evaluate for Binary Classification: Adult Dataset".
5.	Type Census Model.
6.	At the bottom of the experiment canvas, click **Run**.
7.	Click **Set Up Web service** and select **Retraining Web service**. 

 	![Initial experiment.][2]

Diagram 2: Initial experiment.

## Create a Scoring Experiment and publish as a Web service  

Next you create a Predicative Experiment.

1.	At the bottom of the experiment canvas, click **Set Up Web Service** and select **Predictive Web Service**. This saves the model as a Trained Model and adds Web service Input and Output modules. 
2.	Click **Run**. 
3.	After experiment has finished running, click **Deploy Web Service [Classic]** or **Deploy Web Service [New]**.

## Deploy the Training Experiment as a Training Web service

To retrain the trained model, you must deploy the Training Experiment that you created as a Retraining Web service. This Web service needs a *Web Service Output* module connected to the *[Train Model][train-model]* module, to be able to produce new trained models.

1. To return to the training experiment, click the Experiments icon in the left pane, then click the experiment named Census Model. 
2. In the Search Experiment Items search box, type Web service. 
3. Drag a *Web Service Input* module onto the experiment canvas and connect its output to the *Clean Missing Data* module. 
4. Drag two *Web service Output* modules onto the experiment canvas. Connect the output of the *Train Model* module to one and the output of the *Evaluate Model* module to the other. The Web service output for **Train Model** gives us the new trained model. The output attached to **Evaluate Model** returns that module’s output.
5. Click **Run**. 

Next you must deploy the Training Experiment as a web service that produces a trained model and model evaluation results. To accomplish this, your next set of actions are dependent on whether you are working with a Classic Web service or a New Web service.  
  
**Classic Web service**

At the bottom of the experiment canvas, click **Set Up Web Service** and select **Deploy Web Service [Classic]**. The Web Service **Dashboard** is displayed with the API Key and the API help page for Batch Execution. Only the Batch Execution method can be used for creating Trained Models.

**New Web service**

At the bottom of the experiment canvas, click **Set Up Web Service** and select **Deploy Web Service [New]**. The Web Service Azure Machine Learning Web Services portal opens to the Deploy Web service page. Type a name for your Web service and choose a payment plan, then click **Deploy**. Only the Batch Execution method can be used for creating Trained Models

In either case, after experiment has completed running, the resulting workflow should look as follows:

![Resulting workflow after run.][4]

Diagram 3: Resulting workflow after run.

## Retrain the model with new data using BES

To call the Retraining APIs:

1. Create a C# Console Application in Visual Studio (New->Project->Windows Desktop->Console Application).
2.	Sign in to the Machine Learning Web Service portal.
3.	If you are working with a Classic Web service, click **Classic Web Services**.
	1.	Click the Web service you are working with.
	2.	Click the default endpoint.
	3.	Click **Consume**.
	4.	At the bottom of the **Consume** page, in the **Sample Code** section, click **Batch**.
	5.	Continue to step 5 of this procedure.
4.	If you are working with a New Web service, click **Web Services**.
	1.	Click the Web service you are working with.
	2.	Click **Consume**.
	3.	At the bottom of the Consume page, in the **Sample Code** section, click **Batch**.
5.	Copy the sample C# code for batch execution and paste it into the Program.cs file, making sure the namespace remains intact.
7. When specifying the output location in the Request Payload, the extension of the file specified in *RelativeLocation* must be changed from csv to ilearner. See the following example.

		Outputs = new Dictionary<string, AzureBlobDataReference>()
		{
			{
				"output1",
				new AzureBlobDataReference()
				{
					ConnectionString = "DefaultEndpointsProtocol=https;AccountName=mystorageacct;AccountKey=Dx9WbMIThAvXRQWap/aLnxT9LV5txxw==",
					RelativeLocation = "mycontainer/output1results.ilearner"
				}
			},
		},

>[AZURE.NOTE] The names of your output locations may be different from the ones in this walkthrough based on the order in which you added the Web service output modules. Since you set up this Training Experiment with two outputs, the results include storage location information for both of them. 

### Update the Azure Storage information

The BES sample code uploads a file from a local drive (For example "C:\temp\CensusIpnput.csv") to Azure Storage, processes it, and writes the results back to Azure Storage.  

To accomplish this task, you must retrieve the Storage account name, key, and container information from the Azure classic portal for your Storage account and the update corresponding values in the code. 

You also must ensure the input file is available at the location you specify in the code.  

![Retraining output][6]

Diagram 4: Retraining output.

## Evaluate the Retraining Results
 
When you run the application, the output includes the URL and SAS token necessary to access the evaluation results.

You can see the performance results of the retrained model by combining the *BaseLocation*, *RelativeLocation*, and *SasBlobToken* from the output results for *output2* (as shown in the preceding retraining output image) and pasting the complete URL in the browser address bar.  

Examine the results to determine whether the newly trained model performs well enough to replace the existing one.

Copy the *BaseLocation*, *RelativeLocation*, and *SasBlobToken* from the output results, you will use them during the retraining process.

## Next steps

[Retrain a Classic Web service](machine-learning-retrain-a-classic-web-service.md)

[Retrain a New Web service using the Machine Learning Management cmdlets](machine-learning-retrain-new-web-service-using-powershell.md)

<!-- Retrain a New Web service using the Machine Learning Management REST API -->


[1]: ./media/machine-learning-retrain-models-programmatically/machine-learning-retrain-models-programmatically-IMAGE01.png
[2]: ./media/machine-learning-retrain-models-programmatically/machine-learning-retrain-models-programmatically-IMAGE02.png
[3]: ./media/machine-learning-retrain-models-programmatically/machine-learning-retrain-models-programmatically-IMAGE03.png
[4]: ./media/machine-learning-retrain-models-programmatically/machine-learning-retrain-models-programmatically-IMAGE04.png
[5]: ./media/machine-learning-retrain-models-programmatically/machine-learning-retrain-models-programmatically-IMAGE05.png
[6]: ./media/machine-learning-retrain-models-programmatically/machine-learning-retrain-models-programmatically-IMAGE06.png
[7]: ./media/machine-learning-retrain-models-programmatically/machine-learning-retrain-models-programmatically-IMAGE07.png


<!-- Module References -->
[train-model]: https://msdn.microsoft.com/library/azure/5cc7053e-aa30-450d-96c0-dae4be720977/