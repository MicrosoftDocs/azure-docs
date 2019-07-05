---
title: Supported languages for the Data Science Virtual Machine
titleSuffix: Azure
description: Learn about the program languages and related tools that are pre-installed on the Data Science Virtual Machine.
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

# Languages supported on the Data Science Virtual Machine 

The Data Science Virtual Machine (DSVM) comes with several pre-built languages and development tools for building your AI applications. Here are some of the salient ones. 

## Python (Windows Server 2016 Edition)

|    |           |
| ------------- | ------------- |
| Language versions Supported | 2.7 and 3.6 |
| Supported DSVM Editions      | Windows Server 2016     |
| How is it configured / installed on the DSVM?  | Two global `conda` environments are created. <br /> * `root` environment located at `/anaconda/` is Python 3.6 . <br/> * `python2` environment located at `/anaconda/envs/python2`is Python 2.7       |
| Links to Samples      | Sample Jupyter notebooks for Python are included     |
| Related Tools on the DSVM      | PySpark, R, Julia      |

> [!NOTE]
> Windows Server 2016 created before March 2018 contains Python 3.5 and Python 2.7. Also Python 2.7 is the conda **root** environment and **py35** is the Python 3.5 environment. 

### How to use / run it?    

* Running in command prompt

Open command prompt and do the following depending on the version of Python you want to run. 

```
# To run Python 2.7
activate python2
python --version

# To run Python 3.6
activate 
python --version

```
* Using in an IDE

Use Python Tools for Visual Studio (PTVS) installed in the Visual Studio Community edition. The only environment setup automatically in PTVS by default is Python 3.6. 

> [!NOTE]
> To point the PTVS at Python 2.7, you need to create a  custom environment in PTVS. To set this environment paths in the Visual Studio  Community Edition, navigate to **Tools** -> **Python Tools** -> **Python Environments** and then click **+ Custom**. Then set the location to `c:\anaconda\envs\python2` and then click _Auto Detect_. 

* Using in Jupyter

Open Jupyter and click on the `New` button to create a new notebook. At this point, you can choose the kernel type as _Python [Conda Root]_ for Python 3.6 and _Python [Conda env:python2]_ for Python 2.7 environment. 

* Installing Python packages

The default Python environments on the DSVM are global environment readable by all users. But only administrators can write / install global packages. In order to install package to the global environment, activate to the root or python2 environment using the `activate` command as an Administrator. Then you can use the package manager like `conda` or `pip` to install or update packages. 

## Python (Linux and Windows Server 2012 Edition)

|    |           |
| ------------- | ------------- |
| Language versions Supported | 2.7 and 3.5 |
| Supported DSVM Editions      | Linux, Windows Server 2012    |
| How is it configured / installed on the DSVM?  | Two global `conda` environments are created. <br /> * `root` environment located at `/anaconda/` is Python 2.7 . <br/> * `py35` environment located at `/anaconda/envs/py35`is Python 3.5       |
| Links to Samples      | Sample Jupyter notebooks for Python are included     |
| Related Tools on the DSVM      | PySpark, R, Julia      |
### How to use / run it?    

**Linux**
* Running in terminal

Open terminal and do the following depending on the version of Python you want to run. 

```
# To run Python 2.7
source activate 
python --version

# To run Python 3.5
source activate py35
python --version

```
* Using in an IDE

Use PyCharm installed in the Visual Studio Community edition. 

* Using in Jupyter

Open Jupyter and click on the `New` button to create a new notebook. At this point, you can choose the kernel type as _Python [Conda Root]_ for Python 2.7 and _Python [Conda env:py35]_ for Python 3.5 environment. 

* Installing Python packages

The default Python environments on the DSVM are global environments readable by all users. But only administrators can write / install global packages. In order to install package to the global environment, activate to the root or py35 environment using the `source activate` command as an Administrator or a user with sudo permission. Then you can use a package manager like `conda` or `pip` to install or update packages. 

**Windows 2012**
* Running in command prompt

Open command prompt and do the following depending on the version of Python you want to run. 

```
# To run Python 2.7
activate 
python --version

# To run Python 3.5
activate py35
python --version

```
* Using in an IDE

Use Python Tools for Visual Studio (PTVS) installed in the Visual Studio Community edition. The only environment setup automatically in PTVS in Python 2.7. 
> [!NOTE]
> To point the PTVS at Python 3.5, you need to create a  custom environment in PTVS. To set this environment paths in the Visual Studio  Community Edition, navigate to **Tools** -> **Python Tools** -> **Python Environments** and then click **+ Custom**. Then set the location to `c:\anaconda\envs\py35` and then click _Auto Detect_. 

* Using in Jupyter

Open Jupyter and click on the `New` button to create a new notebook. At this point, you can choose the kernel type as _Python [Conda Root]_ for Python 2.7 and _Python [Conda env:py35]_ for Python 3.5 environment. 

* Installing Python packages

The default Python environments on the DSVM are global environment readable by all users. But only administrators can write / install global packages. In order to install package to the global environment, activate to the root or py35 environment using the `activate` command as an Administrator. Then you can use the package manager like `conda` or `pip` to install or update packages. 

## R

|    |           |
| ------------- | ------------- |
| Language versions Supported | Microsoft R Open 3.x (100% compatible with CRAN-R<br /> Microsoft R Server 9.x Developer edition (A Scalable Enterprise ready R platform)|
| Supported DSVM Editions      | Linux, Windows     |
| How is it configured / installed on the DSVM?  | Windows: `C:\Program Files\Microsoft\ML Server\R_SERVER` <br />Linux: `/usr/lib64/microsoft-r/3.3/lib64/R`    |
| Links to Samples      | Sample Jupyter notebooks for R are included     |
| Related Tools on the DSVM      | SparkR, Python, Julia      |
### How to use / run it?    

**Windows**:

* Running in command prompt

Open command prompt and just type `R`.

* Using in an IDE

Use RTools for Visual Studio (RTVS) installed in the Visual Studio Community edition or RStudio. These are available on the start menu or as a desktop icon. 

* Using in Jupyter

Open Jupyter and click on the `New` button to create a new notebook. At this point, you can choose the kernel type as _R_ to use Jupyter R kernel (IRKernel). 

* Installing R packages

R is installed on the DSVM in a  global environment readable by all users. But only administrators can write / install global packages. In order to install package to the global environment, run R using one of the methods above. Then you can run the R package manager `install.packages()` to install or update packages. 

**Linux**:

* Running in terminal

Open terminal and just run `R`.  

* Using in an IDE

Use RStudio installed on the Linux DSVM.  

* Using in Jupyter

Open Jupyter and click on the `New` button to create a new notebook. At this point, you can choose the kernel type as _R_ to use Jupyter R kernel (IRKernel). 

* Installing R packages

R is installed on the DSVM in a  global environment readable by all users. But only administrators can write / install global packages. In order to install package to the global environment, run R using one of the methods above. Then you can run the R package manager `install.packages()` to install or update packages. 


## Julia

|    |           |
| ------------- | ------------- |
| Language versions Supported | 0.6 |
| Supported DSVM Editions      | Linux, Windows     |
| How is it configured / installed on the DSVM?  | Windows: Installed at `C:\JuliaPro-VERSION`<br /> Linux: Installed at `/opt/JuliaPro-VERSION`    |
| Links to Samples      | Sample Jupyter notebooks for Julia are included     |
| Related Tools on the DSVM      | Python, R      |
### How to use / run it?    

**Windows**:

* Running in command prompt

Open command prompt and just run `julia`. 
* Using in an IDE

Use `Juno` the Julia IDE installed on the DSVM and available as a desktop shortcut.

* Using in Jupyter

Open Jupyter and click on the `New` button to create a new notebook. At this point, you can choose the kernel type as `Julia VERSION` 

* Installing Julia packages

The default Julia location is a global environment readable by all users. But only administrators can write / install global packages. In order to install package to the global environment, run Julia using one of the methods above. Then you can run the Julia package manager commands like `Pkg.add()` to install or update packages. 


**Linux**:
* Running in terminal.

Open terminal and just run `julia`. 
* Using in an IDE

Use `Juno` the Julia IDE installed on the DSVM and available as an Application menu shortcut.

* Using in Jupyter

Open Jupyter and click on the `New` button to create a new notebook. At this point, you can choose the kernel type as `Julia VERSION` 

* Installing Julia packages

The default Julia location is a global environment readable by all users. But only administrators can write / install global packages. In order to install package to the global environment, run Julia using one of the methods above. Then you can run the Julia package manager commands like `Pkg.add()` to install or update packages. 

## Other languages

**C#**: Available on Windows and accessible through the Visual Studio Community edition or on a `Developer Command Prompt for Visual Studio` where you can just run `csc` command. 

**Java**: OpenJDK is available on both Linux and Windows edition of the DSVM and set on the path. You can type `javac` or `java` command on the command prompt in Windows or on bash shell in Linux to use Java. 

**node.js**: node.js is available on both Linux and Windows edition of the DSVM and set on the path. You can type `node` or `npm` command on the command prompt in Windows or on bash shell in Linux to access node.js. On Windows, the Node.js tools for Visual Studio extension is installed to provide a graphical IDE to develop your node.js application. 

**F#**: Available on Windows and accessible through the Visual Studio Community edition or on a `Developer Command Prompt for Visual Studio` where you can just run `fsc` command. 


