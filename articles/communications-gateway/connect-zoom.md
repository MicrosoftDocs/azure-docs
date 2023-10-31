---
title: Connect Azure Communications Gateway to Zoom Phone Cloud Peering
description:  After deploying Azure Communications Gateway, you can configure it to connect to Zoom servers for Zoom Phone Cloud Peering.
author: rcdun
ms.author: rdunstan
ms.service: communications-gateway
ms.topic: integration
ms.date: 11/06/2023
ms.custom:
    - template-how-to-pattern
---

# Connect Azure Communications Gateway to Zoom Phone Cloud Peering

After you have deployed Azure Communications Gateway and connected it to your core network, you need to connect it to Zoom.

This article describes how to start setting up Azure Communications Gateway for Zoom Phone Cloud Peering. When you have finished the steps in this article, you can set up test users for test calls and prepare for live traffic.

## Prerequisites

You must have started the onboarding process with Zoom to become a Zoom Phone Cloud Peering provider. For more information on Cloud Peering, see [Zoom's Cloud Peering information](https://partner.zoom.us/partner-type/cloud-peering/).

You must have carried out all the steps in [Deploy Azure Communications Gateway](deploy.md).

Your organization must have integrated with Azure Communications Gateway's Provisioning API.

You must have **Reader** access to the subscription into which Azure Communications Gateway is deployed.

You must be able to contact your Zoom representative.

## Ask your onboarding team for the FQDNs and IP addresses for Azure Communications Gateway

Ask your onboarding team for:

- All the IP addresses that Azure Communications Gateway could use to send signaling and media to Zoom.
- The FQDNs (fully qualified domain names) that Zoom should use to contact each Azure Communications Gateway region.

Your Zoom representative needs these values to configure Zoom for Azure Communications Gateway.

## Ask your Zoom representative to configure Zoom

Ask your Zoom representative to configure Zoom for Azure Communications Gateway using the IP addresses and FQDNs that you obtained from your onboarding team.

Zoom must:

- Allowlist traffic from the IP addresses for Azure Communications Gateway.
- Route calls to the FQDNs for Azure Communications Gateway.

You can choose whether Zoom should use an active-active or active-backup distribution of calls to the Azure Communications Gateway regions.

> [!TIP]
> Don't provide your Zoom representative with the FQDNs from the **Overview** page for your Azure Communications Gateway resource. Those FQDNs are for the connection to your networks.

## Next step

> [!div class="nextstepaction"]
> [Configure test numbers](configure-test-numbers-zoom.md)
