---
title: "Face Python client library quickstart"
description: Use the Face client library for Python to detect faces, find similar (face search by image), and identify faces (facial recognition search).
services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: cognitive-services
ms.subservice: face-api
ms.topic: include
ms.date: 10/07/2020
ms.author: pafarley
---
Get started with facial recognition using the Face client library for Python. Follow these steps to install the package and try out the example code for basic tasks. The Face service provides you with access to advanced algorithms for detecting and recognizing human faces in images.

Use the Face client library for Python to:

* Detect faces in an image
* Find similar faces
* Create and train a person group
* Identify a face
* Verify faces

[Reference documentation](https://docs.microsoft.com/python/api/azure-cognitiveservices-vision-face/?view=azure-python) | [Library source code](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/cognitiveservices/azure-cognitiveservices-vision-face) | [Package (PiPy)](https://pypi.org/project/azure-cognitiveservices-vision-face/) | [Samples](https://docs.microsoft.com/samples/browse/?products=azure&term=face)

## Prerequisites

* [Python 3.x](https://www.python.org/)
* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/)
* Once you have your Azure subscription, <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesFace"  title="Create a Face resource"  target="_blank">create a Face resource <span class="docon docon-navigate-external x-hidden-focus"></span></a> in the Azure portal to get your key and endpoint. After it deploys, click **Go to resource**.
    * You will need the key and endpoint from the resource you create to connect your application to the Face API. You'll paste your key and endpoint into the code below later in the quickstart.
    * You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.
* After you get a key and endpoint, [create environment variables](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account#configure-an-environment-variable-for-authentication) for the key and endpoint, named `FACE_SUBSCRIPTION_KEY` and `FACE_ENDPOINT`, respectively.

## Setting up
 
### Create a new Python application

Create a new Python script&mdash;*quickstart-file.py*, for example. Then open it in your preferred editor or IDE and import the following libraries.

[!code-python[](~/cognitive-services-quickstart-code/python/Face/FaceQuickstart.py?name=snippet_imports)]

Then, create variables for your resource's Azure endpoint and key.

[!code-python[](~/cognitive-services-quickstart-code/python/Face/FaceQuickstart.py?name=snippet_subvars)]

> [!NOTE]
> If you created the environment variable after you launched the application, you will need to close and reopen the editor, IDE, or shell running it to access the variable.

### Install the client library

You can install the client library with:

```console
pip install --upgrade azure-cognitiveservices-vision-face
```

## Object model

The following classes and interfaces handle some of the major features of the Face Python client library.

|Name|Description|
|---|---|
|[FaceClient](https://docs.microsoft.com/python/api/azure-cognitiveservices-vision-face/azure.cognitiveservices.vision.face.faceclient?view=azure-python) | This class represents your authorization to use the Face service, and you need it for all Face functionality. You instantiate it with your subscription information, and you use it to produce instances of other classes. |
|[FaceOperations](https://docs.microsoft.com/python/api/azure-cognitiveservices-vision-face/azure.cognitiveservices.vision.face.operations.faceoperations?view=azure-python)|This class handles the basic detection and recognition tasks that you can do with human faces. |
|[DetectedFace](https://docs.microsoft.com/python/api/azure-cognitiveservices-vision-face/azure.cognitiveservices.vision.face.models.detectedface?view=azure-python)|This class represents all of the data that was detected from a single face in an image. You can use it to retrieve detailed information about the face.|
|[FaceListOperations](https://docs.microsoft.com/python/api/azure-cognitiveservices-vision-face/azure.cognitiveservices.vision.face.operations.facelistoperations?view=azure-python)|This class manages the cloud-stored **FaceList** constructs, which store an assorted set of faces. |
|[PersonGroupPersonOperations](https://docs.microsoft.com/python/api/azure-cognitiveservices-vision-face/azure.cognitiveservices.vision.face.operations.persongrouppersonoperations?view=azure-python)| This class manages the cloud-stored **Person** constructs, which store a set of faces that belong to a single person.|
|[PersonGroupOperations](https://docs.microsoft.com/python/api/azure-cognitiveservices-vision-face/azure.cognitiveservices.vision.face.operations.persongroupoperations?view=azure-python)| This class manages the cloud-stored **PersonGroup** constructs, which store a set of assorted **Person** objects. |
|[ShapshotOperations](https://docs.microsoft.com/python/api/azure-cognitiveservices-vision-face/azure.cognitiveservices.vision.face.operations.snapshotoperations?view=azure-python)|This class manages the Snapshot functionality; you can use it to temporarily save all of your cloud-based face data and migrate that data to a new Azure subscription. |

## Code examples

These code snippets show you how to do the following tasks with the Face client library for Python:

* [Authenticate the client](#authenticate-the-client)
* [Detect faces in an image](#detect-faces-in-an-image)
* [Find similar faces](#find-similar-faces)
* [Create and train a person group](#create-and-train-a-person-group)
* [Identify a face](#identify-a-face)
* [Verify faces](#verify-faces)

## Authenticate the client

> [!NOTE]
> This quickstart assumes you've [created an environment variable](../../../cognitive-services-apis-create-account.md#configure-an-environment-variable-for-authentication) for your Face key, named `FACE_SUBSCRIPTION_KEY`.

Instantiate a client with your endpoint and key. Create a [CognitiveServicesCredentials](https://docs.microsoft.com/python/api/msrest/msrest.authentication.cognitiveservicescredentials?view=azure-python) object with your key, and use it with your endpoint to create a [FaceClient](https://docs.microsoft.com/python/api/azure-cognitiveservices-vision-face/azure.cognitiveservices.vision.face.faceclient?view=azure-python) object.

[!code-python[](~/cognitive-services-quickstart-code/python/Face/FaceQuickstart.py?name=snippet_auth)]

## Detect faces in an image

The following code detects a face in a remote image. It prints the detected face's ID to the console and also stores it in program memory. Then, it detects the faces in an image with multiple people and prints their IDs to the console as well. By changing the parameters in the [detect_with_url](https://docs.microsoft.com/python/api/azure-cognitiveservices-vision-face/azure.cognitiveservices.vision.face.operations.faceoperations?view=azure-python#detect-with-url-url--return-face-id-true--return-face-landmarks-false--return-face-attributes-none--recognition-model--recognition-01---return-recognition-model-false--detection-model--detection-01---custom-headers-none--raw-false----operation-config-) method, you can return different information with each [DetectedFace](https://docs.microsoft.com/python/api/azure-cognitiveservices-vision-face/azure.cognitiveservices.vision.face.models.detectedface?view=azure-python) object.

[!code-python[](~/cognitive-services-quickstart-code/python/Face/FaceQuickstart.py?name=snippet_detect)]

See the sample code on [GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/python/Face/FaceQuickstart.py) for more detection scenarios.

### Display and frame faces

The following code outputs the given image to the display and draws rectangles around the faces, using the DetectedFace.faceRectangle property.

[!code-python[](~/cognitive-services-quickstart-code/python/Face/FaceQuickstart.py?name=snippet_frame)]

![A young woman with a red rectangle drawn around the face](../../images/face-rectangle-result.png)

## Find similar faces

The following code takes a single detected face (source) and searches a set of other faces (target) to find matches (face search by image). When it finds a match, it prints the ID of the matched face to the console.

### Find matches

First, run the code in the above section ([Detect faces in an image](#detect-faces-in-an-image)) to save a reference to a single face. Then run the following code to get references to several faces in a group image.

[!code-python[](~/cognitive-services-quickstart-code/python/Face/FaceQuickstart.py?name=snippet_detectgroup)]

Then add the following code block to find instances of the first face in the group. See the [find_similar](https://docs.microsoft.com/python/api/azure-cognitiveservices-vision-face/azure.cognitiveservices.vision.face.operations.faceoperations?view=azure-python#find-similar-face-id--face-list-id-none--large-face-list-id-none--face-ids-none--max-num-of-candidates-returned-20--mode--matchperson---custom-headers-none--raw-false----operation-config-) method to learn how to modify this behavior.

[!code-python[](~/cognitive-services-quickstart-code/python/Face/FaceQuickstart.py?name=snippet_findsimilar)]

### Print matches

Use the following code to print the match details to the console.

[!code-python[](~/cognitive-services-quickstart-code/python/Face/FaceQuickstart.py?name=snippet_findsimilar_print)]

## Create and train a person group

The following code creates a **PersonGroup** with three different **Person** objects. It associates each **Person** with a set of example images, and then it trains to be able to recognize each person. 

### Create PersonGroup

To step through this scenario, you need to save the following images to the root directory of your project: https://github.com/Azure-Samples/cognitive-services-sample-data-files/tree/master/Face/images.

This group of images contains three sets of face images corresponding to three different people. The code will define three **Person** objects and associate them with image files that start with `woman`, `man`, and `child`.

Once you've set up your images, define a label at the top of your script for the **PersonGroup** object you'll create.

[!code-python[](~/cognitive-services-quickstart-code/python/Face/FaceQuickstart.py?name=snippet_persongroupvars)]

Then add the following code to the bottom of your script. This code creates a **PersonGroup** and three **Person** objects.

[!code-python[](~/cognitive-services-quickstart-code/python/Face/FaceQuickstart.py?name=snippet_persongroup_create)]

### Assign faces to Persons

The following code sorts your images by their prefix, detects faces, and assigns the faces to each **Person** object.

[!code-python[](~/cognitive-services-quickstart-code/python/Face/FaceQuickstart.py?name=snippet_persongroup_assign)]

### Train PersonGroup

Once you've assigned faces, you must train the **PersonGroup** so that it can identify the visual features associated with each of its **Person** objects. The following code calls the asynchronous **train** method and polls the result, printing the status to the console.

[!code-python[](~/cognitive-services-quickstart-code/python/Face/FaceQuickstart.py?name=snippet_persongroup_train)]

## Identify a face

The Identify operation takes an image of a person (or multiple people) and looks to find the identity of each face in the image (facial recognition search). It compares each detected face to a **PersonGroup**, a database of different **Person** objects whose facial features are known.

> [!IMPORTANT]
> In order to run this example, you must first run the code in [Create and train a person group](#create-and-train-a-person-group).

### Get a test image

The following code looks in the root of your project for an image _test-image-person-group.jpg_ and detects the faces in the image. You can find this image with the images used for **PersonGroup** management: https://github.com/Azure-Samples/cognitive-services-sample-data-files/tree/master/Face/images.

[!code-python[](~/cognitive-services-quickstart-code/python/Face/FaceQuickstart.py?name=snippet_identify_testimage)]

### Identify faces

The **identify** method takes an array of detected faces and compares them to a **PersonGroup**. If it can match a detected face to a **Person**, it saves the result. This code prints detailed match results to the console.

[!code-python[](~/cognitive-services-quickstart-code/python/Face/FaceQuickstart.py?name=snippet_identify)]

## Verify faces

The Verify operation takes a face ID and either another face ID or a **Person** object and determines whether they belong to the same person.

The following code detects faces in two source images and then verifies them against a face detected from a target image.

### Get test images

The following code blocks declare variables that will point to the source and target images for the verification operation.

[!code-python[](~/cognitive-services-quickstart-code/python/Face/FaceQuickstart.py?name=snippet_verify_baseurl)]

[!code-python[](~/cognitive-services-quickstart-code/python/Face/FaceQuickstart.py?name=snippet_verify_photos)]

### Detect faces for verification

The following code detects faces in the source and target images and saves them to variables.

[!code-python[](~/cognitive-services-quickstart-code/python/Face/FaceQuickstart.py?name=snippet_verify_detect)]

### Get verification results

The following code compares each of the source images to the target image and prints a message indicating whether they belong to the same person.

[!code-python[](~/cognitive-services-quickstart-code/python/Face/FaceQuickstart.py?name=snippet_verify)]

## Run the application

Run your face recognition app from the application directory with the `python` command.

```console
python quickstart-file.py
```

## Clean up resources

If you want to clean up and remove a Cognitive Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

* [Portal](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account#clean-up-resources)
* [Azure CLI](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account-cli#clean-up-resources)

If you created a **PersonGroup** in this quickstart and you want to delete it, run the following code in your script:

[!code-python[](~/cognitive-services-quickstart-code/python/Face/FaceQuickstart.py?name=snippet_deletegroup)]

## Next steps

In this quickstart, you learned how to use the Face client library for Python to do basis facial recognition tasks. Next, explore the reference documentation to learn more about the library.

> [!div class="nextstepaction"]
> [Face API reference (Python)](https://docs.microsoft.com/python/api/azure-cognitiveservices-vision-face/?view=azure-python)

* [What is the Face service?](../../overview.md)
* The source code for this sample can be found on [GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/python/Face/FaceQuickstart.py).
