---
author: jboback
manager: nitinme
ms.service: azure-ai-language
ms.topic: include
ms.date: 02/13/2023
ms.author: jboback
ms.custom: devx-track-js, ignite-fall-2021
---

[Reference documentation](/javascript/api/overview/azure/ai-language-text-readme) | [Additional samples](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/cognitivelanguage/ai-language-text/samples/v1) | [Package (npm)](https://www.npmjs.com/package/@azure/ai-language-text) | [Library source code](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/cognitivelanguage/ai-language-text) 

Use this quickstart to create a Personally Identifiable Information (PII) detection application with the client library for Node.js. In the following example, you'll create a JavaScript application that can identify [recognized sensitive information](../../concepts/entity-categories.md) in text.

[!INCLUDE [Use Language Studio](../use-language-studio.md)]

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)
* [Node.js](https://nodejs.org/) v14 LTS or later
* Once you have your Azure subscription, <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics"  title="Create a Language resource"  target="_blank">create a Language resource </a> in the Azure portal to get your key and endpoint. After it deploys, select **Go to resource**.
    * you'll need the key and endpoint from the resource you create to connect your application to the API. You'll paste your key and endpoint into the code below later in the quickstart.
    * You can use the free pricing tier (`Free F0`) to try the service, and upgrade later to a paid tier for production.
* To use the Analyze feature, you'll need a Language resource with the standard (S) pricing tier.



## Setting up

### Create a new Node.js application

In a console window (such as cmd, PowerShell, or Bash), create a new directory for your app, and navigate to it. 

```console
mkdir myapp 

cd myapp
```

Run the `npm init` command to create a node application with a `package.json` file. 

```console
npm init
```

### Install the client library

Install the npm package:

```console
npm install @azure/ai-text-analytics
```



## Code example

Open the file and copy the below code. Remember to replace the `key` variable with the key for your resource, and replace the `endpoint` variable with the endpoint for your resource. 

[!INCLUDE [find the key and endpoint for a resource](../../../includes/find-azure-resource-info.md)]

```javascript
"use strict";

const { TextAnalyticsClient, AzureKeyCredential } = require("@azure/ai-text-analytics");
const key = '<paste-your-key-here>';
const endpoint = '<paste-your-endpoint-here>';

//an example document for pii recognition
const documents = [ "The employee's phone number is (555) 555-5555." ];

async function main() {
    console.log(`PII recognition sample`);
  
    const client = new TextAnalyticsClient(endpoint, new AzureKeyCredential(key));
  
    const documents = ["My phone number is 555-555-5555"];
  
    const [result] = await client.analyze("PiiEntityRecognition", documents, "en");
  
    if (!result.error) {
      console.log(`Redacted text: "${result.redactedText}"`);
      console.log("Pii Entities: ");
      for (const entity of result.entities) {
        console.log(`\t- "${entity.text}" of type ${entity.category}`);
      }
    }
}

main().catch((err) => {
console.error("The sample encountered an error:", err);
});
```



## Output

```console
PII recognition sample
Redacted text: "My phone number is ************"
Pii Entities:
        - "555-555-5555" of type PhoneNumber
```
