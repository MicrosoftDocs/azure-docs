---
title: "Face .NET client library quickstart"
description: Use the Face client library for .NET to detect faces, find similar (face search by image), identify faces (facial recognition search) and migrate your face data.
services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: cognitive-services
ms.subservice: face-api
ms.topic: include
ms.date: 10/26/2020
ms.author: pafarley
---

Get started with facial recognition using the Face client library for .NET. Follow these steps to install the package and try out the example code for basic tasks. The Face service provides you with access to advanced algorithms for detecting and recognizing human faces in images.

Use the Face client library for .NET to:

* [Detect faces in an image](#detect-faces-in-an-image)
* [Find similar faces](#find-similar-faces)
* [Create a person group](#create-a-person-group)
* [Identify a face](#identify-a-face)

[Reference documentation](/dotnet/api/overview/azure/cognitiveservices/client/faceapi) | [Library source code](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/cognitiveservices/Vision.Face) | [Package (NuGet)](https://www.nuget.org/packages/Microsoft.Azure.CognitiveServices.Vision.Face/2.6.0-preview.1) | [Samples](/samples/browse/?products=azure&term=face)

## Prerequisites


* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/)
* The [Visual Studio IDE](https://visualstudio.microsoft.com/vs/) or current version of [.NET Core](https://dotnet.microsoft.com/download/dotnet-core).
* Once you have your Azure subscription, <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesFace"  title="Create a Face resource"  target="_blank">create a Face resource </a> in the Azure portal to get your key and endpoint. After it deploys, click **Go to resource**.
    * You will need the key and endpoint from the resource you create to connect your application to the Face API. You'll paste your key and endpoint into the code below later in the quickstart.
    * You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.

## Setting up

### Create a new C# application

#### [Visual Studio IDE](#tab/visual-studio)

Using Visual Studio, create a new .NET Core application. 

### Install the client library 

Once you've created a new project, install the client library by right-clicking on the project solution in the **Solution Explorer** and selecting **Manage NuGet Packages**. In the package manager that opens select **Browse**, check **Include prerelease**, and search for `Microsoft.Azure.CognitiveServices.Vision.Face`. Select version `2.6.0-preview.1`, and then **Install**. 

#### [CLI](#tab/cli)

In a console window (such as cmd, PowerShell, or Bash), use the `dotnet new` command to create a new console app with the name `face-quickstart`. This command creates a simple "Hello World" C# project with a single source file: *program.cs*. 

```console
dotnet new console -n face-quickstart
```

Change your directory to the newly created app folder. You can build the application with:

```console
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

### Install the client library 

Within the application directory, install the Face client library for .NET with the following command:

```console
dotnet add package Microsoft.Azure.CognitiveServices.Vision.Face --version 2.6.0-preview.1
```

---

> [!TIP]
> Want to view the whole quickstart code file at once? You can find it on [GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/dotnet/Face/FaceQuickstart.cs), which contains the code examples in this quickstart.


From the project directory, open the *program.cs* file and add the following `using` directives:

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/Face/FaceQuickstart.cs?name=snippet_using)]

In the application's **Program** class, create variables for your resource's key and endpoint.


> [!IMPORTANT]
> Go to the Azure portal. If the Face resource you created in the **Prerequisites** section deployed successfully, click the **Go to Resource** button under **Next Steps**. You can find your key and endpoint in the resource's **key and endpoint** page, under **resource management**. 
>
> Remember to remove the key from your code when you're done, and never post it publicly. For production, consider using a secure way of storing and accessing your credentials. See the Cognitive Services [security](../../../cognitive-services-security.md) article for more information.

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/Face/FaceQuickstart.cs?name=snippet_creds)]

In the application's **Main** method, add calls for the methods used in this quickstart. You will implement these later.

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/Face/FaceQuickstart.cs?name=snippet_maincalls)]

## Object model

The following classes and interfaces handle some of the major features of the Face .NET client library:

|Name|Description|
|---|---|
|[FaceClient](/dotnet/api/microsoft.azure.cognitiveservices.vision.face.faceclient) | This class represents your authorization to use the Face service, and you need it for all Face functionality. You instantiate it with your subscription information, and you use it to produce instances of other classes. |
|[FaceOperations](/dotnet/api/microsoft.azure.cognitiveservices.vision.face.faceoperations)|This class handles the basic detection and recognition tasks that you can do with human faces. |
|[DetectedFace](/dotnet/api/microsoft.azure.cognitiveservices.vision.face.models.detectedface)|This class represents all of the data that was detected from a single face in an image. You can use it to retrieve detailed information about the face.|
|[FaceListOperations](/dotnet/api/microsoft.azure.cognitiveservices.vision.face.facelistoperations)|This class manages the cloud-stored **FaceList** constructs, which store an assorted set of faces. |
|[PersonGroupPersonExtensions](/dotnet/api/microsoft.azure.cognitiveservices.vision.face.persongrouppersonextensions)| This class manages the cloud-stored **Person** constructs, which store a set of faces that belong to a single person.|
|[PersonGroupOperations](/dotnet/api/microsoft.azure.cognitiveservices.vision.face.persongroupoperations)| This class manages the cloud-stored **PersonGroup** constructs, which store a set of assorted **Person** objects. |

## Code examples

The code snippets below show you how to do the following tasks with the Face client library for .NET:

* [Authenticate the client](#authenticate-the-client)
* [Detect faces in an image](#detect-faces-in-an-image)
* [Find similar faces](#find-similar-faces)
* [Create a person group](#create-a-person-group)
* [Identify a face](#identify-a-face)

## Authenticate the client

In a new method, instantiate a client with your endpoint and key. Create a **[ApiKeyServiceClientCredentials](/dotnet/api/microsoft.azure.cognitiveservices.vision.face.apikeyserviceclientcredentials)** object with your key, and use it with your endpoint to create a **[FaceClient](/dotnet/api/microsoft.azure.cognitiveservices.vision.face.faceclient)** object.

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/Face/FaceQuickstart.cs?name=snippet_auth)]

### Declare helper fields

The following fields are needed for several of the Face operations you'll add later. At the root of your **Program** class, define the following URL string. This URL points to a folder of sample images.

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/Face/FaceQuickstart.cs?name=snippet_image_url)]

In your **Main** method, define strings to point to the different recognition model types. Later on, you'll be able to specify which recognition model you want to use for face detection. See [Specify a recognition model](../../Face-API-How-to-Topics/specify-recognition-model.md) for information on these options.

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/Face/FaceQuickstart.cs?name=snippet_detect_models)]

## Detect faces in an image

### Get detected face objects

Create a new method to detect faces. The `DetectFaceExtract` method processes three of the images at the given URL and creates a list of **[DetectedFace](/dotnet/api/microsoft.azure.cognitiveservices.vision.face.models.detectedface)** objects in program memory. The list of **[FaceAttributeType](/dotnet/api/microsoft.azure.cognitiveservices.vision.face.models.faceattributetype)** values specifies which features to extract. 

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/Face/FaceQuickstart.cs?name=snippet_detect)]

> [!TIP]
> You can also detect faces in a local image. See the [IFaceOperations](/dotnet/api/microsoft.azure.cognitiveservices.vision.face.ifaceoperations) methods such as **DetectWithStreamAsync**.

### Display detected face data

The rest of the `DetectFaceExtract` method parses and prints the attribute data for each detected face. Each attribute must be specified separately in the original face detection API call (in the **[FaceAttributeType](/dotnet/api/microsoft.azure.cognitiveservices.vision.face.models.faceattributetype)** list). The following code processes every attribute, but you will likely only need to use one or a few.

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/Face/FaceQuickstart.cs?name=snippet_detect_parse)]

## Find similar faces

The following code takes a single detected face (source) and searches a set of other faces (target) to find matches (face search by image). When it finds a match, it prints the ID of the matched face to the console.

### Detect faces for comparison

First, define a second face detection method. You need to detect faces in images before you can compare them, and this detection method is optimized for comparison operations. It doesn't extract detailed face attributes like in the section above, and it uses a different recognition model.

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/Face/FaceQuickstart.cs?name=snippet_face_detect_recognize)]

### Find matches

The following method detects faces in a set of target images and in a single source image. Then, it compares them and finds all the target images that are similar to the source image.

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/Face/FaceQuickstart.cs?name=snippet_find_similar)]

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
> You can also create a **PersonGroup** from local images. See the [IPersonGroupPerson](/dotnet/api/microsoft.azure.cognitiveservices.vision.face.ipersongroupperson) methods such as **AddFaceFromStreamAsync**.

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

In this quickstart, you learned how to use the Face client library for .NET to do basic facial recognition tasks. Next, explore the reference documentation to learn more about the library.

> [!div class="nextstepaction"]
> [Face API reference (.NET)](/dotnet/api/overview/azure/cognitiveservices/client/faceapi)

* [What is the Face service?](../../overview.md)
* The source code for this sample can be found on [GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/dotnet/Face/FaceQuickstart.cs).
