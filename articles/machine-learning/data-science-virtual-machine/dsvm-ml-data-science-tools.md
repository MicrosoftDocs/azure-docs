---
title: Machine learning and data science tools - Azure | Microsoft Docs
description: Machine learning and data science tools
keywords: data science tools, data science virtual machine, tools for data science, linux data science
services: machine-learning
documentationcenter: ''
author: bradsev
manager: cgronlun
editor: cgronlun

ms.assetid: 
ms.service: machine-learning
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/16/2018
ms.author: gokuma;bradsev

---

# Machine learning and data science tools
The Data Science Virtual Machine (DSVM) has a rich set of tools and libraries for machine learning available in popular languages like Python, R, Julia. 

Here are some of the machine learning tools and libraries on the DSVM. 

## XGBoost 
|    |           |
| ------------- | ------------- |
| What is it?   |    Fast, Portable, and Distributed Gradient Boosting (GBDT, GBRT, or GBM) Library, for Python, R, Java, Scala, C++ and more. Runs on single machine, Hadoop, Spark    |
| Supported DSVM Editions     | Windows, Linux     |
| Typical Uses      | General ML library      |
| How is it configured / installed on the DSVM?      |  Installed with GPU support   |
| How to use / run it?      | As Python Library (2.7 and 3.5), R package and on path command-line tool (`C:\dsvm\tools\xgboost\bin\xgboost.exe` for Windows, `/dsvm/tools/xgboost/xgboost` for Linux)    |
| Links to Samples      | Samples are included on the VM, in `/dsvm/tools/xgboost/demo` on Linux and `C:\dsvm\tools\xgboost\demo` on Windows   |
| Related Tools on the DSVM      | LightGBM, MXNet   |



## Vowpal Wabbit
|    |           |
| ------------- | ------------- |
| What is it?   |   Vowpal Wabbit (also known as "VW") is an open source fast out-of-core learning system library    |
| Supported DSVM Editions     | Windows, Linux     |
| Typical Uses      | General ML library      |
| How is it configured / installed on the DSVM?      |  Windows - msi installer, Linux - apt-get |
| How to use / run it?      | As a on path Command-line tool (`C:\Program Files\VowpalWabbit\vw.exe` on Windows, `/usr/bin/vw` on Linux)    |
| Links to Samples      | [VowPal Wabbit samples](https://github.com/JohnLangford/vowpal_wabbit/wiki/Examples) |
| Related Tools on the DSVM      |LightGBM, MXNet, XGBoost   |


## Weka
|    |           |
| ------------- | ------------- |
| What is it?   |  Weka is a collection of machine learning algorithms for data mining tasks. The algorithms can either be applied directly to a dataset or called from your own Java code. Weka contains tools for data pre-processing, classification, regression, clustering, association rules, and visualization. |
| Supported DSVM Editions     | Windows, Linux     |
| Typical Uses      | General ML Tool     |
| How to use / run it?      | On Windows, search for Weka in the Start Menu. On Linux, log in with X2Go, then navigate to Applications -> Development -> Weka. |
| Links to Samples      | [Weka samples](http://www.cs.waikato.ac.nz/ml/weka/documentation.html) |
| Related Tools on the DSVM      |LightGBM, Rattle, XGBooost   |

## Rattle
|    |           |
| ------------- | ------------- |
| What is it?   |   A Graphical User Interface for Data Mining using R   |
| Supported DSVM Editions     | Windows, Linux     |
| Typical Uses      | General UI Data Mining tool for R    |
| How to use / run it?      | UI tool. On Windows, start a Command Prompt, run R, then inside R run `rattle()`. On Linux, connect with X2Go, start a terminal, run R, then inside R run `rattle()`. |
| Links to Samples      | [Rattle](https://togaware.com/onepager/) |
| Related Tools on the DSVM      |LightGBM, Weka, XGBoost   |

## LightGBM
|    |           |
| ------------- | ------------- |
| What is it?   | A fast, distributed, high-performance gradient boosting (GBDT, GBRT, GBM, or MART) framework based on decision tree algorithms, used for ranking, classification, and many other machine learning tasks.    |
| Supported DSVM Versions      | Windows, Linux    |
| Typical Uses      | General-purpose gradient boosting framework      |
| How is it configured / installed on the DSVM?      | On Windows, LightGBM is installed as a Python package. On Linux, the command-line executable is in `/opt/LightGBM/lightgbm`, the R package is installed, and Python packages are installed.     |
| Links to Samples      | [LightGBM Guide](https://github.com/Microsoft/LightGBM/tree/master/examples/python-guide)   |
| Related Tools on the DSVM      | MXNet, XgBoost  |

## H2O
|    |           |
| ------------- | ------------- |
| What is it?   | An open-source AI platform supporting in-memory, distributed, fast, and scalable machine learning  |
| Supported DSVM Versions      | Linux   |
| Typical Uses      | General Purpose distributed, scalable ML   |
| How is it configured / installed on the DSVM?      | H2O is installed in `/dsvm/tools/h2o`.      |
| How to use / run it?      | Connect to the VM using X2Go. Start a new terminal and run `java -jar /dsvm/tools/h2o/current/h2o.jar`. Then start a web browser and connect to `http://localhost:54321`.      |
| Links to Samples      | Samples are available on the VM in Jupyter under `h2o` directory.      |
| Related Tools on the DSVM      | Apache Spark, MXNet, XGBoost, Sparkling Water, Deep Water    |

There are several other ML libraries on the DSVM like the popular `scikit-learn` package that comes as part of the Anaconda Python distribution that is installed on the DSVM. Be sure to check out the list of packages available in Python, R, and Julia  by running the respective package managers. 
