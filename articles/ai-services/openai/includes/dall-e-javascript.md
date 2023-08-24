---
title: 'Quickstart: Use Azure OpenAI Service with the JavaScript SDK to generate images'
titleSuffix: Azure OpenAI
description: Walkthrough on how to get started with Azure OpenAI and make your first image genration call with the JavaScript SDK. 
services: cognitive-services
manager: nitinme
ms.service: cognitive-services
ms.subservice: openai
ms.topic: include
author: PatrickFarley
ms.author: pafarley
ms.date: 08/24/2023
keywords: 
---

[Source code](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/openai/openai) | [Package (npm)](https://www.npmjs.com/package/@azure/openai) | [Samples](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/openai/Azure.AI.OpenAI/tests/Samples)

## Prerequisites

- An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services?azure-portal=true)
- Access granted to the Azure OpenAI service in the desired Azure subscription.
    Currently, access to this service is granted only by application. You can apply for access to Azure OpenAI Service by completing the form at [https://aka.ms/oai/access](https://aka.ms/oai/access?azure-portal=true).
- [LTS versions of Node.js](https://github.com/nodejs/release#release-schedule)
* Once you have your Azure subscription, <a href="tbd"  title="create an Azure OpenAI resource"  target="_blank">create a Vision resource</a> in the Azure portal to get your key and endpoint. After it deploys, select **Go to resource**.
    * You need the key and endpoint from the resource you create to connect your application to the Azure AI Vision service.
    * You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.


## Set up

### Install the client library

Create a new directory and navigate into that directory.

Install the Azure OpenAI client library for JavaScript with npm:

```console
npm install @azure/openai
```

### Retrieve key and endpoint

To successfully make a call against Azure OpenAI, you need an **endpoint** and a **key**.

|Variable name | Value |
|--------------------------|-------------|
| `ENDPOINT`               | This value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. Alternatively, you can find the value in the **Azure OpenAI Studio** > **Playground** > **Code View**. An example endpoint is: `https://docs-test-001.openai.azure.com/`.|
| `API-KEY` | This value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. You can use either `KEY1` or `KEY2`.|

Go to your resource in the Azure portal. The **Endpoint and Keys** can be found in the **Resource Management** section. Copy your endpoint and access key as you'll need both for authenticating your API calls. You can use either `KEY1` or `KEY2`. Always having two keys allows you to securely rotate and regenerate keys without causing a service disruption.

:::image type="content" source="../media/quickstarts/endpoint.png" alt-text="Screenshot of the overview UI for an OpenAI Resource in the Azure portal with the endpoint and access keys location circled in red." lightbox="../media/quickstarts/endpoint.png":::

Create and assign persistent environment variables for your key and endpoint.

### Environment variables

# [Command Line](#tab/command-line)

```CMD
setx AZURE_OPENAI_KEY "REPLACE_WITH_YOUR_KEY_VALUE_HERE" 
```

```CMD
setx AZURE_OPENAI_ENDPOINT "REPLACE_WITH_YOUR_ENDPOINT_HERE" 
```

# [PowerShell](#tab/powershell)

```powershell
[System.Environment]::SetEnvironmentVariable('AZURE_OPENAI_KEY', 'REPLACE_WITH_YOUR_KEY_VALUE_HERE', 'User')
```

```powershell
[System.Environment]::SetEnvironmentVariable('AZURE_OPENAI_ENDPOINT', 'REPLACE_WITH_YOUR_ENDPOINT_HERE', 'User')
```

# [Bash](#tab/bash)

```Bash
echo export AZURE_OPENAI_KEY="REPLACE_WITH_YOUR_KEY_VALUE_HERE" >> /etc/environment && source /etc/environment
```

```Bash
echo export AZURE_OPENAI_ENDPOINT="REPLACE_WITH_YOUR_ENDPOINT_HERE" >> /etc/environment && source /etc/environment
```
---

> [!div class="nextstepaction"]
> [I ran into an issue with the setup.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=JAVASCRIPT&Pillar=AOAI&Product=Chatgpt&Page=quickstart&Section=Set-up-the-environment)

## Create a sample application

Open a command prompt where you want the new project, and create a new file named _ImageGeneration.js_. Copy the following code into the _ImageGeneration.js_ file.

```javascript
/**
 * Demonstrates how to generate images from prompts using Azure OpenAI Batch Image Generation.
 *
 * @summary generates images from prompts using Azure OpenAI Batch Image Generation.
 * @azsdk-weight 100
 */

const { OpenAIClient, AzureKeyCredential, ImageLocation } = require("@azure/openai");

// Load the .env file if it exists
import * as dotenv from "dotenv";
dotenv.config();

// You will need to set these environment variables or edit the following values
const endpoint = process.env["ENDPOINT"] || "<endpoint>";
const azureApiKey = process.env["AZURE_API_KEY"] || "<api key>";

// The prompt to generate images from
const PROMPT = "a monkey eating a banana";
const SIZE = "256x256";

// The number of images to generate
const N = 3;

export async function main() {
  console.log("== Batch Image Generation ==");

  const client = new OpenAIClient(endpoint, new AzureKeyCredential(azureApiKey));
  let operationState = await client.beginAzureBatchImageGeneration(PROMPT, { n: N, size: SIZE });

  while (operationState.status === "notRunning" || operationState.status === "running") {
    await delay(5000);
    operationState = await client.getAzureBatchImageGenerationOperationStatus(operationState.id);
  }

  if (operationState.status !== "succeeded") {
    throw new Error("Image generation failed");
  }

  console.log(`Image generation succeeded with id: ${operationState.id}`);
  for (const image of operationState.result?.data as ImageLocation[]) {
    console.log(`Image generation result URL: ${image.url}`);
  }
}

main().catch((err) => {
  console.error("The sample encountered an error:", err);
});

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
```

Run the file with the following command:

```cmd
node.exe ChatCompletion.js
```

## Output

```output
tbd
```


## Clean up resources

If you want to clean up and remove an Azure OpenAI resource, you can delete the resource. Before deleting the resource, you must first delete any deployed models.

- [Portal](../../multi-service-resource.md?pivots=azportal#clean-up-resources)
- [Azure CLI](../../multi-service-resource.md?pivots=azcli#clean-up-resources)

## Next steps

* For more examples, check out the [Azure OpenAI Samples GitHub repository](https://aka.ms/AOAICodeSamples)
