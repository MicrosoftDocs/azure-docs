---
title: Application Gateway Ingress Controller annotations
description: This article provides documentation on the annotations specific to the Application Gateway Ingress Controller. 
services: application-gateway
author: greg-lindsay
ms.service: application-gateway
ms.topic: article
ms.date: 10/26/2022
ms.author: greglin
---

# Annotations for Application Gateway Ingress Controller

The Kubernetes Ingress resource can be annotated with arbitrary key/value pairs. AGIC relies on annotations to program Application Gateway features, which aren't configurable using the Ingress YAML. Ingress annotations are applied to all HTTP settings, backend pools, and listeners derived from an ingress resource.

## List of supported annotations

For an Ingress resource to be observed by AGIC, it **must be annotated** with `kubernetes.io/ingress.class: azure/application-gateway`. Only then AGIC works with the Ingress resource in question.

| Annotation Key | Value Type | Default Value | Allowed Values |
| -- | -- | -- | -- |
| [appgw.ingress.kubernetes.io/backend-path-prefix](#backend-path-prefix) | `string` | `nil` ||
| [appgw.ingress.kubernetes.io/ssl-redirect](#tls-redirect) | `bool` | `false` | |
| [appgw.ingress.kubernetes.io/connection-draining](#connection-draining) | `bool` | `false` ||
| [appgw.ingress.kubernetes.io/connection-draining-timeout](#connection-draining) | `int32` (seconds) | `30` ||
| [appgw.ingress.kubernetes.io/cookie-based-affinity](#cookie-based-affinity) | `bool` | `false` ||
| [appgw.ingress.kubernetes.io/request-timeout](#request-timeout) | `int32` (seconds) | `30` ||
| [appgw.ingress.kubernetes.io/use-private-ip](#use-private-ip) | `bool` | `false` ||
| [appgw.ingress.kubernetes.io/backend-protocol](#backend-protocol) | `string` | `http` | `http`, `https` |
| [appgw.ingress.kubernetes.io/rewrite-rule-set](#rewrite-rule-set) | `string` | `nil`  ||

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

## TLS Redirect

Application Gateway [can be configured](./redirect-overview.md)
to automatically redirect HTTP URLs to their HTTPS counterparts. When this
annotation is present and TLS is properly configured, Kubernetes Ingress
controller creates a [routing rule with a redirection configuration](./redirect-http-to-https-portal.md#add-a-routing-rule-with-a-redirection-configuration)
and applies the changes to your Application Gateway. The redirect created will be HTTP `301 Moved Permanently`.

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
> * Application Gateway doesn't support multiple IPs on the same port (example: 80/443). Ingress with annotation `appgw.ingress.kubernetes.io/use-private-ip: "false"` and another with `appgw.ingress.kubernetes.io/use-private-ip: "true"` on `HTTP` will cause AGIC to fail while updating the Application Gateway.
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
  name: go-server-ingress-timeout
  namespace: test-ag
  annotations:
    kubernetes.io/ingress.class: azure/application-gateway
    appgw.ingress.kubernetes.io/use-private-ip: "true"
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
      - path: /hello/
        pathType: Exact
        backend:
          service:
            name: go-server-service
            port:
              number: 443
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
