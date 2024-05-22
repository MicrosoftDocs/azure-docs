---
title: "Prerequisites for the migration service in Azure Database for PostgreSQL (offline)"
description: Providing the prerequisites of the migration service in Azure Database for PostgreSQL
author: apduvuri
ms.author: adityaduvuri
ms.reviewer: maghan
ms.date: 03/19/2024
ms.service: postgresql
ms.topic: include
---

### Prerequisites (offline)

Before you start your migration with migration service in Azure Database for PostgreSQL, fulfilling the following prerequisites, which apply to offline migration scenarios is essential.

### Verify the source version

Source PostgreSQL version should be `>= 9.5`. If the source PostgreSQL version is less than `9.5`, upgrade the source PostgreSQL version to `9.5` or higher before migration.

### Target setup

- Azure Database for PostgreSQL must be set up in Azure before migration.

- The SKU chosen for the Azure Database for PostgreSQL should correspond with the specifications of the source database to ensure compatibility and adequate performance.

- For detailed instructions on creating a new Azure Database for PostgreSQL, refer to the following link: [Quickstart: Create server](/azure/postgresql/flexible-server/).

### Network setup

Proper networking setup is essential to ensure successful connectivity between the source and target during migration. Here's a guide to help you establish the network connection for different scenarios:

**Networking requirements for migration:**

- **ExpressRoute/IPsec VPN/VPN tunneling**: When connecting your on-premises/AWS source to Azure, you might need to set up an ExpressRoute, IPsec VPN, or VPN tunneling to facilitate secure data transfer.

- **VNET peering**: Establish virtual network peering between the two distinct VNets to enable direct network connectivity, a prerequisite for migration between the Azure VM and the Azure Database for PostgreSQL.

**Connectivity Scenarios:**

The following table can help set up the network between the source and target.

| Source | Target | Connectivity Tips |
| --- | --- | --- |
| Public | Public | No other action is required if the source is whitelisted in the target's firewall rules. |
| Private | Public | This configuration isn't supported; use pg_dump/pg_restore for data transfer. |
| Public | Private | No other action is required if the source is whitelisted in the target's firewall rules. |
| Private | Private | Establish an ExpressRoute, IPsec VPN, VPN Tunneling, or virtual network Peering between the source and target. |
| Private | Private Endpoint | This configuration isn't supported; contact [Microsoft support](https://support.microsoft.com/). |

**Additional Networking Considerations:**

- pg_hba.conf Configuration: To facilitate connectivity between the source and target PostgreSQL instances, it is essential to verify and potentially modify the pg_hba.conf file. This file includes client authentication and must be configured to allow the target PostgreSQL to connect to the source. Changes to the pg_hba.conf file typically require a restart of the source PostgreSQL instance to take effect.

> [!NOTE]
> The pg_hba.conf file is located in the data directory of the PostgreSQL installation. This file should be checked and configured if the source database is an on-premises PostgreSQL server or a PostgreSQL server hosted on an Azure VM. For PostgreSQL instances on AWS RDS or similar managed services, the pg_hba.conf file is not directly accessible or applicable. Instead, access is controlled through the service's provided security and network access configurations.

For more information about network setup, visit [Network guide for migration service in Azure Database for PostgreSQL - Flexible Server](../../how-to-network-setup-migration-service.md).

### Extensions

Extensions are extra features that can be added to PostgreSQL to enhance its functionality. Extensions are supported in Azure Database for PostgreSQL but must be enabled manually. To enable extensions, follow these steps:

- Use the select command in the source to list all the extensions that are being used - `select extname,extversion from pg_extension;`

- Search for azure.extensions server parameter on the Server parameter page on your Azure Database for PostgreSQL. Enable the extensions found in the source within PostgreSQL.

- Save the parameter changes and restart the Azure Database for PostgreSQL to apply the new configuration if necessary.

  :::image type="content" source="../../media/concepts-prerequisites-migration-service/extensions-enable-flexible-server.png" alt-text="Screenshot of extensions.":::

- Check if the list contains any of the following extensions:
    - PG_CRON
    - PG_HINT_PLAN
    - PG_PARTMAN_BGW
    - PG_PREWARM
    - PG_STAT_STATEMENTS
    - PG_AUDIT
    - PGLOGICAL
    - WAL2JSON

If yes, search the server parameters page for the shared_preload_libraries parameter. This parameter indicates the set of extension libraries that are preloaded at the server restart.

### Users and roles

When migrating to Azure Database for PostgreSQL, it's essential to address the migration of users and roles separately, as they require manual intervention:

- **Manual Migration of Users and Roles**: Users and their associated roles must be manually migrated to the Azure   Database for PostgreSQL. To facilitate this process, you can use the `pg_dumpall` utility with the `--globals-only` flag to export global objects such as roles and user accounts. Execute the following command, replacing `<<username>>` with the actual username and `<<filename>>` with your desired output file name:

  ```sql
  pg_dumpall --globals-only -U <<username>> -f <<filename>>.sql
  ```

- **Restriction on Superuser Roles**: Azure Database for PostgreSQL doesn't support superuser roles. Therefore, users with superuser privileges must have those privileges removed before migration. Ensure that you adjust the permissions and roles accordingly.

By following these steps, you can ensure that user accounts and roles are correctly migrated to the Azure Database for PostgreSQL without encountering issues related to superuser restrictions.

### Server parameters

These parameters aren't automatically migrated to the target environment and must be manually configured.

- Match server parameter values from the source PostgreSQL database to the Azure Database for PostgreSQL by accessing the "Server parameters" section in the Azure portal and manually updating the values accordingly.

- Save the parameter changes and restart the Azure Database for PostgreSQL to apply the new configuration if necessary.

### Disable high availability (reliability) and read replicas in the target

- Disabling high availability (reliability) and reading replicas in the target environment is essential. These features should be enabled only after the migration has been completed.

- By following these guidelines, you can help ensure a smooth migration process without the added variables introduced by HA and Read Replicas. Once the migration is complete and the database is stable, you can proceed to enable these features to enhance the availability and scalability of your database environment in Azure.
