---
title: What's new in Azure Communications Gateway?
description: Discover what's new in Azure Communications Gateway
author: rcdun
ms.author: rdunstan
ms.service: communications-gateway
ms.topic: whats-new
ms.date: 09/06/2023
---

# What's new in Azure Communications Gateway?

This article covers new features and improvements for Azure Communications Gateway.

## September 2023

### ExpressRoute Microsoft Peering between Azure and operator networks

From September 2023, you can use ExpressRoute Microsoft Peering to connect operator networks to Azure Communications Gateway as an alternative to Peering Services Voice (also known as MAPS for voice). We recommend that most deployments use MAPS for voice unless there's a specific reason that ExpressRoute Microsoft Peering is preferable. For example, you might have existing ExpressRoute connectivity to your network that you can reuse. For details and examples of when ExpressRoute might be preferable to MAPS, see [Using ExpressRoute for Microsoft PSTN Services](../../articles/expressroute/using-expressroute-for-microsoft-pstn.md).

## May 2023

### Integrated Mobile Control Point for Teams Phone Mobile integration

From May 2023, you can deploy Mobile Control Point (MCP) as part of Azure Communications Gateway. MCP is an IMS Application Server that simplifies interworking with Microsoft Phone System for mobile calls. It ensures calls are only routed to the Microsoft Phone System when a user is eligible for Teams Phone Mobile services. This process minimizes the changes you need in your mobile network to route calls into Microsoft Teams. For more information, see [Mobile Control Point in Azure Communications Gateway for Teams Phone Mobile](mobile-control-point.md).

You can add MCP when you deploy Azure Communications Gateway or by requesting changes to an existing deployment. For more information, see [Deploy Azure Communications Gateway](deploy.md) or [Get support or request changes to your Azure Communications Gateway](request-changes.md)

### Authentication with managed identities for Operator Connect APIs

Azure Communications Gateway contains services that need to access the Operator Connect APIs on your behalf. Azure Communications Gateway therefore needs to authenticate with your Operator Connect or Teams Phone Mobile environment.

From May 2023, Azure Communications Gateway automatically provides a managed identity for this authentication. You must set up specific permissions for this managed identity and then add the Application ID of this managed identity to your Operator Connect or Teams Phone Mobile environment. For more information, see [Deploy Azure Communications Gateway](deploy.md).

This new authentication model replaces an earlier model that required you to create an App registration and manage secrets for it. With the new model, you no longer need to create, manage or rotate secrets.

## Next steps

- [Learn more about Azure Communications Gateway](overview.md).
- [Get started with Azure Communications Gateway](get-started.md).