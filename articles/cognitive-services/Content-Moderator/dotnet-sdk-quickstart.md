---
title: "Quickstart: Content Moderator client library for .NET | Microsoft Docs"
description: Get started with the Content Moderator client library for .NET.
services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: cognitive-services
ms.subservice: content-moderator
ms.topic: quickstart
ms.date: 10/25/2019
ms.author: pafarley
---

# Quickstart: Content Moderator client library for .NET

Get started with the Content Moderator client library for .NET. Follow these steps to install the package and try out the example code for basic tasks. Content Moderator is a cognitive service that checks text, image, and video content for material that is potentially offensive, risky, or otherwise undesirable. When such material is found, the service applies appropriate labels (flags) to the content. Your app can then handle flagged content in order to comply with regulations or maintain the intended environment for users.


Use the Content Moderator client library for .NET to:

* [Moderate text](#moderate-text)
* [Moderate images](#moderate-images)
* [Use a custom image list](#use-a-custom-image-list)
* [Create a review](#create-a-review)

[Reference documentation](https://docs.microsoft.com/dotnet/api/overview/azure/cognitiveservices/client/contentmoderator?view=azure-dotnet) | [Library source code](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/cognitiveservices/Vision.ContentModerator) | [Package (NuGet)](https://www.nuget.org/packages/Microsoft.Azure.CognitiveServices.ContentModerator/) | [Samples](https://docs.microsoft.com/azure/cognitive-services/content-moderator/samples-dotnet)

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/)
* The current version of [.NET Core](https://dotnet.microsoft.com/download/dotnet-core).

## Setting up

### Create a Content Moderator Azure resource

Azure Cognitive Services are represented by Azure resources that you subscribe to. Create a resource for Content Moderator using the [Azure portal](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) or [Azure CLI](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account-cli) on your local machine. You can also:

* Get a [trial key](https://azure.microsoft.com/try/cognitive-services/#decision) valid for seven days for free. After you sign up, it will be available on the [Azure website](https://azure.microsoft.com/try/cognitive-services/my-apis/).  
* View your resource on the [Azure portal](https://portal.azure.com/)

After you get a key from your trial subscription or resource, [create environment variables](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account#configure-an-environment-variable-for-authentication) for the key and endpoint URL, named `CONTENT_MODERATOR_SUBSCRIPTION_KEY` and `CONTENT_MODERATOR_ENDPOINT`, respectively.

### Create a new C# application

Create a new .NET Core application in your preferred text editor or IDE. 

In a console window (such as cmd, PowerShell, or Bash), use the `dotnet new` command to create a new console app with the name `content-moderator-quickstart`. This command creates a simple "Hello World" C# project with a single source file: *Program.cs*.

```console
dotnet new console -n content-moderator-quickstart
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

From the project directory, open the *Program.cs* file in your preferred editor or IDE. Add the following `using` statements:

[!code-csharp[](~/cognitive-services-dotnet-sdk-samples/documentation-samples/quickstarts/ContentModerator/Program.cs?name=snippet_using)]

In the **Program** class, create variables for your resource's endpoint location and key as environment variables.

[!code-csharp[](~/cognitive-services-dotnet-sdk-samples/documentation-samples/quickstarts/ContentModerator/Program.cs?name=snippet_creds)]

> [!NOTE]
> If you created the environment variables after you launched the application, you will need to close and reopen the editor, IDE, or shell running it to access the variables.

### Install the client library

Within the application directory, install the Content Moderator client library for .NET with the following command:

```console
dotnet add package Microsoft.Azure.CognitiveServices.ContentModerator --version 2.0.0
```

If you're using the Visual Studio IDE, the client library is available as a downloadable NuGet package.

## Object model

The following classes handle some of the major features of the Content Moderator .NET SDK.

|Name|Description|
|---|---|
|[ContentModeratorClient](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.contentmoderator.contentmoderatorclient?view=azure-dotnet)|This class is needed for all Content Moderator functionality. You instantiate it with your subscription information, and you use it to produce instances of other classes.|
|[ImageModeration](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.contentmoderator.imagemoderation?view=azure-dotnet)|This class provides the functionality for analyzing images for adult content, personal information, or human faces.|
|[TextModeration](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.contentmoderator.textmoderation?view=azure-dotnet)|This class provides the functionality for analyzing text for language, profanity, errors, and personal information.|
[Reviews](https://docs.microsoft.com/en-us/dotnet/api/microsoft.azure.cognitiveservices.contentmoderator.reviews?view=azure-dotnet)|This class provides the functionality of the Review APIs, including the methods for creating jobs, custom workflows, and human reviews.|

## Code examples


These code snippets show you how to do the following tasks with the Content Moderator client library for .NET:

* [Authenticate the client](#authenticate-the-client)
* [Moderate text](#moderate-text)
* [Moderate images](#moderate-images)
* [Use a custom image list](#use-a-custom-image-list)
* [Create a review](#create-a-review)

## Authenticate the client

In a new method, instantiate client objects with your endpoint and key. You don't need a different client for every scenario, but it can help keep your code organized.

[!code-csharp[](~/cognitive-services-dotnet-sdk-samples/documentation-samples/quickstarts/ContentModerator/Program.cs?name=snippet_client)]

## Moderate text

The following code uses a Content Moderator client to analyze a body of text and print the results to the console. In the root of your **Program** class, define input and output files:

[!code-csharp[](~/cognitive-services-dotnet-sdk-samples/documentation-samples/quickstarts/ContentModerator/Program.cs?name=snippet_text_vars)]

Then at the root of your project and add a *TextFile.txt* file. Add your own text to this file, or use the following sample text:

```
Is this a grabage email abcdef@abcd.com, phone: 6657789887, IP: 255.255.255.255, 1 Microsoft Way, Redmond, WA 98052.
Crap is the profanity here. Is this information PII? phone 3144444444
```

Add the following method call to your `Main` method:

[!code-csharp[](~/cognitive-services-dotnet-sdk-samples/documentation-samples/quickstarts/ContentModerator/Program.cs?name=snippet_textmod_call)]

Then define the text moderation method somewhere in your **Program** class:

[!code-csharp[](~/cognitive-services-dotnet-sdk-samples/documentation-samples/quickstarts/ContentModerator/Program.cs?name=snippet_textmod)]

## Moderate images

The following code uses a Content Moderator client, along with an [ImageModeration](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.contentmoderator.imagemoderation?view=azure-dotnet) object, to analyze images for adult and racy content.

### Get images

Define your input and output files:

[!code-csharp[](~/cognitive-services-dotnet-sdk-samples/documentation-samples/quickstarts/ContentModerator/Program.cs?name=snippet_image_vars)]

Then create the input file, *ImageFiles.txt*, at the root of your project. In this file, you add the URLs of images to analyze&mdash;one URL on each line. You can use the following sample images:

```
https://moderatorsampleimages.blob.core.windows.net/samples/sample2.jpg
https://moderatorsampleimages.blob.core.windows.net/samples/sample5.png
```

Pass your input and output files into the following method call in the `Main` method. You'll define this method at a later step.

[!code-csharp[](~/cognitive-services-dotnet-sdk-samples/documentation-samples/quickstarts/ContentModerator/Program.cs?name=snippet_textmod_call)]

### Use a helper class

Add the following class definition within the **Program** class. This inner class will handle image moderation results.

[!code-csharp[](~/cognitive-services-dotnet-sdk-samples/documentation-samples/quickstarts/ContentModerator/Program.cs?name=snippet_dataclass)]

### Define image moderation method

### Check for adult/racy content

The following code checks the image at the given URL for adult or racy content and prints results to the console. See the [Image moderation concepts](./image-moderation-api.md) guide for information on what these terms mean.

[!code-python[](~/cognitive-services-quickstart-code/python/ContentModerator/ContentModeratorQuickstart.py?name=snippet_imagemod_ar)]

### Check for visible text

The following code checks the image for visible text content and prints results to the console.

[!code-python[](~/cognitive-services-quickstart-code/python/ContentModerator/ContentModeratorQuickstart.py?name=snippet_imagemod_text)]

### Check for faces

The following code checks the image for human faces and prints results to the console.

[!code-python[](~/cognitive-services-quickstart-code/python/ContentModerator/ContentModeratorQuickstart.py?name=snippet_imagemod_face)]

##############

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

* [What is the Content Moderator API?](../overview.md)
* [Article2](../overview.md)
* [Article3](../overview.md)
* The source code for this sample can be found on [GitHub]().
