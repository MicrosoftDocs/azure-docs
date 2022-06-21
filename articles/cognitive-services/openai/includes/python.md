---
title: 'Quickstart: Use the OpenAI Service via the Python SDK'
titleSuffix: Azure OpenAI
description: Walkthrough on how to get started with Azure OpenAI and make your first completions and search calls with the Python SDK. 
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
- An Azure OpenAI Service Resource.

## Deploy a model

Before you can generate text or inference you need to deploy a model. This is done by clicking the 'create new deployment' on the deployments page. From here you can select from one of our many available models. For getting started we recommend `text-davinci-002` for users in South Central and `text-davinci-001` for users in West Europe (text-davinci-002 is not available in this region). 

1. Go to the [Azure OpenAI Studio](https://oai.azure.com)

1. Login with the resource you want to use

1. Click on the 'Manage deployments in your resource' button to navigate to the Deployments page

1. Create a new deployment called `text-davinci-002` and choose the `text-davinci-002` model from the drop down

  >NOTE: Text-davinci-002 is only available in South Central US. If you are in a diffrent region, please choose `text-davinci-001`

## Set up the client

1. Install the client library. You can install the client library with:

```console
pip install openai
```



## Set-up & Authenticate the client

1. Get your API keys and endpoint 
 Go to the your resource in the Azure portal. The Endpoint and Keys can be found in the 'Essentials' Section as shown below. Copy your endpoint and access key as you will need both for authenticating your API calls. 

    ![Screenshot of the overview blade for an OpenAI Resource in the Azure Portal with the endpoint & access keys location circled in red](../images/OverviewBlade.jpg)

1. Create a new Python application. 

Create a new python file called quickstart.py. Then open it up in your preferred editor or IDE.

1. Replace the contents of quickstart.py with the following code:



    ```python
    import os
    import requests
    import json


    openai.api_key = "COPY_YOUR_OPENAI_KEY_HERE"
    openai.api_base =  "COPY_YOUR_OPENAI_ENDPOINT_HERE" # your endpoint should look like the following https://YOUR_RESOURCE_NAME.openai.azure.com/
    openai.api_type = 'azure'
    openai.api_version = '2022-06-01-preview' # this may change in the future

    deployment_id='COPY_IN_YOUR_DEPLOYMENT_NAME' #This will be text-davinci-002 

    # Send a completiosn call to generate an answer
    print('Sending a test completion job')
    start_phrase = 'When I go to the store, I want a'
    response = openai.Completion.create(engine=deployment_id, prompt=start_phrase, max_tokens=4)
    text = response['choices'][0]['text'].replace('\n', '').replace(' .', '.').strip()
    print(f'"{start_phrase} {text}"')

    ```

1. Paste your key, endpoint and deployment name into the code where indicated. Your OpenAI endpoint has the form `https://YOUR_RESOURCE_NAME.openai.azure.com/`


1. Run the application with the `python` command on your quickstart file

    ```console
    python quickstart.py
    ```

## Output

```console
Sending a test completion job
"When I go to the store, I want a can of black beans"
```

## Clean up resources
If you want to clean up and remove an OpenAI resource, you can delete the resource or resource group. Deleteing the resource group also deletees any other resources assocaited with it. 

- [Portal](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account#clean-up-resources)
- [Azure CLI](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account-cli#clean-up-resources)

# Next Steps
Learn more about how to generate the best completsion in our [How-to guide on completions](../How-to/Completions.md).