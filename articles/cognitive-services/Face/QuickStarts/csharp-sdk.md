---
title: "Quickstart: Face client library for .NET"
description: Get started with the Face client library for .NET with this quickstart.
services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: cognitive-services
ms.subservice: face-api
ms.topic: quickstart
ms.date: 12/05/2019
ms.author: pafarley
---
# Quickstart: Face client library for .NET

Get started with the Face client library for .NET. Follow these steps to install the package and try out the example code for basic tasks. The Face service provides you with access to advanced algorithms for detecting and recognizing human faces in images.

Use the Face client library for .NET to:

* [Authenticate the client](#authenticate-the-client)
* [Detect faces in an image](#detect-faces-in-an-image)
* [Find similar faces](#find-similar-faces)
* [Create and train a person group](#create-and-train-a-person-group)
* [Identify a face](#identify-a-face)
* [Take a snapshot for data migration](#take-a-snapshot-for-data-migration)

[Reference documentation](https://docs.microsoft.com/dotnet/api/overview/azure/cognitiveservices/client/faceapi?view=azure-dotnet) | [Library source code](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/cognitiveservices/Vision.Face) | [Package (NuGet)](https://www.nuget.org/packages/Microsoft.Azure.CognitiveServices.Vision.Face/2.5.0-preview.1) | [Samples](https://docs.microsoft.com/samples/browse/?products=azure&term=face)

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/)
* The current version of [.NET Core](https://dotnet.microsoft.com/download/dotnet-core).

## Setting up

### Create a Face Azure resource

Azure Cognitive Services are represented by Azure resources that you subscribe to. Create a resource for Face using the [Azure portal](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) or [Azure CLI](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account-cli) on your local machine. You can also:

* Get a [trial key](https://azure.microsoft.com/try/cognitive-services/#decision) valid for seven days for free. After you sign up, it will be available on the [Azure website](https://azure.microsoft.com/try/cognitive-services/my-apis/).  
* View your resource on the [Azure portal](https://portal.azure.com/).

After you get a key from your trial subscription or resource, [create an environment variable](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account#configure-an-environment-variable-for-authentication) for the key and endpoint URL, named `FACE_SUBSCRIPTION_KEY` and `FACE_ENDPOINT`, respectively.

### Create a new C# application

Create a new .NET Core application in your preferred editor or IDE. 

In a console window (such as cmd, PowerShell, or Bash), use the `dotnet new` command to create a new console app with the name `face-quickstart`. This command creates a simple "Hello World" C# project with a single source file: *Program.cs*. 

```dotnetcli
dotnet new console -n face-quickstart
```

Change your directory to the newly created app folder. You can build the application with:

```dotnetcli
dotnet build
```

The build output should contain no warnings or errors. 

```console
...
Build succeeded.
 0 Warning(s)
 0 Error(s)
...
```

From the project directory, open the *Program.cs* file in your preferred editor or IDE. Add the following `using` directives:

[!code-csharp[](~/cognitive-services-dotnet-sdk-samples/documentation-samples/quickstarts/Face/Program.cs?name=snippet_using)]

In the application's `Main` method, create variables for your resource's Azure endpoint and key.

[!code-csharp[](~/cognitive-services-dotnet-sdk-samples/documentation-samples/quickstarts/Face/Program.cs?name=snippet_mainvars)]

### Install the client library

Within the application directory, install the Face client library for .NET with the following command:

```dotnetcli
dotnet add package Microsoft.Azure.CognitiveServices.Vision.Face --version 2.5.0-preview.1
```

If you're using the Visual Studio IDE, the client library is available as a downloadable NuGet package.

## Object model

The following classes and interfaces handle some of the major features of the Face .NET SDK:

|Name|Description|
|---|---|
|[FaceClient](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.vision.face.faceclient?view=azure-dotnet) | This class represents your authorization to use the Face service, and you need it for all Face functionality. You instantiate it with your subscription information, and you use it to produce instances of other classes. |
|[FaceOperations](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.vision.face.faceoperations?view=azure-dotnet)|This class handles the basic detection and recognition tasks that you can do with human faces. |
|[DetectedFace](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.vision.face.models.detectedface?view=azure-dotnet)|This class represents all of the data that was detected from a single face in an image. You can use it to retrieve detailed information about the face.|
|[FaceListOperations](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.vision.face.facelistoperations?view=azure-dotnet)|This class manages the cloud-stored **FaceList** constructs, which store an assorted set of faces. |
|[PersonGroupPersonExtensions](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.vision.face.persongrouppersonextensions?view=azure-dotnet)| This class manages the cloud-stored **Person** constructs, which store a set of faces that belong to a single person.|
|[PersonGroupOperations](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.vision.face.persongroupoperations?view=azure-dotnet)| This class manages the cloud-stored **PersonGroup** constructs, which store a set of assorted **Person** objects. |
|[ShapshotOperations](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.vision.face.snapshotoperations?view=azure-dotnet)|This class manages the Snapshot functionality. You can use it to temporarily save all of your cloud-based Face data and migrate that data to a new Azure subscription. |

## Code examples

The code snippets below show you how to do the following tasks with the Face client library for .NET:

* [Authenticate the client](#authenticate-the-client)
* [Detect faces in an image](#detect-faces-in-an-image)
* [Find similar faces](#find-similar-faces)
* [Create and train a person group](#create-and-train-a-person-group)
* [Identify a face](#identify-a-face)
* [Take a snapshot for data migration](#take-a-snapshot-for-data-migration)


## Authenticate the client

> [!NOTE]
> This quickstart assumes you've [created environment variables](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account#configure-an-environment-variable-for-authentication) for your Face key and endpoint, named `FACE_SUBSCRIPTION_KEY` and `FACE_ENDPOINT`.

In a new method, instantiate a client with your endpoint and key. Create a [CognitiveServicesCredentials](https://docs.microsoft.com/python/api/msrest/msrest.authentication.cognitiveservicescredentials?view=azure-python) object with your key, and use it with your endpoint to create a [FaceClient](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.vision.face.faceclient?view=azure-dotnet) object.

[!code-csharp[](~/cognitive-services-dotnet-sdk-samples/documentation-samples/quickstarts/Face/Program.cs?name=snippet_auth)]

You'll likely want to call this method in the `Main` method.

[!code-csharp[](~/cognitive-services-dotnet-sdk-samples/documentation-samples/quickstarts/Face/Program.cs?name=snippet_client)]

## Detect faces in an image

At the root of your class, define the following URL string. This URL points to a set of sample images.

[!code-csharp[](~/cognitive-services-dotnet-sdk-samples/documentation-samples/quickstarts/Face/Program.cs?name=snippet_image_url)]

Optionally, you can choose which AI model to use to extract data from the detected face(s). See [Specify a recognition model](../Face-API-How-to-Topics/specify-recognition-model.md) for information on these options.

[!code-csharp[](~/cognitive-services-dotnet-sdk-samples/documentation-samples/quickstarts/Face/Program.cs?name=snippet_detect_models)]

The final Detect operation will take a [FaceClient](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.vision.face.faceclient?view=azure-dotnet) object, an image URL, and a recognition model.

[!code-csharp[](~/cognitive-services-dotnet-sdk-samples/documentation-samples/quickstarts/Face/Program.cs?name=snippet_detect_call)]

### Get detected face objects

In the next block of code, the `DetectFaceExtract` method detects faces in three of the images at the given URL and creates a list of [DetectedFace](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.vision.face.models.detectedface?view=azure-dotnet) objects in program memory. The list of [FaceAttributeType](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.vision.face.models.faceattributetype?view=azure-dotnet) values specifies which features to extract. 

[!code-csharp[](~/cognitive-services-dotnet-sdk-samples/documentation-samples/quickstarts/Face/Program.cs?name=snippet_detect)]

### Display detected face data

The rest of the `DetectFaceExtract` method parses and prints the attribute data for each detected face. Each attribute must be specified separately in the original face detection API call (in the [FaceAttributeType](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.vision.face.models.faceattributetype?view=azure-dotnet) list). The following code processes every attribute, but you will likely only need to use one or a few.

[!code-csharp[](~/cognitive-services-dotnet-sdk-samples/documentation-samples/quickstarts/Face/Program.cs?name=snippet_detect_parse)]

## Find similar faces

The following code takes a single detected face (source) and searches a set of other faces (target) to find matches. When it finds a match, it prints the ID of the matched face to the console.

### Detect faces for comparison

First, define a second face detection method. You need to detect faces in images before you can compare them, and this detection method is optimized for comparison operations. It doesn't extract detailed face attributes like in the section above, and it uses a different recognition model.

[!code-csharp[](~/cognitive-services-dotnet-sdk-samples/documentation-samples/quickstarts/Face/Program.cs?name=snippet_face_detect_recognize)]

### Find matches

The following method detects faces in a set of target images and in a single source image. Then, it compares them and finds all the target images that are similar to the source image.

[!code-csharp[](~/cognitive-services-dotnet-sdk-samples/documentation-samples/quickstarts/Face/Program.cs?name=snippet_find_similar)]

### Print matches

The following code prints the match details to the console:

[!code-csharp[](~/cognitive-services-dotnet-sdk-samples/documentation-samples/quickstarts/Face/Program.cs?name=snippet_find_similar_print)]

## Create and train a person group

The following code creates a **PersonGroup** with six different **Person** objects. It associates each **Person** with a set of example images, and then it trains to recognize each person by their facial characteristics. **Person** and **PersonGroup** objects are used in the Verify, Identify, and Group operations.

If you haven't done so already, define the following URL string at the root of your class. This points to a set of sample images.

[!code-csharp[](~/cognitive-services-dotnet-sdk-samples/documentation-samples/quickstarts/Face/Program.cs?name=snippet_image_url)]

The code later in this section will specify a recognition model to extract data from faces, and the following snippet creates references to the available models. See [Specify a recognition model](../Face-API-How-to-Topics/specify-recognition-model.md) for information on recognition models.

[!code-csharp[](~/cognitive-services-dotnet-sdk-samples/documentation-samples/quickstarts/Face/Program.cs?name=snippet_detect_models)]

### Create PersonGroup

Declare a string variable at the root of your class to represent the ID of the **PersonGroup** you'll create.

[!code-csharp[](~/cognitive-services-dotnet-sdk-samples/documentation-samples/quickstarts/Face/Program.cs?name=snippet_persongroup_declare)]

In a new method, add the following code. This code associates the names of persons with their example images.

[!code-csharp[](~/cognitive-services-dotnet-sdk-samples/documentation-samples/quickstarts/Face/Program.cs?name=snippet_persongroup_files)]

Next, add the following code to create a **Person** object for each person in the Dictionary and add the face data from the appropriate images. Each **Person** object is associated with the same **PersonGroup** through its unique ID string. Remember to pass the variables `client`, `url`, and `RECOGNITION_MODEL1` into this method.

[!code-csharp[](~/cognitive-services-dotnet-sdk-samples/documentation-samples/quickstarts/Face/Program.cs?name=snippet_persongroup_create)]

### Train PersonGroup

Once you've extracted face data from your images and sorted it into different **Person** objects, you must train the **PersonGroup** to identify the visual features associated with each of its **Person** objects. The following code calls the asynchronous **train** method and polls the results, printing the status to the console.

[!code-csharp[](~/cognitive-services-dotnet-sdk-samples/documentation-samples/quickstarts/Face/Program.cs?name=snippet_persongroup_train)]

This **Person** group and its associated **Person** objects are now ready to be used in the Verify, Identify, or Group operations.

## Identify a face

The Identify operation takes an image of a person (or multiple people) and looks to find the identity of each face in the image. It compares each detected face to a **PersonGroup**, a database of different **Person** objects whose facial features are known.

> [!IMPORTANT]
> In order to run this example, you must first run the code in [Create and train a person group](#create-and-train-a-person-group). The variables used in that section&mdash;`client`, `url`, and `RECOGNITION_MODEL1`&mdash;must also be available here.

### Get a test image

Notice that the code for [Create and train a person group](#create-and-train-a-person-group) defines a variable `sourceImageFileName`. This variable corresponds to the source image&mdash;the image that contains people to identify.

### Identify faces

The following code takes the source image and creates a list of all the faces detected in the image. These are the faces that will be identified against the **PersonGroup**.

[!code-csharp[](~/cognitive-services-dotnet-sdk-samples/documentation-samples/quickstarts/Face/Program.cs?name=snippet_identify_sources)]

The next code snippet calls the Identify operation and prints the results to the console. Here, the service attempts to match each face from the source image to a **Person** in the given **PersonGroup**.

[!code-csharp[](~/cognitive-services-dotnet-sdk-samples/documentation-samples/quickstarts/Face/Program.cs?name=snippet_identify)]

## Take a snapshot for data migration

The Snapshots feature lets you move your saved Face data, such as a trained **PersonGroup**, to a different Azure Cognitive Services Face subscription. You may want to use this feature if, for example, you've created a **PersonGroup** object using a free trial subscription and want to migrate it to a paid subscription. See [Migrate your face data](../Face-API-How-to-Topics/how-to-migrate-face-data.md) for an overview of the Snapshots feature.

In this example, you will migrate the **PersonGroup** you created in [Create and train a person group](#create-and-train-a-person-group). You can either complete that section first, or create your own Face data construct(s) to migrate.

### Set up target subscription

First, you must have a second Azure subscription with a Face resource; you can do this by following the steps in the [Setting up](#setting-up) section. 

Then, define the following variables in the `Main` method of your program. You'll need to create new environment variables for the subscription ID of your Azure account, as well as the key, endpoint, and subscription ID of your new (target) account. 

[!code-csharp[](~/cognitive-services-dotnet-sdk-samples/documentation-samples/quickstarts/Face/Program.cs?name=snippet_snapshot_vars)]

For this example, declare a variable for the ID of the target **PersonGroup**&mdash;the object that belongs to the new subscription, which you will copy your data to.

[!code-csharp[](~/cognitive-services-dotnet-sdk-samples/documentation-samples/quickstarts/Face/Program.cs?name=snippet_snapshot_vars)]

### Authenticate target client

Next, add the code to authenticate your secondary Face subscription.

[!code-csharp[](~/cognitive-services-dotnet-sdk-samples/documentation-samples/quickstarts/Face/Program.cs?name=snippet_snapshot_client)]

### Use a snapshot

The rest of the snapshot operations must take place within an asynchronous method. 

1. The first step is to **take** the snapshot, which saves your original subscription's face data to a temporary cloud location. This method returns an ID that you use to query the status of the operation.

    [!code-csharp[](~/cognitive-services-dotnet-sdk-samples/documentation-samples/quickstarts/Face/Program.cs?name=snippet_snapshot_take)]

1. Next, query the ID until the operation has completed.

    [!code-csharp[](~/cognitive-services-dotnet-sdk-samples/documentation-samples/quickstarts/Face/Program.cs?name=snippet_snapshot_take_wait)]

1. Then use the **apply** operation to write your face data to your target subscription. This method also returns an ID value.

    [!code-csharp[](~/cognitive-services-dotnet-sdk-samples/documentation-samples/quickstarts/Face/Program.cs?name=snippet_snapshot_apply)]

1. Again, query the new ID until the operation has completed.

    [!code-csharp[](~/cognitive-services-dotnet-sdk-samples/documentation-samples/quickstarts/Face/Program.cs?name=snippet_snapshot_apply)]

1. Finally, complete the try/catch block and finish the method.

    [!code-csharp[](~/cognitive-services-dotnet-sdk-samples/documentation-samples/quickstarts/Face/Program.cs?name=snippet_snapshot_trycatch)]

At this point, your new **PersonGroup** object should have the same data as the original one and should be accessible from your new (target) Azure Face subscription.

## Run the application

Run the application from your application directory with the `dotnet run` command.

```dotnetcli
dotnet run
```

## Clean up resources

If you want to clean up and remove a Cognitive Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

* [Portal](../../cognitive-services-apis-create-account.md#clean-up-resources)
* [Azure CLI](../../cognitive-services-apis-create-account-cli.md#clean-up-resources)

If you created a **PersonGroup** in this quickstart and you want to delete it, run the following code in your program:

[!code-csharp[](~/cognitive-services-dotnet-sdk-samples/documentation-samples/quickstarts/Face/Program.cs?name=snippet_persongroup_delete)]

Define the deletion method with the following code:

[!code-csharp[](~/cognitive-services-dotnet-sdk-samples/documentation-samples/quickstarts/Face/Program.cs?name=snippet_deletepersongroup)]

Additionally, if you migrated data using the Snapshot feature in this quickstart, you'll also need to delete the **PersonGroup** saved to the target subscription.

[!code-csharp[](~/cognitive-services-dotnet-sdk-samples/documentation-samples/quickstarts/Face/Program.cs?name=snippet_target_persongroup_delete)]

## Next steps

In this quickstart, you learned how to use the Face library for .NET to do basis tasks. Next, explore the reference documentation to learn more about the library.

> [!div class="nextstepaction"]
> [Face API reference (.NET)](https://docs.microsoft.com/dotnet/api/overview/azure/cognitiveservices/client/faceapi?view=azure-dotnet)

* [What is the Face service?](../overview.md)
* The source code for this sample can be found on [GitHub](https://github.com/Azure-Samples/cognitive-services-dotnet-sdk-samples/blob/master/documentation-samples/quickstarts/Face/Program.cs).
