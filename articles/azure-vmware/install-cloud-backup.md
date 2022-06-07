---
title: Install Cloud Backup for Virtual Machines
description: Learn how to create Azure NetApp Files-based NSF datastores for Azure VMware Solution hosts.
ms.topic: how-to
ms.service: azure-vmware
ms.date: 06/07/2022
ms.custom: references_regions
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
 
    //image 

1. Provide the required values, and then select **Run**. 

On successful execution, the Cloud Backup for Virtual Machines will automatically be displayed in the VMware vSphere client. 

 

## Upgrade Cloud Backup for Virtual Machines 

You can execute this run command to upgrade the Cloud Backup for Virtual Machines to the next available version. 

### Before you begin 

* Backup the MySQL database of Cloud Backup for Virtual Machines. 

* Take snapshot copies of Cloud Backup for Virtual Machines. 

### Steps 

1. Select **Run command** > **Packages** > **NetApp.CBS.AVS** > **Install-NetAppCBSA**.

1. Provide the required values, and then select **Run**. 

1. Check **Notifications** or the **Run Execution Status** pane to monitor the progress. 

## Uninstall Cloud Backup for Virtual Machines 

You can execute the run command to uninstall Cloud Backup for Virtual Machines. 

### Before you begin 

* Backup the MySQL database of Cloud Backup for Virtual Machines. 

* Ensure that there are no other Virtual Machines installed in the VMware vSphere tag: `AVS_ANF_CLOUD_ADMIN_VM_TAG`. All Virtual Machines with this tag will be deleted when you uninstall.

### Steps 

1. Select **Run command** > **Packages** > **NetApp.CBS.AVS** > **Install-NetAppCBSA**.

1. Provide the required values, and then select **Run**. 

1. Check **Notifications** or the **Run Execution Status** pane to monitor the progress. 

1. Provide the required values, and then select **Run**. 

1. Check **Notifications** or the **Run Execution Status** pane to monitor the progress. 