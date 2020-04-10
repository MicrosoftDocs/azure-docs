---
title: 'Tutorial - Azure Synapse Analytics: Spark job definition for Synapse'
description: Tutorial - Use the Azure Synapse Analytics to create Spark job definitions, and submit them to a Synapse Spark pool.
author: hrasheed-msft
ms.author: jejiang
ms.reviewer: jasonh
ms.service: hdinsight
ms.custom: hdinsightactive
ms.topic: tutorial
ms.date: 03/16/2020
---

# Tutorial: Use Azure Synapse Analytics to create Apache Spark job definitions for Synapse Spark pools

This tutorial demonstrates how to use the Azure Synapse Analytics to create Spark job definitions, and then submit them to a Synapse Spark pool. You can use the plug-in in a few ways:

* Develop and submit a Spark job definition on a Synapse Spark pool.
* View job details after submission.

In this tutorial, you learn how to:
> [!div class="checklist"]
> * Develop and submit a Spark job definition on a Synapse Spark pool.
> * View job details after submission.

## Prerequisites

* An Azure Synapse Analytics workspace. For instructions, see [Create an Azure Synapse Analytics workspace](https://docs.microsoft.com/azure/machine-learning/how-to-manage-workspace#create-a-workspace).

## Get started

Before submitting a Spark job definition, you need to be the Storage Blob Data Owner of the ADLS Gen2 filesystem you want to work with. If you aren't, you need to add the permission manually. 

### Scenario 1: Add permission

1. Open [Microsoft Azure](https://ms.portal.azure.com), then open Storage account.     

2. Click **Containers**, then create a **File system**. This tutorial uses `sparkjob`.

    ![Click submit button to submit spark job definition](./media/apache-spark-job-definitions/open-azure-container.png)

    ![The Spark Submission dialog box](./media/apache-spark-job-definitions/create-new-filesystem.png)   

3. Open `sparkjob`, click **Access Control(IAM)**, then click **Add** and select **Add role assignment**. 

    ![Click submit button to submit spark job definition](./media/apache-spark-job-definitions/add-role-assignment-01.png)

    ![Click submit button to submit spark job definition](./media/apache-spark-job-definitions/add-role-assignment-02.png)

4. Click **Role assignments**, input user name, then verify user role.

    ![Click submit button to submit spark job definition](./media/apache-spark-job-definitions/verify-user-role.png)


### Scenario 2: Prepare folder structure

Before submitting a Spark job definition, one job you need to do is uploading files to ADLS Gen2 and preparing folder structure there. We use Storage node in Synapse Studio to store files.

1. Open [Azure Synapse Analytics](https://web.azuresynapse.net/).

2. Click **Data**, select **Storage accounts**, and Upload the relevant files to your ADLS Gen2 filesystem. We support Scala, Java, .NET, and Python. This tutorial uses the example in the figure as a demonstration, you can change project structure as you wish.

    ![Set the value of the Spark job definition](./media/apache-spark-job-definitions/prepare-project-structure.png)

## Create a Spark job definition

1. Open [Azure Synapse Analytics](https://web.azuresynapse.net/), and select **Develop**.

2. Select **Spark job definitions** from the left pane.

3. Click **Actions** node on the right of the "Spark job definitions".

     ![Create new spark job definition](./media/apache-spark-job-definitions/create-new-definition-01.png)

4. From the **Actions** drop-down list, select **New Spark job definition**

     ![Create new spark job definition](./media/apache-spark-job-definitions/create-new-definition-02.png)

5. In the New Spark job definition window, select language, then provide the following information:  

   * Select **Language** as **Spark(Scala)**.

    |  Property   | Description   |  
    | ----- | ----- |  
    |Job definition name| Enter a name for your Spark job definition.  This tutorial uses `job definition sample`. This name can be updated at any time until it's published.|  
    |Main definition file| The main file used for the job. Select a JAR file from your storage. You can select **Upload file** to upload the file to a storage account. |
    |Main class name| The fully qualified identifier or the main class that is in the main definition file.|
    |Command-line arguments| Optional arguments to the job.|
    |Reference files| Additional files used for reference in the main definition file. You can select **Upload file** to upload the file to a storage account.|
    |Spark pool| The job will be submitted to the selected Spark pool.| 
    |Spark version| Version of Spark that the Spark pool is running.|
    |Executors| Number of executors to be given in the specified Spark pool for the job.|
    |Executor size| Number of cores and memory to be used for executors given in the specified Spark pool for the job.|  
    |Driver size| Number of cores and memory to be used for driver given in the specified Spark pool for the job.|

    ![Set the value of the Spark job definition](./media/apache-spark-job-definitions/create-scala-definition.png)

   * Select **Language** as **PySpark(Python)**.

    |  Property   | Description   |  
    | ----- | ----- |  
    |Job definition name| Enter a name for your Spark job definition.  This tutorial uses `job definition sample`. This name can be updated at any time until it's published.|  
    |Main definition file| The main file used for the job. Select a PY file from your storage. You can select **Upload file** to upload the file to a storage account.|
    |Command-line arguments| Optional arguments to the job.|
    |Reference files| Additional files used for reference in the main definition file. You can select **Upload file** to upload the file to a storage account.|
    |Spark pool| The job will be submitted to the selected Spark pool.| 
    |Spark version| Version of Spark that the Spark pool is running.|
    |Executors| Number of executors to be given in the specified Spark pool for the job.|
    |Executor size| Number of cores and memory to be used for executors given in the specified Spark pool for the job.|  
    |Driver size| Number of cores and memory to be used for driver given in the specified Spark pool for the job.|

    ![Set the value of the Spark job definition](./media/apache-spark-job-definitions/create-py-definition.png)

   * Select **Language** as **.NET Spark(C#/F#)**.

    |  Property   | Description   |  
    | ----- | ----- |  
    |Job definition name| Enter a name for your Spark job definition.  This tutorial uses `job definition sample`. This name can be updated at any time until it's published.|  
    |Main definition file| The main file used for the job. Select a ZIP file that contains your .NET for Spark application(that is, the main executable file, DLLs containing user-defined functions, and other required files) from your storage. You can select **Upload file** to upload the file to a storage account.|
    |Main executable file| The main executable file in the main definition ZIP file.|
    |Command-line arguments| Optional arguments to the job.|
    |Reference files| Additional files needed by the worker nodes for executing the .NET for Spark application that isn't included in the main definition ZIP file(that is, dependent jars, additional user-defined function DLLs, and other config files). You can select **Upload file** to upload the file to a storage account.|
    |Spark pool| The job will be submitted to the selected Spark pool.| 
    |Spark version| Version of Spark that the Spark pool is running.|
    |Executors| Number of executors to be given in the specified Spark pool for the job.|
    |Executor size| Number of cores and memory to be used for executors given in the specified Spark pool for the job.|  
    |Driver size| Number of cores and memory to be used for driver given in the specified Spark pool for the job.|

    ![Set the value of the Spark job definition](./media/apache-spark-job-definitions/create-net-definition.png)

6. Select **Publish** to save the Spark job definition.

    ![Publish Spark job definition](./media/apache-spark-job-definitions/publish-net-definition.png)

## Submit a Spark job definition

After creating a Spark job definition, you can submit it to a Synapse Spark pool. Make sure you've gone through steps in **Get-started** before trying samples in this part.


### Scenario 1: Submit Spark job definition 

1. Open a spark job definition window by clicking it.

      ![Open spark job definition to submit ](./media/apache-spark-job-definitions/open-spark-definition.png)     

2. Click **submit** icon to submit your project to the selected Spark Pool. You can click **Spark monitoring URL** tab to see the LogQuery of the Spark application.

    ![Click submit button to submit spark job definition](./media/apache-spark-job-definitions/submit-spark-definition.png)

    ![The Spark Submission dialog box](./media/apache-spark-job-definitions/submit-definition-result.png)   

### Scenario 2: View Spark job running progress

1. Click **Monitor**, then select the **Spark applications** option. You can find the submitted Spark application.

    ![View Spark application](./media/apache-spark-job-definitions/view-spark-application.png)

2. Then click the Spark application, **LogQuery** window displays. You can view the job execution progress from **LogQuery**.

    ![View spark application LogQuery](./media/apache-spark-job-definitions/view-job-log-query.png)

### Scenario 3: Check output file

 1. Click **Data**, then select **Storage accounts**. After a successful run, you can go to the ADLS Gen2 storage and check outputs are generated. 

    ![View output file](./media/apache-spark-job-definitions/view-output-file.png)



## Next steps

This tutorial demonstrated how to use the Azure Synapse Analytics to create Spark job definitions, and then submit them to a Synapse Spark pool. Next you can use Azure Synapse Analytics to create Power BI datasets and manage Power BI data. 

- [Connect to data in Power BI Desktop](https://docs.microsoft.com/power-bi/desktop-quickstart-connect-to-data)
- [Visualize with Power BI](../sql-data-warehouse/sql-data-warehouse-get-started-visualize-with-power-bi)