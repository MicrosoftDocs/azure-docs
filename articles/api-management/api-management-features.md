---
title: Feature-based comparison of the Azure API Management tiers | Microsoft Docs
description: Compare API Management tiers based on the features they offer. See a table that summarizes the key features available in each pricing tier.
services: api-management
documentationcenter: ''
author: dlepow

ms.service: api-management
ms.topic: article
ms.date: 06/27/2023
ms.author: danlep
---

# Feature-based comparison of the Azure API Management tiers

Each API Management [pricing tier](https://aka.ms/apimpricing) offers a distinct set of features and per unit [capacity](api-management-capacity.md). The following table summarizes the key features available in each of the tiers. Some features might work differently or have different capabilities depending on the tier. In such cases the differences are called out in the documentation articles describing these individual features.

> [!IMPORTANT]
> * The Developer tier is for non-production use cases and evaluations. It doesn't offer SLA.
> * The Consumption tier isn't available in the US Government cloud or the Microsoft Azure operated by 21Vianet cloud.  
> * API Management **v2 tiers** are now in preview, with updated feature availability. [Learn more](v2-service-tiers-overview.md).


| Feature                                                                                      | Consumption | Developer | Basic | Standard | Premium |
| -------------------------------------------------------------------------------------------- | ----------- | --------- | ----- | -------- | ------- |
| Microsoft Entra integration<sup>1</sup>                                                             | No          | Yes       | No    | Yes      | Yes     |
| Virtual Network (VNet) support                                                               | No          | Yes       | No    | No       | Yes     |
| Private endpoint support for inbound connections                                                               | No          | Yes       | Yes    | Yes       | Yes     |
| Multi-region deployment                                                                      | No          | No        | No    | No       | Yes     |
| Availability zones                                                                           | No          | No        | No    | No       | Yes     |
| Multiple custom domain names                                                                 | No          | Yes        | No    | No       | Yes     |
| Developer portal<sup>2</sup>                                                                 | No          | Yes       | Yes   | Yes      | Yes     |
| Built-in cache                                                                               | No          | Yes       | Yes   | Yes      | Yes     |
| Built-in analytics                                                                           | No          | Yes       | Yes   | Yes      | Yes     |
| [Self-hosted gateway](self-hosted-gateway-overview.md)<sup>3</sup>                           | No          | Yes       | No    | No       | Yes     |
| [Workspaces](workspaces-overview.md)                                                         | No          | Yes       | No    | Yes      | Yes     |
| [TLS settings](api-management-howto-manage-protocols-ciphers.md)                             | Yes         | Yes       | Yes   | Yes      | Yes     |
| [External cache](./api-management-howto-cache-external.md)                                                    | Yes         | Yes       | Yes   | Yes      | Yes     |
| [Client certificate authentication](api-management-howto-mutual-certificates-for-clients.md) | Yes         | Yes       | Yes   | Yes      | Yes     |
| [Policies](api-management-howto-policies.md)<sup>4</sup> | Yes         | Yes       | Yes   | Yes      | Yes     |
| [API authorizations](authorizations-overview.md)  | Yes         | Yes       | Yes   | Yes      | Yes     | 
| [Backup and restore](api-management-howto-disaster-recovery-backup-restore.md)               | No          | Yes       | Yes   | Yes      | Yes     |
| [Management over Git](api-management-configuration-repository-git.md)                        | No          | Yes       | Yes   | Yes      | Yes     |
| Direct management API                                                                        | No          | Yes       | Yes   | Yes      | Yes     |
| Azure Monitor metrics                                                               | Yes          | Yes       | Yes   | Yes      | Yes     |
| Azure Monitor and Log Analytics request logs                                                              | No          | Yes       | Yes   | Yes      | Yes     |
| Application Insights request logs                                                               | Yes          | Yes       | Yes   | Yes      | Yes     |
| Static IP                                                                                    | No          | Yes       | Yes   | Yes      | Yes     |
| [Pass-through WebSocket APIs](websocket-api.md)                                                                                    | No          | Yes       | Yes   | Yes      | Yes     |
| [Pass-through GraphQL APIs](graphql-apis-overview.md)                                                                               | Yes          | Yes       | Yes   | Yes      | Yes     |
| [Synthetic GraphQL APIs](graphql-apis-overview.md)                                            | Yes           | Yes       | Yes   | Yes      | Yes     |

<sup>1</sup> Enables the use of Microsoft Entra ID (and Azure AD B2C) as an identity provider for user sign in on the developer portal.<br/>
<sup>2</sup> Including related functionality such as users, groups, issues, applications, and email templates and notifications.<br/>
<sup>3</sup> See [Gateway overview](api-management-gateways-overview.md#feature-comparison-managed-versus-self-hosted-gateways) for a feature comparison of managed versus self-hosted gateways. In the Developer tier self-hosted gateways are limited to a single gateway node. <br/>
<sup>4</sup> See [Gateway overview](api-management-gateways-overview.md#policies) for differences in policy support in the dedicated, consumption, and self-hosted gateways. <br/>
