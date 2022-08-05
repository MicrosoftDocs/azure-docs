---
title: Use search with Synapse ML
titleSuffix: Azure Cognitive Search
description: Add full text search to big data using Apache Spark, Cognitive Services for Big Data, and Synapse ML. Ingest data frames from Azure Databricks, transform it using Cognitive Services resources, then load it into a generated index using the AzureSearchWriter functions in Synapse ML.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: how-to
ms.date: 08/06/2022
---

# Add search to AI-enriched data from Apache Spark using Azure Synapse Analytics

This Azure Cognitive Search article explains how to add full text search to big data from Apache Spark using the SynapseML feature of Azure Synapse Analytics. Transformers in SynapseML automate calls to both Cognitive Services and Cognitive Search. By stepping through this exercise, you'll learn how to transform big data in a Spark cluster and then send it a search index so that you can query the output. 

Although Azure Cognitive Search has its own [AI enrichment](cognitive-search-concept-intro.md) functionality, this walkthrough bypasses indexers and skillsets in favor of SynapseML transformers. A key takeaway is learning an end-to-end workflow that shows you how to tap AI resources outside of Cognitive Search.

The article starts with forms (invoices) in Azure Storage and includes the following steps:

+ Create an Azure Databricks workspace that connects to a Spark cluster containing your data.
+ Create a notebook that loads and transforms data using SynapseML and other resources. Transformations include forms recognition, form analysis and restructuring, and text translation.
+ Infer, build, and load a search index using AzureSearchWriter from SynapseML.
+ Query the search index that contains transformed and multi-lingual content.

The search corpus is created and hosted in Azure Cognitive Search, and all queries execute locally over the search corpus. SynapseML provides transformers that wrap other Azure resources, including Azure Forms Recognizer, Azure Translator, and Azure Cognitive Search.

You'll call these SynapseML transformers in this walkthrough:

+ [synapse.ml.cognitive.AnalyzeInvoices](https://microsoft.github.io/SynapseML/docs/documentation/transformers/transformers_cognitive/#analyzeinvoices)
+ [synapse.ml.cognitive.FormOntologyLearner](https://mmlspark.blob.core.windows.net/docs/0.10.0/pyspark/synapse.ml.cognitive.html#module-synapse.ml.cognitive.FormOntologyTransformer)
+ [synpase.ml.cognitive.AzureSearchWriter](https://microsoft.github.io/SynapseML/docs/documentation/transformers/transformers_cognitive/#azuresearch)

## Prerequisites

You'll need multiple Azure resources for this walkthrough. You should use the same subscription and region, and put everything into one resource group for simple clean up later. The following links are for portal installs.

+ [Azure Cognitive Search](search-create-service-portal.md) (any tier)
+ [Azure Forms Recognizer](../applied-ai-services/form-recognizer/create-a-form-recognizer-resource.md) (any tier)
+ [Azure Cognitive Services Translator](../cognitive-services/translator/how-to-create-translator-resource.md), Single service (any tier)
+ [Azure Data Lake Storage Gen2](../storage/blobs/create-data-lake-storage-account.md), Standard (general-purpose v2), as required by Azure Synapse Analytics.
+ [Azure Synapse Analytics](../synapse-analytics/get-started-create-workspace.md) (any tier)
+ [Azure Databricks](/azure/databricks/scenarios/quickstart-create-databricks-workspace-portal?tabs=azure-portal) (any tier) <sup>1</sup>

<sup>1</sup> The Azure Databricks quickstart includes multiple steps. Follow just the instructions in the "Create an Azure Databricks workspace" section.

All of these resources support security features in the Microsoft Identity platform, but for simplicity this walkthrough assumes key-based authentication, using endpoints and keys copied from the portal pages of each service.

## Prepare data

The sample data consists of 10 invoices of various composition. A small data set speeds up processing and meets the requirements of minimum tiers, but the approach described in this exercise will work for large volumes of data.

+ HS: I need the invoices. Are the PDFs wrapping JPEG?
+ HS: I'm using just ADLS GEN2. Should be okay.

1. Download the sample data from the Azure Search Sample data repository.

1. Upload the files to a new container in your storage account.

1. Get the connection string and access keys for the account. You'll need it later.

## Create a Spark cluster and add SynapsemL

1. In Azure portal, find your Azure Databricks workspace and select **Launch workspace**.

1. On the left menu, select **Compute**.

1. Select **Create cluster**.

1. Give the cluster a name, accept the default configuration, and then create the cluster. It takes several minutes to create the cluster.

1. Install the `synapseml` library:

   1. After the cluster is created, select **Library** from the tabs at the top of the cluster's page.
   1. Select **Install new**.
   1. Select **Maven**.
   1. In Coordinates, enter `com.microsoft.azure:synapseml_2.12:0.10.0`
   1. Select **Install**.

## Create a notebook

1. On the left menu, select **Create** > **Notebook**.

1. Give the notebook a name, select **Python** as the default language, and select the cluster that has the `synapseml` library.

1. Create seven consecutive cells. You'll paste code into each one.

## Set up dependencies

Paste the following code into the first cell. Replace the placeholders with endpoints and access keys for each resource.

This code loads packages and sets up the endpoints and keys for the Azure resources used in this workflow.

+ HS: What is VISION used for?  Do the PDFs contain JPEG???
+ HS: Where is Forms Recognizer?
+ HS: what is Project Arcadia?
+ HS: Can I delete all instances of mmlspark-build-keys?
+ HS: I need to add endpoints, not just keys -- where and how do I do that?

```python
import os
from pyspark.sql.functions import udf, trim, split, explode, col, monotonically_increasing_id, lit
from pyspark.sql.types import StringType
from synapse.ml.core.spark import FluentAPI

if os.environ.get("AZURE_SERVICE", None) == "Microsoft.ProjectArcadia":
    from pyspark.sql import SparkSession

    spark = SparkSession.builder.getOrCreate()
    from notebookutils.mssparkutils.credentials import getSecret

    os.environ["VISION_API_KEY"] = getSecret("mmlspark-build-keys", "cognitive-api-key")
    os.environ["AZURE_SEARCH_KEY"] = getSecret("mmlspark-build-keys", "azure-search-key")
    os.environ["TRANSLATOR_KEY"] = getSecret("mmlspark-build-keys", "translator-key")
    from notebookutils.visualization import display


key = os.environ["VISION_API_KEY"]
search_key = os.environ["AZURE_SEARCH_KEY"]
translator_key = os.environ["TRANSLATOR_KEY"]
openai_key = os.environ["OPENAI_API_KEY"]

search_service = "mmlspark-azure-search"
search_index = "form-demo-index-3"
```

## Load data into Spark

Paste the following code into the second cell. Replace the reference to the storage account and container with names used in your resources.

This code creates references to external files in Azure storage and reads them into data frames.

```python
def blob_to_url(blob):
    [prefix, postfix] = blob.split("@")
    container = prefix.split("/")[-1]
    split_postfix = postfix.split("/")
    account = split_postfix[0]
    filepath = "/".join(split_postfix[1:])
    return "https://{}/{}/{}".format(account, container, filepath)


df2 = (spark.read.format("binaryFile")
    .load("wasbs://ignite2021@mmlsparkdemo.blob.core.windows.net/form_subset/*")
    .select("path")
    .limit(10)
    .select(udf(blob_to_url, StringType())("path").alias("url"))
    .cache())
    
display(df2)
```

## Apply form recognition

Paste the following code into the third cell. No modifications are required.

This code loads the AnalyzeInvoices transformer and the invoices.

+ HS: SUBSCRIPTION KEY?? Should the key references be more specific. Subscription key is unfamiliar terminoloyg.
+ HS: IMAGE URL??
+ HS: ORIGINAL SUBHEAD INCLUDES "DISTRIBUTED" - is this important?

```python
from synapse.ml.cognitive import AnalyzeInvoices

analyzed_df = (AnalyzeInvoices()
    .setSubscriptionKey(key)
    .setLocation("eastus")
    .setImageUrlCol("url")
    .setOutputCol("invoices")
    .setErrorCol("errors")
    .setConcurrency(5)
    .transform(df2)
    .cache())

display(analyzed_df)
```

## Apply form ontology

Paste the following code into the fourth cell. No modifications are required.

This code loads FormOntologyLearner, a transformer that analyzes the output of form recognition and infers a tabular data structure.

```python
from synapse.ml.cognitive import FormOntologyLearner

itemized_df = (FormOntologyLearner()
    .setInputCol("invoices")
    .setOutputCol("extracted")
    .fit(analyzed_df)
    .transform(analyzed_df)
    .select("url", "extracted.*").select("*", explode(col("Items")).alias("Item"))
    .drop("Items").select("Item.*", "*").drop("Item"))

display(itemized_df)
```

## Apply translation

Paste the following code into the fifth cell. No modifications are required.

This code loads Translate, a transformer that calls the Azure Translator in Cognitive Services. The original text, which is in English, is machine-translated into various languages. All of the output is consolidated into "output.translations".

```python
from synapse.ml.cognitive import Translate

translated_df = (Translate()
    .setSubscriptionKey(translator_key)
    .setLocation("eastus")
    .setTextCol("Description")
    .setErrorCol("TranslationError")
    .setOutputCol("output")
    .setToLanguage(["zh-Hans", "fr", "ru", "cy"])
    .setConcurrency(5)
    .transform(itemized_df)
    .withColumn("Translations", col("output.translations")[0])
    .drop("output", "TranslationError")
    .cache())

display(translated_df)
```

## Create and load an index

Paste the following code in the sixth cell. No modifications are required.

This code loads AzureSearchWriter. It consumes a tabular dataset and infers a search index schema that defines one field for each column. The generated index will have a document key and use the default values for fields created using the REST API.

+ HS: Is there anyway to add language analyzers?  If not, should we skip the translation step or replace it with a different transformer?

```python
from synapse.ml.cognitive import *

(completed_df.withColumn("DocID", monotonically_increasing_id().cast("string"))
    .withColumn("SearchAction", lit("upload"))
    .writeToAzureSearch(
        subscriptionKey=search_key,
        actionCol="SearchAction",
        serviceName=search_service,
        indexName=search_index,
        keyCol="DocID",
    ))
```

## Search the index

Paste the following code into the seventh cell. No modifications are required, except that you might want to vary the query syntax to further explore your content.

This code calls the Search Documents REST API that queries an index.

```python
import requests

url = "https://{}.search.windows.net/indexes/{}/docs/search?api-version=2019-05-06".format(search_service, search_index)
requests.post(url, json={"search": "door"}, headers={"api-key": search_key}).json()
```

## Clean up resources

When you're working in your own subscription, at the end of a project, it's a good idea to remove the resources that you no longer need. Resources left running can cost you money. You can delete resources individually or delete the resource group to delete the entire set of resources.

You can find and manage resources in the portal, using the **All resources** or **Resource groups** link in the left-navigation pane.

## Next steps

TBD

## Internal notes

https://microsoft.github.io/SynapseML/docs/next/features/cognitive_services/CognitiveServices%20-%20Overview/