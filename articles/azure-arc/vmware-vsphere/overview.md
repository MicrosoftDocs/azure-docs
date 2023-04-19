---
title: What is Azure Arc-enabled VMware vSphere (preview)?
description: Azure Arc-enabled VMware vSphere (preview) extends Azure governance and management capabilities to VMware vSphere infrastructure and delivers a consistent management experience across both platforms. 
ms.topic: overview
ms.date: 09/15/2022
ms.custom: references_regions
---

# What is Azure Arc-enabled VMware vSphere (preview)?

Azure Arc-enabled VMware vSphere (preview) extends Azure governance and management capabilities to VMware vSphere infrastructure. With Azure Arc-enabled VMware vSphere, you get a consistent management experience across Azure and VMware vSphere infrastructure.

Arc-enabled VMware vSphere (preview) allows you to:

- Perform various VMware virtual machine (VM) lifecycle operations directly from Azure, such as create, start/stop, resize, and delete.

- Empower developers and application teams to self-serve VM operations on-demand using [Azure role-based access control](../../role-based-access-control/overview.md) (RBAC).

- Browse your VMware vSphere resources (VMs, templates, networks, and storage) in Azure, providing you a single pane view for your infrastructure across both environments. You can also discover and onboard existing VMware VMs to Azure.

- Conduct governance and monitoring operations across Azure and VMware VMs by enabling guest management (installing the [Azure Arc-enabled servers Connected Machine agent](../servers/agent-overview.md)).

## How does it work?

To deliver this experience, you need to deploy the [Azure Arc resource bridge](../resource-bridge/overview.md) (preview), which is a virtual appliance, in your vSphere environment. It connects your vCenter Server to Azure. Azure Arc resource bridge (preview) enables you to represent the VMware resources in Azure and do various operations on them.

## Supported VMware vSphere versions

Azure Arc-enabled VMware vSphere (preview) works with vCenter Server versions 6.7 and 7.

> [!NOTE]
> Azure Arc-enabled VMware vSphere  (preview)  supports vCenters with a maximum of 9500 VMs. If your vCenter has more than 9500 VMs, it is not recommended to use Arc-enabled VMware vSphere with it at this point.

## Supported scenarios

The following scenarios are supported in Azure Arc-enabled VMware vSphere (preview):

- Virtualized Infrastructure Administrators/Cloud Administrators can connect a vCenter instance to Azure and browse the VMware virtual machine inventory in Azure.

- Administrators can use the Azure portal to browse VMware vSphere inventory and register virtual machines resource pools, networks, and templates into Azure. They can also enable guest management on many registered virtual machines at once.

- Administrators can provide app teams/developers fine-grained permissions on those VMware resources through Azure RBAC.

- App teams can use Azure interfaces (portal, CLI, or REST API) to manage the lifecycle of on-premises VMs they use for deploying their applications (CRUD, Start/Stop/Restart).

- App teams and administrators can install extensions such as the Log Analytics agent, Custom Script Extension, Dependency Agent, and Azure Automation Hybrid Runbook Worker extension on the virtual machines and do operations supported by the extensions.

## Supported regions

You can use Azure Arc-enabled VMware vSphere (preview) in these supported regions:

- Australia East
- Canada Central
- East US
- Southeast Asia
- UK South
- West Europe

For the most up-to-date information about region availability of Azure Arc-enabled VMware vSphere, see [Azure Products by Region](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?products=azure-arc&regions=all) page

## Data Residency

Azure Arc-enabled VMware vSphere doesn't store/process customer data outside the region the customer deploys the service instance in.

## Next steps

- [Connect VMware vCenter to Azure Arc using the helper script](quick-start-connect-vcenter-to-arc-using-script.md)

- [Support matrix for Arc enabled VMware vSphere](support-matrix-for-arc-enabled-vmware-vsphere.md)
