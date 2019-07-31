---
title: Feature-based comparison of the Azure API Management tiers | Microsoft Docs
description: This article compares API Management tiers based on the features they offer.
services: api-management
documentationcenter: ''
author: vladvino
manager: erikre
editor: ''

ms.service: api-management
ms.workload: mobile
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 11/26/2018
ms.author: apimpm
---

# Feature-based comparison of the Azure API Management tiers

Each API Management [pricing tier](https://aka.ms/apimpricing) offers a distinct set of features and per unit [capacity](api-management-capacity.md). The following table summarizes the key features available in each of the tiers. Some features might work differently or have different capabilities depending on the tier. In such cases the differences are called out in the documentation articles describing these individual features.

| Feature                                                                                      | Consumption | Developer      | Basic          | Standard       | Premium        |
| -------------------------------------------------------------------------------------------- | ----------------------------- | -------------- | -------------- | -------------- | -------------- |
| Azure AD integration<sup>1</sup>                                                             | No                            | Yes            | No             | Yes            | Yes            |
| Virtual Network (VNet) support                                                               | No                            | Yes            | No             | No             | Yes            |
| Multi-region deployment                                                                      | No                            | No             | No             | No             | Yes            |
| Multiple custom domain names                                                                 | No                            | No             | No             | No             | Yes            |
| Developer portal<sup>2</sup>                                                                 | No                            | Yes            | Yes            | Yes            | Yes            |
| Built-in cache                                                                               | No                            | Yes            | Yes            | Yes            | Yes            |
| Built-in analytics                                                                           | No                            | Yes            | Yes            | Yes            | Yes            |
| [SSL settings](api-management-howto-manage-protocols-ciphers.md)                             | Yes                            | Yes            | Yes            | Yes            | Yes            |
| [External cache](https://aka.ms/apimbyoc)                                                    | Yes                           | Yes            | Yes            | Yes            | Yes            |
| [Client certificate authentication](api-management-howto-mutual-certificates-for-clients.md) | Yes                | Yes            | Yes            | Yes            | Yes            |
| [Backup and restore](api-management-howto-disaster-recovery-backup-restore.md)               | No                            | Yes            | Yes            | Yes            | Yes            |
| [Management over Git](api-management-configuration-repository-git.md)                        | No                            | Yes            | Yes            | Yes            | Yes            |
| Direct management API                                                                        | No                            | Yes            | Yes            | Yes            | Yes            |
| Azure Monitor logs and metrics                                                               | No                | Yes            | Yes            | Yes            | Yes            |
| Static IP                                                               | No                | Yes            | Yes            | Yes            | Yes            |

<sup>1</sup> Enables the use of Azure AD (and Azure AD B2C) as an identity provider for user sign in on the developer portal.<br/>
<sup>2</sup> Including related functionality e.g. users, groups, issues, applications and email templates and notifications.<br/>
