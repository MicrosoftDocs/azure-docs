---
title: Set up a text labeling project
titleSuffix: Azure Machine Learning
description: Learn how to create a project and use the data labeling tool to label text in the project. Specify either a single label or multiple labels to apply to each piece of text.
author: kvijaykannan 
ms.author: vkann 
ms.reviewer: sgilley
ms.service: machine-learning
ms.subservice: mldata
ms.topic: how-to
ms.date: 12/12/2023
ms.custom: data4ml, ignite-fall-2021
monikerRange: 'azureml-api-1 || azureml-api-2'
---

# Set up a text labeling project and export labels

In Azure Machine Learning, learn how to create and run data labeling projects to label text data. Specify either a single label or multiple labels to apply to each text item.

You can also use the data labeling tool in Azure Machine Learning to [create an image labeling project](how-to-create-image-labeling-projects.md).

## Text labeling capabilities

Azure Machine Learning data labeling is a tool you can use to create, manage, and monitor data labeling projects. Use it to:

- Coordinate data, labels, and team members to efficiently manage labeling tasks.
- Track progress and maintain the queue of incomplete labeling tasks.
- Start and stop the project, and control the labeling progress.
- Review and export the labeled data as an Azure Machine Learning dataset.

> [!IMPORTANT]
> The text data you work with in the Azure Machine Learning data labeling tool must be available in an Azure Blob Storage datastore. If you don't have an existing datastore, you can upload your data files to a new datastore when you create a project.

These data formats are available for text data:

* *.txt*: Each file represents one item to be labeled.
* *.csv* or *.tsv*: Each row represents one item that's presented to the labeler. You decide which columns the labeler can see when they label the row.

## Prerequisites

You use these items to set up text labeling in Azure Machine Learning:

[!INCLUDE [prerequisites](includes/machine-learning-data-labeling-prerequisites.md)]

## Create a text labeling project

[!INCLUDE [start](includes/machine-learning-data-labeling-start.md)]

1. To create a project, select **Add project**.

1. For **Project name**, enter a name for the project.

   You can't reuse the project name, even if you delete the project.

1. To create a text labeling project, for **Media type**, select **Text**.

1. For **Labeling task type**, select an option for your scenario:

    * To apply only a *single label* to each piece of text from a set of labels, select **Text Classification Multi-class**.
    * To apply *one or more* labels to each piece of text from a set of labels, select **Text Classification Multi-label**.
    * To apply labels to individual text words or to multiple text words in each entry, select **Text Named Entity Recognition**.

    :::image type="content" source="media/how-to-create-text-labeling-projects/text-labeling-creation-wizard.png" alt-text="Screenshot that shows creating a labeling project for text labeling.":::

1. Select **Next** to continue.

## Add workforce (optional)

[!INCLUDE [outsource](includes/machine-learning-data-labeling-outsource.md)]

## Select or create a dataset

If you already created a dataset that contains your data, select it in the **Select an existing dataset** dropdown. You can also select **Create a dataset** to use an existing Azure datastore or to upload local files.

> [!NOTE]
> A project can't contain more than 500,000 files. If your dataset exceeds this file count, only the first 500,000 files are loaded.

### Create a dataset from an Azure datastore

In many cases, you can upload local files. However, [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/) provides a faster and more robust way to transfer a large amount of data. We recommend Storage Explorer as the default way to move files.

To create a dataset from data that's already stored in Blob Storage:

1. Select **Create**.
1. For **Name**, enter a name for your dataset. Optionally, enter a description.
1. Choose the **Dataset type**:
    * If you're using a *.csv* or *.tsv* file and each row contains a response, select **Tabular**.
    * If you're using separate *.txt* files for each response, select **File**.
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
1. Choose the **Dataset type**:
    * If you're using a *.csv* or *.tsv* file and each row contains a response, select **Tabular**.
    * If you're using separate *.txt* files for each response, select **File**.
1. Select **Next**.
1. Select **From local files**, and then select **Next**.
1. (Optional) Select a datastore. The default uploads to the default blob store (*workspaceblobstore*) for your Machine Learning workspace.
1. Select **Next**.
1. Select **Upload** > **Upload files** or **Upload** > **Upload folder** to select the local files or folders to upload.
1. Find your files or folder in the browser window, and then select **Open**.
1. Continue to select **Upload** until you specify all of your files and folders.
1. Optionally select the **Overwrite if already exists** checkbox. Verify the list of files and folders.
1. Select **Next**.
1. Confirm the details. Select **Back** to modify the settings, or select **Create** to create the dataset.
1. Finally, select the data asset you created.

## Configure incremental refresh

[!INCLUDE [refresh](includes/machine-learning-data-labeling-refresh.md)]

> [!NOTE]
> Projects that use tabular (*.csv* or *.tsv*) dataset input can use incremental refresh. But incremental refresh only adds new tabular files. The refresh doesn't recognize changes to existing tabular files.

## Specify label categories

[!INCLUDE [classes](includes/machine-learning-data-labeling-classes.md)]

## Describe the text labeling task

[!INCLUDE [describe](includes/machine-learning-data-labeling-describe.md)]

> [!NOTE]
> Labelers can select the first nine labels by using number keys 1 through 9.

## Quality control (preview)

[!INCLUDE [describe](includes/machine-learning-data-labeling-quality-control.md)]

## Use ML-assisted data labeling

To accelerate labeling tasks, the **ML assisted labeling** page can trigger automatic machine learning models. Machine learning (ML)-assisted labeling can handle both file (*.txt*) and tabular (*.csv*) text data inputs.

To use ML-assisted labeling:

1. Select **Enable ML assisted labeling**.
1. Select the **Dataset language** for the project. This list shows all languages that the [TextDNNLanguages Class](/python/api/azureml-automl-core/azureml.automl.core.constants.textdnnlanguages?view=azure-ml-py&preserve-view=true) supports.
1. Specify a compute target to use. If you don't have a compute target in your workspace, this step creates a compute cluster and adds it to your workspace. The cluster is created with a minimum of zero nodes, and it costs nothing when not in use.

### More information about ML-assisted labeling

At the start of your labeling project, the items are shuffled into a random order to reduce potential bias. However, the trained model reflects any biases present in the dataset. For example, if 80 percent of your items are of a single class, then approximately 80 percent of the data that's used to train the model lands in that class.

To train the text DNN model that ML-assisted labeling uses, the input text per training example is limited to approximately the first 128 words in the document. For tabular input, all text columns are concatenated before this limit is applied. This practical limit allows the model training to complete in a reasonable amount of time. The actual text in a document (for file input) or set of text columns (for tabular input) can exceed 128 words. The limit pertains only to what the model internally uses during the training process.

The number of labeled items that's required to start assisted labeling isn't a fixed number. This number can vary significantly from one labeling project to another. The variance depends on many factors, including the number of label classes and the label distribution.

When you use consensus labeling, the consensus label is used for training.

Because the final labels still rely on input from the labeler, this technology is sometimes called *human-in-the-loop* labeling.

> [!NOTE]
> ML-assisted data labeling doesn't support default storage accounts that are secured behind a [virtual network](how-to-network-security-overview.md). You must use a non-default storage account for ML-assisted data labeling. The non-default storage account can be secured behind the virtual network.

### Pre-labeling

After you submit enough labels for training, the trained model is used to predict tags. The labeler now sees pages that show predicted labels already present on each item. The task then involves reviewing these predictions and correcting any mislabeled items before page submission. 

After you train the machine learning model on your manually labeled data, the model is evaluated on a test set of manually labeled items. The evaluation helps determine the model's accuracy at different confidence thresholds. The evaluation process sets a confidence threshold beyond which the model is accurate enough to show pre-labels. The model is then evaluated against unlabeled data. Items that have predictions that are more confident than the threshold are used for pre-labeling.

## Initialize the text labeling project

[!INCLUDE [initialize](includes/machine-learning-data-labeling-initialize.md)]


## Next steps

* [Manage labeling projects](how-to-manage-labeling-projects.md)
* [How to tag text](how-to-label-data.md#label-text)