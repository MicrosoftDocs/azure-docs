---
title: Provisioning Azure Communications Gateway
description: Learn about customer and number configuration with the Provisioning API and Number Management Portal for Azure Communications Gateway.
author: rcdun
ms.author: rdunstan
ms.service: communications-gateway
ms.topic: concept-article

#CustomerIntent: As someone learning about Azure Communications Gateway, I want to understand the Provisioning Platform, so that I know whether I need to integrate with it
---

# Provisioning Azure Communications Gateway

You can configure Azure Communications Gateway with the details of your customers and the numbers that you assign to them. Depending on the services that you're providing, this configuration might be required for Azure Communications Gateway to operate correctly. Provisioning allows you to:

- Associate numbers with backend services.
- Provision backend services with customer configuration (sometimes called _flow-through provisioning_).
- Add custom header configuration (available for all communications services except Azure Operator Call Protection Preview and Teams Phone Mobile).

You can provision Azure Communications Gateway with the:

- Provisioning API (preview): a REST API for automated provisioning.
- Number Management Portal (preview): a browser-based portal available in the Azure portal.

The following table shows how you can provision Azure Communications Gateway for each  service. The following sections in this article provide more detail about each use case.

|Service | Associating numbers with service | Flow-through provisioning of service | Custom header configuration |
|---|---|---|---|
|Microsoft Teams Direct Routing | Required | Not supported | Supported |
|Operator Connect | Automatically set up if you use the API for flow-through provisioning or you use the Number Management Portal | Recommended (with API) | Supported |
|Teams Phone Mobile | Automatically set up if you use the API for flow-through provisioning or you use the Number Management Portal | Recommended (with API) | Not Supported |
|Zoom Phone Cloud Peering | Required | Not supported | Supported |
| Azure Operator Call Protection Preview | Required | Automatic | Not supported |

Flow-through provisioning of Operator Connect and Teams Phone Mobile with the Provisioning API interoperates with the Operator Connect APIs. It therefore allows you to meet the requirements for API-based provisioning from the Operator Connect and Teams Phone Mobile programs.

> [!IMPORTANT]
> After you launch Operator Connect or Teams Phone Mobile service, you must use the Provisioning API to meet the requirement for API-based provisioning (or provide your own API integration). The Number Management Portal doesn't meet this requirement.

## Associating numbers with specific communications services

For Microsoft Teams Direct Routing, Zoom Phone Cloud Peering, and Azure Operator Call Protection, you must provision Azure Communications Gateway with the numbers that you want to assign to each of your customers and enable each number for the chosen communications service. This information allows Azure Communications Gateway to:

- Route calls to the correct communications service.
- Update SIP messages for Microsoft Teams Direct Routing with the information that Microsoft Phone System requires to match calls to tenants. For more information, see [Identifying the customer tenant for Microsoft Phone System](interoperability-teams-direct-routing.md#identifying-the-customer-tenant-for-microsoft-phone-system).

For Operator Connect or Teams Phone Mobile:
- If you use the Provisioning API (preview) for flow-through provisioning or you use the Number Management Portal (preview), resources on the Provisioning API associate the customer numbers with the relevant service.
- Otherwise, Azure Communications Gateway defaults to Operator Connect for fixed-line calls and Teams Phone Mobile for mobile calls, and doesn't create resources on the Provisioning API.

## Flow-through provisioning of communications services

Flow-through provisioning is when you use Azure Communications Gateway to provision a communications service. 

For Operator Connect and Teams Phone Mobile, you can use the Provisioning API (preview) to provision the Operator Connect and Teams Phone Mobile environment with subscribers (your customers and the numbers you assign to them). This integration is equivalent to separate integration with the Operator Management and Telephone Number Management APIs provided by the Operator Connect environment. It meets the Operator Connect and Teams Phone Mobile requirement to use APIs to manage your customers and numbers after you launch your service.

Before you launch your service, you can also use the Number Management Portal (preview) to provision the Operator Connect and Teams Phone Mobile environment. However, the Operator Connect and Teams Phone Mobile programs require API-based provisioning after you launch your service. The Number Management Portal doesn't meet this requirement.

Azure Communications Gateway doesn't support flow-through provisioning for other communications services.

## Custom headers

Azure Communications Gateway can add a custom header to messages sent to your core network. You can use this feature to add custom information that your network might need, for example to assist with billing.

To set up custom headers:

- Choose the name of the custom header when you [deploy Azure Communications Gateway](deploy.md) or by updating the Provisioning Platform configuration in the Azure portal. This header name is used for all custom headers.
- Use the Provisioning API (preview) or Number Management Portal (preview) to provision Azure Communications Gateway with numbers and the contents of the custom header for each number.

Azure Communications Gateway then uses this information to add custom headers to a call as follows:

- For calls from your network, the called number's configuration determines the header contents.
- For calls to your network, the calling number's configuration determines the header contents.

Azure Communications Gateway doesn't add a header if the number isn't provisioned on Azure Communications Gateway, or the configuration for the number doesn't include contents for a custom header.

The following diagram shows an Azure Communications Gateway deployment configured to add a `X-MS-Operator-Content` header to messages sent to the operator network from Operator Connect.

:::image type="complex" source="media/azure-communications-gateway-provisioning-platform-custom-header.svg" alt-text="Call flow diagram showing outbound call from Operator Connect with custom header configuration.":::
    Call flow diagram showing an invite from a number assigned to a customer. Azure Communications Gateway checks its internal database to determine if the calling number has custom header configuration. Because the number configuration includes custom header contents, Azure Communications Gateway adds the header contents as an X-MS-Operator-Content header before forwarding the call to the operator network.
:::image-end:::

## Next steps

- [Learn about the technical requirements for integrating with the Provisioning API](integrate-with-provisioning-api.md).
- Browse the [API Reference for the Provisioning API](/rest/api/voiceservices).

