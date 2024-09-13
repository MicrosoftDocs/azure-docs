---
title: Azure infrastructure for SAP ASCS/SCS HA with WSFC&file Share
description: Azure infrastructure preparation for SAP high availability using a Windows failover cluster and file Share for SAP ASCS/SCS instances
author: rdeltcheva
manager: juergent
ms.assetid: 2ce38add-1078-4bb9-a1da-6f407a9bc910
ms.service: sap-on-azure
ms.subservice: sap-vm-workloads
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.date: 12/16/2022
ms.author: radeltch
ms.custom: H1Hack27Feb2017
---

# Prepare Azure infrastructure for SAP high availability by using a Windows failover cluster and file share for SAP ASCS/SCS instances


[ms-blog-s2d-in-azure]:https://blogs.technet.microsoft.com/filecab/2016/05/05/s2dazuretp5/
[arm-sofs-s2d-managed-disks]:https://github.com/robotechredmond/301-storage-spaces-direct-md
[arm-sofs-s2d-non-managed-disks]:https://github.com/Azure/azure-quickstart-templates/tree/master/demos/storage-spaces-direct
[deploy-cloud-witness]:/windows-server/failover-clustering/deploy-cloud-witness
[tuning-failover-cluster-network-thresholds]:https://techcommunity.microsoft.com/t5/Failover-Clustering/Tuning-Failover-Cluster-Network-Thresholds/ba-p/371834

[sap-high-availability-guide-wsfc-file-share]:sap-high-availability-guide-wsfc-file-share.md

[sap-high-availability-infrastructure-wsfc-shared-disk]:sap-high-availability-infrastructure-wsfc-shared-disk.md
[sap-high-availability-infrastructure-wsfc-shared-disk-default-ascs-ilb-rules]:sap-high-availability-infrastructure-wsfc-shared-disk.md#create-azure-internal-load-balancer
[sap-high-availability-infrastructure-wsfc-shared-disk-add-win-domain]:sap-high-availability-infrastructure-wsfc-shared-disk.md#add-the-windows-vms-to-the-domain
[sap-high-availability-installation-wsfc-file-share]:sap-high-availability-installation-wsfc-file-share.md

[sap-ha-guide-figure-8010]:./media/virtual-machines-shared-sap-high-availability-guide/8010.png
[sap-ha-guide-figure-8011]:./media/virtual-machines-shared-sap-high-availability-guide/8011.png

This article describes the Azure infrastructure preparation steps that are needed to install and configure high-availability SAP systems on a Windows Server Failover Clustering cluster (WSFC), using scale-out file share as an option for clustering SAP ASCS/SCS instances.

## Prerequisite

Before you start the installation, review the following article:

* [Architecture guide: Cluster SAP ASCS/SCS instances on a Windows failover cluster by using file share][sap-high-availability-guide-wsfc-file-share]


## Host names and IP addresses

| Virtual host name role | Virtual host name | Static IP address | Availability set |
| --- | --- | --- | --- |
| First cluster node ASCS/SCS cluster | ascs-1 | 10.0.6.4 | ascs-as |
| Second cluster node ASCS/SCS cluster | ascs-2 | 10.0.6.5 | ascs-as |
| Cluster network name |ascs-cl | 10.0.6.6 | n/a |
| SAP PR1 ASCS cluster network name |pr1-ascs | 10.0.6.7 | n/a |


**Table 1**: ASCS/SCS cluster

| SAP \<SID> | SAP ASCS/SCS instance number |
| --- | --- |
| PR1 | 00 |

**Table 2**: SAP ASCS/SCS instance details


| Virtual host name role | Virtual host name | Static IP address | Availability set |
| --- | --- | --- | --- |
| First cluster node | sofs-1 | 10.0.6.10 | sofs-as |
| Second cluster node | sofs-2 | 10.0.6.11 | sofs-as |
| Third cluster node | sofs-3 | 10.0.6.12 | sofs-as |
| Cluster network name | sofs-cl | 10.0.6.13 | n/a |
| SAP global host name | sapglobal | Use IPs of all cluster nodes | n/a |

**Table 3**: Scale-Out File Server cluster


## Deploy VMs for an SAP ASCS/SCS cluster, a Database Management System (DBMS) cluster, and SAP Application Server instances

To prepare the Azure infrastructure, complete the following:

* [Deploy the VMs][sap-high-availability-infrastructure-wsfc-shared-disk].

* [Create and configure Azure Load balancer for SAP ASCS][sap-high-availability-infrastructure-wsfc-shared-disk-default-ascs-ilb-rules].

* [If using Enqueue replication server 2 (ERS2), perform the Azure Load Balancer configuration for ERS2 ][sap-high-availability-infrastructure-wsfc-shared-disk-default-ascs-ilb-rules]. 

* [Add Windows virtual machines to the domain][sap-high-availability-infrastructure-wsfc-shared-disk-add-win-domain].

* [Add registry entries on both cluster nodes of the SAP ASCS/SCS instance][sap-high-availability-infrastructure-wsfc-shared-disk-add-win-domain].

* As you use Windows Server 2016, we recommend that you configure [Azure Cloud Witness][deploy-cloud-witness].


## Deploy the Scale-Out File Server cluster manually 

You can deploy the Microsoft Scale-Out File Server cluster manually, as described in the blog [Storage Spaces Direct in Azure][ms-blog-s2d-in-azure], by executing the following code:  


```powershell
# Set an execution policy - all cluster nodes
Set-ExecutionPolicy Unrestricted

# Define Scale-Out File Server cluster nodes
$nodes = ("sofs-1", "sofs-2", "sofs-3")

# Add cluster and Scale-Out File Server features
Invoke-Command $nodes {Install-WindowsFeature Failover-Clustering, FS-FileServer -IncludeAllSubFeature -IncludeManagementTools -Verbose}

# Test cluster
Test-Cluster -node $nodes -Verbose

# Install cluster
$ClusterNetworkName = "sofs-cl"
$ClusterIP = "10.0.6.13"
New-Cluster -Name $ClusterNetworkName -Node $nodes –NoStorage –StaticAddress $ClusterIP -Verbose

# Set Azure Quorum
Set-ClusterQuorum –CloudWitness –AccountName gorcloudwitness -AccessKey <YourAzureStorageAccessKey>

# Enable Storage Spaces Direct
Enable-ClusterS2D

# Create Scale-Out File Server with an SAP global host name
# SAPGlobalHostName
$SAPGlobalHostName = "sapglobal"
Add-ClusterScaleOutFileServerRole -Name $SAPGlobalHostName
```

## Deploy Scale-Out File Server automatically

You can also automate the deployment of Scale-Out File Server by using Azure Resource Manager templates in an existing virtual network and Active Directory environment.

> [!IMPORTANT]
> We recommend that you have three or more cluster nodes for Scale-Out File Server with three-way mirroring.
>
> In the Scale-Out File Server Resource Manager template UI, you must specify the VM count.
>

### Use managed disks

The Azure Resource Manager template for deploying Scale-Out File Server with Storage Spaces Direct and Azure Managed Disks is available on [GitHub][arm-sofs-s2d-managed-disks].

We recommend that you use Managed Disks.

![Figure 1: UI screen for Scale-Out File Server Resource Manager template with managed disks][sap-ha-guide-figure-8010]

_**Figure 1**: UI screen for Scale-Out File Server Resource Manager template with managed disks_

In the template, do the following:
1. In the **Vm Count** box, enter a minimum count of **2**.
2. In the **Vm Disk Count** box, enter a minimum disk count of **3** (2 disks + 1 spare disk = 3 disks).
3. In the **Sofs Name** box, enter the SAP global host network name, **sapglobalhost**.
4. In the **Share Name** box, enter the file share name, **sapmnt**.

### Use unmanaged disks

The Azure Resource Manager template for deploying Scale-Out File Server with Storage Spaces Direct and Azure Unmanaged Disks is available on [GitHub][arm-sofs-s2d-non-managed-disks].

![Figure 2: UI screen for the Scale-Out File Server Azure Resource Manager template without managed disks][sap-ha-guide-figure-8011]

_**Figure 2**: UI screen for the Scale-Out File Server Azure Resource Manager template without managed disks_

In the **Storage Account Type** box, select **Premium Storage**. All other settings are the same as the settings for managed disks.

## Adjust cluster timeout settings

After you successfully install the Windows Scale-Out File Server cluster, adapt timeout thresholds for failover detection to conditions in Azure. The parameters to be changed are documented in [Tuning failover cluster network thresholds][tuning-failover-cluster-network-thresholds]. Assuming that your clustered VMs are in the same subnet, change the following parameters to these values:

- SameSubNetDelay = 2000
- SameSubNetThreshold = 15
- RouteHistoryLength = 30

These settings were tested with customers, and offer a good compromise. They are resilient enough, but they also provide fast enough failover in real error conditions or VM failure.

## Next steps

* [Install SAP NetWeaver high availability on a Windows failover cluster and file share for SAP ASCS/SCS instances][sap-high-availability-installation-wsfc-file-share]
