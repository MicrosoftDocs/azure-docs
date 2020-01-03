---
title: Enable cookie based affinity with Application Gateway
description: This article provides information on how to enable cookie-based affinity with an Application Gateway. 
services: application-gateway
author: caya
ms.service: application-gateway
ms.topic: article
ms.date: 11/4/2019
ms.author: caya
---

# Enable Cookie based affinity with an Application Gateway
As outlined in the [Azure Application Gateway Documentation](https://docs.microsoft.com/azure/application-gateway/application-gateway-components#http-settings), Application Gateway supports cookie based affinity, which means it can direct subsequent traffic from a user session to the same server for processing.

## Example
```yaml
apiVersion: extensions/v1beta1
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
