---
title: SAP ASCS/SCS multi-SID HA with WSFC and Azure shared disk | Microsoft Docs
description:  Multi-SID high availability for an SAP ASCS/SCS instance with WSFC and Azure shared disk
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
# SAP ASCS/SCS instance multi-SID high availability with Windows server failover clustering and Azure shared disk

> ![Windows OS][Logo_Windows] Windows

This article focuses on how to move from a single ASCS/SCS installation to an SAP multi-SID configuration by installing additional SAP ASCS/SCS clustered instances into an existing Windows Server Failover Clustering (WSFC) cluster with Azure shared disk. When this process is completed, you have configured an SAP multi-SID cluster.

## Prerequisites and limitations

Currently you can use Azure Premium SSD disks as an Azure shared disk for the SAP ASCS/SCS instance. The following limitations are currently in place:

-  [Azure Ultra disk](../../virtual-machines/disks-types.md#ultra-disks) and [Standard SSD disks](../../virtual-machines/disks-types.md#standard-ssds) are not supported as Azure Shared Disk for SAP workloads.
-  [Azure Shared disk](../../virtual-machines/disks-shared.md) with [Premium SSD disks](../../virtual-machines/disks-types.md#premium-ssds) is supported for SAP deployment in availability set and availability zones.
-  Azure shared disk with Premium SSD disks comes with two storage SKUs.
   - Locally redundant storage (LRS) for premium shared disk (skuName - Premium_LRS) is supported with deployment in availability set.
   - Zone-redundant storage (ZRS) for premium shared disk (skuName - Premium_ZRS) is supported with deployment in availability zones.
-  Azure shared disk value [maxShares](../../virtual-machines/disks-shared-enable.md?tabs=azure-cli#disk-sizes) determines how many cluster nodes can use the shared disk. Typically for SAP ASCS/SCS instance you will configure two nodes in Windows Failover Cluster, therefore the value for `maxShares` must be set to two.
-  [Azure proximity placement group](../../virtual-machines/windows/proximity-placement-groups.md) is not required for Azure shared disk. But for SAP deployment with PPG, follow below guidelines:
   -  If you are using PPG for SAP system deployed in a region then all virtual machines sharing a disk must be part of the same PPG.
   -  If you are using PPG for SAP system deployed across zones like described in the document [Proximity placement groups with zonal deployments](proximity-placement-scenarios.md#proximity-placement-groups-with-zonal-deployments), you can attach Premium_ZRS storage to virtual machines sharing a disk.

For further details on limitations for Azure shared disk, please review carefully the [limitations](../../virtual-machines/disks-shared.md#limitations) section of Azure Shared Disk documentation.

#### Important consideration for Premium shared disk

Following are some of the important points to consider with respect to Azure Premium shared disk:

- LRS for Premium shared disk
  - SAP deployment with LRS for premium shared disk will be operating with a single Azure shared disk on one storage cluster. Your SAP ASCS/SCS instance would be impacted, in case of issues with the storage cluster, where the Azure shared disk is deployed.

- ZRS for Premium shared disk
  - Write latency for ZRS is higher than that of LRS due to cross-zonal copy of data.
  - The distance between availability zones in different region varies and with that ZRS disk latency across availability zones as well. [Benchmark your disks](../../virtual-machines/disks-benchmarks.md) to identify the latency of ZRS disk in your region.
  - ZRS for Premium shared disk synchronously replicates data across three availability zones in the region. In case of any issue in one of the storage clusters, your SAP ASCS/SCS will continue to run as storage failover is transparent to the application layer.
  - Review the [limitations](../../virtual-machines/disks-redundancy.md#limitations) section of ZRS for managed disks for more details.

> [!IMPORTANT]
> The setup must meet the following conditions:
> * Each database management system (DBMS) SID must have its own dedicated WSFC cluster.  
> * SAP application servers that belong to one SAP system SID must have their own dedicated VMs.  
> * A mix of Enqueue Replication Server 1 and Enqueue Replication Server 2 in the same cluster is not supported.  


## Supported OS versions

Windows Servers 2016, 2019 and higher are supported (use the latest data center images).

We strongly recommend using at least **Windows Server 2019 Datacenter**, as:
- Windows 2019 Failover Cluster Service is Azure aware
- There is added integration and awareness of Azure Host Maintenance and improved experience by monitoring for Azure schedule events.
- It is possible to use Distributed network name(it is the default option). Therefore, there is no need to have a dedicated IP address for the cluster network name. Also, there is no need to configure this IP address on Azure Internal Load Balancer. 

## Architecture

Both Enqueue replication server 1 (ERS1) and Enqueue replication server 2 (ERS2) are supported in multi-SID configuration.  A mix of ERS1 and ERS2 is not supported in the same cluster. 

1. The first example shows two SAP SIDs, both with ERS1 architecture where:

   - SAP SID1 is deployed on shared disk, with ERS1. The ERS instance is installed on local host and on local drive.
     SAP SID1 has its own (virtual) IP address (SID1 (A)SCS IP1), which is configured on the Azure Internal Load balancer.

   - SAP SID2 is deployed on shared disk, with ERS1. The ERS instance is installed on local host and on local drive.
     SAP SID2 has own (virtual) IP address (SID2 (A)SCS IP2), which is configured also on the Azure Internal Load balancer.

![High-availability SAP ASCS/SCS instance - two instances with ERS1 configuration][sap-ha-guide-figure-6007]

2. The second example shows two SAP SIDs, both with ERS2 architecture where: 

   - SAP SID1 with ERS2, is which also clustered and is deployed on local drive.  
     SAP SID1 has own (virtual) IP address (SID1 (A)SCS IP1), which is configured on the Azure Internal Load balancer.
     SAP ERS2, used by SAP SID1 system has its own (virtual) IP address (SID1 ERS2 IP2), which is configured on the Azure Internal Load balancer.

   - SAP SID2 with ERS2, is which also clustered and is deployed on local drive.  
     SAP SID2 has own (virtual) IP address (SID2 (A)SCS IP3), which is configured on the Azure Internal Load balancer.
     SAP ERS2, used by SAP SID2 system has its own (virtual) IP address (SID2 ERS2 IP4), which is configured on the Azure Internal Load balancer.

   Here we have a total of four virtual IP addresses:  
   - SID1 (A)SCS IP1
   - SID2 ERS2   IP2
   - SID2 (A)SCS IP3
   - SID2 ERS2   IP4

![High-availability SAP ASCS/SCS instance - two instances with ERS1 and ERS2 configuration][sap-ha-guide-figure-6008]

## Infrastructure preparation

We'll install a new SAP SID **PR2**, in addition to the **existing clustered** SAP **PR1** ASCS/SCS instance.  

### Host names and IP addresses

Based on your deployment type, the host names and the IP addresses of the scenario would be like:

**SAP deployment in Azure availability set**

| Host name role                                        | Host name   | Static IP address                        | Availability set | Disk SkuName |
| ----------------------------------------------------- | ----------- | ---------------------------------------- | ---------------- | ------------ |
| 1st cluster node ASCS/SCS cluster                     | pr1-ascs-10 | 10.0.0.4                                 | pr1-ascs-avset   | Premium_LRS  |
| 2nd cluster node ASCS/SCS cluster                     | pr1-ascs-11 | 10.0.0.5                                 | pr1-ascs-avset   |              |
| Cluster Network Name                                  | pr1clust    | 10.0.0.42(**only** for Win 2016 cluster) | n/a              |              |
| **SID1** ASCS cluster network name                    | pr1-ascscl  | 10.0.0.43                                | n/a              |              |
| **SID1** ERS cluster network name (**only** for ERS2) | pr1-erscl   | 10.0.0.44                                | n/a              |              |
| **SID2** ASCS cluster network name                    | pr2-ascscl  | 10.0.0.45                                | n/a              |              |
| **SID2** ERS cluster network name (**only** for ERS2) | pr1-erscl   | 10.0.0.46                                | n/a              |              |

**SAP deployment in Azure availability zones**

| Host name role                                        | Host name   | Static IP address                        | Availability zone | Disk SkuName |
| ----------------------------------------------------- | ----------- | ---------------------------------------- | ----------------- | ------------ |
| 1st cluster node ASCS/SCS cluster                     | pr1-ascs-10 | 10.0.0.4                                 | AZ01              | Premium_ZRS  |
| 2nd cluster node ASCS/SCS cluster                     | pr1-ascs-11 | 10.0.0.5                                 | AZ02              |              |
| Cluster Network Name                                  | pr1clust    | 10.0.0.42(**only** for Win 2016 cluster) | n/a               |              |
| **SID1** ASCS cluster network name                    | pr1-ascscl  | 10.0.0.43                                | n/a               |              |
| **SID2** ERS cluster network name (**only** for ERS2) | pr1-erscl   | 10.0.0.44                                | n/a               |              |
| **SID2** ASCS cluster network name                    | pr2-ascscl  | 10.0.0.45                                | n/a               |              |
| **SID2** ERS cluster network name (**only** for ERS2) | pr1-erscl   | 10.0.0.46                                | n/a               |              |

The steps mentioned in the document remain same for both deployment type. But if your cluster is running in availability set, you need to deploy LRS for Azure  premium shared disk (Premium_LRS) and if cluster is running in availability zone deploy ZRS for Azure premium shared disk (Premium_ZRS). 

### Create Azure internal load balancer

SAP ASCS, SAP SCS, and the new SAP ERS2, use virtual hostname and virtual IP addresses. On Azure a [load balancer](../../load-balancer/load-balancer-overview.md) is required to use a virtual IP address. 
We strongly recommend using [Standard load balancer](../../load-balancer/quickstart-load-balancer-standard-public-portal.md). 

You will need to add configuration to the existing load balancer for the second SAP SID ASCS/SCS/ERS instance **PR2**. The configuration for the first SAP SID **PR1** should be already in place.  

**(A)SCS PR2 [instance number 02]**
- Frontend configuration
    - Static ASCS/SCS IP address **10.0.0.45**
- Backend configuration  
    Already be in place - the VMs were already added to the backend pool, while configuring for SAP SID **PR1**
- Probe Port
    - Port 620**nr** [**62002**]
    Leave the default option for Protocol (TCP), Interval (5), Unhealthy threshold (2)
- Load-balancing rules
    - If using Standard Load Balancer, select HA ports
    - If using Basic Load Balancer, create Load-balancing rules for the following ports
        - 32**nr** TCP [**3202**]
        - 36**nr** TCP [**3602**]
        - 39**nr** TCP [**3902**]
        - 81**nr** TCP [**8102**]
        - 5**nr**13 TCP [**50213**]
        - 5**nr**14 TCP [**50214**]
        - 5**nr**16 TCP [**50216**]
        - Associate with the **PR2** ASCS Frontend IP, health probe, and the existing backend pool.  

    - Make sure that Idle timeout (minutes) is set to the maximum value 30, and that Floating IP (direct server return) is Enabled.

**ERS2 PR2 [instance number 12]** 

As Enqueue Replication Server 2 (ERS2) is also clustered, ERS2 virtual IP address must be also configured on Azure ILB in addition to above SAP ASCS/SCS IP. This section only applies, if using Enqueue replication server 2 architecture for **PR2**.  
- New Frontend configuration
    - Static SAP ERS2 IP address **10.0.0.46**

- Backend configuration  
  The VMs were already added to the ILB backend pool.  

- New Probe Port
    - Port 621**nr**  [**62112**]
    Leave the default option for Protocol (TCP), Interval (5), Unhealthy threshold (2)

- New Load-balancing rules
    - If using Standard Load Balancer, select HA ports
    - If using Basic Load Balancer, create Load-balancing rules for the following ports
        - 32**nr** TCP [**3212**]
        - 33**nr** TCP [**3312**]
        - 5**nr**13 TCP [**51212**]
        - 5**nr**14 TCP [**51212**]
        - 5**nr**16 TCP [**51212**]
        - Associate with the **PR2** ERS2 Frontend IP, health probe and the existing backend pool.  

    - Make sure that Idle timeout (minutes) is set to max value, e.g.,  30, and that Floating IP (direct server return) is Enabled.


### Create and attach second Azure shared disk

Run this command on one of the cluster nodes. You will need to adjust the values for your resource group, Azure region, SAPSID, and so on.  

```powershell
$ResourceGroupName = "MyResourceGroup"
$location = "MyRegion"
$SAPSID = "PR2"
$DiskSizeInGB = 512
$DiskName = "$($SAPSID)ASCSSharedDisk"
$NumberOfWindowsClusterNodes = 2

# For SAP deployment in availability set, use below storage SkuName
$SkuName = "Premium_LRS"
# For SAP deployment in availability zone, use below storage SkuName
$SkuName = "Premium_ZRS"

$diskConfig = New-AzDiskConfig -Location $location -SkuName $SkuName  -CreateOption Empty  -DiskSizeGB $DiskSizeInGB -MaxSharesCount $NumberOfWindowsClusterNodes
    
$dataDisk = New-AzDisk -ResourceGroupName $ResourceGroupName -DiskName $DiskName -Disk $diskConfig
##################################
## Attach the disk to cluster VMs
##################################
# ASCS Cluster VM1
$ASCSClusterVM1 = "pr1-ascs-10"
# ASCS Cluster VM2
$ASCSClusterVM2 = "pr1-ascs-11"
# next free LUN number
$LUNNumber = 1

# Add the Azure Shared Disk to Cluster Node 1
$vm = Get-AzVM -ResourceGroupName $ResourceGroupName -Name $ASCSClusterVM1 
$vm = Add-AzVMDataDisk -VM $vm -Name $DiskName -CreateOption Attach -ManagedDiskId $dataDisk.Id -Lun $LUNNumber
Update-AzVm -VM $vm -ResourceGroupName $ResourceGroupName -Verbose

# Add the Azure Shared Disk to Cluster Node 2
$vm = Get-AzVM -ResourceGroupName $ResourceGroupName -Name $ASCSClusterVM2
$vm = Add-AzVMDataDisk -VM $vm -Name $DiskName -CreateOption Attach -ManagedDiskId $dataDisk.Id -Lun $LUNNumber
Update-AzVm -VM $vm -ResourceGroupName $ResourceGroupName -Verbose
```

### Format the shared disk with PowerShell
1. Get the disk number. Run the PowerShell commands on one of the cluster nodes:

   ```powershell
    Get-Disk | Where-Object PartitionStyle -Eq "RAW"  | Format-Table -AutoSize 
    # Example output
    # Number Friendly Name     Serial Number HealthStatus OperationalStatus Total Size Partition Style
    # ------ -------------     ------------- ------------ ----------------- ---------- ---------------
    # 3      Msft Virtual Disk               Healthy      Online                512 GB RAW            

   ```
2. Format the disk. In this example, it is disk number 3. 

   ```powershell
    # Format SAP ASCS Disk number '3', with drive letter 'S'
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

3. Verify that the disk is now visible as a cluster disk.  
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

4. Register the disk in the cluster.  
   ```powershell
    # Add the disk to cluster 
    Get-ClusterAvailableDisk -All | Add-ClusterDisk
    # Example output 
    # Name           State  OwnerGroup        ResourceType 
    # ----           -----  ----------        ------------ 
    # Cluster Disk 2 Online Available Storage Physical Disk
   ```

## Create a virtual host name for the clustered SAP ASCS/SCS instance

1. Create a DNS entry for the virtual host name for new the SAP ASCS/SCS instance in the Windows DNS manager.  
   The IP address you assign to the virtual host name in DNS must be the same as the IP address you assigned in Azure Load Balancer.  

   ![_Define the DNS entry for the SAP ASCS/SCS cluster virtual name and IP address][sap-ha-guide-figure-6009]
 
   _Define the DNS entry for the SAP ASCS/SCS cluster virtual name and IP address_

2. If using SAP Enqueue Replication Server 2, which is also clustered instance, then you need to reserve in DNS a virtual host name for ERS2 as well. 
   The IP address you assign to the virtual host name for ERS2 in DNS must be the same as the IP address you assigned in Azure Load Balancer.  

   ![_Define the DNS entry for the SAP ERS2 cluster virtual name and IP address][sap-ha-guide-figure-6010]
 
   _Define the DNS entry for the SAP ERS2 cluster virtual name and IP address_

3. To define the IP address that's assigned to the virtual host name, select **DNS Manager** > **Domain**.

   ![New virtual name and IP address for SAP ASCS/SCS and ERS2 cluster configuration][sap-ha-guide-figure-6011]

   _New virtual name and TCP/IP address for SAP ASCS/SCS and ERS2 cluster configuration_

## SAP Installation 

### Install the SAP first cluster node

Follow the SAP described installation procedure. Make sure in the start installation option "First Cluster Node", and to choose "Cluster Shared Disk" as configuration option.  
Choose the newly create shared disk.  

### Modify the SAP profile of the ASCS/SCS instance

If you are running Enqueue Replication Server 1, add  SAP profile parameter `enque/encni/set_so_keepalive` as described below. The profile parameter prevents connections between SAP work processes and the enqueue server from closing when they are idle for too long. The SAP parameter  is not required for ERS2. 

1. Add this profile parameter to the SAP ASCS/SCS instance profile, if using ERS1.

   ```
   enque/encni/set_so_keepalive = true
   ```
   
   For both ERS1 and ERS2, make sure that the `keepalive` OS parameters are set as described in SAP note [1410736](https://launchpad.support.sap.com/#/notes/1410736).   

2. To apply the SAP profile parameter changes, restart the SAP ASCS/SCS instance.

### Configure probe port on the cluster resource

Use the internal load balancer's probe functionality to make the entire cluster configuration work with Azure Load Balancer. The Azure internal load balancer usually distributes the incoming workload equally between participating virtual machines.

However, this won't work in some cluster configurations because only one instance is active. The other instance is passive and can't accept any of the workload. A probe functionality helps when the Azure internal load balancer detects which instance is active, and only target the active instance.  

> [!IMPORTANT]
> In this example configuration, the **ProbePort** is set to 620**Nr**. For SAP ASCS instance with number **02** it is 620**02**.
> You will need to adjust the configuration to match your SAP instance numbers and your SAP SID.

To add a probe port, run this PowerShell Module on one of the cluster VMs:

- In the case of SAP ASC/SCS Instance with instance number **02** 
   ```powershell
   Set-AzureLoadBalancerHealthCheckProbePortOnSAPClusterIPResource -SAPSID PR2 -ProbePort 62002
   ```

- If using ERS2, with instance number **12**, which is clustered. There is no need to configure probe port for ERS1, as it is not clustered.  
   ```powershell
   Set-AzureLoadBalancerHealthCheckProbePortOnSAPClusterIPResource -SAPSID PR2 -ProbePort 62012 -IsSAPERSClusteredInstance $True
   ```

 The code for function `Set-AzureLoadBalancerHealthCheckProbePortOnSAPClusterIPResource` would look like:
   ```powershell
    function Set-AzureLoadBalancerHealthCheckProbePortOnSAPClusterIPResource {
    <#
    .SYNOPSIS 
    Set-AzureLoadBalancerHealthProbePortOnSAPClusterIPResource will set a new Azure Load Balancer Health Probe Port on 'SAP $SAPSID IP' cluster resource.
    
    .DESCRIPTION
    Set-AzureLoadBalancerHealthProbePortOnSAPClusterIPResource will set a new Azure Load Balancer Health Probe Port on 'SAP $SAPSID IP' cluster resource.
    It will also restart SAP Cluster group (default behavior), to activate the changes. 
    
    You need to run it on one of the SAP ASCS/SCS Windows cluster nodes.
    
    Expectation is that SAP group is installed with official SWPM installation tool, which will set default expected naming convention for:
    - SAP Cluster Group:               'SAP $SAPSID'
    - SAP Cluster IP Address Resource: 'SAP $SAPSID IP' 
    
    .PARAMETER SAPSID 
    SAP SID - 3 characters staring with letter.
    
    .PARAMETER ProbePort 
    Azure Load Balancer Health Check Probe Port.
    
    .PARAMETER RestartSAPClusterGroup 
    Optional parameter. Default value is '$True', so SAP cluster group will be restarted to activate the changes.
    
    .PARAMETER IsSAPERSClusteredInstance 
    Optional parameter.Default value is '$False'.
    If set to $True , then handle clsutered new SAP ERS2 instance.
    
    
    .EXAMPLE 
    # Set probe port to 62000, on SAP cluster resource 'SAP AB1 IP', and restart the SAP cluster group 'SAP AB1', to activate the changes.
    Set-AzureLoadBalancerHealthCheckProbePortOnSAPClusterIPResource -SAPSID AB1 -ProbePort 62000 
    
    .EXAMPLE 
    # Set probe port to 62000, on SAP cluster resource 'SAP AB1 IP'. SAP cluster group 'SAP AB1' IS NOT restarted, therefore changes are NOT active.
    # To activate the changes you need to manually restart 'SAP AB1' cluster group.
    Set-AzureLoadBalancerHealthCheckProbePortOnSAPClusterIPResource -SAPSID AB1 -ProbePort 62000 -RestartSAPClusterGroup $False
    
    .EXAMPLE 
    # Set probe port to 62001, on SAP cluster resource 'SAP AB1 ERS IP'. SAP cluster group 'SAP AB1 ERS' IS restarted, to activate the changes.
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
                    #Handle clustered SAP ERS Instance
                    $SAPClusterRoleName = "SAP $SAPSID ERS"
                    $SAPIPresourceName = "SAP $SAPSID ERS IP"            
                }else{
                    #Handle clustered SAP ASCS/SCS Instance
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

1. Install the database instance, by following the process that's described in the SAP installation guide.  
2. Install SAP on the second cluster node by following the steps that are described in the SAP installation guide.  
3. Install the SAP Primary Application Server (PAS) instance on the virtual machine that you've designated to host the PAS.   
   Follow the process described in the SAP installation guide. There are no dependencies on Azure.
4. Install additional SAP application servers on the virtual machines, designated to host SAP Application server instances.  
   Follow the process described in the SAP installation guide. There are no dependencies on Azure. 

## Test the SAP ASCS/SCS instance failover
For the outlined failover tests, we assume that SAP ASCS is active on node A.  

1. Verify that the SAP system can successfully fail over from node A to node B. In this example, the test is done for SAPSID **PR2**.  
   Make sure that each of SAPSID can successfully move to the other cluster node.   
   Choose one of these options to initiate a failover of the SAP \<SID\> cluster group from cluster node A to cluster node B:
    - Failover Cluster Manager  
    - Failover Cluster PowerShell

    ```powershell
    $SAPSID = "PR2"     # SAP <SID>
 
    $SAPClusterGroup = "SAP $SAPSID"
    Move-ClusterGroup -Name $SAPClusterGroup

    ```
2. Restart cluster node A within the Windows guest operating system. This initiates an automatic failover of the SAP \<SID\> cluster group from node A to node B.  
3. Restart cluster node A from the Azure portal. This initiates an automatic failover of the SAP \<SID\> cluster group from node A to node B.  
4. Restart cluster node A by using Azure PowerShell. This initiates an automatic failover of the SAP \<SID\> cluster group from node A to node B.

## Next steps

* [Prepare the Azure infrastructure for SAP HA by using a Windows  failover cluster and shared disk for an SAP ASCS/SCS instance][sap-high-availability-infrastructure-wsfc-shared-disk]
* [Install SAP NetWeaver HA on a Windows failover cluster and shared disk for an SAP ASCS/SCS instance][sap-high-availability-installation-wsfc-shared-disk]


[1928533]:https://launchpad.support.sap.com/#/notes/1928533
[1999351]:https://launchpad.support.sap.com/#/notes/1999351
[2015553]:https://launchpad.support.sap.com/#/notes/2015553
[2178632]:https://launchpad.support.sap.com/#/notes/2178632
[2243692]:https://launchpad.support.sap.com/#/notes/2243692
[1869038]:https://launchpad.support.sap.com/#/notes/1869038
[2287140]:https://launchpad.support.sap.com/#/notes/2287140
[2492395]:https://launchpad.support.sap.com/#/notes/2492395

[sap-installation-guides]:http://service.sap.com/instguides

[azure-resource-manager/management/azure-subscription-service-limits]:../../azure-resource-manager/management/azure-subscription-service-limits.md
[azure-resource-manager/management/azure-subscription-service-limits-subscription]:../../azure-resource-manager/management/azure-subscription-service-limits.md
[networking-limits-azure-resource-manager]:../../azure-resource-manager/management/azure-subscription-service-limits.md#azure-resource-manager-virtual-networking-limits
[load-balancer-multivip-overview]:../../load-balancer/load-balancer-multivip-overview.md


[sap-net-weaver-ports]:https://help.sap.com/viewer/ports
[sap-high-availability-architecture-scenarios]:sap-high-availability-architecture-scenarios.md
[sap-high-availability-guide-wsfc-shared-disk]:sap-high-availability-guide-wsfc-shared-disk.md
[sap-high-availability-guide-wsfc-file-share]:sap-high-availability-guide-wsfc-file-share.md
[sap-ascs-high-availability-multi-sid-wsfc]:sap-ascs-high-availability-multi-sid-wsfc.md
[sap-high-availability-infrastructure-wsfc-shared-disk]:sap-high-availability-infrastructure-wsfc-shared-disk.md
[sap-high-availability-installation-wsfc-shared-disk]:sap-high-availability-installation-wsfc-shared-disk.md
[sap-hana-ha]:sap-hana-high-availability.md
[sap-suse-ascs-ha]:high-availability-guide-suse.md
[sap-net-weaver-ports-ascs-scs-ports]:sap-high-availability-infrastructure-wsfc-shared-disk.md#fe0bd8b5-2b43-45e3-8295-80bee5415716

[dbms-guide]:../../virtual-machines-windows-sap-dbms-guide-general.md

[deployment-guide]:deployment-guide.md

[dr-guide-classic]:https://go.microsoft.com/fwlink/?LinkID=521971

[getting-started]:get-started.md

[planning-guide]:planning-guide.md
[planning-guide-11]:planning-guide.md
[planning-guide-2.1]:planning-guide.md#1625df66-4cc6-4d60-9202-de8a0b77f803
[planning-guide-2.2]:planning-guide.md#f5b3b18c-302c-4bd8-9ab2-c388f1ab3d10

[planning-guide-microsoft-azure-networking]:planning-guide.md#61678387-8868-435d-9f8c-450b2424f5bd
[planning-guide-storage-microsoft-azure-storage-and-data-disks]:planning-guide.md#a72afa26-4bf4-4a25-8cf7-855d6032157f

[sap-high-availability-architecture-scenarios]:sap-high-availability-architecture-scenarios.md
[sap-high-availability-guide-wsfc-shared-disk]:sap-high-availability-guide-wsfc-shared-disk.md
[sap-high-availability-guide-wsfc-file-share]:sap-high-availability-guide-wsfc-file-share.md
[sap-ascs-high-availability-multi-sid-wsfc]:sap-ascs-high-availability-multi-sid-wsfc.md
[sap-high-availability-infrastructure-wsfc-shared-disk]:sap-high-availability-infrastructure-wsfc-shared-disk.md
[sap-high-availability-infrastructure-wsfc-file-share]:sap-high-availability-infrastructure-wsfc-file-share.md

[sap-high-availability-installation-wsfc-shared-disk]:sap-high-availability-installation-wsfc-shared-disk.md
[sap-high-availability-installation-wsfc-shared-disk-install-ascs]:sap-high-availability-installation-wsfc-shared-disk.md#31c6bd4f-51df-4057-9fdf-3fcbc619c170
[sap-high-availability-installation-wsfc-shared-disk-modify-ascs-profile]:sap-high-availability-installation-wsfc-shared-disk.md#e4caaab2-e90f-4f2c-bc84-2cd2e12a9556
[sap-high-availability-installation-wsfc-shared-disk-add-probe-port]:sap-high-availability-installation-wsfc-shared-disk.md#10822f4f-32e7-4871-b63a-9b86c76ce761
[sap-high-availability-installation-wsfc-shared-disk-win-firewall-probe-port]:sap-high-availability-installation-wsfc-shared-disk.md#4498c707-86c0-4cde-9c69-058a7ab8c3ac
[sap-high-availability-installation-wsfc-shared-disk-change-ers-service-startup-type]:sap-high-availability-installation-wsfc-shared-disk.md#094bc895-31d4-4471-91cc-1513b64e406a
[sap-high-availability-installation-wsfc-shared-disk-test-ascs-failover-and-sios-repl]:sap-high-availability-installation-wsfc-shared-disk.md#18aa2b9d-92d2-4c0e-8ddd-5acaabda99e9


[sap-high-availability-installation-wsfc-file-share]:sap-high-availability-installation-wsfc-file-share.md
[sap-high-availability-infrastructure-wsfc-shared-disk-install-sios]:sap-high-availability-infrastructure-wsfc-shared-disk.md#5c8e5482-841e-45e1-a89d-a05c0907c868

[Logo_Linux]:media/virtual-machines-shared-sap-shared/Linux.png
[Logo_Windows]:media/virtual-machines-shared-sap-shared/Windows.png

[sap-ha-guide-figure-1000]:./media/virtual-machines-shared-sap-high-availability-guide/1000-wsfc-for-sap-ascs-on-azure.png
[sap-ha-guide-figure-1001]:./media/virtual-machines-shared-sap-high-availability-guide/1001-wsfc-on-azure-ilb.png
[sap-ha-guide-figure-1002]:./media/virtual-machines-shared-sap-high-availability-guide/1002-wsfc-sios-on-azure-ilb.png
[sap-ha-guide-figure-2000]:./media/virtual-machines-shared-sap-high-availability-guide/2000-wsfc-sap-as-ha-on-azure.png
[sap-ha-guide-figure-2001]:./media/virtual-machines-shared-sap-high-availability-guide/2001-wsfc-sap-ascs-ha-on-azure.png
[sap-ha-guide-figure-2003]:./media/virtual-machines-shared-sap-high-availability-guide/2003-wsfc-sap-dbms-ha-on-azure.png
[sap-ha-guide-figure-2004]:./media/virtual-machines-shared-sap-high-availability-guide/2004-wsfc-sap-ha-e2e-archit-template1-on-azure.png
[sap-ha-guide-figure-2005]:./media/virtual-machines-shared-sap-high-availability-guide/2005-wsfc-sap-ha-e2e-arch-template2-on-azure.png

[sap-ha-guide-figure-3000]:./media/virtual-machines-shared-sap-high-availability-guide/3000-template-parameters-sap-ha-arm-on-azure.png
[sap-ha-guide-figure-3001]:./media/virtual-machines-shared-sap-high-availability-guide/3001-configuring-dns-servers-for-Azure-vnet.png
[sap-ha-guide-figure-3002]:./media/virtual-machines-shared-sap-high-availability-guide/3002-configuring-static-IP-address-for-network-card-of-each-vm.png
[sap-ha-guide-figure-3003]:./media/virtual-machines-shared-sap-high-availability-guide/3003-setup-static-ip-address-ilb-for-ascs-instance.png
[sap-ha-guide-figure-3004]:./media/virtual-machines-shared-sap-high-availability-guide/3004-default-ascs-scs-ilb-balancing-rules-for-azure-ilb.png
[sap-ha-guide-figure-3005]:./media/virtual-machines-shared-sap-high-availability-guide/3005-changing-ascs-scs-default-ilb-rules-for-azure-ilb.png
[sap-ha-guide-figure-3006]:./media/virtual-machines-shared-sap-high-availability-guide/3006-adding-vm-to-domain.png
[sap-ha-guide-figure-3007]:./media/virtual-machines-shared-sap-high-availability-guide/3007-config-wsfc-1.png
[sap-ha-guide-figure-3008]:./media/virtual-machines-shared-sap-high-availability-guide/3008-config-wsfc-2.png
[sap-ha-guide-figure-3009]:./media/virtual-machines-shared-sap-high-availability-guide/3009-config-wsfc-3.png
[sap-ha-guide-figure-3010]:./media/virtual-machines-shared-sap-high-availability-guide/3010-config-wsfc-4.png
[sap-ha-guide-figure-3011]:./media/virtual-machines-shared-sap-high-availability-guide/3011-config-wsfc-5.png
[sap-ha-guide-figure-3012]:./media/virtual-machines-shared-sap-high-availability-guide/3012-config-wsfc-6.png
[sap-ha-guide-figure-3013]:./media/virtual-machines-shared-sap-high-availability-guide/3013-config-wsfc-7.png
[sap-ha-guide-figure-3014]:./media/virtual-machines-shared-sap-high-availability-guide/3014-config-wsfc-8.png
[sap-ha-guide-figure-3015]:./media/virtual-machines-shared-sap-high-availability-guide/3015-config-wsfc-9.png
[sap-ha-guide-figure-3016]:./media/virtual-machines-shared-sap-high-availability-guide/3016-config-wsfc-10.png
[sap-ha-guide-figure-3017]:./media/virtual-machines-shared-sap-high-availability-guide/3017-config-wsfc-11.png
[sap-ha-guide-figure-3018]:./media/virtual-machines-shared-sap-high-availability-guide/3018-config-wsfc-12.png
[sap-ha-guide-figure-3019]:./media/virtual-machines-shared-sap-high-availability-guide/3019-assign-permissions-on-share-for-cluster-name-object.png
[sap-ha-guide-figure-3020]:./media/virtual-machines-shared-sap-high-availability-guide/3020-change-object-type-include-computer-objects.png
[sap-ha-guide-figure-3021]:./media/virtual-machines-shared-sap-high-availability-guide/3021-check-box-for-computer-objects.png
[sap-ha-guide-figure-3022]:./media/virtual-machines-shared-sap-high-availability-guide/3022-set-security-attributes-for-cluster-name-object-on-file-share-quorum.png
[sap-ha-guide-figure-3023]:./media/virtual-machines-shared-sap-high-availability-guide/3023-call-configure-cluster-quorum-setting-wizard.png
[sap-ha-guide-figure-3024]:./media/virtual-machines-shared-sap-high-availability-guide/3024-selection-screen-different-quorum-configurations.png
[sap-ha-guide-figure-3025]:./media/virtual-machines-shared-sap-high-availability-guide/3025-selection-screen-file-share-witness.png
[sap-ha-guide-figure-3026]:./media/virtual-machines-shared-sap-high-availability-guide/3026-define-file-share-location-for-witness-share.png
[sap-ha-guide-figure-3027]:./media/virtual-machines-shared-sap-high-availability-guide/3027-successful-reconfiguration-cluster-file-share-witness.png
[sap-ha-guide-figure-3028]:./media/virtual-machines-shared-sap-high-availability-guide/3028-install-dot-net-framework-35.png
[sap-ha-guide-figure-3029]:./media/virtual-machines-shared-sap-high-availability-guide/3029-install-dot-net-framework-35-progress.png
[sap-ha-guide-figure-3030]:./media/virtual-machines-shared-sap-high-availability-guide/3030-sios-installer.png
[sap-ha-guide-figure-3031]:./media/virtual-machines-shared-sap-high-availability-guide/3031-first-screen-sios-data-keeper-installation.png
[sap-ha-guide-figure-3032]:./media/virtual-machines-shared-sap-high-availability-guide/3032-data-keeper-informs-service-be-disabled.png
[sap-ha-guide-figure-3033]:./media/virtual-machines-shared-sap-high-availability-guide/3033-user-selection-sios-data-keeper.png
[sap-ha-guide-figure-3034]:./media/virtual-machines-shared-sap-high-availability-guide/3034-domain-user-sios-data-keeper.png
[sap-ha-guide-figure-3035]:./media/virtual-machines-shared-sap-high-availability-guide/3035-provide-sios-data-keeper-license.png
[sap-ha-guide-figure-3036]:./media/virtual-machines-shared-sap-high-availability-guide/3036-data-keeper-management-config-tool.png
[sap-ha-guide-figure-3037]:./media/virtual-machines-shared-sap-high-availability-guide/3037-tcp-ip-address-first-node-data-keeper.png
[sap-ha-guide-figure-3038]:./media/virtual-machines-shared-sap-high-availability-guide/3038-create-replication-sios-job.png
[sap-ha-guide-figure-3039]:./media/virtual-machines-shared-sap-high-availability-guide/3039-define-sios-replication-job-name.png
[sap-ha-guide-figure-3040]:./media/virtual-machines-shared-sap-high-availability-guide/3040-define-sios-source-node.png
[sap-ha-guide-figure-3041]:./media/virtual-machines-shared-sap-high-availability-guide/3041-define-sios-target-node.png
[sap-ha-guide-figure-3042]:./media/virtual-machines-shared-sap-high-availability-guide/3042-define-sios-synchronous-replication.png
[sap-ha-guide-figure-3043]:./media/virtual-machines-shared-sap-high-availability-guide/3043-enable-sios-replicated-volume-as-cluster-volume.png
[sap-ha-guide-figure-3044]:./media/virtual-machines-shared-sap-high-availability-guide/3044-data-keeper-synchronous-mirroring-for-SAP-gui.png
[sap-ha-guide-figure-3045]:./media/virtual-machines-shared-sap-high-availability-guide/3045-replicated-disk-by-data-keeper-in-wsfc.png
[sap-ha-guide-figure-3046]:./media/virtual-machines-shared-sap-high-availability-guide/3046-dns-entry-sap-ascs-virtual-name-ip.png
[sap-ha-guide-figure-3047]:./media/virtual-machines-shared-sap-high-availability-guide/3047-dns-manager.png
[sap-ha-guide-figure-3048]:./media/virtual-machines-shared-sap-high-availability-guide/3048-default-cluster-probe-port.png
[sap-ha-guide-figure-3049]:./media/virtual-machines-shared-sap-high-availability-guide/3049-cluster-probe-port-after.png
[sap-ha-guide-figure-3050]:./media/virtual-machines-shared-sap-high-availability-guide/3050-service-type-ers-delayed-automatic.png
[sap-ha-guide-figure-5000]:./media/virtual-machines-shared-sap-high-availability-guide/5000-wsfc-sap-sid-node-a.png
[sap-ha-guide-figure-5001]:./media/virtual-machines-shared-sap-high-availability-guide/5001-sios-replicating-local-volume.png
[sap-ha-guide-figure-5002]:./media/virtual-machines-shared-sap-high-availability-guide/5002-wsfc-sap-sid-node-b.png
[sap-ha-guide-figure-5003]:./media/virtual-machines-shared-sap-high-availability-guide/5003-sios-replicating-local-volume-b-to-a.png

[sap-ha-guide-figure-6001]:media/virtual-machines-shared-sap-high-availability-guide/6001-sap-multi-sid-ascs-scs-sid1.png
[sap-ha-guide-figure-6002]:media/virtual-machines-shared-sap-high-availability-guide/6002-sap-multi-sid-ascs-scs.png
[sap-ha-guide-figure-6003]:media/virtual-machines-shared-sap-high-availability-guide/6003-sap-multi-sid-full-landscape.png
[sap-ha-guide-figure-6004]:media/virtual-machines-shared-sap-high-availability-guide/6004-sap-multi-sid-dns.png
[sap-ha-guide-figure-6005]:media/virtual-machines-shared-sap-high-availability-guide/6005-sap-multi-sid-azure-portal.png
[sap-ha-guide-figure-6006]:media/virtual-machines-shared-sap-high-availability-guide/6006-sap-multi-sid-sios-replication.png

[sap-ha-guide-figure-6007]:media/virtual-machines-shared-sap-high-availability-guide/6007-sap-multi-sid-ascs-azure-shared-disk-sid-1.png
[sap-ha-guide-figure-6008]:media/virtual-machines-shared-sap-high-availability-guide/6008-sap-multi-sid-ascs-azure-shared-disk-sid-2.png
[sap-ha-guide-figure-6009]:media/virtual-machines-shared-sap-high-availability-guide/6009-sap-multi-sid-ascs-azure-shared-disk-dns1.png
[sap-ha-guide-figure-6010]:media/virtual-machines-shared-sap-high-availability-guide/6010-sap-multi-sid-ascs-azure-shared-disk-dns2.png
[sap-ha-guide-figure-6011]:media/virtual-machines-shared-sap-high-availability-guide/6011-sap-multi-sid-ascs-azure-shared-disk-dns3.png

[sap-ha-guide-figure-8001]:./media/virtual-machines-shared-sap-high-availability-guide/8001.png
[sap-ha-guide-figure-8002]:./media/virtual-machines-shared-sap-high-availability-guide/8002.png
[sap-ha-guide-figure-8003]:./media/virtual-machines-shared-sap-high-availability-guide/8003.png
[sap-ha-guide-figure-8004]:./media/virtual-machines-shared-sap-high-availability-guide/8004.png
[sap-ha-guide-figure-8005]:./media/virtual-machines-shared-sap-high-availability-guide/8005.png
[sap-ha-guide-figure-8006]:./media/virtual-machines-shared-sap-high-availability-guide/8006.png
[sap-ha-guide-figure-8007]:./media/virtual-machines-shared-sap-high-availability-guide/8007.png
[sap-ha-guide-figure-8008]:./media/virtual-machines-shared-sap-high-availability-guide/8008.png
[sap-ha-guide-figure-8009]:./media/virtual-machines-shared-sap-high-availability-guide/8009.png
[sap-ha-guide-figure-8010]:./media/virtual-machines-shared-sap-high-availability-guide/8010.png
[sap-ha-guide-figure-8011]:./media/virtual-machines-shared-sap-high-availability-guide/8011.png
[sap-ha-guide-figure-8012]:./media/virtual-machines-shared-sap-high-availability-guide/8012.png
[sap-ha-guide-figure-8013]:./media/virtual-machines-shared-sap-high-availability-guide/8013.png
[sap-ha-guide-figure-8014]:./media/virtual-machines-shared-sap-high-availability-guide/8014.png
[sap-ha-guide-figure-8015]:./media/virtual-machines-shared-sap-high-availability-guide/8015.png
[sap-ha-guide-figure-8016]:./media/virtual-machines-shared-sap-high-availability-guide/8016.png
[sap-ha-guide-figure-8017]:./media/virtual-machines-shared-sap-high-availability-guide/8017.png
[sap-ha-guide-figure-8018]:./media/virtual-machines-shared-sap-high-availability-guide/8018.png
[sap-ha-guide-figure-8019]:./media/virtual-machines-shared-sap-high-availability-guide/8019.png
[sap-ha-guide-figure-8020]:./media/virtual-machines-shared-sap-high-availability-guide/8020.png
[sap-ha-guide-figure-8021]:./media/virtual-machines-shared-sap-high-availability-guide/8021.png
[sap-ha-guide-figure-8022]:./media/virtual-machines-shared-sap-high-availability-guide/8022.png
[sap-ha-guide-figure-8023]:./media/virtual-machines-shared-sap-high-availability-guide/8023.png
[sap-ha-guide-figure-8024]:./media/virtual-machines-shared-sap-high-availability-guide/8024.png
[sap-ha-guide-figure-8025]:./media/virtual-machines-shared-sap-high-availability-guide/8025.png


[sap-templates-3-tier-multisid-xscs-marketplace-image]:https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fsap-3-tier-marketplace-image-multi-sid-xscs%2Fazuredeploy.json
[sap-templates-3-tier-multisid-xscs-marketplace-image-md]:https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fapplication-workloads%2Fsap%2Fsap-3-tier-marketplace-image-multi-sid-xscs-md%2Fazuredeploy.json
[sap-templates-3-tier-multisid-db-marketplace-image]:https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fsap-3-tier-marketplace-image-multi-sid-db%2Fazuredeploy.json
[sap-templates-3-tier-multisid-db-marketplace-image-md]:https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fapplication-workloads%2Fsap%2Fsap-3-tier-marketplace-image-multi-sid-db-md%2Fazuredeploy.json
[sap-templates-3-tier-multisid-apps-marketplace-image]:https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fsap-3-tier-marketplace-image-multi-sid-apps%2Fazuredeploy.json
[sap-templates-3-tier-multisid-apps-marketplace-image-md]:https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fapplication-workloads%2Fsap%2Fsap-3-tier-marketplace-image-multi-sid-apps-md%2Fazuredeploy.json

[virtual-machines-azure-resource-manager-architecture-benefits-arm]:../../azure-resource-manager/management/overview.md#the-benefits-of-using-resource-manager

[virtual-machines-manage-availability]:../../virtual-machines/availability.md
