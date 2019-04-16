Tutorial: Run `R` scripts as part of a pipeline through Azure Data Factory using Azure Batch
================
komammas

-   [Introduction](#introduction)
-   [Prerequisites](#prerequisites)
-   [Sign in to Azure](#sign-in-to-azure)
-   [Set up an Azure Storage Account](#set-up-an-azure-storage-account)
-   [Develop a script in `R`](#develop-a-script-in-r)
-   [Set up an Azure Batch account](#set-up-an-azure-batch-account)
-   [Create a pool of compute nodes](#create-a-pool-of-compute-nodes)
-   [Set up Azure Data Factory pipeline](#set-up-azure-data-factory-pipeline)
-   [Monitor the log files](#monitor-the-log-files)

Introduction
------------

Run your R workloads as part of an Azure Data Factory pipeline. The following example runs a script in R that receives inputs (iris.csv) from an Azure Blob Storage account, performs a data manipulation process and returns the outputs back to the Azure Blob Storage account. In this tutorial you will also learn how to schedule your R workloads, monitor your analytics pipeline and access your logfiles.

Prerequisites
-------------

-   An installed [R](https://www.r-project.org/) distribution, such as [Microsoft R](https://mran.microsoft.com/open) Open. Use R version 3.3.1 or later.
-   [RStudio](https://www.rstudio.com/), either the commercial edition or the open-source RStudio Desktop.
-   An Azure Batch account, an Azure Storage account and an Azure Data Factory account. To create these accounts, see the Batch quickstarts using the [Azure portal](https://github.com/MicrosoftDocs/azure-docs/blob/master/articles/batch/quick-create-portal.md) or [Azure CLI](https://github.com/MicrosoftDocs/azure-docs/blob/master/articles/batch/quick-create-cli.md).

Sign in to Azure
----------------

Sign in to the Azure portal at <https://portal.azure.com>.

Set up an Azure Storage Account
-------------------------------

Set up your Azure Storage account using the [Azure portal](https://docs.microsoft.com/en-us/azure/storage/common/storage-quickstart-create-account?tabs=azure-portal). In the following example, you will access your access your **Azure Blob Storage** container and will upload the **iris.csv** file.

1.  Select **Overview** &gt; **Blobs**

    ![](https://github.com/mammask/tutorial-run-r-batch-azure-data-factory/blob/master/samples/setup-azure-blob-storage.png?raw=true)

2.  Select your storage container (e.g. **mystorage**)

    ![](https://github.com/mammask/tutorial-run-r-batch-azure-data-factory/blob/master/samples/select-blob-storage-container.png?raw=true)

3.  **Upload** &gt; **Files** &gt; iris.csv &gt; **Upload to folder** &gt; inputs. A new folder will be created even if it does not exist.

    ![](https://github.com/mammask/tutorial-run-r-batch-azure-data-factory/blob/master/samples/upload-to-blob-storage-container.png?raw=true)

When the dataset is uploaded the status of the current uploads will be updated to completed.

Develop a script in `R`
-----------------------

The following script in `R` loads a dataset from **Azure Blob Storage** &gt; mystorage, it performs a data manipulation process and saves the results back to the Azure Blob Storage container in a different folder.

``` r
# Install the rAzureBatch library
install.packages("rAzureBatch")

# Load libraries
library(rAzureBatch)

# Define parameters of the Blob Storage Account
storageName   <- "<storage account name>"
storageKey    <- "<storage account key>"
containerName <- "<storage account container name>"

# Submit the shared key credentials
storageCredentials <- rAzureBatch::SharedKeyCredentials[["new"]](
  name = storageName,
  key  = storageKey
)

# Define storage client
storageClient <- rAzureBatch::StorageServiceClient[["new"]](
                                                            authentication = storageCredentials,
                                                            url            = sprintf("https://%s.blob.%s",
                                                                             storageName,
                                                                             "core.windows.net"
  )
)

# Generate read SaS token
readSasToken <- storageClient[["generateSasToken"]](permission = "r", "c", path = containerName)

# Get the blob url for the iris dataset
blobUrl <- rAzureBatch::createBlobUrl(storageAccount = storageName,
                                      containerName  = containerName,
                                      sasToken       = readSasToken,
                                      fileName       = "inputs/iris.csv")


# Read file using the blob url
irisDataset <- read.csv(blobUrl)

# Subset dataset where species equal to setosa
setosaSpecies <- irisDataset[irisDataset$Species == "setosa",]

# Create a local temporary folder and save the result of the analysis
dir.create("outputs")
write.csv(setosaSpecies, "outputs/setosaSpecies.csv", row.names = F)

# Generate write sas token
writeSasToken <- storageClient$generateSasToken(permission = "w", "c", path = containerName)

# Upload dataset to the blob storage container
storageClient$blobOperations$uploadBlob(
                                        sasToken      = writeSasToken,
                                        containerName = paste0(containerName,"/outputs"),
                                        fileDirectory = "outputs/setosaSpecies.csv",
                                        accountName   = storageName
                                        )

# Remove temporary file
file.remove("outputs/setosaSpecies.csv")
```

Save the script as *runExample.R* and upload it to the **Azure Storage** container.

![](https://github.com/mammask/tutorial-run-r-batch-azure-data-factory/blob/master/samples/upload-r-script-to-blob-storage-container.PNG?raw=true)

Run the scritp locally using either command prompt or terminal depending on your operating system.

``` bash
Rscript runExample.R
```

Access the **Azure portal** and check that the dataset is now saved in the outputs folder of the **Azure Storage ** container.

![](https://github.com/mammask/tutorial-run-r-batch-azure-data-factory/blob/master/samples/check-uploaded-csv-to-blob-storage.PNG?raw=true)

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

Now that the Batch account is set up and is associated with the Blob storage account, create a set of pool nodes to run the `R` script.

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

In this procedure, you create and validate a pipeline using a script in `R` to load a .csv dataset from a **Blob Storage** container, perform a data manipulation process and output the results of the analysis to a different folder in the **Blob Storage** container. For more information about how to create pipelines using **Data Factory** you can follow the official [documentation](https://docs.microsoft.com/en-us/azure/data-factory/concepts-pipelines-activities).

1.  In the **Factory Resources** box, select the + (plus) button and then select **Pipeline**

2.  In the **General** tab specify **run R** for Name

    ![](https://github.com/mammask/tutorial-run-r-batch-azure-data-factory/blob/master/samples/create-data-factory-pipeline-rscript.png?raw=true)

3.  In the **Activities** box, expand the **Batch Service**. Drag the **Custom** activity from the **Activities** toolbox to the pipeline designer surface.

4.  In the **General** tab specify **testPipeline** for Name

    ![](https://github.com/mammask/tutorial-run-r-batch-azure-data-factory/blob/master/samples/name-data-factory-pipeline-rscript.png?raw=true)

5.  In the **Azure Batch** tab, add the **Batch Account** that was created in the previous steps and **Test connection** to ensure that it is successful.

    ![](https://github.com/mammask/tutorial-run-r-batch-azure-data-factory/blob/master/samples/integrate-pipeline-with-azure-batch.PNG?raw=true)

6.  In the **Settings** tab, enter the command `Rscript runExample.R`

7.  Add the **Batch Account** that was created in the previous steps in the **Resource Linked Service** and **Test connection** to ensure that it is successful

8.  In the **Folder Path**, select the name of the **Azure Blob Storage** container that contains the `R` script and the associated inputs. This will download the selected files from the container to the pool node instances before the execution of the `R` script.

    ![](https://github.com/mammask/tutorial-run-r-batch-azure-data-factory/blob/master/samples/set-batch-rscript-command.PNG?raw=true)

9.  Click **Validate** on the pipeline toolbar above the canvas to validate the pipeline settings. Confirm that the pipeline has been successfully validated. To close the validation output, select the &gt;&gt; (right arrow) button

10. Click **debug** to debug the pipeline

11. Click **publish** to publish the pipeline

12. Click **trigger** to run the `R` script as part of a batch process

    ![](https://github.com/mammask/tutorial-run-r-batch-azure-data-factory/blob/master/samples/debug-publish-trigger-pipeline.png?raw=true)

You can debug, trigger, monitor the pipeline manually and schedule periodical executions of the script. For more information visit the Azure official [documentation](https://docs.microsoft.com/en-us/azure/batch/batch-account-create-portal).

Monitor the log files
---------------------

Access the log files of the batch process to view bugs/ warnings produced by the execution of the `R` script on the pool nodes. If the Azure Batch Custom Activity returns an error then you can access the working directory of the pool node.

1.  Access your **Azure Batch** account

2.  Select **Jobs**

    ![](https://github.com/mammask/tutorial-run-r-batch-azure-data-factory/blob/master/samples/access-batch-jobs-log.PNG?raw=true)

3.  Select the pool id that is associated with the tasks that ran on **Azure Data Factory**

    ![](https://github.com/mammask/tutorial-run-r-batch-azure-data-factory/blob/master/samples/access-batch-jobs-pool-id-log.png?raw=true)

4.  Select the latest task

    ![](https://github.com/mammask/tutorial-run-r-batch-azure-data-factory/blob/master/samples/access-batch-jobs-pool-latest-task-log.PNG?raw=true)

5.  The **wd** folder is the working directory of the pool node.

    ![](https://github.com/mammask/tutorial-run-r-batch-azure-data-factory/blob/master/samples/access-batch-jobs-pool-latest-task-wd-log.PNG?raw=true)

6.  The **stder.txt** file is the logs file associated with the execution of the `R` script.

    ![](https://github.com/mammask/tutorial-run-r-batch-azure-data-factory/blob/master/samples/access-batch-jobs-pool-latest-task-wd-r-log.PNG?raw=true)

In this example there is a warning indicating that you need to define the timezone as an environmental variable. This can be easily configured by adding `Sys.setenv(TZ='GMT')` in the beginning of the `R` script.
