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
ms.date: 06/01/2024
ms.author: pafarley
---


# Use a blocklist

> [!CAUTION]
> The sample data in this guide might contain offensive content. User discretion is advised.

The default AI classifiers are sufficient for most content moderation needs. However, you might need to screen for items that are specific to your use case. Blocklists let you add custom terms to the AI classifiers. You can use blocklists to screen for specific terms or phrases that you want to flag in your content.

## Prerequisites

* An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/) 
* Once you have your Azure subscription, <a href="https://aka.ms/acs-create"  title="Create a Content Safety resource"  target="_blank">create a Content Safety resource </a> in the Azure portal to get your key and endpoint. Enter a unique name for your resource, select your subscription, and select a resource group, supported region (see [Region availability](/azure/ai-services/content-safety/overview#region-availability)), and supported pricing tier. Then select **Create**.
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

BlocklistClient blocklistClient = new BlocklistClient(new Uri(endpoint), new AzureKeyCredential(key));

var blocklistName = "<your_list_name>";
var blocklistDescription = "<description>";

var data = new
{
    description = blocklistDescription,
};

var createResponse = blocklistClient.CreateOrUpdateTextBlocklist(blocklistName, RequestContent.Create(data));

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

#### [Java](#tab/java)

Create a Java application and open it in your preferred editor or IDE. Paste in the following code.

```java
String endpoint = Configuration.getGlobalConfiguration().get("CONTENT_SAFETY_ENDPOINT");
String key = Configuration.getGlobalConfiguration().get("CONTENT_SAFETY_KEY");
BlocklistClient blocklistClient = new BlocklistClientBuilder()
        .credential(new KeyCredential(key))
        .endpoint(endpoint).buildClient();

String blocklistName = "<your_list_name>";


Map<String, String> description = new HashMap<>();
description.put("description", "<description>");
BinaryData resource = BinaryData.fromObject(description);
RequestOptions requestOptions = new RequestOptions();
Response<BinaryData> response =
        blocklistClient.createOrUpdateTextBlocklistWithResponse(blocklistName, resource, requestOptions);
if (response.getStatusCode() == 201) {
    System.out.println("\nBlocklist " + blocklistName + " created.");
} else if (response.getStatusCode() == 200) {
    System.out.println("\nBlocklist " + blocklistName + " updated.");
}
```

1. Replace `<your_list_name>` with a custom name for your list. Allowed characters: `0-9, A-Z, a-z, - . _ ~`.
1. Optionally replace `<description>` with a custom description.
1. Run the code.

#### [Python](#tab/python)
Create a new Python script and open it in your preferred editor or IDE. Paste in the following code.

```python
import os
from azure.ai.contentsafety import BlocklistClient
from azure.core.credentials import AzureKeyCredential
from azure.ai.contentsafety.models import TextBlocklist
from azure.core.exceptions import HttpResponseError

key = os.environ["CONTENT_SAFETY_KEY"]
endpoint = os.environ["CONTENT_SAFETY_ENDPOINT"]
  
# Create a Blocklist client
client = BlocklistClient(endpoint, AzureKeyCredential(key))

blocklist_name = "<your_list_name>"
blocklist_description = "<description>"

try:
    blocklist = client.create_or_update_text_blocklist(
        blocklist_name=blocklist_name,
        options=TextBlocklist(blocklist_name=blocklist_name, description=blocklist_description),
    )
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

#### [JavaScript](#tab/javascript)

Create a new JavaScript script and open it in your preferred editor or IDE. Paste in the following code.

```javascript
const ContentSafetyClient = require("@azure-rest/ai-content-safety").default,
  { isUnexpected } = require("@azure-rest/ai-content-safety");
const { AzureKeyCredential } = require("@azure/core-auth");

// Load the .env file if it exists
require("dotenv").config();

const endpoint = process.env["CONTENT_SAFETY_ENDPOINT"] || "<endpoint>";
const key = process.env["CONTENT_SAFETY_API_KEY"] || "<key>";

const credential = new AzureKeyCredential(key);
const client = ContentSafetyClient(endpoint, credential);

async function createOrUpdateTextBlocklist() {
  const blocklistName = "<your_list_name>";
  const blocklistDescription = "<description>";

  const createOrUpdateTextBlocklistParameters = {
    contentType: "application/merge-patch+json",
    body: {
      description: blocklistDescription,
    },
  };

  const result = await client
    .path("/text/blocklists/{blocklistName}", blocklistName)
    .patch(createOrUpdateTextBlocklistParameters);

  if (isUnexpected(result)) {
    throw result;
  }

  console.log(
    "Blocklist created or updated. Name: ",
    result.body.blocklistName,
    ", Description: ",
    result.body.description
  );
}

(async () => {
  await createOrUpdateTextBlocklist();
})().catch((err) => {
  console.error("The sample encountered an error:", err);
});
```

1. Replace `<your_list_name>` with a custom name for your list. Allowed characters: `0-9, A-Z, a-z, - . _ ~`.
1. Optionally replace `<description>` with a custom description.
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
> {
>    "blocklistItems": [
>        {
>            "description": "string",
>            "text": "bleed"
>        },
>        {
>            "description": "string",
>            "text": "blood"
>        }
>    ]
>}
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
BlocklistClient blocklistClient = new BlocklistClient(new Uri(endpoint), new AzureKeyCredential(key));

var blocklistName = "<your_list_name>";


string blocklistItemText1 = "<block_item_text_1>";
string blocklistItemText2 = "<block_item_text_2>";

var blocklistItems = new TextBlocklistItem[] { new TextBlocklistItem(blocklistItemText1), new TextBlocklistItem(blocklistItemText2) };
var addedBlocklistItems = blocklistClient.AddOrUpdateBlocklistItems(blocklistName, new AddOrUpdateTextBlocklistItemsOptions(blocklistItems));

if (addedBlocklistItems != null && addedBlocklistItems.Value != null)
{
    Console.WriteLine("\nBlocklistItems added:");
    foreach (var addedBlocklistItem in addedBlocklistItems.Value.BlocklistItems)
    {
        Console.WriteLine("BlocklistItemId: {0}, Text: {1}, Description: {2}", addedBlocklistItem.BlocklistItemId, addedBlocklistItem.Text, addedBlocklistItem.Description);
    }
}
```

1. Replace `<your_list_name>` with the name you used in the list creation step.
1. Replace the values of the `blocklistItemText1` and `blocklistItemText2` fields with the items you'd like to add to your blocklist. The maximum length of a blockItem is 128 characters.
1. Optionally add more blockItem strings to the `blockItems` parameter.
1. Run the code.

#### [Java](#tab/java)

Create a Java application and open it in your preferred editor or IDE. Paste in the following code.

```java
String endpoint = Configuration.getGlobalConfiguration().get("CONTENT_SAFETY_ENDPOINT");
String key = Configuration.getGlobalConfiguration().get("CONTENT_SAFETY_KEY");
BlocklistClient blocklistClient = new BlocklistClientBuilder()
        .credential(new KeyCredential(key))
        .endpoint(endpoint).buildClient();

String blocklistName = "<your_list_name>";

String blockItemText1 = "<block_item_text_1>";
String blockItemText2 = "<block_item_text_2>";
List<TextBlocklistItem> blockItems = Arrays.asList(new TextBlocklistItem(blockItemText1).setDescription("Kill word"),
        new TextBlocklistItem(blockItemText2).setDescription("Hate word"));
AddOrUpdateTextBlocklistItemsResult addedBlockItems = blocklistClient.addOrUpdateBlocklistItems(blocklistName,
        new AddOrUpdateTextBlocklistItemsOptions(blockItems));
if (addedBlockItems != null && addedBlockItems.getBlocklistItems() != null) {
    System.out.println("\nBlockItems added:");
    for (TextBlocklistItem addedBlockItem : addedBlockItems.getBlocklistItems()) {
        System.out.println("BlockItemId: " + addedBlockItem.getBlocklistItemId() + ", Text: " + addedBlockItem.getText() + ", Description: " + addedBlockItem.getDescription());
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
from azure.ai.contentsafety import BlocklistClient
from azure.core.credentials import AzureKeyCredential
from azure.ai.contentsafety.models import (
    AddOrUpdateTextBlocklistItemsOptions, TextBlocklistItem
)
from azure.core.exceptions import HttpResponseError

key = os.environ["CONTENT_SAFETY_KEY"]
endpoint = os.environ["CONTENT_SAFETY_ENDPOINT"]

# Create a Blocklist client
client = BlocklistClient(endpoint, AzureKeyCredential(key))

blocklist_name = "<your_list_name>"
blocklist_item_text_1 = "<block_item_text_1>"
blocklist_item_text_2 = "<block_item_text_2>"

blocklist_items = [TextBlocklistItem(text=blocklist_item_text_1), TextBlocklistItem(text=blocklist_item_text_2)]
try:
    result = client.add_or_update_blocklist_items(
        blocklist_name=blocklist_name, options=AddOrUpdateTextBlocklistItemsOptions(blocklist_items=blocklist_items)
    for blocklist_item in result.blocklist_items:
        print(
            f"BlocklistItemId: {blocklist_item.blocklist_item_id}, Text: {blocklist_item.text}, Description: {blocklist_item.description}"
        )
except HttpResponseError as e:
    print("\nAdd blocklistItems failed: ")
    if e.error:
        print(f"Error code: {e.error.code}")
        print(f"Error message: {e.error.message}")
        raise
    print(e)
    raise
```

1. Replace `<your_list_name>` with the name you used in the list creation step.
1. Replace the values of the `blocklist_item_text_1` and `blocklist_item_text_2` fields with the items you'd like to add to your blocklist. The maximum length of a blockItem is 128 characters.
1. Optionally add more blockItem strings to the `block_items` parameter.
1. Run the script.

#### [JavaScript](#tab/javascript)


```javascript
const ContentSafetyClient = require("@azure-rest/ai-content-safety").default,
  { isUnexpected } = require("@azure-rest/ai-content-safety");
const { AzureKeyCredential } = require("@azure/core-auth");

// Load the .env file if it exists
require("dotenv").config();

const endpoint = process.env["CONTENT_SAFETY_ENDPOINT"] || "<endpoint>";
const key = process.env["CONTENT_SAFETY_API_KEY"] || "<key>";

const credential = new AzureKeyCredential(key);
const client = ContentSafetyClient(endpoint, credential);

async function addBlocklistItems() {
  const blocklistName = "<your_list_name>";
  const blocklistItemText1 = "<block_item_text_1>";
  const blocklistItemText2 = "<block_item_text_2>";
  const addOrUpdateBlocklistItemsParameters = {
    body: {
      blocklistItems: [
        {
          description: "Test blocklist item 1",
          text: blocklistItemText1,
        },
        {
          description: "Test blocklist item 2",
          text: blocklistItemText2,
        },
      ],
    },
  };

  const result = await client
    .path("/text/blocklists/{blocklistName}:addOrUpdateBlocklistItems", blocklistName)
    .post(addOrUpdateBlocklistItemsParameters);

  if (isUnexpected(result)) {
    throw result;
  }

  console.log("Blocklist items added: ");
  if (result.body.blocklistItems) {
    for (const blocklistItem of result.body.blocklistItems) {
      console.log(
        "BlocklistItemId: ",
        blocklistItem.blocklistItemId,
        ", Text: ",
        blocklistItem.text,
        ", Description: ",
        blocklistItem.description
      );
    }
  }
}
(async () => {
  await addBlocklistItems();
})().catch((err) => {
  console.error("The sample encountered an error:", err);
});
```

1. Replace `<your_list_name>` with the name you used in the list creation step.
1. Replace the values of the `block_item_text_1` and `block_item_text_2` fields with the items you'd like to add to your blocklist. The maximum length of a blockItem is 128 characters.
1. Optionally add more blockItem strings to the `blocklistItems` parameter.
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
request.HaltOnBlocklistHit  = true;

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

if (response.Value.BlocklistsMatch != null)
{
    Console.WriteLine("\nBlocklist match result:");
    foreach (var matchResult in response.Value.BlocklistsMatch)
    {
        Console.WriteLine("BlocklistName: {0}, BlocklistItemId: {1}, BlocklistText: {2}, ", matchResult.BlocklistName, matchResult.BlocklistItemId, matchResult.BlocklistItemText);
    }
}
```

1. Replace `<your_list_name>` with the name you used in the list creation step.
1. Replace the `request` input text with whatever text you want to analyze.
1. Run the script.

#### [Java](#tab/java)

Create a Java application and open it in your preferred editor or IDE. Paste in the following code.

```java
String endpoint = Configuration.getGlobalConfiguration().get("CONTENT_SAFETY_ENDPOINT");
String key = Configuration.getGlobalConfiguration().get("CONTENT_SAFETY_KEY");

ContentSafetyClient contentSafetyClient = new ContentSafetyClientBuilder()
        .credential(new KeyCredential(key))
        .endpoint(endpoint).buildClient();

String blocklistName = "<your_list_name>";

AnalyzeTextOptions request = new AnalyzeTextOptions("<sample_text>");
request.setBlocklistNames(Arrays.asList(blocklistName));
request.setHaltOnBlocklistHit(true);

AnalyzeTextResult analyzeTextResult;
try {
    analyzeTextResult = contentSafetyClient.analyzeText(request);
} catch (HttpResponseException ex) {
    System.out.println("Analyze text failed.\nStatus code: " + ex.getResponse().getStatusCode() + ", Error message: " + ex.getMessage());
    throw ex;
}

if (analyzeTextResult.getBlocklistsMatch() != null) {
    System.out.println("\nBlocklist match result:");
    for (TextBlocklistMatch matchResult : analyzeTextResult.getBlocklistsMatch()) {
        System.out.println("BlocklistName: " + matchResult.getBlocklistName() + ", BlockItemId: " + matchResult.getBlocklistItemId() + ", BlockItemText: " + matchResult.getBlocklistItemText());
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

# Create a Content Safety client
client = ContentSafetyClient(endpoint, AzureKeyCredential(key))

blocklist_name = "<your_list_name>"
input_text = "<your_input_text>"

try:
    # After you edit your blocklist, it usually takes effect in 5 minutes, please wait some time before analyzing
    # with blocklist after editing.
    analysis_result = client.analyze_text(
        AnalyzeTextOptions(text=input_text, blocklist_names=[blocklist_name], halt_on_blocklist_hit=False)
    )
    if analysis_result and analysis_result.blocklists_match:
        print("\nBlocklist match results: ")
        for match_result in analysis_result.blocklists_match:
            print(
                f"BlocklistName: {match_result.blocklist_name}, BlocklistItemId: {match_result.blocklist_item_id}, "
                f"BlocklistItemText: {match_result.blocklist_item_text}"
            )
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

#### [JavaScript](#tab/javascript)

```javascript
const ContentSafetyClient = require("@azure-rest/ai-content-safety").default,
  { isUnexpected } = require("@azure-rest/ai-content-safety");
const { AzureKeyCredential } = require("@azure/core-auth");

// Load the .env file if it exists
require("dotenv").config();

const endpoint = process.env["CONTENT_SAFETY_ENDPOINT"] || "<endpoint>";
const key = process.env["CONTENT_SAFETY_API_KEY"] || "<key>";

const credential = new AzureKeyCredential(key);
const client = ContentSafetyClient(endpoint, credential);

async function analyzeTextWithBlocklists() {
  const blocklistName = "<your_list_name>";
  const inputText = "<your_input_text>";
  const analyzeTextParameters = {
    body: {
      text: inputText,
      blocklistNames: [blocklistName],
      haltOnBlocklistHit: false,
    },
  };

  const result = await client.path("/text:analyze").post(analyzeTextParameters);

  if (isUnexpected(result)) {
    throw result;
  }

  console.log("Blocklist match results: ");
  if (result.body.blocklistsMatch) {
    for (const blocklistMatchResult of result.body.blocklistsMatch) {
      console.log(
        "BlocklistName: ",
        blocklistMatchResult.blocklistName,
        ", BlocklistItemId: ",
        blocklistMatchResult.blocklistItemId,
        ", BlocklistItemText: ",
        blocklistMatchResult.blocklistItemText
      );
    }
  }
}

(async () => {
  await analyzeTextWithBlocklists();
})().catch((err) => {
  console.error("The sample encountered an error:", err);
});
```

1. Replace `<your_list_name>` with the name you used in the list creation step.
1. Replace the `inputText` variable with whatever text you want to analyze.
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
BlocklistClient blocklistClient = new BlocklistClient(new Uri(endpoint), new AzureKeyCredential(key));

var blocklistName = "<your_list_name>";

var allBlocklistitems = blocklistClient.GetTextBlocklistItems(blocklistName);
Console.WriteLine("\nList BlocklistItems:");
foreach (var blocklistItem in allBlocklistitems)
{
    Console.WriteLine("BlocklistItemId: {0}, Text: {1}, Description: {2}", blocklistItem.BlocklistItemId, blocklistItem.Text, blocklistItem.Description);
}

```

1. Replace `<your_list_name>` with the name you used in the list creation step.
1. Run the script.

#### [Java](#tab/java)

Create a Java application and open it in your preferred editor or IDE. Paste in the following code.

```java
String endpoint = Configuration.getGlobalConfiguration().get("CONTENT_SAFETY_ENDPOINT");
String key = Configuration.getGlobalConfiguration().get("CONTENT_SAFETY_KEY");
BlocklistClient blocklistClient = new BlocklistClientBuilder()
        .credential(new KeyCredential(key))
        .endpoint(endpoint).buildClient();

String blocklistName = "<your_list_name>";

PagedIterable<TextBlocklistItem> allBlockitems = blocklistClient.listTextBlocklistItems(blocklistName);
System.out.println("\nList BlockItems:");
for (TextBlocklistItem blocklistItem : allBlockitems) {
    System.out.println("BlockItemId: " + blocklistItem.getBlocklistItemId() + ", Text: " + blocklistItem.getText() + ", Description: " + blocklistItem.getDescription());
}
```

1. Replace `<your_list_name>` with the name you used in the list creation step.
1. Run the script.


#### [Python](#tab/python)

Create a new Python script and open it in your preferred editor or IDE. Paste in the following code.


```python
import os
from azure.ai.contentsafety import BlocklistClient
from azure.core.credentials import AzureKeyCredential
from azure.core.exceptions import HttpResponseError

key = os.environ["CONTENT_SAFETY_KEY"]
endpoint = os.environ["CONTENT_SAFETY_ENDPOINT"]

# Create a Blocklist client
client = BlocklistClient(endpoint, AzureKeyCredential(key))

blocklist_name = "<your_list_name>"

try:
    blocklist_items = client.list_text_blocklist_items(blocklist_name=blocklist_name)
    if blocklist_items:
        print("\nList blocklist items: ")
        for blocklist_item in blocklist_items:
            print(
                f"BlocklistItemId: {blocklist_item.blocklist_item_id}, Text: {blocklist_item.text}, "
                f"Description: {blocklist_item.description}"
            )
except HttpResponseError as e:
    print("\nList blocklist items failed: ")
    if e.error:
        print(f"Error code: {e.error.code}")
        print(f"Error message: {e.error.message}")
        raise
    print(e)
    raise
```

1. Replace `<your_list_name>` with the name you used in the list creation step.
1. Run the script.

#### [JavaScript](#tab/javascript)

```javascript
const ContentSafetyClient = require("@azure-rest/ai-content-safety").default,
  { isUnexpected } = require("@azure-rest/ai-content-safety");
const { AzureKeyCredential } = require("@azure/core-auth");

// Load the .env file if it exists
require("dotenv").config();

const endpoint = process.env["CONTENT_SAFETY_ENDPOINT"] || "<endpoint>";
const key = process.env["CONTENT_SAFETY_API_KEY"] || "<key>";

const credential = new AzureKeyCredential(key);
const client = ContentSafetyClient(endpoint, credential);

async function listBlocklistItems() {
  const blocklistName = "<your_list_name>";

  const result = await client
    .path("/text/blocklists/{blocklistName}/blocklistItems", blocklistName)
    .get();

  if (isUnexpected(result)) {
    throw result;
  }

  console.log("List blocklist items: ");
  if (result.body.value) {
    for (const blocklistItem of result.body.value) {
      console.log(
        "BlocklistItemId: ",
        blocklistItem.blocklistItemId,
        ", Text: ",
        blocklistItem.text,
        ", Description: ",
        blocklistItem.description
      );
    }
  }
}

(async () => {
  await listBlocklistItems();
})().catch((err) => {
  console.error("The sample encountered an error:", err);
});
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
BlocklistClient blocklistClient = new BlocklistClient(new Uri(endpoint), new AzureKeyCredential(key));

var blocklists = blocklistClient.GetTextBlocklists();
Console.WriteLine("\nList blocklists:");
foreach (var blocklist in blocklists)
{
    Console.WriteLine("BlocklistName: {0}, Description: {1}", blocklist.Name, blocklist.Description);
}
```

Run the script.

#### [Java](#tab/java)

Create a Java application and open it in your preferred editor or IDE. Paste in the following code.

```java
String endpoint = Configuration.getGlobalConfiguration().get("CONTENT_SAFETY_ENDPOINT");
String key = Configuration.getGlobalConfiguration().get("CONTENT_SAFETY_KEY");
BlocklistClient blocklistClient = new BlocklistClientBuilder()
        .credential(new KeyCredential(key))
        .endpoint(endpoint).buildClient();

PagedIterable<TextBlocklist> allTextBlocklists = blocklistClient.listTextBlocklists();
System.out.println("\nList Blocklist:");
for (TextBlocklist blocklist : allTextBlocklists) {
    System.out.println("Blocklist: " + blocklist.getName() + ", Description: " + blocklist.getDescription());
}
```

Run the script.

#### [Python](#tab/python)

Create a new Python script and open it in your preferred editor or IDE. Paste in the following code.

```python
import os
from azure.ai.contentsafety import BlocklistClient
from azure.core.credentials import AzureKeyCredential
from azure.core.exceptions import HttpResponseError

key = os.environ["CONTENT_SAFETY_KEY"]
endpoint = os.environ["CONTENT_SAFETY_ENDPOINT"]

# Create a Blocklist client
client = BlocklistClient(endpoint, AzureKeyCredential(key))


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

#### [JavaScript](#tab/javascript)

```javascript
const ContentSafetyClient = require("@azure-rest/ai-content-safety").default,
  { isUnexpected } = require("@azure-rest/ai-content-safety");
const { AzureKeyCredential } = require("@azure/core-auth");

// Load the .env file if it exists
require("dotenv").config();

const endpoint = process.env["CONTENT_SAFETY_ENDPOINT"] || "<endpoint>";
const key = process.env["CONTENT_SAFETY_API_KEY"] || "<key>";

const credential = new AzureKeyCredential(key);
const client = ContentSafetyClient(endpoint, credential);

async function listTextBlocklists() {
  const result = await client.path("/text/blocklists").get();

  if (isUnexpected(result)) {
    throw result;
  }

  console.log("List blocklists: ");
  if (result.body.value) {
    for (const blocklist of result.body.value) {
      console.log(
        "BlocklistName: ",
        blocklist.blocklistName,
        ", Description: ",
        blocklist.description
      );
    }
  }
}

(async () => {
  await listTextBlocklists();
})().catch((err) => {
  console.error("The sample encountered an error:", err);
});
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
BlocklistClient blocklistClient = new BlocklistClient(new Uri(endpoint), new AzureKeyCredential(key));

var blocklistName = "<your_list_name>";

var getBlocklist = blocklistClient.GetTextBlocklist(blocklistName);
if (getBlocklist != null && getBlocklist.Value != null)
{
    Console.WriteLine("\nGet blocklist:");
    Console.WriteLine("BlocklistName: {0}, Description: {1}", getBlocklist.Value.Name, getBlocklist.Value.Description);
}
```

1. Replace `<your_list_name>` with the name you used in the list creation step.
1. Run the script.

#### [Java](#tab/java)

Create a Java application and open it in your preferred editor or IDE. Paste in the following code.

```java
String endpoint = Configuration.getGlobalConfiguration().get("CONTENT_SAFETY_ENDPOINT");
String key = Configuration.getGlobalConfiguration().get("CONTENT_SAFETY_KEY");
BlocklistClient blocklistClient = new BlocklistClientBuilder()
        .credential(new KeyCredential(key))
        .endpoint(endpoint).buildClient();

String blocklistName = "<your_list_name>";

TextBlocklist getBlocklist = blocklistClient.getTextBlocklist(blocklistName);
if (getBlocklist != null) {
    System.out.println("\nGet blocklist:");
    System.out.println("BlocklistName: " + getBlocklist.getName() + ", Description: " + getBlocklist.getDescription());
}
```

1. Replace `<your_list_name>` with the name you used in the list creation step.
1. Run the script.

#### [Python](#tab/python)

Create a new Python script and open it in your preferred editor or IDE. Paste in the following code.

```python
import os
from azure.ai.contentsafety import BlocklistClient
from azure.core.credentials import AzureKeyCredential
from azure.core.exceptions import HttpResponseError

key = os.environ["CONTENT_SAFETY_KEY"]
endpoint = os.environ["CONTENT_SAFETY_ENDPOINT"]

# Create a Blocklist client
client = BlocklistClient(endpoint, AzureKeyCredential(key))

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

#### [JavaScript](#tab/javascript)

```javascript
const ContentSafetyClient = require("@azure-rest/ai-content-safety").default,
  { isUnexpected } = require("@azure-rest/ai-content-safety");
const { AzureKeyCredential } = require("@azure/core-auth");

// Load the .env file if it exists
require("dotenv").config();

const endpoint = process.env["CONTENT_SAFETY_ENDPOINT"] || "<endpoint>";
const key = process.env["CONTENT_SAFETY_API_KEY"] || "<key>";

const credential = new AzureKeyCredential(key);
const client = ContentSafetyClient(endpoint, credential);

async function getTextBlocklist() {
  const blocklistName = "<your_list_name>";

  const result = await client.path("/text/blocklists/{blocklistName}", blocklistName).get();

  if (isUnexpected(result)) {
    throw result;
  }

  console.log("Get blocklist: ");
  console.log("Name: ", result.body.blocklistName, ", Description: ", result.body.description);
}


(async () => {
  await getTextBlocklist();
})().catch((err) => {
  console.error("The sample encountered an error:", err);
});
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
BlocklistClient blocklistClient = new BlocklistClient(new Uri(endpoint), new AzureKeyCredential(key));

var blocklistName = "<your_list_name>";
var getBlocklistItemId = "<your_block_item_id>";

var getBlocklistItem = blocklistClient.GetTextBlocklistItem(blocklistName, getBlocklistItemId);

Console.WriteLine("\nGet BlocklistItem:");
Console.WriteLine("BlocklistItemId: {0}, Text: {1}, Description: {2}", getBlocklistItem.Value.BlocklistItemId, getBlocklistItem.Value.Text, getBlocklistItem.Value.Description);
```

1. Replace `<your_list_name>` with the name you used in the list creation step.
1. Replace `<your_block_item_id>` with the ID of a previously added item.
1. Run the script.

#### [Java](#tab/java)

Create a Java application and open it in your preferred editor or IDE. Paste in the following code.

```java
String endpoint = Configuration.getGlobalConfiguration().get("CONTENT_SAFETY_ENDPOINT");
String key = Configuration.getGlobalConfiguration().get("CONTENT_SAFETY_KEY");
BlocklistClient blocklistClient = new BlocklistClientBuilder()
        .credential(new KeyCredential(key))
        .endpoint(endpoint).buildClient();

String blocklistName = "<your_list_name>";

String getBlockItemId = "<your_block_item_id>";

TextBlocklistItem getBlockItem = blocklistClient.getTextBlocklistItem(blocklistName, getBlockItemId);
System.out.println("\nGet BlockItem:");
System.out.println("BlockItemId: " + getBlockItem.getBlocklistItemId() + ", Text: " + getBlockItem.getText() + ", Description: " + getBlockItem.getDescription());
```

1. Replace `<your_list_name>` with the name you used in the list creation step.
1. Replace `<your_block_item_id>` with the ID of a previously added item.
1. Run the script.

#### [Python](#tab/python)

Create a new Python script and open it in your preferred editor or IDE. Paste in the following code.

```python
import os
from azure.ai.contentsafety import BlocklistClient
from azure.core.credentials import AzureKeyCredential
from azure.ai.contentsafety.models import TextBlocklistItem, AddOrUpdateTextBlocklistItemsOptions
from azure.core.exceptions import HttpResponseError

key = os.environ["CONTENT_SAFETY_KEY"]
endpoint = os.environ["CONTENT_SAFETY_ENDPOINT"]

# Create a Blocklist client
client = BlocklistClient(endpoint, AzureKeyCredential(key))

blocklist_name = "<your_list_name>"
blocklist_item_text_1 = "<block_item_text>"

try:
    # Add a blocklistItem
    add_result = client.add_or_update_blocklist_items(
        blocklist_name=blocklist_name,
        options=AddOrUpdateTextBlocklistItemsOptions(blocklist_items=[TextBlocklistItem(text=blocklist_item_text_1)]),
    )
    if not add_result or not add_result.blocklist_items or len(add_result.blocklist_items) <= 0:
        raise RuntimeError("BlocklistItem not created.")
    blocklist_item_id = add_result.blocklist_items[0].blocklist_item_id

    # Get this blocklistItem by blocklistItemId
    blocklist_item = client.get_text_blocklist_item(blocklist_name=blocklist_name, blocklist_item_id=blocklist_item_id)
    print("\nGet blocklistItem: ")
    print(
        f"BlocklistItemId: {blocklist_item.blocklist_item_id}, Text: {blocklist_item.text}, Description: {blocklist_item.description}"
    )
except HttpResponseError as e:
    print("\nGet blocklist item failed: ")
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

#### [JavaScript](#tab/javascript)

```javascript
const ContentSafetyClient = require("@azure-rest/ai-content-safety").default,
  { isUnexpected } = require("@azure-rest/ai-content-safety");
const { AzureKeyCredential } = require("@azure/core-auth");

// Load the .env file if it exists
require("dotenv").config();

const endpoint = process.env["CONTENT_SAFETY_ENDPOINT"] || "<endpoint>";
const key = process.env["CONTENT_SAFETY_API_KEY"] || "<key>";

const credential = new AzureKeyCredential(key);
const client = ContentSafetyClient(endpoint, credential);

async function getBlocklistItem() {
  const blocklistName = "<your_list_name>";

  const blocklistItemId = "<your_block_item_id>";

  // Get this blocklistItem by blocklistItemId
  const blocklistItem = await client
    .path(
      "/text/blocklists/{blocklistName}/blocklistItems/{blocklistItemId}",
      blocklistName,
      blocklistItemId
    )
    .get();

  if (isUnexpected(blocklistItem)) {
    throw blocklistItem;
  }

  console.log("Get blocklistitem: ");
  console.log(
    "BlocklistItemId: ",
    blocklistItem.body.blocklistItemId,
    ", Text: ",
    blocklistItem.body.text,
    ", Description: ",
    blocklistItem.body.description
  );
}


(async () => {
  await getBlocklistItem();
})().catch((err) => {
  console.error("The sample encountered an error:", err);
});
```
---

1. Replace `<your_list_name>` with the name you used in the list creation step.
1. Replace `<your_block_item_id>` with the ID of the item you want to get.
1. Run the script.


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
BlocklistClient blocklistClient = new BlocklistClient(new Uri(endpoint), new AzureKeyCredential(key));

var blocklistName = "<your_list_name>";

var removeBlocklistItemId = "<your_block_item_id>";
var removeBlocklistItemIds = new List<string> { removeBlocklistItemId };
var removeResult = blocklistClient.RemoveBlocklistItems(blocklistName, new RemoveTextBlocklistItemsOptions(removeBlocklistItemIds));

if (removeResult != null && removeResult.Status == 204)
{
    Console.WriteLine("\nBlocklistItem removed: {0}.", removeBlocklistItemId);
}
```

1. Replace `<your_list_name>` with the name you used in the list creation step.
1. Replace `<your_block_item_id>` with the ID of a previously added item. 
1. Run the script.

#### [Java](#tab/java)

Create a Java application and open it in your preferred editor or IDE. Paste in the following code.

```java
String endpoint = Configuration.getGlobalConfiguration().get("CONTENT_SAFETY_ENDPOINT");
String key = Configuration.getGlobalConfiguration().get("CONTENT_SAFETY_KEY");
BlocklistClient blocklistClient = new BlocklistClientBuilder()
        .credential(new KeyCredential(key))
        .endpoint(endpoint).buildClient();

String blocklistName = "<your_list_name>";

String removeBlockItemId = "<your_block_item_id>";

List<String> removeBlockItemIds = new ArrayList<>();
removeBlockItemIds.add(removeBlockItemId);
blocklistClient.removeBlocklistItems(blocklistName, new RemoveTextBlocklistItemsOptions(removeBlockItemIds));
```

1. Replace `<your_list_name>` with the name you used in the list creation step.
1. Replace `<your_block_item_id>` with the ID of a previously added item. 
1. Run the script.

#### [Python](#tab/python)

Create a new Python script and open it in your preferred editor or IDE. Paste in the following code.

```python
import os
from azure.ai.contentsafety import BlocklistClient
from azure.core.credentials import AzureKeyCredential
from azure.ai.contentsafety.models import (
    TextBlocklistItem,
    AddOrUpdateTextBlocklistItemsOptions,
    RemoveTextBlocklistItemsOptions,
)
from azure.core.exceptions import HttpResponseError

key = os.environ["CONTENT_SAFETY_KEY"]
endpoint = os.environ["CONTENT_SAFETY_ENDPOINT"]

# Create a Blocklist client
client = BlocklistClient(endpoint, AzureKeyCredential(key))

blocklist_name = "<your_list_name>"
blocklist_item_text_1 = "<block_item_text>"

try:
    # Add a blocklistItem
    add_result = client.add_or_update_blocklist_items(
        blocklist_name=blocklist_name,
        options=AddOrUpdateTextBlocklistItemsOptions(blocklist_items=[TextBlocklistItem(text=blocklist_item_text_1)]),
    )
    if not add_result or not add_result.blocklist_items or len(add_result.blocklist_items) <= 0:
        raise RuntimeError("BlocklistItem not created.")
    blocklist_item_id = add_result.blocklist_items[0].blocklist_item_id

    # Remove this blocklistItem by blocklistItemId
    client.remove_blocklist_items(
        blocklist_name=blocklist_name, options=RemoveTextBlocklistItemsOptions(blocklist_item_ids=[blocklist_item_id])
    )
    print(f"\nRemoved blocklistItem: {add_result.blocklist_items[0].blocklist_item_id}")
except HttpResponseError as e:
    print("\nRemove blocklist item failed: ")
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

#### [JavaScript](#tab/javascript)

```javascript
const ContentSafetyClient = require("@azure-rest/ai-content-safety").default,
  { isUnexpected } = require("@azure-rest/ai-content-safety");
const { AzureKeyCredential } = require("@azure/core-auth");

// Load the .env file if it exists
require("dotenv").config();

const endpoint = process.env["CONTENT_SAFETY_ENDPOINT"] || "<endpoint>";
const key = process.env["CONTENT_SAFETY_API_KEY"] || "<key>";

const credential = new AzureKeyCredential(key);
const client = ContentSafetyClient(endpoint, credential);

// Sample: Remove blocklistItems from a blocklist
async function removeBlocklistItems() {
  const blocklistName = "<your_list_name>";

  const blocklistItemId = "<your_block_item_id>";

  // Remove this blocklistItem by blocklistItemId
  const removeBlocklistItemsParameters = {
    body: {
      blocklistItemIds: [blocklistItemId],
    },
  };
  const removeBlocklistItem = await client
    .path("/text/blocklists/{blocklistName}:removeBlocklistItems", blocklistName)
    .post(removeBlocklistItemsParameters);

  if (isUnexpected(removeBlocklistItem)) {
    throw removeBlocklistItem;
  }

  console.log("Removed blocklistItem: ", blocklistItemText);
}


(async () => {
  await removeBlocklistItems();
})().catch((err) => {
  console.error("The sample encountered an error:", err);
});
```

1. Replace `<your_list_name>` with the name you used in the list creation step.
Replace `<your_block_item_id` with the ID of the item you want to remove.
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
BlocklistClient blocklistClient = new BlocklistClient(new Uri(endpoint), new AzureKeyCredential(key));

var blocklistName = "<your_list_name>";

var deleteResult = blocklistClient.DeleteTextBlocklist(blocklistName);
if (deleteResult != null && deleteResult.Status == 204)
{
    Console.WriteLine("\nDeleted blocklist.");
}
```

1. Replace `<your_list_name>` (in the request URL) with the name you used in the list creation step.
1. Run the script.

#### [Java](#tab/java)

Create a Java application and open it in your preferred editor or IDE. Paste in the following code.

```java
String endpoint = Configuration.getGlobalConfiguration().get("CONTENT_SAFETY_ENDPOINT");
String key = Configuration.getGlobalConfiguration().get("CONTENT_SAFETY_KEY");
BlocklistClient blocklistClient = new BlocklistClientBuilder()
        .credential(new KeyCredential(key))
        .endpoint(endpoint).buildClient();

String blocklistName = "<your_list_name>";

blocklistClient.deleteTextBlocklist(blocklistName);
```

1. Replace `<your_list_name>` (in the request URL) with the name you used in the list creation step.
1. Run the script.

#### [Python](#tab/python)

Create a new Python script and open it in your preferred editor or IDE. Paste in the following code.

```python
import os
from azure.ai.contentsafety import BlocklistClient
from azure.core.credentials import AzureKeyCredential
from azure.core.exceptions import HttpResponseError

key = os.environ["CONTENT_SAFETY_KEY"]
endpoint = os.environ["CONTENT_SAFETY_ENDPOINT"]

# Create a Blocklist client
client = BlocklistClient(endpoint, AzureKeyCredential(key))

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

#### [JavaScript](#tab/javascript)
```javascript
const ContentSafetyClient = require("@azure-rest/ai-content-safety").default,
  { isUnexpected } = require("@azure-rest/ai-content-safety");
const { AzureKeyCredential } = require("@azure/core-auth");

// Load the .env file if it exists
require("dotenv").config();

const endpoint = process.env["CONTENT_SAFETY_ENDPOINT"] || "<endpoint>";
const key = process.env["CONTENT_SAFETY_API_KEY"] || "<key>";

const credential = new AzureKeyCredential(key);
const client = ContentSafetyClient(endpoint, credential);

async function deleteBlocklist() {
  const blocklistName = "<your_list_name>";

  const result = await client.path("/text/blocklists/{blocklistName}", blocklistName).delete();

  if (isUnexpected(result)) {
    throw result;
  }

  console.log("Deleted blocklist: ", blocklistName);
}


(async () => {
  await deleteBlocklist();
})().catch((err) => {
  console.error("The sample encountered an error:", err);
});
```

1. Replace `<your_list_name>` (in the request URL) with the name you used in the list creation step.
1. Run the script.

---


## Next steps

See the API reference documentation to learn more about the APIs used in this guide.

* [Content Safety API reference](https://aka.ms/content-safety-api)
