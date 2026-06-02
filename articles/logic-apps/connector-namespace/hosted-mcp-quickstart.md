---
title: "Quickstart: Create a hosted MCP server in Azure Connector Namespace"
description: Learn how to create a hosted MCP server in an Azure Connector Namespace and connect it to AI agents and MCP-aware clients.
author: lilyjma
ms.author: jiayma
ms.reviewer: glenga
ms.date: 05/21/2026
ms.topic: quickstart
ms.service: azure-logic-apps
ms.custom: ai-assisted
zone_pivot_groups: connector-namespace-hosted-servers
# Customer intent: As a developer, I want to create a hosted MCP server in my connector namespace so that AI agents and MCP-aware clients can discover and call tools without managing infrastructure.
---

# Quickstart: Create a hosted MCP server in Azure Connector Namespace (preview)

> [!IMPORTANT]
>
> This preview feature is subject to the
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

In this quickstart, you create a hosted MCP server in Azure Connector Namespace and connect it to MCP clients. 

## Connector Namespace and hosted MCP server

Azure Connector Namespace is a fully managed service that hosts connectors, connections, triggers, and MCP servers. Within a namespace, an *MCP server* is a first-class resource that exposes tools to AI agents over the [Model Context Protocol (MCP)](https://modelcontextprotocol.io/).

When you create a [hosted MCP server](./connector-namespace-hosted-mcp.md) in Connector Namespace, the platform runs a pre-built image of the server in dedicated compute that it provisions. You control server configuration, environment variables, and parameters, while the namespace handles hosting, scaling, and credential management. AI agents like Copilot, custom agents, or any MCP-aware client discover and call the server's tools using the namespace's connection model.  

Hosted MCP servers differ from [managed MCP servers](./connector-namespace-overview.md#key-concepts), which are platform-managed implementations built on connectors. The namespace handles tool definitions and configuration for managed servers.

## Prerequisites

- An Azure account and subscription. If you don't have one, [create a free Azure account](https://azure.microsoft.com/free/).

- [Visual Studio Code](https://code.visualstudio.com/) installed.

- [Azure CLI](/cli/azure/install-azure-cli) installed. 

- An existing Connector Namespace resource. If you don't have one, [create a Connector Namespace](create-connector-namespace.md).

- An existing Application Insights resource. If you don't have one, [create an Application Insights](/azure/azure-monitor/app/create-workspace-resource#create-an-application-insights-resource).

::: zone pivot="sql"

- An Azure SQL Database server with a database. If you don't have one, [create an Azure SQL database](azure/azure-sql/database/scripts/create-and-configure-database-cli).

- [Data API builder (DAB) CLI](/azure/data-api-builder/quickstart/basic-sql.md#install-the-data-api-builder-cli) installed.

## Seed the SQL database

1. In the Azure Portal, navigate to your SQL Database (*not* the server).

1. On the left menu, click **Query editor** and sign in as the database admin.

1. Click **New query** and run the following to seed the database:

   ```sql
   CREATE TABLE dbo.Books
   (
      Id int IDENTITY(1,1) PRIMARY KEY,
      Title nvarchar(200) NOT NULL
   );

   INSERT INTO dbo.Books (Title) VALUES (N'The little prince');
   INSERT INTO dbo.Books (Title) VALUES (N'Pride and prejudice');
   ```

## Generate the Data API Builder (DAB) configuration file 

This file is required by the server. 

1. Generate a DAB configuration file for your database, enabling only MCP: 

   ```bash
   dab init --database-type "mssql" --host-mode "Development" --graphql.enabled false --rest.enabled false --connection-string "<your-sql-connection-string>"
   ```

   Since the server will access the underlying database using a system assigned managed identity (SAMI), the connection string should be the following:

   ```bash
   Server=<your-sql-server>.database.windows.net;Database=<your-database>;Authentication=Active Directory Default;Encrypt=True;TrustServerCertificate=False;
   ``` 
1. Add the **Books** entity (table): 

   ```bash
   dab add Books --source "dbo.Books" --permissions "anonymous:*"
   ```

   For details on configuring entities and permissions, see [Data API builder authorization](azure/data-api-builder/concept/security/authorization-overview).

   Example configuration file:
   ```json
   {
      "$schema": "https://github.com/Azure/data-api-builder/releases/download/v1.7.93/dab.draft.schema.json",
      "data-source": {
         "database-type": "mssql",
         "connection-string": "Server=<your-sql-server>.database.windows.net;Database=<your-database>;Authentication=Active Directory Default;Encrypt=True;TrustServerCertificate=False;",
         "options": {
            "set-session-context": false
         }
      },
      "runtime": {
         "rest": {
            "enabled": false,
            "path": "/api",
            "request-body-strict": true
         },
         "graphql": {
            "enabled": false,
            "path": "/graphql",
            "allow-introspection": true
         },
         "mcp": {
            "enabled": true,
            "path": "/mcp"
         },
         "host": {
            "cors": {
               "origins": [],
               "allow-credentials": false
            },
            "authentication": {
               "provider": "AppService"
            },
            "mode": "development"
         }
      },
      "entities": {
         "Books": {
            "source": {
               "object": "dbo.Books",
               "type": "table"
            },
            "graphql": {
               "enabled": true,
               "type": {
                  "singular": "Books",
                  "plural": "Books"
               }
            },
            "rest": {
               "enabled": true
            },
            "permissions": [
               {
                  "role": "anonymous",
                  "actions": [
                     {
                     "action": "*"
                     }
                  ]
               }
            ]
         }
      }
   }
   ```
::: zone-end

## Create a hosted MCP server

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for your **Connector Namespace** resource.

1. Select **Connect to Namespace** to open the namespace portal in a new browser tab.

1. When redirected, sign in by using your Microsoft account associated with the namespace.

1. Inside the namespace instance, look for the **MCP connector** section and click the **+ Create** button. 

::: zone pivot="playwright"

6. Search for **Playwright** and pick the server to be deployed.

::: zone-end

::: zone pivot="sql"

6. Search for **Azure SQL** and pick the server to be deployed.

7. In the creation window, select **Manage Identity** for Outbound Authentication method.  

8. Upload the DAB configuration file generated earlier.

9. Click **Create**.

::: zone-end

Wait for the required connection and server to be provisioned and deployed. Don't close the create pop-up after deployment. You'll set up an Application Insights resource to collect telemetry from your server. 

### Enable monitoring on the server

1. Open another tab to [get the connection string](/azure/azure-monitor/app/create-workspace-resource#get-the-connection-string) of your Application Insights resource on Azure portal.

1. Go back to the namespace portal and click **Enable monitoring**.

1. Paste the connection string into the box and click **Enable**.

1. Click **Done** when App Insights is configured.  

You should be automatically directed to the deployed server's **Overview** page where you can find the endpoint. If not, click the **MCP Connectors** tab on the left menu and find the server you deployed. 

::: zone pivot="sql"

### Grant the namespace identity access to database

The hosted SQL server uses the namespace's system-assigned managed identity (SAMI) to access your database, which you can enable during namespace creation. 

If you didn't enable SAMI during creation, you can enable it by going to your namespace instance in the web portal. On the left menu, find the **Identity** tab. Toggle **System Assigned** to **On** and save the update.

Go to your SQL database on the Azure portal, open the **Query editor** and run the following to grant the managed identity access:

```sql
CREATE USER [<your-connector-namespace-name>] FROM EXTERNAL PROVIDER;
ALTER ROLE db_datareader ADD MEMBER [<your-connector-namespace-name>];
ALTER ROLE db_datawriter ADD MEMBER [<your-connector-namespace-name>];
GRANT VIEW DEFINITION TO [<your-connector-namespace-name>];
```

Replace `<your-namespace-name>` with the name of your Connector Namespace resource.

::: zone-end

### Connect from GitHub Copilot in Visual Studio Code

1. To connect your hosted MCP server to GitHub Copilot in VS Code, add the server configuration to your MCP settings:

   ```json
   {
     "servers": {
       "my-hosted-server": {
         "url": "<your-mcp-endpoint-url>",
         "type": "http"
       }
     }
   }
   ```

   Replace `<your-mcp-endpoint-url>` with the endpoint URL you copied from the server's **Overview** page. 

1. Select **Start** above the server name. You're asked to authenticate with Microsoft. Sign in with the email you used to sign in to the Azure portal.

1. You should see the number of tools available above the server name.

::: zone pivot="playwright"

4. Open Copilot agent mode, ask "What is the closest pizzeria to 11 Times Square?" 

::: zone-end

::: zone pivot="sql"

4. Open Copilot agent mode, ask "What tables are available?"

::: zone-end

### Connect from MCP Inspector 

1. From the terminal, run: 

   ```bash
   az login
   ```

   You'll get access token from your `az login` session to connect to the server. 

1. Get access token:

   ```bash
   MCP_TOKEN=$(az account get-access-token --resource https://apihub.azure.com --query accessToken -o tsv)
   ```

1. Make a call to the server to get tools supported:

   ```bash
   npx @modelcontextprotocol/inspector --cli \
   "<your-mcp-endpoint-url>" \
   --transport http \
   --method tools/list \
   --header "Authorization: Bearer $MCP_TOKEN"
   ```

::: zone pivot="playwright"

4. Call a specific tool. For example, the following calls the `browser_navigate` tool: 

   ```bash
   npx @modelcontextprotocol/inspector --cli \
   "<your-mcp-endpoint-url>" \
   --transport http \
   --method tools/call \
   --tool-name browser_navigate \
   --tool-arg url="https://www.google.com/search?q=pizza+near+11+Times+Square+New+York" \
   --header "Authorization: Bearer $MCP_TOKEN"
   ```

::: zone-end

::: zone pivot="sql"

4. Call a specific tool. For example, the following calls the `describe_entities` tool to list available tables or entities:

   ```bash
   npx @modelcontextprotocol/inspector --cli \
   "<your-mcp-endpoint-url>" \
   --transport http \
   --method tools/call \
   --header "Authorization: Bearer $MCP_TOKEN" \
   --tool-name describe_entities \
   --tool-arg 'nameOnly=true'
   ```

5. Call the `read_records` tool to retrieve records from an entity (`Books`):

   ```bash
   npx @modelcontextprotocol/inspector --cli \
   "<your-mcp-endpoint-url>" \
   --transport http \
   --method tools/call \
   --header "Authorization: Bearer $MCP_TOKEN" \
   --tool-name read_records \
   --tool-arg 'entity=Books' \
   --tool-arg 'first=2'
   ```

::: zone-end

> [!IMPORTANT]
> Manually passing access tokens is suitable only for local development and testing. For production scenarios, use managed identities or OAuth flows to acquire tokens automatically.

## Viewing server logs 

1. Go to the Azure portal and find the Application Insights resource you configured with the MCP server. 

1. On the left menu, find **Investigate -> Search**. 

1. Set the **Local Time** filter on the top to the last 30 minutes. 

## Related articles

- [What is Azure Connector Namespace?](connector-namespace-overview.md)
- [Create and manage connector namespaces](create-connector-namespace.md)