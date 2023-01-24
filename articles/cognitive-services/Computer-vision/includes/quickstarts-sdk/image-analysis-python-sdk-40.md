---
title: "Quickstart: Image Analysis 4.0 client library for Python"
description: Get started with the Image Analysis 4.0 client library for Python with this quickstart.
services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: cognitive-services
ms.subservice: computer-vision
ms.custom: ignite-2022
ms.topic: include
ms.date: 01/24/2023
ms.author: pafarley
---

<a name="HOLTop"></a>

Use the Image Analysis client library for Python to analyze a remote image for content tags.

> [!TIP]
> You can also analyze a local image. See the [ComputerVisionClientOperationsMixin](tbd) methods, such as **tbd**. Or, see the sample code on [GitHub](tbd) for scenarios involving local images.

> [!TIP]
> The Analyze API can do many different operations other than generate image tags. See the [Image Analysis how-to guide](../../how-to/call-analyze-image-40.md) for examples that showcase all of the available features.

[Reference documentation](tbd) | [Library source code](tbd) | [Package (PiPy)](tbd) | [Samples](tbd)

## Prerequisites

* An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/)
* [Python 3.x](https://www.python.org/)
  * Your Python installation should include [pip](https://pip.pypa.io/en/stable/). You can check if you have pip installed by running `pip --version` on the command line. Get pip by installing the latest version of Python.
* Once you have your Azure subscription, <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesComputerVision"  title="Create a Computer Vision resource"  target="_blank">create a Computer Vision resource</a> in the Azure portal to get your key and endpoint. After it deploys, click **Go to resource**.

    * You will need the key and endpoint from the resource you create to connect your application to the Computer Vision service. You'll paste your key and endpoint into the code below later in the quickstart.
    * You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=PYTHON&Pillar=Vision&Product=Image-analysis&Page=quickstart&Section=Prerequisites" target="_target">I ran into an issue</a>

## Analyze image

1. Install the client library.

    You can install the client library with:

    ```console
    pip install --upgrade azure-cognitiveservices-vision-computervision
    ```

    [installation path?](tbd)

1. Create a new Python application.

    Create a new Python file&mdash;*quickstart-file.py*, for example. 

1. Find the key and endpoint.

    [!INCLUDE [find key and endpoint](../find-key.md)]

1. Open *quickstart-file.py* in a text editor or IDE and paste in the following code.

   [!code-python[](~/cognitive-services-quickstart-code/python/ComputerVision/ImageAnalysisQuickstart-single-40.py?name=snippet_single)]

1. Paste your key and endpoint into the code where indicated. Your Computer Vision endpoint has the form `https://<your_computer_vision_resource_name>.cognitiveservices.azure.com/`.

   > [!IMPORTANT]
   > Remember to remove the key from your code when you're done, and never post it publicly. For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](../../../../key-vault/general/overview.md). See the Cognitive Services [security](../../../cognitive-services-security.md) article for more information.

1. Run the application with the `python` command on your quickstart file.

   ```console
   python quickstart-file.py
   ```

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=PYTHON&Pillar=Vision&Product=Image-analysis&Page=quickstart&Section=Analyze-image" target="_target">I ran into an issue</a>

## Output

```console
tbd
```

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=PYTHON&Pillar=Vision&Product=Image-analysis&Page=quickstart&Section=Output" target="_target">I ran into an issue</a>

## Clean up resources

If you want to clean up and remove a Cognitive Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

* [Portal](../../../cognitive-services-apis-create-account.md#clean-up-resources)
* [Azure CLI](../../../cognitive-services-apis-create-account-cli.md#clean-up-resources)


## Next steps

In this quickstart, you learned how to install the Image Analysis client library and make basic image analysis calls. Next, learn more about the Analyze API features.

> [!div class="nextstepaction"]
>[Call the Analyze API](../../how-to/call-analyze-image-40.md)

* [Image Analysis overview](../../overview-image-analysis.md)
* The source code for this sample can be found on [GitHub](tbd).
