<properties
	pageTitle="Preparing your environment to back up Azure virtual machines | Microsoft Azure"
	description="Make sure your environment is prepared to back up Azure virtual machines"
	services="backup"
	documentationCenter=""
	authors="Jim-Parker"
	manager="jwhit"
	editor=""/>

<tags
	ms.service="backup"
	ms.workload="storage-backup-recovery"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="11/17/2015"
	ms.author="trinadhk; aashishr; jimpark; markgal"/>

# Prepare your environment to back up Azure virtual machines
Before you back up an Azure virtual machine (VM), you need to complete these prerequisites to prepare your environment. If you've already done this, you can start [backing up your VMs](backup-azure-vms.md). Otherwise, continue through the steps below to make sure your environment is ready.


## 1. Backup vault

![Backup vault](./media/backup-azure-vms-prepare/step1.png)

To start backing up your Azure virtual machines, you first need to create a backup vault. A vault is an entity that stores all the backups and recovery points that have been created over time. The vault also contains the backup policies that will be applied to the virtual machines being backed up.

This image shows the relationships between the various Azure Backup entities:
![Azure Backup entities and relationships](./media/backup-azure-vms-prepare/vault-policy-vm.png)

To create a backup vault:

1. Sign in to the [Azure portal](http://manage.windowsazure.com/).

2. Click **New** > **Data Services** > **Recovery Services** > **Backup Vault** > **Quick Create**. If you have multiple subscriptions associated with your organizational account, choose the correct subscription to associate with the backup vault. In each Azure subscription, you can have multiple backup vaults to organize the virtual machines being protected.

3. In **Name**, enter a friendly name to identify the vault. This needs to be unique for each subscription.

4. In **Region**, select the geographic region for the vault. The vault must be in the same region as the virtual machines that you want to protect. If you have virtual machines in different regions, create a vault in each one. There is no need to specify storage accounts to store the backup data--the backup vault and the Azure Backup service handle this automatically.

    ![Create backup vault](./media/backup-azure-vms-prepare/backup_vaultcreate.png)

5. Click **Create Vault**. It can take a while for the backup vault to be created. Monitor the status notifications at the bottom of the portal.

    ![Create vault toast notification](./media/backup-azure-vms-prepare/creating-vault.png)

6. A message confirms that the vault has been successfully created. It will be listed on the **Recovery Services** page as **Active**. Make sure to choose the appropriate storage redundancy option right after the vault has been created. Read more about [setting the storage redundancy option in the backup vault](backup-configure-vault.md#azure-backup---storage-redundancy-options).

    ![List of backup vaults](./media/backup-azure-vms-prepare/backup_vaultslist.png)

7. Click the backup vault to go to the **Quick Start** page, where the instructions for backing up Azure virtual machines are shown.

    ![Virtual machine backup instructions on the Dashboard page](./media/backup-azure-vms-prepare/vmbackup-instructions.png)



## 2. Network connectivity

![Network connectivity](./media/backup-azure-vms-prepare/step2.png)

The backup extension needs connectivity to the Azure public IP addresses to function correctly because it sends commands to an Azure Storage endpoint (HTTP URL) to manage the snapshots of the VM. Without the right Internet connectivity, these HTTP requests from the VM will time out and the backup operation will fail.

### Network restrictions with NSGs

If your deployment has access restrictions in place (through a network security group (NSG), for example), then you need to take additional steps to ensure that backup traffic to the backup vault remains unaffected.

There are two ways to provide a path for the backup traffic:

1. Whitelist the [Azure datacenter IP ranges](http://www.microsoft.com/en-us/download/details.aspx?id=41653).
2. Deploy an HTTP proxy to route the traffic.

The trade-off is between manageability, granular control, and cost.

|Option|Advantages|Disadvantages|
|------|----------|-------------|
|OPTION 1: Whitelist IP ranges| No additional costs.<br><br>For opening access in an NSG, use the <i>Set-AzureNetworkSecurityRule</i> cmdlet. | Complex to manage as the impacted IP ranges change over time.<br>Provides access to the whole of Azure, and not just Storage.|
|OPTION 2: HTTP proxy| Granular control in the proxy over the storage URLs allowed.<br>Single point of Internet access to VMs.<br>Not subject to Azure IP address changes.| Additional costs for running a VM with the proxy software.|

### Using an HTTP proxy for VM backups
When backing up a VM, the snapshot management commands are sent from the backup extension to Azure Storage using an HTTPS API. This traffic must be routed from the extension through the proxy, since only the proxy will be configured to have access to the public Internet.

>[AZURE.NOTE] There is no recommendation for the proxy software that should be used. Ensure that you pick a proxy that is compatible with the configuration steps below.

In the example below, the App VM needs to be configured to use the Proxy VM for all HTTP traffic bound for the public Internet. The Proxy VM needs to be configured to allow incoming traffic from VMs in the virtual network (VNET). And finally, the NSG (named *NSG-lockdown*) needs a new security rule that allows outbound Internet traffic from the Proxy VM.

![NSG with HTTP proxy deployment diagram](./media/backup-azure-vms-prepare/nsg-with-http-proxy.png)

**A) Allow outgoing network connections:**

1. For Windows computers, run the following command in an elevated command prompt:

	```
	netsh winhttp set proxy http://<proxy IP>:<proxy port>
	```

	This will set up a machine-wide proxy configuration, and will be used for any outgoing HTTP/HTTPS traffic.

2. For Linux computers, add the following line to the ```/etc/environment``` file:

 	```
 	http_proxy=http://<proxy IP>:<proxy port>
 	```

	Add the following lines to the ```/etc/waagent.conf``` file:

	```
HttpProxy.Host=<proxy IP>
HttpProxy.Port=<proxy port>
```

**B) Allow incoming connections on the proxy server:**

1. Open Windows Firewall on the proxy server. Right-click  **Inbound Rules** and click **New Rule...**.

	![Open the Firewall](./media/backup-azure-vms-prepare/firewall-01.png)

	![Create a new rule](./media/backup-azure-vms-prepare/firewall-02.png)
2. In the **New Inbound Rule Wizard**, choose the **Custom** option for the **Rule Type** and click **Next**. On the page to select the **Program**, choose **All Programs** and click **Next**.

3. On the **Protocol and Ports** page, use the inputs in the table below and click **Next**:

	![Create a new rule](./media/backup-azure-vms-prepare/firewall-03.png)

| Input field | Value |
| --- | --- |
| Protocol type | TCP |
| Local port    | Select **Specific Ports** in the dropdown. In the text box, enter the ```<Proxy Port>``` that has been configured. |
| Remote port   | Select **All Ports** in the dropdown. |

For the rest of the wizard, click all the way to the end and give this rule a name.

**C) Add an exception rule to the NSG:**

In an Azure PowerShell command prompt, type out the following command:

```
Get-AzureNetworkSecurityGroup -Name "NSG-lockdown" |
Set-AzureNetworkSecurityRule -Name "allow-proxy " -Action Allow -Protocol TCP -Type Outbound -Priority 200 -SourceAddressPrefix "10.0.0.5/32" -SourcePortRange "*" -DestinationAddressPrefix Internet -DestinationPortRange "80-443"
```

This command adds an exception to the NSG, which allows TCP traffic from any port on 10.0.0.5 to any Internet address on port 80 (HTTP) or 443 (HTTPS). If you need to hit a specific port in the public Internet, make sure that you add that to the ```-DestinationPortRange``` as well.

*Ensure that you replace the names in the example with the details appropriate to your deployment.*

## 3. VM Agent

![VM Agent](./media/backup-azure-vms-prepare/step3.png)

Before you can back up the Azure virtual machine, you should ensure that the Azure VM Agent is correctly installed on the virtual machine. Since the VM Agent is an optional component at the time that the virtual machine is created, ensure that the check box for the VM Agent is selected before the virtual machine is provisioned.

### Manual installation and update

The VM Agent is already present in VMs that are created from the Azure gallery. However, virtual machines that are migrated from on-premises datacenters would not have the VM Agent installed. For such VMs, the VM Agent needs to be installed explicitly. Read more about [installing the VM Agent on an existing VM](http://blogs.msdn.com/b/mast/archive/2014/04/08/install-the-vm-agent-on-an-existing-azure-vm.aspx).

| **Operation** | **Windows** | **Linux** |
| --- | --- | --- |
| Installing the VM Agent | <li>Download and install the [agent MSI](http://go.microsoft.com/fwlink/?LinkID=394789&clcid=0x409). You will need Administrator privileges to complete the installation. <li>[Update the VM property](http://blogs.msdn.com/b/mast/archive/2014/04/08/install-the-vm-agent-on-an-existing-azure-vm.aspx) to indicate that the agent is installed. | <li> Install the latest [Linux Agent](https://github.com/Azure/WALinuxAgent) from GitHub. You will need Administrator privileges to complete the installation. <li> [Update the VM property](http://blogs.msdn.com/b/mast/archive/2014/04/08/install-the-vm-agent-on-an-existing-azure-vm.aspx) to indicate that the agent is installed. |
| Updating the VM Agent | Updating the VM Agent is as simple as reinstalling the [VM Agent binaries](http://go.microsoft.com/fwlink/?LinkID=394789&clcid=0x409). <br><br>Ensure that no backup operation is running while the VM Agent is being updated. | Follow the instructions on [updating the Linux VM Agent ](../virtual-machines-linux-update-agent.md). <br><br>Ensure that no backup operation is running while the VM Agent is being updated. |
| Validating the VM Agent installation | <li>Navigate to the *C:\WindowsAzure\Packages* folder in the Azure VM. <li>You should find the WaAppAgent.exe file present.<li> Right-click the file, go to **Properties**, and then select the **Details** tab. The Product Version field should be 2.6.1198.718 or higher. | - |


Learn about the [VM Agent](https://go.microsoft.com/fwLink/?LinkID=390493&clcid=0x409) and [how to install it](http://azure.microsoft.com/blog/2014/04/15/vm-agent-and-extensions-part-2/).

### Backup extension

To back up the virtual machine, the Azure Backup service installs an extension to the VM Agent. The Azure Backup service seamlessly upgrades and patches the backup extension without additional user intervention.

The backup extension is installed if the VM is running. A running VM also provides the greatest chance of getting an application-consistent recovery point. However, the Azure Backup service will continue to back up the VM--even if it is turned off, and the extension could not be installed (aka Offline VM). In this case, the recovery point will be *crash consistent* as discussed above.


## Limitations

- Backup of Azure Resource Manager-based (aka IaaS V2) virtual machines is not supported.
- Backup of virtual machines with more than 16 data disks is not supported.
- Backup of virtual machines using Premium storage is not supported.
- Backup of virtual machines with a reserved IP address and no defined endpoint is not supported.
- Replacing an existing virtual machine during restore is not supported. First delete the existing virtual machine and any associated disks, and then restore the data from backup.
- Cross-region backup and restore is not supported.
- Virtual machine backup using the Azure Backup service is supported in all public regions of Azure (see the [checklist](http://azure.microsoft.com/regions/#services) of supported regions). If the region that you are looking for is unsupported today, it will not appear in the dropdown list during vault creation.
- Virtual machine backup using the Azure Backup service is supported only for select operating system versions:
  - **Linux**: See [the list of distributions that are endorsed by Azure](../virtual-machines-linux-endorsed-distributions.md). Other Bring-Your-Own-Linux distributions also should work as long as the VM Agent is available on the virtual machine.
  - **Windows Server**:  Versions older than Windows Server 2008 R2 are not supported.
- Restoring a domain controller (DC) VM that is part of a multi-DC configuration is supported only through PowerShell. Read more about [restoring a multi-DC domain controller](backup-azure-restore-vms.md#restoring-domain-controller-vms).
- Restoring virtual machines that have the following special network configurations is supported only through PowerShell. VMs that you create by using the restore workflow in the UI will not have these network configurations after the restore operation is complete. To learn more, see [Restoring VMs with special network configurations](backup-azure-restore-vms.md#restoring-vms-with-special-netwrok-configurations).
	- Virtual machines under load balancer configuration (internal and external)
	- Virtual machines with multiple reserved IP addresses
	- Virtual machines with multiple network adapters

## Questions?
If you have questions, or if there is any feature that you would like to see included, [send us feedback](http://aka.ms/azurebackup_feedback).

## Next steps

- [Plan your VM backup infrastructure](backup-azure-vms-introduction.md)
- [Back up virtual machines](backup-azure-vms.md)
- [Manage virtual machine backups](backup-azure-manage-vms.md)
