---
title: Feature-based comparison of the Azure API Management tiers | Microsoft Docs
description: Compare API Management tiers based on the features they offer. See a table that summarizes the key features available in each pricing tier.
services: api-management
documentationcenter: ''
author: vladvino

ms.service: api-management
ms.topic: article
ms.date: 04/13/2021
ms.author: apimpm
---

# Feature-based comparison of the Azure API Management tiers

Each API Management [pricing tier](https://aka.ms/apimpricing) offers a distinct set of features and per unit [capacity](api-management-capacity.md). The following table summarizes the key features available in each of the tiers. Some features might work differently or have different capabilities depending on the tier. In such cases the differences are called out in the documentation articles describing these individual features.

> [!IMPORTANT]
> Please note the Developer tier is for non-production use cases and evaluations. It does not offer SLA.

| Feature                                                                                      | Consumption | Developer | Basic | Standard | Premium |
| -------------------------------------------------------------------------------------------- | ----------- | --------- | ----- | -------- | ------- |
| Azure AD integration<sup>1</sup>                                                             | No          | Yes       | No    | Yes      | Yes     |
| Virtual Network (VNet) support                                                               | No          | Yes       | No    | No       | Yes     |
| Multi-region deployment                                                                      | No          | No        | No    | No       | Yes     |
| Availability zones                                                                           | No          | No        | No    | No       | Yes     |
| Multiple custom domain names                                                                 | No          | Yes        | No    | No       | Yes     |
| Developer portal<sup>2</sup>                                                                 | No          | Yes       | Yes   | Yes      | Yes     |
| Built-in cache                                                                               | No          | Yes       | Yes   | Yes      | Yes     |
| Built-in analytics                                                                           | No          | Yes       | Yes   | Yes      | Yes     |
| [Self-hosted gateway](self-hosted-gateway-overview.md)<sup>3</sup>                           | No          | Yes       | No    | No       | Yes     |
| [TLS settings](api-management-howto-manage-protocols-ciphers.md)                             | Yes         | Yes       | Yes   | Yes      | Yes     |
| [External cache](./api-management-howto-cache-external.md)                                                    | Yes         | Yes       | Yes   | Yes      | Yes     |
| [Client certificate authentication](api-management-howto-mutual-certificates-for-clients.md) | Yes         | Yes       | Yes   | Yes      | Yes     |
| [Backup and restore](api-management-howto-disaster-recovery-backup-restore.md)               | No          | Yes       | Yes   | Yes      | Yes     |
| [Management over Git](api-management-configuration-repository-git.md)                        | No          | Yes       | Yes   | Yes      | Yes     |
| Direct management API                                                                        | No          | Yes       | Yes   | Yes      | Yes     |
| Azure Monitor logs and metrics                                                               | No          | Yes       | Yes   | Yes      | Yes     |
| Static IP                                                                                    | No          | Yes       | Yes   | Yes      | Yes     |

<sup>1</sup> Enables the use of Azure AD (and Azure AD B2C) as an identity provider for user sign in on the developer portal.<br/>
<sup>2</sup> Including related functionality e.g. users, groups, issues, applications and email templates and notifications.<br/>
<sup>3</sup> In the Developer tier self-hosted gateways are limited to single gateway node.<br/>