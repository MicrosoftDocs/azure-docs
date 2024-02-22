---
title: Manage Arc-enabled Azure VMware private cloud
description: Learn how to manage your Arc-enabled Azure VMware private cloud.
ms.topic: how-to 
ms.service: azure-vmware
ms.date: 2/6/2024
ms.custom: references_regions, engagement-fy23
---


# Manage Arc-enabled Azure VMware private cloud

In this article, learn how to update the Arc appliance credentials, upgrade the Arc resource bridge, and collect logs from the Arc resource bridge.

## Update Arc appliance credential

When **cloud admin** credentials are updated, use the following steps to update the credentials in the appliance store. 

1. Sign in to the Management VM from where the onboard process was performed. Change the directory to **onboarding directory**.
1. Run the following command:
	For Windows-based Management VM.
    
	`./.temp/.env/Scripts/activate`

	For Linux-based Management VM

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

> [!NOTE]
> Arc resource bridges, on a supported [private cloud provider](/azure/azure-arc/resource-bridge/upgrade#private-cloud-providers) with an appliance version **1.0.15 or higher**, are automatically opted in to [cloud-managed upgrade](/azure/azure-arc/resource-bridge/upgrade#cloud-managed-upgrade).  

Azure Arc-enabled Azure VMware Private Cloud requires the Arc resource bridge to connect your VMware vSphere environment with Azure. Periodically, new images of Arc resource bridge are released to include security and feature updates. The Arc resource bridge can be manually upgraded from the vCenter server. You must meet all upgrade [prerequisites](/azure/azure-arc/resource-bridge/upgrade#prerequisites) before attempting to upgrade. The vCenter server must have the kubeconfig and appliance configuration files stored locally. If the cloudadmin credentials change after the initial deployment of the resource bridge, [update the Arc appliance credential](/azure/azure-vmware/manage-arc-enabled-azure-vmware-solution#update-arc-appliance-credential) before you attempt a manual upgrade.

Arc resource bridge can be manually upgraded from the management machine. The [manual upgrade](/azure/azure-arc/resource-bridge/upgrade#manual-upgrade) generally takes between 30-90 minutes, depending on the network speed. The upgrade command takes your Arc resource bridge to the immediate next version, which might not be the latest available version. Multiple upgrades could be needed to reach a [supported version](/azure/azure-arc/resource-bridge/upgrade#supported-versions). Verify your resource bridge version by checking the Azure resource of your Arc resource bridge. 


## Collect logs from the Arc resource bridge

Perform ongoing administration for Arc-enabled VMware vSphere by [collecting logs from the Arc resource bridge](/azure/azure-arc/vmware-vsphere/administer-arc-vmware#collecting-logs-from-the-arc-resource-bridge).
