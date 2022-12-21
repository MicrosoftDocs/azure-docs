---
title: Azure Arc-enabled servers VMware Frequently Asked Questions
description: Learn how to use Azure Arc-enabled servers on virtual machines running in VMware environments.
ms.date: 12/21/2022
ms.topic: faq
---

# Azure Arc-enabled servers VMware Frequently Asked Questions

This article addresses frequently asked questions about Arc-enabled servers on virtual machines running in VMware environments.

## What is Azure Arc?

Azure Arc is the overarching brand for a suite of Azure hybrid products that extend specific Azure public cloud services and/or management capabilities beyond Azure to on-premises environments and 3rd-party clouds. Azure Arc-enabled server, for example, allows you to use the same Azure management tools you would with a VM running in Azure with a VM running on-premises in a VMware cluster. 

## What's the difference between Arc-enabled server and Arc-enabled<hypervisor>? (e.g., Arc-enabled VMware vSphere) (Currently in Public Preview)

The easiest way to think of this is as follows:

- Arc-enabled server is responsible for the guest operating system and knows nothing of the virtualization platform that it’s running on. Since Arc-enabled server also supports bare-metal machines, there may, in fact, not even be a host hypervisor. 

- Arc-enabled VMware vSphere is a superset of Arc-enabled server extending management capabilities beyond the guest operating system to the VM itself. This provides lifecycle management such as VM start, stop, resize, create, and delete. These lifecycle management capabilities are exposed in the Azure portal and look and feel just like a regular Azure VM. See [What is Azure Arc-enabled VMware vSphere](/azure/azure-arc/vmware-vsphere/overview.md) to learn more.  

> [!NOTE]
> Arc-enabled VMware vSphere also provides guest operating system management—in fact, it uses the same components as Arc-enabled server. However, during Public Preview, not all Azure services supported by Arc-enabled server are available for Arc-enabled VMware vSphere—currently Azure Monitor, Update Management and Microsoft Defender for Cloud are not supported. Arc-enabled VMware vSphere is not supported by Azure VMware Solution (AVS). 
> 

## Can I use Azure Arc-enabled server on VMs running in VMware environments?

Yes, Azure Arc-enabled server works with VMs running on VMware vSphere as well as Azure VMware Solution (AVS) and supports the full breadth of guest management capabilities across security, monitoring, and governance.  

## Which operating systems does Azure Arc work with?

To address this question properly, we need to specify which Arc service the question applies to. Let’s assume the question applies to Arc-enabled server and/or Arc-enabled <hypervisor>: it works with all supported versions of Windows Server and major distributions of Linux. 

## Should I use Arc-enabled server, Arc-enabled<hypervisor>, and can I use both?

Arc-enabled server and Arc-enabled<hypervisor> can be used in conjunction with one another.


