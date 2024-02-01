---
title: Prepare data for computer vision tasks v1
titleSuffix: Azure Machine Learning
description: Image data preparation for Azure Machine Learning automated ML to train computer vision models on classification, object detection,  and segmentation v1
author: vadthyavath
ms.author: rvadthyavath
ms.service: machine-learning
ms.subservice: automl
ms.topic: how-to
ms.custom: UpdateFrequency5, template-how-to, sdkv1, event-tier1-build-2022, ignite-2022
ms.date: 10/13/2021
---

# Prepare data for computer vision tasks with automated machine learning v1

[!INCLUDE [sdk v1](../includes/machine-learning-sdk-v1.md)]

  
[!INCLUDE [cli-version-info](../includes/machine-learning-cli-v1-deprecation.md)]

> [!IMPORTANT]
> Support for training computer vision models with automated ML in Azure Machine Learning is an experimental public preview feature. Certain features might not be supported or might have constrained capabilities. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

In this article, you learn how to prepare image data for training computer vision models with [automated machine learning in Azure Machine Learning](../concept-automated-ml.md). 

To generate models for computer vision tasks with automated machine learning, you need to bring labeled image data as input for model training in the form of an [Azure Machine Learning TabularDataset](/python/api/azureml-core/azureml.data.tabulardataset). 

To ensure your TabularDataset contains the accepted schema for consumption in automated ML, you can use the Azure Machine Learning data labeling tool or use a conversion script. 

## Prerequisites

* Familiarize yourself with the accepted [schemas for JSONL files for AutoML computer vision experiments](../reference-automl-images-schema.md).

* Labeled data you want to use to train computer vision models with automated ML.

## Azure Machine Learning data labeling

If you don't have labeled data, you can use Azure Machine Learning's [data labeling tool](../how-to-create-image-labeling-projects.md) to manually label images. This tool automatically generates the data required for training in the accepted format.

It helps to create, manage, and monitor data labeling tasks for 

+ Image classification (multi-class and multi-label)
+ Object detection (bounding box)
+ Instance segmentation (polygon)

If you already have a data labeling project and you want to use that data, you can [export your labeled data as an Azure Machine Learning TabularDataset](../how-to-manage-labeling-projects.md#export-the-labels), which can then be used directly with automated ML for training computer vision models.

## Use conversion scripts

If you have labeled data in popular computer vision data formats, like VOC or COCO, [helper scripts](https://github.com/Azure/azureml-examples/blob/v1-archive/v1/python-sdk/tutorials/automl-with-azureml/image-object-detection/coco2jsonl.py) to generate JSONL files for training and validation data are available in [notebook examples](https://github.com/Azure/azureml-examples/tree/v1-archive/v1/python-sdk/tutorials/automl-with-azureml).

If your data doesn't follow any of the previously mentioned formats, you can use your own script to generate JSON Lines files based on schemas defined in [Schema for JSONL files for AutoML image experiments](../reference-automl-images-schema.md).

After your data file(s) are converted to the accepted JSONL format, you can upload them to your storage account on Azure. 

## Upload the JSONL file and images to storage

To use the data for automated ML training, upload the data to your [Azure Machine Learning workspace](../concept-workspace.md) via a [datastore](../how-to-access-data.md). The datastore provides a mechanism for you to upload/download data to storage on Azure, and interact with it from your remote compute targets.

Upload the entire parent directory consisting of images and JSONL files to the default datastore that is automatically created upon workspace creation.  This datastore connects to the default Azure blob storage container that was created as part of workspace creation.

```python
# Retrieve default datastore that's automatically created when we setup a workspace
ds = ws.get_default_datastore()
ds.upload(src_dir='./fridgeObjects', target_path='fridgeObjects')
```
Once the data upload is done, you can create an [Azure Machine Learning TabularDataset](/python/api/azureml-core/azureml.data.tabulardataset) and register it to your workspace for future use as input to your automated ML experiments for computer vision models.

```python
from azureml.core import Dataset
from azureml.data import DataType

training_dataset_name = 'fridgeObjectsTrainingDataset'
# create training dataset
training_dataset = Dataset.Tabular.from_json_lines_files(path=ds.path("fridgeObjects/train_annotations.jsonl"),
                                                         set_column_types={"image_url": DataType.to_stream(ds.workspace)}
                                                        )
training_dataset = training_dataset.register( workspace=ws,name=training_dataset_name)

print("Training dataset name: " + training_dataset.name)
```

## Next steps

* [Train computer vision models with automated machine learning](../how-to-auto-train-image-models.md).
* [Train a small object detection model with automated machine learning](../how-to-use-automl-small-object-detect.md). 
* [Tutorial: Train an object detection model with AutoML and Python](../tutorial-auto-train-image-models.md).
