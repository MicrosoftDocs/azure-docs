---
title: "Recipe: Intelligent Art Exploration with the Cognitive Services for Big Data"
titleSuffix: Azure Cognitive Services
description: This recipe shows how to create a searchable art database using Azure Search and MMLSpark.
services: cognitive-services
author: mhamilton723
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: how-to
ms.date: 07/06/2020
ms.author: marhamil
ms.custom: devx-track-python
---

# Recipe: Intelligent Art Exploration with the Cognitive Services for Big Data

In this example, we'll use the Cognitive Services for Big Data to add intelligent annotations to the Open Access collection from the Metropolitan Museum of Art (MET). This will enable us to create an intelligent search engine using Azure Search even without manual annotations. 

## Prerequisites

* You must have a subscription key for Computer Vision and Cognitive Search. Follow the instructions in [Create a Cognitive Services account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) to subscribe to Computer Vision and get your key.
  > [!NOTE]
  > For pricing information, see [Azure Cognitive Search](https://azure.microsoft.com/services/search/#pricing).

## Import Libraries

Run the following command to import libraries for this recipe.

```python
import os, sys, time, json, requests
from pyspark.ml import Transformer, Estimator, Pipeline
from pyspark.ml.feature import SQLTransformer
from pyspark.sql.functions import lit, udf, col, split
```

## Set up Subscription Keys

Run the following command to set up variables for service keys. Insert your subscription keys for Computer Vision and Azure Cognitive Search.

```python
VISION_API_KEY = 'INSERT_COMPUTER_VISION_SUBSCRIPTION_KEY'
AZURE_SEARCH_KEY = 'INSERT_AZURE_COGNITIVE_SEARCH_SUBSCRIPTION_KEY'
search_service = "mmlspark-azure-search"
search_index = "test"
```

## Read the Data

Run the following command to load data from the MET's Open Access collection.

```python
data = spark.read\
  .format("csv")\
  .option("header", True)\
  .load("wasbs://publicwasb@mmlspark.blob.core.windows.net/metartworks_sample.csv")\
  .withColumn("searchAction", lit("upload"))\
  .withColumn("Neighbors", split(col("Neighbors"), ",").cast("array<string>"))\
  .withColumn("Tags", split(col("Tags"), ",").cast("array<string>"))\
  .limit(25)
```

<a name="AnalyzeImages"></a>

## Analyze the Images

Run the following command to use Computer Vision on the MET's Open Access artworks collection. As a result, you'll get visual features from the artworks.

```python
from mmlspark.cognitive import AnalyzeImage
from mmlspark.stages import SelectColumns

#define pipeline
describeImage = (AnalyzeImage()
  .setSubscriptionKey(VISION_API_KEY)
  .setLocation("eastus")
  .setImageUrlCol("PrimaryImageUrl")
  .setOutputCol("RawImageDescription")
  .setErrorCol("Errors")
  .setVisualFeatures(["Categories", "Tags", "Description", "Faces", "ImageType", "Color", "Adult"])
  .setConcurrency(5))

df2 = describeImage.transform(data)\
  .select("*", "RawImageDescription.*").drop("Errors", "RawImageDescription")
```

<a name="CreateSearchIndex"></a>

## Create the Search Index

Run the following command to write the results to Azure Search to create a search engine of the artworks with enriched metadata from Computer Vision.

```python
from mmlspark.cognitive import *
df2.writeToAzureSearch(
  subscriptionKey=AZURE_SEARCH_KEY,
  actionCol="searchAction",
  serviceName=search_service,
  indexName=search_index,
  keyCol="ObjectID"
)
```

## Query the Search Index

Run the following command to query the Azure Search index.

```python
url = 'https://{}.search.windows.net/indexes/{}/docs/search?api-version=2019-05-06'.format(search_service, search_index)
requests.post(url, json={"search": "Glass"}, headers = {"api-key": AZURE_SEARCH_KEY}).json()
```

## Next steps

Learn how to use [Cognitive Services for Big Data for Anomaly Detection](anomaly-detection.md).

