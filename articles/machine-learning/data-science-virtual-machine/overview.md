---
title: Introduction to Azure Data Science Virtual Machine for Linux and Windows | Microsoft Docs
description: Key analytics scenarios and components for Windows and Linux Data Science Virtual Machines.
keywords: data science tools, data science virtual machine, tools for data science, linux data science
services: machine-learning
documentationcenter: ''
author: gopitk
manager: cgronlun

ms.assetid: d4f91270-dbd2-4290-ab2b-b7bfad0b2703
ms.service: machine-learning
ms.subservice: data-science-vm
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: overview
ms.date: 02/22/2019
ms.author: gokuma

---

# Introduction to Azure Data Science Virtual Machine for Linux and Windows

The Data Science Virtual Machine (DSVM) is a customized VM image on Microsoft’s Azure cloud built specifically for doing data science. It has many popular data science and other tools pre-installed and pre-configured to jump-start building intelligent applications for advanced analytics. It is available on Windows Server and Linux. We offer Windows edition of DSVM on Server 2016 and Server 2012. We offer Linux editions of the DSVM on Ubuntu 16.04 LTS and CentOS 7.4.

This article discusses what you can do with the Data Science VM. It outlines some of the key scenarios for using the VM and itemizes the key features available on the Windows and Linux versions. The article also provides instructions on how to get started using them.


## What can I do with the Data Science Virtual Machine?
The goal of the Data Science Virtual Machine (DSVM) is to provide data professionals of all skill levels and across industries with a friction-free, pre-configured, and fully-integrated data science environment. Instead of rolling out a comparable workspace on your own, you can provision a DSVM - saving you days or even _weeks_ on the installation, configuration, and package management processes. After your DSVM has been allocated, you can immediately begin working on your data science project.

The Data Science VM is designed and configured for working with a broad range of usage scenarios. You can scale your environment up or down as your project requirements change. You can also use your preferred language to program data science tasks and install other tools to customize the system for your exact needs.

## Key Scenarios
This section suggests some key scenarios for which the Data Science VM can be deployed.

### Preconfigured analytics desktop in the cloud
The Data Science VM provides a baseline configuration for data science teams looking to replace their local desktops with a managed cloud desktop. This baseline ensures that all the data scientists on a team have a consistent setup with which to verify experiments and promote collaboration. It also lowers costs by reducing the sysadmin burden. This burden reduction saves on time needed to evaluate, install, and maintain the various software packages needed to do advanced analytics.

### Data science training and education
Enterprise trainers and educators that teach data science classes usually provide a virtual machine image. They provide the image to ensure that their students have a consistent setup and that the samples work predictably. The Data Science VM creates an on-demand environment with a consistent setup that eases the support and incompatibility challenges. Cases where these environments need to be built frequently, especially for shorter training classes, benefit substantially.

### On-demand elastic capacity for large-scale projects
Data science hackathons/competitions or large-scale data modeling and exploration require scaled out hardware capacity, typically for short duration. The Data Science VM can help replicate the data science environment quickly on demand, on scaled out servers that allow experiments that  high-powered computing resources to be run.

### Custom compute power for Azure Notebooks

[Azure Notebooks](/azure/notebooks/azure-notebooks-overview) is a free hosted service to develop, run, and share Jupyter notebooks in the cloud with no installation. The free service  tier, however,  is limited to 4GB of memory and 1GB of data. To release all limits, you can then attach a Notebooks project to a Data Science VM or any other VM running Jupyter server. If you sign into Azure Notebooks with an account using Azure Active Directory (such as a corporate account), Notebooks automatically shows Data Science VMs in any subscriptions associated with that account. For more information, see [Manage and configure projects - Compute tier](/azure/notebooks/configure-manage-azure-notebooks-projects#compute-tier).

### Short-term experimentation and evaluation
The Data Science VM can be used to evaluate or learn tools such as Microsoft ML Server, SQL Server, Visual Studio tools, Jupyter, deep learning / ML toolkits, and new tools popular in the community with minimal setup effort. Since the Data Science VM can be set up quickly, it can be applied in other short-term usage scenarios. These scenarios include replicating published experiments, executing demos, following walkthroughs in online sessions and conference tutorials.

### Deep learning
The data science VM can be used for training models using deep learning algorithms on GPU (Graphics processing units) based hardware. Utilizing VM scaling capabilities of Azure cloud, DSVM helps you use GPU-based hardware on the cloud as per need. One can switch to a GPU-based VM when training large models or need high-speed computations while keeping the same OS disk.  The Windows Server 2016 edition of DSVM comes pre-installed with GPU drivers, frameworks, and GPU versions of deep learning frameworks. On the Linux edition, deep learning on GPU is enabled on both the CentOS and Ubuntu DSVMs. You can deploy the Ubuntu, CentOS, or Windows 2016 edition of Data Science VM to a non GPU-based Azure virtual machine. In this case, all the deep learning frameworks will fall back to the CPU mode.

## What's included in the Data Science VM?
The Data Science Virtual Machine has many popular data science and deep learning tools already installed and configured. It also includes tools that make it easy to work with various Azure data and analytics products such as, Microsoft ML Server (R, Python) for building predictive models or SQL Server 2017 for large-scale data set exploration. The Data Science VM includes a host of other tools from the open-source community and from Microsoft, as well as sample code and notebooks. The following table itemizes and compares the main components included in the Windows and Linux editions of the Data Science Virtual Machine.


| **Tool**                                                           | **Windows Edition** | **Linux Edition** |
| :------------------------------------------------------------------ |:-------------------:|:------------------:|
| [Microsoft R Open](https://mran.microsoft.com/open/) with popular packages pre-installed   |Y                      | Y             |
| [Microsoft ML Server (R, Python)](https://docs.microsoft.com/machine-learning-server/) Developer Edition includes, <br />  &nbsp;&nbsp;&nbsp;&nbsp;* [RevoScaleR/revoscalepy](https://docs.microsoft.com/machine-learning-server/r/concept-what-is-revoscaler) parallel and distributed high-performance framework (R & Python)<br />  &nbsp;&nbsp;&nbsp;&nbsp;* [MicrosoftML](https://docs.microsoft.com/machine-learning-server/r/concept-what-is-the-microsoftml-package) - New state-of-the-art ML algorithms from Microsoft <br />  &nbsp;&nbsp;&nbsp;&nbsp;* [R and Python Operationalization](https://docs.microsoft.com/machine-learning-server/what-is-operationalization)                                            |Y                      | Y |
| [Microsoft Office](https://products.office.com/en-us/business/office-365-proplus-business-software) Pro-Plus with shared activation - Excel, Word, and PowerPoint   |Y                      |N              |
| [Anaconda Python](https://www.continuum.io/) 2.7, 3.5 with popular packages pre-installed    |Y                      |Y              |
| [JuliaPro](https://juliacomputing.com/products/juliapro.html) with popular packages for Julia language pre-installed                         |Y                      |Y              |
| Relational Databases                                                            | [SQL Server 2017](https://www.microsoft.com/sql-server/sql-server-2017) <br/> Developer Edition| [PostgreSQL](https://www.postgresql.org/) (CentOS),<br/>[SQL Server 2017](https://www.microsoft.com/sql-server/sql-server-2017) <br/> Developer Edition (Ubuntu) |
| Database tools                                                       | * SQL Server Management Studio <br/>* SQL Server Integration Services<br/>* [bcp, sqlcmd](https://docs.microsoft.com/sql/tools/command-prompt-utility-reference-database-engine)<br /> * ODBC/JDBC drivers| * [SQuirreL SQL](http://squirrel-sql.sourceforge.net/) (querying tool), <br /> * bcp, sqlcmd <br /> * ODBC/JDBC drivers|
| Scalable in-database analytics with SQL Server ML services (R, Python) | Y     |N              |
| **[Jupyter Notebook Server](https://jupyter.org/) with following kernels,**                                  | Y     | Y |
|     &nbsp;&nbsp;&nbsp;&nbsp;* R | Y | Y |
|     &nbsp;&nbsp;&nbsp;&nbsp;* Python | Y | Y |
|     &nbsp;&nbsp;&nbsp;&nbsp;* Julia | Y | Y |
|     &nbsp;&nbsp;&nbsp;&nbsp;* PySpark | Y | Y |
|     &nbsp;&nbsp;&nbsp;&nbsp;* [Sparkmagic](https://github.com/jupyter-incubator/sparkmagic) | N | Y (Ubuntu only) |
|     &nbsp;&nbsp;&nbsp;&nbsp;* SparkR     | N | Y |
| JupyterHub (Multi-user notebook server)| N | Y |
| JupyterLab (Multi-user notebook server) | N | Y (Ubuntu only) |
| **Development tools, IDEs, and Code editors**| | |
| &nbsp;&nbsp;&nbsp;&nbsp;* [Visual Studio 2019 (Community Edition)](https://www.visualstudio.com/community/) with Git Plugin, Azure HDInsight (Hadoop), Data Lake, SQL Server Data tools, [Node.js](https://github.com/Microsoft/nodejstools), [Python](https://aka.ms/ptvs), and [R Tools for Visual Studio (RTVS)](https://microsoft.github.io/RTVS-docs/) | Y | N |
| &nbsp;&nbsp;&nbsp;&nbsp;* [Visual Studio Code](https://code.visualstudio.com/) | Y | Y |
| &nbsp;&nbsp;&nbsp;&nbsp;* [RStudio Desktop](https://www.rstudio.com/products/rstudio/#Desktop) | Y | Y |
| &nbsp;&nbsp;&nbsp;&nbsp;* [RStudio Server](https://www.rstudio.com/products/rstudio/#Server) | N | Y |
| &nbsp;&nbsp;&nbsp;&nbsp;* [PyCharm Community Edition](https://www.jetbrains.com/pycharm/) | N | Y |
| &nbsp;&nbsp;&nbsp;&nbsp;* [Atom](https://atom.io/) | N | Y |
| &nbsp;&nbsp;&nbsp;&nbsp;* [Juno (Julia IDE)](https://junolab.org/)| Y | Y |
| &nbsp;&nbsp;&nbsp;&nbsp;* Vim and Emacs | Y | Y |
| &nbsp;&nbsp;&nbsp;&nbsp;* Git and GitBash | Y | Y |
| &nbsp;&nbsp;&nbsp;&nbsp;* OpenJDK | Y | Y |
| &nbsp;&nbsp;&nbsp;&nbsp;* .NET Framework | Y | N |
| Power BI Desktop | Y | N |
| SDKs to access Azure and Cortana Intelligence Suite of services | Y | Y |
| **Data Movement and management Tools** | | |
| &nbsp;&nbsp;&nbsp;&nbsp;* Azure Storage Explorer | Y | Y |
| &nbsp;&nbsp;&nbsp;&nbsp;* [Azure CLI](https://docs.microsoft.com/cli/azure) | Y | Y |
| &nbsp;&nbsp;&nbsp;&nbsp;* Azure Powershell | Y | N |
| &nbsp;&nbsp;&nbsp;&nbsp;* [Azcopy](https://docs.microsoft.com/azure/storage/storage-use-azcopy) | Y | N |
| &nbsp;&nbsp;&nbsp;&nbsp;* [Blob FUSE driver](https://github.com/Azure/azure-storage-fuse) | N | Y |
| &nbsp;&nbsp;&nbsp;&nbsp;* [Adlcopy(Azure Data Lake Storage)](https://docs.microsoft.com/azure/data-lake-store/data-lake-store-copy-data-azure-storage-blob) | Y | N |
| &nbsp;&nbsp;&nbsp;&nbsp;* [DocDB Data Migration Tool](https://docs.microsoft.com/azure/documentdb/documentdb-import-data) | Y | N |
| &nbsp;&nbsp;&nbsp;&nbsp;* [Microsoft Data Management Gateway](https://msdn.microsoft.com/library/dn879362.aspx): Move data between OnPrem and Cloud | Y | N |
| &nbsp;&nbsp;&nbsp;&nbsp;* Unix/Linux Command-Line Utilities | Y | Y |
| [Apache Drill](https://drill.apache.org) for Data exploration | Y | Y |
| **Machine Learning Tools** |||
| &nbsp;&nbsp;&nbsp;&nbsp;* Integration with [Azure Machine Learning](https://azure.microsoft.com/services/machine-learning/) (R, Python) | Y | Y |
| &nbsp;&nbsp;&nbsp;&nbsp;* [Xgboost](https://github.com/dmlc/xgboost) | Y | Y |
| &nbsp;&nbsp;&nbsp;&nbsp;* [Vowpal Wabbit](https://github.com/JohnLangford/vowpal_wabbit) | Y | Y |
| &nbsp;&nbsp;&nbsp;&nbsp;* [Weka](https://www.cs.waikato.ac.nz/ml/weka/) | Y | Y |
| &nbsp;&nbsp;&nbsp;&nbsp;* [Rattle](https://togaware.com/rattle/) | Y | Y |
| &nbsp;&nbsp;&nbsp;&nbsp;* [LightGBM](https://github.com/Microsoft/LightGBM) | N | Y (Ubuntu only) |
| &nbsp;&nbsp;&nbsp;&nbsp;* [CatBoost](https://tech.yandex.com/catboost/) | N | Y (Ubuntu only) |
| &nbsp;&nbsp;&nbsp;&nbsp;* [H2O](https://www.h2o.ai/h2o/), [Sparkling Water](https://www.h2o.ai/sparkling-water/) | N | Y (Ubuntu only) |
| **Deep Learning Tools** <br>All tools will work on a GPU or CPU |  |  |
| &nbsp;&nbsp;&nbsp;&nbsp;* [Microsoft Cognitive Toolkit (CNTK)](https://docs.microsoft.com/cognitive-toolkit/) (Windows 2016) | Y | Y |
| &nbsp;&nbsp;&nbsp;&nbsp;* [TensorFlow](https://www.tensorflow.org/) | Y (Windows 2016) | Y |
| &nbsp;&nbsp;&nbsp;&nbsp;* [Horovod](https://github.com/uber/horovod) | N | Y (Ubuntu) |
| &nbsp;&nbsp;&nbsp;&nbsp;* [MXNet](https://mxnet.io/) | Y (Windows 2016) | Y|
| &nbsp;&nbsp;&nbsp;&nbsp;* [Caffe & Caffe2](https://github.com/caffe2/caffe2) | N | Y |
| &nbsp;&nbsp;&nbsp;&nbsp;* [Chainer](https://chainer.org/) | N | Y |
| &nbsp;&nbsp;&nbsp;&nbsp;* [Torch](http://torch.ch/) | N | Y |
| &nbsp;&nbsp;&nbsp;&nbsp;* [Theano](https://github.com/Theano/Theano) | N | Y |
| &nbsp;&nbsp;&nbsp;&nbsp;* [Keras](https://keras.io/)| N | Y |
| &nbsp;&nbsp;&nbsp;&nbsp;* [PyTorch](https://pytorch.org/)| N | Y |
| &nbsp;&nbsp;&nbsp;&nbsp;* [NVidia Digits](https://github.com/NVIDIA/DIGITS) | N | Y |
| &nbsp;&nbsp;&nbsp;&nbsp;* [MXNet Model Server](https://github.com/awslabs/mxnet-model-server) | N | Y |
| &nbsp;&nbsp;&nbsp;&nbsp;* [TensorFlow Serving](https://www.tensorflow.org/serving/) | N | Y |
| &nbsp;&nbsp;&nbsp;&nbsp;* [TensorRT](https://developer.nvidia.com/tensorrt) | N | Y |
| &nbsp;&nbsp;&nbsp;&nbsp;* [CUDA, cuDNN, NVIDIA Driver](https://developer.nvidia.com/cuda-toolkit) | Y | Y |
| **Big Data Platform (Devtest only)**|||
| &nbsp;&nbsp;&nbsp;&nbsp;* Local [Spark](https://spark.apache.org/) Standalone | Y | Y |
| &nbsp;&nbsp;&nbsp;&nbsp;* Local [Hadoop](https://hadoop.apache.org/) (HDFS, YARN) | N | Y |

## Get started

### Windows Data Science VM
* For more information on how to create a Windows DSVM and use it, see [Provision the Windows Data Science Virtual Machine](provision-vm.md). For more information on how to perform various tasks needed for your data science project on the Windows DSVM, see [Ten things you can do on the Data Science Virtual Machine](vm-do-ten-things.md).

### Linux Data Science VM
* For more information on how to create an Ubuntu DSVM and use it, see [Provision the Data Science Virtual Machine for Linux (Ubuntu)](dsvm-ubuntu-intro.md). For more information on how to create a CentOS DSVM and use it, see [Provision a Linux CentOS Data Science Virtual Machine on Azure](linux-dsvm-intro.md).
* For a walkthrough that shows you how to perform several common data science tasks with the Linux VM, both CentOS and Ubuntu, see [Data science on the Linux Data Science Virtual Machine](linux-dsvm-walkthrough.md).

## Next steps
[R developer's guide to Azure](/azure/architecture/data-guide/technology-choices/r-developers-guide)
