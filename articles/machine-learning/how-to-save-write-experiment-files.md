---
title: Where to save & write experiment files
titleSuffix: Azure Machine Learning
description: Learn where to save your experiment input files, and where to write output files to prevent storage limitation errors and experiment latency.
services: machine-learning
author: rastala
ms.author: roastala
manager: danielsc
ms.reviewer: nibaccam
ms.service: machine-learning
ms.subservice: core
ms.workload: data-services
ms.topic: how-to
ms.date: 03/10/2020

---
# Where to save and write files for Azure Machine Learning experiments
[!INCLUDE [applies-to-skus](../../includes/aml-applies-to-basic-enterprise-sku.md)]

In this article, you learn where to save input files, and where to write output files from your experiments to prevent storage limit errors and experiment latency.

When launching training runs on a [compute target](how-to-set-up-training-targets.md), they are isolated from outside environments. The purpose of this design is to ensure reproducibility and portability of the experiment. If you run the same script twice, on the same or another compute target, you receive the same results. With this design, you can treat compute targets as stateless computation resources, each having no affinity to the jobs that are running after they are finished.

## Where to save input files

Before you can initiate an experiment on a compute target or your local machine, you must ensure that the necessary files are available to that compute target, such as dependency files and data files your code needs to run.

Azure Machine Learning runs training scripts by copying the entire script folder to the target compute context, and then takes a snapshot. The storage limit for experiment snapshots is 300 MB and/or 2000 files.

For this reason, we recommend:

* **Storing your files in an Azure Machine Learning [datastore](https://docs.microsoft.com/python/api/azureml-core/azureml.data?view=azure-ml-py).** This prevents experiment latency issues, and has the advantages of accessing data from a remote compute target, which means authentication and mounting are managed by Azure Machine Learning. Learn more about specifying a datastore as your source directory, and uploading files to your datastore in the [Access data from your datastores](how-to-access-data.md) article.

* **If you only need a couple data files and dependency scripts and can't use a datastore,** place the files in the same folder directory as your training script. Specify this folder as your `source_directory` directly in your training script, or in the code that calls your training script.

<a name="limits"></a>

### Storage limits of experiment snapshots

For experiments, Azure Machine Learning automatically makes an experiment snapshot of your code based on the directory you suggest when you configure the run. This has a total limit of 300 MB and/or 2000 files. If you exceed this limit, you'll see the following error:

```Python
While attempting to take snapshot of .
Your total snapshot size exceeds the limit of 300.0 MB
```

To resolve this error, store your experiment files on a datastore. If you can't use a datastore, the below table offers possible alternate solutions.

Experiment&nbsp;description|Storage limit solution
---|---
Less than 2000 files & can't use a datastore| Override snapshot size limit with <br> `azureml._restclient.snapshots_client.SNAPSHOT_MAX_SIZE_BYTES = 'insert_desired_size'`<br> This may take several minutes depending on the number and size of files.
Must use specific script directory| [!INCLUDE [amlinclude-info](../../includes/machine-learning-amlignore-gitignore.md)]
Pipeline|Use a different subdirectory for each step
Jupyter notebooks| Create a `.amlignore` file or move your notebook into a new, empty, subdirectory and run your code again.

## Where to write files

Due to the isolation of training experiments, the changes to files that happen during runs are not necessarily persisted outside of your environment. If your script modifies the files local to compute, the changes are not persisted for your next experiment run, and they're not propagated back to the client machine automatically. Therefore, the changes made during the first experiment run don't and shouldn't affect those in the second.

When writing changes, we recommend writing files to an Azure Machine Learning datastore. See [Access data from your datastores](how-to-access-data.md).

If you don't require a datastore, write files to the `./outputs` and/or `./logs` folder.

>[!Important]
> Two folders, *outputs* and *logs*, receive special treatment by Azure Machine Learning. During training, when you write files to`./outputs` and`./logs` folders, the files will automatically upload to your run history, so that you have access to them once your run is finished.

* **For output such as status messages or scoring results,** write files to the `./outputs` folder, so they are persisted as artifacts in run history. Be mindful of the number and size of files written to this folder, as latency may occur when the contents are uploaded to run history. If latency is a concern, writing files to a datastore is recommended.

* **To save written file as logs in run history,** write files to `./logs` folder. The logs are uploaded in real time, so this method is suitable for streaming live updates from a remote run.

## Next steps

* Learn more about [accessing data from your datastores](how-to-access-data.md).

* Learn more about [How to Set Up Training Targets](how-to-set-up-training-targets.md).
