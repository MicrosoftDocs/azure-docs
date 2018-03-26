---
title: What is Azure Machine Learning? | Microsoft Docs
description: Overview of Azure Machine Learning Experimentation and Model Management, an integrated, end-to-end data science solution for professional data scientists to develop, experiment and deploy advanced analytics applications at cloud scale.
services: machine-learning
author: haining
ms.author: haining
manager: mwinkle
ms.reviewer: garyericson, jasonwhowell, mldocs
ms.service: machine-learning
ms.workload: data-services
ms.topic: overview
ms.date: 03/28/2018
---

# Machine learning solutions from Microsoft

In addition to [Azure Machine Learning](overview-what-is-azure-ml.md), there are a variety of options at Microsoft to build, deploy, and manage your machine learning models. 
* SQL Server Machine Learning Services
* Microsoft Machine Learning Server
* Azure Machine Learning Services
* Azure Machine Learning Studio
* Data Science Virtual Machine
* Spark MLLib in HDInsight
* Batch AI Training Service
* Microsoft Cognitive Toolkit
* Microsoft Cognitive Services


### SQL Server Machine Learning Services
[Microsoft Machine Learning Services](https://docs.microsoft.com/sql/advanced-analytics/r/r-services) enables you to run, train, and deploy machine learning models using R or Python. You can use data located on-premises and in SQL Server databases. 

Use Microsoft Machine Learning Services when you need to train or deploy models on-premises, or inside of Microsoft SQL Server. Models built with Machine Learning Services can be deployed using Azure Machine Learning Model Management. 

### Microsoft Machine Learning Server 
[Microsoft Machine Learning Server](https://docs.microsoft.com/sql/advanced-analytics/r/r-server-standalone) is an enterprise server for hosting and managing parallel and distributed workloads of R and Python processes. Microsoft Machine Learning Server runs on Linux, Windows, Hadoop, and Apache Spark. It is also available on [HDInsight](https://azure.microsoft.com/services/hdinsight/r-server/). It provides an execution engine for solutions built using [Microsoft Machine Learning packages](https://docs.microsoft.com/r-server/r/concept-what-is-the-microsoftml-package), and extends open source R and Python with support for the following scenarios:

- high-performance analytics
- statistical analysis
- machine learning
- massively large datasets

Value-added functionality is provided through proprietary packages that install with the server. For development, you can use IDEs such as [R Tools for Visual Studio](https://www.visualstudio.com/vs/rtvs/) and [Python Tools for Visual Studio](https://www.visualstudio.com/vs/python/).

Use Microsoft Machine Learning Server when you need to:

- Build and deploy models built with R and Python on a server
- Distribute R and Python training at scale on a Hadoop or Spark cluster

### Data Science Virtual Machine
The [Data Science Virtual Machine (DSVM)](https://docs.microsoft.com/azure/machine-learning/data-science-virtual-machine/overview) is a customized VM image on Microsoft’s Azure cloud built specifically for doing data science. It has many popular data science and other tools pre-installed and pre-configured to jump-start building intelligent applications for advanced analytics. It is available on Windows Server and on Linux. We offer Windows edition of DSVM on Server 2016 and Server 2012. We offer Linux edition of the DSVM on Ubuntu 16.04 LTS and on OpenLogic 7.2 CentOS-based Linux distributions. 

Use the Data Science Virtual Machine when you need to run or host your jobs on a single node. Or if you need to remotely scale up your processing on a single machine. The Data Science Virtual Machine is supported as a target for both Azure Machine Learning Experimentation and Azure Machine Learning Model Management. 

### Spark MLLib in HDInsight
[Spark MLLib in HDInsight](https://docs.microsoft.com/azure/hdinsight/hdinsight-apache-spark-ipython-notebook-machine-learning) lets you create models as part of Spark jobs that are executing on big data. Spark lets you easily transform and prepare data and then scale out model creation in a single job. Models created through Spark MLLib can be deployed, managed, and monitored through Azure Machine Learning Model Management. Training runs can be dispatched and managed with Azure Machine Learning Experimentation. Spark can also be used to scale out data preparation jobs created in the Machine Learning Workbench. 

Use Spark when you need to scale out your data processing and create models as part of a data pipeline. You can author Spark jobs in Scala, Java, Python, or R. 

### Batch AI Training 
[Azure Batch AI Training](https://aka.ms/batchaitraining) helps you experiment in parallel with your AI models using any framework and then trains them at scale across clustered GPUs. Describe your job requirements and configuration to run, and we handle the rest. 

Batch AI Training enables you to scale out deep learning jobs across clustered GPUs, using frameworks such as:

- Cognitive Toolkit
- Caffe
- Chainer
- TensorFlow

Azure Machine Learning Model Management can be used to take models from Batch AI Training to deploy, manage, and monitor them.  Batch AI Training will be integrated with Azure Machine Learning Experimentation in the future. 

### Microsoft Cognitive Toolkit
The [Microsoft Cognitive Toolkit](https://www.microsoft.com/en-us/cognitive-toolkit/) is a unified deep-learning toolkit that describes neural networks as computational steps in a directed graph. In this directed graph, leaf nodes represent input values or network parameters, while other nodes represent matrix operations upon their inputs. The Cognitive Toolkit allows you to easily realize and combine popular model types such as feed-forward DNNs, convolutional nets (CNNs), and recurrent networks (RNNs/LSTMs). It implements stochastic gradient descent (SGD, error backpropagation) learning with automatic differentiation and parallelization across multiple GPUs and servers.

Use the Cognitive Toolkit when you want to build a model using deep learning.  The Cognitive Toolkit can be used in any of the preceding services.

### Microsoft Cognitive Services
Microsoft Cognitive Services is a set of 30 APIs that enable you build apps that use natural methods of communication. These APIs allow your apps to see, hear, speak, understand, and interpret our needs with just a few lines of code. Easily add intelligent features to your apps, such as: 

- Emotion and sentiment detection
- Vision and speech recognition
- Language understanding
- Knowledge and search

Microsoft Cognitive Services can be used to develop apps across devices and platforms. The APIs keep improving, and are easy to set up. 

[!INCLUDE [machine-learning-free-trial](../../../includes/machine-learning-free-trial.md)]