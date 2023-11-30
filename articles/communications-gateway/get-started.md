---
title: Getting started with Azure Communications Gateway
description: Learn how to plan for and deploy Azure Communications Gateway
author: rcdun
ms.author: rdunstan
ms.service: communications-gateway
ms.topic: how-to
ms.date: 11/06/2023

#CustomerIntent: As someone setting up Azure Communications Gateway, I want to understand the steps I need to carry out to have live traffic through my deployment.
---

# Get started with Azure Communications Gateway

Setting up Azure Communications Gateway requires planning your deployment, deploying your Azure Communications Gateway resource, and integrating with your chosen communications services.

This article summarizes the steps and documentation that you need.

> [!IMPORTANT]
> You must fully understand the onboarding process for your chosen communications service and any dependencies introduced by the onboarding process. For advice, ask your onboarding team.
>
> Some steps in the deployment and integration process can require days or weeks to complete. For example, you might need to arrange Microsoft Azure Peering Service for Voice (MAPS Voice) connectivity before you can deploy, wait for onboarding, or wait for a specific date to launch your service. We recommend that you read through any documentation from your onboarding team and the procedures in [Deploy Azure Communications Gateway](#deploy-azure-communications-gateway) and [Integrate with your chosen communications services](#integrate-with-your-chosen-communications-services) before you start deploying.

## Learn about and plan for Azure Communications Gateway

Read the following articles to learn about Azure Communications Gateway.

- [Your network and Azure Communications Gateway](role-in-network.md), to learn how Azure Communications Gateway fits into your network.
- [Onboarding with Included Benefits for Azure Communications Gateway](onboarding.md), to learn about onboarding to Operator Connect or Teams Phone Mobile and the support we can provide.
- [Connectivity for Azure Communications Gateway](connectivity.md) and [Reliability in Azure Communications Gateway](reliability-communications-gateway.md), to create a network design that includes Azure Communications Gateway.
- [Overview of security for Azure Communications Gateway](security.md), to learn about how Azure Communications Gateway keeps customer data and your network secure.
- [Plan and manage costs for Azure Communications Gateway](plan-and-manage-costs.md), to learn about costs for Azure Communications Gateway.
- [Azure Communications Gateway limits, quotas and restrictions](limits.md), to learn about the limits and quotas associated with the Azure Communications Gateway

For Operator Connect and Teams Phone Mobile, also read:

- [Overview of interoperability of Azure Communications Gateway with Operator Connect and Teams Phone Mobile](interoperability-operator-connect.md)
- [Mobile Control Point in Azure Communications Gateway for Teams Phone Mobile](mobile-control-point.md).
- [Emergency calling for Operator Connect and Teams Phone Mobile with Azure Communications Gateway](emergency-calls-operator-connect.md).

For Microsoft Teams Direct Routing, also read:

- [Overview of interoperability of Azure Communications Gateway with Microsoft Teams Direct Routing](interoperability-teams-direct-routing.md).
- [Emergency calling for Microsoft Teams Direct Routing with Azure Communications Gateway](emergency-calls-teams-direct-routing.md).

For Zoom Phone Cloud Peering, also read:

- [Overview of interoperability of Azure Communications Gateway with Zoom Phone Cloud Peering](interoperability-zoom.md).
- [Emergency calling for Zoom Phone Cloud Peering with Azure Communications Gateway](emergency-calls-zoom.md).

As part of your planning, ensure your network can support the connectivity and interoperability requirements in these articles.

Read through the procedures in [Deploy Azure Communications Gateway](#deploy-azure-communications-gateway) and [Integrate with your chosen communications services](#integrate-with-your-chosen-communications-services) and use those procedures as input into your planning for deployment, testing and going live. You need to work with an onboarding team (from Microsoft or one that you arrange yourself) during these phases, so ensure that you discuss timelines and requirements with this team.

## Deploy Azure Communications Gateway

Use the following procedures to deploy Azure Communications Gateway and connect it to your networks.

1. [Prepare to deploy Azure Communications Gateway](prepare-to-deploy.md) describes the steps you need to take before you can start creating your Azure Communications Gateway resource. You might need to refer to some of the articles listed in [Learn about and plan for Azure Communications Gateway](#learn-about-and-plan-for-azure-communications-gateway).
1. [Deploy Azure Communications Gateway](deploy.md) describes how to create your Azure Communications Gateway resource in the Azure portal and connect it to your networks.
1. [Integrate with Azure Communications Gateway's Provisioning API](integrate-with-provisioning-api.md) describes how to integrate with the Provisioning API. Integrating with the API is:
    - Required for Microsoft Teams Direct Routing and Zoom Phone Cloud Peering.
    - Optional for Operator Connect: only required to add custom headers to messages entering your core network.
    - Not supported for Teams Phone Mobile.

## Integrate with your chosen communications services

Use the following procedures to integrate with Operator Connect and Teams Phone Mobile.

1. [Connect Azure Communications Gateway to Operator Connect or Teams Phone Mobile](connect-operator-connect.md) describes how to set up Azure Communications Gateway for Operator Connect and Teams Phone Mobile, including onboarding to the Operator Connect and Teams Phone Mobile environments.
1. [Prepare for live traffic with Operator Connect, Teams Phone Mobile and Azure Communications Gateway](prepare-for-live-traffic-operator-connect.md) describes how to complete the requirements of the Operator Connect and Teams Phone Mobile programs and launch your service.

Use the following procedures to integrate with Microsoft Teams Direct Routing.

1. [Connect Azure Communications Gateway to Microsoft Teams Direct Routing](connect-teams-direct-routing.md) describes how to connect Azure Communications Gateway to the Microsoft Phone System for Microsoft Teams Direct Routing.
1. [Configure a test customer for Microsoft Teams Direct Routing](configure-test-customer-teams-direct-routing.md) describes how to configure Azure Communications Gateway and Microsoft 365 with a test customer.
1. [Configure test numbers for Microsoft Teams Direct Routing](configure-test-numbers-teams-direct-routing.md) describes how to configure Azure Communications Gateway and Microsoft 365 with test numbers.
1. [Prepare for live traffic with Microsoft Teams Direct Routing and Azure Communications Gateway](prepare-for-live-traffic-teams-direct-routing.md) describes how to test your deployment and launch your service.

Use the following procedures to integrate with Zoom Phone Cloud Peering.

1. [Connect Azure Communications Gateway to Zoom Phone Cloud Peering](connect-zoom.md) describes how to connect Azure Communications Gateway to Zoom servers.
1. [Configure test numbers for Zoom Phone Cloud Peering](configure-test-numbers-zoom.md) describes how to configure Azure Communications Gateway and Zoom with test numbers.
1. [Prepare for live traffic with Zoom Phone Cloud Peering and Azure Communications Gateway](prepare-for-live-traffic-zoom.md) describes how to test your deployment and launch your service.

## Next steps

- Learn about [your network and Azure Communications Gateway](role-in-network.md)
- Find out about [the newest enhancements to Azure Communications Gateway](whats-new.md).
