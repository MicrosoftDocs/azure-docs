---
title: Machine learning products and services from Microsoft - Azure | Microsoft Docs
description: Microsoft provides a variety of products and services to build, deploy, and manage your machine learning models. 
services: machine-learning
author: haining
ms.author: haining
manager: cgronlun
ms.reviewer: garyericson, mldocs
ms.service: machine-learning
ms.component: core
ms.workload: data-services
ms.topic: overview
ms.date: 08/10/2018
---

# Machine learning products and services from Microsoft

Microsoft provides a variety of products and services to build, deploy, and manage your machine learning models. Choose the product or service you need to develop your machine learning solutions most effectively.

<!--
| Use this option...                                                            | if you want to do this... |
| ----------------------------------------------------------------------------- | ---------------- |
| [Azure Machine Learning service](#azure-machine-learning-services) | build and deploy models in the cloud using Python and CLI |
| [Azure Machine Learning Studio](#azure-machine-learning-studio)               | build and deploy models using a drag-and-drop visual interface |
| [SQL Server Machine Learning Services](#sql-server-machine-learning-services) | build and deploy models on-premises or inside SQL Server  |
| [Microsoft Machine Learning Server](#microsoft-machine-learning-server)       | build and deploy R and Python models on an enterprise server |
| | |
| [Spark MLLib in HDInsight](#spark-mllib-in-hdinsight)                         | create models as part of Spark jobs executing on big data |
| [Microsoft Cognitive Toolkit (CNTK)](#microsoft-cognitive-toolkit-cntk)       | develop models using deep learning algorithms             |
| | |
| [Azure Data Science Virtual Machine](#azure-data-science-virtual-machine)     | use a customized virtual machine with pre-installed data science tools |
| | |
| [Azure Cognitive Services](#azure-cognitive-services)                         | use pre-built machine learning models in applications     |
| | |
-->

<!-- Trying a different kind of table
| | | | | | | |
|-|-|-|-|-|-|-|
| Environment | Interactive Experimentation | Data visualization | Collaboration (sharing) | Pre-configured | Control over environment | Development tools |
| Azure Notebooks | ✓ | ✓ | ✓ | ✓ | Low |
| Jupyter Notebooks (local or on a VM) | ✓ | ✓ |   |   | High |
| Data Science Virtual Machine (includes Jupyter Notebooks) | ✓ | ✓ |   | ✓ | High |
| Visual Studio Code & other IDEs |   |   |   |   | High | ✓ |
-->

<!--
| Microsoft machine learning product/service | What it is | What you do with it |
-->
| | | |
|-|-|-|
| [Azure Machine Learning service](#azure-machine-learning-services) | Managed machine learning cloud service | Build, experiment, and deploy models in the cloud using Python and CLI |
| [Azure Machine Learning Studio](#azure-machine-learning-studio) | Drag-and-drop visual interface for machine learning | Build, experiment, and deploy models using preconfigured algorithms |
| [SQL Server Machine Learning Services](#sql-server-machine-learning-services) | Analytics engine embedded in SQL | Build and deploy models on-premises or inside SQL Server |
| [Microsoft Machine Learning Server](#microsoft-machine-learning-server) | Standalone enterprise server for machine learning | Build and deploy models with R and Python |
| [Azure Databricks](#azure-databricks) | Spark-based analytics platform | Build and deploy models and data workflows |
| | | |
| [ML.NET](#ml-net) | Open-source, cross-platform machine learning SDK | Develop machine learning solutions for .NET applications |
| [Windows ML](#windows-ml) | Windows 10 machine learning platform | Evaluate trained models on a Windows 10 device |
| | | |
| [Azure Data Science Virtual Machine](#azure-data-science-virtual-machine) | Virtual machine with pre-installed data science tools | Develop machine learning solutions in a pre-configured environment |
| | | |
| [Azure Cognitive Services](#azure-cognitive-services) | Azure services with pre-built machine learning models | Easily add intelligent features to your apps |

## Azure Machine Learning service

[Azure Machine Learning service](overview-what-is-azure-ml.md) is a fully managed cloud service that you can use to build, train, deploy, and manage machine learning models at cloud scale.
It fully supports open-source technologies, so you can use tens of thousands of open-source Python packages.
Rich tools are also available, such as [Jupyter notebooks](http://jupyter.org) or the [Visual Studio Code Tools for AI](https://visualstudio.microsoft.com/downloads/ai-tools-vscode/) that make it easy to interactively explore data, transform it, and then develop, test, and deploy models.

Use Azure Machine Learning service when you want to develop, deploy, and manage models using Python and CLI at cloud scale.

## Azure Machine Learning Studio

[Microsoft Azure Machine Learning Studio](../studio/what-is-ml-studio.md) gives you an interactive, visual workspace that you can use to easily and quickly build, test, and deploy models using pre-built machine learning algorithms. Machine Learning Studio publishes models as web services that can easily be consumed by custom apps or BI tools such as Excel. There's no programming required, just visually connecting datasets and modules to construct your machine learning model and deploy it.

Use Machine Learning Studio when you want to develop and deploy models with no code required. With only a browser, you can sign in, upload data, and immediately start machine learning experiments. Drag-and-drop predictive modeling, a large pallet of modules, and a library of starting templates make common machine learning tasks simple and quick.

## SQL Server Machine Learning service

[SQL Server Microsoft Machine Learning service](https://docs.microsoft.com/sql/advanced-analytics/r/r-services) enables you to run, train, and deploy machine learning models using R or Python. You can use data located on-premises and in SQL Server databases.

Use Microsoft Machine Learning service when you need to train or deploy models on-premises, or inside of Microsoft SQL Server. Models built with Machine Learning service can be deployed and managed using Azure Machine Learning service. 

## Microsoft Machine Learning Server

[Microsoft Machine Learning Server](https://docs.microsoft.com/machine-learning-server/what-is-machine-learning-server) is an enterprise server for hosting and managing parallel and distributed workloads of R and Python processes. Microsoft Machine Learning Server runs on Linux, Windows, Hadoop, and Apache Spark. It is also available on [HDInsight](https://azure.microsoft.com/services/hdinsight/r-server/). It provides an execution engine for solutions built using [MicrosoftML packages](https://docs.microsoft.com/r-server/r/concept-what-is-the-microsoftml-package), and extends open-source R and Python with support for the following scenarios:

- High-performance analytics
- Statistical analysis
- Machine learning
- Massively large datasets

Additional functionality is provided through proprietary packages that install with the server. For development, you can use IDEs such as [R Tools for Visual Studio](https://www.visualstudio.com/vs/rtvs/) and [Python Tools for Visual Studio](https://www.visualstudio.com/vs/python/).

Use Microsoft Machine Learning Server when you need to:

- Build and deploy models built with R and Python on a server
- Distribute R and Python training at scale on a Hadoop or Spark cluster

## Azure Databricks

[Azure Databricks](/articles/azure-databricks/what-is-azure-databricks.md)  is an Apache Spark-based analytics platform optimized for the Microsoft Azure cloud services platform. Databricks is integrated with Azure to provide one-click setup, streamlined workflows, and an interactive workspace that enables collaboration between data scientists, data engineers, and business analysts.

Use Databricks when you want to collaborate on building machine learning solutions on Apache Spark.

## ML.NET

[ML.NET](https://docs.microsoft.com/dotnet/machine-learning/) is a free, open-source, and cross-platform machine learning framework that enables you to build custom machine learning solutions and integrate them into your .NET applications.

Use ML.NET when you want to integrate machine learning solutions into your .NET applications.

## Windows ML

[Windows ML](https://docs.microsoft.com/windows/uwp/machine-learning/) allows you to use trained machine learning models in your applications, evaluating trained models locally on Windows 10 devices.

Use Windows ML when you want to use machine learning within your Windows applications.

## Azure Data Science Virtual Machine

The [Azure Data Science Virtual Machine](../data-science-virtual-machine/overview.md) is a customized virtual machine environment on the Microsoft Azure cloud built specifically for doing data science. It has many popular data science and other tools pre-installed and pre-configured to jump-start building intelligent applications for advanced analytics.

The Data Science Virtual Machine is available in both Windows and Linux versions. For specific version information and a list of what’s included, see [Introduction to the Azure Data Science Virtual Machine](../data-science-virtual-machine/overview.md).

Use the Data Science VM when you need to run or host your jobs on a single node. Or if you need to remotely scale up your processing on a single machine. The Data Science Virtual Machine is supported as a target for Azure Machine Learning service.

## Azure Cognitive Services

[Azure Cognitive Services](/articles/cognitive-services/welcome.md) is a set of about 30 APIs that enable you to build apps that use natural methods of communication. These APIs allow your apps to see, hear, speak, understand, and interpret user needs with just a few lines of code. Easily add intelligent features to your apps, such as: 

- Emotion and sentiment detection
- Vision and speech recognition
- Language understanding (LUIS)
- Knowledge and search

Cognitive Services can be used to develop apps across devices and platforms. The APIs keep improving, and are easy to set up. 

## Next steps

- Read the overview for [Azure Machine Learning](overview-what-is-azure-ml.md)

[!INCLUDE [machine-learning-free-trial](../../../includes/machine-learning-free-trial.md)]
