<properties
	pageTitle="Retrain Machine Learning models programmatically | Microsoft Azure"
	description="Learn how to programmatically retrain a model and update the web service to use the newly trained model in Azure Machine Learning."
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
	ms.date="05/23/2016"
	ms.author="raymondl;garye"/>


#Retrain Machine Learning models programmatically  

As part of the process of operationalization of machine learning models in Azure Machine Learning, a model needs to be trained and saved, then used to create a predictive web service. The web service can then be consumed in web sites, dashboards, and mobile apps.  

Frequently, you need to retrain the model created in the first step with new data. Previously, this was only possible through the Azure ML UI, but with the introduction of the Programmatic Retraining API feature, you now can retrain the model and update the Web Service with the newly trained model, programmatically using the Retraining APIs.

This document describes the above process, and shows how to use the Retraining APIs.

[AZURE.INCLUDE [machine-learning-free-trial](../../includes/machine-learning-free-trial.md)]  


##Why retrain: defining the problem  
As part of the ML training process, a model is trained using a set of data. The models needs to be retrained in scenarios where new data becomes available, or when the consumer of the API has their own data to train the model, or when the data needs to be filtered and the model trained with the subset of data, etc.  

In these scenarios, a programmatic API provides a convenient way to allow you or the consumer of your APIs to create a client that can, on a one-time or regular basis, retrain the model using their own data. They can then evaluate the results of retraining, and update the Web Service API to use the newly trained model.  

##How to retrain: the end to end process  
To start, the process involves the following components: a Training Experiment and a Predictive Experiment published as a Web Service. To enable retraining of a trained model, the Training Experiment has to also be published as a Web Service with the output of a trained model. This enables API access to the model for retraining. The process for setting up retraining involves the following steps:  

![][1]

Diagram 1: Retraining process overview  

1. *Create a Training Experiment*  
	We will be using experiment “Sample 5 (Train, Test, Evaluate for Binary Classification: Adult Dataset)” from the Azure ML sample experiments for this example. As you will see below, I have simplified the sample by removing some modules. I have also named the experiment “Census Model”.

 	![][2]

	With these pieces in place, we can now click Run on the bottom of the screen to run this experiment.  
2. *Create a Scoring Experiment and publish as a Web Service*  

	![][3]

	After experiment run is completed, we click on Create Predictive Experiment. This creates a Predictive Experiment, saves the model as a Trained Model and adds Web Service Input and Output modules as shown below. Next, we click Run.  

	After experiment run is completed, clicking on “Publish Web Service” will publish the Predictive Experiment as a Web Service and create a default endpoint. The trained model in this webservice is updatable, as shown below. The details for this endpoint will then show up on the screen.
3. *Publish the Training Experiment as a Web Service*:
	To re-train the trained model, we need to publish the Training Experiment we created in step 1 above as a Web Service. This Web Service will need a Web Service Output module connected to the [Train Model][train-model] module, to be able to produce new trained models.
Click on the Experiments icon in the left pane, then click on the experiment called Census Model to go back to the training experiment.  

	We then add one Web Service Input and two Web Service Output modules to the workflow. The Web Service output for Train Model will give us the new trained model. The output attached to Evaluate Model will return that module’s Evaluate Model output.

	We can now click Run. After experiment has completed running, the resulting workflow should look as below:

	![][4]

	We next click on the Deploy Web Service button, then click Yes. This will deploy the Training Experiment as a Web Service that produces a trained model and model evaluation results. The Web Service Dashboard will be displayed with the API Key and the API help page for Batch Execution. Note that only the Batch Execution method can be used for creating Trained Models.  
4. *Add a new Endpoint*  
	The Predictive Web Service we published in Step 2 above is the default scoring endpoint. The default endpoints are kept in sync with the original training and scoring experiments, and therefore a default endpoint's trained model cannot be replaced.
To create a new scoring endpoint with an update-able model, visit the Azure Classic Portal and click on Add Endpoint (more details [here](machine-learning-create-endpoint.md)).
You can also add scoring endpoints using the sample code provided [here](https://github.com/raymondlaghaeian/AML_EndpointMgmt/blob/master/Program.cs).

5. *Retrain the model with new data and BES*  
	To call the Retraining APIs, we create a new C# Console Application in Visual Studio (New->Project->Windows Desktop->Console Application).  

	We then copy the sample C# code from the Training Web Service's API help page for batch execution (created in Step 3 above) and paste it into the Program.cs file, making sure the namespace remains intact.  

	Note that sample code has comments which indicate parts of the code that need updates.
	Also, when specifiying the "output1" location in the Reqeust Payload, the file extention of the "RelativeLocation" has to be changed to an ".ilearner" as in:

	```c#
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
	```
	1. Provide Azure Storage info
The sample code for BES will upload a file from a local drive (e.g. “C:\temp\CensusIpnput.csv”) to Azure Storage, process it, and write the results back to Azure Storage.  

		To accomplish that, you need to retrieve the Storage account name, key, and container information from the Azure Classic Portal for your Storage account and the update the code here. You also need to ensure the input file is available at the location you specify in the code.  

		We had set up this Training Experiment with two outputs, so the results will include storage location information for both of them, as seen below. “output1” is the output of the Trained Model, “output2” the output of Evaluate Model.  Also note that the file extention of the Output for the Trained Model (Output1) is ".ilearner" and not ".csv".

		![][6]

6. *Evaluate the Retraining Results*  
	Using the combination of the BaseLocation, RelativeLocation and SasBlobToken from the above output results for “output2” we can see the performance results of the retrained model by pasting the complete URL in the browser address bar.  

	This will tell us if the newly trained model performs well enough to replace the existing one.

7. *Update the added endpoint’s Trained Model*  
	To complete the process, we need to update the trained model of the predictive (scoring) endpoint we created in Step 4 above.  

	(If you added the new endpoint using the Azure Portal, you can click on the new endpoint's name, then the UpdateResource link to get the URL you would need to update the endpoint's model. If you added the endpoint using code, the output of that call will have the endpoint URL.)

	The BES output above shows the information for the result of retraining for “output1” which contains the retrained model location information. We now need to take this trained model and update the scoring endpoint (created  in step 4 above). Sample code follows:

	```C#
	private async Task OverwriteModel()
	{
		var resourceLocations = new
		{
			Resources = new[]
			{
				new
				{
					Name = "Census Model [trained model]",
					Location = new AzureBlobDataReference()
					{
						BaseLocation = "https://esintussouthsus.blob.core.windows.net/",
						RelativeLocation = "your endpoint relative location", //from the output, for example: “experimentoutput/8946abfd-79d6-4438-89a9-3e5d109183/8946abfd-79d6-4438-89a9-3e5d109183.ilearner”
						SasBlobToken = "your endpoint SAS blob token" //from the output, for example: “?sv=2013-08-15&sr=c&sig=37lTTfngRwxCcf94%3D&st=2015-01-30T22%3A53%3A06Z&se=2015-01-31T22%3A58%3A06Z&sp=rl”
					}
				}
			}
		};

		using (var client = new HttpClient())
		{
			client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);

			using (var request = new HttpRequestMessage(new HttpMethod("PATCH"), endpointUrl))
			{
				request.Content = new StringContent(JsonConvert.SerializeObject(resourceLocations), System.Text.Encoding.UTF8, "application/json");
				HttpResponseMessage response = await client.SendAsync(request);

				if (!response.IsSuccessStatusCode)
				{
					await WriteFailedResponse(response);
				}

				// Do what you want with a successful response here.
			}
		}
	}
	```

	The “apiKey” and the “endpointUrl” for this call are visible on the endpoint dashboard. The "Name" parameter in Resources should match the name of the Saved Trained Model in the Predictive Experiment.
	
	Note that the SAS token expires after 1 hour (55 minutes). You would need to do a GET with the Job Id to get a fresh token.

	With the success of this call, the new endpoint will start using a retrained model approximately within 15 seconds.  

##Summary  
Using the Retraining APIs, we can update the trained model of a predictive Web Service enabling scenarios such as periodic model retraining with new data or distribution of models to customers with the goal of letting them retrain the model using their own data.  

[1]: ./media/machine-learning-retrain-models-programmatically/machine-learning-retrain-models-programmatically-IMAGE01.png
[2]: ./media/machine-learning-retrain-models-programmatically/machine-learning-retrain-models-programmatically-IMAGE02.png
[3]: ./media/machine-learning-retrain-models-programmatically/machine-learning-retrain-models-programmatically-IMAGE03.png
[4]: ./media/machine-learning-retrain-models-programmatically/machine-learning-retrain-models-programmatically-IMAGE04.png
[5]: ./media/machine-learning-retrain-models-programmatically/machine-learning-retrain-models-programmatically-IMAGE05.png
[6]: ./media/machine-learning-retrain-models-programmatically/machine-learning-retrain-models-programmatically-IMAGE06.png


<!-- Module References -->
[train-model]: https://msdn.microsoft.com/library/azure/5cc7053e-aa30-450d-96c0-dae4be720977/
