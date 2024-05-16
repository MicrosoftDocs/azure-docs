---
title: Responsible AI text insight generation with YAML and Python
titleSuffix: Azure Machine Learning
description: Learn how to generate Azure Machine Learning Responsible AI (RAI) text insights by using Python and YAML.
services: machine-learning
ms.service: machine-learning
ms.subservice: rai
ms.topic:  how-to
ms.reviewer: lagayhar
ms.author: wenxwei
author: wenxwei
ms.date: 5/15/2024
ms.custom: responsible-ml, build-2023, devx-track-python
---

# Responsible AI text insight generation with YAML and Python (preview)

[!INCLUDE [dev v2](includes/machine-learning-dev-v2.md)]

The [Responsible AI (RAI) dashboard](concept-responsible-ai-dashboard.md) brings together several RAI tools in a single interface to help inform data-driven decisions about your models. Understanding natural language processing (NLP) models can be different from assessing tabular data. RAI dashboard debugging and visualizations now support text data.

The Responsible AI text dashboard provides several mature RAI tools in the areas of error analysis, model interpretability, unfairness assessment, and mitigation. The dashboard supports a holistic assessment and debugging of NLP models for making informed business decisions.

This article describes how the Responsible AI text insights component generates a Responsible AI text dashboard by using a pipeline job. The following sections provide specifications and requirements for the text insights component and example code snippets in YAML and Python.

> [!IMPORTANT]
> The Responsible AI text dashboard is currently in public preview. This preview is provided without a service-level agreement, and isn't recommended for production workloads. Certain features might not be supported or might have constrained capabilities. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Responsible AI text insights component

The Azure Machine Learning Responsible AI text insights component assembles generated insights into a single Responsible AI text dashboard, and is the only core component used for constructing the RAI text dashboard. This construction differs from the [Responsible AI pipeline for tabular data](how-to-responsible-ai-insights-sdk-cli.md#responsible-ai-components), which uses several components.

### Requirements and limitations

- All models must be registered in Azure Machine Learning.
- MLflow models with a sklearn (scikit-learn) or PyTorch flavor and HuggingFace models are supported.
- The training and test dataset inputs must be in mltable format.
- For performance reason, the test dataset is restricted to 5,000 rows of the visualization UI.

### Parameters

The Responsible AI text insights `task_type` parameter supports the following scenarios:

| Name                            | Description                                         | Parameter value                              |
|---------------------------------|-----------------------------------------------------|---------------------------------------------|
| Text Classification | Predict classes for the given text content | `task_type="text_classification"` |
| Multi-label Text Classification | Predict multiple classes for the given text content | `task_type="multilabel_text_classification"` |
| Text Question Answering | Evaluate a question answering model on the text dataset | `task_type="question_answering"` |

The Responsible AI text insights component accepts the following other parameters:

| Parameter name | Description | Type |
|----------------|-------------|------|
| `title` | (Optional) Brief description of the dashboard. | String |
| `classes` | (Optional) The full list of class labels in the training dataset. | List of strings |
| `maximum_rows_for_test_dataset` | (Optional) The maximum number of rows allowed in the test dataset, for performance reasons. Defaults to 5,000. | Integer |
| `target_column_name` | The name of the column in the input datasets that the model is trying to predict. | String |
| `enable_explanation` | Enable generating an explanation for the model.  | Boolean |
| `enable_error_analysis` | Enable generating an error analysis for the model.  | Boolean|
| `use_model_dependency` | The Responsible AI environment doesn't include the model dependencies. When set to `True`, installs the model dependency packages.  | Boolean |
| `use_conda` | Installs the model dependency packages using `conda` if set to `True`, otherwise uses `pip`.  | Boolean |

### Ports

The Responsible AI text insights component has three major input ports:

- The machine learning model
- The training dataset
- The test dataset

The easiest way to supply the input model is to register the model and reference the same model in the `model_input` port of the Responsible AI text insights component.

The training and test datasets don't have to be, but can be the same dataset.

There are two output ports:

- The `dashboard` port contains the completed `RAITextInsights` object.
- The `ux_json` port contains the data required to display a minimal dashboard.

# [YAML](#tab/yaml)

You can specify the pipeline as a YAML file, as in the following example, and submit it by using the Azure CLI command line.

```yml
jobs:
  analyse_model: 
    type: command 
    component: azureml://registries/AzureML/components/rai_text_insights/versions/2 
    inputs: 
      title: From YAML  
      task_type: text_classification 
      model_input: 
        type: mlflow_model 
        path: {azureml_model_id}
      model_info: ${{{{parent.inputs.model_info}}}} 
      train_dataset: ${{{{parent.inputs.my_training_data}}}} 
      test_dataset: ${{{{parent.inputs.my_test_data}}}} 
      target_column_name: {target_column_name} 
      maximum_rows_for_test_dataset: 5000 
      classes: '[]' 
      enable_explanation: True 
      enable_error_analysis: True 
```

# [Python SDK](#tab/python)

The Responsible AI text dashboard uses the [Responsible AI Text SDK for Python](https://github.com/microsoft/responsible-ai-toolbox/tree/main/responsibleai_text).

First, load the RAI component:

```python
rai_text_insights_component = ml_client_registry.components.get( 
    name="rai_text_insights", version=version_string 
) 
```

Then, inside the pipeline, initiate the RAI Text Insights as in the following example:

```python
        rai_text_job = rai_text_insights_component( 
            title="From Python", 
            task_type="text_classification", 
            model_info=expected_model_id, 
            model_input=Input(type=AssetTypes.MLFLOW_MODEL, path= azureml_model_id), 
            train_dataset=train_data, 
            test_dataset=test_data, 
            target_column_name=target_column_name, 
            classes=classes, 
        ) 
```

And assemble the output:

```python
        rai_text_job.outputs.dashboard.mode = "upload" 
        rai_text_job.outputs.ux_json.mode = "upload" 
```
---

## Related content

- Learn [how to use the Responsible AI text dashboard](how-to-responsible-ai-text-dashboard.md).
- Learn more about the [concepts and techniques behind the Responsible AI dashboard](concept-responsible-ai-dashboard.md).
- View sample [YAML and Python notebooks](https://github.com/Azure/azureml-examples/tree/main/sdk/python/responsible-ai) to generate a Responsible AI dashboard.
