---
title: Curated environments
titleSuffix: Azure Machine Learning
description: Collection of curated environments available in Azure Machine Learning
services: machine-learning
author: luisquintanilla
ms.author: luquinta
ms.reviewer: luquinta
ms.service: machine-learning
ms.subservice: core
ms.topic: reference
ms.date: 09/03/2020
---

# Azure Machine Learning Curated Environments

This article lists the curated environments in Azure Machine Learning, and the packages and channels that are pre-installed in them. Curated environments are provided by Azure Machine Learning and are available in your workspace by default. They are backed by cached Docker images, reducing the run preparation cost and allowing for faster deployment time. Use these environments to quickly get started with various machine learning frameworks.

> [!NOTE]
> This list is updated as of September 2020. Use the Python SDK to get the most updated list. For more information, see the [environments article](./how-to-use-environments.md#use-a-curated-environment).

## AzureML-AutoML

**Package channels:**

* anaconda
* conda-forge
* pytorch

**Conda packages:**

* python
* numpy
* scikit-learn
* pandas
* py-xgboost
* fbprophet
* holidays
* setuptools-git
* psutil

**Pip packages:**

* azureml-core
* azureml-pipeline-core
* azureml-telemetry
* azureml-defaults
* azureml-interpret
* azureml-explain-model
* azureml-automl-core
* azureml-automl-runtime
* azureml-train-automl-client
* azureml-train-automl-runtime
* inference-schema
* py-cpuinfo

## AzureML-AutoML-DNN

**Package channels:**

* anaconda
* conda-forge
* pytorch

**Conda packages:**

* python
* numpy
* scikit-learn
* pandas
* py-xgboost
* fbprophet
* holidays
* setuptools-git
* pytorch
* cudatoolkit
* psutil

**Pip packages:**

* azureml-core
* azureml-pipeline-core
* azureml-telemetry
* azureml-defaults
* azureml-interpret
* azureml-explain-model
* azureml-automl-core
* azureml-automl-runtime
* azureml-train-automl-client
* azureml-train-automl-runtime
* inference-schema
* pytorch-transformers
* spacy
* en_core_web_sm
* py-cpuinfo

## AzureML-AutoML-DNN-GPU

**Package channels:**

* anaconda
* conda-forge
* pytorch

**Conda packages:**

* python
* numpy
* scikit-learn
* pandas
* fbprophet
* holidays
* setuptools-git
* pytorch
* cudatoolkit
* psutil

**Pip packages:**

* azureml-core
* azureml-pipeline-core
* azureml-telemetry
* azureml-defaults
* azureml-interpret
* azureml-explain-model
* azureml-automl-core
* azureml-automl-runtime
* azureml-train-automl-client
* azureml-train-automl-runtime
* inference-schema
* horovod
* pytorch-transformers
* spacy
* en_core_web_sm
* py-cpuinfo

## AzureML-AutoML-DNN-Vision-GPU

**Conda packages:**

* python

**Pip packages:**

* azureml-core
* azureml-dataset-runtime
* azureml-contrib-dataset
* azureml-telemetry
* azureml-automl-core
* azureml-automl-runtime
* azureml-train-automl-client
* azureml-defaults
* azureml-interpret
* azureml-explain-model
* azureml-train-automl-runtime
* azureml-train-automl
* azureml-contrib-automl-dnn-vision

## AzureML-AutoML-GPU

**Package channels:**

* anaconda
* conda-forge
* pytorch

**Conda packages:**

* python
* numpy
* scikit-learn
* pandas
* fbprophet
* holidays
* setuptools-git
* psutil

**Pip packages:**

* azureml-core
* azureml-pipeline-core
* azureml-telemetry
* azureml-defaults
* azureml-interpret
* azureml-explain-model
* azureml-automl-core
* azureml-automl-runtime
* azureml-train-automl-client
* azureml-train-automl-runtime
* inference-schema
* py-cpuinfo

## AzureML-Chainer-5.1.0-CPU

**Package channels:**

* conda-forge

**Conda packages:**

* python

**Pip packages:**

* azureml-core
* azureml-defaults
* azureml-telemetry
* azureml-train-restclients-hyperdrive
* azureml-train-core
* chainer
* mpi4py

## AzureML-Chainer-5.1.0-GPU

**Package channels:**

* conda-forge

**Conda packages:**

* python

**Pip packages:**

* azureml-core
* azureml-defaults
* azureml-telemetry
* azureml-train-restclients-hyperdrive
* azureml-train-core
* chainer
* cupy-cuda90
* mpi4py

## AzureML-Dask-CPU

**Package channels:**

* conda-forge
* pytorch
* defaults

**Conda packages:**

* python

**Pip packages:**

* adlfs
* azureml-core
* azureml-dataset-runtime
* dask[complete]
* dask-ml[complete]
* distributed
* fastparquet
* fsspec
* joblib
* jupyterlab
* lz4
* mpi4py
* notebook
* pyarrow

## AzureML-Dask-GPU

**Package channels:**

* conda-forge

**Conda packages:**

* python
* matplotlib

**Pip packages:**

* azureml-defaults
* adlfs
* azureml-core
* dask[complete]
* dask-ml[complete]
* distributed
* fastparquet
* fsspec
* joblib
* jupyterlab
* lz4
* mpi4py
* notebook
* pyarrow

## AzureML-Hyperdrive-ForecastDNN

**Conda packages:**

* python

**Pip packages:**

* azureml-core
* azureml-pipeline-core
* azureml-telemetry
* azureml-defaults
* azureml-automl-core
* azureml-automl-runtime
* azureml-train-automl-client
* azureml-train-automl-runtime
* azureml-contrib-automl-dnn-forecasting

## AzureML-Minimal

**Package channels:**

* conda-forge

**Conda packages:**

* python

**Pip packages:**

* azureml-core
* azureml-defaults

## AzureML-PySpark-MmlSpark-0.15

**Package channels:**

* conda-forge

**Conda packages:**

* python

**Pip packages:**

* azureml-core
* azureml-defaults
* azureml-telemetry
* azureml-train-restclients-hyperdrive
* azureml-train-core

## AzureML-PyTorch-1.0-CPU

**Package channels:**

* conda-forge

**Conda packages:**

* python

**Pip packages:**

* azureml-core
* azureml-defaults
* azureml-telemetry
* azureml-train-restclients-hyperdrive
* azureml-train-core
* torch
* torchvision
* mkl
* horovod

## AzureML-PyTorch-1.0-GPU

**Package channels:**

* conda-forge

**Conda packages:**

* python

**Pip packages:**

* azureml-core
* azureml-defaults
* azureml-telemetry
* azureml-train-restclients-hyperdrive
* azureml-train-core
* torch
* torchvision
* mkl
* horovod

## AzureML-PyTorch-1.1-CPU

**Package channels:**

* conda-forge

**Conda packages:**

* python

**Pip packages:**

* azureml-core
* azureml-defaults
* azureml-telemetry
* azureml-train-restclients-hyperdrive
* azureml-train-core
* torch
* torchvision
* mkl
* horovod
* tensorboard
* future

## AzureML-PyTorch-1.1-GPU

**Package channels:**

* conda-forge

**Conda packages:**

* python

**Pip packages:**

* azureml-core
* azureml-defaults
* azureml-telemetry
* azureml-train-restclients-hyperdrive
* azureml-train-core
* torch
* torchvision
* mkl
* horovod
* tensorboard
* future

## AzureML-PyTorch-1.2-CPU

**Package channels:**

* conda-forge

**Conda packages:**

* python

**Pip packages:**

* azureml-core
* azureml-defaults
* azureml-telemetry
* azureml-train-restclients-hyperdrive
* azureml-train-core
* torch
* torchvision
* mkl
* horovod
* tensorboard
* future

## AzureML-PyTorch-1.2-GPU

**Package channels:**

* conda-forge

**Conda packages:**

* python

**Pip packages:**

* azureml-core
* azureml-defaults
* azureml-telemetry
* azureml-train-restclients-hyperdrive
* azureml-train-core
* torch
* torchvision
* mkl
* horovod
* tensorboard
* future

## AzureML-PyTorch-1.3-CPU

**Package channels:**

* conda-forge

**Conda packages:**

* python

**Pip packages:**

* azureml-core
* azureml-defaults
* azureml-telemetry
* azureml-train-restclients-hyperdrive
* azureml-train-core
* torch
* torchvision
* mkl
* horovod
* tensorboard
* future

## AzureML-PyTorch-1.3-GPU

**Package channels:**

* conda-forge

**Conda packages:**

* python

**Pip packages:**

* azureml-core
* azureml-defaults
* azureml-telemetry
* azureml-train-restclients-hyperdrive
* azureml-train-core
* torch
* torchvision
* mkl
* horovod
* tensorboard
* future

## AzureML-PyTorch-1.4-CPU

**Package channels:**

* conda-forge

**Conda packages:**

* python

**Pip packages:**

* azureml-core
* azureml-defaults
* azureml-telemetry
* azureml-train-restclients-hyperdrive
* azureml-train-core
* torch
* torchvision
* mkl
* horovod
* tensorboard
* future

## AzureML-PyTorch-1.4-GPU

**Package channels:**

* conda-forge

**Conda packages:**

* python

**Pip packages:**

* azureml-core
* azureml-defaults
* azureml-telemetry
* azureml-train-restclients-hyperdrive
* azureml-train-core
* torch
* torchvision
* mkl
* horovod
* tensorboard
* future

## AzureML-PyTorch-1.5-CPU

**Package channels:**

* conda-forge

**Conda packages:**

* python

**Pip packages:**

* azureml-core
* azureml-defaults
* azureml-telemetry
* azureml-train-restclients-hyperdrive
* azureml-train-core
* torch
* torchvision
* mkl
* horovod
* tensorboard
* future

## AzureML-PyTorch-1.5-GPU

**Package channels:**

* conda-forge

**Conda packages:**

* python

**Pip packages:**

* azureml-core
* azureml-defaults
* azureml-telemetry
* azureml-train-restclients-hyperdrive
* azureml-train-core
* torch
* torchvision
* mkl
* horovod
* tensorboard
* future

## AzureML-PyTorch-1.6-CPU

**Package channels:**

* conda-forge

**Conda packages:**

* python

**Pip packages:**

* azureml-core
* azureml-defaults
* azureml-telemetry
* azureml-train-restclients-hyperdrive
* azureml-train-core
* torch
* torchvision
* mkl
* horovod
* tensorboard
* future

## AzureML-PyTorch-1.6-GPU

**Package channels:**

* conda-forge

**Conda packages:**

* python

**Pip packages:**

* azureml-core
* azureml-defaults
* azureml-telemetry
* azureml-train-restclients-hyperdrive
* azureml-train-core
* torch
* torchvision
* mkl
* horovod
* tensorboard
* future

## AzureML-Scikit-learn-0.20.3

**Package channels:**

* conda-forge

**Conda packages:**

* python

**Pip packages:**

* azureml-core
* azureml-defaults
* azureml-telemetry
* azureml-train-restclients-hyperdrive
* azureml-train-core
* scikit-learn
* scipy
* joblib

## AzureML-TensorFlow-1.10-CPU

**Package channels:**

* conda-forge

**Conda packages:**

* python

**Pip packages:**

* azureml-core
* azureml-defaults
* azureml-telemetry
* azureml-train-restclients-hyperdrive
* azureml-train-core
* tensorflow
* horovod

## AzureML-TensorFlow-1.10-GPU

**Package channels:**

* conda-forge

**Conda packages:**

* python

**Pip packages:**

* azureml-core
* azureml-defaults
* azureml-telemetry
* azureml-train-restclients-hyperdrive
* azureml-train-core
* tensorflow-gpu
* horovod

## AzureML-TensorFlow-1.12-CPU

**Package channels:**

* conda-forge

**Conda packages:**

* python

**Pip packages:**

* azureml-core
* azureml-defaults
* azureml-telemetry
* azureml-train-restclients-hyperdrive
* azureml-train-core
* tensorflow
* horovod

## AzureML-TensorFlow-1.12-GPU

**Package channels:**

* conda-forge

**Conda packages:**

* python

**Pip packages:**

* azureml-core
* azureml-defaults
* azureml-telemetry
* azureml-train-restclients-hyperdrive
* azureml-train-core
* tensorflow-gpu
* horovod

## AzureML-TensorFlow-1.13-CPU

**Package channels:**

* conda-forge

**Conda packages:**

* python

**Pip packages:**

* azureml-core
* azureml-defaults
* azureml-telemetry
* azureml-train-restclients-hyperdrive
* azureml-train-core
* tensorflow
* horovod

## AzureML-TensorFlow-1.13-GPU

**Package channels:**

* conda-forge

**Conda packages:**

* python

**Pip packages:**

* azureml-core
* azureml-defaults
* azureml-telemetry
* azureml-train-restclients-hyperdrive
* azureml-train-core
* tensorflow-gpu
* horovod

## AzureML-TensorFlow-2.0-CPU

**Package channels:**

* conda-forge

**Conda packages:**

* python

**Pip packages:**

* azureml-core
* azureml-defaults
* azureml-telemetry
* azureml-train-restclients-hyperdrive
* azureml-train-core
* tensorflow
* horovod

## AzureML-TensorFlow-2.0-GPU

**Package channels:**

* conda-forge

**Conda packages:**

* python

**Pip packages:**

* azureml-core
* azureml-defaults
* azureml-telemetry
* azureml-train-restclients-hyperdrive
* azureml-train-core
* tensorflow-gpu
* horovod

## AzureML-TensorFlow-2.1-CPU

**Package channels:**

* conda-forge

**Conda packages:**

* python

**Pip packages:**

* azureml-core
* azureml-defaults
* azureml-telemetry
* azureml-train-restclients-hyperdrive
* azureml-train-core
* tensorflow
* horovod

## AzureML-TensorFlow-2.1-GPU

**Package channels:**

* conda-forge

**Conda packages:**

* python

**Pip packages:**

* azureml-core
* azureml-defaults
* azureml-telemetry
* azureml-train-restclients-hyperdrive
* azureml-train-core
* tensorflow-gpu
* horovod

## AzureML-TensorFlow-2.2-CPU

**Package channels:**

* conda-forge

**Conda packages:**

* python

**Pip packages:**

* azureml-core
* azureml-defaults
* azureml-telemetry
* azureml-train-restclients-hyperdrive
* azureml-train-core
* tensorflow
* horovod

## AzureML-TensorFlow-2.2-GPU

**Package channels:**

* conda-forge

**Conda packages:**

* python

**Pip packages:**

* azureml-core
* azureml-defaults
* azureml-telemetry
* azureml-train-restclients-hyperdrive
* azureml-train-core
* tensorflow-gpu
* horovod

## AzureML-Tutorial

**Package channels:**

* anaconda
* conda-forge

**Conda packages:**

* python
* pandas
* numpy
* tqdm
* scikit-learn
* matplotlib

**Pip packages:**

* azureml-core
* azureml-defaults
* azureml-telemetry
* azureml-train-restclients-hyperdrive
* azureml-train-core
* azureml-widgets
* azureml-pipeline-core
* azureml-pipeline-steps
* azureml-opendatasets
* azureml-automl-core
* azureml-automl-runtime
* azureml-train-automl-client
* azureml-train-automl-runtime
* azureml-train-automl
* azureml-train
* azureml-sdk
* azureml-interpret
* azureml-tensorboard
* azureml-mlflow
* mlflow
* sklearn-pandas

## AzureML-VowpalWabbit-8.8.0

**Package channels:**

* conda-forge

**Conda packages:**

* python

**Pip packages:**

* azureml-core
* azureml-defaults
* azureml-dataset-runtime[fuse,pandas]
