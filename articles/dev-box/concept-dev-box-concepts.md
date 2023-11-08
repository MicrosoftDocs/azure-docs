---
title: Microsoft Dev Box key concepts
description: Learn key concepts and terminology for Microsoft Dev Box. Get an understanding about dev center, dev box, dev box definitions, and dev box pools.
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

This article describes the key concepts and components of Microsoft Dev Box to help you set up the service successfully.

Microsoft Dev Box gives developers self-service access to preconfigured, and ready-to-code cloud-based workstations. You can configure the service to meet your development team and project structure, and manage security and network settings to access resources securely. Different components play a part in the configuration of Microsoft Dev Box.

Microsoft Dev Box builds on the same foundations as [Azure Deployment Environments](/azure/deployment-environments/overview-what-is-azure-deployment-environments). Deployment Environments provides developers with preconfigured cloud-based environments for developing applications. Both services are complementary and share certain architectural components, such as a [dev center](#dev-center) or [project](#project).
    
## Dev center

A dev center is a collection of [Projects](#project) that require similar settings. Dev centers enable platform engineers to:

- Manage the images and SKUs available to the projects by using [dev box definitions](#dev-box-definition).
- Configure the networks that the development teams consume by using network connections. 

[Azure Deployment Environments](../deployment-environments/concept-environments-key-concepts.md#dev-centers) also uses dev centers to organize resources. An organization can use the same dev center for both services.

## Project

In Dev Box, a project represents a team or business function within the organization. Each project is a collection of [pools](#dev-box-pool), and each pool represents a region or workload. When you associate a project with a dev center, all the settings at the dev center level are applied to the project automatically.

Each project can be associated with only one dev center. Dev managers can configure the dev boxes available for a project by specifying the dev box definitions that are appropriate for their workloads.

To enable developers to create their own dev boxes, you must [provide access to projects for developers](how-to-dev-box-user.md) by assigning the Dev Box User role.

You can configure projects for [Deployment Environments](../deployment-environments/concept-environments-key-concepts.md#projects) and projects for Dev Box resources in the same dev center.

## Dev box definition

A dev box definition specifies a source image and size, including compute size and storage size. You can use a source image from Azure Marketplace or a custom image from your own [Azure Compute Gallery](./how-to-configure-azure-compute-gallery.md) instance. You can use dev box definitions across multiple projects in a dev center.

## Network connection

IT administrators and platform engineers configure the network that's used for dev box creation in accordance with their organizational policies. Network connections store configuration information, like Active Directory join type and virtual network, that dev boxes use to connect to network resources.

When you're creating a network connection, you must choose the Active Directory join type:

- If your dev boxes need to connect exclusively to cloud-based resources, use native Microsoft Entra ID.
- If your dev boxes need to connect to on-premises resources and cloud-based resources, use hybrid Microsoft Entra ID.

To learn more about native Microsoft Entra join and Microsoft Entra hybrid join, see [Plan your Microsoft Entra device deployment](../active-directory/devices/plan-device-deployment.md).

The virtual network specified in a network connection also determines the region for a dev box. You can create multiple network connections based on the regions where you support developers. You can then use those connections when you're creating dev box pools to ensure that dev box users create dev boxes in a region close to them. Using a region close to the dev box user provides the best experience.

## Dev box pool

A dev box pool is a collection of dev boxes that you manage together and to which you apply similar settings. You can create multiple dev box pools to support the needs of hybrid teams that work in different regions or on different workloads.

## Dev box

A dev box is a preconfigured workstation that you create through the self-service developer portal. A new dev box has all the tools, binaries, and configuration required for a dev box user to be productive immediately. You can create and manage multiple dev boxes to work on multiple workstreams.

As a dev box user, you have control over your own dev boxes. You can create more as you need them and delete them when you finish using them.

## Related content

- [What is Microsoft Dev Box?](overview-what-is-microsoft-dev-box.md)
- [Quickstart: Configure Microsoft Dev Box](quickstart-configure-dev-box-service.md)
- [What is Azure Deployment Environments?](../deployment-environments/overview-what-is-azure-deployment-environments.md)
