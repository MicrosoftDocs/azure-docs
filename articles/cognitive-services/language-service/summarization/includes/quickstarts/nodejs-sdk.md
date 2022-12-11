---
author: jboback
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: include
ms.date: 08/18/2022
ms.author: aahi
ms.custom: devx-track-js, ignite-fall-2021
---

[Reference documentation](/javascript/api/overview/azure/ai-text-analytics-readme?preserve-view=true&view=azure-node-preview) | [Additional samples](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/textanalytics/ai-text-analytics/samples) | [Package (npm)](https://www.npmjs.com/package/@azure/ai-text-analytics/v/5.2.0-beta.1) | [Library source code](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/textanalytics/ai-text-analytics) 

Use this quickstart to create a text summarization application with the client library for Node.js. In the following example, you will create a JavaScript application that can summarize documents.

[!INCLUDE [Use Language Studio](../use-language-studio.md)]

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)
* [Node.js](https://nodejs.org/) v16 LTS
* Once you have your Azure subscription, <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics"  title="Create a Language resource"  target="_blank">create a Language resource </a> in the Azure portal to get your key and endpoint. After it deploys, click **Go to resource**.
    * You will need the key and endpoint from the resource you create to connect your application to the API. You'll paste your key and endpoint into the code below later in the quickstart.
    * You can use the free pricing tier (`Free F0`) to try the service, and upgrade later to a paid tier for production.
* To use the Analyze feature, you will need a Language resource with the standard (S) pricing tier.

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=JAVASCRIPT&Pillar=Language&Product=Summarization&Page=quickstart&Section=Prerequisites" target="_target">I ran into an issue</a>

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

Install the npm packages:

```console
npm install --save @azure/ai-text-analytics@5.2.0-beta.1
```

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=JAVASCRIPT&Pillar=Language&Product=Summarization&Page=quickstart&Section=Set-up-the-environment" target="_target">I ran into an issue</a>

## Code example 

Open the file and copy the below code. Remember to replace the `key` variable with the key for your resource, and replace the `endpoint` variable with the endpoint for your resource. 

[!INCLUDE [find the key and endpoint for a resource](../../../includes/find-azure-resource-info.md)]

```javascript
"use strict";

const { TextAnalyticsClient, AzureKeyCredential } = require("@azure/ai-text-analytics");
const key = '<paste-your-key-here>';
const endpoint = '<paste-your-endpoint-here>';
// Authenticate the client with your key and endpoint
const textAnalyticsClient = new TextAnalyticsClient(endpoint, new AzureKeyCredential(key));

// Example method for summarizing text
async function summarization_example(client) {
    const documents = [`The extractive summarization feature uses natural language processing techniques to locate key sentences in an unstructured text document. 
        These sentences collectively convey the main idea of the document. This feature is provided as an API for developers. 
        They can use it to build intelligent solutions based on the relevant information extracted to support various use cases. 
        In the public preview, extractive summarization supports several languages. It is based on pretrained multilingual transformer models, part of our quest for holistic representations. 
        It draws its strength from transfer learning across monolingual and harness the shared nature of languages to produce models of improved quality and efficiency.`];

    console.log("== Analyze Sample For Extract Summary ==");

    const actions = {
        extractSummaryActions: [{ modelVersion: "latest", orderBy: "Rank", maxSentenceCount: 5 }],
    };
    const poller = await client.beginAnalyzeActions(documents, actions, "en");

    poller.onProgress(() => {
        console.log(
            `Number of actions still in progress: ${poller.getOperationState().actionsInProgressCount}`
        );
    });

    console.log(`The analyze actions operation created on ${poller.getOperationState().createdOn}`);

    console.log(
        `The analyze actions operation results will expire on ${poller.getOperationState().expiresOn}`
    );

    const resultPages = await poller.pollUntilDone();

    for await (const page of resultPages) {
        const extractSummaryAction = page.extractSummaryResults[0];
        if (!extractSummaryAction.error) {
            for (const doc of extractSummaryAction.results) {
                console.log(`- Document ${doc.id}`);
                if (!doc.error) {
                    console.log("\tSummary:");
                    for (const sentence of doc.sentences) {
                        console.log(`\t- ${sentence.text}`);
                    }
                } else {
                    console.error("\tError:", doc.error);
                }
            }
        }
    } 
}
summarization_example(textAnalyticsClient).catch((err) => {
    console.error("The sample encountered an error:", err);
});
```

> [!div class="nextstepaction"]
> <a href="https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=JAVASCRIPT&Pillar=Language&Product=Summarization&Page=quickstart&Section=Code-example" target="_target">I ran into an issue</a>

### Command

```console
node index.js
```
### Output

```console
== Analyze Sample For Extract Summary ==
The analyze actions operation created on Thu Sep 16 2021 13:12:31 GMT-0700 (Pacific Daylight Time)
The analyze actions operation results will expire on Fri Sep 17 2021 13:12:31 GMT-0700 (Pacific Daylight Time)

- Document 0
        Summary:
        - They can use it to build intelligent solutions based on the relevant information extracted to support various use cases.
        - This feature is provided as an API for developers.
        - The extractive summarization feature uses natural language processing techniques to locate key sentences in an unstructured 
text document.
        - These sentences collectively convey the main idea of the document.
        - In the public preview, extractive summarization supports several languages.
```
