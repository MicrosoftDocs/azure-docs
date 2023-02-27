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
ms.date: 02/08/2023
ms.custom: data4ml, ignite-fall-2021, ignite-2022
---

# Create an image labeling project and export labels

Learn how to create and run data labeling projects to label images in Azure Machine Learning. Use machine-learning-assisted data labeling, or human-in-the-loop labeling, to aid with the task.

Set up labels for classification, object detection (bounding box), or instance segmentation (polygon).

You can also use the data labeling tool to [create a text labeling project](how-to-create-text-labeling-projects.md).

## Image labeling capabilities

Azure Machine Learning data labeling is a tool to create, manage, and monitor data labeling projects:

- Coordinate data, labels, and team members to efficiently manage labeling tasks.
- Track progress and maintain the queue of incomplete labeling tasks.
- Start and stop the project, and control the labeling progress.
- Review and export the labeled data as an Azure Machine Learning dataset.

> [!Important]
> Data images must be files available in an Azure blob datastore. (If you do not have an existing datastore, you can upload files during project creation.)

Image data can be files with any of these types: ".jpg", ".jpeg", ".png", ".jpe", ".jfif", ".bmp", ".tif", ".tiff", ".dcm", ".dicom". Each file is an item to be labeled.

## Prerequisites

[!INCLUDE [prerequisites](../../includes/machine-learning-data-labeling-prerequisites.md)]

## Create an image labeling project

[!INCLUDE [start](../../includes/machine-learning-data-labeling-start.md)]

1. To create a project, select **Add project**. Give the project an appropriate name. You can't reuse the project name, even if the project is deleted in future.

1. Select **Image** to create an image labeling project.

    :::image type="content" source="media/how-to-create-labeling-projects/labeling-creation-wizard.png" alt-text="Labeling project creation for mage labeling":::

    * Choose **Image Classification Multi-class** for those projects that involve the application of only a *single label*, from a set of labels, to an image.
    * Choose **Image Classification Multi-label** for projects that involve the application of *one or more* labels, from a set of labels, to an image. For example, a photo of a dog might be labeled with both *dog* and *daytime*.
    * Choose **Object Identification (Bounding Box)** for projects that involve the assignment of a label, and a bounding box, to each object within an image.
    * Choose **Instance Segmentation (Polygon)** for projects that involve both the assignment of a label to, and a drawn polygon around, each object within an image.

1. Select **Next** when you want to continue.

## Add workforce (optional)

[!INCLUDE [outsource](../../includes/machine-learning-data-labeling-outsource.md)]

## Specify the data to label

If you already created a dataset that contains your data, select it from the **Select an existing dataset** drop-down list. You can also select **Create a dataset** to use an existing Azure datastore, or to upload local files.

> [!NOTE]
> A project cannot contain more than 500,000 files. If your dataset exceeds this file count, only the first 500,000 files will be loaded.

### Create a dataset from an Azure datastore

In many cases, you can upload local files. However, [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/) provides a faster and more robust way to transfer a large amount of data. We recommend Storage Explorer as the default way to move files.

To create a dataset from data that you've already stored in Azure Blob storage:

1. Select **+ Create** .
1. Assign a **Name** to your dataset, and optionally a description.
1. **Dataset type** is set to file; only file dataset types are supported for images.
1. Select **Next**.
1. Select **From Azure storage**, then select **Next**.
1. Select the datastore, then select **Next**.
1. If your data is in a subfolder within your blob storage, choose **Browse** to select the path.
    * Append "/**" to the path, to include all the files in the subfolders of the selected path.
    * Append "**/*.*" to include all the data in the current container and its subfolders.
1. Select **Create**.
1. Select the data asset you created.

### Create a dataset from uploaded data

To directly upload your data:

1. Select **+ Create**.
1. Assign a **Name** to your dataset, and optionally a description.
1. **Dataset type** is set to file; only file dataset types are supported for images.
1. Select **Next**.
1. Select **From local files**, then select **Next**.
1. (Optional) Select a datastore. You can also keep the default to upload to the default blob store ("workspaceblobstore") of your Machine Learning workspace.
1. Select **Next**.
1. Select **Upload > Upload files** or **Upload > Upload folder** to select the local files or folder(s) to upload.
1. In the browser window, find your files or folder, then select **Open**.
1. Continue using **Upload** until you specify all your files/folders.
1. If you want, check the box **Overwrite if already exists**. Verify the list of files/folders.
1. Select **Next**.
1. Confirm the details. Select **Back** to modify the settings or **Create** to create the dataset.
1. Finally, select the data asset you created.

## Configure incremental refresh

[!INCLUDE [refresh](../../includes/machine-learning-data-labeling-refresh.md)]

## Specify label classes

[!INCLUDE [classes](../../includes/machine-learning-data-labeling-classes.md)]

## Describe the image labeling task

[!INCLUDE [describe](../../includes/machine-learning-data-labeling-describe.md)]

For bounding boxes, important questions include:

* How is the bounding box defined for this task? Should it stay entirely on the interior of the object, or should it be on the exterior? Should it be cropped as closely as possible, or is some clearance acceptable?
* What level of care and consistency do you expect the labelers to apply in defining bounding boxes?
* What is the visual definition of each label class? Can you provide a list of normal, edge, and counter cases for each class?
* What should the labelers do if the object is tiny? Should it be labeled as an object, or should they ignore that object as background?
* How should labelers handle an object only partially shown in the image?
* How should labelers handle an object partially covered by other object?
* How should labelers handle an object with no clear boundary?
* How should labelers handle an object that isn't the object class of interest, but has visual similarities to a relevant object type?

> [!NOTE]
> Labelers can select the first 9 labels with number keys 1-9.

## Quality control (preview)

[!INCLUDE [describe](../../includes/machine-learning-data-labeling-quality-control.md)]

> [!NOTE]
> **Instance Segmentation** projects cannot use consensus labeling.

## Use ML-assisted data labeling

To accelerate labeling tasks, the **ML-assisted labeling** page lets you trigger automatic machine learning models. Medical images (".dcm") aren't included in assisted labeling.

At the start of your labeling project, the items are shuffled into a random order to reduce potential bias. However, the trained model reflects any biases present in the dataset. For example, if 80% of your items are of a single class, then approximately 80% of the data used to train the model lands in that class.

Select *Enable ML assisted labeling*, and specify a GPU to enable assisted labeling. If you don't have a GPU in your workspace, a GPU cluster is created for you and added to your workspace. The cluster is created with a minimum of zero nodes, which means it costs nothing when not in use.

ML-assisted labeling consists of two phases:

* Clustering
* Prelabeling

The exact labeled data item count necessary to start assisted labeling isn't a fixed number. This number can vary significantly from one labeling project to another. For some projects, is sometimes possible to see pre-label or cluster tasks after 300 items have been manually labeled. ML Assisted Labeling uses a technique called *Transfer Learning*, which uses a pre-trained model to jump-start the training process. If the classes of your dataset resemble the classes in the pre-trained model, pre-labels may become available after only a few hundred manually labeled items. If your dataset significantly differs from the data used to pre-train the model, the process may take more time.

When you use consensus labeling, the consensus label is used for training.

Since the final labels still rely on input from the labeler, this technology is sometimes called *human in the loop* labeling.

> [!NOTE]
> ML assisted data labeling does not support default storage accounts secured behind a [virtual network](how-to-network-security-overview.md). You must use a non-default storage account for ML assisted data labelling. The non-default storage account can be secured behind the virtual network.

### Clustering

After submission of some labels, the classification machine learning model starts to group together similar items. These similar images are presented to the labelers on the same screen to speed up manual tagging. Clustering is especially useful when the labeler views a grid of four, six, or nine images.

Once a machine learning model has been trained on your manually labeled data, the model is truncated to its last fully connected layer. Unlabeled images are then passed through the truncated model in a process commonly known as "embedding" or "featurization." This process embeds each image in a high-dimensional space defined by this model layer. Images that are nearest neighbors in the space are used for clustering tasks.

The clustering phase doesn't appear for object detection models, or for text classification.

### Prelabeling

After submission of enough labels, a classification model is used to predict tags. Or, an object detection model is used to predict bounding boxes. The labeler now sees pages that contain predicted labels already present on each item. For object detection, predicted boxes are also shown. The task involves review of these predictions, and correction of any incorrectly labeled images, before page submission.

Once a machine learning model has been trained on your manually labeled data, the model is evaluated on a test set of manually labeled items, to determine its accuracy at different confidence thresholds. This evaluation process is used to determine a confidence threshold beyond which the model is accurate enough to show pre-labels. The model is then evaluated against unlabeled data. Items with predictions more confident than this threshold are used for pre-labeling.

## Initialize the image labeling project

[!INCLUDE [initialize](../../includes/machine-learning-data-labeling-initialize.md)]

## Run and monitor the project

[!INCLUDE [run](../../includes/machine-learning-data-labeling-run.md)]

### Dashboard

The **Dashboard** tab shows the progress of the labeling task.

:::image type="content" source="./media/how-to-create-labeling-projects/labeling-dashboard.png" alt-text="Data labeling dashboard":::

The progress charts show how many items have been labeled, skipped, need review, or not yet complete. Hover over the chart to see the number of items in each section.

Below the chart 's a distribution of the labels for completed tasks. In some project types, an item can have multiple labels. Therefore, the total number of labels can exceed the total number items.

You also see a distribution of labelers, and how many items they've labeled.

Finally, the middle section shows a table with a queue of unassigned tasks. When ML assisted labeling is off, this section shows the number of manual tasks awaiting assignment.

When ML assisted labeling is on, this section also shows:

* Tasks containing clustered items in the queue
* Tasks containing prelabeled items in the queue

Additionally, when ML assisted labeling is enabled, you can scroll down to see the ML assisted labeling status. The Jobs sections give links for each of the machine learning runs.

* Training - trains a model to predict the labels
* Validation - determines whether item pre-labeling uses the prediction of this model
* Inference - prediction run for new items
* Featurization - clusters items (only for image classification projects)


### Data tab

On the **Data** tab, you can see your dataset, and review labeled data. Scroll through the labeled data to see the labels. If you see incorrectly labeled data, select it and choose **Reject**, to remove the labels and return the data to the unlabeled queue.

If your project uses consensus labeling, you should review those images that have no consensus:

1. Select the **Data** tab.
1. On the left, select  **Review labels**.
1. On the top right, select **All filters**.

    :::image type="content" source="media/how-to-create-labeling-projects/select-filters.png" alt-text="Screenshot: select filters to review consensus label problems." lightbox="media/how-to-create-labeling-projects/select-filters.png":::

1. Under **Labeled datapoints**, select **Consensus labels in need of review**, to show only those images where the labelers didn't come to a consensus.

    :::image type="content" source="media/how-to-create-labeling-projects/select-need-review.png" alt-text="Screenshot: Select labels in need of review.":::

1. For each image to review, select the **Consensus label** dropdown, to view the conflicting labels.

    :::image type="content" source="media/how-to-create-labeling-projects/consensus-dropdown.png" alt-text="Screenshot: Select Consensus label dropdown to review conflicting labels." lightbox="media/how-to-create-labeling-projects/consensus-dropdown.png":::

1. Although you can select an individual to see just their label(s), you can only update or reject the labels from the top choice, **Consensus label (preview)**.

### Details tab

View and change details of your project. In this tab, you can:

* View project details and input datasets
* Enable or disable **incremental refresh at regular intervals**, or request an immediate refresh
* View details of the storage container used to store labeled outputs in your project
* Add labels to your project
* Edit instructions you give to your labels
* Change settings for ML assisted labeling, and kick off a labeling task

### Access for labelers

[!INCLUDE [access](../../includes/machine-learning-data-labeling-access.md)]

## Add new labels to a project

[!INCLUDE [add-label](../../includes/machine-learning-data-labeling-add-label.md)]

## Start an ML assisted labeling task

[!INCLUDE [start-ml-assist](../../includes/machine-learning-data-labeling-start-ml-assist.md)]

## Export the labels

Use the **Export** button on the **Project details** page of your labeling project. You can export the label data for Machine Learning experimentation at any time.

* Image labels can be exported as:
    * [COCO format](http://cocodataset.org/#format-data). The COCO file is created in the default blob store of the Azure Machine Learning workspace in a folder within *Labeling/export/coco*. 
    * An [Azure Machine Learning dataset with labels](v1/how-to-use-labeled-dataset.md). 

Access exported Azure Machine Learning datasets in the **Datasets** section of Machine Learning. The dataset details page also provides sample code to access your labels from Python.

![Exported dataset](./media/how-to-create-labeling-projects/exported-dataset.png)

Once you export your labeled data to an Azure Machine Learning dataset, you can use AutoML to build computer vision models trained on your labeled data. Learn more at [Set up AutoML to train computer vision models with Python](how-to-auto-train-image-models.md)

## Troubleshooting

[!INCLUDE [troubleshooting](../../includes/machine-learning-data-labeling-troubleshooting.md)]

### Object detection troubleshooting

|Issue  |Resolution  |
|---------|---------|
|Pressing Esc key while labeling for object detection creates a zero size label on the top-left corner. Label submission in this state fails.     |   Select the cross mark next to the label to delete it.  |

## Next steps

<!-- * [Tutorial: Create your first image classification labeling project](tutorial-labeling.md). -->
* [How to tag images](how-to-label-data.md)
