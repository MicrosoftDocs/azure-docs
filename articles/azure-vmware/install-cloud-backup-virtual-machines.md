---
title: Install Cloud Backup for Virtual Machines (preview)
description: Cloud Backup for Virtual Machines is a plug-in installed in the Azure VMware Solution and enables you to back up and restore Azure NetApp Files datastores and virtual machines.
ms.topic: how-to
ms.service: azure-vmware
ms.date: 05/10/2023
---

# Install Cloud Backup for Virtual Machines (preview)

Cloud Backup for Virtual Machines is a plug-in installed in the Azure VMware Solution and enables you to back up and restore Azure NetApp Files datastores and virtual machines (VMs). 

Cloud Backup for Virtual Machines features:

* Simple deployment via AVS `run command` from Azure portal
* Integration into the vSphere client for easy operations
* VM-consistent snapshots for quick recovery points
* Quick restoration of VMs and VMDKs on Azure NetApp Files datastores

## Install Cloud Backup for Virtual Machines

You need to install Cloud Backup for Virtual Machines through the Azure portal as an add-on.  

1. Sign in to your Azure VMware Solution private cloud. 
1. Select **Run command** > **Packages** > **NetApp.CBS.AVS** > **Install-NetAppCBSA**.
 
    :::image type="content" source="./media/cloud-backup/run-command.png" alt-text="Screenshot of the Azure interface that shows the configure signal logic step with a backdrop of the Create alert rule page." lightbox="./media/cloud-backup/run-command.png":::

1. Provide the required values, then select **Run**. 

    :::image type="content" source="./media/cloud-backup/run-commands-fields.png" alt-text="Image of the Run Command fields which are described in the table below." lightbox="./media/cloud-backup/run-commands-fields.png":::

    | Field | Value |
    | ------ | ----- |
    | ApplianceVirtualMachineName | VM name for the appliance.  |
    | EsxiCluster | Destination ESXi cluster name to be used for deploying the appliance. |
    | VmDatastore | Datastore to be used for the appliance. |
    | NetworkMapping | Destination network to be used for the appliance. |
    | ApplianceNetworkName | Network name to be used for the appliance. |
    | ApplianceIPAddress | IPv4 address to be used for the appliance. |
    | Netmask | Subnet mask. |
    | Gateway | Gateway IP address. |
    | PrimaryDNS | Primary DNS server IP address. |
    | ApplianceUser | User Account for hosting API services in the appliance. |
    | AppliancePassword | Password of the user hosting API services in the appliance. |
    | MaintenanceUserPassword | Password of the appliance maintenance user. |

    >[!TIP]
    >You can also install Cloud Backup for Virtual Machines using DHCP by running the package `NetAppCBSApplianceUsingDHCP`. If you install Cloud Backup for Virtual Machines using DHCP, you don't need to provide the values for the PrimaryDNS, Gateway, Netmask, and ApplianceIPAddress fields. These values are automatically generated. 

1. Check **Notifications** or the **Run Execution Status** tab to see the progress. For more information about the status of the execution, see [Run command in Azure VMware Solution](concepts-run-command.md).  
    
Upon successful execution, the Cloud Backup for Virtual Machines is automatically displayed in the VMware vSphere client. 

## Upgrade Cloud Backup for Virtual Machines 

Before you initiate the upgrade, you must:

* Back up the MySQL database of Cloud Backup for Virtual Machines. 
* With vSphere, take VMware snapshot copies of the Cloud Backup VM. 

### Back up the MySQL database 

Do not start back up of the MySQL database when an on-demand backup job is already running.

1. From the VMware vSphere web client, select the VM where the SnapCenter VMware plug-in is located.
1. Right-click the VM. On the **Summary** tab of the virtual appliance, select **Launch Remote Console or Launch Web Console** to open a maintenance console window.
    
    The logon defaults for the SnapCenter VMware plug-in maintenance console are:

    Username: `maint`
    Password: `admin123`

1. From the main menu, enter option **1) Application Configuration**.
1. From the Application Configuration menu, enter option **6) MySQL backup and restore**.
1. From the MySQL Backup and Restore Configuration menu, enter option **1) Configure MySQL backup**.
1. At the prompt, enter the backup location for the repository, the number of backups to keep, and the time the backup should start.
    All inputs are saved when you enter them. When the backup retention number is reached, older backups are deleted when new backups are performed.

    >[!NOTE]
    >Repository backups are named `"backup-<date>"`. Because the repository restore function looks for the "backup" prefix, you should not change it.

### Upgrade

Use the following steps to execute a run command to upgrade the Cloud Backup for Virtual Machines to the next available version.

1. Select **Run command** > **Packages** > **NetApp.CBS.AVS** > **Invoke-UpgradeNetAppCBSAppliance**.
1. Provide the required values, and then select **Run**. 
1. Check **Notifications** or the **Run Execution Status** pane to monitor the progress. 

## Uninstall Cloud Backup for Virtual Machines 

You can execute the run command to uninstall Cloud Backup for Virtual Machines. 

> [!IMPORTANT]
> Before you initiate the upgrade, you must:
> * Backup the MySQL database of Cloud Backup for Virtual Machines. 
> * Ensure that there are no other VMs installed in the VMware vSphere tag: `AVS_ANF_CLOUD_ADMIN_VM_TAG`. All VMs with this tag are deleted when you uninstall.

1. Select **Run command** > **Packages** > **NetApp.CBS.AVS** > **Uninstall-NetAppCBSAppliance**.
1. Provide the required values, and then select **Run**. 
1. Check **Notifications** or the **Run Execution Status** pane to monitor the progress. 

## Change vCenter account password 

Use the following steps to execute the command to reset the vCenter account password:

1. Select **Run command** > **Packages** > **NetApp.CBS.AVS** > **Invoke-ResetNetAppCBSApplianceVCenterPasswordA**.
1. Provide the required values, then select **Run**. 
1. Check **Notifications** or the **Run Execution Status** pane to monitor the progress.

## Next steps

* [Back up Azure NetApp Files datastores and VMs using Cloud Backup for Virtual Machines](backup-azure-netapp-files-datastores-vms.md) 
* [Restore VMs using Cloud Backup for Virtual Machines](restore-azure-netapp-files-vms.md)