<properties
	pageTitle="Comparing DevTest Labs VM base image options | Microsoft Azure"
	description="Learn about the different VM base image types so you can decide which one best suits your environment."
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
	ms.date="04/15/2016"
	ms.author="tarcher"/>

# Comparing DevTest Labs VM base image options | Microsoft Azure

## Overview

## Custom Images vs. Formulas


Custom images support in the lab provides a static/immutable way to create VMs from a desired environment. 

Pros:
VM provisioning from a custom image is super fast, since nothing change (no software to install or system settings to update) after the VM is spun up from an image. 
All settings/configuration is locked down and baked in the images, so it forces all the VMs are identical if using the same images.

Cons:
Every time when changes happen in the environment, a new custom image needs to be generated and maintained, which requires extra effort. 





Formulas support in the lab provides a dynamic way to create VMs from the desired configuration/settings.

Pros:
Changes in the environment can be captured on the fly, thanks to artifacts. It means no extra cost to generate or maintain new custom image files. E.g. if you want a VM installed with the latest bits from your release pipeline or enlist the latest code from your repository, you can simply specify an artifact that deploy the latest bits or enlist the latest code in the formula together with a target base image. So that whenever this formula is used to create VMs, it's always the latest bits/code that are deployed/enlisted to the VM. 

The public DevTest Labs GitHub repo has already offered the artifacts for deploying the latest drop from VSTS and cloning a Git repository respectively. You can leverage and customize those to meet your own needs. Artifacts from this public repo is available to all the DevTest labs by default.

Formula can define default settings that custom images cannot provide, including VM sizes and the virtual network. 

All the settings saved in a formula are shown as default values, but changeable when users use them to create the VM. So it's more flexible to feed multiple needs. E.g. you can change the base image between different versions of Windows (or Linux) for compatibility testing, but keep all the other VM creation settings (artifacts, virtual networks etc.) the same.

Cons:
It takes additional time after the VM is created from a base image when using artifacts to install extra software or running some system configurations.
