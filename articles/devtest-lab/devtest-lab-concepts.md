<properties
	pageTitle="DevTest Labs concepts | Microsoft Azure"
	description="Learn the basic concepts of DevTest Labs, and how it can make it easy to create, manage, and monitor Azure virtual machines"
	services="devtest-lab,virtual-machines"
	documentationCenter="na"
	authors="tomarcher"
	manager="douge"
	editor=""/>

<tags
	ms.service="devtest-lab"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="08/09/2016"
	ms.author="tarcher"/>

#DevTest Labs concepts

##Overview

The following list contains key DevTest Labs concepts and definitions:

##Artifacts
Artifacts are used to deploy and configure your application after a VM is provisioned. Artifacts can be:

- Tools that you want to install on the VM - such as agents, Fiddler, and Visual Studio.
- Actions that you want to run on the VM - such as cloning a repo.
- Applications that you want to test.

Artifacts are Azure Resource Manager (ARM) based JSON files that contain instructions to perform deployment and apply configuration. You can read more about ARM in the [Azure Resource Manager overview](../resource-group-overview.md).

##Artifact repositories
Artifact repositories are git repositories where artifacts are checked in. Same artifact repositories can be added to multiple labs in your organization enabling reuse and sharing.

## Base images
Base images are VM images with all the tools and settings preinstalled and configured to quickly create a VM. You can provision a VM by picking an existing base and adding an artifact to install your test agent. You can then save the provisioned VM as a base so that the base can be used without having to reinstall the test agent for each provisioning of the VM.

##Formulas 
Formulas, in addition to base images, provide a mechanism for fast VM provisioning. A formula in DevTest Labs is a list of default property values used to create a lab VM. 
With formulas, VMs with the same set of properties - such as base image, VM size, virtual network, and artifacts - can be created without needing to specify those 
properties each time. When creating a VM from a formula, the default values can be used as-is or modified.

##Caps
Caps is a mechanism to minimize waste in your lab. For example, you can set a cap to restrict the number of VMs that can be created per user, or in a lab.

##Policies
Policies help in controlling cost in your lab. For example, you can create a policy to automatically shut down VMs based on a defined schedule.

##Next steps

[Create a lab in DevTest Labs](devtest-lab-create-lab.md)