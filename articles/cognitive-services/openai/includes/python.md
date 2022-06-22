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
- Access granted to service in the desired Azure subscription. This service is currently invite only. You can fill out a new use case request here: <https://aka.ms/oai/access>. 
- [Python 3.x](https://www.python.org/)
- The following python libraries: os, requests, json
- An Azure OpenAI Service resource with a model deployed.

## Set up the client

1. Install the client library. You can install the client library with:

```console
pip install openai
```

## Set-up & Authenticate the client

1. Get your API keys and endpoint
 Go to your resource in the Azure portal. The Endpoint and Keys can be found in the 'Essentials' Section as shown below. Copy your endpoint and access key as you'll need both for authenticating your API calls.

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

If you want to clean up and remove an OpenAI resource, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

- [Portal](/azure/cognitive-services/cognitive-services-apis-create-account#clean-up-resources)
- [Azure CLI](/azure/cognitive-services/cognitive-services-apis-create-account-cli#clean-up-resources)

## Next steps

Learn more about how to generate the best completion in our [How-to guide on completions](../how-to/completions.md).