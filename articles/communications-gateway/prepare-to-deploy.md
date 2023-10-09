---
title: Prepare to deploy Azure Communications Gateway 
description: Learn how to complete the prerequisite tasks required to deploy Azure Communications Gateway in Azure.
author: rcdun
ms.author: rdunstan
ms.service: communications-gateway
ms.topic: how-to
ms.date: 05/05/2023
---

# Prepare to deploy Azure Communications Gateway

This article guides you through each of the tasks you need to complete before you can start to deploy Azure Communications Gateway. In order to be successfully deployed, the Azure Communications Gateway has dependencies on the state of your Operator Connect or Teams Phone Mobile environments.

The following sections describe the information you need to collect and the decisions you need to make prior to deploying Azure Communications Gateway.

## Prerequisites

[!INCLUDE [communications-gateway-tsp-with-oc-restriction](includes/communications-gateway-tsp-with-oc-restriction.md)]

[!INCLUDE [communications-gateway-deployment-prerequisites](includes/communications-gateway-deployment-prerequisites.md)]

## 1. Arrange onboarding

For Operator Connect and Teams Phone Mobile, you need an onboarding partner for integrating with Microsoft Phone System. If you're not eligible for onboarding to Microsoft Teams through Azure Communications Gateway's [Included Benefits](onboarding.md) or you haven't arranged alternative onboarding with Microsoft through a separate arrangement, you need to arrange an onboarding partner yourself.

## 2. Ensure you have a suitable support plan

We strongly recommend that you have a support plan that includes technical support, such as [Microsoft Unified Support](https://www.microsoft.com/en-us/unifiedsupport/overview) or [Premier Support](https://www.microsoft.com/en-us/unifiedsupport/premier).

## 3. Choose the Azure tenant to use

The Operator Connect and Teams Phone Mobile programs require your Azure Active Directory tenant to contain a Microsoft application called Project Synergy. Operator Connect and Teams Phone Mobile inherit permissions and identities from your Azure Active Directory tenant through the Project Synergy application. The Project Synergy application also allows configuration of Operator Connect or Teams Phone Mobile and assigning users and groups to specific roles.

We recommend that you use an existing Azure Active Directory tenant for Azure Communications Gateway, because using an existing tenant uses your existing identities for fully integrated authentication. However, if you need to manage identities for Operator Connect separately from the rest of your organization, create a new dedicated tenant first.

## 4. Get access to Azure Communications Gateway for your Azure subscription

Access to Azure Communications Gateway is restricted. When you've completed the previous steps in this article, contact your onboarding team and ask them to enable your subscription. If you don't already have an onboarding team, contact azcog-enablement@microsoft.com with your Azure subscription ID and contact details.

Wait for confirmation that Azure Communications Gateway is enabled before moving on to the next step.

## 5. Create a network design

You must use Microsoft Azure Peering Service (MAPS) or ExpressRoute Microsoft Peering to connect your on-premises network to Azure Communications Gateway. 

[!INCLUDE [communications-gateway-maps-or-expressroute](includes/communications-gateway-maps-or-expressroute.md)]

If you want to use ExpressRoute Microsoft Peering, consult with your onboarding team and ensure that it's available in your region.

Ensure your network is set up as shown in the following diagram and has been configured in accordance with the *Network Connectivity Specification* that you've been issued. You must have two Azure Regions with cross-connect functionality. For more information on the reliability design for Azure Communications Gateway, see [Reliability in Azure Communications Gateway](reliability-communications-gateway.md).

:::image type="content" source="media/azure-communications-gateway-redundancy.png" alt-text="Network diagram of an Azure Communications Gateway that uses MAPS as its peering service between Azure and an operators network.":::

For Teams Phone Mobile, you must decide how your network should determine whether a call involves a Teams Phone Mobile subscriber and therefore route the call to Microsoft Phone System. You can:

- Use Azure Communications Gateway's integrated Mobile Control Point (MCP).
- Connect to an on-premises version of Mobile Control Point (MCP) from Metaswitch.
- Use other routing capabilities in your core network.

For more information on these options, see [Call control integration for Teams Phone Mobile](interoperability-operator-connect.md#call-control-integration-for-teams-phone-mobile) and [Mobile Control Point in Azure Communications Gateway](mobile-control-point.md).

If you plan to route emergency calls through Azure Communications Gateway, read [Emergency calling for Operator Connect and Teams Phone Mobile with Azure Communications Gateway](emergency-calling-operator-connect.md) to learn about your options.

## 6. Configure MAPS or ExpressRoute

Connect your network to Azure Communications Gateway:

- To configure MAPS, follow the instructions in [Azure Internet peering for Communications Services walkthrough](../internet-peering/walkthrough-communications-services-partner.md).
- To configure ExpressRoute Microsoft Peering, follow the instructions in [Tutorial: Configure peering for ExpressRoute circuit](../../articles/expressroute/expressroute-howto-routing-portal-resource-manager.md).

## Next step

> [!div class="nextstepaction"]
> [Deploy an Azure Communications Gateway resource and connect it to your networks](deploy.md)
