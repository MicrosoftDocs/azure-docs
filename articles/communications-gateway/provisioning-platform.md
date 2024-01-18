---
title: Azure Communications Gateway Provisioning API
description: Learn about customer and number configuration with the Provisioning API with Azure Communications Gateway.
author: rcdun
ms.author: rdunstan
ms.service: communications-gateway
ms.topic: conceptual
ms.date: 01/31/2024

#CustomerIntent: As someone learning about Azure Communications Gateway, I want to understand the Provisioning Platform, so that I know whether I need to integrate with it
---

# Provisioning API for Azure Communications Gateway

Azure Communications Gateway's Provisioning API allows you to configure Azure Communications Gateway with the details of your customers and the numbers that you assign to them.

You can use the Provisioning API to:
- Associate numbers with communications services.
- Provision communication services with customer configuration (sometimes called _flow-through provisioning_).
- Add custom header configuration.

The following table shows how you can use the Provisioning API for each communications service. The following sections in this article provide more detail about each use case.

|Communications service | Associating numbers with communications service | Flow-through provisioning of communication service | Custom header configuration |
|---|---|---|---|
|Microsoft Teams Direct Routing | Required | Not supported | Optional |
|Operator Connect | Automatically set up if you use flow-through provisioning or the Number Management Portal | Recommended | Optional |
|Teams Phone Mobile | Automatically set up if you use flow-through provisioning or the Number Management Portal | Recommended | Optional |
|Zoom Phone Cloud Peering | Required | Not supported | Optional |

> [!TIP]
> For Operator Connect and Teams Phone Mobile, you can also use Azure Communications Gateway's Number Management Portal, available in the Azure portal. For more information, see [Manage an enterprise with Azure Communications Gateway's Number Management Portal for Operator Connect and Teams Phone Mobile](manage-enterprise-operator-connect.md).

## Associating numbers for specific communications services

For Microsoft Teams Direct Routing and Zoom Phone Cloud Peering, you must provision Azure Communications Gateway with the numbers that you want to assign to each of your customers and enable each number for the chosen communications service. This information allows Azure Communications Gateway to:

- Route calls to the correct communications service.
- Update SIP messages for Microsoft Teams Direct Routing with the information that Microsoft Phone System requires to match calls to tenants. For more information, see [Identifying the customer tenant for Microsoft Phone System](interoperability-teams-direct-routing.md#identifying-the-customer-tenant-for-microsoft-phone-system).

For Operator Connect or Teams Phone Mobile:
- If you use the Provisioning API for flow-through provisioning or you use the Number Management Portal, resources on the Provisioning API associate the customer numbers with the relevant service.
- Otherwise, Azure Communications Gateway defaults to Operator Connect for fixed-line calls and Teams Phone Mobile for mobile calls, and doesn't create resources on the Provisioning API.

## Flow-through provisioning of communications services

Flow-through provisioning is when you use Azure Communications Gateway to provision a communications service. 

For Operator Connect and Teams Phone Mobile, you can use Azure Communications Gateway to provision the Operator Connect and Teams Phone Mobile environment with subscribers (your customers and the numbers you assign to them). This integration is equivalent to separate integration with the Operator Management and Telephone Number Management APIs provided by the Operator Connect environment. It meets the Operator Connect and Teams Phone Mobile requirement to use APIs to manage your customers and numbers after you launch your service.

Azure Communications Gateway doesn't support flow-through provisioning for Microsoft Teams Direct Routing or Zoom Phone Cloud Peering.

## Custom headers

Azure Communications Gateway can add a custom header to messages sent to your core network. You can use this feature to add custom information that your network might need, for example to assist with billing.

To set up custom headers:

- Choose the name of the custom header when you [deploy Azure Communications Gateway](deploy.md) or by updating the Provisioning Platform configuration in the Azure portal. This header name is used for all custom headers.
- Use the Provisioning API to provision Azure Communications Gateway with numbers and the contents of the custom header for each number.

Azure Communications Gateway then uses this information to add custom headers to a call as follows:

- For calls from your network, the called number's configuration determines the header contents.
- For calls to your network, the calling number's configuration determines the header contents.

Azure Communications Gateway doesn't add a header if the number isn't provisioned on Azure Communications Gateway, or the configuration for the number doesn't include contents for a custom header.

The following diagram shows an Azure Communications Gateway deployment configured to add a `X-MS-Operator-Content` header to messages sent to the operator network from Operator Connect.

:::image type="complex" source="media/azure-communications-gateway-provisioning-platform-custom-header.svg" alt-text="Call flow diagram showing outbound call from Operator Connect with custom header configuration.":::
    Call flow diagram showing an invite from a number assigned to a customer. Azure Communications Gateway checks its internal database to determine if the calling number has custom header configuration. Because the number configuration includes custom header contents, Azure Communications Gateway adds the header contents as an X-MS-Operator-Content header before forwarding the call to the operator network.
:::image-end:::

## Next steps

- [Learn about the technical requirements for integrating with the Provisioning API](integrate-with-provisioning-api.md)
- Browse the [API Reference for the Provisioning API](/rest/api/voiceservices)

