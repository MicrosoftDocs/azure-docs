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
ms.date: "11/12/2017"
ms.author: "billgib;genemi"
---
# Welcome to the Wingtip Tickets sample SaaS Azure SQL Database tenancy app

Welcome to the Wingtip Tickets sample SaaS Azure SQL Database tenancy application, and its tutorials. Database tenancy refers to the data isolation mode that your app provides to your clients who pay to be hosted in your application. To over simplify for the moment, either each client has a whole database to itself, or it shares a database with other client.

## Wingtip Tickets app

The Wingtip Tickets sample application illustrates the effects of different database tenancy models on the design and management of multi-tenant SaaS applications. The accompanying tutorials directly describe those same effects. Wingtip Tickets is built on Azure SQL Database.

Wingtip Tickets is designed to handle various design and management scenarios that are used by actual SaaS clients. The patterns of use that emerged are accounted for in Wingtip Tickets.

You can install the Wingtip Tickets app in your own Azure subscription in five minutes. The installation includes the insertion of sample data for several tenants. You can safely install the application and management scripts for all the models, because the installations do not interact or interfere with each other.

#### Code in Github

Application code, and the management scripts, are all available on GitHub:

- **Standalone app** model: *(Coming within days.)*
- **Database per tenant** model: [WingtipSaaS repository](https://github.com/Microsoft/WingtipSaaS/).
- **Sharded multi-tenant** model, the *hybrid*: *(Coming within days.)*

The same one code base for the Wingtip Tickets app is reused for all of the preceding models listed. You can use the code from Github to start your own SaaS projects.



## Major database tenancy models

Wingtip Tickets is an event listing and ticketing SaaS application. Wingtip provides services that are needed by venues. All the following items apply to each venue:

- Pays you to be hosted in your application.
- Is a *tenant* in Wingtip.
- Hosts events. The following events are involved:
    - Ticket prices.
    - Ticket sales.
    - Customers who buy tickets.

The app, together with the management scripts and tutorials, showcases a complete SaaS scenario. The scenario includes the following activities:

- Provisioning of tenants.
- Monitoring and managing performance.
- Schema management.
- Cross-tenant reporting and analytics.

All those activities are provided at whatever scale is needed.



## Code samples for each tenancy model

A set of application models are emphasized. However, other implementations could mix elements of two or more models.

#### Standalone app model

![Standalone app model][standalone-app-model-62s]

This model uses a single-tenant application. Therefore, this model needs only one database, and it stores data for only the one tenant. The tenant enjoys complete isolation from other tenants in the database.

You might use this model when you sell instances of your app to many different clients, for each client to run on its own. The client is then the only tenant. While the database stores data for only one client, the database stores data for many customers of the client.

- *(Tutorials for this model will be published here within a few days. A link will be here.)*

#### Database per tenant

![Database per tenant model][database-per-tenant-model-35d]

This model has multiple tenants in the instance of the application. Yet for each new tenant, another database is allocated for use just by the new tenant.

This model provides full database isolation for each tenant. The Azure SQL Database service has the sophistication to make this model plausible.

- [Introduction to a SQL Database multi-tenant SaaS app example][saas-dbpertenant-wingtip-app-overview-15d] - has more information about this model.

#### Sharded multi-tenant databases, the hybrid

![Sharded multi-tenant database model, the hybrid][sharded-multitenantdb-model-hybrid-79m]

This model has multiple tenants in the instance of the application. This model also has multiple tenants in some or all of its databases. This model is good for offering different service tiers so that clients can pay more if the value full database isolation.

The schema of every database includes a tenant identifier. The tenant identifier is even in those databases that store only one tenant.

- *(Tutorials for this model will be published here within a few days. A link will be here.)*




## Tutorials for each tenancy model

Each tenancy model is documented by the following:

- A set of tutorial articles.
- Source code stored in a Github repo that is dedicated to the model:
    - The code for the Wingtip Tickets application.
    - The script code for management scenarios.

#### Tutorials for management scenarios

The tutorial articles for each model cover the following management scenarios:

- Tenant provisioning.
- Performance monitoring and management.
- Schema management.
- Cross-tenant reporting and analytics.
- Restoration of one tenant to an earlier point in time.
- Disaster recovery.



## Next steps

- [Introduction to a SQL Database multi-tenant SaaS app example][saas-dbpertenant-wingtip-app-overview-15d] - has more information about this model.

- [Multi-tenant SaaS database tenancy patterns][multi-tenant-saas-database-tenancy-patterns-60p]



<!-- Image references. -->

[standalone-app-model-62s]: media/saas-tenancy-welcome-wingtip-tickets-app/model-standalone-app.png "Standalone app model"

[database-per-tenant-model-35d]: media/saas-tenancy-welcome-wingtip-tickets-app/model-database-per-tenant.png "Database per tenant model"

[sharded-multitenantdb-model-hybrid-79m]: media/saas-tenancy-welcome-wingtip-tickets-app/model-sharded-multitenantdb-hybrid.png "Sharded multi-tenant database model, the hybrid"



<!-- Article references. -->

[saas-dbpertenant-wingtip-app-overview-15d]: saas-dbpertenant-wingtip-app-overview.md

[multi-tenant-saas-database-tenancy-patterns-60p]: saas-tenancy-app-design-patterns.md

