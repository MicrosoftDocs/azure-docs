---
title: 'Customize a model with Azure OpenAI Service and the Python SDK'
titleSuffix: Azure OpenAI
description: Learn how to create your own customized model with Azure OpenAI Service by using the Python SDK.
services: cognitive-services
manager: nitinme
ms.service: azure-ai-openai
ms.topic: include
ms.date: 09/01/2023
author: ChrisHMSFT
ms.author: chrhoder
keywords: 
---

<a href="https://github.com/openai/openai-python" target="_blank">Library source code</a> | <a href="https://pypi.org/project/openai/" target="_blank">Package (PyPi)</a> |

- An Azure subscription. <a href="https://azure.microsoft.com/free/cognitive-services" target="_blank">Create one for free</a>.
- Access granted to Azure OpenAI in the desired Azure subscription.
- An Azure OpenAI resource. For more information, see [Create a resource and deploy a model with Azure OpenAI](../how-to/create-resource.md).
- The following Python libraries: `os`, `json`.

> [!NOTE]
> Currently, you must submit an application to access Azure OpenAI Service. To apply for access, complete [this form](https://aka.ms/oai/access). If you need assistance, open an issue on this repo to contact Microsoft.

## Review the workflow for the Python SDK

Take a moment to review the fine-tuning workflow for using the Python SDK with Azure OpenAI:

1. Prepare your training and validation data.
1. Select a base model.
1. Upload your training data.
1. Train your new customized model.
1. Check the status of your customized model.
1. Deploy your customized model for use.
1. Use your customized model.
1. Optionally, analyze your customized model for performance and fit.

## Prepare your training and validation data

Your training data and validation data sets consist of input and output examples for how you would like the model to perform.

The training and validation data you use **must** be formatted as a JSON Lines (JSONL) document in which each line represents a single prompt-completion pair. The OpenAI command-line interface (CLI) includes [a data preparation tool](#openai-cli-data-preparation-tool) that validates, gives suggestions, and reformats your training data into a JSONL file ready for fine-tuning.

Here's an example of the training data format:

```json
{"prompt": "<prompt text>", "completion": "<ideal generated text>"}
{"prompt": "<prompt text>", "completion": "<ideal generated text>"}
{"prompt": "<prompt text>", "completion": "<ideal generated text>"}
```

In addition to the JSONL format, training and validation data files must be encoded in UTF-8 and include a byte-order mark (BOM). The file must be less than 200 MB in size. For more information about formatting your training data, see [Learn how to prepare your dataset for fine-tuning](../how-to/prepare-dataset.md).

### Create your training and validation datasets

Designing your prompts and completions for fine-tuning is different from designing your prompts for use with any of [our GPT-3 base models](../concepts/legacy-models.md#gpt-3-models). Prompts for completion calls often use either detailed instructions or few-shot learning techniques, and consist of multiple examples. For fine-tuning, each training example should consist of a single input prompt and its desired completion output. You don't need to give detailed instructions or multiple completion examples for the same prompt.

The more training examples you have, the better. It's a best practice to have at least 200 training examples. In general, doubling the dataset size leads to a linear increase in model quality.

For more information about preparing training data for various tasks, see [Learn how to prepare your dataset for fine-tuning](../how-to/prepare-dataset.md).

### Use the OpenAI CLI data preparation tool

We recommend that you use OpenAI's CLI to assist with many of the data preparation steps. OpenAI has developed a tool that validates, gives suggestions, and reformats your data into a JSONL file ready for fine-tuning.

To install the OpenAI CLI, run the following Python command:

```console
pip install --upgrade openai 
```

To analyze your training data with the data preparation tool, run the following Python command. Replace the `<LOCAL_FILE>` parameter with the full path and file name of the training data file you want to analyze:

```console
openai tools fine_tunes.prepare_data -f <LOCAL_FILE>
```

This tool accepts files in the following data formats, if they contain a prompt and a completion column/key:

- Comma-separated values (CSV)
- Tab-separated values (TSV)
- Microsoft Excel workbook (XLSX)
- JavaScript Object Notation (JSON)
- JSON Lines (JSONL)
 
The tool guides you through suggested changes for your training data. It reformats your data and saves the output into a JSONL file ready for fine-tuning.

## Select a base model

The first step in creating a customized model is to choose a base model. The choice influences both the performance and the cost of your model.

You can create a customized model from one of the following available base models:
- `ada`
- `babbage`
- `curie`
- `code-cushman-001` (Currently unavailable for new customers)
- `davinci` (Currently unavailable for new customers)

You can use the [Models API](/rest/api/cognitiveservices/azureopenaistable/models/list) to identify which models are fine-tunable. For more information about our base models, see [Azure OpenAI Service models](../concepts/models.md).

## Upload your training data

The next step is to either choose existing prepared training data or upload new prepared training data to use when customizing your model. After you prepare your training data, you can upload your files to the service. There are two ways to upload training data:

- [From a local file](/rest/api/cognitiveservices/azureopenaistable/files/upload)
- [Import from an Azure Blob store or other web location](/rest/api/cognitiveservices/azureopenaistable/files/import)

For large data files, we recommend that you import from an Azure Blob  store. Large files can become unstable when uploaded through multipart forms because the requests are atomic and can't be retried or resumed. For more information about Azure Blob storage, see [What is Azure Blob storage?](../../../storage/blobs/storage-blobs-overview.md)

> [!NOTE]
> Training data files must be formatted as JSONL files, encoded in UTF-8 with a byte-order mark (BOM). The file must be less than 200 MB in size.

The following Python example locally creates sample training and validation dataset files, then uploads the local files by using the Python SDK, and retrieves the returned file IDs. Make sure to save the IDs returned by the example because you need them for the fine-tuning training job creation.

> [!IMPORTANT]
> Remember to remove the key from your code when you're done, and never post it publicly. For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](../../../key-vault/general/overview.md). For more information, see the Azure AI services [security](../../security-features.md) article.

```python
import openai
from openai import cli
import time
import shutil
import json

# Provide the key for your Azure OpenAI resource.
# Remember to remove your key from your code when you're done.
openai.api_key = "<your-resource-key>"

# Provide the endpoint for your Azure OpenAI resource.
# Example: https://<your-resource-name>.openai.azure.com/
openai.api_base =  "<your-resource-endpoint>" 
openai.api_type = 'azure'

# Provide the API version.
# Note that the API version might change in the future.
openai.api_version = '2023-05-15'

training_file_name = 'training.jsonl'
validation_file_name = 'validation.jsonl'

sample_data = [{"prompt": "When I go to the store, I want an", "completion": "apple"},
    {"prompt": "When I go to work, I want a", "completion": "coffee"},
    {"prompt": "When I go home, I want a", "completion": "soda"}]

# Generate the training dataset file.
print(f'Generating the training file: {training_file_name}')
with open(training_file_name, 'w') as training_file:
    for entry in sample_data:
        json.dump(entry, training_file)
        training_file.write('\n')

# Copy the validation dataset file from the training dataset file.
# Typically, your training data and validation data should be mutually exclusive.
# For the purposes of this example, you use the same data.
print(f'Copying the training file to the validation file')
shutil.copy(training_file_name, validation_file_name)

def check_status(training_id, validation_id):
    train_status = openai.File.retrieve(training_id)["status"]
    valid_status = openai.File.retrieve(validation_id)["status"]
    print(f'Status (training_file | validation_file): {train_status} | {valid_status}')
    return (train_status, valid_status)

# Upload the training and validation dataset files to Azure OpenAI.
training_id = cli.FineTune._get_or_upload(training_file_name, True)
validation_id = cli.FineTune._get_or_upload(validation_file_name, True)

# Check the upload status of the training and validation dataset files.
(train_status, valid_status) = check_status(training_id, validation_id)

# Poll and display the upload status once per second until both files succeed or fail to upload.
while train_status not in ["succeeded", "failed"] or valid_status not in ["succeeded", "failed"]:
    time.sleep(1)
    (train_status, valid_status) = check_status(training_id, validation_id)
```

## Create a customized model

After you upload your training and validation files, you're ready to start the fine-tune job.

The following Python code shows an example of how to create a new fine-tune job with the Python SDK:

```python
# This example defines a fine-tune job that creates a customized model based on curie,
# with just a single pass through the training data. The job also provides
# classification-specific metrics by using our validation data, at the end of that epoch.
create_args = {
    "training_file": training_id,
    "validation_file": validation_id,
    "model": "curie",
    "n_epochs": 1,
    "compute_classification_metrics": True,
    "classification_n_classes": 3
}

# Create the fine-tune job and retrieve the job ID and status from the response.
resp = openai.FineTune.create(**create_args)
job_id = resp["id"]
status = resp["status"]

# You can use the job ID to monitor the status of the fine-tune job.
# The fine-tune job might take some time to start and complete.
print(f'Fine-tuning model with job ID: {job_id}.')
```

You can either use default values for the hyperparameters of the fine-tune job, or you can adjust those hyperparameters for your customization needs. In this example, you set the `n_epochs` hyperparameter to 1, indicating that you want just one full cycle through the training data. For more information about these hyperparameters, see [Create a Fine tune job](/rest/api/cognitiveservices/azureopenaistable/fine-tunes/create).

## Check the status of your customized model

After you start a fine-tune job, it can take some time to complete. Your job might be queued behind other jobs on the system. Training your model can take minutes or hours depending on the model and dataset size. The following Python example checks the status of your fine-tune job by retrieving information about your job by using the job ID returned from the previous example:

```python
# Get the status of our fine-tune job.
status = openai.FineTune.retrieve(id=job_id)["status"]

# If the job isn't yet done, poll it every 2 seconds.
if status not in ["succeeded", "failed"]:
    print(f'Job not in terminal status: {status}. Waiting.')
    while status not in ["succeeded", "failed"]:
        time.sleep(2)
        status = openai.FineTune.retrieve(id=job_id)["status"]
        print(f'Status: {status}')
else:
    print(f'Fine-tune job {job_id} finished with status: {status}')

# Check if there are other fine-tune jobs in the subscription. 
# Your fine-tune job might be queued, so this is helpful information to have
# if your fine-tune job hasn't yet started.
print('Checking other fine-tune jobs in the subscription.')
result = openai.FineTune.list()
print(f'Found {len(result)} fine-tune jobs.')
```

## Deploy a customized model

When the fine-tune job succeeds, the value of the `fine_tuned_model` variable in the response body of the `FineTune.retrieve()` method is set to the name of your customized model. Your model is now also available for discovery from the [list Models API](/rest/api/cognitiveservices/azureopenaistable/models/list). However, you can't issue completion calls to your customized model until your customized model is deployed. You must deploy your customized model to make it available for use with completion calls.

[!INCLUDE [Fine-tuning deletion](fine-tune.md)]

> [!NOTE]
> As with all applications, Microsoft requires a review process for your custom model before it's available live.

You can use either [Azure OpenAI](#deploy-a-model-with-azure-openai) or the [Azure CLI](#deploy-a-model-with-azure-cli) to deploy your customized model.

> [!NOTE]
> Only one deployment is permitted for a customized model. An error occurs if you select an already-deployed customized model.

### Deploy a model with Azure OpenAI

The following Python example shows how to use the deployment API included with Azure OpenAI to create a model deployment for your customized model. The deployment API generates a name for the deployment of your customized model.

```python
# Retrieve the name of the customized model from the fine-tune job.
result = openai.FineTune.retrieve(id=job_id)
if result["status"] == 'succeeded':
    model = result["fine_tuned_model"]

# Create the deployment for the customized model by using the standard scale type
# without specifying a scale capacity.
print(f'Creating a new deployment with model: {model}')
result = openai.Deployment.create(model=model, scale_settings={"scale_type":"standard", "capacity": None})

# Retrieve the deployment job ID from the results.
deployment_id = result["id"]
```

### Deploy a model with Azure CLI

The following example shows how to use the Azure CLI to deploy your customized model. With the Azure CLI, you must specify a name for the deployment of your customized model. For more information about how to use the Azure CLI to deploy customized models, see [az cognitiveservices account deployment](/cli/azure/cognitiveservices/account/deployment).

To run this Azure CLI command in a console window, you must replace the following _\<placeholders>_ with the corresponding values for your customized model:

| Placeholder | Value |
| --- | --- |
| _\<YOUR_AZURE_SUBSCRIPTION>_ | The name or ID of your Azure subscription. |
| _\<YOUR_RESOURCE_GROUP>_ | The name of your Azure resource group. |
| _\<YOUR_RESOURCE_NAME>_ | The name of your Azure OpenAI resource. |
| _\<YOUR_DEPLOYMENT_NAME>_ | The name you want to use for your model deployment. |
| _\<YOUR_FINE_TUNED_MODEL_ID>_ | The name of your customized model. | 

```console
az cognitiveservices account deployment create 
    --subscription <YOUR_AZURE_SUBSCRIPTION>
    --resource-group <YOUR_RESOURCE_GROUP>
    --name <YOUR_RESOURCE_NAME>  
    --deployment-name <YOUR_DEPLOYMENT_NAME>
    --model-name <YOUR_FINE_TUNED_MODEL_ID>
    --model-version "1" 
    --model-format OpenAI 
    --scale-settings-scale-type "Standard" 
```

## Use a deployed customized model

After your customized model is deployed, you can use it like any other deployed model. For example, you can send a completion call to your deployed model, as shown in the following Python example. You can continue to use the same parameters with your customized model, such as temperature and frequency penalty, as you can with other deployed models. 

```python
print('Sending a test completion job')
start_phrase = 'When I go to the store, I want a'
response = openai.Completion.create(engine=deployment_id, prompt=start_phrase, max_tokens=4)
text = response['choices'][0]['text'].replace('\n', '').replace(' .', '.').strip()
print(f'"{start_phrase} {text}"')
```

## Analyze your customized model

Azure OpenAI attaches a result file named _results.csv_ to each fine-tune job after it completes. You can use the result file to analyze the training and validation performance of your customized model. The file ID for the result file is listed for each customized model, and you can use the Python SDK to retrieve the file ID and download the result file for analysis.

The following Python example retrieves the file ID of the first result file attached to the fine-tune job for your customized model, and then uses the Python SDK to download the file to your working directory for analysis.

```python
# Retrieve the file ID of the first result file from the fine-tune job
# for the customized model.
result = openai.FineTune.retrieve(id=job_id)
if result["status"] == 'succeeded':
    result_file_id = result.result_files[0].id
    result_file_name = result.result_files[0].filename

# Download the result file.
print(f'Downloading result file: {result_file_id}')
# Write the byte array returned by the File.download() method to 
# a local file in the working directory.
with open(result_file_name, "wb") as file:
    result = openai.File.download(id=result_file_id)
    file.write(result)
```

The result file is a CSV file that contains a header row and a row for each training step performed by the fine-tune job. The result file contains the following columns:

| Column name | Description |
| --- | --- |
| `step` | The number of the training step. A training step represents a single pass, forward and backward, on a batch of training data. |
| `elapsed_tokens` | The number of tokens the customized model has seen so far, including repeats. |
| `elapsed_examples` | The number of examples the model has seen so far, including repeats.<br>Each example represents one element in that step's batch of training data. For example, if the `Batch size` parameter is set to 32 in the [**Advanced options** pane](#configure-advanced-options), this value increments by 32 in each training step. |
| `training_loss` | The loss for the training batch. |
| `training_sequence_accuracy` | The percentage of completions in the training batch for which the model's predicted tokens exactly matched the true completion tokens.<br>For example, if the batch size is set to 3 and your data contains completions `[[1, 2], [0, 5], [4, 2]]`, this value is set to 0.67 (2 of 3) if the model predicted `[[1, 1], [0, 5], [4, 2]]`. |
| `training_token_accuracy` | The percentage of tokens in the training batch correctly predicted by the model.<br>For example, if the batch size is set to 3 and your data contains completions `[[1, 2], [0, 5], [4, 2]]`, this value is set to 0.83 (5 of 6) if the model predicted `[[1, 1], [0, 5], [4, 2]]`. |
| `validation_loss` | The loss for the validation batch. |
| `validation_sequence_accuracy` | The percentage of completions in the validation batch for which the model's predicted tokens exactly matched the true completion tokens.<br>For example, if the batch size is set to 3 and your data contains completions `[[1, 2], [0, 5], [4, 2]]`, this value is set to 0.67 (2 of 3) if the model predicted `[[1, 1], [0, 5], [4, 2]]`. |
| `validation_token_accuracy` | The percentage of tokens in the validation batch correctly predicted by the model.<br>For example, if the batch size is set to 3 and your data contains completions `[[1, 2], [0, 5], [4, 2]]`, this value is set to 0.83 (5 of 6) if the model predicted `[[1, 1], [0, 5], [4, 2]]`. |

## Clean up your deployments, customized models, and training files

When you're done with your customized model, you can delete the deployment and model. You can also delete the training and validation files you uploaded to the service, if needed. 

### Delete your model deployment

[!INCLUDE [Fine-tuning deletion](fine-tune.md)]

You can use various methods to delete the deployment for your customized model:

- [Azure OpenAI Studio](../how-to/fine-tuning.md?pivots=programming-language-studio#delete-your-model-deployment)</a>
- The [Azure CLI](/cli/azure/cognitiveservices/account/deployment?preserve-view=true#az-cognitiveservices-account-deployment-delete)
- The Python SDK

The following Python example uses the Python SDK to delete the deployment for your customized model:

```python
# Delete the deployment for the customized model.
print(f'Deleting deployment ID: {deployment_id}')
result = openai.Deployment.delete(sid=deployment_id)
```

### Delete your customized model

Similarly, you can use various methods to delete your customized model:

- [Azure OpenAI Studio](../how-to/fine-tuning.md?pivots=programming-language-studio#delete-your-customized-model)
- The [REST APIs](/rest/api/cognitiveservices/azureopenaistable/fine-tunes/delete) 
- The Python SDK

> [!NOTE]
> You can't delete a customized model if it has an existing deployment. You must first [delete your model deployment](#delete-your-model-deployment) before you can delete your customized model.

The following Python example uses the Python SDK to delete the deployment for your customized model:

```python
# Delete the customized model.
print(f'Deleting customized model ID: {job_id}')
result = openai.FineTune.delete(sid=job_id)
```

### Delete your training files

You can optionally delete training and validation files that you uploaded for training, and result files generated during training, from your Azure OpenAI subscription. You can use the following methods to delete your training, validation, and result files:

- [Azure OpenAI Studio](../how-to/fine-tuning.md?pivots=programming-language-studio#delete-your-training-files)
- The [REST APIs](/rest/api/cognitiveservices/azureopenaistable/files/delete)
- The Python SDK

The following Python example uses the Python SDK to delete the training, validation, and result files for your customized model:

```python
print('Checking for existing uploaded files.')
results = []

# Get the complete list of uploaded files in our subscription.
files = openai.File.list().data
print(f'Found {len(files)} total uploaded files in the subscription.')

# Enumerate all uploaded files, extracting the file IDs for the
# files with file names that match your training dataset file and
# validation dataset file names.
for item in files:
    if item["filename"] in [training_file_name, validation_file_name, result_file_name]:
        results.append(item["id"])
print(f'Found {len(results)} already uploaded files that match our files')

# Enumerate the file IDs for our files and delete each file.
print(f'Deleting already uploaded files.')
for id in results:
    openai.File.delete(sid = id)
```

## Next steps

- Explore the fine-tuning capabilities in the [Azure OpenAI Service REST API reference](/azure/ai-services/openai/reference).
- Review other [Python SDK operations](https://github.com/openai/openai-python/blob/main/examples/azure/finetuning.ipynb).
