Tutorial: Run `Python` scripts as part of a pipeline through Azure Data Factory using Azure Batch
================
komammas
<!-- 
- [Tutorial: Run `Python` scripts as part of a pipeline through Azure Data Factory using Azure Batch](#tutorial-run-python-scripts-as-part-of-a-pipeline-through-azure-data-factory-using-azure-batch)
  - [Introduction](#introduction)
  - [Prerequisites](#prerequisites)
  - [Sign in to Azure](#sign-in-to-azure)
  - [Set up an Azure Storage Account](#set-up-an-azure-storage-account)
- [Run the Python script](#run-the-python-script)
  - [Install Azure library for `Python`](#install-azure-library-for-python)
  - [Develop a script in `Python`](#develop-a-script-in-python)
  - [Set up an Azure Batch account](#set-up-an-azure-batch-account)
  - [Create a pool of compute nodes](#create-a-pool-of-compute-nodes)
  - [Set up Azure Data Factory pipeline](#set-up-azure-data-factory-pipeline)
  - [Monitor the log files](#monitor-the-log-files)
-->

Introduction
------------

Run your Python workloads as part of an Azure Data Factory pipeline. The following example runs a script in Python that receives inputs (iris.csv) from an Azure Blob Storage account, performs a data manipulation process and returns the outputs back to the Azure Blob Storage account. In this tutorial you will also learn how to schedule your Python workloads, monitor your analytics pipeline and access your logfiles. 

Prerequisites
-------------

-   An installed [Python](https://www.python.org/downloads/) distribution.
-   [Azure library](https://pypi.org/project/azure/) for Python
-   An Azure Batch account, an Azure Storage account and an Azure Data Factory account. To create these accounts, see the Batch quickstarts using the [Azure portal](https://github.com/MicrosoftDocs/azure-docs/blob/master/articles/batch/quick-create-portal.md) or [Azure CLI](https://github.com/MicrosoftDocs/azure-docs/blob/master/articles/batch/quick-create-cli.md).

Sign in to Azure
----------------

Sign in to the Azure portal at <https://portal.azure.com>.

Set up an Azure Storage Account
-------------------------------

Set up your Azure Storage account using the [Azure portal](https://docs.microsoft.com/en-us/azure/storage/common/storage-quickstart-create-account?tabs=azure-portal). In the following example, you will access your **Azure Blob Storage** container and will upload the **iris.csv** file.

1.  Select **Overview** &gt; **Blobs**

    ![](https://github.com/mammask/tutorial-run-r-batch-azure-data-factory/blob/master/samples/setup-azure-blob-storage.png?raw=true)

2.  Select your storage container (e.g. **mystorage**)

    ![](https://raw.githubusercontent.com/mammask/tutorial-run-r-batch-azure-data-factory/master/samples/select-blob-storage-container.PNG)

3.  **Upload** &gt; **Files** &gt; iris.csv &gt; **Upload to folder** &gt; inputs. A new folder will be created even if it does not exist.

    ![](https://raw.githubusercontent.com/mammask/tutorial-run-r-batch-azure-data-factory/master/samples/upload-to-blob-storage-container.PNG)

When the dataset is uploaded the status of the current uploads will be updated to completed.

# Run the Python script

The prerequisite packages along with the Python script are described in the following sections.

## Install Azure library for `Python`

```bash
pip install azure
```

## Develop a script in `Python`

The following script in `Python` loads a dataset from **Azure Blob Storage** &gt; mystorage, it performs a data manipulation process and saves the results back to the Azure Blob Storage container in a different folder.

``` python
# Load libraries
from azure.storage.blob import BlockBlobService
import pandas as pd

# Define parameters
storageAccountName = "<storage-account-name>"
storageKey         = "<storage-account-key>"
containerName      = "<container-name>"

# Establish connection with the blob storage account
blobService = BlockBlobService(account_name=storageAccountName,
                               account_key=storageKey
                               )

# Load iris dataset from the task node
df = pd.read_csv("iris.csv")

# Subset records
df = df[df['Species'] == "setosa"]

# Save the subset of the iris dataframe locally in task node
df.to_csv("iris_setosa.csv", index = False)

# Upload iris dataset
blobService.create_blob_from_text(containerName, "outputs/iris_setosa.csv", "iris_setosa.csv")
```

Save the script as *main.python* and upload it to the **Azure Storage** container.

![Upload Blob](https://raw.githubusercontent.com/mammask/azure-docs-pr/master/articles/batch/media/run-python-batch-azure-data-factory/upload_script_blob.PNG?token=ABTT2GOQBBVLIF4NKHEMGZS5ZLY4S)

Run the script locally using either command prompt or terminal depending on your operating system.

``` bash
python main.py
```

Access the **Azure portal** and check that the dataset is now saved in the outputs folder of the **Azure Storage** container.

![Upload Subset](https://raw.githubusercontent.com/mammask/azure-docs-pr/master/articles/batch/media/run-python-batch-azure-data-factory/upload_subset_data_blob.PNG?token=ABTT2GPP5OCTYKBOXNKTCAK5ZLY7Y)

Set up an Azure Batch account
-----------------------------

Set up your **Azure Batch** account using the [Azure portal](%22https://docs.microsoft.com/en-us/azure/batch/quick-create-portal%22).

1.  Select **Create a resource** &gt; **Compute** &gt; **Batch Service**. We named the Batch service as **mybatchtest**.

2.  Enter values for **Account name** and **Resource group**. The account name must be unique within the Azure Location selected, use only lowercase characters or numbers, and contain 3-24 characters.

3.  In **Storage account**, select an existing storage account (the one created in the previous step).

4.  Keep the defaults for the remaining settings, and select **Create** to create the account.

For more information about how to setup an Azure Batch account you can follow the official [documentation](https://docs.microsoft.com/en-us/azure/batch/batch-account-create-portal).

Create a pool of compute nodes
------------------------------

Now that the Batch account is set up and is associated with the Blob storage account, create a set of pool nodes to run the `Python` script.

1.  Access the Batch account and select **Pools**

2.  Select **Add** to add a new Pool

    ![](https://github.com/mammask/tutorial-run-r-batch-azure-data-factory/blob/master/samples/create-pool.PNG?raw=true)

3.  Set a Pool ID

4.  Enter **MarketPlace (Linux/Windows)** as an Image Type

5.  Enter **microsoft-dsvm** as a Publisher

6.  Enter a **dsvm-windows** as an offer

7.  Select a very small VM for this exmaple: **Standard A1 (1 Cores, 1.8GB Memory)**

8.  Pick one **Target dedicated node**

9.  Keep defaults for the remaining settings, and select **OK** to create the pool

Set up Azure Data Factory pipeline
----------------------------------

In this procedure, you create and validate a pipeline using a script in `Python` to load a .csv dataset from a **Blob Storage** container, perform a data manipulation process and output the results of the analysis to a different folder in the **Blob Storage** container. For more information about how to create pipelines using **Data Factory** you can follow the official [documentation](https://docs.microsoft.com/en-us/azure/data-factory/concepts-pipelines-activities).

1.  In the **Factory Resources** box, select the + (plus) button and then select **Pipeline**

2.  In the **General** tab specify **run Python** for Name

    ![](https://raw.githubusercontent.com/mammask/azure-docs-pr/master/articles/batch/media/run-python-batch-azure-data-factory/adf-create-pipeline.png?token=ABTT2GMIRJJPYBVS7ADEC2S5ZLZL6)

3.  In the **Activities** box, expand the **Batch Service**. Drag the **Custom** activity from the **Activities** toolbox to the pipeline designer surface.

4.  In the **General** tab specify **testPipeline** for Name

    ![](https://raw.githubusercontent.com/mammask/azure-docs-pr/master/articles/batch/media/run-python-batch-azure-data-factory/adf-create-custom-task.png?token=ABTT2GPZKBE6AN74MJ3QBG25ZLZQW)


5.  In the **Azure Batch** tab, add the **Batch Account** that was created in the previous steps and **Test connection** to ensure that it is successful.

    ![](https://github.com/mammask/tutorial-run-r-batch-azure-data-factory/blob/master/samples/integrate-pipeline-with-azure-batch.PNG?raw=true)

6.  In the **Settings** tab, enter the command `python main.py`.

7.  Add the **Batch Account** that was created in the previous steps in the **Resource Linked Service** and **Test connection** to ensure that it is successful

8.  In the **Folder Path**, select the name of the **Azure Blob Storage** container that contains the `Python` script and the associated inputs. This will download the selected files from the container to the pool node instances before the execution of the `Python` script.

    ![](https://raw.githubusercontent.com/mammask/azure-docs-pr/master/articles/batch/media/run-python-batch-azure-data-factory/adf-create-custom-task-python-script-command.PNG?token=ABTT2GLQOQ4OPMOW6WFMUT25ZLZTI)

9.  Click **Validate** on the pipeline toolbar above the canvas to validate the pipeline settings. Confirm that the pipeline has been successfully validated. To close the validation output, select the &gt;&gt; (right arrow) button

10. Click **debug** to debug the pipeline

11. Click **publish** to publish the pipeline

12. Click **trigger** to run the `Python` script as part of a batch process

    ![](https://raw.githubusercontent.com/mammask/azure-docs-pr/master/articles/batch/media/run-python-batch-azure-data-factory/adf-create-custom-task-python-success-run.PNG?token=ABTT2GKSGTINC5OX3VEXPXS5ZLZXK)

You can debug, trigger, monitor the pipeline manually and schedule periodical executions of the script. For more information visit the Azure official [documentation](https://docs.microsoft.com/en-us/azure/batch/batch-account-create-portal).

Monitor the log files
---------------------

Access the log files of the batch process to view bugs/ warnings produced by the execution of the `Python` script on the pool nodes. If the Azure Batch Custom Activity returns an error then you can access the working directory of the pool node.

1.  Access your **Azure Batch** account

2.  Select **Jobs**

    ![](https://github.com/mammask/tutorial-run-r-batch-azure-data-factory/blob/master/samples/access-batch-jobs-log.PNG?raw=true)

3.  Select the pool id that is associated with the tasks that ran on **Azure Data Factory**

    ![](https://raw.githubusercontent.com/mammask/azure-docs-pr/master/articles/batch/media/run-python-batch-azure-data-factory/batch-jobs.PNG?token=ABTT2GPRX4WAB6XNA53HCO25ZLZZE)

4.  Select the latest task

    ![](https://raw.githubusercontent.com/mammask/azure-docs-pr/master/articles/batch/media/run-python-batch-azure-data-factory/batch-jobs-successful-task.PNG?token=ABTT2GKOIP42HYHYO5MCF2K5ZL2AW)

5.  The **wd** folder is the working directory of the pool node.

    ![](https://raw.githubusercontent.com/mammask/azure-docs-pr/master/articles/batch/media/run-python-batch-azure-data-factory/batch-jobs-successful-task-wd.PNG?token=ABTT2GJBOIAJ543YJHUMTLS5ZL2CM)

6.  The **stder.txt** file is the logs file associated with the execution of the `Python` script.

    ![](https://raw.githubusercontent.com/mammask/azure-docs-pr/master/articles/batch/media/run-python-batch-azure-data-factory/batch-jobs-successful-task-wd-stderr.PNG?token=ABTT2GOLGEW73PPZJYXXO2S5ZL2DY)

In this example there is not any issue.
