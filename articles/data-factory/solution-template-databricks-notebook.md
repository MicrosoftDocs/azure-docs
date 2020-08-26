---
title: Transformation with Azure Databricks
description:  Learn how to use a solution template to transform data by using a Databricks notebook in Azure Data Factory.
services: data-factory
ms.author: abnarain
author: nabhishek
ms.reviewer: douglasl
manager: anandsub
ms.service: data-factory
ms.workload: data-services
ms.topic: conceptual
ms.custom: seo-lt-2019
ms.date: 04/27/2020
---

# Transformation with Azure Databricks

[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

In this tutorial, you create an end-to-end pipeline that contains the **Validation**, **Copy data**, and **Notebook** activities in Azure Data Factory.

- **Validation** ensures that your source dataset is ready for downstream consumption before you trigger the copy and analytics job.

- **Copy data** duplicates the source dataset to the sink storage, which is mounted as DBFS in the Azure Databricks notebook. In this way, the dataset can be directly consumed by Spark.

- **Notebook** triggers the Databricks notebook that transforms the dataset. It also adds the dataset to a processed folder or Azure SQL Data Warehouse.

For simplicity, the template in this tutorial doesn't create a scheduled trigger. You can add one if necessary.

![Diagram of the pipeline](media/solution-template-Databricks-notebook/pipeline-example.png)

## Prerequisites

- An Azure Blob storage account with a container called `sinkdata` for use as a sink.

  Make note of the storage account name, container name, and access key. You'll need these values later in the template.

- An Azure Databricks workspace.

## Import a notebook for Transformation

To import a **Transformation** notebook to your Databricks workspace:

1. Sign in to your Azure Databricks workspace, and then select **Import**.
       ![Menu command for importing a workspace](media/solution-template-Databricks-notebook/import-notebook.png)
   Your workspace path can be different from the one shown, but remember it for later.
1. Select **Import from: URL**. In the text box, enter `https://adflabstaging1.blob.core.windows.net/share/Transformations.html`.

   ![Selections for importing a notebook](media/solution-template-Databricks-notebook/import-from-url.png)

1. Now let's update the **Transformation** notebook with your storage connection information.

   In the imported notebook, go to **command 5** as shown in the following code snippet.

   - Replace `<storage name>`and `<access key>` with your own storage connection information.
   - Use the storage account with the `sinkdata` container.

    ```python
    # Supply storageName and accessKey values  
    storageName = "<storage name>"  
    accessKey = "<access key>"  

    try:  
      dbutils.fs.mount(  
        source = "wasbs://sinkdata\@"+storageName+".blob.core.windows.net/",  
        mount_point = "/mnt/Data Factorydata",  
        extra_configs = {"fs.azure.account.key."+storageName+".blob.core.windows.net": accessKey})  

    except Exception as e:  
      # The error message has a long stack track. This code tries to print just the relevant line indicating what failed.

    import re
    result = re.findall(r"\^\s\*Caused by:\s*\S+:\s\*(.*)\$", e.message, flags=re.MULTILINE)
    if result:
      print result[-1] \# Print only the relevant error message
    else:  
      print e \# Otherwise print the whole stack trace.  
    ```

1. Generate a **Databricks access token** for Data Factory to access Databricks.
   1. In your Databricks workspace, select your user profile icon in the upper right.
   1. Select **User Settings**.
    ![Menu command for user settings](media/solution-template-Databricks-notebook/user-setting.png)
   1. Select **Generate New Token** under the **Access Tokens** tab.
   1. Select **Generate**.

    !["Generate" button](media/solution-template-Databricks-notebook/generate-new-token.png)

   *Save the access token* for later use in creating a Databricks linked service. The access token looks something like `dapi32db32cbb4w6eee18b7d87e45exxxxxx`.

## How to use this template

1. Go to the **Transformation with Azure Databricks** template and create new linked services for following connections.

   ![Connections setting](media/solution-template-Databricks-notebook/connections-preview.png)

    - **Source Blob Connection** - to access the source data.

       For this exercise, you can use the public blob storage that contains the source files. Reference the following screenshot for the configuration. Use the following **SAS URL** to connect to source storage (read-only access):

       `https://storagewithdata.blob.core.windows.net/data?sv=2018-03-28&si=read%20and%20list&sr=c&sig=PuyyS6%2FKdB2JxcZN0kPlmHSBlD8uIKyzhBWmWzznkBw%3D`

        ![Selections for authentication method and SAS URL](media/solution-template-Databricks-notebook/source-blob-connection.png)

    - **Destination Blob Connection** - to store the copied data.

       In the **New linked service** window, select your sink storage blob.

       ![Sink storage blob as a new linked service](media/solution-template-Databricks-notebook/destination-blob-connection.png)

    - **Azure Databricks** - to connect to the Databricks cluster.

        Create a Databricks-linked service by using the access key that you generated previously. You can opt to select an *interactive cluster* if you have one. This example uses the **New job cluster** option.

        ![Selections for connecting to the cluster](media/solution-template-Databricks-notebook/databricks-connection.png)

1. Select **Use this template**. You'll see a pipeline created.

    ![Create a pipeline](media/solution-template-Databricks-notebook/new-pipeline.png)

## Pipeline introduction and configuration

In the new pipeline, most settings are configured automatically with default values. Review the configurations of your pipeline and make any necessary changes.

1. In the **Validation** activity **Availability flag**, verify that the source **Dataset** value is set to `SourceAvailabilityDataset` that you created earlier.

   ![Source dataset value](media/solution-template-Databricks-notebook/validation-settings.png)

1. In the **Copy data** activity **file-to-blob**, check the **Source** and **Sink** tabs. Change settings if necessary.

   - **Source** tab
   ![Source tab](media/solution-template-Databricks-notebook/copy-source-settings.png)

   - **Sink** tab
   ![Sink tab](media/solution-template-Databricks-notebook/copy-sink-settings.png)

1. In the **Notebook** activity **Transformation**, review and update the paths and settings as needed.

   **Databricks linked service** should be pre-populated with the value from a previous step, as shown:
   ![Populated value for the Databricks linked service](media/solution-template-Databricks-notebook/notebook-activity.png)

   To check the **Notebook** settings:
  
    1. Select the **Settings** tab. For **Notebook path**, verify that the default path is correct. You might need to browse and choose the correct notebook path.

       ![Notebook path](media/solution-template-Databricks-notebook/notebook-settings.png)

    1. Expand the **Base Parameters** selector and verify that the parameters match what is shown in the following screenshot. These parameters are passed to the Databricks notebook from Data Factory.

       ![Base parameters](media/solution-template-Databricks-notebook/base-parameters.png)

1. Verify that the **Pipeline Parameters** match what is shown in the following screenshot:
  ![Pipeline parameters](media/solution-template-Databricks-notebook/pipeline-parameters.png)

1. Connect to your datasets.

    >[!NOTE]
    >In below datasets, the file path has been automatically specified in the template. If any changes required, make sure that you specify the path for both **container** and **directory** in case any connection error.

   - **SourceAvailabilityDataset** - to check that the source data is available.

     ![Selections for linked service and file path for SourceAvailabilityDataset](media/solution-template-Databricks-notebook/source-availability-dataset.png)

   - **SourceFilesDataset** - to access the source data.

       ![Selections for linked service and file path for SourceFilesDataset](media/solution-template-Databricks-notebook/source-file-dataset.png)

   - **DestinationFilesDataset** - to copy the data into the sink destination location. Use the following values:

     - **Linked service** - `sinkBlob_LS`, created in a previous step.

     - **File path** - `sinkdata/staged_sink`.

       ![Selections for linked service and file path for DestinationFilesDataset](media/solution-template-Databricks-notebook/destination-dataset.png)

1. Select **Debug** to run the pipeline. You can find the link to Databricks logs for more detailed Spark logs.

    ![Link to Databricks logs from output](media/solution-template-Databricks-notebook/pipeline-run-output.png)

    You can also verify the data file by using Azure Storage Explorer.

    > [!NOTE]
    > For correlating with Data Factory pipeline runs, this example appends the pipeline run ID from the data factory to the output folder. This helps keep track of files generated by each run.
    > ![Appended pipeline run ID](media/solution-template-Databricks-notebook/verify-data-files.png)

## Next steps

- [Introduction to Azure Data Factory](introduction.md)
