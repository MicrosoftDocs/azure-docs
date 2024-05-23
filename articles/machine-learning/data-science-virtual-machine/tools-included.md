---
title: Tools included on the Azure Data Science Virtual Machine
titleSuffix: Azure Data Science Virtual Machine
description: A list of tools included on the Windows and Ubuntu DSVM images
keywords: data science tools, data science virtual machine, tools for data science, linux data science
services: machine-learning
ms.service: data-science-vm

author: jesscioffi
ms.author: jcioffi
ms.topic: reference
ms.reviewer: franksolomon
ms.date: 05/21/2024
ms.custom: devx-track-python
---

# What tools does the Azure Data Science Virtual Machine include?

You can use the Data Science Virtual Machine (DSVM) to easily explore data and handle machine learning in the cloud. A DSVM is preconfigured with security patches, drivers, popular data science and development software, and a complete operating system. You can choose the hardware environment that works for you, ranging from lower-cost CPU-centric machines to powerful machines with multiple GPUs, NVMe storage, and large amounts of memory. For machines with GPUs, all drivers are installed, and all machine learning frameworks are version-matched for GPU compatibility. Additionally, acceleration is enabled in all application software that supports GPUs.

The DSVM comes with the most useful data-science tools preinstalled.

## Build deep learning and machine learning solutions

| Tool | Windows Server 2019 DSVM | Windows Server 2022 DSVM | Ubuntu 20.04 DSVM | Usage notes |
|--|:-:|:-:|:-:|:-:|
| [CUDA, cuDNN, NVIDIA Driver](https://developer.nvidia.com/cuda-toolkit) | <span class='green-check'>&#9989;</span> |<span class='green-check'>&#9989;</span> | <span class='green-check'>&#9989;</span></br> | [CUDA, cuDNN, NVIDIA Driver on the DSVM](./dsvm-tools-deep-learning-frameworks.md#cuda-cudnn-nvidia-driver) |
| [Horovod](https://github.com/horovod/horovod) | <span class='red-x'>&#10060;</span> | <span class='red-x'>&#10060;</span> | <span class='green-check'>&#9989;</span> | [Horovod on the DSVM](./dsvm-tools-deep-learning-frameworks.md#horovod) |
| [NVidia System Management Interface  (nvidia-smi)](https://developer.nvidia.com/nvidia-system-management-interface) | <span class='green-check'>&#9989;</span> | <span class='green-check'>&#9989;</span> | <span class='green-check'>&#9989;</span> | [nvidia-smi on the DSVM](./dsvm-tools-deep-learning-frameworks.md#nvidia-system-management-interface-nvidia-smi) |
| [PyTorch](https://pytorch.org) | <span class='green-check'>&#9989;</span> | <span class='green-check'>&#9989;</span> | <span class='green-check'>&#9989;</span> | [PyTorch on the DSVM](./dsvm-tools-deep-learning-frameworks.md#pytorch) |
| [TensorFlow](https://www.tensorflow.org) | <span class='green-check'>&#9989;</span> | <span class='green-check'>&#9989;</span></br> | <span class='green-check'>&#9989;</span> | [TensorFlow on the DSVM](./dsvm-tools-deep-learning-frameworks.md#tensorflow) |
| Integration with [Azure Machine Learning](https://azure.microsoft.com/services/machine-learning/) (Python) | <span class='green-check'>&#9989;</span></br> (Python SDK, samples) | <span class='green-check'>&#9989;</span></br> (Python SDK, samples) | <span class='green-check'>&#9989;</span></br> (Python SDK,CLI, samples) | [Azure Machine Learning SDK](./dsvm-tools-data-science.md#azure-machine-learning-sdk-for-python) |
| [XGBoost](https://github.com/dmlc/xgboost) | <span class='green-check'>&#9989;</span></br> (CUDA support)  | <span class='green-check'>&#9989;</span></br> (CUDA support) | <span class='green-check'>&#9989;</span></br> (CUDA support) | [XGBoost on the DSVM](./dsvm-tools-data-science.md#xgboost) |
| [Vowpal Wabbit](https://github.com/JohnLangford/vowpal_wabbit) | <span class='green-check'>&#9989;</span> | <span class='green-check'>&#9989;</span> | <span class='green-check'>&#9989;</span></br> | [Vowpal Wabbit on the DSVM](./dsvm-tools-data-science.md#vowpal-wabbit) |
| [Weka](https://ml.cms.waikato.ac.nz/weka/) | <span class='red-x'>&#10060;</span> | <span class='red-x'>&#10060;</span> | <span class='red-x'>&#10060;</span> | |
| LightGBM | <span class='red-x'>&#10060;</span> | <span class='red-x'>&#10060;</span> | <span class='green-check'>&#9989;</span></br> (GPU, MPI support) | |
| H2O | <span class='red-x'>&#10060;</span> | <span class='red-x'>&#10060;</span> | <span class='green-check'>&#9989;</span> | |
| CatBoost | <span class='red-x'>&#10060;</span> | <span class='red-x'>&#10060;</span> | <span class='green-check'>&#9989;</span> | |
| Intel MKL | <span class='red-x'>&#10060;</span> | <span class='red-x'>&#10060;</span> | <span class='green-check'>&#9989;</span> | |
| OpenCV | <span class='red-x'>&#10060;</span> | <span class='red-x'>&#10060;</span> | <span class='green-check'>&#9989;</span> | |
| Dlib | <span class='red-x'>&#10060;</span> | <span class='red-x'>&#10060;</span> | <span class='green-check'>&#9989;</span> | |
| Docker | <span class='green-check'>&#9989;</span><br/> (Windows containers only)  | <span class='green-check'>&#9989;</span> <br/> (Windows containers only) | <span class='green-check'>&#9989;</span> | |
| Nccl | <span class='red-x'>&#10060;</span> | <span class='red-x'>&#10060;</span> | <span class='green-check'>&#9989;</span> | |
| Rattle | <span class='red-x'>&#10060;</span> | <span class='red-x'>&#10060;</span> | <span class='red-x'>&#10060;</span> | |
| PostgreSQL | <span class='red-x'>&#10060;</span> | <span class='red-x'>&#10060;</span> | <span class='green-check'>&#9989;</span> | |
| ONNX Runtime | <span class='red-x'>&#10060;</span> | <span class='red-x'>&#10060;</span> | <span class='green-check'>&#9989;</span> | |

## Store, retrieve, and manipulate data

| Tool | Windows Server 2019 DSVM | Windows Server 2022 DSVM | Ubuntu 20.04 DSVM | Usage notes |
|--|:-:|:-:|:-:|:-:|
| Relational databases | [SQL Server 2019](https://www.microsoft.com/sql-server/sql-server-2019) <br/> Developer Edition | [SQL Server 2019](https://www.microsoft.com/sql-server/sql-server-2019) <br/> Developer Edition | [SQL Server 2019](https://www.microsoft.com/sql-server/sql-server-2019) <br/> Developer Edition | [SQL Server on the DSVM](./dsvm-tools-data-platforms.md#sql-server-developer-edition) |
| Database tools |  SQL Server Management Studio<br/> SQL Server Integration Services<br/> [bcp, sqlcmd](/sql/tools/command-prompt-utility-reference-database-engine) | SQL Server Management Studio<br/> SQL Server Integration Services<br/> [bcp, sqlcmd](/sql/tools/command-prompt-utility-reference-database-engine) | [SQuirreL SQL](http://squirrel-sql.sourceforge.net/) (querying tool), <br /> bcp, sqlcmd <br /> ODBC/JDBC drivers | |
| [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/) | <span class='green-check'>&#9989;</span></br> | <span class='green-check'>&#9989;</span></br> | |
| [Azure CLI](/cli/azure) | <span class='green-check'>&#9989;</span></br> | <span class='green-check'>&#9989;</span></br> | <span class='green-check'>&#9989;</span></br> | |
| [AzCopy](../../storage/common/storage-use-azcopy-v10.md) | <span class='green-check'>&#9989;</span></br> | <span class='green-check'>&#9989;</span></br> | <span class='red-x'>&#10060;</span> | [AzCopy on the DSVM](./dsvm-tools-ingestion.md#azcopy) |
| [Blob FUSE driver](https://github.com/Azure/azure-storage-fuse) | <span class='red-x'>&#10060;</span>  | <span class='red-x'>&#10060;</span> | <span class='red-x'>&#10060;</span></br> | [blobfuse on the DSVM](./dsvm-tools-ingestion.md#blobfuse) |
| [Azure Cosmos DB Data Migration Tool](../../cosmos-db/import-data.md) | <span class='green-check'>&#9989;</span> | <span class='green-check'>&#9989;</span> | <span class='red-x'>&#10060;</span> | [Azure Cosmos DB on the DSVM](./dsvm-tools-ingestion.md#azure-cosmos-db-data-migration-tool) |
| Unix/Linux command-line tools | <span class='red-x'>&#10060;</span> | <span class='red-x'>&#10060;</span> | <span class='green-check'>&#9989;</span> | |
| Apache Spark 3.1 (standalone) | <span class='green-check'>&#9989;</span> | <span class='green-check'>&#9989;</span> | <span class='green-check'>&#9989;</span></br> | |

## Program in Python, R, Julia, and Node.js

| Tool | Windows Server 2019 DSVM | Windows Server 2022 DSVM | Ubuntu 20.04 DSVM | Usage notes |
|--|:-:|:-:|:-:|:-:|
| [CRAN-R](https://cran.r-project.org/) with popular packages preinstalled | <span class='green-check'>&#9989;</span> | <span class='green-check'>&#9989;</span> | <span class='green-check'>&#9989;</span> | |
| [Anaconda Python](https://www.continuum.io/) with popular packages preinstalled | <span class='green-check'>&#9989;</span> |<span class='green-check'>&#9989;</span><br/> (Miniconda) | <span class='green-check'>&#9989;</span></br> (Miniconda) | |
| [Julia (Julialang)](https://julialang.org/) | <span class='green-check'>&#9989;</span> | <span class='green-check'>&#9989;</span> | <span class='green-check'>&#9989;</span> | |
| JupyterHub (multiuser notebook server) | <span class='red-x'>&#10060;</span> | <span class='red-x'>&#10060;</span> | <span class='green-check'>&#9989;</span> | |
| JupyterLab (multiuser notebook server) | <span class='green-check'>&#9989;</span> | <span class='green-check'>&#9989;</span> | <span class='green-check'>&#9989;</span> | |
| Node.js | <span class='green-check'>&#9989;</span> | <span class='green-check'>&#9989;</span> | <span class='green-check'>&#9989;</span> | |
| [Jupyter Notebook Server](https://jupyter.org/)  with the following kernels: | <span class='green-check'>&#9989;</span></br> | <span class='green-check'>&#9989;</span></br> | <span class='green-check'>&#9989;</span> | [Jupyter Notebook samples](./dsvm-samples-and-walkthroughs.md) |
| &nbsp;&nbsp;&nbsp;&nbsp; R |  |  |  | [R Jupyter Samples](./dsvm-samples-and-walkthroughs.md#r-language) |
| &nbsp;&nbsp;&nbsp;&nbsp; Python |  |  |  | [Python Jupyter Samples](./dsvm-samples-and-walkthroughs.md#python-language) |
| &nbsp;&nbsp;&nbsp;&nbsp; Julia |  |  |  | [Julia Jupyter Samples](./dsvm-samples-and-walkthroughs.md#julia-language) |
| &nbsp;&nbsp;&nbsp;&nbsp; PySpark |  |  |  | [pySpark Jupyter Samples](./dsvm-samples-and-walkthroughs.md#sparkml) |

**Ubuntu 20.04 DSVM, Windows Server 2019 DSVM, and Windows Server 2022 DSVM** have these Jupyter Kernels:
* Python3.8-default
* Python3.8-Tensorflow-Pytorch
* Python3.8-AzureML
* R
* Python 3.7 - Spark (local)
* Julia 1.6.0
* R Spark – HDInsight
* Scala Spark – HDInsight
* Python 3 Spark – HDInsight

**Ubuntu 20.04 DSVM, Windows Server 2019 DSVM, and Windows Server 2022 DSVM** have the following conda environments:
* Python3.8-default
* Python3.8-Tensorflow-Pytorch
* Python3.8-AzureML

## Use your preferred editor or IDE

| Tool | Windows Server 2019 DSVM | Windows Server 2022 DSVM | Ubuntu 20.04 DSVM | Usage notes |
|--|:-:|:-:|:-:|:-:|
| [Notepad++](https://notepad-plus-plus.org/) | <span class='green-check'>&#9989;</span></br>  | <span class='green-check'>&#9989;</span></br> | <span class='red-x'>&#10060;</span></br> | |
| [Nano](https://www.nano-editor.org/) | <span class='green-check'>&#9989;</span></br>  | <span class='green-check'>&#9989;</span></br> | <span class='red-x'>&#10060;</span></br> | |
| [Visual Studio 2019 Community Edition](https://www.visualstudio.com/community/) | <span class='green-check'>&#9989;</span></br>  | <span class='green-check'>&#9989;</span> | <span class='red-x'>&#10060;</span> | [Visual Studio on the DSVM](dsvm-tools-development.md#visual-studio-community-edition) |
| [Visual Studio Code](https://code.visualstudio.com/) | <span class='green-check'>&#9989;</span></br>  | <span class='green-check'>&#9989;</span></br> | <span class='green-check'>&#9989;</span></br> | [Visual Studio Code on the DSVM](./dsvm-tools-development.md#visual-studio-code) |
| [PyCharm Community Edition](https://www.jetbrains.com/pycharm/) | <span class='green-check'>&#9989;</span></br>  | <span class='green-check'>&#9989;</span></br> | <span class='green-check'>&#9989;</span></br> | [PyCharm on the DSVM](./dsvm-tools-development.md#pycharm) |
| [IntelliJ IDEA](https://www.jetbrains.com/idea/) | <span class='red-x'>&#10060;</span> | <span class='red-x'>&#10060;</span> | <span class='green-check'>&#9989;</span> | |
| [Vim](https://www.vim.org) | <span class='red-x'>&#10060;</span> | <span class='red-x'>&#10060;</span> | <span class='green-check'>&#9989;</span></br> | |
| [Emacs](https://www.gnu.org/software/emacs) | <span class='red-x'>&#10060;</span> | <span class='red-x'>&#10060;</span> | <span class='green-check'>&#9989;</span></br> | |
| [Git](https://git-scm.com/) and Git Bash | <span class='green-check'>&#9989;</span></br>  | <span class='green-check'>&#9989;</span></br> | <span class='green-check'>&#9989;</span></br> | |
| [OpenJDK](https://openjdk.java.net) 11 | <span class='green-check'>&#9989;</span></br> | <span class='green-check'>&#9989;</span></br> | <span class='green-check'>&#9989;</span></br> | |
| .NET Framework | <span class='green-check'>&#9989;</span></br> | <span class='green-check'>&#9989;</span></br> | <span class='red-x'>&#10060;</span> | |
| Azure SDK | <span class='green-check'>&#9989;</span></br> | <span class='green-check'>&#9989;</span> | <span class='green-check'>&#9989;</span> | |

## Organize & present results

| Tool | Windows Server 2019 DSVM | Windows Server 2022 DSVM | Ubuntu 20.04 DSVM | Usage notes |
|--|:-:|:-:|:-:|:-:|
| [Microsoft 365](https://www.microsoft.com/microsoft-365) (Word, Excel, PowerPoint) | <span class='green-check'>&#9989;</span> | <span class='green-check'>&#9989;</span> | <span class='red-x'>&#10060;</span> |  |
| [Microsoft Teams](https://www.microsoft.com/microsoft-teams) | <span class='green-check'>&#9989;</span> | <span class='green-check'>&#9989;</span> | <span class='red-x'>&#10060;</span> | |
| [Power BI Desktop](https://powerbi.microsoft.com/) | <span class='green-check'>&#9989;</span> |<span class='green-check'>&#9989;</span></br> | <span class='red-x'>&#10060;</span> | |
| Microsoft Edge Browser | <span class='green-check'>&#9989;</span> | <span class='green-check'>&#9989;</span> | <span class='green-check'>&#9989;</span> | |
