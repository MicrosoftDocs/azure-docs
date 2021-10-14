---
title: What is Azure Arc-enabled VMware vSphere?
description: Azure Arc enabled VMware vSphere extends Azure's governance and management capabilities to VMware vSphere infrastructure and delivers a consistent management experience across both platforms. 
ms.topic: overview
ms.date: 09/28/2021
ms.custom: references_regions
---

# What is Azure Arc enabled VMware vSphere?

Azure Arc-enabled VMware vSphere extends Azure's governance and management capabilities to VMware vSphere infrastructure.  It also delivers a consistent management experience across both platforms. 

Arc-enabled VMware vSphere allows you to:
 
 - Conduct various VMware virtual machine (VM) lifecycle operations directly from Azure, such as create, start/stop, resize, and delete.

 - Empower developers and application teams to self-serve VM operations on-demand using Azure Role-Based Access Control (RBAC).

 - Browse your VMware vSphere resources (VMs, templates, networks, and storage) in Azure, providing you a single pane view for your infrastructure across both environments. You can also discover and onboard existing VMware VMs to Azure.

- Conduct governance and monitoring operations across Azure and VMware VMs by enabling guest management (installing Connected Machine agent).

## How does it work?

To deliver this experience, you need to deploy the Arc Resource Bridge (a virtual appliance) in your vSphere environment, and it connects your vCenter to Azure. Arc Resource Bridge enables you to represent the VMware resources in Azure and do various operations on them.

## Supported VMware vSphere versions

Azure Arc enabled VMware vSphere currently works with VMware vSphere version 6.5 and above.

## Supported scenarios

The following scenarios are supported in Azure Arc-enabled VMware vSphere:

- Virtualized Infrastructure Administrators/Cloud Administrators can connect a vCenter instance to Azure and browse the VMware virtual machine inventory in Azure

- Administrators can use the Azure portal to browse VMware vSphere inventory and register virtual machines resource pools, networks, and templates into Azure. They can also bulk-enabled guest management on registered virtual machines.

- Administrators can provide app teams/developers fine-grained permissions on those VMware resources through Azure RBAC.

- App teams can use Azure portal, CLI, or REST API to manage the lifecycle of on-premises VMs they use for deploying their applications (CRUD, Start/Stop/Restart).

- App teams and administrators can install extensions (LogAnalytics agent, Custom Script extension, DependencyAgent) onto the virtual machines and do operations supported by the extensions.

## Supported regions

Azure Arc enabled VMware vSphere is currently supported in these regions:

- East US

- West Europe

## Next steps

- [Connect VMware vCenter to Azure Arc using CLI](quick-start-connect-vcenter-to-arc-using-script.md)
