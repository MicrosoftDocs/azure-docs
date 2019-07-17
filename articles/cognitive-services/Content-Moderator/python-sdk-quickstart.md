---
title: "Quickstart: Content Moderator client library for Python | Microsoft Docs"
description: Get started with the Content Moderator client library for Python.
services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: cognitive-services
ms.subservice: content-moderator
ms.topic: quickstart
ms.date: 07/17/2019
ms.author: pafarley
---

# Quickstart: Content Moderator client library for Python

Get started with the Content Moderator client library for Python. Follow these steps to install the package and try out the example code for basic tasks. Content Moderator is a cognitive service that checks text, image, and video content for material that is potentially offensive, risky, or otherwise undesirable. When such material is found, the service applies appropriate labels (flags) to the content. Your app can then handle flagged content in order to comply with regulations or maintain the intended environment for users.

Use the Content Moderator client library for Python to:

* Apply moderation tags to images
* Check images against custom lists
* Create a moderation job to pass content on to human review

[Reference documentation](https://docs.microsoft.com/python/api/overview/azure/cognitiveservices/contentmoderator?view=azure-python) | [Library source code](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/cognitiveservices/azure-cognitiveservices-vision-contentmoderator) | [Package (PiPy)](https://pypi.org/project/azure-cognitiveservices-vision-contentmoderator/) | [Samples](https://github.com/Azure-Samples/cognitive-services-python-sdk-samples)

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/)
* [Python 3.x](https://www.python.org/)

## Setting up

### Create a Content Moderator Azure resource

Azure Cognitive Services are represented by Azure resources that you subscribe to. Create a resource for Content Moderator using the [Azure portal](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) or [Azure CLI](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account-cli) on your local machine. You can also:

* Get a [trial key](https://azure.microsoft.com/try/cognitive-services/#decision) valid for 7 days for free. After you sign up, it will be available on the [Azure website](https://azure.microsoft.com/try/cognitive-services/my-apis/).  
* View your resource on the [Azure Portal](https://portal.azure.com/)

After you get a key from your trial subscription or resource, [create an environment variable](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account#configure-an-environment-variable-for-authentication) for the key, named `CONTENTMODERATOR_SUBSCRIPTION_KEY`. 
 
### Create a python script

Create a new Python script and open it in your preferred editor or IDE. Then add the following `import` statements to the top of the file.

```python
import os.path
from pprint import pprint
import time

from azure.cognitiveservices.vision.contentmoderator import ContentModeratorClient
from azure.cognitiveservices.vision.contentmoderator.models import (
    APIErrorException,
    Evaluate,
    OCR,
    FoundFaces
)
from msrest.authentication import CognitiveServicesCredentials
```


Create variables for your resource's Azure location and your key as an environment variable. If you created the environment variable after the application is launched, the editor, IDE, or shell running it will need to be closed and reloaded to access the variable.

```python
CONTENTMODERATOR_LOCATION = os.environ.get("CONTENTMODERATOR_LOCATION", "westcentralus")
subscription_key = os.environ.get("CONTENTMODERATOR_SUBSCRIPTION_KEY")
```

### Install the client library

After installing Python, you can install the client library with:

```console
pip install --upgrade azure-cognitiveservices-[product]
```

## Object model

<!-- 
    Briefly introduce and describe the functionality of the library's main classes. Include links to their reference pages.

    Explain the object hierarchy and how the classes work together to manipulate resources in the service.
-->

## Code examples

<!--
    Include code snippets and short descriptions for each task you list in the the bulleted list. Briefly explain each operation, but include enough clarity to explain complex or otherwise tricky operations.

    Include links to the service's reference content when introducing a class for the first
-->

These code snippets show you how to do the following with the Computer Vision client library for Python:

* [Authenticate the client](#authenticate-the-client)
* [link to example task 1]()
* [link to example task 2]()
* [link to example task 3]()

### Authenticate the client

<!-- 
    The authentication section (and its H3) is required and must be the first code example in the section if your library requires authentication for use.
-->

> [!NOTE]
> This quickstart assumes you've [created an environment variable](../../cognitive-services-apis-create-account.md#configure-an-environment-variable-for-authentication) for your [product] key, named `[PRODUCT]_KEY`.

Instantiate a client with your endpoint and key. Create an [ApiKeyServiceClientCredentials]() object with your key, and use it with your endpoint to create an [ApiClient]() object.

```python

```

### Example task 1

Example: Create a new method to read in the data and add it to a [Request](https://docs.microsoft.com/dotnet/) object as an array of [Points](https://docs.microsoft.com/dotnet/). Send the request with the [send()](https://docs.microsoft.com/dotnet/) method

```python

```

### Example task 2

Example: Create a new method to read in the data and add it to a [Request](https://docs.microsoft.com/dotnet/) object as an array of [Points](https://docs.microsoft.com/dotnet/). Send the request with the [send()](https://docs.microsoft.com/dotnet/) method

```python

```

## Run the application

Run the application with the `python` command on your quickstart file.

```console
python quickstart-file.py
```

## Clean up resources

If you want to clean up and remove a Cognitive Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

* [Portal](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account#clean-up-resources)
* [Azure CLI](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account-cli#clean-up-resources)

## Troubleshooting

<!--
    This section is optional. If you know of areas that people commonly run into trouble, help them resolve those issues in this section
-->

## Next steps

> [!div class="nextstepaction"]
>[Next article]()

* [What is the [product] API?](../overview.md)
* [Article2](../overview.md)
* [Article3](../overview.md)
* The source code for this sample can be found on [GitHub]().