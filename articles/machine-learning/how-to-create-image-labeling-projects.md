---
title: Set up image labeling project
titleSuffix: Azure Machine Learning
description: Create a project to label images with the data labeling tool. Enable ML assisted labeling, or human in the loop labeling, to aid with the task.
author: kvijaykannan 
ms.author: vkann 
ms.reviewer: sgilley
ms.service: machine-learning
ms.subservice: mldata
ms.topic: how-to
ms.date: 10/21/2021
ms.custom: data4ml, ignite-fall-2021, ignite-2022
---

# Create an image labeling project and export labels

Learn how to create and run data labeling projects to label images in Azure Machine Learning.  Use machine-learning-assisted data labeling, or human-in-the-loop labeling, to aid with the task.

Set up labels for classification, object detection (bounding box), or instance segmentation (polygon).

You can also use the data labeling tool to [create a text labeling project](how-to-create-text-labeling-projects.md).

## Image labeling capabilities

Azure Machine Learning data labeling is a central place to create, manage, and monitor data labeling projects:

- Coordinate data, labels, and team members to efficiently manage labeling tasks.
- Tracks progress and maintains the queue of incomplete labeling tasks.
- Start and stop the project and control the labeling progress.
- Review the labeled data and export labeled as an Azure Machine Learning dataset.

> [!Important]
> Data images must be files available in an Azure blob datastore. (If you do not have an existing datastore, you may upload files during project creation.)

Image data can be files with any of these types: ".jpg", ".jpeg", ".png", ".jpe", ".jfif", ".bmp", ".tif", ".tiff", ".dcm", ".dicom". Each file is an item to be labeled.

## Prerequisites

[!INCLUDE [prerequisites](../../includes/machine-learning-data-labeling-prerequisites.md)]

## Create an image labeling project

[!INCLUDE [start](../../includes/machine-learning-data-labeling-start.md)]

1. To create a project, select **Add project**. Give the project an appropriate name. The project name cannot be reused, even if the project is deleted in future.

1. Select **Image** to create an image labeling project.

    :::image type="content" source="media/how-to-create-labeling-projects/labeling-creation-wizard.png" alt-text="Labeling project creation for mage labeling":::

    * Choose **Image Classification Multi-class** for projects when you want to apply only a *single label* from a set of labels to an image.
    * Choose **Image Classification Multi-label** for projects when you want to apply *one or more* labels from a set of labels to an image. For instance, a photo of a dog might be labeled with both *dog* and *daytime*.
    * Choose **Object Identification (Bounding Box)** for projects when you want to assign a label and a bounding box to each object within an image.
    * Choose **Instance Segmentation (Polygon)** for projects when you want to assign a label and draw a polygon around each object within an image.

1. Select **Next** when you're ready to continue.

## Add workforce (optional)

[!INCLUDE [outsource](../../includes/machine-learning-data-labeling-outsource.md)]

## Specify the data to label

If you already created a dataset that contains your data, select it from the **Select an existing dataset** drop-down list. Or, select **Create a dataset** to use an existing Azure datastore or to upload local files.

> [!NOTE]
> A project cannot contain more than 500,000 files.  If your dataset has more, only the first 500,000 files will be loaded.  

### Create a dataset from an Azure datastore

In many cases, it's fine to just upload local files. But [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/) provides a faster and more robust way to transfer a large amount of data. We recommend Storage Explorer as the default way to move files.

To create a dataset from data that you've already stored in Azure Blob storage:

1. Select **Create a dataset** > **From datastore**.
1. Assign a **Name** to your dataset.
1. **Dataset type** is set to file, only file dataset types are supported for images.
1. Select the datastore.
1. If your data is in a subfolder within your blob storage, choose **Browse** to select the path.
    * Append "/**" to the path to include all the files in subfolders of the selected path.
    * Append "**/*.*" to include all the data in the current container and its subfolders.
1. (Optional) Provide a description for your dataset.
1. Select **Next**.
1. Confirm the details. Select **Back** to modify the settings or **Create** to create the dataset.

### Create a dataset from uploaded data

To directly upload your data:

1. Select **Create a dataset** > **From local files**.
1. Assign a **Name** to your dataset.
1. **Dataset type** is set to file, only file dataset types are supported for images.
1. (Optional) Provide a description for your dataset.
1. Select **Next**.
1. (Optional) Select or create a datastore. Or keep the default to upload to the default blob store ("workspaceblobstore") of your Machine Learning workspace.
1. Select **Browse** to select the local files or folder(s) to upload.
1. Select **Next**.
1. Confirm the details. Select **Back** to modify the settings or **Create** to create the dataset.

## <a name="incremental-refresh"> </a> Configure incremental refresh

[!INCLUDE [refresh](../../includes/machine-learning-data-labeling-refresh.md)]

## Specify label classes

[!INCLUDE [classes](../../includes/machine-learning-data-labeling-classes.md)]

## Describe the image labeling task

[!INCLUDE [describe](../../includes/machine-learning-data-labeling-describe.md)]

For bounding boxes, important questions include:

* How is the bounding box defined for this task? Should it be entirely on the interior of the object, or should it be on the exterior? Should it be cropped as closely as possible, or is some clearance acceptable?
* What level of care and consistency do you expect the labelers to apply in defining bounding boxes?
* What is the visual definition of each label class? Is it possible to provide a list of normal, edge, and counter cases for each class? 
* What should the labelers do if the object is tiny? Should it be labeled as an object or should it be ignored as background?
* How to label the object that is partially shown in the image? 
* How to label the object that partially covered by other object?
* How to label the object if there is no clear boundary of the object?
* How to label the object which is not object class of interest but visually similar to an interested object type?

>[!NOTE]
> Be sure to note that the labelers will be able to select the first 9 labels by using number keys 1-9.

## Use ML-assisted data labeling

The **ML-assisted labeling** page lets you trigger automatic machine learning models to accelerate labeling tasks. Medical images (".dcm") are not included in assisted labeling.

At the beginning of your labeling project, the items are shuffled into a random order to reduce potential bias. However, any biases that are present in the dataset will be reflected in the trained model. For example, if 80% of your items are of a single class, then approximately 80% of the data used to train the model will be of that class.

Select *Enable ML assisted labeling* and specify a GPU to enable assisted labeling. If you don't have one in your workspace, a GPU cluster will be created for you and added to your workspace.   The cluster is created with a minimum of 0 nodes, which means it doesn't cost anything when it's not in use.


ML-assisted labeling consists of two phases:

* Clustering
* Prelabeling

The exact number of labeled data necessary to start assisted labeling is not a fixed number.  This can vary significantly from one labeling project to another. For some projects, is sometimes possible to see prelabel or cluster tasks after 300 items have been manually labeled. ML Assisted Labeling uses a technique called *Transfer Learning*, which uses a pre-trained model to jump-start the training process. If your dataset's classes are similar to those in the pre-trained model, pre-labels may be available after only a few hundred manually labeled items. If your dataset is significantly different from the data used to pre-train the model, it may take much longer.

Since the final labels still rely on input from the labeler, this technology is sometimes called *human in the loop* labeling.

> [!NOTE]
> ML assisted data labeling does not support default storage accounts secured behind a [virtual network](how-to-network-security-overview.md). You must use a non-default storage account for ML assisted data labelling. The non-default storage account can be secured behind the virtual network.

### Clustering

After a certain number of labels are submitted, the machine learning model for classification starts to group together similar items.  These similar images are presented to the labelers on the same screen to speed up manual tagging. Clustering is especially useful when the labeler is viewing a grid of 4, 6, or 9 images.

Once a machine learning model has been trained on your manually labeled data, the model is truncated to its last fully-connected layer. Unlabeled images are then passed through the truncated model in a process commonly known as "embedding" or "featurization." This embeds each image in a high-dimensional space defined by this model layer. Images that are nearest neighbors in the space are used for clustering tasks. 

The clustering phase does not appear for object detection models, or for text classification.

### Prelabeling

After enough labels are submitted, a classification model is used to predict tags. Or an object detection model is used to predict bounding boxes. The labeler now sees pages that contain predicted labels already present on each item. For object detection, predicted boxes are also shown. The task is then to review these predictions and correct any mis-labeled images before submitting the page.  

Once a machine learning model has been trained on your manually labeled data, the model is evaluated on a test set of manually labeled items to determine its accuracy at different confidence thresholds. This evaluation process is used to determine a confidence threshold above which the model is accurate enough to show pre-labels. The model is then evaluated against unlabeled data. Items with predictions more confident than this threshold are used for pre-labeling.

## Initialize the image labeling project

[!INCLUDE [initialize](../../includes/machine-learning-data-labeling-initialize.md)]

## Run and monitor the project

[!INCLUDE [run](../../includes/machine-learning-data-labeling-run.md)]

### Dashboard

The **Dashboard** tab shows the progress of the labeling task.

:::image type="content" source="./media/how-to-create-labeling-projects/labeling-dashboard.png" alt-text="Data labeling dashboard":::

The progress chart shows how many items have been labeled, skipped, in need of review, or not yet done.  Hover over the chart to see the number of item in each section.

The middle section shows the queue of tasks yet to be assigned. When ML assisted labeling is off, this section shows the number of manual tasks to be assigned. When ML assisted labeling is on, this will also show:

* Tasks containing clustered items in the queue
* Tasks containing prelabeled items in the queue

Additionally, when ML assisted labeling is enabled, a small progress bar shows when the next training run will occur.  The Experiments sections give links for each of the machine learning runs.

* Training - trains a model to predict the labels
* Validation - determines whether this model's prediction will be used for pre-labeling the items 
* Inference - prediction run for new items
* Featurization - clusters items (only for image classification projects)

On the right side is a distribution of the labels for those tasks that are complete.  Remember that in some project types, an item can have multiple labels, in which case the total number of labels can be greater than the total number items.

### Data tab

On the **Data** tab, you can see your dataset and review labeled data. Scroll through the labeled data to see the labels. If you see incorrectly labeled data, select it and choose **Reject**, which will remove the labels and put the data back into the unlabeled queue.

### Details tab

View and change details of your project.  In this tab you can:

* View project details and input datasets
* Enable or disable incremental refresh at regular intervals or request an immediate refresh
* View details of the storage container used to store labeled outputs in your project
* Add labels to your project
* Edit instructions you give to your labels
* Edit details of ML assisted labeling, including enable/disable

### Access for labelers

[!INCLUDE [access](../../includes/machine-learning-data-labeling-access.md)]

## Add new label class to a project

[!INCLUDE [add-label](../../includes/machine-learning-data-labeling-add-label.md)]

## Export the labels

Use the **Export** button on the **Project details** page of your labeling project. You can export the label data for Machine Learning experimentation at any time. 

* Image labels can be exported as:
    * [COCO format](http://cocodataset.org/#format-data).The COCO file is created in the default blob store of the Azure Machine Learning workspace in a folder within *Labeling/export/coco*. 
    * An [Azure Machine Learning dataset with labels](v1/how-to-use-labeled-dataset.md). 

Access exported Azure Machine Learning datasets in the **Datasets** section of Machine Learning. The dataset details page also provides sample code to access your labels from Python.

![Exported dataset](./media/how-to-create-labeling-projects/exported-dataset.png)

Once you have exported your labeled data to an Azure Machine Learning dataset, you can use AutoML to build computer vision models trained on your labeled data. Learn more at [Set up AutoML to train computer vision models with Python](how-to-auto-train-image-models.md)

## Troubleshooting

[!INCLUDE [troubleshooting](../../includes/machine-learning-data-labeling-troubleshooting.md)]

### Object detection troubleshooting

|Issue  |Resolution  |
|---------|---------|
|Pressing Esc key while labeling for object detection creates a zero size label on the top-left corner. Submitting labels in this state fails.     |   Delete the label by clicking on the cross mark next to it.  |

## Next steps

<!-- * [Tutorial: Create your first image classification labeling project](tutorial-labeling.md). -->
* [How to tag images](how-to-label-data.md)
