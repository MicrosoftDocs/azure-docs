---
title: TLS policy overview for Azure Application Gateway for Containers
description: Learn how to configure TLS policy for Azure Application Gateway for Containers.
services: application gateway
author: greg-lindsay
ms.service: application-gateway
ms.subservice: appgw-for-containers
ms.topic: conceptual
ms.date: 03/21/2024
ms.author: greglin
---

# Application Gateway for Containers TLS policy overview

You can use Azure Application Gateway for Containers to control TLS ciphers to meet compliance and security goals of the organization.

TLS policy includes definition of the TLS protocol version, cipher suites, and order in which ciphers are preferred during a TLS handshake. Application Gateway for Containers currently offers two predefined policies to choose from.

## Usage and version details

- A custom TLS policy allows you to configure the minimum protocol version, ciphers, and elliptical curves for your gateway.
- If no TLS policy is defined, a [default TLS policy](tls-policy.md#default-tls-policy) is used.
- TLS cipher suites used for the connection are also based on the type of the certificate being used. The cipher suites negotiated between client and Application Gateway for Containers are based on the _Gateway listener_ configuration as defined in YAML. The cipher suites used in establishing connections between Application Gateway for Containers and the backend target are based on the type of server certificates presented by the backend target.

## Predefined TLS policy

Application Gateway for Containers offers two predefined security policies. You can choose either of these policies to achieve the appropriate level of security. Policy names are defined by year and month (YYYY-MM) of introduction.  Additionally, an **-S** variant may exist to denote a more strict variant of ciphers that may be negotiated. Each policy offers different TLS protocol versions and cipher suites. These predefined policies are configured keeping in mind the best practices and recommendations from the Microsoft Security team. We recommend that you use the newest TLS policies to ensure the best TLS security.

The following table shows the list of cipher suites and minimum protocol version support for each predefined policy. The ordering of the cipher suites determines the priority order during TLS negotiation. To know the exact ordering of the cipher suites for these predefined policies.

| Predefined policy names | 2023-06  | 2023-06-S |
| ---------- | ---------- | ---------- |
| **Minimum protocol version** | TLS 1.2 | TLS 1.2 |
| **Enabled protocol versions** | TLS 1.2 | TLS 1.2 |
| TLS_AES_256_GCM_SHA384 | &check; | &check; |
| TLS_AES_128_GCM_SHA256 | &check; | &check; |
| TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384	| &check;	| &check; |
| TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256	| &check;	| &check; |
| TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384	| &check;	| &check; |
| TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256	| &check;	| &check; |
| TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA384	| &check;	| &cross; |
| TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256	| &check;	| &cross; |
| TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384	| &check;	| &cross; |
| TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256 | &check; | &cross; |
| **Elliptical curves** | | |
| P-384 | &check; | &check; |
| P-256 | &check; | &check; |

Protocol versions, ciphers, and elliptical curves not specified in the table above aren't supported and won't be negotiated.

### Default TLS policy

When no TLS Policy is specified within your Kubernetes configuration, **predefined policy 2023-06** will be applied.

## How to configure a TLS policy

# [Gateway API](#tab/tls-policy-gateway-api)

TLS policy can be defined in a [FrontendTLSPolicy](api-specification-kubernetes.md#alb.networking.azure.io/v1.FrontendTLSPolicy) resource, which targets defined gateway listeners.  Specify a policyType of type `predefinned` and use choose either predefined policy name: `2023-06` or `2023-06-S`

Example command to create a new FrontendTLSPolicy resource with the predefined TLS policy 2023-06-S.

```bash
kubectl apply -f - <<EOF
apiVersion: alb.networking.azure.io/v1
kind: FrontendTLSPolicy
metadata:
  name: policy-default
  namespace: test-infra
spec:
  targetRef:
    kind: Gateway
    name: target-01
    namespace: test-infra
    sectionNames:
    - https-listener
    group : gateway.networking.k8s.io
  default:
    policyType:
      type: predefined
      name: 2023-06-S
EOF
```

# [Ingress API](#tab/tls-policy-ingress-api)

TLS policy is currently not supported for Ingress resources and will automatically be configured to use the default TLS policy `2023-06`.

---
