<properties
	pageTitle="Retrain an existing Predictive Web service | Microsoft Azure"
	description="Learn how to retrain a model and update the Web service to use the newly trained model in Azure Machine Learning."
	services="machine-learning"
	documentationCenter=""
	authors="vDonGlover"
	manager="raymondl"
	editor=""/>

<tags
	ms.service="machine-learning"
	ms.workload="data-services"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="10/06/2016"
	ms.author="v-donglo"/>


# Retrain an existing Predictive Web service

This document describes the retraining process for the following scenario:

* You have a training experiment and a predictive experiment which you have deployed as an operationalized web service.
* You have new data that you want your predictive web service to use the new date to perform it's scoring.

Starting with your existing Web service and experiments you need to:

1. Update the model
	1. Modify your Training Experiment to allow for Web service inputs and outputs.
	2. Deploy the Training Experiment as Retraining Web service.
	3. Use the Training Experiment's Batch Execution Service to retrain the model.
	4. Use the Machine 
2. Use the Machine Learning Management PowerShell cmdlets to update the Predictive Experiment
	1.	Sign in to your Azure Resource Manager account.
	2.	Get the Web service definition
	3.	Export the Web Service Definition as JSON
	4.	Update the reference to the ilearner blob in the JSON.
	5.	Import the JSON into a Web Service Definition
	6.	Update the Web service with new Web Service Definition

## Deploy the Training Experiment

To be deployed as a Retraining Web service, you must add Web service inputs and outputs to the model.  Connecting a *Web Service Output* module to the experiments *[Train Model][train-model]* module, enables it to produce a new trained model that you can use in your Predictive Experiment. If you have an Evaluate Model module, you can also attach a web service output to get the evaluation results as output.

To update your Training Experiment:

* Connect a *Web Service Input* module to your data input, for example a *Clean Missing Data* module. Typically, you want to ensure that your input data is processed the same way as your original training data.
* Connect a *Web Service Output* module to the output of your **Train Model** module. 
* If you have an Evaluate Model module and you want to output the evaluation results, connect a *Web Service Output* module to the output of your **Evaluate Model** module.

Run your experiment.

Next you must deploy the Training Experiment as a web service that produces a trained model and model evaluation results.  

At the bottom of the experiment canvas, click **Set Up Web Service** and select **Deploy Web Service [New]**. The Web Service Azure Machine Learning Web Services portal opens to the Deploy Web service page. Type a name for your Web service and choose a payment plan, then click **Deploy**. Only the Batch Execution method can be used for creating Trained Models

The resulting workflow should similar to the following:

![Resulting workflow after run.][4]

Diagram 1: Resulting workflow after run.

## Retrain the model with new data using BES

For this example, we are using C# to create the retraining application. You can also use the Python or R sample code to accomplish this task.

To call the Retraining APIs:

1. Create a C# Console Application in Visual Studio (New->Project->Windows Desktop->Console Application).
2.	Sign in to the Machine Learning Web Service portal.
3.	Click the Web service you are working with.
2.	Click **Consume**.
3.	At the bottom of the Consume page, in the **Sample Code** section, click **Batch**.
5.	Copy the sample C# code for batch execution and paste it into the Program.cs file, making sure the namespace remains intact.

Add the Nuget package Microsoft.AspNet.WebApi.Client as specified in the comments. To add the reference to Microsoft.WindowsAzure.Storage.dll, you might first need to install the client library for Microsoft Azure storage services. For more information, see [Windows Storage Services](https://www.nuget.org/packages/WindowsAzure.Storage).

![Consume page][1]

Diagram 3: Consume page in the Azure Machine Learning Web Services portal

### Update the apikey declaration

Locate the **apikey** declaration.

	const string apiKey = "abc123"; // Replace this with the API key for the web service

In the **Basic consumption info** section of the **Consume** page, locate the primary key and copy it to the **apikey** declaration.

### Update the Azure Storage information

The BES sample code uploads a file from a local drive (For example "C:\temp\CensusIpnput.csv") to Azure Storage, processes it, and writes the results back to Azure Storage.  

To accomplish this task, you must retrieve the Storage account name, key, and container information for your Storage account from the classic Azure portal and the update corresponding values in the code. 

1. Sign in to the classic Azure portal.
1. In the left navigation column, click **Storage**.
1. From the list of storage accounts, select one to store the retrained model.
1. At the bottom of the page, click **Manage Access Keys**.
1. Copy and save the **Primary Access Key** and close the dialog. 
1. At the top of the page, click **Containers**.
1. Select an existing container or create a new one and save the name.

Locate the *StorageAccountName*, *StorageAccountKey*, and *StorageContainerName* declarations and update the values you saved from the Azure portal.

    const string StorageAccountName = "mystorageacct"; // Replace this with your Azure Storage Account name
    const string StorageAccountKey = "a_storage_account_key"; // Replace this with your Azure Storage Key
    const string StorageContainerName = "mycontainer"; // Replace this with your Azure Storage Container name
            
You also must ensure the input file is available at the location you specify in the code. 

### Specify the output location

When specifying the output location in the Request Payload, the extension of the file specified in *RelativeLocation* must be specified as ilearner. See the following example.

    Outputs = new Dictionary<string, AzureBlobDataReference>() {
        {
            "output1",
            new AzureBlobDataReference()
            {
                ConnectionString = storageConnectionString,
                RelativeLocation = string.Format("{0}/output1results.ilearner", StorageContainerName) /*Replace this with the location you would like to use for your output file, and valid file extension (usually .csv for scoring results, or .ilearner for trained models)*/
            }
        },
 

![Retraining output][6]

Diagram 3: Retraining output.

## Evaluate the Retraining Results
 
When you run the application, the output includes the URL and SAS token necessary to access the evaluation results.

You can see the performance results of the retrained model by combining the *BaseLocation*, *RelativeLocation*, and *SasBlobToken* from the output results for *output2* (as shown in the preceding retraining output image) and pasting the complete URL in the browser address bar.  

Examine the results to determine whether the newly trained model performs well enough to replace the existing one.

Copy the *BaseLocation*, *RelativeLocation*, and *SasBlobToken* from the output results.

## Retrain the Web service

When you retrain a New Web service, you update the predictive Web service definition to reference the new trained model.  

## Sign in to Azure Resource Manager 

You must first sign in to your Azure account from within the PowerShell environment using the [Add-AzureRmAccount](https://msdn.microsoft.com/library/mt619267.aspx) cmdlet. 

## Get the Web Service Definition

Next, get the Web Service by calling the [Get-AzureRmMlWebService](https://msdn.microsoft.com/library/mt619267.aspx) cmdlet. The Web Service Definition is an internal representation of the trained model of the Web service and is not directly modifiable. Make sure that you are retrieving the Web Service Definition for your Predictive experiment and not your Training Experiment.

	$wsd = Get-AzureRmMlWebService -Name 'RetrainSamplePre.2016.8.17.0.3.51.237' -ResourceGroupName 'Default-MachineLearning-SouthCentralUS'

To determine the resource group name of an existing web service, run the Get-AzureRmMlWebService cmdlet without any parameters to display the web services in your subscription. Locate the web service, and then look at its web service ID. The name of the resource group is the fourth element in the ID, just after the *resourceGroups* element. In the following example, the resource group name is Default-MachineLearning-SouthCentralUS.

	Properties : Microsoft.Azure.Management.MachineLearning.WebServices.Models.WebServicePropertiesForGraph 
	Id : /subscriptions/<subscription ID>/resourceGroups/Default-MachineLearning-SouthCentralUS/providers/Microsoft.MachineLearning/webServices/RetrainSamplePre.2016.8.17.0.3.51.237 
	Name : RetrainSamplePre.2016.8.17.0.3.51.237 
	Location : South Central US 
	Type : Microsoft.MachineLearning/webServices 
	Tags : {} 

Alternatively, to determine the resource group name of an existing web service, log on to the Microsoft Azure Machine Learning Web Services portal. Select the web service. The resource group name is the fifth element of the URL of the web service, just after the *resourceGroups* element. In the following example, the resource group name is Default-MachineLearning-SouthCentralUS.

	https://services.azureml.net/subscriptions/<subcription ID>/resourceGroups/Default-MachineLearning-SouthCentralUS/providers/Microsoft.MachineLearning/webServices/RetrainSamplePre.2016.8.17.0.3.51.237 


## Export the Web Service Definition as JSON

To modify the definition to the trained model to use the newly Trained Model, you must first use the [Export-AzureRmMlWebService](https://msdn.microsoft.com/library/azure/mt767935.aspx) cmdlet to export it to a JSON format file.
  
	Export-AzureRmMlWebService -WebService $wsd -OutputFile "C:\temp\mlservice_export.json"

## Update the reference to the ilearner blob

In the assets, locate the [trained model], update the *uri* value in the *locationInfo* node with the URI of the ilearner blob. The URI is generated by combining the *BaseLocation* and the *RelativeLocation* from the output of the BES retraining call.

     "asset3": {
        "name": "Retrain Samp.le [trained model]",
        "type": "Resource",
        "locationInfo": {
          "uri": "https://mltestaccount.blob.core.windows.net/azuremlassetscontainer/baca7bca650f46218633552c0bcbba0e.ilearner"
        },
        "outputPorts": {
          "Results dataset": {
            "type": "Dataset"
          }
        }
      },

## Import the JSON into a Web Service Definition

You must use the [Import-AzureRmMlWebService](https://msdn.microsoft.com/library/azure/mt767925.aspx) cmdlet to convert the modified JSON file back into a Web Service Definition that you can use to update the Predicative Experiment.

	$wsd = Import-AzureRmMlWebService -InputFile "C:\temp\mlservice_export.json"


## Update the Web service

Finally, you use [Update-AzureRmMlWebService](https://msdn.microsoft.com/library/azure/mt767922.aspx) cmdlet to update the Predictive experiment.

	Update-AzureRmMlWebService -Name 'RetrainSamplePre.2016.8.17.0.3.51.237' -

[1]: ./media/machine-learning-retrain-existing-arm-web-service/machine-learning-retrain-models-consume-page.png
[4]: ./media/machine-learning-retrain-existing-arm-web-service/machine-learning-retrain-models-programmatically-IMAGE04.png
[6]: ./media/machine-learning-retrain-existing-arm-web-service/machine-learning-retrain-models-programmatically-IMAGE06.png

<!-- Module References -->
[train-model]: https://msdn.microsoft.com/library/azure/5cc7053e-aa30-450d-96c0-dae4be720977/