---
title: "Connect an MCP server on Azure Functions to Foundry Agent Service"
author: im-samz
description: Learn how to connect your MCP server hosted on Azure Functions to Azure AI Foundry Agent Service, enabling your agents to use custom tools.
ms.author: samuelzhang
ms.reviewer: glenga
ms.topic: how-to
ms.date: 02/05/2026
ms.collection: ce-skilling-ai-copilot

#Customer intent: As a developer, I want to learn how to connect an Azure Functions-hosted MCP server to Foundry Agent Service, so that my agent has access to my MCP tools.
---

# Connect an MCP server on Azure Functions to a Foundry Agent Service agent

This article shows you how to connect your [Model Context Protocol](https://modelcontextprotocol.io/docs/getting-started/intro) (MCP) server hosted on Azure Functions to Microsoft Foundry Agent Service. After completing this guide, your agent can discover and invoke the tools exposed by your MCP server.

This article follows this basic process for configuring the MCP server connection from Foundry Agent Service: 

> [!div class="checklist"]
> * Create and deploy an MCP server to your function app in Azure.
> * Get the MCP server endpoint URL.
> * Get the authentication credentials (as required).
> * Disable key-based authentication (as required).
> * Add an MCP server tool connection to an existing agent. 

## Prerequisites

Before you begin, make sure you have these resources in place:

* Deploy an MCP server to a function app in Azure by using one of these supported hosting options:
  * [Using the Azure Functions MCP extension](scenario-custom-remote-mcp-server.md).
  * [Self-host a server that uses standard MCP SDKs](scenario-host-mcp-server-sdks.md).
* [Configure built-in authentication](./functions-mcp-tutorial.md#configure-authentication-on-server-app), when using Microsoft Entra ID-based authentication.
* [An existing Foundry project and model](/azure/ai-foundry/tutorials/quickstart-create-foundry-resources?view=foundry&tabs=portal&preserve-view=true).
* [An existing agent](/azure/ai-foundry/quickstarts/get-started-code?view=foundry&preserve-view=true#create-an-agent).

## Review connection options

This table summarizes the currently supported options for authenticating your agent connection to an MCP server in Foundry Agent Service: 

| Method | Description | Use case | Additional setup | Functions supports |
| ------ | ----------- | -------- | ---------------- | ------------------- |
| **Key-based**<sup>*</sup> | Agent authenticates by passing a shared [function access key](./function-keys-how-to.md) in the request header. | During development or when the MCP server doesn't require Microsoft Entra authentication. | None | Yes |
| **Microsoft Entra** | Agent authenticates using either its own identity (*agent identity*) or the shared identity of the Foundry project (*project managed identity*). | Agent identity supports production scenarios, but shared identity should be limited to development. | [Disable key-based authentication](functions-mcp-tutorial.md?tabs=mcp-extension#disable-key-based-authentication) and [configure built-in server authorization and authentication](functions-mcp-tutorial.md?tabs=mcp-extension#enable-built-in-server-authorization-and-authentication). | Project managed (shared) identity |
| **OAuth identity passthrough** | Agent prompts users to sign in and authorize access, using the provided token to authenticate. | Production when each user must authenticate with their own identity and user context must be persisted. | [Disable key-based authentication](functions-mcp-tutorial.md?tabs=mcp-extension#disable-key-based-authentication) and [configure built-in server authorization and authentication](functions-mcp-tutorial.md?tabs=mcp-extension#enable-built-in-server-authorization-and-authentication). | Yes |
| **Unauthenticated access** | Agent makes unauthenticated calls. | During development or when your MCP server accesses only public information. | [Disable key-based authentication](functions-mcp-tutorial.md?tabs=mcp-extension#disable-key-based-authentication). | Yes |

<sup>*</sup>Default for Functions-hosted MCP servers.

To learn more about the MCP server authentication options that the Foundry Agent Service supports, see [Set up authentication for MCP tools](/azure/ai-foundry/agents/how-to/mcp-authentication?view=foundry&preserve-view=true).

## Get the remote MCP server endpoint

Before you can connect the agent to a Functions-hosed MCP server, you must get the endpoint URL for the service. The specific URL format depends on how you created and deployed your MCP server:

| MCP server type | Endpoint format |
| --------------- | --------------- |
| MCP extension-based server | `https://<FUNCTION_APP_NAME>.azurewebsites.net/runtime/webhooks/mcp` |
| Self-hosted MCP server | `https://<FUNCTION_APP_NAME>.azurewebsites.net/mcp` (unless you changed the route) |

For more information, see [Remote MCP servers](./functions-create-ai-enabled-apps.md#remote-mcp-servers).

## Get credentials

The credentials that your agent needs to connect to the MCP server depend on the way you plan to secure the connection. Choose the tab that indicates your connection authentication option.

### [Key-based](#tab/key-based)

When you use an access key to connect to your MCP server endpoint, you use a shared secret key to make it more difficult for random agents to connect to your server.

>[!IMPORTANT]
>While access keys can help prevent unwanted endpoint access, consider using Microsoft Entra ID authentication to secure your MCP server endpoints in production.   

The name of the access key you need depends on your MCP server deployment:

| MCP server type | Key name | Key type |
| --------------- | -------- | -------- |
| MCP extension-based server | `mcp_extension` | System key |
| Self-hosted MCP server | `default` | Host key |

To get the key from the Azure portal:

1. Go to your function app resource in the [Azure portal](https://portal.azure.com).
1. Expand the **Functions** dropdown in the left menu.
1. Select **App keys**.
1. Copy either the `mcp_extension` key (under **System keys**) or the `default` key (under **Host keys**), depending on your MCP server type.

For more information, see [Work with access keys in Azure Functions](function-keys-how-to.md).

### [Microsoft Entra](#tab/entra)

Both **Agent Identity** and **Project Managed Identity** use Microsoft Entra authentication. Currently, Functions only supports **Project managed identity**, which requires your server to be configured by using built-in authentication and authorization. The required audience is the Application ID URI from your function app's Entra app registration. You get this value during the [built-in authentication configuration](functions-mcp-tutorial.md?tabs=mcp-extension#configure-protected-resource-metadata-preview).

To get the Application ID URI from the Azure portal:

1. Go to your function app resource in the [Azure portal](https://portal.azure.com).

1. Select **Settings** > **Authentication** from the left menu.

1. Select the name of the Entra app next to **Microsoft**. This selection takes you to the Entra app resource.

1. In the left menu, select **Manage** > **Expose an API**.

1. Copy the **Application ID URI** at the top of the page. This ID value looks like `api://00001111-aaaa-2222-bbbb-3333cccc4444`.

### [OAuth identity](#tab/oauth-id)

OAuth identity passthrough prompts users to sign in and authorize access to your MCP server. For a Functions-hosted MCP server with built-in authentication, use custom OAuth with a Microsoft Entra app registration. 

To get the required credentials from the Azure portal:

1. Go to your function app resource in the [Azure portal](https://portal.azure.com).

1. Select **Settings** > **Authentication** from the left menu.

1. Select the name of the Entra app next to **Microsoft**. This selection takes you to the Entra app resource.

1. From **Essentials** in the **Overview** page, copy the values from these fields:

    + **Application (client) ID**
    + **Directory (tenant) ID**
    + **Application ID URI**

1. Use the tenant ID to construct these required OAuth URLs:

    | URL type | Format |
    | -------- | ------ |
    | **Auth URL** | `https://login.microsoftonline.com/<TENANT_ID>/oauth2/v2.0/authorize` |
    | **Token URL** | `https://login.microsoftonline.com/<TENANT_ID>/oauth2/v2.0/token` |
    | **Refresh URL** | `https://login.microsoftonline.com/<TENANT_ID>/oauth2/v2.0/token` |

    Replace `<TENANT_ID>` with your actual tenant ID value.

1. Select **Manage** > **Expose an API** and copy the existing scope.  

<!---Seems like we don't need this...
1. (Optional) If your app requires a client secret, select **Manage** > **Certificates & secrets**, and then create or copy an existing client secret value.
-->
After you configure OAuth identity passthrough in the Foundry portal, you receive a redirect URL. You must return to your Entra app registration to add this redirect URL to the Microsoft Entra app registration.

### [Unauthenticated](#tab/unauthenticated)

Because unauthenticated access requires no shared secrets or authentication, you can skip to the next section. 

>[!IMPORTANT]  
>This option allows any client or agent to access your MCP server endpoint. Use it only for tools that return read-only public information or during private development.

---

## Disable key-based authentication

Key-based authentication is the default for an MCP endpoint hosted in Azure Functions. To use a different authentication method, change the MCP endpoint authentication to `anonymous`. How you make this change depends on the type of MCP server you're hosting:

### [MCP extension server](#tab/mcp-extension/key-based)

Skip this section when using key-based authentication.

### [MCP extension server](#tab/mcp-extension/entra)

[!INCLUDE [functions-mcp-extension-disable-key-access](../../includes/functions-mcp-extension-disable-key-access.md)]

### [MCP extension server](#tab/mcp-extension/oauth-id)

[!INCLUDE [functions-mcp-extension-disable-key-access](../../includes/functions-mcp-extension-disable-key-access.md)]

### [MCP extension server](#tab/mcp-extension/unauthenticated)

[!INCLUDE [functions-mcp-extension-disable-key-access](../../includes/functions-mcp-extension-disable-key-access.md)]

### [Self-hosted server](#tab/self-hosted/key-based)

Skip this section when using key-based authentication.

### [Self-hosted server](#tab/self-hosted/entra)

[!INCLUDE [functions-mcp-custom-handler-disable-key-access](../../includes/functions-mcp-custom-handler-disable-key-access.md)]

### [Self-hosted server](#tab/self-hosted/oauth-id)

[!INCLUDE [functions-mcp-custom-handler-disable-key-access](../../includes/functions-mcp-custom-handler-disable-key-access.md)]

### [Self-hosted server](#tab/self-hosted/unauthenticated)

[!INCLUDE [functions-mcp-custom-handler-disable-key-access](../../includes/functions-mcp-custom-handler-disable-key-access.md)]

---  

## Add your MCP server

The process for creating the agent connection to the MCP server depends on your specific endpoint authentication options.

### [Key-based](#tab/key-based)

When you use key-based authentication, the agent authenticates by passing a function access key in the request header to your MCP server.

To connect to your MCP server endpoint:

1. Go to the [Foundry portal (new Foundry)](https://ai.azure.com/nextgen).

1. Select the **Build** tab at the top of the page and select an agent to connect to your MCP server. 

1. In the **Playground** tab, expand the **Tools** dropdown and select **Add**.

1. In the **Custom** tab in **Select a tool**, select **Model Context Protocol (MCP)** > **Create**.

1. In **Add Model Content Protocol tool**, provide information from this table to configure an access key-based connection: 

    | Field | Description | Example |
    | ----- | ----------- | ------- |
    | **Name** | A unique identifier for your MCP server. Use your function app name as the default. | `contoso-mcp-tools` |
    | **Remote MCP Server endpoint** | The URL endpoint for your MCP server. | `https://contoso-mcp-tools.azurewebsites.net/runtime/webhooks/mcp` |
    | **Authentication** | The authentication method to use. | `Key-based` |
    | **Credential** | The key-value pair to authenticate with your function app. | `x-functions-key`: `aaaaaaaa-0b0b-1c1c-2d2d-333333333333` |

1. Select **Connect** to create a connection to your MCP server endpoint. You should now see your server name listed under **Tools**. 

1. Select **Save** to save the MCP tool configuration in your agent.

### [Microsoft Entra](#tab/entra)

When you use Microsoft Entra authentication, the agent authenticates by using a managed identity to connect to your MCP server.

To connect to your MCP server endpoint:

1. Go to the [Foundry portal (new Foundry)](https://ai.azure.com/nextgen).

1. Select the **Build** tab at the top of the page and select an agent to connect to your MCP server. 

1. In the **Playground** tab, expand the **Tools** dropdown and select **Add**.

1. In the **Custom** tab in **Select a tool**, select **Model Context Protocol (MCP)** > **Create**.

1. In **Add Model Content Protocol tool**, enter the information from this table to configure a Microsoft Entra-based connection:

    | Field | Description | Example |
    | ----- | ----------- | ------- |
    | **Name** | A unique identifier for your MCP server. You can use your function app name. | `contoso-mcp-tools` |
    | **Remote MCP Server endpoint** | The URL endpoint for your MCP server. | `https://contoso-mcp-tools.azurewebsites.net/runtime/webhooks/mcp` |
    | **Authentication** | The authentication method to use. | `Microsoft Entra` |
    | **Type** | The identity type the agent uses to authenticate. | `Project Managed Identity` |
    | **Audience** | The Application ID URI of your function app's Entra registration. This value tells the identity provider which app the token is intended for. | `api://00001111-aaaa-2222-bbbb-3333cccc4444` |

1. Select **Connect** to create a connection to your MCP server endpoint. You should now see your server name listed under **Tools**.

1. Select **Save** to save the MCP tool configuration in your agent.

### [OAuth identity](#tab/oauth-id)

When you use OAuth identity passthrough, the agent prompts the user to sign in and then uses the returned access token when connecting to the server. 

1. Go to the [Foundry portal (new Foundry)](https://ai.azure.com/nextgen).

1. Select the **Build** tab at the top of the page and select an agent to connect to your MCP server. 

1. In the **Playground** tab, expand the **Tools** dropdown and select **Add**.

1. In the **Custom** tab in **Select a tool**, select **Model Context Protocol (MCP)** > **Create**.

1. In **Add Model Content Protocol tool**, enter the information from this table to configure OAuth Identity Passthrough connection:

    | Field | Description | Example |
    | ----- | ----------- | ------- |
    | **Name** | A unique identifier for your MCP server. You can use your function app name. | `contoso-mcp-tools` |
    | **Remote MCP Server endpoint** | The URL endpoint for your MCP server. | `https://contoso-mcp-tools.azurewebsites.net/runtime/webhooks/mcp` |
    | **Authentication** | The authentication method to use. | `OAuth Identity Passthrough` |
    | **Client ID** | The client ID of your function app Entra registration | `00001111-aaaa-2222-bbbb-3333cccc4444` |
    | **Token URL** | The endpoint your server app calls to exchange an authorization code or credential for an access token. | `https://login.microsoftonline.com/aaaabbbb-0000-cccc-1111-dddd2222eeee/oauth2/v2.0/token` |
    | **Auth URL** | The endpoint where users are redirected to authenticate and grant authorization to your server app. | `https://login.microsoftonline.com/aaaabbbb-0000-cccc-1111-dddd2222eeee/oauth2/v2.0/authorize` |
    | **Refresh URL** | The endpoint used to obtain a new access token when the current one expires. | `https://login.microsoftonline.com/aaaabbbb-0000-cccc-1111-dddd2222eeee/oauth2/v2.0/token` |
    | **Scopes** | The specific permissions or resource access levels your server app requests from the authorization server | `api://00001111-aaaa-2222-bbbb-3333cccc4444` |

    >[!NOTE]  
    >A **Client secret** value isn't needed, so leave this field blank.

1. Select **Connect** to create a connection to your MCP server endpoint. 

1. After you create your credential provider, you receive a **Redirect URL**. Before you **Close** this window, make sure to copy the URL value. You must add this redirect URL to your Entra app registration.

1. Return to your Entra app registration and under **Manage** > **Authentication** select **+ Add redirect URI**. Select **Web**, paste the copied **Redirect URI** value, and select **Configure**. 

1. Go back to the agent window, select **Close** > **Save** to save the MCP tool configuration in your agent.

### [Unauthenticated](#tab/unauthenticated)

Use unauthenticated access only when your MCP server doesn't require authentication and accesses only public information.

To connect to your MCP server endpoint:

1. Go to the [Foundry portal (new Foundry)](https://ai.azure.com/nextgen).

1. Select the **Build** tab at the top of the page and select an agent to connect to your MCP server. 

1. In the **Playground** tab, expand the **Tools** dropdown and select **Add**.

1. In the **Custom** tab in **Select a tool**, select **Model Context Protocol (MCP)** > **Create**.

1. In **Add Model Content Protocol tool**, provide information from this table to configure an unauthenticated connection:

    | Field | Description | Example |
    | ----- | ----------- | ------- |
    | **Name** | A unique identifier for your MCP server. You can use your function app name. | `contoso-mcp-tools` |
    | **Remote MCP Server endpoint** | The URL endpoint for your MCP server. | `https://contoso-mcp-tools.azurewebsites.net/runtime/webhooks/mcp` |
    | **Authentication** | The authentication method to use. | `Unauthenticated` |

1. Select **Connect** to create an unauthenticated connection to your MCP server endpoint. You should now see your server name listed under **Tools**.

1. Select **Save** to save the MCP tool configuration in your agent.

---

## Test your MCP tools

After connecting your MCP server to your agent, verify that the tools work correctly.

1. In the Agent Builder, find the chat window under **Playground**.
1. Enter a prompt that triggers one of your MCP tools. For example, if your MCP server has a greeting tool, try: `Use the greeting tool to say hello`.
1. If you're using OAuth identity passthrough, select **Open Consent** and sign in with your Entra account.
1. When the agent requests to invoke an MCP tool, review the tool name and arguments, and select **Approve** to allow the call.
1. Verify the tool returns the expected result.

Your agent can now use the tools exposed by your MCP server hosted on Azure Functions.

## Related articles

These additional articles can help you build your agent and function app capabilities:

### [Agent development](#tab/foundry)

- [Learn more about Foundry Agent Service and the agent development lifecycle](/azure/ai-foundry/agents/overview?view=foundry&preserve-view=true)
- [Equip your agent with built-in tools from the Foundry tool catalog](/azure/ai-foundry/agents/concepts/tool-catalog?view=foundry&preserve-view=true)
- [Enrich your agent with access to your enterprise knowledge bases](/azure/ai-foundry/agents/concepts/what-is-foundry-iq?view=foundry&preserve-view=true&tabs=portal)

### [Function app operations](#tab/functions)

- [Set up continuous deployment with GitHub Actions](./functions-how-to-github-actions.md)
- [Monitor Azure Functions with OpenTelemetry](./opentelemetry-howto.md)
- [Keep iterating according to Azure Functions best practices](./functions-best-practices.md)

### [Tool sharing](#tab/tools)

- [Register your MCP server in the organizational tool catalog](./register-mcp-server-api-center.md)

---