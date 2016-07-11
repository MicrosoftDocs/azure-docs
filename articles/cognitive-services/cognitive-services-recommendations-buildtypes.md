<properties
	pageTitle="Quick start guide: Machine Learning Recommendations API | Microsoft Azure"
	description="Azure Machine Learning Recommendations - Quick Start Guide"
	services="cognitive-services"
	documentationCenter=""
	authors="luiscabrer"
	manager="paulettm"
	editor="cgronlun"/>

<tags
	ms.service="cognitive-services"
	ms.workload="data-services"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="05/24/2016"
	ms.author="luisca"/>

#  Build Types and Model Quality #

<a name="TypeofBuilds"></a>
## What type of recommendations build should I use? ##

Currently we support two build types: *Recommendation* and *FBT* builds. Each of them are built using different algorithms and have different strengths. This document describes each of these builds, as well as techniques for comparing the quality of the models generated.


> If you have not done so already, we encourage you to complete the [quick start guide](cognitive-services-recommendations-quick-start.md).

<a name="RecommendationBuild"></a>
### Recommendation build type ###

The *recommendation* build type uses matrix factorization to provide recommendations. The short version is that it will use the user’s transactions to generate [latent feature](https://en.wikipedia.org/wiki/Latent_variable) vectors to describe each item, and then use those latent vectors to compare items that are similar.

Assuming you train the model based on purchases made in your electronics store, and at scoring time you provide a Lumia 650 phone as the input to the model, it will return a set of items that tend to be purchased by people that are likely to purchase a Lumia 650 phone. Note that the items may not be complementary. For instance, in this example, it is possible that other phones will be returned since people that like the Lumia 650 may like other phones.

The recommendation build has two capabilities that make it attractive:

-	It supports cold item placement.

 *Cold items* is the terminology used for items that do not have significant usage. For instance, imagine you just received a shipment of the new Super-Duper Lumia phone. Since you have never sold it in the past, the system cannot infer recommendations for this product on transactions alone.
 That means that the system should learn from information about the product itself.

 If you want to use cold item placement you need to provide features information for each of your items in the catalog,
 this is what the first few lines of your catalog may look like (note the key=value format for the features):

> 6CX-00001,Surface Pro2, Surface,, Type=Hardware,  Storage=128GB,  Memory=4G, Manufacturer=Microsoft

> 73H-00013,Wake Xbox 360,Gaming,, Type=Software, Language=English, Rating=Mature

> WAH-0F05,Minecraft Xbox 360,Gaming,, * Type=Software, Language=Spanish, Rating=Youth

> ...

 In addition, as part of the build parameters, you need to set the following build parameters:

| Build parameter	      | Notes
|------------------     |-----------
|useFeaturesInModel     | Set to true.  Indicates if features can be used in order to enhance the recommendation model. 
|allowColdItemPlacement	| Set to true. Indicates if the recommendation should also push cold items via feature similarity.
| modelingFeatureList   | Comma-separated list of feature names to be used in the recommendation build, in order to enhance the recommendation. For instance “Language,Storage” for the example above.

-	It supports user recommendations.

 A Recommendation build supports [user recommendations](https://westus.dev.cognitive.microsoft.com/docs/services/Recommendations.V4.0/operations/56f30d77eda5650db055a3dd). This means that it can use the history of transactions for a user in order to provide personalized recommendations for that user. For user recommendations you may provide the user id and/or the recent history of transactions for that user.

 One classic example where you may want to apply user recommendations is when the user first logs into your store/site, on the welcome page. There you can promote content that applies to the specific user. 
 
 You may also want to apply a Recommendations build type when the user is about to check-out. At that point you have the list of items the customer is about to purchase, and this is your chance to provide recommendations based on the current market basket.
 
#### Recommendations build parameters 
 
| Name  | 	Description |	 Type, <br>  Valid Values <br> (Default Value)
|-------|-------------------|------------------
| NumberOfModelIterations |	The number of iterations the model performs is reflected by the overall compute time and the model accuracy. The higher the number, the better accuracy you will get, but the compute time will take longer.  |	 Integer, <br> 	10 to 50 <br>Default: 40 
| NumberOfModelDimensions |	The number of dimensions relates to the number of 'features' the model will try to find within your data. Increasing the number of dimensions will allow better fine-tuning of the results into smaller clusters. However, too many dimensions will prevent the model from finding correlations between items. |	Integer, <br> 10 to 40 <br> Default: 20 |
| ItemCutOffLowerBound |	Defines the minimum number of usage points an item should be in for it to be considred in the model. |		Integer, <br> 2 or More. <br> Default: 2 |
| ItemCutOffUpperBound | 	Defines the maximum number of usage points an item should be in for it to be considered in the model. |  Integer, <br>2 or More.<br> Default: 2147483647 |
|UserCutOffLowerBound |	Defines the minimum number of transactions a user must have performed to be considered in the model. |	Integer, <br> 2 or More. <br> Default: 2 
| ItemCutOffUpperBound |	Defines the maximum number of transactions a user must have performed to be considered in the model. |	Integer , <br>2 or More. <br> Default: 2147483647|
| UseFeaturesInModel |	Indicates if features can be used in order to enhance the recommendation model. | 	 Boolean<br> Default: True 
|ModelingFeatureList |	Comma-separated list of feature names to be used in the recommendation build, in order to enhance the recommendation. 	(Depends on the features that are important) |	String, up to 512 chars
| AllowColdItemPlacement |	Indicates if the recommendation should also push cold items via feature similarity.	| Boolean <br> Default: False	
| EnableFeatureCorrelation	| Indicates if features can be used in reasoning. |	Boolean <br> Default: False
| ReasoningFeatureList |	Comma-separated list of feature names to be used for reasoning sentences (e.g. recommendation explanations).	(Depends on the features that are important to customers) | String, up to 512 chars
| EnableU2I |	Enable personalized recommendation a.k.a. U2I (user to item recommendations). | Boolean <br>Default: True
|EnableModelingInsights |	Defines whether offline evaluation should be performed in order to gather modeling insights (i.e. precision and diversity metrics). If set to true, a subset of the data will not be used for training as it will need to be reserved for testing of the model. Read more about [offline evaluations](#OfflineEvaluation) | Boolean <br> Default: False
| SplitterStrategy | If enable modeling insights is set to true, the way in which data should be split for evaluation purposes  | String, *RandomSplitter* or *LastEventSplitter* <br>Default:  RandomSplitter 


<a name="FBTBuild"></a>
### FBT build type ###

*FBT* stands for Frequently-Bought-Together. The FBT build does an analysis that counts the number of times two or three different products co-occur together, and then sorts the sets based on a similarity function (Co-occurrences, Jaccard, Lift).

Think of Jaccard and Lift as ways to normalize the co-occurrences.  This means that the items will only be returned if they indeed where purchased together with the seed item.

In our Lumia 650 phone example, a phone X will be returned if and only if phone X was purchased in the same session as the Lumia 650 phone. Since this may be unlikely, we would expect complementary items to the Lumia 650 to be returned; for instance, a screen protector, or a power adapter for the Lumia 650.

Currently, two items are assumed to be purchased in the same session if they occur in a transaction with the same user id and timestamp.

FBT builds do not support cold items today, as they by definition expect two items to be actually purchased in the same transaction.   While FBT builds can return sets of items (triplets), they do not support personalized recommendations since they accept a single seed item as the input.


#### FBT build parameters 
 
| Name  | 	Description |		Type,  <br> Valid Values <br> (Default Value)
|-------|---------------|-----------------------
| FbtSupportThreshold | How conservative the model is. Number of co-occurrences of items to be considered for modeling. |  Integer, <br> 3-50 <br> Default: 6 
| FbtMaxItemSetSize | Bounds the number of items in a frequent set.| Integer	<br> 2-3 <br> Default: 2
| FbtMinimalScore | Minimal score that a frequent set should have in order to be included in the returned results. The higher the better. | Double <br> 0 and above <br> Default: 0
| FbtSimilarityFunction | Defines the similarity function to be used by the build. Lift favors serendipity, Co-occurrence favors predictability, and Jaccard is a nice compromise between the two. | String,  <br>  <i>cooccurrence, lift, jaccard</i><br> Default: <i>jaccard</i> 

<a name="SelectBuild"></a>
## How do I select the exact build to use? ##

The guidance above may be sufficient to allow you to determine whether you should use a Recommendations build or an FBT build… but it is not a definite answer in cases where you could use either of them. Also, even if you know that you want to use an FBT build type, you may still want to decide whether to use Jaccard or Lift as the similarity function.

The best way to select among two different builds is to actually test them in the real world (online evaluation), and track a conversion rate for the different builds.  The conversion rate could be measured based on recommendation-clicks, on the number actual purchases from recommendations show, or even on the actual amount of money sold when the different recommendations where shown. You may select your conversion rate metric based on your business objective.

In some cases, you may want to evaluate the model offline before you put it in production. While offline evaluation is not a replacement for online evaluation, it can serve us as a metric.

<a name="OfflineEvaluation"></a>
## Offline evaluation  ##

The goal of an offline evaluation is to predict precision (the number of users that will actually purchase one of the recommended items) and the diversity of recommendations (the actual number of items that are recommended).
As part of the precision and diversity metrics evaluation, the system finds a sample of users, and then the transactions for those users are split into two groups: the training dataset and the test dataset.

> Note:
>
> To use offline metrics you are required to have timestamps in your usage data.
> (Since time data is required to split usage correctly between training and test datasets).

> Also, offline evaluation may not yield results for small usage files, simply because for the evaluation to be thorough,
> we expect a minimum of 1000 usage points in the test dataset.

<a name="Precision"></a>
### Precision-at-K ###
The table below represents the output of the precision-at-k offline evaluation.

| K | 1 | 2 | 3 | 	4 | 	5
|---|---|---|---|---|---|
|Percentage |	13.75 |	18.04	| 21 |	24.31 |	26.61
|Users in Test |	10,000 |	10,000 |	10,000 |	10,000 |	10,000
|Users Considered |	10,000 |	10,000 |	10,000 |	10,000 |	10,000
|Users Not Considered |	0 |	0 |	0 |	0 |	0

#### K
In the table above, *K* represents the number of recommendations shown to the customer.  So the table reads as follows: “If during the test period, only one recommendations would have been shown to the customers, only 13.75 of the users would have actually purchased that recommendation”. (Assuming the model was trained with purchase data). Another way to says this is that the “precision at 1” is 13.75.

You will notice that as more items are shown to the customer, the likelihood of the customer purchasing a recommended item goes up. For the experiment above, the probability almost doubles to 26.61 percent when 5 items are recommended.

#### Percentage
The percentage of users that interacted with at least one of the K recommendations shown. The percentage is calculated by dividing the number users that interacted with at least one recommendations over the total number of users considered. (See users considered definition).

#### Users in Test
The total number of users in the test dataset.

#### Users Considered
A user is only considered if the system recommended at least K items based on the model generated using the training dataset.

#### Users Not Considered
Any users not considered; the users that did not receive at least K recommended items.

User Not Considered = User in Test – Users Considered

<a name="Diversity"></a>
### Diversity ###
Diversity metrics measure the type of items recommended. The table below represents the output of the diversity offline evaluation.

|Percentile-bucket |	0-90|  90-99| 99-100
|------------------|--------|-------|---------
|Percentage        | 34.258 | 55.127| 10.615


Total items recommended: 100,000

Unique items recommended: 954

#### Percentile Buckets
Each percentile bucket is represented by a span (min/max values that range between 0 and 100). The items close to 100 are the most popular items, and the items close to 0 are the least popular.  For instance, if the percentage value for the 99-100 percentile bucket is 10.6, it means that 10.6 percent of the recommendations returned only the top 1% most popular items. The percentile bucket min value is inclusive, and the max value is exclusive except for 100.
#### Unique Items Recommended
Number of distinct items that were returned for evaluation.
#### Total items Recommended
The total number of items recommended. (some may be duplicates)


<a name="ImplementingEvaluation"></a>
### How to get offline evaluations? ###
The precision and diversity offline metrics may be useful to you in selecting which build to use.  In order to get offline metrics you need to do the following:

At build time, as part of the respective FBT or Recommendation build parameters:
1.	Set the enableModelingInsights build parameter to true.

2.	Optionally you may select the *splitterStrategy* (Either *RandomSplitter* or *LastEventSplitter*).
*RandomSplitter* splits the usage data in train and test sets based on the given *randomSplitterParameters* test percent and random seed values.
*LastEventSplitter* splits the usage data in train and test sets based on the last transaction for each user.

This will trigger a build that uses only a subset of the data for training, and the rest of the
 data is used to compute evaluation metrics.  After the build is completed, to get the output of the evaluation,
 you just need to call the [Get build metrics API] (https://westus.dev.cognitive.microsoft.com/docs/services/Recommendations.V4.0/operations/577eaa75eda565095421666f),
 passing the respective *modelId* and *buildId*.

 Below is the JSON output for the sample evaluation we performed:


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
