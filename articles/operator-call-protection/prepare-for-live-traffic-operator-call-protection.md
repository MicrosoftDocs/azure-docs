---
title: Prepare for Azure Operator Call Protection live traffic with Azure Communications Gateway
description: After deploying Azure Communications Gateway, you and your onboarding team must carry out further integration work before you can launch your Azure Operator Call Protection service.
author: msft-andrew
ms.author: andrewwright
ms.service: operator-call-protection
ms.topic: how-to
ms.date: 02/29/2024
---

# Prepare for live traffic with Azure Operator Call Protection

Before you can launch your Azure Operator Call Protection service, you and your onboarding team must:

- Test your service.
- Prepare for launch.

In this article, you learn about the steps that you and your Azure Communications Gateway onboarding team must take.

> [!IMPORTANT]
> Some steps can require days or weeks to complete. We recommend that you read through these steps in advance to work out a timeline.

## Prerequisites

You must have completed the following procedures.

- [Prepare to deploy Azure Communications Gateway](../communications-gateway/prepare-to-deploy.md)
- [Deploy Azure Communications Gateway](../communications-gateway/deploy.md) - with Azure Operator Call Protection enabled
- [Integrate with Azure Communications Gateway's Provisioning API](../communications-gateway/integrate-with-provisioning-api.md)

## Carry out integration testing and request changes

Network integration includes identifying SIP interoperability requirements and configuring devices to meet these requirements. For example, this process often includes interworking header formats and/or the signaling & media flows used for call hold and session refresh.

You must test typical call flows for your network. Your onboarding team will provide an example test plan that we recommend you follow. Your test plan should include call flow, failover, and connectivity testing.

- If you decide that you need changes to Azure Communications Gateway, ask your onboarding team. Microsoft must make the changes for you.
- If you need changes to the configuration of devices in your core network, you must make those changes.

## Test raising a ticket

You must test that you can raise tickets in the Azure portal to report problems with Azure Communications Gateway. See [Get support or request changes for Azure Communications Gateway](../communications-gateway/request-changes.md).

## Learn about monitoring Azure Operator Call Protection

Your staff can use a selection of key metrics to monitor Azure Operator Call Protection through your Azure Communications Gateway. These metrics are available to anyone with the Reader role on the subscription for Azure Communications Gateway. See [Monitoring Azure Communications Gateway](../communications-gateway/monitor-azure-communications-gateway.md).

## Next steps

- Learn about [monitoring Azure Operator Call Protection](../communications-gateway/monitor-azure-communications-gateway.md).
