---
title: Azure OpenAI Service content filtering
titleSuffix: Azure OpenAI
description: Learn about the content filtering capabilities of Azure OpenAI in Azure AI services
author: mrbullwinkle
ms.author: mbullwin
ms.service: azure-ai-openai
ms.topic: conceptual 
ms.date: 11/06/2023
ms.custom: template-concept
manager: nitinme
keywords: 
---

# Content filtering

> [!IMPORTANT]
> The content filtering system isn't applied to prompts and completions processed by the Whisper model in Azure OpenAI Service. Learn more about the [Whisper model in Azure OpenAI](models.md#whisper-preview).

Azure OpenAI Service includes a content filtering system that works alongside core models. This system works by running both the prompt and completion through an ensemble of classification models aimed at detecting and preventing the output of harmful content. The content filtering system detects and takes action on specific categories of potentially harmful content in both input prompts and output completions. Variations in API configurations and application design might affect completions and thus filtering behavior.

The content filtering models for the hate, sexual, violence, and self-harm categories have been specifically trained and tested on the following languages: English, German, Japanese, Spanish, French, Italian, Portuguese, and Chinese. However, the service can work in many other languages, but the quality might vary. In all cases, you should do your own testing to ensure that it works for your application.

In addition to the content filtering system, the Azure OpenAI Service performs monitoring to detect content and/or behaviors that suggest use of the service in a manner that might violate applicable product terms. For more information about understanding and mitigating risks associated with your application, see the [Transparency Note for Azure OpenAI](/legal/cognitive-services/openai/transparency-note?tabs=text). For more information about how data is processed in connection with content filtering and abuse monitoring, see [Data, privacy, and security for Azure OpenAI Service](/legal/cognitive-services/openai/data-privacy?context=/azure/ai-services/openai/context/context#preventing-abuse-and-harmful-content-generation).  

The following sections provide information about the content filtering categories, the filtering severity levels and their configurability, and API scenarios to be considered in application design and implementation. 

## Content filtering categories

The content filtering system integrated in the Azure OpenAI Service contains: 
* Neural multi-class classification models aimed at detecting and filtering harmful content; the models cover four categories (hate, sexual, violence, and self-harm) across four severity levels (safe, low, medium, and high). Content detected at the 'safe' severity level is labeled in annotations but isn't subject to filtering and isn't configurable.
* Additional optional classification models aimed at detecting jailbreak risk and known content for text and code; these models are binary classifiers that flag whether user or model behavior qualifies as a jailbreak attack or match to known text or source code. The use of these models is optional, but use of protected material code model may be required for Customer Copyright Commitment coverage.

## Harm categories

|Category|Description|
|--------|-----------|
| Hate and fairness   |Hate and fairness-related harms refer to any content that attacks or uses pejorative or discriminatory language with reference to a person or Identity groups on the basis of certain differentiating attributes of these groups including but not limited to race, ethnicity, nationality, gender identity groups and expression, sexual orientation, religion, immigration status, ability status, personal appearance and body size. </br></br> Fairness is concerned with ensuring that AI systems treat all groups of people equitably without contributing to existing societal inequities. Similar to hate speech, fairness-related harms hinge upon disparate treatment of Identity groups.    |
| Sexual | Sexual describes language related to anatomical organs and genitals, romantic relationships, acts portrayed in erotic or affectionate terms, pregnancy, physical sexual acts, including those portrayed as an assault or a forced sexual violent act against one’s will, prostitution, pornography and abuse.   |
| Violence | Violence describes language related to physical actions intended to hurt, injure, damage, or kill someone or something; describes weapons, guns and related entities, such as manufactures, associations, legislation, etc.    |
| Self-Harm | Self-harm describes language related to physical actions intended to purposely hurt, injure, damage one’s body or kill oneself.|
| Jailbreak risk | Jailbreak attacks are User Prompts designed to provoke the Generative AI model into exhibiting behaviors it was trained to avoid or to break the rules set in the System Message. Such attacks can vary from intricate role play to subtle subversion of the safety objective. |
| Protected Material for Text<sup>*</sup> | Protected material text describes known text content (for example, song lyrics, articles, recipes, and selected web content) that can be outputted by large language models.
| Protected Material for Code | Protected material code describes source code that matches a set of source code from public repositories, which can be outputted by large language models without proper citation of source repositories.

<sup>*</sup> If you are an owner of text material and want to submit text content for protection, please [file a request](https://aka.ms/protectedmaterialsform).

[!INCLUDE [severity-levels](../../content-safety/includes/severity-levels.md)]



## Configurability (preview)

The default content filtering configuration is set to filter at the medium severity threshold for all four content harm categories for both prompts and completions. That means that content that is detected at severity level medium or high is filtered, while content detected at severity level low isn't filtered by the content filters. The configurability feature is available in preview and allows customers to adjust the settings, separately for prompts and completions, to filter content for each content category at different severity levels as described in the table below:

| Severity filtered | Configurable for prompts | Configurable for completions | Descriptions |
|-------------------|--------------------------|------------------------------|--------------|
| Low, medium, high | Yes | Yes | Strictest filtering configuration. Content detected at severity levels low, medium and high is filtered.|
| Medium, high      | Yes | Yes | Default setting. Content detected at severity level low is not filtered, content at medium and high is filtered.|
| High              | Yes| Yes | Content detected at severity levels low and medium isn't filtered. Only content at severity level high is filtered.|
| No filters | If approved<sup>\*</sup>| If approved<sup>\*</sup>| No content is filtered regardless of severity level detected. Requires approval<sup>\*</sup>.|

<sup>\*</sup> Only customers who have been approved for modified content filtering have full content filtering control and can turn content filters partially or fully off. Apply for modified content filters using this form: [Azure OpenAI Limited Access Review: Modified Content Filtering (microsoft.com)](https://customervoice.microsoft.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR7en2Ais5pxKtso_Pz4b1_xUMlBQNkZMR0lFRldORTdVQzQ0TEI5Q1ExOSQlQCN0PWcu)

Customers are responsible for ensuring that applications integrating Azure OpenAI comply with the [Code of Conduct](/legal/cognitive-services/openai/code-of-conduct?context=%2Fazure%2Fai-services%2Fopenai%2Fcontext%2Fcontext). 

Content filtering configurations are created within a Resource in Azure AI Studio, and can be associated with Deployments. [Learn more about configurability here](../how-to/content-filters.md).  

## Scenario details

When the content filtering system detects harmful content, you'll receive either an error on the API call if the prompt was deemed inappropriate or the `finish_reason` on the response will be `content_filter` to signify that some of the completion was filtered. When building your application or system, you'll want to account for these scenarios where the content returned by the Completions API is filtered, which might result in content that is incomplete. How you act on this information will be application specific. The behavior can be summarized in the following points:

-	Prompts that are classified at a filtered category and severity level will return an HTTP 400 error.
-	Non-streaming completions calls won't return any content when the content is filtered. The `finish_reason` value will be set to content_filter. In rare cases with longer responses, a partial result can be returned. In these cases, the `finish_reason` will be updated.
-	For streaming completions calls, segments will be returned back to the user as they're completed. The service will continue streaming until either reaching a stop token, length, or when content that is classified at a filtered category and severity level is detected.  

### Scenario: You send a non-streaming completions call asking for multiple outputs; no content is classified at a filtered category and severity level

The table below outlines the various ways content filtering can appear:

 **HTTP response code** | **Response behavior** |
|------------------------|-------------------|
| 200 |   In the cases when all generation passes the filters as configured, no content moderation details are added to the response. The `finish_reason` for each generation will be either stop or length. |

**Example request payload:**

```json
{
    "prompt":"Text example", 
    "n": 3,
    "stream": false
}
```

**Example response JSON:**

```json
{
    "id": "example-id",
    "object": "text_completion",
    "created": 1653666286,
    "model": "davinci",
    "choices": [
        {
            "text": "Response generated text",
            "index": 0,
            "finish_reason": "stop",
            "logprobs": null
        }
    ]
}

```

### Scenario: Your API call asks for multiple responses (N>1) and at least one of the responses is filtered

| **HTTP Response Code** | **Response behavior**|
|------------------------|----------------------|
| 200 |The generations that were filtered will have a `finish_reason` value of `content_filter`.

**Example request payload:**

```json
{
    "prompt":"Text example",
    "n": 3,
    "stream": false
}
```

**Example response JSON:**

```json
{
    "id": "example",
    "object": "text_completion",
    "created": 1653666831,
    "model": "ada",
    "choices": [
        {
            "text": "returned text 1",
            "index": 0,
            "finish_reason": "length",
            "logprobs": null
        },
        {
            "text": "returned text 2",
            "index": 1,
            "finish_reason": "content_filter",
            "logprobs": null
        }
    ]
}
```

### Scenario: An inappropriate input prompt is sent to the completions API (either for streaming or non-streaming)

**HTTP Response Code** | **Response behavior**
|------------------------|----------------------|
|400 |The API call fails when the prompt triggers a content filter as configured. Modify the prompt and try again.|

**Example request payload:**

```json
{
    "prompt":"Content that triggered the filtering model"
}
```

**Example response JSON:**

```json
"error": {
    "message": "The response was filtered",
    "type": null,
    "param": "prompt",
    "code": "content_filter",
    "status": 400
}
```

### Scenario: You make a streaming completions call; no output content is classified at a filtered category and severity level

**HTTP Response Code** | **Response behavior**
|------------|------------------------|----------------------|
|200|In this case, the call will stream back with the full generation and `finish_reason` will be either 'length' or 'stop' for each generated response.|

**Example request payload:**

```json
{
    "prompt":"Text example",
    "n": 3,
    "stream": true
}
```

**Example response JSON:**

```json
{
    "id": "cmpl-example",
    "object": "text_completion",
    "created": 1653670914,
    "model": "ada",
    "choices": [
        {
            "text": "last part of generation",
            "index": 2,
            "finish_reason": "stop",
            "logprobs": null
        }
    ]
}
```

### Scenario: You make a streaming completions call asking for multiple completions and at least a portion of the output content is filtered

**HTTP Response Code** | **Response behavior**
|------------|------------------------|----------------------|
| 200 | For a given generation index, the last chunk of the generation includes a non-null `finish_reason` value. The value is `content_filter` when the generation was filtered.|

**Example request payload:**

```json
{
    "prompt":"Text example",
    "n": 3,
    "stream": true
}
```

**Example response JSON:**

```json
 {
    "id": "cmpl-example",
    "object": "text_completion",
    "created": 1653670515,
    "model": "ada",
    "choices": [
        {
            "text": "Last part of generated text streamed back",
            "index": 2,
            "finish_reason": "content_filter",
            "logprobs": null
        }
    ]
}
```

### Scenario: Content filtering system doesn't run on the completion

**HTTP Response Code** | **Response behavior**
|------------------------|----------------------|
| 200 | If the content filtering system is down or otherwise unable to complete the operation in time, your request will still complete without content filtering. You can determine that the filtering wasn't applied by looking for an error message in the `content_filter_result` object.|

**Example request payload:**

```json
{
    "prompt":"Text example",
    "n": 1,
    "stream": false
}
```

**Example response JSON:**

```json
{
    "id": "cmpl-example",
    "object": "text_completion",
    "created": 1652294703,
    "model": "ada",
    "choices": [
        {
            "text": "generated text",
            "index": 0,
            "finish_reason": "length",
            "logprobs": null,
            "content_filter_result": {
                "error": {
                    "code": "content_filter_error",
                    "message": "The contents are not filtered"
                }
            }
        }
    ]
}
```

## Annotations (preview)

### Main content filters
When annotations are enabled as shown in the code snippet below, the following information is returned via the API for the main categories (hate and fairness, sexual, violence, and self-harm): 
- content filtering category (hate, sexual, violence, self_harm)
- the severity level (safe, low, medium or high) within each content category
- filtering status (true or false).

### Optional models

Optional models can be enabled in annotate (returns information when content was flagged, but not filtered) or filter mode (returns information when content was flagged and filtered).  

When annotations are enabled as shown in the code snippet below, the following information is returned by the API for optional models jailbreak risk, protected material text and protected material code:
- category (jailbreak, protected_material_text, protected_material_code),
- detected (true or false),
- filtered (true or false).

For the protected material code model, the following additional information is returned by the API:
- an example citation of a public GitHub repository where a code snippet was found
- the license of the repository.

When displaying code in your application, we strongly recommend that the application also displays the example citation from the annotations. Compliance with the cited license may also be required for Customer Copyright Commitment coverage.

Annotations are currently in preview for Completions and Chat Completions (GPT models); the following code snippet shows how to use annotations in preview:

# [OpenAI Python 0.28.1](#tab/python)

```python
# os.getenv() for the endpoint and key assumes that you are using environment variables.

import os
import openai
openai.api_type = "azure"
openai.api_base = os.getenv("AZURE_OPENAI_ENDPOINT") 
openai.api_version = "2023-06-01-preview" # API version required to test out Annotations preview
openai.api_key = os.getenv("AZURE_OPENAI_KEY")

response = openai.Completion.create(
    engine="gpt-35-turbo", # engine = "deployment_name".
    messages=[{"role": "system", "content": "You are a helpful assistant."}, {"role": "user", "content": "Example prompt that leads to a protected code completion that was detected, but not filtered"}]     # Content that is detected at severity level medium or high is filtered, 
    # while content detected at severity level low isn't filtered by the content filters.
)

print(response)

```

### Output

```json
{ 
  "choices": [ 
    { 
      "content_filter_results": { 
        "custom_blocklists": [], 
        "hate": { 
          "filtered": false, 
          "severity": "safe" 
        }, 
        "protected_material_code": { 
          "citation": { 
            "URL": " https://github.com/username/repository-name/path/to/file-example.txt", 
            "license": "EXAMPLE-LICENSE" 
          }, 
          "detected": true,
          "filtered": false 
        }, 
        "protected_material_text": { 
          "detected": false, 
          "filtered": false 
        }, 
        "self_harm": { 
          "filtered": false, 
          "severity": "safe" 
        }, 
        "sexual": { 
          "filtered": false, 
          "severity": "safe" 
        }, 
        "violence": { 
          "filtered": false, 
          "severity": "safe" 
        } 
      }, 
      "finish_reason": "stop", 
      "index": 0, 
      "message": { 
        "content": "Example model response will be returned ", 
        "role": "assistant" 
      } 
    } 
  ], 
  "created": 1699386280, 
  "id": "chatcmpl-8IMI4HzcmcK6I77vpOJCPt0Vcf8zJ", 
  "model": "gpt-35-turbo", 
  "object": "chat.completion", 
  "prompt_filter_results": [ 
    { 
      "content_filter_results": { 
        "custom_blocklists": [], 
        "hate": { 
          "filtered": false, 
          "severity": "safe" 
        }, 
        "jailbreak": { 
          "detected": false, 
          "filtered": false 
        }, 
        "profanity": { 
          "detected": false, 
          "filtered": false 
        }, 
        "self_harm": { 
          "filtered": false, 
          "severity": "safe" 
        }, 
        "sexual": { 
          "filtered": false, 
          "severity": "safe" 
        }, 
        "violence": { 
          "filtered": false, 
          "severity": "safe" 
        } 
      }, 
      "prompt_index": 0 
    } 
  ], 
  "usage": { 
    "completion_tokens": 40, 
    "prompt_tokens": 11, 
    "total_tokens": 417 
  } 
} 
```

The following code snippet shows how to retrieve annotations when content was filtered:

```python
# os.getenv() for the endpoint and key assumes that you are using environment variables.

import os
import openai
openai.api_type = "azure"
openai.api_base = os.getenv("AZURE_OPENAI_ENDPOINT") 
openai.api_version = "2023-06-01-preview" # API version required to test out Annotations preview
openai.api_key = os.getenv("AZURE_OPENAI_KEY")

try:
    response = openai.Completion.create(
        prompt="<PROMPT>",
        engine="<MODEL_DEPLOYMENT_NAME>",
    )
    print(response)

except openai.error.InvalidRequestError as e:
    if e.error.code == "content_filter" and e.error.innererror:
        content_filter_result = e.error.innererror.content_filter_result
        # print the formatted JSON
        print(content_filter_result)

        # or access the individual categories and details
        for category, details in content_filter_result.items():
            print(f"{category}:\n filtered={details['filtered']}\n severity={details['severity']}")

```

# [OpenAI Python 1.x](#tab/python-new)

```python
# os.getenv() for the endpoint and key assumes that you are using environment variables.

import os
from openai import AzureOpenAI
client = AzureOpenAI(
    api_key=os.getenv("AZURE_OPENAI_KEY"),  
    api_version="2023-10-01-preview",
    azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT") 
    )

response = client.completions.create(
    model="gpt-35-turbo-instruct", # model = "deployment_name".
    prompt="{Example prompt where a severity level of low is detected}" 
    # Content that is detected at severity level medium or high is filtered, 
    # while content detected at severity level low isn't filtered by the content filters.
)

print(response.model_dump_json(indent=2))
```

# [JavaScript](#tab/javascrit)

[Azure OpenAI JavaScript SDK source code & samples](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/openai/openai)

```javascript

import { OpenAIClient, AzureKeyCredential } from "@azure/openai";

// Load the .env file if it exists
import * as dotenv from "dotenv";
dotenv.config();

// You will need to set these environment variables or edit the following values
const endpoint = process.env["ENDPOINT"] || "<endpoint>";
const azureApiKey = process.env["AZURE_API_KEY"] || "<api key>";

const messages = [
  { role: "system", content: "You are a helpful assistant. You will talk like a pirate." },
  { role: "user", content: "Can you help me?" },
  { role: "assistant", content: "Arrrr! Of course, me hearty! What can I do for ye?" },
  { role: "user", content: "What's the best way to train a parrot?" },
];

export async function main() {
  console.log("== Get completions Sample ==");

  const client = new OpenAIClient(endpoint, new AzureKeyCredential(azureApiKey));
  const deploymentId = "gpt-35-turbo"; //This needs to correspond to the name you chose when you deployed the model. 
  const events = await client.listChatCompletions(deploymentId, messages, { maxTokens: 128 });

  for await (const event of events) {
    for (const choice of event.choices) {
      console.log(choice.message);
      if (!choice.contentFilterResults) {
        console.log("No content filter is found");
        return;
      }
      if (choice.contentFilterResults.error) {
        console.log(
          `Content filter ran into the error ${choice.contentFilterResults.error.code}: ${choice.contentFilterResults.error.message}`
        );
      } else {
        const { hate, sexual, selfHarm, violence } = choice.contentFilterResults;
        console.log(
          `Hate category is filtered: ${hate?.filtered} with ${hate?.severity} severity`
        );
        console.log(
          `Sexual category is filtered: ${sexual?.filtered} with ${sexual?.severity} severity`
        );
        console.log(
          `Self-harm category is filtered: ${selfHarm?.filtered} with ${selfHarm?.severity} severity`
        );
        console.log(
          `Violence category is filtered: ${violence?.filtered} with ${violence?.severity} severity`
        );
      }
    }
  }
}

main().catch((err) => {
  console.error("The sample encountered an error:", err);
});
```

# [PowerShell](#tab/powershell)

```powershell-interactive
# Env: for the endpoint and key assumes that you are using environment variables.
$openai = @{
    api_key     = $Env:AZURE_OPENAI_KEY
    api_base    = $Env:AZURE_OPENAI_ENDPOINT # your endpoint should look like the following https://YOUR_RESOURCE_NAME.openai.azure.com/
    api_version = '2023-10-01-preview' # this may change in the future
    name        = 'YOUR-DEPLOYMENT-NAME-HERE' #This will correspond to the custom name you chose for your deployment when you deployed a model.
}

$prompt = 'Example prompt where a severity level of low is detected'
    # Content that is detected at severity level medium or high is filtered, 
    # while content detected at severity level low isn't filtered by the content filters.

$headers = [ordered]@{
    'api-key' = $openai.api_key
}

$body = [ordered]@{
    prompt    = $prompt
    model      = $openai.name
} | ConvertTo-Json

# Send a completion call to generate an answer
$url = "$($openai.api_base)/openai/deployments/$($openai.name)/completions?api-version=$($openai.api_version)"

$response = Invoke-RestMethod -Uri $url -Headers $headers -Body $body -Method Post -ContentType 'application/json'
return $response.prompt_filter_results.content_filter_results | format-list
```

The `$response` object contains a property named `prompt_filter_results` that contains annotations
about the filter results. If you prefer JSON to a .NET object, pipe the output to `ConvertTo-JSON`
instead of `Format-List`.

```output
hate      : @{filtered=False; severity=safe}
self_harm : @{filtered=False; severity=safe}
sexual    : @{filtered=False; severity=safe}
violence  : @{filtered=False; severity=safe}
```

---

For details on the inference REST API endpoints for Azure OpenAI and how to create Chat and Completions please follow [Azure OpenAI Service REST API reference guidance](../reference.md). Annotations are returned for all scenarios when using `2023-06-01-preview`.

### Example scenario: An input prompt containing content that is classified at a filtered category and severity level is sent to the completions API

```json
{
    "error": {
        "message": "The response was filtered due to the prompt triggering Azure Content management policy. 
                   Please modify your prompt and retry. To learn more about our content filtering policies
                   please read our documentation: https://go.microsoft.com/fwlink/?linkid=21298766",
        "type": null,
        "param": "prompt",
        "code": "content_filter",
        "status": 400,
        "innererror": {
            "code": "ResponsibleAIPolicyViolation",
            "content_filter_result": {
                "hate": {
                    "filtered": true,
                    "severity": "high"
                },
                "self-harm": {
                    "filtered": true,
                    "severity": "high"
                },
                "sexual": {
                    "filtered": false,
                    "severity": "safe"
                },
                "violence": {
                    "filtered":true,
                    "severity": "medium"
                }
            }
        }
    }
}
```

## Streaming

Azure OpenAI Service includes a content filtering system that works alongside core models. The following section describes the AOAI streaming experience and options in the context of content filters. 

### Default

The content filtering system is integrated and enabled by default for all customers. In the default streaming scenario, completion content is buffered, the content filtering system runs on the buffered content, and – depending on content filtering configuration – content is either returned to the user if it does not violate the content filtering policy (Microsoft default or custom user configuration), or it’s immediately blocked which returns a content filtering error, without returning harmful completion content. This process is repeated until the end of the stream. Content was fully vetted according to the content filtering policy before returned to the user. Content is not returned token-by-token in this case, but in “content chunks” of the respective buffer size. 

### Asynchronous modified filter

Customers who have been approved for modified content filters can choose Asynchronous Modified Filter as an additional option, providing a new streaming experience. In this case, content filters are run asynchronously, completion content is returned immediately with a smooth token-by-token streaming experience. No content is buffered, the content filters run asynchronously, which allows for zero latency in this context.  

> [!NOTE]
> Customers must be aware that while the feature improves latency, it can bring a trade-off in terms of the safety and real-time vetting of smaller sections of model output. Because content filters are run asynchronously, content moderation messages and the content filtering signal in case of a policy violation are delayed, which means some sections of harmful content that would otherwise have been filtered immediately could be displayed to the user. 
 
**Annotations**: Annotations and content moderation messages are continuously returned during the stream. We strongly recommend to consume annotations and implement additional AI content safety mechanisms, such as redacting content or returning additional safety information to the user. 

**Content filtering signal**: The content filtering error signal is delayed; in case of a policy violation, it’s returned as soon as it’s available, and the stream is stopped. The content filtering signal is guaranteed within ~1,000-character windows in case of a policy violation. 

Approval for Modified Content Filtering is required for access to Streaming – Asynchronous Modified Filter. The application can be found [here](https://customervoice.microsoft.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR7en2Ais5pxKtso_Pz4b1_xURE01NDY1OUhBRzQ3MkQxMUhZSE1ZUlJKTiQlQCN0PWcu). To enable it via Azure OpenAI Studio please follow the instructions [here](/azure/ai-services/openai/how-to/content-filters) to create a new content filtering configuration, and select “Asynchronous Modified Filter” in the Streaming section, as shown in the below screenshot. 

### Overview

| Category | Streaming - Default | Streaming - Asynchronous Modified Filter |
|---|---|---|
|Status |GA |Public Preview |
| Access | Enabled by default, no action needed |Customers approved for Modified Content Filtering can configure directly via Azure OpenAI Studio (as part of a content filtering configuration; applied on deployment-level) |
| Eligibility |All customers |Customers approved for Modified Content Filtering |
|Modality and Availability |Text; all GPT-models |Text; all GPT-models except gpt-4-vision |
|Streaming experience |Content is buffered and returned in chunks |Zero latency (no buffering, filters run asynchronously) |
|Content filtering signal |Immediate filtering signal |Delayed filtering signal (in up to ~1,000 char increments) |
|Content filtering configurations |Supports default and any customer-defined filter setting (including optional models) |Supports default and any customer-defined filter setting (including optional models) | 

### Annotations and sample response stream

#### Prompt annotation message

This is the same as default annotations.

```json
data: { 
    "id": "", 
    "object": "", 
    "created": 0, 
    "model": "", 
    "prompt_filter_results": [ 
        { 
            "prompt_index": 0, 
            "content_filter_results": { ... } 
        } 
    ], 
    "choices": [], 
    "usage": null 
} 
```

#### Completion token message

Completion messages are forwarded immediately. No moderation is performed first, and no annotations are provided initially. 

```json
data: { 
    "id": "chatcmpl-7rAJvsS1QQCDuZYDDdQuMJVMV3x3N", 
    "object": "chat.completion.chunk", 
    "created": 1692905411, 
    "model": "gpt-35-turbo", 
    "choices": [ 
        { 
            "index": 0, 
            "finish_reason": null, 
            "delta": { 
                "content": "Color" 
            } 
        } 
    ], 
    "usage": null 
} 
```

#### Annotation message

The text field will always be an empty string, indicating no new tokens. Annotations will only be relevant to already-sent tokens. There may be multiple Annotation Messages referring to the same tokens.  

“start_offset” and “end_offset” are low-granularity offsets in text (with 0 at beginning of prompt) which the annotation is relevant to. 

“check_offset” represents how much text has been fully moderated. It is an exclusive lower bound on the end_offsets of future annotations. It is nondecreasing. 

```json
data: { 
    "id": "", 
    "object": "", 
    "created": 0, 
    "model": "", 
    "choices": [ 
        { 
            "index": 0, 
            "finish_reason": null, 
            "content_filter_results": { ... }, 
            "content_filter_raw": [ ... ], 
            "content_filter_offsets": { 
                "check_offset": 44, 
                "start_offset": 44, 
                "end_offset": 198 
            } 
        } 
    ], 
    "usage": null 
} 
```


### Sample response stream

Below is a real chat completion response using  Asynchronous Modified Filter. Note how prompt annotations are not changed; completion tokens are sent without annotations; and new annotation messages are sent without tokens, instead associated with certain content filter offsets. 

`{"temperature": 0, "frequency_penalty": 0, "presence_penalty": 1.0, "top_p": 1.0, "max_tokens": 800, "messages": [{"role": "user", "content": "What is color?"}], "stream": true}`

```
data: {"id":"","object":"","created":0,"model":"","prompt_annotations":[{"prompt_index":0,"content_filter_results":{"hate":{"filtered":false,"severity":"safe"},"self_harm":{"filtered":false,"severity":"safe"},"sexual":{"filtered":false,"severity":"safe"},"violence":{"filtered":false,"severity":"safe"}}}],"choices":[],"usage":null} 

data: {"id":"chatcmpl-7rCNsVeZy0PGnX3H6jK8STps5nZUY","object":"chat.completion.chunk","created":1692913344,"model":"gpt-35-turbo","choices":[{"index":0,"finish_reason":null,"delta":{"role":"assistant"}}],"usage":null} 

data: {"id":"chatcmpl-7rCNsVeZy0PGnX3H6jK8STps5nZUY","object":"chat.completion.chunk","created":1692913344,"model":"gpt-35-turbo","choices":[{"index":0,"finish_reason":null,"delta":{"content":"Color"}}],"usage":null} 

data: {"id":"chatcmpl-7rCNsVeZy0PGnX3H6jK8STps5nZUY","object":"chat.completion.chunk","created":1692913344,"model":"gpt-35-turbo","choices":[{"index":0,"finish_reason":null,"delta":{"content":" is"}}],"usage":null} 

data: {"id":"chatcmpl-7rCNsVeZy0PGnX3H6jK8STps5nZUY","object":"chat.completion.chunk","created":1692913344,"model":"gpt-35-turbo","choices":[{"index":0,"finish_reason":null,"delta":{"content":" a"}}],"usage":null} 

... 

data: {"id":"","object":"","created":0,"model":"","choices":[{"index":0,"finish_reason":null,"content_filter_results":{"hate":{"filtered":false,"severity":"safe"},"self_harm":{"filtered":false,"severity":"safe"},"sexual":{"filtered":false,"severity":"safe"},"violence":{"filtered":false,"severity":"safe"}},"content_filter_offsets":{"check_offset":44,"start_offset":44,"end_offset":198}}],"usage":null} 

... 

data: {"id":"chatcmpl-7rCNsVeZy0PGnX3H6jK8STps5nZUY","object":"chat.completion.chunk","created":1692913344,"model":"gpt-35-turbo","choices":[{"index":0,"finish_reason":"stop","delta":{}}],"usage":null} 

data: {"id":"","object":"","created":0,"model":"","choices":[{"index":0,"finish_reason":null,"content_filter_results":{"hate":{"filtered":false,"severity":"safe"},"self_harm":{"filtered":false,"severity":"safe"},"sexual":{"filtered":false,"severity":"safe"},"violence":{"filtered":false,"severity":"safe"}},"content_filter_offsets":{"check_offset":506,"start_offset":44,"end_offset":571}}],"usage":null} 

data: [DONE] 
```

### Sample response stream (blocking)

`{"temperature": 0, "frequency_penalty": 0, "presence_penalty": 1.0, "top_p": 1.0, "max_tokens": 800, "messages": [{"role": "user", "content": "Tell me the lyrics to \"Hey Jude\"."}], "stream": true}`

```
data: {"id":"","object":"","created":0,"model":"","prompt_filter_results":[{"prompt_index":0,"content_filter_results":{"hate":{"filtered":false,"severity":"safe"},"self_harm":{"filtered":false,"severity":"safe"},"sexual":{"filtered":false,"severity":"safe"},"violence":{"filtered":false,"severity":"safe"}}}],"choices":[],"usage":null} 

data: {"id":"chatcmpl-8JCbt5d4luUIhYCI7YH4dQK7hnHx2","object":"chat.completion.chunk","created":1699587397,"model":"gpt-35-turbo","choices":[{"index":0,"finish_reason":null,"delta":{"role":"assistant"}}],"usage":null} 

data: {"id":"chatcmpl-8JCbt5d4luUIhYCI7YH4dQK7hnHx2","object":"chat.completion.chunk","created":1699587397,"model":"gpt-35-turbo","choices":[{"index":0,"finish_reason":null,"delta":{"content":"Hey"}}],"usage":null} 

data: {"id":"chatcmpl-8JCbt5d4luUIhYCI7YH4dQK7hnHx2","object":"chat.completion.chunk","created":1699587397,"model":"gpt-35-turbo","choices":[{"index":0,"finish_reason":null,"delta":{"content":" Jude"}}],"usage":null} 

data: {"id":"chatcmpl-8JCbt5d4luUIhYCI7YH4dQK7hnHx2","object":"chat.completion.chunk","created":1699587397,"model":"gpt-35-turbo","choices":[{"index":0,"finish_reason":null,"delta":{"content":","}}],"usage":null} 

... 

data: {"id":"chatcmpl-8JCbt5d4luUIhYCI7YH4dQK7hnHx2","object":"chat.completion.chunk","created":1699587397,"model":"gpt-35- 

turbo","choices":[{"index":0,"finish_reason":null,"delta":{"content":" better"}}],"usage":null} 

data: {"id":"","object":"","created":0,"model":"","choices":[{"index":0,"finish_reason":null,"content_filter_results":{"hate":{"filtered":false,"severity":"safe"},"self_harm":{"filtered":false,"severity":"safe"},"sexual":{"filtered":false,"severity":"safe"},"violence":{"filtered":false,"severity":"safe"}},"content_filter_offsets":{"check_offset":65,"start_offset":65,"end_offset":1056}}],"usage":null} 

data: {"id":"","object":"","created":0,"model":"","choices":[{"index":0,"finish_reason":"content_filter","content_filter_results":{"protected_material_text":{"detected":true,"filtered":true}},"content_filter_offsets":{"check_offset":65,"start_offset":65,"end_offset":1056}}],"usage":null} 

data: [DONE] 
```
## Best practices

As part of your application design, consider the following best practices to deliver a positive experience with your application while minimizing potential harms:

- Decide how you want to handle scenarios where your users send prompts containing content that is classified at a filtered category and severity level or otherwise misuse your application.
- Check the `finish_reason` to see if a completion is filtered.
- Check that there's no error object in the `content_filter_result` (indicating that content filters didn't run).
- If you're using the protected material code model in annotate mode, display the citation URL when you're displaying the code in your application.

## Next steps

- Learn more about the [underlying models that power Azure OpenAI](../concepts/models.md).
- Apply for modified content filters via [this form](https://customervoice.microsoft.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR7en2Ais5pxKtso_Pz4b1_xUMlBQNkZMR0lFRldORTdVQzQ0TEI5Q1ExOSQlQCN0PWcu).
- Azure OpenAI content filtering is powered by [Azure AI Content Safety](https://azure.microsoft.com/products/cognitive-services/ai-content-safety).
- Learn more about understanding and mitigating risks associated with your application: [Overview of Responsible AI practices for Azure OpenAI models](/legal/cognitive-services/openai/overview?context=/azure/ai-services/openai/context/context).
- Learn more about how data is processed in connection with content filtering and abuse monitoring: [Data, privacy, and security for Azure OpenAI Service](/legal/cognitive-services/openai/data-privacy?context=/azure/ai-services/openai/context/context#preventing-abuse-and-harmful-content-generation).
