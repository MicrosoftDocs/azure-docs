---
title: How to use Foundation Models in Azure Machine Learning (preview)
titleSuffix: Azure Machine Learning
description: Learn how to use, evaluate, and fine-tune Foundation Models in Azure Machine Learning
services: machine-learning
ms.service: machine-learning
ms.topic: how-to
ms.reviewer: ssalgado
author: swatig007
ms.author: swatig
ms.date: 04/25/2023
---

# How to use Foundation Models in Azure Machine Learning (preview)

> [!IMPORTANT]
> Items marked (preview) in this article are currently in public preview.
> The preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

In this article, you learn how to set up and evaluate foundation models using Azure Machine Learning automated ML in the [Azure Machine Learning studio](overview-what-is-azure-machine-learning.md#studio). Additionally, you learn how to fine-tune each model and how to deploy the model at scale.

**Foundation Models in Azure Machine Learning** provides Azure Machine Learning native capabilities that enable customers to build and operationalize open-source foundation models at scale. Foundation models are trained machine learning model that is designed to perform a specific task. Foundation models accelerate the model building process by serving as a starting point for custom models. Azure Machine Learning provides the capability to easily integrate these pre-trained models into your applications.


## How to access foundation models in Azure Machine Learning

The 'Model catalog' (preview) provides a catalog view of all models that you have access to via system registries. You can view the complete list of supported open source foundation models in the [Model catalog](https://ml.azure.com/model/catalog), under the `azureml` registry.

:::image type="content" source="./media/how-to-use-foundation-models/model-catalog.png" lightbox="./media/how-to-use-foundation-models/model-catalog.png" alt-text="Screenshot showing the model catalog section in Azure Machine Learning studio." :::

You can filter the list of models in the Model catalog by Task, or by license. Select a specific model name and the UI shows a model card for the selected model, which lists detailed information about the model. For example:

:::image type="content" source="./media/how-to-use-foundation-models/model-card.png" lightbox="./media/how-to-use-foundation-models/model-card.png" alt-text="Screenshot showing the model card for gpt2 in Azure Machine Learning studio. The model card shows a description of the model and samples of what the model outputs. ":::

`Task` calls out the inferencing task that this pre-trained model can be used for. `Finetuning-tasks` list the tasks that this model can be fine tuned for. `License` calls out the licensing info.

> [!NOTE] 
>Models from Hugging Face are subject to third party license terms available on the Hugging Face model details page. It is your responsibility to comply with the model's license terms.

Additionally, the model card for each model includes a brief description of the model and links to samples for code based inferencing, finetuning and evaluation of the model.

> [!NOTE]
>If you are using a private workspace, your virtual network needs to allow outbound access in order to use foundation models in Azure Machine Learning

## How to evaluate foundation models using your own test data

You can evaluate a foundation model against your test dataset, using either the Evaluate UI wizard or by using the code based samples, linked from the model card.

### Evaluating using UI wizard

You can invoke the Evaluate UI wizard by clicking on the 'Evaluate' button on the model card for any foundation model.

An image of the Evaluation Settings wizard:

:::image type="content" source="./media/how-to-use-foundation-models/evaluate-quick-wizard.png" alt-text="Screenshot showing the evaluation settings wizard after the user selects the evaluate button on a model card for a foundation model.":::

Each model can be evaluated for the specific inference task that the model can be used for.

**Test Data:**

1. Pass in the test data you would like to use to evaluate your model. You can choose to either upload a local file (in JSONL format) or select an existing registered dataset from your workspace.
1. Once you've selected the dataset, you need to map the columns from your input data, based on the schema needed for the task. For example, map the column names that correspond to the 'sentence' and 'label' keys for Text Classification

:::image type="content" source="./media/how-to-use-foundation-models/evaluate-map-data-columns.png" lightbox="./media/how-to-use-foundation-models/evaluate-map-data-columns.png"  alt-text="Screenshot showing the evaluation map in the foundation models evaluate wizard.":::

**Compute:** 

1. Provide the Azure Machine Learning Compute cluster you would like to use for finetuning the model. Evaluation needs to run on GPU compute. Ensure that you have sufficient compute quota for the compute SKUs you wish to use.

1.  Select 'Finish' in the Evaluate wizard to submit your evaluation job. Once the job completes, you can view evaluation metrics for the model. Based on the evaluation metrics, you might decide if you would like to finetune the model using your own training data. Additionally, you can decide if you would like to register the model and deploy it to an endpoint.

**Advanced Evaluation Parameters:**

* The Evaluate UI wizard, allows you to perform basic evaluation by providing your own test data. Additionally, there are several advanced evaluation parameters described [in this reference page](https://github.com/Azure/azureml-assets/blob/main/training/model_evaluation/components/evaluate_model/README.md), such as evaluation config. Each of these settings has default values, but can be customized via code based samples, if needed.

### Evaluating using code based samples

To enable users to get started with model evaluation, we have published samples (both Python notebooks and CLI examples) in the [Evaluation samples in azureml-examples git repo](https://github.com/Azure/azureml-examples/tree/main/sdk/python/foundation-models/system/evaluation). Each model card also links to Evaluation samples for corresponding tasks

## How to finetune foundation models using your own training data

In order to improve model performance in your workload, you might want to fine tune a foundation model using your own training data. You can easily finetune these foundation models by using either the Finetune UI wizard or by using the code based samples linked from the model card.
		
### Finetuning using the UI wizard

You can invoke the Finetune UI wizard by clicking on the 'Finetune' button on the model card for any foundation model. 

**Finetuning Settings:**

:::image type="content" source="./media/how-to-use-foundation-models/finetune-quick-wizard.png" alt-text="Screenshot showing the finetune settings options in the foundation models finetune wizard.":::


**Finetuning task type**

* Every pre-trained model from the model catalog can be finetuned for a specific set of tasks (For Example: Text classification, Token classification, Question answering). Select the task you would like to use from the drop down.

**Training Data**
    
1. Pass in the training data you would like to use to finetune your model. You can choose to either upload a local file (in JSONL, CSV or TSV format) or select an existing registered dataset from your workspace. 

1. Once you've selected the dataset, you need to map the columns from your input data, based on the schema needed for the task. For example: map the column names that correspond to the 'sentence' and 'label' keys for Text Classification

:::image type="content" source="./media/how-to-use-foundation-models/finetune-map-data-columns.png" lightbox="./media/how-to-use-foundation-models/finetune-map-data-columns.png" alt-text="Screenshot showing the finetune map in the foundation models evaluate wizard.":::


* Validation data: Pass in the data you would like to use to validate your model. Selecting 'Automatic split' reserves an automatic split of training data for validation. Alternatively, you can provide a different validation dataset.
* Test data: Pass in the test data you would like to use to evaluate your finetuned model. Selecting 'Automatic split' reserves an automatic split of training data for test. 
* Compute: Provide the Azure Machine Learning Compute cluster you would like to use for finetuning the model. Fine tuning needs to run on GPU compute. We recommend using compute SKUs with A100 / V100 GPUs when fine tuning. Ensure that you have sufficient compute quota for the compute SKUs you wish to use.

3. Select 'Finish' in the Finetune Wizard to submit your finetuning job. Once the job completes, you can view evaluation metrics for the finetuned model. You can then go ahead and register the finetuned model output by the finetuning job and deploy this model to an endpoint for inferencing.

**Advanced Finetuning Parameters:**

The Finetuning UI wizard, allows you to perform basic finetuning by providing your own training data. Additionally, there are several advanced finetuning parameters, such as learning rate, epochs, batch size, etc., described in the Readme file for each task [here](https://github.com/Azure/azureml-assets/tree/main/training/finetune_acft_hf_nlp/components/finetune). Each of these settings has default values, but can be customized via code based samples, if needed.

### Finetuning using code based samples

Currently, Azure Machine Learning supports finetuning models for the following language tasks:

* Text classification 
* Token classification
* Question answering
* Summarization
* Translation

To enable users to quickly get started with fine tuning, we have published samples (both Python notebooks and CLI examples) for each task in the [azureml-examples git repo Finetune samples](https://github.com/Azure/azureml-examples/tree/main/sdk/python/foundation-models/system/finetune). Each model card also links to Finetuning samples for supported finetuning tasks.

## Deploying foundation models to endpoints for inferencing

You can deploy foundation models (both pre-trained models from the model catalog, and finetuned models, once they're registered to your workspace) to an endpoint that can then be used for inferencing. Deployment to both real time endpoints and batch endpoints is supported. You can deploy these models by using either the Deploy UI wizard or by using the code based samples linked from the model card.

### Deploying using the UI wizard

You can invoke the Deploy UI wizard by clicking on the 'Deploy' button on the model card for any foundation model, and selecting either Real-time endpoint or Batch endpoint

:::image type="content" source="./media/how-to-use-foundation-models/deploy-button.png" lightbox="./media/how-to-use-foundation-models/deploy-button.png" alt-text="Screenshot showing the deploy button on the foundation model card.":::

Deployment Settings:
Since the scoring script and environment are automatically included with the foundation model, you only need to specify the Virtual machine SKU to use, number of instances and the endpoint name to use for the deployment.

:::image type="content" source="./media/how-to-use-foundation-models/deploy-options.png" alt-text="Screenshot showing the deploy options on the foundation model card after user selects the deploy button.":::

### Deploying using code based samples

To enable users to quickly get started with deployment and inferencing, we have published samples in the [Inference samples in the azureml-examples git repo](https://github.com/Azure/azureml-examples/tree/main/sdk/python/foundation-models/system/inference). The published samples include Python notebooks and CLI examples. Each model card also links to Inference samples for Real time and Batch inferencing.

## Importing foundation models

If you're looking to use an open source model that isn't included in the Model Catalog, you can import the model from Hugging Face into your Azure Machine Learning workspace. Hugging Face is an open-source library for natural language processing (NLP) that provides pre-trained models for popular NLP tasks. Currently, model import supports importing models for the following tasks:

* fill-mask
* token-classification
* question-answering
* summarization
* text-generation
* text-classification
* translation
* image-classification
* text-to-image

> [!NOTE] 
>Models from Hugging Face are subject to third-party license terms available on the Hugging Face model details page. It is your responsibility to comply with the model's license terms.

You can select the "Import" button on the top-right of the Model Catalog to use the Model Import Notebook.

:::image type="content" source="./media/how-to-use-foundation-models/model-import.png" alt-text="Screenshot showing the model import button as it's displayed in the top right corner on the foundation model catalog.":::

The model import notebook is also included in the azureml-examples git repo [here](https://github.com/Azure/azureml-examples/blob/main/sdk/python/foundation-models/system/import/import_model_into_registry.ipynb).

In order to import the model, you need to pass in the `MODEL_ID` of the model you wish to import from Hugging Face. Browse models on Hugging Face hub and identify the model to import. Make sure the task type of the model is among the supported task types. Copy the model ID, which is available in the URI of the page or can be copied using the copy icon next to the model name. Assign it to the variable 'MODEL_ID' in the Model import notebook. For example:

:::image type="content" source="./media/how-to-use-foundation-models/hugging-face-model-id.png" alt-text="Screenshot showing an example of a hugging face model ID ('bert-base-uncased') as it is displayed in the hugging face model documentation page.":::

You need to provide compute for the Model import to run. Running the Model Import results in the specified model being imported from Hugging Face and registered to your Azure Machine Learning workspace. You can then finetune this model or deploy it to an endpoint for inferencing.

## Next Steps

To learn about how foundation model compares to other methods of training, visit [Foundation Models.](./concept-foundation-models.md)
