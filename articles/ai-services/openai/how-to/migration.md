---
title: How to migrate to OpenAI Python v1.x
titleSuffix: Azure OpenAI Service
description: Learn about migrating to the latest release of the OpenAI Python library with Azure OpenAI
author: mrbullwinkle 
ms.author: mbullwin 
ms.service: azure-ai-openai
ms.custom: devx-track-python
ms.topic: how-to
ms.date: 11/15/2023
manager: nitinme
---

# Migrating to the OpenAI Python API library 1.x

OpenAI has just released a new version of the [OpenAI Python API library](https://github.com/openai/openai-python/). This guide is supplemental to [OpenAI's migration guide](https://github.com/openai/openai-python/discussions/742) and will help bring you up to speed on the changes specific to Azure OpenAI.

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

- **`DALL-E3` is [fully supported with the latest 1.x release](../dall-e-quickstart.md).** `DALL-E2` can be used with 1.x by making the [following modifications to your code](#dall-e-fix).
- `embeddings_utils.py` which was used to provide functionality like cosine similarity for semantic text search is [no longer part of the OpenAI Python API library](https://github.com/openai/openai-python/issues/676).
- You should also check the active [GitHub Issues](https://github.com/openai/openai-python/issues/) for the OpenAI Python library.

## Test before you migrate

> [!IMPORTANT]
> Automatic migration of your code using `openai migrate` is not supported with Azure OpenAI.

As this is a new version of the library with breaking changes, you should test your code extensively against the new release before migrating any production applications to rely on version 1.x. You should also review your code and internal processes to make sure that you're following best practices and pinning your production code to only versions that you have fully tested.

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

This provides context for what has changed and allows you to test the new library in parallel while continuing to provide support for version `0.28.1`. If you upgrade to `1.x` and realize you need to temporarily revert back to the previous version, you can always `pip uninstall openai` and then reinstall targeted to `0.28.1` with `pip install openai==0.28.1`.

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
    api_version="2023-12-01-preview",
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

## Async

OpenAI doesn't support calling asynchronous methods in the module-level client, instead you should instantiate an async client.

```python
import os
import asyncio
from openai import AsyncAzureOpenAI

async def main():
    client = AsyncAzureOpenAI(  
      api_key = os.getenv("AZURE_OPENAI_KEY"),  
      api_version = "2023-12-01-preview",
      azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
    )
    response = await client.chat.completions.create(model="gpt-35-turbo", messages=[{"role": "user", "content": "Hello world"}])

    print(response.model_dump_json(indent=2))

asyncio.run(main())
```

## Authentication

```python
from azure.identity import DefaultAzureCredential, get_bearer_token_provider
from openai import AzureOpenAI

token_provider = get_bearer_token_provider(DefaultAzureCredential(), "https://cognitiveservices.azure.com/.default")

api_version = "2023-12-01-preview"
endpoint = "https://my-resource.openai.azure.com"

client = AzureOpenAI(
    api_version=api_version,
    azure_endpoint=endpoint,
    azure_ad_token_provider=token_provider,
)

completion = client.chat.completions.create(
    model="deployment-name",  # gpt-35-instant
    messages=[
        {
            "role": "user",
            "content": "How do I output all files in a directory using Python?",
        },
    ],
)
print(completion.model_dump_json(indent=2))
```

## Use your data

For the full configuration steps that are required to make these code examples work, please consult the [use your data quickstart](../use-your-data-quickstart.md).
# [OpenAI Python 0.28.1](#tab/python)

```python
import os
import openai
import dotenv
import requests

dotenv.load_dotenv()

openai.api_base = os.environ.get("AOAIEndpoint")
openai.api_version = "2023-08-01-preview"
openai.api_type = 'azure'
openai.api_key = os.environ.get("AOAIKey")

def setup_byod(deployment_id: str) -> None:
    """Sets up the OpenAI Python SDK to use your own data for the chat endpoint.

    :param deployment_id: The deployment ID for the model to use with your own data.

    To remove this configuration, simply set openai.requestssession to None.
    """

    class BringYourOwnDataAdapter(requests.adapters.HTTPAdapter):

     def send(self, request, **kwargs):
         request.url = f"{openai.api_base}/openai/deployments/{deployment_id}/extensions/chat/completions?api-version={openai.api_version}"
         return super().send(request, **kwargs)

    session = requests.Session()

    # Mount a custom adapter which will use the extensions endpoint for any call using the given `deployment_id`
    session.mount(
        prefix=f"{openai.api_base}/openai/deployments/{deployment_id}",
        adapter=BringYourOwnDataAdapter()
    )

    openai.requestssession = session

aoai_deployment_id = os.environ.get("AOAIDeploymentId")
setup_byod(aoai_deployment_id)

completion = openai.ChatCompletion.create(
    messages=[{"role": "user", "content": "What are the differences between Azure Machine Learning and Azure AI services?"}],
    deployment_id=os.environ.get("AOAIDeploymentId"),
    dataSources=[  # camelCase is intentional, as this is the format the API expects
        {
            "type": "AzureCognitiveSearch",
            "parameters": {
                "endpoint": os.environ.get("SearchEndpoint"),
                "key": os.environ.get("SearchKey"),
                "indexName": os.environ.get("SearchIndex"),
            }
        }
    ]
)
print(completion)
```

# [OpenAI Python 1.x](#tab/python-new)

```python
import os
import openai
import dotenv

dotenv.load_dotenv()

endpoint = os.environ.get("AOAIEndpoint")
api_key = os.environ.get("AOAIKey")
deployment = os.environ.get("AOAIDeploymentId")

client = openai.AzureOpenAI(
    base_url=f"{endpoint}/openai/deployments/{deployment}/extensions",
    api_key=api_key,
    api_version="2023-08-01-preview",
)

completion = client.chat.completions.create(
    model=deployment,
    messages=[
        {
            "role": "user",
            "content": "How is Azure machine learning different than Azure OpenAI?",
        },
    ],
    extra_body={
        "dataSources": [
            {
                "type": "AzureCognitiveSearch",
                "parameters": {
                    "endpoint": os.environ["SearchEndpoint"],
                    "key": os.environ["SearchKey"],
                    "indexName": os.environ["SearchIndex"]
                }
            }
        ]
    }
)

print(completion.model_dump_json(indent=2))
```

---

## DALL-E fix

# [DALLE-Fix](#tab/dalle-fix)

```python
import time
import json
import httpx
import openai


class CustomHTTPTransport(httpx.HTTPTransport):
    def handle_request(
        self,
        request: httpx.Request,
    ) -> httpx.Response:
        if "images/generations" in request.url.path and request.url.params[
            "api-version"
        ] in [
            "2023-06-01-preview",
            "2023-07-01-preview",
            "2023-08-01-preview",
            "2023-09-01-preview",
            "2023-10-01-preview",
        ]:
            request.url = request.url.copy_with(path="/openai/images/generations:submit")
            response = super().handle_request(request)
            operation_location_url = response.headers["operation-location"]
            request.url = httpx.URL(operation_location_url)
            request.method = "GET"
            response = super().handle_request(request)
            response.read()

            timeout_secs: int = 120
            start_time = time.time()
            while response.json()["status"] not in ["succeeded", "failed"]:
                if time.time() - start_time > timeout_secs:
                    timeout = {"error": {"code": "Timeout", "message": "Operation polling timed out."}}
                    return httpx.Response(
                        status_code=400,
                        headers=response.headers,
                        content=json.dumps(timeout).encode("utf-8"),
                        request=request,
                    )

                time.sleep(int(response.headers.get("retry-after")) or 10)
                response = super().handle_request(request)
                response.read()

            if response.json()["status"] == "failed":
                error_data = response.json()
                return httpx.Response(
                    status_code=400,
                    headers=response.headers,
                    content=json.dumps(error_data).encode("utf-8"),
                    request=request,
                )

            result = response.json()["result"]
            return httpx.Response(
                status_code=200,
                headers=response.headers,
                content=json.dumps(result).encode("utf-8"),
                request=request,
            )
        return super().handle_request(request)


client = openai.AzureOpenAI(
    azure_endpoint="<azure_endpoint>",
    api_key="<api_key>",
    api_version="<api_version>",
    http_client=httpx.Client(
        transport=CustomHTTPTransport(),
    ),
)
image = client.images.generate(prompt="a cute baby seal")

print(image.data[0].url)
```

# [DALLE-Fix Async](#tab/dalle-fix-async)

```python
import time
import asyncio
import json
import httpx
import openai


class AsyncCustomHTTPTransport(httpx.AsyncHTTPTransport):
    async def handle_async_request(
        self,
        request: httpx.Request,
    ) -> httpx.Response:
        if "images/generations" in request.url.path and request.url.params[
            "api-version"
        ] in [
            "2023-06-01-preview",
            "2023-07-01-preview",
            "2023-08-01-preview",
            "2023-09-01-preview",
            "2023-10-01-preview",
        ]:
            request.url = request.url.copy_with(path="/openai/images/generations:submit")
            response = await super().handle_async_request(request)
            operation_location_url = response.headers["operation-location"]
            request.url = httpx.URL(operation_location_url)
            request.method = "GET"
            response = await super().handle_async_request(request)
            await response.aread()

            timeout_secs: int = 120
            start_time = time.time()
            while response.json()["status"] not in ["succeeded", "failed"]:
                if time.time() - start_time > timeout_secs:
                    timeout = {"error": {"code": "Timeout", "message": "Operation polling timed out."}}
                    return httpx.Response(
                        status_code=400,
                        headers=response.headers,
                        content=json.dumps(timeout).encode("utf-8"),
                        request=request,
                    )

                await asyncio.sleep(int(response.headers.get("retry-after")) or 10)
                response = await super().handle_async_request(request)
                await response.aread()

            if response.json()["status"] == "failed":
                error_data = response.json()
                return httpx.Response(
                    status_code=400,
                    headers=response.headers,
                    content=json.dumps(error_data).encode("utf-8"),
                    request=request,
                )

            result = response.json()["result"]
            return httpx.Response(
                status_code=200,
                headers=response.headers,
                content=json.dumps(result).encode("utf-8"),
                request=request,
            )
        return await super().handle_async_request(request)


async def dall_e():
    client = openai.AsyncAzureOpenAI(
        azure_endpoint="<azure_endpoint>",
        api_key="<api_key>",
        api_version="<api_version>",
        http_client=httpx.AsyncClient(
            transport=AsyncCustomHTTPTransport(),
        ),
    )
    image = await client.images.generate(prompt="a cute baby seal")

    print(image.data[0].url)

asyncio.run(dall_e())
```

---

## Name changes

> [!NOTE]
> All a* methods have been removed; the async client must be used instead.

| OpenAI Python 0.28.1 | OpenAI Python 1.x |
| --------------- | --------------- |
| `openai.api_base` | `openai.base_url` |
| `openai.proxy` | `openai.proxies` |
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

- `openai.api_key_path`
- `openai.app_info`
- `openai.debug`
- `openai.log`
- `openai.OpenAIError`
- `openai.Audio.transcribe_raw()`
- `openai.Audio.translate_raw()`
- `openai.ErrorObject`
- `openai.Customer`
- `openai.api_version`
- `openai.verify_ssl_certs`
- `openai.api_type`
- `openai.enable_telemetry`
- `openai.ca_bundle_path`
- `openai.requestssession` (OpenAI now uses `httpx`)
- `openai.aiosession` (OpenAI now uses `httpx`)
- `openai.Deployment` (Previously used for Azure OpenAI)
- `openai.Engine`
- `openai.File.find_matching_files()`
