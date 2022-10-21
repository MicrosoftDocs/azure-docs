---
title: Azure OpenAI REST API reference
titleSuffix: Azure OpenAI
description: Learn how to use the Azure OpenAI REST API. In this article, you'll learn about authorization options,  how to structure a request and receive a response.
services: cognitive-services
manager: nitinme
ms.service: cognitive-services
ms.subservice: openai
ms.topic: conceptual
ms.date: 06/24/2022
author: ChrisHMSFT
ms.author: chrhoder
recommendations: false
ms.custom:
---

# Azure OpenAI REST API reference

This article provides details on the  REST API endpoints for the Azure OpenAI Service, a service in the Azure Cognitive Services suite. The REST APIs are broken up into two categories:

* **Management APIs**: The Azure Resource Manager (ARM) provides the management layer in Azure that allows you to create, update and delete resource in Azure. All services use a common structure for these operations. [Learn More](../../azure-resource-manager/management/overview.md)
* **Service APIs**: The Azure OpenAI service provides you with a set of REST APIs for interacting with the resources & models you deploy via the Management APIs.

## Management APIs

The Azure OpenAI Service is deployed as a part of the Azure Cognitive Services. All Cognitive Services rely on the same set of management APIs for creation, update and delete operations. The management APIs are also used for deploying models within an OpenAI resource.

[**Management APIs reference documentation**](/rest/api/cognitiveservices/)

## Authentication

The Azure OpenAI service provides two methods for authentication. you can use  either API Keys or Azure Active Directory.

- **API Key authentication**: For this type of authentication, all API requests must include the API Key in the ```api-key``` HTTP header. The [Quickstart](./quickstart.md) provides a tutorial for how to make calls with this type of authentication

- **Azure Active Directory authentication**: You can authenticate an API call using an Azure Active Directory token. Authentication tokens are included in a request as the ```Authorization``` header. The token provided must be preceded by ```Bearer```, for example ```Bearer YOUR_AUTH_TOKEN```. You can read our how-to guide on [authenticating with Azure Active Directory](./how-to/managed-identity.md).

### REST API versioning

The service APIs are versioned using the ```api-version``` query parameter. All versions follow the YYYY-MM-DD date structure, with a -preview suffix for a preview service. For example:

```
POST https://YOUR_RESOURCE_NAME.openai.azure.com/openai/deployments/YOUR_DEPLOYMENT_NAME/completions?api-version=2022-06-01-preview
```

We currently have the following versions available: ```2022-06-01-preview```

## Completions
With the Completions operation, the model will generate one or more predicted completions based on a provided prompt. The service can also return the probabilities of alternative tokens at each position.

**Create a completion**

```
POST https://{your-resource-name}.openai.azure.com/openai/deployments/{deployment-id}/completions?api-version={api-version}
```

**Path parameters**

| Parameter | Type | Required? |  Description |
|--|--|--|--|
| ```your-resource-name``` | string |  Required | The name of your Azure OpenAI Resource. |
| ```deployment-id``` | string | Required | The name of your model deployment. You're required to first deploy a model before you can make calls |
| ```api-version``` | string | Required |The API version to use for this operation. This follows the YYYY-MM-DD-preview format.  |

**Supported versions**

- `2022-06-01-preview`

**Request body**

| Parameter | Type | Required? | Default | Description |
|--|--|--|--|--|
| ```prompt``` | string or array | Optional | ```<\|endoftext\|>``` | The prompt(s) to generate completions for, encoded as a string, a list of strings, or a list of token lists. Note that ```<\|endoftext\|>``` is the document separator that the model sees during training, so if a prompt isn't specified the model will generate as if from the beginning of a new document. |
| ```max_tokens``` | integer | Optional | 16 | The maximum number of tokens to generate in the completion. The token count of your prompt plus max_tokens can't exceed the model's context length. Most models have a context length of 2048 tokens (except davinci-codex, which supports 4096). |
| ```temperature``` | number | Optional | 1 | What sampling temperature to use. Higher values means the model will take more risks. Try 0.9 for more creative applications, and 0 (`argmax sampling`) for ones with a well-defined answer. We generally recommend altering this or top_p but not both. |
| ```top_p``` | number | Optional | 1 | An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered. We generally recommend altering this or temperature but not both. |
| ```n``` | integer | Optional |  1 | How many completions to generate for each prompt. Note: Because this parameter generates many completions, it can quickly consume your token quota. Use carefully and ensure that you have reasonable settings for max_tokens and stop. |
| ```stream``` | boolean | Optional | False | Whether to stream back partial progress. If set, tokens will be sent as data-only server-sent events as they become available, with the stream terminated by a data: [DONE] message.| 
| ```logprobs``` | integer | Optional | null | Include the log probabilities on the logprobs most likely tokens, as well the chosen tokens. For example, if logprobs is 10, the API will return a list of the 10 most likely tokens. the API will always return the logprob of the sampled token, so there may be up to logprobs+1 elements in the response. |
| ```echo``` | boolean | Optional | False | Echo back the prompt in addition to the completion |
| ```stop``` | string or array | Optional | null | Up to four sequences where the API will stop generating further tokens. The returned text won't contain the stop sequence. |
| ```presence_penalty``` | number | Optional | 0 | Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics. |
| ```frequency_penalty``` | number | Optional | 0 | Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim. |
| ```best_of``` | integer | Optional | 1 | Generates best_of completions server-side and returns the "best" (the one with the lowest log probability per token). Results can't be streamed. When used with n, best_of controls the number of candidate completions and n specifies how many to return – best_of must be greater than n. Note: Because this parameter generates many completions, it can quickly consume your token quota. Use carefully and ensure that you have reasonable settings for max_tokens and stop. |
| ```logit_bias``` | map | Optional | null | Modify the likelihood of specified tokens appearing in the completion. Accepts a json object that maps tokens (specified by their token ID in the GPT tokenizer) to an associated bias value from -100 to 100. You can use this tokenizer tool (which works for both GPT-2 and GPT-3) to convert text to token IDs. Mathematically, the bias is added to the logits generated by the model prior to sampling. The exact effect will vary per model, but values between -1 and 1 should decrease or increase likelihood of selection; values like -100 or 100 should result in a ban or exclusive selection of the relevant token. As an example, you can pass {"50256": -100} to prevent the <\|endoftext\|> token from being generated. |

#### Example request

```console
curl https://YOUR_RESOURCE_NAME.openaiazure.com/openai/deployments/YOUR_DEPLOYMENT_NAME/completions?api-version=2022-06-01-preview\
  -H "Content-Type: application/json" \
  -H "api-key: YOUR_API_KEY" \
  -d "{
  \"prompt\": \"Once upon a time\",
  \"max_tokens\": 5
}"
```

#### Example response

```json
{
    "id": "cmpl-4kGh7iXtjW4lc9eGhff6Hp8C7btdQ",
    "object": "text_completion",
    "created": 1646932609,
    "model": "ada",
    "choices": [
        {
            "text": ", a dark line crossed",
            "index": 0,
            "logprobs": null,
            "finish_reason": "length"
        }
    ]
}
```

## Embeddings
Get a vector representation of a given input that can be easily consumed by machine learning models and other algorithms. 

**Create an embedding**

```
POST https://{your-resource-name}.openai.azure.com/openai/deployments/{deployment-id}/embeddings?api-version={api-version}
```

**Path parameters**

| Parameter | Type | Required? |  Description |
|--|--|--|--|
| ```your-resource-name``` | string |  Required | The name of your Azure OpenAI Resource. |
| ```deployment-id``` | string | Required | The name of your model deployment. You're required to first deploy a model before you can make calls |
| ```api-version``` | string | Required |The API version to use for this operation. This follows the YYYY-MM-DD-preview format.  |

**Supported versions**

- `2022-06-01-preview`

**Request body**

| Parameter | Type | Required? | Default | Description |
|--|--|--|--|--|
| ```input```| string or array | Yes | N/A | Input text to get embeddings for, encoded as a string or array of tokens. To get embeddings for multiple inputs in a single request, pass an array of strings or array of token arrays. Each input must not exceed 2048 tokens in length. Currently we accept a max array of 1. <br> Unless you're embedding code, we suggest replacing newlines (\n) in your input with a single space, as we have observed inferior results when newlines are present.|
| ```user``` | string | No | Null | A unique identifier representing for your end-user. This will help Azure OpenAI monitor and detect abuse. **Do not pass PII identifiers instead use pseudoanonymized values such as GUIDs** |

#### Example request

```console
curl https://YOUR_RESOURCE_NAME.openai.azure.com/openai/deployments/YOUR_DEPLOYMENT_NAME/embeddings?api-version=2022-06-01-preview\
  -H "Content-Type: application/json" \
  -H "api-key: YOUR_API_KEY" \
  -d "{\"input\": \"The food was delicious and the waiter...\"}"
```

#### Example response

```json
{
  "object": "list",
  "data": [
    {
      "object": "embedding",
      "embedding": [
        0.018990106880664825,
        -0.0073809814639389515,
        .... (1024 floats total for ada)
        0.021276434883475304,
      ],
      "index": 0
    }
  ],
  "model": "text-similarity-babbage:001"
}
```


## Models

#### List all available models
This API will return the list of all available models in your resource. This includes both 'base models' that are available by default and models you've created from fine-tuning jobs.

```
GET https://{your-resource-name}.openai.azure.com/openai/models?api-version={api-version}
```

**Path parameters**

| Parameter | Type | Required? |  Description |
|--|--|--|--|
| ```your-resource-name``` | string |  Required | The name of your Azure OpenAI Resource. |
| ```api-version``` | string | Required |The API version to use for this operation. This follows the YYYY-MM-DD-preview format.|

**Supported versions**

- `2022-06-01-preview`

#### Example request

```
curl -X GET https://example_resource_name.openai.azure.com/openai/models?api-version=2022-06-01-preview \
  -H "api-key: YOUR_API_KEY" 
```

#### Example Response
```json
{
  "data": [
    {
      "id": "ada",
      "status": "succeeded",
      "created_at": 1633564800,
      "updated_at": 1633564800,
      "object": "model",
      "capabilities": {
        "fine_tune": true
      },
      "deprecation": {
        "fine_tune": 1704067200,
        "inference": 1704067200
      }
    },
    {
      "id": "davinci",
      "status": "succeeded",
      "created_at": 1642809600,
      "updated_at": 1642809600,
      "object": "model",
      "capabilities": {
        "fine_tune": true
      },
      "deprecation": {
        "fine_tune": 1704067200,
        "inference": 1704067200
      }
    }  ],
  "object": "list"
}
```

#### Get information on a specific model

This API will retrieve information on a specific model

```
GET https://{your-resource-name}.openai.azure.com/openai/models/{model_id}?api-version={api-version}
```

**Path parameters**

| Parameter | Type | Required? |  Description |
|--|--|--|--|
| ```your-resource-name``` | string |  Required | The name of your Azure OpenAI Resource. |
| ```model_id``` | string | Required | ID of the model you wish to get information on. |
| ```api-version``` | string | Required |The API version to use for this operation. This follows the YYYY-MM-DD-preview format.|

**Supported versions**

- `2022-06-01-preview`

#### Example request

```
curl -X GET https://example_resource_name.openai.azure.com/openai/models/ada?api-version=2022-06-01-preview \
  -H "api-key: YOUR_API_KEY" 
```

#### Example response

```json
{  
  "id": "ada",
  "status": "succeeded",
  "created_at": 1633564800,
  "updated_at": 1633564800,
  "object": "model",
  "capabilities": {
    "fine_tune": true
  },
  "deprecation": {
    "fine_tune": 1704067200,
    "inference": 1704067200
  }
}
```

## Fine-tune

You can create customized versions of our models using the fine-tuning APIs. These APIs allow you to create training jobs which produce new models that are available for deployment.

#### List all training jobs

This API will list your resource's fine-tuning jobs

```
GET https://{your-resource-name}.openai.azure.com/openai/fine-tunes?api-version={api-version}
```

**Path parameters**

| Parameter | Type | Required? |  Description |
|--|--|--|--|
| ```your-resource-name``` | string |  Required | The name of your Azure OpenAI Resource. |
| ```api-version``` | string | Required |The API version to use for this operation. This follows the YYYY-MM-DD-preview format. |

**Supported versions**

- `2022-06-01-preview`

#### Example request

```console
curl -X GET https://your_resource_name.openai.azure.com/openai/fine-tunes?api-version=2022-06-01-preview \
  -H "api-key: YOUR_API_KEY"
```

#### Example response

```json
{
  "data": [
    {
      "model": "curie",
      "fine_tuned_model": "curie.ft-573da37c1eb64047850be7c0cb59953d",
      "training_files": [
        {
          "purpose": "fine-tune",
          "filename": "training_file_name.txt",
          "id": "file-cdb57152d5bd4a7dae8da5915ce14132",
          "status": "succeeded",
          "created_at": 1645700311,
          "updated_at": 1645700314,
          "object": "file"
        }
      ],
      "validation_files": [
        {
          "purpose": "fine-tune",
          "filename": "validation_file_name.txt",
          "id": "file-cdb57152d5bd4a7dae8da5915ce14132",
          "status": "succeeded",
          "created_at": 1645700311,
          "updated_at": 1645700314,
          "object": "file"
        }
      ],
      "result_files": [
        {
          "bytes": 540,
          "purpose": "fine-tune-results",
          "filename": "results.csv",
          "id": "file-1d92e225cf6c428da8790b305b37f9c9",
          "status": "succeeded",
          "created_at": 1645704004,
          "updated_at": 1645704004,
          "object": "file"
        }
      ],
      "hyperparams": {
        "batch_size": 200,
        "learning_rate_multiplier": 0.1,
        "n_epochs": 1,
        "prompt_loss_weight": 0.1
      },
      "events": [
        {
          "created_at": 1645700414,
          "level": "info",
          "message": "Job enqueued. Waiting for jobs ahead to complete.",
          "object": "fine-tune-event"
        },
        {
          "created_at": 1645700420,
          "level": "info",
          "message": "Job started.",
          "object": "fine-tune-event"
        },
        {
          "created_at": 1645703999,
          "level": "info",
          "message": "Job succeeded.",
          "object": "fine-tune-event"
        },
        {
          "created_at": 1645704004,
          "level": "info",
          "message": "Uploaded result files: file-1d92e225cf6c428da8790b305b37f9c9",
          "object": "fine-tune-event"
        }
      ],
      "id": "ft-573da37c1eb64047850be7c0cb59953d",
      "status": "succeeded",
      "created_at": 1645700409,
      "updated_at": 1646042114,
      "object": "fine-tune"
    }
  ],
  "object": "list"
}

```

#### Create a Fine tune job

This API will create a new job to fine-tune a specified model with the specified dataset.

```
POST https://{your-resource-name}.openai.azure.com/openai/fine-tunes?api-version={api-version}
```

**Path parameters**

| Parameter | Type | Required? |  Description |
|--|--|--|--|
| ```your-resource-name``` | string |  Required | The name of your Azure OpenAI Resource. |
| ```api-version``` | string | Required |The API version to use for this operation. This follows the YYYY-MM-DD-preview format.|

**Supported versions**

- `2022-06-01-preview`

**Request body**

| Parameter | Type | Required? | Default | Description |
|--|--|--|--|--|
| model | string | yes | n/a |  The name of the base model you want to fine tune. use the models API to find the list of available models for fine tuning |
| training_file | string | yes | n/a |The ID of an uploaded file that contains training data. Your dataset must be formatted as a JSONL file, where each training example is a JSON object with the keys "prompt" and "completion". Additionally, you must upload your file with the purpose fine-tune. |
| validation_file| string | no | null | The ID of an uploaded file that contains validation data. <br> If you provide this file, the data is used to generate validation metrics periodically during fine-tuning. These metrics can be viewed in the fine-tuning results file. Your train and validation data should be mutually exclusive. <br><br> Your dataset must be formatted as a JSONL file, where each validation example is a JSON object with the keys "prompt" and "completion". Additionally, you must upload your file with the purpose fine-tune. |
| batch_size | integer | no | null | The batch size to use for training. The batch size is the number of training examples used to train a single forward and backward pass. <br><br> By default, the batch size will be dynamically configured to be ~0.2% of the number of examples in the training set, capped at 256 - in general, we've found that larger batch sizes tend to work better for larger datasets.
| learning_rate_multiplier | number (double) | no | null | The learning rate multiplier to use for training. The fine-tuning learning rate is the original learning rate used for pre-training multiplied by this value.<br><br> We recommend experimenting with values in the range 0.02 to 0.2 to see what produces the best results. |
| n_epochs |  integer | no | 4 for `ada`, `babbage`, `curie`. 1 for `davinci` | The number of epochs to train the model for. An epoch refers to one full cycle through the training dataset. |
| prompt_loss_weight | number (double) | no | 0.1 | The weight to use for loss on the prompt tokens. This controls how much the model tries to learn to generate the prompt (as compared to the completion, which always has a weight of 1.0), and can add a stabilizing effect to training when completions are short. <br><br> |
| compute_classification_metrics | boolean | no | false | If set, we calculate classification-specific metrics such as accuracy and F-1 score using the validation set at the end of every epoch. |
| classification_n_classes | integer | no | null | The number of classes in a classification task. This parameter is required for multiclass classification |
| classification_positive_class | string | no | null | The positive class in binary classification. This parameter is needed to generate precision, recall, and F1 metrics when doing binary classification. |
| classification_betas | array | no | null | If this is provided, we calculate F-beta scores at the specified beta values. The F-beta score is a generalization of F-1 score. This is only used for binary classification With a beta of 1 (the F-1 score), precision and recall are given the same weight. A larger beta score puts more weight on recall and less on precision. A smaller beta score puts more weight on precision and less on recall. |

#### Example request

```console
curl https://your-resource-name.openai.azure.com/openai/fine-tunes?api-version=2022-06-01-preview \
  -X POST \
  -H "Content-Type: application/json" \
  -H "api-key: YOUR_API_KEY" \
  -d "{
        \"model\": \"ada\",
        \"training_file\": \"file-6ca9bd640c8e4eaa9ec922604226ab6c\",
        \"validation_file\": \"file-cbdad17806aa48e48b05fc2c44c87bf5\",
        \"hyperparams\": {
          \"batch_size\": 1,
          \"learning_rate_multiplier\": 0.1,
          \"n_epochs\": 4,
        }
      }"
```

#### Example response

```json
{
  "model": "ada",
  "training_files": [
    {
      "purpose": "fine-tune",
      "filename": "training_data_file.jsonl",
      "id": "file-63618d04c90a4c50961dacc31950e6a9",
      "status": "succeeded",
      "created_at": 1646927862,
      "updated_at": 1646927867,
      "object": "file"
    }
  ],
  "validation_files": [
    {
      "purpose": "fine-tune",
      "filename": "validation_data_file.jsonl",
      "id": "file-9a19ba124fde451aa32c7527844d48e4",
      "status": "succeeded",
      "created_at": 1646927864,
      "updated_at": 1646927867,
      "object": "file"
    }
  ],
  "hyperparams": {
    "batch_size": 10,
    "learning_rate_multiplier": 0.1,
    "n_epochs": 1,
    "prompt_loss_weight": 0.1
  },
  "events": [],
  "id": "ft-e72ba1b389f8428e9bd4aefea40610b6",
  "status": "notRunning",
  "created_at": 1646927942,
  "updated_at": 1646927942,
  "object": "fine-tune"
}

```

#### Get a specific fine tuning job

This API will retrieve information about a specific fine tuning job

```
GET https://{your-resource-name}.openai.azure.com/openai/fine-tunes/{fine_tune_id}?api-version={api-version}
```

**Path parameters**

| Parameter | Type | Required? |  Description |
|--|--|--|--|
| ```your-resource-name``` | string |  Required | The name of your Azure OpenAI Resource. |
| ```fine_tune_id``` | string | Required | The ID for the fine tuning job you wish to retrieve |
| ```api-version``` | string | Required |The API version to use for this operation. This follows the YYYY-MM-DD-preview format.|

**Supported versions**

- `2022-06-01-preview`

#### Example request

```console
curl https://example_resource_name.openai.azure.com/openai/fine-tunes/ft-d3f2a65d49d34e74a80f6328ba6d8d08?api-version=2022-06-01-preview \
  -H "api-key: YOUR_API_KEY" 
```

#### Example response
```json
{
    "id": "ft-9f84568b71ff403a8b118df91128925b",
    "status": "succeeded",
    "created_at": 1645704199,
    "updated_at": 1646042114,
    "object": "fine-tune",
    "model": "ada",
    "fine_tuned_model": "ada.ft-9f84568b71ff403a8b118df91128925b",
    "training_files": [
      {
        "purpose": "fine-tune",
        "filename": "training_file_data.jsonl",
        "id": "file-cdb57152d5bd4a7dae8da5915ce14132",
        "status": "succeeded",
        "created_at": 1645700311,
        "updated_at": 1645700314,
        "object": "file"
      }
    ],
    "validation_files": [
      {
        "purpose": "fine-tune",
        "filename": "validation_file_data.jsonl",
        "id": "file-cdb57152d5bd4a7dae8da5915ce14132",
        "status": "succeeded",
        "created_at": 1645700311,
        "updated_at": 1645700314,
        "object": "file"
      }
    ],
    "result_files": [
      {
        "bytes": 541,
        "purpose": "fine-tune-results",
        "filename": "results.csv",
        "id": "file-8ed3b46d8d02479198067c1735457d76",
        "status": "succeeded",
        "created_at": 1645706224,
        "updated_at": 1645706224,
        "object": "file"
      }
    ],
    "hyperparams": {
      "batch_size": 200,
      "learning_rate_multiplier": 0.1,
      "n_epochs": 1,
      "prompt_loss_weight": 0.1
    },
    "events": [
      {
        "created_at": 1645704207,
        "level": "info",
        "message": "Job enqueued. Waiting for jobs ahead to complete.",
        "object": "fine-tune-event"
      },
      {
        "created_at": 1645704208,
        "level": "info",
        "message": "Job started.",
        "object": "fine-tune-event"
      },
      {
        "created_at": 1645706219,
        "level": "info",
        "message": "Job succeeded.",
        "object": "fine-tune-event"
      },
      {
        "created_at": 1645706224,
        "level": "info",
        "message": "Uploaded result files: file-8ed3b46d8d02479198067c1735457d76",
        "object": "fine-tune-event"
      }
    ]
  }
```

#### Delete a specific fine tuning job

This API will delete a specific fine tuning job

```
DELETE https://{your-resource-name}.openai.azure.com/openai/fine-tunes/{fine_tune_id}?api-version={api-version}
```

**Path parameters**

| Parameter | Type | Required? |  Description |
|--|--|--|--|
| ```your-resource-name``` | string |  Required | The name of your Azure OpenAI Resource. |
| ```fine_tune_id``` | string | Required | The ID for the fine tuning job you wish to delete |
| ```api-version``` | string | Required |The API version to use for this operation. This follows the YYYY-MM-DD-preview format.|

**Supported Versions**

- `2022-06-01-preview`

#### Example request

```console
curl https://example_resource_name.openai.azure.com/openai/fine-tunes/ft-d3f2a65d49d34e74a80f6328ba6d8d08?api-version=2022-06-01-preview \
  -X DELETE
  -H "api-key: YOUR_API_KEY" 
```

#### Retrieve events for a specific fine tuning job

This API will retrieve the events associated with the specified fine tuning job. To stream events as they become available, use the query parameter “stream” and pass true value (&stream=true)


```
GET https://{your-resource-name}.openai.azure.com/openai/fine-tunes/{fine_tune_id}/events?api-version={api-version}
```

**Path parameters**

| Parameter | Type | Required? |  Description |
|--|--|--|--|
| ```your-resource-name``` | string |  Required | The name of your Azure OpenAI Resource. |
| ```fine_tune_id``` | string | Required | The ID for the fine tuning job you wish to stream events from |
| ```stream``` | boolean | no | To stream events as they become available pass a true value |
| ```api-version``` | string | Required |The API version to use for this operation. This follows the YYYY-MM-DD-preview format.|

**Supported versions**

- `2022-06-01-preview`

#### Example request
```
curl -X GET https://your_resource_name.openai.azure.com/openai/fine-tunes/ft-d3f2a65d49d34e74a80f6328ba6d8d08/events?stream=true&api-version=2022-06-01-preview \
  -H "api-key: YOUR_API_KEY" 
```

#### Example response

```json
{
  "data": [
    {
      "created_at": 1645704207,
      "level": "info",
      "message": "Job enqueued. Waiting for jobs ahead to complete.",
      "object": "fine-tune-event"
    },
    {
      "created_at": 1645704208,
      "level": "info",
      "message": "Job started.",
      "object": "fine-tune-event"
    },
    {
      "created_at": 1645706219,
      "level": "info",
      "message": "Job succeeded.",
      "object": "fine-tune-event"
    },
    {
      "created_at": 1645706224,
      "level": "info",
      "message": "Uploaded result files: file-8ed3b46d8d02479198067c1735457d76",
      "object": "fine-tune-event"
    }
  ],
  "object": "list"
}
```

#### Cancel a fine tuning job

This API will cancel the specified job

```
POST https://{your-resource-name}.openai.azure.com/openai/fine-tunes/{fine_tune_id}/cancel?api-version={api-version}
```

**Path Parameters**

| Parameter | Type | Required? |  Description |
|--|--|--|--|
| ```your-resource-name``` | string |  Required | The name of your Azure OpenAI Resource. |
| ```fine_tune_id``` | string | Required | The ID for the fine tuning job you wish to stream events from |
| ```api-version``` | string | Required |The API version to use for this operation. This follows the YYYY-MM-DD-preview format.|

**Supported versions**
- `2022-06-01-preview`

#### Example request
```
curl -X POST https://your_resource_name.openai.azure.com/openai/fine-tunes/ft-d3f2a65d49d34e74a80f6328ba6d8d08/cancel?api-version=2022-06-01-preview \
    -H "api-key: YOUR_API_KEY" 
```

#### Example response

```json
{
  "model": "ada",
  "training_files": [
    {
      "purpose": "fine-tune",
      "filename": "training_data_file.jsonl",
      "id": "file-63618d04c90a4c50961dacc31950e6a9",
      "status": "succeeded",
      "created_at": 1646927862,
      "updated_at": 1646927867,
      "object": "file"
    }
  ],
  "hyperparams": {
    "batch_size": 10,
    "learning_rate_multiplier": 0.1,
    "n_epochs": 1,
    "prompt_loss_weight": 0.1
  },
  "events": [
    {
      "created_at": 1646927881,
      "level": "info",
      "message": "Job enqueued. Waiting for jobs ahead to complete.",
      "object": "fine-tune-event"
    },
    {
      "created_at": 1646927886,
      "level": "info",
      "message": "Job started.",
      "object": "fine-tune-event"
    }
  ],
  "id": "ft-cd8414443c4243d9aa9644af1c1f4f80",
  "status": "canceled",
  "created_at": 1646927875,
  "updated_at": 1646928438,
  "object": "fine-tune"
}

```

## Files

#### List all files in your resource

This API will list all the Files that have been uploaded to the resource

```
GET https://{your-resource-name}.openai.azure.com/openai/files?api-version={api-version}
```

**Path parameters**

| Parameter | Type | Required? |  Description |
|--|--|--|--|
| ```your-resource-name``` | string |  Required | The name of your Azure OpenAI Resource. |
| ```api-version``` | string | Required |The API version to use for this operation. This follows the YYYY-MM-DD-preview format.|

**Supported versions**

- `2022-06-01-preview`

#### Example request

```
curl -X GET https://example_resource_name.openai.azure.com/openai/files?api-version=2022-06-01-preview \
  -H "api-key: YOUR_API_KEY" 
```

#### Example response

```JSON
{
  "data": [
    {
      "bytes": 1519036,
      "purpose": "fine-tune",
      "filename": "training_data_file.jsonl",
      "id": "file-90933867b7fe49dfab5468a87aa49bcd",
      "status": "succeeded",
      "created_at": 1646043430,
      "updated_at": 1646043436,
      "object": "file"
    },
    {
      "bytes": 387349,
      "purpose": "fine-tune",
      "filename": "validation_data_file.jsonl",
      "id": "file-c00a485713664d3f87d27de7f083a78b",
      "status": "succeeded",
      "created_at": 1646043444,
      "updated_at": 1646043447,
      "object": "file"
    }
  ],
  "object": "list"
}

```

#### Upload a file

This API will upload a file that contains the examples used for fine-tuning a model.

```
GET https://{your-resource-name}.openai.azure.com/openai/files?api-version={api-version}
```

**Path parameters**

| Parameter | Type | Required? |  Description |
|--|--|--|--|
| ```your-resource-name``` | string |  Required | The name of your Azure OpenAI Resource. |
| ```api-version``` | string | Required |The API version to use for this operation. This follows the YYYY-MM-DD-preview format.|

**Form data**

| Parameter | Type | Required? |  Description |
|--|--|--|--|
| purpose | string |  Required | The intended purpose of the uploaded documents. Currently only 'fine-tune' is supported for fine tuning documents |
| file | string | Required | the name of the JSON lines file to be uploaded |

**Supported versions**

- `2022-06-01-preview`

#### Example request

```console
curl -X POST https://example_resource_name.openai.azure.com/openai/files?api-version=2022-06-01-preview \
  -H "accept: application/json" \
  -H "Content-Type: multipart/form-data" \
  -F "purpose=fine-tune" \
  -F "file=@straining_file_name.jsonl"
```

#### Example response

```JSON
{
  "bytes": 405898,
  "purpose": "fine-tune",
  "filename": "training_file.jsonl",
  "id": "file-a3a7c9947c0d4a2ead8c4adddb973cc3",
  "status": "notRunning",
  "created_at": 1646928754,
  "updated_at": 1646928754,
  "object": "file"
}
```

#### Retrieve information on a file

This API will return information on the specified file

```
GET https://{your-resource-name}.openai.azure.com/openai/files/{file_id}?api-version={api-version}
```

**Path parameters**

| Parameter | Type | Required? |  Description |
|--|--|--|--|
| ```your-resource-name``` | string |  Required | The name of your Azure OpenAI Resource. |
| ```file_id``` | string | yes | The ID of the file you wish to retrieve |
| ```api-version``` | string | Required |The API version to use for this operation. This follows the YYYY-MM-DD-preview format.|

**Supported versions**

- `2022-06-01-preview`

#### Example request

```console
curl -X GET https://example_resource_name.openai.azure.com/openai/files/file-6ca9bd640c8e4eaa9ec922604226ab6c?api-version=2022-06-01-preview \
  -H "api-key: YOUR_API_KEY" 
```

#### Example response

```json
{
  "bytes": 405898,
  "purpose": "fine-tune",
  "filename": "test_prepared_train.jsonl",
  "id": "file-63618d04c90a4c50961dacc31950e6a9",
  "status": "succeeded",
  "created_at": 1646927862,
  "updated_at": 1646927867,
  "object": "file"
}
```

#### Delete a file

This API will delete the specified file

```
DELETE https://{your-resource-name}.openai.azure.com/openai/files/{file_id}?api-version={api-version}
```

**Path parameters**

| Parameter | Type | Required? |  Description |
|--|--|--|--|
| ```your-resource-name``` | string |  Required | The name of your Azure OpenAI Resource. |
| ```file_id``` | string | yes | The ID of the file you wish to Delete |
| ```api-version``` | string | Required |The API version to use for this operation. This follows the YYYY-MM-DD-preview format.|

**Supported versions**

- `2022-06-01-preview`

#### Example request
```console
curl -X DELETE https://example_resource_name.openai.azure.com/openai/files/file-6ca9bd640c8e4eaa9ec922604226ab6c?api-version=2022-06-01-preview \
  -H "api-key: YOUR_API_KEY" 
```

#### Download a file

This API will download the specified file.

```
GET https://{your-resource-name}.openai.azure.com/openai/files/{file_id}/content?api-version={api-version}
```

**Path parameters**

| Parameter | Type | Required? |  Description |
|--|--|--|--| 
| ```your-resource-name``` | string |  Required | The name of your Azure OpenAI Resource. |
| ```file_id``` | string | yes | The ID of the file you wish to download |
| ```api-version``` | string | Required |The API version to use for this operation. This follows the YYYY-MM-DD-preview format.|

**Supported versions**

- `2022-06-01-preview`

#### Example request
```
curl -X GET https://example_resource_name.openai.azure.com/openai/files/file-6ca9bd640c8e4eaa9ec922604226ab6c/content?api-version=2022-06-01-preview \
  -H "api-key: YOUR_API_KEY" 
```

#### Import a file from Azure Blob

Import files from blob storage or other web locations. We recommend you use this option for importing large files. Large files can become unstable when uploaded through multipart forms because the requests are atomic and can't be retried or resumed.

```
POST https://{your-resource-name}.openai.azure.com/openai/files/import?api-version={api-version}
```

**Path parameters**

| Parameter | Type | Required? |  Description |
|--|--|--|--|
| ```your-resource-name``` | string |  Required | The name of your Azure OpenAI Resource. |
| ```api-version``` | string | Required |The API version to use for this operation. This follows the YYYY-MM-DD-preview format.|

**Supported versions**

- `2022-06-01-preview`

**Request body**

| Parameter | Type | Required? | Default | Description |
|--|--|--|--|--|
| purpose | string | Yes | N/A |  The intended purpose of the uploaded documents. Currently only 'fine-tune' is supported for fine tuning documents |
| filename | string | Yes | N/A | The name of the file you wish to import |
| content_url | string | Yes | N/A | Blob URI location. Include the SAS token if the file is non-public. |

#### Example request

```console
curl -X POST https://example_resource_name.openai.azure.com/openai/files/files/import?api-version=2022-06-01-preview \
  -H "api-key: YOUR_API_KEY"
  -H "Content-Type: application/json" \
  -d "{
      \"purpose\": \"fine-tune\",
      \"filename\": \"NAME_OF_FILE\",
      \"content_url\": \"URL_TO_FILE\"
      }"
```

### Example response

```JSON
{
  "purpose": "fine-tune",
  "filename": "validationfiletest.jsonl",
  "id": "file-83f408999d8f4c12af66d4e067e19736",
  "status": "notRunning",
  "created_at": 1646929498,
  "updated_at": 1646929498,
  "object": "file"
}
```

## Deployments

#### List all deployments in the resource

This API will return a list of all the deployments in the resource.

```
POST https://{your-resource-name}.openai.azure.com/openai/deployments?api-version={api-version}
```

**Path parameters**

| Parameter | Type | Required? |  Description |
|--|--|--|--|
| ```your-resource-name``` | string |  Required | The name of your Azure OpenAI Resource. |
| ```api-version``` | string | Required |The API version to use for this operation. This follows the YYYY-MM-DD-preview format.|

**Supported versions**

- `2022-06-01-preview`


#### Example request

```console
curl -X GET https://example_resource_name.openai.azure.com/openai/deployments?api-version=2022-06-01-preview \
  -H "api-key: YOUR_API_KEY"
```

#### Example response

```json
{
  "data": [
    {
      "model": "curie.ft-573da37c1eb64047850be7c0cb59953d",
      "scale_settings": {
        "scale_type": "standard"
      },
      "owner": "organization-owner",
      "id": "your_deployment_name",
      "status": "succeeded",
      "created_at": 1645710085,
      "updated_at": 1645710085,
      "object": "deployment"
    },
  ],
  "object": "list"
}

```


#### Create a new deployment

This API will create a new deployment in the resource. This will enable you to make completions and embeddings calls with the model.

```
POST https://{your-resource-name}.openai.azure.com/openai/deployments?api-version={api-version}
```

**Path parameters**

| Parameter | Type | Required? |  Description |
|--|--|--|--| 
| ```your-resource-name``` | string |  Required | The name of your Azure OpenAI Resource. |
| ```api-version``` | string | Required |The API version to use for this operation. This follows the YYYY-MM-DD-preview format.|

**Supported versions**

- `2022-06-01-preview`

**Request body**

| Parameter | Type | Required? | Default | Description |
|--|--|--|--|--|
| model | string | Yes | N/A |  The name of the model you wish to deploy. You can find the list of available models from the models API. |
| scale_type | string | Yes | N/A | Scale configuration. The only option today is 'Standard' |

#### Example request

```console
curl -X POST https://example_resource_name.openai.azure.com/openai/deployments?api-version=2022-06-01-preview \
  -H "api-key: YOUR_API_KEY"
  -H "Content-Type: application/json" \
  -d "{
      \"model\": \"ada\",
      \"scale_settings\": {
            \"scale_type\": \"standard\"
          }
      }"
```

#### Example response

```json
{
  "model": "ada",
  "scale_settings": {
    "scale_type": "standard"
  },
  "owner": "organization-owner",
  "id": "deployment-2f9834184fd34d1a9a0f26464450db87",
  "status": "running",
  "created_at": 1646929698,
  "updated_at": 1646929698,
  "object": "deployment"
}
```


#### Retrieve information about a deployment

This API will retrieve information about the specified deployment

```
GET https://{your-resource-name}.openai.azure.com/openai/deployments/{deployment_id}?api-version={api-version}
```

**Path parameters**

| Parameter | Type | Required? |  Description |
|--|--|--|--|
| ```your-resource-name``` | string |  Required | The name of your Azure OpenAI Resource. |
| ```deployment_id``` | string | Required | The name of the deployment you wish to retrieve |
| ```api-version``` | string | Required |The API version to use for this operation. This follows the YYYY-MM-DD-preview format.|

**Supported versions**

- `2022-06-01-preview`

#### Example request

```console
curl -X GET https://example_resource_name.openai.azure.com/openai/deployments/{deployment_id}?api-version=2022-06-01-preview \
  -H "api-key: YOUR_API_KEY"
```
#### Example response

```json
{
  "model": "ada",
  "scale_settings": {
    "scale_type": "standard"
  },
  "owner": "organization-owner",
  "id": "deployment-2f9834184fd34d1a9a0f26464450db87",
  "status": "running",
  "created_at": 1646929698,
  "updated_at": 1646929698,
  "object": "deployment"
}
```

#### Update a deployment

This API will update an existing deployment. Make sure to set the content-type to `application/merge-patch+json`

```
PATCH https://{your-resource-name}.openai.azure.com/openai/deployments/{deployment_id}?api-version={api-version}
```

**Path parameters**

| Parameter | Type | Required? |  Description |
|--|--|--|--|
| ```your-resource-name``` | string |  Required | The name of your Azure OpenAI Resource. |
| ```deployment_id``` | string | Required | The name of the deployment you wish to update |
| ```api-version``` | string | Required |The API version to use for this operation. This follows the YYYY-MM-DD-preview format.|

**Supported versions**

- `2022-06-01-preview`

**Request body**

| Parameter | Type | Required? | Default | Description |
|--|--|--|--|--|
| model | string | Yes | N/A |  The name of the model you wish to deploy. You can find the list of available models from the models API. |
| scale_type | string | Yes | N/A | Scale configuration. The only option today is 'standard' |

#### Example request

```console
curl -X PATCH  https://example_resource_name.openai.azure.com/openai/deployments/my_personal_deployment?api-version=2022-06-01-preview \
  -H "api-key: YOUR_API_KEY"
  -H "Content-Type: application/merge-patch+json" \
  -d "{
      \"model\": \"ada\",
      \"scale_settings\": {
            \"scale_type\": \"standard\"
          }
      }"
```

#### Delete a deployment

This API will delete the specified deployment

```
DELETE https://{your-resource-name}.openai.azure.com/openai/deployments/{deployment_id}?api-version={api-version}
```

**Path parameters**

| Parameter | Type | Required? |  Description |
|--|--|--|--|
| ```your-resource-name``` | string |  Required | The name of your Azure OpenAI Resource. |
| ```deployment_id``` | string | Required | The name of the deployment you wish to delete |
| ```api-version``` | string | Required |The API version to use for this operation. This follows the YYYY-MM-DD-preview format.|

**Supported versions**

- `2022-06-01-preview`

#### Example request

```Console
curl -X DELETE https://example_resource_name.openai.azure.com/openai/deployments/{deployment_id}?api-version=2022-06-01-preview \
  -H "api-key: YOUR_API_KEY"
```

## Next steps

Learn more about the [underlying models that power Azure OpenAI](./concepts/models.md).