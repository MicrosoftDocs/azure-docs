---
title: "Use blocklists for text moderation"
titleSuffix: Azure AI services
description: Learn how to customize text moderation in Azure AI Content Safety by using your own list of blocklistItems.
#services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: azure-ai-content-safety
ms.custom: build-2023
ms.topic: how-to
ms.date: 07/20/2023
ms.author: pafarley
keywords: 
---


# Use a blocklist

> [!CAUTION]
> The sample data in this guide might contain offensive content. User discretion is advised.

The default AI classifiers are sufficient for most content moderation needs. However, you might need to screen for items that are specific to your use case.

## Prerequisites

* An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/) 
* Once you have your Azure subscription, <a href="https://aka.ms/acs-create"  title="Create a Content Safety resource"  target="_blank">create a Content Safety resource </a> in the Azure portal to get your key and endpoint. Enter a unique name for your resource, select the subscription you entered on the application form, and select a resource group, supported region, and supported pricing tier. Then select **Create**.
  * The resource takes a few minutes to deploy. After it finishes, Select **go to resource**. In the left pane, under **Resource Management**, select **Subscription Key and Endpoint**. The endpoint and either of the keys are used to call APIs.
* One of the following installed:
  * [cURL](https://curl.haxx.se/) for REST API calls.
  * [Python 3.x](https://www.python.org/) installed
    * Your Python installation should include [pip](https://pip.pypa.io/en/stable/). You can check if you have pip installed by running `pip --version` on the command line. Get pip by installing the latest version of Python.
    * If you're using Python, you'll need to install the Azure AI Content Safety client library for Python. Run the command `pip install azure-ai-contentsafety` in your project directory.
  * [.NET Runtime](https://dotnet.microsoft.com/download/dotnet/) installed.
    * [.NET Core](https://dotnet.microsoft.com/download/dotnet-core) SDK installed.
    * If you're using .NET, you'll need to install the Azure AI Content Safety client library for .NET. Run the command `dotnet add package Azure.AI.ContentSafety --prerelease` in your project directory.

[!INCLUDE [Create environment variables](../includes/env-vars.md)]

## Analyze text with a blocklist

You can create blocklists to use with the Text API. The following steps help you get started.

### Create or modify a blocklist

#### [REST API](#tab/rest)

Copy the cURL command below to a text editor and make the following changes:

1. Replace `<endpoint>` with your endpoint URL.
1. Replace `<enter_your_key_here>` with your key.
1. Replace `<your_list_name>` (in the URL) with a custom name for your list. Also replace the last term of the REST URL with the same name. Allowed characters: 0-9, A-Z, a-z, `- . _ ~`.
1. Optionally replace the value of the `"description"` field with a custom description.


```shell
curl --location --request PATCH '<endpoint>/contentsafety/text/blocklists/<your_list_name>?api-version=2023-10-01' \
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
string endpoint = Environment.GetEnvironmentVariable("CONTENT_SAFETY_ENDPOINT");
string key = Environment.GetEnvironmentVariable("CONTENT_SAFETY_KEY");

ContentSafetyClient client = new ContentSafetyClient(new Uri(endpoint), new AzureKeyCredential(key));

var blocklistName = "<your_list_name>";
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

1. Replace `<your_list_name>` with a custom name for your list. Allowed characters: `0-9, A-Z, a-z, - . _ ~`.
1. Optionally replace `<description>` with a custom description.
1. Run the code.


#### [Python](#tab/python)
Create a new Python script and open it in your preferred editor or IDE. Paste in the following code.

```python
import os
from azure.ai.contentsafety import ContentSafetyClient
from azure.core.credentials import AzureKeyCredential
from azure.ai.contentsafety.models import TextBlocklist
from azure.core.exceptions import HttpResponseError

key = os.environ["CONTENT_SAFETY_KEY"]
endpoint = os.environ["CONTENT_SAFETY_ENDPOINT"]
  
# Create a Content Safety client
client = ContentSafetyClient(endpoint, AzureKeyCredential(key))

blocklist_name = "<your_list_name>"
blocklist_description = "<description>"

try:
    blocklist = client.create_or_update_text_blocklist(blocklist_name=blocklist_name, resource={"description": blocklist_description})
    if blocklist:
        print("\nBlocklist created or updated: ")
        print(f"Name: {blocklist.blocklist_name}, Description: {blocklist.description}")
except HttpResponseError as e:
    print("\nCreate or update text blocklist failed: ")
    if e.error:
        print(f"Error code: {e.error.code}")
        print(f"Error message: {e.error.message}")
        raise
    print(e)
    raise

```

1. Replace `<your_list_name>` with a custom name for your list. Allowed characters: `0-9, A-Z, a-z, - . _ ~`.
1. Replace `<description>` with a custom description.
1. Run the script.

---

### Add blocklistItems to the list

> [!NOTE]
>
> There is a maximum limit of **10,000 terms** in total across all lists. You can add at most 100 blocklistItems in one request.

#### [REST API](#tab/rest)

Copy the cURL command below to a text editor and make the following changes:

1. Replace `<endpoint>` with your endpoint URL.
1. Replace `<enter_your_key_here>` with your key.
1. Replace `<your_list_name>` (in the URL) with the name you used in the list creation step.
1. Optionally replace the value of the `"description"` field with a custom description.
1. Replace the value of the `"text"` field with the item you'd like to add to your blocklist. The maximum length of a blocklistItem is 128 characters.

```shell
curl --location --request POST '<endpoint>/contentsafety/text/blocklists/<your_list_name>:addOrUpdateBlocklistItems?api-version=2023-10-01' \
--header 'Ocp-Apim-Subscription-Key: <enter_your_key_here>' \
--header 'Content-Type: application/json' \
--data-raw '"blocklistItems": [{
    "description": "string",
    "text": "bleed"
}]'
```

> [!TIP]
> You can add multiple blocklistItems in one API call. Make the request body a JSON array of data groups:
>
> ```json
> [{
>    "description": "string",
>    "text": "bleed"
> },
> {
>    "description": "string",
>    "text": "blood"
> }]
> ```


The response code should be `200`.

```console
{
"blocklistItems:"[
  {
  "blocklistItemId": "string",
  "description": "string",
  "text": "bleed"
  
   }
 ]
}
```

#### [C#](#tab/csharp)
Create a new C# console app and open it in your preferred editor or IDE. Paste in the following code.

```csharp
string endpoint = Environment.GetEnvironmentVariable("CONTENT_SAFETY_ENDPOINT");
string key = Environment.GetEnvironmentVariable("CONTENT_SAFETY_KEY");
ContentSafetyClient client = new ContentSafetyClient(new Uri(endpoint), new AzureKeyCredential(key));

var blocklistName = "<your_list_name>";

string blockItemText1 = "<block_item_text_1>";
string blockItemText2 = "<block_item_text_2>";

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

1. Replace `<your_list_name>` with the name you used in the list creation step.
1. Replace the values of the `blockItemText1` and `blockItemText2` fields with the items you'd like to add to your blocklist. The maximum length of a blockItem is 128 characters.
1. Optionally add more blockItem strings to the `blockItems` parameter.
1. Run the code.

#### [Python](#tab/python)

Create a new Python script and open it in your preferred editor or IDE. Paste in the following code.

```python
import os
from azure.ai.contentsafety import ContentSafetyClient
from azure.core.credentials import AzureKeyCredential
from azure.ai.contentsafety.models import (
    TextBlockItemInfo,
    AddBlockItemsOptions
)
from azure.core.exceptions import HttpResponseError

key = os.environ["CONTENT_SAFETY_KEY"]
endpoint = os.environ["CONTENT_SAFETY_ENDPOINT"]

# Create an Content Safety client
client = ContentSafetyClient(endpoint, AzureKeyCredential(key))

blocklist_name = "<your_list_name>"
block_item_text_1 = "<block_item_text_1>"
block_item_text_2 = "<block_item_text_2>"

block_items = [TextBlockItemInfo(text=block_item_text_1), TextBlockItemInfo(text=block_item_text_2)]
try:
    result = client.add_block_items(
        blocklist_name=blocklist_name,
        body=AddBlockItemsOptions(block_items=block_items),
    )
    if result and result.value:
        print("\nBlock items added: ")
        for block_item in result.value:
            print(f"BlockItemId: {block_item.block_item_id}, Text: {block_item.text}, Description: {block_item.description}")
except HttpResponseError as e:
    print("\nAdd block items failed: ")
    if e.error:
        print(f"Error code: {e.error.code}")
        print(f"Error message: {e.error.message}")
        raise
    print(e)
    raise
```

1. Replace `<your_list_name>` with the name you used in the list creation step.
1. Replace the values of the `block_item_text_1` and `block_item_text_2` fields with the items you'd like to add to your blocklist. The maximum length of a blockItem is 128 characters.
1. Optionally add more blockItem strings to the `block_items` parameter.
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
1. Replace `<your_list_name>` with the name you used in the list creation step. The `"blocklistNames"` field can contain an array of multiple list IDs.
1. Optionally change the value of `"breakByBlocklists"`. `true` indicates that once a blocklist is matched, the analysis will return immediately without model output. `false` will cause the model to continue to do analysis in the default categories.
1. Optionally change the value of the `"text"` field to whatever text you want to analyze. 

```shell
curl --location --request POST '<endpoint>/contentsafety/text:analyze?api-version=2023-10-01&' \
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
  "blocklistNames":["<your_list_name>"],
  "haltOnBlocklistHit": false,
  "outputType": "FourSeverityLevels"
}'
```

The JSON response will contain a `"blocklistMatchResults"` that indicates any matches with your blocklist. It reports the location in the text string where the match was found.

```json
{
  "blocklistsMatch": [
    {
      "blocklistName": "string",
      "blocklistItemId": "string",
      "blocklistItemText": "bleed"
    }
  ],
  "categoriesAnalysis": [
    {
      "category": "Hate",
      "severity": 0
    }
  ]
}
```

#### [C#](#tab/csharp)

Create a new C# console app and open it in your preferred editor or IDE. Paste in the following code.

```csharp
string endpoint = Environment.GetEnvironmentVariable("CONTENT_SAFETY_ENDPOINT");
string key = Environment.GetEnvironmentVariable("CONTENT_SAFETY_KEY");
ContentSafetyClient client = new ContentSafetyClient(new Uri(endpoint), new AzureKeyCredential(key));

var blocklistName = "<your_list_name>";

// After you edit your blocklist, it usually takes effect in 5 minutes, please wait some time before analyzing with blocklist after editing.
var request = new AnalyzeTextOptions("<your_input_text>");
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

1. Replace `<your_list_name>` with the name you used in the list creation step.
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

key = os.environ["CONTENT_SAFETY_KEY"]
endpoint = os.environ["CONTENT_SAFETY_ENDPOINT"]

# Create an Content Safety client
client = ContentSafetyClient(endpoint, AzureKeyCredential(key))

blocklist_name = "<your_list_name>"
input_text = "<your_input_text>"

try:
    # After you edit your blocklist, it usually takes effect in 5 minutes, please wait some time before analyzing with blocklist after editing.
    analysis_result = client.analyze_text(AnalyzeTextOptions(text=input_text, blocklist_names=[blocklist_name], break_by_blocklists=False))
    if analysis_result and analysis_result.blocklists_match_results:
        print("\nBlocklist match results: ")
        for match_result in analysis_result.blocklists_match_results:
            print(f"Block item was hit in text, Offset={match_result.offset}, Length={match_result.length}.")
            print(f"BlocklistName: {match_result.blocklist_name}, BlockItemId: {match_result.block_item_id}, BlockItemText: {match_result.block_item_text}")
except HttpResponseError as e:
    print("\nAnalyze text failed: ")
    if e.error:
        print(f"Error code: {e.error.code}")
        print(f"Error message: {e.error.message}")
        raise
    print(e)
    raise
```

1. Replace `<your_list_name>` with the name you used in the list creation step.
1. Replace the `input_text` variable with whatever text you want to analyze.
1. Run the script.

---
## Other blocklist operations

This section contains more operations to help you manage and use the blocklist feature.

### List all blocklistItems in a list

#### [REST API](#tab/rest)


Copy the cURL command below to a text editor and make the following changes:

1. Replace `<endpoint>` with your endpoint URL.
1. Replace `<enter_your_key_here>` with your key.
1. Replace `<your_list_name>` (in the request URL) with the name you used in the list creation step.

```shell
curl --location --request GET '<endpoint>/contentsafety/text/blocklists/<your_list_name>/blocklistItems?api-version=2023-10-01' \
--header 'Ocp-Apim-Subscription-Key: <enter_your_key_here>' \
--header 'Content-Type: application/json'
```

The status code should be `200` and the response body should look like this:

```json
{
 "values": [
  {
   "blocklistItemId": "string",
   "description": "string",
   "text": "bleed",
  }
 ]
}
```

#### [C#](#tab/csharp)

Create a new C# console app and open it in your preferred editor or IDE. Paste in the following code.

```csharp
string endpoint = Environment.GetEnvironmentVariable("CONTENT_SAFETY_ENDPOINT");
string key = Environment.GetEnvironmentVariable("CONTENT_SAFETY_KEY");
ContentSafetyClient client = new ContentSafetyClient(new Uri(endpoint), new AzureKeyCredential(key));

var blocklistName = "<your_list_name>";

var allBlockitems = client.GetTextBlocklistItems(blocklistName);
Console.WriteLine("\nList BlockItems:");
foreach (var blocklistItem in allBlockitems)
{
    Console.WriteLine("BlockItemId: {0}, Text: {1}, Description: {2}", blocklistItem.BlockItemId, blocklistItem.Text, blocklistItem.Description);
}
```

1. Replace `<your_list_name>` with the name you used in the list creation step.
1. Run the script.

#### [Python](#tab/python)

Create a new Python script and open it in your preferred editor or IDE. Paste in the following code.


```python
import os
from azure.ai.contentsafety import ContentSafetyClient
from azure.core.credentials import AzureKeyCredential
from azure.core.exceptions import HttpResponseError

key = os.environ["CONTENT_SAFETY_KEY"]
endpoint = os.environ["CONTENT_SAFETY_ENDPOINT"]

# Create an Content Safety client
client = ContentSafetyClient(endpoint, AzureKeyCredential(key))

blocklist_name = "<your_list_name>"

try:
    block_items = client.list_text_blocklist_items(blocklist_name=blocklist_name)
    if block_items:
        print("\nList block items: ")
        for block_item in block_items:
            print(f"BlockItemId: {block_item.block_item_id}, Text: {block_item.text}, Description: {block_item.description}")
except HttpResponseError as e:
    print("\nList block items failed: ")
    if e.error:
        print(f"Error code: {e.error.code}")
        print(f"Error message: {e.error.message}")
        raise
    print(e)
    raise
```

1. Replace `<your_list_name>` with the name you used in the list creation step.
1. Run the script.


---

### List all blocklists

#### [REST API](#tab/rest)

Copy the cURL command below to a text editor and make the following changes:

1. Replace `<endpoint>` with your endpoint URL.
1. Replace `<enter_your_key_here>` with your key.


```shell
curl --location --request GET '<endpoint>/contentsafety/text/blocklists?api-version=2023-10-01' \
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
string endpoint = Environment.GetEnvironmentVariable("CONTENT_SAFETY_ENDPOINT");
string key = Environment.GetEnvironmentVariable("CONTENT_SAFETY_KEY");
ContentSafetyClient client = new ContentSafetyClient(new Uri(endpoint), new AzureKeyCredential(key));

var blocklists = client.GetTextBlocklists();
Console.WriteLine("\nList blocklists:");
foreach (var blocklist in blocklists)
{
    Console.WriteLine("BlocklistName: {0}, Description: {1}", blocklist.BlocklistName, blocklist.Description);
}
```

Run the script.

#### [Python](#tab/python)

Create a new Python script and open it in your preferred editor or IDE. Paste in the following code.

```python
import os
from azure.ai.contentsafety import ContentSafetyClient
from azure.core.credentials import AzureKeyCredential
from azure.core.exceptions import HttpResponseError

key = os.environ["CONTENT_SAFETY_KEY"]
endpoint = os.environ["CONTENT_SAFETY_ENDPOINT"]

# Create an Content Safety client
client = ContentSafetyClient(endpoint, AzureKeyCredential(key))

try:
    blocklists = client.list_text_blocklists()
    if blocklists:
        print("\nList blocklists: ")
        for blocklist in blocklists:
            print(f"Name: {blocklist.blocklist_name}, Description: {blocklist.description}")
except HttpResponseError as e:
    print("\nList text blocklists failed: ")
    if e.error:
        print(f"Error code: {e.error.code}")
        print(f"Error message: {e.error.message}")
        raise
    print(e)
    raise
```

Run the script.

---


### Get a blocklist by blocklistName 

#### [REST API](#tab/rest)

Copy the cURL command below to a text editor and make the following changes:

1. Replace `<endpoint>` with your endpoint URL.
1. Replace `<enter_your_key_here>` with your key.
1. Replace `<your_list_name>` (in the request URL) with the name you used in the list creation step.

```shell
cURL --location '<endpoint>contentsafety/text/blocklists/<your_list_name>?api-version=2023-10-01' \
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
string endpoint = Environment.GetEnvironmentVariable("CONTENT_SAFETY_ENDPOINT");
string key = Environment.GetEnvironmentVariable("CONTENT_SAFETY_KEY");

ContentSafetyClient client = new ContentSafetyClient(new Uri(endpoint), new AzureKeyCredential(key));

var blocklistName = "<your_list_name>";

var getBlocklist = client.GetTextBlocklist(blocklistName);
if (getBlocklist != null && getBlocklist.Value != null)
{
    Console.WriteLine("\nGet blocklist:");
    Console.WriteLine("BlocklistName: {0}, Description: {1}", getBlocklist.Value.BlocklistName, getBlocklist.Value.Description);
}
```

1. Replace `<your_list_name>` with the name you used in the list creation step.
1. Run the script.

#### [Python](#tab/python)

Create a new Python script and open it in your preferred editor or IDE. Paste in the following code.

```python
import os
from azure.ai.contentsafety import ContentSafetyClient
from azure.core.credentials import AzureKeyCredential
from azure.core.exceptions import HttpResponseError

key = os.environ["CONTENT_SAFETY_KEY"]
endpoint = os.environ["CONTENT_SAFETY_ENDPOINT"]

# Create an Content Safety client
client = ContentSafetyClient(endpoint, AzureKeyCredential(key))

blocklist_name = "<your_list_name>"

try:
    blocklist = client.get_text_blocklist(blocklist_name=blocklist_name)
    if blocklist:
        print("\nGet blocklist: ")
        print(f"Name: {blocklist.blocklist_name}, Description: {blocklist.description}")
except HttpResponseError as e:
    print("\nGet text blocklist failed: ")
    if e.error:
        print(f"Error code: {e.error.code}")
        print(f"Error message: {e.error.message}")
        raise
    print(e)
    raise
```

1. Replace `<your_list_name>` with the name you used in the list creation step.
1. Run the script.

---


### Get a blocklistItem by blocklistName and blocklistItemId

#### [REST API](#tab/rest)

Copy the cURL command below to a text editor and make the following changes:

1. Replace `<endpoint>` with your endpoint URL.
1. Replace `<enter_your_key_here>` with your key.
1. Replace `<your_list_name>` (in the request URL) with the name you used in the list creation step.
1. Replace `<your_item_id>` with the ID value for the blocklistItem. This is the value of the `"blocklistItemId"` field from the **Add blocklistItem** or **Get all blocklistItems** API calls.


```shell
cURL --location '<endpoint>contentsafety/text/blocklists/<your_list_name>/blocklistItems/<your_item_id>?api-version=2023-10-01' \
--header 'Ocp-Apim-Subscription-Key: <enter_your_key_here>' \
--data ''
```

The status code should be `200`. The JSON response looks like this:

```json
{
  "blocklistItemId": "string",
  "description": "string",
  "text": "string"
}
```

#### [C#](#tab/csharp)

Create a new C# console app and open it in your preferred editor or IDE. Paste in the following code.

```csharp
string endpoint = Environment.GetEnvironmentVariable("CONTENT_SAFETY_ENDPOINT");
string key = Environment.GetEnvironmentVariable("CONTENT_SAFETY_KEY");

ContentSafetyClient client = new ContentSafetyClient(new Uri(endpoint), new AzureKeyCredential(key));

var blocklistName = "<your_list_name>";
var getBlockItemId = "<your_block_item_id>";

var getBlockItem = client.GetTextBlocklistItem(blocklistName, getBlockItemId);

Console.WriteLine("\nGet BlockItem:");
Console.WriteLine("BlockItemId: {0}, Text: {1}, Description: {2}", getBlockItem.Value.BlockItemId, getBlockItem.Value.Text, getBlockItem.Value.Description);
```

1. Replace `<your_list_name>` with the name you used in the list creation step.
1. Replace `<your_block_item_id>` with the ID of a previously added item.
1. Run the script.

#### [Python](#tab/python)

Create a new Python script and open it in your preferred editor or IDE. Paste in the following code.

```python
import os
from azure.ai.contentsafety import ContentSafetyClient
from azure.core.credentials import AzureKeyCredential
from azure.ai.contentsafety.models import TextBlockItemInfo, AddBlockItemsOptions
from azure.core.exceptions import HttpResponseError

key = os.environ["CONTENT_SAFETY_KEY"]
endpoint = os.environ["CONTENT_SAFETY_ENDPOINT"]

# Create an Content Safety client
client = ContentSafetyClient(endpoint, AzureKeyCredential(key))

blocklist_name = "<your_list_name>"
block_item_text_1 = "<block_item_text>"

try:
    # Add a blockItem
    add_result = client.add_block_items(
        blocklist_name=blocklist_name,
        body=AddBlockItemsOptions(block_items=[TextBlockItemInfo(text=block_item_text_1)]),
    )
    if not add_result or not add_result.value or len(add_result.value) <= 0:
        raise RuntimeError("BlockItem not created.")
    block_item_id = add_result.value[0].block_item_id

    # Get this blockItem by blockItemId
    block_item = client.get_text_blocklist_item(
        blocklist_name=blocklist_name,
        block_item_id= block_item_id
    )
    print("\nGet blockitem: ")
    print(f"BlockItemId: {block_item.block_item_id}, Text: {block_item.text}, Description: {block_item.description}")
except HttpResponseError as e:
    print("\nGet block item failed: ")
    if e.error:
        print(f"Error code: {e.error.code}")
        print(f"Error message: {e.error.message}")
        raise
    print(e)
    raise
```

1. Replace `<your_list_name>` with the name you used in the list creation step.
1. Replace `<block_item_text>` with your block item text.
1. Run the script.

---



### Remove blocklistItems from a blocklist. 

> [!NOTE]
>
> There will be some delay after you delete an item before it takes effect on text analysis, usually **not more than five minutes**.

#### [REST API](#tab/rest)


Copy the cURL command below to a text editor and make the following changes:

1. Replace `<endpoint>` with your endpoint URL.
1. Replace `<enter_your_key_here>` with your key.
1. Replace `<your_list_name>` (in the request URL) with the name you used in the list creation step.
1. Replace `<item_id>` with the ID value for the blocklistItem. This is the value of the `"blocklistItemId"` field from the **Add blocklistItem** or **Get all blocklistItems** API calls.


```shell
curl --location --request DELETE '<endpoint>/contentsafety/text/blocklists/<your_list_name>:removeBlocklistItems?api-version=2023-10-01' \
--header 'Ocp-Apim-Subscription-Key: <enter_your_key_here>' \
--header 'Content-Type: application/json'
--data-raw '"blocklistItemIds":[
    "<item_id>"
]'
```

> [!TIP]
> You can delete multiple blocklistItems in one API call. Make the request body an array of `blocklistItemId` values.

The response code should be `204`.

#### [C#](#tab/csharp)


Create a new C# console app and open it in your preferred editor or IDE. Paste in the following code.

```csharp
string endpoint = os.environ["CONTENT_SAFETY_ENDPOINT"];
string key = os.environ["CONTENT_SAFETY_KEY"];

ContentSafetyClient client = new ContentSafetyClient(new Uri(endpoint), new AzureKeyCredential(key));

var blocklistName = "<your_list_name>";

var removeBlockItemId = "<your_block_item_id>";
var removeBlockItemIds = new List<string> { removeBlockItemId };
var removeResult = client.RemoveBlockItems(blocklistName, new RemoveBlockItemsOptions(removeBlockItemIds));

if (removeResult != null && removeResult.Status == 204)
{
    Console.WriteLine("\nBlockItem removed: {0}.", removeBlockItemId);
}
```

1. Replace `<your_list_name>` with the name you used in the list creation step.
1. Replace `<your_block_item_id>` with the ID of a previously added item. 
1. Run the script.

#### [Python](#tab/python)

Create a new Python script and open it in your preferred editor or IDE. Paste in the following code.

```python
import os
from azure.ai.contentsafety import ContentSafetyClient
from azure.core.credentials import AzureKeyCredential
from azure.ai.contentsafety.models import (
    TextBlockItemInfo,
    AddBlockItemsOptions,
    RemoveBlockItemsOptions
)
from azure.core.exceptions import HttpResponseError

key = os.environ["CONTENT_SAFETY_KEY"]
endpoint = os.environ["CONTENT_SAFETY_ENDPOINT"]

# Create an Content Safety client
client = ContentSafetyClient(endpoint, AzureKeyCredential(key))

blocklist_name = "<your_list_name>"
block_item_text_1 = "<block_item_text>"

try:
    # Add a blockItem
    add_result = client.add_block_items(
        blocklist_name=blocklist_name,
        body=AddBlockItemsOptions(block_items=[TextBlockItemInfo(text=block_item_text_1)]),
    )
    if not add_result or not add_result.value or len(add_result.value) <= 0:
        raise RuntimeError("BlockItem not created.")
    block_item_id = add_result.value[0].block_item_id

    # Remove this blockItem by blockItemId
    client.remove_block_items(
        blocklist_name=blocklist_name,
        body=RemoveBlockItemsOptions(block_item_ids=[block_item_id])
    )
    print(f"\nRemoved blockItem: {add_result.value[0].block_item_id}")
except HttpResponseError as e:
    print("\nRemove block item failed: ")
    if e.error:
        print(f"Error code: {e.error.code}")
        print(f"Error message: {e.error.message}")
        raise
    print(e)
    raise
```

1. Replace `<your_list_name>` with the name you used in the list creation step.
Replace `<block_item_text>` with your block item text.
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
1. Replace `<your_list_name>` (in the request URL) with the name you used in the list creation step.

```shell
curl --location --request DELETE '<endpoint>/contentsafety/text/blocklists/<your_list_name>?api-version=2023-10-01' \
--header 'Ocp-Apim-Subscription-Key: <enter_your_key_here>' \
--header 'Content-Type: application/json' \
```

The response code should be `204`.

#### [C#](#tab/csharp)

Create a new C# console app and open it in your preferred editor or IDE. Paste in the following code.

```csharp
string endpoint = os.environ["CONTENT_SAFETY_ENDPOINT"];
string key = os.environ["CONTENT_SAFETY_KEY"];

ContentSafetyClient client = new ContentSafetyClient(new Uri(endpoint), new AzureKeyCredential(key));

var blocklistName = "<your_list_name>";

var deleteResult = client.DeleteTextBlocklist(blocklistName);
if (deleteResult != null && deleteResult.Status == 204)
{
    Console.WriteLine("\nDeleted blocklist.");
}
```

1. Replace `<your_list_name>` (in the request URL) with the name you used in the list creation step.
1. Run the script.

#### [Python](#tab/python)

Create a new Python script and open it in your preferred editor or IDE. Paste in the following code.

```python
import os
from azure.ai.contentsafety import ContentSafetyClient
from azure.core.credentials import AzureKeyCredential
from azure.core.exceptions import HttpResponseError

key = os.environ["CONTENT_SAFETY_KEY"]
endpoint = os.environ["CONTENT_SAFETY_ENDPOINT"]

# Create an Content Safety client
client = ContentSafetyClient(endpoint, AzureKeyCredential(key))

blocklist_name = "<your_list_name>"

try:
    client.delete_text_blocklist(blocklist_name=blocklist_name)
    print(f"\nDeleted blocklist: {blocklist_name}")
except HttpResponseError as e:
    print("\nDelete blocklist failed:")
    if e.error:
        print(f"Error code: {e.error.code}")
        print(f"Error message: {e.error.message}")
        raise
    print(e)
    raise
```

1. Replace `<your_list_name>` (in the request URL) with the name you used in the list creation step.
1. Run the script.

---


## Next steps

See the API reference documentation to learn more about the APIs used in this guide.

* [Content Safety API reference](https://aka.ms/content-safety-api)
