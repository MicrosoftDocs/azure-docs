---
title: Prepare for Microsoft Teams Direct Routing live traffic with Azure Communications Gateway
description: After deploying Azure Communications Gateway, you and your onboarding team must carry out further integration work before you can launch your Microsoft Teams Direct Routing service.
author: rcdun
ms.author: rdunstan
ms.service: communications-gateway
ms.topic: how-to
ms.date: 10/09/2023
---

# Prepare for live traffic with Microsoft Teams Direct Routing and Azure Communications Gateway

Before you can launch your Microsoft Teams Direct Routing service, you and your onboarding team must:

- Test your service.
- Prepare for launch.

In this article, you learn about the steps you and your onboarding team must take.

> [!TIP]
> In many cases, your onboarding team is from Microsoft, provided through the [Included Benefits](onboarding.md) or through a separate arrangement.

> [!IMPORTANT]
> Some steps can require days or weeks to complete. We recommend that you read through these steps in advance to work out a timeline.

## Prerequisites

You must have completed the following procedures.

- [Prepare to deploy Azure Communications Gateway](prepare-to-deploy.md)
- [Deploy Azure Communications Gateway](deploy.md)
- [Integrate with Azure Communications Gateway's Provisioning API](integrate-with-provisioning-api.md)
- [Connect Azure Communications Gateway to Microsoft Teams Direct Routing](connect-teams-direct-routing.md)
- [Configure a test customer for Microsoft Teams Direct Routing](configure-test-customer-teams-direct-routing.md)
- [Configure test numbers for Microsoft Teams Direct Routing](configure-test-numbers-teams-direct-routing.md)

## Carry out integration testing and request changes

Network integration includes identifying SIP interoperability requirements and configuring devices to meet these requirements. For example, this process often includes interworking header formats and/or the signaling & media flows used for call hold and session refresh.

You must test typical call flows for your network. Your onboarding team will provide an example test plan that we recommend you follow. Your test plan should include call flow, failover, and connectivity testing.

- If you decide that you need changes to Azure Communications Gateway, ask your onboarding team. Microsoft must make the changes for you.
- If you need changes to the configuration of devices in your core network, you must make those changes.

## Test raising a ticket

You must test that you can raise tickets in the Azure portal to report problems with Azure Communications Gateway. See [Get support or request changes for Azure Communications Gateway](request-changes.md).

## Learn about monitoring Azure Communications Gateway

Your staff can use a selection of key metrics to monitor Azure Communications Gateway. These metrics are available to anyone with the Reader role on the subscription for Azure Communications Gateway. See [Monitoring Azure Communications Gateway](monitor-azure-communications-gateway.md).

## Next steps

- Learn about [getting support and requesting changes for Azure Communications Gateway](request-changes.md).
- Learn about [monitoring Azure Communications Gateway](monitor-azure-communications-gateway.md).
