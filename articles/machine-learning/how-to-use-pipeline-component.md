---
title: How to use pipeline component in pipeline
titleSuffix: Azure Machine Learning
description: How to use pipeline component to build nested pipeline job in Azure Machine Learning pipeline using CLI v2 and Python SDK
services: machine-learning
ms.service: machine-learning
ms.subservice: mlops
ms.topic: how-to
author: cloga
ms.author: lochen
ms.reviewer: lagayhar
ms.date: 04/12/2023
ms.custom:
  - sdkv2
  - cliv2
  - devx-track-python
  - ignite-2023
---

# How to use pipeline component to build nested pipeline job (V2) (preview)

[!INCLUDE [dev v2](includes/machine-learning-dev-v2.md)]

When developing a complex machine learning pipeline, it's common to have sub-pipelines that use multi-step to perform tasks such as data preprocessing and model training. These sub-pipelines can be developed and tested standalone. Pipeline component groups multi-step as a component that can be used as a single step to create complex pipelines. Which will help you share your work and better collaborate with team members.

By using a pipeline component, the author can focus on developing sub-tasks and easily integrate them with the entire pipeline job. Furthermore, a pipeline component has a well-defined interface in terms of inputs and outputs, which means that user of the pipeline component doesn't need to know the implementation details of the component.

In this article, you'll learn how to use pipeline component in Azure Machine Learning pipeline.

[!INCLUDE [machine-learning-preview-generic-disclaimer](includes/machine-learning-preview-generic-disclaimer.md)]

## Prerequisites

- Understand how to use Azure Machine Learning pipeline with [CLI v2](how-to-create-component-pipelines-cli.md) and [SDK v2](how-to-create-component-pipeline-python.md).
- Understand what is [component](concept-component.md) and how to use component in Azure Machine Learning pipeline.
- Understand what is a [Azure Machine Learning pipeline](concept-ml-pipelines.md)

## The difference between pipeline job and pipeline component

In general, pipeline components are similar to pipeline jobs because they both contain a group of jobs/components.

Here are some main differences you need to be aware of when defining pipeline components:

- Pipeline component only defines the interface of inputs/outputs, which means when defining a pipeline component you need to explicitly define the type of inputs/outputs instead of directly assigning values to them.
- Pipeline component can't have runtime settings, you can't hard-code compute, or data node in the pipeline component. Instead you need to promote them as pipeline level inputs and assign values during runtime.
- Pipeline level settings such as default_datastore and default_compute are also runtime settings. They aren't part of pipeline component definition.

### CLI v2

The example used in this article can be found in [azureml-example repo](https://github.com/Azure/azureml-examples). Navigate to *azureml-examples/cli/jobs/pipelines-with-components/pipeline_with_pipeline_component* to check the example.

You can use multi-components to build a pipeline component. Similar to how you built pipeline job with component. This is two step pipeline component.

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/pipelines-with-components/pipeline_with_pipeline_component/pipeline_with_train_eval_pipeline_component/components/train_pipeline_component.yml" highlight="7-48":::

When reference pipeline component to define child job in a pipeline job, just like reference other type of component. You can provide runtime settings such as default_datastore, default_compute in pipeline job level, any parameter you want to change during run time need promote as pipeline job inputs, otherwise, they'll be hard-code in next pipeline component. We're support to promote compute as pipeline component input to support heterogenous pipeline, which may need different compute target in different steps.

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/pipelines-with-components/pipeline_with_pipeline_component/pipeline_with_train_eval_pipeline_component/pipeline.yml" highlight="11-16,23-25,60":::

### Python SDK

The python SDK example can be found in [azureml-example repo](https://github.com/Azure/azureml-examples). Navigate to *azureml-examples/sdk/python/jobs/pipelines/1j_pipeline_with_pipeline_component/pipeline_with_train_eval_pipeline_component* to check the example.

You can define a pipeline component using a Python function, which is similar to defining a pipeline job using a function. You can also promote the compute of some step to be used as inputs for the pipeline component.

[!notebook-python[] (~/azureml-examples-main/sdk/python/jobs/pipelines/1j_pipeline_with_pipeline_component/pipeline_with_train_eval_pipeline_component/pipeline_with_train_eval_pipeline_component.ipynb?name=pipeline-component)]

You can use pipeline component as a step like other components in pipeline job.

[!notebook-python[] (~/azureml-examples-main/sdk/python/jobs/pipelines/1j_pipeline_with_pipeline_component/pipeline_with_train_eval_pipeline_component/pipeline_with_train_eval_pipeline_component.ipynb?name=pipeline-component-pipeline-job)]

## Pipeline job with pipeline component in studio

You can use `az ml component create` or `ml_client.components.create_or_update` to register pipeline component as a registered component. After that you can view the component in asset library and component list page.

### Using pipeline component to build pipeline job

After you register the pipeline component, you can drag and drop the pipeline component into the designer canvas and use the UI to build pipeline job.

:::image type="content" source="./media/how-to-use-pipeline-component/pipeline-component-authoring.png" alt-text="Screenshot of the designer canvas page to build pipeline job with pipeline component." lightbox= "./media/how-to-use-pipeline-component/pipeline-component-authoring.png":::

### View pipeline job using pipeline component

After submitted pipeline job, you can go to pipeline job detail page to change pipeline component status, you can also drill down to child component in pipeline component to debug specific component.

:::image type="content" source="./media/how-to-use-pipeline-component/pipeline-component-right-panel.png" alt-text="Screenshot of view pipeline component on the pipeline job detail page." lightbox= "./media/how-to-use-pipeline-component/pipeline-component-right-panel.png":::

## Sample notebooks

- [nyc_taxi_data_regression_with_pipeline_component](https://github.com/Azure/azureml-examples/blob/main/sdk/python/jobs/pipelines/1j_pipeline_with_pipeline_component/nyc_taxi_data_regression_with_pipeline_component/nyc_taxi_data_regression_with_pipeline_component.ipynb)
- [pipeline_with_train_eval_pipeline_component](https://github.com/Azure/azureml-examples/blob/main/sdk/python/jobs/pipelines/1j_pipeline_with_pipeline_component/pipeline_with_train_eval_pipeline_component/pipeline_with_train_eval_pipeline_component.ipynb)

## Next steps

- [YAML reference for pipeline component](reference-yaml-component-pipeline.md)
- [Track an experiment](how-to-log-view-metrics.md)
- [Deploy a trained model](how-to-deploy-managed-online-endpoints.md)
- [Deploy a pipeline with batch endpoints](how-to-use-batch-pipeline-deployments.md)
