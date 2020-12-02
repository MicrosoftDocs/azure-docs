---
title: "Face REST API quickstart"
description: Use the Face REST API with cURL to detect faces, find similar (face search by image), identify faces (facial recognition search) and migrate your face data.
services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: cognitive-services
ms.subservice: face-api
ms.topic: include
ms.date: 12/02/2020
ms.author: pafarley
---

Get started with facial recognition using the Face REST API. The Face service provides you with access to advanced algorithms for detecting and recognizing human faces in images.

Use the Face REST API to:

* [Detect faces in an image](#detect-faces-in-an-image)
* [Find similar faces](#find-similar-faces)
* [Create a person group](#create-a-person-group)
* [Identify a face](#identify-a-face)

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/)
* Once you have your Azure subscription, <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesFace"  title="Create a Face resource"  target="_blank">create a Face resource <span class="docon docon-navigate-external x-hidden-focus"></span></a> in the Azure portal to get your key and endpoint. After it deploys, click **Go to resource**.
    * You will need the key and endpoint from the resource you create to connect your application to the Face API. You'll paste your key and endpoint into the code below later in the quickstart.
    * You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.


## Detect faces in an image

You'll use a command like the following to call the Face API and get face attribute data from an image. First, copy the code into a text editor&mdash;you'll need to make changes to certain parts of the command before you can run it.

:::code language="shell" source="~/cognitive-services-quickstart-code/curl/face/detect.sh" id="detection_model_2":::

Make the following changes:
1. Assign `Ocp-Apim-Subscription-Key` to your valid Face subscription key.
1. Change the first part of the query URL to match the endpoint that corresponds to your subscription key.
  [!INCLUDE [subdomains-note](../../../../includes/cognitive-services-custom-subdomains-note.md)]
1. Optionally change the URL in the body of the request to point to a different image.

Once you've made your changes, open a command prompt and enter the new command. 

### Examine the results

You should see the face information displayed as JSON data in the console window. For example:

```json
[
  {
    "faceId": "49d55c17-e018-4a42-ba7b-8cbbdfae7c6f",
    "faceRectangle": {
      "top": 131,
      "left": 177,
      "width": 162,
      "height": 162
    }
  }
]  
```

### Get face attributes
 
To extract face attributes, call the Detect API again, but set `detectionModel` to `detection_01`. Add the `returnFaceAttributes` query parameter as well. The command should now look like the following. As before, insert your Face subscription key and endpoint.

:::code language="shell" source="~/cognitive-services-quickstart-code/curl/face/detect.sh" id="detection_model_1":::

### Examine the results

The returned face information now includes face attributes. For example:

```json
[
  {
    "faceId": "49d55c17-e018-4a42-ba7b-8cbbdfae7c6f",
    "faceRectangle": {
      "top": 131,
      "left": 177,
      "width": 162,
      "height": 162
    },
    "faceAttributes": {
      "smile": 0,
      "headPose": {
        "pitch": 0,
        "roll": 0.1,
        "yaw": -32.9
      },
      "gender": "female",
      "age": 22.9,
      "facialHair": {
        "moustache": 0,
        "beard": 0,
        "sideburns": 0
      },
      "glasses": "NoGlasses",
      "emotion": {
        "anger": 0,
        "contempt": 0,
        "disgust": 0,
        "fear": 0,
        "happiness": 0,
        "neutral": 0.986,
        "sadness": 0.009,
        "surprise": 0.005
      },
      "blur": {
        "blurLevel": "low",
        "value": 0.06
      },
      "exposure": {
        "exposureLevel": "goodExposure",
        "value": 0.67
      },
      "noise": {
        "noiseLevel": "low",
        "value": 0
      },
      "makeup": {
        "eyeMakeup": true,
        "lipMakeup": true
      },
      "accessories": [],
      "occlusion": {
        "foreheadOccluded": false,
        "eyeOccluded": false,
        "mouthOccluded": false
      },
      "hair": {
        "bald": 0,
        "invisible": false,
        "hairColor": [
          {
            "color": "brown",
            "confidence": 1
          },
          {
            "color": "black",
            "confidence": 0.87
          },
          {
            "color": "other",
            "confidence": 0.51
          },
          {
            "color": "blond",
            "confidence": 0.08
          },
          {
            "color": "red",
            "confidence": 0.08
          },
          {
            "color": "gray",
            "confidence": 0.02
          }
        ]
      }
    }
  }
]
```

## Find similar faces

This operation takes a single detected face (source) and searches a set of other faces (target) to find matches (face search by image). When it finds a match, it prints the ID of the matched face to the console.

### Detect faces for comparison

First, you need to detect faces in images before you can compare them. Run this command as you did in the [Detect faces](#detect-faces-in-an-image) section. This detection method is optimized for comparison operations. It doesn't extract detailed face attributes like in the section above, and it uses a different recognition model.

:::code language="shell" source="~/cognitive-services-quickstart-code/curl/face/detect.sh" id="detection_model_1":::

Find the `"faceId"` value in the JSON response and save it to a temporary location. Then, call the above command again for these other image URLs, and save their face IDs as well. You'll use these IDs as the group of faces from which to find a similar face.

:::code language="shell" source="~/cognitive-services-quickstart-code/curl/face/detect.sh" id="similar_group":::

### Find matches

The following method detects faces in a set of target images and in a single source image. Then, it compares them and finds all the target images that are similar to the source image.

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/Face/FaceQuickstart.cs?name=detect_for_similar)]

### Print matches

The following code prints the match details to the console:

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/Face/FaceQuickstart.cs?name=snippet_find_similar_print)]

## Identify a face

The Identify operation takes an image of a person (or multiple people) and looks to find the identity of each face in the image (facial recognition search). It compares each detected face to a **PersonGroup**, a database of different **Person** objects whose facial features are known. In order to do the Identify operation, you first need to create and train a **PersonGroup**

### Create a person group

The following code creates a **PersonGroup** with six different **Person** objects. It associates each **Person** with a set of example images, and then it trains to recognize each person by their facial characteristics. **Person** and **PersonGroup** objects are used in the Verify, Identify, and Group operations.

Declare a string variable at the root of your class to represent the ID of the **PersonGroup** you'll create.

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/Face/FaceQuickstart.cs?name=snippet_persongroup_declare)]

In a new method, add the following code. This method will carry out the Identify operation. The first block of code associates the names of persons with their example images.

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/Face/FaceQuickstart.cs?name=snippet_persongroup_files)]

Notice that this code defines a variable `sourceImageFileName`. This variable corresponds to the source image&mdash;the image that contains people to identify.

Next, add the following code to create a **Person** object for each person in the Dictionary and add the face data from the appropriate images. Each **Person** object is associated with the same **PersonGroup** through its unique ID string. Remember to pass the variables `client`, `url`, and `RECOGNITION_MODEL1` into this method.

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/Face/FaceQuickstart.cs?name=snippet_persongroup_create)]

> [!TIP]
> You can also create a **PersonGroup** from local images. See the [IPersonGroupPerson](/dotnet/api/microsoft.azure.cognitiveservices.vision.face.ipersongroupperson?view=azure-dotnet) methods such as **AddFaceFromStreamAsync**.

### Train the PersonGroup

Once you've extracted face data from your images and sorted it into different **Person** objects, you must train the **PersonGroup** to identify the visual features associated with each of its **Person** objects. The following code calls the asynchronous **train** method and polls the results, printing the status to the console.

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/Face/FaceQuickstart.cs?name=snippet_persongroup_train)]

> [!TIP]
> The Face API runs on a set of pre-built models that are static by nature (the model's performance will not regress or improve as the service is run). The results that the model produces might change if Microsoft updates the model's backend without migrating to an entirely new model version. To take advantage of a newer version of a model, you can retrain your **PersonGroup**, specifying the newer model as a parameter with the same enrollment images.

This **Person** group and its associated **Person** objects are now ready to be used in the Verify, Identify, or Group operations.

### Identify faces

The following code takes the source image and creates a list of all the faces detected in the image. These are the faces that will be identified against the **PersonGroup**.

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/Face/FaceQuickstart.cs?name=snippet_identify_sources)]

The next code snippet calls the **IdentifyAsync** operation and prints the results to the console. Here, the service attempts to match each face from the source image to a **Person** in the given **PersonGroup**. This closes out your Identify method.

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/Face/FaceQuickstart.cs?name=snippet_identify)]

## Run the application

#### [Visual Studio IDE](#tab/visual-studio)

Run the application by clicking the **Debug** button at the top of the IDE window.

#### [CLI](#tab/cli)

Run the application from your application directory with the `dotnet run` command.

```dotnet
dotnet run
```

---

## Clean up resources

If you want to clean up and remove a Cognitive Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

* [Portal](../../../cognitive-services-apis-create-account.md#clean-up-resources)
* [Azure CLI](../../../cognitive-services-apis-create-account-cli.md#clean-up-resources)

If you created a **PersonGroup** in this quickstart and you want to delete it, run the following code in your program:

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/Face/FaceQuickstart.cs?name=snippet_persongroup_delete)]

Define the deletion method with the following code:

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/Face/FaceQuickstart.cs?name=snippet_deletepersongroup)]

## Next steps

In this quickstart, you learned how to use the Face client library for .NET to do basis facial recognition tasks. Next, explore the reference documentation to learn more about the library.

> [!div class="nextstepaction"]
> [Face API reference (.NET)](/dotnet/api/overview/azure/cognitiveservices/client/faceapi?view=azure-dotnet)

* [What is the Face service?](../../overview.md)
* The source code for this sample can be found on [GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/dotnet/Face/FaceQuickstart.cs).