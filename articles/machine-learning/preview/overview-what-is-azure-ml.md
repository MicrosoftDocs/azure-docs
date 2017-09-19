---
title: What is Azure Machine Learning? | Microsoft Docs
description: Overview of Azure Machine Learning Experimentation and Model Management, an integrated, end-to-end data science solution for professional data scientists to develop, experiment and deploy advanced analytics applications at cloud scale.
services: machine-learning
documentationcenter: ''
author: haining
manager: mwinkle
editor: garyericson

ms.service: machine-learning
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 09/15/2017
ms.author: haining

---
# What is Azure Machine Learning

Azure Machine Learning is an integrated, end-to-end data science and advanced analytics solution. It enables data scientists to prepare data, develop experiments and deploy models at cloud scale.

The main components of Azure Machine Learning are:
- Azure Machine Learning Workbench
- Azure Machine Learning Experimentation Service
- Azure Machine Learning Model Management Service
- Microsoft Machine Learning Libraries for Apache Spark (MMLSpark Library)
- Visual Studio Code Tools for AI

Together, these applications and services help significantly accelerate your data science project development and deployment. 

![Azure Machine Learning Concepts](media/overview-what-is-azure-ml/aml-concepts.png)

## Open source compatible

Azure Machine Learning fully supports open source technologies. You can use tens of thousands of open source Python packages, such as the following machine learning frameworks:

- [scikit-learn](http://scikit-learn.org/)
- [TensorFlow](https://www.tensorflow.org/)
- [Microsoft Cognitive Toolkit](https://www.microsoft.com/en-us/cognitive-toolkit/)
- [Spark ML](https://spark.apache.org/docs/2.1.1/ml-pipeline.html)

You can execute your experiments in managed environments such as Docker containers and Spark clusters. You can also use advanced hardware such as [GPU-enabled virtual machines in Azure](https://docs.microsoft.com/en-us/azure/virtual-machines/windows/sizes-gpu) to accelerate your execution.

Azure Machine Learning built on top of the following open source technologies:

- [Jupyter Notebook](http://jupyter.org/)
- [Apache Spark](https://spark.apache.org/)
- [Docker](https://www.docker.com/)
- [Kubernetes](https://kubernetes.io/)
- [Python](https://www.python.org/)
- [Conda](https://conda.io/docs/)

It also includes Microsoft's own open source technologies, such as [Microsoft Machine Learning Library for Apache Spark](https://github.com/Azure/mmlspark) and Cognitive Toolkit.

In addition, you also benefit from some of the most advanced, tried-and-true machine learning technologies developed by Microsoft that are designed to solve on large-scale problems. They are battle-tested in many Microsoft products, such as:

- Windows
- Bing
- Xbox
- Office
- SQL Server

The following are some of the Microsoft machine learning technologies included with Azure Machine Learning:

- [PROSE](https://microsoft.github.io/prose/) (PROgram Synthesis using Examples)
- [microsoftml](https://docs.microsoft.com/r-server/r/concept-what-is-the-microsoftml-package)
- [revoscalepy](https://docs.microsoft.com/r-server/python-reference/revoscalepy/revoscalepy-package)

## Azure Machine Learning Workbench
Azure Machine Learning Workbench is a desktop application plus command-line tools, supported on both Windows and macOS. It allows you to manage machine learning solutions through the entire data science life cycle:

- Data ingestion and preparation
- Model development and experiment management
- Model deployment in various target environments

Here are the core functionalities offered by Azure Machine Learning Workbench:

- Data preparation tool that can learn data transformation logic by example.
- Data source abstraction accessible through UX and Python code.
- Python SDK for invoking visually constructed data preparation packages.
- Built-in Jupyter Notebook service and client UX.
- Experiment monitoring and management through run history views.
- Role-based access control that enables sharing and collaboration through Azure Active Directory.
- Automatic project snapshots for each run, and explicit version control enabled by native Git integration. 
- Integration with popular Python IDEs.

For more information, reference the following articles:
- [Data Preparation User Guide](data-prep-user-guide.md)
- [Using Git with Azure Machine Learning](using-git-ml-project.md)
- [Using Jupyter Notebook in Azure Machine Learning](how-to-use-jupyter-notebooks.md)
- Roaming and Sharing
- [Run History Guide](how-to-use-run-history-model-metrics.md)
- [IDE Integration](how-to-configure-your-IDE.md)

## Azure Machine Learning Experimentation Service
The Experimentation Service handles the execution of machine learning experiments. It also supports the Workbench by providing project management, Git integration, access control, roaming, and sharing. 

Through easy configuration, you can execute your experiments across a range of compute environment options:

- Local native
- Local Docker container
- Docker container on a remote VM
- scale out Spark cluster in Azure

The Experimentation Service constructs virtual environments to ensure that your script can be executed in isolation with reproducible results. It records run history information and presents the history to you visually. You can easily select the best model out of your experiment runs. 

For more information, please reference [Experimentation Execution Configuration](experiment-execution-configuration.md).

## Azure Machine Learning Model Management Service

Model Management Service allows data scientists and dev-ops teams to deploy predictive models into a wide variety of environments. Model versions and lineage are tracked from training runs to deployments. Models are stored, registered, and managed in the cloud. 

Using simple CLI commands, you can containerize your model, scoring scripts and dependencies into Docker images. These images are registered in your own Docker registry hosted in Azure (Azure Container Registry). They can be reliably deployed to the following targets:

- Local machines
- On-premises servers
- The cloud
- IoT edge devices

Kubernetes running in the Azure Container Service (ACS) are used for cloud scale-out deployment. Model execution telemetry is captured in AppInsights for visual analysis. 

For more information on Model Management Service, reference [Model Management Overview](model-management-overview.md)


## Microsoft Machine Learning Library for Apache Spark

The [MMLSpark](https://github.com/Azure/mmlspark)(Microsoft Machine Learning Library for Apache Spark) is an open-source Spark package that provides deep learning and data science tools for Apache Spark. It integrates [Spark Machine Learning Pipelines](https://spark.apache.org/docs/2.1.1/ml-pipeline.html) with the [Microsoft Cognitive Toolkit](https://www.microsoft.com/en-us/cognitive-toolkit/) and [OpenCV](http://opencv.org/) library. It enables you to quickly create powerful, highly scalable predictive, and analytical models for large image and text datasets. Some highlights include:

- Easily ingest images from HDFS into Spark DataFrame
- Pre-process image data using transforms from OpenCV
- Featurize images using pre-trained deep neural nets using the Microsoft Cognitive Toolkit 
- Use pre-trained bidirectional LSTMs from Keras for medical entity extraction
- Train DNN-based image classification models on N-Series GPU VMs on Azure
- Featurize free-form text data using convenient APIs on top of primitives in SparkML via a single transformer
- Train classification and regression models easily via implicit featurization of data
- Compute a rich set of evaluation metrics including per-instance metrics

 For more information, reference [Using MMLSpark in Azure Machine Learning](how-to-use-mmlspark.md).


## Visual Studio Code Tools for AI
Visual Studio Code Tools for AI is an extension in VS Code to build, test, and deploy Deep Learning and AI solutions. It features many integration points with Azure Machine Learning, including:
- A run history view displaying the performance of training runs and logged metrics.
- A gallery view allowing users to browse and bootstrap new projects with the Microsoft Cognitive Toolkit, TensorFlow, and many other deep-learning frameworks. 
- An explorer view for selecting compute targets for your scripts to execute.
 

## What are the machine learning options from Microsoft?
Besides Azure Machine Learning, there are also a wide variety of options in Azure to build, deploy, and manage machine learning models. 
<!--* Azure Machine Learning-->
* Microsoft Machine Learning Services in SQL
* Microsoft Machine Learning Server
* Data Science Virtual Machine
* Spark MLLib in HDInsight
* Batch AI Training Service
* Microsoft Cognitive Toolkit
* Microsoft Cognitive Services


### Microsoft Machine Learning Services in SQL 
[Microsoft Machine Learning Services](https://docs.microsoft.com/en-us/sql/advanced-analytics/r/r-services) enables you to run, train, and deploy machine learning models using R or Python. You can use data located on-premises and in SQL Server databases. 

Use Microsoft Machine Learning Services when you need to train or deploy models on-premises, or inside of Microsoft SQL Server. Models built with Machine Learning Services can be deployed using Azure Machine Learning Model Management. 

### Microsoft Machine Learning Server 
[Microsoft Machine Learning Server](https://docs.microsoft.com/en-us/sql/advanced-analytics/r/r-server-standalone) is an enterprise server for hosting and managing parallel and distributed workloads of R and Python processes. Microsoft Machine Learning Server runs on Linux, Windows, Hadoop, and Apache Spark. It is also available on [HDInsight](https://azure.microsoft.com/en-us/services/hdinsight/r-server/). It provides an execution engine for solutions built using [Microsoft Machine Learning packages](https://docs.microsoft.com/en-us/r-server/r/concept-what-is-the-microsoftml-package), and extends open source R and Python with support for the following scenarios:

- high-performance analytics
- statistical analysis
- machine learning
- massively large datasets

Value-added functionality is provided through proprietary packages that install with the server. For development, you can use IDEs such as [R Tools for Visual Studio](https://www.visualstudio.com/vs/rtvs/) and [Python Tools for Visual Studio](https://www.visualstudio.com/vs/python/).

Use Microsoft Machine Learning Server when you need to:

- Build and deploy models built with R and Python on a server
- Distribute R and Python training at scale on a Hadoop or Spark cluster

### Data Science Virtual Machine
The [Data Science Virtual Machine (DSVM)](https://docs.microsoft.com/en-us/azure/machine-learning/machine-learning-data-science-virtual-machine-overview) is a customized VM image on Microsoft’s Azure cloud built specifically for doing data science. It has many popular data science and other tools pre-installed and pre-configured to jump-start building intelligent applications for advanced analytics. It is available on Windows Server and on Linux. We offer Windows edition of DSVM on Server 2016 and Server 2012. We offer Linux edition of the DSVM on Ubuntu 16.04 LTS and on OpenLogic 7.2 CentOS-based Linux distributions. 

Use the Data Science Virtual Machine when you need to run or host your jobs on a single node. Or if you need to remotely scale up your processing on a single machine. The Data Science Virtual Machine is supported as a target for both Azure Machine Learning Experimentation and Azure Machine Learning Model Management. 

### Spark MLLib in HDInsight
[Spark MLLib in HDInsight](https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-apache-spark-ipython-notebook-machine-learning) lets you create models as part of Spark jobs that are executing on big data. Spark lets you easily transform and prepare data and then scale out model creation in a single job. Models created through Spark MLLib can be deployed, managed, and monitored through Azure Machine Learning Model Management. Training runs can be dispatched and managed with Azure Machine Learning Experimentation. Spark can also be used to scale out data preparation jobs created in the Machine Learning Workbench. 

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
[Microsoft Cognitive Services is a set of 30 APIs that enable you build apps that use natural methods of communication. These APIs allow your apps to see, hear, speak, understand, and interpret our needs with just a few lines of code. Easily add intelligent features to your apps, such as: 

- Emotion and sentiment detection
- Vision and speech recognition
- Language understanding
- Knowledge and search

Microsoft Cognitive Services can be to develop apps across devices and platforms. The APIs keep improving, and are easy to set up. 

[!INCLUDE [machine-learning-free-trial](../../../includes/machine-learning-free-trial.md)]

## Next Steps
- [Provision and install Azure Machine Learning](quick-start-installation.md)
- [Take a quick tour around Azure Machine Learning](quick-start-iris.md)