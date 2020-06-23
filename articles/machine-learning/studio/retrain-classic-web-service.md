---
title: Retrain a classic web service
titleSuffix: ML Studio (classic) - Azure
description: Learn how to retrain a model and update a classic web service to use the newly trained model in Azure Machine Learning Studio (classic).
services: machine-learning
ms.service: machine-learning
ms.subservice: studio
ms.topic: how-to

author: peterclu
ms.author: peterlu
ms.custom: seodec18, previous-ms.author=yahajiza, previous-author=YasinMSFT
ms.date: 02/14/2019
---
# Retrain and deploy a classic Studio (classic) web service

Retraining machine learning models is one way to ensure they stay accurate and based on the most relevant data available. This article will show you how to retrain a classic Studio (classic) web service. For a guide on how to retrain a new Studio (classic) web service, [view this how-to article.](retrain-machine-learning-model.md)

## Prerequisites

This article assumes you already have both a retraining experiment and a predictive experiment. These steps are explained in [Retrain and deploy a machine learning model.](/azure/machine-learning/studio/retrain-machine-learning-model) However, instead of deploying your machine learning model as a new web service, you will deploy your predictive experiment as a classic web service.
     
## Add a new endpoint

The predictive web service that you deployed contains a default scoring endpoint that is kept in sync with the original training and scoring experiments trained model. To update your web service to with a new trained model, you must create a new scoring endpoint.

There are two ways in which you can add a new end point to a web service:

* Programmatically
* Using the Azure Web Services portal

> [!NOTE]
> Be sure you are adding the endpoint to the Predictive Web Service, not the Training Web Service. If you have correctly deployed both a Training and a Predictive Web Service, you should see two separate web services listed. The Predictive Web Service should end with "[predictive exp.]".
>

### Programmatically add an endpoint

You can add scoring endpoints using the sample code provided in this [GitHub repository](https://github.com/hning86/azuremlps#add-amlwebserviceendpoint).

### Use the Azure Web Services portal to add an endpoint

1. In Machine Learning Studio (classic), on the left navigation column, click Web Services.
1. At the bottom of the web service dashboard, click **Manage endpoints preview**.
1. Click **Add**.
1. Type a name and description for the new endpoint. Select the logging level and whether sample data is enabled. For more information on logging, see [Enable logging for Machine Learning web services](web-services-logging.md).

## Update the added endpoint's trained model

### Retrieve PATCH URL

Follow these steps to get the correct PATCH URL using the web portal:

1. Sign in to the [Azure Machine Learning Web Services](https://services.azureml.net/) portal.
1. Click **Web Services** or **Classic Web Services** at the top.
1. Click the scoring web service you're working with (if you didn't modify the default name of the web service, it will end in "[Scoring Exp.]").
1. Click **+NEW**.
1. After the endpoint is added, click the endpoint name.
1. Under the **Patch** URL, click **API Help** to open the patching help page.

> [!NOTE]
> If you added the endpoint to the Training Web Service instead of the Predictive Web Service, you will receive the following error when you click the **Update Resource** link: "Sorry, but this feature is not supported or available in this context. This Web Service has no updatable resources. We apologize for the inconvenience and are working on improving this workflow."
>

The PATCH help page contains the PATCH URL you must use and provides sample code you can use to call it.

![Patch URL.](./media/retrain-classic/ml-help-page-patch-url.png)

### Update the endpoint

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
                        RelativeLocation = "your endpoint relative location", //from the output, for example: "experimentoutput/8946abfd-79d6-4438-89a9-3e5d109183/8946abfd-79d6-4438-89a9-3e5d109183.ilearner"
                        SasBlobToken = "your endpoint SAS blob token" //from the output, for example: "?sv=2013-08-15&sr=c&sig=37lTTfngRwxCcf94%3D&st=2015-01-30T22%3A53%3A06Z&se=2015-01-31T22%3A58%3A06Z&sp=rl"
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

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the left menu, click **Machine Learning**.
1. Under Name, click your workspace and then click **Web Services**.
1. Under Name, click **Census Model [predictive exp.]**.
1. Click the new endpoint you added.
1. On the endpoint dashboard, click **Update Resource**.
1. On the Update Resource API Documentation page for the web service, you can find the **Resource Name** under **Updatable Resources**.

If your SAS token expires before you finish updating the endpoint, you must perform a GET with the Job ID to obtain a fresh token.

When the code has successfully run, the new endpoint should start using the retrained model in approximately 30 seconds.

## Next steps

To learn more about how to manage web services or keep track of multiple experiments runs, see the following articles:

* [Explore the  Web Services portal](manage-new-webservice.md)
* [Manage experiment iterations](manage-experiment-iterations.md)