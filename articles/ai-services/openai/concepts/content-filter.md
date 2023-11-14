---
title: Azure OpenAI Service content filtering
titleSuffix: Azure OpenAI
description: Learn about the content filtering capabilities of Azure OpenAI in Azure AI services
author: mrbullwinkle
ms.author: mbullwin
ms.service: azure-ai-openai
ms.topic: conceptual 
ms.date: 09/15/2023
ms.custom: template-concept
manager: nitinme
keywords: 
---

# Content filtering

> [!IMPORTANT]
> The content filtering system isn't applied to prompts and completions processed by the Whisper model in Azure OpenAI Service. Learn more about the [Whisper model in Azure OpenAI](models.md#whisper-preview).

Azure OpenAI Service includes a content filtering system that works alongside core models. This system works by running both the prompt and completion through an ensemble of classification models aimed at detecting and preventing the output of harmful content. The content filtering system detects and takes action on specific categories of potentially harmful content in both input prompts and output completions. Variations in API configurations and application design might affect completions and thus filtering behavior.

The content filtering models have been specifically trained and tested on the following languages: English, German, Japanese, Spanish, French, Italian, Portuguese, and Chinese. However, the service can work in many other languages, but the quality might vary. In all cases, you should do your own testing to ensure that it works for your application.

In addition to the content filtering system, the Azure OpenAI Service performs monitoring to detect content and/or behaviors that suggest use of the service in a manner that might violate applicable product terms. For more information about understanding and mitigating risks associated with your application, see the [Transparency Note for Azure OpenAI](/legal/cognitive-services/openai/transparency-note?tabs=text). For more information about how data is processed in connection with content filtering and abuse monitoring, see [Data, privacy, and security for Azure OpenAI Service](/legal/cognitive-services/openai/data-privacy?context=/azure/ai-services/openai/context/context#preventing-abuse-and-harmful-content-generation).  

The following sections provide information about the content filtering categories, the filtering severity levels and their configurability, and API scenarios to be considered in application design and implementation. 

## Content filtering categories

The content filtering system integrated in the Azure OpenAI Service contains neural multi-class classification models aimed at detecting and filtering harmful content; the models cover four categories (hate, sexual, violence, and self-harm) across four severity levels (safe, low, medium, and high). Content detected at the 'safe' severity level is labeled in annotations but isn't subject to filtering and isn't configurable.

### Categories

|Category|Description|
|--------|-----------|
| Hate   |The hate category describes language attacks or uses that include pejorative or discriminatory language with reference to a person or identity group on the basis of certain differentiating attributes of these groups including but not limited to race, ethnicity, nationality, gender identity and expression, sexual orientation, religion, immigration status, ability status, personal appearance, and body size. |
| Sexual | The sexual category describes language related to anatomical organs and genitals, romantic relationships, acts portrayed in erotic or affectionate terms, physical sexual acts, including those portrayed as an assault or a forced sexual violent act against one’s will, prostitution, pornography, and abuse. |
| Violence | The violence category describes language related to physical actions intended to hurt, injure, damage, or kill someone or something; describes weapons, etc.   |
| Self-Harm | The self-harm category describes language related to physical actions intended to purposely hurt, injure, or damage one’s body, or kill oneself.|

### Severity levels

|Category|Description|
|--------|-----------|
|Safe    | Content might be related to violence, self-harm, sexual, or hate categories but the terms are used in general, journalistic, scientific, medical, and similar professional contexts, which are appropriate for most audiences. |
|Low | Content that expresses prejudiced, judgmental, or opinionated views, includes offensive use of language, stereotyping, use cases exploring a fictional world (for example, gaming, literature) and depictions at low intensity.|
| Medium | Content that uses offensive, insulting, mocking, intimidating, or demeaning language towards specific identity groups, includes depictions of seeking and executing harmful instructions, fantasies, glorification, promotion of harm at medium intensity. |
|High | Content that displays explicit and severe harmful instructions, actions, damage, or abuse; includes endorsement, glorification, or promotion of severe harmful acts, extreme or illegal forms of harm, radicalization, or non-consensual power exchange or abuse.|

## Configurability (preview)

The default content filtering configuration is set to filter at the medium severity threshold for all four content harm categories for both prompts and completions. That means that content that is detected at severity level medium or high is filtered, while content detected at severity level low isn't filtered by the content filters. The configurability feature is available in preview and allows customers to adjust the settings, separately for prompts and completions, to filter content for each content category at different severity levels as described in the table below:

| Severity filtered | Configurable for prompts | Configurable for completions | Descriptions |
|-------------------|--------------------------|------------------------------|--------------|
| Low, medium, high | Yes | Yes | Strictest filtering configuration. Content detected at severity levels low, medium and high is filtered.|
| Medium, high      | Yes | Yes | Default setting. Content detected at severity level low is not filtered, content at medium and high is filtered.|
| High              | If approved<sup>\*</sup>| If approved<sup>\*</sup> | Content detected at severity levels low and medium isn't filtered. Only content at severity level high is filtered. Requires approval<sup>\*</sup>.|
| No filters | If approved<sup>\*</sup>| If approved<sup>\*</sup>| No content is filtered regardless of severity level detected. Requires approval<sup>\*</sup>.|

<sup>\*</sup> Only customers who have been approved for modified content filtering  have full content filtering control, including configuring content filters at severity level high only or turning content filters off. Apply for modified content filters via this form: [Azure OpenAI Limited Access Review: Modified Content Filters and Abuse Monitoring (microsoft.com)](https://customervoice.microsoft.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR7en2Ais5pxKtso_Pz4b1_xURE01NDY1OUhBRzQ3MkQxMUhZSE1ZUlJKTiQlQCN0PWcu)

Content filtering configurations are created within a Resource in Azure AI Studio, and can be associated with Deployments. [Learn more about configurability here](../how-to/content-filters.md).  

   :::image type="content" source="../media/content-filters/configuration.png" alt-text="Screenshot of the content filter configuration UI" lightbox="../media/content-filters/configuration.png":::

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

### Scenario: Your API call asks for multiple responses (N>1) and at least 1 of the responses is filtered

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
|400 |The API call will fail when the prompt triggers a content filter as configured. Modify the prompt and try again.|

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
| 200 | For a given generation index, the last chunk of the generation will include a non-null `finish_reason` value. The value will be `content_filter` when the generation was filtered.|

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

When annotations are enabled as shown in the code snippet below, the following information is returned via the API: content filtering category (hate, sexual, violence, self-harm); within each content filtering category, the severity level (safe, low, medium or high); filtering status (true or false).

Annotations are currently in preview for Completions and Chat Completions (GPT models); the following code snippet shows how to use annotations in preview:

# [Python](#tab/python)


```python
# Note: The openai-python library support for Azure OpenAI is in preview.
# os.getenv() for the endpoint and key assumes that you are using environment variables.

import os
import openai
openai.api_type = "azure"
openai.api_base = os.getenv("AZURE_OPENAI_ENDPOINT") 
openai.api_version = "2023-06-01-preview" # API version required to test out Annotations preview
openai.api_key = os.getenv("AZURE_OPENAI_KEY")

response = openai.Completion.create(
    engine="text-davinci-003", # engine = "deployment_name".
    prompt="{Example prompt where a severity level of low is detected}" 
    # Content that is detected at severity level medium or high is filtered, 
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
        "hate": {
          "filtered": false,
          "severity": "safe"
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
          "severity": "low"
        }
      },
      "finish_reason": "length",
      "index": 0,
      "logprobs": null,
      "text": {"\")(\"Example model response will be returned\").}"
    }
  ],
  "created": 1685727831,
  "id": "cmpl-7N36VZAVBMJtxycrmiHZ12aK76a6v",
  "model": "text-davinci-003",
  "object": "text_completion",
  "prompt_annotations": [
    {
      "content_filter_results": {
        "hate": {
          "filtered": false,
          "severity": "safe"
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
    "completion_tokens": 16,
    "prompt_tokens": 5,
    "total_tokens": 21
  }
}
```

The following code snippet shows how to retrieve annotations when content was filtered:

```python
# Note: The openai-python library support for Azure OpenAI is in preview.
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

## Best practices

As part of your application design, consider the following best practices to deliver a positive experience with your application while minimizing potential harms:

- Decide how you want to handle scenarios where your users send prompts containing content that is classified at a filtered category and severity level or otherwise misuse your application.
- Check the `finish_reason` to see if a completion is filtered.
- Check that there's no error object in the `content_filter_result` (indicating that content filters didn't run).

## Next steps

- Learn more about the [underlying models that power Azure OpenAI](../concepts/models.md).
- Apply for modified content filters via [this form](https://customervoice.microsoft.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR7en2Ais5pxKtso_Pz4b1_xURE01NDY1OUhBRzQ3MkQxMUhZSE1ZUlJKTiQlQCN0PWcu).
- Azure OpenAI content filtering is powered by [Azure AI Content Safety](https://azure.microsoft.com/products/cognitive-services/ai-content-safety).
- Learn more about understanding and mitigating risks associated with your application: [Overview of Responsible AI practices for Azure OpenAI models](/legal/cognitive-services/openai/overview?context=/azure/ai-services/openai/context/context).
- Learn more about how data is processed in connection with content filtering and abuse monitoring: [Data, privacy, and security for Azure OpenAI Service](/legal/cognitive-services/openai/data-privacy?context=/azure/ai-services/openai/context/context#preventing-abuse-and-harmful-content-generation).
