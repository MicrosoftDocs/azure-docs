---
title: Configure CORS for Azure Application Gateway for Containers - Gateway API
description: Learn how to configure Cross-Origin Resource Sharing (CORS) in Gateway API for Application Gateway for Containers.
services: application gateway
author: mbender-ms
ms.service: azure-appgw-for-containers
ms.topic: how-to
ms.date: 06/24/2026
ms.author: mbender
# Customer intent: As a cloud engineer, I want to enable Cross-Origin Resource Sharing (CORS) in Application Gateway for Containers, so that browsers can safely make cross-origin requests to my backend services without me modifying my application code.
---

# Configure CORS for Azure Application Gateway for Containers - Gateway API

Application Gateway for Containers can respond to Cross-Origin Resource Sharing (CORS) preflight requests and add the appropriate CORS response headers to cross-origin requests on behalf of your backend services. Offloading CORS to the gateway means you don't need to implement CORS logic in each application.

## Usage details

CORS takes advantage of [filters](https://gateway-api.sigs.k8s.io/references/spec/#gateway.networking.k8s.io/v1.HTTPRouteFilter) as defined by the Kubernetes Gateway API. The CORS filter is applied at the `HTTPRoute` level and is defined by [GEP-1767: CORS Filter](https://gateway-api.sigs.k8s.io/geps/gep-1767/).

## Background

A web application makes a *cross-origin* request when it requests a resource from an origin (scheme, host, and port) that differs from the one that served the page. By default, browsers apply the same-origin policy and block cross-origin responses from being read by client-side scripts. CORS is a [W3C and Fetch standard](https://fetch.spec.whatwg.org/#http-cors-protocol) mechanism that lets a server declare which origins, methods, and headers are allowed, so that the browser permits the response.

When you configure a CORS filter on an `HTTPRoute`, Application Gateway for Containers:

- Answers CORS *preflight* (`OPTIONS`) requests directly, without forwarding them to your backend.
- Adds the relevant `Access-Control-*` response headers to cross-origin responses based on your configuration.

The following CORS filter fields are supported:

| Field | Response header | Description |
| --- | --- | --- |
| `allowOrigins` | `Access-Control-Allow-Origin` | Origins that are allowed to access the resource. Each value is a `<scheme>://<host>(:<port>)` URI or the wildcard `*`. The host may use a left-side wildcard, such as `https://*.contoso.com`. |
| `allowMethods` | `Access-Control-Allow-Methods` | HTTP methods allowed when accessing the resource. Valid values are any RFC 9110 method or the wildcard `*`. |
| `allowHeaders` | `Access-Control-Allow-Headers` | Request headers allowed when accessing the resource. |
| `exposeHeaders` | `Access-Control-Expose-Headers` | Response headers that are exposed to client-side scripts, in addition to the CORS-safelisted response headers. |
| `allowCredentials` | `Access-Control-Allow-Credentials` | When `true`, the gateway returns `Access-Control-Allow-Credentials: true`, allowing the request to include credentials such as cookies. |
| `maxAge` | `Access-Control-Max-Age` | Duration, in seconds, that the client caches preflight results. Defaults to `5` seconds. |

> [!IMPORTANT]
> When `allowCredentials` is `true`, you can't use the `*` wildcard for `allowOrigins`, `allowMethods`, or `allowHeaders`. In that case the gateway echoes the request's `Origin`, `Access-Control-Request-Method`, and `Access-Control-Request-Headers` values instead. This behavior follows the [CORS protocol](https://fetch.spec.whatwg.org/#http-cors-protocol).

## Prerequisites

1. If following the BYO deployment strategy, ensure that you set up your Application Gateway for Containers resources and [ALB Controller](quickstart-deploy-application-gateway-for-containers-alb-controller.md).
2. If you're following the ALB managed deployment strategy, ensure provisioning of the [ALB Controller](quickstart-deploy-application-gateway-for-containers-alb-controller.md) and the Application Gateway for Containers resources via the [ApplicationLoadBalancer custom resource](quickstart-create-application-gateway-for-containers-managed-by-alb-controller.md).
3. Deploy sample HTTP application.
   Apply the following deployment.yaml file on your cluster to create a sample web application to demonstrate the CORS filter.

   ```bash
   kubectl apply -f https://raw.githubusercontent.com/MicrosoftDocs/azure-docs/refs/heads/main/articles/application-gateway/for-containers/examples/traffic-split-scenario/deployment.yaml
   ```

   This command creates the following on your cluster:

   - a namespace called `test-infra`
   - two services called `backend-v1` and `backend-v2` in the `test-infra` namespace
   - two deployments called `backend-v1` and `backend-v2` in the `test-infra` namespace

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

1. Set the following environment variables.

   ```bash
   RESOURCE_GROUP='<resource group name of the Application Gateway For Containers resource>'
   RESOURCE_NAME='alb-test'

   RESOURCE_ID=$(az network alb show --resource-group $RESOURCE_GROUP --name $RESOURCE_NAME --query id -o tsv)
   FRONTEND_NAME='frontend'
   ```

2. Create a Gateway.

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

Once the gateway resource is created, ensure the status is valid, the listener is _Programmed_, and an address is assigned to the gateway.

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
    name: http-listener
    supportedKinds:
    - group: gateway.networking.k8s.io
      kind: HTTPRoute
```

## Create an HTTPRoute with a CORS filter

Create an `HTTPRoute` that listens for the hostname `contoso.com` and applies a CORS filter. In this example, the gateway:

- Allows cross-origin requests from `https://www.contoso.com` and any subdomain of `fabrikam.com`.
- Allows the `GET`, `POST`, and `OPTIONS` methods.
- Allows the `Content-Type` and `Authorization` request headers.
- Exposes the `X-Custom-Response-Header` response header to client scripts.
- Allows credentialed requests.
- Caches the preflight result for 600 seconds (10 minutes).

```bash
kubectl apply -f - <<EOF
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: cors-route
  namespace: test-infra
spec:
  parentRefs:
    - name: gateway-01
      namespace: test-infra
  hostnames:
    - "contoso.com"
  rules:
    - filters:
        - type: CORS
          cors:
            allowOrigins:
              - "https://www.contoso.com"
              - "https://*.fabrikam.com"
            allowMethods:
              - GET
              - POST
              - OPTIONS
            allowHeaders:
              - Content-Type
              - Authorization
            exposeHeaders:
              - X-Custom-Response-Header
            allowCredentials: true
            maxAge: 600
      backendRefs:
        - name: backend-v1
          port: 8080
EOF
```

Once the `HTTPRoute` resource is created, ensure the route is _Accepted_ and the Application Gateway for Containers resource is _Programmed_.

```bash
kubectl get httproute cors-route -n test-infra -o yaml
```

Verify the status of the Application Gateway for Containers resource has been successfully updated.

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

## Test the CORS configuration

Get the FQDN assigned to the frontend of the gateway:

```bash
fqdn=$(kubectl get gateway gateway-01 -n test-infra -o jsonpath='{.status.addresses[0].value}')
fqdnIp=$(dig +short $fqdn)
```

### Send a preflight request

Browsers send a CORS preflight request as an `OPTIONS` request that includes the `Origin`, `Access-Control-Request-Method`, and `Access-Control-Request-Headers` headers. Simulate a preflight request from an allowed origin:

```bash
curl -k -i -X OPTIONS \
  --resolve contoso.com:80:$fqdnIp \
  -H "Origin: https://www.contoso.com" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  http://contoso.com
```

The gateway answers the preflight request directly with a `200` or `204` response and returns the CORS headers:

```http
HTTP/1.1 200 OK
Access-Control-Allow-Origin: https://www.contoso.com
Access-Control-Allow-Methods: GET,POST,OPTIONS
Access-Control-Allow-Headers: Content-Type,Authorization
Access-Control-Allow-Credentials: true
Access-Control-Max-Age: 600
```

### Send a request from a disallowed origin

Send a preflight request from an origin that isn't in `allowOrigins`:

```bash
curl -k -i -X OPTIONS \
  --resolve contoso.com:80:$fqdnIp \
  -H "Origin: https://www.adatum.com" \
  -H "Access-Control-Request-Method: POST" \
  http://contoso.com
```

The gateway responds without the `Access-Control-Allow-Origin` header. Because the origin isn't allowed, the browser blocks the client script from reading the response, and the cross-origin request fails on the client side.

### Send an actual cross-origin request

After a successful preflight, the browser sends the actual request. Simulate it with an allowed origin:

```bash
curl -k -i \
  --resolve contoso.com:80:$fqdnIp \
  -H "Origin: https://www.contoso.com" \
  http://contoso.com
```

The response includes the CORS headers along with the body returned by the backend service:

```http
HTTP/1.1 200 OK
Access-Control-Allow-Origin: https://www.contoso.com
Access-Control-Allow-Credentials: true
Access-Control-Expose-Headers: X-Custom-Response-Header
```

> [!NOTE]
> CORS is only supported when using Gateway API for Application Gateway for Containers.

## Next steps

- [Learn more](cross-origin-resource-sharing.md) about Cross-Origin Resource Sharing and Application Gateway for Containers.
- [Header rewrite for Application Gateway for Containers](how-to-header-rewrite-gateway-api.md)
