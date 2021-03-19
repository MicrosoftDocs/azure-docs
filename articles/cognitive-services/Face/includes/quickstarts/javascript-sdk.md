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

## Quickstart: Face client library for JavaScript

Get started with facial recognition using the Face client library for JavaScript. Follow these steps to install the package and try out the example code for basic tasks. The Face service provides you with access to advanced algorithms for detecting and recognizing human faces in images.

Use the Face client library for JavaScript to:

* [Detect faces in an image](#detect-faces-in-an-image)
* [Find similar faces](#find-similar-faces)
* [Create a person group](#create-a-person-group)
* [Identify a face](#identify-a-face)

[Reference documentation](/javascript/api/@azure/cognitiveservices-face/) | [Library source code](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/cognitiveservices/cognitiveservices-face) | [Package (npm)](https://www.npmjs.com/package/@azure/cognitiveservices-face) | [Samples](/samples/browse/?products=azure&term=face&languages=javascript)

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/)
* The latest version of [Node.js](https://nodejs.org/en/)
* Once you have your Azure subscription, [Create a Face resource](https://portal.azure.com/#create/Microsoft.CognitiveServicesFace) in the Azure portal to get your key and endpoint. After it deploys, click **Go to resource**.
    * You will need the key and endpoint from the resource you create to connect your application to the Face API. You'll paste your key and endpoint into the code below later in the quickstart.
    * You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.

## Setting up

### Create a new Node.js application

In a console window (such as cmd, PowerShell, or Bash), create a new directory for your app, and navigate to it. 

```console
mkdir myapp && cd myapp
```

Run the `npm init` command to create a node application with a `package.json` file. 

```console
npm init
```

### Install the client library 

Install the `ms-rest-azure` and `azure-cognitiveservices-face` NPM packages:

```console
npm install @azure/cognitiveservices-face @azure/ms-rest-js
```

Your app's `package.json` file will be updated with the dependencies.

Create a file named `index.js` and import the following libraries:

> [!TIP]
> Want to view the whole quickstart code file at once? You can find it on [GitHub](), which contains the code examples in this quickstart.

```javascript
const msRest = require("@azure/ms-rest-js");
const Face = require("@azure/cognitiveservices-face");
const uuid = require("uuid/v4");
```

Create variables for your resource's Azure endpoint and key. 

> [!IMPORTANT]
> Go to the Azure portal. If the Face resource you created in the **Prerequisites** section deployed successfully, click the **Go to Resource** button under **Next Steps**. You can find your key and endpoint in the resource's **key and endpoint** page, under **resource management**. 
>
> Remember to remove the key from your code when you're done, and never post it publicly. For production, consider using a secure way of storing and accessing your credentials. See the Cognitive Services [security](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-security) article for more information.

```javascript
key = "<paste-your-face-key-here>"
endpoint = "<paste-your-face-endpoint-here>"
```

## Object model

The following classes and interfaces handle some of the major features of the Face .NET client library:

|Name|Description|
|---|---|
|[FaceClient](/javascript/api/@azure/cognitiveservices-face/faceclient) | This class represents your authorization to use the Face service, and you need it for all Face functionality. You instantiate it with your subscription information, and you use it to produce instances of other classes. |
|[Face](/javascript/api/@azure/cognitiveservices-face/face)|This class handles the basic detection and recognition tasks that you can do with human faces. |
|[DetectedFace](/javascript/api/@azure/cognitiveservices-face/detectedface)|This class represents all of the data that was detected from a single face in an image. You can use it to retrieve detailed information about the face.|
|[FaceList](/javascript/api/@azure/cognitiveservices-face/facelist)|This class manages the cloud-stored **FaceList** constructs, which store an assorted set of faces. |
|[PersonGroupPerson](/javascript/api/@azure/cognitiveservices-face/persongroupperson)| This class manages the cloud-stored **Person** constructs, which store a set of faces that belong to a single person.|
|[PersonGroup](/javascript/api/@azure/cognitiveservices-face/persongroup)| This class manages the cloud-stored **PersonGroup** constructs, which store a set of assorted **Person** objects. |

## Code examples

The code snippets below show you how to do the following tasks with the Face client library for .NET:

* [Authenticate the client](#authenticate-the-client)
* [Detect faces in an image](#detect-faces-in-an-image)
* [Find similar faces](#find-similar-faces)
* [Create a person group](#create-a-person-group)
* [Identify a face](#identify-a-face)

> [!TIP]
> Want to view the whole quickstart code file at once? You can find it on [GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/javascript/Face/sdk_quickstart.js), which contains the code examples in this quickstart.

## Authenticate the client

Instantiate a client with your endpoint and key. Create a **[ApiKeyCredentials](https://docs.microsoft.com/javascript/api/@azure/ms-rest-js/apikeycredentials)** object with your key, and use it with your endpoint to create a **[FaceClient](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-face/faceclient)** object.

:::code language="js" source="~/cognitive-services-quickstart-code/javascript/Face/sdk_quickstart.js" id="credentials":::

## Declare global values and helper function

The following global values are needed for several of the Face operations you'll add later.

The URL points to a folder of sample images. The UUID will serve as both the name and ID for the PersonGroup you will create.

:::code language="js" source="~/cognitive-services-quickstart-code/javascript/Face/sdk_quickstart.js" id="globals":::

You'll use the following function to wait for the training of the PersonGroup to complete.

:::code language="js" source="~/cognitive-services-quickstart-code/javascript/Face/sdk_quickstart.js" id="helpers":::

## Detect faces in an image

### Get detected face objects

Create a new method to detect faces. The `DetectFaceExtract` method processes three of the images at the given URL and creates a list of **[DetectedFace](/javascript/api/@azure/cognitiveservices-face/detectedface)** objects in program memory. The list of **[FaceAttributeType](/javascript/api/@azure/cognitiveservices-face/faceattributetype)** values specifies which features to extract. 

The `DetectFaceExtract` method then parses and prints the attribute data for each detected face. Each attribute must be specified separately in the original face detection API call (in the **[FaceAttributeType](/javascript/api/@azure/cognitiveservices-face/faceattributetype)** list). The following code processes every attribute, but you will likely only need to use one or a few.

:::code language="js" source="~/cognitive-services-quickstart-code/javascript/Face/sdk_quickstart.js" id="detect":::

> [!TIP]
> You can also detect faces in a local image. See the [Face](/javascript/api/@azure/cognitiveservices-face/face) methods such as [DetectWithStreamAsync](/javascript/api/@azure/cognitiveservices-face/face#detectWithStream_msRest_HttpRequestBody__FaceDetectWithStreamOptionalParams__ServiceCallback_DetectedFace____).

## Find similar faces

The following code takes a single detected face (source) and searches a set of other faces (target) to find matches (face search by image). When it finds a match, it prints the ID of the matched face to the console.

### Detect faces for comparison

First, define a second face detection method. You need to detect faces in images before you can compare them, and this detection method is optimized for comparison operations. It doesn't extract detailed face attributes like in the section above, and it uses a different recognition model.

:::code language="js" source="~/cognitive-services-quickstart-code/javascript/Face/sdk_quickstart.js" id="recognize":::

### Find matches

The following method detects faces in a set of target images and in a single source image. Then, it compares them and finds all the target images that are similar to the source image. Finally, it prints the match details to the console.

:::code language="js" source="~/cognitive-services-quickstart-code/javascript/Face/sdk_quickstart.js" id="find_similar":::

## Identify a face

The [Identify](/javascript/api/@azure/cognitiveservices-face/face#identify_string____FaceIdentifyOptionalParams__ServiceCallback_IdentifyResult____) operation takes an image of a person (or multiple people) and looks to find the identity of each face in the image (facial recognition search). It compares each detected face to a [PersonGroup](/javascript/api/@azure/cognitiveservices-face/persongroup), a database of different [Person](/javascript/api/@azure/cognitiveservices-face/person) objects whose facial features are known. In order to do the Identify operation, you first need to create and train a [PersonGroup](/javascript/api/@azure/cognitiveservices-face/persongroup).

### Add faces to person group

Create the following function to add faces to the [PersonGroup](/javascript/api/@azure/cognitiveservices-face/persongroup).

:::code language="js" source="~/cognitive-services-quickstart-code/javascript/Face/sdk_quickstart.js" id="add_faces":::

### Wait for training of person group

Create the following helper function to wait for the person group to finish training.

:::code language="js" source="~/cognitive-services-quickstart-code/javascript/Face/sdk_quickstart.js" id="wait_for_training":::

### Create a person group

The following code:
- Creates a [PersonGroup](/javascript/api/@azure/cognitiveservices-face/persongroup)
- Adds faces to the person group by calling `AddFacesToPersonGroup`, which you defined previously.
- Trains the person group.
- Identifies the faces in the person group.

This **Person** group and its associated **Person** objects are now ready to be used in the Verify, Identify, or Group operations.

:::code language="js" source="~/cognitive-services-quickstart-code/javascript/Face/sdk_quickstart.js" id="identify":::

> [!TIP]
> You can also create a **PersonGroup** from local images. See the [PersonGroupPerson](/javascript/api/@azure/cognitiveservices-face/persongroupperson) methods such as [AddFaceFromStream](/javascript/api/@azure/cognitiveservices-face/persongroupperson#addFaceFromStream_string__string__msRest_HttpRequestBody__Models_PersonGroupPersonAddFaceFromStreamOptionalParams_).

## Main

Finally, create the `main` function and call it.

:::code language="js" source="~/cognitive-services-quickstart-code/javascript/Face/sdk_quickstart.js" id="main":::

## Run the application

Run the application with the `node` command on your quickstart file.

```console
node index.js
```

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
