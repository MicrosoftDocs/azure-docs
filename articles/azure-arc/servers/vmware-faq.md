---
title: Azure Arc-enabled servers VMware Frequently Asked Questions
description: Learn how to use Azure Arc-enabled servers on virtual machines running in VMware vSphere environments.
ms.date: 11/20/2023
ms.topic: faq
---

# Azure Arc-enabled servers VMware Frequently Asked Questions

This article addresses frequently asked questions about Arc-enabled servers on virtual machines running in VMware vSphere environments.

## What is Azure Arc?

Azure Arc is the overarching brand for a suite of Azure hybrid products that extend specific Azure public cloud services and/or management capabilities beyond Azure to on-premises environments and 3rd-party clouds. Azure Arc-enabled server, for example, allows you to use the same Azure management tools you would with a VM running in Azure with a VM running on-premises in a VMware vSphere cluster.

## What's the difference between Azure Arc-enabled servers and Azure Arc-enabled VMware vSphere?

> [!NOTE]
> [Arc-enabled VMware vSphere](../vmware-vsphere/overview.md) supports vSphere environments anywhere, either on-premises as well as [Azure VMware Solution (AVS)](./../../azure-vmware/deploy-arc-for-azure-vmware-solution.md), VMware Cloud on AWS, and Google Cloud VMware Engine.

The easiest way to think of this is as follows:

- Azure Arc-enabled servers interact on the guest operating system level, with no awareness of the underlying infrastructure fabric and the virtualization platform that it’s running on. Since Arc-enabled servers also support bare-metal machines, there may, in fact, not even be a host hypervisor in some cases.

- Azure Arc-enabled VMware vSphere is a superset of Arc-enabled servers that extends management capabilities beyond the guest operating system to the VM itself. This provides lifecycle management and CRUD (Create, Read, Update, and Delete) operations on a VMware vSphere VM. These lifecycle management capabilities are exposed in the Azure portal and look and feel just like a regular Azure VM. See [What is Azure Arc-enabled VMware vSphere](../vmware-vsphere/overview.md) to learn more.

## Can I use Azure Arc-enabled server on VMs running in VMware environments?

Yes. Azure Arc-enabled servers work with VMs running in an on-premises VMware vSphere environment as well as Azure VMware Solution (AVS) and support the full breadth of guest management capabilities across security, monitoring, and governance.

## Which operating systems does Azure Arc-enabled servers work with?

Azure Arc-enabled servers and/or Azure Arc-enabled VMware vSphere work with [all supported versions](./prerequisites.md) of Windows Server and major distributions of Linux. As mentioned, even though Arc-enabled servers work with VMware vSphere virtual machines, the [Connected Machine agent](agent-overview.md) has no notion of familiarity with the underlying infrastructure fabric and virtualization layer.

## Should I use Arc-enabled servers or Arc-enabled VMware vSphere for my VMware VMs?

Each option has its own unique benefits and can be combined as needed. Arc-enabled servers allows you to manage the guest OS of your VMs with the Azure Connected Machine agent. Arc-enabled VMware vSphere enables you to onboard your VMware environment at-scale to Azure Arc with automatic discovery, in addition to performing full VM lifecycle and virtual hardware operations. You have the flexibility to start with either option and incorporate the other one later without any disruption. With both options, you'll enjoy the same consistent experience.
