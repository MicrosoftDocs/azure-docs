---
title: Connect Azure Communications Gateway to Zoom Phone Cloud Peering
description:  After deploying Azure Communications Gateway, you can configure it to connect to Zoom servers for Zoom Phone Cloud Peering.
author: rcdun
ms.author: rdunstan
ms.service: communications-gateway
ms.topic: integration
ms.date: 11/22/2023
ms.custom:
    - template-how-to-pattern
---

# Connect Azure Communications Gateway to Zoom Phone Cloud Peering

After you deploy Azure Communications Gateway and connect it to your core network, you need to connect it to Zoom.

This article describes how to start connecting Azure Communications Gateway to Zoom Phone Cloud Peering. After you finish the steps in this article, you can set up test users for test calls and prepare for live traffic.

## Prerequisites

You must start the onboarding process with Zoom to become a Zoom Phone Cloud Peering provider. For more information on Cloud Peering, see [Zoom's Cloud Peering information](https://partner.zoom.us/partner-type/cloud-peering/).

You must [deploy Azure Communications Gateway](deploy.md).

Your organization must [integrate with Azure Communications Gateway's Provisioning API](integrate-with-provisioning-api.md). If you didn't configure the Provisioning API in the Azure portal as part of deploying, you also need to know:
- The IP addresses or address ranges (in CIDR format) in your network that should be allowed to connect to the Provisioning API, as a comma-separated list.
- (Optional) The name of any custom SIP header that Azure Communications Gateway should add to messages entering your network.

You must allocate "service verification" test numbers for Zoom. Zoom use these numbers for continuous call testing.
- If you selected the service you're setting up as part of deploying Azure Communications Gateway, you've allocated numbers for the service already.
- Otherwise, choose the phone numbers now (in E.164 format and including the country code). You need six numbers for the US and Canada or two numbers for the rest of the world.

You must also allocate at least one test number for each service for your own integration testing.

You must know which Zoom Phone Cloud Peering region you need to connect to.

You must have **Reader** access to the subscription into which Azure Communications Gateway is deployed.

You must be able to contact your Zoom representative.

## Enable Zoom Phone Cloud Peering support

> [!NOTE]
> If you selected Zoom Phone Cloud Peering when you [deployed Azure Communications Gateway](deploy.md), skip this step and go to [Ask your onboarding team for the FQDNs and IP addresses for Azure Communications Gateway](#ask-your-onboarding-team-for-the-fqdns-and-ip-addresses-for-azure-communications-gateway).

1. Sign in to the [Azure portal](https://azure.microsoft.com/).
1. In the search bar at the top of the page, search for your Communications Gateway resource and select it.
1. In the side menu bar, find **Communications services** and select **Zoom Phone Cloud Peering** to open a page for the service.
1. On the service's page, select **Zoom Phone Cloud Peering settings**.
1. Fill in the fields, selecting **Review + create** and **Create**.
    > [!IMPORTANT]
    > Do not add the numbers for your own integration testing when you configure test numbers. You will configure numbers for integration testing when you [configure test numbers](configure-test-numbers-zoom.md).
1. Select the **Overview** page for your resource.
1. Wait for your resource to be updated. When your resource is ready, the **Provisioning Status** field on the resource overview changes to "Complete." We recommend that you check in periodically to see if the Provisioning Status field is "Complete." This step might take up to two weeks.

## Ask your onboarding team for the FQDNs and IP addresses for Azure Communications Gateway

Before starting this step, check that the **Provisioning Status** field for your resource is "Complete".

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
