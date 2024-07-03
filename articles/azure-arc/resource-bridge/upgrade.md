---
title: Upgrade Arc resource bridge
description: Learn how to upgrade Arc resource bridge using either cloud-managed upgrade or manual upgrade.  
ms.date: 12/07/2023
ms.topic: how-to
---

# Upgrade Arc resource bridge

This article describes how Arc resource bridge is upgraded, and the two ways upgrade can be performed: cloud-managed upgrade or manual upgrade. Currently, some private cloud providers differ in how they handle Arc resource bridge upgrades. 

## Private cloud providers
Currently, private cloud providers differ in how they perform Arc resource bridge upgrades. Review the following information to see how to upgrade your Arc resource bridge for a specific provider.

For **Arc-enabled VMware vSphere**, manual upgrade and cloud upgrade are available. Appliances on version 1.0.15 and higher are automatically opted-in to cloud-managed upgrade. In order for either upgrade option to work, [the upgrade prerequisites](#prerequisites) must be met. Microsoft may attempt to perform a cloud-managed upgrade of your Arc resource bridge at any time if your appliance will soon be out of support. While Microsoft offers cloud-managed upgrade, you’re still responsible for ensuring that your Arc resource bridge is within the supported n-3 versions. Disruptions could cause cloud-managed upgrade to fail and you may need to manual upgrade the Arc resource bridge. If you are close to being out of support, please manual upgrade to stay in supported versions.  Do not wait for cloud-managed upgrade. Any appliances that are earlier than version 1.0.15 must be manually upgraded. 

For **Azure Arc VM management (preview) on Azure Stack HCI**, appliance version 1.0.15 or higher is only available on Azure Stack HCI build 23H2. In HCI 23H2, the LCM tool manages upgrades across all HCI, Arc resource bridge, and extension components as a "validated recipe" package. Any preview version of Arc resource bridge must be removed prior to updating from 22H2 to 23H2. Attempting to upgrade Arc resource bridge independent of other HCI environment components may cause problems in your environment that could result in a disaster recovery scenario. For more information, visit the [Arc VM management FAQ page](/azure-stack/hci/manage/azure-arc-vms-faq).

For **Arc-enabled System Center Virtual Machine Manager (SCVMM)**, the manual upgrade feature is available for appliance version 1.0.14 and higher. Appliances below version 1.0.14 need to perform the recovery option to get to version 1.0.15 or higher. Review the steps for [performing the recovery operation](/azure/azure-arc/system-center-virtual-machine-manager/disaster-recovery), then delete the appliance VM from SCVMM and perform the recovery steps. This deploys a new resource bridge and reconnects pre-existing Azure resources.

## Prerequisites

Before upgrading an Arc resource bridge, the following prerequisites must be met: 

- The appliance VM must be online, healthy with a Status of "Running". You can check the Azure resource of your Arc resource bridge to verify.

- The [credentials in the appliance VM](maintenance.md#update-credentials-in-the-appliance-vm) must be up-to-date.  To test that the credentials within the Arc resource bridge VM are valid, perform an operation on an Arc-enabled VM from Azure or [update the credentials](/azure/azure-arc/resource-bridge/maintenance) to be certain.

- There must be sufficient space on the management machine (~3.5 GB) and appliance VM (35 GB) to download required images.
  
- For Arc-enabled VMware, upgrading the resource bridge requires 200GB of free space on the datastore. A new template is also created.

- The outbound connection from the Appliance VM IPs (`k8snodeippoolstart/end`, VM IP 1/2) to `msk8s.sb.tlu.dl.delivery.mp.microsoft.com`, port 443 must be enabled. Be sure the full list of [required endpoints for Arc resource bridge](network-requirements.md) are also enabled.

- If you are performing a manual upgrade, the upgrade command should be run from the management machine used to initially deploy the Arc resource bridge and still contains the [appliance configuration files](system-requirements.md#configuration-files) or one that meets the [management machine requirements](system-requirements.md#management-machine-requirements) and also contains the appliance configuration files.

- Arc resource bridge configured with DHCP can't be upgraded and aren't supported in a production environment. Instead, a new Arc resource bridge should be deployed using [static IP configuration](system-requirements.md#static-ip-configuration).  

## Overview

The upgrade process deploys a new resource bridge using the reserved appliance VM IP (`k8snodeippoolend` IP, VM IP 2). Once the new resource bridge is up, it becomes the active resource bridge. The old resource bridge is deleted, and its appliance VM IP (`k8dsnodeippoolstart`, VM IP 1) becomes the new reserved appliance VM IP that will be used in the next upgrade.

Deploying a new resource bridge consists of downloading the appliance image (~3.5 GB) from the cloud, using the image to deploy a new appliance VM, verifying the new resource bridge is running, connecting it to Azure, deleting the old appliance VM, and reserving the old IP to be used for a future upgrade.

Overall, the upgrade generally takes at least 30 minutes, depending on network speeds. A short intermittent downtime might happen during the handoff between the old Arc resource bridge to the new Arc resource bridge. Additional downtime can occur if prerequisites aren't met, or if a change in the network (DNS, firewall, proxy, etc.) impacts the Arc resource bridge's network connectivity.

There are two ways to upgrade Arc resource bridge: cloud-managed upgrades managed by Microsoft, or manual upgrades where Azure CLI commands are performed by an admin.

## Cloud-managed upgrade

Arc resource bridges on a supported [private cloud provider](#private-cloud-providers) with an appliance version 1.0.15 or higher are automatically opted into cloud-managed upgrade. With cloud-managed upgrade, Microsoft may attempt to upgrade your Arc resource bridge at any time if it is on an appliance version that will soon be out of support. The upgrade prerequisites must be met for cloud-managed upgrade to work. While Microsoft offers cloud-managed upgrade, you’re still responsible for checking that your resource bridge is healthy, online, in a "Running" status, and within the supported n-3 versions. Disruptions could cause cloud-managed upgrades to fail. If you are close to being out of support, please manual upgrade to stay in supported versions.  Do not wait for cloud-managed upgrade.

To check your resource bridge status and the appliance version run the `az arcappliance show` command from your management machine or check the Azure resource of your Arc resource bridge. If your appliance VM isn't in a healthy, Running state, cloud-managed upgrade might fail.

Cloud-managed upgrades are handled through Azure. A notification is pushed to Azure to reflect the state of the appliance VM as it upgrades. As the resource bridge progresses through the upgrade, its status might switch back and forth between different upgrade steps. Upgrade is complete when the appliance VM `status` is `Running` and `provisioningState` is `Succeeded`.  

To check the status of a cloud-managed upgrade, check the Azure resource in ARM, or run the following Azure CLI command from the management machine:  

```azurecli
az arcappliance show --resource-group [REQUIRED] --name [REQUIRED] 
```

## Manual upgrade

Arc resource bridge can be manually upgraded from the management machine. You must meet all upgrade prerequisites before attempting to upgrade. The management machine must have the kubeconfig and [appliance configuration files](system-requirements.md#configuration-files) stored locally or you will not be able to run the upgrade.

Manual upgrade generally takes between 30-90 minutes, depending on network speeds. The upgrade command takes your Arc resource bridge to the next appliance version, which might not be the latest available appliance version. Multiple upgrades could be needed to reach a [supported version](#supported-versions). You can check your appliance version by checking the Azure resource of your Arc resource bridge.

Before upgrading, you'll need the latest Azure CLI extension for `arcappliance`:

```azurecli
az extension add --upgrade --name arcappliance 
```

To manually upgrade your resource bridge, use the following command:

```azurecli
az arcappliance upgrade <private cloud> --config-file <file path to ARBname-appliance.yaml> 
```

For example, to upgrade a resource bridge on VMware, run: `az arcappliance upgrade vmware --config-file c:\contosoARB01-appliance.yaml`

To upgrade a resource bridge on SCVMM, run: `az arcappliance upgrade scvmm --config-file c:\contosoARB01-appliance.yaml`

To upgrade a resource bridge on Azure Stack HCI, please transition to 23H2 and use the built-in upgrade management tool. More info available [here](/azure-stack/hci/update/about-updates-23h2).

## Version releases

The Arc resource bridge version is tied to the versions of underlying components used in the appliance image, such as the Kubernetes version. When there's a change in the appliance image, the Arc resource bridge version gets incremented. This generally happens when a new `az arcappliance` CLI extension version is released. A new extension is typically released on a monthly cadence at the end of the month or early in the month. For detailed release info, see the [Arc resource bridge release notes](https://github.com/Azure/ArcResourceBridge/releases) on GitHub.

## Supported versions

Generally, the latest released version and the previous three versions (n-3) of Arc resource bridge are supported, starting from appliance version 1.0.15 and onward. An Arc resource bridge with an appliance version earlier than 1.0.15 must be upgraded or redeployed to be at minimum on appliance version 1.0.15 to be in a production support window.

For example, if the current version is 1.0.18, then the typical n-3 supported versions are:

- Current version: 1.0.18
- n-1 version: 1.0.17
- n-2 version: 1.0.16
- n-3 version: 1.0.15

There might be instances where supported versions aren't sequential. For example, version 1.0.18 is released and later found to contain a bug. A hot fix is released in version 1.0.19 and version 1.0.18 is removed. In this scenario, n-3 supported versions become 1.0.19, 1.0.17, 1.0.16, 1.0.15.

Arc resource bridge typically releases a new version on a monthly cadence, at the end of the month, although it's possible that delays could push the release date further out. Regardless of when a new release comes out, if you're within n-3 supported versions, then your Arc resource bridge version is supported. To stay updated on releases, visit the [Arc resource bridge release notes](https://github.com/Azure/ArcResourceBridge/releases) on GitHub.

If a resource bridge isn't upgraded to one of the supported versions (n-3), then it will fall outside the support window and be unsupported. If this happens, it might not always be possible to upgrade an unsupported resource bridge to a newer version, as component services used by Arc resource bridge could no longer be compatible. In addition, the unsupported resource bridge might not be able to provide reliable monitoring and health metrics.

If an Arc resource bridge is unable to be upgraded to a supported version, you must delete it and deploy a new resource bridge. Depending on which private cloud product you're using, there might be other steps required to reconnect the resource bridge to existing resources. For details, check the partner product's Arc resource bridge recovery documentation.

## Notification and upgrade availability

If your Arc resource bridge is at version n-3, you might receive an email notification letting you know that your resource bridge will be out of support once the next version is released. If you receive this notification, upgrade the resource bridge as soon as possible to allow debug time for any issues with manual upgrade, or submit a support ticket if cloud-managed upgrade was unable to upgrade your resource bridge.

To check if your Arc resource bridge has an upgrade available, run the command:

```azurecli
az arcappliance get-upgrades --resource-group [REQUIRED] --name [REQUIRED] 
```

To see the current version of an Arc resource bridge appliance, run `az arcappliance show` or check the Azure resource of your Arc resource bridge.

## Next steps

- Learn about [Arc resource bridge maintenance operations](maintenance.md).
- Learn about [troubleshooting Arc resource bridge](troubleshoot-resource-bridge.md).

