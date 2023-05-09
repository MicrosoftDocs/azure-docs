---
title: "Use blocklists"
titleSuffix: Azure Cognitive Services
description: Learn how to customize text moderation in Content Safety by using your own list of blocked terms.
services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: cognitive-services
ms.subservice: content-safety
ms.topic: how-to
ms.date: 04/21/2023
ms.author: pafarley
keywords: 
---


# Use a blocklist

> [!CAUTION]
> The sample data in this guide may contain offensive content. User discretion is advised.

The default AI classifiers are sufficient for most content moderation needs. However, you may need to screen for items that are specific to your use case.

## Prerequisites

* An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/) 
* Once you have your Azure subscription, <a href="https://aka.ms/acs-create"  title="Create a Content Safety resource"  target="_blank">create a Content Safety resource </a> in the Azure portal to get your key and endpoint. Enter a unique name for your resource, select the subscription you entered on the application form, select a resource group, supported region, and supported pricing tier. Then select **Create**.
  * The resource takes a few minutes to deploy. After it finishes, Select **go to resource**. In the left pane, under **Resource Management**, select **Subscription Key and Endpoint**. The endpoint and either of the keys are used to call APIs.
* [cURL](https://curl.haxx.se/) or * [Python 3.x](https://www.python.org/) installed
  * Your Python installation should include [pip](https://pip.pypa.io/en/stable/). You can check if you have pip installed by running `pip --version` on the command line. Get pip by installing the latest version of Python.

## Analyze text with a blocklist


You can create blocklists to use with the Text API. The following steps help you get started.

The below fields must be included in the url:

| Name         | Description | Type     |
| :---------------- | :-------------- | ----------- |
| **BlocklistName** | (Required) Text blocklist Name. Only support following characters: `0-9 A-Z a-z - . _ ~        `      Example: `url = "<Endpoint>/contentsafety/text/lists/{blocklistName}?api-version=2022-12-30-preview"` | String      |
| **blockItems**    | (Required) This is the blocklistName to be checked.     Example: `url = "<Endpoint>/contentsafety/text/lists/{blocklistName}/items/{blockItems}?api-version=2022-12-30-preview"` | BCP 47 code |
| **API Version**   | (Required) This is the API version to be checked. Current version is: api-version=2022-12-30-preview. Example: `<Endpoint>/contentsafety/text:analyze?api-version=2022-12-30-preview` | String      |



### Create or modify a blocklist

#### [REST API](#tab/rest)

Copy the cURL command below to a text editor and make the following changes:

1. Replace `<endpoint>` with your endpoint URL.
1. Replace `<enter_your_key_here>` with your key.
1. Replace `<your_list_id>` (in the URL) with a custom name for your list. Also replace the last term of the REST URL with the same name. Allowed characters: 0-9, A-Z, a-z, `- . _ ~`.
1. Optionally replace the value of the `"description"` field with a custom description.


```shell
curl --location --request PATCH '<endpoint>/contentsafety/text/blocklists/<your_list_id>?api-version=2022-12-30-preview' \
--header 'Ocp-Apim-Subscription-Key: <enter_your_key_here>' \
--header 'Content-Type: application/json' \
--data-raw '{
    "description": "This is a violence list"
}'
```

The response code should be `201` and the URL to get the created list should be contained in the header, named **Location**.

#### [Python](#tab/python)

Create a new Python script and open it in your preferred editor or IDE. Paste in the following code.

```python
import os
from azure.ai.contentsafety import ContentSafetyClient
from azure.core.credentials import AzureKeyCredential
from azure.ai.contentsafety.models import TextBlocklist
from azure.core.exceptions import HttpResponseError

endpoint = "<endpoint>"
key = "<enter_your_key_here>"
  
# Create an Content Safety client
client = ContentSafetyClient(endpoint, AzureKeyCredential(key))

def create_or_update_text_blocklist(name, description):
    try:
        return client.create_or_update_text_blocklist(
            blocklist_name=name, resource=TextBlocklist(description=description)
        )
    except HttpResponseError as e:
        print("Create or update text blocklist failed. ")
        print("Error code: {}".format(e.error.code))
        print("Error message: {}".format(e.error.message))
        return None
    except Exception as e:
        print(e)
        return None


if __name__ == "__main__":
    blocklist_name = "<your_list_id>"
    blocklist_description = "Test blocklist management."

    # create blocklist
    result = create_or_update_text_blocklist(name=blocklist_name, description=blocklist_description)
    if result is not None:
        print("Blocklist created: {}".format(result))
```

1. Replace `<endpoint>` with your endpoint URL.
1. Replace `<enter_your_key_here>` with your key.
1. Replace `<your_list_id>` with a custom name for your list. Also replace the last term of the REST URL with the same name. Allowed characters: 0-9, A-Z, a-z, `- . _ ~`.
1. Optionally replace `Test blocklist management.` field with a custom description.

---

### Add or modify a blockItem in the list

> [!NOTE]
>
> There is a maximum limit of **10,000 terms** in total across all lists.

#### [REST API](#tab/rest)

Copy the cURL command below to a text editor and make the following changes:

1. Replace `<endpoint>` with your endpoint URL.
1. Replace `<enter_your_key_here>` with your key.
1. Replace `<your_list_id>` with the ID value you used in the list creation step.
1. Optionally replace the value of the `"description"` field with a custom description.
1. Replace the value of the `"text"` field with the item you'd like to add to your blocklist.

```shell
curl --location --request PATCH '<endpoint>/contentsafety/text/blocklists/<your_list_id>:addBlockItems?api-version=2022-12-30-preview' \
--header 'Ocp-Apim-Subscription-Key: <enter_your_key_here>' \
--header 'Content-Type: application/json' \
--data-raw '"blockItems": [{
    "description": "my first word",
    "text": "bleed"
}]'
```

> [!TIP]
> You can add multiple blockItems in one API call. Make the request body a JSON array of data groups:
>
> [{
>    "description": "my first word",
>    "text": "bleed"
> },
> {
>    "description": "my second word",
>    "text": "blood"
> }]


The response code should be `201` and the URL to get the created list should be contained in the header, named **Location**. The response body will contain an ID value of the blockItem you just added.

```console
{
  "blocklistName": "<your_list_id>",
  "description": "my first word",
  "blockItemId": "c4491d5b-9ea9-4d2a-97c7-70ae8e6fc8c1"
}
```

#### [Python](#tab/python)

```python
import os
from azure.ai.contentsafety import ContentSafetyClient
from azure.core.credentials import AzureKeyCredential
from azure.ai.contentsafety.models import TextBlocklist, TextBlockItemInfo, AddBlockItemsOptions, RemoveBlockItemsOptions, AnalyzeTextOptions
from azure.core.exceptions import HttpResponseError
import time


endpoint = "<endpoint>"
key = "<enter_your_key_here>"

# Create an Content Safety client
client = ContentSafetyClient(endpoint, AzureKeyCredential(key))

def add_block_items(name, items):
    block_items = [TextBlockItemInfo(text=i) for i in items]
    try:
        response = client.add_block_items(
            blocklist_name=name,
            body=AddBlockItemsOptions(block_items=block_items),
        )
    except HttpResponseError as e:
        print("Add block items failed.")
        print("Error code: {}".format(e.error.code))
        print("Error message: {}".format(e.error.message))
        return None

    except Exception as e:
        print(e)
        return None

    return response.value


if __name__ == "__main__":
    blocklist_name = "TestBlocklist"
    blocklist_description = "Test blocklist management."

    block_item_text_1 = "k*ll"
    block_item_text_2 = "h*te"
    input_text = "I h*te you and I want to k*ll you."

    # add block items
    result = add_block_items(name=blocklist_name, items=[block_item_text_1, block_item_text_2])
    if result is not None:
        print("Block items added: {}".format(result))
```

1. Replace `<endpoint>` with your endpoint URL.
1. Replace `<enter_your_key_here>` with your key.

---

> [!NOTE]
> 
> There will be some delay after you add or edit a blockItem before it takes effect on text analysis, usually **not more than five minutes**.

### Analyze text with a blocklist

#### [REST API](#tab/rest)

1. Replace `<endpoint>` with your endpoint URL.
1. Replace `<enter_your_key_here>` with your key.
1. Replace `<your_list_id>` with the ID value you used in the list creation step. The `"blocklistNames"` field can contain an array of multiple list IDs.
1. Optionally change the value of `"breakByBlocklists"`. `true` indicates that once a blocklist is matched, the analysis will return immediately without model output. `false` will cause the model to continue to do analysis in the default categories.
1. Optionally change the value of the `"text"` field to whatever text you want to analyze. 

```shell
curl --location --request POST '<endpoint>/contentsafety/text:analyze?api-version=2022-12-30-preview&' \
--header 'Ocp-Apim-Subscription-Key: <enter_your_key_here>' \
--header 'Content-Type: application/json' \
--data-raw '{
  "text": "I want to beat you till you bleed",
  "categories": [
    "Hate",
    "Sexual",
    "SelfHarm",
    "Violence"
  ],
  "blocklistNames":["<your_list_id>"],
  "breakByBlocklists": true
}'
```

The JSON response will contain a `"blocklistMatchResults"` that indicates any matches with your blocklist. It reports the location in the text string where the match was found.

```json
{
  "blocklistMatchResults": [
    {
      "blocklistName": "1234",
      "blockItems": "01",
      "itemText": "bleed",
      "offset": "28",
      "length": "5"
    }
  ]
}
```

#### [Python](#tab/python)

```python
import os
from azure.ai.contentsafety import ContentSafetyClient
from azure.core.credentials import AzureKeyCredential
from azure.ai.contentsafety.models import AnalyzeTextOptions
from azure.core.exceptions import HttpResponseError
import time


endpoint = "[Your endpoint]"
key ="[Your subscription key]"

# Create an Content Safety client
client = ContentSafetyClient(endpoint, AzureKeyCredential(key))

def analyze_text_with_blocklists(name, text):
    try:
        response = client.analyze_text(
            AnalyzeTextOptions(text=text, blocklist_names=[name], break_by_blocklists=False)
        )
    except HttpResponseError as e:
        print("Analyze text failed.")
        print("Error code: {}".format(e.error.code))
        print("Error message: {}".format(e.error.message))
        return None
    except Exception as e:
        print(e)
        return None

    return response.blocklists_match_results


if __name__ == "__main__":
    blocklist_name = "TestBlocklist"
    input_text = "I h*te you and I want to k*ll you."

    # analyze text
    match_results = analyze_text_with_blocklists(name=blocklist_name, text=input_text)
    for match_result in match_results:
        print("Block item {} in {} was hit, text={}, offset={}, length={}."
              .format(match_result.block_item_id, match_result.blocklist_name, match_result.block_item_text, match_result.offset, match_result.length))
```

1. Replace `<endpoint>` with your endpoint URL.
1. Replace `<enter_your_key_here>` with your key.


---
## Other blocklist operations

This section contains more operations to help you manage and use the blocklist feature.

### Get all blockItems in a list

#### [REST API](#tab/rest)


Copy the cURL command below to a text editor and make the following changes:

1. Replace `<endpoint>` with your endpoint URL.
1. Replace `<enter_your_key_here>` with your key.
1. Replace `<your_list_id>` (in the request URL) with the ID value you used in the list creation step.

```shell
curl --location --request GET '<endpoint>/contentsafety/text/blocklists/<your_list_id>/blockItems?api-version=2022-12-30-preview' \
--header 'Ocp-Apim-Subscription-Key: <enter_your_key_here>' \
--header 'Content-Type: application/json'
```

The status code should be `200` and the response body should look like this:

```json
{
 "values": [
  {
   "blockItemId": "01",
   "description": "my first word",
   "text": "bleed",
  }
 ]
}
```

#### [Python](#tab/python)

```python
import os
from azure.ai.contentsafety import ContentSafetyClient
from azure.core.credentials import AzureKeyCredential
from azure.core.exceptions import HttpResponseError

endpoint = "[Your endpoint]"
key = "[Your subscription key]"

# Create an Content Safety client
client = ContentSafetyClient(endpoint, AzureKeyCredential(key))

def list_block_items(name):
    try:
        response = client.list_text_blocklist_items(blocklist_name=name)
        return list(response)
    except HttpResponseError as e:
        print("List block items failed.")
        print("Error code: {}".format(e.error.code))
        print("Error message: {}".format(e.error.message))
        return None
    except Exception as e:
        print(e)
        return None


if __name__ == "__main__":
    blocklist_name = "TestBlocklist"

    result = list_block_items(name=blocklist_name)
    if result is not None:
        print("Block items: {}".format(result))
```

1. Replace `<endpoint>` with your endpoint URL.
1. Replace `<enter_your_key_here>` with your key.


---

### Get all blocklists

#### [REST API](#tab/rest)

Copy the cURL command below to a text editor and make the following changes:

1. Replace `<endpoint>` with your endpoint URL.
1. Replace `<enter_your_key_here>` with your key.


```shell
curl --location --request GET '<endpoint>/contentsafety/text/blocklists?api-version=2022-12-30-preview' \
--header 'Ocp-Apim-Subscription-Key: <enter_your_key_here>' \
--header 'Content-Type: application/json'
```

The status code should be `200`. The JSON response looks like this:

```json
"value": [
  {
    "blocklistName": "string",
    "description": "string"
  }
]
```

#### [Python](#tab/python)

```python
import os
from azure.ai.contentsafety import ContentSafetyClient
from azure.core.credentials import AzureKeyCredential
from azure.ai.contentsafety.models import *
from azure.core.exceptions import HttpResponseError
import time


class ManageBlocklist(object):
    def __init__(self):
        CONTENT_SAFETY_KEY = os.environ["CONTENT_SAFETY_KEY"]
        CONTENT_SAFETY_ENDPOINT = os.environ["CONTENT_SAFETY_ENDPOINT"]

        # Create an Content Safety client
        self.client = ContentSafetyClient(CONTENT_SAFETY_ENDPOINT, AzureKeyCredential(CONTENT_SAFETY_KEY))

    def list_text_blocklists(self):
        try:
            return self.client.list_text_blocklists()
        except HttpResponseError as e:
            print("List text blocklists failed.")
            print("Error code: {}".format(e.error.code))
            print("Error message: {}".format(e.error.message))
            return None
        except Exception as e:
            print(e)
            return None

   

    def get_text_blocklist(self, name):
        try:
            return self.client.get_text_blocklist(blocklist_name=name)
        except HttpResponseError as e:
            print("Get text blocklist failed.")
            print("Error code: {}".format(e.error.code))
            print("Error message: {}".format(e.error.message))
            return None
        except Exception as e:
            print(e)
            return None
```

1. Replace `<endpoint>` with your endpoint URL.
1. Replace `<enter_your_key_here>` with your key.

---

### Get a blocklist by name

Copy the cURL command below to a text editor and make the following changes:

1. Replace `<endpoint>` with your endpoint URL.
1. Replace `<enter_your_key_here>` with your key.
1. Replace `<your_list_id>` (in the request URL) with the ID value you used in the list creation step.

```shell
cURL --location '<endpoint>contentsafety/text/blocklists/<your_list_id>?api-version=2023-04-30-preview' \
--header 'Ocp-Apim-Subscription-Key: <enter_your_key_here>' \
--data ''
```

The status code should be `200`. The JSON response looks like this:

```json
{
    "blocklistName": "string",
    "description": "string"
}
```


### Remove a blockItem from a list

> [!NOTE]
>
> There will be some delay after you delete an item before it takes effect on text analysis, usually **not more than five minutes**.

#### [REST API](#tab/rest)


Copy the cURL command below to a text editor and make the following changes:

1. Replace `<endpoint>` with your endpoint URL.
1. Replace `<enter_your_key_here>` with your key.
1. Replace `<your_list_id>` (in the request URL) with the ID value you used in the list creation step.
1. Replace `<item_id>` with the ID value for the blockItem. This is the value of the `"blockItemId"` field from the **Add blockItem** or **Get all blockItems** API calls.


```shell
curl --location --request DELETE '<endpoint>/contentsafety/text/blocklists/<your_list_id>/removeBlockItems?api-version=2022-12-30-preview' \
--header 'Ocp-Apim-Subscription-Key: <enter_your_key_here>' \
--header 'Content-Type: application/json'
--data-raw '"blockItemIds":[
    "<item_id>"
]'
```

> [!TIP]
> You can delete multiple blockItems in one API call. Make the request body an array of `blockItemId` values.

The response code should be `204`.

#### [Python](#tab/python)

```python
import os
from azure.ai.contentsafety import ContentSafetyClient
from azure.core.credentials import AzureKeyCredential
from azure.ai.contentsafety.models import *
from azure.core.exceptions import HttpResponseError
import time


class ManageBlocklist(object):
    def __init__(self):
        CONTENT_SAFETY_KEY = os.environ["CONTENT_SAFETY_KEY"]
        CONTENT_SAFETY_ENDPOINT = os.environ["CONTENT_SAFETY_ENDPOINT"]

        # Create an Content Safety client
        self.client = ContentSafetyClient(CONTENT_SAFETY_ENDPOINT, AzureKeyCredential(CONTENT_SAFETY_KEY))

   

    def remove_block_items(self, name, items):
        request = RemoveBlockItemsOptions(block_item_ids=[i.block_item_id for i in items])
        try:
            self.client.remove_block_items(blocklist_name=name, body=request)
            return True
        except HttpResponseError as e:
            print("Remove block items failed.")
            print("Error code: {}".format(e.error.code))
            print("Error message: {}".format(e.error.message))
            return False
        except Exception as e:
            print(e)
            return False

   

if __name__ == "__main__":
    sample = ManageBlocklist()

    blocklist_name = "Test Blocklist"
    blocklist_description = "Test blocklist management."

    
    # remove one blocklist item
    if sample.remove_block_items(name=blocklist_name, items=[result[0]]):
        print("Block item removed: {}".format(result[0]))

    result = sample.list_block_items(name=blocklist_name)
    if result is not None:
        print("Remaining block items: {}".format(result))
```

1. Replace `<endpoint>` with your endpoint URL.
1. Replace `<enter_your_key_here>` with your key.

---

### Delete a list and all of its contents

> [!NOTE]
>
> There will be some delay after you delete a list before it takes effect on text analysis, usually **not more than five minutes**.

#### [REST API](#tab/rest)

Copy the cURL command below to a text editor and make the following changes:


1. Replace `<endpoint>` with your endpoint URL.
1. Replace `<enter_your_key_here>` with your key.
1. Replace `<your_list_id>` (in the request URL) with the ID value you used in the list creation step.

```shell
curl --location --request DELETE '<endpoint>/contentsafety/text/lists/<your_list_id>?api-version=2022-12-30-preview' \
--header 'Ocp-Apim-Subscription-Key: <enter_your_key_here>' \
--header 'Content-Type: application/json' \
```

The response code should be `204`.

#### [Python](#tab/python)

```python
import os
from azure.ai.contentsafety import ContentSafetyClient
from azure.core.credentials import AzureKeyCredential
from azure.ai.contentsafety.models import *
from azure.core.exceptions import HttpResponseError
import time


class ManageBlocklist(object):
    def __init__(self):
        CONTENT_SAFETY_KEY = os.environ["CONTENT_SAFETY_KEY"]
        CONTENT_SAFETY_ENDPOINT = os.environ["CONTENT_SAFETY_ENDPOINT"]

        # Create an Content Safety client
        self.client = ContentSafetyClient(CONTENT_SAFETY_ENDPOINT, AzureKeyCredential(CONTENT_SAFETY_KEY))

    
    def delete_blocklist(self, name):
        try:
            self.client.delete_text_blocklist(blocklist_name=name)
            return True
        except HttpResponseError as e:
            print("Delete blocklist failed.")
            print("Error code: {}".format(e.error.code))
            print("Error message: {}".format(e.error.message))
            return False
        except Exception as e:
            print(e)
            return False


if __name__ == "__main__":
    sample = ManageBlocklist()

    blocklist_name = "Test Blocklist"
    blocklist_description = "Test blocklist management."


    # delete blocklist
    if sample.delete_blocklist(name=blocklist_name):
        print("Blocklist {} deleted successfully.".format(blocklist_name))
    print("Waiting for blocklist service update...")
    time.sleep(30)
```

1. Replace `<endpoint>` with your endpoint URL.
1. Replace `<enter_your_key_here>` with your key.

---

## Next steps

See the API reference documentation to learn more about the APIs used in this guide.

* [Content Safety API reference](https://aka.ms/content-safety-api)
