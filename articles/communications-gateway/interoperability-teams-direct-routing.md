---
title: Overview of Microsoft Teams Direct Routing with Azure Communications Gateway
description: Understand how Azure Communications Gateway works with Microsoft Teams Direct Routing and your fixed network.
author: GemmaWakeford
ms.author: gwakeford
ms.service: azure-communications-gateway
ms.topic: conceptual
ms.date: 03/31/2024
ms.custom: template-concept
---

# Overview of interoperability of Azure Communications Gateway with Microsoft Teams Direct Routing

Azure Communications Gateway is a certified SBC for Microsoft Teams Direct Routing, allowing telecommunications operators to provide their customers with PSTN connectivity from Microsoft Teams. Azure Communications Gateway can manipulate signaling and media to meet the requirements of your networks and the Microsoft Phone System, which powers Microsoft Teams Direct Routing.

In this article, you learn:

- Where Azure Communications Gateway fits in your network.
- How Azure Communications Gateway supports many customers.
- Which signaling and media interworking features it offers.

> [!IMPORTANT]
> You must be a telecommunications operator to use Azure Communications Gateway.

## Role and position in the network

Azure Communications Gateway sits at the edge of your fixed line network. It connects this network to the Microsoft Phone System, allowing you to support Microsoft Teams Direct Routing. The following diagram shows where Azure Communications Gateway sits in your network.

:::image type="complex" source="media/interoperability-direct-routing/azure-communications-gateway-architecture-teams-direct-routing.svg" alt-text="Architecture diagram for Azure Communications Gateway for Microsoft Teams Direct Routing." lightbox="media/interoperability-direct-routing/azure-communications-gateway-architecture-teams-direct-routing.svg":::
    Architecture diagram showing Azure Communications Gateway connecting to the Microsoft Phone System and a fixed operator network over SIP and RTP. Azure Communications Gateway and the Microsoft Phone System connect multiple customers to the operator network. Azure Communications Gateway also has a provisioning API to which a BSS client in the operator's management network must connect. Azure Communications Gateway contains certified SBC function.
:::image-end:::

Calls flow from Microsoft Teams clients through the Microsoft Phone System and Azure Communications Gateway into your network.

## Compliance with Certified SBC specifications

Azure Communications Gateway supports the Microsoft specifications for Certified SBCs for Microsoft Teams Direct Routing. For more information about certification and these specifications, see [Session Border Controllers certified for Direct Routing](/microsoftteams/direct-routing-border-controllers).

Azure Communications Gateway includes multiple features that allow your network to meet the requirements for Direct Routing, including:

- [Identifying the customer tenant for Microsoft Phone System](#identifying-the-customer-tenant-for-microsoft-phone-system)
- [SIP interworking](#sip-signaling)
- [Media interworking](#rtp-and-srtp-media)

## Support for multiple customers with the Microsoft Teams multitenant model

An Azure Communications Gateway deployment is designed to support Direct Routing for many tenants. Its design allows you to provide Microsoft Teams calling services to many customers, each with many users. It uses the carrier tenant and customer tenant model described in the [Microsoft Teams documentation on configuring a Session Border Controller for multiple tenants](/microsoftteams/direct-routing-sbc-multiple-tenants). In this model:

- Your own configuration for Microsoft Teams is defined in your organization's tenant: the _carrier tenant_.
- Each of your customers has its own _customer tenant_, representing the configuration for that customer.

Your Azure Communications Gateway deployment always receives an FQDN (fully qualified domain name) when it's created. You use this FQDN as the _base domain_ for your carrier tenant.

Azure Communications Gateway also receives two per-region subdomains of the base domain (one per region).

Each of your customers needs _customer subdomains_ of these per-region domains. Azure Communications Gateway includes one of these subdomains in the Contact header of each message it sends to the Microsoft Phone System: the presence of the subdomain allows the Microsoft Phone System to identify the customer tenant for each message. For more information, see [Identifying the customer tenant for Microsoft Phone System](#identifying-the-customer-tenant-for-microsoft-phone-system).

For each customer, you must:

1. Choose a suitable customer-specific DNS label to form the subdomains.
    - The label must be up to **nine** characters in length and can only contain letters, numbers, underscores, and dashes.
    - You must not use wildcard subdomains or subdomains with multiple labels.
    - For example, you could allocate the label `contoso`.
    > [!IMPORTANT]
    > The full customer subdomains (including the per-region domain names) must be a maximum of 48 characters. Microsoft Entra ID does not support domain names of more than 48 characters. For example, the customer subdomain `contoso1.1r1.a1b2c3d4e5f6g7h8.commsgw.azure.com` is 48 characters.
1. Configure Azure Communications Gateway with this information, as part of "account" configuration available in Azure Communications Gateway's Number Management Portal and Provisioning API.
1. Liaise with the customer to update their tenant with the appropriate subdomain, by following the [Microsoft Teams documentation for registering subdomain names in customer tenants](/microsoftteams/direct-routing-sbc-multiple-tenants#register-a-subdomain-name-in-a-customer-tenant).

As part of arranging updates to customer tenants, you must create DNS records containing a verification code (provided by Microsoft 365 when the customer updates their tenant with the domain name) on a DNS server that you control. These records allow Microsoft 365 to verify that the customer tenant is authorized to use the domain name. Azure Communications Gateway provides the DNS server that you must use. You must obtain the verification code from the customer and upload it to Azure Communications Gateway with the Number Management Portal (preview) or the Provisioning API (preview). This step allows Azure Communications Gateway to generate the DNS TXT records that verify the domain.

For instructions, see [Manage Microsoft Teams Direct Routing customers and numbers with Azure Communications Gateway](manage-enterprise-teams-direct-routing.md).

## Support for caller ID screening

Microsoft Teams Direct Routing allows a customer admin to assign any phone number to a user in their tenant, even if you don't assign that number to them in your network. This lack of validation presents a risk of caller ID spoofing.

To prevent caller ID spoofing, Azure Communications Gateway screens all Direct Routing calls originating from Microsoft Teams. This screening ensures that customers can only place calls from numbers that you assigned to them. However, you can disable this screening on a per-customer basis, as part of "account" configuration available in the Number Management Portal (preview) and the Provisioning API (preview).

The following diagram shows the call flow for an INVITE from a number that is assigned to a customer. In this case, Azure Communications Gateway's configuration for the number also includes custom header configuration, so Azure Communications Gateway adds a custom header with the contents.

:::image type="complex" source="media/interoperability-direct-routing/azure-communications-gateway-teams-direct-routing-call-screening-allowed.svg" alt-text="Call flow showing outbound call from Microsoft Teams permitted by call screening and custom header configuration.":::
    Call flow diagram showing an invite from a number assigned to a customer. Azure Communications Gateway checks its internal database to determine if the calling number is assigned to a customer. The number is assigned, so Azure Communications Gateway allows the call. The number configuration on Azure Communications Gateway includes custom header contents. Azure Communications Gateway adds the header contents as an X-MS-Operator-Content header before forwarding the call to the operator network.
:::image-end:::

> [!NOTE]
> The name of the custom header must be configured as part of [deploying Azure Communications Gateway](deploy.md#create-an-azure-communications-gateway-resource). The name is the same for all messages. In this example, the name of the custom header is `X-MS-Operator-Content`.

The following diagram shows the call flow for an INVITE from a number that isn't assigned to a customer. Azure Communications Gateway rejects the call with a 403.

:::image type="complex" source="media/interoperability-direct-routing/azure-communications-gateway-teams-direct-routing-call-screening-rejected.svg" alt-text="Call flow showing outbound call from Microsoft Teams rejected by call screening.":::
    Call flow diagram showing an invite from a number not assigned to a customer. Azure Communications Gateway checks its internal database to determine if the calling number is assigned to a customer. The number isn't assigned, so Azure Communications Gateway rejects the call with 403.
:::image-end:::

## Identifying the customer tenant for Microsoft Phone System

The Microsoft Phone System uses the domains in the Contact header of messages to identify the tenant for each message. Azure Communications Gateway automatically rewrites Contact headers on messages towards the Microsoft Phone System so that they include the appropriate per-customer domain. This process removes the need for your core network to map between numbers and per-customer domains.

You must provision Azure Communications Gateway with each number assigned to a customer for Direct Routing. This provisioning uses Azure Communications Gateway's Provisioning API (preview) or Number Management Portal (preview).

The following diagram shows how Azure Communications Gateway rewrites Contact headers on messages sent from the operator network to the Microsoft Phone System with Direct Routing.

:::image type="complex" source="media/interoperability-direct-routing/azure-communications-gateway-teams-direct-routing-subdomain-in-contact.svg" alt-text="Call flow showing customer-specific rewriting of Contact header on incoming message to Microsoft Teams.":::
    Call flow diagram showing an invite for +14255550100 sent from an operator network to Azure Communications Gateway. Azure Communications Gateway uses an internal database to find the appropriate customer subdomain for the number and updates the Contact header with the subdomain. Azure Communications Gateway then routes the invite to the Microsoft Phone System.
:::image-end:::

## SIP signaling

Azure Communications Gateway automatically interworks calls to support requirements for Direct Routing, including:

- Updating Contact headers to route messages correctly, as described in [Identifying the customer tenant for Microsoft Phone System](#identifying-the-customer-tenant-for-microsoft-phone-system).
- SIP over TLS.
- X-MS-SBC headers (describing the SBC function).
- Strict rules on a= attribute lines in SDP bodies.
- Strict rules on call transfer handling.

These features are part of Azure Communications Gateway's [compliance with Certified SBC specifications](#compliance-with-certified-sbc-specifications) for Microsoft Teams Direct Routing.

You can arrange more interworking function as part of your initial network design or at any time by raising a support request for Azure Communications Gateway. For example, you might need extra interworking configuration for:

- Advanced SIP header or SDP message manipulation.
- Support for reliable provisional messages (100rel).
- Interworking between early and late media.
- Interworking away from inband DTMF tones.
- Placing the unique tenant ID elsewhere in SIP messages to make it easier for your network to consume, for example in `tgrp` parameters.

[!INCLUDE [microsoft-phone-system-requires-e164-numbers](includes/communications-gateway-e164-for-phone-system.md)]

[!INCLUDE [communications-gateway-multitenant](includes/communications-gateway-multitenant.md)]

## RTP and SRTP media

The Microsoft Phone System typically requires SRTP for media. Azure Communications Gateway supports both RTP and SRTP, and can interwork between them. Azure Communications Gateway offers further media manipulation features to allow your networks to interoperate with the Microsoft Phone System.

### Media handling for calls

You must select the codecs that you want to support when you deploy Azure Communications Gateway.

Microsoft Teams Direct Routing requires core networks to support ringback tones (ringing tones) during call transfer. Core networks must also support comfort noise. If your core networks can't meet these requirements, Azure Communications Gateway can inject media into calls.

### Media interworking options

Azure Communications Gateway offers multiple media interworking options. For example, you might need to:

- Change handling of RTCP.
- Control bandwidth allocation.
- Prioritize specific media traffic for Quality of Service.

For full details of the media interworking features available in Azure Communications Gateway, raise a support request.

### Microsoft Phone System media bypass support (preview)

Azure Communications Gateway has Preview support for Direct Routing media bypass. Direct Routing media bypass allows media to flow directly between Azure Communications Gateway and Microsoft Teams clients in some scenarios instead of always sending it through the Microsoft Phone System. Media continues to flow through Azure, because both Azure Communications Gateway and Microsoft Phone System are located in Azure.

If you believe that media bypass support (preview) would be useful for your deployment, discuss your requirements with a Microsoft representative.

## Next steps

- Learn about [monitoring Azure Communications Gateway](monitor-azure-communications-gateway.md).
- Learn about [requesting changes to Azure Communications Gateway](request-changes.md).
