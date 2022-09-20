---
title: Create multiple Azure Elastic SAN volumes
description: Azure PowerShell Script Sample - Create multiple elastic SAN volumes.
author: roygara
ms.service: storage
ms.topic: sample
ms.date: 10/12/2022
ms.author: rogarana
ms.subservice: elastic-san
---

# Create multiple elastic SAN volumes

This script creates a set number of volumes in your elastic storage area network (SAN). Use this script to create a large amount of volumes that are the same size without having to create each individual volume. The size of a volume can be increased after it's created but can't be decreased, to prevent data loss.

```azurepowershell
$volumeCount = 5

$resourceGroupName = "yourResourceGroup"

$sanName = "yourSanName"

$volumeGroupName = "yourVGroupName"

$volumes = @()

for($x=1; $x -lt $volumeCount+1; $x=$x+1){  

  $volumes += @{       

    ResourceGroupName=$resourceGroupName      

    Name="testvol$x"       

    ElasticSanName=$sanName      

    VolumeGroupName=$volumeGroupName       

    SizeGib=100   

  }

}

$volumes | ForEach-Object { New-AzElasticSanVolume -ResourceGroupName $_.ResourceGroupName -ElasticSanName $_.ElasticSanName -VolumeGroupName $_.VolumeGroupName -Name $_.Name -SizeGib $_.SizeGib -AsJob }
```