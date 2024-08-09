---
title: Azure OpenAI Service fine-tuning gpt-3.5-turbo
titleSuffix: Azure OpenAI
description: Learn how to use Azure OpenAI's latest fine-tuning capabilities with gpt-3.5-turbo.
#services: cognitive-services
manager: nitinme
ms.service: azure-ai-openai
ms.topic: tutorial
ms.date: 05/15/2024
author: mrbullwinkle
ms.author: mbullwin
recommendations: false
ms.custom: devx-track-python
---

# Azure OpenAI GPT-3.5 Turbo fine-tuning tutorial

This tutorial walks you through fine-tuning a `gpt-35-turbo-0613` model.

In this tutorial you learn how to:

> [!div class="checklist"]
> * Create sample fine-tuning datasets.
> * Create environment variables for your resource endpoint and API key.
> * Prepare your sample training and validation datasets for fine-tuning.
> * Upload your training file and validation file for fine-tuning.
> * Create a fine-tuning job for `gpt-35-turbo-0613`.
> * Deploy a custom fine-tuned model.

## Prerequisites

- An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services?azure-portal=true).
- Python 3.8 or later version
- The following Python libraries: `json`, `requests`, `os`, `tiktoken`, `time`, `openai`, `numpy`.
- [Jupyter Notebooks](https://jupyter.org/)
- An Azure OpenAI resource in a [region where `gpt-35-turbo-0613` fine-tuning is available](../concepts/models.md). If you don't have a resource the process of creating one is documented in our resource [deployment guide](../how-to/create-resource.md).
- Fine-tuning access requires **Cognitive Services OpenAI Contributor**.
- If you do not already have access to view quota, and deploy models in Azure OpenAI Studio you will require [additional permissions](../how-to/role-based-access-control.md).


> [!IMPORTANT]
> We strongly recommend reviewing the [pricing information](https://azure.microsoft.com/pricing/details/cognitive-services/openai-service/#pricing) for fine-tuning prior to beginning this tutorial to make sure you are comfortable with the associated costs. In testing, this tutorial resulted in one training hour billed, in addition to the costs that are associated with fine-tuning inference, and the hourly hosting costs of having a fine-tuned model deployed. Once you have completed the tutorial, you should delete your fine-tuned model deployment otherwise you will continue to incur the hourly hosting cost.

## Set up

### Python libraries

# [OpenAI Python 1.x](#tab/python-new)

This tutorial provides examples of some of the latest OpenAI features include seed/events/checkpoints. In order to take advantage of these features you may need to run `pip install openai --upgrade` to upgrade to the latest release.

```cmd
pip install openai requests tiktoken numpy
```

# [OpenAI Python 0.28.1](#tab/python)

[!INCLUDE [Deprecation](../includes/deprecation.md)]

If you haven't already, you need to install the following libraries:

```cmd
pip install "openai==0.28.1" requests tiktoken numpy
```

---

[!INCLUDE [get-key-endpoint](../includes/get-key-endpoint.md)]

### Environment variables

# [Command Line](#tab/command-line)

```CMD
setx AZURE_OPENAI_API_KEY "REPLACE_WITH_YOUR_KEY_VALUE_HERE"
```

```CMD
setx AZURE_OPENAI_ENDPOINT "REPLACE_WITH_YOUR_ENDPOINT_HERE"
```

# [PowerShell](#tab/powershell)

```powershell
[System.Environment]::SetEnvironmentVariable('AZURE_OPENAI_API_KEY', 'REPLACE_WITH_YOUR_KEY_VALUE_HERE', 'User')
```

```powershell
[System.Environment]::SetEnvironmentVariable('AZURE_OPENAI_ENDPOINT', 'REPLACE_WITH_YOUR_ENDPOINT_HERE', 'User')
```

# [Bash](#tab/bash)

```Bash
echo export AZURE_OPENAI_API_KEY="REPLACE_WITH_YOUR_KEY_VALUE_HERE" >> /etc/environment
echo export AZURE_OPENAI_ENDPOINT="REPLACE_WITH_YOUR_ENDPOINT_HERE" >> /etc/environment

source /etc/environment
```

---

### Create a sample dataset

Fine-tuning `gpt-35-turbo-0613` requires a specially formatted JSONL training file. OpenAI provides the following example in their documentation:

```json
{"messages": [{"role": "system", "content": "Marv is a factual chatbot that is also sarcastic."}, {"role": "user", "content": "What's the capital of France?"}, {"role": "assistant", "content": "Paris, as if everyone doesn't know that already."}]}
{"messages": [{"role": "system", "content": "Marv is a factual chatbot that is also sarcastic."}, {"role": "user", "content": "Who wrote 'Romeo and Juliet'?"}, {"role": "assistant", "content": "Oh, just some guy named William Shakespeare. Ever heard of him?"}]}
{"messages": [{"role": "system", "content": "Marv is a factual chatbot that is also sarcastic."}, {"role": "user", "content": "How far is the Moon from Earth?"}, {"role": "assistant", "content": "Around 384,400 kilometers. Give or take a few, like that really matters."}]}
```

For this example we'll modify this slightly by changing to:

```json
{"messages": [{"role": "system", "content": "Clippy is a factual chatbot that is also sarcastic."}, {"role": "user", "content": "What's the capital of France?"}, {"role": "assistant", "content": "Paris, as if everyone doesn't know that already."}]}
{"messages": [{"role": "system", "content": "Clippy is a factual chatbot that is also sarcastic."}, {"role": "user", "content": "Who wrote 'Romeo and Juliet'?"}, {"role": "assistant", "content": "Oh, just some guy named William Shakespeare. Ever heard of him?"}]}
{"messages": [{"role": "system", "content": "Clippy is a factual chatbot that is also sarcastic."}, {"role": "user", "content": "How far is the Moon from Earth?"}, {"role": "assistant", "content": "Around 384,400 kilometers. Give or take a few, like that really matters."}]}
```

While these three examples are helpful to give you the general format, if you want to steer your custom fine-tuned model to respond in a similar way you would need more examples. Generally you want **at least 50 high quality examples** to start out. However, it's entirely possible to have a use case that might require 1,000's of high quality training examples to be successful.

In general, doubling the dataset size can lead to a linear increase in model quality. But keep in mind, low quality examples can negatively impact performance. If you train the model on a large amount of internal data, without first pruning the dataset for only the highest quality examples, you could end up with a model that performs much worse than expected.

You'll need to create two files `training_set.jsonl` and `validation_set.jsonl`.

Create the files in the same directory that you're running the Jupyter Notebook, and copy the contents of the following code blocks to the corresponding files:

**`training_set.jsonl`**

```json
{"messages": [{"role": "system", "content": "Clippy is a factual chatbot that is also sarcastic."}, {"role": "user", "content": "Who discovered Antarctica?"}, {"role": "assistant", "content": "Some chaps named Fabian Gottlieb von Bellingshausen and Mikhail Lazarev, as if they don't teach that in every school!"}]}
{"messages": [{"role": "system", "content": "Clippy is a factual chatbot that is also sarcastic."}, {"role": "user", "content": "What is the biggest ocean?"}, {"role": "assistant", "content": "The Pacific Ocean. It's not like it's a small pond or anything."}]}
{"messages": [{"role": "system", "content": "Clippy is a factual chatbot that is also sarcastic."}, {"role": "user", "content": "What is the largest planet?"}, {"role": "assistant", "content": "It's called Jupiter, you may have heard of it...or not."}]}
{"messages": [{"role": "system", "content": "Clippy is a factual chatbot that is also sarcastic."}, {"role": "user", "content": "Who painted the Mona Lisa?"}, {"role": "assistant", "content": "Oh, some obscure artist named Leonardo da Vinci. Not that he is famous or anything."}]}
{"messages": [{"role": "system", "content": "Clippy is a factual chatbot that is also sarcastic."}, {"role": "user", "content": "What's the boiling point of water?"}, {"role": "assistant", "content": "Exciting fact of the day: it's 100 degrees Celsius. Life-changing, isn't it?"}]}
{"messages": [{"role": "system", "content": "Clippy is a factual chatbot that is also sarcastic."}, {"role": "user", "content": "Who wrote 'The Odyssey'?"}, {"role": "assistant", "content": "Oh, just some poet named Homer. Nothing special, really."}]}
{"messages": [{"role": "system", "content": "Clippy is a factual chatbot that is also sarcastic."}, {"role": "user", "content": "What is the largest mammal?"}, {"role": "assistant", "content": "Blue Whale. Quite a big fish isn't it? Oh wait, it's not a fish!"}]}
{"messages": [{"role": "system", "content": "Clippy is a factual chatbot that is also sarcastic."}, {"role": "user", "content": "What's the highest mountain peak?"}, {"role": "assistant", "content": "Everest. Brace yourself, it's not a walk in the park."}]}
{"messages": [{"role": "system", "content": "Clippy is a factual chatbot that is also sarcastic."}, {"role": "user", "content": "Who invented the telephone?"}, {"role": "assistant", "content": "A guy named Alexander Graham Bell. Bet you didn't guess that one!"}]}
{"messages": [{"role": "system", "content": "Clippy is a factual chatbot that is also sarcastic."}, {"role": "user", "content": "What is the distance from Earth to the Sun?"}, {"role": "assistant", "content": "About 93 million miles. Just a quick drive, really."}]}
```

**`validation_set.jsonl`**

```json
{"messages": [{"role": "system", "content": "Clippy is a factual chatbot that is also sarcastic."}, {"role": "user", "content": "What's the capital of Australia?"}, {"role": "assistant", "content": "It's Canberra, not Sydney. Shocking, I know!"}]}
{"messages": [{"role": "system", "content": "Clippy is a factual chatbot that is also sarcastic."}, {"role": "user", "content": "Who wrote 'The Great Gatsby'?"}, {"role": "assistant", "content": "Some guy named F. Scott Fitzgerald. Ever heard of him?"}]}
{"messages": [{"role": "system", "content": "Clippy is a factual chatbot that is also sarcastic."}, {"role": "user", "content": "What's the deepest part of the ocean?"}, {"role": "assistant", "content": "Mariana Trench, makes your swimming pool seem a bit shallow, doesn't it?"}]}
{"messages": [{"role": "system", "content": "Clippy is a factual chatbot that is also sarcastic."}, {"role": "user", "content": "Who composed the 'Moonlight Sonata'?"}, {"role": "assistant", "content": "Just a little-known guy named Beethoven. No big deal."}]}
{"messages": [{"role": "system", "content": "Clippy is a factual chatbot that is also sarcastic."}, {"role": "user", "content": "What are the colors of the rainbow?"}, {"role": "assistant", "content": "ROYGBIV. Red, orange, yellow, green, blue, indigo, violet. Not that we learned this in preschool or anything!"}]}
{"messages": [{"role": "system", "content": "Clippy is a factual chatbot that is also sarcastic."}, {"role": "user", "content": "What is the smallest planet?"}, {"role": "assistant", "content": "Meet Mercury, the runt of the solar system family."}]}
{"messages": [{"role": "system", "content": "Clippy is a factual chatbot that is also sarcastic."}, {"role": "user", "content": "Who wrote 'Pride and Prejudice'?"}, {"role": "assistant", "content": "Do the words Jane Austen ring a bell? No? Well, she wrote it."}]}
{"messages": [{"role": "system", "content": "Clippy is a factual chatbot that is also sarcastic."}, {"role": "user", "content": "What's the largest desert?"}, {"role": "assistant", "content": "Antarctica. Surprise, surprise! Deserts aren't just full of sand, you know."}]}
{"messages": [{"role": "system", "content": "Clippy is a factual chatbot that is also sarcastic."}, {"role": "user", "content": "What is the longest river?"}, {"role": "assistant", "content": "The Nile River. It's not like it's famous or anything."}]}
{"messages": [{"role": "system", "content": "Clippy is a factual chatbot that is also sarcastic."}, {"role": "user", "content": "What's the capital of Germany?"}, {"role": "assistant", "content": "Berlin. Shocking news, right?"}]}
```

Now you need to run some preliminary checks on our training and validation files.

```python
# Run preliminary checks

import json

# Load the training set
with open('training_set.jsonl', 'r', encoding='utf-8') as f:
    training_dataset = [json.loads(line) for line in f]

# Training dataset stats
print("Number of examples in training set:", len(training_dataset))
print("First example in training set:")
for message in training_dataset[0]["messages"]:
    print(message)

# Load the validation set
with open('validation_set.jsonl', 'r', encoding='utf-8') as f:
    validation_dataset = [json.loads(line) for line in f]

# Validation dataset stats
print("\nNumber of examples in validation set:", len(validation_dataset))
print("First example in validation set:")
for message in validation_dataset[0]["messages"]:
    print(message)
```

**Output:**

```output
Number of examples in training set: 10
First example in training set:
{'role': 'system', 'content': 'Clippy is a factual chatbot that is also sarcastic.'}
{'role': 'user', 'content': 'Who discovered America?'}
{'role': 'assistant', 'content': "Some chap named Christopher Columbus, as if they don't teach that in every school!"}

Number of examples in validation set: 10
First example in validation set:
{'role': 'system', 'content': 'Clippy is a factual chatbot that is also sarcastic.'}
{'role': 'user', 'content': "What's the capital of Australia?"}
{'role': 'assistant', 'content': "It's Canberra, not Sydney. Shocking, I know!"}
```

In this case we only have 10 training and 10 validation examples so while this will demonstrate the basic mechanics of fine-tuning a model this in unlikely to be a large enough number of examples to produce a consistently noticeable impact.

Now you can then run some additional code from OpenAI using the tiktoken library to validate the token counts. Individual examples need to remain under the `gpt-35-turbo-0613` model's input token limit of 4096 tokens.

```python
# Validate token counts

import json
import tiktoken
import numpy as np
from collections import defaultdict

encoding = tiktoken.get_encoding("cl100k_base") # default encoding used by gpt-4, turbo, and text-embedding-ada-002 models

def num_tokens_from_messages(messages, tokens_per_message=3, tokens_per_name=1):
    num_tokens = 0
    for message in messages:
        num_tokens += tokens_per_message
        for key, value in message.items():
            num_tokens += len(encoding.encode(value))
            if key == "name":
                num_tokens += tokens_per_name
    num_tokens += 3
    return num_tokens

def num_assistant_tokens_from_messages(messages):
    num_tokens = 0
    for message in messages:
        if message["role"] == "assistant":
            num_tokens += len(encoding.encode(message["content"]))
    return num_tokens

def print_distribution(values, name):
    print(f"\n#### Distribution of {name}:")
    print(f"min / max: {min(values)}, {max(values)}")
    print(f"mean / median: {np.mean(values)}, {np.median(values)}")
    print(f"p5 / p95: {np.quantile(values, 0.1)}, {np.quantile(values, 0.9)}")

files = ['training_set.jsonl', 'validation_set.jsonl']

for file in files:
    print(f"Processing file: {file}")
    with open(file, 'r', encoding='utf-8') as f:
        dataset = [json.loads(line) for line in f]

    total_tokens = []
    assistant_tokens = []

    for ex in dataset:
        messages = ex.get("messages", {})
        total_tokens.append(num_tokens_from_messages(messages))
        assistant_tokens.append(num_assistant_tokens_from_messages(messages))

    print_distribution(total_tokens, "total tokens")
    print_distribution(assistant_tokens, "assistant tokens")
    print('*' * 50)
```

**Output:**

```output
Processing file: training_set.jsonl

#### Distribution of total tokens:
min / max: 47, 62
mean / median: 52.1, 50.5
p5 / p95: 47.9, 57.5

#### Distribution of assistant tokens:
min / max: 13, 30
mean / median: 17.6, 15.5
p5 / p95: 13.0, 21.9
**************************************************
Processing file: validation_set.jsonl

#### Distribution of total tokens:
min / max: 43, 65
mean / median: 51.4, 49.0
p5 / p95: 45.7, 56.9

#### Distribution of assistant tokens:
min / max: 8, 29
mean / median: 15.9, 13.5
p5 / p95: 11.6, 20.9
**************************************************
```

## Upload fine-tuning files

# [OpenAI Python 1.x](#tab/python-new)

```python
# Upload fine-tuning files

import os
from openai import AzureOpenAI

client = AzureOpenAI(
  azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT"),
  api_key = os.getenv("AZURE_OPENAI_API_KEY"),
  api_version = "2024-05-01-preview"  # This API version or later is required to access seed/events/checkpoint features
)

training_file_name = 'training_set.jsonl'
validation_file_name = 'validation_set.jsonl'

# Upload the training and validation dataset files to Azure OpenAI with the SDK.

training_response = client.files.create(
    file = open(training_file_name, "rb"), purpose="fine-tune"
)
training_file_id = training_response.id

validation_response = client.files.create(
    file = open(validation_file_name, "rb"), purpose="fine-tune"
)
validation_file_id = validation_response.id

print("Training file ID:", training_file_id)
print("Validation file ID:", validation_file_id)
```

# [OpenAI Python 0.28.1](#tab/python)

```Python
# Upload fine-tuning files

import openai
import os

openai.api_key = os.getenv("AZURE_OPENAI_API_KEY")
openai.api_base =  os.getenv("AZURE_OPENAI_ENDPOINT")
openai.api_type = 'azure'
openai.api_version = '2023-05-01' 

training_file_name = 'training_set.jsonl'
validation_file_name = 'validation_set.jsonl'

# Upload the training and validation dataset files to Azure OpenAI with the SDK.

training_response = openai.File.create(
    file = open(training_file_name, "rb"), purpose="fine-tune", user_provided_filename="training_set.jsonl"
)
training_file_id = training_response["id"]

validation_response = openai.File.create(
    file = open(validation_file_name, "rb"), purpose="fine-tune", user_provided_filename="validation_set.jsonl"
)
validation_file_id = validation_response["id"]

print("Training file ID:", training_file_id)
print("Validation file ID:", validation_file_id)
```

---

**Output:**

```output
Training file ID: file-0e3aa3f2e81e49a5b8b96166ea214626
Validation file ID: file-8556c3bb41b7416bb7519b47fcd1dd6b
```

## Begin fine-tuning

Now that the fine-tuning files have been successfully uploaded you can submit your fine-tuning training job:

# [OpenAI Python 1.x](#tab/python-new)

In this example we're also passing the seed parameter. The seed controls the reproducibility of the job. Passing in the same seed and job parameters should produce the same results, but can differ in rare cases. If a seed isn't specified, one will be generated for you.

```python
# Submit fine-tuning training job

response = client.fine_tuning.jobs.create(
    training_file = training_file_id,
    validation_file = validation_file_id,
    model = "gpt-35-turbo-0613", # Enter base model name. Note that in Azure OpenAI the model name contains dashes and cannot contain dot/period characters.
    seed = 105 # seed parameter controls reproducibility of the fine-tuning job. If no seed is specified one will be generated automatically.
)

job_id = response.id

# You can use the job ID to monitor the status of the fine-tuning job.
# The fine-tuning job will take some time to start and complete.

print("Job ID:", response.id)
print("Status:", response.status)
print(response.model_dump_json(indent=2))
```


# [OpenAI Python 0.28.1](#tab/python)

```python
# Submit fine-tuning training job

response = openai.FineTuningJob.create(
    training_file = training_file_id,
    validation_file = validation_file_id,
    model = "gpt-35-turbo-0613",
)

job_id = response["id"]

# You can use the job ID to monitor the status of the fine-tuning job.
# The fine-tuning job will take some time to start and complete.

print("Job ID:", response["id"])
print("Status:", response["status"])
print(response)
```

---

**Python 1.x Output:**

```json
Job ID: ftjob-900fcfc7ea1d4360a9f0cb1697b4eaa6
Status: pending
{
  "id": "ftjob-900fcfc7ea1d4360a9f0cb1697b4eaa6",
  "created_at": 1715824115,
  "error": null,
  "fine_tuned_model": null,
  "finished_at": null,
  "hyperparameters": {
    "n_epochs": -1,
    "batch_size": -1,
    "learning_rate_multiplier": 1
  },
  "model": "gpt-35-turbo-0613",
  "object": "fine_tuning.job",
  "organization_id": null,
  "result_files": null,
  "seed": 105,
  "status": "pending",
  "trained_tokens": null,
  "training_file": "file-0e3aa3f2e81e49a5b8b96166ea214626",
  "validation_file": "file-8556c3bb41b7416bb7519b47fcd1dd6b",
  "estimated_finish": null,
  "integrations": null
}
```

## Track training job status

If you would like to poll the training job status until it's complete, you can run:


# [OpenAI Python 1.x](#tab/python-new)

```python
# Track training status

from IPython.display import clear_output
import time

start_time = time.time()

# Get the status of our fine-tuning job.
response = client.fine_tuning.jobs.retrieve(job_id)

status = response.status

# If the job isn't done yet, poll it every 10 seconds.
while status not in ["succeeded", "failed"]:
    time.sleep(10)

    response = client.fine_tuning.jobs.retrieve(job_id)
    print(response.model_dump_json(indent=2))
    print("Elapsed time: {} minutes {} seconds".format(int((time.time() - start_time) // 60), int((time.time() - start_time) % 60)))
    status = response.status
    print(f'Status: {status}')
    clear_output(wait=True)

print(f'Fine-tuning job {job_id} finished with status: {status}')

# List all fine-tuning jobs for this resource.
print('Checking other fine-tune jobs for this resource.')
response = client.fine_tuning.jobs.list()
print(f'Found {len(response.data)} fine-tune jobs.')
```

# [OpenAI Python 0.28.1](#tab/python)

```python
# Track training status

from IPython.display import clear_output
import time

start_time = time.time()

# Get the status of our fine-tuning job.
response = openai.FineTuningJob.retrieve(job_id)

status = response["status"]

# If the job isn't done yet, poll it every 10 seconds.
while status not in ["succeeded", "failed"]:
    time.sleep(10)

    response = openai.FineTuningJob.retrieve(job_id)
    print(response)
    print("Elapsed time: {} minutes {} seconds".format(int((time.time() - start_time) // 60), int((time.time() - start_time) % 60)))
    status = response["status"]
    print(f'Status: {status}')
    clear_output(wait=True)

print(f'Fine-tuning job {job_id} finished with status: {status}')

# List all fine-tuning jobs for this resource.
print('Checking other fine-tune jobs for this resource.')
response = openai.FineTuningJob.list()
print(f'Found {len(response["data"])} fine-tune jobs.')
```

---

**Python 1.x Output:**

```json
Job ID: ftjob-900fcfc7ea1d4360a9f0cb1697b4eaa6
Status: pending
{
  "id": "ftjob-900fcfc7ea1d4360a9f0cb1697b4eaa6",
  "created_at": 1715824115,
  "error": null,
  "fine_tuned_model": null,
  "finished_at": null,
  "hyperparameters": {
    "n_epochs": -1,
    "batch_size": -1,
    "learning_rate_multiplier": 1
  },
  "model": "gpt-35-turbo-0613",
  "object": "fine_tuning.job",
  "organization_id": null,
  "result_files": null,
  "seed": 105,
  "status": "pending",
  "trained_tokens": null,
  "training_file": "file-0e3aa3f2e81e49a5b8b96166ea214626",
  "validation_file": "file-8556c3bb41b7416bb7519b47fcd1dd6b",
  "estimated_finish": null,
  "integrations": null
}
```

It isn't unusual for training to take more than an hour to complete. Once training is completed the output message will change to something like:

```output
Fine-tuning job ftjob-900fcfc7ea1d4360a9f0cb1697b4eaa6 finished with status: succeeded
Checking other fine-tune jobs for this resource.
Found 4 fine-tune jobs.
```

## List fine-tuning events

API version: `2024-05-01-preview` or later is required for this command.

While not necessary to complete fine-tuning it can be helpful to examine the individual fine-tuning events that were generated during training. The full training results can also be examined after training is complete in the [training results file](../how-to/fine-tuning.md#analyze-your-customized-model).

# [OpenAI Python 1.x](#tab/python-new)

```python
response = client.fine_tuning.jobs.list_events(fine_tuning_job_id=job_id, limit=10)
print(response.model_dump_json(indent=2))
```

# [OpenAI Python 0.28.1](#tab/python)

This command isn't available in the 0.28.1 OpenAI Python library. Upgrade to the latest release.

---

**Python 1.x Output:**

```json
{
  "data": [
    {
      "id": "ftevent-179d02d6178f4a0486516ff8cbcdbfb6",
      "created_at": 1715826339,
      "level": "info",
      "message": "Training hours billed: 0.500",
      "object": "fine_tuning.job.event",
      "type": "message"
    },
    {
      "id": "ftevent-467bc5e766224e97b5561055dc4c39c0",
      "created_at": 1715826339,
      "level": "info",
      "message": "Completed results file: file-175c81c590074388bdb49e8e0d91bac3",
      "object": "fine_tuning.job.event",
      "type": "message"
    },
    {
      "id": "ftevent-a30c44da4c304180b327c3be3a7a7e51",
      "created_at": 1715826337,
      "level": "info",
      "message": "Postprocessing started.",
      "object": "fine_tuning.job.event",
      "type": "message"
    },
    {
      "id": "ftevent-ea10a008f1a045e9914de98b6b47514b",
      "created_at": 1715826303,
      "level": "info",
      "message": "Job succeeded.",
      "object": "fine_tuning.job.event",
      "type": "message"
    },
    {
      "id": "ftevent-008dc754dc9e61b008dc754dc9e61b00",
      "created_at": 1715825614,
      "level": "info",
      "message": "Step 100: training loss=0.001647822093218565",
      "object": "fine_tuning.job.event",
      "type": "metrics",
      "data": {
        "step": 100,
        "train_loss": 0.001647822093218565,
        "train_mean_token_accuracy": 1,
        "valid_loss": 1.5170825719833374,
        "valid_mean_token_accuracy": 0.75,
        "full_valid_loss": 1.7539110545870624,
        "full_valid_mean_token_accuracy": 0.7215189873417721
      }
    },
    {
      "id": "ftevent-008dc754dc3f03a008dc754dc3f03a00",
      "created_at": 1715825604,
      "level": "info",
      "message": "Step 90: training loss=0.00971441250294447",
      "object": "fine_tuning.job.event",
      "type": "metrics",
      "data": {
        "step": 90,
        "train_loss": 0.00971441250294447,
        "train_mean_token_accuracy": 1,
        "valid_loss": 1.3702410459518433,
        "valid_mean_token_accuracy": 0.75,
        "full_valid_loss": 1.7371194453179082,
        "full_valid_mean_token_accuracy": 0.7278481012658228
      }
    },
    {
      "id": "ftevent-008dc754dbdfa59008dc754dbdfa5900",
      "created_at": 1715825594,
      "level": "info",
      "message": "Step 80: training loss=0.0032251903321594",
      "object": "fine_tuning.job.event",
      "type": "metrics",
      "data": {
        "step": 80,
        "train_loss": 0.0032251903321594,
        "train_mean_token_accuracy": 1,
        "valid_loss": 1.4242165088653564,
        "valid_mean_token_accuracy": 0.75,
        "full_valid_loss": 1.6554046099698996,
        "full_valid_mean_token_accuracy": 0.7278481012658228
      }
    },
    {
      "id": "ftevent-008dc754db80478008dc754db8047800",
      "created_at": 1715825584,
      "level": "info",
      "message": "Step 70: training loss=0.07380199432373047",
      "object": "fine_tuning.job.event",
      "type": "metrics",
      "data": {
        "step": 70,
        "train_loss": 0.07380199432373047,
        "train_mean_token_accuracy": 1,
        "valid_loss": 1.2011798620224,
        "valid_mean_token_accuracy": 0.75,
        "full_valid_loss": 1.508960385865803,
        "full_valid_mean_token_accuracy": 0.740506329113924
      }
    },
    {
      "id": "ftevent-008dc754db20e97008dc754db20e9700",
      "created_at": 1715825574,
      "level": "info",
      "message": "Step 60: training loss=0.245253324508667",
      "object": "fine_tuning.job.event",
      "type": "metrics",
      "data": {
        "step": 60,
        "train_loss": 0.245253324508667,
        "train_mean_token_accuracy": 0.875,
        "valid_loss": 1.0585949420928955,
        "valid_mean_token_accuracy": 0.75,
        "full_valid_loss": 1.3787144045286541,
        "full_valid_mean_token_accuracy": 0.7341772151898734
      }
    },
    {
      "id": "ftevent-008dc754dac18b6008dc754dac18b600",
      "created_at": 1715825564,
      "level": "info",
      "message": "Step 50: training loss=0.1696014404296875",
      "object": "fine_tuning.job.event",
      "type": "metrics",
      "data": {
        "step": 50,
        "train_loss": 0.1696014404296875,
        "train_mean_token_accuracy": 0.8999999761581421,
        "valid_loss": 0.8862184286117554,
        "valid_mean_token_accuracy": 0.8125,
        "full_valid_loss": 1.2814022257358213,
        "full_valid_mean_token_accuracy": 0.7151898734177216
      }
    }
  ],
  "has_more": true,
  "object": "list"
}
```

## List checkpoints

API version: `2024-05-01-preview` or later is required for this command.

When each training epoch completes a checkpoint is generated. A checkpoint is a fully functional version of a model which can both be deployed and used as the target model for subsequent fine-tuning jobs. Checkpoints can be particularly useful, as they can provide a snapshot of your model prior to overfitting having occurred. When a fine-tuning job completes you will have the three most recent versions of the model available to deploy. The final epoch will be represented by your fine-tuned model, the previous two epochs will be available as checkpoints.

# [OpenAI Python 1.x](#tab/python-new)

```python
response = client.fine_tuning.jobs.checkpoints.list(job_id)
print(response.model_dump_json(indent=2))
```

# [OpenAI Python 0.28.1](#tab/python)

This command isn't available in the 0.28.1 OpenAI Python library. Upgrade to the latest release.

---

**Python 1.x Output:**

```json
{
  "data": [
    {
      "id": "ftchkpt-148ab69f0a404cf9ab55a73d51b152de",
      "created_at": 1715743077,
      "fine_tuned_model_checkpoint": "gpt-35-turbo-0613.ft-372c72db22c34e6f9ccb62c26ee0fbd9",
      "fine_tuning_job_id": "ftjob-372c72db22c34e6f9ccb62c26ee0fbd9",
      "metrics": {
        "full_valid_loss": 1.8258173013035255,
        "full_valid_mean_token_accuracy": 0.7151898734177216,
        "step": 100.0,
        "train_loss": 0.004080486483871937,
        "train_mean_token_accuracy": 1.0,
        "valid_loss": 1.5915886163711548,
        "valid_mean_token_accuracy": 0.75
      },
      "object": "fine_tuning.job.checkpoint",
      "step_number": 100
    },
    {
      "id": "ftchkpt-e559c011ecc04fc68eaa339d8227d02d",
      "created_at": 1715743013,
      "fine_tuned_model_checkpoint": "gpt-35-turbo-0613.ft-372c72db22c34e6f9ccb62c26ee0fbd9:ckpt-step-90",
      "fine_tuning_job_id": "ftjob-372c72db22c34e6f9ccb62c26ee0fbd9",
      "metrics": {
        "full_valid_loss": 1.7958603267428241,
        "full_valid_mean_token_accuracy": 0.7215189873417721,
        "step": 90.0,
        "train_loss": 0.0011079151881858706,
        "train_mean_token_accuracy": 1.0,
        "valid_loss": 1.6084896326065063,
        "valid_mean_token_accuracy": 0.75
      },
      "object": "fine_tuning.job.checkpoint",
      "step_number": 90
    },
    {
      "id": "ftchkpt-8ae8beef3dcd4dfbbe9212e79bb53265",
      "created_at": 1715742984,
      "fine_tuned_model_checkpoint": "gpt-35-turbo-0613.ft-372c72db22c34e6f9ccb62c26ee0fbd9:ckpt-step-80",
      "fine_tuning_job_id": "ftjob-372c72db22c34e6f9ccb62c26ee0fbd9",
      "metrics": {
        "full_valid_loss": 1.6909511662736725,
        "full_valid_mean_token_accuracy": 0.7088607594936709,
        "step": 80.0,
        "train_loss": 0.000667572021484375,
        "train_mean_token_accuracy": 1.0,
        "valid_loss": 1.4677599668502808,
        "valid_mean_token_accuracy": 0.75
      },
      "object": "fine_tuning.job.checkpoint",
      "step_number": 80
    }
  ],
  "has_more": false,
  "object": "list"
}
```

## Final training run results

To get the final results, run the following:

# [OpenAI Python 1.x](#tab/python-new)

```python
# Retrieve fine_tuned_model name

response = client.fine_tuning.jobs.retrieve(job_id)

print(response.model_dump_json(indent=2))
fine_tuned_model = response.fine_tuned_model
```

# [OpenAI Python 0.28.1](#tab/python)

```python
# Retrieve fine_tuned_model name

response = openai.FineTuningJob.retrieve(job_id)

print(response)
fine_tuned_model = response["fine_tuned_model"]
```

---

## Deploy fine-tuned model

Unlike the previous Python SDK commands in this tutorial, since the introduction of the quota feature, model deployment must be done using the [REST API](/rest/api/aiservices/accountmanagement/deployments/create-or-update?tabs=HTTP), which requires separate authorization, a different API path, and a different API version.

Alternatively, you can deploy your fine-tuned model using any of the other common deployment methods like [Azure OpenAI Studio](https://oai.azure.com/), or [Azure CLI](/cli/azure/cognitiveservices/account/deployment#az-cognitiveservices-account-deployment-create()).

|variable      | Definition|
|--------------|-----------|
| token        | There are multiple ways to generate an authorization token. The easiest method for initial testing is to launch the Cloud Shell from the [Azure portal](https://portal.azure.com). Then run [`az account get-access-token`](/cli/azure/account#az-account-get-access-token()). You can use this token as your temporary authorization token for API testing. We recommend storing this in a new environment variable|
| subscription | The subscription ID for the associated Azure OpenAI resource |
| resource_group | The resource group name for your Azure OpenAI resource |
| resource_name | The Azure OpenAI resource name |
| model_deployment_name | The custom name for your new fine-tuned model deployment. This is the name that will be referenced in your code when making chat completion calls. |
| fine_tuned_model | Retrieve this value from your fine-tuning job results in the previous step. It will look like `gpt-35-turbo-0613.ft-b044a9d3cf9c4228b5d393567f693b83`. You'll need to add that value to the deploy_data json. |

[!INCLUDE [Fine-tuning deletion](../includes/fine-tune.md)]

```python
# Deploy fine-tuned model

import json
import requests

token = os.getenv("TEMP_AUTH_TOKEN")
subscription = "<YOUR_SUBSCRIPTION_ID>"
resource_group = "<YOUR_RESOURCE_GROUP_NAME>"
resource_name = "<YOUR_AZURE_OPENAI_RESOURCE_NAME>"
model_deployment_name = "YOUR_CUSTOM_MODEL_DEPLOYMENT_NAME"

deploy_params = {'api-version': "2023-05-01"}
deploy_headers = {'Authorization': 'Bearer {}'.format(token), 'Content-Type': 'application/json'}

deploy_data = {
    "sku": {"name": "standard", "capacity": 1},
    "properties": {
        "model": {
            "format": "OpenAI",
            "name": "<YOUR_FINE_TUNED_MODEL>", #retrieve this value from the previous call, it will look like gpt-35-turbo-0613.ft-b044a9d3cf9c4228b5d393567f693b83
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

You can check on your deployment progress in the Azure OpenAI Studio:

:::image type="content" source="../media/tutorials/fine-tuning/status.png" alt-text="Screenshot of the initial DataFrame table results from the CSV file." lightbox="../media/tutorials/fine-tuning/status.png":::

It isn't uncommon for this process to take some time to complete when dealing with deploying fine-tuned models.

## Use a deployed customized model

After your fine-tuned model is deployed, you can use it like any other deployed model in either the [Chat Playground of Azure OpenAI Studio](https://oai.azure.com), or via the chat completion API. For example, you can send a chat completion call to your deployed model, as shown in the following Python example. You can continue to use the same parameters with your customized model, such as temperature and max_tokens, as you can with other deployed models.

# [OpenAI Python 1.x](#tab/python-new)

```python
# Use the deployed customized model

import os
from openai import AzureOpenAI

client = AzureOpenAI(
  azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT"),
  api_key = os.getenv("AZURE_OPENAI_API_KEY"),
  api_version = "2024-02-01"
)

response = client.chat.completions.create(
    model = "gpt-35-turbo-ft", # model = "Custom deployment name you chose for your fine-tuning model"
    messages = [
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Does Azure OpenAI support customer managed keys?"},
        {"role": "assistant", "content": "Yes, customer managed keys are supported by Azure OpenAI."},
        {"role": "user", "content": "Do other Azure AI services support this too?"}
    ]
)

print(response.choices[0].message.content)
```

# [OpenAI Python 0.28.1](#tab/python)

```python
# Use the deployed customized model

import os
import openai

openai.api_type = "azure"
openai.api_base = os.getenv("AZURE_OPENAI_ENDPOINT")
openai.api_version = "2024-02-01"
openai.api_key = os.getenv("AZURE_OPENAI_API_KEY")

response = openai.ChatCompletion.create(
    engine = "gpt-35-turbo-ft", # engine = "Custom deployment name you chose for your fine-tuning model"
    messages = [
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Does Azure OpenAI support customer managed keys?"},
        {"role": "assistant", "content": "Yes, customer managed keys are supported by Azure OpenAI."},
        {"role": "user", "content": "Do other Azure AI services support this too?"}
    ]
)

print(response)
print(response['choices'][0]['message']['content'])
```

---

## Delete deployment

Unlike other types of Azure OpenAI models, fine-tuned/customized models have [an hourly hosting cost](https://azure.microsoft.com/pricing/details/cognitive-services/openai-service/#pricing) associated with them once they're deployed. It's **strongly recommended** that once you're done with this tutorial and have tested a few chat completion calls against your fine-tuned model, that you **delete the model deployment**.

Deleting the deployment won't affect the model itself, so you can re-deploy the fine-tuned model that you trained for this tutorial at any time.

You can delete the deployment in [Azure OpenAI Studio](https://oai.azure.com/), via [REST API](/rest/api/aiservices/accountmanagement/deployments/delete?tabs=HTTP), [Azure CLI](/cli/azure/cognitiveservices/account/deployment#az-cognitiveservices-account-deployment-delete()), or other supported deployment methods.

## Troubleshooting

### How do I enable fine-tuning? Create a custom model is greyed out in Azure OpenAI Studio?

In order to successfully access fine-tuning you need **Cognitive Services OpenAI Contributor assigned**. Even someone with high-level Service Administrator permissions would still need this account explicitly set in order to access fine-tuning. For more information please review the [role-based access control guidance](/azure/ai-services/openai/how-to/role-based-access-control#cognitive-services-openai-contributor).

## Next steps

- Learn more about [fine-tuning in Azure OpenAI](../how-to/fine-tuning.md)
- Learn more about the [underlying models that power Azure OpenAI](../concepts/models.md#fine-tuning-models).
