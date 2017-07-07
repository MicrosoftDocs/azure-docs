---
title: 'First Look- Back up Azure VMs with a backup vault | Microsoft Docs'
description: Use the classic portal to back up Azure VMs to a Backup vault. This tutorial explains all phases including creating the Backup vault, registering the VMs, creating backup policy, and running the initial backup job.
services: backup
documentationcenter: ''
author: markgalioto
manager: carmonm
editor: ''

ms.assetid: 722820dc-b65f-425c-a9e5-c1946e896a87
ms.service: backup
ms.workload: storage-backup-recovery
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: hero-article
ms.date: 6/14/2017
ms.author: markgal;

---
# First look: Backing up Azure virtual machines
> [!div class="op_single_selector"]
> * [Protect VMs with a recovery services vault](backup-azure-vms-first-look-arm.md)
> * [Protect Azure VMs with a backup vault](backup-azure-vms-first-look.md)
>
>

This tutorial takes you through the steps for backing up an Azure virtual machine (VM) to a backup vault in Azure. This article describes the classic model or Service Manager deployment model, for backing up VMs. The following steps apply only to Backup vaults created in the classic portal. Microsoft recommends using the Resource Manager model for new deployments.

If you are interested in backing up a VM to a Recovery Services vault that belongs to a Resource Group, see [First look: Protect VMs with a recovery services vault](backup-azure-vms-first-look-arm.md).

To successfully complete the following tutorial, these prerequisites must exist:

* You have created a VM in your Azure subscription.
* The VM has connectivity to Azure public IP addresses. For additional information, see [Network connectivity](backup-azure-vms-prepare.md#network-connectivity).


> [!NOTE]
> Azure has two deployment models for creating and working with resources: [Resource Manager and Classic](../azure-resource-manager/resource-manager-deployment-model.md). This tutorial is for use with virtual machines created in the classic portal.
>
>

## Create a backup vault
A backup vault is an entity that stores all the backups and recovery points that have been created over time. The backup vault also contains the backup policies that are applied to the virtual machines being backed up.

> [!IMPORTANT]
> Starting March 2017, you can no longer use the classic portal to create Backup vaults.
> You can now upgrade your Backup vaults to Recovery Services vaults. For details, see the article [Upgrade a Backup vault to a Recovery Services vault](backup-azure-upgrade-backup-to-recovery-services.md). Microsoft encourages you to upgrade your Backup vaults to Recovery Services vaults.<br/> **Starting November 1, 2017**:
>- Any remaining Backup vaults will be automatically upgraded to Recovery Services vaults.
>- You won't be able to access your backup data in the classic portal. Instead, use the Azure portal to access your backup data in Recovery Services vaults.
>

## Discover and Register Azure virtual machines
Before registering the VM with a vault, run the discovery process to identify any new VMs. This returns a list of virtual machines in the subscription, along with additional information like the cloud service name and the region.

1. Sign in to the [Azure Classic portal](http://manage.windowsazure.com/)
2. In the Azure classic portal, click **Recovery Services** to open the list of Recovery Services vaults.
    ![Select workload](./media/backup-azure-vms-first-look/recovery-services-icon.png)
3. From the list of vaults, select the vault to back up a VM.

    When you select your vault, it opens in the **Quick Start** page
4. From the vault menu, click **Registered Items**.

    ![Select workload](./media/backup-azure-vms-first-look/configure-registered-items.png)
5. From the **Type** menu, select **Azure Virtual Machine**.

    ![Select workload](./media/backup-azure-vms/discovery-select-workload.png)
6. Click **DISCOVER** at the bottom of the page.
    ![Discover button](./media/backup-azure-vms/discover-button-only.png)

    The discovery process may take a few minutes while the virtual machines are being tabulated. There is a notification at the bottom of the screen that lets you know that the process is running.

    ![Discover VMs](./media/backup-azure-vms/discovering-vms.png)

    The notification changes when the process is complete.

    ![Discovery done](./media/backup-azure-vms-first-look/discovery-complete.png)
7. Click **REGISTER** at the bottom of the page.
    ![Register button](./media/backup-azure-vms-first-look/register-icon.png)
8. In the **Register Items** shortcut menu, select the virtual machines that you want to register.

   > [!TIP]
   > Multiple virtual machines can be registered at one time.
   >
   >

    A job is created for each virtual machine that you've selected.
9. Click **View Job** in the notification to go to the **Jobs** page.

    ![Register job](./media/backup-azure-vms/register-create-job.png)

    The virtual machine also appears in the list of registered items, along with the status of the registration operation.

    ![Registering status 1](./media/backup-azure-vms/register-status01.png)

    When the operation completes, the status changes to reflect the *registered* state.

    ![Registration status 2](./media/backup-azure-vms/register-status02.png)

## Install the VM Agent on the virtual machine
The Azure VM Agent must be installed on the Azure virtual machine for the Backup extension to work. If your VM was created from the Azure gallery, the VM Agent is already present on the VM; you can skip to [protecting your VMs](backup-azure-vms-first-look.md#create-the-backup-policy).

If your VM migrated from an on-premises datacenter, the VM probably does not have the VM Agent installed. You must install the VM Agent on the virtual machine before proceeding to protect the VM. For detailed steps on installing the VM Agent, see the [VM Agent section of the Backup VMs article](backup-azure-vms-prepare.md#vm-agent).

## Create the backup policy
Before you trigger the initial backup job, set the schedule when backup snapshots are taken. The schedule when backup snapshots are taken, and the length of time those snapshots are retained, is the backup policy. The retention information is based on Grandfather-father-son backup rotation scheme.

1. Navigate to the backup vault under **Recovery Services** in the Azure Classic portal, and  click **Registered Items**.
2. Select **Azure Virtual Machine** from the drop-down menu.

    ![Select workload in portal](./media/backup-azure-vms/select-workload.png)
3. Click **PROTECT** at the bottom of the page.
    ![Click Protect](./media/backup-azure-vms-first-look/protect-icon.png)

    The **Protect Items wizard** appears and lists *only* virtual machines that are registered and not protected.

    ![Configure protection at scale](./media/backup-azure-vms/protect-at-scale.png)
4. Select the virtual machines that you want to protect.

    If there are two or more virtual machines with the same name, use the Cloud Service to distinguish between the virtual machines.
5. On the **Configure protection** menu select an existing policy or create a new policy to protect the virtual machines that you identified.

    New Backup vaults have a default policy associated with the vault. This policy takes a daily snapshot each evening, and the daily snapshot is retained for 30 days. Each backup policy can have multiple virtual machines associated with it. However, the virtual machine can only be associated with one policy at a time.

    ![Protect with new policy](./media/backup-azure-vms/policy-schedule.png)

   > [!NOTE]
   > A backup policy includes a retention scheme for the scheduled backups. If you select an existing backup policy, you will be unable to modify the retention options in the next step.
   >
   >
6. On **Retention Range** define the daily, weekly, monthly, and yearly scope for the specific backup points.

    ![Virtual machine is backed up with recovery point](./media/backup-azure-vms/long-term-retention.png)

    Retention policy specifies the length of time for storing a backup. You can specify different retention policies based on when the backup is taken.
7. Click **Jobs** to view the list of **Configure Protection** jobs.

    ![Configure protection job](./media/backup-azure-vms/protect-configureprotection.png)

    Now that you've established the policy, go to the next step and run the initial backup.

## Initial backup
Once a virtual machine has been protected with a policy, you can view that relationship on the **Protected Items** tab. Until the initial backup occurs, the **Protection Status** shows as **Protected - (pending initial backup)**. By default, the first scheduled backup is the *initial backup*.

![Backup pending](./media/backup-azure-vms-first-look/protection-pending-border.png)

To start the initial backup now:

1. On the **Protected Items** page, click **Backup Now** at the bottom of the page.
    ![Backup Now icon](./media/backup-azure-vms-first-look/backup-now-icon.png)

    The Azure Backup service creates a backup job for the initial backup operation.
2. Click the **Jobs** tab to view the list of jobs.

    ![Backup in progress](./media/backup-azure-vms-first-look/protect-inprogress.png)

    When initial backup is complete, the status of the virtual machine in the **Protected Items** tab is *Protected*.

    ![Virtual machine is backed up with recovery point](./media/backup-azure-vms/protect-backedupvm.png)

   > [!NOTE]
   > Backing up virtual machines is a local process. You cannot back up virtual machines from one region to a backup vault in another region. So, for every Azure region that has VMs that need to be backed up, at least one backup vault must be created in that region.
   >
   >

## Next steps
Now that you have successfully backed up a VM, there are several next steps that could be of interest. The most logical step is to familiarize yourself with restoring data to a VM. However, there are management tasks that will help you understand how to keep your data safe and minimize costs.

* [Manage and monitor your virtual machines](backup-azure-manage-vms.md)
* [Restore virtual machines](backup-azure-restore-vms.md)
* [Troubleshooting guidance](backup-azure-vms-troubleshoot.md)

## Questions?
If you have questions, or if there is any feature that you would like to see included, [send us feedback](http://aka.ms/azurebackup_feedback).
