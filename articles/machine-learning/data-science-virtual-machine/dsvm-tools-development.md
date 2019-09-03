---
title: Development tools
titleSuffix: Azure Data Science Virtual Machine 
description: Learn about the tools and integrated development environments available on the Data Science Virtual Machine.
keywords: data science tools, data science virtual machine, tools for data science, linux data science
services: machine-learning
ms.service: machine-learning
ms.subservice: data-science-vm

author: vijetajo
ms.author: vijetaj
ms.topic: conceptual
ms.date: 09/11/2017
---

# Development tools on the Azure Data Science Virtual Machine

The Data Science Virtual Machine (DSVM) bundles several popular tools in a highly productive integrated development environment (IDE). Here are some tools that are provided on the DSVM.

## Visual Studio 2019  

|    |           |
| ------------- | ------------- |
| What is it?   | General purpose IDE      |
| Supported DSVM versions      | Windows      |
| Typical uses      | Software development    |
| How is it configured and installed on the DSVM?      | Data Science Workload (Python and R tools), Azure workload (Hadoop, Data Lake), Node.js, SQL Server tools, [Azure Machine Learning for Visual Studio Code](https://github.com/Microsoft/vs-tools-for-ai)    |
| How to use and run it      | Desktop shortcut (`C:\Program Files (x86)\Microsoft Visual Studio\2019\Community\Common7\IDE\devenv.exe`)    |
| Related tools on the DSVM      |     Visual Studio Code, RStudio, Juno  |

## Visual Studio Code 

|    |           |
| ------------- | ------------- |
| What is it?   | General purpose IDE      |
| Supported DSVM versions      | Windows, Linux     |
| Typical uses      | Code editor and Git integration   |
| How to use and run it      | Desktop shortcut (`C:\Program Files (x86)\Microsoft VS Code\Code.exe`) in Windows, desktop shortcut or terminal (`code`) in Linux    |
| Related tools on the DSVM      |     Visual Studio 2019, RStudio, Juno  |

## RStudio  Desktop 

|    |           |
| ------------- | ------------- |
| What is it?   | Client IDE for R language   |
| Supported DSVM versions      | Windows, Linux      |
| Typical uses      |  R development     |
| How to use and run it      | Desktop shortcut (`C:\Program Files\RStudio\bin\rstudio.exe`) on Windows, desktop shortcut (`/usr/bin/rstudio`) on Linux      |
| Related tools on the DSVM      |   Visual Studio 2019, Visual Studio Code, Juno      |

## RStudio  Server 

|    |           |
| ------------- | ------------- |
| What is it?   | Client IDE for R language   |
| What is it?   | Web-based IDE for R    |
| Supported DSVM versions      | Linux      |
| Typical uses      |  R development     |
| How to use and run it      | Enable the service with _systemctl enable rstudio-server_, and then start the service with _systemctl start rstudio-server_. Then sign in to RStudio Server at http:\//your-vm-ip:8787.       |
| Related tools on the DSVM      |   Visual Studio 2019, Visual Studio Code, RStudio Desktop      |

## Juno 

|    |           |
| ------------- | ------------- |
| What is it?   | Client IDE for Julia language   |
| Supported DSVM versions      | Windows, Linux      |
| Typical uses      |  Julia development     |
| How to use and run it      | Desktop shortcut (`C:\JuliaPro-0.5.1.1\Juno.bat`) on Windows, desktop shortcut (`/opt/JuliaPro-VERSION/Juno`) on Linux      |
| Related tools on the DSVM      |   Visual Studio 2019, Visual Studio Code, RStudio      |

## Pycharm

|    |           |
| ------------- | ------------- |
| What is it?   | Client IDE for Python language    |
| Supported DSVM versions      | Linux      |
| Typical uses      |  Python development     |
| How to use and run it      | Desktop shortcut (`/usr/bin/pycharm`) on Linux      |
| Related tools on the DSVM      |   Visual Studio 2019, Visual Studio Code, RStudio      |



## Power BI Desktop 

|    |           |
| ------------- | ------------- |
| What is it?   | Interactive data visualization and BI tool    |
| Supported DSVM versions      | Windows  |
| Typical uses      |  Data visualization and building dashboards   |
| How to use and run it      | Desktop shortcut (`C:\Program Files\Microsoft Power BI Desktop\bin\PBIDesktop.exe`)      |
| Related tools on the DSVM      |   Visual Studio 2019, Visual Studio Code, Juno      |

