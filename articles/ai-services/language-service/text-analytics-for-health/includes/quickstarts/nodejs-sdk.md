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

Use this quickstart to create a Text Analytics for health application with the client library for Node.js. In the following example, you will create a JavaScript application that can identify medical [entities](../../concepts/health-entity-categories.md), [relations](../../concepts/relation-extraction.md), and [assertions](../../concepts/assertion-detection.md) that appear in text.


## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)
* [Node.js](https://nodejs.org/) v14 LTS or later
* Once you have your Azure subscription, <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics"  title="Create a Language resource"  target="_blank">create a Language resource </a> in the Azure portal to get your key and endpoint. After it deploys, select **Go to resource**.
    * You will need the key and endpoint from the resource you create to connect your application to the API. You'll paste your key and endpoint into the code below later in the quickstart.
    * You can use the free pricing tier (`Free F0`) to try the service (providing 5000 text records - 1000 characters each) and upgrade later to the `Standard S` pricing tier for production. You can also start with the `Standard S` pricing tier, receiving the same initial quota for free (5000 text records) before getting charged. For more information on pricing, visit [Language Service Pricing](https://azure.microsoft.com/pricing/details/cognitive-services/language-service/).



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

Install the npm package:

```console
npm install @azure/ai-language-text
```



## Code example

Open the file and copy the below code. Then run the code.  

[!INCLUDE [find the key and endpoint for a resource](../../../includes/find-azure-resource-info.md)]

```javascript
"use strict";

const { TextAnalyticsClient, AzureKeyCredential } = require("@azure/ai-text-analytics");
// This example requires environment variables named "LANGUAGE_KEY" and "LANGUAGE_ENDPOINT"
const key = process.env.LANGUAGE_KEY;
const endpoint = process.env.LANGUAGE_ENDPOINT;

const documents = ["Patient does not suffer from high blood pressure."];
  
  async function main() {
    console.log("== Text analytics for health sample ==");
  
    const client = new TextAnalysisClient(endpoint, new AzureKeyCredential(key));
    const actions = [
      {
        kind: "Healthcare",
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
      if (actionResult.kind !== "Healthcare") {
        throw new Error(`Expected a healthcare results but got: ${actionResult.kind}`);
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
        console.log("\tRecognized Entities:");
        for (const entity of result.entities) {
          console.log(`\t- Entity "${entity.text}" of type ${entity.category}`);
          if (entity.dataSources.length > 0) {
            console.log("\t and it can be referenced in the following data sources:");
            for (const ds of entity.dataSources) {
              console.log(`\t\t- ${ds.name} with Entity ID: ${ds.entityId}`);
            }
          }
        }
        if (result.entityRelations.length > 0) {
          console.log(`\tRecognized relations between entities:`);
          for (const relation of result.entityRelations) {
            console.log(
              `\t\t- Relation of type ${relation.relationType} found between the following entities:`
            );
            for (const role of relation.roles) {
              console.log(`\t\t\t- "${role.entity.text}" with the role ${role.name}`);
            }
          }
        }
      }
    }
  }
  
  main().catch((err) => {
    console.error("The sample encountered an error:", err);
  });
```

### Output

```console
== Text analytics for health sample ==
The operation was created on Mon Feb 13 2023 13:12:10 GMT-0800 (Pacific Standard Time)
The operation results will expire on Tue Feb 14 2023 13:12:10 GMT-0800 (Pacific Standard Time)
Last time the operation was updated was on: Mon Feb 13 2023 13:12:10 GMT-0800 (Pacific Standard Time)
- Document 0
    Recognized Entities:
    - Entity "high blood pressure" of type SymptomOrSign
        and it can be referenced in the following data sources:
            - UMLS with Entity ID: C0020538
            - AOD with Entity ID: 0000023317
            - BI with Entity ID: BI00001
            - CCPSS with Entity ID: 1017493
            - CCS with Entity ID: 7.1
            - CHV with Entity ID: 0000015800
            - COSTAR with Entity ID: 397
            - CSP with Entity ID: 0571-5243
            - CST with Entity ID: HYPERTENS
            - DXP with Entity ID: U002034
            - HPO with Entity ID: HP:0000822
            - ICD10 with Entity ID: I10-I15.9
            - ICD10AM with Entity ID: I10-I15.9
            - ICD10CM with Entity ID: I10
            - ICD9CM with Entity ID: 997.91
            - ICPC2ICD10ENG with Entity ID: MTHU035456
            - ICPC2P with Entity ID: K85004
            - LCH with Entity ID: U002317
            - LCH_NW with Entity ID: sh85063723
            - LNC with Entity ID: LA14293-7
            - MDR with Entity ID: 10020772
            - MEDCIN with Entity ID: 33288
            - MEDLINEPLUS with Entity ID: 34
            - MSH with Entity ID: D006973
            - MTH with Entity ID: 005
            - MTHICD9 with Entity ID: 997.91
            - NANDA-I with Entity ID: 00905
            - NCI with Entity ID: C3117
            - NCI_CPTAC with Entity ID: C3117
            - NCI_CTCAE with Entity ID: E13785
            - NCI_CTRP with Entity ID: C3117
            - NCI_FDA with Entity ID: 1908
            - NCI_GDC with Entity ID: C3117
            - NCI_NCI-GLOSS with Entity ID: CDR0000458091
            - NCI_NICHD with Entity ID: C3117
            - NCI_caDSR with Entity ID: C3117
            - NOC with Entity ID: 060808
            - OMIM with Entity ID: MTHU002068
            - PCDS with Entity ID: PRB_11000.06
            - PDQ with Entity ID: CDR0000686951
            - PSY with Entity ID: 23830
            - RCD with Entity ID: XE0Ub
            - SNM with Entity ID: F-70700
            - SNMI with Entity ID: D3-02000
            - SNOMEDCT_US with Entity ID: 38341003
            - WHO with Entity ID: 0210
```

> [!TIP]
> Fast Healthcare Interoperability Resources (FHIR) structuring is available for preview using the Language REST API. The client libraries are not currently supported. [Learn more](../../how-to/call-api.md) on how to use FHIR structuring in your API call.


