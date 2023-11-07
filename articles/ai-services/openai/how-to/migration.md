---
title: How to migrate to OpenAI Python v1.x
titleSuffix: Azure OpenAI Service
description: Learn about migrating to the latest release of the OpenAI Python library with Azure OpenAI
author: mrbullwinkle 
ms.author: mbullwin 
ms.service: azure-ai-openai
ms.custom: 
ms.topic: how-to
ms.date: 11/06/2023
manager: nitinme
---

# Migrating to the OpenAI Python API library 1.x

OpenAI has just released a new version of the [OpenAI Python API library](https://github.com/openai/openai-python/). This guide is supplemental to [OpenAI's migration guide](https://github.com/openai/openai-python/discussions/631) and will help bring you up to speed on the changes specific to Azure OpenAI.

## Updates

- This is a completely new version of the OpenAI Python API library.
- Starting on November 6, 2023 `pip install openai` and `pip install openai --upgrade` will install `version 1.x` of the OpenAI Python library.
- Upgrading from `version 0.28.1` to `version 1.x` is a breaking change, you'll need to test and update your code.  
- Auto-retry with backoff if there's an error
- Proper types (for mypy/pyright/editors)
- You can now instantiate a client, instead of using a global default.
- Switch to explicit client instantiation
- [Name changes](#name-changes)

## Known issues

- The latest release of the [OpenAI Python library](https://pypi.org/project/openai/) doesn't currently support DALL-E when used with Azure OpenAI. DALL-E with Azure OpenAI is still supported with `0.28.1`.
- `embeddings_utils.py` which was used to provide functionality like cosine similarity for semantic text search is [no longer part of the OpenAI Python API library](https://github.com/openai/openai-python/issues/676).

## Test before you migrate

> [!IMPORTANT]
> Automatic migration of your code using `openai migrate` is not supported with Azure OpenAI.

As this is a completely new version of the library with breaking changes, you should test your code extensively against the new release before migrating any production applications to rely on version 1.x. You should also review your code and internal processes to make sure that you're following best practices and pinning your production code to only versions that you have fully tested.

To make the migration process easier, we're updating existing code examples in our docs for Python to a tabbed experience:

# [OpenAI Python 0.28.1](#tab/python)

```console
pip install openai==0.28.1
```

# [OpenAI Python 1.x](#tab/python-new)

```console
pip install openai --upgrade
```

---

This provides context for what has changed and allows you to test the new library in parallel while continuing to provide support for version `0.28.1`. If you upgrade to `1.x` and realize you need to temporarily revert back to th previous version, you can always `pip uninstall openai` and then reinstall targeted to `0.28.1` with `pip install openai==0.28.1`.

## Chat completions

# [OpenAI Python 0.28.1](#tab/python)

You need to set the `engine` variable to the deployment name you chose when you deployed the GPT-3.5-Turbo or GPT-4 models. Entering the model name will result in an error unless you chose a deployment name that is identical to the underlying model name.

```python
import os
import openai
openai.api_type = "azure"
openai.api_base = os.getenv("AZURE_OPENAI_ENDPOINT") 
openai.api_key = os.getenv("AZURE_OPENAI_KEY")
openai.api_version = "2023-05-15"

response = openai.ChatCompletion.create(
    engine="gpt-35-turbo", # engine = "deployment_name".
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Does Azure OpenAI support customer managed keys?"},
        {"role": "assistant", "content": "Yes, customer managed keys are supported by Azure OpenAI."},
        {"role": "user", "content": "Do other Azure AI services support this too?"}
    ]
)

print(response)
print(response['choices'][0]['message']['content'])
```

# [OpenAI Python 1.x](#tab/python-new)

You need to set the `model` variable to the deployment name you chose when you deployed the GPT-3.5-Turbo or GPT-4 models. Entering the model name results in an error unless you chose a deployment name that is identical to the underlying model name.

```python
import os
from openai import AzureOpenAI

client = AzureOpenAI(
  azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT"), 
  api_key=os.getenv("AZURE_OPENAI_KEY"),  
  api_version="2023-05-15"
)

response = client.chat.completions.create(
    model="gpt-35-turbo", # model = "deployment_name".
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Does Azure OpenAI support customer managed keys?"},
        {"role": "assistant", "content": "Yes, customer managed keys are supported by Azure OpenAI."},
        {"role": "user", "content": "Do other Azure AI services support this too?"}
    ]
)

print(response.choices[0].message.content)
```

Additional examples can be found in our [in-depth Chat Completion article](chatgpt.md).

---

## Completions

# [OpenAI Python 0.28.1](#tab/python)

```python
import os
import openai

openai.api_key = os.getenv("AZURE_OPENAI_KEY")
openai.api_base = os.getenv("AZURE_OPENAI_ENDPOINT") # your endpoint should look like the following https://YOUR_RESOURCE_NAME.openai.azure.com/
openai.api_type = 'azure'
openai.api_version = '2023-05-15' # this might change in the future

deployment_name='REPLACE_WITH_YOUR_DEPLOYMENT_NAME' #This will correspond to the custom name you chose for your deployment when you deployed a model. 

# Send a completion call to generate an answer
print('Sending a test completion job')
start_phrase = 'Write a tagline for an ice cream shop. '
response = openai.Completion.create(engine=deployment_name, prompt=start_phrase, max_tokens=10)
text = response['choices'][0]['text'].replace('\n', '').replace(' .', '.').strip()
print(start_phrase+text)
```

# [OpenAI Python 1.x](#tab/python-new)

```python
import os
from openai import AzureOpenAI
    
client = AzureOpenAI(
    api_key=os.getenv("AZURE_OPENAI_KEY"),  
    api_version="2023-10-01-preview",
    azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
    )
    
deployment_name='REPLACE_WITH_YOUR_DEPLOYMENT_NAME' #This will correspond to the custom name you chose for your deployment when you deployed a model. 
    
# Send a completion call to generate an answer
print('Sending a test completion job')
start_phrase = 'Write a tagline for an ice cream shop. '
response = client.completions.create(model=deployment_name, prompt=start_phrase, max_tokens=10)
print(response.choices[0].text)
```

---

## Embeddings

# [OpenAI Python 0.28.1](#tab/python)

```python
import openai

openai.api_type = "azure"
openai.api_key = YOUR_API_KEY
openai.api_base = "https://YOUR_RESOURCE_NAME.openai.azure.com"
openai.api_version = "2023-05-15"

response = openai.Embedding.create(
    input="Your text string goes here",
    engine="YOUR_DEPLOYMENT_NAME"
)
embeddings = response['data'][0]['embedding']
print(embeddings)
```

# [OpenAI Python 1.x](#tab/python-new)

```python
import os
from openai import AzureOpenAI

client = AzureOpenAI(
  api_key = os.getenv("AZURE_OPENAI_KEY"),  
  api_version = "2023-05-15",
  azure_endpoint =os.getenv("AZURE_OPENAI_ENDPOINT") 
)

response = client.embeddings.create(
    input = "Your text string goes here",
    model= "text-embedding-ada-002"
)

print(response.model_dump_json(indent=2))
```

Additional examples including how to handle semantic text search without `embeddings_utils.py` can be found in our [embeddings tutorial](../tutorials/embeddings.md).

---

## Authentication

```python
from azure.identity import DefaultAzureCredential, get_bearer_token_provider
from openai import AzureOpenAI

token_provider = get_bearer_token_provider(DefaultAzureCredential(), "https://cognitiveservices.azure.com/.default")

# may change in the future
# https://learn.microsoft.com/en-us/azure/ai-services/openai/reference#rest-api-versioning
api_version = "2023-07-01-preview"

# https://learn.microsoft.com/en-us/azure/cognitive-services/openai/how-to/create-resource?pivots=web-portal#create-a-resource
endpoint = "https://my-resource.openai.azure.com"

client = AzureOpenAI(
    api_version=api_version,
    azure_endpoint=endpoint,
    azure_ad_token_provider=token_provider,
)

completion = client.chat.completions.create(
    model="deployment-name",  # e.g. gpt-35-instant
    messages=[
        {
            "role": "user",
            "content": "How do I output all files in a directory using Python?",
        },
    ],
)
print(completion.model_dump_json(indent=2))
```



## Name changes

> [!NOTE]
> All a* methods have been removed; the async client must be used instead.

| OpenAI Python 0.28.1 | OpenAI Python 1.x |
| --------------- | --------------- |
| `openai.api_base` | `openai.base_url` |
| `openai.proxy` | `openai.proxies (docs)` |
| `openai.InvalidRequestError` | `openai.BadRequestError` |
| `openai.Audio.transcribe()` | `client.audio.transcriptions.create()` |
| `openai.Audio.translate()` | `client.audio.translations.create()` |
| `openai.ChatCompletion.create()` | `client.chat.completions.create()` |
| `openai.Completion.create()` | `client.completions.create()` |
| `openai.Edit.create()` | `client.edits.create()` |
| `openai.Embedding.create()` | `client.embeddings.create()` |
| `openai.File.create()` | `client.files.create()` |
| `openai.File.list()` | `client.files.list()` |
| `openai.File.retrieve()` | `client.files.retrieve()` |
| `openai.File.download()` | `client.files.retrieve_content()` |
| `openai.FineTune.cancel()` | `client.fine_tunes.cancel()` |
| `openai.FineTune.list()` | `client.fine_tunes.list()` |
| `openai.FineTune.list_events()` | `client.fine_tunes.list_events()` |
| `openai.FineTune.stream_events()` | `client.fine_tunes.list_events(stream=True)` |
| `openai.FineTune.retrieve()` | `client.fine_tunes.retrieve()` |
| `openai.FineTune.delete()` | `client.fine_tunes.delete()` |
| `openai.FineTune.create()` | `client.fine_tunes.create()` |
| `openai.FineTuningJob.create()` | `client.fine_tuning.jobs.create()` |
| `openai.FineTuningJob.cancel()` | `client.fine_tuning.jobs.cancel()` |
| `openai.FineTuningJob.delete()` | `client.fine_tuning.jobs.create()` |
| `openai.FineTuningJob.retrieve()` | `client.fine_tuning.jobs.retrieve()` |
| `openai.FineTuningJob.list()` | `client.fine_tuning.jobs.list()` |
| `openai.FineTuningJob.list_events()` | `client.fine_tuning.jobs.list_events()` |
| `openai.Image.create()` | `client.images.generate()` |
| `openai.Image.create_variation()` | `client.images.create_variation()` |
| `openai.Image.create_edit()` | `client.images.edit()` |
| `openai.Model.list()` | `client.models.list()` |
| `openai.Model.delete()` | `client.models.delete()` |
| `openai.Model.retrieve()` | `client.models.retrieve()` |
| `openai.Moderation.create()` | `client.moderations.create()` |
| `openai.api_resources` | `openai.resources` |

### Removed

`openai.api_key_path`
`openai.app_info`
`openai.debug`
`openai.log`
`openai.OpenAIError`
`openai.Audio.transcribe_raw()`
`openai.Audio.translate_raw()`
`openai.ErrorObject`
`openai.Customer`
`openai.api_version`
`openai.verify_ssl_certs`
`openai.api_type`
`openai.enable_telemetry`
`openai.ca_bundle_path`
`openai.requestssession` (OpenAI now uses `httpx`)
`openai.aiosession` (OpenAI now uses `httpx`)
`openai.Deployment` (Previously used for Azure OpenAI)
`openai.Engine`
`openai.File.find_matching_files()`