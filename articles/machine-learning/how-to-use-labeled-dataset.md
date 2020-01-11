---
title: Create a data labeling project
titleSuffix: Azure Machine Learning
description: Learn how to explore labeled dataset and use them in machine learning experiments.
author: nibaccam
ms.author: nibaccam
ms.service: machine-learning
ms.topic: how-to
ms.date: 01/14/2019

---

# Create a data labeling project and export labels 

In this article, you'll learn how to:

> [!div class="checklist"]
> * Export the labels
> * Specify the project's data and structure
> * Manage the teams and people who work on the project
> * Run and monitor the project

## Prerequisites

* Dataset with labels.
* An Azure subscription. If you don’t have an Azure subscription, create a [free account](https://aka.ms/AMLFree) before you begin.
* A Machine Learning workspace. See [Create an Azure Machine Learning workspace](how-to-manage-workspace.md).

Export data from a your labeling project

Explore labeled datasets
Note: How to create labeled datasets is not covered in this tutorial. To create labeled datasets, you can go through labeling projects and export the output labels as Azure Machine Lerning datasets.

animal_labels used in this tutorial section is the output from a labeling project, with the task type of "Object Identification".

# get animal_labels dataset from the workspace
animal_labels = Dataset.get_by_name(workspace, 'animal_labels')
animal_labels
You can load labeled datasets into pandas DataFrame. There are 3 file handling option that you can choose to load the data files referenced by the labeled datasets:

Streaming: The default option to load data files.
Download: Download your data files to a local path.
Mount: Mount your data files to a mount point. Mount only works for Linux-based compute, including Azure Machine Learning notebook VM and Azure Machine Learning Compute.

```Python
animal_pd = animal_labels.to_pandas_dataframe(file_handling_option=FileHandlingOption.DOWNLOAD, target_path='./download/', overwrite_download=True)
animal_pd

import matplotlib.pyplot as plt
import matplotlib.image as mpimg

#read images from downloaded path
img = mpimg.imread(animal_pd.loc[0,'image_url'])
imgplot = plt.imshow(img)
You can also load labeled datasets into torchvision datasets, so that you can leverage on the open source libraries provided by PyTorch for image transformation and training.

from torchvision.transforms import functional as F

# load animal_labels dataset into torchvision dataset
pytorch_dataset = animal_labels.to_torchvision()
img = pytorch_dataset[0][0]
print(type(img))

# use methods from torchvision to transform the img into grayscale
pil_image = F.to_pil_image(img)
gray_image = F.to_grayscale(pil_image, num_output_channels=3)

imgplot = plt.imshow(gray_image)
```
