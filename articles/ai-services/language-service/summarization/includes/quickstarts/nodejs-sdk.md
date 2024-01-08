---
author: jboback
manager: nitinme
ms.service: azure-ai-language
ms.topic: include
ms.date: 12/19/2023
ms.author: aahi
ms.custom: devx-track-js, ignite-fall-2021
---

[Reference documentation](/javascript/api/overview/azure/ai-language-text-readme?view=azure-node-latest&preserve-view=true) | [Additional samples](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/textanalytics/ai-text-analytics/samples) | [Package (npm)](https://www.npmjs.com/package/@azure/ai-text-analytics/v/5.2.0-beta.1) | [Library source code](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/textanalytics/ai-text-analytics) 

Use this quickstart to create a text summarization application with the client library for Node.js. In the following example, you'll create a JavaScript application that can summarize documents.

[!INCLUDE [Use Language Studio](../use-language-studio.md)]

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)
* [Node.js](https://nodejs.org/) v16 LTS
* Once you have your Azure subscription, <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics"  title="Create a Language resource"  target="_blank">create a Language resource </a> in the Azure portal to get your key and endpoint. After it deploys, select **Go to resource**.
    * You'll need the key and endpoint from the resource you create to connect your application to the API. You'll paste your key and endpoint into the code below later in the quickstart.
    * You can use the free pricing tier (`Free F0`) to try the service, and upgrade later to a paid tier for production.
* To use the Analyze feature, you'll need a Language resource with the standard (S) pricing tier.



## Setting up

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
npm install --save @azure/ai-language-text@1.1.0
```



## Code example 

Open the file and copy the below code. Then run the code.  

[!INCLUDE [find the key and endpoint for a resource](../../../includes/find-azure-resource-info.md)]

```javascript
/**
 * This sample program extracts a summary of two sentences at max from an article.
 * For more information, see the feature documentation: {@link https://learn.microsoft.com/azure/ai-services/language-service/summarization/overview}
 *
 * @summary extracts a summary from an article
 */

const { AzureKeyCredential, TextAnalysisClient } = require("@azure/ai-language-text");

// Load the .env file if it exists
require("dotenv").config();

// This example requires environment variables named "LANGUAGE_KEY" and "LANGUAGE_ENDPOINT"
const endpoint = process.env.LANGUAGE_ENDPOINT;
const apiKey = process.env.LANGUAGE_KEY;

const documents = [
  `
           Windows 365 was in the works before COVID-19 sent companies around the world on a scramble to secure solutions to support employees suddenly forced to work from home, but “what really put the firecracker behind it was the pandemic, it accelerated everything,” McKelvey said. She explained that customers were asking, “’How do we create an experience for people that makes them still feel connected to the company without the physical presence of being there?”
           In this new world of Windows 365, remote workers flip the lid on their laptop, bootup the family workstation or clip a keyboard onto a tablet, launch a native app or modern web browser and login to their Windows 365 account. From there, their Cloud PC appears with their background, apps, settings and content just as they left it when they last were last there – in the office, at home or a coffee shop.
           “And then, when you’re done, you’re done. You won’t have any issues around security because you’re not saving anything on your device,” McKelvey said, noting that all the data is stored in the cloud.
           The ability to login to a Cloud PC from anywhere on any device is part of Microsoft’s larger strategy around tailoring products such as Microsoft Teams and Microsoft 365 for the post-pandemic hybrid workforce of the future, she added. It enables employees accustomed to working from home to continue working from home; it enables companies to hire interns from halfway around the world; it allows startups to scale without requiring IT expertise.
           “I think this will be interesting for those organizations who, for whatever reason, have shied away from virtualization. This is giving them an opportunity to try it in a way that their regular, everyday endpoint admin could manage,” McKelvey said.
           The simplicity of Windows 365 won over Dean Wells, the corporate chief information officer for the Government of Nunavut. His team previously attempted to deploy a traditional virtual desktop infrastructure and found it inefficient and unsustainable given the limitations of low-bandwidth satellite internet and the constant need for IT staff to manage the network and infrastructure.
           We didn’t run it for very long,” he said. “It didn’t turn out the way we had hoped. So, we actually had terminated the project and rolled back out to just regular PCs.”
           He re-evaluated this decision after the Government of Nunavut was hit by a ransomware attack in November 2019 that took down everything from the phone system to the government’s servers. Microsoft helped rebuild the system, moving the government to Teams, SharePoint, OneDrive and Microsoft 365. Manchester’s team recruited the Government of Nunavut to pilot Windows 365. Wells was intrigued, especially by the ability to manage the elastic workforce securely and seamlessly.
           “The impact that I believe we are finding, and the impact that we’re going to find going forward, is being able to access specialists from outside the territory and organizations outside the territory to come in and help us with our projects, being able to get people on staff with us to help us deliver the day-to-day expertise that we need to run the government,” he said.
           “Being able to improve healthcare, being able to improve education, economic development is going to improve the quality of life in the communities.”`,
];

async function main() {
  console.log("== Extractive Summarization Sample ==");

  const client = new TextAnalysisClient(endpoint, new AzureKeyCredential(apiKey));
  const actions = [
    {
      kind: "ExtractiveSummarization",
      maxSentenceCount: 2,
    },
  ];
  const poller = await client.beginAnalyzeBatch(actions, documents, "en");

  poller.onProgress(() => {
    console.log(
      `Last time the operation was updated was on: ${poller.getOperationState().modifiedOn}`
    );
  });
  console.log(`The operation was created on ${poller.getOperationState().createdOn}`);
  console.log(`The operation results will expire on ${poller.getOperationState().expiresOn}`);

  const results = await poller.pollUntilDone();

  for await (const actionResult of results) {
    if (actionResult.kind !== "ExtractiveSummarization") {
      throw new Error(`Expected extractive summarization results but got: ${actionResult.kind}`);
    }
    if (actionResult.error) {
      const { code, message } = actionResult.error;
      throw new Error(`Unexpected error (${code}): ${message}`);
    }
    for (const result of actionResult.results) {
      console.log(`- Document ${result.id}`);
      if (result.error) {
        const { code, message } = result.error;
        throw new Error(`Unexpected error (${code}): ${message}`);
      }
      console.log("Summary:");
      console.log(result.sentences.map((sentence) => sentence.text).join("\n"));
    }
  }
}

main().catch((err) => {
  console.error("The sample encountered an error:", err);
});

module.exports = { main };
```


