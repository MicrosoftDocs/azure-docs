---
title: "Content Moderator .NET client library quickstart"
titleSuffix: Azure Cognitive Services
description: Get started with the Content Moderator client library for .NET with this quickstart.
services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: cognitive-services
ms.subservice: content-moderator
ms.topic: quickstart
ms.date: 05/27/2020
ms.author: pafarley
---

Get started with the Content Moderator client library for .NET. Follow these steps to install the package and try out the example code for basic tasks. Content Moderator is a cognitive service that checks text, image, and video content for material that is potentially offensive, risky, or otherwise undesirable. When such material is found, the service applies appropriate labels (flags) to the content. Your app can then handle flagged content to comply with regulations or maintain the intended environment for users.

Use the Content Moderator client library for .NET to:

* [Moderate text](#moderate-text)
* [Moderate images](#moderate-images)
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

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/ContentModerator/Program.cs?name=snippet_using)]

In the **Program** class, create variables for your resource's endpoint location and key as environment variables.

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/ContentModerator/Program.cs?name=snippet_creds)]

> [!NOTE]
> If you created the environment variables after you launched the application, you will need to close and reopen the editor, IDE, or shell running it to access the variables.

### Install the client library

Within the application directory, install the Content Moderator client library for .NET with the following command:

```console
dotnet add package Microsoft.Azure.CognitiveServices.ContentModerator --version 2.0.0
```

If you're using the Visual Studio IDE, the client library is available as a downloadable NuGet package.

## Object model

The following classes handle some of the major features of the Content Moderator .NET client library.

|Name|Description|
|---|---|
|[ContentModeratorClient](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.contentmoderator.contentmoderatorclient?view=azure-dotnet)|This class is needed for all Content Moderator functionality. You instantiate it with your subscription information, and you use it to produce instances of other classes.|
|[ImageModeration](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.contentmoderator.imagemoderation?view=azure-dotnet)|This class provides the functionality for analyzing images for adult content, personal information, or human faces.|
|[TextModeration](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.contentmoderator.textmoderation?view=azure-dotnet)|This class provides the functionality for analyzing text for language, profanity, errors, and personal information.|
|[Reviews](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.contentmoderator.reviews?view=azure-dotnet)|This class provides the functionality of the Review APIs, including the methods for creating jobs, custom workflows, and human reviews.|

## Code examples


These code snippets show you how to do the following tasks with the Content Moderator client library for .NET:

* [Authenticate the client](#authenticate-the-client)
* [Moderate text](#moderate-text)
* [Moderate images](#moderate-images)
* [Create a review](#create-a-review)

## Authenticate the client

In a new method, instantiate client objects with your endpoint and key. You don't need a different client for every scenario, but it can help keep your code organized.

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/ContentModerator/Program.cs?name=snippet_client)]

## Moderate text

The following code uses a Content Moderator client to analyze a body of text and print the results to the console. In the root of your **Program** class, define input and output files:

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/ContentModerator/Program.cs?name=snippet_text_vars)]

Then at the root of your project and add a *TextFile.txt* file. Add your own text to this file, or use the following sample text:

```
Is this a grabage email abcdef@abcd.com, phone: 4255550111, IP: 255.255.255.255, 1234 Main Boulevard, Panapolis WA 96555.
Crap is the profanity here. Is this information PII? phone 4255550111
```

Add the following method call to your `Main` method:

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/ContentModerator/Program.cs?name=snippet_textmod_call)]

Then define the text moderation method somewhere in your **Program** class:

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/ContentModerator/Program.cs?name=snippet_textmod)]

## Moderate images

The following code uses a Content Moderator client, along with an [ImageModeration](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.contentmoderator.imagemoderation?view=azure-dotnet) object, to analyze remote images for adult and racy content.

> [!NOTE]
> You can also analyze the content of a local image. See the [reference documentation](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.contentmoderator.imagemoderation.evaluatefileinputwithhttpmessagesasync?view=azure-dotnet#Microsoft_Azure_CognitiveServices_ContentModerator_ImageModeration_EvaluateFileInputWithHttpMessagesAsync_System_IO_Stream_System_Nullable_System_Boolean__System_Collections_Generic_Dictionary_System_String_System_Collections_Generic_List_System_String___System_Threading_CancellationToken_) for methods and operations that work with local images.

### Get sample images

Define your input and output files:

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/ContentModerator/Program.cs?name=snippet_image_vars)]

Then create the input file, *ImageFiles.txt*, at the root of your project. In this file, you add the URLs of images to analyze&mdash;one URL on each line. You can use the following sample images:

```
https://moderatorsampleimages.blob.core.windows.net/samples/sample2.jpg
https://moderatorsampleimages.blob.core.windows.net/samples/sample5.png
```

Pass your input and output files into the following method call in the `Main` method. You'll define this method at a later step.

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/ContentModerator/Program.cs?name=snippet_textmod_call)]

### Define helper class

Add the following class definition within the **Program** class. This inner class will handle image moderation results.

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/ContentModerator/Program.cs?name=snippet_dataclass)]

### Define the image moderation method

The following method iterates through the image URLs in a text file, creates an **EvaluationData** instance, and analyzes the image for adult/racy content, text, and human faces. Then it adds the final **EvaluationData** instance to a list and writes the complete list of returned data to the console.

#### Iterate through image URLs

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/ContentModerator/Program.cs?name=snippet_imagemod_iterate)]

#### Analyze content

For more information on the image attributes that Content Moderator screens for, see the [Image moderation concepts](../../image-moderation-api.md) guide.

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/ContentModerator/Program.cs?name=snippet_imagemod_analyze)]

#### Write moderation results to file

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/ContentModerator/Program.cs?name=snippet_imagemod_save)]

## Create a review

You can use the Content Moderator .NET client library to feed content into the [Review tool](https://contentmoderator.cognitive.microsoft.com) so that human moderators can review it. To learn more about the Review tool, see the [Review tool conceptual guide](../../review-tool-user-guide/human-in-the-loop.md).

The method in this section uses the [Reviews](https://docs.microsoft.com/dotnet/api/microsoft.azure.cognitiveservices.contentmoderator.reviews?view=azure-dotnet) class to create a review, retrieve its ID, and check its details after receiving human input through the Review tool's web portal. It logs all of this information in an output text file. Call the method from your `Main` method:

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/ContentModerator/Program.cs?name=snippet_review_call)]

### Get sample images

Declare the following array at the root of your **Program** class. This variable references a sample image to use to create the review.

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/ContentModerator/Program.cs?name=snippet_review_urls)]

### Get review credentials

Sign in to the [Review tool](https://contentmoderator.cognitive.microsoft.com) and retrieve your team name. Then assign it to the appropriate variable in the **Program** class. Optionally, you can set up a callback endpoint to receive updates on the activity of the review.

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/ContentModerator/Program.cs?name=snippet_review_vars)]

### Define helper class

Add the following class definition within your **Program** class. This class will be used to represent a single review instance that is submitted to the Review tool.

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/ContentModerator/Program.cs?name=snippet_review_item)]

### Define helper method

Add the following method to the **Program** class. This method will write the results of review queries to the output text file.

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/ContentModerator/Program.cs?name=snippet_writeline)]

### Define the review creation method

Now you're ready to define the method that will handle the review creation and querying. Add a new method, **CreateReviews**, and define the following local variables.

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/ContentModerator/Program.cs?name=snippet_createreview_fields)]

#### Post reviews to the Review tool

Then, add the following code to iterate through the given sample images, add metadata, and send them to the Review tool in a single batch. 

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/ContentModerator/Program.cs?name=snippet_createreview_create)]

The object returned from the API call will contain unique ID values for each image uploaded. The following code parses these IDs and then uses them to query Content Moderator for the status of each image in the batch.

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/ContentModerator/Program.cs?name=snippet_createreview_ids)]

### Get review details

The following code causes the program to wait for user input. When you come to this step at runtime, you can go to the [Review tool](https://contentmoderator.cognitive.microsoft.com) yourself, verify that the sample image was uploaded, and interact with it. For information on how to interact with a review, see the [Reviews how-to guide](https://docs.microsoft.com/azure/cognitive-services/content-moderator/review-tool-user-guide/review-moderated-images). When you're finished, you can press any key to continue the program and retrieve the results of the review process.

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/ContentModerator/Program.cs?name=snippet_createreview_results)]

If you used a callback endpoint in this scenario, it should receive an event in this format:

```console
{'callback_endpoint': 'https://requestb.in/qmsakwqm',
 'content': '',
 'content_id': '3ebe16cb-31ed-4292-8b71-1dfe9b0e821f',
 'created_by': 'cspythonsdk',
 'metadata': [{'key': 'sc', 'value': 'True'}],
 'review_id': '201901i14682e2afe624fee95ebb248643139e7',
 'reviewer_result_tags': [{'key': 'a', 'value': 'True'},
                          {'key': 'r', 'value': 'True'}],
 'status': 'Complete',
 'sub_team': 'public',
 'type': 'Image'}
```

## Run the application

Run the application from your application directory with the `dotnet run` command.

```dotnet
dotnet run 
```

## Clean up resources

If you want to clean up and remove a Cognitive Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

* [Portal](../../../cognitive-services-apis-create-account.md#clean-up-resources)
* [Azure CLI](../../../cognitive-services-apis-create-account-cli.md#clean-up-resources)

## Next steps

In this quickstart, you learned how to use the Content Moderator .NET library to do moderation tasks. Next, learn more about the moderation of images or other media by reading a conceptual guide.

> [!div class="nextstepaction"]
> [Image moderation concepts](https://docs.microsoft.com/azure/cognitive-services/content-moderator/image-moderation-api)

* [What is Azure Content Moderator?](../../overview.md)
* The source code for this sample can be found on [GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/dotnet/ContentModerator/Program.cs).
