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
# Persisting Changes & Dealing with Large Files

## Execution Isolation, Portability, and Reproducibility
Azure ML Experimentation Service allows you to configure different execution targets, some are local -- such as local computer or a Docker container on a local computer, some are remote -- such as a Docker container in a remote machine, or an HDInsight cluster. Reference the [Configuration Experimentation Execution](experiment-execution-configuration.md) article for more details. Before any execution can happen, the project folder is copied into that compute target. This is true even in case of a local execution where a local temp folder is used for this purpose. 

The purpose of this design is to ensure execution isolation, reproducibility, and portability. If you execute the same script twice, in the same compute target or a different compute target, you are guaranteed to receive the same results. The changes made by the first execution shouldn't affect the second execution. With this design, we can treat compute targets as stateless computation resources with no affinity to the jobs executed after they are finished.

## Challenges
With the benefits of portability and repeatability, this design also brings some unique challenges:
### Persisting state changes
If your script modifies state on the compute context, the changes are not persisted for your next execution, nor are they propagated back to the client machine automatically. 

More concretely, if your script creates a sub folder, or writes out a file, you will not find such folder or file in your project directory post execution. They are left in a temp folder on the compute target environment wherever it happens to be. They might be used for debugging purposes, but you can never take dependencies on their existence.

### Dealing with large files in project folder

If your project folder contains any large files, your incur latency when the project folder is copied to the target compute environment at the beginning of each execution. Even if the execution happens locally, it is still unnecessary disk traffic that should be avoided. This is why we currently cap the maximum project size limit at 25 MB right now.

## Option 1: Use the **Outputs** Folder
This is the preferred option if your script produces files, and you expect these files change with every experiment run, and you want to keep a history of these files. The common use case is that if you train a model, or create a dataset, or plot a graph as an image file as part of your model training execution. And you want to compare these outputs across runs, and you want to go back and select an output file (such as a model) produced by a previous run, and use it for a subsequent task (such as scoring).

Essentially, you can write file(s) into a folder named `outputs` relative to the root directory. This is a special folder that receives special treatment by the Experimentation Service. Anything your script creates in there during the execution, such as a model file, a data file, or a plotted image file (collectively known as _artifacts_), are copied into the Azure Blob Storage account associated with your Experimentation account after the run is finished. They become part of your run history record.

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

## Option 2: Use the Shared Folder
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

For a more complete example, please see the `iris_sklearn_shared_folder.py` file in the _Classifying Iris_ sample project.

Before you can use this feature, you have to set some simple configurations in the `.compute` file representing the targeted execution context in the `aml_config` folder. The actual path to this folder can vary depending on the compute target you choose and the value you configure.

### Configure Local Compute Context
To enable this feature on a local compute context, simply add the following line to your `.compute` file representing _local_ environment (typically named `local.compute`).
```
# local.runconfig
...
nativeSharedDirectory: ~/.azureml/share
...
```
The `~/.azureml/share` is the default base folder path. You can change it to any local absolute path accessible by the script run. Experimentation account name, Workspace name, and Project name are automatically appended to the base directory, which makes up the full path of the shared directory. For example, the files can be written to (and retrieved from) the following path if you use the above default value:

```
# on Windows
C:\users\<username>\.azureml\share\<exp_acct_name>\<workspace_name>\<proj_name>\

# on macOS
/Users/<username>/.azureml/share/<exp_acct_name>/<workspace_name>/<proj_name>/
```

### Configure Docker Compute Context (Local or Remote)
To enable this feature on a Docker compute context, you need to add the following two lines to your local or remote Docker `.compute` file.
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

## Option 3: Use an External Durable Storage

You of course are free to use an external durable store to persist state during execution. This is useful in following scenarios:
- Your input data is already stored in a durable storage accessible from the target compute environment.
- These files don't need to be part of the run history records.
- These files need to shared by executions across different compute environment.
- These files need to survive the compute context itself.

One such example is to use Azure blob storage from your Python/PySpark code.

Here is a quick example of using Azure blob storage from Python code:
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

Here is also a quick example for attaching any arbitrary Azure Blob Storage to an HDI Spark runtime:
```python
def attach_storage_container(spark, account, key):
    config = spark._sc._jsc.hadoopConfiguration()
    setting = "fs.azure.account.key." + account + ".blob.core.windows.net"
    if not config.get(setting):
        config.set(setting, key)
 
attach_storage_container(spark, "<storage account name>", "<storage key>”)
```

## Conclusion
Since Azure ML executes scripts by copying the entire project folder into the target compute context, special care must be given to large input, output, and intermediary files. You can use the special `outputs` folder, the shared folder accessible through `AZUREML_NATIVE_SHARE_DIRECTORY` environment variable, or external durable storage for large file transactions. 

## Next Steps
- Review [Configuring Experimentation Execution](experiment-execution-configuration-reference.md).
- See how [Classifying Iris](tutorial-classifying-iris-part-1.md) tutorial project uses `outputs` folder to persist trained model.