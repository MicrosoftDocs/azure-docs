---
title: Supported languages
titleSuffix: Azure Data Science Virtual Machine 
description: The supported program languages and related tools pre-installed on the Data Science Virtual Machine.
keywords: data science tools, data science virtual machine, tools for data science, linux data science
services: machine-learning
ms.service: data-science-vm
ms.custom: devx-track-python

author: jesscioffi
ms.author: jcioffi
ms.topic: conceptual
ms.date: 06/23/2022


---

# Languages supported on the Data Science Virtual Machine 

The Data Science Virtual Machine (DSVM) comes with several pre-built languages and development tools for building your
artificial intelligence (AI) applications. Here are some of the notable ones.

## Python

| Category | Value |
|--|--|
| Language versions supported | Python 3.8 |
| Supported DSVM editions | Windows Server 2019, Linux |
| How is it configured / installed on the DSVM? | There is multiple `conda` environments whereby each of these has different Python packages pre-installed. To list all available environments in your machine, run `conda env list`. |

### How to use and run it

* Run at a command prompt:

  Open a command prompt and use one of the following methods, depending on the version of Python you want to run:

    ```
    conda activate <conda_environment_name>
    python --version
    ```
    
* Use in an IDE:

  The DSVM images have several IDEs installed such as VS.Code or PyCharm. You can use them to edit, run and debug your
  Python scripts.

* Use in Jupyter Lab:

  Open a Launcher tab in Jupyter Lab and select the type and kernel of your new document. If you want your document to be
  placed in a certain folder, navigate to that folder in the File Browser on the left side first.

* Install Python packages:

  To install a new package, you need to activate the right environment first. The environment is the place where your
  new package will be installed, and the package will then only be available in that environment.

  To activate an environment, run `conda activate <environment_name>`. Once the environment is activated, you can use
  a package manager like `conda` or `pip` to install or update a package.

  As an alternative, if you are using Jupyter, you can also install packages directly by running
`!pip install --upgrade <package_name>` in a cell.

## R

| Category | Value |
|--|--|
| Language versions supported | CRAN R 4.0.5 |
| Supported DSVM editions | Linux, Windows |

### How to use and run it

* Run at a command prompt:

  Open a command prompt and type `R`.

* Use in Jupyter Lab

  Open a Launcher tab in Jupyter Lab and select the type and kernel of your new document. If you want your document to be
  placed in a certain folder, navigate to that folder in the File Browser on the left side first.

* Install R packages:

  You can install new R packages by using the `install.packages()` function.

## Julia

| Category | Value |
| ------------- | ------------- |
| Language versions supported | 1.0.5 |
| Supported DSVM editions      | Linux, Windows     |


### How to use and run it    

* Run at a command prompt

  Open a command prompt and run `julia`.

* Use in Jupyter:

  Open a Launcher tab in Jupyter and select the type and kernel of your new document. If you want your document to be
  placed in a certain folder, navigate to that folder in the File Browser on the left side first.

* Install Julia packages:

  You can use Julia package manager commands like `Pkg.add()` to install or update packages.


## Other languages

**C#**: Available on Windows and accessible through the Visual Studio Community edition or at the `Developer Command Prompt for Visual Studio`, where you can run the `csc` command.

**Java**: OpenJDK is available on both the Linux and Windows editions of the DSVM and is set on the path. To use Java, type the `javac` or `java` command at a command prompt in Windows or on the bash shell in Linux.

**Node.js**: Node.js is available on both the Linux and Windows editions of the DSVM and is set on the path. To access Node.js, type the `node` or `npm` command at a command prompt in Windows or on the bash shell in Linux. On Windows, the Visual Studio extension for the Node.js tools is installed to provide a graphical IDE to develop your Node.js application.

**F#**: Available on Windows and accessible through the Visual Studio Community edition or at a `Developer Command Prompt for Visual Studio`, where you can run the `fsc` command.
