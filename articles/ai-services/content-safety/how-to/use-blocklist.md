---
title: "Use blocklists for text moderation"
titleSuffix: Azure AI services
description: Learn how to customize text moderation in Content Safety by using your own list of blockItems.
services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: cognitive-services
ms.subservice: content-safety
ms.custom: build-2023
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
* One of the following installed:
  * [cURL](https://curl.haxx.se/) for REST API calls.
  * [Python 3.x](https://www.python.org/) installed
    * Your Python installation should include [pip](https://pip.pypa.io/en/stable/). You can check if you have pip installed by running `pip --version` on the command line. Get pip by installing the latest version of Python.
    * If you're using Python, you'll need to install the Azure AI Content Safety client library for Python. Run the command `pip install azure-ai-contentsafety` in your project directory.
  * [.NET Runtime](https://dotnet.microsoft.com/download/dotnet/) installed.
    * [.NET 6.0](https://dotnet.microsoft.com/download/dotnet-core) SDK or above installed.
    * If you're using .NET, you'll need to install the Azure AI Content Safety client library for .NET. Run the command `dotnet add package Azure.AI.ContentSafety --prerelease` in your project directory.


## Analyze text with a blocklist

You can create blocklists to use with the Text API. The following steps help you get started.

### Create or modify a blocklist

#### [REST API](#tab/rest)

Copy the cURL command below to a text editor and make the following changes:

1. Replace `<endpoint>` with your endpoint URL.
1. Replace `<enter_your_key_here>` with your key.
1. Replace `<your_list_id>` (in the URL) with a custom name for your list. Also replace the last term of the REST URL with the same name. Allowed characters: 0-9, A-Z, a-z, `- . _ ~`.
1. Optionally replace the value of the `"description"` field with a custom description.


```shell
curl --location --request PATCH '<endpoint>/contentsafety/text/blocklists/<your_list_id>?api-version=2023-04-30-preview' \
--header 'Ocp-Apim-Subscription-Key: <enter_your_key_here>' \
--header 'Content-Type: application/json' \
--data-raw '{
    "description": "This is a violence list"
}'
```

The response code should be `201`(created a new list) or `200`(updated an existing list).

#### [C#](#tab/csharp)

Create a new C# console app and open it in your preferred editor or IDE. Paste in the following code.

```csharp
string endpoint = "<endpoint>";
string key = "<enter_your_key_here>";
ContentSafetyClient client = new ContentSafetyClient(new Uri(endpoint), new AzureKeyCredential(key));

var blocklistName = "<your_list_id>";
var blocklistDescription = "<description>";

var data = new
{
    description = blocklistDescription,
};

var createResponse = client.CreateOrUpdateTextBlocklist(blocklistName, RequestContent.Create(data));
if (createResponse.Status == 201)
{
    Console.WriteLine("\nBlocklist {0} created.", blocklistName);
}
else if (createResponse.Status == 200)
{
    Console.WriteLine("\nBlocklist {0} updated.", blocklistName);
}
```

1. Replace `<endpoint>` with your endpoint URL.
1. Replace `<enter_your_key_here>` with your key.
1. Replace `<your_list_id>` with a custom name for your list. Also replace the last term of the REST URL with the same name. Allowed characters: 0-9, A-Z, a-z, `- . _ ~`.
1. Optionally replace `<description>` with a custom description.
1. Run the script.

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
  
# Create a Content Safety client
client = ContentSafetyClient(endpoint, AzureKeyCredential(key))

def create_or_update_text_blocklist(name, description):
    try:
        return client.create_or_update_text_blocklist(
            blocklist_name=name, resource=TextBlocklist(description=description)
        )
    except HttpResponseError as e:
        print("\nCreate or update text blocklist failed: ")
        if e.error:
            print(f"Error code: {e.error.code}")
            print(f"Error message: {e.error.message}")
            raise
        print(e)
        raise


if __name__ == "__main__":
    blocklist_name = "<your_list_id>"
    blocklist_description = "<description>"

    # create blocklist
    result = create_or_update_text_blocklist(name=blocklist_name, description=blocklist_description)
    if result is not None:
        print("Blocklist created: {}".format(result))
```

1. Replace `<endpoint>` with your endpoint URL.
1. Replace `<enter_your_key_here>` with your key.
1. Replace `<your_list_id>` with a custom name for your list. Also replace the last term of the REST URL with the same name. Allowed characters: 0-9, A-Z, a-z, `- . _ ~`.
1. Optionally replace `<description>` with a custom description.
1. Run the script.

---

### Add blockItems in the list

> [!NOTE]
>
> There is a maximum limit of **10,000 terms** in total across all lists. You can add at most 100 blockItems in one request.

#### [REST API](#tab/rest)

Copy the cURL command below to a text editor and make the following changes:

1. Replace `<endpoint>` with your endpoint URL.
1. Replace `<enter_your_key_here>` with your key.
1. Replace `<your_list_id>` (in the URL) with the ID value you used in the list creation step.
1. Optionally replace the value of the `"description"` field with a custom description.
1. Replace the value of the `"text"` field with the item you'd like to add to your blocklist. The maximum length of a blockItem is 128 characters.

```shell
curl --location --request POST '<endpoint>/contentsafety/text/blocklists/<your_list_id>:addBlockItems?api-version=2023-04-30-preview' \
--header 'Ocp-Apim-Subscription-Key: <enter_your_key_here>' \
--header 'Content-Type: application/json' \
--data-raw '"blockItems": [{
    "description": "string",
    "text": "bleed"
}]'
```

> [!TIP]
> You can add multiple blockItems in one API call. Make the request body a JSON array of data groups:
>
> [{
>    "description": "string",
>    "text": "bleed"
> },
> {
>    "description": "string",
>    "text": "blood"
> }]


The response code should be `200`.

```console
{
  "blockItemId": "string",
  "description": "string",
  "text": "bleed"
  
}
```

#### [C#](#tab/csharp)

Create a new C# console app and open it in your preferred editor or IDE. Paste in the following code.

```csharp
string endpoint = "<endpoint>";
string key = "<enter_your_key_here>";
ContentSafetyClient client = new ContentSafetyClient(new Uri(endpoint), new AzureKeyCredential(key));

var blocklistName = "<your_list_id>";

string blockItemText1 = "k*ll";
string blockItemText2 = "h*te";

var blockItems = new TextBlockItemInfo[] { new TextBlockItemInfo(blockItemText1), new TextBlockItemInfo(blockItemText2) };
var addedBlockItems = client.AddBlockItems(blocklistName, new AddBlockItemsOptions(blockItems));

if (addedBlockItems != null && addedBlockItems.Value != null)
{
    Console.WriteLine("\nBlockItems added:");
    foreach (var addedBlockItem in addedBlockItems.Value.Value)
    {
        Console.WriteLine("BlockItemId: {0}, Text: {1}, Description: {2}", addedBlockItem.BlockItemId, addedBlockItem.Text, addedBlockItem.Description);
    }
}
```

1. Replace `<endpoint>` with your endpoint URL.
1. Replace `<enter_your_key_here>` with your key.
1. Replace `<your_list_id>` with the ID value you used in the list creation step.
1. Replace the value of the `block_item_text_1` field with the item you'd like to add to your blocklist. The maximum length of a blockItem is 128 characters.
1. Optionally add more blockItem strings to the `blockItems` parameter.
1. Run the script.

#### [Python](#tab/python)

Create a new Python script and open it in your preferred editor or IDE. Paste in the following code.

```python
import os
from azure.ai.contentsafety import ContentSafetyClient
from azure.core.credentials import AzureKeyCredential
from azure.ai.contentsafety.models import TextBlockItemInfo, AddBlockItemsOptions
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
        print("\nAdd block items failed: ")
        if e.error:
            print(f"Error code: {e.error.code}")
            print(f"Error message: {e.error.message}")
            raise
        print(e)
        raise

    return response.value


if __name__ == "__main__":
    blocklist_name = "<your_list_id>"

    block_item_text_1 = "k*ll"
    input_text = "I h*te you and I want to k*ll you."

    # add block items
    result = add_block_items(name=blocklist_name, items=[block_item_text_1])
    if result is not None:
        print("Block items added: {}".format(result))
```

1. Replace `<endpoint>` with your endpoint URL.
1. Replace `<enter_your_key_here>` with your key.
1. Replace `<your_list_id>` with the ID value you used in the list creation step.
1. Replace the value of the `block_item_text_1` field with the item you'd like to add to your blocklist. The maximum length of a blockItem is 128 characters.
1. Optionally add more blockItem strings to the `add_block_items` parameter.
1. Run the script.


---

> [!NOTE]
> 
> There will be some delay after you add or edit a blockItem before it takes effect on text analysis, usually **not more than five minutes**.

### Analyze text with a blocklist

#### [REST API](#tab/rest)

Copy the cURL command below to a text editor and make the following changes:
1. Replace `<endpoint>` with your endpoint URL.
1. Replace `<enter_your_key_here>` with your key.
1. Replace `<your_list_id>` with the ID value you used in the list creation step. The `"blocklistNames"` field can contain an array of multiple list IDs.
1. Optionally change the value of `"breakByBlocklists"`. `true` indicates that once a blocklist is matched, the analysis will return immediately without model output. `false` will cause the model to continue to do analysis in the default categories.
1. Optionally change the value of the `"text"` field to whatever text you want to analyze. 

```shell
curl --location --request POST '<endpoint>/contentsafety/text:analyze?api-version=2023-04-30-preview&' \
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
      "blocklistName": "string",
      "blockItemID": "string",
      "blockItemText": "bleed",
      "offset": "28",
      "length": "5"
    }
  ]
}
```

#### [C#](#tab/csharp)

Create a new C# console app and open it in your preferred editor or IDE. Paste in the following code.

```csharp
string endpoint = "<endpoint>";
string key = "<enter_your_key_here>";
ContentSafetyClient client = new ContentSafetyClient(new Uri(endpoint), new AzureKeyCredential(key));

var blocklistName = "<your_list_id>";

// After you edit your blocklist, it usually takes effect in 5 minutes, please wait some time before analyzing with blocklist after editing.
var request = new AnalyzeTextOptions("I h*te you and I want to k*ll you");
request.BlocklistNames.Add(blocklistName);
request.BreakByBlocklists = true;

Response<AnalyzeTextResult> response;
try
{
    response = client.AnalyzeText(request);
}
catch (RequestFailedException ex)
{
    Console.WriteLine("Analyze text failed.\nStatus code: {0}, Error code: {1}, Error message: {2}", ex.Status, ex.ErrorCode, ex.Message);
    throw;
}

if (response.Value.BlocklistsMatchResults != null)
{
    Console.WriteLine("\nBlocklist match result:");
    foreach (var matchResult in response.Value.BlocklistsMatchResults)
    {
        Console.WriteLine("Blockitem was hit in text: Offset: {0}, Length: {1}", matchResult.Offset, matchResult.Length);
        Console.WriteLine("BlocklistName: {0}, BlockItemId: {1}, BlockItemText: {2}, ", matchResult.BlocklistName, matchResult.BlockItemId, matchResult.BlockItemText);
    }
}
```

1. Replace `<endpoint>` with your endpoint URL.
1. Replace `<enter_your_key_here>` with your key.
1. Replace `<your_list_id>` with the ID value you used in the list creation step.
1. Replace the `request` input text with whatever text you want to analyze.
1. Run the script.

#### [Python](#tab/python)

Create a new Python script and open it in your preferred editor or IDE. Paste in the following code.

```python
import os
from azure.ai.contentsafety import ContentSafetyClient
from azure.core.credentials import AzureKeyCredential
from azure.ai.contentsafety.models import AnalyzeTextOptions
from azure.core.exceptions import HttpResponseError
import time

endpoint = "<endpoint>"
key = "<enter_your_key_here>"

# Create an Content Safety client
client = ContentSafetyClient(endpoint, AzureKeyCredential(key))

def analyze_text_with_blocklists(name, text):
    try:
        response = client.analyze_text(
            AnalyzeTextOptions(text=text, blocklist_names=[name], break_by_blocklists=False)
        )
    except HttpResponseError as e:
        print("\nAnalyze text failed: ")
        if e.error:
            print(f"Error code: {e.error.code}")
            print(f"Error message: {e.error.message}")
            raise
        print(e)
        raise

    return response.blocklists_match_results


if __name__ == "__main__":
    blocklist_name = "<your_list_id>"
    input_text = "I h*te you and I want to k*ll you."

    # analyze text
    match_results = analyze_text_with_blocklists(name=blocklist_name, text=input_text)
    for match_result in match_results:
        print("Block item {} in {} was hit, text={}, offset={}, length={}."
              .format(match_result.block_item_id, match_result.blocklist_name, match_result.block_item_text, match_result.offset, match_result.length))
```

1. Replace `<endpoint>` with your endpoint URL.
1. Replace `<enter_your_key_here>` with your key.
1. Replace `<your_list_id>` with the ID value you used in the list creation step.
1. Replace the `input_text` variable with whatever text you want to analyze.
1. Run the script.

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
curl --location --request GET '<endpoint>/contentsafety/text/blocklists/<your_list_id>/blockItems?api-version=2023-04-30-preview' \
--header 'Ocp-Apim-Subscription-Key: <enter_your_key_here>' \
--header 'Content-Type: application/json'
```

The status code should be `200` and the response body should look like this:

```json
{
 "values": [
  {
   "blockItemId": "string",
   "description": "string",
   "text": "bleed",
  }
 ]
}
```

#### [C#](#tab/csharp)

Create a new C# console app and open it in your preferred editor or IDE. Paste in the following code.

```csharp
string endpoint = "<endpoint>";
string key = "<enter_your_key_here>";
ContentSafetyClient client = new ContentSafetyClient(new Uri(endpoint), new AzureKeyCredential(key));

var blocklistName = "<your_list_id>";

var allBlockitems = client.GetTextBlocklistItems(blocklistName);
Console.WriteLine("\nList BlockItems:");
foreach (var blocklistItem in allBlockitems)
{
    Console.WriteLine("BlockItemId: {0}, Text: {1}, Description: {2}", blocklistItem.BlockItemId, blocklistItem.Text, blocklistItem.Description);
}
```

1. Replace `<endpoint>` with your endpoint URL.
1. Replace `<enter_your_key_here>` with your key.
1. Replace `<your_list_id>` with the ID value you used in the list creation step.
1. Run the script.

#### [Python](#tab/python)

Create a new Python script and open it in your preferred editor or IDE. Paste in the following code.


```python
import os
from azure.ai.contentsafety import ContentSafetyClient
from azure.core.credentials import AzureKeyCredential
from azure.core.exceptions import HttpResponseError

endpoint = "<endpoint>"
key = "<enter_your_key_here>"

# Create an Content Safety client
client = ContentSafetyClient(endpoint, AzureKeyCredential(key))

def list_block_items(name):
    try:
        response = client.list_text_blocklist_items(blocklist_name=name)
        return list(response)
    except HttpResponseError as e:
        print("\nList block items failed: ")
        if e.error:
            print(f"Error code: {e.error.code}")
            print(f"Error message: {e.error.message}")
            raise
        print(e)
        raise


if __name__ == "__main__":
    blocklist_name = "<your_list_id>"

    result = list_block_items(name=blocklist_name)
    if result is not None:
        print("Block items: {}".format(result))
```

1. Replace `<endpoint>` with your endpoint URL.
1. Replace `<enter_your_key_here>` with your key.
1. Replace `<your_list_id>` with the ID value you used in the list creation step.
1. Run the script.


---

### Get all blocklists

#### [REST API](#tab/rest)

Copy the cURL command below to a text editor and make the following changes:

1. Replace `<endpoint>` with your endpoint URL.
1. Replace `<enter_your_key_here>` with your key.


```shell
curl --location --request GET '<endpoint>/contentsafety/text/blocklists?api-version=2023-04-30-preview' \
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

#### [C#](#tab/csharp)

Create a new C# console app and open it in your preferred editor or IDE. Paste in the following code.

```csharp
string endpoint = "<endpoint>";
string key = "<enter_your_key_here>";
ContentSafetyClient client = new ContentSafetyClient(new Uri(endpoint), new AzureKeyCredential(key));


var blocklists = client.GetTextBlocklists();
Console.WriteLine("\nList blocklists:");
foreach (var blocklist in blocklists)
{
    Console.WriteLine("BlocklistName: {0}, Description: {1}", blocklist.BlocklistName, blocklist.Description);
}
```

1. Replace `<endpoint>` with your endpoint URL.
1. Replace `<enter_your_key_here>` with your key.
1. Run the script.

#### [Python](#tab/python)

Create a new Python script and open it in your preferred editor or IDE. Paste in the following code.

```python
import os
from azure.ai.contentsafety import ContentSafetyClient
from azure.core.credentials import AzureKeyCredential
from azure.core.exceptions import HttpResponseError


endpoint = "<endpoint>"
key = "<enter_your_key_here>"


# Create an Content Safety client
client = ContentSafetyClient(endpoint, AzureKeyCredential(key))

def list_text_blocklists():
    try:
        return client.list_text_blocklists()
    except HttpResponseError as e:
        print("\nList text blocklists failed: ")
        if e.error:
            print(f"Error code: {e.error.code}")
            print(f"Error message: {e.error.message}")
            raise
        print(e)
        raise
if __name__ == "__main__":
    # list blocklists
    result = list_text_blocklists()
    if result is not None:
        print("List blocklists: ")
        for l in result:
            print(l)
```

1. Replace `<endpoint>` with your endpoint URL.
1. Replace `<enter_your_key_here>` with your key.
1. Run the script.

---

### Get a blocklist by name

#### [REST API](#tab/rest)

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

#### [C#](#tab/csharp)

Create a new C# console app and open it in your preferred editor or IDE. Paste in the following code.

```csharp
string endpoint = "<endpoint>";
string key = "<enter_your_key_here>";
ContentSafetyClient client = new ContentSafetyClient(new Uri(endpoint), new AzureKeyCredential(key));

var blocklistName = "<your_list_id>";

var getBlocklist = client.GetTextBlocklist(blocklistName);
if (getBlocklist != null && getBlocklist.Value != null)
{
    Console.WriteLine("\nGet blocklist:");
    Console.WriteLine("BlocklistName: {0}, Description: {1}", getBlocklist.Value.BlocklistName, getBlocklist.Value.Description);
}
```
1. Replace `<endpoint>` with your endpoint URL.
1. Replace `<enter_your_key_here>` with your key.
1. Replace `<your_list_id>` with the ID value you used in the list creation step.
1. Run the script.

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

# Create a Content Safety client
client = ContentSafetyClient(endpoint, AzureKeyCredential(key))

def get_text_blocklist(name):
    try:
        return client.get_text_blocklist(blocklist_name=name)
    except HttpResponseError as e:
        print("\nGet text blocklist failed: ")
        if e.error:
            print(f"Error code: {e.error.code}")
            print(f"Error message: {e.error.message}")
            raise
        print(e)
        raise

if __name__ == "__main__":
    blocklist_name = "<your_list_id>"

    # get blocklist
    result = get_text_blocklist(blocklist_name)
    if result is not None:
        print("Get blocklist: {}".format(result))
```

1. Replace `<endpoint>` with your endpoint URL.
1. Replace `<enter_your_key_here>` with your key.
1. Replace `<your_list_id>` with the ID value you used in the list creation step.
1. Run the script.

---


### Get a blockItem by blockItem ID

#### [REST API](#tab/rest)

Copy the cURL command below to a text editor and make the following changes:

1. Replace `<endpoint>` with your endpoint URL.
1. Replace `<enter_your_key_here>` with your key.
1. Replace `<your_list_id>` (in the request URL) with the ID value you used in the list creation step.
1. Replace `<your_item_id>` with the ID value for the blockItem. This is the value of the `"blockItemId"` field from the **Add blockItem** or **Get all blockItems** API calls.


```shell
cURL --location '<endpoint>contentsafety/text/blocklists/<your_list_id>/blockitems/<your_item_id>?api-version=2023-04-30-preview' \
--header 'Ocp-Apim-Subscription-Key: <enter_your_key_here>' \
--data ''
```

The status code should be `200`. The JSON response looks like this:

```json
{
    "blockItemId": "string",
    "description": "string",
    "text": "string"
}
```

#### [C#](#tab/csharp)

Create a new C# console app and open it in your preferred editor or IDE. Paste in the following code.

```csharp
string endpoint = "<endpoint>";
string key = "<enter_your_key_here>";
ContentSafetyClient client = new ContentSafetyClient(new Uri(endpoint), new AzureKeyCredential(key));

var blocklistName = "<your_list_id>";

var getBlockItemId = addedBlockItems.Value.Value[0].BlockItemId;
var getBlockItem = client.GetTextBlocklistItem(blocklistName, getBlockItemId);
Console.WriteLine("\nGet BlockItem:");
Console.WriteLine("BlockItemId: {0}, Text: {1}, Description: {2}", getBlockItem.Value.BlockItemId, getBlockItem.Value.Text, getBlockItem.Value.Description);
```

1. Replace `<endpoint>` with your endpoint URL.
1. Replace `<enter_your_key_here>` with your key.
1. Replace `<your_list_id>` with the ID value you used in the list creation step.
1. Optionally change the value of `getBlockItemId` to the ID of a previously added item. 
1. Run the script.

#### [Python](#tab/python)

Create a new Python script and open it in your preferred editor or IDE. Paste in the following code.

```python
import os
from azure.ai.contentsafety import ContentSafetyClient
from azure.core.credentials import AzureKeyCredential
from azure.core.exceptions import HttpResponseError

endpoint = "<endpoint>"
key = "<enter_your_key_here>"

# Create a Content Safety client
client = ContentSafetyClient(endpoint, AzureKeyCredential(key))

def get_block_item(name, item_id):
    try:
        return client.get_text_blocklist_item(blocklist_name=name, block_item_id=item_id)
    except HttpResponseError as e:
        print("Get block item failed.")
        print("Error code: {}".format(e.error.code))
        print("Error message: {}".format(e.error.message))
        return None
    except Exception as e:
        print(e)
        return None

if __name__ == "__main__":
    blocklist_name = "<your_list_id>"
    block_item = get_block_item(blocklist_name, "<your_item_id>")
```

1. Replace `<endpoint>` with your endpoint URL.
1. Replace `<enter_your_key_here>` with your key.
1. Replace `<your_list_id>` with the ID value you used in the list creation step.
1. Replace `<your_item_id>` with the ID value for the blockItem. This is the value of the `"blockItemId"` field from the **Add blockItem** or **Get all blockItems** API calls.
1. Run the script.

---

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
curl --location --request DELETE '<endpoint>/contentsafety/text/blocklists/<your_list_id>/removeBlockItems?api-version=2023-04-30-preview' \
--header 'Ocp-Apim-Subscription-Key: <enter_your_key_here>' \
--header 'Content-Type: application/json'
--data-raw '"blockItemIds":[
    "<item_id>"
]'
```

> [!TIP]
> You can delete multiple blockItems in one API call. Make the request body an array of `blockItemId` values.

The response code should be `204`.

#### [C#](#tab/csharp)

Create a new C# console app and open it in your preferred editor or IDE. Paste in the following code.

```csharp
string endpoint = "<endpoint>";
string key = "<enter_your_key_here>";
ContentSafetyClient client = new ContentSafetyClient(new Uri(endpoint), new AzureKeyCredential(key));

var blocklistName = "<your_list_id>";

var removeBlockItemId = addedBlockItems.Value.Value[0].BlockItemId;
var removeBlockItemIds = new List<string> { removeBlockItemId };
var removeResult = client.RemoveBlockItems(blocklistName, new RemoveBlockItemsOptions(removeBlockItemIds));

if (removeResult != null && removeResult.Status == 204)
{
    Console.WriteLine("\nBlockItem removed: {0}.", removeBlockItemId);
}
```

1. Replace `<endpoint>` with your endpoint URL.
1. Replace `<enter_your_key_here>` with your key.
1. Replace `<your_list_id>` with the ID value you used in the list creation step.
1. Optionally change the value of `removeBlockItemId` to the ID of a previously added item. 
1. Run the script.

#### [Python](#tab/python)

Create a new Python script and open it in your preferred editor or IDE. Paste in the following code.

```python
import os
from azure.ai.contentsafety import ContentSafetyClient
from azure.core.credentials import AzureKeyCredential
from azure.ai.contentsafety.models import RemoveBlockItemsOptions
from azure.core.exceptions import HttpResponseError


endpoint = "<endpoint>"
key = "<enter_your_key_here>"

# Create a Content Safety client
client = ContentSafetyClient(endpoint, AzureKeyCredential(key))

def remove_block_items(name, ids):
    request = RemoveBlockItemsOptions(block_item_ids=ids)
    try:
        client.remove_block_items(blocklist_name=name, body=request)
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
    blocklist_name = "<your_list_id>"
    remove_id = "<your_item_id>"

    # remove one blocklist item
    if remove_block_items(name=blocklist_name, ids=[remove_id]):
        print("Block item removed: {}".format(remove_id))
```

1. Replace `<endpoint>` with your endpoint URL.
1. Replace `<enter_your_key_here>` with your key.
1. Replace `<your_list_id>` with the ID value you used in the list creation step.
1. Replace `<your_item_id>` with the ID value for the blockItem. This is the value of the `"blockItemId"` field from the **Add blockItem** or **Get all blockItems** API calls.
1. Run the script.

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
curl --location --request DELETE '<endpoint>/contentsafety/text/blocklists/<your_list_id>?api-version=2023-04-30-preview' \
--header 'Ocp-Apim-Subscription-Key: <enter_your_key_here>' \
--header 'Content-Type: application/json' \
```

The response code should be `204`.

#### [C#](#tab/csharp)

Create a new C# console app and open it in your preferred editor or IDE. Paste in the following code.

```csharp
string endpoint = "<endpoint>";
string key = "<enter_your_key_here>";
ContentSafetyClient client = new ContentSafetyClient(new Uri(endpoint), new AzureKeyCredential(key));

var blocklistName = "<your_list_id>";

var deleteResult = client.DeleteTextBlocklist(blocklistName);
if (deleteResult != null && deleteResult.Status == 204)
{
    Console.WriteLine("\nDeleted blocklist.");
}
```

1. Replace `<endpoint>` with your endpoint URL.
1. Replace `<enter_your_key_here>` with your key.
1. Replace `<your_list_id>` (in the request URL) with the ID value you used in the list creation step.
1. Run the script.

#### [Python](#tab/python)

Create a new Python script and open it in your preferred editor or IDE. Paste in the following code.

```python
import os
from azure.ai.contentsafety import ContentSafetyClient
from azure.core.credentials import AzureKeyCredential
from azure.core.exceptions import HttpResponseError

endpoint = "<endpoint>"
key = "<enter_your_key_here>"

# Create an Content Safety client
client = ContentSafetyClient(endpoint, AzureKeyCredential(key))
def delete_blocklist(name):
    try:
        client.delete_text_blocklist(blocklist_name=name)
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
    blocklist_name = "<your_list_id>"
    # delete blocklist
    if delete_blocklist(name=blocklist_name):
        print("Blocklist {} deleted successfully.".format(blocklist_name))
```

1. Replace `<endpoint>` with your endpoint URL.
1. Replace `<enter_your_key_here>` with your key.
1. Replace `<your_list_id>` (in the request URL) with the ID value you used in the list creation step.
1. Run the script.

---

## Next steps

See the API reference documentation to learn more about the APIs used in this guide.

* [Content Safety API reference](https://aka.ms/content-safety-api)
