---
title: Supported languages
titleSuffix: Azure Data Science Virtual Machine 
description: The supported program languages and related tools preinstalled on the Data Science Virtual Machine.
keywords: data science tools, data science virtual machine, tools for data science, linux data science
services: machine-learning
ms.service: data-science-vm
ms.custom: devx-track-python

author: jesscioffi
ms.author: jcioffi
ms.topic: conceptual
ms.reviewer: franksolomon
ms.date: 04/22/2024

---

# Languages supported on the Data Science Virtual Machine

To build artificial intelligence (AI) applications, the Data Science Virtual Machine (DSVM) includes with several prebuilt languages and development tools:

## Python

| Category | Value |
|--|--|
| Language versions supported | Python 3.8 |
| Supported DSVM editions | Windows Server 2019, Linux |
| How is it configured and installed on the DSVM? | Multiple `conda` environments include different, preinstalled Python packages. Run `conda env list` to list all available environments in your machine. |

### How to use and run it

* At a command prompt:

  Use one of these methods, depending on the version of Python you want to run:

    ```
    conda activate <conda_environment_name>
    python --version
    ```
    
* Use in an IDE:

  The DSVM images have several IDEs installed - for example, VS.Code or PyCharm. You can use them to edit, run, and debug your Python scripts.

* Use in Jupyter Lab:

  Open a Launcher tab in Jupyter Lab, and select the type and kernel of your new document. To place your document in a specific folder, first navigate to that folder in the File Browser on the left side.

* Install Python packages:

  To install a new package, you must first activate the proper environment. The proper environment is the location where your new package will be installed. The package will then only become available in that environment.

  To activate an environment, run `conda activate <environment_name>`. Once the environment is activated, you can use a package manager -for example, `conda` or `pip` - to install or update a package.

  As an alternative, if you use Jupyter, you can also run `!pip install --upgrade <package_name>` in a cell to install packages directly.

## R

| Category | Value |
|--|--|
| Language versions supported | CRAN R 4.0.5 |
| Supported DSVM editions | Linux, Windows |

### How to use and run it

* Run at a command prompt:

  Open a command prompt and type `R`.

* Use in Jupyter Lab

  Open a Launcher tab in Jupyter Lab, and select the type and kernel of your new document. To place your document in a specific folder, first navigate to that folder in the File Browser on the left side.

* Install R packages:

  You can install new R packages with the `install.packages()` function.

## Julia

| Category | Value |
| ------------- | ------------- |
| Language versions supported | 1.0.5 |
| Supported DSVM editions      | Linux, Windows     |

### How to use and run it    

* Run at a command prompt

  Open a command prompt and run `julia`.

* Use in Jupyter:

  Open a Launcher tab in Jupyter Lab, and select the type and kernel of your new document. To place your document in a specific folder, first navigate to that folder in the File Browser on the left side.

* Install Julia packages:

  You can install or update packages with Julia package manager commands like `Pkg.add()`.

## Other languages

**C#**: Available on Windows and accessible through the Visual Studio Community edition. You can also run the `csc` command at the `Developer Command Prompt for Visual Studio`.

**Java**: OpenJDK is available on both the Linux and Windows DSVM editions. It's set on the path. To use Java, type the `javac` or `java` command at a command prompt in Windows, or on the bash shell in Linux.

**Node.js**: Node.js is available on both the Linux and Windows editions of the DSVM. It's set on the path. To access Node.js, type the `node` or `npm` command at a Windows command prompt or in a Linux Bash shell. On Windows, the Visual Studio extension for the Node.js tools is installed. It provides a graphical IDE for Node.js application development.

**F#**: Available on Windows and accessible through the Visual Studio Community edition or at a `Developer Command Prompt for Visual Studio`, where you can run the `fsc` command.