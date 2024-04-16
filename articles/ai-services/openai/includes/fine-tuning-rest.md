---
title: 'Customize a model with Azure OpenAI Service and the REST API'
titleSuffix: Azure OpenAI
description: Learn how to create your own customized model with Azure OpenAI Service by using the REST APIs.
#services: cognitive-services
manager: nitinme
ms.service: azure-ai-openai
ms.topic: include
ms.date: 03/06/2024
author: mrbullwinkle
ms.author: mbullwin
---

## Prerequisites

- Read the [When to use Azure OpenAI fine-tuning guide](../concepts/fine-tuning-considerations.md).
- An Azure subscription. <a href="https://azure.microsoft.com/free/cognitive-services" target="_blank">Create one for free</a>.
- Access granted to Azure OpenAI in the desired Azure subscription.
- An Azure OpenAI resource. For more information, see [Create a resource and deploy a model with Azure OpenAI](../how-to/create-resource.md).
- Fine-tuning access requires **Cognitive Services OpenAI Contributor**.
- If you don't already have access to view quota, and deploy models in Azure OpenAI Studio you'll require [additional permissions](../how-to/role-based-access-control.md).  


> [!NOTE]
> Currently, you must submit an application to access Azure OpenAI Service. To apply for access, complete [this form](https://aka.ms/oai/access).

## Models

The following models support fine-tuning:

- `babbage-002`
- `davinci-002`
- `gpt-35-turbo` (0613)
- `gpt-35-turbo` (1106)
- `gpt-35-turbo` (0125)

Consult the [models page](../concepts/models.md#fine-tuning-models) to check which regions currently support fine-tuning.

## Review the workflow for the REST API

Take a moment to review the fine-tuning workflow for using the REST APIS and Python with Azure OpenAI:

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

# [chat completion models](#tab/turbo)

The training and validation data you use **must** be formatted as a JSON Lines (JSONL) document. For `gpt-35-turbo-0613` the fine-tuning dataset must be formatted in the conversational format that is used by the [Chat completions](../how-to/chatgpt.md) API.

If you would like a step-by-step walk-through of fine-tuning a `gpt-35-turbo-0613` please refer to the [Azure OpenAI fine-tuning tutorial](../tutorials/fine-tune.md)

### Example file format

```json
{"messages": [{"role": "system", "content": "You are an Xbox customer support agent whose primary goal is to help users with issues they are experiencing with their Xbox devices. You are friendly and concise. You only provide factual answers to queries, and do not provide answers that are not related to Xbox."}, {"role": "user", "content": "Is Xbox better than PlayStation?"}, {"role": "assistant", "content": "I apologize, but I cannot provide personal opinions. My primary job is to assist you with any issues related to your Xbox device. Do you have any Xbox-related issues that need addressing?"}]}
{"messages": [{"role": "system", "content": "You are an Xbox customer support agent whose primary goal is to help users with issues they are experiencing with their Xbox devices. You are friendly and concise. You only provide factual answers to queries, and do not provide answers that are not related to Xbox."}, {"role": "user", "content": "Can I play PC games on my Xbox?"}, {"role": "assistant", "content": "While Xbox consoles don't natively support PC games, they can play an array of Xbox games, many of which are also available on PC. Can I assist you with finding games compatible with your Xbox device?"}]}
{"messages": [{"role": "system", "content": "You are an Xbox customer support agent whose primary goal is to help users with issues they are experiencing with their Xbox devices. You are friendly and concise. You only provide factual answers to queries, and do not provide answers that are not related to Xbox."}, {"role": "user", "content": "I'm having trouble connecting my Xbox to the Wi-Fi."}, {"role": "assistant", "content": "No worries, let's go through the network settings on your Xbox. Can you please tell me what happens when you try to connect it to the Wi-Fi?"}]}
```

In addition to the JSONL format, training and validation data files must be encoded in UTF-8 and include a byte-order mark (BOM). The file must be less than 100 MB in size.

### Create your training and validation datasets

The more training examples you have, the better. Fine tuning jobs will not proceed without at least 10 training examples, but such a small number are not enough to noticeably influence model responses. It is best practice to provide hundreds, if not thousands, of training examples to be successful.

In general, doubling the dataset size can lead to a linear increase in model quality. But keep in mind, low quality examples can negatively impact performance. If you train the model on a large amount of internal data without first pruning the dataset for only the highest quality examples, you could end up with a model that performs much worse than expected.

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

The more training examples you have, the better. Fine tuning jobs will not proceed without at least 10 training examples, but such a small number are not enough to noticeably influence model responses. It is best practice to provide hundreds, if not thousands, of training examples to be successful.

In general, doubling the dataset size can lead to a linear increase in model quality. But keep in mind, low quality examples can negatively impact performance. If you train the model on a large amount of internal data without first pruning the dataset for only the highest quality examples, you could end up with a model that performs much worse than expected.

### OpenAI CLI data preparation tool

OpenAI's CLI data preparation tool was developed for the previous generation of fine-tuning models to assist with many of the data preparation steps. This tool will only work for data preparation for models that work with the completion API like `babbage-002` and `davinci-002`. The tool validates, gives suggestions, and reformats your data into a JSONL file ready for fine-tuning.

To install the OpenAI CLI, run the following Python command:

```console
pip install openai==0.28.1
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

### Select the base model

The first step in creating a custom model is to choose a base model. The **Base model** pane lets you choose a base model to use for your custom model. Your choice influences both the performance and the cost of your model.

Select the base model from the **Base model type** dropdown, and then select **Next** to continue.

You can create a custom model from one of the following available base models:

- `babbage-002`
- `davinci-002`
- `gpt-35-turbo` (0613)
- `gpt-35-turbo` (1106)

Or you can fine tune a previously fine-tuned model, formatted as base-model.ft-{jobid}.

:::image type="content" source="../media/fine-tuning/models.png" alt-text="Screenshot of model options with a custom fine-tuned model." lightbox="../media/fine-tuning/models.png":::

For more information about our base models that can be fine-tuned, see [Models](../concepts/models.md).

## Upload your training data

The next step is to either choose existing prepared training data or upload new prepared training data to use when fine-tuning your model. After you prepare your training data, you can upload your files to the service. There are two ways to upload training data:

For large data files, we recommend that you import from an Azure Blob store. Large files can become unstable when uploaded through multipart forms because the requests are atomic and can't be retried or resumed. For more information about Azure Blob storage, see [What is Azure Blob storage?](../../../storage/blobs/storage-blobs-overview.md)

> [!NOTE]
> Training data files must be formatted as JSONL files, encoded in UTF-8 with a byte-order mark (BOM). The file must be less than 512 MB in size.

### Upload training data

```bash
curl -X POST $AZURE_OPENAI_ENDPOINT/openai/files?api-version=2023-12-01-preview \
  -H "Content-Type: multipart/form-data" \
  -H "api-key: $AZURE_OPENAI_API_KEY" \
  -F "purpose=fine-tune" \
  -F "file=@C:\\fine-tuning\\training_set.jsonl;type=application/json"
```

### Upload validation data

```bash
curl -X POST $AZURE_OPENAI_ENDPOINT/openai/files?api-version=2023-12-01-preview \
  -H "Content-Type: multipart/form-data" \
  -H "api-key: $AZURE_OPENAI_API_KEY" \
  -F "purpose=fine-tune" \
  -F "file=@C:\\fine-tuning\\validation_set.jsonl;type=application/json"
```

## Create a customized model

After you uploaded your training and validation files, you're ready to start the fine-tuning job. The following code shows an example of how to [create a new fine-tuning job](/rest/api/azureopenai/fine-tuning/create?view=rest-azureopenai-2023-12-01-preview&tabs=HTTP&preserve-view=true) with the REST API:

```bash
curl -X POST $AZURE_OPENAI_ENDPOINT/openai/fine_tuning/jobs?api-version=2023-12-01-preview \
  -H "Content-Type: application/json" \
  -H "api-key: $AZURE_OPENAI_API_KEY" \
  -d '{
    "model": "gpt-35-turbo-0613", 
    "training_file": "<TRAINING_FILE_ID>", 
    "validation_file": "'<VALIDATION_FILE_ID>"
}'
```

You can also pass additional optional parameters like [hyperparameters](/rest/api/azureopenai/fine-tuning/create?view=rest-azureopenai-2023-12-01-preview&tabs=HTTP#finetuninghyperparameters&preserve-view=true) to take greater control of the fine-tuning process. For initial training we recommend using the automatic defaults that are present without specifying these parameters.

The current supported hyperparameters for fine-tuning are:

|**Name**| **Type**| **Description**|
|---|---|---|
|`batch_size` |integer | The batch size to use for training. The batch size is the number of training examples used to train a single forward and backward pass. In general, we've found that larger batch sizes tend to work better for larger datasets. The default value as well as the maximum value for this property are specific to a base model. A larger batch size means that model parameters are updated less frequently, but with lower variance. |
| `learning_rate_multiplier` | number | The learning rate multiplier to use for training. The fine-tuning learning rate is the original learning rate used for pre-training multiplied by this value. Larger learning rates tend to perform better with larger batch sizes. We recommend experimenting with values in the range 0.02 to 0.2 to see what produces the best results. A smaller learning rate can be useful to avoid overfitting. |
|`n_epochs` | integer | The number of epochs to train the model for. An epoch refers to one full cycle through the training dataset. |

## Check the status of your customized model

After you start a fine-tune job, it can take some time to complete. Your job might be queued behind other jobs in the system. Training your model can take minutes or hours depending on the model and dataset size. The following example uses the REST API to check the status of your fine-tuning job. The example retrieves information about your job by using the job ID returned from the previous example:

```bash
curl -X GET $AZURE_OPENAI_ENDPOINT/openai/fine_tuning/jobs/<YOUR-JOB-ID>?api-version=2023-12-01-preview \
  -H "api-key: $AZURE_OPENAI_API_KEY"
```

## Deploy a customized model

[!INCLUDE [Fine-tuning deletion](fine-tune.md)]

The following Python example shows how to use the REST API to create a model deployment for your customized model. The REST API generates a name for the deployment of your customized model.

|variable      | Definition|
|--------------|-----------|
| token        | There are multiple ways to generate an authorization token. The easiest method for initial testing is to launch the Cloud Shell from the [Azure portal](https://portal.azure.com). Then run [`az account get-access-token`](/cli/azure/account#az-account-get-access-token()). You can use this token as your temporary authorization token for API testing. We recommend storing this in a new environment variable|
| subscription | The subscription ID for the associated Azure OpenAI resource |
| resource_group | The resource group name for your Azure OpenAI resource |
| resource_name | The Azure OpenAI resource name |
| model_deployment_name | The custom name for your new fine-tuned model deployment. This is the name that will be referenced in your code when making chat completion calls. |
| fine_tuned_model | Retrieve this value from your fine-tuning job results in the previous step. It will look like `gpt-35-turbo-0613.ft-b044a9d3cf9c4228b5d393567f693b83`. You'll need to add that value to the deploy_data json. |

```bash
curl -X POST "https://management.azure.com/subscriptions/<SUBSCRIPTION>/resourceGroups/<RESOURCE_GROUP>/providers/Microsoft.CognitiveServices/accounts/<RESOURCE_NAME>/deployments/<MODEL_DEPLOYMENT_NAME>api-version=2023-05-01" \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "sku": {"name": "standard", "capacity": 1},
    "properties": {
        "model": {
            "format": "OpenAI",
            "name": "<FINE_TUNED_MODEL>",
            "version": "1"
        }
    }
}'
```

### Cross region deployment

Fine-tuning supports deploying a fine-tuned model to a different region than where the model was originally fine-tuned. You can also deploy to a different subscription/region.

The only limitations are that the new region must also support fine-tuning and when deploying cross subscription the account generating the authorization token for the deployment must have access to both the source and destination subscriptions. 

Below is an example of deploying a model that was fine-tuned in one subscription/region to another.

```bash
curl -X PUT "https://management.azure.com/subscriptions/<SUBSCRIPTION>/resourceGroups/<RESOURCE_GROUP>/providers/Microsoft.CognitiveServices/accounts/<RESOURCE_NAME>/deployments/<MODEL_DEPLOYMENT_NAME>api-version=2023-05-01" \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "sku": {"name": "standard", "capacity": 1},
    "properties": {
        "model": {
            "format": "OpenAI",
            "name": "<FINE_TUNED_MODEL>", 
            "version": "1",
            "source": "/subscriptions/{sourceSubscriptionID}/resourceGroups/{sourceResourceGroupName}/providers/Microsoft.CognitiveServices/accounts/{sourceAccount}" 
        }
    }
}'
```

To deploy between the same subscription, but different regions, you would just have subscription and resource groups be identical for both source and destination variables and only the source and destination resource names would need to be unique.

### Deploy a model with Azure CLI

The following example shows how to use the Azure CLI to deploy your customized model. With the Azure CLI, you must specify a name for the deployment of your customized model. For more information about how to use the Azure CLI to deploy customized models, see [`az cognitiveservices account deployment`](/cli/azure/cognitiveservices/account/deployment).

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

After your custom model deploys, you can use it like any other deployed model. You can use the **Playgrounds** in [Azure OpenAI Studio](https://oai.azure.com) to experiment with your new deployment. You can continue to use the same parameters with your custom model, such as `temperature` and `max_tokens`, as you can with other deployed models. For fine-tuned `babbage-002` and `davinci-002` models you'll use the Completions playground and the Completions API. For fine-tuned `gpt-35-turbo-0613` models you'll use the Chat playground and the Chat completion API.

```bash
curl $AZURE_OPENAI_ENDPOINT/openai/deployments/<deployment_name>/chat/completions?api-version=2023-05-15 \
  -H "Content-Type: application/json" \
  -H "api-key: $AZURE_OPENAI_API_KEY" \
  -d '{"messages":[{"role": "system", "content": "You are a helpful assistant."},{"role": "user", "content": "Does Azure OpenAI support customer managed keys?"},{"role": "assistant", "content": "Yes, customer managed keys are supported by Azure OpenAI."},{"role": "user", "content": "Do other Azure AI services support this too?"}]}'
```

## Analyze your customized model

Azure OpenAI attaches a result file named _results.csv_ to each fine-tune job after it completes. You can use the result file to analyze the training and validation performance of your customized model. The file ID for the result file is listed for each customized model, and you can use the REST API to retrieve the file ID and download the result file for analysis.

The following Python example uses the REST API to retrieve the file ID of the first result file attached to the fine-tuning job for your customized model, and then downloads the file to your working directory for analysis.

```bash
curl -X GET "$AZURE_OPENAI_ENDPOINT/openai/fine_tuning/jobs/<JOB_ID>?api-version=2023-12-01-preview" \
  -H "api-key: $AZURE_OPENAI_API_KEY")
```

```bash
curl -X GET "$AZURE_OPENAI_ENDPOINT/openai/files/<RESULT_FILE_ID>/content?api-version=2023-12-01-preview" \
    -H "api-key: $AZURE_OPENAI_API_KEY" > <RESULT_FILENAME>
```

The result file is a CSV file that contains a header row and a row for each training step performed by the fine-tuning job. The result file contains the following columns:

| Column name | Description |
| --- | --- |
| `step` | The number of the training step. A training step represents a single pass, forward and backward, on a batch of training data. |
| `train_loss` | The loss for the training batch. |
| `training_accuracy` | The percentage of completions in the training batch for which the model's predicted tokens exactly matched the true completion tokens.<br>For example, if the batch size is set to 3 and your data contains completions `[[1, 2], [0, 5], [4, 2]]`, this value is set to 0.67 (2 of 3) if the model predicted `[[1, 1], [0, 5], [4, 2]]`. |
| `train_mean_token_accuracy` | The percentage of tokens in the training batch correctly predicted by the model.<br>For example, if the batch size is set to 3 and your data contains completions `[[1, 2], [0, 5], [4, 2]]`, this value is set to 0.83 (5 of 6) if the model predicted `[[1, 1], [0, 5], [4, 2]]`. |
| `valid_loss` | The loss for the validation batch. |
| `valid_accuracy` | The percentage of completions in the validation batch for which the model's predicted tokens exactly matched the true completion tokens.<br>For example, if the batch size is set to 3 and your data contains completions `[[1, 2], [0, 5], [4, 2]]`, this value is set to 0.67 (2 of 3) if the model predicted `[[1, 1], [0, 5], [4, 2]]`. |
| `validation_mean_token_accuracy` | The percentage of tokens in the validation batch correctly predicted by the model.<br>For example, if the batch size is set to 3 and your data contains completions `[[1, 2], [0, 5], [4, 2]]`, this value is set to 0.83 (5 of 6) if the model predicted `[[1, 1], [0, 5], [4, 2]]`. |

You can also view the data in your results.csv file as plots in Azure OpenAI Studio. Select the link for your trained model, and you will see three charts: loss, mean token accuracy, and token accuracy. If you provided validation data, both datasets will appear on the same plot.

Look for your loss to decrease over time, and your accuracy to increase. If you see a divergence between your training and validation data, that may indicate that you are overfitting. Try training with fewer epochs, or a smaller learning rate multiplier.


## Clean up your deployments, customized models, and training files

When you're done with your customized model, you can delete the deployment and model. You can also delete the training and validation files you uploaded to the service, if needed.

### Delete your model deployment

You can use various methods to delete the deployment for your customized model:

- [Azure OpenAI Studio](../how-to/fine-tuning.md?pivots=programming-language-studio#delete-your-model-deployment)
- The [Azure CLI](/cli/azure/cognitiveservices/account/deployment?view=azure-cli-latest&preserve-view=true#az-cognitiveservices-account-deployment-delete)

### Delete your customized model

Similarly, you can use various methods to delete your customized model:

- [Azure OpenAI Studio](../how-to/fine-tuning.md?pivots=programming-language-studio#delete-your-customized-model)

> [!NOTE]
> You can't delete a customized model if it has an existing deployment. You must first [delete your model deployment](#delete-your-model-deployment) before you can delete your customized model.

### Delete your training files

You can optionally delete training and validation files that you uploaded for training, and result files generated during training, from your Azure OpenAI subscription. You can use the following methods to delete your training, validation, and result files:

- [Azure OpenAI Studio](../how-to/fine-tuning.md?pivots=programming-language-studio#delete-your-training-files)

## Continuous fine-tuning

Once you have created a fine-tuned model, you might want to continue to refine the model over time through further fine-tuning. Continuous fine-tuning is the iterative process of selecting an already fine-tuned model as a base model and fine-tuning it further on new sets of training examples.

To perform fine-tuning on a model that you have previously fine-tuned, you would use the same process as described in [create a customized model](#create-a-customized-model) but instead of specifying the name of a generic base model you would specify your already fine-tuned model's ID. The fine-tuned model ID looks like `gpt-35-turbo-0613.ft-5fd1918ee65d4cd38a5dcf6835066ed7`

```bash
curl -X POST $AZURE_OPENAI_ENDPOINT/openai/fine_tuning/jobs?api-version=2023-12-01-preview \
  -H "Content-Type: application/json" \
  -H "api-key: $AZURE_OPENAI_API_KEY" \
  -d '{
    "model": "gpt-35-turbo-0613.ft-5fd1918ee65d4cd38a5dcf6835066ed7", 
    "training_file": "<TRAINING_FILE_ID>", 
    "validation_file": "<VALIDATION_FILE_ID>",
    "suffix": "<additional text used to help identify fine-tuned models>"
}'
```

We also recommend including the `suffix` parameter to make it easier to distinguish between different iterations of your fine-tuned model. `suffix` takes a string, and is set to identify the fine-tuned model. The suffix can contain up to 40 characters (a-z, A-Z, 0-9,- and _) that will be added to your fine-tuned model name.

If you're unsure of the ID of your fine-tuned model this information can be found in the **Models** page of Azure OpenAI Studio, or you can generate a [list of models](/rest/api/azureopenai/models/list?view=rest-azureopenai-2023-12-01-preview&tabs=HTTP&preserve-view=true) for a given Azure OpenAI resource using the REST API.
