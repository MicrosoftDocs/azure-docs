# Getting started with advanced development in the cloud via Jupyter Notebooks and Azure Machine Learning

This article walks you through the process of setting up an Azure Machine Learning workspace, uploading a preconfigured sample Jupyter Notebook to the workspace,
creating a compute instance, and running the cells of the notebook within the workspace.

The [notebook](https://github.com/microsoft/Project-Santa-Cruz-Private-Preview/blob/main/Sample-Scripts-and-Notebooks/Official/Machine%20Learning%20Notebooks/Transferlearningusing_SSDLiteV2%20Model.ipynb) performs transfer learning using a pre-trained TensorFlow model (MobileNetSSDV2Lite) on AzureML
in Python with a custom dataset to detect bowls.

The notebook shows how to start from [COCO](https://cocodataset.org/#home), filter it down to only the class of interest (bowls), and then
convert it into the appropriate format. Alternatively, you could use the open-source [VoTT 2](https://github.com/microsoft/VoTT) labeling tool to create
and label bounding boxes in the PASCAL VOC format.

After retraining the model on the custom dataset, the model can then be deployed to your Azure Percept DK using the module twin update method.

You may then check model inferencing by viewing the live RTSP stream from the Azure Percept Vision SoM. Both model retraining and deployment are performed within the notebook in the cloud.

## Prerequisites

- [Azure Machine Learning Subscription](https://azure.microsoft.com/en-us/free/services/machine-learning/)
- [Azure Percept DK with Azure Percept Vision SoM connected](overview-azure-percept-dk.md)
- [Azure Percept DK on-boarding experience](./quickstart-percept-dk-setup.md) completed

## Download Azure Percept GitHub repository

1. Go to the [Azure Percept GitHub repository](https://github.com/microsoft/Project-Santa-Cruz-Private-Preview).

1. Clone the repository or download the ZIP file. Near the top of the screen, click **Code** -> **Download ZIP**.

    :::image type="content" source="./media/advanced_development_cloud/download-zip.png" alt-text="Image.":::

## Set up Azure Machine Learning portal and notebook

1. Go to the [Azure Machine Learning Portal](https://ml.azure.com).

1. Select your directory, Azure subscription, and Machine Learning workspace from the drop down menus and click **Get started**.

    :::image type="content" source="./media/advanced_development_cloud/ml-portal-get-started.png" alt-text="Image.":::

    If you don’t have an Azure Machine Learning workspace yet, click **Create a new workspace**. In the new browser tab, do the following:

    1. Select your Azure subscription.
    1. Select your resource group.
    1. Enter a name for your workspace.
    1. Select your region.
    1. Select your workspace edition.
    1. Click **Review and create**.
    1. On the next page, review your selections and click **Create**.

        :::image type="content" source="./media/advanced_development_cloud/workspace-review-and-create.png" alt-text="Image.":::

    Please allow a few minutes for workspace creation. After the workspace creation is complete, you will see green check marks next to
    your resources and **Your deployment is complete** at the top of the Machine Learning Services overview page.

    :::image type="content" source="./media/advanced_development_cloud/workspace-creation-complete.png" alt-text="Image.":::

    Once your workspace creation is complete, return to the machine learning portal tab and click **Get started**.

1. In the machine learning workspace homepage, click **Notebooks** on the left-hand pane.

    :::image type="content" source="./media/advanced_development_cloud/notebook.png" alt-text="Image.":::

1. Under the **My files** tab, click the vertical arrow to upload your .ipynb file.

    :::image type="content" source="./media/advanced_development_cloud/upload-files.png" alt-text="Image.":::

1. Navigate to and select the [Transferlearningusing_SSDLiteV2 Model.ipynb file](https://github.com/microsoft/Project-Santa-Cruz-Private-Preview/blob/main/Sample-Scripts-and-Notebooks/Official/Machine%20Learning%20Notebooks/Transferlearningusing_SSDLiteV2%20Model.ipynb) from your local copy of the
Azure Percept GitHub repository. Click **Open**. In the **Upload files** window, check the box next
to **I trust contents from this file** and click **Upload**.

    :::image type="content" source="./media/advanced_development_cloud/select-file.png" alt-text="Image.":::

1. On the top right menu bar, check your **Compute** status. If no computes are found, click the **+** icon to create a new compute.

    :::image type="content" source="./media/advanced_development_cloud/no-computes-found.png" alt-text="Image.":::

1. In the **New compute instance** window, enter a **Compute name**, choose a **Virtual machine type**, and select a **Virtual machine size**. Click **Create**.

    :::image type="content" source="./media/advanced_development_cloud/new-compute-instance.png" alt-text="Image.":::

    Once you click **Create**, your **Compute** status will display a blue circle and **\<your compute name> - Creating**

    :::image type="content" source="./media/advanced_development_cloud/compute-creating.png" alt-text="Image.":::

    Your **Compute** status will display a green circle and **\<your compute name> - Running** after compute creation is complete.

    :::image type="content" source="./media/advanced_development_cloud/compute-running.png" alt-text="Image.":::

1. Once the compute is running, select the **Python 3.6 - AzureML** kernel from the drop-down menu next to the **+** icon.

## Working with the notebook

You are now ready to run the notebook to train your custom bowl detector and deploy it to your devkit. Make sure to run each cell of the notebook
individually as some of the cells require input parameters before executing the script. Cells that require input parameters may be
edited directly in the notebook. To run a cell, click the play icon on the left side of the cell:

:::image type="content" source="./media/advanced_development_cloud/run-cell.png" alt-text="Image.":::

For additional Azure Machine Learning service example notebooks, please visit this [repo](https://github.com/Azure/MachineLearningNotebooks/tree/2aa7c53b0ce84e67565d77e484987714fdaed36e/how-to-use-azureml)
