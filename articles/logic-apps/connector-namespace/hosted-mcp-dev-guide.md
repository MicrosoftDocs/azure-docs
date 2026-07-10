---
title: Developer Guide for Hosted MCP Servers
titleSuffix: Azure Connector Namespace
description: Learn how to configure server deployments, authentication, observability, and access policies for hosted MCP servers in Connector Namespace.
author: lilyjma
ms.author: jiayma
ms.reviewer: glenga
ms.date: 06/02/2026
ms.topic: concept-article
ms.service: azure-logic-apps
ms.custom: ai-assisted
# Customer intent: As a developer, I want to understand the configuration options and requirements for hosted MCP servers so that I can set them up correctly.
---

# Developer guide for hosted MCP servers (preview)

> [!IMPORTANT]
> This preview feature is subject to the
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

This guide covers features, configuration details, and requirements for hosted Model Context Protocol (MCP) servers in Azure Connector Namespace. For an overview of hosted MCP servers, see [Hosted MCP servers in Azure Connector Namespace](connector-namespace-hosted-mcp.md).

## Supported regions

During the preview, hosted MCP servers are available in the following regions:

- West Central US
- East Asia
- Central US
- North Europe

## Access to the Connector Namespace portal

You manage hosted MCP servers and their namespaces in the Connector Namespace portal. You can access it two ways:

- **Through the Azure portal**. Open a provisioned namespace resource in the [Azure portal](https://portal.azure.com/), which links you into the Connector Namespace portal for that namespace.
- **Directly**. Go to the [web portal](https://connectors.azure.com/) and select your namespace.

## Authentication

Hosted MCP servers involve two authentication boundaries.

### Inbound authentication

Inbound authentication helps secure the connection between MCP clients and the hosted server. The namespace provides OAuth-based authentication with Microsoft Entra ID out of the box.

### Outbound authentication

Outbound authentication helps secure the connection between the hosted server and the downstream service that it interacts with. Servers support the following mechanisms:

| Method | Description |
| ------ | ----------- |
| **Managed identity** | The server authenticates to the downstream service by using a managed identity assigned to the namespace. No credential management is required. |
| **On-behalf-of (OBO)** | The server uses the calling user's identity to authenticate to the downstream service, which enables delegated access scenarios. |

### Managed identity options

When you use a managed identity for outbound authentication, you can choose either:

- **System-assigned managed identity (SAMI)**. Automatically created and assigned to a namespace when you enable it during namespace creation. It's tied to the namespace lifecycle, so it's deleted when the namespace is deleted.
- **User-assigned managed identity (UAMI)**. A standalone Azure resource that you create and assign to the namespace. It persists independently and can be reused across resources.

### Steps for adding a user-assigned managed identity to your namespace

When you use a UAMI, you *must* add that identity to the namespace. Otherwise, the server can't authenticate to downstream services.

To add a UAMI to your namespace:

1. In the [web portal](https://connectors.azure.com/), go to the namespace instance.

1. On the left menu, select the **Identity** tab.

1. In the **User Assigned** section, select the **+Add** button.

1. Search for the desired managed identity, and then select **Add**.

1. Select **Save** on the upper right to save the change.

## Integration with Application Insights

You can configure the server to send logs and metrics to a specified Application Insights resource. The server creation flow provides a way to configure immediately after creation. If you missed it, follow these steps:

1. In the [web portal](https://connectors.azure.com/), go to the namespace instance.

1. In the **Monitoring** section, select **Enable monitoring**.

1. Enter the Application Insights resource's [connection string](/azure/azure-monitor/app/create-workspace-resource#get-the-connection-string), and then select **Enable**.

To view server logs:

1. Go to the Azure portal and find the Application Insights resource that you configured.

1. On the left menu, select **Investigate** > **Search**.

1. Set the **Local Time** filter to the desired time range. View the logs as traces or individual items.

## Access policy

Configuring an access policy allows you to control who has access to your hosted MCP server. When you create a server, a policy is automatically created for you. You can add policies to grant others access to the server.

You can add an access policy for individual users or a group. To create a group, see [Manage groups in Microsoft Entra ID](/entra/fundamentals/how-to-manage-groups).

To add an access policy:

1. In the [web portal](https://connectors.azure.com/), go to the namespace instance.

1. Select the **MCP Connectors** tab on the left menu and open your server.

1. Inside the server, select the **Access Policies** tab.

1. Select the **+ Add Access Policy** button.

1. Choose your desired **Principal Type** value.

1. Enter the **Principal Object ID** value. You can find it in the [Microsoft Entra admin center](https://entra.microsoft.com/).

1. Enter the **Tenant ID** value for your subscription.

## Server deployment requirements

Most hosted MCP servers deploy without additional artifacts. You select the server from the catalog, and the namespace provisions it. Some servers require extra configuration during deployment.

### Azure SQL

The Azure SQL MCP server is built on [Data API builder (DAB)](/azure/data-api-builder/mcp/overview). DAB provides a secure data API layer over your database and exposes the entities that you select as MCP tools that agents can call.

Rather than connecting agents directly to the database, the server runs DAB. DAB enforces the entity definitions and per-entity permissions that you specify, so agents can access only the data and operations that you explicitly expose.

Azure SQL requires a DAB configuration file that defines:

- The database connection string.
- The entities (tables or views) to expose.
- Permissions for each entity.

To generate this file, install the [DAB CLI](/azure/data-api-builder/how-to-install-cli). Then run the following command to enable only MCP (because DAB also supports GraphQL and REST endpoints):

```bash
dab init --database-type "mssql" --host-mode "Development" --graphql.enabled false --rest.enabled false --connection-string "<your-connection-string>"
```

The form of the connection string depends on the type of managed identity that you use for the server to access the database.

#### [System assigned (SAMI)](#tab/sami)

```
Server=<your-sql-server>.database.windows.net;Database=<your-database>;Authentication=Active Directory Default;Encrypt=True;TrustServerCertificate=False;
```

#### [User assigned (UAMI)](#tab/uami)

```
Server=<your-sql-server>.database.windows.net;Database=<your-database>;Authentication=Active Directory Managed Identity;User Id=<your-uami-client-id>;Encrypt=True;TrustServerCertificate=False;
```

---

After you generate the file, you also need to add entities and related permissions. The following command adds `Books` as an example:

```bash
dab add Books --source "dbo.Books" --permissions "anonymous:*"
```

For details on configuring entities and permissions, see the [overview of Data API builder authorization](/azure/data-api-builder/concept/security/authorization-overview).

Upload the generated configuration file ([example](./hosted-mcp-quickstart.md#generate-the-dab-configuration-file)) during server deployment in the namespace portal.

#### Grant managed identity access

After deployment, grant the managed identity access to the database. In the Azure portal, run the following command in **Query editor** for the SQL database (signed in as an admin) to grant permissions. Be sure to choose the correct query for your identity type.

#### [System assigned (SAMI)](#tab/sami)

```sql
CREATE USER [<your-connector-namespace-name>] FROM EXTERNAL PROVIDER;
ALTER ROLE db_datareader ADD MEMBER [<your-connector-namespace-name>];
ALTER ROLE db_datawriter ADD MEMBER [<your-connector-namespace-name>];
GRANT VIEW DEFINITION TO [<your-connector-namespace-name>];
```

#### [User assigned (UAMI)](#tab/uami)

```sql
CREATE USER [<your-uami-name>] FROM EXTERNAL PROVIDER;
ALTER ROLE db_datareader ADD MEMBER [<your-uami-name>];
ALTER ROLE db_datawriter ADD MEMBER [<your-uami-name>];
GRANT VIEW DEFINITION TO [<your-uami-name>];
```

---

To verify that you created the identity:

```sql
SELECT name, type_desc, authentication_type_desc
FROM sys.database_principals
WHERE type IN ('E', 'X')
ORDER BY name;
-- Expected: <identity-name> | EXTERNAL_USER | EXTERNAL
```

## Related content

- [Overview of hosted MCP servers](connector-namespace-hosted-mcp.md)
- [Quickstart: Create a hosted MCP server](hosted-mcp-quickstart.md)
- [What is Azure Connector Namespace?](connector-namespace-overview.md)
