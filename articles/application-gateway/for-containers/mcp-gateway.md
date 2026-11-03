---
title: Model Context Protocol (MCP) capabilities in Application Gateway for Containers
description: Learn how to use Application Gateway for Containers as an MCP gateway to route, aggregate, secure, and operate Model Context Protocol servers.
services: application-gateway
author: mbender-ms
ms.service: azure-application-gateway-containers
ms.topic: concept-article
ms.date: 11/03/2026
ms.author: mbender
# Customer intent: As a platform engineer, I want to understand MCP routing in Application Gateway for Containers so that I can expose MCP servers through a governed, scalable gateway.
---

# Model Context Protocol (MCP) capabilities in Application Gateway for Containers

AI applications and agents are more useful when they can interact with external systems, not just generate text. For example, an agent might need to search product documentation, look up an order, or create an incident. Without a common protocol, every AI application needs custom integration code for every external system.

Model Context Protocol (MCP) provides a standard way for AI applications to discover and use those integrations. An MCP server can expose:

- **Tools** that an AI application can invoke to perform an action.
- **Resources** that an AI application can read for context.
- **Prompts** that provide reusable interaction templates.

An MCP client connects to a server, initializes a session, discovers its capabilities, and invokes the capability it needs. Application Gateway for Containers can act as an MCP gateway between those clients and MCP servers running in Kubernetes. It doesn't create MCP capabilities or replace the MCP servers; it provides the client-facing entry point and governs how clients reach them.

## Why use an MCP gateway?

A direct client-to-server connection can work for one MCP server. As an organization adds servers, however, each client might need to know every server address and each server might need its own internet exposure, TLS configuration, authentication enforcement, health monitoring, and scaling strategy.

For example, an organization might operate separate MCP servers for orders, inventory, and support incidents. Exposing each server directly gives clients three endpoints to configure and gives platform teams three public surfaces to secure and operate. Adding another server requires another client configuration change.

Application Gateway for Containers provides a stable boundary between MCP clients and those servers. It can:

- **Provide one governed entry point.** Clients connect to a stable hostname and path while backend Services can scale, move, or be replaced inside the cluster.
- **Aggregate independent MCP servers.** A single endpoint can present tools, resources, and prompts from multiple backend servers, so clients don't need a separate connection for every server.
- **Centralize protection.** Platform teams can apply TLS, JWT validation, Web Application Firewall (WAF), and backend security policies at the gateway instead of implementing the same controls independently in every server.
- **Preserve team ownership.** Different teams can deploy and operate their own MCP servers while a shared gateway provides consistent external access.
- **Improve operations.** Gateway status, backend health checks, timeouts, load balancing, and best-effort session affinity provide a common way to operate MCP traffic.

The result is separation of responsibilities: application teams build MCP capabilities, platform teams govern access and connectivity, and AI clients use a smaller, more stable set of endpoints.

## How Application Gateway for Containers adds MCP support

Application Gateway for Containers extends the Kubernetes Gateway API with an Application Gateway for Containers-specific custom resource named `MCPRoute`. An `MCPRoute` attaches to a standard Gateway API `Gateway`, but its MCP-aware routing and aggregation capabilities are provided by Application Gateway for Containers, not by the upstream Gateway API.

MCP uses HTTP as a transport, but its sessions, capability discovery, and JSON-RPC messages have application-level meaning. A general `HTTPRoute` can forward those messages, but it treats each request independently. Application Gateway for Containers understands enough of the MCP request flow to aggregate discovery across servers, direct an invocation to the server that owns a capability, and maintain best-effort affinity for stateful sessions.

With `MCPRoute`, you can:

- Publish an MCP server on a hostname and URL path.
- Route one public MCP endpoint to one Kubernetes Service.
- Combine multiple MCP servers behind one endpoint and present their tools, resources, and prompts through an aggregated catalog.
- Preserve stateful MCP sessions with best-effort session affinity.
- Apply Application Gateway for Containers capabilities such as JWT validation, WAF, backend TLS, health checks, and cross-namespace references.

> [!IMPORTANT]
> `MCPRoute` uses the `alb.networking.azure.io/v1alpha1` API. Preview APIs can change before general availability.

Use `MCPRoute` when the endpoint is an MCP server. Continue to use `HTTPRoute` for conventional web APIs and `GRPCRoute` for gRPC services.

## How MCP routing works

An MCP deployment has three main resources:

- A `Gateway` provides the client-facing address and listener.
- An `MCPRoute` attaches to the listener and defines the public MCP path.
- One or more Kubernetes Services identify the MCP server backends.

The Gateway listener uses the HTTP or HTTPS protocol and explicitly allows the `MCPRoute` kind:

```yaml
listeners:
- name: mcp
  protocol: HTTPS
  port: 443
  allowedRoutes:
    namespaces:
      from: Same
    kinds:
    - group: alb.networking.azure.io
      kind: MCPRoute
```

The route selects that listener through `parentRefs` and maps its public path to a backend Service:

```yaml
apiVersion: alb.networking.azure.io/v1alpha1
kind: MCPRoute
metadata:
  name: tools
  namespace: mcp
spec:
  parentRefs:
  - name: mcp-gateway
    sectionName: mcp
  hostnames:
  - mcp.contoso.com
  path: /mcp
  backendRefs:
  - name: tools-server
    port: 8080
```

If you omit `spec.path`, it defaults to `/mcp`. A backend can expose MCP on a different path by setting `backendRefs[].path`. For example, the gateway can publish `/engineering` and forward it to `/mcp` on the backend.

## Dedicated listener and route isolation

A Gateway must allow `MCPRoute` in `listeners[].allowedRoutes.kinds`. This explicit attachment prevents an HTTP-only listener from unintentionally accepting an MCP route.

You can host MCP and web applications on the same Gateway by using separate listeners or hostnames. For example, one listener can allow `MCPRoute` for `mcp.contoso.com`, while another allows `HTTPRoute` for `www.contoso.com`.

> [!NOTE]
> An `MCPRoute` must attach directly to a `Gateway`. Application Gateway for Containers doesn't currently support attaching an `MCPRoute` to a Gateway API `ListenerSet`. To let teams manage MCP routes in their own namespaces, define the MCP listener on the shared Gateway and use the listener's `allowedRoutes.namespaces` setting to control which namespaces can attach routes. ListenerSet-based delegation of listener ownership isn't currently available for MCP endpoints.

Route attachment also follows Gateway API namespace rules:

- `allowedRoutes.namespaces.from: Same` accepts routes only from the Gateway namespace.
- `allowedRoutes.namespaces.from: All` permits routes from other namespaces.
- A listener hostname and route hostname must intersect for the route to attach.

Check the route's `Accepted` and `ResolvedRefs` status conditions to confirm listener attachment and backend resolution.

## Single-server routing

When you use one `backendRef`, Application Gateway for Containers proxies MCP requests directly to that Service.

Use single-server routing when:

- One team owns the full MCP capability set.
- The MCP server already aggregates its own downstream systems.
- You want a distinct hostname or path for each MCP server.

You can configure each backend reference with the following fields:

| Field | Purpose |
| --- | --- |
| `name` and `port` | Select the Kubernetes Service and Service port. |
| `namespace` | Select a Service in another namespace. Requires a `ReferenceGrant`. |
| `path` | Rewrite the public route path to the MCP path exposed by the server. |
| `hostRewrite` | Set the `Host` header sent to the backend. |
| `timeout` | Set the per-request backend timeout. |
| `sessionAffinity` | Keep an MCP session on the pod that handled initialization. |

## Multi-server aggregation

An `MCPRoute` with multiple `backendRefs` creates one logical MCP endpoint from multiple servers.

For discovery requests such as `tools/list`, `resources/list`, and `prompts/list`, Application Gateway for Containers sends the request to each backend and merges the responses. Capability names are namespaced to avoid collisions. For example, a `get_order` tool from the `contoso-tools` Service is exposed as:

```text
contoso-tools__get_order
```

When a client invokes the namespaced tool, the gateway removes the Service prefix and routes the invocation to the correct backend.

Aggregation is useful when independent teams own separate MCP servers but clients need one stable endpoint and one combined catalog. It also avoids building and operating a separate aggregation application.

Consider the following when you use aggregation:

- Service names become part of the client-visible capability namespace. Choose stable, descriptive names.
- A route can reference up to 64 backends.
- Backends should implement compatible MCP protocol behavior.
- Set backend timeouts with slow or variable downstream systems in mind.
- Monitor each backend independently. A combined endpoint can be only as useful as the servers that supply its capabilities.

## Stateful sessions and affinity

Some MCP servers keep in-memory state after the `initialize` request. Set `sessionAffinity: true` on the backend reference to pin the session to the pod that initialized it.

```yaml
backendRefs:
- name: stateful-mcp-server
  port: 8080
  path: /mcp
  sessionAffinity: true
```

Session affinity is best effort. If the selected pod is removed or becomes unavailable, requests return to normal load balancing instead of failing solely because the original pod is gone. MCP servers should therefore tolerate session loss or store important state outside the pod when possible.

Do not enable session affinity unless the backend requires it. Stateless servers generally scale and recover more predictably without affinity.

## Security and policy integration

MCP endpoints can expose tools that read data or perform actions. Protect them as application APIs, not as anonymous infrastructure endpoints.

### Transport security

Use an HTTPS listener so MCP messages and bearer tokens are encrypted between the client and gateway. Use `BackendTLSPolicy` when the connection from Application Gateway for Containers to the MCP Service must also use TLS. Backend TLS can validate a private certificate authority and the expected subject alternative name.

### JWT validation

Attach an `AuthPolicy` to an `MCPRoute`, its parent Gateway, or the managed `ApplicationLoadBalancer`. The gateway can validate the token signature, issuer, lifetime, and audience before forwarding MCP traffic.

An MCP-aware OAuth client can also use OAuth Protected Resource Metadata published by the gateway to discover authorization servers and supported scopes. Publishing scopes doesn't enforce authorization. The MCP server remains responsible for checking roles, scopes, permissions, and resource ownership.

### Web Application Firewall

A WAF policy can protect an MCP route from malicious HTTP payloads and other unwanted traffic. WAF inspection and JWT validation are complementary:

1. WAF evaluates the request.
1. JWT validation authenticates the caller.
1. The MCP router processes and forwards the request.

Keep WAF policy scoping in mind when one listener hosts multiple MCP routes. A policy that targets one route doesn't automatically protect another route on the same listener.

### Cross-namespace backends

If the MCP server Service is in a different namespace from the `MCPRoute`, set `backendRefs[].namespace` and create a Gateway API `ReferenceGrant` in the Service namespace. Without the grant, the route reports `ResolvedRefs=False` with a reference-not-permitted reason.

Cross-namespace references are useful for a shared platform Gateway, while `ReferenceGrant` keeps backend owners in control of which routes can send traffic to their Services.

## Health and failure behavior

Application Gateway for Containers resolves each backend Service and reports status on the route. Use a `HealthCheckPolicy` to configure an explicit HTTP health endpoint when the inferred health check isn't suitable for the MCP server.

Common route conditions include:

| Condition | Meaning |
| --- | --- |
| `Accepted=True` | The route is allowed by and attached to its parent listener. |
| `Accepted=False` | The listener doesn't allow `MCPRoute`, the parent doesn't match, or another attachment rule failed. |
| `ResolvedRefs=True` | The referenced Services and permissions resolved successfully. |
| `ResolvedRefs=False` | A Service is missing, a cross-namespace reference isn't granted, or another backend reference is invalid. |

Treat route status as the first troubleshooting signal. A healthy pod doesn't make an MCP endpoint reachable when the route isn't accepted or its references aren't resolved.

## Design recommendations

- Use HTTPS for all production MCP endpoints.
- Use a dedicated MCP hostname when clients or security policies differ from your web applications.
- Use a stable Service name before exposing a backend through aggregation because the name is visible in aggregated capability names.
- Enable session affinity only for servers that retain per-session state.
- Apply JWT validation at the Gateway when every child route shares the same trust boundary. Apply it directly to an `MCPRoute` when issuers, audiences, or OAuth metadata differ by endpoint.
- Use route-level WAF policies when MCP routes on the same listener have different inspection requirements.
- Configure explicit health checks for servers whose MCP endpoint isn't appropriate for probing.
- Review `Accepted` and `ResolvedRefs` after every route, listener, or backend change.

## Next steps

- [Configure Model Context Protocol routing for Application Gateway for Containers](how-to-mcp-gateway-gateway-api.md)
- [JWT validation for Application Gateway for Containers](jwt-validation.md)
