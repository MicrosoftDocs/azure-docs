---
title: Set up disaster recovery of physical on-premises servers with Azure Site Recovery
description: Learn how to set up disaster recovery to Azure for on-premises Windows and Linux servers, with the Azure Site Recovery service.
ms.service: site-recovery
ms.topic: article
ms.date: 01/30/2023
ms.author: ankitadutta
author: ankitaduttaMSFT
ms.custom: engagement-fy23


---
# Set up disaster recovery to Azure for on-premises physical servers

The [Azure Site Recovery](site-recovery-overview.md) service contributes to your disaster recovery strategy by managing and orchestrating replication, failover, and failback of on-premises machines, and Azure virtual machines (VMs).

This tutorial shows how to set up disaster recovery of on-premises physical Windows and Linux servers to Azure. In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a Recovery Services vault for Site Recovery
> * Create a replication policy
> * Enable replication for a server

## Prerequisites

To complete this tutorial:

- Make sure you understand the [architecture and components](physical-azure-architecture.md) for this scenario.
- Review the [support requirements](vmware-physical-secondary-support-matrix.md) for all components.
- Make sure that the servers you want to replicate comply with [Azure VM requirements](vmware-physical-secondary-support-matrix.md#replicated-vm-support).
- Prepare Azure. You need an Azure subscription, an Azure virtual network, and a storage account.
- Prepare an account for automatic installation of the Mobility service on each server you want to replicate.

Before you begin, note that:

- After failover to Azure, physical servers can't be failed back to on-premises physical machines. You can only fail back to VMware VMs.
- This tutorial sets up physical server disaster recovery to Azure with the simplest settings. If you want to learn about other options, read through our How To guides:
    - Set up the [replication source](physical-azure-set-up-source.md), including the Site Recovery configuration server.
    - Set up the [replication target](physical-azure-set-up-target.md).
    - Configure a [replication policy](vmware-azure-set-up-replication.md), and [enable replication](vmware-azure-enable-replication.md).


### Set up an Azure account

Get a Microsoft [Azure account](https://azure.microsoft.com/).

- You can start with a [free trial](https://azure.microsoft.com/pricing/free-trial/).
- Learn about [Site Recovery pricing](./site-recovery-faq.yml), and get [pricing details](https://azure.microsoft.com/pricing/details/site-recovery/).
- Find out which [regions are supported](https://azure.microsoft.com/pricing/details/site-recovery/) for Site Recovery.

### Verify Azure account permissions

Make sure your Azure account has permissions for replication of VMs to Azure.

- Review the [permissions](site-recovery-role-based-linked-access-control.md#permissions-required-to-enable-replication-for-new-virtual-machines) you need to replicate machines to Azure.
- Verify and modify [Azure role-based access control (Azure RBAC)](../role-based-access-control/role-assignments-portal.md) permissions.



### Set up an Azure network

Set up an [Azure network](../virtual-network/quick-create-portal.md).

- Azure VMs are placed in this network when they're created after failover.
- The network should be in the same region as the Recovery Services vault


## Set up an Azure storage account

Set up an [Azure storage account](../storage/common/storage-account-create.md).

- Site Recovery replicates on-premises machines to Azure storage. Azure VMs are created from the storage after failover occurs.
- The storage account must be in the same region as the Recovery Services vault.


### Prepare an account for Mobility service installation

The Mobility service must be installed on each server you want to replicate. Site Recovery installs this service automatically when you enable replication for the server. To install automatically, you need to use the **root**/**admin** account that Site Recovery will utilize to access the server.

- You can use a domain or local account for Windows VMs
- For Windows VMs, if you're not using a domain account, disable Remote User Access control on the local machine. To do this, in the register under **HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System**, add the DWORD entry **LocalAccountTokenFilterPolicy**, with a value of 1.
- To add the registry entry to disable the setting from a CLI, type:
  `REG ADD HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System /v LocalAccountTokenFilterPolicy /t REG_DWORD /d 1.`
- For Linux, the account should be **root** on the source Linux server.


## Create a vault

[!INCLUDE [site-recovery-create-vault](../../includes/site-recovery-create-vault.md)]

## Prepare infrastructure

it's important to prepare the infrastructure before you set up disaster recovery of physical VMware machines to Azure.

## Deployment planning

1.	In the [Azure portal](https://portal.azure.com), go to **Recovery Services vaults** and select the vault. 
2.	On the vault home page, select **Enable Site Recovery**.
3.	Navigate to the bottom of the page, and select **Prepare infrastructure** under the **VMware machines to Azure** section. This opens the Prepare infrastructure pane.

In the **Prepare infrastructure** pane, under **Deployment planning** tab do the following:
  > [!TIP]
  > If you're planning a large deployment, download the Deployment Planner for Hyper-V from the link on the page. 

  1.	For this tutorial, we don't need the Deployment Planner. In **Deployment planning completed?**, select **I will do it later**.
  2.	Select **Next**.
    :::image type="content" source="./media/physical-azure-disaster-recovery/deployment-setting.png" alt-text="Screenshot of deployment planning page.":::


## Source settings

On the **Source settings** tab, do the following:
1. Select if your machines are virtual or physical in the **Are your machines virtualized?** option. For this tutorial, select **No**.
1. Under **Configuration Server**, specify the server you want to use. If you don't have a configuration server ready, you can use the **Add Configuration Server** option.
    :::image type="content" source="./media/physical-azure-disaster-recovery/source-setting.png" alt-text="Screenshot of source setting page.":::
1. On the **Add Server** pane, do the following:
    1. If you’re enabling protection for virtual machines, then download the Configuration server virtual machine template. [Learn more](#register-the-configuration-server-in-the-vault).
    1. If you’re enabling protection for physical machines, then download the Site Recovery Unified Setup installation file. You will also need to download the vault registration key. You need it when you run Unified Setup. The key is valid for five days after you generate it. [Learn more](#run-setup).
        :::image type="content" source="./media/physical-azure-disaster-recovery/add-server.png" alt-text="Screenshot of add server page.":::
1. Select **Next**.



### Register the configuration server in the vault

Do the following before you start:

#### Verify time accuracy
On the configuration server machine, make sure that the system clock is synchronized with a [Time Server](/windows-server/networking/windows-time-service/windows-time-service-top). It should match. If it's 15 minutes in front or behind, setup might fail.

#### Verify connectivity
Make sure the machine can access these URLs based on your environment:

[!INCLUDE [site-recovery-URLS](../../includes/site-recovery-URLS.md)]  

IP address-based firewall rules should allow communication to all of the Azure URLs that are listed above over HTTPS (443) port. To simplify and limit the IP Ranges, it's recommended that URL filtering is done.

- **Commercial IPs** - Allow the [Azure Datacenter IP Ranges](https://www.microsoft.com/download/confirmation.aspx?id=41653), and the HTTPS (443) port. Allow IP address ranges for the Azure region of your subscription to support the Azure AD, Backup, Replication, and Storage URLs.  
- **Government IPs** - Allow the [Azure Government Datacenter IP Ranges](https://www.microsoft.com/en-us/download/details.aspx?id=57063), and the HTTPS (443) port for all USGov Regions (Virginia, Texas, Arizona, and Iowa) to support Azure AD, Backup, Replication, and Storage URLs.  

#### Run setup
Run Unified Setup as a Local Administrator, to install the configuration server. The process server and the master target server are also installed by default on the configuration server.

[!INCLUDE [site-recovery-add-configuration-server](../../includes/site-recovery-add-configuration-server.md)]


## Target settings

Select and verify target resources.

On the **Target settings** tab, do the following:

1. Under **Subscription**, select the Azure subscription you want to use.
2. Under **Post-failover deployment model**, specify the target deployment model.
    Site Recovery checks that you have one or more compatible Azure storage accounts and networks.
    > ![!NOTE]
    > Only Resource Manager deployment model should be selected, as Classic deployment model will be deprecated by 01, March, 2023.
1. Select **Next**

    :::image type="content" source="./media/physical-azure-disaster-recovery/target-settings.png" alt-text="Screenshot of the target setting page.":::


## Replication policy

Enable replication for each server. Site Recovery will install the Mobility service when replication is enabled. When you enable replication for a server, it can take 15 minutes or longer for changes to take effect, and appear in the portal.

Under **Replication policy** tab, do the following:

1.	Under **Replication policy**, specify the replication policy.  
2.	If you do not have a replication policy, use the **Create new policy and associate** option to create a new policy.
    :::image type="content" source="./media/physical-azure-disaster-recovery/replication-policy-vm.png" alt-text="Screenshot of replication policy home page.":::
3.	In the **Create and associate policy** page, do the following:
    1. **Name** - specify a policy name.
    1. **Source type** - select **VMware / Physical machines**.
    1. **Target type** - select the subscription and the resource group in which you want to create the Azure VMs after failover. 
    1. **RPO threshold in mins** - specify the recovery point objective (RPO) limit. This value specifies how often data recovery points are created. An alert is generated if continuous replication exceeds this limit..
    1. **Retention period (in days)** - specify how long (in days) the retention window is for each recovery point. Replicated VMs can be recovered to any point in a window. Up to 15 days retention is supported.
    1. In **App-consistent snapshot frequency**, specify how often (in hours) recovery points containing application-consistent snapshots will be created. 
    4.	After the policy is created, select **OK**.
        :::image type="content" source="./media/physical-azure-disaster-recovery/create-policy.png" alt-text="Screenshot of replication policy page.":::

By default, a matching policy is automatically created for failback. For example, if the replication policy is **rep-policy** then a failback policy **rep-policy-failback** is created. This policy isn't used until you initiate a failback from Azure.


## Enable replication

1.	In the [Azure portal](https://portal.azure.com), go to **Recovery Services vaults** and select the vault. 
2.	On the vault home page, select **Enable Site Recovery**.
3.	Navigate to the bottom of the page, and select **Enable replication (Classic)** under the **VMware machines to Azure** section.
1. Under **Source environment** tab, do the following:
    1. In **Configuration server**, specify the configuration server name.
    1. In **Machine type**, select **Physical machines**.
    1. In **Process server**, retain the default selection. Optionally, you can use the **Add Process Server** to add a new server for this step.
    1. Select **Next**.
    :::image type="content" source="./media/physical-azure-disaster-recovery/enable-replication-source.png" alt-text="Screenshot of enable replication source setting page.":::

1. Under **Target environment** tab, do the following:
    1. In **Target subscription**, specify the subscription name.
    1. In **Resource group**, specify the resource group name.
    1. For **Post-failover deployment model**, specify **Resource Manager**.
    1. Under **Target azure network**, choose the Azure storage account you want to use for replicating data.
    1. In **Subnet**, select the Azure network and subnet to which Azure VMs will connect, when they're created after failover.
    1. Select **Next**.
    :::image type="content" source="./media/physical-azure-disaster-recovery/enable-replication-target.png" alt-text="Screenshot of target environment page.":::

1. Under **Physical machine selection** tab, do the following:
    1. Select **Add Physical machine**. 
        :::image type="content" source="./media/physical-azure-disaster-recovery/enable-replication-physical.png" alt-text="Screenshot of physical machine selection page.":::
    1. Specify the name and IP address. 
    1. Select the operating system of the machine you want to replicate. 
       It takes a few minutes for the servers to be discovered and listed.
       :::image type="content" source="./media/physical-azure-disaster-recovery/add-physical-machines.png" alt-text="Screenshot of add machine page.":::

1. Under **Replication settings** tab, select and verify the user account details.
    :::image type="content" source="./media/physical-azure-disaster-recovery/enable-replication-settings.png" alt-text="Screenshot of enable replication setting page.":::
1. Under **Replication policy** tab, verify that the correct replication policy is selected.
    :::image type="content" source="./media/physical-azure-disaster-recovery/enable-replication-policy.png" alt-text="Screenshot of enable replication policy page.":::
1. Under **Review** tab, review your selections and select **Enable Replication**. You can track progress of the **Enable Protection** job in **Settings** > **Jobs** > **Site Recovery Jobs**. After the **Finalize Protection** job runs the machine is ready for failover.


To monitor servers you add, you can check the last discovered time for them in **Configuration Servers** > **Last Contact At**. To add machines without waiting for a scheduled discovery time, highlight the configuration server (don’t click it), and click **Refresh**.

## Next steps

[Learn more](tutorial-dr-drill-azure.md) about run a disaster recovery drill.
