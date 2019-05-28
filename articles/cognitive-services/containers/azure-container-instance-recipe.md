---
title: Azure Container Instance recipe
titleSuffix: Azure Cognitive Services
description: Learn how to deploy Cognitive Services Containers on Azure Container Instance
services: cognitive-services
author: diberry
manager: nitinme
ms.custom: seodec18
ms.service: cognitive-services
ms.topic: article 
ms.date: 05/16/2019
ms.author: diberry
#As a potential customer, I want to know more about how Cognitive Services provides and supports Docker containers for each service.

# https://github.com/Azure/cognitiveservices-aci
---

# Deploy and run container on Azure Container Instance (ACI)

With the following steps, scale Azure Cognitive Services applications in the cloud easily with Azure[Container Instance](https://docs.microsoft.com/azure/container-instances/) (ACI). This help you focus on building your applications instead of managing the infrastructure.

## Prerequisites

This recipe works with any Cognitive Services container. The Cognitive Service resource must be created in the Azure portal before using this recipe. Each Cognitive Service that supports containers has a "How to install" document specifically for installing and configuring the service for a container. Because some services require a file or set of files as input for the container, it is important that you understand and have used the container successfully before using this recipe.

* A Cognitive Service resource, created in Azure portal. 
* Cognitive Service **endpoint URL** - review the specific service's "How to install" for the container, to find where the endpoint URL is from within the Azure portal, and what a correct example of the URL looks like. The exact format can change from service to service. 
* Cognitive Service **key** -  review the specific service's "How to install" for the container, to find where the key is from within the Azure portal. Typically, the key is a string of 32 alpha-numeric characters. 
* A single Cognitive Services Container on local host (your computer). Make sure you can pull down the image (`docker pull`), run the local container successfully with all required configuration settings (`docker run`), and call the container's endpoint, getting a response of 2xx and a JSON response back. 

All variables in angle brackets, `<>`, need to be replaced with your own values. 

If this recipe has any known issues for specific containers, they are listed in [troubleshooting this recipe](#trouble-shooting-this-recipe).

## If your container requires input to run successfully

1. If your container requires input to run successfully, run the container successfully and test it. 
1. Create a copy of the tested container with your input configuration using `docker commit <container-id> <image-name>`. The container ID is found using the docker command `docker ps -a`. Make sure the use this new container's name whenever the recipe uses `<container>`.

## Step 1: Create a Cognitive Services resource for Text Analytics 

1. Sign into the [Azure portal](https://portal.azure.com).
1. Select **+ Create a resource**. Navigate to **AI + Machine Learning -> Text Analytics.**
1. or click here **Text Analytics** [Create window](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics). 

1. Enter the following details in the Create window:

    |Setting|Value|
    |--|--|
    |Name|`please provide a name of your choice`|
    |Subscription|Select your subscription (Cloud Labs AI (SS - **).|
    |Location|`(Europe) North Europe`|
    |Pricing Tier|`S1` - this is the standard pricing tier.|
    |Resource Group|Select the available resource group.|
    |||

1. Select **Create**.

1. Select the bell icon in the top navigation. This is the notification window. It will display a blue **Go to resource** button when the resource is created. Select the button to go the new Text Analytics resource.
1. Collect the following information to use later:

    |Page in Azure portal Resource|Setting|Value|
    |--|--|--|
    | **Overview**|Endpoint|Copy the endpoint. It looks like `https://northeurope.api.cognitive.microsoft.com/text/analytics/v2.0`|
    |**Keys**|API Key|Copy 1 of the two keys. It is a 32 alphanum-character string with no spaces or dashes, `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`.|

## Step 2: Launch Text Analytics Containers on Azure Container Instances (ACI) 

**Creating Azure Container Instance (ACI) resource.**

1. Navigate to [Create a ACI resource](https://ms.portal.azure.com/#create/Microsoft.ContainerInstances) here.
  (or) go to **+Create Resource --> Containers -->** [Container Instances](https://ms.portal.azure.com/#create/Microsoft.ContainerInstances)

2. On the **Basics** tab, enter the following details:

    |Page|Setting|Value|
    |--|--|--|
    |Basics|Subscription|Select your subscription (Cloud Labs AI (SS - **).|
    |Basics|Resource group|Select the available resource group.|
    |Basics|Container name|`provide a name of your choice` - this name should be in lower caps|
    |Basics|Location|`(Europe) North Europe`|
    |Basics|Image type|`Public`|
    |Basics|Image name|Enter the sentiment container:<br>mcr.microsoft.com/azure-cognitive-services/sentiment|
    |Basics|OS type|`Linux`|
    |Basics|Size|Change size to:<br>2 cores<br>4 GB 
    ||||
   
    The other two Text Analytics containers could be entered but the [swagger exercise](#use-the-container-instance) further in this quickstart will have a slightly different experience: 

    * `mcr.microsoft.com/azure-cognitive-services/keyphrase`
    * `mcr.microsoft.com/azure-cognitive-services/language`
 
3. On the **Networking** tab, enter the following details:

    |Page|Setting|Value|
    |--|--|--|
    |Networking|Ports|Edit the existing port for TCP from `80` to `5000`. This means you are exposing the container on port 5000.|
    ||||

4. On the **Advanced** tab, enter the following details to pass through the container [required billing settings](https://docs.microsoft.com/azure/cognitive-services/text-analytics/how-tos/text-analytics-how-to-install-containers#billing-arguments) to the ACI resource:

    |Advanced page key|Advanced page value|
    |--|--|
    |`apikey`|Copied from the **Keys** page of the Text Analytics resource. It is a 32 alphanum-character string with no spaces or dashes, `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`.|
    |`billing`|Copied from the **Overview** page of the Text Analytics resource. Example: `https://northeurope.api.cognitive.microsoft.com/text/analytics/v2.0`|
    |`eula`|`accept`|
    
1. Select **Review and Create**. 
1. After validation passes, select **Create** to finish the creation process.
1. Select the bell icon in the top navigation. This is the notification window. It will display a blue **Go to resource** button when the resource is created. Select that button to go the new Text Analytics resource. 

## Use the Container Instance

1. Select the **Overview** and copy the IP address. It will be a numeric IP address such as `55.55.55.55`.
1. Open a new browser tab and use the IP address, for example, `http://<IP-address>:5000 (http://55.55.55.55:5000`). You will see the container's home page, letting you know the container is running.

1. Select **Service API Description** to view the swagger page for the container.

1. Select any of the **POST** APIs and select **Try it out**.  The parameters are displayed including the input:

    ```json
    {
      "documents": [
        {
          "language": "en",
          "id": "1",
          "text": "Hello world. This is some input text that I love."
        },
        {
          "language": "fr",
          "id": "2",
          "text": "Bonjour tout le monde"
        },
        {
          "language": "es",
          "id": "3",
          "text": "La carretera estaba atascada. Había mucho tráfico el día de ayer."
        }
      ]
    }
    ```

1. Update the first text value of the input JSON to the following text to learn the sentiment:
    `I have been to KubeCon conference in Barcelona, it is one of the best conference I have ever had. Great people, great session and thoroughly enjoyed it.`

1. Set **showStats** to true. 

1. Select **Execute** to determine the sentiment of the text. 
    
    The model packaged in the container generates a score: 1 is positive, 0 is negative. 

    The JSON response returned includes sentiment for the updated text:

    ```JSON
    {
      "documents": [
        {
          "id": "1",
          "score": 0.9721651077270508,
          "statistics": {
            "charactersCount": 353,
            "transactionsCount": 1
          }
        },
        {
          "id": "2",
          "score": 0.8401265144348145,
          "statistics": {
            "charactersCount": 21,
            "transactionsCount": 1
          }
        },
        {
          "id": "3",
          "score": 0.334433376789093,
          "statistics": {
            "charactersCount": 65,
            "transactionsCount": 1
          }
        }
      ],
      "errors": [],
      "statistics": {
        "documentsCount": 3,
        "validDocumentsCount": 3,
        "erroneousDocumentsCount": 0,
        "transactionsCount": 3
      }
    }
    ```

    You have successfully launched Cognitive Services containers in Azure Container Instance and generated a score to learn the sentiment of the text you provided. Have fun!

## Trouble-shooting this recipe

## Next steps