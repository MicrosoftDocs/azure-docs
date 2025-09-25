---
title: Microsoft Dev Box Architecture
description: Learn about the architecture, key concepts, and terminology for Microsoft Dev Box. Understand dev centers, dev boxes, dev box definitions, and dev box pools.
services: dev-box
ms.service: dev-box
author: RoseHJM
ms.author: rosemalcolm
ms.topic: concept-article
ms.date: 08/07/2025
ms.custom: template-concept

#Customer intent: As a platform engineer, I want to understand the architecture and key components of Microsoft Dev Box to effectively configure and manage cloud-based development environments for my team.
---

# Microsoft Dev Box architecture overview

In this article, you learn about the architecture and key concepts for Microsoft Dev Box. Microsoft Dev Box gives developers self-service access to preconfigured, ready-to-code cloud-based workstations. You can configure the service to meet your development team and project structure, and manage security and network settings to access resources securely.

## How does Microsoft Dev Box work?

Before developers can create dev boxes in the developer portal, you set up a dev center and project in Microsoft Dev Box. The following diagram gives an overview of the relationship between the different components in Microsoft Dev Box.

:::image type="content" source="media/concept-dev-box-architecture/dev-box-concepts-overview.png" alt-text="Diagram that gives an overview of the relationship between the different components in Microsoft Dev Box." lightbox="media/concept-dev-box-architecture/dev-box-concepts-overview.png":::

A *dev center* is the top-level resource for Microsoft Dev Box. A dev center contains the collection of projects and the shared resources for these projects, such as dev box definitions and network connections. There's no limit on the number of dev centers that you can create, but most organizations need only one.

A *project* is the point of access for development teams. You assign the Dev Box User role to a developer for a project, which grants the developer permissions to create dev boxes. You can create one or more projects in a dev center.

A *dev box definition* specifies the configuration of the dev boxes, such as the virtual machine image and compute resources for the dev box. You can either choose a virtual machine image from Azure Marketplace, or use an Azure compute gallery to use custom virtual machine images.

A project contains the collection of dev box pools. A *dev box pool* specifies the configuration for dev boxes, such as the dev box definition, the network connection, and other settings. All dev boxes that are created from a dev box pool share the same configuration.

The network connection that's associated with a dev box pool determines where the dev box is hosted. You can use a Microsoft-hosted network connection, or bring your own Azure network connection. You might use an Azure network connection if you need control over the virtual network, if you require access to corporate resources, or to authenticate to a dev box with an Active Directory account.

Developers can create a dev box from a dev box pool by using the developer portal. They might choose from a specific pool based on the virtual machine image, compute resources, or the location where the dev box is hosted.

Once the dev box is running, dev box users can [remotely connect](#user-connectivity) to it from the developer portal. Dev box users have full control over the dev boxes they create, and can manage them from the developer portal.

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

Microsoft Intune is used to manage your dev boxes. Every Dev Box user needs one Microsoft Intune license and can create multiple dev boxes. After a dev box is provisioned, you can manage it like any other Windows device in Microsoft Intune. For example, you can create [device configuration profiles](/mem/intune/configuration/device-profiles) to turn different settings on and off in Windows, or push apps and updates to your users' dev boxes.

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
