---
title: Create multiple Azure Elastic SAN Preview volumes in a batch
description: Azure PowerShell Script Sample - Create multiple elastic SAN Preview volumes in a batch.
author: roygara
ms.service: storage
ms.topic: sample
ms.date: 10/12/2022
ms.author: rogarana
ms.subservice: elastic-san
ms.custom: ignite-2022, devx-track-azurepowershell
---

# Create multiple elastic SAN Preview volumes in a batch

To simplify creating multiple volumes as a batch, you can use a .csv with pre-filled values to create as many volumes of varying sizes as you like.

Format your .csv with five columns, **ResourceGroupName**, **ElasticSanName**, **VolumeGroupName**, **Name**, and **SizeGiB**. The following screenshot provides an example:

:::image type="content" source="media/elastic-san-batch-create-sample/batch-elastic-san.png" alt-text="Screenshot of an example csv file, with example column names and values." lightbox="media/elastic-san-batch-create-sample/batch-elastic-san.png":::

Then you can use the following script to create your volumes.

```azurepowershell
$filePath = "D:\ElasticSan\TestCsv3.csv" 
$BatchCreationList = Import-Csv -Path $filePath 

foreach($creationParam in $BatchCreationList) {
    # -AsJob can be added to make the operations parallel 
	  # -ErrorAction can be added to change the behavior of the for loop when an error occurs	 
    New-AzElasticSanVolume -ElasticSanName $creationParam.ElasticSanName -GroupName $creationParam.VolumeGroupName -Name $creationParam.Name -ResourceGroupName $creationParam.ResourceGroupName -SizeGiB $creationParam.SizeGiB #-ErrorAction Continue #-AsJob 

}
```
