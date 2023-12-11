---
title: Manage Arc-enabled Azure VMware private cloud
description: Learn how to manage your Arc-enabled Azure VMware private cloud.
ms.topic: how-to 
ms.service: azure-vmware
ms.date: 12/11/2023
ms.custom: references_regions, engagement-fy23
---


# Manage Arc-enabled Azure VMware private cloud

In this article, learn how to update the Arc appliance credentials, upgrade the Arc resource bridge, and collect logs from the Arc resource bridge.

## Update Arc appliance credential

When **cloud admin** credentials are updated, use the following steps to update the credentials in the appliance store. 

1. Sign in to the jumpbox VM from where the onboard process was performed. Change the directory to **onboarding directory**.
1. Run the following command:
	For Windows-based jumpbox VM.
    
	`./.temp/.env/Scripts/activate`

	For Linux-based jumpbox VM

	`./.temp/.env/bin/activate

1. Run the following command:

    `az arcappliance update-infracredentials vmware --kubeconfig <kubeconfig file>`

1. Run the following command:

`az connectedvmware vcenter connect --debug --resource-group {resource-group} --name {vcenter-name-in-azure} --location {vcenter-location-in-azure} --custom-location {custom-location-name} --fqdn {vcenter-ip} --port {vcenter-port} --username cloudadmin@vsphere.local --password {vcenter-password}`
    
> [!NOTE]
> Customers need to ensure kubeconfig and SSH keys remain available as they will be required for log collection, appliance Upgrade, and credential rotation. These parameters will be required at the time of upgrade, log collection, and credential update scenarios.

**Parameters**

Required parameters

`-kubeconfig # kubeconfig of Appliance resource`

**Examples**

The following command invokes the set credential for the specified appliance resource.

` az arcappliance setcredential <provider> --kubeconfig <kubeconfig>`

## Upgrade the Arc resource bridge

Azure Arc-enabled Azure VMware Private Cloud requires the Arc resource bridge to connect your VMware vSphere environment with Azure. Periodically, new images of Arc resource bridge are released to include security and feature updates. The Arc resource bridge can be manually upgraded from the vCenter server. You must meet all upgrade [prerequisites](https://review.learn.microsoft.com/azure/azure-arc/resource-bridge/upgrade?branch=main#prerequisites) before attempting to upgrade. The vCenter server must have the kubeconfig and appliance configuration files stored locally. If the cloudadmin credentials change after the initial deployment of the resource bridge, [update the Arc appliance credential](https://learn.microsoft.com/azure/azure-vmware/manage-arc-enabled-azure-vmware-solution#update-arc-appliance-credential) before you attempt a manual upgrade.

Arc resource bridge can be manually upgraded from the management machine. The [manual upgrade](https://review.learn.microsoft.com/azure/azure-arc/resource-bridge/upgrade?branch=main#manual-upgrade) generally takes between 30-90 minutes, depending on the network speed. The upgrade command takes your Arc resource bridge to the immediate next version, which might not be the latest available version. Multiple upgrades could be needed to reach a [supported version](https://review.learn.microsoft.com/azure/azure-arc/resource-bridge/upgrade?branch=main#supported-versions). Verify your resource bridge version by checking the Azure resource of your Arc resource bridge. 

Arc resource bridges, on a supported [private cloud provider](https://review.learn.microsoft.com/azure/azure-arc/resource-bridge/upgrade?branch=main#private-cloud-providers) with an appliance version 1.0.15 or higher, are automatically opted in to [cloud-managed upgrade](https://review.learn.microsoft.com/azure/azure-arc/resource-bridge/upgrade?branch=main#cloud-managed-upgrade).  

> [!NOTE]
> To upgrade the Arc resource bridge VM to the latest version, you need to perform onboarding again with the **same resource IDs**. When you perform onboarding it will cause some downtime as operations that are performed through Arc during this time could fail.

Use the following steps to perform a manual upgrade for Arc appliance virtual machine (VM). 

1. Sign in to vCenter Server. 
1. Locate the Arc appliance VM, which should be in the resource pool that was configured during onboarding. 
1. Power off the VM. 
1. Delete the VM. 
1. Delete the download template corresponding to the VM. 
1. Delete the resource bridge **Azure Resource Manager** resource. 
1. Get the previous script `Config_avs` file and add the following configuration item: 

	`"register":false`

1. Download the latest version of the Azure VMware Solution [onboarding script](/azure/azure-vmware/deploy-arc-for-azure-vmware-solution?tabs=windows#onboard-process-to-deploy-azure-arc). 
1. Run the new onboarding script with the previous `config_avs.json` from the jump box VM, without changing other config items. 

## Collect logs from the Arc resource bridge

Perform ongoing administration for Arc-enabled VMware vSphere by [collecting logs from the Arc resource bridge](/azure/azure-arc/vmware-vsphere/administer-arc-vmware#collecting-logs-from-the-arc-resource-bridge).
