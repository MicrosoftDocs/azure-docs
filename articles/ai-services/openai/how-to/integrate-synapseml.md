---
title: 'Use Azure OpenAI Service with large datasets'
titleSuffix: Azure OpenAI
description: Learn how to integrate Azure OpenAI Service with SynapseML and Apache Spark to apply large language models at a distributed scale.
services: cognitive-services
manager: nitinme
ms.service: cognitive-services
ms.subservice: openai
ms.custom: build-2023, build-2023-dataai
ms.topic: how-to
ms.date: 08/29/2023
author: ChrisHMSFT
ms.author: chrhoder
recommendations: false
---

# Use Azure OpenAI with large datasets

Azure OpenAI can be used to solve a large number of natural language tasks through prompting the completion API. To make it easier to scale your prompting workflows from a few examples to large datasets of examples, Azure OpenAI Service is integrated with the distributed machine learning library [SynapseML](https://www.microsoft.com/research/blog/synapseml-a-simple-multilingual-and-massively-parallel-machine-learning-library/). This integration makes it easy to use the [Apache Spark](https://spark.apache.org/) distributed computing framework to process millions of prompts with Azure OpenAI Service. This tutorial shows how to apply large language models at a distributed scale by using Azure OpenAI and Azure Synapse Analytics.

## Prerequisites

- An Azure subscription. <a href="https://azure.microsoft.com/free/cognitive-services" target="_blank">Create one for free</a>.
- Access granted to Azure OpenAI in the desired Azure subscription.
- An Azure OpenAI resource. [Create a resource](create-resource.md?pivots=web-portal#create-a-resource).
- An Apache Spark cluster with SynapseML installed.
   - Create a [serverless Apache Spark pool](../../../synapse-analytics/get-started-analyze-spark.md#create-a-serverless-apache-spark-pool).
   - To install SynapseML for your Apache Spark cluster, see [Install SynapseML](#install-synapseml).

> [!NOTE]
> Currently, you must submit an application to access Azure OpenAI Service. To apply for access, complete <a href="https://aka.ms/oai/access" target="_blank">this form</a>. If you need assistance, open an issue on this repo to contact Microsoft.

Microsoft recommends that you [create an Azure Synapse workspace](../../../synapse-analytics/get-started-create-workspace.md). However, you can also use Azure Databricks, Azure HDInsight, Spark on Kubernetes, or the Python environment with the `pyspark` package.

## Use example code as a notebook

To use the example code in this article with your Apache Spark cluster, complete the following steps:

1. Prepare a new or existing notebook.
1. Connect your Apache Spark cluster with your notebook.
1. Install SynapseML for your Apache Spark cluster in your notebook.
1. Configure the notebook to work with your Azure OpenAI service resource.

### Step 1: Prepare your notebook

You can create a new notebook in your Apache Spark platform, or you can download an existing notebook and import it into Azure Synapse. You can add each snippet of example code in this article as a new cell in your notebook.

#### (Optional) Download demonstration notebook

As an option, you can download a demonstration notebook and connect it with your workspace.

1. Download [this demonstration notebook](https://github.com/microsoft/SynapseML/blob/master/docs/Explore%20Algorithms/OpenAI/OpenAI.ipynb). During the download process, select **Raw**, and then save the file. 

1. Import the notebook [into the Synapse Workspace](../../../synapse-analytics/spark/apache-spark-development-using-notebooks.md#create-a-notebook), or if you're using Azure Databricks, import the notebook [into the Azure Databricks Workspace](/azure/databricks/notebooks/notebooks-manage#create-a-notebook).

### Step 2: Connect your cluster

When you have a notebook ready, connect or _attach_ your notebook to an Apache Spark cluster.

### Step 3: Install SynapseML

To run the exercises, you need to install SynapseML on your Apache Spark cluster. You complete this task in a code cell at the top of your notebook. For more information about the installation process, see the link for Azure Synapse at the bottom of [the SynapseML website](https://microsoft.github.io/SynapseML/).

To install SynapseML, create a new cell at the top of your notebook and run the following code:

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

### Step 4: Configure the notebook

After the top cell in your notebook, add a new cell to configure the notebook for your service by running the following code. Set the `resource_name`, `deployment_name`, `location`, and `key` variables to the corresponding values for your Azure OpenAI resource.

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

The next step is to create a dataframe consisting of a series of rows, with one prompt per row.

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

To apply the Azure OpenAI Completion service to the dataframe, create an `OpenAICompletion` object that serves as a distributed client. Parameters of the service can be set either with a single value, or by a column of the dataframe with the appropriate setters on the `OpenAICompletion` object. In this example, you set the `maxTokens` parameter to 200. A token is around four characters, and this limit applies to the sum of the prompt and the result. You also set the `promptCol` parameter with the name of the prompt column in the dataframe.

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

After you have the dataframe and completion client, you can transform your input dataset and add a column called `completions` with all of the information the service adds. In this example, you select only the text for simplicity.

```python
from pyspark.sql.functions import col

completed_df = completion.transform(df).cache()
display(completed_df.select(
  col("prompt"), col("error"), col("completions.choices.text").getItem(0).alias("text")))
```

The following image shows example output with completions for the transformed dataframe in Azure Synapse Analytics Studio. Keep in mind that completions text can vary so your output might look different.

:::image type="content" source="../media/how-to/synapse-studio-transform-dataframe-output.png" alt-text="Screenshot that shows sample completions for the transformed dataframe in Azure Synapse Analytics Studio." border="false":::

## Explore other usage scenarios

Let's review some other use case scenarios for working with Azure OpenAI Service and large datasets.

### Improve throughput with request batching

You can use Azure OpenAI Service with large datasets to improve throughput with request batching. In the previous example, you make several requests to the service, one for each prompt. To complete multiple prompts in a single request, you can use batch mode.

In the `OpenAICompletion` object, instead of setting the **Prompt** column to "prompt," you can specify "batchPrompt" to create the **BatchPrompt** column. To support this method, you create a dataframe with a list of prompts per row.

> [!NOTE]
> There's currently a limit of 20 prompts in a single request and a limit of 2048 "tokens," or approximately 1500 words.

```python
batch_df = spark.createDataFrame(
    [
        (["The time has come", "Pleased to", "Today stocks", "Here's to"],),
        (["The only thing", "Ask not what", "Every litter", "I am"],),
    ]
).toDF("batchPrompt")
```

Next, you create the `OpenAICompletion` object. Rather than setting the "prompt" column, you set the "batchPrompt" column if your column is of type `Array[String]`.

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

The following image shows example output with completions for multiple prompts in a batch prompt request:

:::image type="content" source="../media/how-to/synapse-studio-request-batch-output.png" alt-text="Screenshot that shows completions for multiple prompts in a batch prompt request in Azure Synapse Analytics Studio." border="false":::

> [!NOTE]
> There's currently a limit of 20 prompts in a single request and a limit of 2048 "tokens," or approximately 1500 words.

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

The following image shows example output for an automatic mini-batcher that transposes data to row format:

:::image type="content" source="../media/how-to/synapse-studio-transpose-data-output.png" alt-text="Screenshot that shows completions for an automatic mini-batcher that transposes data to row format in Azure Synapse Analytics Studio." border="false":::

### Prompt engineering for translation

Azure OpenAI can solve many different natural language tasks through [prompt engineering](completions.md). In this example, you can prompt for language translation:

```python
translate_df = spark.createDataFrame(
    [
        ("Japanese: Ookina hako \nEnglish: Big box \nJapanese: Midori tako\nEnglish:",),
        ("French: Quelle heure est-il à Montréal? \nEnglish: What time is it in Montreal? \nFrench: Où est le poulet? \nEnglish:",),
    ]
).toDF("prompt")

display(completion.transform(translate_df))
```

The following image shows example output for language translation prompts:

:::image type="content" source="../media/how-to/synapse-studio-language-translation-output.png" alt-text="Screenshot that shows completions for language translation prompts in Azure Synapse Analytics Studio." border="false":::

### Prompt for question answering

Azure OpenAI also supports prompting the GPT-3 model for general-knowledge question answering:

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

The following image shows example output when you prompt the GPT-3 model to create general-knowledge question answering:

:::image type="content" source="../media/how-to/synapse-studio-question-answer-output.png" alt-text="Screenshot that shows completions for prompting the GPT-3 model to create general-knowledge question answering in Azure Synapse Analytics Studio." border="false":::

## Next steps

- Learn how to work with the [GPT-35-Turbo and GPT-4 models](/azure/ai-services/openai/how-to/chatgpt?pivots=programming-language-chat-completions).
- Learn more about the [Azure OpenAI Service models](../concepts/models.md).
