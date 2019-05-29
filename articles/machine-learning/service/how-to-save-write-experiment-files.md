---
title: Prevent storage limitations and experiment latency with input and output directories
description: In this article, you learn where to save your experiment input files, and where to write output files to prevent storage limitation errors and experiment latency.
services: machine-learning
author: rastala
ms.author: roastala
manager: danielsc
ms.reviewer: jmartens, jasonwhowell, mldocs
ms.service: machine-learning
ms.component: core
ms.workload: data-services
ms.topic: article
ms.date: 05/28/2019

---
# Where to save and write files for Azure Machine Learning experiments

In this article, you learn where to save input files, and where to write output files from your experiments to prevent storage limit errors and experiment latency.

When launching training runs on a [compute target](how-to-set-up-training-targets.md), they are isolated from outside environments. The purpose of this design is to ensure reproducibility and portability of the experiment. If you run the same script twice, on the same or another compute target, you receive the same results. With this design, you can treat compute targets as stateless computation resources, each having no affinity to the jobs that are running after they are finished.

## Where to save input files

Before you can initiate an experiment on a compute target or your local machine, you must ensure that the necessary files are available to that compute target, such as dependency files and data files your code needs to run.

Azure Machine Learning executes training scripts by copying the entire script folder to the target compute context. For this reason, we suggest the following methods for saving your experiment files that are required for your training runs.

* **For small data and dependency files:** Place the files in the same folder directory as your training script. Specify this folder as your `source_directory` directly in your training script, or in the code that calls your training script.

* **For large data and dependency files:** Store your files in an Azure Machine Learning [datastore](https://docs.microsoft.com/python/api/azureml-core/azureml.data?view=azure-ml-py).  It has the advantages of accessing data from a remote compute target, which means things like authentication and mounting are managed by Azure Machine Learning service. Learn more about specifying a datastore as your source directory, and uploading files to your datastore in the [Access data from your datastores](how-to-access-data.md) article.

<a name="limits"></a>

### Storage limits of experiment snapshots

For experiments, Azure Machine Learning also makes an experiment snapshot of your code based on the directory you suggest when you configure the run. This has a total limit of 300 MB and/or 2000 files. If you exceed this limit, you'll see the following error:

```Python
While attempting to take snapshot of .
Your total snapshot size exceeds the limit of 300.0 MB
```

Try one of the following solutions to resolve the error.

Experiment&nbsp;requirement|Storage limit solution
---|---
Very large files| Move files to a datastore, and specify the datastore as your source_directory to prevent latency issues when the script folder is copied to the compute target environment at runtime.
Many/ large files, but don't want a datastore| Override limit by setting SNAPSHOT_MAX_SIZE_BYTES to whatever your experiment needs. <br> `azureml._restclient.snapshots_client.SNAPSHOT_MAX_SIZE_BYTES = 'insert_desired_size'`
Must use specific script directory| Make an ignore file (`.gitignore` or `.amlignore`) to prevent files from being included in the experiment snapshot that are not really a part of the source code. Place this file in the directory and add the files names to ignore in it. The `.amlignore` file uses the same syntax and patterns as the `.gitignore` file. If both files exist, the `.amlignore` file takes precedence.
Pipeline|Use a different subdirectory for each step or create an ignore file.
Jupyter notebooks| You are likely using a directory that has more than 300 MB worth of data or files inside. Move your notebook into a new, empty, subdirectory with the following steps.  <br> 1. Create a new folder.<br> 2. Move Jupyter notebook into empty folder. <br> 3. Run the code again.

## Where to write files

Due to the isolation of training experiments, the changes to files that happen during runs are not necessarily persisted outside of your environment.
If your script modifies the files local to compute, the changes are not persisted for your next execution, and they're not propagated back to the client machine automatically. Therefore, the changes made during the first experiment run don't and shouldn't  affect those in the second.

Write files to one of the following:
>[!Important]
> Two folders, *outputs* and *logs*, receive special treatment by Azure Machine Learning. During training, when you write files to`./outputs` and`./logs` folders, the files will automatically upload to your run history, so that you have access to them once your run is finished.

 1. For small files, write files to "./outputs" folder so they are persisted as artifacts in run history. If you write large files to the "./outputs" folder, you incur latency when the contents of the folder are uploaded to run history.

 1. For large files, write files to Azure Machine Learning datastore. See [Access data from your datastores](how-to-access-data.md).

 1. Write files to "./logs" folder to save them as logs in run history. The logs are uploaded in real time, so this method is suitable for streaming live updates from a remote run.

## Next steps

* Learn more about [accessing data from your datastores](how-to-access-data.md).

* Learn more about [How to Set Up Training Targets](how-to-set-up-training-targets.md).
