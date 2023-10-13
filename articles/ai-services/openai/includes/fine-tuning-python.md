---
title: 'Customize a model with Azure OpenAI Service and the Python SDK'
titleSuffix: Azure OpenAI
description: Learn how to create your own customized model with Azure OpenAI Service by using the Python SDK.
services: cognitive-services
manager: nitinme
ms.service: azure-ai-openai
ms.topic: include
ms.date: 10/10/2023
author: mrbullwinkle
ms.author: mbullwin
keywords: 
---

<a href="https://github.com/openai/openai-python" target="_blank">Library source code</a> | <a href="https://pypi.org/project/openai/" target="_blank">Package (PyPi)</a> |

- An Azure subscription. <a href="https://azure.microsoft.com/free/cognitive-services" target="_blank">Create one for free</a>.
- Access granted to Azure OpenAI in the desired Azure subscription.
- An Azure OpenAI resource. For more information, see [Create a resource and deploy a model with Azure OpenAI](../how-to/create-resource.md).
- The following Python libraries: `os`, `json`, `requests`, `openai`.
- The OpenAI Python library **should be at least version 0.28.1**.

> [!NOTE]
> Currently, you must submit an application to access Azure OpenAI Service. To apply for access, complete [this form](https://aka.ms/oai/access). 

## Models

The following models support fine-tuning:

- `gpt-35-turbo-0613`
- `babbage-002`
- `davinci-002`

Fine-tuning for `gpt-35-turbo-0613` is not available in every region where this model is available for inference. Consult the [models page](../concepts/models.md) to check which regions currently support fine-tuning.

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

### Prepare your training and validation data

Your training data and validation data sets consist of input and output examples for how you would like the model to perform.

Different model types require a different format of training data.

# [gpt-35-turbo 0613](#tab/turbo)

The training and validation data you use **must** be formatted as a JSON Lines (JSONL) document. For `gpt-35-turbo-0613` the fine-tuning dataset must be formatted in the conversational format that is used by the [Chat completions](../how-to/chatgpt.md) API.

### Example file format

```json
{"messages": [{"role": "system", "content": "You are an Xbox customer support agent whose primary goal is to help users with issues they are experiencing with their Xbox devices. You are friendly and concise. You only provide factual answers to queries, and do not provide answers that are not related to Xbox."}, {"role": "user", "content": "Is Xbox better than PlayStation?"}, {"role": "assistant", "content": "I apologize, but I cannot provide personal opinions. My primary job is to assist you with any issues related to your Xbox device. Do you have any Xbox-related issues that need addressing?"}]}
{"messages": [{"role": "system", "content": "You are an Xbox customer support agent whose primary goal is to help users with issues they are experiencing with their Xbox devices. You are friendly and concise. You only provide factual answers to queries, and do not provide answers that are not related to Xbox."}, {"role": "user", "content": "Can I play PC games on my Xbox?"}, {"role": "assistant", "content": "While Xbox consoles don't natively support PC games, they can play an array of Xbox games, many of which are also available on PC. Can I assist you with finding games compatible with your Xbox device?"}]}
{"messages": [{"role": "system", "content": "You are an Xbox customer support agent whose primary goal is to help users with issues they are experiencing with their Xbox devices. You are friendly and concise. You only provide factual answers to queries, and do not provide answers that are not related to Xbox."}, {"role": "user", "content": "I'm having trouble connecting my Xbox to the Wi-Fi."}, {"role": "assistant", "content": "No worries, let's go through the network settings on your Xbox. Can you please tell me what happens when you try to connect it to the Wi-Fi?"}]}
```

In addition to the JSONL format, training and validation data files must be encoded in UTF-8 and include a byte-order mark (BOM). The file must be less than 100 MB in size.

### Create your training and validation datasets

The more training examples you have, the better. The minimum number of training examples is 10, but such a small number of examples is often not enough to noticeably influence model responses. It's a best practice to have at least 200 high quality training examples. 

In general, doubling the dataset size can lead to a linear increase in model quality. But keep in mind, low quality examples can negatively impact performance. If you train the model on a large number of internal data, without first pruning the dataset for only the highest quality examples you could end up with a model that performs worse than expected.

# [babbage-002/davinci-002](#tab/completionfinetuning)

The training and validation data you use **must** be formatted as a JSON Lines (JSONL) document in which each line represents a single prompt-completion pair. The OpenAI command-line interface (CLI) includes [a data preparation tool](#openai-cli-data-preparation-tool) that validates, gives suggestions, and reformats your training data into a JSONL file ready for fine-tuning.

```json
{"prompt": "<prompt text>", "completion": "<ideal generated text>"}
{"prompt": "<prompt text>", "completion": "<ideal generated text>"}
{"prompt": "<prompt text>", "completion": "<ideal generated text>"}
```

In addition to the JSONL format, training and validation data files must be encoded in UTF-8 and include a byte-order mark (BOM). The file must be less than 100 MB in size. 

### Create your training and validation datasets

Designing your prompts and completions for fine-tuning is different from designing your prompts for use with any of [our GPT-3 base models](../concepts/legacy-models.md#gpt-3-models). Prompts for completion calls often use either detailed instructions or few-shot learning techniques, and consist of multiple examples. For fine-tuning, each training example should consist of a single input prompt and its desired completion output. You don't need to give detailed instructions or multiple completion examples for the same prompt.

The more training examples you have, the better. It's a best practice to have at least 200 training examples. In general, doubling the dataset size leads to a linear increase in model quality.

### OpenAI CLI data preparation tool

We recommend that you use OpenAI's CLI to assist with many of the data preparation steps. OpenAI has developed a tool that validates, gives suggestions, and reformats your data into a JSONL file ready for fine-tuning.

To install the OpenAI CLI, run the following Python command:

```console
pip install --upgrade openai 
```

To analyze your training data with the data preparation tool, run the following Python command. Replace the _\<LOCAL_FILE>_ argument with the full path and file name of the training data file to analyze:

```console
openai tools fine_tunes.prepare_data -f <LOCAL_FILE>
```

This tool accepts files in the following data formats, if they contain a prompt and a completion column/key:

- Comma-separated values (CSV)
- Tab-separated values (TSV)
- Microsoft Excel workbook (XLSX)
- JavaScript Object Notation (JSON)
- JSON Lines (JSONL)

After it guides you through the process of implementing suggested changes, the tool reformats your training data and saves output into a JSONL file ready for fine-tuning.

---

## Upload your training data

The next step is to either choose existing prepared training data or upload new prepared training data to use when customizing your model. After you prepare your training data, you can upload your files to the service. There are two ways to upload training data:

- [From a local file](/rest/api/cognitiveservices/azureopenaistable/files/upload)
- [Import from an Azure Blob store or other web location](/rest/api/cognitiveservices/azureopenaistable/files/import)

For large data files, we recommend that you import from an Azure Blob  store. Large files can become unstable when uploaded through multipart forms because the requests are atomic and can't be retried or resumed. For more information about Azure Blob storage, see [What is Azure Blob storage?](../../../storage/blobs/storage-blobs-overview.md)

> [!NOTE]
> Training data files must be formatted as JSONL files, encoded in UTF-8 with a byte-order mark (BOM). The file must be less than 200 MB in size.

The following Python example uploads local training and validation files by using the Python SDK, and retrieves the returned file IDs.

```python
# Upload fine-tuning files

import openai
import os

openai.api_key = os.getenv("AZURE_OPENAI_API_KEY") 
openai.api_base =  os.getenv("AZURE_OPENAI_ENDPOINT")
openai.api_type = 'azure'
openai.api_version = '2023-09-15-preview' # This API version or later is required to access fine-tuning for turbo/babbage-002/davinci-002

training_file_name = 'training_set.jsonl'
validation_file_name = 'validation_set.jsonl'

# Upload the training and validation dataset files to Azure OpenAI with the SDK.

training_response = openai.File.create(
    file=open(training_file_name, "rb"), purpose="fine-tune", user_provided_filename="training_set.jsonl"
)
training_file_id = training_response["id"]

validation_response = openai.File.create(
    file=open(validation_file_name, "rb"), purpose="fine-tune", user_provided_filename="validation_set.jsonl"
)
validation_file_id = validation_response["id"]

print("Training file ID:", training_file_id)
print("Validation file ID:", validation_file_id)
```

## Create a customized model

After you upload your training and validation files, you're ready to start the fine-tuning job.

The following Python code shows an example of how to create a new fine-tune job with the Python SDK:

```python

response = openai.FineTuningJob.create(
    training_file=training_file_id,
    validation_file=validation_file_id,
    model="gpt-35-turbo-0613",
)

job_id = response["id"]

# You can use the job ID to monitor the status of the fine-tuning job.
# The fine-tuning job will take some time to start and complete.

print("Job ID:", response["id"])
print("Status:", response["status"])
print(response)

```

## Check fine-tuning job status

```python
#Retrieve training job ID

response = openai.FineTuningJob.retrieve(job_id)

print("Job ID:", response["id"])
print("Status:", response["status"])
print(response)
```

## Deploy a customized model

When the fine-tune job succeeds, the value of the `fine_tuned_model` variable in the response body of the `FineTune.retrieve()` method is set to the name of your customized model. Your model is now also available for discovery from the [list Models API](/rest/api/cognitiveservices/azureopenaistable/models/list). However, you can't issue completion calls to your customized model until your customized model is deployed. You must deploy your customized model to make it available for use with completion calls.

[!INCLUDE [Fine-tuning deletion](fine-tune.md)]

> [!NOTE]
> As with all applications, Microsoft requires a review process for your custom model before it's available live.

You can use either [Azure OpenAI](#deploy-fine-tuned-model) or the [Azure CLI](#deploy-a-model-with-azure-cli) to deploy your customized model.

> [!NOTE]
> Only one deployment is permitted for a customized model. An error occurs if you select an already-deployed customized model.

## Deploy fine-tuned model

Unlike the previous SDK commands, deployment must be done using the control plane API which requires separate authorization, a different API path, and a different API version.

|variable      | Definition|
|--------------|-----------|
| token        | There are multiple ways to generate an authorization token. The easiest method for initial testing is to launch the Cloud Shell from the [Azure portal](https://portal.azure.com). Then run `az account get-access-token`. You can use this token as your temporary authorization token for API testing. We recommend storing this in a new environment variable|
| subscription | The subscription ID for the associated Azure OpenAI resource |
| resource_group | The resource group name for your Azure OpenAI resource |
| resource_name | The Azure OpenAI resource name |
| model_deployment_name | The custom name for your new fine-tuned model deployment. This is the name that will be referenced in your code when making chat completion calls. |
| fine_tuned_model | Retrieve this value from your fine-tuning job results in the previous step. It will look like `gpt-35-turbo-0613.ft-b044a9d3cf9c4228b5d393567f693b83`. You will need to add that value to the deploy_data json. |

```python
import json
import os
import requests

token= os.getenv("TEMP_AUTH_TOKEN") 
subscription = "<YOUR_SUBSCRIPTION_ID>"  
resource_group = "<YOUR_RESOURCE_GROUP_NAME>"
resource_name = "<YOUR_AZURE_OPENAI_RESOURCE_NAME>"
model_deployment_name ="gpt-35-turbo-ft" # custom deployment name that you will use to reference the model when making inference calls.

deploy_params = {'api-version': "2023-05-01"} 
deploy_headers = {'Authorization': 'Bearer {}'.format(token), 'Content-Type': 'application/json'}

deploy_data = {
    "sku": {"name": "standard", "capacity": 1}, 
    "properties": {
        "model": {
            "format": "OpenAI",
            "name": <"fine_tuned_model">, #retrieve this value from the previous call, it will look like gpt-35-turbo-0613.ft-b044a9d3cf9c4228b5d393567f693b83
            "version": "1"
        }
    }
}
deploy_data = json.dumps(deploy_data)

request_url = f'https://management.azure.com/subscriptions/{subscription}/resourceGroups/{resource_group}/providers/Microsoft.CognitiveServices/accounts/{resource_name}/deployments/{model_deployment_name}'

print('Creating a new deployment...')

r = requests.put(request_url, params=deploy_params, headers=deploy_headers, data=deploy_data)

print(r)
print(r.reason)
print(r.json())

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

```azurecli
az cognitiveservices account deployment create 
    --resource-group <YOUR_RESOURCE_GROUP>
    --name <YOUR_RESOURCE_NAME>  
    --deployment-name <YOUR_DEPLOYMENT_NAME>
    --model-name <YOUR_FINE_TUNED_MODEL_ID>
    --model-version "1" 
    --model-format OpenAI 
    --sku-capacity "1" 
    --sku-name "Standard"
```

## Use a deployed customized model

After your custom model deploys, you can use it like any other deployed model. You can use the **Playgrounds** in Azure OpenAI Studio to experiment with your new deployment. You can continue to use the same parameters with your custom model, such as `temperature` and `max_tokens`, as you can with other deployed models. For fine-tuned `babbage-002` and `davinci-002` models you will use the Completions playground and the Completions API. For fine-tuned `gpt-35-turbo-0613` models you will use the Chat playground and the Chat completion API.

```bash
curl $AZURE_OPENAI_ENDPOINT/openai/deployments/<deployment_name>/chat/completions?api-version=2023-05-15 \
  -H "Content-Type: application/json" \
  -H "api-key: $AZURE_OPENAI_KEY" \
  -d '{"messages":[{"role": "system", "content": "You are a helpful assistant."},{"role": "user", "content": "Does Azure OpenAI support customer managed keys?"},{"role": "assistant", "content": "Yes, customer managed keys are supported by Azure OpenAI."},{"role": "user", "content": "Do other Azure AI services support this too?"}]}'
```

## Analyze your customized model

Azure OpenAI attaches a result file named _results.csv_ to each fine-tune job after it completes. You can use the result file to analyze the training and validation performance of your customized model. The file ID for the result file is listed for each customized model, and you can use the Python SDK to retrieve the file ID and download the result file for analysis.

The following Python example retrieves the file ID of the first result file attached to the fine-tune job for your customized model, and then uses the Python SDK to download the file to your working directory for analysis.

```python
# Retrieve the file ID of the first result file from the fine-tune job
# for the customized model.
response = openai.FineTuningJob.retrieve(job_id)
if response["status"] == 'succeeded':
    result_file_id = response.result_files[0].id
    result_file_name = response.result_files[0].filename

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
| `train_loss` | The loss for the training batch. |
| `training_accuracy` | The percentage of completions in the training batch for which the model's predicted tokens exactly matched the true completion tokens.<br>For example, if the batch size is set to 3 and your data contains completions `[[1, 2], [0, 5], [4, 2]]`, this value is set to 0.67 (2 of 3) if the model predicted `[[1, 1], [0, 5], [4, 2]]`. |
| `train_mean_token_accuracy` | The percentage of tokens in the training batch correctly predicted by the model.<br>For example, if the batch size is set to 3 and your data contains completions `[[1, 2], [0, 5], [4, 2]]`, this value is set to 0.83 (5 of 6) if the model predicted `[[1, 1], [0, 5], [4, 2]]`. |
| `valid_loss` | The loss for the validation batch. |
| `valid_accuracy` | The percentage of completions in the validation batch for which the model's predicted tokens exactly matched the true completion tokens.<br>For example, if the batch size is set to 3 and your data contains completions `[[1, 2], [0, 5], [4, 2]]`, this value is set to 0.67 (2 of 3) if the model predicted `[[1, 1], [0, 5], [4, 2]]`. |
| `validation_mean_token_accuracy` | The percentage of tokens in the validation batch correctly predicted by the model.<br>For example, if the batch size is set to 3 and your data contains completions `[[1, 2], [0, 5], [4, 2]]`, this value is set to 0.83 (5 of 6) if the model predicted `[[1, 1], [0, 5], [4, 2]]`. |


## Clean up your deployments, customized models, and training files

When you're done with your customized model, you can delete the deployment and model. You can also delete the training and validation files you uploaded to the service, if needed. 

### Delete your model deployment

[!INCLUDE [Fine-tuning deletion](fine-tune.md)]

You can use various methods to delete the deployment for your customized model:

- [Azure OpenAI Studio](../how-to/fine-tuning.md?pivots=programming-language-studio#delete-your-model-deployment)</a>
- The [Azure CLI](/cli/azure/cognitiveservices/account/deployment?preserve-view=true#az-cognitiveservices-account-deployment-delete)

### Delete your customized model

Similarly, you can use various methods to delete your customized model:

- [Azure OpenAI Studio](../how-to/fine-tuning.md?pivots=programming-language-studio#delete-your-customized-model)

> [!NOTE]
> You can't delete a customized model if it has an existing deployment. You must first [delete your model deployment](#delete-your-model-deployment) before you can delete your customized model.

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
