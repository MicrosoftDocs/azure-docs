---
title: Create multiple Azure Elastic SAN volumes in a batch
description: Azure PowerShell Script Sample - Learn how to create multiple Elastic SAN volumes in a batch.
author: roygara
ms.service: azure-elastic-san-storage
ms.topic: sample
ms.date: 05/31/2024
ms.author: rogarana
ms.custom: devx-track-azurepowershell
# Customer intent: "As a cloud architect, I want to create multiple Elastic SAN volumes in a batch using a CSV file, so that I can streamline the volume provisioning process and improve efficiency in managing storage resources."
---

# Create multiple elastic SAN volumes in a batch

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
