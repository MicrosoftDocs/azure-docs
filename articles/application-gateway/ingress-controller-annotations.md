---
title: Application Gateway Ingress Controller annotations
description: This article provides documentation on the annotations specific to the Application Gateway Ingress Controller. 
services: application-gateway
author: greg-lindsay
ms.service: azure-application-gateway
ms.topic: article
ms.date: 5/13/2024
ms.author: greglin
---

# Annotations for Application Gateway Ingress Controller

The Kubernetes Ingress resource can be annotated with arbitrary key/value pairs. AGIC relies on annotations to program Application Gateway features, which aren't configurable using the Ingress YAML. Ingress annotations are applied to all HTTP settings, backend pools, and listeners derived from an ingress resource.

## List of supported annotations

For an Ingress resource to be observed by AGIC, it **must be annotated** with `kubernetes.io/ingress.class: azure/application-gateway`. Only then AGIC works with the Ingress resource in question.

| Annotation Key | Value Type | Default Value | Allowed Values |
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

The following annotation allows the backend path specified in an ingress resource to be rewritten with prefix specified in this annotation. It allows users to expose services whose endpoints are different than endpoint names used to expose a service in an ingress resource.

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

In the previous example, you've defined an ingress resource named `go-server-ingress-bkprefix` with an annotation `appgw.ingress.kubernetes.io/backend-path-prefix: "/test/"`. The annotation tells application gateway to create an HTTP setting, which has a path prefix override for the path `/hello` to `/test/`.

> [!NOTE]
> In the above example, only one rule is defined. However, the annotations are applicable to the entire ingress resource, so if a user defined multiple rules, the backend path prefix would be set up for each of the paths specified. If a user wants different rules with different path prefixes (even for the same service), they would need to define different ingress resources.

## Backend Hostname

This annotation allows us to specify the host name that Application Gateway should use while talking to the Pods.

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

Application Gateway [can be configured](./application-gateway-probe-overview.md) to send custom health probes to the backend address pool. When these annotations are present, Kubernetes Ingress controller [creates a custom probe](./application-gateway-create-probe-portal.md) to monitor the backend application and applies the changes to the application gateway.

`health-probe-hostname`: This annotation allows a custom hostname on the health probe.<br>
`health-probe-port`: This annotation configures a custom health probe port.<br>
`health-probe-path`: This annotation defines a path for the health probe.<br>
`health-probe-status-code`: This annotation allows the health probe to accept different HTTP status codes.<br>
`health-probe-interval`: This annotation defines the interval that the health probe runs at.<br>
`health-probe-timeout`: This annotation defines how long the health probe will wait for a response before failing the probe.<br>
`health-probe-unhealthy-threshold`: This annotation defines how many health probes must fail for the backend to be marked as unhealthy.

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

Application Gateway [can be configured](./redirect-overview.md) to automatically redirect HTTP URLs to their HTTPS counterparts. When this annotation is present and TLS is properly configured, Kubernetes Ingress controller creates a [routing rule with a redirection configuration](./redirect-http-to-https-portal.md#add-a-routing-rule-with-a-redirection-configuration) and applies the changes to your Application Gateway. The redirect created will be HTTP `301 Moved Permanently`.

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

`connection-draining`: This annotation allows us to specify whether to enable connection draining.
`connection-draining-timeout`: This annotation allows us to specify a timeout, after which Application Gateway terminates the requests to the draining backend endpoint.

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

The following annotation allows you to specify whether to enable cookie based affinity.

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

The following annotation allows you to specify the request timeout in seconds, after which Application Gateway fails the request if response is not received.

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

The following annotation allows you to specify whether to expose this endpoint on Private IP of Application Gateway.

> [!NOTE]
> * For Application Gateway that doesn't have a private IP, Ingresses with `appgw.ingress.kubernetes.io/use-private-ip: "true"` is ignored. This is reflected in the controller logs and ingress events for those ingresses with `NoPrivateIP` warning.

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

The annotation allows you to configure a frontend listener to use different ports other than 80/443 for http/https.

If the port is within the App Gw authorized range (1 - 64999), this listener will be created on this specific port. If an invalid port or no port is set in the annotation, the configuration will fall back on default 80 or 443.

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
>External request will need to target http://somehost:8080 instead of http://somehost.

## Backend Protocol

The following annotation allows you to specify the protocol that Application Gateway should use while communicating with the pods. Supported Protocols are `http` and `https`.

> [!NOTE]
> While self-signed certificates are supported on Application Gateway, currently AGIC only supports `https` when pods are using a certificate signed by a well-known CA.
>
> Don't use port 80 with HTTPS and port 443 with HTTP on the pods.

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

Application Gateway can be configured to accept multiple hostnames. The hostname-extention annotation allows for this by letting you define multiple hostnames including wildcard hostnames. This will append the hostnames onto the FQDN that is defined in the ingress spec.rules.host on the frontend listener so it is [configured as a multisite listener.](./multiple-site-overview.md)

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

> [!NOTE]
> In the above example the listener would be configured to accept traffic for the hostnames "hostname1.contoso.com" and "hostname2.contoso.com"

## WAF Policy for Path

This annotation allows you to attach an already created WAF policy to the list paths for a host within a Kubernetes Ingress resource being annotated.

### Usage

```yaml
appgw.ingress.kubernetes.io/waf-policy-for-path: "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/SampleRG/providers/Microsoft.Network/applicationGatewayWebApplicationFirewallPolicies/AGICWAFPolcy"

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

> [!NOTE]
> The WAF policy will be applied to both /ad-server and /auth URLs.

## Application Gateway SSL Certificate

The SSL certificate [can be configured to Application Gateway](/cli/azure/network/application-gateway/ssl-cert#az-network-application-gateway-ssl-cert-create) either from a local PFX certificate file or a reference to an Azure Key Vault unversioned secret ID. When the annotation is present with a certificate name and the certificate is pre-installed in Application Gateway, Kubernetes Ingress controller will create a routing rule with a HTTPS listener and apply the changes to your App Gateway. appgw-ssl-certificate annotation can also be used together with ssl-redirect annotation in case of SSL redirect.

Please refer to appgw-ssl-certificate feature for more details.

> [!NOTE]
>  Annotation "appgw-ssl-certificate" will be ignored when TLS Spec is defined in ingress at the same time. If a user wants different certs with different hosts(multi tls certificate termination), they would need to define different ingress resources.

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

Users can configure a ssl profile on the Application Gateway per listener. When the annotation is present with a profile name and the profile is pre-installed in the Application Gateway, Kubernetes Ingress controller will create a routing rule with a HTTPS listener and apply the changes to your App Gateway.

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

Users now can configure their own root certificates to Application Gateway to be trusted via AGIC. The annotation appgw-trusted-root-certificate can be used together with annotation backend-protocol to indicate end-to-end ssl encryption, multiple root certificates, separated by comma, if specified, for example, "name-of-my-root-cert1,name-of-my-root-certificate2".

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

The following annotation allows you to assign an existing rewrite rule set to the corresponding request routing rule.

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

> [!Note] 
> [Application Gateway for Containers](https://aka.ms/agc) has been released, which introduces numerous performance, resilience, and feature changes. Please consider leveraging Application Gateway for Containers for your next deployment.
> URL Rewrite rules for Application Gateway for Containers may be found [here for Gateway API](./for-containers/how-to-url-rewrite-gateway-api.md) and [here for Ingress API](for-containers/how-to-url-rewrite-ingress-api.md).
> Header Rewrite rules for Application Gateway for Containers may be found [here for Gateway API](./for-containers/how-to-header-rewrite-gateway-api.md).

> [!Note] 
> This feature is supported since 1.6.0-rc1. Use [`appgw.ingress.kubernetes.io/rewrite-rule-set`](#rewrite-rule-set), which allows using an existing rewrite rule set on Application Gateway.

Application Gateway allows you to rewrite selected content of requests and responses. With this feature, you can translate URLs, query string parameters as well as modify request and response headers. It also allows you to add conditions to ensure that the URL or the specified headers are rewritten only when certain conditions are met. These conditions are based on the request and response information. Rewrite Rule Set Custom Resource brings this feature to AGIC.

HTTP headers allow a client and server to pass additional information with a request or response. By rewriting these headers, you can accomplish important tasks, such as adding security-related header fields like HSTS/ X-XSS-Protection, removing response header fields that might reveal sensitive information, and removing port information from X-Forwarded-For headers.

With URL rewrite capability, you can: - Rewrite the host name, path and query string of the request URL - Choose to rewrite the URL of all requests or only those requests which match one or more of the conditions you set. These conditions are based on the request and response properties (request header, response header and server variables). - Choose to route the request based on either the original URL or the rewritten URL

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

This annotation allows for application gateway ingress controller to explicitly set the priority of the associated [Request Routing Rules.](./multiple-site-overview.md#request-routing-rules-evaluation-order)

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

In the above example the request routing rule would have a priority of 10 set.
