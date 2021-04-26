---
title: Create and explore datasets with labels
titleSuffix: Azure Machine Learning
description: Learn how to export data labels from your Azure Machine Learning labeling projects and use them for machine learning tasks.  
author: nibaccam
ms.author: nibaccam
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to
ms.custom: data4ml
ms.date: 05/14/2020

# Customer intent: As an experienced Python developer, I need to export my data labels and use them for machine learning tasks.
---

# Create and explore Azure Machine Learning dataset with labels

In this article, you'll learn how to export the data labels from an Azure Machine Learning data labeling project and load them into popular formats such as, a pandas dataframe for data exploration or a Torchvision dataset for image transformation. 

## What are datasets with labels 

We refer to Azure Machine Learning datasets with labels as labeled datasets. These specific dataset types of labeled datasets are only created as an output of Azure Machine Learning data labeling projects. Create a data labeling project with [these steps](how-to-create-labeling-projects.md). Machine Learning supports data labeling projects for image classification, either multi-label or multi-class, and object identification together with bounded boxes.

## Prerequisites

* An Azure subscription. If you don’t have an Azure subscription, create a [free account](https://aka.ms/AMLFree) before you begin.
* The [Azure Machine Learning SDK for Python](/python/api/overview/azure/ml/intro), or access to [Azure Machine Learning studio](https://ml.azure.com/).
    * Install the [azure-contrib-dataset](/python/api/azureml-contrib-dataset/) package
* A Machine Learning workspace. See [Create an Azure Machine Learning workspace](how-to-manage-workspace.md).
* Access to an Azure Machine Learning data labeling project. If you don't have a labeling project, create one with [these steps](how-to-create-labeling-projects.md).

## Export data labels 

When you complete a data labeling project, you can export the label data from a labeling project. Doing so, allows you to capture both the reference to the data and its labels, and export them in [COCO format](http://cocodataset.org/#format-data) or as an Azure Machine Learning dataset. Use the **Export** button on the **Project details** page of your labeling project.

### COCO 

 The COCO file is created in the default blob store of the Azure Machine Learning workspace in a folder within *export/coco*. 
 
>[!NOTE]
>In Object detection projects, the exported "bbox": [x,y,width,height]" values in COCO file are normalized. They are scaled to 1. Example : a bounding box at (10, 10) location, with 30 pixels width , 60 pixels height, in a 640x480 pixel image will be annotated as (0.015625. 0.02083, 0.046875, 0.125). Since the coordintes are normalized, it will show as '0.0' as "width" and "height" for all images. The actual width and height can be obtained using Python library like OpenCV  or Pillow(PIL).

### Azure Machine Learning dataset

You can access the exported Azure Machine Learning dataset in the **Datasets** section of your Azure Machine Learning studio. The dataset **Details** page also provides sample code to access your labels from Python.

![Exported dataset](./media/how-to-create-labeling-projects/exported-dataset.png)

## Explore labeled datasets

Load your labeled datasets into a pandas dataframe or Torchvision dataset to leverage popular open-source libraries for data exploration, as well as PyTorch provided libraries for image transformation and training.

### Pandas dataframe

You can load labeled datasets into a pandas dataframe with the [`to_pandas_dataframe()`](/python/api/azureml-core/azureml.data.tabulardataset#to-pandas-dataframe-on-error--null---out-of-range-datetime--null--) method from the `azureml-contrib-dataset` class. Install the class with the following shell command: 

```shell
pip install azureml-contrib-dataset
```

>[!NOTE]
>The azureml.contrib namespace changes frequently, as we work to improve the service. As such, anything in this namespace should be considered as a preview, and not fully supported by Microsoft.

Azure Machine Learning offers the following file handling options for file streams when converting to a pandas dataframe.
* Download: Download your data files to a local path.
* Mount: Mount your data files to a mount point. Mount only works for Linux-based compute, including Azure Machine Learning notebook VM and Azure Machine Learning Compute.

In the following code, the `animal_labels` dataset is the output from a labeling project previously saved to the workspace.

```Python
import azureml.core
import azureml.contrib.dataset
from azureml.core import Dataset, Workspace
from azureml.contrib.dataset import FileHandlingOption

# get animal_labels dataset from the workspace
animal_labels = Dataset.get_by_name(workspace, 'animal_labels')
animal_pd = animal_labels.to_pandas_dataframe(file_handling_option=FileHandlingOption.DOWNLOAD, target_path='./download/', overwrite_download=True)

import matplotlib.pyplot as plt
import matplotlib.image as mpimg

#read images from downloaded path
img = mpimg.imread(animal_pd.loc[0,'image_url'])
imgplot = plt.imshow(img)
```

### Torchvision datasets

You can load labeled datasets into Torchvision dataset with the [to_torchvision()](/python/api/azureml-contrib-dataset/azureml.contrib.dataset.tabulardataset#to-torchvision--) method also from the `azureml-contrib-dataset` class. To use this method, you need to have [PyTorch](https://pytorch.org/) installed. 

In the following code, the `animal_labels` dataset is the output from a labeling project previously saved to the workspace.

```python
import azureml.core
import azureml.contrib.dataset
from azureml.core import Dataset, Workspace
from azureml.contrib.dataset import FileHandlingOption

from torchvision.transforms import functional as F

# get animal_labels dataset from the workspace
animal_labels = Dataset.get_by_name(workspace, 'animal_labels')

# load animal_labels dataset into torchvision dataset
pytorch_dataset = animal_labels.to_torchvision()
img = pytorch_dataset[0][0]
print(type(img))

# use methods from torchvision to transform the img into grayscale
pil_image = F.to_pil_image(img)
gray_image = F.to_grayscale(pil_image, num_output_channels=3)

imgplot = plt.imshow(gray_image)
```

## Next steps

* See the [dataset with labels notebook](/azure/machine-learning/how-to-use-labeled-dataset) for complete training sample.
