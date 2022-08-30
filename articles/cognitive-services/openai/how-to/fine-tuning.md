---
title: 'How to customize a model with Azure OpenAI'
titleSuffix: Azure OpenAI
description: Learn how to create your own customized model with Azure OpenAI
services: cognitive-services
manager: nitinme
ms.service: cognitive-services
ms.subservice: openai
ms.topic: how-to
ms.date: 06/30/2022
author: ChrisHMSFT
ms.author: chrhoder
keywords: 

---
# Learn how to customize a model for your application

The Azure OpenAI Service lets you tailor our models to your personal datasets using a process known as fine-tuning. This customization step will let you get more out of the service by providing:

1. Higher quality results than just prompt design.
1. Lower latency requests. a customized model improves on the few-shot learning approach by training the model weights on your specific prompts and structure. This lets you achieve better results on a wider number of tasks without needing to provide examples in the prompt. The result is less text sent and fewer tokens processed on every API call.

## Prerequisites

- An Azure subscription - <a href="https://azure.microsoft.com/free/cognitive-services" target="_blank">Create one for free</a>
- Access granted to the Azure OpenAI service in the desired Azure subscription

    Currently, access to this service is granted only by application. You can apply for access to the Azure OpenAI service by completing the form at <a href="https://aka.ms/oai/access" target="_blank">https://aka.ms/oai/access</a>. Open an issue on this repo to contact us if you have an issue.
- The following Python libraries: os, requests, json
- An Azure OpenAI Service resource with a model deployed
    
    If you don't have a resource/model the process is documented in our [resource deployment guide](../how-to/create-resource.md)

## Fine-tuning workflow

The fine-tuning workflow requires the following steps:

1. Prepare and upload training data
1. Train a new fine-tuned model
1. Deploy your fine-tuned model
1. Use your model

## Preparing training data

Your training data set consists of input & output examples for how you would like the model perform.

The training dataset you use **must** be a JSON lines (JSONL) document where each line is a prompt-completion pair and a single example. The OpenAI Python CLI provides a useful data preparation tool to easily convert your data into this file format.

Here's an example of the format:

```json
{"prompt": "<prompt text>", "completion": "<ideal generated text>"}
{"prompt": "<prompt text>", "completion": "<ideal generated text>"}
{"prompt": "<prompt text>", "completion": "<ideal generated text>"}
```

### Creating your training dataset

Creating a dataset for model customization is different than designing for completions calls with the models.  

Designing your prompts and completions for fine-tuning is different from designing your prompts for use with our base models (Davinci, Curie, Babbage, Ada).

Prompts for completions calls, often use either detailed instructions or few-shot learning techniques and consist of multiple examples. For fine-tuning, we recommend that each training example consist of a single input example and its desired output. You don't need to give detailed instructions or examples in the same prompt.

The more training examples you have, the better. We recommend having at least a couple hundred examples. In general, we've found that each doubling of the dataset size leads to a linear increase in model quality.

For more detailed guidance on how to prepare training data for various tasks, please refer to our [how to on preparing your dataset](prepare-dataset.md)

### CLI dataset creation tool

We recommend using OpenAI's command-line interface (CLI) to assist with many of the data preparation steps. OpenAI has developed a tool which validates, gives suggestions, and reformats your data.

To install the SDK, run the following command:

```console
pip install --upgrade openai 
```

**To analyze your dataset run the following command:**

```console
openai tools fine_tunes.prepare_data -f <LOCAL_FILE>
```

This tool accepts different formats, with the only requirement that they contain a prompt and a completion column/key. You can pass a CSV, TSV, XLSX, JSON or JSONL file, and it will save the output into a JSONL file ready for fine-tuning, after guiding you through the process of suggested changes.

## Upload your training data

Once you've prepared your dataset, you can upload your files to the service. We offer two ways to do this:

1. [From a local file](../reference.md#upload-a-file)
1. [Import from an Azure Blob store or other web location](../reference.md#import-a-file-from-azure-blob)

For large data files, we recommend you import from Azure Blob. Large files can become unstable when uploaded through multipart forms because the requests are atomic and can't be retried or resumed.

The following Python code will create a sample dataset and show how to upload a file and print the returned ID. Make sure to save the IDs returned as you'll need them for the fine-tuning training job creation.

> [!IMPORTANT]
> Remember to remove the key from your code when you're done, and never post it publicly. For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](../../../key-vault/general/overview.md). See the Cognitive Services [security](../../cognitive-services-security.md) article for more information.

```python
import openai
from openai import cli
import time
import shutil
import json


openai.api_key = "COPY_YOUR_OPENAI_KEY_HERE"
openai.api_base =  "COPY_YOUR_OPENAI_ENDPOINT_HERE" # your endpoint should look like the following https://YOUR_RESOURCE_NAME.openai.azure.com/
openai.api_type = 'azure'
openai.api_version = '2022-06-01-preview' # this may change in the future


training_file_name = 'training.jsonl'
validation_file_name = 'validation.jsonl'

sample_data = [{"prompt": "When I go to the store, I want an", "completion": "apple"},
    {"prompt": "When I go to work, I want a", "completion": "coffee"},
    {"prompt": "When I go home, I want a", "completion": "soda"}]

print(f'Generating the training file: {training_file_name}')
with open(training_file_name, 'w') as training_file:
    for entry in sample_data:
        json.dump(entry, training_file)
        training_file.write('\n')

print(f'Copying the training file to the validation file')
shutil.copy(training_file_name, validation_file_name)

def check_status(training_id, validation_id):
    train_status = openai.File.retrieve(training_id)["status"]
    valid_status = openai.File.retrieve(validation_id)["status"]
    print(f'Status (training_file | validation_file): {train_status} | {valid_status}')
    return (train_status, valid_status)

#importing our two files
training_id = cli.FineTune._get_or_upload(training_file_name, True)
validation_id = cli.FineTune._get_or_upload(validation_file_name, True)

#checking the status of the imports
(train_status, valid_status) = check_status(training_id, validation_id)

while train_status not in ["succeeded", "failed"] or valid_status not in ["succeeded", "failed"]:
    time.sleep(1)
    (train_status, valid_status) = check_status(training_id, validation_id)
```

## Create a customized model

After you've uploaded the training and (optional) validation file, you wish to use for your training job you're ready to start the process. You can use the [Models API](../reference.md#models) to identify which models are fine-tunable.

Once you have the model, you want to fine-tune you need to create a job. The following Python code shows an example of how to create a new job:

```python
create_args = {
    "training_file": training_id,
    "validation_file": validation_id,
    "model": "curie",
    "hyperparams": {
    "n_epochs": 1
    },
    "compute_classification_metrics": True,
    "classification_n_classes": 3
}
resp = openai.FineTune.create(**create_args)
job_id = resp["id"]
status = resp["status"]

print(f'Fine-tunning model with jobID: {job_id}.')
```

After you've started a fine-tune job, it may take some time to complete. Your job may be queued behind other jobs on our system, and training your model can take minutes or hours depending on the model and dataset size. You can check the status of your job by retrieving information about your Job using the ID returned from the prior call:

```python
    status = openai.FineTune.retrieve(id=job_id)["status"]
    if status not in ["succeeded", "failed"]:
        print(f'Job not in terminal status: {status}. Waiting.')
        while status not in ["succeeded", "failed"]:
            time.sleep(2)
            status = openai.FineTune.retrieve(id=job_id)["status"]
            print(f'Status: {status}')
    else:
        print(f'Finetune job {job_id} finished with status: {status}')

    print('Checking other finetune jobs in the subscription.')
    result = openai.FineTune.list()
    print(f'Found {len(result)} finetune jobs.')
```

## Deploy a customized model

When a job has succeeded, the **fine_tuned_model** field will be populated with the name of the model. Your model will also be available in the [list Models API](../reference.md#list-all-available-models). You must now deploy your model so that you can run completions calls. You can do this either using the Management APIs or using the deployment APIs. We'll show you both options below.

### Deploy a model with the service APIs

```python
    #Fist let's get the model of the previous job:
    result = openai.FineTune.retrieve(id=job_id)
    if result["status"] == 'succeeded':
        model = result["fine_tuned_model"]

    # Now let's create the deployment
    print(f'Creating a new deployment with model: {model}')
    result = openai.Deployment.create(model=model, scale_settings={"scale_type":"standard", "capacity": None})
    deployment_id = result["id"]
```

### Deploy a model with the Azure CLI

Alternatively, the following code will deploy a new model using the Azure CLI, which allows you to set the name for the model. :

```console
az cognitiveservices account deployment create 
    --subscription YOUR_AZURE_SUBSCRIPTION
    -g YOUR_RESOURCE_GROUP
    -n YOUR_RESOURCE_NAME 
    --deployment-name YOUR_DEPLOYMENT_NAME
    --model-name YOUR_FINE_TUNED_MODEL_ID 
    --model-version "1" 
    --model-format OpenAI 
    --scale-settings-scale-type "Standard" 
```

## Use a fine-tuned model

Once your model has been deployed, you can use it like any other model. Reference the deployment name you specified in the previous step. You can use either the REST API or Python SDK and can continue to use all the other Completions parameters like temperature, frequency_penalty, presence_penalty, etc., on these requests to fine-tuned models.

```python
print('Sending a test completion job')
start_phrase = 'When I go to the store, I want a'
response = openai.Completion.create(engine=deployment_id, prompt=start_phrase, max_tokens=4)
text = response['choices'][0]['text'].replace('\n', '').replace(' .', '.').strip()
print(f'"{start_phrase} {text}"')
```

> [!NOTE]
> As with all applications, we require a review process prior to going live.

## Clean up your deployments, fine-tuned models and training files

When you're done with your fine-tuned model, you can delete the deployment and fine-tuned model. You can also delete the training files you uploaded to the service. 

### Delete your model deployment

To delete a deployment, you can use the [Azure CLI](/cli/azure/cognitiveservices/account/deployment?view=azure-cli-latest&preserve-view=true#az-cognitiveservices-account-deployment-delete), Azure OpenAI Studio or [REST APIs](../reference.md#delete-a-deployment). here's an example of how to delete your deployment with the Azure CLI:

```console
az cognitiveservices account deployment delete --name
                                               --resource-group
                                               [--deployment-name]

```

### Delete your fine-tuned model

You can delete a fine-tuned model either with the [REST APIs](../reference.md#delete-a-specific-fine-tuning-job) or via the Azure OpenAI Studio. Here's an example of how to delete your fine-tuned model with the REST APIs:

```python
openai.FineTune.delete(sid=job_id)
```

### Delete your training files

You can also delete any files you've uploaded for training with the [REST APIs](../reference.md#files) or with the Azure OpenAI Studio. Here's an example of how to delete your fine-tuned model with the REST APIs.

```python
print('Checking for existing uploaded files.')
results = []
files = openai.File.list().data
print(f'Found {len(files)} total uploaded files in the subscription.')
for item in files:
    if item["filename"] in [training_file_name, validation_file_name]:
        results.append(item["id"])
print(f'Found {len(results)} already uploaded files that match our


print(f'Deleting already uploaded files.')
for id in results:
    openai.File.delete(sid = id)
```

## Advanced usage

### Analyzing your fine-tuned model

We attach a result file to each job once it has been completed. This results file ID will be listed when you retrieve a fine-tune, and also when you look at the events on a fine-tune. You can download these files:

```console
curl -X GET https://example_resource_name.openai.azure.com/openai/files/RESULTS_FILE_ID/content?api-version=2022-06-01-preview \
  -H "api-key: YOUR_API_KEY" > results.csv
```

The **results.csv** file contains a row for each training step, where a step refers to one forward and backward pass on a batch of data. In addition to the step number, each row contains the following fields corresponding to that step:

- **elapsed_tokens**: the number of tokens the model has seen so far (including repeats)
- **elapsed_examples**: the number of examples the model has seen so far (including repeats), where one example is one element in your batch. For example, if batch_size = 4, each step will increase elapsed_examples by 4.
- **training_loss**: loss on the training batch
- **training_sequence_accuracy**: the percentage of completions in the training batch for which the model's predicted tokens matched the true completion tokens exactly. For example, with a batch_size of 3, if your data contains the completions [[1, 2], [0, 5], [4, 2]] and the model predicted [[1, 1], [0, 5], [4, 2]], this accuracy will be 2/3 = 0.67
- **training_token_accuracy**: the percentage of tokens in the training batch that were correctly predicted by the model. For example, with a batch_size of 3, if your data contains the completions [[1, 2], [0, 5], [4, 2]] and the model predicted [[1, 1], [0, 5], [4, 2]], this accuracy will be 5/6 = 0.83
- **validation_loss** loss on the validation batch
- **validation_sequence_accuracy**  the percentage of completions in the validation batch for which the model's predicted tokens matched the true completion tokens exactly. For example, with a batch_size of 3, if your data contains the completion [[1, 2], [0, 5], [4, 2]] and the model predicted [[1, 1], [0, 5], [4, 2]], this accuracy will be 2/3 = 0.67
- **validation_token_accuracy**  the percentage of tokens in the validation batch that were correctly predicted by the model. For example, with a batch_size of 3, if your data contains the completion [[1, 2], [0, 5], [4, 2]] and the model predicted [[1, 1], [0, 5], [4, 2]], this accuracy will be 5/6 = 0.83

### Validation

It's a best practice to reserve some of your data for validation and testing. Both files can have the same format as your training file and all should be mutually exclusive. You can optionally include a validation file when creating your fine-tune job. If you do, the generated results file will include evaluations on how well the fine-tuned model performs against your validation data at periodic intervals during training.

### Hyperparameters

We've picked default hyperparameters that work well across a range of use cases. The only required parameters are the model and training file.

That said, tweaking the hyperparameters used for fine-tuning can often lead to a model that produces higher quality output. In particular, you may want to configure the following:

- **model**: The name of the base model to fine-tune. You can select one of "ada" or "curie". To learn more about these models, see the [Models documentation](../concepts/models.md). You can find out the exact models available for fine-tuning in your resource by calling the  [Models API](../reference.md#models).
- **n_epochs**: The number of epochs to train the model for. An epoch refers to one full cycle through the training dataset.
- **batch_size**: The batch size is the number of training examples used to train a single forward and backward pass. In general, we've found that larger batch sizes tend to work better for larger datasets.
- **learning_rate_multiplier**: The fine-tuning learning rate is the original learning rate used for pre-training multiplied by this multiplier. We recommend experimenting with values in the range 0.02 to 0.2 to see what produces the best results. Empirically, we've found that larger learning rates often perform better with larger batch sizes.

## Next Steps

- Explore the full REST API Reference documentation to learn more about all the fine-tuning capabilities. You can find the [full REST documentation here](../reference.md).
- Explore more of the [Python SDK operations here](https://github.com/openai/openai-python/blob/main/examples/azure/finetuning.ipynb).