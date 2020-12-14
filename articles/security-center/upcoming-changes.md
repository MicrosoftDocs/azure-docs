---
title: Important changes coming to Azure Security Center
description: Upcoming changes to Azure Security Center that you might need to be aware of and for which you might need to plan 
services: security-center
documentationcenter: na
author: memildin
manager: rkarlin
ms.service: security-center
ms.devlang: na
ms.topic: overview
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 12/14/2020
ms.author: memildin

---

# Important upcoming changes to Azure Security Center

> [!IMPORTANT]
> The information on this page relates to pre-release products or features, which may be substantially modified before they are commercially released, if ever. Microsoft makes no commitments or warranties, express or implied, with respect to the information provided here.

On this page, you'll learn about changes that are planned for Security Center. It describes planned modifications to the product that might impact things like your secure score or workflows.

If you're looking for the latest release notes, you'll find them in the [What's new in Azure Security Center](release-notes.md).


## Planned changes

- ["Not applicable" resources to be reported as "Compliant" in Azure Policy assessments](#not-applicable-resources-to-be-reported-as-compliant-in-azure-policy-assessments)
- [35 preview recommendations added to increase coverage of Azure Security Benchmark](#35-preview-recommendations-added-to-increase-coverage-of-azure-security-benchmark)

### "Not applicable" resources to be reported as "Compliant" in Azure Policy assessments

**Estimated date for change:** January 2021

Currently, resources that are evaluated for a recommendation and found to be **not applicable** appear in Azure Policy as "Non-compliant". No user actions can change their state to "Compliant". From this planned change, they'll be reported as "Compliant" for improved clarity.


### 35 preview recommendations added to increase coverage of Azure Security Benchmark

**Estimated date for change:** December 2020

Azure Security Benchmark is the Microsoft-authored, Azure-specific set of guidelines for security and compliance best practices based on common compliance frameworks. [Learn more about Azure Security Benchmark](../security/benchmarks/introduction.md).

The following 35 preview recommendations have been added to Security Center to increase the coverage of this benchmark.

Preview recommendations don't render a resource unhealthy, and they aren't included in the calculations of your secure score. Remediate them wherever possible, so that when the preview period ends they'll contribute towards your score. Learn more about how to respond to these recommendations in [Remediate recommendations in Azure Security Center](security-center-remediate-recommendations.md).

| Security control                     | New recommendations                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
|--------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Enable encryption at rest            | - Azure Cosmos DB accounts should use customer-managed keys to encrypt data at rest<br>- Azure Machine Learning workspaces should be encrypted with a customer-managed key (CMK)<br>- Bring your own key data protection should be enabled for MySQL servers<br>- Bring your own key data protection should be enabled for PostgreSQL servers<br>- Cognitive Services accounts should enable data encryption with a customer-managed key (CMK)<br>- Container registries should be encrypted with a customer-managed key (CMK)<br>- SQL managed instances should use customer-managed keys to encrypt data at rest<br>- SQL servers should use customer-managed keys to encrypt data at rest<br>- Storage accounts should use customer-managed key (CMK) for encryption                                                                                                                                                              |
| Implement security best practices    | - Subscriptions should have a contact email address for security issues<br> - Auto provisioning of the Log Analytics agent should be enabled on your subscription<br> - Email notification for high severity alerts should be enabled<br> - Email notification to subscription owner for high severity alerts should be enabled<br> - Key vaults should have purge protection enabled<br> - Key vaults should have soft delete enabled |
| Manage access and permissions        | - Function apps should have 'Client Certificates (Incoming client certificates)' enabled |
| Protect applications against DDoS attacks | - Web Application Firewall (WAF) should be enabled for Application Gateway<br> - Web Application Firewall (WAF) should be enabled for Azure Front Door Service service |
| Restrict unauthorized network access | - Firewall should be enabled on Key Vault<br> - Private endpoint should be configured for Key Vault<br> - App Configuration should use private link<br> - Azure Cache for Redis should reside within a virtual network<br> - Azure Event Grid domains should use private link<br> - Azure Event Grid topics should use private link<br> - Azure Machine Learning workspaces should use private link<br> - Azure SignalR Service should use private link<br> - Azure Spring Cloud should use network injection<br> - Container registries should not allow unrestricted network access<br> - Container registries should use private link<br> - Public network access should be disabled for MariaDB servers<br> - Public network access should be disabled for MySQL servers<br> - Public network access should be disabled for PostgreSQL servers<br> - Storage account should use a private link connection<br> - Storage accounts should restrict network access using virtual network rules<br> - VM Image Builder templates should use private link|
|                                      |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |

Related links:

- [Learn more about Azure Security Benchmark](../security/benchmarks/introduction.md)
- [Learn more about Azure Database for MariaDB](../mariadb/overview.md)
- [Learn more about Azure Database for MySQL](../mysql/overview.md)
- [Learn more about Azure Database for PostgreSQL](../postgresql/overview.md)





## Next steps

For all recent changes to the product, see [What's new in Azure Security Center?](release-notes.md).