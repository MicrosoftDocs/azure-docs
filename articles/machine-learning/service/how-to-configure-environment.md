---
title: How to configure a development environment for Azure Machine Learning  | Microsoft Docs
description: This how-to guide explains how to configure a development environment when working with Azure Machine Learning.
services: machine-learning
author: rastala
ms.author: roastala
manager:  danielsc
ms.service: machine-learning
ms.workload: data-services
ms.custom: mvc
ms.topic: conceptual
ms.date: 8/6/2018
---

# How to configure a development environment for Azure Machine Learning 

You'll learn about configuring following develop environments:

* Jupyter Notebooks on your own computer
* Visual Studio Code
* Code editor of your choice

The recommended approach is to use Continuum Anaconda [conda virtual environments](https://conda.io/docs/user-guide/tasks/manage-environments.html) to isolate your working environment so as to avoid dependency conflicts between packages. This article shows the steps of setting up a conda environment and using it for Azure Machine Learning.

## Pre-requisites

 * [Continuum Anaconda](https://anaconda.org/anaconda/continuum-docs) or [Miniconda](https://conda.io/miniconda.html) package manager installed

 * For Visual Studio Code environment, [Python Extension installed](https://code.visualstudio.com/docs/python/python-tutorial)

## Jupyter Notebooks on your own computer

 1. Create conda environment

    Open command-line editor, and enter following commands

     ```shell
    # create a new conda environment with Python 3.6, numpy and cython
    $ conda create -n myenv Python=3.6 cython numpy

    # activate the conda environment
    $ conda activate myenv

    # If you are running Mac OS you should run
    $ source activate myenv
    ```
 2. Install Azure ML SDK with notebook extras

     ```shell
    (myenv) $ pip install --upgrade azureml-sdk[notebooks]
    ```

 3. Install additional packages

    To install packages you need for your machine learning experimentation, such as Scikit-Learn or Tensorflow, invoke

    ```
    (myenv) $ conda install <new package>
    ```

 4. Install a conda-aware Jupyter Notebook server, and install and enable run history widgets
    ```shell
    # install Jupyter 
    (myenv) $ conda install nb_conda

    # install run history widget
    (myenv) $ jupyter nbextension install --py --user azureml.train.widgets

    # enable run history widget
    (myenv) $ jupyter nbextension enable --py --user azureml.train.widgets
    ```

 5. Launch Jupyter Notebook

      ```shell
    (myenv) $ jupyter notebook
    ```

 6. Select notebook kernel with Azure ML SDK installation

    Open a new notebook, and select "myenv" as your kernel. Then validate that you have Azure ML SDK installed by running following command in a notebook cell.

    ```python
    import azureml.core
    azureml.core.VERSION
    ```

## Visual Studio Code

 1. Create conda environment

    Open command-line editor, and enter following commands

    ```shell
    # create a new conda environment with Python 3.6, numpy and cython
    $ conda create -n myenv Python=3.6 cython numpy

    # activate the conda environment
    $ conda activate myenv

    # If you are running Mac OS you should run
    $ source activate myenv
    ```

 2. Install Azure ML SDK
 
     ```shell
    (myenv) $ pip install --upgrade azureml-sdk
    ```

 3. Install VS Code Tools for AI

 4. Install additional packages

    To install packages you need for your machine learning experimentation, such as Scikit-Learn or Tensorflow, invoke

    ```
    (myenv) $ conda install <new package>
    ```

 5. Launch Visual Studio Code and select Python interpreter

    Launch VS Code, and enter CTRL-SHIFT-P to get to Command Palette. Then invoke *Python: Select Interpreter*. and select the conda environment you created.

    VS Code is automatically aware of conda environments on your computer. For more information, see [VS code documentation](https://code.visualstudio.com/docs/python/environments#_conda-environments).

 6. Validate Azure ML SDK installation

    In VS Code, create a new Python script file with following code. Then run it to validate that Azure ML is installed

    ```python
    import azureml.core
    azureml.core.VERSION
    ```

## Code Editor of Your Choice

To use a custom code editor with Azure ML SDK, first create conda environment as described above. Then follow the instructions for each editor to use the conda environment, for example:

 * [PyCharm](https://www.jetbrains.com/help/pycharm/2018.2/conda-support-creating-conda-virtual-environment.html)
 




