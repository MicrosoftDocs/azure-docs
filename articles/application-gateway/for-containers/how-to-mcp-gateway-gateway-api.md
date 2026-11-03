---
title: Configure an MCP gateway for Application Gateway for Containers - Gateway API
description: Learn how to configure an MCPRoute to publish and aggregate Model Context Protocol servers through Application Gateway for Containers.
services: application gateway
author: mbender-ms
ms.service: azure-application-gateway-containers
ms.topic: how-to
ms.date: 10/27/2026
ms.author: mbender
# Customer intent: As a platform engineer, I want to configure Application Gateway for Containers as an MCP gateway, so that clients can reach one or more MCP servers through a stable, governed endpoint.
---

# Configure an MCP gateway for Application Gateway for Containers - Gateway API

This article shows you how to configure Application Gateway for Containers as a Model Context Protocol (MCP) gateway. You use the Application Gateway for Containers `MCPRoute` custom resource to publish one MCP server, verify the endpoint with an MCP initialize request, and optionally aggregate multiple MCP servers behind the same endpoint.

> [!IMPORTANT]
> MCP routing and the `MCPRoute` API are currently in preview.<br>
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

For an overview of MCP gateways, aggregation, session affinity, and policy integration, see [Model Context Protocol (MCP) capabilities in Application Gateway for Containers](mcp-gateway.md).

## Prerequisites

Before you begin, ensure you have:

1. If you're using the bring-your-own (BYO) deployment strategy, set up your Application Gateway for Containers resources and ALB Controller by using the [Add-on](quickstart-deploy-application-gateway-for-containers-alb-controller-addon.md) or [Helm](quickstart-deploy-application-gateway-for-containers-alb-controller-helm.md).
1. If you're following the ALB managed deployment strategy, install ALB Controller by using the [Add-on](quickstart-deploy-application-gateway-for-containers-alb-controller-addon.md) or [Helm](quickstart-deploy-application-gateway-for-containers-alb-controller-helm.md), and provision the Application Gateway for Containers resources by using the [ApplicationLoadBalancer custom resource](quickstart-create-application-gateway-for-containers-managed-by-alb-controller.md).

The following table shows the resources used in the examples:

| Resource | Value |
| --- | --- |
| Namespace | `mcp-demo` |
| Gateway | `mcp-gateway` |
| Listener | `mcp` |
| MCPRoute | `tools` |
| Public hostname | `mcp.contoso.com` |
| Public MCP path | `/mcp` |
| Backend Service | `tools-server` |
| Backend Service port | `8080` |
| Backend MCP path | `/mcp` |

If your resources use different values, update the manifests and commands.

## Create a namespace

Create a namespace for the example resources:

```bash
kubectl create namespace mcp-demo
```

## Deploy a sample MCP server

Create a ConfigMap that contains a small MCP server for this walkthrough. The server supports MCP over Streamable HTTP and exposes one configurable tool:

> [!NOTE]
> This sample server is for validating the walkthrough only. It uses a fixed demonstration session identifier and doesn't implement production authentication, authorization, persistence, or complete MCP lifecycle behavior. Don't use it for production workloads.

```bash
kubectl apply -f - <<'EOF'
apiVersion: v1
kind: ConfigMap
metadata:
  name: sample-mcp-server
  namespace: mcp-demo
data:
  server.py: |
    import json
    import os
    from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

    TOOL_NAME = os.environ.get("TOOL_NAME", "create_ticket")
    TOOL_DESCRIPTION = os.environ.get(
        "TOOL_DESCRIPTION", "Create a sample support ticket"
    )
    TOOL_RESPONSE = os.environ.get(
        "TOOL_RESPONSE", "Sample support ticket created"
    )
    SESSION_ID = "agc-mcp-demo-session"

    class Handler(BaseHTTPRequestHandler):
        def send_json(self, status, payload, include_session=False):
            body = json.dumps(payload).encode()
            self.send_response(status)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(body)))
            if include_session:
                self.send_header("Mcp-Session-Id", SESSION_ID)
            self.end_headers()
            self.wfile.write(body)

        def do_GET(self):
            if self.path == "/healthz":
                self.send_json(200, {"status": "healthy"})
                return
            self.send_json(404, {"error": "not found"})

        def do_POST(self):
            if self.path != "/mcp":
                self.send_json(404, {"error": "not found"})
                return

            length = int(self.headers.get("Content-Length", "0"))
            try:
                request = json.loads(self.rfile.read(length))
            except (json.JSONDecodeError, ValueError):
                self.send_json(400, {"error": "invalid JSON"})
                return

            request_id = request.get("id")
            method = request.get("method")

            if method == "initialize":
                result = {
                    "protocolVersion": "2025-06-18",
                    "capabilities": {"tools": {}},
                    "serverInfo": {
                        "name": "agc-sample-mcp-server",
                        "version": "1.0.0"
                    }
                }
            elif method == "tools/list":
                result = {
                    "tools": [{
                        "name": TOOL_NAME,
                        "description": TOOL_DESCRIPTION,
                        "inputSchema": {
                            "type": "object",
                            "properties": {}
                        }
                    }]
                }
            elif method == "tools/call":
                result = {
                    "content": [{"type": "text", "text": TOOL_RESPONSE}],
                    "isError": False
                }
            elif method == "notifications/initialized":
                self.send_response(202)
                self.end_headers()
                return
            else:
                self.send_json(200, {
                    "jsonrpc": "2.0",
                    "id": request_id,
                    "error": {
                        "code": -32601,
                        "message": "Method not found"
                    }
                })
                return

            self.send_json(200, {
                "jsonrpc": "2.0",
                "id": request_id,
                "result": result
            }, include_session=(method == "initialize"))

        def log_message(self, format, *args):
            print("%s - %s" % (self.address_string(), format % args))

    ThreadingHTTPServer(("0.0.0.0", 8080), Handler).serve_forever()
EOF
```

Deploy the sample server and expose it through a Kubernetes Service named `tools-server`:

```bash
kubectl apply -f - <<'EOF'
apiVersion: apps/v1
kind: Deployment
metadata:
  name: tools-server
  namespace: mcp-demo
spec:
  replicas: 1
  selector:
    matchLabels:
      app: tools-server
  template:
    metadata:
      labels:
        app: tools-server
    spec:
      containers:
      - name: server
        image: python:3.12-alpine
        command:
        - python
        - /app/server.py
        env:
        - name: TOOL_NAME
          value: create_ticket
        - name: TOOL_DESCRIPTION
          value: Create a sample support ticket
        - name: TOOL_RESPONSE
          value: Sample support ticket created
        ports:
        - name: http
          containerPort: 8080
        readinessProbe:
          httpGet:
            path: /healthz
            port: 8080
          initialDelaySeconds: 2
          periodSeconds: 2
        volumeMounts:
        - name: server
          mountPath: /app
          readOnly: true
      volumes:
      - name: server
        configMap:
          name: sample-mcp-server
---
apiVersion: v1
kind: Service
metadata:
  name: tools-server
  namespace: mcp-demo
spec:
  selector:
    app: tools-server
  ports:
  - name: http
    port: 8080
    targetPort: 8080
EOF
```

Wait for the server to become available:

```bash
kubectl rollout status deployment/tools-server \
  -n mcp-demo \
  --timeout=5m
```

The `MCPRoute` in this walkthrough uses the Service `port`, not the container `targetPort`.

## Deploy the required Gateway API resources

The Gateway listener must explicitly allow the Application Gateway for Containers `MCPRoute` kind.

# [ALB managed deployment](#tab/alb-managed)

Create the Gateway:

```bash
kubectl apply -f - <<'EOF'
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: mcp-gateway
  namespace: mcp-demo
  annotations:
    alb.networking.azure.io/alb-namespace: mcp-demo
    alb.networking.azure.io/alb-name: mcp-alb
spec:
  gatewayClassName: azure-alb-external
  listeners:
  - name: mcp
    protocol: HTTP
    port: 80
    hostname: mcp.contoso.com
    allowedRoutes:
      namespaces:
        from: Same
      kinds:
      - group: alb.networking.azure.io
        kind: MCPRoute
EOF
```

[!INCLUDE [application-gateway-for-containers-frontend-naming](../../../includes/application-gateway-for-containers-frontend-naming.md)]

# [Bring your own (BYO) deployment](#tab/byo)

1. Set the environment variables.

```bash
RESOURCE_GROUP='<resource group name of the Application Gateway for Containers resource>'
RESOURCE_NAME='<Application Gateway for Containers resource name>'

RESOURCE_ID=$(az network alb show --resource-group $RESOURCE_GROUP --name $RESOURCE_NAME --query id -o tsv)
FRONTEND_NAME='<frontend name>'
```

2. Create the Gateway.

```bash
kubectl apply -f - <<EOF
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: mcp-gateway
  namespace: mcp-demo
  annotations:
    alb.networking.azure.io/alb-id: ${RESOURCE_ID}
spec:
  gatewayClassName: azure-alb-external
  listeners:
  - name: mcp
    protocol: HTTP
    port: 80
    hostname: mcp.contoso.com
    allowedRoutes:
      namespaces:
        from: Same
      kinds:
      - group: alb.networking.azure.io
        kind: MCPRoute
  addresses:
  - type: alb.networking.azure.io/alb-frontend
    value: ${FRONTEND_NAME}
EOF
```

---

> [!NOTE]
> You must attach `MCPRoute` directly to a `Gateway`. Application Gateway for Containers doesn't currently support attaching `MCPRoute` to a Gateway API `ListenerSet`.

For production, configure an HTTPS listener and a certificate instead of exposing an unencrypted HTTP endpoint.

Wait for the Gateway to be accepted and programmed:

```bash
kubectl wait gateway/mcp-gateway \
  -n mcp-demo \
  --for=condition=Accepted \
  --timeout=5m

kubectl wait gateway/mcp-gateway \
  -n mcp-demo \
  --for=condition=Programmed \
  --timeout=5m
```

Inspect the Gateway.

```bash
kubectl get gateway mcp-gateway -n mcp-demo -o yaml
```

Confirm that:

- The Gateway has `Accepted=True`.
- The Gateway has `Programmed=True`.
- The `mcp` listener has `Accepted=True` and `Programmed=True`.
- The listener's `supportedKinds` includes group `alb.networking.azure.io` and kind `MCPRoute`.
- The Gateway has an assigned address.

## Create an MCPRoute

Create an `MCPRoute` that publishes `/mcp` and forwards requests to the `tools-server` Service:

```bash
kubectl apply -f - <<'EOF'
apiVersion: alb.networking.azure.io/v1alpha1
kind: MCPRoute
metadata:
  name: tools
  namespace: mcp-demo
spec:
  parentRefs:
  - group: gateway.networking.k8s.io
    kind: Gateway
    name: mcp-gateway
    sectionName: mcp
  hostnames:
  - mcp.contoso.com
  path: /mcp
  backendRefs:
  - name: tools-server
    port: 8080
    path: /mcp
EOF
```

The route has two path settings:

- `spec.path` is the path exposed to MCP clients.
- `spec.backendRefs[].path` is the path used when Application Gateway for Containers forwards the request to that backend.

If the backend serves the same path as the route, you can omit `backendRefs[].path`. If you omit `spec.path`, it defaults to `/mcp`.

## Verify route status

Wait for the route to be accepted:

```bash
kubectl wait mcproute/tools \
  -n mcp-demo \
  --for=condition=Accepted \
  --timeout=5m

kubectl wait mcproute/tools \
  -n mcp-demo \
  --for=condition=ResolvedRefs \
  --timeout=5m
```

Inspect all route conditions:

```bash
kubectl get mcproute tools -n mcp-demo -o yaml
```

A working route has:

- `Accepted=True`, which confirms that the route attached to the listener.
- `ResolvedRefs=True`, which confirms that the backend Service and references are valid.

If `Accepted=False`, confirm that `parentRefs[].sectionName` matches the listener name and that the listener allows `MCPRoute`.

If `ResolvedRefs=False`, confirm that the Service name and port are correct. For a Service in another namespace, also confirm that a `ReferenceGrant` permits the reference.

## Test the MCP endpoint

Get the Gateway address:

```bash
GATEWAY_ADDRESS=$(kubectl get gateway mcp-gateway \
  -n mcp-demo \
  -o jsonpath='{.status.addresses[0].value}')

printf '%s\n' "${GATEWAY_ADDRESS}"
```

Send an MCP initialize request through the Gateway:

```bash
curl -i \
  -H 'Host: mcp.contoso.com' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  --data '{
    "jsonrpc": "2.0",
    "id": "initialize-1",
    "method": "initialize",
    "params": {
      "protocolVersion": "2025-06-18",
      "capabilities": {},
      "clientInfo": {
        "name": "agc-mcp-test-client",
        "version": "1.0.0"
      }
    }
  }' \
  "http://${GATEWAY_ADDRESS}/mcp"
```

The gateway returns `200 OK`. The JSON-RPC response contains an initialization result from the MCP server. A stateful MCP server can also return an `Mcp-Session-Id` response header that the client includes in subsequent requests.

After you create a DNS record that maps `mcp.contoso.com` to the Gateway address, configure an MCP client to use:

```text
http://mcp.contoso.com/mcp
```

Initialize a session and run the client's tool, resource, and prompt discovery operations. A successful connection confirms Gateway attachment, backend routing, and MCP processing.

> [!NOTE]
> MCP over Streamable HTTP requires an `Accept` header that includes `application/json` and `text/event-stream`. If the route is accepted but initialization fails, inspect the client request headers and the MCP server logs.

## Publish a different client-facing path

You can expose a stable public path even when the backend uses `/mcp`.

The following route publishes `/engineering` and rewrites it to `/mcp` for the backend:

```yaml
apiVersion: alb.networking.azure.io/v1alpha1
kind: MCPRoute
metadata:
  name: engineering
  namespace: mcp-demo
spec:
  parentRefs:
  - group: gateway.networking.k8s.io
    kind: Gateway
    name: mcp-gateway
    sectionName: mcp
  hostnames:
  - mcp.contoso.com
  path: /engineering
  backendRefs:
  - name: tools-server
    port: 8080
    path: /mcp
```

Clients connect to `http://mcp.contoso.com/engineering`, while the backend continues to serve MCP at `/mcp`.

## Aggregate multiple MCP servers

Deploy a second instance of the sample MCP server. This server exposes a `search_documentation` tool through a Service named `knowledge-server`:

```bash
kubectl apply -f - <<'EOF'
apiVersion: apps/v1
kind: Deployment
metadata:
  name: knowledge-server
  namespace: mcp-demo
spec:
  replicas: 1
  selector:
    matchLabels:
      app: knowledge-server
  template:
    metadata:
      labels:
        app: knowledge-server
    spec:
      containers:
      - name: server
        image: python:3.12-alpine
        command:
        - python
        - /app/server.py
        env:
        - name: TOOL_NAME
          value: search_documentation
        - name: TOOL_DESCRIPTION
          value: Search sample product documentation
        - name: TOOL_RESPONSE
          value: Sample documentation result
        ports:
        - name: http
          containerPort: 8080
        readinessProbe:
          httpGet:
            path: /healthz
            port: 8080
          initialDelaySeconds: 2
          periodSeconds: 2
        volumeMounts:
        - name: server
          mountPath: /app
          readOnly: true
      volumes:
      - name: server
        configMap:
          name: sample-mcp-server
---
apiVersion: v1
kind: Service
metadata:
  name: knowledge-server
  namespace: mcp-demo
spec:
  selector:
    app: knowledge-server
  ports:
  - name: http
    port: 8080
    targetPort: 8080
EOF
```

Wait for the second server to become available:

```bash
kubectl rollout status deployment/knowledge-server \
  -n mcp-demo \
  --timeout=5m
```

Replace the single-backend route with an aggregated route:

```bash
kubectl apply -f - <<'EOF'
apiVersion: alb.networking.azure.io/v1alpha1
kind: MCPRoute
metadata:
  name: tools
  namespace: mcp-demo
spec:
  parentRefs:
  - group: gateway.networking.k8s.io
    kind: Gateway
    name: mcp-gateway
    sectionName: mcp
  hostnames:
  - mcp.contoso.com
  path: /mcp
  backendRefs:
  - name: tools-server
    port: 8080
    path: /mcp
  - name: knowledge-server
    port: 8080
    path: /mcp
EOF
```

When a client sends discovery requests, Application Gateway for Containers queries both backends and merges their tools, resources, and prompts. Tool names include the source Service name to prevent collisions. For example:

```text
tools-server__create_ticket
knowledge-server__search_documentation
```

When the client invokes a prefixed tool, the gateway routes the invocation to the corresponding Service and removes the prefix before forwarding it.

Reconnect the MCP client and run `tools/list` again. Confirm that `tools-server__create_ticket` and `knowledge-server__search_documentation` appear and that an invocation reaches the correct backend.

## Enable session affinity

If a server stores MCP session state in memory, enable best-effort session affinity for that backend:

```yaml
backendRefs:
- name: tools-server
  port: 8080
  path: /mcp
  sessionAffinity: true
```

The gateway attempts to send requests in the same MCP session to the pod that handled initialization. If that pod becomes unavailable, traffic returns to normal load balancing.

Use session affinity only when required by the server. For stronger recovery guarantees, store important session state outside the pod.

## Use a backend in another namespace

To route to a Service in another namespace:

1. Set the backend namespace in the route.
1. Create a `ReferenceGrant` in the backend Service namespace.

Example backend reference:

```yaml
backendRefs:
- name: shared-tools
  namespace: shared-mcp
  port: 8080
  path: /mcp
```

Example grant in the `shared-mcp` namespace:

```yaml
apiVersion: gateway.networking.k8s.io/v1beta1
kind: ReferenceGrant
metadata:
  name: allow-mcp-demo
  namespace: shared-mcp
spec:
  from:
  - group: alb.networking.azure.io
    kind: MCPRoute
    namespace: mcp-demo
  to:
  - group: ""
    kind: Service
```

The owner of the backend namespace controls the grant. Without it, the route doesn't forward traffic to the cross-namespace Service.

## Protect the MCP endpoint

MCP tools can access data and perform actions. Before you use the endpoint in production:

1. Change the listener to HTTPS and attach a frontend certificate.
1. Attach an `AuthPolicy` to the `MCPRoute` to require a valid JWT.
1. Configure OAuth Protected Resource Metadata if MCP clients need to discover the authorization server and supported scopes.
1. Apply a WAF policy to inspect requests before MCP routing.
1. Use `BackendTLSPolicy` when traffic to the MCP server must be encrypted and authenticated.
1. Use `HealthCheckPolicy` if the default backend health behavior isn't appropriate.

The following `AuthPolicy` shape protects the route. Replace the placeholder identity values:

```yaml
apiVersion: alb.networking.azure.io/v1alpha1
kind: AuthPolicy
metadata:
  name: tools-auth
  namespace: mcp-demo
spec:
  targetRef:
    group: alb.networking.azure.io
    kind: MCPRoute
    name: tools
  jwt:
    issuer: https://login.microsoftonline.com/<tenant-id>/v2.0
    audiences:
    - <api-application-client-id>
    jwks:
      remote:
        uri: https://login.microsoftonline.com/<tenant-id>/discovery/v2.0/keys
  oauth:
    protectedResourceMetadata:
      resource: https://mcp.contoso.com/mcp
      authorizationServers:
      - https://login.microsoftonline.com/<tenant-id>/v2.0
      scopesSupported:
      - mcp.read
      - mcp.write
```

For a complete identity-provider walkthrough, see [Configure JWT validation for Application Gateway for Containers - Gateway API](how-to-jwt-validation-gateway-api.md).

Congratulations, you configured Application Gateway for Containers as an MCP gateway, published an MCP server through an `MCPRoute`, and verified the MCP initialize flow. You also learned how to aggregate multiple MCP servers behind the same endpoint.

## Troubleshooting

| Symptom | Cause | Resolution |
| --- | --- | --- |
| `Accepted=False` with `NotAllowedByListeners` | The listener doesn't allow `MCPRoute` | Add `alb.networking.azure.io/MCPRoute` to `allowedRoutes.kinds` |
| `Accepted=False` with `NoMatchingParent` | The Gateway, namespace, listener name, port, or hostname doesn't match | Correct `parentRefs` and verify hostname intersection |
| `ResolvedRefs=False` with `BackendNotFound` | A referenced Service doesn't exist | Correct the Service name and namespace |
| `ResolvedRefs=False` with `RefNotPermitted` | A cross-namespace Service reference isn't granted | Create a `ReferenceGrant` in the Service namespace |
| Client receives `404` | The public route path or backend MCP path is incorrect | Verify `spec.path` and `backendRefs[].path` |
| Client receives `401` or `403` | An `AuthPolicy` rejected the token | Check the issuer, audience, signature, token lifetime, and OAuth metadata |
| Initialization reaches different pods | A stateful server doesn't have affinity enabled | Set `sessionAffinity: true` or externalize session state |
| Aggregated tools aren't visible | One backend is unhealthy or discovery failed | Check route status, backend health, timeout settings, and each server's logs |
| Tool invocation reaches no backend | The client used a stale or unprefixed aggregated tool name | Run discovery again and invoke the Service-prefixed name |

## Clean up resources

Delete the route, Gateway, sample servers, and ConfigMap:

```bash
kubectl delete mcproute tools -n mcp-demo
kubectl delete gateway mcp-gateway -n mcp-demo
kubectl delete service tools-server knowledge-server -n mcp-demo --ignore-not-found
kubectl delete deployment tools-server knowledge-server -n mcp-demo --ignore-not-found
kubectl delete configmap sample-mcp-server -n mcp-demo
```

If you created the optional authentication policy, delete it:

```bash
kubectl delete authpolicy tools-auth -n mcp-demo
```

Delete the example namespace only if it doesn't contain an MCP server or other resources you want to keep:

```bash
kubectl delete namespace mcp-demo
```

## Next steps

- [Model Context Protocol (MCP) capabilities in Application Gateway for Containers](mcp-gateway.md)
- [JWT validation for Application Gateway for Containers](jwt-validation.md)
- [Configure JWT validation for Application Gateway for Containers - Gateway API](how-to-jwt-validation-gateway-api.md)
