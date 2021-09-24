---
title: What is Azure Arc enabled VMWare vSphere?
description: This is an overview of the Azure Arc enabled VMware vSphere service 
author: snehithm
ms.author: snmuvva
ms.topic: overview
ms.date: 08/20/2021
ms.custom: template-overview
---

# What is Azure Arc enabled VMware vSphere?

Azure Arc enabled VMware vSphere extends Azure's governance and management capabilities to VMware vSphere infrastructure and delivers a consistent management experience across both the platforms. Arc enabled VMware vSphere enables you to:
 
 - Perform various  VMware virtual machine lifecycle operations such as creation, start/stop, resizing, deletion directly from Azure.

 - Empower developers and application teams to self-serve virtual machine operations on demand using Azure RBAC (role-based access control).

 - :sparkles: **New** :sparkles:  Browse your VMware vSphere resources (virtual machines, templates, networks and storage) in Azure, providing you a single pane view for your infrastructure across both environments. You can also discover and onboard existing VMware virtual machines to Azure.

- :sparkles: **New** :sparkles: Perform governance and monitoring operations across Azure and VMware virtual machines by enabling guest management (installing Connected Machine agent).

## How does it work?

To deliver this experience, you need to deploy the Arc Resource Bridge (a virtual appliance) in your vSphere environment and it connects your vCenter to Azure. Arc Resource Bridge enables you to represents the VMware resoures in Azure and perform various operations operations on them.

## Supported VMware vSphere versions

Azure Arc enabled VMware vSphere currently works with VMware vSphere version 6.5 and above.

## Supported scenarios

Following scenarios are supported in Azure Arc enabled VMware vSphere private preview -

1. Virtualized Infrastructure Administrators/Cloud Administrators can connect a vCenter instance to Azure and browse the VMware virtual machine inventory in Azure

2. :sparkles:**[New]**:sparkles: Administrators can use Azure portal to browse VMware vSphere inventory and register virtual machines resource pools, networks and templates into Azure. They can also bulk enabled guest management on registered virtual machines.

3. Administrators can provide app teams/developers fine-grained permissions on those VMware resources through Azure role-based access control.

4. App teams can use Azure portal, CLI or REST API to manage the lifecycle of on-prem VMs that they use for deploying their applications (CRUD, Start/Stop/Restart).

5. :sparkles:**[New]**:sparkles: App teams and administrators can install extensions (LogAnalytics agent, Custom Script extension, DependencyAgent) onto the virtual machines and perform operations supported by the extensions.

## Supported regions

Azure Arc enabled VMware vSphere is currently supported in these regions:

- East US
- West Europe

## Next steps

- [Connect VMware vCenter to Azure Arc using CLI](../docs/quick-start-connect-vcenter-to-arc-using-script.md)
