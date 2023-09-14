---
title: "Face Python client library quickstart"
description: Use the Face client library for Python to detect faces and identify faces (facial recognition search).
services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: cognitive-services
ms.subservice: face-api
ms.topic: include
ms.date: 05/03/2022
ms.author: pafarley
---

Get started with facial recognition using the Face client library for Python. Follow these steps to install the package and try out the example code for basic tasks. The Face service provides you with access to advanced algorithms for detecting and recognizing human faces in images. Follow these steps to install the package and try out the example code for basic face identification using remote images.

[Reference documentation](/python/api/overview/azure/cognitiveservices/face-readme) | [Library source code](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/cognitiveservices/azure-cognitiveservices-vision-face) | [Package (PiPy)](https://pypi.org/project/azure-cognitiveservices-vision-face/) | [Samples](/samples/browse/?products=azure&term=face)

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/)
* [Python 3.x](https://www.python.org/)
  * Your Python installation should include [pip](https://pip.pypa.io/en/stable/). You can check if you have pip installed by running `pip --version` on the command line. Get pip by installing the latest version of Python.
* [!INCLUDE [contributor-requirement](../../../includes/quickstarts/contributor-requirement.md)]
* Once you have your Azure subscription, <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesFace"  title="Create a Face resource"  target="_blank">create a Face resource</a> in the Azure portal to get your key and endpoint. After it deploys, select **Go to resource**.
    * You'll need the key and endpoint from the resource you create to connect your application to the Face API.
    * You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.



[!INCLUDE [create environment variables](../environment-variables.md)]

## Identify and verify faces

1. Install the client library

    After installing Python, you can install the client library with:

    ```console
    pip install --upgrade azure-cognitiveservices-vision-face
    ```

1. Create a new Python application

    Create a new Python script&mdash;*quickstart-file.py*, for example. Then open it in your preferred editor or IDE and paste in the following code.

    > [!NOTE]
    > If you haven't received access to the Face service using the [intake form](https://aka.ms/facerecognition), some of these functions won't work.

    [!code-python[](~/cognitive-services-quickstart-code/python/Face/FaceQuickstart-single.py?name=snippet_single)]


1. Run your face recognition app from the application directory with the `python` command.

    ```console
    python quickstart-file.py
    ```

    > [!TIP]
    > The Face API runs on a set of pre-built models that are static by nature (the model's performance will not regress or improve as the service is run). The results that the model produces might change if Microsoft updates the model's backend without migrating to an entirely new model version. To take advantage of a newer version of a model, you can retrain your **PersonGroup**, specifying the newer model as a parameter with the same enrollment images.



## Output

```console
Person group: c8e679eb-0b71-43b4-aa91-ab8200cae7df
face 861d769b-d014-40e8-8b4a-7fd3bc9b425b added to person f80c1cfa-b8cb-46f8-9f7f-e72fbe402bc3
face e3c356a4-1ac3-4c97-9219-14648997f195 added to person f80c1cfa-b8cb-46f8-9f7f-e72fbe402bc3
face f9119820-c374-4c4d-b795-96ae2fec5069 added to person be4084a7-0c7b-4cf9-9463-3756d2e28e17
face 67d626df-3f75-4801-9364-601b63c8296a added to person be4084a7-0c7b-4cf9-9463-3756d2e28e17
face 19e2e8cc-5029-4087-bca0-9f94588fb850 added to person 3ff07c65-6193-4d3e-bf18-d7c106393cd5
face dcc61e80-16b1-4241-ae3f-9721597bae4c added to person 3ff07c65-6193-4d3e-bf18-d7c106393cd5
pg resource is c8e679eb-0b71-43b4-aa91-ab8200cae7df
<msrest.pipeline.ClientRawResponse object at 0x00000240DAD47310>
Training status: running.

Training status: succeeded.

Pausing for 10 seconds to avoid triggering rate limit on free account...
Identifying faces in image
Person for face ID 40582995-d3a8-41c4-a9d1-d17ae6b46c5c is identified in image, with a confidence of 0.96725.
Person for face ID 7a0368a2-332c-4e7a-81c4-2db3d74c78c5 is identified in image, with a confidence of 0.96921.
No person identified for face ID c4a3dd28-ef2d-457e-81d1-a447344242c4 in image.
Person for face ID 360edf1a-1e8f-402d-aa96-1734d0c21c1c is identified in image, with a confidence of 0.92886.
```



## Clean up resources

If you want to clean up and remove an Azure AI services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

* [Portal](../../../multi-service-resource.md?pivots=azportal#clean-up-resources)
* [Azure CLI](../../../multi-service-resource.md?pivots=azcli#clean-up-resources)

To delete the **PersonGroup** you created in this quickstart, run the following code in your script:

[!code-python[](~/cognitive-services-quickstart-code/python/Face/FaceQuickstart.py?name=snippet_deletegroup)]

## Next steps

In this quickstart, you learned how to use the Face client library for Python to do basic face identification. Next, learn about the different face detection models and how to specify the right model for your use case.

> [!div class="nextstepaction"]
> [Specify a face detection model version](../../how-to/specify-detection-model.md)

* [What is the Face service?](../../overview.md)
* More extensive sample code can be found on [GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/python/Face/FaceQuickstart.py).
