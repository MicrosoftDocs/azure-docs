---
title: "Quickstart: Azure management client library for Python"
description: In this quickstart, get started with the Azure management client library for Python.
services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: cognitive-services
ms.topic: include
ms.date: 08/05/2020
ms.author: pafarley
---

[Reference documentation](/python/api/azure-mgmt-cognitiveservices/azure.mgmt.cognitiveservices) | [Library source code](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/cognitiveservices/azure-mgmt-cognitiveservices) | [Package (PyPi)](https://pypi.org/project/azure-mgmt-cognitiveservices/) | [Samples](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/cognitiveservices/azure-mgmt-cognitiveservices/tests)

## Python prerequisites

* A valid Azure subscription - [Create one for free](https://azure.microsoft.com/free/).
* [Python 3.x](https://www.python.org/)

[!INCLUDE [Create a service principal](./create-service-principal.md)]

[!INCLUDE [Create a resource group](./create-resource-group.md)]

## Create a new Python application

Create a new Python application in your preferred editor or IDE and navigate to your project in a console window.

### Install the client library

You can install the client library with:

```console
pip install azure-mgmt-cognitiveservices
```

If you're using the Visual Studio IDE, the client library is available as a downloadable NuGet package.

### Import libraries

Open your Python script and import the following libraries.

[!code-python[](~/cognitive-services-quickstart-code/python/azure_management_service/create_delete_resource.py?name=snippet_imports)]

## Authenticate the client

Add the following fields to the root of your script and fill in their values, using the service principal you created and your Azure account information.

[!code-python[](~/cognitive-services-quickstart-code/python/azure_management_service/create_delete_resource.py?name=snippet_constants)]

Then add the following code to construct a **CognitiveServicesManagementClient** object. This object is needed for all of your Azure management operations.

[!code-python[](~/cognitive-services-quickstart-code/python/azure_management_service/create_delete_resource.py?name=snippet_auth)]

## Create a Cognitive Services resource (Python)

To create and subscribe to a new Cognitive Services resource, use the **Create** function. This function adds a new billable resource to the resource group you pass in. When you create your new resource, you'll need to know the "kind" of service you want to use, along with its pricing tier (or SKU) and an Azure location. The following function takes all of these arguments and creates a resource.

[!code-python[](~/cognitive-services-quickstart-code/python/azure_management_service/create_delete_resource.py?name=snippet_create)]

### Choose a service and pricing tier

When you create a new resource, you'll need to know the "kind" of service you want to use, along with the [pricing tier](https://azure.microsoft.com/pricing/details/cognitive-services/) (or SKU) you want. You'll use this and other information as parameters when creating the resource. The following function lists the available Cognitive Service "kinds."

[!code-python[](~/cognitive-services-quickstart-code/python/azure_management_service/create_delete_resource.py?name=snippet_list_avail)]

[!INCLUDE [cognitive-services-subscription-types](../../../../includes/cognitive-services-subscription-types.md)]

[!INCLUDE [SKUs and pricing](./sku-pricing.md)]

## View your resources

To view all of the resources under your Azure account (across all resource groups), use the following function:

[!code-python[](~/cognitive-services-quickstart-code/python/azure_management_service/create_delete_resource.py?name=snippet_list)]

## Delete a resource

The following function deletes the specified resource from the given resource group.

[!code-python[](~/cognitive-services-quickstart-code/python/azure_management_service/create_delete_resource.py?name=snippet_delete)]

## Call management functions

Add the following code to the bottom of your script to call the above functions. This code lists available resources, creates a sample resource, lists your owned resources, and then deletes the sample resource.

[!code-python[](~/cognitive-services-quickstart-code/python/azure_management_service/create_delete_resource.py?name=snippet_calls)]

## Run the application

Run your application from the command line with the `python` command.

```console
python <your-script-name>.py
```

## See also

* [Azure Management SDK reference documentation](/python/api/azure-mgmt-cognitiveservices/azure.mgmt.cognitiveservices)
* [What are Azure Cognitive Services?](../../what-are-cognitive-services.md)
* [Authenticate requests to Azure Cognitive Services](../../authentication.md)
* [Create a new resource using the Azure portal](../../cognitive-services-apis-create-account.md)
