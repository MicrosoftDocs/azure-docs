---
title: Use dynamic sessions in Azure Container Apps
description: Learn how to use dynamic sessions in Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.topic: conceptual
ms.date: 05/19/2025
ms.author: cshoe
ms.custom: references_regions, ignite-2024
---

# Use dynamic sessions in Azure Container Apps

Azure Container Apps dynamic [sessions](sessions.md) offer isolated, secure contexts when you need to run code or applications separately from other workloads. Sessions run inside a [session pool](session-pool.md) which provides immediate access to new and existing sessions. These sessions are ideal for scenarios where user-generated input needs to be processed in a controlled manner or when integrating third-party services that require executing code in an isolated environment.

This article shows you how to manage and interact with dynamic sessions.

## Session access

Your application interacts with a session using the session pool's management API.

A pool management endpoint follows this format:

```text
https://<SESSION_POOL_NAME>.<ENVIRONMENT_ID>.<REGION>.azurecontainerapps.io
```

For more information managing session pools, see [session pools management endpoint](./session-pool.md#management-endpoint)

## Forwarding requests to a session's container

To send a request into a session's container, you use the management endpoint as the root for your request. Anything in the path following the base pool management endpoint is forwarded to the session's container.

For example, if you make a call to: `<POOL_MANAGEMENT_ENDPOINT>/api/uploadfile`, the request is routed to the session's container at `0.0.0.0:<TARGET_PORT>/api/uploadfile`.

## Continuous interaction

As you continue to make calls to the same session, the session remains [allocated](sessions.md#session-lifecycle) in the pool. Once there are no requests to the session after the cooldown period has elapsed, the session is automatically destroyed.

## Sample request

The following example shows how to send request to a session using a user's ID as the session unique identifier.

Before you send the request, replace the placeholders between the `<>` brackets with values specific to your request.

```http
POST <POOL_MANAGEMENT_ENDPOINT>/<API_PATH_EXPOSED_BY_CONTAINER>?identifier=<USER_ID>
Authorization: Bearer <TOKEN>
{
  "command": "echo 'Hello, world!'"
}
```

This request is forwarded to the container in the session with the identifier for the user's ID.

If the session isn't already running, Azure Container Apps automatically allocates a session from the pool before forwarding the request.

In this example, the session's container receives the request at `http://0.0.0.0:<INGRESS_PORT>/<API_PATH_EXPOSED_BY_CONTAINER>`.

## Identifiers

To send an HTTP request to a session, you must provide a session identifier in the request. You pass the session identifier in a query string parameter named `identifier` in the URL when you make a request to a session.

- If a session with the identifier already exists, the request is sent to the existing session.

- If a session with the identifier doesn't exist, a new session is automatically allocated before the request is sent to it.

:::image type="content" source="media/sessions/sessions-overview.png" alt-text="Screenshot of session pool and sessions usage.":::

### Identifier format

The session identifier is a free-form string, meaning you can define it in any way that suits your application's needs.

The session identifier is a string that you define that is unique within the session pool. If you're building a web application, you can use the user's ID as the session identifier. If you're building a chatbot, you can use the conversation ID.

The identifier must be a string that is 4 to 128 characters long and can contain only alphanumeric characters and special characters from this list: `|`, `-`, `&`, `^`, `%`, `$`, `#`, `(`, `)`, `{`, `}`, `[`, `]`, `;`, `<`, and `>`.

## Security

Dynamic sessions are built to run untrusted code and applications in a secure and isolated environment. While sessions are isolated from one another, anything within a single session, including files and environment variables, is accessible by users of the session.

Only configure or upload sensitive data to a session if you trust the users of the session.

By default, sessions are prevented from making outbound network requests. You can control network access by configuring network status settings on the session pool.

- **Use strong, unique session identifiers**: Always generate session identifiers that are long and complex to prevent brute-force attacks. Use cryptographic algorithms to create identifiers that are hard to guess.

- **Limit session visibility**: Set strict access controls to ensure that session identifiers are only visible to the session pool. Avoid exposing session IDs in URLs or logs.

- **Implement short expiration times**: Configure session identifiers to expire after a short period of inactivity. This approach minimizes the risk of sessions being hijacked after a user has finished interacting with your application.

- **Regularly rotate session credentials**: Periodically review and update the credentials associated with your sessions. Rotation decreases the risk of unauthorized access.

- **Utilize secure transmission protocols**: Always use HTTPS to encrypt data in transit, including session identifiers. This approach protects against man-in-the-middle attacks.

- **Monitor session activity**: Implement logging and monitoring to track session activities. Use these logs to identify unusual patterns or potential security breaches.

- **Validate user input**: Treat all user input as dangerous. Use input validation and sanitation techniques to protect against injection attacks and ensure that only trusted data is processed.

To fully secure your sessions, you can:

- [Use Microsoft Entra ID authentication and authorization](#authentication)
- [Protect session identifiers](#protect-session-identifiers)

### <a name="authentication"></a>Authentication and authorization

When you send requests to a session using the pool management API, authentication is handled using Microsoft Entra tokens. Only Microsoft Entra tokens from an identity belonging to the *Azure ContainerApps Session Executor* role on the session pool are authorized to call the pool management API.

To assign the role to an identity, use the following Azure CLI command:

```azurecli
az role assignment create \
    --role "Azure ContainerApps Session Executor" \
    --assignee <PRINCIPAL_ID> \
    --scope <SESSION_POOL_RESOURCE_ID>
```

If you're using an [large language model (LLM) framework integration](sessions-code-interpreter.md#llm-framework-integrations), the framework handles the token generation and management for you. Ensure that the application is configured with a managed identity with the necessary role assignments on the session pool.

If you're using the pool's management API endpoints directly, you must generate a token and include it in the `Authorization` header of your HTTP requests. In addition to the role assignments previously mentioned, token needs to contain an audience (`aud`) claim with the value `https://dynamicsessions.io`.

##### [Azure CLI](#tab/cli)

To generate a token using the Azure CLI, run the following command:

```azurecli
az account get-access-token --resource https://dynamicsessions.io
```

##### [C#](#tab/csharp)

In C#, you can use the `Azure.Identity` library to generate a token. First, install the library:

```bash
dotnet add package Azure.Identity
```

Then, use the following code to generate a token:

```csharp
using Azure.Identity;

var credential = new DefaultAzureCredential();
var token = credential.GetToken(new TokenRequestContext(new[] { "https://dynamicsessions.io/.default" }));
var accessToken = token.Token;
```

##### [JavaScript](#tab/javascript)

In JavaScript, you can use the `@azure/identity` library to generate a token. First, install the library:

```bash
npm install @azure/identity
```

Then, use the following code to generate a token:

```javascript
const { DefaultAzureCredential } = require("@azure/identity");
const { TokenCredential } = require("@azure/core-auth");

const credential = new DefaultAzureCredential();
const token = await credential.getToken("https://dynamicsessions.io/.default");
const accessToken = token.token;
```

##### [Python](#tab/python)

In Python, you can use the `azure-identity` library to generate a token. First, install the library:

```bash
pip install azure-identity
```

Then, use the following code to generate a token:

```python
from azure.identity import DefaultAzureCredential

credential = DefaultAzureCredential()
token = credential.get_token("https://dynamicsessions.io/.default")
access_token = token.token
```

---

> [!IMPORTANT]
> A valid token is used to create and access any session in the pool. Keep your tokens secure and don't share them with untrusted parties. End users should never have direct access to tokens. Only make tokens available to the application, and never to end users.

### Protect session identifiers

The session identifier is sensitive information which you must manage securely. Your application needs to ensure each user or tenant only has access to their own sessions.

The specific strategies that prevent misuse of session identifiers differ depending on the design and architecture of your app. However, your app must always have complete control over the creation and use of session identifiers so that a malicious user can't access another user's session.

Example strategies include:

- **One session per user**: If your app uses one session per user, each user must be securely authenticated, and your app must use a unique session identifier for each logged in user.

- **One session per agent conversation**: If your app uses one session per AI agent conversation, ensure your app uses a unique session identifier for each conversation that can't be modified by the end user.

> [!IMPORTANT]
> Failure to secure access to sessions could result in misuse or unauthorized access to data stored in your users' sessions.

### Use managed identity

A managed identity from Microsoft Entra ID allows your container session pools and their sessions to access other Microsoft Entra protected resources. Both system-assigned and user-assigned managed identities are supported in a session pool.

For more about managed identities in Microsoft Entra ID, see [Managed identities for Azure resources](../active-directory/managed-identities-azure-resources/overview.md).

There are two ways to use managed identities with custom container session pools:

- **Image pull authentication**: Use the managed identity to authenticate with the container registry to pull the container image.

- **Resource access**: Use the session pool's managed identity in a session to access other Microsoft Entra protected resources. Due to its security implications, this capability is disabled by default.

    > [!IMPORTANT]
    > If you enable access to managed identity in a session, any code or programs running in the session can create Microsoft Entra tokens for the pool's managed identity. Since sessions typically run untrusted code, use this feature with extreme caution.

# [Azure CLI](#tab/azure-cli)

To enable managed identity for a custom container session pool, use Azure Resource Manager.

# [Azure Resource Manager](#tab/arm)

To enable managed identity for a custom container session pool, you add an `identity` property to the session pool resource.

The `identity` property must have a `type` property with the value `SystemAssigned` or `UserAssigned`. For more information on how to configure this property, see [Configure managed identities](managed-identity.md?tabs=arm%2Cdotnet#configure-managed-identities).

The following example shows an ARM template snippet that enables a user-assigned identity for a custom container session pool and use it for image pull authentication.

Before you send the request, replace the placeholders between the `<>` brackets with the appropriate values for your session pool and session identifier.

```json
{
  "type": "Microsoft.App/sessionPools",
  "apiVersion": "2024-08-02-preview",
  "name": "my-session-pool",
  "location": "westus2",
  "properties": {
    "environmentId": "/subscriptions/<SUBSCRIPTION_ID>/resourceGroups/<RESOURCE_GROUP>/providers/Microsoft.ContainerApps/environments/<ENVIRONMENT_NAME>",
    "poolManagementType": "Dynamic",
    "containerType": "CustomContainer",
    "scaleConfiguration": {
      "maxConcurrentSessions": 10,
      "readySessionInstances": 5
    },
    "dynamicPoolConfiguration": {
      "executionType": "Timed",
      "cooldownPeriodInSeconds": 600
    },
    "customContainerTemplate": {
      "registryCredentials": {
          "server": "myregistry.azurecr.io",
          "identity": "<IDENTITY_RESOURCE_ID>"
      },
      "containers": [
        {
          "image": "myregistry.azurecr.io/my-container-image:1.0",
          "name": "mycontainer",
          "resources": {
            "cpu": 0.25,
            "memory": "0.5Gi"
          },
          "command": [
            "/bin/sh"
          ],
          "args": [
            "-c",
            "while true; do echo hello; sleep 10;done"
          ],
          "env": [
            {
              "name": "key1",
              "value": "value1"
            },
            {
              "name": "key2",
              "value": "value2"
            }
          ]
        }
      ],
      "ingress": {
        "targetPort": 80
      }
    },
    "sessionNetworkConfiguration": {
      "status": "EgressEnabled"
    },
    "managedIdentitySettings": [
      {
        "identity": "<IDENTITY_RESOURCE_ID>",
        "lifecycle": "None"
      }
    ]
  },
  "identity": {
    "type": "UserAssigned",
    "userAssignedIdentities": {
      "<IDENTITY_RESOURCE_ID>": {}
    }
  }
}
```

This template contains the following settings for managed identity:

| Parameter | Value | Description |
|---------|-------|-------------|
| `customContainerTemplate.registryCredentials.identity` | `<IDENTITY_RESOURCE_ID>` | The resource ID of the managed identity to use for image pull authentication. |
| `managedIdentitySettings.identity` | `<IDENTITY_RESOURCE_ID>` | The resource ID of the managed identity to use in the session. |
| `managedIdentitySettings.lifecycle` | `None` | The session lifecycle where the managed identity is available.<br><br>- `None` (default): The session can't access the identity. This setting is only used for image pull.<br><br>- `Main`: In addition to image pull, the main session can also access the identity. **Use with caution.** |

---

## Logging

Console logs from containers running in a session are available in the Azure Log Analytics workspace associated with the Azure Container Apps environment in a table named `AppEnvSessionConsoleLogs_CL`.

## Related content

- **Session types**: Learn about the different types of dynamic sessions:
  - [Code interpreter sessions](./sessions-code-interpreter.md)
  - [Custom container sessions](./sessions-custom-container.md)

- **Tutorials**: Work directly with the REST API or via an LLM agent:
  - Use an LLM agent:
    - [AutoGen](./sessions-tutorial-autogen.md)
    - [LangChain](./sessions-tutorial-langchain.md)
    - [LlamaIndex](./sessions-tutorial-llamaindex.md)
    - [Semantic Kernel](./sessions-tutorial-semantic-kernel.md)
  - Use the REST API
    - [JavaScript Code interpreter](./sessions-tutorial-nodejs.md)
