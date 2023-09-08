---
title: 'How-to - Use Azure OpenAI Service with large datasets'
titleSuffix: Azure OpenAI
description: Walkthrough on how to integrate Azure OpenAI with SynapseML and Apache Spark to apply large language models at a distributed scale.
services: cognitive-services
manager: nitinme
ms.service: cognitive-services
ms.subservice: openai
ms.custom: build-2023, build-2023-dataai
ms.topic: how-to
ms.date: 08/04/2022
author: ChrisHMSFT
ms.author: chrhoder
recommendations: false
---

# Use Azure OpenAI with large datasets

Azure OpenAI can be used to solve a large number of natural language tasks through prompting the completion API. To make it easier to scale your prompting workflows from a few examples to large datasets of examples, we have integrated the Azure OpenAI Service with the distributed machine learning library [SynapseML](https://www.microsoft.com/research/blog/synapseml-a-simple-multilingual-and-massively-parallel-machine-learning-library/). This integration makes it easy to use the [Apache Spark](https://spark.apache.org/) distributed computing framework to process millions of prompts with the OpenAI service. This tutorial shows how to apply large language models at a distributed scale using Azure Open AI and Azure Synapse Analytics.

## Prerequisites

- An Azure subscription - <a href="https://azure.microsoft.com/free/cognitive-services" target="_blank">Create one for free</a>
- Access granted to Azure OpenAI in the desired Azure subscription

    Currently, access to this service is granted only by application. You can apply for access to Azure OpenAI by completing the form at <a href="https://aka.ms/oai/access" target="_blank">https://aka.ms/oai/access</a>. Open an issue on this repo to contact us if you have an issue.
- An Azure OpenAI resource – [create a resource](create-resource.md?pivots=web-portal#create-a-resource)
- An Apache Spark cluster with SynapseML installed - create a serverless Apache Spark pool [here](../../../synapse-analytics/get-started-analyze-spark.md#create-a-serverless-apache-spark-pool)

We recommend [creating a Synapse workspace](../../../synapse-analytics/get-started-create-workspace.md), but an Azure Databricks, HDInsight, or Spark on Kubernetes, or even a Python environment with the `pyspark` package, will also work.

## Import this guide as a notebook

The next step is to add this code into your Spark cluster. You can either create a notebook in your Spark platform and copy the code into this notebook to run the demo, or download the notebook and import it into Synapse Analytics.

1. Import the notebook [into the Synapse Workspace](../../../synapse-analytics/spark/apache-spark-development-using-notebooks.md#create-a-notebook) or, if using Databricks, [into the Databricks Workspace](/azure/databricks/notebooks/notebooks-manage#create-a-notebook)
1. Install SynapseML on your cluster. See the installation instructions for Synapse at the bottom of [the SynapseML website](https://microsoft.github.io/SynapseML/). This requires pasting another cell at the top of the notebook you imported
1. Connect your notebook to a cluster and follow along, editing and running the cells below.

## Fill in your service information

Next, edit the cell in the notebook to point to your service. In particular, set the `resource_name`, `deployment_name`, `location`, and `key` variables to the corresponding values for your Azure OpenAI resource.

> [!IMPORTANT]
> Remember to remove the key from your code when you're done, and never post it publicly. For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](../../../key-vault/general/overview.md). See the Azure AI services [security](../../security-features.md) article for more information.

```python
import os

# Replace the following values with your Azure OpenAI resource information
resource_name = "RESOURCE_NAME"      # The name of your Azure OpenAI resource.
deployment_name = "DEPLOYMENT_NAME"  # The name of your Azure OpenAI deployment.
location = "RESOURCE_LOCATION"       # The location or region ID for your resource.
key = "RESOURCE_API_KEY"             # The key for your resource.

assert key is not None and resource_name is not None
```

## Create a dataset of prompts

Next, create a dataframe consisting of a series of rows, with one prompt per row.

You can also load data directly from Azure Data Lake Storage (ADLS) or other databases. For more information about loading and preparing Spark dataframes, see the [Apache Spark data loading guide](https://spark.apache.org/docs/latest/sql-data-sources.html).

```python
df = spark.createDataFrame(
    [
        ("Hello my name is",),
        ("The best code is code that's",),
        ("SynapseML is ",),
    ]
).toDF("prompt")
```

## Create the OpenAICompletion Apache Spark client

To apply the OpenAI Completion service to the dataframe that you just created, create an `OpenAICompletion` object that serves as a distributed client. Parameters of the service can be set either with a single value, or by a column of the dataframe with the appropriate setters on the `OpenAICompletion` object. Here, we're setting `maxTokens` to 200. A token is around four characters, and this limit applies to the sum of the prompt and the result. We're also setting the `promptCol` parameter with the name of the prompt column in the dataframe.

```python
from synapse.ml.cognitive import OpenAICompletion

completion = (
    OpenAICompletion()
    .setSubscriptionKey(key)
    .setDeploymentName(deployment_name)
    .setUrl("https://{}.openai.azure.com/".format(resource_name))
    .setMaxTokens(200)
    .setPromptCol("prompt")
    .setErrorCol("error")
    .setOutputCol("completions")
)
```

## Transform the dataframe with the OpenAICompletion client

Now that you have the dataframe and the completion client, you can transform your input dataset and add a column called `completions` with all of the information the service adds. We'll select out just the text for simplicity.

```python
from pyspark.sql.functions import col

completed_df = completion.transform(df).cache()
display(completed_df.select(
  col("prompt"), col("error"), col("completions.choices.text").getItem(0).alias("text")))
```

Your output should look something like the following example; note that the completion text can vary.

| **prompt** | **error** | **text** |
|------------|-----------| ---------|
| Hello my name is             | undefined | Makaveli I'm eighteen years old and I want to<br>be a rapper when I grow up I love writing and making music I'm from Los<br>Angeles, CA |
| The best code is code that's  | undefined | understandable This is a subjective statement,<br>and there is no definitive answer. |
| SynapseML is                 | undefined | A machine learning algorithm that is able to learn how to predict the future outcome of events. |

## Other usage examples

### Improve throughput with request batching

The example above makes several requests to the service, one for each prompt. To complete multiple prompts in a single request, use batch mode. First, in the `OpenAICompletion` object, instead of setting the Prompt column to "Prompt", specify "batchPrompt" for the BatchPrompt column.
To do so, create a dataframe with a list of prompts per row.

> [!NOTE]
> There is currently a limit of 20 prompts in a single request and a limit of 2048 "tokens", or approximately 1500 words.

```python
batch_df = spark.createDataFrame(
    [
        (["The time has come", "Pleased to", "Today stocks", "Here's to"],),
        (["The only thing", "Ask not what", "Every litter", "I am"],),
    ]
).toDF("batchPrompt")
```

Next we create the `OpenAICompletion` object. Rather than setting the prompt column, set the batchPrompt column if your column is of type `Array[String]`.

```python
batch_completion = (
    OpenAICompletion()
    .setSubscriptionKey(key)
    .setDeploymentName(deployment_name)
    .setUrl("https://{}.openai.azure.com/".format(resource_name))
    .setMaxTokens(200)
    .setBatchPromptCol("batchPrompt")
    .setErrorCol("error")
    .setOutputCol("completions")
)
```

In the call to transform, a request will then be made per row. Because there are multiple prompts in a single row, each request will be sent with all prompts in that row. The results will contain a row for each row in the request.

```python
completed_batch_df = batch_completion.transform(batch_df).cache()
display(completed_batch_df)
```

> [!NOTE]
> There is currently a limit of 20 prompts in a single request and a limit of 2048 "tokens", or approximately 1500 words.

### Using an automatic mini-batcher

If your data is in column format, you can transpose it to row format using SynapseML's `FixedMiniBatcherTransformer`.

```python
from pyspark.sql.types import StringType
from synapse.ml.stages import FixedMiniBatchTransformer
from synapse.ml.core.spark import FluentAPI

completed_autobatch_df = (df
 .coalesce(1) # Force a single partition so that our little 4-row dataframe makes a batch of size 4, you can remove this step for large datasets
 .mlTransform(FixedMiniBatchTransformer(batchSize=4))
 .withColumnRenamed("prompt", "batchPrompt") 
 .mlTransform(batch_completion))

display(completed_autobatch_df)
```

### Prompt engineering for translation

Azure OpenAI can solve many different natural language tasks through [prompt engineering](completions.md). Here, we show an example of prompting for language translation:

```python
translate_df = spark.createDataFrame(
    [
        ("Japanese: Ookina hako \nEnglish: Big box \nJapanese: Midori tako\nEnglish:",),
        ("French: Quelle heure est-il à Montréal? \nEnglish: What time is it in Montreal? \nFrench: Où est le poulet? \nEnglish:",),
    ]
).toDF("prompt")

display(completion.transform(translate_df))
```

### Prompt for question answering

Here, we prompt the GPT-3 model for general-knowledge question answering:

```python
qa_df = spark.createDataFrame(
    [
        (
            "Q: Where is the Grand Canyon?\nA: The Grand Canyon is in Arizona.\n\nQ: What is the weight of the Burj Khalifa in kilograms?\nA:",
        )
    ]
).toDF("prompt")

display(completion.transform(qa_df))
```
