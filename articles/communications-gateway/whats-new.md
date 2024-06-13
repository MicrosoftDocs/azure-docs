---
title: What's new in Azure Communications Gateway?
description: Discover what's new in Azure Communications Gateway. Learn how to get started with the latest features.
author: rcdun
ms.author: rdunstan
ms.service: communications-gateway
ms.topic: whats-new
ms.date: 04/03/2024
---

# What's new in Azure Communications Gateway?

This article covers new features and improvements for Azure Communications Gateway.

## April 2024

### VNet injection for Azure Communications Gateway (preview)

From April 2024, you can set up private networking between your on-premises environment and Azure Communications Gateway. VNet injection for Azure Communications Gateway (preview) allows the network interfaces on your Azure Communications Gateway which connect to your network to be deployed into virtual networks in your subscription. This allows you to control the traffic flowing between your network and your Azure Communications Gateway instance using private subnets, and lets you use private connectivity to your premises such as ExpressRoute Private Peering and Virtual Private Networks (VPNs).

For more information about private networking, see [Connecting to Azure Communications Gateway](./connectivity.md). For deployment instructions, see [Prepare to connect Azure Communications Gateway to your own virtual network](./prepare-for-vnet-injection.md).

### Support for Azure Operator Call Protection Preview

From April 2024, you can use Azure Communications Gateway to provide Azure Operator Call Protection Preview. Azure Operator Call Protection uses AI to perform real-time analysis of consumer phone calls to detect potential phone scams and alert subscribers when they are at risk of being scammed. It's built on Azure Communications Gateway.

For more information about Azure Operator Call Protection, see [What is Azure Operator Call Protection Preview?](../operator-call-protection/overview.md?toc=/azure/communications-gateway/toc.json&bc=/azure/communications-gateway/breadcrumb/toc.json). For deployment instructions, see [Set up Azure Operator Call Protection Preview](../operator-call-protection/set-up-operator-call-protection.md?toc=/azure/communications-gateway/toc.json&bc=/azure/communications-gateway/breadcrumb/toc.json).

## March 2024

### Lab deployments

From March 2024, you can set up a dedicated lab deployment of Azure Communications Gateway. Lab deployments allow you to make changes and test them without affecting your production deployment. For example, you can:

- Test configuration changes to Azure Communications Gateway.
- Test new Azure Communications Gateway features and services (for example, configuring Microsoft Teams Direct Routing or Zoom Phone Cloud Peering).
- Test changes in your preproduction network, before rolling them out to your production networks.

You plan for, order, and deploy lab deployments in the same way as production deployments. You must have deployed a standard deployment or be about to deploy one. You can't use a lab deployment as a standalone Azure Communications Gateway deployment.

For more information, see [Lab Azure Communications Gateway overview](lab.md).

## February 2024

### Flow-through provisioning for Operator Connect and Teams Phone Mobile

From February 2024, Azure Communications Gateway supports flow-through provisioning for Operator Connect and Teams Phone Mobile customers and numbers with the Azure Communications Gateway's [Provisioning API (preview)](provisioning-platform.md). Flow-through provisioning on Azure Communications Gateway allows you to provision the Operator Connect environments and Azure Communications Gateway (for custom header configuration) using the same method. It meets the Operator Connect and Teams Phone Mobile requirement to use APIs to manage your customers and numbers after you launch your service.

Provisioning Azure Communications Gateway and the Operator Connect and Teams Phone Mobile environment includes:

- Managing the status of your enterprise customers in the Operator Connect and Teams Phone Mobile environment.
- Provisioning numbers in the Operator Connect and Teams Phone Mobile environment.
- Configuring Azure Communications Gateway to add custom headers.

Before you launch your Operator Connect or Teams Phone Mobile service, you can also use the [Number Management Portal (preview)](manage-enterprise-operator-connect.md).

### Connectivity metrics

From February 2024, you can monitor the health of the connection between your network and Azure Communications Gateway with new metrics for responses to SIP INVITE and OPTIONS exchanges. You can view statistics for all INVITE and OPTIONS requests, or narrow your view down to individual regions, request types, or response codes. For more information on the available metrics, see [Connectivity metrics](monitoring-azure-communications-gateway-data-reference.md#connectivity-metrics). For an overview of working with metrics, see [Analyzing, filtering and splitting metrics in Azure Monitor](monitor-azure-communications-gateway.md#analyzing-filtering-and-splitting-metrics-in-azure-monitor).

## November 2023

### Support for Zoom Phone Cloud Peering

From November 2023, Azure Communications Gateway supports providing PSTN connectivity to Zoom with Zoom Phone Cloud Peering. You can provide Zoom Phone calling services to many customers, each with many users, with minimal disruption to your existing network.

For more information about Zoom Phone Cloud Peering with Azure Communications Gateway, see [Overview of interoperability of Azure Communications Gateway with Zoom Phone Cloud Peering](interoperability-zoom.md). For an overview of deploying and configuring Azure Communications Gateway for Zoom, see [Get started with Azure Communications Gateway](get-started.md).

### Custom header on messages to operator networks

Azure Communications Gateway can add a custom header to messages sent to your core network. You can use this feature to add custom information that your network might need, for example to assist with billing.

You must choose the name of the custom header when you [deploy Azure Communications Gateway](deploy.md). This header name is used for all numbers with custom header configuration.

You must then use the [Provisioning API](provisioning-platform.md) to configure each number with the contents of the custom header.

In November 2023, custom header configuration is available for Microsoft Teams Direct Routing, Operator Connect, and Zoom Phone Cloud Peering.

## October 2023

### Support for multitenant Microsoft Teams Direct Routing

From October 2023, Azure Communications Gateway supports providing PSTN connectivity to Microsoft Teams through Direct Routing. You can provide Microsoft Teams calling services to many customers, each with many users, with minimal disruption to your existing network. Azure Communications Gateway automatically updates the SIP signaling to indicate the correct tenant, without needing changes to your core network to map between numbers and customer tenants.

Azure Communications Gateway can screen Direct Routing calls originating from Microsoft Teams to ensure that the number is enabled for Direct Routing. This screening reduces the risk of caller ID spoofing, because it prevents customer administrators assigning numbers that you haven't allocated to the customer.

For more information about Direct Routing with Azure Communications Gateway, see [Overview of interoperability of Azure Communications Gateway with Microsoft Teams Direct Routing](interoperability-teams-direct-routing.md). For an overview of deploying and configuring Azure Communications Gateway for Direct Routing, see [Get started with Azure Communications Gateway](get-started.md).

## September 2023

### ExpressRoute Microsoft Peering between Azure and operator networks

From September 2023, you can use ExpressRoute Microsoft Peering to connect operator networks to Azure Communications Gateway as an alternative to Microsoft Azure Peering Services Voice (also known as MAPS Voice). We recommend that most deployments use MAPS for voice unless there's a specific reason that ExpressRoute Microsoft Peering is preferable. For example, you might have existing ExpressRoute connectivity to your network that you can reuse. For details and examples of when ExpressRoute might be preferable to MAPS, see [Using ExpressRoute for Microsoft PSTN services](../../articles/expressroute/using-expressroute-for-microsoft-pstn.md).

## May 2023

### Integrated Mobile Control Point for Teams Phone Mobile integration

From May 2023, you can deploy Mobile Control Point (MCP) as part of Azure Communications Gateway. MCP is an IMS Application Server that simplifies interworking with Microsoft Phone System for mobile calls. It ensures calls are only routed to the Microsoft Phone System when a user is eligible for Teams Phone Mobile services. This process minimizes the changes you need in your mobile network to route calls into Microsoft Teams. For more information, see [Mobile Control Point in Azure Communications Gateway for Teams Phone Mobile](mobile-control-point.md).

You can add MCP when you deploy Azure Communications Gateway or by requesting changes to an existing deployment. For more information, see [Deploy Azure Communications Gateway](deploy.md) or [Get support or request changes to your Azure Communications Gateway.](request-changes.md)

### Authentication with managed identities for Operator Connect APIs

Azure Communications Gateway contains services that need to access the Operator Connect APIs on your behalf. Azure Communications Gateway therefore needs to authenticate with your Operator Connect or Teams Phone Mobile environment.

From May 2023, Azure Communications Gateway automatically provides a managed identity for this authentication. You must set up specific permissions for this managed identity and then add the Application ID of this managed identity to your Operator Connect or Teams Phone Mobile environment. For more information, see [Deploy Azure Communications Gateway](deploy.md).

This new authentication model replaces an earlier model that required you to create an App registration and manage secrets for it. With the new model, you no longer need to create, manage, or rotate secrets.

## Next steps

- [Learn more about Azure Communications Gateway](overview.md).
- [Get started with Azure Communications Gateway](get-started.md).