---
title: Back up Azure NetApp Files datastores and VMs using Cloud Backup
description: Learn how to back up datastores and Virtual Machines to the cloud.
ms.topic: how-to
ms.service: azure-vmware
ms.date: 06/20/2022
---

# Back up Azure NetApp Files datastores and VMs using Cloud Backup

From the VMware vSphere client, you can back up datastores and Virtual Machines to the cloud.

## Configure subscriptions

Before you back up your Azure NetApp Files datastores, you must add your Azure and Azure NetApp Files cloud subscriptions.

### Add Azure Cloud subscription 

1.	Log in to the VMware vSphere client.
2.	From the left pane, select **Cloud Backup for Virtual Machines**.
3.	Select the **Settings** page and then select the **Cloud Subscription** tab.
4.	Select **Add** and then provide the required values from your Azure subscription.

### Add Azure NetApp Files Cloud Subscription Account

1.	From the left pane, select **Cloud Backup for Virtual Machines**.
2.	Select **Storage Systems**.
3.	Select **Add** to add the Azure NetApp Files cloud subscription account details.
4.	Provide the required values and then select **Add** to save your settings. 

## Create Backup Policy 

You must create backup policies before you can use Cloud Backup for Virtual Machines to back up Azure NetApp Files datastores and Virtual Machines.

1.	In the left Navigator pane of the vCenter web client page, select **Cloud Backup for Virtual Machines** > **Policies**.
2.	On the **Policies** page, select **Create** to initiate the wizard.
3.	On the **New Backup Policy** page, select the vCenter Server that will use the policy, and then enter the policy name and a description.
* Unsupported characters: Do not use these special characters in Virtual Machine, datastore, cluster, policy, backup, or resource group names: % & * $ # @ ! \ / : * ? " < > - | ; ' , .
* An underscore character (_) is allowed.
4.	Specify the retention settings.
    If the "Backups to keep" option is selected during the backup operation, Cloud Backup for Virtual Machines will retain backups with the specified retention count and delete the backups that exceed the retention count.
5.	Specify the frequency settings.
    The policy specifies the backup frequency only. The specific protection schedule for backing up is defined in the resource group. Therefore, two or more resource groups can share the same policy and backup frequency but have different backup schedules.
6.	**Optional:** In the **Advanced** fields, select the fields that are needed. The Advanced field details are listed in the following table.

    | Field | Action |
    | ---- | ---- |
    | VM consistency | Check this box to quiesce the Virtual Machines and create a VMware snapshot each time the backup job runs. <br> When you check the VM consistency box, backup operations might take longer and require more storage space. In this scenario, the Virtual Machines are first quiesced, then VMware performs a Virtual Machine consistent snapshot, then Cloud Backup for Virtual Machines performs its backup operation, and then Virtual Machine operations are resumed. <br> Virtual Machine guest memory is not included in VM consistency snapshots. |
    | Include datastores with independent disks	| Check this box to include in the backup any datastores with independent disks that contain temporary data. |
    | Scripts | Enter the fully qualified path of the prescript or postscript that you want the Cloud Backup for Virtual Machines to run before or after backup operations. For example, you can run a script to update SNMP traps, automate alerts, and send logs. The script path is validated at the time the script is executed. <br> **NOTE**: Prescripts and postscripts must be located on the virtual appliance VM. To enter multiple scripts, press Enter after each script path to list each script on a separate line. The character ";" is not allowed. |
7. Select **Add** to save your policy.
    You can verify that the policy has been created successfully and review the policy configuration by selecting the policy in the **Policies** page.

## Create a Resource Group

A resource group is the container for Virtual Machines and datastores that you want to protect.

Do not add Virtual Machines in an inaccessible state to a resource group. Although a resource group can contain a Virtual Machine in an inaccessible state, the inaccessible state will cause backups for the resource group to fail. 

### About this task 

You can add or remove resources from a resource group at any time.
* Backing up a single resource
    To back up a single resource (for example, a single Virtual Machine), you must create a resource group that contains that single resource.
* Backing up multiple resources
    To back up multiple resources, you must create a resource group that contains multiple resources.
* Optimizing snapshot copies
    To optimize snapshot copies, you should group the Virtual Machines and datastores that are associated with the same volume into one resource group.
* Backup policies
    Although it is possible to create a resource group without a backup policy, you can only perform scheduled data protection operations when at least one policy is attached to the resource group. You can use an existing policy, or you can create a new policy while creating a resource group.
* Compatibility checks
Cloud Backup for Virtual Machines performs compatibility checks when you create a resource group. Reasons for incompatibility might be:
    * VMDKs are on unsupported storage.
    * A shared PCI device is attached to a Virtual Machine.
    * You have not added the Azure subscription account.

### Steps

1. In the left Navigator pane of the vCenter web client page, select **Cloud Backup** for **Virtual Machines** > **Resource Groups**, then select **+ Create** to start the wizard

    :::image type="content" source="./media/cloud-backup/vSphere-create-resource-group.png" alt-text="Screenshot of the vSphere Client Resource Group interface. At the top left, a red box highlights a button with a green plus sign that reads Create, instructing you to select this button." lightbox="./media/cloud-backup/vSphere-create-resource-group.png":::
    
    Although this is the easiest way to create a resource group, you can also perform one of the following:
    * To create a resource group for one Virtual Machine, select **Menu** > **Hosts and Clusters**. Then, right-click the Virtual Machine you want to create a resource group for and select **Cloud Backup for Virtual Machines**. Finally, select **+ Create**.
    * To create a resource group for a single datastore, select **Menu** > **Hosts and Clusters**, then right-click a datastore, then select **Cloud Backup for Virtual Machines**, and then select **+ Create**.
1. On the **General Info & Notification** page in the wizard, enter the required values.
1. On the **Resources** page, do the following:
    | Field | Action |
    | -- | ----- |
    | Scope | Select the type of resource you want to protect: <ul><li>Datastores</li><li>Virtual Machines</li></ul> |
    | Datacenter | Navigate to the Virtual Machines or datastores |
    | Available entities | Select the resources you want to protect, then select **>** to move your selections to the Selected entities list. |

    When you select **Next**, the system first checks that Cloud Backup for Virtual Machines manages and is compatible with the storage on which the selected resources are located.
    If you receive the message `selected <resource-name> is not Cloud Backup for Virtual Machines compatible` then a selected resource is not compatible with Cloud Backup for Virtual Machines. 
1. On the **Spanning disks** page, select an option for Virtual Machines with multiple VMDKs across multiple datastores:
* Always exclude all spanning datastores 
    (This is the default option for datastores)
* Always include all spanning datastores
    (This is the default for Virtual Machines)
* Manually select the spanning datastores to be include
1. On the **Policies** page, select or create one or more backup policies.
    * To use **an existing policy**, select one or more policies from the list.
    * To **create a new policy**:
        1. Select **+ Create**.
        1. Complete the New Backup Policy wizard to return to the Create Resource Group wizard.
1. On the **Schedules** page, configure the backup schedule for each selected policy.
    In the starting hour field, enter a date and time other than zero. The date must be in the format day/month/year. You must fill in each field. The Cloud Backup for Virtual Machines creates schedules in the time zone in which the Cloud Backup for Virtual Machines is deployed. You can modify the time zone by using the Cloud Backup for Virtual Machines GUI.

    :::image type="content" source="./media/cloud-backup/backup-schedules.png" alt-text="Backup schedules interface showing an hourly backup beginning at 10:22 a.m. on April 26, 2022." lightbox="./media/cloud-backup/backup-schedules.png":::
1. Review the summary. If you need to change any information, you can return to any page in the wizard to do so. Select **Finish** to save your settings. 

    After you select Finish, the new resource group will be add to the resource group list.

    If the quiesce operation fails for any of the Virtual Machines in the backup, then the backup is marked as not Virtual Machine consistent even if the policy selected has Virtual Machine consistency selected. In this case, it is possible that some of the Virtual Machines were successfully quiesced.

## Back up resource groups on demand

Backup operations are performed on all the resources defined in a resource group. If a resource group has a policy attached and a schedule configured, then backups occur automatically according to the schedule.

### Before you begin 

* You must have created a resource group with a policy attached.
    Do not start an on-demand backup job when a job to back up the Cloud Backup for Virtual Machines MySQL database is already running. Use the maintenance console to see the configured backup schedule for the MySQL database.

### Steps

1. In the left Navigator pane of the vCenter web client page, select **Cloud Backup for Virtual Machines** > **Resource Groups**, then select a resource group. Select **Run Now** to start the backup.

    :::image type="content" source="./media/cloud-backup/resource-groups-run-now.png" alt-text="Screenshot of the vSphere Client Resource Group interface. At the top left, a red box highlights a green circular button with a white arrow inside next to text reading Run Now, instructing you to select this button." lightbox="./media/cloud-backup/resource-groups-run-now.png":::
 
    1.1 If the resource group has multiple policies configured, then in the **Backup Now** dialog box, select the policy you want to use for this backup operation.
1. Select **OK** to initiate the backup.
1. **Optional:** Monitor the operation progress by clicking Recent Tasks at the bottom of the window or on the dashboard Job Monitor for more details.
    If the quiesce operation fails for any of the Virtual Machines in the backup, then the backup completes with a warning and is marked as not Virtual Machine consistent even if the selected policy has Virtual Machine consistency selected. In this case, it is possible that some of the Virtual Machines were successfully quiesced. In the job monitor, the failed Virtual Machine details will show the quiesce as failed.

## Next steps

* [Restore Virtual Machines using Cloud Backup](restore-azure-netapp-files-vms.md)