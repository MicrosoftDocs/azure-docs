---
title: "Deploy and run language models in batch endpoints"
titleSuffix: Azure Machine Learning
description: Learn how to use batch deployments to process text with large language models.
services: machine-learning
ms.service: machine-learning
ms.subservice: inferencing
ms.topic: how-to
author: santiagxf
ms.author: fasantia
ms.date: 10/10/2022
ms.reviewer: mopeakande
ms.custom: devplatv2
---

# Deploy language models in batch endpoints

[!INCLUDE [cli v2](includes/machine-learning-dev-v2.md)]

Batch Endpoints can be used to deploy expensive models, like language models, over text data. In this tutorial, you learn how to deploy a model that can perform text summarization of long sequences of text using a model from HuggingFace. It also shows how to do inference optimization using HuggingFace `optimum` and `accelerate` libraries.

## About this sample

The model we are going to work with was built using the popular library transformers from HuggingFace along with [a pre-trained model from Facebook with the BART architecture](https://huggingface.co/facebook/bart-large-cnn). It was introduced in the paper [BART: Denoising Sequence-to-Sequence Pre-training for Natural Language Generation](https://arxiv.org/abs/1910.13461). This model has the following constraints, which are important to keep in mind for deployment:

* It can work with sequences up to 1024 tokens.
* It is trained for summarization of text in English.
* We are going to use Torch as a backend.

[!INCLUDE [machine-learning-batch-clone](includes/azureml-batch-clone-samples.md)]

The files for this example are in:

```azurecli
cd endpoints/batch/deploy-models/huggingface-text-summarization
```

### Follow along in Jupyter Notebooks

You can follow along this sample in a Jupyter Notebook. In the cloned repository, open the notebook: [text-summarization-batch.ipynb](https://github.com/Azure/azureml-examples/blob/main/sdk/python/endpoints/batch/deploy-models/huggingface-text-summarization/text-summarization-batch.ipynb).

## Prerequisites

[!INCLUDE [machine-learning-batch-prereqs](includes/azureml-batch-prereqs.md)]

### Registering the model

Due to the size of the model, it hasn't been included in this repository. Instead, you can download a copy from the HuggingFace model's hub. You need the packages `transformers` and `torch` installed in the environment you are using.

```python
%pip install transformers torch
```

Use the following code to download the model to a folder `model`:

```python
from transformers import pipeline

model = pipeline("summarization", model="facebook/bart-large-cnn")
model_local_path = 'model'
summarizer.save_pretrained(model_local_path)
```

We can now register this model in the Azure Machine Learning registry:
   
# [Azure CLI](#tab/cli)

```azurecli
MODEL_NAME='bart-text-summarization'
az ml model create --name $MODEL_NAME --path "model"
```

# [Python](#tab/python)

```python
model_name = 'bart-text-summarization'
model = ml_client.models.create_or_update(
    Model(name=model_name, path='model', type=AssetTypes.CUSTOM_MODEL)
)
```
---

## Creating the endpoint

We are going to create a batch endpoint named `text-summarization-batch` where to deploy the HuggingFace model to run text summarization on text files in English.

1. Decide on the name of the endpoint. The name of the endpoint ends-up in the URI associated with your endpoint. Because of that, __batch endpoint names need to be unique within an Azure region__. For example, there can be only one batch endpoint with the name `mybatchendpoint` in `westus2`.

    # [Azure CLI](#tab/cli)
    
    In this case, let's place the name of the endpoint in a variable so we can easily reference it later.
    
    ```azurecli
    ENDPOINT_NAME="text-summarization-batch"
    ```
    
    # [Python](#tab/python)
    
    In this case, let's place the name of the endpoint in a variable so we can easily reference it later.

    ```python
    endpoint_name="text-summarization-batch"
    ```

1. Configure your batch endpoint

    # [Azure CLI](#tab/cli)

    The following YAML file defines a batch endpoint:
    
    __endpoint.yml__

    :::code language="yaml" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/huggingface-text-summarization/endpoint.yml":::
    
    # [Python](#tab/python)
    
    ```python
    endpoint = BatchEndpoint(
        name=endpoint_name,
        description="A batch endpoint for summarizing text using a HuggingFace transformer model.",
    )
    ```
    
1. Create the endpoint:

   # [Azure CLI](#tab/cli)

   :::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/huggingface-text-summarization/deploy-and-run.sh" ID="create_endpoint" :::

   # [Python](#tab/python)

   ```python
   ml_client.batch_endpoints.begin_create_or_update(endpoint)
   ```

## Creating the deployment

Let's create the deployment that hosts the model:

1. We need to create a scoring script that can read the CSV files provided by the batch deployment and return the scores of the model with the summary. The following script performs these actions:

   > [!div class="checklist"]
   > * Indicates an `init` function that detects the hardware configuration (CPU vs GPU) and loads the model accordingly. Both the model and the tokenizer are loaded in global variables. We are not using a `pipeline` object from HuggingFace to account for the limitation in the sequence lenghs of the model we are currently using.
   > * Notice that we are doing performing **model optimizations** to improve the performance using `optimum` and `accelerate` libraries. If the model or hardware doesn't support it, we will run the deployment without such optimizations.
   > * Indicates a `run` function that is executed for each mini-batch the batch deployment provides.
   > * The `run` function read the entire batch using the `datasets` library. The text we need to summarize is on the column `text`.
   > * The `run` method iterates over each of the rows of the text and run the prediction. Since this is a very expensive model, running the prediction over entire files will result in an out-of-memory exception. Notice that the model is not execute with the `pipeline` object from `transformers`. This is done to account for long sequences of text and the limitation of 1024 tokens in the underlying model we are using.
   > * It returns the summary of the provided text.

   __code/batch_driver.py__

   :::code language="python" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/huggingface-text-summarization/code/batch_driver.py" :::

   > [!TIP]
   > Although files are provided in mini-batches by the deployment, this scoring script processes one row at a time. This is a common pattern when dealing with expensive models (like transformers) as trying to load the entire batch and send it to the model at once may result in high-memory pressure on the batch executor (OOM exeptions).

1. We need to indicate over which environment we are going to run the deployment. In our case, our model runs on `Torch` and it requires the libraries `transformers`, `accelerate`, and `optimum` from HuggingFace. Azure Machine Learning already has an environment with Torch and GPU support available. We are just going to add a couple of dependencies in a `conda.yaml` file.

   __environment/torch200-conda.yaml__

   :::code language="yaml" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/huggingface-text-summarization/environment/torch200-conda.yaml" :::
   
1. We can use the conda file mentioned before as follows:

   # [Azure CLI](#tab/cli)
   
   The environment definition is included in the deployment file.
   
   __deployment.yml__
   
   :::code language="yaml" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/huggingface-text-summarization/deployment.yml" range="7-10" :::
   
   # [Python](#tab/python)
   
   Let's get a reference to the environment:
   
   ```python
   environment = Environment(
       name="torch200-transformers-gpu",
       conda_file="environment/torch200-conda.yaml",
       image="mcr.microsoft.com/azureml/openmpi4.1.0-cuda11.8-cudnn8-ubuntu22.04:latest",
   )
   ```
   ---
   
   > [!IMPORTANT]
   > The environment `torch200-transformers-gpu` we've created requires a CUDA 11.8 compatible hardware device to run Torch 2.0 and Ubuntu 20.04. If your GPU device doesn't support this version of CUDA, you can check the alternative `torch113-conda.yaml` conda environment (also available on the repository), which runs Torch 1.3 over Ubuntu 18.04 with CUDA 10.1. However, acceleration using the `optimum` and `accelerate` libraries won't be supported on this configuration.
   
1. Each deployment runs on compute clusters. They support both [Azure Machine Learning Compute clusters (AmlCompute)](./how-to-create-attach-compute-cluster.md) or [Kubernetes clusters](./how-to-attach-kubernetes-anywhere.md). In this example, our model can benefit from GPU acceleration, which is why we use a GPU cluster.

   # [Azure CLI](#tab/cli)

   :::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/huggingface-text-summarization/deploy-and-run.sh" ID="create_compute" :::

   # [Python](#tab/python)

   ```python
   compute_name = "gpu-cluster"
   compute_cluster = AmlCompute(
       name=compute_name,
       description="GPU cluster compute",
       size="Standard_NV6",
       min_instances=0,
       max_instances=2,
   )
   ml_client.begin_create_or_update(compute_cluster)
   ```
   ---

   > [!NOTE]
   > You are not charged for compute at this point as the cluster remains at 0 nodes until a batch endpoint is invoked and a batch scoring job is submitted. Learn more about [manage and optimize cost for AmlCompute](./how-to-manage-optimize-cost.md#use-azure-machine-learning-compute-cluster-amlcompute).

1. Now, let's create the deployment.

   # [Azure CLI](#tab/cli)
   
   To create a new deployment under the created endpoint, create a `YAML` configuration like the following. You can check the [full batch endpoint YAML schema](reference-yaml-endpoint-batch.md) for extra properties.
   
   __deployment.yml__
   
   :::code language="yaml" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/huggingface-text-summarization/deployment.yml" :::
  
   Then, create the deployment with the following command:
   
   :::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/huggingface-text-summarization/deploy-and-run.sh" ID="create_deployment" :::
   
   # [Python](#tab/python)
   
   To create a new deployment with the indicated environment and scoring script use the following code:
   
   ```python
   deployment = BatchDeployment(
       name="text-summarization-hfbart",
       description="A text summarization deployment implemented with HuggingFace and BART architecture",
       endpoint_name=endpoint.name,
       model=model,
       environment=environment,
       code_configuration=CodeConfiguration(
           code="code",
           scoring_script="batch_driver.py",
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

1. Although you can invoke a specific deployment inside of an endpoint, you usually want to invoke the endpoint itself and let the endpoint decide which deployment to use. Such deployment is named the "default" deployment. This gives you the possibility of changing the default deployment and hence changing the model serving the deployment without changing the contract with the user invoking the endpoint. Use the following instruction to update the default deployment:

   # [Azure CLI](#tab/cli)
   
   ```azurecli
   DEPLOYMENT_NAME="text-summarization-hfbart"
   az ml batch-endpoint update --name $ENDPOINT_NAME --set defaults.deployment_name=$DEPLOYMENT_NAME
   ```
   
   # [Python](#tab/python)
   
   ```python
   endpoint.defaults.deployment_name = deployment.name
   ml_client.batch_endpoints.begin_create_or_update(endpoint)
   ```

4. At this point, our batch endpoint is ready to be used. 


## Testing out the deployment

For testing our endpoint, we are going to use a sample of the dataset [BillSum: A Corpus for Automatic Summarization of US Legislation](https://arxiv.org/abs/1910.00523). This sample is included in the repository in the folder `data`. Notice that the format of the data is CSV and the content to be summarized is under the column `text`, as expected by the model.
   
1. Let's invoke the endpoint:

   # [Azure CLI](#tab/cli)
   
   :::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/huggingface-text-summarization/deploy-and-run.sh" ID="start_batch_scoring_job" :::
   
   > [!NOTE]
   > The utility `jq` may not be installed on every installation. You can get instructions in [this link](https://stedolan.github.io/jq/download/).
   
   # [Python](#tab/python)
   
   ```python
   input = Input(type=AssetTypes.URI_FOLDER, path="data")
   job = ml_client.batch_endpoints.invoke(
      endpoint_name=endpoint.name,
      input=input,
   )
   ```
   ---
   
   > [!TIP]
   > Notice that by indicating a local path as an input, the data is uploaded to Azure Machine Learning default's storage account.

4. A batch job is started as soon as the command returns. You can monitor the status of the job until it finishes:

   # [Azure CLI](#tab/cli)
   
   :::code language="azurecli" source="~/azureml-examples-main/cli/endpoints/batch/deploy-models/huggingface-text-summarization/deploy-and-run.sh" ID="show_job_in_studio" :::
   
   # [Python](#tab/python)
   
   ```python
   ml_client.jobs.get(job.name)
   ```

5. Once the deployment is finished, we can download the predictions:

   # [Azure CLI](#tab/cli)

   To download the predictions, use the following command:

   ```azurecli
   az ml job download --name $JOB_NAME --output-name score --download-path .
   ```

   # [Python](#tab/python)

   ```python
   ml_client.jobs.download(name=job.name, output_name='score', download_path='./')
   ```

## Considerations when deploying models that process text

As mentioned in some of the notes along this tutorial, processing text may have some peculiarities that require specific configuration for batch deployments. Take the following consideration when designing the batch deployment:

> [!div class="checklist"]
> * Some NLP models may be very expensive in terms of memory and compute time. If this is the case, consider decreasing the number of files included on each mini-batch. In the example above, the number was taken to the minimum, 1 file per batch. While this may not be your case, take into consideration how many files your model can score at each time. Have in mind that the relationship between the size of the input and the memory footprint of your model may not be linear for deep learning models.
> * If your model can't even handle one file at a time (like in this example), consider reading the input data in rows/chunks. Implement batching at the row level if you need to achieve higher throughput or hardware utilization.
> * Set the `timeout` value of your deployment accordly to how expensive your model is and how much data you expect to process. Remember that the `timeout` indicates the time the batch deployment would wait for your scoring script to run for a given batch. If your batch have many files or files with many rows, this impacts the right value of this parameter.

## Considerations for MLflow models that process text

The same considerations mentioned above apply to MLflow models. However, since you are not required to provide a scoring script for your MLflow model deployment, some of the recommendations mentioned may require a different approach. 

* MLflow models in Batch Endpoints support reading tabular data as input data, which may contain long sequences of text. See [File's types support](how-to-mlflow-batch.md#files-types-support) for details about which file types are supported.
* Batch deployments calls your MLflow model's predict function with the content of an entire file in as Pandas dataframe. If your input data contains many rows, chances are that running a complex model (like the one presented in this tutorial) results in an out-of-memory exception. If this is your case, you can consider:
   * Customize how your model runs predictions and implement batching. To learn how to customize MLflow model's inference, see [Logging custom models](how-to-log-mlflow-models.md?#logging-custom-models).
   * Author a scoring script and load your model using `mlflow.<flavor>.load_model()`. See [Using MLflow models with a scoring script](how-to-mlflow-batch.md#customizing-mlflow-models-deployments-with-a-scoring-script) for details.


