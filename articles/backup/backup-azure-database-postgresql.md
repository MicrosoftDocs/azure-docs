---
title: Backup Azure Database for PostgreSQL 
description: Learn about Azure Database for PostgreSQL backup with long-term retention (preview)
ms.topic: conceptual
ms.date: 09/08/2020
---


# Azure Database for PostgreSQL backup with long-term retention (preview)

Azure Backup and Azure Database Services have come together to build an enterprise-class backup solution for Azure Database for PostgreSQL servers that retains backups for up to 10 years.

Besides long-term retention, the solution also has many other capabilities as listed below:

- RBAC-based access to the database using Azure Active Directory and Managed Service Identity (MSI) authentication.
- Customer controlled scheduled and on-demand backup at the individual database level.
- Database-level restores to any Postgres server or directly to blob storage.
- Long-term retention in vault or archive tier.
- Central monitoring of all operations and jobs.
- Backups are stored in separate security and fault domains. So even if the source server were to be compromised or even killed, the backups would remain safe in the [Backup vault](backup-vault-overview.md).
- Use of **pg_dump** allows for greater flexibility in restores such that you can restore across database versions or even restore only a part of the backup.

You may use this solution independently or in addition to the native backup solution offered by Azure PostgreSQL that offers retention up to 35 days. The native solution is suited for operational recoveries, such as when you want to recover from the latest backups. The Azure Backup solution helps you with your compliance needs and more granular and flexible backup and restore.

## Support matrix

|Support  |Details  |
|---------|---------|
|Supported deployments   |  Azure Database for PostgreSQL standalone single server and Hyperscale (Citus) server group       |
|Support Azure PostgreSQL versions    |   9.5, 9.6, 10, 11      |

## Feature considerations and limitations

- All operations are supported from the Azure portal only.
- Recommended limit for the maximum database size is 400 GB.
- Cross-region backup isn't supported. This means you can't back up an Azure PostgreSQL server to a vault in another region. Similarly, you can only restore a backup to a server within the same region as the vault.
- Only the data is recovered at the time of restore. "Roles" aren't restored.
- In preview, we recommend that you run the solution only on your test environment.

## Backup process

1. This solution uses **pg_dump** to take backups of your Azure PostgreSQL databases.

2. Once you specify the Azure PostgreSQL databases you want to back up, the service validates if it has the right set of permissions to perform the backup operation or not.

3. Azure Backup spins up a worker role with '??' backup extension installed in it. This extension communicates with the Postgres server.

4. This extension consists of a coordinator and an Azure Postgres plugin. While the coordinator is responsible for triggering workflows for various operations like configure backup, backup, and restore, the plugin is responsible for the actual data flow.
  
5. Once you trigger configure protection on the selected databases, the backup service sets up the coordinator with the backup schedules and other policy details.

6. At the scheduled time, the coordinator communicates with the plugin and it starts streaming the backup data from the Postgres server using **pg_dump**.

7. The plugin sends the data directly to the Backup vault, eliminating the need for a staging location. The data is encrypted using Microsoft-managed keys and stored by the Azure Backup service in storage accounts.

8. When the data transfer is complete, the coordinator confirms the commit with the backup service.

![Backup process](./media/backup-azure-database-postgresql/backup-process.png)

## Configure backup on Azure PostgreSQL databases

The following instructions are a step-by-step guide to configuring backup on the Azure PostgreSQL databases using Azure Backup:

1. Go to [Backup Center](backup-center-overview.md) -> **Overview** -> **Backup**. Select the **Datasource type** as Azure Database for PostgreSQL servers under **Initiate: Configure Backup**. Select a **Backup vault** to which you wish to back up your Postgres databases under **Configure backup**.  

    Alternatively, you can directly go to the Backup vault resource.

1. Select or create a **Backup policy**.

1. Select resources or Postgres databases to back up.

    ![Select resources to back up](./media/backup-azure-database-postgresql/select-resources.png)

1. You can choose from the list of all Azure PostgreSQL servers across subscriptions if they're in the same region as the vault. Expand the arrow to see the list of databases within a server.

    ![Choose servers](./media/backup-azure-database-postgresql/choose-servers.png)

1. The service runs these checks on the selected databases to validate whether the vault has permissions on the Postgres server and ??
    1. **Backup readiness** for all databases should read **Success** for you to be able to continue.
    1. If there's an error, either **fix** the error and **revalidate** or remove the database from the selections.

    ![Validation errors to fix](./media/backup-azure-database-postgresql/validation-errors.png)

1. Confirm all the details under **Review and configure** and select **Configure backup** to submit the operation.

    ![Confirm details in Review and configure](./media/backup-azure-database-postgresql/review-and-configure.png)

1. Once triggered, the **Configure backup** operation will create a backup instance. You can track the status of the operation under [Backup Instances](backup-center-monitor-operate.md#backup-instances) pane in the Backup Center or vault view.

    ![Backup instances](./media/backup-azure-database-postgresql/backup-instances.png)

1. The backups are triggered according to the backup schedule defined in the policy. The jobs can be tracked under [Backup Jobs](backup-center-monitor-operate.md#backup-jobs). Currently, you can view jobs for the last seven days.

    ![Backup jobs](./media/backup-azure-database-postgresql/backup-jobs.png)

## On-demand backup

To trigger a backup not in the schedule specified in the policy, go to **Backup instances** -> **Backup Now**.
Choose from the list of retention rules that were defined in the associated Backup policy.

![Trigger backup now](./media/backup-azure-database-postgresql/backup-now.png)

![Choose from list of retention rules](./media/backup-azure-database-postgresql/retention-rules.png)

## Create backup policy

1. Enter a **name** for the new policy.

    ![Enter policy name](./media/backup-azure-database-postgresql/enter-policy-name.png)

1. Define the Backup schedule. We currently support **Weekly** backup. You can schedule the backups on one or more days of the week.

    ![Define the backup schedule](./media/backup-azure-database-postgresql/define-backup-schedule.png)

1. Define **Retention** settings. You can add one or more retention rules. Each retention rule assumes inputs for specific backups, and data store and retention duration for those backups.

1. You can choose to store your backups in one of the two data stores (or tiers): **Backup data store** (hot tier) or **Archive data store**. You can choose between **two tiering options** to define when the backups are tiered across the two datastores:

    - Choose to copy **Immediately** if you prefer to have a backup copy in both backup and archive data stores simultaneously.
    - Choose to move **On-expiry** if you prefer to move the backup to archive data store upon its expiry in the backup data store.

1. The **default retention rule** is applied in the absence of any other retention rule, and has a default value of three months.

    - Retention duration ranges from seven days to 10 years in the **Backup data store**.
    - Retention duration ranges from six months to 10 years in the **Archive data store**.

    ![Edit retention duration](./media/backup-azure-database-postgresql/edit-retention.png)

>[!NOTE]
>The retention rules are evaluated in a pre-determined order of priority. The priority is highest for the **yearly** rule, followed by the **monthly** and then the **weekly** rule. Default retention settings are applied when no other rules qualify. For example, the same recovery point may be the first successful backup taken every week as well as the first successful backup taken every month. However, since the monthly rule priority is higher than that of the weekly rule, the retention corresponding to the first successful backup taken every month applies.

## Backup and restore jobs

### Restore

1. Go to **Backup Center** -> **Overview** -> **Restore**.
2. Select the **Datasource** type as Azure Database for PostgreSQL servers under **Initiate: Restore**.
3. Select **Backup instance** corresponding to the database you want to restore. You can filter the backup instances by subscription, location, resource group, and vault. Note that while cross-subscription backup and restore are supported, cross-region backup and restore aren't yet supported. So choose the vault accordingly.
4. Alternatively, ..
5. **Select recovery point** from the list of all full backups available for the selected backup instance. By default, the latest recovery point is selected.

    ![Select recovery point](./media/backup-azure-database-postgresql/select-recovery-point.png)

    ![List of recovery points](./media/backup-azure-database-postgresql/list-recovery-points.png)

6. Input **Restore parameters**. At this point, you can select from two kinds of restores: **Restore as Database** and **Restore as Files**.

7. **Restore as Database**:  Restore the backup data to create a new database in the target PostgreSQL server.

    - The target server can be same as the source server. However, overwriting the original database isn't supported.
    - You can choose from the server across all subscriptions, but in the same region as the vault.
    - Select **Review + Restore**. This will trigger validation to check if the service has appropriate restore permissions on the target server.

8. **Restore as Files**: Dump the backup files to the target storage account (blobs).

    - You can choose from the storage accounts across all subscriptions, but in the same region as the vault.
    - Select the target container from the container list filtered for the selected storage account.
    - Select **Review + Restore**. This will trigger validation to check if the service has appropriate restore permissions on the target server.

9. Review the information and select **Restore**. This will trigger a corresponding Restore job that can be tracked under **Backup jobs**.

### Restore permissions

## Next steps
