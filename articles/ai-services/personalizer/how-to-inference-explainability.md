---
title: "How-to: Use Inference Explainability" 
titleSuffix: Azure AI services
description: Personalizer can return feature scores in each Rank call to provide insight on what features are important to the model's decision.
author: jcodella
ms.author: jacodel
ms.manager: nitinme
ms.service: azure-ai-personalizer
ms.topic: how-to
ms.date: 09/20/2022
---

# Inference Explainability

[!INCLUDE [Deprecation announcement](includes/deprecation.md)]

Personalizer can help you to understand which features of a chosen action are the most and least influential to then model during inference. When enabled, inference explainability includes feature scores from the underlying model into the Rank API response, so your application receives this information at the time of inference.

Feature scores empower you to better understand the relationship between features and the decisions made by Personalizer. They can be used to provide insight to your end-users into why a particular recommendation was made, or to analyze whether your model is exhibiting bias toward or against certain contextual settings, users, and actions.

## How do I enable inference explainability?

Setting the service configuration flag IsInferenceExplainabilityEnabled in your service configuration enables Personalizer to include feature values and weights in the Rank API response. To update your current service configuration, use the [Service Configuration – Update API](/rest/api/personalizer/1.1preview1/service-configuration/update?tabs=HTTP). In the JSON request body, include your current service configuration and add the additional entry: “IsInferenceExplainabilityEnabled”: true. If you don’t know your current service configuration, you can obtain it from the [Service Configuration – Get API](/rest/api/personalizer/1.1preview1/service-configuration/get?tabs=HTTP)

```JSON
{
  "rewardWaitTime": "PT10M",
  "defaultReward": 0,
  "rewardAggregation": "earliest",
  "explorationPercentage": 0.2,
  "modelExportFrequency": "PT5M",
  "logMirrorEnabled": true,
  "logMirrorSasUri": "https://testblob.blob.core.windows.net/container?se=2020-08-13T00%3A00Z&sp=rwl&spr=https&sv=2018-11-09&sr=c&sig=signature",
  "logRetentionDays": 7,
  "lastConfigurationEditDate": "0001-01-01T00:00:00Z",
  "learningMode": "Online",
  "isAutoOptimizationEnabled": true,
  "autoOptimizationFrequency": "P7D",
  "autoOptimizationStartDate": "2019-01-19T00:00:00Z",
"isInferenceExplainabilityEnabled": true
}
```

> [!NOTE]
> Enabling inference explainability will significantly increase the latency of calls to the Rank API. We recommend experimenting with this capability and measuring the latency in your scenario to see if it satisfies your application’s latency requirements. 


## How to interpret feature scores?
Enabling inference explainability will add a collection to the JSON response from the Rank API called *inferenceExplanation*. This contains a list of feature names and values that were submitted in the Rank request, along with feature scores learned by Personalizer’s underlying model. The feature scores provide you with insight on how influential each feature was in the model choosing the action.

```JSON

{
  "ranking": [
    {
      "id": "EntertainmentArticle",
      "probability": 0.8
    },
    {
      "id": "SportsArticle",
      "probability": 0.15
    },
    {
      "id": "NewsArticle",
      "probability": 0.05
    }
  ],
 "eventId": "75269AD0-BFEE-4598-8196-C57383D38E10",
 "rewardActionId": "EntertainmentArticle",
 "inferenceExplanation": [
    {
        "id”: "EntertainmentArticle",
        "features": [
            {
                "name": "user.profileType",
                "score": 3.0
            },
            {
                "name": "user.latLong",
                "score": -4.3
            },
            {
                "name": "user.profileType^user.latLong",
                "score" : 12.1
            },
        ]
  ]
}
```

In the example above, three action IDs are returned in the _ranking_ collection along with their respective probabilities scores. The action with the largest probability is the_ best action_ as determined by the model trained on data sent to the Personalizer APIs, which in this case is `"id": "EntertainmentArticle"`. The action ID can be seen again in the _inferenceExplanation_ collection, along with the feature names and scores determined by the model for that action and the features and values sent to the Rank API. 

Recall that Personalizer will either return the _best action_ or an _exploratory action_ chosen by the exploration policy. The best action is the one that the model has determined has the highest probability of maximizing the average reward, whereas exploratory actions are chosen among the set of all possible actions provided in the Rank API call. Actions taken during exploration do not leverage the feature scores in determining which action to take, therefore **feature scores for exploratory actions should not be used to gain an understanding of why the action was taken.** [You can learn more about exploration here](concepts-exploration.md).

For the best actions returned by Personalizer, the feature scores can provide general insight where:
* Larger positive scores provide more support for the model choosing this action. 
* Larger negative scores provide more support for the model not choosing this action.
* Scores close to zero have a small effect on the decision to choose this action.

## Important considerations for Inference Explainability
* **Increased latency.** Enabling _Inference Explainability_ will significantly increase the latency of Rank API calls due to processing of the feature information. Run experiments and measure the latency in your scenario to see if it satisfies your application’s latency requirements. 

* **Correlated Features.** Features that are highly correlated with each other can reduce the utility of feature scores. For example, suppose Feature A is highly correlated with Feature B. It may be that Feature A’s score is a large positive value while Feature B’s score is a large negative value. In this case, the two features may effectively cancel each other out and have little to no impact on the model. While Personalizer is very robust to highly correlated features, when using _Inference Explainability_, ensure that features sent to Personalizer are not highly correlated
* **Default exploration only.**	Currently, Inference Explainability supports only the default exploration algorithm.


## Next steps

[Reinforcement learning](concepts-reinforcement-learning.md)
