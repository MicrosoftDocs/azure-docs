---
title: Azure OpenAI Global Batch Python
titleSuffix: Azure OpenAI Service
description: Azure OpenAI model global batch Python
manager: nitinme
ms.service: azure-ai-openai
ms.topic: include
ms.date: 07/22/2024
---

## Prerequisites

* An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services?azure-portal=true).
* Python 3.8 or later version
* The following Python library: `openai`
* [Jupyter Notebooks](https://jupyter.org/)
* An Azure OpenAI resource with a model of the deployment type `Global-Batch` deployed. You can refer to the [resource creation and model deployment guide](../../how-to/create-resource.md) for help with this process.

The steps in this article are intended to be run sequentially in [Jupyter Notebooks](https://jupyter.org/). For this reason we'll only instantiate the Azure OpenAI client once at the beginning of the examples. If you want to run a step out-of-order you'll often need to set up an Azure OpenAI client as part of that call.

Even if you already have the OpenAI Python library installed you might need to upgrade your installation to the latest version:

```cmd
!pip install openai --upgrade
```

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
{"custom_id": "request-1", "method": "POST", "url": "/chat/completions", "body": {"model": "REPLACE-WITH-MODEL-DEPLOYMENT-NAME", "messages": [{"role": "system", "content": "You are a helpful assistant."},{"role": "user", "content": [{"type": "text", "text": "What’s in this image?"},{"type": "image_url","image_url": {"url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg"}}]}],"max_tokens": 1000}}
```

---

The `custom_id` is required to allow you to identify which individual batch request corresponds to a given response. Responses won't be returned in identical order to the order defined in the `.jsonl` batch file.

`model` should be set to match the **model deployment name** of the global batch model you wish to target for inference responses.

### Create input file

For this article we'll create a file named `test.jsonl` and will copy the contents from standard input code block above to the file. You will need to modify and add your global batch deployment name to each line of the file. Save this file in the same directory that you're executing your Jupyter Notebook.

## Upload batch file

Once your input file is prepared, you first need to upload the file to then be able to kick off a batch job. File upload can be done both programmatically or via the Studio. This example uses environment variables in place of the key and endpoint values. If you're unfamiliar with using environment variables with Python refer to one of our [quickstarts](../../chatgpt-quickstart.md) where the process of setting up the environment variables in explained step-by-step.

```python
import os
from openai import AzureOpenAI
    
client = AzureOpenAI(
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),  
    api_version="2024-07-01-preview",
    azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
    )

# Upload a file with a purpose of "batch"
file = client.files.create(
  file=open("test.jsonl", "rb"), 
  purpose="batch"
)

print(file.model_dump_json(indent=2))
file_id = file.id
```

**Output:**

```json
{
  "id": "file-31b0f44ef8334259be3a3f3bb793a7b9",
  "bytes": 821,
  "created_at": 1721666905,
  "filename": "test.jsonl",
  "object": "file",
  "purpose": "batch",
  "status": "pending",
  "status_details": null
}
```

## Track file upload status

Depending on the size of your upload file it might take some time before it's fully uploaded and processed. To check on your file upload status run:

```python
# Wait until the uploaded file is in processed state
import time
import datetime 

status = "pending"
while status != "processed":
    time.sleep(15)
    file_response = client.files.retrieve(file_id)
    status = file_response.status
    print(f"{datetime.datetime.now()} File Id: {file_id}, Status: {status}")
```

**Output:**

```output
2024-07-22 12:49:06.816651 File Id: file-31b0f44ef8334259be3a3f3bb793a7b9, Status: processed
```

## Create batch job

Once your file has uploaded successfully by reaching a status of `processed` you can submit the file for batch processing.

```python
# Submit a batch job with the file
batch_response = client.batches.create(
    input_file_id=file_id,
    endpoint="/chat/completions",
    completion_window="24h",
)

# Save batch ID for later use
batch_id = batch_response.id

print(batch_response.model_dump_json(indent=2))
```

> [!NOTE]
> Currently the completion window must be set to 24h. If you set any other value than 24h your job will fail. Jobs taking longer than 24 hours will continue to execute until cancelled.

**Output:**

```json
{
  "id": "batch_73445352-d8cf-43c4-b51c-842864923600",
  "completion_window": "24h",
  "created_at": 1722450284,
  "endpoint": null,
  "input_file_id": "file-ad5ebc5773534c5885ef4aea871d6b9f",
  "object": "batch",
  "status": "validating",
  "cancelled_at": null,
  "cancelling_at": null,
  "completed_at": null,
  "error_file_id": null,
  "errors": null,
  "expired_at": null,
  "expires_at": 1722536684,
  "failed_at": null,
  "finalizing_at": null,
  "in_progress_at": null,
  "metadata": null,
  "output_file_id": null,
  "request_counts": {
    "completed": 0,
    "failed": 0,
    "total": 0
  }
}
```

## Track batch job progress

Once you have created batch job successfully you can monitor its progress either in the Studio or programatically. When checking batch job progress we recommend waiting at least 60 seconds in between each status call.

```Python
# Wait until the uploaded file is in processed state
import time
import datetime 

status = "validating"
while status not in ("completed", "failed", "canceled"):
    time.sleep(60)
    batch_response = client.batches.retrieve(batch_id)
    status = batch_response.status
    print(f"{datetime.datetime.now()} Batch Id: {batch_id},  Status: {status}")
```

**Output:**

```output
2024-07-31 14:26:33.650577 Batch Id: batch_73445352-d8cf-43c4-b51c-842864923600,  Status: validating
2024-07-31 14:27:34.479144 Batch Id: batch_73445352-d8cf-43c4-b51c-842864923600,  Status: validating
2024-07-31 14:28:35.522783 Batch Id: batch_73445352-d8cf-43c4-b51c-842864923600,  Status: validating
2024-07-31 14:29:36.258073 Batch Id: batch_73445352-d8cf-43c4-b51c-842864923600,  Status: validating
2024-07-31 14:30:36.916150 Batch Id: batch_73445352-d8cf-43c4-b51c-842864923600,  Status: in_progress
2024-07-31 14:31:37.981857 Batch Id: batch_73445352-d8cf-43c4-b51c-842864923600,  Status: in_progress
2024-07-31 14:32:38.685983 Batch Id: batch_73445352-d8cf-43c4-b51c-842864923600,  Status: in_progress
2024-07-31 14:33:39.355531 Batch Id: batch_73445352-d8cf-43c4-b51c-842864923600,  Status: in_progress
2024-07-31 14:34:39.986518 Batch Id: batch_73445352-d8cf-43c4-b51c-842864923600,  Status: completed
```

The following status values are possible:

|**Status**| **Description**|
|---|---|
|`validating`|The input file is being validated before the batch processing can begin. |
|`failed`|The input file has failed the validation process. |
| `in_progress`|The input file was successfully validated and the batch is currently running. |
| `finalizing`|The batch has completed and the results are being prepared. |
| `completed`|The batch has been completed and the results are ready.  |
| `expired`|The batch wasn't able to be completed within the 24-hour time window.|
| `cancelling`|The batch is being `cancelled` (This may take up to 10 minutes to go into effect.) |
| `cancelled`|the batch was `cancelled`.|

To examine the job status details you can run:

```python
print(batch_response.model_dump_json(indent=2))
```

```json
{
  "id": "batch_f1423441-0935-4a3d-9a96-9c23bedc3289",
  "completion_window": "24h",
  "created_at": "2024-07-22T16:51:52.6450839+00:00",
  "endpoint": null,
  "input_file_id": "file-31b0f44ef8334259be3a3f3bb793a7b9",
  "object": "batch",
  "status": "Completed",
  "cancelled_at": null,
  "cancelling_at": null,
  "completed_at": "2024-07-22T17:59:43.6332138+00:00",
  "error_file_id": "file-de3c3e8b-83b4-4a83-89c3-310f3d677df4",
  "errors": {
    "data": [],
    "object": "list"
  },
  "expired_at": null,
  "expires_at": "2024-07-23T16:51:52.5940767+00:00",
  "failed_at": null,
  "finalizing_at": "2024-07-22T17:55:27.9985631+00:00",
  "in_progress_at": "2024-07-22T16:57:43.5157566+00:00",
  "metadata": null,
  "output_file_id": "file-ccd5d748-f5a4-4846-a0f8-2538d569000a",
  "request_counts": {
    "completed": 0,
    "failed": 3,
    "total": 3
  }
}
```

Observe that there's both `error_file_id` and a separate `output_file_id`. Use the `error_file_id` to assist in debugging any issues that occur with your batch job.

## Retrieve batch job output file

```python
response =client.files.content(batch_reponse.output_file_id)

print(response.text)
```

### Additional batch commands

### Cancel batch

Cancels an in-progress batch. The batch will be in status `cancelling` for up to 10 minutes, before changing to `cancelled`, where it will have partial results (if any) available in the output file.

```python
client.batches.cancel("batch_abc123") # set to your batch_id for the job you want to cancel
```

### List batch

List all batch jobs for a particular Azure OpenAI resource.

```python
client.batches.list()
```
