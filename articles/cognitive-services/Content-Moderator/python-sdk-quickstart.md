---
title: "Quickstart: Content Moderator client library for Python | Microsoft Docs"
description: Get started with the Content Moderator client library for Python.
services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: cognitive-services
ms.subservice: content-moderator
ms.topic: quickstart
ms.date: 07/24/2019
ms.author: pafarley
---

# Quickstart: Content Moderator client library for Python

Get started with the Content Moderator client library for Python. Follow these steps to install the package and try out the example code for basic tasks. Content Moderator is a cognitive service that checks text, image, and video content for material that is potentially offensive, risky, or otherwise undesirable. When such material is found, the service applies appropriate labels (flags) to the content. Your app can then handle flagged content in order to comply with regulations or maintain the intended environment for users.

Use the Content Moderator client library for Python to:

* [Moderate text](#moderate-text)
* [Use a custom terms list](#use-a-custom-terms-list)
* [Moderate images](#moderate-images)
* [Use a custom image list](#use-a-custom-image-list)
* [Create a review](#create-a-review)

[Reference documentation](https://docs.microsoft.com/python/api/overview/azure/cognitiveservices/contentmoderator?view=azure-python) | [Library source code](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/cognitiveservices/azure-cognitiveservices-vision-contentmoderator) | [Package (PiPy)](https://pypi.org/project/azure-cognitiveservices-vision-contentmoderator/) | [Samples](https://github.com/Azure-Samples/cognitive-services-python-sdk-samples)

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/)
* [Python 3.x](https://www.python.org/)

## Setting up

### Create a Content Moderator Azure resource

Azure Cognitive Services are represented by Azure resources that you subscribe to. Create a resource for Content Moderator using the [Azure portal](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) or [Azure CLI](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account-cli) on your local machine. You can also:

* Get a [trial key](https://azure.microsoft.com/try/cognitive-services/#decision) valid for seven days for free. After you sign up, it will be available on the [Azure website](https://azure.microsoft.com/try/cognitive-services/my-apis/).  
* View your resource on the [Azure portal](https://portal.azure.com/)

After you get a key from your trial subscription or resource, [create an environment variable](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account#configure-an-environment-variable-for-authentication) for the key, named `CONTENTMODERATOR_SUBSCRIPTION_KEY`.
 
### Create a python script

Create a new Python script and open it in your preferred editor or IDE. Then add the following `import` statements to the top of the file.

[!code-python[](~/cognitive-services-quickstart-code/python/ContentModerator/ContentModeratorQuickstart.py?name=snippet_imports)]

Next, create variables for your resource's Azure location and your key as an environment variable. 

[!code-python[](~/cognitive-services-quickstart-code/python/ContentModerator/ContentModeratorQuickstart.py?name=snippet_vars)]

> [!NOTE]
> If you created the environment variable after you launched the application, you will need to close and reopen the editor, IDE, or shell running it to access the variable.

### Install the client library

You can install the Content Moderator client library with the following command:

```console
pip install --upgrade azure-cognitiveservices-vision-contentmoderator
```

## Object model

The following classes handle some of the major features of the Content Moderator Python SDK.

|Name|Description|
|---|---|
|[ContentModeratorClient](https://docs.microsoft.com/python/api/azure-cognitiveservices-vision-contentmoderator/azure.cognitiveservices.vision.contentmoderator.content_moderator_client.contentmoderatorclient?view=azure-python)|This class is needed for all Content Moderator functionality. You instantiate it with your subscription information, and you use it to produce instances of other classes.|
|[ImageModerationOperations](https://docs.microsoft.com/python/api/azure-cognitiveservices-vision-contentmoderator/azure.cognitiveservices.vision.contentmoderator.operations.imagemoderationoperations?view=azure-python)|This class provides the functionality for analyzing images for adult content, personal information, or human faces.|
|[TextModerationOperations](https://docs.microsoft.com/python/api/azure-cognitiveservices-vision-contentmoderator/azure.cognitiveservices.vision.contentmoderator.operations.textmoderationoperations?view=azure-python)|This class provides the functionality for analyzing text for language, profanity, errors, and personal information.|
[ReviewsOperations](https://docs.microsoft.com/python/api/azure-cognitiveservices-vision-contentmoderator/azure.cognitiveservices.vision.contentmoderator.operations.reviewsoperations?view=azure-python)|This class provides the functionality of the Review APIs, including the methods for creating jobs, custom workflows, and human reviews.|

## Code examples

These code snippets show you how to do the following tasks with the Content Moderator client library for Python:

* [Authenticate the client](#authenticate-the-client)
* [Moderate text](#moderate-text)
* [Use a custom terms list](#use-a-custom-terms-list)
* [Moderate images](#moderate-images)
* [Use a custom image list](#use-a-custom-image-list)
* [Create a review](#create-a-review)

### Authenticate the client

> [!NOTE]
> This quickstart assumes you've [created an environment variable](../cognitive-services-apis-create-account.md#configure-an-environment-variable-for-authentication) for your Content Moderator key, named `CONTENTMODERATOR_SUBSCRIPTION_KEY`.

Instantiate a client with your endpoint and key. Create a [CognitiveServicesCredentials](https://docs.microsoft.com/python/api/msrest/msrest.authentication.cognitiveservicescredentials?view=azure-python) object with your key, and use it with your endpoint to create an [ContentModeratorClient](https://docs.microsoft.com/python/api/azure-cognitiveservices-vision-contentmoderator/azure.cognitiveservices.vision.contentmoderator.content_moderator_client.contentmoderatorclient?view=azure-python) object.

[!code-python[](~/cognitive-services-quickstart-code/python/ContentModerator/ContentModeratorQuickstart.py?name=snippet_client)]

### Moderate text

The following code uses a Content Moderator client to analyze a body of text and print the results to the console. First, create a **text_files/** folder at the root of your project and add a *content_moderator_text_moderation.txt* file. Add your own text to this file, or use the following sample text:

```
Is this a grabage email abcdef@abcd.com, phone: 6657789887, IP: 255.255.255.255, 1 Microsoft Way, Redmond, WA 98052.
Crap is the profanity here. Is this information PII? phone 3144444444
```

Add a reference to the new folder.

[!code-python[](~/cognitive-services-quickstart-code/python/ContentModerator/ContentModeratorQuickstart.py?name=snippet_textfolder)]

Then, add the following function definition to your Python script. Call the function later in the script to do text moderation.

[!code-python[](~/cognitive-services-quickstart-code/python/ContentModerator/ContentModeratorQuickstart.py?name=snippet_textmod)]

### Use a custom terms list

The following code shows how to manage a list of custom terms for text moderation. You can use the [ListManagementTermListsOperations](https://docs.microsoft.com/python/api/azure-cognitiveservices-vision-contentmoderator/azure.cognitiveservices.vision.contentmoderator.operations.listmanagementtermlistsoperations?view=azure-python) class to create a terms list, manage the individual terms, and screen other bodies of text against it.

To use this sample, you must create a **text_files/** folder at the root of your project and add a *content_moderator_term_list.txt* file. This file should contain organic text that will be checked against the list of terms. You can use the following sample text:

```
This text contains the terms "term1" and "term2".
```

Add a reference to the folder if you haven't already defined one.

[!code-python[](~/cognitive-services-quickstart-code/python/ContentModerator/ContentModeratorQuickstart.py?name=snippet_textfolder)]

Then, add the following function definition to your Python script. Each section of the function does a different task with the custom terms list. Call the function later in the script to do list operations.

[!code-python[](~/cognitive-services-quickstart-code/python/ContentModerator/ContentModeratorQuickstart.py?name=snippet_termslist)]

### Moderate images

The following code uses a Content Moderator client, along with an [ImageModerationOperations](https://docs.microsoft.com/python/api/azure-cognitiveservices-vision-contentmoderator/azure.cognitiveservices.vision.contentmoderator.operations.imagemoderationoperations?view=azure-python) object, to analyze images for adult and racy content.

Define a reference to some images to analyze.

[!code-python[](~/cognitive-services-quickstart-code/python/ContentModerator/ContentModeratorQuickstart.py?name=snippet_imagemodvars)]

Then add the following function definition. Call this function later in the script to analyze an image.

[!code-python[](~/cognitive-services-quickstart-code/python/ContentModerator/ContentModeratorQuickstart.py?name=snippet_imagemod)]

### Use a custom image list

The following code shows how to manage a custom list of images for image moderation. This feature is useful if your platform frequently receives instances of the same set of images that you want to screen out. By maintaining a list of these specific images, you can improve performance. The [ListManagementImageListsOperations](https://docs.microsoft.com/python/api/azure-cognitiveservices-vision-contentmoderator/azure.cognitiveservices.vision.contentmoderator.operations.listmanagementimagelistsoperations?view=azure-python) class allows you to create an image list, manage the individual images on the list, and compare other images against it.

Create the following text variables to store the image URLs that you'll use in this scenario.

[!code-python[](~/cognitive-services-quickstart-code/python/ContentModerator/ContentModeratorQuickstart.py?name=snippet_imagelistvars)]

> [!NOTE]
> This is not the proper list itself, but an informal list of images that will be added in the `add images` section of the code.

Then, add the following function definition to your script. Call this function later in the script to do image list operations.

[!code-python[](~/cognitive-services-quickstart-code/python/ContentModerator/ContentModeratorQuickstart.py?name=snippet_imagelist)]

### Create a review

You can use the Content Moderator Python SDK to feed content into the [Review tool](https://contentmoderator.cognitive.microsoft.com) so that human moderators can review it. To learn more about the Review tool, see the [Conceptual guide](./review-tool-user-guide/human-in-the-loop.md).

The following code uses the [ReviewsOperations](https://docs.microsoft.com/python/api/azure-cognitiveservices-vision-contentmoderator/azure.cognitiveservices.vision.contentmoderator.operations.reviewsoperations?view=azure-python) class to create a review, retrieve its ID, and check its details after receiving human input through the Review tool's web portal.

First, sign in to the Review tool and retrieve your team name. Then assign it to the appropriate variable in the code. Optionally, you can set up a callback endpoint to receive updates on the activity of the review.

[!code-python[](~/cognitive-services-quickstart-code/python/ContentModerator/ContentModeratorQuickstart.py?name=snippet_imagereview1)]

Then, add the rest of the function code. Call this function later in this script to create a review on the Review tool site. The function will prompt you to go to the Review tool yourself and interact with the content. When you're done, you can resume the script, and it will retrieve the results of the review process.

[!code-python[](~/cognitive-services-quickstart-code/python/ContentModerator/ContentModeratorQuickstart.py?name=snippet_imagereview2)]

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

Run the application with the `python` command on your quickstart file.

```console
python quickstart-file.py
```

## Clean up resources

If you want to clean up and remove a Cognitive Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

* [Portal](../cognitive-services-apis-create-account.md#clean-up-resources)
* [Azure CLI](../cognitive-services-apis-create-account-cli.md#clean-up-resources)

## Next steps

In this quickstart, you learned how to use the Content Moderator Python library to do moderation tasks. Next, learn more about the moderation of images or other media by reading a conceptual guide.

> [!div class="nextstepaction"]
>[Image moderation concepts](https://docs.microsoft.com/azure/cognitive-services/content-moderator/image-moderation-api)

* [What is Azure Content Moderator?](./overview.md)
* The source code for this sample can be found on [GitHub](https://github.com/Azure-Samples/cognitive-services-python-sdk-samples/tree/master/samples/vision).