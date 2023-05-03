---
title: "Quickstart: Entity Linking client library for Node.js | Microsoft Docs"
description: Get started with the Entity Linking client library for Node.js.
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: include
ms.date: 02/17/2023
ms.author: aahi
ms.custom: devx-track-js, ignite-fall-2021
---

[Reference documentation](/javascript/api/overview/azure/ai-language-text-readme) | [Additional samples](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/cognitivelanguage/ai-language-text/samples/v1) | [Package (npm)](https://www.npmjs.com/package/@azure/ai-language-text) | [Library source code](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/cognitivelanguage/ai-language-text) 

Use this quickstart to create an entity linking application with the client library for Node.js. In the following example, you will create a JavaScript application that can identify and disambiguate entities found in text.

[!INCLUDE [Use Language Studio](../../../includes/use-language-studio.md)]


## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)
* [Node.js](https://nodejs.org/) v14 LTS or later
* Once you have your Azure subscription, <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics"  title="Create a Language resource"  target="_blank">create a Language resource </a> in the Azure portal to get your key and endpoint. After it deploys, select **Go to resource**.
    * You will need the key and endpoint from the resource you create to connect your application to the API. You'll paste your key and endpoint into the code below later in the quickstart.
    * You can use the free pricing tier (`Free F0`) to try the service, and upgrade later to a paid tier for production.
* To use the Analyze feature, you will need a Language resource with the standard (S) pricing tier.

> [!div class="nextstepaction"]
> <a href="https://github.com/Azure/azure-sdk-for-js/issues/new?title=&body=%0A-%20**Package%20Name**:%20%0A-%20**Package%20Version**:%20%0A-%20**Operating%20System**:%20%0A-%20**Node.js%20version**:%20%0A-%20**Browser%20name%20and%20version**:%20%0A-%20**Typescript%20version**:%20%0A%0A%5BEnter%20feedback%20here%5D%0A%0A%0A---%0A%23%23%23%23%20Document%20details%0A%0A⚠%20*Do%20not%20edit%20this%20section.%20It%20is%20required%20for%20learn.microsoft.com%20➟%20GitHub%20issue%20linking.%0A%0ALanguage%20Quickstart%20Feedback%0A*%20Content:%20%5BQuickstart:%20Entity%20Linking%20using%20the%20client%20library%20and%20REST%20API%20-%20Azure%20Cognitive%20Services%5D(https:%2F%2Flearn.microsoft.com%2Fazure%2Fcognitive-services%2Flanguage-service%2Fentity-linking%2Fquickstart%3Fpivots%3Dprogramming-language-javascript)%0A*%20Content%20Source:%20%5Barticles%2Fcognitive-services%2Flanguage-service%2Fentity-linking%2Fquickstart.md%5D(https:%2F%2Fgithub.com%2FMicrosoftDocs%2Fazure-docs%2Fblob%2Fmain%2Farticles%2Fcognitive-services%2Flanguage-service%2Fentity-linking%2Fquickstart.md)%0A*%20Section:%20**Prerequisites**%0A*%20Service:%20**cognitive-services**%0A*%20Sub-service:%20**language-service**%0A&labels=Cognitive%20-%20Language%2CCognitive%20Language%20QS%20Feedback" target="_target">I ran into an issue</a>

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

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=JAVASCRIPT&Pillar=Language&Product=Entity-linking&Page=quickstart&Section=Prerequisites" target="_target">I ran into an issue</a>

## Code example

Open the file and copy the below code. Remember to replace the `key` variable with the key for your resource, and replace the `endpoint` variable with the endpoint for your resource. Then run the code. 

[!INCLUDE [find the key and endpoint for a resource](../../../includes/find-azure-resource-info.md)]

```javascript
"use strict";

const { TextAnalysisClient, AzureKeyCredential } = require("@azure/ai-language-text");
const endpoint = '<paste-your-endpoint-here>';
const key = '<paste-your-key-here>';
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

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=JAVASCRIPT&Pillar=Language&Product=Entity-linking&Page=quickstart&Section=Set-up-the-environment" target="_target">I ran into an issue</a>

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

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=JAVASCRIPT&Pillar=Language&Product=Entity-linking&Page=quickstart&Section=Code-example" target="_target">I ran into an issue</a>

## Next steps

* [Entity linking language support](../../language-support.md)
* [How to call the entity linking API](../../how-to/call-api.md)  
* [Reference documentation](/javascript/api/overview/azure/ai-language-text-readme)
* [Additional samples](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/cognitivelanguage/ai-language-text/samples/v1)