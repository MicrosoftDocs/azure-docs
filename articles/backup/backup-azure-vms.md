<properties
	pageTitle="Backing up Azure virtual machines | Microsoft Azure"
	description="this article provides the procedures for backing up an Azure virtual machine."
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
	ms.topic="hero-article"
	ms.date="10/22/2015"
	ms.author="trinadhk; aashishr; jimpark; markgal"/>


# Backing up Azure virtual machines
This article provides the procedures for backing up existing Azure virtual machines, so you can ensure they are protected in accordance with your company’s backup and retention policies.

There are a few things you need to take care of before you can back up an Azure virtual machine. If you haven't already done so, complete the [prerequisites](backup-azure-vms-prepare.md) to prepare your environment for VM backup before you proceed.

If you are looking for information about [planning your VM backup infrastructure in Azure](backup-azure-vms-introduction.md), or [Azure virtual machines](https://azure.microsoft.com/documentation/services/virtual-machines/) you can follow these links for the information you need.

>[AZURE.NOTE] Virtual machine backup is local. You cannot back up virtual machines from one region to a backup vault in another region. So, for every Azure region that has VMs that need backup, at least 1 backup vault must be created in that region.

Backing up Azure virtual machines involves three key steps:

![Three steps to back up an Azure virtual machine](./media/backup-azure-vms/3-steps-for-backup.png)

## Step 1 - Discover Azure virtual machines
The discovery process should always be run as the first step to ensure that any new virtual machines added to the subscription are identified. The process queries Azure for the list of virtual machines in the subscription, along with additional information like the Cloud Service name and the region.

1. Navigate to the backup vault under **Recovery Services** in the Azure portal, and click **Registered Items**.

2. Select **Azure Virtual Machine** from the drop-down menu.

    ![select workload](./media/backup-azure-vms/discovery-select-workload.png)

3. Click **DISCOVER** at the bottom of the page.
    ![discover button](./media/backup-azure-vms/discover-button-only.png)

    The discovery process may take a few minutes while the virtual machines are being tabulated. There is a notification at the bottom of the screen that let's you know the process is running.

    ![discover vms](./media/backup-azure-vms/discovering-vms.png)

    The notification changes when the process is complete.

    ![discover-done](./media/backup-azure-vms/discovery-complete.png)

##  Step 2 - Register Azure virtual machines
You register an Azure virtual machine to associate the it with the Azure Backup service. This is typically a one-time activity.

1. Navigate to the backup vault under **Recovery Services** in the Azure portal, and click **Registered Items**.

2. Select **Azure Virtual Machine** from the drop-down menu.

    ![select workload](./media/backup-azure-vms/discovery-select-workload.png)

3. Click **REGISTER** at the bottom of the page.
    ![register button](./media/backup-azure-vms/register-button-only.png)

4. In the **Register Items shortcut menu**, select the virtual machines that you want to register. If there are two or more virtual machines with the same name use the cloud service to distinguish between them.

    >[AZURE.TIP] Multiple virtual machines can be registered at one time.

    A job is created for each virtual machine that you've selected.

5. Click **View Job** in the notification to go to the **Jobs** page.

    ![register job](./media/backup-azure-vms/register-create-job.png)

   The virtual machine also appears in the list of registered items along with the status of the registration operation.

    ![Registering status 1](./media/backup-azure-vms/register-status01.png)

    When the operation completes, the status will change to reflect the *registered* state.

    ![Registration status 2](./media/backup-azure-vms/register-status02.png)

## Step 3 - Protect Azure virtual machines
Now you can set up a backup and retention policy for the virtual machine. Multiple virtual machines can be protected using a single protect action.

Azure Backup vaults created after May 2015 come up with a default policy built into the vault. This default policy comes with a default retention of 30 days and once daily backup schedule.

1. Navigate to the backup vault under **Recovery Services** in the Azure portal, and click **Registered Items**
.
2. Select **Azure Virtual Machine** from the drop-down menu.

    ![Select workload in portal](./media/backup-azure-vms/select-workload.png)

3. Click **PROTECT** at the bottom of the page.

    The **Protect Items wizard** appears. The wizard only lists virtual machines that are registered and not protected. This is where you select the virtual machines you want to protect.

    If there are two or more virtual machines with the same name use the cloud service to distinguish between the virtual machines.

    >[AZURE.TIP] You can protect multiple virtual machines at one time.

    ![Configure protection at scale](./media/backup-azure-vms/protect-at-scale.png)

4. Choose a **backup schedule** to back up the virtual machines you've selected. You can pick from an existing set of policies or define a new one.

    Each backup policy can have multiple virtual machines associated with it. However, the virtual machine can only be associated with one policy at any given point in time.

    ![Protect with new policy](./media/backup-azure-vms/policy-schedule.png)

    >[AZURE.NOTE] A backup policy includes a retention scheme for the scheduled backups. If you select an existing backup policy you will be unable to modify the retention options in the next step.

5. Choose a **retention range** to associate with the backups.

    ![Protect with flexible retention](./media/backup-azure-vms/policy-retention.png)

    Retention policy specifies the length of time for storing a backup and you can specify different retention policies based on when the backup is taken. For example, a backup point taken at the end of each quarter may need to be preserved for a longer period (for audit purposes) while the backup point taken daily, which serves as an operational recovery point, only needs to be preserved for 90 days.

    ![Virtual machine is backed up with recovery point](./media/backup-azure-vms/long-term-retention.png)

    In this example image:

    - **Daily retention policy**: Backups taken daily are stored for 30 days.
    - **Weekly retention policy**: Backups taken every week on Sunday will be preserved for 104 weeks
    - **Monthly retention policy**: Backups taken on the last Sunday of each month will be preserved for 120 months
    - **Yearly retention policy**: Backups taken on the first Sunday of every January will be preserved for 99 years.

    A job is created to configure the protection policy and associate the virtual machines to that policy for each virtual machine that you've selected.

6. Click **Job** and choose the right filter to view the list of **Configure Protection** jobs.

    ![Configure protection job](./media/backup-azure-vms/protect-configureprotection.png)

## Initial backup
Once the virtual machine is protected with a policy, it shows up under the **Protected Items** tab with the status of *Protected - (pending initial backup)*. By default, the first scheduled backup is the *initial backup*.

To trigger the initial backup immediately after configuring protection:

1. Click the **Backup Now** button at the bottom of the **Protected Items** page.

    The Azure Backup service creates a backup job for the initial backup operation.

2. Click the **Jobs** tab to view the list of jobs.

    ![Backup in progress](./media/backup-azure-vms/protect-inprogress.png)

>[AZURE.NOTE] As a part of the backup operation, the Azure Backup service issues a command to the backup extension in each virtual machine to flush all writes and take a consistent snapshot.

When initial backup is complete, the status of the virtual machine in the **Protected Items** tab will be *Protected*.

![Virtual machine is backed up with recovery point](./media/backup-azure-vms/protect-backedupvm.png)

## Viewing backup status and details
Once protected, the virtual machine count also increases in the **Dashboard** page summary. The **Dashboard** page also shows the number of jobs from the last 24 hours that were *successful*, have *failed*, and are still *in progress*. Clicking on any one category will drill down into that category in the **Jobs** page.

![Status of backup in Dashboard page](./media/backup-azure-vms/dashboard-protectedvms.png)

Values in the dashboard are refreshed once every 24 hours.

## Troubleshooting errors
If you run into issues while backing up your virtual machine, take a look at this [troubleshooting](backup-azure-vms-troubleshoot.md) guidance for help.

## Next steps

- [Manage and monitor your virtual machines](backup-azure-manage-vms.md)
- [Restore virtual machines](backup-azure-restore-vms.md)
