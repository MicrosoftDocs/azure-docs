---
title: Logging MLflow models
titleSuffix: Azure Machine Learning
description: Logging MLflow models, instead of artifacts, with MLflow SDK in Azure Machine Learning
services: machine-learning
author: santiagxf
ms.author: fasantia
ms.reviewer: mopeakande
ms.service: machine-learning
ms.subservice: mlops
ms.date: 02/16/2024
ms.topic: conceptual
ms.custom: cliv2, sdkv2
---

# Logging MLflow models

This article describes how to log your trained models (or artifacts) as MLflow models. It explores the different ways to customize how MLflow packages your models, and how it runs those models.

## Why logging models instead of artifacts?

[From artifacts to models in MLflow](concept-mlflow-models.md) describes the difference between logging artifacts or files, as compared to logging MLflow models.

An MLflow model is also an artifact. However, that model has a specific structure that serves as a contract between the person that created the model and the person that intends to use it. This contract helps build a bridge between the artifacts themselves and their meanings.

Model logging has these advantages:
> [!div class="checklist"]
> * You can directly load models, for inference, with `mlflow.<flavor>.load_model`, and you can use the `predict` function
> * Pipeline inputs can use models directly
> * You can deploy models without indication of a scoring script or an environment
> * Swagger is automatically enabled in deployed endpoints, and the Azure Machine Learning studio can use the __Test__ feature
> * You can use the Responsible AI dashboard

This section describes how to use the model's concept in Azure Machine Learning with MLflow:

## Logging models using autolog

You can use MLflow autolog functionality. Autolog allows MLflow to instruct the framework in use to log all the metrics, parameters, artifacts, and models that the framework considers relevant. By default, if autolog is enabled, most models are logged. In some situations, some flavors might not log a model. For instance, the PySpark flavor doesn't log models that exceed a certain size.

Use either `mlflow.autolog()` or `mlflow.<flavor>.autolog()` to activate autologging. This example uses `autolog()` to log a classifier model trained with XGBoost:

```python
import mlflow
from xgboost import XGBClassifier
from sklearn.metrics import accuracy_score

mlflow.autolog()

model = XGBClassifier(use_label_encoder=False, eval_metric="logloss")
model.fit(X_train, y_train, eval_set=[(X_test, y_test)], verbose=False)

y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
```

> [!TIP]
> If use Machine Learning pipelines, for example [Scikit-Learn pipelines](https://scikit-learn.org/stable/modules/generated/sklearn.pipeline.Pipeline.html), use the `autolog` functionality of that pipeline flavor to log models. Model logging automatically happens when the `fit()` method is called on the pipeline object. The [Training and tracking an XGBoost classifier with MLflow notebook](https://github.com/Azure/azureml-examples/blob/main/sdk/python/using-mlflow/train-and-log/xgboost_classification_mlflow.ipynb) demonstrates how to log a model with preprocessing, using pipelines.

## Logging models with a custom signature, environment or samples

The MLflow `mlflow.<flavor>.log_model` method can manually log models. This workflow can control different aspects of the model logging.

Use this method when:
> [!div class="checklist"]
> * You want to indicate pip packages or a conda environment that differ from those that are automatically detected
> * You want to include input examples
> * You want to include specific artifacts in the needed package
> * `autolog` does not correctly infer your signature. This matters when you deal with tensor inputs, where the signature needs specific shapes
> * The autolog behavior does not cover your purpose for some reason

This code example logs a model for an XGBoost classifier:

```python
import mlflow
from xgboost import XGBClassifier
from sklearn.metrics import accuracy_score
from mlflow.models import infer_signature
from mlflow.utils.environment import _mlflow_conda_env

mlflow.autolog(log_models=False)

model = XGBClassifier(use_label_encoder=False, eval_metric="logloss")
model.fit(X_train, y_train, eval_set=[(X_test, y_test)], verbose=False)
y_pred = model.predict(X_test)

accuracy = accuracy_score(y_test, y_pred)

# Signature
signature = infer_signature(X_test, y_test)

# Conda environment
custom_env =_mlflow_conda_env(
    additional_conda_deps=None,
    additional_pip_deps=["xgboost==1.5.2"],
    additional_conda_channels=None,
)

# Sample
input_example = X_train.sample(n=1)

# Log the model manually
mlflow.xgboost.log_model(model, 
                         artifact_path="classifier", 
                         conda_env=custom_env,
                         signature=signature,
                         input_example=input_example)
```

> [!NOTE]
> * `autolog` has the `log_models=False` configuration. This prevents automatic MLflow model logging. Automatic MLflow model logging happens later, as a manual process
> * Use the `infer_signature` method to try to infer the signature directly from inputs and outputs
> * The `mlflow.utils.environment._mlflow_conda_env` method is a private method in the MLflow SDK. In this example, it makes the code simpler, but use it with caution. It may change in the future. As an alternative, you can generate the YAML definition manually as a Python dictionary.

## Logging models with a different behavior in the predict method

When logging a model with either `mlflow.autolog` or `mlflow.<flavor>.log_model`, the model flavor determines how to execute the inference, and what the model returns. MLflow doesn't enforce any specific behavior about the generation of `predict` results. In some scenarios, you might want to do some preprocessing or post-processing before and after your model executes.

In this situation, implement machine learning pipelines that directly move from inputs to outputs. Although this implementation is possible, and sometimes encouraged to improve performance, it might become challenging to achieve. In those cases, it can help to [customize how your model handles inference](#logging-custom-models) as explained in next section.

## Logging custom models

MLflow supports many [machine learning frameworks](https://mlflow.org/docs/latest/models.html#built-in-model-flavors), including

- CatBoost
- FastAI
- h2o
- Keras
- LightGBM
- MLeap
- MXNet Gluon
- ONNX
- Prophet
- PyTorch
- Scikit-Learn
- spaCy
- Spark MLLib
- statsmodels
- TensorFlow
- XGBoost

However, you might need to change the way a flavor works, log a model not natively supported by MLflow or even log a model that uses multiple elements from different frameworks. In these cases, you might need to create a custom model flavor.

To solve the problem, MLflow introduces the `pyfunc` flavor (starting from a Python function). This flavor can log any object as a model, as long as that object satisfies two conditions:

* You implement the method `predict` method, at least
* The Python object inherits from `mlflow.pyfunc.PythonModel`

> [!TIP]
> Serializable models that implement the Scikit-learn API can use the Scikit-learn flavor to log the model, regardless of whether the model was built with Scikit-learn. If you can persist your model in Pickle format, and the object has the `predict()` and `predict_proba()` methods (at least), you can use `mlflow.sklearn.log_model()` to log the model inside a MLflow run.

# [Using a model wrapper](#tab/wrapper)

If you create a wrapper around your existing model object, it becomes the simplest to create a flavor for your custom model. MLflow serializes and packages it for you. Python objects are serializable when the object can be stored in the file system as a file, generally in Pickle format. At runtime, the object can materialize from that file. This restores all the values, properties, and methods available when it was saved.

Use this method when:
> [!div class="checklist"]
> * You can serialize your model in Pickle format
> * You want to retain the state of the model, as it was just after training
> * You want to customize how the `predict` function works.

This code sample wraps a model created with XGBoost, to make it behave in a different from the XGBoost flavor default implementation. Instead, it returns the probabilities instead of the classes:

```python
from mlflow.pyfunc import PythonModel, PythonModelContext

class ModelWrapper(PythonModel):
    def __init__(self, model):
        self._model = model

    def predict(self, context: PythonModelContext, data):
        # You don't have to keep the semantic meaning of `predict`. You can use here model.recommend(), model.forecast(), etc
        return self._model.predict_proba(data)

    # You can even add extra functions if you need to. Since the model is serialized,
    # all of them will be available when you load your model back.
    def predict_batch(self, data):
        pass
```

Log a custom model in the run:

```python
import mlflow
from xgboost import XGBClassifier
from sklearn.metrics import accuracy_score
from mlflow.models import infer_signature

mlflow.xgboost.autolog(log_models=False)

model = XGBClassifier(use_label_encoder=False, eval_metric="logloss")
model.fit(X_train, y_train, eval_set=[(X_test, y_test)], verbose=False)
y_probs = model.predict_proba(X_test)

accuracy = accuracy_score(y_test, y_probs.argmax(axis=1))
mlflow.log_metric("accuracy", accuracy)

signature = infer_signature(X_test, y_probs)
mlflow.pyfunc.log_model("classifier", 
                        python_model=ModelWrapper(model),
                        signature=signature)
```

> [!TIP]
> Here, the `infer_signature` method uses `y_probs` to infer the signature. Our target column has the target class, but our model now returns the two probabilities for each class.

# [Using artifacts](#tab/artifacts)

Your model might be composed of multiple pieces that need to be loaded. You might not have a way to serialize it as a Pickle file. In those cases, the `PythonModel` supports indication of an arbitrary list of **artifacts**. Each artifact is packaged along with your model.

Use this technique when:
> [!div class="checklist"]
> * You can't serialize your model in Pickle format, or you have a better serialization format available
> * Your model has one, or many, artifacts must be referenced to load the model
> * You might want to persist some inference configuration properties - for example, the number of items to recommend
> * You want to customize the way the model loads, and how the `predict` function works

This code sample shows how to log a custom model, using artifacts:

```python
encoder_path = 'encoder.pkl'
joblib.dump(encoder, encoder_path)

model_path = 'xgb.model'
model.save_model(model_path)

mlflow.pyfunc.log_model("classifier", 
                        python_model=ModelWrapper(),
                        artifacts={ 
                            'encoder': encoder_path,
                            'model': model_path 
                        },
                        signature=signature)
```

> [!NOTE]
> * The model is not saved as a pickle. Instead, the code saved the model with save method of the framework that you used
> * The model wrapper is `ModelWrapper()`, but the model is not passed as a parameter to the constructor
> A new dictionary parameter - `artifacts` - has keys as the artifact names, and values as the path in the local file system where the artifact is stored

The corresponding model wrapper then would look like this:

```python
from mlflow.pyfunc import PythonModel, PythonModelContext

class ModelWrapper(PythonModel):
    def load_context(self, context: PythonModelContext):
        import pickle
        from xgboost import XGBClassifier
        from sklearn.preprocessing import OrdinalEncoder
        
        self._encoder = pickle.loads(context.artifacts["encoder"])
        self._model = XGBClassifier(use_label_encoder=False, eval_metric="logloss")
        self._model.load_model(context.artifacts["model"])

    def predict(self, context: PythonModelContext, data):
        return self._model.predict_proba(data)
```

The complete training routine would look like this:

```python
import mlflow
from xgboost import XGBClassifier
from sklearn.preprocessing import OrdinalEncoder
from sklearn.metrics import accuracy_score
from mlflow.models import infer_signature

mlflow.xgboost.autolog(log_models=False)

encoder = OrdinalEncoder(handle_unknown='use_encoded_value', unknown_value=np.nan)
X_train['thal'] = encoder.fit_transform(X_train['thal'].to_frame())
X_test['thal'] = encoder.transform(X_test['thal'].to_frame())

model = XGBClassifier(use_label_encoder=False, eval_metric="logloss")
model.fit(X_train, y_train, eval_set=[(X_test, y_test)], verbose=False)
y_probs = model.predict_proba(X_test)

accuracy = accuracy_score(y_test, y_probs.argmax(axis=1))
mlflow.log_metric("accuracy", accuracy)

encoder_path = 'encoder.pkl'
joblib.dump(encoder, encoder_path)
model_path = "xgb.model"
model.save_model(model_path)

signature = infer_signature(X, y_probs)
mlflow.pyfunc.log_model("classifier", 
                        python_model=ModelWrapper(),
                        artifacts={ 
                            'encoder': encoder_path,
                            'model': model_path 
                        },
                        signature=signature)
```

# [Using a model loader](#tab/loader)

A model might have complex logic, or it might load several source files at inference time. This happens if you have a Python library for your model, for example. In this scenario, you should package the library along with your model, so it can move as a single piece.

Use this technique when:
> [!div class="checklist"]
> * You can't serialize your model in Pickle format, or you have a better serialization format available
> * You can store your model artifacts in a folder which stores all the required artifacts
> * Your model source code has great complexity, and it requires multiple Python files. Potentially, a library supports your model
> * You want to customize the way the model loads, and how the `predict` function operates

MLflow supports these models. With MLflow, you can specify any arbitrary source code to package along with the model, as long as it has a *loader module*. You can specify loader modules in the `log_model()` instruction with the `loader_module` argument, which indicates the Python namespace that implements the loader. The `code_path` argument is also required, to indicate the source files that define the `loader_module`. In this namespace, you must implement a `_load_pyfunc(data_path: str)` function that receives the path of the artifacts, and returns an object with a method predict (at least).

```python
model_path = 'xgb.model'
model.save_model(model_path)

mlflow.pyfunc.log_model("classifier", 
                        data_path=model_path,
                        code_path=['src'],
                        loader_module='loader_module'
                        signature=signature)
```

> [!NOTE]
> * The model is not saved as a pickle. Instead, the code saved the model with save method of the framework that you used
> * A new parameter - `data_path` - points to the folder that holds the model artifacts. The artifacts can be a folder or a file. Those artifacts - either a folder or a file - will be packaged with the model
> * A new parameter - `code_path` - points to the source code location. This resource at this location can be a path or a single file. That resource - either a folder or a file - will be packaged with the model
> * The function `_load_pyfunc` function is stored in the `loader_module` Python module

The `src` folder contains the `loader_module.py` file. That file is the loader module:

__src/loader_module.py__

```python
class MyModel():
    def __init__(self, model):
        self._model = model

    def predict(self, data):
        return self._model.predict_proba(data)

def _load_pyfunc(data_path: str):
    import os

    model = XGBClassifier(use_label_encoder=False, eval_metric='logloss')
    model.load_model(os.path.abspath(data_path))

    return MyModel(model)
```

> [!NOTE]
> * The `MyModel` class doesn't inherit from `PythonModel` as shown earlier. However, it has a `predict` function
> * The model source code is in a file. Any source code will work. A **src** folder is ideal for this
> * A `_load_pyfunc` function returns an instance of the class of the model

The complete training code looks like this:

```python
import mlflow
from xgboost import XGBClassifier
from sklearn.metrics import accuracy_score
from mlflow.models import infer_signature

mlflow.xgboost.autolog(log_models=False)

model = XGBClassifier(use_label_encoder=False, eval_metric="logloss")
model.fit(X_train, y_train, eval_set=[(X_test, y_test)], verbose=False)
y_probs = model.predict_proba(X_test)

accuracy = accuracy_score(y_test, y_probs.argmax(axis=1))
mlflow.log_metric("accuracy", accuracy)

model_path = "xgb.model"
model.save_model(model_path)

signature = infer_signature(X_test, y_probs)
mlflow.pyfunc.log_model("classifier",
                        data_path=model_path,
                        code_path=["loader_module.py"],
                        loader_module="loader_module",
                        signature=signature)
```

---

## Next steps

* [Deploy MLflow models](how-to-deploy-mlflow-models.md)