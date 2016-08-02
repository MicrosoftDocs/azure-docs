<properties
	pageTitle="Collecting Data to Train your Model: Machine Learning Recommendations API | Microsoft Azure"
	description="Azure Machine Learning Recommendations - Collecting Data to Train your Model"
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
	ms.date="06/06/2016"
	ms.author="luisca"/>

#  Collecting Data to Train your Model #

The Recommendations API learns from your past transactions to find what items should be recommended to a particular user.

After you have created a model, you will need to provide two piece of information before you can do any training: a catalog file, and usage data.

>   If you have not done so already, we encourage you to complete the [quick start guide](cognitive-services-recommendations-quick-start.md).


## Catalog Data ##

### Catalog file format ###

The catalog file contains information about the items you are offering to your customer.
The catalog data should follow the following format:

- Without features - `<Item Id>,<Item Name>,<Item Category>[,<Description>]`

- With features - `<Item Id>,<Item Name>,<Item Category>,[<Description>],<Features list>`

#### Sample Rows in a Catalog File

Without features:

    AAA04294,Office Language Pack Online DwnLd,Office
    AAA04303,Minecraft Download Game,Games
    C9F00168,Kiruna Flip Cover,Accessories

With features:

    AAA04294,Office Language Pack Online DwnLd,Office, softwaretype=productivity, compatibility=Windows
    BAB04303,Minecraft DwnLd,Games, softwaretype=gaming, compatibility=iOS, agegroup=all
    C9F00168,Kiruna Flip Cover,Accessories, compatibility=lumia, hardwaretype=mobile

#### Format details

| Name | Mandatory | Type |  Description |
|:---|:---|:---|:---|
| Item Id |Yes | [A-z], [a-z], [0-9], [_] &#40;Underscore&#41;, [-] &#40;Dash&#41;<br> Max length: 50 | Unique identifier of an item. |
| Item Name | Yes | Any alphanumeric characters<br> Max length: 255 | Item name. |
| Item Category | Yes | Any alphanumeric characters <br> Max length: 255 | Category to which this item belongs (e.g. Cooking Books, Drama…); can be empty. |
| Description | No, unless features are present (but can be empty) | Any alphanumeric characters <br> Max length: 4000 | Description of this item. |
| Features list | No | Any alphanumeric characters <br> Max length: 4000; Max number of features:20 | Comma-separated list of feature name=feature value that can be used to enhance model recommendation.|

#### Uploading a Catalog file

Look at the [API reference](https://westus.dev.cognitive.microsoft.com/docs/services/Recommendations.V4.0/operations/56f316efeda5650db055a3e1) for uploading a catalog file.  

Note that the content of the catalog file should be passed as the request body.

If you upload several catalog files to the same model with several calls, we will insert only the new catalog items. Existing items will remain with the original values. You cannot update catalog data by using this method.

>   Note: 
>   The maximum file size is 200MB.
>   The maximum number of items in the catalog supported is 100,000 items.


## Why add features to the catalog?

The recommendations engine creates a statistical model that tells you what items are likely to be liked or purchased by a customer. When you have a new product that has never been interacted with it is not possible to create a model on co-occurrences alone. Let's say you start offering a new "children's violin" in your store, since you have never sold that violin before you cannot tell what other items to recommend with that violin.

That said, if the engine knows information about that violin (i.e. It's a musical instrument, it is for children ages 7-10, it is not an expensive violin, etc.), then the engine can learn from other products with similar features. For instance, you have sold violin's in the past and usually people that buy violins tend to buy classical music CDs and sheet music stands.  The system can find these connections between the features and provide recommendations based on the features while your new violin has little usage.

Features are imported as part of the catalog data, and then their rank (or the importance of the feature in the model) is associated when a rank build is done. Feature rank can change according to the pattern of usage data and type of items. But for consistent usage/items, the rank should have only small fluctuations. The rank of features is a non-negative number. The number 0 means that the feature was not ranked (happens if you invoke this API prior to the completion of the first rank build). The date at which the rank was attributed is called the score freshness.

To use features as part of your build you need to:

1. Make sure your catalog has features when you upload it.

2. Trigger a ranking build. This will do the analysis on the importance/rank of the features.

3. Trigger a recommendations build, setting the following build parameters: Set useFeaturesInModel to true, allowColdItemPlacement to true, and modelingFeatureList should be set to the comma separated list of features that you want to use to enhance your model. See [Recommendations build type parameters](https://westus.dev.cognitive.microsoft.com/docs/services/Recommendations.V4.0/operations/56f30d77eda5650db055a3d0) for more information.


## Usage Data ##
A usage file contains information about how those items are used, or the transactions from your business.

#### Usage Format details
A usage file is a CSV (comma separated value) file where each row in a usage file represents an interaction between a user and an item. Each row is formatted as follows:<br>
`<User Id>,<Item Id>,<Time>,[<Event>]`



| Name  | Mandatory | Type | Description
|-------|------------|------|---------------
|User Id|         Yes|[A-z], [a-z], [0-9], [_] &#40;Underscore&#41;, [-] &#40;Dash&#41;<br> Max length: 255 |Unique identifier of a user.
|Item Id|Yes|[A-z], [a-z], [0-9], [&#95;] &#40;Underscore&#41;, [-] &#40;Dash&#41;<br> Max length: 50|Unique identifier of an item.
|Time|Yes|Date in format: YYYY/MM/DDTHH:MM:SS (e.g. 2013/06/20T10:00:00)|Time of data.
|Event|No | One of the following:<br>• Click<br>• RecommendationClick<br>•	AddShopCart<br>• RemoveShopCart<br>• Purchase| The type of transaction. |

#### Sample Rows in a Usage File

    00037FFEA61FCA16,288186200,2015/08/04T11:02:52,Purchase
    0003BFFDD4C2148C,297833400,2015/08/04T11:02:50,Purchase
    0003BFFDD4C2118D,297833300,2015/08/04T11:02:40,Purchase
    00030000D16C4237,297833300,2015/08/04T11:02:37,Purchase
    0003BFFDD4C20B63,297833400,2015/08/04T11:02:12,Purchase
    00037FFEC8567FB8,297833400,2015/08/04T11:02:04,Purchase

#### Uploading a usage file

Look at the [API reference](https://westus.dev.cognitive.microsoft.com/docs/services/Recommendations.V4.0/operations/56f316efeda5650db055a3e2) for uploading usage files.
Note that you need to pass the content of the usage file as the body of the HTTP call.

>  Note:

>  Maximum file size: 200MB. You may upload several usage files.

>  You need to upload a catalog file before you start adding usage data to your model. Only items in the catalog file will be used during the training phase. All other items will be ignored.

## How much data do you need?

The quality of your model is heavily dependent on the quality and quantity of your data.
The system learns when users buy different items (We call this co-occurrences). For FBT builds, it is also important to know which items are purchased in the same transactions. 

A good rule of thumb is to have most items be in 20 transactions or more, so if you had 10,000 items in your catalog, we would recommend that you have at least 20 times that number of transactions or about 200,000 transactions. Once again, this is a rule of thumb. You will need to experiment with your data.

Once you have created a model, you can perform an [offline evaluation](cognitive-services-recommendations-buildtypes.md) to check how well your model is likely to perform.
