---
title: include file
description: include file
services: cognitive-services
manager: nitinme
ms.service: cognitive-services
ms.subservice: qna-maker
ms.topic: include
ms.custom: include file
ms.date: 11/09/2020
---

This cURL-based quickstart walks you through getting an answer from your knowledge base.

## Prerequisites

* You must have
    * Latest [**cURL**](https://curl.haxx.se/).
    * If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/cognitive-services/) before you begin.

# [QnA Maker GA (stable release)](#tab/v1)

> * A [QnA Maker resource](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesQnAMaker) created in the Azure portal. Remember your Azure Active Directory ID, Subscription, QnA resource name you selected when you created the resource.

# [Custom question answering (preview release)](#tab/v2)

> * A [Text Analytics resource](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics) with the custom question answering feature enabled in the Azure portal. Remember your Azure Active Directory ID, Subscription, and Text Analytics resource name you selected when you created the resource.

---

   * A trained and published knowledge base with questions and answers, from the previous [quickstart](../Quickstarts/add-question-metadata-portal.md), configured with metadata and Chit chat.


> [!NOTE]
> When you are ready to generate an answer to a question from your knowledge base, you must [train](../Quickstarts/create-publish-knowledge-base.md#save-and-train) and [publish](../Quickstarts/create-publish-knowledge-base.md#publish-the-knowledge-base) your knowledge base. When your knowledge base is published, the **Publish** page displays the HTTP request settings to generate an answer. The **cURL** tab shows the settings required to generate an answer from the command-line tool.

## Use metadata to filter answer

Use the knowledge base from the previous quick to query for an answer based on metadata.

1. From the knowledge base's **Settings** page, select the **CURL** tab to see an example cURL command used to generate an answer from the knowledge base.
1. Copy the command to an editable environment (such as a text file) so you can edit the command. Edit the question value as follows so that the metadata of `service:qna_maker` is used as a filter for the QnA pairs.

   # [QnA Maker GA (stable release)](#tab/v1)

    ```bash
    curl -X POST https://replace-with-your-resource-name.azurewebsites.net/qnamaker/knowledgebases/replace-with-your-knowledge-base-id/generateAnswer -H "Authorization: EndpointKey replace-with-your-endpoint-key" -H "Content-type: application/json" -d "{'top':30, 'question':'size','strictFilters': [{'name':'service','value':'qna_maker'}]}"
    ```
   # [Custom question answering (preview release)](#tab/v2)
    
    ```bash
    curl -X POST https://replace-with-your-resource-name.cognitiveservices.azure.com/qnamaker/v5.0-preview.2/knowledgebases/replace-with-your-knowledge-base-id/generateAnswer -H   "Ocp-Apim-Subscription-Key: REPLACE-WITH-YOUR-RESOURCE-KEY" -H "Content-type: application/json" -d "{'top':30, 'question':'size','strictFilters': [{'name':'service','value':'qna_maker'}]}"
    ```
    ---

    The question is just a single word, `size`, which can return either of the two QnA pairs. The `strictFilters` array tells the response to reduce to just the `qna_maker` answers.

1. The response includes only the answer that meets the filter criteria. The following cURL response has been formatted for readability:

    ```JSON
    {
        "answers": [
            {
                "questions": [
                    "How large a knowledge base can I create?",
                    "What is the max size of a knowledge base?",
                    "How many GB of data can a knowledge base hold?"
                ],
                "answer": "The size of the knowledge base depends on the SKU of Azure search you choose when creating the QnA Maker service. Read [here](https://docs.microsoft.com/azure/cognitive-services/qnamaker/tutorials/choosing-capacity-qnamaker-deployment) for more details.",
                "score": 68.76,
                "id": 3,
                "source": "https://docs.microsoft.com/azure/cognitive-services/qnamaker/troubleshooting",
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

```json
Debug: {Enable:true}
```

1. Edit the cURL command to include the debug property to see more information.

   # [QnA Maker GA (stable release)](#tab/v1)
    ```bash
    curl -X POST https://replace-with-your-resource-name.azurewebsites.net/qnamaker/knowledgebases/replace-with-your-knowledge-base-id/generateAnswer -H "Authorization: EndpointKey replace-with-your-endpoint-key" -H "Content-type: application/json" -d "{'question':'size', 'Debug':{'Enable':true}}"
    ```
   # [Custom question answering (preview release)](#tab/v2)
    ```bash
    curl -X POST https://replace-with-your-resource-name.cognitiveservices.azure.com/qnamaker/v5.0-preview.2/knowledgebases/replace-with-your-knowledge-base-id/generateAnswer -H "Ocp-Apim-Subscription-Key: REPLACE-WITH-YOUR-RESOURCE-KEY" -H "Content-type: application/json" -d "{'question':'size', 'Debug':{'Enable':true}}"
    ```
    ---

1. The response includes the relevant information about the answer. In the following JSON output, some debug details have been replaced with ellipsis for brevity.

    ```console
    {
        "answers": [
            {
                "questions": [
                    "How do I share a knowledge base with others?"
                ],
                "answer": "Sharing works at the level of a QnA Maker service, that is, all knowledge bases in the service will be shared. Read [here](https://docs.microsoft.com/azure/cognitive-services/qnamaker/how-to/collaborate-knowledge-base) to learn how to collaborate on a knowledge base.",
                "score": 56.07,
                "id": 5,
                "source": "https://docs.microsoft.com/azure/cognitive-services/qnamaker/troubleshooting",
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

The property is a boolean value.

```json
isTest:true
```

The cURL command looks like:
# [QnA Maker GA](#tab/v1)
```bash
curl -X POST https://replace-with-your-resource-name.azurewebsites.net/qnamaker/knowledgebases/replace-with-your-knowledge-base-id/generateAnswer -H "Authorization: EndpointKey replace-with-your-endpoint-key" -H "Content-type: application/json" -d "{'question':'size', 'IsTest':true}"
```
# [Custom question answering (preview release)](#tab/v2)
```bash
curl -X POST https://replace-with-your-resource-name.cognitiveservices.azure.com/qnamaker/v5.0-preview.2/knowledgebases/replace-with-your-knowledge-base-id/generateAnswer -H "Ocp-Apim-Subscription-Key: REPLACE-WITH-YOUR-RESOURCE-KEY" -H "Content-type: application/json" -d "{'question':'size', 'IsTest':true}"
```

---
The JSON response uses the same schema as the published knowledge base query.

> [!NOTE]
> If the test and published knowledge bases are exactly the same, there may still be some slight variation because the test index is shared among all knowledge bases in the resource.

## Use cURL to query for a Chit-chat answer

1. In the cURL-enabled terminal, use a bot conversation-ending statement from the user, such as `Thank you` as the question. There aren't any other properties to set.
    
   # [QnA Maker GA (stable release)](#tab/v1)

    ```bash
    curl -X POST https://replace-with-your-resource-name.azurewebsites.net/qnamaker/knowledgebases/replace-with-your-knowledge-base-id/generateAnswer -H "Authorization: EndpointKey replace-with-your-endpoint-key" -H "Content-type: application/json" -d "{'question':'thank you'}"
    ```
   # [Custom question answering (preview release)](#tab/v2)

    ```bash
    curl -X POST https://replace-with-your-resource-name.cognitiveservices.azure.com/qnamaker/v5.0-preview.2/knowledgebases/replace-with-your-knowledge-base-id/generateAnswer -H "Ocp-Apim-Subscription-Key: REPLACE-WITH-YOUR-RESOURCE-KEY" -H "Content-type: application/json" -d "{'question':'thank you'}"
    ```
    ---

1. Run the cURL command and receive the JSON response, including the score and answer.

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

    Because the question of `Thank you` exactly matched a Chit-chat question, QnA Maker is completely confident with the score of 100. QnA Maker also returned all the related questions, as well as the metadata property containing the Chit-chat metadata tag information.

## Use threshold and default answer

You can request a minimum threshold for the answer. If the threshold is not met, the default answer is returned.

1. Add the `threshold` property to ask for an answer to `size` with a threshold of 80% or better. The knowledge base should not find that answer because the question's score is 71%. The result returns the default answer you provided when you created the knowledge base.

   # [QnA Maker GA (stable release)](#tab/v1)
    ```bash
    curl -X POST https://replace-with-your-resource-name.azurewebsites.net/qnamaker/knowledgebases/replace-with-your-knowledge-base-id/generateAnswer -H "Authorization: EndpointKey replace-with-your-endpoint-key" -H "Content-type: application/json" -d "{'question':'size', 'scoreThreshold':80.00}"
    ```
   # [Custom question answering (preview release)](#tab/v2)
    ```bash
    curl -X POST https://replace-with-your-resource-name.cognitiveservices.azure.com/qnamaker/v5.0-preview.2/knowledgebases/replace-with-your-knowledge-base-id/generateAnswer -H "Ocp-Apim-Subscription-Key: REPLACE-WITH-YOUR-RESOURCE-KEY" -H "Content-type: application/json" -d "{'question':'size', 'scoreThreshold':80.00}"
    ```
    ---

1. Run the cURL command and receive the JSON response.

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
    
   # [QnA Maker GA (stable release)](#tab/v1)
    ```bash
    curl -X POST https://replace-with-your-resource-name.azurewebsites.net/qnamaker/knowledgebases/replace-with-your-knowledge-base-id/generateAnswer -H "Authorization: EndpointKey replace-with-your-endpoint-key" -H "Content-type: application/json" -d "{'question':'size', 'scoreThreshold':60.00}"
    ```
   # [Custom question answering (preview release)](#tab/v2)
    ```bash
    curl -X POST https://replace-with-your-resource-name.cognitiveservices.azure.com/qnamaker/v5.0-preview.2/knowledgebases/replace-with-your-knowledge-base-id/generateAnswer -H "Ocp-Apim-Subscription-Key: REPLACE-WITH-YOUR-RESOURCE-KEY" -H "Content-type: application/json" -d "{'question':'size', 'scoreThreshold':60.00}"
    ```
    ---

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
                "answer": "The size of the knowledge base depends on the SKU of Azure search you choose when creating the QnA Maker service. Read [here](https://docs.microsoft.com/azure/cognitive-services/qnamaker/tutorials/choosing-capacity-qnamaker-deployment) for more details.",
                "score": 71.1,
                "id": 3,
                "source": "https://docs.microsoft.com/azure/cognitive-services/qnamaker/troubleshooting",
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
## Use unstructured data sources
    
We now support the ability to add unstrutcured documents that can't be used to extract QnAs.The user can choose to include or exclude unstructured data sets in the GenerateAnswer API when fetching a response to the query.
     
# [QnA Maker GA (stable release)](#tab/v1)
We don't support unstructured data sets in the GA service.

# [Custom question answering (preview release)](#tab/v2)

1. Set the parameter *includeUnstructuredResources* to true if you want to include unstructured data sources when evaluating the response to Generate Answer API and vice-versa.

    ```bash
    curl -X POST https://replace-with-your-resource-name.cognitiveservices.azure.com/qnamaker/v5.0-preview.2/knowledgebases/replace-with-your-knowledge-base-id/generateAnswer -H "Ocp-Apim-Subscription-Key: REPLACE-WITH-YOUR-RESOURCE-KEY" -H "Content-type: application/json" -d "{'question': 'what is Surface Headphones 2+ priced at?', 'includeUnstructuredSources':true,'top': 2}"
    ```

2. The response includes the source of answer. 
    
    ```json
    {
       "answers": [{
               "questions": [],
               "answer": "Surface Headphones 2+ is priced at $299.99 USD. Business and education customers in select markets can place orders today through microsoft.com\n\nor their local authorized reseller.\n\nMicrosoft Modern USB and Wireless Headsets:\n\nCertified for Microsoft Teams, these Microsoft Modern headsets enable greater focus and call privacy, especially in shared workspaces.",
               "score": 82.11,
               "id": 0,
               "source": "blogs-introducing-surface-laptop-4-and-new-access.pdf",
               "isDocumentText": false,
               "metadata": [],
               "answerSpan": {
                   "text": "$299.99 USD",
                   "score": 0.0,
                   "startIndex": 34,
                   "endIndex": 45
               }
           },
           {
               "questions": [],
               "answer": "Now certified for Microsoft Teams with the included dongle, Surface Headphones 2+ provides an even more robust meeting experience with on‐ear Teams controls and improved remote calling. Surface Headphones 2+ is priced at $299.99 USD. Business and education customers in select markets can place orders today through microsoft.com\n\nor their local authorized reseller.",
               "score": 81.95,
               "id": 0,
               "source": "blogs-introducing-surface-laptop-4-and-new-access.pdf",
               "isDocumentText": false,
               "metadata": []
           }
       ],
       "activeLearningEnabled": true
   }
    ```
---
