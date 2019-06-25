---
title: "Welcome to Wingtips app - Azure SQL Database | Microsoft Docs"
description: "Learn about database tenancy models, and about the sample Wingtips SaaS application, for Azure SQL Database in the cloud environment."
keywords: "sql database tutorial"
services: sql-database
ms.service: sql-database
ms.subservice: scenario
ms.custom: 
ms.devlang: 
ms.topic: conceptual
author: stevestein
ms.author: sstein
ms.reviewer: billgib
manager: craigg
ms.date: 01/25/2019
---
# The Wingtip Tickets SaaS application

The same *Wingtip Tickets* SaaS application is implemented in each of three samples. The app is a simple event listing and ticketing SaaS app targeting small venues - theaters, clubs, etc. Each venue is a tenant of the app, and has its own data: venue details, lists of events, customers, ticket orders, etc.  The app, together with the management scripts and tutorials, showcases an end-to-end SaaS scenario. This includes provisioning tenants, monitoring and managing performance, schema management, and cross-tenant reporting and analytics.

## Three SaaS application and tenancy patterns

Three versions of the app are available; each explores a different database tenancy pattern on Azure SQL Database.  The first uses a standalone application per tenant with its own database. The second uses a multi-tenant app with a database per tenant. The third sample uses a multi-tenant app with sharded multi-tenant databases.

![Three tenancy patterns][image-three-tenancy-patterns]

 Each sample includes the application code, plus management scripts and tutorials that explore a range of design and management patterns.  Each sample deploys in less that five minutes.  All three can be deployed side-by-side so you can compare the differences in design and management.

## Standalone application per tenant pattern

The standalone app per tenant pattern uses a single tenant application with a database for each tenant. Each tenant’s app, including its database, is deployed into a separate Azure resource group. The resource group can be deployed in the service provider’s subscription or the tenant’s subscription and managed by the provider on the tenant’s behalf. The standalone app per tenant pattern provides the greatest tenant isolation, but is typically the most expensive as there's no opportunity to share resources between multiple tenants.  This pattern is well suited to applications that might be more complex and which are deployed to smaller numbers of tenants.  With standalone deployments, the app can be customized for each tenant more easily than in other patterns.  

Check out the [tutorials][docs-tutorials-for-wingtip-sa] and code on GitHub  [.../Microsoft/WingtipTicketsSaaS-StandaloneApp][github-code-for-wingtip-sa].

## Database per tenant pattern

The database per tenant pattern is effective for service providers that are concerned with tenant isolation and want to run a centralized service that allows cost-efficient use of shared resources. A database is created for each venue, or tenant, and all the databases are centrally managed. Databases can be hosted in elastic pools to provide cost-efficient and easy performance management, which leverages the unpredictable workload patterns of the tenants. A catalog database holds the mapping between tenants and their databases. This mapping is managed using the shard map management features of the [Elastic Database Client Library](sql-database-elastic-database-client-library.md), which  provides efficient connection management to the application.

Check out the [tutorials][docs-tutorials-for-wingtip-dpt] and code on GitHub  [.../Microsoft/WingtipTicketsSaaS-DbPerTenant][github-code-for-wingtip-dpt].

## Sharded multi-tenant database pattern

Multi-tenant databases are effective for service providers looking for lower cost per tenant and okay with reduced tenant isolation. This pattern allows packing large numbers of tenants into an individual database, driving the cost-per-tenant down. Near infinite scale is possible by sharding the tenants across multiple databases. A catalog database maps tenants to databases.  

This pattern also allows a *hybrid* model in which you can optimize for cost with multiple tenants in a database, or optimize for isolation with a single tenant in their own database. The choice can be made on a tenant-by-tenant basis, either when the tenant is provisioned or later, with no impact on the application.  This model can be used effectively when groups of tenants need to be treated differently. For example, low-cost tenants can be assigned to shared databases, while premium tenants can be assigned to their own databases. 

Check out the [tutorials][docs-tutorials-for-wingtip-mt] and code on GitHub  [.../Microsoft/WingtipTicketsSaaS-MultiTenantDb][github-code-for-wingtip-mt].

## Next steps

#### Conceptual descriptions

- A more detailed explanation of the application tenancy patterns is available at [Multi-tenant SaaS database tenancy patterns][saas-tenancy-app-design-patterns-md]

#### Tutorials and code

- Standalone app per tenant:
    - [Tutorials for standalone app][docs-tutorials-for-wingtip-sa].
    - [Code for standalone app, on GitHub][github-code-for-wingtip-sa].

- Database per tenant:
    - [Tutorials for database per tenant][docs-tutorials-for-wingtip-dpt].
    - [Code for database per tenant, on GitHub][github-code-for-wingtip-dpt].

- Sharded multi-tenant:
    - [Tutorials for sharded multi-tenant][docs-tutorials-for-wingtip-mt].
    - [Code for sharded multi-tenant, on GitHub][github-code-for-wingtip-mt].



<!-- Image references. -->

[image-three-tenancy-patterns]: media/saas-tenancy-welcome-wingtip-tickets-app/three-tenancy-patterns.png "Three tenancy patterns."

<!-- Docs.ms.com references. -->

[saas-tenancy-app-design-patterns-md]: saas-tenancy-app-design-patterns.md

<!-- WWWeb http references. -->

[docs-tutorials-for-wingtip-sa]: https://aka.ms/wingtipticketssaas-sa
[github-code-for-wingtip-sa]: https://github.com/Microsoft/WingtipTicketsSaaS-StandaloneApp

[docs-tutorials-for-wingtip-dpt]: https://aka.ms/wingtipticketssaas-dpt
[github-code-for-wingtip-dpt]: https://github.com/Microsoft/WingtipTicketsSaaS-DbPerTenant

[docs-tutorials-for-wingtip-mt]: https://aka.ms/wingtipticketssaas-mt
[github-code-for-wingtip-mt]: https://github.com/Microsoft/WingtipTicketsSaaS-MultiTenantDb

