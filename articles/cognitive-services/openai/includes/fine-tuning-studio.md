---
title: 'How to customize a model with Azure OpenAI Service'
titleSuffix: Azure OpenAI
description: Learn how to create your own customized model with Azure OpenAI by using the Azure OpenAI Studio
services: cognitive-services
manager: nitinme
ms.service: cognitive-services
ms.subservice: openai
ms.topic: include
ms.date: 06/30/2022
author: ChrisHMSFT
ms.author: chrhoder
keywords: 

---

## Prerequisites

- An Azure subscription - <a href="https://azure.microsoft.com/free/cognitive-services" target="_blank">Create one for free</a>
- Access granted to Azure OpenAI in the desired Azure subscription

    Currently, access to this service is granted only by application. You can apply for access to Azure OpenAI by completing the form at <a href="https://aka.ms/oai/access" target="_blank">https://aka.ms/oai/access</a>. Open an issue on this repo to contact us if you have an issue.
- An Azure OpenAI resource
    
    For more information about creating a resource, see [Create a resource and deploy a model using Azure OpenAI](../how-to/create-resource.md).

## Fine-tuning workflow

The fine-tuning workflow in Azure OpenAI Studio requires the following steps:

1. Prepare your training and validation data
1. Use the **Create customized model** wizard in Azure OpenAI Studio to train your customized model
    1. [Select a base model](#select-a-base-model)
    1. [Choose your training data](#choose-your-training-data)
    1. Optionally, [choose your validation data](#choose-your-validation-data)
    1. Optionally, [choose advanced options](#choose-advanced-options) for your fine-tune job
    1. [Review your choices and train your new customized model](#review-your-choices-and-train-your-model)
1. Check the status of your customized model
1. Deploy your customized model for use
1. Use your customized model
1. Optionally, analyze your customized model for performance and fit

## Prepare your training and validation data

Your training data and validation data sets consist of input & output examples for how you would like the model to perform.

The training and validation data you use **must** be formatted as a JSON Lines (JSONL) document in which each line represents a single prompt-completion pair. The OpenAI command-line interface (CLI) includes [a data preparation tool](#openai-cli-data-preparation-tool) that validates, gives suggestions, and reformats your training data into a JSONL file ready for fine-tuning.

Here's an example of the training data format:

```json
{"prompt": "<prompt text>", "completion": "<ideal generated text>"}
{"prompt": "<prompt text>", "completion": "<ideal generated text>"}
{"prompt": "<prompt text>", "completion": "<ideal generated text>"}
```

In addition to the JSONL format, training and validation data files must be encoded in UTF-8 and include a byte-order mark (BOM), and the file must be less than 200 MB in size. For more information about formatting your training data, see [Learn how to prepare your dataset for fine-tuning](../how-to/prepare-dataset.md).

### Creating your training and validation datasets

Designing your prompts and completions for fine-tuning is different from designing your prompts for use with any of [our GPT-3 base models](../concepts/legacy-models.md#gpt-3-models). Prompts for completion calls often use either detailed instructions or few-shot learning techniques, and consist of multiple examples. For fine-tuning, we recommend that each training example consists of a single input prompt and its desired completion output. You don't need to give detailed instructions or multiple completion examples for the same prompt.

The more training examples you have, the better. We recommend having at least 200 training examples. In general, we've found that each doubling of the dataset size leads to a linear increase in model quality.

For more information about preparing training data for various tasks, see [Learn how to prepare your dataset for fine-tuning](../how-to/prepare-dataset.md).

### OpenAI CLI data preparation tool

We recommend using OpenAI's command-line interface (CLI) to assist with many of the data preparation steps. OpenAI has developed a tool that validates, gives suggestions, and reformats your data into a JSONL file ready for fine-tuning.

To install the CLI, run the following Python command:

```console
pip install --upgrade openai 
```
To analyze your training data with the data preparation tool, run the following Python command, replacing `<LOCAL_FILE>` with the full path and file name of the training data file to be analyzed:

```console
openai tools fine_tunes.prepare_data -f <LOCAL_FILE>
```

This tool accepts files in the following data formats, if they contain a prompt and a completion column/key:

- Comma-separated values (CSV)
- Tab-separated values (TSV)
- Microsoft Excel workbook (XLSX)
- JavaScript Object Notation (JSON)
- JSON Lines (JSONL)
 
The tool reformats your training data and saves output into a JSONL file ready for fine-tuning, after guiding you through the process of implementing suggested changes.

## Use the Create customized model wizard

Azure OpenAI Studio provides the **Create customized model** wizard, so you can interactively create and train a fine-tuned model for your Azure resource. 

### Go to the Azure OpenAI Studio

Navigate to the Azure OpenAI Studio at <a href="https://oai.azure.com/" target="_blank">https://oai.azure.com/</a>and sign in with credentials that have access to your Azure OpenAI resource. During the sign-in workflow, select the appropriate directory, Azure subscription, and Azure OpenAI resource.

#### Landing page

You'll first land on our main page for Azure OpenAI Studio. From here, you can start fine-tuning a custom model.

Select the **Start fine-tuning a custom model** button under **Manage deployments and models** section of the landing page, highlighted in the following picture, to start fine-tuning a custom model. 

> [!NOTE]
> If your resource doesn't have a model already deployed in it, a warning is displayed. You can ignore that warning for the purposes of fine-tuning a model, because you'll be fine-tuning and deploying a new customized model.

:::image type="content" source="../media/fine-tuning/studio-portal.png" alt-text="Screenshot of the landing page of Azure OpenAI Studio with sections highlighted." lightbox="../media/fine-tuning/studio-portal.png":::

### Start the wizard from the Models page

To create a customized model, select the **Create customized model** button under the **Provided models** section on the **Models** page, highlighted in the following picture, to start the **Create customized model** wizard.

:::image type="content" source="../media/fine-tuning/studio-models.png" alt-text="Screenshot of the Models page from Azure OpenAI Studio, with sections highlighted." lightbox="../media/fine-tuning/studio-models.png":::

#### Select a base model

The first step in creating a customized model is to choose a base model. The **Base model** pane lets you choose a base model to use for your customized model, and the choice influences both the performance and the cost of your model. You can create a customized model from one of the following available base models:

- `ada`
- `babbage`
- `curie`
- `code-cushman-001`\*
- `davinci`\*

    \* currently unavailable for new customers. 

For more information about our base models that can be fine-tuned, see [Models](../concepts/models.md). Select a base model from the **Base model type** dropdown, as shown in the following picture, and then select **Next** to continue.

:::image type="content" source="../media/fine-tuning/studio-base-model.png" alt-text="Screenshot of the Base model pane for the Create customized model wizard." lightbox="../media/fine-tuning/studio-base-model.png":::

#### Choose your training data

The next step is to either choose existing prepared training data or upload new prepared training data to use when customizing your model. The **Training data** pane, shown in the following picture, displays any existing, previously uploaded datasets and provides options by which you can upload new training data. 

:::image type="content" source="../media/fine-tuning/studio-training-data.png" alt-text="Screenshot of the Training data pane for the Create customized model wizard." lightbox="../media/fine-tuning/studio-training-data.png":::

If your training data has already been uploaded to the service, select **Choose dataset**, and then select the file from the list shown in the **Training data** pane. Otherwise, select either **Local file** to [upload training data from a local file](#to-upload-training-data-from-a-local-file), or **Azure blob or other shared web locations** to [import training data from Azure Blob or another shared web location](#to-import-training-data-from-an-azure-blob-store).

For large data files, we recommend you import from an Azure Blob store. Large files can become unstable when uploaded through multipart forms because the requests are atomic and can't be retried or resumed. For more information about Azure Blob storage, see [What is Azure Blob storage?](../../../storage/blobs/storage-blobs-overview.md)

> [!NOTE]
> Training data files must be formatted as JSONL files, encoded in UTF-8 with a byte-order mark (BOM), and less than 200 MB in size.

##### To upload training data from a local file

You can upload a new training dataset to the service from a local file by using one of the following methods:
- Drag and drop the file into the client area of the **Training data** pane, and then select **Upload file**
- Select **Browse for a file** from the client area of the **Training data** pane, choose the file to upload from the **Open** dialog, and then select **Upload file**.

After you've selected and uploaded the training dataset, select **Next** to optionally [choose your validation data](#choose-your-validation-data).

:::image type="content" source="../media/fine-tuning/studio-training-data-local.png" alt-text="Screenshot of the Training data pane for the Create customized model wizard, with local file options." lightbox="../media/fine-tuning/studio-training-data-local.png":::

##### To import training data from an Azure Blob store

You can import a training dataset from Azure Blob or another shared web location by providing the name and location of the file, as shown in the following picture. Enter the name of the file in **File name** and the Azure Blob URL, Azure Storage shared access signature (SAS), or other link to an accessible shared web location that contains the file in **File location**, then select **Upload file** to import the training dataset to the service. 

After you've selected and uploaded the training dataset, select **Next** to optionally [choose your validation data](#choose-your-validation-data).

:::image type="content" source="../media/fine-tuning/studio-training-data-blob.png" alt-text="Screenshot of the Training data pane for the Create customized model wizard, with Azure Blob and shared web location options." lightbox="../media/fine-tuning/studio-training-data-blob.png":::

#### Choose your validation data

You can now choose to optionally use validation data in the training process of your fine-tuned model. If you don't want to use validation data, you can choose **Next** to choose advanced options for your model. Otherwise, if you have a validation dataset, you can either choose existing prepared validation data or upload new prepared validation data to use when customizing your model. The **Validation data** pane, shown in the following picture, displays any existing, previously uploaded training and validation datasets and provides options by which you can upload new validation data. 

:::image type="content" source="../media/fine-tuning/studio-validation-data.png" alt-text="Screenshot of the Validation data pane for the Create customized model wizard." lightbox="../media/fine-tuning/studio-validation-data.png":::

If your validation data has already been uploaded to the service, select **Choose dataset**, and then select the file from the list shown in the **Validation data** pane. Otherwise, select either **Local file** to [upload validation data from a local file](#to-upload-validation-data-from-a-local-file), or **Azure blob or other shared web locations** to [import validation data from Azure Blob or another shared web location](#to-import-validation-data-from-an-azure-blob-store).

For large data files, we recommend you import from an Azure Blob store. Large files can become unstable when uploaded through multipart forms because the requests are atomic and can't be retried or resumed.

> [!NOTE]
> Like training data files, validation data files must be formatted as JSONL files, encoded in UTF-8 with a byte-order mark (BOM), and less than 200 MB in size. 

##### To upload validation data from a local file

You can upload a new validation dataset to the service from a local file by using one of the following methods:
- Drag and drop the file into the client area of the **Validation data** pane, and then select **Upload file**
- Select **Browse for a file** from the client area of the **Validation data** pane, choose the file to upload from the **Open** dialog, and then select **Upload file**.

After you've uploaded the validation dataset, select **Next** to optionally [choose advanced options](#choose-advanced-options).

:::image type="content" source="../media/fine-tuning/studio-validation-data-local.png" alt-text="Screenshot of the Validation data pane for the Create customized model wizard, with local file options." lightbox="../media/fine-tuning/studio-validation-data-local.png":::

##### To import validation data from an Azure Blob store

You can import a validation dataset from Azure Blob or another shared web location by providing the name and location of the file, as shown in the following picture. Enter the name of the file in **File name** and the Azure Blob URL, Azure Storage shared access signature (SAS), or other link to an accessible shared web location that contains the file in **File location**, then select **Upload file** to import the validation dataset to the service. 

After you've imported the validation dataset, select **Next** to optionally [choose advanced options](#choose-advanced-options).

:::image type="content" source="../media/fine-tuning/studio-validation-data-blob.png" alt-text="Screenshot of the Validation data pane for the Create customized model wizard, with Azure Blob and shared web location options." lightbox="../media/fine-tuning/studio-validation-data-blob.png":::

#### Choose advanced options

You can either use default values for the hyperparameters of the fine-tune job that the wizard runs to train your fine-tuned model, or you can adjust those hyperparameters for your customization needs in the **Advanced options** pane, shown in the following picture.

:::image type="content" source="../media/fine-tuning/studio-advanced-options-default.png" alt-text="Screenshot of the Advanced options pane for the Create customized model wizard, with default options selected." lightbox="../media/fine-tuning/studio-advanced-options-default.png":::

Either select **Default** to use the default values for the fine-tune job, or select **Advanced** to display and edit the hyperparameter values, as shown in the following picture. 

:::image type="content" source="../media/fine-tuning/studio-advanced-options-advanced.png" alt-text="Screenshot of the Advanced options pane for the Create customized model wizard, with advanced options selected." lightbox="../media/fine-tuning/studio-advanced-options-advanced.png":::

The following hyperparameters are available:

| Parameter name | Description |
| --- | --- |
| **Number of epochs** | The number of epochs to train the model for. An epoch refers to one full cycle through the training dataset. |
| **Batch size** | The batch size to use for training. The batch size is the number of training examples used to train a single forward and backward pass. |
| **Learning rate multiplier** | The learning rate multiplier to use for training. The fine-tuning learning rate is the original learning rate used for pre-training, multiplied by this value. |
| **Prompt loss weight** | The weight to use for loss on the prompt tokens. This value controls how much the model tries to learn to generate the prompt (as compared to the completion, which always has a weight of 1.0.) Increasing this value can add a stabilizing effect to training when completions are short. |

For more information about these hyperparameters, see the [Create a Fine tune job](/rest/api/cognitiveservices/azureopenaistable/fine-tunes/create) section of the [REST API](/rest/api/cognitiveservices/azureopenaistable/fine-tunes) documentation.

After you've chosen either default or advanced options, select **Next** to [review your choices and train your fine-tuned model](#review-your-choices-and-train-your-model).

#### Review your choices and train your model

The **Review and train** pane of the wizard displays information about the choices you've made in the **Create customized model** wizard for your fine-tuned model, as shown in the following picture. 

:::image type="content" source="../media/fine-tuning/studio-review-and-train.png" alt-text="Screenshot of the Review and train pane for the Create customized model wizard." lightbox="../media/fine-tuning/studio-review-and-train.png":::

If you're ready to train your model, select **Save and close** to start the fine-tune job and return to the [**Models** page](#start-the-wizard-from-the-models-page). 

## Check the status of your customized model

The **Models** page displays information about your customized model in the **Customized models** tab, as shown in the following picture. The tab includes information about the status and job ID of the fine-tune job for your customized model. When the job is completed, the file ID of the result file is also displayed.

:::image type="content" source="../media/fine-tuning/studio-models-job-running.png" alt-text="Screenshot of the Models page from Azure OpenAI Studio, with a customized model displayed." lightbox="../media/fine-tuning/studio-models-job-running.png":::

After you've started a fine-tune job, it may take some time to complete. Your job may be queued behind other jobs on our system, and training your model can take minutes or hours depending on the model and dataset size. You can check the status of the fine-tune job for your customized model in the **Status** column of the **Customized models** tab on the **Models** page, and you can select **Refresh** to update the information on that page. 

You can also select the name of the model from the **Model name** column of the **Models** page to display more information about your customized model, including the status of the fine-tune job, training results, training events, and hyperparameters used in the job. You can select the **Refresh** button to refresh the information for your model, as shown in the following picture.

:::image type="content" source="../media/fine-tuning/studio-model-details.png" alt-text="Screenshot of the model page from Azure OpenAI Studio, with a customized model displayed." lightbox="../media/fine-tuning/studio-models-job-running.png":::

From the model page, you can also select **Download training file** to download the training data you used for the model, or select **Download results** to download the result file attached to the fine-tune job for your model and [analyze your customized model](#analyze-your-customized-model) for training and validation performance.

## Deploy a customized model

When the fine-tune job has succeeded, you can deploy the customized model from the **Models** pane. You must deploy your customized model to make it available for use with completion calls.

[!INCLUDE [Fine-tuning deletion](fine-tune.md)]

> [!NOTE]
> Only one deployment is permitted for a customized model. An error message is displayed if you select an already-deployed customized model.

To deploy your customized model, select the customized model to be deployed and then select **Deploy model**, as shown in the following picture.

:::image type="content" source="../media/fine-tuning/studio-models-deploy.png" alt-text="Screenshot of the Models page from Azure OpenAI Studio, with the Deploy model button highlighted." lightbox="../media/fine-tuning/studio-models-deploy.png":::

The **Deploy model** dialog is presented, in which you can provide a name for the deployment of your customized model. Enter a name in **Deployment name** and then select **Create** to start the deployment of your customized model. 

:::image type="content" source="../media/fine-tuning/studio-models-deploy-model.png" alt-text="Screenshot of the Deploy Model dialog from Azure OpenAI Studio." lightbox="../media/fine-tuning/studio-models-deploy-model.png":::

You can monitor the progress of your deployment from the **Deployments** pane of Azure OpenAI Studio.

## Use a deployed customized model

Once your customized model has been deployed, you can use it like any other deployed model. For example, you can use the **Playground** pane of Azure OpenAI Studio to experiment with your new deployment, as shown in the following picture. You can continue to use the same parameters with your customized model, such as temperature and frequency penalty, as you can with other deployed models. 

:::image type="content" source="../media/quickstarts/playground-load.png" alt-text="Screenshot of the Playground page of Azure OpenAI Studio, with sections highlighted." lightbox="../media/quickstarts/playground-load.png":::

> [!NOTE]
> As with all applications, we require a review process prior to going live.

## Analyze your customized model

Azure OpenAI attaches a result file, named `results.csv`, to each fine-tune job once it's completed. You can use the result file to analyze the training and validation performance of your customized model. The file ID for the result file is listed for each customized model in the **Result file Id** column of the **Models** pane for Azure OpenAI Studio. You can use the file ID to identify and download the result file from the **File Management** pane of Azure OpenAI Studio. 

The result file is a CSV file containing a header row and a row for each training step performed by the fine-tune job.  The result file contains the following columns:

| Column name | Description |
| --- | --- |
| `step` | The number of the training step. A training step represents a single pass, forward and backward, on a batch of training data. |
| `elapsed_tokens` | The number of tokens the customized model has seen so far, including repeats. |
| `elapsed_examples` | The number of examples the model has seen so far, including repeats.<br>Each example represents one element in that step's batch of training data. For example, if the **Batch size** parameter is set to 32 in the [**Advanced options** pane](#choose-advanced-options), this value increments by 32 in each training step. |
| `training_loss` | The loss for the training batch. |
| `training_sequence_accuracy` | The percentage of completions in the training batch for which the model's predicted tokens exactly matched the true completion tokens.<br>For example, if the batch size is set to 3 and your data contains completions `[[1, 2], [0, 5], [4, 2]]`, this value is set to 0.67 (2 of 3) if the model predicted `[[1, 1], [0, 5], [4, 2]]`. |
| `training_token_accuracy` | The percentage of tokens in the training batch that were correctly predicted by the model.<br>For example, if the batch size is set to 3 and your data contains completions `[[1, 2], [0, 5], [4, 2]]`, this value is set to 0.83 (5 of 6) if the model predicted `[[1, 1], [0, 5], [4, 2]]`. |
| `validation_loss` | The loss for the validation batch. |
| `validation_sequence_accuracy` | The percentage of completions in the validation batch for which the model's predicted tokens exactly matched the true completion tokens.<br>For example, if the batch size is set to 3 and your data contains completions `[[1, 2], [0, 5], [4, 2]]`, this value is set to 0.67 (2 of 3) if the model predicted `[[1, 1], [0, 5], [4, 2]]`. |
| `validation_token_accuracy` | The percentage of tokens in the validation batch that were correctly predicted by the model.<br>For example, if the batch size is set to 3 and your data contains completions `[[1, 2], [0, 5], [4, 2]]`, this value is set to 0.83 (5 of 6) if the model predicted `[[1, 1], [0, 5], [4, 2]]`. |

## Clean up your deployments, customized models, and training files

When you're done with your customized model, you can delete the deployment and model. You can also delete the training and validation files you uploaded to the service, if needed. 

### Delete your model deployment

[!INCLUDE [Fine-tuning deletion](fine-tune.md)]

You can delete the deployment for your customized model from the **Deployments** page for Azure OpenAI Studio. Select the deployment to delete, and then select **Delete** to delete the deployment. 

### Delete your customized model

You can delete a customized model from the **Models** page for Azure OpenAI Studio. Select the customized model to delete from the **Customized models** tab, and then select **Delete** to delete the customized model.

> [!NOTE]
> You cannot delete a customized model if it has an existing deployment. You must first [delete your model deployment](#delete-your-model-deployment) before you can delete your customized model.

### Delete your training files

You can optionally delete training and validation files you've uploaded for training, and result files generated during training, from the **File Management** page for Azure OpenAI Studio. Select the file to delete, and then select **Delete** to delete the file.

## Next steps

- Explore the full REST API Reference documentation to learn more about all the fine-tuning capabilities. You can find the [full REST documentation here](../reference.md).
- Explore more of the [Python SDK operations here](https://github.com/openai/openai-python/blob/main/examples/azure/finetuning.ipynb).
