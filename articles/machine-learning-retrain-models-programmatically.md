<properties 
   pageTitle="Retrain Machine Learning models programmatically | Azure" 
   description="Learn how to programmatically retrain a model and update the web service to use the newly trained model in Azure Machine Learning." 
   services="machine-learning" 
   documentationCenter="" 
   authors="raymondlag" 
   manager="paulettm" 
   editor="cgronlun"/>

<tags
   ms.service="machine-learning"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm=""
   ms.workload="big-data" 
   ms.date="02/12/2015"
   ms.author="raymondl"/>



#Retrain Machine Learning models programmatically  

##Overview  
As part of the process of Operationalization Machine Learning models in Azure ML, a model needs to be trained and saved, then used to create a Scoring Web Service. The Web Service can then be consumed in web sites, dashboards and mobile apps.  

Frequently, however, there is a need to retrain the model created in the first step with new data. Previously, this was only possible through the Azure ML UI, but with the introduction of the Programmatic Retraining API feature, you now can retrain the model and update the Web Service, to use the newly trained model, programmatically using the Retraining APIs.  

This document describes the above process, and shows how to use the Retraining APIs.   
 
##Retraining Machine Learning models  
###Why retrain: defining the problem  
As part of the ML training process, a model is trained using a set of data. The models needs to be retrained in scenarios where new data becomes available, or when the consumer of the API has their own data to train the model, or when the data needs to be filtered and the model trained with the subset of data, etc.  

In these scenarios, a programmatic API provides a convenient way to allow you or the consumer of your APIs to create a client that can, on a one-time or regular basis, retrain the model using their own data. They can then evaluate the results of retraining, and update the Web Service API to use the newly trained model.  

###How to retrain: the end to end process  
To start, the process involves the following components: a Training Experiment and a Scoring Experiment published as a Web Service. To enable retraining of a trained model, the Training Experiment has to also be published as a Web Service with the output of a trained model. This enables API access to the model for retraining. The process for setting up retraining involves the following steps:  

![][1]
 
Diagram 1: Retraining process overview  

1. *Create a Training Experiment*  
	We will be using experiment “Sample 5” from the Azure ML sample experiments for this example. As you will see below, I have simplified the sample by removing some modules. I have also named the experiment “Census Model”.

 	![][2]

	With these pieces in place, we can now click Run on the bottom of the screen to run this experiment.  
2. *Create a Scoring Experiment and publish as a Web Service*  
	
	![][3]	

	After experiment run is completed, we click on Create Scoring Experiment. This creates a Scoring Experiment, saves the model as a Trained Model and adds Web Service Input and Output modules as shown below. Next, we click Run.  

	After experiment run is completed, clicking on “Publish Web Service” will publish the Scoring Experiment as a Web Service and create a default endpoint in production.  
3. *Publish the Training Experiment as a Web Service* 	
	To make the trained model available for retraining , we need to publish the Training Experiment we created in step 1 above as a Web Service. To access that experiment, we click on the Experiments icon in the left pane, then click on the experiment called Census Model.  

	We then add a Web Service Input and two Output modules to the workflow. The Web Service output for Train Model will return the result of retraining. The output attached to Evaluate Model will return that module’s Evaluate Model output.   

	We can now click Run. After experiment has completed running, the resulting workflow should look as below:
 
	![][4]

	We next click on the Publish Web Service button, then click Yes. This will publish the Training Experiment as a Web Service. The Web Service Dashboard will be displayed with the API Key and the API help page for Batch Execution. Note that only the Batch Execution method can be used for Retraining of models. This endpoint is can now be used for retraining.  
4. *Add a new Endpoint*  
	The Scoring Web Service we published in Step 2 above is the default endpoint. Its model cannot be updated. To create an updateable endpoint we can use – or one we want to share with a customer – we need to call the Endpoint Management API  . The following code snippet shows this operation:
 
	![][5]  

	We can get the “apiKey” from the Studio under Settings (left pane of the workspace) -> Authorization Tokens -> Primary.  

	The “requestUri” format is as follows:  
	[https://management.azureml.net/workspaces/<workspaceId>/webservices/<webserviceid>/endpoints/<name>]()  

	- we then need to replace the <workspaceId> and <webserviceId> with the values we can get from the browser address bar by clicking on Web Services (left pane) -> Census Model [Scoring]-> API Help Page. The values for the Ids are in the URL after “workspaces” and “webservices” respectively.  

	- <name> is the name of the new endpoint we are creating e.g. “endpoint1”.  
	
5. *Retrain the model with new data and BES*  
	To call the Retraining APIs, we create a new C# Console Application in Visual Studio (New->Project->Windows Desktop->Console Application).  

	We then copy the sample C# code from the Training Experiment’s Web Service API help page for BES service (created in Step 3 above). And paste it into the Program.cs file – making sure the namespace remains intact.  

	Note that sample code’s comments requiring setting up the necessary references.  

	1. Provide Azure Storage info
The sample code for BES will upload a file from a local drive (e.g. “C:\temp\CensusIpnput.csv”) to Azure Storage, process it, and write the results back to Azure Storage.  

		To accomplish that, you need to retrieve the Storage account name, key, and container information from the Azure Management Portal for your Storage account and the update the code here. You also need to ensure the input file is available at the location you specify in the code.  

		We had set up this Training Experiment with two outputs, so the results will include storage location information for both of them as seen below. “output1” is the output of the Trained Model, “output2” the output of Evaluate Model.  

		![][6]
 
6. *Evaluate the Retraining Results*  
	Using the combination of the BaseLocation, RelativeLocaiton and SasBlobToken from the above output results for “output2” we can see the performance results of the retrained model by pasting the complete URL in the browser address bar.  

	This will tell us if the newly trained model performs well enough to replace the existing one.  

7. *Update the added endpoint’s Trained Model*  
	To complete the process, we need to update the Trained Model of the new endpoint we created in Step 4 above.  

	The BES output above shows the information for the result of retraining for “output1” which contains the retrained model location information. We need to provide this information in the call to the API to update the endpoint’s trained model:  

	![][7]
  
	The “apiKey” and the “endpointUrl” for this call are part of the Response output for adding a new endpoint (step 4 above).   

	With the success of this call, the new endpoint will be using a retrained model.   

##Summary  
Using the Retraining APIs, we can update the trained model of a predictive Web Service enabling scenarios such as periodic model retraining with new data or distribution of models to customers with the goal of letting them retrain the model using their own data.  

[1]: ./media/machine-learning-retrain-models-programmatically/machine-learning-retrain-models-programmatically-IMAGE01.png
[2]: ./media/machine-learning-retrain-models-programmatically/machine-learning-retrain-models-programmatically-IMAGE02.png
[3]: ./media/machine-learning-retrain-models-programmatically/machine-learning-retrain-models-programmatically-IMAGE03.png
[4]: ./media/machine-learning-retrain-models-programmatically/machine-learning-retrain-models-programmatically-IMAGE04.png
[5]: ./media/machine-learning-retrain-models-programmatically/machine-learning-retrain-models-programmatically-IMAGE05.png
[6]: ./media/machine-learning-retrain-models-programmatically/machine-learning-retrain-models-programmatically-IMAGE06.png
[7]: ./media/machine-learning-retrain-models-programmatically/machine-learning-retrain-models-programmatically-IMAGE07.png
