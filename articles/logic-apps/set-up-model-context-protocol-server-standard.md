---
title: Set up Standard workflows as MCP servers
description: Learn to set up Standard logic apps as remote Model Context Protocol (MCP) servers for use with large language models (LLMs), AI agents, and MCP clients. Expose workflows as tools for agents, models, and MCP clients in AI enterprise integrations.
services: logic-apps
ms.suite: integration
ms.author: kewear
ms.reviewers: estfan, azla
ms.topic: how-to
ms.collection: ce-skilling-ai-copilot
ms.date: 11/18/2025
ms.update-cycle: 180-days
#Customer intent: As an AI integration developer who works with MCP servers and Azure Logic Apps, I want to set up Standard logic app workflows in Azure Logic Apps as tools for one or multiple remote Model Context Protocol (MCP) servers that work with LLMs, AI agents, and MCP clients.
---

# Set up Standard logic apps as remote MCP servers (preview)

[!INCLUDE [logic-apps-sku-standard](../../includes/logic-apps-sku-standard.md)]

> [!NOTE]
>
> The following capability is in preview and is subject to the 
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Typically, large language models (LLMs) work with AI agents that handle and fulfill requests by using prebuilt *tools* that agents call to complete tasks, like send an email, query a database, or trigger a workflow. In Azure Logic Apps, you can jumpstart building these tools by reconfiguring a Standard logic app as a single or multiple *remote* Model Context Protocol (MCP) servers. This capability means that you can expose existing workflows as tools that LLMs, AI agents, and MCP clients can use to interact with enterprise resources and assets. In this context, *remote* means that the MCP server runs outside the environment where the interface for your AI agent interface.

This guide shows how to set up a Standard logic app resource with one or multiple MCP servers and test your servers with an MCP client.

## Why set up logic apps as MCP servers

MCP is an open standard that lets LLMs, AI agents, and MCP clients work with external systems and tools in a secure, discoverable, and structured way. This standard defines how to describe, run, and authenticate access to tools so agents can interact with real-world systems like databases, APIs, and business workflows. Consider an MCP server as a bridge between an LLM, AI agent, or MCP client and the tools they use.

For example, suppose you have a Standard logic app-based MCP server that runs in Azure. On your local computer, Visual Studio Code has an MCP client that you use to remotely connect to your MCP server. This scenario differs from local MCP servers that run on your computer. Under the following list, a diagram shows the relationships between the different components that work together in this scenario:

- The interactions between your MCP client and your MCP server, which provides logic app workflows as tools
- The interactions between your MCP client and the agent or model
- The inputs that go in through the MCP client to the agent or model
- The outputs from the agent or model that go out through the MCP client

:::image type="content" source="media/set-up-model-context-protocol-server-standard/mcp-server-architecture.png" alt-text="Diagram that shows agent or model interactions with MCP client and MCP server components." lightbox="media/set-up-model-context-protocol-server-standard/mcp-server-architecture.png":::

When you logically group multiple MCP servers in a single Standard logic app, this approach provides a more scalable, organized, and flexible way to expose workflows as tools. Each MCP server works as an independent workflow group that your MCP client can individually discover and call.

For more information, see:

- [What is an AI Agent?](/azure/ai-foundry/agents/overview#what-is-an-ai-agent)
- [About LLMs](/training/modules/introduction-large-language-models/2-understand-large-language-models)
- [MCP server concepts](https://modelcontextprotocol.io/docs/learn/server-concepts)
- [MCP client concepts](https://modelcontextprotocol.io/docs/learn/client-concepts)
- [Introduction - Get started with the Model Context Protocol (MCP)](https://modelcontextprotocol.io/docs/getting-started/intro)

The following table describes the benefits from setting up Standard logic apps as remote MCP servers:

| Benefit | Description |
|---------|-------------|
| Reusability | Call existing workflows, connectors, and codeful functions from an AI agent, which gives you extra return on your investments. |
| Flexibility | Choose from more than 1,400 connectors that provide access and actions to work with enterprise assets and resources in the cloud or on premises. |
| Access points | Azure Logic Apps supports different connectivity models for running your MCP server. You can run your server in the cloud, expose your server as a private endpoint, or connect to virtual networks and on-premises resources. |
| Security | When you expose your logic app as an MCP server, you set up a strong security posture so you can meet your enterprise security requirements. By default, MCP endpoints use [OAuth 2.0](/entra/identity-platform/v2-oauth2-auth-code-flow) for authentication and authorization. For more information, see [What is OAuth](https://www.microsoft.com/security/business/security-101/what-is-oauth)? <br><br>You can use *Easy Auth* to secure your MCP server and Standard workflows. Easy Auth is the current name for the native authentication and authorization features in Azure App Service, Azure Functions, and Azure Container Apps. For more information, see [Authentication and authorization in Azure App Service and Azure Functions](../app-service/overview-authentication-authorization.md). |
| Monitoring, governance, and compliance | Azure Logic Apps provides workflow run history and integration with Application Insights or Log Analytics so you get the data necessary to manage and monitor your MCP server tools and support diagnostics, troubleshooting, reporting, traceability, and auditing. |
| Scalability | Host multiple logical MCP servers in a single logic app. Each logical MCP server group contains related workflows. |

Standard logic app based MCP servers support the [Streamable HTTP and Server-Sent Events (SSE) transports for MCP](https://modelcontextprotocol.io/specification/2025-06-18/basic/transports).

## Prerequisites

- An Azure account with an active subscription. [Get a free Azure account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

- The Standard logic app resource and workflows that you want to set up as an MCP server with tools that agents or models can use.

  - This capability applies only to Standard workflows that use the Workflow Service Plan or App Service Environment v3 option.

  - Workflows must start with the **Request** trigger named **When an HTTP request is received** and include the **Response** action.

  - Make sure the logic app resource is running, and the workflow is enabled.

  For more information, see:

  - [Considerations for workflows as tools](#considerations-for-workflows-as-tools)
  - [Create an example Standard logic app workflow using the Azure portal](create-single-tenant-workflows-azure-portal.md)

- An [app registration](/entra/identity-platform/app-objects-and-service-principals?tabs=browser#application-registration) to use in the Easy Auth setup for your logic app.

  This app registration is an identity that your logic app resource uses to delegate identity and access management functions to Microsoft Entra ID.

  For instructions, see [Create an app registration](#create-an-app-registration).

- An MCP client to test your MCP server setup.

  This guide uses [Visual Studio Code](https://code.visualstudio.com/download).

  > [!NOTE]
  >
  > Make sure to use the latest version of Visual Studio Code for MCP server testing. Visual Studio Code 
  > includes generally available MCP support in versions after 1.102. For more information, see 
  > [MCP servers in Visual Studio Code](https://code.visualstudio.com/docs/copilot/chat/mcp-servers).

  For the testing example, you need the [GitHub Copilot extension](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot). For more information, see:

  - [Use extensions in Visual Studio Code](https://code.visualstudio.com/docs/getstarted/extensions)
  - [Set up Copilot in Visual Studio Code](https://code.visualstudio.com/docs/copilot/setup#_set-up-copilot-in-vs-code)
  - [Get started with GitHub Copilot in Visual Studio Code](https://code.visualstudio.com/docs/copilot/getting-started)

- No other requirements exist to use the Streamable HTTP transport. However, to use the Server-Sent Events (SSE) transport, your logic app must meet the following requirements:

  - Your logic app requires virtual network integration. See [Secure traffic between Standard logic apps and Azure virtual networks using private endpoints](secure-single-tenant-workflow-virtual-network-private-endpoint.md).

  - In your logic app resource, the **host.json** file requires that you add and set the `Runtime.Backend.EdgeWorkflowRuntimeTriggerListener.AllowCrossWorkerCommunication` setting to `true`.

## Considerations for workflows as tools

When you build workflows to use as MCP tools, review these considerations and best practices:

To help agents or models find and run tools, add the following metadata to the **Request** trigger and request payloads. This metadata improves the agent's reliability and accuracy when using tools.

> [!TIP]
>
> The following steps use the Azure portal, but you can alternatively use Visual Studio Code.

- Trigger description

  Your MCP server uses this metadata as the tool description to show end users and to route requests to the correct tool, for example:

  :::image type="content" source="media/set-up-model-context-protocol-server-standard/trigger-description.png" alt-text="Screenshot shows trigger information pane with description box and example description." lightbox="media/set-up-model-context-protocol-server-standard/trigger-description.png":::

  To add this description, follow these steps:

  1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource and workflow.

  1. In the workflow sidebar, under **Tools**, select the designer to open the workflow.

  1. In the designer, select the **Request** trigger.

  1. In the trigger information pane, under the trigger name, describe the purpose for the trigger and workflow.

- Input parameter descriptions

  This metadata improves the agent's accuracy in passing the correct inputs to tools at runtime, for example:

  :::image type="content" source="media/set-up-model-context-protocol-server-standard/input-parameter-descriptions.png" alt-text="Screenshot shows trigger information pane with Request Body Json Schema box and example descriptions for input parameters." lightbox="media/set-up-model-context-protocol-server-standard/input-parameter-descriptions.png":::

  To add a description for each input parameter, follow these steps:

  1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource and workflow.

  1. In the workflow sidebar, under **Tools**, select the designer to open the workflow.

     > [!NOTE]
     >
     > You can also use code view to add this information. 

  1. In the designer, select the **Request** trigger.

  1. In the trigger information pane, under **Request Body JSON Schema**, enter a schema for the expected request content payload.

     - For each input parameter, add the `description` attribute and the corresponding description.

     - If your tool requires specific parameters to run, include them as required parameters by adding the `required` object and an array with these parameters.

     The following example shows sample input parameters, descriptions, and required parameters:

     ```json
     {
         "type": "object",
         "properties": {
             "TicketNumber": {
                 "type": "string",
                 "description": "The ticket number for the IT issue."
             },
             "OpenedBy_FirstName": {
                  "type": "string",
                  "description": "The first name for the person who reported the issue."
             },
             "OpenedBy_LastName": {
                  "type": "string",
                  "description": "The last name for the person who reported the issue."
             },
             "Notes": {
                 "type": "string",
                 "description": "Other information to include in the ticket about the issue."
             }
         },
         "required": [
             "TicketNumber",
             "OpenedBy_FirstName",
             "OpenedBy_LastName",
             "Notes"
         ]
     }
     ```

     > [!TIP]
     >
     > If you get inconsistent results when an agent calls and runs your tool, check whether you can make 
     > the trigger and parameter descriptions more unique. For example, try describing the format for parameter inputs. 
     > If a parameter expects a base64 encoded string, include this detail in the parameter description.
     >
     > You can also set up error handling and use the `runAfter` property to return the appropriate 
     > error message to the caller. For more information, see [Manage the "run after" behavior](error-exception-handling.md#manage-the-run-after-behavior).

## Create an app registration

To create an app registration for your logic app to use in your Easy Auth setup, follow these steps:

1. In the [Azure portal](https://portal.azure.com) search box, enter **app registrations**.

1. On the **App registrations** page toolbar, select **New registration**.

1. On the **Register an application** page, provide the following information:

   | Property | Required | Description |
   |----------|----------|-------------|
   | **Name** | Yes | The name for your app registration. |
   | **Supported account types** | Yes | The accounts that can use or access your logic app. |
   | **Redirect URI** | No | Skip this section. |
     
1. When you're done, select **Register**.

1. On the app registration page, copy and save the **Application (client) ID** to use for setting up Easy Auth.

1. On the app registration sidebar, under **Manage**, select **Expose an API**.

1. Next to **Application ID URI**, select **Add**. Keep the default value. Copy and save this value for later use to override the default value, and select **Save**.

1. Under **Scopes defined by this API**, select **Add a scope** to provide granular permissions to your app's users.

   1. On the **Add a scope pane**, provide the following information:

      | Property | Required | Description |
      |----------|----------|-------------|
      | **Scope name** | Yes | A relevant name for the permissions scope. As a recommendation, use the name **`user_impersonation`**, which is the default supported scope in the Azure Logic Apps protected resource data in the MCP server context. <br><br>If you use a different scope, you must override the default scope in your logic app's configuration file (*host.json*) and use the following format:<br><br> `<resource>.<operation>.<constraint>` <br><br>For more information, see [Scopes and permissions in the Microsoft identity platform](/entra/identity-platform/scopes-oidc). |
      | **Who can consent** | Yes | Whether users can also consent to this scope or whether only admins can consent. Use **Admins only** for higher-privileged permissions. Based on your organization's policies, select the option that best aligns with your policies. This example selects **Admins and users**. |
      | **Admin consent display name** | Yes | A short description about the scope's purpose that only admins can see. |
      | **Admin consent description** | Yes | A more detailed description about the permission granted by the scope that only admins can see. |
      | **User consent display name** | No | A short description about the scope's purpose. Only shown to users if you set **Who can consent** to **Admins and users**. If relevant, provide this information. |
      | **User consent description** | No | A more detailed description about the permission granted by the scope. Only shown to users only if you set **Who can consent** to **Admins and users**. If relevant, provide this information. |
      | **State** | Yes | Whether the scope is enabled or disabled. Make sure to select **Enabled**. |

      For more information, see [Add a scope](/entra/identity-platform/quickstart-configure-app-expose-web-apis#add-a-scope).

   1. When you're done, select **Add scope**.

For more information, see [Register an application in Microsoft Entra ID](/entra/identity-platform/quickstart-register-app).

When you finish these steps, you have the following values to use later with your logic app:

- Directory (tenant) ID
- Application (client) ID
- Application ID URI

## Set up Easy Auth for your MCP server

Now set up Easy Auth authentication on the Standard logic app that you want to use as your MCP server.

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource.

1. On the resource sidebar, under **Settings**, select **Authentication**.

1. On the **Authentication** page, select **Add identity provider**.

1. On the **Add an identity provider** page, on the **Basics** tab, for **Identity provider**, select **Microsoft**.

1. In the **App registration** section, provide the following information:

   | Property | Required | Description |
   |----------|----------|-------------|
   | **Application (client) ID** | Yes | The application (client) ID from your previously created app registration. |
   | **Issuer URL** | Yes | The following URL where you replace <*tenant-ID*> with the GUID for your directory (tenant): <br><br> **`https://login.microsoftonline.com/<tenant-ID>/v2.0`** |
   | **Allowed token audiences** | Yes | The application ID URI from your previously created app registration in the following format: <br><br>**`api://<application-ID-URI>/`** <br><br>**Important**: Make sure that you include the trailing slash at the end of the URI, for example: <br><br>**`api://aaaabbbb-0000-cccc-1111-dddd2222eeee/`** |

1. In the **Additional checks** section, select the following options or provide information to further control authentication and access:

   | Property | Required | Description |
   |----------|----------|-------------|
   | **Client application requirement** | Yes | Choose an option: <br><br>- **Allow requests only from this application itself**: Not applicable to MCP server. <br><br>- **Allow requests from specific client applications**: If you know which client applications call your MCP server, you can select these applications from the **Allowed client applications** list. For example, if you use Visual Studio Code, you can add the ID for this client application by editing the **Allowed client applications** list. To find this value, follow these steps: <br><br>1. In the Azure portal search box, find and select **Enterprise applications**. <br>2. On the **All applications** page search box, find and select the application ID for Visual Studio Code. <br><br>- **Allow requests from any application (Not recommended)**: Only when you're unsure what applications call your MCP server. |
   | **Identity requirement** | Yes | To restrict which users can call your MCP server, select **Allow requests from specific identities**, and then from Microsoft Entra ID, from the **Allowed identities** list, select the object IDs for those identities that you allow to call your MCP server. Otherwise, select **Allow requests from any identity**. |
   | **Tenant requirement** | Yes | To deny calls from outside tenants to your MCP server, select **Allow requests from the issuer tenant**. |

1. In the **App Service authentication settings** section, for **Restrict access**, select **Allow unauthenticated access**.

   > [!IMPORTANT]
   >
   > Make sure that **App Service authentication** (Easy Auth) allows unauthenticated access or requests.

1. To finish, select **Add**.

1. Continue on to set up a single or multiple MCP servers in your logic app.

## Set up one or more MCP servers in a logic app

For this task, you need to create an *mcpservers.json* file for your Standard logic app resource. This file contains the configuration for your MCP servers.

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource.

1. On the resource sidebar, under **Development Tools**, select **Advanced Tools** **>** **Go**. If prompted, consent to leave the Azure portal.

1. On the **Kudu** toolbar, from the **Debug console** menu, select **CMD**.

1. From the directory table, go to the following folder: **site/wwwroot**
   
1. If the *mcpservers.json* file doesn't exist, create this file by following these steps:

   1. On the **.../wwwroot** toolbar, select the plus sign (**+**) > **New file**.

   1. For the file name, enter `mcpservers.json`.

   1. In the file list, find the new *mcpservers.json* file. Next to the file name, select **Edit** (pencil icon).

   1. In the editor, add your configuration for one or more MCP servers, for example:

      ```json
      {
         "mcpServers": [
            {
               "name": "mcp-server1",
               "description": "First MCP server",
               "tools": [
                  {
                     "name": "CreateTicket"
                  },
                  {
                     "name": "CloseTicket"
                  }
               ]
            },
            {
               "name": "mcp-server2",
               "description": "Second MCP server",
               "tools": [
                  {
                     "name": "SubmitLeave"
                  },
                  {
                     "name": "ApproveLeave"
                  }
               ]
            }
         ]
      }
      ```

      | Field | Type | Required | Description |
      |------ |------|----------|-------------|
      | `mcpServers` | Array | Yes | The list of MCP server definitions where each represents a logical MCP server. |
      | `mcpServers[].name` | String | Yes | The MCP server name, which appears in the following server endpoint path: `/api/mcpservers/{name}/mcp`. |
      | `mcpServers[].description` | String | No | The optional friendly description for this server. |
      | `mcpServers[].tools` | Array | Yes | The list of tools, which are logic app workflows, exposed by this server. |
      | `mcpServers[].tools[].name` | String | Yes | The tool name, which must match the corresponding workflow name in your logic app. Each workflow is a callable MCP server tool. |

   1. When you're done, save your *mcpservers.json* file.

1. In the same folder, find and edit the *host.json* file. Next to the file name, select **Edit** (pencil icon). 

1. In the editor, following the `extensionBundle` JSON object, add the `extensions` JSON object at the same level as `extensionBundle`.

   1. Set the `extensions.workflow.McpServerEndpoints.enable` property to `true`.

      This property enables MCP server specific APIs in your logic app and is the only property value that you must change. All other property values don't require changes unless you want to use SSE transport or override the default values.

   1. To override the default values for the properties in `ProtectedResourceMetadata`, replace the placeholder values with the following values that you saved earlier:

      - Logic app name
      - Application ID URI

      If you override the default values in `McpServerEndpoints` or `ProtectedResourceMetadata`, make sure to follow these rules:

      - To completely remove the authentication type, you must change the type to `"anonymous"`.

      - For `Resource`, the value must be the same as the MCP server URL.

      - `BearerMethodsSupported` and `ScopesSupported` support only the specified values.

      - For `ScopesSupported`, the allowed token audience is `"api://<client-ID>/"`. Make sure to include the trailing slash unless you know this character doesn't exist in the token's audience claim.

      - `AuthorizationServers` specifies the recommended value for your tenant.

      - You can override the `ProtectedResourceMetadata` values returned with the [HTTP WWW-Authenticate response header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/WWW-Authenticate), but only if the overriding values follow the standards in [3.3 Protected Resource Metadata Validation - OAuth 2.0 Protected Resource Metadata](https://datatracker.ietf.org/doc/html/rfc9728#PRConfigurationValidation).

   The following example shows a minimal *host.json* file where the `extensions` JSON object appears to enable your MCP server to use streamable HTTP transport:

   ```json
   "extensionBundle": {
      "id": "Microsoft.Azure.Functions.ExtensionBundle.Workflows",
      "version": "<version-number>"
   },
   "extensions": {
      "workflow": {
         "McpServerEndpoints": {
            "enable": true
         }
      }
   }
   ```

   The following example shows a *host.json* file where the `extensions` JSON object appears with all the default values that you can override:

   ```json
   "extensionBundle": {
      "id": "Microsoft.Azure.Functions.ExtensionBundle.Workflows",
      "version": "<version-number>"
   },
   "extensions": {
      "workflow": {
         "Settings": {
            "Runtime.McpServerToMcpClientPingIntervalInSeconds": 30, // Optional: Available for enabling SSE transport. Overrides the ping interval default value, which is 30 seconds.
            "Runtime.Backend.EdgeWorkflowRuntimeTriggerListener.AllowCrossWorkerCommunication": false // Available and required for SSE transport. You must set this property to `true`.
         },
         "McpServerEndpoints": {
            "enable": true,
            "authentication": {
               "type": "oauth2" // Defaults to "oauth2" if not provided. Optional: To remove authentication, change to "anonymous".
            },
            // The following section applies only if you want to override the default values.
            "ProtectedResourceMetadata": {
               "BearerMethodsSupported": ["header"],
               "ScopesSupported": ["api://<application-ID-URI>/user_impersonation"],
               "Resource": "https://<logic-app-name>.azurewebsites.net/api/mcp",
               "AuthorizationServers": ["https://login.microsoftonline.com/<tenant-ID>/v2.0"]
            }
         }
      }
   }
   ```

1. When you're done, save your *host.json* file.

## Test your MCP servers setup

1. Get the URLs for your MCP servers.

   In your *mcpservers.json* file, each MCP server definition has a unique endpoint URL. You can get all the URLs by calling the List MCP Servers API.

   With a tool that can send HTTPS requests, send an HTTPS request using the **POST** method and the following URL:

   `https://management.azure.com/subscriptions/<subscription-ID>/resourceGroups/<resource-group-name>/providers/Microsoft.Web/sites/<logic-app-name>/hostruntime/runtime/webhooks/workflow/api/management/listMcpServers?api-version=<version-number>`

   The following example shows a sample request and response:

   `POST https://management.azure.com/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/fabrikam-resource-group/providers/Microsoft.Web/sites/fabrikam-mcpserver/hostruntime/runtime/webhooks/workflow/api/management/listMcpServers?api-version=2021-02-01`

   ```json
   {
      "values": [
         {
            "name": "MyEmailsManagementMCPServer",
            "description": "My email MCP server",
            "url": "https://fabrikam-mcpserver.azurewebsites.net/api/mcpservers/myemailsmanagementmcpserver/mcp",
            "tools": [
               { "name": "SendEmailToVendors" },
               { "name": "SendApprovalEmailForOrder" },
               { "name": "StatefulWorkflow1" }
            ]
         },
         {
            "name": "MyCalendarManagementMCPServer",
            "description": "My calendar MCP server",
            "url": "https://fabrikam-mcpserver.azurewebsites.net/api/mcpservers/mycalendarManagementMCPServer/mcp",
            "tools": [
                { "name": "GetCalendars" },
                { "name": "GetCalendar" },
                { "name": "GetMeetingInfo" }
            ]
         }
      ]
   }
   ```

1. In Visual Studio Code, from the **View** menu, select **Command Palette**. Find and select **MCP: Add Server**.

   :::image type="content" source="media/set-up-model-context-protocol-server-standard/visual-studio-code-mcp-add-server.png" alt-text="Screenshot shows Visual Studio Code, Command Palette, and command to add MCP server." lightbox="media/set-up-model-context-protocol-server-standard/visual-studio-code-mcp-add-server.png":::

1. Select **HTTP (HTTP or Server-Sent Events)**. For **Enter Server URL**, provide the URL for your MCP server. 

1. For **Enter Server ID**, provide a meaningful name for your MCP server.

   When you add an MCP server for the first time, you must choose where to store your MCP configuration. You get the following options, so choose the best option for your scenario:

   - **Global**: Your user configuration, which is the `c:\users\<your-username>\AppData\Roaming\Code\User` directory and available across all workspaces.
   - **Workspace**: Your current workspace in Visual Studio Code.

   This guide selects **Global** to store the MCP server information in the user configuration. As a result, Visual Studio Code creates and opens an **mcp.json** file, which shows your MCP server information.

1. In the *mcp.json* file, select the **Start** or **Restart** link to establish connectivity for your MCP server, for example:

   :::image type="content" source="media/set-up-model-context-protocol-server-standard/start-server-mcp-json-file.png" alt-text="Screenshot shows mcp.json file with Start link selected." lightbox="media/set-up-model-context-protocol-server-standard/start-server-mcp-json-file.png":::

1. When the authentication prompt appears, select **Allow**, and then select the account to use for authentication.

1. Sign in and give consent to call your MCP server.

   After authentication completes, the *mcp.json* file shows **Running** as the MCP server status.

   :::image type="content" source="media/set-up-model-context-protocol-server-standard/running-mcp-json-file.png" alt-text="Screenshot shows mcp.json file with Running status selected." lightbox="media/set-up-model-context-protocol-server-standard/running-mcp-json-file.png":::

1. As a test, try calling your MCP server from GitHub Copilot:

   1. On the Visual Studio Code title bar, open the **Copilot** list, and select **Open Chat**.

   1. Under the chat input box, from the **Built-in** modes list, and select **Agent**.

   1. From the LLM list, select the LLM to use.

   1. To browse the tools available in your MCP server, select **Configure Tools**.

   1. In the tools list, select or clear tools as appropriate, but make sure that your new MCP server is selected.

Now you can interact with your MCP server through the Copilot chat interface.

## Related content

- [Workflows with AI agents and models in Azure Logic Apps](agent-workflows-concepts.md)
- [Create workflows that use AI agents and models](create-agent-workflows.md)
- [Run Consumption workflows as actions for agents in Azure AI Foundry](add-agent-action-create-run-workflow.md)
