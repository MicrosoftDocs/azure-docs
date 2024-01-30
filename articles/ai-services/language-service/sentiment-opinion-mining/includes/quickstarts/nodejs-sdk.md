---
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.topic: include
ms.date: 12/19/2023
ms.author: aahi
ms.custom: devx-track-js, ignite-fall-2021
---

[Reference documentation](/javascript/api/overview/azure/ai-language-text-readme) | [Additional samples](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/cognitivelanguage/ai-language-text/samples/v1) | [Package (npm)](https://www.npmjs.com/package/@azure/ai-language-text) | [Library source code](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/cognitivelanguage/ai-language-text) 

Use this quickstart to create a sentiment analysis application with the client library for Node.js. In the following example, you will create a JavaScript application that can identify the sentiment(s) expressed in a text sample, and perform aspect-based sentiment analysis.

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

Install the npm packages:

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


//an example document for sentiment analysis and opinion mining
const documents = [{
    text: "The food and service were unacceptable. The concierge was nice, however.",
    id: "0",
    language: "en"
  }];
  
async function main() {
  console.log("=== Sentiment analysis and opinion mining sample ===");

  const client = new TextAnalysisClient(endpoint, new AzureKeyCredential(key));

  const results = await client.analyze("SentimentAnalysis", documents, {
    includeOpinionMining: true,
  });

  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    console.log(`- Document ${result.id}`);
    if (!result.error) {
      console.log(`\tDocument text: ${documents[i].text}`);
      console.log(`\tOverall Sentiment: ${result.sentiment}`);
      console.log("\tSentiment confidence scores:", result.confidenceScores);
      console.log("\tSentences");
      for (const { sentiment, confidenceScores, opinions } of result.sentences) {
        console.log(`\t- Sentence sentiment: ${sentiment}`);
        console.log("\t  Confidence scores:", confidenceScores);
        console.log("\t  Mined opinions");
        for (const { target, assessments } of opinions) {
          console.log(`\t\t- Target text: ${target.text}`);
          console.log(`\t\t  Target sentiment: ${target.sentiment}`);
          console.log("\t\t  Target confidence scores:", target.confidenceScores);
          console.log("\t\t  Target assessments");
          for (const { text, sentiment } of assessments) {
            console.log(`\t\t\t- Text: ${text}`);
            console.log(`\t\t\t  Sentiment: ${sentiment}`);
          }
        }
      }
    } else {
      console.error(`\tError: ${result.error}`);
    }
  }
}
  
main().catch((err) => {
  console.error("The sample encountered an error:", err);
});
```



## Output

```console
=== Sentiment analysis and opinion mining sample ===
- Document 0
    Document text: The food and service were unacceptable. The concierge was nice, however.
    Overall Sentiment: mixed
    Sentiment confidence scores: { positive: 0.49, neutral: 0, negative: 0.5 }
    Sentences
    - Sentence sentiment: negative
      Confidence scores: { positive: 0, neutral: 0, negative: 1 }
      Mined opinions
            - Target text: food
              Target sentiment: negative
              Target confidence scores: { positive: 0.01, negative: 0.99 }
              Target assessments
                    - Text: unacceptable
                      Sentiment: negative
            - Target text: service
              Target sentiment: negative
              Target confidence scores: { positive: 0.01, negative: 0.99 }
              Target assessments
                    - Text: unacceptable
                      Sentiment: negative
    - Sentence sentiment: positive
      Confidence scores: { positive: 0.98, neutral: 0.01, negative: 0.01 }
      Mined opinions
            - Target text: concierge
              Target sentiment: positive
              Target confidence scores: { positive: 1, negative: 0 }
              Target assessments
                    - Text: nice
                      Sentiment: positive
```

[!INCLUDE [clean up resources](../../../includes/clean-up-resources.md)]

[!INCLUDE [clean up environment variables](../../../includes/clean-up-variables.md)]



## Next steps

* [Sentiment analysis and opinion mining language support](../../language-support.md)
* [How to call the API](../../how-to/call-api.md)  
* [Reference documentation](/javascript/api/overview/azure/ai-text-analytics-readme?preserve-view=true&view=azure-node-latest)
* [Additional samples](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/textanalytics/ai-text-analytics/samples)
