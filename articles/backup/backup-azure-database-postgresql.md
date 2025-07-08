---
title: Back Up Azure Database for PostgreSQL by Using the Azure Portal
description: Learn how to back up Azure Database for PostgreSQL by using the Azure portal.
ms.topic: how-to
ms.date: 05/20/2025
ms.service: azure-backup
author: jyothisuri
ms.author: jsuri
ms.custom:
  - build-2025
# Customer intent: "As a database administrator, I want to back up my Azure Database for PostgreSQL using the Azure portal, so that I can ensure data protection and recovery options are in place for my databases."
---

# Back up Azure Database for PostgreSQL by using the Azure portal

This article describes how to back up an Azure Database for PostgreSQL server using Azure portal. You can also configure backup using [Azure PowerShell](backup-postgresql-ps.md), [Azure CLI](backup-postgresql-cli.md), and [REST API](backup-azure-data-protection-use-rest-api-backup-postgresql.md) for PostgreSQL databases. 

Before you begin, review the [supported configurations, feature considerations, and known limitations](./backup-azure-database-postgresql-support-matrix.md), along with [frequently asked questions](/azure/backup/backup-azure-database-postgresql-server-faq).

## <a name = "configure-backup-on-azure-postgresql-databases"></a>Configure a backup on PostgreSQL databases

You can configure a backup on multiple PostgreSQL databases across multiple Azure Database for PostgreSQL servers. To configure this kind of backup by using Azure Backup, follow these steps:

1. Go to **Backup vault**, select a vault, and then select **Backup**.

   :::image type="content" source="./media/backup-azure-database-postgresql/adding-backup-inline.png" alt-text="Screenshot that shows the button for adding a backup." lightbox="./media/backup-azure-database-postgresql/adding-backup-expanded.png":::

   Alternatively, you can go to this page from the [Backup center](./backup-center-overview.md).

1. On the **Basics** tab, enter the required information.

   :::image type="content" source="./media/backup-azure-database-postgresql/adding-backup-details-inline.png" alt-text="Screenshot that shows the tab for entering basic backup information." lightbox="./media/backup-azure-database-postgresql/adding-backup-details-expanded.png":::

1. On the **Backup policy** tab, select or [create](#create-a-backup-policy) a policy that defines the backup schedule and the retention duration.

   :::image type="content" source="./media/backup-azure-database-postgresql/create-or-add-backup-policy-inline.png" alt-text="Screenshot that shows the option to add a backup policy." lightbox="./media/backup-azure-database-postgresql/create-or-add-backup-policy-expanded.png":::

1. On the **Datasources** tab, select **Add/Edit**.

   :::image type="content" source="./media/backup-azure-database-postgresql/select-azure-postgresql-databases-to-back-up-inline.png" alt-text="Screenshot that shows the button for adding or editing a PostgreSQL database." lightbox="./media/backup-azure-database-postgresql/select-azure-postgresql-databases-to-back-up-expanded.png":::

1. On the **Select resources to backup** pane, choose one of the Azure Database for PostgreSQL servers across subscriptions if they're in the same region as that of the vault. Select the arrow to show the list of databases within a server.

   :::image type="content" source="./media/backup-azure-database-postgresql/choose-an-azure-postgresql-server-inline.png" alt-text="Screenshot that shows the pane for choosing an Azure Database for PostgreSQL server." lightbox="./media/backup-azure-database-postgresql/choose-an-azure-postgresql-server-expanded.png":::

   > [!NOTE]
   > You don't need to back up the databases **azure_maintenance** and **azure_sys**. Additionally, you can't back up a database that's already backed up to a Backup vault.

   >
   > You can back up private endpoint-enabled Azure Database for PostgreSQL servers by allowing trusted Microsoft services in the network settings.

1. Select **Assign key vault** to select a key vault that stores the credentials for connecting to the selected database. You should have already [created the relevant secrets](#create-a-secret-in-the-key-vault) in the key vault.

   To assign the key vault at the individual row level, click **Select a key vault and secret**. You can also assign the key vault by selecting multiple rows and then selecting **Assign key vault** on the action menu.

   :::image type="content" source="./media/backup-azure-database-postgresql/assign-azure-key-vault-inline.png" alt-text="Screenshot that shows selections for assigning a key vault." lightbox="./media/backup-azure-database-postgresql/assign-azure-key-vault-expanded.png":::

1. To specify the secret information, use one of the following options:

   - **Enter secret URI**: Use this option if the secret URI is shared or known to you. You can get the secret URI from the key vault by selecting a secret and then copying the **Secret Identifier** value.

      :::image type="content" source="./media/backup-azure-database-postgresql/enter-secret-uri-inline.png" alt-text="Screenshot that shows how to get a secret U R I." lightbox="./media/backup-azure-database-postgresql/enter-secret-uri-expanded.png":::

      However, with this option, Azure Backup has no visibility into the key vault that you referenced. Access permissions on the key vault can't be granted inline. For the backup operation to succeed, the backup admin, along with the PostgreSQL and/or key vault admin, needs to ensure that the Backup vault's [access on the key vault is granted manually](backup-azure-database-postgresql-overview.md#access-permissions-on-the-key-vault) outside the [configure backup](#configure-a-backup-on-postgresql-databases) flow.


   - **Select from key vault**: Use this option if you know the key vault and secret names. Then click **Select a key vault and secret** and enter the details.

      :::image type="content" source="./media/backup-azure-database-postgresql/assign-secret-store-inline.png" alt-text="Screenshot that shows selections for assigning a secret store." lightbox="./media/backup-azure-database-postgresql/assign-secret-store-expanded.png":::

      :::image type="content" source="./media/backup-azure-database-postgresql/select-secret-from-azure-key-vault-inline.png" alt-text="Screenshot that shows the selection of a secret from Azure Key Vault." lightbox="./media/backup-azure-database-postgresql/select-secret-from-azure-key-vault-expanded.png":::

      With this option, you (as a backup admin with write access on the key vault) can grant the access permissions on the key vault inline. The key vault and the secret could preexist or be created on the go. 

      Ensure that the secret is the Azure Database for PostgreSQL server's connection string in ADO.NET format. The string must be updated with the credentials of the database user who has backup privileges on the server. [Learn more about how to create secrets in the key vault](#create-a-secret-in-the-key-vault).

1. After you finish updating the information for the key vault and the secret, the validation starts.

   The Azure Backup service validates that it has all the necessary [access permissions](backup-azure-database-postgresql-overview.md#key-vault-based-authentication-model) to read secret details from the key vault and connect to the database. During this process, the status of the chosen data sources on the **Configure Backup** pane appears as **Validating**.

   :::image type="content" source="./media/backup-azure-database-postgresql/validation-of-secret-inline.png" alt-text="Screenshot that shows the in-progress validation of secrets." lightbox="./media/backup-azure-database-postgresql/validation-of-secret-expanded.png":::

   If one or more access permissions are missing, the service displays one of the following error messages:

   - **User cannot assign roles**: This message appears when you (as the backup admin) don't have the write access on the Azure Database for PostgreSQL server and/or key vault to assign missing permissions as listed under **View details**.

     Download the assignment template by selecting the **Download role assignment template** button on the action menu, and then have the PostgreSQL and/or key vault admin run it. It's an Azure Resource Manager template that helps you assign the necessary permissions on the required resources.

     :::image type="content" source="./media/backup-azure-database-postgresql/download-role-assignment-template-inline.png" alt-text="Screenshot that shows the option to download a role assignment template." lightbox="./media/backup-azure-database-postgresql/download-role-assignment-template-expanded.png":::

      After the template is run successfully, select **Re-validate** on the **Configure Backup** pane.

   - **Role assignment not done**: This message appears when you (as the backup admin) have write access on the Azure Database for PostgreSQL server and/or key vault to assign missing permissions as listed under **View details**. Use the **Assign missing roles** button on the action menu to grant permissions on the Azure Database for PostgreSQL server and/or the key vault inline.

     :::image type="content" source="./media/backup-azure-database-postgresql/role-assignment-not-done-inline.png" alt-text="Screenshot that shows the error about the role assignment not done." lightbox="./media/backup-azure-database-postgresql/role-assignment-not-done-expanded.png":::

1. Select **Assign missing roles** on the action menu and assign roles. After the process starts, the [missing access permissions](backup-azure-database-postgresql-overview.md#azure-backup-authentication-with-the-postgresql-server) on the key vault and/or the Azure Database for PostgreSQL server are granted to the Backup vault. In the **Scope** area, you can define the scope at which the access permissions should be granted. When the action is complete, revalidation starts.


   :::image type="content" source="./media/backup-azure-database-postgresql/assign-missing-roles-inline.png" alt-text="Screenshot that shows the button for assigning missing roles." lightbox="./media/backup-azure-database-postgresql/assign-missing-roles-expanded.png":::

   :::image type="content" source="./media/backup-azure-database-postgresql/define-scope-of-access-permission-inline.png" alt-text="Screenshot that shows the box for defining the scope of access permissions." lightbox="./media/backup-azure-database-postgresql/define-scope-of-access-permission-expanded.png":::

   The Backup vault accesses secrets from the key vault and runs a test connection to the database to validate that the credentials were entered correctly. The privileges of the database user are also checked to see [if the database user has backup-related permissions on the database](backup-azure-database-postgresql-overview.md#database-users-backup-privileges-on-the-database).


   If a low-privileged user doesn't have backup/restore permissions on the database, the validations fail. A PowerShell script is dynamically generated for each record or selected database. [Run the PowerShell script to grant these privileges to the database user on the database](#create-a-secret-in-the-key-vault). Alternatively, you can assign these privileges by using the pgAdmin or PSQL tool.

   :::image type="content" source="./media/backup-azure-database-postgresql/backup-vault-accesses-secrets-inline.png" alt-text="Screenshot that shows a Backup vault accessing secrets from a key vault." lightbox="./media/backup-azure-database-postgresql/backup-vault-accesses-secrets-expanded.png":::


   :::image type="content" source="./media/backup-azure-database-postgresql/run-test-connection.png" alt-text="Screenshot that shows the process to start a test connection.":::

   :::image type="content" source="./media/backup-azure-database-postgresql/user-credentials-to-run-test-connection-inline.png" alt-text="Screenshot that shows how to provide user credentials to run a test connection." lightbox="./media/backup-azure-database-postgresql/user-credentials-to-run-test-connection-expanded.png":::

1. When **Backup readiness** shows **Success**, select the **Review and configure** tab to proceed to the last step of submitting the operation.

   :::image type="content" source="./media/backup-azure-database-postgresql/backup-readiness-as-success-inline.png" alt-text="Screenshot that shows the backup readiness is successful." lightbox="./media/backup-azure-database-postgresql/backup-readiness-as-success-expanded.png":::

   :::image type="content" source="./media/backup-azure-database-postgresql/review-backup-configuration-details-inline.png" alt-text="Screenshot that shows the tab for reviewing a backup configuration." lightbox="./media/backup-azure-database-postgresql/review-backup-configuration-details-expanded.png":::

1. Select **Configure backup**. Then, track the progress on the **Backup instances** pane.

   :::image type="content" source="./media/backup-azure-database-postgresql/submit-configure-backup-operation-inline.png" alt-text="Screenshot that shows the details for a configured backup." lightbox="./media/backup-azure-database-postgresql/submit-configure-backup-operation-expanded.png":::

## <a name = "create-backup-policy"></a>Create a backup policy

You can create a backup policy during the flow for configuring a backup. Alternatively, go to **Backup center** > **Backup policies** > **Add**. You can also [create a backup policy for PostgreSQL databases using REST API](backup-azure-data-protection-use-rest-api-create-update-postgresql-policy.md).

1. On the **Create Backup Policy** pane, on the **Basics** tab, enter a name for the new policy.

   :::image type="content" source="./media/backup-azure-database-postgresql/enter-name-for-new-policy-inline.png" alt-text="Screenshot that shows the box for a policy name on the pane for creating a backup policy." lightbox="./media/backup-azure-database-postgresql/enter-name-for-new-policy-expanded.png":::

1. On the **Schedule and retention** tab, define the backup schedule.

   Currently, only the weekly backup option is available. However, you can schedule the backups on multiple days of the week.

1. Select **Add retention rule** to define retention settings.

   You can add one or more retention rules. Each retention rule assumes inputs for specific backups, along with the datastore and retention duration for those backups.

1. To store your backups in one of the two datastores (or tiers), select **Vault-standard** or **Vault-archive (preview)**.

1. To move the backup to the archive datastore upon its expiry in the backup datastore, select **On-expiry**.

   :::image type="content" source="./media/backup-azure-database-postgresql/choose-option-to-move-backup-to-archive-data-store-inline.png" alt-text="Screenshot that shows the selected option to move a backup to the archive datastore upon its expiry." lightbox="./media/backup-azure-database-postgresql/choose-option-to-move-backup-to-archive-data-store-expanded.png":::

   > [!NOTE]
   > The **Default** retention rule is applied in the absence of any other retention rule. It has a default value of three months.
   >
   > In the backup datastore, retention duration ranges from seven days to 10 years.
   >
   > In the archive datastore, retention duration ranges from six months to 10 years.

1. Select **Add**, and then finish the process of reviewing and creating the policy.

Retention rules are evaluated in a predetermined order of priority. The priority is the highest for the yearly rule, followed by the monthly rule, and then the weekly rule.

Default retention settings apply when no other rules qualify. For example, the same recovery point might be the first successful backup taken every week, along with the first successful backup taken every month. However, because the priority of the monthly rule is higher than the priority of the weekly rule, the retention that corresponds to the first successful backup taken every month applies.

## <a name = "create-secrets-in-the-key-vault"></a>Create a secret in the key vault

The secret is the Azure Database for PostgreSQL server connection string in *ADO.NET* format. It's updated with the credentials of the database user who's granted the backup privileges on the server.

:::image type="content" source="./media/backup-azure-database-postgresql/pg-server-connection-string-inline.png" alt-text="Screenshot that shows the Azure Database for PostgreSQL server connection string as a secret." lightbox="./media/backup-azure-database-postgresql/pg-server-connection-string-expanded.png":::

Copy the connection string from the Azure Database for PostgreSQL server. Use a text editor to update the user ID and password.

:::image type="content" source="./media/backup-azure-database-postgresql/create-secret-inline.png" alt-text="Screenshot that shows the pane for creating a secret and a Notepad file that contains a connection string." lightbox="./media/backup-azure-database-postgresql/create-secret-expanded.png":::

## <a name = "run-powershell-script-to-grant-privileges-to-database-users"></a>Run the PowerShell script to grant privileges to database users

The PowerShell script that's dynamically generated during the process of configuring a backup accepts the database user as the input, along with the PostgreSQL admin credentials, to grant the backup-related privileges to the database user on the database.

To run the script, make sure that the [PSQL tool](https://www.enterprisedb.com/download-postgresql-binaries) is on the machine. Also make sure that the `PATH` environment variable is set appropriately to the PSQL tool's path:

1. Open **Edit the system environment variables** in Control Panel.

   :::image type="content" source="./media/backup-azure-database-postgresql/psql-set-environment-inline.png" alt-text="Screenshot that shows a search for the Control Panel item to edit system environment variables." lightbox="./media/backup-azure-database-postgresql/psql-set-environment-expanded.png":::

1. In **System Properties** > **Advanced**, select **Environment Variables**.

   :::image type="content" source="./media/backup-azure-database-postgresql/system-properties-to-set-environment-inline.png" alt-text="Screenshot that shows the button for setting environment variables in System Properties." lightbox="./media/backup-azure-database-postgresql/system-properties-to-set-environment-expanded.png":::

1. The default environment variables appear.

   :::image type="content" source="./media/backup-azure-database-postgresql/adding-environment-variables-inline.png" alt-text="Screenshot that shows default environment variables." lightbox="./media/backup-azure-database-postgresql/adding-environment-variables-expanded.png":::

   Use the **Edit** button to set the variables that you need.

   :::image type="content" source="./media/backup-azure-database-postgresql/editing-environment-variables-inline.png" alt-text="Screenshot that shows the environment variables that you need to set." lightbox="./media/backup-azure-database-postgresql/editing-environment-variables-expanded.png":::

To allow network connectivity, ensure that **Connection Security settings** in the Azure Database for PostgreSQL instance includes the IP address of the machine in the allowlist.

## Run an on-demand backup

To trigger a backup that's not in the schedule specified in the policy:

1. Go to **Backup instances** and select **Backup Now**.

   :::image type="content" source="./media/backup-azure-database-postgresql/navigate-to-retention-rules-inline.png" alt-text="Screenshot that shows the pane for backup instances, including the Backup Now button." lightbox="./media/backup-azure-database-postgresql/navigate-to-retention-rules-expanded.png":::

1. Choose from the list of retention rules that the associated backup policy defined.

   :::image type="content" source="./media/backup-azure-database-postgresql/choose-retention-rules-inline.png" alt-text="Screenshot that shows retention rules that were defined in a backup policy." lightbox="./media/backup-azure-database-postgresql/choose-retention-rules-expanded.png":::

## Track a backup job

The Azure Backup service creates a job for scheduled backups or if you trigger an on-demand backup operation for tracking. To view the backup job's status:

1. Go to the **Backup instances** pane. It shows the **Jobs** dashboard with the operations and statuses for the past seven days.

   :::image type="content" source="./media/backup-azure-database-postgresql/postgre-jobs-dashboard.png" alt-text="Screenshot that shows the jobs dashboard." lightbox="./media/backup-azure-database-postgresql/postgre-jobs-dashboard.png":::

1. Select **View All** to display ongoing and past jobs of this backup instance.

   :::image type="content" source="./media/backup-azure-database-postgresql/postgresql-jobs-view-all.png" alt-text="Screenshot that shows the button for displaying ongoing and past jobs." lightbox="./media/backup-azure-database-postgresql/postgresql-jobs-view-all.png":::

1. Review the list of backup and restore jobs and their statuses. Select a job to view its details.

   :::image type="content" source="./media/backup-azure-database-postgresql/postgresql-jobs-select-job-inline.png" alt-text="Screenshot that shows to details for a selected job." lightbox="./media/backup-azure-database-postgresql/postgresql-jobs-select-job-expanded.png":::

## Related content

- Restore a PostgreSQL database using [Azure portal](restore-azure-database-postgresql.md).
- Restore a PostgreSQL database using [Azure PowerShell](restore-postgresql-database-ps.md), [Azure CLI](restore-postgresql-database-cli.md), and [REST API](restore-postgresql-database-use-rest-api.md).
- [Azure Backup pricing](https://azure.microsoft.com/pricing/details/backup/)
- [Troubleshoot PostgreSQL database backup by using Azure Backup](backup-azure-database-postgresql-troubleshoot.md)
