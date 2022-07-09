---
title: From artifacts to models in MLflow
titleSuffix: Azure Machine Learning
description: Learn about how MLflow uses the concept of models instead of artifacts to represents your trained models and enable a streamlined path to deployment.
services: machine-learning
author: santiagxf
ms.author: fasantia
ms.service: machine-learning
ms.subservice: mlops
ms.date: 07/8/2022
ms.topic: conceptual
ms.custom: devx-track-python, cliv2, sdkv2
---

# From artifacts to models in MLflow

The following article explains the differences between an artifact and a model in MLflow and how to transition from one to the other. It also explains how to start logging your trained models (or artifacts) as MLflow models depending on the characteristics of the assets you are dealing with and how they are supported in MLflow.

## What's the difference between an artifact and a model?

If you are not familiar with MLflow, you may not be aware of the difference between logging artifacts or files vs. logging MLflow models. There are some fundamental differences between the two:

### Artifacts

Any file generated (and captured) from an experiment's run or job is an artifact. It may represent a model serialized as a Pickle file, the weights of a PyTorch or TensorFlow model, or even a text file containing the coefficients of a linear regression. Other artifacts can have nothing to do with the model itself, but they can contain configuration to run the model, pre-processing information, sample data, etc. As you can see, an artifact can come in any format. 

You can log artifacts in MLflow in a similar way you log a file with Azure ML SDK v1:

```python
filename = 'model.pkl'
with open(filename, 'wb') as f:
  pickle.dump(model, f)

mlflow.log_artifact(filename)
```

### Models

A model in MLflow is also an artifact, as it matches the definition we introduced above. However, we make stronger assumptions about this type of artifacts. Such assumptions allow us to create a clear contract between the saved artifacts and what they mean. When you log your models as artifacts (simple files), you need to know what the model builder meant for each of them in order to know how to load the model for inference. When you log your models as a Model entity, you should be able to tell what it is based on the contract we just mentioned.

Logging models has the following advantages:
> [!div class="checklist"]
> * You don't need to provide an scoring script nor an environment for deployment.
> * Swagger is enabled in endpoints automatically and the __Test__ feature can be used in Azure ML studio.
> * Models can be used as pipelines inputs directly.
> * You can use the Responsable AI dashbord.

## The MLModel format

MLflow adopts the MLModel format as a way to create a contract between the artifacts and what they represent. The MLModel format stores assets in a folder. Among them there is a particular file named MLModel. This file is the single source of truth about how a model can be loaded and used.

The following examples shows how the `MLmodel` file for a computer version model trained with `fastai` may look like:

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

Considering the variety of machine learning frameworks available to use, MLflow introduced the concept of flavor which indicates what to expect for a given model created with an specific framework. As an example, TensorFlow has its own flavor which specifies how a TensorFlow model should be persisted and loaded. Because each model flavor indicates how they want to persist and load models, the MLModel format doesn't enforce a single serialization mechanism that all the models need to support. Such decision allows each flavor to use the methods that provide the best performance or best support according to their best practices - without compromising compatibility with the MLModel standard.

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

Signatures are indicated when the model gets logged and persisted in the `MLmodel` file, in the `signature` section. Autolog feature in MLflow automatically infer signatures in a best effort way. However, it may be require to [log the models manually if the signatures inferred are not the ones you need](https://www.mlflow.org/docs/latest/models.html#how-to-log-models-with-signatures). 

There are two types of signatures:

* **Column-based signature** corresponding to signatures that operate to tabular data. Models that operate with this signature can expect to recieve `pandas.DataFrame` objects as inputs.
* **Tensor-based signature:** corresponding to signatures that operate with n-dimentional arrays or tensors. Models taht operate with this signature can expect to recieve a `numpy.ndarray` as inputs (or a dictionary of `numpy.ndarray` in the case of named-tensors).

The following example corresponds to a computer vision model trained with `fastai`. This model recieves a batch of images represented as tensors of shape `(300, 300, 3)` with the RGB representation of them (unsigned integers). It outputs batchs of predictions (probabilities) for 2 classes. 

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
> Azure Machine Learning generates Swagger endpoints for MLflow models with a signature available. This makes easier to test deployed endpoints using the Azure ML studio.

### Model's environment

Requirements for the model to run are specified in the `conda.yaml` file. Dependencies can be automatically detected by MLflow or they can manually indicated when you call `mlflow.<flavor>.log_model()` method. The later can be needed in cases that the libraries included in your environment are not the ones you intended to use.

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
> MLflow environments and Azure Machine Learning environments are different concepts. While the former opperates at the level of the model, the later operates at the level of the workspace (for registered environments) or jobs/deployments (for annonymous environments). When you deploy MLflow models in Azure Machine Learning, the model's environment is built and used for deployment. Alternatively, you can override this behaviour with the [Azure ML CLI v2](concept-v2.md) and deploy MLflow models using an specific Azure Machine Learning environments.

### Model's predict function

All MLflow models contain a `predict` function. This function is the one that is called when a model is deployed using a no-code-deployment experience. What the `predict` function returns (classes, probabilities, a forecast, etc) depends on the framework (i.e. flavor) used for training. Read the documentation of each flavor to know what they return.

In same cases, you may need to customize this function to change the way inference is executed. In those cases you will need to [log models with a different behavior in the predict method](#logging-models-with-a-different-behavior-in-the-predict-method) or [log a custom model's flavor](#logging-custom-models).

## How do I start logging models instead of artifacts?

Logging artifacts as models in MLflow has the advantage of support no-code-deployment. That means that you don't have to provide an scoring script nor environment for the deployment. Learn more at [Deploy MLflow models](how-to-deploy-mlflow-models.md).

There are different ways to start using the model's concept in Azure Machine Learning with MLflow, as explained in the following sections:

### Logging models using autolog()

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

### Logging models created with frameworks supported by MLFlow

If you need to log the models in a particular way, then you can use the method log_model to log the models as you need to. Usually, you will log the model in this way when:

* You need to indicate pip packages or dependencies different from the ones that are automatically detected.
* You need to indicate a conda environment different from the default one.
* Your models uses a signature different from the one inferred. This is specifically important when you deal with inputs that are tensors where the signature needs specific shapes.
* You want to include input examples.
* You want to include specific artifacts into the package that will be needed.
* Somehow the default behaviour of autolog doesn't fill your purpoise.

To log a model, you use the log_method model of the flavor you are working with. For instance, the following code logs a model for an XGBoost classifier:

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

### Logging models with a different behavior in the predict method

For those cases where you need inference to happen in a particular way, MLflow allows you to log models with a custom loading and inference routine. Such routines are called a loader module. Loader modules can be specified in the `log_model()` instruction using the argument `loader_module` which indicates the Python namespace where the loader is implemented. The argument `code_path` is also added where you indicate the source files where the `loader_module` is defined.

The following example logs a model using `xgboost` flavor, but the probabilities are returned instead of the predicted class (which is the default behaviour in Xgboost):

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
    
    model = XGBClassifier(use_label_encoder=False, eval_metric='logloss')
    model.load_model(os.path.abspath(data_path))
    
    return MyModel(model)
```

> [!NOTE]
> * A new parameter, `code_path`, was added pointing to the location where the source code is placed. This can be a path or a single file. Whatever is on that folder or file, it will be packaged with the model.
> * The parameter `loader_module` represents a namespace in Python where the code to load the model is placed. You are required to to implement in this namespace a function called `_load_pyfunc(data_path: str)` that received the path of the artifacts and returns an object with a method predict (at least).


### Logging custom models

Mlflow supports a big variety of frameworks, including FastAI, MXNet Gluon, PyTorch, TensorFlow, XGBoost, CatBoost, h2o, Keras, LightGBM, MLeap, ONNX, Prophet, spaCy, Spark MLLib, Scikit-Learn, and Statsmodels. However, they may be times where you need to change how a flavor works, log a model not natively supported by MLflow or even log a model that uses multiple elements from different frameworks. For those cases, you may need to create a custom model flavor.

#### Serializable models

Python objects are serializable when the object can be stored in the file system as a file (generally in Pickle format). During runtime, the object can be materialized from such file and all the values, properties and methods available when it was saved will be restored.

> [!TIP]
> If your model implements the Scikit-learn API, then you can use the Scikit-learn flavor to log the model. For instance, if your model used to (or can be) persisted in Pickle format and the object has methods `predict` and `predict_proba` (at least), then you can use `mlflow.sklearn.log_model` to log it inside a MLflow run.

For this type of models, MLflow introduces a flavor called `pyfunc` (standing from Python function). Basically this flavor allows you to log any object you want as a model, as log as it satisfies two conditions:

* The Python objects inherits from `mlflow.pyfunc.PythonModel`.
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

#### Non-serializable models

Models that are not serializable means that they cannot be serialized as a Pickle file. This includes models that holds references to code that can't be serialized, that do not support serialization, or that provides a more efficient way to be persisted in disk.

In this case, you are required to use a different method to persist the artifacts that you need for your model to run. Then, Mlflow will snapshot all these artifacts and package them all for you. You have two different ways to do this, depending on your preferences:

[Retaining model's state](#tab/pythonmodel)

Use this if you want to retain the state of your model's properties. For instance, in a recommender system you might want to store the number of elements to recommend to any user as a parameter. Here, you will implement a model wrapper as you did in the option above, but in this case you will use `artifacts` to indicate MLflow extra files that you want to include for loading the model state.

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

[Stateless models](#tab/loader)

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
> The model was saved using the save method of the framework used (it's not saved as a pickle).
> A new parameter, `data_path`, was added pointing to the folder where the model's artifacts are located. This can be a folder or a file. Whatever is on that folder or file, it will be packaged with the model.
> A new parameter, `code_path`, was added pointing to the location where the source code is placed. This can be a path or a single file. Whatever is on that folder or file, it will be packaged with the model.
> The parameter `loader_module` represents a namespace in Python where the code to load the model is placed. You are required to to implement in this namespace a function called `_load_pyfunc(data_path: str)` that received the path of the artifacts (being the value you just passed at `data_path`) and returns an object with a method `predict` (at least).

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
> The model's source code is on a file. This can be any source code you want. If your project has a folder src, it is a great candidate.
> We added a function `_load_pyfunc` which returns an instance of the model's class.

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
