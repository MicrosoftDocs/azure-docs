---
title: include file
description: include file
#services: cognitive-services
manager: nitinme
ms.service: azure-ai-language
ms.subservice: azure-ai-qna-maker
ms.topic: include
ms.custom: include file, ignite-fall-2021
ms.date: 12/19/2023
---

This Postman-based quickstart walks you through getting an answer from your knowledge base.

## Prerequisites

* You must have
    * Latest [**Postman**](https://www.getpostman.com/).
    * If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/cognitive-services/) before you begin.

> * A [QnA Maker resource](https://portal.azure.com/#create/Microsoft.CognitiveServicesQnAMaker) created in the Azure portal. Remember your Microsoft Entra ID, Subscription, QnA resource name you selected when you created the resource.

   * A trained and published knowledge base with questions and answers, from the previous [quickstart](../quickstarts/add-question-metadata-portal.md), configured with metadata and Chit chat.


> [!NOTE]
> When you are ready to generate an answer to a question from your knowledge base, you must [train](../quickstarts/create-publish-knowledge-base.md#save-and-train) and [publish](../quickstarts/create-publish-knowledge-base.md#publish-the-knowledge-base) your knowledge base. When your knowledge base is published, the **Publish** page displays the HTTP request settings to generate an answer. The **Postman** tab shows the settings required to generate an answer.

## Set up Postman for requests

This quickstart uses the same settings for the Postman **POST** request then configures to POST body JSON sent to the service based on what you are trying to query for.

Use this procedure to configure Postman, then read each subsequent section to configure the POST body JSON.

1. From the knowledge base's **Settings** page, select the **Postman** tab to see the configuration used to generate an answer from the knowledge base. Copy the following information to use in Postman.

    |Name|Setting|Purpose and value|
    |--|--|--|
    |`POST`| `/knowledgebases/replace-with-your-knowledge-base-id/generateAnswer`|This is the HTTP method and route for the URL.|
    |`Host`|`https://YOUR-RESOURCE_NAME.azurewebsites.net/qnamaker`|This is the host of the URL. Concatenate the Host and Post values to get the complete generateAnswer URL.|
    |`Authorization`|`EndpointKey xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`|The header value to authorize your request to Azure. |
    |`Content-type`|`application/json`|The header value for your content.|
    ||`{"question":"<Your question>"}`|The body of the POST request as a JSON object. This value will change in each following section depending on what the query is meant to do.|

    > [!IMPORTANT]
    > Remember to remove the key from your code when you're done, and never post it publicly. For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](../../../key-vault/general/overview.md). See the Azure AI services [security](../../security-features.md) article for more information.

1. Open Postman and create a new basic **POST** request with your published knowledge base settings. In the following sections, alter the POST body JSON to change the query to your knowledge base.

## Use metadata to filter answer

In a previous quickstart, metadata was added to two QnA pairs to distinguish between two different questions. Add the metadata to the query to restrict the filter to just the relevant QnA pair.

1. In Postman, change only the query JSON by adding the `strictFilters` property with the name/value pair of `service:qna_maker`. The body JSON should be:

    ```json
    {
        'question':'size',
        'strictFilters': [
            {
                'name':'service','value':'qna_maker'
            }
        ]
    }
    ```

    The question is just a single word, `size`, which can return either of the two question and answer pairs. The `strictFilters` array tells the response to reduce to just the `qna_maker` answers.

1. The response includes only the answer that meets the filter criteria.

    The following response has been formatted for readability:

    ```JSON
    {
        "answers": [
            {
                "questions": [
                    "How large a knowledge base can I create?",
                    "What is the max size of a knowledge base?",
                    "How many GB of data can a knowledge base hold?"
                ],
                "answer": "The size of the knowledge base depends on the SKU of Azure search you choose when creating the QnA Maker service. Read [here](../concepts/azure-resources.md) for more details.",
                "score": 68.76,
                "id": 3,
                "source": "https://learn.microsoft.com/azure/ai-services/qnamaker/troubleshooting",
                "metadata": [
                    {
                        "name": "link_in_answer",
                        "value": "true"
                    },
                    {
                        "name": "service",
                        "value": "qna_maker"
                    }
                ],
                "context": {
                    "isContextOnly": false,
                    "prompts": []
                }
            }
        ],
        "debugInfo": null
    }
    ```

    If there is a question and answer pair that didn't meet the search term but did meet the filter, it would not be returned. Instead, the general answer `No good match found in KB.` is returned.

## Use debug query property

> [!NOTE]
>We don't recommend to use Debug property for any dependency. This property has been added to help the product team in troubleshooting.

Debug information helps you understand how the returned answer was determined. While it is helpful, it is not necessary. To generate an answer with debug information, add the `debug` property:

1. In Postman, change only the body JSON by adding the `debug` property. The JSON should be:

    ```json
    {
        'question':'size',
        'Debug': {
            'Enable':true
        }

    }
    ```

1. The response includes the relevant information about the answer. In the following JSON output, some debug details have been replaced with ellipsis.

    ```console
    {
        "answers": [
            {
                "questions": [
                    "How do I share a knowledge base with others?"
                ],
                "answer": "Sharing works at the level of a QnA Maker service, that is, all knowledge bases in the service will be shared.",
                "score": 56.07,
                "id": 5,
                "source": "https://learn.microsoft.com/azure/ai-services/qnamaker/troubleshooting",
                "metadata": [],
                "context": {
                    "isContextOnly": false,
                    "prompts": []
                }
            }
        ],
        "debugInfo": {
            "userQuery": {
                "question": "How do I programmatically update my Knowledge Base?",
                "top": 1,
                "userId": null,
                "strictFilters": [],
                "isTest": false,
                "debug": {
                    "enable": true,
                    "recordL1SearchLatency": false,
                    "mockQnaL1Content": null
                },
                "rankerType": 0,
                "context": null,
                "qnaId": 0,
                "scoreThreshold": 0.0
            },
            "rankerInfo": {
                "specialFuzzyQuery": "how do i programmatically~6 update my knowledge base",
                "synonyms": "what s...",
                "rankerLanguage": "English",
                "rankerFileName": "https://qnamakerstore.blob.core.windows.net/qnamakerdata/rankers/ranker-English.ini",
                "rankersDirectory": "D:\\home\\site\\wwwroot\\Data\\QnAMaker\\rd0003ffa60fc45.24.0\\RankerData\\Rankers",
                "allQnAsfeatureValues": {
                    "WordnetSimilarity": {
                        "5": 0.54706300120043716,...
                    },
                    ...
                },
                "rankerVersion": "V2",
                "rankerModelType": "TreeEnsemble",
                "rankerType": 0,
                "indexResultsCount": 25,
                "reRankerResultsCount": 1
            },
            "runtimeVersion": "5.24.0",
            "indexDebugInfo": {
                "indexDefinition": {
                    "name": "064a4112-bd65-42e8-b01d-141c4c9cd09e",
                    "fields": [...
                    ],
                    "scoringProfiles": [],
                    "defaultScoringProfile": null,
                    "corsOptions": null,
                    "suggesters": [],
                    "analyzers": [],
                    "tokenizers": [],
                    "tokenFilters": [],
                    "charFilters": [],
                    "@odata.etag": "\"0x8D7A920EA5EE6FE\""
                },
                "qnaCount": 117,
                "parameters": {},
                "azureSearchResult": {
                    "continuationToken": null,
                    "@odata.count": null,
                    "@search.coverage": null,
                    "@search.facets": null,
                    "@search.nextPageParameters": null,
                    "value": [...],
                    "@odata.nextLink": null
                }
            },
            "l1SearchLatencyInMs": 0,
            "qnaL1Results": {...}
        },
        "activeLearningEnabled": true
    }
    ```

## Use test knowledge base

If you want to get an answer from the test knowledge base, use the `isTest` body property.

In Postman, change only the body JSON by adding the `isTest` property. The JSON should be:

```json
{
    'question':'size',
    'isTest': true
}
```

The JSON response uses the same schema as the published knowledge base query.

> [!NOTE]
> If the test and published knowledge bases are exactly the same, there may still be some slight variation because the test index is shared among all knowledge bases in the resource.

## Query for a Chit-chat answer

1. In Postman, change only the body JSON to a conversation-ending statement from the user. The JSON should be:

    ```json
    {
        'question':'thank you'
    }
    ```

1. The response includes the score and answer.

    ```json
    {
      "answers": [
          {
              "questions": [
                  "I thank you",
                  "Oh, thank you",
                  "My sincere thanks",
                  "My humblest thanks to you",
                  "Marvelous, thanks",
                  "Marvelous, thank you kindly",
                  "Marvelous, thank you",
                  "Many thanks to you",
                  "Many thanks",
                  "Kthx",
                  "I'm grateful, thanks",
                  "Ahh, thanks",
                  "I'm grateful for that, thank you",
                  "Perfecto, thanks",
                  "I appreciate you",
                  "I appreciate that",
                  "I appreciate it",
                  "I am very thankful for that",
                  "How kind, thank you",
                  "Great, thanks",
                  "Great, thank you",
                  "Gracias",
                  "Gotcha, thanks",
                  "Gotcha, thank you",
                  "Awesome thanks!",
                  "I'm grateful for that, thank you kindly",
                  "thank you pal",
                  "Wonderful, thank you!",
                  "Wonderful, thank you very much",
                  "Why thank you",
                  "Thx",
                  "Thnx",
                  "That's very kind",
                  "That's great, thanks",
                  "That is lovely, thanks",
                  "That is awesome, thanks!",
                  "Thanks bot",
                  "Thanks a lot",
                  "Okay, thanks!",
                  "Thank you so much",
                  "Perfect, thanks",
                  "Thank you my friend",
                  "Thank you kindly",
                  "Thank you for that",
                  "Thank you bot",
                  "Thank you",
                  "Right on, thanks very much",
                  "Right on, thanks a lot",
                  "Radical, thanks",
                  "Rad, thanks",
                  "Rad thank you",
                  "Wonderful, thanks!",
                  "Thanks"
              ],
              "answer": "You're welcome.",
              "score": 100.0,
              "id": 75,
              "source": "qna_chitchat_Professional.tsv",
              "metadata": [
                  {
                      "name": "editorial",
                      "value": "chitchat"
                  }
              ],
              "context": {
                  "isContextOnly": false,
                  "prompts": []
              }
          }
      ],
      "debugInfo": null,
      "activeLearningEnabled": true
    }
    ```

    Because the question of `Thank you` exactly matched a Chit-chat question, QnA Maker is completely confident with the score of 100. QnA Maker also returned all the related questions, and the metadata property containing the Chit-chat metadata tag information.

## Use threshold and default answer

You can request a minimum threshold for the answer. If the threshold is not met, the default answer is returned.

1. In Postman, change only the body JSON to a conversation-ending statement from the user. The JSON should be:

    ```json
    {
        'question':'size',
        'scoreThreshold':80.00
    }
    ```

    The knowledge base should not find that answer because the question's score is 71%, and instead return the default answer you provided when you created the knowledge base.

    The returned JSON response, including the score and answer is:

    ```json
    {
        "answers": [
            {
                "questions": [],
                "answer": "No good match found in KB.",
                "score": 0.0,
                "id": -1,
                "source": null,
                "metadata": []
            }
        ],
        "debugInfo": null,
        "activeLearningEnabled": true
    }
    ```

    QnA Maker returned a score of `0`, which means no confidence. It also returned the default answer.

1. Change the threshold value to 60% and request the query again:

    ```json
    {
        'question':'size',
        'scoreThreshold':60.00
    }
    ```

    The returned JSON found the answer.

    ```json
    {
        "answers": [
            {
                "questions": [
                    "How large a knowledge base can I create?",
                    "What is the max size of a knowledge base?",
                    "How many GB of data can a knowledge base hold?"
                ],
                "answer": "The size of the knowledge base depends on the SKU of Azure search you choose when creating the QnA Maker service. Read [here](../concepts/azure-resources.md) for more details.",
                "score": 71.1,
                "id": 3,
                "source": "https://learn.microsoft.com/azure/ai-services/qnamaker/troubleshooting",
                "metadata": [
                    {
                        "name": "link_in_answer",
                        "value": "true"
                    },
                    {
                        "name": "server",
                        "value": "qna_maker"
                    }
                ],
                "context": {
                    "isContextOnly": false,
                    "prompts": []
                }
            }
        ],
        "debugInfo": null,
        "activeLearningEnabled": true
    }
    ```
## Use unstructured data sources.
    
We now support the ability to add unstructured documents that can't be used to extract QnAs. The user can choose to include or exclude unstructured data sets in the GenerateAnswer API when fetching a response to the query. We don't support unstructured data sets in the GA service. It is only supported in custom question answering.
