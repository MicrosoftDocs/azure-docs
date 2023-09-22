---
title: Getting started with Azure Communications Gateway
description: Learn how to plan for and deploy Azure Communications Gateway
author: rcdun
ms.author: rdunstan
ms.service: communications-gateway
ms.topic: how-to
ms.date: 09/01/2023

#CustomerIntent: As someone setting up Azure Communications Gateway, I want to understand the steps I need to carry out to have live traffic through my deployment.
---

# Get started with Azure Communications Gateway

Setting up Azure Communications Gateway requires planning your deployment, deploying your Azure Communications Gateway resource, and integrating with Operator Connect or Teams Phone Mobile.

This article summarizes the steps and documentation that you need.

> [!IMPORTANT]
> You must fully understand the onboarding process for your chosen communications service and any dependencies introduced by the onboarding process. For advice, ask your onboarding team.
>
> Some steps in the deployment and integration process can require days or weeks to complete. For example, you might need to arrange Microsoft Azure Peering Service (MAPS) connectivity before you can deploy, wait for onboarding, or wait for a specific date to launch your service. We recommend that you read through any documentation from your onboarding team and the procedures in [2. Deploy Azure Communications Gateway](#2-deploy-azure-communications-gateway) and [3. Integrate with Operator Connect or Teams Phone Mobile](#3-integrate-with-operator-connect-or-teams-phone-mobile) before you start deploying.

## 1. Learn about and plan for Azure Communications Gateway

Read the following articles to learn about Azure Communications Gateway.

- [Your network and Azure Communications Gateway](role-in-network.md), to learn how Azure Communications Gateway fits into your network.
- [Onboarding with Included Benefits for Azure Communications Gateway](onboarding.md), to learn about onboarding to Operator Connect or Teams Phone Mobile and the support we can provide.
- [Reliability in Azure Communications Gateway](reliability-communications-gateway.md), to create a network design that includes Azure Communications Gateway.
- [Overview of security for Azure Communications Gateway](security.md), to learn about how Azure Communications Gateway keeps customer data and your network secure.
- [Plan and manage costs for Azure Communications Gateway](plan-and-manage-costs.md), to learn about costs for Azure Communications Gateway.
- [Azure Communications Gateway limits, quotas and restrictions](limits.md), to learn about the limits and quotas associated with the Azure Communications Gateway

Read the following articles to learn about Operator Connect and Teams Phone Mobile with Azure Communications Gateway.

- [Overview of interoperability of Azure Communications Gateway with Operator Connect and Teams Phone Mobile](interoperability-operator-connect.md)
- [Mobile Control Point in Azure Communications Gateway for Teams Phone Mobile](mobile-control-point.md).
- [Emergency calling for Operator Connect and Teams Phone Mobile with Azure Communications Gateway](emergency-calling-operator-connect.md)

As part of your planning, ensure your network can support the connectivity and interoperability requirements in these articles.

Read through the procedures in [2. Deploy Azure Communications Gateway](#2-deploy-azure-communications-gateway) and [3. Integrate with Operator Connect or Teams Phone Mobile](#3-integrate-with-operator-connect-or-teams-phone-mobile) and use those procedures as input into your planning for deployment, testing and going live. You need to work with an onboarding team (from Microsoft or one that you arrange yourself) during these phases, so ensure that you discuss timelines and requirements with this team.

## 2. Deploy Azure Communications Gateway

Use the following procedures to deploy Azure Communications Gateway and connect it to your networks.

1. [Prepare to deploy Azure Communications Gateway](prepare-to-deploy.md) describes the steps you need to take before you can start creating your Azure Communications Gateway resource. You might need to refer to some of the articles listed in [1. Learn about and plan for Azure Communications Gateway](#1-learn-about-and-plan-for-azure-communications-gateway).
1. [Deploy Azure Communications Gateway](deploy.md) describes how to create your Azure Communications Gateway resource in the Azure portal and connect it to your networks.

## 3. Integrate with Operator Connect or Teams Phone Mobile

Use the following procedures to integrate with Operator Connect and Teams Phone Mobile.

1. [Connect to Operator Connect or Teams Phone Mobile](connect-operator-connect.md) describes how to set up Azure Communications Gateway for Operator Connect and Teams Phone Mobile, including onboarding to the Operator Connect and Teams Phone Mobile environments.
1. [Prepare for live traffic with Operator Connect, Teams Phone Mobile and Azure Communications Gateway](prepare-for-live-traffic-operator-connect.md) describes how to complete the requirements of the Operator Connect and Teams Phone Mobile programs and launch your service.

## Next steps

- Learn about [your network and Azure Communications Gateway](role-in-network.md)
- Find out about [the newest enhancements to Azure Communications Gateway](whats-new.md).
