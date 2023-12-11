---
title: 'Use Azure OpenAI Service with large datasets'
titleSuffix: Azure OpenAI
description: Learn how to integrate Azure OpenAI Service with SynapseML and Apache Spark to apply large language models at a distributed scale.
#services: cognitive-services
manager: nitinme
ms.service: azure-ai-openai
ms.custom: build-2023, build-2023-dataai
ms.topic: how-to
ms.date: 09/01/2023
author: ChrisHMSFT
ms.author: chrhoder
recommendations: false
---

# Use Azure OpenAI with large datasets

Azure OpenAI can be used to solve a large number of natural language tasks through prompting the completion API. To make it easier to scale your prompting workflows from a few examples to large datasets of examples, Azure OpenAI Service is integrated with the distributed machine learning library [SynapseML](https://www.microsoft.com/research/blog/synapseml-a-simple-multilingual-and-massively-parallel-machine-learning-library/). This integration makes it easy to use the [Apache Spark](https://spark.apache.org/) distributed computing framework to process millions of prompts with Azure OpenAI Service.

This tutorial shows how to apply large language models at a distributed scale by using Azure OpenAI and Azure Synapse Analytics.

## Prerequisites

- An Azure subscription. <a href="https://azure.microsoft.com/free/cognitive-services" target="_blank">Create one for free</a>.

- Access granted to Azure OpenAI in your Azure subscription.

   Currently, you must submit an application to access Azure OpenAI Service. To apply for access, complete <a href="https://aka.ms/oai/access" target="_blank">this form</a>. If you need assistance, open an issue on this repo to contact Microsoft.

- An Azure OpenAI resource. [Create a resource](create-resource.md?pivots=web-portal#create-a-resource).

- An Apache Spark cluster with SynapseML installed.

   - Create a [serverless Apache Spark pool](../../../synapse-analytics/get-started-analyze-spark.md#create-a-serverless-apache-spark-pool).
   - To install SynapseML for your Apache Spark cluster, see [Install SynapseML](#install-synapseml).

> [!NOTE]
> The `OpenAICompletion()` transformer is designed to work with the [Azure OpenAI Service legacy models](/azure/ai-services/openai/concepts/legacy-models) like `Text-Davinci-003`, which supports prompt-based completions. Newer models like the current `GPT-3.5 Turbo` and `GPT-4` model series are designed to work with the new chat completion API that expects a specially formatted array of messages as input. If you working with embeddings or chat completion models, please check the [Chat Completion](#chat-completion) and [Generating Text Embeddings](generating-text-embeddings) sections bellow.
> 
> The Azure OpenAI SynapseML integration supports the latest models via the [OpenAIChatCompletion()](https://github.com/microsoft/SynapseML/blob/0836e40efd9c48424e91aa10c8aa3fbf0de39f31/cognitive/src/main/scala/com/microsoft/azure/synapse/ml/cognitive/openai/OpenAIChatCompletion.scala#L24) transformer.

We recommend that you [create an Azure Synapse workspace](../../../synapse-analytics/get-started-create-workspace.md). However, you can also use Azure Databricks, Azure HDInsight, Spark on Kubernetes, or the Python environment with the `pyspark` package.

## Use example code as a notebook

To use the example code in this article with your Apache Spark cluster, complete the following steps:

1. Prepare a new or existing notebook.

1. Connect your Apache Spark cluster with your notebook.

1. Install SynapseML for your Apache Spark cluster in your notebook.

1. Configure the notebook to work with your Azure OpenAI service resource.

### Prepare your notebook

You can create a new notebook in your Apache Spark platform, or you can import an existing notebook. After you have a notebook in place, you can add each snippet of example code in this article as a new cell in your notebook.

- To use a notebook in Azure Synapse Analytics, see [Create, develop, and maintain Synapse notebooks in Azure Synapse Analytics](../../../synapse-analytics/spark/apache-spark-development-using-notebooks.md).

- To use a notebook in Azure Databricks, see [Manage notebooks for Azure Databricks](/azure/databricks/notebooks/notebooks-manage).

- (Optional) Download [this demonstration notebook](https://github.com/microsoft/SynapseML/blob/master/docs/Explore%20Algorithms/OpenAI/OpenAI.ipynb) and connect it with your workspace. During the download process, select **Raw**, and then save the file. 

### Connect your cluster

When you have a notebook ready, connect or _attach_ your notebook to an Apache Spark cluster.

### Install SynapseML

To run the exercises, you need to install SynapseML on your Apache Spark cluster. For more information, see [Install SynapseML](https://microsoft.github.io/SynapseML/docs/Get%20Started/Install%20SynapseML/) on the [SynapseML website](https://microsoft.github.io/SynapseML/).

To install SynapseML, create a new cell at the top of your notebook and run the following code.

- For a **Spark3.2 pool**, use the following code:

   ```python
   %%configure -f
   {
     "name": "synapseml",
     "conf": {
         "spark.jars.packages": "com.microsoft.azure:synapseml_2.12:0.11.2,org.apache.spark:spark-avro_2.12:3.3.1",
         "spark.jars.repositories": "https://mmlspark.azureedge.net/maven",
         "spark.jars.excludes": "org.scala-lang:scala-reflect,org.apache.spark:spark-tags_2.12,org.scalactic:scalactic_2.12,org.scalatest:scalatest_2.12,com.fasterxml.jackson.core:jackson-databind",
         "spark.yarn.user.classpath.first": "true",
         "spark.sql.parquet.enableVectorizedReader": "false",
         "spark.sql.legacy.replaceDatabricksSparkAvro.enabled": "true"
     }
   }
   ```

- For a **Spark3.3 pool**, use the following code:

   ```python
   %%configure -f
   {
     "name": "synapseml",
     "conf": {
         "spark.jars.packages": "com.microsoft.azure:synapseml_2.12:0.11.2-spark3.3",
         "spark.jars.repositories": "https://mmlspark.azureedge.net/maven",
         "spark.jars.excludes": "org.scala-lang:scala-reflect,org.apache.spark:spark-tags_2.12,org.scalactic:scalactic_2.12,org.scalatest:scalatest_2.12,com.fasterxml.jackson.core:jackson-databind",
         "spark.yarn.user.classpath.first": "true",
         "spark.sql.parquet.enableVectorizedReader": "false"
     }
   }
   ```

The connection process can take several minutes.

### Configure the notebook

Create a new code cell and run the following code to configure the notebook for your service. Set the `resource_name`, `deployment_name`, `location`, and `key` variables to the corresponding values for your Azure OpenAI resource.

```python
import os

# Replace the following values with your Azure OpenAI resource information
resource_name = "<RESOURCE_NAME>"      # The name of your Azure OpenAI resource.
deployment_name = "<DEPLOYMENT_NAME>"  # The name of your Azure OpenAI deployment.
location = "<RESOURCE_LOCATION>"       # The location or region ID for your resource.
key = "<RESOURCE_API_KEY>"             # The key for your resource.

assert key is not None and resource_name is not None
```

Now you're ready to start running the example code.

> [!IMPORTANT]
> Remember to remove the key from your code when you're done, and never post it publicly. For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](../../../key-vault/general/overview.md). For more information, see [Azure AI services security](../../security-features.md).


## Create a dataset of prompts

The first step is to create a dataframe consisting of a series of rows, with one prompt per row.

You can also load data directly from Azure Data Lake Storage or other databases. For more information about loading and preparing Spark dataframes, see the [Apache Spark Data Sources](https://spark.apache.org/docs/latest/sql-data-sources.html).

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

To apply Azure OpenAI Completion generation to the dataframe, create an `OpenAICompletion` object that serves as a distributed client. Parameters can be set either with a single value, or by a column of the dataframe with the appropriate setters on the `OpenAICompletion` object.

In this example, you set the `maxTokens` parameter to 200. A token is around four characters, and this limit applies to the sum of the prompt and the result. You also set the `promptCol` parameter with the name of the prompt column in the dataframe, such as **prompt**.

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

After you have the dataframe and completion client, you can transform your input dataset and add a column called `completions` with all of the text generated from the Azure OpenAI completion API. In this example, select only the text for simplicity.

```python
from pyspark.sql.functions import col

completed_df = completion.transform(df).cache()
display(completed_df.select(
  col("prompt"), col("error"), col("completions.choices.text").getItem(0).alias("text")))
```

The following image shows example output with completions in Azure Synapse Analytics Studio. Keep in mind that completions text can vary. Your output might look different.

:::image type="content" source="../media/how-to/synapse-studio-transform-dataframe-output.png" alt-text="Screenshot that shows sample completions in Azure Synapse Analytics Studio." border="false":::

## Explore other usage scenarios

Here are some other use cases for working with Azure OpenAI Service and large datasets.

### Generating Text Embeddings

In addition to completing text, we can also embed text for use in downstream algorithms or vector retrieval architectures. Creating embeddings allows you to search and retrieve documents from large collections and can be used when prompt engineering isn't sufficient for the task. For more information on using [OpenAIEmbedding](https://mmlspark.blob.core.windows.net/docs/0.11.1/pyspark/_modules/synapse/ml/cognitive/openai/OpenAIEmbedding.html), see our [embedding guide](https://microsoft.github.io/SynapseML/docs/Explore%20Algorithms/OpenAI/Quickstart%20-%20OpenAI%20Embedding/).

from synapse.ml.services.openai import OpenAIEmbedding

```python
embedding = (
    OpenAIEmbedding()
    .setSubscriptionKey(key)
    .setDeploymentName(deployment_name_embeddings)
    .setCustomServiceName(service_name)
    .setTextCol("prompt")
    .setErrorCol("error")
    .setOutputCol("embeddings")
)

display(embedding.transform(df))
```

### Chat Completion
Models such as ChatGPT and GPT-4 are capable of understanding chats instead of single prompts. The [OpenAIChatCompletion](https://mmlspark.blob.core.windows.net/docs/0.11.1/pyspark/_modules/synapse/ml/cognitive/openai/OpenAIChatCompletion.html) transformer exposes this functionality at scale.

```python
from synapse.ml.services.openai import OpenAIChatCompletion
from pyspark.sql import Row
from pyspark.sql.types import *


def make_message(role, content):
    return Row(role=role, content=content, name=role)


chat_df = spark.createDataFrame(
    [
        (
            [
                make_message(
                    "system", "You are an AI chatbot with red as your favorite color"
                ),
                make_message("user", "Whats your favorite color"),
            ],
        ),
        (
            [
                make_message("system", "You are very excited"),
                make_message("user", "How are you today"),
            ],
        ),
    ]
).toDF("messages")

chat_completion = (
    OpenAIChatCompletion()
    .setSubscriptionKey(key)
    .setDeploymentName(deployment_name)
    .setCustomServiceName(service_name)
    .setMessagesCol("messages")
    .setErrorCol("error")
    .setOutputCol("chat_completions")
)

display(
    chat_completion.transform(chat_df).select(
        "messages", "chat_completions.choices.message.content"
    )
)
```

### Improve throughput with request batching from OpenAICompletion

You can use Azure OpenAI Service with large datasets to improve throughput with request batching. In the previous example, you make several requests to the service, one for each prompt. To complete multiple prompts in a single request, you can use batch mode.

In the [OpenAItCompletion](https://mmlspark.blob.core.windows.net/docs/0.11.1/pyspark/_modules/synapse/ml/cognitive/openai/OpenAICompletion.html) object definition, you specify the `"batchPrompt"` value to configure the dataframe to use a **batchPrompt** column. Create the dataframe with a list of prompts for each row.

> [!NOTE]
> There's currently a limit of 20 prompts in a single request and a limit of 2048 tokens, or approximately 1500 words.

> [!NOTE]
> Currently, request batching is not supported by the `OpenAIChatCompletion()` transformer.

```python
batch_df = spark.createDataFrame(
    [
        (["The time has come", "Pleased to", "Today stocks", "Here's to"],),
        (["The only thing", "Ask not what", "Every litter", "I am"],),
    ]
).toDF("batchPrompt")
```

Next, create the `OpenAICompletion` object. If your column is of type `Array[String]`, set the `batchPromptCol` value for the column heading, rather than the `promptCol` value.

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

In the call to `transform`, one request is made per row. Because there are multiple prompts in a single row, each request is sent with all prompts in that row. The results contain a row for each row in the request.

```python
completed_batch_df = batch_completion.transform(batch_df).cache()
display(completed_batch_df)
```

### Use an automatic mini-batcher

You can use Azure OpenAI Service with large datasets to transpose the data format. If your data is in column format, you can transpose it to row format by using the SynapseML `FixedMiniBatcherTransformer` object.

```python
from pyspark.sql.types import StringType
from synapse.ml.stages import FixedMiniBatchTransformer
from synapse.ml.core.spark import FluentAPI

completed_autobatch_df = (df
 .coalesce(1) # Force a single partition so your little 4-row dataframe makes a batch of size 4 - you can remove this step for large datasets.
 .mlTransform(FixedMiniBatchTransformer(batchSize=4))
 .withColumnRenamed("prompt", "batchPrompt") 
 .mlTransform(batch_completion))

display(completed_autobatch_df)
```

### Prompt engineering for translation

Azure OpenAI can solve many different natural language tasks through _prompt engineering_. For more information, see [Learn how to generate or manipulate text](completions.md). In this example, you can prompt for language translation:

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

Azure OpenAI also supports prompting the `Text-Davinci-003` model for general-knowledge question answering:

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

## Next steps

- Learn how to work with the [GPT-35 Turbo and GPT-4 models](/azure/ai-services/openai/how-to/chatgpt?pivots=programming-language-chat-completions).
- Learn more about the [Azure OpenAI Service models](../concepts/models.md).
