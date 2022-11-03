---
title: Azure Arc resource bridge (preview) overview
description: Learn how to use Azure Arc resource bridge (preview) to support VM self-servicing on Azure Stack HCI, VMware, and System Center Virtual Machine Manager.
ms.date: 11/03/2022
ms.topic: overview
ms.custom: references_regions 
---

# What is Azure Arc resource bridge (preview)?

Azure Arc resource bridge (preview) is part of the core Azure Arc platform, and is designed to host other Azure Arc services. In this release, the resource bridge supports VM self-servicing and management from Azure, for virtualized Windows and Linux virtual machines hosted in an on-premises environment on [Azure Stack HCI](/azure-stack/hci/overview) and VMware.

The resource bridge is a packaged virtual machine, which hosts a *management* Kubernetes cluster that requires no user management. This virtual appliance delivers the following benefits:

* Enables VM self-servicing from Azure without having to create and manage a Kubernetes cluster.
* Fully supported by Microsoft, including updates to core components.
* Designed to recover from software failures.
* Supports deployment to any private cloud hosted on Hyper-V or VMware from the Azure portal or using the Azure Command-Line Interface (CLI).

All management operations are performed from Azure, so no local configuration is required on the appliance.

## Overview

Azure Arc resource bridge (preview) hosts other components such as [custom locations](..\platform\conceptual-custom-locations.md), cluster extensions, and other Azure Arc agents in order to deliver the level of functionality with the private cloud infrastructures it supports. This complex system is composed of three layers:

* The base layer that represents the resource bridge and the Arc agents.
* The platform layer that includes the custom location and cluster extension.
* The solution layer for each service supported by Arc resource bridge (that is, the different type of VMs).

:::image type="content" source="media/overview/architecture-overview.png" alt-text="Azure Arc resource bridge architecture diagram." border="false":::

Azure Arc resource bridge (preview) can host other Azure services or solutions running on-premises. For this preview, there are two objects hosted on the Arc resource bridge (preview):

* Cluster extension: The Azure service deployed to run on-premises. For the preview release, it supports three services:

  * Azure Arc-enabled VMware
  * Azure Arc-enabled Azure Stack HCI
  * Azure Arc-enabled System Center Virtual Machine Manager (SCVMM)

* Custom locations: A deployment target where you can create Azure resources. It maps to different resource for different Azure services. For example, for Arc-enabled VMware, the custom locations resource maps to an instance of vCenter, and for Arc-enabled Azure Stack HCI, it maps to an HCI cluster instance.

Custom locations and cluster extension are both Azure resources, which are linked to the Azure Arc resource bridge (preview) resource in Azure Resource Manager. When you create an on-premises VM from Azure, you can select the custom location, and that routes that *create action* to the mapped vCenter, Azure Stack HCI cluster, or SCVMM.

Some resources are unique to the infrastructure. For example, vCenter has a resource pool, network, and template resources. During VM creation, these resources need to be specified. With Azure Stack HCI, you just need to select the custom location, network and template to create a VM.

To summarize, the Azure resources are projections of the resources running in your on-premises private cloud. If the on-premises resource is not healthy, it can impact the health of the related resources. For example, if the Arc resource bridge (preview) has been deleted by accident, all the resources hosted in the Arc resource bridge (preview) are impacted. That is, the custom locations and cluster extensions are deleted as a result. The actual VMs are not impacted, as they are running on vCenter, but the management path to those VMs is interrupted, and you won't be able to start or stop the VM from Azure. It is not recommended to manage or modify the Arc resource bridge (preview) using any on-premises applications directly.

## Benefits of Azure Arc resource bridge (preview)

Through Azure Arc resource bridge (preview), you can accomplish the following for each private cloud infrastructure from Azure:

### VMware vSphere

By registering resource pools, networks, and VM templates, you can represent a subset of your vCenter resources in Azure to enable self-service. Integration with Azure allows you to manage access to your vCenter resources in Azure to maintain a secure environment. You can also perform various operations on the VMware virtual machines that are enabled by Arc-enabled VMware vSphere:

* Start, stop, and restart a virtual machine
* Control access and add Azure tags
* Add, remove, and update network interfaces
* Add, remove, and update disks and update VM size (CPU cores and memory)
* Enable guest management
* Install extensions

### Azure Stack HCI

You can provision and manage on-premises Windows and Linux virtual machines (VMs) running on Azure Stack HCI clusters.

### System Center Virtual Machine Manager (SCVMM) 

You can connect an SCVMM management server to Azure by deploying Azure Arc resource bridge (preview) in the VMM environment. Azure Arc resource bridge (preview) enables you to represent the SCVMM resources (clouds, VMs, templates etc.) in Azure and perform various operations on them:

* Start, stop, and restart a virtual machine
* Control access and add Azure tags
* Add, remove, and update network interfaces
* Add, remove, and update disks and update VM size (CPU cores and memory)

## Prerequisites

[Azure CLI](/cli/azure/install-azure-cli) is required to deploy the Azure Arc resource bridge on supported private cloud environments.

If you are deploying on VMware, a x64 Python environment is required. The [pip](https://pypi.org/project/pip/) package installer for Python is also required.

If you are deploying on Azure Stack HCI, the x32 Azure CLI installer can be used to install Azure CLI.

### Supported regions

Azure Arc resource bridge currently supports the following Azure regions:

* East US
* West Europe
* UK South
* Canada Central
* Australia East
* Southeast Asia

### Regional resiliency

While Azure has a number of redundancy features at every level of failure, if a service impacting event occurs, this preview release of Azure Arc resource bridge does not support cross-region failover or other resiliency capabilities. In the event of the service becoming unavailable, the on-premises VMs continue to operate unaffected. Management from Azure is unavailable during that service outage.

### Private cloud environments

The following private cloud environments and their versions are officially supported for the Azure Arc resource bridge:

* VMware vSphere version 6.7
* Azure Stack HCI

### Required Azure permissions

* To onboard the Arc resource bridge, you must have the [Contributor](../../role-based-access-control/built-in-roles.md#contributor) role for the resource group.
* To read, modify, and delete the Arc resource bridge, you must have the [Contributor](../../role-based-access-control/built-in-roles.md#contributor) role for the resource group.

### Networking

The Arc resource bridge communicates outbound securely to Azure Arc over TCP port 443. If the appliance needs to connect through a firewall or proxy server to communicate over the internet, it communicates outbound using the HTTPS protocol.

You may need to allow specific URLs to [ensure outbound connectivity is not blocked](troubleshoot-resource-bridge.md#restricted-outbound-connectivity) by your firewall or proxy server.

## Next steps

* Learn more about [how Azure Arc-enabled VMware vSphere extends Azure's governance and management capabilities to VMware vSphere infrastructure](../vmware-vsphere/overview.md).
* Learn more about [provisioning and managing on-premises Windows and Linux VMs running on Azure Stack HCI clusters](/azure-stack/hci/manage/azure-arc-enabled-virtual-machines).
