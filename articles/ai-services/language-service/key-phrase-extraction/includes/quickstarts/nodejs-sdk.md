---
author: jboback
manager: nitinme
ms.service: azure-ai-language
ms.topic: include
ms.date: 12/19/2023
ms.author: jboback
ms.custom: devx-track-js
---

[Reference documentation](/javascript/api/overview/azure/ai-language-text-readme) | [More samples](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/cognitivelanguage/ai-language-text/samples/v1) | [Package (npm)](https://www.npmjs.com/package/@azure/ai-language-text) | [Library source code](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/cognitivelanguage/ai-language-text) 

Use this quickstart to create a key phrase extraction application with the client library for Node.js. In the following example, you create a JavaScript application that can identify key words and phrases found in text.


## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)
* [Node.js](https://nodejs.org/) v14 LTS or later


## Setting up

[!INCLUDE [Create an Azure resource](../../../includes/create-resource.md)]



[!INCLUDE [Get your key and endpoint](../../../includes/get-key-endpoint.md)]



[!INCLUDE [Create environment variables](../../../includes/environment-variables.md)]


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
npm install @azure/ai-language-text
```


## Code example

Open the file and copy the below code. Then run the code.  

```javascript
"use strict";

const { TextAnalyticsClient, AzureKeyCredential } = require("@azure/ai-text-analytics");

// This example requires environment variables named "LANGUAGE_KEY" and "LANGUAGE_ENDPOINT"
const key = process.env.LANGUAGE_KEY;
const endpoint = process.env.LANGUAGE_ENDPOINT;

//example sentence for performing key phrase extraction
const documents = ["Dr. Smith has a very modern medical office, and she has great staff."];

//example of how to use the client to perform entity linking on a document
async function main() {
    console.log("== key phrase extraction sample ==");
  
    const client = new TextAnalysisClient(endpoint, new AzureKeyCredential(key));
  
    const results = await client.analyze("KeyPhraseExtraction", documents);
  
    for (const result of results) {
      console.log(`- Document ${result.id}`);
      if (!result.error) {
        console.log("\tKey phrases:");
        for (const phrase of result.keyPhrases) {
          console.log(`\t- ${phrase}`);
        }
      } else {
        console.error("  Error:", result.error);
      }
    }
  }
  
  main().catch((err) => {
    console.error("The sample encountered an error:", err);
  });
  
```

### Output

```console
== key phrase extraction sample ==
- Document 0
    Key phrases:
    - modern medical office
    - Dr. Smith
    - great staff
```
