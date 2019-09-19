---
title: Data exploration and visualization tools
titleSuffix: Azure Data Science Virtual Machine 
description: Data exploration and visualization tools for the Data Science Virtual Machine.
keywords: data science tools, data science virtual machine, tools for data science, linux data science
services: machine-learning
ms.service: machine-learning
ms.subservice: data-science-vm

author: vijetajo
ms.author: vijetaj
ms.topic: conceptual
ms.date: 03/16/2018
---

# Data exploration and visualization tools on the Azure Data Science Virtual Machine

In data science, the key is to understand the data. Visualization and data exploration tools help accelerate data understanding. The following tools, which are provided on the Data Science Virtual Machine (DSVM), make this key step easier.

## Apache Drill
|    |           |
| ------------- | ------------- |
| What is it?   | Open-source SQL query engine on big data    |
| Supported DSVM versions      | Windows, Linux  |
| How is it configured and installed on the DSVM?      |  Installed in `/dsvm/tools/drill*` in embedded mode only   |
| Typical uses      |  For in-place data exploration without requiring extract, transform, load (ETL). Query different data sources and formats, including CSV, JSON, relational tables, and Hadoop.     |
| How to use and run it      | Desktop shortcut  <br/> [Get started with Drill in 10 minutes](https://drill.apache.org/docs/drill-in-10-minutes/)  |
| Related tools on the DSVM      |   Rattle, Weka, SQL Server Management Studio      |

## Weka
|    |           |
| ------------- | ------------- |
| What is it?   |  A collection of machine-learning algorithms for data mining tasks. These algorithms can either be applied directly to a dataset or called from your own Java code. Weka contains tools for data preprocessing, classification, regression, clustering, association rules, and visualization. |
| Supported DSVM Editions     | Windows, Linux     |
| Typical uses      | General machine-learning tool     |
| How to use and run it      | On Windows, search for Weka on the Start menu. On Linux, sign in with X2Go, and then go to Applications > Development > Weka. |
| Links to Samples      | [Weka samples](https://www.cs.waikato.ac.nz/ml/weka/documentation.html) |
| Related tools on the DSVM      |LightGBM, Rattle, Xgboost   |

## Rattle
|    |           |
| ------------- | ------------- |
| What is it?   |   A graphical user interface (GUI) for data mining using R   |
| Supported DSVM Editions     | Windows, Linux     |
| Typical uses      | General UI Data Mining tool for R    |
| How to use and run it      | UI tool. On Windows, open a command prompt, run R, and then inside R, run `rattle()`. On Linux, connect with X2Go, start a terminal, run R, and then inside R, run `rattle()`. |
| Links to samples      | [Rattle](https://togaware.com/onepager/) |
| Related tools on the DSVM      |LightGBM, Weka, Xgboost   |

## Power BI Desktop 
|    |           |
| ------------- | ------------- |
| What is it?   | Interactive data visualization and BI tool    |
| Supported DSVM versions      | Windows  |
| Typical uses      |  Data visualization and building dashboards   |
| How to use and run it      | Desktop shortcut (`C:\Program Files\Microsoft Power BI Desktop\bin\PBIDesktop.exe`)      |
| Related tools on the DSVM      |   Visual Studio 2019, Visual Studio Code, Juno      |

