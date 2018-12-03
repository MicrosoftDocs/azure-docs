---
title: Compare the machine learning product options from Microsoft - Azure | Microsoft Docs
description: Compare the variety of products from Microsoft to build, deploy, and manage your machine learning models. Decide which products to choose for your solution.
services: machine-learning
ms.service: machine-learning
ms.component: core
ms.topic: overview

ms.reviewer: jmartens
author: garyericson
ms.author: garye
ms.date: 09/24/2018
---

# What are the machine learning product options from Microsoft?

Microsoft provides a variety of product options to build, deploy, and manage your machine learning models. Compare these products and choose what you need to develop your machine learning solutions most effectively.

| Machine learning product | What it is | What you can do with it |
|-|-|-|
| In the cloud | | |
| [Azure Machine Learning service](#azure-machine-learning-services) | Managed cloud service for ML  | Train, deploy, and manage models in Azure using Python and CLI |
| [Azure Machine Learning Studio](#azure-machine-learning-studio) | Drag-and-drop visual interface for ML | Build, experiment, and deploy models using preconfigured algorithms |
| [Azure Databricks](#azure-databricks) | Spark-based analytics platform | Build and deploy models and data workflows |
| [Azure Cognitive Services](#azure-cognitive-services) | Azure services with pre-built AI and ML models | Easily add intelligent features to your apps |
| [Azure Data Science Virtual Machine](#azure-data-science-virtual-machine) | Virtual machine with pre-installed data science tools | Develop ML solutions in a pre-configured environment |
| On-premises | | |
| [SQL Server Machine Learning Services](#sql-server-machine-learning-services) | Analytics engine embedded in SQL | Build and deploy models inside SQL Server |
| [Microsoft Machine Learning Server](#microsoft-machine-learning-server) | Standalone enterprise server for predictive analysis | Build and deploy models with R and Python |
| Developer tools | | |
| [ML.NET](#mlnet) | Open-source, cross-platform ML SDK | Develop ML solutions for .NET applications |
| [Windows ML](#windows-ml) | Windows 10 ML platform | Evaluate trained models on a Windows 10 device |

## Azure Machine Learning service

[Azure Machine Learning service](overview-what-is-azure-ml.md) (preview) is a fully managed cloud service used to train, deploy, and manage ML models at scale. It fully supports open-source technologies, so you can use tens of thousands of open-source Python packages such as TensorFlow, PyTorch, and scikit-learn. Rich tools are also available, such as [Azure notebooks](https://notebooks.azure.com/), [Jupyter notebooks](http://jupyter.org), or the [Visual Studio Code Tools for AI](https://visualstudio.microsoft.com/downloads/ai-tools-vscode/) to make it easy to explore and transform data, and then train and deploy models. Azure Machine Learning service includes features that automate model generation and tuning with ease, efficiency, and accuracy.

Use Azure Machine Learning service to train, deploy, and manage ML models using Python and CLI at cloud scale.

>[!Note]
> You can try Azure Machine Learning for free. No credit card or Azure subscription is required. Get started now. https://azure.microsoft.com/free/

## Azure Machine Learning Studio

[Azure Machine Learning Studio](../studio/what-is-ml-studio.md) gives you an interactive, visual workspace that you can use to easily and quickly build, test, and deploy models using pre-built machine learning algorithms. Machine Learning Studio publishes models as web services that can easily be consumed by custom apps or BI tools such as Excel.
No programming is required - you construct your machine learning model by connecting datasets and analysis modules on an interactive canvas, and then deploy it with a couple clicks.

Use Machine Learning Studio when you want to develop and deploy models with no code required.

[!INCLUDE [machine-learning-free-trial](../../../includes/machine-learning-free-trial.md)]

## Azure Databricks

[Azure Databricks](/azure/azure-databricks/what-is-azure-databricks) is an Apache Spark-based analytics platform optimized for the Microsoft Azure cloud services platform. Databricks is integrated with Azure to provide one-click setup, streamlined workflows, and an interactive workspace that enables collaboration between data scientists, data engineers, and business analysts.
Use Python, R, Scala, and SQL code in web-based notebooks to query, visualize, and model data.

Use Databricks when you want to collaborate on building machine learning solutions on Apache Spark.

## Azure Cognitive Services

[Azure Cognitive Services](/azure/cognitive-services/welcome) is a set of APIs that enable you to build apps that use natural methods of communication. These APIs allow your apps to see, hear, speak, understand, and interpret user needs with just a few lines of code. Easily add intelligent features to your apps, such as: 

- Emotion and sentiment detection
- Vision and speech recognition
- Language understanding (LUIS)
- Knowledge and search

Use Cognitive Services to develop apps across devices and platforms. The APIs keep improving, and are easy to set up.

## Azure Data Science Virtual Machine

The [Azure Data Science Virtual Machine](../data-science-virtual-machine/overview.md) is a customized virtual machine environment on the Microsoft Azure cloud built specifically for doing data science. It has many popular data science and other tools pre-installed and pre-configured to jump-start building intelligent applications for advanced analytics.
The Data Science Virtual Machine is available in versions for both Windows and Linux Ubuntu (Azure Machine Learning service is not supported on Linux CentOS).
For specific version information and a list of what’s included, see [Introduction to the Azure Data Science Virtual Machine](../data-science-virtual-machine/overview.md).
The Data Science Virtual Machine is supported as a target for Azure Machine Learning service.

Use the Data Science VM when you need to run or host your jobs on a single node. Or if you need to remotely scale up your processing on a single machine.

## SQL Server Machine Learning Services

[SQL Server Microsoft Machine Learning Service](https://docs.microsoft.com/sql/advanced-analytics/r/r-services) adds statistical analysis, data visualization, and predictive analytics in R and Python for relational data in SQL Server databases. R and Python libraries from Microsoft include advanced modeling and ML algorithms, which can run in parallel and at scale, in SQL Server.

Use SQL Server Machine Learning Services when you need built-in AI and predictive analytics on relational data in SQL Server.

## Microsoft Machine Learning Server

[Microsoft Machine Learning Server](https://docs.microsoft.com/machine-learning-server/what-is-machine-learning-server) is an enterprise server for hosting and managing parallel and distributed workloads of R and Python processes. Microsoft Machine Learning Server runs on Linux, Windows, Hadoop, and Apache Spark, and it is also available on [HDInsight](https://azure.microsoft.com/services/hdinsight/r-server/). It provides an execution engine for solutions built using [RevoScaleR](https://docs.microsoft.com/machine-learning-server/r-reference/revoscaler/revoscaler), [revoscalepy](https://docs.microsoft.com/machine-learning-server/python-reference/revoscalepy/revoscalepy-package), and  [MicrosoftML packages](https://docs.microsoft.com/r-server/r/concept-what-is-the-microsoftml-package), and extends open-source R and Python with support for high-performance analytics, statistical analysis, machine learning, and massively large datasets. This functionality is provided through proprietary packages that install with the server. For development, you can use IDEs such as [R Tools for Visual Studio](https://www.visualstudio.com/vs/rtvs/) and [Python Tools for Visual Studio](https://www.visualstudio.com/vs/python/).

Use Microsoft Machine Learning Server when you need to build and operationalize models built with R and Python on a server, or distribute R and Python training at scale on a Hadoop or Spark cluster.

## ML.NET

[ML.NET](https://docs.microsoft.com/dotnet/machine-learning/) is a free, open-source, and cross-platform machine learning framework that enables you to build custom machine learning solutions and integrate them into your .NET applications.

Use ML.NET when you want to integrate machine learning solutions into your .NET applications.

## Windows ML

[Windows ML](https://docs.microsoft.com/windows/uwp/machine-learning/) allows you to use trained machine learning models in your applications, evaluating trained models locally on Windows 10 devices.

Use Windows ML when you want to use trained machine learning models within your Windows applications.

## Next steps

- To learn about all the Articifical Intelligence (AI) development products available from Microsoft, see [Microsoft AI platform](https://www.microsoft.com/ai)
- For training in how to develop AI solutions, see [Microsoft AI School](https://aischool.microsoft.com/learning-paths)
