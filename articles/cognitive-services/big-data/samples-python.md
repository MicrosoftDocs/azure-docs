---
title: "Cognitive Services for big data - Python Samples"
description: Try Cognitive Services samples in Python for Azure Databricks to run your MMLSpark pipeline for big data.
services: cognitive-services
author: mhamilton723
manager: nitinme
ms.service: cognitive-services
ms.topic: sample
ms.date: 11/01/2022
ms.author: marhamil
ms.devlang: python
---

# Python Samples for Cognitive Services for big data

The following snippets are ready to run and will help get you started with using Cognitive Services on Spark with Python.

The samples in this article use these Cognitive Services:

- Language service - get the sentiment (or mood) of a set of sentences.
- Computer Vision - get the tags (one-word descriptions) associated with a set of images.
- Speech-to-text - transcribe audio files to extract text-based transcripts.
- Anomaly Detector - detect anomalies within a time series data.

## Prerequisites

1. Follow the steps in [Getting started](getting-started.md) to set up your Azure Databricks and Cognitive Services environment. This tutorial shows you how to install MMLSpark and how to create your Spark cluster in Databricks.
1. After you create a new notebook in Azure Databricks, copy the **Shared code** below and paste into a new cell in your notebook.
1. Choose a service sample, below, and copy paste it into a second new cell in your notebook.
1. Replace any of the service subscription key placeholders with your own key.
1. Choose the run button (triangle icon) in the upper right corner of the cell, then select **Run Cell**.
1. View results in a table below the cell.

## Shared code

To get started, we'll need to add this code to the project:

```python
from mmlspark.cognitive import *

# A general Cognitive Services key for the Language service and Computer Vision (or use separate keys that belong to each service)
service_key = "ADD_YOUR_SUBSCRIPION_KEY"
# An Anomaly Dectector subscription key
anomaly_key = "ADD_YOUR_SUBSCRIPION_KEY"

# Validate the key
assert service_key != "ADD_YOUR_SUBSCRIPION_KEY"
```    

## Language service sample

The [Language service](../language-service/index.yml) provides several algorithms for extracting intelligent insights from text. For example, we can find the sentiment of given input text. The service will return a score between 0.0 and 1.0 where low scores indicate negative sentiment and high score indicates positive sentiment.  This sample uses three simple sentences and returns the sentiment for each.

```python
from pyspark.sql.functions import col

# Create a dataframe that's tied to it's column names
df = spark.createDataFrame([
  ("I am so happy today, its sunny!", "en-US"),
  ("I am frustrated by this rush hour traffic", "en-US"),
  ("The cognitive services on spark aint bad", "en-US"),
], ["text", "language"])

# Run the Language service with options
sentiment = (TextSentiment()
    .setTextCol("text")
    .setLocation("eastus")
    .setSubscriptionKey(service_key)
    .setOutputCol("sentiment")
    .setErrorCol("error")
    .setLanguageCol("language"))

# Show the results of your text query in a table format
display(sentiment.transform(df).select("text", col("sentiment")[0].getItem("sentiment").alias("sentiment")))
```

### Expected result

| text                                      | sentiment                                             |
|:------------------------------------------|:------------------------------------------------------|
| I am so happy today, its sunny!           | positive                                              |
| I am frustrated by this rush hour traffic | negative                                              |
| The cognitive services on spark aint bad  | positive                                              |

## Computer Vision sample

[Computer Vision](../computer-vision/index.yml) analyzes images to identify structure such as faces, objects, and natural-language descriptions. In this sample, we tag a list of images. Tags are one-word descriptions of things in the image like recognizable objects, people, scenery, and actions.

```python

# Create a dataframe with the image URLs
df = spark.createDataFrame([
        ("https://raw.githubusercontent.com/Azure-Samples/cognitive-services-sample-data-files/master/ComputerVision/Images/objects.jpg", ),
        ("https://raw.githubusercontent.com/Azure-Samples/cognitive-services-sample-data-files/master/ComputerVision/Images/dog.jpg", ),
        ("https://raw.githubusercontent.com/Azure-Samples/cognitive-services-sample-data-files/master/ComputerVision/Images/house.jpg", )
    ], ["image", ])

# Run the Computer Vision service. Analyze Image extracts infortmation from/about the images.
analysis = (AnalyzeImage()
    .setLocation("eastus")
    .setSubscriptionKey(service_key)
    .setVisualFeatures(["Categories","Color","Description","Faces","Objects","Tags"])
    .setOutputCol("analysis_results")
    .setImageUrlCol("image")
    .setErrorCol("error"))

# Show the results of what you wanted to pull out of the images.
display(analysis.transform(df).select("image", "analysis_results.description.tags"))
```

### Expected result

| image | tags |
|:------------------------------------------------------------------------------------------------------------------------------|:--------------------------------------------------------------------------|
| https://raw.githubusercontent.com/Azure-Samples/cognitive-services-sample-data-files/master/ComputerVision/Images/objects.jpg | ['skating' 'person' 'man' 'outdoor' 'riding' 'sport' 'skateboard' 'young' 'board' 'shirt' 'air' 'black' 'park' 'boy' 'side' 'jumping' 'trick' 'ramp' 'doing' 'flying']
| https://raw.githubusercontent.com/Azure-Samples/cognitive-services-sample-data-files/master/ComputerVision/Images/dog.jpg | ['dog' 'outdoor' 'fence' 'wooden' 'small' 'brown' 'building' 'sitting' 'front' 'bench' 'standing' 'table' 'walking' 'board' 'beach' 'white' 'holding' 'bridge' 'track']                
| https://raw.githubusercontent.com/Azure-Samples/cognitive-services-sample-data-files/master/ComputerVision/Images/house.jpg | ['outdoor' 'grass' 'house' 'building' 'old' 'home' 'front' 'small' 'church' 'stone' 'large' 'grazing' 'yard' 'green' 'sitting' 'leading' 'sheep' 'brick' 'bench' 'street' 'white' 'country' 'clock' 'sign' 'parked' 'field' 'standing' 'garden' 'water' 'red' 'horse' 'man' 'tall' 'fire' 'group']


## Speech-to-Text sample
The [Speech-to-text](../speech-service/index-speech-to-text.yml) service converts streams or files of spoken audio to text. In this sample, we transcribe two audio files. The first file is easy to understand, and the second is more challenging.

```python

# Create a dataframe with our audio URLs, tied to the column called "url"
df = spark.createDataFrame([("https://mmlspark.blob.core.windows.net/datasets/Speech/audio2.wav",),
                           ("https://mmlspark.blob.core.windows.net/datasets/Speech/audio3.mp3",)
                           ], ["url"])

# Run the Speech-to-text service to translate the audio into text
speech_to_text = (SpeechToTextSDK()
    .setSubscriptionKey(service_key)
    .setLocation("eastus")
    .setOutputCol("text")
    .setAudioDataCol("url")
    .setLanguage("en-US")
    .setProfanity("Masked"))

# Show the results of the translation
display(speech_to_text.transform(df).select("url", "text.DisplayText"))
```

### Expected result

| url | DisplayText |
|:------------------------------------------------------------------|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| https://mmlspark.blob.core.windows.net/datasets/Speech/audio2.wav | Custom speech provides tools that allow you to visually inspect the recognition quality of a model by comparing audio data with the corresponding recognition result from the custom speech portal. You can playback uploaded audio and determine if the provided recognition result is correct. This tool allows you to quickly inspect quality of Microsoft's baseline speech to text model or a trained custom model without having to transcribe any audio data. |
| https://mmlspark.blob.core.windows.net/datasets/Speech/audio3.mp3 | Add a gentleman Sir thinking visual check.    |
| https://mmlspark.blob.core.windows.net/datasets/Speech/audio3.mp3 | I hear me. |
| https://mmlspark.blob.core.windows.net/datasets/Speech/audio3.mp3 | I like the reassurance for radio that I can hear it as well. |


## Anomaly Detector sample

[Anomaly Detector](../anomaly-detector/index.yml) is great for detecting irregularities in your time series data. In this sample, we use the service to find anomalies in the entire time series.

```python
from pyspark.sql.functions import lit

# Create a dataframe with the point data that Anomaly Detector requires
df = spark.createDataFrame([
    ("1972-01-01T00:00:00Z", 826.0),
    ("1972-02-01T00:00:00Z", 799.0),
    ("1972-03-01T00:00:00Z", 890.0),
    ("1972-04-01T00:00:00Z", 900.0),
    ("1972-05-01T00:00:00Z", 766.0),
    ("1972-06-01T00:00:00Z", 805.0),
    ("1972-07-01T00:00:00Z", 821.0),
    ("1972-08-01T00:00:00Z", 20000.0),
    ("1972-09-01T00:00:00Z", 883.0),
    ("1972-10-01T00:00:00Z", 898.0),
    ("1972-11-01T00:00:00Z", 957.0),
    ("1972-12-01T00:00:00Z", 924.0),
    ("1973-01-01T00:00:00Z", 881.0),
    ("1973-02-01T00:00:00Z", 837.0),
    ("1973-03-01T00:00:00Z", 9000.0)
], ["timestamp", "value"]).withColumn("group", lit("series1"))

# Run the Anomaly Detector service to look for irregular data
anamoly_detector = (SimpleDetectAnomalies()
  .setSubscriptionKey(anomaly_key)
  .setLocation("eastus")
  .setTimestampCol("timestamp")
  .setValueCol("value")
  .setOutputCol("anomalies")
  .setGroupbyCol("group")
  .setGranularity("monthly"))

# Show the full results of the analysis with the anomalies marked as "True"
display(anamoly_detector.transform(df).select("timestamp", "value", "anomalies.isAnomaly"))
```

### Expected result

| timestamp            |   value | isAnomaly   |
|:---------------------|--------:|:------------|
| 1972-01-01T00:00:00Z |     826 | False       |
| 1972-02-01T00:00:00Z |     799 | False       |
| 1972-03-01T00:00:00Z |     890 | False       |
| 1972-04-01T00:00:00Z |     900 | False       |
| 1972-05-01T00:00:00Z |     766 | False       |
| 1972-06-01T00:00:00Z |     805 | False       |
| 1972-07-01T00:00:00Z |     821 | False       |
| 1972-08-01T00:00:00Z |   20000 | True        |
| 1972-09-01T00:00:00Z |     883 | False       |
| 1972-10-01T00:00:00Z |     898 | False       |
| 1972-11-01T00:00:00Z |     957 | False       |
| 1972-12-01T00:00:00Z |     924 | False       |
| 1973-01-01T00:00:00Z |     881 | False       |
| 1973-02-01T00:00:00Z |     837 | False       |
| 1973-03-01T00:00:00Z |    9000 | True        |

## Arbitrary web APIs

With HTTP on Spark, any web service can be used in your big data pipeline. In this example, we use the [World Bank API](http://api.worldbank.org/v2/country/) to get information about various countries around the world.

```python
from requests import Request
from mmlspark.io.http import HTTPTransformer, http_udf
from pyspark.sql.functions import udf, col

# Use any requests from the Python requests library
def world_bank_request(country):
  return Request("GET", "http://api.worldbank.org/v2/country/{}?format=json".format(country))

# Create a dataframe with spcificies which countries we want data on
df = (spark.createDataFrame([("br",),("usa",)], ["country"])
  .withColumn("request", http_udf(world_bank_request)(col("country"))))

# Much faster for big data because of the concurrency :)
client = (HTTPTransformer()
      .setConcurrency(3)
      .setInputCol("request")
      .setOutputCol("response"))

# Get the body of the response
def get_response_body(resp):
  return resp.entity.content.decode()

# Show the details of the country data returned
display(client.transform(df).select("country", udf(get_response_body)(col("response")).alias("response")))
```

### Expected result

| country   | response |
|:----------|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| br | `[{"page":1,"pages":1,"per_page":"50","total":1},[{"id":"BRA","iso2Code":"BR","name":"Brazil","region":{"id":"LCN","iso2code":"ZJ","value":"Latin America & Caribbean "},"adminregion":{"id":"LAC","iso2code":"XJ","value":"Latin America & Caribbean (excluding high income)"},"incomeLevel":{"id":"UMC","iso2code":"XT","value":"Upper middle income"},"lendingType":{"id":"IBD","iso2code":"XF","value":"IBRD"},"capitalCity":"Brasilia","longitude":"-47.9292","latitude":"-15.7801"}]]` |
| usa  | `[{"page":1,"pages":1,"per_page":"50","total":1},[{"id":"USA","iso2Code":"US","name":"United States","region":{"id":"NAC","iso2code":"XU","value":"North America"},"adminregion":{"id":"","iso2code":"","value":""},"incomeLevel":{"id":"HIC","iso2code":"XD","value":"High income"},"lendingType":{"id":"LNX","iso2code":"XX","value":"Not classified"},"capitalCity":"Washington D.C.","longitude":"-77.032","latitude":"38.8895"}]]` |

## See also

* [Recipe: Anomaly Detection](./recipes/anomaly-detection.md)
* [Recipe: Art Explorer](./recipes/art-explorer.md)