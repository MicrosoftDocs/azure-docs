---
title: Samples and walkthroughs for the Data Science Virtual Machine - Azure | Microsoft Docs
description: Samples and walkthroughs for the Data Science Virtual Machine.
keywords: data science tools, data science virtual machine, tools for data science, linux data science
services: machine-learning
documentationcenter: ''
author: bradsev
manager: cgronlun
editor: cgronlun

ms.assetid: 
ms.service: machine-learning
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/11/2017
ms.author: gokuma;bradsev

---


# Samples on the Data Science Virtual Machines (DSVM)

The DSVMs come with included fully worked-out samples in the form of Jupyter Notebooks and some that are not based on Jupyter. You can access Jupyter by clicking on the `Jupyter` icon on the desktop or application menu.  
>[AZURE.NOTE]
> Refer to [Access Jupyter](#access-jupyter) section to enable Jupyter Notebooks on your DSVM.

## Quick Reference of Samples
| Samples Category | Description | Locations |
| ------------- | ------------- | ------------- |
| **R** Language  | Samples in **R** explaining scenarios like connecting with Azure cloud data stores, Comparing Open Source R and Microsoft R & operationalizing Models on Microsoft R Server or SQL Server. <br/> [Screenshot](#r-language) | <br/>`~notebooks` <br/> <br/> `~samples/MicrosoftR` <br/> <br/> `~samples/RSqlDemo` <br/> <br/> `~samples/SQLRServices`<br/> <br/>|
| **Python** Language  | Samples in **Python** explaining scenarios like connecting with Azure cloud data stores and working with **Azure Machine Learning**.  <br/> [Screenshot](#python-language) | <br/>`~notebooks` <br/><br/>|
| **Julia** Language  | Sample in **Julia** that detail Plotting in Julia, deep learning in Julia, calling C and Python from Julia etc. <br/> [Screenshot](#julia-language) |<br/> **Windows**:<br/> `~notebooks/Julia_notebooks`<br/><br/>`~notebooks`<br/><br/> **Linux**:<br/> `~notebooks/julia`<br/><br/> |
| **CNTK** <br/> (Microsoft Cognitive Toolkit)  | Deep learning samples published by the Cognitive Toolkit team at Microsoft.  <br/> [Screenshot](#cntk) | <br/>**Windows**:<br/> `~notebooks/CNTK/Tutorials`<br/><br/>`~/samples/CNTK-Samples-2-0/Examples`<br/><br/> **Linux**:<br/> `~notebooks/CNTK`<br/> <br/>|
| **MXnet** Notebooks  | Deep Learning samples utilizing **MXnet** based neural networks. There are a variety of notebooks ranging from beginner to advanced scenarios.  <br/> [Screenshot](#mxnet) | <br/>`~notebooks/mxnet`<br/> <br/>|
| **Azure Machine Learning** AzureML  | Interacting with **Azure Machine Learning** Studio and creating web-service endpoints from locally trained models, for cloud-based scoring workflows. <br/> [Screenshot](#azureml) | <br/>`~notebooks/azureml`<br/> <br/>|
| **caffe2** | Deep Learning samples utilizing **caffe2** based neural networks. There are several notebooks designed to familiarize users with caffe2 and how to use it effectively, including examples like image pre-processing, dataset creation, Regression, and using pre-trained models. <br/> [Screenshot](#caffe2) | <br/>`~notebooks/caffe2`<br/><br/> |
| **H2O**   | Python-based samples utilizing **H2O** for numerous real-world scenario problems. <br/> [Screenshot](#h2o) | <br/>`~notebooks/h2o`<br/><br/> |
| **SparkML** Language  | Sample utilizing features and capabilities of Spark's **MLlib** toolkit through **pySpark 2.0** on **Apache Spark 2.0**.  <br/> [Screenshot](#sparkml) | <br/>`~notebooks/SparkML/pySpark`<br/><br/> |
| **MMLSpark** Language  | A variety of samples utilizing **MMLSpark - Microsoft Machine Learning for Apache Spark**, which is a framework that provides a number of deep learning and data science tools for **Apache Spark**. <br/> [Screenshot](#mmlspark) | <br/>`~notebooks/MMLSpark`<br/><br/> |
| **TensorFlow**  | Multiple different Neural Network Samples and techniques implemented using the **TensorFlow** framework. <br/> [Screenshot](#tensorflow) | <br/>`~notebooks/tensorflow`<br/><br/> |
| **XGBoost** | Standard Machine Learning samples in **XGBoost** for scenarios like classification, regression etc. <br/> [Screenshot](#xgboost) | <br/>`~samples/xgboost/demo`<br/><br/> |

<br/>

## Access Jupyter 

Visit Jupyter Home by going to **`https://localhost:9999`** on Windows or **`https://localhost:8000`** on Ubuntu.


### Enabling Jupyter access from Browser

**Windows DSVM**

Run **`Jupyter SetPassword`** from the desktop shortcut and follow the prompt to set/reset your password for Jupyter and start the Jupyter process. 
<br/>![Enable Jupyter Exception](./media/jupyter-setpassword.png)<br/>
You can access Jupyter Home once the Jupyter process has successfully started on your VM by visiting **`https://localhost:9999`** on your browser. See screenshot to add exception and enable Jupyter access over the browser
<br/>![Enable Jupyter Exception](./media/windows-jupyter-exception.png)<br/>
Sign in with the new password you had just set.
<br/>
**Linux DSVM**

You can access Jupyter Home on your VM by visiting **`https://localhost:8000`** on your browser. See screenshot to add exception and enable Jupyter access over the browser.
<br/>![Enable Jupyter Exception](./media/ubuntu-jupyter-exception.png)<br/>
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

## CNTK 
<br/>![CNTK Samples](./media/cntk-samples2.png)<br/>
<br/>![CNTK Samples](./media/cntk-samples.png)<br/>

## MXnet
<br/>![MXnet Samples](./media/mxnet-samples.png)<br/>

## AzureML 
<br/>![AzurekML Samples](./media/azureml-samples.png)<br/>

## caffe2 
<br/>![caffe2 Samples](./media/caffe2-samples.png)<br/>

## H2O 
<br/>![H2O Samples](./media/h2o-samples.png)<br/>

## SparkML 
<br/>![SparkML Samples](./media/sparkml-samples.png)<br/>

## TensorFlow 
<br/>![TensorFlow Samples](./media/tensorflow-samples.png)<br/>

## XGBoost 
<br/>![XGBoost Samples](./media/xgboost-samples.png)<br/>

