---
title: Generate Responsible AI vision insights with YAML and Python
titleSuffix: Azure Machine Learning
description: Learn how to generate an Azure Machine Learning Responsible AI (RAI) image dashboard by using the vision insights component in a Python or YAML pipeline.
services: machine-learning
ms.service: machine-learning
ms.subservice: rai
ms.topic:  how-to
ms.reviewer: lagayhar
ms.author: ilmat
author: imatiach-msft
ms.date: 05/20/2024
ms.custom: responsible-ml, build-2023, devx-track-python
---

# Generate Responsible AI vision insights with YAML and Python (preview)

[!INCLUDE [dev v2](includes/machine-learning-dev-v2.md)]

The [Responsible AI (RAI) dashboard](concept-responsible-ai-dashboard.md) brings together several RAI tools in a single interface to help inform data-driven decisions about your models. Understanding computer vision models can be different from assessing tabular or text data. RAI dashboard model debugging and visualizations now support image data.

The Responsible AI text dashboard provides several mature RAI tools in the areas of model performance, data exploration, and model interpretability. The dashboard supports holistic assessment and debugging of computer vision models, leading to informed mitigations for fairness issues and transparency across stakeholders to build trust.

This article describes the Responsible AI vision insights component and how to use it in a pipeline job to generate a Responsible AI image dashboard. The following sections provide specifications and requirements for the vision insights component and example code snippets in YAML and Python. To view the full code, see the [sample YAML and Python notebooks for Responsible AI](https://github.com/Azure/azureml-examples/tree/main/sdk/python/responsible-ai).

> [!IMPORTANT]
> The Responsible AI vision insights component is currently in public preview. This preview is provided without a service-level agreement, and isn't recommended for production workloads. Certain features might not be supported or might have constrained capabilities. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Responsible AI vision insights component

The core component for constructing the Responsible AI image dashboard in Azure Machine Learning is the **RAI vision insights component**, which differs from how to construct the [Responsible AI dashboard for tabular data](how-to-responsible-ai-insights-sdk-cli.md#responsible-ai-components).

### Requirements and limitations

- All models must be registered in Azure Machine Learning.
- MLflow models with PyTorch flavor and HuggingFace models are supported.
- The dataset inputs must be in `mltable` format.
- The test dataset is restricted to 5,000 rows of the visualization UI, for performance reasons.
- Complex objects, such as lists of column names, must be supplied as single JSON-encoded strings.
- Hierarchical cohort naming or creating a new cohort from a subset of an existing cohort, and adding images to an existing cohort, aren't supported.
- `Guided_gradcam` doesn't work with vision-transformer models.
- SHapley Additive ExPlanations (SHAP) isn't supported for [AutoML computer vision models](#integration-with-automl).
<!-- - IOU threshold values can't be changed. The current default value is 50%. -->

### Parameters

The Responsible AI vision insights component supports the following scenarios through the `task_type` parameter:

| Name                                          | Description                                 | Parameter name in RAI Vision Insights component |
|-----------------------------------------------|---------------------------------------------|------------------------------------------------------------|
| Image classification (binary and multiclass) | Predict a single class for the given image.  | `task_type="image_classification"`                         |
| Image multilabel classification              | Predict multiple labels for the given image. | `task_type="multilabel_image_classification"`              |
| Object detection                              | Locate and identify classes of multiple objects for a given image, and define objects with a bounding box. |`task_type="object_detection"` |

The RAI vision insights component also accepts the following optional parameters:

| Parameter name                    | Description                                                                        | Type                         |
|-----------------------------------|------------------------------------------------------------------------------------|------------------------------|
| `title`                           | Brief description of the dashboard.                                                | String                       |
| `maximum_rows_for_test_dataset`   | The maximum number of rows allowed in the test dataset. Defaults to 5,000.   | Integer   |
| `classes`                         | The full list of class labels in the training dataset.                             | List of strings     |
| `precompute_explanation`              | Enable generating an explanation for the model.                                   | Boolean                      |
| `enable_error_analysis`           | Enable generating an error analysis for the model.                                | Boolean                      |
| `use_model_dependency`            | The Responsible AI environment doesn't include the model dependencies by default. When set to `True`, installs the model dependency packages. | Boolean |
| `use_conda`                       | Install the model dependency packages using `conda` if `True`, otherwise uses `pip`.    | Boolean                      |

### Ports

The Responsible AI vision insights component has three major input ports:

- The machine learning model
- The training dataset
- The test dataset

To start, register your input model in Azure Machine Learning and reference the same model in the `model_input` port of the Responsible AI vision insights component.

To generate RAI image dashboard model-debugging insights like model performance, data explorer, and model interpretability, and populate visualizations, use the same training and test datasets as for training your model. The datasets should be in `mltable` format and don't have to be, but can be the same dataset.

The following example shows the dataset schema for the image classification task type:

```python
DataFrame({ 'image_path_1' : 'label_1', 'image_path_2' : 'label_2' ... })
```

The following example shows the dataset schema for the object detection task type:

```python
DataFrame({
'image_path_1' : [
[object_1, topX1, topY1, bottomX1, bottomY1, (optional) confidence_score],
[object_2, topX2, topY2, bottomX2, bottomY2, (optional) confidence_score],
[object_3, topX3, topY3, bottomX3, bottomY3, (optional) confidence_score]
],
'image_path_2': [
[object_1, topX4, topY4, bottomX4, bottomY4, (optional) confidence_score],
[object_2, topX5, topY5, bottomX5, bottomY5, (optional) confidence_score]
]
})
```

The component assembles the generated insights into a single Responsible AI image dashboard. There are two output ports:

- The `insights_pipeline_job.outputs.dashboard` port contains the completed `RAIVisionInsights` object.
- The `insights_pipeline_job.outputs.ux_json` port contains the data required to display a minimal dashboard.

### Pipeline job

To create the Responsible AI image dashboard, define the RAI components in a pipeline and submit the pipeline job.

# [YAML](#tab/yaml)

You can specify the pipeline in a YAML file, as in the following example.

```yml
  analyse_model:
    type: command
    component: azureml://registries/AzureML-RAI-preview/components/rai_vision_insights/versions/2
    inputs:
      title: From YAML 
      task_type: image_classification
      model_input:
        type: mlflow_model
        path: azureml:<registered_model_name>:<registered model version>
      model_info: ${{parent.inputs.model_info}}
      test_dataset:
        type: mltable
        path: ${{parent.inputs.my_test_data}}
      target_column_name: ${{parent.inputs.target_column_name}}
      maximum_rows_for_test_dataset: 5000
      classes: '["cat", "dog"]'
      precompute_explanation: True
      enable_error_analysis: True
```

You can submit the pipeline by using the Azure CLI `az ml job create` command.

# [Python SDK](#tab/python)

The Responsible AI image dashboard uses the [Responsible AI Vision SDK for Python](https://github.com/microsoft/responsible-ai-toolbox/tree/main/responsibleai_vision).

In your Python script, load the RAI vision insights component:

```python
rai_vision_insights_component = ml_client_registry.components.get(
    name="rai_vision_insights", label="latest"
)
```

Inside the pipeline, initiate the RAI vision insights as in the following example:

```python

        rai_vision_job = rai_vision_insights_component(
            title="From Python",
            task_type="image_classification",
            model_info=expected_model_id,
            model_input=Input(type=AssetTypes.MLFLOW_MODEL, path= "<azureml:model_name:model_id>"),
            test_dataset=test_data,
            target_column_name=target_column_name,
            classes=classes,
        )
```

And assemble the output:

```python
        rai_image_job.outputs.dashboard.mode = "upload"
        rai_image_job.outputs.ux_json.mode = "upload"
```

To learn how to submit the pipeline by using the Python SDK, see the [AutoML Image Classification scenario with RAI Dashboard sample notebook](https://github.com/Azure/azureml-examples/tree/main/sdk/python/responsible-ai).

---

You can also use the **Designer** UI in Azure Machine Learning studio to [create and submit a RAI-vision insights component pipeline](how-to-create-component-pipelines-ui.md).

After you specify and submit the pipeline and it executes, the dashboard should appear in the Machine Learning studio in the registered model view.

## Integration with AutoML

Automated ML in Azure Machine Learning supports model training for computer vision tasks like image classification and object detection. AutoML models for computer vision are integrated with the RAI image dashboard for debugging AutoML vision models and explaining model predictions.

To generate Responsible AI insights for AutoML computer vision models, register your best AutoML model in the Azure Machine Learning workspace and run it through the Responsible AI vision insights pipeline. For more information, see [Set up AutoML to train computer vision models](how-to-auto-train-image-models.md).

For notebooks related to AutoML supported computer vision tasks, see [RAI vision dashboard and scorecard notebooks](https://github.com/Azure/azureml-examples/tree/main/sdk/python/responsible-ai/vision#directory-) and [automl-standalone-jobs](https://github.com/Azure/azureml-examples/tree/main/sdk/python/jobs/automl-standalone-jobs).

### AutoML-specific RAI vision insights parameters
<a name="responsible-ai-vision-insights-component-parameter-automl-specific"></a>

In addition to the parameters in the preceding section, AutoML models can use the following AutoML-specific RAI vision component parameters.

> [!NOTE]
> A few parameters are specific to the Explainable AI (XAI) algorithm chosen and are optional for other algorithms.

| Parameter name | Description                                           | Type                             | Values |
|----------------|-------------------------------------------------------|----------------------------------|--------|
| `model_type`   | Flavor of the model. Select `pyfunc` for AutoML models. | Enum |`pyfunc`, <br> `fastai` |
| `dataset_type` | Whether the images in the dataset are read from publicly available URLs or are stored in the user's datastore. <br> For AutoML models, images are always read from the user's workspace datastore, so the dataset type for AutoML models is `private`. For `private` dataset type, you download the images on the compute before generating the explanations. | Enum | `public`, <br> `private` |
| `xai_algorithm` | Type of XAI algorithm supported for AutoML models <br> Note: SHAP isn't supported for AutoML models. | Enum | `guided_backprop`, <br> `guided_gradCAM`, <br> `integrated_gradients`, <br> `xrai` |
| `xrai_fast` | Whether to use the faster version of `xrai`. If `True`, computation time for explanations is faster but leads to less accurate explanations or attributions. | Boolean ||
| `approximation_method` | This parameter is specific to `integrated gradients`. <br> Method for approximating the integral.| Enum | `riemann_middle`, <br> `gausslegendre` |
| `n_steps` | This parameter is specific to `integrated gradients` and `xrai`. <br> The number of steps used by the approximation method. Larger number of steps lead to better approximations of attributions or explanations. The range of `n_steps` is [2, inf], but the performance of attributions starts to converge after 50 steps.| Integer||
| `confidence_score_threshold_multilabel` | This parameter is specific to multilabel classification. The confidence score threshold above which labels are selected for generating explanations. | Float ||

### Generate model explanations for AutoML models

Once the AutoML pipeline completes and the Responsible AI vision dashboard is generated, you need to connect the dashboard to a running compute instance to generate explanations. Once the compute instance is connected, you can select the input image, and explanations using the selected XAI algorithm appear in the sidebar to the right.

> [!NOTE]
> For image classification models, methods like `xrai` and `integrated gradients` usually provide better visual explanations than `guided_backprop` and `guided_gradCAM`, but are much more compute intensive.

## Related content

- Learn how to [use the Responsible AI image dashboard in Azure Machine Learning studio](how-to-responsible-ai-image-dashboard.md).
- Learn more about the [concepts and techniques behind the Responsible AI dashboard](concept-responsible-ai-dashboard.md).
- View sample [YAML and Python notebooks](https://github.com/Azure/azureml-examples/tree/main/sdk/python/responsible-ai).
- Learn more about how you can use the Responsible AI image dashboard to debug image data and models and inform better decision-making in this [tech community blog post](https://aka.ms/rai-object-detection-blog).
- Learn about how the Responsible AI dashboard was used by Clearsight in a [real-life customer story](https://customers.microsoft.com/story/1548724923828850434-constellation-clearsight-energy-azure-machine-learning).
