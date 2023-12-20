---
title: "Content Moderator Python client library quickstart"
titleSuffix: Azure AI services
description: In this quickstart, learn how to get started with the Azure Content Moderator client library for Python. Build content filtering software into your app to comply with regulations or maintain the intended environment for your users.
#services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: azure-ai-content-moderator
ms.topic: include
ms.date: 09/15/2020
ms.custom: "cog-serv-seo-aug-2020"
ms.author: pafarley
---

Get started with the Azure Content Moderator client library for Python. Follow these steps to install the PiPy package and try out the example code for basic tasks. 

Content Moderator is an AI service that lets you handle content that is potentially offensive, risky, or otherwise undesirable. Use the AI-powered content moderation service to scan text, image, and videos and apply content flags automatically. Build content filtering software into your app to comply with regulations or maintain the intended environment for your users.

Use the Content Moderator client library for Python to:

* Moderate text
* Use a custom terms list
* Moderate images
* Use a custom image list

[Reference documentation](/python/api/overview/azure/content-moderator) | [Library source code](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/cognitiveservices/azure-cognitiveservices-vision-contentmoderator) | [Package (PiPy)](https://pypi.org/project/azure-cognitiveservices-vision-contentmoderator/) | [Samples](https://github.com/Azure-Samples/cognitive-services-python-sdk-samples)

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/)
* [Python 3.x](https://www.python.org/)
  * Your Python installation should include [pip](https://pip.pypa.io/en/stable/). You can check if you have pip installed by running `pip --version` on the command line. Get pip by installing the latest version of Python.
* Once you have your Azure subscription, <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesContentModerator"  title="Create a Content Moderator resource"  target="_blank">create a Content Moderator resource</a> in the Azure portal to get your key and endpoint. Wait for it to deploy and click the **Go to resource** button.
    * You will need the key and endpoint from the resource you create to connect your application to Content Moderator. You'll paste your key and endpoint into the code below later in the quickstart.
    * You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.


## Setting up

### Install the client library

After installing Python, you can install the Content Moderator client library with the following command:

```console
pip install --upgrade azure-cognitiveservices-vision-contentmoderator
```

### Create a new Python application

Create a new Python script and open it in your preferred editor or IDE. Then add the following `import` statements to the top of the file.

[!code-python[](~/cognitive-services-quickstart-code/python/ContentModerator/ContentModeratorQuickstart.py?name=snippet_imports)]

> [!TIP]
> Want to view the whole quickstart code file at once? You can find it on [GitHub](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/python/ContentModerator/ContentModeratorQuickstart.py), which contains the code examples in this quickstart.

Next, create variables for your resource's endpoint location and key.

> [!IMPORTANT]
> Go to the Azure portal. If the Content Moderator resource you created in the **Prerequisites** section deployed successfully, click the **Go to Resource** button under **Next Steps**. You can find your key and endpoint in the resource's **key and endpoint** page, under **resource management**. 

[!code-python[](~/cognitive-services-quickstart-code/python/ContentModerator/ContentModeratorQuickstart.py?name=snippet_vars)]

> [!IMPORTANT]
> Remember to remove the key from your code when you're done, and never post it publicly. For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](../../../../key-vault/general/overview.md). See the Azure AI services [security](../../../security-features.md) article for more information.

## Object model

The following classes handle some of the major features of the Content Moderator Python client library.

|Name|Description|
|---|---|
|[ContentModeratorClient](/python/api/azure-cognitiveservices-vision-contentmoderator/azure.cognitiveservices.vision.contentmoderator.content_moderator_client.contentmoderatorclient)|This class is needed for all Content Moderator functionality. You instantiate it with your subscription information, and you use it to produce instances of other classes.|
|[ImageModerationOperations](/python/api/azure-cognitiveservices-vision-contentmoderator/azure.cognitiveservices.vision.contentmoderator.operations.imagemoderationoperations)|This class provides the functionality for analyzing images for adult content, personal information, or human faces.|
|[TextModerationOperations](/python/api/azure-cognitiveservices-vision-contentmoderator/azure.cognitiveservices.vision.contentmoderator.operations.textmoderationoperations)|This class provides the functionality for analyzing text for language, profanity, errors, and personal information.|

## Code examples

These code snippets show you how to do the following tasks with the Content Moderator client library for Python:

* [Authenticate the client](#authenticate-the-client)
* [Moderate text](#moderate-text)
* [Use a custom terms list](#use-a-custom-terms-list)
* [Moderate images](#moderate-images)
* [Use a custom image list](#use-a-custom-image-list)

## Authenticate the client

Instantiate a client with your endpoint and key. Create a [CognitiveServicesCredentials](/python/api/msrest/msrest.authentication.cognitiveservicescredentials) object with your key, and use it with your endpoint to create an [ContentModeratorClient](/python/api/azure-cognitiveservices-vision-contentmoderator/azure.cognitiveservices.vision.contentmoderator.content_moderator_client.contentmoderatorclient) object.

[!code-python[](~/cognitive-services-quickstart-code/python/ContentModerator/ContentModeratorQuickstart.py?name=snippet_client)]

## Moderate text

The following code uses a Content Moderator client to analyze a body of text and print the results to the console. First, create a **text_files/** folder at the root of your project and add a *content_moderator_text_moderation.txt* file. Add your own text to this file, or use the following sample text:

```
Is this a grabage email abcdef@abcd.com, phone: 4255550111, IP: 255.255.255.255, 1234 Main Boulevard, Panapolis WA 96555.
<offensive word> is the profanity here. Is this information PII? phone 2065550111
```

Add a reference to the new folder.

[!code-python[](~/cognitive-services-quickstart-code/python/ContentModerator/ContentModeratorQuickstart.py?name=snippet_textfolder)]

Then, add the following code to your Python script.

[!code-python[](~/cognitive-services-quickstart-code/python/ContentModerator/ContentModeratorQuickstart.py?name=snippet_textmod)]

## Use a custom terms list

The following code shows how to manage a list of custom terms for text moderation. You can use the [ListManagementTermListsOperations](/python/api/azure-cognitiveservices-vision-contentmoderator/azure.cognitiveservices.vision.contentmoderator.operations.listmanagementtermlistsoperations) class to create a terms list, manage the individual terms, and screen other bodies of text against it.

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

### Delete a list

Use the following code to delete a custom terms list.

[!code-python[](~/cognitive-services-quickstart-code/python/ContentModerator/ContentModeratorQuickstart.py?name=snippet_termslist_deletelist)]

## Moderate images

The following code uses a Content Moderator client, along with an [ImageModerationOperations](/python/api/azure-cognitiveservices-vision-contentmoderator/azure.cognitiveservices.vision.contentmoderator.operations.imagemoderationoperations) object, to analyze images for adult and racy content.

### Get sample images

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

The following code shows how to manage a custom list of images for image moderation. This feature is useful if your platform frequently receives instances of the same set of images that you want to screen out. By maintaining a list of these specific images, you can improve performance. The [ListManagementImageListsOperations](/python/api/azure-cognitiveservices-vision-contentmoderator/azure.cognitiveservices.vision.contentmoderator.operations.listmanagementimagelistsoperations) class allows you to create an image list, manage the individual images on the list, and compare other images against it.

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


## Run the application

Run the application with the `python` command on your quickstart file.

```console
python quickstart-file.py
```

## Clean up resources

If you want to clean up and remove an Azure AI services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

* [Portal](../../../multi-service-resource.md?pivots=azportal#clean-up-resources)
* [Azure CLI](../../../multi-service-resource.md?pivots=azcli#clean-up-resources)

## Next steps

In this quickstart, you learned how to use the Content Moderator Python library to do moderation tasks. Next, learn more about the moderation of images or other media by reading a conceptual guide.

> [!div class="nextstepaction"]
>[Image moderation concepts](../../image-moderation-api.md)
