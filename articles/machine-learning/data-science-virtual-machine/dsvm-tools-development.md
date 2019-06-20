---
title: Data Science Virtual Machine development tools - Azure | Microsoft Docs
description: Learn about the tools and integrated development environments that are pre-installed on the Data Science Virtual Machine.
keywords: data science tools, data science virtual machine, tools for data science, linux data science
services: machine-learning
documentationcenter: ''
author: gopitk
manager: cgronlun
ms.custom: seodec18

ms.assetid: 
ms.service: machine-learning
ms.subservice: data-science-vm
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 09/11/2017
ms.author: gokuma

---

# Development tools on the Data Science Virtual Machine

The Data Science Virtual Machine (DSVM) provides a productive environment for your development by bundling several popular tools and IDE. Here are some tools that are provided on the DSVM. 

## Visual Studio 2019  

|    |           |
| ------------- | ------------- |
| What is it?   | General Purpose IDE      |
| Supported DSVM Versions      | Windows      |
| Typical Uses      | Software Development    |
| How is it configured / installed on the DSVM?      | Data Science Workload (Python and R tools), Azure workload (Hadoop, Data Lake), Node.js, SQL Server tools, [Azure Machine Learning for Visual Studio Code](https://github.com/Microsoft/vs-tools-for-ai)    |
| How to use / run it?      | Desktop Shortcut (`C:\Program Files (x86)\Microsoft Visual Studio\2019\Community\Common7\IDE\devenv.exe`)    |
| Related Tools on the DSVM      |     Visual Studio Code, RStudio, Juno  |

## Visual Studio Code 

|    |           |
| ------------- | ------------- |
| What is it?   | General Purpose IDE      |
| Supported DSVM Versions      | Windows, Linux     |
| Typical Uses      | Code editor and Git integration   |
| How to use / run it?      | Desktop Shortcut (`C:\Program Files (x86)\Microsoft VS Code\Code.exe`) in Windows, desktop shortcut or terminal (`code`) in Linux    |
| Related Tools on the DSVM      |     Visual Studio 2019, RStudio, Juno  |

## RStudio  Desktop 

|    |           |
| ------------- | ------------- |
| What is it?   | Client IDE for R    |
| Supported DSVM Versions      | Windows, Linux      |
| Typical Uses      |  R development     |
| How to use / run it?      | Desktop Shortcut (`C:\Program Files\RStudio\bin\rstudio.exe`) on Windows, Desktop Shortcut (`/usr/bin/rstudio`) on Linux      |
| Related Tools on the DSVM      |   Visual Studio 2019, Visual Studio Code, Juno      |

## RStudio  Server 

|    |           |
| ------------- | ------------- |
| What is it?   | Web-based IDE for R    |
| Supported DSVM Versions      | Linux      |
| Typical Uses      |  R development     |
| How to use / run it?      | Enable the service with _systemctl enable rstudio-server_, then start the service with _systemctl start rstudio-server_. You can then sign in to RStudio Server at http:\//your-vm-ip:8787.       |
| Related Tools on the DSVM      |   Visual Studio 2019, Visual Studio Code, RStudio Desktop      |

## Juno 

|    |           |
| ------------- | ------------- |
| What is it?   | Client IDE for Julia language   |
| Supported DSVM Versions      | Windows, Linux      |
| Typical Uses      |  Julia development     |
| How to use / run it?      | Desktop Shortcut (`C:\JuliaPro-0.5.1.1\Juno.bat`) on Windows, Desktop Shortcut (`/opt/JuliaPro-VERSION/Juno`) on Linux      |
| Related Tools on the DSVM      |   Visual Studio 2019, Visual Studio Code, RStudio      |

## Pycharm

|    |           |
| ------------- | ------------- |
| What is it?   | Client IDE for Python language    |
| Supported DSVM Versions      | Linux      |
| Typical Uses      |  Python development     |
| How to use / run it?      | Desktop Shortcut (`/usr/bin/pycharm`) on Linux      |
| Related Tools on the DSVM      |   Visual Studio 2019, Visual Studio Code, RStudio      |



## PowerBI Desktop 

|    |           |
| ------------- | ------------- |
| What is it?   | Interactive Data Visualization and BI Tool    |
| Supported DSVM Versions      | Windows  |
| Typical Uses      |  Data Visualization and building Dashboards   |
| How to use / run it?      | Desktop Shortcut (`C:\Program Files\Microsoft Power BI Desktop\bin\PBIDesktop.exe`)      |
| Related Tools on the DSVM      |   Visual Studio 2019, Visual Studio Code, Juno      |

