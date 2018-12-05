---
title: Read and write large data files | Microsoft Docs
description: Read and write large files in Azure Machine Learning experiments.
services: machine-learning
author: hning86
ms.author: haining
manager: mwinkle
ms.reviewer: jmartens, jasonwhowell, mldocs
ms.service: machine-learning
ms.component: core
ms.workload: data-services
ms.topic: article
ms.date: 09/10/2017

ROBOTS: NOINDEX
---
# Persisting changes and working with large files

[!INCLUDE [workbench-deprecated](../../../includes/aml-deprecating-preview-2017.md)]

With the Azure Machine Learning Experimentation service, you can configure a variety of execution targets. Some targets are local, such as a local computer or a Docker container on a local computer. Others are remote, such as a Docker container on a remote machine or an HDInsight cluster. For more information, see [Overview of Azure Machine Learning experiment execution service](experimentation-service-configuration.md). 

Before you can execute on a target, you must copy the project folder to the compute target. You must do so even with a local execution that uses a local temp folder for this purpose. 

## Execution isolation, portability, and reproducibility
The purpose of this design is to ensure the isolation, reproducibility, and portability of the execution. If you execute the same script twice, on the same or another compute target, you receive the same results. The changes made during the first execution shouldn't affect those in the second execution. With this design, you can treat compute targets as stateless computation resources, each having no affinity to the jobs that are executed after they are finished.

## Challenges
Even though this design provides the benefits of portability and repeatability, it also brings some unique challenges.

### Persisting state changes
If your script modifies the state of the compute context, the changes are not persisted for your next execution, and they're not propagated back to the client machine automatically. 

More specifically, if your script creates a subfolder or writes a file, that folder or file will not be present in your project directory after execution. The files are stored in a temp folder in the compute target environment. You might use them for debugging purposes, but you cannot rely on their permanent existence.

### Working with large files in the project folder

If your project folder contains any large files, you incur latency when the folder is copied to the target compute environment at the beginning of an execution. Even if the execution happens locally, there is still unnecessary disk traffic to avoid. For this reason, we currently cap the maximum project size at 25 MB.

## Option 1: Use the *outputs* folder
This option is preferable if all the following conditions apply:
* Your script produces files.
* You expect the files to change with every experiment.
* You want to keep a history of these files. 

The common use cases are:
* Training a model
* Creating a dataset
* Plotting a graph as an image file as part of your model-training execution 

>[!Note]
> Max size of tracked file in outputs folder after a run is 512 MB. This means if your script produces a file larger than 512 MB in the outputs folder, it is not collected there. 

Additionally, you want to compare the outputs across runs, select an output file (such as a model) that was produced by a previous run, and then use it for a subsequent task (such as scoring).

You can write files to a folder named *outputs* that's relative to the root directory. The folder receives special treatment by the Experimentation service. Anything your script creates in the folder during the execution, such as a model file, data file, or plotted image file (collectively known as _artifacts_), is copied to the Azure Blob storage account that's associated with your experimentation account after the run is finished. The files become part of your run history record.

Here is a short example of code for storing a model in the *outputs* folder:
```python
import os
import pickle

# m is a scikit-learn model. 
# we serialize it into a mode.plk file under the ./outputs folder.
with open(os.path.join('.', 'outputs', 'model.pkl'), 'wb') as f:    
    pickle.dump(m, f)
```
You can download any artifact by browsing to the **Output Files** section of the run detail page of a particular run in Azure Machine Learning Workbench. Simply select the run, and then select the **Download** button. Alternatively, you can enter the `az ml asset download` command in the command-line interface (CLI) window.

For a more complete example, see the `iris_sklearn.py` Python script in the _Classifying Iris_ sample project.

## Option 2: Use the shared folder
If you don't need to keep a history of each run's files, using a shared folder that can be accessed across independent runs can be a great option for the following scenarios: 
- Your script needs to load data from local files, such as .csv files or a directory of text or image files, as training or test data. 
- Your script processes raw data and writes out intermediate results, such as featurized training data from text or image files, which are used in a subsequent training run. 
- Your script spits out a model, and your subsequent scoring script must pick up the model and use it for evaluation. 

It is important to note that the shared folder lives locally on your chosen compute target. Therefore, this option works only if all your script runs that reference this shared folder are executed on the same compute target, and the compute target is not recycled between runs.

By taking advantage of the shared-folder feature, you can read from or write to a special folder that's identified by an environment variable, `AZUREML_NATIVE_SHARE_DIRECTORY`. 

### Example
Here is some sample Python code for using this share folder to read and write to a text file:
```python
import os

# write to the shared folder
with open(os.environ['AZUREML_NATIVE_SHARE_DIRECTORY'] + 'test.txt', "w") as f1:
    f1.write(“Hello World”)

# read from the shared folder
with open(os.environ['AZUREML_NATIVE_SHARE_DIRECTORY'] + 'test.txt', "r") as f2:
    text = f2.read()
```

For a more complete example, see the *iris_sklearn_shared_folder.py* file in the _Classifying Iris_ sample project.

Before you can use this feature, you have to set in the *.compute* file some simple configurations that represent the targeted execution context in the *aml_config* folder. The actual path to the folder can vary depending on the compute target you choose and the value you configure.

### Configure local compute context

To enable this feature in a local compute context, simply add to your *.compute* file the following line, which represents the _local_ environment (usually named *local.compute*).
```
# local.runconfig
...
nativeSharedDirectory: ~/.azureml/share
...
```

The path ~/.azureml/share is the default base folder path. You can change it to any local absolute path that's accessible by the script run. The experimentation account name, workspace name, and project name are automatically appended to the base directory name, which becomes the full path of the shared directory. For example, the files can be written to (and retrieved from) the following path if you use the preceding default value:

```
# on Windows
C:\users\<username>\.azureml\share\<exp_acct_name>\<workspace_name>\<proj_name>\

# on macOS
/Users/<username>/.azureml/share/<exp_acct_name>/<workspace_name>/<proj_name>/
```

### Configure the Docker compute context (local or remote)
To enable this feature on a Docker compute context, you must add the following two lines to your local or remote Docker *.compute* file.

```
# docker.compute
...
sharedVolumes: true
nativeSharedDirectory: ~/.azureml/share
...
```
>[!IMPORTANT]
>The **sharedVolumes** property must be set to *true* when you use the `AZUREML_NATIVE_SHARE_DIRECTORY` environment variable to access the shared folder. Otherwise, the execution fails.

The code running in the Docker container always sees this shared folder as */azureml-share/*. The folder path, as seen by the Docker container, is not configurable. Do not use this folder name in your code. Instead, always use the environment variable name `AZUREML_NATIVE_SHARE_DIRECTORY` to refer to this folder. It is mapped to a local folder on the Docker host machine or compute context. The base directory of this local folder is the configurable value of the `nativeSharedDirectory` setting in the *.compute* file. The local path of the shared folder on the host machine, if you use the default value, is the following:
```
# Windows
C:\users\<username>\.azureml\share\<exp_acct_name>\<workspace_name>\<proj_name>\

# macOS
/Users/<username>/.azureml/share/<exp_acct_name>/<workspace_name>/<proj_name>/

# Ubuntu Linux
/home/<username>/.azureml/share/<exp_acct_name>/<workspace_name>/<proj_name>/
```

>[!NOTE]
>The path of the shared folder on the local disk is the same whether it's a local compute context or a local Docker compute context. This means you can even share files between a local run and a local Docker run.

You can place input data directly in these folders and expect that your local or Docker runs on the machine can pick it up. You can also write files to this folder from your local or Docker runs, and expect files get persisted in that folder, surviving the execution lifecycle.

For more information, see [Azure Machine Learning Workbench execution configuration files](experimentation-service-configuration-reference.md).

>[!NOTE]
>The `AZUREML_NATIVE_SHARE_DIRECTORY` environment variable is not supported in an HDInsight compute context. However, it is easy to achieve the same result by explicitly using an absolute Azure Blob storage path to read from and write to the attached blob storage.

## Option 3: Use external durable storage

You can use external durable storage to persist state during execution. This option is useful in the following scenarios:
- Your input data is already stored in durable storage that's accessible from the target compute environment.
- The files don't need to be part of the run history records.
- The files must be shared by executions across various compute environments.
- The files must be able to survive the compute context itself.

One such approach is to use Azure Blob storage from your Python or PySpark code. Here is a short example:

```python
from azure.storage.blob import BlockBlobService
from azure.storage.blob.models import PublicAccess
import glob
import os

ACCOUNT_NAME = "<your blob storage account name>"
ACCOUNT_KEY = "<account key>"
CONTAINER_NAME = "<container name>"

blob_service = BlockBlobService(account_name=ACCOUNT_NAME, account_key=ACCOUNT_KEY)

## Create a new container if necessary, or use an existing one
blob_service.create_container(CONTAINER_NAME, fail_on_exist=False, public_access=PublicAccess.Container)

# df is a pandas DataFrame
df.to_csv('mydata.csv', sep='\t', index=False)

# Export the mydata.csv file to Blob storage.
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
Because Azure Machine Learning executes scripts by copying the entire project folder to the target compute context, take special care with large input, output, and intermediary files. For large file transactions, you can use the special outputs folder, the shared folder that's accessible through the `AZUREML_NATIVE_SHARE_DIRECTORY` environment variable, or external durable storage. 

## Next steps
- Review the [Azure Machine Learning Workbench execution configuration files](experimentation-service-configuration-reference.md) article.
- See how the [Classifying Iris](tutorial-classifying-iris-part-1.md) tutorial project uses the outputs folder to persist a trained model.
