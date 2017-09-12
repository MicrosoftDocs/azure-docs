---
title: How to read and write large data files | Microsoft Docs
description: How to read and write large files in Azure ML experiments.
services: machine-learning
author: hning86
ms.author: haining
manager: mwinkle
ms.reviewer: garyericson, jasonwhowell, mldocs
ms.service: machine-learning
ms.workload: data-services
ms.topic: article
ms.date: 09/10/2017
---
# Reading and Writing Large Data Files

## Execution Isolation, Portability, and Reproducibility
Azure ML Experimentation Service allows you to configure different execution targets, some are local -- such as local computer or a Docker container on a local computer, some are remote -- such as a Docker container in a remote machine, or HDI cluster. Before any execution can happen, the project folder is copied into that compute target. This is true even in the case of a local execution where a local temp folder is used for this purpose. 

The purpose of this design is to ensure execution isolation, reproducibility, and portability. If you execute the same script twice, in the same compute target or a different compute target, you are guaranteed to receive the same results. This is because changes made by the first execution don't affect the second execution. This way we can treat compute targets as purely stateless computation resources with no affinity to the jobs executed after they are finished.

## Challenges of Persisting Files
The preceding design philosophy means if your script changes state on the compute context, these changes are not persisted on the compute context itself. Nor are they propagated back to the client machine, or more materially, the project folder. 

More concretely, if your script creates a sub folder, or writes out a file, you will not find such folder or file in your project directory post execution. They are left in a temp folder on the compute target environment wherever it happens to be. They might be used for debugging purposes, but you can never take dependencies on their existence.

But of course, there is a need to persist state across executions, on the same compute context, or across different compute context. To meet this challenge, there are three different options you can choose from.

## Option 1: Use the _Outputs_ Folder
This is the preferred option if you want to train and persist a model, and use it later for scoring.

Essentially, you can write file(s) into a folder named _outputs_ under the project root directory. This is a special folder that receives special treatment by the Experimentation Service. Anything your script creates in there during the execution, such as a sub folder, a model file, a data file, or a plotted image file (collectively known as _artifacts_), are copied into the Azure Blob Storage account associated with your Experimentation Account after the run is finished, and hence preserved as part of your run history record.

You can see and/or download any _artifacts_ by browsing to the run history detail page of a particular run in Azure ML Workbench, or by using the _az ml history_ command from CLI.

Here is a quick example:
```python
# clf1 is a scikit-learn model
f = open('./outputs/model.pkl', 'wb')
pickle.dump(clf1, f)
f.close()
```

To see a more complete example, follow the [Classifying Iris tutorial](quick-start-iris.md), and pay special attention to [Step 8](#step-8-obtain-the-pickled-model). 

We plan to introduce a _promote_ verb and a _load_ verb to help you access selected artifacts, known as _assets_. This feature is currently still under development.

## Option 2: Use the Shared Folder
Using the _output_ folder in Option 1 means copying files into a Blob store after each run. It certainly carries overhead particularly when the files are large. If you don't need the lineage through run tracking, and you are OK with executing always against the same compute context, you can take advantage of the shared folder feature.

The shared folder feature allows you to write to a special folder identified by an environment variable, _AZUREML_NATIVE_SHARE_DIRECTORY_, configurable through your _.compute_ file under the _aml_config_ folder. You can then retrieve these files later in a different execution on the same compute target.

### Example
Here is some sample Python code for using this share folder to read and write a text file:
```python
import os

# write to the share folder
f = open(os.environ['AZUREML_NATIVE_SHARE_DIRECTORY'] + 'test.txt', 'wb')
f.write(“Hello World”)  
f.close() 

# read from the share folder
f = open(os.environ['AZUREML_NATIVE_SHARE_DIRECTORY'] + 'test.txt', 'r')
text = file.read()
f.close()
```

For a more complete example, see the _iris_sklearn_share_folder.py_ file in the Classifying Iris sample project.

Before you can use this feature, you have to set some simple configurations in the _.compute_ file representing the targeted execution context in the _aml_config_ folder.

### Configure Local Compute Context
To enable this feature on a local compute context, simply add the following line to your local _.compute_ file.
```
nativeSharedDirectory: ~/.azureml/share
```
The _~/.azureml/share_ is the default base folder and it is configurable. You can use any local absolute path accessible by the script run. Experimentation Account name, Workspace name, and Project name are automatically appended to the base directory, which makes up the full path of the shared directory. For example, the files are written to (and retrieved from) the following path if you use the preceding default value:

```
# on Windows
C:\users\<username>\.azureml\share\<exp_acct_name>\<workspace_name>\<proj_name>\

# on macOS
/Users/<username>/.azureml/share/<exp_acct_name>/<workspace_name>/<proj_name>/
```

### Configure Docker Compute Context (Local or Remote)
To enable this feature on a Docker compute context, you need to add the following two lines to your local or remote Docker _.compute_ file.
```
sharedVolumes: true
nativeSharedDirectory: ~/.azureml/share
```
>Note without _sharedVolume_ set to true, the execution will fail. 

The code running in the Docker container will always see this share folder as _/azureml-share/_. This folder name is not configurable. And do NOT take dependency on this folder name in your code. Always use the environment variable name. It is mapped to a local folder on the Docker host machine/compute context of which the base directory is configurable. The local path of the share folder on the host machine, if you use the default value above, is simply:
```
# Windows
C:\users\<username>\.azureml\share\<exp_acct_name>\<workspace_name>\<proj_name>\

# macOS
/Users/<username>/.azureml/share/<exp_acct_name>/<workspace_name>/<proj_name>/

# Ubuntu Linux
/home/<username>/.azureml/share/<exp_acct_name>/<workspace_name>/<proj_name>/
```

For more information on the configuration files in Azure ML Execution Service, please refer to this article: [Execution Configuration Files](experiment-execution-configuration-reference.md).
### HDI Compute Context
The _AZUREML_NATIVE_SHARE_DIRECTORY_ environment variable is not supported in HDI compute context. But it is very easy to achieve the same behavior by using a direct/absolute wasb path to the attached Blob storage.

## Option 3: Use an External Durable Storage

You of course are free to use an external durable store to write your state to if you don't want to leverage run history to automatically track your assets in run history, and your changes need to survive the compute context itself. 
<!-- Commenting out this link because it's currently broken (Gary)
One such example is to [use Azure blob storage from your Python/PySpark code](UsingBlobForStorage.md).
-->

Here is also a quick example for attaching any arbitrary Azure Blob Storage to your Spark runtime:
```python
def attach_storage_container(spark, account, key):
    config = spark._sc._jsc.hadoopConfiguration()
    setting = "fs.azure.account.key." + account + ".blob.core.windows.net"
    if not config.get(setting):
        config.set(setting, key)
 
attach_storage_container(spark, "storage account", "storage key”)
```