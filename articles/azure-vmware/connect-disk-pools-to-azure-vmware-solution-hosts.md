---
title: Connect disk pools to Azure VMware Solution hosts
description: Learn how to scale Azure VMware Solution hosts using disk pools instead of scaling clusters. You can use block storage for active working sets and tier less frequently accessed data from vSAN to disks. You can also replicate data from on-premises or primary VMware environment to disk storage for the secondary site.
ms.topic: how-to 
ms.date: 06/28/2021

#Customer intent: As an Azure service administrator, I want to scale my AVS hosts using disk pools instead of scaling clusters. So that I can use block storage for active working sets, which is an extension of vSAN, and to tier less frequently accessed data from vSAN to disks. I can also replicate data from on-premises or primary VMware environment to disk storage for the secondary site.  

---

# Connect disk pools to Azure VMware Solution hosts

[Azure disk pools](../virtual-machines/disks-pools.md) offer persistent block storage to applications and workloads backed by Azure Disks. You can use disks as the persistent storage for Azure VMWare Solution for optimal cost and performance. For example, if you host data-intensive workloads, you can scale up by using disk pools instead of scaling clusters. You can also use disks to replicate data from on-premises or primary VMware environment to disk storage for the secondary site.

Azure Disks are attached to the managed iSCSI controller, a virtual machine deployed under the managed resource group. Disks get deployed as storage targets to a disk pool, and each storage target shows as an iSCSI LUN under the iSCSI target. You can expose a disk pool as an iSCSI target connected to Azure VMware Solution hosts as a datastore. A disk pool surfaces as a single endpoint for all underlying disks added as storage targets. Each disk pool can have only one iSCSI controller.

>[!TIP]
>To scale storage independent of the Azure VMware Solution hosts, we support surfacing Azure and [Premium Disks](/azure/virtual-machines/disks-types#premium-ssd) as the datastores.

The diagram shows how disk pools work with Azure VMware Solution hosts. Each iSCSI controller can access each managed disk over iSCSI, and the Azure VMware Solution hosts can access the iSCSI controller over iSCSI.


:::image type="content" source="media/disk-pools/azure-disks-attached-to-managed-iscsi-controllers.png" alt-text="Diagram depicting how disk pools works, each ultra disk can be accessed by each iSCSI controller over iSCSI, and the Azure VMware Solution hosts can access the iSCSI controller over iSCSI." border="false":::


In this article, you'll learn how to:

- Add an Azure VMware Solution private cloud as an iSCSI initiator that allows access to the disk pool over iSCSI protocol.

- Connect to a disk pool surfaced through an iSCSI target as the VMware datastore of an Azure VMware Solution private cloud.

- Create a VMware instance in Azure VMware Solution with storage volume created on the datastore backed by Azure disk pool.


## Supported regions

Disk pool in Azure VMware Solution currently supports the following regions:
- East US
- Canada Central

You can only connect the disk pool to an Azure VMware Solution private cloud in the same region. If your private cloud is deployed in non-supported regions, you can redeploy in a supported region. Azure VMware Solution private cloud and disk pool colocation provide the best performance with minimal network latency.


## Prerequisites

- Identify the scalability and performance requirements of your workloads. For details, see [Planning for Azure disk pools](../ virtual-machines/disks-pools-planning.md).

- Deploy [Azure VMware Solution private cloud](deploy-azure-vmware-solution.md) with a [virtual network configured](deploy-azure-vmware-solution.md#step-3-connect-to-azure-virtual-network-with-expressroute). For more information, see [Network planning checklist](tutorial-network-checklist.md) and [Configure networking for your VMware private cloud](tutorial-configure-networking.md).

   - If you select Ultra Disks
, use either the Ultra Performance or ErGw3AZ (10Gbps) SKU for the Azure VMware Solution private cloud and then [enable ExpressRoute FastPath](/azure/expressroute/expressroute-howto-linkvnet-arm#configure-expressroute-fastpath).

   - If you select Premium SSD Managed Disks, use either the Standard (1Gbps) or High Performance (2Gbps) SKU for the Azure VMware Solution private cloud.

- Deploy and configure a disk pool with UItra Disks or Premium SSD Disks as the backing storge and expose the disk pool as an iSCSI target with each disk as an individual LUN. For details, see [Deploy an Azure disk pool](../virtual-machines/disks-pools-deploy.md).

   >[!IMPORTANT]
   > The disk pool must be deployed in the same subscription as the VMware cluster, and it must be attached to the same VNET as the VMware cluster.

## Connect a disk pool to your private cloud
You'll connect to a disk pool surfaced through an iSCSI target as the VMware datastore of an Azure VMware Solution private cloud

### [PowerShell](#tab/powershell)

Ensure you have the [latest version of Azure PowerShell](/powershell/azure/install-Az-ps).

1. [Download]( https://weicontentshare.blob.core.windows.net/powershell/20210218.zip?sv=2019-07-07&sr=b&sig=it1klXYXXl%2FZOpeWm1Wte1nFt5MyN8J3r8%2BQka%2FX6xM%3D&se=2031-02-18T06%3A26%3A14Z&sp=r) and unzip the Azure PowerShell module for Azure Disk Pool. 

2. Remove exciting modules.
   ```powershell
   Remove-Module -Name AzureRM.*
   Remove-Module -Name Az.*

   Get-Module -Name AzureRM.* -ListAvailable
   Get-Module -Name Az.* -ListAvailable
   ```

3. Run the **RegisterRepository.ps1** script to set up a local repository that points to the disk pool module.
   >[!NOTE]
   >If you run the script without parameters, the repository's name is the folder's name where the script is found. You can also provide a repository name with the *RepositoryName* parameter.

4. Install the disk pool module.
   ```powershell
   Install-Module -Name Az.DiskPool -Repository 20210218 –AllowPrerelease –AllowClobber –Force

   if ($PSVersionTable.PSEdition -eq 'Desktop' -and (Get-Module -Name AzureRM -ListAvailable)) 
   {
       Write-Warning -Message ('Az module not installed. Having both the AzureRM and ' +
         'Az modules installed at the same time is not supported.')
   } else {
       Install-Module -Name Az -AllowClobber -Scope CurrentUser
   }
   Import-Module Az.Resources
   Import-Module Az.Network
   ```

5. Validate that the **Az.DiskPool** module is installed.
   ```powershell
   Get-Module -Name Az.* -ListAvailable
   ```
    

6. Set up variables

    ```powershell
    $subscriptionId = "<subscription>"
    Connect-AzAccount -Subscription $subscriptionId
    
    $resourceGroupName= ",resourceGroupName>"
    $location = "eastus"# Supported regions: East US, Canada Central, West US 2
    
    $diskNames = @("<diskName1>","<diskName2>")
    $availabilityZone = "2"
    $disks = @()
    
    $virtualNetworkResourceGroupName = "<virtualNetworkResourceGroupName>"
    $virtualNetworkName = "<virtualNetworkName>"
    $diskPoolSubnetName = "<diskPoolSubnetName>"
    $subnetAddressPrefix = “<subnetAddressPrefix>” # For example: "10.0.1.0/24", or any with mask bits below 30 within the VNet address space
    
    $diskPoolName = "<diskPoolName>"
    
    $iscsiTargetName = "<iscsiTargetName>"# this will be used to generate the iSCSI target IQN name, Constraint?
    $targetIqn = "<targetIqn>" + $iscsiTargetName
    $initiatorIqns = @("<initiatorIqns>", "<initiatorIqns>", "<initiatorIqns>") #iqn.1998-01.com.vmware:esx20-r07-45f8643f
    $lunNames = @("<lunNames>","<lunNames>")

    # 2. create a new resoruce group for the Disk Pool
    if ( (Get-AzResourceGroup -Name $resourceGroupName -Location $location) -eq $null)
    {
        New-AzResourceGroup -Name $resourceGroupName -Location $location
        Write-Host "Resource Group created"
    }
    
    # 3.1 create new Managed Disks
    foreach ($diskName in $diskNames) {
        # Ultra
        # $diskconfig = New-AzDiskConfig -Location $location -DiskSizeGB 1024 -DiskIOPSReadWrite 5000 -DiskMBpsReadWrite 100 -AccountType UltraSSD_LRS -CreateOption Empty -zone $availabilityZone -LogicalSectorSize 512 
    
        # Premium SSD
        $diskconfig = New-AzDiskConfig -Location $location -DiskSizeGB 1024 -AccountType Premium_LRS -CreateOption Empty -zone $availabilityZone
    
        Write-Output "Creating Managed Disk ${diskName}..."
        $disk = New-AzDisk -ResourceGroupName $resourceGroupName -DiskName $diskName -Disk $diskconfig 
        $diskId = $disk.Id
    
        # append newly created disk to the array
        $disks += ,(@{Id=$diskId})
    }
    
    <#
    #or get existing Managed Disks
    Write-Output "Geting Managed Disk ${diskName}..."
    foreach ($diskName in $diskNames) 
    {
        $disk = Get-AzDisk -ResourceGroupName $resourceGroupName -DiskName $diskName
        $diskId = $disk.Id
    
        # append newly created disk to the array
        $disks += ,(@{Id=$diskId})
    }
    #>
    
    # 3.2 create role definition granting disk pools contributor role to the resource group the disk is deployed to 
    $scopeDef = "/subscriptions/" + $subscriptionId + "/resourceGroups/" + $resourceGroupName
    
    $rpId = (Get-AzADServicePrincipal -SearchString "StoragePool Resource Provider").id 
    New-AzRoleAssignment -ObjectId $rpId -RoleDefinitionName "Contributor"  -Scope $scopeDef  
    
    # 4. create a subnet for Disk Pool
    Write-Output "Creating a subnet in the vNet that AVS cloud is deployed to..."
    
    $diskpoolSubnet = New-AzVirtualNetworkSubnetConfig -Name $diskpoolSubnetName -AddressPrefix $subnetAddressPrefix 
    $virtualNetwork = Get-AzVirtualNetwork -Name $virtualNetworkName -ResourceGroupName $virtualNetworkResourceGroupName 
    Add-AzVirtualNetworkSubnetConfig -Name $diskpoolSubnetName -VirtualNetwork $virtualNetwork -AddressPrefix $subnetAddressPrefix 
    $virtualNetwork | Set-AzVirtualNetwork
    $subnetId = $virtualNetwork.Id + "/subnets/" + $diskPoolSubnetName
    
    # 5. create Disk Pool
    Write-Output "Creating a Disk Pool..."
    
    New-AzDiskPool -Name $diskPoolName -ResourceGroupName $resourceGroupName -Location $location -SubnetId $subnetId -AvailabilityZone $availabilityZone -Tier Standard
    $diskpool = Get-AzDiskPool -ResourceGroupName $resourceGroupName -Name $DiskPoolName
    
    # 6 add disks to the Disk Pool
    Write-Output "Updating Disk Pool by adding disks..."
    Update-AzDiskPool -ResourceGroupName $resourceGroupName -Name $diskPoolName -Disk $disks
    
    # 7. create an iSCSI Target
    $luns = @()
    for ($counter=0; $counter -lt $disks.Length; $counter++)
    {
        $disk = $disks[$counter]
        $lunName = $lunNames[$counter]
    
        $lun= New-AzDiskPoolIscsiLunObject -ManagedDiskAzureResourceId $disk.id -Name $lunName
        $luns += ,($lun)
    }
    
    $acls = @()
    foreach ($initiatorIqn in $initiatorIqns) 
    {
    $acl = @{InitiatorIqn=$initiatorIqn;MappedLun=$lunNames} 
    $acls += ,($acl)
    }
    
    $tpgs = New-AzDiskPoolTargetPortalGroupObject -Lun $luns -AttributeAuthentication $false -AttributeProdModeWriteProtect $false -Acls $acls -Endpoint @("1", "2") -Port 0 -Tag 0
    
    Write-Output "Creating iSCSI target..."
    New-AzIscsiTarget -ResourceGroupName $resourceGroupName -TargetIqn $targetIqn -DiskPoolName $diskPoolName -Name $iscsiTargetName -Tpg $tpgs
    
    Write-Output "Print details of iSCSI target..."
    $iscsiTarget = Get-AzIscsiTarget -DiskPoolName $diskPoolName -ResourceGroupName $resourceGroupName | fl 
     
    $endpoint = $iscsiTarget.Tpg[0].Endpoint
    Write-Output "iSCSI target server IP address & port: $endpoint"
    
    ```

### [Azure CLI](#tab/azure-cli)

---


## Disconnect a disk pool from your private cloud
There is no maintenance window required for this operation. You can view logs for auditing purposes. 

### [PowerShell](#tab/powershell)


### [Azure CLI](#tab/azure-cli)

---

## Remove client clusters from the disk pool

--we need an intro paragraph explaining what they are doing and why--

### [PowerShell](#tab/powershell)



### [Azure CLI](#tab/azure-cli)

---



## Add private cloud as an iSCSI initiator
[when would you do this and why?]
- Add an Azure VMware Solution private cloud as an iSCSI initiator to allow access to the disk pool over iSCSI protocol.

## Create VMware instance with storage volume
[when would you do this and why?]
- Create a VMware instance in Azure VMware Solution with storage volume created on the datastore backed by Azure disk pool.



## Next steps

Now that you've created a disk pool and connected it to Azure VMware Solution hosts, you may want to learn about:

- [Managing an Azure disk pool](../virtual-machines/disks-pools-manage.md ).  Once you've deployed a disk pool, there are various management actions available to you. You can add or remove a disk to or from a disk pool, Update iSCSI LUN mapping, or add ACLs (Only applicable if ACL mode is set to Static).

- [Deleting a disk pool](/azure/virtual-machines/disks-pools-deprovision#delete-a-disk-pool). When you delete a disk pool, all the resources in the managed resource group are also deleted.

- [Disabling iSCSI support on a disk](/azure/virtual-machines/disks-pools-deprovision#disable-iscsi-support). If you disable iSCSI support on a disk pool, you effectively can no longer use a disk pool.

- [Moving disk pools to a different subscription](/azure/virtual-machines/disks-pools-move-resource). Moving a disk pool involves moving the disk pool itself, the disks contained in the disk pool, the disk pool's managed resource group, and all the resources contained in the managed resource group.
