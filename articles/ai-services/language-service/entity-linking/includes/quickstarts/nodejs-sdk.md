---
title: "Quickstart: Entity Linking client library for Node.js | Microsoft Docs"
description: Get started with the Entity Linking client library for Node.js.
author: jboback
manager: nitinme
ms.service: azure-ai-language
ms.topic: include
ms.date: 12/19/2023
ms.author: jboback
ms.custom: devx-track-js
---

[Reference documentation](/javascript/api/overview/azure/ai-language-text-readme) | [More samples](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/cognitivelanguage/ai-language-text/samples/v1) | [Package (npm)](https://www.npmjs.com/package/@azure/ai-language-text) | [Library source code](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/cognitivelanguage/ai-language-text) 

Use this quickstart to create an entity linking application with the client library for Node.js. In the following example, you create a JavaScript application that can identify and disambiguate entities found in text.


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

//example sentence for recognizing entities
const documents = ["Microsoft was founded by Bill Gates and Paul Allen on April 4, 1975."];

//example of how to use the client to perform entity linking on a document
async function main() {
    console.log("== Entity linking sample ==");
  
    const client = new TextAnalysisClient(endpoint, new AzureKeyCredential(key));
  
    const results = await client.analyze("EntityLinking", documents);
  
    for (const result of results) {
      console.log(`- Document ${result.id}`);
      if (!result.error) {
        console.log("\tEntities:");
        for (const entity of result.entities) {
          console.log(
            `\t- Entity ${entity.name}; link ${entity.url}; datasource: ${entity.dataSource}`
          );
          console.log("\t\tMatches:");
          for (const match of entity.matches) {
            console.log(
              `\t\t- Entity appears as "${match.text}" (confidence: ${match.confidenceScore}`
            );
          }
        }
      } else {
        console.error("  Error:", result.error);
      }
    }
  }

//call the main function
main().catch((err) => {
  console.error("The sample encountered an error:", err);
});

```



### Output

```console
== Entity linking sample ==
- Document 0
    Entities:
    - Entity Microsoft; link https://en.wikipedia.org/wiki/Microsoft; datasource: Wikipedia
            Matches:
            - Entity appears as "Microsoft" (confidence: 0.48
    - Entity Bill Gates; link https://en.wikipedia.org/wiki/Bill_Gates; datasource: Wikipedia
            Matches:
            - Entity appears as "Bill Gates" (confidence: 0.52
    - Entity Paul Allen; link https://en.wikipedia.org/wiki/Paul_Allen; datasource: Wikipedia
            Matches:
            - Entity appears as "Paul Allen" (confidence: 0.54
    - Entity April 4; link https://en.wikipedia.org/wiki/April_4; datasource: Wikipedia
            Matches:
            - Entity appears as "April 4" (confidence: 0.38
```

[!INCLUDE [clean up resources](../../../includes/clean-up-resources.md)]



## Next steps

* [Entity linking language support](../../language-support.md)
* [How to call the entity linking API](../../how-to/call-api.md)  
* [Reference documentation](/javascript/api/overview/azure/ai-language-text-readme)
* [Additional samples](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/cognitivelanguage/ai-language-text/samples/v1)
