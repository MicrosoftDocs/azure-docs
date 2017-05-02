---
title: Retrain a Classic web service | Microsoft Docs
description: Learn how to programmatically retrain a model and update the web service to use the newly trained model in Azure Machine Learning.
services: machine-learning
documentationcenter: ''
author: vDonGlover
manager: raymondlaghaeian
editor: ''

ms.assetid: e36e1961-9e8b-4801-80ef-46d80b140452
ms.service: machine-learning
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/19/2017
ms.author: v-donglo

---
# Retrain a Classic web service
The Predictive Web Service you deployed is the default scoring endpoint. Default endpoints are kept in sync with the original training and scoring experiments, and therefore the trained model for the default endpoint cannot be replaced. To retrain the web service, you must add a new endpoint to the web service. 

## Prerequisites
You must have set up a training experiment and a predictive experiment as shown in [Retrain Machine Learning models programmatically](machine-learning-retrain-models-programmatically.md). 

> [!IMPORTANT]
> The predictive experiment must be deployed as a Classic machine learning web service. 
> 
> 

For additional information on Deploying web services, see [Deploy an Azure Machine Learning web service](machine-learning-publish-a-machine-learning-web-service.md).

## Add a new Endpoint
The Predictive Web Service that you deployed contains a default scoring endpoint that is kept in sync with the original training and scoring experiments trained model. To update your web service to with a new trained model, you must create a new scoring endpoint. 

To create a new scoring endpoint, on the Predictive Web Service that can be updated with the trained model:

> [!NOTE]
> Be sure you are adding the endpoint to the Predictive Web Service, not the Training Web Service. If you have correctly deployed both a Training and a Predictive Web Service, you should see two separate web services listed. The Predictive Web Service should end with "[predictive exp.]".
> 
> 

There are three ways in which you can add a new end point to a web service:

1. Programmatically
2. Use the Microsoft Azure Web Services portal
3. Use the Azure classic portal

### Programmatically add an endpoint
You can add scoring endpoints using the sample code provided in this [github repository](https://github.com/raymondlaghaeian/AML_EndpointMgmt/blob/master/Program.cs).

### Use the Microsoft Azure Web Services portal to add an endpoint
1. In Machine Learning Studio, on the left navigation column, click Web Services.
2. At the bottom of the web service dashboard, click **Manage endpoints preview**.
3. Click **Add**.
4. Type a name and description for the new endpoint. Select the logging level and whether sample data is enabled. For more information on logging, see [Enable logging for Machine Learning web services](machine-learning-web-services-logging.md).

### Use the Azure classic portal to add an endpoint
1. Sign in to the [classic Azure portal](https://manage.windowsazure.com).
2. In the left menu, click **Machine Learning**.
3. Under Name, click your workspace and then click **Web Services**.
4. Under Name, click **Census Model [predictive exp.]**.
5. At the bottom of the page, click **Add Endpoint**. For more information on adding endpoints, see [Creating Endpoints](machine-learning-create-endpoint.md). 

## Update the added endpoint’s Trained Model
To complete the retraining process, you must update the trained model of the new endpoint that you added.

* If you added the new endpoint using the classic Azure portal, you can click the new endpoint's name in the portal, then the **UpdateResource** link to get the URL you would need to update the endpoint's model.
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

The value of the *Name* parameter in *Resources* should match the Resource Name of the saved Trained Model in the predictive experiment. To get the Resource Name:

1. Sign in to the [classic Azure portal](https://manage.windowsazure.com).
2. In the left menu, click **Machine Learning**.
3. Under Name, click your workspace and then click **Web Services**.
4. Under Name, click **Census Model [predictive exp.]**.
5. Click the new endpoint you added.
6. On the endpoint dashboard, click **Update Resource**.
7. On the Update Resource API Documentation page for the web service, you can find the **Resource Name** under **Updatable Resources**.

If your SAS token expires before you finish updating the endpoint, you must perform a GET with the Job Id to obtain a fresh token.

When the code has successfully run, the new endpoint should start using the retrained model in approximately 30 seconds.

## Summary
Using the Retraining APIs, you can update the trained model of a predictive Web Service enabling scenarios such as:

* Periodic model retraining with new data.
* Distribution of a model to customers with the goal of letting them retrain the model using their own data.

## Next steps
[Troubleshooting the retraining of an Azure Machine Learning classic web service](machine-learning-troubleshooting-retraining-models.md)

