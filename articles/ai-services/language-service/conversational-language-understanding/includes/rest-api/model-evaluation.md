---
#services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.topic: include
ms.date: 05/16/2022
ms.author: aahi
---

Create a **GET** request using the following URL, headers, and JSON body to get the trained model evaluation summary.

## Model Summary

This API returns the summary of your model's evaluation results, including the precision, recall, F1, and confusion matrix of your intents and entities.

### Request URL

```rest
{ENDPOINT}/language/authoring/analyze-conversations/projects/{projectName}/models/{trainedModelLabel}/evaluation/summary-result?api-version={API-VERSION}
```

|Placeholder  |Value  | Example |
|---------|---------|---------|
|`{ENDPOINT}`     | The endpoint for authenticating your API request.   | `https://<your-custom-subdomain>.cognitiveservices.azure.com` |
|`{PROJECT-NAME}`     | The name for your project. This value is case-sensitive.   | `myProject` |
|`{trainedModelLabel}`     | The name for your trained model. This value is case-sensitive.   | `Model1` |
|`{API-VERSION}`     | The [version](../../../concepts/model-lifecycle.md#api-versions) of the API you are calling. | `2023-04-01` |


### Headers

Use the following header to authenticate your request. 

|Key|Value|
|--|--|
|`Ocp-Apim-Subscription-Key`| The key to your resource. Used for authenticating your API requests.|


### Response Body

Once you send the request, you will get the following response.

```json
{
  "entitiesEvaluation": {
    "confusionMatrix": {
      "additionalProp1": {
        "additionalProp1": {
          "normalizedValue": 0,
          "rawValue": 0
        },
        "additionalProp2": {
          "normalizedValue": 0,
          "rawValue": 0
        },
        "additionalProp3": {
          "normalizedValue": 0,
          "rawValue": 0
        }
      },
      "additionalProp2": {
        "additionalProp1": {
          "normalizedValue": 0,
          "rawValue": 0
        },
        "additionalProp2": {
          "normalizedValue": 0,
          "rawValue": 0
        },
        "additionalProp3": {
          "normalizedValue": 0,
          "rawValue": 0
        }
      },
      "additionalProp3": {
        "additionalProp1": {
          "normalizedValue": 0,
          "rawValue": 0
        },
        "additionalProp2": {
          "normalizedValue": 0,
          "rawValue": 0
        },
        "additionalProp3": {
          "normalizedValue": 0,
          "rawValue": 0
        }
      }
    },
    "entities": {
      "additionalProp1": {
        "f1": 0,
        "precision": 0,
        "recall": 0,
        "truePositivesCount": 0,
        "trueNegativesCount": 0,
        "falsePositivesCount": 0,
        "falseNegativesCount": 0
      },
      "additionalProp2": {
        "f1": 0,
        "precision": 0,
        "recall": 0,
        "truePositivesCount": 0,
        "trueNegativesCount": 0,
        "falsePositivesCount": 0,
        "falseNegativesCount": 0
      },
      "additionalProp3": {
        "f1": 0,
        "precision": 0,
        "recall": 0,
        "truePositivesCount": 0,
        "trueNegativesCount": 0,
        "falsePositivesCount": 0,
        "falseNegativesCount": 0
      }
    },
    "microF1": 0,
    "microPrecision": 0,
    "microRecall": 0,
    "macroF1": 0,
    "macroPrecision": 0,
    "macroRecall": 0
  },
  "intentsEvaluation": {
    "confusionMatrix": {
      "additionalProp1": {
        "additionalProp1": {
          "normalizedValue": 0,
          "rawValue": 0
        },
        "additionalProp2": {
          "normalizedValue": 0,
          "rawValue": 0
        },
        "additionalProp3": {
          "normalizedValue": 0,
          "rawValue": 0
        }
      },
      "additionalProp2": {
        "additionalProp1": {
          "normalizedValue": 0,
          "rawValue": 0
        },
        "additionalProp2": {
          "normalizedValue": 0,
          "rawValue": 0
        },
        "additionalProp3": {
          "normalizedValue": 0,
          "rawValue": 0
        }
      },
      "additionalProp3": {
        "additionalProp1": {
          "normalizedValue": 0,
          "rawValue": 0
        },
        "additionalProp2": {
          "normalizedValue": 0,
          "rawValue": 0
        },
        "additionalProp3": {
          "normalizedValue": 0,
          "rawValue": 0
        }
      }
    },
    "intents": {
      "additionalProp1": {
        "f1": 0,
        "precision": 0,
        "recall": 0,
        "truePositivesCount": 0,
        "trueNegativesCount": 0,
        "falsePositivesCount": 0,
        "falseNegativesCount": 0
      },
      "additionalProp2": {
        "f1": 0,
        "precision": 0,
        "recall": 0,
        "truePositivesCount": 0,
        "trueNegativesCount": 0,
        "falsePositivesCount": 0,
        "falseNegativesCount": 0
      },
      "additionalProp3": {
        "f1": 0,
        "precision": 0,
        "recall": 0,
        "truePositivesCount": 0,
        "trueNegativesCount": 0,
        "falsePositivesCount": 0,
        "falseNegativesCount": 0
      }
    },
    "microF1": 0,
    "microPrecision": 0,
    "microRecall": 0,
    "macroF1": 0,
    "macroPrecision": 0,
    "macroRecall": 0
  },
  "evaluationOptions": {
    "kind": "percentage",
    "trainingSplitPercentage": 0,
    "testingSplitPercentage": 0
  }
}

```


## Model Results

This API returns the individual results for each utterance including their expected and actual predictions for intents and entities.

### Request URL

```rest
{ENDPOINT}/language/authoring/analyze-conversations/projects/{projectName}/models/{trainedModelLabel}/evaluation/result?top={top}&skip={skip}&maxpagesize={maxpagesize}&api-version={API-VERSION}
```

|Placeholder  |Value  | Example |
|---------|---------|---------|
|`{ENDPOINT}`     | The endpoint for authenticating your API request.   | `https://<your-custom-subdomain>.cognitiveservices.azure.com` |
|`{PROJECT-NAME}`     | The name for your project. This value is case-sensitive.   | `myProject` |
|`{trainedModelLabel}`     | The name for your trained model. This value is case-sensitive.   | `Model1` |
|`{API-VERSION}`     | The [version](../../../concepts/model-lifecycle.md#api-versions) of the API you are calling. | `2023-04-01` |
|`{top}`     | The maximum number of utterances to return from the collection. Optional.  | `100` |
|`{skip}`     | An offset into the collection of the first utterance to be returned. Optional.   | `100` |
|`{maxpagesize}`     | The maximum number of utterances to include in a single response. Optional | `100` |



### Headers

Use the following header to authenticate your request. 

|Key|Value|
|--|--|
|`Ocp-Apim-Subscription-Key`| The key to your resource. Used for authenticating your API requests.|


### Response Body

Once you send the request, you will get the following response.

```json
{
  "value": [
    {
      "text": "send the email",
      "language": "en-us",
      "entitiesResult": {
        "expectedEntities": [],
        "predictedEntities": []
      },
      "intentsResult": {
        "expectedIntent": "SendEmail",
        "predictedIntent": "SendEmail"
      }
    },
    {
      "text": "send a mail to daniel",
      "language": "en-us",
      "entitiesResult": {
        "expectedEntities": [
          {
            "category": "ContactName",
            "offset": 15,
            "length": 6
          }
        ],
        "predictedEntities": [
          {
            "category": "ContactName",
            "offset": 15,
            "length": 6
          }
        ]
      },
      "intentsResult": {
        "expectedIntent": "SendEmail",
        "predictedIntent": "SendEmail"
      }
    },
    {
      "text": "i forgot to add an important part to that email to james . please set it up to edit",
      "language": "en-us",
      "entitiesResult": {
        "expectedEntities": [
          {
            "category": "ContactName",
            "offset": 51,
            "length": 5
          }
        ],
        "predictedEntities": [
          {
            "category": "Category",
            "offset": 19,
            "length": 9
          },
          {
            "category": "ContactName",
            "offset": 51,
            "length": 5
          }
        ]
      },
      "intentsResult": {
        "expectedIntent": "AddMore",
        "predictedIntent": "AddMore"
      }
    },
    {
      "text": "send email to a and tian",
      "language": "en-us",
      "entitiesResult": {
        "expectedEntities": [
          {
            "category": "ContactName",
            "offset": 14,
            "length": 1
          },
          {
            "category": "ContactName",
            "offset": 20,
            "length": 4
          }
        ],
        "predictedEntities": [
          {
            "category": "ContactName",
            "offset": 14,
            "length": 1
          },
          {
            "category": "ContactName",
            "offset": 20,
            "length": 4
          }
        ]
      },
      "intentsResult": {
        "expectedIntent": "SendEmail",
        "predictedIntent": "SendEmail"
      }
    },
    {
      "text": "send thomas an email",
      "language": "en-us",
      "entitiesResult": {
        "expectedEntities": [
          {
            "category": "ContactName",
            "offset": 5,
            "length": 6
          }
        ],
        "predictedEntities": [
          {
            "category": "ContactName",
            "offset": 5,
            "length": 6
          }
        ]
      },
      "intentsResult": {
        "expectedIntent": "SendEmail",
        "predictedIntent": "SendEmail"
      }
    },
    {
      "text": "i need to add more to the email message i am sending to vincent",
      "language": "en-us",
      "entitiesResult": {
        "expectedEntities": [
          {
            "category": "ContactName",
            "offset": 56,
            "length": 7
          }
        ],
        "predictedEntities": [
          {
            "category": "ContactName",
            "offset": 56,
            "length": 7
          }
        ]
      },
      "intentsResult": {
        "expectedIntent": "AddMore",
        "predictedIntent": "AddMore"
      }
    },
    {
      "text": "send an email to lily roth and abc123@microsoft.com",
      "language": "en-us",
      "entitiesResult": {
        "expectedEntities": [
          {
            "category": "ContactName",
            "offset": 17,
            "length": 9
          }
        ],
        "predictedEntities": [
          {
            "category": "ContactName",
            "offset": 17,
            "length": 9
          }
        ]
      },
      "intentsResult": {
        "expectedIntent": "SendEmail",
        "predictedIntent": "SendEmail"
      }
    },
    {
      "text": "i need to add something else to my email to cheryl",
      "language": "en-us",
      "entitiesResult": {
        "expectedEntities": [
          {
            "category": "ContactName",
            "offset": 44,
            "length": 6
          }
        ],
        "predictedEntities": [
          {
            "category": "ContactName",
            "offset": 44,
            "length": 6
          }
        ]
      },
      "intentsResult": {
        "expectedIntent": "AddMore",
        "predictedIntent": "AddMore"
      }
    },
    {
      "text": "send an email to larry , joseph and billy larkson",
      "language": "en-us",
      "entitiesResult": {
        "expectedEntities": [
          {
            "category": "ContactName",
            "offset": 17,
            "length": 5
          },
          {
            "category": "ContactName",
            "offset": 25,
            "length": 6
          },
          {
            "category": "ContactName",
            "offset": 36,
            "length": 13
          }
        ],
        "predictedEntities": [
          {
            "category": "ContactName",
            "offset": 17,
            "length": 5
          },
          {
            "category": "ContactName",
            "offset": 25,
            "length": 6
          },
          {
            "category": "ContactName",
            "offset": 36,
            "length": 13
          }
        ]
      },
      "intentsResult": {
        "expectedIntent": "SendEmail",
        "predictedIntent": "SendEmail"
      }
    },
    {
      "text": "send mail to dorothy",
      "language": "en-us",
      "entitiesResult": {
        "expectedEntities": [
          {
            "category": "ContactName",
            "offset": 13,
            "length": 7
          }
        ],
        "predictedEntities": [
          {
            "category": "ContactName",
            "offset": 13,
            "length": 7
          }
        ]
      },
      "intentsResult": {
        "expectedIntent": "SendEmail",
        "predictedIntent": "SendEmail"
      }
    }
  ],
  "nextLink": "{Endpoint}/language/authoring/analyze-conversations/projects/{projectName}/models/{trainedModelLabel}/evaluation/result/?api-version=2022-10-01-preview&top={top}&skip={skip}&maxpagesize={maxpagesize}"
}
```

