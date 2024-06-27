---
title: Azure AI services in Azure Synapse Analytics
description: Enrich your data with artificial intelligence (AI) in Azure Synapse Analytics using pretrained models from Azure AI services.
ms.service: synapse-analytics
ms.subservice: machine-learning
ms.topic: overview
ms.reviewer: sngun, garye, negust, ruxu, jessiwang
author: WilliamDAssafMSFT
ms.author: wiassaf
ms.date: 05/13/2024
---

# Azure AI services

Azure AI services help developers and organizations rapidly create intelligent, cutting-edge, market-ready, and responsible applications with out-of-the-box and pre-built and customizable APIs and models.

SynapseML allows you to build powerful and highly scalable predictive and analytical models from various Spark data sources. Synapse Spark provide built-in SynapseML libraries including synapse.ml.services.

> [!IMPORTANT]
> Starting on September 20th, 2023 you won’t be able to create new Anomaly Detector resources. The Anomaly Detector service is being retired on October 1st, 2026.

## Prerequisites on Azure Synapse Analytics

The tutorial, [Pre-requisites for using Azure AI services in Azure Synapse](/azure/synapse-analytics/machine-learning/tutorial-configure-cognitive-services-synapse), walks you through a couple steps you need to perform before using Azure AI services in Synapse Analytics.

[Azure AI services](https://azure.microsoft.com/products/ai-services/) is a suite of APIs, SDKs, and services that developers can use to add intelligent features to their applications. AI services empower developers even when they don't have direct AI or data science skills or knowledge. Azure AI services help developers create applications that can see, hear, speak, understand, and even begin to reason. The catalog of services within Azure AI services can be categorized into five main pillars: Vision, Speech, Language, Web search, and Decision.

## Usage

### Vision

[**Computer Vision**](https://azure.microsoft.com/services/cognitive-services/computer-vision/)
- Describe: provides description of an image in human readable language ([Scala](https://mmlspark.blob.core.windows.net/docs/1.0.4/scala/com/microsoft/azure/synapse/ml/services/vision/DescribeImage.html), [Python](https://mmlspark.blob.core.windows.net/docs/1.0.4/pyspark/synapse.ml.services.vision.html#module-synapse.ml.services.vision.DescribeImage))
- Analyze (color, image type, face, adult/racy content): analyzes visual features of an image ([Scala](https://mmlspark.blob.core.windows.net/docs/1.0.4/scala/com/microsoft/azure/synapse/ml/services/vision/AnalyzeImage.html), [Python](https://mmlspark.blob.core.windows.net/docs/1.0.4/pyspark/synapse.ml.services.vision.html#module-synapse.ml.services.vision.AnalyzeImage))
- OCR: reads text from an image ([Scala](https://mmlspark.blob.core.windows.net/docs/1.0.4/scala/com/microsoft/azure/synapse/ml/services/vision/OCR.html), [Python](https://mmlspark.blob.core.windows.net/docs/1.0.4/pyspark/synapse.ml.services.vision.html#module-synapse.ml.services.vision.OCR))
- Recognize Text: reads text from an image ([Scala](https://mmlspark.blob.core.windows.net/docs/1.0.4/scala/com/microsoft/azure/synapse/ml/services/vision/RecognizeText.html), [Python](https://mmlspark.blob.core.windows.net/docs/1.0.4/pyspark/synapse.ml.services.vision.html#module-synapse.ml.services.vision.RecognizeText))
- Thumbnail: generates a thumbnail of user-specified size from the image ([Scala](https://mmlspark.blob.core.windows.net/docs/1.0.4/scala/com/microsoft/azure/synapse/ml/services/vision/GenerateThumbnails.html), [Python](https://mmlspark.blob.core.windows.net/docs/1.0.4/pyspark/synapse.ml.services.vision.html#module-synapse.ml.services.vision.GenerateThumbnails))
- Recognize domain-specific content: recognizes domain-specific content (celebrity, landmark) ([Scala](https://mmlspark.blob.core.windows.net/docs/1.0.4/scala/com/microsoft/azure/synapse/ml/services/vision/RecognizeDomainSpecificContent.html), [Python](https://mmlspark.blob.core.windows.net/docs/1.0.4/pyspark/synapse.ml.services.vision.html#module-synapse.ml.services.vision.RecognizeDomainSpecificContent))
- Tag: identifies list of words that are relevant to the input image ([Scala](https://mmlspark.blob.core.windows.net/docs/1.0.4/scala/com/microsoft/azure/synapse/ml/services/vision/TagImage.html), [Python](https://mmlspark.blob.core.windows.net/docs/1.0.4/pyspark/synapse.ml.services.vision.html#module-synapse.ml.services.vision.TagImage))

[**Face**](https://azure.microsoft.com/services/cognitive-services/face/)
- Detect: detects human faces in an image ([Scala](https://mmlspark.blob.core.windows.net/docs/1.0.4/scala/com/microsoft/azure/synapse/ml/services/face/DetectFace.html), [Python](https://mmlspark.blob.core.windows.net/docs/1.0.4/pyspark/synapse.ml.services.face.html#module-synapse.ml.services.face.DetectFace))
- Verify: verifies whether two faces belong to a same person, or a face belongs to a person ([Scala](https://mmlspark.blob.core.windows.net/docs/1.0.4/scala/com/microsoft/azure/synapse/ml/services/face/VerifyFaces.html), [Python](https://mmlspark.blob.core.windows.net/docs/1.0.4/pyspark/synapse.ml.services.face.html#module-synapse.ml.services.face.VerifyFaces))
- Identify: finds the closest matches of the specific query person face from a person group ([Scala](https://mmlspark.blob.core.windows.net/docs/1.0.4/scala/com/microsoft/azure/synapse/ml/services/face/IdentifyFaces.html), [Python](https://mmlspark.blob.core.windows.net/docs/1.0.4/pyspark/synapse.ml.services.face.html#module-synapse.ml.services.face.IdentifyFaces))
- Find similar: finds similar faces to the query face in a face list ([Scala](https://mmlspark.blob.core.windows.net/docs/1.0.4/scala/com/microsoft/azure/synapse/ml/services/face/FindSimilarFace.html), [Python](https://mmlspark.blob.core.windows.net/docs/1.0.4/pyspark/synapse.ml.services.face.html#module-synapse.ml.services.face.FindSimilarFace))
- Group: divides a group of faces into disjoint groups based on similarity ([Scala](https://mmlspark.blob.core.windows.net/docs/1.0.4/scala/com/microsoft/azure/synapse/ml/services/face/GroupFaces.html), [Python](https://mmlspark.blob.core.windows.net/docs/1.0.4/pyspark/synapse.ml.services.face.html#module-synapse.ml.services.face.GroupFaces))

### Speech

[**Speech Services**](https://azure.microsoft.com/products/ai-services/ai-speech)
- Speech-to-text: transcribes audio streams ([Scala](https://mmlspark.blob.core.windows.net/docs/1.0.4/scala/com/microsoft/azure/synapse/ml/services/speech/SpeechToText.html), [Python](https://mmlspark.blob.core.windows.net/docs/1.0.4/pyspark/synapse.ml.services.speech.html#module-synapse.ml.services.speech.SpeechToText))
- Conversation Transcription: transcribes audio streams into live transcripts with identified speakers. ([Scala](https://mmlspark.blob.core.windows.net/docs/1.0.4/scala/com/microsoft/azure/synapse/ml/services/speech/ConversationTranscription.html), [Python](https://mmlspark.blob.core.windows.net/docs/1.0.4/pyspark/synapse.ml.services.speech.html#module-synapse.ml.services.speech.ConversationTranscription))
- Text to Speech: Converts text to realistic audio ([Scala](https://mmlspark.blob.core.windows.net/docs/1.0.4/scala/com/microsoft/azure/synapse/ml/services/speech/TextToSpeech.html), [Python](https://mmlspark.blob.core.windows.net/docs/1.0.4/pyspark/synapse.ml.services.speech.html#module-synapse.ml.services.speech.TextToSpeech))

### Language

[**AI Language**](https://azure.microsoft.com/products/ai-services/ai-language)
- Language detection: detects language of the input text ([Scala](https://mmlspark.blob.core.windows.net/docs/1.0.4/scala/com/microsoft/azure/synapse/ml/services/text/LanguageDetector.html), [Python](https://mmlspark.blob.core.windows.net/docs/1.0.4/pyspark/synapse.ml.services.text.html#module-synapse.ml.services.text.LanguageDetector))
- Key phrase extraction: identifies the key talking points in the input text ([Scala](https://mmlspark.blob.core.windows.net/docs/1.0.4/scala/com/microsoft/azure/synapse/ml/services/text/KeyPhraseExtractor.html), [Python](https://mmlspark.blob.core.windows.net/docs/1.0.4/pyspark/synapse.ml.services.text.html#module-synapse.ml.services.text.KeyPhraseExtractor))
- Named entity recognition: identifies known entities and general named entities in the input text ([Scala](https://mmlspark.blob.core.windows.net/docs/1.0.4/scala/com/microsoft/azure/synapse/ml/services/text/NER.html), [Python](https://mmlspark.blob.core.windows.net/docs/1.0.4/pyspark/synapse.ml.services.text.html#module-synapse.ml.services.text.NER))
- Sentiment analysis: returns a score between 0 and 1 indicating the sentiment in the input text ([Scala](https://mmlspark.blob.core.windows.net/docs/1.0.4/scala/com/microsoft/azure/synapse/ml/services/text/TextSentiment.html), [Python](https://mmlspark.blob.core.windows.net/docs/1.0.4/pyspark/synapse.ml.services.text.html#module-synapse.ml.services.text.TextSentiment))
- Healthcare Entity Extraction: Extracts medical entities and relationships from text. ([Scala](https://mmlspark.blob.core.windows.net/docs/1.0.4/scala/com/microsoft/azure/synapse/ml/services/text/AnalyzeHealthText.html), [Python](https://mmlspark.blob.core.windows.net/docs/1.0.4/pyspark/synapse.ml.services.text.html#module-synapse.ml.services.text.AnalyzeHealthText))

### Translation

[**Translator**](https://azure.microsoft.com/products/ai-services/translator)
- Translate: Translates text. ([Scala](https://mmlspark.blob.core.windows.net/docs/1.0.4/scala/com/microsoft/azure/synapse/ml/services/translate/Translate.html), [Python](https://mmlspark.blob.core.windows.net/docs/1.0.4/pyspark/synapse.ml.services.translate.html#module-synapse.ml.services.translate.Translate))
- Transliterate: Converts text in one language from one script to another script. ([Scala](https://mmlspark.blob.core.windows.net/docs/1.0.4/scala/com/microsoft/azure/synapse/ml/services/translate/Transliterate.html), [Python](https://mmlspark.blob.core.windows.net/docs/1.0.4/pyspark/synapse.ml.services.translate.html#module-synapse.ml.services.translate.Transliterate))
- Detect: Identifies the language of a piece of text. ([Scala](https://mmlspark.blob.core.windows.net/docs/1.0.4/scala/com/microsoft/azure/synapse/ml/services/translate/Detect.html), [Python](https://mmlspark.blob.core.windows.net/docs/1.0.4/pyspark/synapse.ml.services.translate.html#module-synapse.ml.services.translate.Detect))
- BreakSentence: Identifies the positioning of sentence boundaries in a piece of text. ([Scala](https://mmlspark.blob.core.windows.net/docs/1.0.4/scala/com/microsoft/azure/synapse/ml/services/translate/BreakSentence.html), [Python](https://mmlspark.blob.core.windows.net/docs/1.0.4/pyspark/synapse.ml.services.translate.html#module-synapse.ml.services.translate.BreakSentence))
- Dictionary Lookup: Provides alternative translations for a word and a small number of idiomatic phrases. ([Scala](https://mmlspark.blob.core.windows.net/docs/1.0.4/scala/com/microsoft/azure/synapse/ml/services/translate/DictionaryLookup.html), [Python](https://mmlspark.blob.core.windows.net/docs/1.0.4/pyspark/synapse.ml.services.translate.html#module-synapse.ml.services.translate.DictionaryLookup))
- Dictionary Examples: Provides examples that show how terms in the dictionary are used in context. ([Scala](https://mmlspark.blob.core.windows.net/docs/1.0.4/scala/com/microsoft/azure/synapse/ml/services/translate/DictionaryExamples.html), [Python](https://mmlspark.blob.core.windows.net/docs/1.0.4/pyspark/synapse.ml.services.translate.html#module-synapse.ml.services.translate.DictionaryExamples))
- Document Translation: Translates documents across all supported languages and dialects while preserving document structure and data format. ([Scala](https://mmlspark.blob.core.windows.net/docs/1.0.4/scala/com/microsoft/azure/synapse/ml/services/translate/DocumentTranslator.html), [Python](https://mmlspark.blob.core.windows.net/docs/1.0.4/pyspark/synapse.ml.services.translate.html#module-synapse.ml.services.translate.DocumentTranslator))

### Document Intelligence

[**Document Intelligence**](https://azure.microsoft.com/products/ai-services/ai-document-intelligence/)
- Analyze Layout: Extract text and layout information from a given document. ([Scala](https://mmlspark.blob.core.windows.net/docs/1.0.4/scala/com/microsoft/azure/synapse/ml/services/form/AnalyzeLayout.html), [Python](https://mmlspark.blob.core.windows.net/docs/1.0.4/pyspark/synapse.ml.services.form.html#module-synapse.ml.services.form.AnalyzeLayout))
- Analyze Receipts: Detects and extracts data from receipts using optical character recognition (OCR) and our receipt model, enabling you to easily extract structured data from receipts such as merchant name, merchant phone number, transaction date, transaction total, and more. ([Scala](https://mmlspark.blob.core.windows.net/docs/1.0.4/scala/com/microsoft/azure/synapse/ml/services/form/AnalyzeReceipts.html), [Python](https://mmlspark.blob.core.windows.net/docs/1.0.4/pyspark/synapse.ml.services.form.html#module-synapse.ml.services.form.AnalyzeReceipts))
- Analyze Business Cards: Detects and extracts data from business cards using optical character recognition (OCR) and our business card model, enabling you to easily extract structured data from business cards such as contact names, company names, phone numbers, emails, and more. ([Scala](https://mmlspark.blob.core.windows.net/docs/1.0.4/scala/com/microsoft/azure/synapse/ml/services/form/AnalyzeBusinessCards.html), [Python](https://mmlspark.blob.core.windows.net/docs/1.0.4/pyspark/synapse.ml.services.form.html#module-synapse.ml.services.form.AnalyzeBusinessCards))
- Analyze Invoices: Detects and extracts data from invoices using optical character recognition (OCR) and our invoice understanding deep learning models, enabling you to easily extract structured data from invoices such as customer, vendor, invoice ID, invoice due date, total, invoice amount due, tax amount, ship to, bill to, line items and more. ([Scala](https://mmlspark.blob.core.windows.net/docs/1.0.4/scala/com/microsoft/azure/synapse/ml/services/form/AnalyzeInvoices.html), [Python](https://mmlspark.blob.core.windows.net/docs/1.0.4/pyspark/synapse.ml.services.form.html#module-synapse.ml.services.form.AnalyzeInvoices))
- Analyze ID Documents: Detects and extracts data from identification documents using optical character recognition (OCR) and our ID document model, enabling you to easily extract structured data from ID documents such as first name, last name, date of birth, document number, and more. ([Scala](https://mmlspark.blob.core.windows.net/docs/1.0.4/scala/com/microsoft/azure/synapse/ml/services/form/AnalyzeIDDocuments.html), [Python](https://mmlspark.blob.core.windows.net/docs/1.0.4/pyspark/synapse.ml.services.form.html#module-synapse.ml.services.form.AnalyzeIDDocuments))
- Analyze Custom Form: Extracts information from forms (PDFs and images) into structured data based on a model created from a set of representative training forms. ([Scala](https://mmlspark.blob.core.windows.net/docs/1.0.4/scala/com/microsoft/azure/synapse/ml/services/form/AnalyzeCustomModel.html), [Python](https://mmlspark.blob.core.windows.net/docs/1.0.4/pyspark/synapse.ml.services.form.html#module-synapse.ml.services.form.AnalyzeCustomModel))
- Get Custom Model: Get detailed information about a custom model. ([Scala](https://mmlspark.blob.core.windows.net/docs/1.0.4/scala/com/microsoft/azure/synapse/ml/services/form/GetCustomModel.html), [Python](https://mmlspark.blob.core.windows.net/docs/1.0.4/scala/com/microsoft/azure/synapse/ml/services/form/ListCustomModels.html))
- List Custom Models: Get information about all custom models. ([Scala](https://mmlspark.blob.core.windows.net/docs/1.0.4/scala/com/microsoft/azure/synapse/ml/services/form/ListCustomModels.html), [Python](https://mmlspark.blob.core.windows.net/docs/1.0.4/pyspark/synapse.ml.services.form.html#module-synapse.ml.services.form.ListCustomModels))

### Decision

[**Anomaly Detector**](https://azure.microsoft.com/products/ai-services/ai-anomaly-detector)
- Anomaly status of latest point: generates a model using preceding points and determines whether the latest point is anomalous ([Scala](https://mmlspark.blob.core.windows.net/docs/1.0.4/scala/com/microsoft/azure/synapse/ml/services/anomaly/DetectLastAnomaly.html), [Python](https://mmlspark.blob.core.windows.net/docs/1.0.4/pyspark/synapse.ml.services.anomaly.html#module-synapse.ml.services.anomaly.DetectLastAnomaly))
- Find anomalies: generates a model using an entire series and finds anomalies in the series ([Scala](https://mmlspark.blob.core.windows.net/docs/1.0.4/scala/com/microsoft/azure/synapse/ml/services/anomaly/DetectAnomalies.html), [Python](https://mmlspark.blob.core.windows.net/docs/1.0.4/pyspark/synapse.ml.services.anomaly.html#module-synapse.ml.services.anomaly.DetectAnomalies))

### Search

* [**Bing Image search**](https://azure.microsoft.com/services/services-services/bing-image-search-api/) ([Scala](https://mmlspark.blob.core.windows.net/docs/1.0.4/scala/com/microsoft/azure/synapse/ml/services/bing/BingImageSearch.html), [Python](https://mmlspark.blob.core.windows.net/docs/1.0.4/pyspark/synapse.ml.services.bing.html#module-synapse.ml.services.bing.BingImageSearch))
* [**Azure Cognitive search**](/azure/search/search-what-is-azure-search) ([Scala](https://mmlspark.blob.core.windows.net/docs/1.0.4/scala/com/microsoft/azure/synapse/ml/services/search/AzureSearchWriter$.html), [Python](https://mmlspark.blob.core.windows.net/docs/1.0.4/pyspark/synapse.ml.services.search.html#module-synapse.ml.services.search.AzureSearchWriter))

## Prepare your system

To begin, import required libraries and initialize your Spark session.

```python
from pyspark.sql.functions import udf, col
from synapse.ml.io.http import HTTPTransformer, http_udf
from requests import Request
from pyspark.sql.functions import lit
from pyspark.ml import PipelineModel
from pyspark.sql.functions import col

```

Import Azure AI services libraries and replace the keys and locations in the following code snippet with your Azure AI services key and location.

```python
from synapse.ml.services import *
from synapse.ml.core.platform import *

# A general AI services key for AI Language, Computer Vision and Document Intelligence (or use separate keys that belong to each service)
service_key = find_secret(
    secret_name="ai-services-api-key", keyvault="mmlspark-build-keys"
)  # Replace the call to find_secret with your key as a python string. e.g. service_key="27snaiw..."
service_loc = "eastus"

# A Bing Search v7 subscription key
bing_search_key = find_secret(
    secret_name="bing-search-key", keyvault="mmlspark-build-keys"
)  # Replace the call to find_secret with your key as a python string.

# An Anomaly Detector subscription key
anomaly_key = find_secret(
    secret_name="anomaly-api-key", keyvault="mmlspark-build-keys"
)  # Replace the call to find_secret with your key as a python string. If you don't have an anomaly detection resource created before Sep 20th 2023, you won't be able to create one.
anomaly_loc = "westus2"

# A Translator subscription key
translator_key = find_secret(
    secret_name="translator-key", keyvault="mmlspark-build-keys"
)  # Replace the call to find_secret with your key as a python string.
translator_loc = "eastus"

# An Azure search key
search_key = find_secret(
    secret_name="azure-search-key", keyvault="mmlspark-build-keys"
)  # Replace the call to find_secret with your key as a python string.

```

## Perform sentiment analysis on text

The [AI Language](https://azure.microsoft.com/products/ai-services/ai-language/) service provides several algorithms for extracting intelligent insights from text. For example, we can find the sentiment of given input text. The service will return a score between 0.0 and 1.0 where low scores indicate negative sentiment and high score indicates positive sentiment. This sample uses three simple sentences and returns the sentiment for each.

```python
# Create a dataframe that's tied to it's column names
df = spark.createDataFrame(
    [
        ("I am so happy today, its sunny!", "en-US"),
        ("I am frustrated by this rush hour traffic", "en-US"),
        ("The AI services on spark aint bad", "en-US"),
    ],
    ["text", "language"],
)

# Run the Text Analytics service with options
sentiment = (
    AnalyzeText()
    .setKind("SentimentAnalysis")
    .setTextCol("text")
    .setLocation(service_loc)
    .setSubscriptionKey(service_key)
    .setOutputCol("sentiment")
    .setErrorCol("error")
    .setLanguageCol("language")
)

# Show the results of your text query in a table format
display(
    sentiment.transform(df).select(
        "text", col("sentiment.documents.sentiment").alias("sentiment")
    )
)

```

## Perform text analytics for health data

The [Text Analytics for Health Service](/azure/ai-services/language-service/text-analytics-for-health/overview?tabs=ner) extracts and labels relevant medical information from unstructured text such as doctor's notes, discharge summaries, clinical documents, and electronic health records.

The following code sample analyzes and transforms text from doctors notes into structured data.

```python
df = spark.createDataFrame(
    [
        ("20mg of ibuprofen twice a day",),
        ("1tsp of Tylenol every 4 hours",),
        ("6-drops of Vitamin B-12 every evening",),
    ],
    ["text"],
)

healthcare = (
    AnalyzeHealthText()
    .setSubscriptionKey(service_key)
    .setLocation(service_loc)
    .setLanguage("en")
    .setOutputCol("response")
)

display(healthcare.transform(df))

```

## Translate text into a different language

[Translator](https://azure.microsoft.com/services/ai-services/translator/) is a cloud-based machine translation service and is part of the Azure AI services family of AI APIs used to build intelligent apps. Translator is easy to integrate in your applications, websites, tools, and solutions. It allows you to add multi-language user experiences in 90 languages and dialects and can be used to translate text without hosting your own algorithm.

The following code sample does a simple text translation by providing the sentences you want to translate and target languages you want to translate them to.

```python
from pyspark.sql.functions import col, flatten

# Create a dataframe including sentences you want to translate
df = spark.createDataFrame(
    [(["Hello, what is your name?", "Bye"],)],
    [
        "text",
    ],
)

# Run the Translator service with options
translate = (
    Translate()
    .setSubscriptionKey(translator_key)
    .setLocation(translator_loc)
    .setTextCol("text")
    .setToLanguage(["zh-Hans"])
    .setOutputCol("translation")
)

# Show the results of the translation.
display(
    translate.transform(df)
    .withColumn("translation", flatten(col("translation.translations")))
    .withColumn("translation", col("translation.text"))
    .select("translation")
)

```

## Extract information from a document into structured data

[Azure AI Document Intelligence](https://azure.microsoft.com/products/ai-services/ai-document-intelligence/) is a part of Azure Applied AI Services that lets you build automated data processing software using machine learning technology. With Azure AI Document Intelligence, you can identify and extract text, key/value pairs, selection marks, tables, and structure from your documents. The service outputs structured data that includes the relationships in the original file, bounding boxes, confidence and more.

The following code sample analyzes a business card image and extracts its information into structured data.

```python
from pyspark.sql.functions import col, explode

# Create a dataframe containing the source files
imageDf = spark.createDataFrame(
    [
        (
            "https://mmlspark.blob.core.windows.net/datasets/FormRecognizer/business_card.jpg",
        )
    ],
    [
        "source",
    ],
)

# Run the Form Recognizer service
analyzeBusinessCards = (
    AnalyzeBusinessCards()
    .setSubscriptionKey(service_key)
    .setLocation(service_loc)
    .setImageUrlCol("source")
    .setOutputCol("businessCards")
)

# Show the results of recognition.
display(
    analyzeBusinessCards.transform(imageDf)
    .withColumn(
        "documents", explode(col("businessCards.analyzeResult.documentResults.fields"))
    )
    .select("source", "documents")
)

```

## Computer Vision sample

[Azure AI Vision](https://azure.microsoft.com/products/ai-services/ai-vision/) analyzes images to identify structure such as faces, objects, and natural-language descriptions.

The following code sample analyzes images and labels them with *tags*. Tags are one-word descriptions of things in the image, such as recognizable objects, people, scenery, and actions.

```python
# Create a dataframe with the image URLs
base_url = "https://raw.githubusercontent.com/Azure-Samples/cognitive-services-sample-data-files/master/ComputerVision/Images/"
df = spark.createDataFrame(
    [
        (base_url + "objects.jpg",),
        (base_url + "dog.jpg",),
        (base_url + "house.jpg",),
    ],
    [
        "image",
    ],
)

# Run the Computer Vision service. Analyze Image extracts information from/about the images.
analysis = (
    AnalyzeImage()
    .setLocation(service_loc)
    .setSubscriptionKey(service_key)
    .setVisualFeatures(
        ["Categories", "Color", "Description", "Faces", "Objects", "Tags"]
    )
    .setOutputCol("analysis_results")
    .setImageUrlCol("image")
    .setErrorCol("error")
)

# Show the results of what you wanted to pull out of the images.
display(analysis.transform(df).select("image", "analysis_results.description.tags"))

```

## Search for images that are related to a natural language query

[Bing Image Search](https://www.microsoft.com/bing/apis/bing-image-search-api) searches the web to retrieve images related to a user's natural language query. 

The following code sample uses a text query that looks for images with quotes. The output of the code is a list of image URLs that contain photos related to the query.

```python
# Number of images Bing will return per query
imgsPerBatch = 10
# A list of offsets, used to page into the search results
offsets = [(i * imgsPerBatch,) for i in range(100)]
# Since web content is our data, we create a dataframe with options on that data: offsets
bingParameters = spark.createDataFrame(offsets, ["offset"])

# Run the Bing Image Search service with our text query
bingSearch = (
    BingImageSearch()
    .setSubscriptionKey(bing_search_key)
    .setOffsetCol("offset")
    .setQuery("Martin Luther King Jr. quotes")
    .setCount(imgsPerBatch)
    .setOutputCol("images")
)

# Transformer that extracts and flattens the richly structured output of Bing Image Search into a simple URL column
getUrls = BingImageSearch.getUrlTransformer("images", "url")

# This displays the full results returned, uncomment to use
# display(bingSearch.transform(bingParameters))

# Since we have two services, they are put into a pipeline
pipeline = PipelineModel(stages=[bingSearch, getUrls])

# Show the results of your search: image URLs
display(pipeline.transform(bingParameters))

```

## Transform speech to text

The [Speech-to-text](https://azure.microsoft.com/products/ai-services/ai-speech/) service converts streams or files of spoken audio to text. The following code sample transcribes one audio file to text.

```python
# Create a dataframe with our audio URLs, tied to the column called "url"
df = spark.createDataFrame(
    [("https://mmlspark.blob.core.windows.net/datasets/Speech/audio2.wav",)], ["url"]
)

# Run the Speech-to-text service to translate the audio into text
speech_to_text = (
    SpeechToTextSDK()
    .setSubscriptionKey(service_key)
    .setLocation(service_loc)
    .setOutputCol("text")
    .setAudioDataCol("url")
    .setLanguage("en-US")
    .setProfanity("Masked")
)

# Show the results of the translation
display(speech_to_text.transform(df).select("url", "text.DisplayText"))

```

## Transform text to speech

[Text to speech](https://azure.microsoft.com/products/ai-services/text-to-speech/) is a service that allows you to build apps and services that speak naturally, choosing from more than 270 neural voices across 119 languages and variants.

The following code sample transforms text into an audio file that contains the content of the text.

```python
from synapse.ml.services.speech import TextToSpeech

fs = ""
if running_on_databricks():
    fs = "dbfs:"
elif running_on_synapse_internal():
    fs = "Files"

# Create a dataframe with text and an output file location
df = spark.createDataFrame(
    [
        (
            "Reading out loud is fun! Check out aka.ms/spark for more information",
            fs + "/output.mp3",
        )
    ],
    ["text", "output_file"],
)

tts = (
    TextToSpeech()
    .setSubscriptionKey(service_key)
    .setTextCol("text")
    .setLocation(service_loc)
    .setVoiceName("en-US-JennyNeural")
    .setOutputFileCol("output_file")
)

# Check to make sure there were no errors during audio creation
display(tts.transform(df))

```

## Detect anomalies in time series data

If you don't have an anomaly detection resource created before Sep 20th 2023, you won't be able to create one. You may want to skip this part.

[Anomaly Detector](https://azure.microsoft.com/services/cognitive-services/anomaly-detector/) is great for detecting irregularities in your time series data. The following code sample uses the Anomaly Detector service to find anomalies in a time series.

```python
# Create a dataframe with the point data that Anomaly Detector requires
df = spark.createDataFrame(
    [
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
        ("1973-03-01T00:00:00Z", 9000.0),
    ],
    ["timestamp", "value"],
).withColumn("group", lit("series1"))

# Run the Anomaly Detector service to look for irregular data
anamoly_detector = (
    SimpleDetectAnomalies()
    .setSubscriptionKey(anomaly_key)
    .setLocation(anomaly_loc)
    .setTimestampCol("timestamp")
    .setValueCol("value")
    .setOutputCol("anomalies")
    .setGroupbyCol("group")
    .setGranularity("monthly")
)

# Show the full results of the analysis with the anomalies marked as "True"
display(
    anamoly_detector.transform(df).select("timestamp", "value", "anomalies.isAnomaly")
)

```

## Get information from arbitrary web APIs

With HTTP on Spark, any web service can be used in your big data pipeline. In this example, we use the [World Bank API](http://api.worldbank.org/v2/country/) to get information about various countries around the world.

```python
# Use any requests from the python requests library

def world_bank_request(country):
    return Request(
        "GET", "http://api.worldbank.org/v2/country/{}?format=json".format(country)
    )

# Create a dataframe with specifies which countries we want data on
df = spark.createDataFrame([("br",), ("usa",)], ["country"]).withColumn(
    "request", http_udf(world_bank_request)(col("country"))
)

# Much faster for big data because of the concurrency :)
client = (
    HTTPTransformer().setConcurrency(3).setInputCol("request").setOutputCol("response")
)

# Get the body of the response

def get_response_body(resp):
    return resp.entity.content.decode()

# Show the details of the country data returned
display(
    client.transform(df).select(
        "country", udf(get_response_body)(col("response")).alias("response")
    )
)

```

## Azure AI search sample

In this example, we show how you can enrich data using Cognitive Skills and write to an Azure Search Index using SynapseML.

```python
search_service = "mmlspark-azure-search"
search_index = "test-33467690"

df = spark.createDataFrame(
    [
        (
            "upload",
            "0",
            "https://mmlspark.blob.core.windows.net/datasets/DSIR/test1.jpg",
        ),
        (
            "upload",
            "1",
            "https://mmlspark.blob.core.windows.net/datasets/DSIR/test2.jpg",
        ),
    ],
    ["searchAction", "id", "url"],
)

tdf = (
    AnalyzeImage()
    .setSubscriptionKey(service_key)
    .setLocation(service_loc)
    .setImageUrlCol("url")
    .setOutputCol("analyzed")
    .setErrorCol("errors")
    .setVisualFeatures(
        ["Categories", "Tags", "Description", "Faces", "ImageType", "Color", "Adult"]
    )
    .transform(df)
    .select("*", "analyzed.*")
    .drop("errors", "analyzed")
)

tdf.writeToAzureSearch(
    subscriptionKey=search_key,
    actionCol="searchAction",
    serviceName=search_service,
    indexName=search_index,
    keyCol="id",
)

```
