---
title: "PowerShell script- transform data in cloud using Data Factory | Microsoft Docs"
description: "This PowerShell script transforms data in the cloud by running Spark program on an Azure HDInsight Spark cluster." 
services: data-factory
author: sharonlo101
manager: craigg
editor: ''

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na

ms.topic: article
ms.date: 09/12/2017
ms.author: shlo
---

# PowerShell script - transform data in cloud using Azure Data Factory

This sample PowerShell script creates a pipeline that transforms data in the cloud by running Spark program on an Azure HDInsight Spark cluster. 

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

[!INCLUDE [sample-powershell-install](../../../includes/sample-powershell-install-no-ssh-az.md)]

## Prerequisites
* **Azure Storage account**. Create a python script and an input file, and upload them to the Azure storage. The output from the spark program is stored in this storage account. The on-demand Spark cluster uses the same storage account as its primary storage.  

### Upload python script to your Blob Storage account
1. Create a python file named **WordCount_Spark.py** with the following content: 

    ```python
    import sys
    from operator import add
    
    from pyspark.sql import SparkSession
    
    def main():
        spark = SparkSession\
            .builder\
            .appName("PythonWordCount")\
            .getOrCreate()
    		
        lines = spark.read.text("wasbs://adftutorial@<storageaccountname>.blob.core.windows.net/spark/inputfiles/minecraftstory.txt").rdd.map(lambda r: r[0])
        counts = lines.flatMap(lambda x: x.split(' ')) \
            .map(lambda x: (x, 1)) \
            .reduceByKey(add)
        counts.saveAsTextFile("wasbs://adftutorial@<storageaccountname>.blob.core.windows.net/spark/outputfiles/wordcount")
        
        spark.stop()
    
    if __name__ == "__main__":
    	main()
    ```
2. Replace **&lt;storageAccountName&gt;** with the name of your Azure Storage account. Then, save the file. 
3. In your Azure Blob Storage, create a container named **adftutorial** if it does not exist. 
4. Create a folder named **spark**.
5. Create a subfolder named **script** under **spark** folder. 
6. Upload the **WordCount_Spark.py** file to the **script** subfolder. 


### Upload the input file
1. Create a file named **minecraftstory.txt** with some text. The spark program counts the number of words in this text. 
2. Create a subfolder named `inputfiles` in the `spark` folder of the blob container. 
3. Upload the `minecraftstory.txt` to the `inputfiles` subfolder. 

## Sample script
> [!IMPORTANT]
> This script creates JSON files that define Data Factory entities (linked service, dataset, and pipeline) on your hard drive in the c:\ folder.

[!code-powershell[main](../../../powershell_scripts/data-factory/transform-data-using-spark/transform-data-using-spark.ps1 "Transform data using Spark")]

## Clean up deployment

After you run the sample script, you can use the following command to remove the resource group and all resources associated with it:

```powershell
Remove-AzResourceGroup -ResourceGroupName $resourceGroupName
```
To remove the data factory from the resource group, run the following command: 

```powershell
Remove-AzDataFactoryV2 -Name $dataFactoryName -ResourceGroupName $resourceGroupName
```

## Script explanation

This script uses the following commands:

| Command | Notes |
|---|---|
| [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) | Creates a resource group in which all resources are stored. |
| [Set-AzDataFactoryV2](/powershell/module/az.datafactory/set-Azdatafactoryv2) | Create a data factory. |
| [Set-AzDataFactoryV2LinkedService](/powershell/module/az.datafactory/set-Azdatafactoryv2linkedservice) | Creates a linked service in the data factory. A linked service links a data store or compute to a data factory. |
| [Set-AzDataFactoryV2Pipeline](/powershell/module/az.datafactory/set-Azdatafactoryv2pipeline) | Creates a pipeline in the data factory. A pipeline contains one or more activities that performs a certain operation. In this pipeline, a spark activity transforms data by running a program on an Azure HDInsight Spark cluster. |
| [Invoke-AzDataFactoryV2Pipeline](/powershell/module/az.datafactory/invoke-Azdatafactoryv2pipeline) | Creates a run for the pipeline. In other words, runs the pipeline. |
| [Get-AzDataFactoryV2ActivityRun](/powershell/module/az.datafactory/get-Azdatafactoryv2activityrun) | Gets details about the run of the activity (activity run) in the pipeline. 
| [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) | Deletes a resource group including all nested resources. |
|||

## Next steps

For more information on the Azure PowerShell, see [Azure PowerShell documentation](https://docs.microsoft.com/powershell/).

Additional Azure Data Factory PowerShell script samples can be found in the [Azure Data Factory PowerShell samples](../samples-powershell.md).
