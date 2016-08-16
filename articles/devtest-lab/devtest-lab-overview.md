<properties
	pageTitle="What is DevTest Labs? | Microsoft Azure"
	description="Learn how DevTest Labs can make it easy to create, manage, and monitor Azure virtual machines"
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
	ms.date="05/08/2016"
	ms.author="tarcher"/>

#What is DevTest Labs?

Developers and testers are looking to solve the delays in creating and managing their environments by going to the cloud.  Azure solves the problem of environment delays and allows self-service within a new cost efficient structure.  However, developers and testers still need to spend considerable time configuring their self-served environments. Also, decision makers are uncertain about how to leverage the cloud to maximize their cost savings without adding too much process overhead.

Azure DevTest Labs is a service that helps developers and testers quickly create environments in Azure while minimizing waste and controlling cost. You can test the latest version of your application by quickly provisioning Windows and Linux environments using reusable templates and artifacts. Easily integrate your deployment pipeline with DevTest Labs to provision on-demand environments. Scale up your load testing by provisioning multiple test agents, and create pre-provisioned environments for training and demos.

##Why DevTest Labs?

DevTest Labs provides the following benefits in creating, configuring, and managing developer and test environments in the cloud

###Worry-Free Self-Service

DevTest Labs makes it easier to control costs by allowing you to set policies on your lab - such as number of virtual machines (VM) per user and number of VMs per lab. DevTest Labs also enables you to create policies to automatically shut down and start VMs.

###Quickly get to "Ready to Test"

DevTest Labs enables you to create pre-provisioned environments with everything your team needs to start developing and testing applications. Simply claim the environments where the last good build of your application is installed and get working right away. Or, use containers for even faster and leaner environment creation.

###Create once, use everywhere

Capture and share environment templates and artifacts within your team or organization - all in source control - to create developer and test environments easily.

###Integrates with your existing Toolchain

Leverage pre-made plug-ins or our API to provision Dev/Test environments directly from your preferred continuous integration (CI) tool, integrated development environment (IDE), or automated release pipeline. You can also use our comprehensive command-line tool.

##DevTest Labs concepts

The following list contains key DevTest Labs concepts and definitions:

**Artifacts** are used to deploy and configure your application after a VM is provisioned. Artifacts can be:

- Tools that you want to install on the VM - such as agents, Fiddler, and Visual Studio.
- Actions that you want to run on the VM - such as cloning a repo.
- Applications that you want to test.

Artifacts are Azure Resource Manager (ARM) based JSON files that contain instructions to perform deployment and apply configuration. You can read more about ARM in the [Azure Resource Manager overview](../resource-group-overview.md).

**Artifact Repositories** are git repositories where artifacts are checked in. Same artifact repositories can be added to multiple labs in your organization enabling reuse and sharing.

**Base** is a VM image with all the tools and settings preinstalled and configured to quickly create a VM. You can provision a VM by picking an existing base and adding an artifact to install your test agent. You can then save the provisioned VM as a base so that the base can be used without having to reinstall the test agent for each provisioning of the VM.

**Formulas**, in addition to base images, provide a mechanism for fast VM provisioning. A formula in DevTest Labs is a list of default property values used to create a lab VM. 
With formulas, VMs with the same set of properties - such as base image, VM size, virtual network, and artifacts - can be created without needing to specify those 
properties each time. When creating a VM from a formula, the default values can be used as-is or modified.

**Caps** is a mechanism to minimize waste in your lab. For example, you can set a cap to restrict the number of VMs that can be created per user, or in a lab.

**Policies** help in controlling cost in your lab. For example, you can create a policy to automatically shut down VMs based on a defined schedule.

##Next steps

To get started with DevTest Labs, follow the [Create a lab in DevTest Labs](devtest-lab-create-lab.md) step-by-step tutorial.