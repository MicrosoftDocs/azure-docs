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
ms.date: 05/12/2021
---


# Samples on Azure Data Science Virtual Machines

Azure Data Science Virtual Machines (DSVMs) include a comprehensive set of sample code. These samples include Jupyter notebooks and scripts in languages like Python and R.
> [!NOTE]
> For more information about how to run Jupyter notebooks on your data science virtual machines, see the [Access Jupyter](#access-jupyter) section.

## Prerequisites

In order to run these samples, you must have provisioned an [Ubuntu Data Science Virtual Machine](./dsvm-ubuntu-intro.md).

## Available samples
| Samples category | Description | Locations |
| ------------- | ------------- | ------------- |
| Python language  | Samples explain scenarios like how to connect with Azure-based cloud data stores and how to work with Azure Machine Learning.  <br/> [Python language](#python-language) | <br/>`~notebooks` <br/><br/>|
| Julia language  | Provides a detailed description of plotting and deep learning in Julia. Also explains how to call C and Python from Julia. <br/> [Julia language](#julia-language) |<br/> Windows:<br/> `~notebooks/Julia_notebooks`<br/><br/> Linux:<br/> `~notebooks/julia`<br/><br/> |
| Azure Machine Learning  | Illustrates how to build machine-learning and deep-learning models with Machine Learning. Deploy models anywhere. Use automated machine learning and intelligent hyperparameter tuning. Also use model management and distributed training. <br/> [Machine Learning](#azure-machine-learning) | <br/>`~notebooks/AzureML`<br/> <br/>|
| PyTorch notebooks  | Deep-learning samples that use PyTorch-based neural networks. Notebooks range from beginner to advanced scenarios.  <br/> [PyTorch notebooks](#pytorch) | <br/>`~notebooks/Deep_learning_frameworks/pytorch`<br/> <br/>|
| TensorFlow  |  A variety of neural network samples and techniques implemented by using the TensorFlow framework. <br/> [TensorFlow](#tensorflow) | <br/>`~notebooks/Deep_learning_frameworks/tensorflow`<br/><br/> |
| H2O   | Python-based samples that use H2O for real-world problem scenarios. <br/> [H2O](#h2o) | <br/>`~notebooks/h2o`<br/><br/> |
| SparkML language  | Samples that use features of the Apache Spark MLLib toolkit through pySpark and MMLSpark: Microsoft Machine Learning for Apache Spark on Apache Spark 2.x.  <br/> [SparkML language](#sparkml) | <br/>`~notebooks/SparkML/pySpark`<br/>`~notebooks/MMLSpark`<br/><br/>  |
| XGBoost | Standard machine-learning samples in XGBoost for scenarios like classification and regression. <br/> [XGBoost](#xgboost) | <br/>Windows:<br/>`\dsvm\samples\xgboost\demo`<br/><br/> |

<br/>

## Access Jupyter 

To access Jupyter, select the **Jupyter** icon on the desktop or application menu. You also can access Jupyter on a Linux edition of a DSVM. To access remotely from a web browser, go to `https://<Full Domain Name or IP Address of the DSVM>:8000` on Ubuntu.

To add exceptions and make Jupyter access available over a browser, use the following guidance:


![Enable Jupyter exception](./media/ubuntu-jupyter-exception.png)


Sign in with the same password that you use to log in to the Data Science Virtual Machine.
<br/>

**Jupyter home**
<br/>![Jupyter home](./media/jupyter-home.png)<br/>

## R language 
<br/>![R samples](./media/r-language-samples.png)<br/>

## Python language
<br/>![Python samples](./media/python-language-samples.png)<br/>

## Julia language 
<br/>![Julia samples](./media/julia-samples.png)<br/>

## Azure Machine Learning 
<br/>![Azure Machine Learning samples](./media/azureml-samples.png)<br/>

## PyTorch
<br/>![PyTorch samples](./media/pytorch-samples.png)<br/>

## TensorFlow 
<br/>![TensorFlow samples](./media/tensorflow-samples.png)<br/>

## H2O 
<br/>![H2O samples](./media/h2o-samples.png)<br/>

## SparkML 
<br/>![SparkML samples](./media/sparkml-samples.png)<br/>

## XGBoost 
<br/>![XGBoost samples](./media/xgboost-samples.png)<br/>
