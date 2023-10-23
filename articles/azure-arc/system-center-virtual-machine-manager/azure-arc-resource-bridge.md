---
title: Azure Arc resource bridge
description: Learn about Azure Arc resource bridge. 
ms.topic: Concepts
ms.date: 10/20/2023
ms.service: azure-arc
author: PriskeyJeronika-MS
ms.author: v-gjeronika
manager: jsuri
ms.services: azure-arc
ms.subservice: azure-arc-scvmm

#Customer intent: As an IT infrastructure admin, I want to know about the the Azure Arc resource bridge that facilitates the Arc connection between SCVMM server and Azure
---

# Azure Arc resource bridge

Azure Arc resource bridge (preview) is a Microsoft managed product that is part of the core Azure Arc platform. It is designed to host other Azure Arc services. The resource bridge supports VM self-servicing and management from Azure, for virtualized Windows and Linux virtual machines hosted in an on-premises environment on [Azure Stack HCI](https://learn.microsoft.com/azure-stack/hci/manage/azure-arc-vm-management-overview), VMware ([Arc-enabled VMware vSphere](https://learn.microsoft.com/azure/azure-arc/vmware-vsphere/) preview), and System Center Virtual Machine Manager (SCVMM) ([Arc-enabled SCVMM](https://learn.microsoft.com/azure/azure-arc/system-center-virtual-machine-manager/).

Azure Arc resource bridge is a Kubernetes management cluster installed on the customer’s on-premises infrastructure. The resource bridge is provided with the credentials to the infrastructure control plane that allows it to apply guest management services on the on-premises resources. Arc resource bridge enables projection of on-premises resources as ARM resources and management from ARM as *arc-enabled* Azure resources.
Arc resource bridge delivers the following benefits:
- Enables VM self-servicing from Azure without having to create and manage a Kubernetes cluster.
- Fully supported by Microsoft, including updates to core components.
- Supports deployment to any private cloud hosted on Hyper-V or VMware from the Azure portal or using the Azure Command Line Interface (CLI).

## Overview
Azure Arc resource bridge (preview) hosts other components such as [custom locations](https://microsoftapc.sharepoint.com/:w:/t/AzureCoreIDC/EQ4_NliWVCFMtRqzCpkQfrUB3HkS1JwLE8KpoZBUmtNGjg?e=HANuI5), cluster extensions, and other Azure Arc agents in order to deliver the level of functionality with the private cloud infrastructures it supports. This complex system is composed of three layers:
- The base layer represents the resource bridge and the Arc agents.
- The platform layer that includes the custom location and cluster extension. 
- The solution layer for each service supported by Arc resource bridge (that is, the different type of VMs).
 
Azure Arc resource bridge (preview) can host other Azure services or solutions running on-premises. For this preview, there are two objects hosted on the Arc resource bridge (preview):
- Cluster extension: The Azure service deployed to run on-premises. For the preview release, it supports three services:
    - Azure Arc-enabled VMware
    - Azure Arc-enabled Azure Stack HCI
    - Azure Arc-enabled System Center Virtual Machine Manager (SCVMM)
- Custom locations: A deployment target where you can create Azure resources. It maps to different resources for different Azure services. For example, for Arc-enabled VMware, the custom locations resource maps to an instance of vCenter, and for Arc-enabled Azure Stack HCI, it maps to an HCI cluster instance.
Custom locations and cluster extension are both Azure resources, which are linked to the Azure Arc resource bridge (preview) resource in Azure Resource Manager. When you create an on-premises VM from Azure, you can select the custom location, and that routes that *create action* to the mapped vCenter, Azure Stack HCI cluster, or SCVMM.
Some resources are unique to the infrastructure. For example, vCenter has a resource pool, network, and template resources. During VM creation, these resources need to be specified. With Azure Stack HCI, you just need to select the custom location, network, and template to create a VM.
To summarize, the Azure resources are projections of the resources running in your on-premises private cloud. If the on-premises resource is not healthy, it can impact the health of the related resources that are projected in Azure. For example, if the resource bridge is deleted by accident, all the resources projected in Azure by the resource bridge are impacted. The on-premises VMs in your on-premises private cloud are not impacted, as they are running on vCenter, but you won't be able to start or stop the VMs from Azure. It is not recommended to directly manage or modify the resource bridge using any on-premises applications.

## Benefits of Azure Arc resource bridge (preview)

Through Azure Arc resource bridge (preview), you can connect an SCVMM management server to Azure by deploying Azure Arc resource bridge (preview) in the VMM environment. Azure Arc resource bridge (preview) enables you to represent the SCVMM resources (clouds, VMs, templates etc.) in Azure and perform various operations on them:
- Start, stop, and restart a virtual machine.
- Control access and add Azure tags.
- Add, remove, and update network interfaces.
- Add, remove, and update disks and update VM size (CPU cores and memory).
- Enable guest management.
- Install extensions.

### Regional resiliency
While Azure has a number of redundancy features at every level of failure, if a service impacting event occurs, the current release of Azure Arc resource bridge does not support cross-region failover or other resiliency capabilities. In the event of the service becoming unavailable, the on-premises VMs continue to operate unaffected.
Management from Azure is unavailable during that service outage.

### Supported versions
Arc resource bridge typically releases a new version on a monthly cadence, at the end of the month. Delays may occur that could push the release date further out. Regardless of when a new release comes out, if you are within n-3 supported versions, then your Arc resource bridge version is supported. To stay updated on releases, visit the Arc resource bridge release notes on GitHub. To learn more about upgrade options, visit Upgrade Arc resource bridge.

## Next steps
Learn more about [Arc-enabled SCVMM](https://learn.microsoft.com/azure/azure-arc/system-center-virtual-machine-manager/overview)
