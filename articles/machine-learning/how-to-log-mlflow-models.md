---
title: Logging MLflow models
titleSuffix: Azure Machine Learning
description: Learn how to start logging MLflow models instead of artifacts using MLflow SDK in Azure Machine Learning.
services: machine-learning
author: santiagxf
ms.author: fasantia
ms.service: machine-learning
ms.subservice: mlops
ms.date: 07/8/2022
ms.topic: conceptual
ms.custom: devx-track-python, cliv2, sdkv2
---

# Logging MLflow models

The following article explains how to start logging your trained models (or artifacts) as MLflow models depending on the characteristics of the assets you are dealing with and the level of control you want to retain in the process. 

## Why logging models instead of artifacts?

If you are not familiar with MLflow, you may not be aware of the difference between logging artifacts or files vs. logging MLflow models. Read the article [From artifacts to models in MLflow](concept-mlflow-models.md) for an introduction to the topic.

A model in MLflow is also an artifact, but we make stronger assumptions about this type of artifact. Such assumptions allow us to create a clear contract between the saved artifacts and what they mean.

Logging models has the following advantages:
> [!div class="checklist"]
> * You don't need to provide a scoring script nor an environment for deployment.
> * Swagger is enabled in endpoints automatically and the __Test__ feature can be used in Azure ML studio.
> * Models can be used as pipelines inputs directly.
> * You can use the Responsable AI dashbord.

There are different ways to start using the model's concept in Azure Machine Learning with MLflow, as explained in the following sections:

## Logging models using autolog()

One of the simplest ways to start using this approach is by using MLflow autolog functionality. Autolog allows MLflow to instruct the framework associated to with the framework you are using to log all the metrics, parameters, artifacts and models that the framework considers relevant. By default, most models will be log if autolog is enabled. Some flavors may decide not to do that in specific situations. For instance, the flavor PySpark won't log models if they exceed a certain size.

You can turn on autologging by using the autolog method for the framework you are using. For instance, for XGBoost models,

```python
import mlflow
from xgboost import XGBClassifier
from sklearn.metrics import accuracy_score

with mlflow.start_run():
    mlflow.autolog()

    model = XGBClassifier(use_label_encoder=False, eval_metric="logloss")
    model.fit(X_train, y_train, eval_set=[(X_test, y_test)], verbose=False)
    y_pred = model.predict(X_test)

    accuracy = accuracy_score(y_test, y_pred)
```

## Logging models with a custom signature, environment or samples

If you need to log the models in a particular way, then you can log them manually using the method `mlflow.<flavor>.log_model`. Usually, you'll log the model in this way when:

* You need to indicate pip packages or dependencies different from the ones that are automatically detected.
* You need to indicate a conda environment different from the default one.
* Your models use a signature different from the one inferred. This is specifically important when you deal with inputs that are tensors where the signature needs specific shapes.
* You want to include input examples.
* You want to include specific artifacts into the package that will be needed.
* Somehow the default behavior of autolog doesn't fill your purpose.

The following example code logs a model for an XGBoost classifier:

```python
import mlflow
from xgboost import XGBClassifier
from sklearn.metrics import accuracy_score
from mlflow.models import infer_signature

with mlflow.start_run():
    mlflow.autolog(log_models=False)

    model = XGBClassifier(use_label_encoder=False, eval_metric="logloss")
    model.fit(X_train, y_train, eval_set=[(X_test, y_test)], verbose=False)
    y_pred = model.predict(X_test)

    accuracy = accuracy_score(y_test, y_pred)

    signature = infer_signature(X_test, y_test)
    mlflow.xgboost.log_model(model, "classifier", signature=signature)
```

> [!NOTE]
> * `log_models=False` is configured in `autolog`. This prevents MLflow to automatically log the model, as it is done manually later.
> * `infer_signature` is a convenient method to try to infer the signature directly from inputs and outpus.

## Logging models with a different behavior in the predict method

For those cases where you need inference to happen in a particular way, MLflow allows you to log models with a custom loading and inference routine. Such routines are called a *loader module*. Loader modules can be specified in the `log_model()` instruction using the argument `loader_module` which indicates the Python namespace where the loader is implemented. The argument `code_path` is also required, where you indicate the source files where the `loader_module` is defined. You are required to to implement in this namespace a function called `_load_pyfunc(data_path: str)` that received the path of the artifacts and returns an object with a method predict (at least).

The following example logs a model using `xgboost` flavor, but the probabilities are returned instead of the predicted class (which is the default behavior in Xgboost):

```python
mlflow.xgboost.log_model("classifier", 
                         code_path=['loader_module.py'],
                         loader_module='loader_module'
                         signature=signature)
```

The corresponding file `loader_module.py` looks as follows:

__loader_module.py__

```python
class MyModel():
    def __init__(self, model):
        self._model = model
        
    def predict(self, data):
        return self._model.predict_proba(data)

def _load_pyfunc(data_path: str):
    import os
    
    model = XGBClassifier()
    model.load_model(os.path.abspath(data_path))
    
    return MyModel(model)
```

> [!NOTE]
> * A new parameter, `code_path`, was added pointing to the location where the source code is placed. This can be a path or a single file. Whatever is on that folder or file, it will be packaged with the model.
> * The parameter `loader_module` represents a namespace in Python where the code to load the model is placed. 


## Logging custom models

Mlflow supports a large variety of frameworks, including FastAI, MXNet Gluon, PyTorch, TensorFlow, XGBoost, CatBoost, h2o, Keras, LightGBM, MLeap, ONNX, Prophet, spaCy, Spark MLLib, Scikit-Learn, and Statsmodels. However, they may be times where you need to change how a flavor works, log a model not natively supported by MLflow or even log a model that uses multiple elements from different frameworks. For those cases, you may need to create a custom model flavor.

### Serializable models

Python objects are serializable when the object can be stored in the file system as a file (generally in Pickle format). During runtime, the object can be materialized from such file and all the values, properties and methods available when it was saved will be restored.

> [!TIP]
> Serializable models that implements the Scikit-learn API can use the Scikit-learn flavor to log the model, regardless if the framework used is Scikit-learn. If your model can be persisted in Pickle format and the object has methods `predict()` and `predict_proba()` (at least), then you can use `mlflow.sklearn.log_model()` to log it inside a MLflow run.

For this type of models, MLflow introduces a flavor called `pyfunc` (standing from Python function). Basically this flavor allows you to log any object you want as a model, as long as it satisfies two conditions:

* The Python object inherits from `mlflow.pyfunc.PythonModel`.
* You implement the method `predict` (at least).

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
mport mlflow
from xgboost import XGBClassifier
from sklearn.metrics import accuracy_score
from mlflow.models import infer_signature

with mlflow.start_run():
    mlflow.xgboost.autolog(log_models=False)

    model = XGBClassifier(use_label_encoder=False, eval_metric="logloss")
    model.fit(X_train, y_train, eval_set=[(X_test, y_test)], verbose=False)
    y_probs = model.predict_proba(X_test)

    accuracy = accuracy_score(y_test, y_probs.argmax(axis=1))
    mlflow.log_metric("accuracy", accuracy)

    signature = infer_signature(X_test, y_probs)
    mlflow.pyfunc.log_model(
        "classifier", python_model=ModelWrapper(model), signature=signature
    )
```
> [!TIP]
> Note how the `infer_signature` method now uses `y_probs` to infer the signature. Our target column has the target class, but our model now returns the two probabilities for each class.

### Non-serializable models

By non-serializable models we mean that they cannot be serialized as a Pickle file. This includes models that hold references to code that can't be serialized, that don't support serialization, or that provides a more efficient way to be persisted in disk.

In this case, you're required to use a different method to persist the artifacts that you need for your model to run. Then, MLflow will snapshot all these artifacts and package them all for you. You have two different ways to do this, depending on your preferences:

# [Retaining model's state](#tab/pythonmodel)

Use this if you want to retain the state of your model's properties. For instance, in a recommender system you might want to store the number of elements to recommend to any user as a parameter. Here, you'll implement a model wrapper as you did in the option above, but in this case you'll use `artifacts` to indicate MLflow extra files that you want to include for loading the model state.

To log a custom model using artifacts, you can do something as follows:

```python
model_path = 'xgb.model'
model.save_model(model_path)

mlflow.pyfunc.log_model("classifier", 
                        python_model=ModelWrapper(),
                        artifacts={ 'model': model_path },
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
        from xgboost import XGBClassifier

        self._model = XGBClassifier(use_label_encoder=False, eval_metric="logloss")
        model.load_model(context.artifacts["model"])

    def predict(self, context: PythonModelContext, data):
        return self._model.predict_proba(data)
```

The complete training routine would look as follows:

```python
import mlflow
from xgboost import XGBClassifier
from sklearn.metrics import accuracy_score
from mlflow.models import infer_signature

with mlflow.start_run():
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
                            python_model=ModelWrapper(),
                            artifacts={"model": model_path},
                            signature=signature)
```

# [Stateless models](#tab/loader)

Sometimes your model logic is complex and there are several source code files being used to make your model work. This would be the case when you have a Python library for your model for instance. In this scenario, you want to package the library all along with your model so it can move from one place to another as a single piece.

MLflow supports this kind of models too by allowing you to specify any arbitrary source code to package along with the model.

```python
model_path = 'xgb.model'
model.save_model(model_path)

mlflow.pyfunc.log_model("classifier", 
                        data_path=model_path,
                        code_path=['loader_module.py'],
                        loader_module='loader_module'
                        signature=signature)
```

> [!NOTE]
> * The model was saved using the save method of the framework used (it's not saved as a pickle).
> * A new parameter, `data_path`, was added pointing to the folder where the model's artifacts are located. This can be a folder or a file. Whatever is on that folder or file, it will be packaged with the model.
> * A new parameter, `code_path`, was added pointing to the location where the source code is placed. This can be a path or a single file. Whatever is on that folder or file, it will be packaged with the model.
> * The parameter `loader_module` represents a namespace in Python where the code to load the model is placed. You are required to to implement in this namespace a function called `_load_pyfunc(data_path: str)` that received the path of the artifacts (being the value you just passed at `data_path`) and returns an object with a method `predict` (at least).

The corresponding `loader_module.py` implementation would be:

__loader_module.py__

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

with mlflow.start_run():
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
