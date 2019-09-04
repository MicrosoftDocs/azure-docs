---
title: "Quickstart: Python SDK"
titleSuffix: "Azure Cognitive Services"
description: In this quickstart, you learn how to use the Python SDK for common tasks, such as analyze image, get description, recognize text and generate thumbnail.
services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: computer-vision
ms.topic: quickstart
ms.date: 04/17/2019
ms.author: pafarley
---
# Azure Cognitive Services Computer Vision SDK for Python

The Computer Vision service provides developers with access to advanced algorithms for processing images and returning information. Computer Vision algorithms analyze the content of an image in different ways, depending on the visual features you're interested in.

* [Analyze an image](#analyze-an-image)
* [Get subject domain list](#get-subject-domain-list)
* [Analyze an image by domain](#analyze-an-image-by-domain)
* [Get text description of an image](#get-text-description-of-an-image)
* [Get handwritten text from image](#get-text-from-image)
* [Generate thumbnail](#generate-thumbnail)

For more information about this service, see [What is Computer Vision?][computervision_docs].

Looking for more documentation?

* [SDK reference documentation](https://docs.microsoft.com/python/api/azure-cognitiveservices-vision-computervision/azure.cognitiveservices.vision.computervision)
* [Cognitive Services Computer Vision documentation](https://docs.microsoft.com/azure/cognitive-services/computer-vision/)

## Prerequisites

* [Python 3.6+][python]
* Free [Computer Vision key][computervision_resource] and associated endpoint. You need these values when you create the instance of the [ComputerVisionClient][ref_computervisionclient] client object. Use one of the following methods to get these values.

### If you don't have an Azure Subscription

Create a free key valid for 7 days with the **[Try It][computervision_resource]** experience for the Computer Vision service. When the key is created, copy the key and endpoint name. You will need this to [create the client](#create-client).

Keep the following after the key is created:

* Key value: a 32 character string with the format of `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
* Key endpoint: the base endpoint URL, https\://westcentralus.api.cognitive.microsoft.com

### If you have an Azure Subscription

The easiest method to create a resource in your subscription is to use the following [Azure CLI][azure_cli] command. This creates a Cognitive Service key that can be used across many cognitive services. You need to choose the _existing_ resource group name, for example, "my-cogserv-group" and the new computer vision resource name, such as "my-computer-vision-resource".

```Bash
RES_REGION=westeurope
RES_GROUP=<resourcegroup-name>
ACCT_NAME=<computervision-account-name>

az cognitiveservices account create \
    --resource-group $RES_GROUP \
    --name $ACCT_NAME \
    --location $RES_REGION \
    --kind CognitiveServices \
    --sku S0 \
    --yes
```

<!--
## Installation

Install the Azure Cognitive Services Computer Vision SDK with [pip][pip], optionally within a [virtual environment][venv].

### Configure a virtual environment (optional)

Although not required, you can keep your base system and Azure SDK environments isolated from one another if you use a [virtual environment][virtualenv]. Execute the following commands to configure and then enter a virtual environment with [venv][venv], such as `cogsrv-vision-env`:

```Bash
python3 -m venv cogsrv-vision-env
source cogsrv-vision-env/bin/activate
```
-->

### Install the SDK

Install the Azure Cognitive Services Computer Vision SDK for Python [package][pypi_computervision] with [pip][pip]:

```Bash
pip install azure-cognitiveservices-vision-computervision
```

## Authentication

Once you create your Computer Vision resource, you need its **endpoint**, and one of its **account keys** to instantiate the client object.

Use these values when you create the instance of the [ComputerVisionClient][ref_computervisionclient] client object.

For example, use the Bash terminal to set the environment variables:

```Bash
ACCOUNT_ENDPOINT=<resourcegroup-name>
ACCT_NAME=<computervision-account-name>
```

### For Azure subscription users, get credentials for key and endpoint

If you do not remember your endpoint and key, you can use the following method to find them. If you need to create a key and endpoint, you can use the method for [Azure subscription holders](#if-you-have-an-azure-subscription) or for [users without an Azure subscription](#if-you-dont-have-an-azure-subscription).

Use the [Azure CLI][cloud_shell] snippet below to populate two environment variables with the Computer Vision account **endpoint** and one of its **keys** (you can also find these values in the [Azure portal][azure_portal]). The snippet is formatted for the Bash shell.

```Bash
RES_GROUP=<resourcegroup-name>
ACCT_NAME=<computervision-account-name>

export ACCOUNT_ENDPOINT=$(az cognitiveservices account show \
    --resource-group $RES_GROUP \
    --name $ACCT_NAME \
    --query endpoint \
    --output tsv)

export ACCOUNT_KEY=$(az cognitiveservices account keys list \
    --resource-group $RES_GROUP \
    --name $ACCT_NAME \
    --query key1 \
    --output tsv)
```


### Create client

Get the endpoint and key from environment variables then create the [ComputerVisionClient][ref_computervisionclient] client object.

```Python
from azure.cognitiveservices.vision.computervision import ComputerVisionClient
from azure.cognitiveservices.vision.computervision.models import VisualFeatureTypes
from msrest.authentication import CognitiveServicesCredentials

# Get endpoint and key from environment variables
import os
endpoint = os.environ['ACCOUNT_ENDPOINT']
key = os.environ['ACCOUNT_KEY']

# Set credentials
credentials = CognitiveServicesCredentials(key)

# Create client
client = ComputerVisionClient(endpoint, credentials)
```

## Examples

You need a [ComputerVisionClient][ref_computervisionclient] client object before using any of the following tasks.

### Analyze an image

You can analyze an image for certain features with [`analyze_image`][ref_computervisionclient_analyze_image]. Use the [`visual_features`][ref_computervision_model_visualfeatures] property to set the types of analysis to perform on the image. Common values are `VisualFeatureTypes.tags` and `VisualFeatureTypes.description`.

```Python
url = "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Broadway_and_Times_Square_by_night.jpg/450px-Broadway_and_Times_Square_by_night.jpg"

image_analysis = client.analyze_image(url,visual_features=[VisualFeatureTypes.tags])

for tag in image_analysis.tags:
    print(tag)
```

### Get subject domain list

Review the subject domains used to analyze your image with [`list_models`][ref_computervisionclient_list_models]. These domain names are used when [analyzing an image by domain](#analyze-an-image-by-domain). An example of a domain is `landmarks`.

```Python
models = client.list_models()

for x in models.models_property:
    print(x)
```

### Analyze an image by domain

You can analyze an image by subject domain with [`analyze_image_by_domain`][ref_computervisionclient_analyze_image_by_domain]. Get the [list of supported subject domains](#get-subject-domain-list) in order to use the correct domain name.

```Python
# type of prediction
domain = "landmarks"

# Public domain image of Eiffel tower
url = "https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg"

# English language response
language = "en"

analysis = client.analyze_image_by_domain(domain, url, language)

for landmark in analysis.result["landmarks"]:
    print(landmark["name"])
    print(landmark["confidence"])
```

### Get text description of an image

You can get a language-based text description of an image with [`describe_image`][ref_computervisionclient_describe_image]. Request several descriptions with the `max_description` property if you are doing text analysis for keywords associated with the image. Examples of a text description for the following image include `a train crossing a bridge over a body of water`, `a large bridge over a body of water`, and `a train crossing a bridge over a large body of water`.

```Python
domain = "landmarks"
url = "http://www.public-domain-photos.com/free-stock-photos-4/travel/san-francisco/golden-gate-bridge-in-san-francisco.jpg"
language = "en"
max_descriptions = 3

analysis = client.describe_image(url, max_descriptions, language)

for caption in analysis.captions:
    print(caption.text)
    print(caption.confidence)
```

### Get text from image

You can get any handwritten or printed text from an image. This requires two calls to the SDK: [`batch_read_file`](https://docs.microsoft.com/python/api/azure-cognitiveservices-vision-computervision/azure.cognitiveservices.vision.computervision.computervisionclient?view=azure-python) and [`get_read_operation_result`](https://docs.microsoft.com/python/api/azure-cognitiveservices-vision-computervision/azure.cognitiveservices.vision.computervision.computervisionclient?view=azure-python). The call to `batch_read_file` is asynchronous. In the results of the `get_read_operation_result` call, you need to check if the first call completed with [`TextOperationStatusCodes`][ref_computervision_model_textoperationstatuscodes] before extracting the text data. The results include the text as well as the bounding box coordinates for the text.

```Python
# import models
from azure.cognitiveservices.vision.computervision.models import TextOperationStatusCodes
import time

url = "https://azurecomcdn.azureedge.net/cvt-1979217d3d0d31c5c87cbd991bccfee2d184b55eeb4081200012bdaf6a65601a/images/shared/cognitive-services-demos/read-text/read-1-thumbnail.png"
raw = True
custom_headers = None
numberOfCharsInOperationId = 36

# Async SDK call
rawHttpResponse = client.batch_read_file(url, custom_headers,  raw)

# Get ID from returned headers
operationLocation = rawHttpResponse.headers["Operation-Location"]
idLocation = len(operationLocation) - numberOfCharsInOperationId
operationId = operationLocation[idLocation:]

# SDK call
while True:
    result = client.get_read_operation_result(operationId)
    if result.status not in ['NotStarted', 'Running']:
        break
    time.sleep(1)

# Get data
if result.status == TextOperationStatusCodes.succeeded:
    for textResult in result.recognition_results:
        for line in textResult.lines:
            print(line.text)
            print(line.bounding_box)
```

### Generate thumbnail

You can generate a thumbnail (JPG) of an image with [`generate_thumbnail`][ref_computervisionclient_generate_thumbnail]. The thumbnail does not need to be in the same proportions as the original image.

Install **Pillow** to use this example:

```bash
pip install Pillow
```

Once Pillow is installed, use the package in the following code example to generate the thumbnail image.

```Python
# Pillow package
from PIL import Image

# IO package to create local image
import io

width = 50
height = 50
url = "http://www.public-domain-photos.com/free-stock-photos-4/travel/san-francisco/golden-gate-bridge-in-san-francisco.jpg"

thumbnail = client.generate_thumbnail(width, height, url)

for x in thumbnail:
    image = Image.open(io.BytesIO(x))

image.save('thumbnail.jpg')
```

## Troubleshooting

### General

When you interact with the [ComputerVisionClient][ref_computervisionclient] client object using the Python SDK, the [`ComputerVisionErrorException`][ref_computervision_computervisionerrorexception] class is used to return errors. Errors returned by the service correspond to the same HTTP status codes returned for REST API requests.

For example, if you try to analyze an image with an invalid key, a `401` error is returned. In the following snippet, the [error][ref_httpfailure] is handled gracefully by catching the exception and displaying additional information about the error.

```Python

domain = "landmarks"
url = "http://www.public-domain-photos.com/free-stock-photos-4/travel/san-francisco/golden-gate-bridge-in-san-francisco.jpg"
language = "en"
max_descriptions = 3

try:
    analysis = client.describe_image(url, max_descriptions, language)

    for caption in analysis.captions:
        print(caption.text)
        print(caption.confidence)
except HTTPFailure as e:
    if e.status_code == 401:
        print("Error unauthorized. Make sure your key and endpoint are correct.")
    else:
        raise
```

### Handle transient errors with retries

While working with the [ComputerVisionClient][ref_computervisionclient] client, you might encounter transient failures caused by [rate limits][computervision_request_units] enforced by the service, or other transient problems like network outages. For information about handling these types of failures, see [Retry pattern][azure_pattern_retry] in the Cloud Design Patterns guide, and the related [Circuit Breaker pattern][azure_pattern_circuit_breaker].

## Next steps

> [!div class="nextstepaction"]
> [Applying content tags to images](../concept-tagging-images.md)

<!-- LINKS -->
[pip]: https://pypi.org/project/pip/
[python]: https://www.python.org/downloads/

[azure_cli]: https://docs.microsoft.com/cli/azure/cognitiveservices/account?view=azure-cli-latest#az-cognitiveservices-account-create
[azure_pattern_circuit_breaker]: https://docs.microsoft.com/azure/architecture/patterns/circuit-breaker
[azure_pattern_retry]: https://docs.microsoft.com/azure/architecture/patterns/retry
[azure_portal]: https://portal.azure.com
[azure_sub]: https://azure.microsoft.com/free/

[cloud_shell]: https://docs.microsoft.com/azure/cloud-shell/overview

[venv]: https://docs.python.org/3/library/venv.html
[virtualenv]: https://virtualenv.pypa.io

[source_code]: https://github.com/Azure/azure-sdk-for-python/tree/master/azure-cognitiveservices-vision-computervision

[pypi_computervision]:https://pypi.org/project/azure-cognitiveservices-vision-computervision/
[pypi_pillow]:https://pypi.org/project/Pillow/

[ref_computervision_sdk]: https://docs.microsoft.com/python/api/azure-cognitiveservices-vision-computervision/azure.cognitiveservices.vision.computervision?view=azure-python
[ref_computervision_computervisionerrorexception]:https://docs.microsoft.com/python/api/azure-cognitiveservices-vision-computervision/azure.cognitiveservices.vision.computervision.models.computervisionerrorexception?view=azure-python
[ref_httpfailure]: https://docs.microsoft.com/python/api/msrest/msrest.exceptions.httpoperationerror?view=azure-python


[computervision_resource]: https://azure.microsoft.com/try/cognitive-services/?

[computervision_docs]: https://docs.microsoft.com/azure/cognitive-services/computer-vision/home

[ref_computervisionclient]: https://docs.microsoft.com/python/api/azure-cognitiveservices-vision-computervision/azure.cognitiveservices.vision.computervision.computervisionclient?view=azure-python

[ref_computervisionclient_analyze_image]: https://docs.microsoft.com/python/api/azure-cognitiveservices-vision-computervision/azure.cognitiveservices.vision.computervision.computervisionclient?view=azure-python

[ref_computervisionclient_list_models]:https://docs.microsoft.com/python/api/azure-cognitiveservices-vision-computervision/azure.cognitiveservices.vision.computervision.computervisionclient?view=azure-python

[ref_computervisionclient_analyze_image_by_domain]:https://docs.microsoft.com/python/api/azure-cognitiveservices-vision-computervision/azure.cognitiveservices.vision.computervision.computervisionclient?view=azure-python

[ref_computervisionclient_describe_image]:https://docs.microsoft.com/python/api/azure-cognitiveservices-vision-computervision/azure.cognitiveservices.vision.computervision.computervisionclient?view=azure-python

[ref_computervisionclient_get_text_operation_result]:https://docs.microsoft.com/python/api/azure-cognitiveservices-vision-computervision/azure.cognitiveservices.vision.computervision.computervisionclient?view=azure-python

[ref_computervisionclient_generate_thumbnail]:https://docs.microsoft.com/python/api/azure-cognitiveservices-vision-computervision/azure.cognitiveservices.vision.computervision.computervisionclient?view=azure-python


[ref_computervision_model_visualfeatures]:https://docs.microsoft.com/python/api/azure-cognitiveservices-vision-computervision/azure.cognitiveservices.vision.computervision.models.visualfeaturetypes?view=azure-python

[ref_computervision_model_textoperationstatuscodes]:https://docs.microsoft.com/python/api/azure-cognitiveservices-vision-computervision/azure.cognitiveservices.vision.computervision.models.textoperationstatuscodes?view=azure-python

[computervision_request_units]:https://azure.microsoft.com/pricing/details/cognitive-services/computer-vision/
