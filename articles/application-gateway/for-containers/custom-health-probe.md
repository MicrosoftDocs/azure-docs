---
title: Custom health probe for Azure Application Gateway for Containers
description: Learn how to configure a custom health probe for Azure Application Gateway for Containers.
services: application gateway
author: greg-lindsay
ms.service: application-gateway
ms.subservice: appgw-for-containers
ms.topic: conceptual
ms.date: 08/31/2023
ms.author: greglin
---

# Custom health probe for Application Gateway for Containers

Application Gateway for Containers monitors the health of all backend targets by default. As backend targets become healthy or unhealthy, Application Gateway for Containers only distributes traffic to healthy endpoints.

In addition to using default health probe monitoring, you can also customize the health probe to suit your application's requirements. This article discusses both default and custom health probes.

The order and logic of health probing is as follows:
1. Use definition of HealthCheckPolicy Custom Resource (CR).
2. If there's no HealthCheckPolicy CR, then use Readiness probe
3. If there's no Readiness probe defined, use a default value

The following properties make up custom health probes:

| Property | Default Value |
| -------- | ------------- |
| port | the port number to initiate health probes to. Valid port values are 1-65535. |
| interval | how often in seconds health probes should be sent to the backend target.  The minimum interval must be > 0 seconds. |
| timeout | how long in seconds the request should wait until it's deemed a failure  The minimum interval must be > 0 seconds. |
| healthyThreshold | number of health probes before marking the target endpoint healthy. The minimum interval must be > 0. |
| unhealthyTreshold | number of health probes to fail before the backend target should be labeled unhealthy. The minimum interval must be > 0. |
| port | port number used to initiate connections to the backend target. |
| protocol| specifies either non-encrypted `HTTP` traffic or encrypted traffic via TLS as `HTTPS` |
| (http) host | the hostname specified in the request to the backend target. |
| (http) path | the specific path of the request. If a single file should be loaded, the path may be /index.html as an example. |
| (http -> match) statusCodes | Contains two properties, `start` and `end`, that define the range of valid HTTP status codes returned from the backend. |

## Default health probe
Application Gateway for Containers automatically configures a default health probe when you don't define a custom probe configuration or configure a readiness probe. The monitoring behavior works by making an HTTP GET request to the IP addresses of configured backend targets. For default probes, if the backend target is configured for HTTPS, the probe uses HTTPS to test health of the backend targets.

For more implementation details, see [HealthCheckPolicyConfig](api-specification-kubernetes.md#alb.networking.azure.io/v1.HealthCheckPolicyConfig) in the API specification.

When the default health probe is used, the following values for each health probe property are used:

| Property | Default Value |
| -------- | ------------- |
| interval | 5 seconds |
| timeout | 30 seconds |
| healthyTrehshold | 1 probe |
| unhealthyTreshold | 3 probes |
| port | 80 for HTTP and 443 for HTTPS to the backend |
| protocol | HTTP for HTTP and HTTPS when TLS is specified |
| (http) host | localhost |
| (http) path | / |

## Custom health probe

# [Gateway API](#tab/custom-health-probe-gateway-api)

In Gateway API, a custom health probe can be defined by creating a HealthCheckPolicy policy and referencing a service.  As the service is referenced by Application Gateway for Containers, the following custom health probe is used for each reference.

```bash
kubectl apply -f - <<EOF
apiVersion: alb.networking.azure.io/v1
kind: HealthCheckPolicy
metadata:
  name: gateway-health-check-policy
  namespace: test-infra
spec:
  targetRef:
    group: ""
    kind: Service
    name: http-test
    namespace: test-infra
  default:
    interval: 1s
    timeout: 1s
    healthyThreshold: 1
    unhealthyThreshold: 1
    protocol: HTTP
    http:
      host: contoso.com
      path: /
      match:
        statusCodes: 
        - start: 200
          end: 201
EOF
```

# [Ingress API](#tab/custom-health-probe-ingress-api)

In Ingress API, a custom health probe may be defined by creating an IngressExtension resource and defining a healthCheck object within the backendSettings.  The healthCheck policy initiates a health probe to the backend using the defined properties.

```bash
kubectl apply -f - <<EOF
apiVersion: alb.networking.azure.io/v1
kind: IngressExtension
metadata:
  name: ingress-extension
  namespace: test-infra
spec:
  backendSettings:
    - service: http-test
      healthCheck:
        interval: 1s
        timeout: 1s
        unhealthyThreshold: 1
        healthyThreshold: 1
        protocol: HTTP
        http:
          host: contoso.com
          path: /
          match:
            statusCodes: 
            - start: 200
              end: 201
EOF
```
---

