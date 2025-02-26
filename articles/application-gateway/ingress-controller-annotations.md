---
title: Application Gateway Ingress Controller annotations
description: This article provides documentation on the annotations that are specific to the Application Gateway Ingress Controller. 
services: application-gateway
author: greg-lindsay
ms.service: azure-application-gateway
ms.topic: concept-article
ms.date: 9/17/2024
ms.author: greglin
---

# Annotations for Application Gateway Ingress Controller

You can annotate the Kubernetes ingress resource with arbitrary key/value pairs. Application Gateway Ingress Controller (AGIC) relies on annotations to program Azure Application Gateway features that aren't configurable via the ingress YAML. Ingress annotations are applied to all HTTP settings, backend pools, and listeners derived from an ingress resource.

> [!TIP]
> Also see [What is Application Gateway for Containers](for-containers/overview.md).

## List of supported annotations

For AGIC to observe an ingress resource, the resource *must be annotated* with `kubernetes.io/ingress.class: azure/application-gateway`.

| Annotation key | Value type | Default value | Allowed values |
| -- | -- | -- | -- |
| [appgw.ingress.kubernetes.io/backend-path-prefix](#backend-path-prefix) | `string` | `nil` ||
| [appgw.ingress.kubernetes.io/backend-hostname](#backend-hostname) | `string` | `nil` ||
| [appgw.ingress.kubernetes.io/health-probe-hostname](#custom-health-probe) | `string` | `127.0.0.1` ||
| [appgw.ingress.kubernetes.io/health-probe-port](#custom-health-probe) | `int32` | `80` ||
| [appgw.ingress.kubernetes.io/health-probe-path](#custom-health-probe) | `string` | `/` ||
| [appgw.ingress.kubernetes.io/health-probe-status-code](#custom-health-probe) | `string` | `200-399` ||
| [appgw.ingress.kubernetes.io/health-probe-interval](#custom-health-probe) | `int32` | `30` (seconds) ||
| [appgw.ingress.kubernetes.io/health-probe-timeout](#custom-health-probe) | `int32` | `30` (seconds) ||
| [appgw.ingress.kubernetes.io/health-probe-unhealthy-threshold](#custom-health-probe) | `int32` | `3` ||
| [appgw.ingress.kubernetes.io/ssl-redirect](#tls-redirect) | `bool` | `false` | |
| [appgw.ingress.kubernetes.io/connection-draining](#connection-draining) | `bool` | `false` ||
| [appgw.ingress.kubernetes.io/connection-draining-timeout](#connection-draining) | `int32` (seconds) | `30` ||
| [appgw.ingress.kubernetes.io/use-private-ip](#use-private-ip) | `bool` | `false` ||
| [appgw.ingress.kubernetes.io/override-frontend-port](#override-frontend-port) | `bool` | `false` ||
| [appgw.ingress.kubernetes.io/cookie-based-affinity](#cookie-based-affinity) | `bool` | `false` ||
| [appgw.ingress.kubernetes.io/request-timeout](#request-timeout) | `int32` (seconds) | `30` ||
| [appgw.ingress.kubernetes.io/use-private-ip](#use-private-ip) | `bool` | `false` ||
| [appgw.ingress.kubernetes.io/backend-protocol](#backend-protocol) | `string` | `http` | `http`, `https` |
| [appgw.ingress.kubernetes.io/hostname-extension](#hostname-extension) | `string` | `nil` ||
| [appgw.ingress.kubernetes.io/waf-policy-for-path](#waf-policy-for-path) | `string` | `nil` ||
| [appgw.ingress.kubernetes.io/appgw-ssl-certificate](#application-gateway-ssl-certificate) | `string` | `nil` ||
| [appgw.ingress.kubernetes.io/appgw-ssl-profile](#application-gateway-ssl-profile) | `string` | `nil` ||
| [appgw.ingress.kubernetes.io/appgw-trusted-root-certificate](#application-gateway-trusted-root-certificate) | `string` | `nil` ||
| [appgw.ingress.kubernetes.io/rewrite-rule-set](#rewrite-rule-set) | `string` | `nil`  ||
| [appgw.ingress.kubernetes.io/rewrite-rule-set-custom-resource](#rewrite-rule-set-custom-resource) ||||
| [appgw.ingress.kubernetes.io/rule-priority](#rule-priority) | `int32` | `nil` ||

## Backend Path Prefix

The following annotation allows the backend path specified in an ingress resource to be rewritten with the specified prefix. Use it to expose services whose endpoints are different from the endpoint names that you use to expose a service in an ingress resource.

### Usage

```yaml
appgw.ingress.kubernetes.io/backend-path-prefix: <path prefix>
```

### Example

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: go-server-ingress-bkprefix
  namespace: test-ag
  annotations:
    kubernetes.io/ingress.class: azure/application-gateway
    appgw.ingress.kubernetes.io/backend-path-prefix: "/test/"
spec:
  rules:
  - http:
      paths:
      - path: /hello/
        pathType: Exact
        backend:
          service:
            name: go-server-service
            port:
              number: 80
```

The preceding example defines an ingress resource named `go-server-ingress-bkprefix` with an annotation named `appgw.ingress.kubernetes.io/backend-path-prefix: "/test/"`. The annotation tells Application Gateway to create an HTTP setting that has a path prefix override for the path `/hello` to `/test/`.

The example defines only one rule. However, the annotations apply to the entire ingress resource. So if you define multiple rules, you set up the backend path prefix for each of the specified paths. If you want different rules with different path prefixes (even for the same service), you need to define different ingress resources.

## Backend Hostname

Use the following annotation to specify the hostname that Application Gateway should use while talking to the pods.

### Usage

```yaml
appgw.ingress.kubernetes.io/backend-hostname: "internal.example.com"
```

### Example

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: go-server-ingress-timeout
  namespace: test-ag
  annotations:
    kubernetes.io/ingress.class: azure/application-gateway
    appgw.ingress.kubernetes.io/backend-hostname: "internal.example.com"
spec:
  rules:
  - http:
      paths:
      - path: /hello/
        backend:
          service:
            name: store-service
            port:
              number: 80
        pathType: Exact
```

## Custom Health Probe

You can [configure Application Gateway](./application-gateway-probe-overview.md) to send custom health probes to the backend address pool. When the following annotations are present, the Kubernetes ingress controller [creates a custom probe](./application-gateway-create-probe-portal.md) to monitor the backend application. The controller then applies the changes to Application Gateway.

- `health-probe-hostname`: This annotation allows a custom hostname on the health probe.
- `health-probe-port`: This annotation configures a custom port for the health probe.
- `health-probe-path`: This annotation defines a path for the health probe.
- `health-probe-status-code`: This annotation allows the health probe to accept different HTTP status codes.
- `health-probe-interval`: This annotation defines the interval at which the health probe runs.
- `health-probe-timeout`: This annotation defines how long the health probe waits for a response before failing the probe.
- `health-probe-unhealthy-threshold`: This annotation defines how many health probes must fail for the backend to be marked as unhealthy.

### Usage

```yaml
appgw.ingress.kubernetes.io/health-probe-hostname: "contoso.com"
appgw.ingress.kubernetes.io/health-probe-port: 80
appgw.ingress.kubernetes.io/health-probe-path: "/"
appgw.ingress.kubernetes.io/health-probe-status-code: "100-599"
appgw.ingress.kubernetes.io/health-probe-interval: 30
appgw.ingress.kubernetes.io/health-probe-timeout: 30
appgw.ingress.kubernetes.io/health-probe-unhealthy-threshold: 2
```

### Example

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: go-server-ingress
  namespace: test-ag
  annotations:
    kubernetes.io/ingress.class: azure/application-gateway
    appgw.ingress.kubernetes.io/health-probe-hostname: "contoso.com"
    appgw.ingress.kubernetes.io/health-probe-port: 81
    appgw.ingress.kubernetes.io/health-probe-path: "/probepath"
    appgw.ingress.kubernetes.io/health-probe-status-code: "100-599"
    appgw.ingress.kubernetes.io/health-probe-interval: 31
    appgw.ingress.kubernetes.io/health-probe-timeout: 31
    appgw.ingress.kubernetes.io/health-probe-unhealthy-threshold: 2
spec:
  rules:
  - http:
      paths:
      - path: /
        pathType: Exact
        backend:
          service:
            name: go-server-service
            port:
              number: 80
```

## TLS Redirect

You can [configure Application Gateway](./redirect-overview.md) to automatically redirect HTTP URLs to their HTTPS counterparts. When this annotation is present and TLS is properly configured, the Kubernetes ingress controller creates a [routing rule with a redirection configuration](./redirect-http-to-https-portal.md#add-a-routing-rule-with-a-redirection-configuration). The controller then applies the changes to your Application Gateway instance. The created redirect is HTTP `301 Moved Permanently`.

### Usage

```yaml
appgw.ingress.kubernetes.io/ssl-redirect: "true"
```

### Example

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: go-server-ingress-redirect
  namespace: test-ag
  annotations:
    kubernetes.io/ingress.class: azure/application-gateway
    appgw.ingress.kubernetes.io/ssl-redirect: "true"
spec:
  tls:
   - hosts:
     - www.contoso.com
     secretName: testsecret-tls
  rules:
  - host: www.contoso.com
    http:
      paths:
      - backend:
          service:
            name: websocket-repeater
            port:
              number: 80
```

## Connection Draining

Use the following annotations if you want to use connection draining:

- `connection-draining`: This annotation specifies whether to enable connection draining.
- `connection-draining-timeout`: This annotation specifies a timeout, after which Application Gateway terminates the requests to the draining backend endpoint.

### Usage

```yaml
appgw.ingress.kubernetes.io/connection-draining: "true"
appgw.ingress.kubernetes.io/connection-draining-timeout: "60"
```

### Example

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: go-server-ingress-drain
  namespace: test-ag
  annotations:
    kubernetes.io/ingress.class: azure/application-gateway
    appgw.ingress.kubernetes.io/connection-draining: "true"
    appgw.ingress.kubernetes.io/connection-draining-timeout: "60"
spec:
  rules:
  - http:
      paths:
      - path: /hello/
        pathType: Exact
        backend:
          service:
            name: go-server-service
            port:
              number: 80
```

## Cookie Based Affinity

Use the following annotation to enable cookie-based affinity.

### Usage

```yaml
appgw.ingress.kubernetes.io/cookie-based-affinity: "true"
```

### Example

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: go-server-ingress-affinity
  namespace: test-ag
  annotations:
    kubernetes.io/ingress.class: azure/application-gateway
    appgw.ingress.kubernetes.io/cookie-based-affinity: "true"
spec:
  rules:
  - http:
      paths:
      - path: /hello/
        pathType: Exact
        backend:
          service:
            name: go-server-service
            port:
              number: 80
```

## Request Timeout

Use the following annotation to specify the request timeout in seconds. After the timeout, Application Gateway fails a request if the response isn't received.

### Usage

```yaml
appgw.ingress.kubernetes.io/request-timeout: "20"
```

### Example

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: go-server-ingress-timeout
  namespace: test-ag
  annotations:
    kubernetes.io/ingress.class: azure/application-gateway
    appgw.ingress.kubernetes.io/request-timeout: "20"
spec:
  rules:
  - http:
      paths:
      - path: /hello/
        pathType: Exact
        backend:
          service:
            name: go-server-service
            port:
              number: 80
```

## Use Private IP

Use the following annotation to specify whether to expose this endpoint on a private IP address of Application Gateway.

For an Application Gateway instance that doesn't have a private IP, ingresses with `appgw.ingress.kubernetes.io/use-private-ip: "true"` are ignored. The controller logs and ingress events for those ingresses show a `NoPrivateIP` warning.

### Usage

```yaml
appgw.ingress.kubernetes.io/use-private-ip: "true"
```

### Example

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: go-server-ingress-privateip
  namespace: test-ag
  annotations:
    kubernetes.io/ingress.class: azure/application-gateway
    appgw.ingress.kubernetes.io/use-private-ip: "true"
spec:
  rules:
  - http:
      paths:
      - path: /
        pathType: Exact
        backend:
          service:
            name: go-server-service
            port:
              number: 80
```

## Override Frontend Port

Use the following annotation to configure a frontend listener to use ports other than 80 for HTTP and 443 for HTTPS.

If the port is within the Application Gateway authorized range (1 to 64999), the listener is created on this specific port. If you set an invalid port or no port in the annotation, the configuration uses the default of 80 or 443.

### Usage

```yaml
appgw.ingress.kubernetes.io/override-frontend-port: "port"

```

### Example

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: go-server-ingress-overridefrontendport
  namespace: test-ag
  annotations:
    kubernetes.io/ingress.class: azure/application-gateway
    appgw.ingress.kubernetes.io/override-frontend-port: "8080"
spec:
  rules:
  - http:
      paths:
      - path: /hello/
        backend:
          service:
            name: store-service
            port:
              number: 80
        pathType: Exact
```

> [!NOTE]
> External requests need to target `http://somehost:8080` instead of `http://somehost`.

## Backend Protocol

Use the following to specify the protocol that Application Gateway should use when it communicates with the pods. Supported protocols are HTTP and HTTPS.

Although self-signed certificates are supported on Application Gateway, AGIC currently supports HTTPS only when pods use a certificate signed by a well-known certificate authority.

Don't use port 80 with HTTPS and port 443 with HTTP on the pods.

### Usage

```yaml
appgw.ingress.kubernetes.io/backend-protocol: "https"
```

### Example

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: go-server-ingress-timeout
  namespace: test-ag
  annotations:
    kubernetes.io/ingress.class: azure/application-gateway
    appgw.ingress.kubernetes.io/backend-protocol: "https"
spec:
  rules:
  - http:
      paths:
      - path: /
        pathType: Exact
        backend:
          service:
            name: go-server-service
            port:
              number: 443
```

## Hostname Extension

You can configure Application Gateway to accept multiple hostnames. Use the `hostname-extension` annotation to define multiple hostnames, including wildcard hostnames. This action appends the hostnames onto the FQDN that's defined in the ingress `spec.rules.host` information on the frontend listener, so it's [configured as a multisite listener](./multiple-site-overview.md).

### Usage

```yaml
appgw.ingress.kubernetes.io/hostname-extension: "hostname1, hostname2"
```

### Example

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: go-server-ingress-multisite
  namespace: test-ag
  annotations:
    kubernetes.io/ingress.class: azure/application-gateway
    appgw.ingress.kubernetes.io/hostname-extension: "hostname1, hostname2"
spec:
  rules:
  - host: contoso.com
    http:
      paths:
      - path: /
        pathType: Exact
        backend:
          service:
            name: go-server-service
            port:
              number: 443
```

The preceding example configures the listener to accept traffic for the hostnames `hostname1.contoso.com` and `hostname2.contoso.com`.

## WAF Policy for Path

Use the following annotation to attach an existing web application firewall (WAF) policy to the list paths for a host within a Kubernetes ingress resource that's being annotated. The WAF policy is applied to both `/ad-server` and `/auth` URLs.

### Usage

```yaml
appgw.ingress.kubernetes.io/waf-policy-for-path: "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/SampleRG/providers/Microsoft.Network/applicationGatewayWebApplicationFirewallPolicies/AGICWAFPolcy"

```

### Example

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ad-server-ingress
  namespace: commerce
  annotations:
    kubernetes.io/ingress.class: azure/application-gateway
    appgw.ingress.kubernetes.io/waf-policy-for-path: "/subscriptions/abcd/resourceGroups/rg/providers/Microsoft.Network/applicationGatewayWebApplicationFirewallPolicies/adserver"
spec:
  rules:
  - http:
      paths:
      - path: /ad-server
        backend:
          service:
            name: ad-server
            port:
              number: 80
        pathType: Exact
      - path: /auth
        backend:
          service:
            name: auth-server
            port:
              number: 80
        pathType: Exact
```

## Application Gateway SSL Certificate

You can [configure the SSL certificate to Application Gateway](/cli/azure/network/application-gateway/ssl-cert#az-network-application-gateway-ssl-cert-create) from either a local PFX certificate file or a reference to an Azure Key Vault unversioned secret ID. When the annotation is present with a certificate name and the certificate is preinstalled in Application Gateway, the Kubernetes ingress controller creates a routing rule with an HTTPS listener and applies the changes to your Application Gateway instance. You can also use the `appgw-ssl-certificate` annotation together with an `ssl-redirect` annotation in the case of an SSL redirect.

> [!NOTE]
> The `appgw-ssl-certificate` annotation is ignored when the TLS specification is defined in ingress at the same time. If you want different certificates with different hosts (termination of multiple TLS certificates), you need to define different ingress resources.

### Usage

```yaml
appgw.ingress.kubernetes.io/appgw-ssl-certificate: "name-of-appgw-installed-certificate"
```

### Example

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: go-server-ingress-certificate
  namespace: test-ag
  annotations:
    kubernetes.io/ingress.class: azure/application-gateway
    appgw.ingress.kubernetes.io/appgw-ssl-certificate: "name-of-appgw-installed-certificate"
spec:
  rules:
  - host: www.contoso.com
    http:
      paths:
      - backend:
          service:
            name: websocket-repeater
            port:
              number: 80

```

## Application Gateway SSL Profile

You can configure an SSL profile on the Application Gateway instance per listener. When the annotation is present with a profile name and the profile is preinstalled in Application Gateway, the Kubernetes ingress controller creates a routing rule with an HTTPS listener and applies the changes to your Application Gateway instance.

### Usage

```yaml
appgw.ingress.kubernetes.io/appgw-ssl-certificate: "name-of-appgw-installed-certificate"
appgw.ingress.kubernetes.io/appgw-ssl-profile: "SampleSSLProfile"
```

### Example

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: go-server-ingress-certificate
  namespace: test-ag
  annotations:
    kubernetes.io/ingress.class: azure/application-gateway
    appgw.ingress.kubernetes.io/appgw-ssl-certificate: "name-of-appgw-installed-certificate"
    appgw.ingress.kubernetes.io/appgw-ssl-profile: "SampleSSLProfile"
spec:
  rules:
  - host: www.contoso.com
    http:
      paths:
      - backend:
          service:
            name: websocket-repeater
            port:
              number: 80
```

## Application Gateway Trusted Root Certificate

You now can configure your own root certificates to Application Gateway to be trusted via AGIC. You can use the `appgw-trusted-root-certificate` annotation together with the `backend-protocol` annotation to indicate end-to-end SSL encryption. If you specify multiple root certificates, separate them with a comma; for example, `name-of-my-root-cert1,name-of-my-root-cert2`.

### Usage

```yaml
appgw.ingress.kubernetes.io/backend-protocol: "https"
appgw.ingress.kubernetes.io/appgw-trusted-root-certificate: "name-of-my-root-cert1"
```

### Example

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: go-server-ingress-certificate
  namespace: test-ag
  annotations:
    kubernetes.io/ingress.class: azure/application-gateway
    appgw.ingress.kubernetes.io/backend-protocol: "https"
    appgw.ingress.kubernetes.io/appgw-trusted-root-certificate: "name-of-my-root-cert1"
spec:
  rules:
  - host: www.contoso.com
    http:
      paths:
      - backend:
          service:
            name: websocket-repeater
            port:
              number: 80
```

## Rewrite Rule Set

Use the following annotation to assign an existing rewrite rule set to the corresponding request routing rule.

### Usage

```yaml
appgw.ingress.kubernetes.io/rewrite-rule-set: <rewrite rule set name>
```

### Example

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: go-server-ingress-bkprefix
  namespace: test-ag
  annotations:
    kubernetes.io/ingress.class: azure/application-gateway
    appgw.ingress.kubernetes.io/rewrite-rule-set: add-custom-response-header
spec:
  rules:
  - http:
      paths:
      - path: /
        pathType: Exact
        backend:
          service:
            name: go-server-service
            port:
              number: 8080
```

## Rewrite Rule Set Custom Resource

> [!NOTE]
> The release of [Application Gateway for Containers](https://aka.ms/agc) introduces numerous performance, resilience, and feature changes. Consider using Application Gateway for Containers for your next deployment.
>
> You can find URL rewrite rules for Application Gateway for Containers in [this article about the Gateway API](./for-containers/how-to-url-rewrite-gateway-api.md) and [this article about the Ingress API](for-containers/how-to-url-rewrite-ingress-api.md). You can find header rewrite rules for Application Gateway for Containers in [this article about the Gateway API](./for-containers/how-to-header-rewrite-gateway-api.md).

Application Gateway allows you to rewrite selected contents of requests and responses. With this feature, you can translate URLs, change query string parameters, and modify request and response headers. You can also use this feature to add conditions to ensure that the URL or the specified headers are rewritten only when certain conditions are met. Rewrite Rule Set Custom Resource brings this feature to AGIC.

HTTP headers allow a client and server to pass additional information with a request or response. By rewriting these headers, you can accomplish important tasks like adding security-related header fields (for example, `HSTS` or `X-XSS-Protection`), removing response header fields that might reveal sensitive information, and removing port information from `X-Forwarded-For` headers.

With the URL rewrite capability, you can:

- Rewrite the hostname, path, and query string of the request URL.
- Choose to rewrite the URL of all requests or only requests that match one or more of the conditions that you set. These conditions are based on the request and response properties (request header, response header, and server variables).
- Choose to route the request based on either the original URL or the rewritten URL.

> [!NOTE]
> This feature is supported since 1.6.0-rc1. Use [`appgw.ingress.kubernetes.io/rewrite-rule-set`](#rewrite-rule-set), which allows using an existing rewrite rule set on Application Gateway.

### Usage

```yaml
appgw.ingress.kubernetes.io/rewrite-rule-set-custom-resource
```

### Example

```yaml
apiVersion: appgw.ingress.azure.io/v1beta1 
kind: AzureApplicationGatewayRewrite 
metadata: 
  name: my-rewrite-rule-set-custom-resource 
spec: 
  rewriteRules: 
  - name: rule1 
    ruleSequence: 21
    conditions:
  - ignoreCase: false
    negate: false
    variable: http_req_Host
    pattern: example.com
  actions:
    requestHeaderConfigurations:
    - actionType: set
      headerName: incoming-test-header
      headerValue: incoming-test-value
    responseHeaderConfigurations:
    - actionType: set
      headerName: outgoing-test-header
      headerValue: outgoing-test-value
    urlConfiguration:
      modifiedPath: "/api/"
      modifiedQueryString: "query=test-value"
      reroute: false
```

## Rule Priority

The following annotation allows for the Application Gateway ingress controller to explicitly set the priority of the associated [request routing rules](./multiple-site-overview.md#request-routing-rules-evaluation-order).

### Usage

```yaml
appgw.ingress.kubernetes.io/rule-priority:
```

### Example

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: go-server-ingress-rulepriority
  namespace: test-ag
  annotations:
    kubernetes.io/ingress.class: azure/application-gateway
    appgw.ingress.kubernetes.io/rule-priority: 10
spec:
  rules:
  - http:
      paths:
      - path: /
        pathType: Exact
        backend:
          service:
            name: go-server-service
            port:
              number: 8080
```

The preceding example sets a priority of 10 for the request routing rule.
