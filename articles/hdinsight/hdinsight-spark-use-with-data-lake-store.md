---
title: Run Spark jobs on data stored in Azure Data Lake Store | Microsoft Docs
description: Run Spark jobs on data stored in Azure Data Lake Store
services: data-lake-store,hdinsight
documentationcenter: ''
author: nitinme
manager: jhubbard
editor: cgronlun

ms.assetid: 1f174323-c17b-428c-903d-04f0e272784c
ms.service: data-lake-store
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 11/16/2016
ms.author: nitinme

---

# Use HDInsight Spark cluster to analyze data in Data Lake Store

In this tutorial, you use Jupyter notebook available with HDInsight Spark clusters to run a job that reads data from a Data Lake Store account that you associated with an HDInsight Spark cluster, instead of the default Azure Storage Blob account.

## Prerequisites

* An Azure subscription. See [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/).

* Azure Data Lake Store account. Follow the instructions at [Get started with Azure Data Lake Store using the Azure Portal](data-lake-store-get-started-portal.md).

* Azure HDInsight cluster with Data Lake Store as storage. Follow the instructions at [Create an HDInsight cluster with Data Lake Store using Azure Portal](../data-lake-store/data-lake-store-hdinsight-hadoop-use-portal.md).

1. Copy over some sample data from the default storage account (WASB) associated with the Spark cluster to the Azure Data Lake store account associated with the cluster. You can use the [ADLCopy tool](http://aka.ms/downloadadlcopy) to do so. Download and install the tool from the link.

2. Open a command prompt and navigate to the directory where AdlCopy is installed, typically `%HOMEPATH%\Documents\adlcopy`.

3. Run the following command to copy a specific blob from the source container to a Data Lake Store:

        AdlCopy /source https://<source_account>.blob.core.windows.net/<source_container>/<blob name> /dest swebhdfs://<dest_adls_account>.azuredatalakestore.net/<dest_folder>/ /sourcekey <storage_account_key_for_storage_container>

    For this tutorial, copy the **HVAC.csv** sample data file at **/HdiSamples/HdiSamples/SensorSampleData/hvac/** to the Azure Data Lake Store account. The code snippet should look like:

        AdlCopy /Source https://mydatastore.blob.core.windows.net/mysparkcluster/HdiSamples/HdiSamples/SensorSampleData/hvac/HVAC.csv /dest swebhdfs://mydatalakestore.azuredatalakestore.net/hvac/ /sourcekey uJUfvD6cEvhfLoBae2yyQf8t9/BpbWZ4XoYj4kAS5Jf40pZaMNf0q6a8yqTxktwVgRED4vPHeh/50iS9atS5LQ==

   > [!WARNING]
   > Make sure you the file and path names are in the proper case.
   >
   >
4. You will be prompted to enter the credentials for the Azure subscription under which you have your Data Lake Store account. You will see an output similar to the following:

        Initializing Copy.
        Copy Started.
        100% data copied.
        Copy Completed. 1 file copied.

    The data file (**HVAC.csv**) will be copied under a folder **/hvac** in the Data Lake Store account.
5. From the [Azure Portal](https://portal.azure.com/), from the startboard, click the tile for your Spark cluster (if you pinned it to the startboard). You can also navigate to your cluster under **Browse All** > **HDInsight Clusters**.
6. From the Spark cluster blade, click **Quick Links**, and then from the **Cluster Dashboard** blade, click **Jupyter Notebook**. If prompted, enter the admin credentials for the cluster.

   > [!NOTE]
   > You may also reach the Jupyter Notebook for your cluster by opening the following URL in your browser. Replace **CLUSTERNAME** with the name of your cluster:
   >
   > `https://CLUSTERNAME.azurehdinsight.net/jupyter`
   >
   >
7. Create a new notebook. Click **New**, and then click **PySpark**.

    ![Create a new Jupyter notebook](./media/data-lake-store-hdinsight-hadoop-use-portal/hdispark.note.jupyter.createnotebook.png "Create a new Jupyter notebook")

8. A new notebook is created and opened with the name **Untitled.pynb**.
9. Because you created a notebook using the PySpark kernel, you do not need to create any contexts explicitly. The Spark and Hive contexts will be automatically created for you when you run the first code cell. You can start by importing the types required for this scenario. To do so, paste the following code snippet in a cell and press **SHIFT + ENTER**.

        from pyspark.sql.types import *

    Every time you run a job in Jupyter, your web browser window title will show a **(Busy)** status along with the notebook title. You will also see a solid circle next to the **PySpark** text in the top-right corner. After the job is completed, this will change to a hollow circle.

     ![Status of a Jupyter notebook job](./media/data-lake-store-hdinsight-hadoop-use-portal/hdispark.jupyter.job.status.png "Status of a Jupyter notebook job")
10. Load sample data into a temporary table using the **HVAC.csv** file you copied to the Data Lake Store account. You can access the data in the Data Lake Store account using the following URL pattern.

         adl://<data_lake_store_name>.azuredatalakestore.net/<path_to_file>

     In an empty cell, paste the following code example, replace **MYDATALAKESTORE** with your Data Lake Store account name, and press **SHIFT + ENTER**. This code example registers the data into a temporary table called **hvac**.

         # Load the data
         hvacText = sc.textFile("adl://MYDATALAKESTORE.azuredatalakestore.net/hvac/HVAC.csv")

         # Create the schema
         hvacSchema = StructType([StructField("date", StringType(), False),StructField("time", StringType(), False),StructField("targettemp", IntegerType(), False),StructField("actualtemp", IntegerType(), False),StructField("buildingID", StringType(), False)])

         # Parse the data in hvacText
         hvac = hvacText.map(lambda s: s.split(",")).filter(lambda s: s[0] != "Date").map(lambda s:(str(s[0]), str(s[1]), int(s[2]), int(s[3]), str(s[6]) ))

         # Create a data frame
         hvacdf = sqlContext.createDataFrame(hvac,hvacSchema)

         # Register the data fram as a table to run queries against
         hvacdf.registerTempTable("hvac")
11. Because you are using a PySpark kernel, you can now directly run a SQL query on the temporary table **hvac** that you just created by using the `%%sql` magic. For more information about the `%%sql` magic, as well as other magics available with the PySpark kernel, see [Kernels available on Jupyter notebooks with Spark HDInsight clusters](../hdinsight/hdinsight-apache-spark-jupyter-notebook-kernels.md#why-should-i-use-the-pyspark-or-spark-kernels).

         %%sql
         SELECT buildingID, (targettemp - actualtemp) AS temp_diff, date FROM hvac WHERE date = \"6/1/13\"
12. Once the job is completed successfully, the following tabular output is displayed by default.

      ![Table output of query result](./media/data-lake-store-hdinsight-hadoop-use-portal/tabular.output.png "Table output of query result")

     You can also see the results in other visualizations as well. For example, an area graph for the same output would look like the following.

     ![Area graph of query result](./media/data-lake-store-hdinsight-hadoop-use-portal/area.output.png "Area graph of query result")
13. After you have finished running the application, you should shutdown the notebook to release the resources. To do so, from the **File** menu on the notebook, click **Close and Halt**. This will shutdown and close the notebook.
