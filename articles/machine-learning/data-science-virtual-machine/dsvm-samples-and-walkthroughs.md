---
title: Samples and walkthroughs for Data Science Virtual Machines - Azure | Microsoft Docs
description: Learn about the samples and walkthroughs that teach you how to accomplish common tasks and scenarios with the Data Science Virtual Machine.
keywords: data science tools, data science virtual machine, tools for data science, linux data science
services: machine-learning
documentationcenter: ''
author: gopitk
manager: cgronlun
ms.custom: seodec18

ms.assetid: 
ms.service: machine-learning
ms.subservice: data-science-vm
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 09/24/2018
ms.author: gokuma

---


# Samples on Data Science Virtual Machines

Azure Data Science Virtual Machines includes a comprehensive set of sample code. The sample code is in the form of Jupyter notebooks and scripts in languages such as Python and R. 
> [!NOTE]
> For more information on how to run Jupyter notebooks on your data science virtual machines, see the [Access Jupyter](#access-jupyter) section.

## Quick reference of samples
| Samples category | Description | Locations |
| ------------- | ------------- | ------------- |
| R language  | Samples in R explain scenarios such as how to connect with Azure cloud data stores. They also explain how to compare open-source R and Microsoft R. And they explain how to operationalize models on Microsoft R Server or SQL Server. <br/> [R language](#r-language) | <br/>`~notebooks` <br/> <br/> `~samples/MicrosoftR` <br/> <br/> `~samples/RSqlDemo` <br/> <br/> `~samples/SQLRServices`<br/> <br/>|
| Python language  | Samples in Python explain scenarios such as how to connect with Azure cloud data stores and work with Azure Machine Learning.  <br/> [Python language](#python-language) | <br/>`~notebooks` <br/><br/>|
| Julia language  | Sample in Julia that details plotting and deep learning in Julia. It also explains calling C and Python from Julia. <br/> [Julia language](#julia-language) |<br/> Windows:<br/> `~notebooks/Julia_notebooks`<br/><br/> Linux:<br/> `~notebooks/julia`<br/><br/> |
| Azure Machine Learning  | Build machine learning and deep learning models with Machine Learning. Deploy models anywhere. Use automated machine learning and intelligent hyperparameter tuning. Also use model management and distributed training. <br/> [Machine Learning](#azureml) | <br/>`~notebooks/AzureML`<br/> <br/>|
| PyTorch notebooks  | Deep learning samples that use PyTorch-based neural networks. Notebooks range from beginner to advanced scenarios.  <br/> [PyTorch notebooks](#pytorch) | <br/>`~notebooks/Deep_learning_frameworks/pytorch`<br/> <br/>|
| TensorFlow  |  Different neural network samples and techniques implemented by using the TensorFlow framework. <br/> [TensorFlow](#tensorflow) | <br/>`~notebooks/Deep_learning_frameworks/tensorflow`<br/><br/> |
| Microsoft Cognitive Toolkit <br/>   | Deep learning samples published by the Cognitive Toolkit team at Microsoft.  <br/> [Cognitive Toolkit](#cntk) | <br/> `~notebooks/DeepLearningTools/CNTK/Tutorials`<br/><br/> Linux:<br/> `~notebooks/CNTK`<br/> <br/>|
| caffe2 | Deep learning samples that use caffe2-based neural networks. Several notebooks familiarize users with caffe2 and how to use it effectively. Examples include image pre-processing and data set creation. They also include regression and how to use pre-trained models. <br/> [caffe2](#caffe2) | <br/>`~notebooks/Deep_learning_frameworks/caffe2`<br/><br/> |
| H2O   | Python-based samples that use H2O for real-world scenario problems. <br/> [H2O](#h2o) | <br/>`~notebooks/h2o`<br/><br/> |
| SparkML language  | Samples that use features of the Spark MLLib toolkit through pySpark and MMLSpark--Microsoft Machine Learning for Apache Spark on Apache Spark 2.x.  <br/> [SparkML language](#sparkml) | <br/>`~notebooks/SparkML/pySpark`<br/>`~notebooks/MMLSpark`<br/><br/>  |
| XGBoost | Standard machine learning samples in XGBoost for scenarios such as classification and regression. <br/> [XGBoost](#xgboost) | <br/>Windows:<br/>`\dsvm\samples\xgboost\demo`<br/><br/> |

<br/>

## Access Jupyter 

To access Jupyter, select the `Jupyter` icon on the desktop or application menu. You also can access Jupyter on Linux editions of Data Science Virtual Machines. You can access remotely from a web browser by visiting `https://<Full Domain Name or IP Address of the DSVM>:8000` on Ubuntu.

To add exceptions and make Jupyter access available over a browser, see the following screenshot.


![Enable Jupyter exception](./media/ubuntu-jupyter-exception.png)


Sign in with the same password as your login for Data Science Virtual Machines.
<br/>

**Jupyter home**
<br/>![Jupyter home](./media/jupyter-home.png)<br/>

## R language 
<br/>![R samples](./media/r-language-samples.png)<br/>

## Python language
<br/>![Python samples](./media/python-language-samples.png)<br/>

## Julia language 
<br/>![Julia samples](./media/julia-samples.png)<br/>

## AzureML 
<br/>![AzurekML samples](./media/azureml-samples.png)<br/>

## PyTorch
<br/>![PyTorch samples](./media/pytorch-samples.png)<br/>

## TensorFlow 
<br/>![TensorFlow samples](./media/tensorflow-samples.png)<br/>


## CNTK 
<br/>![CNTK samples](./media/cntk-samples.png)<br/>


## caffe2 
<br/>![caffe2 samples](./media/caffe2-samples.png)<br/>

## H2O 
<br/>![H2O samples](./media/h2o-samples.png)<br/>

## SparkML 
<br/>![SparkML samples](./media/sparkml-samples.png)<br/>

## XGBoost 
<br/>![XGBoost samples](./media/xgboost-samples.png)<br/>

