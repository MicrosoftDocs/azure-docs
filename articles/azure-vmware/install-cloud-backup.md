---
title: Install Cloud Backup for Virtual Machines
description: Cloud Backup for Virtual Machines is a plug-in installed in the Azure VMware Solution and enables you to backup and restore Azure NetApp Files datastores and Virtual Machines.
ms.topic: how-to
ms.service: azure-vmware
ms.date: 06/20/2022
---

# Install Cloud Backup for Virtual Machines

Cloud Backup for Virtual Machines is a plug-in installed in the Azure VMware Solution and enables you to backup and restore Azure NetApp Files datastores and Virtual Machines. 

* You should use Cloud Backup for Virtual Machines to: 
* Build and securely connect both legacy and cloud-native workloads across environments and unify operations
* Provision and resize datastore volumes right from the Azure portal 
* Take Virtual Machine consistent snapshots for quick checkpoints 
* Quickly recover Virtual Machines.

## Requirements and considerations

Before you can install Cloud Backup for Virtual Machines, you must have created an Azure service principle with the required Azure NetApp Files privileges. 

## Install Cloud Backup for Virtual Machines

You will need to install Cloud Backup for Virtual Machines through the Azure portal as an add-on.  

1. Sign in to your Azure VMware Solution private cloud. 
1. Select **Run command** > **Packages** > **NetApp.CBS.AVS** > **Install-NetAppCBSA**.
 
    :::image type="content" source="./media/cloud-backup/run-command.png" alt-text="Screenshot of the Azure interface that shows the configure signal logic step with a backdrop of the Create alert rule page." lightbox="./media/cloud-backup/run-command.png":::

1. Provide the required values, and then select **Run**. 

    :::image type="content" source="./media/cloud-backup/run-commands-fields.png" alt-text="Screenshot of the Run Command fields which are described in the table below." lightbox="./media/cloud-backup/run-commands-fields.png":::

    | Field      | Value |
    | ------ | ----- |
    | ApplianceVirtualMachineName | Virtual Machine name for the appliance.  |
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

    NOTE: You can also install Cloud Backup for Virtual Machines using DHCP by running the command `NetAppCBSApplianceUsingDHCP`. If you install Cloud Backup for Virtual Machines using DHCP, you do not need to provide the values for the PrimaryDNS, Gateway, Netmask and ApplianceIPAddress fields. These values will be automatically generated. 

1. Check **Notifications** or the **Run Execution Status** tab to see the progress. For more information about the status of the execution, see [Run command in Azure VMware Solution](concepts-run-command.md).  
    
On successful execution, the Cloud Backup for Virtual Machines will automatically be displayed in the VMware vSphere client. 


## Upgrade Cloud Backup for Virtual Machines 

You can execute this run command to upgrade the Cloud Backup for Virtual Machines to the next available version. 

### Before you begin 

* Backup the MySQL database of Cloud Backup for Virtual Machines. 

* Take snapshot copies of Cloud Backup for Virtual Machines. 

### Steps 

1. Select **Run command** > **Packages** > **NetApp.CBS.AVS** > **Invoke-UpgradeNetAppCBSAppliance**.

1. Provide the required values, and then select **Run**. 

1. Check **Notifications** or the **Run Execution Status** pane to monitor the progress. 

## Uninstall Cloud Backup for Virtual Machines 

You can execute the run command to uninstall Cloud Backup for Virtual Machines. 

### Before you begin 

* Backup the MySQL database of Cloud Backup for Virtual Machines. 

* Ensure that there are no other Virtual Machines installed in the VMware vSphere tag: `AVS_ANF_CLOUD_ADMIN_VM_TAG`. All Virtual Machines with this tag will be deleted when you uninstall.

### Steps 

1. Select **Run command** > **Packages** > **NetApp.CBS.AVS** > **Uninstall-NetAppCBSAppliance**.

1. Provide the required values, and then select **Run**. 

1. Check **Notifications** or the **Run Execution Status** pane to monitor the progress. 

## Change vCenter account password 

If you need to reset the vCenter account, follow this these steps. 

1. Select **Run command** > **Packages** > **NetApp.CBS.AVS** > **Invoke-ResetNetAppCBSApplianceVCenterPasswordA**.

1. Provide the required values, and then select **Run**. 

1. Check **Notifications** or the **Run Execution Status** pane to monitor the progress.

## Next steps

* [Back up Azure NetApp Files datastores and VMs using Cloud Backup](backup-azure-netapp-files-datastores-vms.md) 
* [Restore Virtual Machines using Cloud Backup](restore-azure-netapp-files-vms.md)