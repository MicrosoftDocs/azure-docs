---
title: Test Failover (VMM to VMM) in Site Recovery (Azure) | Microsoft Docs
description: Azure Site Recovery coordinates the replication, failover and recovery of virtual machines and physical servers. Learn about failover to Azure or a secondary datacenter.
services: site-recovery
documentationcenter: ''
author: prateek9us
manager: gauravd
editor: ''

ms.assetid: 44813a48-c680-4581-a92e-cecc57cc3b1e
ms.service: site-recovery
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: storage-backup-recovery
ms.date: 06/05/2017
ms.author: pratshar

---
# Test Failover (VMM to VMM) in Site Recovery


This article provides information and instructions for doing a test failover or a DR drill of virtual machines and physical servers that are protected with Site Recovery using a VMM managed on-premises site as the recovery site.

Post any comments or questions at the bottom of this article, or on the [Azure Recovery Services Forum](https://social.msdn.microsoft.com/forums/azure/home?forum=hypervrecovmgr).

Test failover is run to validate your replication strategy or perform a disaster recovery drill without any data loss or downtime. Doing a test failover doesn't have any impact on the ongoing replication or on your production environment. Test failover can be done either on a virtual machine or a [recovery plan](site-recovery-create-recovery-plans.md). When triggering a test failover you need to specify the network to which test virtual machines would connect to. Once a test failover is triggered you can track progress in the **Jobs** page.  


## Preparing infrastructure for test failover
* If you want to run a test failover using an existing network, prepare Active Directory, DHCP, and DNS in that network.
* If you want to run a test failover using the option to create VM networks automatically, add manual step before Group-1 in the recovery plan you’re going to use for the test failover and then add the infrastructure resources to the automatically created network before running the test failover.

### Things to note
* When replicating to a secondary site, the type of network used by the replica machine doesn’t need to match the type of logical network used for test failover, but some combinations might not work. If the replica uses DHCP and VLAN-based isolation, the VM network for the replica doesn't need a static IP address pool. So using Windows Network Virtualization for the test failover wouldn't work because no address pools are available. In addition test failover won't work if the replica network is No Isolation and the test network is Windows Network Virtualization. This is because the No Isolation network doesn't have the subnets required to create a Windows Network Virtualization network.
* The way in which replica virtual machines are connected to mapped VM networks after failover depends on how the VM network is configured in the VMM console:
  * **VM network configured with no isolation or VLAN isolation**—If DHCP is defined for the VM network, the replica virtual machine will be connected to the VLAN ID using the settings that are specified for the network site in the associated logical network. The virtual machine will receive its IP address from the available DHCP server. You don't need a static IP address pool defined for the target VM network. If a static IP address pool is used for the VM network the replica virtual machine will be connected to the VLAN ID using the settings that are specified for the network site in the associated logical network. The virtual machine will receive its IP address from the pool defined for the VM network. If a static IP address pool isn't defined on the target VM network, IP address allocation will fail. The IP address pool should be created on both the source and target VMM servers that you are going to use for protection and recovery.
  * **VM network with Windows network virtualization**—If a VM network is configured with this setting a static pool should be defined for the target VM network, regardless of whether the source VM network is configured to use DHCP or a static IP address pool. If you define DHCP, the target VMM server will act as a DHCP server and provide an IP address from the pool that is defined for the target VM network. If use of a static IP address pool is defined for the source server, the target VMM server will allocate an IP address from the pool. In both cases, IP address allocation will fail if a static IP address pool is not defined.


### Prepare DHCP
If the virtual machines involved in test failover use DHCP, a test DHCP server should be created within the isolated network that is created for the purpose of test failover.

### Prepare Active Directory
To run a test failover for application testing, you’ll need a copy of the production Active Directory environment in your test environment. Go through [test failover considerations for active directory](site-recovery-active-directory.md#test-failover-considerations) section for more details.

### Prepare DNS
Prepare a DNS server for the test failover as follows:

* **DHCP**—If virtual machines use DHCP, the IP address of the test DNS should be updated on the test DHCP server. If you’re using a network type of Windows Network Virtualization, the VMM server acts as the DHCP server. Therefore, the IP address of DNS should be updated in the test failover network. In this case, the virtual machines will register themselves to the relevant DNS Server.
* **Static address**—If virtual machines use a static IP address, the IP address of the test DNS server should be updated in test failover network. You might need to update DNS with the IP address of the test virtual machines. You can use the following sample script for this purpose:

        Param(
        [string]$Zone,
        [string]$name,
        [string]$IP
        )
        $Record = Get-DnsServerResourceRecord -ZoneName $zone -Name $name
        $newrecord = $record.clone()
        $newrecord.RecordData[0].IPv4Address  =  $IP
        Set-DnsServerResourceRecord -zonename $zone -OldInputObject $record -NewInputObject $Newrecord



## Run a test failover
This procedure describes how to run a test failover for a recovery plan. Alternatively you can run the failover for a single virtual machine or physical server on the **Virtual Machines** tab.

![Test Failover](./media/site-recovery-test-failover-vmm-to-vmm/TestFailover.png)

1. Select **Recovery Plans** > *recoveryplan_name*. Click **Failover** > **Test Failover**.
1. On the **Test Failover** blade, specify how virtual machines should be connected to networks after the test failover. Look at [network options](#network-options-in-site-recovery) for more details.
1. Track failover progress on the **Jobs** tab.
1. After it's complete verify that the virtual machines start successfully.
1. Once you're done, click on **Cleanup test failover** on the recovery plan. In **Notes** record and save any observations associated with the test failover. This will delete the virtual machines and networks that were created during test failover.


## Network options in Site Recovery

When you run a test failover you'll be asked to select network settings for test replica machines. You have a number of options.  

| **Test failover option** | **Description** | **Failover check** | **Details** |
| --- | --- | --- | --- |
| **Fail over to a secondary VMM site—without network** |Don't select a VM network |Failover checks that test machines are created.<br/><br/>The test virtual machine will be created on the same host as the host on which the replica virtual machine exists. It isn’t added to the cloud in which the replica virtual machine is located. |<p>The failed over machine won’t be connected to any network.<br/><br/>The machine can be connected to a VM network after it has been created |
| **Fail over to a secondary VMM site—with network** |Select an existing VM network a |Failover checks that virtual machines are created |The test virtual machine will be created on the same host as the host on which the replica virtual machine exists. It isn’t added to the cloud in which the replica virtual machine is located.<br/><br/>Create a VM network that's isolated from your production network<br/><br/>If you're using a VLAN-based network we recommend you create a separate logical network (not used in production) in VMM for this purpose. This logical network is used to create VM networks for the purpose of test failover.<br/><br/>The logical network should be associated with at least one of the network adapters of all the Hyper-V servers hosting virtual machines.<br/><br/>For VLAN logical networks, the network sites you add to the logical network should be isolated.<br/><br/>If you’re using a Windows Network Virtualization–based logical network, Azure Site Recovery automatically creates isolated VM networks. |
| **Fail over to a secondary VMM site—create a network** |A temporary test network will be created automatically based on the setting you specify in **Logical Network** and its related network sites |Failover checks that virtual machines are created |Use this option if the recovery plan uses more than one VM network. If you're using Windows Network Virtualization networks, this option can automatically create VM networks with the same settings (subnets and IP address pools) in the network of the replica virtual machine. These VM networks are cleaned up automatically after the test failover is complete.</p><p>The test virtual machine will be created on the same host as the host on which the replica virtual machine exists. It isn’t added to the cloud in which the replica virtual machine is located. |

> [!TIP]
> The IP address given to a virtual machine during test failover is same as the IP address it would receive when doing a planned or unplanned failover (presuming that the IP address is available in the test failover network. If the same IP address isn't available in the test failover network then virtual machine will receive another IP address available in the test failover network.
>
>


## Test failover to a production network on recovery site
It is recommended that when you are doing a test failover you choose a network that is different from your production recovery site network that you provided in **Network mapping**. But if you really want to validate end to end network connectivity in a failed over virtual machine, please note the following points:

1. Make sure that the primary virtual machine is shutdown when you are doing the test failover. If you don't do so there will be two virtual machines with the same identity running in the same network at the same time and that can lead to undesired consequences.
1. Any changes that you make into the test failover virtual machines would be lost when you cleanup the test failover virtual machines. These changes will not be replicated back to the primary virtual machine.
1. This way of doing testing leads to a downtime of your production application. Users of the application should be asked to not to use the application when the DR drill is in progress.  


## Next Steps
Once you have successfully tried a test failover you can try doing a [failover](site-recovery-failover.md).
