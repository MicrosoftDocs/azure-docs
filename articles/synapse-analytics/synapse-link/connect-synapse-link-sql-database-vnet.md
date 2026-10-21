---
title: Configure Azure Synapse Link for Azure SQL Database with network security
description: Learn how to configure Azure Synapse Link for Azure SQL Database with network security.
author: juluczni
ms.author: juluczni
ms.reviewer: wiassaf, imotiwala
ms.service: azure-synapse-analytics
ms.topic: how-to
ms.subservice: synapse-link
ms.date: 10/31/2025
ms.update-cycle: 1825-days
ms.custom: sfi-image-nochange
---

# Configure Azure Synapse Link for Azure SQL Database with network security

This article is a guide for configuring Azure Synapse Link for Azure SQL Database with network security. Before you begin, you should know how to create and start Azure Synapse Link for Azure SQL Database from [Get started with Azure Synapse Link for Azure SQL Database](connect-synapse-link-sql-database.md). 

> [!IMPORTANT]
> **Mirroring to Microsoft Fabric is now available.** Mirroring to Fabric provides all the capabilities of Azure Synapse Link with better analytical performance, the ability to unify your data estate with OneLake in Fabric, and open access to your data in Delta Parquet format. Instead of Azure Synapse Link, use Fabric Mirroring. 
>
> With Mirroring to Microsoft Fabric, you can continuously replicate your existing data estate directly into OneLake in Fabric, including data from Azure SQL Database, SQL Server 2016+, Azure SQL Managed Instance, Oracle, Snowflake, Cosmos DB, and more. 
> 
> For more information, see [Microsoft Fabric mirrored databases](/fabric/database/mirrored-database/overview).

## Create a managed workspace virtual network without data exfiltration

In this section, you create an Azure Synapse workspace with a managed virtual network enabled. For **Managed virtual network**, you'll select **Enable**, and for **Allow outbound data traffic only to approved targets**, you'll select **No**. For an overview, see [Azure Synapse Analytics managed virtual network](../security/synapse-workspace-managed-vnet.md).

:::image type="content" source="../media/connect-synapse-link-sql-database/create-synapse-workspace-allow-outbound-traffic.png" alt-text="Screenshot that shows how to create an Azure Synapse workspace that allows outbound traffic.":::

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Go to your Azure Synapse workspace, select **Networking**, and then select the **Allow Azure Synapse Link for Azure SQL Database to bypass firewall rules** checkbox.

   :::image type="content" source="../media/connect-synapse-link-sql-database/enable-bypass-firewall-rules.png" alt-text="Screenshot that shows how to enable bypassing firewall rules.":::

1. Open Synapse Studio, go to **Manage**, select **Integration runtimes**, and then select **AutoResolvingIntegrationRuntime**. 

1. In the pop-up window, select the **Virtual network** tab, and then enable **Interactive authoring**. 

   :::image type="content" source="../media/connect-synapse-link-sql-database/enable-interactive-authoring.png" alt-text="Screenshot that shows how to enable interactive authoring.":::

1. From the **Integrate** pane, create a link connection to replicate data from your Azure SQL database to an Azure Synapse SQL pool.

   :::image type="content" source="../media/connect-synapse-link-sql-database/create-link.png" alt-text="Screenshot that shows how to create a link to an Azure Synapse SQL pool.":::

   :::image type="content" source="../media/connect-synapse-link-sql-database/create-link-sql-db.png" alt-text="Screenshot that shows how to create a link connection from an Azure SQL database.":::

1. Start your link connection.

   :::image type="content" source="../media/connect-synapse-link-sql-database/start-link.png" alt-text="Screenshot of starting a link connection.":::

## Create a managed workspace virtual network with data exfiltration

In this section, you create an Azure Synapse workspace with managed virtual network enabled. You'll enable **Managed virtual network**, and you'll select **Yes** to limit outbound traffic from the managed workspace virtual network to targets through managed private endpoints. For an overview, see [Azure Synapse Analytics managed virtual network](../security/synapse-workspace-managed-vnet.md).

:::image type="content" source="../media/connect-synapse-link-sql-database/create-synapse-workspace-disallow-outbound-traffic.png" alt-text="Screenshot that shows how to create an Azure Synapse workspace that disallows outbound traffic.":::

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Go to your Azure Synapse workspace, select **Networking**, and then select the **Allow Azure Synapse Link for Azure SQL Database to bypass firewall rules** checkbox.

   :::image type="content" source="../media/connect-synapse-link-sql-database/enable-bypass-firewall-rules.png" alt-text="Screenshot that shows how to enable bypassing firewall rules.":::

1. Open Synapse Studio, go to **Manage**, select **Integration runtimes**, and then select **AutoResolvingIntegrationRuntime**. 

1. In the pop-up window, select the **Virtual network** tab, and then enable **Interactive authoring**. 

   :::image type="content" source="../media/connect-synapse-link-sql-database/enable-interactive-authoring.png" alt-text="Screenshot that shows how to enable interactive authoring.":::

1. Create a linked service that connects to your Azure SQL database with a managed private endpoint enabled.

   a. Create a linked service that connects to your Azure SQL database.
   
      :::image type="content" source="../media/connect-synapse-link-sql-database/new-sql-db-linked-service-pe.png" alt-text="Screenshot of a new Azure SQL database linked service private endpoint.":::

   b. Create a managed private endpoint in a linked service for the Azure SQL database.
   
     :::image type="content" source="../media/connect-synapse-link-sql-database/new-sql-db-linked-service-pe1.png" alt-text="Screenshot of a new Azure SQL database linked service private endpoint 1.":::

   c. Complete the managed private endpoint creation in the linked service for the Azure SQL database.
   
     :::image type="content" source="../media/connect-synapse-link-sql-database/new-sql-db-linked-service-pe2.png" alt-text="Screenshot of a new Azure SQL database linked service private endpoint 2.":::

   d. Go to the Azure portal for your SQL Server instance that hosts an Azure SQL database as a source store, and then approve the private endpoint connections.
   
     :::image type="content" source="../media/connect-synapse-link-sql-database/new-sql-db-linked-service-pe3.png" alt-text="Screenshot of a new Azure SQL database linked service private endpoint 3.":::
         
1. Now you can create a link connection from the **Integrate** pane to replicate data from your Azure SQL database to an Azure Synapse SQL pool.

   :::image type="content" source="../media/connect-synapse-link-sql-database/create-link.png" alt-text="Screenshot that shows how to create a link.":::

   :::image type="content" source="../media/connect-synapse-link-sql-database/create-link-sql-db.png" alt-text="Screenshot of creating a link to the SQL database.":::

1. Start your link connection.

   :::image type="content" source="../media/connect-synapse-link-sql-database/start-link.png" alt-text="Screenshot that shows how to start the link connection.":::
 
## Configure Network Security Perimeter for Azure SQL Database

Azure Synapse Link for Azure SQL Database is a user-initiated scenario that connects Azure SQL Database to an Azure Synapse workspace and dedicated SQL pool.

With Network Security Perimeter (NSP), this interaction requires both inbound and outbound connectivity:

- **Inbound access:**  Allow the subscription containing the Azure Synapse workspace to access the Azure SQL logical server. Azure Synapse uses this connectivity during initial setup, validation, and ongoing orchestration of the link connection.
- **Outbound access:** Allow Azure SQL Database to connect to the destination FQDN used by Azure Synapse Link to send replicated data to the Azure Synapse Link destination. 

In Enforced mode, both access paths must be configured for Synapse Link to work end to end. A missing inbound rule can prevent Synapse Link setup, while a missing outbound rule can prevent setup or cause replication to stop at runtime.


### Supported configurations

Azure SQL Database can be associated with an NSP in either Transition or Enforced mode.

- In **Transition mode**, NSP access rules aren't enforced. Before switching the NSP to Enforced mode, configure the required inbound and outbound rules.
- In **Enforced mode**, both the required inbound rule and outbound FQDN rule must be configured for Synapse Link to work successfully.

Azure Synapse dedicated SQL pools don't support NSP. For the Synapse Link scenario, the NSP configuration described in this article applies to the Azure SQL Database side of the connection.

### Configure NSP access rules

To configure Synapse Link with NSP:

1. Associate the Azure SQL logical server with an NSP.
1. Add an inbound access rule that allows the subscription containing the Azure Synapse workspace.
1. Add an outbound access rule for the destination FQDN used by Azure Synapse Link.

The destination FQDN can vary by environment. If the appropriate outbound rule isn't configured, error 22651 identifies the FQDN that must be added to the NSP outbound rules.

For example, an endpoint might use the following format:

`{synapse-workspace-name}.dev.azuresynapse.net`

Use the FQDN reported by error 22651 or the relevant diagnostic information rather than assuming a fixed endpoint.

A full wildcard (`*`) can be used in an NSP outbound rule to allow all FQDNs, but this configuration is less restrictive and isn't recommended. Partial wildcard FQDNs aren't supported.

Before switching the NSP from Transition mode to Enforced mode, verify that both the inbound subscription rule and the required outbound FQDN rule are configured.

### Common errors

The following errors can indicate an NSP configuration issue with Synapse Link:

| Error | Description | Corrective action |
| --- | --- | --- |
| **42118** | Login fails because NSP denies inbound access. This occurs when NSP is in Enforced mode and no valid inbound rule allows the Synapse workspace to access Azure SQL Database. | Add an inbound rule that allows the subscription containing the Synapse workspace. |
| **42121** | A runtime connection attempt is denied by the configured NSP. This can occur when an outbound destination that was previously accessible is no longer allowed. | Add the required destination FQDN to the NSP outbound rules. |
| **22651** | Public network access for the logical server is configured as `SECURED_BY_PERIMETER`, but the destination FQDN isn't present in the allowed outbound rules. This error is typically encountered during Synapse Link setup. | Add the FQDN reported in the error message to the NSP outbound rules and retry the operation. |
| **22652** | Public network access for the logical server is configured as `SECURED_BY_PERIMETER`, but the logical server isn't associated with an NSP. | Associate an NSP with the logical server or change the `PublicNetworkAccess` configuration as appropriate. |

Error 22651 and error 42121 represent different stages of the Synapse Link connection. Error 22651 is a setup-time error. If the destination FQDN isn't allowed when the link is created, setup fails before replication begins. Error 42121 can occur at runtime if setup previously succeeded but the NSP configuration no longer permits the required connection.

### Troubleshoot Synapse Link with NSP

Review NSP diagnostic information for denied connections and verify that the appropriate inbound and outbound rules are configured.

When a link connection is created or started and the required destination FQDN isn't allowed, setup fails immediately and the error is returned to the caller. In Synapse Studio, go to **Monitor > Link connections** to view the failure. A blocked outbound FQDN can appear as `EnableSourceFailure`.

You can also retrieve detailed link connection status by using the link-connection monitoring REST API:

`GET {workspace}.dev.azuresynapse.net/linkconnections/{name}/detailedStatus?api-version=2021-06-01-preview`

When the outbound FQDN is blocked, the response can return `status: "Stopped"` with `error.errorCode = "EnableSourceFailure"` and the 22651 message in `error.message`.

For an already configured link connection, failures that occur during snapshot or incremental replication can be recorded in `sys.dm_change_feed_errors`.

If an error identifies a blocked destination FQDN, add the reported FQDN to the NSP outbound rules and retry the operation.

## Next steps

If you're using a database other than an Azure SQL database, see:

* [Configure Azure Synapse Link for Azure Cosmos DB](/azure/cosmos-db/configure-synapse-link?context=/azure/synapse-analytics/context/context)
* [Configure Azure Synapse Link for Dataverse](/powerapps/maker/data-platform/azure-synapse-link-synapse?context=/azure/synapse-analytics/context/context)
* [Get started with Azure Synapse Link for SQL Server 2022](connect-synapse-link-sql-server-2022.md)
