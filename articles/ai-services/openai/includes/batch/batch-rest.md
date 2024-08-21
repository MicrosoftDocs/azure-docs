---
title: Azure OpenAI Global Batch REST
titleSuffix: Azure OpenAI Service
description: Azure OpenAI model global batch REST
manager: nitinme
ms.service: azure-ai-openai
ms.topic: include
ms.date: 07/22/2024
---

## Prerequisites

* An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services?azure-portal=true).
* An Azure OpenAI resource with a model of the deployment type `Global-Batch` deployed. You can refer to the [resource creation and model deployment guide](../../how-to/create-resource.md) for help with this process.


## Preparing your batch file

Like [fine-tuning](../../how-to/fine-tuning.md), global batch uses files in JSON lines (`.jsonl`) format. Below are some example files with different types of supported content:

### Input format

# [Standard input](#tab/standard-input)

```json
{"custom_id": "task-0", "method": "POST", "url": "/chat/completions", "body": {"model": "REPLACE-WITH-MODEL-DEPLOYMENT-NAME", "messages": [{"role": "system", "content": "You are an AI assistant that helps people find information."}, {"role": "user", "content": "When was Microsoft founded?"}]}}
{"custom_id": "task-1", "method": "POST", "url": "/chat/completions", "body": {"model": "REPLACE-WITH-MODEL-DEPLOYMENT-NAME", "messages": [{"role": "system", "content": "You are an AI assistant that helps people find information."}, {"role": "user", "content": "When was the first XBOX released?"}]}}
{"custom_id": "task-2", "method": "POST", "url": "/chat/completions", "body": {"model": "REPLACE-WITH-MODEL-DEPLOYMENT-NAME", "messages": [{"role": "system", "content": "You are an AI assistant that helps people find information."}, {"role": "user", "content": "What is Altair Basic?"}]}}
```

# [Base64 encoded image](#tab/base64)

### Input with base64 encoded image

```json
{"custom_id": "request-1", "method": "POST", "url": "/chat/completions", "body": {"model": "REPLACE-WITH-MODEL-DEPLOYMENT-NAME", "messages": [{"role": "system", "content": "You are a helpful assistant."},{"role": "user", "content": [{"type":"text","text":"Describe this picture:"},{"type":"image_url","image_url":{"url":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVEiJtZZPbBtFFMZ/M7ubXdtdb1xSFyeilBapySVU8h8OoFaooFSqiihIVIpQBKci6KEg9Q6H9kovIHoCIVQJJCKE1ENFjnAgcaSGC6rEnxBwA04Tx43t2FnvDAfjkNibxgHxnWb2e/u992bee7tCa00YFsffekFY+nUzFtjW0LrvjRXrCDIAaPLlW0nHL0SsZtVoaF98mLrx3pdhOqLtYPHChahZcYYO7KvPFxvRl5XPp1sN3adWiD1ZAqD6XYK1b/dvE5IWryTt2udLFedwc1+9kLp+vbbpoDh+6TklxBeAi9TL0taeWpdmZzQDry0AcO+jQ12RyohqqoYoo8RDwJrU+qXkjWtfi8Xxt58BdQuwQs9qC/afLwCw8tnQbqYAPsgxE1S6F3EAIXux2oQFKm0ihMsOF71dHYx+f3NND68ghCu1YIoePPQN1pGRABkJ6Bus96CutRZMydTl+TvuiRW1m3n0eDl0vRPcEysqdXn+jsQPsrHMquGeXEaY4Yk4wxWcY5V/9scqOMOVUFthatyTy8QyqwZ+kDURKoMWxNKr2EeqVKcTNOajqKoBgOE28U4tdQl5p5bwCw7BWquaZSzAPlwjlithJtp3pTImSqQRrb2Z8PHGigD4RZuNX6JYj6wj7O4TFLbCO/Mn/m8R+h6rYSUb3ekokRY6f/YukArN979jcW+V/S8g0eT/N3VN3kTqWbQ428m9/8k0P/1aIhF36PccEl6EhOcAUCrXKZXXWS3XKd2vc/TRBG9O5ELC17MmWubD2nKhUKZa26Ba2+D3P+4/MNCFwg59oWVeYhkzgN/JDR8deKBoD7Y+ljEjGZ0sosXVTvbc6RHirr2reNy1OXd6pJsQ+gqjk8VWFYmHrwBzW/n+uMPFiRwHB2I7ih8ciHFxIkd/3Omk5tCDV1t+2nNu5sxxpDFNx+huNhVT3/zMDz8usXC3ddaHBj1GHj/As08fwTS7Kt1HBTmyN29vdwAw+/wbwLVOJ3uAD1wi/dUH7Qei66PfyuRj4Ik9is+hglfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3kvgLI5AzFfo379UAAAAASUVORK5CYII="}}]}],"max_tokens": 1000}}
```

# [Image url](#tab/image-url)

### Input with image url

```json
{"custom_id": "request-1", "method": "POST", "url": "/chat/completions", "body": {"model": "REPLACE-WITH-MODEL-DEPLOYMENT-NAME", "messages": [{"role": "system", "content": "You are a helpful assistant."},{"role": "user", "content": [{"type": "text", "text": "What’s in this image?"},{"type": "image_url","image_url": {"url": "https://raw.githubusercontent.com/MicrosoftDocs/azure-docs/main/articles/ai-services/openai/media/how-to/generated-seattle.png"}}]}],"max_tokens": 1000}}
```

---

The `custom_id` is required to allow you to identify which individual batch request corresponds to a given response. Responses won't be returned in identical order to the order defined in the `.jsonl` batch file.

`model` attribute should be set to match the name of the Global Batch deployment you wish to target for inference responses.

### Create input file

For this article we'll create a file named `test.jsonl` and will copy the contents from standard input code block above to the file. You will need to modify and add your global batch deployment name to each line of the file.

## Upload batch file

Once your input file is prepared, you first need to upload the file to then be able to kick off a batch job. File upload can be done both programmatically or via the Studio. This example uses environment variables in place of the key and endpoint values. If you're unfamiliar with using environment variables with Python refer to one of our [quickstarts](../../chatgpt-quickstart.md) where the process of setting up the environment variables in explained step-by-step. 

[!INCLUDE [Azure key vault](~/reusable-content/ce-skilling/azure/includes/ai-services/security/azure-key-vault.md)]

```http
curl -X POST https://YOUR_RESOURCE_NAME.openai.azure.com/openai/files?api-version=2024-07-01-preview \
  -H "Content-Type: multipart/form-data" \
  -H "api-key: $AZURE_OPENAI_API_KEY" \
  -F "purpose=batch" \
  -F "file=@C:\\batch\\test.jsonl;type=application/json"
```

The above code assumes a particular file path for your test.jsonl file. Adjust this file path as necessary for your local system.

**Output:**

```json
{
  "status": "pending",
  "bytes": 686,
  "purpose": "batch",
  "filename": "test.jsonl",
  "id": "file-21006e70789246658b86a1fc205899a4",
  "created_at": 1721408291,
  "object": "file"
}

```


## Track file upload status

Depending on the size of your upload file it might take some time before it's fully uploaded and processed. To check on your file upload status run:

```http
curl https://YOUR_RESOURCE_NAME.openai.azure.com/openai/files/{file-id}?api-version=2024-07-01-preview \
  -H "api-key: $AZURE_OPENAI_API_KEY"
```

**Output:**

```json
{
  "status": "processed",
  "bytes": 686,
  "purpose": "batch",
  "filename": "test.jsonl",
  "id": "file-21006e70789246658b86a1fc205899a4",
  "created_at": 1721408291,
  "object": "file"
}

```

## Create batch job

Once your file has uploaded successfully by reaching a status of `processed` you can submit the file for batch processing.

```http
curl -X POST https://YOUR_RESOURCE_NAME.openai.azure.com/openai/batches?api-version=2024-07-01-preview \
  -H "api-key: $AZURE_OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "input_file_id": "file-abc123",
    "endpoint": "/chat/completions",
    "completion_window": "24h"
  }'
```

> [!NOTE]
> Currently the completion window must be set to 24h. If you set any other value than 24h your job will fail. Jobs taking longer than 24 hours will continue to execute until cancelled.

**Output:**

```json
{
  "cancelled_at": null,
  "cancelling_at": null,
  "completed_at": null,
  "completion_window": "24h",
  "created_at": "2024-07-19T17:13:57.2491382+00:00",
  "error_file_id": null,
  "expired_at": null,
  "expires_at": "2024-07-20T17:13:57.1918498+00:00",
  "failed_at": null,
  "finalizing_at": null,
  "id": "batch_fe3f047a-de39-4068-9008-346795bfc1db",
  "in_progress_at": null,
  "input_file_id": "file-21006e70789246658b86a1fc205899a4",
  "errors": null,
  "metadata": null,
  "object": "batch",
  "output_file_id": null,
  "request_counts": {
    "total": null,
    "completed": null,
    "failed": null
  },
  "status": "Validating"
}

```

## Track batch job progress


Once you have created batch job successfully you can monitor its progress either in the Studio or programatically. When checking batch job progress we recommend waiting at least 60 seconds in between each status call.

```http
curl https://YOUR_RESOURCE_NAME.openai.azure.com/openai/batches/{batch_id}?api-version=2024-07-01-preview \
  -H "api-key: $AZURE_OPENAI_API_KEY" 
```

**Output:**

```json
{
  "cancelled_at": null,
  "cancelling_at": null,
  "completed_at": null,
  "completion_window": "24h",
  "created_at": "2024-07-19T17:33:29.1619286+00:00",
  "error_file_id": null,
  "expired_at": null,
  "expires_at": "2024-07-20T17:33:29.1578141+00:00",
  "failed_at": null,
  "finalizing_at": null,
  "id": "batch_e0a7ee28-82c4-46a2-a3a0-c13b3c4e390b",
  "in_progress_at": null,
  "input_file_id": "file-c55ec4e859d54738a313d767718a2ac5",
  "errors": null,
  "metadata": null,
  "object": "batch",
  "output_file_id": null,
  "request_counts": {
    "total": null,
    "completed": null,
    "failed": null
  },
  "status": "Validating"
}

```

The following status values are possible:

|**Status**| **Description**|
|---|---|
|`validating`|The input file is being validated before the batch processing can begin. |
|`failed`|The input file has failed the validation process. |
| `in_progress`|The input file was successfully validated and the batch is currently running. |
| `finalizing`|The batch has completed and the results are being prepared. |
| `completed`|The batch has been completed and the results are ready.  |
| `expired`|The batch was not able to be completed within the 24-hour time window.|
| `cancelling`|The batch is being `cancelled` (This can take up to 10 minutes to go into effect.) |
| `cancelled`|the batch was `cancelled`.|


## Retrieve batch job output file

```http
curl https://YOUR_RESOURCE_NAME.openai.azure.com/openai/files/{output_file_id}/content?api-version=2024-07-01-preview \
  -H "api-key: $AZURE_OPENAI_API_KEY"  > batch_output.jsonl
```

### Additional batch commands

### Cancel batch

Cancels an in-progress batch. The batch will be in status `cancelling` for up to 10 minutes, before changing to `cancelled`, where it will have partial results (if any) available in the output file.

```http
curl https://YOUR_RESOURCE_NAME.openai.azure.com/openai/batches/{batch_id}/cancel?api-version=2024-07-01-preview \
  -H "api-key: $AZURE_OPENAI_API_KEY" 
```

### List batch

List all existing batch jobs for a given Azure OpenAI resource.

```http
curl https://YOUR_RESOURCE_NAME.openai.azure.com/openai/batches?api-version=2024-07-01-preview \
  -H "api-key: $AZURE_OPENAI_API_KEY" 
```
