---
title: 'Reference: Windows DSVM'
description: 'Details on tools included in the Windows Data Science VM'
authoer: gvashishtha
ms.author: gopalv
ms.date: 9.11.2019
ms.topic: reference
---
# Tools installed on the Windows Data Science Virtual Machine

In the following sections, learn more about the tools that come installed on the Data Science Virtual Machine.

## Microsoft Machine Learning Server Developer edition

You can use Microsoft Enterprise Library for your analytics because Machine Learning Server Developer edition is installed on the VM. Previously known as Microsoft R Server, Machine Learning Server is a broadly deployable analytics platform. It's scalable and commercially supported.

Machine Learning Server supports various big data statistics, predictive modeling, and machine learning tasks. It supports the full range of analytics: exploration, analysis, visualization, and modeling. By using and extending open-source R and Python, Machine Learning Server is compatible with R and Python scripts and functions. It's also compatible with CRAN, pip, and Conda packages to analyze data at the enterprise scale.

Machine Learning Server addresses the in-memory limitations of open-source R by adding parallel and chunked processing of data. This means you can run analytics on much bigger data than what fits in main memory. 

Visual Studio Community is included on the VM. It has the R tools for Visual Studio and Python Tools for Visual Studio (PTVS) extensions that provide a full IDE for working with R or Python. We also provide other IDEs like [RStudio](https://www.rstudio.com) and [PyCharm Community Edition](https://www.jetbrains.com/pycharm/) on the VM.

## Python

For development by using Python, Anaconda Python distributions 2.7 and 3.6 are installed. These distributions have the base Python along with about 300 of the most popular math, engineering, and data analytics packages. You can use PTVS, which is installed in Visual Studio Community 2017. Or you can use one of the IDEs bundled with Anaconda, like IDLE or Spyder. Search for and open one of these packages (Windows logo key+S).

> [!NOTE]
> To point the Python Tools for Visual Studio at Anaconda Python 2.7, you need to create custom environments for each version. To set these environment paths in Visual Studio 2017 Community, go to **Tools** > **Python Tools** > **Python Environments**. Then select **+ Custom**.

Anaconda Python 3.6 is installed under C:\Anaconda. Anaconda Python 2.7 is installed under C:\Anaconda\envs\python2. For detailed steps, see the [PTVS documentation](https://docs.microsoft.com/visualstudio/python/installing-python-interpreters).

## The Jupyter Notebook

Anaconda Distribution also comes with the Jupyter Notebook, an environment to share code and analysis. The Jupyter Notebook server is preconfigured with Python 2.7, Python 3.x, PySpark, Julia, and R kernels. To start the Jupyter server and open the browser to access the notebook server, use the **Jupyter Notebook** desktop icon.

We package several sample notebooks in Python and R. After you access Jupyter, the notebooks show how to work with the following technologies:

* Machine Learning Server
* SQL Server Machine Learning Services, in-database analytics
* Python
* Microsoft Cognitive Toolkit
* TensorFlow
* Other Azure technologies

You can find the link to the samples on the notebook home page after you authenticate to the Jupyter Notebook by using the password that you created earlier.

## Visual Studio Community 2017

The DSVM includes Visual Studio Community. This is a free version of the popular IDE from Microsoft that you can use for evaluation purposes and small teams. See the [Microsoft Software License Terms](https://www.visualstudio.com/support/legal/mt171547).

Open Visual Studio by using the desktop icon or the **Start** menu. Search for programs (Windows logo key+S), followed by **Visual Studio**. From there, you can create projects in languages like C#, Python, R, and Node.js. Installed plug-ins make it convenient to work with the following Azure services:

* Azure Data Catalog
* Azure HDInsight for Hadoop and Spark
* Azure Data Lake

A plug-in called Azure Machine Learning for Visual Studio Code also integrates with Azure Machine Learning and helps you rapidly build AI applications.

## Important directories on the VM

| Item | Directory |
| --- | --- |
| Jupyter Notebook server configurations | C:\ProgramData\jupyter |
| Jupyter Notebook samples home directory | C:\dsvm\notebooks and c:\users\\<username\>\notebooks |
| Other samples | C:\dsvm\samples |
| Anaconda, default: Python 3.6 | C:\Anaconda |
| Anaconda Python 2.7 environment | C:\Anaconda\envs\python2 |
| Microsoft Machine Learning Server (standalone) for Python | C:\Program Files\Microsoft\ML Server\PYTHON_SERVER |
| Default R instance, Machine Learning Server (standalone) | C:\Program Files\Microsoft\ML Server\R_SERVER |
| SQL Server Machine Learning Services in-database instance directory | C:\Program Files\Microsoft SQL Server\MSSQL14.MSSQLSERVER |
| Miscellaneous tools | C:\dsvm\tools |

> [!NOTE]
> On the Windows Server 2012 edition of the DSVM and the Windows Server 2016 edition before March 2018, the default Anaconda environment is Python 2.7. The secondary environment is Python 3.5, located at C:\Anaconda\envs\py35.


