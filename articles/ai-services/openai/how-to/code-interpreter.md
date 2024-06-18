---
title: 'How to use Azure OpenAI Assistants Code Interpreter'
titleSuffix: Azure OpenAI
description: Learn how to use Assistants Code Interpreter
services: cognitive-services
manager: nitinme
ms.service: azure-ai-openai
ms.topic: how-to
ms.date: 05/20/2024
author: mrbullwinkle
ms.author: mbullwin
recommendations: false

---

# Azure OpenAI Assistants Code Interpreter (Preview)

Code Interpreter allows the Assistants API to write and run Python code in a sandboxed execution environment.  With Code Interpreter enabled, your Assistant can run code iteratively to solve more challenging code, math, and data analysis problems. When your Assistant writes code that fails to run, it can iterate on this code by modifying and running different code until the code execution succeeds.

> [!IMPORTANT]
> Code Interpreter has [additional charges](https://azure.microsoft.com/pricing/details/cognitive-services/openai-service/) beyond the token based fees for Azure OpenAI usage. If your Assistant calls Code Interpreter simultaneously in two different threads, two code interpreter sessions are created. Each session is active by default for one hour.

[!INCLUDE [Assistants v2 note](../includes/assistants-v2-note.md)]

## Code interpreter support

### Supported models

The [models page](../concepts/models.md#assistants-preview) contains the most up-to-date information on regions/models where Assistants and code interpreter are supported.

We recommend using assistants with the latest models to take advantage of the new features, as well as the larger context windows, and more up-to-date training data.

### API Versions

- `2024-02-15-preview`
- `2024-05-01-preview`

### Supported file types

|File format|MIME Type|
|---|---|
|.c| text/x-c |
|.cpp|text/x-c++ |
|.csv|application/csv|
|.docx|application/vnd.openxmlformats-officedocument.wordprocessingml.document|
|.html|text/html|
|.java|text/x-java|
|.json|application/json|
|.md|text/markdown|
|.pdf|application/pdf|
|.php|text/x-php|
|.pptx|application/vnd.openxmlformats-officedocument.presentationml.presentation|
|.py|text/x-python|
|.py|text/x-script.python|
|.rb|text/x-ruby|
|.tex|text/x-tex|
|.txt|text/plain|
|.css|text/css|
|.jpeg|image/jpeg|
|.jpg|image/jpeg|
|.js|text/javascript|
|.gif|image/gif|
|.png|image/png|
|.tar|application/x-tar|
|.ts|application/typescript|
|.xlsx|application/vnd.openxmlformats-officedocument.spreadsheetml.sheet|
|.xml|application/xml or "text/xml"|
|.zip|application/zip|

### File upload API reference

Assistants use the [same API for file upload as fine-tuning](/rest/api/azureopenai/files/upload?view=rest-azureopenai-2024-02-15-preview&tabs=HTTP&preserve-view=true). When uploading a file you have to specify an appropriate value for the [purpose parameter](/rest/api/azureopenai/files/upload?view=rest-azureopenai-2024-02-15-preview&tabs=HTTP&preserve-view=true#purpose).

## Enable Code Interpreter

# [Python 1.x](#tab/python)

```python
from openai import AzureOpenAI
    
client = AzureOpenAI(
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),  
    api_version="2024-05-01-preview",
    azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
    )

assistant = client.beta.assistants.create(
  instructions="You are an AI assistant that can write code to help answer math questions",
  model="<REPLACE WITH MODEL DEPLOYMENT NAME>", # replace with model deployment name. 
  tools=[{"type": "code_interpreter"}]
)
```

# [REST](#tab/rest)

> [!NOTE]
> With Azure OpenAI the `model` parameter requires model deployment name. If your model deployment name is different than the underlying model name then you would adjust your code to ` "model": "{your-custom-model-deployment-name}"`.

```console
curl https://YOUR_RESOURCE_NAME.openai.azure.com/openai/assistants?api-version=2024-05-01-preview \
  -H "api-key: $AZURE_OPENAI_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{
    "instructions": "You are an AI assistant that can write code to help answer math questions.",
    "tools": [
      { "type": "code_interpreter" }
    ],
    "model": "gpt-4-1106-preview"
  }'
```

---

## Upload file for Code Interpreter


# [Python 1.x](#tab/python)

```python
from openai import AzureOpenAI
    
client = AzureOpenAI(
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),  
    api_version="2024-05-01-preview",
    azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
    )

# Upload a file with an "assistants" purpose
file = client.files.create(
  file=open("speech.py", "rb"),
  purpose='assistants'
)

# Create an assistant using the file ID
assistant = client.beta.assistants.create(
  instructions="You are an AI assistant that can write code to help answer math questions.",
  model="gpt-4-1106-preview",
  tools=[{"type": "code_interpreter"}],
  file_ids=[file.id]
)
```

# [REST](#tab/rest)

```console
# Upload a file with an "assistants" purpose

curl https://YOUR_RESOURCE_NAME.openai.azure.com/openai/files?api-version=2024-05-01-preview \
  -H "api-key: $AZURE_OPENAI_API_KEY" \
  -F purpose="assistants" \
  -F file="@c:\\path_to_file\\file.csv"

# Create an assistant using the file ID

curl https://YOUR_RESOURCE_NAME.openai.azure.com/openai/assistants?api-version=2024-05-01-preview \
  -H "api-key: $AZURE_OPENAI_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{
    "instructions": "You are an AI assistant that can write code to help answer math questions.",
    "tools": [
      { "type": "code_interpreter" }
    ],
    "model": "gpt-4-1106-preview",
    "file_ids": ["assistant-123abc456"]
  }'
```

---

### Pass file to an individual thread

In addition to making files accessible at the Assistants level you can pass files so they're only accessible to a particular thread.

# [Python 1.x](#tab/python)

```python
from openai import AzureOpenAI
    
client = AzureOpenAI(
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),  
    api_version="2024-05-01-preview",
    azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
    )

thread = client.beta.threads.create(
  messages=[
    {
      "role": "user",
      "content": "I need to solve the equation `3x + 11 = 14`. Can you help me?",
      "file_ids": ["file.id"] # file id will look like: "assistant-R9uhPxvRKGH3m0x5zBOhMjd2" 
    }
  ]
)
```

# [REST](#tab/rest)

```console
curl https://YOUR_RESOURCE_NAME.openai.azure.com/openai/threads/<YOUR-THREAD-ID>/messages?api-version=2024-05-01-preview \
  -H "api-key: $AZURE_OPENAI_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{
    "role": "user",
    "content": "I need to solve the equation `3x + 11 = 14`. Can you help me?",
    "file_ids": ["asssistant-123abc456"]
  }'
```

---

## Download files generated by Code Interpreter

Files generated by Code Interpreter can be found in the Assistant message responses

```json
 {
      "id": "msg_oJbUanImBRpRran5HSa4Duy4",
      "assistant_id": "asst_eHwhP4Xnad0bZdJrjHO2hfB4",
      "content": [
        {
          "image_file": {
            "file_id": "assistant-1YGVTvNzc2JXajI5JU9F0HMD"
          },
          "type": "image_file"
        },
        # ...
 }
```

You can download these generated files by passing the files to the files API:

# [Python 1.x](#tab/python)

```python
from openai import AzureOpenAI
    
client = AzureOpenAI(
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),  
    api_version="2024-05-01-preview",
    azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
    )

image_data = client.files.content("assistant-abc123")
image_data_bytes = image_data.read()

with open("./my-image.png", "wb") as file:
    file.write(image_data_bytes)
```

# [REST](#tab/rest)

```console
curl https://YOUR_RESOURCE_NAME.openai.azure.com/openai/files/<YOUR-FILE-ID>/content?api-version=2024-05-01-preview \
  -H "api-key: $AZURE_OPENAI_API_KEY" \
  --output image.png
```

---

## See also

* [File Upload API reference](/rest/api/azureopenai/files/upload?view=rest-azureopenai-2024-02-15-preview&tabs=HTTP&preserve-view=true)
* [Assistants API Reference](../assistants-reference.md)
* Learn more about how to use Assistants with our [How-to guide on Assistants](../how-to/assistant.md).
* [Azure OpenAI Assistants API samples](https://github.com/Azure-Samples/azureai-samples/tree/main/scenarios/Assistants)
