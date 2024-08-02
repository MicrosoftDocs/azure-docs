---
title: 'Quickstart: Use the OpenAI Service via the JavaScript SDK'
titleSuffix: Azure OpenAI Service
description: Walkthrough on how to get started with Azure OpenAI and make your first completions call with the JavaScript SDK. 
manager: nitinme
author: mrbullwinkle
ms.author: mbullwin
ms.service: azure-ai-openai
ms.topic: include
ms.date: 05/30/2024
ms.custom: passwordless-js, devex-track-javascript
---

<a href="/javascript/api/@azure/openai-assistants" target="_blank">Reference documentation</a> | <a href="https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/openai/openai-assistants" target="_blank">Library source code</a> | <a href="https://www.npmjs.com/package/@azure/openai-assistants" target="_blank">Package (npm)</a> |

## Prerequisites

- An Azure subscription - <a href="https://azure.microsoft.com/free/cognitive-services" target="_blank">Create one for free</a>
- <a href="https://nodejs.org/" target="_blank">Node.js LTS with TypeScript or ESM support.</a>
- [Azure CLI](/cli/azure/install-azure-cli) used for passwordless authentication in a local development environment, create the necessary context by signing in with the Azure CLI. 
- An Azure OpenAI resource with a [compatible model in a supported region](../concepts/models.md#assistants-preview).
- We recommend reviewing the [Responsible AI transparency note](/legal/cognitive-services/openai/transparency-note?context=%2Fazure%2Fai-services%2Fopenai%2Fcontext%2Fcontext&tabs=text) and other [Responsible AI resources](/legal/cognitive-services/openai/overview?context=%2Fazure%2Fai-services%2Fopenai%2Fcontext%2Fcontext) to familiarize yourself with the capabilities and limitations of the Azure OpenAI Service.
- An Azure OpenAI resource with the `gpt-4 (1106-preview)` model deployed was used testing this example. 

## Passwordless authentication is recommended

For passwordless authentication, you need to 

1. Use the `@azure/identity` package.
1. Assign the `Cognitive Services User` role to your user account. This can be done in the Azure portal under **Access control (IAM)** > **Add role assignment**.
1. Sign in with the Azure CLI such as `az login`.

## Set up

1. Install the OpenAI Assistants client library for JavaScript with:

    ```console
    npm install openai
    ```

2. For the **recommended** passwordless authentication:

    ```console
    npm install @azure/identity
    ```

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

Add additional environment variables for the deployment name and API version: 
* `AZURE_OPENAI_DEPLOYMENT_NAME`: Your deployment name as shown in the Azure portal.
* `OPENAI_API_VERSION`: Learn more about [API Versions](/azure/ai-services/openai/concepts/model-versions).

Create and assign persistent environment variables for your key and endpoint.

# [Command Line](#tab/command-line)

```cmd
setx AZURE_OPENAI_DEPLOYMENT_NAME "REPLACE_WITH_YOUR_DEPLOYMENT_NAME" 
setx OPENAI_API_VERSION "REPLACE_WITH_YOUR_API_VERSION" 
```

# [PowerShell](#tab/powershell)

```powershell
[System.Environment]::SetEnvironmentVariable('AZURE_OPENAI_DEPLOYMENT_NAME', 'REPLACE_WITH_YOUR_DEPLOYMENT_NAME', 'User')
[System.Environment]::SetEnvironmentVariable('OPENAI_API_VERSION', 'REPLACE_WITH_YOUR_API_VERSION', 'User')
```

# [Bash](#tab/bash)

```bash
export AZURE_OPENAI_DEPLOYMENT_NAME="REPLACE_WITH_YOUR_DEPLOYMENT_NAME"
export OPENAI_API_VERSION="REPLACE_WITH_YOUR_API_VERSION"
```

---

## Create an assistant

In our code we are going to specify the following values:

| **Name** | **Description** |
|:---|:---|
| **Assistant name** | Your deployment name that is associated with a specific model. |
| **Instructions** | Instructions are similar to system messages this is where you give the model guidance about how it should behave and any context it should reference when generating a response. You can describe the assistant's personality, tell it what it should and shouldn't answer, and tell it how to format responses. You can also provide examples of the steps it should take when answering responses. |
| **Model** | This is the deployment name. |
| **Code interpreter** | Code interpreter provides access to a sandboxed Python environment that can be used to allow the model to test and execute code. |

### Tools

An individual assistant can access up to 128 tools including `code interpreter`, as well as any custom tools you create via [functions](../how-to/assistant-functions.md).

#### [TypeScript](#tab/typescript)

Sign in to Azure with `az login` then create and run an assistant with the following **recommended** passwordless TypeScript module (index.ts):

:::code language="typescript" source="~/azure-typescript-e2e-apps/quickstarts/azure-openai-assistants/ts/src/index.ts" :::

To use the service key for authentication, you can create and run an assistant with the following TypeScript module (index.ts):

:::code language="typescript" source="~/azure-typescript-e2e-apps/quickstarts/azure-openai-assistants/ts/src/index-using-password.ts" :::

#### [JavaScript](#tab/javascript)

Sign in to Azure with `az login` then create and run an assistant with the following **recommended** passwordless Javascript module (index.mjs):

:::code language="javascript" source="~/azure-typescript-e2e-apps/quickstarts/azure-openai-assistants/js/src/index.mjs" :::

To use the service key for authentication, you can create and run an assistant with the following JavaScript module (index.mjs):

:::code language="javascript" source="~/azure-typescript-e2e-apps/quickstarts/azure-openai-assistants/js/src/index-using-password.mjs" :::


--- 

## Output

```console
Assistant created: {"id":"asst_zXaZ5usTjdD0JGcNViJM2M6N","createdAt":"2024-04-08T19:26:38.000Z","name":"Math Tutor","description":null,"model":"daisy","instructions":"You are a personal math tutor. Write and run JavaScript code to answer math questions.","tools":[{"type":"code_interpreter"}],"fileIds":[],"metadata":{}}
Thread created: {"id":"thread_KJuyrB7hynun4rvxWdfKLIqy","createdAt":"2024-04-08T19:26:38.000Z","metadata":{}}
Message created:  {"id":"msg_o0VkXnQj3juOXXRCnlZ686ff","createdAt":"2024-04-08T19:26:38.000Z","threadId":"thread_KJuyrB7hynun4rvxWdfKLIqy","role":"user","content":[{"type":"text","text":{"value":"I need to solve the equation `3x + 11 = 14`. Can you help me?","annotations":[]},"imageFile":{}}],"assistantId":null,"runId":null,"fileIds":[],"metadata":{}}
Created run
Run created:  {"id":"run_P8CvlouB8V9ZWxYiiVdL0FND","object":"thread.run","status":"queued","model":"daisy","instructions":"You are a personal math tutor. Write and run JavaScript code to answer math questions.","tools":[{"type":"code_interpreter"}],"metadata":{},"usage":null,"assistantId":"asst_zXaZ5usTjdD0JGcNViJM2M6N","threadId":"thread_KJuyrB7hynun4rvxWdfKLIqy","fileIds":[],"createdAt":"2024-04-08T19:26:39.000Z","expiresAt":"2024-04-08T19:36:39.000Z","startedAt":null,"completedAt":null,"cancelledAt":null,"failedAt":null}
Message content: "The solution to the equation \\(3x + 11 = 14\\) is \\(x = 1\\)."
Message content: "Yes, of course! To solve the equation \\( 3x + 11 = 14 \\), we can follow these steps:\n\n1. Subtract 11 from both sides of the equation to isolate the term with x.\n2. Then, divide by 3 to find the value of x.\n\nLet me calculate that for you."
Message content: "I need to solve the equation `3x + 11 = 14`. Can you help me?"
```

It is important to remember that while the code interpreter gives the model the capability to respond to more complex queries by converting the questions into code and running that code iteratively in JavaScript until it reaches a solution, you still need to validate the response to confirm that the model correctly translated your question into a valid representation in code.

## Clean up resources

If you want to clean up and remove an Azure OpenAI resource, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

- [Azure portal](../../multi-service-resource.md?pivots=azportal#clean-up-resources)
- [Azure CLI](../../multi-service-resource.md?pivots=azcli#clean-up-resources)

## Sample code

* [Quickstart sample code](https://github.com/Azure-Samples/azure-typescript-e2e-apps/tree/main/quickstarts/azure-openai-assistants)

## See also

* Learn more about how to use Assistants with our [How-to guide on Assistants](../how-to/assistant.md).
* [Azure OpenAI Assistants API samples](https://github.com/Azure-Samples/azureai-samples/tree/main/scenarios/Assistants)

