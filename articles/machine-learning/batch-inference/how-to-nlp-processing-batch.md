---
title: "Text processing with batch deployments"
titleSuffix: Azure Machine Learning
description: Learn how to use batch deployments to process text and output results.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to
author: santiagxf
ms.author: fasantia
ms.date: 10/10/2022
ms.reviewer: mopeakande
ms.custom: devplatv2
---

# Text processing with batch deployments

[!INCLUDE [cli v2](../../../includes/machine-learning-dev-v2.md)]

Batch Endpoints can be used for processing tabular data, but also any other file type like text. Those deployments are supported in both MLflow and custom models. In this tutorial we will learn how to deploy a model that can perform text summarization of long sequences of text using a model from HuggingFace.

## About this sample

The model we are going to work with was built using the popular library transformers from HuggingFace along with [a pre-trained model from Facebook with the BART architecture](https://huggingface.co/facebook/bart-large-cnn). It was introduced in the paper [BART: Denoising Sequence-to-Sequence Pre-training for Natural Language Generation](https://arxiv.org/abs/1910.13461). This model has the following constrains that are important to keep in mind for deployment:

* It can work with sequences up to 1024 tokens.
* It is trained for summarization of text in English.
* We are going to use TensorFlow as a backend.

The information in this article is based on code samples contained in the [azureml-examples](https://github.com/azure/azureml-examples) repository. To run the commands locally without having to copy/paste YAML and other files, clone the repo and then change directories to the `cli/endpoints/batch` if you are using the Azure CLI or `sdk/endpoints/batch` if you are using our SDK for Python.

```azurecli
git clone https://github.com/Azure/azureml-examples --depth 1
cd azureml-examples/cli/endpoints/batch
```

### Follow along in Jupyter Notebooks

You can follow along this sample in a Jupyter Notebook. In the cloned repository, open the notebook: [text-summarization-batch.ipynb](https://github.com/Azure/azureml-examples/blob/main/sdk/python/endpoints/batch/text-summarization-batch.ipynb).

## Prerequisites

[!INCLUDE [basic cli prereqs](../../../includes/machine-learning-cli-prereqs.md)]

* You must have an endpoint already created. If you don't please follow the instructions at [Use batch endpoints for batch scoring](how-to-use-batch-endpoint.md). This example assumes the endpoint is named `text-summarization-batch`.
* You must have a compute created where to deploy the deployment. If you don't please follow the instructions at [Create compute](how-to-use-batch-endpoint.md#create-compute). This example assumes the name of the compute is `cpu-cluster`.
* Due to the size of the model, it hasn't been included in this repository. Instead, you can generate a local copy with the following code. A local copy of the model will be placed at `bart-text-summarization/model`. We will use it during the course of this tutorial.

   ```python
   from transformers import pipeline

   model = pipeline("summarization", model="facebook/bart-large-cnn")
   model_local_path = 'bart-text-summarization/model'
   summarizer.save_pretrained(model_local_path)
   ```

## NLP tasks with batch deployments

In this example, we are going to learn how to deploy a deep learning model based on the BART architecture that can perform text summarization over text in English. The text will be placed in CSV files for convenience. 

### Registering the model

Batch Endpoint can only deploy registered models. In this case, we need to publish the model we have just downloaded from HuggingFace. You can skip this step if the model you are trying to deploy is already registered.
   
# [Azure ML CLI](#tab/cli)

```bash
MODEL_NAME='bart-text-summarization'
az ml model create --name $MODEL_NAME --type "custom_model" --path "bart-text-summarization/model"
```

# [Azure ML SDK for Python](#tab/sdk)

```python
model_name = 'bart-text-summarization'
model = ml_client.models.create_or_update(
    Model(name=model_name, path='bart-text-summarization/model', type=AssetTypes.CUSTOM_MODEL)
)
```
---

### Creating a scoring script

We need to create a scoring script that can read the CSV files provided by the batch deployment and return the scores of the model with the summary. The following script does the following:

> [!div class="checklist"]
> * Indicates an `init` function that load the model using `transformers`. Notice that the tokenizer of the model is loaded separately to account for the limitation in the sequence lenghs of the model we are currently using.
> * Indicates a `run` function that is executed for each mini-batch the batch deployment provides.
> * The `run` function read the entire batch using the `datasets` library. The text we need to summarize is on the column `text`.
> * The `run` method iterates over each of the rows of the text and run the prediction. Since this is a very expensive model, running the prediction over entire files will result in an out-of-memory exception. Notice that the model is not execute with the `pipeline` object from `transformers`. This is done to account for long sequences of text and the limitation of 1024 tokens in the underlying model we are using.
> * It returns the summary of the provided text.

__transformer_scorer.py__

```python
import os
import numpy as np
from transformers import pipeline, AutoTokenizer, TFBartForConditionalGeneration
from datasets import load_dataset

def init():
    global model
    global tokenizer

    # AZUREML_MODEL_DIR is an environment variable created during deployment
    # Change "model" to the name of the folder used by you model, or model file name.
    model_path = os.path.join(os.environ["AZUREML_MODEL_DIR"], "model")

    # load the model
    tokenizer = AutoTokenizer.from_pretrained(model_path, truncation=True, max_length=1024)
    model = TFBartForConditionalGeneration.from_pretrained(model_path)

def run(mini_batch):
    resultList = []

    ds = load_dataset('csv', data_files={ 'score': mini_batch})
    for text in ds['score']['text']:
        # perform inference
        input_ids = tokenizer.batch_encode_plus([text], truncation=True, padding=True, max_length=1024)['input_ids']
        summary_ids = model.generate(input_ids, max_length=130, min_length=30, do_sample=False)
        summaries = [tokenizer.decode(s, skip_special_tokens=True, clean_up_tokenization_spaces=False) for s in summary_ids]

        # Get results:
        resultList.append(summaries[0])

    return resultList
```

> [!TIP]
> Although files are provided in mini-batches by the deployment, this scoring script processes one row at a time. This is a common pattern when dealing with expensive models (like transformers) as trying to load the entire batch and send it to the model at once may result in high-memory pressure on the batch executor (OOM exeptions).


### Creating the deployment

One the scoring script is created, it's time to create a batch deployment for it. Follow the following steps to create it:

1. We need to indicate over which environment we are going to run the deployment. In our case, our model runs on `TensorFlow`. Azure Machine Learning already has an environment with the required software installed, so we can reutilize this environment. We are just going to add a couple of dependencies in a `conda.yml` file including the libraries `transformers` and `datasets`.

   # [Azure ML CLI](#tab/cli)
   
   No extra step is required for the Azure ML CLI. The environment definition will be included in the deployment file.
   
   # [Azure ML SDK for Python](#tab/sdk)
   
   Let's get a reference to the environment:
   
   ```python
   environment = Environment(
       conda_file="./bart-text-summarization/environment/conda.yml",
       image="mcr.microsoft.com/azureml/tensorflow-2.4-ubuntu18.04-py37-cpu-inference:latest",
   )
   ```

2. Now, let create the deployment.

   > [!NOTE]
   > This example assumes you have an endpoint created with the name `text-summarization-batch` and a compute cluster with name `cpu-cluster`. If you don't, please follow the steps in the doc [Use batch endpoints for batch scoring](how-to-use-batch-endpoint.md).

   # [Azure ML CLI](#tab/cli)
   
   To create a new deployment under the created endpoint, create a `YAML` configuration like the following:
   
   ```yaml
   $schema: https://azuremlschemas.azureedge.net/latest/batchDeployment.schema.json
   endpoint_name: text-summarization-batch
   name: text-summarization-hfbart
   description: A text summarization deployment implemented with HuggingFace and BART architecture
   model: azureml:bart-text-summarization@latest
   compute: azureml:cpu-cluster
   environment:
      image: mcr.microsoft.com/azureml/tensorflow-2.4-ubuntu18.04-py37-cpu-inference:latest
      conda_file: ./bart-text-summarization/environment/conda.yml
   code_configuration:
     code: ./bart-text-summarization/code/
     scoring_script: transformer_scorer.py
   resources:
     instance_count: 2
   max_concurrency_per_instance: 1
   mini_batch_size: 1
   output_action: append_row
   output_file_name: predictions.csv
   retry_settings:
     max_retries: 3
     timeout: 3000
   error_threshold: -1
   logging_level: info
   ```
  
   Then, create the deployment with the following command:
   
   ```bash
   DEPLOYMENT_NAME="text-summarization-hfbart"
   az ml batch-deployment create -f endpoint.yml
   ```
   
   # [Azure ML SDK for Python](#tab/sdk)
   
   To create a new deployment with the indicated environment and scoring script use the following code:
   
   ```python
   deployment = BatchDeployment(
       name="text-summarization-hfbart",
       description="A text summarization deployment implemented with HuggingFace and BART architecture",
       endpoint_name=endpoint.name,
       model=model,
       environment=environment,
       code_configuration=CodeConfiguration(
           code="./bart-text-summarization/code/",
           scoring_script="imagenet_scorer.py",
       ),
       compute=compute_name,
       instance_count=2,
       max_concurrency_per_instance=1,
       mini_batch_size=1,
       output_action=BatchDeploymentOutputAction.APPEND_ROW,
       output_file_name="predictions.csv",
       retry_settings=BatchRetrySettings(max_retries=3, timeout=3000),
       logging_level="info",
   )
   ```
   
   Then, create the deployment with the following command:
   
   ```python
   ml_client.batch_deployments.begin_create_or_update(deployment)
   ```
   ---
   
   > [!IMPORTANT]
   > You will notice in this deployment a high value in `timeout` in the parameter `retry_settings`. The reason for it is due to the nature of the model we are running. This is a very expensive model and inference on a single row may take up to 60 seconds. The `timeout` parameters controls how much time the Batch Deployment should wait for the scoring script to finish processing each mini-batch. Since our model runs predictions row by row, processing a long file may take time. Also notice that the number of files per batch is set to 1 (`mini_batch_size=1`). This is again related to the nature of the work we are doing. Processing one file at a time per batch is expensive enough to justify it. You will notice this being a pattern in NLP processing.

3. Although you can invoke a specific deployment inside of an endpoint, you will usually want to invoke the endpoint itself and let the endpoint decide which deployment to use. Such deployment is named the "default" deployment. This gives you the possibility of changing the default deployment and hence changing the model serving the deployment without changing the contract with the user invoking the endpoint. Use the following instruction to update the default deployment:

   # [Azure ML CLI](#tab/cli)
   
   ```bash
   az ml batch-endpoint update --name $ENDPOINT_NAME --set defaults.deployment_name=$DEPLOYMENT_NAME
   ```
   
   # [Azure ML SDK for Python](#tab/sdk)
   
   ```python
   endpoint.defaults.deployment_name = deployment.name
   ml_client.batch_endpoints.begin_create_or_update(endpoint)
   ```

4. At this point, our batch endpoint is ready to be used. 


## Considerations when deploying models that process text

As mentioned in some of the notes along this tutorial, processing text may have some peculiarities that require specific configuration for batch deployments. Take the following consideration when designing the batch deployment:

> [!div class="checklist"]
> * Some NLP models may be very expensive in terms of memory and compute time. If this is the case, consider decreasing the number of files included on each mini-batch. In the example above, the number was taken to the minimum, 1 file per batch. While this may not be your case, take into consideration how many files your model can score at each time. Have in mind that the relationship between the size of the input and the memory footprint of your model may not be linear for deep learning models.
> * If your model can't even handle one file at a time (like in this example), consider reading the input data in rows/chunks. Implement batching at the row level if you need to achieve higher throughput or hardware utilization.
> * Set the `timeout` value of your deployment accordly to how expensive your model is and how much data you expect to process. Remember that the `timeout` indicates the time the batch deployment would wait for your scoring script to run for a given batch. If your batch have many files or files with many rows, this will impact the right value of this parameter.

## Considerations for MLflow models that process text

MLflow models in Batch Endpoints support reading CSVs as input data, which may contain long sequences of text. The same considerations mentioned above apply to MLflow models. However, since you are not required to provide a scoring script for your MLflow model deployment, some of the recommendation there may be harder to achieve. 

* Only `CSV` files are supported for MLflow deployments processing text. You will need to author a scoring script if you need to process other file types like `TXT`, `PARQUET`, etc. See [Using MLflow models with a scoring script](how-to-mlflow-batch.md#using-mlflow-models-with-a-scoring-script) for details.
* Batch deployments will call your MLflow model's predict function with the content of an entire file in as Pandas dataframe. If your input data contains many rows, chances are that running a complex model (like the one presented in this tutorial) will result in an out-of-memory exception. If this is your case, you can consider:
   * Customize how your model runs predictions and implement batching. To learn how to customize MLflow model's inference, see [Logging custom models](../how-to-log-mlflow-models.md?#logging-custom-models).
   * Author a scoring script and load your model using `mlflow.<flavor>.load_model()`. See [Using MLflow models with a scoring script](how-to-mlflow-batch.md#using-mlflow-models-with-a-scoring-script) for details.


