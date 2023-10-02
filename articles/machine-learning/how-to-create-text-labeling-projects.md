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
ms.date: 02/08/2023
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

## Run and monitor the project

[!INCLUDE [run](includes/machine-learning-data-labeling-run.md)]

### Dashboard

The **Dashboard** tab shows the labeling task progress.

:::image type="content" source="./media/how-to-create-text-labeling-projects/text-labeling-dashboard.png" alt-text="Screenshot that shows the text labeling dashboard.":::

The progress charts show how many items have been labeled, skipped, need review, or aren't yet complete. Hover over the chart to see the number of items in each section.

A distribution of the labels for completed tasks is shown below the chart. In some project types, an item can have multiple labels. The total number of labels can exceed the total number of items.

A distribution of labelers and how many items they've labeled also are shown.

The middle section shows a table that has a queue of unassigned tasks. When ML-assisted labeling is off, this section shows the number of manual tasks that are awaiting assignment.

When ML-assisted labeling is on, this section also shows:

* Tasks that contain clustered items in the queue.
* Tasks that contain pre-labeled items in the queue.

Additionally, when ML-assisted labeling is enabled, you can scroll down to see the ML-assisted labeling status. The **Jobs** sections give links for each of the machine learning runs.

### Data

On the **Data** tab, you can see your dataset and review labeled data. Scroll through the labeled data to see the labels. If you see data that's incorrectly labeled, select it and choose **Reject** to remove the labels and return the data to the unlabeled queue.

If your project uses consensus labeling, review items that have no consensus:

1. Select the **Data** tab.
1. On the left menu, select  **Review labels**.
1. On the command bar above **Review labels**, select **All filters**.

    :::image type="content" source="media/how-to-create-text-labeling-projects/text-labeling-select-filter.png" alt-text="Screenshot that shows how to select filters to review consensus label problems." lightbox="media/how-to-create-text-labeling-projects/text-labeling-select-filter.png":::

1. Under **Labeled datapoints**, select **Consensus labels in need of review** to show only items for which the labelers didn't come to a consensus.

    :::image type="content" source="media/how-to-create-labeling-projects/select-need-review.png" alt-text="Screenshot that shows how to select labels in need of review.":::

1. For each item to review, select the **Consensus label** dropdown to view the conflicting labels.

    :::image type="content" source="media/how-to-create-text-labeling-projects/text-labeling-consensus-dropdown.png" alt-text="Screenshot that shows the Select Consensus label dropdown to review conflicting labels." lightbox="media/how-to-create-text-labeling-projects/text-labeling-consensus-dropdown.png":::

1. Although you can select an individual labeler to see their labels, to update or reject the labels, you must use the top choice, **Consensus label (preview)**.

### Details tab

View and change details of your project. On this tab, you can:

* View project details and input datasets.
* Set or clear the **Enable incremental refresh at regular intervals** option, or request an immediate refresh.
* View details of the storage container that's used to store labeled outputs in your project.
* Add labels to your project.
* Edit instructions you give to your labels.
* Change settings for ML-assisted labeling and kick off a labeling task.

### Language Studio tab

If your project was created from [Language Studio](../ai-services/language-service/custom/azure-machine-learning-labeling.md), you'll also see a **Language Studio** tab.  

* If labeling is active in Language Studio, you can't also label in Azure Machine Learning.  In that case, Language Studio is the only tab available.  Select **View in Language Studio** to go to the active labeling project in Language Studio.  From there, you can switch to labeling in Azure Machine Learning if you wish.

If labeling is active in Azure Machine Learning, you have two choices:

* Select **Switch to Language Studio** to switch your labeling activity back to Language Studio.  When you switch, all your currently labeled data is imported into Language Studio.  Your ability to label data in Azure Machine Learning is disabled, and you can label data in Language Studio. You can switch back to labeling in Azure Machine Learning at any time through Language Studio.

    > [!NOTE] 
    > Only users with the [correct roles](how-to-add-users.md) in Azure Machine Learning have the ability to switch labeling. 

* Select **Disconnect from Language Studio** to sever the relationship with Language Studio.  Once you disconnect, the project will lose its association with Language Studio, and will no longer have the Language Studio tab. Disconnecting your project from Language Studio is a permanent, irreversible process and can't be undone. You will no longer be able to access your labels for this project in Language Studio.  The labels are available only in Azure Machine Learning from this point onward.

### Access for labelers

[!INCLUDE [access](includes/machine-learning-data-labeling-access.md)]

## Add new labels to a project

[!INCLUDE [add-label](includes/machine-learning-data-labeling-add-label.md)]

## Start an ML-assisted labeling task

[!INCLUDE [start-ml-assist](includes/machine-learning-data-labeling-start-ml-assist.md)]

## Export the labels

To export the labels, on the **Project details** page of your labeling project, select the **Export** button. You can export the label data for Machine Learning experimentation at any time.

For all project types except **Text Named Entity Recognition**, you can export label data as:

:::moniker range="azureml-api-1"
* A CSV file. Azure Machine Learning creates the CSV file in a folder inside *Labeling/export/csv*.
* An [Azure Machine Learning dataset with labels](v1/how-to-use-labeled-dataset.md). 
:::moniker-end
:::moniker range="azureml-api-2"
* A CSV file. Azure Machine Learning creates the CSV file in a folder inside *Labeling/export/csv*.
* An [Azure MLTable data asset](./how-to-mltable.md). 
:::moniker-end

For **Text Named Entity Recognition** projects, you can export label data as:

:::moniker range="azureml-api-1"
* An [Azure Machine Learning dataset (v1) with labels](v1/how-to-use-labeled-dataset.md).
* A CoNLL file.  For this export, you'll also have to assign a compute resource. The export process runs offline and generates the file as part of an experiment run. Azure Machine Learning creates the CoNLL file in a folder inside*Labeling/export/conll*. 
:::moniker-end
:::moniker range="azureml-api-2"
* An [Azure MLTable data asset](./how-to-mltable.md).
* A CoNLL file.  For this export, you'll also have to assign a compute resource. The export process runs offline and generates the file as part of an experiment run. Azure Machine Learning creates the CoNLL file in a folder inside*Labeling/export/conll*. 
:::moniker-end

When you export a CSV or CoNLL file, a notification appears briefly when the file is ready to download. Select the **Download file** link to download your results. You'll also find the notification in the **Notification** section on the top bar:

:::image type="content" source="media/how-to-create-labeling-projects/download-file.png" alt-text="Screenshot that shows the notification for the file download.":::

Access exported Azure Machine Learning datasets and data assets in the **Data** section of Machine Learning. The data details page also provides sample code you can use to access your labels by using Python.

:::image type="content" source="media/how-to-create-labeling-projects/exported-dataset.png" alt-text="Screenshot that shows an example of the dataset details page in Machine Learning.":::

## Troubleshoot issues

[!INCLUDE [troubleshooting](includes/machine-learning-data-labeling-troubleshooting.md)]

## Next steps

* [How to tag text](how-to-label-data.md#label-text)
