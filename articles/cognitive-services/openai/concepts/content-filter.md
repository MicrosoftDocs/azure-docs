---
title: Azure OpenAI content filtering
titleSuffix: Azure OpenAI
description: Learn about the content filtering capabilities of the OpenAI service in Azure Cognitive Services
author: chrishMSFT
ms.author: chrhoder
ms.service: cognitive-services
ms.topic: conceptual 
ms.date: 06/30/2022
ms.custom: template-concept #Required; leave this attribute/value as-is.
manager: nitinme
keywords: 
---

# Content filtering

Azure OpenAI Service includes a content management system that works alongside core models to filter content. This system works by running both the input prompt and generated content through an ensemble of classification models aimed at detecting misuse. If the system identifies harmful content, you'll receive either an error on the API call if the prompt was deemed inappropriate or the finish_reason on the response will be `content_filter` to signify that some of the generation was filtered.

You can generate content with the completions API using many different configurations that will alter the filtering behavior you should expect. The following section aims to enumerate all of these scenarios for you to appropriately design your solution.

To ensure you have properly mitigated risks in your application, you should evaluate all potential harms carefully, follow guidance in the [Transparency Note](https://go.microsoft.com/fwlink/?linkid=2200003) and add scenario-specific mitigation as needed.

## Scenario details

When building your application, you'll want to account for scenarios where the content returned by the Completions API is filtered and content may not be complete. How you act on this information will be application specific. The behavior can be summarized in the following key points:
- Prompts that are deemed inappropriate will return an HTTP 400 error
- Non-streaming completions calls won't return any content when the content is filtered. The `finish_reason` value will be set to `content_filter`. In rare cases with long responses, a partial result can be returned. In these cases,  the `finish_reason` will be updated.
- For streaming completions calls, segments will be returned back to the user as they're completed. The service will continue streaming until either reaching a stop token, length or harmful content is detected.

### Scenario: You send a non-streaming completions call asking for multiple generations with no inappropriate content

The table below outlines the various ways content filtering can appear:

 **HTTP response code** | **Response behavior** |
|------------------------|-------------------|
| 200 |    In the cases when all generation passes the filter models no content moderation details are added to the response. The finish_reason for each generation will be either stop or length. |

**Example response:**

```json
{
    "prompt":"Text example"
    , "n": 3
    , "stream": false
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
| 200 |The generations that were filtered will have a `finish_reason` value of 'content_filter'.

**Example request payload:**

```json
{
    "prompt":"Text example"
    , "n": 3
    , "stream": false
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
|400 |The API call will fail when the prompt triggers one of our content policy models. Modify the prompt and try again.|

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

### Scenario: You make a streaming completions call with all generated content passing the content filters

**HTTP Response Code** | **Response behavior**
|------------|------------------------|----------------------|
|200|In this case, the call will stream back with the full generation and finish_reason will be either 'length' or 'stop' for each generated response.|

**Example request payload:**

```json
{
    "prompt":"Text example"
    , "n": 3
    , "stream": true
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

### Scenario: You make a streaming completions call asking for multiple generated responses and at least one response is filtered

**HTTP Response Code** | **Response behavior**
|------------|------------------------|----------------------|
| 200 | For a given generation index, the last chunk of the generation will include a non-null `finish_reason` value. The value will be 'content_filter' when the generation was filtered.|

**Example request payload:**

```json
{
    "prompt":"Text example"
    , "n": 3
    , "stream": true
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

### Scenario: Content filtering system doesn't run on the generation

**HTTP Response Code** | **Response behavior**
|------------------------|----------------------|
| 200 | If the content filtering system is down or otherwise unable to complete the operation in time, your request will still complete. You can determine that the filtering wasn't applied by looking for an error message in the "content_filter_result" object.|

**Example request payload:**

```json
{
    "prompt":"Text example"
    , "n": 1
    , "stream": false
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

## Best practices

As part of your application design you'll need to think carefully on how to maximize the benefits of your applications  while minimizing the harms. Consider the following best practices:

- How you want to handle scenarios where your users send in-appropriate or miss-use your application. Check the finish_reason to see if the generation is filtered.
- If it's critical that the content filters run on your generations, check that there's no `error` object in the `content_filter_result`.
- To help with monitoring for possible misuse, applications serving multiple end-users should pass the `user` parameter with each API call. The `user` should be a unique identifier for the end-user. Don't send any actual user identifiable information as the value.

## Next steps
Learn more about the [underlying models that power Azure OpenAI](../concepts/models.md).
