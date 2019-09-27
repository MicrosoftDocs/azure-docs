---
title: Tools Included on the DSVM
description: A list of tools included on the Windows and Ubuntu DSVM images
keywords: data science tools, data science virtual machine, tools for data science, linux data science
services: machine-learning
ms.service: machine-learning
ms.subservice: data-science-vm

author: gvashishtha
ms.author: gopalv
ms.topic: overview
ms.date: 09/27/2019

---

# What tools are included on the Data Science Virtual Machine?

Below we have included an up-to-date list of tools included on the Data Science Virtual Machine, along with links to understand how each tool is configured.


| **Tool**                                                           | **Windows edition** | **Linux edition** |
| :------------------------------------------------------------------ |:-------------------:|:------------------:|
| [Microsoft R Open](https://mran.microsoft.com/open/) with popular packages pre-installed   |:heavy_check_mark:                      | Y             |
| [Microsoft Machine Learning Server (R, Python)](https://docs.microsoft.com/machine-learning-server/) Developer Edition includes: <br />  &nbsp;&nbsp;&nbsp;&nbsp; [RevoScaleR/revoscalepy](https://docs.microsoft.com/machine-learning-server/r/concept-what-is-revoscaler) parallel and distributed high-performance framework (R and Python)<br />  &nbsp;&nbsp;&nbsp;&nbsp; [MicrosoftML](https://docs.microsoft.com/machine-learning-server/r/concept-what-is-the-microsoftml-package), new state-of-the-art machine learning algorithms from Microsoft <br />  &nbsp;&nbsp;&nbsp;&nbsp; [R and Python operationalization](https://docs.microsoft.com/machine-learning-server/what-is-operationalization)                                            |Y                      | Y |
| [Microsoft Office](https://products.office.com/business/office-365-proplus-business-software) ProPlus with shared activation: Excel, Word, and PowerPoint   |Y                      |:x:              |
| [Anaconda Python](https://www.continuum.io/) 2.7 and 3.5 with popular packages pre-installed    |Y                      |Y              |
| [JuliaPro](https://juliacomputing.com/products/juliapro.html) with popular packages for Julia language pre-installed                         |Y                      |Y              |
| Relational databases                                                            | [SQL Server 2017](https://www.microsoft.com/sql-server/sql-server-2017) <br/> Developer Edition| [PostgreSQL](https://www.postgresql.org/) (CentOS),<br/>[SQL Server 2017](https://www.microsoft.com/sql-server/sql-server-2017) <br/> Developer Edition (Ubuntu) |
| Database tools                                                       |  SQL Server Management Studio <br/> SQL Server Integration Services<br/> [bcp, sqlcmd](https://docs.microsoft.com/sql/tools/command-prompt-utility-reference-database-engine)<br />  ODBC/JDBC drivers|  [SQuirreL SQL](http://squirrel-sql.sourceforge.net/) (querying tool), <br />  bcp, sqlcmd <br />  ODBC/JDBC drivers|
| Scalable in-database analytics with SQL Server machine learning services (R, Python) | Y     |N              |
| [Jupyter Notebook Server](https://jupyter.org/) with the following kernels:                                  | Y     | Y |
|     &nbsp;&nbsp;&nbsp;&nbsp; R | Y | Y |
|     &nbsp;&nbsp;&nbsp;&nbsp; Python | Y | Y |
|     &nbsp;&nbsp;&nbsp;&nbsp; Julia | Y | Y |
|     &nbsp;&nbsp;&nbsp;&nbsp; PySpark | Y | Y |
|     &nbsp;&nbsp;&nbsp;&nbsp; [Sparkmagic](https://github.com/jupyter-incubator/sparkmagic) | N | Y (Ubuntu only) |
|     &nbsp;&nbsp;&nbsp;&nbsp; SparkR     | N | Y |
| JupyterHub (multiuser notebook server)| N | Y |
| JupyterLab (multiuser notebook server) | N | Y (Ubuntu only) |
| Development tools, IDEs, and code editors:| | |
| &nbsp;&nbsp;&nbsp;&nbsp; [Visual Studio 2019 (Community Edition)](https://www.visualstudio.com/community/) with Git plug-in, Azure HDInsight (Hadoop), Azure Data Lake, SQL Server Data Tools, [Node.js](https://github.com/Microsoft/nodejstools), [Python](https://aka.ms/ptvs), and [R Tools for Visual Studio (RTVS)](https://microsoft.github.io/RTVS-docs/) | Y | N |
| &nbsp;&nbsp;&nbsp;&nbsp; [Visual Studio Code](https://code.visualstudio.com/) | Y | Y |
| &nbsp;&nbsp;&nbsp;&nbsp; [RStudio Desktop](https://www.rstudio.com/products/rstudio/#Desktop) | Y | Y |
| &nbsp;&nbsp;&nbsp;&nbsp; [RStudio Server](https://www.rstudio.com/products/rstudio/#Server) | N | Y |
| &nbsp;&nbsp;&nbsp;&nbsp; [PyCharm Community Edition](https://www.jetbrains.com/pycharm/) | N | Y |
| &nbsp;&nbsp;&nbsp;&nbsp; [Atom](https://atom.io/) | N | Y |
| &nbsp;&nbsp;&nbsp;&nbsp; [Juno (Julia IDE)](https://junolab.org/)| Y | Y |
| &nbsp;&nbsp;&nbsp;&nbsp; Vim and Emacs | Y | Y |
| &nbsp;&nbsp;&nbsp;&nbsp; Git and Git Bash | Y | Y |
| &nbsp;&nbsp;&nbsp;&nbsp; OpenJDK | Y | Y |
| &nbsp;&nbsp;&nbsp;&nbsp; .NET Framework | Y | N |
| Power BI Desktop | Y | N |
| SDKs to access Azure and Cortana Intelligence Suite of services | Y | Y |
| Data movement and management tools: | | |
| &nbsp;&nbsp;&nbsp;&nbsp; Azure Storage Explorer | Y | Y |
| &nbsp;&nbsp;&nbsp;&nbsp; [Azure CLI](https://docs.microsoft.com/cli/azure) | Y | Y |
| &nbsp;&nbsp;&nbsp;&nbsp; Azure PowerShell | Y | N |
| &nbsp;&nbsp;&nbsp;&nbsp; [Azcopy](https://docs.microsoft.com/azure/storage/storage-use-azcopy) | Y | N |
| &nbsp;&nbsp;&nbsp;&nbsp; [Blob FUSE driver](https://github.com/Azure/azure-storage-fuse) | N | Y |
| &nbsp;&nbsp;&nbsp;&nbsp; [Adlcopy (Azure Data Lake Storage)](https://docs.microsoft.com/azure/data-lake-store/data-lake-store-copy-data-azure-storage-blob) | Y | N |
| &nbsp;&nbsp;&nbsp;&nbsp; [Azure Cosmos DB Data Migration Tool](https://docs.microsoft.com/azure/documentdb/documentdb-import-data) | Y | N |
| &nbsp;&nbsp;&nbsp;&nbsp; [Microsoft Data Management Gateway](https://msdn.microsoft.com/library/dn879362.aspx): move data between on-premises and the cloud | Y | N |
| &nbsp;&nbsp;&nbsp;&nbsp; Unix/Linux command-line tools | Y | Y |
| [Apache Drill](https://drill.apache.org) for data exploration | Y | Y |
| Machine learning tools: |||
| &nbsp;&nbsp;&nbsp;&nbsp; Integration with [Azure Machine Learning](https://azure.microsoft.com/services/machine-learning/) (R, Python) | Y | Y |
| &nbsp;&nbsp;&nbsp;&nbsp; [XGBoost](https://github.com/dmlc/xgboost) | Y | Y |
| &nbsp;&nbsp;&nbsp;&nbsp; [Vowpal Wabbit](https://github.com/JohnLangford/vowpal_wabbit) | Y | Y |
| &nbsp;&nbsp;&nbsp;&nbsp; [Weka](https://www.cs.waikato.ac.nz/ml/weka/) | Y | Y |
| &nbsp;&nbsp;&nbsp;&nbsp; [Rattle](https://togaware.com/rattle/) | Y | Y |
| &nbsp;&nbsp;&nbsp;&nbsp; [LightGBM](https://github.com/Microsoft/LightGBM) | N | Y (Ubuntu only) |
| &nbsp;&nbsp;&nbsp;&nbsp; [CatBoost](https://tech.yandex.com/catboost/) | N | Y (Ubuntu only) |
| &nbsp;&nbsp;&nbsp;&nbsp; [H2O](https://www.h2o.ai/h2o/), [Sparkling Water](https://www.h2o.ai/sparkling-water/) | N | Y (Ubuntu only) |
| Deep learning tools that work on a GPU or CPU: |  |  |
| &nbsp;&nbsp;&nbsp;&nbsp; [Microsoft Cognitive Toolkit (CNTK)](https://docs.microsoft.com/cognitive-toolkit/) (Windows 2016) | Y | Y |
| &nbsp;&nbsp;&nbsp;&nbsp; [TensorFlow](https://www.tensorflow.org/) | Y (Windows 2016) | Y |
| &nbsp;&nbsp;&nbsp;&nbsp; [Horovod](https://github.com/uber/horovod) | N | Y (Ubuntu) |
| &nbsp;&nbsp;&nbsp;&nbsp; [MXNet](https://mxnet.io/) | Y (Windows 2016) | Y|
| &nbsp;&nbsp;&nbsp;&nbsp; [Caffe and Caffe2](https://github.com/caffe2/caffe2) | N | Y |
| &nbsp;&nbsp;&nbsp;&nbsp; [Chainer](https://chainer.org/) | N | Y |
| &nbsp;&nbsp;&nbsp;&nbsp; [Torch](http://torch.ch/) | N | Y |
| &nbsp;&nbsp;&nbsp;&nbsp; [Theano](https://github.com/Theano/Theano) | N | Y |
| &nbsp;&nbsp;&nbsp;&nbsp; [Keras](https://keras.io/)| N | Y |
| &nbsp;&nbsp;&nbsp;&nbsp; [PyTorch](https://pytorch.org/)| N | Y |
| &nbsp;&nbsp;&nbsp;&nbsp; [NVidia Digits](https://github.com/NVIDIA/DIGITS) | N | Y |
| &nbsp;&nbsp;&nbsp;&nbsp; [MXNet Model Server](https://github.com/awslabs/mxnet-model-server) | N | Y |
| &nbsp;&nbsp;&nbsp;&nbsp; [TensorFlow Serving](https://www.tensorflow.org/serving/) | N | Y |
| &nbsp;&nbsp;&nbsp;&nbsp; [TensorRT](https://developer.nvidia.com/tensorrt) | N | Y |
| &nbsp;&nbsp;&nbsp;&nbsp; [CUDA, cuDNN, NVIDIA Driver](https://developer.nvidia.com/cuda-toolkit) | Y | Y |
