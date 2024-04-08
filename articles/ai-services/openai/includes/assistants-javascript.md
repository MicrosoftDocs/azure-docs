---
title: 'Quickstart: Use the OpenAI Service via the JavaScript SDK'
titleSuffix: Azure OpenAI Service
description: Walkthrough on how to get started with Azure OpenAI and make your first completions call with the JavaScript SDK. 
manager: nitinme
author: mrbullwinkle
ms.author: mbullwin
ms.service: azure-ai-openai
ms.topic: include
ms.date: 04/08/2024
---

<a href="/javascript/api/@azure/openai-assistants" target="_blank">Reference documentation</a> | <a href="https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/openai/openai-assistants" target="_blank">Library source code</a> | <a href="https://www.npmjs.com/package/@azure/openai-assistants" target="_blank">Package (npm)</a> |

## Prerequisites

- An Azure subscription - <a href="https://azure.microsoft.com/free/cognitive-services" target="_blank">Create one for free</a>
- Access granted to Azure OpenAI in the desired Azure subscription

    Currently, access to this service is granted only by application. You can apply for access to Azure OpenAI by completing the form at <a href="https://aka.ms/oai/access" target="_blank">https://aka.ms/oai/access</a>. Open an issue on this repo to contact us if you have an issue.
- <a href="https://nodejs.org/" target="_blank">Node.js LTS with TypeScript or ESM support.</a>
- The following npm packages are required: 
- Azure OpenAI Assistants are currently available in Sweden Central, East US 2, and Australia East. For more information about model availability in those regions, see the [models guide](../concepts/models.md).
- We recommend reviewing the [Responsible AI transparency note](/legal/cognitive-services/openai/transparency-note?context=%2Fazure%2Fai-services%2Fopenai%2Fcontext%2Fcontext&tabs=text) and other [Responsible AI resources](/legal/cognitive-services/openai/overview?context=%2Fazure%2Fai-services%2Fopenai%2Fcontext%2Fcontext) to familiarize yourself with the capabilities and limitations of the Azure OpenAI Service.
- An Azure OpenAI resource with the `gpt-4 (1106-preview)` model deployed was used testing this example.

## Set up

Install the OpenAI Assistants client library for JavaScript with:

```console
npm install @azure/openai-assistants
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

Create and run an assistant with the following:

#### [TypeScript](#tab/typescript)

```typescript
import {
  AssistantsClient,
  AssistantCreationOptions,
  ToolDefinition,
  Assistant,
  AssistantThread,
  ThreadMessage,
  ThreadRun,
  ListResponseOf,
} from "@azure/openai-assistants";
import { DefaultAzureCredential } from "@azure/identity";

import "dotenv/config";

// Recommended for secure credential management
// const azureOpenAIEndpoint = process.env.AZURE_OPENAI_ENDPOINT as string;
// if (!azureOpenAIEndpoint) {
//   throw new Error(
//     "Please ensure to set AZURE_OPENAI_ENDPOINT in your environment variables."
//   );
// }
// const getClient = (): AssistantsClient => {
//   const credential = new DefaultAzureCredential();
//   const assistantsClient = new AssistantsClient(azureOpenAIEndpoint, credential);
//   return assistantsClient;  
// }

// Not recommended - for local demo purposes only
const azureOpenAIKey = process.env.AZURE_OPENAI_API_KEY as string;
const azureOpenAIEndpoint = process.env.AZURE_OPENAI_ENDPOINT as string;
const credential = new AzureKeyCredential(azureOpenAIKey);
const getClient = (): AssistantsClient => {
  const assistantsClient = new AssistantsClient(azureOpenAIEndpoint, credential);
  return assistantsClient;
}

const assistantsClient: AssistantsClient = getClient();

const options: AssistantCreationOptions = {
  model: "gpt-4-1106-preview", // Deployment name seen in Azure AI Studio
  name: "Math Tutor",
  instructions:
    "You are a personal math tutor. Write and run JavaScript code to answer math questions.",
  tools: [{ type: "code_interpreter" } as ToolDefinition],
};
const role = "user";
const message = "I need to solve the equation `3x + 11 = 14`. Can you help me?";
const message2 = "What is 3x + 11 = 14?";

// Create an assistant
const assistantResponse: Assistant = await assistantsClient.createAssistant(options);
console.log(`Assistant created: ${JSON.stringify(assistantResponse)}`);

// Create a thread
const assistantThread: AssistantThread = await assistantsClient.createThread({});
console.log(`Thread created: ${JSON.stringify(assistantThread)}`);

// Add a user question to the thread
const threadResponse: ThreadMessage = await assistantsClient.createMessage(
  assistantThread.id,
  role,
  message
);
console.log(`Message created:  ${JSON.stringify(threadResponse)}`);

// Run the thread
let runResponse: ThreadRun = await assistantsClient.createRun(assistantThread.id, {
  assistantId: assistantResponse.id,
});
console.log(`Run created:  ${JSON.stringify(runResponse)}`);

// Wait for the assistant to respond
do {
  await new Promise((r) => setTimeout(r, 500));
  runResponse = await assistantsClient.getRun(
    assistantThread.id,
    runResponse.id
  );
} while (
  runResponse.status === "queued" ||
  runResponse.status === "in_progress"
);

// Get the messages
const runMessages: ListResponseOf<ThreadMessage> = await assistantsClient.listMessages(assistantThread.id);
for (const runMessageDatum of runMessages.data) {
  for (const item of runMessageDatum.content) {
    if (item.type === "text") {
      console.log(`Message content: ${JSON.stringify(item.text?.value)}`);
    }
  }
}
```

#### [JavaScript](#tab/javascript)

```javascript
import {
  AssistantsClient
} from "@azure/openai-assistants";
import { DefaultAzureCredential } from "@azure/identity";

import "dotenv/config";

// Recommended for secure credential management
// const azureOpenAIEndpoint = process.env.AZURE_OPENAI_ENDPOINT;
// if (!azureOpenAIEndpoint) {
//   throw new Error(
//     "Please ensure to set AZURE_OPENAI_ENDPOINT in your environment variables."
//   );
// }
// const getClient = () => {
//   const credential = new DefaultAzureCredential();
//   const assistantsClient = new AssistantsClient(azureOpenAIEndpoint, credential);
//   return assistantsClient;  
// }

// Not recommended - for local demo purposes only
const azureOpenAIKey = process.env.AZURE_OPENAI_API_KEY as string;
const azureOpenAIEndpoint = process.env.AZURE_OPENAI_ENDPOINT as string;
const credential = new AzureKeyCredential(azureOpenAIKey);
const getClient = (): AssistantsClient => {
  const assistantsClient = new AssistantsClient(azureOpenAIEndpoint, credential);
  return assistantsClient;
}

const assistantsClient = getClient();

const options = {
  model: "gpt-4-1106-preview", // Deployment name seen in Azure AI Studio
  name: "Math Tutor",
  instructions:
    "You are a personal math tutor. Write and run JavaScript code to answer math questions.",
  tools: [{ type: "code_interpreter" }],
};
const role = "user";
const message = "I need to solve the equation `3x + 11 = 14`. Can you help me?";
const message2 = "What is 3x + 11 = 14?";

// Create an assistant
const assistantResponse = await assistantsClient.createAssistant(options);
console.log(`Assistant created: ${JSON.stringify(assistantResponse)}`);

// Create a thread
const assistantThread = await assistantsClient.createThread({});
console.log(`Thread created: ${JSON.stringify(assistantThread)}`);

// Add a user question to the thread
const threadResponse = await assistantsClient.createMessage(
  assistantThread.id,
  role,
  message
);
console.log(`Message created:  ${JSON.stringify(threadResponse)}`);

// Run the thread
let runResponse = await assistantsClient.createRun(assistantThread.id, {
  assistantId: assistantResponse.id,
});
console.log(`Run created:  ${JSON.stringify(runResponse)}`);

// Wait for the assistant to respond
do {
  await new Promise((r) => setTimeout(r, 500));
  runResponse = await assistantsClient.getRun(
    assistantThread.id,
    runResponse.id
  );
} while (
  runResponse.status === "queued" ||
  runResponse.status === "in_progress"
);

// Get the messages
const runMessages = await assistantsClient.listMessages(assistantThread.id);
for (const runMessageDatum of runMessages.data) {
  for (const item of runMessageDatum.content) {
    if (item.type === "text") {
      console.log(`Message content: ${JSON.stringify(item.text?.value)}`);
    }
  }
}
```

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

- [Portal](../../multi-service-resource.md?pivots=azportal#clean-up-resources)
- [Azure CLI](../../multi-service-resource.md?pivots=azcli#clean-up-resources)

## See also

* Learn more about how to use Assistants with our [How-to guide on Assistants](../how-to/assistant.md).
* [Azure OpenAI Assistants API samples](https://github.com/Azure-Samples/azureai-samples/tree/main/scenarios/Assistants)

