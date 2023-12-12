---
title: Manage labeling projects
titleSuffix: Azure Machine Learning
description: Tasks for the project manager to administer a labeling project in Azure Machine Learning, including how to export the labels.
author: kvijaykannan 
ms.author: vkann 
ms.reviewer: sgilley
ms.service: machine-learning
ms.subservice: mldata
ms.topic: how-to
ms.date: 12/12/2023
ms.custom: data4ml, ignite-fall-2021, ignite-2022
monikerRange: 'azureml-api-1 || azureml-api-2'
# customer intent: As a project manager, I want to monitor and administer a labeling project in Azure Machine Learning.
---

# Manage labeling projects

Learn how to manage a labeling project in Azure Machine Learning. This article is for project managers who are responsible for managing text or image labeling projects. For information about how to create the project, see [Set up a text labeling project](how-to-create-text-labeling-projects.md) or [Set up an image labeling project](how-to-create-image-labeling-projects.md).

## Run and monitor the project

After you initialize the project, Azure begins to run it. To manage a project, select the project on the main **Data Labeling** page.

To pause or restart the project, on the project command bar, toggle the **Running** status. You can label data only when the project is running.

### Monitor progress

The **Dashboard** tab shows the progress of the labeling task.

#### [Image projects](#tab/image)

:::image type="content" source="./media/how-to-create-labeling-projects/labeling-dashboard.png" alt-text="Screenshot that shows the data labeling dashboard." lightbox="./media/how-to-create-labeling-projects/labeling-dashboard.png":::

The progress charts show how many items were labeled, skipped, need review, or aren't yet complete. Hover over the chart to see the number of items in each section.

A distribution of the labels for completed tasks is shown below the chart. In some project types, an item can have multiple labels. The total number of labels can exceed the total number of items.

A distribution of labelers and how many items they labeled also are shown.

The middle section shows a table that has a queue of unassigned tasks. When ML-assisted labeling is off, this section shows the number of manual tasks that are awaiting assignment.

When ML-assisted labeling is on, this section also shows:

* Tasks that contain clustered items in the queue.
* Tasks that contain prelabeled items in the queue.

Additionally, when ML-assisted labeling is enabled, you can scroll down to see the ML-assisted labeling status. The **Jobs** sections give links for each of the machine learning runs.

* **Training**: Trains a model to predict the labels.
* **Validation**: Determines whether item prelabeling uses the prediction of this model.
* **Inference**: Prediction run for new items.
* **Featurization**: Clusters items (only for image classification projects).

#### [Text projects](#tab/text)

:::image type="content" source="./media/how-to-create-text-labeling-projects/text-labeling-dashboard.png" alt-text="Screenshot that shows the text labeling dashboard." lightbox="./media/how-to-create-text-labeling-projects/text-labeling-dashboard.png":::

The progress charts show how many items were labeled, skipped, need review, or aren't yet complete. Hover over the chart to see the number of items in each section.

A distribution of the labels for completed tasks is shown below the chart. In some project types, an item can have multiple labels. The total number of labels can exceed the total number of items.

A distribution of labelers and how many items they labeled also are shown.

The middle section shows a table that has a queue of unassigned tasks. When ML-assisted labeling is off, this section shows the number of manual tasks that are awaiting assignment.

When ML-assisted labeling is on, this section also shows:

* Tasks that contain clustered items in the queue.
* Tasks that contain prelabeled items in the queue.

Additionally, when ML-assisted labeling is enabled, you can scroll down to see the ML-assisted labeling status. The **Jobs** sections give links for each of the machine learning runs.

--- 

### Review data and labels

On the **Data** tab, preview the dataset and review labeled data. 

Scroll through the labeled data to see the labels. If you see data that's incorrectly labeled, select it and choose **Reject** to remove the labels and return the data to the unlabeled queue.

#### Skipped items

A set of filters apply to the items you're reviewing. By default, you review labeled data. Select the **Asset type** filter to switch the type to **Skipped* to review items that were skipped. 

:::image type="content" source="media/how-to-create-labeling-projects/asset-type-filter.png" alt-text="Screenshot shows the filters for reviewing labels.":::

If you think the skipped data should be labeled, select **Reject** to put in back into the unlabeled queue. If you think the skipped data isn't relevant to your project, select **Accept** to remove it from the project.

#### Consensus labeling

If your project uses consensus labeling, review images that have no consensus:

#### [Image projects](#tab/image)

1. Select the **Data** tab.
1. On the left menu, select **Review labels**.
1. On the command bar above **Review labels**, select **All filters**.

    :::image type="content" source="media/how-to-create-labeling-projects/select-filters.png" alt-text="Screenshot that shows how to select filters to review consensus label problems." lightbox="media/how-to-create-labeling-projects/select-filters.png":::

1. Under **Labeled datapoints**, select **Consensus labels in need of review** to show only images for which the labelers didn't come to a consensus.

    :::image type="content" source="media/how-to-create-labeling-projects/select-need-review.png" alt-text="Screenshot that shows how to select labels in need of review.":::

1. For each image to review, select the **Consensus label** dropdown to view the conflicting labels.

    :::image type="content" source="media/how-to-create-labeling-projects/consensus-dropdown.png" alt-text="Screenshot that shows the Select Consensus label dropdown to review conflicting labels." lightbox="media/how-to-create-labeling-projects/consensus-dropdown.png":::

1. Although you can select an individual labeler to see their labels, to update or reject the labels, you must use the top choice, **Consensus label (preview)**.

#### [Text projects](#tab/text)

1. Select the **Data** tab.
1. On the left menu, select **Review labels**.
1. On the command bar above **Review labels**, select **All filters**.

    :::image type="content" source="media/how-to-create-text-labeling-projects/text-labeling-select-filter.png" alt-text="Screenshot that shows how to select filters to review consensus label problems." lightbox="media/how-to-create-text-labeling-projects/text-labeling-select-filter.png":::

1. Under **Labeled datapoints**, select **Consensus labels in need of review** to show only items for which the labelers didn't come to a consensus.

    :::image type="content" source="media/how-to-create-labeling-projects/select-need-review.png" alt-text="Screenshot that shows how to select labels in need of review.":::

1. For each item to review, select the **Consensus label** dropdown to view the conflicting labels.

    :::image type="content" source="media/how-to-create-text-labeling-projects/text-labeling-consensus-dropdown.png" alt-text="Screenshot that shows the Select Consensus label dropdown to review conflicting labels." lightbox="media/how-to-create-text-labeling-projects/text-labeling-consensus-dropdown.png":::

1. Although you can select an individual labeler to see their labels, to update or reject the labels, you must use the top choice, **Consensus label (preview)**.

---

### Change project details

View and change details of your project on the **Details** tab. On this tab, you can:

* View project details and input datasets.
* Set or clear the **Enable incremental refresh at regular intervals** option, or request an immediate refresh.
* View details of the storage container that's used to store labeled outputs in your project.
* Add labels to your project.
* Edit instructions you give to your labels.
* Change settings for ML-assisted labeling and kick off a labeling task.

### Projects created in Azure AI services

If your labeling project was created from [Vision Studio](../ai-services/computer-vision/how-to/model-customization.md) or [Language Studio](../ai-services/language-service/custom/azure-machine-learning-labeling.md), you'll see an extra tab on the **Details** page. The tab allows you to switch between labeling in Azure Machine Learning and labeling in Vision Studio or Language Studio.

#### [Image projects](#tab/image)

If your project was created from [Vision Studio](../ai-services/computer-vision/how-to/model-customization.md), you'll also see a **Vision Studio** tab. Select **Go to Vision Studio** to return to Vision Studio. Once you return to Vision Studio, you'll be able to import your labeled data.

#### [Text projects](#tab/text)

If your project was created from [Language Studio](../ai-services/language-service/custom/azure-machine-learning-labeling.md), you'll see a **Language Studio** tab. 

* If labeling is active in Language Studio, you can't label in Azure Machine Learning. In that case, Language Studio is the only tab available. Select **View in Language Studio** to go to the active labeling project in Language Studio. From there, you can switch to labeling in Azure Machine Learning if you wish.

If labeling is active in Azure Machine Learning, you have two choices:

* Select **Switch to Language Studio** to switch your labeling activity back to Language Studio. When you switch, all your currently labeled data is imported into Language Studio. Your ability to label data in Azure Machine Learning is disabled, and you can label data in Language Studio. You can switch back to labeling in Azure Machine Learning at any time through Language Studio.

  > [!NOTE] 
  > Only users with the [correct roles](how-to-add-users.md) in Azure Machine Learning have the ability to switch labeling. 

* Select **Disconnect from Language Studio** to sever the relationship with Language Studio. Once you disconnect, the project loses its association with Language Studio, and no longer shows the Language Studio tab. Disconnecting your project from Language Studio is a permanent, irreversible process and can't be undone. You'll no longer be able to access your labels for this project in Language Studio. The labels are available only in Azure Machine Learning from this point onward.

--- 
## Add new labels to a project

During the data labeling process, you might want to add more labels to classify your items. For example, you might want to add an *Unknown* or *Other* label to indicate confusion.

To add one or more labels to a project:

1. On the main **Data Labeling** page, select the project.
1. On the project command bar, toggle the status from **Running** to **Paused** to stop labeling activity.
1. Select the **Details** tab.
1. In the list on the left, select **Label categories**.
1. Modify your labels.

  :::image type="content" source="./media/how-to-create-labeling-projects/add-label.png" alt-text="Screenshot that shows how to add a label in Machine Learning Studio.":::

1. In the form, add your new label. Then choose how to continue the project. Because you changed the available labels, choose how to treat data that's already labeled:

    * Start over, and remove all existing labels. Choose this option if you want to start labeling from the beginning by using the new full set of labels.
    * Start over, and keep all existing labels. Choose this option to mark all data as unlabeled, but keep the existing labels as a default tag for images that were previously labeled.
    * Continue, and keep all existing labels. Choose this option to keep all data already labeled as it is, and start using the new label for data that's not yet labeled.

1. Modify your instructions page as necessary for new labels.
1. After you've added all new labels, toggle **Paused** to **Running** to restart the project. 

## Start an ML-assisted labeling task

ML-assisted labeling starts automatically after some items have been labeled. This automatic threshold varies by project. You can manually start an ML-assisted training run if your project contains at least some labeled data.

> [!NOTE]
> On-demand training is not available for projects created before December 2022. To use this feature, create a new project.

To start a new ML-assisted training run:

1. At the top of your project, select **Details**.
1. On the left menu, select **ML assisted labeling**.
1. Near the bottom of the page, for **On-demand training**, select **Start**.

## Export the labels

To export the labels, on the project command bar, select the **Export** button. You can export the label data for Machine Learning experimentation at any time.

#### [Image projects](#tab/image)

If your project type is Semantic segmentation (Preview), an [Azure MLTable data asset](./how-to-mltable.md) is created.

For all other project types, you can export an image label as:

:::moniker range="azureml-api-1"
* A CSV file. Azure Machine Learning creates the CSV file in a folder inside *Labeling/export/csv*.
* A [COCO format](http://cocodataset.org/#format-data) file. Azure Machine Learning creates the COCO file in a folder inside *Labeling/export/coco*. 
* An [Azure Machine Learning dataset with labels](v1/how-to-use-labeled-dataset.md).
:::moniker-end

:::moniker range="azureml-api-2"

* A CSV file. Azure Machine Learning creates the CSV file in a folder inside *Labeling/export/csv*.
* A [COCO format](https://cocodataset.org/#format-data) file. Azure Machine Learning creates the COCO file in a folder inside *Labeling/export/coco*. 
* An [Azure MLTable data asset](./how-to-mltable.md).
:::moniker-end

When you export a CSV or COCO file, a notification appears briefly when the file is ready to download. Select the **Download file** link to download your results. You can also find the notification in the **Notification** section on the top bar:

:::image type="content" source="media/how-to-create-labeling-projects/download-file.png" alt-text="Screenshot that shows the notification for the file download.":::

Access exported Azure Machine Learning datasets and data assets in the **Data** section of Machine Learning. The data details page also provides sample code you can use to access your labels by using Python.

:::image type="content" source="media/how-to-create-labeling-projects/exported-dataset.png" alt-text="Screenshot that shows an example of the dataset details page in Machine Learning.":::

:::moniker range="azureml-api-1"
After you export your labeled data to an Azure Machine Learning dataset, you can use AutoML to build computer vision models that are trained on your labeled data. Learn more at [Set up AutoML to train computer vision models by using Python](how-to-auto-train-image-models.md).
:::moniker-end

#### [Text projects](#tab/text)

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
* A `CoNLL` file. For this export, you'll also have to assign a compute resource. The export process runs offline and generates the file as part of an experiment run. Azure Machine Learning creates the `CoNLL` file in a folder inside*Labeling/export/conll*.
:::moniker-end
:::moniker range="azureml-api-2"
* An [Azure MLTable data asset](./how-to-mltable.md).
* A `CoNLL` file. For this export, you also have to assign a compute resource. The export process runs offline and generates the file as part of an experiment run. Azure Machine Learning creates the `CoNLL` file in a folder. inside*Labeling/export/conll*. 
:::moniker-end

When you export a `CSV` or `CoNLL` file, a notification appears briefly when the file is ready to download. Select the **Download file** link to download your results. You'll also find the notification in the **Notification** section on the top bar:

:::image type="content" source="media/how-to-create-labeling-projects/download-file.png" alt-text="Screenshot that shows the notification for the file download.":::

Access exported Azure Machine Learning datasets and data assets in the **Data** section of Machine Learning. The data details page also provides sample code you can use to access your labels by using Python.

:::image type="content" source="media/how-to-create-labeling-projects/exported-dataset.png" alt-text="Screenshot that shows an example of the dataset details page in Machine Learning.":::

---

## Import labels

If you have an Azure MLTable data asset or COCO file that contains labels for your current data, you can import these labels into your project. For example, you might have labels that were exported from a previous labeling project using the same data. The import labels feature is available for image projects only.

#### [Image projects](#tab/image)

To import labels, on the project command bar, select the **Import** button. You can import labeled data for Machine Learning experimentation at any time.

Import from either a COCO file or an Azure MLTable data asset.

### Data mapping

[!INCLUDE [mapping](includes/machine-learning-data-labeling-mapping.md)]

### Import options

[!INCLUDE [mapping](includes/machine-learning-data-labeling-mapping.md)]

#### [Text projects](#tab/text)

The import labels feature is not available for text projects.

---

## Access for labelers

Anyone who has Contributor or Owner access to your workspace can label data in your project.

You can also add users and customize the permissions so that they can access labeling but not other parts of the workspace or your labeling project. For more information, see [Add users to your data labeling project](./how-to-add-users.md).

## Troubleshoot issues

Use these tips if you see any of the following issues:

|Issue |Resolution |
|---------|---------|
|Only datasets created on blob datastores can be used.|This issue is a known limitation of the current release.|
|Removing data from the dataset your project uses causes an error in the project.|Don't remove data from the version of the dataset you used in a labeling project. Create a new version of the dataset to use to remove data.|
|After a project is created, the project status is *Initializing* for an extended time.|Manually refresh the page. Initialization should complete at roughly 20 data points per second. No automatic refresh is a known issue.|
|Newly labeled items aren't visible in data review.|To load all labeled items, select the **First** button. The **First** button takes you back to the front of the list, and it loads all labeled data.|
|You can't assign a set of tasks to a specific labeler.|This issue is a known limitation of the current release.|

### Troubleshoot object detection

|Issue |Resolution |
|---------|---------|
|If you select the Esc key when you label for object detection, a zero-size label is created and label submission fails.|To delete the label, select the **X** delete icon next to the label.|

## Next step

[Labeling images and text documents](how-to-label-data.md)