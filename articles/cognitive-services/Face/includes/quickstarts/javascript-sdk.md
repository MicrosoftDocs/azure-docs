---
title: "Face JavaScript client library quickstart"
description: Use the Face client library for JavaScript to detect faces, find similar (face search by image), identify faces (facial recognition search) and migrate your face data.
services: cognitive-services
author: v-jaswel
manager: chrhoder
ms.service: cognitive-services
ms.subservice: face-api
ms.topic: include
ms.date: 11/05/2020
ms.author: v-jawe
---

Get started with facial recognition using the Face client library for JavaScript. Follow these steps to install the package and try out the example code for basic tasks. The Face service provides you with access to advanced algorithms for detecting and recognizing human faces in images.

Use the Face client library for JavaScript to:

* [Detect faces in an image](#detect-faces-in-an-image)
* [Find similar faces](#find-similar-faces)
* [Create a person group](#create-a-person-group)
* [Identify a face](#identify-a-face)

[Reference documentation](/dotnet/api/overview/azure/cognitiveservices/client/faceapi?view=azure-dotnet) | [Library source code](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/cognitiveservices/Vision.Face) | [Package (NuGet)](https://www.nuget.org/packages/Microsoft.Azure.CognitiveServices.Vision.Face/2.6.0-preview.1) | [Samples](/samples/browse/?products=azure&term=face)

## Prerequisites

* The latest version of [Node.js](https://nodejs.org/en/)
* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/)
* Once you have your Azure subscription, <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesFace"  title="Create a Face resource"  target="_blank">create a Face resource <span class="docon docon-navigate-external x-hidden-focus"></span></a> in the Azure portal to get your key and endpoint. After it deploys, click **Go to resource**.
    * You will need the key and endpoint from the resource you create to connect your application to the Face API. You'll paste your key and endpoint into the code below later in the quickstart.
    * You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.

## Setting up

### Install the client library 

In a console window (such as cmd, PowerShell, or Bash), run the following command.

```console
npm install @azure/cognitiveservices-face
```

### Create environment variables

Create the following environment variables:
- FACE_SUBSCRIPTION_KEY. Set the value to your Face subscription key, which is a UUID.
- FACE_ENDPOINT. Set the value to your Face endpoint. An example Face endpoint is https://westus.api.cognitive.microsoft.com/.

> [!IMPORTANT]
> Go to the Azure portal. If the [Product name] resource you created in the **Prerequisites** section deployed successfully, click the **Go to Resource** button under **Next Steps**. You can find your key and endpoint in the resource's **key and endpoint** page, under **resource management**. 

## Object model

The following classes and interfaces handle some of the major features of the Face .NET client library:

|Name|Description|
|---|---|
|[FaceClient](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-face/faceclient?view=azure-node-latest) | This class represents your authorization to use the Face service, and you need it for all Face functionality. You instantiate it with your subscription information, and you use it to produce instances of other classes. |
|[Face](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-face/face?view=azure-node-latest)|This class handles the basic detection and recognition tasks that you can do with human faces. |
|[DetectedFace](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-face/detectedface?view=azure-node-latest)|This class represents all of the data that was detected from a single face in an image. You can use it to retrieve detailed information about the face.|
|[FaceList](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-face/facelist?view=azure-node-latest)|This class manages the cloud-stored **FaceList** constructs, which store an assorted set of faces. |
|[PersonGroupPerson](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-face/persongroupperson?view=azure-node-latest)| This class manages the cloud-stored **Person** constructs, which store a set of faces that belong to a single person.|
|[PersonGroup](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-face/persongroup?view=azure-node-latest)| This class manages the cloud-stored **PersonGroup** constructs, which store a set of assorted **Person** objects. |

## Code examples

The code snippets below show you how to do the following tasks with the Face client library for .NET:

* [Authenticate the client](#authenticate-the-client)
* [Detect faces in an image](#detect-faces-in-an-image)
* [Find similar faces](#find-similar-faces)
* [Create a person group](#create-a-person-group)
* [Identify a face](#identify-a-face)

> [!TIP]
> Want to view the whole quickstart code file at once? You can find it on [GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/dotnet/Face/sdk_quickstart.js), which contains the code examples in this quickstart.

## Add dependencies

Create a new file named `sdk_quickstart.js`. Begin by adding the following dependencies.

:::code language="js" source="~/cognitive-services-quickstart-code/javascript/Face/sdk_quickstart.js" id="dependencies":::

## Authenticate the client

Instantiate a client with your endpoint and key. Create a **[ApiKeyCredentials](https://docs.microsoft.com/javascript/api/@azure/ms-rest-js/apikeycredentials?view=azure-node-latest)** object with your key, and use it with your endpoint to create a **[FaceClient](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-face/faceclient?view=azure-node-latest)** object.

:::code language="js" source="~/cognitive-services-quickstart-code/javascript/Face/sdk_quickstart.js" id="credentials":::

### Declare global values and helper function

The following global values are needed for several of the Face operations you'll add later.

The URL points to a folder of sample images. The UUID will serve as both the name and ID for the PersonGroup you will create.

:::code language="js" source="~/cognitive-services-quickstart-code/javascript/Face/sdk_quickstart.js" id="globals":::

You'll use the following function to wait for the training of the PersonGroup to complete.

:::code language="js" source="~/cognitive-services-quickstart-code/javascript/Face/sdk_quickstart.js" id="helpers":::

## Detect faces in an image

### Get detected face objects

Create a new method to detect faces. The `DetectFaceExtract` method processes three of the images at the given URL and creates a list of **[DetectedFace](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-face/detectedface?view=azure-node-latest)** objects in program memory. The list of **[FaceAttributeType](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-face/faceattributetype?view=azure-node-latest)** values specifies which features to extract. 

The `DetectFaceExtract` method then parses and prints the attribute data for each detected face. Each attribute must be specified separately in the original face detection API call (in the **[FaceAttributeType](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-face/faceattributetype?view=azure-node-latest)** list). The following code processes every attribute, but you will likely only need to use one or a few.

:::code language="js" source="~/cognitive-services-quickstart-code/javascript/Face/sdk_quickstart.js" id="detect":::

> [!TIP]
> You can also detect faces in a local image. See the [Face](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-face/face?view=azure-node-latest) methods such as [DetectWithStreamAsync](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-face/face?view=azure-node-latest#detectWithStream_msRest_HttpRequestBody__FaceDetectWithStreamOptionalParams__ServiceCallback_DetectedFace____).

## Find similar faces

The following code takes a single detected face (source) and searches a set of other faces (target) to find matches (face search by image). When it finds a match, it prints the ID of the matched face to the console.

### Detect faces for comparison

First, define a second face detection method. You need to detect faces in images before you can compare them, and this detection method is optimized for comparison operations. It doesn't extract detailed face attributes like in the section above, and it uses a different recognition model.

:::code language="js" source="~/cognitive-services-quickstart-code/javascript/Face/sdk_quickstart.js" id="recognize":::

### Find matches

The following method detects faces in a set of target images and in a single source image. Then, it compares them and finds all the target images that are similar to the source image. Finally, it prints the match details to the console.

:::code language="js" source="~/cognitive-services-quickstart-code/javascript/Face/sdk_quickstart.js" id="find_similar":::

## Identify a face

The [Identify](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-face/face?view=azure-node-latest#identify_string____FaceIdentifyOptionalParams__ServiceCallback_IdentifyResult____) operation takes an image of a person (or multiple people) and looks to find the identity of each face in the image (facial recognition search). It compares each detected face to a [PersonGroup](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-face/persongroup?view=azure-node-latest), a database of different [Person](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-face/person?view=azure-node-latest) objects whose facial features are known. In order to do the Identify operation, you first need to create and train a [PersonGroup](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-face/persongroup?view=azure-node-latest).

### Add faces to person group

Create the following function to add faces to the [PersonGroup](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-face/persongroup?view=azure-node-latest).

:::code language="js" source="~/cognitive-services-quickstart-code/javascript/Face/sdk_quickstart.js" id="add_faces":::

### Wait for training of person group

Create the following helper function to wait for the person group to finish training.

:::code language="js" source="~/cognitive-services-quickstart-code/javascript/Face/sdk_quickstart.js" id="wait_for_training":::

### Create a person group

The following code:
- Creates a [PersonGroup](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-face/persongroup?view=azure-node-latest)
- Adds faces to the person group by calling `AddFacesToPersonGroup`, which you defined previously.
- Trains the person group.
- Identifies the faces in the person group.

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/Face/FaceQuickstart.cs?name=snippet_persongroup_train)]

This **Person** group and its associated **Person** objects are now ready to be used in the Verify, Identify, or Group operations.

:::code language="js" source="~/cognitive-services-quickstart-code/javascript/Face/sdk_quickstart.js" id="identify":::

> [!TIP]
> You can also create a **PersonGroup** from local images. See the [PersonGroupPerson](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-face/persongroupperson?view=azure-node-latest) methods such as [AddFaceFromStream](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-face/persongroupperson?view=azure-node-latest#addFaceFromStream_string__string__msRest_HttpRequestBody__Models_PersonGroupPersonAddFaceFromStreamOptionalParams_).

## Main

Finally, create the `main` function and call it.

:::code language="js" source="~/cognitive-services-quickstart-code/javascript/Face/sdk_quickstart.js" id="identify":::

---

## Clean up resources

If you want to clean up and remove a Cognitive Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

* [Portal](../../../cognitive-services-apis-create-account.md#clean-up-resources)
* [Azure CLI](../../../cognitive-services-apis-create-account-cli.md#clean-up-resources)

## Next steps

In this quickstart, you learned how to use the Face client library for JavaScript to do basis facial recognition tasks. Next, explore the reference documentation to learn more about the library.

> [!div class="nextstepaction"]
> [Face API reference (JavaScript)](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-face/)

* [What is the Face service?](../../overview.md)
* The source code for this sample can be found on [GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/javascript/Face/sdk_quickstart.js).
