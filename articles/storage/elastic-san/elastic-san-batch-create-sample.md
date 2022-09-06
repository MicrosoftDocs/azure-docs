

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