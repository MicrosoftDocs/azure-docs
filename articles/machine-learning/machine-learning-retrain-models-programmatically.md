<properties
	pageTitle="Retrain Machine Learning models programmatically | Microsoft Azure"
	description="Learn how to programmatically retrain a model and update the web service to use the newly trained model in Azure Machine Learning."
	services="machine-learning"
	documentationCenter=""
	authors="raymondlaghaeian"
	manager="jhubbard"
	editor="cgronlun"/>

<tags
	ms.service="machine-learning"
	ms.workload="data-services"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="08/23/2016"
	ms.author="raymondl;garye;v-donglo"/>


#Retrain Machine Learning models programmatically  

As part of the process of operationalization of machine learning models in Azure Machine Learning, your model is trained and saved. You then use it to create a predicative web service. The web service can then be consumed in web sites, dashboards, and mobile apps. 

Models you create using Machine Learning are typically not static. As new data becomes available or when the consumer of the API has their own data the model needs to be retrained. Or, you may need to apply filters obtain a subset of the data and retrain the model. 

Retraining may occur frequently. With the Programmatic Retraining API feature, you can programmatically retrain the model using the Retraining APIs and update the Web Service with the newly trained model. 

This document describes the retraining process, and shows you how to use the Retraining APIs.

## Why retrain: defining the problem  

As part of the ML training process, a model is trained using a set of data. Models you create using Machine Learning are typically not static. As new data becomes available or when the consumer of the API has their own data the model needs to be retrained. Additional scenarios may require you to apply filters obtain a subset of the data and retrain the model. 

In these scenarios, a programmatic API provides a convenient way to allow you or the consumer of your APIs to create a client that can, on a one-time or regular basis, retrain the model using their own data. They can then evaluate the results of retraining, and update the Web Service API to use the newly trained model.  

##How to retrain: the end to end process  

To start, the process involves the following components: a Training Experiment and a Predictive Experiment published as a Web Service. To enable retraining of a trained model, the Training Experiment must be published as a Web Service with the output of a trained model. This enables API access to the model for retraining. 

The process for setting up retraining involves the following steps:

![Retraining process overview][1]

Diagram 1: Retraining process overview  

## Create a Training Experiment
 
For this example, you will use "Sample 5: Train, Test, Evaluate for Binary Classification: Adult Dataset" from the Microsoft Azure Machine Learning samples. 
	
To create the experiment:

1.	Sign into to Microsoft Azure Machine Learning Studio. 
2.	On the bottom right corner of the dashboard, click **New**.
3.	From the Microsoft Samples, select Sample 5.
4.	To rename the experiment, at the top of the experiment canvas, select the experiment name "Sample 5: Train, Test, Evaluate for Binary Classification: Adult Dataset".
5.	Type Census Model.
6.	At the bottom of the experiment canvas, click **Run**.
7.	Click **Set Up Web Service** and select **Retraining Web Service**. 

 	![Initial experiment.][2]

Diagram 2: Initial experiment.

## Create a Scoring Experiment and publish as a Web Service  

Next you create a Predicative Experiment.

1.	At the bottom of the experiment canvas, click **Set Up Web Service** and select **Predictive Web Service**. This saves the model as a Trained Model and adds Web Service Input and Output modules. 
2.	Click **Run**. 
3.	After experiment has finished running, click **Deploy Web Service [Classic]**. This deploys the Predicative Experiment as a classic web service.

## Deploy the Training Experiment as a Training Web Service

To retrain the trained model, you must deploy the Training Experiment that you created as a Retraining Web Service. This Web Service will need a Web Service Output module connected to the [Train Model][train-model] module, to be able to produce new trained models.

1. To return to the training experiment, click the Experiments icon in the left pane, then click the experiment named Census Model. 
2. In the Search Experiment Items search box, type Web Service. 
3. Drag a Web Service Input module onto the experiment canvas and connect its output to the Clean Missing Data module. 
4. Drag two *Web Service Output* modules onto the experiment canvas. Connect the output of the *Train Model* module to one and the output of the *Evaluate Model* module to the other. The web service output for Train Model gives us the new trained model. The output attached to Evaluate Model returns that module’s Evaluate Model output.
5. Click **Run**. 
6. At the bottom of the experiment canvas, click **Set Up Web Service** and select **Retraining Web Service**. This deploys the Training Experiment as a web service that produces a trained model and model evaluation results. The Web Service **Dashboard** is displayed with the API Key and the API help page for Batch Execution. Only the Batch Execution method can be used for creating Trained Models. 
  
After experiment has completed running, the resulting workflow should look as follows:

![Resulting workflow after run.][4]

Diagram 3: Resulting workflow after run.

## Add a new Endpoint
 
The Predictive Web Service you deployed is the default scoring endpoint. Default endpoints are kept in sync with the original training and scoring experiments, and therefore the trained model for the default endpoint cannot be replaced. 

To create a new scoring endpoint, on the Predictive Web Service that can be updated with the trained model:

>[AZURE.NOTE] Be sure you are adding the endpoint to the Predictive Web Service, not the Training Web Service. If you have correctly deployed both a Training and a Predictive Web Service, you should see two separate web services listed. The Predictive Web Service should end with "[predictive exp.]".

1. Log in to the [Azure Classic Portal](https://manage.windowsazure.com).
2. In the left menu, click **Machine Learning**.
3. Under Name, click your workspace and then click **Web Services**.
4. Under Name, click **Census Model [predictive exp.]**.
5. At the bottom of the page, click **Add Endpoint**. For more information on adding endpoints, see [Creating Endpoints](machine-learning-create-endpoint.md). 

You can also add scoring endpoints using the sample code provided in this [github repository](https://github.com/raymondlaghaeian/AML_EndpointMgmt/blob/master/Program.cs).

## Retrain the model with new data using BES

To call the Retraining APIs:

1. Create a C# Console Application in Visual Studio (New->Project->Windows Desktop->Console Application).
2. Copy the sample C# code from the Training Web Service's API help page for batch execution and paste it into the Program.cs file, making sure the namespace remains intact.
3. The sample code has comments that indicate the parts of the code that you must update. 
4. When specifying the output location in the Request Payload, the extension of the file specified in *RelativeLocation* must be changed from csv to ilearner. See the following example.

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

>[AZURE.NOTE] The names of your output locations may be different from the ones in this walkthrough based on the order in which you added the web service output modules. Since you set up this Training Experiment with two outputs, the results include storage location information for both of them. 

### Update the Azure Storage information

The BES sample code uploads a file from a local drive (For example "C:\temp\CensusIpnput.csv") to Azure Storage, processes it, and writes the results back to Azure Storage.  

To accomplish this task, you must retrieve the Storage account name, key, and container information from the Azure Classic Portal for your Storage account and the update corresponding values in the code. 

You also must ensure the input file is available at the location you specify in the code.  

![Retraining output][6]

Diagram 4: Retraining output.

## Evaluate the Retraining Results
 
When you run the application, the output includes the URL and SAS token necessary to access the evaluation results.

You can see the performance results of the retrained model by combining the *BaseLocation*, *RelativeLocation*, and *SasBlobToken* from the output results for *output2* (as shown in the preceding retraining output image) and pasting the complete URL in the browser address bar.  

Examine the results to determine whether the newly trained model performs well enough to replace the existing one.

## Update the added endpoint’s Trained Model

To complete the retraining process, you must update the trained model of the new endpoint that you added.  

* If you added the new endpoint using the Azure portal, you can click the new endpoint's name in the Azure portal, then the **UpdateResource** link to get the URL you would need to update the endpoint's model. 
* If you added the endpoint using the sample code, this includes location of the help URL identified by the *HelpLocationURL* value in the output.

To retrieve the path URL:

1. Copy and paste the URL into your browser.
2. Click the Update Resource link. 
3. Copy the POST URL of the PATCH request. For example:

		PATCH URL: https://management.azureml.net/workspaces/00bf70534500b34rebfa1843d6/webservices/af3er32ad393852f9b30ac9a35b/endpoints/newendpoint2

You can now use the trained model to update the scoring endpoint that you created previously. 

The following sample code shows you how to use the *BaseLocation*, *RelativeLocation*, *SasBlobToken*, and PATCH URL to update the endpoint.

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

The *apiKey* and the *endpointUrl* for the call can be obtained from endpoint dashboard. 

The value of the *Name* parameter in *Resources* should match the Resource Name of the saved Trained Model in the Predictive Experiment. To get the Resource Name:

1. Log in to the [Azure Classic portal](https://manage.windowsazure.com).
2. In the left menu, click **Machine Learning**.
3. Under Name, click your workspace and then click **Web Services**.
4. Under Name, click **Census Model [predictive exp.]**.
5. Click the new endpoint you added.
6. On the endpoint dashboard, click *Update Resource*.
7. On the Update Resource API Documentation page for the web service, you can find the **Resource Name** under **Updatable Resources**.

If your SAS token expires before you finish updating the endpoint, you must perform a GET with the Job Id to obtain a fresh token.

When the code has successfully run, the new endpoint should start using the retrained model in approximately 30 seconds.  

##Summary  
Using the Retraining APIs, you can update the trained model of a predictive Web Service enabling scenarios such as:

* Periodic model retraining with new data.
* Distribution of a model to customers with the goal of letting them retrain the model using their own data.  

## Next steps
[Troubleshooting the retraining of an Azure Machine Learning classic web service](machine-learning-troubleshooting-retraining-models.md)

[1]: ./media/machine-learning-retrain-models-programmatically/machine-learning-retrain-models-programmatically-IMAGE01.png
[2]: ./media/machine-learning-retrain-models-programmatically/machine-learning-retrain-models-programmatically-IMAGE02.png
[3]: ./media/machine-learning-retrain-models-programmatically/machine-learning-retrain-models-programmatically-IMAGE03.png
[4]: ./media/machine-learning-retrain-models-programmatically/machine-learning-retrain-models-programmatically-IMAGE04.png
[5]: ./media/machine-learning-retrain-models-programmatically/machine-learning-retrain-models-programmatically-IMAGE05.png
[6]: ./media/machine-learning-retrain-models-programmatically/machine-learning-retrain-models-programmatically-IMAGE06.png


<!-- Module References -->
[train-model]: https://msdn.microsoft.com/library/azure/5cc7053e-aa30-450d-96c0-dae4be720977/
