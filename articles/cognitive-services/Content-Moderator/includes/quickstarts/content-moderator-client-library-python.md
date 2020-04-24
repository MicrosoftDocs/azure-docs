---
title: "Content Moderator Python client library quickstart"
titleSuffix: Azure Cognitive Services
description: In this quickstart, learn how to get started with the Azure Cognitive Services Content Moderator client library for Python.
services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: cognitive-services
ms.subservice: content-moderator
ms.topic: include
ms.date: 01/27/2020
ms.author: pafarley
---

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

After you get a key from your trial subscription or resource, [create environment variables](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account#configure-an-environment-variable-for-authentication) for the key and endpoint URL, named `CONTENT_MODERATOR_SUBSCRIPTION_KEY` and `CONTENT_MODERATOR_ENDPOINT`, respectively.
 
### Create a python script

Create a new Python script and open it in your preferred editor or IDE. Then add the following `import` statements to the top of the file.

[!code-python[](~/cognitive-services-quickstart-code/python/ContentModerator/ContentModeratorQuickstart.py?name=snippet_imports)]

Next, create variables for your resource's endpoint location and key as environment variables. 

[!code-python[](~/cognitive-services-quickstart-code/python/ContentModerator/ContentModeratorQuickstart.py?name=snippet_vars)]

> [!NOTE]
> If you created the environment variables after you launched the application, you will need to close and reopen the editor, IDE, or shell running it to access the variables.

### Install the client library

You can install the Content Moderator client library with the following command:

```console
pip install --upgrade azure-cognitiveservices-vision-contentmoderator
```

## Object model

The following classes handle some of the major features of the Content Moderator Python client library.

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

## Authenticate the client

> [!NOTE]
> This quickstart assumes you've [created environment variables](../../../cognitive-services-apis-create-account.md#configure-an-environment-variable-for-authentication) for your Content Moderator key and endpoint.

Instantiate a client with your endpoint and key. Create a [CognitiveServicesCredentials](https://docs.microsoft.com/python/api/msrest/msrest.authentication.cognitiveservicescredentials?view=azure-python) object with your key, and use it with your endpoint to create an [ContentModeratorClient](https://docs.microsoft.com/python/api/azure-cognitiveservices-vision-contentmoderator/azure.cognitiveservices.vision.contentmoderator.content_moderator_client.contentmoderatorclient?view=azure-python) object.

[!code-python[](~/cognitive-services-quickstart-code/python/ContentModerator/ContentModeratorQuickstart.py?name=snippet_client)]

## Moderate text

The following code uses a Content Moderator client to analyze a body of text and print the results to the console. First, create a **text_files/** folder at the root of your project and add a *content_moderator_text_moderation.txt* file. Add your own text to this file, or use the following sample text:

```
Is this a grabage email abcdef@abcd.com, phone: 4255550111, IP: 255.255.255.255, 1234 Main Boulevard, Panapolis WA 96555.
Crap is the profanity here. Is this information PII? phone 2065550111
```

Add a reference to the new folder.

[!code-python[](~/cognitive-services-quickstart-code/python/ContentModerator/ContentModeratorQuickstart.py?name=snippet_textfolder)]

Then, add the following code to your Python script.

[!code-python[](~/cognitive-services-quickstart-code/python/ContentModerator/ContentModeratorQuickstart.py?name=snippet_textmod)]

## Use a custom terms list

The following code shows how to manage a list of custom terms for text moderation. You can use the [ListManagementTermListsOperations](https://docs.microsoft.com/python/api/azure-cognitiveservices-vision-contentmoderator/azure.cognitiveservices.vision.contentmoderator.operations.listmanagementtermlistsoperations?view=azure-python) class to create a terms list, manage the individual terms, and screen other bodies of text against it.

### Get sample text

To use this sample, you must create a **text_files/** folder at the root of your project and add a *content_moderator_term_list.txt* file. This file should contain organic text that will be checked against the list of terms. You can use the following sample text:

```
This text contains the terms "term1" and "term2".
```

Add a reference to the folder if you haven't already defined one.

[!code-python[](~/cognitive-services-quickstart-code/python/ContentModerator/ContentModeratorQuickstart.py?name=snippet_textfolder)]

### Create a list

Add the following code to your Python script to create a custom terms list and save its ID value.

[!code-python[](~/cognitive-services-quickstart-code/python/ContentModerator/ContentModeratorQuickstart.py?name=snippet_termslist_create)]

### Define list details

You can use a list's ID to edit its name and description.

[!code-python[](~/cognitive-services-quickstart-code/python/ContentModerator/ContentModeratorQuickstart.py?name=snippet_termslist_details)]

### Add a term to the list

The following code adds the terms `"term1"` and `"term2"` to the list.

[!code-python[](~/cognitive-services-quickstart-code/python/ContentModerator/ContentModeratorQuickstart.py?name=snippet_termslist_add)]

### Get all terms in the list

You can use the list ID to return all of the terms in the list.

[!code-python[](~/cognitive-services-quickstart-code/python/ContentModerator/ContentModeratorQuickstart.py?name=snippet_termslist_getterms)]

### Refresh the list index

Whenever you add or remove terms from the list, you must refresh the index before you can use the updated list.

[!code-python[](~/cognitive-services-quickstart-code/python/ContentModerator/ContentModeratorQuickstart.py?name=snippet_termslist_refresh)]

### Screen text against the list

The main functionality of the custom terms list is to compare a body of text against the list and find whether there are any matching terms. 

[!code-python[](~/cognitive-services-quickstart-code/python/ContentModerator/ContentModeratorQuickstart.py?name=snippet_termslist_screen)]

### Remove a term from a list

The following code removes the term `"term1"` from the list.

[!code-python[](~/cognitive-services-quickstart-code/python/ContentModerator/ContentModeratorQuickstart.py?name=snippet_termslist_remove)]

### Remove all terms from a list

Use the following code to clear a list of all its terms.

[!code-python[](~/cognitive-services-quickstart-code/python/ContentModerator/ContentModeratorQuickstart.py?name=snippet_termslist_removeall)]

### Delete list

Use the following code to delete a custom terms list.

[!code-python[](~/cognitive-services-quickstart-code/python/ContentModerator/ContentModeratorQuickstart.py?name=snippet_termslist_deletelist)]

## Moderate images

The following code uses a Content Moderator client, along with an [ImageModerationOperations](https://docs.microsoft.com/python/api/azure-cognitiveservices-vision-contentmoderator/azure.cognitiveservices.vision.contentmoderator.operations.imagemoderationoperations?view=azure-python) object, to analyze images for adult and racy content.

### Get images

Define a reference to some images to analyze.

[!code-python[](~/cognitive-services-quickstart-code/python/ContentModerator/ContentModeratorQuickstart.py?name=snippet_imagemodvars)]

Then add the following code to iterate through your images. The rest of the code in this section will go inside this loop.

[!code-python[](~/cognitive-services-quickstart-code/python/ContentModerator/ContentModeratorQuickstart.py?name=snippet_imagemod_iterate)]

### Check for adult/racy content

The following code checks the image at the given URL for adult or racy content and prints results to the console. See the [Image moderation concepts](../../image-moderation-api.md) guide for information on what these terms mean.

[!code-python[](~/cognitive-services-quickstart-code/python/ContentModerator/ContentModeratorQuickstart.py?name=snippet_imagemod_ar)]

### Check for visible text

The following code checks the image for visible text content and prints results to the console.

[!code-python[](~/cognitive-services-quickstart-code/python/ContentModerator/ContentModeratorQuickstart.py?name=snippet_imagemod_text)]

### Check for faces

The following code checks the image for human faces and prints results to the console.

[!code-python[](~/cognitive-services-quickstart-code/python/ContentModerator/ContentModeratorQuickstart.py?name=snippet_imagemod_face)]

## Use a custom image list

The following code shows how to manage a custom list of images for image moderation. This feature is useful if your platform frequently receives instances of the same set of images that you want to screen out. By maintaining a list of these specific images, you can improve performance. The [ListManagementImageListsOperations](https://docs.microsoft.com/python/api/azure-cognitiveservices-vision-contentmoderator/azure.cognitiveservices.vision.contentmoderator.operations.listmanagementimagelistsoperations?view=azure-python) class allows you to create an image list, manage the individual images on the list, and compare other images against it.

Create the following text variables to store the image URLs that you'll use in this scenario.

[!code-python[](~/cognitive-services-quickstart-code/python/ContentModerator/ContentModeratorQuickstart.py?name=snippet_imagelistvars)]

> [!NOTE]
> This is not the proper list itself, but an informal list of images that will be added in the `add images` section of the code.


### Create an image list

Add the following code to create an image list and save a reference to its ID.

[!code-python[](~/cognitive-services-quickstart-code/python/ContentModerator/ContentModeratorQuickstart.py?name=snippet_imagelist_create)]

### Add images to a list

The following code adds all of your images to the list.

[!code-python[](~/cognitive-services-quickstart-code/python/ContentModerator/ContentModeratorQuickstart.py?name=snippet_imagelist_add)]

Define the **add_images** helper function elsewhere in your script.

[!code-python[](~/cognitive-services-quickstart-code/python/ContentModerator/ContentModeratorQuickstart.py?name=snippet_imagelist_addhelper)]

### Get images in list

The following code prints the names of all the images in your list.

[!code-python[](~/cognitive-services-quickstart-code/python/ContentModerator/ContentModeratorQuickstart.py?name=snippet_imagelist_getimages)]

### Update list details

You can use the list ID to update the name and description of the list.

[!code-python[](~/cognitive-services-quickstart-code/python/ContentModerator/ContentModeratorQuickstart.py?name=snippet_imagelist_updatedetails)]

### Get list details

Use the following code to print the current details of your list.

[!code-python[](~/cognitive-services-quickstart-code/python/ContentModerator/ContentModeratorQuickstart.py?name=snippet_imagelist_getdetails)]

### Refresh the list index

After you add or remove images, you must refresh the list index before you can use it to screen other images.

[!code-python[](~/cognitive-services-quickstart-code/python/ContentModerator/ContentModeratorQuickstart.py?name=snippet_imagelist_refresh)]

### Match images against the list

The main function of image lists is to compare new images and see if there are any matches.

[!code-python[](~/cognitive-services-quickstart-code/python/ContentModerator/ContentModeratorQuickstart.py?name=snippet_imagelist_match)]

### Remove an image from the list

The following code removes an item from the list. In this case, it is an image that does not match the list category.

[!code-python[](~/cognitive-services-quickstart-code/python/ContentModerator/ContentModeratorQuickstart.py?name=snippet_imagelist_remove)]

### Remove all images from a list

Use the following code to clear out an image list.

[!code-python[](~/cognitive-services-quickstart-code/python/ContentModerator/ContentModeratorQuickstart.py?name=snippet_imagelist_removeall)]

### Delete the image list

Use the following code to delete a given image list.

[!code-python[](~/cognitive-services-quickstart-code/python/ContentModerator/ContentModeratorQuickstart.py?name=snippet_imagelist_delete)]

## Create a review

You can use the Content Moderator Python client library to feed content into the [Review tool](https://contentmoderator.cognitive.microsoft.com) so that human moderators can review it. To learn more about the Review tool, see the [Review tool conceptual guide](../../review-tool-user-guide/human-in-the-loop.md).

The following code uses the [ReviewsOperations](https://docs.microsoft.com/python/api/azure-cognitiveservices-vision-contentmoderator/azure.cognitiveservices.vision.contentmoderator.operations.reviewsoperations?view=azure-python) class to create a review, retrieve its ID, and check its details after receiving human input through the Review tool's web portal.

### Get Review credentials

First, sign in to the Review tool and retrieve your team name. Then assign it to the appropriate variable in the code. Optionally, you can set up a callback endpoint to receive updates on the activity of the review.

[!code-python[](~/cognitive-services-quickstart-code/python/ContentModerator/ContentModeratorQuickstart.py?name=snippet_imagereview_vars)]

### Create an image review

Add the following code to create and post a review for the given image URL. The code saves a reference to the review ID. 
[!code-python[](~/cognitive-services-quickstart-code/python/ContentModerator/ContentModeratorQuickstart.py?name=snippet_imagereview_create)]

### Get review details

Use the following code to check the details of a given review. After you create the review, you can go to the Review tool yourself and interact with the content. For information on how to do this, see the [Reviews how-to guide](https://docs.microsoft.com/azure/cognitive-services/content-moderator/review-tool-user-guide/review-moderated-images). When you're finished, you can run this code again, and it will retrieve the results of the review process.

[!code-python[](~/cognitive-services-quickstart-code/python/ContentModerator/ContentModeratorQuickstart.py?name=snippet_imagereview_getdetails)]

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

* [Portal](../../../cognitive-services-apis-create-account.md#clean-up-resources)
* [Azure CLI](../../../cognitive-services-apis-create-account-cli.md#clean-up-resources)

## Next steps

In this quickstart, you learned how to use the Content Moderator Python library to do moderation tasks. Next, learn more about the moderation of images or other media by reading a conceptual guide.

> [!div class="nextstepaction"]
>[Image moderation concepts](https://docs.microsoft.com/azure/cognitive-services/content-moderator/image-moderation-api)

* [What is Azure Content Moderator?](../../overview.md)
* The source code for this sample can be found on [GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/python/ContentModerator/ContentModeratorQuickstart.py).