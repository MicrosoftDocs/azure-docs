---
title: Where to save and write experiment files on a compute target | Microsoft Docs
description: Where to save and write files on compute target for Azure Machine Learning experiments.
services: machine-learning
author: rastala
ms.author: roastala
manager: danielsc
ms.reviewer: jmartens, jasonwhowell, mldocs
ms.service: machine-learning
ms.component: core
ms.workload: data-services
ms.topic: article
ms.date: 05/27/2019

---
# Where to save and write files for Azure Machine Learning experiments

In this article, you learn where to save your experiment scripts and dependency files for easy access on a compute target, and where to write files from your experiments.

By design, when launching training runs on a compute target, they are isolated from outside environments. The purpose of this design is to ensure the isolation, reproducibility, and portability of the experiment. If you run the same script twice, on the same or another compute target, you receive the same results. With this design, you can treat compute targets as stateless computation resources, each having no affinity to the jobs that are run after they are finished.

## Save experiment files

Before you can initiate an experiment on a compute target or your local machine, you must ensure that the necessary files are available to that compute target, such as dependency files and data files for your code needs to run.

Azure Machine Learning executes training scripts by copying the entire script folder to the target compute context. For this reason, we suggest the following methods for saving your experiment files that are required for your training runs.

* **For small datasets and dependency files:** Place the files in the same folder directory as your training script. Specify this folder as your `source_directory` directly in your training script, or in the code that calls your training script.

* **For large datasets and dependency files:** Store your files in an Azure Machine Learning [datastore](https://docs.microsoft.com/python/api/azureml-core/azureml.data?view=azure-ml-py).  It has the advantages of accessing data from a remote compute target, which means things like authentication and mounting are managed by Azure Machine Learning service. Learn more about specifying a datastore as your source directory, and uploading files to your datastore in the [Access data from your datastores](how-to-access-data.md) article.

### Experiment snapshots

For experiments, Azure Machine Learning also makes a snapshot of your code based on the directory you suggest when you configure the run. This has a total limit of 300MB and 2000 files. If you exceed this limit, you'll see the following error:

```Python
While attempting to take snapshot of .
Your total snapshot size exceeds the limit of 300.0 MB
```

Try one of the following solutions to resolve the error.

If you,

* **Require large files for your experiment.** Try moving files to a datastore and specifying the datastore as your source directory. This prevents you from running into latency when the script folder is copied to the target compute environment at the beginning of the run.

* **Need more storage, and don't want to use a datastore:** you can override this maximum by setting the max size to whatever your experiment requires.

    ```Python
    import azureml._restclient.snapshots_client
    azureml._restclient.snapshots_client.SNAPSHOT_MAX_SIZE_BYTES = 'insert_desired_size'
    ```

* **Use pipelines.**
    * Use a different subdirectory for each step.
    * Create an ignore file. See *Continue using the specified script directory*.

* **Continue using the specified script directory.** Make an ignore file to prevent files from being included in the snapshot that are not really a part of the source code.

     * Create a `.gitignore` or `.amlignore ` file in the directory and add the files to it. The `.amlignore` file uses the same syntax and patterns as the `.gitignore` file. If both files exist, the `.amlignore` file takes precedence.

* **Run experiments via Jupyter notebooks.** Move your notebook into a new, empty, subdirectory with the following steps. You are likely using a directory that has more than 300 MB worth of data or files inside.

    1. Create a new folder.
    1. Move Jupyter notebook into empty folder.
    1. Run the code again.

## Where to write files

Due to the isolation of training experiments, the changes to files that happen during runs are not necessarily persisted outside of your environment.
If your script modifies the files local to compute, the changes are not persisted for your next execution, and they're not propagated back to the client machine automatically. Therefore, the changes made during the first experiment run don't and shouldn't  affect those in the second.

Write files to one of the following:
>[!Important]
> Two folders, *outputs* and *logs*, receive special treatment by Azure Machine Learning. During training, when you write files to`./outputs` and` ./logs` folders, the files will automatically upload to your run history, so that you have access to them once your run is finished.

 1. For small files, write files to "./outputs" folder so they are persisted as artifacts in run history. If you write large files to the "./outputs" folder, you incur latency when the contents of the folder are uploaded to run history.

 1. For large files, write files to Azure Machine Learning datastore. See [Access data from your datastores](how-to-access-data.md).

 1. Write files to "./logs" folder to save them as logs in run history. The logs are uploaded in real time, so this method is suitable for streaming live updates from a remote run.

## Next steps

- Learn more about [accessing data from your datastores](how-to-access-data.md).

- Learn more about [How to Set Up Training Targets](how-to-set-up-training-targets.md).