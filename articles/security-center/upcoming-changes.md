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
ms.date: 10/26/2020
ms.author: memildin

---

# Important upcoming changes to Azure Security Center

> [!IMPORTANT]
> The information on this page relates to pre-release products or features, which may be substantially modified before they are commercially released, if ever. Microsoft makes no commitments or warranties, express or implied, with respect to the information provided here.

On this page, you'll learn about changes that are planned for Security Center. It describes planned modifications to the product that might impact things like your secure score or workflows.

If you're looking for the latest release notes, you'll find them in the [What's new in Azure Security Center](release-notes.md).


## Planned changes

### Recommendations related to Azure Security Benchmark to be added (preview)

| Aspect | Details |
|---------|---------|
|Announcement date | 26 October 2020  |
|Date for this change  |  November 2020 |
|Impact     | Potentially, more recommendations to review.<br>No immediate impact on secure score - Preview recommendations don't affect your secure score.<br>No immediate impact on health status of your resources - Preview recommendations don't render a resource "Unhealthy".|
|  |  |

Azure Security Benchmark is the Microsoft-authored, Azure-specific set of guidelines for security and compliance best practices based on common compliance frameworks. [Learn more about Azure Security Benchmark](../security/benchmarks/introduction.md).

The following 29 new recommendations will be added to Security Center to increase the coverage of the benchmark.

Preview recommendations don't render a resource unhealthy, and they aren't included in the calculations of your secure score. Remediate them wherever possible, so that when the preview period ends they'll contribute towards your score. Learn more about how to respond to these recommendations in [Remediate recommendations in Azure Security Center](security-center-remediate-recommendations.md).

- Azure Backup should be enabled for virtual machines
- Audit retention for SQL servers should be set to at least 90 days
- Diagnostic logs should be enabled in App Service 
- Enforce SSL connection should be enabled for MySQL database servers
- Enforce SSL connection should be enabled for PostgreSQL database servers
- FTPS should be required in your API app
- FTPS should be required in your function app
- FTPS should be required in your web app
- Geo-redundant backup should be enabled for Azure Database for MariaDB
- Geo-redundant backup should be enabled for Azure Database for MySQL
- Geo-redundant backup should be enabled for Azure Database for PostgreSQL
- Java should be updated to the latest version for your API app
- Java should be updated to the latest version for your function app
- Java should be updated to the latest version for your web app
- Managed identity should be used in your API app
- Managed identity should be used in your function app
- Managed identity should be used in your web app
- PHP should be updated to the latest version for your API app
- PHP should be updated to the latest version for your web app
- Private endpoint should be enabled for MariaDB servers
- Private endpoint should be enabled for MySQL servers
- Private endpoint should be enabled for PostgreSQL servers
- Python should be updated to the latest version for your API app
- Python should be updated to the latest version for your function app
- Python should be updated to the latest version for your web app
- TLS should be updated to the latest version for your API app
- TLS should be updated to the latest version for your function app
- TLS should be updated to the latest version for your web app
- Web apps should request an SSL certificate for all incoming requests

Related links:

- [Learn more about Azure Security Benchmark](../security/benchmarks/introduction.md)
- [Learn more about Azure API apps](../app-service/app-service-web-tutorial-rest-api.md)
- [Learn more about Azure function apps](../azure-functions/functions-overview.md)
- [Learn more about Azure web apps](../app-service/overview.md)
- [Learn more about Azure Database for MariaDB](../mariadb/overview.md)
- [Learn more about Azure Database for MySQL](../mysql/overview.md)
- [Learn more about Azure Database for PostgreSQL](../postgresql/overview.md)

## Next steps

For all recent changes to the product, see [What's new in Azure Security Center?](release-notes.md).