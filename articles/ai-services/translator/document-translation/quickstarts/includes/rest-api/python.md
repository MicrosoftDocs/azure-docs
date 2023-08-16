---
title: "Quickstart: Document Translation Python"
description: 'Document Translation processing using the REST API and Python programming language'
author: laujan
manager: nitinme
ms.service: cognitive-services
ms.subservice: translator-text
ms.topic: include
ms.date: 07/18/2023
ms.author: lajanuar
recommendations: false
---

<!-- markdownlint-disable MD051 -->

## Set up your Python project

1. If you haven't done so already, install the latest version of [Python 3.x](https://www.python.org/downloads/). The Python installer package (pip) is included with the Python installation.

    > [!TIP]
    > If you're new to Python, try the [Introduction to Python](/training/paths/beginner-python/) Learn module.

1. Open a terminal window and use pip to install the Requests library and uuid0 package:

    ```console
    pip install requests uuid
    ```

<!-- > [!div class="nextstepaction"]
> [I ran into an issue setting up my environment.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=PYTHON&Pillar=Language&Product=Document-translation&Page=quickstart&Section=Set-up-the-environment) -->

## Translate all documents in a storage container

1. Using your preferred editor or IDE, create a new directory for your app named `document-translation`.

1. Create a new Python file called **document-translation.py** in your **document-translation** directory.

1. Copy and paste the document translation [code sample](#code-sample) into your `document-translation.py` file.

    * Update **`{your-document-translation-endpoint}`** and **`{your-key}`** with values from your Azure portal Translator instance.

    * Update the **`{your-source-container-SAS-URL}`** and **`{your-target-container-SAS-URL}`** with values from your Azure portal Storage account containers instance.

## Code sample

> [!IMPORTANT]
> Remember to remove the key from your code when you're done, and never post it publicly. For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](../../../../../../key-vault/general/overview.md). For more information, *see* Azure AI services [security](../../../../../../ai-services/security-features.md).

```python
import requests

endpoint = '{your-document-translation-endpoint}'
key =  '{your-key}'
path = 'translator/text/batch/v1.1/batches'
constructed_url = endpoint + path

sourceSASUrl = '{your-source-container-SAS-URL}'

targetSASUrl = '{your-target-container-SAS-URL}'

body= {
    "inputs": [
        {
            "source": {
                "sourceUrl": sourceSASUrl,
                "storageSource": "AzureBlob",
                "language": "en"
            },
            "targets": [
                {
                    "targetUrl": targetSASUrl,
                    "storageSource": "AzureBlob",
                    "category": "general",
                    "language": "es"
                }
            ]
        }
    ]
}
headers = {
  'Ocp-Apim-Subscription-Key': key,
  'Content-Type': 'application/json',
}

response = requests.post(constructed_url, headers=headers, json=body)
response_headers = response.headers

print(f'response status code: {response.status_code}\nresponse status: {response.reason}\n\nresponse headers:\n')

for key, value in response_headers.items():
    print(key, ":", value)
```

## Run your Python application

Once you've added a code sample to your application, build and run your program:

  1. Navigate to your **document-translation** directory.

  1. Enter and run the following command in your console:

      ```console
      python document-translation.py
      ```

Upon successful completion: 

* The translated documents can be found in your target container.
* The successful POST method returns a `202 Accepted` response code indicating that the service created the batch request.
* The POST request also returns response headers including `Operation-Location` that provides a value used in subsequent GET requests.

> [!div class="nextstepaction"]
> [I successfully translated my document.](#next-steps)  [I ran into an issue.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=PYTHON&Pillar=Language&Product=Document-translation&Page=quickstart&Section=Translate-documents)
