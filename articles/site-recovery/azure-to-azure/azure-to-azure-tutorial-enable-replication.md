---
title: Enable replication of Azure VMs in Site Recovery (Preview)  | Microsoft Docs
description: This tutorial provides the steps required to configure replication of Azure virtual machines (VMs) to a different region.
services: site-recovery
author: rajani-janaki-ram
manager: carmonm

ms.service: site-recovery
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: storage-backup-recovery
ms.date: 08/12/2017
ms.author: rajanaki
ms.custom: mvc
---
# Enable replication of Azure VMs for disaster recovery

This tutorial provides the steps required to configure replication of existing Azure virtual
machines (VMs) to a different region.

## Create a vault

The Recovery Services vault should be created in the location where you want your VMs to replicate.
For example, if your target location is the central US, create the vault in **Central US**.

1. Sign in to the [Azure portal](https://portal.azure.com) > **Recovery Services**.
2. Click **New** > **Monitoring & Management** > **Backup and Site Recovery**.
3. In **Name**, specify a friendly name to identify the vault. If you have more than one
   subscription, select the appropriate one.
4. Create a resource group or select an existing one. Specify an Azure region. To check supported
   regions, see geographic availability in
   [Azure Site Recovery Pricing Details](https://azure.microsoft.com/pricing/details/site-recovery/).
5. If you want to quickly access the vault from the dashboard, click **Pin to dashboard** and then
   click **Create**.

   ![New vault](./media/azure-to-azure-tutorial-enable-replication/new-vault-settings.png)

   The new vault is added to the **Dashboard** under **All resources** and on the main **Recovery
   Services vaults** page.

## Verify target resources

1. Verify that your Azure subscription allows you to create VMs in the target region used for
   disaster recovery. Contact support to enable the required quota.

2. Make sure your subscription has enough resources to support VMs with sizes that match your source
   VMs. Site Recovery picks the same size or the closest possible size for the target VM.

3. Storage accounts must be in the same region as the vault. You can't replicate to premium
   accounts in Central and South India.

## Plan your networking

For Site Recovery to work expected, you need to make some changes in outbound network connectivity,
from VMs that you want to replicate. Site Recovery doesn't support use of an authentication proxy
to control network connectivity. If you have an authentication proxy, replication can't be enabled.

### Outbound connectivity for URLs

If you are using a URL-based firewall proxy to control outbound connectivity, you must allow access
to the following URLs used by Site Recovery.

| **URL** | **Details** |
| ------- | ----------- |
| *.blob.core.windows.net | Allows data to be written from the VM to the cache storage account in the source region. |
| login.microsoftonline.com | Provides authorization and authentication to Site Recovery service URLs. |
| *.hypervrecoverymanager.windowsazure.com | Allows the VM to communicate with the Site Recovery service. |
| *.servicebus.windows.net | Allows the VM to write Site Recovery monitoring and diagnostics data. |

### Outbound connectivity for IP address ranges

When using any IP-based firewall, proxy, or NSG rules to control outbound connectivity, the
following IP ranges need to be whitelisted. Download a list of IP Ranges from the following links:

  - [Microsoft Azure Datacenter IP Ranges](http://www.microsoft.com/en-us/download/details.aspx?id=41653)
  - [Windows Azure Datacenter IP Ranges in Germany](http://www.microsoft.com/en-us/download/details.aspx?id=54770)
  - [Windows Azure Datacenter IP Ranges in China](http://www.microsoft.com/en-us/download/details.aspx?id=42064)
  - [Office 365 URLs and IP address ranges](https://support.office.com/article/Office-365-URLs-and-IP-address-ranges-8548a211-3fe7-47cb-abb1-355ea5aa88a2#bkmk_identity)
  - [Site Recovery service endpoint IP addresses](https://aka.ms/site-recovery-public-ips)

Use these lists to configure the network access controls in your network. You can use this
[script](https://gallery.technet.microsoft.com/Azure-Recovery-script-to-0c950702) to create
required rules on Network Security.

## Verify Azure VM certificates

Check that all the latest root certificates are present on the Windows or Linux VMs you want to
replicate. If the latest root certificates are not present, the VM cannot be registered to Site
Recovery due to security constraints.

- For Windows VMs, install all the latest Windows updates on the VM so that all the trusted root
  certificates are on the machine. In a disconnected environment, follow the standard Windows
  Update and certificate update processes for your organization.

- For Linux VMs, follow the guidance provided by your Linux distributor to get the latest trusted
  root certificates and certificate revocation list on the VM.

## Set permissions on the account

Azure Site Recovery provides three built-in roles to control Site Recovery management operations.

- **Site Recovery Contributor** - This role has all permissions required to manage Azure Site
  Recovery operations in a Recovery Services vault. A user with this role, however, can't create or
  delete a Recovery Services vault or assign access rights to other users. This role is best suited
  for disaster recovery administrators who can enable and manage disaster recovery for applications
  or entire organizations.

- **Site Recovery Operator** - This role has permissions to execute and manager Failover and
  Failback operations. A user with this role can't enable or disable replication, create or delete
  vaults, register new infrastructure, or assign access rights to other users. This role is best
  suited for a disaster recovery operator who can fail over virtual machines or applications when
  instructed by application owners and IT administrators. Post resolution of the disaster, the DR
  operator can reprotect and failback the virtual machines.

- **Site Recovery Reader** - This role has permissions to view all Site Recovery management
  operations. This role is best suited for an IT monitoring executive who can monitor the current
  state of protection and raise support tickets.

Learn more on [Azure RBAC built-in roles](../../active-directory/role-based-access-built-in-roles.md)

## Enable replication

### Select the source

1. In Recovery Services vaults, click the vault name > **+Replicate**.
2. In **Source**, select **Azure - PREVIEW**.
3. In **Source location**, select the source Azure region where your VMs are currently running.
4. Select the **Azure virtual machine deployment model** for VMs: **Resource Manager** or
   **Classic**.
5. Select the **Source resource group** for Resource Manager VMs, or **cloud service** for classic
   VMs.
6. Click **OK** to save the settings.

### Select the VMs

Site Recovery retrieves a list of the VMs associated with the subscription and resource group/cloud service.

1. In **Virtual Machines**, select the VMs you want to replicate.
2. Click **OK**.

### Configure settings

Review Site Recovery default settings for the target region. You can change these settings based on
your requirements.

![Configure settings](./media/azure-to-azure-tutorial-enable-replication/settings.png)

- **Target location**: The target region used for disaster recovery. We recommend that the target
  location matches the location of the Site Recovery vault.

- **Target resource group**: The resource group in the target region that holds Azure VMs after
  failover. By default, Site Recovery creates a new resource group in the target region with an
  "asr" suffix.

- **Target virtual network**: The network in the target region that VMs are located after failover.
  By default, Site Recovery creates a new virtual network (and subnets) in the target region with
  an "asr" suffix.

- **Cache storage accounts**: Site Recovery uses a storage account in the source region. Changes to
  source VMs are sent to this account before replication to the target location.

- **Target storage accounts**: By default, Site Recovery creates a new storage account in the
  target region to mirror the source VM storage account.

- **Target availability sets**: By default, Site Recovery creates a new availability set in the
  target region with the "asr" suffix.

- **Replication policy name**: Policy name.

- **Recovery point retention**: By default, Site Recovery keeps recovery points for 24 hours. You
  can configure a value between 1 and 72 hours.

- **App-consistent snapshot frequency**: By default, Site Recovery takes an app-consistent snapshot
  every 4 hours. You can configure any value between 1 and 12 hours.

### Track replication status

1. In **Settings**, click **Refresh** to get the latest status.

2. You can track progress of the **Enable protection** job in **Settings** > **Jobs** > **Site
   Recovery Jobs**.

3. In **Settings** > **Replicated Items**, you can view the status of VMs and the initial
   replication progress. Click the VM to drill down into its settings.

## Next Steps

Once your VMs have completed initial replication, verify your disaster recovery
configuration by [performing a Disaster Recovery drill](azure-to-azure-tutorial-dr-drill.md).

Ask questions and get help in the
[Azure Recovery Services Forum](https://social.msdn.microsoft.com/forums/azure/home?forum=hypervrecovmgr).
