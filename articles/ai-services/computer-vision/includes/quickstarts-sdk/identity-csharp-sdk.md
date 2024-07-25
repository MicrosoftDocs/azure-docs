---
title: "Face .NET client library quickstart"
description: Use the Face client library for .NET to detect and identify faces (facial recognition search).
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

Get started with facial recognition using the Face client library for .NET. The Azure AI Face service provides you with access to advanced algorithms for detecting and recognizing human faces in images. Follow these steps to install the package and try out the example code for basic face identification using remote images.

[Reference documentation](https://aka.ms/azsdk-csharp-face-ref) | [Library source code](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/face/Azure.AI.Vision.Face) | [Package (NuGet)](https://aka.ms/azsdk-csharp-face-pkg) | [Samples](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/face/Azure.AI.Vision.Face/samples)

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/)
* The [Visual Studio IDE](https://visualstudio.microsoft.com/vs/) or current version of [.NET Core](https://dotnet.microsoft.com/download/dotnet-core).
* Once you have your Azure subscription, <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesFace"  title="Create a Face resource"  target="_blank">create a Face resource </a> in the Azure portal to get your key and endpoint. After it deploys, select **Go to resource**.
    * You'll need the key and endpoint from the resource you create to connect your application to the Face API.
    * You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.


## Create environment variables

[!INCLUDE [create environment variables](../face-environment-variables.md)]

## Identify and verify faces

1. Create a new C# application

    #### [Visual Studio IDE](#tab/visual-studio)

    Using Visual Studio, create a new .NET Core application. 

    ### Install the client library 

    Once you've created a new project, install the client library by right-clicking on the project solution in the **Solution Explorer** and selecting **Manage NuGet Packages**. In the package manager that opens select **Browse**, check **Include prerelease**, and search for `Azure.AI.Vision.Face`. Select the latest version, and then **Install**. 

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
    dotnet add package Azure.AI.Vision.Face --prerelease
    ```

    ---
1. Add the following code into the *Program.cs* file.

    > [!NOTE]
    > If you haven't received access to the Face service using the [intake form](https://aka.ms/facerecognition), some of these functions won't work.
    
    [!code-csharp[](~/cognitive-services-quickstart-code/dotnet/Face/Quickstart.cs?name=snippet_single)]


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

Create a person group (18d1c443-a01b-46a4-9191-121f74a831cd).
Create a person group person 'Family1-Dad'.
Check whether image is of sufficient quality for recognition
Add face to the person group person(Family1-Dad) from image `Family1-Dad1.jpg`
Check whether image is of sufficient quality for recognition
Add face to the person group person(Family1-Dad) from image `Family1-Dad2.jpg`
Create a person group person 'Family1-Mom'.
Check whether image is of sufficient quality for recognition
Add face to the person group person(Family1-Mom) from image `Family1-Mom1.jpg`
Check whether image is of sufficient quality for recognition
Add face to the person group person(Family1-Mom) from image `Family1-Mom2.jpg`
Create a person group person 'Family1-Son'.
Check whether image is of sufficient quality for recognition
Add face to the person group person(Family1-Son) from image `Family1-Son1.jpg`
Check whether image is of sufficient quality for recognition
Add face to the person group person(Family1-Son) from image `Family1-Son2.jpg`

Train person group 18d1c443-a01b-46a4-9191-121f74a831cd.
Training status: succeeded.

Pausing for 60 seconds to avoid triggering rate limit on free account...
4 face(s) with 4 having sufficient quality for recognition detected from image `identification1.jpg`
Person 'Family1-Dad' is identified for the face in: identification1.jpg - ad813534-9141-47b4-bfba-24919223966f, confidence: 0.96807.
Verification result: is a match? True. confidence: 0.96807
Person 'Family1-Mom' is identified for the face in: identification1.jpg - 1a39420e-f517-4cee-a898-5d968dac1a7e, confidence: 0.96902.
Verification result: is a match? True. confidence: 0.96902
No person is identified for the face in: identification1.jpg - 889394b1-e30f-4147-9be1-302beb5573f3,
Person 'Family1-Son' is identified for the face in: identification1.jpg - 0557d87b-356c-48a8-988f-ce0ad2239aa5, confidence: 0.9281.
Verification result: is a match? True. confidence: 0.9281

========DELETE PERSON GROUP========

Deleted the person group 18d1c443-a01b-46a4-9191-121f74a831cd.

End of quickstart.
```



> [!TIP]
> The Face API runs on a set of pre-built models that are static by nature (the model's performance will not regress or improve as the service is run). The results that the model produces might change if Microsoft updates the model's backend without migrating to an entirely new model version. To take advantage of a newer version of a model, you can retrain your **PersonGroup**, specifying the newer model as a parameter with the same enrollment images.

## Clean up resources

If you want to clean up and remove an Azure AI services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

* [Azure portal](../../../multi-service-resource.md?pivots=azportal#clean-up-resources)
* [Azure CLI](../../../multi-service-resource.md?pivots=azcli#clean-up-resources)

## Next steps

In this quickstart, you learned how to use the Face client library for .NET to do basic face identification. Next, learn about the different face detection models and how to specify the right model for your use case.

> [!div class="nextstepaction"]
> [Specify a face detection model version](../../how-to/specify-detection-model.md)

* [What is the Face service?](../../overview-identity.md)
* More extensive sample code can be found on [GitHub](https://aka.ms/FaceSamples).
