---
title: "Face Python client library quickstart"
description: Use the Face client library for Python to detect faces and identify faces (facial recognition search).
#services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: azure-ai-vision
ms.subservice: azure-ai-face
ms.custom:
  - ignite-2023
ms.topic: include
ms.date: 05/03/2022
ms.author: pafarley
---

Get started with facial recognition using the Face client library for Python. Follow these steps to install the package and try out the example code for basic tasks. The Face service provides you with access to advanced algorithms for detecting and recognizing human faces in images. Follow these steps to install the package and try out the example code for basic face identification using remote images.

[Reference documentation](https://aka.ms/azsdk-python-face-ref) | [Library source code](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/face/azure-ai-vision-face) | [Package (PiPy)](https://aka.ms/azsdk-python-face-pkg) | [Samples](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/face/azure-ai-vision-face/samples)

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/)
* [Python 3.x](https://www.python.org/)
  * Your Python installation should include [pip](https://pip.pypa.io/en/stable/). You can check if you have pip installed by running `pip --version` on the command line. Get pip by installing the latest version of Python.
* Once you have your Azure subscription, <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesFace"  title="Create a Face resource"  target="_blank">create a Face resource</a> in the Azure portal to get your key and endpoint. After it deploys, select **Go to resource**.
    * You'll need the key and endpoint from the resource you create to connect your application to the Face API.
    * You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.


## Create environment variables

[!INCLUDE [create environment variables](../face-environment-variables.md)]

## Identify and verify faces

1. Install the client library

    After installing Python, you can install the client library with:

    ```console
    pip install --upgrade azure-ai-vision-face
    ```

1. Create a new Python application

    Create a new Python script&mdash;*quickstart-file.py*, for example. Then open it in your preferred editor or IDE and paste in the following code.

    > [!NOTE]
    > If you haven't received access to the Face service using the [intake form](https://aka.ms/facerecognition), some of these functions won't work.

    [!code-python[](~/cognitive-services-quickstart-code/python/Face/Quickstart.py?name=snippet_single)]


1. Run your face recognition app from the application directory with the `python` command.

    ```console
    python quickstart-file.py
    ```

    > [!TIP]
    > The Face API runs on a set of pre-built models that are static by nature (the model's performance will not regress or improve as the service is run). The results that the model produces might change if Microsoft updates the model's backend without migrating to an entirely new model version. To take advantage of a newer version of a model, you can retrain your **PersonGroup**, specifying the newer model as a parameter with the same enrollment images.



## Output

```console
Person group: ad12b2db-d892-48ec-837a-0e7168c18224
face 335a2cb1-5211-4c29-9c45-776dd014b2af added to person 9ee65510-81a5-47e5-9e50-66727f719465
face df57eb50-4a13-4f93-b804-cd108327ad5a added to person 9ee65510-81a5-47e5-9e50-66727f719465
face d8b7b8b8-3ca6-4309-b76e-eeed84f7738a added to person 00651036-4236-4004-88b9-11466c251548
face dffbb141-f40b-4392-8785-b6c434fa534e added to person 00651036-4236-4004-88b9-11466c251548
face 9cdac36e-5455-447b-a68d-eb1f5e2ec27d added to person 23614724-b132-407a-aaa0-67003987ce93
face d8208412-92b7-4b8d-a2f8-3926c839c87e added to person 23614724-b132-407a-aaa0-67003987ce93
Train the person group ad12b2db-d892-48ec-837a-0e7168c18224
The person group ad12b2db-d892-48ec-837a-0e7168c18224 is trained successfully.
Pausing for 60 seconds to avoid triggering rate limit on free account...
Identifying faces in image
Person is identified for face ID bc52405a-5d83-4500-9218-557468ccdf99 in image, with a confidence of 0.96726.
verification result: True. confidence: 0.96726
Person is identified for face ID dfcc3fc8-6252-4f3a-8205-71466f39d1a7 in image, with a confidence of 0.96925.
verification result: True. confidence: 0.96925
No person identified for face ID 401c581b-a178-45ed-8205-7692f6eede88 in image.
Person is identified for face ID 8809d9c7-e362-4727-8c95-e1e44f5c2e8a in image, with a confidence of 0.92898.
verification result: True. confidence: 0.92898

The person group ad12b2db-d892-48ec-837a-0e7168c18224 is deleted.

End of quickstart.
```



## Clean up resources

If you want to clean up and remove an Azure AI services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

* [Azure portal](../../../multi-service-resource.md?pivots=azportal#clean-up-resources)
* [Azure CLI](../../../multi-service-resource.md?pivots=azcli#clean-up-resources)

## Next steps

In this quickstart, you learned how to use the Face client library for Python to do basic face identification. Next, learn about the different face detection models and how to specify the right model for your use case.

> [!div class="nextstepaction"]
> [Specify a face detection model version](../../how-to/specify-detection-model.md)

* [What is the Face service?](../../overview-identity.md)
* More extensive sample code can be found on [GitHub](https://aka.ms/FaceSamples).
