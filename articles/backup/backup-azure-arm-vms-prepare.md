---
title: Prepare to back up Azure VMs with Azure Backup
description: Describes how to prepare Azure VMs for backup with the Azure Backup service
services: backup
author: rayne-wiselman
manager: carmonm
ms.service: backup
ms.topic: conceptual
ms.date: 12/17/2018
ms.author: raynew
---
# Prepare to back up Azure VMs

This article describes how to prepare for backing up an Azure VM using an [Azure Backup](backup-introduction-to-azure-backup.md) Recovery Services vault. Preparing for backup includes:


> [!div class="checklist"]
> * Before you start, review supported scenarios and limitations.
> * Verify prerequisites, including Azure VM requirements and network connectivity.
> * Create a vault.
> * Select how storage replicates.
> * Discover VMs, configure backup settings and policy.
> * Enable backup for selected VMs


> [!NOTE]
   > This article describes how to back up Azure VMs by setting up a vault and selecting VMs to back up. It's useful if you want to back up multiple VMs. You can also back up an Azure VM directly from its VM settings. [Learn more](backup-azure-vms-first-look-arm.md)

## Before you start

1. [Get an overview](backup-azure-vms-introduction.md) of Azure Backup for Azure VMs.
2. Review support details and limitations below.

   **Support/Limitation** | **Details**
   --- | ---
   **Windows OS** | Windows Server 2008 R2 64-bit or later.<br/><br/> Windows Client 7 64-bit or later.
   **Linux OS** | You can back up 64-bit Linux distributions [supported by Azure](../virtual-machines/linux/endorsed-distros.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json), with the exception of CoreOS Linux.<br/><br/> Review Linux operating systems that [support file restore](backup-azure-restore-files-from-vm.md#for-linux-os).<br/><br/> Other Linux distributions might work, as long as the VM agent is available on the VM, and support for Python exists. However, these distributions aren't supported.
   **Region** | You can back up Azure VMs in all [supported regions](https://azure.microsoft.com/regions/#services). If a region is unsupported, you won't be able to select it when you create the vault.<br/><br/> You can't back up and restore across Azure regions. Only within a single region.
   **Data disk limit** | You can't back up VMs with more than 16 data disks.
   **Shared storage** | We don't recommend backing up VMs using CSV or Scale-Out File Server. CSV writers are likely to fail.
   **Linux encryption** | Backing up Linux VMs encrypted with Linux Unified Key Setup (LUKS) isn't supported.
   **VM consistency** | Azure Backup doesn't support multi-VM consistency.
   **Networking** | Backed up data doesn't include network mounted drives attached to a VM.<br/><br/>
   **Snapshots** | Taking snapshots on a write accelerator-enabled disk isn't supported. It blocks Azure Backup from taking an app-consistent snapshot of all VM disks.
   **PowerShell** | There are a number of actions that are only available with PowerShell:<br/><br/> - Restoring VMs managed by internal/external load balancers, or with multiple reserved IP addresses or adapters. [Learn more](backup-azure-arm-restore-vms.md#restore-vms-with-special-network-configurations)<br/><br/> - Restoring a domain controller VM in a multi domain controller configuration. [Learn more](backup-azure-arm-restore-vms.md#restore-domain-controller-vms).
   **System time** | Azure Backup doesn't support automatic clock adjustment for daylight-saving changes for Azure VM backups. Modify backup policies manually as required.
   **Storage accounts** | If you're using a network restricted storage account, make sure that you enable **Allow trusted Microsoft services to access this storage account** so that Azure Backup service can access the account. Item level recovery isn't supported for network restricted storage accounts.<br/><br/> In a storage account, make sure that **Firewalls and virtual networks** settings allow access from **All networks**.


## Prerequisites

- You must create the vault in the same region as the Azure VMs you want to back up.
- Check the Azure VM regions before you start.
    - If you have VMs in multiple regions, create a vault in each region.
    - You don't need to specify storage accounts to store the backup data. The vault and the Azure Backup service handle that automatically.
- Verify that the VM agent is installed on Azure VMs that you want to back up.

### Install the VM agent

To enable backup, Azure Backup installs a backup extension (VM Snapshot or VM Snapshot Linux) to the VM agent that runs on the Azure VM.
    -  The Azure VM Agent is installed by default on any Windows VM deployed from an Azure Marketplace image. When you deploy an Azure Marketplace image from the portal, PowerShell, CLI, or an Azure Resource Manager template, the Azure VM Agent is also installed.
    - If you migrated a VM from on-premises, the agent isn't installed, and you need to install it before you can enable backup for the VM.

If needed, install the agent as follows.

**VM** | **Details**
--- | ---
**Windows VMs** | [Download and install](https://go.microsoft.com/fwlink/?LinkID=394789&clcid=0x409) the agent with admin permissions on the machine.<br/><br/> To verify the installation, in *C:\WindowsAzure\Packages* on the VM, right-click the WaAppAgent.exe > **Properties**, > **Details** tab. **Product Version** should be 2.6.1198.718 or higher.
**Linux VMs** | Installation using an RPM or a DEB package from your distribution's package repository is the preferred method of installing and upgrading the Azure Linux Agent. All the [endorsed distribution providers](https://docs.microsoft.com/azure/virtual-machines/linux/endorsed-distros) integrate the Azure Linux agent package into their images and repositories. The agent is available on [GitHub](https://github.com/Azure/WALinuxAgent), but we don't recommend installing from there.
If you have problems backing up the Azure VM, use the following table to check that the Azure VM agent is correctly installed on the virtual machine. The table provides additional information about the VM agent for Windows and Linux VMs.

### Establish network connectivity

The Backup extension running on the VM must have outbound access to Azure public IP addresses.

> [!NOTE]
> No explicit outbound network access is required for Azure VM to communicate with Azure Backup Service. However, certain older virtual machines may face issues and fail with the error **ExtensionSnapshotFailedNoNetwork**, to overcome this error, choose one of the following options to allow the backup extension to communicate to Azure public IP addresses to provide a clear path for backup traffic.

- **NSG rules**: Allow the [Azure datacenter IP ranges](https://www.microsoft.com/download/details.aspx?id=41653). You can add a rule that allows access to the Azure Backup service using a [service tag](backup-azure-arm-vms-prepare.md#set-up-an-nsg-rule-to-allow-outbound-access-to-azure), instead of individually allowing every address range, and managing them over time. For more information on service tag, see this [article](../virtual-network/security-overview.md#service-tags).
- **Proxy**: Deploy an HTTP proxy server for routing traffic.
- **Azure Firewall**: Allow traffic through the Azure Firewall on the VM, using an FQDN tag for the Azure Backup service

When deciding between options, consider the tradeoffs.

**Option** | **Advantages** | **Disadvantages**
--- | --- | ---
**NSG** | No additional costs. Simple to manage with service tags | Provides access to the whole of Azure, and not just storage. |
**HTTP proxy** | Granular control over the storage URLs is allowed.<br/><br/> Single point of internet access for VMs.<br/><br/> Additional costs for proxy.
**FQDN tags** | Simple to use if you have Azure Firewall set up in a VNet subnet | Can't create your own FQDN tags, or modify FQDNs in a tag.

If you use Azure Managed Disks, you might need an additional port opening (port 8443) on the firewalls.

### Set up an NSG rule to allow outbound access to Azure

If your Azure VM has access managed by an NSG, allow outbound access for the backup storage to the required ranges and ports.

1. In the VM > **Networking**, click **Add outbound port rule**.

  - If you have a rule denying access, the new allow rule must be higher. For example, if you have a **Deny_All** rule set at priority 1000, your new rule must be set to less than 1000.
2. In **Add outbound security rule**, click **Advanced**.
3. In **Source**, select **VirtualNetwork**.
4. In **Source port ranges**, type in an asterisk (*) to allow outbound access from any port.
5. In **Destination**, select **Service Tag**. From the list, select Storage.<region>. The region is the region in which the vault, and the VMs you want to back up, are located.
6. In **Destination port ranges**, select the port.

    - VM with unmanaged disks and unencrypted storage account: 80
    - VM with unmanaged disks and encrypted storage account: 443 (default setting)
    - Managed VM: 8443.
7. In **Protocol**, select **TCP**.
8. In **Priority**, give it a priority value less than any higher deny rules.
9. Provide a name and description for the rule, and click **OK**.

You can apply the NSG rule to multiple VMs to allow outbound access to Azure for Azure Backup.

This video walks you through the process.

>[!VIDEO https://www.youtube.com/embed/1EjLQtbKm1M]

> [!WARNING]
> Storage service tags are in preview. They are available only in specific regions. For a list of regions, see [Service tags for storage](../virtual-network/security-overview.md#service-tags).

### Route backup traffic through a proxy

You can route backup traffic through a proxy, and then give the proxy access to the required Azure ranges.
You should configure your proxy VM to allow the following:

- The Azure VM should route all HTTP traffic bound for the public internet through the proxy.
- The proxy should allow incoming traffic from VMs in the applicable virtual network (VNet).
- The NSG **NSF-lockdown** needs a rule that allows outbound internet traffic from the proxy VM.

Here's how you need to set up the proxy. We use example values. You should replace them with your own.

#### Set up a system account proxy
If you don't have a system account proxy, set one up as follows:

1. Download [PsExec](https://technet.microsoft.com/sysinternals/bb897553).
2. Run **PsExec.exe -i -s cmd.exe** to run the command prompt under a system account.
3. Run the browser in system context. For example: **PROGRAMFILES%\Internet Explorer\iexplore.exe** for Internet Explorer.  
4. Define the proxy settings.
    - On Linux machines:
        - Add this line to the **/etc/environment** file:
            - **http_proxy=http://proxy IP address:proxy port**
        - Add these lines to the **/etc/waagent.conf** file:
            - **HttpProxy.Host=proxy IP address**
            - **HttpProxy.Port=proxy port**
    - On Windows machines, in the browser settings, specify that a proxy should be used. If you're currently using a proxy on a user account, you can use this script to apply the setting at the system account level.
        ```
       $obj = Get-ItemProperty -Path Registry::”HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Internet Settings\Connections"
       Set-ItemProperty -Path Registry::”HKEY_USERS\S-1-5-18\Software\Microsoft\Windows\CurrentVersion\Internet Settings\Connections" -Name DefaultConnectionSettings -Value $obj.DefaultConnectionSettings
       Set-ItemProperty -Path Registry::”HKEY_USERS\S-1-5-18\Software\Microsoft\Windows\CurrentVersion\Internet Settings\Connections" -Name SavedLegacySettings -Value $obj.SavedLegacySettings
       $obj = Get-ItemProperty -Path Registry::”HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Internet Settings"
       Set-ItemProperty -Path Registry::”HKEY_USERS\S-1-5-18\Software\Microsoft\Windows\CurrentVersion\Internet Settings" -Name ProxyEnable -Value $obj.ProxyEnable
       Set-ItemProperty -Path Registry::”HKEY_USERS\S-1-5-18\Software\Microsoft\Windows\CurrentVersion\Internet Settings" -Name Proxyserver -Value $obj.Proxyserver

        ```

#### Allow incoming connections on the proxy

Allow incoming connections in the proxy settings.

- For example, open **Windows Firewall with Advanced Security**.
    - Right-click **Inbound Rules** > **New Rule**.
    - In **Rule Type** select **Custom** > **Next**.
    - In **Program**, select **All Programs** > **Next**.
    - In **Protocols and Ports** set the type to **TCP**, **Local Ports** to **Specific Ports**, and **Remote port** to **All Ports**.
    - Finish the wizard and specify a name for the rule.

#### Add an exception rule to the NSG

On the NSG **NSF-lockdown**, allow traffic from any port on 10.0.0.5 to any internet address on port 80 (HTTP) or 443 (HTTPS).

- The following PowerShell script provides an example for allowing traffic.
- Instead of allowing outbound to all public internet addresses, you can specify an IP address range (-DestinationPortRange), or use the storage.region service tag.   

    ```
    Get-AzureNetworkSecurityGroup -Name "NSG-lockdown" |
    Set-AzureNetworkSecurityRule -Name "allow-proxy " -Action Allow -Protocol TCP -Type Outbound -Priority 200 -SourceAddressPrefix "10.0.0.5/32" -SourcePortRange "*" -DestinationAddressPrefix Internet -DestinationPortRange "80-443"
    ```

### Allow firewall access with FQDN tag

You can set up the Azure Firewall to allow outbound access for network traffic to Azure Backup.

- [Learn about](https://docs.microsoft.com/azure/firewall/tutorial-firewall-deploy-portal) deploying Azure Firewall.
- [Read about](https://docs.microsoft.com/azure/firewall/fqdn-tags) FQDN tags.

## Create a vault

A Recovery Services vault for Backup stores backups and recovery points created over time, and stores backup policies associated with backed up machines. Create a vault as follows:

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. On the **Hub** menu, select **Browse**, and type **Recovery Services**. As you begin typing, your input filters the list of resources. Select **Recovery Services vaults**.

    ![Typing in the box and selecting "Recovery Services vaults" in the results](./media/backup-azure-arm-vms-prepare/browse-to-rs-vaults-updated.png) <br/>

    The list of Recovery Services vaults appears.
3. On the **Recovery Services vaults** menu, select **Add**.

    ![Create Recovery Services Vault step 2](./media/backup-azure-arm-vms-prepare/rs-vault-menu.png)

    The **Recovery Services vaults** pane opens. It prompts you to provide information for **Name**, **Subscription**, **Resource group**, and **Location**.

    !["Recovery Services vaults" pane](./media/backup-azure-arm-vms-prepare/rs-vault-attributes.png)
4. In **Name**, enter a friendly name to identify the vault.
    - The name needs to be unique for the Azure subscription.
    - It can contain 2 to 50 characters.
    - It must start with a letter, and it can contain only letters, numbers, and hyphens.
5. Select **Subscription** to see the available list of subscriptions. If you're not sure which subscription to use, use the default (or suggested) subscription. There are multiple choices only if your work or school account is associated with multiple Azure subscriptions.
6. Select **Resource group** to see the available list of resource groups, or select **New** to create a new resource group. [Learn more](../azure-resource-manager/resource-group-overview.md) about resource groups.
7. Select **Location** to select the geographic region for the vault. The vault *must* be in the same region as the VMs that you want to back up.
8. Select **Create**.
    - It can take a while for the vault to be created.
    - Monitor the status notifications in the upper-right area of the portal.
    ![List of backup vaults](./media/backup-azure-arm-vms-prepare/rs-list-of-vaults.png)

After your vault is created, it appears in the list of Recovery Services vaults. If you don't see your vault, select **Refresh**.

## Set up storage replication

By default, your vault has [geo-redundant storage (GRS)](https://docs.microsoft.com/azure/storage/common/storage-redundancy-grs). We recommend GRS for your primary backup, but you can use[locally-redundant storage](https://docs.microsoft.com/azure/storage/common/storage-redundancy-lrs?toc=%2fazure%2fstorage%2fblobs%2ftoc.json) for a cheaper option.

Modify storage replication as follows:

1. In the vault > **Backup Infrastructure**, click **Backup Configuration**

   ![List of backup vaults](./media/backup-azure-arm-vms-prepare/full-blade.png)

2. In **Backup Configuration**, modify the storage redundancy method as required, and select **Save**.


## Configure backup

Discover VMs in the subscription, and configure backup.

1. In the vault > **Overview**, click **+Backup**

   ![Backup button](./media/backup-azure-arm-vms-prepare/backup-button.png)

   The **Backup** and **Backup Goal** panes open.

2. In **Backup Goal**> **Where is your workload running?**, select **Azure**. In **What do you want to backup?**, select **Virtual machine** >  **OK**. This registers the VM extension in the vault.

   ![Backup and Backup Goal panes](./media/backup-azure-arm-vms-prepare/select-backup-goal-1.png)

   This step registers the VM extension with the vault. The **Backup Goal** pane closes, and the **Backup policy** pane opens.

3. In **Backup policy**, select the policy that you want to associate with the vault. Then click **OK**.
    - The details of the default policy are listed under the drop-down menu.
    - Click **Create New** to create a policy. [Learn more](backup-azure-vms-first-look-arm.md#defining-a-backup-policy) about defining a policy.

    !["Backup" and "Backup policy" panes](./media/backup-azure-arm-vms-prepare/select-backup-goal-2.png)

4. In **Select virtual machines** pane, select the VMs that will use the specified backup policy > **OK**.

    - The selected VM is validated.
    - You can only select VMs in the same region as the vault. VMs can only be backed up in a single vault.

   !["Select virtual machines" pane](./media/backup-azure-arm-vms-prepare/select-vms-to-backup.png)

5. In **Backup**, select **Enable backup**.

   - This deploys the policy to the vault and to the VMs, and installs the backup extension on the VM agent running on the Azure VM.
   - This step doesn't create the initial recovery point for the VM.

   !["Enable backup" button](./media/backup-azure-arm-vms-prepare/vm-validated-click-enable.png)

After enabling backup:

- The backup policy runs in accordance with your backup schedule.
- The Backup service installs the backup extension whether or not the VM is running.
    - A running VM provides the greatest chance of getting an application-consistent recovery point.
    -  However, the VM is backed up even if it's turned off and the extension can't be installed. This is known as *offline VM*. In this case, the recovery point will be *crash consistent*.
- If you want to generate an on-demand backup for the VM immediately, in **Backup Items**, click the ellipsis (...) next to the VM > **Backup now**.


## Next steps

- Troubleshoot any issues that occur with the [Azure VM agents](backup-azure-troubleshoot-vm-backup-fails-snapshot-timeout.md) or [Azure VM backup](backup-azure-vms-troubleshoot.md).
- [Back up Azure VMs](backup-azure-vms-first-look-arm.md)
