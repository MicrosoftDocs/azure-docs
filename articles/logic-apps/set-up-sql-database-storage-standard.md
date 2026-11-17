---
title: Set Up SQL Database Storage for Hybrid Logic Apps
description: Set up SQL database storage for Hybrid Logic Apps Standard to persist workflow runtime state in customer-managed infrastructure.
services: azure-logic-apps
ms.suite: integration
ms.reviewers: estfan, azla
ms.topic: how-to
ms.update-cycle: 1095-days
ms.date: 11/10/2026
ms.custom: sfi-image-nochange
#Customer intent: As an integration developer who runs Hybrid Logic Apps, I want to configure SQL database storage for workflow runtime state in my customer-managed infrastructure.
---

# Set up SQL database storage for Hybrid Logic Apps

[!INCLUDE [logic-apps-sku-standard](includes/logic-apps-sku-standard.md)]

SQL as a storage provider is supported only for Hybrid Logic Apps. It isn't supported for regular Azure-hosted Logic Apps Standard, including the Workflow Service Plan and App Service Environment v3 options. For Hybrid deployment requirements, see [Set up your own infrastructure for Standard logic apps for hybrid deployment](set-up-standard-workflows-hybrid-deployment-requirements.md).

## Runtime-managed SQL schema

When the Hybrid Logic Apps runtime starts, it validates and initializes the database schema required for workflow execution. The runtime manages its database objects and persisted workflow state, including runs, actions, triggers, jobs, subscriptions, and runtime metadata. You manage the SQL Server infrastructure, including its availability, capacity, backups, security, and maintenance.

> [!IMPORTANT]
> Don't manually create, change, rename, or drop runtime-managed tables, indexes, stored procedures, or other database objects unless Microsoft Support explicitly directs you to do so.

## SQL Server maintenance

You manage SQL Server availability, capacity, backups, security, and maintenance. Follow your organization's SQL Server operations practices, including these recommendations:

- Monitor database and transaction log capacity. Plan storage and compute for expected workflow volume and concurrency, and alert before capacity limits are reached.
- Configure backups and disaster recovery to meet your recovery objectives. Regularly verify backups and test restores.
- Monitor CPU, memory, I/O latency, transaction log throughput, connectivity, blocking, and deadlocks. SQL responsiveness affects workflow-state persistence and retrieval.
- Run supported database integrity checks and review statistics and index health. Don't alter or remove runtime-managed objects.
- Coordinate database maintenance or failover with the application maintenance window. Afterward, verify connectivity and confirm that workflow processing has resumed.

For performance benchmarking guidance, see [Hybrid Logic Apps - SQL as storage provider benchmarking](https://techcommunity.microsoft.com/blog/integrationsonazureblog/hybrid-logic-apps---sql-as-storage-provider-benchmarking/4567807).

## Prerequisites

- An Azure account and active subscription. [Get a free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

- A SQL Server, Azure SQL Database, or Azure SQL Managed Instance and a database.

  1. Configure the network and firewall rules to allow the Hybrid Logic Apps runtime to connect to the database. For Azure SQL, see [Network access controls](/azure/azure-sql/database/network-access-controls-overview).

  1. If you have SQL Express for local development, connect to the default named instance `localhost\SQLExpress`.

  1. Follow the [steps to set up your SQL environment](#set-up-sql-environment) in this article.

  1. For local development, you need [Visual Studio Code](https://code.visualstudio.com/Download) locally installed on your computer.

     > [!NOTE]
     >
     > Make sure to install the [latest Azure Functions Core Tools](https://github.com/Azure/azure-functions-core-tools/releases) and that you have SQL support by choosing the Microsoft Installer (MSI), which is `func-cli-X.X.XXXX-x*.msi`. For more information about Visual Studio Code requirements, see [Create Standard workflows in Azure Logic Apps with Visual Studio Code](create-single-tenant-workflows-visual-studio-code.md#prerequisites).

<a name="set-up-sql-environment"></a>

## Set up your SQL environment

1. Before you set up SQL Storage Provider, confirm that you finished the required steps in the [Prerequisites](#prerequisites).

1. Set up permissions for your SQL server.

   SQL Storage Provider currently supports SQL authentication through connection strings. You can also choose Windows Authentication for local development and testing. At this time, support for Microsoft Entra ID and managed identities isn't available.

   The identity in the connection string must have permission to initialize and manage the runtime schema in the target database.
   
   The runtime uses the connection string to create and manage these objects:

   - Create and delete the following schemas: `dt`, `dc`, and `dq`.
   - Add, alter, and delete tables in these schemas.
   - Add, alter, and delete user-defined table types in these schemas.

   For more information about targeted permissions, see [SQL server permissions in the Database Engine](/sql/relational-databases/security/permissions-database-engine).

   > [!IMPORTANT]
   >
   > Treat the SQL connection string as a secret. Store and manage it securely, for example, by using [Azure Key Vault](/azure/key-vault/general/overview) and [Key Vault references in app settings](../app-service/app-service-key-vault-references.md).

1. Connect to your SQL server and database.

   Verify that the Hybrid Logic Apps runtime and any development environment can connect to the SQL server. Configure network access for the runtime's network path; allowing Azure services alone might not permit the connection.

<a name="set-up-sql-logic-app-creation-azure-portal"></a>

## Set up SQL during creation in the Azure portal

When you create a Hybrid Logic App, you can set up SQL as its storage provider. Don't select the Workflow Service Plan or App Service Environment v3 hosting options for SQL storage.

1. In the [Azure portal](https://portal.azure.com) search box, enter `logic apps`, and select **Logic apps**.

   :::image type="content" source="media/set-up-sql-database-storage-standard/find-logic-app-resource-template.png" alt-text="Screenshot shows the Azure portal search box with logic apps entered and selected category named Logic apps." lightbox="media/set-up-sql-database-storage-standard/find-logic-app-resource-template.png":::

1. On the **Logic apps** page toolbar, select **Create**.

1. On the **Create Logic App** page, under **Standard**, select **Hybrid** as the hosting option.

1. On the **Basics** tab, enter your subscription, resource group, and logic app name, then select the connected environment and region for your Hybrid deployment.

    The following example shows the **Basics** tab with the **Hybrid** hosting option:

    :::image type="content" source="media/set-up-sql-database-storage-standard/create-logic-app-hybrid.png" alt-text="Screenshot shows the Create Logic App page with the Hybrid hosting option selected." lightbox="media/set-up-sql-database-storage-standard/create-logic-app-hybrid.png":::

1. Select **Next: Storage** and provide the following information:

    | Property | Required | Value |
    |----------|----------|-------|
    | **SQL connection string** | Yes | <*sql-connection-string*>. SQL authentication is supported. The portal doesn't validate the connection string. |
    | **Host name** | Yes | <*host-name*>. The fully qualified domain name or IP address of the Server Message Block (SMB) server for artifacts. |
    | **File share path** | Yes | <*file-share-path*>. The file share path and any subfolders for artifacts. |
    | **User name** | Yes | <*host-user-name*>. Use **<*domain*>\\<*username*>** or **<*username*>** if the domain is `localhost`. |
    | **Password** | Yes | <*host-user-password*>. The password used to access the host. |

    The following example shows the **Storage** tab for the **Hybrid** option:

    :::image type="content" source="media/set-up-sql-database-storage-standard/sql-storage-details-hybrid.png" alt-text="Screenshot shows the Storage tab for the Hybrid option." lightbox="media/set-up-sql-database-storage-standard/sql-storage-details-hybrid.png":::

1. Finish creating the Hybrid Logic App. For more information, see [Create Standard workflows for hybrid deployment on your own infrastructure](create-standard-workflows-hybrid-deployment.md).

When you're done, your Hybrid Logic App uses your SQL database as its runtime storage provider.

<a name="set-up-sql-local-dev"></a>

## Set up SQL for local development in Visual Studio Code

The following steps show how to configure SQL for local development and testing in Visual Studio Code. This local configuration doesn't mean SQL storage is supported for a regular Azure-hosted Logic Apps Standard deployment; SQL storage is supported only for Hybrid Logic Apps.

1. Set up your development environment to work with single-tenant Azure Logic Apps.

   1. Meet the [prerequisites](create-single-tenant-workflows-visual-studio-code.md#prerequisites) to work in Visual Studio Code with the Azure Logic Apps (Standard) extension.

   1. [Set up Visual Studio Code](create-single-tenant-workflows-visual-studio-code.md#set-up) to work with the Azure Logic Apps (Standard) extension.

   1. In Visual Studio Code, [connect to your Azure account](create-single-tenant-workflows-visual-studio-code.md#connect-azure-account) and [create a blank logic app project](create-single-tenant-workflows-visual-studio-code.md#create-project).

1. In Visual Studio Code, open the Explorer pane, if not already open.

1. In the Explorer pane, at your logic app project's root, move your mouse pointer over any blank area under the project's files and folders, open the shortcut menu, and select **Use SQL storage for your logic app project**.

   :::image type="content" source="media/set-up-sql-database-storage-standard/use-sql-storage-logic-app-project.png" alt-text="Screenshot shows Visual Studio Code, Explorer pane, and mouse pointer at project root in blank area, opened shortcut menu, and selected option for Use SQL storage for your logic app project." lightbox="media/set-up-sql-database-storage-standard/use-sql-storage-logic-app-project.png":::

1. When the prompt appears, enter your SQL connection string. You can choose a local SQL Express instance or any other SQL database that you have.

   :::image type="content" source="media/set-up-sql-database-storage-standard/enter-sql-connection-string.png" alt-text="Screenshot shows SQL connection string prompt." lightbox="media/set-up-sql-database-storage-standard/enter-sql-connection-string.png":::

   After confirmation, Visual Studio Code creates the following setting in your project's *local.settings.json* file. You can update this setting at any time.

   :::image type="content" source="media/set-up-sql-database-storage-standard/local-settings-json-file.png" alt-text="Screenshot shows logic app project and open file named local.settings.json with SQL connection string setting." lightbox="media/set-up-sql-database-storage-standard/local-settings-json-file.png":::

<a name="set-up-sql-logic-app-deployment-visual-studio-code"></a>

## Set up SQL during Hybrid deployment from Visual Studio Code

You can publish your logic app project from Visual Studio Code to a Hybrid Logic App. SQL storage isn't supported when you deploy to a regular Azure-hosted Logic Apps Standard resource.

- If you're publishing your project as a new Hybrid Logic App and want SQL as the storage provider, enter your SQL connection string when you publish your app. For complete steps, see [Set up SQL for a new Hybrid Logic App deployment](#deploy-new-logic-app-visual-studio-code).

- If you already set up your SQL settings, you can publish your logic app project to an existing Hybrid Logic App. This action overwrites your existing logic app.

  > [!NOTE]
  >
   > Use Local SQL Express for local development and testing. It isn't a storage provider for regular Azure-hosted Logic Apps Standard.

<a name="deploy-new-logic-app-visual-studio-code"></a>

### Set up SQL for a new Hybrid Logic App deployment

1. In Visual Studio Code, open the Explorer pane, if not already open.

1. In the Explorer pane, at your logic app project's root, move your mouse pointer over any blank area under the project's files and folders, open the shortcut menu, and select **Deploy to logic app**.

1. If prompted, select the Azure subscription for your logic app deployment.

1. From the list that Visual Studio Code opens, make sure to select the advanced option for **Create new Logic App (Standard) in Azure Advanced**. Otherwise, you're not prompted to set up SQL.

   :::image type="content" source="media/set-up-sql-database-storage-standard/select-create-logic-app-advanced.png" alt-text="Screenshot shows selected deployment option to create new Standard logic app in Azure Advanced." lightbox="media/set-up-sql-database-storage-standard/select-create-logic-app-advanced.png":::

1. When prompted, enter a globally unique name for your new logic app, which is the name for the Standard logic app resource. This example uses `Fabrikam-Workflows-App`.

   :::image type="content" source="media/set-up-sql-database-storage-standard/enter-logic-app-name.png" alt-text="Screenshot shows prompt for a globally unique name for your logic app." lightbox="media/set-up-sql-database-storage-standard/enter-logic-app-name.png":::

1. Select the connected environment for your own infrastructure and choose **Hybrid** as the hosting plan type. SQL storage isn't supported for the **Workflow Standard** or **App Service Plan** hosting options.

1. When you're prompted for an Azure resource group, for optimal performance, select the same Azure resource group as your project for your deployment.

   > [!NOTE]
   >
   > Although you can create or choose a different resource group, doing so might affect performance. If you create or choose a different resource group, but cancel after the confirmation prompt appears, your deployment is also canceled.

1. Select the **Connected Environment** to use.

1. When prompted to select a storage provider for your Hybrid Logic App, select the SQL option and provide the required SQL connection string and artifact file share settings.

1. At the SQL storage confirmation prompt, select **Yes**. At the connection string prompt, enter your SQL connection string.

   > [!NOTE]
   >
   > Make sure that you enter a correct connection string because Visual Studio Code doesn't validate this string for you.

   :::image type="content" source="media/set-up-sql-database-storage-standard/enter-sql-connection-string.png" alt-text="Screenshot shows Visual Studio Code and SQL connection string prompt.":::

1. Finish the remaining deployment steps for your Hybrid Logic App.

When you're done, your Hybrid Logic App uses your SQL database as its runtime storage provider.

## Validate deployments

After you deploy your Hybrid Logic App, check whether your settings are correct:

1. In the [Azure portal](https://portal.azure.com), open your logic app resource.

1. On the resource navigation menu, under **Settings**, select **Configuration**.

1. On the **Configuration** pane, under **Application settings**, find the **Workflows.Sql.ConnectionString** app setting, and confirm that your SQL connection string appears and is correct.

1. In your SQL environment, confirm that the Hybrid Logic Apps runtime initialized its required schema and tables.

The runtime manages these database objects. Don't change or remove them manually.

For example, the following screenshot shows tables created by the Hybrid Logic Apps runtime:

:::image type="content" source="media/set-up-sql-database-storage-standard/runtime-created-tables-sql.png" alt-text="Screenshot shows SQL tables created by the Hybrid Logic Apps runtime.":::

The Hybrid Logic Apps runtime also creates user-defined table types. For example, the following screenshot shows user-defined table types created by the runtime:

:::image type="content" source="media/set-up-sql-database-storage-standard/runtime-created-user-defined-tables-sql.png" alt-text="Screenshot shows SQL user-defined table types created by the Hybrid Logic Apps runtime.":::

## Related content

- [What is Azure Logic Apps?](logic-apps-overview.md)
- [Single-tenant versus multitenant in Azure Logic Apps](single-tenant-overview-compare.md)
- [Create Standard workflows in Azure Logic Apps with Visual Studio Code](create-single-tenant-workflows-visual-studio-code.md)
- [Edit host and app settings for Standard logic apps](edit-app-settings-host-settings.md)
