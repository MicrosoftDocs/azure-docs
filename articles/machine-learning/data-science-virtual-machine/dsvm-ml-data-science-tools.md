---
title: Machine learning and data science tools - Azure | Microsoft Docs
description: Machine learning and data science tools
keywords: data science tools, data science virtual machine, tools for data science, linux data science
services: machine-learning
documentationcenter: ''
author: gopitk
manager: cgronlun


ms.assetid: 
ms.service: machine-learning
ms.component: data-science-vm
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 03/16/2018
ms.author: gokuma

---

# Machine learning and data science tools
Azure Data Science Virtual Machines has a rich set of tools and libraries for machine learning (ML) available in popular languages, such as Python, R, and Julia. 

Here are some of the ML tools and libraries on Data Science Virtual Machines. 

## [Azure Machine Learning](https://docs.microsoft.com/azure/machine-learning/service/overview-what-is-azure-ml) SDK
|    |           |
| ------------- | ------------- |
| What is it?   |   Azure Machine Learning is a cloud service that you can use to develop and deploy ML models. You can track your models as you build, train, scale, and manage them by using the Python SDK. Deploy models as containers and run them in the cloud, on-premises, or on Azure IoT Edge.   |
| Supported editions     | Windows (conda environment: AzureML), Linux (conda environment: py36)    |
| Typical uses      | General ML platform      |
| How is it configured or installed?      |  Installed with GPU support   |
| How to use or run it      | As Python SDK and Azure CLI. Activate to the conda environment `AzureML` on Windows edition *or* to `py36` on Linux edition.      |
| Link to samples      | Sample Jupyter notebooks are included in the `AzureML` directory under notebooks.  |
| Related tools      | Visual Studio Code, Jupyter   |

## XGBoost 
|    |           |
| ------------- | ------------- |
| What is it?   |    XGBoost is a fast, portable, and distributed gradient boosting (GBDT, GBRT, or GBM) library for Python, R, Java, Scala, C++, and more. It runs on a single machine, Hadoop, and Spark.    |
| Supported editions     | Windows, Linux     |
| Typical uses      | General ML library      |
| How is it configured or installed?      |  Installed with GPU support   |
| How to use or run it      | As Python library (2.7 and 3.5), R package, and on path command-line tool (`C:\dsvm\tools\xgboost\bin\xgboost.exe` for Windows, `/dsvm/tools/xgboost/xgboost` for Linux)    |
| Links to samples      | Samples are included on the VM, in `/dsvm/tools/xgboost/demo` on Linux, and `C:\dsvm\tools\xgboost\demo` on Windows.   |
| Related tools      | LightGBM, MXNet   |



## Vowpal Wabbit
|    |           |
| ------------- | ------------- |
| What is it?   |   Vowpal Wabbit (also known as "VW") is an open-source, fast, out-of-core learning system library.    |
| Supported editions     | Windows, Linux     |
| Typical uses      | General ML library      |
| How is it configured or installed?      |  Windows--msi installer, Linux--apt-get |
| How to use or run it      | As an on-path command-line tool (`C:\Program Files\VowpalWabbit\vw.exe` on Windows, `/usr/bin/vw` on Linux)    |
| Link to samples      | [VowPal Wabbit samples](https://github.com/JohnLangford/vowpal_wabbit/wiki/Examples) |
| Related tools      |LightGBM, MXNet, XGBoost   |


## Weka
|    |           |
| ------------- | ------------- |
| What is it?   |  Weka is a collection of ML algorithms for data mining tasks. The algorithms can be either applied directly to a data set or called from your own Java code. Weka contains tools for data pre-processing, classification, regression, clustering, association rules, and visualization. |
| Supported editions     | Windows, Linux     |
| Typical uses      | General ML tool     |
| How to use or run it      | On Windows, search for Weka on the Start menu. On Linux, sign in with X2Go, and then go to **Applications** > **Development** > **Weka**. |
| Link to samples      | [Weka samples](http://www.cs.waikato.ac.nz/ml/weka/documentation.html) |
| Related tools      |LightGBM, Rattle, XGBoost   |

## Rattle
|    |           |
| ------------- | ------------- |
| What is it?   |   Rattle is a graphical user interface for data mining by using R.   |
| Supported editions     | Windows, Linux     |
| Typical uses      | General UI data mining tool for R    |
| How to use or run it      | UI tool. On Windows, start a command prompt, run R, and then inside R run `rattle()`. On Linux, connect with X2Go, start a terminal, run R, and then inside R run `rattle()`. |
| Link to samples      | [Rattle](https://togaware.com/onepager/) |
| Related tools      |LightGBM, Weka, XGBoost   |

## LightGBM
|    |           |
| ------------- | ------------- |
| What is it?   | LightGBM is a fast, distributed, high-performance gradient boosting (GBDT, GBRT, GBM, or MART) framework based on decision tree algorithms. It's used for ranking, classification, and many other ML tasks.    |
| Supported versions      | Windows, Linux    |
| Typical uses      | General-purpose gradient boosting framework      |
| How is it configured or installed?      | On Windows, LightGBM is installed as a Python package. On Linux, the command-line executable is in `/opt/LightGBM/lightgbm`, the R package is installed, and Python packages are installed.     |
| Link to samples      | [LightGBM Guide](https://github.com/Microsoft/LightGBM/tree/master/examples/python-guide)   |
| Related tools      | MXNet, XgBoost  |

## H2O
|    |           |
| ------------- | ------------- |
| What is it?   | H2O is an open-source AI platform that supports in-memory, distributed, fast, and scalable ML.  |
| Supported versions      | Linux   |
| Typical uses      | General-purpose distributed, scalable ML   |
| How is it configured or installed?      | H2O is installed in `/dsvm/tools/h2o`.      |
| How to use or run it      | Connect to the VM by using X2Go. Start a new terminal, and run `java -jar /dsvm/tools/h2o/current/h2o.jar`. Then start a web browser and connect to `http://localhost:54321`.      |
| Link to samples      | Samples are available on the VM in Jupyter under the `h2o` directory.      |
| Related tools      | Apache Spark, MXNet, XGBoost, Sparkling Water, Deep Water    |

There are several other ML libraries on Data Science Virtual Machines, such as the popular `scikit-learn` package that comes as part of the Anaconda Python distribution that's installed on Data Science Virtual Machines. To check out the list of packages available in Python, R, and Julia, run the respective package managers.
