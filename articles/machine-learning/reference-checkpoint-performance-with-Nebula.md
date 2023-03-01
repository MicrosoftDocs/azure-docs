---
title: Optimize Checkpoint Performance for Large Model Training Jobs with Nebula
titleSuffix: Azure Machine Learning
description: Learn how Nebula can save time, resources, and money for large model training applications
services: machine-learning
ms.service: machine-learning
ms.topic: reference
ms.custom: ----, ----, ----

author: ziqiwang
ms.author: ziqiwang
ms.date: 02/28/2023
ms.reviewer: franksolomon
---

# Large-model Checkpoint Optimization Matters

Learn how to boost checkpoint speed and shrink checkpoint cost for large Azure Machine Learning training models.

## Overview

Azure Container for PyTorch (ACPT) now includes **Nebula**, a fast, simple, disk-less, model-aware checkpoint tool. With Nebula, you can checkpoint distributed large-scale model training jobs with PyTorch. Nebula levers the latest distributed computing technologies to shrink checkpoint times from hours to seconds - a potential 95% to 99.9% time savings. Large-scale training jobs especially benefit from Nebula checkpoint performance.

To make Nebula available for your training jobs, import the `torch_nebula` python package in your script. Nebula has full compatibility with different distributed PyTorch training strategies, including PyTorch Lightning, DeepSpeed, and more. The Nebula API offers a simple way to monitor and view checkpoint lifecycles. The APIs support various model types, and ensure checkpoint consistency and reliability.  

> [!IMPORTANT] 
> The `torch-nebula` package is not available in the public PyPI python package index. This package is only available in the Azure Machine Learning ACPT. To avoid problems, please don't try to install `torch-nebula` from PyPI, or the `pip` command.

In this document, you'll learn how to use Nebula with ACPT on Azure Machine Learning, to quickly checkpoint your model training jobs. Additionally, you'll learn how to view and manage Nebula checkpoint data. You'll also learn how to resume the model training jobs from the last available checkpoint if Azure Machine Learning suffers interruption, failure, or termination.

> [!NOTE]
> Nebula is currently under preview. This means Nebula is not production-ready. At this time, Nebula has no support as a generally-available product. Nebula will have constant updates and improvements to its functions and features. Feel free to offer feedback and suggestions to us at nebulasupport@microsoft.com.
>
> Please visit [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/en-us/support/legal/preview-supplemental-terms/) to learn more.

## Why checkpoint optimization for large model training matters

Machine learning models have become more complex because of growing volumes of data, and the format of that data. Training these complex models can become challenging because of GPU memory capacity limits and lengthy training times. As a result, complex model training, on large datasets, usually involves distributed training. However, distributed architectures often have unexpected faults and node failures. These faults and node failures become increasingly painful as the machine learning model node counts increase.

Checkpoints can help deal with these problems. Periodic checkpoints snapshot the complete model state at a given time. After a failure, the system can use that snapshot to rebuild the model in its state at the time of the snapshot. The training process can then resume at a given epoch.

When large model training operations experience failures and terminations, data scientists and researchers can restore the training process from a previously saved checkpoint. Unfortunately, the process between the checkpoint and the termination itself is wasted, because the computation must re-execute operations to cover the unsaved, intermediate results. Shorter checkpoint intervals could solve this problem. The following diagram shows the time cost to restore a training process from checkpoints:

:::image type="content" source="./media/reference-checkpoint-performance-with-Nebula/checkpoint-time-flow-diagram.png" lightbox="./media/reference-checkpoint-performance-with-Nebula/checkpoint-time-flow-diagram.png" alt-text="Screenshot that shows the time cost to restore a training process from checkpoints.":::

However, the checkpoint save process itself generates large overheads. A TB-sized checkpoint save can often become a training process bottleneck. The synchronized checkpoint process blocks the training process for hours. Checkpoint-related overheads can take up 12% of total training time, on average, and can rise to 43% [(Maeng et al., 2021)](https://cs.stanford.edu/people/trippel/pubs/cpr-mlsys-21.pdf).

To summarize, large model checkpoint management involves heavy storage, and job recovery time overheads. Frequent checkpoint saves, combined with training job resumptions from the latest available checkpoints, become a great challenge.

## Nebula to the Rescue

To train large, distributed models, a reliable and efficient way to save and resume training progress, that avoids data loss and resource waste, becomes helpful. Nebula reduces checkpoint save times and training GPU hour demands. For large model Azure Machine Learning training jobs, Nebula offers faster and easier checkpoint management and saves. In turn, it helps shrink large-scale model training time demands.

Nebula can

* **Boost checkpoint speeds as much as 1000 times** with a simple API that asynchronously works with your training process. Nebula can reduce checkpoint times from hours to seconds - a potential reduction of 95% to 99%.

  :::image type="content" source="media/reference-checkpoint-performance-with-Nebula/nebula-checkpoint-time-savings.png" lightbox="media/reference-checkpoint-performance-with-Nebula/nebula-checkpoint-time-savings.png" alt-text="Screenshot that shows the time savings benefit of Nebula.":::

  This example shows the reduction of checkpoint and end-to-end training time needed for four checkpoint saves of Huggingface GPT2, GPT2-Large, and GPT-XL training jobs. For the medium-sized Huggingface GPT2-XL checkpoint saves (20.6 GB), Nebula achieved a 96.9% time reduction for one checkpoint.
  
  The checkpoint speed gain can still increase with model size and GPU numbers. For example, testing a training point checkpoint save of 97 GB on 128 A100 Nvidia GPUs can shrink from 20 minutes to 1 second.

* **Reduce end-to-end large model training time and computation costs** through checkpoint overhead reduction, and reduction of GPU hours wasted on job recovery. Nebula saves checkpoints asynchronously, and unblocks the training process, to shrink the end-to-end training time. It also allows for more frequent checkpoint saves. This way, you can resume your training from the latest checkpoint after any interruption, and save time and money wasted on job recovery and GPU training hours.

* **Provide full compatibility in PyTorch**. Nebula offers full compatibility with PyTorch, and offers full integration with distributed training frameworks, including DeepSpeed (>=0.7.3), and PyTorch-Lightning (>=1.5.0). You can also use it with different Azure Machine Learning compute targets, such as AmlCompute or AKS.

* **Easily manage your checkpoints** with a Python package that helps list, get, save and load your checkpoints. To show the checkpoint lifecycle, Nebula also provides comprehensive logs on Azure Machine Learning studio. You can choose to save your checkpoints to a local or remote storage location

  - Azure Blob Storage
  - Azure Data Lake Storage
  - NFS

  and access them at any time with a few lines of code.

THIS DOCUMENT ALREADY USED THESE IMAGES:

  The following images show the Nebula checkpointing lifecycle on Azure Machine Learning studio as an example.

  ![image](https://user-images.githubusercontent.com/42362331/220549552-5a6b4ec7-c422-4cf6-87f9-29ae9570e097.png)
  ![image](https://user-images.githubusercontent.com/42362331/220549754-506f0352-a8e2-4942-bdbc-319c26dae85a.png)

## Prerequisites

* An Azure subscription and an Azure Machine Learning workspace. See [Create workspace resources](./quickstart-create-resources.md) for more information about workspace resource creation
* An Azure Machine Learning compute target. See [Manage training & deploy computes](./how-to-create-attach-compute-studio.md) to learn more about compute target creation
* A training script that uses **PyTorch**.
* ACPT-curated (Azure Container for Pytorch) environment. See [Curated environments](resource-curated-environments.md#azure-container-for-pytorch-acpt-preview) to obtain the ACPT image. Learn how to use the curated environment [here](./how-to-use-environments.md)
* An Azure Machine Learning script run configuration file. If you don’t have one, you can follow [this resource](./how-to-set-up-training-targets.md)

## How to Use Nebula

Nebula provides a fast, easy checkpoint experience, right in your existing training script.
Nebula use involves:
- [The ACPT environment](#using-acpt-environment)
- [Nebula initialization](#initializing-nebula)
- [API calls to save and load checkpoints](#call-apis-to-save-and-load-checkpoints)

### Using ACPT environment
[Azure Container for PyTorch (ACPT)](how-to-manage-environments-v2.md?tabs=cli#curated-environments), a curated environment for PyTorch model training, offers Nebula pre-installed. See [Azure Container for PyTorch (ACPT)](https://learn.microsoft.com/en-us/azure/machine-learning/resource-curated-environments#azure-container-for-pytorch-acpt-preview) to learn more about the curated enviroment, and [Enabling Deep Learning with Azure Container for PyTorch in Azure Machine Learning](https://techcommunity.microsoft.com/t5/ai-machine-learning-blog/enabling-deep-learning-with-azure-container-for-pytorch-in-azure/ba-p/3650489) to learn more about the ACPT image.
            
### Initializing Nebula

To enable Nebula in the ACPT environment, you must only modify your training script to import the `torch_nebula` package, and then call the Nebula APIs in the appropriate places. That's it. You can avoid Azure Machine Learning SDK or CLI modification. You can also avoid modification of other steps to train your large model on Azure Machine Learning Platform.

Nebula needs initialization to run in your training script. At the initialization phase, specify the variables that determine the checkpoint save location and frequency, as shown in this code snippet:

```python
  import torch_nebula as tn
  tn.init(persistent_storage_path=<YOUR STORAGE PATH>) # initialize Nebula
```

We plan to integrate Nebula into some trainers, to make initialization simple and easy. If you use a distributed trainer like DeepSpeed, or PyTorch Lightning, this process becomes easier. See these [examples](#examples) to learn how to integrate Nebula in your training scripts.

### Call APIs to save and load checkpoints

Nebula provides APIs to handle checkpoint saves. You can use these APIs in your training scripts, similar to the PyTorch `torch.save()` API. These [examples](#examples) show how to use Nebula in your training scripts.

### View your checkpointing histories
When your training job finishes, navigate to the Job `Name> Outputs + logs` pane. In the left panel, expand the **Nebula** folder, and select checkpointHistories.csv. This shows detailed information about Nebula checkpoint saves - duration, throughput, and checkpoint size.

:::image type="content" source="./media/reference-checkpoint-performance-with-Nebula/checkpoint-save-metadata.png" lightbox="./media/reference-checkpoint-performance-with-Nebula/checkpoint-save-metadata.png" alt-text="Screenshot that shows metadata about the checkpoint saves.":::

## Examples

These examples show how to use Nebula with different framework types. You can choose the example that best fits your training script.

# [Using PyTorch Natively](#tab/PYTORCH)

To enable full Nebula compatibility with PyTorch-based training scripts, modify your training script as needed.

1. First, import the required `torch_nebula` package:

```python
  # Import the Nebula package for fast-checkpointing 
  import torch_nebula as tn
```

1. To initialize Nebula, call the `tn.init()` function in `main()`, as shown here:

```python  
  # Initialize Nebula with variables that helps Nebula to know where and how often to save your checkpoints
  persistent_storage_path="/tmp/test",
  tn.init(persistent_storage_path, persistent_time_interval=2)
```

1. To save checkpoints, replace the original `torch.save()` statement to save your checkpoint with Nebula:

```python
checkpoint = tn.Checkpoint()
checkpoint.save(<'CKPT_NAME'>, model)
```
> [!NOTE]
> ``<'CKPT_TAG_NAME'>`` is the unique ID for the checkpoint. A tag is usually the number of steps, the epoch number, or any user-defined name. The optional ``<'NUM_OF_FILES'>`` optional parameter specifies the state number which you would save for this tag.

1. Load the latest valid checkpoint, as shown here:

```python
latest_ckpt = tn.get_latest_checkpoint()
p0 = latest_ckpt.load(<'CKPT_NAME'>)
```

Since a checkpoint or snapshot may contain many files, you can load one or more of them by the name. In this way, the training state would become the last one saved.

Other APIs can handle checkpoint management

- list all checkpoints
- get latest checkpoints

```python
# Managing checkpoints
## List all checkpoints
ckpts = tn.list_checkpoints()
## Get Latest checkpoint path
latest_ckpt_path = tn.get_latest_checkpoint_path("checkpoint", persisted_storage_path)
```

# [Using DeepSpeed](#tab/DEEPSPEED)

  A training script based on DeepSpeed (>=0.7.3) can lever Nebula, if you enable Nebula in your `ds_config.json` configuration file, as shown:

  ```python
  "nebula": {
        "enabled": true,
        "persistent_storage_path": "<YOUR STORAGE PATH>",
        "persistent_time_interval": 100,
        "num_of_version_in_retention": 2,
        "enable_nebula_load": true
    }
  ```

  This JSON snippets function works like the `torch_nebula.init()` function.

  Initialization with `ds_config.json` file configuration enables Nebula, which enables checkpoint saves in turn. The original DeepSpeed save method, with the model checkpointing API `model_engine.save_checkpoint()`, automatically uses Nebula. This save method avoids the need for code modification.  

# [Using PyTorch Lightning](#tab/LIGHTNING)
  Pytorch Lightning **(Nebula supports version >=1.5.0)** checkpoints automatically when Trainer is used. As you would often save checkpoints with customized behaviors for fine-grained control, Pytorch Lightning provides two ways to save checkpoint: conditional saves with ``ModelCheckpoint()``, and manual saves with ``trainer.save_checkpoint()``. These techniques apply to PyTorch (>=0.15.0) training scripts.

  If you use `ModelCheckpoint` to conditionally save your checkpoints, you can use `NebulaCallback` instead of `ModelCheckpoint` for initialization.

  ```python
  # import Nebula package
  import torch_nebula as tn
  
  # define NebulaCallback
  config_params = dict()
  config_params["persistent_storage_path"] = "<YOUR STORAGE PATH>"
  config_params["persistent_time_interval"] = 10
  
  nebula_checkpoint_callback = tn.NebulaCallback(
     ****, # Original ModelCheckpoint params
     config_params=config_params, # customize the config of init nebula
  )
  ```

  Next, add `tn.NebulaCheckpointIO()` as a plugin to your `Trainer`, and modify the `trainer.save_checkpoint()` storage parameters as shown:

  ```python
  trainer = Trainer(plugins=[tn.NebulaCheckpointIO()],   # add NebulaCheckpointIO as a plugin
                    callbacks=[nebula_checkpoint_callback]) # use NebulaCallback as a plugin
  ```

  If you use `trainer.save_checkpoint()` to manually save your checkpoints, you can use the `NebulaCheckpointIO` plugin in your `Trainer`, and modify the storage parameters in `trainer.save_checkpoint()` as follows:

  ```python
  # import Nebula package
  import torch_nebula as tn
  
  # initialize Nebula
  tn.init(persistent_storage_path=<YOUR STORAGE PATH>) 
  
  trainer = Trainer(plugins=[tn.NebulaCheckpointIO()])  # add NebulaCheckpointIO as a plugin
  
  # Saving checkpoints
  storage_options = {}
  storage_options['is_best'] = True
  storage_options['persist_path'] = "/tmp/tier3/checkpoint"
  
  trainer.save_checkpoint("example.ckpt",
    storage_options=storage_options, # customize the config of Nebula saving checkpoint
  )
  ```
**Load Checkpoint**
                
We load checkpoints consistent with PyTorch and Pytorch Lightning. The only modification specifies the storage path.

To load the latest checkpoint, ``MyLightningModule.load_from_checkpoint()`` still works, as shown:

```python
  persistent_path = "/tmp/tier3/checkpoint"
  latest_ckpt_path = torch_nebula.get_latest_checkpoint_path("checkpoint", persist_path)
  model = MyLightningModule.load_from_checkpoint(latest_ckpt_path)
```

If you used ``nebula_checkpoint_callback`` in your ``Trainer()``, your original unchanged script, as shown,  still works:

```python
  trainer = Trainer(
      default_root_dir=tmpdir, 
      max_steps=100,
      plugins=[NebulaCheckpointIO()],
      callbacks=[nebula_checkpoint_callback],
  )
  trainer.fit(model, ckpt_path="/path/example.ckpt")
```

## Next steps

* [Track ML experiments and models with MLflow](how-to-use-mlflow-cli-runs.md)
* [Log and view metrics](how-to-log-view-metrics.md)