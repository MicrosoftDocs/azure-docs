---
title: Create more than one elastic SAN volume
description: Azure PowerShell Script Sample - Create more than one elastic SAN volume
author: roygara
ms.service: storage
ms.topic: sample
ms.date: 08/01/2022
ms.author: rogarana
ms.subservice: elastic-san
---

```azurepowershell
$volumeCount = 5

$resourceGroupName = "sandemo"

$sanName = "esan"

$volumeGroupName = "demovg"

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