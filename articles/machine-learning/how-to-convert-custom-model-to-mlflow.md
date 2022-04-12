---
title: MLflow Tracking for models
titleSuffix: Azure Machine Learning
description:  Set up MLflow Tracking with Azure Machine Learning to log metrics and artifacts from ML models.
services: machine-learning
author: nibaccam
ms.author: nibaccam
ms.service: machine-learning
ms.subservice: mlops
ms.date: 04/15/2022
ms.topic: how-to
ms.custom: devx-track-python, mlflow
---

# Convert custom ML models to MLflow formatted models

In this article, learn how to convert your custom ML model into MLflow format. [MLflow](https://www.mlflow.org) is an open-source library for managing the life cycle of your machine learning experiments. With Azure Machine Learning, MLflow models get the added benefits of, 

* no code deployment
* easy of use
* Automatic tracking

MLflow provides convenient functions for creating models with the pyfunc flavor in a variety of machine learning frameworks (scikit-learn, Keras, Pytorch, and more); however, they do not cover every use case. For example, you may want to create an MLflow model with the pyfunc flavor using a framework that MLflow does not natively support or you may want to change a pre-trained model trained out of MLFlow into an MLFlow formatted model.

If you didn't train your model with MLFlow and want to use Azure Machine Learning's MLflow no-code deployment offering, you need to convert your custom model to MLFLow. Learn more about [custom python models and MLflow](https://mlflow.org/docs/latest/models.html#custom-python-models).

## Prerequisites


## Create a Python wrapper for your model

Before you can convert your model to an MLflow supported format, you need to first create a python wrapper for your model.
The following code demonstrates how to create a Python wrapper for an `sklearn` model.

```python

# Load training and test datasets
from sys import version_info
import sklearn
from sklearn import datasets
from sklearn.model_selection import train_test_split

import mlflow.pyfunc
from sklearn.metrics import mean_squared_error
from sklearn.model_selection import train_test_split

PYTHON_VERSION = "{major}.{minor}.{micro}".format(major=version_info.major,
                                                  minor=version_info.minor,
                                                  micro=version_info.micro)

# Train and save an SKLearn model
sklearn_model_path = "model.pkl"

artifacts = {
    "sklearn_model": sklearn_model_path
}

# create wrapper
class SKLearnWrapper(mlflow.pyfunc.PythonModel):

    def load_context(self, context):
        import pickle
        self.sklearn_model = pickle.load(open(context.artifacts["sklearn_model"], 'rb'))
    
    def predict(self, model, data):
        return self.sklearn_model.predict(data)
```

## Create a Conda environment 

Next, you need to create Conda environment for the new MLflow Model that contains all necessary dependencies. 

```python

import cloudpickle
conda_env = {
    'channels': ['defaults'],
    'dependencies': [
      'python={}'.format(PYTHON_VERSION),
      'pip',
      {
        'pip': [
          'mlflow',
          'scikit-learn=={}'.format(sklearn.__version__),
          'cloudpickle=={}'.format(cloudpickle.__version__),
        ],
      },
    ],
    'name': 'sklearn_env'
}
```

### Save the MLflow model to disk

Once your environment is ready, you can pass the SKlearnWrapper, the conda environment and your newly created artifacts dictionary to the mlflow.pyfunc.save_model() method. Doing so saves the model to your disk.

```python
mlflow_pyfunc_model_path = "sklearn_mlflow_pyfunc7"
mlflow.pyfunc.save_model(path=mlflow_pyfunc_model_path, python_model=SKLearnWrapper(), conda_env=conda_env, artifacts=artifacts)

```

## Load the MLFlow formatted model and test predictions

To ensure your newly saved MLflow formatted model didn't change during the save, you can load your model and print out a test prediction to compare your original model.

The following code prints a test prediction from the mlflow formatted model and a test prediction from the sklearn model that's saved to your disk for comparison. 

```python
loaded_model = mlflow.pyfunc.load_model(mlflow_pyfunc_model_path)

# Evaluate the model
import pandas as pd
test_predictions = loaded_model.predict(model_input)
print(test_predictions)

# load the model from disk
import pickle
loaded_model = pickle.load(open(sklearn_model_path, 'rb'))
result = loaded_model.predict(model_input)
print(result)
```

## Register the MLflow formatted model

Once you've confirmed that your model saved correctly, you can create a test run, so you can register and save your MLflow formatted model to your model registry.

```python
mlflow.pyfunc.log_model(artifact_path=mlflow_pyfunc_model_path, loader_module=None, data_path=None, code_path=None,
                              python_model=SKLearnWrapper(),
                              registered_model_name="Custom_mlflow_model", conda_env=conda_env, artifacts=artifacts)
 mlflow.end_run()
```

> [!IMPORTANT]
> In some cases, you might use a machine learning framework without its built-in MLflow model flavor support. For instance, the `vaderSentiment` library is a standard natural language processing (NLP) library used for sentiment analysis. Since it lacks a built-in MLflow model flavor, you cannot log or register the model with MLflow model fluent APIs. See an example on [how to save, log and register a model that doesn't have a supported built-in MLflow model flavor](https://mlflow.org/docs/latest/model-registry.html#registering-an-unsupported-machine-learning-model).

## Next steps

* [No-code deployment for Mlflow models](how-to-deploy-mlflow-models-online-endpoints.md)


