---
title: "Quickstart: Optical character recognition client library for Python"
description: Get started with the Optical character recognition client library for Python with this quickstart.
#services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: azure-ai-vision
ms.topic: include
ms.date: 08/07/2023
ms.author: pafarley
---

<a name="HOLTop"></a>

Use the optical character recognition (OCR) client library to read printed and handwritten text from a remote image. The OCR service can read visible text in an image and convert it to a character stream. For more information on text recognition, see the [OCR overview](../../overview-ocr.md).

> [!TIP]
> You can also read text from a local image. See the [ComputerVisionClientOperationsMixin](/python/api/azure-cognitiveservices-vision-computervision/azure.cognitiveservices.vision.computervision.operations.computervisionclientoperationsmixin) methods, such as **read_in_stream**. Or, see the sample code on [GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/python/ComputerVision/ComputerVisionQuickstart.py) for scenarios involving local images.

[Reference documentation](/python/api/azure-cognitiveservices-vision-computervision/azure.cognitiveservices.vision.computervision) | [Library source code](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/cognitiveservices/azure-cognitiveservices-vision-computervision) | [Package (PiPy)](https://pypi.org/project/azure-cognitiveservices-vision-computervision/) | [Samples](/samples/browse/?products=azure&terms=computer-vision)

## Prerequisites

- An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/).
- [Python 3.x](https://www.python.org/).
- Your Python installation should include [pip](https://pip.pypa.io/en/stable/). You can check whether you have pip installed, run `pip --version` on the command line. Get pip by installing the latest version of Python.
- <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesComputerVision" title="create a Vision resource" target="_blank">An Azure AI Vision resource</a>. You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.
- The key and endpoint from the resource you create to connect your application to the Azure AI Vision service.

  1. After your Azure Vision resource deploys, select **Go to resource**.
  1. In the left navigation menu, select **Keys and Endpoint**.
  1. Copy one of the keys and the **Endpoint** for use later in the quickstart.

[!INCLUDE [create environment variables](../environment-variables.md)]

## Read printed and handwritten text

1. Install the client library.

   In a console window, run the following command:

   ```console
   pip install --upgrade azure-cognitiveservices-vision-computervision
   ```

1. Install the Pillow library.

   ```console
   pip install pillow
   ```

1. Create a new Python application file, *quickstart-file.py*. Then open it in your preferred editor or IDE.

1. Replace the contents of *quickstart-file.py* with the following code.

   [!code-python[](~/cognitive-services-quickstart-code/python/ComputerVision/ComputerVisionQuickstart-single.py?name=snippet_single)]

1. As an optional step, see [Determine how to process the data](../../how-to/call-read-api.md#determine-how-to-process-the-data-optional). For example, to explicitly specify the latest GA model, edit the `read` statement as shown. Skipping the parameter or using `"latest"` automatically uses the most recent GA model.

   ```python
      # Call API with URL and raw response (allows you to get the operation location)
      read_response = computervision_client.read(read_image_url,  raw=True, model_version="2022-04-30")
   ```

1. Run the application with the `python` command on your quickstart file.

   ```console
   python quickstart-file.py
   ```

## Output

```output
===== Read File - remote =====
The quick brown fox jumps
[38.0, 650.0, 2572.0, 699.0, 2570.0, 854.0, 37.0, 815.0]
Over
[184.0, 1053.0, 508.0, 1044.0, 510.0, 1123.0, 184.0, 1128.0]
the lazy dog!
[639.0, 1011.0, 1976.0, 1026.0, 1974.0, 1158.0, 637.0, 1141.0]

End of Azure AI Vision quickstart.
```

## Clean up resources

If you want to clean up and remove an Azure AI services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

- [Clean up resources with the Azure portal](../../../multi-service-resource.md?pivots=azportal#clean-up-resources)
- [Clean up resources with Azure CLI](../../../multi-service-resource.md?pivots=azcli#clean-up-resources)

## Next steps

In this quickstart, you learned how to install the OCR client library and use the Read API. Next, learn more about the Read API features.

> [!div class="nextstepaction"]
>[Call the Read API](../../how-to/call-read-api.md)

- [OCR overview](../../overview-ocr.md)
- The source code for this sample can be found on [GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/python/ComputerVision/ComputerVisionQuickstart.py).
