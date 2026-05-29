---
title: Microsoft Dev Box Architecture
description: Learn about the architecture, key concepts, and terminology for Microsoft Dev Box. Understand dev centers, dev boxes, dev box definitions, and dev box pools.
services: dev-box
ms.service: dev-box
author: RoseHJM
ms.author: rosemalcolm
ms.topic: concept-article
ms.date: 10/24/2025
ms.update-cycle: 180-days
ms.custom: template-concept

#Customer intent: As a platform engineer, I want to understand the architecture and key components of Microsoft Dev Box to effectively configure and manage cloud-based development environments for my team.
---

# Microsoft Dev Box architecture and key concepts

This article describes the architecture and key concepts for Microsoft Dev Box to help you set up the service successfully. Microsoft Dev Box gives developers self-service access to preconfigured, ready-to-code cloud-based workstations. You can configure the service to meet your development team and project structure, manage security, and network settings to access resources securely.

Watch this video to learn more about Microsoft Dev Box:
>[!VIDEO https://learn-video.azurefd.net/vod/player?id=c0df17f8-bafe-494d-9a64-6743de3e5555]

## Key components and relationships

Before developers can create dev boxes in the developer portal, you set up a dev center and project in Microsoft Dev Box. 

The core workflow involves:
1. Setting up a **dev center** with shared resources
2. Creating **projects** for teams or business functions
3. Configuring **dev box pools** with specific settings
4. Developers creating **dev boxes** from pools through the portal

Once a dev box is running, developers can [remotely connect](#user-connectivity) to it from the developer portal. Dev box users have full control over the dev boxes they create, and can manage them from the developer portal.

## Dev center

A dev center is the top-level resource and collection of [projects](#project) that require similar settings. There's no limit on the number of dev centers that you can create, but most organizations need only one.

Dev centers enable platform engineers to configure the networks that the development teams consume by using network connections.

[Azure Deployment Environments](../deployment-environments/concept-environments-key-concepts.md#dev-centers) also uses dev centers to organize resources. An organization can use the same dev center for both services.

## Catalogs

Catalogs in Dev Box are collections of tasks and scripts that automate the configuration of dev boxes during provisioning. By attaching a catalog to a dev center, you make its tasks available to all projects within that dev center. Alternatively, you can attach a catalog directly to a project to limit task availability to that specific project. You can customize the provided sample tasks or create your own catalogs to meet your team's requirements.

Catalogs also contain image definition files for team-specific customizations.

To learn how to create Dev Box customizations, see [Microsoft Dev Box customizations](concept-what-are-dev-box-customizations.md).

## Project

In Dev Box, a project represents a team or business function within the organization and is the point of access for development teams. Each project is a collection of [dev box pools](#dev-box-pool), and each pool represents a region or workload. When you associate a project with a dev center, all the settings at the dev center level are applied to the project automatically.

Each project can be associated with only one dev center. Dev managers configure the dev boxes available for a project by creating dev box pools that specify image definitions, custom images, marketplace images, or legacy dev box definitions.

To enable developers to create their own dev boxes, you must [provide access to projects for developers](how-to-dev-box-user.md) by assigning the Dev Box User role.

You can configure projects for [Deployment Environments](../deployment-environments/concept-environments-key-concepts.md#projects) and projects for Dev Box resources in the same dev center.

### Project policies

A project policy in Microsoft Dev Box defines which resources—such as images, networks, and SKUs—are available to a project, enforcing governance and compliance. It ensures that development teams can only use approved resources, helping organizations control and streamline resource usage.

## Dev box pool

A dev box pool is a collection of dev boxes that you manage together and to which you apply similar settings. You can create multiple dev box pools to support the needs of hybrid teams that work in different regions or on different workloads.

Dev box pools specify the configuration for dev boxes, including the image source (image definition, custom image, marketplace image, or legacy dev box definition), compute size, storage, network connection, and other settings. All dev boxes that are created from a dev box pool share the same configuration.

## Image definitions

Image definitions are YAML-based customization files that define a base image and apply team-specific customizations. They can be built into reusable images to optimize dev box creation time. Image definitions offer greater flexibility by allowing you to independently select compute size and storage when creating dev box pools.

To learn more about creating and using image definitions, see [Configure team customizations](how-to-configure-team-customizations.md).

## Dev box definition

> [!NOTE]
> Dev box definitions are a legacy option. We recommend using image definitions, custom images, or marketplace images for greater flexibility in selecting compute size and storage.

A dev box definition specifies a source image and size, including compute size and storage size bundled together. Select a source image from Azure Marketplace or a custom image from your own [Azure Compute Gallery](./how-to-configure-azure-compute-gallery.md) instance. Dev Box supports client editions of Windows 10 and Windows 11. You can use dev box definitions across multiple projects in a dev center.

For new deployments, consider using marketplace images or custom images directly in your dev box pools, which allow independent selection of compute and storage configurations.

## Network connection

IT administrators and platform engineers configure the network they use for dev box creation in accordance with their organizational policies. Network connections store configuration information, like Active Directory join type and virtual network, that dev boxes use to connect to network resources.

The network connection that's associated with a dev box pool determines where the dev box is hosted. You can use a Microsoft-hosted network connection, or bring your own Azure network connection. You might use an Azure network connection if you need control over the virtual network, if you require access to corporate resources, or to authenticate to a dev box with an Active Directory account.

Dev Box supports two types of network connections:
 - **Microsoft-hosted network connection** - Microsoft manages the network infrastructure and related services for your dev boxes. 
 - **Azure network connection** - You manage the network infrastructure and related services for your dev boxes.
    - If your dev boxes need to connect exclusively to cloud-based resources, use native Microsoft Entra ID join.
    - If your dev boxes need to connect to on-premises resources and cloud-based resources, use hybrid Microsoft Entra ID join.

To learn more about native Microsoft Entra join and Microsoft Entra hybrid join, see [Plan your Microsoft Entra device deployment](../active-directory/devices/plan-device-deployment.md).

## Azure regions for Dev Box

Before setting up Dev Box, you need to choose the best regions for your organization. 
- Dev centers and projects typically exist in the same region as your main office or IT management center. 
- Dev box pools can be in different regions, depending on the network connection they use. Developers should create dev boxes from a pool close to them for the least latency.

The region of the virtual network specified in a network connection determines the region for a dev box. You can create multiple network connections based on the regions where you support developers. You can then use those connections when you're creating dev box pools to ensure that dev box users create dev boxes in a region close to them. Using a region close to the dev box user provides the best experience.

To help you decide on the regions to use, check:
- [Dev Box availability by region](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?products=dev-box) 
- [Azure geographies](https://azure.microsoft.com/explore/global-infrastructure/geographies/#choose-your-region). 

If the region you prefer isn't available for Dev Box, choose a region within 500 miles.

## Dev box

A dev box is a preconfigured workstation that you create through the self-service developer portal. A new dev box has all the tools, binaries, and configuration required for a dev box user to be productive immediately. You can create and manage multiple dev boxes to work on multiple workstreams.

As a dev box user, you have control over your own dev boxes. You can create more as you need them and delete them when you finish using them.

Developers can create a dev box from a dev box pool by using the developer portal. They might choose from a specific pool based on the virtual machine image, compute resources, or the location where the dev box is hosted.

## Microsoft Dev Box architecture

The *hosted on behalf of* architecture lets Microsoft services, after they're delegated appropriate and scoped permissions to a virtual network by a subscription owner, attach hosted Azure services to a customer subscription. This connectivity model lets a Microsoft service provide software as a service and user-licensed services as opposed to standard consumption-based services.

Microsoft Dev Box uses the *hosted on-behalf* architecture, which means that the dev boxes exist in a subscription owned by Microsoft. Therefore, Microsoft incurs the costs for running and managing this infrastructure. Dev boxes are deployed in a subscription managed by Microsoft and connected to the customer's virtual network.

Microsoft Dev Box manages the capacity and in-region availability in the Microsoft Dev Box subscriptions. Microsoft Dev Box determines the Azure region to host your dev boxes based on the network connection you select when creating a dev box pool.

To protect your data, Microsoft Dev Box encrypts the disk by default using a platform-managed key. You don't need to enable BitLocker and doing so can prevent you from accessing your dev box.

For more information about data storage and protection in Azure, see [Azure customer data protection](/azure/security/fundamentals/protection-customer-data).

For the network connection, you can also choose between a Microsoft-hosted network connection, and an Azure network connection that you create in your own subscription.

The following diagrams show the logical architecture of Microsoft Dev Box.

:::image type="content" source="media/concept-dev-box-architecture/dev-box-architecture-diagram.png" alt-text="Diagram that gives an overview of the Microsoft Dev Box architecture." lightbox="media/concept-dev-box-architecture/dev-box-architecture-diagram.png":::

### Network connectivity

Network connections control where dev boxes are created and hosted, and allow you to connect to other Azure or corporate resources. Depending on your level of control, you can use Microsoft-hosted network connections or bring your own Azure network connections.

Microsoft-hosted network connections provide network connectivity in a SaaS manner. Microsoft manages the network infrastructure and related services for your dev boxes. Microsoft-hosted networks are a cloud-only deployment with support for Microsoft Entra join. This option isn't compatible with the Microsoft Entra hybrid join model.

You can also use Azure network connections (bring your own network) to connect to Azure virtual networks and optionally connect to corporate resources. With Azure network connections, you manage and control the entire network setup and configuration. You can use either Microsoft Entra join or Microsoft Entra hybrid join options with Azure network connections, enabling you to connect to on-premises Azure Active Directory Domain Services.

If you use your own Azure virtual network, Microsoft Dev Box lets you use Virtual Network security and routing features, including:

- [Azure network security groups](/azure/virtual-network/network-security-groups-overview)
- [Azure virtual network traffic routing](/azure/virtual-network/virtual-networks-udr-overview)
- [Azure Firewall](/azure/firewall/overview)
- [Network virtual appliances (NVAs)](https://azure.microsoft.com/blog/best-practices-to-consider-before-deploying-a-network-virtual-appliance/)

In Microsoft Dev Box, you associate a network connection with a dev box pool in your project. All dev boxes that are then created in this dev box pool are hosted in the Azure region of the network connection. If you use Azure network connections, you first add the network connections to a dev center, and then associate the connection with a dev box pool.

You can then configure the dev box pool and network connection to optimize the latency for developers in that geographical region. To learn more about latency across Azure regions, see [Round-trip latency data by region](../networking/azure-network-latency.md#round-trip-latency-data-by-region).

### Microsoft Intune integration

Microsoft Intune is used to manage your dev boxes. Every Dev Box user needs one Microsoft Intune license and can create multiple dev boxes. To assign licenses to users, see [Assign Microsoft 365 licenses to users](/microsoft-365/admin/manage/assign-licenses-to-users). After a dev box is provisioned, you can manage it like any other Windows device in Microsoft Intune. For example, you can create [device configuration profiles](/mem/intune/configuration/device-profiles) to turn different settings on and off in Windows, or push apps and updates to your users' dev boxes.

Microsoft Intune and associated Windows components have various [network endpoints](/mem/intune/fundamentals/intune-endpoints) that must be allowed through the virtual network. Apple and Android endpoints can be safely ignored if you don't use Microsoft Intune to manage those device types.

### Identity services

Microsoft Dev Box uses Microsoft Entra ID and, optionally, on-premises Active Directory Domain Services (AD DS). Microsoft Entra ID provides:

- User authentication for the Microsoft Dev Box developer portal.
- Device identity services for Microsoft Intune through Microsoft Entra hybrid join or Microsoft Entra join.

When you configure dev boxes to use [Microsoft Entra hybrid join](/azure/active-directory/devices/concept-azure-ad-join-hybrid), AD DS provides:

- On-premises domain join for the dev boxes.
- User authentication for the Remote Desktop Protocol (RDP) connections.

When you configure dev boxes to use [Microsoft Entra join](/azure/active-directory/devices/concept-azure-ad-join), Microsoft Entra ID provides:

- The domain join mechanism for the dev boxes.
- User authentication for RDP connections.

[!INCLUDE [supported accounts note](includes/note-supported-accounts.md)]

### User connectivity

When a dev box is running, developers can connect to it from the developer portal.

Dev box connectivity is provided by Azure Virtual Desktop. No inbound connections direct from the internet are made to the dev box. Instead, the following connections are made:

- From the dev box to the Azure Virtual Desktop endpoints
- From the Remote Desktop clients to the Azure Virtual Desktop endpoints.

For more information on these endpoints, see [Required FQDNs and endpoints for Azure Virtual Desktop](/azure/virtual-desktop/required-fqdn-endpoint). To ease configuration of network security controls, use service tags for Azure Virtual Desktop to identify those endpoints. For more information, see [Azure service tags overview](/azure/virtual-network/service-tags-overview).

There's no requirement to configure your dev boxes to make these connections. Microsoft Dev Box seamlessly integrates Azure Virtual Desktop connectivity components into gallery or custom images.

To learn more about the network architecture of Azure Virtual Desktop, see [Understanding Azure Virtual Desktop network connectivity](/en-us/azure/virtual-desktop/network-connectivity).

Microsoft Dev Box doesn't support non-Microsoft connection brokers.

[!INCLUDE [dev-box-get-started-links](includes/dev-box-get-started-links.md)]

## Related content

- [What is Microsoft Dev Box?](overview-what-is-microsoft-dev-box.md)
- [Quickstart: Configure Microsoft Dev Box](quickstart-configure-dev-box-service.md)
- [Microsoft Dev Box deployment guide](concept-dev-box-deployment-guide.md)
- [What is Azure Deployment Environments?](../deployment-environments/overview-what-is-azure-deployment-environments.md)
