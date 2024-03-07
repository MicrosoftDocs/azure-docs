---
title: Learn about deploying and setting up Azure Operator Call Protection
description: Understand how to get started with Azure Operator Call Protection to protect your customers against fraud.
author: rcdun
ms.author: rdunstan
ms.service: azure
ms.topic: concept-article #Required; leave this attribute/value as-is.
ms.date: 03/31/2024
ms.custom:
    - update-for-call-protection-service-slug

#CustomerIntent: As a someone planning a deployment, I want to understand what I need to do so that I can do it easily.
---
# Overview of deploying Azure Operator Call Protection

Azure Operator Call Protection is built on Azure Communications Gateway.
You must deploy an Azure Communications Gateway resource and enable Azure Operator Call Protection on it.

[!INCLUDE [operator-call-protection-ucaas-restriction](includes/operator-call-protection-ucaas-restriction.md)]

## Planning your deployment

[!INCLUDE [operator-call-protection-tsp-restriction](includes/operator-call-protection-tsp-restriction.md)]

Your network must connect to Azure Communications Gateway and thus Azure Operator Call Protection over SIPREC.

- Azure Operator Call Protection takes the role of the SIPREC Session Recording Server (SRS).
- An element in your network, typically a session border controller (SBC), must be set up as a SIPREC Session Recording Client (SRC).

This SIPREC connection is different to other services available through Azure Communication Gateway. Ensure your network design takes this into account.

When you deploy Azure Operator Call Protection, you can access Azure Communication's Gateway's _Included Benefits_ customer success and onboarding service. This onboarding service includes a project team to help you design and set up your network for success. For more information about Included Benefits, see [Onboarding with Included Benefits for Azure Communications Gateway](../communications-gateway/onboarding.md).

[Get started with Azure Communications Gateway](../communications-gateway/get-started.md) provides links to more information about deploying Azure Communications Gateway.

## Deploying Operator Call Protection

When you're ready to deploy Azure Operator Call Protection, follow:

1. [Prepare to deploy Azure Communications Gateway](../communications-gateway/prepare-to-deploy.md?toc=/azure/operator-call-protection/toc.json&bc=/azure/operator-call-protection/breadcrumb/toc.json).
1. [Deploy Azure Communications Gateway](../communications-gateway/deploy.md?toc=/azure/operator-call-protection/toc.json&bc=/azure/operator-call-protection/breadcrumb/toc.json).
1. [Set up Azure Operator Call Protection](set-up-operator-call-protection.md), including provisioning subscribers using the Number Management Portal and testing your deployment.

> [!TIP]
> You can also use Azure Communication Gateway's Provisioning API to provision subscribers. To do this, you must [integrate with the Provisioning API](../communications-gateway/integrate-with-provisioning-api.md).

## Next step

> [!div class="nextstepaction"]
> [Prepare to deploy Operator Call Protection on Azure Communications Gateway](../communications-gateway/prepare-to-deploy.md?toc=/azure/operator-call-protection/toc.json&bc=/azure/operator-call-protection/breadcrumb/toc.json)
