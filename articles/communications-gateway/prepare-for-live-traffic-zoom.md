---
title: Prepare for Zoom Phone Cloud Peering live traffic with Azure Communications Gateway
description: After deploying Azure Communications Gateway, you and your onboarding team must carry out further integration work before you can launch your Zoom Phone Cloud Peering service.
author: rcdun
ms.author: rdunstan
ms.service: communications-gateway
ms.topic: how-to
ms.date: 11/06/2023
---

# Prepare for live traffic with Zoom Phone Cloud Peering and Azure Communications Gateway

Before you can launch your Zoom Phone Cloud Peering service, you and your onboarding team must:

- Test your service.
- Prepare for launch.

In this article, you learn about the steps that you and your Azure Communications Gateway onboarding team must take.

> [!IMPORTANT]
> Some steps can require days or weeks to complete. We recommend that you read through these steps in advance to work out a timeline.

## Prerequisites

You must have completed the following procedures.

- [Prepare to deploy Azure Communications Gateway](prepare-to-deploy.md)
- [Deploy Azure Communications Gateway](deploy.md)
- [Connect Azure Communications Gateway to Zoom Phone Cloud Peering](connect-zoom.md)
- [Configure test numbers for Zoom Phone Cloud Peering](configure-test-numbers-zoom.md)

You must be able to contact your Zoom representative.

## Carry out integration testing and request changes

Network integration includes identifying SIP interoperability requirements and configuring devices to meet these requirements. For example, this process often includes interworking header formats and/or the signaling & media flows used for call hold and session refresh.

You must test typical call flows for your network. Your onboarding team will provide an example test plan that we recommend you follow. Your test plan should include call flow, failover, and connectivity testing.

- If you decide that you need changes to Azure Communications Gateway, ask your onboarding team. Microsoft must make the changes for you.
- If you need changes to the configuration of devices in your core network, you must make those changes.
- If you need changes to Zoom configuration, you must arrange those changes with Zoom.

## Run connectivity tests and provide proof to Zoom

Before you can launch, Zoom requires proof that your network is properly connected to their servers. The testing you need to carry out is described in Zoom's _Zoom Phone Provider Exchange Solution Reference Guide_ or other documentation provided by your Zoom representative.

You must capture the signaling in your network and provide the proof to your Zoom representative.

## Test raising a ticket

You must test that you can raise tickets in the Azure portal to report problems with Azure Communications Gateway. See [Get support or request changes for Azure Communications Gateway](request-changes.md).

> [!NOTE]
> If we think a problem is caused by traffic from Zoom servers, we might ask you to raise a separate support request with Zoom. Ensure you also know how to raise a support request with Zoom.

## Learn about monitoring Azure Communications Gateway

Your staff can use a selection of key metrics to monitor Azure Communications Gateway. These metrics are available to anyone with the Reader role on the subscription for Azure Communications Gateway. See [Monitoring Azure Communications Gateway](monitor-azure-communications-gateway.md).

## Schedule launch

Your launch date is the date that you'll be able to start selling Zoom Phone Cloud Peering service. You must arrange this date with your Zoom representative.

## Next steps

- Learn about [getting support and requesting changes for Azure Communications Gateway](request-changes.md).
- Learn about [monitoring Azure Communications Gateway](monitor-azure-communications-gateway.md).
