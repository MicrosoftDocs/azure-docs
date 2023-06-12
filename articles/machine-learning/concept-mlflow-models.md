---
title: From artifacts to models in MLflow
titleSuffix: Azure Machine Learning
description: Learn about how MLflow uses the concept of models instead of artifacts to represent your trained models and enable a streamlined path to deployment.
services: machine-learning
author: santiagxf
ms.author: fasantia
ms.reviewer: mopeakande
ms.service: machine-learning
ms.subservice: mlops
ms.date: 11/04/2022
ms.topic: conceptual
ms.custom: cliv2, sdkv2
---

# From artifacts to models in MLflow

The following article explains the differences between an artifact and a model in MLflow and how to transition from one to the other. It also explains how Azure Machine Learning uses the MLflow model's concept to enabled streamlined deployment workflows.

## What's the difference between an artifact and a model?

If you are not familiar with MLflow, you may not be aware of the difference between logging artifacts or files vs. logging MLflow models. There are some fundamental differences between the two:

### Artifacts

Any file generated (and captured) from an experiment's run or job is an artifact. It may represent a model serialized as a Pickle file, the weights of a PyTorch or TensorFlow model, or even a text file containing the coefficients of a linear regression. Other artifacts can have nothing to do with the model itself, but they can contain configuration to run the model, pre-processing information, sample data, etc. As you can see, an artifact can come in any format. 

You may have been logging artifacts already:

```python
filename = 'model.pkl'
with open(filename, 'wb') as f:
  pickle.dump(model, f)

mlflow.log_artifact(filename)
```

### Models

A model in MLflow is also an artifact. However, we make stronger assumptions about this type of artifacts. Such assumptions provide a clear contract between the saved files and what they mean. When you log your models as artifacts (simple files), you need to know what the model builder meant for each of them in order to know how to load the model for inference. On the contrary, MLflow models can be loaded using the contract specified in the [The MLModel format](concept-mlflow-models.md#the-mlmodel-format).

In Azure Machine Learning, logging models has the following advantages:
> [!div class="checklist"]
> * You can deploy them on real-time or batch endpoints without providing an scoring script nor an environment.
> * When deployed, Model's deployments have a Swagger generated automatically and the __Test__ feature can be used in Azure Machine Learning studio.
> * Models can be used as pipelines inputs directly.
> * You can use the [Responsible AI dashbord (preview)](how-to-responsible-ai-dashboard.md).

Models can get logged by using MLflow SDK:

```python
import mlflow
mlflow.sklearn.log_model(sklearn_estimator, "classifier")
```


## The MLmodel format

MLflow adopts the MLmodel format as a way to create a contract between the artifacts and what they represent. The MLmodel format stores assets in a folder. Among them, there is a particular file named MLmodel. This file is the single source of truth about how a model can be loaded and used.

![a sample MLflow model in MLmodel format](media/concept-mlflow-models/mlflow-mlmodel.png)

The following example shows how the `MLmodel` file for a computer version model trained with `fastai` may look like:

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

### The model's flavors

Considering the variety of machine learning frameworks available to use, MLflow introduced the concept of flavor as a way to provide a unique contract to work across all of them. A flavor indicates what to expect for a given model created with a specific framework. For instance, TensorFlow has its own flavor, which specifies how a TensorFlow model should be persisted and loaded. Because each model flavor indicates how they want to persist and load models, the MLModel format doesn't enforce a single serialization mechanism that all the models need to support. Such decision allows each flavor to use the methods that provide the best performance or best support according to their best practices - without compromising compatibility with the MLModel standard.

The following is an example of the `flavors` section for an `fastai` model.

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

### Signatures

[Model signatures in MLflow](https://www.mlflow.org/docs/latest/models.html#model-signature) are an important part of the model specification, as they serve as a data contract between the model and the server running our models. They are also important for parsing and enforcing model's input's types at deployment time. [MLflow enforces types when data is submitted to your model if a signature is available](https://www.mlflow.org/docs/latest/models.html#signature-enforcement).

Signatures are indicated when the model gets logged and persisted in the `MLmodel` file, in the `signature` section. **Autolog's** feature in MLflow automatically infers signatures in a best effort way. However, it may be required to [log the models manually if the signatures inferred are not the ones you need](https://www.mlflow.org/docs/latest/models.html#how-to-log-models-with-signatures). 

There are two types of signatures:

* **Column-based signature** corresponding to signatures that operate to tabular data. For models with this signature, MLflow supplies `pandas.DataFrame` objects as inputs.
* **Tensor-based signature:** corresponding to signatures that operate with n-dimensional arrays or tensors. For models with this signature, MLflow supplies `numpy.ndarray` as inputs (or a dictionary of `numpy.ndarray` in the case of named-tensors).

The following example corresponds to a computer vision model trained with `fastai`. This model receives a batch of images represented as tensors of shape `(300, 300, 3)` with the RGB representation of them (unsigned integers). It outputs batches of predictions (probabilities) for two classes. 

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
> Azure Machine Learning generates Swagger for model's deployment in MLflow format with a signature available. This makes easier to test deployed endpoints using the Azure Machine Learning studio.

### Model's environment

Requirements for the model to run are specified in the `conda.yaml` file. Dependencies can be automatically detected by MLflow or they can be manually indicated when you call `mlflow.<flavor>.log_model()` method. The latter can be needed in cases that the libraries included in your environment are not the ones you intended to use.

The following is an example of an environment used for a model created with `fastai` framework:

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
> MLflow environments and Azure Machine Learning environments are different concepts. While the former opperates at the level of the model, the latter operates at the level of the workspace (for registered environments) or jobs/deployments (for annonymous environments). When you deploy MLflow models in Azure Machine Learning, the model's environment is built and used for deployment. Alternatively, you can override this behaviour with the [Azure Machine Learning CLI v2](concept-v2.md) and deploy MLflow models using a specific Azure Machine Learning environments.

### Model's predict function

All MLflow models contain a `predict` function. **This function is the one that is called when a model is deployed using a no-code-deployment experience**. What the `predict` function returns (classes, probabilities, a forecast, etc.) depend on the framework (i.e. flavor) used for training. Read the documentation of each flavor to know what they return.

In same cases, you may need to customize this function to change the way inference is executed. On those cases, you will need to [log models with a different behavior in the predict method](how-to-log-mlflow-models.md#logging-models-with-a-different-behavior-in-the-predict-method) or [log a custom model's flavor](how-to-log-mlflow-models.md#logging-custom-models).

## Loading MLflow models back

Models created as MLflow models can be loaded back directly from the run where they were logged, from the file system where they are saved or from the model registry where they are registered. MLflow provides a consistent way to load those models regardless of the location.

There are two workflows available for loading models:

* **Loading back the same object and types that were logged:** You can load models using MLflow SDK and obtain an instance of the model with types belonging to the training library. For instance, an ONNX model will return a `ModelProto` while a decision tree trained with Scikit-Learn model will return a `DecisionTreeClassifier` object. Use `mlflow.<flavor>.load_model()` to do so.
* **Loading back a model for running inference:** You can load models using MLflow SDK and obtain a wrapper where MLflow warranties there will be a `predict` function. It doesn't matter which flavor you are using, every MLflow model needs to implement this contract. Furthermore, MLflow warranties that this function can be called using arguments of type `pandas.DataFrame`, `numpy.ndarray` or `dict[string, numpyndarray]` (depending on the signature of the model). MLflow handles the type conversion to the input type the model actually expects. Use `mlflow.pyfunc.load_model()` to do so.

## Start logging models

We recommend starting taking advantage of MLflow models in Azure Machine Learning. There are different ways to start using the model's concept with MLflow. Read [How to log MLFlow models](how-to-log-mlflow-models.md) to a comprehensive guide.
