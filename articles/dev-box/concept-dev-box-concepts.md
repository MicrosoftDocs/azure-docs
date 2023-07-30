---
title: Microsoft Dev Box key concepts
description: Learn key concepts and terminology for Microsoft Dev Box.
services: dev-box
ms.service: dev-box
author: RoseHJM
ms.author: rosemalcolm
ms.topic: conceptual
ms.date: 04/25/2023
ms.custom: template-concept
#Customer intent: As a platform engineer, I want to understand Dev Box concepts and terminology so that I can set up a Dev Box environment.
---

# Key concepts for Microsoft Dev Box 

This article describes the key concepts and components of Microsoft Dev Box.

## Dev box

A dev box is a preconfigured, ready-to-code workstation that you create through the self-service developer portal. A new dev box has all the tools, binaries, and configuration required for a dev box user to be productive immediately. You can create and manage multiple dev boxes to work on multiple workstreams.

As a dev box user, you have control over your own dev boxes. You can create more as you need them and delete them when you finish using them.

## Dev center

A dev center is a collection of projects that require similar settings. Dev centers enable platform engineers to:

- Manage the images and SKUs available to the projects by using dev box definitions.
- Configure the networks that the development teams consume by using network connections. 

## Project

A project is the point of access for development team members. When you associate a project with a dev center, all the settings at the dev center level are applied to the project automatically.

Each project can be associated with only one dev center. Dev managers can configure the dev boxes available for a project by specifying the dev box definitions that are appropriate for their workloads.

## Dev box definition

A dev box definition specifies a source image and size, including compute size and storage size. You can use a source image from Azure Marketplace or a custom image from your own [Azure Compute Gallery](./how-to-configure-azure-compute-gallery.md) instance. You can use dev box definitions across multiple projects in a dev center.

## Network connection

IT administrators and platform engineers configure the network that's used for dev box creation in accordance with their organizational policies. Network connections store configuration information, like Active Directory join type and virtual network, that dev boxes use to connect to network resources.

When you're creating a network connection, you must choose the Active Directory join type:

- If your dev boxes need to connect exclusively to cloud-based resources, use native Azure Active Directory (Azure AD).
- If your dev boxes need to connect to on-premises resources and cloud-based resources, use hybrid Azure AD.

To learn more about native Azure AD join and hybrid Azure AD join, see [Plan your Azure Active Directory device deployment](../active-directory/devices/plan-device-deployment.md).

The virtual network specified in a network connection also determines the region for a dev box. You can create multiple network connections based on the regions where you support developers. You can then use those connections when you're creating dev box pools to ensure that dev box users create dev boxes in a region close to them. Using a region close to the dev box user provides the best experience.

## Dev box pool

A dev box pool is a collection of dev boxes that you manage together and to which you apply similar settings. You can create multiple dev box pools to support the needs of hybrid teams that work in different regions or on different workloads.