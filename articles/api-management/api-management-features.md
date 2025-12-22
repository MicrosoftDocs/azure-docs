---
title: Feature-based comparison of Azure API Management tiers
description: Compare API Management tiers based on the features they offer. See a table that summarizes the key features available in each pricing tier.
services: api-management
author: dlepow

ms.service: azure-api-management
ms.topic: concept-article
ms.date: 11/11/2025
ms.author: danlep
ms.custom:
  - build-2025
---

# Feature-based comparison of the Azure API Management tiers

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

Each API Management [pricing tier](api-management-key-concepts.md#api-management-tiers) offers a distinct set of features to meet the needs of different customers. The following table summarizes the key features available in each of the tiers. Some features might work differently or have different capabilities depending on the tier. In such cases the differences are called out in the documentation articles describing these individual features.

> [!IMPORTANT]
> * The Developer tier is for non-production use cases and evaluations. It doesn't offer SLA.
> * The Consumption tier isn't available in the US Government cloud or the Microsoft Azure operated by 21Vianet cloud. 
> * For information about APIs supported in the API Management gateway available in different tiers, see [API Management gateways overview](api-management-gateways-overview.md#backend-apis).
> * For information about resource limits in different tiers, see [API Management limits](/azure/azure-resource-manager/management/azure-subscription-service-limits?toc=/azure/api-management/toc.json&bc=/azure/api-management/breadcrumb/toc.json#api-management-limits).


| Feature                                                                                      | Consumption | Developer | Basic | Basic v2 |Standard | Standard v2 | Premium | Premium v2 |
| -------------------------------------------------------------------------------------------- | ----------- | --------- | --------- | --------- | ----- | -------- | ------- | ------- | 
| Microsoft Entra integration<sup>1</sup>                                                             | ❌          | ✔️       | ❌    | ✔️      | ✔️      | ✔️      | ✔️     | ✔️ |
| Virtual network injection support                                                               | ❌          | ✔️       | ❌    | ❌       | ❌       | ❌       | ✔️    | ✔️ |
| Private endpoint support for inbound connections                                                               | ❌          | ✔️       | ✔️    | ❌       | ✔️      | ✔️     | ✔️  | ✔️   |
| Outbound virtual network integration support                                                             | ❌          | ❌       | ❌    | ❌       | ❌       | ✔️       | ❌    | ✔️ |
| Multi-region deployment                                                                      | ❌          | ❌        | ❌    | ❌       | ❌       | ❌       | ✔️     | ❌ |
| Availability zones                                                                           | ❌          | ❌        | ❌    | ❌       | ❌       | ❌       | ✔️     | ✔️  |
| Multiple custom domain names for gateway                                                                 | ❌          | ✔️        | ❌    | ❌      | ❌       | ❌        | ✔️     | ❌ |
| Developer portal<sup>2</sup>                                                                 | ❌          | ✔️       | ✔️   | ✔️      | ✔️      | ✔️      | ✔️     | ✔️ |
| Built-in cache | ❌      | ✔️                                            | ✔️          | ✔️       | ✔️   | ✔️      | ✔️     | ✔️ |
| [External cache](./api-management-howto-cache-external.md)                                                    | ✔️         | ✔️       | ✔️   | ✔️      | ✔️      | ✔️      |✔️     | ✔️
| Autoscaling                                                    | ❌         | ❌       | ✔️   | ✔️      | ✔️      | ✔️      |✔️     | ✔️ |
| API analytics                                     | ❌          | ✔️       | ✔️   | ✔️      | ✔️      | ✔️      | ✔️     | ✔️ |
| [Self-hosted gateway](self-hosted-gateway-overview.md)<sup>3</sup>                           | ❌          | ✔️       | ❌    | ❌       | ❌       | ❌       | ✔️     | ❌ |
| [Workspaces](workspaces-overview.md)                                                         | ❌          | ❌       | ❌    | ❌     | ❌     | ❌       | ✔️     |  ✔️ |
| [TLS settings](api-management-howto-manage-protocols-ciphers.md)                             | ✔️         | ✔️       | ✔️   | ✔️      | ✔️      | ✔️      | ✔️     | ✔️ |
| [Client certificate authentication](api-management-howto-mutual-certificates-for-clients.md) | ✔️         | ✔️       | ✔️   | ✔️      | ✔️     | ✔️      |✔️     | ✔️ |
| [Policies](api-management-howto-policies.md)<sup>4</sup> | ✔️         | ✔️       | ✔️   | ✔️      | ✔️      | ✔️      | ✔️     | ✔️ |
| [Credential manager](credentials-overview.md)  | ✔️         | ✔️       | ✔️   | ✔️      | ✔️      | ✔️      | ✔️     |  ✔️ |
| [Backup and restore](api-management-howto-disaster-recovery-backup-restore.md)               | ❌          | ✔️       | ✔️   | ❌          | ✔️      | ❌          | ✔️     | ❌ |
| Azure Monitor metrics                                                               | ✔️          | ✔️       | ✔️   | ✔️      | ✔️      | ✔️      | ✔️     | ✔️ |
| Azure Monitor and Log Analytics request logs                                                              | ❌          | ✔️       | ✔️   | ✔️      | ✔️      | ✔️      |✔️     | ✔️ |
| Application Insights request logs                                                               | ✔️          | ✔️       | ✔️   | ✔️      | ✔️      | ✔️      |✔️     | ✔️ |
| Static IP                                                                                    | ❌          | ✔️       | ✔️   | ❌          |✔️      | ❌          | ✔️     | ❌ |
| Export API to Power Platform                                                         | ✔️          | ✔️       | ✔️    | ✔️       | ✔️       | ✔️       | ✔️     | ✔️ |
| Export API to Postman                                                         | ✔️          | ✔️       | ✔️    | ✔️       | ✔️       | ✔️       | ✔️     | ✔️ |



<sup>1</sup> Enables the use of Microsoft Entra ID (and Azure AD B2C or [Microsoft Entra External ID](/entra/external-id/customers/overview-customers-ciam)) as an identity provider for user sign in on the developer portal.<br/>
<sup>2</sup> Including related functionality such as users, groups, issues, applications, and email templates and notifications.<br/>
<sup>3</sup> See [Gateway overview](api-management-gateways-overview.md#feature-comparison-managed-versus-self-hosted-gateways) for a feature comparison of managed versus self-hosted gateways. In the Developer tier, self-hosted gateways are limited to a single gateway node. <br/>
<sup>4</sup> See [Gateway overview](api-management-gateways-overview.md#policies) for differences in policy support in the classic, v2, consumption, workspace, and self-hosted gateways. <br/>

## Related content

* [Overview of Azure API Management](api-management-key-concepts.md)
* [Understanding API Management limits](service-limits.md)
* [V2 tiers overview](v2-service-tiers-overview.md)
* [API Management pricing](https://azure.microsoft.com/pricing/details/api-management/)
