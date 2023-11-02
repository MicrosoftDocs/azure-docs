---
title: 'Quickstart: Read data from ADLS Gen2 to Pandas dataframe'
description: Read data from an Azure Data Lake Storage Gen2 account into a Pandas dataframe using Python in Synapse Studio in Azure Synapse Analytics.
ms.service: synapse-analytics
ms.subservice: machine-learning
ms.topic: quickstart
ms.reviewer: sngun, garye, negust
ms.date: 07/11/2022
author: WilliamDAssafMSFT
ms.author: wiassaf
ms.custom: mode-other, devx-track-python
---

# Quickstart: Read data from ADLS Gen2 to Pandas dataframe in Azure Synapse Analytics

In this quickstart, you'll learn how to easily use Python to read data from an Azure Data Lake Storage (ADLS) Gen2 into a Pandas dataframe in Azure Synapse Analytics.

From a Synapse Studio notebook, you'll:

- Connect to a container in Azure Data Lake Storage (ADLS) Gen2 that is linked to your Azure Synapse Analytics workspace.
- Read the data from a PySpark Notebook using `spark.read.load`.
- Convert the data to a Pandas dataframe using `.toPandas()`.

## Prerequisites

- You'll need an Azure subscription. If needed, [create a free Azure account](https://azure.microsoft.com/free/).
- Synapse Analytics workspace with ADLS Gen2 configured as the default storage - You need to be the **Storage Blob Data Contributor** of the ADLS Gen2 filesystem that you work with. For details on how to create a workspace, see [Creating a Synapse workspace](get-started-create-workspace.md).
- Apache Spark pool in your workspace - See [Create a serverless Apache Spark pool](get-started-analyze-spark.md#create-a-serverless-apache-spark-pool).

## Sign in to the Azure portal

Sign in to the [Azure portal](https://portal.azure.com/).

## Upload sample data to ADLS Gen2

1. In the Azure portal, create a container in the same ADLS Gen2 used by Synapse Studio. You can skip this step if you want to use the default linked storage account in your Azure Synapse Analytics workspace.

1. In Synapse Studio, select **Data**, select the **Linked** tab, and select the container under **Azure Data Lake Storage Gen2**.

1. Download the sample file [RetailSales.csv](https://github.com/Azure-Samples/Synapse/blob/main/Notebooks/PySpark/Synapse%20Link%20for%20Cosmos%20DB%20samples/Retail/RetailData/RetailSales.csv) and upload it to the container.

1. Select the uploaded file, select **Properties**, and copy the **ABFSS Path** value.

## Read data from ADLS Gen2 into a Pandas dataframe

1. In the left pane, select **Develop**.

1. Select **+** and select "Notebook" to create a new notebook.

1. In **Attach to**, select your Apache Spark Pool. If you don't have one, select **Create Apache Spark pool**.

1. In the notebook code cell, paste the following Python code, inserting the ABFSS path you copied earlier:

   ```python
   %%pyspark
   data_path = spark.read.load('<ABFSS Path to RetailSales.csv>', format='csv', header=True)
   data_path.show(10)
   
   print('Converting to Pandas.')
   
   pdf = data_path.toPandas()
   print(pdf)
   ```

1. Run the cell.

After a few minutes, the text displayed should look similar to the following.

```text
Command executed in 25s 324ms by gary on 03-23-2021 17:40:23.481 -07:00

Job execution Succeeded Spark 2 executors 8 cores

+-------+-----------+--------+-----------+-----------+-----+------------+--------------------+
|storeId|productCode|quantity|logQuantity|advertising|price|weekStarting|                  id|
+-------+-----------+--------+-----------+-----------+-----+------------+--------------------+
|      2| surface.go|     105|9.264828557|          1|  159|   6/15/2017|d6bd47a7-2ad6-4f0...|
|      2| surface.go|      80|8.987196821|          0|  269|   7/27/2017|64cc74c2-c7da-4e1...|
|      2| surface.go|      68|8.831711918|          1|  209|    8/3/2017|9a2d164b-5e44-44d...|
|      2| surface.go|      28|7.965545573|          0|  209|   8/10/2017|b8cd9987-1d5a-4f4...|
|      2| surface.go|      16|7.377758908|          0|  209|   8/24/2017|ac0ec099-e102-4bf...|
|      2| surface.go|     253| 10.1402973|          1|  189|   8/31/2017|3d22c002-b04c-409...|
|      2| surface.go|     107|9.282847063|          0|  189|    9/7/2017|b6e19699-d684-449...|
|      2| surface.go|      66|8.803273983|          0|  189|   9/14/2017|e89a5838-fb8f-413...|
|      2| surface.go|      65|8.793612072|          0|  179|   9/21/2017|c3278682-16c0-483...|
|      2| surface.go|      17|7.454719949|          0|  269|  10/12/2017|f40190c1-b2ed-46f...|
+-------+-----------+--------+-----------+-----------+-----+------------+--------------------+
only showing top 10 rows

Converting to Pandas.
      storeId  ...                                    id
0           2  ...  d6bd47a7-2ad6-4f0a-b8de-ed1386cae5ea
1           2  ...  64cc74c2-c7da-4e12-af64-c95bdf429934
2           2  ...  9a2d164b-5e44-44d7-9837-cf9ae6566c99
3           2  ...  b8cd9987-1d5a-4f4f-9346-719d73b1f7f0
4           2  ...  ac0ec099-e102-4bfc-9775-983b151dcd03
...       ...  ...                                   ...
28942     137  ...  6af00133-7015-415d-831b-ddf05bb5828c
28943     137  ...  1e0d3a21-ab43-49c4-89e2-49d202821807
28944     137  ...  5cc7e50a-6aa4-419b-a933-905a667aa2df
28945     137  ...  650ca506-7a4f-46f8-b2e1-e52ceffadf16
28946     137  ...  9bb216f6-04ec-4b61-9e68-34772b814c44

[28947 rows x 8 columns]
```

## Next steps

- [What is Azure Synapse Analytics?](overview-what-is.md)
- [Get Started with Azure Synapse Analytics](get-started.md)
- [Create a serverless Apache Spark pool](get-started-analyze-spark.md#create-a-serverless-apache-spark-pool)
- [How to use file mount/unmount API in Synapse](spark/synapse-file-mount-api.md)
- [Azure Architecture Center: Explore data in Azure Blob storage with the pandas Python package](/azure/architecture/data-science-process/explore-data-blob)
- [Tutorial: Use Pandas to read/write Azure Data Lake Storage Gen2 data in serverless Apache Spark pool in Synapse Analytics](spark/tutorial-use-pandas-spark-pool.md)
