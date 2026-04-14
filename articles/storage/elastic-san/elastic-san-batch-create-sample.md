---
title: Create multiple Azure Elastic SAN volumes in a batch
description: Azure PowerShell Script Sample - Learn how to create multiple Elastic SAN volumes in a batch.
author: roygara
ms.service: azure-elastic-san-storage
ms.topic: sample
ms.date: 01/09/2026
ms.author: rogarana
ms.custom: devx-track-azurepowershell
# Customer intent: "As a cloud architect, I want to create multiple Elastic SAN volumes in a batch using a CSV file, so that I can streamline the volume provisioning process and improve efficiency in managing storage resources."
---

# Create multiple elastic SAN volumes in a batch

The PowerShell script in this article simplifies creating multiple Azure Elastic SAN volumes as a batch. To use the script, make a .csv file with pre-filled values to create as many volumes of varying sizes as you want.

Format your .csv file with five columns: **ResourceGroupName**, **ElasticSanName**, **VolumeGroupName**, **Name**, and **SizeGiB**. The following screenshot provides an example:

:::image type="content" source="media/elastic-san-batch-create-sample/batch-elastic-san.png" alt-text="Screenshot of an example csv file, with example column names and values." lightbox="media/elastic-san-batch-create-sample/batch-elastic-san.png":::

Then, use the following script to create your volumes.

```azurepowershell
$filePath = "D:\ElasticSan\TestCsv3.csv" 
$BatchCreationList = Import-Csv -Path $filePath 

foreach($creationParam in $BatchCreationList) {
    # -AsJob can be added to make the operations parallel 
	  # -ErrorAction can be added to change the behavior of the for loop when an error occurs	 
    New-AzElasticSanVolume -ElasticSanName $creationParam.ElasticSanName -GroupName $creationParam.VolumeGroupName -Name $creationParam.Name -ResourceGroupName $creationParam.ResourceGroupName -SizeGiB $creationParam.SizeGiB #-ErrorAction Continue #-AsJob 

}
```
