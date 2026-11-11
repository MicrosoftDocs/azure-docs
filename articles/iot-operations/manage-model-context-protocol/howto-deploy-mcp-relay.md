---
title: Expose MCP through Azure Relay (preview)
description: Use the Azure Samples deployment script to expose MCP tools to remote clients through Azure Relay and Azure API Management.
author: ancaantochi
ms.author: ancaantochi
ms.service: azure-iot-operations
ms.topic: how-to
ms.date: 10/15/2026
ai-usage: ai-assisted
---

# Expose MCP through Azure Relay (preview)

> [!IMPORTANT]
> MCP in Azure IoT Operations is in preview. Use a nonproduction environment to evaluate the preview and the examples in this article.

The `aio-ai-relay` Helm chart published in `ghcr.io` deploys the in-cluster
relay. Remote MCP clients call Azure API Management (APIM), which
forwards requests over the Hybrid Connection to the in-cluster relay, then
**MCP Gateway**, and finally Azure IoT Operations MCP. The cluster doesn't need an inbound port.

The [AI relay deployment sample](https://github.com/Azure-Samples/explore-iot-operations/tree/main/samples/ai)
creates the Azure resources and Microsoft Entra application, then installs the
published relay Helm chart. The script uses your current Azure subscription
and Kubernetes context; it doesn't create a cluster.

## Prerequisites

- Bash on Linux, macOS, or WSL; Git; Azure CLI with Bicep; Helm 3.18 or later;
  `kubectl`; `jq`; and `uuidgen`, with permission to deploy the chart's
  Kubernetes resources, including its ServiceAccount, Role, and RoleBinding.
- An Azure subscription and an existing resource group containing the
  Arc-connected cluster. The Azure IoT Operations Arc extension must have a
  system-assigned managed identity.
- Azure permissions to create Relay and APIM resources and assign Azure roles.
- Microsoft Entra permissions and tenant approval to create an application,
  service principal, delegated scope, and app role. Resolve any app-registration
  restrictions with your tenant administrator before running the script.
- A current `kubectl` context for the target cluster.

  ```bash
  kubectl config use-context <CLUSTER_NAME>
  ```

- The ready MCP Gateway, `aio` connection, and authorization policy from
  [Deploy MCP](howto-deploy-mcp.md). Use the gateway Service and token audience,
  `aio-mcp-frontend`, not the backend `aio-mcp`.

  ```bash
  kubectl -n azure-iot-operations get service aio-mcp-frontend
  ```

- The Azure IoT Operations Arc extension name.

  ```bash
  az k8s-extension list -g <RESOURCE_GROUP> -c <CLUSTER_NAME> \
    -t connectedClusters \
    --query "[?extensionType=='microsoft.iotoperations'].name" -o tsv
  ```

## Deploy the relay sample

Clone the sample repository, which contains both the script and its Bicep
templates:

```bash
git clone https://github.com/Azure-Samples/explore-iot-operations.git
cd explore-iot-operations

az account set --subscription "<SUBSCRIPTION_ID>"
kubectl config current-context

bash samples/ai/deploy.sh \
  --resource-group "<RESOURCE_GROUP>" \
  --relay-namespace-name "<GLOBALLY_UNIQUE_RELAY_NAME>" \
  --apim-name "<GLOBALLY_UNIQUE_APIM_NAME>" \
  --apim-publisher-email "<PUBLISHER_EMAIL>" \
  --apim-publisher-name "<PUBLISHER_NAME>" \
  --chart-reference oci://ghcr.io/azure-samples/explore-iot-operations/helm/aio-ai-relay \
  --chart-version 0.1.3 \
  --image-tag 0.1.3 \
  --auth-mode sami \
  --cluster-name "<ARC_CONNECTED_CLUSTER_NAME>" \
  --aio-extension-name "<AIO_EXTENSION_NAME>" \
  --entra-app-name "<UNIQUE_ENTRA_APP_NAME>" \
  --endpoint-protocol mcp \
  --mcp-frontend-service-name aio-mcp-frontend \
  --mcp-frontend-audience aio-mcp-frontend \
  --mcp-role Reader
```

Use the Arc-connected cluster resource name for `--cluster-name`, which might
differ from the Kubernetes context name. The script downloads chart version
`0.1.3` before creating cloud resources. The explicit `--image-tag 0.1.3`
selects `ghcr.io/azure-samples/explore-iot-operations/aio-ai-relay:0.1.3`
instead of the script's default image tag.

The script creates a Standard Azure Relay namespace, a Hybrid Connection,
an APIM instance with a native MCP API, and the Microsoft Entra application.
It publishes OAuth protected-resource metadata so compatible MCP clients can
discover the Microsoft Entra authorization server and delegated scope.
It configures APIM to
validate the caller's tenant, audience, and `AIOMcpAdmin` role before forwarding
requests. It also grants the Azure IoT Operations extension identity **Azure Relay Listener**
and APIM's identity **Azure Relay Sender** access to the Hybrid Connection.
The managed identity mode doesn't require a shared access key.

> [!IMPORTANT]
> Relay and APIM incur Azure charges. The sample defaults to APIM `BasicV2`,
> and provisioning can take a long time. The script doesn't roll back Azure
> resources or Entra objects if deployment fails. Keep the printed
> application ID and deployment outputs for cleanup. In the default registration
> mode, each run creates a new Entra application and rejects an existing
> application name. Existing-app mode reuses the app configured by your
> administrator; don't delete that app when cleaning up the sample.

The relay targets
`https://aio-mcp-frontend.azure-iot-operations:443/mcp`, mounts a projected
`aio-mcp-frontend` token, and trusts the Azure IoT Operations CA bundle. It exposes MCP tools,
not the in-cluster agent.

The `--mcp-role Reader` option grants the relay's ServiceAccount the `Reader`
gateway role. Use a new MCP session after changing roles. The gateway
authorizes calls as the **relay
ServiceAccount**, not as the remote Entra user. All callers admitted through
this relay share its MCP permissions; APIM's `AIOMcpAdmin` app role doesn't
grant the gateway's `Admin` role or replace its policy checks.

## Authorize callers and verify access

The script requires app-role assignment but doesn't assign callers. An
administrator must grant approved callers the `AIOMcpAdmin` role through
**Microsoft Entra Enterprise applications > your app > Users and groups**,
or use Microsoft Graph for application assignments.

To check the in-cluster relay release:

```bash
kubectl -n azure-iot-operations get deployment aio-ai-relay
kubectl -n azure-iot-operations logs deployment/aio-ai-relay --tail=100
kubectl -n azure-iot-operations get serviceaccount aio-ai-relay -o yaml
```

## Connect your own agent

You can connect GitHub Copilot in Visual Studio Code to the deployed relay.
You don't need the sample in-cluster agent. This example uses Streamable HTTP
and client-managed Microsoft Entra authentication: Visual Studio Code discovers
the authorization server, prompts you to sign in, and obtains the access token.
You don't retrieve or copy a token into the MCP configuration.

Use the full URL on the script's **`[mcp] Public endpoint`** line, including
its API path. This URL is the MCP endpoint's `apimGatewayUrl` deployment
output. Don't use the `relayUrl`, an in-cluster Service URL, or the MCP
backend URL. Requests follow this route:

```text
Your agent -> APIM -> Azure Relay -> in-cluster relay -> MCP Gateway -> MCP backend
```

Only connect agents and model providers approved to access your IoT data.
The agent's subscription and model credentials are separate from the Microsoft
Entra authentication used to access the relay.

### Authorize Visual Studio Code

Install a current version of Visual Studio Code with GitHub Copilot access.
First assign the user who signs in the `AIOMcpAdmin` app role as described
in [Authorize callers and verify access](#authorize-callers-and-verify-access).

With your tenant administrator's approval, authorize Visual Studio Code to
request the relay application's delegated scope:

1. In **Microsoft Entra ID > App registrations**, open the relay application
   used by the script. Match its **Application (client) ID** to the printed
   application ID.
2. Select **Expose an API > Authorized client applications > Add a client application**.
3. Enter the Visual Studio Code client ID,
   `aebc6443-996d-45c2-90f0-388ff96faa56`, select the relay's delegated scope,
   and select **Add application**. For an app created with the script's defaults,
   the scope is `api://<ENTRA_APP_ID>/user_impersonation`.

If you deploy with a manually configured app by using `--entra-app-id` and
`--entra-tenant-id`, set `--entra-app-scope` to its delegated scope name, for
example `mcp.access`. Authorize that same scope for Visual Studio Code. The
script's **`[mcp] OAuth protected-resource metadata`** URL must advertise the
matching full scope in `scopes_supported`. This metadata is public discovery
information; it doesn't grant access to MCP tools.

This delegated authorization doesn't assign the `AIOMcpAdmin` role or change
the relay's gateway permissions. Authorizing Azure CLI doesn't authorize
Visual Studio Code; they use different client application IDs.

> [!IMPORTANT]
> Client-managed authentication removes manual token handling, not sign-in or
> tenant-policy requirements. A browser sign-in or consent prompt might still
> be required. If interactive authentication isn't permitted, use an
> organization-approved workload identity and a client that supports it.
> The following user sign-in example doesn't configure unattended authentication.

### Configure and sign in from Visual Studio Code

On your local computer, open or create `.vscode/mcp.json` in your workspace.
Add the following server, preserving any existing server entries. Replace
the URL with the complete **`[mcp] Public endpoint`** printed by the script.
Don't add an `Authorization` header or a token environment variable.

```json
{
  "servers": {
    "azure-iot-operations": {
      "type": "http",
      "url": "https://<APIM_NAME>.azure-api.net/<MCP_API_PATH>"
    }
  }
}
```

1. Open the Command Palette and run **MCP: List Servers**.
2. Select **azure-iot-operations**, then select **Start Server**. Review and
   accept any server-trust prompt only if you recognize the endpoint.
3. When Visual Studio Code prompts you to authenticate with Microsoft,
   complete sign-in by using the account assigned `AIOMcpAdmin` in the relay's
   tenant. Complete consent only as permitted by your organization.
4. Confirm that the server connects and its tools are available in GitHub
   Copilot Chat. Visual Studio Code manages the OAuth credentials; follow
   any later reauthentication prompt rather than copying tokens.

For more information, see [Use MCP servers in Visual Studio Code](https://code.visualstudio.com/docs/copilot/customization/mcp-servers).
Other MCP clients require their own supported Entra authentication and client
registration configuration. Don't assume that this Visual Studio Code
configuration or client ID applies to them.

### Verify the connection

In GitHub Copilot Chat, select agent mode and enable the connected server's
`aio_list_assets` tool. Ask:

```text
Use the azure-iot-operations MCP server to call aio_list_assets with no arguments.
```

Review the tool approval prompt before allowing the call. Expand the tool
invocation and confirm that it returns an asset-list result without a tool
error. An empty list is valid if no assets exist. An answer generated without
a tool invocation doesn't verify the connection. The default `Reader` policy
permits this tool. Discovery names might include a connection prefix.

If connection or sign-in fails, inspect the server's output in Visual Studio
Code. Check the full APIM URL, public OAuth metadata, advertised scope,
Visual Studio Code client authorization, signed-in tenant, and the user's
`AIOMcpAdmin` assignment. Resolve consent or Conditional Access requirements
with your administrator. If the client connects but a tool is missing or
denied, check the relay ServiceAccount's gateway role and the connection's
policy. See [Troubleshoot MCP](troubleshoot-mcp.md).

## Related content

- [Connect to MCP](howto-connect-ai-agent.md)
- [Configure MCP authorization](howto-configure-mcp-authorization.md)
- [Troubleshoot MCP](troubleshoot-mcp.md)
