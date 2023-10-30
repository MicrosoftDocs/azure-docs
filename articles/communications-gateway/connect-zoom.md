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

## Find your Azure Communication Gateway's per-region domain names

You need to know the FQDNs for each of Azure Communications Gateway's regions. Your Zoom representative needs these FQDNs to route calls to Azure Communications Gateway. To find these FQDNs:

1. Sign in to the [Azure portal](https://azure.microsoft.com/).
1. In the search bar at the top of the page, search for your Communications Gateway resource.
1. Select your Communications Gateway resource. Check that you're on the **Overview** of your Azure Communications Gateway resource.
1. Select **Properties**.
1. Find the field named **Domain**. This name is your deployment's _base domain name_.
1. In each **Service Location** section, find the **Hostname** field. This field provides the _per-region domain name_. Your deployment has two service regions and therefore two per-region domain names.
1. Note down the per-region domain names.

## Ask your onboarding team for the IP addresses for Azure Communications Gateway

Ask your onboarding team for all the IP addresses that Azure Communications Gateway could use to send signaling and media to Zoom servers. Your Zoom representative needs these values to allow signaling and media from Azure Communications Gateway.

## Ask your Zoom representative to configure Zoom

Ask your Zoom representative to configure Zoom to connect to Azure Communications Gateway.

Zoom must:

- Allowlist traffic from all the IP addresses for Azure Communications Gateway.
- Route calls to the per-region domain names for Azure Communications Gateway.

You can choose whether Zoom should use an active-active or active-backup distribution of calls to the Azure Communications Gateway regions.

## Next step

> [!div class="nextstepaction"]
> [Configure test numbers](configure-test-numbers-zoom.md)
