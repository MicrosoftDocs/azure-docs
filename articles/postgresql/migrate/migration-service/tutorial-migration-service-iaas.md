---
title: "Migrate from on-premises or an Azure VM to Azure Database for PostgreSQL"
description: "Learn to migrate seamlessly from on-premises or an Azure VM to Azure Database for PostgreSQL - Flexible Server using the new migration service in Azure."
author: apduvuri
ms.author: adityaduvuri
ms.reviewer: maghan
ms.date: 03/19/2024
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: tutorial
# CustomerIntent: As a user, I want to learn how to perform offline migration from on-premises and Azure virtual machines to Azure Database for PostgreSQL - Flexible Server using the migration service in Azure, so that I can simplify the transition and ensure data integrity and efficient deployment.
---

# Tutorial: Migrate from on-premises or an Azure VM hosted PostgreSQL to Azure Database for PostgreSQL using the migration service

[!INCLUDE [applies-to-postgresql-flexible-server](../../includes/applies-to-postgresql-flexible-server.md)]

This tutorial guides you in migrating a PostgreSQL instance from your on-premises or Azure virtual machines (VMs) to Azure Database for PostgreSQL flexible server using the Azure portal and Azure CLI.

The migration service in Azure Database for PostgreSQL is a fully managed service integrated into the Azure portal and Azure CLI. It's designed to simplify your migration journey to Azure Database for PostgreSQL flexible server.

> [!div class="checklist"]
>
> - Configure your Azure Database for PostgreSQL Flexible Server
> - Configure the migration task
> - Monitor the migration
> - Cancel the migration
> - Post migration

[!INCLUDE [prerequisites-migration-service-postgresql-offline](includes/prerequisites/prerequisites-migration-service-postgresql-offline.md)]

#### [Portal](#tab/portal)

[!INCLUDE [postgresql-aws-portal-migrate](includes/iaas/postgresql-iaas-portal-migrate.md)]

#### [CLI](#tab/cli)

[!INCLUDE [postgresql-aws-CLI-migrate](includes/iaas/postgresql-iaas-cli-migrate.md)]

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
