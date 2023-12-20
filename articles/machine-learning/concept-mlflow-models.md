---
title: From artifacts to models in MLflow
titleSuffix: Azure Machine Learning
description: Learn how MLflow uses the concept of models instead of artifacts to represent your trained models and enable a streamlined path to deployment.
services: machine-learning
author: santiagxf
ms.author: fasantia
ms.reviewer: mopeakande
reviewer: msakande
ms.service: machine-learning
ms.subservice: mlops
ms.date: 12/20/2023
ms.topic: conceptual
ms.custom: cliv2, sdkv2
---

# From artifacts to models in MLflow

The following article explains the differences between an MLflow artifact and an MLflow model, and how to transition from one to the other. It also explains how Azure Machine Learning uses the concept of an MLflow model to enable streamlined deployment workflows.

## What's the difference between an artifact and a model?

If you're not familiar with MLflow, you might not be aware of the difference between logging artifacts or files vs. logging MLflow models. There are some fundamental differences between the two:

### Artifact

An _artifact_ is any file that's generated (and captured) from an experiment's run or job. An artifact could represent a model serialized as a pickle file, the weights of a PyTorch or TensorFlow model, or even a text file containing the coefficients of a linear regression. Some artifacts could also have nothing to do with the model itself; rather, they could contain configurations to run the model, or preprocessing information, or sample data, and so on. Artifacts can come in various formats.

You might have been logging artifacts already:

```python
filename = 'model.pkl'
with open(filename, 'wb') as f:
  pickle.dump(model, f)

mlflow.log_artifact(filename)
```

### Model

A _model_ in MLflow is also an artifact. However, we make stronger assumptions about this type of artifact. Such assumptions provide a clear contract between the saved files and what they mean. When you log your models as artifacts (simple files), you need to know what the model builder meant for each of those files so as to know how to load the model for inference. On the contrary, MLflow models can be loaded using the contract specified in the [The MLmodel format](concept-mlflow-models.md#the-mlmodel-format).

In Azure Machine Learning, logging models has the following advantages:

* You can deploy them to real-time or batch endpoints without providing a scoring script or an environment.
* When you deploy models, the deployments automatically have a swagger generated, and the __Test__ feature can be used in Azure Machine Learning studio.
* You can use the models directly as pipeline inputs.
* You can use the [Responsible AI dashboard](how-to-responsible-ai-dashboard.md) with your models.

You can log models by using the MLflow SDK:

```python
import mlflow
mlflow.sklearn.log_model(sklearn_estimator, "classifier")
```


## The MLmodel format

MLflow adopts the MLmodel format as a way to create a contract between the artifacts and what they represent. The MLmodel format stores assets in a folder. Among these assets, there's a file named `MLmodel`; this file is the single source of truth about how a model can be loaded and used.

:::image type="content" source="media/concept-mlflow-models/mlflow-mlmodel.png" alt-text="A sample MLflow model in MLmodel format." lightbox="media/concept-mlflow-models/mlflow-mlmodel.png":::

The following code is an example of what the `MLmodel` file for a computer vision model trained with `fastai` might look like:

__MLmodel__

```yaml
artifact_path: classifier
flavors:
  fastai:
    data: model.fastai
    fastai_version: 2.4.1
  python_function:
    data: model.fastai
    env: conda.yaml
    loader_module: mlflow.fastai
    python_version: 3.8.12
model_uuid: e694c68eba484299976b06ab9058f636
run_id: e13da8ac-b1e6-45d4-a9b2-6a0a5cfac537
signature:
  inputs: '[{"type": "tensor",
             "tensor-spec": 
                 {"dtype": "uint8", "shape": [-1, 300, 300, 3]}
           }]'
  outputs: '[{"type": "tensor", 
              "tensor-spec": 
                 {"dtype": "float32", "shape": [-1,2]}
            }]'
```

### Model flavors

Considering the large number of machine learning frameworks available to use, MLflow introduced the concept of _flavor_ as a way to provide a unique contract to work across all machine learning frameworks. A flavor indicates what to expect for a given model that's created with a specific framework. For instance, TensorFlow has its own flavor, which specifies how a TensorFlow model should be persisted and loaded. Because each model flavor indicates how to persist and load the model for a given framework, the MLmodel format doesn't enforce a single serialization mechanism that all models must support. This decision allows each flavor to use the methods that provide the best performance or best support according to their best practices—without compromising compatibility with the MLmodel standard.

The following code is an example of the `flavors` section for an `fastai` model.

```yaml
flavors:
  fastai:
    data: model.fastai
    fastai_version: 2.4.1
  python_function:
    data: model.fastai
    env: conda.yaml
    loader_module: mlflow.fastai
    python_version: 3.8.12
```

### Model signature

A [model signature in MLflow](https://www.mlflow.org/docs/latest/models.html#model-signature) is an important part of the model's specification, as it serves as a data contract between the model and the server running the model. A model signature is also important for parsing and enforcing a model's input types at deployment time. If a signature is available, MLflow enforces input types when data is submitted to your model. For more information, see [MLflow signature enforcement](https://www.mlflow.org/docs/latest/models.html#signature-enforcement).

Signatures are indicated when models get logged, and they're persisted in the `signature` section of the `MLmodel` file. The **Autolog** feature in MLflow automatically infers signatures in a best effort way. However, you might have to log the models manually if the inferred signatures aren't the ones you need. For more information, see [How to log models with signatures](https://www.mlflow.org/docs/latest/models.html#how-to-log-models-with-signatures). 

There are two types of signatures:

* **Column-based signature**: This signature operates on tabular data. For models with this type of signature, MLflow supplies `pandas.DataFrame` objects as inputs.
* **Tensor-based signature**: This signature operates with n-dimensional arrays or tensors. For models with this signature, MLflow supplies `numpy.ndarray` as inputs (or a dictionary of `numpy.ndarray` in the case of named-tensors).

The following example corresponds to a computer vision model trained with `fastai`. This model receives a batch of images represented as tensors of shape `(300, 300, 3)` with the RGB representation of them (unsigned integers). The model outputs batches of predictions (probabilities) for two classes.

__MLmodel__

```yaml
signature:
  inputs: '[{"type": "tensor",
             "tensor-spec": 
                 {"dtype": "uint8", "shape": [-1, 300, 300, 3]}
           }]'
  outputs: '[{"type": "tensor", 
              "tensor-spec": 
                 {"dtype": "float32", "shape": [-1,2]}
            }]'
```

> [!TIP]
> Azure Machine Learning generates a swagger file for a deployment of an MLflow model with a signature available. This makes it easier to test deployments using the Azure Machine Learning studio.

### Model environment

Requirements for the model to run are specified in the `conda.yaml` file. MLflow can automatically detect dependencies or you can manually indicate them by calling the `mlflow.<flavor>.log_model()` method. The latter can be useful if the libraries included in your environment aren't the ones you intended to use.

The following code is an example of an environment used for a model created with the `fastai` framework:

__conda.yaml__

```yaml
channels:
- conda-forge
dependencies:
- python=3.8.5
- pip
- pip:
  - mlflow
  - astunparse==1.6.3
  - cffi==1.15.0
  - configparser==3.7.4
  - defusedxml==0.7.1
  - fastai==2.4.1
  - google-api-core==2.7.1
  - ipython==8.2.0
  - psutil==5.9.0
name: mlflow-env
```

> [!NOTE]
> __What's the difference between an MLflow environment and an Azure Machine Learning environment?__
>
> While an _MLflow environment_ operates at the level of the model, an _Azure Machine Learning environment_ operates at the level of the workspace (for registered environments) or jobs/deployments (for anonymous environments). When you deploy MLflow models in Azure Machine Learning, the model's environment is built and used for deployment. Alternatively, you can override this behavior with the [Azure Machine Learning CLI v2](concept-v2.md) and deploy MLflow models using a specific Azure Machine Learning environment.

### Predict function

All MLflow models contain a `predict` function. **This function is called when a model is deployed using a no-code-deployment experience**. What the `predict` function returns (for example, classes, probabilities, or a forecast) depend on the framework (that is, the flavor) used for training. Read the documentation of each flavor to know what they return.

In same cases, you might need to customize this `predict` function to change the way inference is executed. In such cases, you need to [log models with a different behavior in the predict method](how-to-log-mlflow-models.md#logging-models-with-a-different-behavior-in-the-predict-method) or [log a custom model's flavor](how-to-log-mlflow-models.md#logging-custom-models).

## Workflows for loading MLflow models

You can load models that were created as MLflow models from several locations, including:

- directly from the run where the models were logged
- from the file system where they models are saved
- from the model registry where the models are registered. 

MLflow provides a consistent way to load these models regardless of the location.

There are two workflows available for loading models:

* **Load back the same object and types that were logged:** You can load models using the MLflow SDK and obtain an instance of the model with types belonging to the training library. For example, an ONNX model returns a `ModelProto` while a decision tree model trained with scikit-learn returns a `DecisionTreeClassifier` object. Use `mlflow.<flavor>.load_model()` to load back the same model object and types that were logged.

* **Load back a model for running inference:** You can load models using the MLflow SDK and obtain a wrapper where MLflow guarantees that there will be a `predict` function. It doesn't matter which flavor you're using, every MLflow model has a `predict` function. Furthermore, MLflow guarantees that this function can be called by using arguments of type `pandas.DataFrame`, `numpy.ndarray`, or `dict[string, numpyndarray]` (depending on the signature of the model). MLflow handles the type conversion to the input type that the model expects. Use `mlflow.pyfunc.load_model()` to load back a model for running inference.

## Related content

* [Configure MLflow for Azure Machine Learning](how-to-use-mlflow-configure-tracking.md)
* [How to log MLFlow models](how-to-log-mlflow-models.md) 
* [Guidelines for deploying MLflow models](how-to-deploy-mlflow-models.md)
