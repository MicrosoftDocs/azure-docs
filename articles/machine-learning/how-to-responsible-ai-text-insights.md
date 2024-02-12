---
title: Generate Responsible AI text insights with YAML and Python in Azure Machine Learning
titleSuffix: Azure Machine Learning
description: Learn how to generate Responsible AI text insights with Python and YAML in Azure Machine Learning.
services: machine-learning
ms.service: machine-learning
ms.subservice: rai
ms.topic:  how-to
ms.reviewer: lagayhar
ms.author: wenxwei
author: wenxwei
ms.date: 5/10/2023
ms.custom: responsible-ml, build-2023, devx-track-python
---

# Generate Responsible AI text insights with YAML and Python (preview)

[!INCLUDE [dev v2](includes/machine-learning-dev-v2.md)]

Understanding and assessing NLP models can be different from tabular data. The Responsible AI dashboard now supports text data by expanding the debugging capabilities and visualizations to be able to digest and visualize text data. The Responsible AI text dashboard provides several mature Responsible AI tools in the areas of error analysis, model interpretability, unfairness assessment and mitigation for a holistic assessment and debugging of NLP models and making informed business decisions. You can generate a Responsible AI text dashboard via a pipeline job by using Responsible AI components.


Supported scenarios:  

| Name                            | Description                                         | Parameter name                              |
|---------------------------------|-----------------------------------------------------|---------------------------------------------|
| Multi-label Text Classification | Predict multiple classes for the given text content | `task_type="multilabel_text_classification` |

> [!IMPORTANT]
> Responsible AI Text Insights is currently in public preview. This preview is provided without a service-level agreement, and are not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Responsible AI component

The core component for constructing the Responsible AI text dashboard in Azure Machine Learning is only the Responsible AI text insights component, which is different from how you construct the Responsible AI pipeline for tabular data.

In the following sections are specifications of the Responsible AI text insights component and examples of code snippets in YAML and Python.

### Limitation  

- All models must be registered in Azure Machine Learning.  
- Models in MLflow format and with a sklearn or PyTorch flavor are supported.
- HuggingFace models are supported.  
- The dataset input must be in mltable format.  
- For performance reason, the test dataset is restricted to 5,000 rows of the visualization UI.  

## Responsible AI text insights

This component has three major input ports:

- The machine learning model
- The training dataset
- The test dataset

The easiest way to supply the model is to register the input model and reference the same model in the model input port of Responsible AI text insights component.  

The two datasets should be in mltable format. The training and test datasets provided don't have to be the same datasets that are used in training the model, but they can be the same. 

The Responsible AI text insights component also accepts the following parameters:

| Parameter name | Description | Type |
|----------------|-------------|------|
| `title` | Brief description of the dashboard. | String |
| `target_column_name` | The name of the column in the input datasets, which the model is trying to predict. | String |
| `maximum_rows_for_test_dataset` | The maximum number of rows allowed in the test dataset, for performance reasons. | Integer, defaults to 5,000 |
| `classes` | The full list of class labels in the training dataset. | Optional list of strings |
| `enable_explanation` | Enable to generate an explanation for the model.  | Boolean |
| `enable_error_analysis` | Enable to generate an error analysis for the model.  | Boolean|
| `use_model_dependency` | The  Responsible AI environment doesn't include the model dependency, install the model dependency packages when set to True.  | Boolean |
| `use_conda` | Install the model dependency packages using conda if True, otherwise using pip.  | Boolean |

This component assembles the generated insights into a single Responsible AI text dashboard. There are two output ports:

- The dashboard port contains the completed RAITextInsights object.
- The ux_json port contains the data required to display a minimal dashboard.

# [YAML](#tab/yaml)

```yml
  analyse_model: 
    type: command 
    component: azureml://registries/AzureML-RAI-preview/components/rai_text_insights/versions/2 
    inputs: 
      title: From YAML  
      task_type: text_classification 
      model_input: 
        type: mlflow_model 
        path: azureml:<registered_model_name>:<registered model version> 
      model_info: ${{parent.inputs.model_info}} 
      train_dataset: 
        type: mltable 
        path: ${{parent.inputs.my_training_data}} 
      test_dataset: 
        type: mltable 
        path: ${{parent.inputs.my_test_data}} 
      target_column_name: ${{parent.inputs.target_column_name}} 
      maximum_rows_for_test_dataset: 5000 
      classes: '[]' 
      enable_explanation: True 
      enable_error_analysis: True 

```

# [Python SDK](#tab/python)

```python
#First load the RAI component:  
rai_text_insights_component = ml_client_registry.components.get( 
    name="rai_text_insights", version=version_string 

) 

#Then inside the pipeline:  
        # Initiate the RAI Text Insights 
        rai_text_job = rai_text_insights_component( 
            title="From Python", 
            task_type="text_classification", 
            model_info=expected_model_id, 
            model_input=Input(type=AssetTypes.MLFLOW_MODEL, path= "<azureml:model_name:model_id>"), 
            train_dataset=train_data, 
            test_dataset=test_data, 
            target_column_name=target_column_name, 
            classes=classes, 
        ) 

        #Assemble the output 
        rai_text_job.outputs.dashboard.mode = "upload" 
        rai_text_job.outputs.ux_json.mode = "upload" 
```
---

## Understand the Responsible AI text dashboard

To learn more about how to use the Responsible AI text dashboard, see [Responsible AI text dashboard Azure Machine Learning studio](how-to-responsible-ai-text-dashboard.md).

## Next steps

- Learn more about the [concepts and techniques behind the Responsible AI dashboard](concept-responsible-ai-dashboard.md).
- View sample [YAML and Python notebooks](https://github.com/Azure/azureml-examples/tree/main/sdk/python/responsible-ai) to generate a Responsible AI dashboard with YAML or Python.
- Learn about how the Responsible AI text dashboard was used by ERM for a [business use case](https://aka.ms/erm-customer-story).
