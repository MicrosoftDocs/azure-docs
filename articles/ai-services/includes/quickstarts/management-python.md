---
title: "Quickstart: Azure management client library for Python"
description: In this quickstart, get started with the Azure management client library for Python.
services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: azure-ai-services
ms.topic: include
ms.date: 10/5/2023
ms.author: eur
---

[Reference documentation](/python/api/azure-mgmt-cognitiveservices/azure.mgmt.cognitiveservices) | [Library source code](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/cognitiveservices/azure-mgmt-cognitiveservices) | [Package (PyPi)](https://pypi.org/project/azure-mgmt-cognitiveservices/) | [Samples](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/cognitiveservices/azure-mgmt-cognitiveservices/tests)

## Python prerequisites

* A valid Azure subscription - [Create one for free](https://azure.microsoft.com/free/).
* [Python 3.x](https://www.python.org/)
* [!INCLUDE [contributor-requirement](./contributor-requirement.md)]
* [!INCLUDE [terms-azure-portal](./terms-azure-portal.md)]

[!INCLUDE [Create a service principal](./create-service-principal.md)]

[!INCLUDE [Create a resource group](./create-resource-group.md)]

## Create a new Python application

Create a new Python application in your preferred editor or IDE and navigate to your project in a console window.

### Install the client library

You can install the client library with:

```console
pip install azure-mgmt-cognitiveservices
```

Also install the [Azure Identity library](/python/api/overview/azure/identity-readme) for Azure Active Directory (Azure AD) token authentication support. 

```console
pip install azure-identity
```

### Import libraries

Open your Python script and import the following libraries.

```python
import time
from azure.identity import ClientSecretCredential
from azure.mgmt.cognitiveservices import CognitiveServicesManagementClient
from azure.mgmt.cognitiveservices.models import Account, Sku
```

## Authenticate the client

Add the following fields to the root of your script and fill in their values, using the service principal you created and your Azure account information.

[!code-python[](~/cognitive-services-quickstart-code/python/azure_management_service/create_delete_resource.py?name=snippet_constants)]

Then add the following code to construct a **CognitiveServicesManagementClient** object. This object is needed for all of your Azure management operations.

[!code-python[](~/cognitive-services-quickstart-code/python/azure_management_service/create_delete_resource.py?name=snippet_auth)]

## Create an Azure AI services resource (Python)

To create and subscribe to a new Azure AI services resource, use the **Create** function. This function adds a new billable resource to the resource group you pass in. When you create your new resource, you'll need to know the "kind" of service you want to use, along with its pricing tier (or SKU) and an Azure location. The following function takes all of these arguments and creates a resource.

[!code-python[](~/cognitive-services-quickstart-code/python/azure_management_service/create_delete_resource.py?name=snippet_create)]

### Choose a service and pricing tier

When you create a new resource, you'll need to know the "kind" of service you want to use, along with the [pricing tier](https://azure.microsoft.com/pricing/details/cognitive-services/) (or SKU) you want. You'll use this and other information as parameters when creating the resource. The following function lists the available Azure AI services "kinds."

[!code-python[](~/cognitive-services-quickstart-code/python/azure_management_service/create_delete_resource.py?name=snippet_list_avail)]

[!INCLUDE [SKUs and pricing](./sku-pricing.md)]

## View your resources

To view all of the resources under your Azure account (across all resource groups), use the following function:

[!code-python[](~/cognitive-services-quickstart-code/python/azure_management_service/create_delete_resource.py?name=snippet_list)]

## Delete a resource

The following function deletes the specified resource from the given resource group.

[!code-python[](~/cognitive-services-quickstart-code/python/azure_management_service/create_delete_resource.py?name=snippet_delete)]

If you need to recover a deleted resource, see [Recover or purge deleted Azure AI services resources](../../recover-purge-resources.md).

## Call management functions

Add the following code to the bottom of your script to call the above functions. This code lists available resources, creates a sample resource, lists your owned resources, and then deletes the sample resource.

[!code-python[](~/cognitive-services-quickstart-code/python/azure_management_service/create_delete_resource.py?name=snippet_calls)]

## Run the application

Run your application from the command line with the `python` command.

```console
python <your-script-name>.py
```
