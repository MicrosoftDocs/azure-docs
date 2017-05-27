---
title: What is a Data Science Virtual Machine? | Microsoft Docs
description: Learn the key scenarios, features, and how to get started with Data Science Virtual Machines, an environment and toolkit ready for analytics.
keywords: data science tools, data science virtual machine, tools for data science, linux data science
services: machine-learning
documentationcenter: ''
author: bradsev
manager: jhubbard
editor: cgronlun

ms.assetid: d4f91270-dbd2-4290-ab2b-b7bfad0b2703
ms.service: machine-learning
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/13/2017
ms.author: gokuma

---
# Introduction to the cloud-based Data Science Virtual Machine for Linux and Windows
The Data Science Virtual Machine (DSVM) is a customized VM image on Microsoft’s Azure cloud built specifically for doing data science. It has many popular data science and other tools pre-installed and pre-configured to jump-start building intelligent applications for advanced analytics. It is available on Windows Server 2012 and on Linux. We offer Linux edition of the DSVM in either Ubuntu 16.04 LTS or on OpenLogic 7.2 CentOS-based Linux distributions. 

This topic discusses what you can do with the Data Science VM, outlines some of the key scenarios for using the VM, itemizes the key features available on the Windows and Linux versions, and provides instructions on how to get started using them.

## What can I do with the Data Science Virtual Machine?
The goal of the Data Science Virtual Machine is to provide data professionals at all skill levels and roles with a friction-free data science environment. This VM saves you considerable time that you would spend if you had rolled out a comparable environment on your own. Instead, start your data science project immediately in a newly created VM instance. 

The Data Science VM is designed and configured for working with a broad usage scenarios. You can scale your environment up or down as your project needs change. You are able to use your preferred language to program data science tasks. You can install other tools and customize the system for your exact needs.

## Key Scenarios
This section suggests some key scenarios for which the Data Science VM can be deployed.

### Preconfigured analytics desktop in the cloud
The Data Science VM provides a baseline configuration for data science teams looking to replace their local desktops with a managed cloud desktop. This baseline ensures that all the data scientists on a team have a consistent setup with which to verify experiments and promote collaboration. It also lowers costs by reducing the sysadmin burden and saving on the time needed to evaluate, install, and maintain the various software packages needed to do advanced analytics.  

### Data science training and education
Enterprise trainers and educators that teach data science classes usually provide a virtual machine image to ensure that their students have a consistent setup and that the samples work predictably. The Data Science VM creates an on-demand environment with a consistent setup that eases the support and incompatibility challenges. Cases where these environments need to be built frequently, especially for shorter training classes, benefit substantially.

### On-demand elastic capacity for large-scale projects
Data science hackathons/competitions or large-scale data modeling and exploration require scaled out hardware capacity, typically for short duration. The Data Science VM can help replicate the data science environment quickly on demand, on scaled out servers that allow experiments requiring high-powered computing resources to be run.

### Short-term experimentation and evaluation
The Data Science VM can be used to evaluate or learn tools such as Microsoft R Server, SQL Server, Visual Studio tools, Jupyter, deep learning / ML toolkits, and new tools popular in the community with minimal setup effort. Since the Data Science VM can be set up quickly, it can be applied in other short-term usage scenarios such as replicating published experiments, executing demos, following walkthroughs in online sessions or conference tutorials.

### Deep learning
The data science VM can be used for training model using deep learning algorithms on GPU (Graphics processing units) based hardware. DSVM helps you use GPU based hardware on the cloud only as needed when you have to train large models or you need high speed computations that take advantage of the power of a GPU.  On the Windows, we currently provide the [Deep Learning toolkit for DSVM](http://aka.ms/dsvm/deeplearning) as a separate add-on on the top of the DSVM. This addon automatically installs the GPU drivers, frameworks and GPU version of the deep learning algorithms while creating your VM instance. On the Linux, deep learning on GPU is enabled only on the [Data Science Virtual Machine for Linux (Ubuntu) edition](http://aka.ms/dsvm/ubuntu). You can deploy the Ubuntu edition of Data Science VM to non GPU based Azure virtual machine in which case all the deep learning frameworks will fallback to the CPU mode. The CentOS-based Linux  edition of the DSVM contains only the CPU builds of some of the deep learning tools  (CNTK, Tensorflow, MXNet) but does not come preinstalled with the GPU drivers and frameworks. 

## What's included in the Data Science VM?
The Data Science Virtual Machine has many popular data science and deep learning tools already installed and configured. It also includes tools that make it easy to work with various Azure data and analytics products. You can explore and build predictive models on large-scale data sets using the Microsoft R Server or using SQL Server 2016. A host of other tools from the open source community and from Microsoft are also included, as well as sample code and notebooks. The following table itemizes and compares the main components included in the Windows and Linux editions of the Data Science Virtual Machine.


| **Tool**                                                           | **Windows Edition** | **Linux Edition** |
| :------------------------------------------------------------------ |:-------------------:|:------------------:|
| [Microsoft R Open](https://mran.microsoft.com/open/) with popular packages pre-installed   |Y                      | Y             |
| [Microsoft R Server](https://msdn.microsoft.com/microsoft-r/) Developer Edition includes, <br />  &nbsp;&nbsp;&nbsp;&nbsp;* [ScaleR](https://msdn.microsoft.com/microsoft-r/scaler-getting-started) parallel and distributed high performance R framework<br />  &nbsp;&nbsp;&nbsp;&nbsp;* [MicrosoftML](https://msdn.microsoft.com/microsoft-r/microsoftml-introduction) - New state-of-the-art ML algorithms from Microsoft <br />  &nbsp;&nbsp;&nbsp;&nbsp;* [R Operationalization](https://msdn.microsoft.com/microsoft-r/operationalize/about)                                            |Y                      | Y <br/> (MicrosoftML not yet available)|
| [Anaconda Python](https://www.continuum.io/) 2.7, 3.5 with popular packages pre-installed    |Y                      |Y              |
| [JuliaPro](https://juliacomputing.com/products/juliapro.html) with popular packages for Julia language pre-installed                         |Y                      |Y              |
| Relational Databases                                                            | [SQL Server 2016 SP1](https://www.microsoft.com/sql-server/sql-server-2016) <br/> Developer Edition| [PostgreSQL](https://www.postgresql.org/) |
| Database tools                                                       | * SQL Server Management Studio <br/>* SQL Server Integration Services<br/>* [bcp, sqlcmd](https://docs.microsoft.com/sql/tools/command-prompt-utility-reference-database-engine)<br /> * ODBC/JDBC drivers| * [SQuirreL SQL](http://squirrel-sql.sourceforge.net/) (querying tool), <br /> * bcp, sqlcmd <br /> * ODBC/JDBC drivers|
| Scalable in-database analytics with SQL Server R services | Y     |N              |
| **[Jupyter Notebook Server](http://jupyter.org/) with following kernels,**                                  | Y     | Y |
|     &nbsp;&nbsp;&nbsp;&nbsp;* R | Y | Y |
|     &nbsp;&nbsp;&nbsp;&nbsp;* Python 2.7 & 3.5 | Y | Y |
|     &nbsp;&nbsp;&nbsp;&nbsp;* Julia | Y | Y |
|     &nbsp;&nbsp;&nbsp;&nbsp;* PySpark | N | Y |
|     &nbsp;&nbsp;&nbsp;&nbsp;* [Sparkmagic](https://github.com/jupyter-incubator/sparkmagic) | N | Y (Ubuntu Only) |
|     &nbsp;&nbsp;&nbsp;&nbsp;* SparkR     | N | Y |
| JupyterHub (Multi-user notebooks server)| N | Y |
| **Development tools, IDEs and Code editors**| | |
| &nbsp;&nbsp;&nbsp;&nbsp;* [Visual Studio 2015 (Community Edition)](https://www.visualstudio.com/community/) >with Git Plugin, Azure HDInsight (Hadoop), Data Lake, SQL Server Data tools, [Node.js](https://github.com/Microsoft/nodejstools), [Python](http://aka.ms/ptvs), and [R Tools for Visual Studio (RTVS)](http://microsoft.github.io/RTVS-docs/) | Y | N |
| &nbsp;&nbsp;&nbsp;&nbsp;* [Visual Studio Code](https://code.visualstudio.com/) | Y | Y |
| &nbsp;&nbsp;&nbsp;&nbsp;* [RStudio Desktop](https://www.rstudio.com/products/rstudio/#Desktop) | Y | Y |
| &nbsp;&nbsp;&nbsp;&nbsp;* [RStudio Server](https://www.rstudio.com/products/rstudio/#Server) | N | Y |
| &nbsp;&nbsp;&nbsp;&nbsp;* [PyCharm](https://www.jetbrains.com/pycharm/) | N | Y |
| &nbsp;&nbsp;&nbsp;&nbsp;* [Atom](https://atom.io/) | N | Y |
| &nbsp;&nbsp;&nbsp;&nbsp;* [Juno (Julia IDE)](http://junolab.org/)| Y | Y |
| &nbsp;&nbsp;&nbsp;&nbsp;* Vim and Emacs | Y | Y |
| &nbsp;&nbsp;&nbsp;&nbsp;* Git and GitBash | Y | Y |
| &nbsp;&nbsp;&nbsp;&nbsp;* OpenJDK | Y | Y |
| &nbsp;&nbsp;&nbsp;&nbsp;* .Net Framework | Y | N |
| PowerBI Desktop | Y | N |
| SDKs to access Azure and Cortana Intelligence Suite of services | Y | Y |
| **Data Movement and management Tools** | | |
| &nbsp;&nbsp;&nbsp;&nbsp;* Azure Storage Explorer | Y | Y |
| &nbsp;&nbsp;&nbsp;&nbsp;* [Azure CLI](https://docs.microsoft.com/cli/azure/overview) | Y | Y |
| &nbsp;&nbsp;&nbsp;&nbsp;* Azure Powershell | Y | N |
| &nbsp;&nbsp;&nbsp;&nbsp;* [Azcopy](https://docs.microsoft.com/azure/storage/storage-use-azcopy) | Y | N |
| &nbsp;&nbsp;&nbsp;&nbsp;* [Adlcopy(Azure Data Lake Storage)](https://docs.microsoft.com/azure/data-lake-store/data-lake-store-copy-data-azure-storage-blob) | Y | N |
| &nbsp;&nbsp;&nbsp;&nbsp;* [DocDB Data Migration Tool](https://docs.microsoft.com/azure/documentdb/documentdb-import-data) | Y | N |
| &nbsp;&nbsp;&nbsp;&nbsp;* [Microsoft Data Management Gateway](https://msdn.microsoft.com/library/dn879362.aspx) : Move data between OnPrem and Cloud | Y | N |
| &nbsp;&nbsp;&nbsp;&nbsp;* Unix/Linux Command Line Utilities | Y | Y |
| [Apache Drill](http://drill.apache.org) for Data exploration | Y | Y |
| **Machine Learning Tools** |||
| &nbsp;&nbsp;&nbsp;&nbsp;* Integration with [Azure Machine Learning](https://azure.microsoft.com/services/machine-learning/) (R, Python) | Y | Y |
| &nbsp;&nbsp;&nbsp;&nbsp;* [Xgboost](https://github.com/dmlc/xgboost) | Y | Y |
| &nbsp;&nbsp;&nbsp;&nbsp;* [Vowpal Wabbit](https://github.com/JohnLangford/vowpal_wabbit) | Y | Y |
| &nbsp;&nbsp;&nbsp;&nbsp;* [Weka](http://www.cs.waikato.ac.nz/ml/weka/) | Y | Y |
| &nbsp;&nbsp;&nbsp;&nbsp;* [Rattle](http://rattle.togaware.com/) | Y | Y |
| &nbsp;&nbsp;&nbsp;&nbsp;* [LightGBM](https://github.com/Microsoft/LightGBM) | N | Y (Ubuntu Only) |
| &nbsp;&nbsp;&nbsp;&nbsp;* [H2O](https://www.h2o.ai/h2o/) | N | Y (Ubuntu only) |
| **GPU based Deep Learning Tools** |Use [Deep Learning Toolkit for DSVM](http://aka.ms/dsvm/deeplearning) |Ubuntu Edition Only|
| &nbsp;&nbsp;&nbsp;&nbsp;* [Microsoft Cognitive Toolkit (CNTK)](http://cntk.ai) | Y | Y |
| &nbsp;&nbsp;&nbsp;&nbsp;* [Tensorflow](https://www.tensorflow.org/) | Y | Y |
| &nbsp;&nbsp;&nbsp;&nbsp;* [MXNet](http://mxnet.io/) | Y | Y|
| &nbsp;&nbsp;&nbsp;&nbsp;* [Caffe & Caffe2](https://github.com/caffe2/caffe2) | N | Y |
| &nbsp;&nbsp;&nbsp;&nbsp;* [Torch](http://torch.ch/) | N | Y |
| &nbsp;&nbsp;&nbsp;&nbsp;* [Theano](https://github.com/Theano/Theano) | N | Y |
| &nbsp;&nbsp;&nbsp;&nbsp;* [Keras](https://keras.io/)| N | Y |
| &nbsp;&nbsp;&nbsp;&nbsp;* [NVidia Digits](https://github.com/NVIDIA/DIGITS) | N | Y |
| &nbsp;&nbsp;&nbsp;&nbsp;* [CUDA, CUDNN, Nvidia Driver](https://developer.nvidia.com/cuda-toolkit) | Y | Y |
| **Big Data Platform (Devtest only)**|||
| &nbsp;&nbsp;&nbsp;&nbsp;* Local [Spark](http://spark.apache.org/) Standalone | N | Y |
| &nbsp;&nbsp;&nbsp;&nbsp;* Local [Hadoop](http://hadoop.apache.org/) (HDFS, YARN) | N | Y |



## How to get started with the Windows Data Science VM
* Create an instance of the VM on Windows by navigating to [this page](https://azure.microsoft.com/marketplace/partners/microsoft-ads/standard-data-science-vm/) and selecting the green **Create Virtual Machine** button.
* Sign in to the VM from your remote desktop using the credentials you specified when you created the VM.
* To discover and launch the tools available, click the **Start** menu.

## Get started with the Linux Data Science VM
* Create an instance of the VM on Linux
  * For the OpenLogic CentOS-based edition navigate to [this page](http://aka.ms/dsvm/centos) and select the **Get it now** button.
  * For the Ubuntu edition navigate to [this page](http://aka.ms/dsvm/ubuntu) and select the **Get it now** button.
* Sign in to the VM from an SSH client, such as Putty or SSH Command, using the credentials you specified when you created the VM.
* In the shell prompt, enter dsvm-more-info.
* For a graphical desktop, download the X2Go client for your client platform [here](http://wiki.x2go.org/doku.php/doc:installation:x2goclient) and follow the instructions in the Linux Data Science VM document [Provision the Linux Data Science Virtual Machine](machine-learning-data-science-linux-dsvm-intro.md#installing-and-configuring-x2go-client).

## Next steps
### For the Windows Data Science VM
* For more information on how to run specific tools available on the Windows version, see [Provision the Microsoft Data Science Virtual Machine](machine-learning-data-science-provision-vm.md) and
* For more information on how to perform various tasks needed for your data science project on the Windows VM, see [Ten things you can do on the Data science Virtual Machine](machine-learning-data-science-vm-do-ten-things.md).

### For the Linux Data Science VM
* For more information on how to run specific tools available on the Linux version, see [Provision the Linux Data Science Virtual Machine](machine-learning-data-science-linux-dsvm-intro.md).
* For a walkthrough that shows you how to perform several common data science tasks with the Linux VM, see [Data science on the Linux Data Science Virtual Machine](machine-learning-data-science-linux-dsvm-walkthrough.md).

