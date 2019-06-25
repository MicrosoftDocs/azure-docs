---
title: Data exploration and visualization tools - Azure | Microsoft Docs
description: Data exploration and visualization tools for the Data Science Virtual Machine.
keywords: data science tools, data science virtual machine, tools for data science, linux data science
services: machine-learning
documentationcenter: ''
author: gopitk
manager: cgronlun


ms.assetid: 
ms.service: machine-learning
ms.subservice: data-science-vm
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 03/16/2018
ms.author: gokuma

---

# Data exploration and visualization tools on the Data Science Virtual Machine

A key step in data science is to understand the data. Visualization and data exploration tools help accelerate data understanding. Here are some tools provided on the DSVM that make this key step easier. 

## Apache Drill
|    |           |
| ------------- | ------------- |
| What is it?   | Open source SQL query engine on Big data    |
| Supported DSVM Versions      | Windows, Linux  |
| How is it configured / installed on the DSVM?      |  Installed in `/dsvm/tools/drill*` in embedded mode only   |
| Typical Uses      |  In-situ Data exploration without requiring ETL. Query different data sources and formats including CSV, JSON, relational tables, Hadoop     |
| How to use / run it?      | Desktop Shortcut  <br/> [Get started with Drill in 10 minutes](https://drill.apache.org/docs/drill-in-10-minutes/)  |
| Related Tools on the DSVM      |   Rattle, Weka, SQL Server Management Studio      |

## Weka
|    |           |
| ------------- | ------------- |
| What is it?   |  Weka is a collection of machine learning algorithms for data mining tasks. The algorithms can either be applied directly to a dataset or called from your own Java code. Weka contains tools for data pre-processing, classification, regression, clustering, association rules, and visualization. |
| Supported DSVM Editions     | Windows, Linux     |
| Typical Uses      | General ML Tool     |
| How to use / run it?      | On Windows, search for Weka in the Start Menu. On Linux, sign in with X2Go, then navigate to Applications -> Development -> Weka. |
| Links to Samples      | [Weka samples](https://www.cs.waikato.ac.nz/ml/weka/documentation.html) |
| Related Tools on the DSVM      |LightGBM, Rattle, Xgboost   |

## Rattle
|    |           |
| ------------- | ------------- |
| What is it?   |   A Graphical User Interface for Data Mining using R   |
| Supported DSVM Editions     | Windows, Linux     |
| Typical Uses      | General UI Data Mining tool for R    |
| How to use / run it?      | UI tool. On Windows, start a Command Prompt, run R, then inside R run `rattle()`. On Linux, connect with X2Go, start a terminal, run R, then inside R run `rattle()`. |
| Links to Samples      | [Rattle](https://togaware.com/onepager/) |
| Related Tools on the DSVM      |LightGBM, Weka, Xgboost   |

## Power BI Desktop 
|    |           |
| ------------- | ------------- |
| What is it?   | Interactive Data Visualization and BI Tool    |
| Supported DSVM Versions      | Windows  |
| Typical Uses      |  Data Visualization and building Dashboards   |
| How to use / run it?      | Desktop Shortcut (`C:\Program Files\Microsoft Power BI Desktop\bin\PBIDesktop.exe`)      |
| Related Tools on the DSVM      |   Visual Studio 2019, Visual Studio Code, Juno      |

