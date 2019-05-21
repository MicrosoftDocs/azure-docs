---
title: Transform data by using Databricks in Azure Data Factory | Microsoft Docs
description:  Learn how to use a solution template to transform data by using a Databricks notebook in Azure Data Factory.
services: data-factory
documentationcenter: ''
author: nabhishek
manager: craigg

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.topic: conceptual
ms.date: 12/10/2018
ms.author: abnarain
ms.reviewer: douglasl
---
# Transform data by using Databricks in Azure Data Factory

In this tutorial, you create an end-to-end pipeline containing **Lookup**, **Copy**, and **Databricks notebook** activities in Data Factory.

-   **Lookup** or GetMetadata activity is used to ensure the source dataset is ready for downstream consumption, before triggering the copy and analytics job.

-   **Copy activity** copies the source file/ dataset to the sink storage. The sink storage is mounted as DBFS in the Databricks notebook so that the dataset can be directly consumed by Spark.

-   **Databricks notebook activity** triggers the Databricks notebook that transforms the dataset, and adds it to a processed folder/ SQL DW.

To keep this template simple, the template doesn't create a scheduled trigger. You can add that if necessary.

![1](media/solution-template-Databricks-notebook/Databricks-tutorial-image01.png)

## Prerequisites

1.  Create a **blob storage account** and a container called `sinkdata` to be used as **sink**. Keep a note of the **storage account name**, **container name**, and **access key**, since they are referenced later in the template.

2.  Ensure you have an **Azure Databricks workspace** or create a new one.

1.  **Import the notebook for ETL**. Import the below Transform notebook to the Databricks workspace. (It does not have to be in the same location as below, but remember the path that you choose for later.) Import the notebook from the following URL by entering this URL in the URL field: `https://adflabstaging1.blob.core.windows.net/share/Transformations.html`. Select **Import**.

    ![2](media/solution-template-Databricks-notebook/Databricks-tutorial-image02.png)

    ![3](media/solution-template-Databricks-notebook/Databricks-tutorial-image03.png)  

1.  Now let’s update the **Transformation** notebook with your **storage connection information** (name and access key). Go to **command 5** in the imported notebook above, replace it with the below code snippet after replacing the highlighted values. Ensure this account is the same storage account created earlier and contains the `sinkdata` container.

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

1.  Generate a **Databricks access token** for Data Factory to access Databricks. **Save the access token** for later use in creating a Databricks linked service, which looks something like 'dapi32db32cbb4w6eee18b7d87e45exxxxxx'

    ![4](media/solution-template-Databricks-notebook/Databricks-tutorial-image04.png)

    ![5](media/solution-template-Databricks-notebook/Databricks-tutorial-image05.png)

## Create linked services and datasets

1.  Create new **linked services** in Data Factory UI by going to *Connections Linked services + new*

    1.  **Source** – for accessing source data. You can use the public blob storage containing the source files for this sample.

        Select **Blob Storage**, use the below **SAS URI** to connect to source storage (read-only access).

        `https://storagewithdata.blob.core.windows.net/?sv=2017-11-09&ss=b&srt=sco&sp=rl&se=2019-12-31T21:40:53Z&st=2018-10-24T13:40:53Z&spr=https&sig=K8nRio7c4xMLnUV0wWVAmqr5H4P3JDwBaG9HCevI7kU%3D`

        ![6](media/solution-template-Databricks-notebook/Databricks-tutorial-image06.png)

    1.  **Sink** – for copying data into.

        Select a storage created in the prerequisite 1, in the sink linked service.

        ![7](media/solution-template-Databricks-notebook/Databricks-tutorial-image07.png)

    1.  **Databricks** – for connecting to Databricks cluster

        Create a Databricks linked service using access key generated in prerequisite 2.c. If you have an *interactive cluster*, you may select that. (This example uses the *New job cluster* option.)

        ![8](media/solution-template-Databricks-notebook/Databricks-tutorial-image08.png)

2.  Create **datasets**

    1.  Create **'sourceAvailability_Dataset'** to check if source data is available

    ![9](media/solution-template-Databricks-notebook/Databricks-tutorial-image09.png)

    1.  **Source dataset –** for copying the source data (using binary copy)

    ![10](media/solution-template-Databricks-notebook/Databricks-tutorial-image10.png)

    1.  **Sink dataset** – for copying into the sink/ destination location

        1.  Linked service - select 'sinkBlob_LS' created in 1.b

        2.  File path - 'sinkdata/staged_sink'

        ![11](media/solution-template-Databricks-notebook/Databricks-tutorial-image11.png)

## Create activities

1.  Create a Lookup activity '**Availability flag**' for doing a Source Availability check (Lookup or GetMetadata can be used). Select 'sourceAvailability_Dataset' created in 2.a.

    ![12](media/solution-template-Databricks-notebook/Databricks-tutorial-image12.png)

1.  Create a Copy activity '**file-to-blob**' for copying dataset from source to sink. In this case, the data is binary file. Reference the below screenshots for source and sink configurations in the copy activity.

    ![13](media/solution-template-Databricks-notebook/Databricks-tutorial-image13.png)

    ![14](media/solution-template-Databricks-notebook/Databricks-tutorial-image14.png)

1.  Define **pipeline parameters**

    ![15](media/solution-template-Databricks-notebook/Databricks-tutorial-image15.png)

1.  Create a **Databricks activity**

    Select the linked service created in a previous step.

    ![16](media/solution-template-Databricks-notebook/Databricks-tutorial-image16.png)

    Configure the **settings**. Create **Base Parameters** as shown in the screenshot and create parameters to be passed to the Databricks notebook from Data Factory. Browse and **select** the **correct notebook path** uploaded in **prerequisite 2**.

    ![17](media/solution-template-Databricks-notebook/Databricks-tutorial-image17.png)

1.  **Run the pipeline**. You can find link to Databricks logs for more detailed Spark logs.

    ![18](media/solution-template-Databricks-notebook/Databricks-tutorial-image18.png)

    You can also verify the data file using storage explorer. (For correlating with Data Factory pipeline runs, this example appends the pipeline run ID from data factory to the output folder. This way you can track back the files generated via each run.)

![19](media/solution-template-Databricks-notebook/Databricks-tutorial-image19.png)

## Next steps

- [Introduction to Azure Data Factory](introduction.md)
