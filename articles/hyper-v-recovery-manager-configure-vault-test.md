<properties 
	pageTitle="Test protection between on-premises VMM sites" 
	description="Azure Site Recovery coordinates the replication, failover and recovery of Hyper-V virtual machines between on-premises VMM sites." 
	services="site-recovery" 
	documentationCenter="" 
	authors="raynew" 
	manager="jwhit" 
	editor="tysonn"/>

<tags 
	ms.service="site-recovery" 
	ms.workload="backup-recovery" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="03/19/2015" 
	ms.author="raynew"/>

# Test protection between on-premises VMM sites

## Run a recovery plan

Test your deployment to make sure that virtual machines and data fail over as expected. To do this you'll create a recovery plan and then run a test failover on the plan.

1. On the **Recovery Plans** tab, click **Create Recovery Plan**.
2. Specify a name for the recovery plan, and source and target VMM servers. The source server must have virtual machines that are enabled for failover and recovery. Select **Hyper-V** to view only clouds that are configured for Hyper-V replication.

	![Create recovery plan](./media/hyper-v-recovery-manager-configure-vault/SRE2E_RP1.png)

3. In **Select Virtual Machine**, select replication groups. All virtual machines associated with the replication group will be selected and added to the recovery plan. These virtual machines are added to the recovery plan default group—Group 1. you can add more groups if required. Note that after replication virtual machines will start up in accordance with the order of the recovery plan groups.

	![Add virtual machines](./media/hyper-v-recovery-manager-configure-vault/SRE2E_RP2.png)	

4. After a recovery plan has been created, it appears in the list on the **Recovery Plans** tab. 
5. On the **Recovery Plans** tab, select the plan and click **Test Failover**.
6. On the **Confirm Test Failover** page, select **None**. Note that with this option enabled the failed over replica virtual machines won't be connected to any network. This will test that the virtual machine fails over as expected but does not test your replication network environment. If you want to run a more comprehensive test failover see <a href="http://go.microsoft.com/fwlink/?LinkId=522291">Test an on-premises deployment on MSDN</a>.

	![Select test network](./media/hyper-v-recovery-manager-configure-vault/SRSAN_TestFailover1.png)


7. The test virtual machine will be created on the same host as the host on which the replica virtual machine exists. It isn’t added to the cloud in which the replica virtual machine is located.

## Run a recovery plan
After replication the replica virtual machine will have an IP address that isn’t the same as the IP address of the primary virtual machine. If you're issuing addresses from DHCP then DNS will be updated automatically. If you're  not using DHCP and you want to make sure the addresses are the same you'll need to run a couple of scripts.

### Script to retrieve the IP address
Run this sample script to retrieve the IP address.
    **$vm = Get-SCVirtualMachine -Name <VM_NAME>
	$na = $vm[0].VirtualNetworkAdapters>
	$ip = Get-SCIPAddress -GrantToObjectID $na[0].id
	$ip.address**  

### Script to update DNS
Run this sample script to update DNS, specifying the IP address you retrieved using the previous sample script.

	**[string]$Zone,
	[string]$name,
	[string]$IP
	)
	$Record = Get-DnsServerResourceRecord -ZoneName $zone -Name $name
	$newrecord = $record.clone()
	$newrecord.RecordData[0].IPv4Address  =  $IP
	Set-DnsServerResourceRecord -zonename com -OldInputObject $record -NewInputObject $Newrecord**

