---
title: Azure Communications Gateway Provisioning API
description: Learn about customer and number configuration with the Provisioning API with Azure Communications Gateway.
author: rcdun
ms.author: rdunstan
ms.service: communications-gateway
ms.topic: conceptual
ms.date: 11/17/2023

#CustomerIntent: As someone learning about Azure Communications Gateway, I want to understand the Provisioning Platform, so that I know whether I need to integrate with it
---

# Provisioning API for Azure Communications Gateway

Azure Communications Gateway's Provisioning API allows you to configure Azure Communications Gateway with the details of your customers and the numbers that you have assigned to them.

You can use the Provisioning API to:
- Configure numbers for specific configuration services
- Add custom header configuration

The following table shows whether these uses of the Provisioning API are required, optional or not supported for each communications service. The following sections in this article provide more detail about each use.

|Communications service | Configuring numbers for specific communications service | Custom header configuration |
|---|---|---|
|Microsoft Teams Direct Routing |Required| Optional |
|Operator Connect|Optional|Optional|
|Teams Phone Mobile|Not supported|Not supported|
|Zoom Phone Cloud Peering |Required | Optional |

## Configuring numbers for specific communications services

For Microsoft Teams Direct Routing and Zoom Phone Cloud Peering, you must provision Azure Communications Gateway with the numbers that you want to assign to each of your customers and enable each number for the chosen communications service. This information allows Azure Communications Gateway to:

- Route calls to the correct communications service.
- Update SIP messages for Microsoft Teams Direct Routing with the information that Microsoft Phone System requires to match calls to tenants. For more information about this process, see [Identifying the customer tenant for Microsoft Phone System](interoperability-teams-direct-routing.md#identifying-the-customer-tenant-for-microsoft-phone-system).

Enabling numbers for Operator Connect is optional; if you don't select a communications service for a number, Azure Communications Gateway defaults to Operator Connect for fixed-line calls.

## Custom headers

Azure Communications Gateway can add a custom header to messages sent to your core network. You can use this feature to add custom information that your network might need, for example to assist with billing.

To set up custom headers:

- Choose the name of the custom header when you [deploy Azure Communications Gateway](deploy.md). This header name is used for all custom headers.
- Use the Provisioning API to provision Azure Communications Gateway with numbers and the contents of the custom header for each number.

Azure Communications Gateway then uses this information to add custom headers to a call as follows:

- For calls from your network, the called number's configuration determines the header contents.
- For calls to your network, the calling number's configuration determines the header contents.

Azure Communications Gateway doesn't add a header if the number hasn't been provisioned, or the configuration for the number doesn't include contents for a custom header.

The following diagram shows an Azure Communications Gateway deployment configured to add a `X-MS-Operator-Content` header to messages sent to the operator network from Operator Connect.

:::image type="complex" source="media/azure-communications-gateway-provisioning-platform-custom-header.svg" alt-text="Call flow diagram showing outbound call from Operator Connect with custom header configuration.":::
    Call flow diagram showing an invite from a number assigned to a customer. Azure Communications Gateway checks its internal database to determine if the calling number has custom header configuration. Because the number configuration includes custom header contents, Azure Communications Gateway adds the header contents as an X-MS-Operator-Content header before forwarding the call to the operator network.
:::image-end:::

## Next steps

- [Learn about the technical requirements for integrating with the Provisioning API](integrate-with-provisioning-api.md)
- Browse the [API Reference for the Provisioning API](/rest/api/voiceservices)

