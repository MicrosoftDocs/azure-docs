---
author: jboback
manager: nitinme
ms.service: azure-ai-language
ms.topic: include
ms.date: 03/29/2024
ms.author: jboback
ms.custom: devx-track-js
---

[Reference documentation](/javascript/api/overview/azure/ai-language-text-readme) | [More samples](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/cognitivelanguage/ai-language-text/samples/v1) | [Package (npm)](https://www.npmjs.com/package/@azure/ai-language-text) | [Library source code](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/cognitivelanguage/ai-language-text) 


Use this quickstart to create a language detection application with the client library for Node.js. In the following example, you create a JavaScript application that can identify the language a text sample was written in.

[!INCLUDE [Use Language Studio](../../../includes/use-language-studio.md)]


## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)
* [Node.js](https://nodejs.org/) v14 LTS or later
* Once you have your Azure subscription, <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics"  title="Create a Language resource"  target="_blank">create a Language resource </a> in the Azure portal to get your key and endpoint. After it deploys, select **Go to resource**.
    * You need the key and endpoint from the resource you create to connect your application to the API. You paste your key and endpoint into the code below later in the quickstart.
    * You can use the free pricing tier (`Free F0`) to try the service, and upgrade later to a paid tier for production.
* To use the Analyze feature, you need a Language resource with the standard (S) pricing tier.



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

const { TextAnalyticsClient, AzureKeyCredential } = require("@azure/ai-text-analytics");

// This example requires environment variables named "LANGUAGE_KEY" and "LANGUAGE_ENDPOINT"
const key = process.env.LANGUAGE_KEY;
const endpoint = process.env.LANGUAGE_ENDPOINT;

//Example sentences in different languages to be analyzed
const documents = [
    "This document is written in English.",
    "这是一个用中文写的文件",
];

//Example of how to use the client library to detect language
async function main() {
    console.log("== Language detection sample ==");
  
    const client = new TextAnalysisClient(endpoint, new AzureKeyCredential(key));
  
    const result = await client.analyze("LanguageDetection", documents);
  
    for (const doc of result) {
      if (!doc.error) {
        console.log(
          `ID ${doc.id} - Primary language: ${doc.primaryLanguage.name} (iso6391 name: ${doc.primaryLanguage.iso6391Name})`
        );
      }
    }
}

main().catch((err) => {
    console.error("The sample encountered an error:", err);
});
```



### Output

```console
== Language detection sample ==
ID 0 - Primary language: English (iso6391 name: en)
ID 1 - Primary language: Chinese_Simplified (iso6391 name: zh_chs)
```
