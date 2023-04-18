---
title: Development tools
titleSuffix: Azure Data Science Virtual Machine 
description: Learn about the tools and integrated development environments available on the Data Science Virtual Machine.
keywords: data science tools, data science virtual machine, tools for data science, linux data science
services: machine-learning
ms.service: data-science-vm

author: jesscioffi
ms.author: jcioffi
ms.topic: conceptual
ms.date: 06/23/2022
---

# Development tools on the Azure Data Science Virtual Machine

The Data Science Virtual Machine (DSVM) bundles several popular tools in a highly productive integrated development environment (IDE). Here are some tools that are provided on the DSVM.

## Visual Studio Community Edition

| Category | Value |
|--|--|
| What is it? | General purpose IDE |
| Supported DSVM versions | Windows Server 2019: Visual Studio 2019 |
| Typical uses | Software development |
| How is it configured and installed on the DSVM? | Data Science Workload (Python and R tools), Azure workload (Hadoop, Data Lake), Node.js, SQL Server tools, [Azure Machine Learning for Visual Studio Code](https://github.com/Microsoft/vs-tools-for-ai) |
| How to use and run it | Desktop shortcut (`C:\Program Files (x86)\Microsoft Visual Studio\2019\Community\Common7\IDE\devenv.exe`). Graphically, open Visual Studio by using the desktop icon or the **Start** menu. Search for programs (Windows logo key+S), followed by **Visual Studio**. From there, you can create projects in languages like C#, Python, R, and Node.js. |

> [!NOTE]
> You might get a message that your evaluation period is expired. Enter your Microsoft account credentials. Or create a new free account to get access to Visual Studio Community.

## Visual Studio Code 

| Category | Value |
|--|--|
| What is it? | General purpose IDE |
| Supported DSVM versions | Windows, Linux |
| Typical uses | Code editor and Git integration |
| How to use and run it | Desktop shortcut (`C:\Program Files (x86)\Microsoft VS Code\Code.exe`) in Windows, desktop shortcut or terminal (`code`) in Linux |

## PyCharm

| Category | Value |
|--|--|
| What is it? | Client IDE for Python language |
| Supported DSVM versions | Windows 2019, Linux |
| Typical uses | Python development |
| How to use and run it | Desktop shortcut (`C:\Program Files\tk`) on Windows. Desktop shortcut (`/usr/bin/pycharm`) on Linux |
