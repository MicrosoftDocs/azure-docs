---
title: SAP ASCS/SCS multi-SID HA with WSFC and Azure shared disk | Microsoft Docs
description: Learn about multi-SID high availability for an SAP ASCS/SCS instance with Windows Server Failover Clustering and an Azure shared disk.
services: virtual-machines-windows,virtual-network,storage
documentationcenter: saponazure
author: rdeltcheva
manager: juergent
editor: ''
tags: azure-resource-manager
keywords: ''
ms.assetid: cbf18abe-41cb-44f7-bdec-966f32c89325
ms.service: sap-on-azure
ms.subservice: sap-vm-workloads
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure-services
ms.date: 12/16/2022
ms.author: radeltch
ms.custom: H1Hack27Feb2017, devx-track-azurepowershell
---
# SAP ASCS/SCS instance multi-SID high availability with Windows Server Failover Clustering and an Azure shared disk

> ![Windows OS][Logo_Windows] Windows

This article focuses on how to move from a single SAP ASCS/SCS installation to configuration of multiple SAP system IDs (SIDs) by installing additional SAP ASCS/SCS clustered instances into an existing Windows Server Failover Clustering (WSFC) cluster with an Azure shared disk. When you complete this process, you've configured an SAP multi-SID cluster.

## Prerequisites and limitations

You can use Azure Premium SSD disks as Azure shared disks for the SAP ASCS/SCS instance. The following limitations are currently in place:

- [Azure Ultra Disk Storage disks](../../virtual-machines/disks-types.md#ultra-disks) and [Azure Standard SSD disks](../../virtual-machines/disks-types.md#standard-ssds) are not supported as Azure shared disks for SAP workloads.
- [Azure shared disks](../../virtual-machines/disks-shared.md) with [Premium SSD disks](../../virtual-machines/disks-types.md#premium-ssds) are supported for SAP deployment in availability sets and availability zones.
- Azure shared disks with Premium SSD disks come with two storage options:
  - Locally redundant storage (LRS) for Premium SSD shared disks (`skuName` value of `Premium_LRS`) is supported with deployment in availability sets.
  - Zone-redundant storage (ZRS) for Premium SSD shared disks (`skuName` value of `Premium_ZRS`) is supported with deployment in availability zones.
- The Azure shared disk value [maxShares](../../virtual-machines/disks-shared-enable.md?tabs=azure-cli#disk-sizes) determines how many cluster nodes can use the shared disk. For an SAP ASCS/SCS instance, you typically configure two nodes in WSFC. You then set the value for `maxShares` to `2`.
- An [Azure proximity placement group (PPG)](../../virtual-machines/windows/proximity-placement-groups.md) is not required for Azure shared disks. But for SAP deployment with PPGs, follow these guidelines:
  - If you're using PPGs for a SAP system deployed in a region, all virtual machines that share a disk must be part of the same PPG.
  - If you're using PPGs for a SAP system deployed across zones, as described in [Proximity placement groups with zonal deployments](proximity-placement-scenarios.md#proximity-placement-groups-with-zonal-deployments), you can attach `Premium_ZRS` storage to virtual machines that share a disk.

For more information, review the [Limitations](../../virtual-machines/disks-shared.md#limitations) section of the documentation for Azure shared disks.

### Important considerations for Premium SSD shared disks

Consider these important points about Azure Premium SSD shared disks:

- LRS for Premium SSD shared disks:
  - SAP deployment with LRS for Premium SSD shared disks operates with a single Azure shared disk on one storage cluster. If there's a problem with the storage cluster where the Azure shared disk is deployed, it affects your SAP ASCS/SCS instance.

- ZRS for Premium SSD shared disks:
  - Write latency for ZRS is higher than that of LRS because cross-zonal copying of data.
  - The distance between availability zones in different regions varies, and so does ZRS disk latency across availability zones. [Benchmark your disks](../../virtual-machines/disks-benchmarks.md) to identify the latency of ZRS disks in your region.
  - ZRS for Premium SSD shared disks synchronously replicates data across three availability zones in the region. If there's a problem in one of the storage clusters, your SAP ASCS/SCS instance continues to run because storage failover is transparent to the application layer.
  - For more information, review the [Limitations](../../virtual-machines/disks-redundancy.md#limitations) section of the documentation about ZRS for managed disks.

> [!IMPORTANT]
> The setup must meet the following conditions:
>
> - The SID for each database management system (DBMS) must have its own dedicated WSFC cluster.  
> - SAP application servers that belong to one SAP SID must have their own dedicated virtual machines (VMs).  
> - A mix of Enqueue Replication Server 1 (ERS1) and Enqueue Replication Server 2 (ERS2) in the same cluster is not supported.  

## Supported OS versions

Windows Server 2016, 2019, and later are supported. Use the latest datacenter images.

We strongly recommend using at least Windows Server 2019 Datacenter, for these reasons:

- WSFC in Windows Server 2019 is Azure aware.
- It includes integration and awareness of Azure host maintenance and improved experience by monitoring for Azure scheduled events.
- You can use distributed network names. (It's the default option.) There's no need to have a dedicated IP address for the cluster network name. Also, you don't need to configure an IP address on an Azure internal load balancer.

## Architecture

Both ERS1 and ERS2 are supported in a multi-SID configuration. A mix of ERS1 and ERS2 is not supported in the same cluster.

The following example shows two SAP SIDs. Both have an ERS1 architecture where:

- SAP SID1 is deployed on a shared disk with ERS1. The ERS instance is installed on a local host and on a local drive.

  SAP SID1 has its own virtual IP address (SID1 (A)SCS IP1), which is configured on the Azure internal load balancer.

- SAP SID2 is deployed on a shared disk with ERS1. The ERS instance is installed on a local host and on a local drive.

  SAP SID2 has own virtual IP address (SID2 (A)SCS IP2), which is configured on the Azure internal load balancer.

![Diagram of two high-availability SAP ASCS/SCS instances with an ERS1 configuration.][sap-ha-guide-figure-6007]

The next example also shows two SAP SIDs. Both have an ERS2 architecture where:

- SAP SID1 is deployed on a shard disk with ERS2, which is clustered and is deployed on a local drive.  

  SAP SID1 has its own virtual IP address (SID1 (A)SCS IP1), which is configured on the Azure internal load balancer.

  SAP ERS2 has its own (virtual) IP address (SID1 ERS2 IP2), which is configured on the Azure internal load balancer.

- SAP SID2 is deployed on a shard disk with ERS2, which is clustered and is deployed on a local drive.  

  SAP SID2 has own virtual IP address (SID2 (A)SCS IP3), which is configured on the Azure internal load balancer.

  SAP ERS2 has its own virtual IP address (SID2 ERS2 IP4), which is configured on the Azure internal load balancer.

- There's a total of four virtual IP addresses:  

  - SID1 (A)SCS IP1
  - SID2 ERS2   IP2
  - SID2 (A)SCS IP3
  - SID2 ERS2   IP4

![Diagram of two high-availability SAP ASCS/SCS instances with an ERS1 and ERS2 configuration.][sap-ha-guide-figure-6008]

## Infrastructure preparation

You'll install a new SAP SID PR2 instance, in addition to the existing clustered SAP PR1 ASCS/SCS instance.  

### Host names and IP addresses

Based on your deployment type, the host names and the IP addresses of the scenario should be like the following examples.

Here are the details for an SAP deployment in an Azure availability set:

| Host name role                                        | Host name   | Static IP address                        | Availability set | Disk `SkuName` value |
| ----------------------------------------------------- | ----------- | ---------------------------------------- | ---------------- | ------------ |
| First cluster node ASCS/SCS cluster                     | pr1-ascs-10 | 10.0.0.4                                 | pr1-ascs-avset   | `Premium_LRS`  |
| 2nd cluster node ASCS/SCS cluster                     | pr1-ascs-11 | 10.0.0.5                                 | pr1-ascs-avset   |              |
| Cluster network name                                  | pr1clust    | 10.0.0.42 (only for a Windows Server 2016 cluster) | Not applicable              |              |
| SID1 ASCS cluster network name                    | pr1-ascscl  | 10.0.0.43                                | Not applicable              |              |
| SID1 ERS cluster network name (only for ERS2) | pr1-erscl   | 10.0.0.44                                | Not applicable              |              |
| SID2 ASCS cluster network name                    | pr2-ascscl  | 10.0.0.45                                | Not applicable              |              |
| SID2 ERS cluster network name (only for ERS2) | pr1-erscl   | 10.0.0.46                                | Not applicable              |              |

Here are the details for an SAP deployment in Azure availability zones:

| Host name role                                        | Host name   | Static IP address                        | Availability zone | Disk `SkuName` value |
| ----------------------------------------------------- | ----------- | ---------------------------------------- | ----------------- | ------------ |
| First cluster node ASCS/SCS cluster                     | pr1-ascs-10 | 10.0.0.4                                 | AZ01              | `Premium_ZRS`  |
| Second cluster node ASCS/SCS cluster                     | pr1-ascs-11 | 10.0.0.5                                 | AZ02              |              |
| Cluster network name                                  | pr1clust    | 10.0.0.42 (only for a Windows Server 2016 cluster) | Not applicable               |              |
| SID1 ASCS cluster network name                    | pr1-ascscl  | 10.0.0.43                                | Not applicable               |              |
| SID2 ERS cluster network name (only for ERS2) | pr1-erscl   | 10.0.0.44                                | Not applicable               |              |
| SID2 ASCS cluster network name                    | pr2-ascscl  | 10.0.0.45                                | Not applicable               |              |
| SID2 ERS cluster network name (only for ERS2) | pr1-erscl   | 10.0.0.46                                | Not applicable               |              |

The steps in this article remain the same for both deployment types. But if your cluster is running in an availability set, you need to deploy LRS for Azure  Premium SSD shared disks (`Premium_LRS`). If your cluster is running in an availability zone, you need to deploy ZRS for Azure Premium SSD shared disks (`Premium_ZRS`).

### Create an Azure internal load balancer

SAP ASCS, SAP SCS, and SAP ERS2 use virtual host names and virtual IP addresses. On Azure, a [load balancer](../../load-balancer/load-balancer-overview.md) is required to use a virtual IP address.
We strongly recommend using a [standard load balancer](../../load-balancer/quickstart-load-balancer-standard-public-portal.md).

You need to add configuration to the existing load balancer for the second SAP SID instance, PR2, for ASCS, SCS, or ERS. The configuration for the first SAP SID, PR1, should be already in place.  

#### (A)SCS PR2 [instance number 02]

- Front-end configuration:
  - Static ASCS/SCS IP address 10.0.0.45.
- Back-end configuration:
  - Already in place. The VMs were added to the back-end pool during configuration of SAP SID PR1.
- Probe port:
  - Port 620*nr* [62002]. Leave the default options for protocol (TCP), interval (5), and unhealthy threshold (2).
- Load-balancing rules:
  - If you're using a standard load balancer, select high-availability (HA) ports.
  - If you're using a basic load balancer, create load-balancing rules for the following ports:
    - 32*nr* TCP [3202]
    - 36*nr* TCP [3602]
    - 39*nr* TCP [3902]
    - 81*nr* TCP [8102]
    - 5*nr*13 TCP [50213]
    - 5*nr*14 TCP [50214]
    - 5*nr*16 TCP [50216]

  - Associate load-balancing rules with the PR2 ASCS front-end IP, the health probe, and the existing back-end pool.  

  - Make sure that idle timeout is set to the maximum value of 30 minutes, and that floating IP (direct server return) is enabled.

#### ERS2 PR2 [instance number 12]

Because ERS2 is clustered, you must configure the ERS2 virtual IP address on an Azure internal load balancer in addition to preceding SAP ASCS/SCS IP address. This section applies only if you're using the ERS2 architecture for PR2.  

- New front-end configuration:
  - Static SAP ERS2 IP address 10.0.0.46.

- Back-end configuration:
  - The VMs were already added to the internal load balancer's back-end pool.  

- New probe port:
  - Port 621*nr* [62112]. Leave the default options for protocol (TCP), interval (5), and unhealthy threshold (2).

- New load-balancing rules:
  - If you're using a standard load balancer, select HA ports.
  - If you're using a basic load balancer, create load-balancing rules for the following ports:
    - 32*nr* TCP [3212]
    - 33*nr* TCP [3312]
    - 5*nr*13 TCP [51212]
    - 5*nr*14 TCP [51212]
    - 5*nr*16 TCP [51212]
  
  - Associate load-balancing rules with the PR2 ERS2 front-end IP, the health probe, and the existing back-end pool.  

  - Make sure that idle timeout is set to the maximum value of 30 minutes, and that floating IP (direct server return) is enabled.

### Create and attach a second Azure shared disk

Run this command on one of the cluster nodes. Adjust the values for details like your resource group, Azure region, and SAP SID.  

```powershell
$ResourceGroupName = "MyResourceGroup"
$location = "MyRegion"
$SAPSID = "PR2"
$DiskSizeInGB = 512
$DiskName = "$($SAPSID)ASCSSharedDisk"
$NumberOfWindowsClusterNodes = 2

# For SAP deployment in an availability set, use this storage SkuName value
$SkuName = "Premium_LRS"
# For SAP deployment in an availability zone, use this storage SkuName value
$SkuName = "Premium_ZRS"

$diskConfig = New-AzDiskConfig -Location $location -SkuName $SkuName  -CreateOption Empty  -DiskSizeGB $DiskSizeInGB -MaxSharesCount $NumberOfWindowsClusterNodes
    
$dataDisk = New-AzDisk -ResourceGroupName $ResourceGroupName -DiskName $DiskName -Disk $diskConfig
##################################
## Attach the disk to cluster VMs
##################################
# ASCS cluster VM1
$ASCSClusterVM1 = "pr1-ascs-10"
# ASCS cluster VM2
$ASCSClusterVM2 = "pr1-ascs-11"
# Next free LUN
$LUNNumber = 1

# Add the Azure shared disk to Cluster Node 1
$vm = Get-AzVM -ResourceGroupName $ResourceGroupName -Name $ASCSClusterVM1 
$vm = Add-AzVMDataDisk -VM $vm -Name $DiskName -CreateOption Attach -ManagedDiskId $dataDisk.Id -Lun $LUNNumber
Update-AzVm -VM $vm -ResourceGroupName $ResourceGroupName -Verbose

# Add the Azure shared disk to Cluster Node 2
$vm = Get-AzVM -ResourceGroupName $ResourceGroupName -Name $ASCSClusterVM2
$vm = Add-AzVMDataDisk -VM $vm -Name $DiskName -CreateOption Attach -ManagedDiskId $dataDisk.Id -Lun $LUNNumber
Update-AzVm -VM $vm -ResourceGroupName $ResourceGroupName -Verbose
```

### Format the shared disk by using PowerShell

1. Get the disk number. Run these PowerShell commands on one of the cluster nodes:

   ```powershell
    Get-Disk | Where-Object PartitionStyle -Eq "RAW"  | Format-Table -AutoSize 
    # Example output
    # Number Friendly Name     Serial Number HealthStatus OperationalStatus Total Size Partition Style
    # ------ -------------     ------------- ------------ ----------------- ---------- ---------------
    # 3      Msft Virtual Disk               Healthy      Online                512 GB RAW            

   ```

2. Format the disk. In this example, it's disk number 3.

   ```powershell
    # Format SAP ASCS disk number 3, with drive letter S
    $SAPSID = "PR2"
    $DiskNumber = 3
    $DriveLetter = "S"
    $DiskLabel = "$SAPSID" + "SAP"
    
    Get-Disk -Number $DiskNumber | Where-Object PartitionStyle -Eq "RAW" | Initialize-Disk -PartitionStyle GPT -PassThru |  New-Partition -DriveLetter $DriveLetter -UseMaximumSize | Format-Volume  -FileSystem ReFS -NewFileSystemLabel $DiskLabel -Force -Verbose
    # Example outout
    # DriveLetter FileSystemLabel FileSystem DriveType HealthStatus OperationalStatus SizeRemaining      Size
    # ----------- --------------- ---------- --------- ------------ ----------------- -------------      ----
    # S           PR2SAP          ReFS       Fixed     Healthy      OK                    504.98 GB 511.81 GB
   ```

3. Verify that the disk is now visible as a cluster disk:  

   ```powershell
    # List all disks
    Get-ClusterAvailableDisk -All
    # Example output
    # Cluster    : pr1clust
    # Id         : c469b5ad-d089-4d8f-ae4c-d834cbbde1a2
    # Name       : Cluster Disk 2
    # Number     : 3
    # Size       : 549755813888
    # Partitions : {\\?\GLOBALROOT\Device\Harddisk3\Partition2\}
   ```

4. Register the disk in the cluster:  

   ```powershell
    # Add the disk to the cluster 
    Get-ClusterAvailableDisk -All | Add-ClusterDisk
    # Example output 
    # Name           State  OwnerGroup        ResourceType 
    # ----           -----  ----------        ------------ 
    # Cluster Disk 2 Online Available Storage Physical Disk
   ```

## Create a virtual host name for the clustered SAP ASCS/SCS instance

1. Create a DNS entry for the virtual host name for new the SAP ASCS/SCS instance in the Windows DNS manager.  

   The IP address that you assign to the virtual host name in DNS must be the same as the IP address that you assigned in Azure Load Balancer.  

   ![Screenshot that shows options for defining a DNS entry for the SAP ASCS/SCS cluster virtual name and IP address.][sap-ha-guide-figure-6009]

2. If you're using a clustered instance of SAP ERS2, you need to reserve in DNS a virtual host name for ERS2.

   The IP address that you assign to the virtual host name for ERS2 in DNS must be the same as the IP address that you assigned in Azure Load Balancer.  

   ![Screenshot that shows options for defining a DNS entry for the SAP ERS2 cluster virtual name and IP address.][sap-ha-guide-figure-6010]

3. To define the IP address that's assigned to the virtual host name, select **DNS Manager** > **Domain**.

   ![Screenshot that shows a new virtual name and IP address for SAP ASCS/SCS and ERS2 cluster configuration.][sap-ha-guide-figure-6011]

## SAP installation

### Install the SAP first cluster node

Follow the SAP-described installation procedure. Be sure to select **First Cluster Node** as the option for starting installation. Select **Cluster Shared Disk** as the configuration option. Choose the newly created shared disk.  

### Modify the SAP profile of the ASCS/SCS instance

If you're running ERS1, add the SAP profile parameter `enque/encni/set_so_keepalive`. The profile parameter prevents connections between SAP work processes and the enqueue server from closing when they're idle for too long. The SAP parameter is not required for ERS2.

1. Add this profile parameter to the SAP ASCS/SCS instance profile, if you're using ERS1:

   ```powershell
   enque/encni/set_so_keepalive = true
   ```

   For both ERS1 and ERS2, make sure that the `keepalive` OS parameters are set as described in SAP note [1410736](https://launchpad.support.sap.com/#/notes/1410736).

2. To apply the changes to the SAP profile parameter, restart the SAP ASCS/SCS instance.

### Configure a probe port on the cluster resource

Use the internal load balancer's probe functionality to make the entire cluster configuration work with Azure Load Balancer. The Azure internal load balancer usually distributes the incoming workload equally between participating virtual machines.

However, this approach won't work in some cluster configurations because only one instance is active. The other instance is passive and can't accept any of the workload. A probe functionality helps when the Azure internal load balancer detects which instance is active and targets only the active instance.

> [!IMPORTANT]
> In this example configuration, the probe port is set to 620*nr*. For SAP ASCS with instance number 02, it's 62002.
>
> You need to adjust the configuration to match your SAP instance numbers and your SAP SID.

To add a probe port, run this PowerShell module on one of the cluster VMs:

- If you're using SAP ASC/SCS with instance number 02:

   ```powershell
   Set-AzureLoadBalancerHealthCheckProbePortOnSAPClusterIPResource -SAPSID PR2 -ProbePort 62002
   ```

- If you're using ERS2 with instance number 12, there's no need to configure a probe port for ERS1. ERS2 with instance number 12 is clustered, whereas ERS1 isn't clustered.  

   ```powershell
   Set-AzureLoadBalancerHealthCheckProbePortOnSAPClusterIPResource -SAPSID PR2 -ProbePort 62012 -IsSAPERSClusteredInstance $True
   ```

The code for the function `Set-AzureLoadBalancerHealthCheckProbePortOnSAPClusterIPResource` looks like this example:

```powershell
 function Set-AzureLoadBalancerHealthCheckProbePortOnSAPClusterIPResource {
 <#
 .SYNOPSIS 
 Set-AzureLoadBalancerHealthProbePortOnSAPClusterIPResource will set a new Azure Load Balancer health probe port on the SAP $SAPSID IP cluster resource.
    
 .DESCRIPTION
 Set-AzureLoadBalancerHealthProbePortOnSAPClusterIPResource will set a new Azure Load Balancer health probe port on the SAP $SAPSID IP cluster resource.
 It will also restart the SAP cluster group (default behavior), to activate the changes. 
    
 You need to run it on one of the SAP ASCS/SCS Windows cluster nodes.
    
 The expectation is that the SAP group is installed with the official SWPM installation tool, which will set the default expected naming convention for:
 - SAP cluster group:               SAP $SAPSID
 - SAP cluster IP address resource: SAP $SAPSID IP 
    
 .PARAMETER SAPSID 
 SAP SID - three characters, starting with a letter.
    
 .PARAMETER ProbePort 
 Azure Load Balancer health check probe port.
    
 .PARAMETER RestartSAPClusterGroup 
 Optional parameter. Default value is $True, so the SAP cluster group will be restarted to activate the changes.
    
 .PARAMETER IsSAPERSClusteredInstance 
 Optional parameter. Default value is $False.
 If it's set to $True, then handle the clustered new SAP ERS2 instance.
    
    
 .EXAMPLE 
 # Set the probe port to 62000 on SAP cluster resource SAP AB1 IP, and restart the SAP cluster group SAP AB1 to activate the changes.
 Set-AzureLoadBalancerHealthCheckProbePortOnSAPClusterIPResource -SAPSID AB1 -ProbePort 62000 
    
 .EXAMPLE 
 # Set the probe port to 62000 on SAP cluster resource SAP AB1 IP. SAP cluster group SAP AB1 is not restarted, so the changes are not active.
 # To activate the changes, you need to manually restart the SAP AB1 cluster group.
 Set-AzureLoadBalancerHealthCheckProbePortOnSAPClusterIPResource -SAPSID AB1 -ProbePort 62000 -RestartSAPClusterGroup $False
    
 .EXAMPLE 
 # Set the probe port to 62001 on SAP cluster resource SAP AB1 ERS IP. SAP cluster group SAP AB1 ERS is restarted to activate the changes.
 Set-AzureLoadBalancerHealthCheckProbePortOnSAPClusterIPResource -SAPSID AB1 -ProbePort 62000 -IsSAPERSClusteredInstance $True
        
 #> 
    
     [CmdletBinding()]
     param(
            
         [Parameter(Mandatory=$True)]
         [ValidateNotNullOrEmpty()]  
         [ValidateLength(3,3)]      
         [string]$SAPSID,

         [Parameter(Mandatory=$True)]
         [ValidateNotNullOrEmpty()]        
         [int] $ProbePort,
    
         [Parameter(Mandatory=$False)] 
         [bool] $RestartSAPClusterGroup = $True,
    
         [Parameter(Mandatory=$False)] 
         [bool] $IsSAPERSClusteredInstance = $False
      
     )
  
     BEGIN{}
        
     PROCESS{
         try{                                      
                
             if($IsSAPERSClusteredInstance){
                 #Handle clustered SAP ERS instance
                 $SAPClusterRoleName = "SAP $SAPSID ERS"
                 $SAPIPresourceName = "SAP $SAPSID ERS IP"            
             }else{
                 #Handle clustered SAP ASCS/SCS instance
                 $SAPClusterRoleName = "SAP $SAPSID"
                 $SAPIPresourceName = "SAP $SAPSID IP"
             }

             $SAPIPResourceClusterParameters =  Get-ClusterResource $SAPIPresourceName | Get-ClusterParameter
             $IPAddress = ($SAPIPResourceClusterParameters | Where-Object {$_.Name -eq "Address" }).Value
             $NetworkName = ($SAPIPResourceClusterParameters | Where-Object {$_.Name -eq "Network" }).Value
             $SubnetMask = ($SAPIPResourceClusterParameters | Where-Object {$_.Name -eq "SubnetMask" }).Value
             $OverrideAddressMatch = ($SAPIPResourceClusterParameters | Where-Object {$_.Name -eq "OverrideAddressMatch" }).Value
             $EnableDhcp = ($SAPIPResourceClusterParameters | Where-Object {$_.Name -eq "EnableDhcp" }).Value
             $OldProbePort = ($SAPIPResourceClusterParameters | Where-Object {$_.Name -eq "ProbePort" }).Value
    
             $var = Get-ClusterResource | Where-Object {  $_.name -eq $SAPIPresourceName  }
    
             #Write-Host "Current configuration parameters for SAP IP cluster resource '$SAPIPresourceName' are:" -ForegroundColor Cyan
             Write-Output "Current configuration parameters for SAP IP cluster resource '$SAPIPresourceName' are:" 
   
             Get-ClusterResource -Name $SAPIPresourceName | Get-ClusterParameter
    
             Write-Output " "
             Write-Output "Current probe port property of the SAP cluster resource '$SAPIPresourceName' is '$OldProbePort'." 
             Write-Output " "
             Write-Output "Setting the new probe port property of the SAP cluster resource '$SAPIPresourceName' to '$ProbePort' ..." 
             Write-Output " "
    
             $var | Set-ClusterParameter -Multiple @{"Address"=$IPAddress;"ProbePort"=$ProbePort;"Subnetmask"=$SubnetMask;"Network"=$NetworkName;"OverrideAddressMatch"=$OverrideAddressMatch;"EnableDhcp"=$EnableDhcp}
    
             Write-Output " "
    
             #$ActivateChanges = Read-Host "Do you want to take restart SAP cluster role '$SAPClusterRoleName', to activate the changes (yes/no)?"
    
             if($RestartSAPClusterGroup){
                 Write-Output ""
                 Write-Output "Activating changes..." 
    
                 Write-Output " "
                 Write-Output "Taking SAP cluster IP resource '$SAPIPresourceName' offline ..."
                 Stop-ClusterResource -Name $SAPIPresourceName
                 sleep 5
    
                 Write-Output "Starting SAP cluster role '$SAPClusterRoleName' ..."
                 Start-ClusterGroup -Name $SAPClusterRoleName
    
                 Write-Output "New ProbePort parameter is active." 
                 Write-Output " "
    
                 Write-Output "New configuration parameters for SAP IP cluster resource '$SAPIPresourceName':" 
                 Write-Output " " 
                 Get-ClusterResource -Name $SAPIPresourceName | Get-ClusterParameter
             }else
             {
                 Write-Output "SAP cluster role '$SAPClusterRoleName' is not restarted, therefore changes are not activated."
             }
         }
         catch{
            Write-Error  $_.Exception.Message
        }
    
     }
    
     END {}
 }
```

### Continue with the SAP installation

1. Install the database instance by following the process that's described in the SAP installation guide.  
2. Install SAP on the second cluster node by following the steps that are described in the SAP installation guide.  
3. Install the SAP Primary Application Server (PAS) instance on the virtual machine that you've designated to host the PAS.

   Follow the process described in the SAP installation guide. There are no dependencies on Azure.
4. Install additional SAP application servers on the virtual machines that are designated to host SAP application server instances.  

   Follow the process described in the SAP installation guide. There are no dependencies on Azure.

## Test SAP ASCS/SCS instance failover

The outlined failover tests assume that SAP ASCS is active on node A.  

1. Verify that the SAP system can successfully fail over from node A to node B. In this example, the test is done for SAP SID PR2.  

   Make sure that each SAP SID can successfully move to the other cluster node. Choose one of these options to initiate a failover of the SAP \<SID\> cluster group from cluster node A to cluster node B:

   - Failover Cluster Manager  
   - Powershell commands for failover clusters

    ```powershell
    $SAPSID = "PR2"     # SAP <SID>
 
    $SAPClusterGroup = "SAP $SAPSID"
    Move-ClusterGroup -Name $SAPClusterGroup

    ```

2. Restart cluster node A within the Windows guest operating system. This step initiates an automatic failover of the SAP \<SID\> cluster group from node A to node B.  
3. Restart cluster node A from the Azure portal. This step initiates an automatic failover of the SAP \<SID\> cluster group from node A to node B.  
4. Restart cluster node A by using Azure PowerShell. This step initiates an automatic failover of the SAP \<SID\> cluster group from node A to node B.

## Next steps

- [Prepare the Azure infrastructure for SAP HA by using a Windows failover cluster and shared disk for an SAP ASCS/SCS instance][sap-high-availability-infrastructure-wsfc-shared-disk]
- [Install SAP NetWeaver HA on a Windows failover cluster and shared disk for an SAP ASCS/SCS instance][sap-high-availability-installation-wsfc-shared-disk]

[sap-high-availability-infrastructure-wsfc-shared-disk]:sap-high-availability-infrastructure-wsfc-shared-disk.md
[sap-high-availability-installation-wsfc-shared-disk]:sap-high-availability-installation-wsfc-shared-disk.md

[Logo_Windows]:media/virtual-machines-shared-sap-shared/Windows.png

[sap-ha-guide-figure-6007]:media/virtual-machines-shared-sap-high-availability-guide/6007-sap-multi-sid-ascs-azure-shared-disk-sid-1.png
[sap-ha-guide-figure-6008]:media/virtual-machines-shared-sap-high-availability-guide/6008-sap-multi-sid-ascs-azure-shared-disk-sid-2.png
[sap-ha-guide-figure-6009]:media/virtual-machines-shared-sap-high-availability-guide/6009-sap-multi-sid-ascs-azure-shared-disk-dns1.png
[sap-ha-guide-figure-6010]:media/virtual-machines-shared-sap-high-availability-guide/6010-sap-multi-sid-ascs-azure-shared-disk-dns2.png
[sap-ha-guide-figure-6011]:media/virtual-machines-shared-sap-high-availability-guide/6011-sap-multi-sid-ascs-azure-shared-disk-dns3.png
