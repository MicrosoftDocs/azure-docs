---
title:  "Execute Python Script: Module Reference"
titleSuffix: Azure Machine Learning
description: Learn how to use the Execute Python Script module in Azure Machine Learning to run Python code.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: xiaoharper
ms.author: zhanxia
ms.date: 10/22/2019
---
# Execute Python Script module

This article describes a module in Azure Machine Learning designer.

Use this module to run Python code. For more information about the architecture and design principles of Python, see [the following article](https://docs.microsoft.com/azure/machine-learning/machine-learning-execute-python-scripts).

With Python, you can perform tasks that aren't currently supported by existing modules such as:

+ Visualizing data using `matplotlib`
+ Using Python libraries to enumerate datasets and models in your workspace
+ Reading, loading, and manipulating data from sources not supported by the [Import Data](./import-data.md) module
+ Run your own deep learning code 


Azure Machine Learning uses the Anaconda distribution of Python, which includes many common utilities for data processing. We will update Anaconda version automatically. Current version is:
 -  Anaconda 4.5+ distribution for Python 3.6 

The pre-installed packages are:
-  asn1crypto==0.24.0
- attrs==19.1.0
- azure-common==1.1.18
- azure-storage-blob==1.5.0
- azure-storage-common==1.4.0
- certifi==2019.3.9
- cffi==1.12.2
- chardet==3.0.4
- cryptography==2.6.1
- distro==1.4.0
- idna==2.8
- jsonschema==3.0.1
- lightgbm==2.2.3
- more-itertools==6.0.0
- numpy==1.16.2
- pandas==0.24.2
- Pillow==6.0.0
- pip==19.0.3
- pyarrow==0.12.1
- pycparser==2.19
- pycryptodomex==3.7.3
- pyrsistent==0.14.11
- python-dateutil==2.8.0
- pytz==2018.9
- requests==2.21.0
- scikit-learn==0.20.3
- scipy==1.2.1
- setuptools==40.8.0
- six==1.12.0
- torch==1.0.1.post2
- torchvision==0.2.2.post3
- urllib3==1.24.1
- wheel==0.33.1 

 To install other packages not in the pre-installed list, for example *scikit-misc*, add the following code to your script: 

 ```python
import os
os.system(f"pip install scikit-misc")
```

## How to use

The **Execute Python Script** module contains sample Python code that you can use as a starting point. To configure the **Execute Python Script** module, you provide a set of inputs and Python code to execute in the **Python script** text box.

1. Add the **Execute Python Script** module to your pipeline.

2. Add and connect on **Dataset1** any datasets from the designer that you want to use for input. Reference this dataset in your Python script as **DataFrame1**.

    Use of a dataset is optional, if you want to generate data using Python, or use Python code to import the data directly into the module.

    This module supports addition of a second dataset on **Dataset2**. Reference the second dataset in your Python script as DataFrame2.

    Datasets stored in Azure Machine Learning are automatically converted to **pandas** data.frames when loaded with this module.

    ![Execute Python input map](media/module/python-module.png)

4. To include new Python packages or code, add the zipped file containing these custom resources  on **Script bundle**. The input to **Script bundle** must be a zipped file already uploaded to your workspace. 

    Any file contained in the uploaded zipped archive can be used during pipeline execution. If the archive includes a directory structure, the structure is preserved, but you must prepend a directory called **src** to the path.

5. In the **Python script** text box, type or paste valid Python script.

    The **Python script** text box is pre-populated with some instructions in comments, and sample code for data access and output. You must edit or replace this code. Be sure to follow Python conventions about indentation and casing.

    + The script must contain a function named `azureml_main` as the entry point for this module.
    + The entry point function can contain up to two input arguments: `Param<dataframe1>` and `Param<dataframe2>`
    + Zipped files connected to the third input port are unzipped and stored in the directory, `.\Script Bundle`, which is also added to the Python `sys.path`. 

    Therefore, if your zip file contains `mymodule.py`, import it using `import mymodule`.

    + Two datasets can be returned to the designer, which must be a sequence of type `pandas.DataFrame`. You can create other outputs in your Python code and write them directly to Azure storage.

6. Run the pipeline, or select the module and click **Run selected** to run just the Python script.

    All of the data and code is loaded into a virtual machine, and run using the specified Python environment.

## Results

The results of any computations performed by the embedded Python code must be provided as a pandas.DataFrame, which is automatically converted to the Azure Machine Learning dataset format, so that you can use the results with other modules in the pipeline.

The module returns two datasets:  
  
+ **Results Dataset 1**, defined by the first returned pandas dataframe in Python script

+ **Result Dataset 2**, defined by the second returned pandas dataframe in Python script


## Next steps

See the [set of modules available](module-reference.md) to Azure Machine Learning. 