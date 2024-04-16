---
title: Generate Responsible AI vision insights with YAML and Python in Azure Machine Learning
titleSuffix: Azure Machine Learning
description: Learn how to generate Responsible AI vision insights with Python and YAML in Azure Machine Learning.
services: machine-learning
ms.service: machine-learning
ms.subservice: rai
ms.topic:  how-to
ms.reviewer: lagayhar
ms.author: ilmat
author: imatiach-msft
ms.date: 5/10/2023
ms.custom: responsible-ml, build-2023, devx-track-python
---

# Generate Responsible AI vision insights with YAML and Python (preview)

[!INCLUDE [dev v2](includes/machine-learning-dev-v2.md)]

Understanding and assessing computer vision models requires a different set of Responsible AI tools, compared to tabular and text scenarios. The Responsible AI dashboard now supports image data by expanding debugging capabilities to be able to digest and visualize image data. The Responsible AI dashboard for Image provides several mature Responsible AI tools in the areas of model performance, data exploration, and model interpretability for a holistic assessment and debugging of computer vision models – leading to informed mitigations to resolve fairness issues, and transparency across stakeholders to build trust. You can generate a Responsible AI vision dashboard via an Azure Machine Learning pipeline job by using Responsible AI components.

Supported scenarios:

| Name                                          | Description                                 | Parameter name in RAI Vision Insights component |
|-----------------------------------------------|---------------------------------------------|------------------------------------------------------------|
| Image Classification (Binary and Multi-class) | Predict a single class for the given image  | `task_type="image_classification"`                         |
| Image Multi-label Classification              | Predict multiple labels for the given image | `task_type="multilabel_image_classification"`              |
| Object Detection                              | Locate and identify the class of multiple objects for a given image. An object is defined with a bounding box. |`task_type="object_detection"` |

> [!IMPORTANT]
> Responsible AI vision insights is currently in public preview. This preview is provided without a service-level agreement, and are not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).


## Responsible AI component

The core component for constructing the Responsible AI image dashboard in Azure Machine Learning is the **RAI Vision Insights component**, which differs from how to construct the Responsible AI dashboard for tabular data.

The following sections contain specifications of the Responsible AI  vision insights component and examples of code snippets in YAML and Python. To view the full code, see [sample YAML and Python notebooks](https://github.com/Azure/azureml-examples/tree/main/sdk/python/responsible-ai).

## Limitations

- All models must be registered in Azure Machine Learning in MLflow format and with a PyTorch flavor. HuggingFace models are also supported.  
- The dataset inputs must be in mltable format.
- For performance reasons, the test dataset is restricted to 5,000 rows of the visualization UI.  
- Complex objects (such as lists of column names) have to be supplied as single JSON-encoded string before being passed to the Responsible AI vision insights component.
- Guided_gradcam doesn't work with vision-transformer models
- SHAP isn't supported for AutoML computer vision models
- Hierarchical cohort naming (creating a new cohort from a subset of an existing cohort) and adding images to an existing cohort is unsupported.  
- IOU threshold values can't be changed (the current default value is 50%).

## Responsible AI vision insights

The Responsible AI vision insights component has three major input ports:

- The machine learning model
- The training dataset
- The test dataset

To start, register your input model in Azure Machine Learning and reference the same model in the model input port of the Responsible AI vision insights component. To generate model-debugging insights (model performance, data explorer, and model interpretability tools) and populate visualizations in your Responsible AI dashboard, use the training and test image dataset that you used when training your model. The two datasets should be in mltable format. The training and test dataset can be the same.

 Dataset schema for the different vision task types:

- Object Detection

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

- Image Classification

    ```python
    DataFrame({ 'image_path_1' : 'label_1', 'image_path_2' : 'label_2' ... })
    ```

The RAI vision insights component also accepts the following parameters:

| Parameter name                    | Description                                                                        | Type                         |
|-----------------------------------|------------------------------------------------------------------------------------|------------------------------|
| `title`                           | Brief description of the dashboard.                                                | String                       |
| `task_type`                       | Specifies whether the scenario of the model.                                       | String                       |
| `maximum_rows_for_test_dataset`   | The maximum number of rows allowed in the test dataset, for performance reasons.   | Integer, defaults to 5,000   |
| `classes`                         | The full list of class labels in the training dataset.                             | Optional list of strings     |
| `precompute_explanation`              | Enable to generate an explanation for the model.                                   | Boolean                      |
| `enable_error_analysis`           | Enable to generate an error analysis for the model.                                | Boolean                      |
| `use_model_dependency`            | The Responsible AI environment doesn't include the model dependency, install the model dependency packages when set to True. | Boolean |
| `use_conda`                       | Install the model dependency packages using conda if True, otherwise using pip.    | Boolean                      |

This component assembles the generated insights into a single Responsible AI image dashboard. There are two output ports:

- The `insights_pipeline_job.outputs.dashboard` port contains the completed `RAIVisionInsights` object.
- The `insights_pipeline_job.outputs.ux_json` port contains the data required to display a minimal dashboard.

After specifying and submitting the pipeline to Azure Machine Learning for execution, the dashboard should appear in the Azure Machine Learning portal in the registered model view.

# [YAML](#tab/yaml)

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

# [Python SDK](#tab/python)

```python
#First load the RAI component: 
rai_vision_insights_component = ml_client_registry.components.get(
    name="rai_vision_insights", label="latest"
)

#Then construct the pipeline: 
        # Initiate Responsible AI Vision Insights
        rai_vision_job = rai_vision_insights_component(
            title="From Python",
            task_type="image_classification",
            model_info=expected_model_id,
            model_input=Input(type=AssetTypes.MLFLOW_MODEL, path= "<azureml:model_name:model_id>"),
            test_dataset=test_data,
            target_column_name=target_column_name,
            classes=classes,
        )
        
        #Assemble the output
        rai_image_job.outputs.dashboard.mode = "upload"
        rai_image_job.outputs.ux_json.mode = "upload"

```

---

## Integration with AutoML Image


Automated ML in Azure Machine Learning supports model training for computer vision tasks like image classification and object detection. To debug AutoML vision models and explain model predictions, AutoML models for computer vision are integrated with Responsible AI dashboard. To generate Responsible AI insights for AutoML computer vision models, register your best AutoML model in the Azure Machine Learning workspace and run it through the Responsible AI vision insights pipeline. To learn, see [how to set up AutoML to train computer vision models](how-to-auto-train-image-models.md#register-and-deploy-model).

Notebooks related to the AutoML supported computer vision tasks can be found in [azureml-examples](https://github.com/Azure/azureml-examples/tree/main/sdk/python/jobs/automl-standalone-jobs) repository.

### Mode of submitting the Responsible AI vision insights pipeline

The Responsible AI vision Insights pipeline could be submitted through one of the following methods

- Python SDK: To learn how to submit the pipeline through Python, see [the AutoML Image Classification scenario with RAI Dashboard sample notebook](https://github.com/Azure/azureml-examples/tree/main/sdk/python/responsible-ai). For constructing the pipeline, refer to section 5.1 in the notebook.
- Azure CLI: To submit the pipeline via Azure-CLI, see the component YAML in section 5.2 of the example notebook linked above.
- UI (via Azure Machine Learning studio): From the Designer in Azure Machine Learning studio, the RAI-vision insights component can be used to create and submit a pipeline.


### Responsible AI vision insights component parameter (AutoML specific)

In addition to the list of Responsible AI vision insights parameters provided in the previous section, the following are parameters to set specifically for AutoML models.

> [!NOTE]
> A few parameters are specific to the XAI algorithm chosen and are optional for other algorithms.

| Parameter name | Description                                           | Type                             |
|----------------|-------------------------------------------------------|----------------------------------|
| `model_type`   | Flavor of the model. Select pyfunc for AutoML models. | Enum <br> - Pyfunc <br> - fastai |
| `dataset_type` | Whether the Images in the dataset are read from publicly available url or they're stored in the user's datastore. <br> For AutoML models, images are always read from User's workspace datastore, hence the dataset type for AutoML models is "private". <br> For private dataset type, we download the images on the compute before generating the explanations. | Enum <br> - Public <br> - Private |
| `xai_algorithm` | Type of the XAI algorithms supported for AutoML Models <br> Note: Shap isn't supported for AutoML models. | Enum <br> - `guided_backprop` <br> - `guided_gradcam` <br> - `integrated_gradients` <br> - `xrai` |
| `xrai_fast` | Whether to use faster version of XRAI. if True, then computation time for explanations is faster but leads to less accurate explanations (attributions) | Boolean |
| `approximation_method` | This Parameter is only specific to Integrated gradients. <br> Method for approximating the integral. Available approximation methods are `riemann_middle` and `gausslegendre`.| Enum <br> - `riemann_middle` <br> - `gausslegendre` |
| `n_steps` | This parameter is specific to Integrated gradients and XRAI method. <br> The number of steps used by the approximation method. Larger number of steps lead to better approximations of attributions (explanations). Range of n_steps is [2, inf), but the performance of attributions starts to converge after 50 steps.| Integer|
| `confidence_score_threshold_multilabel` | This parameter is specific to multilabel classification only. Specify the threshold on confidence score, above which the labels are selected for generating explanations. | Float |

### Generating model explanations for AutoML models

Once the pipeline is complete and the Responsible AI dashboard is generated, you need to connect it to a compute instance for generating the explanations.  Once the compute instance is connected, you can select the input image, and it shows the explanations using the selected XAI algorithm in the sidebar from the right.
> [!NOTE]
> For image classification models, methods like XRAI and Integrated gradients usually provide better visual explanations when compared to guided backprop and guided gradCAM, but are much more compute intensive.

## Understand the Responsible AI image dashboard

To learn more about how to use the Responsible AI image dashboard, see [Responsible AI image dashboard in Azure Machine Learning studio](how-to-responsible-ai-image-dashboard.md).

## Next steps

- Learn more about the [concepts and techniques behind the Responsible AI dashboard](concept-responsible-ai-dashboard.md).
- View sample [YAML and Python notebooks](https://github.com/Azure/azureml-examples/tree/main/sdk/python/responsible-ai) to generate a Responsible AI dashboard with YAML or Python.
- Learn more about how you can use the Responsible AI image dashboard to debug image data and models and inform better decision-making in this [tech community blog post](https://aka.ms/rai-object-detection-blog).
- Learn about how the Responsible AI dashboard was used by Clearsight in a [real-life customer story](https://customers.microsoft.com/story/1548724923828850434-constellation-clearsight-energy-azure-machine-learning).
