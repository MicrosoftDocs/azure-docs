---
title: 'Quickstart: Use Azure OpenAI Service with the JavaScript SDK and the completions API'
titleSuffix: Azure OpenAI
description: Walkthrough on how to get started with Azure OpenAI and make your first completions call with the JavaScript SDK. 
services: cognitive-services
manager: nitinme
ms.service: cognitive-services
ms.subservice: openai
ms.topic: include
author: mrbullwinkle
ms.author: mbullwin
ms.date: 07/26/2023
keywords: 
---

[Source code](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/openai/openai) | [Package (npm)](https://www.npmjs.com/package/@azure/openai) | [Samples](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/openai/openai/samples)

## Prerequisites

- An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services?azure-portal=true)
- Access granted to the Azure OpenAI service in the desired Azure subscription.
    Currently, access to this service is granted only by application. You can apply for access to Azure OpenAI Service by completing the form at [https://aka.ms/oai/access](https://aka.ms/oai/access?azure-portal=true).
- [LTS versions of Node.js](https://github.com/nodejs/release#release-schedule)
- An Azure OpenAI Service resource with the text-davinci-003 model deployed. For more information about model deployment, see the [resource deployment guide](../how-to/create-resource.md).

> [!div class="nextstepaction"]
> [I ran into an issue with the prerequisites.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=JAVASCRIPT&Pillar=AOAI&&Product=gpt&Page=quickstart&Section=Prerequisites)

## Set up

### Install the client library

Create a new directory and navigate into that directory.

Install the Azure OpenAI client library for JavaScript with npm:

```console
npm install @azure/openai
```

[!INCLUDE [get-key-endpoint](get-key-endpoint.md)]

[!INCLUDE [environment-variables](environment-variables.md)]


> [!div class="nextstepaction"]
> [I ran into an issue with the setup.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=JAVASCRIPT&Pillar=AOAI&&Product=gpt&Page=quickstart&Section=Set-up-the-environment)

## Create a sample application

Open a command prompt where you created the new project, and create a new file named Completion.js. Copy the following code into the Completion.js file.

```javascript
const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");
const endpoint = process.env["AZURE_OPENAI_ENDPOINT"] ;
const azureApiKey = process.env["AZURE_OPENAI_KEY"] ;

const prompt = ["When was Microsoft founded?"];

async function main() {
  console.log("== Get completions Sample ==");

  const client = new OpenAIClient(endpoint, new AzureKeyCredential(azureApiKey));
  const deploymentId = "text-davinci-003";
  const result = await client.getCompletions(deploymentId, prompt);

  for (const choice of result.choices) {
    console.log(choice.text);
  }
}

main().catch((err) => {
  console.error("The sample encountered an error:", err);
});

module.exports = { main };
```

> [!IMPORTANT]
> For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](../../../key-vault/general/overview.md). For more information about credential security, see the Azure AI services [security](../../security-features.md) article.

```cmd
node.exe Completion.js
```

## Output

```output
== Get completions Sample ==

Microsoft was founded on April 4, 1975.
```

> [!div class="nextstepaction"]
> [I ran into an issue when running the code sample.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=JAVASCRIPT&Pillar=AOAI&&Product=gpt&Page=quickstart&Section=Create-application)

## Clean up resources

If you want to clean up and remove an Azure OpenAI resource, you can delete the resource. Before deleting the resource, you must first delete any deployed models.

- [Portal](../../multi-service-resource.md?pivots=azportal#clean-up-resources)
- [Azure CLI](../../multi-service-resource.md?pivots=azcli#clean-up-resources)

## Next steps

* For more examples, check out the [Azure OpenAI Samples GitHub repository](https://aka.ms/AOAICodeSamples)
