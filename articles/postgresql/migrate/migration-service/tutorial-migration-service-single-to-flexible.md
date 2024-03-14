---
title: "Migrate to Azure Database for PostgreSQL - Flexible Server from Single Server"
titleSuffix: "Migrate from Single Server to Flexible Server."
description: "Learn about migrating your Single Server databases to Azure Database for PostgreSQL Flexible Server by using the Azure portal or CLI commands."
author: hariramt
ms.author: hariramt
ms.reviewer: maghan, adityaduvuri
ms.date: 03/19/2024
ms.service: postgresql
ms.topic: tutorial
# CustomerIntent: As a user, I want to learn how to migrate my Single Server databases to Azure Database for PostgreSQL Flexible Server using the Azure portal, so that I can take advantage of the flexibility and scalability offered by the Flexible Server.
---

# Tutorial: Migrate from Azure Database for PostgreSQL - Single Server to Azure Database for PostgreSQL - Flexible Server using the migration service

[!INCLUDE [applies-to-postgresql-flexible-server](../../includes/applies-to-postgresql-flexible-server.md)]

Using the Azure portal, you can migrate an instance of Azure Database for PostgreSQL – Single Server to Azure Database for PostgreSQL – Flexible Server. In this tutorial, we perform migration of a sample database from an Azure Database for PostgreSQL single server to a PostgreSQL flexible server using the Azure portal.

> [!div class="checklist"]
>
> - Configure your Azure Database for PostgreSQL Flexible Server
> - Configure the migration task
> - Monitor the migration
> - Cancel the migration
> - Post migration

#### [Portal](#tab/portal)

[!INCLUDE [postgresql-single-server-portal-migrate](includes/single-server/postgresql-single-server-portal-migrate.md)]

#### [CLI](#tab/cli)

[!INCLUDE [postgresql-single-server-cli-migrate](includes/single-server/postgresql-single-server-cli-migrate.md)]

---

## Post migration

After completing the databases, you need to manually validate the data between source and target and verify that all the objects in the target database are successfully created.

After migration, you can perform the following tasks:

- Verify the data on your flexible server and ensure it's an exact copy of the source instance.

- Post verification, enable the high availability option on your flexible server as needed.

- Change the SKU of the flexible server to match the application needs. This change needs a database server restart.

- If you change any server parameters from their default values in the source instance, copy those server parameter values in the flexible server.

- Copy other server settings like tags, alerts, and firewall rules (if applicable) from the source instance to the flexible server.

- Make changes to your application to point the connection strings to a flexible server.

- Monitor the database performance closely to see if it requires performance tuning.

## Related content

- [Migration service](concepts-migration-service-postgresql.md)
- [Migrate from AWS RDS](tutorial-migration-service-aws.md)
- [Best practices](best-practices-migration-service-postgresql.md)
- [Known Issues and limitations](concepts-known-issues-migration-service.md)
- [Network setup](how-to-network-setup-migration-service.md)
- [Premigration validations](concepts-premigration-migration-service.md)
