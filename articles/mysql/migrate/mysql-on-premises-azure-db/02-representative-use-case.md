---
title: "Migrate MySQL on-premises to Azure Database for MySQL: Representative Use Case"
description: "The following use case is based on a real-world customer scenario of an enterprise who migrated their MySQL workload to Azure Database for MySQL."
ms.service: mysql
ms.subservice: migration-guide
ms.topic: how-to
author: rothja
ms.author: jroth
ms.reviewer: maghan
ms.custom:
ms.date: 06/21/2021
---

# Migrate MySQL on-premises to Azure Database for MySQL: Representative Use Case

[!INCLUDE[applies-to-mysql-single-flexible-server](../../includes/applies-to-mysql-single-flexible-server.md)]

## Prerequisites

[Introduction](01-mysql-migration-guide-intro.md)
## Overview

The following use case is based on a real-world customer scenario of an enterprise that migrated their MySQL workload to Azure Database for MySQL.

The World-Wide Importers (WWI) company is a San Francisco, California-based manufacturer and wholesale distributor of novelty goods. They began operations in 2002 and developed an effective business-to-business (B2B) model, selling the items they produce directly to retail customers throughout the United States. Its customers include specialty stores, supermarkets, computing stores, tourist attraction shops, and some individuals. This B2B model enables a streamlined distribution system of their products, allowing them to reduce costs and offer more competitive pricing on their manufactured items. They also sell to other wholesalers via a network of agents who promote their products on WWI's behalf.

Before launching into new areas, WWI wants to ensure its IT infrastructure can handle the expected growth. WWI currently hosts all its IT infrastructure on-premises at its corporate headquarters and believes moving these resources to the cloud enables future growth. As a result, they've tasked their CIO with overseeing the migration of their customer portal and the associated data workloads to the cloud.

WWI would like to continue to take advantage of the many advanced capabilities available in the cloud, and they're interested in migrating their databases and associated workloads into Azure. They want to do this quickly and without having to make any changes to their applications or databases. Initially, they plan on migrating their java-based customer portal web application and the associated MySQL databases and workloads to the cloud.

### Migration goals

The primary goals for migrating their databases and associated SQL workloads to the cloud include:

  - Improve their overall security posture with data at rest and in transit.

  - Enhance the high availability and disaster recovery (HA/DR) capabilities.

  - Position the organization to use cloud-native capabilities and technologies such as point-in-time restore.

  - Take advantage of administrative and performance optimization features of Azure Database for MySQL.

  - Create a scalable platform that they can use to expand their business into more geographic regions.

  - Allow for enhanced compliance with various legal requirements where personal information is stored.

WWI used the [Cloud Adoption Framework (CAF)](/azure/cloud-adoption-framework/) to educate their team on following best practices guidelines for cloud migration. Then, using CAF as a higher-level migration guide, WWI customized their migration into three main stages. Finally, they defined activities that needed to be addressed within each stage to ensure a successful lift and shift cloud migration.

These stages include:

| Stage | Name | Activities |
|-------|------|------------|
| 1 | Pre-migration | Assessment, Planning, Migration Method Evaluation, Application Implications, Test Plans, Performance Baselines |
| 2 | Migration     | Execute Migration, Execute Test Plans                                                                          |
| 3 | Post-migration| Business Continuity, Disaster Recovery, Management, Security, Performance Optimization, Platform modernization |

WWI has several instances of MySQL running with varying versions ranging from 5.5 to 5.7. They would like to move their instances to the latest version as soon as possible but would like to ensure their applications can still work if they move to the newer versions. They're comfortable moving to the same version in the cloud and upgrading afterward, but they would prefer that path if they can accomplish two tasks at once.

They would also like to ensure that their data workloads are safe and available across multiple geographic regions if there's a failure and look at the available configuration options.

WWI wants to start with a simple application for the first migration and then move to more business-critical applications in a later phase. This provides the team with the knowledge and experience they need to prepare and plan for those future migrations.  

## Next steps

> [!div class="nextstepaction"]
> [Assessment](./03-assessment.md)
