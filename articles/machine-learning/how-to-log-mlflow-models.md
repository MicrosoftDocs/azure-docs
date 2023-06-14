---
title: Logging MLflow models
titleSuffix: Azure Machine Learning
description: Learn how to start logging MLflow models instead of artifacts using MLflow SDK in Azure Machine Learning.
services: machine-learning
author: santiagxf
ms.author: fasantia
ms.reviewer: mopeakande
ms.service: machine-learning
ms.subservice: mlops
ms.date: 07/8/2022
ms.topic: conceptual
ms.custom: cliv2, sdkv2
---

# Logging MLflow models

The following article explains how to start logging your trained models (or artifacts) as MLflow models. It explores the different methods to customize the way MLflow packages your models and hence how it runs them. 

## Why logging models instead of artifacts?

If you are not familiar with MLflow, you may not be aware of the difference between logging artifacts or files vs. logging MLflow models. We recommend reading the article [From artifacts to models in MLflow](concept-mlflow-models.md) for an introduction to the topic.

A model in MLflow is also an artifact, but with a specific structure that serves as a contract between the person that created the model and the person that intends to use it. Such contract helps build the bridge about the artifacts themselves and what they mean.

Logging models has the following advantages:
> [!div class="checklist"]
> * Models can be directly loaded for inference using `mlflow.<flavor>.load_model` and use the `predict` function.
> * Models can be used as pipelines inputs directly.
> * Models can be deployed without indicating a scoring script nor an environment.
> * Swagger is enabled in deployed endpoints automatically and the __Test__ feature can be used in Azure Machine Learning studio.
> * You can use the Responsible AI dashboard.

There are different ways to start using the model's concept in Azure Machine Learning with MLflow, as explained in the following sections:

## Logging models using autolog

One of the simplest ways to start using this approach is by using MLflow autolog functionality. Autolog allows MLflow to instruct the framework associated to with the framework you are using to log all the metrics, parameters, artifacts and models that the framework considers relevant. By default, most models will be log if autolog is enabled. Some flavors may decide not to do that in specific situations. For instance, the flavor PySpark won't log models if they exceed a certain size.

You can turn on autologging by using either `mlflow.autolog()` or `mlflow.<flavor>.autolog()`. The following example uses `autolog()` for logging a classifier model trained with XGBoost:

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
> If you are using Machine Learning pipelines, like for instance [Scikit-Learn pipelines](https://scikit-learn.org/stable/modules/generated/sklearn.pipeline.Pipeline.html), use the `autolog` functionality of that flavor for logging models. Models are automatically logged when the `fit()` method is called on the pipeline object. The notebook [Training and tracking an XGBoost classifier with MLflow](https://github.com/Azure/azureml-examples/blob/main/sdk/python/using-mlflow/train-and-log/xgboost_classification_mlflow.ipynb) demonstrates how to log a model with preprocessing using pipelines.

## Logging models with a custom signature, environment or samples

You can log models manually using the method `mlflow.<flavor>.log_model` in MLflow. Such workflow has the advantages of retaining control of different aspects of how the model is logged. 

Use this method when:
> [!div class="checklist"]
> * You want to indicate pip packages or a conda environment different from the ones that are automatically detected.
> * You want to include input examples.
> * You want to include specific artifacts into the package that will be needed.
> * Your signature is not correctly inferred by `autolog`. This is specifically important when you deal with inputs that are tensors where the signature needs specific shapes.
> * Somehow the default behavior of autolog doesn't fill your purpose.

The following example code logs a model for an XGBoost classifier:

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
> * `log_models=False` is configured in `autolog`. This prevents MLflow to automatically log the model, as it is done manually later.
> * `infer_signature` is a convenient method to try to infer the signature directly from inputs and outputs.
> * `mlflow.utils.environment._mlflow_conda_env` is a private method in MLflow SDK and it may change in the future. This example uses it just for sake of simplicity, but it must be used with caution or generate the YAML definition manually as a Python dictionary. 

## Logging models with a different behavior in the predict method

When you log a model using either `mlflow.autolog` or using `mlflow.<flavor>.log_model`, the flavor used for the model decides how inference should be executed and what gets returned by the model. MLflow doesn't enforce any specific behavior in how the `predict` generate results. There are scenarios where you probably want to do some pre-processing or post-processing before and after your model is executed.

A solution to this scenario is to implement machine learning pipelines that moves from inputs to outputs directly. Although this is possible (and sometimes encourageable for performance considerations), it may be challenging to achieve. For those cases, you probably want to [customize how your model does inference using a  custom models](#logging-custom-models) as explained in the following section.

## Logging custom models

MLflow provides support for a variety of [machine learning frameworks](https://mlflow.org/docs/latest/models.html#built-in-model-flavors) including FastAI, MXNet Gluon, PyTorch, TensorFlow, XGBoost, CatBoost, h2o, Keras, LightGBM, MLeap, ONNX, Prophet, spaCy, Spark MLLib, Scikit-Learn, and statsmodels. However, there may be times where you need to change how a flavor works, log a model not natively supported by MLflow or even log a model that uses multiple elements from different frameworks. For those cases, you may need to create a custom model flavor.

For this type of models, MLflow introduces a flavor called `pyfunc` (standing from Python function). Basically this flavor allows you to log any object you want as a model, as long as it satisfies two conditions:

* You implement the method `predict` (at least).
* The Python object inherits from `mlflow.pyfunc.PythonModel`.

> [!TIP]
> Serializable models that implements the Scikit-learn API can use the Scikit-learn flavor to log the model, regardless of whether the model was built with Scikit-learn. If your model can be persisted in Pickle format and the object has methods `predict()` and `predict_proba()` (at least), then you can use `mlflow.sklearn.log_model()` to log it inside a MLflow run.

# [Using a model wrapper](#tab/wrapper)

The simplest way of creating your custom model's flavor is by creating a wrapper around your existing model object. MLflow will serialize it and package it for you. Python objects are serializable when the object can be stored in the file system as a file (generally in Pickle format). During runtime, the object can be materialized from such file and all the values, properties and methods available when it was saved will be restored.

Use this method when:
> [!div class="checklist"]
> * Your model can be serialized in Pickle format.
> * You want to retain the models state as it was just after training.
> * You want to customize the way the `predict` function works.

The following sample wraps a model created with XGBoost to make it behaves in a different way to the default implementation of the XGBoost flavor (it returns the probabilities instead of the classes):

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

Then, a custom model can be logged in the run like this:

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
> Note how the `infer_signature` method now uses `y_probs` to infer the signature. Our target column has the target class, but our model now returns the two probabilities for each class.


# [Using artifacts](#tab/artifacts)

Wrapping your model may be simple, but sometimes your model is composed by multiple pieces that need to be loaded or it can't just be serialized as a Pickle file. In those cases, the `PythonModel` supports indicating an arbitrary list of **artifacts**. Each artifact will be packaged along with your model.

Use this method when:
> [!div class="checklist"]
> * Your model can't be serialized in Pickle format or there is a better format available for that.
> * Your model have one or many artifacts that need to be referenced in order to load the model.
> * You may want to persist some inference configuration properties (i.e. number of items to recommend).
> * You want to customize the way the model is loaded and how the `predict` function works.

To log a custom model using artifacts, you can do something as follows:

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
> * The model was saved using the save method of the framework used (it's not saved as a pickle).
> * `ModelWrapper()` is the model wrapper, but the model is not passed as a parameter to the constructor.
> A new parameter is indicated, `artifacts`, that is a dictionary with keys as the name of the artifact and values as the path is the local file system where the artifact is stored.

The corresponding model wrapper then would look as follows:

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

The complete training routine would look as follows:

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

Sometimes your model logic is complex and there are several source files that your model loads on inference time. This would be the case when you have a Python library for your model for instance. In this scenario, you want to package the library all along with your model so it can move as a single piece. 

Use this method when:
> [!div class="checklist"]
> * Your model can't be serialized in Pickle format or there is a better format available for that.
> * Your model artifacts can be stored in a folder where all the requiered artifacts are placed.
> * Your model source code is complex and it requires multiple Python files. Potentially, there is a library that supports your model.
> * You want to customize the way the model is loaded and how the `predict` function works.

MLflow supports this kind of models too by allowing you to specify any arbitrary source code to package along with the model as long as it has a *loader module*. Loader modules can be specified in the `log_model()` instruction using the argument `loader_module` which indicates the Python namespace where the loader is implemented. The argument `code_path` is also required, where you indicate the source files where the `loader_module` is defined. You are required to implement in this namespace a function called `_load_pyfunc(data_path: str)` that received the path of the artifacts and returns an object with a method predict (at least).

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
> * The model was saved using the save method of the framework used (it's not saved as a pickle).
> * A new parameter, `data_path`, was added pointing to the folder where the model's artifacts are located. This can be a folder or a file. Whatever is on that folder or file, it will be packaged with the model.
> * A new parameter, `code_path`, was added pointing to the location where the source code is placed. This can be a path or a single file. Whatever is on that folder or file, it will be packaged with the model.
> * `loader_module` is the Python module where the function `_load_pyfunc` is defined.

The folder `src` contains a file called `loader_module.py` (which is the loader module):

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
> * The class `MyModel` doesn't inherits from `PythonModel` as we did before, but it has a `predict` function.
> * The model's source code is on a file. This can be any source code you want. If your project has a folder src, it is a great candidate.
> * We added a function `_load_pyfunc` which returns an instance of the model's class.

The complete training code would look as follows:

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
