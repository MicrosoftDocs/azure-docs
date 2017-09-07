---
title: What are the Machine Learning Options in Azure? | Microsoft Docs
description: Overview of the various machine learning tools and services available in Azure.
services: machine-learning
documentationcenter: ''
author: mwinkle
manager: jhubbard
editor: cgronlun

ms.service: machine-learning
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/01/2017
ms.author: mwinkle

---
# What are the machine learning options in Azure?
There are a wide variety of options in Azure to build, deploy, and manage [machine learning models](../studio/what-is-machine-learning.md). This article describes each of the options, and give guidance on how to choose between them. 
* Azure Machine Learning
* Microsoft Machine Learning Services in SQL 
* Data Science Virtual Machine
* Spark MLLib in HDInsight
* Batch AI Training Service
* Microsoft Cognitive Toolkit 


## Azure Machine Learning
[Azure Machine Learning](../index.md) manages the end to end development of machine learning and AI models in Azure.  [Machine Learning Studio](../studio/what-is-ml-studio.md) is a fully managed service enabling graphical construction of machine learning experiments with serverless training and deployment.  Azure Machine Learning Experimentation Service and Azure Machine Learning Model Management are preview services that manage the creation, deployment, and management of models built using Python and any machine learning framework available for Python. You can use the [Azure Machine Learning Workbench](what-is-ml-workbench.md) to build data preparation jobs, author models using notebooks, and manage the history of your training jobs. 

Use Azure Machine Learning when you want to manage the end to end development.  Azure Machine Learning enables you to use the other services mentioned on this page to scale in the cloud, while providing you with management of the end to end lifecycle from data preparation, model creation, through deployment and monitoring. 

## Microsoft Machine Learning Services in SQL 
[Microsoft Machine Learning Services](https://docs.microsoft.com/en-us/sql/advanced-analytics/r/r-services) enables you to run train and deploy machine learning models using R or Python, on data located on-premises and in SQL Server databases. 

Use Microsoft Machine Learning Services when you need to train or deploy models on-premises, or when you need to train inside of Microsoft SQL Server.  Models built with Machine Learning Services can be deployed using Azure Machine Learning Model Management. 

## Data Science Virtual Machine
The [Data Science Virtual Machine (DSVM)](https://docs.microsoft.com/en-us/azure/machine-learning/machine-learning-data-science-virtual-machine-overview) is a customized VM image on Microsoft’s Azure cloud built specifically for doing data science. It has many popular data science and other tools pre-installed and pre-configured to jump-start building intelligent applications for advanced analytics. It is available on Windows Server and on Linux. We offer Windows edition of DSVM on Server 2016 and Server 2012. We offer Linux edition of the DSVM on Ubuntu 16.04 LTS and on OpenLogic 7.2 CentOS-based Linux distributions. 

Use the Data Science Virtual Machine when you need to run or host your jobs on a single node, or to remotely scale up your processing on a single machine.  The Data Science Virtual Machine is supported as a target for both Azure Machine Learning Experimentation as well as Azure Machine Learning Model Management. 

## Spark MLLib in HDInsight
[Spark MLLib in HDInsight](https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-apache-spark-ipython-notebook-machine-learning) lets you create models as part of Spark jobs that are executing on big data. Spark lets you easily transform and prepare data and then scale out model creation in a single job.  Models created through Spark MLLib can be deployed, managed, and monitored through Azure Machine Learning Model Management, while training runs can be dispatched and managed with Azure Machine Learning Experimentation.  Spark can also be used for scaling out data preparation jobs authored in the Machine Learning Workbench. 

Use Spark when you need to scale out your data processing and create models as part of a data pipeline. You can author Spark jobs in Scala, Java, Python, or R. 

## Batch AI Training 
[Azure Batch AI Training](https://aka.ms/batchaitraining) helps you experiment in parallel with your AI models using any framework and then trains them at scale across clustered GPUs. Describe your job requirements and configuration to run, and we handle the rest. 

Use Batch AI Training when you need to scale out deep learning jobs across clustered GPUs using frameworks such as Cognitive Toolkit, Caffe, Chainer, Tensorflow, and more.  Azure Machine Learning Model Management can be used to take models from Batch AI Training to deploy, manage, and monitor them.  Batch AI Training will be integrated with Azure Machine Learning Experimentation in the future. 

## Microsoft Cognitive Toolkit
The [Microsoft Cognitive Toolkit](https://www.microsoft.com/en-us/cognitive-toolkit/), is a unified deep-learning toolkit that describes neural networks as a series of computational steps via a directed graph. In this directed graph, leaf nodes represent input values or network parameters, while other nodes represent matrix operations upon their inputs. CNTK allows you to easily realize and combine popular model types such as feed-forward DNNs, convolutional nets (CNNs), and recurrent networks (RNNs/LSTMs). It implements stochastic gradient descent (SGD, error backpropagation) learning with automatic differentiation and parallelization across multiple GPUs and servers.

Use the Cognitive Toolkit when you want to build a model using deep learning.  The Cognitive Toolkit can be used in any of the preceding services.


[!INCLUDE [machine-learning-free-trial](../../../includes/machine-learning-free-trial.md)]
