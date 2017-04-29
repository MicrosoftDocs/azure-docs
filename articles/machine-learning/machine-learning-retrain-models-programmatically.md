---
title: Retrain Machine Learning models programmatically | Microsoft Docs
description: Learn how to programmatically retrain a model and update the web service to use the newly trained model in Azure Machine Learning.
services: machine-learning
documentationcenter: ''
author: raymondlaghaeian
manager: jhubbard
editor: cgronlun

ms.assetid: 7ae4f977-e6bf-4d04-9dde-28a66ce7b664
ms.service: machine-learning
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/19/2017
ms.author: raymondl;garye;v-donglo

---
# Retrain Machine Learning models programmatically
In this walkthrough, you will learn how to programmatically retrain an Azure Machine Learning Web Service using C# and the Machine Learning Batch Execution service.

Once you have retrained the model, the following walkthroughs show how to update the model in your predictive web service:

* If you deployed a Classic web service in the Machine Learning Web Services portal, see [Retrain a Classic web service](machine-learning-retrain-a-classic-web-service.md). 
* If you deployed a New web service, see [Retrain a New web service using the Machine Learning Management cmdlets](machine-learning-retrain-new-web-service-using-powershell.md).

For an overview of the retraining process, see [Retrain a Machine Learning Model](machine-learning-retrain-machine-learning-model.md).

If you want to start with your existing New Azure Resource Manager based web service, see [Retrain an existing Predictive web service](machine-learning-retrain-existing-resource-manager-based-web-service.md).

## Create a training experiment
For this example, you will use "Sample 5: Train, Test, Evaluate for Binary Classification: Adult Dataset" from the Microsoft Azure Machine Learning samples. 

To create the experiment:

1. Sign into to Microsoft Azure Machine Learning Studio. 
2. On the bottom right corner of the dashboard, click **New**.
3. From the Microsoft Samples, select Sample 5.
4. To rename the experiment, at the top of the experiment canvas, select the experiment name "Sample 5: Train, Test, Evaluate for Binary Classification: Adult Dataset".
5. Type Census Model.
6. At the bottom of the experiment canvas, click **Run**.
7. Click **Set Up web service** and select **Retraining web service**. 

The following shows the initial experiment.
   
   ![Initial experiment.][2]


## Create a predictive experiment and publish as a web service
Next you create a Predicative Experiment.

1. At the bottom of the experiment canvas, click **Set Up Web Service** and select **Predictive Web Service**. This saves the model as a Trained Model and adds web service Input and Output modules. 
2. Click **Run**. 
3. After the experiment has finished running, click **Deploy Web Service [Classic]** or **Deploy Web Service [New]**.

> [!NOTE] 
> To deploy a New web service you must have sufficient permissions in the subscription to which you deploying the web service. For more information see, [Manage a Web service using the Azure Machine Learning Web Services portal](machine-learning-manage-new-webservice.md). 

## Deploy the training experiment as a Training web service
To retrain the trained model, you must deploy the training experiment that you created as a Retraining web service. This web service needs a *Web Service Output* module connected to the *[Train Model][train-model]* module, to be able to produce new trained models.

1. To return to the training experiment, click the Experiments icon in the left pane, then click the experiment named Census Model.  
2. In the Search Experiment Items search box, type web service. 
3. Drag a *Web Service Input* module onto the experiment canvas and connect its output to the *Clean Missing Data* module.  This ensures that your retraining data is processed the same way as your original training data.
4. Drag two *web service Output* modules onto the experiment canvas. Connect the output of the *Train Model* module to one and the output of the *Evaluate Model* module to the other. The web service output for **Train Model** gives us the new trained model. The output attached to **Evaluate Model** returns that module’s output, which is the performance results.
5. Click **Run**. 

Next you must deploy the training experiment as a web service that produces a trained model and model evaluation results. To accomplish this, your next set of actions are dependent on whether you are working with a Classic web service or a New web service.  

**Classic web service**

At the bottom of the experiment canvas, click **Set Up Web Service** and select **Deploy Web Service [Classic]**. The Web Service **Dashboard** is displayed with the API Key and the API help page for Batch Execution. Only the Batch Execution method can be used for creating Trained Models.

**New web service**

At the bottom of the experiment canvas, click **Set Up Web Service** and select **Deploy Web Service [New]**. The Web Service Azure Machine Learning Web Services portal opens to the Deploy web service page. Type a name for your web service and choose a payment plan, then click **Deploy**. Only the Batch Execution method can be used for creating Trained Models

In either case, after experiment has completed running, the resulting workflow should look as follows:

![Resulting workflow after run.][4]



## Retrain the model with new data using BES
For this example, you are using C# to create the retraining application. You can also use the Python or R sample code to accomplish this task.

To call the Retraining APIs:

1. Create a C# Console Application in Visual Studio (New->Project->Windows Desktop->Console Application).
2. Sign in to the Machine Learning Web Service portal.
3. If you are working with a Classic web service, click **Classic Web Services**.
   1. Click the web service you are working with.
   2. Click the default endpoint.
   3. Click **Consume**.
   4. At the bottom of the **Consume** page, in the **Sample Code** section, click **Batch**.
   5. Continue to step 5 of this procedure.
4. If you are working with a New web service, click **Web Services**.
   1. Click the web service you are working with.
   2. Click **Consume**.
   3. At the bottom of the Consume page, in the **Sample Code** section, click **Batch**.
5. Copy the sample C# code for batch execution and paste it into the Program.cs file, making sure the namespace remains intact.

Add the Nuget package Microsoft.AspNet.WebApi.Client as specified in the comments. To add the reference to Microsoft.WindowsAzure.Storage.dll, you might first need to install the client library for Microsoft Azure storage services. For more information, see [Windows Storage Services](https://www.nuget.org/packages/WindowsAzure.Storage).

### Update the apikey declaration
Locate the **apikey** declaration.

    const string apiKey = "abc123"; // Replace this with the API key for the web service

In the **Basic consumption info** section of the **Consume** page, locate the primary key and copy it to the **apikey** declaration.

### Update the Azure Storage information
The BES sample code uploads a file from a local drive (For example "C:\temp\CensusIpnput.csv") to Azure Storage, processes it, and writes the results back to Azure Storage.  

To accomplish this task, you must retrieve the Storage account name, key, and container information for your Storage account from the classic Azure portal and the update corresponding values in the code. 

1. Sign in to the classic Azure portal.
2. In the left navigation column, click **Storage**.
3. From the list of storage accounts, select one to store the retrained model.
4. At the bottom of the page, click **Manage Access Keys**.
5. Copy and save the **Primary Access Key** and close the dialog. 
6. At the top of the page, click **Containers**.
7. Select an existing container or create a new one and save the name.

Locate the *StorageAccountName*, *StorageAccountKey*, and *StorageContainerName* declarations and update the values you saved from the Azure portal.

    const string StorageAccountName = "mystorageacct"; // Replace this with your Azure Storage Account name
    const string StorageAccountKey = "a_storage_account_key"; // Replace this with your Azure Storage Key
    const string StorageContainerName = "mycontainer"; // Replace this with your Azure Storage Container name

You also must ensure the input file is available at the location you specify in the code. 

### Specify the output location
When specifying the output location in the Request Payload, the extension of the file specified in *RelativeLocation* must be specified as ilearner. 

See the following example:

    Outputs = new Dictionary<string, AzureBlobDataReference>() {
        {
            "output1",
            new AzureBlobDataReference()
            {
                ConnectionString = storageConnectionString,
                RelativeLocation = string.Format("{0}/output1results.ilearner", StorageContainerName) /*Replace this with the location you would like to use for your output file, and valid file extension (usually .csv for scoring results, or .ilearner for trained models)*/
            }
        },

> [!NOTE]
> The names of your output locations may be different from the ones in this walkthrough based on the order in which you added the web service output modules. Since you set up this training experiment with two outputs, the results include storage location information for both of them.  
> 
> 

![Retraining output][6]

Diagram 4: Retraining output.

## Evaluate the Retraining Results
When you run the application, the output includes the URL and SAS token necessary to access the evaluation results.

You can see the performance results of the retrained model by combining the *BaseLocation*, *RelativeLocation*, and *SasBlobToken* from the output results for *output2* (as shown in the preceding retraining output image) and pasting the complete URL in the browser address bar.  

Examine the results to determine whether the newly trained model performs well enough to replace the existing one.

Copy the *BaseLocation*, *RelativeLocation*, and *SasBlobToken* from the output results, you will use them during the retraining process.

## Next steps
If you deployed the predictive web service by clicking **Deploy Web Service [Classic]**, see [Retrain a Classic web service](machine-learning-retrain-a-classic-web-service.md).

If you deployed the predictive web service by clicking **Deploy Web Service [New]**, see [Retrain a New web service using the Machine Learning Management cmdlets](machine-learning-retrain-new-web-service-using-powershell.md).

<!-- Retrain a New web service using the Machine Learning Management REST API -->


[1]: ./media/machine-learning-retrain-models-programmatically/machine-learning-retrain-models-programmatically-IMAGE01.png
[2]: ./media/machine-learning-retrain-models-programmatically/machine-learning-retrain-models-programmatically-IMAGE02.png
[3]: ./media/machine-learning-retrain-models-programmatically/machine-learning-retrain-models-programmatically-IMAGE03.png
[4]: ./media/machine-learning-retrain-models-programmatically/machine-learning-retrain-models-programmatically-IMAGE04.png
[5]: ./media/machine-learning-retrain-models-programmatically/machine-learning-retrain-models-programmatically-IMAGE05.png
[6]: ./media/machine-learning-retrain-models-programmatically/machine-learning-retrain-models-programmatically-IMAGE06.png
[7]: ./media/machine-learning-retrain-models-programmatically/machine-learning-retrain-models-programmatically-IMAGE07.png


<!-- Module References -->
[train-model]: https://msdn.microsoft.com/library/azure/5cc7053e-aa30-450d-96c0-dae4be720977/
