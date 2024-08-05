---
 title: Include file
 description: Include file
 author: mrbullwinkle
 ms.author: mbullwin
 ms.service: azure-ai-studio
 ms.topic: include
 ms.date: 05/03/2024
ms.custom: include, build-2024
---

[!INCLUDE [Feature preview](~/reusable-content/ce-skilling/azure/includes/ai-studio/includes/feature-preview.md)]

## Prerequisites

- Read the [When to use Azure OpenAI fine-tuning guide](../concepts/fine-tuning-considerations.md).

- An Azure subscription - <a href="https://azure.microsoft.com/free/cognitive-services" target="_blank">Create one for free</a>.
- An [Azure AI hub resource](../../../ai-studio/how-to/create-azure-ai-resource.md).
- An [Azure AI project](../../../ai-studio/how-to/create-projects.md) in Azure AI Studio.
- An [Azure OpenAI connection](/azure/ai-studio/how-to/connections-add?tabs=azure-openai#connection-details) to a resource in a [region where fine-tuning is supported](/azure/ai-services/openai/concepts/models#fine-tuning-models).
- Fine-tuning access requires **Cognitive Services OpenAI Contributor** role on the Azure OpenAI resource.
- If you don't already have access to view quota and deploy models in Azure AI Studio you need [more permissions](../how-to/role-based-access-control.md).

## Models

The following models support fine-tuning:

- `babbage-002`
- `davinci-002`
- `gpt-35-turbo` (0613)
- `gpt-35-turbo` (1106)
- `gpt-35-turbo` (0125)
- `gpt-4` (0613)**<sup>*</sup>**
- `gpt-4o-mini` (2024-07-18)**<sup>*</sup>**

**<sup>*</sup>** Fine-tuning for this model is currently in public preview.

Consult the [models page](../concepts/models.md#fine-tuning-models) to check which regions currently support fine-tuning.

If you plan to use `gpt-4` for fine-tuning, please refer to the [GPT-4 public preview safety evaluation guidance](#safety-evaluation-gpt-4-fine-tuning---public-preview)

## Review the workflow for Azure AI Studio

Take a moment to review the fine-tuning workflow for using Azure AI Studio:

1. Prepare your training and validation data.
1. Use the **Fine-tune model** wizard in Azure AI Studio to train your custom model.
    1. [Select a model](#select-the-base-model).
    1. [Choose your training data](#choose-your-training-data).
    1. Optionally, [choose your validation data](#choose-your-validation-data).
    1. Optionally, [configure your parameters](#configure-your-parameters) for your fine-tuning job.
    1. [Review your choices and train your new custom model](#review-your-choices-and-train-your-model).
1. Check the status of your fine-tuned model.
1. Optionally, analyze your fine-tuned model for performance and fit.
1. Deploy your fine-tuned model for use.
1. Use your fine-tuned model.


## Prepare your training and validation data

Your training data and validation data sets consist of input and output examples for how you would like the model to perform.

Different model types require a different format of training data.

# [chat completion models](#tab/turbo)

The training and validation data you use **must** be formatted as a JSON Lines (JSONL) document. For `gpt-35-turbo-0613` the fine-tuning dataset must be formatted in the conversational format that is used by the [Chat completions](../how-to/chatgpt.md) API.

If you would like a step-by-step walk-through of fine-tuning a `gpt-35-turbo-0613` model please refer to the [Azure OpenAI fine-tuning tutorial.](../tutorials/fine-tune.md)

### Example file format

```json
{"messages": [{"role": "system", "content": "You are an Xbox customer support agent whose primary goal is to help users with issues they are experiencing with their Xbox devices. You are friendly and concise. You only provide factual answers to queries, and do not provide answers that are not related to Xbox."}, {"role": "user", "content": "Is Xbox better than PlayStation?"}, {"role": "assistant", "content": "I apologize, but I cannot provide personal opinions. My primary job is to assist you with any issues related to your Xbox device. Do you have any Xbox-related issues that need addressing?"}]}
{"messages": [{"role": "system", "content": "You are an Xbox customer support agent whose primary goal is to help users with issues they are experiencing with their Xbox devices. You are friendly and concise. You only provide factual answers to queries, and do not provide answers that are not related to Xbox."}, {"role": "user", "content": "Can I play PC games on my Xbox?"}, {"role": "assistant", "content": "While Xbox consoles don't natively support PC games, they can play an array of Xbox games, many of which are also available on PC. Can I assist you with finding games compatible with your Xbox device?"}]}
{"messages": [{"role": "system", "content": "You are an Xbox customer support agent whose primary goal is to help users with issues they are experiencing with their Xbox devices. You are friendly and concise. You only provide factual answers to queries, and do not provide answers that are not related to Xbox."}, {"role": "user", "content": "I'm having trouble connecting my Xbox to the Wi-Fi."}, {"role": "assistant", "content": "No worries, let's go through the network settings on your Xbox. Can you please tell me what happens when you try to connect it to the Wi-Fi?"}]}
```

## Multi-turn chat file format

Multiple turns of a conversation in a single line of your jsonl training file is also supported. To skip fine-tuning on specific assistant messages add the optional `weight` key value pair. Currently `weight` can be set to 0 or 1.  

```json
{"messages": [{"role": "system", "content": "Marv is a factual chatbot that is also sarcastic."}, {"role": "user", "content": "What's the capital of France?"}, {"role": "assistant", "content": "Paris", "weight": 0}, {"role": "user", "content": "Can you be more sarcastic?"}, {"role": "assistant", "content": "Paris, as if everyone doesn't know that already.", "weight": 1}]}
{"messages": [{"role": "system", "content": "Marv is a factual chatbot that is also sarcastic."}, {"role": "user", "content": "Who wrote 'Romeo and Juliet'?"}, {"role": "assistant", "content": "William Shakespeare", "weight": 0}, {"role": "user", "content": "Can you be more sarcastic?"}, {"role": "assistant", "content": "Oh, just some guy named William Shakespeare. Ever heard of him?", "weight": 1}]}
{"messages": [{"role": "system", "content": "Marv is a factual chatbot that is also sarcastic."}, {"role": "user", "content": "How far is the Moon from Earth?"}, {"role": "assistant", "content": "384,400 kilometers", "weight": 0}, {"role": "user", "content": "Can you be more sarcastic?"}, {"role": "assistant", "content": "Around 384,400 kilometers. Give or take a few, like that really matters.", "weight": 1}]}
```

In addition to the JSONL format, training and validation data files must be encoded in UTF-8 and include a byte-order mark (BOM). The file must be less than 512 MB in size.

### Create your training and validation datasets

The more training examples you have, the better. Fine tuning jobs will not proceed without at least 10 training examples, but such a small number are not enough to noticeably influence model responses. It is best practice to provide hundreds, if not thousands, of training examples to be successful.

In general, doubling the dataset size can lead to a linear increase in model quality. But keep in mind, low quality examples can negatively impact performance. If you train the model on a large amount of internal data, without first pruning the dataset for only the highest quality examples you could end up with a model that performs much worse than expected.

# [babbage-002/davinci-002](#tab/completionfinetuning)

The training and validation data you use **must** be formatted as a JSON Lines (JSONL) document in which each line represents a single prompt-completion pair. The OpenAI command-line interface (CLI) includes [a data preparation tool](#openai-cli-data-preparation-tool) that validates, gives suggestions, and reformats your training data into a JSONL file ready for fine-tuning.

```json
{"prompt": "<prompt text>", "completion": "<ideal generated text>"}
{"prompt": "<prompt text>", "completion": "<ideal generated text>"}
{"prompt": "<prompt text>", "completion": "<ideal generated text>"}
```

In addition to the JSONL format, training and validation data files must be encoded in UTF-8 and include a byte-order mark (BOM). The file must be less than 512 MB in size.

### Create your training and validation datasets

Designing your prompts and completions for fine-tuning is different from designing your prompts for use with any of [our GPT-3 base models](../concepts/legacy-models.md#gpt-3-models). Prompts for completion calls often use either detailed instructions or few-shot learning techniques, and consist of multiple examples. For fine-tuning, each training example should consist of a single input prompt and its desired completion output. You don't need to give detailed instructions or multiple completion examples for the same prompt.

The more training examples you have, the better. The minimum number of training examples is 10, but such a small number of examples is often not enough to noticeably influence model responses. OpenAI states it's best practice to have at least 50 high quality training examples. However, it is entirely possible to have a use case that might require 1,000's of high quality training examples to be successful.

In general, doubling the dataset size can lead to a linear increase in model quality. But keep in mind, low quality examples can negatively impact performance. If you train the model on a large amount of internal data, without first pruning the dataset for only the highest quality examples you could end up with a model that performs much worse than expected.

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

## Create your fine-tuned model

To fine-tune an Azure OpenAI model in an existing Azure AI Studio project, follow these steps:

1. Sign in to [Azure AI Studio](https://ai.azure.com) and select your project. If you don't have a project already, first [create a project](../../../ai-studio/how-to/create-projects.md).

1. From the collapsible left menu, select **Fine-tuning** > **+ Fine-tune model**.

    :::image type="content" source="../media/fine-tuning/ai-studio/fine-tune-new.png" alt-text="Screenshot of the option to start creating a new fine-tuned model." lightbox="../media/fine-tuning/ai-studio/fine-tune-new.png":::

### Select the base model

1. Select a base model to fine-tune. Your choice influences both the performance and the cost of your model. In this example, we are choosing the `gpt-35-turbo` model. Then select **Confirm**.

    :::image type="content" source="../media/fine-tuning/ai-studio/fine-tune-gpt-35-turbo.png" alt-text="Screenshot of option to select a model to fine-tune." lightbox="../media/fine-tuning/ai-studio/fine-tune-gpt-35-turbo.png":::

1. For `gpt-35-turbo` we have different versions available for fine-tuning, so please choose which version you'd like to fine-tune. We will choose (0301). 

1. We also recommend including the `suffix` parameter to make it easier to distinguish between different iterations of your fine-tuned model. `suffix` takes a string, and is set to identify the fine-tuned model. With the OpenAI Python API a string of up to 18 characters is supported that will be added to your fine-tuned model name.

If you have more than one Azure OpenAI connection enabled for fine-tuning, then choose which resource you'd like to use. Please note that all users with access to your Azure OpenAI resource will have access to this fine-tuned model.

1. Then select **Next**.

    :::image type="content" source="../media/fine-tuning/ai-studio/fine-tune-basic-settings.png" alt-text="Screenshot of basic settings for fine-tuning a model." lightbox="../media/fine-tuning/ai-studio/fine-tune-basic-settings.png":::

### Choose your training data
The next step is to either choose existing prepared training data or upload new prepared training data to use when customizing your model. The **Training data** pane displays any existing, previously uploaded datasets and also provides options to upload new training data.

:::image type="content" source="../media/fine-tuning/ai-studio/fine-tune-training-data-local.png" alt-text="Screenshot of the Training data pane for the Fine-tune model wizard in Azure AI Studio." lightbox="../media/fine-tuning/ai-studio/fine-tune-training-data-local.png":::

- If your training data is already in your project, select **Data in Azure AI Studio**.

   - Select the file from the list shown in the **Training data** pane.

- If your training data is already uploaded to the Azure OpenAI service, select your Azure OpenAI connection under **Azure OpenAI Connection**.

- To upload training data to fine-tune your model, select **Upload data** and then select **Upload file**.  
   - Make sure all your training examples follow the expected format for inference. To fine-tune models effectively, ensure a balanced and diverse dataset. This involves maintaining data balance, including various scenarios, and periodically refining training data to align with real-world expectations, ultimately leading to more accurate and balanced model responses. See [data preparation](#prepare-your-training-and-validation-data) for more information.
   - For large data files, we recommend that you import from an Azure Blob store. Large files can become unstable when uploaded through multipart forms because the requests are atomic and can't be retried or resumed. For more information about Azure Blob Storage, see [What is Azure Blob Storage](../../../storage/blobs/storage-blobs-overview.md)?

> [!NOTE]
> Training data files must be formatted as JSONL files, encoded in UTF-8 with a byte-order mark (BOM). The file must be less than 512 MB in size.

:::image type="content" source="../media/fine-tuning/ai-studio/fine-tune-training-data-preview.png" alt-text="Screenshot of option to upload training data locally." lightbox="../media/fine-tuning/ai-studio/fine-tune-training-data-preview.png":::

After uploading files, you will see a preview of your training data. Select **Next** to continue.

:::image type="content" source="../media/fine-tuning/ai-studio/fine-tune-training-data-preview.png" alt-text="Screenshot of the training data preview." lightbox="../media/fine-tuning/ai-studio/fine-tune-training-data-preview.png":::

### Choose your validation data

Optionally, you can choose to provide validation data to fine-tune your model. If you don't want to use validation data, you can select **None** and select **Next** to continue to the advanced options for the model.

Otherwise, if you have a validation dataset, you can either choose from previously uploaded data or upload newly prepared validation data to use for fine-tuning your model.

> [!NOTE]
> Similar to training data files, validation data files must be formatted as JSONL files, encoded in UTF-8 with a byte-order mark (BOM). The file must be less than 512 MB in size.

### Configure your parameters

Optionally, configure parameters for your fine-tuning job. The following are available:

|**Name**| **Type**| **Description**|
|---|---|---|
|`batch_size` |integer | The batch size to use for training. The batch size is the number of training examples used to train a single forward and backward pass. In general, we've found that larger batch sizes tend to work better for larger datasets. The default value as well as the maximum value for this property are specific to a base model. A larger batch size means that model parameters are updated less frequently, but with lower variance. When set to -1, batch_size is calculated as 0.2% of examples in training set and the max is 256. |
| `learning_rate_multiplier` | number | The learning rate multiplier to use for training. The fine-tuning learning rate is the original learning rate used for pre-training multiplied by this value. Larger learning rates tend to perform better with larger batch sizes. We recommend experimenting with values in the range 0.02 to 0.2 to see what produces the best results. A smaller learning rate may be useful to avoid overfitting. |
|`n_epochs` | integer | The number of epochs to train the model for. An epoch refers to one full cycle through the training dataset. If set to -1, the number of epochs is determined dynamically based on the input data. |
|`seed` | integer | The seed controls the reproducibility of the job. Passing in the same seed and job parameters should produce the same results, but may differ in rare cases. If a seed isn't specified, one will be generated for you. |

You can choose to leave the default configuration or customize the values to your preference. After you finish making your configurations, select **Next**. 

### Review your choices and train your model

Review your choices and select **Submit** to start training your new fine-tuned model.

## Check the status of your fine-tuned model

After you submit your fine-tuning job, you see a page with details about your fine-tuned model. You can find the status and more information about your fine-tuned model on the **Fine-tuning** > **Models** page in Azure AI Studio.

Your job might be queued behind other jobs on the system. Training your model can take minutes or hours depending on the model and dataset size.

## Analyze your fine-tuned model

After fine-tuning is successfully completed, you can download a result file named _results.csv_ from the fine-tuned model page under the **Details** tab. You can use the result file to analyze the training and validation performance of your custom model. 

The result file is a CSV file that contains a header row and a row for each training step performed by the fine-tuning job. The result file contains the following columns:

| Column name | Description |
| --- | --- |
| `step` | The number of the training step. A training step represents a single pass, forward and backward, on a batch of training data. |
| `train_loss` | The loss for the training batch. |
| `train_mean_token_accuracy` | The percentage of tokens in the training batch correctly predicted by the model.<br>For example, if the batch size is set to 3 and your data contains completions `[[1, 2], [0, 5], [4, 2]]`, this value is set to 0.83 (5 of 6) if the model predicted `[[1, 1], [0, 5], [4, 2]]`. |
| `valid_loss` | The loss for the validation batch. |
| `validation_mean_token_accuracy` | The percentage of tokens in the validation batch correctly predicted by the model.<br>For example, if the batch size is set to 3 and your data contains completions `[[1, 2], [0, 5], [4, 2]]`, this value is set to 0.83 (5 of 6) if the model predicted `[[1, 1], [0, 5], [4, 2]]`. |
| `full_valid_loss` | The validation loss calculated at the end of each epoch. When training goes well, loss should decrease. |
|`full_valid_mean_token_accuracy` | The valid mean token accuracy calculated at the end of each epoch. When training is going well, token accuracy should increase. |

You can also view the data in your results.csv file as plots in Azure AI Studio under the **Metrics** tab of your fine-tuned model. Select the link for your trained model, and you will see two charts: loss, and token accuracy. If you provided validation data, both datasets will appear on the same plot.

:::image type="content" source="../media/fine-tuning/metrics.png" alt-text="Screenshot of metrics UI." lightbox="../media/fine-tuning/metrics.png":::

Look for your loss to decrease over time, and your accuracy to increase. If you see a divergence between your training and validation data that may indicate that you are overfitting. Try training with fewer epochs, or a smaller learning rate multiplier.

## Checkpoints

When each training epoch completes a checkpoint is generated. A checkpoint is a fully functional version of a model which can both be deployed and used as the target model for subsequent fine-tuning jobs. Checkpoints can be particularly useful, as they can provide a snapshot of your model prior to overfitting having occurred. When a fine-tuning job completes you will have the three most recent versions of the model available to deploy.

:::image type="content" source="../media/fine-tuning/checkpoints.png" alt-text="Screenshot of checkpoints UI." lightbox="../media/fine-tuning/checkpoints.png":::

## Safety evaluation GPT-4 fine-tuning - public preview

[!INCLUDE [Safety evaluation](../includes/safety-evaluation.md)]

## Deploy a fine-tuned model

Once your model is fine-tuned, you can deploy the model and can use it in your own application. You can't deploy a fine-tuned model from the deployments page or the playground page in Azure AI Studio. The only way, currently, to deploy a fine-tuned model is from the model details page for that model.

When you deploy the model, you make the model available for inferencing, and that incurs an hourly hosting charge. Fine-tuned models, however, can be stored in Azure AI Studio at no cost until you're ready to use them.

[!INCLUDE [Fine-tuning deletion](../../../ai-services/openai/includes/fine-tune.md)]

> [!NOTE]
> Only one deployment is permitted for a fine-tuned model. An error message is displayed if you select an already-deployed fine-tuned model.

You can monitor the progress of your deployment on the **Deployments** page in Azure AI Studio.

## Use a deployed fine-tuned model

After your fine-tuned model deploys, you can use it like any other deployed model. You can use the **Playground** in [Azure AI Studio](https://ai.azure.com) to experiment with your new deployment. You can also use the REST API to call your fine-tuned model from your own application. You can even begin to use this new fine-tuned model in your prompt flow to build your generative AI application.

> [!NOTE]
> For chat models, the [system message that you use to guide your fine-tuned model](../concepts/system-message.md) (whether it's deployed or available for testing in the playground) must be the same as the system message you used for training. If you use a different system message, the model might not perform as expected.

## Clean up your deployments, fine-tuned models, and training files

When you're done with your fine-tuned model, you can delete the deployment and model. You can also delete the training and validation files you uploaded to the service, if needed. 

### Delete your fine-tuned model deployment

[!INCLUDE [Fine-tuning deletion](../../../ai-services/openai/includes/fine-tune.md)]

You can delete the deployment for your fine-tuned model on the **Deployments** page in Azure AI Studio. Select the deployment to delete, and then select **Delete** to delete the deployment.

### Delete your fine-tuned model

You can delete a fine-tuned model on the **Fine-tuning** page in Azure AI Studio. Select the fine-tuned model to delete and then select **Delete** to delete the fine-tuned model.

> [!NOTE]
> You can't delete a fine-tuned model if it has an existing deployment. You must first [delete your model deployment](#delete-your-fine-tuned-model-deployment) before you can delete your fine-tuned model.

### Delete your training files

You can optionally delete training and validation files that you uploaded for training, and result files generated during training. For this you need to go to Azure OpenAI Studio and navigate to the **Management** > **Data files** pane. Select the file to delete, and then select **Delete** to delete the file.
