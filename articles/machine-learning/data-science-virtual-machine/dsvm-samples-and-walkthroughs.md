---
title: Sample programs & ML walkthroughs
titleSuffix: Azure Data Science Virtual Machine 
description: Through these samples and walkthroughs, learn how to handle common tasks and scenarios with the Data Science Virtual Machine.
keywords: data science tools, data science virtual machine, tools for data science, linux data science
services: machine-learning
ms.service: data-science-vm
ms.custom: devx-track-python

author: timoklimmer
ms.author: tklimmer
ms.topic: conceptual
ms.reviewer: franksolomon
ms.date: 04/16/2024
---

# Samples on Azure Data Science Virtual Machines

An Azure Data Science Virtual Machines (DSVM) includes a comprehensive set of sample code. These samples include Jupyter notebooks and scripts in languages like Python and R.
> [!NOTE]
> For more information about how to run Jupyter notebooks on your data science virtual machines, visit the [Access Jupyter](#access-jupyter) section.

## Prerequisites

To run these samples, you must have a provisioned [Ubuntu Data Science Virtual Machine](./dsvm-ubuntu-intro.md).

## Available samples
| Samples category | Description | Locations |
| ------------- | ------------- | ------------- |
| Python language  | Samples that explain **how to connect with Azure-based cloud data stores** and **how to work with Azure Machine Learning scenarios**.  <br/>[Python language](#python-language) | <br/>`~notebooks` <br/><br/>|
| Julia language  | Provides a detailed description of plotting and deep learning in Julia. Explains how to call C and Python from Julia. <br/> [Julia language](#julia-language) |<br/> Windows:<br/> `~notebooks/Julia_notebooks`<br/><br/> Linux:<br/> `~notebooks/julia`<br/><br/> |
| Azure Machine Learning  | Shows how to build machine-learning and deep-learning models with Machine Learning. Deploy models anywhere. Use automated machine learning and intelligent hyperparameter tuning. Use model management and distributed training. <br/> [Machine Learning](#azure-machine-learning) | <br/>`~notebooks/AzureML`<br/> <br/>|
| PyTorch notebooks  | Deep-learning samples that use PyTorch-based neural networks. Notebooks range from beginner to advanced scenarios.  <br/> [PyTorch notebooks](#pytorch) | <br/>`~notebooks/Deep_learning_frameworks/pytorch`<br/> <br/>|
| TensorFlow  |  Various neural network samples and techniques implemented with the TensorFlow framework. <br/> [TensorFlow](#tensorflow) | <br/>`~notebooks/Deep_learning_frameworks/tensorflow`<br/><br/> |
| H2O   | Python-based samples that use H2O for real-world problem scenarios. <br/> [H2O](#h2o) | <br/>`~notebooks/h2o`<br/><br/> |
| SparkML language  | Samples that use Apache Spark MLLib toolkit features, through pySpark and MMLSpark: Microsoft Machine Learning for Apache Spark on Apache Spark 2.x.  <br/> [SparkML language](#sparkml) | <br/>`~notebooks/SparkML/pySpark`<br/>`~notebooks/MMLSpark`<br/><br/>  |
| XGBoost | Standard machine-learning samples in XGBoost - for example, classification and regression. <br/> [XGBoost](#xgboost) | <br/>Windows:<br/>`\dsvm\samples\xgboost\demo`<br/><br/> |

## Access Jupyter

To access Jupyter, select the **Jupyter** icon on the desktop or application menu. You also can access Jupyter on a Linux edition of a DSVM. For remote access from a web browser, visit `https://<Full Domain Name or IP Address of the DSVM>:8000` on Ubuntu.

To add exceptions, and make Jupyter access available through a browser, use this guidance:

![Enable Jupyter exception](./media/ubuntu-jupyter-exception.png)

Sign in with the same password that you use for Data Science Virtual Machine logins.

**Jupyter home**

:::image type="content" source="./media/jupyter-home.png" lightbox="./media/jupyter-home.png" alt-text="Screenshot showing sample Jupyter notebooks.":::

## R language

:::image type="content" source="./media/r-language-samples.png" lightbox="./media/r-language-samples.png" alt-text="Screenshot showing R language sample notebooks.":::

## Python language

:::image type="content" source="./media/python-language-samples.png" lightbox="./media/python-language-samples.png" alt-text="Screenshot showing Python language sample notebooks.":::

## Julia language

:::image type="content" source="./media/julia-samples.png" lightbox="./media/julia-samples.png" alt-text="Screenshot showing Julia language sample notebooks.":::

## Azure Machine Learning

:::image type="content" source="./media/azureml-samples.png" lightbox="./media/azureml-samples.png" alt-text="Screenshot showing Azure Machine Learning sample notebooks.":::

## PyTorch

:::image type="content" source="./media/pytorch-samples.png" lightbox="./media/pytorch-samples.png" alt-text="Screenshot showing PyTorch sample notebooks.":::

## TensorFlow

:::image type="content" source="./media/tensorflow-samples.png" lightbox="./media/tensorflow-samples.png" alt-text="Screenshot showing TensorFlow sample notebooks.":::

## H2O

:::image type="content" source="./media/h2o-samples.png" lightbox="./media/h2o-samples.png" alt-text="Screenshot showing H2O sample notebooks.":::

## SparkML

:::image type="content" source="./media/sparkml-samples.png" lightbox="./media/sparkml-samples.png" alt-text="Screenshot showing a pySpark notebook.":::

## XGBoost

:::image type="content" source="./media/xgboost-samples.png" lightbox="./media/xgboost-samples.png" alt-text="Screenshot showing the XGBoost demo directory.":::