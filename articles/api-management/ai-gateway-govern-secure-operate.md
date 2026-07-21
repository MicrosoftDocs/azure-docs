---
title: Govern, secure, and operate AI Gateway tier (preview)
description: Learn how to govern, secure, network, and monitor the AI Gateway tier (preview) from Azure API Management.
ms.service: azure-api-management
author: PatAltimore
ms.author: patricka
ms.topic: how-to
ms.date: 06/29/2026
---

# Govern, secure, and operate AI Gateway tier (preview)

[!INCLUDE [api-gateway-tier-preview](./includes/preview/preview-ai-gateway-tier.md)]

Use AI Gateway tier (preview) to put common controls in front of AI models, Microsoft Foundry resources, Azure OpenAI deployments, MCP servers, and tools. Platform teams can apply governance, security, network, and monitoring settings in one place while application teams keep using the assets they need.

AI Gateway tier is in preview. Use it for pilots and production-like validation. Features, regions, limits, telemetry fields, and setup flows can change before general availability. The preview supports quick provisioning, but reliability is best effort. Monitor errors and keep a rollback path for critical applications.

## Prerequisites

- An AI Gateway tier instance.
- Permission to manage the AI Gateway tier instance.
- Access to the provider model or backend you plan to govern.
- For managed identity backend authentication, permission to assign the required role on the backend resource.
- Access to a telemetry destination, such as Application Insights or another OpenTelemetry (OTLP)-compatible endpoint.

## Governance policies

Governance policies protect AI traffic before requests reach backend models or tools. In preview, you configure policies through visual cards. You select a policy type, choose which models or tools it applies to, fill in validated fields, and select **Create**. You don't need to write XML, paste policy fragments, or use policy expressions.

You can apply policies globally to the gateway or to an individual model or tool. Use global policies for baseline controls, such as content safety for all traffic. Use asset-level policies when one model or tool has different risk, capacity, or network requirements.

When more than one policy applies to a request, the gateway evaluates all of them before it forwards the request to the backend. If any policy blocks the request, the gateway stops and returns an error without calling the backend:

| Policy | Status on block |
| --- | --- |
| IP filtering | 403 |
| Content safety | 400 |
| Token rate limit | 429 (with `Retry-After`) |
| Request rate limit | 429 (with `Retry-After`) |

When both a token limit and a request limit apply, a request must satisfy both.

The following diagram shows where governance policies apply in the request flow.

:::image type="content" source="media/ai-gateway-request-lifecycle.png" alt-text="Sequence diagram showing the gateway validate the runtime key, evaluate policies, and either forward the request to the backend and emit telemetry, or return a 403 or 429 error when a policy blocks the request." lightbox="media/ai-gateway-request-lifecycle.png":::

To configure a policy:

1. In the AI Gateway tier portal, select **Policies**, and then select **Add policy**.
1. On **Type**, choose the policy (guardrail) you want to add — content safety, IP filter, token rate limit, or request rate limit.
1. On **Assets**, select the models or tools the policy applies to. For a gateway-wide baseline, select all applicable assets.
1. On **Configure**, fill in the validated fields, and then select **Create**.

:::image type="content" source="media/ai-gateway-add-policy.png" alt-text="The Add policy wizard Type step, listing guardrails grouped as Security (content safety, IP filter) and Cost and rate limits (token rate limit, request rate limit), with badges showing whether each applies to models, MCP servers, or both." lightbox="media/ai-gateway-add-policy.png":::

Start with these policy types:

- **Token rate limits**: Limit prompt, completion, or total token throughput during a rolling minute. On the **Configure** step, set the token allowance and choose what the limit applies to (for example, per caller identity). Use them to protect model capacity and reduce bursts.
- **Request rate limits**: Limit call volume during a rolling minute, applied per the dimension you choose (such as caller identity). Use them for tools that call SaaS APIs or internal systems with strict quotas.
- **Content safety**: Inspect prompts, tool inputs, model outputs, or tool responses with Azure AI Content Safety. Configure category thresholds (hate, sexual, violence, self-harm) and jailbreak detection, and choose whether to block, log, or both. A blocked call returns an error to the client.
- **IP filtering**: Restrict runtime calls to approved client network ranges by IPv4 or IPv6 CIDR. Apply it globally for private applications, or to a specific tool that needs a tighter boundary.

Governance policies are operational controls. Token limits help reduce spikes and provide usage signals. For financial reporting, use provider billing or Azure Cost Management.

## Security and identity

Sign in to manage the gateway with Microsoft Entra ID. Use Entra groups instead of individual accounts where possible. Use least privilege for every identity, don't share accounts, and use one service principal or managed identity per pipeline or workload.

Don't store provider API keys, collector tokens, runtime access keys, or application secrets in source code, build logs, local files, or notebooks. Provide credentials only through the gateway import and key flows.

For backend authentication, prefer managed identity when the backend supports it. Managed identity removes backend key storage from gateway configuration and lets you manage access with Azure RBAC on the backend resource. If a provider or legacy setup doesn't support managed identity, configure an API key. For MCP tools, OAuth is also supported.

## Runtime access keys

Runtime access keys let client applications call assets exposed by AI Gateway tier without receiving backend credentials. Client applications authenticate to the gateway with runtime access keys. A client sends a runtime access key to the gateway in the `api-key` header. The gateway validates the key, applies governance policies, and authenticates to the backend by using the configured API key, OAuth configuration for tools, or managed identity. Use runtime access keys for agent applications, evaluation harnesses, developer tools, and automation that call MCP servers, OpenAPI-generated MCP tools, model resources, or other gateway assets.

The gateway generates a runtime access key, assigns it to an owner, and rotates or revokes it as needed. In preview, every key is gateway-scoped: it grants access to all published models and tools in the gateway, and per-asset scoping isn't available yet. Create separate keys per application and environment so you can rotate and audit them independently.

To create a runtime access key:

1. In the AI Gateway tier portal, select **Keys**.
1. Select **Create API key**.
1. Enter a stable name and identify the owner.
1. Optionally set an expiration date.
1. Select **Create**.
1. Copy the value immediately. The key is shown only at creation and after rotation.

Client applications include the runtime access key in the `api-key` header. Don't paste runtime access keys into source code, build logs, notebooks, or shared chat. Store them in your deployment platform's secret store or another approved secret manager. Use one key per application and environment. Rotate keys regularly and whenever ownership changes. If a key might be exposed, rotate or revoke it immediately and review gateway logs.

## Use managed identity for backend authentication

Configure managed identity so AI Gateway tier can authenticate to supported model and MCP server backends without storing API keys. Using managed identity to access models and MCP servers is available in public preview. Prefer managed identity where supported because it reduces backend key management. It removes key rotation from gateway configuration and lets you manage access with Azure RBAC. AI Gateway tier supports system-assigned and user-assigned managed identities. Manage them on the **Managed identities** page in the AI Gateway tier portal.

:::image type="content" source="media/ai-gateway-managed-identities.png" alt-text="The Managed identities page in the AI Gateway tier portal, showing a system-assigned identity toggle and a section for attaching user-assigned identities." lightbox="media/ai-gateway-managed-identities.png":::

Use a system-assigned identity when one gateway needs backend access. Use a user-assigned identity when multiple gateways need a shared identity. Use an API key when a provider doesn't support managed identity.

Before you configure backend authentication, make sure you have these items:

- An AI Gateway tier instance.
- A Microsoft Foundry or Azure OpenAI resource that hosts the model deployment.
- Permission to update gateway identity settings.
- Permission to assign Azure RBAC roles on the backend resource.
- Azure CLI 2.57.0 or later.

To enable a system-assigned identity, open the **Managed identities** page in the AI Gateway tier portal. On **Configure identities**, turn on the **System-assigned identity**, and then copy its **Object (principal) ID**.

To enable a user-assigned identity, create the identity in the same tenant as the gateway and backend resource. On the **Managed identities** page, select **User-assigned** > **Add identity**, and choose it. Copy the managed identity's **Client ID** and **Object (principal) ID**. The gateway uses the client ID to request a token. Azure RBAC uses the principal ID.

Grant the gateway identity access to each backend resource at the narrowest practical scope. In most cases, use the individual Foundry or Azure OpenAI resource.

| Principal | Role | Scope |
| --- | --- | --- |
| Gateway system-assigned identity | Cognitive Services OpenAI User | Foundry or Azure OpenAI resource |
| Gateway user-assigned identity | Cognitive Services OpenAI User | Foundry or Azure OpenAI resource |

Use the following Azure CLI snippet. Replace the placeholders with your values.

Gather these values:

- `GATEWAY_PRINCIPAL_ID`: the Object (principal) ID of the gateway's managed identity.
- `BACKEND_RESOURCE_ID`: the full Azure resource ID of the Microsoft Foundry or Azure OpenAI resource, in the format `/subscriptions/...`.

```azurecli
GATEWAY_PRINCIPAL_ID="<gateway-managed-identity-principal-id>"
BACKEND_RESOURCE_ID="/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.CognitiveServices/accounts/<foundry-or-aoai-resource-name>"

az role assignment create \
  --assignee-object-id "$GATEWAY_PRINCIPAL_ID" \
  --assignee-principal-type ServicePrincipal \
  --role "Cognitive Services OpenAI User" \
  --scope "$BACKEND_RESOURCE_ID"
```

Role assignments can take several minutes to propagate. Confirm the assignment:

```azurecli
az role assignment list \
  --assignee-object-id "$GATEWAY_PRINCIPAL_ID" \
  --scope "$BACKEND_RESOURCE_ID" \
  --output table
```

When you import a model, choose managed identity as the backend authentication method. In the **Add models** wizard, select **Import from Foundry**, and choose the subscription, resource, and model deployment. On **Provider details**, select **Managed identity**, and then choose the system-assigned identity or a user-assigned identity attached to the gateway. Clients that call the gateway don't need backend keys.

If calls fail with 401 errors, confirm the import uses managed identity and the backend accepts Entra ID authentication. If calls fail with 403 errors, confirm the identity's principal ID has the **Cognitive Services OpenAI User** role at the backend resource scope, and wait for role assignment propagation.

## Regional availability

During public preview, the AI Gateway tier is available in the following Azure regions.

| Geography | Preview region |
| --- | --- |
| United States | East US 2 |
| Europe | Sweden Central |

Region availability can vary by subscription, cloud, capacity, feature flag, and preview enrollment. If your target region isn't available in the portal or deployment tools, select another supported preview region or contact your Microsoft representative.

Choose the region that best matches your users, applications, AI backends, and network dependencies. If the gateway routes to Azure OpenAI, Microsoft Foundry, model endpoints, APIs, or MCP servers, consider those locations too. Data residency depends on the full request path, not only the gateway region. Review where each component is deployed, including the gateway, AI backends, tools, logging destinations, managed identities, and client applications.

## Private networking

Use private networking when gateway traffic shouldn't use the public internet. Private networking has two directions:

- **Inbound Private Link and private endpoint**: Lets clients in your virtual network, peered networks, or connected on-premises networks reach the gateway by using a private IP address.
- **Outbound virtual network integration**: Lets the gateway call private backends, model endpoints, APIs, and MCP servers that are reachable only from your virtual network.

:::image type="content" source="media/ai-gateway-networking.png" alt-text="The Networking page showing inbound settings (private endpoints and public network access) and outbound settings (public or private routing) for the gateway." lightbox="media/ai-gateway-networking.png":::

Inbound and outbound networking solve different problems. Creating a private endpoint for clients to call the gateway doesn't automatically let the gateway reach private backends. Configure outbound virtual network integration separately when the gateway must reach resources in your network.

Before you configure private networking, prepare these items:

- An AI Gateway tier resource in a supported preview region.
- A virtual network with non-overlapping address space.
- Subnets for private endpoints and outbound integration.
- Permissions to create private endpoints and DNS resources.
- Backend resources reachable from the integration subnet.

### Inbound Private Link

To set up inbound Private Link:

- Create or select the client virtual network.
- Create a private endpoint for the gateway, and approve the connection if needed.
- Configure private DNS zones.
- Verify that the gateway host name resolves to the private endpoint IP from a test client.

If supported in your preview configuration, restrict public network access after private connectivity is confirmed.

DNS is a common source of issues. Clients must resolve the gateway hostname to the private endpoint IP address. Link the required private DNS zones to the right virtual networks, or configure custom DNS forwarding.

### Outbound virtual network integration

To set up outbound virtual network integration, identify every backend the gateway must call. Confirm ports, protocols, and hostnames. Configure outbound VNet integration, allow traffic from the integration subnet to backend resources, and configure DNS so private backend hostnames resolve to private IP addresses. Test by invoking a route, model, tool, or MCP server operation.

DNS is a common source of issues. The gateway must resolve backend hostnames to private IP addresses. Link the required private DNS zones to the right virtual networks, or configure custom DNS forwarding.

## Monitoring

AI Gateway tier emits OpenTelemetry logs and metrics for model traffic — latency, reliability, token use, policy outcomes, and model behavior. You choose where telemetry goes. Keep it in your Azure subscription, or send OpenTelemetry signals to Application Insights or another OpenTelemetry (OTLP)-compatible destination, such as Datadog, Splunk, or Grafana Cloud.

> [!NOTE]
> In public preview, OpenTelemetry logs and metrics cover model traffic. Telemetry for MCP tool calls is a fast follow.

AI Gateway tier follows OpenTelemetry and the OpenTelemetry Generative AI semantic conventions where possible. Requests can include standard HTTP, network, and trace attributes. They can also include GenAI attributes with the `gen_ai.*` prefix, such as requested model, operation name, input tokens, output tokens, and finish reasons. Not every backend returns the same fields — some providers omit token counts in streaming or passthrough responses. Treat missing token attributes as unavailable, not as zero.

Commonly emitted GenAI attributes include:

| Attribute | Description |
| --- | --- |
| `gen_ai.request.model` | The model name from the request's `model` field. |
| `gen_ai.response.model` | The model that produced the response. |
| `gen_ai.operation.name` | The operation, such as `chat` or `responses`. |
| `gen_ai.usage.input_tokens` | Prompt (input) token count, when the backend reports it. |
| `gen_ai.usage.output_tokens` | Completion (output) token count, when the backend reports it. |
| `gen_ai.response.finish_reasons` | Why generation stopped, such as `stop` or `length`. |

Configure a telemetry destination in the gateway's monitoring settings. For Application Insights, select the resource in your subscription. For a generic OpenTelemetry (OTLP) endpoint, provide the collector URL and any required access token or headers. Use Application Insights when you want Azure-native traces, logs, Kusto queries, and Azure Monitor alerts. Use Datadog, Splunk, Grafana Cloud, or a generic OTLP collector when those are your standard operational platforms. Protect destination credentials as secrets, and monitor telemetry export failures.

The AI Gateway tier portal can show built-in dashboards from Kusto queries against your Application Insights resource. The data stays in your subscription and uses your Azure Monitor permissions. Use dashboards to review request volume, success rate, throttles, latency, model usage, token trends, and policy outcomes.

For example, this Kusto query summarizes request volume and average duration by model over the last day:

```kusto
requests
| where timestamp > ago(1d)
| summarize count(), avg(duration) by tostring(customDimensions["gen_ai.request.model"])
```

Use model and token usage for consumption estimates, then reconcile with provider billing or Azure Cost Management exports for financial reporting.

For troubleshooting, use W3C trace context. If an application sends `traceparent` and `tracestate` headers, the gateway keeps the distributed trace relationship when it exports telemetry. Also send an `x-correlation-id` header for application-level investigations. Don't put personal data, secrets, prompts, or regulated identifiers in correlation headers.

Start with alerts you can act on, such as high 5xx rate, high P95 or P99 latency, token spikes, policy-deny spikes, backend authentication failures, throttling spikes, and telemetry export failures. Route every alert to an owner who can investigate the gateway, backend, policy, or destination configuration.

## Related content

- [AI Gateway tier overview](./ai-gateway-overview.md)
- [Quickstart: Create an AI Gateway tier instance](./quickstart-ai-gateway-create.md)
- [Manage models and tools](./ai-gateway-manage-models-tools.md)
