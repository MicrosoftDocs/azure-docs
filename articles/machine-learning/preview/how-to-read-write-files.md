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
# Persisting changes and working with large files
With the Azure Machine Learning Experimentation service, you can configure a variety of execution targets. Some targets are local, such as a local computer or a Docker container on a local computer. Others are remote, such as a Docker container on a remote machine or an HDInsight cluster. For more information, see [Overview of Azure Machine Learning experiment execution service](experiment-execution-configuration.md). 

Before you can execute on a target, you must copy the project folder to the compute target. You do so even with a local execution where you're using a local temp folder for this purpose. 

## Execution isolation, portability, and reproducibility
The purpose of this design is to ensure the isolation, reproducibility, and portability of the execution. If you execute the same script twice, on the same compute target or another compute target, you receive the same results. The changes made by the first execution shouldn't affect the second execution. With this design, you can treat compute targets as stateless computation resources, with no affinity to the jobs that are executed after they are finished.

## Challenges
Even though it provides the benefits of portability and repeatability, this design also brings some unique challenges:

### Persisting state changes
If your script modifies the state of the compute context, the changes are not persisted for your next execution and they're not propagated back to the client machine automatically. 

More specifically, if your script creates a subfolder or writes a file, that folder or file will not be present in your project directory after execution. They are stored in a temp folder on the compute target environment, wherever it happens to be. You might use them for debugging purposes, but you cannot rely on their existence.

### Working with large files in the project folder

If your project folder contains any large files, you incur latency when the folder is copied to the target compute environment at the beginning of an execution. Even if the execution happens locally, there is still unnecessary disk traffic to avoid. For this reason, we currently cap the maximum project size at 25 MB.

## Option 1: Use the outputs folder
This is the preferred option if all of the following apply:
* Your script produces files.
* You expect the files to change with every experiment.
* You want to keep a history of these files. 

The common use cases are:
* Training a model
* Creating a dataset
* Plotting a graph as an image file as part of your model-training execution 

Additionally, you want to compare the outputs across runs, select an output file (such as a model) that was produced by a previous run, and then use it for a subsequent task (such as scoring).

You can write files to a folder named *outputs* relative to the root directory. This is a special folder that receives special treatment by the Experimentation Service. Anything your script creates in there during the execution, such as a model file, a data file, or a plotted image file (collectively known as _artifacts_), are copied into the Azure Blob Storage account associated with your Experimentation account after the run is finished. They become part of your run history record.

Here is a quick example for storing a model in the `outputs` folder:
```python
import os
import pickle

# m is a scikit-learn model. 
# we serialize it into a mode.plk file under the ./outputs folder.
with open(os.path.join('.', 'outputs', 'model.pkl'), 'wb') as f:    
    pickle.dump(m, f)
```
You can download any _artifact_ by browsing to the **Output Files** section of the run detail page of a particular run in Azure ML Workbench, select it, and click on the **Download** button. Or, you can use the `az ml asset download` command from the CLI window.

To see a more complete example, please see the `iris_sklearn.py` Python script in the _Classifying Iris_ sample project.

## Option 2: use the shared folder
Using a shared folder that can be accessed across independent runs can be a great option for the following scenarios, as long as you don't need to keep a history of these files for each run: 
- Your script needs to load data from local files, such as csv files or a directory of text or image files, as training or test data. 
- Your script processes raw data, and writes out intermediate results, such as featurized training data from text/image files, that are used in a subsequent training run. 
- Your script spits out a model, and your subsequent scoring script needs to pick up the model and use it for evaluation. 

An important caveat is that the shared folder lives locally on the same compute target you choose. Hence this only works if all your script runs referencing this shared folder are executed on the same compute target, and the compute target is not recycled between runs.

The shared folder feature allows you to read from or write to a special folder identified by an environment variable, `AZUREML_NATIVE_SHARE_DIRECTORY`. 

### Example
Here is some sample Python code for using this share folder to read and write a text file:
```python
import os

# write to the shared folder
with open(os.environ['AZUREML_NATIVE_SHARE_DIRECTORY'] + 'test.txt', 'wb') as f:
    f.write(“Hello World”)

# read from the shared folder
with open(os.environ['AZUREML_NATIVE_SHARE_DIRECTORY'] + 'test.txt', 'r') as f:
    text = file.read()
```

For a more complete example, see the `iris_sklearn_shared_folder.py` file in the _Classifying Iris_ sample project.

Before you can use this feature, you have to set some simple configurations in the `.compute` file representing the targeted execution context in the `aml_config` folder. The actual path to this folder can vary depending on the compute target you choose and the value you configure.

### Configure local compute context

To enable this feature on a local compute context, simply add the following line to your `.compute` file representing _local_ environment (typically named `local.compute`).
```
# local.runconfig
...
nativeSharedDirectory: ~/.azureml/share
...
```

The `~/.azureml/share` is the default base folder path. You can change it to any local absolute path accessible by the script run. Experimentation account name, Workspace name, and Project name are automatically appended to the base directory, which makes up the full path of the shared directory. For example, the files can be written to (and retrieved from) the following path if you use the preceding default value:

```
# on Windows
C:\users\<username>\.azureml\share\<exp_acct_name>\<workspace_name>\<proj_name>\

# on macOS
/Users/<username>/.azureml/share/<exp_acct_name>/<workspace_name>/<proj_name>/
```

### Configure Docker compute context (local or remote)
To enable this feature on a Docker compute context, you need to add the following two lines to your local or remote Docker _.compute_ file.

```
# docker.compute
...
sharedVolumes: true
nativeSharedDirectory: ~/.azureml/share
...
```
>[!IMPORTANT]
>`sharedVolume` must be set to `true` when you use the `AZUREML_NATIVE_SHARE_DIRECTORY` environment variable to access the shared folder, otherwise the execution will fail.

The code running in the Docker container always sees this shared folder as `/azureml-share/`. This folder path as seen by Docker container is not configurable. And you should not take dependency on this folder name in your code. Instead, always use the environment variable name `AZUREML_NATIVE_SHARE_DIRECTORY` to address this folder. It is mapped to a local folder on the Docker host machine/compute context. The base directory of this local folder is the configurable value of the `nativeSharedDirectory` setting in the `.compute` file. The local path of the shared folder on the host machine, if you use the default value above, is the following:
```
# Windows
C:\users\<username>\.azureml\share\<exp_acct_name>\<workspace_name>\<proj_name>\

# macOS
/Users/<username>/.azureml/share/<exp_acct_name>/<workspace_name>/<proj_name>/

# Ubuntu Linux
/home/<username>/.azureml/share/<exp_acct_name>/<workspace_name>/<proj_name>/
```

>[!TIP]
>Notice the path of the shared folder on the local disk is the same between a local compute context and a local Docker compute context. This means you can even share files between a local run and a local Docker run.

You can place input data directly in these folders and expect that your local or Docker runs on that machine can pick them up. You can also write files to this folder from your local or Docker runs, and expect files get persisted in that folder, surviving the execution lifecycle.

For more information on the configuration files in Azure ML Execution Service, please refer to this article: [Execution Configuration Files](experiment-execution-configuration-reference.md).

>[!NOTE]
>The `AZUREML_NATIVE_SHARE_DIRECTORY` environment variable is not supported in HDInsight compute context. However, it is easy to achieve the same result by explicitly using an absolute WASB path to read from/write to the attached Blob storage.

## Option 3: Use external durable storage

You of course are free to use external durable store to persist state during execution. This is useful in following scenarios:
- Your input data is already stored in a durable storage accessible from the target compute environment.
- These files don't need to be part of the run history records.
- These files need to shared by executions across different compute environment.
- These files need to survive the compute context itself.

One such example is to use Azure Blob storage from your Python/PySpark code. Here is a short example:

```python
from azure.storage.blob import BlockBlobService
import glob
import os

ACCOUNT_NAME = "<your blob storage account name>"
ACCOUNT_KEY = "<account key>"
CONTAINER_NAME = "<container name>"

blob_service = BlockBlobService(account_name=ACCOUNT_NAME, account_key=ACCOUNT_KEY)

## Create a new container if necessary, or use an existing one
my_service.create_container(CONTAINER_NAME, fail_on_exist=False, public_access=PublicAccess.Container)

# df is a pandas DataFrame
df.to_csv('mydata.csv', sep='\t', index=False)

# Export the mydata.csv file to blob storage.
for name in glob.iglob('mydata.csv'):
    blob_service.create_blob_from_path(CONTAINER_NAME, 'single_file.csv', name)
```

Here is a short example for attaching any arbitrary Azure Blob storage to an HDI Spark runtime:
```python
def attach_storage_container(spark, account, key):
    config = spark._sc._jsc.hadoopConfiguration()
    setting = "fs.azure.account.key." + account + ".blob.core.windows.net"
    if not config.get(setting):
        config.set(setting, key)
 
attach_storage_container(spark, "<storage account name>", "<storage key>”)
```

## Conclusion
Because Azure ML executes scripts by copying the entire project folder into the target compute context, take special care with large input, output, and intermediary files. You can use the special `outputs` folder, the shared folder that's accessible through `AZUREML_NATIVE_SHARE_DIRECTORY` environment variable, or external durable storage for large file transactions. 

## Next steps
- Review [Configuring Experimentation Execution](experiment-execution-configuration-reference.md).
- See how [Classifying Iris](tutorial-classifying-iris-part-1.md) tutorial project uses `outputs` folder to persist trained model.