---
#services: cognitive-services
manager: nitinme
author: glharper
ms.author: glharper
ms.service: azure-ai-openai
ms.topic: include
ms.date: 03/04/2024
---

[!INCLUDE [Set up required variables](./use-your-data-common-variables.md)]


## Create a Node application

In a console window (such as cmd, PowerShell, or Bash), create a new directory for your app, and navigate to it. Then run the `npm init` command to create a node application with a _package.json_ file.

```console
npm init
```

## Install the client library

Install the Azure OpenAI client and Azure Identity libraries for JavaScript with npm:

```console
npm install @azure/openai @azure/identity
```

Your app's _package.json_ file will be updated with the dependencies.

## Create a sample application

Open a command prompt where you want the new project, and create a new file named ChatWithOwnData.js. Copy the following code into the ChatWithOwnData.js file.



```javascript
const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");

// Set the Azure and AI Search values from environment variables
const endpoint = process.env["AZURE_OPENAI_ENDPOINT"];
const azureApiKey = process.env["AZURE_OPENAI_API_KEY"];
const searchEndpoint = process.env["AZURE_AI_SEARCH_ENDPOINT"];
const searchKey = process.env["AZURE_AI_SEARCH_API_KEY"];
const searchIndex = process.env["AZURE_AI_SEARCH_INDEX"];
const deploymentId = process.env["AZURE_OPEN_AI_DEPLOYMENT_ID"];

async function main(){
  const client = new OpenAIClient(endpoint, new AzureKeyCredential(azureApiKey));

  const messages = [
    { role: "user", content: "What are the differences between Azure Machine Learning and Azure AI services?" },
  ];

  console.log(`Message: ${messages.map((m) => m.content).join("\n")}`);

  const events = await client.streamChatCompletions(deploymentId, messages, { 
    maxTokens: 128,
    azureExtensionOptions: {
      extensions: [
        {
          type: "AzureCognitiveSearch",
          endpoint: searchEndpoint,
          key: searchKey,
          indexName: searchIndex,
        },
      ],
    },
  });
  for await (const event of events) {
    for (const choice of event.choices) {
      const delta = choice.delta?.content;
      if (delta !== undefined) {
        console.log(`Chatbot: ${delta}`);
      }
    }
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
node.exe ChatWithOwnData.js
```

## Output

```output
Message: What are the differences between Azure Machine Learning and Azure AI services?
Chatbot: Azure 
Chatbot: Machine 
Chatbot: Learning 
Chatbot: is 
Chatbot: a 
Chatbot: cloud-based 
Chatbot: service
...
```

> [!div class="nextstepaction"]
> [I ran into an issue when running the code sample.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=JAVASCRIPT&Pillar=AOAI&Product=ownData&Page=quickstart&Section=Create-application)
