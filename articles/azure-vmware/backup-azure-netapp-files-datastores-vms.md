---
title: Back up Azure NetApp Files datastores and VMs using Cloud Backup (preview)
description: Learn how to back up datastores and Virtual Machines to the cloud.
ms.topic: how-to
ms.service: azure-vmware
ms.date: 11/28/2023
ms.custom: engagement-fy23
---

# Back up Azure NetApp Files datastores and VMs using Cloud Backup for Virtual Machines (preview)

From the VMware vSphere client, you can back up datastores and Virtual Machines (VMs) to the cloud. This article explains how to configure your subscription, create a backup policy, and create and back up a resource group. 

## Configure subscriptions

Before you back up your Azure NetApp Files datastores, you must add your Azure and Azure NetApp Files cloud subscriptions.

### Prerequisites

* Cloud Backup for Virtual Machines requires outbound internet access from your Azure VMware Solution SDDC. For more information, see [Internet connectivity design considerations](../azure-vmware/concepts-design-public-internet-access.md).

* You must have sufficient permissions to [Create a Microsoft Entra app and service principal](../active-directory/develop/howto-create-service-principal-portal.md) within your Microsoft Entra tenant and assign to the application a role in your Azure subscription. You can use the built-in role of "contributor" or you can create a custom role with only the required permissions:

    ```json
    "actions": [
        "Microsoft.NetApp/*",
        "Microsoft.Resources/resources/read",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Resources/subscriptions/resourceGroups/resources/read",
        "Microsoft.Resources/subscriptions/resourceGroups/write",
        "Microsoft.Network/virtualNetworks/read",
        "Microsoft.Insights/Metrics/Read"
        ],
    ```
    For more information on creating custom roles, see [Azure custom roles](../role-based-access-control/custom-roles.md).

### Add an Azure cloud subscription 

1.	Sign in to the VMware vSphere client.
2.	From the left navigation, select **Cloud Backup for Virtual Machines**.
3.	Select the **Settings** page and then select the **Cloud Subscription** tab.
4.	Select **Add**. Provide the **Subscription ID**, **Tenant ID**, **Client IID**, and **Client secret key** from the app registration you previously created.

### Add an Azure NetApp Files cloud subscription account

1.	From the left navigation, select **Cloud Backup for Virtual Machines**.
2.	Select **Storage Systems**.
3.	Select **Add** to add the Azure NetApp Files cloud subscription account details.
4.	Provide the required values and then select **Add** to save your settings. 

## Create a backup policy

You must create backup policies before you can use Cloud Backup for Virtual Machines to back up Azure NetApp Files datastores and VMs.

1.	In the left navigation of the vCenter web client page, select **Cloud Backup for Virtual Machines** > **Policies**.
2.	On the **Policies** page, select **Create** to initiate the wizard.
3.	On the **New Backup Policy** page, select the vCenter Server that uses the policy, then enter the policy name and a description.
* **Only alphanumeric characters and underscores (_) are supported in VM, datastore, cluster, policy, backup, or resource group names.** Other special characters aren't supported. 
4.	Specify the retention settings.
    The maximum retention value is 255 backups. If the **"Backups to keep"** option is selected during the backup operation, Cloud Backup for Virtual Machines retains backups within the specified retention count and delete the backups that exceed the retention count.
5.	Specify the frequency settings.
    The policy specifies the backup frequency only. The specific protection schedule for backing up is defined in the resource group. Therefore, two or more resource groups can share the same policy and backup frequency but have different backup schedules.
6.	**Optional:** In the **Advanced** fields, select the fields that are needed. The Advanced field details are listed in the following table.

    | Field | Action |
    | ---- | ---- |
    | VM consistency | Check this box to pause the VMs and create a VMware snapshot each time the backup job runs. <br> When you check the VM consistency box, backup operations might take longer and require more storage space. In this scenario, the VMs are first paused, then VMware performs a VM consistent snapshot. Cloud Backup for Virtual Machines then performs its backup operation, and then VM operations are resumed. <br> VM guest memory isn't included in VM consistency snapshots. |
    | Include datastores with independent disks	| Check this box to include any datastores with independent disks that contain temporary data in your backup. | 
7. Select **Add** to save your policy.
    You can verify the policy was created successfully and review the configuration by selecting the policy in the **Policies** page.

## Resource groups

A resource group is the container for VMs and datastores that you want to protect.

Don't add VMs in an inaccessible state to a resource group. Although a resource group can contain a VM in an inaccessible state, the inaccessible state causes backups for the resource group to fail. 

### Considerations for resource groups

You can add or remove resources from a resource group at any time.
* **Back up a single resource:** To back up a single resource (for example, a single VM), you must create a resource group that contains that single resource.
* **Back up multiple resources:** To back up multiple resources, you must create a resource group that contains multiple resources.
* **Optimize snapshot copies:** To optimize snapshot copies, group the VMs and datastores that are associated with the same volume into one resource group.
* **Backup policies:** Although it's possible to create a resource group without a backup policy, you can only perform scheduled data protection operations when at least one policy is attached to the resource group. You can use an existing policy, or you can create a new policy while creating a resource group.
* **Compatibility checks:** Cloud Backup for VMs performs compatibility checks when you create a resource group. Reasons for incompatibility might be:
    * Virtual machine disks (VMDKs) are on unsupported storage.
    * A shared PCI device is attached to a VM.
    * The Azure subscription account wasn't added.

### Create a resource group using the wizard

1.  In the left navigation of the vCenter web client page, select **Cloud Backup** for **Virtual Machines** > **Resource Groups**. Then select **+ Create** to start the wizard

    :::image type="content" source="./media/cloud-backup/vsphere-create-resource-group.png" alt-text="Screenshot of the vSphere Client Resource Group interface shows a red box highlights a button with a green plus sign that reads Create, instructing you to select this button." lightbox="./media/cloud-backup/vsphere-create-resource-group.png":::
    
1. On the **General Info & Notification** page in the wizard, enter the required values.
1. On the **Resource** page, do the following:

    | Field | Action |
    | -- | ----- |
    | Scope | Select the type of resource you want to protect: <br /> -Datastores <br /> -Virtual Machines |
    | Datacenter | Navigate to the VMs or datastores |
    | Available entities | Select the resources you want to protect. Then select **>** to move your selections to the Selected entities list. |

    When you select **Next**, the system first checks that Cloud Backup for Virtual Machines manages and is compatible with the storage on which the selected resources are located.
    
    >[!IMPORTANT]
    >If you receive the message `selected <resource-name> is not Cloud Backup for Virtual Machines compatible` then a selected resource is not compatible with Cloud Backup for Virtual Machines. 

1. On the **Spanning disks** page, select an option for VMs with multiple VMDKs across multiple datastores:
    * Always exclude all spanning datastores 
        (The default option for datastores)
    * Always include all spanning datastores
        (The default for VMs)
    * Manually select the spanning datastores to be included
1. On the **Policies** page, select or create one or more backup policies.
    * To use **an existing policy**, select one or more policies from the list.
    * To **create a new policy**:
        1. Select **+ Create**.
        1. Complete the New Backup Policy wizard to return to the Create Resource Group wizard.
1. On the **Schedules** page, configure the backup schedule for each selected policy.
    In the **Starting** field, enter a date and time other than zero. The date must be in the format day/month/year. You must fill in each field. The Cloud Backup for Virtual Machines creates schedules in the time zone in which the Cloud Backup for Virtual Machines is deployed. You can modify the time zone by using the Cloud Backup for Virtual Machines GUI.

    :::image type="content" source="./media/cloud-backup/backup-schedules.png" alt-text="A screenshot of the Backup schedules interface showing an hourly backup beginning at 10:22 a.m. on April 26, 2022." lightbox="./media/cloud-backup/backup-schedules.png":::
1. Review the summary. If you need to change any information, you can return to any page in the wizard to do so. Select **Finish** to save your settings. 

    After you select **Finish**, the new resource group is added to the resource group list.

    If the pause operation fails for any of the VMs in the backup, then the backup is marked as not VM-consistent even if the policy selected has VM consistency selected. In this case, it's possible that some of the VMs were successfully paused.

### Other ways to create a resource group

In addition to using the wizard, you can:
* **Create a resource group for a single VM:**
    1. Select **Menu** > **Hosts and Clusters**.
    1. Right-click the Virtual Machine you want to create a resource group for and select **Cloud Backup for Virtual Machines**. Select **+ Create**.
* **Create a resource group for a single datastore:** 
    1. Select **Menu** > **Hosts and Clusters**.
    1. Right-click a datastore, then select **Cloud Backup for Virtual Machines**. Select **+ Create**.

## Back up resource groups

Backup operations are performed on all the resources defined in a resource group. If a resource group has a policy attached and a schedule configured, backups occur automatically according to the schedule.

## Prerequisites to back up resource groups

* You must have a resource group created with a policy attached.
    >[!NOTE]
    > Do not start an on-demand backup job when a job to back up the Cloud Backup for Virtual Machines MySQL database is already running. Use the maintenance console to see the configured backup schedule for the MySQL database.

### Back up resource groups on demand

1. In the left navigation of the vCenter web client page, select **Cloud Backup for Virtual Machines** > **Resource Groups**, then select a resource group. Select **Run Now** to start the backup.

    :::image type="content" source="./media/cloud-backup/resource-groups-run-now.png" alt-text="Image of the vSphere Client Resource Group interface. At the top left, a red box highlights a green circular button with a white arrow inside next to text reading Run Now, instructing you to select this button." lightbox="./media/cloud-backup/resource-groups-run-now.png":::
 
    1. If the resource group has multiple policies configured, then in the **Backup Now** dialog box, select the policy you want to use for this backup operation.
    
1. Select **OK** to initiate the backup.
    >[!NOTE]
    >You can't rename a backup once it's created. 
1. **Optional:** Monitor the operation progress by selecting **Recent Tasks** at the bottom of the window or on the dashboard Job Monitor for more details.
    If the pause operation fails for any of the VMs in the backup, then the backup completes with a warning. It's marked as not VM-consistent even if the selected policy has VM consistency selected. In this case, it's possible that some of the VMs were successfully paused. In the job monitor, the failed VM details show the pause operation as failed.

## Next steps

* [Restore VMs using Cloud Backup for Virtual Machines](restore-azure-netapp-files-vms.md)
