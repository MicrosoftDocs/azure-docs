---
title: "Face .NET client library quickstart"
description: Use the Face client library for .NET to detect and identify faces (facial recognition search).
services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: cognitive-services
ms.subservice: face-api
ms.topic: include
ms.date: 05/03/2022
ms.author: pafarley
---

Get started with facial recognition using the Face client library for .NET. The Face service provides you with access to advanced algorithms for detecting and recognizing human faces in images. Follow these steps to install the package and try out the example code for basic face identification using remote images.

[Reference documentation](/dotnet/api/overview/azure/cognitiveservices/face-readme) | [Library source code](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/cognitiveservices/Vision.Face) | [Package (NuGet)](https://www.nuget.org/packages/Microsoft.Azure.CognitiveServices.Vision.Face/2.7.0-preview.3) | [Samples](/samples/browse/?products=azure&term=face)

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/)
* The [Visual Studio IDE](https://visualstudio.microsoft.com/vs/) or current version of [.NET Core](https://dotnet.microsoft.com/download/dotnet-core).
* [!INCLUDE [contributor-requirement](../../../includes/quickstarts/contributor-requirement.md)]
* Once you have your Azure subscription, <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesFace"  title="Create a Face resource"  target="_blank">create a Face resource </a> in the Azure portal to get your key and endpoint. After it deploys, select **Go to resource**.
    * You'll need the key and endpoint from the resource you create to connect your application to the Face API.
    * You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.



[!INCLUDE [create environment variables](../environment-variables.md)]

## Identify and verify faces

1. Create a new C# application

    #### [Visual Studio IDE](#tab/visual-studio)

    Using Visual Studio, create a new .NET Core application. 

    ### Install the client library 

    Once you've created a new project, install the client library by right-clicking on the project solution in the **Solution Explorer** and selecting **Manage NuGet Packages**. In the package manager that opens select **Browse**, check **Include prerelease**, and search for `Microsoft.Azure.CognitiveServices.Vision.Face`. Select the latest version, and then **Install**. 

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
    dotnet add package Microsoft.Azure.CognitiveServices.Vision.Face --prerelease
    ```

    ---
1. Add the following code into the *Program.cs* file.

    > [!NOTE]
    > If you haven't received access to the Face service using the [intake form](https://aka.ms/facerecognition), some of these functions won't work.
    
    [!code-csharp[](~/cognitive-services-quickstart-code/dotnet/Face/FaceQuickstart-single.cs?name=snippet_single)]


1. Run the application

    #### [Visual Studio IDE](#tab/visual-studio)

    Run the application by clicking the **Debug** button at the top of the IDE window.

    #### [CLI](#tab/cli)

    Run the application from your application directory with the `dotnet run` command.

    ```dotnet
    dotnet run
    ```

    ---



## Output

```console
========IDENTIFY FACES========

Create a person group (3972c063-71b3-4328-8579-6d190ee76f99).
Create a person group person 'Family1-Dad'.
Add face to the person group person(Family1-Dad) from image `Family1-Dad1.jpg`
Add face to the person group person(Family1-Dad) from image `Family1-Dad2.jpg`
Create a person group person 'Family1-Mom'.
Add face to the person group person(Family1-Mom) from image `Family1-Mom1.jpg`
Add face to the person group person(Family1-Mom) from image `Family1-Mom2.jpg`
Create a person group person 'Family1-Son'.
Add face to the person group person(Family1-Son) from image `Family1-Son1.jpg`
Add face to the person group person(Family1-Son) from image `Family1-Son2.jpg`
Create a person group person 'Family1-Daughter'.
Create a person group person 'Family2-Lady'.
Add face to the person group person(Family2-Lady) from image `Family2-Lady1.jpg`
Add face to the person group person(Family2-Lady) from image `Family2-Lady2.jpg`
Create a person group person 'Family2-Man'.
Add face to the person group person(Family2-Man) from image `Family2-Man1.jpg`
Add face to the person group person(Family2-Man) from image `Family2-Man2.jpg`

Train person group 3972c063-71b3-4328-8579-6d190ee76f99.
Training status: Succeeded.

4 face(s) with 4 having sufficient quality for recognition detected from image `identification1.jpg`
Person 'Family1-Dad' is identified for face in: identification1.jpg - 994bfd7a-0d8f-4fae-a5a6-c524664cbee7, confidence: 0.96725.
Person 'Family1-Mom' is identified for face in: identification1.jpg - 0c9da7b9-a628-429d-97ff-cebe7c638fb5, confidence: 0.96921.
No person is identified for face in: identification1.jpg - a881259c-e811-4f7e-a35e-a453e95ca18f,
Person 'Family1-Son' is identified for face in: identification1.jpg - 53772235-8193-46eb-bdfc-1ebc25ea062e, confidence: 0.92886.

End of quickstart.
```



> [!TIP]
> The Face API runs on a set of pre-built models that are static by nature (the model's performance will not regress or improve as the service is run). The results that the model produces might change if Microsoft updates the model's backend without migrating to an entirely new model version. To take advantage of a newer version of a model, you can retrain your **PersonGroup**, specifying the newer model as a parameter with the same enrollment images.

## Clean up resources

If you want to clean up and remove an Azure AI services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

* [Portal](../../../multi-service-resource.md?pivots=azportal#clean-up-resources)
* [Azure CLI](../../../multi-service-resource.md?pivots=azcli#clean-up-resources)

To delete the **PersonGroup** you created in this quickstart, run the following code in your program:

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/Face/FaceQuickstart.cs?name=snippet_persongroup_delete)]

Define the deletion method with the following code:

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/Face/FaceQuickstart.cs?name=snippet_deletepersongroup)]

## Next steps

In this quickstart, you learned how to use the Face client library for .NET to do basic face identification. Next, learn about the different face detection models and how to specify the right model for your use case.

> [!div class="nextstepaction"]
> [Specify a face detection model version](../../how-to/specify-detection-model.md)

* [What is the Face service?](../../overview.md)
* More extensive sample code can be found on [GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/dotnet/Face/FaceQuickstart.cs).
