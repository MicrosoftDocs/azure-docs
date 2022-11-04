---
title: Set up text labeling project
titleSuffix: Azure Machine Learning
description: Create a project to label text using the data labeling tool. Specify either a single label or multiple labels to be applied to each piece of text.
author: kvijaykannan 
ms.author: vkann 
ms.reviewer: sgilley
ms.service: machine-learning
ms.subservice: mldata
ms.topic: how-to
ms.date: 09/29/2022
ms.custom: data4ml, ignite-fall-2021
---

# Create a text labeling project and export labels

Learn how to create and run data labeling projects to label text data in Azure Machine Learning.  Specify either a single label or multiple labels to be applied to each text item.

You can also use the data labeling tool to [create an image labeling project](how-to-create-image-labeling-projects.md).

## Text labeling capabilities

Azure Machine Learning data labeling is a central place to create, manage, and monitor data labeling projects:

- Coordinate data, labels, and team members to efficiently manage labeling tasks.
- Tracks progress and maintains the queue of incomplete labeling tasks.
- Start and stop the project and control the labeling progress.
- Review the labeled data and export labeled as an Azure Machine Learning dataset.

> [!Important]
> Text data must be available in an Azure blob datastore. (If you do not have an existing datastore, you may upload files during project creation.)

Data formats available for text data:

* **.txt**: each file represents one item to be labeled.
* **.csv** or **.tsv**: each row represents one item presented to the labeler.  You decide which columns the labeler can see in order to label the row.

## Prerequisites

[!INCLUDE [prerequisites](../../includes/machine-learning-data-labeling-prerequisites.md)]

## Create a text labeling project

[!INCLUDE [start](../../includes/machine-learning-data-labeling-start.md)]

1. To create a project, select **Add project**. Give the project an appropriate name. The project name can’t be reused, even if the project is deleted in future.

1. Select **Text** to create a text labeling project.

    :::image type="content" source="media/how-to-create-text-labeling-projects/text-labeling-creation-wizard.png" alt-text="Labeling project creation for text labeling":::

    * Choose **Text Classification Multi-class** for projects when you want to apply only a *single label* from a set of labels to each piece of text.
    * Choose **Text Classification Multi-label** for projects when you want to apply *one or more* labels from a set of labels to each piece of text. 
    * Choose **Text Named Entity Recognition** for projects when you want to apply labels to individual or multiple words of text in each entry.

1. Select **Next** when you're ready to continue.

## Add workforce (optional)

[!INCLUDE [outsource](../../includes/machine-learning-data-labeling-outsource.md)]

## Select or create a dataset

If you already created a dataset that contains your data, select it from the **Select an existing dataset** drop-down list. Or, select **Create a dataset** to use an existing Azure datastore or to upload local files.

> [!NOTE]
> A project cannot contain more than 500,000 files.  If your dataset has more, only the first 500,000 files will be loaded.  

### Create a dataset from an Azure datastore

In many cases, it's fine to just upload local files. But [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/) provides a faster and more robust way to transfer a large amount of data. We recommend Storage Explorer as the default way to move files.

To create a dataset from data that you've already stored in Azure Blob storage:

1. Select **Create a dataset** > **From datastore**.
1. Assign a **Name** to your dataset.
1. Choose the **Dataset type**:
    * Select **Tabular** if you're using a .csv or .tsv file, where each row contains a response.
    * Select **File** if you're using separate .txt files for each response.
1. (Optional) Provide a description for your dataset.
1. Select **Next**.
1. Select the datastore.
1. If your data is in a subfolder within your blob storage, choose **Browse** to select the path.
    * Append "/**" to the path to include all the files in subfolders of the selected path.
    * Append "**/*.*" to include all the data in the current container and its subfolders.
1. Select **Next**.
1. Confirm the details. Select **Back** to modify the settings or **Create** to create the dataset.

### Create a dataset from uploaded data

To directly upload your data:

1. Select **Create a dataset** > **From local files**.
1. Assign a **Name** to your dataset.
1. Choose the **Dataset type**.
    * Select **Tabular** if you're using a .csv or .tsv file, where each row is a response. 
    * Select **File** if you're using separate .txt files for each response.
1. (Optional) Provide a description of your dataset.
1. Select **Next**
1. (Optional) Select or create a datastore. Or keep the default to upload to the default blob store ("workspaceblobstore") of your Machine Learning workspace.
1. Select **Upload** to select the local file(s) or folder(s) to upload.
1. Select **Next**.
1. If uploading .csv or .tsv files:
    * Confirm the settings and preview, select **Next**.
    * Include all columns of text you'd like the labeler to see when classifying that row.  If you'll be using ML assisted labeling, adding numeric columns may degrade the ML assist model.
    * Select **Next**.
1.  Confirm the details. Select **Back** to modify the settings or **Create** to create the dataset.


## Configure incremental refresh

[!INCLUDE [refresh](../../includes/machine-learning-data-labeling-refresh.md)]

> [!NOTE]
> Incremental refresh is available for projects that use tabular (.csv or .tsv) dataset input. However, only new tabular files are added.  Changes to existing tabular files will not be recognized from the refresh.

## Specify label classes

[!INCLUDE [classes](../../includes/machine-learning-data-labeling-classes.md)]

## Describe the text labeling task

[!INCLUDE [describe](../../includes/machine-learning-data-labeling-describe.md)]

>[!NOTE]
> Be sure to note that the labelers will be able to select the first 9 labels by using number keys 1-9.

## Use ML-assisted data labeling

The **ML-assisted labeling** page lets you trigger automatic machine learning models to accelerate labeling tasks. ML-assisted labeling is available for both file (.txt) and tabular (.csv) text data inputs.
To use **ML-assisted labeling**:

* Select **Enable ML assisted labeling**.
* Select the **Dataset language** for the project. All languages supported by the [TextDNNLanguages Class](/python/api/azureml-automl-core/azureml.automl.core.constants.textdnnlanguages?view=azure-ml-py&preserve-view=true) are present in this list.
* Specify a compute target to use. If you don't have one in your workspace, a compute cluster will be created for you and added to your workspace.   The cluster is created with a minimum of 0 nodes, which means it doesn't cost anything when it's not in use.

### How does ML-assisted labeling work?

At the beginning of your labeling project, the items are shuffled into a random order to reduce potential bias. However, any biases that are present in the dataset will be reflected in the trained model. For example, if 80% of your items are of a single class, then approximately 80% of the data used to train the model will be of that class. 

For training the text DNN model used by ML-assist, the input text per training example will be limited to approximately the first 128 words in the document.  For tabular input, all text columns are first concatenated before applying this limit. This is a practical limit imposed to allow for the model training to complete in a timely manner. The actual text in a document (for file input) or set of text columns (for tabular input) can exceed 128 words.  The limit only pertains to what is internally leveraged by the model during the training process.

The exact number of labeled items necessary to start assisted labeling isn't a fixed number. This can vary significantly from one labeling project to another, depending on many factors, including the number of labels classes and label distribution.

Since the final labels still rely on input from the labeler, this technology is sometimes called *human in the loop* labeling.

> [!NOTE]
> ML assisted data labeling does not support default storage accounts secured behind a [virtual network](how-to-network-security-overview.md). You must use a non-default storage account for ML assisted data labelling. The non-default storage account can be secured behind the virtual network.

### Pre-labeling

After enough labels are submitted for training, the trained model is used to predict tags. The labeler now sees pages that contain predicted labels already present on each item. The task is then to review these predictions and correct any mis-labeled items before submitting the page.  

Once a machine learning model has been trained on your manually labeled data, the model is evaluated on a test set of manually labeled items to determine its accuracy at different confidence thresholds. This evaluation process is used to determine a confidence threshold above which the model is accurate enough to show pre-labels. The model is then evaluated against unlabeled data. Items with predictions more confident than this threshold are used for pre-labeling.

## Initialize the text labeling project

[!INCLUDE [initialize](../../includes/machine-learning-data-labeling-initialize.md)]

## Run and monitor the project

[!INCLUDE [run](../../includes/machine-learning-data-labeling-run.md)]

### Dashboard

The **Dashboard** tab shows the progress of the labeling task.

:::image type="content" source="./media/how-to-create-text-labeling-projects/text-labeling-dashboard.png" alt-text="Text data labeling dashboard":::


The progress chart shows how many items have been labeled, skipped, in need of review, or not yet done.  Hover over the chart to see the number of items in each section.

The middle section shows the queue of tasks yet to be assigned. If ML-assisted labeling is on, you'll also see the number of pre-labeled items.


On the right side is a distribution of the labels for those tasks that are complete.  Remember that in some project types, an item can have multiple labels, in which case the total number of labels can be greater than the total number items.

### Data tab

On the **Data** tab, you can see your dataset and review labeled data. Scroll through the labeled data to see the labels. If you see incorrectly labeled data, select it and choose **Reject**, which will remove the labels and put the data back into the unlabeled queue.

### Details tab

View and change details of your project.  In this tab you can:

* View project details and input datasets
* Enable or disable **incremental refresh at regular intervals**, or request an immediate refresh.
* View details of the storage container used to store labeled outputs in your project
* Add labels to your project
* Edit instructions you give to your labels

### Access for labelers

[!INCLUDE [access](../../includes/machine-learning-data-labeling-access.md)]

## Add new label class to a project

[!INCLUDE [add-label](../../includes/machine-learning-data-labeling-add-label.md)]

## Export the labels
 
Use the **Export** button on the **Project details** page of your labeling project. You can export the label data for Machine Learning experimentation at any time.

For all project types other than **Text Named Entity Recognition**, you can export:
* A CSV file. The CSV file is created in the default blob store of the Azure Machine Learning workspace in a folder within *Labeling/export/csv*. 
* An [Azure Machine Learning dataset with labels](v1/how-to-use-labeled-dataset.md). 


For **Text Named Entity Recognition** projects, you can export:
* An [Azure Machine Learning dataset (v1) with labels](v1/how-to-use-labeled-dataset.md). 
* A CoNLL file.  For this export, you'll also have to assign a compute resource. The export process runs offline and generates the file as part of an experiment run.  When the file is ready to download, you'll see a notification on the top right.  Select this to open the notification, which includes the link to the file.

    :::image type="content" source="media/how-to-create-text-labeling-projects/notification-bar.png" alt-text="Notification for file download.":::

Access exported Azure Machine Learning datasets in the **Datasets** section of Machine Learning. The dataset details page also provides sample code to access your labels from Python.

![Exported dataset](./media/how-to-create-labeling-projects/exported-dataset.png)

## Troubleshooting

[!INCLUDE [troubleshooting](../../includes/machine-learning-data-labeling-troubleshooting.md)]

## Next steps

* [How to tag text](how-to-label-data.md#label-text)
