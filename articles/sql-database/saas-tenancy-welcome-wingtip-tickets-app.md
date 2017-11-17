---
title: "Welcome to Wingtips app - Azure SQL Database | Microsoft Docs"
description: "Learn about database tenancy models, and about the sample Wingtips SaaS application, for Azure SQL Database in the cloud environment."
keywords: "sql database tutorial"
services: "sql-database"
documentationcenter: ""
author: "billgib"
manager: "craigg"
editor: "MightyPen"

ms.service: "sql-database"
ms.custom: "scale out apps"
ms.workload: "Active"
ms.tgt_pltfrm: "na"
ms.devlang: "na"
ms.topic: "article"
ms.date: "11/17/2017"
ms.author: "billgib"
---
# The Wingtip Tickets SaaS application

The same *Wingtip Tickets* application is implemented in each sample. The app is a simple event listing and ticketing SaaS app targeting small venues - theaters, clubs, etc. Each venue is a tenant of the app, and has their own data: venue details, lists of events, customers, ticket orders, etc.  The app, together with the management scripts and tutorials, showcases an end-to-end SaaS scenario. This includes provisioning tenants, monitoring and managing performance, schema management, and cross-tenant reporting and analytics.

## Three SaaS application patterns

Three vesions of the app are available; each explores a different database tenancy pattern on SQL Database.  The first uses a single-tenant application with an isolated single-tenant database. The second uses a multi-tenant app, with a database per tenant. The third sample uses a multi-tenant app with sharded multi-tenant databases.

![Three tenancy patterns][image-three-tenancy-patterns]

 Each sample includes management scripts and tutorials that explore a range of design and management patterns you can use in your own application.  Each sample deploys in less that five minutes.  All three can be deployed side-by-side so you can compare the differences in design and management. 

## Standalone application pattern

Uses a single tenant application with a single tenant database for each tenant. Each tenant’s app is deployed into a separate Azure resource group. This could be in the service provider’s subscription or the tenant’s subscription and managed by the provider on the tenant’s behalf. This pattern provides the greatest tenant isolation, but it is typically the most expensive as there is no opportunity to share resources across multiple tenants.

Check out the [tutorials](https://aka.ms/wingtipticketssaas-sa) and code on GitHub  [.../Microsoft/WingtipTicketsSaaS-StandaloneApp](http://github.com/Microsoft/WingtipTicketsSaaS-StandaloneApp).

## Database-per-tenant pattern

This pattern is effective for service providers that are concerned with tenant isolation and want to run a centralized service that allows cost-efficient use of shared resources. A database is created for each venue, or tenant, and all the databases are centrally managed. Databases can be hosted in elastic pools to provide cost-efficient and easy performance management, which leverages the unpredictable workload patterns of the tenants. A catalog database holds the mapping between tenants and their databases. This mapping is managed using the shard map management features of the Elastic Database Client Library, which  provides efficient connection management to the application.

Check out the [tutorials](https://aka.ms/wingtipticketssaas-dpt) and code  on GitHub  [.../Microsoft/WingtipTicketsSaaS-DbPerTenant](http://github.com/Microsoft/WingtipTicketsSaaS-DbPerTenant).

## Sharded multi-tenant database pattern

Multi-tenant databases are effective for service providers looking for lower cost per tenant and okay with reduced tenant isolation. This model allows packing large numbers of tenants into a single database, driving the cost-per-tenant down. Near infinite scale is possible by sharding the tenants across multiple database.  A catalog database again maps tenants to databases.  

This pattern also allows a hybrid model in which you can optimize for cost with multiple tenants in a database, or optimize for isolation with a single tenant in their own database. The choice can be made on a tenant-by-tenant basis, either when the tenant is provisioned or later, with no impact on the application.

Check out the [tutorials](https://aka.ms/wingtipticketssaas-mt) and code  on GitHub  [.../Microsoft/WingtipTicketsSaaS-MultiTenantDb](http://github.com/Microsoft/WingtipTicketsSaaS-MultiTenantDb).



<!-- Image references. -->

[image-three-tenancy-patterns]: media/saas-tenancy-welcome-wingtip-tickets-app/three-tenancy-patterns.png "Three tenancy patterns."

