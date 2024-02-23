---
title: 'Quickstart: Use the OpenAI Service via the Python SDK'
titleSuffix: Azure OpenAI Service
description: Walkthrough on how to get started with Azure OpenAI and make your first completions call with the Python SDK. 
manager: nitinme
author: mrbullwinkle
ms.author: mbullwin
ms.service: azure-ai-openai
ms.topic: include
ms.date: 02/01/2024
---

<a href="https://github.com/openai/openai-python" target="_blank">Library source code</a> | <a href="https://pypi.org/project/openai/" target="_blank">Package (PyPi)</a> |

## Prerequisites

- An Azure subscription - <a href="https://azure.microsoft.com/free/cognitive-services" target="_blank">Create one for free</a>
- Access granted to Azure OpenAI in the desired Azure subscription

    Currently, access to this service is granted only by application. You can apply for access to Azure OpenAI by completing the form at <a href="https://aka.ms/oai/access" target="_blank">https://aka.ms/oai/access</a>. Open an issue on this repo to contact us if you have an issue.
- <a href="https://www.python.org/" target="_blank">Python 3.7.1 or later version</a>
- The following Python libraries: os, json, openai (Version 1.x is required)
- [Jupyter Notebooks](https://jupyter.org/)
- Azure OpenAI Assistants are currently available in Sweden Central, East US 2, and Australia East. For more information about model availability in those regions, see the [models guide](../concepts/models.md).
- We recommend reviewing the [Responsible AI transparency note](/legal/cognitive-services/openai/transparency-note?context=%2Fazure%2Fai-services%2Fopenai%2Fcontext%2Fcontext&tabs=text) and other [Responsible AI resources](/legal/cognitive-services/openai/overview?context=%2Fazure%2Fai-services%2Fopenai%2Fcontext%2Fcontext) to familiarize yourself with the capabilities and limitations of the Azure OpenAI Service.
- An Azure OpenAI resource with the `gpt-4 (1106-preview)` model deployed was used testing this example.

## Set up

Install the OpenAI Python client library with:

```console
pip install openai
```

> [!NOTE]
> This library is maintained by OpenAI. Refer to the [release history](https://github.com/openai/openai-python/releases) to track the latest updates to the library.

## Retrieve key and endpoint

To successfully make a call against the Azure OpenAI service, you'll need the following:

|Variable name | Value |
|--------------------------|-------------|
| `ENDPOINT`               | This value can be found in the **Keys and Endpoint** section when examining your resource from the Azure portal. Alternatively, you can find the value in **Azure OpenAI Studio** > **Playground** > **View code**. An example endpoint is: `https://docs-test-001.openai.azure.com/`.|
| `API-KEY` | This value can be found in the **Keys and Endpoint** section when examining your resource from the Azure portal. You can use either `KEY1` or `KEY2`.|
| `DEPLOYMENT-NAME` | This value will correspond to the custom name you chose for your deployment when you deployed a model. This value can be found under **Resource Management** > **Model Deployments** in the Azure portal or alternatively under **Management** > **Deployments** in Azure OpenAI Studio.|

Go to your resource in the Azure portal. The **Keys and Endpoint** can be found in the **Resource Management** section. Copy your endpoint and access key as you'll need both for authenticating your API calls. You can use either `KEY1` or `KEY2`. Always having two keys allows you to securely rotate and regenerate keys without causing a service disruption.

:::image type="content" source="../media/quickstarts/endpoint.png" alt-text="Screenshot of the overview blade for an OpenAI Resource in the Azure portal with the endpoint & access keys location circled in red." lightbox="../media/quickstarts/endpoint.png":::

Create and assign persistent environment variables for your key and endpoint.

[!INCLUDE [environment-variables](environment-variables.md)]

## Create an assistant

In our code we are going to specify the following values:

| **Name** | **Description** |
|:---|:---|
| **Assistant name** | Your deployment name that is associated with a specific model. |
| **Instructions** | Instructions are similar to system messages this is where you give the model guidance about how it should behave and any context it should reference when generating a response. You can describe the assistant's personality, tell it what it should and shouldn't answer, and tell it how to format responses. You can also provide examples of the steps it should take when answering responses. |
| **Model** | This is where you set which model deployment name to use with your assistant. The retrieval tool requires `gpt-35-turbo (1106)` or `gpt-4 (1106-preview)` model. **Set this value to your deployment name, not the model name unless it is the same.** |
| **Code interpreter** | Code interpreter provides access to a sandboxed Python environment that can be used to allow the model to test and execute code. |

### Tools

An individual assistant can access up to 128 tools including `code interpreter`, as well as any custom tools you create via [functions](../how-to/assistant-functions.md).

Create and run an assistant with the following:

```python
import os
import time
import json
from openai import AzureOpenAI
    
client = AzureOpenAI(
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),  
    api_version="2024-02-15-preview",
    azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
    )

# Create an assistant
assistant = client.beta.assistants.create(
    name="Math Assist",
    instructions="You are an AI assistant that can write code to help answer math questions.",
    tools=[{"type": "code_interpreter"}],
    model="gpt-4-1106-preview" #You must replace this value with the deployment name for your model.
)

# Create a thread
thread = client.beta.threads.create()

# Add a user question to the thread
message = client.beta.threads.messages.create(
    thread_id=thread.id,
    role="user",
    content="I need to solve the equation `3x + 11 = 14`. Can you help me?"
)

# Run the thread
run = client.beta.threads.runs.create(
  thread_id=thread.id,
  assistant_id=assistant.id,
)

# Retrieve the status of the run
run = client.beta.threads.runs.retrieve(
  thread_id=thread.id,
  run_id=run.id
)

status = run.status

# Wait till the assistant has responded
while status not in ["completed", "cancelled", "expired", "failed"]:
    time.sleep(5)
    run = client.beta.threads.runs.retrieve(thread_id=thread.id,run_id=run.id)
    status = run.status

messages = client.beta.threads.messages.list(
  thread_id=thread.id
)

print(messages.model_dump_json(indent=2))
```

## Output

```json
{
  "data": [
    {
      "id": "msg_XOL8597uuV6zIEgaqZtI0KD3",
      "assistant_id": "asst_WKFOCDJ42Ld1bVUfS8w2pt6E",
      "content": [
        {
          "text": {
            "annotations": [],
            "value": "The solution to the equation \\(3x + 11 = 14\\) is \\(x = 1\\)."
          },
          "type": "text"
        }
      ],
      "created_at": 1705892759,
      "file_ids": [],
      "metadata": {},
      "object": "thread.message",
      "role": "assistant",
      "run_id": "run_TSmF4LoU6bX4SD3xp5xDr1ey",
      "thread_id": "thread_hCOKdEZy1diZAAzwDudRqGRc"
    },
    {
      "id": "msg_F25tb90W5xTPqSn4KgU4aMsb",
      "assistant_id": null,
      "content": [
        {
          "text": {
            "annotations": [],
            "value": "I need to solve the equation `3x + 11 = 14`. Can you help me?"
          },
          "type": "text"
        }
      ],
      "created_at": 1705892751,
      "file_ids": [],
      "metadata": {},
      "object": "thread.message",
      "role": "user",
      "run_id": null,
      "thread_id": "thread_hCOKdEZy1diZAAzwDudRqGRc"
    }
  ],
  "object": "list",
  "first_id": "msg_XOL8597uuV6zIEgaqZtI0KD3",
  "last_id": "msg_F25tb90W5xTPqSn4KgU4aMsb",
  "has_more": false
}
```

## Understanding your results

In this example we create an assistant with code interpreter enabled. When we ask the assistant a math question it translates the question into python code and executes the code in sandboxed environment in order to determine the answer to the question. The code the model creates and tests to arrive at an answer is:

```python
    from sympy import symbols, Eq, solve  
      
    # Define the variable  
    x = symbols('x')  
      
    # Define the equation  
    equation = Eq(3*x + 11, 14)  
      
    # Solve the equation  
    solution = solve(equation, x)  
    solution  
```

It is important to remember that while code interpreter gives the model the capability to respond to more complex queries by converting the questions into code and running that code iteratively in the Python sandbox until it reaches a solution, you still need to validate the response to confirm that the model correctly translated your question into a valid representation in code.

<!--We walk through the process of creating assistants with code in much more depth in our [Azure OpenAI Assistants how-to guide](../how-to/assistant.md).-->

## Clean up resources

If you want to clean up and remove an OpenAI resource, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

- [Portal](../../multi-service-resource.md?pivots=azportal#clean-up-resources)
- [Azure CLI](../../multi-service-resource.md?pivots=azcli#clean-up-resources)

## See also

* Learn more about how to use Assistants with our [How-to guide on Assistants](../how-to/assistant.md).
* [Azure OpenAI Assistants API samples](https://github.com/Azure-Samples/azureai-samples/tree/main/scenarios/Assistants)

-->
