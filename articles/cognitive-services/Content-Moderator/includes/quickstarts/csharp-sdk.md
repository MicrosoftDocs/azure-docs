---
title: "Content Moderator .NET client library quickstart"
titleSuffix: Azure Cognitive Services
description: In this quickstart, learn how to get started with the Azure Content Moderator client library for .NET. Build content filtering software into your app to comply with regulations or maintain the intended environment for your users.
services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: cognitive-services
ms.subservice: content-moderator
ms.topic: include
ms.date: 09/15/2020
ms.author: pafarley
ms.custom: "devx-track-dotnet, cog-serv-seo-aug-2020"

---

Get started with the Azure Content Moderator client library for .NET. Follow these steps to install the NuGet package and try out the example code for basic tasks. 

Content Moderator is an AI service that lets you handle content that is potentially offensive, risky, or otherwise undesirable. Use the AI-powered content moderation service to scan text, image, and videos and apply content flags automatically. Then integrate your app with the Review tool, an online moderator environment for a team of human reviewers. Build content filtering software into your app to comply with regulations or maintain the intended environment for your users.

Use the Content Moderator client library for .NET to:

* Moderate text
* Moderate images
* Create a review

[Reference documentation](/dotnet/api/overview/azure/cognitiveservices/client/contentmoderator) | [Library source code](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/cognitiveservices/Vision.ContentModerator) | [Package (NuGet)](https://www.nuget.org/packages/Microsoft.Azure.CognitiveServices.ContentModerator/) | [Samples](../../samples-dotnet.md)

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/)
* The [Visual Studio IDE](https://visualstudio.microsoft.com/vs/) or current version of [.NET Core](https://dotnet.microsoft.com/download/dotnet-core).
* Once you have your Azure subscription, <a href="https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesContentModerator"  title="Create a Content Moderator resource"  target="_blank">create a Content Moderator resource </a> in the Azure portal to get your key and endpoint. Wait for it to deploy and click the **Go to resource** button.
    * You will need the key and endpoint from the resource you create to connect your application to Content Moderator. You'll paste your key and endpoint into the code below later in the quickstart.
    * You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.

## Setting up

### Create a new C# application

#### [Visual Studio IDE](#tab/visual-studio)

Using Visual Studio, create a new .NET Core application. 

### Install the client library 

Once you've created a new project, install the client library by right-clicking on the project solution in the **Solution Explorer** and selecting **Manage NuGet Packages**. In the package manager that opens select **Browse**, check **Include prerelease**, and search for `Microsoft.Azure.CognitiveServices.ContentModerator`. Select version `2.0.0`, and then **Install**. 

#### [CLI](#tab/cli)

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

### Install the client library 

Within the application directory, install the Content Moderator client library for .NET with the following command:

```console
dotnet add package Microsoft.Azure.CognitiveServices.ContentModerator --version 2.0.0
```

---

> [!TIP]
> Want to view the whole quickstart code file at once? You can find it on [GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/dotnet/ContentModerator/Program.cs), which contains the code examples in this quickstart.

From the project directory, open the *Program.cs* file in your preferred editor or IDE. Add the following `using` statements:

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/ContentModerator/Program.cs?name=snippet_using)]

In the **Program** class, create variables for your resource's key and endpoint.

> [!IMPORTANT]
> Go to the Azure portal. If the Content Moderator resource you created in the **Prerequisites** section deployed successfully, click the **Go to Resource** button under **Next Steps**. You can find your key and endpoint in the resource's **key and endpoint** page, under **resource management**. 
>
> Remember to remove the key from your code when you're done, and never post it publicly. For production, consider using a secure way of storing and accessing your credentials. For more information, see the Cognitive Services [security](../../../cognitive-services-security.md) article.

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/ContentModerator/Program.cs?name=snippet_creds)]


In the application's `main()` method, add calls for the methods used in this quickstart. You will create these later.

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/ContentModerator/Program.cs?name=snippet_client)]

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/ContentModerator/Program.cs?name=snippet_textmod_call)]

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/ContentModerator/Program.cs?name=snippet_imagemod_call)]

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/ContentModerator/Program.cs?name=snippet_review_call)]


## Object model

The following classes handle some of the major features of the Content Moderator .NET client library.

|Name|Description|
|---|---|
|[ContentModeratorClient](/dotnet/api/microsoft.azure.cognitiveservices.contentmoderator.contentmoderatorclient)|This class is needed for all Content Moderator functionality. You instantiate it with your subscription information, and you use it to produce instances of other classes.|
|[ImageModeration](/dotnet/api/microsoft.azure.cognitiveservices.contentmoderator.imagemoderation)|This class provides the functionality for analyzing images for adult content, personal information, or human faces.|
|[TextModeration](/dotnet/api/microsoft.azure.cognitiveservices.contentmoderator.textmoderation)|This class provides the functionality for analyzing text for language, profanity, errors, and personal information.|
|[Reviews](/dotnet/api/microsoft.azure.cognitiveservices.contentmoderator.reviews)|This class provides the functionality of the Review APIs, including the methods for creating jobs, custom workflows, and human reviews.|

## Code examples

These code snippets show you how to do the following tasks with the Content Moderator client library for .NET:

* [Authenticate the client](#authenticate-the-client)
* [Moderate text](#moderate-text)
* [Moderate images](#moderate-images)
* [Create a review](#create-a-review)

## Authenticate the client

In a new method, instantiate client objects with your endpoint and key.

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/ContentModerator/Program.cs?name=snippet_auth)]

## Moderate text

The following code uses a Content Moderator client to analyze a body of text and print the results to the console. In the root of your **Program** class, define input and output files:

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/ContentModerator/Program.cs?name=snippet_text_vars)]

Then at the root of your project, add a *TextFile.txt* file. Add your own text to this file, or use the following sample text:

```
Is this a grabage email abcdef@abcd.com, phone: 4255550111, IP: 255.255.255.255, 1234 Main Boulevard, Panapolis WA 96555.
Crap is the profanity here. Is this information PII? phone 4255550111
```


Then define the text moderation method somewhere in your **Program** class:

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/ContentModerator/Program.cs?name=snippet_textmod)]

## Moderate images

The following code uses a Content Moderator client, along with an [ImageModeration](/dotnet/api/microsoft.azure.cognitiveservices.contentmoderator.imagemoderation) object, to analyze remote images for adult and racy content.

> [!NOTE]
> You can also analyze the content of a local image. See the [reference documentation](/dotnet/api/microsoft.azure.cognitiveservices.contentmoderator.imagemoderation.evaluatefileinputwithhttpmessagesasync#Microsoft_Azure_CognitiveServices_ContentModerator_ImageModeration_EvaluateFileInputWithHttpMessagesAsync_System_IO_Stream_System_Nullable_System_Boolean__System_Collections_Generic_Dictionary_System_String_System_Collections_Generic_List_System_String___System_Threading_CancellationToken_) for methods and operations that work with local images.

### Get sample images

Define your input and output files at the root of your **Program** class:

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/ContentModerator/Program.cs?name=snippet_image_vars)]

Then create the input file, *ImageFiles.txt*, at the root of your project. In this file, you add the URLs of images to analyze&mdash;one URL on each line. You can use the following sample images:

```
https://moderatorsampleimages.blob.core.windows.net/samples/sample2.jpg
https://moderatorsampleimages.blob.core.windows.net/samples/sample5.png
```

### Define helper class

Add the following class definition within the **Program** class. This inner class will handle image moderation results.

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/ContentModerator/Program.cs?name=snippet_dataclass)]

### Define the image moderation method

The following method iterates through the image URLs in a text file, creates an **EvaluationData** instance, and analyzes the image for adult/racy content, text, and human faces. Then it adds the final **EvaluationData** instance to a list and writes the complete list of returned data to the console.

#### Iterate through images

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/ContentModerator/Program.cs?name=snippet_imagemod_iterate)]

#### Analyze content

For more information on the image attributes that Content Moderator screens for, see the [Image moderation concepts](../../image-moderation-api.md) guide.

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/ContentModerator/Program.cs?name=snippet_imagemod_analyze)]

#### Write moderation results to file

[!code-csharp[](~/cognitive-services-quickstart-code/dotnet/ContentModerator/Program.cs?name=snippet_imagemod_save)]

## Create a review

You can use the Content Moderator .NET client library to feed content into the [Review tool](https://contentmoderator.cognitive.microsoft.com) so that human moderators can review it. To learn more about the Review tool, see the [Review tool conceptual guide](../../review-tool-user-guide/human-in-the-loop.md).

The method in this section uses the [Reviews](/dotnet/api/microsoft.azure.cognitiveservices.contentmoderator.reviews) class to create a review, retrieve its ID, and check its details after receiving human input through the Review tool's web portal. It logs all of this information in an output text file. 

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

The following code causes the program to wait for user input. When you come to this step at runtime, you can go to the [Review tool](https://contentmoderator.cognitive.microsoft.com) yourself, verify that the sample image was uploaded, and interact with it. For information on how to interact with a review, see the [Reviews how-to guide](../../review-tool-user-guide/review-moderated-images.md). When you're finished, you can press any key to continue the program and retrieve the results of the review process.

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

## Next steps

In this quickstart, you learned how to use the Content Moderator .NET library to do moderation tasks. Next, learn more about the moderation of images or other media by reading a conceptual guide.

> [!div class="nextstepaction"]
> [Image moderation concepts](../../image-moderation-api.md)