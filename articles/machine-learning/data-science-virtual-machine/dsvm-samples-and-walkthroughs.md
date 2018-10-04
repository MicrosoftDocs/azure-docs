---
title: Samples and walkthroughs for the Data Science Virtual Machine - Azure | Microsoft Docs
description: Samples and walkthroughs for the Data Science Virtual Machine.
keywords: data science tools, data science virtual machine, tools for data science, linux data science
services: machine-learning
documentationcenter: ''
author: gopitk
manager: cgronlun

ms.assetid: 
ms.service: machine-learning
ms.component: data-science-vm
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 09/24/2018
ms.author: gokuma

---


# Samples on the Data Science Virtual Machines (DSVM)

The DSVMs includes a comprehensive set of sample code both in the form of Jupyter Notebooks as well as scripts in languages like Python and R.    
> [!NOTE]
> Refer to [Access Jupyter](#access-jupyter) section for more information on running Jupyter Notebooks on your DSVM.

## Quick Reference of Samples
| Samples Category | Description | Locations |
| ------------- | ------------- | ------------- |
| **R** Language  | Samples in **R** explaining scenarios like connecting with Azure cloud data stores, Comparing Open Source R and Microsoft R & operationalizing Models on Microsoft R Server or SQL Server. <br/> [Screenshot](#r-language) | <br/>`~notebooks` <br/> <br/> `~samples/MicrosoftR` <br/> <br/> `~samples/RSqlDemo` <br/> <br/> `~samples/SQLRServices`<br/> <br/>|
| **Python** Language  | Samples in **Python** explaining scenarios like connecting with Azure cloud data stores and working with **Azure Machine Learning**.  <br/> [Screenshot](#python-language) | <br/>`~notebooks` <br/><br/>|
| **Julia** Language  | Sample in **Julia** that detail Plotting in Julia, deep learning in Julia, calling C and Python from Julia etc. <br/> [Screenshot](#julia-language) |<br/> **Windows**:<br/> `~notebooks/Julia_notebooks`<br/><br/> **Linux**:<br/> `~notebooks/julia`<br/><br/> |
| **Azure Machine Learning** AzureML  | Build ML and deep learning models with **Azure Machine Learning** Service and deploying models anywhere. Leverage capabilities like Automated ML, Intelligent hyper parameter tuning, model management, distributed training. <br/> [Screenshot](#azureml) | <br/>`~notebooks/AzureML`<br/> <br/>|
| **PyTorch** Notebooks  | Deep Learning samples utilizing **PyTorch** based neural networks. There are a variety of notebooks ranging from beginner to advanced scenarios.  <br/> [Screenshot](#pytorch) | <br/>`~notebooks/Deep_learning_frameworks/pytorch`<br/> <br/>|
| **TensorFlow**  | Multiple different Neural Network Samples and techniques implemented using the **TensorFlow** framework. <br/> [Screenshot](#tensorflow) | <br/>`~notebooks/Deep_learning_frameworks/tensorflow`<br/><br/> |
| **CNTK** <br/> (Microsoft Cognitive Toolkit)  | Deep learning samples published by the Cognitive Toolkit team at Microsoft.  <br/> [Screenshot](#cntk) | <br/> `~notebooks/DeepLearningTools/CNTK/Tutorials`<br/><br/> **Linux**:<br/> `~notebooks/CNTK`<br/> <br/>|
| **caffe2** | Deep Learning samples utilizing **caffe2** based neural networks. There are several notebooks designed to familiarize users with caffe2 and how to use it effectively, including examples like image pre-processing, dataset creation, Regression, and using pre-trained models. <br/> [Screenshot](#caffe2) | <br/>`~notebooks/Deep_learning_frameworks/caffe2`<br/><br/> |
| **H2O**   | Python-based samples utilizing **H2O** for numerous real-world scenario problems. <br/> [Screenshot](#h2o) | <br/>`~notebooks/h2o`<br/><br/> |
| **SparkML** Language  | Sample utilizing features and capabilities of Spark's **MLlib** toolkit through **pySpark** and **MMLSpark - Microsoft Machine Learning for Apache Spark** on **Apache Spark 2.x**.  <br/> [Screenshot](#sparkml) | <br/>`~notebooks/SparkML/pySpark`<br/>`~notebooks/MMLSpark`<br/><br/>  |
| **XGBoost** | Standard Machine Learning samples in **XGBoost** for scenarios like classification, regression etc. <br/> [Screenshot](#xgboost) | <br/>**Windows**:<br/>`\dsvm\samples\xgboost\demo`<br/><br/> |

<br/>

## Access Jupyter 

You can access Jupyter by clicking on the `Jupyter` icon on the desktop or application menu. You can also access Jupyter on Linux editions of the DSVM remotely from a web browser by visiting **`https://<Full Domain Name or IP Address of the DSVM>:8000`** on Ubuntu.

See screenshot to add exception and enable Jupyter access over the browser.


![Enable Jupyter Exception](./media/ubuntu-jupyter-exception.png)


Sign in with the same password as your login for the DSVM.
<br/>

**Jupyter Home**
<br/>![Jupyter Home](./media/jupyter-home.png)<br/>

## R Language 
<br/>![R Samples](./media/r-language-samples.png)<br/>

## Python Language
<br/>![Python Samples](./media/python-language-samples.png)<br/>

## Julia Language 
<br/>![Julia Samples](./media/julia-samples.png)<br/>

## AzureML 
<br/>![AzurekML Samples](./media/azureml-samples.png)<br/>

## PyTorch
<br/>![PyTorch Samples](./media/pytorch-samples.png)<br/>

## TensorFlow 
<br/>![TensorFlow Samples](./media/tensorflow-samples.png)<br/>


## CNTK 
<br/>![CNTK Samples](./media/cntk-samples.png)<br/>


## caffe2 
<br/>![caffe2 Samples](./media/caffe2-samples.png)<br/>

## H2O 
<br/>![H2O Samples](./media/h2o-samples.png)<br/>

## SparkML 
<br/>![SparkML Samples](./media/sparkml-samples.png)<br/>

## XGBoost 
<br/>![XGBoost Samples](./media/xgboost-samples.png)<br/>

