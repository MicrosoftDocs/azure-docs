---
title: Enable cookie-based affinity with Application Gateway
description: This article provides information on how to enable cookie-based affinity with Application Gateway. 
services: application-gateway
author: greg-lindsay
ms.service: azure-application-gateway
ms.topic: how-to
ms.date: 9/17/2024
ms.author: greglin
---

# Enable cookie-based affinity with Application Gateway

As outlined in the [Azure Application Gateway documentation](./application-gateway-components.md#http-settings), Application Gateway supports cookie-based affinity. This support means that the service can direct subsequent traffic from a user session to the same server for processing.

> [!TIP]
> Consider [Application Gateway for Containers](for-containers/overview.md) for your Kubernetes ingress solution. For more information, see [Application Gateway for Containers session affinity overview](for-containers/session-affinity.md).

## Example

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: guestbook
  annotations:
    kubernetes.io/ingress.class: azure/application-gateway
    appgw.ingress.kubernetes.io/cookie-based-affinity: "true"
spec:
  rules:
  - http:
      paths:
      - backend:
          serviceName: frontend
          servicePort: 80
```

## Related content

- [Application Gateway for Containers](for-containers/overview.md)
