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
ms.date: 03/13/2023
ms.custom: sdkv2, cliv2, 
---

# How to use pipeline component to build nested pipeline job (V2) (preview)

[!INCLUDE [dev v2](../../includes/machine-learning-dev-v2.md)]

When developing complex machine learning pipeline, there will be sub-pipeline which will use multi-step to doing some task such as data preprocessing, model training. And they can develop and test standalone. We introduce pipeline component, which can group multi-step as component, then you can use them to as single step built complex pipeline, this will help your share your work and better collaborate with team members.

Pipeline component author can focus on the sub-task, and easy to integrate pipeline component with whole pipeline job. Meanwhile, as pipeline component have well defined interface (inputs/outputs), pipeline component user didn't need to know detail implementation of pipeline component.

In this article, you'll learn how to use pipeline component in Azure Machine Learning pipeline.

## Prerequisite

- Understand how to use Azure ML pipeline with [CLI v2](how-to-create-component-pipelines-cli.md) and [SDK v2](how-to-create-component-pipeline-python.md).
- Understand what is [component](concept-ml-pipelines.md) and how to use component in Azure Machine Learning pipeline.
- Understand what is a [Azure Machine Learning pipeline](concept-ml-pipelines.md)

## The difference of pipeline job and pipeline component

In general, pipeline component is much similar to pipeline job. They are both consist of group of jobs/component. Here are some main difference you need aware when defining pipeline component:

- Pipeline component only define the interface of inputs/outputs, which means when define pipeline component your need explicitly define type of inputs/outputs instead of directly assign values to them.
- Pipeline component can not have runtime settings, your can not hard-code compute, data node in pipeline component, you need promote them as pipeline level inputs, and assign values during runtime.
- Pipeline level settings such as default_datastore, default_compute are also runtime setting, they are also not part of pipeline component definition.

### CLI v2

The example used in this article can be found in [azureml-example repo](https://github.com/Azure/azureml-examples). Navigate to *[azureml-examples/cli/jobs/pipelines-with-components/pipeline_with_pipeline_component* to check the example.

You can use multi-components to built a pipeline component. Much similar like how you built pipeline job with component. This is two step pipeline component.

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/pipelines-with-components/pipeline_with_pipeline_component/pipeline_with_train_eval_pipeline_component/components/train_pipeline_component.yml" highlight="7-48":::

When reference pipeline component to define child job in pipeline job, just like reference other type of component. You can provide runtime settings such as default_datastore, default_compute in pipeline job level, any parameter you want to change during run time need promote as pipeline job inputs, otherwise, they will be hard-code in next pipeline component. We are support to promote compute as pipeline component input to support heterogenous pipeline which may need different compute target in different steps.

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/pipelines-with-components/pipeline_with_pipeline_component/pipeline_with_train_eval_pipeline_component/pipeline.yml" highlight="11-16,23-25,60":::

### Python SDK

The python SDK example can be found in [azureml-example repo](https://github.com/Azure/azureml-examples). Navigate to *azureml-examples/sdk/python/jobs/pipelines/1j_pipeline_with_pipeline_component/pipeline_with_train_eval_pipeline_component* to check the example.

You can use python function to define pipeline component, much similar like using function to define pipeline job. You can also promote compute of some step as pipeline component inputs.

[!notebook-python[] (~/azureml-examples-v2samplesreorg/sdk/python/jobs/pipelines/1j_pipeline_with_pipeline_component/pipeline_with_train_eval_pipeline_component/pipeline_with_train_eval_pipeline_component.ipynb?name=pipeline-component)]

Pipeline component can use as step like other component in pipeline job.

[!notebook-python[] (~/azureml-examples-v2samplesreorg/sdk/python/jobs/pipelines/1j_pipeline_with_pipeline_component/pipeline_with_train_eval_pipeline_component/pipeline_with_train_eval_pipeline_component.ipynb?name=pipeline-component-pipeline-job)]

## Check pipeline job with sweep step in Studio

You can use az ml component create or ml_client.components.create_or_update to register pipeline component as registered component. After that you can view component in asset library and component list page.

### Using pipeline component to build pipeline job

After register pipeline component, you can drag and drop pipeline component in designer canvas and use UI to build pipeline job.

:::image type="content" source="./media/how-to-use-pipeline-component/pipeline-component-authoring.png" alt-text="Screenshot of the designer canvas page to build pipeline job with pipeline component." lightbox= "./media/how-to-use-pipeline-component/pipeline-component-authoring.png":::

### View pipeline job using pipeline component

After submitted pipeline job, you can go to pipeline job detail page to change pipeline component status, you can also drill down to child component in pipeline component to debug specific component.

:::image type="content" source="./media/how-to-use-pipeline-component/pipeline-component-right-panel.png" alt-text="Screenshot of view pipeline component." lightbox= "./media/how-to-use-pipeline-component/pipeline-component-right-panel.png":::

## Sample notebooks

- [Build pipeline with sweep node](https://github.com/Azure/azureml-examples/blob/v2samplesreorg/sdk/python/jobs/pipelines/1c_pipeline_with_hyperparameter_sweep/pipeline_with_hyperparameter_sweep.ipynb)
- [Run hyperparameter sweep on a command job](https://github.com/Azure/azureml-examples/blob/v2samplesreorg/sdk/python/jobs/single-step/lightgbm/iris/lightgbm-iris-sweep.ipynb)

## Next steps
- [YAML reference for pipeline component](reference-yaml-component-pipeline.md)
- [Track an experiment](how-to-log-view-metrics.md)
- [Deploy a trained model](how-to-deploy-managed-online-endpoints.md)
