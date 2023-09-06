---
services: cognitive-services
manager: nitinme
author: glharper
ms.author: glharper
ms.service: cognitive-services
ms.subservice: openai
ms.topic: include
ms.date: 09/06/2023
---

## Set up

[!INCLUDE [Set up required variables](./use-your-data-common-variables.md)]


> [!div class="nextstepaction"]
> [I ran into an issue with the setup.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=JAVASCRIPT&Pillar=AOAI&Product=ownData&Page=quickstart&Section=Set-up-the-environment)

## Create a Node application

In a console window (such as cmd, PowerShell, or Bash), create a new directory for your app, and navigate to it. Then run the `npm init` command to create a node application with a _package.json_ file.

```console
npm init
```

## Install the client library

Install the Azure OpenAI client library for JavaScript with npm:

```console
npm install @azure/openai
```

Your app's _package.json_ file will be updated with the dependencies.

## Create a sample application

Open a command prompt where you want the new project, and create a new file named ChatWithOwnData.js. Copy the following code into the ChatWithOwnData.js file.

```javascript
const { OpenAIClient } = require("@azure/openai");
const { DefaultAzureCredential } = require("@azure/identity")
const endpoint = process.env["AOAIEndpoint"];
const azureApiKey = process.env["AOAIKey"];
const searchEndpoint = process.env["SearchEndpoint"];
const searchKey = process.env["SearchKey"];
const searchIndex = process.env["SearchIndex"];
const deploymentId = process.env["AOAIDeploymentId"];

async function main() {
  console.log("== Chat Using Your Own Data Sample ==");
  const client = new OpenAIClient(endpoint, new AzureKeyCredential(azureApiKey));

  const messages = [
    { role: "user", content: "What are the differences between Azure Machine Learning and Azure AI services?" },
  ];

  const events = client.listChatCompletions(deploymentId, messages, { 
    azureExtensionOptions: {
      extensions: [
        {
          type: "AzureCognitiveSearch",
          parameters: {
            endpoint: searchEndpoint,
            key: searchKey,
            indexName: searchIndex,
          },
        },
      ],
    },
  });
  for await (const event of events) {
    for (const choice of event.choices) {
      const delta = choice.delta?.content;
      const role = choice.delta?.role;
      if (delta !== undefined && role !== undefined) {
        console.log(`${role}: ${delta}`);

        const contextMessages = choice.delta?.context?.messages;
        if (!!contextMessages) {
            console.log("===");

            console.log("Context information (e.g. citations) from chat extensions:");
            console.log("===");
            for (const message of contextMessages) {
                console.log(message.content);
            }
        }
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
== Chat With Your Own Data Sample ==
assistant: Azure Machine Learning is a cloud-based service that provides tools and services to build, train, and deploy machine learning models. It offers a collaborative environment for data scientists, developers, and domain experts to work together on machine learning projects. Azure Machine Learning supports various programming languages, frameworks, and libraries, including Python, R, TensorFlow, and PyTorch [^1^].
===
Context information (e.g. citations) from chat extensions:
===
tool: {
  'citations': [
    {
      'content': '...',
      'id': null,
      'title': '...',
      'filepath': '...',
      'url': '...',
      'metadata': {
        "chunking': 'orignal document size=1011. Scores=3.6390076 and None.Org Highlight count=38.'
      },
      'chunk_id': '2'
    },
    ...
  ],
  'intent': '[\u0022What are the differences between Azure Machine Learning and Azure AI services?\u0022]'
}

```

> [!div class="nextstepaction"]
> [I ran into an issue when running the code sample.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=JAVASCRIPT&Pillar=AOAI&Product=ownData&Page=quickstart&Section=Create-application)

## Clean up resources

If you want to clean up and remove an Azure OpenAI resource, you can delete the resource. Before deleting the resource, you must first delete any deployed models.

- [Portal](../../multi-service-resource.md?pivots=azportal#clean-up-resources)
- [Azure CLI](../../multi-service-resource.md?pivots=azcli#clean-up-resources)

## Next steps

* For more examples, check out the [Azure OpenAI Samples GitHub repository](https://aka.ms/AOAICodeSamples)

