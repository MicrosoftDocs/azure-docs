---
title: Upgrade Arc resource bridge (preview)
description: Learn how to upgrade Arc resource bridge (preview) using either cloud-managed upgrade or manual upgrade.  
ms.date: 10/02/2023
ms.topic: how-to
---

# Upgrade Arc resource bridge (preview)

This article describes how Arc resource bridge (preview) is upgraded and the two ways upgrade can be performed, using cloud-managed upgrade or manual upgrade.

> [!IMPORTANT]
> Currently, you must request access in order to use cloud-managed upgrade. To do so, [open a support request](/azure/azure-portal/supportability/how-to-create-azure-support-request). Select **Technical** for **Issue type** and **Azure Arc Resource Bridge** for **Service type**. In the **Summary** field, enter *Requesting access to cloud-managed upgrade*, and select **Resource Bridge Agent issue** for **Problem type**. Complete the rest of the support request and then select **Create**. We'll review your account and contact you to confirm your access to cloud-managed upgrade.

## Prerequisites

In order to upgrade resource bridge, its status must be online and the [credentials in the appliance VM](maintenance.md#update-credentials-in-the-appliance-vm) must be valid.

There must be sufficient space on the management machine and appliance VM to download required images (~3.5 GB). For VMware, a new template is created.

Currently, in order to upgrade Arc resource bridge, you must enable outbound connection from the Appliance VM IPs (`k8snodeippoolstart/end`, VM IP 1/2) to `msk8s.sb.tlu.dl.delivery.mp.microsoft.com`, port 443. Be sure the full list of [required endpoints for Arc resource bridge](network-requirements.md) are also enabled.

Arc resource bridges configured with DHCP can't be upgraded and won't be supported in production. A new Arc resource bridge should be deployed using [static IP configuration](system-requirements.md#static-ip-configuration).  

## Overview

The upgrade process deploys a new resource bridge using the reserved appliance VM IP (`k8snodeippoolend` IP, VM IP 2). Once the new resource bridge is up, it becomes the active resource bridge. The old resource bridge is deleted, and its appliance VM IP (`k8dsnodeippoolstart`, VM IP 1) becomes the new reserved appliance VM IP that will be used in the next upgrade.

Deploying a new resource bridge consists of downloading the appliance image (~3.5 GB) from the cloud, using the image to deploy a new appliance VM, verifying the new resource bridge is running, connecting it to Azure, deleting the old appliance VM, and reserving the old IP to be used for a future upgrade.

Overall, the upgrade generally takes at least 30 minutes, depending on network speeds. A short intermittent downtime may happen during the handoff between the old Arc resource bridge to the new Arc resource bridge. Additional downtime may occur if prerequisites are not met, or if a change in the network (DNS, firewall, proxy, etc.) impacts the Arc resource bridge's ability to communicate.

There are two ways to upgrade Arc resource bridge: cloud-managed upgrades managed by Microsoft, or manual upgrades where Azure CLI commands are performed by an admin.

## Cloud-managed upgrade

Arc resource bridge is a Microsoft-managed product. Microsoft manages upgrades of Arc resource bridge through cloud-managed upgrade. Cloud-managed upgrade allows Microsoft to ensure that the resource bridge remains on a supported version.

> [!IMPORTANT]
> As noted earlier, cloud-managed upgrades are currently available only to customers who request access by opening a support request.

Cloud-managed upgrades are handled through Azure. A notification is pushed to Azure to reflect the state of the appliance VM as it upgrades. As the resource bridge progresses through the upgrade, its status may switch back and forth between different upgrade steps. Upgrade is complete when the appliance VM `status` is `Running` and `provisioningState` is `Succeeded`.  

To check the status of a cloud-managed upgrade, check the Azure resource in ARM or run the following Azure CLI command from the management machine:  

```azurecli
az arcappliance show --resource-group [REQUIRED] --name [REQUIRED] 
```

## Manual upgrade

Arc resource bridge can be manually upgraded from the management machine. The management machine must have the kubeconfig and appliance configuration files stored locally. Manual upgrade generally takes between 30-90 minutes, depending on network speeds.  

To manually upgrade your Arc resource bridge, make sure you have installed the latest `az arcappliance` CLI extension by running the extension upgrade command from the management machine:

```azurecli
az extension add --upgrade --name arcappliance 
```

To manually upgrade your resource bridge, use the following command:

```azurecli
az arcappliance upgrade <private cloud> --config-file <file path to ARBname-appliance.yaml> 
```

For example: `az arcappliance upgrade vmware --config-file c:\contosoARB01-appliance.yaml`

## Private cloud providers

Partner products that use Arc resource bridge may choose to handle upgrades differently, including enabling cloud-managed upgrade by default. This article will be updated to reflect any such changes.

[Azure Arc VM management (preview) on Azure Stack HCI](/azure-stack/hci/manage/azure-arc-vm-management-overview) handles upgrades across all components as a "validated recipe" package, and upgrades are applied using the LCM tool. You must manually apply the packaged upgrade using the LCM tool.  

## Version releases

The Arc resource bridge version is tied to the versions of underlying components used in the appliance image, such as the Kubernetes version. When there is a change in the appliance image, the Arc resource bridge version gets incremented. This generally happens when a new `az arcappliance` CLI extension version is released. An updated extension is typically released on a monthly cadence at the end of the month. For detailed release info, refer to the [Arc resource bridge release notes](https://github.com/Azure/ArcResourceBridge/releases) on GitHub.

## Notification and upgrade availability

If your Arc resource bridge is at n-3 version, then you may receive an email notification letting you know that your resource bridge may soon be out of support once the next version is released. If you receive this notification, upgrade the resource bridge as soon as possible to allow debug time for any issues with manual upgrade, or submit a support ticket if cloud-managed upgrade was unable to upgrade your resource bridge.  

To check if your Arc resource bridge has an upgrade available, run the command:

```azurecli
az arcappliance get-upgrades --resource-group [REQUIRED] --name [REQUIRED] 
```

To see the current version of an Arc resource bridge appliance, run `az arcappliance show` or check the Azure resource.  

To find the latest released version of Arc resource bridge, check the [Arc resource bridge release notes](https://github.com/Azure/ArcResourceBridge/releases) on GitHub.

## Supported versions

Generally, the latest released version and the previous three versions (n-3) of Arc resource bridge are supported. For example, if the current version is 1.0.10, then the typical n-3 supported versions are:

- Current version: 1.0.10
- n-1 version: 1.0.9
- n-2 version: 1.0.8
- n-3 version: 1.0.7

There may be instances where supported versions are not sequential. For example, version 1.0.11 is released and later found to contain a bug. A hot fix is released in version 1.0.12 and version 1.0.11 is removed. In this scenario, n-3 supported versions become 1.0.12, 1.0.10, 1.0.9, 1.0.8.

Arc resource bridge typically releases a new version on a monthly cadence, at the end of the month. Delays may occur that could push the release date further out. Regardless of when a new release comes out, if you are within n-3 supported versions, then your Arc resource bridge version is supported. To stay updated on releases, visit the [Arc resource bridge release notes](https://github.com/Azure/ArcResourceBridge/releases) on GitHub.

If a resource bridge is not upgraded to one of the supported versions (n-3), then it will fall outside the support window and be unsupported. If this happens, it may not always be possible to upgrade an unsupported resource bridge to a newer version, as component services used by Arc resource bridge may no longer be compatible. In addition, the unsupported resource bridge may not be able to provide reliable monitoring and health metrics.

If an Arc resource bridge is unable to be upgraded to a supported version, you must delete it and deploy a new resource bridge. Depending on which private cloud product you're using, there may be other steps required to reconnect the resource bridge to existing resources. For details, check the partner product's Arc resource bridge recovery documentation.

## Next steps

- Learn about [Arc resource bridge maintenance operations](maintenance.md).
- Learn about [troubleshooting Arc resource bridge](troubleshoot-resource-bridge.md).
