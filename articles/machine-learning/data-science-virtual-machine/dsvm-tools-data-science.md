---
title: Machine learning and data science tools
titleSuffix: Azure Data Science Virtual Machine 
description: Learn about the machine-learning tools and frameworks that are preinstalled on the Data Science Virtual Machine.
keywords: data science tools, data science virtual machine, tools for data science, linux data science
services: machine-learning
ms.service: machine-learning
ms.subservice: data-science-vm

author: lobrien
ms.author: laobri
ms.topic: conceptual
ms.date: 12/12/2019
---

# Machine learning and data science tools on Azure Data Science Virtual Machines
Azure Data Science Virtual Machines (DSVMs) have a rich set of tools and libraries for machine learning available in popular languages, such as Python, R, and Julia.

Here are some of the machine-learning tools and libraries on DSVMs.

## Azure Machine Learning SDK for Python

See the full reference for the [Azure Machine Learning SDK for Python](https://docs.microsoft.com/azure/machine-learning/overview-what-is-azure-ml).

|    |           |
| ------------- | ------------- |
| What is it?   |   Azure Machine Learning is a cloud service that you can use to develop and deploy machine-learning models. You can track your models as you build, train, scale, and manage them by using the Python SDK. Deploy models as containers and run them in the cloud, on-premises, or on Azure IoT Edge.   |
| Supported editions     | Windows (conda environment: AzureML), Linux (conda environment: py36)    |
| Typical uses      | General machine-learning platform      |
| How is it configured or installed?      |  Installed with GPU support   |
| How to use or run it      | As a Python SDK and in the Azure CLI. Activate to the conda environment `AzureML` on Windows edition *or* to `py36` on Linux edition.      |
| Link to samples      | Sample Jupyter notebooks are included in the `AzureML` directory under notebooks.  |
| Related tools      | Visual Studio Code, Jupyter   |

## H2O

|    |           |
| ------------- | ------------- |
| What is it?   | An open-source AI platform that supports in-memory, distributed, fast, and scalable machine learning.  |
| Supported versions      | Linux   |
| Typical uses      | General-purpose distributed, scalable machine learning   |
| How is it configured or installed?      | H2O is installed in `/dsvm/tools/h2o`.      |
| How to use or run it      | Connect to the VM by using X2Go. Start a new terminal, and run `java -jar /dsvm/tools/h2o/current/h2o.jar`. Then start a web browser and connect to `http://localhost:54321`.      |
| Link to samples      | Samples are available on the VM in Jupyter under the `h2o` directory.      |
| Related tools      | Apache Spark, MXNet, XGBoost, Sparkling Water, Deep Water    |

There are several other machine-learning libraries on DSVMs, such as the popular `scikit-learn` package that's part of the Anaconda Python distribution for DSVMs. To check out the list of packages available in Python, R, and Julia, run the respective package managers.

## LightGBM

|    |           |
| ------------- | ------------- |
| What is it?   | A fast, distributed, high-performance gradient-boosting (GBDT, GBRT, GBM, or MART) framework based on decision tree algorithms. It's used for ranking, classification, and many other machine-learning tasks.    |
| Supported versions      | Windows, Linux    |
| Typical uses      | General-purpose gradient-boosting framework      |
| How is it configured or installed?      | On Windows, LightGBM is installed as a Python package. On Linux, the command-line executable is in `/opt/LightGBM/lightgbm`, the R package is installed, and Python packages are installed.     |
| Link to samples      | [LightGBM guide](https://github.com/Microsoft/LightGBM/tree/master/examples/python-guide)   |
| Related tools      | MXNet, XgBoost  |

## Rattle
|    |           |
| ------------- | ------------- |
| What is it?   |   A graphical user interface for data mining by using R.   |
| Supported editions     | Windows, Linux     |
| Typical uses      | General UI data-mining tool for R    |
| How to use or run it      | As a UI tool. On Windows, start a command prompt, run R, and then inside R, run `rattle()`. On Linux, connect with X2Go, start a terminal, run R, and then inside R, run `rattle()`. |
| Link to samples      | [Rattle](https://togaware.com/onepager/) |
| Related tools      |LightGBM, Weka, XGBoost   |

## Vowpal Wabbit
|    |           |
| ------------- | ------------- |
| What is it?   |   A fast, open-source, out-of-core learning system library    |
| Supported editions     | Windows, Linux     |
| Typical uses      | General machine-learning library      |
| How is it configured or installed?      |  Windows: msi installer<br/>Linux: apt-get |
| How to use or run it      | As an on-path command-line tool (`C:\Program Files\VowpalWabbit\vw.exe` on Windows, `/usr/bin/vw` on Linux)    |
| Link to samples      | [VowPal Wabbit samples](https://github.com/JohnLangford/vowpal_wabbit/wiki/Examples) |
| Related tools      |LightGBM, MXNet, XGBoost   |


## Weka
|    |           |
| ------------- | ------------- |
| What is it?   |  A collection of machine-learning algorithms for data-mining tasks. The algorithms can be either applied directly to a data set or called from your own Java code. Weka contains tools for data pre-processing, classification, regression, clustering, association rules, and visualization. |
| Supported editions     | Windows, Linux     |
| Typical uses      | General machine-learning tool     |
| How to use or run it      | On Windows, search for Weka on the **Start** menu. On Linux, sign in with X2Go, and then go to **Applications** > **Development** > **Weka**. |
| Link to samples      | [Weka samples](https://www.cs.waikato.ac.nz/ml/weka/documentation.html) |
| Related tools      |LightGBM, Rattle, XGBoost   |

## XGBoost 
|    |           |
| ------------- | ------------- |
| What is it?   |   A fast, portable, and distributed gradient-boosting (GBDT, GBRT, or GBM) library for Python, R, Java, Scala, C++, and more. It runs on a single machine, and on Apache Hadoop and Spark.    |
| Supported editions     | Windows, Linux     |
| Typical uses      | General machine-learning library      |
| How is it configured or installed?      |  Installed with GPU support   |
| How to use or run it      | As a Python library (2.7 and 3.5), R package, and on-path command-line tool (`C:\dsvm\tools\xgboost\bin\xgboost.exe` for Windows and `/dsvm/tools/xgboost/xgboost` for Linux)    |
| Links to samples      | Samples are included on the VM, in `/dsvm/tools/xgboost/demo` on Linux, and `C:\dsvm\tools\xgboost\demo` on Windows.   |
| Related tools      | LightGBM, MXNet   |

## Apache Drill
|    |           |
| ------------- | ------------- |
| What is it?   | Open-source SQL query engine on big data    |
| Supported DSVM versions      | Windows 2019, Linux  |
| How is it configured and installed on the DSVM?      |  Installed in `/dsvm/tools/drill*` in embedded mode only   |
| Typical uses      |  For in-place data exploration without requiring extract, transform, load (ETL). Query different data sources and formats, including CSV, JSON, relational tables, and Hadoop.     |
| How to use and run it      | Desktop shortcut  <br/> [Get started with Drill in 10 minutes](https://drill.apache.org/docs/drill-in-10-minutes/)  |
| Related tools on the DSVM      |   Rattle, Weka, SQL Server Management Studio      |


