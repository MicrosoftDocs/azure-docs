---
title: Replicate Hyper-V VMs in VMM with SAN by using Azure Site Recovery | Microsoft Docs
description: This article describes how to replicate Hyper-V virtual machines between two sites with Azure Site Recovery using SAN replication.
services: site-recovery
documentationcenter: ''
author: rayne-wiselman
manager: jwhit
editor: ''

ms.assetid: eb480459-04d0-4c57-96c6-9b0829e96d65
ms.service: site-recovery
ms.workload: storage-backup-recovery
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/14/2017
ms.author: raynew

---
# Replicate Hyper-V VMs in VMM clouds to a secondary site with Azure Site Recovery by using SAN


Use this article if you want to deploy [Azure Site Recovery](site-recovery-overview.md) to manage replication of Hyper-V VMs (managed in System Center Virtual Machine Manager clouds) to a secondary VMM site, using Azure Site Recovery in the classic portal. This scenario isn't available in the new Azure portal.



Post any comments at the end of this article. Get answers to technical questions in the [Azure Recovery Services Forum](https://social.msdn.microsoft.com/forums/azure/home?forum=hypervrecovmgr).


## Why replicate with SAN and Site Recovery?

* SAN provides an enterprise-level, scalable replication solution so that a primary site containing Hyper-V with SAN can replicate LUNs to a secondary site with SAN. Storage is managed by VMM, and replication and failover is orchestrated with Site Recovery.
* Site Recovery has worked with several [SAN storage partners](http://social.technet.microsoft.com/wiki/contents/articles/28317.deploying-azure-site-recovery-with-vmm-and-san-supported-storage-arrays.aspx) to provide replication across Fibre Channel and iSCSI storage.  
* Use your existing SAN infrastructure to protect mission-critical apps deployed in Hyper-V clusters. VMs can be replicated as a group so that N-tier apps can be failed over consistently.
* SAN replication ensures replication consistency across different tiers of an application with synchronized replication for low RTO and RPO, and asynchronized replication for high flexibility (depending on your storage array capabilities).  
* You can manage SAN storage in the VMM fabric and use SMI-S in VMM to discover existing storage.  

Note that:
- Site-to-site replication with SAN isn't available in the Azure portal. It's only available in the classic portal. New vaults can't be created in the classic portal. Existing vaults can be maintained.
- Replication from SAN to Azure isn't supported.
- You can't replicate shared VHDXs, or logical units (LUNs) that are directly connected to VMs via iSCSI or Fibre Channel. Guest clusters can be replicated.


## Architecture

![SAN architecture](./media/site-recovery-vmm-san/architecture.png)

- **Azure**: Set up a Site Recovery vault in the Azure portal.
- **SAN storage**: SAN storage is managed in the VMM fabric. You add the storage provider, create storage classifications, and set up storage pools.
- **VMM and Hyper-V**: We recommend a VMM server in each site. Set up VMM private clouds, and place Hyper-V clusters in those clouds. During deployment, the Azure Site Recovery Provider is installed on each VMM server, and the server is registered in the vault. The Provider communicates with the Site Recovery service to manage replication, failover, and failback.
- **Replication**: After you set up storage in VMM and configure replication in Site Recovery, replication occurs between the primary and secondary SAN storage. No replication data is sent to Site Recovery.
- **Failover**: Enable failover in the Site Recovery portal. There is zero data loss during failover because replication is synchronous.
- **Failback**: To fail back, you enable reverse replication to transfer delta changes from the secondary site to the primary site. After reverse replication is complete, you run a planned failover from secondary to primary. This planned failover stops the replica VMs on the secondary site and starts them on the primary site.


## Before you start


**Prerequisites** | **Details**
--- | ---
**Azure** |You need a [Microsoft Azure](https://azure.microsoft.com/) account. You can start with a [free trial](https://azure.microsoft.com/pricing/free-trial/). [Learn more](https://azure.microsoft.com/pricing/details/site-recovery/) about Site Recovery pricing. Create an Azure Site Recovery vault to configure and manage replication and failover.
**VMM** | You can use a single VMM server and replicate between different clouds, but we recommend one VMM in the primary site and one in the secondary site. A VMM can be deployed as a physical or virtual standalone server, or as a cluster. <br/><br/>The VMM server should be running System Center 2012 R2 or later with the latest cumulative updates.<br/><br/> You need at least one cloud configured on the primary VMM server you want to protect and one cloud configured on the secondary VMM server you want to use for failover.<br/><br/> The source cloud must contain one or more VMM host groups.<br/><br/> All VMM clouds must have the Hyper-V Capacity profile set.<br/><br/> For more about setting up VMM clouds, see [Deploy a private VM cloud](https://technet.microsoft.com/en-us/system-center-docs/vmm/scenario/cloud-overview).
**Hyper-V** | You need one or more Hyper-V clusters in primary and secondary VMM clouds.<br/><br/> The source Hyper-V cluster must contain one or more VMs.<br/><br/> The VMM host groups in the primary and secondary sites must contain at least one of the Hyper-V clusters.<br/><br/>The host and target Hyper-V servers must be running Windows Server 2012 or later with the Hyper-V role and the latest updates installed.<br/><br/> If you're running Hyper-V in a cluster and have a static IP address-based cluster, cluster broker isn't created automatically. You must configure it manually. For more information, see [Preparing host clusters for Hyper-V replica](https://www.petri.com/use-hyper-v-replica-broker-prepare-host-clusters).
**SAN storage** | You can replicate guest-clustered virtual machines with iSCSI or channel storage, or by using shared virtual hard disks (vhdx).<br/><br/> You need two SAN arrays: one in the primary site, and one in the secondary site.<br/><br/> A network infrastructure should be set up between the arrays. Peering and replication should be configured. Replication licenses should be set up in accordance with the storage array requirements.<br/><br/>Set up networking between the Hyper-V host servers and the storage array so that hosts can communicate with storage LUNs by using iSCSI or Fibre Channel.<br/><br/> Check [supported storage arrays](http://social.technet.microsoft.com/wiki/contents/articles/28317.deploying-azure-site-recovery-with-vmm-and-san-supported-storage-arrays.aspx).<br/><br/> SMI-S providers from storage array manufacturers should be installed, and the SAN arrays should be managed by the provider. Set up the Provider according to manufacturer instructions.<br/><br/>Make sure that the array's SMI-S provider is on a server that the VMM server can access over the network with an IP address or FQDN.<br/><br/> Each SAN array should have one or more available storage pools.<br/><br/> The primary VMM server should manage the primary array, and the secondary VMM server should manage the secondary array.
**Network mapping** | Set up network mapping so that replicated virtual machines are optimally placed on secondary Hyper-V host servers after failover, and so that they're connected to appropriate VM networks. If you don't configure network mapping, replica VMs won't be connected to any network after failover.<br/><br/> Make sure that VMM networks are configured correctly so that you can set up network mapping during Site Recovery deployment. In VMM, the VMs on the source Hyper-V host should be connected to a VMM VM network. That network should be linked to a logical network that is associated with the cloud.<br/><br/> The target cloud should have a corresponding VM network, and it in turn should be linked to a corresponding logical network that is associated with the target cloud.<br/><br/>.

## Step 1: Prepare the VMM infrastructure
To prepare your VMM infrastructure, you need to:

1. Verify VMM clouds.
2. Integrate and classify SAN storage in VMM.
3. Create LUNs and allocate storage.
4. Create replication groups.
5. Set up VM networks.

### Verify VMM clouds

Make sure your VMM clouds are set up properly before you begin Site Recovery deployment.

### Integrate and classify SAN storage in the VMM fabric

1. In the VMM console, go to **Fabric** > **Storage** > **Add Resources** > **Storage Devices**.
2. In the **Add Storage Devices** wizard, select **Select a storage provider type** and select **SAN and NAS devices discovered and managed by an SMI-S provider**.

    ![Provider type](./media/site-recovery-vmm-san/provider-type.png)

3. On the **Specify Protocol and Address of the Storage SMI-S Provider** page, select **SMI-S CIMXML** and specify the settings for connecting to the provider.
4. In **Provider IP address or FQDN** and **TCP/IP port**, specify the settings for connecting to the provider. You can use an SSL connection for SMI-S CIMXML only.

    ![Provider connect](./media/site-recovery-vmm-san/connect-settings.png)
5. In **Run as account**, specify a VMM Run As account that can access the provider, or create an account.
6. On the **Gather Information** page, VMM automatically tries to discover and import the storage device information. To retry discovery, click **Scan Provider**. If the discovery process succeeds, the discovered storage arrays, storage pools, manufacturer, model, and capacity are listed on the page.

    ![Discover storage](./media/site-recovery-vmm-san/discover.png)
7. In **Select storage pools to place under management and assign a classification**, select the storage pools that VMM will manage and assign them a classification. LUN information is imported from the storage pools. Create LUNs based on the applications you need to protect, their capacity requirements, and your requirements for what needs to replicate together.

    ![Classify storage](./media/site-recovery-vmm-san/classify.png)

### Create LUNs and allocate storage

Create LUNs based on the applications you need to protect, capacity requirements, and your requirements for what needs to replicate together.

1. After the storage appears in the VMM fabric, you can [provision LUNs](https://technet.microsoft.com/en-us/system-center-docs/vmm/manage/manage-storage-host-groups#create-a-lun-in-vmm).

     > [!NOTE]
     > Don't add VHDs for the VM that are enabled for replication to LUNs. If those LUNs aren't in a Site Recovery replication group, they won't be detected by Site Recovery.
     >

2. Allocate storage capacity to the Hyper-V host cluster so that VMM can deploy virtual machine data to the provisioned storage:

   * Before allocating storage to the cluster, you need to allocate it to the VMM host group on which the cluster resides. For more information, see [How to allocate storage logical units to a host group in VMM](https://technet.microsoft.com/library/gg610686.aspx) and [How to allocate storage pools to a host group in VMM](https://technet.microsoft.com/library/gg610635.aspx).
   * Allocate storage capacity to the cluster as described in [How to configure storage on a Hyper-V host cluster in VMM](https://technet.microsoft.com/library/gg610692.aspx).

    ![Provider type](./media/site-recovery-vmm-san/provider-type.png)
3. In **Specify Protocol and Address of the Storage SMI-S Provider**, select **SMI-S CIMXML**. Specify the settings for connecting to the provider. You can use an SSL connection only for SMI-S CIMXML.

    ![Provider connect](./media/site-recovery-vmm-san/connect-settings.png)
4. In **Run as account**, specify a VMM Run As account that can access the provider, or create an account.
5. In **Gather Information**, VMM automatically tries to discover and import the storage device information. If you need to retry, click **Scan Provider**. When the discovery process succeeds, the storage arrays, storage pools, manufacturer, model, and capacity are listed on the page.

    ![Discover storage](./media/site-recovery-vmm-san/discover.png)
7. In **Select storage pools to place under management and assign a classification**, select the storage pools that VMM will manage, and assign them a classification. LUN information is imported from the storage pools.

    ![Classify storage](./media/site-recovery-vmm-san/classify.png)


### Create replication groups

Create a replication group that includes all the LUNs that will need to replicate together.

1. In the VMM console, open the **Replication Groups** tab of the storage array properties, and then click **New**.
2. Create the replication group.

    ![SAN replication group](./media/site-recovery-vmm-san/rep-group.png)

### Set up networks

If you want to configure network mapping, do the following:

1. See Site Recovery network mapping.
2. Prepare VM networks in VMM:

   * [Set up logical networks](https://technet.microsoft.com/en-us/system-center-docs/vmm/manage/manage-network-logical-networks).
   * [Set up VM networks](https://technet.microsoft.com/en-us/system-center-docs/vmm/manage/manage-network-vm-networks).


## Step 2: Create a vault

1. Sign in to the [Azure portal](https://portal.azure.com) from the VMM server you want to register in the vault.
2. Expand **Data Services** > **Recovery Services**, and then click **Site Recovery Vault**.
3. Click **Create New** > **Quick Create**.
4. In **Name**, enter a friendly name to identify the vault.
5. In **Region**, select the geographic region for the vault. To check supported regions, see [Azure Site Recovery Pricing Details](https://azure.microsoft.com/pricing/details/site-recovery/).
6. Click **Create vault**.

    ![New Vault](./media/site-recovery-vmm-san/create-vault.png)

Check the status bar to confirm that the vault was successfully created. The vault will be listed as **Active** on the main **Recovery Services** page.

### Register the VMM servers

1. Open the **Quick Start** page from the **Recovery Services** page. Quick Start can also be opened at any time by choosing the icon.

    ![Quick Start Icon](./media/site-recovery-vmm-san/quick-start-icon.png)
2. In the drop-down box, select **Between Hyper-V on-premises site using array replication**.

    ![Registration key](./media/site-recovery-vmm-san/select-san.png)
3. In **Prepare VMM servers**, download the latest version of the Azure Site Recovery Provider installation file.
4. Run this file on the source VMM server. If VMM is deployed in a cluster and you're installing the Provider for the first time, install the Provider on an active node and finish the installation to register the VMM server in the vault. Then install the Provider on the other nodes. If you're upgrading the Provider, you need to upgrade on all nodes so that they have the same Provider version.
5. The installer checks requirements and requests permission to stop the VMM service to begin Provider setup. The service will be restarted automatically when setup finishes. On a VMM cluster, you'll be prompted to stop the Cluster role.
6. In **Microsoft Update**, you can opt in for updates, and Provider updates will be installed according to your Microsoft Update policy.

    ![Microsoft Updates](./media/site-recovery-vmm-san/ms-update.png)

7. By default, the install location for the Provider is <SystemDrive>\Program Files\Microsoft System Center 2012 R2\Virtual Machine Manager\bin. Click **Install** to begin.

    ![Install Location](./media/site-recovery-vmm-san/install-location.png)

8. After the Provider is installed, click **Register** to register the VMM server in the vault.

    ![Install Complete](./media/site-recovery-vmm-san/install-complete.png)

9. In **Internet Connection**, specify how the Provider connects to the Internet. Select **Use default system proxy settings** if you want to use the default Internet connection settings on the server.

    ![Internet Settings](./media/site-recovery-vmm-san/proxy-details.png)

   * If you want to use a custom proxy, set it up before you install the Provider. When you configure custom proxy settings, a test runs to check the proxy connection.
   * If you do use a custom proxy, or if your default proxy requires authentication, you should enter the proxy details, including the address and port.
   * The required URLs should be accessible from the VMM server.
   * If you use a custom proxy, a VMM Run As account (DRAProxyAccount) is created automatically by using the specified proxy credentials. Configure the proxy server so that this account can authenticate. You can modify the Run As account settings in the VMM console (**Settings** > **Security** > **Run As Accounts** > **DRAProxyAccount**). You must restart the VMM service for the change to take effect.
10. In **Registration Key**, select the key that you downloaded from the portal and copied to the VMM server.
11. In **Vault name**, verify the name of the vault in which the server will be registered.

    ![Server registration](./media/site-recovery-vmm-san/vault-creds.png)
12. The encryption setting is only used for VMM to Azure replication. You can ignore it.

    ![Server registration](./media/site-recovery-vmm-san/encrypt.png)
13. In **Server name**, specify a friendly name to identify the VMM server in the vault. In a cluster configuration, specify the VMM cluster role name.
14. In **Initial cloud metadata sync**, select whether you want to synchronize metadata for all clouds on the VMM server. This action only needs to happen once on each server. If you don't want to synchronize all clouds, you can leave this setting unchecked and synchronize each cloud individually in the cloud properties in the VMM console.

    ![Server registration](./media/site-recovery-vmm-san/friendly-name.png)

15. Click **Next** to complete the process. After registration, metadata from the VMM server is retrieved by Azure Site Recovery. The server is displayed in **Servers** > **VMM Servers** in the vault.

### Command-line installation

The Azure Site Recovery Provider can also be installed by using the following command line. This method can be used to install the provider on Server Core for Windows Server 2012 R2.

1. Download the Provider installation file and registration key to a folder. For example, C:\ASR.
2. Stop the VMM service.
3. Extract the Provider installer. Run these commands as an administrator:

        C:\Windows\System32> CD C:\ASR
        C:\ASR> AzureSiteRecoveryProvider.exe /x:. /q
4. Install the Provider:

        C:\ASR> setupdr.exe /i
5. Register the Provider:

        CD C:\Program Files\Microsoft System Center 2012 R2\Virtual Machine Manager\bin
        C:\Program Files\Microsoft System Center 2012 R2\Virtual Machine Manager\bin\> DRConfigurator.exe /r  /Friendlyname <friendly name of the server> /Credentials <path of the credentials file> /EncryptionEnabled <full file name to save the encryption certificate>         

Parameters:

* **/Credentials**: Required parameter for the location in which the registration key file is located.  
* **/FriendlyName**: Required parameter for the name of the Hyper-V host server that appears in the Azure Site Recovery portal.
* **/EncryptionEnabled**: Optional parameter only used when replicating from VMM to Azure.
* **/proxyAddress**: Optional parameter that specifies the address of the proxy server.
* **/proxyport**: Optional parameter that specifies the port of the proxy server.
* **/proxyUsername**: Optional parameter that specifies the proxy user name (if the proxy requires authentication).
* **/proxyPassword**: Optional parameter that specifies the password for authenticating with the proxy server (if the proxy requires authentication).

## Step 3: Map storage arrays and pools

Map primary and secondary arrays to specify which secondary storage pool receives replication data from the primary pool. Map storage before you configure replication, because the mapping information is used when you enable protection for replication groups.

Before you start, check that VMM clouds appear in the vault. Clouds are detected either when you synchronize all clouds during Provider installation or when you synchronize a specific cloud in the VMM console.

1. Click **Resources** > **Server Storage** > **Map Source and Target Arrays**.
    ![Server registration](./media/site-recovery-vmm-san/storage-map.png)

2. Select the storage arrays on the primary site, and map them to storage arrays on the secondary site. In **Storage Pools**, select a source and target storage pool to map.

    ![Server registration](./media/site-recovery-vmm-san/storage-map-pool.png)

## Step 4: Configure replication settings

After VMM servers are registered, configure cloud protection settings.

1. On the **Quick Start** page, click **Set up protection for VMM clouds**.
2. On the **Protected Items** tab, select the cloud **Configuration**.
3. In **Target**, select **VMM**.
4. In **Target location**, select the VMM server that manages the cloud you want to use for recovery.
5. In **Target cloud**, select the target cloud you want to use for VM failover.
   * We recommend that you select a target cloud that meets recovery requirements for the virtual machines you protect.
   * A cloud can only belong to a single cloud pair--as either a primary or a target cloud.
6. Site Recovery verifies that clouds have access to SAN storage, and that the storage arrays are mapped.
7. If verification is successful, in **Replication type**, select **SAN**.

After you save the settings, a job is created that can be monitored on the **Jobs** tab. Settings can be modified on the **Configure** tab. If you want to modify the target location or target cloud, you must remove the cloud configuration and then reconfigure the cloud.

## Step 5: Enable network mapping

1. On the **Quick Start** page, click **Map networks**.
2. Select the source VMM server, and then select the target VMM server to which the networks will be mapped. The list of source networks and their associated target networks are displayed. A blank value is shown for networks that aren't mapped. Click the information icon next to the source and target network names to view the subnets for each network.
3. Select a network in **Network on source**, and then click **Map**. The service detects the VM networks on the target server and displays them.

    ![SAN architecture](./media/site-recovery-vmm-san/network-map1.png)
4. Select one of the VM networks from the target VMM server.

    ![SAN architecture](./media/site-recovery-vmm-san/network-map2.png)

5. When you select a target network, the protected clouds that use the source network are displayed. Available target networks are also displayed. We recommend that you select a target network that is available to all the clouds you're using for replication.
6. Click the check mark to complete the mapping process. A job starts that tracks progress. You can view it on the **Jobs** tab.

## Step 6: Enable replication for replication groups

Before you can enable protection for virtual machines, you need to enable replication for storage replication groups.

1. On the **Properties** page of the primary cloud in the Site Recovery portal, open the **Virtual Machines** tab and click **Add Replication Group**.
2. Select one or more VMM replication groups that are associated with the cloud, verify the source and target arrays, and specify the replication frequency.

Site Recovery, VMM, and the SMI-S providers provision the target site storage LUNs and enable storage replication. If the replication group is already replicated, Site Recovery reuses the existing replication relationship and updates the information.

## Step 7: Enable protection for virtual machines


When a storage group is replicating, enable protection for VMs in the VMM console with one of the following methods:

* **New virtual machine**: When you create a VM, you enable replication and associate the VM with the replication group.
  With this option, VMM uses intelligent placement to optimally place the VM storage on the LUNs of the replication group. Site Recovery orchestrates the creation of a shadow VM on the secondary site and allocates capacity so that replica VMs can be started after failover.
* **Existing virtual machine**: If a virtual machine is already deployed in VMM, you can enable replication and perform a storage migration to a replication group. After completion, VMM and Site Recovery detect the new VM and start managing it in Site Recovery. A shadow VM is created on the secondary site, and capacity is allocated so that the replica VM can be started after failover.

![Enable protection](./media/site-recovery-vmm-san/enable-protect.png)

After VMs are enabled for replication, they appear in the Site Recovery console. You can view VM properties, track status, and track failover replication groups that contain multiple VMs. In SAN replication, all VMs associated with a replication group must fail over together. This is because failover occurs at the storage layer first. It’s important to group your replication groups properly and place only associated VMs together.

> [!NOTE]
> After you've enabled replication for a VM, don't add its VHDs to LUNs unless they are located in a Site Recovery replication group. VHDs will only be detected by Site Recovery if they are located in a Site Recovery replication group.
>
>

You can track progress, including the initial replication, on the **Jobs** tab. After the Finalize Protection job runs, the virtual machine is ready for failover.

![Virtual machine protection job](./media/site-recovery-vmm-san/job-props.png)

## Step 8: Test the deployment

Test your deployment to make sure that VMs fail over as expected. To do this, create a recovery plan and run a test failover.

1. On the **Recovery Plans** tab, click **Create Recovery Plan**.
2. Specify a name for the recovery plan, and select source and target VMM servers. The source server must have VMs that are enabled for failover and recovery. Select **SAN** to view only clouds that are configured for SAN replication.

    ![Create recovery plan](./media/site-recovery-vmm-san/r-plan.png)

3. In **Select Virtual Machines**, select replication groups. All VMs associated with the group are added to the recovery plan. These VMs are added to the recovery plan default group (Group 1). You can add more groups if necessary. After replication, VMs are numbered according to the order of the recovery plan groups.

    ![Select virtual machines](./media/site-recovery-vmm-san/r-plan-vm.png)
4. After the recovery plan is created, it appears in the list on the **Recovery Plans** tab. Select the plan and choose **Test Failover**.
5. On the **Confirm Test Failover** page, select **None**. With this option enabled, the failed over replica VMs won't be connected to any network. This tests that the VMs fail over as expected, but it doesn't test the network environment. For more about other networking options, see [Site Recovery failover](site-recovery-failover.md).

    ![Select test network](./media/site-recovery-vmm-san/test-fail1.png)

6. The test VM is created on the same host as the host on which the replica VM exists. It isn’t added to the cloud in which the replica VM is located.
2. After replication, the replica VM will have a different IP address than the primary virtual machine. If you're issuing addresses from DHCP, it will be updated automatically. If you're not using DHCP and you want the same addresses, you need to run a couple of scripts.
3. Run this script to retrieve the IP address:

       $vm = Get-SCVirtualMachine -Name <VM_NAME>
       $na = $vm[0].VirtualNetworkAdapters>
       $ip = Get-SCIPAddress -GrantToObjectID $na[0].id
       $ip.address  

4. Run this sample script to update DNS. Specify the IP address you retrieved.

       [string]$Zone,
       [string]$name,
       [string]$IP
       )
       $Record = Get-DnsServerResourceRecord -ZoneName $zone -Name $name
       $newrecord = $record.clone()
       $newrecord.RecordData[0].IPv4Address  =  $IP
       Set-DnsServerResourceRecord -zonename $zone -OldInputObject $record -NewInputObject $Newrecord


## Next steps

After you've run a test failover to check that your environment is working as expected, see [Site Recovery failover](site-recovery-failover.md) to learn about different types of failovers.
