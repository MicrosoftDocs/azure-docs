---
title: 'Securely connect .NET apps to resources using the Entra agent identity platform'
description: Learn how to configure your app to use an agent identity in Azure App Service and Azure Functions
ms.devlang: csharp
ms.topic: how-to
ms.date: 11/14/2025
author: mattchenderson
ms.author: mahender
ms.service: azure-app-service
---

# How to use an agent identity in App Service and Azure Functions

This topic shows you how to configure an Azure App Service or Azure Functions app to use the [Microsoft Entra agent identity platform](/entra/agent-id/identity-platform/what-is-agent-id-platform) to securely connect to resources as an agent.

The code examples in this article use C#. The overall approach can be applied to any language stack, but you need to adapt the code to your stack and framework of choice.

> [!NOTE]
> This scenario uses components and services that are currently in preview. Preview features aren't meant for production use and might have limited support.

The steps you must take depend on the type of agent you're building. Choose your scenario using the tabs:

# [Autonomous agents](#tab/autonomous-agents)

Autonomous agents work independently and perform actions using their own identity, rather than acting as the delegate of a user.

Autonomous agents can also be used for [agent user scenarios](/entra/agent-id/identity-platform/agent-users). Agent users aren't covered in this topic.

# [Interactive agents](#tab/interactive-agents)

Interactive agents act as the delegate of a user, performing actions on behalf of that user.

---

## Prerequisites

- Familiarize yourself with the core agent identity platform concepts by reviewing [What is an agent identity?](/entra/agent-id/identity-platform/what-is-agent-id) and [Fundamental concepts in Microsoft agent identity platform](/entra/agent-id/identity-platform/key-concepts).
- Note down the **Tenant ID** of your Microsoft Entra tenant.
- You must have the **Privileged Role Administrator** role in your Microsoft Entra tenant. You must also have either the **Agent ID Developer** or **Agent ID Administrator** role in your Microsoft Entra tenant. These roles are required for _agent identity blueprint_ creation.

## Create an agent identity blueprint

[Create a user-assigned managed identity](/entra/identity/managed-identities-azure-resources/how-manage-user-assigned-managed-identities#create-a-user-assigned-managed-identity) for your agent identity blueprint to use. Make note of the following information, which you need in later steps:

- The **managed identity principal ID**, which is the principal ID of the user-assigned managed identity you created.
- The **managed identity client ID**, which is the client ID of the user-assigned managed identity you created.

To create an agent identity blueprint, follow the instructions in [Create an agent identity blueprint](/entra/agent-id/identity-platform/create-blueprint). When configuring credentials, use the managed identity that you created earlier as a federated identity credential. To complete this step, you need the **managed identity principal ID** you obtained earlier.

Make note of the following information, which you need in later steps:

- The **agent identity blueprint ID**, which is the _client ID_ of the agent identity blueprint you created. Make sure to note down the _client ID_ and not the _object ID_.

## Create an agent application

Once you have an agent blueprint, you can give an app the ability to create agent identities with it. If you don't already have an app, create a new app in App Service or Azure Functions to act as the agent connecting to the MCP server. Later sections show how to use C# to work with agent identities, so make sure to create a C# app.

You can use these articles as a starting point based on your preferred hosting option: 

- If you prefer to use App Service, create and deploy a new web app by following the instructions in [Tutorial: Build a chatbot with Azure App Service and Azure OpenAI (.NET)](./tutorial-ai-openai-chatbot-dotnet.md).
- If you prefer to use Azure Functions, follow the instructions in [Create and run a durable agent][durable-agent-tutorial].

Make sure to deploy the app to Azure.

[Assign the user-assigned managed identity](./overview-managed-identity.md) to the agent app. This identity is used by the agent blueprint instead of a client secret.

# [Autonomous agents](#tab/autonomous-agents)

Autonomous agent scenarios require no extra actions for this step.

# [Interactive agents](#tab/interactive-agents)

For interactive agent scenarios, the agent blueprint is also used as an app registration that authenticates users to your app. You can use [built-in authentication and authorization](./overview-authentication-authorization.md) for this scenario. Follow the instructions to [configure the application for built-in authentication with Microsoft Entra ID](./configure-authentication-provider-aad.md) using the agent blueprint. To complete this step, you need:

- The **agent identity blueprint ID** you obtained earlier, which you use for the **client ID** value
- The **managed identity client ID** you obtained earlier, which you use when configuring the app to use a managed identity instead of a client secret.

You don't have a client secret for this registration since you created a federated identity credential instead. Configure the built-in authentication and authorization feature to use the federated identity credential by following the instructions to [use a managed identity instead of a secret](./configure-authentication-provider-aad.md#use-a-managed-identity-instead-of-a-secret-preview).

To complete this step, you must add a _redirect URI_ to your agent blueprint, which should be of the form `<app-url>/.auth/login/aad/callback`, where `<app-url>` is replaced with the base URL of your application.

---

## Configure the app to create agent identities

When you create an agent identity, you must [specify at least one sponsor for the identity](/entra/agent-id/identity-platform/agent-owners-sponsors-managers), which can be a user or a security group. Your app needs to gather this information when creating an agent, or you need to preconfigure it for a designated user or group. When specifying a sponsor, you need to provide the full Microsoft Graph URI for it, such as `https://graph.microsoft.com/v1.0/users/<id>` and `https://graph.microsoft.com/v1.0/groups/<id>` for users and groups respectively.

Configure the [application settings](./configure-common.md#configure-app-settings) for your agent app to include the following environment variables:

| Name                      | Value                                                    |
|---------------------------|----------------------------------------------------------|
| MyTenantId                | Your Microsoft Entra tenant ID                           |

In your code, the agent app needs to get an access token for the agent identity blueprint. Define a new `TokenCredential` that represents the blueprint:

```csharp
using Azure.Core;
using Azure.Identity;

namespace Company.Namespace;

internal class AgentIdentityBlueprintCredential : TokenCredential
{
    private static string TokenExchangeAudience = Environment.GetEnvironmentVariable("TokenExchangeAudience") ?? "api://AzureADTokenExchange";
    private static string PublicTokenExchangeScope = $"{TokenExchangeAudience}/.default"; 

    private ClientAssertionCredential innerCredential;

    public AgentIdentityBlueprintCredential(string tenantId, string agentIdentityBlueprintId, string managedIdentityClientId, ClientAssertionCredentialOptions? options = null)
    {
        ManagedIdentityCredential _managedIdentityCredential = new(managedIdentityClientId!);
        Func<CancellationToken, Task<String>> clientAssertionCallback = async (CancellationToken cancellationToken) =>
          (await _managedIdentityCredential.GetTokenAsync(new TokenRequestContext(new[] { PublicTokenExchangeScope }), cancellationToken)).Token;
        innerCredential= options is null ? new ClientAssertionCredential(tenantId!, agentIdentityBlueprintId!, clientAssertionCallback) : new ClientAssertionCredential(tenantId!, agentIdentityBlueprintId!, clientAssertionCallback, options);
    }

    public override AccessToken GetToken(TokenRequestContext requestContext, CancellationToken cancellationToken) => innerCredential.GetToken(requestContext, cancellationToken);
    public override ValueTask<AccessToken> GetTokenAsync(TokenRequestContext requestContext, CancellationToken cancellationToken) => innerCredential.GetTokenAsync(requestContext, cancellationToken);
}
```

This `AgentIdentityBlueprintCredential` implementation defaults to using global Azure. You can optionally set the `TokenExchangeAudience` application setting to change the audience if you're using a different cloud.

Agent identities are created at runtime using blueprint tokens. Define an API to create an agent and return the identity information to a client. You can also provision the identity at startup, but if you do, be sure to log the identity information so you can set up permissions later.

Add a reference to the [`Microsoft.Graph` NuGet package](https://www.nuget.org/packages/Microsoft.Graph/). Then define a new method to use a Microsoft Graph client to create a new agent identity:

```csharp
using Company.Namespace;
using Microsoft.Graph;
using Microsoft.Graph.Models;

/// ...

public static async Task<string> GetOrCreateAgentIdentityAsync(ILogger logger, string[] sponsors)
{
    var agentIdentityBlueprintId = Environment.GetEnvironmentVariable("WEBSITE_AUTH_CLIENT_ID") ?? throw new InvalidOperationException("Built-in authentication is not configured properly.");
    var managedIdentityClientId = Environment.GetEnvironmentVariable("OVERRIDE_USE_MI_FIC_ASSERTION_CLIENTID") ?? throw new InvalidOperationException("Missing OVERRIDE_USE_MI_FIC_ASSERTION_CLIENTID environment variable");
    var tenantId = Environment.GetEnvironmentVariable("MyTenantId") ?? throw new InvalidOperationException("Missing MyTenantId environment variable");
    string? agentId = Environment.GetEnvironmentVariable("MyAgentId");
    
    using var graphClient = new GraphServiceClient(
        new AgentIdentityBlueprintCredential(tenantId, agentIdentityBlueprintId, managedIdentityClientId), 
        ["https://graph.microsoft.com/.default"]);
    
    if (string.IsNullOrEmpty(agentId))
    {
        var agentIdentity =  await graphClient.ServicePrincipals
        .WithUrl("https://graph.microsoft.com/beta/servicePrincipals/Microsoft.Graph.AgentIdentity")
        .PostAsync( new ServicePrincipal()
        {
            DisplayName = "MyAgentIdentity",
            AdditionalData = new Dictionary<string, object>()
            {
                {"agentIdentityBlueprintId", agentIdentityBlueprintId },
                {"sponsors@odata.bind", sponsors }
            }
        });
        agentId = agentIdentity.Id;
        logger.LogInformation("Created agent identity: {identifier}", agentId);
    }
    
    return agentId;
}
```

Update your application code to call this method as a part of your agent creation operations. Remember to gather sponsor information through user input or preconfiguration.

Deploy the application and create an agent identity. Make note of the following information, which you need in later steps:

- The **agent identity ID**, which you obtain from your agent creation endpoint or your logs.

To reuse the agent identity across application restarts and avoid creating extra identities, update the application with the `MyAgentId` application setting:

| Name                      | Value                                                    |
|---------------------------|----------------------------------------------------------|
| MyAgentId                 | The **agent identity ID** you obtained earlier           |

> [!NOTE]
> The application doesn't work at this point, because the agent identity doesn't yet have access to any resources. For more information, see [Grant permissions to the agent](#grant-permissions-to-the-agent).

## Obtain tokens with the identity

Blueprint tokens are also used to obtain identity tokens. The type of token you use for accessing resources depends on they type of agent.

# [Autonomous agents](#tab/autonomous-agents)

For autonomous agents, you obtain a token for the agent identity itself. Define a new `TokenCredential` for this scenario:

```csharp
using Azure.Core;
using Azure.Identity;

namespace Company.Namespace;

internal class AgentIdentityCredential : TokenCredential
{
    private static string TokenExchangeAudience = Environment.GetEnvironmentVariable("TokenExchangeAudience") ?? "api://AzureADTokenExchange";
    private static string PublicTokenExchangeScope = $"{TokenExchangeAudience}/.default"; 

    private ClientAssertionCredential innerCredential;

    public AgentIdentityCredential(string tenantId, string agentIdentityBlueprintId, string managedIdentityClientId, string agentIdentityId)
    {
        AgentIdentityBlueprintCredential blueprintCredential = new(tenantId, agentIdentityBlueprintId, managedIdentityClientId, new ClientAssertionCredentialOptions()
        {
            Transport = new FmiTransport(agentIdentityId)
        });
        Func<CancellationToken, Task<String>> clientAssertionCallback = async (CancellationToken cancellationToken) =>
          (await blueprintCredential.GetTokenAsync(new TokenRequestContext(new[] { PublicTokenExchangeScope }), cancellationToken)).Token;
        innerCredential= new ClientAssertionCredential(tenantId!, agentIdentityId!, clientAssertionCallback);
    }

    public override AccessToken GetToken(TokenRequestContext requestContext, CancellationToken cancellationToken) => innerCredential.GetToken(requestContext, cancellationToken);
    public override ValueTask<AccessToken> GetTokenAsync(TokenRequestContext requestContext, CancellationToken cancellationToken) => innerCredential.GetTokenAsync(requestContext, cancellationToken);
}

public class FmiTransport(string agentIdentityId) : HttpClientTransport()
{
    public override void Process(HttpMessage message) {
        message.Request.Uri.AppendQuery("fmi_path", agentIdentityId);
        base.Process(message);
    }

    public override ValueTask ProcessAsync(HttpMessage message) {
        message.Request.Uri.AppendQuery("fmi_path", agentIdentityId);
        return base.ProcessAsync(message);
    }
}
```

# [Interactive agents](#tab/interactive-agents)

For interactive agents, you use tokens _on-behalf-of_ the calling user. Define a new `TokenCredential` for this scenario:

```csharp
using Azure.Core;
using Azure.Identity;

namespace Company.Namespace;

internal class AgentIdentityOnBehalfOfCredential : TokenCredential
{
    private static string TokenExchangeAudience = Environment.GetEnvironmentVariable("TokenExchangeAudience") ?? "api://AzureADTokenExchange";
    private static string PublicTokenExchangeScope = $"{TokenExchangeAudience}/.default"; 

    private OnBehalfOfCredential innerCredential;

    public AgentIdentityOnBehalfOfCredential(string tenantId, string agentIdentityBlueprintId, string managedIdentityClientId, string agentIdentityId, string userAssertion)
    {
        AgentIdentityBlueprintCredential blueprintCredential = new(tenantId, agentIdentityBlueprintId, managedIdentityClientId);
        Func<CancellationToken, Task<String>> clientAssertionCallback = async (CancellationToken cancellationToken) =>
          (await blueprintCredential.GetTokenAsync(new TokenRequestContext(new[] { PublicTokenExchangeScope }), cancellationToken)).Token;
        innerCredential= new OnBehalfOfCredential(tenantId!, agentIdentityId!, clientAssertionCallback, userAssertion);
    }

    public override AccessToken GetToken(TokenRequestContext requestContext, CancellationToken cancellationToken) => innerCredential.GetToken(requestContext, cancellationToken);
    public override ValueTask<AccessToken> GetTokenAsync(TokenRequestContext requestContext, CancellationToken cancellationToken) => innerCredential.GetTokenAsync(requestContext, cancellationToken);
}
```

---

Use this `TokenCredential` implementation when configuring your agent's connection to resources.

## Grant permissions to the agent

To access resources, the agent identity needs to be granted permissions to them. What steps are required depends on the type of resource you're accessing. You likely need the **agent identity ID** you obtained earlier, which acts as a client ID for the purposes of most access control systems.

- If the resource uses Azure role-based access control (RBAC), you can [assign a role](../role-based-access-control/role-assignments-steps.md) to the agent identity. Role assignments require the principal ID of the agent identity. Obtain the principal ID from the Microsoft Graph or the Entra admin portal by querying for the service principal with the agent identity ID as its app ID.
- When accessing Entra ID resources that enforce claims-based permission checks, such as the Microsoft Graph, you might need to configure other application permissions as part of the agent identity setup. In these cases, you need to [request authorization from an Entra admin](/entra/agent-id/identity-platform/autonomous-agent-request-authorization-entra-admin).
- For resources that enforce access control lists or other checks, configure access for the agent identity as you would for any other application.

## Related content

- [Create and run a durable agent][durable-agent-tutorial]
- [Tutorial: Build a chatbot with Azure App Service and Azure OpenAI (.NET)](./tutorial-ai-openai-chatbot-dotnet.md) 

[agent-framework]: /agent-framework/overview/agent-framework-overview
[durable-agent-tutorial]: /agent-framework/tutorials/agents/create-and-run-durable-agent