---
title: SAP NetWeaver high availability installation on a Windows failover cluster and file share for SAP ASCS/SCS instances on Azure | Microsoft Docs
description: SAP NetWeaver high availability installation on a Windows failover cluster and file share for SAP ASCS/SCS instances
services: virtual-machines-windows,virtual-network,storage
author: rdeltcheva
ms.service: sap-on-azure
ms.subservice: sap-vm-workloads
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.date: 12/16/2022
ms.author: radeltch
ms.custom: H1Hack27Feb2017
---

# Install SAP NetWeaver high availability on a Windows failover cluster and file share for SAP ASCS/SCS instances on Azure

[s2d-in-win-2016]:/windows-server/storage/storage-spaces/storage-spaces-direct-overview
[sofs-overview]:https://technet.microsoft.com/library/hh831349(v=ws.11).aspx
[new-in-win-2016-storage]:/windows-server/storage/whats-new-in-storage

[sap-high-availability-guide-wsfc-file-share]:sap-high-availability-guide-wsfc-file-share.md
[sap-high-availability-infrastructure-wsfc-file-share]:sap-high-availability-infrastructure-wsfc-file-share.md

[sap-high-availability-installation-wsfc-shared-disk-create-ascs-virt-host]:sap-high-availability-installation-wsfc-shared-disk.md#a97ad604-9094-44fe-a364-f89cb39bf097
[sap-high-availability-installation-wsfc-shared-disk-add-probe-port]:sap-high-availability-installation-wsfc-shared-disk.md#10822f4f-32e7-4871-b63a-9b86c76ce761

This article describes how to install and configure a high-availability SAP system on Azure, with Windows Server Failover Cluster (WSFC) and Scale-Out File Server as an option for clustering SAP ASCS/SCS instances.

## Prerequisites

Before you start the installation, review the following articles:

* [Architecture guide: Cluster an SAP ASCS/SCS instance on a Windows failover cluster by using file share][sap-high-availability-guide-wsfc-file-share]

* [Prepare Azure infrastructure SAP high availability by using a Windows failover cluster and file share for SAP ASCS/SCS instances][sap-high-availability-infrastructure-wsfc-file-share]

* [High availability for SAP NetWeaver on Azure VMs](./sap-high-availability-architecture-scenarios.md)

You need the following executables and DLLs from SAP:

* SAP Software Provisioning Manager (SWPM) installation tool version SPS25 or later.
* SAP Kernel 7.49 or later

> [!IMPORTANT]
>
> Clustering SAP ASCS/SCS instances by using a file share is supported for SAP NetWeaver 7.40 (and later), with SAP Kernel 7.49 (and later).  
> The setup must meet the following requirement: the SAP ASCS/SCS instances and the SOFS share must be deployed in separate clusters.

We do not describe the Database Management System (DBMS) setup because setups vary depending on the DBMS you use. However, we assume that high-availability concerns with the DBMS are addressed with the functionalities that various DBMS vendors support for Azure. Such functionalities include Always On or database mirroring for SQL Server, and Oracle Data Guard for Oracle databases. In the scenario we use in this article, we didn't add more protection to the DBMS.

There are no special considerations when various DBMS services interact with this kind of clustered SAP ASCS/SCS configuration in Azure.

> [!NOTE]
> The installation procedures of SAP NetWeaver ABAP systems, Java systems, and ABAP+Java systems are almost identical. The most significant difference is that an SAP ABAP system has one ASCS instance. The SAP Java system has one SCS instance. The SAP ABAP+Java system has one ASCS instance and one SCS instance running in the same Microsoft failover cluster group. Any installation differences for each SAP NetWeaver installation stack are explicitly mentioned. You can assume that all other parts are the same.  

## Prepare an SAP global host on the SOFS cluster

Create the following volume and file share on the SOFS cluster:

* SAP GLOBALHOST file `C:\ClusterStorage\Volume1\usr\sap\<SID>\SYS\` structure on SOFS cluster shared volume (CSV)

* SAPMNT file share

* Set security on the SAPMNT file share and folder with full control for:
  * The \<DOMAIN>\SAP_\<SID>_GlobalAdmin user group
  * The SAP ASCS/SCS cluster node computer objects \<DOMAIN>\ClusterNode1$ and \<DOMAIN>\ClusterNode2$

To create a CSV volume with mirror resiliency, execute the following PowerShell cmdlet on one of the SOFS cluster nodes:

```powershell
New-Volume -StoragePoolFriendlyName S2D* -FriendlyName SAPPR1 -FileSystem CSVFS_ReFS -Size 5GB -ResiliencySettingName Mirror
```

To create SAPMNT and set folder and share security, execute the following PowerShell script on one of the SOFS cluster nodes:

```powershell
# Create SAPMNT on file share
$SAPSID = "PR1"
$DomainName = "SAPCLUSTER"
$SAPSIDGlobalAdminGroupName = "$DomainName\SAP_" + $SAPSID + "_GlobalAdmin"

# SAP ASCS/SCS cluster nodes
$ASCSClusterNode1 = "ascs-1"
$ASCSClusterNode2 = "ascs-2"

# Define SAP ASCS/SCS cluster node computer objects
$ASCSClusterObjectNode1 = "$DomainName\$ASCSClusterNode1$"
$ASCSClusterObjectNode2 = "$DomainName\$ASCSClusterNode2$"

# Create usr\sap\.. folders on CSV
$SAPGlobalFolder = "C:\ClusterStorage\SAP$SAPSID\usr\sap\$SAPSID\SYS"
New-Item -Path $SAPGlobalFOlder -ItemType Directory

$UsrSAPFolder = "C:\ClusterStorage\SAP$SAPSID\usr\sap\"

# Create a SAPMNT file share and set share security
New-SmbShare -Name sapmnt -Path $UsrSAPFolder -FullAccess "BUILTIN\Administrators", $ASCSClusterObjectNode1, $ASCSClusterObjectNode2 -ContinuouslyAvailable $true -CachingMode None -Verbose

# Get SAPMNT file share security settings
Get-SmbShareAccess sapmnt

# Set file and folder security
$Acl = Get-Acl $UsrSAPFolder

# Add  a security object of the clusternode1$ computer object
$Ar = New-Object  system.security.accesscontrol.filesystemaccessrule($ASCSClusterObjectNode1,"FullControl",'ContainerInherit,ObjectInherit', 'None', 'Allow')
$Acl.SetAccessRule($Ar)

# Add a security object of the clusternode2$ computer object
$Ar = New-Object  system.security.accesscontrol.filesystemaccessrule($ASCSClusterObjectNode2,"FullControl",'ContainerInherit,ObjectInherit', 'None', 'Allow')
$Acl.SetAccessRule($Ar)

# Set security
Set-Acl $UsrSAPFolder $Acl -Verbose
```

## Create a virtual host name for the clustered SAP ASCS/SCS instance

Create an SAP ASCS/SCS cluster network name (for example, **pr1-ascs [10.0.6.7]**), as described in [Create a virtual host name for the clustered SAP ASCS/SCS instance][sap-high-availability-installation-wsfc-shared-disk-create-ascs-virt-host].

## Install an ASCS/SCS and ERS instances in the cluster

### Install an ASCS/SCS instance on the first ASCS/SCS cluster node

Install an SAP ASCS/SCS instance on the first cluster node. To install the instance, in the SAP SWPM installation tool, go to:

**\<Product>** > **\<DBMS>** > **Installation** > **Application Server ABAP** (or **Java**) > **High-Availability System** > **ASCS/SCS instance** > **First cluster node**.

### Add a probe port

Configure an SAP cluster resource, the SAP-SID-IP probe port, by using PowerShell. Execute this configuration on one of the SAP ASCS/SCS cluster nodes, as described [in this article][sap-high-availability-installation-wsfc-shared-disk-add-probe-port].

### Install an ASCS/SCS instance on the second ASCS/SCS cluster node

Install an SAP ASCS/SCS instance on the second cluster node. To install the instance, in the SAP SWPM installation tool, go to:

**\<Product>** > **\<DBMS>** > **Installation** > **Application Server ABAP** (or **Java**) > **High-Availability System** > **ASCS/SCS instance** > **Additional cluster node**.

## Update the SAP ASCS/SCS instance profile

Update parameters in the SAP ASCS/SCS instance profile \<SID>_ASCS/SCS\<Nr>_\<Host>.

| Parameter name | Parameter value |
| --- | --- |
| gw/netstat_once | **0** |
| enque/encni/set_so_keepalive  | **true** |
| service/ha_check_node | **1** |

Parameter `enque/encni/set_so_keepalive` is only needed if using ENSA1.  
Restart the SAP ASCS/SCS instance.
Set `KeepAlive` parameters on both SAP ASCS/SCS cluster nodes follow the instructions to [Set registry entries on the cluster nodes of the SAP ASCS/SCS instance](./sap-high-availability-infrastructure-wsfc-shared-disk.md#add-registry-entries-on-both-cluster-nodes-of-the-ascsscs-instance).

## Install a DBMS instance and SAP application servers

Finalize your SAP system installation by installing:

* A DBMS instance.
* A primary SAP application server.
* An additional SAP application server.

## Next steps

* [Storage Spaces Direct in Windows Server 2016][s2d-in-win-2016].
* [Scale-Out File Server for application data overview][sofs-overview].
* [What's new in storage in Windows Server 2016][new-in-win-2016-storage].
