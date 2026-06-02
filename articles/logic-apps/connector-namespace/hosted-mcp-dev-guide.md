---
title: Developer guide for hosted MCP servers in Azure Connector Namespace
description: Learn how to configure server deployments, authentication, observability, and access policies for hosted MCP servers in Connector Namespace.
author: lilyjma
ms.author: jiayma
ms.reviewer: glenga
ms.date: 06/02/2026
ms.topic: concept-article
ms.service: azure-logic-apps
ms.custom: ai-assisted
# Customer intent: As a developer, I want to understand the configuration options and requirements for hosted MCP servers so I can set them up correctly.
---

# Developer guide for hosted MCP servers (preview)

> [!IMPORTANT]
>
> This preview feature is subject to the
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

This guide covers features, configuration details, and requirements for hosted MCP servers in Connector Namespace. For an overview of hosted MCP servers, see [Hosted MCP servers overview](connector-namespace-hosted-mcp.md).

## Supported regions

During preview, hosted MCP servers are available in the following regions:

- West Central US
- East Asia
- Central US
- North Europe

## Authentication

Hosted MCP servers involve two authentication boundaries.

### Inbound authentication

Inbound authentication secures the connection between MCP clients and the hosted server. The namespace provides OAuth-based authentication with Microsoft Entra ID out-of-the-box.

### Outbound authentication

Outbound authentication secures the connection between the hosted server and the downstream service it interacts with. Servers support the following mechanisms:

| Method | Description |
|--------|-------------|
| **Managed identity** | The server authenticates to the downstream service using a managed identity assigned to the namespace. No credential management required. |
| **On-behalf-of (OBO)** | The server uses the calling user's identity to authenticate to the downstream service, enabling delegated access scenarios. |

### Managed identity options

When using managed identity for outbound authentication, you can choose either:

- **System-assigned managed identity (SAMI)**: Automatically created and assigned to namespace when you enable it during namespace creation. Tied to the namespace lifecycle, meaning it's deleted when the namespace is deleted.
- **User-assigned managed identity (UAMI)**: A standalone Azure resource you create and assign to the namespace. Persists independently and can be reused across resources.

### Add user-assigned managed identity to namespace

When using a UAMI, you **must** add that identity to the namespace. Otherwise the server can't authenticate to downstream service(s). 

To add a UAMI to your namespace:

1. Go to the namespace instance in the [web portal](https://connectors.azure.com/).
1. Click the **Identity** tab on the left menu.
1. In the **User Assigned** section, click the **+Add** button. 
1. Search for the desired managed identity, then click **Add**.
1. Click **Save** on the top right to save the change.

## Integration with Application Insights

You can configure the server to send logs and metrics to a specified Application Insights resource. The server creation flow provides a way to configure immediately after creation. If you missed that, follow these steps:

1. Go to the namespace instance in the [web portal](https://connectors.azure.com/).
1. Click **Enable monitoring** in the **Monitoring** section.
1. Enter the the Application Insights resource's [connection string](/azure/azure-monitor/app/create-workspace-resource#get-the-connection-string), then click **Enable**.

To view server logs:
1. Go to the Azure portal and find the Application Insights resource you configured.
1. On the left menu, select **Investigate > Search**.
1. Set the **Local Time** filter to the desired time range. View the logs as *traces* or *invidual items*.

## Access policy

Access policy configuration allows you to control who has access to your hosted MCP server. When you create a server, a policy is automatically created for you. You can add policies to grant others access to the server.

Access policy can be added for individual users or a group. To create a group, see [Manage groups in Microsoft Entra ID](/entra/fundamentals/how-to-manage-groups).

To add an access policy:
1. Go to the namespace instance in the web [portal](https://connectors.azure.com/).
1. Click the **MCP Connectors** tab on the left menu and open your server. 
1. Inside the server, click the **Access Policies** tab on the top. 
1. Click the **+ Add Access Policy** button. 
1. Pick your desired **Principal Type**. 
1. Enter the **Principal Object ID**, which you can find in the [Microsoft Entra admin center](https://entra.microsoft.com/). 
1. Enter the **Tenant ID** of your subscription.

## Server deployment requirements

Most hosted MCP servers deploy without additional artifacts. You select the server from the catalog, and the namespace provisions it. Some servers require extra configuration during deployment.

### Azure SQL

Azure SQL requires a **Data API builder (DAB) configuration file** that defines:

- The database connection string
- The entities (tables/views) to expose
- Permissions for each entity

To generate this file, install the [DAB CLI](/azure/data-api-builder/how-to-install-cli). Then run the following command, enabling only MCP (since the DAB also supports GraphQL and REST endpoints):

```bash
dab init --database-type "mssql" --host-mode "Development" --graphql.enabled false --rest.enabled false --connection-string "<your-connection-string>"
```

Depending on the type of managed identity used (for server to access the database), the connection string takes a different form: 

#### [System-assigned (SAMI)](#tab/sami)
```
Server=<your-sql-server>.database.windows.net;Database=<your-database>;Authentication=Active Directory Default;Encrypt=True;TrustServerCertificate=False;
```

#### [User-assigned (UAMI)](#tab/uami)
```
Server=<your-sql-server>.database.windows.net;Database=<your-database>;Authentication=Active Directory Managed Identity;User Id=<your-uami-client-id>;Encrypt=True;TrustServerCertificate=False;
```
---

After generating the file, you also need to add entities and related permissions. The following adds `Books` as an example:

```bash
dab add Books --source "dbo.Books" --permissions "anonymous:*"
```

For details on configuring entities and permissions, see [Data API builder authorization](/azure/data-api-builder/concept/security/authorization-overview).

Upload the generated configuration file ([example](./hosted-mcp-quickstart.md#generate-the-data-api-builder-dab-configuration-file)) during server deployment in the namespace portal. 

#### Grant managed identity access

After deployment, grant the managed identity access to the database. On the Azure portal, run the following in the SQL Database's **Query editor** (signed in as admin) to grant permissions. Ensure that you pick the correct query for your identity type.

#### [System-assigned (SAMI)](#tab/sami)

```sql
CREATE USER [<your-connector-namespace-name>] FROM EXTERNAL PROVIDER;
ALTER ROLE db_datareader ADD MEMBER [<your-connector-namespace-name>];
ALTER ROLE db_datawriter ADD MEMBER [<your-connector-namespace-name>];
GRANT VIEW DEFINITION TO [<your-connector-namespace-name>];
```

#### [User-assigned (UAMI)](#tab/uami)

```sql
CREATE USER [<your-uami-name>] FROM EXTERNAL PROVIDER;
ALTER ROLE db_datareader ADD MEMBER [<your-uami-name>];
ALTER ROLE db_datawriter ADD MEMBER [<your-uami-name>];
GRANT VIEW DEFINITION TO [<your-uami-name>];
```
---

To verify the identity was created:

```sql
SELECT name, type_desc, authentication_type_desc
FROM sys.database_principals
WHERE type IN ('E', 'X')
ORDER BY name;
-- Expected: <identity-name> | EXTERNAL_USER | EXTERNAL
```

## Related articles

- [Hosted MCP servers overview](connector-namespace-hosted-mcp.md)
- [Quickstart: Create a hosted MCP server](hosted-mcp-quickstart.md)
- [What is Azure Connector Namespace?](connector-namespace-overview.md)






