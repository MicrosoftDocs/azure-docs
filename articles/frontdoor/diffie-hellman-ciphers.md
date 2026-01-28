---
title: DHE ciphers
titleSuffix: Azure Front Door
description: Learn about how to stop using DHE ciphers on Azure Front Door and CDN
author: halkazwini
ms.author: halkazwini
ms.service: azure-frontdoor
ms.topic: concept-article
ms.date: 01/26/2025
---

# TLS_DHE cipher suites on Azure Front Door and Azure CDN

**Applies to:** :heavy_check_mark: Front Door Standard/Premium :heavy_check_mark: Front Door (classic) :heavy_check_mark: CDN Standard from Microsoft (classic)

On April 1, 2026, Azure Front Door (Standard, Premium, and classic) and Azure CDN from Microsoft (classic) services will stop negotiating the following weak DHE cipher suites for both client to service and service to origin TLS connections:
* TLS_DHE_RSA_WITH_AES_256_GCM_SHA384
* TLS_DHE_RSA_WITH_AES_128_GCM_SHA256

## Who is affected?

You're affected if any of the following are true:
* Your clients (browsers/agents/devices) must require one of the DHE cipher suites when connecting to your Front Door/CDN endpoint.
* Your origins must require one of the retired DHE cipher suites when Front Door/ CDN connects to your origin.

## How will I know if I'm impacted?
* Impacted subscriptions and resources will receive Azure service health notification and email notifications.
* The impacted connection leg ('client to service' or 'service to origin' or both) will be mentioned in the notification.

## What is the impact if I don't act?
* Connections that can only use the retired DHE ciphers will fail the TLS handshake (for clients) or fail on service to origin negotiation (for origins). 
* Typical symptoms include handshake failure / no shared cipher errors / invalid cipher error in clients or origin server logs.

## Action required
1.	Ensure your origin servers disable DHE ciphers and enable the recommended cipher suites.
3.	Inform your clients to disable DHE ciphers and enable the recommended cipher suites.

## Recommended cipher suites
For best compatibility and security on Azure Front Door / Azure CDN endpoints and origins, we recommend using the following cipher suites:
* TLS_AES_256_GCM_SHA384 (TLS 1.3 only)
* TLS_AES_128_GCM_SHA256 (TLS 1.3 only)
* TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384
* TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256
* TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384
* TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256

## Updating cipher suites for common origin types

| Service |	Configuration Method |
| -- | -- |
| Azure App Service | 	[Use TLS/SSL settings to set a "Minimum TLS Version" or use ARM templates for fine-grained cipher control.](../app-service/configure-ssl-bindings.md) |
| Azure Application Gateway | 	[Create a SSL Policy (Predefined or Custom) to select specific cipher suites.](../application-gateway/application-gateway-ssl-policy-overview.md) |
| Azure API Management | 	[Modify the Service Instance Settings to disable specific ciphers via the "Protocols and Ciphers" blade.](../api-management/api-management-howto-manage-protocols-ciphers.md)	|


## Frequently asked questions
- Does this affect both client and origin connections?
    
    Yes. The retirement applies to both the client to service and service to origin legs. Update both sides to avoid issues.

- What if I still need legacy client compatibility?
    
    The chances of a modern client or server requiring TLS_DHE ciphers as a "must-have" are extremely low as in most places these ciphers have been replaced with the more secure TLS_ECDHE ciphers. Inform your legacy clients to support TLS 1.2/1.3 with ECDHE. If you operate controlled clients, update their TLS policy. 

- Should I make any changes to my Front Door or CDN profiles?
    
    As an optional measure, for Front Door Standard/Premium profiles, you can also use the [Configure Azure Front Door TLS policy](/azure/frontdoor/standard-premium/tls-policy) feature to disable the DHE ciphers in advance before 1 April 2026. This option isn't available for other tiers.

    For all Front Door (Standard, Premium, classic) and Azure CDN from Microsoft (classic) profiles, Microsoft team will disable the DHE ciphers after 1 April 2026.

