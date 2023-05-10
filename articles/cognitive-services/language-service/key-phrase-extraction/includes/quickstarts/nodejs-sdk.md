---
author: jboback
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: include
ms.date: 02/17/2023
ms.author: jboback
ms.custom: devx-track-js, ignite-fall-2021
---

[Reference documentation](/javascript/api/overview/azure/ai-language-text-readme) | [Additional samples](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/cognitivelanguage/ai-language-text/samples/v1) | [Package (npm)](https://www.npmjs.com/package/@azure/ai-language-text) | [Library source code](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/cognitivelanguage/ai-language-text) 

Use this quickstart to create a key phrase extraction application with the client library for Node.js. In the following example, you will create a JavaScript application that can identify key words and phrases found in text.

[!INCLUDE [Use Language Studio](../../../includes/use-language-studio.md)]

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)
* [Node.js](https://nodejs.org/) v14 LTS or later
* Once you have your Azure subscription, <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics"  title="Create a Language resource"  target="_blank">create a Language resource </a> in the Azure portal to get your key and endpoint. After it deploys, select **Go to resource**.
    * You will need the key and endpoint from the resource you create to connect your application to the API. You'll paste your key and endpoint into the code below later in the quickstart.
    * You can use the free pricing tier (`Free F0`) to try the service, and upgrade later to a paid tier for production.
* To use the Analyze feature, you will need a Language resource with the standard (S) pricing tier.



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
npm install @azure/ai-language-text
```





## Code example

Open the file and copy the below code. Remember to replace the `key` variable with the key for your resource, and replace the `endpoint` variable with the endpoint for your resource. Then run the code.  

[!INCLUDE [find the key and endpoint for a resource](../../../includes/find-azure-resource-info.md)]

```javascript
"use strict";

const { TextAnalysisClient, AzureKeyCredential } = require("@azure/ai-language-text");
const key = '<paste-your-key-here>';
const endpoint = '<paste-your-endpoint-here>';

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


