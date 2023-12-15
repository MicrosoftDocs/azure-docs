---
title: Set up an image labeling project
titleSuffix: Azure Machine Learning
description: Learn how to create a project to label images in the project. Enable machine learning-assisted labeling to help with the task.
author: kvijaykannan 
ms.author: vkann 
ms.reviewer: sgilley
ms.service: machine-learning
ms.subservice: mldata
ms.topic: how-to
ms.date: 12/12/2023
ms.custom: data4ml, ignite-fall-2021, ignite-2022
monikerRange: 'azureml-api-1 || azureml-api-2'
#customer intent: As a project manager, I want to set up a project to label images in the project. I want to enable machine learning-assisted labeling to help with the task.
---

# Set up an image labeling project

Learn how to create and run data labeling projects to label images in Azure Machine Learning. Use machine learning (ML)-assisted data labeling or human-in-the-loop labeling to help with the task.

Set up labels for classification, object detection (bounding box), instance segmentation (polygon), or semantic segmentation (preview).

You can also use the data labeling tool in Azure Machine Learning to [create a text labeling project](how-to-create-text-labeling-projects.md).

[!INCLUDE [machine-learning-preview-items-disclaimer](includes/machine-learning-preview-items-disclaimer.md)]

## Image labeling capabilities

Azure Machine Learning data labeling is a tool you can use to create, manage, and monitor data labeling projects. Use it to:

- Coordinate data, labels, and team members to efficiently manage labeling tasks.
- Track progress and maintain the queue of incomplete labeling tasks.
- Start and stop the project, and control the labeling progress.
- Review and export the labeled data as an Azure Machine Learning dataset.

> [!IMPORTANT]
> The data images you work with in the Azure Machine Learning data labeling tool must be available in an Azure Blob Storage datastore. If you don't have an existing datastore, you can upload your data files to a new datastore when you create a project.

Image data can be any file that has one of these file extensions:

- *.jpg*
- *.jpeg*
- *.png*
- *.jpe*
- *.jfif*
- *.bmp*
- *.tif*
- *.tiff*
- *.dcm*
- *.dicom*

Each file is an item to be labeled.

You can also use an MLTable data asset as input to an image labeling project, as long as the images in the table are one of the above formats. For more information, see [How to use MLTable data assets](./how-to-mltable.md).

## Prerequisites

You use these items to set up image labeling in Azure Machine Learning:

[!INCLUDE [prerequisites](includes/machine-learning-data-labeling-prerequisites.md)]

## Create an image labeling project

[!INCLUDE [start](includes/machine-learning-data-labeling-start.md)]

1. To create a project, select **Add project**.

1. For **Project name**, enter a name for the project.

   You can't reuse the project name, even if you delete the project.

1. To create an image labeling project, for **Media type**, select **Image**.

1. For **Labeling task type**, select an option for your scenario:

    * To apply only a *single label* to an image from a set of labels, select **Image Classification Multi-class**.
    * To apply *one or more* labels to an image from a set of labels, select **Image Classification Multi-label**. For example, a photo of a dog might be labeled with both *dog* and *daytime*.
    * To assign a label to each object within an image and add bounding boxes, select **Object Identification (Bounding Box)**.
    * To assign a label to each object within an image and draw a polygon around each object, select **Instance Segmentation (Polygon)**.
    * To draw masks on an image and assign a label class at the pixel level, select **Semantic Segmentation (Preview)**.

    :::image type="content" source="media/how-to-create-labeling-projects/labeling-creation-wizard.png" alt-text="Screenshot that shows creating a labeling project to manage labeling.":::

1. Select **Next** to continue.

## Add workforce (optional)

[!INCLUDE [outsource](includes/machine-learning-data-labeling-outsource.md)]

## Specify the data to label

If you already created a dataset that contains your data, select the dataset in the **Select an existing dataset** dropdown.

You can also select **Create a dataset** to use an existing Azure datastore or to upload local files.

> [!NOTE]
> A project can't contain more than 500,000 files. If your dataset exceeds this file count, only the first 500,000 files are loaded.

### Data column mapping (preview)

If you select an MLTable data asset, an additional **Data Column Mapping** step appears for you to specify the column that contains the image URLs.  

[!INCLUDE [mapping](includes/machine-learning-data-labeling-mapping.md)]

### Import options (preview)

 When you include a **Category** column in the  **Data Column Mapping** step, use **Import Options** to specify how to treat the labeled data.

[!INCLUDE [mapping](includes/machine-learning-data-labeling-mapping.md)]

### Create a dataset from an Azure datastore

In many cases, you can upload local files. However, [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/) provides a faster and more robust way to transfer a large amount of data. We recommend Storage Explorer as the default way to move files.

To create a dataset from data that's already stored in Blob Storage:

1. Select **Create**.
1. For **Name**, enter a name for your dataset. Optionally, enter a description.
1. Ensure that **Dataset type** is set to **File**. Only file dataset types are supported for images.
1. Select **Next**.
1. Select **From Azure storage**, and then select **Next**.
1. Select the datastore, and then select **Next**.
1. If your data is in a subfolder within Blob Storage, choose **Browse** to select the path.
    * To include all the files in the subfolders of the selected path, append `/**` to the path.
    * To include all the data in the current container and its subfolders, append `**/*.*` to the path.
1. Select **Create**.
1. Select the data asset you created.

### Create a dataset from uploaded data

To directly upload your data:

1. Select **Create**.
1. For **Name**, enter a name for your dataset. Optionally, enter a description.
1. Ensure that **Dataset type** is set to **File**. Only file dataset types are supported for images.
1. Select **Next**.
1. Select **From local files**, and then select **Next**.
1. (Optional) Select a datastore. You can also leave the default to upload to the default blob store (*workspaceblobstore*) for your Machine Learning workspace.
1. Select **Next**.
1. Select **Upload** > **Upload files** or **Upload** > **Upload folder** to select the local files or folders to upload.
1. In the browser window, find your files or folders, and then select **Open**.
1. Continue to select **Upload** until you specify all your files and folders.
1. Optionally, you can choose to select the **Overwrite if already exists** checkbox. Verify the list of files and folders.
1. Select **Next**.
1. Confirm the details. Select **Back** to modify the settings or select **Create** to create the dataset.
1. Finally, select the data asset you created.

## Configure incremental refresh

[!INCLUDE [refresh](includes/machine-learning-data-labeling-refresh.md)]

## Specify label classes

[!INCLUDE [classes](includes/machine-learning-data-labeling-classes.md)]

## Describe the image labeling task

[!INCLUDE [describe](includes/machine-learning-data-labeling-describe.md)]

For bounding boxes, important questions include:

* How is the bounding box defined for this task? Should it stay entirely on the interior of the object or should it be on the exterior? Should it be cropped as closely as possible, or is some clearance acceptable?
* What level of care and consistency do you expect the labelers to apply in defining bounding boxes?
* What is the visual definition of each label class? Can you provide a list of normal, edge, and counter cases for each class?
* What should the labelers do if the object is tiny? Should it be labeled as an object or should they ignore that object as background?
* How should labelers handle an object that's only partially shown in the image?
* How should labelers handle an object that's partially covered by another object?
* How should labelers handle an object that has no clear boundary?
* How should labelers handle an object that isn't the object class of interest but has visual similarities to a relevant object type?

> [!NOTE]
> Labelers can select the first nine labels by using number keys 1 through 9.

## Quality control (preview)

[!INCLUDE [describe](includes/machine-learning-data-labeling-quality-control.md)]

> [!NOTE]
> **Instance Segmentation** projects can't use consensus labeling.

## Use ML-assisted data labeling

To accelerate labeling tasks, on the **ML assisted labeling** page, you can trigger automatic machine learning models. Medical images (files that have a *.dcm* extension) aren't included in assisted labeling.  If the project type is **Semantic Segmentation (Preview)**, ML-assisted labeling isn't available.

At the start of your labeling project, the items are shuffled into a random order to reduce potential bias. However, the trained model reflects any biases that are present in the dataset. For example, if 80 percent of your items are of a single class, then approximately 80 percent of the data used to train the model lands in that class.

To enable assisted labeling, select **Enable ML assisted labeling** and specify a GPU. If you don't have a GPU in your workspace, a GPU cluster is created for you and added to your workspace. The cluster is created with a minimum of zero nodes, which means it costs nothing when not in use.

ML-assisted labeling consists of two phases:

* Clustering
* Pre-labeling

The labeled data item count that's required to start assisted labeling isn't a fixed number. This number can vary significantly from one labeling project to another. For some projects, it's sometimes possible to see pre-label or cluster tasks after 300 items have been manually labeled. ML-assisted labeling uses a technique called *transfer learning*. Transfer learning uses a pre-trained model to jump-start the training process. If the classes of your dataset resemble the classes in the pre-trained model, pre-labels might become available after only a few hundred manually labeled items. If your dataset significantly differs from the data that's used to pre-train the model, the process might take more time.

When you use consensus labeling, the consensus label is used for training.

Because the final labels still rely on input from the labeler, this technology is sometimes called *human-in-the-loop* labeling.

> [!NOTE]
> ML-assisted data labeling doesn't support default storage accounts that are secured behind a [virtual network](how-to-network-security-overview.md). You must use a non-default storage account for ML-assisted data labeling. The non-default storage account can be secured behind the virtual network.

### Clustering

After you submit some labels, the classification model starts to group together similar items. These similar images are presented to labelers on the same page to help make manual tagging more efficient. Clustering is especially useful when a labeler views a grid of four, six, or nine images.

After a machine learning model is trained on your manually labeled data, the model is truncated to its last fully connected layer. Unlabeled images are then passed through the truncated model in a process called *embedding* or *featurization*. This process embeds each image in a high-dimensional space that the model layer defines. Other images in the space that are nearest the image are used for clustering tasks.

The clustering phase doesn't appear for object detection models or text classification.

### Pre-labeling

After you submit enough labels for training, either a classification model predicts tags or an object detection model predicts bounding boxes. The labeler now sees pages that contain predicted labels already present on each item. For object detection, predicted boxes are also shown. The task involves reviewing these predictions and correcting any incorrectly labeled images before page submission.

After a machine learning model is trained on your manually labeled data, the model is evaluated on a test set of manually labeled items. The evaluation helps determine the model's accuracy at different confidence thresholds. The evaluation process sets a confidence threshold beyond which the model is accurate enough to show pre-labels. The model is then evaluated against unlabeled data. Items with predictions that are more confident than the threshold are used for pre-labeling.

## Initialize the image labeling project

[!INCLUDE [initialize](includes/machine-learning-data-labeling-initialize.md)]



## Next steps

<!-- * [Tutorial: Create your first image classification labeling project](tutorial-labeling.md). -->
* [Manage labeling projects](how-to-manage-labeling-projects.md)
* [How to tag text](how-to-label-data.md#label-text)
