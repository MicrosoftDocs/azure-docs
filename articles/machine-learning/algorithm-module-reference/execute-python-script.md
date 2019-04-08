---
title:  "Decision Forest Regression: Module Reference"
titleSuffix: Azure Machine Learning service
description: Learn how to use the Decision Forest Regression module in Azure Machine Learning to create a regression model based on an ensemble of decision trees.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: xiaoharper
ms.author: amlstudiodocs
ms.date: 04/22/2019
ROBOTS: NOINDEX
---
# Execute Python Script

*Executes a Python script from an Azure Machine Learning experiment*

Category: Python Language Modules

## Module overview

This article describes how to use the **Execute Python Script** module in Azure Machine Learning to run Python code. For more information about the architecture and design principles of Python, see [the following article.](https://docs.microsoft.com/azure/machine-learning/machine-learning-execute-python-scripts)

With Python, you can perform tasks that aren't currently supported by existing modules such as:

+ Visualizing data using `matplotlib`
+ Using Python libraries to enumerate datasets and models in your workspace
+ Reading, loading, and manipulating data from sources not supported by the [Import Data](./import-data.md) module

Azure Machine Learning uses the Anaconda distribution of Python, which includes many common utilities for data processing. We will update Anaconda version automatically. Current version is:
 -  Anaconda 4.5+ distribution for Python 3.6 


## How to use Execute Python Script

The **Execute Python Script** module contains sample Python code that you can use as a starting point. To configure the **Execute Python Script** module, you provide a set of inputs and Python code to execute in the **Python script** text box.

1. Add the **Execute Python Script** module to your experiment.

2. Add and connect on **Dataset1** any datasets from the interface that you want to use for input. Reference this dataset in your Python script as **DataFrame1**.

    Use of a dataset is optional, if you want to generate data using Python, or use Python code to import the data directly into the module.

    This module supports addition of a second dataset on **Dataset2**. Reference the second dataset in your Python script as DataFrame2.

    Datasets stored in Azure Machine Learning are automatically converted to **pandas** data.frames when loaded with this module.

    ![Execute Python input map](../media/module/python-module.png)

4. To include new Python packages or code, add the zipped file containing these custom resources  on **Script bundle**. The input to **Script bundle** must be a zipped file already uploaded to your workspace. 

    Any file contained in the uploaded zipped archive can be used during experiment execution. If the archive includes a directory structure, the structure is preserved, but you must prepend a directory called **src** to the path.

5. In the **Python script** text box, type or paste valid Python script.

    The **Python script** text box is pre-populated with some instructions in comments, and sample code for data access and output. **You must edit or replace this code.** Be sure to follow Python conventions about indentation and casing.

    + The script must contain a function named `azureml_main` as the entry point for this module.
    + The entry point function can contain up to two input arguments: `Param<dataframe1>` and `Param<dataframe2>`
    + Zipped files connected to the third input port are unzipped and stored in the directory, `.\Script Bundle`, which is also added to the Python `sys.path`. 

    Therefore, if your zip file contains `mymodule.py`, import it using `import mymodule`.

    + A single dataset can be returned to the interface, which must be a sequence of type `pandas.DataFrame`. You can create other outputs in your Python code and write them directly to Azure storage, or create visualizations using the **Python device**.

6. Run the experiment, or select the module and click **Run selected** to run just the Python script.

    All of the data and code is loaded into a virtual machine, and run using the specified Python environment.

### Results

The module returns these outputs:  
  
+ **Results Dataset 1**. The results of any computations performed by the embedded Python code must be provided as a pandas data.frame, which is automatically converted to the Azure Machine Learning dataset format, so that you can use the results with other modules in the experiment. The module is limited to a single dataset as output. 

+ **Result Dataset 2**
