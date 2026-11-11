---
title: Install Kubernetes MCP with MCP Gateway (preview)
description: Install the optional Kubernetes MCP server and register a policy-based connection through Azure IoT Operations MCP Gateway.
author: ancaantochi
ms.author: ancaantochi
ms.service: azure-iot-operations
ms.topic: how-to
ms.date: 10/15/2026
ai-usage: ai-assisted
---

# Install Kubernetes MCP with MCP Gateway (preview)

Kubernetes MCP provides tools for inspecting Kubernetes resources. It's separate
from Azure IoT Operations MCP and isn't installed by enabling the Azure IoT Operations MCP
capability. This example installs a read-only backend, exposes one pod-listing
tool, and registers it with MCP Gateway alongside the existing `aio` connection.

> [!IMPORTANT]
> MCP in Azure IoT Operations is in preview. Use a nonproduction environment
> to evaluate this example.

## Prerequisites

- [Deploy MCP](howto-deploy-mcp.md) and verify that MCP Gateway is ready.
- Helm, Azure CLI with Bicep, Bash, and `kubectl`.
- Permission to install Kubernetes resources, including Roles and RoleBindings,
  and create MCP ARM policies and connections.
- A ready `azure-iot-operations-aio-certificate-issuer` ClusterIssuer and the
  `azure-iot-operations-aio-ca-trust-bundle` ConfigMap.
- An extension with the MCP connection fields and `ToolCall` authorization
  action used by ARM API version `2026-11-01-preview`.
- An HTTPS OIDC issuer for the cluster's ServiceAccount tokens. Its discovery
  document and JSON Web Key Set (JWKS) endpoint must be reachable from the
  Kubernetes MCP pod without bearer authentication, with a trusted TLS
  certificate. For AKS, see [Enable the OIDC issuer](/azure/aks/use-oidc-issuer).
- A token audience accepted by the Kubernetes API server. Obtain this value
  from your cluster administrator; don't assume that the API server address
  or the MCP Service name is an accepted audience.

Set the variables for your instance:

```bash
export RESOURCE_GROUP="<resource-group>"
export AIO_INSTANCE_NAME="<instance-name>"
export CUSTOM_LOCATION_NAME="<custom-location-name>"
export AIO_NAMESPACE="azure-iot-operations"
export AIO_API_VERSION="2026-11-01-preview"
export K8S_OIDC_ISSUER="<cluster-service-account-issuer-url>"
export K8S_API_AUDIENCE="<kubernetes-api-audience>"

kubectl config current-context
kubectl get clusterissuer azure-iot-operations-aio-certificate-issuer
```

The examples assume the instance and custom location are in the same resource
group. Use the correct Azure subscription before deploying.

## Configure OIDC token validation

MCP Gateway obtains a ServiceAccount token (SAT) for its own identity and
sends it to Kubernetes MCP. The backend validates the token's signature,
issuer, expiry, and audience through the cluster's OIDC issuer. With
`config.cluster_auth_mode: passthrough`, it then forwards that validated
token to the Kubernetes API. It doesn't forward the original client's token.

Use the exact issuer URL, including any trailing slash, for
`K8S_OIDC_ISSUER`. You can inspect the cluster's issuer metadata with:

```bash
kubectl get --raw /.well-known/openid-configuration
```

Use its `issuer` value, not its `jwks_uri`, as the OIDC issuer URL.
The backend discovers signing keys from the issuer's discovery document.
For an issuer using a private CA, mount that CA certificate in the backend
and set `config.certificate_authority` to its file path. Don't disable TLS
certificate verification.

Set `K8S_API_AUDIENCE` to an audience accepted by the Kubernetes API.
The Helm command and ARM connection below use this same value. A token
intended only for `kubernetes-mcp` won't work unless the Kubernetes API
also accepts that audience.

The pinned backend version requires `cluster_auth_mode: passthrough` for
this OIDC configuration; it rejects `require_oauth: true` combined with
`cluster_auth_mode: kubeconfig`. Keep `skip_jwt_verification: false`.
A namespace-scoped RoleBinding grants `aio-mcp-frontend`, rather than the
backend ServiceAccount, permission to list pods.

Clients connect to MCP Gateway with audience `aio-mcp-frontend`; gateway
roles control which tools they can call. Keep the backend Service internal
and route client access through MCP Gateway.

> [!IMPORTANT]
> OIDC validation doesn't restrict callers to the gateway ServiceAccount.
> Other ServiceAccounts with valid tokens for the same issuer and audience
> can authenticate, subject to their Kubernetes RBAC permissions. Enforcing
> gateway-only access requires an additional network restriction or a
> validating proxy that checks the token's subject. An internal Service alone
> doesn't enforce that restriction.

## Create the backend TLS certificate

Save the following as `kubernetes-mcp-certificate.yaml`:

```yaml
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: kubernetes-mcp-tls
  namespace: azure-iot-operations
spec:
  secretName: kubernetes-mcp-tls
  issuerRef:
    name: azure-iot-operations-aio-certificate-issuer
    kind: ClusterIssuer
  dnsNames:
    - kubernetes-mcp
    - kubernetes-mcp.azure-iot-operations
    - kubernetes-mcp.azure-iot-operations.svc
    - kubernetes-mcp.azure-iot-operations.svc.cluster.local
```

```bash
kubectl apply -f kubernetes-mcp-certificate.yaml
kubectl -n "$AIO_NAMESPACE" wait --for=condition=Ready \
  certificate/kubernetes-mcp-tls --timeout=5m
```

## Install the Kubernetes MCP backend

Use the public upstream
[Kubernetes MCP Helm chart](https://github.com/containers/kubernetes-mcp-server/tree/main/charts/kubernetes-mcp-server)
in a separate release. This method doesn't install or modify the sample agent.

Save the following content as `k8s-mcp-values.yaml`:

```yaml
fullnameOverride: kubernetes-mcp
image:
  version: v0.0.67
ingress:
  enabled: false
service:
  type: ClusterIP
  port: 8080
serviceAccount:
  name: kubernetes-mcp
  automountToken: true
config:
  read_only: true
  cluster_auth_mode: passthrough
  require_oauth: true
  skip_jwt_verification: false
  disable_dynamic_client_registration: true
  toolsets:
    - core
  enabled_tools:
    - pods_list_in_namespace
  tls_cert: /etc/tls/tls.crt
  tls_key: /etc/tls/tls.key
tls:
  enabled: false
extraVolumes:
  - name: tls
    secret:
      secretName: kubernetes-mcp-tls
extraVolumeMounts:
  - name: tls
    mountPath: /etc/tls
    readOnly: true
livenessProbe:
  httpGet:
    path: /healthz
    port: http
    scheme: HTTPS
readinessProbe:
  httpGet:
    path: /healthz
    port: http
    scheme: HTTPS
rbac:
  create: false
```

TLS is configured through `config.tls_cert` and `config.tls_key`. Setting the
chart's `tls.enabled` to `false` avoids the TLS command-line arguments emitted
by chart version `0.1.0`; it doesn't disable HTTPS in this configuration.
The values mount the certificate you created and configure HTTPS health probes.
Pin both the chart version and image rather than using the mutable `latest` image.
The Helm command supplies `config.authorization_url` and `config.oauth_audience`
from the variables you set earlier. No client secret, long-lived token Secret,
or token copied into the values file is required.

```bash
helm upgrade --install k8s-mcp oci://ghcr.io/containers/charts/kubernetes-mcp-server \
  --version 0.1.0 \
  --namespace "$AIO_NAMESPACE" \
  --values k8s-mcp-values.yaml \
  --set-string config.authorization_url="$K8S_OIDC_ISSUER" \
  --set-string config.oauth_audience="$K8S_API_AUDIENCE" \
  --wait --timeout 5m

kubectl -n "$AIO_NAMESPACE" rollout status deployment/kubernetes-mcp --timeout=5m
kubectl -n "$AIO_NAMESPACE" get service kubernetes-mcp
```

The backend uses HTTPS on the ClusterIP Service `kubernetes-mcp:8080`; no ingress
or public Service is created. The chart doesn't grant its ServiceAccount
Kubernetes resource permissions.

Grant the gateway ServiceAccount permission to list pods in the example namespace:

```bash
kubectl -n "$AIO_NAMESPACE" create role kubernetes-mcp-pod-reader \
  --verb=list --resource=pods --dry-run=client -o yaml | kubectl apply -f -
kubectl -n "$AIO_NAMESPACE" create rolebinding kubernetes-mcp-pod-reader \
  --role=kubernetes-mcp-pod-reader \
  --serviceaccount="$AIO_NAMESPACE:aio-mcp-frontend" \
  --dry-run=client -o yaml | kubectl apply -f -
```

This Role grants only pod listing in `azure-iot-operations`. It doesn't grant
access to Secrets, pod execution, or resource modification. Kubernetes RBAC
grants are additive. Review any other permissions the gateway ServiceAccount
already has; `read_only: true` isn't a replacement for least-privilege RBAC.

## Register the backend with MCP Gateway

Save the following as `kubernetes-mcp.bicep`. It creates a dedicated
`KubernetesReader` role grant for one tool and a separate `kubernetes`
connection. It doesn't change the existing `aio` connection or its policy.

```bicep
param aioInstanceName string
param customLocationName string
param kubernetesApiAudience string

resource customLocation 'Microsoft.ExtendedLocation/customLocations@2021-08-31-preview' existing = {
  name: customLocationName
}

resource aioInstance 'Microsoft.IoTOperations/instances@2026-11-01-preview' existing = {
  name: aioInstanceName
}

resource policy 'Microsoft.IoTOperations/instances/mcpAuthorizationPolicies@2026-11-01-preview' = {
  parent: aioInstance
  name: 'kubernetes-reader-v1'
  extendedLocation: {
    type: 'CustomLocation'
    name: customLocation.id
  }
  properties: {
    policies: [
      {
        action: 'ToolCall'
        principal: {
          principalType: 'Role'
          role: 'KubernetesReader'
        }
        resources: [
          'pods_list_in_namespace'
        ]
      }
    ]
  }
}

resource connection 'Microsoft.IoTOperations/instances/mcpServerConnections@2026-11-01-preview' = {
  parent: aioInstance
  name: 'kubernetes'
  extendedLocation: {
    type: 'CustomLocation'
    name: customLocation.id
  }
  properties: {
    service: {
      name: 'kubernetes-mcp'
      namespace: 'azure-iot-operations'
      port: 8080
      path: '/mcp'
    }
    mcpProtocolVersion: '2025-06-18'
    authentication: {
      method: 'ServiceAccountToken'
      serviceAccountTokenSettings: {
        audience: kubernetesApiAudience
      }
    }
    trustedCaCertificateConfigMapRef: 'azure-iot-operations-aio-ca-trust-bundle'
    authorization: {
      mode: 'PolicyBased'
      policyRef: {
        name: policy.name
      }
    }
  }
}
```

The explicit backend protocol selects the initialize handshake supported by
this Kubernetes MCP image. The gateway still authenticates its own clients
with audience `aio-mcp-frontend`; don't change the original client's audience
to the Kubernetes API audience. The connection requests a separate gateway
SAT with `kubernetesApiAudience`, matching the backend's `oauth_audience`.
Kubernetes API tool calls use that gateway identity.

```azurecli
az deployment group create \
  --resource-group "$RESOURCE_GROUP" \
  --name configure-kubernetes-mcp \
  --template-file kubernetes-mcp.bicep \
  --parameters aioInstanceName="$AIO_INSTANCE_NAME" \
    customLocationName="$CUSTOM_LOCATION_NAME" \
    kubernetesApiAudience="$K8S_API_AUDIENCE"
```

```bash
kubectl -n "$AIO_NAMESPACE" get mcpserverconnection kubernetes -o yaml
kubectl -n "$AIO_NAMESPACE" rollout status deployment/aio-mcp-frontend --timeout=5m
```

Wait for `Validated=True` and `Ready=True` to refer to the connection's current
generation. These conditions confirm configuration reconciliation, not a
successful tool call.

Requests to the backend's `/mcp` endpoint without a bearer token, or with an
invalid signature, issuer, expiry, or audience, must return HTTP `401`.
The `/healthz` endpoint doesn't require a token, so a successful health probe
doesn't verify authentication. If authentication fails, check issuer/JWKS
reachability, TLS trust, and that both audience settings match; don't turn
off token validation.

## Use Kubernetes tools through the gateway

In your MCP client's deployment, grant its ServiceAccount the
`KubernetesReader` role. Keep any existing roles that the client still needs.
For example, the optional sample agent's `agent.frontend` values can grant both Azure IoT Operations
and Kubernetes tool access:

```yaml
agent:
  frontend:
    serviceAccountAnnotations:
      aio-mcp-auth/roles: '["Reader","KubernetesReader"]'
```

Merge this setting into the complete [sample agent values](howto-connect-ai-agent.md#deploy-the-sample-ai-agent);
don't install or upgrade the sample agent using this fragment alone. The
agent chart doesn't install MCP backends; the Kubernetes MCP backend is
already installed in the separate `k8s-mcp` release.

Start a new client session after changing roles. Ask your agent to list pods
in `azure-iot-operations`. The gateway exposes
`kubernetes_pods_list_in_namespace`, with a required `namespace` argument.
Confirm that it returns the installed Kubernetes MCP pod. A client with only
the Azure IoT Operations `Reader` role must be denied this tool; the dedicated
`KubernetesReader` grant doesn't grant Azure IoT Operations tools.

To enable more Kubernetes tools, update both the backend's `enabled_tools`
and the gateway policy's unprefixed resource list, and review the gateway
ServiceAccount's Kubernetes RBAC permissions. Don't disable gateway authorization or grant
`cluster-admin` as a workaround.

## Remove the optional backend

If no clients need this connection, delete the ARM connection first, then
its policy. Set `INSTANCE_ID` to your Azure IoT Operations instance resource ID:

```azurecli
az resource delete --ids "$INSTANCE_ID/mcpServerConnections/kubernetes" \
  --api-version "$AIO_API_VERSION"
az resource delete --ids "$INSTANCE_ID/mcpAuthorizationPolicies/kubernetes-reader-v1" \
  --api-version "$AIO_API_VERSION"
```

Wait for the gateway to remove the route before uninstalling the backend:

```bash
helm uninstall k8s-mcp --namespace "$AIO_NAMESPACE"
kubectl -n "$AIO_NAMESPACE" delete rolebinding kubernetes-mcp-pod-reader
kubectl -n "$AIO_NAMESPACE" delete role kubernetes-mcp-pod-reader
kubectl delete -f kubernetes-mcp-certificate.yaml
```

Remove the `KubernetesReader` annotation grant from clients that no longer need
it, preserving their other roles. Don't uninstall the existing Azure IoT Operations MCP,
gateway, or sample agent releases.

## Related content

- [Deploy MCP](howto-deploy-mcp.md)
- [Configure MCP authorization](howto-configure-mcp-authorization.md)
- [Connect to MCP](howto-connect-ai-agent.md)
- [Troubleshoot MCP](troubleshoot-mcp.md)
