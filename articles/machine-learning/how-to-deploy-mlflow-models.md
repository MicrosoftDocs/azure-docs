---
title: Guidelines for deploying MLflow models
titleSuffix: Azure Machine Learning
description: Learn to deploy your MLflow model to the deployment targets supported by Azure Machine Learning.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
author: santiagxf
ms.author: fasantia
ms.reviewer: mopeakande
reviewer: msakande
ms.date: 01/12/2024
ms.topic: concept-article
ms.custom: deploy, mlflow, devplatv2, no-code-deployment, cliv2, event-tier1-build-2022, update-code
ms.devlang: azurecli
---

# Guidelines for deploying MLflow models

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]


In this article, learn about deployment of [MLflow](https://www.mlflow.org) models to Azure Machine Learning for both real-time and batch inference. Learn also about the different tools you can use to manage the deployment.


## Deployment of MLflow models vs. custom models

Unlike custom model deployment in Azure Machine Learning, when you deploy MLflow models to Azure Machine Learning, you don't have to provide a scoring script or an environment for deployment. Instead, Azure Machine Learning automatically generates the scoring script and environment for you. This functionality is called _no-code deployment_.

For no-code deployment, Azure Machine Learning:

* Ensures that all the package dependencies indicated in the MLflow model are satisfied.
* Provides an MLflow base image or curated environment that contains the following items:
    * Packages required for Azure Machine Learning to perform inference, including [`mlflow-skinny`](https://github.com/mlflow/mlflow/blob/master/README_SKINNY.rst).
    * A scoring script to perform inference.

[!INCLUDE [mlflow-model-package-for-workspace-without-egress](includes/mlflow-model-package-for-workspace-without-egress.md)]

### Python packages and dependencies

Azure Machine Learning automatically generates environments to run inference on MLflow models. To build the environments, Azure Machine Learning reads the conda dependencies that are specified in the MLflow model and adds any packages that are required to run the inferencing server. These extra packages vary, depending on your deployment type.

The following _conda.yaml_ file shows an example of conda dependencies specified in an MLflow model.

__conda.yaml__

:::code language="yaml" source="~/azureml-examples-main/sdk/python/endpoints/online/mlflow/sklearn-diabetes/model/conda.yaml":::

> [!WARNING]
> MLflow automatically detects packages when logging a model and pins the package versions in the model's conda dependencies. However, this automatic package detection might not always reflect your intentions or requirements. In such cases, consider [logging models with a custom conda dependencies definition](how-to-log-mlflow-models.md?#logging-models-with-a-custom-signature-environment-or-samples).

### Implications of using models with signatures

MLflow models can include a signature that indicates the expected inputs and their types. When such models are deployed to online or batch endpoints, Azure Machine Learning enforces that the number and types of the data inputs comply with the signature. If the input data can't be parsed as expected, the model invocation will fail.

You can inspect an MLflow model's signature by opening the MLmodel file associated with the model. For more information on how signatures work in MLflow, see [Signatures in MLflow](concept-mlflow-models.md#model-signature).

The following file shows the MLmodel file associated with an MLflow model.

__MLmodel__

:::code language="yaml" source="~/azureml-examples-main/sdk/python/endpoints/online/mlflow/sklearn-diabetes/model/MLmodel" highlight="19-20":::

> [!TIP]
> Signatures in MLflow models are optional but highly recommended, as they provide a convenient way to detect data compatibility issues early. For more information about how to log models with signatures, see [Logging models with a custom signature, environment or samples](how-to-log-mlflow-models.md#logging-models-with-a-custom-signature-environment-or-samples).


## Models deployed in Azure Machine Learning vs. models deployed in the MLflow built-in server

MLflow includes built-in deployment tools that model developers can use to test models locally. For instance, you can run a local instance of a model that is registered in the MLflow server registry, using `mlflow models serve -m my_model` or using the MLflow CLI `mlflow models predict`. 

### Inferencing with batch vs. online endpoints

Azure Machine Learning supports deploying models to both online and batch endpoints. These endpoints run different inferencing technologies that can have different features.

Online endpoints are similar to the [MLflow built-in server](https://www.mlflow.org/docs/latest/models.html#built-in-deployment-tools) in that they provide a scalable, synchronous, and lightweight way to run models for inference.

On the other hand, batch endpoints are capable of running asynchronous inference over long-running inferencing processes that can scale to large amounts of data. The MLflow server currently lacks this capability, although a similar capability can be achieved by [using Spark jobs](how-to-deploy-mlflow-model-spark-jobs.md). To learn more about batch endpoints and MLflow models, see [Use MLflow models in batch deployments](how-to-mlflow-batch.md).

The sections that follow focus more on MLflow models deployed to Azure Machine Learning online endpoints.

### Input formats

| Input type | MLflow built-in server | Azure Machine Learning Online Endpoints |
| :- | :-: | :-: |
| JSON-serialized pandas DataFrames in the split orientation | **&check;** | **&check;** |
| JSON-serialized pandas DataFrames in the records orientation | Deprecated |  |
| CSV-serialized pandas DataFrames | **&check;** | Use batch<sup>1</sup> |
| Tensor input format as JSON-serialized lists (tensors) and dictionary of lists (named tensors) | **&check;** | **&check;** |
| Tensor input formatted as in TF Serving's API | **&check;** |  |

<sup>1</sup> Consider using batch inferencing to process files. For more information, see [Deploy MLflow models to batch endpoints](how-to-mlflow-batch.md). 

### Input structure

Regardless of the input type used, Azure Machine Learning requires you to provide inputs in a JSON payload, within the dictionary key `input_data`. Because this key isn't required when using the command `mlflow models serve` to serve models, payloads can't be used interchangeably for Azure Machine Learning online endpoints and the MLflow built-in server.

> [!IMPORTANT]
> **MLflow 2.0 advisory**: Notice that the payload's structure has changed in MLflow 2.0.

This section shows different payload examples and the differences for a model that is deployed in the MLflow built-in server versus the Azure Machine Learning inferencing server.


#### Payload example for a JSON-serialized pandas DataFrame in the split orientation

# [Azure Machine Learning](#tab/azureml)

```json
{
    "input_data": {
        "columns": [
            "age", "sex", "trestbps", "chol", "fbs", "restecg", "thalach", "exang", "oldpeak", "slope", "ca", "thal"
        ],
        "index": [1],
        "data": [
            [1, 1, 145, 233, 1, 2, 150, 0, 2.3, 3, 0, 2]
        ]
    }
}
```

# [MLflow built-in server](#tab/builtin)

```json
{
    "dataframe_split": {
        "columns": [
            "age", "sex", "trestbps", "chol", "fbs", "restecg", "thalach", "exang", "oldpeak", "slope", "ca", "thal"
        ],
        "index": [1],
        "data": [
            [1, 1, 145, 233, 1, 2, 150, 0, 2.3, 3, 0, 2]
        ]
    }
}
```

This payload corresponds to MLflow server 2.0+.

---


#### Payload example for a tensor input

# [Azure Machine Learning](#tab/azureml)

```json
{
    "input_data": [
          [1, 1, 0, 233, 1, 2, 150, 0, 2.3, 3, 0, 2],
          [1, 1, 0, 233, 1, 2, 150, 0, 2.3, 3, 0, 2]
          [1, 1, 0, 233, 1, 2, 150, 0, 2.3, 3, 0, 2],
          [1, 1, 145, 233, 1, 2, 150, 0, 2.3, 3, 0, 2]
    ]
}
```

# [MLflow built-in server](#tab/builtin)

```json
{
    "inputs": [
          [1, 1, 0, 233, 1, 2, 150, 0, 2.3, 3, 0, 2],
          [1, 1, 0, 233, 1, 2, 150, 0, 2.3, 3, 0, 2]
          [1, 1, 0, 233, 1, 2, 150, 0, 2.3, 3, 0, 2],
          [1, 1, 145, 233, 1, 2, 150, 0, 2.3, 3, 0, 2]
    ]
}
```

---

#### Payload example for a named-tensor input

# [Azure Machine Learning](#tab/azureml)

```json
{
    "input_data": {
        "tokens": [
          [0, 655, 85, 5, 23, 84, 23, 52, 856, 5, 23, 1]
        ],
        "mask": [
          [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0]
        ]
    }
}
```

# [MLflow built-in server](#tab/builtin)

```json
{
    "inputs": {
        "tokens": [
          [0, 655, 85, 5, 23, 84, 23, 52, 856, 5, 23, 1]
        ],
        "mask": [
          [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0]
        ]
    }
}
```

---

For more information about MLflow built-in deployment tools, see [Built-in deployment tools](https://www.mlflow.org/docs/latest/models.html#built-in-deployment-tools) in the MLflow documentation.

## Customize inference when deploying MLflow models

You might be used to authoring scoring scripts to customize how inferencing is executed for your custom models. However, when deploying MLflow models to Azure Machine Learning, the decision about how inferencing should be executed is done by the model builder (the person who built the model), rather than by the DevOps engineer (the person who is trying to deploy it). Each model framework might automatically apply specific inference routines.

At any point, if you need to change how inference of an MLflow model is executed, you can do one of two things:

- Change how your model is being logged in the training routine.
- Customize inference with a scoring script at deployment time.


#### Change how your model is logged during training

When you log a model, using either `mlflow.autolog` or `mlflow.<flavor>.log_model`, the flavor used for the model decides how inference should be executed and what results the model returns. MLflow doesn't enforce any specific behavior for how the `predict()` function generates results. 

In some cases, however, you might want to do some preprocessing or post-processing before and after your model is executed. At other times, you might want to change what is returned (for example, probabilities versus classes). One solution is to implement machine learning pipelines that move from inputs to outputs directly. For example, [`sklearn.pipeline.Pipeline`](https://scikit-learn.org/stable/modules/generated/sklearn.pipeline.Pipeline.html) or [`pyspark.ml.Pipeline`](https://spark.apache.org/docs/latest/api/python/reference/api/pyspark.ml.Pipeline.html) are popular ways to implement pipelines, and are sometimes recommended for performance considerations. Another alternative is to [customize how your model does inferencing, by using a custom model flavor](how-to-log-mlflow-models.md?#logging-custom-models).

#### Customize inference with a scoring script

Although MLflow models don't require a scoring script, you can still provide one, if needed. You can use the scoring script to customize how inference is executed for MLflow models. For more information on how to customize inference, see [Customizing MLflow model deployments (online endpoints)](how-to-deploy-mlflow-models-online-endpoints.md#customizing-mlflow-model-deployments) and [Customizing MLflow model deployments (batch endpoints)](how-to-mlflow-batch.md#customizing-mlflow-models-deployments-with-a-scoring-script).

> [!IMPORTANT]
> If you choose to specify a scoring script for an MLflow model deployment, you also need to provide an environment for the deployment.

## Deployment tools

Azure Machine Learning offers many ways to deploy MLflow models to online and batch endpoints. You can deploy models, using the following tools:

> [!div class="checklist"]
> - MLflow SDK
> - Azure Machine Learning CLI
> - Azure Machine Learning SDK for Python
> - Azure Machine Learning studio

Each workflow has different capabilities, particularly around which type of compute they can target. The following table shows the different capabilities.

| Scenario | MLflow SDK | Azure Machine Learning CLI/SDK | Azure Machine Learning studio |
| :- | :-: | :-: | :-: |
| Deploy to managed online endpoints | [See example](how-to-deploy-mlflow-models-online-progressive.md)<sup>1</sup> | [See example](how-to-deploy-mlflow-models-online-endpoints.md)<sup>1</sup> | [See example](how-to-deploy-mlflow-models-online-endpoints.md?tabs=studio)<sup>1</sup> |
| Deploy to managed online endpoints (with a scoring script) | Not supported<sup>3</sup> | [See example](how-to-deploy-mlflow-models-online-endpoints.md#customizing-mlflow-model-deployments) | [See example](how-to-deploy-mlflow-models-online-endpoints.md?tab=studio#customizing-mlflow-model-deployments) |
| Deploy to batch endpoints | Not supported<sup>3</sup> | [See example](how-to-mlflow-batch.md) | [See example](how-to-mlflow-batch.md?tab=studio) |
| Deploy to batch endpoints (with a scoring script) | Not supported<sup>3</sup> | [See example](how-to-mlflow-batch.md#customizing-mlflow-models-deployments-with-a-scoring-script) | [See example](how-to-mlflow-batch.md?tab=studio#customizing-mlflow-models-deployments-with-a-scoring-script)  |
| Deploy to web services (ACI/AKS) | Legacy support<sup>2</sup> | Not supported<sup>2</sup> | Not supported<sup>2</sup> |
| Deploy to web services (ACI/AKS - with a scoring script) | Not supported<sup>3</sup> | Legacy support<sup>2</sup> | Legacy support<sup>2</sup> |

<sup>1</sup> Deployment to online endpoints that are in workspaces with private link enabled requires you to [package models before deployment (preview)](how-to-package-models.md).

<sup>2</sup> We recommend switching to [managed online endpoints](concept-endpoints.md) instead.

<sup>3</sup> MLflow (OSS) doesn't have the concept of a scoring script and doesn't support batch execution currently.

### Which deployment tool to use?

- Use the MLflow SDK if _both_ of these conditions apply:

    - You're familiar with MLflow, or you're using a platform that supports MLflow natively (like Azure Databricks).
    - You wish to continue using the same set of methods from MLflow.

- Use the [Azure Machine Learning CLI v2](concept-v2.md) if _any_ of these conditions apply:

    - You're more familiar with the [Azure Machine Learning CLI v2](concept-v2.md).
    - You want to automate deployments, using automation pipelines.
    - You want to keep deployment configuration in a git repository.

- Use the [Azure Machine Learning studio](https://ml.azure.com) UI deployment if you want to quickly deploy and test models trained with MLflow.


## Related content

- [Deploy MLflow models to online endpoints](how-to-deploy-mlflow-models-online-endpoints.md)
- [Progressive rollout of MLflow models](how-to-deploy-mlflow-models-online-progressive.md)
- [Deploy MLflow models to Batch Endpoints](how-to-mlflow-batch.md)
