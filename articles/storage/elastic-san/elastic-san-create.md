---
title: Create an Azure Elastic SAN
description: Learn how to deploy an Azure Elastic SAN with the Azure portal or the Azure PowerShell module.
author: roygara
ms.service: storage
ms.topic: overview
ms.date: 08/31/2022
ms.author: rogarana
ms.subservice: elastic-san
---

# Deploy an Elastic SAN

This article explains how to deploy and configure an Elastic SAN.

## Prerequisites

- Sign up for the preview at [https://aka.ms/ElasticSANPreviewSignUp](https://aka.ms/ElasticSANPreviewSignUp).
- An Azure Virtual Network.

## Configure virtual network

Enable the Storage service endpoint on your subnet so that traffic is routed optimally to your elastic SAN.

1. Navigate to your virtual network and select **Service Endpoints**.
1. Select **+ Add** and for **Service** select **Microsoft.Storage**.
1. Select any policies you like, as well as the subnet you deploy your Elastic SAN into and select **Add**.

:::image type="content" source="media/elastic-san-create/elastic-san-service-endpoint.png" alt-text="Screenshot of the virtual network service endpoint page, adding the storage service endpoint." lightbox="media/elastic-san-create/elastic-san-service-endpoint.png":::

## Register for the preview

Register your subscription with the preview feature using the following command:

```azurepowershell
Register-AzProviderFeature -FeatureNameAllow ElasticSanPreviewAccess -ProviderNamespace Microsoft.ElasticSan
```

It may take a few minutes for registration to complete. To confirm that you've registered, use the following command:

```azurepowershell
Get-AzProviderFeature -FeatureName "ElasticSanPreviewAccess" -ProviderNamespace "Microsoft.ElasticSan"
```

## Create the SAN

# [Portal](#tab/azure-portal)

1. Sign in to the Azure portal and search for **Elastic SAN**.
1. Select **+ Create a new SAN**
1. On the basics page, fill out the values.
    1. Select the same region as your Azure virtual network.
1. Specify the amount of base capacity you require, and any additional capacity, then select next.

    Increasing your SAN's base size will also increase its IOPS and bandwidth. Increasing additional capacity only increase its total size (base+additional) but won't increase IOPS or bandwidth, however, it's cheaper than increasing base.

1. Select **Next : Volume groups**.

    :::image type="content" source="media/elastic-san-create/create-flow.png" alt-text="Screenshot of creation flow." lightbox="media/elastic-san-create/create-flow.png":::

# [PowerShell](#tab/azure-powershell)

```azurepowershell
## Variables
$rgName = "yourResourceGroupName"
## Select the same availability zone as your other azure resources
$zone = 1
## Select the same region as your Azure virtual network
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


1. Select **+ Create volume group** and name your volume.
    The volume group name is part of your volume's iSCSI Qualified Name, and can't be changed once created.
1. Select **Next : Volumes**

# [PowerShell](#tab/azure-powershell)


```azurepowershell
## Create the volume group, this script only creates one.
New-AzElasticSanVolumeGroup -ResourceGroupName $rgName -ElasticSANName $sanName -Name $volGroupName
```

---

## Create volumes

Now that you've configured the SAN itself, and created at least one volume group, you can create volumes.

Volumes are usable partitions of the SAN's total capacity, you must provision this total capacity as a volume in order to access it. Only the actual volumes themselves can be mounted and used, not the volume group.

# [Portal](#tab/azure-portal)

1. Create volumes by entering a name, selecting an appropriate volume group, and entering the capacity you'd like to allocate for your volume.
    The volume name is part of your volume's iSCI Qualified Name, and can't be changed once created.
1. Select **Review + create** and deploy your SAN.

    :::image type="content" source="media/elastic-san-create/volume-partitions.png" alt-text="Screenshot of volume creation." lightbox="media/elastic-san-create/volume-partitions.png":::

# [PowerShell](#tab/azure-powershell)

```azurepowershell
## Create the volume, this command only creates one.
New-AzElasticSanVolume -ResourceGroupName $rgName -ElasticSanName $sanName -GroupName $volGroupName -Name "volumeName" -sizeGiB 50
```

---


## Configure networking

Now that your SAN has been deployed, add a virtual network to your volume group. Adding a virtual network to your volume group allows you to establish connections from any client in the same virtual network and subnet to the volumes in the volume group.

# [Portal](#tab/azure-portal)

1. Navigate to your SAN and select **Volume groups**.
1. Select a volume group and select **Modify**.
1. Add an existing virtual network and select **Save**.

# [PowerShell](#tab/azure-powershell)

```azurepowershell
$rule1 = New-AzElasticSanVirtualNetworkRuleObject -VirtualNetworkResourceId <resourceIDHere> -Action Allow

Update-AzElasticSanVolumeGroup -ResourceGroupName $rgName -ElasticSanName $sanName -Name $volGroupName -NetworkAclsVirtualNetworkRule $rule1

```

---

## Connect a volume

Once your networking has been configured, you can begin connecting volumes to your Azure VMs.

1. Navigate to your SAN and select **Volumes**.
1. Select the volume you'd like to connect to and select **Connect**.
1. Copy the PowerShell commands provided and run them as an Administrator in a shell on your Azure VM.