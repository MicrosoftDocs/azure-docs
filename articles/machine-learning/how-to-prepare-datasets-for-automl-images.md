---
title: Prepare data for computer vision tasks
titleSuffix: Azure Machine Learning
description: Image data preparation for Azure Machine Learning automated ML to train computer vision models on classification, object detection,  and segmentation
author: vadthyavath
ms.author: rvadthyavath
ms.service: machine-learning
ms.subservice: automl 
ms.topic: how-to
ms.custom: template-how-to, sdkv2, event-tier1-build-2022
ms.date: 05/26/2022
---

# Prepare data for computer vision tasks with automated machine learning (preview)

[!INCLUDE [dev v2](../../includes/machine-learning-dev-v2.md)]

> [!div class="op_single_selector" title1="Select the version of Azure Machine Learning you are using:"]
> * [v1](v1/how-to-prepare-datasets-for-automl-images-v1.md)
> * [v2 (current version)](how-to-prepare-datasets-for-automl-images.md)

> [!IMPORTANT]
> Support for training computer vision models with automated ML in Azure Machine Learning is an experimental public preview feature. Certain features might not be supported or might have constrained capabilities. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

In this article, you learn how to prepare image data for training computer vision models with [automated machine learning in Azure Machine Learning](concept-automated-ml.md). 

To generate models for computer vision tasks with automated machine learning, you need to bring labeled image data as input for model training in the form of an `MLTable`. 

You can create an `MLTable` from labeled training data in JSONL format. 
If your labeled training data is in a different format (like, pascal VOC or COCO), you can use a conversion script to first convert it to JSONL, and then create an `MLTable`. Alternatively, you can use  Azure Machine Learning's [data labeling tool](how-to-create-image-labeling-projects.md) to manually label images, and export the labeled data to use for training your AutoML model.

## Prerequisites

* Familiarize yourself with the accepted [schemas for JSONL files for AutoML computer vision experiments](reference-automl-images-schema.md).

## Get labeled data 
In order to train computer vision models using AutoML, you need to first get labeled training data. The images need to be uploaded to the cloud and label annotations need to be in JSONL format. You can either use the Azure ML Data Labeling tool to label your data or you could start with pre-labeled image data.

### Using Azure ML Data Labeling tool to label your training data
If you don't have pre-labeled data, you can use Azure Machine Learning's [data labeling tool](how-to-create-image-labeling-projects.md) to manually label images. This tool automatically generates the data required for training in the accepted format.

It helps to create, manage, and monitor data labeling tasks for 

+ Image classification (multi-class and multi-label)
+ Object detection (bounding box)
+ Instance segmentation (polygon)

If you already have a data labeling project and you want to use that data, you can [export your labeled data as an Azure ML Dataset](how-to-create-image-labeling-projects.md#export-the-labels). You can then access the exported dataset under the 'Datasets' tab in Azure ML Studio, and download the underlying JSONL file from the Dataset details page under Data sources. The downloaded JSONL file can then be used to create an `MLTable` that can be used by automated ML for training computer vision models.

### Using pre-labeled training data
If you have previously labeled data that you would like to use to train your model, you will first need to upload the images to the default Azure Blob Storage of your Azure ML Workspace and register it as a data asset. 

# [Azure CLI](#tab/cli)
[!INCLUDE [cli v2](../../includes/machine-learning-cli-v2.md)]

Create a .yml file with the following configuration.

```yml
$schema: https://azuremlschemas.azureedge.net/latest/data.schema.json
name: fridge-items-images-object-detection
description: Fridge-items images Object detection
path: ./data/odFridgeObjects
type: uri_folder
```

To upload the images as a data asset, you run the following CLI v2 command with the path to your .yml file, workspace name, resource group and subscription ID.

```azurecli
az ml data create -f [PATH_TO_YML_FILE] --workspace-name [YOUR_AZURE_WORKSPACE] --resource-group [YOUR_AZURE_RESOURCE_GROUP] --subscription [YOUR_AZURE_SUBSCRIPTION]
```

# [Python SDK](#tab/python)

 [!INCLUDE [sdk v2](../../includes/machine-learning-sdk-v2.md)]

[!Notebook-python[] (~/azureml-examples-main/sdk/jobs/automl-standalone-jobs/automl-image-object-detection-task-fridge-items/automl-image-object-detection-task-fridge-items.ipynb?name=upload-data)]
---

Next, you will need to get the label annotations in JSONL format. The schema of labeled data depends on the computer vision task at hand. Refer to [schemas for JSONL files for AutoML computer vision experiments](reference-automl-images-schema.md) to learn more about the required JSONL schema for each task type.

If your training data is in a different format (like, pascal VOC or COCO), [helper scripts](https://github.com/Azure/azureml-examples/blob/main/python-sdk/tutorials/automl-with-azureml/image-object-detection/coco2jsonl.py) to convert the data to JSONL are available in [notebook examples](https://github.com/Azure/azureml-examples/blob/sdk-preview/sdk/jobs/automl-standalone-jobs).

## Create MLTable

Once you have your labeled data in JSONL format, you can use it to create `MLTable` as shown below. MLtable packages your data into a consumable object for training.

:::code language="yaml" source="~/azureml-examples-main/sdk/jobs/automl-standalone-jobs/automl-image-object-detection-task-fridge-items/data/training-mltable-folder/MLTable":::

You can then pass in the `MLTable` as a data input for your AutoML training job.

## Next steps

* [Train computer vision models with automated machine learning](how-to-auto-train-image-models.md).
* [Train a small object detection model with automated machine learning](how-to-use-automl-small-object-detect.md). 
* [Tutorial: Train an object detection model (preview) with AutoML and Python](tutorial-auto-train-image-models.md).
