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
- Access granted to service in the desired Azure subscription. This service is currently invite only. You can fill out a new use case request here: <https://aka.ms/oai/access>.
- [Python 3.x](https://www.python.org/)
- The following python libraries: os, requests, json
- An Azure OpenAI Service resource with a model deployed.

## Set-up & Authenticate the client

1. Get your API keys and endpoint
 Go to your resource in the Azure portal. The Endpoint and Keys can be found in the 'Essentials' Section as shown below. Copy your endpoint and access key as you'll need both for authenticating your API calls.

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

If you want to clean up and remove an OpenAI resource, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it. 

- [Portal](/azure/cognitive-services/cognitive-services-apis-create-account#clean-up-resources)
- [Azure CLI](/azure/cognitive-services/cognitive-services-apis-create-account-cli#clean-up-resources)

## Next steps

Learn more about how to generate the best completion in our [How-to guide on completions](../how-to/completions.md).