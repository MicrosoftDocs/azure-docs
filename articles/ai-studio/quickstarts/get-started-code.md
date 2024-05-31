---
title: Get started building a chat app using the prompt flow SDK
titleSuffix: Azure AI Studio
description: This article provides instructions on how to set up your development environment for Azure AI SDKs.
manager: nitinme
ms.service: azure-ai-studio
ms.custom:
  - build-2024
ms.topic: how-to
ms.date: 5/30/2024
ms.reviewer: dantaylo
ms.author: eur
author: eric-urban
---

# Build a custom chat app in Python using the prompt flow SDK

[!INCLUDE [Feature preview](../includes/feature-preview.md)]

In this quickstart, we walk you through setting up your local development environment with the prompt flow SDK. We write a prompt, run it as part of your app code, trace the LLM calls being made, and run a basic evaluation on the outputs of the LLM.

## Prerequisites

Before you can follow this quickstart, create the resources that you need for your application:
- An [AI Studio hub](../how-to/create-azure-ai-resource.md) for connecting to external resources.
- A [project](../how-to/create-projects.md) for organizing your project artifacts and sharing traces and evaluation runs.
- A [deployed Azure OpenAI](../how-to/deploy-models-openai.md) chat model (gpt-35-turbo or gpt-4)

Complete the [AI Studio playground quickstart](../quickstarts/get-started-playground.md) to create these resources if you haven't already. You can also create these resources by following the [SDK guide to create a hub and project](../how-to/develop/create-hub-project-sdk.md) article.

Also, you must have the necessary permissions to add role assignments for storage accounts in your Azure subscription. Granting permissions (adding role assignment) is only allowed by the **Owner** of the specific Azure resources. You might need to ask your IT admin for help to [grant access to call Azure OpenAI Service using your identity](#grant-access-to-call-azure-openai-service-using-your-identity).

## Grant access to call Azure OpenAI Service using your identity

To use security best practices, instead of API keys we use [Microsoft Entra ID](/entra/fundamentals/whatis) to authenticate with Azure OpenAI using your user identity. 

You or your administrator needs to grant your user identity the **Cognitive Services OpenAI User** role on the Azure AI Services resource that you're using. This role grants you the ability to call the Azure OpenAI service using your user identity.

To grant yourself access to the Azure AI Services resource that you're using:

1. In [AI Studio](https://ai.azure.com), go to your project and select **Settings** from the left pane.
1. In the **Connected resources** section, select the connection name with type **AIServices**.

    :::image type="content" source="../media/quickstarts/promptflow-sdk/project-settings-pick-resource.png" alt-text="Screenshot of the project settings page, highlighting how to select the connected AI services resource to open it." lightbox="../media/quickstarts/promptflow-sdk/project-settings-pick-resource.png":::

    > [!NOTE]
    > If you don't see the **AIServices** connection, use the **Azure OpenAI** connection instead.

1. On the resource details page, select the link under the **Resource** heading to open the AI services resource in the Azure portal.

    :::image type="content" source="../media/quickstarts/promptflow-sdk/project-ai-services-open-in-portal.png" alt-text="Screenshot of the AI Services connection details showing how to open the resource in the Azure portal." lightbox="../media/quickstarts/promptflow-sdk/project-ai-services-open-in-portal.png":::

1. From the left page in the Azure portal, select **Access control (IAM)** > **+ Add** > **Add role assignment**.

1. Search for the **Cognitive Services OpenAI User** role and then select it. Then select **Next**.

    :::image type="content" source="../media/quickstarts/promptflow-sdk/ai-services-add-role-assignment.png" alt-text="Screenshot of the page to select the Cognitive Services OpenAI User role." lightbox="../media/quickstarts/promptflow-sdk/ai-services-add-role-assignment.png":::

1. Select **User, group, or service principal**. Then select **Select members**.

1. In the **Select members** pane that opens, search for the name of the user that you want to add the role assignment for. Select the user and then select **Select**.

    :::image type="content" source="../media/quickstarts/promptflow-sdk/ai-services-resource-role-assignment.png" alt-text="Screenshot of the page with the user being assigned the new role." lightbox="../media/quickstarts/promptflow-sdk/ai-services-resource-role-assignment.png":::

1. Continue through the wizard and select **Review + assign** to add the role assignment. 

## Install the Azure CLI and login 

Now we install the Azure CLI and login from your local development environment, so that you can use your user credentials to call the Azure OpenAI service.

In most cases you can install the Azure CLI from your terminal using the following command: 
# [Windows](#tab/windows)

```powershell 
winget install -e --id Microsoft.AzureCLI
```

# [Linux](#tab/linux)

```bash
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
```

# [macOS](#tab/macos)

```bash
brew update && brew install azure-cli
```

---

You can follow instructions [How to install the Azure CLI](/cli/azure/install-azure-cli) if these commands don't work for your particular operating system or setup.

After you install the Azure CLI, login using the ``az login`` command and sign-in using the browser:
```
az login
```

Now we create our app and call the Azure OpenAI Service from code.

## Create a new Python environment

First we need to create a new Python environment we can use to install the prompt flow SDK packages. DO NOT install packages into your global python installation. You should always use a virtual or conda environment when installing python packages, otherwise you can break your global install of Python.

### If needed, install Python

We recommend using Python 3.10 or later, but having at least Python 3.8 is required. If you don't have a suitable version of Python installed, you can follow the instructions in the [VS Code Python Tutorial](https://code.visualstudio.com/docs/python/python-tutorial#_install-a-python-interpreter) for the easiest way of installing Python on your operating system.

### Create a virtual environment

If you already have Python 3.10 or higher installed, you can create a virtual environment using the following commands:

# [Windows](#tab/windows)

```bash
py -3 -m venv .venv
.venv\scripts\activate
```

# [Linux](#tab/linux)

```bash
python3 -m venv .venv
source .venv/bin/activate
```

# [macOS](#tab/macos)

```bash
python3 -m venv .venv
source .venv/bin/activate
```

---

Activating the Python environment means that when you run ```python``` or ```pip``` from the command line, you'll be using the Python interpreter contained in the ```.venv``` folder of your application.

> [!NOTE]
> You can use the ```deactivate``` command to exit the python virtual environment, and can later reactivate it when needed.

## Install the prompt flow SDK

In this section, we use prompt flow to build our application. [Prompt flow](https://microsoft.github.io/promptflow/) is a suite of development tools designed to streamline the end-to-end development cycle of LLM-based AI applications, from ideation, prototyping, testing, evaluation to production deployment and monitoring.

Use pip to install the prompt flow SDK into the virtual environment that you created.
```
pip install promptflow
pip install azure-identity
```

The prompt flow SDK takes a dependency on multiple packages, that you can choose to separately install if you don't want all of them:
 * ```promptflow-core```: contains the core prompt flow runtime used for executing LLM code
 * ```promptflow-tracing```: lightweight library used for emitting OpenTelemetry traces in standards
 * ```promptflow-devkit```: contains the prompt flow test bed and trace viewer tools for local development environments
 * ```openai```: client libraries for using the Azure OpenAI service
 * ```python-dotenv```: used to set environment variables by reading them from ```.env``` files

## Configure your environment variables

Your AI services endpoint and deployment name are required to call the Azure OpenAI service from your code. In this quickstart, you save these values in a ```.env``` file, which is a file that contains environment variables that your application can read. You can find these values in the AI Studio chat playground. 

1. Create a ```.env``` file, and paste the following code:
    ```
    AZURE_OPENAI_ENDPOINT=endpoint_value
    AZURE_OPENAI_DEPLOYMENT_NAME=deployment_name
    AZURE_OPENAI_API_VERSION=2024-02-15-preview
    ```

1. Navigate to the [chat playground inside of your AI Studio project](./get-started-playground.md#chat-in-the-playground-without-your-data). First validate that chat is working with your model by sending a message to the LLM.
1. Find the Azure OpenAI deployment name in the chat playground. Select the deployment in the dropdown and hover over the deployment name to view it. In this example, the deployment name is **gpt-35-turbo-16k**.

    :::image type="content" source="../media/quickstarts/promptflow-sdk/playground-deployment-view-code.png" alt-text="Screenshot of the AI Studio chat playground opened, highlighting the deployment name and the view code button." lightbox="../media/quickstarts/promptflow-sdk/playground-deployment-view-code.png":::

1. In the ```.env``` file, replace ```deployment_name``` with the name of the deployment from the previous step. In this example, we're using the deployment name ```gpt-35-turbo-16k```. 
1. Select the **<\> View Code** button and copy the endpoint value.

    :::image type="content" source="../media/quickstarts/promptflow-sdk/playground-copy-endpoint.png" alt-text="Screenshot of the view code popup highlighting the button to copy the endpoint value." lightbox="../media/quickstarts/promptflow-sdk/playground-copy-endpoint.png":::

1. In the ```.env``` file, replace ```endpoint_value``` with the endpoint value copied from the dialog in the previous step. 

> [!WARNING]
> Key based authentication is supported but isn't recommended by Microsoft. If you want to use keys you can add your key to the ```.env```, but please ensure that your ```.env``` is in your ```.gitignore``` file so that you don't accidentally checked into your git repository.

## Create a basic chat prompt and app

First create a prompt template file, for this we'll use **Prompty** which is the prompt template format supported by prompt flow.

Create a ```chat.prompty``` file and copy the following code into it:

```yaml
---
name: Chat Prompt
description: A basic prompt that uses the chat API to answer questions
model:
    api: chat
    configuration:
        type: azure_openai
    parameters:
        max_tokens: 256
        temperature: 0.2
inputs:
    chat_input:
        type: string
    chat_history:
        type: list
        is_chat_history: true
        default: []
outputs:   
  response:
    type: string
sample:
    chat_input: What is the meaning of life?
---
system:
You are an AI assistant who helps people find information.

{% for item in history %}
{{item.role}}:
{{item.content}}
{% endfor %}

user:
{{chat_input}}
```

Now let's create a Python file that uses this prompt template. Create a ```chat.py``` file and paste the following code into it:
```Python
import os
from dotenv import load_dotenv
load_dotenv()

from promptflow.core import Prompty, AzureOpenAIModelConfiguration

model_config = AzureOpenAIModelConfiguration(
    azure_deployment=os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME"),
    api_version=os.getenv("AZURE_OPENAI_API_VERSION"),
    azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT")
)

prompty = Prompty.load("chat.prompty", model={'configuration': model_config})
result = prompty(
    chat_history=[
        {"role": "user", "content": "Does Azure OpenAI support customer managed keys?"},
        {"role": "assistant", "content": "Yes, customer managed keys are supported by Azure OpenAI."}
    ],
    chat_input="Do other Azure AI services support this too?")

print(result)
```

Now from your console, run the Python code:
```
python chat.py
```

You should now see the output from running the prompty:
```
Yes, other Azure AI services also support various capabilities and features. Some of the Azure AI services include Azure Cognitive Services, Azure Machine Learning, Azure Bot Service, and Azure Databricks. Each of these services offers different AI capabilities and can be used for various use cases. If you have a specific service or capability in mind, feel free to ask for more details.
```

## Trace the execution of your chat code

Now we take a look at how prompt flow tracing can provide insights into the various LLM calls that are happening in our Python scripts.

At the start of your ```chat.py``` file, add the following code to enable prompt flow tracing:
```Python
from promptflow.tracing import start_trace
start_trace()
```

Rerun your ```chat.py``` again:
```bash
python chat.py
```

This time you see a link in the output to view a prompt flow trace of the execution:
```terminal
Starting prompt flow service...
Start prompt flow service on port 23333, version: 1.10.1.
You can stop the prompt flow service with the following command:'pf service stop'.
Alternatively, if no requests are made within 1 hours, it will automatically stop.
You can view the trace detail from the following URL:
http://localhost:23333/v1.0/ui/traces/?#collection=aistudio-python-quickstart&uiTraceId=0x59e8b9a3a23e4e8893ec2e53d6e1e521
```

If you select that link, you'll then see the trace showing the steps of the program execution, what was passed to the LLM and the response output.

:::image type="content" source="../media/quickstarts/promptflow-sdk/promptflow-tracing.png" alt-text="Screenshot of the trace showing the steps of the program execution." lightbox="../media/quickstarts/promptflow-sdk/promptflow-tracing.png":::

Prompt flow tracing also allows you to trace specific function calls and log traces to AI Studio, for more information be sure to check out [How to use tracing in the prompt flow SDK](../how-to/develop/trace-local-sdk.md).

## Evaluate your prompt

Now let's show how we can use prompt flow evaluators to generate metrics that can score the quality of the conversation on a scale from 0 to 5. We run the prompt again but this time we store the results into an array containing the full conversation, and then pass that to a ```ChatEvaluator``` to score.

First, install the ```promptflow-evals package```:
```
pip install promptflow-evals
```

Now copy the following code to an ```evaluate.py``` file:
```Python
import os
from dotenv import load_dotenv
load_dotenv()

from promptflow.core import Prompty, AzureOpenAIModelConfiguration
from promptflow.evals.evaluators import ChatEvaluator

model_config = AzureOpenAIModelConfiguration(
    azure_deployment=os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME"),
    api_version=os.getenv("AZURE_OPENAI_API_VERSION"),
    azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT")
)

chat_history=[
    {"role": "user", "content": "Does Azure OpenAI support customer managed keys?"},
    {"role": "assistant", "content": "Yes, customer managed keys are supported by Azure OpenAI."}
]
chat_input="Do other Azure AI services support this too?"

prompty = Prompty.load("chat.prompty", model={'configuration': model_config})
response = prompty(chat_history=chat_history, chat_input=chat_input)

conversation = chat_history
conversation += [
    {"role": "user", "content": chat_input},
    {"role": "assistant", "content": response}
]

chat_eval = ChatEvaluator(model_config=model_config)
score = chat_eval(conversation=conversation)

print(score)
```

Run the ```evaluate.py``` script:
```
python evaluate.py
```

You should see an output that looks like this:
```
{'gpt_coherence': 5.0, 'gpt_fluency': 5.0, 'evaluation_per_turn': {'gpt_coherence': {'score': [5.0, 5.0]}, 'gpt_fluency': {'score': [5.0, 5.0]}}}
```

Looks like we scored 5 for coherence and fluency of the LLM responses on this conversation! 

For more information on how to use prompt flow evaluators, including how to make your own custom evaluators and log evaluation results to AI Studio, be sure to check out [Evaluate your app using the prompt flow SDK](../how-to/develop/flow-evaluate-sdk.md).


## Related content

- [Quickstart: Create a project and use the chat playground in Azure AI Studio](./get-started-playground.md)
- [Work with projects in VS Code](../how-to/develop/vscode.md)
- [Overview of the Azure AI SDKs](../how-to/develop/sdk-overview.md)
