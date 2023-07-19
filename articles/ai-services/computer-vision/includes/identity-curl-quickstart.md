---
title: "Face REST API quickstart"
description: Use the Face REST API with cURL to detect and analyze faces.
services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: cognitive-services
ms.subservice: face-api
ms.topic: include
ms.date: 12/06/2020
ms.author: pafarley
---

Get started with facial recognition using the Face REST API. The Face service provides you with access to advanced algorithms for detecting and recognizing human faces in images.

> [!NOTE]
> This quickstart uses cURL commands to call the REST API. You can also call the REST API using a programming language. Complex scenarios like face identification are easier to implement using a language SDK. See the GitHub samples for examples in [C#](https://github.com/Azure-Samples/cognitive-services-quickstart-code/tree/master/dotnet/Face/rest), [Python](https://github.com/Azure-Samples/cognitive-services-quickstart-code/tree/master/python/Face/rest), [Java](https://github.com/Azure-Samples/cognitive-services-quickstart-code/tree/master/java/Face/rest), [JavaScript](https://github.com/Azure-Samples/cognitive-services-quickstart-code/tree/master/javascript/Face/rest), and [Go](https://github.com/Azure-Samples/cognitive-services-quickstart-code/tree/master/go/Face/rest).

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/)
* [!INCLUDE [contributor-requirement](../../includes/quickstarts/contributor-requirement.md)]
* Once you have your Azure subscription, <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesFace"  title="Create a Face resource"  target="_blank">create a Face resource </a> in the Azure portal to get your key and endpoint. After it deploys, select **Go to resource**.
    * You'll need the key and endpoint from the resource you create to connect your application to the Face API. You'll paste your key and endpoint into the code below later in the quickstart.
    * You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.
* [PowerShell version 6.0+](/powershell/scripting/install/installing-powershell-core-on-windows), or a similar command-line application.



## Identify and verify faces

> [!NOTE]
> If you haven't received access to the Face service using the [intake form](https://aka.ms/facerecognition), some of these functions won't work.

1. First, call the Detect API on the source face. This is the face that we'll try to identify from the larger group. Copy the following command to a text editor, insert your own key, and then copy it into a shell window and run it.

    :::code source="~/cognitive-services-quickstart-code/curl/face/detect.sh" ID="identify_detect":::

    Save the returned face ID string to a temporary location. You'll use it again at the end.

1. Next you'll need to create a **LargePersonGroup**. This object will store the aggregated face data of several persons. Run the following command, inserting your own key. Optionally, change the group's name and metadata in the request body.

    :::code source="~/cognitive-services-quickstart-code/curl/face/detect.sh" ID="identify_create_persongroup":::

    Save the returned ID of the created group to a temporary location.

1. Next, you'll create **Person** objects that belong to the group. Run the following command, inserting your own key and the ID of the **LargePersonGroup** from the previous step. This command creates a **Person** named "Family1-Dad".

    :::code source="~/cognitive-services-quickstart-code/curl/face/detect.sh" ID="identify_create_person":::

    After you run this command, run it again with different input data to create more **Person** objects: "Family1-Mom", "Family1-Son", "Family1-Daughter", "Family2-Lady", and "Family2-Man".

    Save the IDs of each **Person** created; it's important to keep track of which person name has which ID.

1. Next you'll need to detect new faces and associate them with the **Person** objects that exist. The following command detects a face from the image *Family1-Dad.jpg* and adds it to the corresponding person. You need to specify the `personId` as the ID that was returned when you created the "Family1-Dad" **Person** object. The image name corresponds to the name of the created **Person**. Also enter the **LargePersonGroup** ID and your key in the appropriate fields.

    :::code source="~/cognitive-services-quickstart-code/curl/face/detect.sh" ID="identify_add_face":::

    Then, run the above command again with a different source image and target **Person**. The images available are: *Family1-Dad1.jpg*, *Family1-Dad2.jpg* *Family1-Mom1.jpg*, *Family1-Mom2.jpg*, *Family1-Son1.jpg*, *Family1-Son2.jpg*, *Family1-Daughter1.jpg*, *Family1-Daughter2.jpg*, *Family2-Lady1.jpg*, *Family2-Lady2.jpg*, *Family2-Man1.jpg*, and *Family2-Man2.jpg*. Be sure that the **Person** whose ID you specify in the API call matches the name of the image file in the request body.

    At the end of this step, you should have multiple **Person** objects that each have one or more corresponding faces, detected directly from the provided images.

1. Next, train the **LargePersonGroup** with the current face data. The training operation teaches the model how to associate facial features, sometimes aggregated from multiple source images, to each single person. Insert the **LargePersonGroup** ID and your key before running the command.

    :::code source="~/cognitive-services-quickstart-code/curl/face/detect.sh" ID="identify_train":::
 
1. Now you're ready to call the Identify API, using the source face ID from the first step and the **LargePersonGroup** ID. Insert these values into the appropriate fields in the request body, and insert your key.

    :::code source="~/cognitive-services-quickstart-code/curl/face/detect.sh" ID="identify_identify":::

    The response should give you a **Person** ID indicating the person identified with the source face. It should be the ID that corresponds to the "Family1-Dad" person, because the source face is of that person.

1. To do face verification, you'll use the **Person** ID returned in the previous step, the **LargePersonGroup** ID, and also the source face ID. Insert these values into the fields in the request body, and insert your key.

    :::code source="~/cognitive-services-quickstart-code/curl/face/detect.sh" ID="verify":::

    The response should give you a boolean verification result along with a confidence value.



## Clean up resources

To delete the **LargePersonGroup** you created in this exercise, run the LargePersonGroup - Delete call.

:::code source="~/cognitive-services-quickstart-code/curl/face/detect.sh" ID="identify_delete":::

If you want to clean up and remove an Azure AI services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

* [Portal](../../multi-service-resource.md?pivots=azportal#clean-up-resources)
* [Azure CLI](../../multi-service-resource.md?pivots=azcli#clean-up-resources)

## Next steps

In this quickstart, you learned how to use the Face REST API to do basic facial recognition tasks. Next, learn about the different face detection models and how to specify the right model for your use case.

> [!div class="nextstepaction"]
> [Specify a face detection model version](../how-to/specify-detection-model.md)

* [What is the Face service?](../overview-identity.md)
