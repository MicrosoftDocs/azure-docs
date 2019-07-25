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

* Get a [trial key](https://azure.microsoft.com/try/cognitive-services/#decision) valid for 7 days for free. After you sign up, it will be available on the [Azure website](https://azure.microsoft.com/try/cognitive-services/my-apis/).  
* View your resource on the [Azure Portal](https://portal.azure.com/)

After you get a key from your trial subscription or resource, [create an environment variable](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account#configure-an-environment-variable-for-authentication) for the key, named `CONTENTMODERATOR_SUBSCRIPTION_KEY`.
 
### Create a python script

Create a new Python script and open it in your preferred editor or IDE. Then add the following `import` statements to the top of the file.

```python
import os.path
from pprint import pprint
import time
from io import BytesIO
from random import random
import uuid

from azure.cognitiveservices.vision.contentmoderator import ContentModeratorClient
import azure.cognitiveservices.vision.contentmoderator.models import *
from msrest.authentication import CognitiveServicesCredentials
```

Create variables for your resource's Azure location and your key as an environment variable. If you created the environment variable after the application is launched, the editor, IDE, or shell running it will need to be closed and reloaded to access the variable.

```python
CONTENTMODERATOR_ENDPOINT = "https://westus.api.cognitive.microsoft.com"
subscription_key = os.environ.get("CONTENTMODERATOR_SUBSCRIPTION_KEY")
```

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
> This quickstart assumes you've [created an environment variable](../../cognitive-services-apis-create-account.md#configure-an-environment-variable-for-authentication) for your Content Moderator key, named `CONTENTMODERATOR_SUBSCRIPTION_KEY`.

Instantiate a client with your endpoint and key. Create a [CognitiveServicesCredentials](https://docs.microsoft.com/python/api/msrest/msrest.authentication.cognitiveservicescredentials?view=azure-python) object with your key, and use it with your endpoint to create an [ContentModeratorClient](tbd) object.

```python
client = ContentModeratorClient(
    endpoint=CONTENTMODERATOR_ENDPOINT,
    credentials=CognitiveServicesCredentials(subscription_key)
)
```

### Moderate text

The following code uses a Content Moderator client to analyze a body of text and print the results to the console. You must create a **text_files** folder at the root of your project and add a *content_moderator_text_moderation.txt* file. Add your own text to this file, or use the following sample text:

```
Is this a grabage email abcdef@abcd.com, phone: 6657789887, IP: 255.255.255.255, 1 Microsoft Way, Redmond, WA 98052.
Crap is the profanity here. Is this information PII? phone 3144444444
```

Then, add the following function definition to your Python script:

```python
TEXT_FOLDER = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), "text_files")

def text_moderation():
    """TextModeration.
    This will moderate a given long text.
    """

    # Screen the input text: check for profanity,
    # do autocorrect text, and check for personally identifying
    # information (PII)
    with open(os.path.join(TEXT_FOLDER, 'content_moderator_text_moderation.txt'), "rb") as text_fd:
        screen = client.text_moderation.screen_text(
            text_content_type="text/plain",
            text_content=text_fd,
            language="eng",
            autocorrect=True,
            pii=True
        )
        assert isinstance(screen, Screen)
        pprint(screen.as_dict())
```

### Use a custom terms list

The following code shows how to manage a list of custom terms for text moderation. You can use the [ListManagementTermListsOperations](https://docs.microsoft.com/python/api/azure-cognitiveservices-vision-contentmoderator/azure.cognitiveservices.vision.contentmoderator.operations.listmanagementtermlistsoperations?view=azure-python) class to create a terms list, add, retrieve, and remove terms from a list, screen text against your list of terms, and delete the terms list.

To use this sample, you must create a **text_files** folder at the root of your project and add a *content_moderator_term_list.txt* file. This should contain organic text that will be checked against the list of terms. You can use the following sample text:

```
This text contains the terms "term1" and "term2".
```

Then, add the following function definition to your Python script:

```python
TEXT_FOLDER = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), "text_files")

def terms_lists():
    """TermsList.
    This will screen text using a term list.
    """

    #
    # Create list
    #

    print("\nCreating list")
    custom_list = client.list_management_term_lists.create(
        content_type="application/json",
        body={
            "name": "Term list name",
            "description": "Term list description",
        }
    )
    print("List created:")
    assert isinstance(custom_list, TermList)
    pprint(custom_list.as_dict())
    list_id = custom_list.id

    #
    # Update list details
    #
    print("\nUpdating details for list {}".format(list_id))
    updated_list = client.list_management_term_lists.update(
        list_id=list_id,
        content_type="application/json",
        body={
            "name": "New name",
            "description": "New description"
        }
    )
    assert isinstance(updated_list, TermList)
    pprint(updated_list.as_dict())

    #
    # Add terms
    #
    print("\nAdding terms to list {}".format(list_id))
    client.list_management_term.add_term(
        list_id=list_id,
        term="term1",
        language="eng"
    )
    client.list_management_term.add_term(
        list_id=list_id,
        term="term2",
        language="eng"
    )

    #
    # Get all terms ids
    #
    print("\nGetting all term IDs for list {}".format(list_id))
    terms = client.list_management_term.get_all_terms(
        list_id=list_id, language="eng")
    assert isinstance(terms, Terms)
    terms_data = terms.data
    assert isinstance(terms_data, TermsData)
    pprint(terms_data.as_dict())

    #
    # Refresh the index
    #
    print("\nRefreshing the search index for list {}".format(list_id))
    refresh_index = client.list_management_term_lists.refresh_index_method(
        list_id=list_id, language="eng")
    assert isinstance(refresh_index, RefreshIndex)
    pprint(refresh_index.as_dict())

    print("\nWaiting {} minutes to allow the server time to propagate the index changes.".format(
        LATENCY_DELAY))
    time.sleep(LATENCY_DELAY * 60)

    #
    # Screen text
    #
    with open(os.path.join(TEXT_FOLDER, 'content_moderator_term_list.txt'), "rb") as text_fd:
        screen = client.text_moderation.screen_text(
            text_content_type="text/plain",
            text_content=text_fd,
            language="eng",
            autocorrect=False,
            pii=False,
            list_id=list_id
        )
        assert isinstance(screen, Screen)
        pprint(screen.as_dict())

    #
    # Remove terms
    #
    term_to_remove = "term1"
    print("\nRemove term {} from list {}".format(term_to_remove, list_id))
    client.list_management_term.delete_term(
        list_id=list_id,
        term=term_to_remove,
        language="eng"
    )

    #
    # Refresh the index
    #
    print("\nRefreshing the search index for list {}".format(list_id))
    refresh_index = client.list_management_term_lists.refresh_index_method(
        list_id=list_id, language="eng")
    assert isinstance(refresh_index, RefreshIndex)
    pprint(refresh_index.as_dict())

    print("\nWaiting {} minutes to allow the server time to propagate the index changes.".format(
        LATENCY_DELAY))
    time.sleep(LATENCY_DELAY * 60)

    #
    # Re-Screen text
    #
    with open(os.path.join(TEXT_FOLDER, 'content_moderator_term_list.txt'), "rb") as text_fd:
        print('\nScreening text "{}" using term list {}'.format(text, list_id))
        screen = client.text_moderation.screen_text(
            text_content_type="text/plain",
            text_content=text_fd,
            language="eng",
            autocorrect=False,
            pii=False,
            list_id=list_id
        )
        assert isinstance(screen, Screen)
        pprint(screen.as_dict())

    #
    # Delete all terms
    #
    print("\nDelete all terms in the image list {}".format(list_id))
    client.list_management_term.delete_all_terms(
        list_id=list_id, language="eng")

    #
    # Delete list
    #
    print("\nDelete the term list {}".format(list_id))
    client.list_management_term_lists.delete(list_id=list_id)
```

### Moderate images

The following code uses a Content Moderator client, along with an **ImageModerationOperations** object, to analyze images for adult and racy content.

```python
IMAGE_LIST = [
    "https://moderatorsampleimages.blob.core.windows.net/samples/sample2.jpg",
    "https://moderatorsampleimages.blob.core.windows.net/samples/sample5.png"
]

def image_moderation():
    """ImageModeration.
    This will review an image using workflow and job.
    """

    for image_url in IMAGE_LIST:
        print("\nEvaluate image {}".format(image_url))

        print("\nEvaluate for adult and racy content.")
        evaluation = client.image_moderation.evaluate_url_input(
            content_type="application/json",
            cache_image=True,
            data_representation="URL",
            value=image_url
        )
        assert isinstance(evaluation, Evaluate)
        pprint(evaluation.as_dict())

        print("\nDetect and extract text.")
        evaluation = client.image_moderation.ocr_url_input(
            language="eng",
            content_type="application/json",
            data_representation="URL",
            value=image_url,
            cache_image=True,
        )
        assert isinstance(evaluation, OCR)
        pprint(evaluation.as_dict())

        print("\nDetect faces.")
        evaluation = client.image_moderation.find_faces_url_input(
            content_type="application/json",
            cache_image=True,
            data_representation="URL",
            value=image_url
        )
        assert isinstance(evaluation, FoundFaces)
        pprint(evaluation.as_dict())
```

### Use a custom image list

The following code shows how to manage a custom list of images for image moderation. This is useful if your platform frequently receives instances of the same set of images that you want to screen out. By maintaining a list of these specific images, you can improve performance. The [ListManagementImageListsOperations](https://docs.microsoft.com/python/api/azure-cognitiveservices-vision-contentmoderator/azure.cognitiveservices.vision.contentmoderator.operations.listmanagementimagelistsoperations?view=azure-python) class allows you to create an image list, add, retrieve, and remove images from a list, compare new images against your list, and delete the image list.

Create the following text variables to store the image URLs that you'll use in this scenario.

> [!NOTE]
> This is not the proper list itself, but an informal list of images that will be added in the `add images` section of the code.

```python
IMAGE_LIST = {
    "Sports": [
        "https://moderatorsampleimages.blob.core.windows.net/samples/sample4.png",
        "https://moderatorsampleimages.blob.core.windows.net/samples/sample6.png",
        "https://moderatorsampleimages.blob.core.windows.net/samples/sample9.png"
    ],
    "Swimsuit": [
        "https://moderatorsampleimages.blob.core.windows.net/samples/sample1.jpg",
        "https://moderatorsampleimages.blob.core.windows.net/samples/sample3.png",
        "https://moderatorsampleimages.blob.core.windows.net/samples/sample4.png",
        "https://moderatorsampleimages.blob.core.windows.net/samples/sample16.png"
    ]
}

IMAGES_TO_MATCH = [
    "https://moderatorsampleimages.blob.core.windows.net/samples/sample1.jpg",
    "https://moderatorsampleimages.blob.core.windows.net/samples/sample4.png",
    "https://moderatorsampleimages.blob.core.windows.net/samples/sample5.png",
    "https://moderatorsampleimages.blob.core.windows.net/samples/sample16.png"
]
```

Then, add the following function definition to your script.

```python
def image_lists():
    """ImageList.
    This will review an image using workflow and job.
    """

    #
    # Create list
    #
    print("Creating list MyList\n")
    custom_list = client.list_management_image_lists.create(
        content_type="application/json",
        body={
            "name": "MyList",
            "description": "A sample list",
            "metadata": {
                "key_one": "Acceptable",
                "key_two": "Potentially racy"
            }
        }
    )
    print("List created:")
    assert isinstance(custom_list, ImageList)
    pprint(custom_list.as_dict())
    list_id = custom_list.id

    #
    # Add images
    #

    def add_images(list_id, image_url, label):
        """Generic add_images from url and label."""
        print("\nAdding image {} to list {} with label {}.".format(
            image_url, list_id, label))
        try:
            added_image = client.list_management_image.add_image_url_input(
                list_id=list_id,
                content_type="application/json",
                data_representation="URL",
                value=image_url,
                label=label
            )
        except APIErrorException as err:
            # sample4 will fail
            print("Unable to add image to list: {}".format(err))
        else:
            assert isinstance(added_image, Image)
            pprint(added_image.as_dict())
            return added_image

    print("\nAdding images to list {}".format(list_id))
    index = {}  # Keep an index url to id for later removal
    for label, urls in IMAGE_LIST.items():
        for url in urls:
            image = add_images(list_id, url, label)
            if image:
                index[url] = image.content_id

    #
    # Get all images ids
    #
    print("\nGetting all image IDs for list {}".format(list_id))
    image_ids = client.list_management_image.get_all_image_ids(list_id=list_id)
    assert isinstance(image_ids, ImageIds)
    pprint(image_ids.as_dict())

    #
    # Update list details
    #
    print("\nUpdating details for list {}".format(list_id))
    updated_list = client.list_management_image_lists.update(
        list_id=list_id,
        content_type="application/json",
        body={
            "name": "Swimsuits and sports"
        }
    )
    assert isinstance(updated_list, ImageList)
    pprint(updated_list.as_dict())

    #
    # Get list details
    #
    print("\nGetting details for list {}".format(list_id))
    list_details = client.list_management_image_lists.get_details(
        list_id=list_id)
    assert isinstance(list_details, ImageList)
    pprint(list_details.as_dict())

    #
    # Refresh the index
    #
    print("\nRefreshing the search index for list {}".format(list_id))
    refresh_index = client.list_management_image_lists.refresh_index_method(
        list_id=list_id)
    assert isinstance(refresh_index, RefreshIndex)
    pprint(refresh_index.as_dict())

    print("\nWaiting {} minutes to allow the server time to propagate the index changes.".format(
        LATENCY_DELAY))
    time.sleep(LATENCY_DELAY * 60)

    #
    # Match images against the image list.
    #
    for image_url in IMAGES_TO_MATCH:
        print("\nMatching image {} against list {}".format(image_url, list_id))
        match_result = client.image_moderation.match_url_input(
            content_type="application/json",
            list_id=list_id,
            data_representation="URL",
            value=image_url,
        )
        assert isinstance(match_result, MatchResponse)
        print("Is match? {}".format(match_result.is_match))
        print("Complete match details:")
        pprint(match_result.as_dict())

    #
    # Remove images
    #
    correction = "https://moderatorsampleimages.blob.core.windows.net/samples/sample16.png"
    print("\nRemove image {} from list {}".format(correction, list_id))
    client.list_management_image.delete_image(
        list_id=list_id,
        image_id=index[correction]
    )

    #
    # Refresh the index
    #
    print("\nRefreshing the search index for list {}".format(list_id))
    client.list_management_image_lists.refresh_index_method(list_id=list_id)

    print("\nWaiting {} minutes to allow the server time to propagate the index changes.".format(
        LATENCY_DELAY))
    time.sleep(LATENCY_DELAY * 60)

    #
    # Re-match
    #
    print("\nMatching image. The removed image should not match")
    for image_url in IMAGES_TO_MATCH:
        print("\nMatching image {} against list {}".format(image_url, list_id))
        match_result = client.image_moderation.match_url_input(
            content_type="application/json",
            list_id=list_id,
            data_representation="URL",
            value=image_url,
        )
        assert isinstance(match_result, MatchResponse)
        print("Is match? {}".format(match_result.is_match))
        print("Complete match details:")
        pprint(match_result.as_dict())

    #
    # Delete all images
    #
    print("\nDelete all images in the image list {}".format(list_id))
    client.list_management_image.delete_all_images(list_id=list_id)

    #
    # Delete list
    #
    print("\nDelete the image list {}".format(list_id))
    client.list_management_image_lists.delete(list_id=list_id)

    #
    # Get all list ids
    #
    print("\nVerify that the list {} was deleted.".format(list_id))
    image_lists = client.list_management_image_lists.get_all_image_lists()
    assert not any(list_id == image_list.id for image_list in image_lists)
```

### Create a review

You can use the Content Moderator Python SDK to feed content into the [Review tool](https://contentmoderator.cognitive.microsoft.com) so that human moderators can review it. To learn more about the Review tool, see the [Conceptual guide](./review-tool-user-guide/human-in-the-loop.md).

The following code uses the [ReviewsOperations](https://docs.microsoft.com/python/api/azure-cognitiveservices-vision-contentmoderator/azure.cognitiveservices.vision.contentmoderator.operations.reviewsoperations?view=azure-python) class to create a review, retrieve its ID, and check its details after receiving human input through the Review tool's web portal.

You must first sign in to the Review tool, retrieve your team name, and save it to a variable. Optionally, you can set up a callback endpoint to receive updates on the activity of the review.

```python
def image_review():
    """ImageReview.
    This will create a review for images.
    """

    # The name of the team to assign the job to.
    # This must be the team name you used to create your Content Moderator account. You can
    # retrieve your team name from the Review tool web site. Your team name is the Id
    # associated with your subscription.
    team_name = "insert your team name here"

    # An image to review
    image_url = "https://moderatorsampleimages.blob.core.windows.net/samples/sample5.png"

    # Where you want to receive the approval/refuse event. This is the only way to get this information.
    call_back_endpoint = "https://requestb.in/qmsakwqm"
```

Add the following function definition to your script.

```python
    
    # Create review
    print("Create review for {}.\n".format(image_url))
    review_item = {
        "type": "Image",             # Possible values include: 'Image', 'Text'
        "content": image_url,        # How to download the image
        "content_id": uuid.uuid4(),  # Random id
        "callback_endpoint": call_back_endpoint,
        "metadata": [{
            "key": "sc",
            "value": True  # will be sent to Azure as "str" cast.
        }]
    }

    reviews = client.reviews.create_reviews(
        url_content_type="application/json",
        team_name=team_name,
        create_review_body=[review_item]  # As many review item as you need
    )

    # Get review ID
    review_id = reviews[0]  # Ordered list of string of review ID

    print("\nGet review details")
    review_details = client.reviews.get_review(
        team_name=team_name, review_id=review_id)
    pprint(review_details.as_dict())

    # wait for user input through the Review tool web portal
    input("\nPerform manual reviews on the Content Moderator Review Site, and hit enter here.")

    # Check the results of the human review
    print("\nGet review details")
    review_details = client.reviews.get_review(
        team_name=team_name, review_id=review_id)
    pprint(review_details.as_dict())

```
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

* [Portal](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account#clean-up-resources)
* [Azure CLI](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account-cli#clean-up-resources)

## Next steps

In this quickstart, you learned how to use the Content Moderator Python library to perform moderation tasks. Next, learn more about the moderation of images or other media by reading a conceptual guide.

> [!div class="nextstepaction"]
>[Image moderation concepts](https://docs.microsoft.com/azure/cognitive-services/content-moderator/image-moderation-api)

* [What is Azure Content Moderator?](./overview.md)
* The source code for this sample can be found on [GitHub](https://github.com/Azure-Samples/cognitive-services-python-sdk-samples/tree/master/samples/vision).