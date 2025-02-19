---
title: Feature-based comparison of Azure API Management tiers
description: Compare API Management tiers based on the features they offer. See a table that summarizes the key features available in each pricing tier.
services: api-management
author: dlepow

ms.service: azure-api-management
ms.topic: concept-article
ms.date: 10/15/2024
ms.author: danlep
---

# Feature-based comparison of the Azure API Management tiers

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

Each API Management [pricing tier](api-management-key-concepts.md#api-management-tiers) offers a distinct set of features to meet the needs of different customers. The following table summarizes the key features available in each of the tiers. Some features might work differently or have different capabilities depending on the tier. In such cases the differences are called out in the documentation articles describing these individual features.

> [!IMPORTANT]
> * The Developer tier is for non-production use cases and evaluations. It doesn't offer SLA.
> * The Consumption tier isn't available in the US Government cloud or the Microsoft Azure operated by 21Vianet cloud. 
> * For information about APIs supported in the API Management gateway available in different tiers, see [API Management gateways overview](api-management-gateways-overview.md#backend-apis).


| Feature                                                                                      | Consumption | Developer | Basic | Basic v2 |Standard | Standard v2 | Premium | Premium v2 (preview) |
| -------------------------------------------------------------------------------------------- | ----------- | --------- | --------- | --------- | ----- | -------- | ------- | ------- | 
| Microsoft Entra integration<sup>1</sup>                                                             | No          | Yes       | No    | Yes      | Yes      | Yes      | Yes     | Yes |
| Virtual network injection support                                                               | No          | Yes       | No    | No       | No       | No       | Yes    | Yes |
| Private endpoint support for inbound connections                                                               | No          | Yes       | Yes    | No       | Yes      | Yes (preview)       | Yes  | No   |
| Outbound virtual network integration support                                                             | No          | No       | No    | No       | No       | Yes       | No    | Yes |
| Multi-region deployment                                                                      | No          | No        | No    | No       | No       | No       | Yes     | No |
| Availability zones                                                                           | No          | No        | No    | No       | No       | No       | Yes     | No  |
| Multiple custom domain names for gateway                                                                 | No          | Yes        | No    | No      | No       | No        | Yes     | No |
| Developer portal<sup>2</sup>                                                                 | No          | Yes       | Yes   | Yes      | Yes      | Yes      | Yes     | Yes |
| Built-in cache | No      | Yes                                            | Yes          | Yes       | Yes   | Yes      | Yes     | Yes |
| [External cache](./api-management-howto-cache-external.md)                                                    | Yes         | Yes       | Yes   | Yes      | Yes      | Yes      |Yes     | Yes
| Autoscaling                                                    | No         | No       | Yes   | No      | Yes      | No      |Yes     | No |
| API analytics                                     | No          | Yes       | Yes   | Yes      | Yes      | Yes      | Yes     | Yes |
| [Self-hosted gateway](self-hosted-gateway-overview.md)<sup>3</sup>                           | No          | Yes       | No    | No       | No       | No       | Yes     | No |
| [Workspaces](workspaces-overview.md)                                                         | No          | No       | No    | No     | No     | No       | Yes     |  No |
| [TLS settings](api-management-howto-manage-protocols-ciphers.md)                             | Yes         | Yes       | Yes   | Yes      | Yes      | Yes      | Yes     | Yes |
| [Client certificate authentication](api-management-howto-mutual-certificates-for-clients.md) | Yes         | Yes       | Yes   | Yes      | Yes     | Yes      |Yes     | Yes |
| [Policies](api-management-howto-policies.md)<sup>4</sup> | Yes         | Yes       | Yes   | Yes      | Yes      | Yes      | Yes     | Yes |
| [Credential manager](credentials-overview.md)  | Yes         | Yes       | Yes   | Yes      | Yes      | Yes      | Yes     |  Yes |
| [Backup and restore](api-management-howto-disaster-recovery-backup-restore.md)               | No          | Yes       | Yes   | No          | Yes      | No          | Yes     | No |
| [Management over Git](api-management-configuration-repository-git.md)                        | No          | Yes       | Yes   |No          | Yes      | No          | Yes     | No |
| Azure Monitor metrics                                                               | Yes          | Yes       | Yes   | Yes      | Yes      | Yes      | Yes     | Yes |
| Azure Monitor and Log Analytics request logs                                                              | No          | Yes       | Yes   | Yes      | Yes      | Yes      |Yes     | Yes |
| Application Insights request logs                                                               | Yes          | Yes       | Yes   | Yes      | Yes      | Yes      |Yes     | Yes |
| Static IP                                                                                    | No          | Yes       | Yes   | No          |Yes      | No          | Yes     | No |

<sup>1</sup> Enables the use of Microsoft Entra ID (and Azure AD B2C) as an identity provider for user sign in on the developer portal.<br/>
<sup>2</sup> Including related functionality such as users, groups, issues, applications, and email templates and notifications.<br/>
<sup>3</sup> See [Gateway overview](api-management-gateways-overview.md#feature-comparison-managed-versus-self-hosted-gateways) for a feature comparison of managed versus self-hosted gateways. In the Developer tier, self-hosted gateways are limited to a single gateway node. <br/>
<sup>4</sup> See [Gateway overview](api-management-gateways-overview.md#policies) for differences in policy support in the classic, v2, consumption, and self-hosted gateways. <br/>

## Related content

* [Overview of Azure API Management](api-management-key-concepts.md)
* [API Management limits](/azure/azure-resource-manager/management/azure-subscription-service-limits?toc=/azure/api-management/toc.json&bc=/azure/api-management/breadcrumb/toc.json#api-management-limits)
* [V2 tiers overview](v2-service-tiers-overview.md)
* [API Management pricing](https://azure.microsoft.com/pricing/details/api-management/)
