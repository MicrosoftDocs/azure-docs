---
title: 'Build Types and Model Quality: Recommendations API | Microsoft Docs'
description: Azure Machine Learning Recommendations--quick start guide
services: cognitive-services
documentationcenter: ''
author: luiscabrer
manager: jhubbard
editor: cgronlun

ms.assetid: 7e0beaa7-2646-4504-bce3-0d7bf767136a
ms.service: cognitive-services
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/20/2016
ms.author: luisca

---
# Build types and model quality
<a name="TypeofBuilds"></a>

## Supported build types
The Recommendations API currently supports two build types: *recommendation* and *FBT*. Each is built using different algorithms, and each has different strengths. This document describes each of these builds and techniques for comparing the quality of the models generated.

If you have not done so already, we recommend that you complete the [quick start guide](cognitive-services-recommendations-quick-start.md).

<a name="RecommendationBuild"></a>

### Recommendation build type
The recommendation build type uses matrix factorization to provide recommendations. It generates [latent feature](https://en.wikipedia.org/wiki/Latent_variable) vectors based on your transactions to describe each item, and then uses those latent vectors to compare items that are similar.

If you train the model based on purchases made in your electronics store and provide a Lumia 650 phone as the input to the model, the model will return a set of items that tend to be purchased by people who are likely to purchase a Lumia 650 phone. The items may not be complementary. In this example, it is possible that the model will return other phones because people who like the Lumia 650 may like other phones.

The recommendation build has two capabilities that make it attractive:

**The recommendation build supports *cold item* placement**

Items that do not have significant usage are called cold items. For instance, if you receive a shipment of a phone you have never sold before, the system cannot infer recommendations for this product on transactions alone. This means that the system should learn from information about the product itself.

If you want to use cold item placement, you need to provide features information for each of your items in the catalog. Following is what the first few lines of your catalog may look like (note the key=value format for the features).

> 6CX-00001,Surface Pro2, Surface,, Type=Hardware, Storage=128 GB, Memory=4G, Manufacturer=Microsoft
> 
> 73H-00013,Wake Xbox 360,Gaming,, Type=Software, Language=English, Rating=Mature
> 
> WAH-0F05,Minecraft Xbox 360,Gaming,, * Type=Software, Language=Spanish, Rating=Youth
> 
> 

You also need to set the following build parameters:

| Build parameter | Notes |
| --- | --- |
| *useFeaturesInModel* |Set to **true**.  Indicates if features can be used to enhance the recommendation model. |
| *allowColdItemPlacement* |Set to **true**. Indicates if the recommendation should also push cold items via feature similarity. |
| *modelingFeatureList* |Comma-separated list of feature names to be used in the recommendation build to enhance the recommendation. For instance, “Language,Storage” for the preceding example. |

**The recommendation build supports user recommendations**

A recommendation build supports [user recommendations](https://westus.dev.cognitive.microsoft.com/docs/services/Recommendations.V4.0/operations/56f30d77eda5650db055a3dd). This means that it can provide personalized recommendations for users based on their transaction histories. For user recommendations, you might provide the user ID or the recent history of transactions for that user.

One classic example of where you might want to apply user recommendations is at sign-in on the welcome page. There you can promote content that applies to the specific user.

You might also want to apply a recommendations build type when the user is about to check out. At that point, you have the list of items the user is about to purchase, and you can provide recommendations based on the current market basket.

#### Recommendations build parameters
| Name | Description | Type, <br>  valid values, <br> (default value) |
| --- | --- | --- |
| *NumberOfModelIterations* |The number of iterations the model performs is reflected by the overall compute time and the model accuracy. The higher the number, the more accurate the model, but the compute time takes longer. |Integer, <br>     10 to 50 <br>(40) |
| *NumberOfModelDimensions* |The number of dimensions relates to the number of features the model will try to find within your data. Increasing the number of dimensions will allow better fine-tuning of the results into smaller clusters. However, too many dimensions will prevent the model from finding correlations between items. |Integer, <br> 10 to 40 <br>(20) |
| *ItemCutOffLowerBound* |Defines the minimum number of usage points an item should be in for it to be considered part of the model. |Integer, <br> 2 or more <br> (2) |
| *ItemCutOffUpperBound* |Defines the maximum number of usage points an item should be in for it to be considered part of the model. |Integer, <br>2 or more<br> (2147483647) |
| *UserCutOffLowerBound* |Defines the minimum number of transactions a user must have performed to be considered part of the model. |Integer, <br> 2 or more <br> (2) |
| *UserCutOffUpperBound* |Defines the maximum number of transactions a user must have performed to be considered part of the model. |Integer, <br>2 or more <br> (2147483647) |
| *UseFeaturesInModel* |Indicates if features can be used to enhance the recommendation model. |Boolean<br> Default: True |
| *ModelingFeatureList* |Comma-separated list of feature names to be used in the recommendation build to enhance the recommendation. It depends on the features that are important. |String, up to 512 chars |
| *AllowColdItemPlacement* |Indicates if the recommendation should also push cold items via feature similarity. |Boolean <br> Default: False |
| *EnableFeatureCorrelation* |Indicates if features can be used in reasoning. |Boolean <br> Default: False |
| *ReasoningFeatureList* |Comma-separated list of feature names to be used for reasoning sentences, such as recommendation explanations. It depends on the features that are important to customers. |String, up to 512 chars |
| *EnableU2I* |Enable personalized recommendations, also called user to item (U2I) recommendations. |Boolean <br>Default: True |
| *EnableModelingInsights* |Defines whether offline evaluation should be performed to gather modeling insights (that is, precision and diversity metrics). If set to true, a subset of the data will not be used for training because it will need to be reserved for testing of the model. Read more about [offline evaluations](#OfflineEvaluation). |Boolean <br> Default: False |
| *SplitterStrategy* |If enable modeling insights is set to *true*, this is how data should be split for evaluation purposes. |String, *RandomSplitter* or *LastEventSplitter* <br>Default:  RandomSplitter |

<a name="FBTBuild"></a>

### FBT build type
The frequently bought together (FBT) build does an analysis that counts the number of times two or three different products co-occur together. It then sorts the sets based on a similarity function (**co-occurrences**, **Jaccard**, **lift**).

Think of **Jaccard** and **lift** as ways to normalize the co-occurrences.  This means that the items will be returned only if they where purchased together with the seed item.

In our Lumia 650 phone example, phone X will be returned only if phone X was purchased in the same session as the Lumia 650 phone. Because this may be unlikely, we would expect items complementary to the Lumia 650 to be returned; for instance, a screen protector, or a power adapter for the Lumia 650.

Currently, two items are assumed to be purchased in the same session if they occur in a transaction with the same user ID and timestamp.

FBT builds do not support cold items, because by definition they expect two items to be purchased in the same transaction. While FBT builds can return sets of items (triplets), they do not support personalized recommendations because they accept a single seed item as the input.

#### FBT build parameters
| Name | Description | Type,  <br> valid values, <br> (default value) |
| --- | --- | --- |
| *FbtSupportThreshold* |How conservative the model is. Number of co-occurrences of items to be considered for modeling. |Integer, <br> 3-50 <br> (6) |
| *FbtMaxItemSetSize* |Bounds the number of items in a frequent set. |Integer    <br> 2-3 <br> (2) |
| *FbtMinimalScore* |Minimal score that a frequent set should have to be included in the returned results. The higher the better. |Double <br> 0 and above <br> (0) |
| *FbtSimilarityFunction* |Defines the similarity function to be used by the build. **Lift** favors serendipity, **co-occurrence** favors predictability, and **Jaccard** is a compromise between the two. |String,  <br>  <i>cooccurrence, lift, jaccard</i><br> Default: <i>jaccard</i> |

<a name="SelectBuild"></a>

## Build evaluation and selection
This guidance might help you determine whether you should use a recommendations build or an FBT build, but it does not provide a definitive answer in cases where you could use either of them. Also, even if you know that you want to use an FBT build type, you might still want to choose **Jaccard** or **lift** as the similarity function.

The best way to select between two different builds is to test them in the real world (online evaluation) and track a conversion rate for the different builds. The conversion rate could be measured based on recommendation clicks, the number actual purchases from recommendations shown, or even on the actual purchase amounts when the different recommendations were shown. You may select your conversion rate metric based on your business objective.

In some cases, you may want to evaluate the model offline before you put it in production. While offline evaluation is not a replacement for online evaluation, it can serve as a metric.

<a name="OfflineEvaluation"></a>

## Offline evaluation
The goal of an offline evaluation is to predict precision (the number of users that will purchase one of the recommended items) and the diversity of recommendations (the number of items that are recommended).
As part of the precision and diversity metrics evaluation, the system finds a sample of users and splits  the transactions for those users into two groups: the training dataset and the test dataset.

> [!NOTE]
> To use offline metrics, you must have timestamps in your usage data.
> Time data is required to split usage correctly between training and test datasets.
> 
> Also, offline evaluation may not yield results for small usage files. For the evaluation to be thorough, there should be a minimum of 1,000 usage points in the test dataset.
> 
> 

<a name="Precision"></a>

### Precision-at-k
The following table represents the output of the precision-at-k offline evaluation.

| K | 1 | 2 | 3 | 4 | 5 |
| --- | --- | --- | --- | --- | --- |
| Percentage |13.75 |18.04 |21 |24.31 |26.61 |
| Users in test |10,000 |10,000 |10,000 |10,000 |10,000 |
| Users considered |10,000 |10,000 |10,000 |10,000 |10,000 |
| Users not considered |0 |0 |0 |0 |0 |

#### K
In the preceding table, *k* represents the number of recommendations shown to the customer. The table reads as follows: “If during the test period, only one recommendation was shown to the customers, only 13.75 of the users would have purchased that recommendation.” This statement is based on the assumption that the model was trained with purchase data. Another way to say this is that the precision at 1 is 13.75.

You will notice that as more items are shown to the customer, the likelihood of the customer purchasing a recommended item goes up. For the preceding experiment, the probability almost doubles to 26.61 percent when 5 items are recommended.

#### Percentage
The percentage of users that interacted with at least one of the *k* recommendations is shown. The percentage is calculated by dividing the number of users that interacted with at least one recommendation by the total number of users considered. See Users considered for more information.

#### Users in test
Data in this row represents the total number of users in the test dataset.

#### Users considered
A user is only considered if the system recommended at least *k* items based on the model generated using the training dataset.

#### Users not considered
Data in this row represents any users not considered. The users that did not receive at least *k* recommended items.

User not considered = users in test – users considered

<a name="Diversity"></a>

### Diversity
Diversity metrics measure the type of items recommended. The following table represents the output of the diversity offline evaluation.

| Percentile bucket | 0-90 | 90-99 | 99-100 |
| --- | --- | --- | --- |
| Percentage |34.258 |55.127 |10.615 |

Total items recommended: 100,000

Unique items recommended: 954

#### Percentile buckets
Each percentile bucket is represented by a span (minimum and maximum values that range between 0 and 100). The items close to 100 are the most popular items, and the items close to 0 are the least popular. For instance, if the percentage value for the 99-100 percentile bucket is 10.6, it means that 10.6 percent of the recommendations returned only the top one percent most popular items. The percentile bucket minimum value is inclusive, and the maximum value is exclusive, except for 100.

#### Unique items recommended
The unique items recommended metric shows the number of distinct items that were returned for evaluation.

#### Total items recommended
The total items recommended metric shows the number of items recommended. Some may be duplicates.

<a name="ImplementingEvaluation"></a>

### Offline evaluation metrics
The precision and diversity offline metrics may be useful when you select which build to use. At build time, as part of the respective FBT or recommendation build parameters:

* Set the *enableModelingInsights* build parameter to **true**.
* Optionally, select the *splitterStrategy* (Either *RandomSplitter* or *LastEventSplitter*).
  *RandomSplitter* splits the usage data in train and test sets based on the given *randomSplitterParameters* test percent and random seed values.
  *LastEventSplitter* splits the usage data in train and test sets based on the last transaction for each user.

This will trigger a build that uses only a subset of the data for training and uses the rest of the data to compute evaluation metrics.  After the build is completed, to get the output of the evaluation,
 you need to call the [Get build metrics API](https://westus.dev.cognitive.microsoft.com/docs/services/Recommendations.V4.0/operations/577eaa75eda565095421666f),
 passing the respective *modelId* and *buildId*.

 Following is the JSON output for the sample evaluation.

    {
     "Result": {
     "precisionItemRecommend": null,
     "precisionUserRecommend": {
      "precisionMetrics": [
        {
          "k": 1,
          "percentage": 13.75,
          "usersInTest": 10000,
          "usersConsidered": 10000,
          "usersNotConsidered": 0
        },
        {
          "k": 2,
          "percentage": 18.04,
          "usersInTest": 10000,
          "usersConsidered": 10000,
          "usersNotConsidered": 0
        },
        {
          "k": 3,
          "percentage": 21.0,
          "usersInTest": 10000,
          "usersConsidered": 10000,
          "usersNotConsidered": 0
        },
        {
          "k": 4,
          "percentage": 24.31,
          "usersInTest": 10000,
          "usersConsidered": 10000,
          "usersNotConsidered": 0
        },
        {
          "k": 5,
          "percentage": 26.61,
          "usersInTest": 10000,
          "usersConsidered": 10000,
          "usersNotConsidered": 0
        }
      ],
      "error": null
    },
    "diversityItemRecommend": null,
    "diversityUserRecommend": {
      "percentileBuckets": [
        {
          "min": 0,
          "max": 90,
          "percentage": 34.258
        },
        {
          "min": 90,
          "max": 99,
          "percentage": 55.127
        },
        {
          "min": 99,
          "max": 100,
          "percentage": 10.615
        }
      ],
      "totalItemsRecommended": 100000,
      "uniqueItemsRecommended": 954,
      "uniqueItemsInTrainSet": null,
      "error": null
      }
     },
    "Id": 1,
    "Exception": null,
    "Status": 5,
    "IsCanceled": false,
    "IsCompleted": true,
    "CreationOptions": 0,
    "AsyncState": null,
    "IsFaulted": false
    }
