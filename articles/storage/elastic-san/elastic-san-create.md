---
title: Create an Azure Elastic SAN
description: Learn how to deploy an Azure Elastic SAN with the Azure portal or the Azure PowerShell module.
author: roygara
ms.service: storage
ms.topic: overview
ms.date: 08/05/2022
ms.author: rogarana
ms.subservice: elastic-san
---

# Deploy an Elastic SAN

This article explains how to deploy and configure an Elastic SAN.

## Create the SAN


# [Portal](#tab/azure-portal)

1. Sign in to the Azure portal and search for **Elastic SAN**.
1. Select **+ Create a new SAN**
1. On the basics blade, fill out the values.
1. Specify the amount of base capacity you require, as well as any additional capacity, then select next.

    Increasing your SAN's base size will also increase its IOPS and bandwidth. Increasing additional capacity only increase its total size (base+additional) but won't increase IOPS or bandwidth, however, it's cheaper than increasing base.

# [PowerShell](#tab/azure-powershell)

```azurepowershell
## Variables
$rgName = "yourResourceGroupName"
## Select the same availability zone as your other azure resources
$zone = 1
$region = "yourRegion"
$sanName = "desiredSANName"
$volGroupName = "desiredVolumeGroupName"

## Create the SAN, itself
New-AzElasticSAN -ResourceGroupName $rgName -Name $sanName -AvailabilityZone $zone -Location $region -BaseSizeTb 50 -ExtendedSizeTb 1 -SkuName Premium_LRS
```
---


## Create volume groups

Now that you've configured the basic settings and provisioned your storage, you can create volume groups. Volume groups are a tool for managing volumes at scale. Any settings or configurations applied to a volume group apply to all volumes associated with that volume group.

# [Portal](#tab/azure-portal)


1. Create your volume group.


# [PowerShell](#tab/azure-powershell)


```azurepowershell
## Create the volume group, this script only creates one.
New-AzElasticSanVolumeGroup -ResourceGroupName $rgName -ElasticSANName $sanName -Name $volGroupName
```

---

## Create volumes

Now that you've configured the SAN itself, and created at least one volume group, you can create volumes.

Volumes are essentially usable partitions of the SAN's total capacity, you must provision this total capacity as a volume in order to access it. Only the actual volumes themselves can be mounted and used, not the volume group.

# [Portal](#tab/azure-portal)

1. Partition the SAN's total capacity into individual volumes.
1. Select **Review + create** and deploy your SAN.

# [PowerShell](#tab/azure-powershell)

```azurepowershell
## Create the volume, this script only creates one.
New-AzElasticSanVolume -ResourceGroupName $rgName -ElasticSanName $sanName -GroupName $volGroupName -Name "volumeName" -sizeGiB 50
```

---


## Configure networking

Now that your SAN has been deployed, add a virtual network to your volume group. Adding a virtual network to your volume group allows you to establish connections from any client in the same virtual network and subnet to the volumes in the volume group.

# [Portal](#tab/azure-portal)

1. Navigate to your SAN and select **Volume groups**
1. Select a volume group and select **Modify**
1. Add an existing virtual network and select **Save**.

# [PowerShell](#tab/azure-powershell)

```azurepowershell
$rule1 = New-AzElasticSanVirtualNetworkRuleObject -VirtualNetworkResourceId <resourceIDHere> -Action Allow

Update-AzElasticSanVolumeGroup -ResourceGroupName $rgName -ElasticSanName $sanName -Name $volGroupName -NetworkAclsVirtualNetworkRule $rule1

```

---

You've now deployed and configured an elastic SAN.

# Next steps

Connect an Elastic SAN volume to a client.