<properties
pageTitle="Create multiple models from one experiment | Microsoft Azure"
description="Use PowerShell to create multiple Machine Learning models and web service endpoints with the same algorithm but different training datasets."
services="machine-learning"
documentationCenter=""
authors="hning86"
manager="paulettm"
editor="cgronlun"/>

<tags
ms.service="machine-learning"
ms.workload="data-services"
ms.tgt_pltfrm="na"
ms.devlang="na"
ms.topic="article"
ms.date="05/12/2016"
ms.author="garye;haining"/>

# Create many Machine Learning models and web service endpoints from one experiment using PowerShell

Here's a common machine learning problem: You want to create many models that have the same training workflow and use the same algorithm, but have different training datasets as input. This article shows you how to do this at scale in Azure Machine Learning Studio using just a single experiment.

For example, let's say you own a global bike rental franchise business. You want to build a regression model to predict the rental demand based on historic data. You have 1,000 rental locations across the world and you've collected a dataset for each location that includes important features such as date, time, weather, and traffic that are specific to each location.

You could train your model once using a merged version of all the datasets across all locations. But because each of your locations has a unique environment, a better approach would be to train your regression model separately using the dataset for each location. That way, each trained model could take into account the different store sizes, volume, geography, population, bike-friendly traffic environment, *etc.*.

That may be the best approach, but you don't want to create 1,000 training experiments in Azure Machine Learning with each one representing a unique location. Besides being an overwhelming task, it's also seems pretty inefficient since each experiment would have all the same components except for the training dataset.

Fortunately, we can accomplish this by using the [Azure Machine Learning retraining API](machine-learning-retrain-models-programmatically.md) and automating the task with [Azure Machine Learning PowerShell](https://blogs.technet.microsoft.com/machinelearning/2016/05/04/announcing-the-powershell-module-for-azure-ml/).

> [AZURE.NOTE] To make our sample run faster, we'll reduce the number of locations from 1,000 to 10. But the same principles and procedures apply to 1,000 locations. The only difference is that if you want to train from 1,000 datasets you probably want to think of running the following PowerShell scripts in parallel. How to do that is beyond the scope of this article, but you can find examples of PowerShell multi-threading on the Internet.  

## Set up the training experiment

We're going to use an example [training experiment](https://gallery.cortanaintelligence.com/Experiment/Bike-Rental-Training-Experiment-1) that we've already created in the [Cortana Intelligence Gallery](http://gallery.cortanaintelligence.com). Open this experiment in your [Azure Machine Learning Studio](https://studio.azureml.net) workspace.

>[AZURE.NOTE] In order to follow along with this example, you may want to use a standard workspace rather than a free workspace. We'll be creating one endpoint for each customer - for a total of 10 endpoints - and that will require a standard workspace since a free workspace is limited to 3 endpoints. If you only have a free workspace, just modify the scripts below to allow for only 3 locations.

The experiment uses an **Import Data** module to import the training dataset *customer001.csv* from an Azure storage account. Let's assume we have collected training datasets from all bike rental locations and stored them in the same blob storage location with file names ranging from *rentalloc001.csv* to *rentalloc10.csv*.

![image](./media/machine-learning-create-models-and-endpoints-with-powershell/reader-module.png)

Note that a **Web Service Output** module has been added to the **Train Model** module.
When this experiment is deployed as a web service, the endpoint associated with that output will return the trained model in the format of a .ilearner file.

Also note that we set up a web service parameter for the URL that the **Import Data** module uses. This allows us to use the parameter to specify individual training datasets to train the model for each location.
There are other ways we could have done this, such as using a SQL query with a web service parameter to get data from a SQL Azure database, or simply using a  **Web Service Input** module to pass in a dataset to the web service.

![image](./media/machine-learning-create-models-and-endpoints-with-powershell/web-service-output.png)

Now, let's run this training experiment using the default value *rental001.csv* as the training dataset. If you view the output of the **Evaluate** module (click the output and select **Visualize**), you can see we get a decent performance of *AUC* = 0.91. At this point, we're ready to deploy a web service out of this training experiment.

## Deploy the training and scoring web services

To deploy the training web service, click the **Set Up Web Service** button below the experiment canvas and select **Deploy Web Service**. Call this web service ""Bike Rental Training".

Now we need to deploy the scoring web service.
To do this, we can click **Set Up Web Service** below the canvas and select **Predictive Web Service**. This creates a scoring experiment.
We'll need to make a few minor adjustments to make it work as a web service, such as removing the label column "cnt" from the input data and limiting the output to only the instance id and the corresponding predicted value.

To save yourself that work, you can simply open the [predictive experiment](https://gallery.cortanaintelligence.com/Experiment/Bike-Rental-Predicative-Experiment-1) in the Gallery that's already been prepared.

To deploy the web service, run the predictive experiment, then click the **Deploy Web Service** button below the canvas. Name the scoring web service "Bike Rental Scoring"".

## Create 10 identical web service endpoints with PowerShell

This web service comes with a default endpoint. But we're not as interested in the default endpoint since it can't be updated. What we need to do is to create 10 additional endpoints, one for each location. We'll do this with PowerShell.

First, we set up our PowerShell environment:

	Import-Module .\AzureMLPS.dll
	# Assume the default configuration file exists and is properly set to point to the valid Workspace.
	$scoringSvc = Get-AmlWebService | where Name -eq 'Bike Rental Scoring'
	$trainingSvc = Get-AmlWebService | where Name -eq 'Bike Rental Training'

Then, run the following PowerShell command:

	# Create 10 endpoints on the scoring web service.
	For ($i = 1; $i -le 10; $i++){
	    $seq = $i.ToString().PadLeft(3, '0');
	    $endpointName = 'rentalloc' + $seq;
	    Write-Host ('adding endpoint ' + $endpointName + '...')
	    Add-AmlWebServiceEndpoint -WebServiceId $scoringSvc.Id -EndpointName $endpointName -Description $endpointName     
	}

Now we've created 10 endpoints and they all contain the same trained model trained on *customer001.csv*. You can view them in the Azure Management Portal.

![image](./media/machine-learning-create-models-and-endpoints-with-powershell/created-endpoints.png)

## Update the endpoints to use separate training datasets using PowerShell

The next step is to update the endpoints with models uniquely trained on each customer's individual data. But first we need to produce these models from the **Bike Rental Training** web service. Let's go back to the **Bike Rental Training** web service. We need to call its BES endpoint 10 times with 10 different training datasets in order to produce 10 different models. We'll use the **InovkeAmlWebServiceBESEndpoint** PowerShell cmdlet to do this.

You will also need to provide credentials for your blob storage account into `$configContent`, namely, at the fields `AccountName`, `AccountKey` and `RelativeLocation`. The `AccountName` can be one of your account names, as seen in the **Classic Azure Management Portal** (*Storage* tab). Once you click on a storage account, its `AccountKey` can be found by pressing the **Manage Access Keys** button at the bottom and copying the *Primary Access Key*. The `RelativeLocation` is the path relative to your storage where a new model will be stored. For instance, the path `hai/retrain/bike_rental/` in the script below points to a container named `hai`, and `/retrain/bike_rental/` are subfolders. Currently, you cannot create subfolders through the portal UI, but there are [several Azure Storage Explorers](../storage/storage-explorers.md) that allow you to do so. It is recommended that you create a new container in your storage to store the new trained models (.ilearner files) as follows: from your storage page, click on the **Add** button at the bottom and name it `retrain`. In summary, the necassary changes to the script below pertain to `AccountName`, `AccountKey` and `RelativeLocation` (:`"retrain/model' + $seq + '.ilearner"`).

	# Invoke the retraining API 10 times
	# This is the default (and the only) endpoint on the training web service
	$trainingSvcEp = (Get-AmlWebServiceEndpoint -WebServiceId $trainingSvc.Id)[0];
	$submitJobRequestUrl = $trainingSvcEp.ApiLocation + '/jobs?api-version=2.0';
	$apiKey = $trainingSvcEp.PrimaryKey;
	For ($i = 1; $i -le 10; $i++){
	    $seq = $i.ToString().PadLeft(3, '0');
	    $inputFileName = 'https://bostonmtc.blob.core.windows.net/hai/retrain/bike_rental/BikeRental' + $seq + '.csv';
	    $configContent = '{ "GlobalParameters": { "URI": "' + $inputFileName + '" }, "Outputs": { "output1": { "ConnectionString": "DefaultEndpointsProtocol=https;AccountName=<myaccount>;AccountKey=<mykey>", "RelativeLocation": "hai/retrain/bike_rental/model' + $seq + '.ilearner" } } }';
	    Write-Host ('training regression model on ' + $inputFileName + ' for rental location ' + $seq + '...');
	    Invoke-AmlWebServiceBESEndpoint -JobConfigString $configContent -SubmitJobRequestUrl $submitJobRequestUrl -ApiKey $apiKey
	}

>[AZURE.NOTE] The BES endpoint is the only supported mode for this operation. RRS cannot be used for producing trained models.

As you can see above, instead of constructing 10 different BES job configuration json files, we dynamically create the config string instead and feed it to the *jobConfigString* parameter of the **InvokeAmlWebServceBESEndpoint** cmdlet, since there is really no need to keep a copy on disk.

If everything goes well, after a while you should see 10 .ilearner files, from *model001.ilearner* to *model010.ilearner*, in your Azure storage account. Now we're ready to update our 10 scoring web service endpoints with these models using the **Patch-AmlWebServiceEndpoint** PowerShell cmdlet. Remember again that we can only patch the non-default endpoints we programmatically created earlier.

	# Patch the 10 endpoints with respective .ilearner models
	$baseLoc = 'http://bostonmtc.blob.core.windows.net/'
	$sasToken = '<my_blob_sas_token>'
	For ($i = 1; $i -le 10; $i++){
	    $seq = $i.ToString().PadLeft(3, '0');
	    $endpointName = 'rentalloc' + $seq;
	    $relativeLoc = 'hai/retrain/bike_rental/model' + $seq + '.ilearner';
	    Write-Host ('Patching endpoint ' + $endpointName + '...');
	    Patch-AmlWebServiceEndpoint -WebServiceId $scoringSvc.Id -EndpointName $endpointName -ResourceName 'Bike Rental [trained model]' -BaseLocation $baseLoc -RelativeLocation $relativeLoc -SasBlobToken $sasToken
	}

This should run fairly quickly. When the execution finishes, we'll have successfully created 10 predictive web service endpoints, each containing a trained model uniquely trained on the dataset specific to a rental location, all from a single training experiment. To verify this, you can try calling these endpoints using the **InvokeAmlWebServiceRRSEndpoint** cmdlet, providing them with the same input data, and you should expect to see different prediction results since the models are trained with different training sets.

## Full PowerShell script

Here's the listing of the full source code:

	Import-Module .\AzureMLPS.dll
	# Assume the default configuration file exists and properly set to point to the valid workspace.
	$scoringSvc = Get-AmlWebService | where Name -eq 'Bike Rental Scoring'
	$trainingSvc = Get-AmlWebService | where Name -eq 'Bike Rental Training'

	# Create 10 endpoints on the scoring web service
	For ($i = 1; $i -le 10; $i++){
	    $seq = $i.ToString().PadLeft(3, '0');
	    $endpointName = 'rentalloc' + $seq;
	    Write-Host ('adding endpoint ' + $endpontName + '...')
	    Add-AmlWebServiceEndpoint -WebServiceId $scoringSvc.Id -EndpointName $endpointName -Description $endpointName     
	}

	# Invoke the retraining API 10 times to produce 10 regression models in .ilearner format
	$trainingSvcEp = (Get-AmlWebServiceEndpoint -WebServiceId $trainingSvc.Id)[0];
	$submitJobRequestUrl = $trainingSvcEp.ApiLocation + '/jobs?api-version=2.0';
	$apiKey = $trainingSvcEp.PrimaryKey;
	For ($i = 1; $i -le 10; $i++){
	    $seq = $i.ToString().PadLeft(3, '0');
	    $inputFileName = 'https://bostonmtc.blob.core.windows.net/hai/retrain/bike_rental/BikeRental' + $seq + '.csv';
	    $configContent = '{ "GlobalParameters": { "URI": "' + $inputFileName + '" }, "Outputs": { "output1": { "ConnectionString": "DefaultEndpointsProtocol=https;AccountName=<myaccount>;AccountKey=<mykey>", "RelativeLocation": "hai/retrain/bike_rental/model' + $seq + '.ilearner" } } }';
	    Write-Host ('training regression model on ' + $inputFileName + ' for rental location ' + $seq + '...');
	    Invoke-AmlWebServiceBESEndpoint -JobConfigString $configContent -SubmitJobRequestUrl $submitJobRequestUrl -ApiKey $apiKey
	}

	# Patch the 10 endpoints with respective .ilearner models
	$baseLoc = 'http://bostonmtc.blob.core.windows.net/'
	$sasToken = '?test'
	For ($i = 1; $i -le 10; $i++){
	    $seq = $i.ToString().PadLeft(3, '0');
	    $endpointName = 'rentalloc' + $seq;
	    $relativeLoc = 'hai/retrain/bike_rental/model' + $seq + '.ilearner';
	    Write-Host ('Patching endpoint ' + $endpointName + '...');
	    Patch-AmlWebServiceEndpoint -WebServiceId $scoringSvc.Id -EndpointName $endpointName -ResourceName 'Bike Rental [trained model]' -BaseLocation $baseLoc -RelativeLocation $relativeLoc -SasBlobToken $sasToken
	}
