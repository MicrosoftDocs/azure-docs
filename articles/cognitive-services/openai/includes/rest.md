---
title: 'Quickstart: Use the OpenAI Service to make your first completions and search calls with the REST API'
titleSuffix: Azure OpenAI
description: Walkthrough on how to get started with Azure OpenAI and make your first completions and search calls with the REST API. 
services: cognitive-services
manager: nitinme
ms.service: cognitive-services
ms.subservice: openai
ms.topic: include
ms.date: 06/24/2022
keywords: 
---

## Prerequisites

- An Azure subscription
- Access granted to service in the desired azure subscription. This service is currently invite only. You can fill out a new use case request here: <https://aka.ms/oai/access>. Please open an issue on this repo to contact us if you have an issue
- [Python 3.x](https://www.python.org/)
- The following python libraries: os, requests, json

## Create a resource

Resources in Azure can be created several different ways:

- Within the Azure Portal
- Using the REST APIs, Azure ClI, powershell or client libraries
- Via ARM templates

Currently Azure OpenAI Service supports resource creation in the Azure Portal, via REST API or our python client library. This guide walks you through the Azure Portal creation experience.

1. Navigate to the create page: [Azure OpenAI Service Create Page](https://portal.azure.com/?microsoft_azure_marketplace_ItemHideKey=microsoft_openai_tip#create/Microsoft.CognitiveServicesOpenAI)
1. On the **Create** page provide the following information:

    |Field| Description   |
    |--|--|
    | **Subscription** | Select the Azure subscription used in your OpenAI onboarding application|
    | **Resource group** | The Azure resource group that will contain your OpenAI resource. You can create a new group or add it to a pre-existing group. |
    | **Region** | The location of your instance. Different locations may introduce latency, but have no impact on the runtime availability of your resource. Please choose **South Central US**|
    | **Name** | A descriptive name for your cognitive services resource. For example, *MyOpenAIResource*. |
    | **Pricing Tier** | Only 1 pricing tier is available for the service currently |

![Screenshot of the create blade in the Azure portal](../images/CreatePage.JPG)

## Get your endpoint and access keys

1.After your resource is successfully deployed, click on Go to resource under Next Steps. This will bring you to the resource blade for your resource. This blade gives you access to manage your resource including features like: Access controls with Azure Active Directory, Virtual Networks and other tasks. 

![Post deployment page in the Azure Portal](../images/PostDeployment.jpg)

1. In the overview page, your resource Endpoint and Keys can be found in the 'Essentials' Section as shown below. Copy your endpoint and access key as you will need both for authenticating your API calls. 

![Screenshot of the overview blade for an OpenAI Resource in the Azure Portal with the endpoint & access keys location circled in red](../images/OverviewBlade.jpg)


## Deploy a model
Before you can generate text or inference you need to deploy a model. This is done by clicking the 'create new deployment' on the deployments page. From here you can select from one of our many available models. For getting started we recommend `text-davinci-002` for users in South Central and `text-davinci-001` for users in West Europe (text-davinci-002 is not available in this region). You can do this in the Azure OpenAI Studio.

1. Go to the [Azure OpenAI Studio](https://oai.azure.com)

1. Login with the resource you want to use

1. Click on the 'Manage deployments in your resource' button to navigate to the Deployments page

1. Create a new deployment called `text-davinci-002` and choose the `text-davinci-002` model from the drop down

  >NOTE: Text-davinci-002 is only available in South Central US. If you are in a diffrent region, please choose `text-davinci-001`

## Set-up & Authenticate the client

1. Get your API keys and endpoint 
 Go to the your resource in the Azure portal. The Endpoint and Keys can be found in the 'Essentials' Section as shown below. Copy your endpoint and access key as you will need both for authenticating your API calls. 

    ![Screenshot of the overview blade for an OpenAI Resource in the Azure Portal with the endpoint & access keys location circled in red](../images/OverviewBlade.jpg)

1. Create a new Python application. 

Create a new python file called quickstart.py. Then open it up in your preferred editor or IDE.

1. Replace the contents of quickstart.py with the following code. 


    ```python
    import os
    import requests
    import json
    apiKey = "COPY_YOUR_OPENAI_KEY_HERE"
    base_url = "COPY_YOUR_OPENAI_ENDPOINT_HERE"
    deploymentName ="PASTE_YOUR_DEPLOYMENT_NAME_HERE"

    url = base_url + "openai/deployments/" + deploymentName + "/completions?api-version=2022-06-01-preview"
        prompt = "Once upon a time"
        payload = {        
            "prompt":prompt
        }

        r = requests.post(url, 
          headers={
            "api-key": apiKey,
            "Content-Type": "application/json"
          },
          json = payload
        )

    ```

1.  Paste your key, endpoint and deployment name into the code where indicated. Your OpenAI endpoint has the form `https://YOUR_RESOURCE_NAME.openai.azure.com/`

1. Run the application with the `python` command on your quickstart file

    ```console
    python quickstart.py
    ```

## Output 

  The output from the completions API will look as follows. 

  ```json
  {
    "id": "id of your call",
    "object": "text_completion",
    "created": 1589478378,
    "model": "model used",
    "choices": [
      {
        "text": " there was a girl who",
        "index": 0,
        "logprobs": null,
        "finish_reason": "length"
      }
    ]
  }
  ```

## Clean up resources
If you want to clean up and remove an OpenAI resource, you can delete the resource or resource group. Deleteing the resource group also deletees any other resources assocaited with it. 

- [Portal](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account#clean-up-resources)
- [Azure CLI](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account-cli#clean-up-resources)

# Next Steps
Learn more about how to generate the best completsion in our [How-to guide on completions](../How-to/Completions.md).