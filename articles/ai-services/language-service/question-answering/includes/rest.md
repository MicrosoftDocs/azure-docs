---
title: "Quickstart: Use cURL & REST to manage project - custom question answering"
description: This quickstart shows you how to create, publish, and query your project using the REST APIs.
ms.date: 12/19/2023
ms.topic: include
author: jboback
ms.author: jboback
ms.custom: ignite-fall-2021
---

## Prerequisites

* The current version of [cURL](https://curl.haxx.se/). Several command-line switches are used in the quickstarts, which are noted in the [cURL documentation](https://curl.haxx.se/docs/manpage.html).
* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)
* Question answering requires a [Language resource](https://portal.azure.com/?quickstart=true#create/Microsoft.CognitiveServicesTextAnalytics) with the custom question answering feature enabled to generate an API key and endpoint.
    * After your Language resource deploys, select **Go to resource**. You will need the key and endpoint from the resource you create to connect to the API. Paste your key and endpoint into the code below later in the quickstart.
* To create a Language resource with [Azure CLI](../../../multi-service-resource.md?pivots=azcli) provide the following additional properties: `--api-properties qnaAzureSearchEndpointId=/subscriptions/<azure-subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.Search/searchServices/<azure-search-service-name> qnaAzureSearchEndpointKey=<azure-search-service-auth-key>`
* An existing project to query. If you have not setup a project, you can follow the instructions in the [**Language Studio quickstart**](../quickstart/sdk.md). Or add a project that uses this [Surface User Guide URL](https://download.microsoft.com/download/7/B/1/7B10C82E-F520-4080-8516-5CF0D803EEE0/surface-book-user-guide-EN.pdf) as a data source.



## Setting up

[!INCLUDE [Create environment variables](../../includes/environment-variables.md)]



## Query a project

### Generate an answer from a project

To [query a question answering project](/rest/api/cognitiveservices/questionanswering/question-answering/get-answers) with the REST APIs and cURL, you need the following information:

|Variable name | Value |
|--------------------------|-------------|
| `Endpoint`               | This value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. Alternatively you can find the value in **Language Studio** > **question answering** > **Deploy project** > **Get prediction URL**. An example endpoint is: `https://southcentralus.api.cognitive.microsoft.com/`|
| `API-Key` | This value can be found in the **Keys & Endpoint** section when examining your resource from the Azure portal. You can use either Key1 or Key2. Always having two valid keys always for secure key rotation with zero downtime. Alternatively you can find the value in **Language Studio** > **question answering** > **Deploy project** > **Get prediction URL**. The key value is part of the sample request.|
| `Project` | The name of your question answering project.|
| `Deployment`             | There are two possible values: `test`, and `production`. `production` is dependent on you having deployed your project from **Language Studio** > **question answering** > **Deploy project**.|

The cURL command is executed from a BASH shell. Edit this command with your own resource name, resource key, and JSON values and size of JSON.

```bash
curl -X POST -H "Ocp-Apim-Subscription-Key: $LANGUAGE_KEY" -H "Content-Type: application/json" -d '{
  "question": "How much battery life do I have left?"
  }'  '$LANGUAGE_ENDPOINT.api.cognitive.microsoft.com/language/:query-knowledgebases?projectName={YOUR_PROJECT_NAME}&api-version=2021-10-01&deploymentName={DEPLOYMENT_NAME}'
```

When you run the code above, if you are using the data source from the prerequisites you will get an answer that looks as follows:

```json
{
"answers": [
    {
      "questions": [
        "Check battery level"
      ],
      "answer": "If you want to see how much battery you have left, go to **Start  **> **Settings  **> **Devices  **> **Bluetooth & other devices  **, then find your pen. The current battery level will appear under the battery icon.",
      "confidenceScore": 0.9185,
      "id": 101,
      "source": "https://support.microsoft.com/en-us/surface/how-to-use-your-surface-pen-8a403519-cd1f-15b2-c9df-faa5aa924e98",
      "metadata": {},
      "dialog": {
        "isContextOnly": false,
        "prompts": []
      }
    }
  ]
}
```

The `confidenceScore` returns a value between 0 and 1. You can think of this like a percentage and multiply by 100 so a confidence score of 0.9185 means question answering is 91.85% confident this is the correct answer to the question based on the project.

If you want to exclude answers where the confidence score falls below a certain threshold, you can add the `confidenceScoreThreshold` parameter.

```bash
curl -X POST -H "Ocp-Apim-Subscription-Key: $LANGUAGE_KEY" -H "Content-Type: application/json" -d '{
  "question": "How much battery life do I have left?",
  "confidenceScoreThreshold": "0.95",
  }'  '$LANGUAGE_ENDPOINT.api.cognitive.microsoft.com//language/:query-knowledgebases?projectName=Sample-project&api-version=2021-10-01&deploymentName={DEPLOYMENT_NAME}'
```

Since we know from our previous execution of the code that our confidence score is: `.9185` setting the threshold to `.95` will result in the [default answer](../how-to/change-default-answer.md) being returned.

```json
{
  "answers": [
    {
      "questions": [],
      "answer": "No good match found in KB",
      "confidenceScore": 0.0,
      "id": -1,
      "metadata": {}
    }
  ]
}
```



## Query text without a project

You can also [use question answering without a project](/rest/api/cognitiveservices/questionanswering/question-answering/get-answers-from-text) with the prebuilt question answering REST API, which is called via `query-text`. In this case, you provide question answering with both a question and the associated text records you would like to search for an answer at the time the request is sent.

For this example, you only need to modify the variables for `API KEY` and `ENDPOINT`.

```bash
curl -X POST -H "Ocp-Apim-Subscription-Key: $LANGUAGE_KEY" -H "Content-Type: application/json" -d '{
"question":"How long does it takes to charge a surface?",
"records":[
{"id":"doc1","text":"Power and charging.It takes two to four hours to charge the Surface Pro 4 battery fully from an empty state. It can take longer if you\u0027re using your Surface for power-intensive activities like gaming or video streaming while you\u0027re charging it"},
{"id":"doc2","text":"You can use the USB port on your Surface Pro 4 power supply to charge other devices, like a phone, while your Surface charges. The USB port on the power supply is only for charging, not for data transfer. If you want to use a USB device, plug it into the USB port on your Surface."}],
"language":"en",
"stringIndexType":"Utf16CodeUnit"
}'  '$LANGUAGE_ENDPOINT.api.cognitive.microsoft.com/language/:query-text?&api-version=2021-10-01'
```

This example will return a result of:

```json
{  
"answers": [
    {
      "answer": "Power and charging.It takes two to four hours to charge the Surface Pro 4 battery fully from an empty state. It can take longer if you're using your Surface for power-intensive activities like gaming or video streaming while you're charging it",
      "confidenceScore": 0.9118788838386536,
      "id": "doc1",
      "answerSpan": {
        "text": "two to four hours",
        "confidenceScore": 0.9850527,
        "offset": 27,
        "length": 18
      },
      "offset": 0,
      "length": 243
    },
    {
      "answer": "It can take longer if you're using your Surface for power-intensive activities like gaming or video streaming while you're charging it",
      "confidenceScore": 0.052793052047491074,
      "id": "doc1",
      "answerSpan": {
        "text": "longer",
        "confidenceScore": 0.6694634,
        "offset": 11,
        "length": 7
      },
      "offset": 109,
      "length": 134
    },
    {
      "answer": "You can use the USB port on your Surface Pro 4 power supply to charge other devices, like a phone, while your Surface charges. The USB port on the power supply is only for charging, not for data transfer. If you want to use a USB device, plug it into the USB port on your Surface.",
      "confidenceScore": 0.017600709572434425,
      "id": "doc2",
      "answerSpan": {
        "text": "USB port on your Surface Pro 4 power supply to charge other devices, like a phone, while your Surface charges. The USB port on the power supply is only for charging",
        "confidenceScore": 0.1544854,
        "offset": 15,
        "length": 165
      },
      "offset": 0,
      "length": 280
    }
  ]
}
```

