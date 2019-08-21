---
title: "Quickstart: Face client library for .NET | Microsoft Docs"
description: Get started with the Face client library for .NET.
services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: cognitive-services
ms.subservice: face-api
ms.topic: quickstart
ms.date: 08/20/2019
ms.author: pafarley
---

# Quickstart: Face client library for .NET

Get started with the Face client library for .NET. Follow these steps to install the package and try out the example code for basic tasks. The Face API service provides you with access to advanced algorithms for detecting and recognizing human faces in images.

Use the Face client library for .NET to:

* Detect faces in an image
* Find similar faces
* Create and train a person group
* Identify a face
* Take a snapshot for data migration

[Reference documentation](https://docs.microsoft.com/dotnet/api/overview/azure/cognitiveservices/client/faceapi?view=azure-dotnet) | [Library source code](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/cognitiveservices/Vision.Face) | [Package (NuGet)](https://www.nuget.org/packages/Microsoft.Azure.CognitiveServices.Vision.Face/2.5.0-preview.1) | [Samples](https://azure.microsoft.com/resources/samples/?service=cognitive-services&term=Face&sort=0)

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/)
* The current version of [.NET Core](https://dotnet.microsoft.com/download/dotnet-core).

## Setting up

### Create a Face Azure resource

Azure Cognitive Services are represented by Azure resources that you subscribe to. Create a resource for Face using the [Azure portal](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) or [Azure CLI](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account-cli) on your local machine. You can also:

* Get a [trial key](https://azure.microsoft.com/try/cognitive-services/#decision) valid for seven days for free. After you sign up, it will be available on the [Azure website](https://azure.microsoft.com/try/cognitive-services/my-apis/).  
* View your resource on the [Azure portal](https://portal.azure.com/).

After you get a key from your trial subscription or resource, [create an environment variable](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account#configure-an-environment-variable-for-authentication) for the key, named `FACE_SUBSCRIPTION_KEY`.

### Create a new C# application

Create a new .NET Core application in your preferred editor or IDE. 

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

From the project directory, open the *program.cs* file in your preferred editor or IDE. Add the following `using` directives:

[!code-csharp[](~/cognitive-services-dotnet-sdk-samples/documentation-samples/quickstarts/Face/Program.cs?name=snippet_using)]

In the application's `Main` method, create variables for your resource's Azure endpoint and key.

[!code-csharp[](~/cognitive-services-dotnet-sdk-samples/documentation-samples/quickstarts/Face/Program.cs?name=snippet_mainvars)]

### Install the client library

Within the application directory, install the Face client library for .NET with the following command:

```console
dotnet add package Microsoft.Azure.CognitiveServices.Vision.Face --version 2.5.0-preview.1
```

If you're using the Visual Studio IDE, the client library is available as a downloadable NuGet package.

## Object model

The following classes and interfaces handle some of the major features of the Face .NET SDK.

|Name|Description|
|---|---|
|[FaceClient](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.vision.face.faceclient?view=azure-dotnet) | This class represents your authorization to use the Face service, and you need it for all Face functionality. You instantiate it with your subscription information, and you use it to produce instances of other classes. |
|[FaceOperations](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.vision.face.faceoperations?view=azure-dotnet)|This class handles the basic detection and recognition tasks that you can do with human faces. |
|[DetectedFace](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.vision.face.models.detectedface?view=azure-dotnet)|This class represents all of the data that was detected from a single face in an image. You can use it to retrieve detailed information about the face.|
|[FaceListOperations](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.vision.face.facelistoperations?view=azure-dotnet)|This class manages the cloud-stored **FaceList** constructs, which store an assorted set of faces. |
|[PersonGroupPersonExtensions](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.vision.face.persongrouppersonextensions?view=azure-dotnet)| This class manages the cloud-stored **Person** constructs, which store a set of faces that belong to a single person.|
|[PersonGroupOperations](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.vision.face.persongroupoperations?view=azure-dotnet)| This class manages the cloud-stored **PersonGroup** constructs, which store a set of assorted **Person** objects. |
|[ShapshotOperations](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.vision.face.snapshotoperations?view=azure-dotnet)|This class manages the Snapshot functionality; you can use it to temporarily save all of your cloud-based face data and migrate that data to a new Azure subscription. |

## Code examples

These code snippets show you how to do the following tasks with the Face client library for .NET:

* [Authenticate the client](#authenticate-the-client)
* [Detect faces in an image](#detect-faces-in-an-image)
* [Find similar faces](#find-similar-faces)
* [Create and train a person group](#create-and-train-a-person-group)
* [Identify a face](#identify-a-face)
* [Take a snapshot for data migration](#take-a-snapshot-for-data-migration)


## Authenticate the client

> [!NOTE]
> This quickstart assumes you've [created an environment variable](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account#configure-an-environment-variable-for-authentication) for your Face key, named `FACE_SUBSCRIPTION_KEY`.


In a new method, instantiate a client with your endpoint and key. Create a [CognitiveServicesCredentials](https://docs.microsoft.com/python/api/msrest/msrest.authentication.cognitiveservicescredentials?view=azure-python) object with your key, and use it with your endpoint to create a [FaceClient](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.vision.face.faceclient?view=azure-dotnet) object.

[!code-csharp[](~/cognitive-services-dotnet-sdk-samples/documentation-samples/quickstarts/Face/Program.cs?name=snippet_auth)]

Call this method in the `Main` method.

[!code-csharp[](~/cognitive-services-dotnet-sdk-samples/documentation-samples/quickstarts/Face/Program.cs?name=snippet_client)]

## Detect faces in an image

Example: Create a new method to read in the data and add it to a [Request](https://docs.microsoft.com/dotnet/) object as an array of [Points](https://docs.microsoft.com/dotnet/). Send the request with the [send()](https://docs.microsoft.com/dotnet/) method

```csharp

```

## Find similar faces

Example: Create a new method to read in the data and add it to a [Request](https://docs.microsoft.com/dotnet/) object as an array of [Points](https://docs.microsoft.com/dotnet/). Send the request with the [send()](https://docs.microsoft.com/dotnet/) method

```csharp

```

## Create and train a person group

## Identify a face

## Take a snapshot for data migration

## Run the application

Run the application from your application directory with the `dotnet run` command.

```dotnet
dotnet run
```

## Clean up resources

If you want to clean up and remove a Cognitive Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

* [Portal](../../cognitive-services-apis-create-account.md#clean-up-resources)
* [Azure CLI](../../cognitive-services-apis-create-account-cli.md#clean-up-resources)

## Troubleshooting

<!--
    This section is optional. If you know of areas that people commonly run into trouble, help them resolve those issues in this section
-->

## Next steps

> [!div class="nextstepaction"]
>[Next article]()

* [What is the Face API?](../overview.md)
* [Article2](../overview.md)
* [Article3](../overview.md)
* The source code for this sample can be found on [GitHub]().