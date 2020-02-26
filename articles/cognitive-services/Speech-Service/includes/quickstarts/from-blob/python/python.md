---
author: IEvangelist
ms.service: cognitive-services
ms.topic: include
ms.date: 01/13/2020
ms.author: dapine
---

## Prerequisites

Before you get started, make sure to:

> [!div class="checklist"]
> * [Setup your development environment](../../../../quickstarts/setup-platform.md)
> * [Create an empty sample project](../../../../quickstarts/create-project.md)
> * [Create an Azure Speech resource](../../../../get-started.md)
> * [Upload a source file to an Azure blob](https://docs.microsoft.com/azure/storage/blobs/storage-quickstart-blobs-portal)

## Download and install the API client library

To execute the sample you need to generate the Python library for the REST API which is generated through [Swagger](https://swagger.io).

Follow these steps for the installation:

1. Go to https://editor.swagger.io.
1. Click **File**, then click **Import URL**.
1. Enter the Swagger URL including the region for your Speech service subscription: `https://<your-region>.cris.ai/docs/v2.0/swagger`.
1. Click **Generate Client** and select **Python**.
1. Save the client library.
1. Extract the downloaded python-client-generated.zip somewhere in your file system.
1. Install the extracted python-client module in your Python environment using pip: `pip install path/to/package/python-client`.
1. The installed package has the name `swagger_client`. You can check that the installation worked using the command `python -c "import swagger_client"`.

> [!NOTE]
> Due to a [known bug in the Swagger autogeneration](https://github.com/swagger-api/swagger-codegen/issues/7541), you might encounter errors on importing the `swagger_client` package.
> These can be fixed by deleting the line with the content
> ```py
> from swagger_client.models.model import Model  # noqa: F401,E501
> ```
> from the file `swagger_client/models/model.py` and the line with the content
> ```py
> from swagger_client.models.inner_error import InnerError  # noqa: F401,E501
> ```
> from the file `swagger_client/models/inner_error.py` inside the installed package. The error message will tell you where these files are located for your installation.

## Install other dependencies

The sample uses the `requests` library. You can install it with the command

```bash
pip install requests
```

## Start with some boilerplate code

Let's add some code that works as a skeleton for our project.

[!code-python[](~/samples-cognitive-services-speech-sdk/quickstart/python/from-blob/python-client/main.py?range=1-2,7-34,115-119)]

[!INCLUDE [placeholder-replacements](../placeholder-replacement.md)]

## Create and configure an Http Client
The first thing we'll need is an Http Client that has a correct base URL and authentication set.
Insert this code in `transcribe`
[!code-python[](~/samples-cognitive-services-speech-sdk/quickstart/python/from-blob/python-client/main.py?range=37-45)]

## Generate a transcription request
Next, we'll generate the transcription request. Add this code to `transcribe`
[!code-python[](~/samples-cognitive-services-speech-sdk/quickstart/python/from-blob/python-client/main.py?range=52-54)]

## Send the request and check its status
Now we post the request to the Speech service and check the initial response code. This response code will simply indicate if the service has received the request. The service will return a Url in the response headers that's the location where it will store the transcription status.
[!code-python[](~/samples-cognitive-services-speech-sdk/quickstart/python/from-blob/python-client/main.py?range=65-73)]

## Wait for the transcription to complete
Since the service processes the transcription asynchronously, we need to poll for its status every so often. We'll check every 5 seconds.

We'll enumerate all the transcriptions that this Speech service resource is processing and look for the one we created.

Here's the polling code with status display for everything except a successful completion, we'll do that next.
[!code-python[](~/samples-cognitive-services-speech-sdk/quickstart/python/from-blob/python-client/main.py?range=75-94,99-112)]

## Display the transcription results
Once the service has successfully completed the transcription the results will be stored in another Url that we can get from the status response.

Here we get that result JSON and display it.
[!code-python[](~/samples-cognitive-services-speech-sdk/quickstart/python/from-blob/python-client/main.py?range=95-98)]

## Check your code
At this point, your code should look like this: 
(We've added some comments to this version)
[!code-python[](~/samples-cognitive-services-speech-sdk/quickstart/python/from-blob/python-client/main.py?range=1-118)]

## Build and run your app

Now you're ready to build your app and test our speech recognition using the Speech service.

## Next steps

[!INCLUDE [footer](./footer.md)]
