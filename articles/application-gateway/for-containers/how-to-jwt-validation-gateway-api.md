---
title: Configure JWT validation for Application Gateway for Containers - Gateway API
description: Learn how to configure an AuthPolicy to require and validate JWT access tokens for an HTTPRoute in Application Gateway for Containers.
services: application gateway
author: mbender-ms
ms.service: azure-application-gateway-containers
ms.topic: how-to
ms.date: 10/26/2026
ms.author: mbender
# Customer intent: As a cloud engineer, I want to configure JWT validation for an HTTPRoute, so that Application Gateway for Containers rejects unauthenticated requests before they reach my backend service.
---

# Configure JWT validation for Application Gateway for Containers - Gateway API

This article shows you how to use the Application Gateway for Containers `AuthPolicy` custom resource to require a valid bearer JSON Web Token (JWT) for an `HTTPRoute`.

> [!IMPORTANT]
> JWT validation and the `AuthPolicy` API are currently in preview.<br>
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

For an overview of JWT validation, policy inheritance, and OAuth discovery, see [JWT validation for Application Gateway for Containers](jwt-validation.md).

## Prerequisites

Before you begin, ensure you have:

1. If you're using the BYO deployment strategy, set up your Application Gateway for Containers resources and ALB Controller by using the [Add-on](quickstart-deploy-application-gateway-for-containers-alb-controller-addon.md) or [Helm](quickstart-deploy-application-gateway-for-containers-alb-controller-helm.md).
1. If you're following the ALB managed deployment strategy, ensure provisioning of the ALB Controller ([Add-on](quickstart-deploy-application-gateway-for-containers-alb-controller-addon.md) or [Helm](quickstart-deploy-application-gateway-for-containers-alb-controller-helm.md)) the Application Gateway for Containers resources via the  [ApplicationLoadBalancer custom resource](quickstart-create-application-gateway-for-containers-managed-by-alb-controller.md).
1. Deploy the sample HTTP application. Apply the following `deployment.yaml` file on your cluster to create a backend for testing JWT validation.

   ```bash
   kubectl apply -f https://raw.githubusercontent.com/MicrosoftDocs/azure-docs/refs/heads/main/articles/application-gateway/for-containers/examples/traffic-split-scenario/deployment.yaml
   ```
  
   This command creates the following resources on your cluster:

   - a namespace called `test-infra`
   - two services called `backend-v1` and `backend-v2` in the `test-infra` namespace
   - two deployments called `backend-v1` and `backend-v2` in the `test-infra` namespace
1. A Microsoft Entra tenant in which you have permission to create app registrations and grant admin consent. This walkthrough uses Microsoft Entra ID to create a test API and client. You can instead use another OAuth 2.0 or OpenID Connect identity provider that issues JWT access tokens and exposes an HTTPS JWKS endpoint, however additional identity provider configurations are outside the scope of this article.
1. A Bash environment with `curl` and `jq`.

## Deploy the required Gateway API resources

# [ALB managed deployment](#tab/alb-managed)

Create a gateway:

```bash
kubectl apply -f - <<EOF
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: gateway-01
  namespace: test-infra
  annotations:
    alb.networking.azure.io/alb-namespace: alb-test-infra
    alb.networking.azure.io/alb-name: alb-test
spec:
  gatewayClassName: azure-alb-external
  listeners:
  - name: http-listener
    port: 80
    protocol: HTTP
    allowedRoutes:
      namespaces:
        from: Same
EOF
```

[!INCLUDE [application-gateway-for-containers-frontend-naming](../../../includes/application-gateway-for-containers-frontend-naming.md)]

# [Bring your own (BYO) deployment](#tab/byo)

1. Set the environment variables.

```bash
RESOURCE_GROUP='<resource group name of the Application Gateway For Containers resource>'
RESOURCE_NAME='alb-test'

RESOURCE_ID=$(az network alb show --resource-group $RESOURCE_GROUP --name $RESOURCE_NAME --query id -o tsv)
FRONTEND_NAME='frontend'
```

2. Create a Gateway

```bash
kubectl apply -f - <<EOF
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: gateway-01
  namespace: test-infra
  annotations:
    alb.networking.azure.io/alb-id: $RESOURCE_ID
spec:
  gatewayClassName: azure-alb-external
  listeners:
  - name: http-listener
    port: 80
    protocol: HTTP
    allowedRoutes:
      namespaces:
        from: Same
  addresses:
  - type: alb.networking.azure.io/alb-frontend
    value: $FRONTEND_NAME
EOF
```

---

After you create the gateway resource, check that the status is valid, the listener is *Programmed*, and the gateway has an assigned address.

```bash
kubectl get gateway gateway-01 -n test-infra -o yaml
```

Example output of successful gateway creation.

```yaml
status:
  addresses:
  - type: IPAddress
    value: xxxx.yyyy.alb.azure.com
  conditions:
  - lastTransitionTime: "2023-06-19T21:04:55Z"
    message: Valid Gateway
    observedGeneration: 1
    reason: Accepted
    status: "True"
    type: Accepted
  - lastTransitionTime: "2023-06-19T21:04:55Z"
    message: Application Gateway For Containers resource has been successfully updated.
    observedGeneration: 1
    reason: Programmed
    status: "True"
    type: Programmed
  listeners:
  - attachedRoutes: 0
    conditions:
    - lastTransitionTime: "2023-06-19T21:04:55Z"
      message: ""
      observedGeneration: 1
      reason: ResolvedRefs
      status: "True"
      type: ResolvedRefs
    - lastTransitionTime: "2023-06-19T21:04:55Z"
      message: Listener is accepted
      observedGeneration: 1
      reason: Accepted
      status: "True"
      type: Accepted
    - lastTransitionTime: "2023-06-19T21:04:55Z"
      message: Application Gateway For Containers resource has been successfully updated.
      observedGeneration: 1
      reason: Programmed
      status: "True"
      type: Programmed
    name: https-listener
    supportedKinds:
    - group: gateway.networking.k8s.io
      kind: HTTPRoute
```

After you create the gateway, create an HTTPRoute that routes requests for `api.contoso.com` to `backend-v1`.

```bash
kubectl apply -f - <<EOF
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: auth-route
  namespace: test-infra
spec:
  parentRefs:
  - name: gateway-01
  hostnames:
  - api.contoso.com
  rules:
  - matches:
    - path:
        type: PathPrefix
        value: /
    backendRefs:
    - name: backend-v1
      port: 8080
EOF
```

After you create the `HTTPRoute` resource, check that the route is *Accepted* and the Application Gateway for Containers resource is *Programmed*.

```bash
kubectl get httproute auth-route -n test-infra -o yaml
```

Verify that the status of the Application Gateway for Containers resource is successfully updated.

```yaml
status:
  parents:
  - conditions:
    - lastTransitionTime: "2023-06-19T22:18:23Z"
      message: ""
      observedGeneration: 1
      reason: ResolvedRefs
      status: "True"
      type: ResolvedRefs
    - lastTransitionTime: "2023-06-19T22:18:23Z"
      message: Route is Accepted
      observedGeneration: 1
      reason: Accepted
      status: "True"
      type: Accepted
    - lastTransitionTime: "2023-06-19T22:18:23Z"
      message: Application Gateway For Containers resource has been successfully updated.
      observedGeneration: 1
      reason: Programmed
      status: "True"
      type: Programmed
    controllerName: alb.networking.azure.io/alb-controller
    parentRef:
      group: gateway.networking.k8s.io
      kind: Gateway
      name: gateway-01
      namespace: test-infra
  ```


Before you attach an `AuthPolicy`, confirm that a request can reach the backend. Replace the hostname if needed:

```bash
GATEWAY_ADDRESS=$(kubectl get gateway gateway-01 \
  -n test-infra \
  -o jsonpath='{.status.addresses[0].value}')

curl --connect-to "api.contoso.com:443:${GATEWAY_ADDRESS}:443" \
  https://api.contoso.com/
```

The `--connect-to` option preserves `api.contoso.com` as the TLS server name and HTTP host while connecting to the Gateway address. You can omit it after your DNS record points `api.contoso.com` to the Gateway.

## Configure Microsoft Entra ID

This walkthrough uses the OAuth 2.0 client credentials flow to get a test token without an interactive user. Create separate app registrations for the protected API and the client that calls it.

### Register the API

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com/).
1. Go to **Entra ID** > **App registrations**, and then select **New registration**.
1. Enter `AGC authentication demo API` for the name.
1. For **Supported account types**, select **Accounts in this organizational directory only**, don't enter a **Redirect URI**, and then select **Register**.
1. On the app registration's **Overview** page, record the **Application (client) ID** and **Directory (tenant) ID**. These values are the API application ID and tenant ID used later in this article.
1. Select **Manifest**, set `api.requestedAccessTokenVersion` to `2`, and then save the manifest. This setting makes Microsoft Entra ID issue v2.0 access tokens whose `aud` claim is the API application ID.
1. Select **Expose an API**, select **Add** next to **Application ID URI**, accept `api://<api-application-id>`, and then select **Save**.
1. Select **App roles**, and then select **Create app role**. Use the following values:

   | Setting | Value |
   | --- | --- |
   | Display name | `Access API` |
   | Allowed member types | `Applications` |
   | Value | `Api.Access` |
   | Description | `Allows an application to access the JWT validation demo API.` |
   | Enable this app role | Selected |

For more information, see [Configure an application to expose a web API](/entra/identity-platform/quickstart-configure-app-expose-web-apis).

### Register the client

1. Return to **App registrations**, and then select **New registration**.
1. Enter `AGC authentication demo client` for the name.
1. For **Supported account types**, select **Accounts in this organizational directory only**, don't enter a **Redirect URI**, and then select **Register**.
1. On the app registration's **Overview** page, record the **Application (client) ID**. This value is the client application ID used later in this article.
1. Select **API permissions** > **Add a permission** > **My APIs**, and then select **AGC authentication demo API**.
1. Select **Application permissions**, select **Api.Access**, and then select **Add permissions**.
1. Select **Grant admin consent for \<tenant-name\>**, and then confirm the operation.
1. Select **Certificates & secrets** > **Client secrets** > **New client secret**. Add a description and expiration, select **Add**, and immediately record the secret **Value**.

> [!CAUTION]
> Use the client secret only for this test and delete it when you finish. For production applications, use a certificate or federated credential instead of a client secret.

Set the values that you recorded as environment variables:

```bash
TENANT_ID='<directory-tenant-id>'
API_APP_ID='<api-application-client-id>'
CLIENT_APP_ID='<client-application-client-id>'
CLIENT_SECRET='<client-secret-value>'

ISSUER="https://login.microsoftonline.com/${TENANT_ID}/v2.0"
AUDIENCE="${API_APP_ID}"
JWKS_URI="https://login.microsoftonline.com/${TENANT_ID}/discovery/v2.0/keys"
TOKEN_SCOPE="api://${API_APP_ID}/.default"
```

The `AUDIENCE` value is the API application's client ID because Microsoft Entra v2.0 access tokens use that GUID for the `aud` claim. The `TOKEN_SCOPE` value uses the API's Application ID URI with the `/.default` suffix to request the application permission granted to the client.

## Create an AuthPolicy

Create an `AuthPolicy` that targets the route:

```bash
kubectl apply -f - <<EOF
apiVersion: alb.networking.azure.io/v1alpha1
kind: AuthPolicy
metadata:
  name: auth-route-policy
  namespace: test-infra
spec:
  targetRef:
    group: gateway.networking.k8s.io
    kind: HTTPRoute
    name: auth-route
  jwt:
    issuer: "${ISSUER}"
    audiences:
    - "${AUDIENCE}"
    jwks:
      remote:
        uri: "${JWKS_URI}"
EOF
```

The `AuthPolicy` and target must be in the same namespace. A policy can target an entire `ApplicationLoadBalancer`, `Gateway`, `HTTPRoute`, `GRPCRoute`, or `MCPRoute`, but it can't target an individual Gateway listener or route rule.

## Verify the policy status

Wait for the `Accepted` condition to become `True`:

```bash
kubectl wait authpolicy/auth-route-policy \
  -n test-infra \
  --for=condition=Accepted \
  --timeout=5m
```

Inspect the full policy status:

```bash
kubectl get authpolicy auth-route-policy -n test-infra -o yaml
```

A valid policy has a condition similar to the following example:

```yaml
status:
  conditions:
  - message: Valid AuthPolicy
    reason: Accepted
    status: "True"
    type: Accepted
```

If `Accepted` is `False`, use the condition's `reason` and `message` to correct the target reference, issuer, or JWKS configuration. Requests to a target with an invalid attached policy are denied rather than forwarded without authentication.

## Test authentication

Send a request without a token:

```bash
curl -i \
  --connect-to "api.contoso.com:443:${GATEWAY_ADDRESS}:443" \
  https://api.contoso.com/
```

The gateway returns:

```text
HTTP/2 401
```

Request a Microsoft Entra access token by using the client credentials flow:

```bash
TOKEN_RESPONSE=$(curl --silent --show-error --fail \
  -X POST "https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  --data-urlencode "client_id=${CLIENT_APP_ID}" \
  --data-urlencode "client_secret=${CLIENT_SECRET}" \
  --data-urlencode "scope=${TOKEN_SCOPE}" \
  --data-urlencode "grant_type=client_credentials")

ACCESS_TOKEN=$(printf '%s' "${TOKEN_RESPONSE}" | jq -r '.access_token')
```

For more information about this token request, see [Microsoft identity platform and the OAuth 2.0 client credentials flow](/entra/identity-platform/v2-oauth2-client-creds-grant-flow).

Send the token in the authorization header:

```bash
curl -i \
  --connect-to "api.contoso.com:443:${GATEWAY_ADDRESS}:443" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  https://api.contoso.com/
```

The request succeeds and is forwarded to the backend. A token with an invalid signature, expired lifetime, or incorrect issuer is rejected. A token whose audience isn't in `spec.jwt.audiences` is rejected with `403 Forbidden`.

## Apply authentication to a Gateway

To protect every route attached to a Gateway, change the target reference:

```yaml
spec:
  targetRef:
    group: gateway.networking.k8s.io
    kind: Gateway
    name: gateway-01
```

Every child route inherits this policy unless it has a route-level `AuthPolicy`. If the Gateway has multiple listeners, the policy applies to routes on all listeners because `sectionNames` isn't supported for `AuthPolicy`.

To protect all Gateways and routes associated with an ALB managed Application Gateway for Containers resource, target its `ApplicationLoadBalancer`:

```yaml
spec:
  targetRef:
    group: alb.networking.azure.io
    kind: ApplicationLoadBalancer
    name: alb-test
```

## Override an inherited policy

Attach a policy directly to a route to replace an inherited Gateway or `ApplicationLoadBalancer` policy. The route-level JWT configuration replaces the inherited configuration; the values aren't merged.

For example, the following policy requires a different audience for one route:

```yaml
apiVersion: alb.networking.azure.io/v1alpha1
kind: AuthPolicy
metadata:
  name: auth-route-override
  namespace: test-infra
spec:
  targetRef:
    group: gateway.networking.k8s.io
    kind: HTTPRoute
    name: auth-route
  jwt:
    issuer: https://login.microsoftonline.com/<tenant-id>/v2.0
    audiences:
    - api://<different-application-id>
    jwks:
      remote:
        uri: https://login.microsoftonline.com/<tenant-id>/discovery/v2.0/keys
```

Only one `AuthPolicy` can target a resource. Delete the existing route-level policy before applying a replacement policy to the same route.

## Make an inherited route public

To disable inherited JWT validation for a specific route, attach a route-level policy with an empty `jwt` block:

```yaml
apiVersion: alb.networking.azure.io/v1alpha1
kind: AuthPolicy
metadata:
  name: public-route
  namespace: test-infra
spec:
  targetRef:
    group: gateway.networking.k8s.io
    kind: HTTPRoute
    name: auth-route
  jwt: {}
```

Use `jwt: {}` only when the route is intentionally public. A partially configured JWT block is invalid and causes the affected route to fail closed.

## Publish OAuth protected resource metadata

To help OAuth-aware clients discover how to obtain a token, add `oauth.protectedResourceMetadata` to the policy:

```yaml
spec:
  targetRef:
    group: gateway.networking.k8s.io
    kind: HTTPRoute
    name: auth-route
  jwt:
    issuer: https://login.microsoftonline.com/<tenant-id>/v2.0
    audiences:
    - <api-application-client-id>
    jwks:
      remote:
        uri: https://login.microsoftonline.com/<tenant-id>/discovery/v2.0/keys
  oauth:
    protectedResourceMetadata:
      resource: https://api.contoso.com/
      authorizationServers:
      - https://login.microsoftonline.com/<tenant-id>/v2.0
      scopesSupported:
      - api.read
      - api.write
```

Retrieve the generated metadata document without a token:

```bash
curl -i \
  --connect-to "api.contoso.com:443:${GATEWAY_ADDRESS}:443" \
  https://api.contoso.com/.well-known/oauth-protected-resource
```

The gateway returns a document similar to the following example:

```json
{
  "resource": "https://api.contoso.com/",
  "authorization_servers": [
    "https://login.microsoftonline.com/<tenant-id>/v2.0"
  ],
  "scopes_supported": [
    "api.read",
    "api.write"
  ],
  "bearer_methods_supported": [
    "header"
  ]
}
```

Unauthenticated responses also include a `WWW-Authenticate` header that points to this well-known endpoint. The gateway publishes the configured scopes but doesn't enforce them; your backend remains responsible for authorization.

Congratulations, you configured Application Gateway for Containers to validate JWT access tokens for an `HTTPRoute` by using an `AuthPolicy`.

## Troubleshooting

| Symptom | Cause | Resolution |
| --- | --- | --- |
| `AuthPolicy` remains `Accepted=False` | The target doesn't exist, is in another namespace, or uses an unsupported kind | Correct `spec.targetRef` and keep the policy in the target's namespace |
| `Accepted=False` mentions `jwt` | The JWT block has an issuer without JWKS, or JWKS without an issuer | Configure both `issuer` and `jwks`, or use `jwt: {}` for an intentional opt-out |
| `Accepted=False` mentions the JWKS URI | The URI isn't an absolute HTTPS URL with a valid host and port | Correct `spec.jwt.jwks.remote.uri` |
| Requests return `401` with otherwise valid tokens | The token is expired, the issuer doesn't match exactly, the signature key isn't in the JWKS document, or the gateway can't retrieve the JWKS document | Inspect token claims and confirm JWKS DNS, network connectivity, TLS trust, and key rotation |
| Requests return `403` | The token audience isn't allowed | Add the intended audience to `spec.jwt.audiences` or request a token for the configured audience |
| A second policy is rejected as conflicted | More than one `AuthPolicy` targets the same resource | Keep one policy per target and use hierarchy-based inheritance |
| Browser requests fail before authentication | A cross-origin request that sends `Authorization` isn't allowed by CORS | Configure CORS to allow the client origin and the `Authorization` header |

## Clean up

Delete the policy:

```bash
kubectl delete authpolicy auth-route-policy -n test-infra
```

When you delete a route-level policy, you remove its authentication requirement unless the route inherits another policy from its Gateway or `ApplicationLoadBalancer`.

If you created the example route, delete it:

```bash
kubectl delete httproute auth-route -n test-infra
```

If you created the Microsoft Entra app registrations for this walkthrough, delete them:

```bash
az ad app delete --id "${CLIENT_APP_ID}"
az ad app delete --id "${API_APP_ID}"
```
