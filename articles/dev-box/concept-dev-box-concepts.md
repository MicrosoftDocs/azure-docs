---
title: Microsoft Dev Box Preview key concepts
titleSuffix: Microsoft Dev Box Preview
description: Learn key concepts and terminology for Microsoft Dev Box Preview.
services: dev-box
ms.service: dev-box
author: RoseHJM
ms.author: rosemalcolm
ms.topic: conceptual
ms.date: 10/12/2022
ms.custom: template-concept 
---

<!-- 
  Customer intent:
	As a developer I want to understand Dev Box concepts and terminology so that I can set up Dev Box environment.
 -->
# Microsoft Dev Box Preview key concepts

This article describes the key concepts and components of Microsoft Dev Box. 

## Dev center

A dev center is a collection of projects that require similar settings. Dev centers enable dev infrastructure managers to manage the images and SKUs available to the projects using [dev box definitions](concept-dev-box-concepts.md#dev-box-definition) and configure the networks the development teams consume using [network connections](./concept-dev-box-concepts.md#network-connection).  
## Projects

A project is the point of access for the development team members. When you associate a project with a dev center, all the settings at the dev center level will be applied to the project automatically. Each project can be associated with only one dev center. Dev managers can configure the dev boxes available for the project by specifying the [dev box definitions](./concept-dev-box-concepts.md#dev-box-definition) appropriate for their workloads.
## Dev box definition

A dev box definition specifies a source image and size, including compute size and storage size. You can use a source image from the marketplace, or a custom image from your own [Azure Compute Gallery](./how-to-configure-azure-compute-gallery.md). You can use dev box definitions across multiple projects in a dev center. 

## Network connection 

IT administrators and dev infrastructure managers configure the network used for dev box creation in accordance with their organizational policies. Network connections store configuration information like Active Directory join type and virtual network that dev boxes use to connect to network resources. 

When creating a network connection, you must choose whether to use a native Azure Active Directory (Azure AD) join or a hybrid Azure AD join. If your dev boxes need to connect exclusively to cloud-based resources, use a native Azure AD join. Use a hybrid Azure AD join if your dev boxes need to connect to on-premises resources and cloud-based resources. To learn more about Azure AD and hybrid Azure AD joined devices, [Plan your Azure Active Directory device deployment](/azure/active-directory/devices/plan-device-deployment).
The virtual network specified in a network connection also determines the region for the dev box. You can create multiple network connections based on the regions where you support developers and use them when creating different dev box pools to ensure dev box users create a dev box in a region close to them. Using a region close to the dev box user provides the best experience. 

## Dev box pool 
A dev box pool is a collection of dev boxes that you manage together and to which you apply similar settings. You can create multiple dev box pools to support the needs of hybrid teams working in different regions or on different workloads.
## Dev box 
A dev box is a preconfigured ready-to-code workstation that you create through the self-service developer portal. The new dev box has all the tools, binaries, and configuration required for a dev box user to be productive immediately. You can create and manage multiple dev boxes to work on multiple work streams. As a dev box user, you have control over your own dev boxes - you can create more as you need them and delete them when you have finished using them.
