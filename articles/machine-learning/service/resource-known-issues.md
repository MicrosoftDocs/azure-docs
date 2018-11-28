---
title: Known Issues and Troubleshooting for Azure Machine Learning service
description: Get a list of the known issues, workarounds, and troubleshooting
services: machine-learning
author: j-martens
ms.author: jmartens
ms.reviewer: mldocs
ms.service: machine-learning
ms.component: core
ms.topic: article
ms.date: 10/01/2018 
---
# Known issues and troubleshooting Azure Machine Learning service
 
This article helps you find and correct errors or failures encountered when using the Azure Machine Learning service. 

## SDK installation issues

**Error message: Cannot uninstall 'PyYAML'** 

Azure Machine Learning SDK for Python: PyYAML is a distutils installed project. Therefore, we cannot accurately determine which files belong to it in the event of a partial uninstall. To continue installing the SDK while ignoring this error, use:
```Python 
pip install --upgrade azureml-sdk[notebooks,automl] --ignore-installed PyYAML
```

## Image building failure

Image building failure when deploying web service. Workaround is to add "pynacl==1.2.1" as a pip dependency to Conda file for image configuration.  

## Pipelines
An error occurs when calling PythonScriptStep multiple times in a row without changing the script or parameters. Workaround is to rebuild the PipelineData object.

## FPGAs
You will not be able to deploy models on FPGAs until you have requested and been approved for FPGA quota. To request access, fill out the quota request form: https://aka.ms/aml-real-time-ai

## Databricks

Databricks and Azure Machine Learning issues.

1. Databricks cluster recommendation:
   
   Create your Azure Databricks cluster as v4.x with Python 3. We recommend a high concurrency cluster.
 
2. AML SDK install failure on Databricks when more packages are installed.

   Some packages, such as `psutil`, can cause conflicts. To avoid installation errors,  install packages by freezing lib version. This issue is related to Databricks and not related to Azure ML SDK - you may face it with other libs too. Example:
   ```python
   pstuil cryptography==1.5 pyopenssl==16.0.0 ipython==2.2.0
   ```
   Alternatively, you can use init scripts if you keep facing install issues with Python libs. This approach is not an officially supported approach. You can refer to [this doc](https://docs.azuredatabricks.net/user-guide/clusters/init-scripts.html#cluster-scoped-init-scripts).

3. When using Automated Machine Learning on Databricks, if you see `Import error: numpy.core.multiarray failed to import`

   Workaround: import Python library `numpy==1.14.5` to your Databricks cluster using Create a library to [install and attach](https://docs.databricks.com/user-guide/libraries.html#create-a-library).


## Diagnostic logs
Sometimes it can be helpful if you can provide diagnostic information when asking for help. 
Here is where the log files live:

## Resource quotas

Learn about the [resource quotas](how-to-manage-quotas.md) you might encounter when working with Azure Machine Learning.

## Get more support

You can submit requests for support and get help from technical support, forums, and more. [Learn more...](support-for-aml-services.md)
