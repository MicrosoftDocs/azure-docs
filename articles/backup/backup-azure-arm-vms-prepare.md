---
title: 'Azure Backup: Prepare to back up virtual machines | Microsoft Docs'

description: Make sure your environment is prepared for backing up virtual machines in Azure.

services: backup
documentationcenter: ''
author: markgalioto
manager: carmonm
editor: ''
keywords: backups; backing up;

ms.assetid: e87e8db2-b4d9-40e1-a481-1aa560c03395
ms.service: backup
ms.workload: storage-backup-recovery
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 2/7/2017
ms.author: markgal;trinadhk;

---
# Prepare your environment to back up Resource Manager-deployed virtual machines
> [!div class="op_single_selector"]
> * [Resource Manager model](backup-azure-arm-vms-prepare.md)
> * [Classic model](backup-azure-vms-prepare.md)
>
>

This article provides the steps for preparing your environment to back up a Resource Manager-deployed virtual machine (VM). The steps shown in the procedures use the Azure portal.  

The Azure Backup service has two types of vaults (back up vaults and recovery services vaults) for protecting your VMs. A backup vault protects VMs deployed using the Classic deployment model. A recovery services vault protects **both Classic-deployed or Resource Manager-deployed VMs**. You must use a Recovery Services vault to protect a Resource Manager-deployed VM.

> [!NOTE]
> Azure has two deployment models for creating and working with resources: [Resource Manager and Classic](../azure-resource-manager/resource-manager-deployment-model.md). See [Prepare your environment to back up Azure virtual machines](backup-azure-vms-prepare.md) for details on working with Classic deployment model VMs.
>
>

Before you can protect or back up a Resource Manager-deployed virtual machine (VM), make sure these prerequisites exist:

* Create a recovery services vault (or identify an existing recovery services vault) *in the same location as your VM*.
* Select a scenario, define the backup policy, and define items to protect.
* Check the installation of VM Agent on virtual machine.
* Check network connectivity
* For Linux VMs, in case you want to customize your backup environment for application consistent backups please follow the [steps to configure pre-snapshot and post-snapshot scripts](https://docs.microsoft.com/azure/backup/backup-azure-linux-app-consistent)

If you know these conditions already exist in your environment then proceed to the [Back up your VMs article](backup-azure-vms.md). If you need to set up, or check, any of these prerequisites, this article leads you through the steps to prepare that prerequisite.

##Supported operating system for backup
 * **Linux**: Azure Backup supports [a list of distributions that are endorsed by Azure](../virtual-machines/linux/endorsed-distros.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) except Core OS Linux. _Other Bring-Your-Own-Linux distributions also might work as long as the VM agent is available on the virtual machine and support for Python exists. However, we do not endorse those distributions for backup._
 * **Windows Server**:  Versions older than Windows Server 2008 R2 are not supported.

## Limitations when backing up and restoring a VM
Before you prepare your environment, please understand the limitations.

* Backing up virtual machines with more than 16 data disks is not supported.
* Backing up virtual machines with 4TB disks is not supported. 
* Backing up virtual machines with a reserved IP address and no defined endpoint is not supported.
* Backup of VMs encrypted using just BEK is not supported. Backup of Linux VMs encrypted using LUKS encryption is not supported.
* Backup of Linux virtual machines with Docker extension is not supported.
* Backup data doesn't include network mounted drives attached to VM.
* Replacing an existing virtual machine during restore is not supported. If you attempt to restore the VM when the VM exists, the restore operation fails.
* Cross-region backup and restore are not supported.
* You can back up virtual machines in all public regions of Azure (see the [checklist](https://azure.microsoft.com/regions/#services) of supported regions). If the region that you are looking for is unsupported today, it will not appear in the dropdown list during vault creation.
* Restoring a domain controller (DC) VM that is part of a multi-DC configuration is supported only through PowerShell. Read more about [restoring a multi-DC domain controller](backup-azure-restore-vms.md#restoring-domain-controller-vms).
* Restoring virtual machines that have the following special network configurations is supported only through PowerShell. VMs created using the restore workflow in the UI will not have these network configurations after the restore operation is complete. To learn more, see [Restoring VMs with special network configurations](backup-azure-restore-vms.md#restoring-vms-with-special-network-configurations).
  * Virtual machines under load balancer configuration (internal and external)
  * Virtual machines with multiple reserved IP addresses
  * Virtual machines with multiple network adapters

## Create a recovery services vault for a VM
A recovery services vault is an entity that stores the backups and recovery points that have been created over time. The recovery services vault also contains the backup policies associated with the protected virtual machines.

To create a recovery services vault:

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. On the Hub menu, click **Browse** and in the list of resources, type **Recovery Services**. As you begin typing, the list will filter based on your input. Click **Recovery Services vault**.

    ![Click the Browse button and type Recovery Services. When you see the Recovery Services vault option, click it to open the Recovery Services vault blade.](./media/backup-azure-arm-vms-prepare/browse-to-rs-vaults-updated.png) <br/>

    The list of Recovery Services vaults is displayed.
3. On the **Recovery Services vaults** menu, click **Add**.

    ![Create Recovery Services Vault step 2](./media/backup-azure-arm-vms-prepare/rs-vault-menu.png)

    The Recovery Services vault blade opens, prompting you to provide a **Name**, **Subscription**, **Resource group**, and **Location**.

    ![Create Recovery Services vault step 5](./media/backup-azure-arm-vms-prepare/rs-vault-attributes.png)
4. For **Name**, enter a friendly name to identify the vault. The name needs to be unique for the Azure subscription. Type a name that contains between 2 and 50 characters. It must start with a letter, and can contain only letters, numbers, and hyphens.
5. Click **Subscription** to see the available list of subscriptions. If you are not sure which subscription to use, use the default (or suggested) subscription. There will be multiple choices only if your organizational account is associated with multiple Azure subscriptions.
6. Click **Resource group** to see the available list of Resource groups, or click **New** to create a new Resource group. For complete information on Resource groups, see [Azure Resource Manager overview](../azure-resource-manager/resource-group-overview.md)
7. Click **Location** to select the geographic region for the vault. The vault **must** be in the same region as the virtual machines that you want to protect.

   > [!IMPORTANT]
   > If you are unsure of the location in which your VM exists, close out of the vault creation dialog, and go to the list of Virtual Machines in the portal. If you have virtual machines in multiple regions, you will need to create a Recovery Services vault in each region. Create the vault in the first location before going to the next location. There is no need to specify storage accounts to store the backup data--the Recovery Services vault and the Azure Backup service handle this automatically.
   >
   >

8. Click **Create**. It can take a while for the Recovery Services vault to be created. Monitor the status notifications in the upper right-hand area in the portal. Once your vault is created, it appears in the list of Recovery Services vaults. If you don't see your vault, click **Refresh** to

    ![List of backup vaults](./media/backup-azure-arm-vms-prepare/rs-list-of-vaults.png)

    Now that you've created your vault, learn how to set the storage replication.

## Set Storage Replication
The storage replication option allows you to choose between geo-redundant storage and locally redundant storage. By default, your vault has geo-redundant storage. Leave the option set to geo-redundant storage if this is your primary backup. Choose locally redundant storage if you want a cheaper option that isn't quite as durable.

To edit the storage replication setting:

1. On the **Recovery Services vaults** blade, select your vault.
    When you click your vault, the Settings blade (*which has the name of the vault at the top*) and the vault details blade opens.

    ![choose your vault from the list of backup vaults](./media/backup-azure-arm-vms-prepare/new-vault-settings-blade.png)

2. On the **Settings** blade, use the vertical slider to scroll down to the **Manage** section. Click **Backup Infrastructure** to open its blade. In the **General** section click **Backup Configuration** to open its blade. On the **Backup Configuration** blade, choose the storage replication option for your vault. By default, your vault has geo-redundant storage. If you change the Storage replication type, click **Save**.

    ![List of backup vaults](./media/backup-azure-arm-vms-prepare/full-blade.png)

     If you are using Azure as a primary backup storage endpoint, continue using geo-redundant storage. If you are using Azure as a non-primary backup storage endpoint, then choose locally redundant storage. Read more about [geo-redundant](../storage/storage-redundancy.md#geo-redundant-storage) and [locally redundant](../storage/storage-redundancy.md#locally-redundant-storage) storage options in the [Azure Storage replication overview](../storage/storage-redundancy.md).
    After choosing the storage option for your vault, you are ready to associate the VM with the vault. To begin the association, you should discover and register the Azure virtual machines.

## Select a backup goal, set policy and define items to protect
Before registering a VM with a vault, run the discovery process to ensure that any new virtual machines that have been added to the subscription are identified. The process queries Azure for the list of virtual machines in the subscription, along with additional information like the cloud service name and the region. In the Azure portal, scenario refers to what you are going to put into the recovery services vault. Policy is the schedule for how often and when recovery points are taken. Policy also includes the retention range for the recovery points.

1. If you already have a Recovery Services vault open, proceed to step 2. If you do not have a Recovery Services vault open, then open the [Azure portal](https://portal.azure.com/) and on the Hub menu, click **More services**.

   * In the list of resources, type **Recovery Services**.
   * As you begin typing, the list will filter based on your input. When you see **Recovery Services vaults**, click it.

     ![Create Recovery Services Vault step 1](./media/backup-azure-arm-vms-prepare/browse-to-rs-vaults-updated.png) <br/>

     The list of Recovery Services vaults appears. If there are no vaults in your subscription, this list will be empty.

    ![View of the Recovery Services vaults list](./media/backup-azure-arm-vms-prepare/rs-list-of-vaults.png)

   * From the list of Recovery Services vaults, select a vault to open its dashboard.

     The Settings blade and the vault dashboard for the chosen vault, opens.

     ![Open vault blade](./media/backup-azure-arm-vms-prepare/new-vault-settings-blade.png)
2. On the vault dashboard menu click **Backup** to open the Backup blade.

    ![Open Backup blade](./media/backup-azure-arm-vms-prepare/backup-button.png)

    The Backup and Backup Goal blades open.

    ![Open Scenario blade](./media/backup-azure-arm-vms-prepare/select-backup-goal-1.png)

3. On the Backup Goal blade, set **Where is your workload running** to Azure and **What do you want to backup** to Virtual machine, then click **OK**.

    This registers the VM extension with the vault. The Backup Goal blade closes and the **Backup policy** blade opens.

    ![Open Scenario blade](./media/backup-azure-arm-vms-prepare/select-backup-goal-2.png)
4. On the Backup policy blade, select the backup policy you want to apply to the vault.

    ![Select backup policy](./media/backup-azure-arm-vms-prepare/setting-rs-backup-policy-new.png)

    The details of the default policy are listed under the drop-down menu. If you want to create a new policy, select **Create New** from the drop-down menu. For instructions on defining a backup policy, see [Defining a backup policy](backup-azure-vms-first-look-arm.md#defining-a-backup-policy).
    Click **OK** to associate the backup policy with the vault.

    The Backup policy blade closes and the **Select virtual machines** blade opens.
5. In the **Select virtual machines** blade, choose the virtual machines to associate with the specified policy and click **OK**.

    ![Select workload](./media/backup-azure-arm-vms-prepare/select-vms-to-backup.png)

    The selected virtual machine is validated. If you do not see the virtual machines that you expected to see, check that they exist in the same Azure location as the Recovery Services vault and are not already protected in another vault. The location of the Recovery Services vault is shown on the vault dashboard.

6. Now that you have defined all settings for the vault, in the Backup blade click **Enable Backup**. This deploys the policy to the vault and the VMs. This does not create the initial recovery point for the virtual machine.

    ![Enable Backup](./media/backup-azure-arm-vms-prepare/vm-validated-click-enable.png)

After successfully enabling the backup, your backup policy will execute on schedule. If you would like to generate an on-demand backup job to back up the virtual machines now, see [Triggering the Backup job](./backup-azure-arm-vms.md#triggering-the-backup-job).

If you have problems registering the virtual machine, see the following information on installing the VM Agent and on Network connectivity. You probably don't need the following information if you are protecting virtual machines created in Azure. However if you migrated your virtual machines into Azure, then be sure you have properly installed the VM agent and that your virtual machine can communicate with the virtual network.

## Install the VM Agent on the virtual machine
The Azure VM Agent must be installed on the Azure virtual machine for the Backup extension to work. If your VM was created from the Azure gallery, then the VM Agent is already present on the virtual machine. This information is provided for the situations where you are *not* using a VM created from the Azure gallery - for example you migrated a VM from an on-premises datacenter. In such a case, the VM Agent needs to be installed in order to protect the virtual machine. Learn about the [VM Agent](../virtual-machines/windows/classic/agents-and-extensions.md#azure-vm-agents-for-windows-and-linux).

If you have problems backing up the Azure VM, check that the Azure VM Agent is correctly installed on the virtual machine (see the table below). The following table provides additional information about the VM Agent for Windows and Linux VMs.

| **Operation** | **Windows** | **Linux** |
| --- | --- | --- |
| Installing the VM Agent |Download and install the [agent MSI](http://go.microsoft.com/fwlink/?LinkID=394789&clcid=0x409). You will need Administrator privileges to complete the installation. |<li> Install the latest [Linux agent](../virtual-machines/linux/agent-user-guide.md). You will need Administrator privileges to complete the installation. We recommend installing agent from your distribution repository. We **do not recommend** installing Linux VM agent directly from github.  |
| Updating the VM Agent |Updating the VM Agent is as simple as reinstalling the [VM Agent binaries](http://go.microsoft.com/fwlink/?LinkID=394789&clcid=0x409). <br>Ensure that no backup operation is running while the VM agent is being updated. |Follow the instructions on [updating the Linux VM Agent](../virtual-machines/linux/update-agent.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json). We recommend updating agent from your distribution repository. We **do not recommend** updating Linux VM agent directly from github.<br>Ensure that no backup operation is running while the VM Agent is being updated. |
| Validating the VM Agent installation |<li>Navigate to the *C:\WindowsAzure\Packages* folder in the Azure VM. <li>You should find the WaAppAgent.exe file present.<li> Right-click the file, go to **Properties**, and then select the **Details** tab. The Product Version field should be 2.6.1198.718 or higher. |N/A |

### Backup extension
Once the VM Agent is installed on the virtual machine, the Azure Backup service installs the backup extension to the VM Agent. The Azure Backup service seamlessly upgrades and patches the backup extension.

The backup extension is installed by the Backup service whether or not the VM is running. A running VM provides the greatest chance of getting an application-consistent recovery point. However, the Azure Backup service continues to back up the VM even if it is turned off, and the extension could not be installed. This is known as Offline VM. In this case, the recovery point will be *crash consistent*.

## Network connectivity
In order to manage the VM snapshots, the backup extension needs connectivity to the Azure public IP addresses. Without the right Internet connectivity, the virtual machine's HTTP requests time out and the backup operation fails. If your deployment has access restrictions in place (through a network security group (NSG), for example), then choose one of these options for providing a clear path for backup traffic:

* [Whitelist the Azure datacenter IP ranges](http://www.microsoft.com/en-us/download/details.aspx?id=41653) - see the article for instructions on how to whitelist the IP addresses.
* Deploy an HTTP proxy server for routing traffic.

When deciding which option to use, the trade-offs are between manageability, granular control, and cost.

| Option | Advantages | Disadvantages |
| --- | --- | --- |
| Whitelist IP ranges |No additional costs.<br><br>For opening access in an NSG, use the <i>Set-AzureNetworkSecurityRule</i> cmdlet. |Complex to manage as the impacted IP ranges change over time.<br><br>Provides access to the whole of Azure, and not just Storage. |
| HTTP proxy |Granular control in the proxy over the storage URLs allowed.<br>Single point of Internet access to VMs.<br>Not subject to Azure IP address changes. |Additional costs for running a VM with the proxy software. |

### Whitelist the Azure datacenter IP ranges
To whitelist the Azure datacenter IP ranges, please see the [Azure website](http://www.microsoft.com/en-us/download/details.aspx?id=41653) for details on the IP ranges, and instructions.

### Using an HTTP proxy for VM backups
When backing up a VM, the backup extension on the VM sends the snapshot management commands to Azure Storage using an HTTPS API. Route the backup extension traffic through the HTTP proxy since it is the only component configured for access to the public Internet.

> [!NOTE]
> There is no recommendation for the proxy software that should be used. Ensure that you pick a proxy that is compatible with the configuration steps below.
>
>

The example image below shows the three configuration steps necessary to use an HTTP proxy:

* App VM routes all HTTP traffic bound for the public Internet through Proxy VM.
* Proxy VM allows incoming traffic from VMs in the virtual network.
* The Network Security Group (NSG) named NSF-lockdown needs a security rule allowing outbound Internet traffic from Proxy VM.

![NSG with HTTP proxy deployment diagram](./media/backup-azure-vms-prepare/nsg-with-http-proxy.png)

To use an HTTP proxy to communicating to the public Internet, follow these steps:

#### Step 1. Configure outgoing network connections
###### For Windows machines
This will setup proxy server configuration for Local System Account.

1. Download [PsExec](https://technet.microsoft.com/sysinternals/bb897553)
2. Run following command from elevated prompt,

     ```
     psexec -i -s "c:\Program Files\Internet Explorer\iexplore.exe"
     ```
     It will open internet explorer window.
3. Go to Tools -> Internet Options -> Connections -> LAN settings.
4. Verify proxy settings for System account. Set Proxy IP and port.
5. Close Internet Explorer.

This will set up a machine-wide proxy configuration, and will be used for any outgoing HTTP/HTTPS traffic.

If you have setup a proxy server on a current user account(not a Local System Account), use the following script to apply them to SYSTEMACCOUNT:

```
   $obj = Get-ItemProperty -Path Registry::”HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Internet Settings\Connections"
   Set-ItemProperty -Path Registry::”HKEY_USERS\S-1-5-18\Software\Microsoft\Windows\CurrentVersion\Internet Settings\Connections" -Name DefaultConnectionSettings -Value $obj.DefaultConnectionSettings
   Set-ItemProperty -Path Registry::”HKEY_USERS\S-1-5-18\Software\Microsoft\Windows\CurrentVersion\Internet Settings\Connections" -Name SavedLegacySettings -Value $obj.SavedLegacySettings
   $obj = Get-ItemProperty -Path Registry::”HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Internet Settings"
   Set-ItemProperty -Path Registry::”HKEY_USERS\S-1-5-18\Software\Microsoft\Windows\CurrentVersion\Internet Settings" -Name ProxyEnable -Value $obj.ProxyEnable
   Set-ItemProperty -Path Registry::”HKEY_USERS\S-1-5-18\Software\Microsoft\Windows\CurrentVersion\Internet Settings" -Name Proxyserver -Value $obj.Proxyserver
```

> [!NOTE]
> If you observe "(407) Proxy Authentication Required" in proxy server log, check your authentication is setup correctly.
>
>

###### For Linux machines
Add the following line to the ```/etc/environment``` file:

```
http_proxy=http://<proxy IP>:<proxy port>
```

Add the following lines to the ```/etc/waagent.conf``` file:

```
HttpProxy.Host=<proxy IP>
HttpProxy.Port=<proxy port>
```

#### Step 2. Allow incoming connections on the proxy server:
1. On the proxy server, open Windows Firewall. The easiest way to access the firewall is to search for Windows Firewall with Advanced Security.

    ![Open the Firewall](./media/backup-azure-vms-prepare/firewall-01.png)
2. In the Windows Firewall dialog, right-click **Inbound Rules** and click **New Rule...**.

    ![Create a new rule](./media/backup-azure-vms-prepare/firewall-02.png)
3. In the **New Inbound Rule Wizard**, choose the **Custom** option for the **Rule Type** and click **Next**.
4. On the page to select the **Program**, choose **All Programs** and click **Next**.
5. On the **Protocol and Ports** page, enter the following information and click **Next**:

    ![Create a new rule](./media/backup-azure-vms-prepare/firewall-03.png)

   * for *Protocol type* choose *TCP*
   * for *Local port* choose *Specific Ports*, in the field below specify the ```<Proxy Port>``` that has been configured.
   * for *Remote port* select *All Ports*

     For the rest of the wizard, click all the way to the end and give this rule a name.

#### Step 3. Add an exception rule to the NSG:
In an Azure PowerShell command prompt, enter the following command:

The following command adds an exception to the NSG. This exception allows TCP traffic from any port on 10.0.0.5 to any Internet address on port 80 (HTTP) or 443 (HTTPS). If you require a specific port in the public Internet, be sure to add that port to the ```-DestinationPortRange``` as well.

```
Get-AzureNetworkSecurityGroup -Name "NSG-lockdown" |
Set-AzureNetworkSecurityRule -Name "allow-proxy " -Action Allow -Protocol TCP -Type Outbound -Priority 200 -SourceAddressPrefix "10.0.0.5/32" -SourcePortRange "*" -DestinationAddressPrefix Internet -DestinationPortRange "80-443"
```


*These steps use specific names and values for this example. Please use the names and values for your deployment when entering, or cutting and pasting details into your code.*

Now that you know you have network connectivity, you are ready to back up your VM. See [Back up Resource Manager-deployed VMs](backup-azure-arm-vms.md).

## Questions?
If you have questions, or if there is any feature that you would like to see included, [send us feedback](http://aka.ms/azurebackup_feedback).

## Next steps
Now that you have prepared your environment for backing up your VM, your next logical step is to create a backup. The planning article provides more detailed information about backing up VMs.

* [Back up virtual machines](backup-azure-vms.md)
* [Plan your VM backup infrastructure](backup-azure-vms-introduction.md)
* [Manage virtual machine backups](backup-azure-manage-vms.md)
