---
title: Azure Arc resource bridge (preview) overview
description: Learn how to use Azure Arc resource bridge (preview) to support VM self-servicing on Azure Stack HCI, VMware, and System Center Virtual Machine Manager.
ms.date: 02/15/2023
ms.topic: overview
ms.custom: references_regions
---

# What is Azure Arc resource bridge (preview)?

Azure Arc resource bridge (preview) is a Microsoft managed product that is part of the core Azure Arc platform. It is designed to host other Azure Arc services. In this release, the resource bridge supports VM self-servicing and management from Azure, for virtualized Windows and Linux virtual machines hosted in an on-premises environment on [Azure Stack HCI](/azure-stack/hci/manage/azure-arc-vm-management-overview), VMware ([Arc-enabled VMware vSphere](../vmware-vsphere/index.yml) preview), and System Center Virtual Machine Manager (SCVMM) ([Arc-enabled SCVMM](../system-center-virtual-machine-manager/index.yml) preview).

Arc resource bridge is a packaged virtual machine that hosts a *management* Kubernetes cluster and requires minimal user management. The virtual machine is deployed on the on-premises infrastructure, and an ARM resource of Arc resource bridge is created in Azure. The two resources are then connected, allowing VM self-service and management from Azure. The on-premises resource bridge uses guest management to tag local resources, making them available in Azure.

Arc resource bridge delivers the following benefits:

* Enables VM self-servicing from Azure without having to create and manage a Kubernetes cluster.
* Fully supported by Microsoft, including updates to core components.
* Designed to recover from software failures.
* Supports deployment to any private cloud hosted on Hyper-V or VMware from the Azure portal or using the Azure Command-Line Interface (CLI).

## Overview

Azure Arc resource bridge (preview) hosts other components such as [custom locations](..\platform\conceptual-custom-locations.md), cluster extensions, and other Azure Arc agents in order to deliver the level of functionality with the private cloud infrastructures it supports. This complex system is composed of three layers:

* The base layer that represents the resource bridge and the Arc agents.
* The platform layer that includes the custom location and cluster extension.
* The solution layer for each service supported by Arc resource bridge (that is, the different type of VMs).

:::image type="content" source="media/overview/architecture-overview.png" alt-text="Azure Arc resource bridge architecture diagram." border="false" lightbox="media/overview/architecture-overview.png":::

Azure Arc resource bridge (preview) can host other Azure services or solutions running on-premises. For this preview, there are two objects hosted on the Arc resource bridge (preview):

* Cluster extension: The Azure service deployed to run on-premises. For the preview release, it supports three services:

  * Azure Arc-enabled VMware
  * Azure Arc-enabled Azure Stack HCI
  * Azure Arc-enabled System Center Virtual Machine Manager (SCVMM)

* Custom locations: A deployment target where you can create Azure resources. It maps to different resource for different Azure services. For example, for Arc-enabled VMware, the custom locations resource maps to an instance of vCenter, and for Arc-enabled Azure Stack HCI, it maps to an HCI cluster instance.

Custom locations and cluster extension are both Azure resources, which are linked to the Azure Arc resource bridge (preview) resource in Azure Resource Manager. When you create an on-premises VM from Azure, you can select the custom location, and that routes that *create action* to the mapped vCenter, Azure Stack HCI cluster, or SCVMM.

Some resources are unique to the infrastructure. For example, vCenter has a resource pool, network, and template resources. During VM creation, these resources need to be specified. With Azure Stack HCI, you just need to select the custom location, network and template to create a VM.

To summarize, the Azure resources are projections of the resources running in your on-premises private cloud. If the on-premises resource is not healthy, it can impact the health of the related resources that are projected in Azure. For example, if the resource bridge is deleted by accident, all the resources projected in Azure by the resource bridge are impacted. The on-premises VMs in your on-premises private cloud are not impacted, as they are running on vCenter but you won't be able to start or stop the VMs from Azure. It is not recommended to directly manage or modify the resource bridge using any on-premises applications.

## Benefits of Azure Arc resource bridge (preview)

Through Azure Arc resource bridge (preview), you can accomplish the following for each private cloud infrastructure from Azure:

### Azure Stack HCI

You can provision and manage on-premises Windows and Linux virtual machines (VMs) running on Azure Stack HCI clusters.

### VMware vSphere

By registering resource pools, networks, and VM templates, you can represent a subset of your vCenter resources in Azure to enable self-service. Integration with Azure allows you to manage access to your vCenter resources in Azure to maintain a secure environment. You can also perform various operations on the VMware virtual machines that are enabled by Arc-enabled VMware vSphere:

* Start, stop, and restart a virtual machine
* Control access and add Azure tags
* Add, remove, and update network interfaces
* Add, remove, and update disks and update VM size (CPU cores and memory)
* Enable guest management
* Install extensions

### System Center Virtual Machine Manager (SCVMM)

You can connect an SCVMM management server to Azure by deploying Azure Arc resource bridge (preview) in the VMM environment. Azure Arc resource bridge (preview) enables you to represent the SCVMM resources (clouds, VMs, templates etc.) in Azure and perform various operations on them:

* Start, stop, and restart a virtual machine
* Control access and add Azure tags
* Add, remove, and update network interfaces
* Add, remove, and update disks and update VM size (CPU cores and memory)

### Supported regions

In order to use Arc resource bridge in a region, Arc resource bridge and the arc-enabled feature for a private cloud must be supported in the region. For example, to use Arc resource bridge with Azure Stack HCI in East US, Arc resource bridge and the Arc VM management feature for Azure Stack HCI must be supported in East US. Please check with the private cloud product for their feature region availability - it is typically in their [deployment guide](deploy-cli.md#az-arcappliance-createconfig) for Arc resource bridge. There are instances where Arc Resource Bridge may be available in a region where the private cloud feature is not yet available. 

Arc resource bridge supports the following Azure regions:

* East US
* East US 2
* West US 2
* West US 3
* Central US
* South Central US
* West Europe
* North Europe
* UK South
* Sweden Central
* Canada Central
* Australia East
* Southeast Asia

### Regional resiliency

While Azure has a number of redundancy features at every level of failure, if a service impacting event occurs, this preview release of Azure Arc resource bridge does not support cross-region failover or other resiliency capabilities. In the event of the service becoming unavailable, the on-premises VMs continue to operate unaffected. Management from Azure is unavailable during that service outage.

### Private cloud environments

The following private cloud environments and their versions are officially supported for Arc resource bridge:

* VMware vSphere version 6.7, 7.0, 8.0
* Azure Stack HCI
* SCVMM


### Supported versions

Generally, the latest released version and the previous three versions (n-3) of Arc resource bridge are supported. For example, if the current version is 1.0.10, then the typical n-3 supported versions are:

- Current version: 1.0.10
- n-1 version: 1.0.9
- n-2 version: 1.0.8
- n-3 version: 1.0.7

There may be instances where supported versions are not sequential. For example, version 1.0.11 is released and later found to contain a bug. A hot fix is released in version 1.0.12 and version 1.0.11 is removed. In this scenario, n-3 supported versions become 1.0.12, 1.0.10, 1.0.9, 1.0.8.

Arc resource bridge typically releases a new version on a monthly cadence, at the end of the month. Delays may occur that could push the release date further out. Regardless of when a new release comes out, if you are within n-3 supported versions, then your Arc resource bridge version is supported. To stay updated on releases, visit the [Arc resource bridge release notes](https://github.com/Azure/ArcResourceBridge/releases) on GitHub. To learm more about upgrade options, visit [Upgrade Arc resource bridge](upgrade.md).

If a resource bridge is not upgraded to one of the supported versions (n-3), then it will fall outside the support window and be unsupported. If this happens, it may not always be possible to upgrade an unsupported resource bridge to a newer version, as component services used by Arc resource bridge may no longer be compatible. In addition, the unsupported resource bridge may not be able to provide reliable monitoring and health metrics.

If an Arc resource bridge is unable to be upgraded to a supported version, you must delete it and deploy a new resource bridge. Depending on which private cloud product you're using, there may be other steps required to reconnect the resource bridge to existing resources. For details, check the partner product's Arc resource bridge recovery documentation.

## Next steps

* Learn more about [how Azure Arc-enabled VMware vSphere extends Azure's governance and management capabilities to VMware vSphere infrastructure](../vmware-vsphere/overview.md).
* Learn more about [provisioning and managing on-premises Windows and Linux VMs running on Azure Stack HCI clusters](/azure-stack/hci/manage/azure-arc-enabled-virtual-machines).
* Review the [system requirements](system-requirements.md) for deploying and managing Arc resource bridge.



