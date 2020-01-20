---
title: ETL with Azure Databricks
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
ms.date: 12/10/2018
---

# ETL with Azure Databricks

In this tutorial, you create an end-to-end pipeline containing **Validation**, **Copy**, and **Notebook** activities in Data Factory.

-   **Validation** activity is used to ensure the source dataset is ready for downstream consumption, before triggering the copy and analytics job.

-   **Copy** activity copies the source file/ dataset to the sink storage. The sink storage is mounted as DBFS in the Databricks notebook so that the dataset can be directly consumed by Spark.

-   **Databricks Notebook** activity triggers the Databricks notebook that transforms the dataset, and adds it to a processed folder/ SQL DW.

To keep this template simple, the template doesn't create a scheduled trigger. You can add that if necessary.

![1](media/solution-template-Databricks-notebook/Databricks-tutorial-image01.png)

## Prerequisites

1. Create a **blob storage account** and a container called `sinkdata` to be used as **sink**. Keep a note of the **storage account name**, **container name**, and **access key**, since they are referenced later in the template.

2. Ensure you have an **Azure Databricks workspace** or create a new one.

3. **Import the notebook for ETL**. 
    1. In your Azure Databricks, reference following screenshots for importing a **Transformation** notebook to the Databricks workspace. It does not have to be in the same location as below, but remember the path that you choose for later.
   
       ![2](media/solution-template-Databricks-notebook/Databricks-tutorial-image02.png)    
    
    1. Select "Import from: **URL**", and enter following URL in the textbox:
    
       * `https://adflabstaging1.blob.core.windows.net/share/Transformations.html`
        
       ![3](media/solution-template-Databricks-notebook/Databricks-tutorial-image03.png)    

4. Now let’s update the **Transformation** notebook with your storage connection information. Go to **command 5** (as shown in below code snippet) in the imported notebook above, and replace `<storage name>`and `<access key>` with your own storage connection information. Ensure this account is the same storage account created earlier and contains the `sinkdata` container.

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

5.  Generate a **Databricks access token** for Data Factory to access Databricks. **Save the access token** for later use in creating a Databricks linked service, which looks something like 'dapi32db32cbb4w6eee18b7d87e45exxxxxx'

    ![4](media/solution-template-Databricks-notebook/Databricks-tutorial-image04.png)

    ![5](media/solution-template-Databricks-notebook/Databricks-tutorial-image05.png)

## How to use this template

1.  Go to **ETL with Azure Databricks** template. Create new linked services for following connections. 
    
    ![Connections setting](media/solution-template-Databricks-notebook/connections-preview.png)

    1.  **Source Blob Connection** – for accessing source data. 
        
        You can use the public blob storage containing the source files for this sample. Reference following screenshot for configuration. Use below **SAS URL** to connect to source storage (read-only access): 
        * `https://storagewithdata.blob.core.windows.net/data?sv=2018-03-28&si=read%20and%20list&sr=c&sig=PuyyS6%2FKdB2JxcZN0kPlmHSBlD8uIKyzhBWmWzznkBw%3D`

        ![6](media/solution-template-Databricks-notebook/Databricks-tutorial-image06.png)

    1.  **Destination Blob Connection** – for copying data into. 
        
        In the sink linked service, select a storage created in the **Prerequisite** 1.

        ![7](media/solution-template-Databricks-notebook/Databricks-tutorial-image07.png)

    1.  **Azure Databricks** – for connecting to Databricks cluster.

        Create a Databricks linked service using access key generated in **Prerequisite** 2.c. If you have an *interactive cluster*, you may select that. (This example uses the *New job cluster* option.)

        ![8](media/solution-template-Databricks-notebook/Databricks-tutorial-image08.png)

1. Select **Use this template**, and you would see a pipeline created as shown below:
    
    ![Create a pipeline](media/solution-template-Databricks-notebook/new-pipeline.png)   

## Pipeline introduction and configuration

In the new pipeline created, most settings have been configured automatically with default values. Check out the configurations and update where necessary to suit your own settings. For details, you can check below instructions and screenshots for reference.

1.  A Validation activity **Availability flag** is created for doing a Source Availability check. *SourceAvailabilityDataset* created in previous step is selected as Dataset.

    ![12](media/solution-template-Databricks-notebook/Databricks-tutorial-image12.png)

1.  A Copy activity **file-to-blob** is created for copying dataset from source to sink. Reference the below screenshots for source and sink configurations in the copy activity.

    ![13](media/solution-template-Databricks-notebook/Databricks-tutorial-image13.png)

    ![14](media/solution-template-Databricks-notebook/Databricks-tutorial-image14.png)

1.  A Notebook activity **ETL** is created, and the linked service created in previous step is selected.

    ![16](media/solution-template-Databricks-notebook/Databricks-tutorial-image16.png)

     1. Select **Settings** tab. For *Notebook path*, the template defines a path by default. You may need to browse and select the correct notebook path uploaded in **Prerequisite** 2. 

         ![17](media/solution-template-Databricks-notebook/databricks-tutorial-image17.png)
    
     1. Check out the *Base Parameters* created as shown in the screenshot. They are to be passed to the Databricks notebook from Data Factory. 

         ![Base parameters](media/solution-template-Databricks-notebook/base-parameters.png)

1.  **Pipeline Parameters** is defined as below.

    ![15](media/solution-template-Databricks-notebook/Databricks-tutorial-image15.png)

1. Setting up datasets.
    1.  **SourceAvailabilityDataset** is created to check if source data is available.

        ![9](media/solution-template-Databricks-notebook/Databricks-tutorial-image09.png)

    1.  **SourceFilesDataset** - for copying the source data.

        ![10](media/solution-template-Databricks-notebook/Databricks-tutorial-image10.png)

    1.  **DestinationFilesDataset** – for copying into the sink/destination location.

        1.  Linked service - *sinkBlob_LS* created in previous step.

        2.  File path - *sinkdata/staged_sink*.

            ![11](media/solution-template-Databricks-notebook/Databricks-tutorial-image11.png)


1.  Select **Debug** to run the pipeline. You can find link to Databricks logs for more detailed Spark logs.

    ![18](media/solution-template-Databricks-notebook/Databricks-tutorial-image18.png)

    You can also verify the data file using storage explorer. (For correlating with Data Factory pipeline runs, this example appends the pipeline run ID from data factory to the output folder. This way you can track back the files generated via each run.)

    ![19](media/solution-template-Databricks-notebook/Databricks-tutorial-image19.png)

## Next steps

- [Introduction to Azure Data Factory](introduction.md)
